import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Sentinel Basic",
    desc: "Perfect for early startups.",
    price: "$499",
    suffix: "/mo",
    badge: undefined,
    highlighted: false,
    cta: "Get Started",
    features: ["Up to 5 assets", "Weekly deep scans", "Community support"],
  },
  {
    name: "Sentinel Pro",
    desc: "For high-growth security teams.",
    price: "$1,299",
    suffix: "/mo",
    badge: "Most Popular",
    highlighted: true,
    cta: "Start Growth Journey",
    features: ["Up to 25 assets", "Daily automated scans", "AI Copilot features", "Priority email support"],
  },
  {
    name: "Sentinel Enterprise",
    desc: "Unrivaled global coverage.",
    price: "Custom",
    suffix: "",
    badge: undefined,
    highlighted: false,
    cta: "Contact Sales",
    features: ["Unlimited assets", "Continuous node deployment", "Dedicated security engineer", "On-prem deployment options"],
  },
] as const;

const PricingSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-foreground mb-4">
            Built for Every Perimeter
          </h2>
          <p className="text-muted-foreground text-lg">Flexible plans designed to scale with your infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border bg-card/30 p-10 flex flex-col ${
                t.highlighted
                  ? "border-primary shadow-[0_0_60px_hsl(var(--glow)/0.10)] md:scale-[1.03]"
                  : "border-border/40"
              }`}
            >
              {t.badge ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-[0.25em] uppercase bg-primary text-primary-foreground">
                  {t.badge}
                </div>
              ) : null}

              <h3 className="text-xl font-extrabold text-foreground mb-2">{t.name}</h3>
              <p className="text-muted-foreground mb-6">{t.desc}</p>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-foreground">{t.price}</span>
                {t.suffix ? <span className="text-muted-foreground">{t.suffix}</span> : null}
              </div>

              <ul className="space-y-3 mb-10 flex-grow">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-foreground/90">
                    <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {t.highlighted ? (
                <Button variant="hero" size="lg" className="w-full">
                  {t.cta}
                </Button>
              ) : (
                <Button variant="outline" size="lg" className="w-full bg-background/20 border-border/60 hover:bg-card/50">
                  {t.cta}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
