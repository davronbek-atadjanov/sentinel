/**
 * Centralized Application Routes
 * All frontend routes defined in one place for easy navigation and documentation
 * Usage: navigate(ROUTES.DASHBOARD.HOME)
 */

export const ROUTES = {
  /* ── PUBLIC ROUTES ── */
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    ONBOARDING: "/onboarding",
    QUICKSTART: "/quickstart",
  },

  /* ── APP ROUTES ── */
  APP: {
    ROOT: "/app",
    REDIRECT: "/app/dashboard",
  },

  /* ── DASHBOARD ── */
  DASHBOARD: {
    HOME: "/app/dashboard",
    REALTIME: "/app/realtime",
    NOTIFICATIONS: "/app/notifications",
    ACTIVITY_LOGS: "/app/activity-logs",
  },

  /* ── SCANS ── */
  SCANS: {
    LIST: "/app/scans",
    NEW: "/app/scans/new",
    DETAIL: (scanId: string | number) => `/app/scans/${scanId}`,
    SCHEDULE: "/app/scans/schedule",
    EMPTY: "/app/scans/empty",
    RESULTS: (id: string | number) => `/app/scans/${id}/results`,
  },

  /* ── VULNERABILITIES ── */
  VULNERABILITIES: {
    LIST: "/app/vulnerabilities",
    DETAIL: (id: string | number) => `/app/vulnerabilities/${id}`,
    XSS: "/app/vulnerabilities/xss",
    SQLI: "/app/vulnerabilities/sqli",
    HEADERS: "/app/vulnerabilities/headers",
  },

  /* ── ASSETS ── */
  ASSETS: {
    LIST: "/app/assets",
    NEW: "/app/assets/new",
    ATTACK_SURFACE: "/app/assets/attack-surface",
  },

  /* ── REPORTS ── */
  REPORTS: {
    LIST: "/app/reports",
    EXECUTIVE_BRIEF: "/app/reports/executive-brief",
  },

  /* ── SETTINGS ── */
  SETTINGS: {
    ROOT: "/app/settings",
    INTEGRATIONS: "/app/settings/integrations",
    USERS: "/app/settings/users",
    BILLING: "/app/settings/billing",
    NODES: "/app/settings/nodes",
  },

  /* ── AI ── */
  AI: {
    HUB: "/app/ai",
    PAYLOAD_LAB: "/app/ai/payload-lab",
    THREAT_HUNTING: "/app/ai/threat-hunting",
    EVIDENCE: "/app/ai/evidence",
    REMEDIATION: "/app/ai/remediation",
    PREDICTIVE: "/app/ai/predictive",
    RED_TEAM: "/app/ai/red-team",
    SMART_FIX: "/app/ai/smart-fix",
  },

  /* ── 404 FALLBACK ── */
  NOT_FOUND: "*",
};

/**
 * Protected Routes - Routes that require authentication
 * Automatically wrapped by ProtectedRoute component
 */
export const PROTECTED_ROUTE_PATTERNS = [
  "/app",
];

/**
 * Navigation Helper - Type-safe navigation
 * Usage: navigate(ROUTES.DASHBOARD.HOME)
 * Or with params: navigate(ROUTES.SCANS.DETAIL("123"))
 */
export const createRouteLink = (path: string | (() => string)): string => {
  return typeof path === "function" ? path() : path;
};

/**
 * Check if route is protected
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTE_PATTERNS.some(pattern => pathname.startsWith(pattern));
};

/**
 * Get parent route from current pathname
 * Useful for breadcrumb navigation
 */
export const getParentRoute = (pathname: string): string | null => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return null;
  return "/" + parts.slice(0, -1).join("/");
};

/**
 * Get route segment name
 * Useful for page titles and breadcrumbs
 */
export const getRouteSegmentName = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "home";
};

/**
 * Route metadata for documentation and navigation
 */
export const ROUTE_METADATA = {
  [ROUTES.PUBLIC.HOME]: { title: "Bosh Sahifa", public: true },
  [ROUTES.PUBLIC.LOGIN]: { title: "Kirish", public: true },
  [ROUTES.PUBLIC.REGISTER]: { title: "Ro'yxatdan O'tish", public: true },
  [ROUTES.PUBLIC.ONBOARDING]: { title: "Boshlanish", public: true },
  [ROUTES.PUBLIC.QUICKSTART]: { title: "Tezkor Boshlanish", public: true },

  [ROUTES.DASHBOARD.HOME]: { title: "Bosh Tablo", icon: "home" },
  [ROUTES.DASHBOARD.REALTIME]: { title: "Real Vaqt", icon: "activity" },
  [ROUTES.DASHBOARD.NOTIFICATIONS]: { title: "Bildirishnomalar", icon: "bell" },
  [ROUTES.DASHBOARD.ACTIVITY_LOGS]: { title: "Faoliyat Jurnali", icon: "log" },

  [ROUTES.SCANS.LIST]: { title: "Skanerlashlar", icon: "scan" },
  [ROUTES.SCANS.NEW]: { title: "Yangi Skan", icon: "plus" },
  [ROUTES.SCANS.SCHEDULE]: { title: "Rejalashtirlash", icon: "calendar" },

  [ROUTES.VULNERABILITIES.LIST]: { title: "Zaifliklar", icon: "alert" },
  [ROUTES.VULNERABILITIES.XSS]: { title: "XSS Natijalari", icon: "alert" },
  [ROUTES.VULNERABILITIES.SQLI]: { title: "SQLi Natijalari", icon: "alert" },
  [ROUTES.VULNERABILITIES.HEADERS]: { title: "Header Tahlili", icon: "alert" },

  [ROUTES.ASSETS.LIST]: { title: "Aktivlar", icon: "box" },
  [ROUTES.ASSETS.NEW]: { title: "Yangi Aktiv", icon: "plus" },
  [ROUTES.ASSETS.ATTACK_SURFACE]: { title: "Hujum Yuzi", icon: "target" },

  [ROUTES.REPORTS.LIST]: { title: "Hisobotlar", icon: "document" },
  [ROUTES.REPORTS.EXECUTIVE_BRIEF]: { title: "Xulosa", icon: "briefcase" },

  [ROUTES.SETTINGS.INTEGRATIONS]: { title: "Integratsiyalar", icon: "link" },
  [ROUTES.SETTINGS.USERS]: { title: "Foydalanuvchilar", icon: "users" },
  [ROUTES.SETTINGS.BILLING]: { title: "Hisob", icon: "credit" },
  [ROUTES.SETTINGS.NODES]: { title: "Tugunlar", icon: "server" },

  [ROUTES.AI.HUB]: { title: "AI Markas", icon: "zap" },
  [ROUTES.AI.PAYLOAD_LAB]: { title: "Payload Lab", icon: "flask" },
  [ROUTES.AI.THREAT_HUNTING]: { title: "Xavf Qidirish", icon: "crosshair" },
  [ROUTES.AI.REMEDIATION]: { title: "Tuzatish", icon: "wrench" },
};

export default ROUTES;
