import PageHeader from "@/components/shared/PageHeader";
import { CreditCard, Check, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    features: ["5 Active Targets", "Weekly Scans", "Basic Reporting", "Email Support"],
    current: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    features: ["25 Active Targets", "Daily Scans", "Advanced Analytics", "Priority Support", "API Access", "CI/CD Integration"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$599",
    period: "/month",
    features: ["Unlimited Targets", "Continuous Scanning", "Custom Reports", "24/7 Dedicated Support", "Full API Access", "AI Features", "RBAC & SSO", "On-premise Option"],
    current: false,
  },
];

const invoices = [
  { date: "Oct 1, 2023", amount: "$199.00", status: "Paid", id: "INV-2023-010" },
  { date: "Sep 1, 2023", amount: "$199.00", status: "Paid", id: "INV-2023-009" },
  { date: "Aug 1, 2023", amount: "$199.00", status: "Paid", id: "INV-2023-008" },
];

const BillingPage = () => {
  return (
    <div>
      <PageHeader title="Billing & Subscription" description="Manage your subscription plan, payment methods, and billing history." />

      {/* Current Plan */}
      <div className="bg-surface-low rounded-xl p-6 border border-primary/20 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Professional Plan</p>
            <p className="text-xs text-[hsl(215,15%,45%)]">Billed monthly • Next billing: Nov 1, 2023</p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-headline text-white">$199</span>
          <span className="text-sm text-[hsl(215,15%,45%)]">/month</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-surface-low rounded-xl p-6 border-ghost relative ${plan.current ? "border border-primary/30 shadow-glow-primary" : ""}`}>
            {plan.current && (
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-primary text-on-primary-fixed text-[10px] font-bold uppercase rounded">Current</span>
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
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-low rounded-xl p-6 border-ghost">
          <h3 className="font-bold text-white mb-4">Payment Method</h3>
          <div className="flex items-center gap-4 bg-surface-container rounded-lg p-4">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm font-bold text-on-surface">•••• •••• •••• 4242</p>
              <p className="text-xs text-[hsl(215,15%,45%)]">Expires 12/2025</p>
            </div>
          </div>
          <button className="mt-4 text-primary text-xs font-bold hover:underline">Update Payment Method</button>
        </div>

        <div className="bg-surface-low rounded-xl border-ghost overflow-hidden">
          <div className="p-5 border-b border-[hsl(222,20%,12%,0.2)]">
            <h3 className="font-bold text-white">Billing History</h3>
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
