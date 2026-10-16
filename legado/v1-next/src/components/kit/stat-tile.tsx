import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Tile de métrica único do sistema — substitui as ~8 reimplementações locais
 * (StatLine, MetricCard, SmallStat, Metric, KPI…). Ícone + label + valor + hint.
 * 100% token. Para métricas ricas (sparkline/delta) use `KPICard`.
 */
type Tone = "default" | "brand" | "success" | "warning" | "danger";

const toneChip: Record<Tone, string> = {
  default: "bg-brand-50 text-brand-700",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
};

interface StatTileProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
  className?: string;
}

export function StatTile({ icon: Icon, label, value, hint, tone = "default", className }: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-4 flex items-center gap-3",
        className
      )}
    >
      {Icon && (
        <span className={cn("size-10 rounded-lg flex items-center justify-center shrink-0", toneChip[tone])}>
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-fg-muted">{label}</p>
        <p className="num text-[22px] font-bold text-fg leading-none mt-1 truncate">{value}</p>
        {hint && <p className="text-[10px] text-fg-soft mt-1 truncate">{hint}</p>}
      </div>
    </div>
  );
}
