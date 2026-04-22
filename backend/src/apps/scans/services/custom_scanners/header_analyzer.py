import logging

import requests

logger = logging.getLogger(__name__)


class HeaderAnalyzer:
    """HTTP security headers analyzer."""

    SECURITY_HEADERS = {
        "Strict-Transport-Security": {
            "severity": "HIGH",
            "description": "HSTS sarlavhasi protokolni pasaytirish (downgrade) va cookie hijacking hujumlarini oldini oladi.",
            "remediation": "Strict-Transport-Security: max-age=31536000; includeSubDomains sarlavhasini qo'shing.",
        },
        "Content-Security-Policy": {
            "severity": "MEDIUM",
            "description": "CSP sarlavhasi XSS, clickjacking va kod injektsiyasi hujumlarini cheklaydi.",
            "remediation": "Tegishli direktivalar bilan Content-Security-Policy sarlavhasini joriy qiling.",
        },
        "X-Frame-Options": {
            "severity": "MEDIUM",
            "description": "X-Frame-Options iframe ichiga joylashtirishni cheklab, clickjackingni oldini oladi.",
            "remediation": "X-Frame-Options: DENY yoki SAMEORIGIN sarlavhasini qo'shing.",
        },
        "X-Content-Type-Options": {
            "severity": "LOW",
            "description": "MIME turini sniffing qilishni oldini oladi, bu XSS hujumlariga olib kelishi mumkin.",
            "remediation": "X-Content-Type-Options: nosniff sarlavhasini qo'shing.",
        },
        "X-XSS-Protection": {
            "severity": "LOW",
            "description": "Brauzerlarning ichki XSS filtri (legacy brauzerlar)ni yoqadi.",
            "remediation": "X-XSS-Protection: 1; mode=block sarlavhasini qo'shing.",
        },
        "Referrer-Policy": {
            "severity": "LOW",
            "description": "So'rovlar bilan yuboriladigan referrer ma'lumotining hajmini boshqaradi.",
            "remediation": "Referrer-Policy: strict-origin-when-cross-origin sarlavhasini qo'shing.",
        },
        "Permissions-Policy": {
            "severity": "LOW",
            "description": "Brauzer funksiyalaridan qaysilarini sayt ishlatishini cheklaydi.",
            "remediation": "Keraksiz brauzer funksiyalarini cheklash uchun Permissions-Policy sarlavhasini qo'shing.",
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
                    "description": "Server sarlavhasi versiya ma'lumotini oshkor qiladi.",
                    "severity": "LOW",
                    "category": "HEADERS",
                    "affected_url": url,
                    "evidence": f"Server: {server}",
                    "remediation": "Server sarlavhasidagi versiya ma'lumotini olib tashlang yoki yashiring.",
                })

        except requests.RequestException as e:
            logger.error(f"Header scan failed for {url}: {e}")

        return findings
