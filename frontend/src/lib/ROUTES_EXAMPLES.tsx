/**
 * ROUTE SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates how to use the centralized route system
 * throughout the application for type-safe navigation.
 * 
 * DELETE THIS FILE AFTER READING - It's for reference only!
 */

// ──────────────────────────────────────────────────────────────
// EXAMPLE 1: Basic Navigation
// ──────────────────────────────────────────────────────────────

import { useNavigation } from "@/hooks/useRoutes"
import ROUTES from "@/lib/routes"
import { Link, useNavigate } from "react-router-dom"

// Method 1: Using useNavigation hook (recommended)
export function DashboardLink() {
  const { navigate, to } = useNavigation();
  
  return (
    <button onClick={() => navigate(to.DASHBOARD.HOME)}>
      Go to Dashboard
    </button>
  );
}

// Method 2: Using useNavigate with ROUTES
export function ReportsLink() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate(ROUTES.REPORTS.LIST)}>
      View Reports
    </button>
  );
}

// Method 3: Using React Router Link component
export function AssetsLink() {
  return (
    <Link to={ROUTES.ASSETS.LIST}>
      Assets
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 2: Dynamic Routes with Parameters
// ──────────────────────────────────────────────────────────────

export function ScanDetailNavigation() {
  const { navigate, to } = useNavigation();
  const scanId = 123;
  
  return (
    <button onClick={() => navigate(to.SCANS.DETAIL(scanId))}>
      View Scan #{scanId}
    </button>
  );
}

export function VulnerabilityDetailNavigation() {
  const navigate = useNavigate();
  const vulnId = 456;
  
  return (
    <Link to={ROUTES.VULNERABILITIES.DETAIL(vulnId)}>
      View Vulnerability Details
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 3: Programmatic Navigation
// ──────────────────────────────────────────────────────────────

export function CreateScanButton() {
  const { navigate, to } = useNavigation();
  
  const handleCreateScan = async () => {
    // Do something...
    
    // Then navigate to new scan page
    navigate(to.SCANS.NEW);
    
    // Or navigate with replace (won't add to history)
    navigate(to.SCANS.NEW, { replace: true });
    
    // Or navigate with state
    navigate(to.DASHBOARD.HOME, {
      state: { message: "Scan created successfully!" }
    });
  };
  
  return <button onClick={handleCreateScan}>Create Scan</button>;
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 4: Navigation History
// ──────────────────────────────────────────────────────────────

export function NavigationControls() {
  const { navigate, back, forward } = useNavigation();
  
  return (
    <div>
      <button onClick={back}>← Back</button>
      <button onClick={forward}>Forward →</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 5: Breadcrumb Navigation
// ──────────────────────────────────────────────────────────────

export function BreadcrumbNavigation() {
  const { to } = useNavigation();
  
  const breadcrumbs = [
    { label: "Dashboard", path: to.DASHBOARD.HOME },
    { label: "Vulnerabilities", path: to.VULNERABILITIES.LIST },
    { label: "XSS Results", path: to.VULNERABILITIES.XSS },
  ];
  
  return (
    <nav>
      {breadcrumbs.map((item, idx) => (
        <span key={idx}>
          <Link to={item.path}>{item.label}</Link>
          {idx < breadcrumbs.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 6: List Navigation
// ──────────────────────────────────────────────────────────────

import { useState } from "react"

export function ScansList() {
  const [scans] = useState([
    { id: 1, name: "Production API" },
    { id: 2, name: "Staging Environment" },
  ]);
  
  return (
    <ul>
      {scans.map(scan => (
        <li key={scan.id}>
          <Link to={ROUTES.SCANS.DETAIL(scan.id)}>
            {scan.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 7: Conditional Navigation
// ──────────────────────────────────────────────────────────────

export function SmartNavigate() {
  const { navigate, to } = useNavigation();
  
  const handleScanComplete = (scanId: number, hasVulnerabilities: boolean) => {
    if (hasVulnerabilities) {
      navigate(to.VULNERABILITIES.LIST);
    } else {
      navigate(to.SCANS.DETAIL(scanId));
    }
  };
  
  return (
    <button onClick={() => handleScanComplete(123, true)}>
      Complete Scan
    </button>
  );
}

// ──────────────────────────────────────────────────────────────
// EXAMPLE 8: Route Metadata Usage
// ──────────────────────────────────────────────────────────────

import { ROUTE_METADATA } from "@/lib/routes"

export function PageTitle() {
  const location = window.location.pathname;
  const metadata = ROUTE_METADATA[location as keyof typeof ROUTE_METADATA];
  
  return <h1>{metadata?.title || "Unknown Page"}</h1>;
}

// ──────────────────────────────────────────────────────────────
// AVAILABLE ROUTES STRUCTURE
// ──────────────────────────────────────────────────────────────

/*
ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    ONBOARDING: "/onboarding",
    QUICKSTART: "/quickstart",
  },

  DASHBOARD: {
    HOME: "/app/dashboard",
    REALTIME: "/app/realtime",
    NOTIFICATIONS: "/app/notifications",
    ACTIVITY_LOGS: "/app/activity-logs",
  },

  SCANS: {
    LIST: "/app/scans",
    NEW: "/app/scans/new",
    DETAIL: (scanId) => `/app/scans/${scanId}`,
    SCHEDULE: "/app/scans/schedule",
    EMPTY: "/app/scans/empty",
    RESULTS: (id) => `/app/scans/${id}/results`,
  },

  VULNERABILITIES: {
    LIST: "/app/vulnerabilities",
    DETAIL: (id) => `/app/vulnerabilities/${id}`,
    XSS: "/app/vulnerabilities/xss",
    SQLI: "/app/vulnerabilities/sqli",
    HEADERS: "/app/vulnerabilities/headers",
  },

  ASSETS: {
    LIST: "/app/assets",
    NEW: "/app/assets/new",
    ATTACK_SURFACE: "/app/assets/attack-surface",
  },

  REPORTS: {
    LIST: "/app/reports",
    EXECUTIVE_BRIEF: "/app/reports/executive-brief",
  },

  SETTINGS: {
    ROOT: "/app/settings",
    INTEGRATIONS: "/app/settings/integrations",
    USERS: "/app/settings/users",
    BILLING: "/app/settings/billing",
    NODES: "/app/settings/nodes",
  },

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
}
*/

export default {
  DashboardLink,
  ReportsLink,
  AssetsLink,
  ScanDetailNavigation,
  VulnerabilityDetailNavigation,
  CreateScanButton,
  NavigationControls,
  BreadcrumbNavigation,
  ScansList,
  SmartNavigate,
  PageTitle,
};
