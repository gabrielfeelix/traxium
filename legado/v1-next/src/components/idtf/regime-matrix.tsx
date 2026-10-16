"use client";

import { Ban, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { REGIME_META, REGIMES, RegimeDisc } from "@/components/kit/regime";
import type { ProdutoIDTF, Regime } from "@/lib/domain/model";

/**
 * Momento-assinatura da página IDTF: a escada de sequenciamento.
 * Duas dimensões cruzadas num só desenho —
 *   coluna  = regime mínimo de limpeza exigido (severidade A → D)
 *   overlay = risco EUDR (folha) e bloqueio de feed (proibido, anel vermelho).
 * Vocabulário de regime vem do kit compartilhado (`@/components/kit/regime`).
 */

const eudrTone: Record<string, string> = {
  Alto: "bg-danger-50 text-danger-700",
  Médio: "bg-warning-50 text-warning-700",
  Baixo: "bg-success-50 text-success-700",
};

interface RegimeMatrixProps {
  /** Somente produtos classificados — a fila de classificação não tem regime firme. */
  produtos: ProdutoIDTF[];
  selected: Regime | null;
  onSelect: (r: Regime | null) => void;
}

export function RegimeMatrix({ produtos, selected, onSelect }: RegimeMatrixProps) {
  return (
    <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Matriz de sequenciamento</h2>
          <p className="text-[12px] text-fg-muted leading-snug mt-0.5 max-w-lg">
            Se a <strong className="text-fg">carga anterior</strong> foi um destes, o compartimento exige no
            mínimo este regime de limpeza antes de carregar feed.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-fg-muted shrink-0">
          <span className="inline-flex items-center gap-1">
            <Leaf className="size-3 text-warning-700" /> risco EUDR
          </span>
          <span className="inline-flex items-center gap-1">
            <Ban className="size-3 text-danger-700" /> bloqueia feed
          </span>
        </div>
      </div>

      {/* Régua de intensidade — a "graça" editorial: mostra a escada crescente */}
      <div className="px-5">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] font-semibold text-fg-soft mb-1.5">
          <span>Menor severidade</span>
          <span>Maior severidade</span>
        </div>
        <div
          className="h-1.5 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-regime-a), var(--color-regime-b), var(--color-regime-c), var(--color-regime-d))",
          }}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 pt-4">
        {REGIMES.map((key) => {
          const meta = REGIME_META[key];
          const itens = produtos.filter((p) => p.regimeAntesDeFeed === key);
          const isSel = selected === key;
          return (
            <div
              key={key}
              className={cn(
                "rounded-lg border transition-all",
                isSel ? cn("border-transparent ring-2", meta.ring) : "border-border-soft"
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(isSel ? null : key)}
                aria-pressed={isSel}
                aria-label={`Filtrar por regime ${key} — ${meta.nome}`}
                className="w-full flex items-center gap-2.5 px-3 pt-3 pb-2.5 text-left rounded-t-lg hover:bg-bg transition-colors"
              >
                <RegimeDisc regime={key} className="size-9 text-[15px]" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-fg truncate">{meta.nome}</span>
                    <span className="num text-[10px] font-semibold text-fg-soft">{itens.length}</span>
                  </span>
                  <span className="block text-[10px] text-fg-muted leading-tight truncate">{meta.metodo}</span>
                </span>
              </button>

              <div className="px-2.5 pb-2.5 pt-0.5 space-y-1.5 min-h-[3.5rem]">
                {itens.length === 0 ? (
                  <p className="text-[10px] text-fg-soft italic px-1 py-2">— nenhuma carga —</p>
                ) : (
                  itens.map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        "rounded-md bg-bg-elev px-2 py-1.5 border",
                        p.bloqueiaFeed ? "border-danger-500/40 ring-1 ring-danger-500/20" : "border-border-soft"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-medium text-fg leading-tight flex-1 min-w-0 truncate">
                          {p.nomeCanonico}
                        </span>
                        {p.riscoEUDR !== "N/A" && (
                          <span
                            className={cn(
                              "inline-flex items-center justify-center rounded-full size-4 shrink-0",
                              eudrTone[p.riscoEUDR] ?? ""
                            )}
                            title={`Risco EUDR: ${p.riscoEUDR}`}
                          >
                            <Leaf className="size-2.5" />
                          </span>
                        )}
                        {p.bloqueiaFeed && <Ban className="size-3 text-danger-700 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {p.idtfCode && <span className="font-mono text-[9px] text-fg-soft">{p.idtfCode}</span>}
                        {p.bloqueiaFeed && (
                          <span className="text-[9px] font-semibold text-danger-700">liberação formal</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
