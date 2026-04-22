import logging
from urllib.parse import urlparse, urlunparse

from django.utils import timezone
from rest_framework import serializers

from apps.assets.models.assets import Asset, AssetTypeChoices
from apps.scans.models.scans import Scan

logger = logging.getLogger(__name__)

CANONICAL_KEEP_WWW = False


def ensure_url_with_scheme(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme and parsed.netloc:
        return url
    return f"https://{url}"


def normalize_host(host: str, keep_www: bool | None = None) -> str:
    normalized = host.lower()
    use_www = CANONICAL_KEEP_WWW if keep_www is None else keep_www
    if not use_www and normalized.startswith("www."):
        return normalized[4:]
    return normalized


def normalize_url(
    url: str,
    scheme_override: str | None = None,
    host_override: str | None = None,
    keep_www: bool = False,
) -> str:
    url = ensure_url_with_scheme(url)
    parsed = urlparse(url)
    scheme = (scheme_override or parsed.scheme or "https").lower()
    host = host_override or parsed.hostname or parsed.netloc or ""
    host = normalize_host(host, keep_www=keep_www)

    port = parsed.port
    if port and ((scheme == "http" and port == 80) or (scheme == "https" and port == 443)):
        port = None

    netloc = f"{host}:{port}" if port else host
    path = parsed.path.rstrip("/")
    return urlunparse((scheme, netloc, path, "", "", ""))


def build_url_variants(url: str) -> set[str]:
    url = ensure_url_with_scheme(url)
    parsed = urlparse(url)
    host = normalize_host(parsed.hostname or parsed.netloc or "", keep_www=True)
    if not host:
        return {normalize_url(url)}

    base_host = host[4:] if host.startswith("www.") else host
    hosts = {base_host, f"www.{base_host}"}

    schemes = {parsed.scheme.lower() or "https", "http", "https"}
    variants = set()
    for scheme in schemes:
        for host_opt in hosts:
            variants.add(normalize_url(url, scheme_override=scheme, host_override=host_opt, keep_www=False))
            variants.add(normalize_url(url, scheme_override=scheme, host_override=host_opt, keep_www=True))
    return variants


def infer_asset_type(url: str) -> str:
    path = urlparse(url).path.lower()
    return AssetTypeChoices.API if "/api" in path else AssetTypeChoices.WEB_APP


def get_asset_type_override(config: dict | None) -> str | None:
    if not config:
        return None
    value = str(config.get("asset_type", "")).upper()
    if value in AssetTypeChoices.values:
        return value
    return None


def build_asset_name(url: str) -> str:
    parsed = urlparse(ensure_url_with_scheme(url))
    host = normalize_host(parsed.hostname or parsed.netloc or url)
    path = parsed.path.rstrip("/")
    if path and path != "/":
        return f"{host}{path}"
    return host


class ScanSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Scan
        fields = (
            "id",
            "user",
            "user_email",
            "target_url",
            "scan_type",
            "status",
            "started_at",
            "completed_at",
            "progress",
            "config",
            "results_summary",
            "duration",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "user",
            "user_email",
            "status",
            "started_at",
            "completed_at",
            "progress",
            "results_summary",
            "duration",
            "created_at",
            "updated_at",
        )

    def get_duration(self, obj: Scan) -> str | None:
        if obj.started_at and obj.completed_at:
            delta = obj.completed_at - obj.started_at
            return str(delta).split(".")[0]
        return None


class ScanCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new scans with optional configuration parameters.

    The `config` field is a flexible JSONField that can contain:

    1. Asset Type Override:
       - asset_type: str (WEB_APP, API, NETWORK, MOBILE)
         If provided, overrides the auto-detected asset type based on URL path.

    2. Authentication Configuration:
       - auth: dict
         - username: str (username or API key)
         - password: str (password or secret)
         - login_url: str (optional, form submission endpoint)

    3. Advanced Parameters:
       - advanced: dict
         - depth: int (1-20, max crawl depth)
         - parallelism: int (1-100, requests per second)
         - force_https: bool (convert HTTP to HTTPS)
         - follow_redirects: bool (follow 301/302 redirects)

    4. Schedule Configuration:
       - schedule: dict
         - frequency: str (DAILY, WEEKLY, MONTHLY)
         - start_time: str (HH:MM UTC)
         - end_time: str (HH:MM UTC)

    5. Custom Profile Modules (CUSTOM scan_type only):
       - custom_modules: dict
         - headerAnalysis: bool (HTTP security headers check)
         - sslCheck: bool (SSL/TLS certificate and encryption strength)
         - portScan: bool (open ports and services detection)
         - xssScan: bool (cross-site scripting vulnerabilities)
         - sqliScan: bool (SQL injection vulnerabilities)
         - nucleiScan: bool (community templates scanning)
         - zapScan: bool (OWASP ZAP deep analysis)
         Only used when scan_type == "CUSTOM"
         At least one module must be enabled for custom scans

    Auto-asset creation behavior:
    - Creates or updates Asset record based on target_url
    - Uses normalized URL with www handling (canonical no-www, but matches both variants)
    - Infers asset_type from URL path (/api → API, else WEB_APP) unless overridden in config
    - Sets is_active=True and updates last_scan timestamp
    """

    class Meta:
        model = Scan
        fields = ("target_url", "scan_type", "config")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        scan = super().create(validated_data)

        try:
            target_url = scan.target_url
            normalized_url = normalize_url(target_url)
            url_candidates = build_url_variants(target_url)
            asset_type = get_asset_type_override(scan.config) or infer_asset_type(target_url)

            asset = Asset.objects.filter(user=scan.user, url__in=list(url_candidates)).first()
            if not asset:
                Asset.objects.create(
                    user=scan.user,
                    name=build_asset_name(target_url),
                    url=normalized_url,
                    asset_type=asset_type,
                    is_active=True,
                    last_scan=timezone.now(),
                )
            else:
                asset.last_scan = timezone.now()
                if not asset.is_active:
                    asset.is_active = True
                asset.save(update_fields=["last_scan", "is_active"])
        except Exception as exc:
            logger.warning("Scan %s asset sync failed: %s", scan.id, exc)

        return scan
