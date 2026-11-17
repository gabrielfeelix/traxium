'use client';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { ReactElement, ReactNode } from 'react';
import { GLOSSARIO, PALAVRA_REGIME, type ChaveGlossario, type Regime } from './glossario';
import { cx } from './util';

/*
 * Dica: balão de texto curto (Radix Tooltip) que abre ao passar o ponteiro e ao focar com Tab.
 * O filho precisa ser focável (button, a, ou um elemento com tabIndex). Máximo 280 px de largura.
 * Termo: palavra técnica com sublinhado pontilhado e a explicação do GLOSSARIO na dica.
 * SeloRegime: o selo de regime de limpeza (A, B, C, D, X) com a explicação do glossário.
 */
export function Dica({ conteudo, children, lado = 'top', atraso = 200 }: { conteudo: ReactNode; children: ReactElement; lado?: 'top' | 'right' | 'bottom' | 'left'; atraso?: number }) {
  if (conteudo == null || conteudo === '') return children;
  return (
    <Tooltip.Provider delayDuration={atraso} skipDelayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tx-dica-balao" side={lado} sideOffset={6} collisionPadding={8}>
            {conteudo}
            <Tooltip.Arrow className="tx-dica-balao__seta" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export type TermoProps = {
  /** Chave do GLOSSARIO ('T-3', 'IDTF', 'regime-A', 'gatekeeper', 'alcada'...). */
  termo: ChaveGlossario;
  /** Texto visível; sem ele, usa GLOSSARIO[termo].termo. */
  children?: ReactNode;
  className?: string;
};

/** Primeira ocorrência de um termo técnico na tela. As seguintes ficam texto normal. */
export function Termo({ termo, children, className }: TermoProps) {
  const v = GLOSSARIO[termo];
  return (
    <Dica conteudo={v.texto}>
      <span className={cx('tx-termo', className)} tabIndex={0}>
        {children ?? v.termo}
      </span>
    </Dica>
  );
}

/**
 * Selo do regime de limpeza. `palavra` escreve o nome ao lado da letra ("A seco") quando há espaço;
 * sem ela, só a letra, e a dica explica. Proibida (X) sai em vermelho; não definido (?) em tracejado.
 */
export function SeloRegime({ regime, palavra, className }: { regime: Regime; palavra?: boolean; className?: string }) {
  const v = GLOSSARIO[('regime-' + regime) as ChaveGlossario];
  return (
    <Dica conteudo={<><b>{v.termo}.</b> {v.texto}</>}>
      <span className={cx('tx-regime', regime === 'X' && 'tx-regime--proibida', regime === '?' && 'tx-regime--nd', className)} tabIndex={0} aria-label={v.termo + ': ' + v.texto}>
        <span className="tx-regime__letra" aria-hidden>{regime}</span>
        {palavra ? <span className="tx-regime__palavra" aria-hidden>{PALAVRA_REGIME[regime]}</span> : null}
      </span>
    </Dica>
  );
}
