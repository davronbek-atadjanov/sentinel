from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.shared.models.base import AbstractBaseModel


class ScanTypeChoices(models.TextChoices):
    FULL = "FULL", _("Full Scan")
    QUICK = "QUICK", _("Quick Scan")
    API = "API", _("API Scan")
    OWASP = "OWASP", _("OWASP Top 10")
    CUSTOM = "CUSTOM", _("Custom Scan")


class ScanStatusChoices(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    RUNNING = "RUNNING", _("Running")
    COMPLETED = "COMPLETED", _("Completed")
    FAILED = "FAILED", _("Failed")
    CANCELLED = "CANCELLED", _("Cancelled")


class Scan(AbstractBaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="scans",
        verbose_name=_("User"),
    )
    target_url = models.URLField(
        max_length=500,
        verbose_name=_("Target URL"),
    )
    scan_type = models.CharField(
        max_length=20,
        choices=ScanTypeChoices.choices,
        default=ScanTypeChoices.FULL,
        verbose_name=_("Scan Type"),
    )
    status = models.CharField(
        max_length=20,
        choices=ScanStatusChoices.choices,
        default=ScanStatusChoices.PENDING,
        verbose_name=_("Status"),
        db_index=True,
    )
    started_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Started At"),
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Completed At"),
    )
    progress = models.IntegerField(
        default=0,
        verbose_name=_("Progress (%)"),
    )
    config = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Configuration"),
    )
    results_summary = models.JSONField(
        null=True,
        blank=True,
        verbose_name=_("Results Summary"),
    )

    class Meta:
        verbose_name = _("Scan")
        verbose_name_plural = _("Scans")
        ordering = ["-created_at"]
        db_table = "scans"

    def __str__(self) -> str:
        return f"[{self.scan_type}] {self.target_url} — {self.status}"


class FrequencyChoices(models.TextChoices):
    DAILY = "DAILY", _("Daily")
    WEEKLY = "WEEKLY", _("Weekly")
    MONTHLY = "MONTHLY", _("Monthly")


class ScanSchedule(AbstractBaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="scan_schedules",
        verbose_name=_("User"),
    )
    target_url = models.URLField(
        max_length=500,
        verbose_name=_("Target URL"),
    )
    scan_type = models.CharField(
        max_length=20,
        choices=ScanTypeChoices.choices,
        default=ScanTypeChoices.FULL,
        verbose_name=_("Scan Type"),
    )
    frequency = models.CharField(
        max_length=20,
        choices=FrequencyChoices.choices,
        default=FrequencyChoices.WEEKLY,
        verbose_name=_("Frequency"),
    )
    next_run = models.DateTimeField(
        verbose_name=_("Next Run"),
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Active"),
    )

    class Meta:
        verbose_name = _("Scan Schedule")
        verbose_name_plural = _("Scan Schedules")
        ordering = ["next_run"]
        db_table = "scan_schedules"

    def __str__(self) -> str:
        return f"[{self.frequency}] {self.target_url}"
