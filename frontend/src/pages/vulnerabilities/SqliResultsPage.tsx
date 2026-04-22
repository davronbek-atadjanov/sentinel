import PageHeader from "@/components/shared/PageHeader"
import SeverityBadge from "@/components/shared/SeverityBadge"
import { Database } from "lucide-react"

const sqliFindings = [
  { id: 1, severity: "critical" as const, type: "Boolean-based blind", url: "/api/v2/user/auth", param: "session_token", dbms: "PostgreSQL 15.2", technique: "Boolean inference", payloads: 142, status: "Ekspluatatsiya qilinishi mumkin" },
  { id: 2, severity: "critical" as const, type: "UNION-based", url: "/api/v2/products", param: "category_id", dbms: "PostgreSQL 15.2", technique: "UNION SELECT", payloads: 89, status: "Ekspluatatsiya qilinishi mumkin" },
  { id: 3, severity: "high" as const, type: "Time-based blind", url: "/api/v2/search", param: "filter", dbms: "PostgreSQL 15.2", technique: "Vaqt kechikishi inferensiyasi", payloads: 234, status: "Tasdiqlangan" },
  { id: 4, severity: "medium" as const, type: "Error-based", url: "/api/v1/legacy/reports", param: "report_id", dbms: "MySQL 8.0", technique: "Xato xabaridan ma'lumot ajratib olish", payloads: 56, status: "Ehtimoliy" },
];

const SqliResultsPage = () => {
  return (
    <div>
      <PageHeader
        title="SQL Injection natijalari"
        description="Ma'lumotlar bazasiga ulangan barcha nuqtalar bo'yicha maxsus SQL Injection (SQLi) tahlili. 4 ta inyeksiya nuqtasi topildi."
        badge={<Database className="w-5 h-5 text-sentinel-error mt-2 ml-2" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Inyeksiya nuqtalari", value: "4", color: "text-sentinel-error" },
          { label: "Sinovdan o'tkazilgan yuklar", value: "521" },
          { label: "Aniqlangan DBMS", value: "2" },
          { label: "Chiqarib olinadigan ma'lumotlar", value: "Ha", color: "text-sentinel-tertiary" },
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
                <th className="px-5 py-3">Jiddiylik</th>
                <th className="px-5 py-3">Turi</th>
                <th className="px-5 py-3">Nuqta / parametr</th>
                <th className="px-5 py-3">DBMS</th>
                <th className="px-5 py-3">Yuklar (payloads)</th>
                <th className="px-5 py-3">Holati</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sqliFindings.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-4"><SeverityBadge severity={f.severity} /></td>
                  <td className="px-5 py-4 font-semibold text-on-surface">{f.type}</td>
                  <td className="px-5 py-4">
                    <span className="text-primary font-mono text-xs block">{f.url}</span>
                    <span className="text-[10px] text-[hsl(215,15%,45%)]">Parametr: {f.param}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-on-surface font-mono">{f.dbms}</td>
                  <td className="px-5 py-4 text-xs text-[hsl(215,15%,55%)]">{f.payloads} sinovdan o'tkazildi</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${f.status === "Ekspluatatsiya qilinishi mumkin" ? "text-sentinel-error" : f.status === "Tasdiqlangan" ? "text-sentinel-tertiary" : "text-[hsl(35,90%,55%)]"}`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SqliResultsPage;
