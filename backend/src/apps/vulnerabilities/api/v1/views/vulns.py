from django.db.models import Count, Q
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.shared.pagination.custom import CustomPagination
from apps.vulnerabilities.api.v1.filters import VulnerabilityFilter
from apps.vulnerabilities.api.v1.serializers.vulns import (
    VulnerabilitySerializer,
    VulnerabilityUpdateSerializer,
)
from apps.vulnerabilities.models.vulnerabilities import Vulnerability


class VulnerabilityViewSet(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = VulnerabilitySerializer
    pagination_class = CustomPagination
    filterset_class = VulnerabilityFilter
    search_fields = ("title", "description", "category", "cve_id")
    ordering_fields = ("severity", "status", "cvss_score", "created_at")

    def get_queryset(self):
        return (
            Vulnerability.objects.filter(scan__user=self.request.user)
            .select_related("scan", "assigned_to")
        )

    def get_serializer_class(self):
        if self.action in ("partial_update", "update"):
            return VulnerabilityUpdateSerializer
        return VulnerabilitySerializer

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        qs = self.get_queryset()
        total = qs.count()
        by_severity = qs.values("severity").annotate(count=Count("id"))
        by_status = qs.values("status").annotate(count=Count("id"))
        open_count = qs.filter(status="OPEN").count()
        resolved_count = qs.filter(status="RESOLVED").count()

        return Response({
            "success": True,
            "data": {
                "total": total,
                "open": open_count,
                "resolved": resolved_count,
                "by_severity": {item["severity"]: item["count"] for item in by_severity},
                "by_status": {item["status"]: item["count"] for item in by_status},
            },
        })

    @action(detail=False, methods=["get"], url_path="by-category")
    def by_category(self, request):
        qs = self.get_queryset()
        data = (
            qs.values("category")
            .annotate(
                count=Count("id"),
                critical=Count("id", filter=Q(severity="CRITICAL")),
                high=Count("id", filter=Q(severity="HIGH")),
                medium=Count("id", filter=Q(severity="MEDIUM")),
                low=Count("id", filter=Q(severity="LOW")),
            )
            .order_by("-count")
        )
        return Response({"success": True, "data": list(data)})

    @action(detail=False, methods=["get"], url_path="by-severity")
    def by_severity(self, request):
        qs = self.get_queryset()
        data = (
            qs.values("severity")
            .annotate(
                count=Count("id"),
                open=Count("id", filter=Q(status="OPEN")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
            )
            .order_by("-count")
        )
        return Response({"success": True, "data": list(data)})
