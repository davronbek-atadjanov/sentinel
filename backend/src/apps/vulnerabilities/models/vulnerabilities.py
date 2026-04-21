from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.shared.models.base import AbstractBaseModel


class SeverityChoices(models.TextChoices):
    CRITICAL = "CRITICAL", _("Critical")
    HIGH = "HIGH", _("High")
    MEDIUM = "MEDIUM", _("Medium")
    LOW = "LOW", _("Low")
    INFO = "INFO", _("Informational")


class VulnStatusChoices(models.TextChoices):
    OPEN = "OPEN", _("Open")
    IN_PROGRESS = "IN_PROGRESS", _("In Progress")
    RESOLVED = "RESOLVED", _("Resolved")
    FALSE_POSITIVE = "FALSE_POSITIVE", _("False Positive")


class Vulnerability(AbstractBaseModel):
    scan = models.ForeignKey(
        "scans.Scan",
        on_delete=models.CASCADE,
        related_name="vulnerabilities",
        verbose_name=_("Scan"),
    )
    title = models.CharField(
        max_length=500,
        verbose_name=_("Title"),
    )
    description = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Description"),
    )
    severity = models.CharField(
        max_length=20,
        choices=SeverityChoices.choices,
        default=SeverityChoices.INFO,
        verbose_name=_("Severity"),
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=VulnStatusChoices.choices,
        default=VulnStatusChoices.OPEN,
        verbose_name=_("Status"),
        db_index=True,
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name=_("Category"),
        db_index=True,
    )
    affected_url = models.URLField(
        max_length=1000,
        blank=True,
        default="",
        verbose_name=_("Affected URL"),
    )
    evidence = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Evidence"),
    )
    remediation = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Remediation"),
    )
    cvss_score = models.FloatField(
        null=True,
        blank=True,
        verbose_name=_("CVSS Score"),
    )
    cve_id = models.CharField(
        max_length=100,
        blank=True,
        default="",
        verbose_name=_("CVE ID"),
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_vulnerabilities",
        verbose_name=_("Assigned To"),
    )

    class Meta:
        verbose_name = _("Vulnerability")
        verbose_name_plural = _("Vulnerabilities")
        ordering = ["-created_at"]
        db_table = "vulnerabilities"

    def __str__(self) -> str:
        return f"[{self.severity}] {self.title}"
