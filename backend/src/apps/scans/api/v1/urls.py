from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.scans.api.v1.views.scans import ScanViewSet
from apps.scans.api.v1.views.schedules import ScheduleViewSet

router = DefaultRouter()
router.register("", ScanViewSet, basename="scans")
router.register("schedules", ScheduleViewSet, basename="scan-schedules")

urlpatterns = [
    path("", include(router.urls)),
]
