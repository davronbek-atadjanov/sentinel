import { AnimatePresence, motion } from "framer-motion"
import { Menu, Shield, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/app/dashboard", label: "Boshqaruv paneli" },
    { href: "/app/scans", label: "Skanerlash" },
    { href: "/app/reports", label: "Moslik" },
    { href: "/app/ai/payload-lab", label: "Foydali yuk laboratoiyasi" },
    { href: "/app/settings/integrations", label: "Sozlamalar" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40"
          : "bg-background/20 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative">
            <Shield className="w-6 h-6 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
          </div>
          <span className="font-bold tracking-tight text-foreground font-headline">
            SENTINEL
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-primary text-on-primary-fixed font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-glow-primary"
          >
            Skanerlash
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Menyuni yopish" : "Menyuni ochish"}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/40 bg-background/90 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  to="/app/dashboard"
                  className="block w-full text-center bg-gradient-primary text-on-primary-fixed font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
                >
                  Skanerlash
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
