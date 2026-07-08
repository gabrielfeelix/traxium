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
  HOJE,
  type CleaningEvent,
} from "./model";

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
  mensagem: string;
  acaoSugerida: string;
  regimeExigido?: Regime;
  regimeAplicado?: Regime | null;
  versaoBaseIDTF: string;
  compartimentoId: string;
  avaliadoEm: string;
  /** Sub-checagens que compõem o score de conformidade. */
  checagens: { nome: string; ok: boolean; detalhe: string }[];
};

const DIA_MS = 86_400_000;

/** Dias entre a data de referência e uma validade (positivo = ainda válido). */
function diasAte(validade: string, refISO: string): number {
  return Math.floor((new Date(validade).getTime() - new Date(refISO).getTime()) / DIA_MS);
}

/**
 * Avalia o carregamento de uma viagem contra o histórico do compartimento.
 * Ordem das regras segue a severidade: bloqueios primeiro, depois alertas.
 *
 * @param refISO data de referência para validade de certificados (default: saída da viagem)
 */
export function avaliarCarregamento(viagemId: string, refISO = "2026-05-25T00:00:00"): Decisao {
  const compartimentoId = compartimentoPorViagem[viagemId];
  const base = {
    versaoBaseIDTF: VERSAO_BASE_IDTF,
    compartimentoId: compartimentoId ?? "—",
    avaliadoEm: refISO,
  };

  if (!compartimentoId) {
    return {
      ...base, tier: "BLOQUEIO", regra: "Compartimento não vinculado",
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

  const checagens: Decisao["checagens"] = [];

  // ── Regra 1: T-3 completo ────────────────────────────────────────────────
  const t3Completo = t3.length >= 3;
  checagens.push({
    nome: "Histórico T-3",
    ok: t3Completo,
    detalhe: t3Completo ? "3 cargas anteriores registradas" : `Apenas ${t3.length} carga(s) registrada(s)`,
  });
  if (!t3Completo) {
    return {
      ...base, tier: "BLOQUEIO", regra: "T-3 ausente/incompleto",
      mensagem: `Histórico das 3 últimas cargas incompleto para o compartimento ${comp?.identificador ?? compartimentoId}.`,
      acaoSugerida: "Registre as cargas anteriores do compartimento antes de liberar o carregamento.",
      checagens,
    };
  }

  const determinante = t3[0];
  const prodAnterior = determinante.produto;
  const regimeExigido = prodAnterior?.regimeAntesDeFeed;

  // ── Regra 2: carga anterior proibida ─────────────────────────────────────
  if (prodAnterior?.bloqueiaFeed) {
    checagens.push({ nome: "Carga anterior", ok: false, detalhe: `${prodAnterior.nomeCanonico} — proibida antes de feed` });
    return {
      ...base, tier: "BLOQUEIO", regra: "Carga anterior proibida",
      regimeExigido: "D",
      mensagem: `A última carga do compartimento ${comp?.identificador ?? ""} (${imp?.placa}) foi ${prodAnterior.nomeCanonico} em ${fmt(determinante.load.data)}. A IDTF ${VERSAO_BASE_IDTF} exige procedimento de liberação e regime D (desinfecção) antes de carregar ${atual?.nomeCanonico ?? "feed"}. Limpeza correspondente não foi evidenciada.`,
      acaoSugerida: "Executar limpeza Regime D com evidência e solicitar liberação do Gestor GMP+.",
      regimeAplicado: null,
      checagens,
    };
  }
  checagens.push({ nome: "Carga anterior", ok: true, detalhe: `${prodAnterior?.nomeCanonico} — não proibida` });

  // ── Regra 3: limpeza compatível com o regime exigido ─────────────────────
  const limpezas = limpezasApos(compartimentoId, determinante.load.data);
  const regimeAplicado = limpezas[0]?.regime ?? null;
  const limpezaOk =
    regimeExigido != null && regimeAplicado != null &&
    ORDEM_REGIME[regimeAplicado] >= ORDEM_REGIME[regimeExigido];
  checagens.push({
    nome: "Limpeza vs. IDTF",
    ok: limpezaOk,
    detalhe: regimeAplicado
      ? `Aplicado ${regimeAplicado}, exigido ${regimeExigido}`
      : `Nenhuma limpeza após a última carga (exigido ${regimeExigido})`,
  });
  if (!limpezaOk) {
    return {
      ...base, tier: "BLOQUEIO", regra: "Limpeza incompatível",
      regimeExigido, regimeAplicado,
      mensagem: regimeAplicado
        ? `Limpeza aplicada (Regime ${regimeAplicado}) é insuficiente. A última carga (${prodAnterior?.nomeCanonico}) exige Regime ${regimeExigido} pela IDTF.`
        : `Nenhuma limpeza evidenciada após ${prodAnterior?.nomeCanonico}. A IDTF exige Regime ${regimeExigido} antes de ${atual?.nomeCanonico ?? "feed"}.`,
      acaoSugerida: `Executar limpeza Regime ${regimeExigido} com evidência fotográfica e reenviar.`,
      checagens,
    };
  }

  // ── Regra 4: inspeção pré-carregamento aprovada ──────────────────────────
  const inspecaoOk = inspecao?.resultado === "aprovado";
  checagens.push({
    nome: "Inspeção LCI",
    ok: inspecaoOk,
    detalhe: inspecao ? `${inspecao.resultado} (${inspecao.itensOk}/${inspecao.itensTotal})` : "Sem inspeção registrada",
  });
  if (inspecao && inspecao.resultado === "reprovado") {
    return {
      ...base, tier: "BLOQUEIO", regra: "Checklist reprovado",
      regimeExigido, regimeAplicado,
      mensagem: `Checklist LCI do compartimento reprovado (${inspecao.itensOk}/${inspecao.itensTotal} itens). Carregamento impedido.`,
      acaoSugerida: "Corrigir os itens reprovados e realizar nova inspeção.",
      checagens,
    };
  }

  // ── Regra 5: certificado GMP+ (implemento / subcontratado) ────────────────
  const certImpVencida = imp?.certGMP.status === "Vencida";
  const subVencido = sub ? diasAte(sub.certGMP.validade, refISO) < 0 : false;
  checagens.push({
    nome: "Certificação GMP+",
    ok: !certImpVencida && !subVencido,
    detalhe: certImpVencida
      ? `Cert. do implemento ${imp?.placa} vencida`
      : subVencido
      ? `Cert. do subcontratado ${sub?.razaoSocial} vencida`
      : "Certificados válidos",
  });
  if (certImpVencida || subVencido) {
    return {
      ...base, tier: "BLOQUEIO", regra: "Certificado vencido/incompatível",
      regimeExigido, regimeAplicado,
      mensagem: certImpVencida
        ? `Certificação GMP+ do implemento ${imp?.placa} vencida em ${fmt(imp!.certGMP.validade)}.`
        : `Certificado GMP+ do subcontratado ${sub?.razaoSocial} vencido em ${fmt(sub!.certGMP.validade)} (status base pública: ${sub?.certGMP.statusBasePublica}).`,
      acaoSugerida: "Renovar/validar a certificação GMP+ antes de operar sob cadeia certificada.",
      checagens,
    };
  }

  // ── Alertas (não bloqueiam, exigem justificativa) ─────────────────────────
  const alertas: string[] = [];
  if (sub) {
    const d = diasAte(sub.certGMP.validade, refISO);
    if (d >= 0 && d <= 60) alertas.push(`Certificado do subcontratado vence em ${d} dias.`);
  }
  if (imp) {
    const d = diasAte(imp.certGMP.validade, refISO);
    if (d >= 0 && d <= 60) alertas.push(`Certificação do implemento ${imp.placa} vence em ${d} dias.`);
  }
  if (inspecao?.offline) alertas.push("Inspeção realizada offline — validar carimbo de sincronização.");

  if (alertas.length) {
    return {
      ...base, tier: "ALERTA", regra: "Pendência sem risco direto",
      regimeExigido, regimeAplicado,
      mensagem: alertas.join(" "),
      acaoSugerida: "Liberação exige justificativa registrada do despachante/gestor.",
      checagens,
    };
  }

  // ── Liberado ──────────────────────────────────────────────────────────────
  return {
    ...base, tier: "LIBERADO", regra: "Conforme",
    regimeExigido, regimeAplicado,
    mensagem: `Compartimento apto. Regime ${regimeExigido} aplicado e evidenciado; T-3, certificações e inspeção conformes.`,
    acaoSugerida: "Liberar carregamento.",
    checagens,
  };
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
} {
  const st = statusCompartimento(compartimentoId);

  if (st.status === "bloqueado" || st.status === "requer_limpeza") {
    return { tier: "BLOQUEIO", motivo: st.motivo, regimeExigido: st.regimeExigido };
  }

  // Compartimento ok (apto ou sem histórico) → checar certificação do implemento/subcontratado
  const comp = findCompartimento(compartimentoId);
  const imp = comp ? findImplemento(comp.implementoId) : undefined;
  const sub = findSubcontratado(imp?.subcontratadoId);

  if (imp?.certGMP.status === "Vencida") {
    return { tier: "BLOQUEIO", motivo: `Certificação GMP+ do implemento ${imp.placa} vencida.`, regimeExigido: st.regimeExigido };
  }
  if (sub && nivelVencimento(sub.certGMP.validade, refISO.slice(0, 10)).nivel === "vencido") {
    return { tier: "BLOQUEIO", motivo: `Certificado GMP+ do subcontratado ${sub.razaoSocial} vencido.`, regimeExigido: st.regimeExigido };
  }

  const nivelImp = imp ? nivelVencimento(imp.certGMP.validade, refISO.slice(0, 10)).nivel : "ok";
  const nivelSub = sub ? nivelVencimento(sub.certGMP.validade, refISO.slice(0, 10)).nivel : "ok";
  if ([nivelImp, nivelSub].some((n) => n === "critico" || n === "alto" || n === "alerta")) {
    return { tier: "ALERTA", motivo: "Certificação a vencer em ≤60 dias — liberação exige justificativa.", regimeExigido: st.regimeExigido };
  }

  return {
    tier: "LIBERADO",
    motivo: st.status === "sem_historico" ? "Compartimento novo, sem histórico — apto." : st.motivo,
    regimeExigido: st.regimeExigido,
  };
}

/** Score de conformidade derivado das checagens (0–100). */
export function scoreConformidade(d: Decisao): number {
  if (!d.checagens.length) return 0;
  const ok = d.checagens.filter((c) => c.ok).length;
  return Math.round((ok / d.checagens.length) * 100);
}

function fmt(iso: string): string {
  const [y, m, dd] = iso.slice(0, 10).split("-");
  return `${dd}/${m}/${y}`;
}
