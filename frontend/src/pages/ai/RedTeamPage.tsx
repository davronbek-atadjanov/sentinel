import PageHeader from "@/components/shared/PageHeader";
import { Target, Play, Shield, AlertTriangle, Clock, Crosshair } from "lucide-react";

const scenarios = [
  { id: 1, name: "APT Simulation — Lateral Movement", type: "Advanced", status: "Running", progress: 67, duration: "23m", findings: 8 },
  { id: 2, name: "Credential Harvesting Attack", type: "Social Engineering", status: "Completed", progress: 100, duration: "15m", findings: 3 },
  { id: 3, name: "Web Application Exploitation", type: "OWASP Top 10", status: "Completed", progress: 100, duration: "42m", findings: 14 },
  { id: 4, name: "Privilege Escalation Chain", type: "Post-Exploitation", status: "Queued", progress: 0, duration: "--", findings: 0 },
];

const RedTeamPage = () => {
  return (
    <div>
      <PageHeader
        title="Red Team Automation"
        description="Automated adversary simulation that mimics sophisticated attack scenarios. Stress-test your security posture with real-world TTPs."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><Target className="w-4 h-4 text-sentinel-tertiary" /><span className="text-[10px] text-sentinel-tertiary font-bold uppercase">1 Active Simulation</span></span>}
        actions={
          <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Play className="w-4 h-4" />
            New Simulation
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Simulations", value: "48", icon: Target },
          { label: "Vulnerabilities Found", value: "127", icon: AlertTriangle },
          { label: "Avg. Duration", value: "26m", icon: Clock },
          { label: "Defense Score", value: "72%", icon: Shield },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {scenarios.map((s) => (
          <div key={s.id} className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white">{s.name}</h3>
                  <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface uppercase">{s.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === "Running" ? "text-sentinel-tertiary bg-sentinel-tertiary/10" :
                    s.status === "Completed" ? "text-primary bg-primary/10" :
                    "text-[hsl(215,15%,50%)] bg-surface-high"
                  }`}>{s.status}</span>
                </div>
                {s.status === "Running" && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-48 h-1.5 bg-surface-high rounded-full overflow-hidden">
                      <div className="h-full bg-sentinel-tertiary rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-sentinel-tertiary font-bold">{s.progress}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <p className="text-[hsl(215,15%,45%)]">Duration</p>
                  <p className="text-on-surface font-bold">{s.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-[hsl(215,15%,45%)]">Findings</p>
                  <p className={`font-bold ${s.findings > 0 ? "text-sentinel-tertiary" : "text-[hsl(215,15%,45%)]"}`}>{s.findings}</p>
                </div>
                <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors">
                  {s.status === "Completed" ? "View Report" : s.status === "Running" ? "Monitor" : "Start"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedTeamPage;
