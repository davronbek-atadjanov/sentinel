from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.scans.models.scans import Scan
from apps.vulnerabilities.models.vulnerabilities import Vulnerability
from apps.integrations.models.integrations import Webhook
from apps.integrations.tasks import deliver_webhook_task
from django.utils import timezone

def generate_scan_payload(scan):
    return {
        "event_id": str(scan.id),
        "event_type": "Scan.Finished",
        "timestamp": timezone.now().isoformat(),
        "data": {
            "scan_id": str(scan.id),
            "name": scan.name,
            "status": scan.status,
            "target": scan.target.domain if scan.target else getattr(scan, "target_url", "Unknown Target"),
            "progress": scan.progress
        }
    }

def generate_vuln_payload(vuln):
    return {
        "event_id": str(vuln.id),
        "event_type": f"Vulnerability.{vuln.severity}",
        "timestamp": timezone.now().isoformat(),
        "data": {
            "vuln_id": str(vuln.id),
            "title": vuln.title,
            "severity": vuln.severity,
            "target": getattr(vuln, "scan_target", "System"),
            "cve_id": vuln.cve_id
        }
    }

@receiver(post_save, sender=Scan)
def hook_scan_completion(sender, instance, created, **kwargs):
    if not created and instance.status == "COMPLETED":
        # find matching webhooks
        webhooks = Webhook.objects.filter(user=instance.user, is_active=True, events__contains="Scan.Finished")
        if webhooks.exists():
            payload = generate_scan_payload(instance)
            for hook in webhooks:
                deliver_webhook_task.delay(hook.id, "Scan.Finished", payload)

@receiver(post_save, sender=Vulnerability)
def hook_critical_vuln(sender, instance, created, **kwargs):
    if created and instance.severity in ["CRITICAL", "HIGH"]:
        event_type = f"Vulnerability.{instance.severity}"
        user = instance.scan.user if instance.scan else None
        if user:
            webhooks = Webhook.objects.filter(user=user, is_active=True, events__contains=event_type)
            if webhooks.exists():
                payload = generate_vuln_payload(instance)
                for hook in webhooks:
                    deliver_webhook_task.delay(hook.id, event_type, payload)
