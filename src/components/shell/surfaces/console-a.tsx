"use client";

// Superfície A — Console Traxium (accountType: traxium_admin). Objeto primário é o
// CLIENTE, não o dado do cliente. Nav própria; NÃO opera o sistema — toca telas
// operacionais só via impersonation (§4). MVP mínimo; expandido em T6.

import { useState } from "react";
import {
  Building2,
  Receipt,
  Boxes,
  Users,
  LifeBuoy,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TraxiumLogo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { useSession } from "@/lib/store/session";
import { tenants } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "tenants", label: "Tenants", icon: Building2 },
  { id: "faturamento", label: "Faturamento", icon: Receipt },
  { id: "idtf", label: "IDTF Global", icon: Boxes },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "suporte", label: "Suporte / Impersonar", icon: LifeBuoy },
  { id: "metricas", label: "Métricas", icon: BarChart3 },
] as const;

export function ConsoleA() {
  const router = useRouter();
  const { impersonar } = useSession();
  const [aba, setAba] = useState<(typeof NAV)[number]["id"]>("tenants");

  const entrarComo = (id: string, name: string) => {
    impersonar(id, name);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[hsl(200_20%_96%)]">
      {/* Nav própria do Console */}
      <aside className="hidden md:flex h-screen w-[240px] shrink-0 flex-col bg-[hsl(202_45%_10%)] text-white sticky top-0">
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.08]">
          <TraxiumLogo variant="light" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[hsl(176_84%_60%)] font-bold">
            Console · Plataforma
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
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all",
                  active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon className={cn("size-[15px]", active ? "text-[hsl(176_84%_60%)]" : "text-white/50")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.08] text-[10px] text-white/40">
          Cross-tenant · todos os clientes
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar do Console */}
        <header className="sticky top-0 z-20 h-[60px] border-b border-[hsl(200_18%_88%)] bg-white/80 backdrop-blur-xl">
          <div className="flex h-full items-center gap-3 px-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_45%)] font-bold">
                Console Traxium
              </p>
              <p className="text-[13px] font-semibold leading-tight">Saúde da plataforma</p>
            </div>
            <div className="ml-auto">
              <SurfacePerfilMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-screen-xl w-full mx-auto space-y-6">
          {aba === "tenants" || aba === "suporte" ? (
            <>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold tracking-[-0.01em]">Tenants</h1>
                <Badge variant="outline">{tenants.length} clientes</Badge>
              </div>
              <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">
                O Console não opera o sistema. Para tocar telas operacionais de um cliente, entre por impersonation —
                tudo fica registrado com o ator real.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {tenants.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-xs">
                        {t.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-[14px] truncate">{t.name}</p>
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4">{t.plano}</Badge>
                        </div>
                        <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5">
                          {t.cidade}/{t.uf} · {t.caminhoes} caminhões · {t.motoristas} motoristas
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                          {t.certificacaoGMP && (
                            <span className="inline-flex items-center gap-1 text-[hsl(142_60%_32%)]">
                              <ShieldCheck className="size-3" /> GMP+
                            </span>
                          )}
                          {t.certificacaoEUDR && (
                            <span className="inline-flex items-center gap-1 text-[hsl(200_70%_35%)]">
                              <ShieldCheck className="size-3" /> EUDR
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => entrarComo(t.id, t.name)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[hsl(202_45%_12%)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[hsl(202_45%_18%)] transition-colors"
                    >
                      Entrar como {t.name} <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[hsl(200_18%_82%)] bg-white p-10 text-center">
              <p className="text-[14px] font-semibold text-[hsl(200_25%_25%)]">
                {NAV.find((n) => n.id === aba)?.label}
              </p>
              <p className="mt-1 text-[12px] text-[hsl(210_14%_45%)]">
                Superfície do Console · conteúdo detalhado em T6 (faturamento, IDTF global, usuários, métricas).
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
