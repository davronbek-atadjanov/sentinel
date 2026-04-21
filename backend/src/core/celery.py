import os

from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()

app.conf.beat_schedule = {
    "process-scheduled-scans": {
        "task": "apps.scans.tasks.process_scheduled_scans",
        "schedule": crontab(minute="*/15"),  # Har 15 daqiqada
    },
}
