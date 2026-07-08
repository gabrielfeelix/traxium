"use client";

// Superfície A — Console Traxium (accountType: traxium_admin). Objeto primário é o
// CLIENTE, não o dado do cliente. Nav própria; NÃO opera o sistema — toca telas
// operacionais só via impersonation (§4). MVP: tenants + faturamento + IDTF global +
// usuários + métricas; cria tenant sandbox para test users (§6).

import { useState } from "react";
import { StatTile } from "@/components/kit/stat-tile";
import {
  Building2,
  Receipt,
  Boxes,
  Users,
  LifeBuoy,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Plus,
  UploadCloud,
  FlaskConical,
  Truck,
  AlertOctagon,
  Gavel,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { TraxiumLogo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { useToast } from "@/components/ui/toast";
import { useSession } from "@/lib/store/session";
import { tenants, viagens, naoConformidades } from "@/lib/mock-data";
import { produtosIDTF, excecoes, VERSAO_BASE_IDTF, PERFIS_DEMO } from "@/lib/domain/model";
import { cn } from "@/lib/utils";

type Aba = "tenants" | "faturamento" | "idtf" | "usuarios" | "suporte" | "metricas";

const NAV: { id: Aba; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "metricas", label: "Métricas", icon: BarChart3 },
  { id: "tenants", label: "Tenants", icon: Building2 },
  { id: "faturamento", label: "Faturamento", icon: Receipt },
  { id: "idtf", label: "IDTF Global", icon: Boxes },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "suporte", label: "Suporte / Impersonar", icon: LifeBuoy },
];

const MRR: Record<string, number> = { Enterprise: 12000, Profissional: 6000, Essencial: 2500 };
const iniciais = (n: string) => n.split(" ").slice(0, 2).map((x) => x[0]).join("").toUpperCase();

export function ConsoleA() {
  const router = useRouter();
  const { impersonar, addTenant, version } = useSession();
  const { toast } = useToast();
  const [aba, setAba] = useState<Aba>("metricas");
  void version; // re-render ao criar tenant

  const entrarComo = (id: string, name: string) => {
    impersonar(id, name);
    router.push("/");
  };
  const criarSandbox = () => {
    const n = tenants.filter((t) => t.sandbox).length + 1;
    const nome = `Sandbox Demo ${n}`;
    addTenant({ name: nome });
    toast("Tenant sandbox criado", { type: "success", desc: `${nome} · semeado e pronto para test users.` });
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
              <p className="text-[13px] font-semibold leading-tight">
                {NAV.find((n) => n.id === aba)?.label}
              </p>
            </div>
            <div className="ml-auto">
              <SurfacePerfilMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 max-w-screen-xl w-full mx-auto space-y-6">
          {aba === "metricas" && <Metricas />}
          {(aba === "tenants" || aba === "suporte") && (
            <TenantsPanel onEntrar={entrarComo} onCriarSandbox={criarSandbox} />
          )}
          {aba === "faturamento" && <Faturamento />}
          {aba === "idtf" && <IDTFGlobal onPublicar={() => toast("Nova versão da base IDTF publicada", { type: "success", desc: "Distribuída para todos os tenants." })} />}
          {aba === "usuarios" && <Usuarios />}
        </main>
      </div>
    </div>
  );
}

function Metricas() {
  const sandbox = tenants.filter((t) => t.sandbox).length;
  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.01em]">Saúde da plataforma</h1>
        <p className="text-[13px] text-[hsl(210_14%_42%)]">Visão cross-tenant · o Console cuida do cliente, não opera o dado dele.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile icon={Building2} label="Tenants" value={tenants.length} hint={`${sandbox} sandbox`} />
        <StatTile icon={Truck} label="Viagens" value={viagens.length} hint="somadas na plataforma" />
        <StatTile icon={AlertOctagon} label="NCs abertas" value={naoConformidades.length} hint="todos os clientes" />
        <StatTile icon={Gavel} label="Exceções pendentes" value={excecoes.filter((e) => e.status === "pendente").length} />
        <StatTile icon={Boxes} label="Produtos IDTF" value={produtosIDTF.length} hint={`${produtosIDTF.filter((p) => p.statusClassificacao === "em_fila").length} em fila`} />
        <StatTile icon={Receipt} label="MRR estimado" value={`R$ ${(tenants.reduce((a, t) => a + (MRR[t.plano] ?? 0), 0) / 1000).toFixed(0)}k`} hint="recorrente/mês" />
      </div>
    </>
  );
}

function TenantsPanel({ onEntrar, onCriarSandbox }: { onEntrar: (id: string, name: string) => void; onCriarSandbox: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold tracking-[-0.01em]">Tenants</h1>
        <Badge variant="outline">{tenants.length} clientes</Badge>
        <button
          onClick={onCriarSandbox}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[hsl(176_60%_55%)] bg-[hsl(174_64%_96%)] px-3 py-1.5 text-[12px] font-semibold text-[hsl(176_84%_22%)] hover:bg-[hsl(174_64%_92%)]"
        >
          <Plus className="size-3.5" /> Criar tenant sandbox
        </button>
      </div>
      <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">
        O Console não opera o sistema. Para tocar telas operacionais de um cliente, entre por impersonation —
        tudo fica registrado com o ator real.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {tenants.map((t) => (
          <div key={t.id} className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-[hsl(176_84%_30%)] to-[hsl(200_92%_28%)] flex items-center justify-center text-white font-bold text-xs">
                {iniciais(t.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-[14px] truncate">{t.name}</p>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 h-4">{t.plano}</Badge>
                  {t.sandbox && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(38_92%_92%)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[hsl(28_70%_35%)]">
                      <FlaskConical className="size-2.5" /> sandbox
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-0.5">
                  {t.cidade}/{t.uf} · {t.caminhoes} caminhões · {t.motoristas} motoristas
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                  {t.certificacaoGMP && (
                    <span className="inline-flex items-center gap-1 text-[hsl(142_60%_32%)]"><ShieldCheck className="size-3" /> GMP+</span>
                  )}
                  {t.certificacaoEUDR && (
                    <span className="inline-flex items-center gap-1 text-[hsl(200_70%_35%)]"><ShieldCheck className="size-3" /> EUDR</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onEntrar(t.id, t.name)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[hsl(202_45%_12%)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[hsl(202_45%_18%)] transition-colors"
            >
              Entrar como {t.name} <ArrowRight className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Faturamento() {
  return (
    <>
      <h1 className="text-[20px] font-bold tracking-[-0.01em]">Faturamento</h1>
      <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">Cobra as transportadoras. Assinatura recorrente por plano.</p>
      <div className="overflow-hidden rounded-xl border border-[hsl(200_18%_88%)] bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-[hsl(200_18%_97%)] text-[hsl(210_14%_42%)]">
            <tr className="text-left">
              <th className="px-4 py-2.5 font-semibold">Cliente</th>
              <th className="px-4 py-2.5 font-semibold">Plano</th>
              <th className="px-4 py-2.5 font-semibold text-right">MRR</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-t border-[hsl(200_18%_92%)]">
                <td className="px-4 py-2.5 font-medium">{t.name}</td>
                <td className="px-4 py-2.5">{t.plano}</td>
                <td className="px-4 py-2.5 text-right num">R$ {(MRR[t.plano] ?? 0).toLocaleString("pt-BR")}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", t.sandbox ? "bg-[hsl(38_92%_92%)] text-[hsl(28_70%_35%)]" : "bg-[hsl(142_65%_94%)] text-[hsl(142_71%_28%)]")}>
                    {t.sandbox ? "Cortesia (sandbox)" : "Em dia"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IDTFGlobal({ onPublicar }: { onPublicar: () => void }) {
  const classificados = produtosIDTF.filter((p) => p.statusClassificacao === "classificado").length;
  const emFila = produtosIDTF.filter((p) => p.statusClassificacao === "em_fila").length;
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold tracking-[-0.01em]">Base IDTF global</h1>
        <Badge variant="outline">{VERSAO_BASE_IDTF}</Badge>
        <button onClick={onPublicar} className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[hsl(202_45%_12%)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[hsl(202_45%_18%)]">
          <UploadCloud className="size-3.5" /> Publicar nova versão
        </button>
      </div>
      <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">
        A Traxium cura a base oficial do GMP+ FSA e publica versões para todos os tenants. Um produto novo classificado aqui vira regra em todo cliente.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile icon={Boxes} label="Produtos na base" value={produtosIDTF.length} />
        <StatTile icon={ShieldCheck} label="Classificados" value={classificados} />
        <StatTile icon={AlertOctagon} label="Em fila (curadoria)" value={emFila} />
      </div>
    </>
  );
}

function Usuarios() {
  // Usuários demo derivados das personas do §2 (visão cross-tenant do Console).
  const usuarios = PERFIS_DEMO.filter((p) => p.accountType === "tenant_user" && !p.isMaster);
  return (
    <>
      <h1 className="text-[20px] font-bold tracking-[-0.01em]">Usuários</h1>
      <p className="text-[13px] text-[hsl(210_14%_42%)] -mt-3">Contas por tenant. O Console provisiona e dá suporte — não usa as telas do cliente.</p>
      <div className="overflow-hidden rounded-xl border border-[hsl(200_18%_88%)] bg-white">
        <table className="w-full text-[13px]">
          <thead className="bg-[hsl(200_18%_97%)] text-[hsl(210_14%_42%)]">
            <tr className="text-left">
              <th className="px-4 py-2.5 font-semibold">Pessoa</th>
              <th className="px-4 py-2.5 font-semibold">Papel</th>
              <th className="px-4 py-2.5 font-semibold">Tenant</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-[hsl(200_18%_92%)]">
                <td className="px-4 py-2.5 font-medium">{u.pessoa}</td>
                <td className="px-4 py-2.5">{u.label}</td>
                <td className="px-4 py-2.5 text-[hsl(210_14%_42%)]">Bom Frete Transportes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
