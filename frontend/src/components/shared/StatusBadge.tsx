interface StatusBadgeProps {
  status: "completed" | "running" | "paused" | "failed" | "open" | "resolved" | "false_positive" | "pending";
  className?: string;
}

const statusConfig = {
  completed: { label: "Completed", styles: "bg-primary-container text-primary" },
  running: { label: "In Progress", styles: "text-sentinel-tertiary", dot: "bg-sentinel-tertiary animate-pulse" },
  paused: { label: "Paused", styles: "text-[hsl(35,90%,65%)]", dot: "bg-[hsl(35,90%,65%)]" },
  failed: { label: "Failed", styles: "bg-error-container text-on-error-container" },
  open: { label: "Open", styles: "text-sentinel-error", dot: "bg-sentinel-error" },
  resolved: { label: "Resolved", styles: "text-primary", dot: "bg-primary" },
  false_positive: { label: "False Positive", styles: "text-on-surface-variant", dot: "bg-on-surface-variant" },
  pending: { label: "Pending", styles: "text-[hsl(35,90%,65%)]", dot: "bg-[hsl(35,90%,65%)]" },
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
