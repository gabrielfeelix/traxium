// Gerado de "SaaS moderno estilo Dribbble/Hoje.dc.html" por scripts/converter-dc.mjs.
'use client';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Aviso,
  Badge,
  Botao,
  CabecalhoPagina,
  Campo,
  Cartao,
  Chip,
  Entrada,
  EntradaCaixa,
  Escolhas,
  EstadoVazio,
  Modal,
  OpcaoCartao,
  Selecao,
  CampoData,
  Situacao,
  listaFalta,
} from '@/components/ui';
import './Hoje.css';

// Permissões do usuário atual. TX.pode chega com a revisão do motor (M40); até lá vale a premissa
// da matriz: consultoria só lê e exporta, frota só mexe no escopo da frota própria.
function pode(op, alvo) {
  if (TX.pode) return TX.pode(op, alvo);
  const papel = TX.sessao().papel;
  if (papel === 'consultoria') return false;
  if (papel === 'frota') return op === 'escopoFrota' || op === 'atualizarDocumento';
  return true;
}
// Motivo em forma de falha (M09, M42). O motor passa a devolver item.motivo ou TX.rotuloFalha;
// até lá, o mapa da mesa para as checagens escritas como afirmação positiva.
const FALHA = {
  ocorrencia: 'transportador em revisão após ocorrência grave',
  'docs-conj': 'CRLV vencido no conjunto',
  'docs-mot': 'CNH vencida',
  'docs-transp': 'RNTRC vencido',
  produto: 'produto não é ração',
};
function motivoFalha(f, dec) {
  if (!f) return '';
  if (f.motivo) return f.motivo;
  const r = TX.rotuloFalha ? TX.rotuloFalha(f.k) : '';
  if (r) return r;
  if (FALHA[f.k]) return FALHA[f.k];
  if (dec && dec.cobertura === 'gatekeeper' && f.k === 'cobertura') return 'filial sem comunicação ao organismo certificador';
  return f.o.toLowerCase();
}

const IconeBusca = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const Chevron = (
  <svg
    className="tx-hoje-chevron"
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 4.5 6 7.5l3-3" />
  </svg>
);
const IconePdf = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 2H4.5A1.5 1.5 0 0 0 3 3.5v9A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V6z" />
    <path d="M9 2v4h4" />
  </svg>
);

export default class Hoje extends Tela {
  state = { loading: true, busca: '', abertos: { falta: true, bloq: true, pronta: false }, nova: false };
  componentDidMount() {
    TX.ui.montar(this);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  filialAtual() {
    const u = TX.sessao();
    const p = this.state.filial || TX.ui.param('filial') || TX.ui.lerLS('tx-v2-filial', null);
    if (u.filiais.length === 1) return u.filiais[0];
    if (p === 'todas' || (p && u.filiais.includes(p))) return p;
    return 'todas';
  }
  setFilial(f) {
    TX.ui.gravarLS('tx-v2-filial', f);
    this.setState({ filial: f, filialOpen: false });
    try {
      TX.ui.trocarUrl('/hoje?filial=' + f);
    } catch (e) {}
  }
  aoTrocarUsuario() {
    this.setState({ filial: null });
  }
  renderVals() {
    return Object.assign({}, TX.ui.base(this), this.telaVals(), this.novaVals());
  }

  linha(v) {
    const U = TX.ui,
      F = TX.fmt;
    const dec = TX.decidir(v),
      le = TX.linkEstado(v);
    const mot = TX.pessoa(v.motorista),
      conj = TX.conjunto(v.conjunto),
      t = TX.transportador(v.transportador),
      prod = TX.produto(v.produto),
      dest = TX.destinatario(v.destinatario);
    const tomR = U.tomResultado(dec);
    const ck = v.checklist,
      vf = v.verificacao,
      l = v.link || {};
    const conferir = dec.falta.some((f) => f.k === 'verificacao' && /esperando conferência/.test(f.detalhe));
    const gk = dec.cobertura === 'gatekeeper';
    const fz = (on, atual) => (on ? 'ok' : atual ? 'atual' : 'nada');
    const etapas = [
      { tip: 'link enviado', estado: fz(!!l.enviadoEm, !l.enviadoEm) },
      { tip: 'três últimas cargas', estado: fz(dec.t3.every((c) => c.completo) && dec.t3.length, !!l.abertoEm) },
      { tip: 'checklist com fotos', estado: fz(ck && ck.enviadoEm, !!l.abertoEm) },
      {
        tip: 'conferência do afretador',
        estado: fz(vf && vf.estado === 'aprovada' && !conferir, conferir || (vf && vf.estado === 'devolvida')),
      },
      { tip: gk ? 'termo assinado' : 'ciência do manual', estado: fz(gk ? !!v.termo : !!v.manual, !!l.abertoEm) },
    ];
    const linkTom =
      { nao_enviado: 'falta', enviado: 'info', aberto: 'info', preenchendo: 'info', concluido: 'ok', cancelado: 'na' }[le.k] || 'na';
    const f0 = dec.falta[0];
    const lib = TX.liberacaoDe(v);
    let falta, faltaTom, quem;
    if (dec.resultado === 'pronta') {
      const alertas = dec.alertas || (dec.checagens || []).filter((c) => c.aviso).map((c) => ({ motivo: c.nome }));
      falta = dec.porAutoridade ? 'Liberada por autoridade' : 'Pronta para assegurar';
      if (alertas.length) falta += alertas.length === 1 ? ', 1 alerta' : ', ' + alertas.length + ' alertas';
      faltaTom = dec.porAutoridade ? 'autoridade' : 'ok';
      quem = alertas.length ? 'Alerta: ' + alertas[0].motivo + '; declaração liberada' : 'declaração do CT-e liberada';
    } else {
      falta =
        dec.resultado === 'tecnico'
          ? 'Bloqueio técnico: ' + f0.detalhe.split(':')[0]
          : dec.resultado === 'bloqueada'
            ? 'Bloqueada: ' + motivoFalha(f0, dec)
            : f0.o;
      faltaTom = tomR.k;
      quem = dec.falta.length > 1 ? f0.quem + ' e mais ' + (dec.falta.length - 1) : f0.quem;
    }
    // M43: bloqueio mantido sai da fila de assinatura e a mesa mostra a decisão.
    if (lib && lib.mantido) quem = lib.decisao;
    else if (lib && lib.pedido)
      quem = 'liberação pedida às ' + F.hora(lib.pedido.em) + ', esperando assinatura de ' + this.nomeAlcada(lib.alcada);
    let acao = null;
    if (le.k === 'nao_enviado' && !v.cancelada) {
      if (pode('enviarLink', v)) acao = { k: 'link', n: 'Enviar link', fn: () => this.mandarLink(v), prim: true };
    } else if (conferir && pode('conferir', v))
      acao = {
        k: 'conferir',
        n: 'Conferir fotos',
        fn: () => {
          TX.ui.ir('/viagem?id=' + v.id + '#tx-verif');
        },
        prim: true,
      };
    else if (dec.resultado === 'bloqueada' && lib) {
      if (TX.podeAssinar(TX.sessao(), lib.alcada))
        acao = {
          k: 'liberar',
          n: 'Liberar',
          fn: () => {
            TX.ui.ir('/viagem?id=' + v.id + '&liberar=1');
          },
          prim: true,
        };
      else if (!lib.pedido && lib.podePedir !== false && pode('pedirLiberacao', v))
        acao = { k: 'pedir', n: 'Pedir liberação', fn: () => this.pedirLiberacao(v, lib), prim: false };
    } else if (dec.resultado === 'tecnico' && !v.cte && pode('trocarConjunto', v)) {
      // M05: o caminho do bloqueio técnico é trocar o conjunto, ação do afretador.
      acao = { k: 'trocar', n: 'Trocar conjunto', fn: () => TX.ui.ir('/viagem?id=' + v.id + '&trocar=1'), prim: false };
    } else if (dec.resultado === 'pronta')
      acao = {
        k: 'declaracao',
        n: 'Copiar declaração',
        fn: () => {
          U.copiar(TX.DECLARACAO_CTE);
          this.avisar('Declaração copiada: "' + TX.DECLARACAO_CTE + '". Cole no CT-e da ' + v.ordem + '.');
        },
        prim: false,
      };
    const etapasOk = etapas.filter((e) => e.estado === 'ok').length;
    // U19: sem botão, a linha diz de quem é a vez.
    const espera = acao
      ? ''
      : ['enviado', 'aberto', 'preenchendo'].includes(le.k)
        ? 'Aguardando motorista'
        : lib && lib.pedido
          ? 'Aguardando assinatura'
          : dec.resultado === 'pronta'
            ? ''
            : 'Sem ação nesta mesa';
    const min = +v.janela.slice(0, 2) * 60 + +v.janela.slice(3, 5);
    const hm = TX.agoraHM();
    const ag = +hm.slice(0, 2) * 60 + +hm.slice(3, 5);
    const dif = min - ag;
    return {
      id: v.id,
      href: '/viagem?id=' + v.id,
      janela: v.janela,
      prazo:
        v.data !== TX.HOJE ? F.curta(v.data) : dif < 0 ? 'passou' : dif < 120 ? 'em ' + dif + ' min' : 'em ' + Math.round(dif / 60) + ' h',
      urgente: v.data === TX.HOJE && dif < 120 && dec.resultado !== 'pronta',
      ini: F.iniciais(mot.nome),
      g1: mot.g1,
      g2: mot.g2,
      anel: tomR.k,
      motorista: mot.nome,
      tipo: v.tipo === 'propria' ? 'frota própria' : t.tipo === 'ETC' ? t.nome.replace(' Ltda', '') : 'TAC',
      produto: prod.nome,
      destino: dest.nome,
      ordem: v.ordem,
      placas: TX.placasDoConjunto(conj).join(' '),
      etapas,
      etapasRot: etapasOk + ' de ' + etapas.length + ' no link',
      espera,
      linkRot: le.n,
      linkTom,
      linkHora: le.em ? F.hora(le.em) : l.enviadoEm ? F.hora(l.enviadoEm) : '',
      pulso: le.k === 'preenchendo' || le.k === 'aberto',
      falta,
      faltaTom,
      quem,
      temAcao: !!acao,
      acao: acao ? acao.n : '',
      acaoK: acao ? acao.k : '',
      onAcao: acao ? acao.fn : null,
      acaoPrim: !!(acao && acao.prim),
      _r: dec.resultado,
      _busca: TX.norm(
        [v.ordem, v.id, mot.nome, prod.nome, dest.nome, TX.placasDoConjunto(conj).join(' '), TX.nomeTransportador(t)].join(' '),
      ),
    };
  }
  nomeAlcada(k) {
    return TX.ui.nomeAlcada(k);
  }
  pedirLiberacao(v, lib) {
    TX.ui.pedirLiberacao(this, v, lib);
  }
  mandarLink(v) {
    TX.ui.copiar(TX.mensagemLink(v));
    TX.fazer('enviarLink', { id: v.id, canal: 'copiado' });
    this.avisar(
      'Mensagem copiada para ' + TX.pessoa(v.motorista).nome.split(' ')[0] + '. Cole no WhatsApp; a linha mostra quando ele abrir.',
    );
  }

  telaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const u = TX.sessao();
    const fil = this.filialAtual();
    const todas = fil === 'todas';
    const hora = +TX.agoraHM().slice(0, 2);
    const saudacao = (hora < 12 ? 'Bom dia, ' : hora < 18 ? 'Boa tarde, ' : 'Boa noite, ') + u.nome.split(' ')[0];
    const dataTxt = F.extenso(TX.HOJE).replace(/^./, (c) => c.toUpperCase());
    const base = {
      // Cabeçalho de mesa: saudação (painel) ou filial (mesa), data, filtro de filial, ação primária.
      titulo: todas ? saudacao : 'Hoje em ' + TX.filial(fil).nome,
      subtitulo: todas ? dataTxt + ', ' + u.filiais.length + ' filiais' : dataTxt,
      // U09: o gestor que abriu a mesa de uma filial volta ao painel pelo cabeçalho.
      voltarTodas: !todas && u.filiais.length > 1 ? () => this.setFilial('todas') : null,
      temNova: pode('criarViagem'),
      somenteLeitura: u.papel === 'consultoria',
      buscaRot: todas ? 'Filtrar o painel' : 'Filtrar esta mesa',
      buscaDica: todas
        ? 'Filtra o que precisa de você, as filiais, as pendências e os vencimentos'
        : 'Filtra só as viagens desta mesa: placa, ordem ou motorista',
      limparBusca: () => this.setState({ busca: '' }),
      busca: s.busca,
      onBusca: (e) => this.setState({ busca: e.target.value }),
      temFiliais: u.filiais.length > 1,
      filialOpen: !!s.filialOpen,
      onFilial: () => this.setState({ filialOpen: !s.filialOpen }),
      filialRot: todas ? 'Todas as filiais' : 'Filial ' + TX.filial(fil).nome,
      filiais: (u.filiais.length > 1 ? ['todas'] : []).concat(u.filiais).map((id) => {
        const on = id === fil;
        const q = TX.viagensDoDia(id).filter((v) => !v.cancelada).length;
        return {
          id,
          n: id === 'todas' ? 'Todas as filiais' : TX.filial(id).nome + ' ' + TX.filial(id).uf,
          q: q + ' hoje',
          on,
          onClick: () => this.setFilial(id),
        };
      }),
      skel: [1, 2, 3, 4, 5],
      modoMesa: !s.loading && !todas,
      modoPainel: !s.loading && todas,
      abrirNova: () =>
        this.setState({
          nova: true,
          nPasso: 1,
          nProd: null,
          nProdBusca: '',
          nOrdem: '',
          nEmb: null,
          nDest: null,
          nDiaTxt: TX.fmt.data(TX.HOJE),
          nFil: null,
          nConjT: null,
          nMotT: null,
          nJanela: '16:00',
          nPeso: '37',
          nPdf: null,
          nTipo: 'terceiro',
          nQuem: '',
          nSel: null,
          cmNome: '',
          cmTel: '',
          cmCpf: '',
          cmPlacas: '',
          nCriada: null,
          nTentou1: false,
          nTentou2: false,
        }),
    };
    if (todas) return Object.assign(base, u.papel === 'frota' ? this.frotaVals(u) : this.painelVals(u));
    const q = TX.norm(s.busca);
    const linhas = TX.viagensDoDia(fil)
      .filter((v) => !v.cancelada)
      .map((v) => this.linha(v))
      .filter((l) => !q || l._busca.includes(q))
      .sort((a, b) => a.janela.localeCompare(b.janela));
    const g = (k) =>
      linhas.filter((l) =>
        k === 'bloq'
          ? l._r === 'bloqueada' || l._r === 'tecnico'
          : k === 'pronta'
            ? l._r === 'pronta' || l._r === 'nao_assegurada'
            : l._r === 'falta',
      );
    const abertos = s.abertos;
    const GR = [
      ['falta', 'Falta algo', U.tom('falta'), 'o que falta e quem resolve, por ordem de carregamento'],
      ['bloq', 'Bloqueadas', U.tom('bloqueio'), 'cada uma diz o motivo e o caminho'],
      ['pronta', 'Prontas para assegurar', U.tom('ok'), 'declaração do CT-e liberada'],
    ];
    const grupos = GR.map(([k, n, tm, sub]) => {
      const ls = g(k);
      return {
        k,
        n,
        q: ls.length,
        sub,
        ancora: 'tx-grupo-' + k,
        tom: tm.k,
        aberto: !!abertos[k] && ls.length > 0,
        linhas: ls,
        toggleRot: ls.length ? (abertos[k] ? 'Recolher' : 'Mostrar') : '',
        toggle: () => this.setState({ abertos: Object.assign({}, abertos, { [k]: !abertos[k] }) }),
      };
    }).filter((x) => x.q > 0);
    const irGrupo = (k) => () => {
      this.setState({ abertos: Object.assign({}, abertos, { [k]: true }) });
      setTimeout(() => {
        const el = document.getElementById('tx-grupo-' + k);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    };
    const RES = [
      ['falta', 'falta algo', U.tom('falta')],
      ['bloq', 'bloqueadas', U.tom('bloqueio')],
      ['pronta', 'prontas', U.tom('ok')],
    ];
    const noLink = linhas.filter((l) => /preenchimento|aberto/.test(l.linkRot)).length;
    const tot = Math.max(1, linhas.length);
    return Object.assign(base, {
      temResumo: linhas.length > 0 && !q,
      resTotal: linhas.length,
      resTotalRot: linhas.length === 1 ? 'viagem hoje' : 'viagens hoje',
      resSeg: RES.map(([k]) => ({ k, w: (g(k).length / tot) * 100 + '%' })).filter((x) => x.w !== '0%'),
      resItens: RES.filter(([k]) => g(k).length).map(([k, n, tm]) => ({
        k,
        n: ' ' + n,
        q: g(k).length,
        tom: tm.k,
        onClick: irGrupo(k),
      })),
      temNoLink: noLink > 0,
      noLinkRot: noLink === 1 ? '1 motorista no link agora' : noLink + ' motoristas no link agora',
      grupos,
      mesaVazia: linhas.length === 0,
      vazioTitulo: q ? 'Nada encontrado' : 'Nenhuma viagem hoje em ' + TX.filial(fil).nome,
      vazioSub: q
        ? 'Nenhuma viagem de hoje bate com "' + s.busca + '". Busque por placa, ordem ou nome do motorista.'
        : 'Crie a viagem a partir da ordem de carregamento em Nova viagem.',
    });
  }

  // Prazo até a janela de carregamento: "em 40 min", "em 6 h", "passou" ou a data.
  prazoDe(v) {
    const F = TX.fmt;
    if (v.data !== TX.HOJE) return { t: F.curta(v.data), urgente: false };
    const hm = TX.agoraHM();
    const dif = +v.janela.slice(0, 2) * 60 + +v.janela.slice(3, 5) - (+hm.slice(0, 2) * 60 + +hm.slice(3, 5));
    return { t: dif < 0 ? 'passou' : dif < 120 ? 'em ' + dif + ' min' : 'em ' + Math.round(dif / 60) + ' h', urgente: dif < 120 };
  }
  // Vencimento como linha de lista. U17: "Certificado GMP+ GMP+ FSA" sem a palavra repetida.
  vencLinha(x) {
    const ref = /GMP\+/.test(x.tipo) ? String(x.ref).replace(/^GMP\+\s*/, '') : x.ref;
    return {
      k: x.tipo + x.ref + x.dono,
      t: x.tipo + ' ' + ref,
      dono: x.dono,
      href: x.href,
      d: x.estado === 'vencido' ? 'vencido' : 'em ' + x.dias + ' dias',
      tom: x.estado === 'vencido' || x.dias <= 15 ? 'perigo' : x.dias <= 30 ? 'aviso' : 'sec',
      _busca: TX.norm([x.tipo, x.ref, x.dono].join(' ')),
    };
  }

  painelVals(u) {
    const s = this.state,
      F = TX.fmt;
    const q = TX.norm(s.busca);
    const bate = (txt) => !q || txt.includes(q);
    const pr = TX.prontidao('todas');
    const pend = TX.pendenciasRegistro('todas');
    const venc = TX.vencimentos(60);
    const vencidos = venc.filter((x) => x.estado === 'vencido').length;
    const hojeTodas = TX.viagensDoDia('todas').filter((v) => !v.cancelada);
    const assegPeriodo = TX.db.viagens.filter(
      (v) => !v.cancelada && v.assegurada && v.data >= TX.addDias(TX.HOJE, -45) && v.data <= TX.HOJE,
    );
    const gk = assegPeriodo.filter((v) => TX.coberturaDe(v) === 'gatekeeper').length;
    const sim = TX.db.simulacoes[TX.db.simulacoes.length - 1];
    const v15 = venc.filter((x) => x.dias <= 15).length,
      v30 = venc.filter((x) => x.dias > 15 && x.dias <= 30).length,
      v60 = venc.filter((x) => x.dias > 30).length,
      vt = Math.max(1, venc.length);
    const fila = TX.filaAssinatura(u);
    const alcN = this.nomeAlcada(u.alcada);
    const buscaV = (v) =>
      TX.norm(
        [v.ordem, v.id, TX.pessoa(v.motorista).nome, TX.filial(v.filial).nome, TX.placasDoConjunto(TX.conjunto(v.conjunto)).join(' ')].join(
          ' ',
        ),
      );
    // "Precisa de você": o que a alçada da pessoa assina, depois o que espera alçada acima (só para ver).
    const precisa = fila.minhas
      .filter((x) => bate(buscaV(x.viagem)))
      .map((x) => {
        const v = x.viagem,
          pz = this.prazoDe(v);
        return {
          id: v.id,
          minha: true,
          href: '/viagem?id=' + v.id + '&liberar=1',
          janela: v.janela,
          prazo: pz.t,
          urgente: pz.urgente,
          motorista: TX.pessoa(v.motorista).nome,
          ordem: v.ordem,
          filial: TX.filial(v.filial).nome,
          motivo: motivoFalha(x.item, TX.decidir(v)).replace(/^./, (c) => c.toUpperCase()),
          detalhe: x.item.detalhe,
          pedido: x.pedido
            ? 'pedida por ' + TX.usuario(x.pedido.por).nome.split(' ')[0] + ' às ' + F.hora(x.pedido.em)
            : 'sem pedido da filial',
          pedidoFeito: !!x.pedido,
        };
      })
      .concat(
        fila.acima
          .filter((x) => bate(buscaV(x.viagem)))
          .map((x) => {
            const v = x.viagem,
              pz = this.prazoDe(v);
            return {
              id: v.id,
              minha: false,
              href: '/viagem?id=' + v.id,
              janela: v.janela,
              prazo: pz.t,
              urgente: pz.urgente,
              motorista: TX.pessoa(v.motorista).nome,
              ordem: v.ordem,
              filial: TX.filial(v.filial).nome,
              motivo: 'Espera ' + this.nomeAlcada(x.alcada),
              detalhe: 'bloqueada, acima da sua alçada',
              pedido: '',
              pedidoFeito: false,
            };
          }),
      );
    const proxBloq = fila.acima[0] ? fila.acima[0].viagem : null;
    const filiaisL = TX.db.filiais
      .filter((f) => u.filiais.includes(f.id))
      .map((f) => {
        const hj = TX.viagensDoDia(f.id).filter((v) => !v.cancelada);
        const pd = hj.filter((v) => TX.decidir(v).resultado !== 'pronta').length;
        const oc = f.comunicacaoOC;
        return {
          id: f.id,
          n: f.nome + ' ' + f.uf,
          matriz: !!f.matriz,
          reg: f.registro,
          href: '/hoje?filial=' + f.id,
          hoje: hj.length,
          pend: pd,
          ocOk: !!oc,
          oc: oc ? 'comunicado' : 'não comunicado',
          ocDica: oc
            ? 'Gatekeeper comunicado à certificadora em ' + F.data(oc.data) + ', protocolo ' + oc.protocolo
            : 'O gatekeeper desta filial ainda não foi comunicado à certificadora',
          podeRegistrar: !oc && pode('comunicarOC', f),
          afretador: TX.usuario(f.afretador).nome,
          onClick: () => this.setFilial(f.id),
          _busca: TX.norm([f.nome, f.uf, f.registro, TX.usuario(f.afretador).nome].join(' ')),
        };
      })
      .filter((f) => bate(f._busca));
    const pendL = pend
      .map((p) => {
        const v = p.viagem;
        return {
          href: '/viagem?id=' + v.id,
          ordem: v.ordem,
          filial: TX.filial(v.filial).nome,
          data: F.curta(v.data),
          quem: TX.pessoa(v.motorista).nome + ', ' + TX.produto(v.produto).nome.toLowerCase(),
          itens: p.itens.map((i) => ({ n: i.n, tom: i.leve ? 'autoridade' : 'aviso' })),
          _busca: buscaV(v) + ' ' + TX.norm(p.itens.map((i) => i.n).join(' ')),
        };
      })
      .filter((x) => bate(x._busca));
    const vencL = venc.map((x) => this.vencLinha(x)).filter((x) => bate(x._busca));
    const nadaAchado = !!q && precisa.length + filiaisL.length + pendL.length + vencL.length === 0;
    return {
      temFila: !!u.alcada,
      precisa,
      precisaQ: fila.minhas.length,
      precisaSub: 'Bloqueios que a sua alçada (' + alcN + ') libera, pelo prazo de carregamento.',
      precisaVazio:
        precisa.length === 0
          ? q
            ? 'Nada com "' + s.busca + '" esperando você.'
            : 'Nada esperando sua assinatura.' +
              (proxBloq
                ? ' Próximo carregamento bloqueado: ' + proxBloq.janela + ', com ' + this.nomeAlcada(fila.acima[0].alcada) + '.'
                : '')
          : '',
      kpis: [
        {
          k: 'prontidao',
          n: 'Prontidão para auditoria',
          v: pr.pct + '%',
          barra: pr.pct + '%',
          sub: pr.completas + ' de ' + pr.total + ' completas, 45 dias',
          dica: 'Viagem completa: T-3, verificação aprovada, termo (quando gatekeeper) e CT-e conciliado. Últimos 45 dias.',
          href: '/auditoria',
        },
        {
          k: 'hoje',
          n: 'Viagens hoje',
          v: hojeTodas.length,
          sub: hojeTodas.filter((v) => TX.decidir(v).resultado !== 'pronta').length + ' com pendência',
          href: '/viagens?periodo=hoje',
        },
        {
          k: 'gatekeeper',
          n: 'Protocolos gatekeeper',
          v: gk,
          sub: 'TAC ou ETC não certificada, 45 dias',
          dica: 'Viagens asseguradas com transportador sem certificado GMP+, cobertas pelo protocolo gatekeeper da filial.',
          href: '/auditoria',
        },
        {
          k: 'vencimentos',
          n: 'Documentos vencidos ou a vencer',
          v: venc.length,
          sub: (vencidos ? vencidos + (vencidos === 1 ? ' vencido, ' : ' vencidos, ') : '') + v15 + ' em até 15 dias',
          ancora: 'tx-hoje-vencs',
        },
      ],
      filiaisL,
      pendL,
      temConciliar: pode('conciliarCTe'),
      semPend: pend.length === 0,
      pendFiltroVazio: pend.length > 0 && pendL.length === 0,
      vW1: Math.round((v15 / vt) * 100) + '%',
      vW2: Math.round((v30 / vt) * 100) + '%',
      vW3: Math.round((v60 / vt) * 100) + '%',
      v15,
      v30,
      v60,
      vencQ: venc.length,
      vencMais: vencL.length > 6,
      vencTodosRot: s.vencTodos ? 'Mostrar menos' : 'Ver todos (' + vencL.length + ')',
      alternarVencs: () => this.setState({ vencTodos: !s.vencTodos }),
      vencs: s.vencTodos || q ? vencL : vencL.slice(0, 6),
      vencFiltroVazio: venc.length > 0 && vencL.length === 0,
      nadaAchado,
      simTxt: sim
        ? 'Última simulação de rastreabilidade: ' +
          F.data(sim.em.slice(0, 10)) +
          ', ' +
          sim.pedido.replace(/^./, (c) => c.toLowerCase()) +
          ', em ' +
          Math.floor(sim.duracaoMin / 60) +
          'h' +
          String(sim.duracaoMin % 60).padStart(2, '0') +
          '. O limite da auditoria é 4 horas.'
        : 'Nenhuma simulação registrada.',
    };
  }

  // U13 e M06: o gestor de frota vê a frota própria (premissa da opção a da revisão 12, seção 7).
  frotaVals(u) {
    const s = this.state,
      F = TX.fmt;
    const q = TX.norm(s.busca);
    const conjs = TX.db.conjuntos.filter((c) => c.dono === 'propria');
    const noEscopo = conjs.filter((c) => c.escopo && c.escopo.no).length;
    const hoje = TX.viagensDoDia('todas')
      .filter((v) => !v.cancelada && v.tipo === 'propria')
      .sort((a, b) => a.janela.localeCompare(b.janela));
    const linhas = hoje
      .map((v) => {
        const dec = TX.decidir(v),
          pz = this.prazoDe(v),
          f0 = dec.falta[0];
        return {
          id: v.id,
          href: '/viagem?id=' + v.id,
          janela: v.janela,
          prazo: pz.t,
          urgente: pz.urgente && dec.resultado !== 'pronta',
          placas: TX.placasDoConjunto(TX.conjunto(v.conjunto)).join(' '),
          motorista: TX.pessoa(v.motorista).nome,
          ordem: v.ordem,
          filial: TX.filial(v.filial).nome,
          tom: TX.ui.tomResultado(dec).k,
          res: dec.rotulo,
          motivo: f0 ? (dec.resultado === 'falta' ? f0.o : motivoFalha(f0, dec)) : '',
          _busca: TX.norm([v.ordem, v.id, TX.pessoa(v.motorista).nome, TX.placasDoConjunto(TX.conjunto(v.conjunto)).join(' ')].join(' ')),
        };
      })
      .filter((l) => !q || l._busca.includes(q));
    const venc = TX.vencimentos(60).filter((x) => x.href === '/frota');
    const vencL = venc.map((x) => this.vencLinha(x)).filter((x) => !q || x._busca.includes(q));
    return {
      frota: true,
      kpis: [
        {
          k: 'escopo',
          n: 'Conjuntos no escopo GMP+',
          v: noEscopo + ' de ' + conjs.length,
          sub: 'só eles fazem viagem assegurada',
          href: '/frota',
        },
        {
          k: 'hoje',
          n: 'Viagens da frota hoje',
          v: hoje.length,
          sub: hoje.filter((v) => TX.decidir(v).resultado !== 'pronta').length + ' com pendência',
          ancora: 'tx-hoje-frota-viagens',
        },
        {
          k: 'vencimentos',
          n: 'Documentos da frota',
          v: venc.length,
          sub:
            venc.filter((x) => x.estado === 'vencido').length + ' vencidos, ' + venc.filter((x) => x.dias <= 15).length + ' em até 15 dias',
          ancora: 'tx-hoje-vencs',
        },
      ],
      frotaLinhas: linhas,
      frotaVazio:
        linhas.length === 0 ? (q ? 'Nenhuma viagem da frota com "' + s.busca + '".' : 'Nenhuma viagem da frota própria hoje.') : '',
      vencs: vencL,
      vencQ: venc.length,
      vencFiltroVazio: venc.length > 0 && vencL.length === 0,
      nadaAchado: !!q && linhas.length + vencL.length === 0,
      dataHoje: F.data(TX.HOJE),
    };
  }

  novaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    if (!s.nova) return { novaAberta: false, fecharModal: () => {} };
    const fil = this.filialDaNova();
    const filObj = TX.filial(fil);
    const p = s.nPasso || 1;
    const fechar = () => this.setState({ nova: false });
    const prod = s.nProd ? TX.produto(s.nProd) : null;
    const dest = s.nDest ? TX.destinatario(s.nDest) : null;
    // Passo 1: o que falta, campo a campo. O erro só aparece depois de tentar seguir,
    // salvo formato errado num campo já digitado (horário, peso).
    const hm = /^(\d{2}):(\d{2})$/.exec(s.nJanela || '');
    const janelaOk = !!hm && +hm[1] < 24 && +hm[2] < 60;
    const pesoN = +String(s.nPeso || '').replace(',', '.');
    const pesoOk = pesoN > 0 && pesoN <= 80;
    // M04: ordem repetida na filial é recusada.
    const ordemN = TX.norm((s.nOrdem || '').replace(/\s+/g, ''));
    const repetida =
      ordemN.length >= 3
        ? TX.db.viagens.find((x) => x.filial === fil && !x.cancelada && TX.norm(x.ordem.replace(/\s+/g, '')) === ordemN)
        : null;
    const ordemOk = (s.nOrdem || '').trim().length >= 3 && !repetida;
    // M02: data em DD/MM/AAAA, de hoje em diante; hoje e amanhã são atalhos.
    const diaIso = TX.ui.dataIso(s.nDiaTxt || '');
    const diaOk = !!diaIso && diaIso >= TX.HOJE;
    const falta1 = [
      ['produto', !prod],
      ['ordem', !ordemOk],
      ['embarcador', !s.nEmb],
      ['destinatário', !s.nDest],
      ['data', !diaOk],
      ['horário', !janelaOk],
      ['peso', !pesoOk],
    ]
      .filter((x) => x[1])
      .map((x) => x[0]);
    const v1 = falta1.length === 0;
    const t1 = !!s.nTentou1;
    const assegura = prod && dest ? prod.racao && dest.certificado : null;
    // passo 2
    const q = TX.norm(s.nQuem || '');
    const qd = TX.soDigitos(s.nQuem || '');
    const achados =
      q.length >= 3
        ? TX.db.transportadores
            .filter((t) => {
              const nomes =
                t.tipo === 'TAC'
                  ? [TX.pessoa(t.pessoa).nome, TX.pessoa(t.pessoa).cpf]
                  : [t.nome, t.cnpj].concat((t.motoristas || []).map((m) => TX.pessoa(m).cpf));
              const placas = (t.conjuntos || []).map((c) => TX.placasDoConjunto(c).join(' ')).join(' ');
              return (
                TX.norm(nomes.join(' ') + ' ' + placas).includes(q) || (qd.length >= 5 && nomes.some((n) => TX.soDigitos(n).startsWith(qd)))
              );
            })
            .slice(0, 4)
        : [];
    const placasCm = (s.cmPlacas || '')
      .toUpperCase()
      .split(/[,;]+/)
      .map((x) => x.trim().replace(/^([A-Z]{3})-?(\w{4})$/, '$1 $2'))
      .filter((x) => /^[A-Z]{3} \w{4}$/.test(x));
    // M01: o link confere o CPF do motorista; sem ele, o TAC novo não passa da primeira etapa.
    const cpfOk = TX.soDigitos(s.cmCpf).length === 11;
    const cmOk = (s.cmNome || '').trim().length >= 5 && TX.soDigitos(s.cmTel).length >= 10 && cpfOk && placasCm.length >= 2;
    const terceiro = s.nTipo === 'terceiro';
    // M03: transportador com mais de um conjunto ou motorista: o afretador escolhe.
    const tSel = terceiro && s.nSel ? TX.transportador(s.nSel) : null;
    const conjsT = tSel ? tSel.conjuntos || [] : [];
    const motsT = tSel ? (tSel.tipo === 'TAC' ? [tSel.pessoa] : tSel.motoristas || []) : [];
    const conjEsc = conjsT.length === 1 ? conjsT[0] : s.nConjT;
    const motEsc = motsT.length === 1 ? motsT[0] : s.nMotT;
    const selConj = terceiro ? (conjEsc ? TX.conjunto(conjEsc) : null) : s.nSel ? TX.conjunto(s.nSel) : null;
    const v2 = terceiro ? (!!s.nSel && !!conjEsc && !!motEsc) || (!s.nSel && achados.length === 0 && q.length >= 3 && cmOk) : !!s.nSel;
    // M04: conjunto que já carrega no mesmo dia é avisado (não impede: pode ser a volta do mesmo dia).
    const ocupada =
      selConj && diaIso
        ? TX.db.viagens.find((x) => x.conjunto === selConj.id && x.data === diaIso && !x.cancelada && x.id !== s.nCriada)
        : null;
    const t2 = !!s.nTentou2;
    const falta2 = v2
      ? []
      : !terceiro
        ? ['o conjunto da frota']
        : q.length < 3
          ? ['placa do cavalo ou CPF de quem carrega']
          : s.nSel
            ? [
                ['conjunto', !conjEsc],
                ['motorista', !motEsc],
              ]
                .filter((x) => x[1])
                .map((x) => x[0])
            : achados.length
              ? ['escolher quem carrega na lista']
              : [
                  ['nome', (s.cmNome || '').trim().length < 5],
                  ['telefone', TX.soDigitos(s.cmTel).length < 10],
                  ['CPF', !cpfOk],
                  ['placas', placasCm.length < 2],
                ]
                  .filter((x) => x[1])
                  .map((x) => x[0]);
    const criar = () => {
      const d = {
        filial: fil,
        produto: s.nProd,
        peso: +String(s.nPeso).replace(',', '.'),
        embarcador: s.nEmb,
        destinatario: s.nDest,
        data: diaIso,
        janela: s.nJanela,
        ordem: s.nOrdem.trim(),
        origemOrdem: s.nPdf ? 'pdf' : 'digitada',
      };
      if (!terceiro)
        Object.assign(d, { tipo: 'propria', transportador: 'propria', conjunto: s.nSel, motorista: TX.conjunto(s.nSel).motorista });
      else if (s.nSel) {
        const t = TX.transportador(s.nSel);
        Object.assign(d, { transportador: t.id, conjunto: conjEsc, motorista: motEsc });
      } else
        Object.assign(d, { novoTAC: { nome: s.cmNome.trim(), telefone: s.cmTel.trim(), cpf: TX.soDigitos(s.cmCpf), placas: placasCm } });
      const id = TX.fazer('criarViagem', d);
      this.setState({ nPasso: 3, nCriada: id });
    };
    const criada = s.nCriada ? TX.viagem(s.nCriada) : null;
    const vals = {
      novaAberta: true,
      fecharModal: fechar,
      pararClique: (e) => e.stopPropagation(),
      nTitulo: p === 3 ? 'Viagem criada' : 'Nova viagem',
      nFilialNome: filObj.nome,
      // M08: com mais de uma filial na sessão, a filial é escolhida no passo 1 (vem marcada a do painel).
      nTemFiliais: TX.sessao().filiais.length > 1,
      nFiliais: TX.sessao().filiais.map((id) => ({
        k: id,
        n: TX.filial(id).nome,
        on: id === fil,
        onClick: () => this.setState({ nFil: id }),
      })),
      nPassos: [
        ['Ordem', 1],
        ['Quem carrega', 2],
        ['Link', 3],
      ].map(([n, i]) => ({ n, on: i <= p, atual: i === p })),
      nP1: p === 1,
      nP2: p === 2,
      nP3: p === 3,
      pdfOk: !!s.nPdf,
      pdfTitulo: s.nPdf ? 'Ordem importada: ' + s.nPdf : 'Importar o PDF da ordem de carregamento',
      pdfSub: s.nPdf
        ? 'Produto, embarcador, destinatário, data e peso preenchidos. Confira abaixo.'
        : 'O caminho mais rápido: o TMS já gerou a ordem, não precisa digitar de novo.',
      pdfErro: s.pdfErro,
      onPdf: (e) => {
        const f = e.target.files && e.target.files[0];
        const erro = TX.ui.conferirArquivo(f, ['.pdf'], 'PDF');
        e.target.value = '';
        this.setState({ pdfErro: erro });
        if (f && !erro) this.preencherOrdem(f.name);
      },
      usarOrdemExemplo: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.preencherOrdem('OC-48140.pdf');
      },
      nProdBusca: s.nProdBusca,
      onProdBusca: (e) => this.setState({ nProdBusca: e.target.value, nProd: null }),
      nProdLista: !s.nProd && (s.nProdBusca || '').length >= 2,
      nProdOps: TX.buscarProdutos(s.nProdBusca, 5).map((r) => ({
        id: r.produto.id,
        n: r.produto.nome,
        via: r.via ? 'achado por "' + r.via + '"' : r.produto.racao ? 'ração' : 'não é ração',
        onClick: () => this.setState({ nProd: r.produto.id, nProdBusca: r.produto.nome }),
      })),
      nOrdem: s.nOrdem,
      onOrdem: (e) => this.setState({ nOrdem: e.target.value }),
      // U15: os três mais usados na filial como atalho; o resto numa lista que escala.
      nEmbs: this.maisUsados('embarcador', TX.db.embarcadores, fil, s.nEmb).map((x) => ({
        k: x.id,
        n: x.nome,
        on: s.nEmb === x.id,
        onClick: () => this.setState({ nEmb: x.id }),
      })),
      nEmbTodos: TX.db.embarcadores.map((x) => ({ k: x.id, n: x.nome })),
      nEmbOutro: s.nEmb && !this.maisUsados('embarcador', TX.db.embarcadores, fil, null).some((x) => x.id === s.nEmb) ? s.nEmb : '',
      onEmbOutro: (e) => this.setState({ nEmb: e.target.value || null }),
      nDests: this.maisUsados('destinatario', TX.db.destinatarios, fil, s.nDest).map((x) => ({
        k: x.id,
        n: x.nome,
        on: s.nDest === x.id,
        onClick: () => this.setState({ nDest: x.id }),
      })),
      nDestTodos: TX.db.destinatarios.map((x) => ({ k: x.id, n: x.nome })),
      nDestOutro: s.nDest && !this.maisUsados('destinatario', TX.db.destinatarios, fil, null).some((x) => x.id === s.nDest) ? s.nDest : '',
      onDestOutro: (e) => this.setState({ nDest: e.target.value || null }),
      nDias: [
        [TX.HOJE, 'hoje'],
        [TX.addDias(TX.HOJE, 1), 'amanhã'],
      ].map(([d, n]) => ({ k: d, n, on: diaIso === d, onClick: () => this.setState({ nDiaTxt: F.data(d) }) })),
      nDiaTxt: s.nDiaTxt || '',
      onDia: (t) => this.setState({ nDiaTxt: t }),
      nJanela: s.nJanela,
      // Horário digitado só com números: 1830 vira 18:30.
      onJanela: (e) => {
        const d = TX.soDigitos(e.target.value).slice(0, 4);
        this.setState({ nJanela: d.length > 2 ? d.slice(0, 2) + ':' + d.slice(2) : d });
      },
      nPeso: s.nPeso,
      onPeso: (e) => this.setState({ nPeso: e.target.value.replace(/[^0-9,.]/g, '') }),
      eProd: t1 && !prod ? ((s.nProdBusca || '').trim() ? 'Escolha o produto na lista.' : 'Informe o produto.') : '',
      eOrdem: repetida
        ? 'A ' + repetida.ordem + ' já existe nesta filial (' + repetida.id + ', ' + F.curta(repetida.data) + ').'
        : t1 && !ordemOk
          ? 'Informe a ordem, como OC 48140.'
          : '',
      eData:
        (t1 || (s.nDiaTxt || '').length === 10) && !diaOk
          ? !s.nDiaTxt
            ? 'Informe a data.'
            : !diaIso
              ? 'Data inválida.'
              : 'A data já passou.'
          : '',
      eEmb: t1 && !s.nEmb ? 'Escolha o embarcador.' : '',
      eDest: t1 && !s.nDest ? 'Escolha o destinatário.' : '',
      eJanela:
        (t1 || (s.nJanela || '').length >= 5) && !janelaOk
          ? s.nJanela
            ? 'Horário inválido: de 00:00 a 23:59.'
            : 'Informe o horário.'
          : '',
      ePeso: (t1 || s.nPeso) && !pesoOk ? (s.nPeso ? 'Peso em toneladas, de 1 a 80.' : 'Informe o peso.') : '',
      eCmNome: t2 && (s.cmNome || '').trim().length < 5 ? 'Nome e sobrenome.' : '',
      eCmTel: t2 && TX.soDigitos(s.cmTel).length < 10 ? 'Celular com DDD, para mandar o link.' : '',
      eCmCpf: (t2 || TX.soDigitos(s.cmCpf).length > 11) && !cpfOk ? 'CPF com 11 dígitos: o motorista confirma por ele no link.' : '',
      // M03
      nEscConj: conjsT.length > 1,
      nConjsT: conjsT.map((c) => ({
        k: c,
        n: TX.placasDoConjunto(c).join(' '),
        on: s.nConjT === c,
        onClick: () => this.setState({ nConjT: c }),
      })),
      nEscMot: motsT.length > 1,
      nMotsT: motsT.map((m) => ({ k: m, n: TX.pessoa(m).nome, on: s.nMotT === m, onClick: () => this.setState({ nMotT: m }) })),
      eConjT: t2 && s.nSel && !conjEsc ? 'Escolha o conjunto que carrega.' : '',
      eMotT: t2 && s.nSel && !motEsc ? 'Escolha o motorista.' : '',
      nOcupada: ocupada
        ? TX.placasDoConjunto(selConj)[0] +
          ' já carrega ' +
          (ocupada.data === TX.HOJE ? 'hoje' : 'em ' + F.curta(ocupada.data)) +
          ' às ' +
          ocupada.janela +
          ' (' +
          ocupada.ordem +
          '). Confira se é o mesmo conjunto antes de criar.'
        : '',
      eCmPlacas: t2 && placasCm.length < 2 ? 'Cavalo e pelo menos uma carreta, separados por vírgula.' : '',
      eQuem:
        t2 && terceiro && !v2 && (q.length < 3 || achados.length > 0)
          ? q.length < 3
            ? 'Digite a placa do cavalo ou o CPF.'
            : 'Escolha quem carrega na lista.'
          : '',
      asTxt:
        assegura === null
          ? 'Escolha produto e destinatário: o sistema diz se a viagem leva a declaração GMP+.'
          : assegura
            ? 'Viagem assegurada GMP+: produto é ração e o destinatário é certificado.'
            : 'Sem declaração GMP+: ' + (prod.racao ? 'destinatário não certificado.' : prod.nome + ' não é ração.'),
      asTom: assegura === null ? 'na' : assegura ? 'ok' : 'aviso',
      nTipos: [
        ['terceiro', 'TAC ou ETC'],
        ['propria', 'Frota própria'],
      ].map(([k, n]) => Object.assign({ k, n, onClick: () => this.setState({ nTipo: k, nSel: null }) }, U.chip(s.nTipo === k))),
      nTerceiro: terceiro,
      nPropria: !terceiro,
      nQuem: s.nQuem,
      onQuem: (e) => this.setState({ nQuem: e.target.value, nSel: null }),
      nAchados: achados.map((t) => {
        const nome = TX.nomeTransportador(t);
        const qual = TX.qualificacao(t);
        const p0 = t.tipo === 'TAC' ? TX.pessoa(t.pessoa) : null;
        const ruins = qual.docs.filter((d) => d.estado !== 'ok').length;
        const sx = U.sel(s.nSel === t.id);
        return Object.assign(
          {
            id: t.id,
            nome: nome + (t.tipo === 'ETC' ? ' (ETC)' : ''),
            ini: F.iniciais(nome),
            pessoa: t.tipo === 'TAC',
            g1: p0 ? p0.g1 : 'var(--primario-2)',
            g2: p0 ? p0.g2 : 'var(--azul)',
            placas: (t.conjuntos || []).map((c) => TX.placasDoConjunto(c).join(' ')).join('  /  '),
            docs: qual.ocorrencia
              ? 'em revisão após ocorrência grave: a Direção decide'
              : ruins
                ? qual.n + ': o motorista atualiza pelo link'
                : 'documentos em dia, dados voltam preenchidos',
            docTom: qual.ocorrencia ? 'perigo' : ruins ? 'aviso' : 'ok',
            onClick: () => this.setState({ nSel: t.id, nConjT: null, nMotT: null }),
          },
          sx,
        );
      }),
      nNaoAchou: q.length >= 3 && achados.length === 0,
      cmNome: s.cmNome,
      onCmNome: (e) => this.setState({ cmNome: e.target.value }),
      cmTel: s.cmTel,
      onCmTel: (e) => this.setState({ cmTel: e.target.value }),
      cmCpf: s.cmCpf,
      onCmCpf: (e) => this.setState({ cmCpf: e.target.value }),
      cmPlacas: s.cmPlacas,
      onCmPlacas: (e) => this.setState({ cmPlacas: e.target.value }),
      nConjs: TX.db.conjuntos
        .filter((c) => c.dono === 'propria')
        .map((c) => {
          const no = c.escopo && c.escopo.no;
          const sx = U.sel(s.nSel === c.id, no || !assegura);
          return Object.assign(
            {
              placas: TX.placasDoConjunto(c).join('  '),
              sub: (no ? 'no escopo GMP+, ' : 'fora do escopo: ' + (c.escopo.motivo || '') + ', ') + TX.pessoa(c.motorista).nome,
              fora: !no,
              onClick: () => {
                if (no || !assegura) this.setState({ nSel: c.id });
                else this.avisar('Conjunto fora do escopo GMP+ não é selecionável para viagem assegurada.');
              },
            },
            sx,
          );
        }),
      nCriadaTxt: criada ? criada.ordem + ' criada para ' + TX.pessoa(criada.motorista).nome : '',
      nMensagem: criada ? TX.mensagemLink(criada) : '',
      nHref: criada ? '/viagem?id=' + criada.id : '',
      // O botão apagado diz o que falta, e só o que falta.
      nDica:
        p === 1
          ? v1
            ? 'Tudo preenchido.'
            : 'Falta: ' + listaFalta(falta1) + '.'
          : p === 2
            ? v2
              ? 'Pronto para criar a viagem.'
              : terceiro && q.length < 3
                ? 'Placa ou CPF trazem o cadastro e os documentos de volta.'
                : 'Falta: ' + listaFalta(falta2) + '.'
            : '',
      nVoltar: p === 2,
      nVoltarFn: () => this.setState({ nPasso: 1 }),
      nAvancarRot: p === 1 ? 'Continuar' : p === 2 ? 'Criar viagem' : 'Copiar mensagem do link',
      nAvancar: () => {
        if (p === 1) {
          if (v1) this.setState({ nPasso: 2 });
          else this.setState({ nTentou1: true }, () => this.focarFalta(falta1[0]));
          return;
        }
        if (p === 2) {
          if (v2) criar();
          else this.setState({ nTentou2: true }, () => this.focarFalta(falta2[0]));
          return;
        }
        TX.ui.copiar(TX.mensagemLink(criada));
        TX.fazer('enviarLink', { id: criada.id, canal: 'copiado' });
        this.setState({ nova: false });
        this.avisar('Mensagem copiada. A ' + criada.ordem + ' está na mesa com o link enviado.');
      },
      ctaOk: p === 1 ? v1 : p === 2 ? v2 : true,
    };
    return vals;
  }
  // Leva o foco ao primeiro campo que falta (o botão apagado continua clicável para isso).
  focarFalta(k) {
    const sel =
      {
        produto: '[data-tx-campo="produto"]',
        ordem: '[data-tx-campo="ordem"]',
        embarcador: '[data-tx-grupo="nv-emb"] button',
        destinatário: '[data-tx-grupo="nv-dest"] button',
        data: '[data-tx-campo="data"]',
        CPF: '[data-tx-campo="cm-cpf"]',
        conjunto: '[data-tx-grupo="nv-conj"] button',
        motorista: '[data-tx-grupo="nv-mot"] button',
        horário: '[data-tx-campo="janela"]',
        peso: '[data-tx-campo="peso"]',
        nome: '[data-tx-campo="cm-nome"]',
        telefone: '[data-tx-campo="cm-tel"]',
        placas: '[data-tx-campo="cm-placas"]',
      }[k] || '[data-tx-campo="quem"]';
    const el = document.querySelector(sel);
    if (el) el.focus();
  }
  // Os três cadastros mais usados nas viagens da filial (embarcador ou destinatário).
  maisUsados(campo, lista, fil, escolhido) {
    const conta = {};
    TX.db.viagens.filter((x) => x.filial === fil).forEach((x) => (conta[x[campo]] = (conta[x[campo]] || 0) + 1));
    const top = lista
      .slice()
      .sort((a, b) => (conta[b.id] || 0) - (conta[a.id] || 0))
      .slice(0, 3);
    const extra = escolhido && !top.some((x) => x.id === escolhido) ? lista.filter((x) => x.id === escolhido) : [];
    return top.concat(extra);
  }
  filialDaNova() {
    const u = TX.sessao();
    if (this.state.nFil && u.filiais.includes(this.state.nFil)) return this.state.nFil;
    return this.filialAtual() === 'todas' ? u.filiais[0] : this.filialAtual();
  }
  preencherOrdem(nome) {
    const fil = this.filialDaNova();
    const emb = { SOR: 'em-agrosorriso', RON: 'em-planalto', RVD: 'em-granosrv', PNG: 'em-litoral' }[fil];
    this.setState({
      nPdf: nome,
      nProd: 'farelo-soja',
      nProdBusca: 'Farelo de soja',
      nOrdem: 'OC ' + (48140 + TX.db.viagens.length - 30),
      nEmb: emb,
      nDest: 'de-nutrimax',
      nDiaTxt: TX.fmt.data(TX.HOJE),
      nJanela: '18:30',
      nPeso: '37',
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Hoje" data-tela="Hoje">
        <div className="tx-pagina tx-hoje">
          <header className="tx-hoje-cab">
            <div className="tx-hoje-cab__titulos">
              {v.voltarTodas ? (
                <nav aria-label="Caminho" className="tx-hoje-trilha">
                  <button type="button" onClick={v.voltarTodas} className="tx-hoje-trilha__link" data-tx-voltar-todas="">
                    Todas as filiais
                  </button>
                  <span aria-hidden>›</span>
                  <span aria-current="page">{v.filialRot.replace('Filial ', '')}</span>
                </nav>
              ) : null}
              <h1 className="tx-hoje-cab__titulo">{v.titulo}</h1>
              <div className="tx-hoje-cab__sub">{v.subtitulo}</div>
            </div>
            <div className="tx-hoje-cab__acoes">
              <EntradaCaixa
                className="tx-hoje-busca"
                icone={IconeBusca}
                aria-label={v.buscaRot}
                value={v.busca ?? ''}
                onChange={v.onBusca}
                data-tx-busca=""
                placeholder={v.buscaRot}
                title={v.buscaDica}
              />
              {v.temFiliais ? (
                <div data-tx-pop="" className="tx-hoje-pop">
                  <Botao variante="contorno" onClick={v.onFilial} data-tx-filial="" aria-expanded={v.filialOpen} aria-haspopup="menu">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--esp-2)' }}>
                      {v.filialRot}
                      {Chevron}
                    </span>
                  </Botao>
                  {v.filialOpen ? (
                    <div role="menu" aria-label="Filial" className="tx-hoje-menu">
                      {v.filiais.map((fl) => (
                        <button
                          key={fl.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={fl.on}
                          onClick={fl.onClick}
                          data-tx-filial-op={fl.id}
                          className="tx-hoje-menu__op"
                        >
                          <span className="tx-hoje-menu__ponto" aria-hidden />
                          <span className="tx-hoje-menu__nome">{fl.n}</span>
                          <span className="tx-hoje-menu__q num">{fl.q}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {v.temNova ? (
                <Botao variante="primario" onClick={v.abrirNova} data-tx-nova-viagem="">
                  Nova viagem
                </Botao>
              ) : (
                <Botao variante="contorno" href="/viagens">
                  Ver todas as viagens
                </Botao>
              )}
            </div>
          </header>
          {v.loading ? (
            <div aria-busy="true" aria-label="Carregando" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--esp-3)' }}>
              {v.skel.map((sk) => (
                <span key={sk} className="tx-esqueleto tx-hoje-esq" />
              ))}
            </div>
          ) : null}
          {v.modoMesa ? this.renderMesa(v) : null}
          {v.modoPainel && v.frota ? this.renderFrota(v) : null}
          {v.modoPainel && !v.frota ? this.renderPainel(v) : null}
        </div>
        {v.novaAberta ? this.renderNova(v) : null}
      </div>
    );
  }

  // Nada com a busca no painel: diz o quê e oferece limpar (U03).
  renderNadaAchado(v) {
    return v.nadaAchado ? (
      <Cartao>
        <EstadoVazio
          titulo={'Nada com "' + v.busca + '" no painel'}
          acao={
            <Botao tamanho="p" onClick={v.limparBusca}>
              Limpar a busca
            </Botao>
          }
        >
          A busca olha o que precisa de você, as filiais, as pendências de registro e os vencimentos.
        </EstadoVazio>
      </Cartao>
    ) : null;
  }

  renderKpis(v) {
    return (
      <div className="tx-hoje-kpis" role="list" aria-label="Indicadores">
        {v.kpis.map((k) => {
          const miolo = (
            <>
              <span className="tx-hoje-kpi__rotulo">
                {k.n}
                {k.dica ? (
                  <span className="tx-hoje-kpi__info" title={k.dica} aria-label={k.dica} role="img">
                    i
                  </span>
                ) : null}
              </span>
              <span className="tx-hoje-kpi__linha">
                <span className="tx-hoje-kpi__v num">{k.v}</span>
                {k.barra ? (
                  <span className="tx-hoje-kpi__barra" aria-hidden>
                    <span style={{ width: k.barra }} />
                  </span>
                ) : null}
              </span>
              <span className="tx-hoje-kpi__sub">{k.sub}</span>
            </>
          );
          return k.href ? (
            <A key={k.k} href={k.href} className="tx-hoje-kpi" role="listitem" data-tx-kpi={k.k}>
              {miolo}
            </A>
          ) : (
            <a
              key={k.k}
              href={'#' + k.ancora}
              className="tx-hoje-kpi"
              role="listitem"
              data-tx-kpi={k.k}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(k.ancora);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {miolo}
            </a>
          );
        })}
      </div>
    );
  }

  renderVencimentos(v, titulo) {
    return (
      <Cartao
        como="section"
        id="tx-hoje-vencs"
        className="tx-hoje-folha"
        titulo={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--esp-2)' }}>
            {titulo}
            <span className="tx-hoje-secao__q num">{v.vencQ}</span>
          </span>
        }
        acoes={
          v.vencMais ? (
            <Botao
              variante="texto"
              onClick={v.alternarVencs}
              data-tx-venc-todos=""
              className="tx-acao-texto"
              aria-expanded={v.vencTodosRot === 'Mostrar menos'}
            >
              {v.vencTodosRot}
            </Botao>
          ) : null
        }
      >
        {v.vW1 ? (
          <>
            <div className="tx-hoje-venc__barra" aria-hidden>
              <span className="tx-hoje-venc__seg--15" style={{ width: v.vW1 }} />
              <span className="tx-hoje-venc__seg--30" style={{ width: v.vW2 }} />
              <span className="tx-hoje-venc__seg--60" style={{ width: v.vW3 }} />
            </div>
            <div className="tx-hoje-venc__leg">
              <span>
                <i className="tx-hoje-venc__seg--15" aria-hidden />
                <span className="num">{v.v15}</span> até 15 dias
              </span>
              <span>
                <i className="tx-hoje-venc__seg--30" aria-hidden />
                <span className="num">{v.v30}</span> até 30
              </span>
              <span>
                <i className="tx-hoje-venc__seg--60" aria-hidden />
                <span className="num">{v.v60}</span> até 60
              </span>
            </div>
          </>
        ) : null}
        <div className="tx-hoje-lista" style={{ marginTop: 'var(--esp-2)' }}>
          {v.vencs.map((vc) => (
            <A key={vc.k} href={vc.href} className="tx-hoje-item">
              <span style={{ flex: '1', minWidth: '0' }}>
                <span className="tx-tipo-denso tx-peso-700 tx-hoje-corta" style={{ display: 'block' }}>
                  {vc.t}
                </span>
                <span className="tx-tipo-legenda tx-peso-400 tx-apagado tx-hoje-corta" style={{ display: 'block' }}>
                  {vc.dono}
                </span>
              </span>
              <span className={'tx-hoje-venc__d' + (vc.tom !== 'sec' ? ' tx-hoje-venc__d--' + vc.tom : '')}>
                <span className="tx-hoje-ponto" aria-hidden />
                {vc.d}
              </span>
              <span className="tx-hoje-item__seta" aria-hidden>
                ›
              </span>
            </A>
          ))}
          {v.vencQ === 0 ? <p className="tx-hoje-nota tx-hoje-nota--ok">Nenhum documento vence nos próximos 60 dias.</p> : null}
          {v.vencFiltroVazio ? <p className="tx-hoje-nota">Nenhum vencimento com "{v.busca}".</p> : null}
        </div>
      </Cartao>
    );
  }

  renderMesa(v) {
    return (
      <>
        {v.temResumo ? (
          <div data-tx-resumo="" className="tx-hoje-resumo">
            <div className="tx-hoje-resumo__total">
              <span className="tx-hoje-resumo__n num">{v.resTotal}</span>
              <span className="tx-tipo-denso tx-sec">{v.resTotalRot}</span>
            </div>
            <div className="tx-hoje-barra" aria-hidden>
              {v.resSeg.map((sg) => (
                <span key={sg.k} className={'tx-hoje-barra__seg tx-hoje-barra__seg--' + sg.k} style={{ width: sg.w }} />
              ))}
            </div>
            {v.resItens.map((ri) => (
              <button
                key={ri.k}
                type="button"
                onClick={ri.onClick}
                data-tx-ir-grupo={ri.k}
                className="tx-hoje-resumo__item"
                title="Ir para o grupo"
              >
                <span className={'tx-situacao tx-situacao--' + ri.tom}>
                  <span className="tx-situacao__ponto" aria-hidden />
                </span>
                <b>{ri.q}</b>
                {ri.n}
              </button>
            ))}
            {v.temNoLink ? (
              <span className="tx-hoje-nolink" title="Abriram o link e ainda não terminaram">
                <span className="tx-hoje-ponto tx-hoje-pulso" aria-hidden />
                {v.noLinkRot}
              </span>
            ) : null}
          </div>
        ) : null}
        {v.mesaVazia ? (
          <Cartao>
            <EstadoVazio
              titulo={v.vazioTitulo}
              acao={
                v.busca ? (
                  <Botao tamanho="p" onClick={v.limparBusca}>
                    Limpar a busca
                  </Botao>
                ) : v.temNova ? (
                  <Botao variante="primario" tamanho="p" onClick={v.abrirNova}>
                    Nova viagem
                  </Botao>
                ) : null
              }
            >
              {v.vazioSub}
            </EstadoVazio>
          </Cartao>
        ) : null}
        {v.grupos.map((gr) => (
          <section key={gr.k} id={gr.ancora} className="tx-hoje-grupo" aria-labelledby={gr.ancora + '-t'}>
            <h2 className="tx-hoje-grupo__h">
              <button type="button" onClick={gr.toggle} aria-expanded={gr.aberto} className="tx-hoje-grupo__cab" id={gr.ancora + '-t'}>
                <span className={'tx-situacao tx-situacao--' + gr.tom}>
                  <span className="tx-situacao__ponto" aria-hidden />
                </span>
                <span className="tx-hoje-grupo__nome">{gr.n}</span>
                <span className="tx-hoje-grupo__q num">{gr.q}</span>
                <span className="tx-hoje-grupo__sub">{gr.sub}</span>
                <span className="tx-hoje-grupo__alternar">{gr.toggleRot}</span>
              </button>
            </h2>
            {gr.aberto ? (
              <div className="tx-hoje-fila">
                {gr.linhas.map((ln) => (
                  <div key={ln.id} data-tx-linha={ln.id} className="tx-hoje-linha">
                    <A href={ln.href} className="tx-hoje-linha__link" aria-label={'Abrir a viagem ' + ln.ordem + ', ' + ln.motorista} />
                    <div className="tx-hoje-hora">
                      <div className="tx-hoje-hora__h">{ln.janela}</div>
                      <div className={'tx-hoje-hora__prazo' + (ln.urgente ? ' tx-hoje-hora__prazo--urgente' : '')}>{ln.prazo}</div>
                    </div>
                    <span className="tx-hoje-avatar" aria-hidden>
                      {ln.ini}
                    </span>
                    <div className="tx-hoje-quem">
                      <div className="tx-hoje-quem__l1">
                        <span className="tx-hoje-quem__nome">{ln.motorista}</span>
                        <span className="tx-hoje-quem__tipo">{ln.tipo}</span>
                      </div>
                      <div className="tx-hoje-quem__carga">
                        {ln.produto}
                        {' para '}
                        {ln.destino}
                      </div>
                      <div className="tx-hoje-quem__codigo">
                        {ln.ordem} {ln.placas}
                      </div>
                    </div>
                    <div className="tx-hoje-etapas">
                      <div className="tx-hoje-etapas__barra">
                        {ln.etapas.map((et) => (
                          <span
                            key={et.tip}
                            title={et.tip + (et.estado === 'ok' ? ': feito' : ': pendente')}
                            className={'tx-hoje-etapa tx-hoje-etapa--' + et.estado}
                          />
                        ))}
                      </div>
                      <span className="tx-hoje-etapas__rot">{ln.etapasRot}</span>
                      <span className={'tx-situacao tx-situacao--' + ln.linkTom + ' tx-hoje-linkst'}>
                        <span className={'tx-situacao__ponto' + (ln.pulso ? ' tx-hoje-pulso' : '')} aria-hidden />
                        {ln.linkRot}
                        <span className="tx-hoje-linkst__hora">{ln.linkHora}</span>
                      </span>
                    </div>
                    <div className="tx-hoje-falta">
                      <div className="tx-hoje-falta__texto">
                        <div className={'tx-hoje-falta__o tx-hoje-falta__o--' + ln.faltaTom}>{ln.falta}</div>
                        <div className="tx-hoje-falta__quem">{ln.quem}</div>
                      </div>
                      {ln.temAcao ? (
                        <Botao
                          variante={ln.acaoPrim ? 'primario' : 'secundario'}
                          tamanho="p"
                          onClick={ln.onAcao}
                          data-tx-acao-linha={ln.acaoK}
                          className="tx-hoje-linha__acao"
                        >
                          {ln.acao}
                        </Botao>
                      ) : ln.espera ? (
                        <span className="tx-hoje-espera">{ln.espera}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </>
    );
  }

  renderPainel(v) {
    return (
      <>
        {v.temFila ? (
          <section className="tx-hoje-precisa" data-tx-fila="" aria-labelledby="tx-hoje-precisa-t">
            <div className="tx-hoje-precisa__cab">
              <h2 id="tx-hoje-precisa-t" className="tx-hoje-secao__titulo">
                Precisa de você
              </h2>
              {v.precisaQ ? (
                <Badge tom="autoridade" contador>
                  {v.precisaQ}
                </Badge>
              ) : null}
              <span className="tx-hoje-secao__sub">{v.precisaSub}</span>
            </div>
            {v.precisa.length ? (
              <div className="tx-hoje-precisa__lista">
                {v.precisa.map((fq) => (
                  <div
                    key={fq.id}
                    data-tx-fila-linha={fq.minha ? fq.id : undefined}
                    className={'tx-hoje-precisa__linha' + (fq.minha ? '' : ' tx-hoje-precisa__linha--acima')}
                  >
                    <div className="tx-hoje-hora" style={{ textAlign: 'left' }}>
                      <div className="tx-hoje-hora__h">{fq.janela}</div>
                      <div className={'tx-hoje-hora__prazo' + (fq.urgente ? ' tx-hoje-hora__prazo--urgente' : '')}>{fq.prazo}</div>
                    </div>
                    <div className="tx-hoje-fila__quem">
                      <div className="tx-tipo-corpo tx-peso-800 tx-hoje-corta">{fq.motorista}</div>
                      <div className="tx-mono tx-tipo-legenda tx-peso-400 tx-sec">
                        {fq.ordem}
                        {', '}
                        {fq.filial}
                      </div>
                    </div>
                    <div className="tx-hoje-fila__motivo">
                      <div className={'tx-hoje-falta__o ' + (fq.minha ? 'tx-hoje-falta__o--bloqueio' : 'tx-hoje-falta__o--autoridade')}>
                        {fq.motivo}
                      </div>
                      <div className="tx-hoje-falta__quem">{fq.detalhe}</div>
                    </div>
                    <div className={'tx-hoje-fila__pedido' + (fq.pedidoFeito ? ' tx-hoje-fila__pedido--feito' : '')}>{fq.pedido}</div>
                    {fq.minha ? (
                      <Botao variante="primario" tamanho="p" href={fq.href} data-tx-assinar={fq.id}>
                        Analisar e assinar
                      </Botao>
                    ) : (
                      <Botao variante="texto" href={fq.href} className="tx-acao-texto">
                        Ver viagem ›
                      </Botao>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="tx-hoje-nota tx-hoje-nota--ok">{v.precisaVazio}</p>
            )}
          </section>
        ) : null}
        {this.renderKpis(v)}
        {this.renderNadaAchado(v)}
        <div className="tx-hoje-baixo">
          <div className="tx-hoje-coluna">
            {v.filiaisL.length ? (
              <section className="tx-cartao tx-cartao--lista tx-hoje-folha" aria-labelledby="tx-hoje-filiais-t">
                <div className="tx-cartao__cab">
                  <div className="tx-cartao__titulos">
                    <h2 id="tx-hoje-filiais-t" className="tx-cartao__titulo">
                      Filiais hoje
                    </h2>
                  </div>
                </div>
                <div role="table" aria-labelledby="tx-hoje-filiais-t" className="tx-hoje-tab tx-hoje-tab--filiais">
                  <div role="row" className="tx-hoje-tab__cab">
                    <span role="columnheader">Filial</span>
                    <span role="columnheader" className="tx-hoje-tab__num">
                      Hoje
                    </span>
                    <span role="columnheader" className="tx-hoje-tab__num">
                      Pendência
                    </span>
                    <span role="columnheader">Gatekeeper</span>
                    <span role="columnheader">Afretador</span>
                  </div>
                  {v.filiaisL.map((cf) => (
                    <div key={cf.id} role="row" className="tx-hoje-tab__linha">
                      <span role="cell" className="tx-hoje-tab__nome">
                        <A href={cf.href} className="tx-hoje-esticar" data-tx-abrir-mesa={cf.id} title={'Abrir a mesa de ' + cf.n}>
                          {cf.n}
                        </A>
                        <span className="tx-hoje-filial__reg">{cf.reg}</span>
                      </span>
                      <span role="cell" className="tx-hoje-tab__num num tx-peso-700">
                        {cf.hoje}
                      </span>
                      <span role="cell" className={'tx-hoje-tab__num num' + (cf.pend ? ' tx-hoje-filial__pend--sim' : ' tx-apagado')}>
                        {cf.pend}
                      </span>
                      <span role="cell" className="tx-hoje-tab__gk">
                        <span className={'tx-situacao tx-situacao--' + (cf.ocOk ? 'ok' : 'bloqueio')} title={cf.ocDica}>
                          <span className="tx-situacao__ponto" aria-hidden />
                          {cf.oc}
                        </span>
                        {cf.podeRegistrar ? (
                          <Botao
                            variante="texto"
                            href="/cadastros?aba=filiais"
                            className="tx-hoje-sobre"
                            title="Registrar a comunicação do gatekeeper à certificadora"
                          >
                            Registrar
                          </Botao>
                        ) : null}
                      </span>
                      <span role="cell" className="tx-tipo-legenda tx-peso-400 tx-sec tx-hoje-corta">
                        {cf.afretador}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            <section className="tx-cartao tx-cartao--lista tx-hoje-folha" aria-labelledby="tx-hoje-pend-t">
              <div className="tx-cartao__cab">
                <div className="tx-cartao__titulos">
                  <h2 id="tx-hoje-pend-t" className="tx-cartao__titulo">
                    Pendências de registro <span className="tx-hoje-secao__q num">{v.pendL.length}</span>
                  </h2>
                  <div className="tx-cartao__sub">Viagens asseguradas já carregadas com item faltando.</div>
                </div>
                {v.temConciliar ? (
                  <div className="tx-cartao__acoes">
                    <Botao variante="contorno" tamanho="p" href="/viagens?conciliar=1">
                      Conciliar CT-e em lote
                    </Botao>
                  </div>
                ) : null}
              </div>
              <div className="tx-hoje-lista">
                {v.pendL.map((pr) => (
                  <A key={pr.href} href={pr.href} className="tx-hoje-item tx-hoje-item--pend">
                    <span className="tx-hoje-item__ordem">{pr.ordem}</span>
                    <span className="tx-hoje-item__onde">
                      {pr.filial}
                      {', '}
                      {pr.data}
                    </span>
                    <span className="tx-hoje-item__quem">
                      <span className="tx-hoje-corta" style={{ display: 'block' }}>
                        {pr.quem}
                      </span>
                      <span className="tx-hoje-item__selos">
                        {pr.itens.map((pi) => (
                          <Badge key={pi.n} tom={pi.tom}>
                            {pi.n}
                          </Badge>
                        ))}
                      </span>
                    </span>
                    <span className="tx-hoje-item__seta" aria-hidden>
                      ›
                    </span>
                  </A>
                ))}
                {v.semPend ? (
                  <p className="tx-hoje-nota tx-hoje-nota--ok">Nenhuma pendência de registro. Tudo pronto para a amostra.</p>
                ) : null}
                {v.pendFiltroVazio ? <p className="tx-hoje-nota">Nenhuma pendência com "{v.busca}".</p> : null}
              </div>
            </section>
          </div>
          <div className="tx-hoje-coluna">
            {this.renderVencimentos(v, 'Vencimentos')}
            <Cartao como="section" titulo="Auditoria" className="tx-hoje-folha">
              <p className="tx-tipo-denso tx-sec" style={{ margin: 0, lineHeight: 'var(--lh-paragrafo)' }}>
                {v.simTxt}
              </p>
              <div style={{ marginTop: 'var(--esp-3)' }}>
                <Botao variante="contorno" tamanho="p" href="/auditoria">
                  Rastrear placa ou montar amostra
                </Botao>
              </div>
            </Cartao>
          </div>
        </div>
      </>
    );
  }

  renderFrota(v) {
    return (
      <>
        {this.renderKpis(v)}
        {this.renderNadaAchado(v)}
        <div className="tx-hoje-baixo">
          <section id="tx-hoje-frota-viagens" className="tx-cartao tx-cartao--lista tx-hoje-folha" aria-labelledby="tx-hoje-frota-t">
            <div className="tx-cartao__cab">
              <div className="tx-cartao__titulos">
                <h2 id="tx-hoje-frota-t" className="tx-cartao__titulo">
                  Viagens da frota própria hoje <span className="tx-hoje-secao__q num">{v.frotaLinhas.length}</span>
                </h2>
              </div>
              <div className="tx-cartao__acoes">
                <Botao variante="contorno" tamanho="p" href="/frota">
                  Abrir a frota
                </Botao>
              </div>
            </div>
            <div className="tx-hoje-lista">
              {v.frotaLinhas.map((fl) => (
                <A key={fl.id} href={fl.href} className="tx-hoje-item tx-hoje-item--frota" data-tx-linha={fl.id}>
                  <span className="tx-hoje-hora" style={{ textAlign: 'left' }}>
                    <span className="tx-hoje-hora__h" style={{ display: 'block' }}>
                      {fl.janela}
                    </span>
                    <span className={'tx-hoje-hora__prazo' + (fl.urgente ? ' tx-hoje-hora__prazo--urgente' : '')}>{fl.prazo}</span>
                  </span>
                  <span style={{ flex: '1', minWidth: '0' }}>
                    <span className="tx-mono tx-tipo-denso tx-peso-600" style={{ display: 'block' }}>
                      {fl.placas}
                    </span>
                    <span className="tx-tipo-legenda tx-peso-400 tx-sec tx-hoje-corta" style={{ display: 'block' }}>
                      {fl.motorista}, {fl.ordem}, {fl.filial}
                    </span>
                  </span>
                  <Situacao tom={fl.tom} detalhe={fl.motivo}>
                    {fl.res}
                  </Situacao>
                  <span className="tx-hoje-item__seta" aria-hidden>
                    ›
                  </span>
                </A>
              ))}
              {v.frotaVazio ? <p className="tx-hoje-nota">{v.frotaVazio}</p> : null}
            </div>
          </section>
          <div className="tx-hoje-coluna">{this.renderVencimentos(v, 'Documentos da frota')}</div>
        </div>
      </>
    );
  }

  renderNova(v) {
    return (
      <Modal
        id="nova"
        data-tx-modal="nova"
        tamanho="xg"
        titulo={v.nTitulo}
        extra={v.nTemFiliais && !v.nP3 ? null : <Badge>{'filial ' + v.nFilialNome}</Badge>}
        aoFechar={v.fecharModal}
        falta={v.nDica}
        acoes={
          <>
            {v.nVoltar ? <Botao onClick={v.nVoltarFn}>Voltar</Botao> : null}
            {v.nP3 ? <Botao href={v.nHref}>Abrir viagem</Botao> : null}
            <Botao variante="primario" inativo={!v.ctaOk} onClick={v.nAvancar} data-tx-confirmar="" role="button">
              {v.nAvancarRot}
            </Botao>
          </>
        }
      >
        <ol className="tx-hoje-passos" aria-label="Passos" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {v.nPassos.map((np) => (
            <li key={np.n} className={'tx-hoje-passo' + (np.on ? ' tx-hoje-passo--on' : '')} aria-current={np.atual ? 'step' : undefined}>
              {np.n}
            </li>
          ))}
        </ol>
        {v.nP1 ? (
          <>
            <div>
              <label data-tx-importar-pdf="" className={'tx-hoje-importar' + (v.pdfOk ? ' tx-hoje-importar--ok' : '')}>
                <input type="file" accept=".pdf" onChange={v.onPdf} className="tx-so-leitor" />
                <span className="tx-hoje-importar__icone">{IconePdf}</span>
                <span style={{ flex: '1', minWidth: '0' }}>
                  <span className="tx-hoje-importar__titulo" style={{ display: 'block' }}>
                    {v.pdfTitulo}
                  </span>
                  <span className="tx-hoje-importar__sub" style={{ display: 'block' }}>
                    {v.pdfSub}
                  </span>
                </span>
                <Botao variante="texto" onClick={v.usarOrdemExemplo} data-tx-ordem-exemplo="" className="tx-acao-texto">
                  Usar ordem de exemplo
                </Botao>
              </label>
              {v.pdfErro ? (
                <div className="tx-erro" role="alert" data-tx-arquivo-erro="">
                  {v.pdfErro}
                </div>
              ) : null}
              <div className="tx-hoje-ou" style={{ marginTop: 'var(--esp-2)' }}>
                ou preencha o mínimo:
              </div>
            </div>
            {v.nTemFiliais ? <Escolhas id="nv-fil" rotulo="Filial que carrega" itens={v.nFiliais} /> : null}
            <div className="tx-hoje-form">
              <div style={{ position: 'relative' }}>
                <Campo id="nv-produto" rotulo="Produto" campo="produto" erro={v.eProd}>
                  <Entrada
                    value={v.nProdBusca ?? ''}
                    onChange={v.onProdBusca}
                    placeholder="farelo, milho, casquinha..."
                    autoComplete="off"
                  />
                </Campo>
                {v.nProdLista && v.nProdOps.length ? (
                  <div className="tx-hoje-sugestoes" role="listbox" aria-label="Produtos encontrados">
                    {v.nProdOps.map((po) => (
                      <button
                        key={po.id}
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={po.onClick}
                        data-tx-produto-op={po.id}
                        className="tx-hoje-sugestao"
                      >
                        <b>{po.n}</b> <span className="tx-tipo-legenda tx-peso-400 tx-apagado">{po.via}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Campo id="nv-ordem" rotulo="Ordem de carregamento" campo="ordem" erro={v.eOrdem}>
                <Entrada mono value={v.nOrdem ?? ''} onChange={v.onOrdem} placeholder="OC 48140" />
              </Campo>
              <Escolhas
                id="nv-emb"
                rotulo="Embarcador"
                itens={v.nEmbs}
                erro={v.eEmb}
                depois={
                  <Selecao className="tx-hoje-outro" value={v.nEmbOutro} onChange={v.onEmbOutro} aria-label="Outro embarcador">
                    <option value="">Outro...</option>
                    {v.nEmbTodos.map((x) => (
                      <option key={x.k} value={x.k}>
                        {x.n}
                      </option>
                    ))}
                  </Selecao>
                }
              />
              <Escolhas
                id="nv-dest"
                rotulo="Destinatário"
                itens={v.nDests}
                erro={v.eDest}
                depois={
                  <Selecao className="tx-hoje-outro" value={v.nDestOutro} onChange={v.onDestOutro} aria-label="Outro destinatário">
                    <option value="">Outro...</option>
                    {v.nDestTodos.map((x) => (
                      <option key={x.k} value={x.k}>
                        {x.n}
                      </option>
                    ))}
                  </Selecao>
                }
              />
              <Escolhas
                id="nv-dia"
                rotulo="Carregamento"
                itens={v.nDias}
                erro={v.eData || v.eJanela}
                depois={
                  <>
                    <CampoData
                      className="tx-hoje-data"
                      valor={v.nDiaTxt}
                      aoMudar={v.onDia}
                      data-tx-campo="data"
                      aria-label="Data do carregamento"
                      aria-invalid={v.eData ? true : undefined}
                    />
                    <Entrada
                      className="tx-hoje-janela"
                      value={v.nJanela ?? ''}
                      onChange={v.onJanela}
                      data-tx-campo="janela"
                      aria-label="Horário do carregamento"
                      aria-invalid={v.eJanela ? true : undefined}
                      inputMode="numeric"
                      placeholder="18:30"
                    />
                  </>
                }
              />
              <Campo id="nv-peso" rotulo="Peso (t)" campo="peso" erro={v.ePeso}>
                <Entrada className="num" value={v.nPeso ?? ''} onChange={v.onPeso} inputMode="decimal" />
              </Campo>
            </div>
            <div className={'tx-hoje-assegura tx-hoje-assegura--' + v.asTom} role="status">
              <span className="tx-hoje-ponto" aria-hidden />
              {v.asTxt}
            </div>
          </>
        ) : null}
        {v.nP2 ? (
          <>
            <div role="radiogroup" aria-label="Quem carrega" className="tx-escolhas" style={{ marginTop: 0 }}>
              {v.nTipos.map((nt) => (
                <Chip key={nt.k} selecionado={nt.pressed} onClick={nt.onClick} data-tx-tipo={nt.k}>
                  {nt.n}
                </Chip>
              ))}
            </div>
            {v.nTerceiro ? (
              <>
                <Campo id="nv-quem" rotulo="Placa do cavalo ou CPF do motorista" campo="quem" erro={v.eQuem}>
                  <Entrada
                    mono
                    value={v.nQuem ?? ''}
                    onChange={v.onQuem}
                    placeholder="Ex.: RCB 9M15 ou 633.081.277-19"
                    autoComplete="off"
                  />
                </Campo>
                {v.nAchados.length ? (
                  <div role="radiogroup" aria-label="Encontrados na base" className="tx-hoje-opcoes">
                    {v.nAchados.map((na) => (
                      <OpcaoCartao
                        key={na.id}
                        titulo={na.nome}
                        sub={
                          <>
                            <span className="tx-hoje-opcao__placas">{na.placas}</span>
                            <span className={'tx-hoje-opcao__doc' + (na.docTom !== 'ok' ? ' tx-hoje-opcao__doc--' + na.docTom : '')}>
                              {na.docs}
                            </span>
                          </>
                        }
                        selecionado={na.checked}
                        inativo={na.ariaDisabled}
                        onClick={na.onClick}
                        data-tx-achado={na.id}
                      >
                        {na.pessoa ? (
                          <span className="tx-hoje-avatar tx-hoje-avatar--p" style={{ marginLeft: 'auto' }} aria-hidden>
                            {na.ini}
                          </span>
                        ) : null}
                      </OpcaoCartao>
                    ))}
                  </div>
                ) : null}
                {v.nEscConj ? <Escolhas id="nv-conj" rotulo="Conjunto que carrega" itens={v.nConjsT} erro={v.eConjT} /> : null}
                {v.nEscMot ? <Escolhas id="nv-mot" rotulo="Motorista" itens={v.nMotsT} erro={v.eMotT} /> : null}
                {v.nNaoAchou ? (
                  <div className="tx-hoje-cadastro">
                    <div className="tx-hoje-cadastro__titulo">Não encontrado na base. Cadastro mínimo:</div>
                    <div className="tx-hoje-cadastro__sub">O resto (CNH, RNTRC, CRLV) o motorista manda pelo link.</div>
                    <div className="tx-hoje-form tx-hoje-form--compacto" style={{ marginTop: 'var(--esp-2-5)' }}>
                      <Campo id="nv-cm-nome" rotulo="Nome do motorista" campo="cm-nome" erro={v.eCmNome}>
                        <Entrada value={v.cmNome ?? ''} onChange={v.onCmNome} placeholder="Como no documento" autoComplete="off" />
                      </Campo>
                      <Campo id="nv-cm-tel" rotulo="Celular com DDD" campo="cm-tel" erro={v.eCmTel}>
                        <Entrada
                          inputMode="tel"
                          value={v.cmTel ?? ''}
                          onChange={v.onCmTel}
                          placeholder="(66) 99999-0000"
                          autoComplete="off"
                        />
                      </Campo>
                      <Campo
                        id="nv-cm-cpf"
                        rotulo="CPF do motorista"
                        campo="cm-cpf"
                        erro={v.eCmCpf}
                        dica="O motorista confirma por ele no link."
                      >
                        <Entrada
                          mono
                          inputMode="numeric"
                          value={v.cmCpf ?? ''}
                          onChange={v.onCmCpf}
                          placeholder="000.000.000-00"
                          autoComplete="off"
                        />
                      </Campo>
                      <Campo id="nv-cm-placas" rotulo="Placas do conjunto" campo="cm-placas" erro={v.eCmPlacas}>
                        <Entrada
                          mono
                          value={v.cmPlacas ?? ''}
                          onChange={v.onCmPlacas}
                          placeholder="RCB 9M15, RCB 9M16"
                          autoComplete="off"
                        />
                      </Campo>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
            {v.nPropria ? (
              <div role="radiogroup" aria-label="Conjunto da frota própria" className="tx-hoje-opcoes">
                {v.nConjs.map((nc) => (
                  <OpcaoCartao
                    key={nc.placas}
                    titulo={<span className="tx-hoje-opcao__titulo-mono">{nc.placas}</span>}
                    sub={<span className={nc.fora ? 'tx-hoje-opcao__doc tx-hoje-opcao__doc--perigo' : undefined}>{nc.sub}</span>}
                    selecionado={nc.checked}
                    inativo={nc.ariaDisabled}
                    onClick={nc.onClick}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
        {v.nP2 && v.nOcupada ? (
          <Aviso tom="aviso" titulo="Conjunto já carrega neste dia.">
            {v.nOcupada}
          </Aviso>
        ) : null}
        {v.nP3 ? (
          <>
            <Aviso tom="ok" titulo={v.nCriadaTxt}>
              Agora mande o link: o motorista informa as cargas, as fotos e assina pelo celular.
            </Aviso>
            <div className="tx-hoje-mensagem">
              <div className="tx-hoje-mensagem__balao">{v.nMensagem}</div>
            </div>
          </>
        ) : null}
      </Modal>
    );
  }
}
