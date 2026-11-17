import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './util';

/*
 * Situacao: resultado do motor de decisão (TX.decidir). Um tom por chave de TX.ui.TOM, um para um:
 *   ok          Pronta para assegurar          resultado "pronta"
 *   falta       Falta algo                     resultado "falta"
 *   bloqueio    Bloqueada                      resultado "bloqueada"
 *   tecnico     Bloqueio técnico               resultado "tecnico"
 *   autoridade  Liberada por autoridade        resultado "pronta" com porAutoridade
 *   na          Sem declaração GMP+ / cancelada resultado "nao_assegurada" ou "cancelada"
 *   info        Em trânsito / informativo      sem pendência
 * Sempre ponto, cor e rótulo juntos. Forma "ponto" na linha de tabela; "selo" (com borda) em
 * filtro, cabeçalho e lista curta.
 */
export type Tom = 'ok' | 'falta' | 'bloqueio' | 'tecnico' | 'autoridade' | 'na' | 'info';
export const TONS: Tom[] = ['ok', 'falta', 'bloqueio', 'tecnico', 'autoridade', 'na', 'info'];
export const ROTULO_TOM: Record<Tom, string> = {
  ok: 'Pronta para assegurar',
  falta: 'Falta algo',
  bloqueio: 'Bloqueada',
  tecnico: 'Bloqueio técnico',
  autoridade: 'Liberada por autoridade',
  na: 'Sem declaração GMP+',
  info: 'Em trânsito',
};
const RES: Record<string, Tom> = { pronta: 'ok', falta: 'falta', bloqueada: 'bloqueio', tecnico: 'tecnico', cancelada: 'na', nao_assegurada: 'na' };

/** Mesmo critério de TX.ui.tomResultado, devolvendo a chave do tom. */
export function tomDaDecisao(dec: { resultado: string; porAutoridade?: boolean }): Tom {
  if (dec.porAutoridade && dec.resultado === 'pronta') return 'autoridade';
  return RES[dec.resultado] || 'na';
}
export function classeSituacao(tom: Tom, forma: 'ponto' | 'selo' = 'ponto') {
  return cx('tx-situacao', 'tx-situacao--' + tom, forma === 'selo' && 'tx-situacao--selo');
}

export type SituacaoProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  tom: Tom;
  forma?: 'ponto' | 'selo';
  /** Texto; sem ele, usa o rótulo padrão do tom. */
  children?: ReactNode;
  /** Linha de baixo, só na forma ponto (o motivo: "Falta o laudo de limpeza"). */
  detalhe?: ReactNode;
};
export function Situacao({ tom, forma = 'ponto', children, detalhe, className, ...p }: SituacaoProps) {
  const el = (
    <span className={cx(classeSituacao(tom, forma), className)} {...p}>
      <span className="tx-situacao__ponto" aria-hidden />
      {children ?? ROTULO_TOM[tom]}
    </span>
  );
  if (!detalhe || forma === 'selo') return el;
  return (
    <span>
      {el}
      <span className="tx-situacao__detalhe">{detalhe}</span>
    </span>
  );
}

/*
 * Badge: selo de texto que não é situação da viagem (papel, código, responsável, contador).
 */
export type BadgeTom = 'neutro' | 'marca' | 'ok' | 'aviso' | 'perigo' | 'tecnico' | 'info' | 'autoridade';
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tom?: BadgeTom; mono?: boolean; contador?: boolean; cheio?: boolean };
export function classeBadge(o: { tom?: BadgeTom; mono?: boolean; contador?: boolean; cheio?: boolean } = {}) {
  return cx('tx-badge', o.tom && o.tom !== 'neutro' && 'tx-badge--' + o.tom, o.mono && 'tx-badge--mono', o.contador && 'tx-badge--contador', o.cheio && 'tx-badge--cheio');
}
export function Badge({ tom = 'neutro', mono, contador, cheio, className, ...p }: BadgeProps) {
  return <span className={cx(classeBadge({ tom, mono, contador, cheio }), className)} {...p} />;
}
