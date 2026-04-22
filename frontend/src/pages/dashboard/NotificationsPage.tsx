import PageHeader from "@/components/shared/PageHeader"
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Download,
    Info,
    Settings,
    ShieldAlert
} from "lucide-react"

import { Notification, NotificationsService } from "@/services/notifications.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const filterItemsMap: Record<string, { label: string; icon: any; color?: string }> = {
  ALL: { label: "Barcha xabarlar", icon: Bell },
  CRITICAL: { label: "Kritik", icon: ShieldAlert, color: "text-sentinel-error" },
  WARNING: { label: "Ogohlantirish", icon: AlertTriangle, color: "text-[hsl(35,90%,55%)]" },
  INFO: { label: "Ma'lumot", icon: Info, color: "text-primary" },
  SYSTEM: { label: "Tizim", icon: Download, color: "text-on-surface-variant" },
  SUCCESS: { label: "Muvaffaqiyatli", icon: CheckCircle, color: "text-primary" },
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => NotificationsService.getNotifications(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["notifications", "stats"],
    queryFn: () => NotificationsService.getStats(),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => NotificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notificationsList = notifData?.results || [];
  const stats = statsData?.data || { total: 0, unread: 0, by_level: {} };

  const activeFilterItems = [
    { label: "Barcha xabarlar", count: stats.total || 0, icon: Bell, active: true },
    { label: "Kritik", count: stats.by_level?.CRITICAL || 0, icon: ShieldAlert, color: "text-sentinel-error" },
    { label: "Ogohlantirish", count: stats.by_level?.WARNING || 0, icon: AlertTriangle, color: "text-[hsl(35,90%,55%)]" },
    { label: "Ma'lumot", count: stats.by_level?.INFO || 0, icon: Info, color: "text-primary" },
    { label: "Tizim", count: stats.by_level?.SYSTEM || 0, icon: Download, color: "text-on-surface-variant" },
  ];

  return (
    <div>
      <PageHeader
        title="Bildirishnomalar markazi"
        badge={
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold ml-2 mt-2">
            Buyruqlar markazi / signallar
          </span>
        }
        actions={
          <>
            <button 
              onClick={() => markAllReadMutation.mutate()}
              className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Barchasini o'qilgan deb belgilash
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-lg text-on-surface-variant hover:bg-surface-high transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Sidebar: Filters ── */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Filter List */}
          <div className="space-y-1">
            {activeFilterItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm ${
                  item.active
                    ? "bg-surface-low border-ghost text-on-surface"
                    : "text-[hsl(215,15%,50%)] hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${item.color || ""}`} />
                  {item.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.active ? "bg-primary text-on-primary-fixed" : "bg-surface-high text-[hsl(215,15%,50%)]"
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Active Scan Engine */}
          <div className="bg-surface-low rounded-xl p-5 border-ghost mt-6">
            <h4 className="text-sm font-bold text-on-surface mb-3">Faol skanerlash dvigateli</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase font-bold font-mono">
                CORE-DB-ALPHA
              </span>
              <span className="text-xs text-primary font-bold">82%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden mb-3">
              <div className="h-full w-[82%] bg-primary rounded-full" />
            </div>
            <p className="text-xs text-[hsl(215,15%,45%)]">
              Tizim hozirda 12,403 ta endpointni aylanib chiqmoqda. Taxminiy tugash: <span className="text-on-surface font-bold">12 kun</span>
            </p>
          </div>
        </div>

        {/* ── Right: Notifications Feed ── */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Bildirishnomalar yuklanmoqda...</div>
          ) : notificationsList.length > 0 ? (
            notificationsList.map((notif: Notification) => {
              const meta = filterItemsMap[notif.level] || filterItemsMap["INFO"];
              const TargetIcon = meta.icon;
              
              let typeColor = "bg-surface-high text-on-surface-variant";
              let iconBg = "bg-surface-high";
              if (notif.level === "CRITICAL") {
                typeColor = "bg-error-container text-on-error-container";
                iconBg = "bg-error-container/30";
              } else if (notif.level === "WARNING") {
                typeColor = "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]";
                iconBg = "bg-sentinel-tertiary/10";
              } else if (notif.level === "INFO" || notif.level === "SUCCESS") {
                typeColor = "bg-primary-container text-primary";
                iconBg = "bg-primary/10";
              }

              return (
                <div
                  key={notif.id}
                  className={`bg-surface-low rounded-xl p-5 border-ghost flex gap-4 transition-colors hover:bg-surface-container/50 cursor-pointer ${
                    !notif.is_read ? "border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <TargetIcon className={`w-6 h-6 ${meta.color || ""}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColor}`}>
                        {notif.level}
                      </span>
                      <span className="text-[10px] text-[hsl(215,15%,45%)]">
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-on-surface mb-1">{notif.title}</h4>
                    <p className="text-xs text-[hsl(215,15%,50%)] leading-relaxed">{notif.description}</p>
                  </div>

                  {!notif.is_read && (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-surface-low rounded-xl p-12 border-ghost flex flex-col items-center justify-center text-center">
              <Bell className="w-12 h-12 text-[hsl(215,15%,30%)] mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Hozircha xabarlar yo'q</h4>
              <p className="text-sm text-[hsl(215,15%,50%)]">Skanerlash tugaganda yoki zaifliklar topilganda, ularni shu yerda ko'rasiz.</p>
            </div>
          )}

          {/* Date Separator */}
          <div className="text-center py-4">
            <span className="text-[10px] text-[hsl(215,15%,35%)] uppercase tracking-widest font-bold">
              24-Oktabr, 2023
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
