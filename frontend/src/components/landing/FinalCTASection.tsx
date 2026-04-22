import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const FinalCTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-foreground mb-6">
          Har Bir Skanerlash Orqali{" "}
          <span className="text-primary">Ilovangiz Xavfsizligini Oshiring.</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10">
          Veb loyihalaringizni turli xakerlik hujumlaridan muntazam himoyalashni 
          uyg'unlashtiring. Tizimingizni himoyalashni o'z nazoratingizga oling!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-base px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-glow-primary"
          >
            Boshlash
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/app/scans/new"
            className="inline-flex items-center justify-center gap-2 bg-background/20 border border-border/60 hover:bg-card/50 text-foreground font-medium text-base px-10 py-4 rounded-lg transition-all"
          >
            Skanerlashni Boshlash
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
