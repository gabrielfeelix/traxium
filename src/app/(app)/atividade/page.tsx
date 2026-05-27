"use client";

import { Activity, Filter, Download, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { atividades } from "@/lib/mock-data";
import { cn, formatDateTime, relativeTime } from "@/lib/utils";

const tipoLabel: Record<string, string> = {
  viagem: "Viagem",
  checklist: "Checklist",
  nc: "Não Conformidade",
  dds: "TRACES NT",
  auditoria: "Auditoria",
  fazenda: "Fazenda EUDR",
};

export default function AtividadePage() {
  const extended = [
    ...atividades,
    ...atividades.map((a, i) => ({ ...a, id: `${a.id}-2`, quando: new Date(Date.now() - (i + 7) * 86400000).toISOString() })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Linha do tempo de atividade"
        description="Auditoria completa de eventos do sistema. Cada ação é registrada com timestamp, ator e payload para fins de rastreabilidade e auditoria GMP+."
        actions={
          <Button variant="outline" size="sm">
            <Download className="size-4" /> Exportar
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 flex-wrap">
          <Input placeholder="Buscar evento, ator, código…" className="max-w-md h-9" />
          <Button variant="outline" size="sm">
            <Filter className="size-4" /> Tipo de evento
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="size-4" /> Severidade
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="size-4" /> Período
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-5">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[hsl(215_20%_92%)]" />
            {extended.map((a) => {
              const Icon =
                a.severidade === "danger"
                  ? AlertTriangle
                  : a.severidade === "warning"
                  ? AlertCircle
                  : a.severidade === "success"
                  ? CheckCircle2
                  : Info;
              return (
                <div key={a.id} className="relative pl-12">
                  <div
                    className={cn(
                      "absolute left-0 top-0 size-8 rounded-full border-4 border-white flex items-center justify-center",
                      a.severidade === "danger" && "bg-[hsl(0_72%_51%)] text-white",
                      a.severidade === "warning" && "bg-[hsl(32_95%_44%)] text-white",
                      a.severidade === "success" && "bg-[hsl(142_71%_40%)] text-white",
                      a.severidade === "info" && "bg-[hsl(200_90%_36%)] text-white"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{a.titulo}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {tipoLabel[a.tipo]}
                        </Badge>
                      </div>
                      <p className="text-xs text-[hsl(215_16%_47%)] mt-1">{a.descricao}</p>
                      <p className="text-[11px] text-[hsl(215_16%_60%)] mt-1.5">
                        <span className="font-medium">{a.ator}</span> · {formatDateTime(a.quando)} · {relativeTime(a.quando)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">Eventos hoje</p>
          <p className="text-3xl font-bold tabular-nums mt-2">1,247</p>
          <p className="text-[11px] text-[hsl(142_71%_30%)] mt-1">+12% vs ontem</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">Eventos críticos (24h)</p>
          <p className="text-3xl font-bold tabular-nums text-[hsl(0_72%_40%)] mt-2">3</p>
          <p className="text-[11px] text-[hsl(215_16%_47%)] mt-1">Todos tratados ou em tratamento</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">Tempo médio de resposta</p>
          <p className="text-3xl font-bold tabular-nums mt-2">4m 22s</p>
          <p className="text-[11px] text-[hsl(215_16%_47%)] mt-1">Da detecção à ação</p>
        </Card>
      </div>
    </div>
  );
}
