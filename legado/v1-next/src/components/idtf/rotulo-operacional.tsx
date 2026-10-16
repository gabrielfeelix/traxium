"use client";

// O resultado da IDTF dito no vocabulário de quem carrega (Fase 8.2).
// "BLOQUEIO" informa; "Liberado após limpeza C" manda alguém pegar a mangueira.

import { CircleCheck, Droplets, FileWarning, Ban, HelpCircle, Clock } from "lucide-react";
import { rotuloOperacional, type ResultadoIDTF } from "@/lib/domain/idtf";
import { cn } from "@/lib/utils";

function icone(r: ResultadoIDTF) {
  if (r.rotulo === "Liberado") return CircleCheck;
  if (r.rotulo.startsWith("Liberado após limpeza")) return Droplets;
  if (r.rotulo === "Necessita procedimento especial") return FileWarning;
  if (r.rotulo === "Carga anterior proibida") return Ban;
  if (r.rotulo === "Produto não identificado") return HelpCircle;
  return Clock;
}

/** Linha completa: rótulo, motivo e próximo passo. Usada onde há espaço. */
export function RotuloOperacional({ viagemId, compacto }: { viagemId: string; compacto?: boolean }) {
  const r = rotuloOperacional(viagemId);
  const Icon = icone(r);

  if (compacto) {
    return (
      <span
        title={r.motivo}
        className={cn(
          "inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold",
          r.tom === "ok" && "bg-success-50 text-success-700",
          r.tom === "acao" && "bg-warning-50 text-warning-700",
          r.tom === "bloqueio" && "bg-danger-50 text-danger-700"
        )}
      >
        <Icon className="size-3" aria-hidden /> {r.rotulo}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-3 flex items-start gap-3",
        r.tom === "ok" && "border-success-500/30 bg-success-50/60",
        r.tom === "acao" && "border-warning-500/30 bg-warning-50/60",
        r.tom === "bloqueio" && "border-danger-500/30 bg-danger-50/60"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 mt-0.5",
          r.tom === "ok" && "text-success-700",
          r.tom === "acao" && "text-warning-700",
          r.tom === "bloqueio" && "text-danger-700"
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted">Resultado IDTF</p>
        <p
          className={cn(
            "text-[13px] font-semibold leading-tight",
            r.tom === "ok" && "text-success-700",
            r.tom === "acao" && "text-warning-700",
            r.tom === "bloqueio" && "text-danger-700"
          )}
        >
          {r.rotulo}
        </p>
        <p className="text-[11.5px] text-fg-muted mt-0.5 leading-snug">{r.motivo}</p>
        {r.acao && (
          <p className="text-[11px] text-fg mt-1">
            <strong className="font-semibold">Próximo passo:</strong> {r.acao}
          </p>
        )}
      </div>
    </div>
  );
}
