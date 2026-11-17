import { cloneElement, isValidElement, type CSSProperties, type InputHTMLAttributes, type ReactElement, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from './util';

/*
 * Campo: rótulo <label> ligado ao controle, dica ou erro embaixo. Com erro, o controle recebe
 * aria-invalid e aria-describedby apontando para a mensagem; com dica, aria-describedby aponta
 * para a dica. O controle é o filho (Entrada, AreaTexto, Selecao, CampoData ou um input qualquer).
 * Classes: .tx-campo, .tx-campo__rotulo (= .tx-rotulo), .tx-campo__dica, .tx-campo__erro, .tx-entrada.
 */
export type CampoProps = {
  id: string;
  rotulo: ReactNode;
  dica?: ReactNode;
  erro?: string;
  opcional?: boolean;
  /** Nome para o rodapé "Falta:" levar ao campo (vira data-tx-campo no controle). */
  campo?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Campo({ id, rotulo, dica, erro, opcional, campo, className, style, children }: CampoProps) {
  const errId = id + '-erro';
  const dicaId = id + '-dica';
  const desc = erro ? errId : dica ? dicaId : undefined;
  const ctrl = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        'aria-invalid': erro ? true : undefined,
        'aria-describedby': desc,
        ...(campo ? { 'data-tx-campo': campo } : {}),
      })
    : children;
  return (
    <div className={cx('tx-campo', className)} style={style}>
      <label htmlFor={id} className="tx-campo__rotulo">
        {rotulo}
        {opcional ? <span className="tx-campo__opcional"> (opcional)</span> : null}
      </label>
      {ctrl}
      {erro ? (
        <div id={errId} className="tx-campo__erro" role="alert">{erro}</div>
      ) : dica ? (
        <div id={dicaId} className="tx-campo__dica">{dica}</div>
      ) : null}
    </div>
  );
}

type Mono = { mono?: boolean };
export function Entrada({ mono, className, ...p }: InputHTMLAttributes<HTMLInputElement> & Mono & { ref?: Ref<HTMLInputElement> }) {
  return <input className={cx('tx-entrada', mono && 'tx-entrada--mono', className)} {...p} />;
}
export function AreaTexto({ className, rows = 3, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea className={cx('tx-entrada', className)} rows={rows} {...p} />;
}
export function Selecao({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx('tx-entrada', className)} {...p}>{children}</select>;
}

/** Entrada com ícone à esquerda (busca). A caixa tem a borda; o input dentro não. */
export function EntradaCaixa({ icone, className, style, ...p }: InputHTMLAttributes<HTMLInputElement> & { icone?: ReactNode }) {
  return (
    <div className={cx('tx-entrada-caixa', className)} style={style}>
      {icone}
      <input {...p} />
    </div>
  );
}

// Data digitada em DD/MM/AAAA: o campo nativo mostra o formato do idioma do navegador.
export function mascaraData(t: string): string {
  const d = String(t || '').replace(/\D/g, '').slice(0, 8);
  return d.length > 4 ? d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4) : d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
}
export function dataValida(t: string): boolean {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t || '');
  if (!m) return false;
  const dt = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  return dt.getUTCFullYear() === +m[3] && dt.getUTCMonth() === +m[2] - 1 && dt.getUTCDate() === +m[1];
}

/** Data em DD/MM/AAAA com máscara. aoMudar recebe o texto já mascarado. */
export function CampoData({ valor, aoMudar, className, ...p }: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & { valor: string; aoMudar: (v: string) => void }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="DD/MM/AAAA"
      maxLength={10}
      className={cx('tx-entrada', 'tx-entrada--mono', className)}
      value={valor}
      onChange={(e) => aoMudar(mascaraData(e.target.value))}
      {...p}
    />
  );
}
