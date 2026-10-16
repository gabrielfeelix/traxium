'use client';
/*
 * Teclado nas telas convertidas do protótipo:
 * 1. Enter e espaço acionam o que tem role="button" sem ser <button> (div e span clicáveis).
 * 2. Modal ou drawer aberto (role="dialog" aria-modal="true"): o foco entra nele, Tab circula
 *    só por dentro e, quando ele fecha, o foco volta a quem abriu. Esc fecha (TX.ui.montar).
 * Os diálogos da moldura cuidam do próprio foco (data-foco-proprio).
 */
import { useEffect } from 'react';

const FOCAVEIS = 'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

function dialogoAberto(): HTMLElement | null {
  const ds = Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"]:not([data-foco-proprio])'));
  return ds[ds.length - 1] || null;
}

export function TecladoClicavel() {
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => {
      if (ev.defaultPrevented) return;
      const t = ev.target as HTMLElement | null;
      if ((ev.key === 'Enter' || ev.key === ' ') && t && t.getAttribute('role') === 'button' && t.tagName !== 'BUTTON' && t.tagName !== 'A') {
        ev.preventDefault();
        t.click();
        return;
      }
      if (ev.key !== 'Tab') return;
      const d = dialogoAberto();
      if (!d) return;
      const f = Array.from(d.querySelectorAll<HTMLElement>(FOCAVEIS)).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && (i === f.length - 1 || i === -1)) { ev.preventDefault(); f[0].focus(); }
    };

    // Quem abriu cada diálogo, para devolver o foco quando ele sair da tela.
    let atual: HTMLElement | null = null;
    let abriu: HTMLElement | null = null;
    let ultimoFoco: HTMLElement | null = null;
    const foco = (ev: FocusEvent) => { if (!dialogoAberto()) ultimoFoco = ev.target as HTMLElement; };
    const obs = new MutationObserver(() => {
      const d = dialogoAberto();
      if (d && d !== atual) {
        if (!atual) abriu = ultimoFoco && document.contains(ultimoFoco) ? ultimoFoco : (document.activeElement as HTMLElement);
        atual = d;
        if (!d.contains(document.activeElement)) {
          // No celular, focar um campo abre o teclado por cima do conteúdo: lá o foco vai para o diálogo.
          const campo = window.innerWidth < 600 ? null : d.querySelector<HTMLElement>('input:not([type="hidden"]):not([disabled]), textarea, select');
          const prim = campo || (window.innerWidth < 600 ? null : d.querySelector<HTMLElement>(FOCAVEIS));
          if (prim) prim.focus({ preventScroll: true });
          else { d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true }); }
        }
      } else if (!d && atual) {
        atual = null;
        const volta = abriu;
        abriu = null;
        if (volta && document.contains(volta)) volta.focus({ preventScroll: true });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', tecla);
    document.addEventListener('focusin', foco);
    return () => { obs.disconnect(); document.removeEventListener('keydown', tecla); document.removeEventListener('focusin', foco); };
  }, []);
  return null;
}
