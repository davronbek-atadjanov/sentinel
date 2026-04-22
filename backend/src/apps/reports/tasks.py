import io
import logging

from celery import shared_task
from django.core.files.base import ContentFile
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

logger = logging.getLogger(__name__)


def _generate_report_for_instance(report):
    from apps.reports.models.reports import ReportStatusChoices

    report.status = ReportStatusChoices.GENERATING
    report.save(update_fields=["status"])

    report_data = _collect_report_data(report)
    report.data = report_data

    pdf_buffer = _generate_pdf(report, report_data)
    filename = f"sentinel_report_{report.id}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    report.file.save(filename, ContentFile(pdf_buffer.getvalue()), save=False)

    report.status = ReportStatusChoices.COMPLETED
    report.generated_at = timezone.now()
    report.save()

    return report


def generate_report_sync(report):
    from apps.reports.models.reports import ReportStatusChoices

    try:
        return _generate_report_for_instance(report)
    except Exception as e:
        logger.error(f"Report {report.id} generation failed: {e}")
        report.status = ReportStatusChoices.FAILED
        report.data = {"error": str(e)}
        report.save(update_fields=["status", "data"])
        raise


@shared_task(bind=True, max_retries=2)
def generate_report(self, report_id: int):
    """Generate a PDF report from scan data."""
    from apps.reports.models.reports import Report, ReportStatusChoices

    try:
        report = Report.objects.select_related("scan", "user").get(id=report_id)
        _generate_report_for_instance(report)

        logger.info(f"Report {report_id} generated successfully.")

    except Exception as e:
        logger.error(f"Report {report_id} generation failed: {e}")
        try:
            report = Report.objects.get(id=report_id)
            report.status = ReportStatusChoices.FAILED
            report.data = {"error": str(e)}
            report.save(update_fields=["status", "data"])
        except Report.DoesNotExist:
            pass
        raise self.retry(exc=e, countdown=60)


def _collect_report_data(report) -> dict:
    """Collect data for the report based on scan results."""
    data = {
        "title": report.title,
        "report_type": report.report_type,
        "generated_by": report.user.email,
        "generated_at": timezone.now().isoformat(),
    }

    if report.scan:
        data["scan"] = {
            "id": report.scan.id,
            "target_url": report.scan.target_url,
            "scan_type": report.scan.scan_type,
            "status": report.scan.status,
            "started_at": str(report.scan.started_at) if report.scan.started_at else None,
            "completed_at": str(report.scan.completed_at) if report.scan.completed_at else None,
            "results_summary": report.scan.results_summary,
        }

        # Get vulnerabilities for this scan
        from apps.vulnerabilities.models.vulnerabilities import Vulnerability

        vulns = Vulnerability.objects.filter(scan=report.scan)
        data["vulnerabilities"] = {
            "total": vulns.count(),
            "critical": vulns.filter(severity="CRITICAL").count(),
            "high": vulns.filter(severity="HIGH").count(),
            "medium": vulns.filter(severity="MEDIUM").count(),
            "low": vulns.filter(severity="LOW").count(),
            "info": vulns.filter(severity="INFO").count(),
            "details": list(
                vulns.values(
                    "title",
                    "severity",
                    "status",
                    "category",
                    "affected_url",
                    "remediation",
                )[:50]
            ),
        }
    else:
        # General report — all user data
        from apps.scans.models.scans import Scan
        from apps.vulnerabilities.models.vulnerabilities import Vulnerability

        user_scans = Scan.objects.filter(user=report.user)
        user_vulns = Vulnerability.objects.filter(scan__user=report.user)

        data["summary"] = {
            "total_scans": user_scans.count(),
            "completed_scans": user_scans.filter(status="COMPLETED").count(),
            "total_vulnerabilities": user_vulns.count(),
            "open_vulnerabilities": user_vulns.filter(status="OPEN").count(),
            "resolved_vulnerabilities": user_vulns.filter(status="RESOLVED").count(),
        }

    return data


def _generate_pdf(report, data: dict) -> io.BytesIO:
    """Generate PDF document using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Title"],
        fontSize=24,
        spaceAfter=20,
        textColor=colors.HexColor("#1a1a2e"),
    )
    elements.append(Paragraph("Sentinel xavfsizlik hisoboti", title_style))
    elements.append(Paragraph(f"<i>{report.title}</i>", styles["Heading2"]))
    elements.append(Spacer(1, 10 * mm))

    # Meta info
    meta_data = [
        ["Hisobot turi:", report.get_report_type_display()],
        ["Tuzuvchi:", data.get("generated_by", "N/A")],
        ["Yaratilgan sana:", data.get("generated_at", "N/A")],
    ]
    if data.get("scan"):
        meta_data.append(["Maqsad URL:", data["scan"].get("target_url", "N/A")])
        meta_data.append(["Skan turi:", data["scan"].get("scan_type", "N/A")])

    meta_table = Table(meta_data, colWidths=[120, 350])
    meta_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#333333")),
            ]
        )
    )
    elements.append(meta_table)
    elements.append(Spacer(1, 10 * mm))

    # Vulnerabilities summary
    vulns = data.get("vulnerabilities", data.get("summary", {}))
    if vulns:
        elements.append(Paragraph("Zaifliklar xulosasi", styles["Heading2"]))
        elements.append(Spacer(1, 5 * mm))

        severity_colors = {
            "critical": colors.HexColor("#dc2626"),
            "high": colors.HexColor("#ea580c"),
            "medium": colors.HexColor("#d97706"),
            "low": colors.HexColor("#2563eb"),
            "info": colors.HexColor("#6b7280"),
        }

        summary_data = [["Jiddiylik", "Soni"]]
        for sev in ["critical", "high", "medium", "low", "info"]:
            count = vulns.get(sev, 0)
            if count > 0:
                summary_data.append([sev.upper(), str(count)])

        if len(summary_data) > 1:
            summary_table = Table(summary_data, colWidths=[200, 100])
            summary_table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a1a2e")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                        ("ALIGN", (1, 0), (1, -1), "CENTER"),
                    ]
                )
            )
            elements.append(summary_table)

    # Vulnerability details
    vuln_details = vulns.get("details", [])
    if vuln_details:
        elements.append(Spacer(1, 10 * mm))
        elements.append(Paragraph("Zaifliklar tafsilotlari", styles["Heading2"]))
        elements.append(Spacer(1, 5 * mm))

        for i, vuln in enumerate(vuln_details[:20], 1):
            elements.append(
                Paragraph(
                    f"<b>{i}. [{vuln.get('severity', 'N/A')}] {vuln.get('title', 'Unknown')}</b>",
                    styles["Normal"],
                )
            )
            if vuln.get("affected_url"):
                elements.append(Paragraph(f"&nbsp;&nbsp;URL: {vuln['affected_url']}", styles["Normal"]))
            if vuln.get("remediation"):
                elements.append(Paragraph(f"&nbsp;&nbsp;Tuzatish: {vuln['remediation']}", styles["Normal"]))
            elements.append(Spacer(1, 3 * mm))

    doc.build(elements)
    return buffer
