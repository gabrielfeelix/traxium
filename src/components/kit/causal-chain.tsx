"use client";

import { CheckCircle2, ChevronDown, ChevronRight, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dispositivo do kit: cadeia causal — stepper horizontal (vertical no mobile)
 * com portão pass/falha e "quebra" vermelha a partir de onde o fluxo para.
 * Extraído da assinatura de Compartimento (cadeia de proveniência); Bloqueios/
 * CAPA reusa o mesmo vocabulário visual.
 */

export function ChainNode({
  etapa,
  tone,
  children,
}: {
  etapa: string;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex-1 lg:min-w-0 rounded-lg border bg-bg-elev p-3", tone ?? "border-border-soft")}>
      <p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft mb-2">{etapa}</p>
      {children}
    </div>
  );
}

const GATE = {
  ok: { cls: "bg-regime-a-bg text-regime-a-fg", Icon: CheckCircle2, label: "satisfaz" },
  fail: { cls: "bg-danger-50 text-danger-700", Icon: XCircle, label: "falha" },
  pending: { cls: "bg-warning-50 text-warning-700", Icon: Clock, label: "pendente" },
} as const;

export type ChainGate = keyof typeof GATE;

export function ChainConn({
  label,
  gate,
  gateLabel,
  broken,
}: {
  label?: string;
  gate?: ChainGate;
  /** Sobrescreve o rótulo padrão do portão (satisfaz/falha/pendente). */
  gateLabel?: string;
  broken?: boolean;
}) {
  const g = gate ? GATE[gate] : null;
  return (
    <div className="flex lg:flex-col items-center justify-center gap-1 shrink-0 lg:w-16 py-1 lg:py-0">
      {g ? (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap",
            g.cls
          )}
        >
          <g.Icon className="size-2.5" />
          {gateLabel ?? g.label}
        </span>
      ) : label ? (
        <span className="text-[8px] uppercase tracking-[0.1em] text-fg-soft whitespace-nowrap">{label}</span>
      ) : null}
      <ChevronRight className={cn("hidden lg:block size-4", broken ? "text-danger-500" : "text-fg-soft")} />
      <ChevronDown className={cn("lg:hidden size-4", broken ? "text-danger-500" : "text-fg-soft")} />
    </div>
  );
}
