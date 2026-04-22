import PageHeader from "@/components/shared/PageHeader"
import { Brain, Crosshair, Shield, TrendingUp } from "lucide-react"

const threats = [
  { id: 1, name: "Ilg'or Doimiy Xavf (APT-29)", confidence: 94, severity: "Critical", vector: "Maqsadli fashing → Yonbosh Harakat", firstSeen: "2 soat oldin", status: "Faol Qidiruv" },
  { id: 2, name: "Ta'minot Zanjirining Buzilishi", confidence: 78, severity: "High", vector: "npm to'plami orqali qaramlik inyeksiyasi", firstSeen: "6 soat oldin", status: "Tekshirilmoqda" },
  { id: 3, name: "Ma'lumotlarni Kiritish Kampaniyasi", confidence: 88, severity: "High", vector: "Avtomatlashtirilgan kirish urinishlari (12,000+ IP lar)", firstSeen: "1 kun oldin", status: "Yengillashtirilgan" },
  { id: 4, name: "Nolinchi Kun Eksploit Urinishi", confidence: 62, severity: "Medium", vector: "Autentifikatsiya manzillariga qaratilgan noma'lum foydali yuk", firstSeen: "3 kun oldin", status: "Kuzatilmoqda" },
];

const ThreatHuntingPage = () => {
  return (
    <div>
      <PageHeader
        title="Faol Xavflarni Qidirish"
        description="Yangi hujum naqshlari, nolinchi kunlik zaifliklar va APT ko'rsatkichlarini doimiy ravishda kuzatib boruvchi AI ga asoslangan tahdidlarni aniqlash mexanizmi."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><Crosshair className="w-4 h-4 text-sentinel-tertiary" /><span className="text-[10px] text-sentinel-tertiary font-bold uppercase">Qidiruv Faol</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Faol Qidiruvlar", value: "4", icon: Crosshair },
          { label: "Topilgan Xavflar", value: "42", icon: Shield },
          { label: "AI Ishonchi", value: "94%", icon: Brain },
          { label: "Kuzatilgan IOC lar", value: "1.2K", icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {threats.map((t) => (
          <div key={t.id} className="bg-surface-low rounded-xl p-6 border-ghost border-l-2 border-l-sentinel-tertiary hover:bg-surface-container/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.severity === "Critical" ? "bg-error-container text-on-error-container" :
                    t.severity === "High" ? "bg-tertiary-container text-on-tertiary-container" :
                    "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]"
                  }`}>{t.severity}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "Faol Qidiruv" ? "text-sentinel-tertiary bg-sentinel-tertiary/10" :
                    t.status === "Yengillashtirilgan" ? "text-primary bg-primary/10" :
                    "text-[hsl(215,15%,50%)] bg-surface-high"
                  }`}>{t.status}</span>
                </div>
                <p className="text-xs text-[hsl(215,15%,50%)] mb-1">Vektor: {t.vector}</p>
                <p className="text-[10px] text-[hsl(215,15%,40%)]">Birinchi ko'rilgan: {t.firstSeen}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">AI Ishonchi</p>
                  <p className={`text-lg font-bold font-headline ${t.confidence > 80 ? "text-sentinel-tertiary" : "text-[hsl(35,90%,55%)]"}`}>{t.confidence}%</p>
                </div>
                <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors">
                  Tekshirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatHuntingPage;
