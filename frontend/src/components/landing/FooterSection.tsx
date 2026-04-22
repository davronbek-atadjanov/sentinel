import { Shield } from "lucide-react"
import { Link } from "react-router-dom"

const FooterSection = () => {
  return (
    <footer className="bg-surface-lowest/50 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative">
                <Shield className="w-6 h-6 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-foreground font-headline">
                SENTINEL
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Veb-ilovalar xavfsizligining navbatdagi avlodi — AI bilan 
              ishlaydigan va xavfsizlik mutaxassislari tomonidan tasdiqlangan.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-start md:justify-end">
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Platforma
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    to="/app/dashboard"
                  >
                    Boshqaruv paneli
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    to="/app/scans"
                  >
                    Skanerlash
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    to="/app/reports"
                  >
                    Moslik
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Huquqiy
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    href="#"
                  >
                    Maxfiylik Siyosati
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    href="#"
                  >
                    Xizmat Ko'rsatish Shartlari
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    href="#"
                  >
                    Xavfsizlik Boshqaruvi
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    href="#"
                  >
                    Holat (Status)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/20 text-center">
          <span className="text-muted-foreground text-sm">
            © 2024 Sentinel Security. Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
