import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "+", label: "OWASP zaiflik turlari" },
  { value: 500, suffix: "+", label: "Skanerlangan saytlar" },
  { value: 99, suffix: "%", label: "Aniqlash aniqligi" },
  { value: 5, prefix: "<", suffix: "s", label: "O'rtacha skanerlash" },
];

const AnimatedNumber = ({ value, prefix, suffix, inView }: { value: number; prefix?: string; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const stepTime = duration / value;
    const timer = setInterval(() => {
      start++;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span>
      {prefix}{count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-5xl md:text-6xl font-extrabold font-mono text-primary text-glow mb-3 tracking-tight">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              {/* Underline */}
              <div className="mt-4 mx-auto w-12 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
