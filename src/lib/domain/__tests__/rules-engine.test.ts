import { describe, it, expect } from "vitest";
import { avaliarCarregamento, getT3 } from "../rules-engine";

// Caracterização: trava o comportamento do motor ANTES da Fase 5 reescrever a
// avaliação para rodar todas as condições em vez de sair na primeira falha.
// Se um destes quebrar durante a reescrita, é regressão — não ajuste o teste
// sem entender o que mudou.

describe("avaliarCarregamento — comportamento atual", () => {
  it("bloqueia v-002: carga anterior proibida sem limpeza D", () => {
    const d = avaliarCarregamento("v-002");
    expect(d.tier).toBe("BLOQUEIO");
    expect(d.regra).toBe("Carga anterior proibida");
  });

  it("libera v-001 com todas as checagens ok", () => {
    const d = avaliarCarregamento("v-001");
    expect(d.tier).toBe("LIBERADO");
    expect(d.checagens.every((c) => c.ok)).toBe(true);
  });

  it("grava a versão da base usada na decisão", () => {
    expect(avaliarCarregamento("v-001").versaoBaseIDTF).toBe("IDTF-BR 2026.05");
  });

  it("T-3 do compartimento traz 3 cargas, mais recente primeiro", () => {
    const t3 = getT3("comp-002");
    expect(t3).toHaveLength(3);
    expect(t3[0].determinante).toBe(true);
  });
});
