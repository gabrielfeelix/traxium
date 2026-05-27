"use client";

import { useState } from "react";
import {
  AlertOctagon,
  Filter,
  Download,
  Search,
  ShieldAlert,
  Clock,
  CheckCheck,
  MessageSquare,
  Plus,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shell/status-badge";
import { naoConformidades } from "@/lib/mock-data";
import { cn, formatDateTime, relativeTime } from "@/lib/utils";

export default function BloqueiosPage() {
  const [filter, setFilter] = useState<"todas" | "abertas" | "tratamento" | "resolvidas">("todas");

  const filtered = naoConformidades.filter((nc) => {
    if (filter === "abertas") return nc.status === "Aberta";
    if (filter === "tratamento") return nc.status === "Em tratamento";
    if (filter === "resolvidas") return nc.status === "Resolvida" || nc.status === "Justificada";
    return true;
  });

  const counts = {
    abertas: naoConformidades.filter((n) => n.status === "Aberta").length,
    tratamento: naoConformidades.filter((n) => n.status === "Em tratamento").length,
    resolvidas: naoConformidades.filter((n) => n.status === "Resolvida").length,
    criticas: naoConformidades.filter((n) => n.severidade === "Crítica" && n.status !== "Resolvida").length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Não conformidades e bloqueios"
        description="Eventos que impedem ou ameaçam o cumprimento das normas GMP+ FSA e EUDR. Cada NC tem rastreabilidade completa desde a origem até a resolução, com responsável e prazo."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Exportar
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="size-4" /> Reportar NC manual
            </Button>
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
                <Input placeholder="Buscar código, motorista, viagem…" className="pl-9 h-9" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="size-4" /> Severidade
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="size-4" /> Categoria
              </Button>
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
                        Aberta em {formatDateTime(nc.abertaEm)} · há {relativeTime(nc.abertaEm)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="size-3.5" /> Tratar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[11px]">
                        Detalhes <ChevronRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
