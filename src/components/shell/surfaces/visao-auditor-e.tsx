"use client";

// Superfície E — Visão do Auditor externo (accountType: auditor). SOMENTE LEITURA,
// só a amostra liberada, nada de terceiro (LGPD). No MVP real isto é export-only
// (Q05) — o login read-only é prévia de Fase 2 (§7), mostrado como visão rotulada.

import { useState } from "react";
import { FileSearch, FileCheck2, Lock, Eye } from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "amostra", label: "Amostra de viagens", icon: FileSearch },
  { id: "dossie", label: "Dossiê", icon: FileCheck2 },
  { id: "evidencias", label: "Evidências travadas", icon: Lock },
] as const;

export function VisaoAuditorE() {
  const [aba, setAba] = useState<(typeof NAV)[number]["id"]>("amostra");
  return (
    <div className="flex min-h-screen flex-col bg-[hsl(200_20%_96%)]">
      {/* Banner fixo obrigatório (§2 · E1). */}
      <div className="flex items-center gap-2 bg-[hsl(202_45%_12%)] px-6 py-2 text-white">
        <Eye className="size-4 shrink-0 text-[hsl(176_84%_60%)]" />
        <p className="text-[12px] font-semibold tracking-wide">
          SOMENTE LEITURA · amostra liberada — reconstrução da decisão, nada fora da amostra.
        </p>
        <div className="ml-auto">
          <SurfacePerfilMenu tone="dark" />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex h-[calc(100vh-40px)] w-[240px] shrink-0 flex-col bg-white border-r border-[hsl(200_18%_88%)] sticky top-0">
          <div className="px-5 pt-5 pb-4 border-b border-[hsl(200_18%_92%)]">
            <TraxiumLogo />
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_45%)] font-bold">
              Visão do auditor
            </p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-px">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = aba === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAba(item.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-left transition-all",
                    active ? "bg-[hsl(200_18%_94%)] text-[hsl(195_30%_15%)]" : "text-[hsl(210_14%_40%)] hover:bg-[hsl(200_18%_95%)]"
                  )}
                >
                  <Icon className={cn("size-[15px] shrink-0", active ? "text-[hsl(202_45%_25%)]" : "text-[hsl(210_12%_55%)]")} />
                  {item.label}
                  <span className="ml-auto text-[9px] font-bold uppercase text-[hsl(210_14%_55%)]">R</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-6 max-w-screen-lg w-full mx-auto">
          <div className="rounded-xl border border-dashed border-[hsl(200_18%_82%)] bg-white p-10 text-center">
            <div className="mx-auto size-12 rounded-xl bg-[hsl(200_18%_94%)] flex items-center justify-center text-[hsl(210_14%_45%)]">
              <Eye className="size-6" />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[hsl(200_25%_22%)]">
              {NAV.find((n) => n.id === aba)?.label}
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-relaxed text-[hsl(210_14%_45%)]">
              Visão somente-leitura para o auditor externo reconstruir a decisão da amostra: viagens, dossiê e
              evidências travadas (foto + geo + hash). Nada de edição, nada fora da amostra. No MVP real, o caminho
              é export-only; o login read-only entra na Fase 2.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
