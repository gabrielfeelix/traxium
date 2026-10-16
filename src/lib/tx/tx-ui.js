/* Traxium: valores de interface comuns às telas (TX.ui).
 * Porte do tx-ui.js do protótipo .dc.html. A moldura (sidebar, header, busca global, modais do
 * topo e toast) agora é um componente só, src/components/moldura/moldura.tsx; aqui ficou o que
 * as telas usam: popovers, Esc, toast, seleção, paginação, exportação, datas e a busca global
 * (que a moldura chama).
 */
import TX from './tx-dados';

(function () {
  'use strict';

  const TOM = {
    ok: { dot: 'linear-gradient(135deg,#48c78e,var(--ok))', ring: 'rgba(26,143,87,.16)', c: 'var(--ok)', bd: 'var(--ok-borda)' },
    falta: { dot: 'linear-gradient(135deg,#f4c15d,var(--aviso-2))', ring: 'rgba(232,163,61,.2)', c: 'var(--aviso)', bd: 'var(--aviso-borda)' },
    bloqueio: { dot: 'linear-gradient(135deg,#e46969,var(--perigo))', ring: 'rgba(196,61,61,.16)', c: 'var(--perigo)', bd: 'var(--perigo-borda)' },
    tecnico: { dot: 'linear-gradient(135deg,var(--perigo),#7d2232)', ring: 'rgba(147,49,63,.2)', c: 'var(--tecnico)', bd: '#ebc3c8' },
    na: { dot: '#dde5e3', ring: 'rgba(157,176,174,.14)', c: 'var(--texto-apagado)', bd: 'var(--borda)' },
    info: { dot: 'linear-gradient(135deg,#5b8def,var(--azul))', ring: 'rgba(14,120,181,.16)', c: 'var(--azul)', bd: 'var(--info-borda)' },
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

  // Área que rola dentro da moldura (no Link do motorista, a própria janela).
  function rolagem() { return (typeof document !== 'undefined' && document.querySelector('[data-tx-conteudo]')) || window; }

  // Navegação sem recarregar: a moldura registra o roteador do Next em TX.ui.roteador.
  function ir(href) {
    if (api.roteador) api.roteador.push(href);
    else location.href = href;
  }

  // A tela reescreve a própria URL (aba, filial, drawer) sem montar de novo: ChaveDaTela confere urlPropria.
  function trocarUrl(href) {
    try {
      const u = new URL(href, location.href);
      api.urlPropria = u.pathname + '?' + u.searchParams.toString();
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    } catch (e) { /* sem history */ }
  }

  // Chamado no componentDidMount de toda tela. Tudo o que liga aqui, desmontar() desliga.
  function montar(c, opts) {
    const o = opts || {};
    c._txFora = ev => { if (!ev.target.closest || !ev.target.closest('[data-tx-pop]')) c.setState(FECHAR_POPS); };
    c._txEsc = ev => {
      if (ev.key !== 'Escape') return;
      if (c.state.modal || c.state.drawer || c.state.nova) c.setState({ modal: null, drawer: null, nova: false });
      else c.setState(FECHAR_POPS);
    };
    c._txUsuario = ev => { if (c.aoTrocarUsuario) c.aoTrocarUsuario(ev.detail); };
    c._txNav = () => c.forceUpdate();
    window.addEventListener('tx-nav', c._txNav);
    document.addEventListener('mousedown', c._txFora);
    document.addEventListener('keydown', c._txEsc);
    window.addEventListener('tx-usuario', c._txUsuario);
    c._txOff = TX.ouvir(v => c.setState({ txv: v }));
    if (o.semCarregar) c.setState({ loading: false });
    else c._txCarga = setTimeout(() => c.setState({ loading: false }), o.atraso || 650);
  }
  function desmontar(c) {
    if (c._txFora) document.removeEventListener('mousedown', c._txFora);
    if (c._txEsc) document.removeEventListener('keydown', c._txEsc);
    if (c._txUsuario) window.removeEventListener('tx-usuario', c._txUsuario);
    if (c._txNav) window.removeEventListener('tx-nav', c._txNav);
    if (c._txOff) c._txOff();
    // Temporizadores guardados na tela (_tick, _txToast, _txCarga...): o protótipo .dc.html contava com o recarregar da página.
    Object.keys(c).forEach(k => { if (k[0] === '_' && typeof c[k] === 'number') { clearTimeout(c[k]); clearInterval(c[k]); } });
  }

  // Abre um modal da moldura (por exemplo "Entrar como") a partir de uma tela.
  function abrirTopo(qual) { window.dispatchEvent(new CustomEvent('tx-topo', { detail: qual })); }

  function avisar(c, msg) {
    if (api.moldura) { window.dispatchEvent(new CustomEvent('tx-aviso', { detail: msg })); return; }
    c.setState({ toast: msg });
    clearTimeout(c._txToast);
    c._txToast = setTimeout(() => c.setState({ toast: null }), 4200);
  }

  // Estilo de opção selecionável (radio ou chip).
  function sel(on, habilitado) {
    const ok = habilitado !== false;
    return {
      bd: on ? 'var(--primario)' : ok ? 'var(--borda-campo)' : 'var(--borda-suave)', bg: on ? 'var(--primario-fraco)' : ok ? '#fff' : '#fafcfb',
      dot: on ? 'linear-gradient(135deg,var(--primario),var(--azul))' : '#fff', dotBd: on ? 'var(--primario)' : 'var(--borda-forte)',
      c: on ? 'var(--primario-2)' : ok ? 'var(--texto-2)' : 'var(--texto-desab)', cur: ok ? 'pointer' : 'not-allowed', op: ok ? '1' : '.5'
    };
  }
  function chip(on) {
    return { bg: on ? 'var(--texto)' : '#fff', c: on ? '#fff' : 'var(--texto-2)', bd: on ? 'var(--texto)' : 'var(--borda-campo)' };
  }
  // Botão primário: habilitado só quando o obrigatório está preenchido.
  function cta(pronto) {
    return pronto
      ? { bg: 'linear-gradient(135deg,var(--primario),var(--azul))', c: '#fff', sh: '0 8px 18px rgba(18,118,112,.35)', cur: 'pointer' }
      : { bg: 'var(--borda-suave)', c: 'var(--texto-desab)', sh: 'none', cur: 'not-allowed' };
  }
  function ctaPerigo(pronto) {
    return pronto
      ? { bg: 'linear-gradient(135deg,#e46969,var(--perigo))', c: '#fff', sh: '0 8px 18px rgba(196,61,61,.3)', cur: 'pointer' }
      : { bg: 'var(--borda-suave)', c: 'var(--texto-desab)', sh: 'none', cur: 'not-allowed' };
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
  // Valores comuns que o conteúdo das telas usa (o resto da antiga base() é da moldura).
  function base(c) {
    const s = c.state;
    const u = TX.sessao();
    const alc = u.alcada ? TX.db.alcadas.find(a => a.k === u.alcada) : null;
    return {
      uNome: u.nome, uIni: TX.fmt.iniciais(u.nome), uCargo: u.cargo, uPapel: ROTULO_PAPEL[u.papel] || u.papel, uG1: u.g1, uG2: u.g2, uEmail: u.email,
      uAlcada: alc ? alc.n : 'Sem alçada de liberação', uAlcadaSub: alc ? alc.libera : 'Pode conferir, registrar e pedir; liberação por autoridade fica com a Qualidade ou a Direção.',
      abrirEntrar: () => abrirTopo('entrar'),
      // Sidebar recolhida (Cadastros mostra as abas na página só assim).
      navL: lerLS('tx-nav', '0') === '1' ? 'none' : 'block',
      pararClique: e => e.stopPropagation(),
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
    if (vs.length) grupos.push({ n: 'VIAGENS', total: vs.length, itens: vs.slice(0, 4).map(v => { const d = TX.decidir(v), tm = tomResultado(d); return { t: v.ordem + ', ' + TX.pessoa(v.motorista).nome, sub: TX.produto(v.produto).nome + ', ' + TX.filial(v.filial).nome + ', ' + F.curta(v.data) + ' ' + v.janela + (v.cte ? ', CT-e ' + v.cte.numero : ''), href: '/viagem?id=' + v.id, dot: tm.dot, tag: v.cancelada ? 'cancelada' : d.rotulo, tagC: tm.c }; }) });
    const ts = TX.db.transportadores.filter(t => { const p = t.pessoa ? TX.pessoa(t.pessoa) : null; return tem(TX.nomeTransportador(t)) || tem([p && p.cpf, t.cnpj, t.rntrc && t.rntrc.numero].join(' '), true); });
    if (ts.length) grupos.push({ n: 'TRANSPORTADORES', total: ts.length, itens: ts.slice(0, 3).map(t => ({ t: TX.nomeTransportador(t), sub: (t.tipo === 'TAC' ? 'TAC' : 'ETC') + (t.rntrc ? ', RNTRC ' + t.rntrc.numero : ''), href: '/transportadores?id=' + t.id, dot: TOM.info.dot, tag: '', tagC: 'var(--texto-sec)' })) });
    const comps = [];
    TX.db.placas.filter(p => p.tipo === 'carreta' && tem(p.placa)).forEach(p => (p.comps || ['C1']).forEach(pos => comps.push({ placa: p.placa, pos, dono: p.dono })));
    if (comps.length) grupos.push({ n: 'COMPARTIMENTOS', total: comps.length, itens: comps.slice(0, 3).map(c => { const h = TX.historico(c.placa, c.pos)[0]; const pr = h && h.produto ? TX.produto(h.produto) : null; return { t: c.placa + ' ' + c.pos, sub: 'última carga: ' + (pr ? pr.nome + ' em ' + F.data(h.data) : 'sem registro'), href: '/compartimento?placa=' + encodeURIComponent(c.placa) + '&pos=' + c.pos, dot: TOM.na.dot, tag: c.dono === 'propria' ? 'frota própria' : '', tagC: 'var(--texto-sec)' }; }) });
    const ps = TX.buscarProdutos(texto, 3);
    if (ps.length) grupos.push({ n: 'PRODUTOS', total: ps.length, itens: ps.map(x => { const p = x.produto || x; return { t: p.nome, sub: 'regime ' + p.regime + (p.racao ? ', pode ser ração' : ', não é ração'), href: '/cadastros?aba=produtos&q=' + encodeURIComponent(p.nome), dot: p.regime === 'X' ? TOM.bloqueio.dot : TOM.ok.dot, tag: '', tagC: 'var(--texto-sec)' }; }) });
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
        pagAntC: p > 1 ? 'var(--texto-2)' : 'var(--borda-forte)', pagProxC: p < n ? 'var(--texto-2)' : 'var(--borda-forte)', pagAntCur: p > 1 ? 'pointer' : 'not-allowed', pagProxCur: p < n ? 'pointer' : 'not-allowed'
      }
    };
  }

  // Abre um documento imprimível numa aba nova (exportações do protótipo).
  function exportarDocumento(titulo, html) {
    const w = window.open('', '_blank');
    if (!w) return false;
    w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' + titulo + '</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;color:#1d2b2c;margin:36px 44px;font-size:12.5px;line-height:1.5}h1{font-size:19px;margin:0 0 4px}h2{font-size:14px;margin:22px 0 8px;border-bottom:1px solid #ccd6d4;padding-bottom:4px}' +
      'table{border-collapse:collapse;width:100%;margin:6px 0 10px}th,td{border:1px solid #d5dedc;padding:5px 8px;text-align:left;vertical-align:top}th{background:#f1f5f4;font-weight:bold}.sub{color:var(--texto-sec)}.mono{font-family:Consolas,monospace}.aus{color:#a33}@media print{body{margin:14mm}}' +
      '</style></head><body>' + html + '<p class="sub" style="margin-top:28px">Gerado pelo Traxium em ' + TX.fmt.data(TX.HOJE) + '. Protótipo: dados fictícios.</p></body></html>');
    w.document.close();
    return true;
  }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  const api = { roteador: null, moldura: false, urlPropria: null, trocarUrl, rolagem, ir, desmontar, abrirTopo, ROTULO_PAPEL, mascaraData, dataIso, avisoData, pedirLiberacao, nomeAlcada, buscaGlobal, tom, tomResultado, TOM, param, lerLS, gravarLS, copiar, montar, avisar, sel, chip, cta, ctaPerigo, base, paginar, exportarDocumento, esc };
  TX.ui = api;
})();

export default TX;
