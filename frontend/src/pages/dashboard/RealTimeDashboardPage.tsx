import { Activity, AlertTriangle, Radio, Shield, Wifi, Zap } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const liveFeeds = [
  { id: 1, type: "scan", message: "Full scan initiated on api.sentinel.com", time: "Just now", severity: "info" },
  { id: 2, type: "alert", message: "Critical: RCE attempt detected on /upload endpoint", time: "12s ago", severity: "critical" },
  { id: 3, type: "scan", message: "Port scan completed — 3 open ports detected", time: "45s ago", severity: "warning" },
  { id: 4, type: "alert", message: "SQL injection payload blocked on /api/auth", time: "1m ago", severity: "critical" },
  { id: 5, type: "scan", message: "SSL certificate validation passed", time: "2m ago", severity: "info" },
  { id: 6, type: "alert", message: "Unusual traffic spike from IP 45.33.32.156", time: "3m ago", severity: "warning" },
];

const activeNodes = [
  { name: "Scanner Alpha", status: "active", load: 72, scans: 12 },
  { name: "Scanner Beta", status: "active", load: 45, scans: 8 },
  { name: "Scanner Gamma", status: "idle", load: 5, scans: 0 },
  { name: "Scanner Delta", status: "active", load: 88, scans: 15 },
];

const RealTimeDashboardPage = () => {
  return (
    <div>
      <PageHeader
        title="Real-time Security Dashboard"
        description="Live monitoring of all security operations and threat detection."
        actions={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary">LIVE</span>
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Stats Row */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {[
            { label: "Active Threats", value: "7", icon: AlertTriangle, color: "text-sentinel-error" },
            { label: "Active Scans", value: "4", icon: Activity, color: "text-primary" },
            { label: "Blocked Attacks", value: "1,247", icon: Shield, color: "text-sentinel-success" },
            { label: "Network Status", value: "Healthy", icon: Wifi, color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-low rounded-xl p-6 border-ghost">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[hsl(215,15%,40%)] uppercase tracking-widest">
                  {stat.label}
                </span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white font-headline">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Live Feed */}
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] flex justify-between items-center bg-surface-high/30">
            <h3 className="font-bold font-headline text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Live Threat Feed
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              Auto-refresh: 5s
            </span>
          </div>
          <div className="divide-y divide-[hsl(222,20%,10%,0.3)]">
            {liveFeeds.map((feed) => (
              <div key={feed.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[hsl(222,30%,6%,0.4)] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  feed.severity === "critical" ? "bg-sentinel-error animate-pulse" :
                  feed.severity === "warning" ? "bg-sentinel-tertiary" :
                  "bg-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[hsl(215,20%,85%)] font-medium truncate">{feed.message}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  feed.severity === "critical" ? "bg-sentinel-error-container text-on-error-container" :
                  feed.severity === "warning" ? "bg-sentinel-tertiary-container text-sentinel-tertiary" :
                  "bg-primary/10 text-primary"
                }`}>
                  {feed.severity}
                </span>
                <span className="text-[10px] text-[hsl(215,15%,40%)] font-mono whitespace-nowrap">{feed.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Nodes */}
        <div className="col-span-12 lg:col-span-4 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] bg-surface-high/30">
            <h3 className="font-bold font-headline text-white">Active Scan Nodes</h3>
          </div>
          <div className="p-4 space-y-3">
            {activeNodes.map((node, i) => (
              <div key={i} className="bg-surface-container rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-[hsl(215,20%,85%)]">{node.name}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    node.status === "active" ? "bg-primary/10 text-primary" : "bg-[hsl(222,25%,15%)] text-[hsl(215,15%,45%)]"
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[hsl(222,30%,10%)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        node.load > 80 ? "bg-sentinel-tertiary" : "bg-primary"
                      }`}
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[hsl(215,15%,45%)] font-mono">{node.load}%</span>
                </div>
                <p className="text-[10px] text-[hsl(215,15%,40%)] mt-2">{node.scans} active scans</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboardPage;
