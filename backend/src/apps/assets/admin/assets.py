from django.contrib import admin
from unfold.admin import ModelAdmin

from apps.assets.models.assets import Asset


@admin.register(Asset)
class AssetAdmin(ModelAdmin):
    list_display = ("id", "name", "url", "asset_type", "is_active", "risk_score", "last_scan")
    list_filter = ("asset_type", "is_active", "created_at")
    search_fields = ("name", "url")
    list_per_page = 20
    ordering = ("-created_at",)
    list_editable = ("is_active",)
