import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const cards = {
  dashboard: {
    label: "Central Ops",
    title: "Real-time Asset Monitoring",
  },
  reasoning: {
    label: "Neural Core",
    title: "AI Reasoning Chain",
    desc: "Trace exactly how our AI identifies and classifies complex logic vulnerabilities.",
  },
  map: {
    label: "Surface Analyzer",
    title: "Attack Surface Map",
  },
} as const;

const ProductShowcaseSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline tracking-tight mb-3 text-foreground">
            Command &amp; Control Dashboard
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Every vector, every asset, every vulnerability—visualized for surgical response.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[800px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative lg:col-span-8 rounded-2xl border border-border/40 bg-card/40 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background/0 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
            <div className="relative p-10 lg:p-12 h-full flex flex-col justify-end">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/90 mb-2">
                {cards.dashboard.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {cards.dashboard.title}
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="relative lg:col-span-4 lg:row-span-2 rounded-2xl border border-border/40 bg-card/40 overflow-hidden group min-h-[380px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background/0 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
            <div className="relative p-8 lg:p-10 h-full flex flex-col justify-end">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent/90 mb-2">
                {cards.reasoning.label}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">
                {cards.reasoning.title}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {cards.reasoning.desc}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="relative lg:col-span-8 rounded-2xl border border-border/40 bg-card/40 overflow-hidden group min-h-[320px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
            <div className="relative p-10 lg:p-12 h-full flex flex-col justify-end">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {cards.map.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {cards.map.title}
              </h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
