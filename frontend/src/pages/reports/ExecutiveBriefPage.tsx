import PageHeader from "@/components/shared/PageHeader"
import { AlertTriangle, CheckCircle, Download, FileText, Shield, TrendingUp } from "lucide-react"

const ExecutiveBriefPage = () => {
  return (
    <div>
      <PageHeader
        title="Boshqaruv Xulosasi"
        description="2023-yil 4-choragi uchun xavfsizlik holati bo'yicha rahbariyat hisoboti. Sentinel AI tomonidan avtomatik yaratilgan."
        actions={
          <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            PDF yuklab olish
          </button>
        }
      />

      {/* Report Header Card */}
      <div className="bg-surface-low rounded-xl p-8 border-ghost mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold font-headline text-white">Xavfsizlik Holati Hisoboti</h3>
            </div>
            <p className="text-xs text-[hsl(215,15%,45%)]">Yaratilgan: 28-oktabr, 2023 • Davr: 4-chorak, 2023</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold font-headline text-primary">A-</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">Umumiy Baho</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Xavfsizlik Bahosi", value: "94/100", icon: Shield, change: "+3 ball", changeColor: "text-primary" },
            { label: "Ochiq Zaifliklar", value: "42", icon: AlertTriangle, change: "-18%", changeColor: "text-primary" },
            { label: "O'rtacha Tuzatish Davri", value: "3.4 kun", icon: TrendingUp, change: "-12%", changeColor: "text-primary" },
            { label: "Muvofiqlik", value: "92%", icon: CheckCircle, change: "+5%", changeColor: "text-primary" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-surface-container rounded-lg p-4">
              <kpi.icon className="w-4 h-4 text-primary mb-2" />
              <p className="text-2xl font-bold font-headline text-white">{kpi.value}</p>
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{kpi.label}</p>
              <p className={`text-xs font-bold mt-2 ${kpi.changeColor}`}>{kpi.change} o'tgan chorakka nisbatan</p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Summary Text */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl p-8 border-ghost">
          <h3 className="font-bold font-headline text-primary text-lg mb-4">Boshqaruv Xulosasi</h3>
          <div className="space-y-4 text-sm text-[hsl(215,15%,60%)] leading-relaxed">
            <p>
              2023-yilning 4-choragida Sentinel <span className="text-white font-bold">142 ta nishon</span> bo'ylab 
              <span className="text-white font-bold"> 1 284 ta avtomatlashtirilgan skanerlash</span> o'tkazdi va 42 ta ochiq zaiflikni aniqladi. Umumiy 
              xavfsizlik holati 3-chorakka nisbatan <span className="text-primary font-bold">3 ballga</span> yaxshilandi, 
              bu esa infratuzilma xavfsizligi bahosini 94/100 gacha olib chiqdi.
            </p>
            <p>
              <span className="text-sentinel-error font-bold">Kritik topilmalar</span>: Autentifikatsiya xizmatida (api.v-scan.prod) ikkita SQL in'ektsiyasi 
              zaifligi aniqlandi. Ikkalasi ham foydalanish mumkinligi tasdiqlangan va 
              zudlik bilan tuzatishni talab qiladi. Bittasi AI Tuzatish Yordamchisi tomonidan avtomatik ravishda yamalgan.
            </p>
            <p>
              <span className="text-primary font-bold">Ijobiy tendentsiyalar</span>: O'rtacha tuzatish vaqti 
              3.9 kundan 3.4 kunga qisqardi (-12%). AI yordamida ishlovchi skanerlash dvigateli tahdidlarni oldingi 
              chorakka qaraganda 40% tezroq aniqladi. SOC2 muvofiqligi darajasi 98.4% ga ko'tarildi.
            </p>
            <p>
              <span className="text-sentinel-tertiary font-bold">Tashvishlanarli sohalar</span>: PCI-DSS muvofiqligi diqqatni talab qiladigan 12 ta 
              konfiguratsiya o'zgarishini ko'rsatmoqda. Autentifikatsiya xizmati barcha kritik topilmalarning 
              62% jama bo'lgan asosiy hujum sathi bo'lib qolmoqda.
            </p>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-surface-low rounded-xl p-6 border-ghost">
          <h3 className="font-bold text-white mb-6">Xavflar Taqsimoti</h3>
          <div className="space-y-4">
            {[
              { label: "Kritik", count: 2, pct: "5%", color: "bg-sentinel-error", bar: "w-[5%]" },
              { label: "Yuqori", count: 8, pct: "19%", color: "bg-sentinel-tertiary", bar: "w-[19%]" },
              { label: "O'rta", count: 18, pct: "43%", color: "bg-[hsl(35,90%,55%)]", bar: "w-[43%]" },
              { label: "Past", count: 14, pct: "33%", color: "bg-primary", bar: "w-[33%]" },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-on-surface font-medium">{r.label}</span>
                  <span className="text-xs text-[hsl(215,15%,50%)]">{r.count} ({r.pct})</span>
                </div>
                <div className="h-2 bg-surface-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color} ${r.bar}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[hsl(222,20%,12%,0.2)]">
            <h4 className="text-sm font-bold text-white mb-3">Asosiy Tavsiyalar</h4>
            <ol className="space-y-2 text-xs text-[hsl(215,15%,55%)]">
              <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Autentifikatsiya endpointidagi SQLi ni zudlik bilan yamash</li>
              <li className="flex gap-2"><span className="text-primary font-bold">2.</span> PCI-DSS konfiguratsiya o'zgarishlarini hal qilish</li>
              <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Barcha xizmatlarda CSP sarlavhalarini yoqish</li>
              <li className="flex gap-2"><span className="text-primary font-bold">4.</span> IoT gateway xavfsizlik boshqaruvlarini ko'rib chiqish</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Compliance Matrix */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost">
        <h3 className="font-bold text-white mb-4">Muvofiqlik holati matrisasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { framework: "SOC2 Type II", status: "98.4%", statusLabel: "Muvofiq", color: "text-primary", bg: "bg-primary/10" },
            { framework: "PCI-DSS v4.0", siljish: "84%", statusLabel: "12 ta siljish", color: "text-sentinel-tertiary", bg: "bg-sentinel-tertiary/10" },
            { framework: "HIPAA", status: "Kutilmoqda", statusLabel: "Audit rejalashtirilgan", color: "text-[hsl(215,15%,55%)]", bg: "bg-surface-high" },
          ].map((c) => (
            <div key={c.framework} className="bg-surface-container rounded-lg p-5 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-on-surface">{c.framework}</h4>
                <p className="text-xs text-[hsl(215,15%,45%)]">{c.statusLabel}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${c.color} ${c.bg}`}>{c.status || c.siljish}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveBriefPage;
