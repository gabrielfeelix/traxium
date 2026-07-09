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
  XCircle,
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
import { StatTile } from "@/components/kit/stat-tile";
import { motoristas } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/store/session";
import { CadastrarMotoristaModal } from "@/components/modals/cadastrar-motorista-modal";
import { AgendarTreinamentoModal } from "@/components/modals/agendar-treinamento-modal";
import { RenovarCertificacaoModal, type RenovarTarget } from "@/components/modals/renovar-certificacao-modal";
import { Credencial } from "@/components/motoristas/credencial";
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { viagens, type Motorista } from "@/lib/mock-data";
import Link from "next/link";

const confClass = (n: number) =>
  n >= 95 ? "text-success-700" : n >= 80 ? "text-warning-700" : "text-danger-700";

export default function MotoristasPage() {
  const { toast } = useToast();
  const { version } = useSession();
  const [search, setSearch] = useState("");
  const [treinoOpen, setTreinoOpen] = useState(false);
  const [treinoPre, setTreinoPre] = useState<string[]>([]);
  const [renovarTarget, setRenovarTarget] = useState<RenovarTarget | null>(null);
  // Herói conectado ao detalhe: clicar numa credencial foca o motorista na tabela.
  const [foco, setFoco] = useState<string | null>(null);
  // "Detalhes"/"Histórico" do kebab abrem o dossiê do motorista em painel lateral.
  const [detalhe, setDetalhe] = useState<Motorista | null>(null);
  function abrirTreino(pre: string[]) { setTreinoPre(pre); setTreinoOpen(true); }
  const filtered = motoristas.filter((m) =>
    foco ? m.id === foco : m.nome.toLowerCase().includes(search.toLowerCase())
  );

  // Deck de credenciais: quem precisa de atenção primeiro.
  const deck = [...motoristas].sort((a, b) => {
    const peso = (m: (typeof motoristas)[number]) =>
      m.status === "Bloqueado" ? 0 : m.certificacoes.some((c) => c.status !== "Válida") ? 1 : 2;
    return peso(a) - peso(b) || b.conformidadeMedia - a.conformidadeMedia;
  });

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
        <StatTile icon={Users} label="Total" value={motoristas.length} />
        <StatTile icon={CheckCircle2} label="Ativos" value={motoristas.filter((m) => m.status === "Ativo" || m.status === "Em viagem").length} tone="success" />
        <StatTile icon={AlertCircle} label="Bloqueados" value={motoristas.filter((m) => m.status === "Bloqueado").length} tone="danger" />
        <StatTile icon={TrendingUp} label="Conf. média" value={`${(motoristas.reduce((acc, m) => acc + m.conformidadeMedia, 0) / motoristas.length).toFixed(1)}%`} />
      </div>

      {/* Momento-assinatura: o deck de credenciais de qualificação. */}
      <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Credenciais de qualificação</h2>
            <p className="text-[12px] text-fg-muted leading-snug mt-0.5 max-w-2xl">
              O crachá de cada motorista: anel de conformidade, CNH e certificações com validade.
              Quem precisa de atenção aparece primeiro. Clique para focar na tabela.
            </p>
          </div>
          {foco && (
            <Button variant="outline" size="sm" onClick={() => setFoco(null)}>
              <XCircle className="size-3.5" /> Limpar foco
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {deck.map((m) => (
            <Credencial
              key={m.id}
              m={m}
              selecionado={foco === m.id}
              onFocar={() => setFoco(foco === m.id ? null : m.id)}
              onTreinar={() => abrirTreino([m.id])}
              onRenovar={() => setRenovarTarget({ kind: "motorista", id: m.id, nome: m.nome, certs: m.certificacoes })}
            />
          ))}
        </div>
      </section>

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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-muted" />
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
                              <p className="text-[10px] text-fg-soft font-mono">{m.cpf}</p>
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
                          <p className="text-[10px] text-fg-soft">vence {formatDate(m.cnh.vencimento)}</p>
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
                          <span className={cn("text-sm font-bold tabular-nums", confClass(m.conformidadeMedia))}>
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
                              <DropdownMenuItem onClick={() => setDetalhe(m)}>Detalhes</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${m.telefone.replace(/\D/g, "")}`, "_blank", "noopener")}>
                                <Phone className="size-4" /> Contatar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => abrirTreino([m.id])}>
                                <GraduationCap className="size-4" /> Agendar treinamento
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDetalhe(m)}>Histórico de viagens</DropdownMenuItem>
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

      {/* Dossiê do motorista: credencial + histórico real de viagens. */}
      <Sheet open={!!detalhe} onOpenChange={(o) => { if (!o) setDetalhe(null); }}>
        <SheetContent>
          {detalhe && (
            <>
              <SheetHeader>
                <SheetTitle>{detalhe.nome}</SheetTitle>
                <SheetDescription>
                  {detalhe.tipo} · {detalhe.cidade}/{detalhe.uf} · letramento digital {detalhe.letramentoDigital.toLowerCase()}
                </SheetDescription>
              </SheetHeader>
              <SheetBody className="space-y-4">
                <Credencial
                  m={detalhe}
                  selecionado={false}
                  onFocar={() => { setFoco(detalhe.id); setDetalhe(null); }}
                  onTreinar={() => { setDetalhe(null); abrirTreino([detalhe.id]); }}
                  onRenovar={() => { setDetalhe(null); setRenovarTarget({ kind: "motorista", id: detalhe.id, nome: detalhe.nome, certs: detalhe.certificacoes }); }}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-fg-muted mb-2">
                    Histórico de viagens
                  </p>
                  {(() => {
                    const doMotorista = viagens.filter((v) => v.motorista === detalhe.nome);
                    return doMotorista.length ? (
                      <div className="space-y-1.5">
                        {doMotorista.map((v) => (
                          <Link
                            key={v.id}
                            href={`/viagens/${v.id}`}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-border-soft hover:border-brand-500/40 hover:bg-brand-50/40 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-[12px] font-semibold text-brand-700">{v.codigo}</p>
                              <p className="text-[10px] text-fg-muted truncate">
                                {v.produto} · {v.origem.split("·")[0].trim()} → {v.destino.split("·")[0].trim()}
                              </p>
                            </div>
                            <StatusBadge status={v.status} size="sm" />
                            <span className={cn("text-[12px] font-bold num", confClass(v.conformidade))}>{v.conformidade}%</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-fg-muted">
                        Nenhuma viagem registrada no recorte do protótipo — total histórico:{" "}
                        <span className="num font-semibold">{detalhe.totalViagens}</span>.
                      </p>
                    );
                  })()}
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
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
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-border-soft hover:bg-brand-50/50">
            <Avatar><AvatarFallback>{initials(m.nome)}</AvatarFallback></Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{m.nome}</p>
              <p className="text-[11px] text-fg-muted">{m.cidade}/{m.uf} · {m.totalViagens} viagens · {m.conformidadeMedia.toFixed(1)}% conformidade</p>
            </div>
            <StatusBadge status={m.status} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
