import { motion, useInView } from "framer-motion"
import { ArrowDown, FileText, Globe, Search, ShieldCheck, type LucideIcon } from "lucide-react"
import { useRef } from "react"

const steps: { step: string; title: string; desc: string; icon: LucideIcon }[] = [
  { step: "01", title: "URL kiriting", desc: "Skanerlash uchun veb-ilova manzilini va parametrlarini belgilang", icon: Globe },
  { step: "02", title: "Web crawling", desc: "Tizim avtomatik ravishda barcha sahifalar, formalar va API endpointlarini topadi", icon: Search },
  { step: "03", title: "Skanerlash", desc: "SQL Injection (SQLi), XSS, CSRF va OWASP Top 10 dagi boshqa zaifliklar tekshiriladi", icon: ShieldCheck },
  { step: "04", title: "Hisobot", desc: "Natijalar batafsil hisobot va tavsiyalar ko'rinishida taqdim etiladi", icon: FileText },
];

const StepCard = ({ item, index }: { item: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="group flex items-start gap-6 p-7 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-500 relative overflow-hidden">
        {/* Background number */}
        <span className="absolute -right-4 -top-6 text-[120px] font-black font-mono text-primary/[0.03] leading-none select-none">
          {item.step}
        </span>
        
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <item.icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-primary/50 tracking-wider">STEP {item.step}</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1.5">{item.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
            Jarayon
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-foreground">
            Qanday <span className="text-primary text-glow">ishlaydi?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            4 ta bosqichda veb-ilovangiz xavfsizligini to'liq baholang
          </p>
        </motion.div>

        <div className="space-y-5">
          {steps.map((item, i) => (
            <div key={i}>
              <StepCard item={item} index={i} />
              {i < steps.length - 1 && (
                <div className="flex justify-center py-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <ArrowDown className="w-5 h-5 text-primary/20" />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
