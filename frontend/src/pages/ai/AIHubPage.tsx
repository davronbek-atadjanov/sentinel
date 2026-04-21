import { Link } from "react-router-dom";
import {
  Brain,
  Crosshair,
  FileSearch,
  Wrench,
  TrendingUp,
  Target,
  GitPullRequest,
} from "lucide-react";

const aiFeatures = [
  {
    id: "payload-lab",
    title: "AI Payload Lab",
    desc: "Automated payload generation and mutation testing powered by AI models. Test edge-case attack vectors against your infrastructure.",
    icon: Brain,
    path: "/app/ai/payload-lab",
    status: "Active",
    statusColor: "text-primary bg-primary/10",
    metrics: "1,284 payloads generated",
  },
  {
    id: "threat-hunting",
    title: "Proactive Threat Hunting",
    desc: "AI-driven threat detection that proactively identifies zero-day vulnerabilities and emerging attack patterns before they're exploited.",
    icon: Crosshair,
    path: "/app/ai/threat-hunting",
    status: "Scanning",
    statusColor: "text-sentinel-tertiary bg-sentinel-tertiary/10",
    metrics: "42 threats identified",
  },
  {
    id: "evidence-analysis",
    title: "Evidence Analysis",
    desc: "Deep reasoning engine that analyzes vulnerability evidence, correlates attack vectors, and provides contextual risk assessments.",
    icon: FileSearch,
    path: "/app/ai/evidence",
    status: "Active",
    statusColor: "text-primary bg-primary/10",
    metrics: "98% accuracy rate",
  },
  {
    id: "remediation-copilot",
    title: "Remediation Copilot",
    desc: "AI assistant that generates fix recommendations, code patches, and remediation workflows for detected vulnerabilities.",
    icon: Wrench,
    path: "/app/ai/remediation",
    status: "Active",
    statusColor: "text-primary bg-primary/10",
    metrics: "78 auto-fixes applied",
  },
  {
    id: "predictive-modeling",
    title: "Predictive Threat Modeling",
    desc: "Machine learning models that forecast vulnerability trends, predict attack surfaces, and prioritize security investments.",
    icon: TrendingUp,
    path: "/app/ai/predictive",
    status: "Training",
    statusColor: "text-[hsl(35,90%,55%)] bg-[hsl(35,90%,55%,0.1)]",
    metrics: "Model v3.2 in training",
  },
  {
    id: "red-team",
    title: "Red Team Automation",
    desc: "Automated adversary simulation that mimics sophisticated attack scenarios to stress-test your security posture.",
    icon: Target,
    path: "/app/ai/red-team",
    status: "Standby",
    statusColor: "text-[hsl(215,15%,50%)] bg-surface-high",
    metrics: "Last run: 2 days ago",
  },
  {
    id: "smart-remediation",
    title: "Smart Remediation PR",
    desc: "Automatically generates pull requests with security fixes, integrating directly with your CI/CD pipeline for seamless deployment.",
    icon: GitPullRequest,
    path: "/app/ai/smart-fix",
    status: "Active",
    statusColor: "text-primary bg-primary/10",
    metrics: "14 PRs merged this week",
  },
];

const AIHubPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-on-primary-fixed" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-white">
              AI Command Center
            </h2>
          </div>
        </div>
        <p className="text-on-surface-variant text-body-md mt-2 max-w-2xl">
          Advanced AI-powered security modules. Each module operates autonomously while sharing
          intelligence across the Sentinel ecosystem.
        </p>
      </div>

      {/* AI System Status */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white">AI Engine: Online</span>
          </div>
          <div className="text-xs text-[hsl(215,15%,45%)]">
            Model: <span className="text-primary font-mono">Sentinel-LLM v4.2</span>
          </div>
          <div className="text-xs text-[hsl(215,15%,45%)]">
            GPU Cluster: <span className="text-on-surface">8x A100 • 94% utilization</span>
          </div>
        </div>
        <div className="text-xs text-[hsl(215,15%,45%)]">
          Uptime: <span className="text-primary font-bold">99.97%</span>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature) => (
          <Link
            key={feature.id}
            to={feature.path}
            className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container transition-all group cursor-pointer relative overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4 relative">
              <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${feature.statusColor}`}>
                {feature.status}
              </span>
            </div>

            <h3 className="text-lg font-bold font-headline text-white mb-2 group-hover:text-primary transition-colors relative">
              {feature.title}
            </h3>
            <p className="text-xs text-[hsl(215,15%,50%)] leading-relaxed mb-4 relative">
              {feature.desc}
            </p>

            <div className="flex items-center justify-between relative">
              <span className="text-[10px] text-primary font-semibold">{feature.metrics}</span>
              <span className="text-xs text-[hsl(215,15%,40%)] group-hover:text-primary transition-colors font-bold">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIHubPage;
