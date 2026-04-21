from rest_framework import serializers

from apps.vulnerabilities.models.vulnerabilities import Vulnerability


class VulnerabilitySerializer(serializers.ModelSerializer):
    scan_target = serializers.CharField(source="scan.target_url", read_only=True)
    assigned_to_email = serializers.CharField(source="assigned_to.email", read_only=True, default=None)

    class Meta:
        model = Vulnerability
        fields = (
            "id", "scan", "scan_target", "title", "description",
            "severity", "status", "category", "affected_url",
            "evidence", "remediation", "cvss_score", "cve_id",
            "assigned_to", "assigned_to_email",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "scan", "scan_target", "title", "description",
            "severity", "category", "affected_url", "evidence",
            "remediation", "cvss_score", "cve_id",
            "created_at", "updated_at",
        )


class VulnerabilityUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vulnerability
        fields = ("status", "assigned_to")
