import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendColor?: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

const MetricCard = ({
  label,
  value,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  trendColor = "text-primary",
  subtitle,
  className = "",
  children,
}: MetricCardProps) => {
  return (
    <div
      className={`bg-surface-low rounded-xl p-6 border-ghost relative overflow-hidden group ${className}`}
    >
      {Icon && <Icon className={`w-5 h-5 ${iconColor} mb-4`} />}
      <p className="text-3xl font-bold font-headline text-white">{value}</p>
      <p className="text-[10px] text-[hsl(215,15%,40%)] uppercase tracking-wider font-semibold mt-1">
        {label}
      </p>
      {trend && (
        <p className={`text-xs ${trendColor} font-medium mt-2`}>{trend}</p>
      )}
      {subtitle && (
        <p className="text-xs text-[hsl(215,15%,45%)] mt-1">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

export default MetricCard;
