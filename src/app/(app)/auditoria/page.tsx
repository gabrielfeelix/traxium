"use client";

import {
  ShieldCheck,
  Plus,
  Download,
  Calendar,
  FileText,
  Users,
  CheckCircle2,
  AlertOctagon,
  ClipboardCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shell/status-badge";
import { auditorias } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";

export default function AuditoriaPage() {
  const programada = auditorias.find((a) => a.status === "Programada");
  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        description="Auditorias GMP+ FSA, EUDR, internas e de clientes compradores. Programe, prepare e arquive cada ciclo de verificação."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Histórico
            </Button>
            <Button variant="gradient" size="sm">
              <Plus className="size-4" /> Programar auditoria
            </Button>
          </>
        }
      />

      {/* Próxima auditoria */}
      {programada && (
        <Card className="bg-gradient-to-br from-[hsl(174_64%_97%)] to-[hsl(200_60%_97%)] border-[hsl(174_72%_60%)]">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 shadow-sm border border-[hsl(174_72%_75%)]">
                <ShieldCheck className="size-7 text-[hsl(174_72%_35%)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning" className="text-[10px]">23 dias</Badge>
                  <h2 className="text-lg font-bold">Próxima auditoria: {programada.tipo}</h2>
                </div>
                <p className="text-sm text-[hsl(215_28%_25%)]">
                  Programada para {formatDate(programada.data)} · Auditor: {programada.auditor} · {programada.organismo}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ChecklistStat label="Documentação" complete={45} total={48} />
                  <ChecklistStat label="Treinamentos" complete={487} total={487} />
                  <ChecklistStat label="Itens preparatórios" complete={28} total={42} />
                </div>
              </div>
              <Button variant="gradient" size="sm">
                <ClipboardCheck className="size-4" /> Plano de preparação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="programadas">
        <TabsList>
          <TabsTrigger value="programadas">Programadas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="preparacao">Plano de preparação</TabsTrigger>
        </TabsList>

        <TabsContent value="programadas" className="space-y-3">
          {auditorias.filter((a) => a.status === "Programada").map((a) => (
            <AuditoriaCard a={a} key={a.id} />
          ))}
        </TabsContent>

        <TabsContent value="historico" className="space-y-3">
          {auditorias.filter((a) => a.status !== "Programada").map((a) => (
            <AuditoriaCard a={a} key={a.id} />
          ))}
        </TabsContent>

        <TabsContent value="preparacao">
          <Card>
            <CardHeader>
              <CardTitle>Plano de preparação · Auditoria GMP+ FSA</CardTitle>
              <CardDescription>
                42 itens preparatórios. Cada item tem responsável, prazo e evidência associada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { item: "Atualizar Política de Sequenciamento de Cargas", resp: "Rafael · RD Insight", ok: true },
                { item: "Renovar treinamentos GMP+ para 5 motoristas pendentes", resp: "RH", ok: false },
                { item: "Inspecionar 100% das carretas com certificação a vencer em 90d", resp: "Frota", ok: false },
                { item: "Compilar relatório de NC dos últimos 12 meses", resp: "Compliance", ok: true },
                { item: "Revisar 12 checklists com ressalvas anteriores", resp: "Compliance", ok: false },
                { item: "Atualizar matriz de risco IDTF para produtos novos", resp: "Rafael · RD Insight", ok: true },
                { item: "Validar fotos com geolocalização das últimas 200 viagens", resp: "Sistema", ok: true },
                { item: "Documentar plano de ação para NC-2026-1042", resp: "Gerência", ok: false },
              ].map((p, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border",
                    p.ok ? "border-[hsl(142_71%_85%)] bg-[hsl(142_71%_98%)]" : "border-[hsl(48_95%_85%)] bg-[hsl(48_95%_98%)]"
                  )}
                >
                  <div
                    className={cn(
                      "size-6 rounded-full flex items-center justify-center shrink-0",
                      p.ok ? "bg-[hsl(142_71%_40%)] text-white" : "bg-[hsl(48_95%_60%)] text-white"
                    )}
                  >
                    {p.ok ? <CheckCircle2 className="size-3.5" /> : <AlertOctagon className="size-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.item}</p>
                    <p className="text-[11px] text-[hsl(215_16%_47%)] mt-0.5">Responsável: {p.resp}</p>
                  </div>
                  <Badge variant={p.ok ? "success" : "warning"} className="text-[10px]">
                    {p.ok ? "Concluído" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuditoriaCard({ a }: { a: typeof import("@/lib/mock-data").auditorias[number] }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="rounded-lg bg-[hsl(174_64%_96%)] p-3 shrink-0">
            <ShieldCheck className="size-5 text-[hsl(174_72%_35%)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-base font-bold">{a.tipo}</p>
              <StatusBadge status={a.status.split("—")[1]?.trim() || a.status} size="sm" />
            </div>
            <div className="flex items-center gap-4 text-xs text-[hsl(215_16%_47%)] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> {formatDate(a.data)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {a.auditor}
              </span>
              <span>{a.organismo}</span>
              {a.ncEncontradas > 0 && (
                <span className="text-[hsl(0_72%_40%)] font-semibold">{a.ncEncontradas} NC encontradas</span>
              )}
            </div>
          </div>
          {a.documento && (
            <Button variant="outline" size="sm">
              <FileText className="size-3.5" /> Relatório
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistStat({ label, complete, total }: { label: string; complete: number; total: number }) {
  const pct = Math.round((complete / total) * 100);
  return (
    <div className="rounded-lg bg-white border border-[hsl(215_20%_92%)] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-[hsl(215_16%_47%)] font-semibold">{label}</span>
        <span className="text-xs font-bold tabular-nums">
          {complete}/{total}
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-[10px] text-[hsl(215_16%_47%)] mt-1">{pct}% concluído</p>
    </div>
  );
}
