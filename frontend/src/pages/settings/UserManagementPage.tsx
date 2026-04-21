import PageHeader from "@/components/shared/PageHeader";
import {
  Users,
  Mail,
  Shield,
  AlertTriangle,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Active Seats", value: "24", sub: "/ 30 available", icon: Users, bar: "w-[80%] bg-primary" },
  { label: "Pending Invitations", value: "3", sub: "Action Required", subColor: "text-sentinel-tertiary", icon: Mail },
  { label: "System Uptime", value: "99.9%", sub: "Last 30 days", icon: Shield },
  { label: "Risk Exposure", value: "Low", sub: "Standard Profile", icon: AlertTriangle },
];

const users = [
  { name: "Marcus Vance", email: "m.vance@sentinel.ai", role: "Admin", roleColor: "text-primary", status: "active", access: "2 mins ago", ip: "192.168.1.104" },
  { name: "Sarah Chen", email: "s.chen@sentinel.ai", role: "Auditor", roleColor: "text-on-surface-variant", status: "active", access: "4 hours ago", ip: "10.0.4.82" },
  { name: "Alex Thorne", email: "a.thorne@dev.sentinel.ai", role: "Developer", roleColor: "text-sentinel-tertiary", status: "pending", access: "Never logged in", ip: "Invite expires in 12h" },
  { name: "Elena Rodriguez", email: "e.rodriguez@sentinel.ai", role: "Member", roleColor: "text-on-surface-variant", status: "active", access: "1 day ago", ip: "172.16.254.1" },
];

const UserManagementPage = () => {
  return (
    <div>
      <PageHeader
        title="Team Governance"
        description="Configure Role-Based Access Control (RBAC) and manage obsidian system environment access for your security team."
        actions={
          <>
            <button className="flex items-center gap-2 bg-surface-container px-5 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
              <Download className="w-4 h-4" />
              Download Audit Log
            </button>
            <button className="flex items-center gap-2 bg-gradient-primary px-5 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-6 border-ghost">
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] text-primary uppercase tracking-widest font-semibold">{s.label}</p>
              <s.icon className="w-5 h-5 text-[hsl(215,15%,35%)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-headline text-white">{s.value}</span>
              <span className={`text-xs font-medium ${s.subColor || "text-[hsl(215,15%,45%)]"}`}>{s.sub}</span>
            </div>
            {s.bar && (
              <div className="h-1 bg-surface-high rounded-full mt-3 overflow-hidden">
                <div className={`h-full rounded-full ${s.bar}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Team Directory */}
      <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-[hsl(222,20%,12%,0.2)]">
          <div className="flex items-center gap-3">
            <h3 className="font-bold font-headline text-white">Team Directory</h3>
            <span className="px-2 py-0.5 bg-primary-container text-primary text-[10px] font-bold uppercase rounded">
              RBAC Enabled
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-bold border-b border-[hsl(222,20%,12%,0.2)]">
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Access Pattern</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-on-primary-fixed font-bold text-sm">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <span className="font-semibold text-on-surface block">{u.name}</span>
                        <span className="text-xs text-[hsl(215,15%,45%)]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-2 ${u.roleColor}`}>
                      <span className={`w-2 h-2 rounded-full ${u.roleColor === "text-primary" ? "bg-primary" : u.roleColor === "text-sentinel-tertiary" ? "bg-sentinel-tertiary" : "bg-on-surface-variant"}`} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      u.status === "active"
                        ? "bg-primary-container text-primary"
                        : "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-on-surface text-sm">{u.access}</div>
                    <div className={`text-xs mt-0.5 ${u.status === "pending" ? "text-sentinel-tertiary" : "text-[hsl(215,15%,40%)]"}`}>
                      {u.status === "pending" ? u.ip : `From ${u.ip}`}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button className="text-[hsl(215,15%,50%)] hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex justify-between items-center border-t border-[hsl(222,20%,12%,0.15)]">
          <span className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold">
            Showing 1 to 4 of 24 Users
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary-fixed text-xs font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded text-[hsl(215,15%,55%)] hover:bg-surface-high text-xs font-bold flex items-center justify-center">3</button>
            <button className="w-8 h-8 rounded flex items-center justify-center text-[hsl(215,15%,45%)] hover:bg-surface-high">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
