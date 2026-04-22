import logging
from urllib.parse import parse_qs, urlparse, urlunparse

import requests

logger = logging.getLogger(__name__)


class SQLiScanner:
    """Error-based SQL Injection detection scanner."""

    PAYLOADS = [
        "' OR '1'='1",
        "1' AND '1'='2",
        "'; DROP TABLE--",
        "1 UNION SELECT NULL--",
        "' OR 1=1--",
        "1' ORDER BY 100--",
        "1' WAITFOR DELAY '0:0:5'--",
    ]

    ERROR_PATTERNS = [
        "sql syntax",
        "mysql",
        "postgresql",
        "sqlite3",
        "ora-",
        "unclosed quotation",
        "unterminated string",
        "syntax error",
        "microsoft sql",
        "odbc",
        "jdbc",
        "sqlexception",
        "quoted string not properly terminated",
    ]

    def scan(self, url: str, params: list[str] | None = None, config: dict | None = None) -> list[dict]:
        """
        Har bir parametrga SQLi payload yuborish va xato patternlarni tekshirish.

        Args:
            url: Target URL to scan
            params: List of parameter names to test (auto-detected if not provided)
            config: Configuration dict with keys:
                - force_https: bool (convert HTTP to HTTPS)
                - follow_redirects: bool (follow 301/302 redirects)
                - auth: dict with username/password/login_url
                - depth: int (crawl depth)
        """
        config = config or {}
        findings = []

        # Apply force_https if enabled
        if config.get("force_https") and url.startswith("http://"):
            url = url.replace("http://", "https://", 1)

        if not params:
            params = self._extract_params(url)

        if not params:
            params = ["id", "q", "search", "user", "page", "category"]

        base_url = self._get_base_url(url)

        # Build auth tuple
        auth_tuple = None
        if auth := config.get("auth"):
            auth_tuple = (auth.get("username", ""), auth.get("password", ""))

        for param in params:
            found = False
            for payload in self.PAYLOADS:
                if found:
                    break
                try:
                    response = requests.get(
                        base_url,
                        params={param: payload},
                        timeout=10,
                        allow_redirects=config.get("follow_redirects", True),
                        verify=True,
                        auth=auth_tuple,
                    )
                    response_text = response.text.lower()
                    for pattern in self.ERROR_PATTERNS:
                        if pattern in response_text:
                            findings.append(
                                {
                                    "title": f"SQL Injection in parameter '{param}'",
                                    "description": (
                                        f"The parameter '{param}' is vulnerable to SQL injection. "
                                        f"Database error messages are leaked in the response."
                                    ),
                                    "severity": "CRITICAL",
                                    "category": "SQLi",
                                    "affected_url": f"{base_url}?{param}=...",
                                    "evidence": f"Error pattern detected: {pattern}",
                                    "remediation": (
                                        "Use parameterized queries or prepared statements. "
                                        "Never concatenate user input into SQL queries."
                                    ),
                                }
                            )
                            found = True
                            break
                except requests.RequestException as e:
                    logger.debug(f"SQLi scan request failed for {param}: {e}")

        return findings

    def _extract_params(self, url: str) -> list[str]:
        parsed = urlparse(url)
        return list(parse_qs(parsed.query).keys())

    def _get_base_url(self, url: str) -> str:
        parsed = urlparse(url)
        return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
