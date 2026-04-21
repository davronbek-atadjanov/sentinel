from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.integrations.api.v1.views.integrations import WebhookViewSet, ExternalIntegrationViewSet

router = DefaultRouter()
router.register(r"webhooks", WebhookViewSet, basename="webhooks")
router.register(r"apps", ExternalIntegrationViewSet, basename="apps")

urlpatterns = [
    path("", include(router.urls)),
]
