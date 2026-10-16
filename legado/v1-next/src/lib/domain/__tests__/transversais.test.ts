import { describe, it, expect } from "vitest";
import {
  pendenciasDeRegistro,
  informacoesComplementares,
  anexarRegistro,
  anexosDaViagem,
  podeConcluir,
} from "../registro";
import { classeDe, ORDEM_REGRAS, CLASSE_MINIMA } from "../motor-config";
import {
  POLITICA_RETENCAO,
  POLITICA_INATIVACAO,
  consentimentos,
  efeitoDaRevogacao,
  vencimentoRetencao,
  diasParaExpurgo,
} from "../lgpd";
import { indicadores, coberturaIndicadores } from "../indicadores";
import { HOJE } from "../model";

// ── Fase 10.1 — registro obrigatório e informação complementar ──────────────

describe("classes registro e informação", () => {
  it("registro pendente aponta só regras da classe registro que falharam", () => {
    for (const p of pendenciasDeRegistro("v-002")) {
      expect(classeDe(p.regra), p.regra).toBe("registro");
    }
  });

  it("informação complementar não vira pendência de fecho", () => {
    const infos = informacoesComplementares("v-002");
    const pend = pendenciasDeRegistro("v-002");
    for (const i of infos) {
      expect(classeDe(i.regra)).toBe("informacao");
      expect(pend.some((p) => p.regra === i.regra)).toBe(false);
    }
  });

  it("anexo só é aceito contra regra de classe registro, e com descrição", () => {
    const bloqueio = ORDEM_REGRAS.find((r) => classeDe(r) === "bloqueio")!;
    expect(anexarRegistro({ viagemId: "v-003", regra: bloqueio, descricao: "Foto", anexadoPor: "teste" })).toBeNull();
    const registro = ORDEM_REGRAS.find((r) => classeDe(r) === "registro");
    if (registro) {
      expect(anexarRegistro({ viagemId: "v-003", regra: registro, descricao: "   ", anexadoPor: "teste" })).toBeNull();
    }
  });

  it("carga bloqueada não conclui, mesmo sem pendência de registro", () => {
    const r = podeConcluir("v-002");
    expect(r.ok).toBe(false);
    expect(r.motivo).toMatch(/bloqueada pelo motor/i);
  });

  it("anexar a evidência destrava o que a classe registro travava", () => {
    const antes = podeConcluir("v-005");
    const pend = pendenciasDeRegistro("v-005");
    for (const p of pend) {
      anexarRegistro({ viagemId: "v-005", regra: p.regra, descricao: `Evidência de ${p.nome}`, anexadoPor: "teste" });
    }
    expect(anexosDaViagem("v-005").length).toBe(pend.length);
    expect(pendenciasDeRegistro("v-005")).toHaveLength(0);
    const depois = podeConcluir("v-005");
    // Só afirma o destravamento quando o bloqueio anterior era o registro.
    if (!antes.ok && /registro/i.test(antes.motivo)) expect(depois.ok).toBe(true);
  });
});

// ── Fase 10.2 — LGPD ────────────────────────────────────────────────────────

describe("LGPD", () => {
  it("todo tipo de dado declara prazo, base legal e destino no fim do prazo", () => {
    expect(POLITICA_RETENCAO.length).toBeGreaterThanOrEqual(6);
    for (const p of POLITICA_RETENCAO) {
      expect(p.meses, p.tipo).toBeGreaterThan(0);
      expect(p.baseLegal, p.tipo).toBeTruthy();
      expect(p.fundamento, p.tipo).toBeTruthy();
      expect(p.aoVencer, p.tipo).toBeTruthy();
    }
  });

  it("retenção é derivada da data do fato, não de um campo de status", () => {
    expect(vencimentoRetencao("2026-05-24", 60)).toBe("2031-05-24");
    expect(diasParaExpurgo("2026-05-24", 60, HOJE)).toBeGreaterThan(0);
    expect(diasParaExpurgo("2019-01-01", 12, HOJE)).toBeLessThan(0);
  });

  it("evidência de segurança de feed não se apoia em consentimento", () => {
    const evidencia = POLITICA_RETENCAO.find((p) => p.tipo.startsWith("Evidência"))!;
    expect(evidencia.baseLegal).toBe("Obrigação legal ou regulatória");
  });

  it("revogar consentimento só derruba o que dependia dele", () => {
    const porConsentimento = consentimentos.find((c) => c.baseLegal === "Consentimento")!;
    const porObrigacao = consentimentos.find((c) => c.baseLegal !== "Consentimento")!;
    expect(efeitoDaRevogacao(porConsentimento).para).toMatch(/cessa/i);
    expect(efeitoDaRevogacao(porObrigacao).para).toMatch(/nada/i);
    expect(efeitoDaRevogacao(porObrigacao).continua).toMatch(/mantido/i);
  });

  it("toda regra de inativação diz o que NÃO é apagado", () => {
    for (const r of POLITICA_INATIVACAO) {
      expect(r.preservado, r.gatilho).toBeTruthy();
    }
  });
});

// ── Fase 10.3 — indicadores ─────────────────────────────────────────────────

describe("indicadores do §8", () => {
  it("são quinze, com id único", () => {
    const lista = indicadores();
    expect(lista).toHaveLength(15);
    expect(new Set(lista.map((i) => i.id)).size).toBe(15);
  });

  it("indicador medido tem fonte; não medido tem o motivo — nunca os dois vazios", () => {
    for (const i of indicadores()) {
      if (i.valor === null) expect(i.porqueNaoMedido, i.id).toBeTruthy();
      else expect(i.fonte, i.id).toBeTruthy();
    }
  });

  it("nenhum percentual passa de 100 nem fica negativo", () => {
    for (const i of indicadores().filter((x) => x.unidade === "%" && x.valor !== null)) {
      expect(i.valor!, i.id).toBeGreaterThanOrEqual(0);
      expect(i.valor!, i.id).toBeLessThanOrEqual(100);
    }
  });

  it("a taxa de automação do painel é a mesma da Torre", () => {
    expect(indicadores().find((i) => i.id === "automacao")!.valor).toBe(40);
  });

  it("a cobertura é contada, não afirmada", () => {
    const c = coberturaIndicadores();
    expect(c.total).toBe(15);
    expect(c.medidos).toBe(indicadores().filter((i) => i.valor !== null).length);
    expect(c.medidos).toBeLessThan(c.total); // há telemetria que o protótipo não tem
  });

  it("as quatro lacunas de telemetria continuam declaradas como lacuna", () => {
    const naoMedidos = indicadores().filter((i) => i.valor === null).map((i) => i.id);
    for (const id of ["tempo_cadastro_tac", "tempo_checklist", "fotos_rejeitadas", "tempo_dossie"]) {
      expect(naoMedidos, id).toContain(id);
    }
  });
});

describe("configuração do motor segue com piso", () => {
  it("regra travada em bloqueio não pode ser rebaixada para registro", () => {
    expect(CLASSE_MINIMA.carga_anterior).toBe("bloqueio");
  });
});
