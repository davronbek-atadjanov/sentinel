import PageHeader from "@/components/shared/PageHeader"
import { Calendar, Clock, Pause, Play, Plus, Trash2 } from "lucide-react"

const schedules = [
  { id: 1, name: "Kunlik Ishlab Chiqarish Perimetri", target: "api.sentinel-prod.io", frequency: "Har kuni 02:00 UTC da", type: "TO'LIQ OWASP", status: "faol", nextRun: "8 soat ichida", lastRun: "14 soat oldin" },
  { id: 2, name: "Haftalik Muvofiqlik Auditi", target: "*.sentinel-prod.io", frequency: "Har dushanba 04:00 UTC da", type: "MUVOFIQLIK", status: "faol", nextRun: "3 kun ichida", lastRun: "4 kun oldin" },
  { id: 3, name: "Staging Chuqur Skanerlash", target: "staging.sentinel.dev", frequency: "Har 6 soatda", type: "CHUQUR QIDIRUV", status: "to'xtatilgan", nextRun: "To'xtatilgan", lastRun: "2 kun oldin" },
  { id: 4, name: "Oylik PCI Baholash", target: "payment.sentinel-prod.io", frequency: "Har oyning 1-sanasida", type: "PCI-DSS", status: "faol", nextRun: "17 kun ichida", lastRun: "13 kun oldin" },
];

const ScanSchedulingPage = () => {
  return (
    <div>
      <PageHeader
        title="Skanerlashni Rejalashtirish"
        description="Takroriy xavfsizlik baholashlarini avtomatlashtiring. Infratuzilmangiz bo'ylab aqlli skanerlash orkestratsiyasini sozlang."
        actions={
          <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            Yangi Reja
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Calendar className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">4</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Faol Rejalar</p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Clock className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">128</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Shu Oydagi Skanerlashlar</p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Play className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">8soat</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Keyingi Skanerlashgacha</p>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {schedules.map((s) => (
          <div key={s.id} className={`bg-surface-low rounded-xl p-6 border-ghost flex flex-col md:flex-row md:items-center justify-between gap-4 ${s.status === "to'xtatilgan" ? "opacity-60" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  s.status === "faol" ? "bg-primary/10 text-primary" : "bg-surface-high text-[hsl(215,15%,50%)]"
                }`}>
                  {s.status}
                </span>
                <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-on-surface uppercase">
                  {s.type}
                </span>
              </div>
              <p className="text-xs text-primary font-mono mb-1">{s.target}</p>
              <p className="text-xs text-[hsl(215,15%,45%)]">{s.frequency}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-[hsl(215,15%,45%)]">Keyingisi: <span className="text-on-surface font-medium">{s.nextRun}</span></p>
                <p className="text-xs text-[hsl(215,15%,40%)]">Oxirgisi: {s.lastRun}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-high text-[hsl(215,15%,50%)] hover:text-white transition-colors">
                  {s.status === "faol" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg bg-surface-container hover:bg-error-container text-[hsl(215,15%,50%)] hover:text-on-error-container transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanSchedulingPage;
