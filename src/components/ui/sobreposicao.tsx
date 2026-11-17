import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Botao } from './botao';
import { cx } from './util';

/*
 * Modal, Drawer e Toast. Só desenho e semântica: quem abre, fecha e guarda o estado é a tela
 * (TX.ui.montar já fecha modal e drawer com Esc; teclado.tsx prende e devolve o foco em aria-modal).
 * `estatico` desenha no fluxo da página, sem fixar na janela (usado em /design-system).
 */
export const IconeFechar = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
  </svg>
);

function fecharNoVeu(aoFechar?: () => void) {
  return (e: MouseEvent<HTMLDivElement>) => {
    if (aoFechar && e.target === e.currentTarget) aoFechar();
  };
}

export type ModalProps = {
  id: string;
  titulo: ReactNode;
  sub?: ReactNode;
  /** Ao lado do título: o código do registro (Badge mono) ou uma Situacao. */
  extra?: ReactNode;
  aoFechar?: () => void;
  tamanho?: 'p' | 'm' | 'g' | 'xg';
  /** Texto do padrão "Falta:" (ex.: "Falta: tipo e motivo."). Vazio quando nada falta. */
  falta?: string;
  /** Botões do rodapé, do menos para o mais importante: Cancelar, depois o primário. */
  acoes?: ReactNode;
  estatico?: boolean;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'id'>;

/* Atributos extras (data-tx-modal, onKeyDown...) vão para a caixa role="dialog". */
export function Modal({ id, titulo, sub, extra, aoFechar, tamanho = 'm', falta, acoes, estatico, children, className, ...p }: ModalProps) {
  const tit = id + '-titulo';
  return (
    <div className={cx('tx-veu', estatico && 'tx-veu--estatico')} onClick={fecharNoVeu(aoFechar)}>
      <div role="dialog" aria-modal={estatico ? undefined : true} aria-labelledby={tit} className={cx('tx-modal', tamanho !== 'm' && 'tx-modal--' + tamanho, className)} {...p}>
        <div className="tx-modal__cab">
          <div className="tx-modal__titulos">
            <div className="tx-modal__titulo-linha">
              <h2 id={tit} className="tx-modal__titulo">{titulo}</h2>
              {extra}
            </div>
            {sub ? <div className="tx-modal__sub">{sub}</div> : null}
          </div>
          {aoFechar ? <Botao variante="icone" aria-label="Fechar" onClick={aoFechar} icone={IconeFechar} /> : null}
        </div>
        {children ? <div className="tx-modal__corpo">{children}</div> : null}
        {acoes || falta ? (
          <div className="tx-modal__rodape">
            {falta ? <span className="tx-falta" aria-live="polite">{falta}</span> : null}
            {acoes}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type DrawerProps = {
  id: string;
  titulo: ReactNode;
  sub?: ReactNode;
  /** Iniciais ou ícone no círculo do cabeçalho. */
  avatar?: ReactNode;
  aoFechar?: () => void;
  rodape?: ReactNode;
  estatico?: boolean;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'id'>;

export function Drawer({ id, titulo, sub, avatar, aoFechar, rodape, estatico, children, className, ...p }: DrawerProps) {
  const tit = id + '-titulo';
  return (
    <div className={cx('tx-veu', 'tx-veu--lateral', estatico && 'tx-veu--estatico')} onClick={fecharNoVeu(aoFechar)}>
      <div role="dialog" aria-modal={estatico ? undefined : true} aria-labelledby={tit} className={cx('tx-drawer', className)} {...p}>
        <div className="tx-drawer__cab">
          {avatar ? <span className="tx-drawer__avatar" aria-hidden>{avatar}</span> : null}
          <div className="tx-drawer__titulos">
            <h2 id={tit} className="tx-drawer__titulo">{titulo}</h2>
            {sub ? <div className="tx-drawer__sub">{sub}</div> : null}
          </div>
          {aoFechar ? <Botao variante="icone" aria-label="Fechar" onClick={aoFechar} icone={IconeFechar} /> : null}
        </div>
        <div className="tx-drawer__corpo">{children}</div>
        {rodape ? <div className="tx-drawer__rodape">{rodape}</div> : null}
      </div>
    </div>
  );
}

const VISTO = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2.5 6.2 5 8.6l4.5-5" />
  </svg>
);
const EXCL = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M6 2.5v4.2M6 9.2v.1" />
  </svg>
);

/* Toast: confirma uma ação que deu certo. Uma frase. Erro de validação não vai aqui: vai no campo. */
export function Toast({ children, tom = 'ok', estatico }: { children: ReactNode; tom?: 'ok' | 'erro'; estatico?: boolean }) {
  return (
    <div role="status" aria-live="polite" className={cx('tx-toast', tom === 'erro' && 'tx-toast--erro', estatico && 'tx-toast--estatico')}>
      <span className="tx-toast__icone" aria-hidden>{tom === 'erro' ? EXCL : VISTO}</span>
      {children}
    </div>
  );
}
