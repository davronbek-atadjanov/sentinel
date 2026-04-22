import { ArrowRight, ExternalLink, FileCheck, Radar, Shield } from "lucide-react"
import { Link } from "react-router-dom"

const steps = [
  {
    number: "01",
    title: "Birinchi Nishingizni Qo'shing",
    description: "Skanerlash sahifasiga o'ting va 'Yangi Skanerlash' tugmasini bosing. Maqsadli URL manzilingizni kiriting va skanerlash turini tanlang. Sentinel veb-ilovalarni, API-larni va tarmoq nuqtalarini qo'llab-quvvatlaydi.",
    link: "/app/scans/new",
    linkText: "Yangi Skanerlashni Boshlash",
    icon: Shield,
  },
  {
    number: "02",
    title: "Skanerlash Jarayonini Kuzatish",
    description: "Faol Skanerlash boshqaruv panelidan real vaqtda skanerlashni kuzatib boring. Aniqlangan manzillar, sinovdan o'tkazilgan payloadlar va topilgan zaifliklarni ko'ring.",
    link: "/app/scans",
    linkText: "Faol Skanerlashlarni Ko'rish",
    icon: Radar,
  },
  {
    number: "03",
    title: "Ko'rib Chiqish va Tuzatish",
    description: "Tugallangandan so'ng, natijalarni Zaifliklar bo'limida ko'rib chiqing. Bir marta bosish orqali tuzatish bo'yicha takliflar olish va muvofiqlik hisobotlarini yaratish uchun AI Copilot'dan foydalaning.",
    link: "/app/vulnerabilities",
    linkText: "Zaifliklarni Ko'rish",
    icon: FileCheck,
  },
];

const resources = [
  { title: "API Hujjatlari", desc: "To'liq REST API ma'lumotnomasi", href: "#" },
  { title: "Integratsiya Qo'llanmalari", desc: "CI/CD, Slack, Jira sozlamalari", href: "/app/settings/integrations" },
  { title: "Muvofiqlik Shablonlari", desc: "SOC2, HIPAA, GDPR andozalari", href: "/app/reports" },
  { title: "Video Darsliklar", desc: "Bosqichma-bosqich qo'llanmalar", href: "#" },
];

const QuickstartPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">
            Ishni Boshlash
          </span>
          <h1 className="text-4xl font-extrabold font-headline text-white mb-4">
            Bosqichma-bosqich Tezkor Qo'llanma
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Birinchi xavfsizlik skaneringizni 5 daqiqadan kamroq vaqt ichida ishga tushiring. Ilovalaringizni himoya qilishni boshlash uchun ushbu uch qadamni bajaring.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="bg-surface-low rounded-2xl p-8 border-ghost flex gap-8 items-start group hover:border-primary/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-primary font-headline">{step.number}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white font-headline">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                <Link
                  to={step.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {step.linkText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold font-headline text-white mb-6">Qo'shimcha Manbalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res, i) => (
              <Link
                key={i}
                to={res.href}
                className="bg-surface-container rounded-xl p-5 border-ghost flex items-center justify-between hover:bg-surface-high transition-colors group"
              >
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{res.title}</h4>
                  <p className="text-xs text-muted-foreground">{res.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[hsl(215,15%,35%)] group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickstartPage;
