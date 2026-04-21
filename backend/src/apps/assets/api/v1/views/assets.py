from django.db.models import Avg, Count, Q
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.assets.api.v1.serializers.assets import AssetSerializer
from apps.assets.models.assets import Asset
from apps.shared.pagination.custom import CustomPagination


class AssetViewSet(ModelViewSet):
    serializer_class = AssetSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    search_fields = ("name", "url")
    ordering_fields = ("name", "risk_score", "last_scan", "created_at")
    filterset_fields = ("asset_type", "is_active")

    def get_queryset(self):
        return Asset.objects.filter(user=self.request.user).select_related("user")

    @action(detail=True, methods=["get"], url_path="history")
    def history(self, request, pk=None):
        asset = self.get_object()
        from apps.scans.models.scans import Scan

        scans = (
            Scan.objects.filter(target_url=asset.url, user=request.user)
            .order_by("-created_at")
            .values(
                "id",
                "scan_type",
                "status",
                "progress",
                "started_at",
                "completed_at",
                "results_summary",
                "created_at",
            )[:20]
        )
        return Response(
            {
                "success": True,
                "data": {
                    "asset_id": asset.id,
                    "asset_name": asset.name,
                    "scans": list(scans),
                },
            }
        )

    @action(detail=False, methods=["get"], url_path="attack-surface")
    def attack_surface(self, request):
        qs = self.get_queryset()
        total_assets = qs.count()
        active_assets = qs.filter(is_active=True).count()
        by_type = qs.values("asset_type").annotate(count=Count("id"))
        avg_risk = qs.aggregate(avg_risk=Avg("risk_score"))["avg_risk"] or 0.0
        high_risk = qs.filter(risk_score__gte=7.0).count()

        from apps.vulnerabilities.models.vulnerabilities import Vulnerability

        total_vulns = Vulnerability.objects.filter(scan__user=request.user, status="OPEN").count()

        return Response(
            {
                "success": True,
                "data": {
                    "total_assets": total_assets,
                    "active_assets": active_assets,
                    "by_type": {item["asset_type"]: item["count"] for item in by_type},
                    "avg_risk_score": round(avg_risk, 2),
                    "high_risk_assets": high_risk,
                    "open_vulnerabilities": total_vulns,
                },
            }
        )
