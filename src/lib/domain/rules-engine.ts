// TRAXIUM — Motor de regras (Fase 0)
//
// Transforma a norma GMP+ FSA em decisão executável. Três tiers explícitos
// (PLANO-PRODUTO.md §2): BLOQUEIO automático · ALERTA com justificativa obrigatória
// · REGISTRO / LIBERADO. A versão da base IDTF usada fica gravada na decisão
// (auditável — pergunta 19).

import {
  ORDEM_REGIME,
  VERSAO_BASE_IDTF,
  type Regime,
  type LoadHistory,
  type ProdutoIDTF,
  loadHistory,
  findProduto,
  findCompartimento,
  findImplemento,
  findSubcontratado,
  limpezasApos,
  ultimaLimpeza,
  inspecaoDaViagem,
  compartimentoPorViagem,
  produtoAtualPorViagem,
  nivelVencimento,
  estadoQualificacao,
  ESTADO_QUALIFICACAO,
  FOTOS_MINIMAS,
  HOJE,
  type CleaningEvent,
} from "./model";
import { competenciaMotorista } from "./academy";
import {
  classeDe, ORDEM_CLASSE, ORDEM_REGRAS, REGRA_LABEL, REGRA_CHECAGEM,
  type ClasseRegra, type RegraId,
} from "./motor-config";
import { viagens, motoristas } from "@/lib/mock-data";

export type Tier = "BLOQUEIO" | "ALERTA" | "LIBERADO";

export type T3Entry = {
  ordem: number; // 1 = T-1 (mais recente / determinante)
  load: LoadHistory;
  produto: ProdutoIDTF | undefined;
  determinante: boolean;
};

/**
 * T-3 do COMPARTIMENTO: as três últimas cargas, mais recente primeiro.
 * Independe de qual cavalo puxou cada carga — o histórico é do compartimento.
 */
export function getT3(compartimentoId: string): T3Entry[] {
  return loadHistory
    .filter((l) => l.compartimentoId === compartimentoId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3)
    .map((load, i) => ({
      ordem: i + 1,
      load,
      produto: findProduto(load.produtoId),
      determinante: i === 0,
    }));
}

/** Quantos cavalos distintos aparecem no T-3 — evidencia independência do cavalo. */
export function cavalosDistintosNoT3(compartimentoId: string): string[] {
  return [...new Set(getT3(compartimentoId).map((e) => e.load.cavaloPlaca))];
}

export type Decisao = {
  tier: Tier;
  regra: string;
  /** Classe configurada da regra que decidiu. `null` quando nada falhou. */
  classe: ClasseRegra | null;
  mensagem: string;
  acaoSugerida: string;
  regimeExigido?: Regime;
  regimeAplicado?: Regime | null;
  versaoBaseIDTF: string;
  compartimentoId: string;
  avaliadoEm: string;
  /**
   * TODAS as condições avaliadas, sempre na mesma ordem — não só as que
   * couberam antes da primeira falha. É o que o dossiê mostra e o que permite
   * ao verde exigir as oito condições da diretriz.
   */
  checagens: { regra: RegraId; nome: string; ok: boolean; detalhe: string; classe: ClasseRegra }[];
};

/** Avaliação bruta de uma regra, antes de virar decisão. */
type Avaliacao = { regra: RegraId; ok: boolean; detalhe: string; mensagem: string; acao: string };

const DIA_MS = 86_400_000;

/** Dias entre a data de referência e uma validade (positivo = ainda válido). */
function diasAte(validade: string, refISO: string): number {
  return Math.floor((new Date(validade).getTime() - new Date(refISO).getTime()) / DIA_MS);
}

/**
 * Avalia o carregamento de uma viagem contra o histórico do compartimento.
 * Ordem das regras segue a severidade: bloqueios primeiro, depois alertas.
 *
 * @param refISO data de referência para validade de certificados. Default: a data de
 *   carregamento da própria viagem (`iniciadaEm`) — o certificado é avaliado NO MOMENTO
 *   da viagem, não "hoje" (pergunta 20 / auditabilidade). Fallback: hoje.
 */
export function avaliarCarregamento(viagemId: string, refISO?: string): Decisao {
  const compartimentoId = compartimentoPorViagem[viagemId];
  const viagem = viagens.find((v) => v.id === viagemId);
  const ref = refISO ?? viagem?.iniciadaEm ?? `${HOJE}T00:00:00`;
  const base = {
    versaoBaseIDTF: VERSAO_BASE_IDTF,
    compartimentoId: compartimentoId ?? "—",
    avaliadoEm: ref,
  };

  if (!compartimentoId) {
    return {
      ...base, tier: "BLOQUEIO", regra: "Compartimento não vinculado", classe: "bloqueio",
      mensagem: "Viagem sem compartimento vinculado. Impossível validar T-3.",
      acaoSugerida: "Vincule o compartimento que tocará o produto antes de liberar.",
      checagens: [],
    };
  }

  const t3 = getT3(compartimentoId);
  const atual = findProduto(produtoAtualPorViagem[viagemId] ?? "");
  const comp = findCompartimento(compartimentoId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);
  const inspecao = inspecaoDaViagem(viagemId);
  const motorista = motoristas.find((m) => m.nome === viagem?.motorista);

  const t3Completo = t3.length >= 3;
  const determinante = t3[0];
  const prodAnterior = determinante?.produto;
  const regimeExigido = prodAnterior?.regimeAntesDeFeed;
  const limpezas = limpezasApos(compartimentoId, determinante?.load.data ?? "1970-01-01");
  const regimeAplicado = t3Completo ? limpezas[0]?.regime ?? null : null;

  // Uma regra que não pode ser avaliada não é "conforme": sem T-3 não há como
  // afirmar nada sobre a carga anterior ou a limpeza. Marca falha com o motivo
  // explícito, em vez de passar por omissão.
  const semT3 = "Não avaliável sem o histórico T-3.";

  const av: Avaliacao[] = [
    {
      regra: "t3_completo",
      ok: t3Completo,
      detalhe: t3Completo ? "3 cargas anteriores registradas" : `Apenas ${t3.length} carga(s) registrada(s)`,
      mensagem: `Histórico das 3 últimas cargas incompleto para o compartimento ${comp?.identificador ?? compartimentoId}.`,
      acao: "Registre as cargas anteriores do compartimento antes de liberar o carregamento.",
    },
    {
      regra: "carga_anterior",
      ok: t3Completo && !prodAnterior?.bloqueiaFeed,
      detalhe: !t3Completo
        ? semT3
        : prodAnterior?.bloqueiaFeed
        ? `${prodAnterior.nomeCanonico} — proibida antes de feed`
        : `${prodAnterior?.nomeCanonico} — não proibida`,
      mensagem: prodAnterior
        ? `A última carga do compartimento ${comp?.identificador ?? ""} (${imp?.placa}) foi ${prodAnterior.nomeCanonico} em ${fmt(determinante.load.data)}. A IDTF ${VERSAO_BASE_IDTF} exige procedimento de liberação e regime D (desinfecção) antes de carregar ${atual?.nomeCanonico ?? "feed"}. Limpeza correspondente não foi evidenciada.`
        : "Carga anterior desconhecida — sem T-3 não há como avaliar contaminação cruzada.",
      acao: "Executar limpeza Regime D com evidência e solicitar liberação do Gestor GMP+.",
    },
    {
      regra: "limpeza_compativel",
      ok:
        t3Completo &&
        regimeExigido != null &&
        regimeAplicado != null &&
        ORDEM_REGIME[regimeAplicado] >= ORDEM_REGIME[regimeExigido],
      detalhe: !t3Completo
        ? semT3
        : regimeAplicado
        ? `Aplicado ${regimeAplicado}, exigido ${regimeExigido}`
        : `Nenhuma limpeza após a última carga (exigido ${regimeExigido})`,
      mensagem: regimeAplicado
        ? `Limpeza aplicada (Regime ${regimeAplicado}) é insuficiente. A última carga (${prodAnterior?.nomeCanonico}) exige Regime ${regimeExigido} pela IDTF.`
        : `Nenhuma limpeza evidenciada após ${prodAnterior?.nomeCanonico}. A IDTF exige Regime ${regimeExigido} antes de ${atual?.nomeCanonico ?? "feed"}.`,
      acao: `Executar limpeza Regime ${regimeExigido} com evidência fotográfica e reenviar.`,
    },
    {
      regra: "checklist_aprovado",
      ok: inspecao?.resultado === "aprovado",
      detalhe: inspecao ? `${inspecao.resultado} (${inspecao.itensOk}/${inspecao.itensTotal})` : "Sem inspeção registrada",
      mensagem: inspecao
        ? `Checklist do compartimento ${inspecao.resultado} (${inspecao.itensOk}/${inspecao.itensTotal} itens). Carregamento impedido.`
        : "Nenhuma inspeção pré-carregamento registrada para esta viagem.",
      acao: "Corrigir os itens reprovados e realizar nova inspeção.",
    },
    {
      regra: "certificado_valido",
      ok: !(imp?.certGMP.status === "Vencida") && !(sub ? diasAte(sub.certGMP.validade, ref) < 0 : false),
      detalhe:
        imp?.certGMP.status === "Vencida"
          ? `Cert. do implemento ${imp?.placa} vencida`
          : sub && diasAte(sub.certGMP.validade, ref) < 0
          ? `Cert. do subcontratado ${sub.razaoSocial} vencida`
          : "Certificados válidos",
      mensagem:
        imp?.certGMP.status === "Vencida"
          ? `Certificação GMP+ do implemento ${imp.placa} vencida em ${fmt(imp.certGMP.validade)}.`
          : `Certificado GMP+ do subcontratado ${sub?.razaoSocial} vencido em ${sub ? fmt(sub.certGMP.validade) : "—"} (status base pública: ${sub?.certGMP.statusBasePublica}).`,
      acao: "Renovar/validar a certificação GMP+ antes de operar sob cadeia certificada.",
    },
    {
      regra: "cadastro_valido",
      // Frota própria não tem subcontratado: a condição não se aplica, e não se
      // aplica é diferente de reprovado.
      ok: !sub || ESTADO_QUALIFICACAO[estadoQualificacao(sub).estado].opera,
      detalhe: !sub
        ? "Frota própria — não se aplica"
        : `${estadoQualificacao(sub).estado}`,
      mensagem: sub ? `${sub.razaoSocial}: ${estadoQualificacao(sub).motivo}` : "",
      acao: "Regularize a qualificação do subcontratado em Gatekeeper.",
    },
    {
      regra: "acordo_vigente",
      ok: !sub || Boolean(sub.acordo?.assinadoEm && diasAte(sub.acordo.vigenciaFim, ref) >= 0),
      detalhe: !sub
        ? "Frota própria — não se aplica"
        : !sub.acordo?.assinadoEm
        ? "Acordo não assinado"
        : diasAte(sub.acordo.vigenciaFim, ref) < 0
        ? `Vencido em ${fmt(sub.acordo.vigenciaFim)}`
        : `${sub.acordo.versao} vigente até ${fmt(sub.acordo.vigenciaFim)}`,
      mensagem: sub
        ? `Acordo de Garantia da Qualidade de ${sub.razaoSocial} não está vigente na data do carregamento.`
        : "",
      acao: "Colher assinatura do acordo vigente antes de operar sob a cadeia certificada.",
    },
    {
      regra: "competencia_motorista",
      ok: motorista ? competenciaMotorista(motorista.id, undefined, { regime: regimeExigido }).elegivel : false,
      detalhe: motorista
        ? competenciaMotorista(motorista.id, undefined, { regime: regimeExigido }).motivo
        : "Motorista não identificado no cadastro",
      mensagem: motorista
        ? `${motorista.nome} não tem competência comprovada para esta operação: ${competenciaMotorista(motorista.id, undefined, { regime: regimeExigido }).motivo}`
        : "Motorista da viagem não encontrado no cadastro.",
      acao: "Registre a conclusão da trilha pendente na Academy e reavalie.",
    },
    {
      regra: "produto_reconhecido",
      ok: Boolean(atual) && atual?.statusClassificacao !== "em_fila",
      detalhe: !atual
        ? "Produto da viagem não vinculado à base"
        : atual.statusClassificacao === "em_fila"
        ? "Aguardando classificação da Qualidade"
        : `${atual.nomeCanonico} · ${atual.idtfCode ?? "sem código IDTF"}`,
      mensagem: "Produto não classificado na base IDTF. Uso travado até definição formal da Qualidade.",
      acao: "Classificar o produto na fila do Motor IDTF.",
    },
    {
      regra: "fotos_minimas",
      ok: (inspecao?.fotos ?? 0) >= FOTOS_MINIMAS,
      detalhe: inspecao
        ? `${inspecao.fotos} de ${FOTOS_MINIMAS} ângulos`
        : "Sem inspeção — nenhuma foto",
      mensagem: `Evidência fotográfica incompleta: ${inspecao?.fotos ?? 0} de ${FOTOS_MINIMAS} ângulos obrigatórios.`,
      acao: "Completar as fotos guiadas do compartimento antes de concluir.",
    },
    {
      regra: "cert_a_vencer",
      ok: !certificadoAVencer(sub, imp, ref),
      detalhe: certificadoAVencer(sub, imp, ref) ?? "Nenhum certificado a vencer em 60 dias",
      mensagem: certificadoAVencer(sub, imp, ref) ?? "",
      acao: "Liberação exige justificativa registrada do despachante/gestor.",
    },
    {
      regra: "sync_pendente",
      ok: !inspecao?.offline,
      detalhe: inspecao?.offline ? "Inspeção feita offline" : "Evidência sincronizada",
      mensagem: "Inspeção realizada offline — validar carimbo de sincronização.",
      acao: "Confirmar a sincronização da evidência antes de encerrar a viagem.",
    },
  ];

  const checagens: Decisao["checagens"] = ORDEM_REGRAS.map((id) => {
    const a = av.find((x) => x.regra === id)!;
    return { regra: id, nome: REGRA_CHECAGEM[id], ok: a.ok, detalhe: a.detalhe, classe: classeDe(id) };
  });

  // Decide DEPOIS de avaliar tudo: a decisão é a classe mais severa entre as
  // falhas, e a regra reportada é a primeira falha dessa classe na ordem de
  // precedência. Sair na primeira falha, como antes, escondia do dossiê tudo
  // que vinha depois — e impedia o verde de exigir as condições da diretriz.
  const falhas = ORDEM_REGRAS.map((id) => av.find((x) => x.regra === id)!).filter((a) => !a.ok);

  if (falhas.length === 0) {
    return {
      ...base, tier: "LIBERADO", regra: "Conforme", classe: null,
      regimeExigido, regimeAplicado,
      mensagem: `Compartimento apto. Regime ${regimeExigido} aplicado e evidenciado; T-3, certificações, acordo, competência e inspeção conformes.`,
      acaoSugerida: "Liberar carregamento.",
      checagens,
    };
  }

  const pior = falhas.reduce((a, b) =>
    ORDEM_CLASSE[classeDe(b.regra)] > ORDEM_CLASSE[classeDe(a.regra)] ? b : a
  );
  const classe = classeDe(pior.regra);
  const tier: Tier = classe === "bloqueio" ? "BLOQUEIO" : classe === "alerta" ? "ALERTA" : "LIBERADO";

  return {
    ...base,
    tier,
    classe,
    regra: REGRA_LABEL[pior.regra],
    regimeExigido,
    regimeAplicado,
    mensagem: pior.mensagem,
    acaoSugerida: pior.acao,
    checagens,
  };
}

/** Descreve o certificado mais próximo do vencimento dentro da janela de 60 dias. */
function certificadoAVencer(
  sub: ReturnType<typeof findSubcontratado>,
  imp: ReturnType<typeof findImplemento>,
  ref: string
): string | null {
  const avisos: string[] = [];
  if (sub) {
    const d = diasAte(sub.certGMP.validade, ref);
    if (d >= 0 && d <= 60) avisos.push(`Certificado do subcontratado vence em ${d} dias.`);
  }
  if (imp) {
    const d = diasAte(imp.certGMP.validade, ref);
    if (d >= 0 && d <= 60) avisos.push(`Certificação do implemento ${imp.placa} vence em ${d} dias.`);
  }
  return avisos.length ? avisos.join(" ") : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status do COMPARTIMENTO (standalone) — assume que a próxima carga será feed.
// Reutilizado pela Frota e pela tela de detalhe do compartimento.
// ─────────────────────────────────────────────────────────────────────────────

export type StatusCompartimento = {
  status: "apto" | "bloqueado" | "requer_limpeza" | "sem_historico";
  label: string;
  regimeExigido?: Regime;
  ultimaCarga?: ProdutoIDTF;
  ultimaCargaData?: string;
  ultimaLimpeza?: CleaningEvent;
  motivo: string;
};

export function statusCompartimento(compartimentoId: string): StatusCompartimento {
  const t3 = getT3(compartimentoId);
  if (!t3.length) {
    return { status: "sem_historico", label: "Sem histórico", motivo: "Nenhuma carga anterior registrada." };
  }

  const determinante = t3[0];
  const ultimaCarga = determinante.produto;
  const ultimaCargaData = determinante.load.data;
  const regimeExigido = ultimaCarga?.regimeAntesDeFeed;
  const limpeza = ultimaLimpeza(compartimentoId);
  const limpezaAposUltimaCarga =
    limpeza && new Date(limpeza.data).getTime() >= new Date(ultimaCargaData).getTime()
      ? limpeza
      : undefined;

  // Carga proibida sem limpeza D evidenciada → bloqueado
  if (ultimaCarga?.bloqueiaFeed) {
    const temD = limpezaAposUltimaCarga?.regime === "D";
    if (!temD) {
      return {
        status: "bloqueado", label: "Bloqueado",
        regimeExigido: "D", ultimaCarga, ultimaCargaData, ultimaLimpeza: limpezaAposUltimaCarga,
        motivo: `Última carga proibida (${ultimaCarga.nomeCanonico}). Exige liberação formal + Regime D antes de feed.`,
      };
    }
  }

  const regimeOk =
    regimeExigido != null && limpezaAposUltimaCarga != null &&
    ORDEM_REGIME[limpezaAposUltimaCarga.regime] >= ORDEM_REGIME[regimeExigido];

  if (regimeOk) {
    return {
      status: "apto", label: "Apto",
      regimeExigido, ultimaCarga, ultimaCargaData, ultimaLimpeza: limpezaAposUltimaCarga,
      motivo: `Limpeza Regime ${limpezaAposUltimaCarga!.regime} evidenciada; compatível com a última carga.`,
    };
  }

  return {
    status: "requer_limpeza", label: "Requer limpeza",
    regimeExigido, ultimaCarga, ultimaCargaData, ultimaLimpeza: limpezaAposUltimaCarga,
    motivo: `Última carga (${ultimaCarga?.nomeCanonico}) exige Regime ${regimeExigido}. Limpeza compatível não evidenciada.`,
  };
}

/**
 * Avalia um carregamento HIPOTÉTICO (compartimento + produto) antes da viagem existir.
 * Usado pelo modal de Nova viagem para mostrar a decisão no ato do despacho.
 */
export function avaliarNovoCarregamento(compartimentoId: string, refISO = `${HOJE}T00:00:00`): {
  tier: Tier;
  motivo: string;
  regimeExigido?: Regime;
  /** Mesma nomenclatura de `Decisao.regra` — é o que roteia a autoridade (control-tower.ts). */
  regra: string;
} {
  const st = statusCompartimento(compartimentoId);

  if (st.status === "bloqueado") {
    return { tier: "BLOQUEIO", motivo: st.motivo, regimeExigido: st.regimeExigido, regra: "Carga anterior proibida" };
  }
  if (st.status === "requer_limpeza") {
    return { tier: "BLOQUEIO", motivo: st.motivo, regimeExigido: st.regimeExigido, regra: "Limpeza incompatível" };
  }

  // Compartimento ok (apto ou sem histórico) → checar certificação do implemento/subcontratado
  const comp = findCompartimento(compartimentoId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);

  if (imp?.certGMP.status === "Vencida") {
    return { tier: "BLOQUEIO", motivo: `Certificação GMP+ do implemento ${imp.placa} vencida.`, regimeExigido: st.regimeExigido, regra: "Certificado vencido/incompatível" };
  }
  if (sub && nivelVencimento(sub.certGMP.validade, refISO.slice(0, 10)).nivel === "vencido") {
    return { tier: "BLOQUEIO", motivo: `Certificado GMP+ do subcontratado ${sub.razaoSocial} vencido.`, regimeExigido: st.regimeExigido, regra: "Certificado vencido/incompatível" };
  }

  const nivelImp = imp ? nivelVencimento(imp.certGMP.validade, refISO.slice(0, 10)).nivel : "ok";
  const nivelSub = sub ? nivelVencimento(sub.certGMP.validade, refISO.slice(0, 10)).nivel : "ok";
  if ([nivelImp, nivelSub].some((n) => n === "critico" || n === "alto" || n === "alerta")) {
    return { tier: "ALERTA", motivo: "Certificação a vencer em ≤60 dias — liberação exige justificativa.", regimeExigido: st.regimeExigido, regra: "Pendência sem risco direto" };
  }

  return {
    tier: "LIBERADO",
    motivo: st.status === "sem_historico" ? "Compartimento novo, sem histórico — apto." : st.motivo,
    regimeExigido: st.regimeExigido,
    regra: "Conforme",
  };
}

/** Score de conformidade derivado das checagens (0–100). */
export function scoreConformidade(d: Decisao): number {
  if (!d.checagens.length) return 0;
  const ok = d.checagens.filter((c) => c.ok).length;
  return Math.round((ok / d.checagens.length) * 100);
}

// ---------------------------------------------------------------------------
// CAPA — correção imediata não basta: auditor cobra contenção → causa raiz →
// ação corretiva → eficácia verificada, nesta ordem. A cadeia quebra na
// primeira etapa não registrada.

export type CapaInput = {
  acaoImediata: string;
  causaRaiz: string;
  acaoCorretiva: string;
  eficaciaVerificada: boolean;
};

export type CapaVeredito = {
  /** Etapas registradas em sequência: 0–3 (contenção, causa raiz, corretiva). */
  etapasCompletas: number;
  situacao: "incompleta" | "aguardando_eficacia" | "eficaz";
  motivo: string;
};

export function avaliarCapa(capa: CapaInput): CapaVeredito {
  const ok = (s: string) => s.trim().length > 0;
  if (!ok(capa.acaoImediata)) {
    return {
      etapasCompletas: 0,
      situacao: "incompleta",
      motivo: "Sem ação imediata registrada — a NC segue sem contenção do dano.",
    };
  }
  if (!ok(capa.causaRaiz)) {
    return {
      etapasCompletas: 1,
      situacao: "incompleta",
      motivo: "Contenção feita, mas sem causa raiz o auditor reprova: corrigir o sintoma não evita reincidência.",
    };
  }
  if (!ok(capa.acaoCorretiva)) {
    return {
      etapasCompletas: 2,
      situacao: "incompleta",
      motivo: "Causa raiz identificada sem ação corretiva — nada impede o problema de voltar.",
    };
  }
  if (!capa.eficaciaVerificada) {
    return {
      etapasCompletas: 3,
      situacao: "aguardando_eficacia",
      motivo: "Plano completo. Falta verificar a eficácia — só ela encerra a NC perante o auditor.",
    };
  }
  return {
    etapasCompletas: 3,
    situacao: "eficaz",
    motivo: "Ciclo CAPA completo: contenção, causa raiz, ação corretiva e eficácia verificada.",
  };
}

function fmt(iso: string): string {
  const [y, m, dd] = iso.slice(0, 10).split("-");
  return `${dd}/${m}/${y}`;
}
