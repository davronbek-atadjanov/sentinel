from django.db.models import Avg, Count, Q
from django.db.models.functions import ExtractWeek
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        from apps.scans.models.scans import Scan, ScanStatusChoices
        from apps.vulnerabilities.models.vulnerabilities import Vulnerability
        from apps.assets.models.assets import Asset
        from apps.reports.models.reports import Report

        # Scan statistics
        user_scans = Scan.objects.filter(user=user)
        total_scans = user_scans.count()
        active_scans = user_scans.filter(
            status__in=[ScanStatusChoices.PENDING, ScanStatusChoices.RUNNING]
        ).count()
        completed_scans = user_scans.filter(status=ScanStatusChoices.COMPLETED).count()

        # Vulnerability statistics
        user_vulns = Vulnerability.objects.filter(scan__user=user)
        total_vulns = user_vulns.count()
        open_vulns = user_vulns.filter(status="OPEN").count()
        resolved_vulns = user_vulns.filter(status="RESOLVED").count()
        critical_count = user_vulns.filter(severity="CRITICAL", status="OPEN").count()
        high_count = user_vulns.filter(severity="HIGH", status="OPEN").count()
        medium_count = user_vulns.filter(severity="MEDIUM", status="OPEN").count()
        low_count = user_vulns.filter(severity="LOW", status="OPEN").count()

        # Security score (100 - penalty for open vulnerabilities)
        penalty = (critical_count * 10) + (high_count * 5) + (medium_count * 2) + (low_count * 1)
        security_score = max(0, min(100, 100 - penalty))

        # Compliance score
        compliance_score = round(
            (resolved_vulns / total_vulns * 100), 1
        ) if total_vulns > 0 else 100.0

        # Asset stats
        total_assets = Asset.objects.filter(user=user).count()

        # Recent activity (last 10 scans)
        recent_scans = list(
            user_scans.order_by("-created_at")[:10].values(
                "id", "target_url", "scan_type", "status", "progress", "created_at",
            )
        )

        # Threat trajectory (last 30 days — vulns by week)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        recent_vulns = (
            user_vulns.filter(created_at__gte=thirty_days_ago)
            .annotate(week=ExtractWeek("created_at"))
            .values("week")
            .annotate(count=Count("id"))
            .order_by("week")
        )

        # Critical Alerts
        critical_alerts = list(
            user_vulns.filter(severity="CRITICAL", status="OPEN").order_by("-created_at")[:3].values(
                "id", "title", "cve_id", "description", "remediation", "affected_url"
            )
        )

        # Severity distribution
        severity_distribution = {
            item["severity"]: item["count"]
            for item in user_vulns.values("severity").annotate(count=Count("id"))
        }

        return Response({
            "success": True,
            "data": {
                "security_score": security_score,
                "compliance_score": compliance_score,
                "total_scans": total_scans,
                "active_scans": active_scans,
                "completed_scans": completed_scans,
                "total_vulnerabilities": total_vulns,
                "open_vulnerabilities": open_vulns,
                "resolved_vulnerabilities": resolved_vulns,
                "critical_count": critical_count,
                "high_count": high_count,
                "medium_count": medium_count,
                "low_count": low_count,
                "total_assets": total_assets,
                "severity_distribution": severity_distribution,
                "recent_activity": recent_scans,
                "threat_trajectory": list(recent_vulns),
                "critical_alerts": critical_alerts,
            },
        })
