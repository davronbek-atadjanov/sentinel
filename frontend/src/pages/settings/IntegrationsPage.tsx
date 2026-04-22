import PageHeader from "@/components/shared/PageHeader"
import {
    ExternalLink,
    Github,
    MessageSquare,
    Plus,
    Settings2,
    Ticket,
    Wrench
} from "lucide-react"

import { IntegrationsService } from "@/services/integrations.service"
import { ExternalApp } from "@/types/integrations.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

const SUPPORTED_INTEGRATIONS = {
  cicd: [
    { id: "github", name: "GitHub Actions", desc: "Avtomatik skanerlash tetiklari", icon: Github },
    { id: "jenkins", name: "Jenkins", desc: "Eski tuzilmalarni boshqarish", icon: Wrench },
  ],
  alerting: [
    { id: "slack", name: "Slack", desc: "Haqiqiy vaqtda tahdid ogohlantirishlari", icon: MessageSquare },
    { id: "teams", name: "Microsoft Teams", desc: "Korporativ aloqa", icon: MessageSquare },
  ],
  ticketing: [
    { id: "jira", name: "Atlassian Jira", desc: "Avtomatik chipta yaratish", icon: Ticket },
  ],
};

const IntegrationsPage = () => {
  const queryClient = useQueryClient();
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "", events: ["Scan.Finished"] });

  const { data: webhooksResponse, isLoading: loadingWebhooks } = useQuery({
    queryKey: ["integrations", "webhooks"],
    queryFn: () => IntegrationsService.getWebhooks(),
  });

  const { data: appsResponse } = useQuery({
    queryKey: ["integrations", "apps"],
    queryFn: () => IntegrationsService.getExternalApps(),
  });

  const createWebhookMutation = useMutation({
    mutationFn: IntegrationsService.createWebhook,
    onSuccess: () => {
      toast.success("Webhook muvaffaqiyatli yaratildi");
      queryClient.invalidateQueries({ queryKey: ["integrations", "webhooks"] });
      setShowWebhookModal(false);
      setNewWebhook({ name: "", url: "", events: ["Scan.Finished"] });
    },
    onError: () => toast.error("Webhook yaratishda xatolik yuz berdi"),
  });

  const webhooks: Webhook[] = webhooksResponse?.data || [];
  const externalApps: ExternalApp[] = appsResponse?.data || [];

  const getAppStatus = (providerId: string) => {
    const found = externalApps.find((app) => app.provider === providerId);
    if (!found) return { status: "disconnected", metadata: {} };
    return {
      status: found.status === "CONNECTED" ? "connected" : "disconnected",
      metadata: found.metadata,
    };
  };

  const mapIntegrationData = (list: any[]) => {
    return list.map((item) => {
      const dbApp = getAppStatus(item.id);
      return {
        ...item,
        status: dbApp.status,
        channel: dbApp.metadata?.channel,
        project: dbApp.metadata?.project,
        lastSync: dbApp.status === "connected" ? "Hozirgina" : undefined,
      };
    });
  };

  return (
    <div>
      <PageHeader
        title="Integratsiyalar"
        description="Sentinelning zaifliklar bazasini mavjud ekotizimingiz bilan sinxronlashtiring. Avtomatlashtirilgan xavfsizlik darvozalarini va real vaqtda javob berishni muvofiqlashtiring."
        actions={
          <button 
             onClick={() => setShowWebhookModal(true)}
             className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            Yangi Webhook
          </button>
        }
      />

      {/* Integration Categories */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* CI/CD */}
        <div className="col-span-12 md:col-span-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-on-surface mb-4">
            <Github className="w-5 h-5 text-primary" />
            CI/CD Quvurlar (Pipelines)
          </h3>
          <div className="space-y-4">
            {mapIntegrationData(SUPPORTED_INTEGRATIONS.cicd).map((int) => (
              <IntegrationCard key={int.name} {...int} />
            ))}
          </div>
        </div>

        {/* Alerting */}
        <div className="col-span-12 md:col-span-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-on-surface mb-4">
            <MessageSquare className="w-5 h-5 text-[hsl(35,90%,55%)]" />
            Ogohlantirishlar
          </h3>
          <div className="space-y-4">
            {mapIntegrationData(SUPPORTED_INTEGRATIONS.alerting).map((int) => (
              <IntegrationCard key={int.name} {...int} />
            ))}
          </div>
        </div>

        {/* Ticketing */}
        <div className="col-span-12 md:col-span-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-on-surface mb-4">
            <Ticket className="w-5 h-5 text-primary" />
            Chipta Tizimi
          </h3>
          <div className="space-y-4">
            {mapIntegrationData(SUPPORTED_INTEGRATIONS.ticketing).map((int) => (
              <IntegrationCard key={int.name} {...int} />
            ))}

            {/* Custom Integration */}
            <div className="bg-surface-low rounded-xl p-6 border border-dashed border-outline-variant/30 text-center">
              <Settings2 className="w-8 h-8 text-[hsl(215,15%,35%)] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-on-surface mb-1">Maxsus Integratsiya</h4>
              <p className="text-xs text-[hsl(215,15%,45%)]">Xususiy vositalar uchun SDK-dan foydalaning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Management */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-[hsl(222,20%,12%,0.2)]">
          <div>
            <h3 className="font-bold font-headline text-white">Webhook Boshqaruvi</h3>
            <p className="text-xs text-[hsl(215,15%,45%)]">Skanerlash natijalarini JSON formatida tashqi endpointlarga yuborish.</p>
          </div>
          <button onClick={() => setShowWebhookModal(true)} className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
            Manzil Qo'shish
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold">
                <th className="px-6 py-3">Manzil Nomi</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Hodisalar</th>
                <th className="px-6 py-3">Oxirgi Holat</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loadingWebhooks ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[hsl(215,15%,45%)] font-sans">
                    Webhooklar yuklanmoqda...
                  </td>
                </tr>
              ) : webhooks.length > 0 ? (
                webhooks.map((wh) => {
                  const status = wh.latest_delivery_status?.status_code
                    ? `${wh.latest_delivery_status.status_code} ${wh.latest_delivery_status.status_code >= 400 ? "Xato" : "Yaxshi"}`
                    : "Kutilmoqda";
                  const statusColor = wh.latest_delivery_status?.status_code && wh.latest_delivery_status.status_code < 400
                    ? "text-primary bg-primary" : (wh.latest_delivery_status?.status_code ? "text-sentinel-error bg-sentinel-error" : "text-[hsl(35,90%,65%)] bg-[hsl(35,90%,65%)]");
                  
                  return (
                    <tr key={wh.name} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-on-surface">{wh.name}</div>
                        <span className="text-[10px] text-[hsl(215,15%,40%)]">Yaratilgan {format(new Date(wh.created_at), "MMM d, yyyy")}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-mono text-xs max-w-[200px] truncate block">{wh.url}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {wh.events.map((e) => (
                            <span key={e} className="px-2 py-0.5 bg-surface-container rounded text-[10px] text-on-surface font-medium">
                              {e}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${statusColor.split(' ')[0]}`}>
                          <span className={`w-2 h-2 rounded-full ${statusColor.split(' ')[1]}`} />
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[hsl(215,15%,45%)] font-sans">
                    Hozircha hech qanday webhook sozlanmagan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 text-center border-t border-[hsl(222,20%,12%,0.1)]">
          <button className="text-xs text-[hsl(215,15%,50%)] hover:text-on-surface flex items-center gap-1 mx-auto">
            To'liq yetkazib berish jurnallarini ko'rish <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Basic Create Webhook Modal (MVP) */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface-low rounded-xl w-full max-w-md border border-ghost shadow-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Webhook Manzilini Qo'shish</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[hsl(215,15%,45%)]">Manzil Nomi</label>
                <input 
                  type="text" 
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                  className="w-full mt-1 bg-surface-container text-white px-4 py-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-primary"
                  placeholder="masalan: Production Ogohlantirishlari"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[hsl(215,15%,45%)]">Foydali Yuklama (Payload) URL</label>
                <input 
                  type="url" 
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                  className="w-full mt-1 bg-surface-container text-white px-4 py-2 rounded-lg text-sm border-none focus:ring-1 focus:ring-primary"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setShowWebhookModal(false)}
                  className="text-[hsl(215,15%,50%)] hover:text-white text-sm font-semibold px-4 py-2"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={() => createWebhookMutation.mutate(newWebhook)}
                  disabled={!newWebhook.name || !newWebhook.url || createWebhookMutation.isPending}
                  className="bg-primary text-on-primary-fixed disabled:opacity-50 text-sm font-bold px-6 py-2 rounded-lg hover:opacity-90"
                >
                  {createWebhookMutation.isPending ? "Saqlanmoqda..." : "Manzilni Saqlash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Integration Card Component ── */
interface IntegrationCardProps {
  name: string;
  desc: string;
  status: string;
  lastSync?: string;
  channel?: string;
  project?: string;
  apiHealth?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const IntegrationCard = ({ name, desc, status, lastSync, channel, project, apiHealth, icon: Icon }: IntegrationCardProps) => {
  const isConnected = status === "connected" || status === "active" || status === "ulangan" || status === "faol";

  return (
    <div className={`bg-surface-low rounded-xl p-5 border-ghost ${isConnected ? "border-l-2 border-l-primary" : ""}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">{name}</h4>
            <p className="text-xs text-[hsl(215,15%,45%)]">{desc}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase ${isConnected ? "text-primary" : "text-[hsl(215,15%,40%)]"}`}>
          {status}
        </span>
      </div>

      {lastSync && <p className="text-xs text-[hsl(215,15%,45%)]">Oxirgi sinxronizatsiya: {lastSync}</p>}
      {channel && <p className="text-xs text-[hsl(215,15%,45%)]">Kanallar: {channel}</p>}
      {project && (
        <div className="flex items-center gap-4 text-xs text-[hsl(215,15%,45%)] mt-1">
          <span>Loyiha: {project}</span>
          <span>API Holati: <span className="text-primary">{apiHealth}</span></span>
        </div>
      )}

      <div className="mt-3">
        {isConnected ? (
          <button className="text-primary text-xs font-bold hover:underline">
            Sozlash ›
          </button>
        ) : (
          <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors w-full">
            Xizmatni Ulash
          </button>
        )}
      </div>
    </div>
  );
};

export default IntegrationsPage;
