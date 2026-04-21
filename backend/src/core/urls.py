from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

from apps.shared.views.base import (
    custom_handler400,
    custom_handler403,
    custom_handler404,
    custom_handler500,
)
from core.config.swagger import urlpatterns as swagger_patterns

urlpatterns = (
    [
        path("i18n/", include("django.conf.urls.i18n")),
    ]
    + i18n_patterns(
        path("admin/", admin.site.urls),
    )
    + [
        path("", include("apps.shared.urls")),
        path("api/v1/auth/", include("apps.users.api.v1.urls")),
        path("api/v1/scans/", include("apps.scans.api.v1.urls")),
        path("api/v1/vulnerabilities/", include("apps.vulnerabilities.api.v1.urls")),
        path("api/v1/assets/", include("apps.assets.api.v1.urls")),
        path("api/v1/reports/", include("apps.reports.api.v1.urls")),
        path("api/v1/notifications/", include("apps.notifications.api.v1.urls")),
        path("api/v1/integrations/", include("apps.integrations.api.v1.urls")),
        path("api/v1/dashboard/", include("apps.shared.api.v1.dashboard_urls")),
        path("ckeditor5/", include("django_ckeditor_5.urls")),
        path("rosetta/", include("rosetta.urls")),
        path("", include("django_prometheus.urls")),
        # Media and static files
        re_path(r"static/(?P<path>.*)", serve, {"document_root": settings.STATIC_ROOT}),
        re_path(r"media/(?P<path>.*)", serve, {"document_root": settings.MEDIA_ROOT}),
    ]
)

urlpatterns += swagger_patterns
if not settings.DEBUG:
    handler404 = custom_handler404
    handler500 = custom_handler500
    handler403 = custom_handler403
    handler400 = custom_handler400
