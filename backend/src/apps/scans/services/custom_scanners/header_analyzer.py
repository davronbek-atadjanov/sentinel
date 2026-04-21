import logging

import requests

logger = logging.getLogger(__name__)


class HeaderAnalyzer:
    """HTTP security headers analyzer."""

    SECURITY_HEADERS = {
        "Strict-Transport-Security": {
            "severity": "HIGH",
            "description": "HSTS header prevents protocol downgrade attacks and cookie hijacking.",
            "remediation": "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' header.",
        },
        "Content-Security-Policy": {
            "severity": "MEDIUM",
            "description": "CSP header prevents XSS, clickjacking, and code injection attacks.",
            "remediation": "Implement a Content-Security-Policy header with appropriate directives.",
        },
        "X-Frame-Options": {
            "severity": "MEDIUM",
            "description": "X-Frame-Options prevents clickjacking by disabling iframe embedding.",
            "remediation": "Add 'X-Frame-Options: DENY' or 'SAMEORIGIN' header.",
        },
        "X-Content-Type-Options": {
            "severity": "LOW",
            "description": "Prevents MIME type sniffing which can lead to XSS attacks.",
            "remediation": "Add 'X-Content-Type-Options: nosniff' header.",
        },
        "X-XSS-Protection": {
            "severity": "LOW",
            "description": "Enables browser's built-in XSS filter (legacy browsers).",
            "remediation": "Add 'X-XSS-Protection: 1; mode=block' header.",
        },
        "Referrer-Policy": {
            "severity": "LOW",
            "description": "Controls how much referrer information is sent with requests.",
            "remediation": "Add 'Referrer-Policy: strict-origin-when-cross-origin' header.",
        },
        "Permissions-Policy": {
            "severity": "LOW",
            "description": "Controls which browser features the site can use.",
            "remediation": "Add Permissions-Policy header to restrict unnecessary browser features.",
        },
    }

    def scan(self, url: str) -> list[dict]:
        """Scan URL for missing security headers."""
        findings = []
        try:
            response = requests.head(
                url,
                timeout=10,
                allow_redirects=True,
                verify=False,  # noqa: S501
            )
            response_headers = {k.lower(): v for k, v in response.headers.items()}

            for header, info in self.SECURITY_HEADERS.items():
                if header.lower() not in response_headers:
                    findings.append({
                        "title": f"Missing Security Header: {header}",
                        "description": info["description"],
                        "severity": info["severity"],
                        "category": "HEADERS",
                        "affected_url": url,
                        "evidence": f"Header '{header}' not found in response.",
                        "remediation": info["remediation"],
                    })

            # Check for server version disclosure
            server = response_headers.get("server", "")
            if server and any(v in server.lower() for v in ["apache/", "nginx/", "iis/"]):
                findings.append({
                    "title": "Server Version Disclosure",
                    "description": "The server header exposes version information.",
                    "severity": "LOW",
                    "category": "HEADERS",
                    "affected_url": url,
                    "evidence": f"Server: {server}",
                    "remediation": "Remove or obfuscate the Server header version.",
                })

        except requests.RequestException as e:
            logger.error(f"Header scan failed for {url}: {e}")

        return findings
