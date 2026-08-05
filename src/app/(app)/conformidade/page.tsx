"use client";

import { useMemo, useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Trees,
  FileText,
  Download,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/kit/stat-tile";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { avaliarCarregamento, type Decisao } from "@/lib/domain/rules-engine";
import {
  compartimentoPorViagem,
  implementos,
  subcontratados,
  nivelVencimento,
  VERSAO_BASE_IDTF,
} from "@/lib/domain/model";
import { motoristas, fazendas, documentos } from "@/lib/mock-data";
import { useSession } from "@/lib/store/session";
import { useToast } from "@/components/ui/toast";
import { downloadCSV } from "@/lib/export";
import { cn } from "@/lib/utils";

// ─── Derivação: cada dimensão nasce do motor/dados, nunca de número chumbado ──

type Pendencia = { titulo: string; detalhe: string };
type Dimensao = { key: string; nome: string; score: number; unidades: number; pendencias: Pendencia[] };

function pct(ok: number, total: number): number {
  return total ? Math.round((ok / total) * 100) : 100;
}

function derivar(decisoes: Decisao[]) {
  const checagem = (nomes: string[]) =>
    decisoes.flatMap((d) => d.checagens.filter((c) => nomes.includes(c.nome)).map((c) => ({ d, c })));

  const dims: Dimensao[] = [];

  // T-3 IDTF — histórico e carga anterior, por viagem avaliada
  const t3 = checagem(["Histórico T-3", "Carga anterior"]);
  dims.push({
    key: "t3",
    nome: "T-3 IDTF",
    score: pct(t3.filter((x) => x.c.ok).length, t3.length),
    unidades: t3.length,
    pendencias: t3.filter((x) => !x.c.ok).map((x) => ({ titulo: `Compartimento ${x.d.compartimentoId}`, detalhe: x.c.detalhe })),
  });

  // Higienização — limpeza vs. IDTF + inspeção LCI
  const hig = checagem(["Limpeza vs. IDTF", "Inspeção LCI"]);
  dims.push({
    key: "higienizacao",
    nome: "Higienização",
    score: pct(hig.filter((x) => x.c.ok).length, hig.length),
    unidades: hig.length,
    pendencias: hig.filter((x) => !x.c.ok).map((x) => ({ titulo: `${x.c.nome} · ${x.d.compartimentoId}`, detalhe: x.c.detalhe })),
  });

  // Certificações — motor + implementos + subcontratados + CNH/certs de motorista
  const certMotor = checagem(["Certificação GMP+"]);
  const certUnidades: { ok: boolean; titulo: string; detalhe: string }[] = [
    ...certMotor.map((x) => ({ ok: x.c.ok, titulo: `Viagem · ${x.d.compartimentoId}`, detalhe: x.c.detalhe })),
    ...implementos.map((i) => ({
      ok: i.certGMP.status === "Válida",
      titulo: `Implemento ${i.placa}`,
      detalhe: `Certificação ${i.certGMP.status.toLowerCase()}`,
    })),
    ...subcontratados.map((s) => {
      const n = nivelVencimento(s.certGMP.validade).nivel;
      return { ok: n !== "vencido", titulo: s.razaoSocial, detalhe: n === "vencido" ? "Certificado GMP+ vencido" : "Certificado válido" };
    }),
    ...motoristas.map((m) => ({
      ok: m.certificacoes.every((c) => c.status !== "Vencida"),
      titulo: m.nome,
      detalhe: m.certificacoes.filter((c) => c.status === "Vencida").map((c) => `${c.nome} vencida`).join(", ") || "Certificações em dia",
    })),
  ];
  dims.push({
    key: "certificacoes",
    nome: "Certificações",
    score: pct(certUnidades.filter((u) => u.ok).length, certUnidades.length),
    unidades: certUnidades.length,
    pendencias: certUnidades.filter((u) => !u.ok).map(({ titulo, detalhe }) => ({ titulo, detalhe })),
  });

  // Treinamentos — trilha completa do subcontratado (comprovante + quiz + aceite)
  const treinoOk = (s: (typeof subcontratados)[number]) =>
    s.treinamento.comprovante && s.treinamento.quiz && s.treinamento.aceiteRegras;
  dims.push({
    key: "treinamentos",
    nome: "Treinamentos",
    score: pct(subcontratados.filter(treinoOk).length, subcontratados.length),
    unidades: subcontratados.length,
    pendencias: subcontratados
      .filter((s) => !treinoOk(s))
      .map((s) => ({
        titulo: s.razaoSocial,
        detalhe: [
          !s.treinamento.comprovante && "sem comprovante",
          !s.treinamento.quiz && "quiz pendente",
          !s.treinamento.aceiteRegras && "sem aceite das regras",
        ].filter(Boolean).join(" · "),
      })),
  });

  // Documentação — vigência do repositório
  dims.push({
    key: "documentacao",
    nome: "Documentação",
    score: pct(documentos.filter((d) => d.vigente).length, documentos.length),
    unidades: documentos.length,
    pendencias: documentos.filter((d) => !d.vigente).map((d) => ({ titulo: d.nome, detalhe: `${d.tipo} não vigente` })),
  });

  // Rastreabilidade EUDR — fazendas sem desmatamento pós-2020 e risco controlado
  const fazendaOk = (f: (typeof fazendas)[number]) =>
    !f.desmatamentoPos2020 && (f.scoreRiscoEUDR === "Baixo" || f.scoreRiscoEUDR === "Médio");
  dims.push({
    key: "rastreabilidade",
    nome: "Rastreab. EUDR",
    score: pct(fazendas.filter(fazendaOk).length, fazendas.length),
    unidades: fazendas.length,
    pendencias: fazendas
      .filter((f) => !fazendaOk(f))
      .map((f) => ({
        titulo: f.nome,
        detalhe: [f.desmatamentoPos2020 && "desmatamento pós-2020", `risco ${f.scoreRiscoEUDR}`].filter(Boolean).join(" · "),
      })),
  });

  return dims;
}

// Impacto estimado no consolidado ao resolver 1 pendência da dimensão:
// cada dimensão pesa 1/6; cada unidade vale 100/unidades dentro dela.
function impactoDe(dim: Dimensao): number {
  return Math.round((100 / dim.unidades / 6) * 10) / 10;
}

type Rec = { acao: string; dim: string; impacto: number; esforco: "Baixo" | "Médio" | "Alto" };

function recomendar(dims: Dimensao[], decisoes: Decisao[]): Rec[] {
  const dimPor = (key: string) => dims.find((d) => d.key === key)!;
  const recs: Rec[] = [];

  const regras = new Set<string>();
  for (const d of decisoes) {
    if (d.tier !== "BLOQUEIO" || regras.has(d.regra)) continue;
    regras.add(d.regra);
    const key = d.regra.includes("Certificado") ? "certificacoes" : d.regra.includes("T-3") ? "t3" : "higienizacao";
    recs.push({ acao: d.acaoSugerida, dim: dimPor(key).nome, impacto: impactoDe(dimPor(key)), esforco: "Médio" });
  }

  for (const s of subcontratados) {
    const v = nivelVencimento(s.certGMP.validade);
    if (v.nivel !== "ok" && v.nivel !== "vencido") {
      recs.push({
        acao: `Renovar certificação GMP+ de ${s.razaoSocial} (vence em ${v.dias}d)`,
        dim: "Certificações",
        impacto: impactoDe(dimPor("certificacoes")),
        esforco: "Baixo",
      });
    }
  }

  for (const p of dimPor("treinamentos").pendencias) {
    recs.push({ acao: `Concluir treinamento GMP+ de ${p.titulo} (${p.detalhe})`, dim: "Treinamentos", impacto: impactoDe(dimPor("treinamentos")), esforco: "Alto" });
  }
  for (const p of dimPor("documentacao").pendencias) {
    recs.push({ acao: `Atualizar ${p.titulo}`, dim: "Documentação", impacto: impactoDe(dimPor("documentacao")), esforco: "Baixo" });
  }
  for (const p of dimPor("rastreabilidade").pendencias) {
    recs.push({ acao: `Revisar due diligence EUDR de ${p.titulo}`, dim: "Rastreab. EUDR", impacto: impactoDe(dimPor("rastreabilidade")), esforco: "Médio" });
  }

  return recs.sort((a, b) => b.impacto - a.impacto).slice(0, 6);
}

// ─── Página ───────────────────────────────────────────────────────────────────

const barScore = (score: number) =>
  score >= 90 ? "bg-success-500" : score >= 75 ? "bg-warning-500" : "bg-danger-500";

export default function ConformidadePage() {
  const { version } = useSession();
  const { toast } = useToast();
  const [dimAtiva, setDimAtiva] = useState<string | null>(null);

  const { dims, decisoes, scoreGeral, totalChecagens, recs } = useMemo(() => {
    const decisoes = Object.keys(compartimentoPorViagem).map((vid) => avaliarCarregamento(vid));
    const dims = derivar(decisoes);
    const scoreGeral = Math.round((dims.reduce((acc, d) => acc + d.score, 0) / dims.length) * 10) / 10;
    const totalChecagens = dims.reduce((acc, d) => acc + d.unidades, 0);
    return { dims, decisoes, scoreGeral, totalChecagens, recs: recomendar(dims, decisoes) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const bloqueios = decisoes.filter((d) => d.tier === "BLOQUEIO").length;
  const alertas = decisoes.filter((d) => d.tier === "ALERTA").length;
  const fazendasOk = fazendas.filter((f) => !f.desmatamentoPos2020 && (f.scoreRiscoEUDR === "Baixo" || f.scoreRiscoEUDR === "Médio")).length;
  const docsVigentes = documentos.filter((d) => d.vigente).length;

  const selecionada = dims.find((d) => d.key === dimAtiva) ?? null;
  const ranking = [...motoristas].sort((a, b) => b.conformidadeMedia - a.conformidadeMedia).slice(0, 6);

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Conformidade"
        description="Score consolidado de conformidade GMP+ FSA derivado do motor de regras: seis dimensões do FSMS, checagem a checagem, com as ações que mais impactam o resultado."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadCSV(
                "traxium-conformidade",
                ["Dimensão", "Score", "Unidades avaliadas", "Pendências"],
                dims.map((d) => [d.nome, d.score, d.unidades, d.pendencias.map((p) => `${p.titulo}: ${p.detalhe}`).join(" | ")])
              );
              toast("CSV exportado", { desc: `${dims.length} dimensões · ${totalChecagens} unidades.` });
            }}
          >
            <Download className="size-4" /> Exportar
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={ShieldAlert} label="Bloqueios do motor" value={bloqueios} tone="danger" hint="carregamentos impedidos" />
        <StatTile icon={AlertTriangle} label="Alertas ativos" value={alertas} tone="warning" hint="exigem justificativa" />
        <StatTile icon={Trees} label="Fazendas EUDR-aptas" value={`${fazendasOk}/${fazendas.length}`} tone="brand" hint="sem desmatamento pós-2020" />
        <StatTile icon={FileText} label="Documentos vigentes" value={`${docsVigentes}/${documentos.length}`} tone="success" hint="repositório auditável" />
      </div>

      {/* Momento-assinatura: radar-herói — o score consolidado e suas 6 dimensões,
          cada uma clicável para abrir as pendências que o derrubam. */}
      <section className="rounded-xl border border-border-soft bg-bg-elev shadow-brand-sm p-5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-fg">Radar de conformidade</h2>
        <p className="text-[12px] text-fg-muted leading-snug mt-0.5 mb-2 max-w-2xl">
          Seis dimensões do FSMS GMP+ FSA, derivadas checagem a checagem do motor de regras. Clique numa
          dimensão para ver o que está derrubando o score.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={dims.map((d) => ({ dimensao: d.nome, score: d.score }))}>
              <PolarGrid stroke="var(--color-border-soft)" />
              <PolarAngleAxis
                dataKey="dimensao"
                tick={{ fontSize: 11, fill: "var(--color-fg)", fontWeight: 600 }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "var(--color-fg-muted)" }}
                axisLine={false}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-brand-600)"
                fill="var(--color-brand-600)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-elev)",
                  border: "1px solid var(--color-border-soft)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-brand-700 font-bold">Score consolidado</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-[44px] font-bold text-brand-700 tracking-[-0.02em] num leading-none">{scoreGeral}</p>
                <span className="text-[14px] text-fg-muted num">/ 100</span>
              </div>
              <p className="text-[10px] text-fg-soft mt-1.5">
                média das 6 dimensões · {totalChecagens} unidades avaliadas · base IDTF {VERSAO_BASE_IDTF}
              </p>
            </div>

            <div className="space-y-1">
              {dims.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={dimAtiva === d.key}
                  onClick={() => setDimAtiva(dimAtiva === d.key ? null : d.key)}
                  className={cn(
                    "w-full rounded-md px-2 py-1.5 text-left transition-colors",
                    dimAtiva === d.key ? "bg-brand-50 ring-1 ring-brand-500/40" : "hover:bg-bg"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-fg">{d.nome}</span>
                    <span className={cn("text-[11px] font-bold num", d.score >= 90 ? "text-success-700" : d.score >= 75 ? "text-warning-700" : "text-danger-700")}>
                      {d.score}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg overflow-hidden mt-1">
                    <div className={cn("h-full rounded-full", barScore(d.score))} style={{ width: `${d.score}%` }} />
                  </div>
                </button>
              ))}
            </div>

            {selecionada && (
              <div className="rounded-lg border border-border-soft bg-bg p-3 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-fg-muted">
                  Pendências · {selecionada.nome}
                </p>
                {selecionada.pendencias.length ? (
                  selecionada.pendencias.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <AlertTriangle className="size-3 text-warning-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-snug text-fg min-w-0">
                        <span className="font-semibold">{p.titulo}</span>{" "}
                        <span className="text-fg-muted">— {p.detalhe}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-success-700 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> Sem pendências nesta dimensão.
                  </p>
                )}
                {selecionada.pendencias.length > 4 && (
                  <p className="text-[10px] text-fg-soft">+{selecionada.pendencias.length - 4} pendência(s)</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ranking por motorista</CardTitle>
            <CardDescription>Conformidade média · top {ranking.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ranking.map((m) => ({ nome: m.nome, conf: m.conformidadeMedia }))} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" horizontal={false} />
                <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 11, fill: "var(--color-fg-muted)" }} axisLine={false} />
                <YAxis
                  dataKey="nome"
                  type="category"
                  tick={{ fontSize: 11, fill: "var(--color-fg)" }}
                  width={140}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-elev)",
                    border: "1px solid var(--color-border-soft)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "var(--color-brand-50)" }}
                />
                <Bar dataKey="conf" radius={[0, 4, 4, 0]}>
                  {ranking.map((m) => (
                    <Cell key={m.id} fill={m.conformidadeMedia >= 85 ? "var(--color-brand-600)" : "var(--color-warning-500)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gradient-to-br from-brand-600 to-sky-600 flex items-center justify-center shadow-brand-sm">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <CardTitle>Recomendações do motor</CardTitle>
                <CardDescription>Geradas das pendências reais, ordenadas por impacto no score</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recs.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-border-soft hover:border-brand-500/50 hover:bg-brand-50/40 transition-all"
              >
                <div
                  className={cn(
                    "size-9 rounded-md flex items-center justify-center shrink-0",
                    r.esforco === "Baixo" && "bg-success-50 text-success-700",
                    r.esforco === "Médio" && "bg-warning-50/60 text-warning-700",
                    r.esforco === "Alto" && "bg-warning-50 text-warning-700"
                  )}
                >
                  <BadgeCheck className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium leading-snug">{r.acao}</p>
                  <p className="text-[11px] text-fg-muted mt-0.5">
                    <span className="font-bold text-success-700 num">+{r.impacto} pts</span> em {r.dim}
                  </p>
                </div>
                <Badge
                  variant={r.esforco === "Baixo" ? "success" : r.esforco === "Médio" ? "warning" : "destructive"}
                  className="text-[10px] shrink-0"
                >
                  {r.esforco}
                </Badge>
              </div>
            ))}
            {!recs.length && (
              <p className="text-[12px] text-success-700 flex items-center gap-1.5 py-4">
                <CheckCircle2 className="size-4" /> Nenhuma pendência — score no teto do que o motor enxerga.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
