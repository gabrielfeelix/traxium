/* Traxium protótipo v2: valores de interface comuns às telas v2.
 * A marcação da sidebar, do perfil e dos modais do topo é gerada no fonte de cada tela por
 * scripts/gerar-sidebar.mjs; este arquivo só calcula os valores que ela usa (badges, sessão, toast).
 * Depende de tx-dados.js (window.TX).
 */
(function () {
  'use strict';
  const TX = window.TX;

  const TOM = {
    ok: { dot: 'linear-gradient(135deg,#48c78e,#1a8f57)', ring: 'rgba(26,143,87,.16)', c: '#1a8f57', bd: '#cfe9dc' },
    falta: { dot: 'linear-gradient(135deg,#f4c15d,#e8a33d)', ring: 'rgba(232,163,61,.2)', c: '#b97514', bd: '#f3dfb8' },
    bloqueio: { dot: 'linear-gradient(135deg,#e46969,#c43d3d)', ring: 'rgba(196,61,61,.16)', c: '#c43d3d', bd: '#f1caca' },
    tecnico: { dot: 'linear-gradient(135deg,#c43d3d,#7d2232)', ring: 'rgba(147,49,63,.2)', c: '#93313f', bd: '#ebc3c8' },
    na: { dot: '#dde5e3', ring: 'rgba(157,176,174,.14)', c: '#9db0ae', bd: '#e4eae8' },
    info: { dot: 'linear-gradient(135deg,#5b8def,#0E78B5)', ring: 'rgba(14,120,181,.16)', c: '#0E78B5', bd: '#cfe1ef' },
    autoridade: { dot: 'linear-gradient(135deg,#f4c15d,#d97544)', ring: 'rgba(217,117,68,.18)', c: '#b85a2e', bd: '#f0d3bf' }
  };
  const RES = {
    pronta: 'ok', falta: 'falta', bloqueada: 'bloqueio', tecnico: 'tecnico', cancelada: 'na', nao_assegurada: 'na'
  };
  function tom(k) { return TOM[k] || TOM.na; }
  function tomResultado(dec) { return dec.porAutoridade && dec.resultado === 'pronta' ? TOM.autoridade : tom(RES[dec.resultado]); }

  function param(nome) {
    try { return new URLSearchParams(location.search).get(nome); } catch (e) { return null; }
  }
  function lerLS(k, padrao) { try { const v = localStorage.getItem(k); return v === null ? padrao : v; } catch (e) { return padrao; } }
  function gravarLS(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } }

  function copiar(texto) {
    try {
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(texto); return true; }
    } catch (e) { /* cai no método antigo */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      return true;
    } catch (e) { return false; }
  }

  const FECHAR_POPS = { perfilOpen: false, filialOpen: false, periodoOpen: false, menuOpen: false, acoesOpen: false, buscaOpen: false, popAberto: null };

  // Chamado no componentDidMount de toda tela v2.
  function montar(c, opts) {
    const o = opts || {};
    c._txFora = ev => { if (!ev.target.closest || !ev.target.closest('[data-tx-pop]')) c.setState(FECHAR_POPS); };
    c._txEsc = ev => {
      if (ev.key !== 'Escape') return;
      if (c.state.modal || c.state.modalTopo || c.state.drawer) c.setState({ modal: null, modalTopo: null, drawer: null });
      else c.setState(FECHAR_POPS);
    };
    document.addEventListener('mousedown', c._txFora);
    document.addEventListener('keydown', c._txEsc);
    c._txOff = TX.ouvir(v => c.setState({ txv: v }));
    if (o.semCarregar) c.setState({ loading: false });
    else setTimeout(() => c.setState({ loading: false }), o.atraso || 650);
  }

  function avisar(c, msg) {
    c.setState({ toast: msg });
    clearTimeout(c._txToast);
    c._txToast = setTimeout(() => c.setState({ toast: null }), 4200);
  }

  // Estilo de opção selecionável (radio ou chip).
  function sel(on, habilitado) {
    const ok = habilitado !== false;
    return {
      bd: on ? '#127670' : ok ? '#e0e7e5' : '#eef2f1', bg: on ? '#eef7f6' : ok ? '#fff' : '#fafcfb',
      dot: on ? 'linear-gradient(135deg,#127670,#0E78B5)' : '#fff', dotBd: on ? '#127670' : '#c9d5d3',
      c: on ? '#0C5862' : ok ? '#3c4f4e' : '#9db0ae', cur: ok ? 'pointer' : 'not-allowed', op: ok ? '1' : '.5'
    };
  }
  function chip(on) {
    return { bg: on ? '#0b2224' : '#fff', c: on ? '#fff' : '#3c4f4e', bd: on ? '#0b2224' : '#e0e7e5' };
  }
  // Botão primário: habilitado só quando o obrigatório está preenchido.
  function cta(pronto) {
    return pronto
      ? { bg: 'linear-gradient(135deg,#127670,#0E78B5)', c: '#fff', sh: '0 8px 18px rgba(18,118,112,.35)', cur: 'pointer' }
      : { bg: '#eef2f1', c: '#9db0ae', sh: 'none', cur: 'not-allowed' };
  }
  function ctaPerigo(pronto) {
    return pronto
      ? { bg: 'linear-gradient(135deg,#e46969,#c43d3d)', c: '#fff', sh: '0 8px 18px rgba(196,61,61,.3)', cur: 'pointer' }
      : { bg: '#eef2f1', c: '#9db0ae', sh: 'none', cur: 'not-allowed' };
  }

  const ROTULO_PAPEL = { qualidade: 'Qualidade', direcao: 'Direção', afretador: 'Afretador', frota: 'Frota', consultoria: 'Consultoria' };

  // Valores comuns: sidebar, sessão, perfil, modais do topo e toast.
  function base(c) {
    const s = c.state;
    const recolhida = s.navC != null ? s.navC : lerLS('tx-nav', '0') === '1';
    const u = TX.sessao();
    const b = TX.badges(u);
    const cadAtiva = c.cadAtiva ? c.cadAtiva() : null;
    const cadOpen = cadAtiva ? true : (s.cadOpen != null ? s.cadOpen : lerLS('tx-nav-cad', '0') === '1');
    const sbc = {};
    ['produtos', 'manual', 'fornecedores', 'filiais'].forEach(k => {
      const on = cadAtiva === k;
      sbc[k] = { c: on ? '#fff' : 'rgba(255,255,255,.6)', bg: on ? 'rgba(255,255,255,.1)' : 'transparent', fw: on ? '700' : '500', dot: on ? '#3ddc97' : 'rgba(255,255,255,.28)' };
    });
    const filiaisTxt = u.filiais.length === 4 ? 'Todas as filiais' : u.filiais.map(f => TX.filial(f).nome).join(', ');
    const alc = u.alcada ? TX.db.alcadas.find(a => a.k === u.alcada) : null;
    const prefsOn = s.prefsOn || { venc: true, link: true, idtf: false };
    return {
      navW: recolhida ? '84px' : '264px', navPad: recolhida ? '14px' : '16px', navL: recolhida ? 'none' : 'block', navSec: recolhida ? 'none' : 'block', navFlip: recolhida ? 'rotate(180deg)' : 'none',
      navToggle: () => { const n = !recolhida; gravarLS('tx-nav', n ? '1' : '0'); c.setState({ navC: n }); },
      sbHoje: b.hoje, sbHojeD: !recolhida && b.hoje ? 'inline-block' : 'none',
      sbTransp: b.transportadores, sbTranspD: !recolhida && b.transportadores ? 'inline-block' : 'none',
      cadOpen: cadOpen && !recolhida, cadChev: cadOpen ? 'rotate(90deg)' : 'none',
      cadToggle: () => { if (cadAtiva) return; const n = !cadOpen; gravarLS('tx-nav-cad', n ? '1' : '0'); c.setState({ cadOpen: n }); },
      sbc,
      tenantNome: TX.db.tenant.nome.replace(' Ltda', ''), baseVersao: TX.db.baseIDTF.versao,
      // sessão e perfil
      uNome: u.nome, uIni: TX.fmt.iniciais(u.nome), uCargo: u.cargo, uPapel: ROTULO_PAPEL[u.papel] || u.papel, uG1: u.g1, uG2: u.g2, uEmail: u.email,
      uFiliais: filiaisTxt, uAlcada: alc ? alc.n : 'Sem alçada de liberação', uAlcadaSub: alc ? alc.libera : 'Pode conferir, registrar e pedir; liberação por autoridade fica com a Qualidade ou a Direção.',
      uAssinadas: TX.db.viagens.reduce((n, v) => n + (v.liberacoes || []).filter(l => l.assinante === u.id).length, 0),
      perfilOpen: !!s.perfilOpen,
      onPerfil: () => c.setState(st => ({ perfilOpen: !st.perfilOpen })),
      modalPerfil: s.modalTopo === 'perfil', modalPrefs: s.modalTopo === 'prefs', modalEntrar: s.modalTopo === 'entrar' || s.modalTopo === 'saiu', modalSair: s.modalTopo === 'sair',
      entrarTitulo: s.modalTopo === 'saiu' ? 'Sessão encerrada' : 'Entrar como',
      entrarSub: s.modalTopo === 'saiu' ? 'Nada foi perdido: o que você registrou continua na viagem com seu nome e a hora. Escolha quem entra agora.' : 'Demonstração: troque de usuário para ver a tela como cada papel vê. Filial, badges e alçada mudam junto.',
      abrirPerfil: () => c.setState({ modalTopo: 'perfil', perfilOpen: false }),
      abrirPrefs: () => c.setState({ modalTopo: 'prefs', perfilOpen: false }),
      abrirEntrar: () => c.setState({ modalTopo: 'entrar', perfilOpen: false }),
      abrirSair: () => c.setState({ modalTopo: 'sair', perfilOpen: false }),
      confirmarSair: () => c.setState({ modalTopo: 'saiu' }),
      fecharModalTopo: () => c.setState({ modalTopo: null }),
      pararClique: e => e.stopPropagation(),
      usuariosLista: TX.db.usuarios.map(x => {
        const on = x.id === u.id;
        const sx = sel(on);
        return { id: x.id, nome: x.nome, ini: TX.fmt.iniciais(x.nome), g1: x.g1, g2: x.g2, cargo: x.cargo,
          escopo: x.filiais.length === 4 ? 'todas as filiais' : 'filial ' + x.filiais.map(f => TX.filial(f).nome).join(', '),
          bd: sx.bd, bg: sx.bg, dot: sx.dot, dotBd: sx.dotBd,
          onClick: () => { TX.entrarComo(x.id); c.setState({ modalTopo: null }); if (c.aoTrocarUsuario) c.aoTrocarUsuario(x); avisar(c, 'Agora você está como ' + x.nome + ' (' + x.cargo.toLowerCase() + ').'); } };
      }),
      prefs: [
        { k: 'bloq', t: 'Bloqueio técnico na minha filial', sub: 'sempre ativo: requisito da certificação', lock: true },
        { k: 'link', t: 'Motorista terminou o link', sub: 'aviso na tela e no celular' },
        { k: 'venc', t: 'Documento de transportador a vencer', sub: 'aos 60, 30 e 15 dias' },
        { k: 'idtf', t: 'Nova versão da base IDTF', sub: 'quando a Traxium publicar' }
      ].map(p => {
        const on = p.lock || prefsOn[p.k];
        return Object.assign({}, p, { swBg: on ? 'linear-gradient(135deg,#127670,#0E78B5)' : '#dde5e3', swPos: on ? '19.5px' : '2.5px',
          onClick: () => { if (p.lock) { avisar(c, 'O aviso de bloqueio técnico não desliga: é requisito da certificação.'); return; } c.setState({ prefsOn: Object.assign({}, prefsOn, { [p.k]: !prefsOn[p.k] }) }); } });
      }),
      toast: !!s.toast, toastMsg: s.toast || '',
      loading: !!s.loading
    };
  }

  // Paginação padrão: 25 por página, total visível.
  function paginar(c, lista, rotulo, chave, porPagina) {
    const pp = porPagina || 25;
    const k = chave || 'pag';
    const n = Math.max(1, Math.ceil(lista.length / pp));
    const p = Math.min(c.state[k] || 1, n);
    const ini = (p - 1) * pp, fim = Math.min(p * pp, lista.length);
    return {
      itens: lista.slice(ini, fim),
      vals: {
        temPaginacao: n > 1,
        pagInfo: lista.length === 0 ? 'nenhum registro' : 'mostrando ' + (ini + 1) + ' a ' + fim + ' de ' + lista.length + ' ' + rotulo,
        paginas: Array.from({ length: n }, (_, i) => i + 1).map(x => Object.assign({ n: x, onClick: () => c.setState({ [k]: x }) }, chip(x === p))),
        pagAnt: () => { if (p > 1) c.setState({ [k]: p - 1 }); }, pagProx: () => { if (p < n) c.setState({ [k]: p + 1 }); },
        pagAntC: p > 1 ? '#3c4f4e' : '#c9d5d3', pagProxC: p < n ? '#3c4f4e' : '#c9d5d3', pagAntCur: p > 1 ? 'pointer' : 'not-allowed', pagProxCur: p < n ? 'pointer' : 'not-allowed'
      }
    };
  }

  // Abre um documento imprimível numa aba nova (exportações do protótipo).
  function exportarDocumento(titulo, html) {
    const w = window.open('', '_blank');
    if (!w) return false;
    w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + titulo + '</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;color:#1d2b2c;margin:36px 44px;font-size:12.5px;line-height:1.5}h1{font-size:19px;margin:0 0 4px}h2{font-size:14px;margin:22px 0 8px;border-bottom:1px solid #ccd6d4;padding-bottom:4px}' +
      'table{border-collapse:collapse;width:100%;margin:6px 0 10px}th,td{border:1px solid #d5dedc;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f1f5f4;font-weight:bold}.sub{color:#5c706e}.mono{font-family:Consolas,monospace}.aus{color:#a33}@media print{body{margin:14mm}}' +
      '</style></head><body>' + html + '<p class="sub" style="margin-top:28px">Gerado pelo Traxium em ' + TX.fmt.data(TX.HOJE) + '. Protótipo: dados fictícios.</p></body></html>');
    w.document.close();
    return true;
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  window.TX.ui = { tom, tomResultado, TOM, param, lerLS, gravarLS, copiar, montar, avisar, sel, chip, cta, ctaPerigo, base, paginar, exportarDocumento, esc };
})();
