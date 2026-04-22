import { motion, useInView } from "framer-motion"
import { Bug, Database, FileText, Globe, Search, ShieldAlert, type LucideIcon } from "lucide-react"
import { useRef } from "react"

const features: { icon: LucideIcon; title: string; description: string; accent: string }[] = [
  {
    icon: ShieldAlert,
    title: "OWASP Top 10",
    description: "OWASP Top 10 doirasidagi eng ko'p uchraydigan 10 ta veb-zaiflikni avtomatik aniqlash va tahlil qilish.",
    accent: "from-primary/20 to-accent/10",
  },
  {
    icon: Database,
    title: "SQL Injection",
    description: "SQL Injection orqali ma'lumotlar bazasiga ruxsatsiz kirish zaifliklarini aniqlash va xabar berish.",
    accent: "from-destructive/15 to-primary/10",
  },
  {
    icon: Bug,
    title: "XSS Detection",
    description: "Cross-Site Scripting (XSS) zaifliklarini aniqlash va mitigatsiya bo'yicha tavsiyalar.",
    accent: "from-accent/20 to-primary/10",
  },
  {
    icon: Globe,
    title: "Web Crawling",
    description: "Sayt sahifalarini avtomatik aniqlash va endpointlarni qamrab skanerlash.",
    accent: "from-primary/15 to-accent/15",
  },
  {
    icon: Search,
    title: "HTTP Tahlili",
    description: "HTTP so'rov va javoblarni chuqur tahlil qilish orqali zaifliklarni aniqlash.",
    accent: "from-accent/15 to-primary/20",
  },
  {
    icon: FileText,
    title: "Hisobotlar",
    description: "Batafsil xavfsizlik hisobotlarini PDF va JSON formatlarida shakllantirish.",
    accent: "from-primary/20 to-accent/15",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Hover glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-primary/20 to-transparent blur-sm" />
      
      <div className="relative p-7 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 h-full">
        {/* Icon with gradient bg */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <feature.icon className="w-7 h-7 text-primary" />
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-2.5 font-mono tracking-wide">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Bottom line accent */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-mono text-primary/70 tracking-[0.3em] uppercase mb-4">
            Imkoniyatlar
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-foreground">
            Asosiy <span className="text-primary text-glow">imkoniyatlar</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Zamonaviy texnologiyalar asosida qurilgan kuchli xavfsizlik skaneri
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
