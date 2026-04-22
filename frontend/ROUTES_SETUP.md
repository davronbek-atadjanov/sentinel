## 🗺️ Frontend Routes System

Barcha frontend routes centralized bir joyda boshqarilmoqda. Type-safe navigation va 404 muammosu hal qilindi!

---

## 📋 Fayl Tarkibi

```
frontend/src/
├── lib/
│   ├── routes.ts              ✨ YANGI - Barcha routes constants
│   └── ROUTES_EXAMPLES.tsx    ✨ YANGI - Foydalanish misollar (delete qilsa bo'ladi)
├── hooks/
│   └── useRoutes.ts           ✨ YANGI - Type-safe navigation hook
└── App.tsx                    📝 Updated - Routes constants ishlatish
```

---

## 🚀 Qanday Ishlatish?

### 1️⃣ **Oddiy Navigation**

```typescript
import { useNavigation } from "@/hooks/useRoutes";

export function MyComponent() {
  const { navigate, to } = useNavigation();
  
  return (
    <button onClick={() => navigate(to.DASHBOARD.HOME)}>
      Dashboard'ga o'tish
    </button>
  );
}
```

### 2️⃣ **Dinamik Routes (ID bilan)**

```typescript
const scanId = 123;
navigate(to.SCANS.DETAIL(scanId));      // → /app/scans/123
navigate(to.VULNERABILITIES.DETAIL(45)); // → /app/vulnerabilities/45
```

### 3️⃣ **Link Components**

```typescript
import ROUTES from "@/lib/routes";
import { Link } from "react-router-dom";

<Link to={ROUTES.ASSETS.LIST}>Aktivlar</Link>
<Link to={ROUTES.REPORTS.EXECUTIVE_BRIEF}>Hisob</Link>
```

### 4️⃣ **Back/Forward Navigation**

```typescript
const { navigate, back, forward } = useNavigation();

<button onClick={back}>← Orqaga</button>
<button onClick={forward}>Oldinga →</button>
```

---

## 📍 Available Routes

### Public (Autentifikatsiyasiz)
- `/` - Home page
- `/login` - Login
- `/register` - Register
- `/onboarding` - Onboarding
- `/quickstart` - Quick start

### Dashboard
- `/app/dashboard` - Main dashboard
- `/app/realtime` - Real-time monitoring
- `/app/notifications` - Notifications
- `/app/activity-logs` - Activity logs

### Scans
- `/app/scans` - Scan list
- `/app/scans/new` - Create new scan
- `/app/scans/:scanId` - Scan details
- `/app/scans/:id/results` - Scan results
- `/app/scans/schedule` - Schedule scans
- `/app/scans/empty` - Empty state

### Vulnerabilities
- `/app/vulnerabilities` - All vulnerabilities
- `/app/vulnerabilities/:id` - Vulnerability detail
- `/app/vulnerabilities/xss` - XSS vulnerabilities
- `/app/vulnerabilities/sqli` - SQLi vulnerabilities
- `/app/vulnerabilities/headers` - Header analysis

### Assets
- `/app/assets` - Assets list
- `/app/assets/new` - Create asset
- `/app/assets/attack-surface` - Attack surface

### Reports
- `/app/reports` - Reports list
- `/app/reports/executive-brief` - Executive brief

### Settings
- `/app/settings/integrations` - Integrations
- `/app/settings/users` - User management
- `/app/settings/billing` - Billing
- `/app/settings/nodes` - Node manager

### AI
- `/app/ai` - AI Hub
- `/app/ai/payload-lab` - Payload Lab
- `/app/ai/threat-hunting` - Threat Hunting
- `/app/ai/evidence` - Evidence Analysis
- `/app/ai/remediation` - Remediation Copilot
- `/app/ai/predictive` - Predictive Modeling
- `/app/ai/red-team` - Red Team
- `/app/ai/smart-fix` - Smart Remediation

---

## ✅ 404 Muammosi Hal Qilindi!

**Eski** (Frontend deploy qilganda boshqa path'da 404 berayabdi):
```nginx
location / {
    return 404;  # ❌ Hammi path'da 404
}
```

**Yangi** (SPA routing to'g'ri ishlamoqda):
```nginx
location / {
    try_files $uri $uri/ /index.html;  # ✅ React Router ishlaydi
}
```

**Natija:** `example.com/app/scans` yoki boshqa path'da kirgan vaqtda 404 o'rniga to'g'ri sahifa ochiladi!

---

## 🔧 Nginx Configuration (SPA Routing)

`nginx/default.conf` da 2 ta server block bor:

### Backend Server (api.example.com)
- API requests → Django backend
- Admin panel
- Static/Media files
- Qolgan barcha requests → 404

### Frontend Server (example.com / web.example.com)
- All static files (CSS, JS, images)
- SPA routing → index.html
- API proxy
- Security headers

---

## 💡 Qanday Qilindi?

### Files Created:
1. **`src/lib/routes.ts`** - Centralized routes constants
2. **`src/hooks/useRoutes.ts`** - Navigation hook
3. **`src/lib/ROUTES_EXAMPLES.tsx`** - Usage examples
4. **`nginx/default.conf`** - Updated with SPA routing

### Files Updated:
1. **`src/App.tsx`** - Using ROUTES constants instead of hardcoded strings

---

## 🛡️ Security Headers Added

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 📦 Cache Strategy

| File Type | Expiry | Strategy |
|-----------|--------|----------|
| JS/CSS/Images | 30 days | Cache forever |
| HTML | No cache | Always fresh |
| API requests | Per response | Vary |

---

## 🧹 Cleanup

Delete `src/lib/ROUTES_EXAMPLES.tsx` - it's only for reference!

```bash
rm frontend/src/lib/ROUTES_EXAMPLES.tsx
```

---

## ✨ Qanday Qilish Kerak Production'da

1. **nginx config** - o'z domain'ini qo'yish:
```nginx
server_name web.example.com www.example.com example.com;
root /var/www/frontend/dist;  # Frontend build path
```

2. **Docker Compose** - nginx service va frontend volume:
```yaml
frontend:
  build: ./frontend
  volumes:
    - ./frontend/dist:/var/www/frontend/dist

nginx:
  volumes:
    - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
```

3. **Build & Deploy**:
```bash
cd frontend && npm run build
docker-compose up -d
```

---

## 🎯 Natija

✅ Type-safe routes  
✅ No more hardcoded URLs  
✅ 404 SPA routing fixed  
✅ Easy navigation everywhere  
✅ IDE autocomplete support  
✅ Centralized route management  

**Hozirda barcha path'lar to'g'ri ishlashi kerak!** 🚀
