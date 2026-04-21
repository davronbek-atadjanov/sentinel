from django.contrib import admin
from unfold.admin import ModelAdmin

from apps.reports.models.reports import Report


@admin.register(Report)
class ReportAdmin(ModelAdmin):
    list_display = ("id", "title", "report_type", "status", "user", "generated_at", "created_at")
    list_filter = ("report_type", "status", "created_at")
    search_fields = ("title", "user__email")
    list_per_page = 20
    ordering = ("-created_at",)
    readonly_fields = ("generated_at", "data", "created_at", "updated_at")
