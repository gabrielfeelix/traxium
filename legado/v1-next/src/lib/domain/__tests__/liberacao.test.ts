import { describe, it, expect } from "vitest";
import {
  MOTIVOS_POR_REGRA,
  motivosDaRegra,
  situacaoDaViagem,
  registrarLiberacao,
  registrosLiberacao,
  registroDaExcecao,
  expiraEm,
  IMPACTOS,
  VALIDADES,
} from "../liberacao";
import { ORDEM_REGRAS, REGRA_LABEL, CLASSE_MINIMA } from "../motor-config";
import {
  NIVEIS_AUTORIDADE,
  NIVEL_ESCOPO,
  NIVEL_LABEL,
  podeAprovarExcecao,
  excecoes,
  type Excecao,
} from "../model";
import { autoridadeDaRegra } from "../control-tower";

// ── Fase 7.1 — motivo padronizado é lista fechada ───────────────────────────

describe("motivos padronizados", () => {
  it("toda regra do motor tem entrada no mapa — nenhuma cai em texto livre por omissão", () => {
    for (const id of ORDEM_REGRAS) {
      expect(MOTIVOS_POR_REGRA[id], `regra ${id}`).toBeDefined();
    }
  });

  // A invariante que importa não é o piso da classe, é a autoridade: piso
  // `bloqueio` diz que a regra não pode ser afrouxada na configuração;
  // `tecnico` diz que ninguém a libera. `competencia_motorista` é as duas
  // coisas ao mesmo tempo — bloqueia sempre, mas resolve-se registrando a
  // trilha, então tem motivo padronizado.
  it("há motivo padronizado exatamente onde existe autoridade que libere", () => {
    for (const id of ORDEM_REGRAS) {
      const temMotivo = motivosDaRegra(REGRA_LABEL[id]).length > 0;
      const semAutoridade = autoridadeDaRegra(REGRA_LABEL[id]) === "tecnico";
      expect(temMotivo, `regra ${id}`).toBe(!semAutoridade);
    }
  });

  it("regra de piso bloqueio segue sem poder ser afrouxada", () => {
    expect(CLASSE_MINIMA.carga_anterior).toBe("bloqueio");
    expect(motivosDaRegra(REGRA_LABEL.carga_anterior)).toHaveLength(0);
  });

  it("regra liberável oferece motivos, e só os dela", () => {
    const checklist = motivosDaRegra(REGRA_LABEL.checklist_aprovado);
    const fotos = motivosDaRegra(REGRA_LABEL.fotos_minimas);
    expect(checklist.length).toBeGreaterThan(0);
    expect(fotos.length).toBeGreaterThan(0);
    expect(checklist.some((m) => fotos.includes(m))).toBe(false);
  });

  it("regra desconhecida não abre exceção: lista vazia, não fallback livre", () => {
    expect(motivosDaRegra("Regra que ninguém mapeou")).toHaveLength(0);
  });
});

// ── Fase 7.2 — os nove campos ───────────────────────────────────────────────

describe("registro da liberação", () => {
  const excecaoFake: Excecao = {
    id: "exc-teste",
    viagemId: "v-004",
    codigoViagem: "TX-2026-08474",
    motivoBloqueio: "Certificação a vencer.",
    regra: REGRA_LABEL.cert_a_vencer,
    nivelRequerido: "trafego",
    solicitante: "teste",
    solicitadoEm: "2026-07-06T09:12:00",
    status: "pendente",
    evidencias: ["Protocolo de renovação"],
  };

  const base = {
    excecao: excecaoFake,
    motivoPadronizado: MOTIVOS_POR_REGRA.cert_a_vencer[0],
    justificativa: "Renovação protocolada na certificadora em 02/07.",
    evidencias: ["Protocolo de renovação"],
    responsavel: "Gestor GMP+/Qualidade",
    impacto: IMPACTOS[0].id,
    validade: VALIDADES[1].id, // 72h
    situacaoAnterior: situacaoDaViagem("v-004"),
    situacaoPosterior: situacaoDaViagem("v-004"),
  };

  it("grava os nove campos, com anterior e posterior derivados da viagem", () => {
    const r = registrarLiberacao(base);
    expect(r).not.toBeNull();
    expect(r!.motivoPadronizado).toBe(base.motivoPadronizado);
    expect(r!.justificativa).toBeTruthy();
    expect(r!.evidencias.length).toBeGreaterThan(0);
    expect(r!.responsavel).toBeTruthy();
    expect(r!.dataHora).toBeTruthy();
    expect(r!.situacaoAnterior.resumo).toContain("checagens conformes");
    expect(r!.situacaoPosterior.resumo).toContain("checagens conformes");
    expect(r!.impacto).toBeTruthy();
    expect(r!.validade).toBeTruthy();
    expect(registroDaExcecao("exc-teste")).toBe(r);
    expect(registrosLiberacao).toContain(r);
  });

  it("recusa motivo fora da lista fechada da regra", () => {
    expect(registrarLiberacao({ ...base, motivoPadronizado: "porque sim" })).toBeNull();
  });

  it("recusa justificativa vazia — o motivo não substitui o complemento", () => {
    expect(registrarLiberacao({ ...base, justificativa: "   " })).toBeNull();
  });

  it("recusa liberação sem evidência", () => {
    expect(registrarLiberacao({ ...base, evidencias: [] })).toBeNull();
  });

  it("validade por relógio calcula a expiração; validade por fato não expira sozinha", () => {
    expect(expiraEm("72h", "2026-07-08T10:00:00")).toBe("2026-07-11T13:00");
    expect(expiraEm("ate_regularizacao", "2026-07-08T10:00:00")).toBeNull();
    expect(expiraEm("esta_viagem", "2026-07-08T10:00:00")).toBeNull();
  });
});

describe("situação da viagem", () => {
  it("é derivada da triagem, não de campo editável", () => {
    const s = situacaoDaViagem("v-002");
    expect(s.faixa).toBe("vermelho");
    expect(s.liberadaPor).toBeNull();
    expect(s.checagensTotal).toBe(12);
    expect(s.checagensOk).toBeLessThan(s.checagensTotal);
  });

  it("viagem inexistente não inventa estado", () => {
    expect(situacaoDaViagem("v-inexistente").regra).toBe("Viagem não encontrada");
  });
});

// ── Fase 7.3 — os seis níveis de autoridade ─────────────────────────────────

describe("hierarquia de autoridade", () => {
  it("tem os seis níveis da diretriz, cada um com rótulo e escopo", () => {
    expect(NIVEIS_AUTORIDADE).toHaveLength(6);
    expect(NIVEIS_AUTORIDADE).toContain("trafego");
    expect(NIVEIS_AUTORIDADE).toContain("inspetor");
    for (const n of NIVEIS_AUTORIDADE) {
      expect(NIVEL_LABEL[n], n).toBeTruthy();
      expect(NIVEL_ESCOPO[n], n).toBeTruthy();
    }
  });

  it("bloqueio técnico continua sem ninguém que libere", () => {
    for (const p of ["gestor", "diretoria_rt", "inspetor", "despachante", "motorista"] as const) {
      expect(podeAprovarExcecao(p, "tecnico"), p).toBe(false);
    }
  });

  it("inspetor decide condição física; tráfego decide pendência simples", () => {
    expect(podeAprovarExcecao("inspetor", "inspetor")).toBe(true);
    expect(podeAprovarExcecao("despachante", "trafego")).toBe(true);
  });

  it("autoridade escala para cima, nunca para baixo", () => {
    // Gestor cobre inspetor e tráfego…
    expect(podeAprovarExcecao("gestor", "inspetor")).toBe(true);
    expect(podeAprovarExcecao("gestor", "trafego")).toBe(true);
    // …e o inverso não vale.
    expect(podeAprovarExcecao("inspetor", "gestor")).toBe(false);
    expect(podeAprovarExcecao("despachante", "gestor")).toBe(false);
  });

  it("motorista não aprova em nível nenhum", () => {
    for (const n of NIVEIS_AUTORIDADE) {
      expect(podeAprovarExcecao("motorista", n), n).toBe(false);
    }
  });

  it("cada regra do motor roteia para um nível existente", () => {
    for (const id of ORDEM_REGRAS) {
      expect(NIVEIS_AUTORIDADE, id).toContain(autoridadeDaRegra(REGRA_LABEL[id]));
    }
  });

  it("condição física vai ao inspetor e pendência simples ao tráfego", () => {
    expect(autoridadeDaRegra(REGRA_LABEL.checklist_aprovado)).toBe("inspetor");
    expect(autoridadeDaRegra(REGRA_LABEL.fotos_minimas)).toBe("inspetor");
    expect(autoridadeDaRegra(REGRA_LABEL.cert_a_vencer)).toBe("trafego");
    expect(autoridadeDaRegra(REGRA_LABEL.sync_pendente)).toBe("trafego");
  });

  it("toda exceção do mock exige um nível que existe no modelo", () => {
    for (const e of excecoes) {
      expect(NIVEIS_AUTORIDADE, e.id).toContain(e.nivelRequerido);
    }
  });
});
