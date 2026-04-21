import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


class ZAPScanner:
    """OWASP ZAP REST API orqali skan qilish."""

    def __init__(self):
        self.base_url = settings.ZAP_API_URL
        self.api_key = settings.ZAP_API_KEY
        self.timeout = 30

    def _request(self, endpoint: str, params: dict | None = None) -> dict:
        params = params or {}
        params["apikey"] = self.api_key
        try:
            resp = requests.get(
                f"{self.base_url}{endpoint}",
                params=params,
                timeout=self.timeout,
            )
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            logger.error(f"ZAP API error: {e}")
            raise

    def spider_scan(self, target_url: str) -> str:
        """Saytni crawl qilish — barcha sahifalarni topish."""
        data = self._request("/JSON/spider/action/scan/", {
            "url": target_url,
            "maxChildren": "10",
            "recurse": "true",
        })
        return data.get("scan", "0")

    def get_spider_status(self, scan_id: str) -> int:
        """Spider progress (0-100)."""
        data = self._request("/JSON/spider/view/status/", {"scanId": scan_id})
        return int(data.get("status", "0"))

    def active_scan(self, target_url: str) -> str:
        """Faol zaiflik skanerlash (XSS, SQLi, RCE...)."""
        data = self._request("/JSON/ascan/action/scan/", {
            "url": target_url,
            "recurse": "true",
            "inScopeOnly": "false",
        })
        return data.get("scan", "0")

    def get_active_scan_status(self, scan_id: str) -> int:
        """Active scan progress (0-100)."""
        data = self._request("/JSON/ascan/view/status/", {"scanId": scan_id})
        return int(data.get("status", "0"))

    def get_alerts(self, target_url: str) -> list[dict]:
        """Topilgan zaifliklar ro'yxatini olish."""
        data = self._request("/JSON/alert/view/alerts/", {"baseurl": target_url})
        return data.get("alerts", [])

    def map_alert_to_vulnerability(self, alert: dict) -> dict:
        """ZAP alert → Sentinel Vulnerability model mapping."""
        risk_map = {"3": "CRITICAL", "2": "HIGH", "1": "MEDIUM", "0": "LOW"}
        return {
            "title": alert.get("name", "Unknown"),
            "description": alert.get("description", ""),
            "severity": risk_map.get(alert.get("riskcode", ""), "INFO"),
            "category": f"CWE-{alert.get('cweid', 'N/A')}",
            "affected_url": alert.get("url", ""),
            "evidence": alert.get("evidence", ""),
            "remediation": alert.get("solution", ""),
        }

    def wait_for_spider(self, scan_id: str, poll_interval: int = 5) -> None:
        """Spider tugashini kutish."""
        import time
        while True:
            progress = self.get_spider_status(scan_id)
            if progress >= 100:
                break
            time.sleep(poll_interval)

    def wait_for_active_scan(self, scan_id: str, poll_interval: int = 10) -> None:
        """Active scan tugashini kutish."""
        import time
        while True:
            progress = self.get_active_scan_status(scan_id)
            if progress >= 100:
                break
            time.sleep(poll_interval)
