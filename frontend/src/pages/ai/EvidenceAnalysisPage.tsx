import PageHeader from "@/components/shared/PageHeader";
import { FileSearch, Brain, CheckCircle, Link2, Zap } from "lucide-react";
import SeverityBadge from "@/components/shared/SeverityBadge";

const evidenceItems = [
  {
    id: 1,
    title: "SQL Injection Chain Analysis",
    vulns: ["CVE-2024-8192", "CVE-2024-38291"],
    confidence: 97,
    reasoning: "Both vulnerabilities share the same authentication endpoint (/api/v2/user/auth) and exploit the session_token parameter. The attack chain suggests a single threat actor performing reconnaissance before exploitation.",
    connections: 3,
    risk: "critical" as const,
  },
  {
    id: 2,
    title: "XSS → Session Hijacking Correlation",
    vulns: ["CVE-2023-4412", "INTERNAL-882"],
    confidence: 84,
    reasoning: "The reflected XSS in the search parameter can be chained with the session fixation vulnerability to achieve full account takeover. The attack requires user interaction but has high impact.",
    connections: 2,
    risk: "high" as const,
  },
  {
    id: 3,
    title: "Infrastructure Misconfiguration Pattern",
    vulns: ["POLICY-992", "HEADER-001", "HEADER-003"],
    confidence: 91,
    reasoning: "Multiple missing security headers and weak SSL configuration suggest a systematic security hardening gap. Likely caused by using a default nginx configuration without security-focused tuning.",
    connections: 5,
    risk: "medium" as const,
  },
];

const EvidenceAnalysisPage = () => {
  return (
    <div>
      <PageHeader
        title="AI Evidence Analysis"
        description="Deep reasoning engine that correlates vulnerability data, identifies attack chains, and provides contextual risk assessments."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><FileSearch className="w-4 h-4 text-primary" /><span className="text-[10px] text-primary font-bold uppercase">AI Reasoning Active</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Attack Chains Found", value: "3", icon: Link2 },
          { label: "Vulns Correlated", value: "8", icon: FileSearch },
          { label: "AI Accuracy", value: "98%", icon: Brain },
          { label: "Auto-Verified", value: "12", icon: CheckCircle },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {evidenceItems.map((e) => (
          <div key={e.id} className="bg-surface-low rounded-xl border-ghost overflow-hidden">
            <div className="p-6 border-b border-[hsl(222,20%,12%,0.15)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold text-white">{e.title}</h3>
                    <SeverityBadge severity={e.risk} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {e.vulns.map((v) => (
                      <span key={v} className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-mono text-primary">{v}</span>
                    ))}
                    <span className="text-[10px] text-[hsl(215,15%,45%)]">• {e.connections} connected findings</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">AI Confidence</p>
                  <p className="text-2xl font-bold font-headline text-primary">{e.confidence}%</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[hsl(222,60%,4%,0.3)]">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-primary uppercase font-bold mb-2">AI Reasoning</p>
                  <p className="text-sm text-[hsl(215,15%,60%)] leading-relaxed">{e.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceAnalysisPage;
