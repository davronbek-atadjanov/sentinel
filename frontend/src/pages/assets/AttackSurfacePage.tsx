import PageHeader from "@/components/shared/PageHeader";
import { Globe, Server, Cloud, Shield, Wifi, AlertTriangle, Eye } from "lucide-react";

const surfaceNodes = [
  { id: 1, name: "api.sentinel-prod.io", type: "API Gateway", icon: Server, risk: 82, status: "Exposed", vulns: 4, ports: "443, 8080", location: "US-East-1" },
  { id: 2, name: "auth-v3.legacy-app.com", type: "Auth Service", icon: Shield, risk: 94, status: "Critical", vulns: 8, ports: "443", location: "EU-West-1" },
  { id: 3, name: "cdn.sentinel-prod.io", type: "CDN", icon: Globe, risk: 12, status: "Hardened", vulns: 0, ports: "443", location: "Global" },
  { id: 4, name: "storage-node-04.aws.com", type: "S3 Bucket", icon: Cloud, risk: 45, status: "Warning", vulns: 2, ports: "443", location: "US-West-2" },
  { id: 5, name: "10.0.42.1", type: "Internal DB", icon: Server, risk: 68, status: "Exposed", vulns: 3, ports: "5432, 6379", location: "On-Premise" },
  { id: 6, name: "mqtt.iot-fleet.sentinel.io", type: "IoT Gateway", icon: Wifi, risk: 56, status: "Warning", vulns: 1, ports: "1883, 8883", location: "US-East-1" },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  Critical: { color: "text-sentinel-error", bg: "bg-error-container" },
  Exposed: { color: "text-sentinel-tertiary", bg: "bg-tertiary-container" },
  Warning: { color: "text-[hsl(35,90%,65%)]", bg: "bg-[hsl(35,80%,15%)]" },
  Hardened: { color: "text-primary", bg: "bg-primary-container" },
};

const AttackSurfacePage = () => {
  return (
    <div>
      <PageHeader
        title="Attack Surface Map"
        description="Comprehensive visualization of your external and internal attack surface. Identify exposed assets, open ports, and misconfigurations."
        badge={
          <span className="flex items-center gap-1.5 ml-3 mt-2">
            <Globe className="w-4 h-4 text-sentinel-tertiary" />
            <span className="text-[10px] text-sentinel-tertiary font-bold uppercase">Live Discovery</span>
          </span>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Surface Area", value: "1,482", sub: "assets" },
          { label: "Exposed Endpoints", value: "247", sub: "public facing", color: "text-sentinel-tertiary" },
          { label: "Open Ports", value: "842", sub: "across fleet" },
          { label: "Risk Score", value: "68/100", sub: "needs attention", color: "text-sentinel-tertiary" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <p className={`text-3xl font-bold font-headline ${s.color || "text-white"}`}>{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
            <p className="text-xs text-[hsl(215,15%,40%)] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Visual Map (Simplified network node visualization) */}
      <div className="bg-surface-low rounded-xl p-8 border-ghost mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold font-headline text-white">Network Topology</h3>
          <div className="flex gap-4 text-xs">
            {[
              { color: "bg-sentinel-error", label: "Critical" },
              { color: "bg-sentinel-tertiary", label: "Exposed" },
              { color: "bg-[hsl(35,90%,55%)]", label: "Warning" },
              { color: "bg-primary", label: "Hardened" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-[hsl(215,15%,50%)]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {surfaceNodes.map((node) => {
            const riskColor = node.risk > 80 ? "border-sentinel-error shadow-[0_0_20px_hsl(0,60%,45%,0.15)]" :
              node.risk > 50 ? "border-sentinel-tertiary/30" :
              node.risk > 30 ? "border-[hsl(35,90%,55%,0.2)]" : "border-primary/20";
            return (
              <div key={node.id} className={`bg-surface-container rounded-xl p-4 border ${riskColor} text-center hover:bg-surface-high transition-all cursor-pointer group`}>
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  node.risk > 80 ? "bg-sentinel-error/10" : node.risk > 50 ? "bg-sentinel-tertiary/10" : "bg-primary/10"
                }`}>
                  <node.icon className={`w-6 h-6 ${
                    node.risk > 80 ? "text-sentinel-error" : node.risk > 50 ? "text-sentinel-tertiary" : "text-primary"
                  }`} />
                </div>
                <h4 className="text-xs font-bold text-on-surface truncate mb-1">{node.name}</h4>
                <p className="text-[10px] text-[hsl(215,15%,45%)]">{node.type}</p>
                <div className="mt-3 pt-3 border-t border-[hsl(222,20%,12%,0.2)]">
                  <p className={`text-lg font-bold font-headline ${
                    node.risk > 80 ? "text-sentinel-error" : node.risk > 50 ? "text-sentinel-tertiary" : "text-primary"
                  }`}>{node.risk}</p>
                  <p className="text-[10px] text-[hsl(215,15%,35%)] uppercase font-bold">Risk</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Details Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)]">
          <h3 className="font-bold text-white">Surface Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.15)]">
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Ports</th>
                <th className="px-5 py-3">Vulns</th>
                <th className="px-5 py-3">Region</th>
                <th className="px-5 py-3">Risk</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {surfaceNodes.map((n) => {
                const st = statusConfig[n.status];
                return (
                  <tr key={n.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <n.icon className="w-4 h-4 text-primary" />
                        <div>
                          <span className="font-semibold text-on-surface block">{n.name}</span>
                          <span className="text-[10px] text-[hsl(215,15%,45%)]">{n.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${st.bg} ${st.color}`}>{n.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-primary font-mono">{n.ports}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${n.vulns > 0 ? "text-sentinel-tertiary" : "text-primary"}`}>{n.vulns}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[hsl(215,15%,50%)]">{n.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-high rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${
                            n.risk > 80 ? "bg-sentinel-error" : n.risk > 50 ? "bg-sentinel-tertiary" : n.risk > 30 ? "bg-[hsl(35,90%,55%)]" : "bg-primary"
                          }`} style={{ width: `${n.risk}%` }} />
                        </div>
                        <span className="text-xs font-bold text-on-surface">{n.risk}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttackSurfacePage;
