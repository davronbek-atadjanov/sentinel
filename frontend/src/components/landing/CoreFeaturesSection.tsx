import { motion, useInView } from "framer-motion";
import { Radar, Bell, FileCheck, FlaskConical } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Radar,
    title: "Automated Scanning",
    desc: "Deploy persistent, non-intrusive scans that evolve with your codebase. Our AI-driven engine maps attack surfaces in real-time, identifying vulnerabilities before they reach production.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    desc: "Instant notifications on critical vulnerabilities with contextual threat intelligence and severity scoring for rapid triage.",
  },
  {
    icon: FileCheck,
    title: "Compliance Reporting",
    desc: "SOC2, HIPAA, and GDPR readiness with one-click audit-ready exports. Stay compliant without the overhead.",
  },
  {
    icon: FlaskConical,
    title: "Payload Lab",
    desc: "A sandboxed environment to safely test exploit vectors against your own infrastructure. Advanced mutation tools for red-team precision.",
  },
] as const;

const CoreFeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-foreground mb-4">
            Surgical Precision.{" "}
            <span className="text-primary">Scalable Power.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Four pillars of intelligent security — from automated scanning to
            advanced payload testing.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="p-8 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/45 hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
