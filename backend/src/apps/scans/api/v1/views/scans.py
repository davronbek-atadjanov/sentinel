from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.scans.api.v1.serializers.scans import ScanCreateSerializer, ScanSerializer
from apps.scans.models.scans import Scan, ScanStatusChoices
from apps.shared.pagination.custom import CustomPagination


class ScanViewSet(ModelViewSet):
    serializer_class = ScanSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    search_fields = ("target_url",)
    ordering_fields = ("created_at", "status", "scan_type")
    filterset_fields = ("status", "scan_type")

    def get_queryset(self):
        return Scan.objects.filter(user=self.request.user).select_related("user")

    def get_serializer_class(self):
        if self.action == "create":
            return ScanCreateSerializer
        return ScanSerializer

    def perform_create(self, serializer):
        scan = serializer.save()
        from apps.scans.tasks import run_scan

        run_scan.delay(scan.id)

    @action(detail=True, methods=["patch"], url_path="cancel")
    def cancel(self, request, pk=None):
        scan = self.get_object()
        if scan.status in (ScanStatusChoices.PENDING, ScanStatusChoices.RUNNING):
            scan.status = ScanStatusChoices.CANCELLED
            scan.completed_at = timezone.now()
            scan.save()
            return Response({"success": True, "message": "Scan cancelled."})
        return Response(
            {"success": False, "message": "Cannot cancel a completed/failed scan."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["get"], url_path="results")
    def results(self, request, pk=None):
        scan = self.get_object()
        vulnerabilities = scan.vulnerabilities.all().values(
            "id",
            "title",
            "severity",
            "status",
            "category",
            "affected_url",
        )
        return Response(
            {
                "success": True,
                "message": "Scan results fetched.",
                "data": {
                    "scan_id": scan.id,
                    "status": scan.status,
                    "progress": scan.progress,
                    "summary": scan.results_summary,
                    "vulnerabilities": list(vulnerabilities),
                },
            }
        )

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        qs = self.get_queryset()
        total = qs.count()
        by_status = qs.values("status").annotate(count=Count("id"))
        by_type = qs.values("scan_type").annotate(count=Count("id"))
        active = qs.filter(status__in=[ScanStatusChoices.PENDING, ScanStatusChoices.RUNNING]).count()

        return Response(
            {
                "success": True,
                "data": {
                    "total_scans": total,
                    "active_scans": active,
                    "by_status": {item["status"]: item["count"] for item in by_status},
                    "by_type": {item["scan_type"]: item["count"] for item in by_type},
                },
            }
        )
