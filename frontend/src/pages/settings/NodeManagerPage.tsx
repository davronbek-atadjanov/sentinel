import PageHeader from "@/components/shared/PageHeader"
import { Activity, Cpu, HardDrive, Server } from "lucide-react"

const nodes = [
  { id: "NODE-001", name: "Scanner Alpha", region: "US-East", status: "onlayn", cpu: 72, memory: 68, disk: 45, uptime: "14k 6s", version: "v2.4.1", scans: 1284 },
  { id: "NODE-002", name: "Scanner Beta", region: "EU-West", status: "onlayn", cpu: 45, memory: 52, disk: 38, uptime: "28k 12s", version: "v2.4.1", scans: 956 },
  { id: "NODE-003", name: "Scanner Gamma", region: "AP-South", status: "texnik xizmat", cpu: 0, memory: 12, disk: 22, uptime: "—", version: "v2.3.8", scans: 0 },
  { id: "NODE-004", name: "Scanner Delta", region: "US-West", status: "onlayn", cpu: 88, memory: 91, disk: 67, uptime: "7k 3s", version: "v2.4.1", scans: 2103 },
  { id: "NODE-005", name: "Scanner Epsilon", region: "EU-Central", status: "oflayn", cpu: 0, memory: 0, disk: 55, uptime: "—", version: "v2.4.0", scans: 0 },
];

const NodeManagerPage = () => {
  return (
    <div>
      <PageHeader
        title="Ichki Tugunlar Boshqaruvi"
        description="Taqsimlangan skanerlash infratuzilmasini kuzatib boring va boshqaring."
        actions={
          <button className="bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-lg shadow-primary/10 hover:brightness-110 transition-all">
            Yangi Tugun Joylashtirish
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {[
          { label: "Jami Tugunlar", value: "5", icon: Server },
          { label: "Onlayn", value: "3", icon: Activity, color: "text-primary" },
          { label: "O'rtacha CPU", value: "51%", icon: Cpu },
          { label: "Jami Skanerlashlar", value: "4,343", icon: HardDrive },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[hsl(215,15%,40%)] uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color || "text-[hsl(215,15%,35%)]"}`} />
            </div>
            <p className="text-2xl font-bold text-white font-headline">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Nodes Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-6 border-b border-[hsl(222,20%,12%,0.3)] bg-surface-high/30">
          <h3 className="font-bold font-headline text-white">Tugunlar Reestri</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,40%)] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Tugun ID</th>
                <th className="px-6 py-4">Nomi</th>
                <th className="px-6 py-4">Mintaqa</th>
                <th className="px-6 py-4">Holati</th>
                <th className="px-6 py-4">CPU</th>
                <th className="px-6 py-4">Xotira</th>
                <th className="px-6 py-4">Ishlash Vaqti</th>
                <th className="px-6 py-4">Versiya</th>
                <th className="px-6 py-4">Jami Skanerlashlar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-[hsl(222,30%,6%,0.4)] transition-colors border-t border-[hsl(222,20%,10%,0.2)]">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-primary">{node.id}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[hsl(215,20%,85%)]">{node.name}</td>
                  <td className="px-6 py-4 text-[hsl(215,15%,55%)]">{node.region}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                      node.status === "onlayn" ? "bg-primary/10 text-primary" :
                      node.status === "texnik xizmat" ? "bg-sentinel-tertiary/10 text-sentinel-tertiary" :
                      "bg-sentinel-error/10 text-sentinel-error"
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[hsl(222,30%,10%)] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${node.cpu > 80 ? "bg-sentinel-tertiary" : "bg-primary"}`} style={{ width: `${node.cpu}%` }} />
                      </div>
                      <span className="text-[10px] text-[hsl(215,15%,45%)] font-mono">{node.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[hsl(222,30%,10%)] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${node.memory > 80 ? "bg-sentinel-error" : "bg-primary"}`} style={{ width: `${node.memory}%` }} />
                      </div>
                      <span className="text-[10px] text-[hsl(215,15%,45%)] font-mono">{node.memory}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[hsl(215,15%,50%)] text-xs font-mono">{node.uptime}</td>
                  <td className="px-6 py-4 text-[hsl(215,15%,50%)] text-xs font-mono">{node.version}</td>
                  <td className="px-6 py-4 text-[hsl(215,20%,85%)] font-semibold">{node.scans.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NodeManagerPage;
