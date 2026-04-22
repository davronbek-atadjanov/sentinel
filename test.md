# Sentinel Backend API — Implementation Plan

## Loyiha Haqida

Sentinel — AI-powered Web Application Security Scanner. Frontend (React) tayyor, 34 sahifa mock data bilan ishlaydi.
Backend vazifasi — haqiqiy API yaratib, frontend'ni real data bilan ta'minlash.

---

## Mavjud Template Tahlili

```
backend/src/
├── core/                    # Django settings, URLs, ASGI/WSGI
│   ├── settings.py          # PostgreSQL, CORS, i18n
│   ├── config/
│   │   ├── apps.py          # INSTALLED_APPS tuzilmasi
│   │   ├── jwt.py           # SimpleJWT — Access 1d, Refresh 7d
│   │   ├── rest_framework.py # DRF — JWT auth, throttling, Spectacular
│   │   ├── cache.py         # Redis/cache config
│   │   ├── celery.py        # Celery task queue
│   │   ├── swagger.py       # drf-spectacular (Swagger UI)
│   │   ├── sentry.py        # Error tracking
│   │   └── logs.py          # Logging
│   └── celery.py            # Celery app init
├── apps/
│   ├── shared/              # Base model, pagination, exceptions, utils
│   │   ├── models/base.py   # AbstractBaseModel (created_at, updated_at)
│   │   ├── pagination/      # CustomPagination (success, links, total)
│   │   ├── exceptions/      # Custom error handlers (400, 403, 404, 500)
│   │   ├── management/commands/makeapp.py  # App generator
│   │   └── views/base.py    # HomeView + error handlers
│   └── users/               # User model — email login, roles
│       ├── models/users.py  # AbstractUser + avatar + role + tokens()
│       ├── managers/        # Custom UserManager
│       ├── admin/           # Unfold admin panel
│       └── api/v1/          # Bo'sh — to'ldirish kerak
```

### Tayyor Narsalar
- ✅ Django + DRF + PostgreSQL
- ✅ JWT Authentication (SimpleJWT)
- ✅ Custom User Model (email, avatar, role)
- ✅ Swagger/OpenAPI (drf-spectacular)
- ✅ Celery + Redis
- ✅ CORS, Throttling, Sentry, Prometheus
- ✅ Custom Pagination (success/links/data format)
- ✅ `makeapp` management command (app generator)
- ✅ Unfold admin panel

---

## Yaratish Kerak Bo'lgan Django App'lar

> [!IMPORTANT]
> `python manage.py makeapp <name>` orqali — template avtomatik models/, admin/, api/v1/ yaratadi.

| # | App nomi | Vazifasi |
|:--|:---------|:---------|
| 1 | `users` | ✅ Mavjud — Auth API qo'shish kerak |
| 2 | `scans` | Skan yaratish, boshqarish, natijalar |
| 3 | `vulnerabilities` | Topilgan zaifliklar, tafsilotlar |
| 4 | `assets` | Maqsad veb-ilovalar va endpointlar |
| 5 | `reports` | Hisobotlar generatsiya, eksport |

---

## Faza 1: Auth API (users app — to'ldirish)

### Models — Mavjud
User modeli allaqachon tayyor: `email`, `username`, `avatar`, `role`, `tokens()`.

### API Endpoints

```
POST   /api/v1/auth/register/          — Ro'yxatdan o'tish
POST   /api/v1/auth/login/             — JWT token olish (email + password)
POST   /api/v1/auth/token/refresh/     — Access token yangilash
POST   /api/v1/auth/logout/            — Refresh tokenni bekor qilish
GET    /api/v1/auth/me/                — Joriy foydalanuvchi ma'lumotlari
PATCH  /api/v1/auth/me/                — Profilni tahrirlash
PATCH  /api/v1/auth/change-password/   — Parolni o'zgartirish
```

### Fayllar

```
apps/users/api/v1/
├── urls.py
├── views/
│   ├── auth.py          # RegisterView, LoginView, LogoutView
│   └── profile.py       # ProfileView (GET/PATCH), ChangePasswordView
├── serializers/
│   ├── auth.py          # RegisterSerializer, LoginSerializer
│   └── profile.py       # ProfileSerializer, ChangePasswordSerializer
└── tests/
    └── test_auth.py
```

---

## Faza 2: Scans App

### Models

```python
class ScanTypeChoices(TextChoices):
    FULL = "FULL", "Full Scan"
    QUICK = "QUICK", "Quick Scan"
    API = "API", "API Scan"
    OWASP = "OWASP", "OWASP Top 10"
    CUSTOM = "CUSTOM", "Custom Scan"

class ScanStatusChoices(TextChoices):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class Scan(AbstractBaseModel):
    user = FK(User)
    target_url = URLField()
    scan_type = CharField(choices)
    status = CharField(choices)
    started_at = DateTimeField(null)
    completed_at = DateTimeField(null)
    progress = IntegerField(default=0)   # 0-100%
    config = JSONField(default=dict)
    results_summary = JSONField(null)

class ScanSchedule(AbstractBaseModel):
    user = FK(User)
    target_url = URLField()
    scan_type = CharField(choices)
    frequency = CharField()              # daily/weekly/monthly
    next_run = DateTimeField()
    is_active = BooleanField(default=True)
```

### API Endpoints

```
GET    /api/v1/scans/                  — Barcha skanlar (paginated)
POST   /api/v1/scans/                  — Yangi skan boshlash
GET    /api/v1/scans/{id}/             — Skan tafsilotlari
PATCH  /api/v1/scans/{id}/cancel/      — Bekor qilish
DELETE /api/v1/scans/{id}/             — O'chirish
GET    /api/v1/scans/{id}/results/     — Natijalar
GET    /api/v1/scans/stats/            — Dashboard statistikasi
GET    /api/v1/scans/schedules/        — Rejalar
POST   /api/v1/scans/schedules/        — Yangi reja
PATCH  /api/v1/scans/schedules/{id}/   — Tahrirlash
DELETE /api/v1/scans/schedules/{id}/   — O'chirish
```

### Celery Tasks

```python
@shared_task
def run_scan(scan_id):
    """Asinxron skan — progress yangilab boradi"""

@shared_task
def process_scheduled_scans():
    """Rejalashtirilgan skanlarni tekshirish"""
```

### Fayllar

```
apps/scans/
├── models/scans.py
├── api/v1/
│   ├── urls.py
│   ├── views/
│   │   ├── scans.py         # ScanViewSet
│   │   └── schedules.py     # ScheduleViewSet
│   ├── serializers/
│   │   ├── scans.py
│   │   └── schedules.py
├── admin/scans.py
├── tasks.py
└── services/scanner.py       # Skan logikasi
```

---

## Faza 3: Vulnerabilities App

### Models

```python
class SeverityChoices(TextChoices):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

class VulnStatusChoices(TextChoices):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    FALSE_POSITIVE = "FALSE_POSITIVE"

class Vulnerability(AbstractBaseModel):
    scan = FK(Scan)
    title = CharField()
    description = TextField()
    severity = CharField(choices)
    status = CharField(choices)
    category = CharField()              # XSS, SQLi, RCE, CSRF...
    affected_url = URLField()
    evidence = TextField(blank=True)
    remediation = TextField(blank=True)
    cvss_score = FloatField(null=True)  # 0.0 - 10.0
    cve_id = CharField(blank=True)
    assigned_to = FK(User, null=True)
```

### API Endpoints

```
GET    /api/v1/vulnerabilities/              — Ro'yxat (filter, search)
GET    /api/v1/vulnerabilities/{id}/         — Tafsilotlar
PATCH  /api/v1/vulnerabilities/{id}/         — Status yangilash
GET    /api/v1/vulnerabilities/stats/        — Statistika
GET    /api/v1/vulnerabilities/by-category/  — Kategoriya guruhlash
GET    /api/v1/vulnerabilities/by-severity/  — Severity guruhlash
```

### Fayllar

```
apps/vulnerabilities/
├── models/vulnerabilities.py
├── api/v1/
│   ├── urls.py
│   ├── views/vulns.py
│   ├── serializers/vulns.py
│   └── filters.py
├── admin/vulnerabilities.py
└── services/analyzer.py
```

---

## Faza 4: Assets App

### Models

```python
class AssetTypeChoices(TextChoices):
    WEB_APP = "WEB_APP"
    API = "API"
    MOBILE = "MOBILE"
    NETWORK = "NETWORK"

class Asset(AbstractBaseModel):
    user = FK(User)
    name = CharField()
    url = URLField()
    asset_type = CharField(choices)
    is_active = BooleanField()
    last_scan = DateTimeField(null)
    risk_score = FloatField(default=0)
    technologies = JSONField(default=[])
    metadata = JSONField(default={})
```

### API Endpoints

```
GET    /api/v1/assets/                — Ro'yxat
POST   /api/v1/assets/               — Yangi aktiv
GET    /api/v1/assets/{id}/           — Tafsilotlar
PATCH  /api/v1/assets/{id}/           — Tahrirlash
DELETE /api/v1/assets/{id}/           — O'chirish
GET    /api/v1/assets/{id}/history/   — Skan tarixi
GET    /api/v1/assets/attack-surface/ — Attack surface tahlili
```

---

## Faza 5: Reports App

### Models

```python
class ReportTypeChoices(TextChoices):
    EXECUTIVE = "EXECUTIVE"
    TECHNICAL = "TECHNICAL"
    COMPLIANCE = "COMPLIANCE"

class Report(AbstractBaseModel):
    user = FK(User)
    title = CharField()
    report_type = CharField(choices)
    scan = FK(Scan, null=True)
    data = JSONField()
    file = FileField(null=True)
    generated_at = DateTimeField(auto_now_add)
```

### API Endpoints

```
GET    /api/v1/reports/                — Ro'yxat
POST   /api/v1/reports/generate/       — Generatsiya
GET    /api/v1/reports/{id}/           — Tafsilotlar
GET    /api/v1/reports/{id}/download/  — PDF yuklab olish
DELETE /api/v1/reports/{id}/           — O'chirish
GET    /api/v1/reports/compliance/     — Compliance statistikasi
```

---

## Faza 6: Dashboard API

```
GET /api/v1/dashboard/overview/
```

**Response:**
```json
{
  "security_score": 94,
  "total_scans": 1284,
  "open_vulnerabilities": 42,
  "resolved_vulnerabilities": 187,
  "critical_count": 7,
  "high_count": 15,
  "active_scans": 4,
  "compliance_score": 92,
  "recent_activity": [...],
  "threat_trajectory": [...]
}
```

---

## Faza 7: Haqiqiy skan engine integratsiyasi

> [!CAUTION]
> Bu faza loyihaning eng muhim va murakkab qismi — haqiqiy zaiflik skanerlash mexanizmi.
> 3 ta usul: **OWASP ZAP API**, **Nuclei CLI**, va **Python-based Custom Scanners**.

### Arxitektura

```
┌──────────────────────────────────────────────────────┐
│                  Django API Layer                     │
│    POST /api/v1/scans/ → Celery task yuborish        │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│              Celery Worker (async)                    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ ZAP API  │  │ Nuclei   │  │ Python Scanners   │  │
│  │ (Docker) │  │ (CLI)    │  │ (requests/socket) │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       │              │                  │             │
│       └──────────────┴──────────────────┘             │
│                      │                                │
│                      ▼                                │
│          Vulnerability modelga yozish                 │
│          + Scan progress yangilash                    │
└──────────────────────────────────────────────────────┘
```

---

### 7.1 — OWASP ZAP Integratsiya (Docker + REST API)

OWASP ZAP — eng mashhur ochiq kodli veb-zaiflik skaneri. Docker orqali ishga tushiriladi.

**Docker Setup:**
```bash
docker run -d --name zap -u zap \
  -p 8090:8080 \
  ghcr.io/zaproxy/zaproxy:stable \
  zap.sh -daemon -host 0.0.0.0 -port 8080 \
  -config api.key=sentinel-zap-key \
  -config api.addrs.addr.name=.* \
  -config api.addrs.addr.regex=true
```

**Service Class:**
```python
# apps/scans/services/zap_scanner.py

import requests
from typing import Any

class ZAPScanner:
    """OWASP ZAP REST API orqali skan qilish"""

    def __init__(self):
        self.base_url = settings.ZAP_API_URL  # http://localhost:8090
        self.api_key = settings.ZAP_API_KEY

    def spider_scan(self, target_url: str) -> str:
        """Saytni crawl qilish — barcha sahifalarni topish"""
        resp = requests.get(f"{self.base_url}/JSON/spider/action/scan/", params={
            "apikey": self.api_key,
            "url": target_url,
            "maxChildren": 10,
            "recurse": True,
        })
        return resp.json()["scan"]  # scan_id

    def active_scan(self, target_url: str) -> str:
        """Faol zaiflik skanerlash (XSS, SQLi, RCE...)"""
        resp = requests.get(f"{self.base_url}/JSON/ascan/action/scan/", params={
            "apikey": self.api_key,
            "url": target_url,
            "recurse": True,
            "inScopeOnly": False,
        })
        return resp.json()["scan"]

    def get_progress(self, scan_id: str) -> int:
        """Skan progressini olish (0-100)"""
        resp = requests.get(f"{self.base_url}/JSON/ascan/view/status/", params={
            "apikey": self.api_key,
            "scanId": scan_id,
        })
        return int(resp.json()["status"])

    def get_alerts(self, target_url: str) -> list[dict[str, Any]]:
        """Topilgan zaifliklar ro'yxatini olish"""
        resp = requests.get(f"{self.base_url}/JSON/alert/view/alerts/", params={
            "apikey": self.api_key,
            "baseurl": target_url,
        })
        return resp.json()["alerts"]

    def map_alert_to_vulnerability(self, alert: dict) -> dict:
        """ZAP alert → Sentinel Vulnerability model mapping"""
        risk_map = {"3": "CRITICAL", "2": "HIGH", "1": "MEDIUM", "0": "LOW"}
        return {
            "title": alert["name"],
            "description": alert["description"],
            "severity": risk_map.get(alert["riskcode"], "INFO"),
            "category": alert["cweid"],
            "affected_url": alert["url"],
            "evidence": alert.get("evidence", ""),
            "remediation": alert.get("solution", ""),
        }
```

---

### 7.2 — Nuclei Integratsiya (CLI — Template-based)

Nuclei — ProjectDiscovery tomonidan yaratilgan tezkor va template-asosli skaner.

**O'rnatish:**
```bash
# Go orqali
GO111MODULE=on go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# yoki Docker
docker pull projectdiscovery/nuclei:latest
```

**Service Class:**
```python
# apps/scans/services/nuclei_scanner.py

import subprocess
import json
import tempfile
from pathlib import Path

class NucleiScanner:
    """Nuclei CLI orqali template-asosli skanerlash"""

    SEVERITY_MAP = {
        "critical": "CRITICAL",
        "high": "HIGH",
        "medium": "MEDIUM",
        "low": "LOW",
        "info": "INFO",
    }

    def run_scan(self, target_url: str, templates: list[str] | None = None) -> list[dict]:
        """Nuclei skanini boshlash va natijalarni qaytarish"""
        output_file = tempfile.mktemp(suffix=".json")

        cmd = [
            "nuclei",
            "-u", target_url,
            "-json-export", output_file,
            "-severity", "critical,high,medium,low",
            "-silent",
            "-no-color",
        ]

        # Maxsus templatelar (masalan, faqat XSS yoki SQLi)
        if templates:
            for t in templates:
                cmd.extend(["-t", t])
        else:
            # Default — barcha asosiy tekshiruvlar
            cmd.extend(["-t", "http/cves/"])
            cmd.extend(["-t", "http/vulnerabilities/"])
            cmd.extend(["-t", "http/misconfiguration/"])

        subprocess.run(cmd, capture_output=True, timeout=600)

        results = []
        output_path = Path(output_file)
        if output_path.exists():
            for line in output_path.read_text().strip().split("\n"):
                if line:
                    results.append(json.loads(line))
            output_path.unlink()  # Tozalash

        return results

    def parse_result(self, result: dict) -> dict:
        """Nuclei natijasini Vulnerability modelga mapping"""
        info = result.get("info", {})
        return {
            "title": info.get("name", "Unknown"),
            "description": info.get("description", ""),
            "severity": self.SEVERITY_MAP.get(info.get("severity", ""), "INFO"),
            "category": ",".join(info.get("tags", [])),
            "affected_url": result.get("matched-at", ""),
            "evidence": result.get("matcher-name", ""),
            "remediation": info.get("remediation", ""),
            "cve_id": ",".join(info.get("classification", {}).get("cve-id", [])),
            "cvss_score": info.get("classification", {}).get("cvss-score"),
        }
```

---

### 7.3 — Python Custom Scanners (o'zimiz yozgan)

ZAP va Nuclei'dan tashqari oddiy, tezkor tekshiruvlar uchun Python-based skanerlar:

```python
# apps/scans/services/custom_scanners/

# ── XSS Scanner ──
class XSSScanner:
    PAYLOADS = [
        '<script>alert(1)</script>',
        '"><img src=x onerror=alert(1)>',
        "'-alert(1)-'",
        '<svg/onload=alert(1)>',
    ]

    def scan(self, url: str, params: list[str]) -> list[dict]:
        """Har bir parametrga XSS payload yuborish va refleksiyani tekshirish"""
        findings = []
        for param in params:
            for payload in self.PAYLOADS:
                response = requests.get(url, params={param: payload}, timeout=10)
                if payload in response.text:
                    findings.append({
                        "title": f"Reflected XSS in parameter '{param}'",
                        "severity": "HIGH",
                        "category": "XSS",
                        "affected_url": f"{url}?{param}={payload}",
                        "evidence": payload,
                    })
        return findings

# ── SQL Injection Scanner ──
class SQLiScanner:
    PAYLOADS = ["' OR '1'='1", "1' AND '1'='2", "'; DROP TABLE--", "1 UNION SELECT NULL--"]
    ERROR_PATTERNS = ["sql syntax", "mysql", "postgresql", "sqlite", "ORA-", "unclosed quotation"]

    def scan(self, url: str, params: list[str]) -> list[dict]:
        findings = []
        for param in params:
            for payload in self.PAYLOADS:
                response = requests.get(url, params={param: payload}, timeout=10)
                for pattern in self.ERROR_PATTERNS:
                    if pattern.lower() in response.text.lower():
                        findings.append({
                            "title": f"SQL Injection in parameter '{param}'",
                            "severity": "CRITICAL",
                            "category": "SQLi",
                            "affected_url": f"{url}?{param}=...",
                            "evidence": f"Error pattern: {pattern}",
                        })
                        break
        return findings

# ── HTTP Header Analyzer ──
class HeaderAnalyzer:
    SECURITY_HEADERS = {
        "Strict-Transport-Security": "HIGH",
        "Content-Security-Policy": "MEDIUM",
        "X-Frame-Options": "MEDIUM",
        "X-Content-Type-Options": "LOW",
        "X-XSS-Protection": "LOW",
        "Referrer-Policy": "LOW",
        "Permissions-Policy": "LOW",
    }

    def scan(self, url: str) -> list[dict]:
        response = requests.head(url, timeout=10, allow_redirects=True)
        findings = []
        for header, severity in self.SECURITY_HEADERS.items():
            if header not in response.headers:
                findings.append({
                    "title": f"Missing Security Header: {header}",
                    "severity": severity,
                    "category": "HEADERS",
                    "affected_url": url,
                    "remediation": f"Add '{header}' header to responses",
                })
        return findings

# ── SSL/TLS Checker ──
class SSLChecker:
    def scan(self, hostname: str) -> list[dict]:
        import ssl, socket
        findings = []
        try:
            ctx = ssl.create_default_context()
            with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
                s.settimeout(10)
                s.connect((hostname, 443))
                cert = s.getpeercert()
                # Expiry check
                from datetime import datetime
                not_after = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                days_left = (not_after - datetime.utcnow()).days
                if days_left < 30:
                    findings.append({
                        "title": f"SSL Certificate expiring in {days_left} days",
                        "severity": "HIGH" if days_left < 7 else "MEDIUM",
                        "category": "SSL",
                        "affected_url": hostname,
                    })
        except ssl.SSLError as e:
            findings.append({
                "title": "SSL/TLS Configuration Error",
                "severity": "CRITICAL",
                "category": "SSL",
                "evidence": str(e),
            })
        return findings

# ── Port Scanner ──
class PortScanner:
    COMMON_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 5432, 8080, 8443]

    def scan(self, hostname: str) -> list[dict]:
        import socket
        findings = []
        for port in self.COMMON_PORTS:
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(2)
                    if s.connect_ex((hostname, port)) == 0:
                        findings.append({
                            "title": f"Open port: {port}",
                            "severity": "INFO",
                            "category": "PORTS",
                            "affected_url": f"{hostname}:{port}",
                        })
            except socket.error:
                pass
        return findings
```

---

### 7.4 — Master Scanner Orchestrator (Celery Task)

Barcha skanerlarni birlashtuvchi asosiy Celery task:

```python
# apps/scans/tasks.py

from celery import shared_task
from apps.scans.models import Scan, ScanStatusChoices
from apps.vulnerabilities.models import Vulnerability

@shared_task(bind=True, max_retries=2)
def run_scan(self, scan_id: int):
    """
    Master skan task — scan_type ga qarab tegishli skanerlarni ishlatadi.
    Progress real-time yangilanadi (0 → 100%).
    """
    scan = Scan.objects.get(id=scan_id)
    scan.status = ScanStatusChoices.RUNNING
    scan.started_at = timezone.now()
    scan.save()

    try:
        all_findings = []
        target = scan.target_url
        hostname = urlparse(target).hostname

        # ── Stage 1: Header Analysis (10%) ──
        scan.progress = 5; scan.save()
        header_scanner = HeaderAnalyzer()
        all_findings.extend(header_scanner.scan(target))
        scan.progress = 10; scan.save()

        # ── Stage 2: SSL Check (20%) ──
        ssl_checker = SSLChecker()
        all_findings.extend(ssl_checker.scan(hostname))
        scan.progress = 20; scan.save()

        # ── Stage 3: Port Scan (30%) ──
        if scan.scan_type in ["FULL", "OWASP"]:
            port_scanner = PortScanner()
            all_findings.extend(port_scanner.scan(hostname))
        scan.progress = 30; scan.save()

        # ── Stage 4: Nuclei Scan (60%) ──
        nuclei = NucleiScanner()
        results = nuclei.run_scan(target)
        for r in results:
            all_findings.append(nuclei.parse_result(r))
        scan.progress = 60; scan.save()

        # ── Stage 5: ZAP Scan (90%) — faqat FULL skan uchun ──
        if scan.scan_type == "FULL":
            zap = ZAPScanner()
            spider_id = zap.spider_scan(target)
            # Spider tugashini kutish...
            active_id = zap.active_scan(target)
            # Active scan tugashini kutish...
            alerts = zap.get_alerts(target)
            for alert in alerts:
                all_findings.append(zap.map_alert_to_vulnerability(alert))
        scan.progress = 90; scan.save()

        # ── Stage 6: Natijalarni DB ga yozish (100%) ──
        for finding in all_findings:
            Vulnerability.objects.create(
                scan=scan,
                title=finding["title"],
                description=finding.get("description", ""),
                severity=finding.get("severity", "INFO"),
                category=finding.get("category", "MISC"),
                affected_url=finding.get("affected_url", target),
                evidence=finding.get("evidence", ""),
                remediation=finding.get("remediation", ""),
                cvss_score=finding.get("cvss_score"),
                cve_id=finding.get("cve_id", ""),
                status="OPEN",
            )

        scan.status = ScanStatusChoices.COMPLETED
        scan.progress = 100
        scan.completed_at = timezone.now()
        scan.results_summary = {
            "total": len(all_findings),
            "critical": sum(1 for f in all_findings if f.get("severity") == "CRITICAL"),
            "high": sum(1 for f in all_findings if f.get("severity") == "HIGH"),
            "medium": sum(1 for f in all_findings if f.get("severity") == "MEDIUM"),
            "low": sum(1 for f in all_findings if f.get("severity") == "LOW"),
            "info": sum(1 for f in all_findings if f.get("severity") == "INFO"),
        }
        scan.save()

    except Exception as e:
        scan.status = ScanStatusChoices.FAILED
        scan.results_summary = {"error": str(e)}
        scan.save()
        raise self.retry(exc=e, countdown=60)
```

---

### 7.5 — Settings sozlamalari

```python
# core/settings.py ga qo'shish

# ── Scan Engine ──
ZAP_API_URL = os.getenv("ZAP_API_URL", "http://localhost:8090")
ZAP_API_KEY = os.getenv("ZAP_API_KEY", "sentinel-zap-key")
NUCLEI_PATH = os.getenv("NUCLEI_PATH", "nuclei")  # CLI path
SCAN_TIMEOUT = int(os.getenv("SCAN_TIMEOUT", "600"))  # 10 daqiqa
```

### 7.6 — Qo'shimcha pip paketlar

```txt
# requirements.txt ga qo'shish
python-owasp-zap-v2.4    # ZAP Python client (optional)
requests                   # HTTP requests (allaqachon bor)
```

### 7.7 — Docker Compose (ZAP + Redis + PostgreSQL)

```yaml
# docker-compose.yml
services:
  zap:
    image: ghcr.io/zaproxy/zaproxy:stable
    command: >
      zap.sh -daemon -host 0.0.0.0 -port 8080
      -config api.key=sentinel-zap-key
      -config api.addrs.addr.name=.*
      -config api.addrs.addr.regex=true
    ports:
      - "8090:8080"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sentinel_db
      POSTGRES_USER: sentinel
      POSTGRES_PASSWORD: sentinel_pass
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

---

## API Endpoints Xulosa

| # | Method | Endpoint | Tavsif |
|:--|:-------|:---------|:-------|
| 1 | POST | `/api/v1/auth/register/` | Ro'yxatdan o'tish |
| 2 | POST | `/api/v1/auth/login/` | JWT token olish |
| 3 | POST | `/api/v1/auth/token/refresh/` | Token yangilash |
| 4 | POST | `/api/v1/auth/logout/` | Chiqish |
| 5 | GET | `/api/v1/auth/me/` | Profil |
| 6 | PATCH | `/api/v1/auth/me/` | Tahrirlash |
| 7 | PATCH | `/api/v1/auth/change-password/` | Parol |
| 8 | GET | `/api/v1/scans/` | Skanlar |
| 9 | POST | `/api/v1/scans/` | Yangi skan |
| 10 | GET | `/api/v1/scans/{id}/` | Tafsilotlar |
| 11 | PATCH | `/api/v1/scans/{id}/cancel/` | Bekor |
| 12 | DELETE | `/api/v1/scans/{id}/` | O'chirish |
| 13 | GET | `/api/v1/scans/{id}/results/` | Natijalar |
| 14 | GET | `/api/v1/scans/stats/` | Statistika |
| 15-18 | CRUD | `/api/v1/scans/schedules/` | Rejalar |
| 19 | GET | `/api/v1/vulnerabilities/` | Zaifliklar |
| 20 | GET | `/api/v1/vulnerabilities/{id}/` | Tafsilotlar |
| 21 | PATCH | `/api/v1/vulnerabilities/{id}/` | Status |
| 22-24 | GET | `/api/v1/vulnerabilities/stats,by-category,by-severity/` | Statistika |
| 25-31 | CRUD | `/api/v1/assets/` | Aktivlar |
| 32-37 | CRUD | `/api/v1/reports/` | Hisobotlar |
| 38 | GET | `/api/v1/dashboard/overview/` | Dashboard |

**Jami: 38 ta API endpoint**

---

## Texnologiya Stack

| Komponent | Texnologiya |
|:----------|:------------|
| Framework | Django 5.x + DRF |
| Database | PostgreSQL |
| Auth | SimpleJWT (Bearer) |
| Task Queue | Celery + Redis |
| Scan Engine | OWASP ZAP + Nuclei + Python Custom |
| API Docs | drf-spectacular |
| Admin | Unfold |
| Monitoring | Sentry + Prometheus |
| Container | Docker Compose |

---

## Ish Tartibi

```
Faza 1 → Auth API (1 kun)
Faza 2 → Scans App (2 kun)
Faza 3 → Vulnerabilities App (1-2 kun)
Faza 4 → Assets App (1 kun)
Faza 5 → Reports App (1 kun)
Faza 6 → Dashboard API (1 kun)
Faza 7 → Skan Engine Integratsiya (2-3 kun)
Faza 8 → Frontend API Integratsiyasi (2-3 kun)
         → Axios API client, Interceptors, JWT boshqaruvi
         → React Query Hooks yaratish
         → Auth Context va himoyalangan routelar (Protected Routes)
         → Mock datalarni haqiqiy API ga almashtirish
```

**Umumiy: ~12-14 ish kuni**

---

## Faza 8: Frontend Integratsiyasi (Batafsil)

Frontend hozirda mock (qalbaki) ma'lumotlar bilan ishlamoqda. Uni yangi yozilgan backend API larimizga ulash rejamiz quyidagicha:

### 8.1 API Client va Axois Interceptors (`src/lib/api.ts`)
- Axios instance yaratish va `baseURL` ni `.env` orqali sozlash.
- **Request Interceptor**: Har bir so'rovga `Authorization: Bearer <token>` qo'shish.
- **Response Interceptor**: Agar 401 xatolik qaytsa, auto-refresh token logikasini joriy qilish va so'rovni qayta yuborish.

### 8.2 API Services va Types (`src/types/`, `src/services/`)
- Backend modellariga mos keluvchi TypeScript interfeyslarini yaratish (Masalan: `Scan`, `Vulnerability`, `DashboardStats`).
- Har bir modul uchun xizmat funksiyalarini yaratish:
    - `auth.service.ts` (login, register, refresh, me)
    - `scans.service.ts` (skanlar ro'yxati, yaratish, bekor qilish)
    - `vulnerabilities.service.ts` (zaifliklarni olish, statusni yangilash)
    - `dashboard.service.ts` (statistika)

### 8.3 React Query (Tanstack) Hooks (`src/hooks/queries/`)
- Interfeysni tezkor va keshlangan holda ishlashi uchun custom hook'lar yozish:
    - `useScans`, `useCreateScan`
    - `useVulnerabilities`
    - `useDashboardStats`

### 8.4 Auth va Routing Himoyasi
- `AuthContext` yaratish va foydalanuvchi holatini (user state) global boshqarish.
- `ProtectedRoute` komponentini yaratib, avtorizatsiyadan o'tmaganlarni `/` sahifaga yo'naltirish.
- `App.tsx` ga ulanish.

### 8.5 UI (Sahifalar) Integratsiyasi
- **Dashboard**: `DashboardPage.tsx` dagi statik raqamlarni `useDashboardStats` bilan almashtirish.
- **Scans**: `ScansListPage.tsx` jadvaliga API'dan kelgan `data` ni uzatish. Yangi skan boshlash formasini API ga ulash.
- **Vulnerabilities**: Ro'yxatni backend bilan sinxronlash imkoniyatini taqdim etish.
- **Assets & Reports**: Shu tarzda qolgan sahifalarni ham jonlantirish.

## User Review Required

> [!IMPORTANT]
> Skanerlash jarayonida (WebSocket yoki Polling usuli haqida): 
> Skanerlash (Scan) jarayonining `progress` foizini real-time ko'rsatish uchun hozirda `Polling` (har 3-5 soniyada request tashlab tekshirish) foydalanmoqchimiz, bu frontendda qilishga eng qulay va barqaror usul hisoblanadi. Agar Sizga majburiy WebSocket (Django Channels) orqali ishlashi talab etilmasa, ushbu arxitekturada qolamiz. Tasdiqlaysizmi?

---

## .env Namuna

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:8080
POSTGRES_DB=sentinel_db
POSTGRES_USER=sentinel
POSTGRES_PASSWORD=sentinel_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
```
