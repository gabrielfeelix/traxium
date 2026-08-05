"use client";

// Torre de Controle — home do modo MVP (diretriz §5.4: bloqueio-first, não vitrine
// de gráficos). Responde "o que exige ação agora": quem está bloqueado, por quê,
// quem precisa agir. TUDO puxa do estado real do store; zero número decorativo.
//
// Fase 3 acrescenta o outro lado da mesma moeda: o que o motor resolveu SOZINHO.
// Uma torre de controle que só mostra fila esconde o próprio valor — o produto
// existe para que a maioria das cargas nunca chegue à mesa de ninguém.

import Link from "next/link";
import {
  AlertOctagon, CircleCheck, ChevronRight, ShieldAlert, ShieldOff,
  Gavel, Boxes, Building2, GraduationCap, Container, FileClock, Truck, Cpu,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";
import { useSession } from "@/lib/store/session";
import { viagens, motoristas, filialDaViagem, pertenceAFilial } from "@/lib/mock-data";
import {
  excecoes, produtosIDTF, subcontratados, nivelVencimento, NIVEL_LABEL, NIVEL_CURTO,
  estadoQualificacao, ESTADO_QUALIFICACAO, type NivelAutoridade,
} from "@/lib/domain/model";
import { triarViagens, automacao, type ItemTriagem } from "@/lib/domain/control-tower";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

type Tier = "bloqueio" | "analise";
type ItemFila = {
  id: string;
  tier: Tier;
  titulo: string;
  codigo?: string;
  motivo: string;
  /** Nível que pode liberar. `tecnico` = ninguém: só a regularização. */
  autoridade: NivelAutoridade;
  meta?: string;
  href: string;
};

export function TorreDeControle() {
  const { version, filialId } = useSession();
  void version;

  const viagensEscopadas = viagens.filter((v) => pertenceAFilial(filialId, filialDaViagem(v)));

  // Triagem do motor sobre as viagens ativas — a base de tudo nesta tela.
  const triagem = triarViagens(viagensEscopadas);
  const auto = automacao(triagem);
  const liberadasPeloMotor = triagem.filter((t) => t.liberadaPor === "motor");
  const aguardando = triagem.filter((t) => t.liberadaPor === null);

  const excecoesPendentes = excecoes.filter((e) => e.status === "pendente");
  const produtosFila = produtosIDTF.filter((p) => p.statusClassificacao === "em_fila");
  const subPendentes = subcontratados
    .map((s) => ({ s, q: estadoQualificacao(s) }))
    .filter((x) => !ESTADO_QUALIFICACAO[x.q.estado].opera);
  const subBloqueioN = subPendentes.filter((x) => ESTADO_QUALIFICACAO[x.q.estado].tone === "danger").length;
  const academyPend = motoristas.filter((m) =>
    m.certificacoes.some((c) => c.status === "Vencida" && c.nome !== "MOPP")
  ).length;

  // ── Fila de decisões (unificada, bloqueio-first) ──────────────────────────
  // A viagem só entra na fila se ninguém a liberou ainda. O que o motor liberou
  // vai para o registro de decisões automáticas, não para a mesa do gestor.
  // Uma exceção pendente é o escalonamento de uma viagem, não um segundo assunto:
  // a viagem carrega a exceção na própria linha e some da lista de exceções soltas.
  const viagensNaFila = new Set(aguardando.map((t) => t.viagem.id));

  const fila: ItemFila[] = [
    ...aguardando.map((t): ItemFila => ({
      id: `v-${t.viagem.id}`,
      tier: t.faixa === "vermelho" ? "bloqueio" : "analise",
      titulo: `${t.viagem.motorista} · ${t.viagem.carreta}`,
      codigo: t.viagem.codigo,
      motivo: t.decisao.mensagem,
      autoridade: t.autoridade,
      meta: t.excecao
        ? `Exceção aberta por ${t.excecao.solicitante}`
        : `Entrega prev. ${formatDateTime(t.viagem.previsaoEntrega).split(",")[0]}`,
      href: t.excecao ? "/excecoes" : `/viagens/${t.viagem.id}`,
    })),
    ...subPendentes.map(({ s, q }): ItemFila => ({
      id: `s-${s.id}`,
      tier: ESTADO_QUALIFICACAO[q.estado].tone === "danger" ? "bloqueio" : "analise",
      titulo: s.razaoSocial,
      codigo: s.cnpj,
      motivo: `${q.estado}. ${q.motivo}`,
      // Certificado vencido/base pública inativa é fato, não decisão: ninguém libera.
      autoridade: ESTADO_QUALIFICACAO[q.estado].tone === "danger" ? "tecnico" : "gestor",
      href: "/subcontratados",
    })),
    ...excecoesPendentes.filter((e) => !viagensNaFila.has(e.viagemId)).map((e): ItemFila => ({
      id: `e-${e.id}`,
      tier: e.nivelRequerido === "tecnico" ? "bloqueio" : "analise",
      titulo: `Exceção · ${e.regra}`,
      codigo: e.codigoViagem,
      motivo: e.motivoBloqueio,
      autoridade: e.nivelRequerido,
      meta: `Solicitado por ${e.solicitante}`,
      href: "/excecoes",
    })),
    ...produtosFila.map((p): ItemFila => ({
      id: `p-${p.id}`,
      tier: "analise",
      titulo: p.nomeCanonico,
      motivo: "Produto não classificado na IDTF. Uso travado até definição da Qualidade.",
      // Classificar é ato técnico da Qualidade — não é liberar exceção.
      autoridade: "gestor",
      href: "/idtf",
    })),
  ].sort((a, b) => (a.tier === b.tier ? 0 : a.tier === "bloqueio" ? -1 : 1));

  // ── Certificados a vencer (60/30/15) — o que vai travar em breve ──────────
  const certsAVencer = subcontratados
    .map((s) => ({ s, nv: nivelVencimento(s.certGMP.validade) }))
    .filter((x) => ["critico", "alto", "alerta"].includes(x.nv.nivel))
    .sort((a, b) => a.nv.dias - b.nv.dias);

  const pilares = [
    { nome: "Operações", desc: "Viagens e liberação", icon: Truck, href: "/viagens", count: aguardando.filter((t) => t.faixa === "vermelho").length, tone: "danger" as const },
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-fg-muted">
            <span className="size-1.5 rounded-full bg-success-500 animate-pulse" />
            Tempo real
          </span>
        }
        actions={<NovaViagemModal />}
      />

      <FaixaTriagem auto={auto} triagem={triagem} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fila de decisões */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Fila de decisões</CardTitle>
                <CardDescription>O que o motor não resolve sozinho · bloqueios primeiro</CardDescription>
              </div>
              <span className="shrink-0 rounded-md bg-bg px-2 py-1 text-[11px] font-semibold text-fg num">
                {fila.length} {fila.length === 1 ? "item" : "itens"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            {fila.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-success-50">
                  <CircleCheck className="size-5 text-success-500" />
                </div>
                <p className="text-[14px] font-semibold text-fg">Nada aguardando decisão</p>
                <p className="mt-1 text-[12px] text-fg-muted">Toda operação em aberto está conforme.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border-soft">
                {fila.map((it) => (
                  <li key={it.id}>
                    <Link
                      href={it.href}
                      className="group flex items-start gap-3.5 py-3 -mx-1 px-1 rounded-lg hover:bg-brand-50/50 transition-colors"
                    >
                      <TierMark tier={it.tier} tecnico={it.autoridade === "tecnico"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-semibold text-fg leading-tight">{it.titulo}</p>
                          {it.codigo && <span className="font-mono text-[11px] text-fg-muted">{it.codigo}</span>}
                        </div>
                        <p className="mt-1 text-[12px] leading-snug text-fg-muted line-clamp-2">{it.motivo}</p>
                        <div className="mt-1.5 flex items-center gap-2.5 text-[11px] text-fg-muted">
                          <QuemLibera nivel={it.autoridade} />
                          {it.meta && <span className="text-fg-soft">· {it.meta}</span>}
                        </div>
                      </div>
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-fg-soft group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Registro de decisões automáticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="size-4 text-brand-600" /> Liberadas pelo motor
              </CardTitle>
              <CardDescription>Decididas sem humano · regra e evidência registradas</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              {liberadasPeloMotor.length === 0 ? (
                <p className="py-4 text-[12px] text-fg-muted">
                  Nenhuma viagem ativa passou na avaliação automática. Toda carga em aberto exigiu análise.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {liberadasPeloMotor.slice(0, 5).map((t) => {
                    const ok = t.decisao.checagens.filter((c) => c.ok).length;
                    return (
                      <li key={t.viagem.id}>
                        <Link
                          href={`/viagens/${t.viagem.id}`}
                          className="group block rounded-lg px-2 py-1.5 -mx-2 hover:bg-brand-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-semibold text-brand-600">{t.viagem.codigo}</span>
                            <span className="truncate text-[11px] text-fg-muted">{t.viagem.motorista}</span>
                          </div>
                          <p className="mt-0.5 text-[10.5px] text-fg-soft num">
                            {ok}/{t.decisao.checagens.length} checagens · base {t.decisao.versaoBaseIDTF} ·{" "}
                            {formatDate(t.decisao.avaliadoEm.slice(0, 10))}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                  {liberadasPeloMotor.length > 5 && (
                    <li>
                      <Link href="/dossie" className="text-[11px] font-medium text-brand-600 hover:underline">
                        Ver as {liberadasPeloMotor.length} no dossiê
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Certificados a vencer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileClock className="size-4 text-warning-500" /> Certificados a vencer
              </CardTitle>
              <CardDescription>Empresas subcontratadas · 60/30/15 dias</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              {certsAVencer.length === 0 ? (
                <p className="py-4 text-[12px] text-fg-muted">Nenhum certificado próximo do vencimento.</p>
              ) : (
                <ul className="space-y-2.5">
                  {certsAVencer.slice(0, 6).map(({ s, nv }) => (
                    <li key={s.id} className="flex items-center gap-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-medium text-fg">{s.razaoSocial}</p>
                        <p className="text-[11px] text-fg-muted">GMP+ · {formatDate(s.certGMP.validade)}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold num",
                          nv.nivel === "critico"
                            ? "bg-danger-50 text-danger-700"
                            : nv.nivel === "alto"
                            ? "bg-warning-50 text-warning-700"
                            : "bg-warning-50/60 text-warning-700"
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
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-brand-50/50 transition-colors"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border-soft bg-bg text-brand-600 group-hover:border-brand-300">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-fg leading-tight">{p.nome}</p>
                          <p className="text-[11px] text-fg-muted leading-tight">{p.desc}</p>
                        </div>
                        {p.count > 0 && (
                          <span
                            className={cn(
                              "shrink-0 min-w-[20px] h-[18px] rounded-[5px] px-1 text-[10px] font-bold flex items-center justify-center num text-white",
                              p.tone === "danger" ? "bg-danger-500" : "bg-warning-500"
                            )}
                          >
                            {p.count}
                          </span>
                        )}
                        <ChevronRight className="size-4 shrink-0 text-fg-soft group-hover:text-brand-600" />
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

// ─────────────────────────────────────────────────────────────────────────────
// Faixa de triagem — a afirmação central da Torre em uma imagem: de tudo que
// está em rota, quanto o motor decidiu sozinho. A barra é proporcional aos
// números reais; sem viagem ativa, não há barra nem porcentagem inventada.
// ─────────────────────────────────────────────────────────────────────────────

function FaixaTriagem({ auto, triagem }: { auto: ReturnType<typeof automacao>; triagem: ItemTriagem[] }) {
  const bloqueadas = triagem.filter((t) => t.faixa === "vermelho").length;
  const analise = triagem.filter((t) => t.faixa === "amarelo").length;

  const segmentos = [
    { n: auto.auto, cor: "bg-success-500", rotulo: "Liberadas pelo motor", hint: "Sem intervenção humana" },
    { n: auto.humano, cor: "bg-brand-500", rotulo: "Liberadas por autoridade", hint: "Exceção aprovada sobre bloqueio" },
    { n: analise, cor: "bg-warning-500", rotulo: "Aguardando análise", hint: "Alerta pendente de justificativa" },
    { n: bloqueadas, cor: "bg-danger-500", rotulo: "Bloqueadas", hint: "Impedidas de carregar" },
  ].filter((s) => s.n > 0);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7">
          {/* Momento-chave: o gradiente 135° marca a única métrica que resume o produto. */}
          <div className="shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="bg-gradient-to-br from-brand-600 to-sky-600 bg-clip-text text-[40px] font-bold leading-none tracking-[-0.03em] text-transparent num">
                {auto.pct === null ? "—" : `${auto.pct}%`}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted">
              Resolvido sem humano
            </p>
            <p className="mt-0.5 text-[11px] text-fg-soft">
              {auto.pct === null
                ? "Nenhuma viagem em rota"
                : `${auto.auto} de ${auto.total} em rota · ${auto.pendente} na sua mesa`}
            </p>
          </div>

          <div className="min-w-0 flex-1">
            {auto.total === 0 ? (
              <p className="text-[12px] text-fg-muted">Nenhuma viagem ativa nesta filial.</p>
            ) : (
              <>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-bg">
                  {segmentos.map((s) => (
                    <span
                      key={s.rotulo}
                      className={cn("h-full", s.cor)}
                      style={{ width: `${(s.n / auto.total) * 100}%` }}
                      title={`${s.rotulo}: ${s.n}`}
                    />
                  ))}
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
                  {segmentos.map((s) => (
                    <li key={s.rotulo} className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("size-2 shrink-0 rounded-full", s.cor)} />
                        <span className="text-[15px] font-bold leading-none text-fg num">{s.n}</span>
                      </div>
                      <p className="mt-1 truncate text-[11px] font-medium text-fg" title={s.rotulo}>{s.rotulo}</p>
                      <p className="truncate text-[10px] text-fg-soft" title={s.hint}>{s.hint}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Quem tem autoridade para liberar o item — e o caso em que não há ninguém. */
function QuemLibera({ nivel }: { nivel: NivelAutoridade }) {
  if (nivel === "tecnico") {
    return (
      <span
        className="inline-flex items-center gap-1 font-semibold text-danger-700"
        title="Bloqueio técnico: nenhuma autoridade libera. Só a regularização do fato."
      >
        <ShieldOff className="size-3" /> Ninguém libera — regularizar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-medium text-fg" title={NIVEL_LABEL[nivel]}>
      <ShieldAlert className="size-3" /> {NIVEL_CURTO[nivel]}
    </span>
  );
}

function TierMark({ tier, tecnico }: { tier: Tier; tecnico: boolean }) {
  if (tier === "bloqueio") {
    return (
      <span
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-700"
        title={tecnico ? "Bloqueio técnico — sem liberação por autoridade" : "Bloqueio"}
      >
        {tecnico ? <ShieldOff className="size-3.5" /> : <AlertOctagon className="size-3.5" />}
      </span>
    );
  }
  return (
    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-700" title="Aguardando análise">
      <Gavel className="size-3.5" />
    </span>
  );
}
