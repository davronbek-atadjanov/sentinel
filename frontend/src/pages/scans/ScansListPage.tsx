import { Link } from "react-router-dom";
import {
  Settings2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Zap,
  Network,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScansService } from "@/services/scans.service";
import { toast } from "sonner";
import { XCircle, Trash2 } from "lucide-react";

const threatColors: Record<string, string> = {
  critical: "bg-sentinel-error",
  high: "bg-sentinel-tertiary",
  medium: "bg-[hsl(35,90%,55%)]",
  low: "bg-primary",
  info: "bg-on-surface-variant",
};

const ScansListPage = () => {
  const queryClient = useQueryClient();

  const { data: scansData, isLoading } = useQuery({
    queryKey: ["scans"],
    queryFn: () => ScansService.getScans(),
    refetchInterval: 5000,
  });

  const cancelMutation = useMutation({
    mutationFn: ScansService.cancelScan,
    onSuccess: () => {
      toast.success("Scan cancelled");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ScansService.deleteScan,
    onSuccess: () => {
      toast.success("Scan deleted");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["scans", "stats"],
    queryFn: () => ScansService.getStats(),
  });

  const displayScans = scansData?.results
    ? scansData.results.map((s: any) => {
        let threats: string[] = [];
        const sum = s.results_summary || {};
        if (sum.critical) threats.push("critical");
        if (sum.high) threats.push("high");
        if (sum.medium) threats.push("medium");
        if (sum.low) threats.push("low");
        if (sum.info) threats.push("info");
        
        return {
          id: s.id,
          target: s.target_url,
          started: s.started_at ? new Date(s.started_at).toLocaleString() : new Date(s.created_at).toLocaleString(),
          type: s.scan_type,
          status: s.status.toLowerCase() as any,
          progress: s.progress,
          threats: threats.length > 0 ? threats : ["info"],
        };
      })
    : [];

  const stats = statsData?.data || { active_scans: 0, by_status: {}, by_type: {}, total_scans: 0 };
  const completedScans = stats.by_status?.COMPLETED || 0;
  // Note: we'd need actual total critical risks across vulnerabilities, but for scans summary we can just show total scans or similar
  const statsCards = [
    { label: "Live Scans", value: stats.active_scans.toString().padStart(2, "0"), dot: stats.active_scans > 0 },
    { label: "Completed Scans", value: completedScans.toString() },
    { label: "Total Scans", value: stats.total_scans.toString() },
  ];

  return (
    <div>
      <PageHeader
        title="Scans."
        description="Orchestrate automated penetration testing across your infrastructure. Surgical precision for modern assets."
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Settings2 className="w-4 h-4" />
              View Settings
            </button>
            <Link
              to="/app/scans/new"
              className="flex items-center gap-2 bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Scan
            </Link>
          </>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-surface-low rounded-xl p-6 border-ghost">
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mb-2">
              {card.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-headline text-white tracking-tight">
                {card.value}
              </span>
              {card.dot && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mb-3">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-surface-container rounded text-xs text-on-surface font-medium">
              All Statuses
            </span>
            <span className="px-3 py-1 bg-surface-container rounded text-xs text-on-surface font-medium">
              Last 24 Hours
            </span>
          </div>
          <button className="text-primary text-[10px] font-bold uppercase mt-3 hover:underline">
            Reset
          </button>
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.3)]">
                <th className="px-6 py-4">Target Endpoint</th>
                <th className="px-6 py-4">Scan Type</th>
                <th className="px-6 py-4">Progress / Status</th>
                <th className="px-6 py-4">Threat Level</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading scans...
                  </td>
                </tr>
              ) : displayScans.length > 0 ? (
                displayScans.map((scan: any) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-[hsl(222,30%,6%,0.4)] transition-colors border-b border-[hsl(222,20%,12%,0.1)]"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <Link
                          to={`/app/scans/${scan.id}/results`}
                          className="font-semibold text-[hsl(215,20%,85%)] hover:text-primary transition-colors"
                        >
                          {scan.target}
                        </Link>
                        <p className="text-[10px] text-[hsl(215,15%,40%)] mt-0.5">
                          Started {scan.started}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface uppercase tracking-wide">
                        {scan.type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={scan.status} />
                        {(scan.status === "running" || scan.status === "pending") && (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1 bg-surface-high rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${scan.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[hsl(215,15%,55%)]">
                              {scan.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-1.5">
                        {scan.threats.map((t: any, i: number) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${threatColors[t] || "bg-on-surface-variant"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        {(scan.status === "running" || scan.status === "pending") && (
                          <button 
                            onClick={() => cancelMutation.mutate(scan.id)}
                            className="text-[hsl(215,15%,55%)] hover:text-[hsl(35,90%,65%)] transition-colors"
                            title="Cancel Scan"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if(window.confirm("Are you sure you want to delete this scan?")) {
                              deleteMutation.mutate(scan.id);
                            }
                          }}
                          className="text-[hsl(215,15%,55%)] hover:text-sentinel-error transition-colors"
                          title="Delete Scan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Zap className="w-10 h-10 text-[hsl(215,15%,35%)] mb-3" />
                      <p className="text-[hsl(215,15%,65%)] font-semibold">No scans found.</p>
                      <p className="text-[hsl(215,15%,40%)] text-sm mb-4">You haven't initiated any scans yet.</p>
                      <Link 
                        to="/app/scans/new"
                        className="bg-[hsl(222,30%,12%)] hover:bg-[hsl(222,30%,15%)] text-white text-xs font-bold px-4 py-2 rounded transition-colors"
                      >
                        Create Your First Scan
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex justify-between items-center border-t border-[hsl(222,20%,12%,0.15)]">
          <span className="text-[10px] text-[hsl(215,15%,40%)] uppercase tracking-widest font-semibold">
            Showing {displayScans.length} of {scansData?.count || 0} Total Scans
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary-fixed text-xs font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">
              3
            </button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-low rounded-xl p-6 border-ghost flex items-start gap-6">
          <div className="flex-1">
            <h4 className="font-bold font-headline text-white mb-2">Automated Discovery</h4>
            <p className="text-body-md text-[hsl(215,15%,50%)] mb-4">
              Sentinel detected 14 new endpoints in your architecture. Should we scan them?
            </p>
            <Link
              to="/app/assets"
              className="text-primary text-label-sm uppercase font-bold hover:underline flex items-center gap-1"
            >
              Review Endpoints →
            </Link>
          </div>
          <Network className="w-16 h-16 text-primary/20" />
        </div>
        <div className="bg-surface-low rounded-xl p-6 border-ghost flex items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-sentinel-tertiary" />
              <h4 className="font-bold font-headline text-white">Scan Performance</h4>
            </div>
            <p className="text-body-md text-[hsl(215,15%,50%)] mb-4">
              Average scan completion time has decreased by 14% this week due to engine
              optimizations.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-surface-high rounded-full overflow-hidden">
                <div className="h-full w-[86%] bg-gradient-to-r from-sentinel-tertiary to-primary rounded-full" />
              </div>
              <span className="text-[10px] text-primary font-bold uppercase">Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScansListPage;
