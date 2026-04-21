import django_filters

from apps.vulnerabilities.models.vulnerabilities import Vulnerability


class VulnerabilityFilter(django_filters.FilterSet):
    severity = django_filters.CharFilter(field_name="severity", lookup_expr="exact")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")
    category = django_filters.CharFilter(field_name="category", lookup_expr="icontains")
    scan = django_filters.NumberFilter(field_name="scan_id", lookup_expr="exact")
    min_cvss = django_filters.NumberFilter(field_name="cvss_score", lookup_expr="gte")
    max_cvss = django_filters.NumberFilter(field_name="cvss_score", lookup_expr="lte")

    class Meta:
        model = Vulnerability
        fields = ("severity", "status", "category", "scan", "min_cvss", "max_cvss")
