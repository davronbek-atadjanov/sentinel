import PageHeader from "@/components/shared/PageHeader"
import SeverityBadge from "@/components/shared/SeverityBadge"
import { Code } from "lucide-react"

const xssFindings = [
  { id: 1, severity: "high" as const, type: "Qaytarilgan XSS", url: "/search?q=<script>alert(1)</script>", param: "q", context: "HTML Tanasida", payload: '<script>alert("XSS")</script>', status: "Tasdiqlangan" },
  { id: 2, severity: "high" as const, type: "Saqlangan XSS", url: "/api/comments", param: "body", context: "Ma'lumotlar Bazasidan → HTML", payload: '<img src=x onerror=alert(1)>', status: "Tasdiqlangan" },
  { id: 3, severity: "medium" as const, type: "DOM-ga asoslangan XSS", url: "/dashboard#section=", param: "hash qismi", context: "JavaScript", payload: "javascript:alert(document.cookie)", status: "Ehtimoliy" },
  { id: 4, severity: "low" as const, type: "Self-XSS", url: "/profile/edit", param: "bio", context: "Foydalanuvchi Profili", payload: '<svg onload=alert(1)>', status: "Past xavf" },
];

const XssResultsPage = () => {
  return (
    <div>
      <PageHeader
        title="XSS Skaner Natijalari"
        description="847 ta nuqta bo'ylab Saytlararo Skripting (XSS) zaiflik tahlili. Skanerlash 8daq 14soniyada yakunlandi."
        badge={<Code className="w-5 h-5 text-primary mt-2 ml-2" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Jami Topilgan XSS", value: "4", color: "text-sentinel-tertiary" },
          { label: "Qaytarilgan XSS", value: "1" },
          { label: "Saqlangan XSS", value: "1" },
          { label: "DOM-ga asoslangan", value: "2" },
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
                <th className="px-5 py-3">URL / Parametr</th>
                <th className="px-5 py-3">Yuk (Payload)</th>
                <th className="px-5 py-3">Holati</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {xssFindings.map((f) => (
                <tr key={f.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-4"><SeverityBadge severity={f.severity} /></td>
                  <td className="px-5 py-4 font-semibold text-on-surface">{f.type}</td>
                  <td className="px-5 py-4">
                    <span className="text-primary font-mono text-xs block">{f.url}</span>
                    <span className="text-[10px] text-[hsl(215,15%,45%)]">Param: {f.param} • Kontekst: {f.context}</span>
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
