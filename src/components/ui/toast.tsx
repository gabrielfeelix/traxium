'use client';
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { cx } from './util';

/*
 * Toast: confirma uma ação que deu certo, numa frase. Pode ter UMA ação (Desfazer, Ver registro).
 * Some sozinho: 4,2 s sem ação, 8 s com ação. O tempo para enquanto o ponteiro ou o foco estão nele
 * (WCAG 2.2.1). Esc fecha quando o foco está dentro. Erro de validação não vai aqui: vai no campo.
 *
 * Dois jeitos de usar:
 *  1. Declarativo: <Toast acao={{ rotulo: 'Desfazer', aoClicar }} aoFechar={...}>Texto</Toast>
 *     (a tela guarda o estado; `estatico` desenha no fluxo para documentação).
 *  2. Imperativo: avisar({ texto, tom, acao, duracao }). Desenha no PostoAvisos montado na página
 *     ou, se não houver nenhum, num posto que ele mesmo cria no <body>. Um toast por vez: o novo
 *     substitui o anterior. Devolve uma função que fecha este toast.
 */
export type AcaoToast = { rotulo: string; aoClicar: () => void };
export type TomToast = 'ok' | 'erro' | 'info';

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
const INFO = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M6 5.4v3.4M6 3.3v.1" />
  </svg>
);
const FECHAR = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
  </svg>
);

export type ToastProps = {
  children: ReactNode;
  tom?: TomToast;
  /** Um botão de texto dentro do toast. Clicar executa e fecha. */
  acao?: AcaoToast;
  /** Milissegundos até sumir. Padrão: 8000 com ação, 4200 sem. Só vale com aoFechar. */
  duracao?: number;
  /** Chamado quando o tempo acaba, no Esc, no botão fechar ou depois da ação. */
  aoFechar?: () => void;
  estatico?: boolean;
  className?: string;
};

export function Toast({ children, tom = 'ok', acao, duracao, aoFechar, estatico, className }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;
  const ms = duracao ?? (acao ? 8000 : 4200);

  useEffect(() => {
    if (!aoFechar || estatico || ms <= 0) return;
    const el = ref.current;
    let resta = ms;
    let inicio = Date.now();
    let t: ReturnType<typeof setTimeout> | null = setTimeout(() => fechar.current?.(), resta);
    const pausar = () => {
      if (!t) return;
      clearTimeout(t);
      t = null;
      resta -= Date.now() - inicio;
    };
    const seguir = () => {
      if (t || !el) return;
      if (el.matches(':hover') || el.contains(document.activeElement)) return;
      inicio = Date.now();
      t = setTimeout(() => fechar.current?.(), Math.max(resta, 1500));
    };
    el?.addEventListener('pointerenter', pausar);
    el?.addEventListener('focusin', pausar);
    el?.addEventListener('pointerleave', seguir);
    el?.addEventListener('focusout', () => setTimeout(seguir, 0));
    return () => {
      if (t) clearTimeout(t);
      el?.removeEventListener('pointerenter', pausar);
      el?.removeEventListener('focusin', pausar);
      el?.removeEventListener('pointerleave', seguir);
    };
    // Reinicia só quando muda o texto ou a duração, não a cada render da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, estatico, !aoFechar]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cx('tx-toast', tom === 'erro' && 'tx-toast--erro', tom === 'info' && 'tx-toast--info', estatico && 'tx-toast--estatico', className)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && aoFechar) {
          e.stopPropagation();
          aoFechar();
        }
      }}
      data-tx-toast
    >
      <span className="tx-toast__icone" aria-hidden>{tom === 'erro' ? EXCL : tom === 'info' ? INFO : VISTO}</span>
      <span className="tx-toast__texto">{children}</span>
      {acao ? (
        <button
          type="button"
          className="tx-toast__acao"
          onClick={() => {
            acao.aoClicar();
            aoFechar?.();
          }}
        >
          {acao.rotulo}
        </button>
      ) : null}
      {acao && aoFechar ? (
        <button type="button" className="tx-toast__fechar" aria-label="Fechar aviso" onClick={aoFechar}>
          {FECHAR}
        </button>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------- avisar (imperativo)
export type AvisoOpcoes = { texto: ReactNode; tom?: TomToast; acao?: AcaoToast; duracao?: number };
type AvisoAtual = AvisoOpcoes & { id: number };

let atual: AvisoAtual | null = null;
let seq = 0;
const ouvintes = new Set<() => void>();
let postosMontados = 0;
let raizAuto: { raiz: Root; el: HTMLElement } | null = null;

function emitir() {
  ouvintes.forEach((f) => f());
}
function ouvir(f: () => void) {
  ouvintes.add(f);
  return () => {
    ouvintes.delete(f);
  };
}
function fecharAviso(id: number) {
  if (atual && atual.id === id) {
    atual = null;
    emitir();
  }
}

/** Mostra um toast. Aceita o texto direto: avisar('Escopo atualizado.'). Devolve a função que fecha. */
export function avisar(o: AvisoOpcoes | string): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const op = typeof o === 'string' ? { texto: o } : o;
  const id = ++seq;
  atual = { ...op, id };
  if (!postosMontados && !raizAuto) {
    const el = document.createElement('div');
    el.setAttribute('data-tx-posto-avisos', 'auto');
    document.body.appendChild(el);
    const raiz = createRoot(el);
    raizAuto = { raiz, el };
    raiz.render(<PostoAvisos auto />);
  }
  emitir();
  return () => fecharAviso(id);
}

/**
 * Onde os toasts de avisar() aparecem. Monte um por página (a moldura monta um). Sem nenhum montado,
 * avisar() cria o seu no <body>; quando um posto de verdade monta, o automático sai.
 */
export function PostoAvisos({ auto }: { auto?: boolean }) {
  const a = useSyncExternalStore(ouvir, () => atual, () => null);
  useEffect(() => {
    if (auto) return;
    postosMontados++;
    if (raizAuto) {
      const r = raizAuto;
      raizAuto = null;
      setTimeout(() => {
        r.raiz.unmount();
        r.el.remove();
      }, 0);
    }
    return () => {
      postosMontados--;
    };
  }, [auto]);
  if (!a) return null;
  return (
    <Toast key={a.id} tom={a.tom} acao={a.acao} duracao={a.duracao} aoFechar={() => fecharAviso(a.id)}>
      {a.texto}
    </Toast>
  );
}
