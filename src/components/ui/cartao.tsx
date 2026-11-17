import Link from 'next/link';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

/*
 * Cartao: agrupa uma área de conteúdo da página. "lista" tira o padding (tabela dentro);
 * com href o cartão inteiro é link e ganha a sombra de hover.
 */
export type CartaoProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  titulo?: ReactNode;
  sub?: ReactNode;
  acoes?: ReactNode;
  lista?: boolean;
  href?: string;
  /** Elemento HTML do cartão (section quando tem título que a página lista). */
  como?: 'div' | 'section' | 'article';
};
export function Cartao({ titulo, sub, acoes, lista, href, como = 'div', className, children, ...p }: CartaoProps) {
  const classe = cx('tx-cartao', lista && 'tx-cartao--lista', href && 'tx-cartao--clicavel', className);
  const cab =
    titulo || acoes ? (
      <div className="tx-cartao__cab">
        <div className="tx-cartao__titulos">
          {titulo ? <h3 className="tx-cartao__titulo">{titulo}</h3> : null}
          {sub ? <div className="tx-cartao__sub">{sub}</div> : null}
        </div>
        {acoes ? <div className="tx-cartao__acoes">{acoes}</div> : null}
      </div>
    ) : null;
  const corpo = cab ? <div className="tx-cartao__corpo">{children}</div> : children;
  if (href)
    return (
      <Link href={href} className={classe}>
        {cab}
        {corpo}
      </Link>
    );
  const El = como;
  return (
    <El className={classe} {...p}>
      {cab}
      {corpo}
    </El>
  );
}

/* Par rótulo e valor dentro de cartão, drawer ou modal (era .mo-linha). */
export function Linha({ rotulo, children, className }: { rotulo: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx('tx-linha', className)}>
      <span>{rotulo}</span>
      {children}
    </div>
  );
}

/* CabecalhoPagina mora em cabecalho.tsx (três variantes). Reexportado para quem importa daqui. */
export { CabecalhoPagina, type CabecalhoPaginaProps } from './cabecalho';

/* Lista sem resultado: o título diz o que não há; o texto diz o que fazer. Sem ilustração. */
export function EstadoVazio({ titulo, children, acao }: { titulo: ReactNode; children?: ReactNode; acao?: ReactNode }) {
  return (
    <div className="tx-vazio" role="status">
      <h3 className="tx-vazio__titulo">{titulo}</h3>
      {children ? <p className="tx-vazio__texto">{children}</p> : null}
      {acao ? <div className="tx-vazio__acao">{acao}</div> : null}
    </div>
  );
}

/*
 * Aviso: alerta em linha, dentro da página ou do modal. Para bloqueio, sempre causa e ação.
 * role="alert" só para perigo e técnico (interrompe o leitor de tela); os outros são status.
 */
export type AvisoTom = 'info' | 'ok' | 'aviso' | 'perigo' | 'tecnico';
const ICONE: Record<AvisoTom, ReactNode> = {
  info: <path d="M6 5.4v3.4M6 3.3v.1" />,
  ok: <path d="M2.8 6.2 5 8.4l4.2-4.6" />,
  aviso: <path d="M6 2.8v3.8M6 8.9v.1" />,
  perigo: <path d="M6 2.8v3.8M6 8.9v.1" />,
  tecnico: <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />,
};
export function Aviso({ tom = 'info', titulo, acao, children, className }: { tom?: AvisoTom; titulo?: ReactNode; acao?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cx('tx-aviso', tom !== 'info' && 'tx-aviso--' + tom, className)} role={tom === 'perigo' || tom === 'tecnico' ? 'alert' : 'status'}>
      <span className="tx-aviso__icone" aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {ICONE[tom]}
        </svg>
      </span>
      <div className="tx-aviso__corpo">
        {titulo ? <strong className="tx-aviso__titulo">{titulo}</strong> : null}
        {children}
      </div>
      {acao ? <div className="tx-aviso__acao">{acao}</div> : null}
    </div>
  );
}
