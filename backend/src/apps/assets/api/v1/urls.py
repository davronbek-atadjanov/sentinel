from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.assets.api.v1.views.assets import AssetViewSet

router = DefaultRouter()
router.register("", AssetViewSet, basename="assets")

urlpatterns = [
    path("", include(router.urls)),
]
