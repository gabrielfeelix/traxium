import { TrendingDown, TrendingUp, Minus, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: "default" | "danger" | "success" | "warning";
  sparkline?: number[];
}

export function KPICard({
  label,
  value,
  delta,
  deltaLabel,
  hint,
  icon,
  variant = "default",
  sparkline,
}: KPICardProps) {
  const isPositive = typeof delta === "number" && delta > 0;
  const isNegative = typeof delta === "number" && delta < 0;
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <Card className="relative overflow-hidden group hover:shadow-brand-md transition-shadow">
      {variant !== "default" && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[3px]",
            variant === "danger" && "bg-gradient-to-r from-[hsl(0_78%_50%)] to-[hsl(0_70%_38%)]",
            variant === "success" && "bg-gradient-to-r from-[hsl(176_84%_30%)] to-[hsl(142_71%_36%)]",
            variant === "warning" && "bg-gradient-to-r from-[hsl(36_95%_50%)] to-[hsl(24_88%_42%)]"
          )}
        />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(210_14%_42%)]">
            {label}
          </p>
          {icon && (
            <div
              className={cn(
                "size-8 rounded-md flex items-center justify-center transition-colors",
                variant === "danger" && "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
                variant === "success" && "bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]",
                variant === "warning" && "bg-[hsl(36_95%_92%)] text-[hsl(24_88%_32%)]",
                variant === "default" && "bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]"
              )}
            >
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <p className="text-[28px] font-bold tracking-[-0.02em] num leading-none">{value}</p>
          {typeof delta === "number" && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md",
                isPositive && variant !== "danger" && "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
                isPositive && variant === "danger" && "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
                isNegative && variant !== "danger" && "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
                isNegative && variant === "danger" && "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
                !isPositive && !isNegative && "bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]"
              )}
            >
              <TrendIcon className="size-3" />
              <span className="num">{Math.abs(delta).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {sparkline && (
          <div className="mt-2 flex items-end gap-[2px] h-6">
            {sparkline.map((v, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm transition-all",
                  variant === "danger" && "bg-[hsl(0_78%_50%_/_0.4)]",
                  variant === "success" && "bg-[hsl(142_71%_36%_/_0.4)]",
                  variant === "warning" && "bg-[hsl(36_95%_50%_/_0.4)]",
                  variant === "default" && "bg-[hsl(176_84%_30%_/_0.4)]"
                )}
                style={{ height: `${(v / Math.max(...sparkline)) * 100}%` }}
              />
            ))}
          </div>
        )}
        {(deltaLabel || hint) && (
          <p className="mt-2.5 text-[11px] text-[hsl(210_14%_42%)] leading-snug">
            {deltaLabel && <span className="font-medium">{deltaLabel}</span>}
            {deltaLabel && hint && <span className="mx-1 text-[hsl(210_12%_70%)]">·</span>}
            {hint}
          </p>
        )}
      </div>
    </Card>
  );
}
