import {
  Calendar,
  PackageOpen,
  Truck,
  PackagePlus,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCheck,
  XCircle,
  Send,
  HourglassIcon,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Agendada: { label: "Agendada", bg: "bg-[hsl(200_18%_94%)]", text: "text-[hsl(210_14%_42%)]", icon: Calendar },
  "Em carregamento": { label: "Em carregamento", bg: "bg-[hsl(200_60%_94%)]", text: "text-[hsl(202_92%_24%)]", icon: PackageOpen },
  "Em trânsito": { label: "Em trânsito", bg: "bg-[hsl(174_64%_94%)]", text: "text-[hsl(180_80%_18%)]", icon: Truck },
  Descarregando: { label: "Descarregando", bg: "bg-[hsl(200_60%_94%)]", text: "text-[hsl(202_92%_24%)]", icon: PackagePlus },
  Concluída: { label: "Concluída", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  Bloqueada: { label: "Bloqueada", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: ShieldAlert },
  Ativo: { label: "Ativo", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCheck },
  "Em viagem": { label: "Em viagem", bg: "bg-[hsl(174_64%_94%)]", text: "text-[hsl(180_80%_18%)]", icon: Truck },
  Inativo: { label: "Inativo", bg: "bg-[hsl(200_18%_94%)]", text: "text-[hsl(210_14%_42%)]", icon: Clock },
  Bloqueado: { label: "Bloqueado", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: XCircle },
  Aprovada: { label: "Aprovada", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  "Em análise": { label: "Em análise", bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]", icon: HourglassIcon },
  Pendente: { label: "Pendente", bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]", icon: Clock },
  Rascunho: { label: "Rascunho", bg: "bg-[hsl(200_18%_94%)]", text: "text-[hsl(210_14%_42%)]", icon: PencilLine },
  "Pronto para envio": { label: "Pronto para envio", bg: "bg-[hsl(200_60%_94%)]", text: "text-[hsl(202_92%_24%)]", icon: Send },
  "Enviado TRACES": { label: "Enviado TRACES", bg: "bg-[hsl(174_64%_94%)]", text: "text-[hsl(180_80%_18%)]", icon: Send },
  Aprovado: { label: "Aprovado", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  Rejeitado: { label: "Rejeitado", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: XCircle },
  Aberta: { label: "Aberta", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: AlertTriangle },
  "Em tratamento": { label: "Em tratamento", bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]", icon: HourglassIcon },
  Resolvida: { label: "Resolvida", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  Justificada: { label: "Justificada", bg: "bg-[hsl(200_18%_94%)]", text: "text-[hsl(210_14%_42%)]", icon: CheckCheck },
  Válida: { label: "Válida", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  Vencida: { label: "Vencida", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: XCircle },
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    bg: "bg-[hsl(200_18%_94%)]",
    text: "text-[hsl(210_14%_42%)]",
    icon: Clock,
  };
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap leading-none",
        config.bg,
        config.text,
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5",
        className
      )}
    >
      <Icon className={size === "sm" ? "size-2.5" : "size-3"} />
      {config.label}
    </span>
  );
}

const regimeConfig = {
  A: { label: "A · Seco", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", dot: "hsl(142 71% 36%)" },
  B: { label: "B · Água", bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]", dot: "hsl(48 95% 50%)" },
  C: { label: "C · Detergente", bg: "bg-[hsl(28_92%_92%)]", text: "text-[hsl(24_88%_32%)]", dot: "hsl(28 92% 48%)" },
  D: { label: "D · Desinfecção", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", dot: "hsl(0 78% 50%)" },
};

export function RegimeBadge({ regime, size = "md" }: { regime: "A" | "B" | "C" | "D"; size?: "sm" | "md" }) {
  const c = regimeConfig[regime];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap leading-none",
        c.bg,
        c.text,
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"
      )}
    >
      <span className={cn("rounded-full inline-block", size === "sm" ? "size-1.5" : "size-2")} style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

const riscoConfig = {
  Baixo: { bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]" },
  Médio: { bg: "bg-[hsl(48_95%_90%)]", text: "text-[hsl(38_90%_28%)]" },
  Alto: { bg: "bg-[hsl(28_92%_92%)]", text: "text-[hsl(24_88%_32%)]" },
  "Crítico": { bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]" },
};

export function RiscoBadge({ risco }: { risco: "Baixo" | "Médio" | "Alto" | "Crítico" }) {
  const c = riscoConfig[risco];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none whitespace-nowrap",
        c.bg,
        c.text
      )}
    >
      {risco}
    </span>
  );
}

const compStatusConfig = {
  apto: { label: "Apto", bg: "bg-[hsl(142_65%_93%)]", text: "text-[hsl(142_71%_24%)]", icon: CheckCircle2 },
  bloqueado: { label: "Bloqueado", bg: "bg-[hsl(0_72%_94%)]", text: "text-[hsl(0_70%_38%)]", icon: ShieldAlert },
  requer_limpeza: { label: "Requer limpeza", bg: "bg-[hsl(28_92%_92%)]", text: "text-[hsl(24_88%_32%)]", icon: AlertTriangle },
  sem_historico: { label: "Sem histórico", bg: "bg-[hsl(200_18%_94%)]", text: "text-[hsl(210_14%_42%)]", icon: Clock },
} as const;

export function CompartimentoStatusBadge({
  status,
  size = "md",
}: {
  status: "apto" | "bloqueado" | "requer_limpeza" | "sem_historico";
  size?: "sm" | "md";
}) {
  const c = compStatusConfig[status];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap leading-none",
        c.bg,
        c.text,
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"
      )}
    >
      <Icon className={size === "sm" ? "size-2.5" : "size-3"} />
      {c.label}
    </span>
  );
}
