import type { InputHTMLAttributes, ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';
import { cx } from './util';

/*
 * Controles de escolha. Checkbox e Switch usam o <input type="checkbox"> nativo, escondido, e
 * desenham a caixa ou o trilho ao lado: teclado, leitor de tela e formulário funcionam sem JS.
 * Props nativas (checked, defaultChecked, onChange, disabled, name) passam direto para o input.
 */
type Marcavel = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { rotulo: ReactNode; dica?: ReactNode; invalido?: boolean };

const VISTO = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2.5 6.2 5 8.6l4.5-5" />
  </svg>
);

export function Checkbox({ rotulo, dica, invalido, className, style, ...p }: Marcavel) {
  return (
    <label className={cx('tx-check', className)} style={style}>
      <input type="checkbox" className="tx-check__input" aria-invalid={invalido || undefined} {...p} />
      <span className="tx-check__caixa" aria-hidden>{VISTO}</span>
      <span className="tx-check__texto">
        <span>{rotulo}</span>
        {dica ? <span className="tx-check__dica">{dica}</span> : null}
      </span>
    </label>
  );
}

export function Switch({ rotulo, dica, className, style, ...p }: Omit<Marcavel, 'invalido'>) {
  return (
    <label className={cx('tx-switch', className)} style={style}>
      <input type="checkbox" role="switch" className="tx-switch__input" {...p} />
      <span className="tx-switch__trilho" aria-hidden />
      <span className="tx-check__texto">
        <span>{rotulo}</span>
        {dica ? <span className="tx-check__dica">{dica}</span> : null}
      </span>
    </label>
  );
}

/*
 * Chip.
 *  tipo "opcao": uma opção de um grupo de rádio (role="radio", aria-checked). Use dentro de Escolhas.
 *  tipo "filtro": filtro de lista que liga e desliga (aria-pressed); escuro quando ligado.
 */
export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  tipo?: 'opcao' | 'filtro';
  selecionado?: boolean;
  inativo?: boolean;
};
export function Chip({ tipo = 'opcao', selecionado, inativo, className, children, ...p }: ChipProps) {
  const estado = tipo === 'opcao' ? { role: 'radio', 'aria-checked': !!selecionado } : { 'aria-pressed': !!selecionado };
  return (
    <button type="button" className={cx('tx-chip', tipo === 'filtro' && 'tx-chip--filtro', className)} aria-disabled={inativo || undefined} {...estado} {...p}>
      {children}
    </button>
  );
}

/* Grupo de rádio em chips com rótulo e erro. Mesma API do antigo formulario.tsx. */
export type Opcao = { n: ReactNode; on?: boolean; onClick?: () => void; k?: string; inativo?: boolean };
export function Escolhas({ id, rotulo, itens, erro, depois, style, className }: { id: string; rotulo: ReactNode; itens: Opcao[]; erro?: string; depois?: ReactNode; style?: CSSProperties; className?: string }) {
  const errId = id + '-erro';
  return (
    <div className={cx('tx-campo', className)} style={style}>
      <div id={id} className="tx-campo__rotulo">{rotulo}</div>
      <div role="radiogroup" aria-labelledby={id} aria-invalid={erro ? true : undefined} aria-describedby={erro ? errId : undefined} className="tx-escolhas" data-tx-grupo={id}>
        {itens.map((it, i) => (
          <Chip key={it.k || i} selecionado={!!it.on} inativo={it.inativo} onClick={it.onClick}>{it.n}</Chip>
        ))}
        {depois}
      </div>
      {erro ? <div id={errId} className="tx-campo__erro" role="alert">{erro}</div> : null}
    </div>
  );
}

/* Opção com título e descrição: rádio em cartão (era TX.ui.sel e .mo-op). Use dentro de um role="radiogroup". */
export function OpcaoCartao({ titulo, sub, selecionado, inativo, className, children, ...p }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'title'> & { titulo: ReactNode; sub?: ReactNode; selecionado?: boolean; inativo?: boolean }) {
  return (
    <button type="button" role="radio" aria-checked={!!selecionado} aria-disabled={inativo || undefined} className={cx('tx-opcao', className)} {...p}>
      <span className="tx-opcao__ponto" aria-hidden />
      <span className="tx-opcao__texto">
        <span className="tx-opcao__titulo">{titulo}</span>
        {sub ? <span className="tx-opcao__sub">{sub}</span> : null}
      </span>
      {children}
    </button>
  );
}
