// TRAXIUM Academy — competência como requisito de ELEGIBILIDADE, não como
// certificado arquivado (diretriz §Pilar 2).
//
// O princípio central do pilar: motorista sem competência comprovada não é
// selecionável para a operação. Por isso `competenciaMotorista()` devolve um
// `elegivel` booleano — é o que o motor de regras e o select do despacho leem.
//
// A competência é DERIVADA, nunca campo editável: sai das conclusões
// registradas contra as trilhas exigidas pelo contexto da operação, do mesmo
// jeito que `estadoQualificacao()` deriva o estado da empresa.

import { HOJE, diasEntre, type Regime } from "./model";

export type Trilha = {
  id: string;
  codigo: string;
  titulo: string;
  duracaoMin: number;
  /** Versão do conteúdo assistido — a evidência vale para a versão em que foi feita. */
  versaoConteudo: string;
  validadeMeses: number;
  notaMinima: number;
  tentativasMax: number;
  gatilho: Gatilho;
};

/**
 * Quando a trilha é exigida. `sempre` é a base obrigatória de todo motorista;
 * as demais são acionadas pelo risco da operação (treino just-in-time).
 */
export type Gatilho =
  | { tipo: "sempre" }
  | { tipo: "regime"; regime: Regime }
  | { tipo: "gatekeeper" }
  | { tipo: "reincidencia_foto" };

/** As 10 trilhas recomendadas pela diretriz, na ordem em que ela lista. */
export const TRILHAS: Trilha[] = [
  { id: "t01", codigo: "T01", titulo: "Introdução ao GMP+ FSA para motoristas", duracaoMin: 12, versaoConteudo: "v2 · 2026.03", validadeMeses: 12, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t02", codigo: "T02", titulo: "Responsabilidades do motorista no transporte de feed", duracaoMin: 10, versaoConteudo: "v1 · 2026.01", validadeMeses: 12, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t03", codigo: "T03", titulo: "Últimas três cargas e histórico T-3", duracaoMin: 8, versaoConteudo: "v2 · 2026.05", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t04", codigo: "T04", titulo: "Cargas proibidas e cargas incompatíveis", duracaoMin: 14, versaoConteudo: "v2 · 2026.05", validadeMeses: 12, notaMinima: 80, tentativasMax: 2, gatilho: { tipo: "regime", regime: "D" } },
  { id: "t05", codigo: "T05", titulo: "Regimes de limpeza A, B, C e D", duracaoMin: 16, versaoConteudo: "v1 · 2026.02", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t06", codigo: "T06", titulo: "Inspeção higiênica e estrutural do implemento", duracaoMin: 15, versaoConteudo: "v1 · 2026.02", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t07", codigo: "T07", titulo: "Uso do checklist TRAXIUM", duracaoMin: 7, versaoConteudo: "v3 · 2026.06", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t08", codigo: "T08", titulo: "Comunicação de desvios e suspeita de contaminação", duracaoMin: 9, versaoConteudo: "v1 · 2026.01", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t09", codigo: "T09", titulo: "Proteção da carga no transporte, carregamento e descarga", duracaoMin: 11, versaoConteudo: "v1 · 2026.03", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "reincidencia_foto" } },
  { id: "t10", codigo: "T10", titulo: "Boas práticas para subcontratados em condição Gatekeeper", duracaoMin: 13, versaoConteudo: "v1 · 2026.04", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "gatekeeper" } },
];

export function findTrilha(id: string): Trilha | undefined {
  return TRILHAS.find((t) => t.id === id);
}

/**
 * Registro de conclusão — é a evidência que a auditoria pede: nota, tentativas,
 * aceite de ciência e a versão do conteúdo efetivamente assistido.
 */
export type Conclusao = {
  motoristaId: string;
  trilhaId: string;
  concluidoEm: string;
  nota: number;
  tentativas: number;
  aceiteCiencia: boolean;
  versaoConteudo: string;
  certificadoId: string;
};

// Fixtures coerentes com o estado que o resto do mock já declara:
// m-001 Edivaldo em dia · m-002 Mauricio com treinamento pendente (aqui, T01
// vencida) · m-003 Carlos prestes a vencer.
export const conclusoes: Conclusao[] = [
  // m-001 Edivaldo Souza — base completa e vigente
  { motoristaId: "m-001", trilhaId: "t01", concluidoEm: "2026-02-10", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0001" },
  { motoristaId: "m-001", trilhaId: "t02", concluidoEm: "2026-02-10", nota: 85, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0002" },
  { motoristaId: "m-001", trilhaId: "t03", concluidoEm: "2026-02-11", nota: 95, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0003" },
  { motoristaId: "m-001", trilhaId: "t05", concluidoEm: "2026-02-11", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0004" },
  { motoristaId: "m-001", trilhaId: "t06", concluidoEm: "2026-02-12", nota: 78, tentativas: 2, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0005" },
  { motoristaId: "m-001", trilhaId: "t07", concluidoEm: "2026-02-12", nota: 92, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0006" },
  { motoristaId: "m-001", trilhaId: "t08", concluidoEm: "2026-02-13", nota: 83, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0007" },

  // m-002 Mauricio Lima — base completa, mas T01 concluída há mais de 12 meses
  { motoristaId: "m-002", trilhaId: "t01", concluidoEm: "2025-01-15", nota: 72, tentativas: 2, aceiteCiencia: true, versaoConteudo: "v1 · 2025.01", certificadoId: "CERT-0100" },
  { motoristaId: "m-002", trilhaId: "t02", concluidoEm: "2026-03-02", nota: 80, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0101" },
  { motoristaId: "m-002", trilhaId: "t03", concluidoEm: "2026-03-02", nota: 82, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0102" },
  { motoristaId: "m-002", trilhaId: "t05", concluidoEm: "2026-03-03", nota: 81, tentativas: 2, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0103" },
  { motoristaId: "m-002", trilhaId: "t06", concluidoEm: "2026-03-03", nota: 74, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0104" },
  { motoristaId: "m-002", trilhaId: "t07", concluidoEm: "2026-03-04", nota: 79, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0105" },
  { motoristaId: "m-002", trilhaId: "t08", concluidoEm: "2026-03-04", nota: 85, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0106" },

  // m-003 Carlos Aparecido — base completa, T01 vence em menos de 30 dias
  { motoristaId: "m-003", trilhaId: "t01", concluidoEm: "2025-07-25", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0200" },
  { motoristaId: "m-003", trilhaId: "t02", concluidoEm: "2026-01-20", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0201" },
  { motoristaId: "m-003", trilhaId: "t03", concluidoEm: "2026-01-20", nota: 84, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0202" },
  { motoristaId: "m-003", trilhaId: "t05", concluidoEm: "2026-01-21", nota: 86, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0203" },
  { motoristaId: "m-003", trilhaId: "t06", concluidoEm: "2026-01-21", nota: 75, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0204" },
  { motoristaId: "m-003", trilhaId: "t07", concluidoEm: "2026-01-22", nota: 91, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0205" },
  { motoristaId: "m-003", trilhaId: "t08", concluidoEm: "2026-01-22", nota: 82, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0206" },

  // m-004 José Roberto Santos — base completa e vigente
  { motoristaId: "m-004", trilhaId: "t01", concluidoEm: "2026-04-05", nota: 87, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0300" },
  { motoristaId: "m-004", trilhaId: "t02", concluidoEm: "2026-04-05", nota: 84, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0301" },
  { motoristaId: "m-004", trilhaId: "t03", concluidoEm: "2026-04-06", nota: 89, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0302" },
  { motoristaId: "m-004", trilhaId: "t05", concluidoEm: "2026-04-06", nota: 92, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0303" },
  { motoristaId: "m-004", trilhaId: "t06", concluidoEm: "2026-04-07", nota: 80, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0304" },
  { motoristaId: "m-004", trilhaId: "t07", concluidoEm: "2026-04-07", nota: 94, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0305" },
  { motoristaId: "m-004", trilhaId: "t08", concluidoEm: "2026-04-08", nota: 86, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0306" },
  { motoristaId: "m-004", trilhaId: "t04", concluidoEm: "2026-04-08", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0307" },

  // m-006 Antonio Marcos — base completa e vigente
  { motoristaId: "m-006", trilhaId: "t01", concluidoEm: "2026-05-12", nota: 83, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0400" },
  { motoristaId: "m-006", trilhaId: "t02", concluidoEm: "2026-05-12", nota: 81, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0401" },
  { motoristaId: "m-006", trilhaId: "t03", concluidoEm: "2026-05-13", nota: 85, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0402" },
  { motoristaId: "m-006", trilhaId: "t05", concluidoEm: "2026-05-13", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0403" },
  { motoristaId: "m-006", trilhaId: "t06", concluidoEm: "2026-05-14", nota: 77, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0404" },
  { motoristaId: "m-006", trilhaId: "t07", concluidoEm: "2026-05-14", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0405" },
  { motoristaId: "m-006", trilhaId: "t08", concluidoEm: "2026-05-15", nota: 84, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0406" },

  // m-005 Pedro Henrique — base INCOMPLETA de propósito: nunca fez T08.
  // É o caso "nunca_fez" com dado real, não hipotético.
  { motoristaId: "m-005", trilhaId: "t01", concluidoEm: "2026-06-01", nota: 86, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0500" },
  { motoristaId: "m-005", trilhaId: "t02", concluidoEm: "2026-06-01", nota: 82, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0501" },
  { motoristaId: "m-005", trilhaId: "t03", concluidoEm: "2026-06-02", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0502" },
  { motoristaId: "m-005", trilhaId: "t05", concluidoEm: "2026-06-02", nota: 91, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0503" },
  { motoristaId: "m-005", trilhaId: "t06", concluidoEm: "2026-06-03", nota: 79, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0504" },
  { motoristaId: "m-005", trilhaId: "t07", concluidoEm: "2026-06-03", nota: 87, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0505" },
];

export type ContextoOperacao = {
  regime?: Regime;
  gatekeeper?: boolean;
  reincidenciaFoto?: boolean;
};

/** Trilhas exigidas para operar neste contexto: base obrigatória + gatilhos. */
export function trilhasExigidas(ctx: ContextoOperacao = {}): Trilha[] {
  return TRILHAS.filter((t) => {
    switch (t.gatilho.tipo) {
      case "sempre":
        return true;
      case "regime":
        return ctx.regime === t.gatilho.regime;
      case "gatekeeper":
        return ctx.gatekeeper === true;
      case "reincidencia_foto":
        return ctx.reincidenciaFoto === true;
    }
  });
}

export type SituacaoCompetencia = "apto" | "a_vencer" | "vencida" | "nunca_fez";

export const SITUACAO_COMPETENCIA: Record<
  SituacaoCompetencia,
  { rotulo: string; tone: "success" | "warning" | "danger" }
> = {
  apto: { rotulo: "Competência vigente", tone: "success" },
  a_vencer: { rotulo: "Reciclagem próxima", tone: "warning" },
  vencida: { rotulo: "Competência vencida", tone: "danger" },
  nunca_fez: { rotulo: "Trilha obrigatória pendente", tone: "danger" },
};

export type Competencia = {
  situacao: SituacaoCompetencia;
  /** O que o motor de regras e o select do despacho consomem. */
  elegivel: boolean;
  motivo: string;
  /** Trilhas que faltam concluir ou reciclar para destravar. */
  trilhasPendentes: Trilha[];
  proximoVencimento?: string;
};

/** Data em que a conclusão perde validade. */
export function venceEm(c: Conclusao, t: Trilha): string {
  const d = new Date(c.concluidoEm);
  d.setMonth(d.getMonth() + t.validadeMeses);
  return d.toISOString().slice(0, 10);
}

/**
 * Competência do motorista no contexto de uma operação.
 *
 * Ordem das checagens segue a severidade: nunca concluída trava antes de
 * vencida, porque são ações diferentes — uma é fazer, a outra é reciclar.
 */
export function competenciaMotorista(
  motoristaId: string,
  hoje = HOJE,
  ctx: ContextoOperacao = {}
): Competencia {
  const exigidas = trilhasExigidas(ctx);
  const minhas = conclusoes.filter((c) => c.motoristaId === motoristaId);

  const nunca = exigidas.filter((t) => !minhas.some((c) => c.trilhaId === t.id));
  if (nunca.length) {
    return {
      situacao: "nunca_fez",
      elegivel: false,
      motivo: `${nunca.length} trilha(s) obrigatória(s) nunca concluída(s): ${nunca.map((t) => t.codigo).join(", ")}.`,
      trilhasPendentes: nunca,
    };
  }

  const comValidade = exigidas.map((t) => {
    const c = minhas.find((x) => x.trilhaId === t.id)!;
    const validade = venceEm(c, t);
    return { t, validade, dias: diasEntre(hoje, validade) };
  });

  const vencidas = comValidade.filter((x) => x.dias < 0).sort((a, b) => a.dias - b.dias);
  if (vencidas.length) {
    const pior = vencidas[0];
    return {
      situacao: "vencida",
      elegivel: false,
      motivo: `${pior.t.codigo} vencida há ${Math.abs(pior.dias)} dias.`,
      trilhasPendentes: vencidas.map((x) => x.t),
      proximoVencimento: pior.validade,
    };
  }

  const proxima = [...comValidade].sort((a, b) => a.dias - b.dias)[0];
  if (proxima.dias <= 30) {
    return {
      situacao: "a_vencer",
      elegivel: true,
      motivo: `${proxima.t.codigo} vence em ${proxima.dias} dias.`,
      trilhasPendentes: [],
      proximoVencimento: proxima.validade,
    };
  }

  return {
    situacao: "apto",
    elegivel: true,
    motivo: `${exigidas.length} trilhas obrigatórias vigentes.`,
    trilhasPendentes: [],
    proximoVencimento: proxima.validade,
  };
}

/**
 * Orientação de conteúdo para o regime desta operação — o "carga que exige
 * limpeza C aciona uma orientação específica" da diretriz. Diferente de
 * `trilhasJustInTime`: aqui a trilha pode já estar vigente; é revisão no
 * momento de executar, não requisito pendente.
 */
export function orientacaoDoRegime(regime?: Regime): Trilha | undefined {
  if (!regime) return undefined;
  // Regime D é o caso de carga proibida/incompatível; os demais são procedimento
  // de limpeza propriamente dito.
  return regime === "D" ? findTrilha("t04") : findTrilha("t05");
}

export type EstadoTrilha = "vigente" | "a_vencer" | "vencida" | "nunca";

/** Estado de UMA trilha para um motorista — alimenta o anel segmentado do crachá. */
export function estadoTrilha(motoristaId: string, trilha: Trilha, hoje = HOJE): EstadoTrilha {
  const c = conclusoes.find((x) => x.motoristaId === motoristaId && x.trilhaId === trilha.id);
  if (!c) return "nunca";
  const dias = diasEntre(hoje, venceEm(c, trilha));
  if (dias < 0) return "vencida";
  if (dias <= 30) return "a_vencer";
  return "vigente";
}

/**
 * Treino just-in-time: a trilha que o RISCO desta operação aciona e que o
 * motorista ainda não tem. A base obrigatória fica de fora — ela não é
 * "just-in-time", é pré-requisito.
 */
export function trilhasJustInTime(motoristaId: string, ctx: ContextoOperacao): Trilha[] {
  const base = new Set(trilhasExigidas({}).map((t) => t.id));
  const especificas = trilhasExigidas(ctx).filter((t) => !base.has(t.id));
  const minhas = conclusoes.filter((c) => c.motoristaId === motoristaId);
  return especificas.filter((t) => !minhas.some((c) => c.trilhaId === t.id));
}
