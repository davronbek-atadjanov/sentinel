import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const badges = [
  { title: "SOC 2", subtitle: "TYPE II" },
  { title: "GDPR", subtitle: "MUVOFIQ" },
  { title: "PCI DSS", subtitle: "v4.0" },
  { title: "HIPAA", subtitle: "TAYYOR" },
] as const;

const ComplianceSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 px-6 bg-card/10 border-y border-border/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-foreground mb-3">
            Korporativ darajadagi ishonch
          </h2>
          <p className="text-muted-foreground">
            Sentinel maxfiylikni buzmasdan, qat'iy xavfsizlik va muvofiqlik talablariga javob beradi.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 opacity-80">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full border border-border/50 bg-background/20 flex items-center justify-center mb-2">
                <span className="font-extrabold text-lg text-foreground">{b.title}</span>
              </div>
              <span className="text-xs tracking-widest text-muted-foreground">{b.subtitle}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
