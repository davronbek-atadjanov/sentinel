from django.conf import settings
from django.db import models
from apps.shared.models.base import AbstractBaseModel

class Notification(AbstractBaseModel):
    LEVEL_CHOICES = (
        ("CRITICAL", "Critical"),
        ("WARNING", "Warning"),
        ("INFO", "Info"),
        ("SYSTEM", "System"),
        ("SUCCESS", "Success"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="INFO")
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # meta_data for storing specific IDs like scan_id or vuln_id
    meta_data = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.level} - {self.title} ({self.user.email})"
