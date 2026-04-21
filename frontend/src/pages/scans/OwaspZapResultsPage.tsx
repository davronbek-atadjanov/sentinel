import PageHeader from "@/components/shared/PageHeader";
import SeverityBadge from "@/components/shared/SeverityBadge";
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Info } from "lucide-react";

const findings = [
  { id: 1, severity: "critical" as const, name: "SQL Injection", location: "/api/v2/auth", evidence: "Parameter: session_token", cwe: "CWE-89", confidence: "High" },
  { id: 2, severity: "high" as const, name: "Cross-Site Scripting (Reflected)", location: "/search?q=", evidence: "Reflected input in response body", cwe: "CWE-79", confidence: "High" },
  { id: 3, severity: "medium" as const, name: "Missing Security Headers", location: "/*", evidence: "X-Frame-Options, CSP not set", cwe: "CWE-693", confidence: "Confirmed" },
  { id: 4, severity: "medium" as const, name: "Cookie Without Secure Flag", location: "/api/session", evidence: "Set-Cookie: sid=...; HttpOnly", cwe: "CWE-614", confidence: "Confirmed" },
  { id: 5, severity: "low" as const, name: "Information Disclosure", location: "/api/health", evidence: "Server version exposed in headers", cwe: "CWE-200", confidence: "Medium" },
];

const scanSummary = [
  { label: "Total Requests", value: "12,483" },
  { label: "Scan Duration", value: "14m 32s" },
  { label: "URLs Crawled", value: "847" },
  { label: "Parameters Tested", value: "3,291" },
];

const OwaspZapResultsPage = () => {
  return (
    <div>
      <PageHeader
        title="OWASP ZAP Results"
        description="Automated scan results from OWASP ZAP proxy analysis. Target: https://api.v-scan.prod"
        badge={
          <span className="px-2 py-1 bg-primary-container text-primary text-[10px] font-bold uppercase rounded ml-3 mt-2">
            Scan #778
          </span>
        }
        actions={
          <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
            <ExternalLink className="w-4 h-4" />
            Export Full Report
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {scanSummary.map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost text-center">
            <p className="text-2xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Severity Overview */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost mb-8">
        <h3 className="font-bold text-white mb-4">Severity Distribution</h3>
        <div className="flex items-end gap-8">
          {[
            { label: "Critical", count: 1, color: "bg-sentinel-error", height: "h-16" },
            { label: "High", count: 1, color: "bg-sentinel-tertiary", height: "h-20" },
            { label: "Medium", count: 2, color: "bg-[hsl(35,90%,55%)]", height: "h-32" },
            { label: "Low", count: 1, color: "bg-primary", height: "h-12" },
            { label: "Info", count: 0, color: "bg-on-surface-variant", height: "h-4" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-lg font-bold text-white">{item.count}</span>
              <div className={`w-full ${item.height} ${item.color} rounded-t-sm opacity-60`} />
              <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)]">
          <h3 className="font-bold text-white">Findings ({findings.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.15)]">
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Finding</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">CWE</th>
                <th className="px-5 py-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-4"><SeverityBadge severity={f.severity} /></td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-on-surface block">{f.name}</span>
                    <span className="text-xs text-[hsl(215,15%,45%)]">{f.evidence}</span>
                  </td>
                  <td className="px-5 py-4 text-primary font-mono text-xs">{f.location}</td>
                  <td className="px-5 py-4 text-[hsl(215,15%,50%)] font-mono text-xs">{f.cwe}</td>
                  <td className="px-5 py-4 text-xs font-bold text-on-surface">{f.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwaspZapResultsPage;
