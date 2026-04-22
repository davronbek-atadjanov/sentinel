import {
    Brain,
    Crosshair,
    FileSearch,
    GitPullRequest,
    Target,
    TrendingUp,
    Wrench,
} from "lucide-react"
import { Link } from "react-router-dom"

const aiFeatures = [
  {
    id: "payload-lab",
    title: "AI Payload Laboratoriyasi",
    desc: "AI modellari yordamida avtomatlashtirilgan payload yaratish va mutatsiya testi. Infratuzilmangizga qarshi noyob hujum vektorlarini sinab ko'ring.",
    icon: Brain,
    path: "/app/ai/payload-lab",
    status: "Faol",
    statusColor: "text-primary bg-primary/10",
    metrics: "1,284 payload yaratildi",
  },
  {
    id: "threat-hunting",
    title: "Proaktiv Xavflarni Qidirish",
    desc: "Nol-kunlik (zero-day) zaifliklarni va yangi paydo bo'layotgan hujum usullarini ekspluatatsiya qilinmasidan oldin faol ravishda aniqlaydigan AI drayveri.",
    icon: Crosshair,
    path: "/app/ai/threat-hunting",
    status: "Skanerlanmoqda",
    statusColor: "text-sentinel-tertiary bg-sentinel-tertiary/10",
    metrics: "42 ta xavf aniqlandi",
  },
  {
    id: "evidence-analysis",
    title: "Dalillarni Tahlil Qilish",
    desc: "Zaiflik dalillarini tahlil qiladigan, hujum vektorlarini taqqoslaydigan va kontekstual xavflarni baholaydigan chuqur mushohada mexanizmi.",
    icon: FileSearch,
    path: "/app/ai/evidence",
    status: "Faol",
    statusColor: "text-primary bg-primary/10",
    metrics: "98% aniqlik darajasi",
  },
  {
    id: "remediation-copilot",
    title: "Tuzatish Kopiloti",
    desc: "Aniqlangan zaifliklar uchun yechim bo'yicha tavsiyalar, kod yamoqlari va tuzatish ish oqimlarini ishlab chiquvchi AI yordamchisi.",
    icon: Wrench,
    path: "/app/ai/remediation",
    status: "Faol",
    statusColor: "text-primary bg-primary/10",
    metrics: "78 ta avto-tuzatish qo'llanildi",
  },
  {
    id: "predictive-modeling",
    title: "Bashoratli Xavf Modellashtirish",
    desc: "Zaiflik tendensiyalarini prognoz qiladigan, hujum yuzalarini bashorat qiladigan va xavfsizlik sarmoyalarini birinchi o'ringa qo'yadigan mashinali o'rganish modellari.",
    icon: TrendingUp,
    path: "/app/ai/predictive",
    status: "O'rgatilmoqda",
    statusColor: "text-[hsl(35,90%,55%)] bg-[hsl(35,90%,55%,0.1)]",
    metrics: "Model v3.2 o'rgatilmoqda",
  },
  {
    id: "red-team",
    title: "Qizil Jamoa Avtomatizatsiyasi",
    desc: "Xavfsizlik holatingizni stress-testdan o'tkazish uchun murakkab hujum stsenariylarini taqlid qiluvchi avtomatlashtirilgan raqib simulyatsiyasi.",
    icon: Target,
    path: "/app/ai/red-team",
    status: "Kutish Holatida",
    statusColor: "text-[hsl(215,15%,50%)] bg-surface-high",
    metrics: "Oxirgi marta: 2 kun oldin",
  },
  {
    id: "smart-remediation",
    title: "Aqlli Tuzatish PR",
    desc: "Uzluksiz joylashtirish (deployment) uchun CI/CD tizimingiz bilan to'g'ridan-to'g'ri integratsiyalashgan holda xavfsizlik tuzatishlari bilan avtomatik pull request (PR) lar yaratadi.",
    icon: GitPullRequest,
    path: "/app/ai/smart-fix",
    status: "Faol",
    statusColor: "text-primary bg-primary/10",
    metrics: "Bu hafta 14 PR birlashtirildi",
  },
];

const AIHubPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-on-primary-fixed" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-white">
              AI Boshqaruv Markazi
            </h2>
          </div>
        </div>
        <p className="text-on-surface-variant text-body-md mt-2 max-w-2xl">
          Ilg'or AI bilan quvvatlangan xavfsizlik modullari. Har bir modul Sentinel ekotizimi 
          bo'ylab ma'lumot almashgan holda avtonom ishlaydi.
        </p>
      </div>

      {/* AI System Status */}
      <div className="bg-surface-low rounded-xl p-6 border-ghost mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white">AI Dvigateli: Tarmoqda</span>
          </div>
          <div className="text-xs text-[hsl(215,15%,45%)]">
            Model: <span className="text-primary font-mono">Sentinel-LLM v4.2</span>
          </div>
          <div className="text-xs text-[hsl(215,15%,45%)]">
            GPU Klasteri: <span className="text-on-surface">8x A100 • 94% foydalanish</span>
          </div>
        </div>
        <div className="text-xs text-[hsl(215,15%,45%)]">
          Ishlash vaqti (Uptime): <span className="text-primary font-bold">99.97%</span>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature) => (
          <Link
            key={feature.id}
            to={feature.path}
            className="bg-surface-low rounded-xl p-6 border-ghost hover:bg-surface-container transition-all group cursor-pointer relative overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4 relative">
              <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${feature.statusColor}`}>
                {feature.status}
              </span>
            </div>

            <h3 className="text-lg font-bold font-headline text-white mb-2 group-hover:text-primary transition-colors relative">
              {feature.title}
            </h3>
            <p className="text-xs text-[hsl(215,15%,50%)] leading-relaxed mb-4 relative">
              {feature.desc}
            </p>

            <div className="flex items-center justify-between relative">
              <span className="text-[10px] text-primary font-semibold">{feature.metrics}</span>
              <span className="text-xs text-[hsl(215,15%,40%)] group-hover:text-primary transition-colors font-bold">
                Ochish →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIHubPage;
