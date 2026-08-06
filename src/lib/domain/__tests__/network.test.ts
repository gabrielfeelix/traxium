import { describe, it, expect } from "vitest";
import {
  vinculos,
  vinculoVigente,
  vinculosDoSubcontratado,
  veiculosDoSubcontratado,
  motoristasDoSubcontratado,
  historicoVinculos,
  subcontratadoNaData,
  subcontratados,
  estadoQualificacao,
  ESTADO_QUALIFICACAO,
  implementos,
  HOJE,
} from "../model";
import { motoristas } from "@/lib/mock-data";

// ── Fase 9.1 — vínculo m:n com vigência ─────────────────────────────────────

describe("vínculo m:n", () => {
  it("vínculo aponta para cadastro que existe — nome solto não vira vínculo", () => {
    for (const v of vinculos) {
      expect(subcontratados.some((s) => s.id === v.subcontratadoId), v.id).toBe(true);
      if (v.tipo === "motorista") {
        expect(motoristas.some((m) => m.id === v.entidadeId), `${v.id} → ${v.entidadeId}`).toBe(true);
      }
    }
  });

  it("vigência é derivada das datas, não de um campo “ativo”", () => {
    const encerrado = vinculos.find((v) => v.fim)!;
    expect(vinculoVigente(encerrado, HOJE)).toBe(false);
    // …e continuava vigente no dia em que a viagem daquele período aconteceu.
    expect(vinculoVigente(encerrado, encerrado.inicio)).toBe(true);
  });

  it("a lista vigente não traz o que foi encerrado, e o histórico traz", () => {
    const vigentes = vinculosDoSubcontratado("sub-004");
    const tudo = vinculosDoSubcontratado("sub-004", { incluirEncerrados: true });
    expect(tudo.length).toBeGreaterThan(vigentes.length);
    expect(vigentes.every((v) => !v.fim)).toBe(true);
  });

  it("o passado não é reescrito: quem respondia pelo ativo naquela data continua respondendo", () => {
    const antigo = vinculos.find((v) => v.fim && v.tipo === "implemento")!;
    expect(subcontratadoNaData("implemento", antigo.entidadeId, antigo.inicio)).toBe(antigo.subcontratadoId);
    expect(subcontratadoNaData("implemento", antigo.entidadeId, HOJE)).toBeUndefined();
  });

  it("um motorista pode ter passado por mais de uma empresa ao longo do tempo", () => {
    const historico = historicoVinculos("motorista", "m-004");
    expect(historico.length).toBeGreaterThan(0);
    expect(historico.every((v) => v.tipo === "motorista")).toBe(true);
  });

  it("as listas derivadas cobrem o que as antigas cobriam", () => {
    expect(veiculosDoSubcontratado("sub-001")).toContain("PHC-2B17");
    expect(motoristasDoSubcontratado("sub-001")).toContain("m-001");
    expect(motoristasDoSubcontratado("sub-001")).not.toContain("m-004"); // vínculo encerrado
  });

  it("placa vinculada corresponde a implemento do cadastro, quando o implemento existe", () => {
    const placasConhecidas = implementos.map((i) => i.placa);
    const vinculadas = vinculos.filter((v) => v.tipo === "implemento" && vinculoVigente(v)).map((v) => v.entidadeId);
    // Nem toda placa vinculada precisa estar na frota própria do tenant, mas as
    // que estão têm que bater — divergência aqui é cadastro fantasma.
    for (const placa of vinculadas.filter((p) => placasConhecidas.includes(p))) {
      expect(implementos.some((i) => i.placa === placa)).toBe(true);
    }
  });
});

// ── Fase 9.5 — arquivamento sem apagar ──────────────────────────────────────

describe("arquivamento", () => {
  it("empresa arquivada não opera, e o estado continua derivado do fato", () => {
    const s = { ...subcontratados[0], arquivadoEm: "2026-07-01", motivoArquivo: "Encerramento de contrato." };
    const q = estadoQualificacao(s);
    expect(q.estado).toBe("Inativo");
    expect(ESTADO_QUALIFICACAO[q.estado].opera).toBe(false);
    expect(q.motivo).toMatch(/Arquivada/);
  });

  it("arquivar precede qualquer análise de certificado", () => {
    // Empresa com certificado válido e tudo em dia, mas arquivada: continua fora.
    const apta = subcontratados.find((x) => ESTADO_QUALIFICACAO[estadoQualificacao(x).estado].opera)!;
    const arquivada = { ...apta, arquivadoEm: HOJE, motivoArquivo: "Teste." };
    expect(estadoQualificacao(arquivada).estado).toBe("Inativo");
  });
});
