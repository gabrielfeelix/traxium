"use client";

// Empty-state (DESIGN §13) quando o usuário acessa, no modo MVP, uma rota que só
// existe na Solução completa. Não é 404 nem botão morto: explica o escopo e oferece
// a troca. O nome do módulo vem da nav; aqui mostramos o rótulo amigável do pathname.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/store/session";

const ROTULO: Record<string, string> = {
  "/fazendas": "Fazendas e polígonos",
  "/lotes": "Lotes e DDS",
  "/traces": "Gateway TRACES NT",
  "/auditoria": "Auditoria",
  "/conformidade": "Conformidade",
  "/documentos": "Documentos",
  "/atividade": "Atividade",
};

export function EscopoCompletaGate() {
  const pathname = usePathname();
  const { setProduto } = useSession();
  const nome =
    Object.entries(ROTULO).find(([h]) => pathname === h || pathname.startsWith(h + "/"))?.[1] ??
    "Este módulo";

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-[hsl(200_18%_88%)] bg-white shadow-brand-sm">
          <Layers className="size-6 text-[hsl(176_84%_25%)]" />
        </div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(210_14%_45%)]">
          Fora do escopo do MVP
        </p>
        <h1 className="text-[20px] font-bold tracking-[-0.01em] text-[hsl(200_25%_12%)]">
          {nome} está na Solução completa
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[hsl(210_14%_42%)]">
          O MVP concentra os cinco pilares que decidem se a carga pode seguir. Este
          módulo faz parte da entrega completa. Ative a Solução completa para acessá-lo.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <Button variant="gradient" onClick={() => setProduto("completa")}>
            Ativar Solução completa
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <LayoutDashboard className="size-4" />
              Torre de Controle
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
