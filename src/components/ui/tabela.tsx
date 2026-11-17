import Link from 'next/link';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

/*
 * Tabela: lista em grade (display: grid), não <table>. A tela define as colunas uma vez em
 * `colunas` (vira a variável --tx-colunas) e o cabeçalho e as linhas herdam.
 * A linha inteira é o alvo: com href vira link (next/link), com onClick vira role="button".
 */
type Div = HTMLAttributes<HTMLDivElement>;

export function Tabela({ colunas, rotulo, className, style, children, ...p }: Div & { colunas: string; rotulo?: string }) {
  return (
    <div role="table" aria-label={rotulo} className={cx('tx-tabela', className)} style={{ ...style, '--tx-colunas': colunas } as CSSProperties} {...p}>
      {children}
    </div>
  );
}

export function TabelaCabecalho({ className, children, ...p }: Div) {
  return (
    <div role="row" className={cx('tx-tabela__cab', className)} {...p}>
      {children}
    </div>
  );
}

export function TabelaLinha({ href, onClick, selecionada, className, children, ...p }: Div & { href?: string; selecionada?: boolean }) {
  const classe = cx('tx-tabela__linha', className);
  const sel = selecionada ? { 'aria-selected': true as const } : {};
  if (href) {
    return (
      <Link href={href} className={classe} role="row" {...sel} {...(p as object)}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} className={classe} onClick={onClick} {...sel} {...p}>
        {children}
      </div>
    );
  }
  return (
    <div role="row" className={classe} {...sel} {...p}>
      {children}
    </div>
  );
}

/* Duas linhas de texto numa célula: forte em cima, legenda apagada embaixo. */
export function Celula({ forte, sub, mono, className }: { forte: ReactNode; sub?: ReactNode; mono?: boolean; className?: string }) {
  return (
    <span className={cx('tx-tabela__celula', className)}>
      <span className={mono ? 'tx-tabela__codigo' : 'tx-tabela__forte'}>{forte}</span>
      {sub ? <span className="tx-tabela__sub">{sub}</span> : null}
    </span>
  );
}

export function TabelaEsqueleto({ linhas = 3 }: { linhas?: number }) {
  return (
    <div className="tx-tabela__esqueleto" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <span key={i} className="tx-esqueleto" />
      ))}
    </div>
  );
}

export function TabelaRodape({ className, children, ...p }: Div) {
  return (
    <div className={cx('tx-tabela__rodape', className)} {...p}>
      {children}
    </div>
  );
}
