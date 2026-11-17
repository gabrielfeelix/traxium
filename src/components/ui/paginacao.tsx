import { cx } from './util';

/*
 * Paginacao: "mostrando 1 a 25 de 128 viagens" e as páginas. Some a navegação com uma página só.
 * Recebe os números; quem guarda a página atual é a tela (TX.ui.paginar continua servindo).
 */
export function Paginacao({ pagina, total, info, aoIr, className }: { pagina: number; total: number; info: string; aoIr: (n: number) => void; className?: string }) {
  return (
    <nav className={cx('tx-paginacao', className)} aria-label="Paginação">
      <span className="tx-paginacao__info" aria-live="polite">{info}</span>
      {total > 1 ? (
        <span className="tx-paginacao__paginas">
          <button type="button" className="tx-paginacao__seta" disabled={pagina <= 1} onClick={() => aoIr(pagina - 1)} aria-label="Página anterior">‹</button>
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className="tx-paginacao__pag num" aria-current={n === pagina ? 'page' : undefined} onClick={() => aoIr(n)}>
              {n}
            </button>
          ))}
          <button type="button" className="tx-paginacao__seta" disabled={pagina >= total} onClick={() => aoIr(pagina + 1)} aria-label="Próxima página">›</button>
        </span>
      ) : null}
    </nav>
  );
}
