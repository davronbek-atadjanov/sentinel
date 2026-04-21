import { Link, useNavigate } from "react-router-dom";
import { Lock, Sliders, Calendar, Zap, Lightbulb } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScansService } from "@/services/scans.service";
import { toast } from "sonner";

const scanTypes = [
  { id: "quick", label: "Quick Scan", desc: "Surface analysis of Top 10 OWASP threats.", active: true },
  { id: "full", label: "Full Audit", desc: "Comprehensive structural & logic testing." },
  { id: "custom", label: "Custom Profile", desc: "User-defined policy and rulesets." },
];

const schedules = [
  { label: "Daily Maintenance", active: true },
  { label: "Weekly Health Check" },
  { label: "Monthly Compliance Audit" },
];

const ScanConfigPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [targetUrl, setTargetUrl] = useState("https://api.production-environment.com");
  const [selectedType, setSelectedType] = useState("quick");

  const startScanMutation = useMutation({
    mutationFn: ScansService.createScan,
    onSuccess: () => {
      toast.success("Scan successfully initiated");
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      // Redirect to list to see progress
      navigate("/app/scans");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to start scan");
    }
  });

  const handleExecuteScan = () => {
    if (!targetUrl.trim()) {
      toast.error("Target URL is required");
      return;
    }
    startScanMutation.mutate({
      target_url: targetUrl,
      scan_type: selectedType.toUpperCase(),
    });
  };

  return (
    <div>
      <PageHeader
        title="Scan Configuration"
        description="Initialize a new surgical target scan or modify scheduled recurring assessments."
        actions={
          <>
            <button 
              onClick={() => navigate("/app/scans")}
              className="bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleExecuteScan}
              disabled={startScanMutation.isPending}
              className="bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50"
            >
              {startScanMutation.isPending ? "Starting..." : "Execute Scan"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Column: Config Form ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Primary Objective */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold font-headline text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-primary rounded-full" />
              </span>
              Primary Objective
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-2">
                  Target URL / Hostname
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {scanTypes.map((type) => {
                  const isActive = type.id === selectedType;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-surface-container border-ghost hover:bg-surface-high"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-sm font-bold ${isActive ? "text-primary" : "text-on-surface"}`}>
                          {type.label}
                        </h4>
                        {isActive && <span className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <p className="text-xs text-[hsl(215,15%,45%)]">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Authenticated Scanning */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline text-white text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Authenticated Scanning
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold">Status:</span>
                <span className="text-[10px] text-[hsl(215,15%,50%)] uppercase font-bold">Disabled</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Username / API Key
                </label>
                <input
                  type="text"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Password / Secret
                </label>
                <input
                  type="password"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                Login Form URL (Optional)
              </label>
              <input
                type="text"
                defaultValue="https://api.production-environment.com/v1/auth/login"
                className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Advanced Parameters */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold font-headline text-white text-lg flex items-center gap-2 mb-6">
              <Sliders className="w-5 h-5 text-primary" />
              Advanced Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                    Max Crawl Depth
                  </label>
                  <span className="text-sm text-primary font-mono font-bold">10 Levels</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  defaultValue="10"
                  className="w-full h-1 bg-surface-high rounded-full appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-primary/60 mt-2">
                  Determines how deep the spider explores the directory structure.
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                    Request Concurrency
                  </label>
                  <span className="text-sm text-primary font-mono font-bold">25 req/s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  defaultValue="25"
                  className="w-full h-1 bg-surface-high rounded-full appearance-none cursor-pointer accent-primary"
                />
                <p className="text-xs text-primary/60 mt-2">
                  Adjust to prevent overwhelming target server resources.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <label className="flex items-start gap-3 p-4 bg-surface-container rounded-lg cursor-pointer hover:bg-surface-high transition-colors">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30" />
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Force HTTPS</span>
                  <span className="text-xs text-[hsl(215,15%,45%)]">Automatically upgrade all insecure connections.</span>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 bg-surface-container rounded-lg cursor-pointer hover:bg-surface-high transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 rounded bg-surface-container border-outline-variant text-primary focus:ring-primary/30" />
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Follow Redirects</span>
                  <span className="text-xs text-[hsl(215,15%,45%)]">Trace 301/302 status codes during discovery.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Column: Schedule & Summary ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Temporal Schedule */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Temporal Schedule
              </h3>
              <div className="w-10 h-5 bg-surface-high rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-on-surface-variant rounded-full" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                Recurrence Pattern
              </p>
              {schedules.map((s) => (
                <div
                  key={s.label}
                  className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                    s.active
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-surface-container hover:bg-surface-high"
                  }`}
                >
                  <span className={`text-sm font-medium ${s.active ? "text-primary" : "text-on-surface"}`}>
                    {s.label}
                  </span>
                  {s.active && <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-on-primary-fixed font-bold">✓</span>}
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold mb-3">
                Execution Window (UTC)
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  defaultValue="02:00"
                  className="flex-1 bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface text-center font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
                <span className="text-[hsl(215,15%,45%)] text-sm">to</span>
                <input
                  type="text"
                  defaultValue="05:00"
                  className="flex-1 bg-surface-container border-ghost rounded-lg px-4 py-2.5 text-sm text-on-surface text-center font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
              <p className="text-xs text-[hsl(215,15%,40%)] mt-3">
                System scans are optimized for low-traffic windows to maintain service integrity.
              </p>
            </div>
          </div>

          {/* Execution Summary */}
          <div className="bg-surface-low rounded-xl p-6 border border-primary/20">
            <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-4">
              Execution Summary
            </p>
            <div className="space-y-3">
              {[
                { label: "Total Modules", value: "142" },
                { label: "Estimated Duration", value: "~14 mins" },
                { label: "Network Impact", value: "MINIMAL", valueColor: "text-primary" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-[hsl(215,15%,55%)]">{item.label}</span>
                  <span className={`text-sm font-bold font-mono ${item.valueColor || "text-on-surface"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ready for Deployment */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h4 className="font-bold text-white mb-1">Ready for Deployment</h4>
            <p className="text-xs text-[hsl(215,15%,45%)]">
              Agent "Sentinel-Alpha" on standby
            </p>
          </div>

          {/* Configuration Tip */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost border-l-4 border-l-primary/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Configuration Tip</h4>
                <p className="text-xs text-[hsl(215,15%,45%)]">
                  Increasing concurrency beyond 50 req/s might trigger WAF rate-limiting on modern cloud environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanConfigPage;
