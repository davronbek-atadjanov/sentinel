import PageHeader from "@/components/shared/PageHeader";
import { Crosshair, Brain, Shield, Zap, TrendingUp } from "lucide-react";

const threats = [
  { id: 1, name: "Advanced Persistent Threat (APT-29)", confidence: 94, severity: "Critical", vector: "Spear phishing → Lateral Movement", firstSeen: "2 hours ago", status: "Active Hunt" },
  { id: 2, name: "Supply Chain Compromise", confidence: 78, severity: "High", vector: "Dependency injection via npm package", firstSeen: "6 hours ago", status: "Investigating" },
  { id: 3, name: "Credential Stuffing Campaign", confidence: 88, severity: "High", vector: "Automated login attempts (12,000+ IPs)", firstSeen: "1 day ago", status: "Mitigated" },
  { id: 4, name: "Zero-Day Exploit Attempt", confidence: 62, severity: "Medium", vector: "Unknown payload targeting auth endpoints", firstSeen: "3 days ago", status: "Monitoring" },
];

const ThreatHuntingPage = () => {
  return (
    <div>
      <PageHeader
        title="Proactive Threat Hunting"
        description="AI-driven threat detection engine continuously scanning for emerging attack patterns, zero-days, and APT indicators."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><Crosshair className="w-4 h-4 text-sentinel-tertiary" /><span className="text-[10px] text-sentinel-tertiary font-bold uppercase">Hunting Active</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Hunts", value: "4", icon: Crosshair },
          { label: "Threats Found", value: "42", icon: Shield },
          { label: "AI Confidence", value: "94%", icon: Brain },
          { label: "IOCs Tracked", value: "1.2K", icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {threats.map((t) => (
          <div key={t.id} className="bg-surface-low rounded-xl p-6 border-ghost border-l-2 border-l-sentinel-tertiary hover:bg-surface-container/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.severity === "Critical" ? "bg-error-container text-on-error-container" :
                    t.severity === "High" ? "bg-tertiary-container text-on-tertiary-container" :
                    "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]"
                  }`}>{t.severity}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "Active Hunt" ? "text-sentinel-tertiary bg-sentinel-tertiary/10" :
                    t.status === "Mitigated" ? "text-primary bg-primary/10" :
                    "text-[hsl(215,15%,50%)] bg-surface-high"
                  }`}>{t.status}</span>
                </div>
                <p className="text-xs text-[hsl(215,15%,50%)] mb-1">Vector: {t.vector}</p>
                <p className="text-[10px] text-[hsl(215,15%,40%)]">First seen: {t.firstSeen}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">AI Confidence</p>
                  <p className={`text-lg font-bold font-headline ${t.confidence > 80 ? "text-sentinel-tertiary" : "text-[hsl(35,90%,55%)]"}`}>{t.confidence}%</p>
                </div>
                <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors">
                  Investigate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatHuntingPage;
