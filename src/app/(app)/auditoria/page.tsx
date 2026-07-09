"use client";

import {
  ShieldCheck,
  Download,
  Calendar,
  FileText,
  Users,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shell/status-badge";
import { SequenceRail, type RailStepDef } from "@/components/kit/sequence-rail";
import { auditorias, documentos, naoConformidades, motoristas } from "@/lib/mock-data";
import { subcontratados, implementos, nivelVencimento } from "@/lib/domain/model";
import { useToast } from "@/components/ui/toast";
import { cn, formatDate } from "@/lib/utils";
import { useSession } from "@/lib/store/session";
import { ProgramarAuditoriaModal } from "@/components/modals/programar-auditoria-modal";
import { PlanoPreparacaoModal } from "@/components/modals/plano-preparacao-modal";

function subDias(iso: string, n: number): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Rail D-N: marcos até o Dia D, com "Hoje" pulsando na posição real. */
function railDN(dataAuditoria: string, dias: number): RailStepDef[] {
  const marcos = [30, 14, 7, 1, 0];
  const steps: RailStepDef[] = [];
  let hojeInserido = false;
  for (const m of marcos) {
    if (!hojeInserido && dias >= m) {
      steps.push({ key: "hoje", titulo: "Hoje", sub: `D-${dias}`, tone: "brand", atual: true });
      hojeInserido = true;
    }
    steps.push({
      key: `d${m}`,
      titulo: m === 0 ? "Dia D" : `D-${m}`,
      sub: formatDate(subDias(dataAuditoria, m)),
      tone: dias < m ? "ok" : "neutro",
    });
  }
  return steps;
}

/** Prontidão de evidência — cada categoria lida dos dados, não chumbada. */
function prontidao() {
  const capas = naoConformidades.filter((n) => n.capa);
  const treinoOk = (s: (typeof subcontratados)[number]) =>
    s.treinamento.comprovante && s.treinamento.quiz && s.treinamento.aceiteRegras;
  const certsOk =
    implementos.filter((i) => i.certGMP.status === "Válida").length +
    subcontratados.filter((s) => nivelVencimento(s.certGMP.validade).nivel !== "vencido").length;
  return [
    { label: "Documentação vigente", complete: documentos.filter((d) => d.vigente).length, total: documentos.length },
    { label: "CAPAs com eficácia", complete: capas.filter((n) => n.capa!.eficaciaVerificada).length, total: capas.length },
    { label: "Treinamento de subcontratados", complete: subcontratados.filter(treinoOk).length, total: subcontratados.length },
    { label: "Certificações válidas", complete: certsOk, total: implementos.length + subcontratados.length },
    { label: "Motoristas com certs em dia", complete: motoristas.filter((m) => m.certificacoes.every((c) => c.status !== "Vencida")).length, total: motoristas.length },
  ];
}

export default function AuditoriaPage() {
  const { toast } = useToast();
  const { version } = useSession();
  const programada = auditorias.find((a) => a.status === "Programada");
  return (
    <div className="space-y-6" data-v={version}>
      <PageHeader
        title="Auditoria"
        description="Auditorias GMP+ FSA, EUDR, internas e de clientes compradores. Programe, prepare e arquive cada ciclo de verificação."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Histórico de auditorias", { type: "info", desc: `${auditorias.length} ciclos registrados.` })}>
              <Download className="size-4" /> Histórico
            </Button>
            <ProgramarAuditoriaModal />
          </>
        }
      />

      {/* Momento-assinatura: contagem D-N + prontidão de evidência derivada. */}
      {programada && (() => {
        const dias = nivelVencimento(programada.data).dias;
        const cats = prontidao();
        const geral = Math.round(
          (cats.reduce((acc, c) => acc + c.complete / Math.max(c.total, 1), 0) / cats.length) * 100
        );
        return (
          <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
            <div className="flex items-start gap-5 flex-wrap">
              <div className="shrink-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-bold">Contagem</p>
                <p className="text-[44px] font-bold text-brand-700 tracking-[-0.02em] num leading-none mt-1">
                  D-{dias}
                </p>
              </div>
              <div className="flex-1 min-w-[240px]">
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
                  Próxima auditoria: {programada.tipo}
                </h2>
                <p className="text-[12px] text-fg-muted mt-0.5">
                  {formatDate(programada.data)} · Auditor: {programada.auditor} · {programada.organismo}
                </p>
                <div className="mt-3">
                  <SequenceRail steps={railDN(programada.data, dias)} />
                </div>
              </div>
              <PlanoPreparacaoModal />
            </div>

            <div className="mt-5 pt-4 border-t border-border-soft">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-bold">
                  Prontidão de evidência
                </p>
                <span className={cn(
                  "text-[13px] font-bold num",
                  geral >= 90 ? "text-success-700" : geral >= 70 ? "text-warning-700" : "text-danger-700"
                )}>
                  {geral}% pronto
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                {cats.map((c) => (
                  <ChecklistStat key={c.label} label={c.label} complete={c.complete} total={c.total} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

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
                    p.ok ? "border-success-500/30 bg-success-50/50" : "border-warning-500/40 bg-warning-50/50"
                  )}
                >
                  <div
                    className={cn(
                      "size-6 rounded-full flex items-center justify-center shrink-0 text-white",
                      p.ok ? "bg-success-500" : "bg-warning-500"
                    )}
                  >
                    {p.ok ? <CheckCircle2 className="size-3.5" /> : <AlertOctagon className="size-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{p.item}</p>
                    <p className="text-[11px] text-fg-muted mt-0.5">Responsável: {p.resp}</p>
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
  const { toast } = useToast();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="rounded-lg bg-brand-50 p-3 shrink-0">
            <ShieldCheck className="size-5 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[14px] font-bold">{a.tipo}</p>
              <StatusBadge status={a.status.split("—")[1]?.trim() || a.status} size="sm" />
            </div>
            <div className="flex items-center gap-4 text-[12px] text-fg-muted flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> {formatDate(a.data)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" /> {a.auditor}
              </span>
              <span>{a.organismo}</span>
              {a.ncEncontradas > 0 && (
                <span className="text-danger-700 font-semibold">{a.ncEncontradas} NC encontradas</span>
              )}
            </div>
          </div>
          {a.documento && (
            <Button variant="outline" size="sm" onClick={() => toast(`Baixando ${a.documento}`, { desc: "Relatório de auditoria." })}>
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
    <div className="rounded-lg bg-bg-elev border border-border-soft p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-[0.12em] text-fg-muted font-semibold leading-tight">{label}</span>
        <span className="text-[12px] font-bold tabular-nums shrink-0">
          {complete}/{total}
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-[10px] text-fg-muted mt-1">{pct}% concluído</p>
    </div>
  );
}
