from django.contrib import admin
from unfold.admin import ModelAdmin

from apps.scans.models.scans import Scan, ScanSchedule


@admin.register(Scan)
class ScanAdmin(ModelAdmin):
    list_display = ("id", "target_url", "scan_type", "status", "progress", "user", "created_at")
    list_filter = ("status", "scan_type", "created_at")
    search_fields = ("target_url", "user__email")
    list_per_page = 20
    ordering = ("-created_at",)
    readonly_fields = ("started_at", "completed_at", "progress", "results_summary")


@admin.register(ScanSchedule)
class ScanScheduleAdmin(ModelAdmin):
    list_display = ("id", "target_url", "scan_type", "frequency", "next_run", "is_active", "user")
    list_filter = ("frequency", "is_active", "scan_type")
    search_fields = ("target_url", "user__email")
    list_per_page = 20
    ordering = ("next_run",)
