import PageHeader from "@/components/shared/PageHeader"
import SeverityBadge from "@/components/shared/SeverityBadge"
import { ExternalLink } from "lucide-react"

const findings = [
  { id: 1, severity: "critical" as const, name: "SQL Inyeksiyasi", location: "/api/v2/auth", evidence: "Parametr: session_token", cwe: "CWE-89", confidence: "Yuqori" },
  { id: 2, severity: "high" as const, name: "Saytlararo Skripting (Qaytarilgan)", location: "/search?q=", evidence: "Javob tanasida qaytarilgan kiritish", cwe: "CWE-79", confidence: "Yuqori" },
  { id: 3, severity: "medium" as const, name: "Xavfsizlik Sarlavhalari Yo'q", location: "/*", evidence: "X-Frame-Options, CSP o'rnatilmagan", cwe: "CWE-693", confidence: "Tasdiqlangan" },
  { id: 4, severity: "medium" as const, name: "Secure Bayroqsiz Cookie", location: "/api/session", evidence: "Set-Cookie: sid=...; HttpOnly", cwe: "CWE-614", confidence: "Tasdiqlangan" },
  { id: 5, severity: "low" as const, name: "Axborot Oshkor Qilinishi", location: "/api/health", evidence: "Server versiyasi sarlavhalarda ko'rsatilgan", cwe: "CWE-200", confidence: "O'rtacha" },
];

const scanSummary = [
  { label: "Jami So'rovlar", value: "12,483" },
  { label: "Skanerlash Davomiyligi", value: "14daq 32soniya" },
  { label: "O'qib chiqilgan URLlar", value: "847" },
  { label: "Sinab Ko'rilgan Parametrlar", value: "3,291" },
];

const OwaspZapResultsPage = () => {
  return (
    <div>
      <PageHeader
        title="OWASP ZAP Natijalari"
        description="OWASP ZAP proksi tahlilidan avtomatlashtirilgan skanerlash natijalari. Nishon: https://api.v-scan.prod"
        badge={
          <span className="px-2 py-1 bg-primary-container text-primary text-[10px] font-bold uppercase rounded ml-3 mt-2">
            Skanerlash #778
          </span>
        }
        actions={
          <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
            <ExternalLink className="w-4 h-4" />
            To'liq Hisobotni Yuklab Olish
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
        <h3 className="font-bold text-white mb-4">Jiddiylik Taqsimoti</h3>
        <div className="flex items-end gap-8">
          {[
            { label: "Kritik", count: 1, color: "bg-sentinel-error", height: "h-16" },
            { label: "Yuqori", count: 1, color: "bg-sentinel-tertiary", height: "h-20" },
            { label: "O'rtacha", count: 2, color: "bg-[hsl(35,90%,55%)]", height: "h-32" },
            { label: "Past", count: 1, color: "bg-primary", height: "h-12" },
            { label: "Ma'lumot", count: 0, color: "bg-on-surface-variant", height: "h-4" },
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
          <h3 className="font-bold text-white">Topilmalar ({findings.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.15)]">
                <th className="px-5 py-3">Jiddiylik</th>
                <th className="px-5 py-3">Topilma</th>
                <th className="px-5 py-3">Joylashuv</th>
                <th className="px-5 py-3">CWE</th>
                <th className="px-5 py-3">Ishonchlilik</th>
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
