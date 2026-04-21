import { Link, useNavigate } from "react-router-dom";
import { ServerCrash, Globe, Lock, Code, LayoutDashboard } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetsService } from "@/services/assets.service";
import { toast } from "sonner";

const assetTypes = [
  { id: "WEB_APP", label: "Web Application", desc: "A deployed web application with internal routing.", active: true, icon: Globe },
  { id: "API", label: "API Endpoint", desc: "REST or GraphQL API endpoints for data exchange.", icon: Code },
  { id: "NETWORK", label: "Network Infrastructure", desc: "IP Address, Server, or Network device.", icon: ServerCrash },
  { id: "MOBILE", label: "Mobile Application", desc: "Mobile backend infrastructure or connected service.", icon: LayoutDashboard },
];

const AssetConfigPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [selectedType, setSelectedType] = useState("WEB_APP");

  const createAssetMutation = useMutation({
    mutationFn: AssetsService.createAsset,
    onSuccess: () => {
      toast.success("Asset successfully added");
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      navigate("/app/assets");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || "Failed to add asset");
    }
  });

  const handleCreateAsset = () => {
    if (!assetName.trim()) {
      toast.error("Asset Name is required");
      return;
    }
    if (!assetUrl.trim()) {
      toast.error("Asset URL is required");
      return;
    }
    
    createAssetMutation.mutate({
      name: assetName,
      url: assetUrl,
      asset_type: selectedType,
    });
  };

  return (
    <div>
      <PageHeader
        title="Asset Configuration"
        description="Register a new digital asset (Domain, IP, or Application) to your organization's attack surface scope."
        actions={
          <>
            <button 
              onClick={() => navigate("/app/assets")}
              className="bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleCreateAsset}
              disabled={createAssetMutation.isPending}
              className="bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50"
            >
              {createAssetMutation.isPending ? "Adding Asset..." : "Register Asset"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Column: Config Form ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Identity & Origin */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h3 className="font-bold font-headline text-white text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="w-3 h-3 border-2 border-primary rounded-full" />
              </span>
              Identity & Origin
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-2">
                  Asset Name (Identifier)
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. Production Core API"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Target URL / Hostname
                </label>
                <input
                  type="text"
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://api.mycompany.com"
                  className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {assetTypes.map((type) => {
                  const isActive = type.id === selectedType;
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-lg text-left transition-all flex items-start gap-4 ${
                        isActive
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-surface-container border-ghost hover:bg-surface-high"
                      }`}
                    >
                      <div className={`mt-0.5 rounded p-1.5 ${isActive ? "bg-primary/20 text-primary" : "bg-background text-[hsl(215,15%,50%)]"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold mb-1 ${isActive ? "text-primary" : "text-on-surface"}`}>
                          {type.label}
                        </h4>
                        <p className="text-xs text-[hsl(215,15%,45%)] leading-relaxed">{type.desc}</p>
                      </div>
                      {isActive && <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Advanced Properties */}
          <div className="bg-surface-low rounded-xl p-6 border-ghost opacity-60 pointer-events-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold font-headline text-white text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Advanced Properties (Future Release)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Environment Tags
                </label>
                <div className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-[hsl(215,15%,40%)]">
                  Production, Staging, QA...
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold block mb-2">
                  Owner Email Context
                </label>
                <div className="w-full bg-surface-container border-ghost rounded-lg px-4 py-3 text-sm text-[hsl(215,15%,40%)]">
                  secops@organization.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Info Panel ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-low rounded-xl p-6 border-ghost">
            <h4 className="text-sm font-bold text-on-surface mb-2">Asset Registration Guide</h4>
            <p className="text-xs text-[hsl(215,15%,45%)] leading-relaxed mb-6">
              Adding a new asset registers it into the Sentinel continuous monitoring loop. 
              Ensure that your organization holds authorization to scan this boundary.
            </p>

            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h5 className="text-sm font-bold text-on-surface mb-0.5">Resolvable URI</h5>
                  <p className="text-xs text-[hsl(215,15%,40%)] leading-relaxed">
                    Target hostnames must be resolvable exactly as typed.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-[hsl(222,20%,15%)] text-[hsl(215,15%,50%)] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h5 className="text-sm font-bold text-on-surface mb-0.5">Type Accuracy</h5>
                  <p className="text-xs text-[hsl(215,15%,40%)] leading-relaxed">
                    Engines prioritize payloads based on asset type semantics.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetConfigPage;
