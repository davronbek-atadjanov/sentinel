from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.notifications.api.v1.views.notifications import NotificationViewSet

router = DefaultRouter()
router.register(r"notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    path("", include(router.urls)),
]
