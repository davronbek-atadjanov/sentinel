import {
  Settings2,
  Bug,
  ShieldCheck,
  Globe,
  Cloud,
  Database,
  AlertTriangle,
  FileText,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import MetricCard from "@/components/shared/MetricCard";
import SeverityBadge from "@/components/shared/SeverityBadge";
import StatusBadge from "@/components/shared/StatusBadge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";

/* ── Mock Data Defaults (Fallback) ── */
const recentScans = [
  {
    id: 1,
    name: "api-main.sentinel.com",
    icon: Globe,
    status: "completed" as const,
    found: "08",
    time: "2 mins ago",
  },
  {
    id: 2,
    name: "stage-environment-02",
    icon: Cloud,
    status: "running" as const,
    found: "--",
    time: "Just now",
  },
  {
    id: 3,
    name: "user-db-cluster-east",
    icon: Database,
    status: "failed" as const,
    found: "--",
    time: "1 hour ago",
  },
];

const criticalAlerts = [
  {
    id: 1,
    title: "SQL Injection - Endpoint /auth",
    cve: "CVE-2024-8832",
    description: "Critical bypass found in production authentication handler.",
    primaryAction: "Remediate Now",
    secondaryAction: "Ignore",
  },
  {
    id: 2,
    title: "Remote Code Execution (RCE)",
    cve: "CVE-2023-4512",
    description: "Possible payload injection through file upload module.",
    primaryAction: "Patch Instance",
    secondaryAction: "View Logs",
  },
];

const defaultThreatData = [40, 35, 55, 45, 65, 40, 30, 75, 50, 40, 85, 45];

const DashboardPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: DashboardService.getOverview,
  });

  const stats = dashboardData?.success ? dashboardData.data : null;

  const displayScans = stats 
    ? (stats.recent_activity || []).map((s: any) => ({
        id: s.id,
        name: s.target_url,
        icon: Globe,
        status: s.status.toLowerCase() as any,
        found: s.progress === 100 ? "Done" : "--",
        time: new Date(s.created_at).toLocaleDateString(),
      }))
    : recentScans;

  const threatData = stats
    ? (stats.threat_trajectory?.length 
        ? stats.threat_trajectory.map((t: any) => Math.min((t.count * 10), 100))
        : []) // Empty array for empty DB
    : defaultThreatData;

  const activeAlerts = stats 
    ? (stats.critical_alerts || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        cve: a.cve_id || "NEW",
        description: a.description || "Critical vulnerability detected affecting this endpoint.",
        primaryAction: "Remediate Now",
        secondaryAction: "Ignore",
    }))
    : criticalAlerts;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Security Overview"
        description="Global threat landscape and real-time scanning analytics."
        actions={
          <>
            <button className="bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              Export Report
            </button>
            <Link
              to="/app/scans/new"
              className="bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-lg shadow-primary/10 hover:brightness-110 transition-all"
            >
              New Scan Instance
            </Link>
          </>
        }
      />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Column: Summary Cards ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Security Score Card */}
          <div className="bg-surface-low rounded-xl p-8 border-ghost relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10" />
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 font-label">
              Overall Integrity
            </p>
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-6xl font-bold font-headline text-white tracking-tighter">
                {stats?.security_score ?? 94}
              </span>
              <span className="text-xl font-semibold text-[hsl(215,15%,35%)] font-headline">
                /100
              </span>
            </div>
            <div className="w-full h-1.5 bg-[hsl(222,30%,12%)] rounded-full mb-6">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                style={{ 
                  width: `${stats?.security_score ?? 94}%`,
                  boxShadow: "0 0 12px hsla(200, 100%, 74%, 0.4)" 
                }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(215,15%,55%)]">
                Current Health: <span className="text-primary font-bold">EXCELLENT</span>
              </span>
              <span className="text-[hsl(215,15%,40%)]">+1.2% from last week</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-6">
            <MetricCard label="Total Scans" value={(stats?.total_scans ?? "1,284").toString()} icon={Settings2} />
            <MetricCard
              label="Open Vulns"
              value={(stats?.open_vulnerabilities ?? "42").toString()}
              icon={Bug}
              iconColor="text-sentinel-error"
            />
          </div>
        </div>

        {/* ── Right Column: Threat Trajectory ── */}
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl p-8 border-ghost flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold font-headline text-white">Threat Trajectory</h3>
              <p className="text-xs text-[hsl(215,15%,40%)]">
                Vulnerability detection trends (Last 30 Days)
              </p>
            </div>
            <div className="flex gap-1 bg-[hsl(222,30%,6%,0.5)] p-1 rounded-lg">
              <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-[hsl(222,25%,15%)] rounded shadow-sm">
                30D
              </button>
              <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,40%)] hover:text-[hsl(215,20%,70%)]">
                90D
              </button>
              <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,40%)] hover:text-[hsl(215,20%,70%)]">
                1Y
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 flex items-end gap-2 min-h-[200px]">
            {threatData.length > 0 ? (
              threatData.map((height: number, i: number) => {
                const isHighlight = height >= 65;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all hover:opacity-80 cursor-pointer ${
                      isHighlight
                        ? "bg-primary/40 border-t-2 border-primary"
                        : "bg-primary/20"
                    }`}
                    style={{
                      height: `${height}%`,
                      boxShadow: isHighlight
                        ? "0 0 15px hsla(200, 100%, 74%, 0.1)"
                        : undefined,
                    }}
                  />
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center text-[hsl(215,15%,45%)] text-sm h-full">
                No vulnerabilities detected yet. Start a scan to build your threat trajectory.
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4 border-t border-[hsl(222,20%,12%,0.5)] pt-4">
            <span className="text-[10px] text-[hsl(215,15%,30%)] font-semibold">30 DAYS AGO</span>
            <span className="text-[10px] text-[hsl(215,15%,30%)] font-semibold">TODAY</span>
          </div>
        </div>

        {/* ── Recent Scans Table ── */}
        <div className="col-span-12 lg:col-span-7 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] flex justify-between items-center bg-surface-high/30">
            <h3 className="font-bold font-headline text-white">Recent Activity</h3>
            <Link
              to="/app/scans"
              className="text-xs text-primary font-semibold hover:underline"
            >
              View All Scans
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-[hsl(215,15%,40%)] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Found</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {displayScans.length > 0 ? (
                  displayScans.map((scan: any) => (
                    <tr
                      key={scan.id}
                      className="hover:bg-[hsl(222,30%,6%,0.4)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[hsl(222,25%,12%)] flex items-center justify-center text-[hsl(215,15%,45%)]">
                            <scan.icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-[hsl(215,20%,85%)]">{scan.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={scan.status} />
                      </td>
                      <td className="px-6 py-4 text-[hsl(215,15%,55%)] font-medium">{scan.found}</td>
                      <td className="px-6 py-4 text-[hsl(215,15%,40%)] text-xs">{scan.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No recent scans. Create a new scan to see activity here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Critical Intelligence ── */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-xl p-6 border border-sentinel-error/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-threat rounded-full blur-xl opacity-40" />
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold font-headline text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-sentinel-error" />
                Critical Intelligence
              </h3>
              <span className="bg-error-container text-on-error-container text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                Action Required
              </span>
            </div>
            <div className="space-y-4">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert: any) => (
                  <div
                    key={alert.id}
                    className="bg-[hsl(222,60%,4%,0.4)] rounded-lg p-4 border-l-4 border-sentinel-error"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-[hsl(215,20%,85%)] truncate pr-2">{alert.title}</h4>
                      <span className="text-[10px] font-mono whitespace-nowrap text-sentinel-error bg-sentinel-error/10 px-1.5 rounded">
                        {alert.cve}
                      </span>
                    </div>
                    <p className="text-xs text-[hsl(215,15%,40%)] mb-3 line-clamp-2">{alert.description}</p>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold text-white bg-sentinel-error-container px-3 py-1 rounded hover:brightness-110 transition-all">
                        {alert.primaryAction}
                      </button>
                      <button className="text-[10px] font-bold text-[hsl(215,15%,55%)] border border-[hsl(222,20%,18%)] px-3 py-1 rounded hover:bg-[hsl(222,25%,12%)]">
                        {alert.secondaryAction}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6 text-primary opacity-60" />
                  </div>
                  <p className="text-sm text-foreground font-medium">No critical threats found</p>
                  <p className="text-xs text-[hsl(215,15%,45%)] mt-1">Your infrastructure looks secure.</p>
                </div>
              )}
            </div>
          </div>

          {/* System Compliance Widget */}
          <div className="bg-surface-container rounded-xl p-6 border-ghost flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">System Compliance</p>
                <p className="text-[10px] text-[hsl(215,15%,40%)]">SOC2 Type II Standard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{stats?.compliance_score ?? 92}%</p>
              <p className="text-[10px] text-[hsl(215,15%,30%)] font-semibold">ADHERENCE</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Cards ── */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Latest Coverage", value: "Network Perimeter:", highlight: "85%", suffix: " Scan Density" },
          { title: "Threat Origin", value: "Primarily:", highlight: "Cloud Assets (62%)", suffix: "", isError: true },
          { title: "Processing Load", value: "Cluster Alpha:", highlight: "Normal", suffix: "" },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-surface-low to-surface-container rounded-xl p-6 border border-white/5 flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-lg bg-surface-high/50 flex items-center justify-center">
              <Zap className="w-8 h-8 text-[hsl(215,15%,30%)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[hsl(215,15%,40%)] uppercase tracking-widest mb-1">
                {card.title}
              </h4>
              <p className="text-sm text-[hsl(215,20%,85%)] font-medium">
                {card.value}{" "}
                <span className={card.isError ? "text-sentinel-tertiary" : "text-primary"}>
                  {card.highlight}
                </span>
                {card.suffix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
