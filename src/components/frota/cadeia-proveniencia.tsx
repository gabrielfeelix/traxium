"use client";

import {
  Boxes,
  Truck,
  Droplets,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  Ban,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { REGIME_META, RegimeDisc } from "@/components/kit/regime";
import type { Regime } from "@/lib/domain/model";

/**
 * Momento-assinatura da tela de compartimento: a cadeia causal que hoje vive
 * espalhada em três cards soltos (T-3, limpezas, inspeções). Um só fluxo —
 *   carga determinante → regime exigido →[portão]→ limpeza → inspeção → veredito
 * — mostra na hora POR QUE o compartimento está apto/bloqueado. O portão
 * satisfaz/falha e a quebra vermelha do fluxo carregam o sinal regulatório.
 */

type Status = "apto" | "bloqueado" | "requer_limpeza" | "sem_historico";

interface CadeiaProvenienciaProps {
  carga: { nome: string; idtfCode?: string; data: string; cavalo: string; bloqueiaFeed: boolean } | null;
  regimeExigido?: Regime;
  limpeza: { regime: Regime; metodo: string; data: string } | null;
  limpezaSatisfaz: boolean;
  inspecao: { resultado: string; itensOk: number; itensTotal: number } | null;
  status: Status;
  label: string;
  motivo: string;
}

const verdictTone: Record<Status, { box: string; fg: string; icon: typeof CheckCircle2 }> = {
  apto: { box: "ring-2 ring-regime-a border-transparent", fg: "text-regime-a-fg", icon: CheckCircle2 },
  bloqueado: { box: "ring-2 ring-danger-500 border-transparent", fg: "text-danger-700", icon: XCircle },
  requer_limpeza: { box: "ring-2 ring-regime-c border-transparent", fg: "text-regime-c-fg", icon: AlertTriangle },
  sem_historico: { box: "border-border-soft", fg: "text-fg-muted", icon: AlertTriangle },
};

export function CadeiaProveniencia({
  carga,
  regimeExigido,
  limpeza,
  limpezaSatisfaz,
  inspecao,
  status,
  label,
  motivo,
}: CadeiaProvenienciaProps) {
  const V = verdictTone[status];
  const VerdictIcon = V.icon;

  // Onde a cadeia quebra: 3 = limpeza insuficiente, 4 = inspeção reprovada.
  const failStage = !limpezaSatisfaz ? 3 : inspecao?.resultado === "reprovado" ? 4 : null;
  const broken = (afterStage: number) => failStage !== null && afterStage >= failStage;

  return (
    <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Cadeia de proveniência</h2>
      <p className="text-[12px] text-fg-muted leading-snug mb-4 max-w-2xl mt-0.5">
        Por que este compartimento está <span className="font-semibold text-fg">{label.toLowerCase()}</span> — a
        carga determinante puxa o regime, a limpeza precisa satisfazê-lo e a inspeção fecha a evidência.
      </p>

      {status === "sem_historico" || !carga ? (
        <div className="rounded-lg border border-border-soft bg-bg px-4 py-6 text-center text-[12px] text-fg-muted">
          Compartimento sem histórico de carga — nada a reconstruir ainda.
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0">
            {/* 1 · Carga determinante */}
            <Node
              etapa="Carga anterior"
              tone={carga.bloqueiaFeed ? "border-danger-500/40 ring-1 ring-danger-500/20" : undefined}
            >
              <div className="flex items-start gap-2">
                <span className="size-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <Boxes className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-fg leading-tight truncate">{carga.nome}</p>
                  <p className="text-[10px] text-fg-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span className="num">{formatDate(carga.data)}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Truck className="size-2.5" />
                      <span className="font-mono">{carga.cavalo}</span>
                    </span>
                  </p>
                  {carga.bloqueiaFeed && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-danger-700">
                      <Ban className="size-2.5" /> carga proibida
                    </span>
                  )}
                </div>
              </div>
            </Node>

            <Conn label="IDTF exige" broken={broken(1)} />

            {/* 2 · Regime exigido */}
            <Node etapa="Regime mínimo">
              {regimeExigido ? (
                <div className="flex items-center gap-2">
                  <RegimeDisc regime={regimeExigido} className="size-9 text-[15px]" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-fg leading-tight">{REGIME_META[regimeExigido].nome}</p>
                    <p className="text-[10px] text-fg-muted leading-tight">{REGIME_META[regimeExigido].metodo}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-fg-muted">—</p>
              )}
            </Node>

            <Conn gate={limpezaSatisfaz ? "ok" : "fail"} broken={broken(2)} />

            {/* 3 · Limpeza aplicada */}
            <Node etapa="Limpeza aplicada" tone={!limpeza || !limpezaSatisfaz ? "border-danger-500/40" : undefined}>
              {limpeza ? (
                <div className="flex items-center gap-2">
                  <RegimeDisc regime={limpeza.regime} className="size-9 text-[15px]" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-fg leading-tight truncate">{limpeza.metodo}</p>
                    <p className="text-[10px] text-fg-muted leading-tight num">{formatDate(limpeza.data)}</p>
                  </div>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-danger-700">
                  <Droplets className="size-3.5" /> não evidenciada
                </span>
              )}
            </Node>

            <Conn label="inspeção" broken={broken(3)} />

            {/* 4 · Inspeção LCI */}
            <Node etapa="Inspeção LCI">
              {inspecao ? (
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center shrink-0 text-white",
                      inspecao.resultado === "aprovado"
                        ? "bg-regime-a"
                        : inspecao.resultado === "reprovado"
                          ? "bg-danger-500"
                          : "bg-regime-c"
                    )}
                  >
                    <ClipboardCheck className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-fg capitalize leading-tight">{inspecao.resultado}</p>
                    <p className="text-[10px] text-fg-muted num leading-tight">
                      {inspecao.itensOk}/{inspecao.itensTotal} itens
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-fg-muted">Sem inspeção</p>
              )}
            </Node>

            <Conn broken={broken(4)} />

            {/* 5 · Veredito */}
            <Node etapa="Veredito" tone={V.box}>
              <div className="flex items-center gap-2">
                <VerdictIcon className={cn("size-5 shrink-0", V.fg)} />
                <p className={cn("text-[14px] font-bold leading-tight", V.fg)}>{label}</p>
              </div>
            </Node>
          </div>

          <p className="mt-4 text-[12px] text-fg-muted leading-relaxed border-t border-border-soft pt-3">{motivo}</p>
        </>
      )}
    </section>
  );
}

function Node({ etapa, tone, children }: { etapa: string; tone?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex-1 lg:min-w-0 rounded-lg border bg-bg-elev p-3", tone ?? "border-border-soft")}>
      <p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft mb-2">{etapa}</p>
      {children}
    </div>
  );
}

function Conn({ label, gate, broken }: { label?: string; gate?: "ok" | "fail"; broken?: boolean }) {
  return (
    <div className="flex lg:flex-col items-center justify-center gap-1 shrink-0 lg:w-16 py-1 lg:py-0">
      {gate ? (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap",
            gate === "ok" ? "bg-regime-a-bg text-regime-a-fg" : "bg-danger-50 text-danger-700"
          )}
        >
          {gate === "ok" ? <CheckCircle2 className="size-2.5" /> : <XCircle className="size-2.5" />}
          {gate === "ok" ? "satisfaz" : "falha"}
        </span>
      ) : label ? (
        <span className="text-[8px] uppercase tracking-[0.1em] text-fg-soft whitespace-nowrap">{label}</span>
      ) : null}
      <ChevronRight className={cn("hidden lg:block size-4", broken ? "text-danger-500" : "text-fg-soft")} />
      <ChevronDown className={cn("lg:hidden size-4", broken ? "text-danger-500" : "text-fg-soft")} />
    </div>
  );
}
