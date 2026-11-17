'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Trilha, type PassoTrilha } from './navegacao';
import { cx } from './util';

/*
 * CabecalhoPagina em três formas, uma por arquétipo de tela (12-revisao-ux, Top 2 regra 2):
 *
 *  mesa     Hoje. Saudação curta + data na mesma linha; à direita o filtro de filial e a ação primária.
 *  lista    Viagens, Transportadores, Frota, Fornecedores. Título + contagem em texto secundário,
 *           busca e ação primária numa faixa só; os filtros rápidos na linha de baixo. Sem subtítulo.
 *  detalhe  Viagem, Compartimento. Trilha + objeto (OC, placa) em mono grande + estado + ação
 *           primária; `meta` e `passos` embaixo. Com `fixo`, gruda no topo e, depois de 120 px de
 *           rolagem, encolhe para uma barra de 56 px com objeto, estado e ação.
 *
 * Sem `variante`, é o cabeçalho antigo (título, subtítulo, ações): as telas que já usam não mudam.
 */
type Base = { titulo: ReactNode; acoes?: ReactNode; className?: string };
export type CabecalhoPaginaProps =
  | (Base & { variante?: undefined; sub?: ReactNode })
  | (Base & { variante: 'mesa'; data?: ReactNode; filtro?: ReactNode; sub?: ReactNode })
  | (Base & { variante: 'lista'; contagem?: ReactNode; busca?: ReactNode; filtros?: ReactNode })
  | (Base & {
      variante: 'detalhe';
      trilha?: PassoTrilha[];
      /** Situacao em selo ou Badge. */
      estado?: ReactNode;
      /** Linha de baixo: produto, horário, rota. */
      meta?: ReactNode;
      /** Faixa extra embaixo (passo a passo, placas). Some na barra encolhida. */
      passos?: ReactNode;
      /** Objeto em fonte mono (OC, placa). Padrão true. */
      mono?: boolean;
      fixo?: boolean;
    });

export function CabecalhoPagina(props: CabecalhoPaginaProps) {
  if (props.variante === 'mesa') {
    const { titulo, data, filtro, sub, acoes, className } = props;
    return (
      <div className={cx('tx-pagina-cab', 'tx-pagina-cab--mesa', className)}>
        <div className="tx-pagina-cab__titulos">
          <h1 className="tx-pagina-cab__titulo">
            {titulo}
            {data ? <span className="tx-pagina-cab__data">{data}</span> : null}
          </h1>
          {sub ? <div className="tx-pagina-cab__sub">{sub}</div> : null}
        </div>
        {filtro || acoes ? <div className="tx-pagina-cab__acoes">{filtro}{acoes}</div> : null}
      </div>
    );
  }
  if (props.variante === 'lista') {
    const { titulo, contagem, busca, filtros, acoes, className } = props;
    return (
      <div className={cx('tx-pagina-cab', 'tx-pagina-cab--lista', className)}>
        <div className="tx-pagina-cab__faixa">
          <h1 className="tx-pagina-cab__titulo">
            {titulo}
            {contagem != null ? <span className="tx-pagina-cab__contagem num">{contagem}</span> : null}
          </h1>
          {busca ? <div className="tx-pagina-cab__busca">{busca}</div> : null}
          {acoes ? <div className="tx-pagina-cab__acoes">{acoes}</div> : null}
        </div>
        {filtros ? <div className="tx-pagina-cab__filtros">{filtros}</div> : null}
      </div>
    );
  }
  if (props.variante === 'detalhe') return <CabecalhoDetalhe {...props} />;
  const { titulo, sub, acoes, className } = props;
  return (
    <div className={cx('tx-pagina-cab', className)}>
      <div className="tx-pagina-cab__titulos">
        <h1 className="tx-pagina-cab__titulo">{titulo}</h1>
        {sub ? <div className="tx-pagina-cab__sub">{sub}</div> : null}
      </div>
      {acoes ? <div className="tx-pagina-cab__acoes">{acoes}</div> : null}
    </div>
  );
}

function CabecalhoDetalhe({ titulo, trilha, estado, meta, passos, acoes, mono = true, fixo, className }: Extract<CabecalhoPaginaProps, { variante: 'detalhe' }>) {
  const sentinela = useRef<HTMLDivElement>(null);
  const cab = useRef<HTMLDivElement>(null);
  const cheia = useRef(0);
  const [encolhido, setEncolhido] = useState(false);
  // Ao encolher, a diferença de altura vira margem embaixo: o resto da página não pula e a rolagem
  // não encurta (sem isso, perto do fim da página o cabeçalho piscaria entre os dois estados).
  useLayoutEffect(() => {
    const el = cab.current;
    if (!el) return;
    if (!encolhido) {
      el.style.marginBottom = '';
      cheia.current = el.offsetHeight;
    } else {
      el.style.marginBottom = Math.max(0, cheia.current - el.offsetHeight) + 'px';
    }
  }, [encolhido]);
  useEffect(() => {
    if (!fixo || !sentinela.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setEncolhido(!e.isIntersecting), { threshold: 0 });
    io.observe(sentinela.current);
    return () => io.disconnect();
  }, [fixo]);
  return (
    <>
      {fixo ? <div ref={sentinela} className="tx-pagina-cab__sentinela" aria-hidden /> : null}
      <div ref={cab} className={cx('tx-pagina-cab', 'tx-pagina-cab--detalhe', fixo && 'tx-pagina-cab--fixo', encolhido && 'tx-pagina-cab--encolhido', className)} data-encolhido={encolhido || undefined}>
        {trilha && trilha.length ? <Trilha passos={trilha} className="tx-pagina-cab__trilha" /> : null}
        <div className="tx-pagina-cab__faixa">
          <h1 className={cx('tx-pagina-cab__titulo', mono && 'tx-pagina-cab__titulo--mono')}>{titulo}</h1>
          {estado ? <span className="tx-pagina-cab__estado">{estado}</span> : null}
          {acoes ? <div className="tx-pagina-cab__acoes">{acoes}</div> : null}
        </div>
        {meta ? <div className="tx-pagina-cab__meta">{meta}</div> : null}
        {passos ? <div className="tx-pagina-cab__passos">{passos}</div> : null}
      </div>
    </>
  );
}
