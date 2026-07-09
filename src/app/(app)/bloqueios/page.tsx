"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  Filter,
  Download,
  Search,
  ShieldAlert,
  Clock,
  CheckCheck,
  ChevronRight,
  Zap,
  GitBranch,
  Wrench,
  ShieldCheck,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shell/status-badge";
import { StatTile } from "@/components/kit/stat-tile";
import { ChainConn, ChainNode } from "@/components/kit/causal-chain";
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { avaliarCapa } from "@/lib/domain/rules-engine";
import { naoConformidades, type NaoConformidade } from "@/lib/mock-data";
import { ReportarNCModal } from "@/components/modals/reportar-nc-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

// Severidade: barra de acento + chip sutil — sinal sem pintar o card inteiro.
const SEV_META = {
  Crítica: { accent: "bg-danger-500", chip: "bg-danger-50 text-danger-700" },
  Maior: { accent: "bg-warning-500", chip: "bg-warning-50 text-warning-700" },
  Menor: { accent: "bg-warning-500/50", chip: "bg-warning-50/60 text-warning-700" },
} as const;

export default function BloqueiosPage() {
  const { version, updateNCCapa } = useSession();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"todas" | "abertas" | "tratamento" | "resolvidas">("todas");
  // O tratamento abre em painel lateral (Sheet) — a lista fica limpa atrás.
  const [capaNC, setCapaNC] = useState<NaoConformidade | null>(null);
  const [busca, setBusca] = useState("");
  const [sev, setSev] = useState("todas");
  const [cat, setCat] = useState("todas");

  const categorias = [...new Set(naoConformidades.map((n) => n.categoria))];

  const filtered = naoConformidades.filter((nc) => {
    const statusOk =
      filter === "abertas" ? nc.status === "Aberta"
      : filter === "tratamento" ? nc.status === "Em tratamento"
      : filter === "resolvidas" ? nc.status === "Resolvida" || nc.status === "Justificada"
      : true;
    const q = busca.trim().toLowerCase();
    const buscaOk = !q || [nc.codigo, nc.motorista, nc.viagem, nc.veiculo, nc.descricao, nc.responsavel]
      .some((v) => v?.toLowerCase().includes(q));
    const sevOk = sev === "todas" || nc.severidade === sev;
    const catOk = cat === "todas" || nc.categoria === cat;
    return statusOk && buscaOk && sevOk && catOk;
  });

  const counts = {
    abertas: naoConformidades.filter((n) => n.status === "Aberta").length,
    tratamento: naoConformidades.filter((n) => n.status === "Em tratamento").length,
    resolvidas: naoConformidades.filter((n) => n.status === "Resolvida").length,
    criticas: naoConformidades.filter((n) => n.severidade === "Crítica" && n.status !== "Resolvida").length,
  };

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Não conformidades e bloqueios"
        description="Eventos que impedem ou ameaçam o cumprimento das normas GMP+ FSA e EUDR. Cada NC tem rastreabilidade completa desde a origem até a resolução, com responsável e prazo."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                downloadCSV(
                  "traxium-nao-conformidades",
                  ["Código", "Severidade", "Categoria", "Descrição", "Status", "Responsável", "Causa raiz", "Ação corretiva"],
                  naoConformidades.map((n) => [
                    n.codigo, n.severidade, n.categoria, n.descricao, n.status, n.responsavel ?? "",
                    n.capa?.causaRaiz ?? "", n.capa?.acaoCorretiva ?? "",
                  ])
                );
                toast("CSV exportado", { desc: `${naoConformidades.length} NCs com CAPA.` });
              }}
            >
              <Download className="size-4" /> Exportar
            </Button>
            <ReportarNCModal />
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Críticas ativas"
          value={counts.criticas}
          icon={ShieldAlert}
          tone="danger"
          hint="bloqueando operações"
        />
        <StatTile
          label="Abertas"
          value={counts.abertas}
          icon={AlertOctagon}
          tone="warning"
          hint="sem responsável"
        />
        <StatTile
          label="Em tratamento"
          value={counts.tratamento}
          icon={Clock}
          tone="brand"
          hint="prazo médio: 3d"
        />
        <StatTile
          label="Resolvidas (7d)"
          value={counts.resolvidas}
          icon={CheckCheck}
          tone="success"
          hint="ciclo médio: 1.4d"
        />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="todas">
            Todas <span className="ml-1.5 text-fg-soft num">({naoConformidades.length})</span>
          </TabsTrigger>
          <TabsTrigger value="abertas">
            Abertas <span className="ml-1.5 text-danger-700 font-bold num">({counts.abertas})</span>
          </TabsTrigger>
          <TabsTrigger value="tratamento">
            Em tratamento <span className="ml-1.5 text-warning-700 font-bold num">({counts.tratamento})</span>
          </TabsTrigger>
          <TabsTrigger value="resolvidas">
            Resolvidas <span className="ml-1.5 text-success-700 num">({counts.resolvidas})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-3 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted" />
                <Input
                  placeholder="Buscar código, motorista, viagem…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={sev} onValueChange={setSev}>
                <SelectTrigger className="h-9 w-[150px]">
                  <Filter className="size-4 text-fg-muted" />
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Toda severidade</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Maior">Maior</SelectItem>
                  <SelectItem value="Menor">Menor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="h-9 w-[180px]">
                  <Filter className="size-4 text-fg-muted" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Toda categoria</SelectItem>
                  {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {filtered.map((nc) => {
                const S = SEV_META[nc.severidade];
                return (
                  <div
                    key={nc.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCapaNC(nc)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCapaNC(nc); } }}
                    className="group relative rounded-lg border border-border-soft bg-bg-elev overflow-hidden transition-all cursor-pointer hover:border-brand-500/40 hover:shadow-brand-sm"
                  >
                    <span className={cn("absolute left-0 top-0 bottom-0 w-1", S.accent)} aria-hidden />
                    <div className="flex items-start gap-4 p-3.5 pl-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-[12px] font-bold text-fg">{nc.codigo}</span>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", S.chip)}>
                            <AlertOctagon className="size-2.5" aria-hidden /> {nc.severidade}
                          </span>
                          <Badge variant="outline" className="text-[10px]">{nc.categoria}</Badge>
                          <StatusBadge status={nc.status} size="sm" />
                        </div>
                        <p className="text-[13px] font-medium leading-snug text-fg">{nc.descricao}</p>
                        <div className="flex items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-fg-muted flex-wrap">
                          {nc.viagem && (
                            <span><span className="text-fg-soft">Viagem:</span>{" "}<span className="font-mono font-semibold">{nc.viagem}</span></span>
                          )}
                          {nc.motorista && (
                            <span><span className="text-fg-soft">Motorista:</span>{" "}<span className="font-semibold">{nc.motorista}</span></span>
                          )}
                          {nc.veiculo && (
                            <span><span className="text-fg-soft">Veículo:</span>{" "}<span className="font-mono font-semibold">{nc.veiculo}</span></span>
                          )}
                          {nc.responsavel && (
                            <span><span className="text-fg-soft">Responsável:</span>{" "}<span className="font-semibold">{nc.responsavel}</span></span>
                          )}
                        </div>
                        <p className="text-[10px] text-fg-soft uppercase tracking-[0.1em] font-semibold mt-2">
                          Aberta em {formatDateTime(nc.abertaEm)}
                          {nc.capa && (
                            <span className={cn("ml-2", nc.capa.eficaciaVerificada ? "text-success-700" : "text-warning-700")}>
                              · CAPA {nc.capa.eficaciaVerificada ? "eficácia verificada" : "em andamento"}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 self-center text-[11px] font-semibold text-fg-soft group-hover:text-brand-600 transition-colors">
                        Tratar CAPA
                        <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                      </div>
                    </div>
                  </div>
                );
              })}
              {!filtered.length && (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <CheckCheck className="size-8 text-fg-soft" />
                  <p className="text-[13px] text-fg-muted">
                    Nenhuma não conformidade para os filtros atuais.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Painel lateral de tratamento — a cadeia CAPA abre por cima do contexto. */}
      <Sheet open={!!capaNC} onOpenChange={(o) => { if (!o) setCapaNC(null); }}>
        <SheetContent>
          {capaNC && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono">{capaNC.codigo}</span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]", SEV_META[capaNC.severidade].chip)}>
                    <AlertOctagon className="size-2.5" aria-hidden /> {capaNC.severidade}
                  </span>
                  <StatusBadge status={capaNC.status} size="sm" />
                </SheetTitle>
                <SheetDescription>{capaNC.descricao}</SheetDescription>
              </SheetHeader>
              <SheetBody className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  {capaNC.viagem && (
                    <div><p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft">Viagem</p><p className="font-mono font-semibold text-fg">{capaNC.viagem}</p></div>
                  )}
                  {capaNC.motorista && (
                    <div><p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft">Motorista</p><p className="font-semibold text-fg">{capaNC.motorista}</p></div>
                  )}
                  {capaNC.veiculo && (
                    <div><p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft">Veículo</p><p className="font-mono font-semibold text-fg">{capaNC.veiculo}</p></div>
                  )}
                  <div><p className="text-[9px] uppercase tracking-[0.12em] font-semibold text-fg-soft">Aberta em</p><p className="font-semibold text-fg num">{formatDateTime(capaNC.abertaEm)}</p></div>
                </div>

                <CapaPanel
                  key={capaNC.id}
                  nc={capaNC}
                  onUpdate={(patch) => { updateNCCapa(capaNC.id, patch); toast("CAPA atualizada", { desc: capaNC.codigo }); }}
                />

                {capaNC.severidade === "Crítica" && (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/excecoes">Solicitar exceção <ChevronRight className="size-3.5" /></Link>
                  </Button>
                )}
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CapaPanel({
  nc,
  onUpdate,
}: {
  nc: NaoConformidade;
  onUpdate: (patch: Partial<NonNullable<NaoConformidade["capa"]>>) => void;
}) {
  // NC sem plano ainda: começa em branco — salvar cria o CAPA no store.
  const capa = nc.capa ?? {
    acaoImediata: "", causaRaiz: "", acaoCorretiva: "",
    responsavelAcao: nc.responsavel ?? "", prazo: "", eficaciaVerificada: false,
  };
  const [acaoImediata, setAcaoImediata] = useState(capa.acaoImediata);
  const [causaRaiz, setCausaRaiz] = useState(capa.causaRaiz);
  const [acaoCorretiva, setAcaoCorretiva] = useState(capa.acaoCorretiva);
  const [responsavelAcao, setResponsavel] = useState(capa.responsavelAcao);
  const [prazo, setPrazo] = useState(capa.prazo && capa.prazo.length >= 10 ? capa.prazo.slice(0, 10) : "");
  const [eficacia, setEficacia] = useState(capa.eficaciaVerificada);

  const dirty =
    acaoImediata !== capa.acaoImediata || causaRaiz !== capa.causaRaiz ||
    acaoCorretiva !== capa.acaoCorretiva || responsavelAcao !== capa.responsavelAcao ||
    prazo !== (capa.prazo?.slice(0, 10) ?? "") || eficacia !== capa.eficaciaVerificada;

  // Veredito vivo: reage enquanto digita, direto do motor de regras.
  const av = avaliarCapa({ acaoImediata, causaRaiz, acaoCorretiva, eficaciaVerificada: eficacia });
  // Cadeia quebra na primeira etapa vazia (1 = contenção, 2 = causa raiz, 3 = corretiva).
  const quebraEm = av.situacao === "incompleta" ? av.etapasCompletas + 1 : null;
  const broken = (etapa: number) => quebraEm !== null && etapa >= quebraEm;

  const V = {
    eficaz: { ring: "ring-2 ring-regime-a border-transparent", fg: "text-regime-a-fg", Icon: ShieldCheck, rotulo: "CAPA eficaz" },
    aguardando_eficacia: { ring: "ring-2 ring-warning-500 border-transparent", fg: "text-warning-700", Icon: Clock, rotulo: "Aguardando eficácia" },
    incompleta: { ring: "ring-2 ring-danger-500 border-transparent", fg: "text-danger-700", Icon: XCircle, rotulo: "CAPA incompleta" },
  }[av.situacao];

  return (
    <div className="space-y-3">
      <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-fg-muted">
        CAPA · Cadeia de tratamento (editável)
      </span>

      {/* Assinatura: a cadeia causal É o formulário — vertical dentro do Sheet. */}
      <div className="flex flex-col gap-1">
        <ChainNode etapa="Evento">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-8 rounded-lg flex items-center justify-center text-white shrink-0",
                nc.severidade === "Crítica" ? "bg-danger-500" : "bg-warning-500"
              )}
            >
              <AlertOctagon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold text-fg leading-tight truncate">{nc.codigo}</p>
              <p className="text-[10px] text-fg-muted leading-tight truncate">{nc.categoria}</p>
            </div>
          </div>
        </ChainNode>

        <ChainConn vertical label="conter" broken={broken(1)} />

        <ChainNode etapa="Ação imediata" tone={quebraEm === 1 ? "border-danger-500/40" : undefined}>
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-warning-500 text-white flex items-center justify-center shrink-0">
              <Zap className="size-3.5" />
            </span>
            <Input
              aria-label="Ação imediata (contenção)"
              value={acaoImediata}
              onChange={(e) => setAcaoImediata(e.target.value)}
              className="h-8 text-[12px]"
              placeholder="Conter o dano"
            />
          </div>
        </ChainNode>

        <ChainConn vertical label="5 porquês" broken={broken(2)} />

        <ChainNode etapa="Causa raiz" tone={quebraEm === 2 ? "border-danger-500/40" : undefined}>
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-danger-500 text-white flex items-center justify-center shrink-0">
              <GitBranch className="size-3.5" />
            </span>
            <Input
              aria-label="Causa raiz"
              value={causaRaiz}
              onChange={(e) => setCausaRaiz(e.target.value)}
              className="h-8 text-[12px]"
              placeholder="Por que aconteceu?"
            />
          </div>
        </ChainNode>

        <ChainConn vertical label="corrigir" broken={broken(3)} />

        <ChainNode etapa="Ação corretiva" tone={quebraEm === 3 ? "border-danger-500/40" : undefined}>
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Wrench className="size-3.5" />
            </span>
            <Input
              aria-label="Ação corretiva"
              value={acaoCorretiva}
              onChange={(e) => setAcaoCorretiva(e.target.value)}
              className="h-8 text-[12px]"
              placeholder="Evitar reincidência"
            />
          </div>
        </ChainNode>

        <ChainConn
          vertical
          gate={av.situacao === "eficaz" ? "ok" : av.situacao === "aguardando_eficacia" ? "pending" : "fail"}
          gateLabel={av.situacao === "eficaz" ? "verificada" : av.situacao === "aguardando_eficacia" ? "pendente" : "impedida"}
          broken={quebraEm !== null}
        />

        <ChainNode etapa="Veredito" tone={V.ring}>
          <div className="flex items-center gap-2">
            <V.Icon className={cn("size-5 shrink-0", V.fg)} />
            <p className={cn("text-[13px] font-bold leading-tight", V.fg)}>{V.rotulo}</p>
          </div>
          <label className="mt-2 flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-fg-muted">
            <Switch checked={eficacia} onCheckedChange={setEficacia} />
            Eficácia verificada
          </label>
        </ChainNode>
      </div>

      <p className="text-[11px] text-fg-muted leading-relaxed border-t border-border-soft pt-2.5">{av.motivo}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted flex items-center gap-1"><ShieldCheck className="size-3" /> Responsável</Label>
          <Input value={responsavelAcao} onChange={(e) => setResponsavel(e.target.value)} className="h-8 mt-1" placeholder="Ex.: Gerência de Compliance" />
        </div>
        <div>
          <Label className="text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-muted flex items-center gap-1"><CalendarClock className="size-3" /> Prazo</Label>
          <Input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} className="h-8 mt-1" />
        </div>
      </div>

      <div className="flex items-center justify-end pt-1">
        <Button
          variant={dirty ? "gradient" : "outline"}
          size="sm"
          disabled={!dirty}
          onClick={() => onUpdate({ acaoImediata, causaRaiz, acaoCorretiva, responsavelAcao, prazo, eficaciaVerificada: eficacia })}
        >
          Salvar CAPA
        </Button>
      </div>
    </div>
  );
}

