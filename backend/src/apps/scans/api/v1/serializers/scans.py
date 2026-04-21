from rest_framework import serializers

from apps.scans.models.scans import Scan


class ScanSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = (
            "id", "user", "user_email", "target_url", "scan_type", "status",
            "started_at", "completed_at", "progress", "config",
            "results_summary", "duration", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "user", "user_email", "status", "started_at",
            "completed_at", "progress", "results_summary", "duration",
            "created_at", "updated_at",
        )

    def get_duration(self, obj: Scan) -> str | None:
        if obj.started_at and obj.completed_at:
            delta = obj.completed_at - obj.started_at
            return str(delta).split(".")[0]
        return None


class ScanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ("target_url", "scan_type", "config")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
