"use client";

import { ChevronLeft, ChevronRight, Globe2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { TraceLog } from "@/lib/mock-data";

/**
 * Momento-assinatura da tela Traces: o log SOAP deixa de ser lista chata e
 * vira um diagrama de sequência bidirecional Traxium ↔ TRACES NT — lifelines
 * verticais, cada mensagem é uma seta OUT/IN colorida pelo status (resposta
 * tracejada), com a conexão viva (pulse + latência + sparkline) no topo.
 */

const STATUS_TONE: Record<TraceLog["status"], { linha: string; seta: string; badge: "success" | "default" | "warning" | "destructive" }> = {
  Approved: { linha: "bg-success-500/50", seta: "text-success-500", badge: "success" },
  Accepted: { linha: "bg-brand-500/40", seta: "text-brand-500", badge: "default" },
  "Pending Review": { linha: "bg-warning-500/50", seta: "text-warning-500", badge: "warning" },
  Rejected: { linha: "bg-danger-500/60", seta: "text-danger-500", badge: "destructive" },
};

export function MonitorConexao({ logs }: { logs: TraceLog[] }) {
  const cronologicos = [...logs].sort((a, b) => a.ts.localeCompare(b.ts));
  const latencias = cronologicos.map((l) => l.latenciaMs);
  const maxLat = Math.max(...latencias, 1);
  const mediaSaida = Math.round(
    cronologicos.filter((l) => l.direcao === "out").reduce((acc, l) => acc + l.latenciaMs, 0) /
      Math.max(cronologicos.filter((l) => l.direcao === "out").length, 1)
  );

  return (
    <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Monitor de conexão</h2>
      <p className="text-[12px] text-fg-muted leading-snug mt-0.5 mb-4 max-w-2xl">
        Cada mensagem SOAP entre o gateway e a Comissão Europeia, na sequência em que aconteceu —
        pedidos à direita, respostas de volta à esquerda, rejeição em vermelho.
      </p>

      {/* Atores + conexão viva */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Ator nome="Traxium" endereco="api.traxium.com.br" icone={<Zap className="size-4" />} tone="bg-gradient-to-br from-brand-600 to-sky-600" />
        <div className="flex flex-col items-center gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success-500 animate-pulse-ring" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-success-700">Online</span>
            <span className="text-[10px] text-fg-muted num">· {mediaSaida}ms média de envio</span>
          </div>
          {/* Sparkline de latência (12 barras — idioma do KPI card) */}
          <div className="flex items-end gap-0.5 h-6" aria-label="Latência das últimas mensagens" role="img">
            {latencias.slice(-12).map((ms, i, arr) => (
              <span
                key={i}
                title={`${ms}ms`}
                className={cn(
                  "w-1.5 rounded-sm",
                  ms > 800 ? "bg-danger-500" : i === arr.length - 1 ? "bg-brand-600" : "bg-brand-500/40"
                )}
                style={{ height: `${Math.max(15, (ms / maxLat) * 100)}%` }}
              />
            ))}
          </div>
        </div>
        <Ator nome="TRACES NT" endereco="ec.europa.eu/traces" icone={<Globe2 className="size-4" />} tone="bg-gradient-to-br from-sky-500 to-sky-600" />
      </div>

      {/* Sequência bidirecional entre as lifelines */}
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-5 border-l border-dashed border-border" aria-hidden />
        <div className="absolute inset-y-0 right-5 border-l border-dashed border-border" aria-hidden />

        <div className="py-2">
          {cronologicos.map((log, i) => {
            const T = STATUS_TONE[log.status];
            const out = log.direcao === "out";
            return (
              <div key={i} className="relative px-10 py-3">
                <div className={cn("absolute left-5 right-5 top-1/2 h-px", T.linha, !out && "opacity-70")} aria-hidden />
                {out ? (
                  <ChevronRight className={cn("absolute right-3.5 top-1/2 -translate-y-1/2 size-4", T.seta)} aria-hidden />
                ) : (
                  <ChevronLeft className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 size-4", T.seta)} aria-hidden />
                )}
                <div className="relative mx-auto w-fit max-w-full flex items-center gap-2.5 rounded-md border border-border-soft bg-bg-elev shadow-brand-sm px-3 py-1.5">
                  <span className={cn("font-mono text-[9px] font-bold shrink-0", out ? "text-brand-700" : "text-sky-600")}>
                    {out ? "→ OUT" : "← IN"}
                  </span>
                  <span className="text-[12px] font-semibold text-fg truncate">{log.evento}</span>
                  <span className="hidden sm:inline font-mono text-[10px] text-fg-muted truncate">{log.payload}</span>
                  <span className="hidden md:inline text-[10px] text-fg-soft num whitespace-nowrap">{formatDateTime(log.ts)}</span>
                  <span className="hidden md:inline text-[10px] text-fg-soft num">{log.latenciaMs}ms</span>
                  <Badge variant={T.badge} className="text-[9px] shrink-0">{log.status}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Ator({ nome, endereco, icone, tone }: { nome: string; endereco: string; icone: React.ReactNode; tone: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cn("size-9 rounded-lg text-white flex items-center justify-center shadow-brand-sm shrink-0", tone)}>
        {icone}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-fg leading-tight">{nome}</p>
        <p className="font-mono text-[10px] text-fg-muted leading-tight truncate">{endereco}</p>
      </div>
    </div>
  );
}
