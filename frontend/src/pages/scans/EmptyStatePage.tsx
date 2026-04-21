import { Link } from "react-router-dom";
import { Radar, Plus, BookOpen } from "lucide-react";

const EmptyStatePage = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-8">
          <div className="w-32 h-32 bg-surface-low rounded-full flex items-center justify-center mx-auto border-ghost">
            <Radar className="w-16 h-16 text-[hsl(215,15%,25%)]" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "3s" }} />
        </div>

        <h2 className="text-2xl font-bold font-headline text-white mb-3">
          No Active Scans Found
        </h2>
        <p className="text-body-md text-[hsl(215,15%,50%)] mb-8 leading-relaxed">
          Your scan queue is empty. Initialize a new security assessment to begin monitoring
          your infrastructure for vulnerabilities.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/app/scans/new"
            className="flex items-center justify-center gap-2 bg-gradient-primary px-8 py-3 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Initialize First Scan
          </Link>
          <button className="flex items-center justify-center gap-2 bg-surface-container px-8 py-3 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors">
            <BookOpen className="w-4 h-4" />
            View Documentation
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-surface-low rounded-xl p-6 border-ghost text-left">
          <h3 className="text-sm font-bold text-white mb-4">Quick Start Guide</h3>
          <div className="space-y-3">
            {[
              { step: "01", text: "Enter a target URL or hostname" },
              { step: "02", text: "Select a scan profile (Quick, Full, or Custom)" },
              { step: "03", text: "Configure authentication if needed" },
              { step: "04", text: "Execute and monitor results in real-time" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-1 rounded">
                  {item.step}
                </span>
                <span className="text-sm text-[hsl(215,15%,55%)]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStatePage;
