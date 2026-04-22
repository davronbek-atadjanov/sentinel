import PageHeader from "@/components/shared/PageHeader"
import SeverityBadge from "@/components/shared/SeverityBadge"
import StatusBadge from "@/components/shared/StatusBadge"
import { ScansService } from "@/services/scans.service"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

const OwaspZapResultsPage = () => {
  const { id } = useParams();
  const scanId = Number(id);

  const {
    data: scanData,
    isLoading: scanLoading,
    isError: scanError,
  } = useQuery({
    queryKey: ["scans", scanId],
    queryFn: () => ScansService.getScan(scanId),
    enabled: Number.isFinite(scanId),
  });

  const {
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useQuery({
    queryKey: ["scans", scanId, "results"],
    queryFn: () => ScansService.getResults(scanId),
    enabled: Number.isFinite(scanId),
    refetchInterval: 5000,
  });

  const scan = scanData?.data;
  const results = resultsData?.data;
  const summary = results?.summary || {};
  const vulnerabilities = results?.vulnerabilities || [];
  const totalVulns = summary.total ?? vulnerabilities.length;

  const severityCounts = [
    { key: "critical", label: "Kritik", count: summary.critical || 0, color: "bg-sentinel-error" },
    { key: "high", label: "Yuqori", count: summary.high || 0, color: "bg-sentinel-tertiary" },
    { key: "medium", label: "O'rtacha", count: summary.medium || 0, color: "bg-[hsl(35,90%,55%)]" },
    { key: "low", label: "Past", count: summary.low || 0, color: "bg-primary" },
    { key: "info", label: "Ma'lumot", count: summary.info || 0, color: "bg-on-surface-variant" },
  ];

  const maxCount = Math.max(1, ...severityCounts.map((item) => item.count));
  const progress = results?.progress ?? scan?.progress ?? 0;
  const status = results?.status || scan?.status || "UNKNOWN";
  return (
    <div>
      <PageHeader
        title="Skan natijalari"
        description={
          scan
            ? `Nishon: ${scan.target_url} • Turi: ${scan.scan_type}`
            : "Skan natijalari yuklanmoqda"
        }
        badge={
          Number.isFinite(scanId) && (
            <span className="px-2 py-1 bg-primary-container text-primary text-[10px] font-bold uppercase rounded ml-3 mt-2">
              Skanerlash #{scanId}
            </span>
          )
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-low rounded-xl p-5 border-ghost text-center">
          <p className="text-2xl font-bold font-headline text-white">{totalVulns}</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Jami zaifliklar</p>
        </div>
        <div className="bg-surface-low rounded-xl p-5 border-ghost text-center">
          <p className="text-2xl font-bold font-headline text-white">{summary.critical || 0}</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Kritik</p>
        </div>
        <div className="bg-surface-low rounded-xl p-5 border-ghost text-center">
          <p className="text-2xl font-bold font-headline text-white">{progress}%</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Progress</p>
        </div>
        <div className="bg-surface-low rounded-xl p-5 border-ghost text-center">
          <p className="text-2xl font-bold font-headline text-white">{status}</p>
          <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">Skan holati</p>
        </div>
      </div>

      {/* Severity Overview */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost mb-8">
        <h3 className="font-bold text-white mb-4">Jiddiylik taqsimoti</h3>
        <div className="flex items-end gap-8">
          {severityCounts.map((item) => (
            <div key={item.key} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-lg font-bold text-white">{item.count}</span>
              <div
                className={`w-full ${item.color} rounded-t-sm opacity-60`}
                style={{ height: `${Math.max(8, (item.count / maxCount) * 120)}px` }}
              />
              <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)]">
          <h3 className="font-bold text-white">Topilmalar ({vulnerabilities.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.15)]">
                <th className="px-5 py-3">Jiddiylik</th>
                <th className="px-5 py-3">Topilma</th>
                <th className="px-5 py-3">Joylashuv</th>
                <th className="px-5 py-3">Kategoriya</th>
                <th className="px-5 py-3">Holat</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {scanLoading || resultsLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Natijalar yuklanmoqda...
                  </td>
                </tr>
              ) : scanError || resultsError ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Natijalarni yuklab bo'lmadi.
                  </td>
                </tr>
              ) : vulnerabilities.length > 0 ? (
                vulnerabilities.map((vuln) => (
                  <tr key={vuln.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                    <td className="px-5 py-4"><SeverityBadge severity={vuln.severity.toLowerCase()} /></td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-on-surface block">{vuln.title}</span>
                      <span className="text-xs text-[hsl(215,15%,45%)]">ID: {vuln.id}</span>
                    </td>
                    <td className="px-5 py-4 text-primary font-mono text-xs">{vuln.affected_url || "—"}</td>
                    <td className="px-5 py-4 text-[hsl(215,15%,50%)] text-xs">{vuln.category || "—"}</td>
                    <td className="px-5 py-4"><StatusBadge status={vuln.status.toLowerCase()} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Bu skan uchun zaifliklar topilmadi.
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

export default OwaspZapResultsPage;
