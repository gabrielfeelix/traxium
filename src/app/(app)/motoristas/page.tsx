"use client";

import { useState } from "react";
import {
  IdCard,
  Search,
  Download,
  Phone,
  MoreHorizontal,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shell/status-badge";
import { motoristas } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/store/session";
import { CadastrarMotoristaModal } from "@/components/modals/cadastrar-motorista-modal";
import { AgendarTreinamentoModal } from "@/components/modals/agendar-treinamento-modal";
import { RenovarCertificacaoModal, type RenovarTarget } from "@/components/modals/renovar-certificacao-modal";

export default function MotoristasPage() {
  const { toast } = useToast();
  const { version } = useSession();
  const [search, setSearch] = useState("");
  const [treinoOpen, setTreinoOpen] = useState(false);
  const [treinoPre, setTreinoPre] = useState<string[]>([]);
  const [renovarTarget, setRenovarTarget] = useState<RenovarTarget | null>(null);
  function abrirTreino(pre: string[]) { setTreinoPre(pre); setTreinoOpen(true); }
  const filtered = motoristas.filter((m) => m.nome.toLowerCase().includes(search.toLowerCase()));

  const initials = (nome: string) =>
    nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Motoristas e subcontratados"
        description="Gerencie motoristas próprios, agregados e subcontratados. Cada motorista opera sob o FSMS da transportadora contratante e precisa de certificação válida."
        actions={
          <>
            <Button
              variant="outline" size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-motoristas",
                  ["Nome", "Tipo", "CNH cat.", "Cidade", "UF", "Viagens", "Conformidade %", "Status", "Letramento"],
                  motoristas.map((m) => [m.nome, m.tipo, m.cnh.categoria, m.cidade, m.uf, m.totalViagens, m.conformidadeMedia, m.status, m.letramentoDigital])
                );
                toast("CSV exportado", { desc: `${motoristas.length} motoristas.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={() => abrirTreino([])}>
              <GraduationCap className="size-4" /> Agendar treinamento
            </Button>
            <CadastrarMotoristaModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SmallStat icon={<Users />} label="Total" value={motoristas.length} />
        <SmallStat icon={<CheckCircle2 />} label="Ativos" value={motoristas.filter((m) => m.status === "Ativo" || m.status === "Em viagem").length} variant="success" />
        <SmallStat icon={<AlertCircle />} label="Bloqueados" value={motoristas.filter((m) => m.status === "Bloqueado").length} variant="danger" />
        <SmallStat icon={<TrendingUp />} label="Conf. média" value={`${(motoristas.reduce((acc, m) => acc + m.conformidadeMedia, 0) / motoristas.length).toFixed(1)}%`} />
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="proprios">Próprios</TabsTrigger>
          <TabsTrigger value="agregados">Agregados</TabsTrigger>
          <TabsTrigger value="subcontratados">Subcontratados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(215_16%_47%)]" />
                <Input placeholder="Buscar motorista…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>CNH</TableHead>
                    <TableHead>Certificações</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Letramento</TableHead>
                    <TableHead className="text-right">Viagens</TableHead>
                    <TableHead className="text-right">Conformidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m) => {
                    const vencidas = m.certificacoes.filter((c) => c.status === "Vencida" || c.status === "Pendente").length;
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback>{initials(m.nome)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{m.nome}</p>
                              <p className="text-[10px] text-[hsl(215_16%_60%)] font-mono">{m.cpf}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={m.tipo === "Subcontratado" ? "secondary" : m.tipo === "Agregado" ? "warning" : "default"} className="text-[10px]">
                            {m.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-mono">Cat. {m.cnh.categoria}</p>
                          <p className="text-[10px] text-[hsl(215_16%_60%)]">vence {formatDate(m.cnh.vencimento)}</p>
                        </TableCell>
                        <TableCell>
                          {vencidas > 0 ? (
                            <Badge variant="destructive" className="text-[10px]">
                              {vencidas} pendente{vencidas > 1 ? "s" : ""}
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px]">
                              <CheckCircle2 className="size-2.5" /> Em dia
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">{m.cidade}/{m.uf}</p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={m.letramentoDigital === "Alto" ? "success" : m.letramentoDigital === "Médio" ? "warning" : "muted"}
                            className="text-[10px]"
                          >
                            {m.letramentoDigital}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">{m.totalViagens}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "text-sm font-bold tabular-nums",
                              m.conformidadeMedia >= 95
                                ? "text-[hsl(142_71%_30%)]"
                                : m.conformidadeMedia >= 80
                                ? "text-[hsl(32_95%_30%)]"
                                : "text-[hsl(0_72%_40%)]"
                            )}
                          >
                            {m.conformidadeMedia.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={m.status} size="sm" />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast(m.nome, { type: "info", desc: `${m.tipo} · ${m.cidade}/${m.uf} · ${m.totalViagens} viagens` })}>Detalhes</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${m.telefone.replace(/\D/g, "")}`, "_blank", "noopener")}>
                                <Phone className="size-4" /> Contatar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => abrirTreino([m.id])}>
                                <GraduationCap className="size-4" /> Agendar treinamento
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast(`Histórico de ${m.nome}`, { type: "info", desc: `${m.totalViagens} viagens registradas` })}>Histórico de viagens</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setRenovarTarget({ kind: "motorista", id: m.id, nome: m.nome, certs: m.certificacoes })}>Renovar certificação</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proprios">
          <SubList motoristas={motoristas.filter((m) => m.tipo === "Próprio")} initials={initials} />
        </TabsContent>
        <TabsContent value="agregados">
          <SubList motoristas={motoristas.filter((m) => m.tipo === "Agregado")} initials={initials} />
        </TabsContent>
        <TabsContent value="subcontratados">
          <SubList motoristas={motoristas.filter((m) => m.tipo === "Subcontratado")} initials={initials} />
        </TabsContent>
      </Tabs>

      <AgendarTreinamentoModal open={treinoOpen} onOpenChange={setTreinoOpen} preselect={treinoPre} />
      <RenovarCertificacaoModal open={!!renovarTarget} onOpenChange={(o) => { if (!o) setRenovarTarget(null); }} target={renovarTarget} />
    </div>
  );
}

function SubList({ motoristas, initials }: { motoristas: typeof import("@/lib/mock-data").motoristas; initials: (n: string) => string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{motoristas.length} motoristas</CardTitle>
        <CardDescription>Operando sob o FSMS da transportadora ativa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {motoristas.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215_20%_92%)] hover:bg-[hsl(174_64%_98%)]">
            <Avatar><AvatarFallback>{initials(m.nome)}</AvatarFallback></Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{m.nome}</p>
              <p className="text-[11px] text-[hsl(215_16%_47%)]">{m.cidade}/{m.uf} · {m.totalViagens} viagens · {m.conformidadeMedia.toFixed(1)}% conformidade</p>
            </div>
            <StatusBadge status={m.status} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SmallStat({ icon, label, value, variant }: { icon: React.ReactNode; label: string; value: number | string; variant?: "success" | "danger" }) {
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
