"use client";

// Superfície E — Visão do Auditor externo (accountType: auditor). SOMENTE LEITURA,
// só a amostra liberada, nada de terceiro (LGPD). Reconstrói a DECISÃO da amostra:
// motor T-3 → checagens → evidências travadas (foto + geo + hash). Nenhuma ação de
// escrita — o objeto é reconstruir, não operar. No MVP real o caminho é export-only
// (Q05); esta é a prévia read-only rotulada (§2·E1, §7).

import { useState } from "react";
import { FileSearch, FileCheck2, Lock, Eye, MapPin, Camera, Hash, WifiOff } from "lucide-react";
import { TraxiumLogo } from "@/components/logo";
import { SurfacePerfilMenu } from "@/components/shell/surface-perfil-menu";
import { viagens } from "@/lib/mock-data";
import {
  compartimentoPorViagem,
  findCompartimento,
  findImplemento,
  limpezasDoCompartimento,
  inspecoesDoCompartimento,
} from "@/lib/domain/model";
import { avaliarCarregamento, type Tier } from "@/lib/domain/rules-engine";
import { formatDateTime, cn } from "@/lib/utils";

// Amostra liberada ao auditor (subconjunto — nunca a base inteira).
const AMOSTRA = viagens.slice(0, 5);

const TIER_UI: Record<Tier, { label: string; cls: string }> = {
  BLOQUEIO: { label: "Bloqueado", cls: "bg-[hsl(0_80%_96%)] text-[hsl(0_70%_40%)] border-[hsl(0_70%_80%)]" },
  ALERTA: { label: "Alerta", cls: "bg-[hsl(38_92%_94%)] text-[hsl(28_70%_35%)] border-[hsl(38_80%_75%)]" },
  LIBERADO: { label: "Liberado", cls: "bg-[hsl(142_65%_95%)] text-[hsl(142_71%_28%)] border-[hsl(142_60%_78%)]" },
};

// Hash determinístico (SSR-safe — sem Date.now/Math.random) para simular a trava de evidência.
function hashCurto(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0);
  return `0x${h.toString(16).padStart(8, "0")}`;
}

export function VisaoAuditorE() {
  const [aba, setAba] = useState<"amostra" | "dossie" | "evidencias">("amostra");
  const [foco, setFoco] = useState<string>(AMOSTRA[0]?.id ?? viagens[0].id);

  const NAV = [
    { id: "amostra" as const, label: "Amostra de viagens", icon: FileSearch },
    { id: "dossie" as const, label: "Dossiê", icon: FileCheck2 },
    { id: "evidencias" as const, label: "Evidências travadas", icon: Lock },
  ];

  const abrir = (id: string, ir: typeof aba = "dossie") => { setFoco(id); setAba(ir); };

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
            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(210_14%_45%)] font-bold">Visão do auditor</p>
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
          <div className="p-3 border-t border-[hsl(200_18%_92%)] text-[10px] text-[hsl(210_14%_50%)]">
            Amostra: {AMOSTRA.length} viagens
          </div>
        </aside>

        <main className="flex-1 px-6 py-6 max-w-screen-lg w-full mx-auto space-y-5">
          {aba === "amostra" && <Amostra onAbrir={abrir} />}
          {aba === "dossie" && <Dossie viagemId={foco} onEvidencias={(id) => abrir(id, "evidencias")} />}
          {aba === "evidencias" && <Evidencias viagemId={foco} />}
        </main>
      </div>
    </div>
  );
}

function TierChip({ tier }: { tier: Tier }) {
  const ui = TIER_UI[tier];
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", ui.cls)}>{ui.label}</span>;
}

function Amostra({ onAbrir }: { onAbrir: (id: string) => void }) {
  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.01em]">Amostra de viagens</h1>
        <p className="text-[13px] text-[hsl(210_14%_42%)]">Selecione uma viagem para reconstruir a decisão. Somente leitura.</p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {AMOSTRA.map((v) => {
          const d = avaliarCarregamento(v.id);
          return (
            <button
              key={v.id}
              onClick={() => onAbrir(v.id)}
              className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4 text-left shadow-sm hover:border-[hsl(176_60%_55%)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[14px] num">{v.codigo}</p>
                <TierChip tier={d.tier} />
              </div>
              <p className="mt-1 text-[12px] text-[hsl(210_14%_42%)]">{v.produto} · {v.carreta}</p>
              <p className="mt-0.5 text-[11px] text-[hsl(210_14%_48%)]">{v.origem} → {v.destino}</p>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Dossie({ viagemId, onEvidencias }: { viagemId: string; onEvidencias: (id: string) => void }) {
  const v = viagens.find((x) => x.id === viagemId);
  if (!v) return <p className="text-[13px] text-[hsl(210_14%_45%)]">Viagem fora da amostra.</p>;
  const d = avaliarCarregamento(v.id);
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold tracking-[-0.01em] num">{v.codigo}</h1>
        <TierChip tier={d.tier} />
        <button onClick={() => onEvidencias(v.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[hsl(200_18%_85%)] bg-white px-3 py-1.5 text-[12px] font-semibold hover:border-[hsl(176_60%_55%)]">
          <Lock className="size-3.5" /> Ver evidências travadas
        </button>
      </div>

      <div className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[hsl(210_14%_45%)]">Decisão do motor T-3</p>
        <p className="mt-1 text-[14px] font-semibold">{d.regra}</p>
        <p className="mt-0.5 text-[13px] text-[hsl(210_14%_40%)]">{d.mensagem}</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-[hsl(210_14%_42%)]">
          <span>Regime exigido: <strong className="text-[hsl(195_30%_20%)]">{d.regimeExigido ?? "—"}</strong></span>
          <span>Regime aplicado: <strong className="text-[hsl(195_30%_20%)]">{d.regimeAplicado ?? "—"}</strong></span>
          <span>Base IDTF: <strong className="text-[hsl(195_30%_20%)]">{d.versaoBaseIDTF}</strong></span>
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[hsl(210_14%_45%)]">Checagens</p>
        <ul className="space-y-1.5">
          {d.checagens.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px]">
              <span className={cn("mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", c.ok ? "bg-[hsl(142_71%_36%)]" : "bg-[hsl(0_78%_50%)]")}>
                {c.ok ? "✓" : "✕"}
              </span>
              <div>
                <span className="font-medium">{c.nome}</span>
                <span className="text-[hsl(210_14%_45%)]"> · {c.detalhe}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Evidencias({ viagemId }: { viagemId: string }) {
  const v = viagens.find((x) => x.id === viagemId);
  const compId = compartimentoPorViagem[viagemId];
  const comp = findCompartimento(compId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const limpezas = compId ? limpezasDoCompartimento(compId) : [];
  const inspecoes = compId ? inspecoesDoCompartimento(compId) : [];

  type Ev = { tipo: string; quando: string; quem: string; geo?: { lat: number; lng: number }; fotos?: number; extra: string; offline: boolean; seed: string };
  const evidencias: Ev[] = [
    ...inspecoes.map((e) => ({ tipo: "Inspeção LCI", quando: e.dataHora, quem: e.inspetor, geo: e.geo, extra: `${e.itensOk}/${e.itensTotal} itens · ${e.resultado}`, offline: e.offline, seed: e.id })),
    ...limpezas.map((c) => ({ tipo: `Limpeza · Regime ${c.regime}`, quando: c.data, quem: c.executor, geo: c.geo, fotos: c.fotos, extra: `${c.metodo} · ${c.local}`, offline: false, seed: c.id })),
  ].sort((a, b) => (a.quando < b.quando ? 1 : -1));

  return (
    <>
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.01em]">Evidências travadas</h1>
        <p className="text-[13px] text-[hsl(210_14%_42%)]">
          {v?.codigo} · {comp?.identificador ?? "compartimento —"}{imp ? ` (${imp.placa})` : ""} — foto + geo + hash, imutável.
        </p>
      </div>

      {evidencias.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[hsl(200_18%_82%)] bg-white p-8 text-center text-[13px] text-[hsl(210_14%_45%)]">
          Sem evidências vinculadas a este compartimento na amostra.
        </div>
      ) : (
        <div className="space-y-2.5">
          {evidencias.map((e, i) => (
            <div key={i} className="rounded-xl border border-[hsl(200_18%_88%)] bg-white p-4">
              <div className="flex items-center gap-2">
                <Lock className="size-3.5 text-[hsl(210_14%_45%)]" />
                <p className="text-[13px] font-semibold">{e.tipo}</p>
                <span className="ml-auto text-[11px] text-[hsl(210_14%_45%)] num">{formatDateTime(e.quando)}</span>
              </div>
              <p className="mt-1 text-[12px] text-[hsl(210_14%_42%)]">{e.quem} · {e.extra}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[hsl(210_14%_48%)]">
                {e.geo && (
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {e.geo.lat.toFixed(4)}, {e.geo.lng.toFixed(4)}</span>
                )}
                {typeof e.fotos === "number" && (
                  <span className="inline-flex items-center gap-1"><Camera className="size-3" /> {e.fotos} foto{e.fotos === 1 ? "" : "s"}</span>
                )}
                <span className="inline-flex items-center gap-1 num"><Hash className="size-3" /> {hashCurto(e.seed)}</span>
                {e.offline && <span className="inline-flex items-center gap-1 text-[hsl(28_70%_40%)]"><WifiOff className="size-3" /> capturado offline</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
