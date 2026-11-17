import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge, type BadgeTom } from './situacao';
import { cx } from './util';

/*
 * Abas: trocam a visão de uma mesma lista. Com onClick, cada aba é um <button role="tab"> com
 * aria-selected; com href, é um link com aria-current="page" (aba que muda a URL).
 * O contador só aparece com q > 0 e é âmbar (pendência) por padrão.
 */
export type Aba = { k: string; n: ReactNode; q?: number; qTom?: BadgeTom; ativa?: boolean; onClick?: () => void; href?: string; depois?: ReactNode };

export function Abas({ itens, rotulo, className }: { itens: Aba[]; rotulo: string; className?: string }) {
  const navega = itens.some((a) => a.href);
  return (
    <div role={navega ? undefined : 'tablist'} aria-label={rotulo} className={cx('tx-abas', className)}>
      {itens.map((a) => {
        const miolo = (
          <>
            {a.n}
            {a.q ? <Badge tom={a.qTom || 'aviso'} contador>{a.q}</Badge> : null}
            {a.depois}
          </>
        );
        if (a.href)
          return (
            <Link key={a.k} href={a.href} className="tx-aba" aria-current={a.ativa ? 'page' : undefined} data-tx-aba={a.k}>
              {miolo}
            </Link>
          );
        return (
          <button key={a.k} type="button" role="tab" aria-selected={!!a.ativa} className="tx-aba" onClick={a.onClick} data-tx-aba={a.k}>
            {miolo}
          </button>
        );
      })}
    </div>
  );
}
