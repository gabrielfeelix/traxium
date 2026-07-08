"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  Boxes,
  Container,
  Droplets,
  ClipboardCheck,
  Lock,
  Download,
  Zap,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CompartimentoStatusBadge, RegimeBadge, StatusBadge } from "@/components/shell/status-badge";
import {
  findCompartimento,
  findImplemento,
  findSubcontratado,
  limpezasDoCompartimento,
  inspecoesDoCompartimento,
} from "@/lib/domain/model";
import { getT3, statusCompartimento } from "@/lib/domain/rules-engine";
import { useToast } from "@/components/ui/toast";
import { downloadJSON } from "@/lib/export";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

export default function CompartimentoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const comp = findCompartimento(id);
  if (!comp) return notFound();

  const imp = findImplemento(comp.implementoId);
  const sub = findSubcontratado(imp?.subcontratadoId);
  const st = statusCompartimento(comp.id);
  const t3 = getT3(comp.id);
  const limpezas = limpezasDoCompartimento(comp.id);
  const inspecoes = inspecoesDoCompartimento(comp.id);

  return (
    <div className="space-y-5">
      <Link
        href="/frota"
        className="inline-flex items-center gap-1.5 text-[12px] text-[hsl(210_14%_42%)] hover:text-[hsl(176_84%_25%)] transition-colors"
      >
        <ArrowLeft className="size-3.5" /> Voltar para ativos
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Boxes className="size-4 text-[hsl(176_84%_25%)]" />
            <span className="font-mono text-[12px] font-semibold text-[hsl(210_14%_42%)]">{imp?.placa}</span>
            <CompartimentoStatusBadge status={st.status} />
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[hsl(195_30%_8%)]">
            {comp.identificador}
          </h1>
          <p className="text-[13px] text-[hsl(210_14%_42%)] mt-1.5">
            {imp?.tipo} · <span className="num">{comp.capacidadeT}</span> t · {comp.material} · conservação {comp.estadoConservacao.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/limpezas"><Droplets className="size-4" /> Registrar limpeza</Link>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => {
              downloadJSON(`compartimento-${imp?.placa ?? id}`, {
                compartimento: comp.identificador,
                implemento: imp?.placa,
                status: st.label,
                t3: t3.map((e) => ({ ordem: e.ordem, produto: e.produto?.nomeCanonico, data: e.load.data, cavalo: e.load.cavaloPlaca })),
                limpezas, inspecoes,
              });
              toast("Histórico exportado", { desc: `${comp.identificador} · JSON auditável.` });
            }}
          >
            <Download className="size-4" /> Exportar histórico
          </Button>
        </div>
      </div>

      {/* Status atual — sinal principal */}
      <div
        className={cn(
          "rounded-xl border p-4 flex items-start gap-3 relative overflow-hidden",
          st.status === "apto" && "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]",
          st.status === "bloqueado" && "border-[hsl(0_72%_75%)] bg-[hsl(0_72%_98%)]",
          st.status === "requer_limpeza" && "border-[hsl(28_92%_75%)] bg-[hsl(36_95%_98%)]",
          st.status === "sem_historico" && "border-[hsl(200_18%_85%)] bg-[hsl(200_18%_98%)]"
        )}
      >
        <div
          className={cn(
            "size-10 rounded-lg flex items-center justify-center shrink-0 text-white shadow-md",
            st.status === "apto" && "bg-[hsl(142_71%_36%)]",
            st.status === "bloqueado" && "bg-[hsl(0_78%_50%)]",
            st.status === "requer_limpeza" && "bg-[hsl(28_92%_48%)]",
            st.status === "sem_historico" && "bg-[hsl(210_14%_55%)]"
          )}
        >
          {st.status === "apto" ? <CheckCircle2 className="size-5" /> : <AlertTriangle className="size-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-[hsl(195_30%_8%)]">Situação para próximo carregamento de feed</p>
            <CompartimentoStatusBadge status={st.status} size="sm" />
            {st.regimeExigido && (
              <span className="text-[11px] text-[hsl(210_14%_42%)]">
                regime mínimo <RegimeBadge regime={st.regimeExigido} size="sm" />
              </span>
            )}
          </div>
          <p className="text-[12px] text-[hsl(210_14%_42%)] mt-1 leading-relaxed">{st.motivo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Histórico T-3 */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico T-3 do compartimento</CardTitle>
              <CardDescription>
                Três últimas cargas que tocaram este compartimento. Registro append-only e imutável — cada carga guarda o cavalo que a puxou.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pb-2 pl-2">
                <div className="absolute left-[28px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[hsl(176_84%_25%)] via-[hsl(176_60%_70%)] to-[hsl(200_18%_88%)]" />
                {t3.map((entry) => (
                  <div key={entry.load.id} className="relative pl-16 pb-4">
                    <div
                      className={cn(
                        "absolute left-0 top-0 size-12 rounded-xl border-[3px] border-white flex items-center justify-center font-bold text-[11px] shadow-brand-sm",
                        entry.determinante
                          ? "bg-gradient-to-br from-[hsl(176_84%_28%)] to-[hsl(200_92%_28%)] text-white"
                          : "bg-[hsl(200_18%_94%)] text-[hsl(210_14%_42%)]"
                      )}
                    >
                      T-{entry.ordem}
                    </div>
                    <div className="bg-white rounded-lg border border-[hsl(200_18%_92%)] p-3">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-[14px]">{entry.produto?.nomeCanonico ?? entry.load.produtoId}</span>
                        {entry.produto?.bloqueiaFeed && (
                          <Badge variant="destructive" className="text-[9px]">Carga proibida</Badge>
                        )}
                        {entry.determinante && (
                          <Badge variant="default" className="text-[9px]">
                            <Zap className="size-2.5" /> Determinante
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-[hsl(210_14%_42%)]">
                        <span>Carregada em {formatDate(entry.load.data)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Truck className="size-3" /> puxado por <span className="font-mono">{entry.load.cavaloPlaca}</span>
                        </span>
                        {entry.produto?.idtfCode && (
                          <span className="font-mono text-[10px] text-[hsl(210_12%_58%)]">{entry.produto.idtfCode}</span>
                        )}
                      </div>
                      {entry.determinante && entry.produto && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-[hsl(210_14%_42%)]">
                            Exige limpeza mín.
                          </span>
                          <RegimeBadge regime={entry.produto.regimeAntesDeFeed} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!t3.length && (
                  <p className="pl-4 text-[12px] text-[hsl(210_14%_42%)]">Nenhuma carga anterior registrada.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Limpezas */}
          <Card>
            <CardHeader>
              <CardTitle>Limpezas registradas</CardTitle>
              <CardDescription>Evidência sobe conforme a severidade do regime (A → D).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {limpezas.map((l) => (
                <div key={l.id} className="rounded-lg border border-[hsl(200_18%_92%)] p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <RegimeBadge regime={l.regime} size="sm" />
                    <span className="text-[13px] font-medium">{l.metodo}</span>
                    <span className="ml-auto text-[11px] font-mono text-[hsl(210_14%_42%)] num">{formatDate(l.data)}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-[hsl(210_14%_42%)]">
                    <Meta label="Local" value={l.local} />
                    <Meta label="Executor" value={l.executor} />
                    {l.produtoQuimico && <Meta label="Produto químico" value={l.produtoQuimico} icon={<FlaskConical className="size-3" />} />}
                    {l.concentracao && <Meta label="Concentração" value={l.concentracao} />}
                    {l.tempoAcao && <Meta label="Tempo de ação" value={l.tempoAcao} />}
                    <Meta label="Fotos" value={`${l.fotos}`} />
                    {l.geo && <Meta label="Geo" value={`${l.geo.lat.toFixed(3)}, ${l.geo.lng.toFixed(3)}`} />}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {l.comprovanteEstacao && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(142_71%_28%)] font-semibold">
                        <CheckCircle2 className="size-3" /> Comprovante da estação
                      </span>
                    )}
                    {l.assinatura && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(142_71%_28%)] font-semibold">
                        <CheckCircle2 className="size-3" /> Assinatura
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {!limpezas.length && (
                <p className="text-[12px] text-[hsl(0_70%_45%)]">Nenhuma limpeza evidenciada — pendência de conformidade.</p>
              )}
            </CardContent>
          </Card>

          {/* Inspeções */}
          <Card>
            <CardHeader>
              <CardTitle>Inspeções LCI</CardTitle>
              <CardDescription>Checklist pré-carregamento vinculado a este compartimento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {inspecoes.map((i) => (
                <div
                  key={i.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    i.resultado === "aprovado" && "border-[hsl(142_60%_75%)] bg-[hsl(142_65%_98%)]",
                    i.resultado === "reprovado" && "border-[hsl(0_72%_75%)] bg-[hsl(0_72%_98%)]",
                    i.resultado === "pendente" && "border-[hsl(48_95%_75%)] bg-[hsl(48_95%_98%)]"
                  )}
                >
                  <div
                    className={cn(
                      "size-7 rounded-md flex items-center justify-center shrink-0 text-white",
                      i.resultado === "aprovado" && "bg-[hsl(142_71%_36%)]",
                      i.resultado === "reprovado" && "bg-[hsl(0_78%_50%)]",
                      i.resultado === "pendente" && "bg-[hsl(48_95%_50%)]"
                    )}
                  >
                    {i.resultado === "aprovado" ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium capitalize">{i.resultado}</p>
                      <span className="text-[11px] text-[hsl(210_14%_42%)] num">{i.itensOk}/{i.itensTotal} itens</span>
                      {i.offline && (
                        <Badge variant="warning" className="text-[9px]">sincronizada offline</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-[hsl(210_12%_58%)]">
                      {i.inspetor} · {formatDateTime(i.dataHora)}
                    </p>
                  </div>
                  <Link href={`/viagens/${i.viagemId}`} className="text-[11px] text-[hsl(176_84%_25%)] hover:underline shrink-0">
                    ver viagem
                  </Link>
                </div>
              ))}
              {!inspecoes.length && (
                <p className="text-[12px] text-[hsl(210_14%_42%)]">Nenhuma inspeção registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ficha do implemento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Ficha icon={<Container />} label="Placa" value={imp?.placa ?? "—"} mono />
              <Ficha icon={<Boxes />} label="Tipo" value={imp?.tipo ?? "—"} />
              <Ficha icon={<Boxes />} label="Compartimentos" value={`${imp?.nCompartimentos ?? "—"}`} />
              <Ficha icon={<Building2 />} label="Proprietário" value={imp?.proprietario ?? "—"} />
              {sub && <Ficha icon={<Building2 />} label="Subcontratado" value={sub.razaoSocial} sub={sub.cnpj} />}
              <Separator />
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(210_14%_42%)] font-semibold mb-1.5">Certificação GMP+</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={imp?.certGMP.status ?? "Pendente"} size="sm" />
                  <span className="text-[11px] text-[hsl(210_14%_42%)]">vence {imp && formatDate(imp.certGMP.validade)}</span>
                </div>
                <p className="text-[11px] text-[hsl(210_14%_42%)] mt-1">{imp?.certGMP.escopo}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-[hsl(176_84%_25%)]" />
                <CardTitle>Integridade</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-[12px] text-[hsl(210_14%_42%)]">
              <p className="flex items-start gap-2">
                <ClipboardCheck className="size-3.5 mt-0.5 shrink-0 text-[hsl(176_84%_25%)]" />
                Cargas e evidências são <strong className="text-[hsl(195_30%_8%)]">imutáveis</strong> após sincronização.
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="size-3.5 mt-0.5 shrink-0 text-[hsl(176_84%_25%)]" />
                Correção só por evento de <strong className="text-[hsl(195_30%_8%)]">retificação</strong>, preservando o dado original.
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="size-3.5 mt-0.5 shrink-0 text-[hsl(176_84%_25%)]" />
                Fotos com geo, timestamp e hash vinculados ao compartimento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.1em] text-[hsl(210_12%_58%)] font-semibold">{label}</p>
      <p className="text-[11px] text-[hsl(195_30%_8%)] flex items-center gap-1">
        {icon}
        {value}
      </p>
    </div>
  );
}

function Ficha({
  icon,
  label,
  value,
  sub,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="size-7 rounded-md bg-[hsl(174_64%_96%)] text-[hsl(176_84%_25%)] flex items-center justify-center shrink-0 [&_svg]:size-3.5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(210_14%_42%)] font-semibold">{label}</p>
        <p className={cn("text-[13px] font-medium text-[hsl(195_30%_8%)] truncate", mono && "font-mono text-[12px]")}>{value}</p>
        {sub && <p className="text-[10px] text-[hsl(210_12%_58%)] font-mono">{sub}</p>}
      </div>
    </div>
  );
}
