from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.shared.models.base import AbstractBaseModel


class AssetTypeChoices(models.TextChoices):
    WEB_APP = "WEB_APP", _("Web Application")
    API = "API", _("API")
    MOBILE = "MOBILE", _("Mobile")
    NETWORK = "NETWORK", _("Network")


class Asset(AbstractBaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assets",
        verbose_name=_("User"),
    )
    name = models.CharField(
        max_length=255,
        verbose_name=_("Name"),
    )
    url = models.URLField(
        max_length=500,
        verbose_name=_("URL"),
    )
    asset_type = models.CharField(
        max_length=20,
        choices=AssetTypeChoices.choices,
        default=AssetTypeChoices.WEB_APP,
        verbose_name=_("Asset Type"),
        db_index=True,
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Active"),
    )
    last_scan = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Last Scan"),
    )
    risk_score = models.FloatField(
        default=0.0,
        verbose_name=_("Risk Score"),
    )
    technologies = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("Technologies"),
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Metadata"),
    )

    class Meta:
        verbose_name = _("Asset")
        verbose_name_plural = _("Assets")
        ordering = ["-created_at"]
        db_table = "assets"

    def __str__(self) -> str:
        return f"{self.name} ({self.url})"
