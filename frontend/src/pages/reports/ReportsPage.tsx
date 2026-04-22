import PageHeader from "@/components/shared/PageHeader"
import { BarChart3, FileText } from "lucide-react"

import { ReportsService } from "@/services/reports.service"
import { VulnerabilitiesService } from "@/services/vulnerabilities.service"
import { useQuery } from "@tanstack/react-query"

// Keep static array structure for compliance UI shell, but we'll bind "score" to SOC2
const complianceCards = [
  { title: "SOC2 Type II", desc: "Infratuzilma va ishonch xizmatlari mezonlari.", statusColor: "text-primary bg-primary-container", bar: "bg-primary" },
  { title: "PCI-DSS v4.0", desc: "To'lov kartalari sanoatining ma'lumotlar xavfsizligi standarti.", status: "OGOHLANTIRISH: 12 SILJISH", statusColor: "text-sentinel-tertiary bg-tertiary-container", bar: "bg-sentinel-tertiary w-[60%]" },
  { title: "HIPAA", desc: "Sog'liqni saqlash sohasida ko'chma va javobgarlik.", status: "AUDIT KUTILMOQDA", statusColor: "text-on-surface-variant bg-surface-high", bar: "bg-on-surface-variant w-[40%]" },
];

const barData = [30, 35, 40, 38, 55, 60];
const months = ["YAN", "FEV", "MAR", "APR", "MAY", "IYN"];

const ReportsPage = () => {
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => ReportsService.getReports(),
  });

  const { data: complianceData } = useQuery({
    queryKey: ["reports", "compliance"],
    queryFn: () => ReportsService.getComplianceStats(),
  });

  const { data: categoryData } = useQuery({
    queryKey: ["vulnerabilities", "by-category"],
    queryFn: () => VulnerabilitiesService.getByCategory(),
  });

  const displayReports = reportsData?.results || [];
  const complianceScore = complianceData?.data?.compliance_score ?? 0;

  // Chart Logic
  const categories = categoryData?.data || [];
  const totalRisks = categories.reduce((sum: number, cat: any) => sum + (cat.count || 0), 0);
  const chartColors = ["hsl(0,60%,45%)", "hsl(200,100%,74%)", "hsl(35,90%,55%)", "hsl(215,15%,40%)"];
  
  const sortedCategories = [...categories].sort((a: any, b: any) => b.count - a.count);
  const topCategories = sortedCategories.slice(0, 3).map((c, i) => ({ ...c, color: chartColors[i] }));
  const otherCount = sortedCategories.slice(3).reduce((sum: number, cat: any) => sum + (cat.count || 0), 0);

  if (otherCount > 0 || totalRisks === 0) {
    topCategories.push({ 
      category: totalRisks === 0 ? "Xavf yo'q" : "Boshqa", 
      count: totalRisks === 0 ? 1 : otherCount, // if 0, mock 1 count so a full grey circle shows
      color: chartColors[3] 
    });
  }

  let currentOffset = 0;

  return (
    <div>
      <PageHeader
        title="Hisobotlar va Tahlillar"
        description="Tarixiy ishlash, muvofiqlik auditi jurnallari va strategik tushunchalar."
        badge={
          <div className="flex items-center gap-2 ml-4">
            <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">Tizim holati</span>
            <span className="flex items-center gap-1.5 text-sentinel-tertiary text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-sentinel-tertiary animate-pulse" />
              TAHDID PULSI FAOL
            </span>
          </div>
        }
      />

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Security Posture Over Time */}
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl p-6 border-ghost">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold font-headline text-white">Vaqt o'tishi bilan xavfsizlik holati</h3>
              <p className="text-xs text-[hsl(215,15%,40%)]">Uzoq muddatli skanerlash balining tendentsiyasi (So'nggi 6 oy)</p>
            </div>
            <div className="flex gap-1 bg-surface-container p-1 rounded-lg">
              <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-surface-high rounded">6O</button>
              <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,45%)]">1Y</button>
              <button className="px-3 py-1.5 text-[10px] font-bold text-[hsl(215,15%,45%)]">Barchasi</button>
            </div>
          </div>
          <div className="flex items-end gap-3 h-[200px]">
            {barData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-surface-high/80 rounded-t-sm hover:bg-primary/30 transition-colors cursor-pointer"
                  style={{ height: `${h * 3}px` }}
                />
                <span className="text-[10px] text-[hsl(215,15%,35%)] font-semibold">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Exposure */}
        <div className="col-span-12 lg:col-span-4 bg-surface-low rounded-xl p-6 border-ghost">
          <h3 className="font-bold font-headline text-white mb-1">Top 10 xavflar</h3>
          <p className="text-xs text-[hsl(215,15%,40%)] mb-6">OWASP toifalari taqsimoti</p>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {totalRisks === 0 ? (
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(215,15%,20%)" strokeWidth="3" />
                ) : (
                  topCategories.map((cat, i) => {
                    const percentage = (cat.count / totalRisks) * 100;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = -currentOffset;
                    currentOffset += percentage;
                    return (
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="3"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  })
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-headline text-white">{totalRisks}</span>
                <span className="text-[10px] text-[hsl(215,15%,40%)] uppercase font-bold">Jami xavflar</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {totalRisks === 0 ? (
              <div className="col-span-2 text-center text-[hsl(215,15%,55%)] italic">Xavfsiz maqsadli segment</div>
            ) : (
              topCategories.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[hsl(215,15%,55%)] whitespace-nowrap overflow-hidden text-ellipsis" title={item.category}>
                    {item.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {complianceCards.map((card, idx) => (
          <div key={card.title} className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-start mb-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${card.statusColor}`}>
                {idx === 0 ? `${complianceScore}% MUVOFIQ` : card.status}
              </span>
            </div>
            <h4 className="font-bold text-white mb-1">{card.title}</h4>
            <p className="text-xs text-[hsl(215,15%,45%)] mb-4">{card.desc}</p>
            <div className="h-1 bg-surface-high rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${card.bar}`} 
                style={idx === 0 ? { width: `${complianceScore}%` } : undefined} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Report Generator */}
        <div className="col-span-12 lg:col-span-5 bg-surface-low rounded-xl p-6 border-ghost">
          <h3 className="font-bold font-headline text-white mb-1">Razvedka hisobotini yaratish</h3>
          <p className="text-xs text-[hsl(215,15%,45%)] mb-6">Texnik topilmalarni manfaatdor tomonlar formatlariga jamlash.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">Manba skanerlashlari</label>
              <select className="w-full bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-primary/30 focus:outline-none">
                <option>Asosiy ishlab chiqarish klasteri (Haftalik)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">Chiqish formati</label>
              <div className="flex gap-3">
                {["PDF", "JSON", "CSV"].map((fmt, i) => (
                  <button
                    key={fmt}
                    className={`px-6 py-3 rounded-lg text-sm font-bold transition-colors ${
                      i === 0
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-surface-container text-[hsl(215,15%,55%)] hover:bg-surface-high"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 bg-gradient-primary px-6 py-3 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all mt-4">
              <BarChart3 className="w-4 h-4" />
              Boshqaruv xulosasini yaratish
            </button>
          </div>
        </div>

        {/* Recent Archive */}
        <div className="col-span-12 lg:col-span-7 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-[hsl(222,20%,12%,0.2)]">
            <div>
              <h3 className="font-bold font-headline text-white">Oxirgi arxiv</h3>
              <p className="text-xs text-[hsl(215,15%,45%)]">Oldin yaratilgan va imzolangan hisobotlar.</p>
            </div>
            <button className="text-xs text-[hsl(215,15%,55%)] font-semibold hover:text-white">Barchasini ko'rish</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                <th className="px-6 py-3">Hisobot nomi</th>
                <th className="px-6 py-3">Format</th>
                <th className="px-6 py-3">Sana</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reportsLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-muted-foreground text-xs">
                    Hisobotlar arxivi yuklanmoqda...
                  </td>
                </tr>
              ) : displayReports.length > 0 ? (
                displayReports.map((r: any) => (
                  <tr key={r.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-on-surface">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[hsl(215,15%,50%)] uppercase text-xs">{r.report_type || "PDF"}</td>
                    <td className="px-6 py-4 text-[hsl(215,15%,45%)] text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[hsl(215,15%,50%)]">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 opacity-20 mb-3" />
                      <p className="text-sm">Arxiv hozircha bo'sh.</p>
                      <p className="text-xs mt-1">Bu yerda ko'rsatish uchun yangi hisobot yarating.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
