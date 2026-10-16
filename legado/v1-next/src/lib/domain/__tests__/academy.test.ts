import { describe, it, expect } from "vitest";
import { competenciaMotorista, trilhasExigidas, trilhasJustInTime } from "../academy";

// A junção é por `motorista.id`. Os CPFs em mock-data estão mascarados por LGPD
// (`***.456.789-**`) e não identificam ninguém.

describe("competenciaMotorista", () => {
  it("motorista com todas as trilhas obrigatórias vigentes é elegível", () => {
    const c = competenciaMotorista("m-001");
    expect(c.elegivel).toBe(true);
    expect(c.situacao).toBe("apto");
  });

  it("trilha obrigatória vencida torna inelegível e explica o motivo", () => {
    const c = competenciaMotorista("m-002");
    expect(c.elegivel).toBe(false);
    expect(c.situacao).toBe("vencida");
    expect(c.motivo).toMatch(/vencid/i);
    expect(c.trilhasPendentes.length).toBeGreaterThan(0);
  });

  it("nunca fez a trilha obrigatória é inelegível, e não 'vencida'", () => {
    const c = competenciaMotorista("m-999");
    expect(c.situacao).toBe("nunca_fez");
    expect(c.elegivel).toBe(false);
  });

  it("a vencer em menos de 30 dias ainda é elegível, mas sinaliza", () => {
    const c = competenciaMotorista("m-003");
    expect(c.elegivel).toBe(true);
    expect(c.situacao).toBe("a_vencer");
  });
});

describe("trilhasExigidas", () => {
  it("regime D exige a trilha de cargas proibidas além das obrigatórias", () => {
    const t = trilhasExigidas({ regime: "D" });
    expect(t.map((x) => x.codigo)).toContain("T04");
  });

  it("operação gatekeeper exige a trilha específica", () => {
    const t = trilhasExigidas({ gatekeeper: true });
    expect(t.map((x) => x.codigo)).toContain("T10");
  });

  it("sem contexto, só a base obrigatória", () => {
    const codigos = trilhasExigidas({}).map((x) => x.codigo);
    expect(codigos).not.toContain("T04");
    expect(codigos).not.toContain("T10");
  });
});

describe("elegibilidade no despacho", () => {
  it("motorista com trilha vencida não é elegível para regime nenhum", () => {
    expect(competenciaMotorista("m-002", undefined, { regime: "A" }).elegivel).toBe(false);
  });

  it("elegível em regime A pode ser inelegível em regime D, que exige T04", () => {
    const a = competenciaMotorista("m-001", undefined, { regime: "A" });
    const d = competenciaMotorista("m-001", undefined, { regime: "D" });
    expect(a.elegivel).toBe(true);
    expect(d.elegivel).toBe(false);
    expect(d.trilhasPendentes.map((t) => t.codigo)).toContain("T04");
  });
});

describe("trilhasJustInTime", () => {
  it("oferece só a trilha específica do contexto que o motorista não tem", () => {
    const t = trilhasJustInTime("m-001", { regime: "D" });
    expect(t.map((x) => x.codigo)).toEqual(["T04"]);
  });

  it("não oferece nada quando o contexto não aciona trilha específica", () => {
    expect(trilhasJustInTime("m-001", { regime: "A" })).toHaveLength(0);
  });
});
