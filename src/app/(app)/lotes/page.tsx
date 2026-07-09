"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Eye,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trees,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shell/status-badge";
import { StatTile } from "@/components/kit/stat-tile";
import { SequenceRail, type RailStepDef } from "@/components/kit/sequence-rail";
import { lotes, fazendas, type Lote } from "@/lib/mock-data";
import { NovoLoteModal } from "@/components/modals/novo-lote-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatDateTime, formatNumber, cn } from "@/lib/utils";

const ORDEM_DDS = ["Rascunho", "Pronto para envio", "Enviado TRACES", "Aprovado"] as const;
const ROTULO_DDS: Record<(typeof ORDEM_DDS)[number], string> = {
  Rascunho: "Rascunho",
  "Pronto para envio": "Pronto",
  "Enviado TRACES": "Enviado",
  Aprovado: "Aprovado",
};

/** Rail do ciclo DDS: passadas verdes, atual pulsa, futuras neutras; rejeição quebra. */
function railDDS(l: Lote): RailStepDef[] {
  const rejeitado = l.statusDDS === "Rejeitado";
  const idx = rejeitado ? 3 : ORDEM_DDS.indexOf(l.statusDDS as (typeof ORDEM_DDS)[number]);
  return ORDEM_DDS.map((s, i) => ({
    key: s,
    titulo: i === 3 && rejeitado ? "Rejeitado" : ROTULO_DDS[s],
    sub:
      s === "Enviado TRACES" && i <= idx && l.dataEnvio
        ? formatDate(l.dataEnvio)
        : s === "Aprovado" && i <= idx && l.dataAprovacao
          ? formatDate(l.dataAprovacao)
          : undefined,
    tone: rejeitado && i === 3 ? "falha" : i < idx ? "ok" : i === idx ? (s === "Aprovado" ? "ok" : "brand") : "neutro",
    atual: i === idx && s !== "Aprovado" && !rejeitado,
    quebraAntes: rejeitado && i === 3,
  }));
}

/** Mini-mapa das origens: centroides reais, fazendas do lote em brand. */
function MiniMapa({ ids }: { ids: string[] }) {
  const lats = fazendas.map((f) => f.centroide.lat);
  const lngs = fazendas.map((f) => f.centroide.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const x = (lng: number) => 8 + ((lng - minLng) / (maxLng - minLng || 1)) * 84;
  const y = (lat: number) => 8 + (1 - (lat - minLat) / (maxLat - minLat || 1)) * 56;
  return (
    <svg viewBox="0 0 100 72" role="img" aria-label="Posição relativa das fazendas de origem"
      className="w-full rounded-lg border border-border-soft bg-brand-50/30">
      {fazendas.map((f) => {
        const sel = ids.includes(f.id);
        return (
          <g key={f.id}>
            <title>{f.nome} · {f.cidade}/{f.uf}</title>
            {sel && <circle cx={x(f.centroide.lng)} cy={y(f.centroide.lat)} r={5} className="fill-brand-500/20" />}
            <circle
              cx={x(f.centroide.lng)}
              cy={y(f.centroide.lat)}
              r={sel ? 2.8 : 1.6}
              className={sel ? "fill-brand-600" : "fill-fg-soft/40"}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function LotesPage() {
  const { updateLoteStatus, version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  // Herói master-detalhe: lote selecionado alimenta o painel de origens.
  const [sel, setSel] = useState<string | null>(() => lotes[0]?.id ?? null);
  const loteSel = lotes.find((l) => l.id === sel) ?? lotes[0];
  const filtered = lotes.filter(
    (l) =>
      l.codigo.toLowerCase().includes(search.toLowerCase()) ||
      l.destinatarioFinal.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    aprovados: lotes.filter((l) => l.statusDDS === "Aprovado").length,
    enviados: lotes.filter((l) => l.statusDDS === "Enviado TRACES").length,
    prontos: lotes.filter((l) => l.statusDDS === "Pronto para envio").length,
    rascunho: lotes.filter((l) => l.statusDDS === "Rascunho").length,
  };

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Lotes EUDR e Declarações DDS"
        description="Lotes de exportação para a União Europeia. Cada lote agrega cargas de fazendas verificadas e gera uma Declaração de Devida Diligência transmitida via gateway TRACES NT (SOAP/WS-Security)."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Modelos DDS", { type: "info", desc: "Biblioteca de modelos por país destino — em breve." })}>
              <FileText className="size-4" /> Modelos DDS
            </Button>
            <NovoLoteModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={FileText} label="Rascunho" value={counts.rascunho} hint="compondo cargas" />
        <StatTile icon={Sparkles} label="Prontos para envio" value={counts.prontos} tone="brand" hint="DDS gerada e assinada" />
        <StatTile icon={Send} label="Enviados TRACES" value={counts.enviados} tone="warning" hint="aguardando autoridade UE" />
        <StatTile icon={CheckCircle2} label="Aprovados" value={counts.aprovados} tone="success" hint="liberados para exportar" />
      </div>

      {/* Momento-assinatura: o ciclo DDS de cada lote como rail + origens do selecionado. */}
      <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Ciclo DDS por lote</h2>
        <p className="text-[12px] text-fg-muted leading-snug mt-0.5 mb-4 max-w-2xl">
          Onde cada declaração está no caminho Rascunho → Pronto → Enviado → Aprovado. Clique num lote
          para ver as origens que o compõem.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-5 items-start">
          <div className="space-y-2">
            {lotes.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={sel === l.id}
                onClick={() => setSel(l.id)}
                className={cn(
                  "w-full text-left rounded-lg border transition-all group cursor-pointer",
                  "grid grid-cols-1 lg:grid-cols-[150px_minmax(0,1fr)_90px] gap-x-5 gap-y-2 items-center px-4 py-3",
                  sel === l.id
                    ? "border-brand-500/50 bg-brand-50/60 ring-1 ring-brand-500/30"
                    : "border-border-soft bg-bg-elev hover:border-brand-500/40 hover:shadow-brand-md"
                )}
              >
                <div className="min-w-0">
                  <p className="font-mono text-[12px] font-bold text-brand-700 leading-tight">{l.codigo}</p>
                  <p className="text-[10px] text-fg-muted truncate">
                    {l.produto} · <span className="num">{formatNumber(l.toneladas)} t</span>
                  </p>
                </div>
                <SequenceRail steps={railDDS(l)} />
                <div className="flex items-center lg:justify-end gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-fg-muted">
                    <Trees className="size-3 text-brand-500" /> {l.fazendas.length} origem{l.fazendas.length > 1 ? "s" : ""}
                  </span>
                  <ChevronRight className="size-4 text-fg-soft group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden />
                </div>
              </button>
            ))}
          </div>

          {loteSel && (
            <div className="rounded-lg border border-border-soft bg-bg p-3.5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-fg-muted">
                Origens · {loteSel.codigo}
              </p>
              <MiniMapa ids={loteSel.fazendas.map((f) => f.id)} />
              <div className="space-y-1.5">
                {loteSel.fazendas.map((f) => (
                  <div key={f.id}>
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-fg truncate">{f.nome}</span>
                      <span className="text-fg-muted num shrink-0">{formatNumber(f.toneladas)} t</span>
                    </div>
                    <div className="h-1 rounded-full bg-bg-elev border border-border-soft overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${Math.round((f.toneladas / loteSel.toneladas) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-fg-soft border-t border-border-soft pt-2">
                Destino: <span className="font-semibold text-fg-muted">{loteSel.destinatarioFinal}</span> · {loteSel.paisDestino}
                {loteSel.numeroDDS && (
                  <span className="block font-mono mt-0.5">DDS {loteSel.numeroDDS}</span>
                )}
              </p>
              {loteSel.statusDDS === "Rascunho" && (
                <Button variant="gradient" size="sm" className="w-full"
                  onClick={() => { updateLoteStatus(loteSel.id, "Pronto para envio"); toast(`${loteSel.codigo} validado`, { desc: "DDS pronta para envio ao TRACES." }); }}>
                  <Sparkles className="size-3.5" /> Validar DDS
                </Button>
              )}
              {loteSel.statusDDS === "Pronto para envio" && (
                <Button variant="gradient" size="sm" className="w-full"
                  onClick={() => { updateLoteStatus(loteSel.id, "Enviado TRACES"); toast(`${loteSel.codigo} enviado ao TRACES NT`, { desc: "Aguardando validação da autoridade UE." }); }}>
                  <Send className="size-3.5" /> Enviar ao TRACES
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted" />
            <Input
              placeholder="Buscar lote ou destinatário…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Badge variant="outline">{filtered.length} lotes</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Tonelagem</TableHead>
                <TableHead>Fazendas</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Status DDS</TableHead>
                <TableHead>Número DDS</TableHead>
                <TableHead>Envio</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <p className="font-mono text-[12px] font-bold text-brand-700">{l.codigo}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px]">{l.produto}</p>
                    <p className="text-[10px] text-fg-soft font-mono">HS {l.hsCode}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-[13px] font-bold num">{formatNumber(l.toneladas)}</p>
                    <p className="text-[10px] text-fg-soft">toneladas</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px]">{l.fazendas.length} fazenda{l.fazendas.length > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-fg-soft truncate max-w-[180px]">
                      {l.fazendas.map((f) => f.nome).join(" · ")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-[12px] font-medium">{l.destinatarioFinal}</p>
                    <p className="text-[10px] text-fg-soft">{l.paisDestino}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={l.statusDDS} size="sm" />
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-fg-muted">
                    {l.numeroDDS || "—"}
                  </TableCell>
                  <TableCell className="text-[11px] text-fg-muted num whitespace-nowrap">
                    {l.dataEnvio ? formatDateTime(l.dataEnvio) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {l.statusDDS === "Rascunho" && (
                        <Button variant="gradient" size="sm" onClick={() => { updateLoteStatus(l.id, "Pronto para envio"); toast(`${l.codigo} validado`, { desc: "DDS pronta para envio ao TRACES." }); }}>
                          <Sparkles className="size-3.5" /> Validar
                        </Button>
                      )}
                      {l.statusDDS === "Pronto para envio" && (
                        <Button variant="gradient" size="sm" onClick={() => { updateLoteStatus(l.id, "Enviado TRACES"); toast(`${l.codigo} enviado ao TRACES NT`, { desc: "Aguardando validação da autoridade UE." }); }}>
                          <Send className="size-3.5" /> Enviar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => toast(l.codigo, { type: "info", desc: `${l.fazendas.length} origem(ns) · ${l.destinatarioFinal}` })}>
                        <Eye className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validação de DDS · Pré-envio</CardTitle>
          <CardDescription>Checklist obrigatório antes de transmitir ao TRACES NT</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { ok: true, label: "Todas as fazendas com polígono validado" },
            { ok: true, label: "Cruzamento INPE/MapBiomas concluído" },
            { ok: true, label: "CAR vigente e regularizado para cada fazenda" },
            { ok: true, label: "HS Code presente na lista EUDR" },
            { ok: true, label: "Quantidade conferida com manifesto" },
            { ok: false, label: "Documento de operador/comerciante UE assinado" },
            { ok: true, label: "Assinatura digital ICP-Brasil válida" },
            { ok: true, label: "WS-Security configurado" },
          ].map((v, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md border",
                v.ok ? "border-success-500/30 bg-success-50/50" : "border-warning-500/40 bg-warning-50/50"
              )}
            >
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0",
                  v.ok ? "bg-success-500 text-white" : "bg-warning-500 text-white"
                )}
              >
                {v.ok ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              </div>
              <span className="text-[12px] flex-1">{v.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
