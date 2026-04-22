import PageHeader from "@/components/shared/PageHeader"
import { AlertTriangle, Clock, Play, Shield, Target } from "lucide-react"

const scenarios = [
  { id: 1, name: "APT Simulyatsiyasi — Yonlama Harakat (Lateral Movement)", type: "Murakkab", status: "Bajarilmoqda", progress: 67, duration: "23daq", findings: 8 },
  { id: 2, name: "Hisob Ma'lumotlarini Yig'ish Hujumi", type: "Ijtimoiy Muhandislik", status: "Tugallangan", progress: 100, duration: "15daq", findings: 3 },
  { id: 3, name: "Veb Ilova Ekspluatatsiyasi", type: "OWASP Top 10", status: "Tugallangan", progress: 100, duration: "42daq", findings: 14 },
  { id: 4, name: "Imtiyozlarni Oshirish Zanjiri", type: "Ekspluatatsiyadan Keyingi", status: "Navbatda", progress: 0, duration: "--", findings: 0 },
];

const RedTeamPage = () => {
  return (
    <div>
      <PageHeader
        title="Qizil Jamoa Avtomatizatsiyasi"
        description="Murakkab hujum ssenariylarini taqlid qiluvchi raqib simulyatsiyasi. Haqiqiy TTP (Taktika, Texnika va Jarayonlar) lar bilan xavfsizlik holatingizni stress-testdan o'tkazing."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><Target className="w-4 h-4 text-sentinel-tertiary" /><span className="text-[10px] text-sentinel-tertiary font-bold uppercase">1 ta Faol Simulyatsiya</span></span>}
        actions={
          <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Play className="w-4 h-4" />
            Yangi Simulyatsiya
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Jami Simulyatsiyalar", value: "48", icon: Target },
          { label: "Topilgan Zaifliklar", value: "127", icon: AlertTriangle },
          { label: "O'rtacha Davomiylik", value: "26daq", icon: Clock },
          { label: "Himoya Bali", value: "72%", icon: Shield },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {scenarios.map((s) => (
          <div key={s.id} className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white">{s.name}</h3>
                  <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface uppercase">{s.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === "Bajarilmoqda" ? "text-sentinel-tertiary bg-sentinel-tertiary/10" :
                    s.status === "Tugallangan" ? "text-primary bg-primary/10" :
                    "text-[hsl(215,15%,50%)] bg-surface-high"
                  }`}>{s.status}</span>
                </div>
                {s.status === "Bajarilmoqda" && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-48 h-1.5 bg-surface-high rounded-full overflow-hidden">
                      <div className="h-full bg-sentinel-tertiary rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-sentinel-tertiary font-bold">{s.progress}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-center">
                  <p className="text-[hsl(215,15%,45%)]">Davomiyligi</p>
                  <p className="text-on-surface font-bold">{s.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-[hsl(215,15%,45%)]">Topilmalar</p>
                  <p className={`font-bold ${s.findings > 0 ? "text-sentinel-tertiary" : "text-[hsl(215,15%,45%)]"}`}>{s.findings}</p>
                </div>
                <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors">
                  {s.status === "Tugallangan" ? "Hisobotni Ko'rish" : s.status === "Bajarilmoqda" ? "Kuzatish" : "Boshlash"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedTeamPage;
