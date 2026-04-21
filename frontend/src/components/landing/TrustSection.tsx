import { useRef } from "react";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";
import { motion, useInView } from "framer-motion";

const TrustSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const badges = [
    { icon: Shield, label: "OWASP Standartlari" },
    { icon: Lock, label: "Ma'lumot himoyasi" },
    { icon: Eye, label: "Real-time monitoring" },
    { icon: AlertTriangle, label: "Instant alerts" },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
            Trust & Security
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Ishonchli va <span className="text-primary">xavfsiz</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/70 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground text-center">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TrustSection;
