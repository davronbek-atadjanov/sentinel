import PageHeader from "@/components/shared/PageHeader";
import { Calendar, Clock, Plus, Play, Pause, Trash2 } from "lucide-react";

const schedules = [
  { id: 1, name: "Daily Production Perimeter", target: "api.sentinel-prod.io", frequency: "Daily at 02:00 UTC", type: "FULL OWASP", status: "active", nextRun: "In 8 hours", lastRun: "14 hours ago" },
  { id: 2, name: "Weekly Compliance Audit", target: "*.sentinel-prod.io", frequency: "Every Monday 04:00 UTC", type: "COMPLIANCE", status: "active", nextRun: "In 3 days", lastRun: "4 days ago" },
  { id: 3, name: "Staging Deep Scan", target: "staging.sentinel.dev", frequency: "Every 6 hours", type: "DEEP DISCOVERY", status: "paused", nextRun: "Paused", lastRun: "2 days ago" },
  { id: 4, name: "Monthly PCI Assessment", target: "payment.sentinel-prod.io", frequency: "1st of each month", type: "PCI-DSS", status: "active", nextRun: "In 17 days", lastRun: "13 days ago" },
];

const ScanSchedulingPage = () => {
  return (
    <div>
      <PageHeader
        title="Scan Scheduling"
        description="Automate recurring security assessments. Configure intelligent scan orchestration across your infrastructure."
        actions={
          <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            New Schedule
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Calendar className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">4</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Active Schedules</p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Clock className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">128</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Scans This Month</p>
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <Play className="w-5 h-5 text-primary mb-3" />
          <p className="text-3xl font-bold font-headline text-white">8h</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Until Next Scan</p>
        </div>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {schedules.map((s) => (
          <div key={s.id} className={`bg-surface-low rounded-xl p-6 border-ghost flex flex-col md:flex-row md:items-center justify-between gap-4 ${s.status === "paused" ? "opacity-60" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  s.status === "active" ? "bg-primary/10 text-primary" : "bg-surface-high text-[hsl(215,15%,50%)]"
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
                <p className="text-xs text-[hsl(215,15%,45%)]">Next: <span className="text-on-surface font-medium">{s.nextRun}</span></p>
                <p className="text-xs text-[hsl(215,15%,40%)]">Last: {s.lastRun}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container hover:bg-surface-high text-[hsl(215,15%,50%)] hover:text-white transition-colors">
                  {s.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
