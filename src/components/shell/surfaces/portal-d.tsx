"use client";

// Superfície D — Portal do Subcontratado (accountType: subcontractor_admin).
// Tenant-lite, escopado SÓ à empresa dele. Fase 2 no corte de MVP (§7): stub
// rotulado agora, self-service funcional depois.

import { useState } from "react";
import { Building2, IdCard, Container, GraduationCap, Share2, AlertCircle, Lock } from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "empresa", label: "Minha empresa", icon: Building2 },
  { id: "motoristas", label: "Meus motoristas autorizados", icon: IdCard },
  { id: "veiculos", label: "Meus veículos / implementos", icon: Container },
  { id: "treinamento", label: "Treinamento", icon: GraduationCap },
  { id: "viagens", label: "Viagens compartilhadas comigo", icon: Share2 },
  { id: "pendencias", label: "Pendências", icon: AlertCircle },
] as const;

export function PortalD() {
  const [aba, setAba] = useState<(typeof NAV)[number]["id"]>("empresa");
  return (
    <div className="flex min-h-screen bg-[hsl(200_20%_96%)]">
      <aside className="hidden md:flex h-screen w-[250px] shrink-0 flex-col bg-white border-r border-[hsl(200_18%_88%)] sticky top-0">
        <div className="px-5 pt-5 pb-4 border-b border-[hsl(200_18%_92%)]">
          <TraxiumLogo />
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(200_70%_35%)] font-bold">
            Portal do subcontratado
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
                  active
                    ? "bg-[hsl(174_64%_96%)] text-[hsl(195_30%_15%)]"
                    : "text-[hsl(210_14%_40%)] hover:bg-[hsl(200_18%_95%)]"
                )}
              >
                <Icon className={cn("size-[15px] shrink-0", active ? "text-[hsl(176_84%_30%)]" : "text-[hsl(210_12%_55%)]")} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[hsl(200_18%_92%)] text-[10px] text-[hsl(210_14%_50%)]">
          Escopo: só a sua empresa
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-[60px] border-b border-[hsl(200_18%_88%)] bg-white/80 backdrop-blur-xl">
          <div className="flex h-full items-center gap-3 px-6">
            <p className="text-[13px] font-semibold">Souza Transportes</p>
            <span className="rounded-full bg-[hsl(200_18%_92%)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(210_14%_42%)]">
              Fase 2 · prévia
            </span>
            <div className="ml-auto">
              <SurfacePerfilMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-screen-lg w-full mx-auto">
          <div className="rounded-xl border border-dashed border-[hsl(200_18%_82%)] bg-white p-10 text-center">
            <div className="mx-auto size-12 rounded-xl bg-[hsl(200_18%_94%)] flex items-center justify-center text-[hsl(210_14%_45%)]">
              <Lock className="size-6" />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[hsl(200_25%_22%)]">
              {NAV.find((n) => n.id === aba)?.label}
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-relaxed text-[hsl(210_14%_45%)]">
              Portal self-service do subcontratado — cadastrar certificado GMP+, motoristas autorizados e veículos,
              comprovar treinamento e ver viagens compartilhadas. Escopado só à própria empresa (não vê a operação
              do contratante nem outros subcontratados). Entra funcional na Fase 2.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
