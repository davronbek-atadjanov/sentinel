import { Bell, HelpCircle, Search } from "lucide-react"
import { Link } from "react-router-dom"

const TopBar = () => {
  return (
    <header className="fixed top-0 right-0 h-16 bg-[hsl(222,60%,4%,0.85)] backdrop-blur-xl flex justify-between items-center px-8 z-40 border-b border-[hsl(222,18%,10%,0.5)]" style={{ width: "calc(100% - 260px)" }}>
      {/* Search */}
      <div className="flex items-center flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215,15%,35%)]" />
          <input
            type="text"
            placeholder="Zaifliklar, nishonlar yoki loglarni izlash..."
            className="w-full bg-[hsl(222,40%,5%,0.6)] border border-[hsl(222,15%,12%)] rounded-lg pl-10 pr-4 py-2 text-on-surface text-xs focus:ring-1 focus:ring-primary/40 placeholder:text-[hsl(215,15%,30%)] transition-all focus:outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <Link
            to="/app/notifications"
            className="hover:text-white transition-all p-2.5 rounded-lg hover:bg-surface-high relative text-[hsl(215,15%,50%)]"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-sentinel-tertiary rounded-full border border-[hsl(222,60%,4%)]" />
          </Link>
          <button className="hover:text-white transition-all p-2.5 rounded-lg hover:bg-surface-high text-[hsl(215,15%,50%)]">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="h-7 w-px bg-[hsl(222,15%,10%)]" />

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[hsl(215,15%,40%)] uppercase font-semibold">Holati:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] text-primary font-bold uppercase tracking-wide">Ishlayabdi</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
