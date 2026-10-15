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
      if (c.state.modal || c.state.modalTopo || c.state.drawer || c.state.nova) c.setState({ modal: null, modalTopo: null, drawer: null, nova: false });
      else c.setState(FECHAR_POPS);
    };
    c._txBarra = ev => {
      if (ev.key !== '/' || ev.ctrlKey || ev.metaKey) return;
      const t = ev.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const el = document.querySelector('[data-tx-gbusca]'); if (el) { ev.preventDefault(); el.focus(); }
    };
    document.addEventListener('keydown', c._txBarra);
    document.addEventListener('mousedown', c._txFora);
    document.addEventListener('keydown', c._txEsc);
    c._txOff = TX.ouvir(v => c.setState({ txv: v }));
    // Abaixo de 1280 px a página rola de lado; o header fixo acompanha, alinhado ao conteúdo.
    c._txHeader = () => {
      const h = document.querySelector('[data-tx-header]'); if (!h) return;
      const sobra = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      h.style.right = sobra ? -sobra + 'px' : '0';
      h.style.transform = window.scrollX ? 'translateX(' + -window.scrollX + 'px)' : 'none';
    };
    window.addEventListener('scroll', c._txHeader, { passive: true });
    window.addEventListener('resize', c._txHeader);
    c._txAltura = () => { const b = window.innerHeight < 730; if (b !== c._txBaixa) { c._txBaixa = b; c.setState({ txAlt: b }); } };
    window.addEventListener('resize', c._txAltura);
    setTimeout(c._txHeader, 0);
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
  // Data digitada em DD/MM/AAAA: o campo nativo mostra o formato do idioma do navegador, o que engana numa tela de escritório.
  function mascaraData(t) { const d = TX.soDigitos(t).slice(0, 8); return d.length > 4 ? d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4) : d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }
  function dataIso(t) { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t || ''); if (!m) return null; const dt = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])); return dt.getUTCFullYear() === +m[3] && dt.getUTCMonth() === +m[2] - 1 && dt.getUTCDate() === +m[1] ? m[3] + '-' + m[2] + '-' + m[1] : null; }
  function avisoData(t) { return (t || '').length === 10 && !dataIso(t) ? 'Data inválida' : ''; }

  // Pedido de liberação de quem não tem a alçada: grava e avisa quem assina (Hoje e Viagem).
  function nomeAlcada(k) { return (TX.db.alcadas.find(a => a.k === k) || {}).n || k; }
  function pedirLiberacao(c, v, lib) {
    TX.fazer('pedirLiberacao', { id: v.id, checagem: lib.item.k, alcada: lib.alcada });
    const quem = TX.db.usuarios.filter(x => x.filiais.includes(v.filial) && TX.podeAssinar(x, lib.alcada)).sort((a, b) => (a.alcada === lib.alcada ? 0 : 1) - (b.alcada === lib.alcada ? 0 : 1))[0];
    avisar(c, 'Pedido enviado' + (quem ? ' a ' + quem.nome + ' (' + nomeAlcada(lib.alcada) + ')' : '') + '. A ' + v.ordem + ' entra na fila de assinatura com o prazo das ' + v.janela + '.');
  }
  // Item ativo da sidebar escolhido pelo dado, nas telas de detalhe com mais de um pai possível.
  function sbAtivo(k) {
    const on = 'background:linear-gradient(90deg,rgba(26,158,147,.35),rgba(14,120,181,.28));border:1px solid rgba(255,255,255,.14);font-weight:700;color:#fff';
    const off = 'border:1px solid transparent;color:rgba(255,255,255,.66)';
    return { frota: k === 'frota' ? on : off, transportadores: k === 'transportadores' ? on : off };
  }
  function base(c) {
    const s = c.state;
    const recolhida = s.navC != null ? s.navC : lerLS('tx-nav', '0') === '1';
    const baixa = typeof window !== 'undefined' && window.innerHeight < 730;
    const u = TX.sessao();
    const b = TX.badges(u);
    const cadAtiva = c.cadAtiva ? c.cadAtiva() : null;
    const cadOpen = cadAtiva ? true : (s.cadOpen != null ? s.cadOpen : lerLS('tx-nav-cad', '1') === '1');
    const sbc = {};
    ['produtos', 'manual', 'fornecedores', 'filiais'].forEach(k => {
      const on = cadAtiva === k;
      sbc[k] = { c: on ? '#fff' : 'rgba(255,255,255,.6)', bg: on ? 'rgba(255,255,255,.1)' : 'transparent', fw: on ? '700' : '500', dot: on ? '#3ddc97' : 'rgba(255,255,255,.28)' };
    });
    const filiaisTxt = u.filiais.length === 4 ? 'Todas as filiais' : u.filiais.map(f => TX.filial(f).nome).join(', ');
    const alc = u.alcada ? TX.db.alcadas.find(a => a.k === u.alcada) : null;
    const prefsOn = s.prefsOn || { venc: true, link: true, idtf: false };
    return {
      // Tela baixa (abaixo de 730 px; num notebook de 768 px sobram cerca de 660 úteis): itens mais justos e sem a faixa da base IDTF.
      sbPad: baixa ? '6px 12px' : '8px 12px', sbSubPad: baixa ? '3px 12px 3px 39px' : '5px 12px 5px 39px', sbGrupoPad: baixa ? '6px 12px 2px' : '10px 12px 3px', sbBaseD: recolhida || baixa ? 'none' : 'block',
      navW: recolhida ? '84px' : '264px', navPad: recolhida ? '14px' : '16px', navL: recolhida ? 'none' : 'block', navSec: recolhida ? 'block' : 'none', navFlip: recolhida ? 'rotate(180deg)' : 'none',
      navToggle: () => { const n = !recolhida; gravarLS('tx-nav', n ? '1' : '0'); c.setState({ navC: n }); },
      sbHoje: b.hoje, sbHojeD: !recolhida && b.hoje ? 'inline-block' : 'none',
      sbTransp: b.transportadores, sbTranspD: !recolhida && b.transportadores ? 'inline-block' : 'none',
      cadOpen: cadOpen && !recolhida, cadChev: cadOpen ? 'rotate(90deg)' : 'none',
      cadToggle: () => { if (cadAtiva) return; const n = !cadOpen; gravarLS('tx-nav-cad', n ? '1' : '0'); c.setState({ cadOpen: n }); },
      sbc, sbd: sbAtivo(c.sbAtivo ? c.sbAtivo() : null),
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
      // busca global do header
      gbQ: s.gbQ || '', gbBd: s.buscaOpen ? '#127670' : '#e0e7e5',
      onGb: e => c.setState({ gbQ: e.target.value, buscaOpen: true }),
      gbTecla: e => { if (e.key === 'Enter') { const g = buscaGlobal(e.target.value); const prim = g[0] && g[0].itens[0]; location.href = prim ? prim.href : 'Viagens v2.dc.html?periodo=tudo&q=' + encodeURIComponent(e.target.value); } },
      gbAberta: !!s.buscaOpen && TX.norm(s.gbQ || '').length >= 2,
      gbGrupos: s.buscaOpen ? buscaGlobal(s.gbQ || '') : [],
      gbVazio: !!s.buscaOpen && buscaGlobal(s.gbQ || '').length === 0,
      gbVazioTxt: 'Nada encontrado para "' + (s.gbQ || '') + '". A busca aceita ordem, CT-e, NF, placa, nome, CPF, RNTRC e produto.',
      gbTodasRot: 'Buscar "' + (s.gbQ || '') + '" em todas as viagens', gbTodasHref: 'Viagens v2.dc.html?periodo=tudo&q=' + encodeURIComponent(s.gbQ || ''),
      toast: !!s.toast, toastMsg: s.toast || '',
      loading: !!s.loading
    };
  }

  // Busca global do header: viagem, placa e compartimento, transportador e produto, no escopo do usuário.
  function buscaGlobal(texto) {
    const q = TX.norm(texto), qd = TX.soDigitos(texto);
    if (q.length < 2) return [];
    const F = TX.fmt, u = TX.sessao();
    const tem = (s, dig) => TX.norm(s).includes(q) || (qd.length >= 3 && dig && TX.soDigitos(s).includes(qd));
    const grupos = [];
    const vs = TX.db.viagens.filter(v => u.filiais.includes(v.filial)).filter(v => {
      const conj = TX.conjunto(v.conjunto);
      return tem([v.ordem, v.id].join(' '), true) || (v.cte && tem(v.cte.numero + ' ' + v.cte.nf, true)) || tem(TX.placasDoConjunto(conj).join(' ')) || tem(TX.pessoa(v.motorista).nome);
    }).sort((a, b) => (b.data + b.janela).localeCompare(a.data + a.janela));
    if (vs.length) grupos.push({ n: 'VIAGENS', total: vs.length, itens: vs.slice(0, 4).map(v => { const d = TX.decidir(v), tm = tomResultado(d); return { t: v.ordem + ', ' + TX.pessoa(v.motorista).nome, sub: TX.produto(v.produto).nome + ', ' + TX.filial(v.filial).nome + ', ' + F.curta(v.data) + ' ' + v.janela + (v.cte ? ', CT-e ' + v.cte.numero : ''), href: 'Viagem.dc.html?id=' + v.id, dot: tm.dot, tag: v.cancelada ? 'cancelada' : d.rotulo, tagC: tm.c }; }) });
    const ts = TX.db.transportadores.filter(t => { const p = t.pessoa ? TX.pessoa(t.pessoa) : null; return tem(TX.nomeTransportador(t)) || tem([p && p.cpf, t.cnpj, t.rntrc && t.rntrc.numero].join(' '), true); });
    if (ts.length) grupos.push({ n: 'TRANSPORTADORES', total: ts.length, itens: ts.slice(0, 3).map(t => ({ t: TX.nomeTransportador(t), sub: (t.tipo === 'TAC' ? 'TAC' : 'ETC') + (t.rntrc ? ', RNTRC ' + t.rntrc.numero : ''), href: 'Transportadores.dc.html?id=' + t.id, dot: TOM.info.dot, tag: '', tagC: '#5c706e' })) });
    const comps = [];
    TX.db.placas.filter(p => p.tipo === 'carreta' && tem(p.placa)).forEach(p => (p.comps || ['C1']).forEach(pos => comps.push({ placa: p.placa, pos, dono: p.dono })));
    if (comps.length) grupos.push({ n: 'COMPARTIMENTOS', total: comps.length, itens: comps.slice(0, 3).map(c => { const h = TX.historico(c.placa, c.pos)[0]; const pr = h && h.produto ? TX.produto(h.produto) : null; return { t: c.placa + ' ' + c.pos, sub: 'última carga: ' + (pr ? pr.nome + ' em ' + F.data(h.data) : 'sem registro'), href: 'Compartimento v2.dc.html?placa=' + encodeURIComponent(c.placa) + '&pos=' + c.pos, dot: TOM.na.dot, tag: c.dono === 'propria' ? 'frota própria' : '', tagC: '#5c706e' }; }) });
    const ps = TX.buscarProdutos(texto, 3);
    if (ps.length) grupos.push({ n: 'PRODUTOS', total: ps.length, itens: ps.map(x => { const p = x.produto || x; return { t: p.nome, sub: 'regime ' + p.regime + (p.racao ? ', pode ser ração' : ', não é ração'), href: 'Cadastros.dc.html?aba=produtos&q=' + encodeURIComponent(p.nome), dot: p.regime === 'X' ? TOM.bloqueio.dot : TOM.ok.dot, tag: '', tagC: '#5c706e' }; }) });
    return grupos;
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

  window.TX.ui = { mascaraData, dataIso, avisoData, pedirLiberacao, nomeAlcada, buscaGlobal, tom, tomResultado, TOM, param, lerLS, gravarLS, copiar, montar, avisar, sel, chip, cta, ctaPerigo, base, paginar, exportarDocumento, esc };
})();
