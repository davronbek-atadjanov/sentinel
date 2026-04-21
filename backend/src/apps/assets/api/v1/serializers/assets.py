from rest_framework import serializers

from apps.assets.models.assets import Asset


class AssetSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    scan_count = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = (
            "id", "user", "user_email", "name", "url", "asset_type",
            "is_active", "last_scan", "risk_score", "technologies",
            "metadata", "scan_count", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "user", "user_email", "last_scan", "risk_score",
            "scan_count", "created_at", "updated_at",
        )

    def get_scan_count(self, obj: Asset) -> int:
        from apps.scans.models.scans import Scan
        return Scan.objects.filter(target_url=obj.url, user=obj.user).count()

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
