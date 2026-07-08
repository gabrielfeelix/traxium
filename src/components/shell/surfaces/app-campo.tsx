"use client";

// Superfície C — App de campo (tenant_user + papel de campo). "O sistema muda
// inteiramente": sem sidebar, sem back-office, sem desktop. Motorista e Inspetor.
// Este é o esqueleto full-screen; o fluxo real (checklist/foto/limpeza/assinatura/
// sync · inspeção LCI) entra em T5, reusando a base de /mobile.

import { Truck, ClipboardCheck } from "lucide-react";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { useSession } from "@/lib/store/session";
import { PERFIL_POR_ID } from "@/lib/domain/model";

export function AppCampo() {
  const { papel, perfilId } = useSession();
  const inspetor = papel === "inspetor";
  const Icon = inspetor ? ClipboardCheck : Truck;
  return (
    <div className="min-h-screen bg-[hsl(202_45%_10%)] text-white flex flex-col">
      {/* Controle de demo pra sair do fluxo / trocar de perfil. Num app real não existe. */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-[10px] uppercase tracking-[0.16em] text-white/40 font-bold">
          Traxium · App de campo
        </span>
        <SurfacePerfilMenu tone="dark" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="size-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[hsl(176_84%_60%)]">
          <Icon className="size-8" />
        </div>
        <h1 className="mt-5 text-[24px] font-bold tracking-[-0.01em]">
          {inspetor ? "Aguardando inspeção" : "Minha próxima viagem"}
        </h1>
        <p className="mt-2 max-w-xs text-[13px] text-white/60 leading-relaxed">
          {PERFIL_POR_ID[perfilId].label} · esta é a superfície C. Sem sidebar, sem back-office.
        </p>
        <p className="mt-6 rounded-lg border border-dashed border-white/15 px-4 py-2 text-[11px] text-white/45">
          Fluxo operável completo entra em T5.
        </p>
      </div>
    </div>
  );
}
