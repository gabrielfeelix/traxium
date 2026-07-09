"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Filter,
  Download,
  MoreHorizontal,
  Search,
  MapPin,
  Calendar,
  Eye,
  AlertTriangle,
  Sparkles,
  Layers3,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV, printPDF } from "@/lib/export";
import { avaliarCarregamento } from "@/lib/domain/rules-engine";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StatusBadge, RegimeBadge } from "@/components/shell/status-badge";
import { StatTile } from "@/components/kit/stat-tile";
import { SequenceRail, type RailStepDef } from "@/components/kit/sequence-rail";
import { RegimeDisc } from "@/components/kit/regime";
import { viagens, filialDaViagem, pertenceAFilial, type Viagem } from "@/lib/mock-data";
import { compartimentoPorViagem, ORDEM_REGIME } from "@/lib/domain/model";
import type { Decisao } from "@/lib/domain/rules-engine";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

const TIER_PESO = { BLOQUEIO: 0, ALERTA: 1, LIBERADO: 2 } as const;

const confClass = (n: number) =>
  n >= 90 ? "text-success-700" : n >= 70 ? "text-warning-700" : "text-danger-700";

/** Rail T-3 da viagem: cargas antigas → determinante → portão de regime → veredito do motor. */
function railSteps(v: Viagem, d: Decisao): RailStepDef[] {
  const cargas = [...v.cargasAnteriores].slice(0, 3).reverse(); // mais antiga → determinante
  const steps: RailStepDef[] = cargas.map((c, i) => ({
    key: `t${i}`,
    titulo: c.produto,
    sub: formatDate(c.data),
    tone: i === cargas.length - 1 ? "brand" : "neutro",
  }));
  const gateOk = !!(
    d.regimeAplicado && d.regimeExigido &&
    ORDEM_REGIME[d.regimeAplicado] >= ORDEM_REGIME[d.regimeExigido]
  );
  steps.push({
    key: "regime",
    titulo: `Regime ${d.regimeExigido ?? "—"}`,
    sub: d.regimeAplicado ? `aplicado ${d.regimeAplicado}` : "sem limpeza",
    marcador: d.regimeExigido ? <RegimeDisc regime={d.regimeExigido} className="size-5 text-[10px]" /> : undefined,
    tone: gateOk ? "ok" : "falha",
    quebraAntes: d.regra === "Carga anterior proibida",
  });
  steps.push({
    key: "veredito",
    titulo: d.tier === "BLOQUEIO" ? "Bloqueio" : d.tier === "ALERTA" ? "Alerta" : "Liberado",
    sub: d.regra,
    tone: d.tier === "BLOQUEIO" ? "falha" : d.tier === "ALERTA" ? "atencao" : "ok",
    atual: d.tier === "BLOQUEIO",
    quebraAntes: d.tier === "BLOQUEIO",
  });
  return steps;
}

export default function ViagensPage() {
  const { version, filialId } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [regimeFilter, setRegimeFilter] = useState<string>("todos");
  const [view, setView] = useState<"tabela" | "cards">("tabela");
  // Herói conectado ao detalhe: clicar num rail foca a viagem na tabela.
  const [foco, setFoco] = useState<string | null>(null);

  // Re-escopo por filial (§5) — a lista e os contadores mudam com a filial ativa.
  const escopadas = viagens.filter((v) => pertenceAFilial(filialId, filialDaViagem(v)));

  // Fila de decisão: viagens avaliáveis pelo motor, mais graves primeiro.
  const fila = escopadas
    .filter((v) => compartimentoPorViagem[v.id])
    .map((v) => ({ v, d: avaliarCarregamento(v.id) }))
    .sort((a, b) => TIER_PESO[a.d.tier] - TIER_PESO[b.d.tier]);

  const filtered = escopadas.filter((v) => {
    if (foco) return v.id === foco;
    const matchSearch =
      v.codigo.toLowerCase().includes(search.toLowerCase()) ||
      v.motorista.toLowerCase().includes(search.toLowerCase()) ||
      v.produto.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || v.status === statusFilter;
    const matchRegime = regimeFilter === "todos" || v.regimeLimpeza === regimeFilter;
    return matchSearch && matchStatus && matchRegime;
  });

  const counts = {
    total: escopadas.length,
    transito: escopadas.filter((v) => v.status === "Em trânsito").length,
    bloqueada: escopadas.filter((v) => v.status === "Bloqueada").length,
    concluida: escopadas.filter((v) => v.status === "Concluída").length,
  };

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Viagens"
        description="Operações de transporte criadas no sistema. O motor de regras valida T-3, regime de limpeza, certificações e documentação antes de liberar cada carregamento."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-viagens",
                  ["Código", "Motorista", "Cavalo", "Carreta", "Produto", "Origem", "Destino", "Status", "Conformidade %"],
                  filtered.map((v) => [v.codigo, v.motorista, v.cavalo, v.carreta, v.produto, v.origem, v.destino, v.status, v.conformidade])
                );
                toast("CSV exportado", { desc: `${filtered.length} viagem(ns).` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <NovaViagemModal />
          </>
        }
      />

      {/* Stats line */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={Truck} label="Total ativas" value={counts.total} hint="últimos 7 dias" />
        <StatTile icon={MapPin} label="Em trânsito" value={counts.transito} hint="84 entre 7 estados" tone="brand" />
        <StatTile icon={AlertTriangle} label="Bloqueadas" value={counts.bloqueada} hint="ação requerida" tone="danger" />
        <StatTile icon={Calendar} label="Concluídas (7d)" value={counts.concluida} hint="100% conformidade" tone="success" />
      </div>

      {/* Momento-assinatura: a sequência que decide cada carregamento, mais graves primeiro. */}
      {fila.length > 0 && (
        <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Fila de decisão T-3</h2>
              <p className="text-[12px] text-fg-muted leading-snug mt-0.5 max-w-2xl">
                As três cargas anteriores puxam o regime exigido pela IDTF; o motor fecha o veredito.
                Clique numa viagem para focá-la na tabela.
              </p>
            </div>
            {foco && (
              <Button variant="outline" size="sm" onClick={() => setFoco(null)}>
                <XCircle className="size-3.5" /> Limpar foco
              </Button>
            )}
          </div>
          <div className="mt-3 space-y-1">
            {fila.map(({ v, d }) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={foco === v.id}
                onClick={() => setFoco(foco === v.id ? null : v.id)}
                className={cn(
                  "w-full grid grid-cols-1 lg:grid-cols-[170px_minmax(0,1fr)_54px] items-center gap-2 lg:gap-4 rounded-md px-2.5 py-2 text-left transition-colors",
                  foco === v.id ? "bg-brand-50 ring-1 ring-brand-500/40" : "hover:bg-bg"
                )}
              >
                <div className="min-w-0">
                  <p className="font-mono text-[12px] font-semibold text-brand-700 leading-tight">{v.codigo}</p>
                  <p className="text-[10px] text-fg-muted truncate">{v.motorista}</p>
                </div>
                <SequenceRail steps={railSteps(v, d)} />
                <span className={cn("text-[12px] font-bold num lg:text-right", confClass(v.conformidade))}>
                  {v.conformidade}%
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap mt-3 pt-3 border-t border-border-soft text-[9px] font-semibold uppercase tracking-[0.1em] text-fg-muted">
            <span className="inline-flex items-center gap-1"><XCircle className="size-3 text-danger-500" /> Bloqueio</span>
            <span className="inline-flex items-center gap-1"><AlertTriangle className="size-3 text-warning-500" /> Alerta</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3 text-success-500" /> Liberado</span>
          </div>
        </section>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap pb-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted" />
              <Input
                placeholder="Buscar por código, motorista, produto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Em carregamento">Em carregamento</SelectItem>
                <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                <SelectItem value="Descarregando">Descarregando</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Bloqueada">Bloqueada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regimeFilter} onValueChange={setRegimeFilter}>
              <SelectTrigger className="w-36 h-9">
                <Filter className="size-4 text-fg-muted" />
                <SelectValue placeholder="Regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo regime</SelectItem>
                <SelectItem value="A">Regime A</SelectItem>
                <SelectItem value="B">Regime B</SelectItem>
                <SelectItem value="C">Regime C</SelectItem>
                <SelectItem value="D">Regime D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-border bg-white p-0.5">
              <button
                onClick={() => setView("tabela")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-[5px] transition-colors",
                  view === "tabela" ? "bg-brand-600 text-white" : "text-fg-muted hover:bg-bg"
                )}
              >
                Tabela
              </button>
              <button
                onClick={() => setView("cards")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-[5px] transition-colors",
                  view === "cards" ? "bg-brand-600 text-white" : "text-fg-muted hover:bg-bg"
                )}
              >
                <Layers3 className="size-3 inline mr-1" /> Cards
              </button>
            </div>
            <Badge variant="outline">{filtered.length} resultados</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {view === "tabela" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Viagem</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Rota</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Regime</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Conformidade</TableHead>
                  <TableHead className="text-right">Saída</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <Link href={`/viagens/${v.id}`} className="block">
                        <p className="font-mono text-[12px] font-semibold text-brand-700 hover:underline">
                          {v.codigo}
                        </p>
                        <p className="text-[10px] text-fg-soft mt-0.5 font-mono">
                          {v.cavalo} · {v.carreta}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-[13px] font-medium">{v.motorista}</p>
                      <p className="text-[10px] text-fg-soft font-mono">{v.motoristaCpf}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[12px] truncate max-w-[200px]">{v.origem.split("·")[0].trim()}</p>
                      <p className="text-[10px] text-fg-soft truncate max-w-[200px]">→ {v.destino.split("·")[0].trim()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[12px]">{v.produto}</p>
                      <p className="text-[10px] text-fg-soft num">{v.km} km</p>
                    </TableCell>
                    <TableCell>
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-12 h-1 rounded-full bg-bg overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              v.conformidade >= 90
                                ? "from-brand-500 to-success-500"
                                : v.conformidade >= 70
                                ? "from-warning-500 to-warning-700"
                                : "from-danger-500 to-danger-700"
                            )}
                            style={{ width: `${v.conformidade}%` }}
                          />
                        </div>
                        <span className={cn("text-[13px] font-bold num min-w-[36px] text-right", confClass(v.conformidade))}>
                          {v.conformidade}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[11px] text-fg-muted num whitespace-nowrap">
                      {formatDateTime(v.iniciadaEm)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/viagens/${v.id}`}>
                              <Eye className="size-4" /> Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const d = avaliarCarregamento(v.id);
                              toast(`Motor: ${d.tier}`, {
                                type: d.tier === "BLOQUEIO" ? "error" : d.tier === "ALERTA" ? "info" : "success",
                                desc: d.regra,
                              });
                            }}
                          >
                            <Sparkles className="size-4" /> Re-validar regras
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { printPDF(); toast("Abrindo impressão da guia", { type: "info", desc: "Use 'Salvar como PDF'." }); }}
                          >
                            Imprimir guia
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
              {filtered.map((v) => (
                <Link
                  key={v.id}
                  href={`/viagens/${v.id}`}
                  className={cn(
                    "block rounded-lg border p-4 transition-all hover:shadow-brand-md",
                    v.status === "Bloqueada"
                      ? "border-danger-500/40 bg-danger-50/50"
                      : "border-border-soft hover:border-brand-500/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-[12px] font-semibold text-brand-700">{v.codigo}</p>
                      <p className="text-[10px] text-fg-soft mt-0.5 font-mono">
                        {v.cavalo} · {v.carreta}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={v.status} size="sm" />
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                    </div>
                  </div>
                  <p className="text-[14px] font-semibold mb-1">{v.motorista}</p>
                  <p className="text-[12px] text-fg-muted mb-1">{v.produto} · <span className="num">{v.km} km</span></p>
                  <p className="text-[11px] text-fg-soft truncate">
                    {v.origem.split("·")[0].trim()} → {v.destino.split("·")[0].trim()}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-between">
                    <span className="text-[11px] text-fg-muted num">{formatDateTime(v.iniciadaEm)}</span>
                    <span className={cn("text-[14px] font-bold num", confClass(v.conformidade))}>
                      {v.conformidade}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
