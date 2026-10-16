"use client";

// Seletor "Entrar como…" — o mecanismo de 2 níveis do §6:
//   nível 1 = accountType (grupo)  ·  nível 2 = papel (item)
// Escolher um perfil aplica (accountType, papel, master) no store e roteia para "/".
// O SurfaceShell (T3) é quem, a partir de `surface`, renderiza a superfície certa —
// então escolher "Motorista" aqui já sai do back-office e cai no App.

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/store/session";
import {
  PERFIL_POR_ID,
  deriveSurface,
  type PerfilDemoId,
  type Surface,
} from "@/lib/domain/model";
import { cn } from "@/lib/utils";

export const GRUPOS_PERFIL: { titulo: string; ids: PerfilDemoId[] }[] = [
  { titulo: "Apresentação", ids: ["master"] },
  { titulo: "Plataforma Traxium", ids: ["traxium_admin"] },
  {
    titulo: "Tenant · Escritório",
    ids: ["gestor", "despachante", "diretoria", "admin_sub", "auditor_interno"],
  },
  { titulo: "Tenant · Campo (App)", ids: ["motorista", "inspetor"] },
  { titulo: "Externos", ids: ["subcontratado", "auditor_externo"] },
];

/** Superfície-alvo de um perfil (master aparece como "tudo"). */
function surfaceDe(id: PerfilDemoId): Surface {
  const p = PERFIL_POR_ID[id];
  return deriveSurface(p.accountType, p.papel);
}

const SURFACE_TAG: Record<Surface, string> = { A: "A", B: "B", C: "C", D: "D", E: "E" };

function useEscolherPerfil() {
  const router = useRouter();
  const { aplicarPerfil } = useSession();
  return (id: PerfilDemoId) => {
    aplicarPerfil(id);
    router.push("/");
  };
}

function SurfaceChip({ id }: { id: PerfilDemoId }) {
  const p = PERFIL_POR_ID[id];
  const tag = p.isMaster ? "★" : SURFACE_TAG[surfaceDe(id)];
  return (
    <span
      className={cn(
        "ml-auto inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold",
        p.isMaster
          ? "bg-[hsl(38_92%_50%)] text-white"
          : "bg-[hsl(200_18%_90%)] text-[hsl(200_25%_30%)]"
      )}
      title={`Superfície ${p.isMaster ? "todas" : surfaceDe(id)}`}
    >
      {tag}
    </span>
  );
}

// ── Variante topbar: itens de um DropdownMenu já aberto ─────────────────────────
export function PerfilSwitcherMenuItems() {
  const { perfilId } = useSession();
  const escolher = useEscolherPerfil();
  return (
    <>
      {GRUPOS_PERFIL.map((g, gi) => (
        <div key={g.titulo}>
          {gi > 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-[hsl(210_14%_42%)]">
            {g.titulo}
          </DropdownMenuLabel>
          {g.ids.map((id) => {
            const p = PERFIL_POR_ID[id];
            const active = perfilId === id;
            return (
              <DropdownMenuItem
                key={id}
                onClick={() => escolher(id)}
                className={cn(active && "bg-[hsl(174_64%_96%)]")}
              >
                <Check
                  className={cn(
                    "size-4",
                    active ? "opacity-100 text-[hsl(176_84%_25%)]" : "opacity-0"
                  )}
                />
                <span className="flex-1 truncate">{p.label}</span>
                <SurfaceChip id={id} />
              </DropdownMenuItem>
            );
          })}
        </div>
      ))}
    </>
  );
}

// ── Variante login: lista clicável agrupada ─────────────────────────────────────
export function PerfilSwitcherLogin() {
  const { perfilId } = useSession();
  const escolher = useEscolherPerfil();
  return (
    <div className="space-y-3">
      {GRUPOS_PERFIL.map((g) => (
        <div key={g.titulo}>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(210_14%_50%)]">
            {g.titulo}
          </p>
          <div className="space-y-1">
            {g.ids.map((id) => {
              const p = PERFIL_POR_ID[id];
              const active = perfilId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => escolher(id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all",
                    active
                      ? "border-[hsl(176_60%_55%)] bg-[hsl(174_64%_96%)] shadow-brand-sm"
                      : "border-[hsl(200_18%_90%)] bg-white hover:border-[hsl(176_60%_60%)] hover:shadow-brand-sm"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-tight text-[hsl(195_30%_12%)]">
                      {p.label}
                    </p>
                    <p className="truncate text-[11px] text-[hsl(210_14%_42%)]">
                      {p.pessoa} · {p.descricao}
                    </p>
                  </div>
                  {p.fase2 && (
                    <span className="shrink-0 rounded-full bg-[hsl(200_18%_92%)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[hsl(210_14%_45%)]">
                      Fase 2
                    </span>
                  )}
                  <SurfaceChip id={id} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
