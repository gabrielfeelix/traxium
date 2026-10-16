import { describe, it, expect } from "vitest";
import {
  riscoGMP,
  evidenciasEssenciais,
  pendenciasDeResposta,
  triarViagem,
  automacao,
  triarViagens,
} from "../control-tower";
import { avaliarCarregamento } from "../rules-engine";
import { viagens } from "@/lib/mock-data";

// ── Fase 7.5 — o painel da fila ─────────────────────────────────────────────

describe("risco GMP+", () => {
  it("carga sobre resíduo proibido é crítica: a falha não tem quem libere", () => {
    const r = riscoGMP(avaliarCarregamento("v-002"));
    expect(r.nivel).toBe("critico");
    expect(r.motivo).toMatch(/nenhuma autoridade libera/i);
    expect(r.falhas).toBeGreaterThan(1);
  });

  it("viagem conforme não tem risco aberto", () => {
    const r = riscoGMP(avaliarCarregamento("v-001"));
    expect(r.nivel).toBe("nenhum");
    expect(r.falhas).toBe(0);
  });

  it("crítico é qualidade da falha, não quantidade", () => {
    // v-002 falha em várias condições, e o que a torna crítica é a técnica —
    // se contássemos falhas, uma viagem com seis pendências corrigíveis
    // pareceria mais perigosa do que uma com carga proibida.
    const critico = riscoGMP(avaliarCarregamento("v-002"));
    const semTecnica = riscoGMP({
      ...avaliarCarregamento("v-001"),
      checagens: avaliarCarregamento("v-001").checagens.map((c) =>
        c.regra === "fotos_minimas" ? { ...c, ok: false } : c
      ),
    });
    expect(critico.nivel).toBe("critico");
    expect(semTecnica.nivel).not.toBe("critico");
    expect(semTecnica.falhas).toBeLessThan(critico.falhas);
  });
});

describe("evidências essenciais", () => {
  it("são sempre as mesmas seis, na mesma ordem", () => {
    const a = evidenciasEssenciais("v-001").map((e) => e.chave);
    const b = evidenciasEssenciais("v-002").map((e) => e.chave);
    expect(a).toEqual(["t3", "limpeza", "inspecao", "fotos", "assinatura", "documentos"]);
    expect(b).toEqual(a);
  });

  it("viagem conforme tem as seis evidências", () => {
    expect(evidenciasEssenciais("v-001").every((e) => e.ok)).toBe(true);
  });

  it("evidência ausente aparece como ausente, com o motivo", () => {
    const ev = evidenciasEssenciais("v-002");
    const limpeza = ev.find((e) => e.chave === "limpeza")!;
    const fotos = ev.find((e) => e.chave === "fotos")!;
    expect(limpeza.ok).toBe(false);
    expect(limpeza.detalhe).toMatch(/Nenhuma/i);
    expect(fotos.ok).toBe(false);
    expect(fotos.detalhe).toContain("2 de 6");
  });

  it("viagem sem documento emitido não finge que tem", () => {
    const docs = evidenciasEssenciais("v-006").find((e) => e.chave === "documentos")!;
    expect(docs.ok).toBe(false);
    expect(docs.detalhe).toMatch(/Nenhum/i);
  });
});

describe("pendências de resposta", () => {
  it("exceção sem decisão espera alguém, com a data da solicitação", () => {
    const p = pendenciasDeResposta("v-002");
    const exc = p.find((x) => x.rotulo.startsWith("Exceção"));
    expect(exc).toBeDefined();
    expect(exc!.desde).toBe("2026-05-25T14:40:00");
  });

  it("evidência offline entra como pendente de sincronização", () => {
    expect(pendenciasDeResposta("v-002").some((p) => /sincroniza/i.test(p.rotulo))).toBe(true);
  });

  it("viagem conforme não tem nada pendente de resposta", () => {
    expect(pendenciasDeResposta("v-001")).toHaveLength(0);
  });
});

// ── Regressão da automação (armadilha #2 do HANDOFF) ────────────────────────

describe("taxa de automação", () => {
  it("mede sobre tudo que está em rota, e o valor do protótipo é 40%", () => {
    const a = automacao(triarViagens(viagens));
    expect(a.pct).toBe(40);
    expect(a.auto + a.humano + a.pendente).toBe(a.total);
  });

  it("verde do motor é liberação sem humano; verde por exceção não conta como automação", () => {
    const t = triarViagem(viagens.find((v) => v.id === "v-001")!);
    expect(t.faixa).toBe("verde");
    expect(t.liberadaPor).toBe("motor");
    expect(t.automatica).toBe(true);
  });
});
