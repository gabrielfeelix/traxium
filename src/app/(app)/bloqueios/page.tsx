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
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Zap,
  GitBranch,
  Wrench,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shell/status-badge";
import { naoConformidades, type NaoConformidade } from "@/lib/mock-data";
import { ReportarNCModal } from "@/components/modals/reportar-nc-modal";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

export default function BloqueiosPage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"todas" | "abertas" | "tratamento" | "resolvidas">("todas");
  const [expanded, setExpanded] = useState<string | null>(null);
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
          icon={<ShieldAlert className="size-5" />}
          tone="danger"
          sub="bloqueando operações"
        />
        <StatTile
          label="Abertas"
          value={counts.abertas}
          icon={<AlertOctagon className="size-5" />}
          tone="warning"
          sub="sem responsável"
        />
        <StatTile
          label="Em tratamento"
          value={counts.tratamento}
          icon={<Clock className="size-5" />}
          tone="info"
          sub="prazo médio: 3d"
        />
        <StatTile
          label="Resolvidas (7d)"
          value={counts.resolvidas}
          icon={<CheckCheck className="size-5" />}
          tone="success"
          sub="ciclo médio: 1.4d"
        />
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="todas">
            Todas <span className="ml-1.5 text-[hsl(210_12%_58%)] num">({naoConformidades.length})</span>
          </TabsTrigger>
          <TabsTrigger value="abertas">
            Abertas <span className="ml-1.5 text-[hsl(0_70%_38%)] font-bold num">({counts.abertas})</span>
          </TabsTrigger>
          <TabsTrigger value="tratamento">
            Em tratamento <span className="ml-1.5 text-[hsl(24_88%_32%)] font-bold num">({counts.tratamento})</span>
          </TabsTrigger>
          <TabsTrigger value="resolvidas">
            Resolvidas <span className="ml-1.5 text-[hsl(142_71%_24%)] num">({counts.resolvidas})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-3 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[hsl(210_14%_42%)]" />
                <Input
                  placeholder="Buscar código, motorista, viagem…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={sev} onValueChange={setSev}>
                <SelectTrigger className="h-9 w-[150px]">
                  <Filter className="size-4 text-[hsl(210_14%_42%)]" />
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
                  <Filter className="size-4 text-[hsl(210_14%_42%)]" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Toda categoria</SelectItem>
                  {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {filtered.map((nc) => (
                <div
                  key={nc.id}
                  className={cn(
                    "group rounded-lg border p-4 hover:shadow-brand-md transition-all cursor-pointer",
                    nc.severidade === "Crítica" && "border-[hsl(0_72%_80%)] bg-gradient-to-r from-[hsl(0_72%_98%)] to-white",
                    nc.severidade === "Maior" && "border-[hsl(28_92%_80%)] bg-gradient-to-r from-[hsl(36_95%_98%)] to-white",
                    nc.severidade === "Menor" && "border-[hsl(200_18%_92%)]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Severity ribbon */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div
                        className={cn(
                          "size-11 rounded-xl flex items-center justify-center shadow-brand-sm",
                          nc.severidade === "Crítica" && "bg-gradient-to-br from-[hsl(0_78%_50%)] to-[hsl(0_70%_38%)] text-white",
                          nc.severidade === "Maior" && "bg-gradient-to-br from-[hsl(28_92%_48%)] to-[hsl(24_88%_38%)] text-white",
                          nc.severidade === "Menor" && "bg-gradient-to-br from-[hsl(48_95%_50%)] to-[hsl(38_90%_42%)] text-white"
                        )}
                      >
                        <AlertOctagon className="size-5" />
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-[0.1em]",
                          nc.severidade === "Crítica" && "text-[hsl(0_70%_38%)]",
                          nc.severidade === "Maior" && "text-[hsl(24_88%_32%)]",
                          nc.severidade === "Menor" && "text-[hsl(38_90%_28%)]"
                        )}
                      >
                        {nc.severidade}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[12px] font-bold text-[hsl(195_30%_8%)]">{nc.codigo}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {nc.categoria}
                        </Badge>
                        <StatusBadge status={nc.status} size="sm" />
                      </div>
                      <p className="text-[13px] font-medium leading-snug text-[hsl(195_30%_8%)]">{nc.descricao}</p>
                      <div className="flex items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-[hsl(210_14%_42%)] flex-wrap">
                        {nc.viagem && (
                          <span>
                            <span className="text-[hsl(210_12%_58%)]">Viagem:</span>{" "}
                            <span className="font-mono font-semibold">{nc.viagem}</span>
                          </span>
                        )}
                        {nc.motorista && (
                          <span>
                            <span className="text-[hsl(210_12%_58%)]">Motorista:</span>{" "}
                            <span className="font-semibold">{nc.motorista}</span>
                          </span>
                        )}
                        {nc.veiculo && (
                          <span>
                            <span className="text-[hsl(210_12%_58%)]">Veículo:</span>{" "}
                            <span className="font-mono font-semibold">{nc.veiculo}</span>
                          </span>
                        )}
                        {nc.responsavel && (
                          <span>
                            <span className="text-[hsl(210_12%_58%)]">Responsável:</span>{" "}
                            <span className="font-semibold">{nc.responsavel}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[hsl(210_12%_58%)] uppercase tracking-wider font-semibold mt-2">
                        Aberta em {formatDateTime(nc.abertaEm)}
                        {nc.capa && (
                          <span className={cn("ml-2", nc.capa.eficaciaVerificada ? "text-[hsl(142_71%_28%)]" : "text-[hsl(24_88%_32%)]")}>
                            · CAPA {nc.capa.eficaciaVerificada ? "eficácia verificada" : "em andamento"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => setExpanded(expanded === nc.id ? null : nc.id)}>
                        <MessageSquare className="size-3.5" /> CAPA
                        <ChevronDown className={cn("size-3 transition-transform", expanded === nc.id && "rotate-180")} />
                      </Button>
                      {nc.severidade === "Crítica" && (
                        <Button asChild variant="ghost" size="sm" className="text-[11px]">
                          <Link href="/excecoes">Exceção <ChevronRight className="size-3" /></Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {expanded === nc.id && nc.capa && <CapaPanel capa={nc.capa} />}
                </div>
              ))}
              {!filtered.length && (
                <p className="text-center text-[13px] text-[hsl(210_14%_42%)] py-8">
                  Nenhuma não conformidade para os filtros atuais.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CapaPanel({ capa }: { capa: NonNullable<NaoConformidade["capa"]> }) {
  return (
    <div className="mt-3 rounded-lg border border-[hsl(200_18%_92%)] bg-[hsl(200_18%_98%)] p-3.5 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-[hsl(210_14%_42%)]">
          CAPA · Correção e ação corretiva
        </span>
        <span
          className={cn(
            "ml-auto text-[10px] font-bold rounded px-1.5 py-0.5",
            capa.eficaciaVerificada ? "bg-[hsl(142_65%_93%)] text-[hsl(142_71%_24%)]" : "bg-[hsl(28_92%_92%)] text-[hsl(24_88%_32%)]"
          )}
        >
          {capa.eficaciaVerificada ? "Eficácia verificada" : "Eficácia pendente"}
        </span>
      </div>
      <CapaStep icon={<Zap className="size-3.5" />} tone="amber" titulo="Ação imediata (contenção)" texto={capa.acaoImediata} />
      <CapaStep icon={<GitBranch className="size-3.5" />} tone="red" titulo="Causa raiz" texto={capa.causaRaiz} />
      <CapaStep icon={<Wrench className="size-3.5" />} tone="teal" titulo="Ação corretiva" texto={capa.acaoCorretiva} />
      <div className="flex items-center gap-4 text-[11px] text-[hsl(210_14%_42%)] pt-2 border-t border-[hsl(200_18%_92%)]">
        <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3.5" /> {capa.responsavelAcao}</span>
        <span className="inline-flex items-center gap-1"><CalendarClock className="size-3.5" /> prazo {formatDate(capa.prazo)}</span>
      </div>
    </div>
  );
}

function CapaStep({
  icon,
  tone,
  titulo,
  texto,
}: {
  icon: React.ReactNode;
  tone: "amber" | "red" | "teal";
  titulo: string;
  texto: string;
}) {
  const c = {
    amber: "bg-[hsl(28_92%_48%)]",
    red: "bg-[hsl(0_78%_50%)]",
    teal: "bg-[hsl(176_84%_25%)]",
  }[tone];
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn("size-6 rounded-md flex items-center justify-center text-white shrink-0", c)}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(210_14%_42%)]">{titulo}</p>
        <p className="text-[12px] text-[hsl(195_30%_8%)] leading-snug">{texto}</p>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  tone,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "danger" | "warning" | "info" | "success";
  sub: string;
}) {
  const colors = {
    danger: { bg: "bg-gradient-to-br from-[hsl(0_72%_94%)] to-[hsl(0_72%_98%)]", icon: "bg-[hsl(0_78%_50%)] text-white", text: "text-[hsl(0_70%_28%)]" },
    warning: { bg: "bg-gradient-to-br from-[hsl(36_95%_94%)] to-[hsl(36_95%_98%)]", icon: "bg-[hsl(28_92%_48%)] text-white", text: "text-[hsl(24_88%_28%)]" },
    info: { bg: "bg-gradient-to-br from-[hsl(174_64%_94%)] to-[hsl(174_64%_98%)]", icon: "bg-[hsl(176_84%_25%)] text-white", text: "text-[hsl(180_80%_18%)]" },
    success: { bg: "bg-gradient-to-br from-[hsl(142_65%_94%)] to-[hsl(142_65%_98%)]", icon: "bg-[hsl(142_71%_36%)] text-white", text: "text-[hsl(142_71%_22%)]" },
  };
  const c = colors[tone];
  return (
    <Card className={cn("p-4", c.bg)}>
      <div className="flex items-start gap-3">
        <div className={cn("size-10 rounded-lg flex items-center justify-center shadow-brand-sm shrink-0", c.icon)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-[10px] uppercase tracking-[0.12em] font-bold", c.text)}>{label}</p>
          <p className={cn("text-[28px] font-bold num tracking-tight leading-none mt-0.5", c.text)}>{value}</p>
          <p className="text-[10px] text-[hsl(210_14%_42%)] mt-1">{sub}</p>
        </div>
      </div>
    </Card>
  );
}
