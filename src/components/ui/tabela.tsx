'use client';
import Link from 'next/link';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Botao } from './botao';
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

/*
 * Cabeçalho. `fixo` gruda no topo da área que rola (moldura: .mo-conteudo). Dentro de Cartao lista
 * funciona porque o cartão usa overflow: clip. `colunas` desenha as colunas a partir de dados; ou
 * passe TabelaColuna como filhos. Texto simples como filho continua valendo (vira columnheader).
 */
export type ColunaTabela = {
  k: string;
  rotulo: ReactNode;
  ordenavel?: boolean;
  ordem?: Ordem;
  aoOrdenar?: () => void;
  alinhar?: 'inicio' | 'fim';
  /** Rótulo só para leitor de tela (coluna de checkbox ou de menu). */
  rotuloLeitor?: string;
};
export function TabelaCabecalho({ fixo, colunas, className, children, ...p }: Div & { fixo?: boolean; colunas?: ColunaTabela[] }) {
  return (
    <div role="row" className={cx('tx-tabela__cab', fixo && 'tx-tabela__cab--fixo', className)} {...p}>
      {colunas ? colunas.map(({ k, rotulo, ...c }) => <TabelaColuna key={k} {...c}>{rotulo}</TabelaColuna>) : children}
    </div>
  );
}

export type Ordem = 'asc' | 'desc' | null;
const SETA_ORDEM = (o: Ordem) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {o === 'asc' ? <path d="M5 8.5V1.5M2 4.5l3-3 3 3" /> : o === 'desc' ? <path d="M5 1.5v7M2 5.5l3 3 3-3" /> : <path d="M3 3.5 5 1.5l2 2M3 6.5l2 2 2-2" />}
  </svg>
);

/**
 * Coluna do cabeçalho. Ordenável: o rótulo vira botão; aria-sort diz a ordem atual ao leitor de tela;
 * a seta aparece cheia na coluna ordenada e apagada (no hover e no foco) nas outras.
 * Ciclo sugerido para aoOrdenar: null -> asc -> desc -> asc (a tela decide).
 */
export function TabelaColuna({ ordenavel, ordem = null, aoOrdenar, alinhar, rotuloLeitor, className, children, ...p }: Omit<Div, 'children'> & Omit<ColunaTabela, 'k' | 'rotulo'> & { children?: ReactNode }) {
  const sort = ordenavel ? (ordem === 'asc' ? 'ascending' : ordem === 'desc' ? 'descending' : 'none') : undefined;
  return (
    <span role="columnheader" aria-sort={sort} className={cx('tx-tabela__col', alinhar === 'fim' && 'tx-tabela__col--fim', className)} {...p}>
      {ordenavel ? (
        <button type="button" className="tx-tabela__ordenar" onClick={aoOrdenar} data-ordem={ordem || undefined}>
          {children}
          <span className="tx-tabela__seta-ordem">{SETA_ORDEM(ordem)}</span>
        </button>
      ) : rotuloLeitor ? (
        <>{children}<span className="tx-so-leitor">{rotuloLeitor}</span></>
      ) : (
        children
      )}
    </span>
  );
}

/** Próxima ordem no ciclo padrão: null ou desc -> asc; asc -> desc. */
export function proximaOrdem(o: Ordem): Exclude<Ordem, null> {
  return o === 'asc' ? 'desc' : 'asc';
}

/*
 * Caixa de seleção de linha (ou do cabeçalho, com `misto` para "algumas marcadas"). Não deixa o
 * clique chegar à linha. rotulo é obrigatório: "Pôr OC 48134 na amostra", "Selecionar todas".
 */
export function CelulaSelecao({ marcada, misto, aoMudar, rotulo, desabilitada }: { marcada: boolean; misto?: boolean; aoMudar: (v: boolean) => void; rotulo: string; desabilitada?: boolean }) {
  return (
    <span className="tx-tabela__selecao" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <label className="tx-check tx-check--so">
        <input
          type="checkbox"
          className="tx-check__input"
          checked={marcada}
          disabled={desabilitada}
          aria-label={rotulo}
          aria-checked={misto ? 'mixed' : marcada}
          ref={(el) => { if (el) el.indeterminate = !!misto; }}
          onChange={(e) => aoMudar(e.target.checked)}
        />
        <span className="tx-check__caixa" aria-hidden>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {misto ? <path d="M3 6h6" /> : <path d="M2.5 6.2 5 8.6l4.5-5" />}
          </svg>
        </span>
      </label>
    </span>
  );
}

/** Seta › no fim da linha clicável; aparece no hover e no foco da linha. */
export function SetaLinha() {
  return <span className="tx-tabela__seta" aria-hidden>›</span>;
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

/*
 * BarraSelecao: aparece quando há linhas marcadas e gruda no rodapé da área que rola.
 * "3 selecionados  [Exportar] [Convidar]  Limpar seleção". Some com quantidade 0.
 */
export function BarraSelecao({ quantidade, texto, acoes, aoLimpar, rotuloLimpar = 'Limpar seleção', fixo = true, className }: {
  quantidade: number;
  /** Texto no lugar de "N selecionados": "3 viagens na amostra". */
  texto?: ReactNode;
  acoes?: ReactNode;
  aoLimpar?: () => void;
  rotuloLimpar?: string;
  fixo?: boolean;
  className?: string;
}) {
  if (quantidade <= 0) return null;
  return (
    <div role="region" aria-label="Ações da seleção" className={cx('tx-selecao', fixo && 'tx-selecao--fixa', className)}>
      <span className="tx-selecao__texto" aria-live="polite">
        {texto ?? <><b className="num">{quantidade}</b> {quantidade === 1 ? 'selecionado' : 'selecionados'}</>}
      </span>
      {acoes ? <span className="tx-selecao__acoes">{acoes}</span> : null}
      {aoLimpar ? <Botao variante="texto" onClick={aoLimpar} className="tx-selecao__limpar">{rotuloLimpar}</Botao> : null}
    </div>
  );
}
