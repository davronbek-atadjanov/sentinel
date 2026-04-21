import PageHeader from "@/components/shared/PageHeader";
import { Wrench, GitPullRequest, CheckCircle, Clock, Code } from "lucide-react";

const remediations = [
  {
    id: 1,
    vuln: "SQL Injection — /api/v2/user/auth",
    severity: "Critical",
    fix: "Parameterized query using prepared statements",
    status: "Fix Ready",
    statusColor: "text-primary bg-primary/10",
    language: "Python",
    code: `# Before (vulnerable)\ncursor.execute(f"SELECT * FROM users WHERE token='{token}'")\n\n# After (fixed)\ncursor.execute("SELECT * FROM users WHERE token=%s", (token,))`,
    confidence: 96,
  },
  {
    id: 2,
    vuln: "XSS Reflected — /search",
    severity: "High",
    fix: "HTML entity encoding on output",
    status: "PR Created",
    statusColor: "text-[hsl(35,90%,55%)] bg-[hsl(35,90%,55%,0.1)]",
    language: "TypeScript",
    code: `// Before\nreturn <div>{userInput}</div>\n\n// After\nimport DOMPurify from 'dompurify';\nreturn <div>{DOMPurify.sanitize(userInput)}</div>`,
    confidence: 92,
  },
  {
    id: 3,
    vuln: "Missing CSP Header",
    severity: "Medium",
    fix: "Add Content-Security-Policy header",
    status: "Merged",
    statusColor: "text-primary bg-primary/10",
    language: "nginx",
    code: `# Add to nginx config\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;`,
    confidence: 99,
  },
];

const RemediationCopilotPage = () => {
  return (
    <div>
      <PageHeader
        title="AI Remediation Copilot"
        description="AI-generated fix recommendations with ready-to-deploy code patches. One-click PR generation for your CI/CD pipeline."
        badge={<span className="flex items-center gap-1.5 ml-3 mt-2"><Wrench className="w-4 h-4 text-primary" /><span className="text-[10px] text-primary font-bold uppercase">Copilot Active</span></span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Fixes Generated", value: "78", icon: CheckCircle },
          { label: "PRs Created", value: "23", icon: GitPullRequest },
          { label: "Avg Fix Time", value: "4.2s", icon: Clock },
        ].map((s) => (
          <div key={s.label} className="bg-surface-low rounded-xl p-5 border-ghost flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-headline text-white">{s.value}</p>
              <p className="text-[10px] text-[hsl(215,15%,45%)] uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {remediations.map((r) => (
          <div key={r.id} className="bg-surface-low rounded-xl border-ghost overflow-hidden">
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[hsl(222,20%,12%,0.15)]">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-bold text-white">{r.vuln}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.statusColor}`}>{r.status}</span>
                </div>
                <p className="text-xs text-[hsl(215,15%,50%)]">
                  Fix: {r.fix} • Confidence: <span className="text-primary font-bold">{r.confidence}%</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container rounded-lg text-xs font-bold text-on-surface hover:bg-surface-high transition-colors flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  View Diff
                </button>
                <button className="px-4 py-2 bg-gradient-primary rounded-lg text-xs font-bold text-on-primary-fixed hover:opacity-90 transition-all flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  Create PR
                </button>
              </div>
            </div>
            <div className="bg-[hsl(222,60%,3%)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-primary font-mono font-bold uppercase">{r.language}</span>
              </div>
              <pre className="text-xs text-on-surface font-mono leading-relaxed whitespace-pre-wrap">
                {r.code}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemediationCopilotPage;
