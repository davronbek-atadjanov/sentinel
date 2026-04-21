import logging
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse

import requests

logger = logging.getLogger(__name__)


class XSSScanner:
    """Reflected XSS detection scanner."""

    PAYLOADS = [
        '<script>alert(1)</script>',
        '"><img src=x onerror=alert(1)>',
        "'-alert(1)-'",
        '<svg/onload=alert(1)>',
        '"><svg onload=alert(1)//>',
        "javascript:alert(1)",
    ]

    def scan(self, url: str, params: list[str] | None = None) -> list[dict]:
        """Har bir parametrga XSS payload yuborish va refleksiyani tekshirish."""
        findings = []

        if not params:
            params = self._extract_params(url)

        if not params:
            # Try common parameter names
            params = ["q", "search", "query", "id", "name", "page", "input"]

        base_url = self._get_base_url(url)

        for param in params:
            for payload in self.PAYLOADS:
                try:
                    response = requests.get(
                        base_url,
                        params={param: payload},
                        timeout=10,
                        allow_redirects=True,
                        verify=False,  # noqa: S501
                    )
                    if payload in response.text:
                        findings.append({
                            "title": f"Reflected XSS in parameter '{param}'",
                            "description": (
                                f"The parameter '{param}' reflects user input without "
                                f"proper sanitization, allowing potential XSS attacks."
                            ),
                            "severity": "HIGH",
                            "category": "XSS",
                            "affected_url": f"{base_url}?{param}={payload}",
                            "evidence": f"Payload reflected: {payload}",
                            "remediation": (
                                "Implement output encoding and Content Security Policy (CSP). "
                                "Use DOMPurify or similar libraries for client-side sanitization."
                            ),
                        })
                        break  # One finding per parameter is enough
                except requests.RequestException as e:
                    logger.debug(f"XSS scan request failed for {param}: {e}")

        return findings

    def _extract_params(self, url: str) -> list[str]:
        parsed = urlparse(url)
        return list(parse_qs(parsed.query).keys())

    def _get_base_url(self, url: str) -> str:
        parsed = urlparse(url)
        return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
