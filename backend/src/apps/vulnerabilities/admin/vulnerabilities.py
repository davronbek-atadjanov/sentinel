from django.contrib import admin
from unfold.admin import ModelAdmin

from apps.vulnerabilities.models.vulnerabilities import Vulnerability


@admin.register(Vulnerability)
class VulnerabilityAdmin(ModelAdmin):
    list_display = ("id", "title", "severity", "status", "category", "cvss_score", "created_at")
    list_filter = ("severity", "status", "category", "created_at")
    search_fields = ("title", "description", "cve_id", "affected_url")
    list_per_page = 20
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("status",)
