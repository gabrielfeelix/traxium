// TRAXIUM — registro da liberação manual (Fase 7).
//
// A diretriz §Control Tower exige nove campos em toda liberação manual. Quatro
// já existiam soltos na exceção (responsável, data/hora, evidência,
// justificativa); os outros cinco entram aqui, e dois deles — situação anterior
// e posterior — NÃO são digitados: saem do estado da viagem antes e depois da
// decisão. Estado é derivado do fato, também quando o fato é a própria decisão.
//
// O motivo deixa de ser texto livre. Texto livre não sobrevive a auditoria: dez
// despachantes escrevem a mesma coisa de dez formas e nenhuma consulta agrupa.
// Cada regra passa a ter sua lista fechada de motivos aceitáveis, e a
// justificativa continua obrigatória — como COMPLEMENTO do motivo, nunca no
// lugar dele.

import {
  HOJE,
  type Excecao,
  type NivelAutoridade,
} from "./model";
import { REGRA_LABEL, type RegraId } from "./motor-config";
import { triarViagem, type Faixa, type Liberador } from "./control-tower";
import type { Tier } from "./rules-engine";
import { viagens } from "@/lib/mock-data";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Motivo padronizado — lista fechada por regra
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Motivos aceitáveis por regra do motor.
 *
 * Lista VAZIA é uma afirmação, não um esquecimento: nas regras de bloqueio
 * técnico não existe motivo que libere. Enquanto a carga anterior proibida não
 * tiver limpeza D evidenciada, nenhuma redação torna o compartimento apto — e a
 * tela precisa dizer isso em vez de oferecer um campo de texto.
 */
export const MOTIVOS_POR_REGRA: Record<RegraId, string[]> = {
  t3_completo: [],
  carga_anterior: [],
  limpeza_compativel: [],
  certificado_valido: [],
  cadastro_valido: [],
  acordo_vigente: [],
  competencia_motorista: [
    "Conclusão de trilha comprovada fora do sistema, com certificado anexado",
    "Reciclagem agendada com data confirmada e supervisão no carregamento",
    "Operação acompanhada presencialmente por instrutor ou inspetor",
  ],
  produto_reconhecido: [
    "Parecer técnico da Qualidade anexado para esta carga",
    "Produto equivalente a sinônimo já classificado na base",
    "Carga sem destino a feed, com segregação comprovada",
  ],
  checklist_aprovado: [
    "Itens reprovados corrigidos e reinspecionados no local",
    "Reprovação por item não crítico, com correção registrada",
    "Erro de preenchimento do checklist, comprovado por foto",
  ],
  fotos_minimas: [
    "Ângulos refeitos presencialmente pelo inspetor",
    "Foto perdida na sincronização, reenviada com o mesmo carimbo",
    "Compartimento inspecionado presencialmente, com laudo anexado",
  ],
  cert_a_vencer: [
    "Protocolo de renovação em curso junto à certificadora",
    "Certificado renovado, aguardando publicação na base pública",
    "Carregamento e descarga concluídos antes da data de vencimento",
  ],
  sync_pendente: [
    "Evidência sincronizada após a decisão, com carimbo conferido",
    "Área sem cobertura no momento da inspeção",
    "Sincronização manual concluída e conferida pelo tráfego",
  ],
};

/**
 * Motivos de regras que não vêm do motor. `avaliarNovoCarregamento` e a troca
 * de veículo abrem exceção com rótulo próprio; a lista fechada vale para elas
 * do mesmo jeito.
 */
const MOTIVOS_EXTRAS: Record<string, string[]> = {
  "Compartimento não vinculado": [],
  "Mudança de veículo pré-carregamento": [
    "Troca de veículo com nova inspeção aprovada",
    "Avaria no implemento original, substituído por equivalente certificado",
    "Indisponibilidade do implemento na janela de carregamento",
  ],
};

/** Índice rótulo → RegraId, para casar `Decisao.regra`/`Excecao.regra` com a lista. */
const REGRA_POR_LABEL: Record<string, RegraId> = Object.fromEntries(
  (Object.entries(REGRA_LABEL) as [RegraId, string][]).map(([id, label]) => [label, id])
) as Record<string, RegraId>;

/**
 * Motivos padronizados aceitos para uma regra, pelo rótulo que a decisão
 * reporta. Vazio = não há motivo que libere esta regra (bloqueio técnico) ou a
 * regra é nova e ainda não foi mapeada. Nos dois casos a tela recusa a
 * liberação — nunca cai em texto livre.
 */
export function motivosDaRegra(regra: string): string[] {
  const id = REGRA_POR_LABEL[regra];
  if (id) return MOTIVOS_POR_REGRA[id];
  return MOTIVOS_EXTRAS[regra] ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Impacto e validade — os dois campos escolhidos, também em lista fechada
// ─────────────────────────────────────────────────────────────────────────────

export type ImpactoId =
  | "sem_impacto_feed"
  | "risco_residual_monitorado"
  | "impacto_prazo"
  | "impacto_contratual";

export const IMPACTOS: { id: ImpactoId; label: string; desc: string }[] = [
  {
    id: "sem_impacto_feed",
    label: "Sem impacto sobre a segurança do feed",
    desc: "A pendência é documental ou de agenda; a carga não muda de condição.",
  },
  {
    id: "risco_residual_monitorado",
    label: "Risco residual aceito, com monitoramento",
    desc: "Existe risco, é conhecido, e alguém assume acompanhar a carga.",
  },
  {
    id: "impacto_prazo",
    label: "Impacto de prazo ou logística",
    desc: "Afeta janela, rota ou disponibilidade — não a conformidade da carga.",
  },
  {
    id: "impacto_contratual",
    label: "Impacto contratual com o cliente",
    desc: "Muda o combinado com o embarcador; exige ciência formal.",
  },
];

export const IMPACTO_LABEL: Record<ImpactoId, string> = IMPACTOS.reduce(
  (acc, i) => ({ ...acc, [i.id]: i.label }),
  {} as Record<ImpactoId, string>
);

export type ValidadeId = "esta_viagem" | "72h" | "7d" | "ate_regularizacao";

export const VALIDADES: { id: ValidadeId; label: string; desc: string; horas?: number }[] = [
  {
    id: "esta_viagem",
    label: "Somente esta viagem",
    desc: "A decisão morre com a carga. A próxima viagem volta a ser avaliada do zero.",
  },
  { id: "72h", label: "72 horas", desc: "Vale para novas avaliações até o prazo expirar.", horas: 72 },
  { id: "7d", label: "7 dias", desc: "Janela mais larga; exige acompanhamento no período.", horas: 168 },
  {
    id: "ate_regularizacao",
    label: "Até a regularização do fato",
    desc: "Expira sozinha quando o fato que motivou o bloqueio for corrigido.",
  },
];

export const VALIDADE_LABEL: Record<ValidadeId, string> = VALIDADES.reduce(
  (acc, v) => ({ ...acc, [v.id]: v.label }),
  {} as Record<ValidadeId, string>
);

/** Quando a decisão expira. `null` = não expira por relógio (viagem/regularização). */
export function expiraEm(validade: ValidadeId, dataHoraISO: string): string | null {
  const cfg = VALIDADES.find((v) => v.id === validade);
  if (!cfg?.horas) return null;
  return new Date(new Date(dataHoraISO).getTime() + cfg.horas * 3_600_000).toISOString().slice(0, 16);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Situação anterior e posterior — capturadas, não digitadas
// ─────────────────────────────────────────────────────────────────────────────

export type SituacaoViagem = {
  faixa: Faixa;
  tier: Tier;
  regra: string;
  statusViagem: string;
  liberadaPor: Liberador;
  checagensOk: number;
  checagensTotal: number;
  /** Uma linha legível — é o que aparece no registro e no dossiê. */
  resumo: string;
};

const FAIXA_LABEL: Record<Faixa, string> = {
  verde: "Verde",
  amarelo: "Amarelo",
  vermelho: "Vermelho",
};

const LIBERADOR_LABEL: Record<"motor" | "autoridade" | "pendente", string> = {
  motor: "liberada pelo motor",
  autoridade: "liberada por autoridade",
  pendente: "aguardando decisão",
};

/**
 * Fotografa o estado da viagem AGORA, derivando tudo da triagem. Chamada antes
 * e depois da decisão, dá os campos "situação anterior" e "situação posterior"
 * sem pedir nada a ninguém — e sem chance de o operador descrever errado o que
 * o sistema sabe.
 */
export function situacaoDaViagem(viagemId: string): SituacaoViagem {
  const v = viagens.find((x) => x.id === viagemId);
  if (!v) {
    return {
      faixa: "vermelho",
      tier: "BLOQUEIO",
      regra: "Viagem não encontrada",
      statusViagem: "—",
      liberadaPor: null,
      checagensOk: 0,
      checagensTotal: 0,
      resumo: "Viagem não encontrada no store.",
    };
  }
  const t = triarViagem(v);
  const ok = t.decisao.checagens.filter((c) => c.ok).length;
  const total = t.decisao.checagens.length;
  return {
    faixa: t.faixa,
    tier: t.decisao.tier,
    regra: t.decisao.regra,
    statusViagem: v.status,
    liberadaPor: t.liberadaPor,
    checagensOk: ok,
    checagensTotal: total,
    resumo: `${FAIXA_LABEL[t.faixa]} · ${v.status} · ${LIBERADOR_LABEL[t.liberadaPor ?? "pendente"]} · ${ok}/${total} checagens conformes · regra: ${t.decisao.regra}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. O registro — os nove campos da diretriz
// ─────────────────────────────────────────────────────────────────────────────

export type RegistroLiberacao = {
  id: string;
  excecaoId: string;
  viagemId: string;
  codigoViagem: string;
  /** Regra do motor que a liberação atravessa. */
  regra: string;
  nivelRequerido: NivelAutoridade;
  // ── os nove campos ──
  /** 1 · escolhido da lista fechada da regra. */
  motivoPadronizado: string;
  /** 2 · complemento obrigatório, nunca substituto do motivo. */
  justificativa: string;
  /** 3 · evidências referenciadas na decisão. */
  evidencias: string[];
  /** 4 · quem decidiu, com o papel exercido. */
  responsavel: string;
  /** 5 · quando. */
  dataHora: string;
  /** 6 · estado da viagem imediatamente antes — derivado. */
  situacaoAnterior: SituacaoViagem;
  /** 7 · estado imediatamente depois — derivado. */
  situacaoPosterior: SituacaoViagem;
  /** 8 · o que a decisão custa. */
  impacto: ImpactoId;
  /** 9 · até quando a decisão vale. */
  validade: ValidadeId;
  /** Derivado de `validade` + `dataHora`; null quando não expira por relógio. */
  expiraEm: string | null;
};

/** Store append-only do protótipo. Registro de liberação não se edita nem some. */
export const registrosLiberacao: RegistroLiberacao[] = [];

export type NovoRegistroInput = {
  excecao: Excecao;
  motivoPadronizado: string;
  justificativa: string;
  evidencias: string[];
  responsavel: string;
  impacto: ImpactoId;
  validade: ValidadeId;
  situacaoAnterior: SituacaoViagem;
  situacaoPosterior: SituacaoViagem;
  dataHora?: string;
};

/**
 * Grava a liberação. Recusa (`null`) o que não sobrevive a auditoria: motivo
 * fora da lista fechada da regra, justificativa vazia ou nenhuma evidência.
 * A recusa é do domínio, não da tela — o gate não pode depender de qual botão
 * chamou.
 */
export function registrarLiberacao(i: NovoRegistroInput): RegistroLiberacao | null {
  const aceitos = motivosDaRegra(i.excecao.regra);
  if (!aceitos.includes(i.motivoPadronizado)) return null;
  if (!i.justificativa.trim()) return null;
  if (!i.evidencias.length) return null;

  const dataHora = i.dataHora ?? `${HOJE}T10:00:00`;
  const registro: RegistroLiberacao = {
    id: `lib-${String(registrosLiberacao.length + 1).padStart(3, "0")}`,
    excecaoId: i.excecao.id,
    viagemId: i.excecao.viagemId,
    codigoViagem: i.excecao.codigoViagem,
    regra: i.excecao.regra,
    nivelRequerido: i.excecao.nivelRequerido,
    motivoPadronizado: i.motivoPadronizado,
    justificativa: i.justificativa.trim(),
    evidencias: i.evidencias,
    responsavel: i.responsavel,
    dataHora,
    situacaoAnterior: i.situacaoAnterior,
    situacaoPosterior: i.situacaoPosterior,
    impacto: i.impacto,
    validade: i.validade,
    expiraEm: expiraEm(i.validade, dataHora),
  };
  registrosLiberacao.unshift(registro);
  return registro;
}

export function registroDaExcecao(excecaoId: string): RegistroLiberacao | undefined {
  return registrosLiberacao.find((r) => r.excecaoId === excecaoId);
}

/** Registros de uma viagem, mais recentes primeiro. */
export function registrosDaViagem(viagemId: string): RegistroLiberacao[] {
  return registrosLiberacao.filter((r) => r.viagemId === viagemId);
}
