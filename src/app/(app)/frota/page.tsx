"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Container,
  Search,
  Download,
  Truck,
  Boxes,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Info,
} from "lucide-react";
import { AdicionarAtivoModal } from "@/components/modals/adicionar-ativo-modal";
import { RenovarCertificacaoModal, type RenovarTarget } from "@/components/modals/renovar-certificacao-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, RegimeBadge, CompartimentoStatusBadge } from "@/components/shell/status-badge";
import { StatTile } from "@/components/kit/stat-tile";
import { RegimeDisc } from "@/components/kit/regime";
import {
  cavalos,
  implementos,
  compartimentos,
  findImplemento,
  findSubcontratado,
  type Compartimento,
} from "@/lib/domain/model";
import { statusCompartimento } from "@/lib/domain/rules-engine";
import { cn, formatDate } from "@/lib/utils";

// Tom da vaga pelo veredito do motor — cor + badge com rótulo (nunca só cor).
const VAGA_TONE: Record<string, string> = {
  apto: "border-success-500/40 bg-success-50/40",
  bloqueado: "border-danger-500/50 bg-danger-50/50",
  requer_limpeza: "border-warning-500/50 bg-warning-50/40",
  sem_historico: "border-dashed border-border bg-bg",
};

/** Célula do pátio: um compartimento como "vaga" com status T-3 do motor. */
function Vaga({ c }: { c: Compartimento }) {
  const st = statusCompartimento(c.id);
  return (
    <Link
      href={`/frota/compartimento/${c.id}`}
      className={cn(
        "block rounded-lg border-2 p-2.5 transition-all hover:shadow-brand-md hover:-translate-y-px",
        VAGA_TONE[st.status]
      )}
    >
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-fg-muted truncate">
          {c.identificador}
        </p>
        {st.regimeExigido && <RegimeDisc regime={st.regimeExigido} className="size-5 text-[10px]" />}
      </div>
      <CompartimentoStatusBadge status={st.status} size="sm" />
      {st.ultimaCarga ? (
        <p className="text-[10px] text-fg-muted mt-1.5 leading-tight truncate">
          T-1: <span className="font-semibold text-fg">{st.ultimaCarga.nomeCanonico}</span>
          {st.ultimaCargaData && <span className="num"> · {formatDate(st.ultimaCargaData)}</span>}
        </p>
      ) : (
        <p className="text-[10px] text-fg-soft mt-1.5">sem histórico de carga</p>
      )}
    </Link>
  );
}

export default function FrotaPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [renovarTarget, setRenovarTarget] = useState<RenovarTarget | null>(null);

  const q = search.trim().toLowerCase();
  const compFiltrados = compartimentos.filter((c) => {
    const imp = findImplemento(c.implementoId);
    return (
      c.identificador.toLowerCase().includes(q) ||
      (imp?.placa.toLowerCase().includes(q) ?? false)
    );
  });
  const impFiltrados = implementos.filter(
    (i) => i.placa.toLowerCase().includes(q) || i.tipo.toLowerCase().includes(q)
  );
  const cavFiltrados = cavalos.filter(
    (c) => c.placa.toLowerCase().includes(q) || c.modelo.toLowerCase().includes(q)
  );

  const bloqueados = compartimentos.filter((c) => statusCompartimento(c.id).status === "bloqueado").length;
  const certVencidas = implementos.filter((i) => i.certGMP.status === "Vencida").length;

  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Ativos e frota"
        description="Cavalos, implementos e compartimentos. O histórico T-3 e a limpeza acompanham o COMPARTIMENTO que toca o produto — não o cavalo. A certificação GMP+ é validada antes de cada carregamento."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-compartimentos",
                  ["Implemento", "Compartimento", "Última carga", "Regime exigido", "Status", "Última limpeza"],
                  compartimentos.map((c) => {
                    const st = statusCompartimento(c.id);
                    return [
                      findImplemento(c.implementoId)?.placa ?? "",
                      c.identificador,
                      st.ultimaCarga?.nomeCanonico ?? "—",
                      st.regimeExigido ?? "—",
                      st.label,
                      st.ultimaLimpeza ? `${st.ultimaLimpeza.regime} · ${st.ultimaLimpeza.data}` : "não evidenciada",
                    ];
                  })
                );
                toast("CSV exportado", { desc: `${compartimentos.length} compartimentos.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <AdicionarAtivoModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Truck} label="Cavalos" value={cavalos.length} hint="não carregam T-3" />
        <StatTile icon={Container} label="Implementos" value={implementos.length} />
        <StatTile icon={Boxes} label="Compartimentos" value={compartimentos.length} tone="brand" />
        <StatTile icon={ShieldAlert} label="Compart. bloqueados" value={bloqueados} tone="danger" />
      </div>

      {/* Momento-assinatura: o pátio — cada implemento é uma baia, cada
          compartimento uma vaga com o veredito T-3 do motor. */}
      <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Pátio de compartimentos</h2>
        <p className="text-[12px] text-fg-muted leading-snug mt-0.5 mb-4 max-w-2xl">
          O status T-3 de cada vaga, direto do motor: apto, bloqueado ou aguardando limpeza.
          Clique numa vaga para abrir a cadeia de proveniência do compartimento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {implementos.map((imp) => {
            const comps = compartimentos.filter((c) => c.implementoId === imp.id);
            const sub = findSubcontratado(imp.subcontratadoId);
            return (
              <div key={imp.id} className="rounded-lg border border-border-soft bg-bg p-3">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] font-bold text-fg leading-tight">{imp.placa}</p>
                    <p className="text-[10px] text-fg-muted truncate">
                      {imp.tipo} · {sub ? sub.razaoSocial : imp.proprietario}
                    </p>
                  </div>
                  <StatusBadge status={imp.certGMP.status} size="sm" />
                </div>
                <div className={cn("grid gap-2", comps.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                  {comps.map((c) => <Vaga key={c.id} c={c} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Tabs defaultValue="compartimentos">
        <TabsList>
          <TabsTrigger value="compartimentos">Compartimentos ({compFiltrados.length})</TabsTrigger>
          <TabsTrigger value="implementos">Implementos ({impFiltrados.length})</TabsTrigger>
          <TabsTrigger value="cavalos">Cavalos ({cavFiltrados.length})</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <div className="relative max-w-md mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
            <Input
              placeholder="Buscar placa, compartimento ou modelo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* ── Compartimentos — o ativo de controle ─────────────────────── */}
          <TabsContent value="compartimentos">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compartimento</TableHead>
                      <TableHead>Última carga (T-1)</TableHead>
                      <TableHead>Regime exigido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última limpeza</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compFiltrados.map((c) => {
                      const imp = findImplemento(c.implementoId);
                      const st = statusCompartimento(c.id);
                      return (
                        <TableRow key={c.id} className="cursor-pointer">
                          <TableCell>
                            <Link href={`/frota/compartimento/${c.id}`} className="block">
                              <p className="text-[13px] font-semibold hover:underline">
                                <span className="font-mono">{imp?.placa}</span>
                                <span className="text-fg-muted font-normal"> · {c.identificador}</span>
                              </p>
                              <p className="text-[10px] text-fg-soft">
                                {imp?.tipo} · {c.capacidadeT} t · {c.material}
                              </p>
                            </Link>
                          </TableCell>
                          <TableCell>
                            {st.ultimaCarga ? (
                              <>
                                <p className="text-[12px]">{st.ultimaCarga.nomeCanonico}</p>
                                <p className="text-[10px] text-fg-soft num">
                                  {st.ultimaCargaData && formatDate(st.ultimaCargaData)}
                                </p>
                              </>
                            ) : (
                              <span className="text-[12px] text-fg-soft">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {st.regimeExigido ? <RegimeBadge regime={st.regimeExigido} size="sm" /> : "—"}
                          </TableCell>
                          <TableCell>
                            <CompartimentoStatusBadge status={st.status} size="sm" />
                          </TableCell>
                          <TableCell>
                            {st.ultimaLimpeza ? (
                              <div className="flex items-center gap-1.5">
                                <RegimeBadge regime={st.ultimaLimpeza.regime} size="sm" />
                                <span className="text-[10px] text-fg-soft num">
                                  {formatDate(st.ultimaLimpeza.data)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-danger-700">não evidenciada</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link href={`/frota/compartimento/${c.id}`}>
                              <ChevronRight className="size-4 text-fg-soft" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-fg-muted">
              <Info className="size-3.5" /> O T-3 pertence ao compartimento e sobrevive à troca de cavalo entre viagens.
            </p>
          </TabsContent>

          {/* ── Implementos ──────────────────────────────────────────────── */}
          <TabsContent value="implementos">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Compart.</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Escopo GMP+</TableHead>
                      <TableHead>Cert. GMP+</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {impFiltrados.map((i) => {
                      const sub = findSubcontratado(i.subcontratadoId);
                      return (
                        <TableRow key={i.id}>
                          <TableCell className="font-mono text-sm font-semibold">{i.placa}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              <Container className="size-3" /> {i.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="num text-[13px]">{i.nCompartimentos}</TableCell>
                          <TableCell>
                            <p className="text-[12px]">{i.proprietario}</p>
                            {sub && <p className="text-[10px] text-fg-soft">{sub.razaoSocial}</p>}
                          </TableCell>
                          <TableCell className="text-[11px] text-fg-muted">{i.certGMP.escopo}</TableCell>
                          <TableCell>
                            <StatusBadge status={i.certGMP.status} size="sm" />
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-fg-soft">vence {formatDate(i.certGMP.validade)}</span>
                              <button
                                onClick={() => setRenovarTarget({ kind: "implemento", id: i.id, placa: i.placa, validadeAtual: i.certGMP.validade })}
                                className="text-[10px] font-semibold text-brand-600 hover:underline"
                              >
                                Renovar
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {certVencidas > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-danger-700">
                <ShieldAlert className="size-3.5" /> {certVencidas} implemento(s) com certificação GMP+ vencida geram bloqueio automático.
              </p>
            )}
          </TabsContent>

          {/* ── Cavalos ──────────────────────────────────────────────────── */}
          <TabsContent value="cavalos">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placa</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Documentação</TableHead>
                      <TableHead>Histórico T-3</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cavFiltrados.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-semibold">{c.placa}</TableCell>
                        <TableCell className="text-[13px]">{c.modelo}</TableCell>
                        <TableCell className="num text-[13px]">{c.ano}</TableCell>
                        <TableCell>
                          {c.documentacaoOk ? (
                            <Badge variant="success" className="text-[10px]">
                              <ShieldCheck className="size-3" /> Em dia
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">Pendente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[11px] text-fg-soft">
                          não aplicável — não toca a carga
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <RenovarCertificacaoModal open={!!renovarTarget} onOpenChange={(o) => { if (!o) setRenovarTarget(null); }} target={renovarTarget} />
    </div>
  );
}
