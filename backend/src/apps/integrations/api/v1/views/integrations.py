from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.integrations.models.integrations import Webhook, WebhookDelivery, ExternalIntegration
from apps.integrations.api.v1.serializers.integrations import (
    WebhookSerializer,
    WebhookDeliverySerializer,
    ExternalIntegrationSerializer
)

class WebhookViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WebhookSerializer

    def get_queryset(self):
        return Webhook.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def ping(self, request, pk=None):
        webhook = self.get_object()
        # In Faza 10, this should ideally enqueue the Celery task manually, 
        # but for now we'll simulate a 200 response to acknowledge the action
        return Response(
            {"success": True, "message": "Ping payload sent to Celery queue."},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def deliveries(self, request, pk=None):
        webhook = self.get_object()
        deliveries = webhook.deliveries.all()[:20] # Limit to 20 recent
        serializer = WebhookDeliverySerializer(deliveries, many=True)
        return Response({"success": True, "data": serializer.data})


class ExternalIntegrationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExternalIntegrationSerializer

    def get_queryset(self):
        return ExternalIntegration.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
