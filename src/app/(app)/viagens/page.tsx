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
import { viagens } from "@/lib/mock-data";
import { formatDateTime, cn } from "@/lib/utils";

export default function ViagensPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [regimeFilter, setRegimeFilter] = useState<string>("todos");
  const [view, setView] = useState<"tabela" | "cards">("tabela");

  const filtered = viagens.filter((v) => {
    const matchSearch =
      v.codigo.toLowerCase().includes(search.toLowerCase()) ||
      v.motorista.toLowerCase().includes(search.toLowerCase()) ||
      v.produto.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || v.status === statusFilter;
    const matchRegime = regimeFilter === "todos" || v.regimeLimpeza === regimeFilter;
    return matchSearch && matchStatus && matchRegime;
  });

  const counts = {
    total: viagens.length,
    transito: viagens.filter((v) => v.status === "Em trânsito").length,
    bloqueada: viagens.filter((v) => v.status === "Bloqueada").length,
    concluida: viagens.filter((v) => v.status === "Concluída").length,
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
        <StatLine icon={<Truck className="size-5" />} label="Total ativas" value={counts.total} sub="últimos 7 dias" />
        <StatLine icon={<MapPin className="size-5" />} label="Em trânsito" value={counts.transito} sub="84 entre 7 estados" tone="info" />
        <StatLine icon={<AlertTriangle className="size-5" />} label="Bloqueadas" value={counts.bloqueada} sub="ação requerida" tone="danger" />
        <StatLine icon={<Calendar className="size-5" />} label="Concluídas (7d)" value={counts.concluida} sub="100% conformidade" tone="success" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap pb-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[hsl(210_14%_42%)]" />
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
                <Filter className="size-4 text-[hsl(210_14%_42%)]" />
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
            <div className="inline-flex rounded-md border border-[hsl(200_18%_88%)] bg-white p-0.5">
              <button
                onClick={() => setView("tabela")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-[5px] transition-colors",
                  view === "tabela" ? "bg-[hsl(176_84%_25%)] text-white" : "text-[hsl(210_14%_42%)] hover:bg-[hsl(200_18%_96%)]"
                )}
              >
                Tabela
              </button>
              <button
                onClick={() => setView("cards")}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-semibold rounded-[5px] transition-colors",
                  view === "cards" ? "bg-[hsl(176_84%_25%)] text-white" : "text-[hsl(210_14%_42%)] hover:bg-[hsl(200_18%_96%)]"
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
                        <p className="font-mono text-[12px] font-semibold text-[hsl(180_80%_18%)] hover:underline">
                          {v.codigo}
                        </p>
                        <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5 font-mono">
                          {v.cavalo} · {v.carreta}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-[13px] font-medium">{v.motorista}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] font-mono">{v.motoristaCpf}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[12px] truncate max-w-[200px]">{v.origem.split("·")[0].trim()}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] truncate max-w-[200px]">→ {v.destino.split("·")[0].trim()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[12px]">{v.produto}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] num">{v.km} km</p>
                    </TableCell>
                    <TableCell>
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-12 h-1 rounded-full bg-[hsl(200_18%_94%)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${v.conformidade}%`,
                              background:
                                v.conformidade >= 90
                                  ? "linear-gradient(90deg, hsl(176 84% 30%), hsl(142 71% 36%))"
                                  : v.conformidade >= 70
                                  ? "linear-gradient(90deg, hsl(36 95% 50%), hsl(24 88% 42%))"
                                  : "linear-gradient(90deg, hsl(0 78% 50%), hsl(0 70% 38%))",
                            }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-[13px] font-bold num min-w-[36px] text-right",
                            v.conformidade >= 90
                              ? "text-[hsl(142_71%_24%)]"
                              : v.conformidade >= 70
                              ? "text-[hsl(24_88%_32%)]"
                              : "text-[hsl(0_70%_38%)]"
                          )}
                        >
                          {v.conformidade}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[11px] text-[hsl(210_14%_42%)] num whitespace-nowrap">
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
                      ? "border-[hsl(0_72%_80%)] bg-[hsl(0_72%_98%)]"
                      : "border-[hsl(200_18%_92%)] hover:border-[hsl(176_60%_60%)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-[12px] font-semibold text-[hsl(180_80%_18%)]">{v.codigo}</p>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5 font-mono">
                        {v.cavalo} · {v.carreta}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={v.status} size="sm" />
                      <RegimeBadge regime={v.regimeLimpeza} size="sm" />
                    </div>
                  </div>
                  <p className="text-[14px] font-semibold mb-1">{v.motorista}</p>
                  <p className="text-[12px] text-[hsl(210_14%_42%)] mb-1">{v.produto} · <span className="num">{v.km} km</span></p>
                  <p className="text-[11px] text-[hsl(210_12%_58%)] truncate">
                    {v.origem.split("·")[0].trim()} → {v.destino.split("·")[0].trim()}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[hsl(200_18%_94%)] flex items-center justify-between">
                    <span className="text-[11px] text-[hsl(210_14%_42%)] num">{formatDateTime(v.iniciadaEm)}</span>
                    <span
                      className={cn(
                        "text-[14px] font-bold num",
                        v.conformidade >= 90
                          ? "text-[hsl(142_71%_24%)]"
                          : v.conformidade >= 70
                          ? "text-[hsl(24_88%_32%)]"
                          : "text-[hsl(0_70%_38%)]"
                      )}
                    >
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

function StatLine({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  tone?: "info" | "danger" | "success";
}) {
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center shrink-0",
            tone === "danger" && "bg-[hsl(0_72%_94%)] text-[hsl(0_70%_38%)]",
            tone === "success" && "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]",
            tone === "info" && "bg-[hsl(174_64%_94%)] text-[hsl(180_80%_18%)]",
            !tone && "bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]"
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(210_14%_42%)] font-semibold">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[22px] font-bold num tracking-tight leading-none">{value}</p>
          </div>
          <p className="text-[10px] text-[hsl(210_12%_58%)] mt-0.5">{sub}</p>
        </div>
      </div>
    </Card>
  );
}
