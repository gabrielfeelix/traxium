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

// ── Fase 5: as oito condições do verde ──────────────────────────────────────

describe("avaliação completa — todas as condições, sempre", () => {
  it("avalia as 12 regras mesmo quando a primeira já bloqueia", () => {
    const d = avaliarCarregamento("v-002");
    expect(d.checagens).toHaveLength(12);
    // Antes da Fase 5 o motor saía na primeira falha e o dossiê via só 2.
    expect(d.checagens.filter((c) => !c.ok).length).toBeGreaterThan(1);
  });

  it("a ordem das checagens é estável entre viagens", () => {
    const a = avaliarCarregamento("v-001").checagens.map((c) => c.regra);
    const b = avaliarCarregamento("v-002").checagens.map((c) => c.regra);
    expect(a).toEqual(b);
  });

  it("carrega a classe configurada de cada checagem", () => {
    const d = avaliarCarregamento("v-002");
    expect(d.checagens.find((c) => c.regra === "carga_anterior")?.classe).toBe("bloqueio");
    expect(d.checagens.find((c) => c.regra === "fotos_minimas")?.classe).toBe("registro");
  });
});

describe("condições acrescentadas na Fase 5", () => {
  it("competência é avaliada NO REGIME que a carga anterior exige", () => {
    // v-002 tem defensivo no T-1, então exige regime D — e regime D aciona a
    // T04. O Mauricio nunca fez a T04, e essa pendência aparece antes da T01
    // vencida porque nunca-concluída é mais severo que vencida.
    const c = avaliarCarregamento("v-002").checagens.find((x) => x.regra === "competencia_motorista");
    expect(c?.ok).toBe(false);
    expect(c?.detalhe).toContain("T04");
  });

  it("fotos mínimas reprovam com menos de 6 ângulos", () => {
    // insp-002 tem 2 fotos.
    const c = avaliarCarregamento("v-002").checagens.find((x) => x.regra === "fotos_minimas");
    expect(c?.ok).toBe(false);
    expect(c?.detalhe).toContain("2 de 6");
  });

  it("acordo de qualidade reprova quando vencido na data do carregamento", () => {
    const c = avaliarCarregamento("v-002").checagens.find((x) => x.regra === "acordo_vigente");
    expect(c?.ok).toBe(false);
  });

  it("cadastro do subcontratado reprova quando suspenso", () => {
    const c = avaliarCarregamento("v-002").checagens.find((x) => x.regra === "cadastro_valido");
    expect(c?.ok).toBe(false);
  });

  it("v-001 passa nas oito condições do verde", () => {
    const d = avaliarCarregamento("v-001");
    const oito = [
      "cadastro_valido", "acordo_vigente", "competencia_motorista", "t3_completo",
      "produto_reconhecido", "limpeza_compativel", "checklist_aprovado", "fotos_minimas",
    ] as const;
    for (const r of oito) {
      expect(d.checagens.find((c) => c.regra === r)?.ok, `regra ${r}`).toBe(true);
    }
    expect(d.tier).toBe("LIBERADO");
  });
});
