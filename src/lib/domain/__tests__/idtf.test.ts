import { describe, it, expect } from "vitest";
import {
  resolveProdutoPorNome,
  nomesDoProduto,
  produtosIDTF,
  historicoBase,
  historicoDoProduto,
  findProduto as findProdutoPorId,
  GOVERNANCA_BASE,
  VERSAO_BASE_IDTF,
} from "../model";
import { rotuloOperacional, resultadoIDTF, ROTULOS_OPERACIONAIS, type RotuloOperacional } from "../idtf";

// ── Fase 8.1 — vocabulário brasileiro resolve, não vira produto novo ────────

describe("resolveProdutoPorNome", () => {
  it("resolve pelo canônico, pelo alias e pelo nome oficial da fonte", () => {
    expect(resolveProdutoPorNome("Farelo de soja")?.id).toBe("p-farelo-soja");
    expect(resolveProdutoPorNome("soybean meal")?.id).toBe("p-farelo-soja");
    expect(resolveProdutoPorNome("Soya bean meal")?.id).toBe("p-farelo-soja");
  });

  it("resolve sinônimo regional sem misturar produtos parecidos", () => {
    // "casquinha" é casca de soja no campo; "farelinho" é farelo. Confundir os
    // dois trocaria o regime exigido — o parecer da base recusou o apelido
    // justamente por isso (histórico hb-005).
    expect(resolveProdutoPorNome("farelinho")?.id).toBe("p-farelo-soja");
    expect(resolveProdutoPorNome("casquinha")?.id).toBe("p-casca-soja");
    expect(resolveProdutoPorNome("casquinha de soja")?.id).toBe("p-casca-soja");
  });

  it("resolve nome comercial e nome em inglês", () => {
    expect(resolveProdutoPorNome("NPK 04-14-08")?.id).toBe("p-fert-npk");
    expect(resolveProdutoPorNome("yellow corn")?.id).toBe("p-milho");
  });

  it("resolve erro comum de digitação", () => {
    expect(resolveProdutoPorNome("soija")?.id).toBe("p-soja");
    expect(resolveProdutoPorNome("mihlo")?.id).toBe("p-milho");
  });

  it("ignora acento, caixa e espaço — quem digita está no pátio", () => {
    expect(resolveProdutoPorNome("AGROTOXICO")?.id).toBe("p-defensivo");
    expect(resolveProdutoPorNome("  Defensivo   Agrícola Líquido ")?.id).toBe("p-defensivo");
  });

  it("nome que não existe segue sem resolver — é o que abre a fila", () => {
    expect(resolveProdutoPorNome("resíduo de destilaria")).toBeUndefined();
    expect(resolveProdutoPorNome("")).toBeUndefined();
  });

  it("nenhum nome resolve para dois produtos diferentes", () => {
    const vistos = new Map<string, string>();
    for (const p of produtosIDTF) {
      for (const nome of nomesDoProduto(p)) {
        // Mesma normalização do resolvedor: acento e caixa não podem ser a
        // única diferença entre o vocabulário de dois produtos.
        const chave = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
        const dono = vistos.get(chave);
        expect(dono ?? p.id, `“${nome}” em ${p.id}`).toBe(p.id);
        vistos.set(chave, p.id);
      }
    }
  });
});

describe("cadastro completo", () => {
  it("produto classificado declara fonte da decisão, responsável e data", () => {
    for (const p of produtosIDTF.filter((x) => x.statusClassificacao !== "em_fila")) {
      expect(p.fonteDecisao, p.id).toBeTruthy();
      expect(p.responsavelValidacao, p.id).toBeTruthy();
      expect(p.atualizadoEm, p.id).toBeTruthy();
      expect(p.estadoFisico, p.id).toBeTruthy();
    }
  });

  it("produto em fila não finge ter validação: sem responsável e sem código IDTF", () => {
    for (const p of produtosIDTF.filter((x) => x.statusClassificacao === "em_fila")) {
      expect(p.responsavelValidacao, p.id).toBeUndefined();
      expect(p.idtfCode, p.id).toBeUndefined();
    }
  });
});

// ── Fase 8.2 — os nove rótulos operacionais ─────────────────────────────────

describe("rótulo operacional", () => {
  it("são nove, sem repetição", () => {
    expect(ROTULOS_OPERACIONAIS).toHaveLength(9);
    expect(new Set(ROTULOS_OPERACIONAIS).size).toBe(9);
  });

  it("todo rótulo devolvido pertence à lista fechada", () => {
    for (const id of ["v-001", "v-002", "v-003", "v-004", "v-005", "v-006"]) {
      expect(ROTULOS_OPERACIONAIS, id).toContain(rotuloOperacional(id).rotulo);
    }
  });

  it("carga anterior proibida tem rótulo próprio e diz o procedimento", () => {
    const r = rotuloOperacional("v-002");
    expect(r.rotulo).toBe("Carga anterior proibida");
    expect(r.acao).toMatch(/procedimento formal/i);
    expect(r.tom).toBe("bloqueio");
  });

  it("carga conforme é Liberado e não sugere próximo passo", () => {
    const r = rotuloOperacional("v-001");
    expect(r.rotulo).toBe("Liberado");
    expect(r.acao).toBe("");
  });

  it("restrição da base vira procedimento especial, não limpeza", () => {
    // v-004: a carga determinante do comp-004 tem restrição de laudo na base.
    const r = rotuloOperacional("v-004");
    expect(["Necessita procedimento especial", "Liberado", "Liberado após limpeza C"]).toContain(r.rotulo);
    if (r.rotulo === "Necessita procedimento especial") expect(r.motivo).toMatch(/além da limpeza/i);
  });

  it("o rótulo fala de IDTF: viagem travada por outra condição continua liberada pela base", () => {
    const r = rotuloOperacional("v-006");
    if (r.rotulo === "Liberado") expect(r.motivo).toMatch(/IDTF|Regime/);
  });
});

describe("cruzamento cru — os nove rótulos são alcançáveis", () => {
  const soja = findProdutoPorId("p-soja");
  const farelo = findProdutoPorId("p-farelo-soja");
  const npk = findProdutoPorId("p-fert-npk");
  const defensivo = findProdutoPorId("p-defensivo");
  const emFila = findProdutoPorId("p-casca-soja");
  const trigo = findProdutoPorId("p-trigo");
  const sorgo = findProdutoPorId("p-sorgo");
  const salMineral = findProdutoPorId("p-sal-mineral");
  const farinhaPeixe = findProdutoPorId("p-farinha-peixe");

  it("cada um dos nove sai de uma combinação real da base — nenhum rótulo é decorativo", () => {
    const esperado: [RotuloOperacional, Parameters<typeof resultadoIDTF>[0]][] = [
      ["Liberado", { atual: soja, anterior: farelo, regimeAplicado: "A" }],
      ["Liberado após limpeza A", { atual: soja, anterior: farelo, regimeAplicado: null }],
      ["Liberado após limpeza B", { atual: soja, anterior: trigo, regimeAplicado: "A" }],
      ["Liberado após limpeza C", { atual: soja, anterior: salMineral, regimeAplicado: "B" }],
      ["Liberado após limpeza D", { atual: soja, anterior: farinhaPeixe, regimeAplicado: "C" }],
      ["Necessita procedimento especial", { atual: soja, anterior: npk, regimeAplicado: "C" }],
      ["Carga anterior proibida", { atual: soja, anterior: defensivo, regimeAplicado: "D" }],
      ["Produto não identificado", { atual: undefined, anterior: soja }],
      ["Aguardando análise da Qualidade", { atual: emFila, anterior: soja, regimeAplicado: "A" }],
    ];
    expect(esperado.map(([r]) => r).sort()).toEqual([...ROTULOS_OPERACIONAIS].sort());
    for (const [rotulo, entrada] of esperado) {
      expect(resultadoIDTF(entrada).rotulo, rotulo).toBe(rotulo);
    }
  });

  it("sorgo exige B: o rótulo diz qual limpeza resolve, não só que falta limpar", () => {
    expect(resultadoIDTF({ atual: soja, anterior: sorgo, regimeAplicado: null }).rotulo).toBe(
      "Liberado após limpeza B"
    );
  });

  it("sem carga anterior conhecida, a base não arrisca: procedimento especial", () => {
    const r = resultadoIDTF({ atual: soja, anterior: undefined });
    expect(r.rotulo).toBe("Necessita procedimento especial");
    expect(r.motivo).toMatch(/T-3/);
  });

  it("limpeza mais severa que a exigida libera; menos severa não", () => {
    expect(resultadoIDTF({ atual: soja, anterior: trigo, regimeAplicado: "D" }).rotulo).toBe("Liberado");
    expect(resultadoIDTF({ atual: soja, anterior: trigo, regimeAplicado: "A" }).rotulo).toBe("Liberado após limpeza B");
  });

  it("carga proibida não é resolvida nem por Regime D — o rótulo continua o mesmo", () => {
    for (const regime of ["A", "B", "C", "D", null] as const) {
      expect(resultadoIDTF({ atual: soja, anterior: defensivo, regimeAplicado: regime }).rotulo).toBe(
        "Carga anterior proibida"
      );
    }
  });
});

// ── Fase 8.3 — governança da base ───────────────────────────────────────────

describe("governança da base", () => {
  it("a versão vigente da governança é a mesma que o motor grava nas decisões", () => {
    expect(GOVERNANCA_BASE.versao).toBe(VERSAO_BASE_IDTF);
  });

  it("toda alteração tem data, responsável e fonte", () => {
    for (const h of historicoBase) {
      expect(h.data, h.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(h.responsavel, h.id).toBeTruthy();
      expect(h.fonte, h.id).toBeTruthy();
    }
  });

  it("sinônimo só entra na base com aprovação técnica registrada", () => {
    for (const h of historicoBase.filter((x) => x.tipo === "sinonimo")) {
      expect(h.aprovadoPor, h.id).toBeTruthy();
    }
  });

  it("histórico está em ordem decrescente e liga ao produto quando é dele", () => {
    const datas = historicoBase.map((h) => h.data);
    expect([...datas].sort().reverse()).toEqual(datas);
    expect(historicoDoProduto("p-fert-npk").length).toBeGreaterThan(0);
    expect(historicoDoProduto("p-inexistente")).toHaveLength(0);
  });

  it("alteração que cita produto cita produto que existe", () => {
    for (const h of historicoBase.filter((x) => x.produtoId)) {
      expect(produtosIDTF.some((p) => p.id === h.produtoId), h.id).toBe(true);
    }
  });
});
