/**
 * Ciclo de entrada do Gatekeeper.
 *
 * Manual, importação e convite são apenas origens do mesmo cadastro. A origem
 * nunca afirma conformidade: ela explica como o registro chegou e qual é o
 * próximo trabalho do escritório.
 */

export type OrigemCadastro = "manual" | "importacao" | "convite";
export type EtapaCadastro = "pre_cadastro" | "em_qualificacao";
export type EstadoConvite = "nao_enviado" | "enviado" | "aberto" | "concluido" | "expirado" | "revogado";
export type CanalConvite = "WhatsApp" | "E-mail" | "SMS" | "QR code" | "Link direto";

export const ORIGEM_CADASTRO_LABEL: Record<OrigemCadastro, string> = {
  manual: "Cadastro manual",
  importacao: "Importação",
  convite: "Convite público",
};

export const ESTADO_CONVITE_LABEL: Record<EstadoConvite, string> = {
  nao_enviado: "Não enviado",
  enviado: "Enviado",
  aberto: "Aberto",
  concluido: "Concluído",
  expirado: "Expirado",
  revogado: "Revogado",
};

export type ConviteOnboarding = {
  token: string;
  estado: EstadoConvite;
  canal: CanalConvite;
  destinatario?: string;
  criadoEm: string;
  expiraEm?: string;
  enviadoEm?: string;
  abertoEm?: string;
  concluidoEm?: string;
  encerradoEm?: string;
};

export type EntradaCadastro = {
  origem: OrigemCadastro;
  etapa: EtapaCadastro;
  criadoEm: string;
  criadoPor: string;
  convite?: ConviteOnboarding;
};

/** Registro de convites da sessão. Em produção, esta coleção vira tabela no backend. */
export const convitesOnboarding: ConviteOnboarding[] = [];

type NovaEntradaCadastro =
  | {
      origem: "manual" | "importacao";
      criadoEm: string;
      criadoPor: string;
      convite?: never;
    }
  | {
      origem: "convite";
      criadoEm: string;
      criadoPor: string;
      convite: Omit<ConviteOnboarding, "criadoEm"> & { criadoEm?: string };
    };

export function criarEntradaCadastro(input: NovaEntradaCadastro): EntradaCadastro {
  return {
    origem: input.origem,
    etapa: input.origem === "manual" ? "em_qualificacao" : "pre_cadastro",
    criadoEm: input.criadoEm,
    criadoPor: input.criadoPor,
    ...(input.origem === "convite"
      ? { convite: { ...input.convite, criadoEm: input.convite.criadoEm ?? input.criadoEm } }
      : {}),
  };
}

export type EventoConvite = "enviar" | "abrir" | "concluir" | "expirar" | "revogar";

const TRANSICOES: Record<EstadoConvite, Partial<Record<EventoConvite, EstadoConvite>>> = {
  // Abrir/concluir também podem ser o primeiro evento observado quando o link
  // foi copiado e distribuído fora dos canais instrumentados pelo protótipo.
  nao_enviado: { enviar: "enviado", abrir: "aberto", concluir: "concluido", revogar: "revogado" },
  enviado: { abrir: "aberto", concluir: "concluido", expirar: "expirado", revogar: "revogado" },
  aberto: { concluir: "concluido", expirar: "expirado", revogar: "revogado" },
  concluido: {},
  expirado: {},
  revogado: {},
};

/** Retorna `null` para uma transição inválida e mantém o registro original intacto. */
export function transicionarConvite(
  convite: ConviteOnboarding,
  evento: EventoConvite,
  quando: string
): ConviteOnboarding | null {
  const estado = TRANSICOES[convite.estado][evento];
  if (!estado) return null;

  return {
    ...convite,
    estado,
    ...(evento === "enviar" ? { enviadoEm: quando } : {}),
    ...(evento === "abrir" ? { abertoEm: quando } : {}),
    ...(evento === "concluir" ? { concluidoEm: quando } : {}),
    ...(evento === "expirar" || evento === "revogar" ? { encerradoEm: quando } : {}),
  };
}

export function proximoPassoDaEntrada(entrada: EntradaCadastro): string {
  if (entrada.etapa === "em_qualificacao") return "Completar qualificação";
  if (entrada.origem === "importacao") return "Revisar importação e solicitar documentos";

  switch (entrada.convite?.estado) {
    case "nao_enviado":
      return "Enviar convite";
    case "enviado":
      return "Aguardar abertura do convite";
    case "aberto":
      return "Aguardar conclusão do cadastro";
    case "concluido":
      return "Revisar dados enviados e iniciar qualificação";
    case "expirado":
      return "Gerar novo convite";
    case "revogado":
      return "Revisar revogação antes de convidar novamente";
    default:
      return "Revisar entrada";
  }
}

/** Avança o Gatekeeper sem apagar de onde o registro veio ou o convite associado. */
export function iniciarQualificacaoCadastro(entrada: EntradaCadastro): EntradaCadastro {
  if (entrada.etapa === "em_qualificacao") return entrada;
  return { ...entrada, etapa: "em_qualificacao" };
}
