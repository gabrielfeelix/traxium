import { cn } from "@/lib/utils";
import type { Regime } from "@/lib/domain/model";

/**
 * Kit de regime — vocabulário visual compartilhado da escada de limpeza A→D.
 * Fonte única para disco, nome e método; consumido pela Matriz IDTF, pela
 * Cadeia de proveniência e (progressivamente) pelo restante do sistema.
 * Cores 100% via token `regime-*` — nenhum HSL inline.
 */
export const REGIME_META: Record<
  Regime,
  { nome: string; metodo: string; disc: string; ring: string }
> = {
  A: { nome: "Seco", metodo: "Varrição e aspiração", disc: "bg-regime-a text-white", ring: "ring-regime-a" },
  B: { nome: "Água", metodo: "Lavagem com água", disc: "bg-regime-b text-fg", ring: "ring-regime-b" },
  C: { nome: "Detergente", metodo: "Detergente + enxágue", disc: "bg-regime-c text-fg", ring: "ring-regime-c" },
  D: { nome: "Desinfecção", metodo: "Desinfecção validada", disc: "bg-regime-d text-white", ring: "ring-regime-d" },
};

export const REGIMES: Regime[] = ["A", "B", "C", "D"];

/** Disco do regime — a letra em cor de token. `className` controla tamanho. */
export function RegimeDisc({ regime, className }: { regime: Regime; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-lg flex items-center justify-center font-bold shrink-0",
        REGIME_META[regime].disc,
        className
      )}
    >
      {regime}
    </span>
  );
}
