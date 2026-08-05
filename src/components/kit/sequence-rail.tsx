"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Dispositivo do kit: sequence rail — linha do tempo compacta horizontal.
 * Serve o T-3 em Viagens, o ciclo DDS em Lotes, a contagem D-N em Auditoria
 * e a Atividade (handoff §3). Cada passo é um ponto (ou marcador custom, ex.
 * RegimeDisc) + rótulo; o conector quebra em vermelho onde a sequência falha
 * e o passo "atual" pulsa (DESIGN §12).
 */

export type RailTone = "ok" | "atencao" | "falha" | "neutro" | "brand";

const DOT: Record<RailTone, string> = {
  ok: "bg-success-500",
  atencao: "bg-warning-500",
  falha: "bg-danger-500",
  neutro: "bg-fg-soft",
  brand: "bg-brand-500",
};

export type RailStepDef = {
  key: string;
  titulo: string;
  sub?: string;
  tone?: RailTone;
  /** Estado "atual" — recebe o pulse-ring do sistema (DESIGN §12). */
  atual?: boolean;
  /** Substitui o ponto (ex.: <RegimeDisc/>). */
  marcador?: React.ReactNode;
  /** Conector que chega neste passo quebra em vermelho. */
  quebraAntes?: boolean;
};

export function SequenceRail({ steps, className }: { steps: RailStepDef[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 min-w-0", className)}>
      {steps.map((s, i) => (
        <Fragment key={s.key}>
          {i > 0 && (
            <span
              aria-hidden
              className={cn("h-px flex-1 min-w-3", s.quebraAntes ? "bg-danger-500" : "bg-border")}
            />
          )}
          <div className="flex items-center gap-1.5 shrink min-w-0">
            {s.marcador ?? (
              <span
                className={cn(
                  "block size-2.5 rounded-full shrink-0",
                  DOT[s.tone ?? "neutro"],
                  s.atual && "animate-pulse-ring"
                )}
              />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-fg leading-tight truncate">{s.titulo}</p>
              {s.sub && <p className="text-[9px] text-fg-muted leading-tight truncate num">{s.sub}</p>}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
