import { motion, useInView } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { useRef } from "react"

const bullets = [
  "Exploitation of modern XSS patterns",
  "Blind SQL Injection detection with reasoning",
  "Automated WAF bypass simulation",
] as const;

const InteractiveDemoSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline tracking-tight text-foreground mb-5">
            See Sentinel in Action
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Watch our engine analyze a live application. We don’t just find issues — we safely prove them.
          </p>

          <ul className="space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden shadow-[0_0_40px_hsl(var(--glow)/0.06)]"
        >
          <div className="px-5 py-4 border-b border-border/40 bg-muted/20 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/40" />
              <div className="w-3 h-3 rounded-full bg-accent/30" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
            </div>
            <div className="text-xs font-mono text-muted-foreground">terminal — sentinel-scan</div>
          </div>
          <div className="p-6 font-mono text-sm space-y-2 bg-background/40">
            <div className="text-muted-foreground">[$] sentinel analyze --target app.example.com</div>
            <div className="text-primary">[-] Core initialized. Engaging neural engine…</div>
            <div className="text-muted-foreground">[+] Crawler identified 142 distinct endpoints.</div>
            <div className="text-destructive">[!] ALERT: Possible SQL Injection on /api/v1/user?id=</div>
            <div className="text-destructive">[!] Vector: Boolean-based blind. Proof: payload verified.</div>
            <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <div className="font-semibold text-foreground mb-1">REMEDIATION COPILOT:</div>
              <div className="text-muted-foreground">
                Suggested fix: implement parameterized queries and strict input validation.
              </div>
            </div>
            <div className="text-primary">_</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
