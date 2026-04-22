import PageHeader from "@/components/shared/PageHeader"
import { Activity, AlertTriangle, Radio, Shield, Wifi, Zap } from "lucide-react"

const liveFeeds = [
  { id: 1, type: "scan", message: "api.sentinel.com uchun to'liq skanerlash boshlandi", time: "Hozirgina", severity: "info" },
  { id: 2, type: "alert", message: "Kritik: /upload endpointida RCE xavfi aniqlandi", time: "12 soniya oldin", severity: "critical" },
  { id: 3, type: "scan", message: "Port tekshiruvi yakunlandi — 3 ta ochiq port topildi", time: "45 soniya oldin", severity: "warning" },
  { id: 4, type: "alert", message: "/api/auth qismida SQL Injection hujumi bloklandi", time: "1 daqiqa oldin", severity: "critical" },
  { id: 5, type: "scan", message: "SSL sertifikati tekshiruvdan o'tdi", time: "2 daqiqa oldin", severity: "info" },
  { id: 6, type: "alert", message: "45.33.32.156 IP manzilidan noodatiy trafik uzilishi kuzatildi", time: "3 daqiqa oldin", severity: "warning" },
];

const activeNodes = [
  { name: "Skaner Alpha", status: "faol", load: 72, scans: 12 },
  { name: "Skaner Beta", status: "faol", load: 45, scans: 8 },
  { name: "Skaner Gamma", status: "kutilmoqda", load: 5, scans: 0 },
  { name: "Skaner Delta", status: "faol", load: 88, scans: 15 },
];

const RealTimeDashboardPage = () => {
  return (
    <div>
      <PageHeader
        title="Real vaqtdagi xavfsizlik paneli"
        description="Barcha xavfsizlik operatsiyalari va xavflarni real vaqt monitoringi."
        actions={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary">JONLI</span>
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Stats Row */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
          {[
            { label: "Faol xavflar", value: "7", icon: AlertTriangle, color: "text-sentinel-error" },
            { label: "Faol skanerlashlar", value: "4", icon: Activity, color: "text-primary" },
            { label: "To'xtatilgan hujumlar", value: "1,247", icon: Shield, color: "text-sentinel-success" },
            { label: "Tarmoq holati", value: "Sog'lom", icon: Wifi, color: "text-primary" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-low rounded-xl p-6 border-ghost">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[hsl(215,15%,40%)] uppercase tracking-widest">
                  {stat.label}
                </span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white font-headline">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Live Feed */}
        <div className="col-span-12 lg:col-span-8 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] flex justify-between items-center bg-surface-high/30">
            <h3 className="font-bold font-headline text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Jonli xavf lentasi
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              Avto-yangilash: 5 s
            </span>
          </div>
          <div className="divide-y divide-[hsl(222,20%,10%,0.3)]">
            {liveFeeds.map((feed) => (
              <div key={feed.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[hsl(222,30%,6%,0.4)] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  feed.severity === "critical" ? "bg-sentinel-error animate-pulse" :
                  feed.severity === "warning" ? "bg-sentinel-tertiary" :
                  "bg-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[hsl(215,20%,85%)] font-medium truncate">{feed.message}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  feed.severity === "critical" ? "bg-sentinel-error-container text-on-error-container" :
                  feed.severity === "warning" ? "bg-sentinel-tertiary-container text-sentinel-tertiary" :
                  "bg-primary/10 text-primary"
                }`}>
                  {feed.severity}
                </span>
                <span className="text-[10px] text-[hsl(215,15%,40%)] font-mono whitespace-nowrap">{feed.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Nodes */}
        <div className="col-span-12 lg:col-span-4 bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] bg-surface-high/30">
            <h3 className="font-bold font-headline text-white">Faol skanerlash tugunlari</h3>
          </div>
          <div className="p-4 space-y-3">
            {activeNodes.map((node, i) => (
              <div key={i} className="bg-surface-container rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-[hsl(215,20%,85%)]">{node.name}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    node.status === "faol" ? "bg-primary/10 text-primary" : "bg-[hsl(222,25%,15%)] text-[hsl(215,15%,45%)]"
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[hsl(222,30%,10%)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        node.load > 80 ? "bg-sentinel-tertiary" : "bg-primary"
                      }`}
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[hsl(215,15%,45%)] font-mono">{node.load}%</span>
                </div>
                <p className="text-[10px] text-[hsl(215,15%,40%)] mt-2">{node.scans} ta skan</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboardPage;
