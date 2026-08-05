"use client";

import { GraduationCap, IdCard, Phone, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shell/status-badge";
import { nivelVencimento } from "@/lib/domain/model";
import type { Motorista } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

/**
 * Momento-assinatura de Motoristas: a credencial de qualificação — crachá com
 * banda, furo, anel de conformidade ao redor do avatar (medidor), CNH e
 * certificações com validade lida do motor (nivelVencimento). O card É o
 * documento que diz se o motorista pode rodar sob a cadeia certificada.
 */

const anelCor = (pct: number) =>
  pct >= 95 ? "stroke-success-500" : pct >= 80 ? "stroke-warning-500" : "stroke-danger-500";

const confCor = (pct: number) =>
  pct >= 95 ? "text-success-700" : pct >= 80 ? "text-warning-700" : "text-danger-700";

const NIVEL_CHIP: Record<string, string> = {
  vencido: "bg-danger-50 text-danger-700",
  critico: "bg-danger-50 text-danger-700",
  alto: "bg-warning-50 text-warning-700",
  alerta: "bg-warning-50/60 text-warning-700",
  ok: "bg-success-50 text-success-700",
};

/** Anel de conformidade — gauge SVG em volta do avatar. */
function AnelConformidade({ pct, iniciais }: { pct: number; iniciais: string }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-14 shrink-0" role="img" aria-label={`Conformidade ${pct.toFixed(1)}%`}>
      <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90">
        <circle cx="28" cy="28" r={r} strokeWidth="3.5" className="fill-none stroke-border-soft" />
        <circle
          cx="28" cy="28" r={r} strokeWidth="3.5" strokeLinecap="round"
          className={cn("fill-none", anelCor(pct))}
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-brand-600 to-sky-600 text-white flex items-center justify-center text-[13px] font-bold">
        {iniciais}
      </div>
    </div>
  );
}

export function Credencial({
  m,
  selecionado,
  onFocar,
  onTreinar,
  onRenovar,
}: {
  m: Motorista;
  selecionado: boolean;
  onFocar: () => void;
  onTreinar: () => void;
  onRenovar: () => void;
}) {
  const bloqueado = m.status === "Bloqueado";
  const cnh = nivelVencimento(m.cnh.vencimento);
  const iniciais = m.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onClick={onFocar}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFocar(); } }}
      className={cn(
        "rounded-xl border overflow-hidden bg-bg-elev text-left transition-all cursor-pointer group",
        selecionado
          ? "border-brand-500/50 ring-1 ring-brand-500/30 shadow-brand-md"
          : bloqueado
            ? "border-danger-500/40 hover:shadow-brand-md"
            : "border-border-soft hover:border-brand-500/40 hover:shadow-brand-md"
      )}
    >
      {/* Banda do crachá com furo */}
      <div className={cn(
        "relative h-8 flex items-center justify-between px-3",
        bloqueado ? "bg-gradient-to-r from-danger-700 to-danger-500" : "bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600"
      )}>
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-1.5 w-9 rounded-full bg-white/30" aria-hidden />
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/85 flex items-center gap-1">
          <IdCard className="size-3" aria-hidden /> Credencial
        </span>
        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/85">{m.tipo}</span>
      </div>

      <div className="p-3.5 space-y-3">
        <div className="flex items-center gap-3">
          <AnelConformidade pct={m.conformidadeMedia} iniciais={iniciais} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-fg leading-tight truncate">{m.nome}</p>
            <p className="font-mono text-[10px] text-fg-soft">{m.cpf}</p>
            <p className="text-[10px] text-fg-muted">{m.cidade}/{m.uf} · <span className="num">{m.totalViagens}</span> viagens</p>
          </div>
          <div className="text-right shrink-0">
            <p className={cn("text-[17px] font-bold num leading-none", confCor(m.conformidadeMedia))}>
              {m.conformidadeMedia.toFixed(1)}%
            </p>
            <p className="text-[8px] uppercase tracking-[0.12em] text-fg-soft font-semibold mt-0.5">conformidade</p>
          </div>
        </div>

        {/* Qualificações: CNH + certificações, validade em cor + rótulo */}
        <div className="flex flex-wrap gap-1">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold num", NIVEL_CHIP[cnh.nivel])}>
            CNH {m.cnh.categoria} · {cnh.nivel === "vencido" ? "vencida" : formatDate(m.cnh.vencimento)}
          </span>
          {m.certificacoes.map((c) => (
            <span
              key={c.nome}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                c.status === "Válida" ? "bg-success-50 text-success-700"
                  : c.status === "Pendente" ? "bg-warning-50 text-warning-700"
                  : "bg-danger-50 text-danger-700"
              )}
            >
              {c.nome} · {c.status.toLowerCase()}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border-soft pt-2.5">
          <StatusBadge status={m.status} size="sm" />
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label={`Contatar ${m.nome} no WhatsApp`}
              onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/55${m.telefone.replace(/\D/g, "")}`, "_blank", "noopener"); }}
              className="rounded-md p-1.5 text-fg-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Phone className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Agendar treinamento de ${m.nome}`}
              onClick={(e) => { e.stopPropagation(); onTreinar(); }}
              className="rounded-md p-1.5 text-fg-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <GraduationCap className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={`Renovar certificação de ${m.nome}`}
              onClick={(e) => { e.stopPropagation(); onRenovar(); }}
              className="rounded-md p-1.5 text-fg-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
