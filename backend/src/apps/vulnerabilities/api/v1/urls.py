from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.vulnerabilities.api.v1.views.vulns import VulnerabilityViewSet

router = DefaultRouter()
router.register("", VulnerabilityViewSet, basename="vulnerabilities")

urlpatterns = [
    path("", include(router.urls)),
]
