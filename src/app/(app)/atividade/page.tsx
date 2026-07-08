"use client";

import { useState } from "react";
import { Filter, Download, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { atividades } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDateTime } from "@/lib/utils";

const tipoLabel: Record<string, string> = {
  viagem: "Viagem",
  checklist: "Checklist",
  nc: "Não Conformidade",
  dds: "TRACES NT",
  auditoria: "Auditoria",
  fazenda: "Fazenda EUDR",
};

// Base fixa (determinística) — evita Date.now() em render → sem hydration mismatch.
const BASE_TS = new Date("2026-07-08T09:00:00").getTime();
const extended = [
  ...atividades,
  ...atividades.map((a, i) => ({ ...a, id: `${a.id}-2`, quando: new Date(BASE_TS - (i + 7) * 86400000).toISOString() })),
];

export default function AtividadePage() {
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [sev, setSev] = useState("todas");
  const [periodo, setPeriodo] = useState("todos");

  const filtrados = extended.filter((a) => {
    const q = busca.trim().toLowerCase();
    const buscaOk = !q || [a.titulo, a.descricao, a.ator].some((v) => v.toLowerCase().includes(q));
    const tipoOk = tipo === "todos" || a.tipo === tipo;
    const sevOk = sev === "todas" || a.severidade === sev;
    const dias = Math.floor((BASE_TS - new Date(a.quando).getTime()) / 86400000);
    const periodoOk = periodo === "todos" || dias <= Number(periodo);
    return buscaOk && tipoOk && sevOk && periodoOk;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Linha do tempo de atividade"
        description="Auditoria completa de eventos do sistema. Cada ação é registrada com timestamp, ator e payload para fins de rastreabilidade e auditoria GMP+."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadCSV(
                "traxium-atividade",
                ["Evento", "Tipo", "Descrição", "Ator", "Severidade", "Quando"],
                filtrados.map((a) => [a.titulo, tipoLabel[a.tipo] ?? a.tipo, a.descricao, a.ator, a.severidade ?? "info", formatDateTime(a.quando)])
              );
              toast("CSV exportado", { desc: `${filtrados.length} evento(s).` });
            }}
          >
            <Download className="size-4" /> Exportar
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 flex-wrap">
          <Input
            placeholder="Buscar evento, ator, código…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-md h-9"
          />
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="h-9 w-[170px]"><Filter className="size-4 text-[hsl(210_14%_42%)]" /><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo tipo</SelectItem>
              {Object.entries(tipoLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger className="h-9 w-[150px]"><Filter className="size-4 text-[hsl(210_14%_42%)]" /><SelectValue placeholder="Severidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda severidade</SelectItem>
              <SelectItem value="danger">Crítico</SelectItem>
              <SelectItem value="warning">Atenção</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="h-9 w-[140px]"><Filter className="size-4 text-[hsl(210_14%_42%)]" /><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo período</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-5">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-soft" />
            {filtrados.map((a) => {
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
                      <p className="text-xs text-fg-muted mt-1">{a.descricao}</p>
                      <p className="text-[11px] text-fg-soft mt-1.5">
                        <span className="font-medium">{a.ator}</span> · {formatDateTime(a.quando)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {!filtrados.length && (
              <div className="pl-12 py-10 flex flex-col items-center text-center gap-2">
                <Info className="size-6 text-fg-soft" />
                <p className="text-[13px] text-fg-muted">Nenhum evento para os filtros atuais.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-fg-muted font-semibold">Eventos listados</p>
          <p className="text-3xl font-bold tabular-nums mt-2">{filtrados.length}</p>
          <p className="text-[11px] text-fg-muted mt-1">no filtro atual</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-fg-muted font-semibold">Eventos críticos</p>
          <p className="text-3xl font-bold tabular-nums text-[hsl(0_72%_40%)] mt-2">{filtrados.filter((a) => a.severidade === "danger").length}</p>
          <p className="text-[11px] text-fg-muted mt-1">no filtro atual</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-fg-muted font-semibold">Tempo médio de resposta</p>
          <p className="text-3xl font-bold tabular-nums mt-2">4m 22s</p>
          <p className="text-[11px] text-fg-muted mt-1">da detecção à ação · simulado</p>
        </Card>
      </div>
    </div>
  );
}
