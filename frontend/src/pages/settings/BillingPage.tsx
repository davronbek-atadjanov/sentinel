import PageHeader from "@/components/shared/PageHeader"
import { Check, CreditCard, Crown } from "lucide-react"

const plans = [
  {
    name: "Boshlang'ich",
    price: "$49",
    period: "/oy",
    features: ["5 ta Faol Nishon", "Haftalik Skanerlash", "Asosiy Hisobot", "Elektron Pochta Orqali Yordam"],
    current: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/oy",
    features: ["25 ta Faol Nishon", "Kunlik Skanerlash", "Ilg'or Tahlil", "Ustuvor Yordam", "API ga Kirish", "CI/CD Integratsiyasi"],
    current: true,
  },
  {
    name: "Korxona",
    price: "$599",
    period: "/oy",
    features: ["Cheksiz Nishonlar", "Doimiy Skanerlash", "Maxsus Hisobotlar", "24/7 Maxsus Yordam", "To'liq API ga Kirish", "AI Xususiyatlari", "RBAC va SSO", "Mahalliy (On-premise) Variant"],
    current: false,
  },
];

const invoices = [
  { date: "1-okt, 2023", amount: "$199.00", status: "To'langan", id: "INV-2023-010" },
  { date: "1-sen, 2023", amount: "$199.00", status: "To'langan", id: "INV-2023-009" },
  { date: "1-avg, 2023", amount: "$199.00", status: "To'langan", id: "INV-2023-008" },
];

const BillingPage = () => {
  return (
    <div>
      <PageHeader title="Hisob-kitob va Obuna" description="Obuna rejangizni, to'lov usullarini va hisob-kitob tarixini boshqaring." />

      {/* Current Plan */}
      <div className="bg-surface-low rounded-xl p-6 border border-primary/20 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Professional Reja</p>
            <p className="text-xs text-[hsl(215,15%,45%)]">Oylik to'lov • Keyingi to'lov: 1-noy, 2023</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-headline text-white">$199</span>
          <span className="text-sm text-[hsl(215,15%,45%)]">/oy</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-surface-low rounded-xl p-6 border-ghost relative ${plan.current ? "border border-primary/30 shadow-glow-primary" : ""}`}>
            {plan.current && (
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-primary text-on-primary-fixed text-[10px] font-bold uppercase rounded">Joriy</span>
            )}
            <h3 className="text-lg font-bold font-headline text-white mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold font-headline text-white">{plan.price}</span>
              <span className="text-sm text-[hsl(215,15%,45%)]">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[hsl(215,15%,55%)]">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
              plan.current
                ? "bg-surface-container text-[hsl(215,15%,55%)] cursor-default"
                : "bg-gradient-primary text-on-primary-fixed hover:opacity-90 shadow-glow-primary"
            }`}>
              {plan.current ? "Joriy Reja" : "Yangilash"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <h3 className="font-bold text-white mb-4">To'lov Usuli</h3>
          <div className="flex items-center gap-4 bg-surface-container rounded-lg p-4">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm font-bold text-on-surface">•••• •••• •••• 4242</p>
              <p className="text-xs text-[hsl(215,15%,45%)]">Yaroqlilik muddati: 12/2025</p>
            </div>
          </div>
          <button className="mt-4 text-primary text-xs font-bold hover:underline">To'lov Usulini Yangilash</button>
        </div>

        <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)]">
            <h3 className="font-bold text-white">Hisob-kitob Tarixi</h3>
          </div>
          <table className="w-full text-left">
            <tbody className="text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container/30 transition-colors border-b border-[hsl(222,20%,12%,0.08)]">
                  <td className="px-5 py-3 text-on-surface">{inv.date}</td>
                  <td className="px-5 py-3 text-on-surface font-bold">{inv.amount}</td>
                  <td className="px-5 py-3"><span className="text-primary text-xs font-bold">{inv.status}</span></td>
                  <td className="px-5 py-3 text-xs text-[hsl(215,15%,45%)] font-mono">{inv.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
