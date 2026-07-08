"use client";

// Superfície C — App de campo (tenant_user + papel de campo). "O sistema muda
// inteiramente": sem sidebar, sem back-office, sem desktop. O papel decide o app:
//   motorista → fluxo do §2·C1 (viagem → checklist → foto → limpeza → assinatura → sync)
//   inspetor  → fluxo do §2·C2 (fila → LCI tri-state + 6 ângulos → aprovar/reprovar → NC)
// Ambos são full-screen e reusam a base de /mobile (MotoristaFlow) e /checklists.

import { MotoristaFlow } from "@/app/(app)/mobile/page";
import { InspetorFlow } from "@/components/mobile/inspetor-flow";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { useSession } from "@/lib/store/session";

export function AppCampo() {
  const { papel } = useSession();
  const inspetor = papel === "inspetor";
  return (
    // h-[100dvh] (altura DEFINIDA, não min-h) para o `h-full` das telas resolver.
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[hsl(202_45%_9%)]">
      {/* Faixa de demo (num app real não existe) — deixa você "virar" outro perfil e voltar. */}
      <div className="mx-auto flex h-11 w-full max-w-[440px] shrink-0 items-center justify-between px-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
          Traxium · App de campo
        </span>
        <SurfacePerfilMenu tone="dark" />
      </div>
      <div className="min-h-0 flex-1">{inspetor ? <InspetorFlow /> : <MotoristaFlow />}</div>
    </div>
  );
}
