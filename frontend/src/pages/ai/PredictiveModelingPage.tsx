import PageHeader from "@/components/shared/PageHeader"
import { AlertTriangle, Brain, TrendingUp } from "lucide-react"

const predictions = [
  { category: "SQL Inyektsiyasi", current: 12, predicted: 18, trend: "+50%", risk: "High", confidence: 89 },
  { category: "XSS Hujumlari", current: 8, predicted: 6, trend: "-25%", risk: "Medium", confidence: 92 },
  { category: "Autentifikatsiyani Chetlab O'tish", current: 3, predicted: 7, trend: "+133%", risk: "Critical", confidence: 78 },
  { category: "SSRF", current: 1, predicted: 4, trend: "+300%", risk: "High", confidence: 71 },
  { category: "Noto'g'ri Sozlama", current: 15, predicted: 12, trend: "-20%", risk: "Low", confidence: 95 },
];

const PredictiveModelingPage = () => {
  return (
    <div>
      <PageHeader
        title="Bashoratli Xavf Modellashtirish"
        description="ML-quvvatlangan zaiflik tendensiyalarini prognoz qilish. Ma'lumotlarga asoslangan xulosalar yordamida yuzaga keladigan potentsial xavflarni oldindan ko'ring va xavfsizlik sarmoyalarini ustuvorliklarga ajrating."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><TrendingUp className="w-4 h-4 text-primary" /><span className="text-[10px] text-primary font-bold uppercase">Model v3.2</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Bashorat Aniqligi", value: "87%", icon: Brain },
          { label: "Kuzatilgan Xavf Vektorlari", value: "142", icon: TrendingUp },
          { label: "Xavf Bali (30k)", value: "Yuqori", icon: AlertTriangle, color: "text-sentinel-tertiary" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-6 border-ghost flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold font-headline ${s.color || "text-white"}`}>{s.value}</p>
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Chart */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost mb-8">
        <h3 className="font-bold text-white mb-6">30 kunlik Zaiflik Prognozi</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.2)]">
                <th className="px-5 py-3">Toifa</th>
                <th className="px-5 py-3">Hozirgi</th>
                <th className="px-5 py-3">Bashorat qilingan (30k)</th>
                <th className="px-5 py-3">Tendensiya</th>
                <th className="px-5 py-3">Xavf Darajasi</th>
                <th className="px-5 py-3">Ishonch Darajasi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {predictions.map((p) => (
                <tr key={p.category} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-4 font-semibold text-on-surface">{p.category}</td>
                  <td className="px-5 py-4 text-[hsl(215,15%,55%)]">{p.current}</td>
                  <td className="px-5 py-4 text-white font-bold">{p.predicted}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${p.trend.startsWith("+") ? "text-sentinel-tertiary" : "text-primary"}`}>
                      {p.trend}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold ${
                      p.risk === "Critical" ? "text-sentinel-error" :
                      p.risk === "High" ? "text-sentinel-tertiary" :
                      p.risk === "Medium" ? "text-[hsl(35,90%,55%)]" : "text-primary"
                    }`}>
                      {p.risk === "Critical" ? "Kritik" : p.risk === "High" ? "Yuqori" : p.risk === "Medium" ? "O'rta" : "Past"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-surface-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <span className="text-[10px] text-[hsl(215,15%,55%)]">{p.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface-low rounded-xl p-6 border-ghost border-l-4 border-l-sentinel-tertiary">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-sentinel-tertiary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">AI Bashorat Ogohlantirishi</h4>
            <p className="text-xs text-[hsl(215,15%,55%)] leading-relaxed">
              Model kelasi 30 kun ichida autentifikatsiyani chetlab o'tishga urinishlar <span className="text-sentinel-tertiary font-bold">133% ga ko'payishini</span> bashorat qilmoqda. 
              Bu OAuth2 ilovalariga yo'naltirilgan yaqinda nashr etilgan eksploit to'plamlari bilan bog'liq. Barcha autentifikatsiya manzillari zudlik bilan ko'rib chiqilishi tavsiya etiladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveModelingPage;
