import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

/*
 * Botao: um <button> de verdade, ou um link (<a>, via next/link quando o destino é interno) quando
 * recebe href. Classes: .tx-botao + .tx-botao--{variante} + .tx-botao--p.
 *
 * inativo: o obrigatório ainda não está preenchido. Fica apagado (aria-disabled), mas continua
 *   focável e o clique ainda chega ao onClick, que leva ao campo que falta (padrão "Falta:").
 * desabilitado: não há ação possível (disabled nativo). Não recebe foco nem clique.
 */
export type BotaoVariante = 'primario' | 'secundario' | 'contorno' | 'perigo' | 'texto' | 'icone';
export type BotaoTamanho = 'p' | 'm';

type Comum = {
  variante?: BotaoVariante;
  tamanho?: BotaoTamanho;
  inativo?: boolean;
  desabilitado?: boolean;
  carregando?: boolean;
  /** Ícone antes do texto. No variante "icone" é o próprio conteúdo. */
  icone?: ReactNode;
  largo?: boolean;
  children?: ReactNode;
};
export type BotaoProps = Comum &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
  );

export function classeBotao(o: { variante?: BotaoVariante; tamanho?: BotaoTamanho; carregando?: boolean; largo?: boolean } = {}) {
  return cx(
    'tx-botao',
    'tx-botao--' + (o.variante || 'secundario'),
    o.tamanho === 'p' && 'tx-botao--p',
    o.carregando && 'tx-botao--carregando',
    o.largo && 'tx-botao--largo',
  );
}

export function Botao(props: BotaoProps) {
  const { variante = 'secundario', tamanho = 'm', inativo, desabilitado, carregando, icone, largo, className, children, ...resto } = props;
  const classe = cx(classeBotao({ variante, tamanho, carregando, largo }), className);
  const conteudo = (
    <>
      {carregando ? <span className="tx-botao__giro" aria-hidden /> : null}
      {icone}
      {children != null ? <span>{children}</span> : null}
    </>
  );
  const aria = {
    'aria-disabled': inativo || desabilitado || undefined,
    'aria-busy': carregando || undefined,
  };
  if ('href' in resto && resto.href !== undefined) {
    const { href, ...a } = resto as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    if (desabilitado) return <a className={classe} {...a} {...aria} role="link">{conteudo}</a>;
    if (href.startsWith('/') && a.target !== '_blank') return <Link href={href} className={classe} {...a} {...aria}>{conteudo}</Link>;
    return <a href={href} className={classe} {...a} {...aria}>{conteudo}</a>;
  }
  const { type, ...b } = resto as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type || 'button'} className={classe} disabled={desabilitado} {...b} {...aria}>
      {conteudo}
    </button>
  );
}
