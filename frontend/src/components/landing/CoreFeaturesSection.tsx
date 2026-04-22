import { motion, useInView } from "framer-motion"
import { Bell, FileCheck, FlaskConical, Radar } from "lucide-react"
import { useRef } from "react"

const features = [
  {
    icon: Radar,
    title: "To'liq Avtomatlashtirilgan Skanerlash",
    desc: "Kodingizni URL yoki Domen orqali tizimga kiritib, avtomat qidiruvni boshlang. Bizning dvigatel saytdagi uzilishlarsiz SQLi, XSS kabi kiberhujumlarga sharoitlar bor-yo'qligini xaritalaydi.",
  },
  {
    icon: Bell,
    title: "Vaqtida Va Aniq Ogohlantirish",
    desc: "Loyihangizda zaiflik topilganda, darhol uning og'irlik darajasi (Critical, High, Medium) hamda uni Qanday bartaraf etish (Remediation) bo'yicha ko'rsatma oling.",
  },
  {
    icon: FileCheck,
    title: "Eksport va Xavfsizlik Hisobotlari",
    desc: "OWASP Top10 hamda boshqa xalqaro xavfsizlik standartlariga asoslangan audit hisobotlarini tezda PDF yoki ko'rgazmali grafiklar orqali yuklab olish.",
  },
  {
    icon: FlaskConical,
    title: "Darhol Qo'llab-quvvatlash",
    desc: "Ko'plab turdagi maxsus Payloadlar (Zararli so'rovlar). Bu orqali siz ilovangizning yevolyutsiyasini doimiy monitoringi nazoratini ushlab turasiz.",
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
            Yuqori Aniqlik.{" "}
            <span className="text-primary">Chuqur Tahlil.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Zamonaviy Veb-sayt xavfsizligining to'rtta asosiy ustuni — Avtomatik skanerlashdan tortib xavflarni zudlik bilan aniqlashgacha.
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
