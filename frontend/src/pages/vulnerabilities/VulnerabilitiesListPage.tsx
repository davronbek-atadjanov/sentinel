import PageHeader from "@/components/shared/PageHeader"
import SeverityBadge from "@/components/shared/SeverityBadge"
import StatusBadge from "@/components/shared/StatusBadge"
import {
    Download,
    FileText,
    MoreVertical
} from "lucide-react"
import { Link } from "react-router-dom"

import { VulnerabilitiesService } from "@/services/vulnerabilities.service"
import { useQuery } from "@tanstack/react-query"
import { ShieldAlert } from "lucide-react"

const VulnerabilitiesListPage = () => {
  const { data: vulnerabilitiesData, isLoading } = useQuery({
    queryKey: ["vulnerabilities"],
    queryFn: () => VulnerabilitiesService.getVulnerabilities(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["vulnerabilities", "stats"],
    queryFn: () => VulnerabilitiesService.getStats(),
  });

  const displayVulns = vulnerabilitiesData?.results || [];
  const stats = statsData?.data || { total: 0, by_severity: {}, resolved: 0 };
  const totalCount = vulnerabilitiesData?.count || 0;
  
  // Calculate critical fix rate
  const criticalCount = stats.by_severity?.CRITICAL || 0;
  const criticalFixed = 0; // Backend stats doesn't separate resolved by severity yet
  const fixRate = criticalCount > 0 ? ((criticalFixed / criticalCount) * 100).toFixed(0) : "0";

  return (
    <div>
      <PageHeader
        title="Zaifliklar inventarizatsiyasi"
        description={`Hozirda ${totalCount.toLocaleString()} ta zaiflik aniqlangan va kuzatilmoqda.`}
        badge={
          totalCount > 0 && <span className="w-2 h-2 rounded-full bg-sentinel-tertiary animate-pulse mt-2" />
        }
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Download className="w-4 h-4" />
              CSV yuklab olish
            </button>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <FileText className="w-4 h-4" />
              PDF hisobot
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-surface-low rounded-xl border-ghost">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
            Jiddiylik:
          </span>
          {["Kritik", "Yuqori", "O'rtacha"].map((sev, i) => (
            <label key={sev} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={i < 2}
                className="w-4 h-4 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-on-surface">{sev}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
            Holati:
          </span>
          <span className="text-sm text-on-surface">Barcha holatlar</span>
        </div>
        <div className="ml-auto text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold">
          {totalCount} ta dan {displayVulns.length} tasi ko'rsatilmoqda
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.3)]">
                <th className="px-6 py-4">Jiddiylik</th>
                <th className="px-6 py-4">Zaiflik nomi</th>
                <th className="px-6 py-4">Maqsad URL</th>
                <th className="px-6 py-4">Holati</th>
                <th className="px-6 py-4">Topilgan sana</th>
                <th className="px-6 py-4">Harakat</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Zaifliklar yuklanmoqda...
                  </td>
                </tr>
              ) : displayVulns.length > 0 ? (
                displayVulns.map((vuln: any) => (
                  <tr
                    key={vuln.id}
                    className="hover:bg-[hsl(222,30%,6%,0.4)] transition-colors border-b border-[hsl(222,20%,12%,0.08)]"
                  >
                    <td className="px-6 py-5">
                      <SeverityBadge severity={vuln.severity.toLowerCase()} />
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to={`/app/vulnerabilities/${vuln.id}`}
                        className="font-semibold text-on-surface hover:text-primary transition-colors block"
                      >
                        {vuln.title}
                      </Link>
                      <span className="text-[10px] text-[hsl(215,15%,40%)] font-mono mt-0.5 block">
                        {vuln.cve_id || "NEW"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-primary text-body-md font-mono">{vuln.affected_url}</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={vuln.status.toLowerCase()} />
                    </td>
                    <td className="px-6 py-5 text-[hsl(215,15%,50%)] text-body-md">
                      {new Date(vuln.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <button className="text-[hsl(215,15%,50%)] hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldAlert className="w-10 h-10 text-[hsl(215,15%,35%)] mb-3" />
                      <p className="text-[hsl(215,15%,65%)] font-semibold">Zaifliklar aniqlanmadi.</p>
                      <p className="text-[hsl(215,15%,40%)] text-sm mt-1">Sizning aktivlaringiz xavfsiz ko'rinadi.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-[hsl(222,20%,12%,0.15)]">
          <span className="text-[10px] text-[hsl(215,15%,40%)] uppercase font-semibold">
            ‹ Oldingi
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded bg-primary text-on-primary-fixed text-xs font-bold flex items-center justify-center">
              1
            </button>
            {[2, 3].map((n) => (
              <button
                key={n}
                className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center"
              >
                {n}
              </button>
            ))}
            <span className="text-[hsl(215,15%,40%)] text-xs">...</span>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">
              {Math.max(1, Math.ceil(totalCount / 10))}
            </button>
          </div>
          <span className="text-[10px] text-[hsl(215,15%,55%)] uppercase font-semibold cursor-pointer hover:text-white">
            Keyingisi ›
          </span>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
            Kritik tuzatish ko'rsatkichi
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-headline text-white">{fixRate}%</span>
            <span className="text-xs text-sentinel-tertiary font-semibold hidden">-</span>
          </div>
          <p className="text-xs text-[hsl(215,15%,40%)] mt-2">
            Hal etilgan xavflar asosida.
          </p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
            Hal qilingan zaifliklar
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-headline text-white">{stats.resolved}</span>
            <span className="text-xs text-primary font-semibold hidden">+</span>
          </div>
          <p className="text-xs text-[hsl(215,15%,40%)] mt-2">
            Muammolar muvaffaqiyatli yumshatildi.
          </p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
              Faol skanerlash klasteri
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-headline text-white">{stats.total > 0 ? "Faol" : "Neytral"}</span>
              {stats.total > 0 && (
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                </span>
              )}
            </div>
            <p className="text-xs text-[hsl(215,15%,40%)] mt-2">
              Tizim holatini kuzatish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnerabilitiesListPage;
