import PageHeader from "@/components/shared/PageHeader";
import {
  Clock,
  User,
  Shield,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Settings,
  Radar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { format } from "date-fns";

const ActivityLogsPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: () => DashboardService.getOverview(),
  });

  const stats = dashboardData?.data;

  // Aggregate recent scans and critical alerts into a unified format
  const aggregatedLogs: any[] = [];

  if (stats?.recent_activity) {
    stats.recent_activity.forEach((scan: any) => {
      aggregatedLogs.push({
        id: `scan-${scan.id}`,
        time: new Date(scan.created_at),
        user: "System Scanner",
        action: `Initiated ${scan.scan_type || "auto"} scan`,
        target: scan.target_url,
        type: "scan",
        icon: Radar,
        iconColor: "text-primary",
      });
    });
  }

  if (stats?.critical_alerts) {
    stats.critical_alerts.forEach((alert: any) => {
      aggregatedLogs.push({
        id: `vuln-${alert.id}`,
        time: new Date(), // Mock time as critical alerts API misses created_at currently
        user: "System",
        action: `Critical vulnerability: ${alert.title}`,
        target: alert.affected_url || alert.cve_id || "System",
        type: "alert",
        icon: AlertTriangle,
        iconColor: "text-sentinel-error",
      });
    });
  }

  // Sort logs by newest first
  aggregatedLogs.sort((a, b) => b.time.getTime() - a.time.getTime());

  const totalEvents = stats ? stats.total_scans + stats.total_vulnerabilities : 0;

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="Comprehensive audit trail for all system operations, user actions, and security events."
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Download className="w-4 h-4" />
              Export Logs
            </button>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Events Logged", value: totalEvents || 0, icon: Clock },
          { label: "Active Scans", value: stats?.active_scans || 0, icon: User },
          { label: "Security Events", value: stats?.total_vulnerabilities || 0, icon: Shield },
        ].map((s: any) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-6 border-ghost flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-headline text-white">{s.value}</p>
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-6 border-b border-[hsl(222,20%,12%,0.2)] flex justify-between items-center">
          <h3 className="font-bold font-headline text-white">Recent Events</h3>
          <div className="flex gap-1 bg-surface-container p-1 rounded-lg">
            <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-surface-high rounded">All</button>
            <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,45%)]">Scans</button>
            <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,45%)]">Auth</button>
            <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,45%)]">System</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.2)]">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Target</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[hsl(215,15%,45%)] font-sans">
                    Fetching activity logs...
                  </td>
                </tr>
              ) : aggregatedLogs.length > 0 ? (
                aggregatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                    <td className="px-6 py-4 text-[hsl(215,15%,50%)] text-xs">{format(log.time, "HH:mm:ss")}</td>
                    <td className="px-6 py-4">
                      <log.icon className={`w-4 h-4 ${log.iconColor}`} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-sans text-sm ${log.user === "System" ? "text-primary" : "text-on-surface"}`}>
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-sans text-on-surface">{log.action}</td>
                    <td className="px-6 py-4 text-xs text-primary">{log.target}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[hsl(215,15%,45%)] font-sans">
                    No recent activity found in your environment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex justify-between items-center border-t border-[hsl(222,20%,12%,0.15)]">
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-semibold">
            Showing {aggregatedLogs.length} of {totalEvents} events
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary-fixed text-xs font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
