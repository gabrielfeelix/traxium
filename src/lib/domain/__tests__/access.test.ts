import { describe, expect, it } from "vitest";
import {
  concluirConviteAcesso,
  criarConviteAcesso,
  enviarConviteAcesso,
  revogarConviteAcesso,
} from "@/lib/domain/access";

const base = () => criarConviteAcesso({
  token: "access-token",
  tipo: "app_motorista",
  entidadeId: "m-001",
  nome: "Motorista teste",
  expiraEm: "2026-08-10T10:00:00.000Z",
  criadoEm: "2026-08-06T10:00:00.000Z",
});

describe("convite de acesso externo", () => {
  it("nasce não enviado; gerar link não afirma entrega", () => {
    expect(base().estado).toBe("nao_enviado");
  });

  it("separa envio de ativação do acesso", () => {
    const enviado = enviarConviteAcesso(base(), "2026-08-06T11:00:00.000Z")!;
    expect(enviado.estado).toBe("enviado");
    expect(concluirConviteAcesso(enviado, "2026-08-06T12:00:00.000Z")?.estado).toBe("concluido");
  });

  it("não ativa convite expirado ou revogado", () => {
    expect(concluirConviteAcesso(base(), "2026-08-11T10:00:00.000Z")).toBeNull();
    const revogado = revogarConviteAcesso(base(), "2026-08-06T11:00:00.000Z")!;
    expect(concluirConviteAcesso(revogado, "2026-08-06T12:00:00.000Z")).toBeNull();
  });
});
