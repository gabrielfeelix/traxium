"use client";

import { useState } from "react";
import { Container, Plus, Search, Download, Truck, Wrench, ShieldCheck, AlertTriangle, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shell/status-badge";
import { veiculos } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function FrotaPage() {
  const [search, setSearch] = useState("");
  const filtered = veiculos.filter((v) => v.placa.toLowerCase().includes(search.toLowerCase()) || v.modelo.toLowerCase().includes(search.toLowerCase()));
  const cavalos = filtered.filter((v) => v.tipo === "Cavalo");
  const carretas = filtered.filter((v) => v.tipo === "Carreta");
  const vencidas = veiculos.filter((v) => v.certificacaoGMP.status === "Vencida").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frota"
        description="Cavalos mecânicos e carretas cadastrados. A certificação GMP+ é validada antes de cada viagem; carretas vencidas geram bloqueio automático."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Exportar
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="size-4" /> Adicionar veículo
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Truck />} label="Cavalos" value={veiculos.filter((v) => v.tipo === "Cavalo").length} />
        <MetricCard icon={<Container />} label="Carretas" value={veiculos.filter((v) => v.tipo === "Carreta").length} />
        <MetricCard icon={<ShieldCheck />} label="Cert. válidas" value={veiculos.filter((v) => v.certificacaoGMP.status === "Válida").length} variant="success" />
        <MetricCard icon={<AlertTriangle />} label="Vencidas" value={vencidas} variant="danger" />
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos ({filtered.length})</TabsTrigger>
          <TabsTrigger value="cavalos">Cavalos ({cavalos.length})</TabsTrigger>
          <TabsTrigger value="carretas">Carretas ({carretas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(215_16%_47%)]" />
                <Input placeholder="Buscar placa ou modelo…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Carga</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Cert. GMP+</TableHead>
                    <TableHead>Próx. inspeção</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-sm font-semibold">{v.placa}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {v.tipo === "Cavalo" ? <Truck className="size-3" /> : <Container className="size-3" />}
                          {v.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{v.modelo}</p>
                        <p className="text-[10px] text-[hsl(215_16%_60%)]">{v.ano}</p>
                      </TableCell>
                      <TableCell className="text-xs text-[hsl(215_16%_47%)]">{v.tipoCarga || "—"}</TableCell>
                      <TableCell className="text-sm">{v.motorista || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={v.certificacaoGMP.status} size="sm" />
                        <p className="text-[10px] text-[hsl(215_16%_60%)] mt-0.5">vence {formatDate(v.certificacaoGMP.vencimento)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs tabular-nums">{formatDate(v.proximaInspecao)}</p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Wrench className="size-4" /> Agendar inspeção
                            </DropdownMenuItem>
                            <DropdownMenuItem>Renovar certificação</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cavalos" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Motorista vinculado</TableHead>
                    <TableHead>Certificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cavalos.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono font-semibold">{v.placa}</TableCell>
                      <TableCell>{v.modelo} · {v.ano}</TableCell>
                      <TableCell>{v.motorista || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={v.certificacaoGMP.status} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carretas" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Tipo de carga</TableHead>
                    <TableHead>Certificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carretas.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono font-semibold">{v.placa}</TableCell>
                      <TableCell>{v.modelo} · {v.ano}</TableCell>
                      <TableCell>{v.tipoCarga || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={v.certificacaoGMP.status} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ icon, label, value, variant }: { icon: React.ReactNode; label: string; value: number; variant?: "success" | "danger" }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center",
            variant === "success" && "bg-[hsl(142_71%_95%)] text-[hsl(142_71%_28%)]",
            variant === "danger" && "bg-[hsl(0_72%_95%)] text-[hsl(0_72%_40%)]",
            !variant && "bg-[hsl(174_64%_96%)] text-[hsl(174_72%_25%)]"
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
        </div>
      </div>
    </Card>
  );
}
