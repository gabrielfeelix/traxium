'use client';
import { useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Abas, type Aba } from './abas';
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
  /** Iniciais ou ícone no círculo do cabeçalho. Para placa, passe <Placa> em `extra`. */
  avatar?: ReactNode;
  /** Ao lado do título, no cabeçalho escuro: Placa, Situacao em selo, código. */
  extra?: ReactNode;
  aoFechar?: () => void;
  /** p 480 px (detalhe de linha), m 560 px (padrão), g 720 px (detalhe com tabela dentro). */
  tamanho?: 'p' | 'm' | 'g';
  /** Faixa clara logo abaixo do cabeçalho: ações do registro (Ver histórico, Exportar, MenuLinha). */
  acoes?: ReactNode;
  /** Abas do detalhe (mesma forma de Abas). A tela guarda a ativa e troca o children. */
  abas?: Aba[];
  /** Sem véu: a lista atrás continua visível, rolável e clicável (detalhe de linha). Sem aria-modal. */
  semVeu?: boolean;
  /** Troca o registro sem fechar: setas no cabeçalho e teclas ↑ ↓ (ou K J) fora de campo. */
  aoAnterior?: () => void;
  aoProximo?: () => void;
  rodape?: ReactNode;
  /** Texto "Falta: ..." à esquerda do rodapé (painel de decisão), como no Modal. Vazio quando nada falta. */
  falta?: string;
  estatico?: boolean;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'id'>;

const SETA = (cima: boolean) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={cima ? 'M3.5 8.5 7 5l3.5 3.5' : 'M3.5 5.5 7 9l3.5-3.5'} />
  </svg>
);

export function Drawer({ id, titulo, sub, avatar, extra, aoFechar, tamanho = 'm', acoes, abas, semVeu, aoAnterior, aoProximo, rodape, falta, estatico, children, className, ...p }: DrawerProps) {
  const tit = id + '-titulo';
  const nav = useRef({ aoAnterior, aoProximo, aoFechar });
  nav.current = { aoAnterior, aoProximo, aoFechar };
  const navega = !!(aoAnterior || aoProximo);
  useEffect(() => {
    if (estatico) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('input, textarea, select, [contenteditable="true"], [role="menu"], [role="listbox"]'))) return;
      const n = nav.current;
      if (semVeu && e.key === 'Escape' && n.aoFechar) { n.aoFechar(); return; }
      if (!navega) return;
      if ((e.key === 'ArrowUp' || e.key === 'k') && n.aoAnterior) { e.preventDefault(); n.aoAnterior(); }
      else if ((e.key === 'ArrowDown' || e.key === 'j') && n.aoProximo) { e.preventDefault(); n.aoProximo(); }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [estatico, navega, semVeu]);
  return (
    <div className={cx('tx-veu', 'tx-veu--lateral', semVeu && 'tx-veu--sem', estatico && 'tx-veu--estatico')} onClick={semVeu ? undefined : fecharNoVeu(aoFechar)}>
      <div role="dialog" aria-modal={estatico || semVeu ? undefined : true} aria-labelledby={tit} className={cx('tx-drawer', tamanho !== 'm' && 'tx-drawer--' + tamanho, className)} {...p}>
        <div className="tx-drawer__cab">
          {avatar ? <span className="tx-drawer__avatar" aria-hidden>{avatar}</span> : null}
          <div className="tx-drawer__titulos">
            <div className="tx-drawer__titulo-linha">
              <h2 id={tit} className="tx-drawer__titulo">{titulo}</h2>
              {extra}
            </div>
            {sub ? <div className="tx-drawer__sub">{sub}</div> : null}
          </div>
          {navega ? (
            <span className="tx-drawer__nav">
              <Botao variante="icone" aria-label="Registro anterior (seta para cima)" onClick={aoAnterior} desabilitado={!aoAnterior} icone={SETA(true)} />
              <Botao variante="icone" aria-label="Próximo registro (seta para baixo)" onClick={aoProximo} desabilitado={!aoProximo} icone={SETA(false)} />
            </span>
          ) : null}
          {aoFechar ? <Botao variante="icone" aria-label="Fechar" onClick={aoFechar} icone={IconeFechar} /> : null}
        </div>
        {acoes ? <div className="tx-drawer__acoes">{acoes}</div> : null}
        {abas && abas.length ? <Abas itens={abas} rotulo={'Seções de ' + (typeof titulo === 'string' ? titulo : 'detalhe')} className="tx-drawer__abas" /> : null}
        <div className="tx-drawer__corpo">{children}</div>
        {rodape || falta ? (
          <div className="tx-drawer__rodape">
            {falta ? <span className="tx-falta" aria-live="polite">{falta}</span> : null}
            {rodape}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* Toast mora em toast.tsx (com ação, duração e avisar). Reexportado para quem importa daqui. */
export { Toast, avisar, PostoAvisos, type ToastProps, type AcaoToast, type AvisoOpcoes, type TomToast } from './toast';
