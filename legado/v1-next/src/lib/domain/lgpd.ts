// TRAXIUM — LGPD operacional (Fase 10.2).
//
// A parte fácil da LGPD já estava feita: acesso por papel, log de atividade e
// CPF mascarado. Falta a parte que dá trabalho e é a que a auditoria cobra —
// por quanto tempo cada evidência fica, o que acontece com quem sai da
// operação, e sob qual base legal cada dado é tratado.
//
// Dois princípios que este módulo aplica:
//   1. Prazo de retenção é DERIVADO da data do fato, não um campo "expirado".
//      O que já venceu se calcula contra HOJE, e a tela mostra a conta.
//   2. Consentimento não é a base legal de tudo. Evidência de segurança de feed
//      é obrigação regulatória: apagá-la a pedido do titular quebraria a cadeia
//      GMP+. Dizer isso explicitamente é mais honesto do que oferecer um botão
//      de exclusão que ninguém pode apertar.

import { HOJE, diasEntre } from "./model";

export type BaseLegal =
  | "Obrigação legal ou regulatória"
  | "Execução de contrato"
  | "Legítimo interesse"
  | "Consentimento";

export type TipoDado =
  | "Evidência de carregamento (fotos, checklist, limpeza)"
  | "Documento de identificação do motorista (CNH, CPF)"
  | "Dados de contato (telefone, e-mail)"
  | "Geolocalização de evidência"
  | "Registro de treinamento e avaliação"
  | "Trilha de auditoria e log de acesso"
  | "Documento fiscal da viagem";

export type PoliticaRetencao = {
  tipo: TipoDado;
  /** Meses a contar do fato que originou o dado. */
  meses: number;
  baseLegal: BaseLegal;
  fundamento: string;
  /** O que acontece quando o prazo vence. */
  aoVencer: "Descarte" | "Anonimização" | "Arquivo morto";
};

/**
 * A tabela de retenção. Os prazos longos não são exagero: certificação GMP+ é
 * auditada por ciclo, e evidência de carga apagada antes do ciclo fechar
 * inviabiliza a auditoria — que é justamente a obrigação legal que autoriza
 * guardar.
 */
export const POLITICA_RETENCAO: PoliticaRetencao[] = [
  {
    tipo: "Evidência de carregamento (fotos, checklist, limpeza)",
    meses: 60,
    baseLegal: "Obrigação legal ou regulatória",
    fundamento: "GMP+ FSA exige rastreabilidade da cadeia por ciclo de certificação e auditorias subsequentes.",
    aoVencer: "Arquivo morto",
  },
  {
    tipo: "Documento de identificação do motorista (CNH, CPF)",
    meses: 24,
    baseLegal: "Execução de contrato",
    fundamento: "Necessário para vincular a pessoa que conduziu à operação enquanto o vínculo existir e no período de contestação.",
    aoVencer: "Anonimização",
  },
  {
    tipo: "Dados de contato (telefone, e-mail)",
    meses: 12,
    baseLegal: "Legítimo interesse",
    fundamento: "Comunicação operacional com o transportador. Cessa quando o vínculo cessa.",
    aoVencer: "Descarte",
  },
  {
    tipo: "Geolocalização de evidência",
    meses: 60,
    baseLegal: "Obrigação legal ou regulatória",
    fundamento: "A geo é parte da evidência: sem ela a foto não comprova onde a inspeção aconteceu.",
    aoVencer: "Arquivo morto",
  },
  {
    tipo: "Registro de treinamento e avaliação",
    meses: 36,
    baseLegal: "Obrigação legal ou regulatória",
    fundamento: "Comprovação de competência do motorista perante o organismo certificador.",
    aoVencer: "Anonimização",
  },
  {
    tipo: "Trilha de auditoria e log de acesso",
    meses: 24,
    baseLegal: "Obrigação legal ou regulatória",
    fundamento: "Quem fez o quê e quando — a trilha é o que sustenta as demais evidências.",
    aoVencer: "Arquivo morto",
  },
  {
    tipo: "Documento fiscal da viagem",
    meses: 60,
    baseLegal: "Obrigação legal ou regulatória",
    fundamento: "Prazo decadencial fiscal.",
    aoVencer: "Arquivo morto",
  },
];

/** Data em que o dado originado nesta data atinge o fim da retenção. */
export function vencimentoRetencao(dataDoFato: string, meses: number): string {
  const d = new Date(`${dataDoFato.slice(0, 10)}T00:00:00`);
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

/** Quanto falta (ou passou) para o fim da retenção, contra o HOJE do protótipo. */
export function diasParaExpurgo(dataDoFato: string, meses: number, hoje = HOJE): number {
  return diasEntre(hoje, vencimentoRetencao(dataDoFato, meses));
}

// ── Política de inativação ───────────────────────────────────────────────────

export type RegraInativacao = {
  gatilho: string;
  prazo: string;
  efeito: string;
  /** O que NÃO é apagado, e por quê. */
  preservado: string;
};

export const POLITICA_INATIVACAO: RegraInativacao[] = [
  {
    gatilho: "Fim do vínculo com o transportador",
    prazo: "Imediato",
    efeito: "Vínculos vigentes são encerrados com data e motivo; a empresa sai das listas ativas e do despacho.",
    preservado: "Viagens, dossiês e vínculos encerrados. Apagar reescreveria o passado de cargas já transportadas.",
  },
  {
    gatilho: "Motorista sem operação registrada",
    prazo: "12 meses",
    efeito: "Cadastro marcado como inativo; deixa de aparecer na seleção de despacho.",
    preservado: "Conclusões de trilha e assinaturas em checklists antigos, sob obrigação regulatória.",
  },
  {
    gatilho: "Empresa arquivada",
    prazo: "60 meses após o arquivamento",
    efeito: "Dados de contato descartados; identificação reduzida ao CNPJ e à razão social.",
    preservado: "Trilha de auditoria e evidência das cargas, até o fim da retenção regulatória.",
  },
  {
    gatilho: "Pedido de exclusão do titular",
    prazo: "15 dias para resposta",
    efeito: "Contato e dados não obrigatórios são descartados; o pedido e a resposta ficam registrados.",
    preservado:
      "Evidência de segurança de feed sob obrigação regulatória. O titular recebe a negativa fundamentada — a LGPD prevê a hipótese, e prometer o contrário seria enganoso.",
  },
];

// ── Consentimentos e bases legais ────────────────────────────────────────────

export type Consentimento = {
  id: string;
  titular: string;
  /** `motorista.id` quando é pessoa do cadastro. */
  titularId?: string;
  finalidade: string;
  baseLegal: BaseLegal;
  coletadoEm: string;
  canal: "App do motorista" | "Onboarding público" | "Termo assinado";
  revogadoEm?: string;
};

/**
 * Os consentimentos que o protótipo tem de fato: os aceites que os fluxos de
 * campo e de onboarding já coletam. Não há lista fabricada — o que aparece aqui
 * foi coletado por uma tela que existe.
 */
export const consentimentos: Consentimento[] = [
  {
    id: "cons-001",
    titular: "Edivaldo Souza",
    titularId: "m-001",
    finalidade: "Uso de fotos com geolocalização como evidência de inspeção",
    baseLegal: "Obrigação legal ou regulatória",
    coletadoEm: "2026-02-10",
    canal: "App do motorista",
  },
  {
    id: "cons-002",
    titular: "Edivaldo Souza",
    titularId: "m-001",
    finalidade: "Comunicação operacional por WhatsApp",
    baseLegal: "Consentimento",
    coletadoEm: "2026-02-10",
    canal: "App do motorista",
  },
  {
    id: "cons-003",
    titular: "Mauricio Lima",
    titularId: "m-002",
    finalidade: "Comunicação operacional por WhatsApp",
    baseLegal: "Consentimento",
    coletadoEm: "2025-01-20",
    canal: "Onboarding público",
    revogadoEm: "2026-06-30",
  },
  {
    id: "cons-004",
    titular: "Souza Transportes ME",
    finalidade: "Tratamento de dados cadastrais para qualificação GMP+",
    baseLegal: "Execução de contrato",
    coletadoEm: "2026-01-10",
    canal: "Termo assinado",
  },
];

export function consentimentosVigentes(): Consentimento[] {
  return consentimentos.filter((c) => !c.revogadoEm);
}

/**
 * Revogar consentimento não derruba o que não depende dele. A função devolve o
 * que para e o que continua — é a resposta que o titular tem direito de receber.
 */
export function efeitoDaRevogacao(c: Consentimento): { para: string; continua: string } {
  if (c.baseLegal === "Consentimento") {
    return {
      para: "A finalidade cessa imediatamente e o dado deixa de ser usado para ela.",
      continua: "Nada mais: esta finalidade se apoiava só no consentimento.",
    };
  }
  return {
    para: "Nada. Esta finalidade não se apoia em consentimento.",
    continua: `Tratamento mantido sob “${c.baseLegal}” — revogar não desfaz obrigação regulatória nem contrato em execução.`,
  };
}
