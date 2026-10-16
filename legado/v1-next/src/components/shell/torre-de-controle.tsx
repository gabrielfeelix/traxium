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
  Droplets, ClipboardCheck, Camera, PenLine, FileText, BellDot,
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
import {
  triarViagens, automacao, tempoEmFila, riscoGMP, evidenciasEssenciais, pendenciasDeResposta,
  type ItemTriagem, type RiscoGMP, type EvidenciaEssencial, type PendenciaResposta,
} from "@/lib/domain/control-tower";
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
  /** Desde quando espera. Ausente = a entidade não guarda esse carimbo. */
  desde?: string;
  href: string;
  // ── Painel da fila (Fase 7.5). Só itens de carregamento têm os três: risco de
  // feed, evidência e pendência de resposta são propriedades de uma viagem.
  risco?: RiscoGMP;
  evidencias?: EvidenciaEssencial[];
  pendencias?: PendenciaResposta[];
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
      desde: t.excecao?.solicitadoEm ?? t.viagem.iniciadaEm,
      href: t.excecao ? "/excecoes" : `/viagens/${t.viagem.id}`,
      risco: riscoGMP(t.decisao),
      evidencias: evidenciasEssenciais(t.viagem.id),
      pendencias: pendenciasDeResposta(t.viagem.id),
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
      desde: e.solicitadoEm,
      href: "/excecoes",
    })),
    ...produtosFila.map((p): ItemFila => ({
      id: `p-${p.id}`,
      tier: "analise",
      titulo: p.nomeCanonico,
      motivo: "Produto não classificado na IDTF. Uso travado até definição da Qualidade.",
      // Classificar é ato técnico da Qualidade — não é liberar exceção.
      autoridade: "gestor",
      desde: p.emFilaDesde,
      href: "/idtf",
    })),
  ];

  // Agrupada por severidade: é o que dá forma de fila à lista. Dentro do grupo,
  // quem espera há mais tempo sobe — a fila envelhece de cima para baixo.
  const idade = (i: ItemFila) => (i.desde ? tempoEmFila(i.desde).horas : -1);
  const grupos = (["bloqueio", "analise"] as const)
    .map((tier) => ({ tier, itens: fila.filter((i) => i.tier === tier).sort((a, b) => idade(b) - idade(a)) }))
    .filter((g) => g.itens.length > 0);

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
        description="O que exige decisão agora. O motor libera o que está conforme e traz ao humano apenas as exceções."
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
              <div className="space-y-4">
                {grupos.map((g) => (
                  <section key={g.tier}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={cn("h-3 w-[3px] rounded-full", g.tier === "bloqueio" ? "bg-danger-500" : "bg-warning-500")} />
                      <h3 className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.12em]",
                        g.tier === "bloqueio" ? "text-danger-700" : "text-warning-700"
                      )}>
                        {g.tier === "bloqueio" ? "Impedidos de carregar" : "Aguardando decisão"}
                      </h3>
                      <span className="text-[10px] font-bold text-fg-soft num">{g.itens.length}</span>
                    </div>

                    {/* A espinha corre atrás das marcas e é o que transforma a lista
                        numa fila: dá um trilho contínuo com a cor da severidade. */}
                    <ul className="relative">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-[11px] top-3 bottom-3 w-px",
                          g.tier === "bloqueio" ? "bg-danger-500/35" : "bg-warning-500/40"
                        )}
                      />
                      {g.itens.map((it, i) => (
                        <li key={it.id} className="animate-list-in" style={{ "--i": i } as React.CSSProperties}>
                          <Link
                            href={it.href}
                            className="group flex items-start gap-3 rounded-lg py-2.5 pr-1 transition-colors hover:bg-brand-50/50"
                          >
                            <TierMark tier={it.tier} tecnico={it.autoridade === "tecnico"} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <p className="text-[13px] font-semibold text-fg leading-tight">{it.titulo}</p>
                                {it.codigo && <span className="font-mono text-[11px] text-fg-muted">{it.codigo}</span>}
                              </div>
                              <p className="mt-1 text-[12px] leading-snug text-fg-muted line-clamp-2">{it.motivo}</p>
                              <div className="mt-1.5 flex items-center gap-x-2.5 gap-y-1 flex-wrap text-[11px]">
                                <QuemLibera nivel={it.autoridade} />
                                {it.risco && <RiscoChip risco={it.risco} />}
                                {it.meta && <span className="text-fg-soft">{it.meta}</span>}
                              </div>
                              {it.evidencias && <MiniaturaEvidencias itens={it.evidencias} />}
                              {it.pendencias?.length ? <Pendencias itens={it.pendencias} /> : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-1 pt-0.5">
                              <TempoEmFila desde={it.desde} />
                              <ChevronRight className="size-4 text-fg-soft transition-colors group-hover:text-brand-600" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
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
                  {liberadasPeloMotor.slice(0, 5).map((t, i) => {
                    const ok = t.decisao.checagens.filter((c) => c.ok).length;
                    return (
                      <li key={t.viagem.id} className="animate-list-in" style={{ "--i": i } as React.CSSProperties}>
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

          {/* Carga pendente por pilar. Não é menu — a sidebar já navega para os
              mesmos cinco destinos. Aqui só interessa onde a pendência está. */}
          <Card>
            <CardHeader>
              <CardTitle>Onde a pendência está</CardTitle>
              <CardDescription>Itens em aberto por pilar</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <ul className="space-y-2">
                {pilares.map((p) => {
                  const Icon = p.icon;
                  const maior = Math.max(...pilares.map((x) => x.count), 1);
                  return (
                    <li key={p.nome}>
                      <Link href={p.href} className="group block rounded-lg px-1.5 py-1 -mx-1.5 transition-colors hover:bg-brand-50/50">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("size-3.5 shrink-0", p.count > 0 ? "text-fg-muted" : "text-fg-soft")} />
                          <span className={cn("flex-1 truncate text-[12px]", p.count > 0 ? "font-semibold text-fg" : "text-fg-muted")}>
                            {p.nome}
                          </span>
                          <span className={cn("text-[12px] font-bold num", p.count > 0 ? "text-fg" : "text-fg-soft")}>
                            {p.count}
                          </span>
                        </div>
                        {/* Barra proporcional ao maior pilar — mostra onde o volume está. */}
                        <div className="mt-1 ml-[22px] h-1 overflow-hidden rounded-full bg-bg">
                          <span
                            className={cn(
                              "block h-full rounded-full transition-[width] duration-500",
                              p.tone === "danger" ? "bg-danger-500" : p.count > 0 ? "bg-warning-500" : "bg-transparent"
                            )}
                            style={{ width: `${(p.count / maior) * 100}%` }}
                          />
                        </div>
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
                {/* 4 colunas só a partir de xl — abaixo disso os rótulos truncavam
                    ("Libera…", "Aguar…"), que é pior que quebrar em duas linhas. */}
                <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 xl:grid-cols-4">
                  {segmentos.map((s, i) => (
                    <li key={s.rotulo} className="min-w-0 animate-list-in" style={{ "--i": i } as React.CSSProperties}>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("size-2 shrink-0 rounded-full", s.cor)} />
                        <span className="text-[15px] font-bold leading-none text-fg num">{s.n}</span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium leading-tight text-fg">{s.rotulo}</p>
                      <p className="text-[10px] leading-tight text-fg-soft">{s.hint}</p>
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

/** Risco de feed do carregamento. Derivado da decisão — nunca um rótulo à mão. */
function RiscoChip({ risco }: { risco: RiscoGMP }) {
  if (risco.nivel === "nenhum") return null;
  return (
    <span
      title={risco.motivo}
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-semibold",
        risco.nivel === "critico" && "bg-danger-50 text-danger-700",
        risco.nivel === "alto" && "bg-danger-50/60 text-danger-700",
        risco.nivel === "medio" && "bg-warning-50 text-warning-700",
        risco.nivel === "baixo" && "bg-bg text-fg-muted"
      )}
    >
      <ShieldAlert className="size-3" /> {risco.rotulo}{" "}
      <span className="num">· {risco.falhas} {risco.falhas === 1 ? "falha" : "falhas"}</span>
    </span>
  );
}

const EVIDENCIA_ICON: Record<EvidenciaEssencial["chave"], typeof Boxes> = {
  t3: Boxes,
  limpeza: Droplets,
  inspecao: ClipboardCheck,
  fotos: Camera,
  assinatura: PenLine,
  documentos: FileText,
};

/**
 * Miniatura das evidências essenciais: seis marcas, presente ou ausente. Serve
 * para ler antes de abrir a viagem o que falta — e o que falta aparece apagado,
 * não some.
 */
function MiniaturaEvidencias({ itens }: { itens: EvidenciaEssencial[] }) {
  const ok = itens.filter((e) => e.ok).length;
  return (
    <div className="mt-1.5 flex items-center gap-1" aria-label={`Evidências essenciais: ${ok} de ${itens.length}`}>
      {itens.map((e) => {
        const Icon = EVIDENCIA_ICON[e.chave];
        return (
          <span
            key={e.chave}
            title={`${e.rotulo} — ${e.detalhe}`}
            className={cn(
              "flex size-5 items-center justify-center rounded border",
              e.ok
                ? "border-success-500/40 bg-success-50 text-success-700"
                : "border-border bg-bg text-fg-soft"
            )}
          >
            <Icon className="size-3" aria-hidden />
          </span>
        );
      })}
      <span className="ml-0.5 text-[10.5px] text-fg-soft num">
        {ok}/{itens.length}
      </span>
    </div>
  );
}

/** O que está pendente de resposta de alguém. Cada linha é um fato do store. */
function Pendencias({ itens }: { itens: PendenciaResposta[] }) {
  return (
    <ul className="mt-1 space-y-0.5">
      {itens.map((p) => (
        <li key={p.rotulo} className="flex items-start gap-1.5 text-[10.5px] text-fg-muted">
          <BellDot className="mt-[2px] size-3 shrink-0 text-warning-700" aria-hidden />
          <span>
            {p.rotulo}
            {p.desde && <span className="text-fg-soft num"> · há {tempoEmFila(p.desde).dias}d</span>}
          </span>
        </li>
      ))}
    </ul>
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

/**
 * Tempo em fila. Só aparece quando há carimbo real — subcontratado não guarda
 * "pendente desde", então ali não se inventa uma idade.
 */
function TempoEmFila({ desde }: { desde?: string }) {
  if (!desde) return null;
  const t = tempoEmFila(desde);
  // A fila envelhece: acima de 30 dias deixa de ser espera e vira problema.
  const tom = t.dias >= 30 ? "danger" : t.dias >= 7 ? "warning" : "muted";
  return (
    <span
      title={`Na fila desde ${formatDate(desde.slice(0, 10))}`}
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold num whitespace-nowrap",
        tom === "danger" && "bg-danger-50 text-danger-700",
        tom === "warning" && "bg-warning-50 text-warning-700",
        tom === "muted" && "text-fg-soft"
      )}
    >
      {t.rotulo}
    </span>
  );
}

function TierMark({ tier, tecnico }: { tier: Tier; tecnico: boolean }) {
  // `ring-4 ring-white` recorta a espinha atrás da marca, em vez de escondê-la.
  const base = "relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-lg ring-4 ring-white";
  if (tier === "bloqueio") {
    return (
      <span
        className={cn(base, "bg-danger-50 text-danger-700")}
        title={tecnico ? "Bloqueio técnico — sem liberação por autoridade" : "Bloqueio"}
      >
        {tecnico ? <ShieldOff className="size-3.5" /> : <AlertOctagon className="size-3.5" />}
      </span>
    );
  }
  return (
    <span className={cn(base, "bg-warning-50 text-warning-700")} title="Aguardando análise">
      <Gavel className="size-3.5" />
    </span>
  );
}
