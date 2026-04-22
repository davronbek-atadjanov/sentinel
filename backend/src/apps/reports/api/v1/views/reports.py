from django.db.models import Count, Q
from django.http import FileResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.reports.api.v1.serializers.reports import ReportCreateSerializer, ReportSerializer
from apps.reports.models.reports import Report
from apps.shared.pagination.custom import CustomPagination


class ReportViewSet(ModelViewSet):
    serializer_class = ReportSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    search_fields = ("title",)
    ordering_fields = ("created_at", "report_type", "status")
    filterset_fields = ("report_type", "status")
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user).select_related("user", "scan")

    def get_serializer_class(self):
        if self.action == "create":
            return ReportCreateSerializer
        return ReportSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save()

        from apps.reports.tasks import generate_report_sync

        try:
            generate_report_sync(report)
        except Exception:
            return Response(
                {"success": False, "message": "Report generation failed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return FileResponse(
            report.file.open("rb"),
            as_attachment=True,
            filename=f"{report.title}.pdf",
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"], url_path="download")
    def download(self, request, pk=None):
        report = self.get_object()
        if not report.file:
            return Response(
                {"success": False, "message": "Report file not yet generated."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return FileResponse(
            report.file.open("rb"),
            as_attachment=True,
            filename=f"{report.title}.pdf",
        )

    @action(detail=False, methods=["get"], url_path="compliance")
    def compliance(self, request):
        qs = self.get_queryset()
        total = qs.count()
        by_type = qs.values("report_type").annotate(count=Count("id"))
        by_status = qs.values("status").annotate(count=Count("id"))

        # Calculate compliance score from vulnerability data
        from apps.vulnerabilities.models.vulnerabilities import Vulnerability

        vulns_qs = Vulnerability.objects.filter(scan__user=request.user)
        total_vulns = vulns_qs.count()
        resolved = vulns_qs.filter(status="RESOLVED").count()
        compliance_score = round((resolved / total_vulns * 100), 1) if total_vulns > 0 else 100.0

        return Response(
            {
                "success": True,
                "data": {
                    "total_reports": total,
                    "by_type": {item["report_type"]: item["count"] for item in by_type},
                    "by_status": {item["status"]: item["count"] for item in by_status},
                    "compliance_score": compliance_score,
                },
            }
        )
