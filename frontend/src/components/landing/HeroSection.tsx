import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6">
      {/* Background accents */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full bg-primary/[0.03] blur-[180px]"
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[860px] py-12">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/40 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/90">
              Securing Infrastructure For Global Leaders
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-headline leading-[1.08] tracking-tight mb-8"
          >
            The Digital{" "}
            <span className="text-primary text-glow">Obsidian.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            A surgical approach to web application security. Sentinel provides
            an impenetrable command & control layer for modern enterprise
            ecosystems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/app/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-base px-8 py-4 rounded-lg hover:brightness-110 transition-all shadow-glow-primary"
            >
              Launch Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/app/scans/new"
              className="inline-flex items-center justify-center gap-2 bg-card/30 border border-border/60 hover:bg-card/50 text-foreground font-medium text-base px-8 py-4 rounded-lg transition-all"
            >
              Scan Now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex items-center gap-5"
          >
            <div className="flex -space-x-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-surface-high"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by 500+ security-first organizations
            </p>
          </motion.div>
        </div>

        {/* Right Visual — Obsidian Shield */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-square w-full max-w-[520px] mx-auto">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner glass card */}
            <div className="absolute inset-8 rounded-full border border-border/30 bg-surface-low/60 backdrop-blur-xl flex items-center justify-center overflow-hidden">
              {/* Threat pulse */}
              <motion.div
                className="absolute w-3/4 h-3/4 rounded-full bg-primary/10"
                animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.12, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10 text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4 drop-shadow-[0_0_20px_rgba(123,208,255,0.3)]" />
                <div className="text-primary text-5xl font-extrabold tracking-tight font-headline">
                  99.9%
                </div>
                <div className="text-xs text-muted-foreground tracking-[0.3em] uppercase mt-2">
                  Threat Detection
                </div>
              </div>
            </div>

            {/* Floating nodes */}
            <motion.div
              className="absolute top-6 right-6 p-4 rounded-xl border border-border/30 bg-surface-container/80 backdrop-blur-md"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Eye className="w-5 h-5 text-primary mb-1" />
              <div className="text-[10px] text-muted-foreground font-semibold">Real-time</div>
              <div className="text-xs text-primary font-bold">Monitoring</div>
            </motion.div>

            <motion.div
              className="absolute bottom-12 -left-4 p-4 rounded-xl border border-border/30 bg-surface-container/80 backdrop-blur-md"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Lock className="w-5 h-5 text-sentinel-success mb-1" />
              <div className="text-[10px] text-muted-foreground font-semibold">Zero-Day</div>
              <div className="text-xs text-sentinel-success font-bold">Protected</div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-6 p-4 rounded-xl border border-sentinel-tertiary/20 bg-surface-container/80 backdrop-blur-md"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <Zap className="w-5 h-5 text-sentinel-tertiary mb-1" />
              <div className="text-[10px] text-muted-foreground font-semibold">AI-Powered</div>
              <div className="text-xs text-sentinel-tertiary font-bold">Analysis</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
