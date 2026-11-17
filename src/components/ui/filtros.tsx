'use client';
import type { ReactNode } from 'react';
import { Botao } from './botao';
import { cx } from './util';

/*
 * Filtros de lista, sem estado: a tela guarda busca, filtro ativo e contagens (e a URL, se quiser).
 *  CampoBusca: campo com lupa e botão de limpar. Debounce, se houver, é da tela.
 *  Filtros: chips de filtro rápido com contagem ("Documento a vencer 2"). aria-pressed.
 *  BarraFiltros: a faixa de lista: busca à esquerda, chips, e controles extras à direita
 *    (Periodo, Selecao de filial, Segmentado TAC | ETC).
 */
const LUPA = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" strokeLinecap="round" />
  </svg>
);
const LIMPAR = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
  </svg>
);

export type BuscaProps = {
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
  /** Rótulo para o leitor de tela (aria-label). Padrão: o placeholder. */
  rotulo?: string;
  id?: string;
  className?: string;
};

export function CampoBusca({ valor, aoMudar, placeholder = 'Buscar', rotulo, id, className }: BuscaProps) {
  return (
    <div className={cx('tx-entrada-caixa', 'tx-busca', className)} role="search">
      {LUPA}
      <input
        id={id}
        type="search"
        value={valor}
        placeholder={placeholder}
        aria-label={rotulo || placeholder}
        onChange={(e) => aoMudar(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && valor) {
            e.stopPropagation();
            aoMudar('');
          }
        }}
      />
      {valor ? (
        <button type="button" className="tx-busca__limpar" aria-label="Limpar busca" onClick={() => aoMudar('')}>
          {LIMPAR}
        </button>
      ) : null}
    </div>
  );
}

export type FiltroChip = {
  k: string;
  rotulo: ReactNode;
  /** Quantos registros o filtro mostra. Some quando undefined. */
  contagem?: number;
  ativo?: boolean;
  aoClicar?: () => void;
  /** Contagem âmbar (pendência) em vez de neutra. */
  alerta?: boolean;
  inativo?: boolean;
};

export function Filtros({ itens, rotulo, className }: { itens: FiltroChip[]; rotulo: string; className?: string }) {
  return (
    <div role="group" aria-label={rotulo} className={cx('tx-filtros', className)}>
      {itens.map((f) => (
        <button
          key={f.k}
          type="button"
          className="tx-chip tx-chip--filtro tx-filtro"
          aria-pressed={!!f.ativo}
          aria-disabled={f.inativo || undefined}
          onClick={f.inativo ? undefined : f.aoClicar}
          data-tx-filtro={f.k}
        >
          {f.rotulo}
          {f.contagem != null ? <span className={cx('tx-filtro__n', 'num', f.alerta && f.contagem > 0 && 'tx-filtro__n--alerta')}>{f.contagem}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function BarraFiltros({ busca, filtros, rotuloFiltros = 'Filtros rápidos', depois, resultado, aoLimpar, className, children }: {
  busca?: BuscaProps;
  filtros?: FiltroChip[];
  rotuloFiltros?: string;
  /** Controles à direita: Periodo, Selecao de filial, Segmentado. */
  depois?: ReactNode;
  /** Linha de baixo, apagada: "26 viagens no período". */
  resultado?: ReactNode;
  /** Mostra "Limpar filtros" quando há algo ligado. */
  aoLimpar?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx('tx-barra-filtros', className)}>
      <div className="tx-barra-filtros__linha">
        {busca ? <CampoBusca {...busca} className={cx('tx-barra-filtros__busca', busca.className)} /> : null}
        {filtros && filtros.length ? <Filtros itens={filtros} rotulo={rotuloFiltros} /> : null}
        {children}
        {depois || aoLimpar ? (
          <span className="tx-barra-filtros__depois">
            {depois}
            {aoLimpar ? <Botao variante="texto" onClick={aoLimpar}>Limpar filtros</Botao> : null}
          </span>
        ) : null}
      </div>
      {resultado ? <div className="tx-barra-filtros__resultado" aria-live="polite">{resultado}</div> : null}
    </div>
  );
}
