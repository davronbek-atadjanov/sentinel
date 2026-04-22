import { motion, useInView } from "framer-motion"
import { Bell, FileCheck, FlaskConical, Radar } from "lucide-react"
import { useRef } from "react"

const features = [
  {
    icon: Radar,
    title: "Avtomatlashtirilgan Skanerlash",
    desc: "Kodingiz bilan birga rivojlanadigan doimiy, xalaqit bermaydigan skanerlashlarni o'rnating. Bizning AI dvigateli real vaqtda hujum yuzalarini xaritalaydi va ular ishlab chiqarishga yetib borguncha zaifliklarni aniqlaydi.",
  },
  {
    icon: Bell,
    title: "Haqiqiy vaqtdagi Ogohlantirishlar",
    desc: "Tezkor chora ko'rish uchun kontekstli tahdid haqida ma'lumot va og'irlik darajasini baholash bilan tanqidiy zaifliklar bo'yicha darhol xabarnomalar.",
  },
  {
    icon: FileCheck,
    title: "Muvofiqlik Hisobotlari",
    desc: "SOC2, HIPAA va GDPR ga muvofiqlik, bir marta bosish bilan audit uchun tayyor eksportlar bilan. Qo'shimcha xarajatlarsiz muvofiq qoling.",
  },
  {
    icon: FlaskConical,
    title: "Foydali yuk Laboratoriyasi",
    desc: "Eksploit vektorlarini o'z infratuzilmangizga qarshi xavfsiz sinab ko'rish uchun qumdon (sandbox) muhiti. Qizil jamoa aniqligi uchun ilg'or mutatsiya vositalari.",
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
            Jarrohlik Aniqligi.{" "}
            <span className="text-primary">Kengayuvchi Quvvat.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Intellektual xavfsizlikning to'rtta ustuni — avtomatlashtirilgan skanerlashdan 
            tortib ilg'or foydali yuk sinovlarigacha.
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
