"use client";

import { useState } from "react";
import { Filter, Download, AlertTriangle, CheckCircle2, Info, AlertCircle, Cpu, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { atividades, type Atividade } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

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

/** Agrupa eventos por dia, mais recentes primeiro. */
function agruparPorDia(evs: Atividade[]) {
  const ordenados = [...evs].sort((a, b) => b.quando.localeCompare(a.quando));
  const grupos: { dia: string; rotulo: string; eventos: Atividade[] }[] = [];
  for (const ev of ordenados) {
    const dia = ev.quando.slice(0, 10);
    let g = grupos[grupos.length - 1];
    if (!g || g.dia !== dia) {
      const diasAtras = Math.floor((BASE_TS - new Date(`${dia}T00:00:00`).getTime()) / 86400000);
      g = { dia, rotulo: diasAtras === 0 ? "Hoje" : diasAtras === 1 ? "Ontem" : formatDate(dia), eventos: [] };
      grupos.push(g);
    }
    g.eventos.push(ev);
  }
  return grupos;
}

/** Avatar do ator: iniciais para humanos, chip de sistema para o motor/gateway. */
function AtorChip({ ator }: { ator: string }) {
  const sistema = /motor|sistema|gateway|validador/i.test(ator);
  const iniciais = ator.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-fg-soft">
      <span
        className={cn(
          "size-[18px] rounded-full text-white flex items-center justify-center shrink-0",
          sistema ? "bg-ink" : "bg-gradient-to-br from-brand-600 to-sky-600 text-[8px] font-bold"
        )}
      >
        {sistema ? <Cpu className="size-2.5" aria-hidden /> : iniciais}
      </span>
      {ator}
    </span>
  );
}

export default function AtividadePage() {
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [sev, setSev] = useState("todas");
  const [periodo, setPeriodo] = useState("todos");
  // Disclosure do registro bruto (payload) — um por vez.
  const [aberto, setAberto] = useState<string | null>(null);

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
            <SelectTrigger className="h-9 w-[170px]"><Filter className="size-4 text-fg-muted" /><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo tipo</SelectItem>
              {Object.entries(tipoLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger className="h-9 w-[150px]"><Filter className="size-4 text-fg-muted" /><SelectValue placeholder="Severidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda severidade</SelectItem>
              <SelectItem value="danger">Crítico</SelectItem>
              <SelectItem value="warning">Atenção</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="h-9 w-[140px]"><Filter className="size-4 text-fg-muted" /><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo período</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-4">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-soft" />
            {agruparPorDia(filtrados).map((g) => (
              <div key={g.dia} className="space-y-4">
                {/* Separador do dia — nó vazado na linha */}
                <div className="relative pl-12 pt-1">
                  <span className="absolute left-[9px] top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-bg-elev border-2 border-brand-500" aria-hidden />
                  <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-fg-muted">{g.rotulo}</span>
                  <span className="text-[10px] text-fg-soft num"> · {g.eventos.length} evento{g.eventos.length > 1 ? "s" : ""}</span>
                </div>

                {g.eventos.map((a) => {
                  const Icon =
                    a.severidade === "danger"
                      ? AlertTriangle
                      : a.severidade === "warning"
                      ? AlertCircle
                      : a.severidade === "success"
                      ? CheckCircle2
                      : Info;
                  const expandido = aberto === a.id;
                  return (
                    <div key={a.id} className="relative pl-12">
                      <div
                        className={cn(
                          "absolute left-0 top-0 size-8 rounded-full border-4 border-bg-elev flex items-center justify-center text-white",
                          a.severidade === "danger" && "bg-danger-500",
                          a.severidade === "warning" && "bg-warning-500",
                          a.severidade === "success" && "bg-success-500",
                          (!a.severidade || a.severidade === "info") && "bg-sky-500"
                        )}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13px] font-semibold">{a.titulo}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {tipoLabel[a.tipo]}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-fg-muted mt-1">{a.descricao}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <AtorChip ator={a.ator} />
                        <span className="text-[11px] text-fg-soft num">{formatDateTime(a.quando)}</span>
                        <button
                          type="button"
                          aria-expanded={expandido}
                          onClick={() => setAberto(expandido ? null : a.id)}
                          className="inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold text-fg-soft hover:text-brand-600 transition-colors"
                        >
                          payload
                          <ChevronDown className={cn("size-3 transition-transform", expandido && "rotate-180")} aria-hidden />
                        </button>
                      </div>
                      {expandido && (
                        <pre className="mt-2 rounded-md bg-ink text-white/85 font-mono text-[10px] leading-relaxed p-3 overflow-x-auto">
{JSON.stringify(
  { id: a.id, tipo: a.tipo, severidade: a.severidade ?? "info", ator: a.ator, quando: a.quando, titulo: a.titulo, descricao: a.descricao },
  null,
  2
)}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
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
          <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">Eventos listados</p>
          <p className="text-[28px] font-bold num tracking-[-0.02em] mt-2">{filtrados.length}</p>
          <p className="text-[11px] text-fg-muted mt-1">no filtro atual</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">Eventos críticos</p>
          <p className="text-[28px] font-bold num tracking-[-0.02em] text-danger-700 mt-2">{filtrados.filter((a) => a.severidade === "danger").length}</p>
          <p className="text-[11px] text-fg-muted mt-1">no filtro atual</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold">Tempo médio de resposta</p>
          <p className="text-[28px] font-bold num tracking-[-0.02em] mt-2">4m 22s</p>
          <p className="text-[11px] text-fg-muted mt-1">da detecção à ação · simulado</p>
        </Card>
      </div>
    </div>
  );
}
