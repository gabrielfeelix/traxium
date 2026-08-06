// TRAXIUM — configuração do motor de regras (Fase 5).
//
// A diretriz §4 pede que cada regra seja classificada em quatro níveis, e que a
// classificação seja configurável. Mas configurável não é o mesmo que
// negociável: rebaixar "carga anterior proibida" para "informação
// complementar" tornaria a trava do bloqueio técnico contornável pela tela de
// Configurações — exatamente o "aprovar mesmo assim" que a Fase 3 removeu,
// entrando pela porta dos fundos.
//
// Por isso cada regra tem um PISO. Dá para endurecer, nunca para afrouxar
// abaixo do piso.

export type ClasseRegra = "bloqueio" | "alerta" | "registro" | "informacao";

export const CLASSE_LABEL: Record<ClasseRegra, string> = {
  bloqueio: "Bloqueio automático",
  alerta: "Alerta com justificativa",
  registro: "Registro obrigatório",
  informacao: "Informação complementar",
};

export const CLASSE_DESC: Record<ClasseRegra, string> = {
  bloqueio: "Impede o carregamento. Não há liberação sem regularizar o fato.",
  alerta: "Opera, mas alguém com autoridade assina o risco residual.",
  registro: "Opera; a evidência precisa ser anexada antes de concluir.",
  informacao: "Aparece no dossiê, não interfere na decisão.",
};

/** Severidade para comparação. Maior número = mais severo. */
export const ORDEM_CLASSE: Record<ClasseRegra, number> = {
  informacao: 0,
  registro: 1,
  alerta: 2,
  bloqueio: 3,
};

export type RegraId =
  // Ordem de precedência quando várias falham na mesma classe. As cinco
  // primeiras vêm do motor original e mantêm a precedência histórica — mudar
  // isso trocaria a `regra` reportada em decisões que outras telas já leem.
  | "t3_completo"
  | "carga_anterior"
  | "limpeza_compativel"
  | "checklist_aprovado"
  | "certificado_valido"
  // Condições acrescentadas na Fase 5 para fechar as oito do verde (§Pilar 4).
  | "cadastro_valido"
  | "acordo_vigente"
  | "competencia_motorista"
  | "produto_reconhecido"
  | "fotos_minimas"
  | "cert_a_vencer"
  | "sync_pendente";

/**
 * Rótulo humano de cada regra. É o que vai em `Decisao.regra`, o que roteia a
 * autoridade em `control-tower.ts` e o que aparece na exceção — por isso os
 * cinco primeiros repetem exatamente as strings que já existiam.
 */
export const REGRA_LABEL: Record<RegraId, string> = {
  t3_completo: "T-3 ausente/incompleto",
  carga_anterior: "Carga anterior proibida",
  limpeza_compativel: "Limpeza incompatível",
  checklist_aprovado: "Checklist reprovado",
  certificado_valido: "Certificado vencido/incompatível",
  cadastro_valido: "Subcontratado não apto",
  acordo_vigente: "Acordo de qualidade não vigente",
  competencia_motorista: "Competência do motorista",
  produto_reconhecido: "Produto não reconhecido",
  fotos_minimas: "Fotos mínimas ausentes",
  cert_a_vencer: "Pendência sem risco direto",
  sync_pendente: "Inspeção pendente de sincronização",
};

/** Nome curto da checagem, como aparece no dossiê. */
export const REGRA_CHECAGEM: Record<RegraId, string> = {
  t3_completo: "Histórico T-3",
  carga_anterior: "Carga anterior",
  limpeza_compativel: "Limpeza vs. IDTF",
  checklist_aprovado: "Inspeção LCI",
  certificado_valido: "Certificação GMP+",
  cadastro_valido: "Cadastro do subcontratado",
  acordo_vigente: "Acordo de qualidade",
  competencia_motorista: "Competência do motorista",
  produto_reconhecido: "Produto na base IDTF",
  fotos_minimas: "Fotos mínimas",
  cert_a_vencer: "Vencimento próximo",
  sync_pendente: "Sincronização da evidência",
};

export const ORDEM_REGRAS: RegraId[] = [
  "t3_completo",
  "carga_anterior",
  "limpeza_compativel",
  "checklist_aprovado",
  "certificado_valido",
  "cadastro_valido",
  "acordo_vigente",
  "competencia_motorista",
  "produto_reconhecido",
  "fotos_minimas",
  "cert_a_vencer",
  "sync_pendente",
];

/**
 * Piso de severidade por regra: a classe menos severa que o admin pode
 * escolher. As sete travadas em `bloqueio` são os fatos que a diretriz lista
 * como bloqueio técnico — nenhuma assinatura os desfaz, então nenhuma
 * configuração deveria conseguir rebaixá-los.
 */
export const CLASSE_MINIMA: Record<RegraId, ClasseRegra> = {
  t3_completo: "bloqueio",
  carga_anterior: "bloqueio",
  limpeza_compativel: "bloqueio",
  certificado_valido: "bloqueio",
  cadastro_valido: "bloqueio",
  acordo_vigente: "bloqueio",
  competencia_motorista: "bloqueio",
  // Corrigíveis: a matriz de autoridade prevê liberação pelo gestor mediante
  // evidência da correção, então podem ser afrouxadas.
  checklist_aprovado: "alerta",
  produto_reconhecido: "alerta",
  fotos_minimas: "informacao",
  cert_a_vencer: "informacao",
  sync_pendente: "informacao",
};

/** Motivo da trava, exibido na tela de configuração. */
export const MOTIVO_PISO: Partial<Record<RegraId, string>> = {
  t3_completo: "Sem as três últimas cargas não há como avaliar contaminação cruzada.",
  carga_anterior: "Rebaixar permitiria carregar feed sobre resíduo de carga proibida.",
  limpeza_compativel: "A limpeza exigida ou aconteceu e foi evidenciada, ou não aconteceu.",
  certificado_valido: "Operar sob cadeia certificada com certificado vencido invalida a cadeia inteira.",
  cadastro_valido: "Subcontratado suspenso ou bloqueado não opera sob a cadeia, por definição.",
  acordo_vigente: "Sem acordo vigente não há compromisso formal de Feed Safety.",
  competencia_motorista: "Competência é requisito de elegibilidade, não recomendação.",
};

export const CONFIG_PADRAO: Record<RegraId, ClasseRegra> = {
  t3_completo: "bloqueio",
  carga_anterior: "bloqueio",
  limpeza_compativel: "bloqueio",
  checklist_aprovado: "bloqueio",
  certificado_valido: "bloqueio",
  cadastro_valido: "bloqueio",
  acordo_vigente: "bloqueio",
  competencia_motorista: "bloqueio",
  produto_reconhecido: "alerta",
  fotos_minimas: "registro",
  cert_a_vencer: "alerta",
  sync_pendente: "alerta",
};

/**
 * Configuração ativa. Mutável in-place como o resto do store do protótipo;
 * `setClasseRegra` é o único caminho de escrita, e ele respeita o piso.
 */
export const configMotor: Record<RegraId, ClasseRegra> = { ...CONFIG_PADRAO };

export function podeRebaixar(regra: RegraId, para: ClasseRegra): boolean {
  return ORDEM_CLASSE[para] >= ORDEM_CLASSE[CLASSE_MINIMA[regra]];
}

/** Retorna false quando a classe pedida fica abaixo do piso da regra. */
export function setClasseRegra(regra: RegraId, classe: ClasseRegra): boolean {
  if (!podeRebaixar(regra, classe)) return false;
  configMotor[regra] = classe;
  return true;
}

export function classeDe(regra: RegraId): ClasseRegra {
  return configMotor[regra];
}

/** Regra travada no piso máximo — a tela mostra sem seletor. */
export function regraTravada(regra: RegraId): boolean {
  return CLASSE_MINIMA[regra] === "bloqueio";
}
