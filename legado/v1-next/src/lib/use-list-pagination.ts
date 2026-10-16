"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { paginar } from "@/lib/domain/pagination";

export function useListPagination<T>(itens: T[], resetKey: string, paramPrefix = "") {
  const pageParam = `${paramPrefix}pagina`;
  const sizeParam = `${paramPrefix}porPagina`;
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(25);
  const iniciou = useRef(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const p = Number(query.get(pageParam));
    const tamanho = Number(query.get(sizeParam));
    if (Number.isFinite(p) && p > 1) setPagina(Math.trunc(p));
    if (tamanho === 25 || tamanho === 50) setPorPagina(tamanho);
    iniciou.current = true;
  }, [pageParam, sizeParam]);

  useEffect(() => {
    if (!iniciou.current) return;
    const query = new URLSearchParams(window.location.search);
    pagina > 1 ? query.set(pageParam, String(pagina)) : query.delete(pageParam);
    porPagina !== 25 ? query.set(sizeParam, String(porPagina)) : query.delete(sizeParam);
    const nova = `${window.location.pathname}${query.size ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nova);
  }, [pagina, porPagina, pageParam, sizeParam]);

  useEffect(() => setPagina(1), [resetKey]);

  const resultado = useMemo(() => paginar(itens, pagina, porPagina), [itens, pagina, porPagina]);

  useEffect(() => {
    if (resultado.pagina !== pagina) setPagina(resultado.pagina);
  }, [pagina, resultado.pagina]);

  return {
    ...resultado,
    setPagina,
    setPorPagina: (valor: number) => { setPorPagina(valor); setPagina(1); },
  };
}
