import { useState } from "react";
import { Shield, Radar, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    step: 1,
    title: "Connect Your Assets",
    description: "Add your web applications, APIs, and infrastructure endpoints to begin monitoring. Sentinel will automatically discover related subdomains and services.",
    icon: Shield,
    fields: [
      { label: "Primary Domain", placeholder: "https://example.com", type: "url" },
      { label: "Asset Type", placeholder: "Web Application", type: "select", options: ["Web Application", "API Endpoint", "Mobile Backend", "Microservice"] },
    ],
  },
  {
    step: 2,
    title: "Configure Scanning",
    description: "Set up your scanning preferences. Choose between passive monitoring, active scanning, or full penetration testing mode.",
    icon: Radar,
    fields: [
      { label: "Scan Mode", placeholder: "Active Scan", type: "select", options: ["Passive Monitor", "Active Scan", "Full Pentest", "Compliance Audit"] },
      { label: "Scan Frequency", placeholder: "Daily", type: "select", options: ["Continuous", "Daily", "Weekly", "Monthly"] },
    ],
  },
  {
    step: 3,
    title: "You're All Set",
    description: "Your first scan is queued and ready to deploy. Head to your dashboard to monitor results in real-time.",
    icon: CheckCircle,
    fields: [],
  },
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= currentStep
                  ? "bg-gradient-primary text-on-primary-fixed"
                  : "bg-surface-container text-[hsl(215,15%,40%)]"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-0.5 rounded-full transition-all ${
                  i < currentStep ? "bg-primary" : "bg-surface-container"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface-low rounded-2xl p-10 border-ghost relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-8">
              <step.icon className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-extrabold font-headline text-white mb-4">
              {step.title}
            </h1>
            <p className="text-muted-foreground text-base mb-8 max-w-lg leading-relaxed">
              {step.description}
            </p>

            {step.fields.length > 0 && (
              <div className="space-y-5 mb-10">
                {step.fields.map((field, i) => (
                  <div key={i}>
                    <label className="text-xs font-bold text-[hsl(215,15%,50%)] uppercase tracking-widest mb-2 block">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select className="w-full bg-surface-container border border-[hsl(222,15%,15%)] rounded-lg px-4 py-3 text-sm text-[hsl(215,20%,85%)] focus:ring-1 focus:ring-primary/40 focus:outline-none">
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full bg-surface-container border border-[hsl(222,15%,15%)] rounded-lg px-4 py-3 text-sm text-[hsl(215,20%,85%)] placeholder:text-[hsl(215,15%,30%)] focus:ring-1 focus:ring-primary/40 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="flex items-center gap-2 text-sm font-semibold text-[hsl(215,15%,50%)] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex items-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-sm px-8 py-3 rounded-lg hover:brightness-110 transition-all shadow-glow-primary"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/app/dashboard"
                  className="flex items-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-sm px-8 py-3 rounded-lg hover:brightness-110 transition-all shadow-glow-primary"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
