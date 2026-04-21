from rest_framework import serializers

from apps.scans.models.scans import ScanSchedule


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanSchedule
        fields = (
            "id", "user", "target_url", "scan_type", "frequency",
            "next_run", "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "user", "created_at", "updated_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
