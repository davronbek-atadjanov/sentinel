from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.scans.models.scans import Scan
from apps.vulnerabilities.models.vulnerabilities import Vulnerability
from apps.notifications.models.notifications import Notification

@receiver(post_save, sender=Scan)
def scan_status_notification(sender, instance, created, **kwargs):
    if not created and instance.status == "COMPLETED":
        # check if notification already generated for this scan completion
        exists = Notification.objects.filter(
            user=instance.user,
            level="SUCCESS",
            meta_data__scan_id=instance.id,
            title__contains="Scan Completed"
        ).exists()
        
        if not exists:
            Notification.objects.create(
                user=instance.user,
                level="SUCCESS",
                title=f"Scan Completed: {instance.target.domain if instance.target else 'Target'}",
                description=f"Scan {instance.name} has finished successfully.",
                meta_data={"scan_id": instance.id}
            )

@receiver(post_save, sender=Vulnerability)
def critical_vuln_notification(sender, instance, created, **kwargs):
    if created and instance.severity == "CRITICAL":
        Notification.objects.create(
            user=instance.scan.user if instance.scan else None,
            level="CRITICAL",
            title=f"Critical Vulnerability Detected: {instance.title}",
            description=f"A high-risk vulnerability was found on {instance.scan_target}. Immediate remediation required.",
            meta_data={"vuln_id": instance.id, "scan_id": instance.scan.id if instance.scan else None}
        )
