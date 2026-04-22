interface StatusBadgeProps {
  status: "completed" | "running" | "paused" | "failed" | "open" | "resolved" | "false_positive" | "pending";
  className?: string;
}

const statusConfig = {
  completed: { label: "Yakunlangan", styles: "bg-primary-container text-primary" },
  running: { label: "Jarayonda", styles: "text-sentinel-tertiary", dot: "bg-sentinel-tertiary animate-pulse" },
  paused: { label: "To'xtatilgan", styles: "text-[hsl(35,90%,65%)]", dot: "bg-[hsl(35,90%,65%)]" },
  failed: { label: "Muvaffaqiyatsiz", styles: "bg-error-container text-on-error-container" },
  open: { label: "Ochiq", styles: "text-sentinel-error", dot: "bg-sentinel-error" },
  resolved: { label: "Hal qilingan", styles: "text-primary", dot: "bg-primary" },
  false_positive: { label: "Soxta pozitiv", styles: "text-on-surface-variant", dot: "bg-on-surface-variant" },
  pending: { label: "Kutilmoqda", styles: "text-[hsl(35,90%,65%)]", dot: "bg-[hsl(35,90%,65%)]" },
};

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const config = statusConfig[status];

  if (config.dot) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wide ${config.styles}`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${config.styles} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
