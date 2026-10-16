import { describe, expect, it } from "vitest";
import {
  criarEntradaCadastro,
  iniciarQualificacaoCadastro,
  proximoPassoDaEntrada,
  transicionarConvite,
  type ConviteOnboarding,
} from "@/lib/domain/onboarding";

describe("ciclo de entrada do subcontratado", () => {
  it("distingue cadastro manual, importação e convite sem afirmar aptidão", () => {
    const manual = criarEntradaCadastro({
      origem: "manual",
      criadoEm: "2026-08-06T10:00:00",
      criadoPor: "Gestor GMP+",
    });
    const importado = criarEntradaCadastro({
      origem: "importacao",
      criadoEm: "2026-08-06T10:01:00",
      criadoPor: "Admin de subcontratados",
    });
    const convidado = criarEntradaCadastro({
      origem: "convite",
      criadoEm: "2026-08-06T10:02:00",
      criadoPor: "Onboarding público",
      convite: { token: "abc123", estado: "concluido", canal: "WhatsApp" },
    });

    expect(manual.etapa).toBe("em_qualificacao");
    expect(importado.etapa).toBe("pre_cadastro");
    expect(convidado.etapa).toBe("pre_cadastro");
    expect(convidado.convite?.estado).toBe("concluido");
    expect(proximoPassoDaEntrada(manual)).toBe("Completar qualificação");
    expect(proximoPassoDaEntrada(importado)).toBe("Revisar importação e solicitar documentos");
    expect(proximoPassoDaEntrada(convidado)).toBe("Revisar dados enviados e iniciar qualificação");
  });

  it("faz o convite avançar por estados auditáveis", () => {
    const inicial: ConviteOnboarding = {
      token: "abc123",
      estado: "nao_enviado",
      canal: "WhatsApp",
      criadoEm: "2026-08-06T09:00:00",
    };

    const enviado = transicionarConvite(inicial, "enviar", "2026-08-06T09:05:00");
    const aberto = enviado && transicionarConvite(enviado, "abrir", "2026-08-06T09:08:00");
    const concluido = aberto && transicionarConvite(aberto, "concluir", "2026-08-06T09:15:00");

    expect(enviado).toMatchObject({ estado: "enviado", enviadoEm: "2026-08-06T09:05:00" });
    expect(aberto).toMatchObject({ estado: "aberto", abertoEm: "2026-08-06T09:08:00" });
    expect(concluido).toMatchObject({ estado: "concluido", concluidoEm: "2026-08-06T09:15:00" });
    expect(transicionarConvite(concluido!, "abrir", "2026-08-06T09:20:00")).toBeNull();
  });

  it("permite expirar ou revogar sem apagar o convite", () => {
    const convite: ConviteOnboarding = {
      token: "xyz789",
      estado: "enviado",
      canal: "E-mail",
      criadoEm: "2026-08-05T09:00:00",
      enviadoEm: "2026-08-05T09:01:00",
    };

    expect(transicionarConvite(convite, "expirar", "2026-08-06T09:00:00")).toMatchObject({
      estado: "expirado",
      encerradoEm: "2026-08-06T09:00:00",
    });
    expect(transicionarConvite(convite, "revogar", "2026-08-06T09:00:00")).toMatchObject({
      estado: "revogado",
      encerradoEm: "2026-08-06T09:00:00",
    });
  });

  it("inicia a qualificação preservando a origem e muda o próximo passo", () => {
    const importado = criarEntradaCadastro({
      origem: "importacao",
      criadoEm: "2026-08-06T10:00:00",
      criadoPor: "Admin de subcontratados",
    });

    const emQualificacao = iniciarQualificacaoCadastro(importado);

    expect(emQualificacao).not.toBe(importado);
    expect(emQualificacao.origem).toBe("importacao");
    expect(emQualificacao.etapa).toBe("em_qualificacao");
    expect(proximoPassoDaEntrada(emQualificacao)).toBe("Completar qualificação");
  });
});
