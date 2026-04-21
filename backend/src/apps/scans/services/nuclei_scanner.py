import json
import logging
import subprocess
import tempfile
from pathlib import Path

from django.conf import settings

logger = logging.getLogger(__name__)


class NucleiScanner:
    """Nuclei CLI orqali template-asosli skanerlash."""

    SEVERITY_MAP = {
        "critical": "CRITICAL",
        "high": "HIGH",
        "medium": "MEDIUM",
        "low": "LOW",
        "info": "INFO",
    }

    def __init__(self):
        self.nuclei_path = getattr(settings, "NUCLEI_PATH", "nuclei")
        self.timeout = getattr(settings, "SCAN_TIMEOUT", 600)

    def run_scan(self, target_url: str, templates: list[str] | None = None) -> list[dict]:
        """Nuclei skanini boshlash va natijalarni qaytarish."""
        output_file = tempfile.mktemp(suffix=".json")

        cmd = [
            self.nuclei_path,
            "-u", target_url,
            "-json-export", output_file,
            "-severity", "critical,high,medium,low",
            "-silent",
            "-no-color",
        ]

        if templates:
            for t in templates:
                cmd.extend(["-t", t])
        else:
            cmd.extend(["-t", "http/cves/"])
            cmd.extend(["-t", "http/vulnerabilities/"])
            cmd.extend(["-t", "http/misconfiguration/"])

        try:
            subprocess.run(  # noqa: S603
                cmd,
                capture_output=True,
                timeout=self.timeout,
            )
        except subprocess.TimeoutExpired:
            logger.warning(f"Nuclei scan timed out for {target_url}")
        except FileNotFoundError:
            logger.error("Nuclei binary not found. Skipping Nuclei scan.")
            return []

        results = []
        output_path = Path(output_file)
        if output_path.exists():
            try:
                for line in output_path.read_text().strip().split("\n"):
                    if line:
                        results.append(json.loads(line))
            except (json.JSONDecodeError, OSError) as e:
                logger.error(f"Error parsing Nuclei output: {e}")
            finally:
                output_path.unlink(missing_ok=True)

        return results

    def parse_result(self, result: dict) -> dict:
        """Nuclei natijasini Vulnerability modelga mapping."""
        info = result.get("info", {})
        classification = info.get("classification", {})
        cve_ids = classification.get("cve-id", [])
        return {
            "title": info.get("name", "Unknown"),
            "description": info.get("description", ""),
            "severity": self.SEVERITY_MAP.get(info.get("severity", ""), "INFO"),
            "category": ",".join(info.get("tags", [])),
            "affected_url": result.get("matched-at", ""),
            "evidence": result.get("matcher-name", ""),
            "remediation": info.get("remediation", ""),
            "cve_id": ",".join(cve_ids) if cve_ids else "",
            "cvss_score": classification.get("cvss-score"),
        }
