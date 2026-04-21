import PageHeader from "@/components/shared/PageHeader";
import SeverityBadge from "@/components/shared/SeverityBadge";
import { Code, Shield, ExternalLink } from "lucide-react";

const xssFindings = [
  { id: 1, severity: "high" as const, type: "Reflected XSS", url: "/search?q=<script>alert(1)</script>", param: "q", context: "HTML Body", payload: '<script>alert("XSS")</script>', status: "Confirmed" },
  { id: 2, severity: "high" as const, type: "Stored XSS", url: "/api/comments", param: "body", context: "Database → HTML", payload: '<img src=x onerror=alert(1)>', status: "Confirmed" },
  { id: 3, severity: "medium" as const, type: "DOM-based XSS", url: "/dashboard#section=", param: "hash fragment", context: "JavaScript", payload: "javascript:alert(document.cookie)", status: "Probable" },
  { id: 4, severity: "low" as const, type: "Self-XSS", url: "/profile/edit", param: "bio", context: "User Profile", payload: '<svg onload=alert(1)>', status: "Low Risk" },
];

const XssResultsPage = () => {
  return (
    <div>
      <PageHeader
        title="XSS Scanner Results"
        description="Cross-Site Scripting vulnerability analysis across 847 endpoints. Scan completed in 8m 14s."
        badge={<Code className="w-5 h-5 text-primary mt-2 ml-2" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total XSS Found", value: "4", color: "text-sentinel-tertiary" },
          { label: "Reflected", value: "1" },
          { label: "Stored", value: "1" },
          { label: "DOM-based", value: "2" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost text-center">
            <p className={`text-3xl font-bold font-headline ${s.color || "text-white"}`}>{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.2)]">
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">URL / Parameter</th>
                <th className="px-5 py-3">Payload</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {xssFindings.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-4"><SeverityBadge severity={f.severity} /></td>
                  <td className="px-5 py-4 font-semibold text-on-surface">{f.type}</td>
                  <td className="px-5 py-4">
                    <span className="text-primary font-mono text-xs block">{f.url}</span>
                    <span className="text-[10px] text-[hsl(215,15%,45%)]">Param: {f.param} • Context: {f.context}</span>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs text-sentinel-tertiary bg-surface-container px-2 py-1 rounded font-mono">{f.payload}</code>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-on-surface">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default XssResultsPage;
