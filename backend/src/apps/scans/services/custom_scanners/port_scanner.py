import logging
import socket

logger = logging.getLogger(__name__)


class PortScanner:
    """Common ports scanner."""

    COMMON_PORTS = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        993: "IMAPS",
        995: "POP3S",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        6379: "Redis",
        8080: "HTTP-Proxy",
        8443: "HTTPS-Alt",
        27017: "MongoDB",
    }

    RISKY_PORTS = {21, 23, 445, 3306, 3389, 5432, 6379, 27017}

    def scan(self, hostname: str) -> list[dict]:
        """Scan common ports on the target hostname."""
        findings = []
        open_ports = []

        for port, service in self.COMMON_PORTS.items():
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(2)
                    result = s.connect_ex((hostname, port))
                    if result == 0:
                        open_ports.append(port)
                        severity = "MEDIUM" if port in self.RISKY_PORTS else "INFO"
                        description = (
                            f"Port {port} ({service}) is open and publicly accessible."
                        )
                        if port in self.RISKY_PORTS:
                            description += (
                                " This service should not be exposed to the internet."
                            )

                        findings.append({
                            "title": f"Open Port: {port} ({service})",
                            "description": description,
                            "severity": severity,
                            "category": "PORTS",
                            "affected_url": f"{hostname}:{port}",
                            "evidence": f"TCP port {port} is open ({service})",
                            "remediation": (
                                f"Review if port {port} ({service}) needs to be "
                                f"publicly accessible. Use firewall rules to restrict access."
                            ) if port in self.RISKY_PORTS else "",
                        })
            except socket.error:
                pass

        return findings
