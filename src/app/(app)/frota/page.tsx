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
import {
  cavalos,
  implementos,
  compartimentos,
  findImplemento,
  findSubcontratado,
} from "@/lib/domain/model";
import { statusCompartimento } from "@/lib/domain/rules-engine";
import { formatDate, cn } from "@/lib/utils";

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
        <MetricCard icon={<Truck />} label="Cavalos" value={cavalos.length} hint="não carregam T-3" />
        <MetricCard icon={<Container />} label="Implementos" value={implementos.length} />
        <MetricCard icon={<Boxes />} label="Compartimentos" value={compartimentos.length} variant="brand" />
        <MetricCard icon={<ShieldAlert />} label="Compart. bloqueados" value={bloqueados} variant="danger" />
      </div>

      <Tabs defaultValue="compartimentos">
        <TabsList>
          <TabsTrigger value="compartimentos">Compartimentos ({compFiltrados.length})</TabsTrigger>
          <TabsTrigger value="implementos">Implementos ({impFiltrados.length})</TabsTrigger>
          <TabsTrigger value="cavalos">Cavalos ({cavFiltrados.length})</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <div className="relative max-w-md mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(210_14%_42%)]" />
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
                                <span className="text-[hsl(210_14%_42%)] font-normal"> · {c.identificador}</span>
                              </p>
                              <p className="text-[10px] text-[hsl(210_12%_58%)]">
                                {imp?.tipo} · {c.capacidadeT} t · {c.material}
                              </p>
                            </Link>
                          </TableCell>
                          <TableCell>
                            {st.ultimaCarga ? (
                              <>
                                <p className="text-[12px]">{st.ultimaCarga.nomeCanonico}</p>
                                <p className="text-[10px] text-[hsl(210_12%_58%)] num">
                                  {st.ultimaCargaData && formatDate(st.ultimaCargaData)}
                                </p>
                              </>
                            ) : (
                              <span className="text-[12px] text-[hsl(210_12%_58%)]">—</span>
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
                                <span className="text-[10px] text-[hsl(210_12%_58%)] num">
                                  {formatDate(st.ultimaLimpeza.data)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[hsl(0_70%_45%)]">não evidenciada</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link href={`/frota/compartimento/${c.id}`}>
                              <ChevronRight className="size-4 text-[hsl(210_12%_70%)]" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[hsl(210_14%_42%)]">
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
                            {sub && <p className="text-[10px] text-[hsl(210_12%_58%)]">{sub.razaoSocial}</p>}
                          </TableCell>
                          <TableCell className="text-[11px] text-[hsl(210_14%_42%)]">{i.certGMP.escopo}</TableCell>
                          <TableCell>
                            <StatusBadge status={i.certGMP.status} size="sm" />
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-[hsl(210_12%_58%)]">vence {formatDate(i.certGMP.validade)}</span>
                              <button
                                onClick={() => setRenovarTarget({ kind: "implemento", id: i.id, placa: i.placa, validadeAtual: i.certGMP.validade })}
                                className="text-[10px] font-semibold text-[hsl(176_84%_25%)] hover:underline"
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
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[hsl(0_70%_45%)]">
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
                        <TableCell className="text-[11px] text-[hsl(210_12%_58%)]">
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

function MetricCard({
  icon,
  label,
  value,
  variant,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant?: "brand" | "danger";
  hint?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center shrink-0",
            variant === "danger" && "bg-[hsl(0_72%_95%)] text-[hsl(0_72%_40%)]",
            variant === "brand" && "bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]",
            !variant && "bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]"
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">{label}</p>
          <p className="text-2xl font-bold tabular-nums leading-none mt-0.5">{value}</p>
          {hint && <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
