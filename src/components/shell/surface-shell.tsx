"use client";

// Roteamento por SUPERFÍCIE (PLANO-PERFIS §3/§9). Lê `surface` do store e escolhe
// o chrome inteiro — não é "esconder abas", é trocar de aplicação:
//   B → back-office (sidebar + topbar)   · C → App de campo (sem chrome desktop)
//   A → Console Traxium                  · D → Portal do subcontratado
//   E → Visão do auditor (somente leitura)
// A/C/D/E ignoram `children` (rotas do back-office) e renderizam a própria superfície.

import { useRouter } from "next/navigation";
import { ShieldAlert, Sparkles, X } from "lucide-react";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { useSession } from "@/lib/store/session";
import { AppCampo } from "@/components/shell/surfaces/app-campo";
import { ConsoleA } from "@/components/shell/surfaces/console-a";
import { PortalD } from "@/components/shell/surfaces/portal-d";
import { VisaoAuditorE } from "@/components/shell/surfaces/visao-auditor-e";

export function SurfaceShell({ children }: { children: React.ReactNode }) {
  const { surface } = useSession();
  if (surface === "C") return <AppCampo />;
  if (surface === "A") return <ConsoleA />;
  if (surface === "D") return <PortalD />;
  if (surface === "E") return <VisaoAuditorE />;
  return <BackOfficeShell>{children}</BackOfficeShell>;
}

function BackOfficeShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { impersonating, isMaster, sairImpersonation } = useSession();
  return (
    <div className="flex min-h-screen bg-[hsl(180_14%_97%)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Banner de impersonation (§4) — o ator real é sempre visível. */}
        {impersonating && (
          <div className="flex items-center gap-3 border-b border-[hsl(28_80%_60%)] bg-[hsl(38_92%_94%)] px-6 py-2 text-[hsl(28_70%_28%)]">
            <ShieldAlert className="size-4 shrink-0" />
            <p className="text-[12px] font-medium leading-tight">
              Você é <strong>Traxium</strong> operando como{" "}
              <strong>{impersonating.tenantName}</strong> · tudo registrado (ator real logado).
            </p>
            <button
              onClick={() => {
                sairImpersonation();
                router.push("/");
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-[hsl(28_60%_65%)] bg-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[hsl(38_92%_97%)]"
            >
              <X className="size-3" /> Sair da impersonation
            </button>
          </div>
        )}

        {/* Rótulo do modo apresentação (§2 · A0) — sempre visível quando Master. */}
        {isMaster && !impersonating && (
          <div className="flex items-center gap-2 border-b border-[hsl(38_80%_70%)] bg-[hsl(45_92%_95%)] px-6 py-1.5 text-[hsl(38_70%_30%)]">
            <Sparkles className="size-3.5 shrink-0" />
            <p className="text-[11px] font-semibold leading-tight">
              Modo apresentação — tudo liberado. Não é papel de produção.
            </p>
          </div>
        )}

        <main className="flex-1 px-6 py-6 max-w-screen-2xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
