from rest_framework import serializers
from apps.integrations.models.integrations import Webhook, WebhookDelivery, ExternalIntegration

class WebhookDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookDelivery
        fields = (
            "id",
            "event_type",
            "request_payload",
            "response_status_code",
            "response_body",
            "duration_ms",
            "created_at",
        )
        read_only_fields = fields


class WebhookSerializer(serializers.ModelSerializer):
    latest_delivery_status = serializers.SerializerMethodField()

    class Meta:
        model = Webhook
        fields = (
            "id",
            "name",
            "url",
            "events",
            "is_active",
            "latest_delivery_status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "latest_delivery_status", "created_at", "updated_at")

    def get_latest_delivery_status(self, obj):
        latest = obj.deliveries.first()
        if not latest:
            return None
        return {
            "status_code": latest.response_status_code,
            "created_at": latest.created_at
        }


class ExternalIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExternalIntegration
        fields = (
            "id",
            "provider",
            "status",
            "metadata",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
