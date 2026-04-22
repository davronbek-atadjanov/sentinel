import logging
from urllib.parse import urlparse

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2)
def run_scan(self, scan_id: int):
    """
    Master skan task — scan_type ga qarab tegishli skanerlarni ishlatadi.
    Progress real-time yangilanadi (0 → 100%).

    Suported config parameters:
    - auth: dict with username, password, login_url
    - advanced: dict with depth, parallelism, force_https, follow_redirects
    - schedule: dict with frequency, start_time, end_time (stored but not executed here)
    """
    from apps.scans.models.scans import Scan, ScanStatusChoices

    try:
        scan = Scan.objects.get(id=scan_id)
    except Scan.DoesNotExist:
        logger.error(f"Scan {scan_id} not found.")
        return

    scan.status = ScanStatusChoices.RUNNING
    scan.started_at = timezone.now()
    scan.save(update_fields=["status", "started_at"])

    try:
        all_findings = []
        target = scan.target_url
        parsed = urlparse(target)
        hostname = parsed.hostname

        # Extract config parameters
        config = scan.config or {}
        advanced_config = config.get("advanced", {})
        auth_config = config.get("auth", {})
        custom_modules = config.get("custom_modules", {}) if scan.scan_type == "CUSTOM" else {}

        # Build scanner config dict from extracted parameters
        scanner_config = {
            "auth": auth_config,
            "force_https": advanced_config.get("force_https", False),
            "follow_redirects": advanced_config.get("follow_redirects", True),
            "depth": advanced_config.get("depth", 10),
            "parallelism": advanced_config.get("parallelism", 25),
        }

        # Determine which modules to run based on scan type and custom profile
        def should_run_module(module_name: str) -> bool:
            if scan.scan_type == "CUSTOM":
                return custom_modules.get(module_name, False)
            elif scan.scan_type == "QUICK":
                return module_name in ["headerAnalysis", "xssScan", "sqliScan"]
            elif scan.scan_type == "FULL":
                return True  # Run all modules
            elif scan.scan_type in ("OWASP", "API"):
                return module_name in ["headerAnalysis", "sslCheck", "portScan", "xssScan", "sqliScan", "nucleiScan"]
            return False

        # ── Stage 1: Header Analysis (10%) ──
        if should_run_module("headerAnalysis"):
            scan.progress = 5
            scan.save(update_fields=["progress"])
            try:
                from apps.scans.services.custom_scanners.header_analyzer import HeaderAnalyzer

                header_scanner = HeaderAnalyzer()
                findings = header_scanner.scan(target, config=scanner_config)
                all_findings.extend(findings)
                logger.info(f"Scan {scan_id}: Header analysis found {len(findings)} issues.")
            except Exception as e:
                logger.warning(f"Scan {scan_id}: Header analysis failed: {e}")
        scan.progress = 10
        scan.save(update_fields=["progress"])

        # ── Stage 2: SSL Check (20%) ──
        if should_run_module("sslCheck") and hostname:
            try:
                from apps.scans.services.custom_scanners.ssl_checker import SSLChecker

                ssl_checker = SSLChecker()
                findings = ssl_checker.scan(hostname)
                all_findings.extend(findings)
                logger.info(f"Scan {scan_id}: SSL check found {len(findings)} issues.")
            except Exception as e:
                logger.warning(f"Scan {scan_id}: SSL check failed: {e}")
        scan.progress = 20
        scan.save(update_fields=["progress"])

        # ── Stage 3: Port Scan (30%) — FULL va OWASP uchun ──
        if should_run_module("portScan") and hostname:
            try:
                from apps.scans.services.custom_scanners.port_scanner import PortScanner

                port_scanner = PortScanner()
                findings = port_scanner.scan(hostname)
                all_findings.extend(findings)
                logger.info(f"Scan {scan_id}: Port scan found {len(findings)} open ports.")
            except Exception as e:
                logger.warning(f"Scan {scan_id}: Port scan failed: {e}")
        scan.progress = 30
        scan.save(update_fields=["progress"])

        # ── Stage 4: XSS + SQLi Scan (50%) ──
        if should_run_module("xssScan") or should_run_module("sqliScan"):
            if should_run_module("xssScan"):
                try:
                    from apps.scans.services.custom_scanners.xss_scanner import XSSScanner

                    xss_scanner = XSSScanner()
                    findings = xss_scanner.scan(target, config=scanner_config)
                    all_findings.extend(findings)
                    logger.info(f"Scan {scan_id}: XSS scan found {len(findings)} issues.")
                except Exception as e:
                    logger.warning(f"Scan {scan_id}: XSS scan failed: {e}")

            scan.progress = 40
            scan.save(update_fields=["progress"])

            if should_run_module("sqliScan"):
                try:
                    from apps.scans.services.custom_scanners.sqli_scanner import SQLiScanner

                    sqli_scanner = SQLiScanner()
                    findings = sqli_scanner.scan(target, config=scanner_config)
                    all_findings.extend(findings)
                    logger.info(f"Scan {scan_id}: SQLi scan found {len(findings)} issues.")
                except Exception as e:
                    logger.warning(f"Scan {scan_id}: SQLi scan failed: {e}")
        scan.progress = 50
        scan.save(update_fields=["progress"])

        # ── Stage 5: Nuclei Scan (70%) ──
        if should_run_module("nucleiScan"):
            try:
                from apps.scans.services.nuclei_scanner import NucleiScanner

                nuclei = NucleiScanner()
                results = nuclei.run_scan(target)
                for r in results:
                    all_findings.append(nuclei.parse_result(r))
                logger.info(f"Scan {scan_id}: Nuclei found {len(results)} issues.")
            except Exception as e:
                logger.warning(f"Scan {scan_id}: Nuclei scan failed: {e}")
        scan.progress = 70
        scan.save(update_fields=["progress"])

        # ── Stage 6: ZAP Scan (90%) — faqat FULL skan uchun ──
        if should_run_module("zapScan"):
            try:
                from apps.scans.services.zap_scanner import ZAPScanner

                zap = ZAPScanner()

                # Spider scan
                spider_id = zap.spider_scan(target)
                zap.wait_for_spider(spider_id)
                scan.progress = 80
                scan.save(update_fields=["progress"])

                # Active scan
                active_id = zap.active_scan(target)
                zap.wait_for_active_scan(active_id)

                # Get alerts
                alerts = zap.get_alerts(target)
                for alert in alerts:
                    all_findings.append(zap.map_alert_to_vulnerability(alert))
                logger.info(f"Scan {scan_id}: ZAP found {len(alerts)} alerts.")
            except Exception as e:
                logger.warning(f"Scan {scan_id}: ZAP scan failed: {e}")
        scan.progress = 90
        scan.save(update_fields=["progress"])

        # ── Stage 7: Natijalarni DB ga yozish (100%) ──
        from apps.vulnerabilities.models.vulnerabilities import Vulnerability

        for finding in all_findings:
            try:
                Vulnerability.objects.create(
                    scan=scan,
                    title=finding.get("title", "Unknown")[:500],
                    description=finding.get("description", ""),
                    severity=finding.get("severity", "INFO"),
                    category=finding.get("category", "MISC")[:100],
                    affected_url=finding.get("affected_url", target)[:1000],
                    evidence=finding.get("evidence", ""),
                    remediation=finding.get("remediation", ""),
                    cvss_score=finding.get("cvss_score"),
                    cve_id=finding.get("cve_id", "")[:100],
                    status="OPEN",
                )
            except Exception as e:
                logger.error(f"Scan {scan_id}: Failed to save finding: {e}")

        scan.status = ScanStatusChoices.COMPLETED
        scan.progress = 100
        scan.completed_at = timezone.now()
        scan.results_summary = {
            "total": len(all_findings),
            "critical": sum(1 for f in all_findings if f.get("severity") == "CRITICAL"),
            "high": sum(1 for f in all_findings if f.get("severity") == "HIGH"),
            "medium": sum(1 for f in all_findings if f.get("severity") == "MEDIUM"),
            "low": sum(1 for f in all_findings if f.get("severity") == "LOW"),
            "info": sum(1 for f in all_findings if f.get("severity") == "INFO"),
        }
        scan.save()
        logger.info(f"Scan {scan_id} completed. Total findings: {len(all_findings)}")

    except Exception as e:
        logger.error(f"Scan {scan_id} failed: {e}")
        scan.status = ScanStatusChoices.FAILED
        scan.results_summary = {"error": str(e)}
        scan.completed_at = timezone.now()
        scan.save(update_fields=["status", "results_summary", "completed_at"])
        raise self.retry(exc=e, countdown=60)


@shared_task
def process_scheduled_scans():
    """Rejalashtirilgan skanlarni tekshirish va ishga tushirish."""
    from apps.scans.models.scans import Scan, ScanSchedule, ScanStatusChoices

    now = timezone.now()
    due_schedules = ScanSchedule.objects.filter(
        is_active=True,
        next_run__lte=now,
    )

    for schedule in due_schedules:
        # Create new scan
        scan = Scan.objects.create(
            user=schedule.user,
            target_url=schedule.target_url,
            scan_type=schedule.scan_type,
            status=ScanStatusChoices.PENDING,
        )
        # Trigger async scan
        run_scan.delay(scan.id)

        # Update next_run
        from dateutil.relativedelta import relativedelta

        if schedule.frequency == "DAILY":
            schedule.next_run = now + timezone.timedelta(days=1)
        elif schedule.frequency == "WEEKLY":
            schedule.next_run = now + timezone.timedelta(weeks=1)
        elif schedule.frequency == "MONTHLY":
            schedule.next_run = now + timezone.timedelta(days=30)
        schedule.save(update_fields=["next_run"])

        logger.info(f"Scheduled scan {scan.id} created for {schedule.target_url}")
