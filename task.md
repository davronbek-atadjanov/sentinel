# Sentinel Backend — Task List

> Implementation Plan asosida. Har bir task tugagandan so'ng `[x]` bilan belgilanadi.

---

## Faza 0: Loyiha Setup
- [x] 0.1. `.env` fayl yaratish (PostgreSQL, Redis, ZAP credentials)
- [x] 0.2. `pyproject.toml` yangilash (django-filter, requests, reportlab)
- [x] 0.3. `docker-compose.yml` yangilash (Redis uncomment, Celery worker, ZAP container)
- [ ] 0.4. Docker containerlarni ishga tushirish va tekshirish
- [ ] 0.5. `python manage.py migrate` — boshlang'ich migratsiya
- [ ] 0.6. Superuser yaratish

---

## Faza 1: Auth API (users app)
- [x] 1.1. `RegisterSerializer` yaratish (email, username, password, password_confirm)
- [x] 1.2. `LoginSerializer` yaratish (email, password → access/refresh token)
- [x] 1.3. `ProfileSerializer` yaratish (GET/PATCH profil)
- [x] 1.4. `ChangePasswordSerializer` yaratish
- [x] 1.5. `RegisterView` — POST /api/v1/auth/register/
- [x] 1.6. `LoginView` — POST /api/v1/auth/login/
- [x] 1.7. `LogoutView` — POST /api/v1/auth/logout/
- [x] 1.8. Token refresh endpoint ulash (SimpleJWT built-in)
- [x] 1.9. `ProfileView` — GET/PATCH /api/v1/auth/me/
- [x] 1.10. `ChangePasswordView` — PATCH /api/v1/auth/change-password/
- [x] 1.11. `users/api/v1/urls.py` — routelar yozish
- [x] 1.12. `core/urls.py` ga `api/v1/auth/` path qo'shish
- [x] 1.13. Swagger'da test qilish
- [x] 1.14. Auth unit testlar yozish

---

## Faza 2: Scans App
- [x] 2.1. `python manage.py makeapp scans` — app yaratish
- [x] 2.2. `core/config/apps.py` ga `apps.scans` qo'shish
- [x] 2.3. `Scan` model yaratish (user, target_url, scan_type, status, progress, config, results_summary)
- [x] 2.4. `ScanSchedule` model yaratish (user, target_url, frequency, next_run, is_active)
- [ ] 2.5. `makemigrations` + `migrate`
- [x] 2.6. `ScanSerializer` va `ScanCreateSerializer` yaratish
- [x] 2.7. `ScheduleSerializer` yaratish
- [x] 2.8. `ScanViewSet` — LIST, CREATE, RETRIEVE, DELETE + cancel action + results action + stats action
- [x] 2.9. `ScheduleViewSet` — CRUD
- [x] 2.10. `scans/api/v1/urls.py` — routelar (Router)
- [x] 2.11. `core/urls.py` ga `api/v1/scans/` path qo'shish
- [x] 2.12. `scans/admin/scans.py` — Unfold admin sozlash
- [ ] 2.13. Swagger'da test qilish

---

## Faza 3: Vulnerabilities App
- [x] 3.1. `python manage.py makeapp vulnerabilities` — app yaratish
- [x] 3.2. `core/config/apps.py` ga qo'shish
- [x] 3.3. `Vulnerability` model yaratish (scan, title, description, severity, status, category, affected_url, evidence, remediation, cvss_score, cve_id, assigned_to)
- [ ] 3.4. `makemigrations` + `migrate`
- [x] 3.5. `VulnerabilitySerializer` yaratish
- [x] 3.6. `VulnerabilityFilter` yaratish (django-filter — severity, status, category)
- [x] 3.7. `VulnerabilityViewSet` — LIST, RETRIEVE, PARTIAL_UPDATE + stats + by-category + by-severity
- [x] 3.8. `vulnerabilities/api/v1/urls.py` — routelar
- [x] 3.9. `core/urls.py` ga path qo'shish
- [x] 3.10. Admin sozlash
- [ ] 3.11. Swagger'da test qilish

---

## Faza 4: Assets App
- [x] 4.1. `python manage.py makeapp assets` — app yaratish
- [x] 4.2. `core/config/apps.py` ga qo'shish
- [x] 4.3. `Asset` model yaratish (user, name, url, asset_type, is_active, last_scan, risk_score, technologies, metadata)
- [ ] 4.4. `makemigrations` + `migrate`
- [x] 4.5. `AssetSerializer` yaratish
- [x] 4.6. `AssetViewSet` — CRUD + history + attack-surface
- [x] 4.7. `assets/api/v1/urls.py` — routelar
- [x] 4.8. `core/urls.py` ga path qo'shish
- [x] 4.9. Admin sozlash
- [ ] 4.10. Swagger'da test qilish

---

## Faza 5: Reports App
- [x] 5.1. `python manage.py makeapp reports` — app yaratish
- [x] 5.2. `core/config/apps.py` ga qo'shish
- [x] 5.3. `Report` model yaratish (user, title, report_type, scan, data, file, generated_at)
- [ ] 5.4. `makemigrations` + `migrate`
- [x] 5.5. `ReportSerializer` yaratish
- [x] 5.6. `ReportViewSet` — LIST, CREATE (generate), RETRIEVE, DELETE + download + compliance
- [x] 5.7. `generate_report` Celery task yaratish (PDF generatsiya)
- [x] 5.8. `reports/api/v1/urls.py` — routelar
- [x] 5.9. `core/urls.py` ga path qo'shish
- [x] 5.10. Admin sozlash
- [ ] 5.11. Swagger'da test qilish

---

## Faza 6: Dashboard API
- [x] 6.1. `DashboardOverviewView` yaratish (shared yoki alohida)
- [x] 6.2. Barcha modellardan statistika yig'ish logikasi
- [x] 6.3. `/api/v1/dashboard/overview/` endpoint
- [ ] 6.4. Response formatini test qilish

---

## Faza 7: Haqiqiy Skan Engine
- [x] 7.1. Docker Compose'ga OWASP ZAP container qo'shish
- [x] 7.2. `ZAPScanner` service class yaratish (spider_scan, active_scan, get_alerts)
- [ ] 7.3. ZAP integratsiyani test qilish (oddiy saytga skan)
- [x] 7.4. Nuclei o'rnatish (Docker yoki CLI)
- [x] 7.5. `NucleiScanner` service class yaratish (run_scan, parse_result)
- [ ] 7.6. Nuclei integratsiyani test qilish
- [x] 7.7. Python custom skanerlar yaratish:
  - [x] 7.7.1. `XSSScanner` — Reflected XSS detection
  - [x] 7.7.2. `SQLiScanner` — Error-based SQLi detection
  - [x] 7.7.3. `HeaderAnalyzer` — Missing security headers
  - [x] 7.7.4. `SSLChecker` — Certificate expiry + TLS config
  - [x] 7.7.5. `PortScanner` — Common ports scanning
- [x] 7.8. `run_scan` Celery master task yaratish (orchestrator)
- [x] 7.9. Progress tracking mexanizmi (Scan.progress real-time yangilash)
- [x] 7.10. `settings.py` ga skan engine sozlamalar qo'shish (ZAP_API_URL, NUCLEI_PATH)
- [ ] 7.11. End-to-end test — POST /scans/ → Celery → skanerlash → natijalar DB'da

---

## Faza 8: Yakuniy integratsiya va test
- [ ] 8.1. Barcha API endpointlarni Swagger'da yakuniy tekshirish
- [x] 8.2. Frontend'ga API service layer yaratish (axios instance + interceptors)
- [x] 8.3. Frontend sahifalarni real API'ga ulash (auth, scans, vulnerabilities)
- [x] 8.4. CORS sozlamalarni production uchun tekshirish
- [x] 8.5. Error handling va edge case'larni tekshirish
