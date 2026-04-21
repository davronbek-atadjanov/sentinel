import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Webhook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="webhooks")
    name = models.CharField(max_length=255)
    url = models.URLField()
    secret_key = models.CharField(max_length=128, default=uuid.uuid4)
    # Storing events as JSON Array: ["Scan.Finished", "Vulnerability.Critical"]
    events = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "webhooks"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.url})"


class WebhookDelivery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    webhook = models.ForeignKey(Webhook, on_delete=models.CASCADE, related_name="deliveries")
    event_type = models.CharField(max_length=100)
    request_payload = models.JSONField()
    response_status_code = models.IntegerField(null=True, blank=True)
    response_body = models.TextField(null=True, blank=True)
    duration_ms = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "webhook_deliveries"
        ordering = ["-created_at"]


class ExternalIntegration(models.Model):
    PROVIDER_CHOICES = (
        ("slack", "Slack"),
        ("jira", "Jira"),
        ("github", "GitHub Actions"),
        ("teams", "Microsoft Teams")
    )
    STATUS_CHOICES = (
        ("CONNECTED", "Connected"),
        ("DISCONNECTED", "Disconnected"),
        ("ERROR", "Error")
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="integrations")
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DISCONNECTED")
    credentials = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "external_integrations"
        unique_together = ("user", "provider")
