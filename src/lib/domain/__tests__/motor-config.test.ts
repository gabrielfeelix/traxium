import { describe, it, expect, beforeEach } from "vitest";
import {
  setClasseRegra, classeDe, podeRebaixar, regraTravada, configMotor, CONFIG_PADRAO,
} from "../motor-config";

beforeEach(() => {
  Object.assign(configMotor, CONFIG_PADRAO);
});

describe("piso por regra", () => {
  it("não deixa rebaixar carga anterior proibida", () => {
    expect(setClasseRegra("carga_anterior", "informacao")).toBe(false);
    expect(setClasseRegra("carga_anterior", "alerta")).toBe(false);
    expect(classeDe("carga_anterior")).toBe("bloqueio");
  });

  it("não deixa rebaixar competência do motorista — é elegibilidade, não recomendação", () => {
    expect(setClasseRegra("competencia_motorista", "registro")).toBe(false);
    expect(classeDe("competencia_motorista")).toBe("bloqueio");
  });

  it("deixa rebaixar fotos mínimas, que é corrigível", () => {
    expect(setClasseRegra("fotos_minimas", "informacao")).toBe(true);
    expect(classeDe("fotos_minimas")).toBe("informacao");
  });

  it("deixa endurecer qualquer regra", () => {
    expect(setClasseRegra("fotos_minimas", "bloqueio")).toBe(true);
    expect(classeDe("fotos_minimas")).toBe("bloqueio");
  });

  it("checklist pode virar alerta, mas não menos que isso", () => {
    expect(setClasseRegra("checklist_aprovado", "alerta")).toBe(true);
    expect(setClasseRegra("checklist_aprovado", "registro")).toBe(false);
    expect(classeDe("checklist_aprovado")).toBe("alerta");
  });

  it("as sete regras de bloqueio técnico aparecem como travadas", () => {
    const travadas = (
      ["t3_completo", "carga_anterior", "limpeza_compativel", "certificado_valido",
       "cadastro_valido", "acordo_vigente", "competencia_motorista"] as const
    ).every(regraTravada);
    expect(travadas).toBe(true);
    expect(regraTravada("fotos_minimas")).toBe(false);
  });

  it("podeRebaixar não altera nada — só consulta", () => {
    podeRebaixar("carga_anterior", "informacao");
    expect(classeDe("carga_anterior")).toBe("bloqueio");
  });
});
