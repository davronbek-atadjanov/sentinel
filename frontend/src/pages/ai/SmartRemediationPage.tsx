import PageHeader from "@/components/shared/PageHeader"
import { CheckCircle, Clock, Eye, GitPullRequest, XCircle } from "lucide-react"

const pullRequests = [
  { id: "PR-1247", title: "auth manzilidagi SQL inyektsiyasini tuzatish", branch: "fix/sqli-auth-endpoint", vuln: "CVE-2024-38291", status: "merged", checks: "Barchasi o'tdi", reviewers: "2/2 tasdiqladi", mergedAt: "2 soat oldin" },
  { id: "PR-1245", title: "CSP va xavfsizlik sarlavhalarini qo'shish", branch: "security/add-csp-headers", vuln: "HEADER-001, HEADER-003", status: "open", checks: "Bajarilmoqda...", reviewers: "1/2 tasdiqladi", mergedAt: null },
  { id: "PR-1243", title: "Qidiruv komponentidagi XSS ni tozalash", branch: "fix/xss-search-sanitize", vuln: "CVE-2023-4412", status: "merged", checks: "Barchasi o'tdi", reviewers: "2/2 tasdiqladi", mergedAt: "1 kun oldin" },
  { id: "PR-1240", title: "SSL shifr to'plamlarini yangilash", branch: "infra/ssl-cipher-upgrade", vuln: "POLICY-992", status: "closed", checks: "1 ta xato", reviewers: "0/2 tasdiqladi", mergedAt: null },
];

const statusStyles: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  merged: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  open: { icon: GitPullRequest, color: "text-[hsl(35,90%,55%)]", bg: "bg-[hsl(35,90%,55%,0.1)]" },
  closed: { icon: XCircle, color: "text-sentinel-error", bg: "bg-sentinel-error/10" },
};

const SmartRemediationPage = () => {
  return (
    <div>
      <PageHeader
        title="Aqlli Tuzatish PR lari"
        description="Xavfsizlik tuzatishlari bilan AI tomonidan yaratilgan pull requestlar. Uzluksiz joylashtirish uchun CI/CD tizimingiz bilan to'g'ridan-to'g'ri integratsiyalangan."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><GitPullRequest className="w-4 h-4 text-primary" /><span className="text-[10px] text-primary font-bold uppercase">Bu Hafta 14 PR</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Birlashtirilgan PR lar", value: "47", icon: CheckCircle, color: "text-primary" },
          { label: "Ochiq PR lar", value: "3", icon: GitPullRequest, color: "text-[hsl(35,90%,55%)]" },
          { label: "O'rtacha Birlashtirish Vaqti", value: "2.1s", icon: Clock },
          { label: "Muvaqqafiyat Darajasi", value: "94%", icon: CheckCircle },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className={`w-5 h-5 ${s.color || "text-primary"} mb-3`} />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {pullRequests.map((pr) => {
          const style = statusStyles[pr.status];
          const StatusIcon = style.icon;
          return (
            <div key={pr.id} className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`w-5 h-5 ${style.color}`} />
                    <h3 className="text-sm font-bold text-white">{pr.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style.bg} ${style.color}`}>{pr.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(215,15%,45%)]">
                    <span className="font-mono text-primary">{pr.id}</span>
                    <span>•</span>
                    <span className="font-mono">{pr.branch}</span>
                    <span>•</span>
                    <span>Tuzatildi: <span className="text-on-surface">{pr.vuln}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="text-[hsl(215,15%,45%)]">Tekshiruvlar</p>
                    <p className={`font-bold ${pr.checks.includes("o'tdi") ? "text-primary" : pr.checks.includes("xato") ? "text-sentinel-error" : "text-[hsl(35,90%,55%)]"}`}>{pr.checks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[hsl(215,15%,45%)]">Taqrizlar</p>
                    <p className="text-on-surface font-bold">{pr.reviewers}</p>
                  </div>
                  {pr.mergedAt && (
                    <div className="text-center">
                      <p className="text-[hsl(215,15%,45%)]">Birlashtirildi</p>
                      <p className="text-on-surface font-bold">{pr.mergedAt}</p>
                    </div>
                  )}
                  <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    Ko'rish
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartRemediationPage;
