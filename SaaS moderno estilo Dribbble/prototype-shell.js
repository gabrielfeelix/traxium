(() => {
  'use strict';

  const nativeProfilePages = new Set([
    'Academy.dc.html',
    'Ativos e Frota.dc.html',
    'Compartimento Detalhe.dc.html',
    'Dossie.dc.html',
    'Excecoes.dc.html',
    'Torre de Controle v2.dc.html',
    'Inspecoes.dc.html',
    'Limpezas.dc.html',
    'Indicadores.dc.html',
    'Motor IDTF.dc.html',
    'Nao Conformidades.dc.html',
    'Subcontratados.dc.html',
    'Viagem Detalhe.dc.html',
    'Viagens.dc.html',
    'Configuracoes.dc.html',
    'Console Traxium.dc.html',
    'Acessos Externos.dc.html'
  ]);
  const currentPage = decodeURIComponent(location.pathname.split('/').pop() || '');
  const themeStorageKey = 'tx-prototype-theme';
  const themeExcludedPages = new Set(['App de Campo.dc.html', 'Onboarding Publico.dc.html']);
  const availablePages = {
    'Inspeções': { href: 'Inspecoes.dc.html', badge: '3' },
    'Limpezas': { href: 'Limpezas.dc.html', badge: '3' },
    'Indicadores': { href: 'Indicadores.dc.html', badge: '11/15' },
    'Não conformidades': { href: 'Nao Conformidades.dc.html', badge: '4' },
    'Motoristas': { href: 'Motoristas.dc.html', badge: '42' }
  };
  const unavailablePages = {};
  const boundProfiles = new WeakSet();
  const boundComingSoon = new WeakSet();
  const boundUnavailable = new WeakSet();
  const observedSidebars = new WeakMap();
  let menu = null;
  let modal = null;
  let toastTimer = null;

  const palette = {
    ink: '#0b2224',
    teal: '#127670',
    tealDark: '#0C5862',
    border: '#e4eae8',
    muted: '#5c706e',
    soft: '#f6f9f8'
  };

  function readTheme() {
    try {
      return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  function activeTheme() {
    return document.documentElement.dataset.txTheme === 'dark' ? 'dark' : 'light';
  }

  function themeIcon(theme) {
    return theme === 'dark'
      ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.7 12.8A7 7 0 0 1 7.2 3.3 7 7 0 1 0 16.7 12.8Z"></path><path d="M14.8 3.1v2.2M13.7 4.2h2.2"></path></svg>'
      : '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.2"></circle><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4"></path></svg>';
  }

  function refreshThemeControls() {
    const theme = activeTheme();
    document.querySelectorAll('[data-tx-theme-toggle]').forEach(control => {
      control.setAttribute('aria-pressed', String(theme === 'dark'));
      const icon = control.querySelector('[data-tx-theme-icon]');
      const value = control.querySelector('[data-tx-theme-value]');
      if (icon) icon.innerHTML = themeIcon(theme);
      if (value) value.textContent = theme === 'dark' ? 'Escuro Traxium' : 'Claro padrão';
    });
  }

  function commitTheme(theme, persist = true) {
    const next = theme === 'dark' && !themeExcludedPages.has(currentPage) ? 'dark' : 'light';
    document.documentElement.dataset.txTheme = next;
    document.documentElement.style.colorScheme = next;
    if (persist) {
      try { localStorage.setItem(themeStorageKey, theme); } catch { /* armazenamento indisponível */ }
    }
    refreshThemeControls();
  }

  function setTheme(theme, { animate = true, persist = true } = {}) {
    const update = () => commitTheme(theme, persist);
    if (animate && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }

  function toggleTheme() {
    const next = activeTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(next === 'dark' ? 'Modo Escuro Traxium ativado.' : 'Modo claro ativado.');
  }

  function ensureThemeStyles() {
    if (document.getElementById('tx-prototype-theme-styles')) return;
    const styles = document.createElement('style');
    styles.id = 'tx-prototype-theme-styles';
    styles.textContent = `
      :root {
        --tx-dark-canvas: #061f24;
        --tx-dark-surface: #0b2a30;
        --tx-dark-surface-raised: #10363d;
        --tx-dark-surface-soft: #143f46;
        --tx-dark-line: rgba(146, 207, 199, .18);
        --tx-dark-line-strong: rgba(146, 207, 199, .28);
        --tx-dark-ink: #eaf7f5;
        --tx-dark-muted: #9bc4c1;
        --tx-dark-brand: #52d2bd;
      }
      html[data-tx-theme="dark"],
      html[data-tx-theme="dark"] body {
        background: var(--tx-dark-canvas) !important;
        color: var(--tx-dark-ink) !important;
      }
      html[data-tx-theme="dark"] body,
      html[data-tx-theme="dark"] #dc-root,
      html[data-tx-theme="dark"] #dc-root [data-screen-label] {
        background-color: var(--tx-dark-canvas) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="background:#fff"],
      html[data-tx-theme="dark"] #dc-root [style*="background: #fff"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(255, 255, 255)"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="background:#fff"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="background: #fff"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="background: rgb(255, 255, 255)"],
      html[data-tx-theme="dark"] [data-tx-modal-card],
      html[data-tx-theme="dark"] [data-tx-profile-menu],
      html[data-tx-theme="dark"] [data-tx-native-profile-menu] {
        background: var(--tx-dark-surface) !important;
        color: var(--tx-dark-ink) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="background:#f2f5f4"],
      html[data-tx-theme="dark"] #dc-root [style*="background:#f7faf9"],
      html[data-tx-theme="dark"] #dc-root [style*="background:#f6f9f8"],
      html[data-tx-theme="dark"] #dc-root [style*="background:#f0f4f3"],
      html[data-tx-theme="dark"] #dc-root [style*="background:#eef2f1"],
      html[data-tx-theme="dark"] #dc-root [style*="background:#e4ebe9"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(242, 246, 245)"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(247, 250, 249)"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(240, 244, 243)"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(238, 247, 246)"],
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(238, 242, 241)"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="background: rgb(240, 244, 243)"] {
        background: var(--tx-dark-surface-raised) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="background:linear-gradient"][style*="#fff"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="background:linear-gradient"][style*="#fff"] {
        background: linear-gradient(105deg, rgba(82,210,189,.11), rgba(16,54,61,.3)) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="background:#e9f7ef"] { background: rgba(72,199,142,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background:#fdecec"] { background: rgba(229,100,100,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background:#fdf3e2"] { background: rgba(232,163,61,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background:#eceffa"] { background: rgba(91,133,219,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(233, 247, 239)"] { background: rgba(72,199,142,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(253, 236, 236)"] { background: rgba(229,100,100,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(253, 243, 226)"] { background: rgba(232,163,61,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="background: rgb(236, 239, 250)"] { background: rgba(91,133,219,.14) !important; }
      html[data-tx-theme="dark"] #dc-root [style*="color:#0b2224"],
      html[data-tx-theme="dark"] #dc-root [style*="color: #0b2224"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#152625"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#1d302f"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(11, 34, 36)"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="color:#0b2224"],
      html[data-tx-theme="dark"] [data-tx-profile-menu] button,
      html[data-tx-theme="dark"] [data-tx-profile-menu],
      html[data-tx-theme="dark"] [data-tx-modal-card] {
        color: var(--tx-dark-ink) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="color:#3c4f4e"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#5c706e"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#6d807e"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#7c8f8d"],
      html[data-tx-theme="dark"] #dc-root [style*="color:#8ba09e"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(60, 79, 78)"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(92, 112, 110)"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(109, 129, 127)"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(124, 143, 141)"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(139, 160, 158)"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="color:#5c706e"],
      html[data-tx-theme="dark"] [data-tx-profile-menu] [style*="color:#5c706e"] {
        color: var(--tx-dark-muted) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(12, 88, 98)"],
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(18, 118, 112)"] { color: #70dccc !important; }
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(26, 143, 87)"] { color: #63d9a1 !important; }
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(185, 117, 20)"] { color: #ffc064 !important; }
      html[data-tx-theme="dark"] #dc-root [style*="color: rgb(196, 61, 61)"] { color: #ff817b !important; }
      html[data-tx-theme="dark"] #dc-root [style*="border:1px solid #e4eae8"],
      html[data-tx-theme="dark"] #dc-root [style*="border: 1px solid #e4eae8"],
      html[data-tx-theme="dark"] #dc-root [style*="border:1px solid #e0e7e5"],
      html[data-tx-theme="dark"] #dc-root [style*="border:1px solid #dde5e3"],
      html[data-tx-theme="dark"] #dc-root [style*="border:1px solid #cdd9d7"],
      html[data-tx-theme="dark"] #dc-root [style*="border-color: rgb(228, 234, 232)"],
      html[data-tx-theme="dark"] #dc-root [style*="border-color: rgb(224, 231, 229)"],
      html[data-tx-theme="dark"] #dc-root [style*="border-color: rgb(221, 229, 227)"],
      html[data-tx-theme="dark"] #dc-root [style*="border: 1px solid rgb(228, 234, 232)"],
      html[data-tx-theme="dark"] #dc-root [style*="border: 1px solid rgb(224, 231, 229)"],
      html[data-tx-theme="dark"] #dc-root [style*="border: 1px solid rgb(221, 229, 227)"],
      html[data-tx-theme="dark"] [data-tx-modal-card] {
        border-color: var(--tx-dark-line) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="border-bottom:1px solid #eef2f1"],
      html[data-tx-theme="dark"] #dc-root [style*="border-bottom:1px solid #e4eae8"],
      html[data-tx-theme="dark"] #dc-root [style*="border-top:1px solid #eef2f1"],
      html[data-tx-theme="dark"] #dc-root [style*="border-top:1px solid #e4eae8"] {
        border-color: var(--tx-dark-line) !important;
      }
      html[data-tx-theme="dark"] #dc-root [style*="border-bottom: 1px solid rgb(228, 234, 232)"],
      html[data-tx-theme="dark"] #dc-root [style*="border-bottom: 1px solid rgb(238, 242, 241)"],
      html[data-tx-theme="dark"] #dc-root [style*="border-top: 1px solid rgb(228, 234, 232)"] {
        border-color: var(--tx-dark-line) !important;
      }
      html[data-tx-theme="dark"] [data-tx-profile-menu] [style*="border-bottom"],
      html[data-tx-theme="dark"] [data-tx-profile-menu] [style*="background:#eef2f1"],
      html[data-tx-theme="dark"] [data-tx-modal-card] [style*="border-bottom"] {
        border-color: var(--tx-dark-line) !important;
      }
      html[data-tx-theme="dark"] #dc-root input,
      html[data-tx-theme="dark"] #dc-root select,
      html[data-tx-theme="dark"] #dc-root textarea {
        background: #0e3036 !important;
        border-color: var(--tx-dark-line-strong) !important;
        color: var(--tx-dark-ink) !important;
      }
      html[data-tx-theme="dark"] #dc-root input::placeholder,
      html[data-tx-theme="dark"] #dc-root textarea::placeholder { color: #79a3a1 !important; }
      html[data-tx-theme="dark"] #dc-root [data-screen-label] > :first-child {
        background: linear-gradient(180deg, #063b42 0%, #052b31 55%, #041f24 100%) !important;
        box-shadow: 12px 0 40px rgba(0,0,0,.12);
      }
      html[data-tx-theme="dark"] [data-tx-theme-toggle] { color: var(--tx-dark-ink) !important; }
      html[data-tx-theme="dark"] [data-tx-theme-toggle]:hover { background: rgba(82,210,189,.09) !important; }
      html[data-tx-theme="dark"] [data-tx-theme-icon] {
        background: linear-gradient(145deg, rgba(82,210,189,.18), rgba(60,155,209,.16)) !important;
        color: #79dfce !important;
      }
      html[data-tx-theme="dark"] [data-tx-theme-switch] {
        background: linear-gradient(135deg,#28a996,#327eb5) !important;
        box-shadow: 0 0 0 4px rgba(82,210,189,.10), 0 7px 18px rgba(0,0,0,.22);
      }
      html[data-tx-theme="dark"] [data-tx-theme-switch] > span { transform: translateX(17px); }
      [data-tx-theme-toggle] { transition: background .18s ease, color .18s ease; }
      [data-tx-theme-toggle]:hover { background: #f2f7f6 !important; }
      [data-tx-theme-icon] {
        width: 34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;
        flex:none;background:linear-gradient(145deg,#e9f7f4,#eaf2f8);color:#127670;
      }
      [data-tx-theme-icon] svg { width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round; }
      [data-tx-theme-switch] {
        width:38px;height:21px;border-radius:99px;padding:2px;display:flex;align-items:center;flex:none;
        background:#dbe6e4;transition:background .24s ease,box-shadow .24s ease;
      }
      [data-tx-theme-switch] > span {
        width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(9,34,36,.2);
        transform:translateX(0);transition:transform .26s cubic-bezier(.2,.8,.2,1);
      }
      ::view-transition-old(root), ::view-transition-new(root) {
        animation-duration: .34s;
        animation-timing-function: cubic-bezier(.2,.8,.2,1);
      }
      @media (prefers-reduced-motion: reduce) {
        ::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0s; }
      }
    `;
    document.head.appendChild(styles);
  }

  function ensureSidebarStyles() {
    if (document.getElementById('tx-prototype-sidebar-styles')) return;
    const styles = document.createElement('style');
    styles.id = 'tx-prototype-sidebar-styles';
    styles.textContent = `
      #dc-root [data-screen-label] > :first-child {
        overflow-x: hidden !important;
        scrollbar-width: thin;
        scrollbar-color: rgba(150, 214, 207, .62) transparent;
        scrollbar-gutter: stable;
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar {
        width: 9px;
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar-track {
        background: transparent;
        margin-block: 12px;
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar-thumb {
        min-height: 48px;
        border: 2px solid transparent;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(160, 225, 215, .78), rgba(84, 167, 165, .72)) padding-box;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #b5eee2, #67b9b3) padding-box;
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
      }
      #dc-root [data-screen-label] > :first-child::-webkit-scrollbar-corner {
        background: transparent;
      }
      #dc-root [data-screen-label] > :first-child a { min-height: 44px; }
      #dc-root [data-screen-label] > :first-child svg[width="15"],
      #dc-root [data-screen-label] > :first-child svg[width="16"] {
        width: 19px !important;
        height: 19px !important;
        min-width: 19px;
      }
      #dc-root [data-screen-label] > :first-child[data-tx-sidebar-state="collapsed"] svg[width="15"],
      #dc-root [data-screen-label] > :first-child[data-tx-sidebar-state="collapsed"] svg[width="16"] {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px;
      }
      #dc-root [data-screen-label] > :first-child[data-tx-sidebar-state="collapsed"] [data-tx-access-nav] {
        width: 48px !important;
        min-width: 48px !important;
        height: 48px !important;
        min-height: 48px !important;
        padding: 0 !important;
        margin-left: auto !important;
        margin-right: auto !important;
        justify-content: center !important;
        overflow: hidden !important;
      }
      @media (max-width: 720px) {
        #dc-root [data-screen-label] > :first-child[data-tx-sidebar-state="collapsed"] {
          width: 76px !important;
          min-width: 76px !important;
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        #dc-root [data-screen-label] > :first-child {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        #dc-root [data-screen-label] > :first-child::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  function showToast(message) {
    let toast = document.getElementById('tx-prototype-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'tx-prototype-toast';
      toast.setAttribute('role', 'status');
      Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        bottom: '26px',
        transform: 'translate(-50%, 14px)',
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '560px',
        padding: '11px 18px',
        borderRadius: '999px',
        background: palette.ink,
        boxShadow: '0 18px 50px rgba(9,34,36,.28)',
        color: '#fff',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: '13px',
        fontWeight: '650',
        opacity: '0',
        transition: 'opacity .2s ease, transform .2s ease'
      });
      toast.innerHTML = '<span style="width:8px;height:8px;border-radius:99px;background:linear-gradient(135deg,#48c78e,#127670);box-shadow:0 0 0 4px rgba(72,199,142,.16);flex:none"></span><span data-tx-toast-text></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('[data-tx-toast-text]').textContent = message;
    clearTimeout(toastTimer);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, 0)';
    });
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 14px)';
    }, 4200);
  }

  function closeMenu() {
    if (menu) menu.remove();
    menu = null;
  }

  function closeModal() {
    if (modal) modal.remove();
    modal = null;
  }

  function profileContent() {
    return `
      <div style="display:flex;align-items:center;gap:18px;padding-bottom:20px;border-bottom:1px solid ${palette.border}">
        <span style="width:72px;height:72px;border-radius:99px;background:linear-gradient(135deg,#e8a33d,#d97544);color:#fff;font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px #fff,0 0 0 7px #f0debb;flex:none">RA</span>
        <div>
          <div style="font-size:21px;font-weight:800;color:${palette.ink}">Rafael Antunes</div>
          <div style="font-size:13.5px;color:${palette.muted};margin-top:4px">Gestor de qualidade · GMP+</div>
          <div style="display:inline-flex;align-items:center;gap:7px;margin-top:10px;font-size:11.5px;font-weight:700;color:#1a8f57"><span style="width:8px;height:8px;border-radius:99px;background:linear-gradient(135deg,#48c78e,#127670);box-shadow:0 0 0 3px rgba(72,199,142,.14)"></span>sessão ativa</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px">
        <div style="border-left:3px solid ${palette.teal};padding:9px 12px;background:linear-gradient(90deg,#f4f9f8,#fff);border-radius:0 12px 12px 0"><div style="font-size:10.5px;font-weight:800;letter-spacing:.7px;color:#7c8f8d;text-transform:uppercase">Filial</div><div style="font-size:13.5px;font-weight:750;margin-top:4px">Rondonópolis MT</div></div>
        <div style="border-left:3px solid #0E78B5;padding:9px 12px;background:linear-gradient(90deg,#f4f8fb,#fff);border-radius:0 12px 12px 0"><div style="font-size:10.5px;font-weight:800;letter-spacing:.7px;color:#7c8f8d;text-transform:uppercase">Autoridade</div><div style="font-size:13.5px;font-weight:750;margin-top:4px">Gestor · nível 3</div></div>
      </div>
      <div style="margin-top:18px;border:1px solid ${palette.border};border-radius:14px;overflow:hidden">
        <div style="display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #eef2f1;font-size:13px"><span style="color:${palette.muted}">E-mail</span><strong>rafael.antunes@traxium.com.br</strong></div>
        <div style="display:flex;justify-content:space-between;padding:12px 14px;font-size:13px"><span style="color:${palette.muted}">Último acesso</span><strong>hoje, 08:02</strong></div>
      </div>`;
  }

  function readPreferences() {
    try {
      return { fila: true, cert: true, idtf: false, ...JSON.parse(localStorage.getItem('tx-prototype-prefs') || '{}') };
    } catch {
      return { fila: true, cert: true, idtf: false };
    }
  }

  function preferenceRows() {
    const prefs = readPreferences();
    const rows = [
      ['fila', 'Item há mais de 2h na fila', 'aviso no app e por e-mail'],
      ['cert', 'Certificado de terceiro a vencer', 'aos 30 e aos 15 dias'],
      ['idtf', 'Nova versão da base IDTF', 'quando a Qualidade publicar revisão']
    ];
    return rows.map(([key, title, subtitle]) => {
      const on = prefs[key];
      return `<button type="button" data-tx-pref="${key}" aria-pressed="${on}" style="width:100%;border:0;border-bottom:1px solid #eef2f1;background:#fff;padding:14px 4px;display:flex;align-items:center;gap:16px;text-align:left;font:inherit;cursor:pointer;color:${palette.ink}"><span style="flex:1"><span style="display:block;font-size:13.5px;font-weight:750">${title}</span><span style="display:block;font-size:11.5px;color:${palette.muted};margin-top:3px">${subtitle}</span></span><span data-tx-switch style="width:40px;height:23px;border-radius:99px;background:${on ? 'linear-gradient(135deg,#127670,#0E78B5)' : '#dde5e3'};padding:2.5px;display:flex;justify-content:${on ? 'flex-end' : 'flex-start'};transition:.2s"><span style="width:18px;height:18px;border-radius:99px;background:#fff;box-shadow:0 2px 5px rgba(9,34,36,.18)"></span></span></button>`;
    }).join('');
  }

  function openModal(kind) {
    closeMenu();
    closeModal();
    modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', kind === 'profile' ? 'Meu perfil' : 'Preferências e notificações');
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483645',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px',
      background: 'rgba(9,34,36,.45)',
      backdropFilter: 'blur(3px)',
      fontFamily: "'Hanken Grotesk', sans-serif"
    });
    const title = kind === 'profile' ? 'Meu perfil' : 'Preferências e notificações';
    const body = kind === 'profile' ? profileContent() : `<div style="font-size:13px;color:${palette.muted};margin-bottom:6px">Escolha quais eventos operacionais devem chamar sua atenção.</div><div data-tx-preferences>${preferenceRows()}</div>`;
    modal.innerHTML = `<div data-tx-modal-card style="width:520px;max-width:calc(100vw - 40px);background:#fff;border:1px solid ${palette.border};border-radius:24px;box-shadow:0 40px 100px rgba(9,34,36,.4);padding:24px;color:${palette.ink}"><div style="display:flex;align-items:center;margin-bottom:20px"><div style="font-size:18px;font-weight:800">${title}</div><button type="button" data-tx-close aria-label="Fechar" style="margin-left:auto;width:34px;height:34px;border:0;border-radius:99px;background:#f0f4f3;color:${palette.ink};font-size:15px;cursor:pointer">×</button></div>${body}<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:22px"><button type="button" data-tx-close style="border:1px solid ${palette.border};background:#fff;color:#3c4f4e;border-radius:99px;padding:10px 18px;font:700 13px 'Hanken Grotesk',sans-serif;cursor:pointer">Fechar</button>${kind === 'prefs' ? '<button type="button" data-tx-save style="border:0;background:linear-gradient(135deg,#127670,#0E78B5);color:#fff;border-radius:99px;padding:10px 19px;font:700 13px Hanken Grotesk,sans-serif;box-shadow:0 6px 14px rgba(18,118,112,.3);cursor:pointer">Salvar preferências</button>' : ''}</div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-tx-close]')) closeModal();
      const pref = event.target.closest('[data-tx-pref]');
      if (pref) {
        const pressed = pref.getAttribute('aria-pressed') !== 'true';
        pref.setAttribute('aria-pressed', String(pressed));
        const sw = pref.querySelector('[data-tx-switch]');
        sw.style.background = pressed ? 'linear-gradient(135deg,#127670,#0E78B5)' : '#dde5e3';
        sw.style.justifyContent = pressed ? 'flex-end' : 'flex-start';
      }
      if (event.target.closest('[data-tx-save]')) {
        const prefs = {};
        modal.querySelectorAll('[data-tx-pref]').forEach(row => {
          prefs[row.dataset.txPref] = row.getAttribute('aria-pressed') === 'true';
        });
        localStorage.setItem('tx-prototype-prefs', JSON.stringify(prefs));
        closeModal();
        showToast('Preferências salvas neste protótipo.');
      }
    });
    requestAnimationFrame(() => modal.querySelector('[data-tx-close]')?.focus());
  }

  function openProfileMenu(trigger) {
    closeMenu();
    const rect = trigger.getBoundingClientRect();
    const width = 260;
    menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.dataset.txProfileMenu = 'true';
    Object.assign(menu.style, {
      position: 'fixed',
      top: `${Math.min(rect.bottom + 10, innerHeight - 220)}px`,
      left: `${Math.max(14, Math.min(rect.right - width, innerWidth - width - 14))}px`,
      width: `${width}px`,
      zIndex: '2147483644',
      padding: '6px',
      border: `1px solid ${palette.border}`,
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0 16px 40px rgba(9,61,68,.16)',
      color: palette.ink,
      fontFamily: "'Hanken Grotesk', sans-serif"
    });
    menu.innerHTML = `<div style="display:flex;align-items:center;gap:11px;padding:11px 12px;border-bottom:1px solid #f0f4f3;margin-bottom:4px"><span style="width:38px;height:38px;border-radius:99px;background:linear-gradient(135deg,#e8a33d,#d97544);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none">RA</span><div><div style="font-size:13.5px;font-weight:800">Rafael Antunes</div><div style="font-size:11.5px;color:${palette.muted}">Gestor de qualidade · GMP+</div></div></div><button type="button" role="menuitem" data-tx-menu-profile style="width:100%;border:0;background:transparent;color:${palette.ink};font:600 13px 'Hanken Grotesk',sans-serif;text-align:left;padding:9px 12px;border-radius:9px;cursor:pointer">Meu perfil</button><button type="button" role="menuitem" data-tx-menu-prefs style="width:100%;border:0;background:transparent;color:${palette.ink};font:600 13px 'Hanken Grotesk',sans-serif;text-align:left;padding:9px 12px;border-radius:9px;cursor:pointer">Preferências e notificações</button><div style="height:1px;background:#eef2f1;margin:5px 8px"></div>${themeControlMarkup()}`;
    menu.querySelectorAll('button').forEach(button => {
      button.addEventListener('mouseenter', () => { button.style.background = palette.soft; });
      button.addEventListener('mouseleave', () => { button.style.background = 'transparent'; });
    });
    menu.querySelector('[data-tx-menu-profile]').addEventListener('click', () => openModal('profile'));
    menu.querySelector('[data-tx-menu-prefs]').addEventListener('click', () => openModal('prefs'));
    menu.querySelector('[data-tx-theme-toggle]').addEventListener('click', event => {
      event.stopPropagation();
      toggleTheme();
    });
    document.body.appendChild(menu);
    refreshThemeControls();
  }

  function themeControlMarkup() {
    const theme = activeTheme();
    return `<button type="button" role="menuitemcheckbox" data-tx-theme-toggle aria-pressed="${theme === 'dark'}" style="width:100%;border:0;background:transparent;color:${palette.ink};font-family:'Hanken Grotesk',sans-serif;text-align:left;padding:8px;border-radius:11px;cursor:pointer;display:flex;align-items:center;gap:10px"><span data-tx-theme-icon>${themeIcon(theme)}</span><span style="flex:1;min-width:0"><span style="display:block;font-size:12.5px;font-weight:750">Aparência</span><span data-tx-theme-value style="display:block;font-size:10.5px;color:${palette.muted};margin-top:2px">${theme === 'dark' ? 'Escuro Traxium' : 'Claro padrão'}</span></span><span data-tx-theme-switch aria-hidden="true"><span></span></span></button>`;
  }

  function bindNativeThemeControls() {
    if (!nativeProfilePages.has(currentPage)) return;
    const labels = [...document.querySelectorAll('#dc-root div')].filter(element => element.textContent.trim() === 'Preferências e notificações');
    labels.forEach(preferences => {
      const parent = preferences.parentElement;
      if (!parent || parent.querySelector('[data-tx-theme-toggle]')) return;
      const hasProfileItem = [...parent.children].some(child => child.textContent.trim() === 'Meu perfil');
      if (!hasProfileItem) return;
      parent.dataset.txNativeProfileMenu = 'true';
      Object.assign(parent.style, {
        position: 'fixed',
        top: '78px',
        right: '20px',
        left: 'auto',
        zIndex: '2147483644'
      });
      const wrapper = document.createElement('div');
      wrapper.style.padding = '4px 4px 2px';
      wrapper.innerHTML = themeControlMarkup();
      const control = wrapper.firstElementChild;
      control.dataset.txNativeThemeControl = 'true';
      control.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        toggleTheme();
      });
      preferences.insertAdjacentElement('afterend', wrapper);
      refreshThemeControls();
    });
  }

  function profileCandidate(element) {
    if (!(element instanceof HTMLElement) || element.tagName !== 'DIV' || element.textContent.trim() !== 'RA') return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width >= 36 && rect.width <= 40 && rect.height >= 36 && rect.height <= 40 && parseFloat(style.borderRadius) > 18;
  }

  function bindProfile() {
    if (nativeProfilePages.has(currentPage)) return;
    const trigger = [...document.querySelectorAll('#dc-root div')].find(profileCandidate);
    if (!trigger || boundProfiles.has(trigger)) return;
    boundProfiles.add(trigger);
    trigger.style.cursor = 'pointer';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-label', 'Abrir menu do perfil de Rafael Antunes');
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      if (menu) closeMenu();
      else openProfileMenu(trigger);
    });
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });
  }

  function bindComingSoon() {
    document.querySelectorAll('#dc-root span').forEach(badge => {
      if (badge.textContent.trim().toLowerCase() !== 'em breve') return;
      const item = badge.parentElement;
      if (!item || boundComingSoon.has(item)) return;
      if (item.dataset.txUnavailable === 'true') return;
      boundComingSoon.add(item);
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      const label = [...item.querySelectorAll('span')].map(span => span.textContent.trim()).find(text => text && text.toLowerCase() !== 'em breve') || 'Este módulo';
      const available = availablePages[label];
      if (available) {
        badge.textContent = available.badge;
        Object.assign(badge.style, {
          color: '#fff',
          border: '0',
          background: 'rgba(255,255,255,.14)',
          fontSize: '11.5px',
          letterSpacing: '0'
        });
        item.setAttribute('aria-label', `Abrir ${label}`);
      }
      const activate = () => {
        if (available) location.href = available.href;
        else showToast(`${label}: tela planejada para a próxima etapa do protótipo.`);
      };
      item.addEventListener('click', activate);
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });
  }

  function bindUnavailablePages() {
    Object.entries(unavailablePages).forEach(([href, label]) => {
      document.querySelectorAll(`#dc-root a[href="${href}"]`).forEach(link => {
        if (boundUnavailable.has(link)) return;
        boundUnavailable.add(link);
        link.dataset.txUnavailable = 'true';
        link.setAttribute('aria-label', `${label}, tela planejada para a próxima etapa`);
        const badge = [...link.querySelectorAll('span')].at(-1);
        if (badge && badge.textContent.trim() !== label) {
          badge.textContent = 'em breve';
          Object.assign(badge.style, {
            color: 'rgba(255,255,255,.4)',
            border: '1px solid rgba(255,255,255,.16)',
            background: 'transparent',
            fontSize: '9.5px',
            letterSpacing: '.4px'
          });
        }
        link.addEventListener('click', event => {
          event.preventDefault();
          showToast(`${label}: tela planejada para a próxima etapa do protótipo.`);
        });
      });
    });
  }

  function bindDriversNavigation() {
    if (currentPage === 'Motoristas.dc.html') return;
    const screen = document.querySelector('#dc-root [data-screen-label]');
    const sidebar = screen?.firstElementChild;
    if (!sidebar || sidebar.querySelector('[data-tx-drivers-nav]')) return;
    const academyLabel = [...sidebar.querySelectorAll('span')].find(span => span.textContent.trim() === 'Academy');
    const academyItem = academyLabel?.closest('a') || academyLabel?.parentElement;
    if (!academyItem?.parentElement) return;
    const link = document.createElement('a');
    link.href = 'Motoristas.dc.html';
    link.dataset.txDriversNav = 'true';
    link.title = 'Abrir Motoristas';
    link.setAttribute('aria-label', 'Abrir Motoristas, 42 ativos');
    Object.assign(link.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '11px',
      minHeight: '44px',
      padding: '9px 12px',
      borderRadius: '11px',
      color: 'rgba(255,255,255,.66)',
      textDecoration: 'none',
      fontSize: '14px'
    });
    link.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="5.2" r="2.4"></circle><path d="M3.8 13c.6-2.4 2-3.6 4.2-3.6s3.6 1.2 4.2 3.6"></path><path d="M5.2 11.2 8 13l2.8-1.8"></path></svg><span data-tx-responsive-label style="white-space:nowrap">Motoristas</span><span data-tx-responsive-badge style="margin-left:auto;background:rgba(255,255,255,.14);font-size:11.5px;font-weight:700;padding:1px 8px;border-radius:99px;color:#fff">42</span>';
    link.addEventListener('mouseenter', () => { link.style.background = 'rgba(255,255,255,.07)'; link.style.color = '#fff'; });
    link.addEventListener('mouseleave', () => { link.style.background = 'transparent'; link.style.color = 'rgba(255,255,255,.66)'; });
    academyItem.parentElement.insertBefore(link, academyItem);
  }

  function bindMobileNavigation() {
    if (currentPage === 'App de Campo.dc.html' || currentPage === 'Onboarding Publico.dc.html') {
      if (document.querySelector('[data-tx-back-office]')) return;
      const back = document.createElement('a');
      back.href = 'Torre de Controle v2.dc.html';
      back.dataset.txBackOffice = 'true';
      back.setAttribute('aria-label', 'Voltar ao back-office');
      Object.assign(back.style, {
        position: 'fixed',
        top: '24px',
        right: '28px',
        zIndex: '2147483000',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: '10px 16px',
        border: '1px solid rgba(9,61,68,.12)',
        borderRadius: '999px',
        background: '#fff',
        boxShadow: '0 10px 28px rgba(9,61,68,.12)',
        color: palette.tealDark,
        textDecoration: 'none',
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: '13px',
        fontWeight: '750',
        transition: 'transform .18s ease, box-shadow .18s ease'
      });
      back.innerHTML = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 3 4.5 8l5 5"></path><line x1="5" y1="8" x2="13" y2="8"></line></svg><span>Voltar ao back-office</span>';
      back.addEventListener('mouseenter', () => {
        back.style.transform = 'translateY(-1px)';
        back.style.boxShadow = '0 14px 32px rgba(9,61,68,.18)';
      });
      back.addEventListener('mouseleave', () => {
        back.style.transform = 'translateY(0)';
        back.style.boxShadow = '0 10px 28px rgba(9,61,68,.12)';
      });
      document.body.appendChild(back);
      return;
    }

    const screen = document.querySelector('#dc-root [data-screen-label]');
    const sidebar = screen?.firstElementChild;
    if (!sidebar || !sidebar.textContent.includes('Torre de Controle')) return;
    const collapse = sidebar.querySelector('[title="Recolher ou expandir o menu"]');
    if (!collapse) return;
    const navContainer = collapse.parentElement;
    const ensureAccessLink = ({ selector, dataName, href, title, aria, label, badge, icon, marginTop }) => {
      let link = sidebar.querySelector(selector);
      if (!link) {
        link = document.createElement('a');
        link.href = href;
        link.dataset[dataName] = 'true';
        link.dataset.txAccessNav = 'true';
        link.title = title;
        link.setAttribute('aria-label', aria);
        Object.assign(link.style, {
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          marginTop,
          padding: '9px 12px',
          border: '1px solid transparent',
          borderRadius: '11px',
          background: 'transparent',
          color: 'rgba(255,255,255,.72)',
          textDecoration: 'none',
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: '13.5px',
          fontWeight: '650',
          cursor: 'pointer',
          transition: 'background .18s ease, border-color .18s ease, color .18s ease'
        });
        link.innerHTML = `${icon}<span data-tx-access-label style="white-space:nowrap">${label}</span>${badge ? `<span data-tx-access-badge style="margin-left:auto;padding:1px 7px;border-radius:99px;background:rgba(255,255,255,.13);color:#fff;font-size:10px;font-weight:750;white-space:nowrap">${badge}</span>` : ''}`;
        link.addEventListener('mouseenter', () => {
          link.style.background = 'rgba(255,255,255,.1)';
          link.style.borderColor = 'rgba(255,255,255,.18)';
          link.style.color = '#fff';
        });
        link.addEventListener('mouseleave', () => {
          link.style.background = 'transparent';
          link.style.borderColor = 'transparent';
          link.style.color = 'rgba(255,255,255,.72)';
        });
        navContainer.insertBefore(link, collapse);
      }
    };

    if (currentPage !== 'Configuracoes.dc.html') {
      ensureAccessLink({
        selector: '[data-tx-settings-nav]', dataName: 'txSettingsNav', href: 'Configuracoes.dc.html',
        title: 'Abrir configurações', aria: 'Abrir Configurações', label: 'Configurações', badge: '', marginTop: '14px',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="2.3"></circle><path d="M8 1.8v1.9M8 12.3v1.9M14.2 8h-1.9M3.7 8H1.8M12.4 3.6l-1.3 1.3M4.9 11.1l-1.3 1.3M12.4 12.4l-1.3-1.3M4.9 4.9 3.6 3.6"></path></svg>'
      });
    }
    ensureAccessLink({
      selector: '[data-tx-onboarding-nav]', dataName: 'txOnboardingNav', href: 'Onboarding Publico.dc.html',
      title: 'Abrir o onboarding público', aria: 'Abrir Onboarding público, 6 passos', label: 'Onboarding público', badge: '6 passos', marginTop: currentPage === 'Configuracoes.dc.html' ? '6px' : '4px',
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13V3.8c0-.7.5-1.2 1.2-1.2h5.6c.7 0 1.2.5 1.2 1.2V13"></path><path d="M6 8h7M10.5 5.5 13 8l-2.5 2.5"></path></svg>'
    });
    ensureAccessLink({
      selector: '[data-tx-mobile-nav]', dataName: 'txMobileNav', href: 'App de Campo.dc.html',
      title: 'Abrir o protótipo mobile', aria: 'Abrir Protótipo Mobile, 12 telas', label: 'Protótipo Mobile', badge: '12 telas', marginTop: '4px',
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none" aria-hidden="true"><rect x="3.5" y="1.8" width="9" height="12.4" rx="2"></rect><line x1="6.5" y1="4" x2="9.5" y2="4"></line><circle cx="8" cy="11.7" r=".65" fill="currentColor" stroke="none"></circle></svg>'
    });

    const syncSidebar = () => {
      const expanded = sidebar.getBoundingClientRect().width > 120;
      sidebar.dataset.txSidebarState = expanded ? 'expanded' : 'collapsed';
      sidebar.querySelectorAll('[data-tx-access-nav]').forEach(link => {
        const accessLabel = link.querySelector('[data-tx-access-label]');
        const accessBadge = link.querySelector('[data-tx-access-badge]');
        if (accessLabel) accessLabel.style.display = expanded ? 'inline' : 'none';
        if (accessBadge) accessBadge.style.display = expanded ? 'inline' : 'none';
        link.style.justifyContent = expanded ? 'flex-start' : 'center';
      });
      sidebar.querySelectorAll('[data-tx-responsive-label]').forEach(label => {
        label.style.display = expanded ? 'inline' : 'none';
      });
      sidebar.querySelectorAll('[data-tx-responsive-badge]').forEach(badge => {
        badge.style.display = expanded ? 'inline' : 'none';
      });
    };
    syncSidebar();
    if (!observedSidebars.has(sidebar)) {
      const observer = new ResizeObserver(syncSidebar);
      observer.observe(sidebar);
      observedSidebars.set(sidebar, observer);
    }
  }

  function enhance() {
    ensureSidebarStyles();
    ensureThemeStyles();
    bindProfile();
    bindNativeThemeControls();
    bindComingSoon();
    bindUnavailablePages();
    // bindDriversNavigation(): Motoristas agora e link real no fonte de cada tela
    // bindMobileNavigation(): Onboarding, Configuracoes e Protótipo mobile agora sao links reais no fonte
  }

  document.addEventListener('click', event => {
    if (menu && !menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });
  addEventListener('resize', closeMenu);

  ensureThemeStyles();
  setTheme(readTheme(), { animate: false, persist: false });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();
  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });

  window.txPrototype = { showToast, openProfile: () => openModal('profile'), openPreferences: () => openModal('prefs') };
})();
