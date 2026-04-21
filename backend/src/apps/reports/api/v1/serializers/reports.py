from rest_framework import serializers

from apps.reports.models.reports import Report


class ReportSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    scan_target = serializers.CharField(source="scan.target_url", read_only=True, default=None)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = (
            "id", "user", "user_email", "title", "report_type", "status",
            "scan", "scan_target", "data", "file", "file_url",
            "generated_at", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "user", "user_email", "status", "data", "file",
            "file_url", "generated_at", "created_at", "updated_at",
        )

    def get_file_url(self, obj: Report) -> str | None:
        if obj.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ("title", "report_type", "scan")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
