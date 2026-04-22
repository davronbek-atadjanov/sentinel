import PageHeader from "@/components/shared/PageHeader"
import { Download, Filter, MoreVertical, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { AssetsService } from "@/services/assets.service"
import { useQuery } from "@tanstack/react-query"
import { ServerCrash } from "lucide-react"
const statusStyles: Record<string, { label: string; cls: string }> = {
  protected: { label: "HIMOYA QILINGAN", cls: "bg-primary-container text-primary" },
  scanning: { label: "SKANERLANMOQDA", cls: "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]" },
  vulnerable: { label: "XAVF OSTIDA", cls: "bg-error-container text-on-error-container" },
};

const tabs = ["Barcha Aktivlar", "Domenlar", "IP Manzillar", "Yakuniy Nuqtalar"];

const AssetsPage = () => {
  const { data: assetsData, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => AssetsService.getAssets(),
  });

  const { data: attackSurfaceData } = useQuery({
    queryKey: ["assets", "attack-surface"],
    queryFn: () => AssetsService.getAttackSurface(),
  });

  const displayAssets = Array.isArray(assetsData?.data) ? assetsData.data : (assetsData?.results || []);
  const stats = attackSurfaceData?.data || { total_assets: 0, active_assets: 0, high_risk_assets: 0 };
  const totalCount = assetsData?.total_items || assetsData?.count || 0;

  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] text-primary uppercase tracking-widest font-bold mb-2">
        Nishon muhiti
      </div>
      <PageHeader
        title="Aktivlarni boshqarish"
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Download className="w-4 h-4" />
              CSV formatida yuklash
            </button>
            <Link
              to="/app/assets/new"
              className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Yangi aktiv qo'shish
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Jami aktivlar", value: stats.total_assets.toString(), trend: "", trendColor: "text-primary" },
          { label: "Faol nishonlar", value: stats.active_assets.toString(), badge: "Faol", badgeColor: "text-sentinel-tertiary" },
          { label: "Yuqori xavfli aktivlar", value: stats.high_risk_assets.toString(), trend: "" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-6 border-ghost">
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mb-2">
              {s.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-headline text-white">{s.value}</span>
              {s.trend && (
                <span className={`text-xs font-medium ${s.trendColor || "text-[hsl(215,15%,45%)]"}`}>
                  {s.trend}
                </span>
              )}
              {s.badge && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sentinel-tertiary animate-pulse" />
                  <span className={`text-xs font-medium ${s.badgeColor}`}>{s.badge}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                i === 0
                  ? "text-primary bg-primary/10"
                  : "text-[hsl(215,15%,50%)] hover:text-on-surface hover:bg-surface-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-xs text-[hsl(215,15%,55%)] hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Murakkab filtrlar
          </button>
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">Ommaviy harakatlar:</span>
          <button className="px-3 py-1.5 bg-surface-container rounded text-xs font-semibold text-on-surface hover:bg-surface-high">
            Tanlanganlarni skanerlash
          </button>
          <button className="px-3 py-1.5 bg-sentinel-error-container rounded text-xs font-semibold text-on-error-container hover:brightness-110">
            O'chirish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.3)]">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="w-4 h-4 rounded bg-surface-container border-outline-variant" />
                </th>
                <th className="px-6 py-4">Nishon URL / identifikator</th>
                <th className="px-6 py-4">Turi</th>
                <th className="px-6 py-4">Xavfsizlik holati</th>
                <th className="px-6 py-4">So'nggi skanerlash</th>
                <th className="px-6 py-4">Xavf darajasi</th>
                <th className="px-6 py-4">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Aktivlar yuklanmoqda...
                  </td>
                </tr>
              ) : displayAssets.length > 0 ? (
                displayAssets.map((a: any) => {
                  /* Compute realistic pseudo-status from real data to map to UI for now */
                  let mappedStatus = a.is_active ? "protected" : "vulnerable";
                  if (a.risk_score && a.risk_score >= 7.0) mappedStatus = "vulnerable";
                  const rColor = mappedStatus === 'vulnerable' ? "bg-sentinel-tertiary" : "bg-primary";
                  
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]"
                    >
                      <td className="px-6 py-5">
                        <input type="checkbox" className="w-4 h-4 rounded bg-surface-container border-outline-variant" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-on-surface">{a.name}</div>
                        <div className="text-xs text-[hsl(215,15%,45%)] mt-0.5">{a.url}</div>
                      </td>
                      <td className="px-6 py-5 text-[hsl(215,15%,55%)]">{a.asset_type || "Umumiy"}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusStyles[mappedStatus]?.cls || 'bg-surface-container'}`}>
                          {statusStyles[mappedStatus]?.label || "NOMA'LUM"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[hsl(215,15%,50%)] text-body-md">
                        {a.last_scan ? new Date(a.last_scan).toLocaleDateString() : "--"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-high rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${rColor}`} style={{ width: `${Math.min((a.risk_score || 0) * 10, 100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-on-surface">{Math.round(a.risk_score || 0)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button className="text-[hsl(215,15%,50%)] hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ServerCrash className="w-10 h-10 text-[hsl(215,15%,35%)] mb-3" />
                      <p className="text-[hsl(215,15%,65%)] font-semibold">Hech qanday aktiv topilmadi.</p>
                      <p className="text-[hsl(215,15%,40%)] text-sm mb-4">Kuzatishni boshlash uchun birinchi domen yoki IP manzilingizni qo'shing.</p>
                      <Link 
                        to="/app/assets/new"
                        className="bg-[hsl(222,30%,12%)] hover:bg-[hsl(222,30%,15%)] text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                        Aktiv qo'shish
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex justify-between items-center border-t border-[hsl(222,20%,12%,0.15)]">
          <span className="text-xs text-[hsl(215,15%,45%)]">{totalCount} ta aktivdan {displayAssets.length} tasi ko'rsatilmoqda</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">
              {Math.max(1, Math.ceil(totalCount / 10))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;
