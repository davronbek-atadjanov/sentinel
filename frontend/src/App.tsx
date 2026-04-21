import { Toaster as Sonner } from "@/components/ui/sonner"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

/* ── Layouts ── */
import DashboardLayout from "@/components/layout/DashboardLayout"

/* ── Public Pages ── */
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"

/* ── Auth Providers & Guards ── */
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { ErrorBoundary } from "./components/shared/ErrorBoundary"

/* ── Standalone Pages ── */
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const QuickstartPage = lazy(() => import("./pages/QuickstartPage"));

/* ── Dashboard ── */
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const NotificationsPage = lazy(() => import("./pages/dashboard/NotificationsPage"));
const ActivityLogsPage = lazy(() => import("./pages/dashboard/ActivityLogsPage"));
const RealTimeDashboardPage = lazy(() => import("./pages/dashboard/RealTimeDashboardPage"));

/* ── Scans ── */
const ScansListPage = lazy(() => import("./pages/scans/ScansListPage"));
const ScanConfigPage = lazy(() => import("./pages/scans/ScanConfigPage"));
const ScanSchedulingPage = lazy(() => import("./pages/scans/ScanSchedulingPage"));
const OwaspZapResultsPage = lazy(() => import("./pages/scans/OwaspZapResultsPage"));
const EmptyStatePage = lazy(() => import("./pages/scans/EmptyStatePage"));

/* ── Vulnerabilities ── */
const VulnerabilitiesListPage = lazy(() => import("./pages/vulnerabilities/VulnerabilitiesListPage"));
const VulnerabilityDetailPage = lazy(() => import("./pages/vulnerabilities/VulnerabilityDetailPage"));
const XssResultsPage = lazy(() => import("./pages/vulnerabilities/XssResultsPage"));
const SqliResultsPage = lazy(() => import("./pages/vulnerabilities/SqliResultsPage"));
const HeaderAnalyzerPage = lazy(() => import("./pages/vulnerabilities/HeaderAnalyzerPage"));

/* ── Assets ── */
const AssetsPage = lazy(() => import("./pages/assets/AssetsPage"));
const AssetConfigPage = lazy(() => import("./pages/assets/AssetConfigPage"));
const AttackSurfacePage = lazy(() => import("./pages/assets/AttackSurfacePage"));

/* ── Reports ── */
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const ExecutiveBriefPage = lazy(() => import("./pages/reports/ExecutiveBriefPage"));

/* ── Settings ── */
const IntegrationsPage = lazy(() => import("./pages/settings/IntegrationsPage"));
const UserManagementPage = lazy(() => import("./pages/settings/UserManagementPage"));
const BillingPage = lazy(() => import("./pages/settings/BillingPage"));
const NodeManagerPage = lazy(() => import("./pages/settings/NodeManagerPage"));

/* ── AI ── */
const AIHubPage = lazy(() => import("./pages/ai/AIHubPage"));
const PayloadLabPage = lazy(() => import("./pages/ai/PayloadLabPage"));
const ThreatHuntingPage = lazy(() => import("./pages/ai/ThreatHuntingPage"));
const EvidenceAnalysisPage = lazy(() => import("./pages/ai/EvidenceAnalysisPage"));
const RemediationCopilotPage = lazy(() => import("./pages/ai/RemediationCopilotPage"));
const PredictiveModelingPage = lazy(() => import("./pages/ai/PredictiveModelingPage"));
const RedTeamPage = lazy(() => import("./pages/ai/RedTeamPage"));
const SmartRemediationPage = lazy(() => import("./pages/ai/SmartRemediationPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-on-surface-variant">Initializing module...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              {/* ── Public ── */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/quickstart" element={<QuickstartPage />} />

              {/* ── Dashboard App ── */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="realtime" element={<RealTimeDashboardPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="activity-logs" element={<ActivityLogsPage />} />

                  {/* Scans */}
                  <Route path="scans" element={<ScansListPage />} />
                  <Route path="scans/new" element={<ScanConfigPage />} />
                  <Route path="scans/schedule" element={<ScanSchedulingPage />} />
                  <Route path="scans/empty" element={<EmptyStatePage />} />
                  <Route path="scans/:id/results" element={<OwaspZapResultsPage />} />

                  {/* Vulnerabilities */}
                  <Route path="vulnerabilities" element={<VulnerabilitiesListPage />} />
                  <Route path="vulnerabilities/:id" element={<VulnerabilityDetailPage />} />
                  <Route path="vulnerabilities/xss" element={<XssResultsPage />} />
                  <Route path="vulnerabilities/sqli" element={<SqliResultsPage />} />
                  <Route path="vulnerabilities/headers" element={<HeaderAnalyzerPage />} />

                  {/* Assets */}
                  <Route path="assets" element={<AssetsPage />} />
                  <Route path="assets/new" element={<AssetConfigPage />} />
                  <Route path="assets/attack-surface" element={<AttackSurfacePage />} />

                  {/* Reports */}
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="reports/executive-brief" element={<ExecutiveBriefPage />} />

                  {/* Settings */}
                  <Route path="settings" element={<Navigate to="/app/settings/integrations" replace />} />
                  <Route path="settings/integrations" element={<IntegrationsPage />} />
                  <Route path="settings/users" element={<UserManagementPage />} />
                  <Route path="settings/billing" element={<BillingPage />} />
                  <Route path="settings/nodes" element={<NodeManagerPage />} />

                  {/* AI */}
                  <Route path="ai" element={<AIHubPage />} />
                  <Route path="ai/payload-lab" element={<PayloadLabPage />} />
                  <Route path="ai/threat-hunting" element={<ThreatHuntingPage />} />
                  <Route path="ai/evidence" element={<EvidenceAnalysisPage />} />
                  <Route path="ai/remediation" element={<RemediationCopilotPage />} />
                  <Route path="ai/predictive" element={<PredictiveModelingPage />} />
                  <Route path="ai/red-team" element={<RedTeamPage />} />
                  <Route path="ai/smart-fix" element={<SmartRemediationPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
