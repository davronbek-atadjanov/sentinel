import PageHeader from "@/components/shared/PageHeader";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const headers = [
  { name: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains", status: "pass", recommendation: null },
  { name: "Content-Security-Policy", value: "Not Set", status: "fail", recommendation: "Add CSP header to prevent XSS and data injection attacks." },
  { name: "X-Frame-Options", value: "Not Set", status: "fail", recommendation: "Set to DENY or SAMEORIGIN to prevent clickjacking." },
  { name: "X-Content-Type-Options", value: "nosniff", status: "pass", recommendation: null },
  { name: "X-XSS-Protection", value: "Not Set", status: "warning", recommendation: "Legacy header. Consider CSP as primary protection." },
  { name: "Referrer-Policy", value: "strict-origin-when-cross-origin", status: "pass", recommendation: null },
  { name: "Permissions-Policy", value: "Not Set", status: "warning", recommendation: "Restrict browser features like camera, microphone, geolocation." },
  { name: "Cache-Control", value: "no-store, no-cache", status: "pass", recommendation: null },
  { name: "Server", value: "nginx/1.24.0", status: "fail", recommendation: "Remove server version to prevent information disclosure." },
];

const statusConfig = {
  pass: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", label: "PASS" },
  fail: { icon: XCircle, color: "text-sentinel-error", bg: "bg-sentinel-error/10", label: "FAIL" },
  warning: { icon: AlertTriangle, color: "text-[hsl(35,90%,55%)]", bg: "bg-[hsl(35,90%,55%,0.1)]", label: "WARN" },
};

const HeaderAnalyzerPage = () => {
  const passCount = headers.filter(h => h.status === "pass").length;
  const failCount = headers.filter(h => h.status === "fail").length;
  const warnCount = headers.filter(h => h.status === "warning").length;
  const score = Math.round((passCount / headers.length) * 100);

  return (
    <div>
      <PageHeader
        title="HTTP Header Analysis"
        description="Security header configuration audit for https://api.v-scan.prod"
        badge={<Shield className="w-5 h-5 text-primary mt-2 ml-2" />}
      />

      {/* Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-low rounded-xl p-6 border-ghost flex flex-col items-center justify-center">
          <p className="text-5xl font-bold font-headline text-white">{score}%</p>
          <p className="text-[10px] text-primary uppercase tracking-widest font-bold mt-1">Header Score</p>
        </div>
        {[
          { label: "Passed", value: passCount, color: "text-primary" },
          { label: "Failed", value: failCount, color: "text-sentinel-error" },
          { label: "Warnings", value: warnCount, color: "text-[hsl(35,90%,55%)]" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-6 border-ghost text-center">
            <p className={`text-3xl font-bold font-headline ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Headers List */}
      <div className="space-y-3">
        {headers.map((h) => {
          const cfg = statusConfig[h.status as keyof typeof statusConfig];
          const StatusIcon = cfg.icon;
          return (
            <div key={h.name} className={`bg-surface-low rounded-xl p-5 border-ghost flex flex-col md:flex-row md:items-center gap-4 ${h.status === "fail" ? "border-l-2 border-l-sentinel-error" : h.status === "warning" ? "border-l-2 border-l-[hsl(35,90%,55%)]" : ""}`}>
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-on-surface font-mono">{h.name}</h4>
                <p className="text-xs text-primary font-mono mt-0.5">{h.value}</p>
              </div>
              {h.recommendation && (
                <p className="text-xs text-[hsl(215,15%,50%)] max-w-sm">{h.recommendation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderAnalyzerPage;
