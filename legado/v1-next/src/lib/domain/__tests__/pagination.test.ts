import { describe, expect, it } from "vitest";
import { paginar } from "@/lib/domain/pagination";

describe("paginação de listas", () => {
  const dados = Array.from({ length: 80 }, (_, i) => i + 1);

  it("pagina depois do filtro e preserva a contagem completa", () => {
    const filtrados = dados.filter((n) => n % 2 === 0);
    const p = paginar(filtrados, 2, 25);
    expect(p.total).toBe(40);
    expect(p.itens).toHaveLength(15);
    expect(p.inicio).toBe(26);
    expect(p.fim).toBe(40);
  });

  it("corrige página fora do intervalo quando o filtro reduz o conjunto", () => {
    const p = paginar(dados.slice(0, 3), 9, 25);
    expect(p.pagina).toBe(1);
    expect(p.itens).toEqual([1, 2, 3]);
  });

  it("mantém ordem determinística em mil registros", () => {
    const mil = Array.from({ length: 1_000 }, (_, i) => `item-${i + 1}`);
    expect(paginar(mil, 40, 25).itens).toEqual(mil.slice(975, 1_000));
  });
});
