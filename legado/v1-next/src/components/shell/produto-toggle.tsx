"use client";

// Eixo de ESCOPO no header: MVP (5 pilares) ⇄ Solução completa.
// Segmented control — o ativo usa o gradiente da marca (momento-chave, DESIGN §12).
// Trocar re-agrupa a sidebar e re-escopa a home; persistido no store (localStorage).

import { useSession, type ProdutoModo } from "@/lib/store/session";
import { cn } from "@/lib/utils";

const OPCOES: { modo: ProdutoModo; label: string }[] = [
  { modo: "mvp", label: "MVP" },
  { modo: "completa", label: "Solução completa" },
];

export function ProdutoToggle() {
  const { produto, setProduto } = useSession();
  return (
    <div className="hidden md:inline-flex shrink-0 items-center gap-2">
      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] hidden xl:inline">
        Escopo
      </span>
      <div
        role="radiogroup"
        aria-label="Escopo do produto"
        className="inline-flex items-center rounded-lg border border-[hsl(200_18%_88%)] bg-[hsl(180_14%_98%)] p-0.5 shadow-brand-sm"
      >
        {OPCOES.map((o) => {
          const ativo = produto === o.modo;
          return (
            <button
              key={o.modo}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => setProduto(o.modo)}
              className={cn(
                "relative h-7 rounded-md px-3 text-[12px] font-semibold transition-all",
                ativo
                  ? "bg-brand-grad text-white shadow-brand-sm"
                  : "text-[hsl(210_14%_42%)] hover:text-[hsl(180_80%_18%)]"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
