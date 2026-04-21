interface SeverityBadgeProps {
  severity: "critical" | "high" | "medium" | "low" | "info";
  className?: string;
}

const severityStyles = {
  critical: "bg-error-container text-on-error-container",
  high: "bg-tertiary-container text-on-tertiary-container",
  medium: "bg-[hsl(35,80%,15%)] text-[hsl(35,90%,65%)]",
  low: "bg-primary-container text-primary",
  info: "bg-surface-high text-on-surface-variant",
};

const SeverityBadge = ({ severity, className = "" }: SeverityBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 rounded text-label-sm font-bold uppercase tracking-wide ${severityStyles[severity]} ${className}`}
    >
      {severity}
    </span>
  );
};

export default SeverityBadge;
