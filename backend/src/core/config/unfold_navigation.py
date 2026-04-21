from typing import TYPE_CHECKING, Any

from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

if TYPE_CHECKING:
    from typing import Protocol

    class AuthUserLike(Protocol):
        is_superuser: bool
        groups: Any


def user_has_group_or_permission(user: "AuthUserLike", permission: str) -> bool:
    if user.is_superuser:
        return True
    if not user.groups.exists():
        return True
    return user.groups.filter(permissions__codename=permission).exists()


PAGES = [
    {
        "seperator": True,
        "items": [
            {
                "title": _("Bosh sahifa"),
                "icon": "home",
                "link": reverse_lazy("admin:index"),
            },
        ],
    },
    {
        "seperator": True,
        "title": _("Foydalanuvchilar"),
        "items": [
            {
                "title": _("Guruhlar"),
                "icon": "person_add",
                "link": reverse_lazy("admin:auth_group_changelist"),
                "permission": lambda request: user_has_group_or_permission(request.user, "view_group"),
            },
            {
                "title": _("Foydalanuvchilar"),
                "icon": "person_add",
                "link": reverse_lazy("admin:users_user_changelist"),
                "permission": lambda request: user_has_group_or_permission(request.user, "view_user"),
            },
        ],
    },
    {
        "seperator": True,
        "title": _("Skanerlash"),
        "items": [
            {
                "title": _("Skanlar"),
                "icon": "radar",
                "link": reverse_lazy("admin:scans_scan_changelist"),
            },
            {
                "title": _("Skan Rejalari"),
                "icon": "schedule",
                "link": reverse_lazy("admin:scans_scanschedule_changelist"),
            },
        ],
    },
    {
        "seperator": True,
        "title": _("Xavfsizlik"),
        "items": [
            {
                "title": _("Zaifliklar"),
                "icon": "bug_report",
                "link": reverse_lazy("admin:vulnerabilities_vulnerability_changelist"),
            },
            {
                "title": _("Aktivlar"),
                "icon": "dns",
                "link": reverse_lazy("admin:assets_asset_changelist"),
            },
        ],
    },
    {
        "seperator": True,
        "title": _("Hisobotlar"),
        "items": [
            {
                "title": _("Hisobotlar"),
                "icon": "description",
                "link": reverse_lazy("admin:reports_report_changelist"),
            },
        ],
    },
]


TABS = [
    {
        "models": [
            "auth.user",
            "auth.group",
        ],
        "items": [
            {
                "title": _("Foydalanuvchilar"),
                "link": reverse_lazy("admin:auth_user_changelist"),
            },
            {
                "title": _("Guruhlar"),
                "link": reverse_lazy("admin:auth_group_changelist"),
            },
        ],
    },
]
