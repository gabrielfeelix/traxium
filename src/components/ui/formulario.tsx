'use client';
/*
 * Peças de formulário comuns às telas: o rótulo é <label> ligado ao campo, o erro aparece
 * junto do campo (e o campo fica marcado como inválido), e escolha entre poucas opções é
 * um grupo de rádio com o mesmo chip em toda tela.
 */
import { cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';

type CampoProps = { id: string; rotulo: ReactNode; erro?: string; dica?: ReactNode; style?: CSSProperties; children: ReactNode };

export function Campo({ id, rotulo, erro, dica, style, children }: CampoProps) {
  const errId = id + '-erro';
  const campo = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, { id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': erro ? errId : undefined })
    : children;
  return (
    <div style={style}>
      <label htmlFor={id} className="tx-rotulo">{rotulo}</label>
      {campo}
      {erro ? <div id={errId} className="tx-erro" role="alert">{erro}</div> : dica ? <div className="tx-dica">{dica}</div> : null}
    </div>
  );
}

type Opcao = { n: ReactNode; on?: boolean; onClick?: () => void; k?: string };

export function Escolhas({ id, rotulo, itens, erro, depois, style }: { id: string; rotulo: ReactNode; itens: Opcao[]; erro?: string; depois?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={style}>
      <div id={id} className="tx-rotulo">{rotulo}</div>
      <div role="radiogroup" aria-labelledby={id} aria-invalid={erro ? true : undefined} className="tx-escolhas" data-tx-grupo={id}>
        {itens.map((it, i) => (
          <button key={it.k || i} type="button" role="radio" aria-checked={!!it.on} className="tx-chip" onClick={it.onClick}>{it.n}</button>
        ))}
        {depois}
      </div>
      {erro ? <div className="tx-erro" role="alert">{erro}</div> : null}
    </div>
  );
}

// "produto, ordem e peso"
export function listaFalta(itens: string[]) {
  return itens.length <= 1 ? itens.join('') : itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
}
