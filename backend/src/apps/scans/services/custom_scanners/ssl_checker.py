import logging
import socket
import ssl
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class SSLChecker:
    """SSL/TLS certificate and configuration checker."""

    def scan(self, hostname: str) -> list[dict]:
        """Check SSL certificate validity and configuration."""
        findings = []
        try:
            ctx = ssl.create_default_context()
            with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
                s.settimeout(10)
                s.connect((hostname, 443))
                cert = s.getpeercert()

                # Check certificate expiry
                not_after_str = cert.get("notAfter", "")
                if not_after_str:
                    not_after = datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z")
                    not_after = not_after.replace(tzinfo=timezone.utc)
                    days_left = (not_after - datetime.now(tz=timezone.utc)).days

                    if days_left < 0:
                        findings.append({
                            "title": "SSL Certificate Expired",
                            "description": f"Certificate expired {abs(days_left)} days ago.",
                            "severity": "CRITICAL",
                            "category": "SSL",
                            "affected_url": hostname,
                            "evidence": f"Expiry: {not_after_str}",
                            "remediation": "Renew the SSL certificate immediately.",
                        })
                    elif days_left < 7:
                        findings.append({
                            "title": f"SSL Certificate Expiring in {days_left} Days",
                            "description": "Certificate is about to expire within a week.",
                            "severity": "HIGH",
                            "category": "SSL",
                            "affected_url": hostname,
                            "evidence": f"Expiry: {not_after_str}, Days left: {days_left}",
                            "remediation": "Renew the SSL certificate urgently.",
                        })
                    elif days_left < 30:
                        findings.append({
                            "title": f"SSL Certificate Expiring in {days_left} Days",
                            "description": "Certificate expiry approaching.",
                            "severity": "MEDIUM",
                            "category": "SSL",
                            "affected_url": hostname,
                            "evidence": f"Expiry: {not_after_str}, Days left: {days_left}",
                            "remediation": "Plan SSL certificate renewal.",
                        })

                # Check subject
                subject = dict(x[0] for x in cert.get("subject", ()))
                issuer = dict(x[0] for x in cert.get("issuer", ()))

                # Self-signed check
                if subject == issuer:
                    findings.append({
                        "title": "Self-Signed SSL Certificate",
                        "description": "The certificate is self-signed and not issued by a trusted CA.",
                        "severity": "HIGH",
                        "category": "SSL",
                        "affected_url": hostname,
                        "evidence": f"Issuer: {issuer.get('organizationName', 'Unknown')}",
                        "remediation": "Use a certificate from a trusted Certificate Authority.",
                    })

        except ssl.SSLCertVerificationError as e:
            findings.append({
                "title": "SSL Certificate Verification Failed",
                "description": "The SSL certificate could not be verified.",
                "severity": "CRITICAL",
                "category": "SSL",
                "affected_url": hostname,
                "evidence": str(e),
                "remediation": "Fix or replace the SSL certificate.",
            })
        except ssl.SSLError as e:
            findings.append({
                "title": "SSL/TLS Configuration Error",
                "description": "SSL handshake failed indicating misconfigured TLS.",
                "severity": "CRITICAL",
                "category": "SSL",
                "affected_url": hostname,
                "evidence": str(e),
                "remediation": "Review and fix TLS configuration.",
            })
        except (socket.error, OSError) as e:
            logger.warning(f"SSL check failed for {hostname}: {e}")
            findings.append({
                "title": "SSL Connection Failed",
                "description": f"Could not establish SSL connection to {hostname}.",
                "severity": "HIGH",
                "category": "SSL",
                "affected_url": hostname,
                "evidence": str(e),
                "remediation": "Verify SSL is properly configured on port 443.",
            })

        return findings
