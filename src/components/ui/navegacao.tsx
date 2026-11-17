'use client';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { CampoData } from './campo';
import { cx } from './util';

/*
 * Trilha (breadcrumb), Segmentado (escolha exclusiva compacta) e PeriodoAtalhos.
 */

export type PassoTrilha = { rotulo: ReactNode; href?: string };
/** "Viagens › OC 48130". O último passo é a página atual (sem link, aria-current). */
export function Trilha({ passos, className }: { passos: PassoTrilha[]; className?: string }) {
  return (
    <nav aria-label="Você está em" className={cx('tx-trilha', className)}>
      <ol>
        {passos.map((p, i) => {
          const ultimo = i === passos.length - 1;
          return (
            <Fragment key={i}>
              <li>
                {ultimo || !p.href ? (
                  <span aria-current={ultimo ? 'page' : undefined}>{p.rotulo}</span>
                ) : (
                  <Link href={p.href}>{p.rotulo}</Link>
                )}
              </li>
              {ultimo ? null : <li aria-hidden className="tx-trilha__sep">›</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/*
 * Segmentado: 2 a 4 opções exclusivas lado a lado ("Bloqueia | Só alerta", "TAC | ETC").
 * O escolhido fica em fundo branco elevado; os outros, texto. role=radiogroup com setas.
 */
export type OpcaoSegmentado = { k: string; rotulo: ReactNode; inativo?: boolean };
export function Segmentado({ opcoes, valor, aoMudar, rotulo, tamanho = 'm', className }: {
  opcoes: OpcaoSegmentado[];
  valor: string;
  aoMudar: (k: string) => void;
  /** aria-label do grupo: "Quando falhar". */
  rotulo: string;
  tamanho?: 'p' | 'm';
  className?: string;
}) {
  const ativas = opcoes.filter((o) => !o.inativo);
  const mover = (grupo: HTMLElement, d: number) => {
    const i = ativas.findIndex((o) => o.k === valor);
    const n = ativas[(i + d + ativas.length) % ativas.length];
    if (!n) return;
    aoMudar(n.k);
    grupo.querySelector<HTMLElement>('[data-k="' + n.k + '"]')?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={rotulo}
      className={cx('tx-segmentado', tamanho === 'p' && 'tx-segmentado--p', className)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(e.currentTarget, 1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(e.currentTarget, -1); }
      }}
    >
      {opcoes.map((o) => {
        const on = o.k === valor;
        return (
          <button
            key={o.k}
            type="button"
            role="radio"
            aria-checked={on}
            aria-disabled={o.inativo || undefined}
            tabIndex={on ? 0 : -1}
            className="tx-segmentado__opcao"
            onClick={() => { if (!o.inativo) aoMudar(o.k); }}
            data-k={o.k}
          >
            {o.rotulo}
          </button>
        );
      })}
    </div>
  );
}

/*
 * PeriodoAtalhos: atalhos de período em chips e, em "Personalizado", duas datas DD/MM/AAAA.
 * Sem estado: a tela guarda o atalho escolhido e as datas. Calcule o intervalo com o atalho.
 */
export type AtalhoPeriodo = { k: string; rotulo: ReactNode };
export const ATALHOS_PERIODO: AtalhoPeriodo[] = [
  { k: '30d', rotulo: 'Últimos 30 dias' },
  { k: '90d', rotulo: 'Últimos 90 dias' },
  { k: 'personalizado', rotulo: 'Personalizado' },
];
export function PeriodoAtalhos({ atalhos = ATALHOS_PERIODO, valor, aoMudar, de, ate, aoMudarDe, aoMudarAte, rotulo = 'Período', id = 'tx-periodo', className }: {
  atalhos?: AtalhoPeriodo[];
  valor: string;
  aoMudar: (k: string) => void;
  de?: string;
  ate?: string;
  aoMudarDe?: (v: string) => void;
  aoMudarAte?: (v: string) => void;
  rotulo?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cx('tx-periodo', className)} role="group" aria-labelledby={id + '-rot'}>
      <span id={id + '-rot'} className="tx-periodo__rotulo">{rotulo}</span>
      <div className="tx-filtros">
        {atalhos.map((a) => (
          <button key={a.k} type="button" className="tx-chip tx-chip--filtro" aria-pressed={valor === a.k} onClick={() => aoMudar(a.k)}>
            {a.rotulo}
          </button>
        ))}
      </div>
      {valor === 'personalizado' && aoMudarDe && aoMudarAte ? (
        <span className="tx-periodo__datas">
          <CampoData valor={de || ''} aoMudar={aoMudarDe} aria-label="Data inicial" className="tx-periodo__data" />
          <span aria-hidden>a</span>
          <CampoData valor={ate || ''} aoMudar={aoMudarAte} aria-label="Data final" className="tx-periodo__data" />
        </span>
      ) : null}
    </div>
  );
}
