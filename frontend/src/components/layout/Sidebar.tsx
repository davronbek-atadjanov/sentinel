import {
    BarChart3,
    Bell,
    Brain,
    FolderOpen,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Plus,
    Radar,
    ScrollText,
    Settings,
    ShieldAlert,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const mainNav = [
  { label: "Boshqaruv paneli", icon: LayoutDashboard, path: "/app/dashboard" },
  { label: "Skanerlash", icon: Radar, path: "/app/scans" },
  { label: "Zaifliklar", icon: ShieldAlert, path: "/app/vulnerabilities" },
  { label: "Aktivlar", icon: FolderOpen, path: "/app/assets" },
  { label: "Hisobotlar", icon: BarChart3, path: "/app/reports" },
];

const secondaryNav = [
  { label: "AI Markaz", icon: Brain, path: "/app/ai" },
  { label: "Bildirishnomalar", icon: Bell, path: "/app/notifications" },
  { label: "Faoliyatlar tarixi", icon: ScrollText, path: "/app/activity-logs" },
  { label: "Sozlamalar", icon: Settings, path: "/app/settings/integrations" },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/app/dashboard") {
      return location.pathname === "/app/dashboard" || location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ item }: { item: typeof mainNav[0] }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
          active
            ? "bg-primary/10 text-primary"
            : "text-[hsl(215,15%,50%)] hover:bg-[hsl(222,30%,8%)] hover:text-[hsl(215,20%,75%)]"
        } ${collapsed ? "justify-center px-3" : ""}`}
      >
        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-primary" : ""}`} />
        {!collapsed && <span>{item.label}</span>}
        {active && !collapsed && (
          <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`h-screen fixed left-0 top-0 bg-[hsl(222,60%,4%)] flex flex-col border-r border-[hsl(222,20%,10%)] z-50 transition-all duration-300 ${
        collapsed ? "w-20" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className={`px-6 pt-7 pb-5 ${collapsed ? "px-4" : ""}`}>
        <h1 className="text-lg font-bold tracking-tighter text-white font-headline">
          {collapsed ? "S" : "SENTINEL"}
        </h1>
        {!collapsed && (
          <p className="text-[10px] text-primary/60 font-mono tracking-tight mt-0.5">
            V.2.4 Obsidian
          </p>
        )}
      </div>

      {/* New Scan Button */}
      <div className={`px-4 mb-5 ${collapsed ? "px-3" : ""}`}>
        <Link
          to="/app/scans/new"
          className={`flex items-center justify-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-sm rounded-lg transition-all hover:brightness-110 shadow-glow-primary ${
            collapsed ? "p-3" : "px-4 py-2.5 w-full"
          }`}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>Yangi Skanerlash</span>}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {mainNav.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        {/* Divider */}
        <div className="my-4 mx-3 h-px bg-[hsl(222,15%,10%)]" />

        {secondaryNav.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-2 border-t border-[hsl(222,15%,8%)]">
        {!collapsed && (
          <>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-2 text-[hsl(215,15%,42%)] hover:text-[hsl(215,20%,70%)] transition-colors text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Yordam</span>
            </Link>
            <button className="flex items-center gap-3 px-4 py-2 text-[hsl(215,15%,42%)] hover:text-[hsl(215,20%,70%)] transition-colors text-sm w-full text-left">
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </>
        )}

        {/* User */}
        <div
          className={`bg-[hsl(222,35%,7%)] rounded-xl p-3 flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-on-primary-fixed font-bold text-xs flex-shrink-0">
            TA
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">TIZIM_ADMIN_01</p>
              <p className="text-[10px] text-primary/50 font-mono">4-darajali ruxsat</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
