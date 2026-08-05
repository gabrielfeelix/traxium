"use client";

// Torre de Controle — home do modo MVP (diretriz §5.4: bloqueio-first, não vitrine
// de gráficos). Responde "o que exige ação agora": quem está bloqueado, por quê,
// quem precisa agir. TUDO puxa do estado real do store; zero número decorativo.

import Link from "next/link";
import {
  AlertOctagon, Clock, CircleCheck, ArrowRight, ChevronRight, ShieldAlert,
  Gavel, Boxes, Building2, GraduationCap, Container, FileClock, Truck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";
import { useSession } from "@/lib/store/session";
import { viagens, motoristas, filialDaViagem, pertenceAFilial } from "@/lib/mock-data";
import {
  excecoes, produtosIDTF, subcontratados, nivelVencimento, NIVEL_LABEL,
  estadoQualificacao, ESTADO_QUALIFICACAO,
} from "@/lib/domain/model";
import { avaliarCarregamento } from "@/lib/domain/rules-engine";
import { formatDateTime, cn } from "@/lib/utils";

type Tier = "bloqueio" | "analise";
type ItemFila = {
  id: string;
  tier: Tier;
  titulo: string;
  codigo?: string;
  motivo: string;
  quemAge: string;
  meta?: string;
  href: string;
};

export function TorreDeControle() {
  const { version, filialId } = useSession();
  void version;

  const viagensEscopadas = viagens.filter((v) => pertenceAFilial(filialId, filialDaViagem(v)));
  const bloqueadas = viagensEscopadas.filter((v) => v.status === "Bloqueada");
  const ativas = viagensEscopadas.filter((v) => v.status !== "Concluída");
  const liberadas = ativas.filter((v) => v.status !== "Bloqueada");
  const excecoesPendentes = excecoes.filter((e) => e.status === "pendente");
  const produtosFila = produtosIDTF.filter((p) => p.statusClassificacao === "em_fila");
  const subPendentes = subcontratados
    .map((s) => ({ s, q: estadoQualificacao(s) }))
    .filter((x) => !ESTADO_QUALIFICACAO[x.q.estado].opera);
  const subBloqueioN = subPendentes.filter((x) => ESTADO_QUALIFICACAO[x.q.estado].tone === "danger").length;
  const academyPend = motoristas.filter((m) =>
    m.certificacoes.some((c) => c.status === "Vencida" && c.nome !== "MOPP")
  ).length;

  const totalBloqueio = bloqueadas.length + subBloqueioN;
  const totalAnalise = excecoesPendentes.length + produtosFila.length + (subPendentes.length - subBloqueioN);

  // ── Fila de decisões (unificada, bloqueio-first) ──────────────────────────
  const fila: ItemFila[] = [
    ...bloqueadas.map((v): ItemFila => {
      const d = avaliarCarregamento(v.id);
      return {
        id: `v-${v.id}`,
        tier: "bloqueio",
        titulo: `${v.motorista} · ${v.carreta}`,
        codigo: v.codigo,
        motivo: d.mensagem,
        quemAge: "Gestor GMP+/Qualidade",
        meta: `Entrega prev. ${formatDateTime(v.previsaoEntrega).split(",")[0]}`,
        href: `/viagens/${v.id}`,
      };
    }),
    ...subPendentes.map(({ s, q }): ItemFila => ({
      id: `s-${s.id}`,
      tier: ESTADO_QUALIFICACAO[q.estado].tone === "danger" ? "bloqueio" : "analise",
      titulo: s.razaoSocial,
      codigo: s.cnpj,
      motivo: `${q.estado}. ${q.motivo}`,
      quemAge: "Admin de Subcontratados",
      href: "/subcontratados",
    })),
    ...excecoesPendentes.map((e): ItemFila => ({
      id: `e-${e.id}`,
      tier: "analise",
      titulo: `Exceção · ${e.regra}`,
      codigo: e.codigoViagem,
      motivo: e.motivoBloqueio,
      quemAge: NIVEL_LABEL[e.nivelRequerido],
      meta: `Solicitado por ${e.solicitante}`,
      href: "/excecoes",
    })),
    ...produtosFila.map((p): ItemFila => ({
      id: `p-${p.id}`,
      tier: "analise",
      titulo: p.nomeCanonico,
      motivo: "Produto não classificado na IDTF. Uso travado até definição da Qualidade.",
      quemAge: "Gestor GMP+/Qualidade",
      href: "/idtf",
    })),
  ];

  // ── Certificados a vencer (60/30/15) — o que vai travar em breve ──────────
  const certsAVencer = subcontratados
    .map((s) => ({ s, nv: nivelVencimento(s.certGMP.validade) }))
    .filter((x) => ["critico", "alto", "alerta"].includes(x.nv.nivel))
    .sort((a, b) => a.nv.dias - b.nv.dias);

  const pilares = [
    { nome: "Operações", desc: "Viagens e liberação", icon: Truck, href: "/viagens", count: bloqueadas.length, tone: "danger" as const },
    { nome: "Gatekeeper", desc: "Qualificação de terceiros", icon: Building2, href: "/subcontratados", count: subPendentes.length, tone: (subBloqueioN > 0 ? "danger" : "warning") as "danger" | "warning" },
    { nome: "Academy", desc: "Competência do motorista", icon: GraduationCap, href: "/motoristas", count: academyPend, tone: "warning" as const },
    { nome: "IDTF Brasil", desc: "Consulta e regimes", icon: Boxes, href: "/idtf", count: produtosFila.length, tone: "warning" as const },
    { nome: "Network", desc: "Cadastro e ativos", icon: Container, href: "/frota", count: 0, tone: "default" as const },
  ];

  return (
    <div className="space-y-5" data-v={version}>
      <PageHeader
        title="Torre de Controle"
        description="O que exige decisão agora: quem está bloqueado, por quê e quem precisa agir. O sistema libera o que está conforme e traz ao humano apenas as exceções."
        accessory={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(200_18%_88%)] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[hsl(210_14%_42%)]">
            <span className="size-1.5 rounded-full bg-[hsl(142_71%_36%)] animate-pulse" />
            Tempo real
          </span>
        }
        actions={<NovaViagemModal />}
      />

      {/* Faixa de decisão em 3 níveis (acionável, não vaidade) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SemaforoTile tone="danger" icon={<AlertOctagon className="size-[18px]" />} valor={totalBloqueio} rotulo="Bloqueio técnico" hint="Impedidos de carregar" />
        <SemaforoTile tone="warning" icon={<Clock className="size-[18px]" />} valor={totalAnalise} rotulo="Aguardando análise" hint="Exceção ou classificação pendente" />
        <SemaforoTile tone="success" icon={<CircleCheck className="size-[18px]" />} valor={liberadas.length} rotulo="Liberadas para operar" hint="Conformes, sem pendência" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fila de decisões */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Fila de decisões</CardTitle>
                <CardDescription>Ordenada por criticidade · bloqueios primeiro</CardDescription>
              </div>
              <span className="shrink-0 rounded-md bg-[hsl(200_18%_96%)] px-2 py-1 text-[11px] font-semibold text-[hsl(200_25%_25%)] num">
                {fila.length} {fila.length === 1 ? "item" : "itens"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            {fila.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[hsl(142_60%_96%)]">
                  <CircleCheck className="size-5 text-[hsl(142_71%_36%)]" />
                </div>
                <p className="text-[14px] font-semibold text-[hsl(200_25%_18%)]">Nada aguardando decisão</p>
                <p className="mt-1 text-[12px] text-[hsl(210_14%_45%)]">Toda operação em aberto está conforme.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[hsl(200_18%_94%)]">
                {fila.map((it) => (
                  <li key={it.id}>
                    <Link
                      href={it.href}
                      className="group flex items-start gap-3.5 py-3 -mx-1 px-1 rounded-lg hover:bg-[hsl(174_64%_98%)] transition-colors"
                    >
                      <TierMark tier={it.tier} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-semibold text-[hsl(200_25%_14%)] leading-tight">{it.titulo}</p>
                          {it.codigo && <span className="font-mono text-[11px] text-[hsl(210_14%_48%)]">{it.codigo}</span>}
                        </div>
                        <p className="mt-1 text-[12px] leading-snug text-[hsl(210_14%_40%)] line-clamp-2">{it.motivo}</p>
                        <div className="mt-1.5 flex items-center gap-2.5 text-[11px] text-[hsl(210_14%_48%)]">
                          <span className="inline-flex items-center gap-1 font-medium text-[hsl(200_25%_30%)]">
                            <ShieldAlert className="size-3" /> {it.quemAge}
                          </span>
                          {it.meta && <span className="text-[hsl(210_12%_58%)]">· {it.meta}</span>}
                        </div>
                      </div>
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-[hsl(210_14%_65%)] group-hover:text-[hsl(176_84%_25%)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Certificados a vencer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileClock className="size-4 text-[hsl(28_92%_45%)]" /> Certificados a vencer
              </CardTitle>
              <CardDescription>Empresas subcontratadas · 60/30/15 dias</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              {certsAVencer.length === 0 ? (
                <p className="py-4 text-[12px] text-[hsl(210_14%_45%)]">Nenhum certificado próximo do vencimento.</p>
              ) : (
                <ul className="space-y-2.5">
                  {certsAVencer.slice(0, 6).map(({ s, nv }) => (
                    <li key={s.id} className="flex items-center gap-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium text-[hsl(200_25%_18%)]">{s.razaoSocial}</p>
                        <p className="text-[11px] text-[hsl(210_14%_48%)]">GMP+ · {s.certGMP.validade.split("-").reverse().join("/")}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold num",
                          nv.nivel === "critico"
                            ? "bg-[hsl(0_84%_96%)] text-[hsl(0_70%_42%)]"
                            : nv.nivel === "alto"
                            ? "bg-[hsl(28_92%_95%)] text-[hsl(28_80%_38%)]"
                            : "bg-[hsl(45_90%_94%)] text-[hsl(38_70%_36%)]"
                        )}
                      >
                        D-{nv.dias}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Entrada nos pilares */}
          <Card>
            <CardHeader>
              <CardTitle>Pilares do MVP</CardTitle>
              <CardDescription>As entradas que alimentam a decisão</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <ul className="space-y-1">
                {pilares.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.nome}>
                      <Link
                        href={p.href}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[hsl(174_64%_98%)] transition-colors"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[hsl(200_18%_90%)] bg-[hsl(180_14%_98%)] text-[hsl(176_84%_25%)] group-hover:border-[hsl(176_60%_60%)]">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-[hsl(200_25%_16%)] leading-tight">{p.nome}</p>
                          <p className="text-[11px] text-[hsl(210_14%_46%)] leading-tight">{p.desc}</p>
                        </div>
                        {p.count > 0 && (
                          <span
                            className={cn(
                              "shrink-0 min-w-[20px] h-[18px] rounded-[5px] px-1 text-[10px] font-bold flex items-center justify-center num",
                              p.tone === "danger" ? "bg-[hsl(0_78%_50%)] text-white" : "bg-[hsl(28_92%_48%)] text-white"
                            )}
                          >
                            {p.count}
                          </span>
                        )}
                        <ChevronRight className="size-4 shrink-0 text-[hsl(210_14%_65%)] group-hover:text-[hsl(176_84%_25%)]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SemaforoTile({
  tone, icon, valor, rotulo, hint,
}: {
  tone: "danger" | "warning" | "success";
  icon: React.ReactNode;
  valor: number;
  rotulo: string;
  hint: string;
}) {
  const cor = {
    danger: { chip: "bg-[hsl(0_84%_96%)] text-[hsl(0_72%_46%)]", bar: "bg-[hsl(0_78%_50%)]" },
    warning: { chip: "bg-[hsl(28_92%_95%)] text-[hsl(28_82%_42%)]", bar: "bg-[hsl(28_92%_48%)]" },
    success: { chip: "bg-[hsl(142_60%_95%)] text-[hsl(142_64%_32%)]", bar: "bg-[hsl(142_71%_36%)]" },
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-xl border border-[hsl(200_18%_90%)] bg-white shadow-brand-sm">
      <span className={cn("absolute left-0 top-0 h-full w-1", cor.bar)} />
      <div className="flex items-center gap-3.5 px-5 py-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", cor.chip)}>{icon}</div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-bold leading-none tracking-[-0.02em] text-[hsl(200_25%_12%)] num">{valor}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[hsl(210_14%_40%)]">{rotulo}</span>
          </div>
          <p className="mt-1.5 text-[11.5px] text-[hsl(210_14%_46%)]">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function TierMark({ tier }: { tier: Tier }) {
  if (tier === "bloqueio") {
    return (
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(0_84%_96%)] text-[hsl(0_72%_46%)]" title="Bloqueio técnico">
        <AlertOctagon className="size-3.5" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[hsl(28_92%_95%)] text-[hsl(28_82%_42%)]" title="Aguardando análise">
      <Gavel className="size-3.5" />
    </span>
  );
}
