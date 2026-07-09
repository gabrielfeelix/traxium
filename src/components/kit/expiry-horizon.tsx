"use client";

import { cn, formatDate } from "@/lib/utils";

/**
 * Dispositivo do kit: horizonte de vencimento — eixo de tempo com as zonas
 * regulatórias (≤15d crítico · ≤30d alto · ≤60d alerta) como faixas de fundo
 * e cada item como barra countdown hoje→validade. Serve Subcontratados,
 * Motoristas e Documentos (handoff §3). Nível vem de nivelVencimento no
 * motor — o dispositivo só posiciona, nunca recalcula.
 */

export type HorizonNivel = "vencido" | "critico" | "alto" | "alerta" | "ok";

export type HorizonItem = {
  id: string;
  rotulo: string;
  /** Linha secundária (ex.: nº do certificado) — monoespaçada. */
  sublabel?: string;
  validade: string;
  dias: number;
  nivel: HorizonNivel;
};

// Janela do eixo: 20 dias de passado (vencidos) até 90 dias de futuro.
const MIN = -20;
const MAX = 90;
const pct = (d: number) => ((Math.min(Math.max(d, MIN), MAX) - MIN) / (MAX - MIN)) * 100;

const NIVEL_META: Record<HorizonNivel, { dot: string; bar: string; txt: string; legenda: string }> = {
  vencido: { dot: "bg-danger-500", bar: "bg-danger-500", txt: "text-danger-700", legenda: "Vencido" },
  critico: { dot: "bg-danger-500", bar: "bg-danger-500/80", txt: "text-danger-700", legenda: "≤15d" },
  alto: { dot: "bg-warning-500", bar: "bg-warning-500/80", txt: "text-warning-700", legenda: "≤30d" },
  alerta: { dot: "bg-warning-500", bar: "bg-warning-500/50", txt: "text-warning-700", legenda: "≤60d" },
  ok: { dot: "bg-success-500", bar: "bg-success-500/40", txt: "text-success-700", legenda: "Válido" },
};

const ZONAS = [
  { de: MIN, ate: 0, cls: "bg-danger-50" },
  { de: 0, ate: 15, cls: "bg-danger-50/50" },
  { de: 15, ate: 30, cls: "bg-warning-50" },
  { de: 30, ate: 60, cls: "bg-warning-50/50" },
];

const TICKS = [
  { d: 0, rotulo: "hoje", forte: true },
  { d: 15, rotulo: "15d", forte: false },
  { d: 30, rotulo: "30d", forte: false },
  { d: 60, rotulo: "60d", forte: true },
];

const GRID = "grid grid-cols-[minmax(110px,170px)_1fr_64px] items-center gap-3";

export function ExpiryHorizon({
  titulo,
  descricao,
  items,
  selectedId,
  onSelect,
}: {
  titulo: string;
  descricao: string;
  items: HorizonItem[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}) {
  const ordenados = [...items].sort((a, b) => a.dias - b.dias);

  return (
    <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{titulo}</h2>
      <p className="text-[12px] text-fg-muted leading-snug mt-0.5 mb-4 max-w-2xl">{descricao}</p>

      {/* Régua: rótulos dos marcos alinhados à coluna do eixo */}
      <div className={cn(GRID, "mb-1")} aria-hidden>
        <span />
        <div className="relative h-4">
          {TICKS.map((t) => (
            <span
              key={t.d}
              className={cn(
                "absolute -translate-x-1/2 text-[8px] uppercase tracking-[0.1em] whitespace-nowrap",
                t.forte ? "font-bold text-fg-muted" : "text-fg-soft"
              )}
              style={{ left: `${pct(t.d)}%` }}
            >
              {t.rotulo}
            </span>
          ))}
        </div>
        <span className="text-[8px] uppercase tracking-[0.1em] text-fg-soft text-right">restam</span>
      </div>

      <div className="space-y-0.5">
        {ordenados.map((item) => {
          const M = NIVEL_META[item.nivel];
          const selecionado = selectedId === item.id;
          const p0 = pct(0);
          const p1 = pct(item.dias);
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selecionado}
              aria-label={`${item.rotulo} — vence em ${formatDate(item.validade)}`}
              onClick={() => onSelect?.(selecionado ? null : item.id)}
              className={cn(
                GRID,
                "w-full rounded-md px-2 py-1.5 text-left transition-colors",
                selecionado ? "bg-brand-50 ring-1 ring-brand-500/40" : "hover:bg-bg"
              )}
            >
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-fg leading-tight truncate">{item.rotulo}</p>
                {item.sublabel && (
                  <p className="text-[10px] text-fg-soft font-mono leading-tight truncate">{item.sublabel}</p>
                )}
              </div>

              <div className="relative h-6 min-w-0">
                {ZONAS.map((z) => (
                  <span
                    key={z.de}
                    className={cn("absolute inset-y-0", z.cls)}
                    style={{ left: `${pct(z.de)}%`, width: `${pct(z.ate) - pct(z.de)}%` }}
                  />
                ))}
                {TICKS.map((t) => (
                  <span
                    key={t.d}
                    className={cn("absolute inset-y-0 border-l", t.forte ? "border-fg-soft/40" : "border-border-soft")}
                    style={{ left: `${pct(t.d)}%` }}
                  />
                ))}
                <span
                  className={cn("absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full", M.bar)}
                  style={{ left: `${Math.min(p0, p1)}%`, width: `${Math.abs(p1 - p0)}%` }}
                />
                <span
                  className={cn("absolute top-1/2 -translate-y-1/2 -ml-[5px] size-2.5 rounded-full ring-2 ring-bg-elev", M.dot)}
                  style={{ left: `${p1}%` }}
                />
              </div>

              <p className={cn("text-[11px] font-bold num text-right leading-tight", M.txt)}>
                {item.nivel === "vencido" ? `há ${Math.abs(item.dias)}d` : `${item.dias}d`}
                <span className="block text-[9px] font-medium text-fg-soft num">{formatDate(item.validade)}</span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Legenda: cor + rótulo (nunca só cor) */}
      <div className="flex items-center gap-3 flex-wrap mt-3 pt-3 border-t border-border-soft">
        {(Object.keys(NIVEL_META) as HorizonNivel[]).map((n) => (
          <span key={n} className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-fg-muted">
            <span className={cn("size-2 rounded-full", NIVEL_META[n].dot, n === "alerta" && "opacity-60", n === "ok" && "opacity-50")} />
            {NIVEL_META[n].legenda}
          </span>
        ))}
      </div>
    </section>
  );
}
