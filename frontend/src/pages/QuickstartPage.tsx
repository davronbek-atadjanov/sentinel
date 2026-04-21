import { Shield, Radar, FileCheck, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Add Your First Target",
    description: "Navigate to the Scans page and click 'New Scan'. Enter your target URL and select the scan type. Sentinel supports web applications, APIs, and network endpoints.",
    link: "/app/scans/new",
    linkText: "Start New Scan",
    icon: Shield,
  },
  {
    number: "02",
    title: "Monitor Scan Progress",
    description: "Track your scan in real-time from the Active Scans dashboard. View discovered endpoints, tested payloads, and emerging vulnerabilities as they're detected.",
    link: "/app/scans",
    linkText: "View Active Scans",
    icon: Radar,
  },
  {
    number: "03",
    title: "Review & Remediate",
    description: "Once complete, review findings in the Vulnerabilities section. Use AI Copilot for one-click remediation suggestions and generate compliance reports.",
    link: "/app/vulnerabilities",
    linkText: "View Vulnerabilities",
    icon: FileCheck,
  },
];

const resources = [
  { title: "API Documentation", desc: "Full REST API reference", href: "#" },
  { title: "Integration Guides", desc: "CI/CD, Slack, Jira setup", href: "/app/settings/integrations" },
  { title: "Compliance Templates", desc: "SOC2, HIPAA, GDPR presets", href: "/app/reports" },
  { title: "Video Tutorials", desc: "Step-by-step walkthroughs", href: "#" },
];

const QuickstartPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">
            Getting Started
          </span>
          <h1 className="text-4xl font-extrabold font-headline text-white mb-4">
            Step-by-Step Quickstart Guide
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get your first security scan running in under 5 minutes. Follow these three steps to start protecting your applications.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="bg-surface-low rounded-2xl p-8 border-ghost flex gap-8 items-start group hover:border-primary/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-primary font-headline">{step.number}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white font-headline">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                <Link
                  to={step.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {step.linkText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold font-headline text-white mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res, i) => (
              <Link
                key={i}
                to={res.href}
                className="bg-surface-container rounded-xl p-5 border-ghost flex items-center justify-between hover:bg-surface-high transition-colors group"
              >
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{res.title}</h4>
                  <p className="text-xs text-muted-foreground">{res.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[hsl(215,15%,35%)] group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickstartPage;
