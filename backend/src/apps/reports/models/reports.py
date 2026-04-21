from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.shared.models.base import AbstractBaseModel


class ReportTypeChoices(models.TextChoices):
    EXECUTIVE = "EXECUTIVE", _("Executive Summary")
    TECHNICAL = "TECHNICAL", _("Technical Report")
    COMPLIANCE = "COMPLIANCE", _("Compliance Report")


class ReportStatusChoices(models.TextChoices):
    PENDING = "PENDING", _("Pending")
    GENERATING = "GENERATING", _("Generating")
    COMPLETED = "COMPLETED", _("Completed")
    FAILED = "FAILED", _("Failed")


class Report(AbstractBaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports",
        verbose_name=_("User"),
    )
    title = models.CharField(
        max_length=255,
        verbose_name=_("Title"),
    )
    report_type = models.CharField(
        max_length=20,
        choices=ReportTypeChoices.choices,
        default=ReportTypeChoices.TECHNICAL,
        verbose_name=_("Report Type"),
    )
    status = models.CharField(
        max_length=20,
        choices=ReportStatusChoices.choices,
        default=ReportStatusChoices.PENDING,
        verbose_name=_("Status"),
    )
    scan = models.ForeignKey(
        "scans.Scan",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports",
        verbose_name=_("Scan"),
    )
    data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Report Data"),
    )
    file = models.FileField(
        upload_to="reports/",
        null=True,
        blank=True,
        verbose_name=_("File"),
    )
    generated_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Generated At"),
    )

    class Meta:
        verbose_name = _("Report")
        verbose_name_plural = _("Reports")
        ordering = ["-created_at"]
        db_table = "reports"

    def __str__(self) -> str:
        return f"[{self.report_type}] {self.title}"
