import PageHeader from "@/components/shared/PageHeader"
import StatusBadge from "@/components/shared/StatusBadge"
import { ScansService } from "@/services/scans.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Copy, Loader, Zap } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const ScanDetailPage = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: scan, isLoading, isError } = useQuery({
    queryKey: ["scans", scanId],
    queryFn: () => ScansService.getScan(Number(scanId)),
    refetchInterval: 3000,
  });

  const reScanMutation = useMutation({
    mutationFn: () => {
      if (!scan?.data) throw new Error("Scan not found");
      const scanData = scan.data;
      return ScansService.createScan({
        target_url: scanData.target_url,
        scan_type: scanData.scan_type,
        config: scanData.config,
      });
    },
    onSuccess: () => {
      toast.success("Skanerlash qayta boshlanmoqda, bir xil konfiguratsiya bilan");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      navigate("/app/scans");
    },
    onError: (err: any) => {
      toast.error(err.message || "Skanerlash qayta boshlanishida xatolik");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !scan) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Skanerlash topilmadi</p>
        <button
          onClick={() => navigate("/app/scans")}
          className="mt-4 text-primary hover:underline"
        >
          Skanerlashlar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  const scanData = scan.data || scan;
  const config = scanData.config || {};
  const advanced = config.advanced || {};
  const auth = config.auth || {};
  const schedule = config.schedule || {};

  return (
    <div>
      <PageHeader
        title="Skanerlash Tafsiloti"
        description={`${scanData.target_url} — ${scanData.scan_type}`}
        actions={
          <>
            <button
              onClick={() => navigate("/app/scans")}
              className="flex items-center gap-2 bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </button>
            <button
              onClick={() => reScanMutation.mutate()}
              disabled={reScanMutation.isPending}
              className="flex items-center gap-2 bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {reScanMutation.isPending ? "Qayta boshlanmoqda..." : "Bir xil config bilan qayta skanerlash"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Main Info */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold text-white text-lg mb-4">Asosiy Ma'lumotlar</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
                  Nishon URL
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-primary bg-surface-container rounded px-3 py-2 flex-1 break-all">
                    {scanData.target_url}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scanData.target_url);
                      toast.success("Nusxalandi");
                    }}
                    className="text-[hsl(215,15%,45%)] hover:text-primary transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
                  Skan Turi
                </p>
                <p className="text-sm text-on-surface font-semibold">{scanData.scan_type}</p>
              </div>
              <div>
                <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
                  Status
                </p>
                <StatusBadge status={scanData.status.toLowerCase()} />
              </div>
              <div>
                <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
                  Progress
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${scanData.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-primary w-12 text-right">
                    {scanData.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          {Object.keys(config).length > 0 && (
            <div className="bg-surface-low rounded-xl p-6 border-ghost">
              <h3 className="font-bold text-white text-lg mb-4">Konfiguratsiya Detallar</h3>

              {/* Asset Type */}
              {config.asset_type && (
                <div className="mb-6 pb-6 border-b border-outline-variant">
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-2">
                    Aktiv Turi (Override)
                  </p>
                  <p className="text-sm text-on-surface font-semibold">{config.asset_type}</p>
                </div>
              )}

              {/* Auth Configuration */}
              {Object.keys(auth).length > 0 && (
                <div className="mb-6 pb-6 border-b border-outline-variant">
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Autentifikatsiya
                  </p>
                  <div className="space-y-2 text-sm">
                    {auth.username && (
                      <p>
                        <span className="text-[hsl(215,15%,45%)]">Foydalanuvchi:</span>{" "}
                        <span className="text-on-surface font-semibold">{auth.username}</span>
                      </p>
                    )}
                    {auth.password && (
                      <p>
                        <span className="text-[hsl(215,15%,45%)]">Parol:</span>{" "}
                        <span className="text-on-surface font-semibold">••••••••</span>
                      </p>
                    )}
                    {auth.login_url && (
                      <p>
                        <span className="text-[hsl(215,15%,45%)]">Login URL:</span>{" "}
                        <code className="text-primary bg-surface-container rounded px-2 py-0.5 text-xs break-all">
                          {auth.login_url}
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Advanced Parameters */}
              {Object.keys(advanced).length > 0 && (
                <div className="mb-6 pb-6 border-b border-outline-variant">
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Murakkab Parametrlar
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {advanced.depth !== undefined && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">Qidiruv Chuqurligi</p>
                        <p className="text-sm font-semibold text-primary">{advanced.depth}</p>
                      </div>
                    )}
                    {advanced.parallelism !== undefined && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">Parallelizm</p>
                        <p className="text-sm font-semibold text-primary">{advanced.parallelism} so'rov/s</p>
                      </div>
                    )}
                    {advanced.force_https && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">HTTPS Majburiy</p>
                        <p className="text-sm font-semibold text-green-400">✓ Yoqilgan</p>
                      </div>
                    )}
                    {advanced.follow_redirects && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">Qayta yo'naltirishlar</p>
                        <p className="text-sm font-semibold text-green-400">✓ Yoqilgan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Information */}
              {Object.keys(schedule).length > 0 && (
                <div>
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Rejalashtirilgan Reja
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {schedule.frequency && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">Takrorlanish</p>
                        <p className="text-sm font-semibold text-on-surface">
                          {schedule.frequency === "DAILY"
                            ? "Kunlik"
                            : schedule.frequency === "WEEKLY"
                              ? "Haftalik"
                              : "Oylik"}
                        </p>
                      </div>
                    )}
                    {(schedule.start_time || schedule.end_time) && (
                      <div className="bg-surface-container rounded p-3">
                        <p className="text-xs text-[hsl(215,15%,45%)] mb-1">Bajarish Vaqti (UTC)</p>
                        <p className="text-sm font-semibold text-on-surface">
                          {schedule.start_time} - {schedule.end_time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Modules */}
              {config.custom_modules && Object.keys(config.custom_modules).length > 0 && (
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                    Maxsus Profil Modullar
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {config.custom_modules.headerAnalysis && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">HTTP Headers</span>
                      </div>
                    )}
                    {config.custom_modules.sslCheck && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">SSL/TLS</span>
                      </div>
                    )}
                    {config.custom_modules.portScan && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">Port Scan</span>
                      </div>
                    )}
                    {config.custom_modules.xssScan && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">XSS</span>
                      </div>
                    )}
                    {config.custom_modules.sqliScan && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">SQLi</span>
                      </div>
                    )}
                    {config.custom_modules.nucleiScan && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">Nuclei</span>
                      </div>
                    )}
                    {config.custom_modules.zapScan && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-on-surface">OWASP ZAP</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Results Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Results Summary */}
          {scanData.results_summary && (
            <div className="bg-surface-low rounded-xl p-6 border-ghost">
              <h3 className="font-bold text-white text-lg mb-4">Natijalar Xulosasi</h3>
              <div className="space-y-3">
                {scanData.results_summary.total !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(215,15%,45%)]">Jami Topilgan</span>
                    <span className="text-lg font-bold text-on-surface">
                      {scanData.results_summary.total}
                    </span>
                  </div>
                )}
                {scanData.results_summary.critical !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(215,15%,45%)]">Kritik</span>
                    <span className="text-lg font-bold text-sentinel-error">
                      {scanData.results_summary.critical}
                    </span>
                  </div>
                )}
                {scanData.results_summary.high !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(215,15%,45%)]">Yuqori</span>
                    <span className="text-lg font-bold text-sentinel-tertiary">
                      {scanData.results_summary.high}
                    </span>
                  </div>
                )}
                {scanData.results_summary.medium !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(215,15%,45%)]">O'rtacha</span>
                    <span className="text-lg font-bold text-[hsl(35,90%,55%)]">
                      {scanData.results_summary.medium}
                    </span>
                  </div>
                )}
                {scanData.results_summary.low !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[hsl(215,15%,45%)]">Past</span>
                    <span className="text-lg font-bold text-primary">
                      {scanData.results_summary.low}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Info */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold text-white text-lg mb-4">Vaqt</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-1">
                  Yaratilgan
                </p>
                <p className="text-sm text-on-surface">
                  {new Date(scanData.created_at).toLocaleString()}
                </p>
              </div>
              {scanData.started_at && (
                <div>
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-1">
                    Boshlangan
                  </p>
                  <p className="text-sm text-on-surface">
                    {new Date(scanData.started_at).toLocaleString()}
                  </p>
                </div>
              )}
              {scanData.completed_at && (
                <div>
                  <p className="text-xs text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-1">
                    Tugallangan
                  </p>
                  <p className="text-sm text-on-surface">
                    {new Date(scanData.completed_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailPage;
