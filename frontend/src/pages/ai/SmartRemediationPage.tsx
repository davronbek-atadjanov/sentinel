import PageHeader from "@/components/shared/PageHeader";
import { GitPullRequest, CheckCircle, Clock, XCircle, Eye } from "lucide-react";

const pullRequests = [
  { id: "PR-1247", title: "Fix SQL injection in auth endpoint", branch: "fix/sqli-auth-endpoint", vuln: "CVE-2024-38291", status: "merged", checks: "All passed", reviewers: "2/2 approved", mergedAt: "2 hours ago" },
  { id: "PR-1245", title: "Add CSP and security headers", branch: "security/add-csp-headers", vuln: "HEADER-001, HEADER-003", status: "open", checks: "Running...", reviewers: "1/2 approved", mergedAt: null },
  { id: "PR-1243", title: "Sanitize XSS in search component", branch: "fix/xss-search-sanitize", vuln: "CVE-2023-4412", status: "merged", checks: "All passed", reviewers: "2/2 approved", mergedAt: "1 day ago" },
  { id: "PR-1240", title: "Upgrade SSL cipher suites", branch: "infra/ssl-cipher-upgrade", vuln: "POLICY-992", status: "closed", checks: "1 failed", reviewers: "0/2 approved", mergedAt: null },
];

const statusStyles: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  merged: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  open: { icon: GitPullRequest, color: "text-[hsl(35,90%,55%)]", bg: "bg-[hsl(35,90%,55%,0.1)]" },
  closed: { icon: XCircle, color: "text-sentinel-error", bg: "bg-sentinel-error/10" },
};

const SmartRemediationPage = () => {
  return (
    <div>
      <PageHeader
        title="Smart Remediation PRs"
        description="AI-generated pull requests with security fixes. Directly integrated with your CI/CD pipeline for seamless deployment."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><GitPullRequest className="w-4 h-4 text-primary" /><span className="text-[10px] text-primary font-bold uppercase">14 PRs This Week</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "PRs Merged", value: "47", icon: CheckCircle, color: "text-primary" },
          { label: "Open PRs", value: "3", icon: GitPullRequest, color: "text-[hsl(35,90%,55%)]" },
          { label: "Avg Merge Time", value: "2.1h", icon: Clock },
          { label: "Success Rate", value: "94%", icon: CheckCircle },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost">
            <s.icon className={`w-5 h-5 ${s.color || "text-primary"} mb-3`} />
            <p className="text-3xl font-bold font-headline text-white">{s.value}</p>
            <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {pullRequests.map((pr) => {
          const style = statusStyles[pr.status];
          const StatusIcon = style.icon;
          return (
            <div key={pr.id} className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`w-5 h-5 ${style.color}`} />
                    <h3 className="text-sm font-bold text-white">{pr.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style.bg} ${style.color}`}>{pr.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(215,15%,45%)]">
                    <span className="font-mono text-primary">{pr.id}</span>
                    <span>•</span>
                    <span className="font-mono">{pr.branch}</span>
                    <span>•</span>
                    <span>Fixes: <span className="text-on-surface">{pr.vuln}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="text-[hsl(215,15%,45%)]">Checks</p>
                    <p className={`font-bold ${pr.checks.includes("passed") ? "text-primary" : pr.checks.includes("failed") ? "text-sentinel-error" : "text-[hsl(35,90%,55%)]"}`}>{pr.checks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[hsl(215,15%,45%)]">Reviews</p>
                    <p className="text-on-surface font-bold">{pr.reviewers}</p>
                  </div>
                  {pr.mergedAt && (
                    <div className="text-center">
                      <p className="text-[hsl(215,15%,45%)]">Merged</p>
                      <p className="text-on-surface font-bold">{pr.mergedAt}</p>
                    </div>
                  )}
                  <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartRemediationPage;
