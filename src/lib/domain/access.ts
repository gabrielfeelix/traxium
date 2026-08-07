import { HOJE } from "@/lib/domain/model";

export type TipoAcessoExterno = "portal_subcontratado" | "app_motorista";
export type EstadoConviteAcesso = "nao_enviado" | "enviado" | "concluido" | "expirado" | "revogado";

export type ConviteAcesso = {
  token: string;
  tipo: TipoAcessoExterno;
  entidadeId: string;
  nome: string;
  destinatario?: string;
  estado: EstadoConviteAcesso;
  criadoEm: string;
  expiraEm: string;
  enviadoEm?: string;
  concluidoEm?: string;
  revogadoEm?: string;
};

export const convitesAcesso: ConviteAcesso[] = [];

export const TIPO_ACESSO_LABEL: Record<TipoAcessoExterno, string> = {
  portal_subcontratado: "Portal do subcontratado",
  app_motorista: "App do motorista",
};

export const ESTADO_ACESSO_LABEL: Record<EstadoConviteAcesso, string> = {
  nao_enviado: "Não enviado",
  enviado: "Enviado",
  concluido: "Acesso ativado",
  expirado: "Expirado",
  revogado: "Revogado",
};

export function criarConviteAcesso(input: Omit<ConviteAcesso, "estado" | "criadoEm"> & { criadoEm?: string }): ConviteAcesso {
  return {
    ...input,
    estado: "nao_enviado",
    criadoEm: input.criadoEm ?? `${HOJE}T10:00:00`,
  };
}

export function conviteAcessoExpirou(convite: ConviteAcesso, agora = new Date().toISOString()): boolean {
  return convite.estado !== "concluido" && convite.estado !== "revogado" && convite.expiraEm < agora;
}

export function enviarConviteAcesso(convite: ConviteAcesso, agora: string): ConviteAcesso | null {
  if (convite.estado !== "nao_enviado" || conviteAcessoExpirou(convite, agora)) return null;
  return { ...convite, estado: "enviado", enviadoEm: agora };
}

export function concluirConviteAcesso(convite: ConviteAcesso, agora: string): ConviteAcesso | null {
  if ((convite.estado !== "nao_enviado" && convite.estado !== "enviado") || conviteAcessoExpirou(convite, agora)) return null;
  return { ...convite, estado: "concluido", concluidoEm: agora };
}

export function revogarConviteAcesso(convite: ConviteAcesso, agora: string): ConviteAcesso | null {
  if (convite.estado === "concluido" || convite.estado === "revogado") return null;
  return { ...convite, estado: "revogado", revogadoEm: agora };
}
