export type Pagina<T> = {
  itens: T[];
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
  inicio: number;
  fim: number;
};

export function paginar<T>(itens: T[], pagina = 1, porPagina = 25): Pagina<T> {
  const tamanho = porPagina > 0 ? porPagina : 25;
  const totalPaginas = Math.max(1, Math.ceil(itens.length / tamanho));
  const paginaSegura = Math.min(Math.max(1, Math.trunc(pagina) || 1), totalPaginas);
  const indice = (paginaSegura - 1) * tamanho;
  return {
    itens: itens.slice(indice, indice + tamanho),
    pagina: paginaSegura,
    porPagina: tamanho,
    total: itens.length,
    totalPaginas,
    inicio: itens.length ? indice + 1 : 0,
    fim: Math.min(indice + tamanho, itens.length),
  };
}
