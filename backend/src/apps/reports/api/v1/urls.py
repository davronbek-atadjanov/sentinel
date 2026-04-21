from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.reports.api.v1.views.reports import ReportViewSet

router = DefaultRouter()
router.register("", ReportViewSet, basename="reports")

urlpatterns = [
    path("", include(router.urls)),
]
