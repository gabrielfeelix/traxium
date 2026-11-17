// Detalhe da viagem: decisão, o que falta e quem resolve, T-3, verificação, liberação, linha do tempo e registro.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Botao,
  Campo,
  Entrada,
  AreaTexto,
  EntradaCaixa,
  CampoData,
  Checkbox,
  Chip,
  Escolhas,
  OpcaoCartao,
  Situacao,
  Badge,
  Aviso,
  Cartao,
  Linha,
  EstadoVazio,
  Modal,
  Drawer,
  Trilha,
  Placa,
  Avatar,
  IconeTipo,
  Termo,
  Dica,
  SeloRegime,
  listaFalta,
} from '@/components/ui';
import './Viagem.css';

export default class Viagem extends Tela {
  state = { loading: true, modal: null, acoesOpen: false };
  componentDidMount() {
    TX.ui.montar(this);
    // Cabeçalho que encolhe ao rolar (U30): a sentinela de 120 px saiu da tela, a barra fixa aparece.
    if (typeof IntersectionObserver !== 'undefined' && this._sentinela) {
      this._obs = new IntersectionObserver((es) => {
        const fora = !es[0].isIntersecting;
        if (fora !== !!this.state.compacto) this.setState({ compacto: fora });
      });
      this._obs.observe(this._sentinela);
    }
    if (TX.ui.param('liberar')) {
      const lib = TX.liberacaoDe(TX.viagem(this.vid()));
      if (lib) this.abrir('liberar', { fEscopo: false });
    }
    if (location.hash)
      setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView({ block: 'center' });
      }, 900);
  }
  componentWillUnmount() {
    if (this._obs) this._obs.disconnect();
    super.componentWillUnmount();
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  vid() {
    const p = TX.ui.param('id');
    return p && TX.viagem(p) ? p : 'VG-3116';
  }
  abrir(modal, extra) {
    this.setState(
      Object.assign(
        {
          modal,
          acoesOpen: false,
          fMotivo: '',
          fItens: [],
          fJust: '',
          fMot: null,
          fRisco: null,
          fValidade: null,
          fEvid: null,
          fEscopo: false,
          fCiencia: false,
          fInspetor: '',
          fLaudo: '',
          fOpcao: 'A',
          fBuscaPlaca: '',
          fConj: null,
          fComp: null,
          fLavador: null,
          fComprovante: '',
          fTipo: null,
          fGrav: null,
          fCampo: 'peso',
          fNovo: '',
        },
        extra || {},
      ),
    );
  }
  renderVals() {
    return Object.assign({}, TX.ui.base(this), this.telaVals(), this.modalVals());
  }

  telaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const v = TX.viagem(this.vid());
    const dec = TX.decidir(v);
    const tom = U.tomResultado(dec);
    const prod = TX.produto(v.produto),
      emb = TX.embarcador(v.embarcador),
      dest = TX.destinatario(v.destinatario),
      fil = TX.filial(v.filial);
    const conj = TX.conjunto(v.conjunto),
      t = TX.transportador(v.transportador),
      mot = TX.pessoa(v.motorista);
    const cic = TX.ciclo(v),
      le = TX.linkEstado(v);
    const u = TX.sessao();
    const ck = v.checklist,
      vf = v.verificacao;
    // Regime de limpeza: letra, classe de cor (Viagem.css) e nome por extenso para o title.
    const regime = (r) => {
      const k = ['A', 'B', 'C', 'D', 'X'].includes(r) ? r : 'nd';
      const nome =
        k === 'X'
          ? 'carga proibida'
          : k === 'nd'
            ? 'regime não definido'
            : 'regime ' + k + ': ' + ((TX.REGIMES[k] || {}).n || '').toLowerCase();
      return { regL: k === 'X' ? '✕' : k === 'nd' ? '?' : k, regK: k, regN: nome };
    };
    const cobTxt = {
      propria: 'Frota própria no escopo GMP+',
      certificado: 'ETC certificada GMP+',
      gatekeeper: t && t.tipo === 'ETC' ? 'ETC sob gatekeeper' : 'TAC sob gatekeeper',
    }[dec.cobertura];

    // decisão
    const fl = dec.falta;
    const primeiro = fl[0] || {};
    // Só a primeira letra desce, e só quando não é sigla ("CRLV das placas" continua CRLV).
    const minusc = (t) => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
    // Rótulo da falha (M13): o nome da checagem é afirmação positiva ("Transportador sem ocorrência
    // grave em aberto"); o título precisa do motivo. TX.rotuloFalha vem do motor; o mapa local é a reserva.
    const FALHA = {
      ocorrencia: 'transportador em revisão após ocorrência grave',
      'docs-conj': 'CRLV vencido no conjunto',
      'docs-transp': 'RNTRC do transportador vencido',
      'docs-mot': 'CNH do motorista vencida',
    };
    const FALHA_NOME = {
      'Gatekeeper comunicado ao organismo certificador': 'filial sem comunicação ao organismo certificador',
      'Certificado GMP+ do transportador': 'certificado GMP+ do transportador vencido',
      'Conjunto no escopo GMP+': 'conjunto fora do escopo GMP+',
    };
    const falha = (f) =>
      (TX.rotuloFalha && TX.rotuloFalha(f.k, v)) ||
      f.motivo ||
      FALHA_NOME[f.o] ||
      (f.k === 'docs-mot' ? minusc(f.o) + ' vencida' : FALHA[f.k]) ||
      minusc(f.o || '');
    // Regras em "Só alerta" deixam a viagem pronta, mas o alerta aparece no título (M24).
    const alertas = dec.checagens.filter((c) => c.aviso && /^Alerta/.test(c.detalhe || ''));
    const motivoNA = !prod.racao ? prod.nome + ' não é ração.' : 'Destinatário sem certificação GMP+.';
    const heroTitulo = {
      pronta: dec.porAutoridade
        ? 'Liberada por autoridade'
        : alertas.length
          ? 'Pronta com ' +
            (alertas.length === 1 ? '1 alerta' : alertas.length + ' alertas') +
            ': ' +
            alertas.map((c) => c.detalhe.replace(/^Alerta \(regra configurada como alerta\): /, '')).join('; ')
          : 'Pronta para assegurar',
      falta: fl.length === 1 ? 'Falta 1 item para assegurar' : 'Faltam ' + fl.length + ' itens para assegurar',
      bloqueada: 'Bloqueada: ' + falha(primeiro),
      tecnico:
        primeiro.k === 'regime'
          ? /proibida/.test(primeiro.detalhe || '')
            ? 'Carga anterior proibida no compartimento'
            : 'Carga anterior fora da base IDTF'
          : primeiro.k === 'verificacao'
            ? 'Resto de carga no compartimento'
            : 'Produto fora da base IDTF',
      nao_assegurada: 'Viagem sem declaração GMP+',
      cancelada: 'Viagem cancelada',
    }[dec.resultado];
    const heroSub = {
      pronta: dec.porAutoridade
        ? 'Pronta para assegurar com a liberação assinada; o motor continua reprovando a regra liberada. Copie a declaração no CT-e emitido no TMS.'
        : alertas.length
          ? 'A regra está configurada como alerta e não trava a viagem. Copie a declaração no CT-e emitido no TMS.'
          : 'As ' + dec.total + ' checagens aplicáveis passaram. Copie a declaração no CT-e emitido no TMS.',
      falta: '',
      bloqueada: primeiro.detalhe,
      tecnico: primeiro.detalhe,
      nao_assegurada: motivoNA + ' A viagem segue sem a declaração positiva no CT-e e não entra na amostra de afretamento GMP+.',
      cancelada: v.cancelada ? v.cancelada.motivo : '',
    }[dec.resultado];
    const lib = (v.liberacoes || [])[0];
    const libCheck = dec.checagens.find((c) => c.liberadaPor);
    const bloqItem = fl.find((f) => f.estado === 'bloqueio' && !f.tecnico) || {};
    const podeLib = ['qualidade', 'direcao'].includes(bloqItem.alcada);
    // Quem tem a alçada libera; quem não tem pede a liberação, como na linha da mesa em Hoje.
    const libV = TX.liberacaoDe(v),
      assina = !!libV && TX.podeAssinar(TX.sessao(), libV.alcada);
    const tecPrimeiro = fl.find((f) => f.tecnico) || {};

    const acaoFalta = (f) => {
      if (f.k === 'verificacao' && /esperando conferência/.test(f.detalhe))
        return [
          'Conferir as fotos',
          () => {
            const el = document.getElementById('tx-verif');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          },
        ];
      if (f.k === 'regime') return ['Registrar limpeza', () => this.abrir('limpeza')];
      if (/Motorista/.test(f.quem))
        return [le.k === 'nao_enviado' ? 'Enviar link ao motorista' : 'Lembrar o motorista', () => this.abrir('mensagem')];
      if (f.k === 't3' && v.tipo === 'propria')
        return [
          'Abrir frota',
          () => {
            TX.ui.ir('/frota');
          },
        ];
      return null;
    };
    // Pendências agrupadas por quem resolve: um grupo, uma ação (quatro "Enviar link" viram um).
    const faltaBruta = fl.map((f) => {
      const a = acaoFalta(f);
      return { k: f.k, o: f.o, detalhe: f.detalhe, quem: f.quem, acao: a ? a[0] : '', onClick: a ? a[1] : null };
    });
    const faltaGrupos = [];
    faltaBruta.forEach((f) => {
      let g = faltaGrupos.find((x) => x.quem === f.quem);
      if (!g) faltaGrupos.push((g = { quem: f.quem, itens: [], acao: '', onClick: null, k: '' }));
      g.itens.push(f);
      if (!g.acao && f.acao) Object.assign(g, { acao: f.acao, onClick: f.onClick, k: f.k });
    });
    const faltaPrim = faltaBruta.find((f) => f.acao) || null;
    const faltaKs = fl.map((f) => f.k);

    // passos
    const feito = () => ({ icon: '✓', st: 'feito' });
    const atual = (n) => ({ icon: n, st: 'atual' });
    const pend = (n) => ({ icon: n, st: 'pend' });
    const bloq = () => ({ icon: '✕', st: 'bloq' });
    const vAprov = vf && vf.estado === 'aprovada';
    const linkFim = le.k === 'concluido';
    const pronta = dec.resultado === 'pronta';
    const travou = dec.resultado === 'bloqueada' || dec.resultado === 'tecnico';
    const passosDef = [
      ['Viagem criada', F.quando(v.criadaEm), feito()],
      ['Link enviado', v.link.enviadoEm ? F.quando(v.link.enviadoEm) : 'ainda não', v.link.enviadoEm ? feito() : atual(2)],
      [
        'Motorista preencheu',
        linkFim ? F.quando(le.em) : v.link.enviadoEm ? le.n : 'espera o link',
        linkFim ? feito() : v.link.enviadoEm ? atual(3) : pend(3),
      ],
      [
        'Conferência',
        vAprov ? F.quando(vf.em) : vf && vf.estado === 'devolvida' ? 'devolvida' : ck && ck.enviadoEm ? 'sua vez' : 'espera as fotos',
        vAprov ? feito() : vf && vf.estado === 'devolvida' ? bloq() : ck && ck.enviadoEm ? atual(4) : pend(4),
      ],
      [
        'Pronta',
        pronta ? 'declaração liberada' : travou ? dec.rotulo.toLowerCase() : 'ainda não',
        pronta ? feito() : travou ? bloq() : pend(5),
      ],
      ['CT-e conciliado', v.cte ? 'CT-e ' + v.cte.numero : 'pela conciliação', v.cte ? feito() : pend(6)],
    ];
    const passos = passosDef.map((p) => Object.assign({ n: p[0], sub: p[1] }, p[2]));

    // checagens
    const ROT = { ok: 'passou', falta: 'falta', bloqueio: 'bloqueia', na: 'não se aplica' };
    const checagens = dec.checagens.map((c) => {
      const k = c.liberadaPor ? 'autoridade' : c.estado === 'bloqueio' && c.tecnico ? 'tecnico' : c.estado;
      return {
        k: c.k,
        estado: c.estado,
        nome: c.nome,
        detalhe: c.detalhe,
        tom: U.tom(k).k,
        na: c.estado === 'na',
        rot: c.liberadaPor ? 'reprova' : c.tecnico && c.estado === 'bloqueio' ? 'técnico' : ROT[c.estado],
        aviso: !!c.aviso && c.estado === 'ok',
        lib: !!c.liberadaPor,
      };
    });
    // A lista abre com o que não passou primeiro.
    const ordemCh = { bloqueio: 0, falta: 1, ok: 2, na: 3 };
    checagens.sort((a, b) => (ordemCh[a.estado] ?? 2) - (ordemCh[b.estado] ?? 2));

    // T-3
    const compsT3 = dec.t3.map((c) => {
      const r = c.regimeExigido;
      const cargas = [0, 1, 2].map((i) => {
        const x = c.cargas[i];
        if (!x)
          return {
            rot: 'T-' + (i + 1),
            data: '',
            nome: 'não informada',
            vazio: true,
            proib: false,
            temReg: false,
            fonte: v.tipo === 'propria' ? 'sem registro na frota' : 'o motorista informa pelo link',
            temHref: false,
          };
        const fonte = x.confere
          ? (x.fonte === 'viagem' && v.tipo !== 'propria' ? 'confere com a ' : 'viagem ') + x.confere
          : x.fonte === 'registro'
            ? 'registro inicial da frota'
            : 'declarada pelo motorista';
        return Object.assign(
          {
            rot: 'T-' + (i + 1),
            data: F.curta(x.data),
            nome: x.produto ? x.produto.nome : '"' + x.texto + '" (fora da base)',
            vazio: false,
            proib: x.regime === 'X',
            temReg: true,
            fonte,
            temHref: !!x.confere,
            href: '/viagem?id=' + x.confere,
          },
          regime(x.regime),
        );
      });
      return Object.assign(
        {
          placa: c.placa,
          pos: c.pos,
          origemTxt: c.origem === 'historico' ? 'lido do histórico da frota' : 'declarado pelo motorista no link',
          href: '/compartimento?placa=' + encodeURIComponent(c.placa) + '&pos=' + c.pos,
          cargas,
        },
        regime(r === '?' ? null : r),
      );
    });

    // verificação: o desenho de cada foto é classe em Viagem.css (tx-viagem-foto--<item>).
    const ICONES = {
      lona: 'M2 6c2-2 4-2 6 0s4 2 6 0M2 10c2-2 4-2 6 0s4 2 6 0',
      correntes: 'M3 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M9 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 8h2',
      cintas: 'M2 5h12M2 8h12M2 11h12',
      carroceria: 'M2 5h12v6H2zM5 5v6M8 5v6M11 5v6',
      interior: 'M3 12 5 4h6l2 8z',
    };
    const devolvidos = vf && vf.estado === 'devolvida' && !vf.reenviadoEm ? vf.itens || [] : [];
    const itensCk = TX.ITENS_CHECKLIST.map((it) => {
      const resp = ck && ck.itens ? ck.itens[it.k] : null;
      const temFoto = !!(ck && ck.fotos && ck.fotos[it.k]);
      const dev = devolvidos.includes(it.k);
      return {
        k: it.k,
        n: it.n,
        temFoto,
        icon: ICONES[it.k],
        hora: temFoto && ck.enviadoEm ? F.hora(ck.enviadoEm) : '',
        resp: resp === 'ok' || resp === 'nao' ? resp : '',
        respRot: resp === 'ok' ? 'OK' : resp === 'nao' ? 'NÃO' : '',
        dev,
        critico: !!it.critico,
        sub: dev ? 'devolvido: nova foto' : temFoto ? 'Abrir foto' : 'sem foto ainda',
        onClick: () => {
          if (temFoto) this.abrir('foto', { fotoK: it.k });
        },
      };
    });
    let verifK = 'nao',
      verifRot = 'checklist não enviado',
      vt = U.tom('na');
    if (ck && ck.enviadoEm && ck.itens.interior === 'nao') {
      verifK = 'reprovado';
      verifRot = 'item crítico reprovado';
      vt = U.tom('tecnico');
    } else if (vAprov && (!ck || vf.em >= ck.enviadoEm)) {
      verifK = 'aprovada';
      verifRot = 'aprovada';
      vt = U.tom('ok');
    } else if (devolvidos.length) {
      verifK = 'devolvida';
      verifRot = 'devolvida ao motorista';
      vt = U.tom('bloqueio');
    } else if (ck && ck.enviadoEm) {
      verifK = 'conferir';
      verifRot = 'esperando conferência';
      vt = U.tom('falta');
    } else if (ck && ck.itens && Object.keys(ck.itens).length) {
      verifK = 'parcial';
      verifRot = 'motorista preenchendo';
      vt = U.tom('info');
    }
    const verifMeta =
      verifK === 'aprovada'
        ? 'por ' + TX.usuario(vf.por).nome + ', ' + F.quando(vf.em)
        : ck && ck.enviadoEm
          ? 'enviado ' + F.quando(ck.enviadoEm) + (ck.gps ? ', ' + ck.gps : '')
          : '';
    const podeConferir = verifK === 'conferir' && !v.cancelada;

    // limpeza
    const precisaLimpeza = dec.t3.some((c) => c.regimeExigido && !['A', 'X', '?'].includes(c.regimeExigido));
    const limpezas = (v.limpezas || []).map((l) => ({
      regime: l.regime,
      comp: l.comp.replace('#', ' '),
      lavador: (TX.fornecedor(l.lavador) || {}).nome,
      comprovante: l.comprovante,
    }));

    // linha do tempo
    const lt = TX.linhaDoTempo(v);
    const tomLt = { motorista: 'info', equipe: 'ok', alerta: 'falta', sistema: 'na' };
    const tempo = lt.map((e) => ({
      texto: e.texto,
      quem: e.quem,
      quando: F.quando(e.em),
      tom: tomLt[e.tipo] || 'na',
    }));

    // transportador: cada documento mostra a validade em texto, não só um ponto.
    const de = (val) => {
      const d = TX.docEstado(val, v.data < TX.HOJE ? v.data : TX.HOJE);
      return { tom: d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio', tip: d.rotulo };
    };
    let tNome, tTipo, tIni, tG1, tG2, tDocs, tHref, tLink;
    if (!t) {
      tNome = mot.nome;
      tTipo = 'Motorista da frota própria';
      tIni = F.iniciais(mot.nome);
      tG1 = mot.g1;
      tG2 = mot.g2;
      tDocs = [
        { l: 'CPF', v: F.cpfMascara(mot.cpf) },
        Object.assign({ l: 'CNH', v: mot.cnh.numero }, de(mot.cnh.validade)),
        { l: 'Telefone', v: mot.telefone },
        { l: 'Escopo', v: conj.escopo && conj.escopo.no ? 'no escopo GMP+' : 'fora do escopo' },
      ];
      tHref = '/frota';
      tLink = 'Abrir frota própria';
    } else if (t.tipo === 'TAC') {
      tNome = mot.nome;
      tTipo = cobTxt + (t.cadastroMinimo ? ', cadastro mínimo' : '');
      tIni = F.iniciais(mot.nome);
      tG1 = mot.g1;
      tG2 = mot.g2;
      tDocs = [
        { l: 'CPF', v: F.cpfMascara(mot.cpf) },
        Object.assign(
          { l: 'RNTRC', v: t.rntrc ? t.rntrc.numero : 'não informado' },
          t.rntrc ? de(t.rntrc.validade) : { tom: 'falta', tip: 'não informado' },
        ),
        Object.assign(
          { l: 'CNH', v: mot.cnh ? mot.cnh.numero : 'não informada' },
          mot.cnh ? de(mot.cnh.validade) : { tom: 'falta', tip: 'não informada' },
        ),
        { l: 'Telefone', v: mot.telefone },
      ];
      tHref = '/transportadores?id=' + t.id;
      tLink = 'Abrir cadastro do TAC';
    } else {
      tNome = t.nome;
      tTipo = cobTxt;
      tIni = F.iniciais(t.nome);
      tG1 = 'var(--primario-2)';
      tG2 = 'var(--azul)';
      tDocs = [{ l: 'CNPJ', v: t.cnpj }, Object.assign({ l: 'RNTRC', v: t.rntrc.numero }, de(t.rntrc.validade))];
      if (t.certificado) tDocs.push(Object.assign({ l: 'Certificado', v: t.certificado.numero }, de(t.certificado.validade)));
      tDocs.push(Object.assign({ l: 'Motorista', v: mot.nome + ', CNH' }, de(mot.cnh.validade)));
      tHref = '/transportadores?id=' + t.id;
      tLink = 'Abrir cadastro da ETC';
    }
    const qual = t ? TX.qualificacao(t) : null;
    const tAnel = qual ? U.tom({ apto: 'ok', restricao: 'falta', pendente: 'falta', bloqueado: 'bloqueio' }[qual.k]).k : 'ok';
    const tQual = qual ? qual.n || qual.rotulo || '' : '';

    const conjPlacas = TX.placasDoConjunto(conj).map((pl, i) => {
      const p = TX.placa(pl);
      const d = TX.docEstado(p.crlv && p.crlv.validade, v.data < TX.HOJE ? v.data : TX.HOJE);
      return {
        papel: i === 0 ? 'Cavalo' : 'Carreta ' + i,
        placa: pl,
        crlv: 'CRLV ' + d.rotulo,
        crlvTom: d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio',
        comps:
          p.tipo === 'carreta'
            ? (p.comps || ['C1']).map((pos) => ({ pos, href: '/compartimento?placa=' + encodeURIComponent(pl) + '&pos=' + pos }))
            : [],
      };
    });

    // link
    const l = v.link || {};
    const gk = dec.cobertura === 'gatekeeper';
    const passosLink = [
      ['Abriu o link', l.abertoEm],
      ['Confirmou dados e placas', l.cpfEm],
    ];
    if (v.tipo !== 'propria') passosLink.push(['Três últimas cargas', l.t3Em]);
    passosLink.push(['Checklist com fotos', l.checklistEm], ['Leu o manual', l.manualEm]);
    if (gk) passosLink.push(['Assinou o termo', l.assinadoEm]);
    const linkPassos = passosLink.map((p) => ({
      n: p[0],
      em: p[1] ? F.quando(p[1]) : '',
      feito: !!p[1],
    }));
    const linkTom =
      { nao_enviado: 'falta', enviado: 'info', aberto: 'info', preenchendo: 'info', concluido: 'ok', cancelado: 'na' }[le.k] || 'na';
    const naoEnviado = le.k === 'nao_enviado';

    // registro para auditoria
    const temT3 = dec.t3.length && dec.t3.every((c) => c.completo);
    // Cada linha: ok, pendente ou não se aplica. O que já está nas pendências não repete o "pendente"
    // laranja: aponta para o bloco de cima (U31). Viagem que não fica pronta não terá declaração (M23).
    const prontaOuLib = dec.resultado === 'pronta';
    const semDeclaracao = !v.cte && !prontaOuLib && dec.resultado !== 'falta';
    const auditItens = [
      [
        't3',
        'Declaração das três últimas cargas',
        temT3 ? 'ok' : 'falta',
        temT3 ? (v.tipo === 'propria' ? 'histórico' : F.curta((l.t3Em || '').slice(0, 10))) : 'pendente',
      ],
      ['verificacao', 'Conformidade do compartimento', vAprov ? 'ok' : 'falta', vAprov ? F.curta(vf.em.slice(0, 10)) : 'pendente'],
      [
        'termo',
        'Termo de compromisso',
        !gk ? 'na' : v.termo ? 'ok' : 'falta',
        !gk ? 'não se aplica' : v.termo ? F.curta(v.termo.em.slice(0, 10)) : 'pendente',
      ],
      [
        'manual',
        'Ciência do manual',
        dec.cobertura === 'certificado' ? 'na' : v.manual ? 'ok' : 'falta',
        dec.cobertura === 'certificado'
          ? 'não se aplica'
          : v.manual
            ? 'v' + v.manual.versao + ', ' + F.curta(v.manual.em.slice(0, 10))
            : 'pendente',
      ],
      ['registro', 'Registro de viagem', 'ok', F.curta((v.criadaEm || '').slice(0, 10))],
      [
        'cte',
        'DACTE com declaração positiva',
        v.cte ? 'ok' : semDeclaracao ? 'na' : 'falta',
        v.cte ? v.cte.numero : semDeclaracao ? 'sem declaração' : 'a conciliar',
      ],
      ['nf', 'Nota fiscal', v.cte ? 'ok' : 'falta', v.cte ? v.cte.nf : 'a conciliar'],
    ].map((a) => ({ k: a[0], n: a[1], tom: a[2], ok: a[2] === 'ok', v: a[3], acima: a[2] === 'falta' && faltaKs.includes(a[0]) }));
    if (lib)
      auditItens.push({
        k: 'lib',
        n: 'Liberação por autoridade',
        tom: 'autoridade',
        ok: true,
        v: F.curta(lib.em.slice(0, 10)),
        registro: true,
      });
    const auditOkN = auditItens.filter((a) => a.ok || a.tom === 'na').length;

    const ocorrencias = TX.db.ocorrencias
      .filter((o) => o.viagem === v.id)
      .map((o) => ({
        id: o.id,
        tipo: o.tipo,
        descricao: o.descricao,
        grave: o.gravidade === 'grave',
      }));

    const cancel = !!v.cancelada;
    // Permissão por papel e filial (M40): TX.pode vem do motor; até lá, tudo liberado.
    const pode = (op) => (TX.pode ? TX.pode(op, v) : true);
    const porqueOp = (op) => (TX.porque ? TX.porque(op, v) : '') || 'indisponível para o seu perfil';
    // Ação indisponível diz por quê, no lugar da descrição.
    const porque = cancel ? 'indisponível: a viagem está cancelada' : v.cte ? 'indisponível: o CT-e já foi conciliado' : '';
    const acao = (n, sub, fn, perigo, off, op) => ({
      n,
      sub: op && !pode(op) ? porqueOp(op) : off ? porque : sub,
      onClick: () => {
        if (off || (op && !pode(op))) return;
        this.setState({ acoesOpen: false });
        fn();
      },
      perigo: !!perigo,
      off: !!off || !!(op && !pode(op)),
    });
    const acoesLista = [
      acao(
        'Registrar ocorrência',
        'resíduo, lona, carga divergente, reclamação',
        () => this.abrir('ocorrencia', { fTipo: 'Resíduo no compartimento', fGrav: 'leve' }),
        false,
        false,
        'registrarOcorrencia',
      ),
      acao('Retificar um fato', 'correção vira evento novo; o original fica', () => this.abrir('retificar'), false, cancel, 'retificar'),
      acao(
        'Trocar conjunto',
        'T-3, checklist e termo voltam a ser pedidos',
        () => this.abrir('trocar'),
        false,
        cancel || !!v.cte,
        'trocarConjunto',
      ),
      acao(
        'Cancelar viagem',
        'fica registrada como cancelada, com motivo',
        () => this.abrir('cancelar'),
        true,
        cancel || !!v.cte,
        'cancelarViagem',
      ),
    ];

    const tecProibida = tecPrimeiro.k === 'regime' && /proibida/.test(tecPrimeiro.detalhe || '');
    return {
      pronto: !s.loading,
      vOrdem: v.ordem || v.id,
      vTitulo: prod.nome + ', ' + F.peso(v.peso),
      resK: dec.resultado,
      resRotulo: dec.rotulo,
      resTom: tom.k,
      cicloN: cic.n,
      cicloSub: cic.sub || '',
      // "Carrega hoje" é informação, não selo (U35): texto secundário com a janela.
      cicloTxt:
        cic.k === 'hoje'
          ? 'carrega hoje, ' + v.janela
          : cic.k === 'cancelada'
            ? ''
            : minusc(cic.n) + (cic.sub && cic.k !== 'agendada' ? ', ' + cic.sub : cic.sub ? ' para ' + cic.sub : ''),
      embNome: emb.nome,
      embCidade: emb.cidade,
      destNome: dest.nome,
      destCidade: dest.cidade,
      ids: [
        { l: 'Ordem', v: v.ordem, mono: true },
        { l: 'CT-e', v: v.cte ? v.cte.numero : 'não conciliado', mono: !!v.cte, apagado: !v.cte },
        { l: 'NF', v: v.cte ? v.cte.nf : 'não conciliada', mono: !!v.cte, apagado: !v.cte },
        { l: 'Filial', v: fil.nome },
        { l: 'Código', v: v.id, mono: true, sec: true },
      ],
      placas: TX.placasDoConjunto(conj),
      heroPronta: dec.resultado === 'pronta',
      heroFalta: dec.resultado === 'falta',
      heroBloq: dec.resultado === 'bloqueada',
      heroTec: dec.resultado === 'tecnico',
      heroNeutro: dec.resultado === 'nao_assegurada' || dec.resultado === 'cancelada',
      heroAut: !!dec.porAutoridade && dec.resultado === 'pronta',
      heroTitulo,
      heroSub,
      declaracao: TX.DECLARACAO_CTE,
      copiarDeclaracao: () => {
        U.copiar(TX.DECLARACAO_CTE);
        this.avisar('Declaração copiada. Cole no campo de observações do CT-e no TMS.');
      },
      temAutoridade: !!libCheck,
      autoridadeTxt: libCheck ? 'O motor continua reprovando: ' + minusc(libCheck.nome) + '.' : '',
      verRegistro: () => this.abrir('registro'),
      faltaPrim,
      faltaGrupos,
      faltaTitulo:
        (fl.length === 1 ? 'Falta 1 item' : 'Faltam ' + fl.length + ' itens') +
        (faltaGrupos.length === 1 && /^Motorista/.test(faltaGrupos[0].quem)
          ? fl.length === 1
            ? ', com o motorista pelo link'
            : ', todos com o motorista pelo link'
          : ''),
      bloqResolver:
        bloqItem.resolver ||
        (podeLib
          ? 'Pode ser liberada com registro de ' +
            (bloqItem.alcada === 'direcao' ? 'Direção e RT' : 'Gestor da qualidade') +
            ', ou resolvida corrigindo o fato.'
          : ''),
      podeLiberar: podeLib && !cancel && (!libV || assina) && pode('liberar'),
      // O pedido traz a nota de quem pediu: a justificativa já abre preenchida (M15).
      abrirLiberar: () => this.abrir('liberar', { fEscopo: false, fJust: (libV && libV.pedido && libV.pedido.nota) || '' }),
      // Manter o bloqueio é decisão de quem tem a alçada daquele bloqueio (M14).
      podeManter: !cancel && !!u.alcada && (!libV || assina) && pode('manterBloqueio'),
      // Bloqueio por documento leva ao documento (M22).
      docHref: /^docs-/.test(bloqItem.k || '') ? tHref : '',
      docRot: { 'docs-conj': 'Atualizar CRLV', 'docs-transp': 'Atualizar RNTRC', 'docs-mot': 'Atualizar CNH' }[bloqItem.k] || '',
      fNotaPedido: s.fNotaPedido || '',
      onNotaPedido: (e) => this.setState({ fNotaPedido: e.target.value }),
      podePedir: !!libV && !assina && !libV.pedido,
      pedirLib: () => {
        const nota = (s.fNotaPedido || '').trim();
        if (!nota) return TX.ui.pedirLiberacao(this, v, libV);
        TX.fazer('pedirLiberacao', { id: v.id, checagem: libV.item.k, alcada: libV.alcada, nota });
        this.setState({ fNotaPedido: '' });
        this.avisar(
          'Pedido enviado a ' +
            TX.ui.nomeAlcada(libV.alcada) +
            ', com a sua nota. A ' +
            v.ordem +
            ' entra na fila de assinatura com o prazo das ' +
            v.janela +
            '.',
        );
      },
      temPedido: !!(libV && libV.pedido),
      pedidoTxt:
        libV && libV.pedido
          ? assina
            ? 'Pedida por ' + TX.usuario(libV.pedido.por).nome + ' às ' + F.hora(libV.pedido.em)
            : 'Liberação pedida às ' + F.hora(libV.pedido.em) + ', esperando assinatura de ' + TX.ui.nomeAlcada(libV.alcada)
          : '',
      bloqTemHref: !!bloqItem.href,
      bloqHref: bloqItem.href || '',
      semLiberacao: !podeLib,
      semLiberacaoTxt: 'Esta regra não tem liberação por autoridade: resolve-se corrigindo o fato.',
      abrirManter: () => this.abrir('manter', { fAcao: 'Aguardar documento' }),
      abrirTrocar: () => this.abrir('trocar'),
      abrirRegularizar: () => {
        if (tecProibida) this.abrir('regularizar');
        else if (tecPrimeiro.k === 'regime') {
          TX.fazer('pedirClassificacao', {
            texto: ((dec.t3.find((c) => c.naoClassificada) || {}).naoClassificada || {}).texto || 'produto',
            viagem: v.id,
          });
          this.avisar('Classificação pedida à Traxium. A viagem reavalia sozinha quando o produto entrar na base.');
        } else this.abrir('mensagem');
      },
      tecAcao2: tecProibida
        ? 'Regularizar conforme a TS1.9'
        : tecPrimeiro.k === 'regime'
          ? 'Pedir classificação à Traxium'
          : 'Pedir nova limpeza e fotos',
      tecAcao2Sub: tecProibida
        ? 'Opção A com inspetor independente, ou opção B com cinco cargas não ração.'
        : tecPrimeiro.k === 'regime'
          ? 'Produto fora da base trava até ser classificado.'
          : 'O motorista limpa e reenvia pelo link.',
      passos,
      chAberto: !!s.chAberto,
      chFechado: !s.chAberto,
      chToggleRot: s.chAberto ? 'Recolher' : 'Ver as ' + dec.total,
      chToggle: () => this.setState({ chAberto: !s.chAberto }),
      chResumo:
        dec.okN === dec.total
          ? 'Todas passaram. Abra para ver o detalhe de cada uma, com a data e a origem do dado.'
          : dec.okN +
            (dec.okN === 1 ? ' passou' : ' passaram') +
            '. ' +
            (dec.total - dec.okN === 1 ? 'A que não passou está' : 'As ' + (dec.total - dec.okN) + ' que não passaram estão') +
            ' no topo da tela, com quem resolve.',
      checagens,
      okN: dec.okN,
      totalN: dec.total,
      okPct: Math.round((dec.okN / Math.max(1, dec.total)) * 100) + '%',
      chTodas: dec.okN === dec.total,
      compsT3,
      itensCk,
      verifK,
      verifRot,
      verifTom: vt.k,
      verifMeta,
      verifDevolvida: devolvidos.length > 0,
      verifDevTxt: vf && vf.estado === 'devolvida' ? 'por ' + TX.usuario(vf.por).nome + ', ' + F.quando(vf.em) + ': ' + vf.motivo : '',
      podeConferir,
      aprovar: () => {
        TX.fazer('conferir', { id: v.id, decisao: 'aprovar' });
        const d2 = TX.decidir(v.id);
        this.avisar(
          d2.resultado === 'pronta'
            ? 'Verificação aprovada. Viagem pronta para assegurar: a declaração do CT-e está liberada.'
            : 'Verificação aprovada. Ainda falta: ' + d2.falta.map((f) => f.o.toLowerCase()).join(', ') + '.',
        );
      },
      abrirDevolver: () => this.abrir('devolver'),
      mostraLimpeza: precisaLimpeza || limpezas.length > 0,
      limpezas,
      semLimpeza: !limpezas.length,
      abrirLimpeza: () => this.abrir('limpeza'),
      tempo,
      tNome,
      tTipo,
      tIni,
      tG1,
      tG2,
      tDocs,
      tHref,
      tLink,
      tAnel,
      tQual,
      tEmpresa: !!t && t.tipo === 'ETC',
      conjPlacas,
      linkRot: le.n,
      linkTom,
      linkPassos,
      linkFeitos: linkPassos.filter((x) => x.feito).length,
      msgRot: naoEnviado ? 'Enviar link' : 'Copiar mensagem',
      naoEnviado,
      abrirMensagem: () => this.abrir('mensagem'),
      linkHref: '/link?id=' + v.id,
      auditItens,
      auditOkN,
      podeConferirOp: pode('conferir'),
      podeLimpeza: pode('registrarLimpeza'),
      podeOcorrencia: pode('registrarOcorrencia'),
      podeLink: pode('enviarLink'),
      temAcoesMenu: acoesLista.some((a) => !a.off) || pode('retificar'),
      podeTrocar: !cancel && !v.cte && pode('trocarConjunto'),
      podeRegularizar: pode('regularizar'),
      ocorrencias,
      semOcorrencia: !ocorrencias.length,
      abrirOcorrencia: () => this.abrir('ocorrencia', { fTipo: 'Resíduo no compartimento', fGrav: 'leve' }),
      acoesOpen: !!s.acoesOpen,
      abrirAcoes: () => this.setState({ acoesOpen: !s.acoesOpen }),
      acoesLista,
      abrirExportar: () => this.exportar(),
    };
  }

  exportar() {
    const v = TX.viagem(this.vid()),
      F = TX.fmt,
      e = TX.ui.esc;
    const dec = TX.decidir(v),
      conj = TX.conjunto(v.conjunto),
      mot = TX.pessoa(v.motorista),
      t = TX.transportador(v.transportador);
    const linhas = [
      ['Ordem', v.ordem],
      ['Código interno', v.id],
      ['Filial', TX.filial(v.filial).nome],
      ['Embarcador', TX.embarcador(v.embarcador).nome + ', ' + TX.embarcador(v.embarcador).cidade],
      ['Destinatário', TX.destinatario(v.destinatario).nome + ', ' + TX.destinatario(v.destinatario).cidade],
      ['Produto', TX.produto(v.produto).nome + ', ' + F.peso(v.peso)],
      ['Data do carregamento', F.data(v.data) + ', ' + v.janela],
      ['Transportador', TX.nomeTransportador(t) + (t && t.rntrc ? ', RNTRC ' + t.rntrc.numero : '')],
      ['Motorista', mot.nome + ', CPF ' + F.cpfMascara(mot.cpf)],
      ['Placas', TX.placasDoConjunto(conj).join(', ')],
      ['CT-e (DACTE)', v.cte ? v.cte.numero + ', com a declaração "' + TX.DECLARACAO_CTE + '"' : 'ausente: a conciliar'],
      ['Nota fiscal', v.cte ? v.cte.nf : 'ausente: a conciliar'],
      ['Resultado', dec.rotulo],
    ];
    // Liberação e limpeza entram no registro, com data absoluta (M26, M31).
    (v.liberacoes || []).forEach((lb) =>
      linhas.push([
        'Liberação por autoridade',
        (TX.usuario(lb.assinante) || {}).nome +
          ', ' +
          F.data(lb.em.slice(0, 10)) +
          ' ' +
          F.hora(lb.em) +
          ': ' +
          lb.motivo +
          '. ' +
          (lb.justificativa || ''),
      ]),
    );
    (v.limpezas || []).forEach((lp) =>
      linhas.push([
        'Limpeza',
        'Regime ' +
          lp.regime +
          ' em ' +
          lp.comp.replace('#', ' ') +
          ', comprovante ' +
          lp.comprovante +
          (lp.em ? ', ' + F.data(lp.em.slice(0, 10)) : ''),
      ]),
    );
    let html =
      '<h1>Registro da viagem ' +
      e(v.ordem) +
      '</h1><div class="sub">' +
      e(TX.db.tenant.nome) +
      '. Itens conferidos na amostra de auditoria.</div><table>' +
      linhas.map((l) => '<tr><th style="width:190px">' + e(l[0]) + '</th><td>' + e(l[1]) + '</td></tr>').join('') +
      '</table>';
    html +=
      '<h2>Três últimas cargas por compartimento</h2><table><tr><th>Compartimento</th><th>T-1</th><th>T-2</th><th>T-3</th><th>Regime</th></tr>' +
      dec.t3
        .map(
          (c) =>
            '<tr><td class="mono">' +
            e(c.placa + ' ' + c.pos) +
            '</td>' +
            [0, 1, 2]
              .map((i) => {
                const x = c.cargas[i];
                return (
                  '<td>' +
                  (x ? e(F.data(x.data) + ', ' + (x.produto ? x.produto.nome : x.texto)) : '<span class="aus">ausente</span>') +
                  '</td>'
                );
              })
              .join('') +
            '<td>' +
            e(c.regimeExigido || '') +
            '</td></tr>',
        )
        .join('') +
      '</table>';
    html +=
      '<h2>Verificação, termo e manual</h2><table><tr><th>Verificação do compartimento</th><td>' +
      (v.verificacao && v.verificacao.estado === 'aprovada'
        ? 'aprovada em ' +
          e(F.data(v.verificacao.em.slice(0, 10)) + ' ' + F.hora(v.verificacao.em)) +
          ' por ' +
          e(TX.usuario(v.verificacao.por).nome) +
          ' (lona, correntes, cintas, carroceria, interior)'
        : '<span class="aus">ausente</span>') +
      '</td></tr><tr><th>Termo de compromisso</th><td>' +
      (v.termo
        ? 'versão ' + e(v.termo.versao) + ', assinado em ' + e(F.data(v.termo.em.slice(0, 10)))
        : dec.cobertura === 'gatekeeper'
          ? '<span class="aus">ausente</span>'
          : 'não se aplica') +
      '</td></tr><tr><th>Ciência do manual</th><td>' +
      (v.manual ? 'v' + e(v.manual.versao) + ' em ' + e(F.data(v.manual.em.slice(0, 10))) : 'não se aplica ou ausente') +
      '</td></tr></table>';
    html +=
      '<h2>Checagens</h2><table>' +
      dec.checagens
        .map(
          (c) =>
            '<tr><td>' +
            e(c.nome) +
            '</td><td>' +
            e(c.liberadaPor ? 'reprovada, liberada por autoridade' : c.estado) +
            '</td><td>' +
            e(c.detalhe) +
            '</td></tr>',
        )
        .join('') +
      '</table>';
    html +=
      '<h2>Linha do tempo</h2><table>' +
      TX.linhaDoTempo(v)
        .map(
          (x) =>
            '<tr><td class="mono" style="width:130px">' +
            e(F.data(x.em.slice(0, 10)) + ' ' + F.hora(x.em)) +
            '</td><td>' +
            e(x.texto) +
            '</td><td>' +
            e(x.quem) +
            '</td></tr>',
        )
        .join('') +
      '</table>';
    if (TX.ui.exportarDocumento('Registro ' + v.ordem, html))
      this.avisar('Registro da viagem aberto em outra aba, pronto para imprimir ou salvar em PDF.');
    else this.avisar('O navegador bloqueou a aba nova. Libere pop-ups para este endereço e tente de novo.');
  }

  // Botão apagado clicado: o foco vai para o primeiro campo que falta, se for campo de texto.
  levarAoQueFalta() {
    const f = (this.modalVals().mFaltaLista || []).find((x) => x[1]);
    const el = f && document.querySelector('[role="dialog"] [data-tx-campo="' + f[1] + '"]');
    if (el) el.focus();
  }
  modalVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      m = s.modal;
    const v = TX.viagem(this.vid());
    const dec = TX.decidir(v);
    const u = TX.sessao();
    const mot = TX.pessoa(v.motorista);
    const base = {
      mAberto: !!m,
      mK: m || '',
      fecharModal: () => this.setState({ modal: null }),
      mTitulo: '',
      mSub: '',
      mMensagem: m === 'mensagem',
      mFoto: m === 'foto',
      mDevolver: m === 'devolver',
      mLiberar: m === 'liberar',
      mRegistro: m === 'registro',
      mManter: m === 'manter',
      mRegularizar: m === 'regularizar',
      mTrocar: m === 'trocar',
      mLimpeza: m === 'limpeza',
      mOcorrencia: m === 'ocorrencia',
      mRetificar: m === 'retificar',
      mCancelar: m === 'cancelar',
      fMotivo: s.fMotivo || '',
      onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
    };
    // O botão apagado diz o que falta. falta: lista de [texto, campo para focar].
    const ctaOf = (ok, falta) => {
      const f = (falta || []).filter(Boolean);
      return {
        ctaOk: !!ok,
        mFalta: ok || !f.length ? '' : 'Falta: ' + listaFalta(f.map((x) => x[0])) + '.',
        mFaltaLista: f,
      };
    };
    const motivo = (s.fMotivo || '').trim();
    // "motivo" quando vazio; "motivo (faltam 7 caracteres)" quando começou a escrever.
    const minimo = (txt, min, nome, campo) => {
      const n = (txt || '').trim().length;
      return n >= min ? null : [n === 0 ? nome : nome + ' (faltam ' + (min - n) + (min - n === 1 ? ' caractere)' : ' caracteres)'), campo];
    };
    if (!m) return Object.assign(base, ctaOf(false));

    if (m === 'mensagem') {
      const naoEnviado = !v.link.enviadoEm;
      return Object.assign(
        base,
        {
          mTitulo: naoEnviado ? 'Enviar link ao motorista' : 'Mensagem do link',
          mSub: 'A mensagem vai do seu WhatsApp, que o motorista já conhece.',
          mensagem: TX.mensagemLink(v),
          // Abrir no WhatsApp (U36): wa.me com o telefone e a mensagem prontos.
          whatsHref: 'https://wa.me/55' + TX.soDigitos(mot.telefone || '') + '?text=' + encodeURIComponent(TX.mensagemLink(v)),
          abrirWhats: () => {
            if (naoEnviado) TX.fazer('enviarLink', { id: v.id, canal: 'whatsapp' });
            this.setState({ modal: null });
            this.avisar(naoEnviado ? 'WhatsApp aberto com a mensagem. Link marcado como enviado.' : 'WhatsApp aberto com a mensagem.');
          },
          motTel: mot.nome + ', ' + mot.telefone,
          copiarMensagem: () => {
            U.copiar(TX.mensagemLink(v));
            if (naoEnviado) TX.fazer('enviarLink', { id: v.id, canal: 'copiado' });
            this.setState({ modal: null });
            this.avisar(
              naoEnviado
                ? 'Mensagem copiada e link marcado como enviado. A mesa mostra quando o motorista abrir.'
                : 'Mensagem copiada de novo.',
            );
          },
        },
        ctaOf(true),
      );
    }
    if (m === 'foto') {
      const it = TX.ITENS_CHECKLIST.find((x) => x.k === s.fotoK) || TX.ITENS_CHECKLIST[0];
      const IC = {
        lona: 'M2 6c2-2 4-2 6 0s4 2 6 0M2 10c2-2 4-2 6 0s4 2 6 0',
        correntes: 'M3 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M9 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 8h2',
        cintas: 'M2 5h12M2 8h12M2 11h12',
        carroceria: 'M2 5h12v6H2zM5 5v6M8 5v6M11 5v6',
        interior: 'M3 12 5 4h6l2 8z',
      };
      const resp = v.checklist.itens[it.k];
      return Object.assign(
        base,
        {
          mTitulo: 'Foto: ' + it.n,
          mSub: 'Câmera do link, sem acesso à galeria. Hora e local gravados na captura.',
          fotoK: it.k,
          fotoIcon: IC[it.k],
          fotoMeta: F.quando(v.checklist.enviadoEm) + (v.checklist.gps ? ', ' + v.checklist.gps : ''),
          fotoPergunta: it.pergunta,
          fotoResp: resp === 'ok' ? 'Sim, está OK' : 'Não',
          fotoRespOk: resp === 'ok',
        },
        ctaOf(true),
      );
    }
    if (m === 'devolver') {
      const itens = s.fItens || [];
      const ok = itens.length > 0 && motivo.length >= 10;
      return Object.assign(
        base,
        {
          mTitulo: 'Devolver ao motorista',
          mSub: 'O motorista vê o motivo no link e reenvia só os itens marcados. A viagem fica em "falta algo" até lá.',
          devItens: TX.ITENS_CHECKLIST.map((it) => {
            const on = itens.includes(it.k);
            return Object.assign(
              { k: it.k, n: it.n, onClick: () => this.setState({ fItens: on ? itens.filter((x) => x !== it.k) : itens.concat(it.k) }) },
              U.chip(on),
            );
          }),
          confirmarDevolver: () => {
            if (!ok) return this.levarAoQueFalta();
            TX.fazer('conferir', { id: v.id, decisao: 'devolver', motivo, itens });
            this.setState({ modal: null });
            this.avisar('Devolvido ao motorista. Ele vê o motivo no link e reenvia as fotos.');
          },
        },
        ctaOf(ok, [!itens.length && ['marcar o que reenviar'], minimo(motivo, 10, 'motivo', 'motivo')]),
      );
    }
    if (m === 'liberar' || m === 'registro') {
      const bloqs = dec.checagens.filter(
        (c) => c.estado === 'bloqueio' && !c.tecnico && ['qualidade', 'direcao'].includes(c.alcada) && !c.liberadaPor,
      );
      if (m === 'registro') {
        const lib = (v.liberacoes || [])[0];
        if (!lib)
          return Object.assign(
            base,
            { mTitulo: 'Registro de liberação', mSub: 'Nenhuma liberação nesta viagem.', regCampos: [] },
            ctaOf(false),
          );
        const ch = dec.checagens.find((c) => c.k === lib.checagem) || {};
        return Object.assign(
          base,
          {
            mTitulo: 'Registro de liberação',
            mSub: 'Lacrado. A liberação fica na viagem junto da reprovação do motor.',
            regCampos: [
              ['Regra liberada', ch.nome || lib.checagem],
              ['Motivo', lib.motivo],
              ['Justificativa', lib.justificativa],
              [
                'Assinado por',
                (TX.usuario(lib.assinante) || {}).nome + ', ' + ((TX.db.alcadas.find((a) => a.k === lib.alcada) || {}).n || ''),
              ],
              ['Risco residual', lib.risco],
              ['Validade', lib.validade],
              ['Evidência', lib.evidencia],
              ['Escopo', lib.escopo],
              ['Ciência', 'O motor continua reprovando a regra'],
              ['Assinado em', F.quando(lib.em)],
            ].map((x) => ({ l: x[0], v: x[1] })),
          },
          ctaOf(true),
        );
      }
      const alvo = bloqs[0] || {};
      const MOTIVOS =
        alvo.k === 'ocorrencia'
          ? ['Ação corretiva concluída, revisão formal pendente', 'Transportador emergencial sem alternativa no prazo do carregamento']
          : [
              'Renovação em andamento com protocolo do órgão',
              'Documento renovado, aguardando a versão digital',
              'Divergência cadastral já corrigida no órgão',
            ];
      const nivel = { qualidade: 1, direcao: 2 };
      const podeAssinar = u.alcada && nivel[u.alcada] >= nivel[alvo.alcada];
      const precisa = alvo.alcada === 'direcao' ? 'Direção e RT' : 'Gestor da qualidade';
      const just = (s.fJust || '').trim();
      const campos = [
        !!alvo.k,
        !!s.fMot,
        just.length >= 20,
        !!podeAssinar,
        !!s.fRisco,
        !!s.fValidade,
        !!s.fEvid,
        !!s.fEscopo,
        !!s.fCiencia,
      ];
      const n = campos.filter(Boolean).length;
      const ok = n === 9;
      const nomesLib = [
        'regra',
        'motivo',
        'justificativa',
        'alçada que assina',
        'risco residual',
        'validade',
        'evidência',
        'escopo',
        'ciência',
      ];
      const faltaLib = campos.map((c, i) =>
        c ? null : i === 2 ? minimo(just, 20, 'justificativa', 'justificativa') : [nomesLib[i], null],
      );
      return Object.assign(
        base,
        {
          mTitulo: 'Liberar por autoridade',
          mSub: 'Não existe liberação sem registro. Os 9 campos são obrigatórios; o bloqueio técnico não aparece aqui porque não tem liberação.',
          libN: n,
          libPct: Math.round((n / 9) * 100) + '%',
          libRegra: alvo.nome || '',
          libRegraDet: alvo.detalhe || '',
          libMotivos: MOTIVOS.map((x) => {
            const sx = U.sel(s.fMot === x);
            return Object.assign({ n: x, onClick: () => this.setState({ fMot: x }) }, sx);
          }),
          fJust: s.fJust || '',
          onJust: (e) => this.setState({ fJust: e.target.value }),
          libAssOk: !!podeAssinar,
          libAssTxt: podeAssinar ? 'Sua alçada assina esta regra.' : 'Sua alçada não assina esta regra: precisa de ' + precisa + '.',
          libTrocar: !podeAssinar,
          // Sem alçada: pedir a quem assina, não "Entrar como" (M18).
          libPedidoFeito: !!(TX.liberacaoDe(v) || {}).pedido,
          libPedirRot: 'Pedir a ' + precisa,
          libPedir: () => {
            const lv = TX.liberacaoDe(v);
            if (!lv) return;
            this.setState({ modal: null });
            TX.ui.pedirLiberacao(this, v, lv);
          },
          libRiscos: ['Baixo', 'Médio'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fRisco: x }) }, U.chip(s.fRisco === x)),
          ),
          libValidades: ['Somente esta viagem'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fValidade: x }) }, U.chip(s.fValidade === x)),
          ),
          evidErro: s.evidErro,
          onEvidencia: (e) => {
            const f = e.target.files && e.target.files[0];
            const erro = TX.ui.conferirArquivo(f, ['.pdf', '.jpg', '.jpeg', '.png', '.heic'], 'documento nem foto');
            e.target.value = '';
            this.setState({ evidErro: erro });
            if (f && !erro) this.setState({ fEvid: f.name });
          },
          evidenciaExemplo: () =>
            this.setState({ fEvid: alvo.k === 'ocorrencia' ? 'relatorio-acao-corretiva.pdf' : 'protocolo-renovacao.pdf' }),
          fEvidTxt: s.fEvid || 'nenhum arquivo',
          toggleEscopo: () => this.setState({ fEscopo: !s.fEscopo }),
          toggleCiencia: () => this.setState({ fCiencia: !s.fCiencia }),
          fEscopo: !!s.fEscopo,
          fCiencia: !!s.fCiencia,
          confirmarLiberar: () => {
            if (!ok) return this.levarAoQueFalta();
            TX.fazer('liberar', {
              id: v.id,
              registro: {
                checagem: alvo.k,
                motivo: s.fMot,
                justificativa: just,
                alcada: alvo.alcada,
                alcadaNome: precisa,
                risco: s.fRisco,
                validade: s.fValidade,
                evidencia: s.fEvid,
                escopo: 'Vale só para ' + v.ordem + '. Não cria precedente.',
                ciencia: true,
              },
            });
            this.setState({ modal: null });
            const d2 = TX.decidir(v.id);
            this.avisar(
              d2.resultado === 'pronta'
                ? 'Liberação assinada. A viagem fica liberada por autoridade e pronta para assegurar; o motor continua reprovando a regra.'
                : 'Liberação assinada. Ainda falta: ' + d2.falta.map((f) => f.o.toLowerCase()).join(', ') + '.',
            );
          },
        },
        ctaOf(ok, faltaLib),
      );
    }
    if (m === 'manter') {
      const ok = motivo.length >= 15 && !!s.fAcao;
      const falta = [minimo(motivo, 15, 'motivo', 'motivo'), !s.fAcao && ['ação indicada']];
      return Object.assign(
        base,
        {
          mTitulo: 'Manter o bloqueio',
          mSub: 'Manter também é decisão registrada: fica na linha do tempo com seu nome, o motivo e a ação indicada.',
          manterAcoes: ['Trocar o conjunto', 'Aguardar documento', 'Cancelar a viagem', 'Outra'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fAcao: x }) }, U.chip(s.fAcao === x)),
          ),
          confirmarManter: () => {
            if (!ok) return this.levarAoQueFalta();
            const bl = dec.falta.find((f) => f.estado === 'bloqueio') || {};
            TX.fazer('manterBloqueio', { id: v.id, checagem: bl.k, motivo, acao: s.fAcao });
            this.setState({ modal: null });
            this.avisar('Bloqueio mantido e registrado na linha do tempo.');
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'regularizar') {
      const comp = dec.t3.find((c) => c.proibida) || dec.t3[0];
      const hist = TX.historico(comp.placa, comp.pos);
      const naoRacao = hist.filter((h) => h.data > comp.proibida.data && h.produto && !TX.produto(h.produto).racao).length;
      const opA = s.fOpcao === 'A';
      const ok = opA && (s.fInspetor || '').trim().length >= 5 && (s.fLaudo || '').trim().length >= 4;
      const falta = opA
        ? [minimo(s.fInspetor, 5, 'inspetor', 'inspetor'), minimo(s.fLaudo, 4, 'número do laudo', 'laudo')]
        : [['escolher a inspeção oficial (opção A)']];
      return Object.assign(
        base,
        {
          mTitulo: 'Regularizar conforme a TS1.9',
          mSub: 'Carga proibida não se aprova. O compartimento volta a carregar ração depois de um dos caminhos abaixo, registrado passo a passo.',
          regOpcoes: [
            Object.assign(
              {
                n: 'Opção A: inspetor independente',
                sub: 'Limpeza completa e inspeção por inspetor independente, com laudo.',
                status: 'disponível',
                statusOk: true,
                onClick: () => this.setState({ fOpcao: 'A' }),
              },
              U.sel(opA),
            ),
            Object.assign(
              {
                n: 'Opção B: cinco cargas não ração',
                sub: 'Cinco transportes de carga não ração após a proibida e liberação pelo inspetor do carregador.',
                status: naoRacao + ' de 5 cargas não ração desde ' + F.curta(comp.proibida.data) + '; fora do piloto',
                statusOk: false,
                // Fora do MVP (revisão 11, seção 2): a opção B não se registra aqui.
                onClick: () =>
                  this.avisar('A opção B não se registra no piloto. Use a opção A com inspetor independente ou troque o conjunto.'),
              },
              U.sel(false, false),
            ),
          ],
          regA: opA,
          regComp: comp.placa + ' ' + comp.pos,
          fInspetor: s.fInspetor || '',
          onInspetor: (e) => this.setState({ fInspetor: e.target.value }),
          fLaudo: s.fLaudo || '',
          onLaudo: (e) => this.setState({ fLaudo: e.target.value }),
          confirmarRegularizar: () => {
            if (!ok) return this.levarAoQueFalta();
            TX.fazer('regularizar', {
              id: v.id,
              comp: comp.key,
              opcao: 'A',
              inspetor: s.fInspetor.trim(),
              entidade: 'Inspeção independente',
              laudo: s.fLaudo.trim(),
            });
            this.setState({ modal: null });
            const d2 = TX.decidir(v.id);
            this.avisar(
              'Regularização registrada. ' +
                (d2.resultado === 'pronta' ? 'Viagem pronta para assegurar.' : 'Resultado agora: ' + d2.rotulo.toLowerCase() + '.'),
            );
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'trocar') {
      const q = TX.norm(s.fBuscaPlaca || '');
      const hojeV = TX.db.viagens.filter((x) => x.data === v.data && !x.cancelada && x.id !== v.id);
      const ref = v.data < TX.HOJE ? v.data : TX.HOJE;
      // Situação dos documentos do conjunto (M20): pior CRLV das placas e, de terceiro, a qualificação.
      const docsDe = (c) => {
        const ruins = TX.placasDoConjunto(c).map((pl) => [pl, TX.docEstado((TX.placa(pl).crlv || {}).validade, ref)]);
        const venc = ruins.find((x) => x[1].estado === 'vencido' || x[1].estado === 'falta');
        if (venc) return { tom: 'perigo', txt: 'CRLV ' + venc[0] + ' ' + venc[1].rotulo };
        const tr = c.dono !== 'propria' ? TX.transportador(c.dono) : null;
        const q = tr ? TX.qualificacao(tr) : null;
        if (q && q.k !== 'apto') return { tom: q.k === 'restricao' ? 'aviso' : 'perigo', txt: q.n };
        const vence = ruins.find((x) => x[1].estado === 'vence');
        if (vence) return { tom: 'aviso', txt: 'CRLV ' + vence[0] + ' ' + vence[1].rotulo };
        return { tom: 'ok', txt: 'documentos em dia' };
      };
      const ops = TX.db.conjuntos
        .filter((c) => c.id !== v.conjunto && (c.dono !== 'propria' || (c.escopo && c.escopo.no)))
        .filter((c) => !q || TX.norm(TX.placasDoConjunto(c).join(' ') + ' ' + TX.nomeTransportador(c.dono)).includes(q))
        .slice(0, 8);
      const ocupaEm = (cid) => hojeV.find((x) => x.conjunto === cid);
      const escolhidoOcupado = s.fConj ? ocupaEm(s.fConj) : null;
      const ok = !!s.fConj && motivo.length >= 5 && (!escolhidoOcupado || !!s.fConfOcupado);
      const falta = [
        !s.fConj && ['novo conjunto'],
        escolhidoOcupado && !s.fConfOcupado && ['confirmar o conjunto que já carrega hoje'],
        minimo(motivo, 5, 'motivo', 'motivo'),
      ];
      return Object.assign(
        base,
        {
          mTitulo: 'Trocar o conjunto',
          mSub: 'O T-3, o checklist e o termo voltam a ser pedidos para o conjunto novo. A troca entra na linha do tempo.',
          fBuscaPlaca: s.fBuscaPlaca || '',
          onBuscaPlaca: (e) => this.setState({ fBuscaPlaca: e.target.value }),
          trocaOpcoes: ops.map((c) => {
            const sx = U.sel(s.fConj === c.id);
            const oc = ocupaEm(c.id);
            return Object.assign(
              {
                id: c.id,
                placas: TX.placasDoConjunto(c),
                dono: TX.nomeTransportador(c.dono === 'propria' ? null : c.dono) + (c.dono === 'propria' ? ', no escopo GMP+' : ''),
                aviso: oc ? 'já carrega hoje às ' + oc.janela + ' (' + oc.ordem + ')' : '',
                docs: docsDe(c),
                onClick: () => this.setState({ fConj: c.id, fConfOcupado: false }),
              },
              sx,
            );
          }),
          trocaOcupado: escolhidoOcupado
            ? 'O conjunto escolhido já carrega hoje às ' +
              escolhidoOcupado.janela +
              ' (' +
              escolhidoOcupado.ordem +
              '). Confirmo a troca mesmo assim.'
            : '',
          fConfOcupado: !!s.fConfOcupado,
          toggleConfOcupado: () => this.setState({ fConfOcupado: !s.fConfOcupado }),
          confirmarTrocar: () => {
            if (!ok) return this.levarAoQueFalta();
            TX.fazer('trocarConjunto', { id: v.id, conjunto: s.fConj, motivo });
            this.setState({ modal: null });
            this.avisar('Conjunto trocado. Mande o link de novo para o motorista informar as cargas e as fotos.');
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'limpeza') {
      // Vários compartimentos de uma vez, com data, comprovante anexado e lavador com documento em dia (M19).
      const comps = dec.t3.filter((c) => c.regimeExigido && !['A', 'X', '?'].includes(c.regimeExigido));
      const lista = comps.length ? comps : dec.t3;
      const marcados = s.fComps ? lista.filter((c) => s.fComps.includes(c.key)) : lista;
      const ordem = (r) => (TX.REGIMES[r] || TX.REGIMES.A).ordem;
      const exig = marcados.reduce((m2, c) => {
        const r = ['A', 'B', 'C', 'D'].includes(c.regimeExigido) ? c.regimeExigido : 'A';
        return ordem(r) > ordem(m2) ? r : m2;
      }, 'A');
      const dataIso = U.dataIso(s.fDataLav || '');
      const dataFutura = dataIso && dataIso > TX.HOJE;
      const ok =
        marcados.length > 0 && !!s.fLavador && !!dataIso && !dataFutura && !!s.fArqLimp && (s.fComprovante || '').trim().length >= 4;
      const falta = [
        !marcados.length && ['compartimento'],
        !s.fLavador && ['lavador'],
        !dataIso ? ['data da lavagem', 'data-lavagem'] : dataFutura ? ['data da lavagem não pode ser futura', 'data-lavagem'] : null,
        minimo(s.fComprovante, 4, 'número do comprovante', 'comprovante'),
        !s.fArqLimp && ['comprovante anexado'],
      ];
      return Object.assign(
        base,
        {
          mTitulo: 'Registrar limpeza',
          mSub:
            'Regime exigido: ' +
            exig +
            ' (' +
            TX.REGIMES[exig].n.toLowerCase() +
            '). O credenciamento do lavador limita o regime que ele pode fazer.',
          limpComps: lista.map((c) => {
            const on = marcados.some((x) => x.key === c.key);
            const atual = marcados.map((x) => x.key);
            return {
              k: c.key,
              n: c.placa + ' ' + c.pos,
              pressed: on,
              onClick: () => this.setState({ fComps: on ? atual.filter((x) => x !== c.key) : atual.concat(c.key), fLavador: null }),
            };
          }),
          limpLavadores: TX.db.fornecedores
            .filter((f) => f.servico === 'lavagem')
            .map((f) => {
              const regOk = TX.REGIMES[f.regimeMax].ordem >= TX.REGIMES[exig].ordem;
              const docRuim = (f.docs || [])
                .map((d) => [d.n, TX.docEstado(d.validade)])
                .find((x) => x[1].estado === 'vencido' || x[1].estado === 'falta');
              const pode = regOk && !docRuim;
              const sx = U.sel(s.fLavador === f.id, pode);
              return Object.assign(
                {
                  n: f.nome,
                  sub:
                    f.cidade +
                    ', credenciado até regime ' +
                    f.regimeMax +
                    (!regOk ? ': não faz regime ' + exig : docRuim ? ': ' + docRuim[0].toLowerCase() + ' ' + docRuim[1].rotulo : ''),
                  onClick: () => {
                    if (pode) this.setState({ fLavador: f.id });
                  },
                },
                sx,
              );
            }),
          fDataLav: s.fDataLav || '',
          aoDataLav: (t) => this.setState({ fDataLav: t }),
          erroDataLav: dataFutura ? 'A lavagem não pode ser depois de hoje.' : U.avisoData(s.fDataLav || ''),
          fComprovante: s.fComprovante || '',
          onComprovante: (e) => this.setState({ fComprovante: e.target.value }),
          fArqLimp: s.fArqLimp || '',
          arqLimpErro: s.arqLimpErro || '',
          onArqLimp: (e) => {
            const f = e.target.files && e.target.files[0];
            const erro = TX.ui.conferirArquivo(f, ['.pdf', '.jpg', '.jpeg', '.png', '.heic'], 'documento nem foto');
            e.target.value = '';
            this.setState({ arqLimpErro: erro });
            if (f && !erro) this.setState({ fArqLimp: f.name });
          },
          arqLimpExemplo: () => this.setState({ fArqLimp: 'comprovante-lavagem.pdf', arqLimpErro: '' }),
          confirmarLimpeza: () => {
            if (!ok) return this.levarAoQueFalta();
            marcados.forEach((c) =>
              TX.fazer('registrarLimpeza', {
                id: v.id,
                comp: c.key,
                regime: exig,
                lavador: s.fLavador,
                comprovante: s.fComprovante.trim(),
                data: dataIso,
                arquivo: s.fArqLimp,
              }),
            );
            this.setState({ modal: null });
            this.avisar(
              marcados.length === 1
                ? 'Limpeza registrada no compartimento e na viagem.'
                : 'Limpeza registrada nos ' + marcados.length + ' compartimentos e na viagem.',
            );
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'ocorrencia') {
      const ok = !!s.fTipo && !!s.fGrav && motivo.length >= 15;
      const falta = [!s.fTipo && ['tipo'], !s.fGrav && ['gravidade'], minimo(motivo, 15, 'o que aconteceu', 'motivo')];
      return Object.assign(
        base,
        {
          mTitulo: 'Registrar ocorrência',
          mSub: 'Fica na viagem e conta na linha do transportador. O tratamento de causa segue no sistema de gestão da empresa; o Traxium exporta.',
          ocTipos: ['Resíduo no compartimento', 'Lona danificada', 'Carga anterior divergente', 'Reclamação no destino', 'Outra'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fTipo: x }) }, U.chip(s.fTipo === x)),
          ),
          ocGravs: [
            ['leve', 'Leve', 'Registra e conta no histórico do transportador.'],
            ['grave', 'Grave', 'Suspende o transportador para viagens asseguradas até a revisão da Direção.'],
          ].map((x) => Object.assign({ n: x[1], sub: x[2], onClick: () => this.setState({ fGrav: x[0] }) }, U.sel(s.fGrav === x[0]))),
          confirmarOcorrencia: () => {
            if (!ok) return this.levarAoQueFalta();
            const id = TX.fazer('registrarOcorrencia', { viagem: v.id, tipo: s.fTipo, gravidade: s.fGrav, descricao: motivo, fotos: 0 });
            this.setState({ modal: null });
            this.avisar(
              'Ocorrência ' +
                id +
                ' registrada' +
                (s.fGrav === 'grave' ? '. Transportador suspenso para viagens asseguradas até a revisão.' : '.'),
            );
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'retificar') {
      const campo = s.fCampo || 'peso';
      const atual = { peso: F.peso(v.peso), janela: v.janela, ordem: v.ordem }[campo];
      const novo = (s.fNovo || '').trim();
      // Janela em HH:MM, como na Nova viagem (M21): texto livre quebrava a contagem da mesa.
      const horaOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(novo);
      const valido = campo === 'peso' ? /^\d+([.,]\d+)?$/.test(novo) : campo === 'janela' ? horaOk : true;
      const ok = novo.length > 0 && motivo.length >= 10 && valido;
      const falta = [
        !novo
          ? ['valor novo', 'novo']
          : !valido
            ? [campo === 'peso' ? 'peso só com números, como 37,5' : 'horário no formato 17:30', 'novo']
            : null,
        minimo(motivo, 10, 'motivo', 'motivo'),
      ];
      return Object.assign(
        base,
        {
          mTitulo: 'Retificar um fato',
          mSub: 'O valor original continua no registro; a correção entra como evento novo, com motivo e autor.',
          retCampos: [
            ['peso', 'Peso'],
            ['janela', 'Janela de carregamento'],
            ['ordem', 'Número da ordem'],
          ].map((x) => Object.assign({ n: x[1], onClick: () => this.setState({ fCampo: x[0], fNovo: '' }) }, U.chip(campo === x[0]))),
          retAtual: atual,
          fNovo: s.fNovo || '',
          retJanela: campo === 'janela',
          erroNovo: novo && !valido ? (campo === 'peso' ? 'Use só números, como 37,5.' : 'Horário inválido. Use HH:MM, como 17:30.') : '',
          onNovo: (e) => {
            let t = e.target.value;
            if (campo === 'janela') {
              const d = TX.soDigitos(t).slice(0, 4);
              t = d.length > 2 ? d.slice(0, 2) + ':' + d.slice(2) : d;
            }
            this.setState({ fNovo: t });
          },
          confirmarRetificar: () => {
            if (!ok) return this.levarAoQueFalta();
            const para = campo === 'peso' ? novo.replace(',', '.') : novo;
            TX.fazer('retificar', {
              id: v.id,
              campo,
              de: v[campo],
              para,
              deTxt: atual,
              paraTxt: campo === 'peso' ? F.peso(para) : para,
              motivo,
            });
            this.setState({ modal: null });
            this.avisar('Retificação registrada. O valor anterior continua na linha do tempo.');
          },
        },
        ctaOf(ok, falta),
      );
    }
    if (m === 'cancelar') {
      const ok = motivo.length >= 15;
      const falta = [minimo(motivo, 15, 'motivo', 'motivo')];
      return Object.assign(
        base,
        {
          mTitulo: 'Cancelar a viagem',
          mSub: 'A viagem não some: fica registrada como cancelada, com motivo, autor e hora.',
          confirmarCancelar: () => {
            if (!ok) return this.levarAoQueFalta();
            TX.fazer('cancelarViagem', { id: v.id, motivo });
            this.setState({ modal: null });
            this.avisar('Viagem cancelada. O registro continua em Viagens, com o motivo.');
          },
        },
        ctaOf(ok, falta),
      );
    }
    return Object.assign(base, ctaOf(false));
  }

  // Menu Ações: setas movem entre os itens; o primeiro recebe o foco ao abrir.
  teclaMenu(e) {
    const itens = Array.from(e.currentTarget.querySelectorAll('[role="menuitem"]'));
    const i = itens.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = itens.length;
      const prox = e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n;
      if (itens[prox]) itens[prox].focus();
    }
  }
  componentDidUpdate(_, antes) {
    if (this.state.acoesOpen && !antes.acoesOpen) {
      const el = document.querySelector('[data-tx-menu-acoes] [role="menuitem"]');
      if (el) el.focus();
    }
  }

  render() {
    const v = this.renderVals();
    const TAM_MODAL = { foto: 'g', registro: 'g', regularizar: 'g' };
    const icoDecisao = {
      ok: 'M3.5 8.4 6.6 11.4 12.5 5',
      autoridade: 'M3.5 8.4 6.6 11.4 12.5 5',
      falta: 'M8 4v5M8 11.6v.1',
      bloqueio: 'M4.8 4.8l6.4 6.4M11.2 4.8l-6.4 6.4',
      tecnico: 'M4.8 4.8l6.4 6.4M11.2 4.8l-6.4 6.4',
      na: 'M4.5 8h7',
      info: 'M8 7v4.5M8 4.6v.1',
    }[v.resTom];
    const heroK = v.heroPronta ? 'pronta' : v.heroFalta ? 'falta' : v.heroBloq ? 'bloqueada' : v.heroTec ? 'tecnico' : undefined;
    const olho = v.heroTec
      ? 'Bloqueio técnico: ninguém aprova'
      : v.resK === 'cancelada'
        ? 'Viagem encerrada'
        : v.heroNeutro
          ? 'Fora do afretamento GMP+'
          : 'Decisão do motor';
    // Ação primária do momento, repetida na barra fixa ao rolar (sem os data-tx, que ficam no bloco da decisão).
    const g0 = v.faltaGrupos[0];
    const prim =
      v.heroFalta && v.faltaPrim
        ? { rot: (v.faltaGrupos.find((g) => g.acao) || {}).acao, onClick: (v.faltaGrupos.find((g) => g.acao) || {}).onClick }
        : v.heroBloq && v.podeLiberar
          ? { rot: 'Liberar por autoridade', onClick: v.abrirLiberar }
          : v.heroBloq && v.podePedir
            ? { rot: 'Pedir liberação', onClick: v.pedirLib }
            : v.heroTec && v.podeTrocar
              ? { rot: 'Trocar o conjunto', onClick: v.abrirTrocar }
              : v.heroPronta
                ? { rot: 'Copiar declaração', onClick: v.copiarDeclaracao }
                : null;
    const placa = (pl) => <Placa key={pl} placa={pl} tamanho="p" />;
    // Selo do regime: o compartilhado para A a D e X; "?" (não definido) fica local.
    const selo = (k, nome, letra) =>
      k === 'nd' ? (
        <span className="tx-viagem-regime tx-viagem-regime--nd" title={nome}>
          {letra}
        </span>
      ) : (
        <SeloRegime regime={k} />
      );

    return (
      <div className="tx-viagem" data-screen-label="Viagem" data-tela="Viagem">
        <div className="tx-viagem-sentinela" ref={(el) => (this._sentinela = el)} aria-hidden />
        {v.pronto && this.state.compacto ? (
          <div className="tx-viagem-fixa">
            <div className="tx-viagem-fixa__barra">
              <span className="tx-mono tx-peso-700">{v.vOrdem}</span>
              <span className="tx-viagem-fixa__titulo">{v.vTitulo}</span>
              <Situacao tom={v.resTom}>{v.resRotulo}</Situacao>
              {prim ? (
                <Botao variante="primario" tamanho="p" onClick={prim.onClick} className="tx-viagem-fixa__acao">
                  {prim.rot}
                </Botao>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="tx-pagina">
          <header className="tx-viagem-cab">
            <div className="tx-viagem-cab__topo">
              <Trilha passos={[{ rotulo: 'Viagens', href: '/viagens' }, { rotulo: <span className="tx-mono">{v.vOrdem}</span> }]} />
              <div className="tx-pagina-cab__acoes">
                <Botao
                  variante="contorno"
                  onClick={v.abrirExportar}
                  title="Abre o registro da viagem pronto para imprimir ou salvar em PDF"
                  icone={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M7 2v7M4 6.5 7 9.5l3-3M2.5 11.5h9" />
                    </svg>
                  }
                >
                  Exportar registro
                </Botao>
                {v.temAcoesMenu ? (
                  <div data-tx-pop="" className="tx-viagem-menu">
                    <Botao
                      variante="secundario"
                      onClick={v.abrirAcoes}
                      data-tx-acoes=""
                      aria-haspopup="menu"
                      aria-expanded={v.acoesOpen}
                      aria-controls="viagem-menu-acoes"
                    >
                      Ações
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="tx-viagem-menu__seta"
                      >
                        <path d="M3 4.5 6 7.5l3-3" />
                      </svg>
                    </Botao>
                    {v.acoesOpen ? (
                      <div
                        id="viagem-menu-acoes"
                        role="menu"
                        aria-label="Ações da viagem"
                        className="tx-viagem-menu__lista"
                        data-tx-menu-acoes=""
                        onKeyDown={(e) => this.teclaMenu(e)}
                      >
                        {v.acoesLista.map((ac, i) => (
                          <Fragment key={ac.n}>
                            {ac.perigo && i > 0 ? <div role="separator" className="tx-viagem-menu__sep" /> : null}
                            <button
                              type="button"
                              role="menuitem"
                              onClick={ac.onClick}
                              aria-disabled={ac.off || undefined}
                              className={'tx-viagem-menu__item' + (ac.perigo ? ' tx-viagem-menu__item--perigo' : '')}
                            >
                              <span className="tx-viagem-menu__nome">{ac.n}</span>
                              <span className="tx-viagem-menu__sub">{ac.sub}</span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="tx-viagem-cab__linha">
              <h1 className="tx-pagina-cab__titulo">{v.vTitulo}</h1>
              {v.pronto ? (
                <>
                  <Situacao tom={v.resTom} data-tx-resultado={v.resK}>
                    {v.resRotulo}
                  </Situacao>
                  {v.cicloTxt ? <span className="tx-tipo-denso tx-sec">{v.cicloTxt}</span> : null}
                </>
              ) : null}
            </div>
            <p className="tx-viagem-cab__rota">
              <b>{v.embNome}</b>, {v.embCidade}
              <span aria-label=" para " className="tx-viagem-cab__seta">
                →
              </span>
              <b>{v.destNome}</b>, {v.destCidade}
            </p>
            {v.pronto ? (
              <>
                <dl className="tx-viagem-fatos">
                  {v.ids.map((id) => (
                    <div key={id.l} className="tx-viagem-fatos__item">
                      <dt className="tx-tipo-rotulo">{id.l}</dt>
                      <dd className={(id.mono ? 'tx-mono ' : '') + (id.apagado ? 'tx-viagem-fatos__apagado' : id.sec ? 'tx-sec' : '')}>
                        {id.v}
                      </dd>
                    </div>
                  ))}
                  <div className="tx-viagem-fatos__item">
                    <dt className="tx-tipo-rotulo">Placas</dt>
                    <dd className="tx-viagem-fatos__placas">{v.placas.map(placa)}</dd>
                  </div>
                </dl>
                <ol className="tx-viagem-passos" aria-label="Andamento da viagem">
                  {v.passos.map((ps) => (
                    <li
                      key={ps.n}
                      className={'tx-viagem-passos__item tx-viagem-passos__item--' + ps.st}
                      aria-current={ps.st === 'atual' ? 'step' : undefined}
                    >
                      <span className="tx-viagem-passos__marca" aria-hidden>
                        {ps.icon}
                      </span>
                      <span className="tx-viagem-passos__texto">
                        <span className="tx-viagem-passos__nome">{ps.n}</span>
                        <span className="tx-viagem-passos__sub">{ps.sub}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </header>

          {v.loading ? (
            <div className="tx-viagem-carregando" role="status" aria-label="Carregando a viagem">
              <span className="tx-esqueleto" style={{ height: '160px' }} />
              <span className="tx-esqueleto" style={{ width: '70%' }} />
              <span className="tx-esqueleto" style={{ height: '220px' }} />
            </div>
          ) : null}

          {v.pronto ? (
            <>
              {/* ---------------------------------------------------------------- decisão */}
              <section
                className={'tx-viagem-decisao tx-viagem-decisao--' + v.resTom}
                aria-labelledby="viagem-decisao-titulo"
                data-tx-hero={heroK}
              >
                <div className="tx-viagem-decisao__cab">
                  <span className="tx-viagem-decisao__icone" aria-hidden>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={icoDecisao} />
                    </svg>
                  </span>
                  <div className="tx-viagem-decisao__titulos">
                    <div className="tx-tipo-rotulo tx-viagem-decisao__olho">{olho}</div>
                    <h2 id="viagem-decisao-titulo" className="tx-viagem-decisao__titulo">
                      {v.heroFalta ? v.faltaTitulo : v.heroTitulo}
                    </h2>
                    {v.heroSub ? <p className="tx-viagem-decisao__sub">{v.heroSub}</p> : null}
                  </div>
                  <div className="tx-viagem-decisao__acoes">
                    {v.heroFalta && v.faltaGrupos.length === 1 && g0.acao ? (
                      <Botao variante="primario" onClick={g0.onClick} data-tx-falta-acao={g0.k}>
                        {g0.acao}
                      </Botao>
                    ) : null}
                    {v.heroBloq && v.podeManter ? (
                      <Botao onClick={v.abrirManter} data-tx-manter="">
                        Manter bloqueio
                      </Botao>
                    ) : null}
                    {v.heroBloq && v.podePedir ? (
                      <Botao variante="primario" onClick={v.pedirLib} data-tx-pedir-liberacao="">
                        Pedir liberação
                      </Botao>
                    ) : null}
                    {v.heroBloq && v.podeLiberar ? (
                      <Botao variante="primario" onClick={v.abrirLiberar} data-tx-liberar="">
                        Liberar por autoridade
                      </Botao>
                    ) : null}
                    {v.heroTec && v.podeRegularizar ? (
                      <Botao variante="contorno" onClick={v.abrirRegularizar} data-tx-regularizar="">
                        {v.tecAcao2}
                      </Botao>
                    ) : null}
                    {v.heroTec && v.podeTrocar ? (
                      <Botao variante="primario" onClick={v.abrirTrocar} data-tx-trocar="">
                        Trocar o conjunto
                      </Botao>
                    ) : null}
                  </div>
                </div>

                {v.heroPronta ? (
                  <div className="tx-viagem-decisao__corpo">
                    <div className="tx-viagem-declaracao">
                      <div className="tx-tipo-rotulo">Declaração para o CT-e</div>
                      <p className="tx-viagem-declaracao__texto" data-tx-declaracao="">
                        {v.declaracao}
                      </p>
                      <div className="tx-viagem-declaracao__rodape">
                        <Botao variante="primario" onClick={v.copiarDeclaracao} data-tx-copiar-declaracao="">
                          Copiar texto
                        </Botao>
                        <span className="tx-tipo-legenda tx-sec">CT-e emitido no TMS. O número chega pela conciliação em lote.</span>
                      </div>
                    </div>
                    {v.temAutoridade ? (
                      <Aviso
                        tom="info"
                        acao={
                          <Botao tamanho="p" onClick={v.verRegistro}>
                            Ver o registro
                          </Botao>
                        }
                      >
                        {v.autoridadeTxt}
                      </Aviso>
                    ) : null}
                  </div>
                ) : null}

                {v.heroFalta ? (
                  <div className="tx-viagem-grupos">
                    {v.faltaGrupos.map((g, gi) => (
                      <div key={g.quem} className="tx-viagem-grupo">
                        {v.faltaGrupos.length > 1 ? (
                          <div className="tx-viagem-grupo__cab">
                            <span className="tx-tipo-rotulo">{g.quem}</span>
                            {g.acao ? (
                              <Botao
                                variante={gi === 0 ? 'primario' : 'secundario'}
                                tamanho="p"
                                onClick={g.onClick}
                                data-tx-falta-acao={g.k}
                              >
                                {g.acao}
                              </Botao>
                            ) : null}
                          </div>
                        ) : null}
                        <ul className="tx-viagem-pendencias" aria-label={'Com ' + g.quem}>
                          {g.itens.map((fl) => (
                            <li key={fl.k} className="tx-viagem-pendencias__item">
                              <span className="tx-viagem-pendencias__marca" aria-hidden />
                              <span>
                                <span className="tx-viagem-pendencias__nome">{fl.o}</span>
                                <span className="tx-viagem-pendencias__det">{fl.detalhe}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}

                {v.heroBloq ? (
                  <div className="tx-viagem-decisao__corpo">
                    {v.bloqResolver ? <p className="tx-viagem-decisao__como">{v.bloqResolver}</p> : null}
                    {v.semLiberacao ? <p className="tx-tipo-legenda tx-sec">{v.semLiberacaoTxt}</p> : null}
                    {v.podePedir ? (
                      <Campo
                        id="viagem-nota-pedido"
                        rotulo="Nota para quem assina"
                        opcional
                        dica="Ex.: CRLV renovado, protocolo Detran 2026/883311. A nota abre preenchida na liberação."
                      >
                        <Entrada value={v.fNotaPedido} onChange={v.onNotaPedido} maxLength={160} />
                      </Campo>
                    ) : null}
                    {v.temPedido || v.docHref || v.bloqTemHref ? (
                      <div className="tx-viagem-decisao__linha">
                        {v.temPedido ? (
                          <Badge tom="autoridade" data-tx-pedido-lib="">
                            {v.pedidoTxt}
                          </Badge>
                        ) : null}
                        {v.docHref ? (
                          <Botao variante="texto" href={v.docHref}>
                            {v.docRot}
                          </Botao>
                        ) : null}
                        {v.bloqTemHref ? (
                          <Botao variante="texto" href={v.bloqHref}>
                            Resolver em Cadastros
                          </Botao>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {v.heroTec ? (
                  <dl className="tx-viagem-caminhos">
                    <div>
                      <dt>Trocar o conjunto</dt>
                      <dd>Outro TAC ou outra carreta. T-3 e checklist voltam a ser pedidos.</dd>
                    </div>
                    <div>
                      <dt>{v.tecAcao2}</dt>
                      <dd>{v.tecAcao2Sub}</dd>
                    </div>
                  </dl>
                ) : null}

                <div className="tx-viagem-decisao__rodape">
                  <span className="tx-tipo-denso tx-sec num">
                    {v.okN} de {v.totalN} checagens passaram
                  </span>
                  <Botao
                    variante="texto"
                    onClick={v.chToggle}
                    data-tx-ver-checagens=""
                    aria-expanded={v.chAberto}
                    aria-controls="viagem-checagens"
                  >
                    {v.chAberto ? 'Recolher as checagens' : 'Ver as ' + v.totalN + ' checagens'}
                  </Botao>
                </div>
                {v.chAberto ? (
                  <ul id="viagem-checagens" className="tx-viagem-checagens">
                    {v.checagens.map((ck) => (
                      <li
                        key={ck.k}
                        data-tx-checagem={ck.k}
                        data-tx-estado={ck.estado}
                        className={'tx-viagem-checagens__item' + (ck.na ? ' tx-viagem-checagens__item--na' : '')}
                      >
                        <span className={'tx-situacao tx-situacao--' + ck.tom} aria-hidden>
                          <span className="tx-situacao__ponto" />
                        </span>
                        <div className="tx-viagem-checagens__texto">
                          <div className="tx-peso-700">{ck.nome}</div>
                          <div className="tx-tipo-legenda tx-sec tx-peso-400">{ck.detalhe}</div>
                        </div>
                        {ck.aviso ? <Badge tom="aviso">a vencer</Badge> : null}
                        {ck.lib ? (
                          <Botao variante="texto" tamanho="p" onClick={v.verRegistro}>
                            liberada por autoridade
                          </Botao>
                        ) : null}
                        <span className={'tx-situacao tx-situacao--' + ck.tom + ' tx-viagem-checagens__rot'}>{ck.rot}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <div className="tx-viagem-grade">
                {/* ---------------------------------------------------------------- coluna principal */}
                <div className="tx-viagem-col">
                  <Cartao
                    como="section"
                    titulo={<>Três últimas cargas</>}
                    sub={
                      <>
                        Por compartimento, da mais recente para a mais antiga (<Termo termo="T-3" />
                        ). A carga anterior define o <Termo termo="regime">regime de limpeza</Termo> pela <Termo termo="IDTF" />.
                      </>
                    }
                  >
                    <div className="tx-viagem-t3">
                      {v.compsT3.map((cp) => (
                        <div key={cp.placa + cp.pos} className="tx-viagem-t3__comp">
                          <div className="tx-viagem-t3__cab">
                            {placa(cp.placa)}
                            <span className="tx-peso-700">Compartimento {cp.pos}</span>
                            <span className="tx-tipo-legenda tx-apagado">{cp.origemTxt}</span>
                            <span className="tx-viagem-t3__exigido">
                              <span className="tx-tipo-legenda tx-sec">Regime exigido</span>
                              {selo(cp.regK, cp.regN, cp.regL)}
                            </span>
                            <Botao
                              variante="texto"
                              tamanho="p"
                              href={cp.href}
                              title="O histórico pertence ao compartimento (placa da carreta e posição), não ao cavalo."
                              aria-label={'Histórico do compartimento ' + cp.pos + ' da ' + cp.placa}
                            >
                              Histórico
                            </Botao>
                          </div>
                          <ol className="tx-viagem-t3__cargas">
                            {cp.cargas.map((cg) => (
                              <li
                                key={cg.rot}
                                className={
                                  'tx-viagem-t3__carga' +
                                  (cg.vazio ? ' tx-viagem-t3__carga--vazia' : '') +
                                  (cg.proib ? ' tx-viagem-t3__carga--proibida' : '')
                                }
                              >
                                <span className="tx-tipo-rotulo">{cg.rot}</span>
                                <span className="tx-mono tx-tipo-legenda tx-sec">{cg.data}</span>
                                <span className="tx-viagem-t3__produto">{cg.nome}</span>
                                {cg.temReg ? selo(cg.regK, cg.regN, cg.regL) : <span />}
                                {cg.temHref ? (
                                  <A className="tx-viagem-t3__fonte tx-viagem-link" href={cg.href}>
                                    {cg.fonte}
                                  </A>
                                ) : (
                                  <span className="tx-viagem-t3__fonte">{cg.fonte}</span>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </Cartao>

                  <Cartao
                    como="section"
                    id="tx-verif"
                    titulo="Verificação do compartimento"
                    sub={v.verifMeta || 'O motorista fotografa pelo link; a filial confere aqui.'}
                    acoes={
                      <Situacao tom={v.verifTom} forma="selo" data-tx-verif={v.verifK}>
                        {v.verifRot}
                      </Situacao>
                    }
                  >
                    <ul className="tx-viagem-fotos" aria-label="Fotos do checklist">
                      {v.itensCk.map((it) => {
                        const conteudo = (
                          <>
                            <span className={'tx-viagem-foto' + (it.temFoto ? ' tx-viagem-foto--' + it.k : ' tx-viagem-foto--vazia')}>
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                              >
                                <path d={it.icon} />
                              </svg>
                              {it.hora ? <span className="tx-viagem-foto__hora tx-mono">{it.hora}</span> : null}
                              {it.resp ? (
                                <span className={'tx-viagem-foto__resp tx-viagem-foto__resp--' + it.resp}>{it.respRot}</span>
                              ) : null}
                            </span>
                            <span className="tx-viagem-fotos__nome">{it.n}</span>
                            <span className={'tx-viagem-fotos__sub' + (it.dev ? ' tx-viagem-fotos__sub--dev' : '')}>
                              {it.sub}
                              {it.critico ? <span className="tx-viagem-fotos__critico">, item crítico</span> : null}
                            </span>
                          </>
                        );
                        return (
                          <li key={it.k}>
                            {it.temFoto ? (
                              <button
                                type="button"
                                onClick={it.onClick}
                                data-tx-foto={it.k}
                                className={
                                  'tx-viagem-fotos__item tx-viagem-fotos__item--botao' +
                                  (it.dev ? ' tx-viagem-fotos__item--dev' : '') +
                                  (it.resp === 'nao' ? ' tx-viagem-fotos__item--nao' : '')
                                }
                                aria-label={'Abrir foto: ' + it.n + (it.respRot ? ', resposta ' + it.respRot : '')}
                              >
                                {conteudo}
                              </button>
                            ) : (
                              <div data-tx-foto={it.k} className={'tx-viagem-fotos__item' + (it.dev ? ' tx-viagem-fotos__item--dev' : '')}>
                                {conteudo}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {v.verifDevolvida ? (
                      <Aviso tom="perigo" titulo="Devolvido ao motorista.">
                        {v.verifDevTxt}
                      </Aviso>
                    ) : null}
                    {v.podeConferir && v.podeConferirOp ? (
                      <div className="tx-viagem-conferir">
                        <div className="tx-viagem-conferir__texto">
                          <b>Sua vez de conferir.</b> Abra cada foto se precisar. Item crítico (interior) reprovado bloqueia a viagem.
                        </div>
                        <Botao variante="contorno" onClick={v.abrirDevolver} data-tx-devolver="">
                          Devolver ao motorista
                        </Botao>
                        <Botao variante="primario" onClick={v.aprovar} data-tx-aprovar="">
                          Aprovar verificação
                        </Botao>
                      </div>
                    ) : null}
                  </Cartao>

                  {v.mostraLimpeza ? (
                    <Cartao
                      como="section"
                      titulo="Limpeza"
                      sub="Regime acima de seco pede lavador credenciado e comprovante."
                      acoes={
                        v.podeLimpeza ? (
                          <Botao tamanho="p" onClick={v.abrirLimpeza}>
                            Registrar limpeza
                          </Botao>
                        ) : null
                      }
                    >
                      {v.semLimpeza ? (
                        <p className="tx-tipo-denso tx-sec">Nenhuma limpeza registrada ainda.</p>
                      ) : (
                        <ul className="tx-viagem-lista">
                          {v.limpezas.map((lp, i) => (
                            <li key={i} className="tx-viagem-lista__item">
                              <SeloRegime regime={lp.regime} />
                              <span className="tx-peso-700">{lp.comp}</span>
                              <span className="tx-sec">{lp.lavador}</span>
                              <span className="tx-mono tx-tipo-legenda tx-sec tx-viagem-lista__fim">{lp.comprovante}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Cartao>
                  ) : null}

                  <Cartao
                    como="section"
                    titulo={
                      <Dica conteudo="Nada se apaga: correção e cancelamento entram como evento novo.">
                        <span className="tx-termo" tabIndex={0}>
                          Linha do tempo
                        </span>
                      </Dica>
                    }
                  >
                    <ol className="tx-viagem-tempo">
                      {v.tempo.map((lt, i) => (
                        <li key={i} className="tx-viagem-tempo__item">
                          <span className={'tx-situacao tx-situacao--' + lt.tom + ' tx-viagem-tempo__marca'} aria-hidden>
                            <span className="tx-situacao__ponto" />
                          </span>
                          <div className="tx-viagem-tempo__texto">
                            <div className="tx-peso-700">{lt.texto}</div>
                            <div className="tx-tipo-legenda tx-apagado">{lt.quem}</div>
                          </div>
                          <time className="tx-mono tx-tipo-legenda tx-sec tx-viagem-tempo__quando">{lt.quando}</time>
                        </li>
                      ))}
                    </ol>
                  </Cartao>
                </div>

                {/* ---------------------------------------------------------------- coluna lateral: um painel, seções por divisor */}
                <aside className="tx-viagem-lado" aria-label="Quem transporta e registros">
                  <section className="tx-viagem-lado__secao" aria-labelledby="viagem-lado-transp">
                    <div className="tx-viagem-pessoa">
                      {v.tEmpresa ? <IconeTipo tipo="transportadora" /> : <Avatar nome={v.tNome} />}
                      <div className="tx-viagem-pessoa__titulos">
                        <h3 id="viagem-lado-transp" className="tx-tipo-titulo tx-viagem-h3">
                          {v.tNome}
                        </h3>
                        <div className="tx-tipo-legenda tx-sec tx-peso-400">{v.tTipo}</div>
                      </div>
                    </div>
                    {v.tQual ? (
                      <div className="tx-viagem-meta">
                        <Situacao tom={v.tAnel}>{v.tQual}</Situacao>
                      </div>
                    ) : null}
                    <dl className="tx-viagem-dados">
                      {v.tDocs.map((td) => (
                        <div key={td.l} className="tx-viagem-dados__linha">
                          <dt>{td.l}</dt>
                          <dd>
                            <span className="tx-mono">{td.v}</span>
                            {td.tom ? (
                              <span className={'tx-situacao tx-situacao--' + td.tom + ' tx-viagem-dados__val'}>{td.tip}</span>
                            ) : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <Botao variante="texto" tamanho="p" href={v.tHref}>
                      {v.tLink}
                    </Botao>
                  </section>

                  <section className="tx-viagem-lado__secao" aria-labelledby="viagem-lado-conj">
                    <h3 id="viagem-lado-conj" className="tx-tipo-titulo tx-viagem-h3">
                      Conjunto
                    </h3>
                    <ul className="tx-viagem-placas">
                      {v.conjPlacas.map((cj) => (
                        <li key={cj.placa} className="tx-viagem-placas__item">
                          <span className="tx-tipo-rotulo tx-viagem-placas__papel">{cj.papel}</span>
                          {placa(cj.placa)}
                          <span className={'tx-situacao tx-situacao--' + cj.crlvTom + ' tx-viagem-dados__val'}>{cj.crlv}</span>
                          {cj.comps.length ? (
                            <span className="tx-viagem-placas__comps">
                              {cj.comps.map((cc) => (
                                <Botao
                                  key={cc.pos}
                                  variante="texto"
                                  tamanho="p"
                                  href={cc.href}
                                  title="O histórico pertence ao compartimento (placa da carreta e posição), não ao cavalo."
                                  aria-label={'Histórico do compartimento ' + cc.pos + ' da ' + cj.placa}
                                >
                                  Histórico do {cc.pos}
                                </Botao>
                              ))}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="tx-viagem-lado__secao" aria-labelledby="viagem-lado-link">
                    <div className="tx-viagem-lado__cab">
                      <h3 id="viagem-lado-link" className="tx-tipo-titulo tx-viagem-h3">
                        Link do motorista
                      </h3>
                      <Situacao tom={v.linkTom}>{v.linkRot}</Situacao>
                    </div>
                    <ol className="tx-viagem-checklist">
                      {v.linkPassos.map((lk) => (
                        <li key={lk.n} className={'tx-viagem-checklist__item' + (lk.feito ? ' tx-viagem-checklist__item--feito' : '')}>
                          <span className="tx-viagem-checklist__marca" aria-hidden>
                            {lk.feito ? (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2.5 6.2 5 8.6l4.5-5" />
                              </svg>
                            ) : null}
                          </span>
                          <span className="tx-viagem-checklist__nome">
                            {lk.n}
                            <span className="tx-so-leitor">{lk.feito ? ', feito' : ', pendente'}</span>
                          </span>
                          <span className="tx-mono tx-tipo-legenda tx-sec">{lk.em}</span>
                        </li>
                      ))}
                    </ol>
                    {v.podeLink ? (
                      <div className="tx-viagem-botoes">
                        <Botao variante="contorno" tamanho="p" onClick={v.abrirMensagem} data-tx-mensagem="">
                          Copiar mensagem
                        </Botao>
                        <Botao variante="contorno" tamanho="p" href={v.linkHref} target="_blank" rel="noopener" data-tx-abrir-link="">
                          Abrir como motorista
                        </Botao>
                      </div>
                    ) : null}
                  </section>

                  <section className="tx-viagem-lado__secao" aria-labelledby="viagem-lado-aud">
                    <div className="tx-viagem-lado__cab">
                      <h3 id="viagem-lado-aud" className="tx-tipo-titulo tx-viagem-h3">
                        Registro para auditoria
                      </h3>
                      <span className="tx-tipo-legenda tx-sec num">
                        {v.auditOkN} de {v.auditItens.length}
                      </span>
                    </div>
                    <ul className="tx-viagem-auditoria">
                      {v.auditItens.map((au) => (
                        <li key={au.k} className="tx-viagem-auditoria__item">
                          <span className={'tx-situacao tx-situacao--' + (au.acima ? 'na' : au.tom)} aria-hidden>
                            <span className="tx-situacao__ponto" />
                          </span>
                          <span className="tx-viagem-auditoria__nome">{au.n}</span>
                          {au.registro ? (
                            <Botao variante="texto" tamanho="p" onClick={v.verRegistro}>
                              Ver registro
                            </Botao>
                          ) : au.acima ? (
                            <span className="tx-tipo-legenda tx-apagado">ver pendência acima</span>
                          ) : (
                            <span className={'tx-mono tx-tipo-legenda ' + (au.tom === 'falta' ? 'tx-viagem-pend' : 'tx-sec')}>{au.v}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="tx-viagem-lado__secao" aria-labelledby="viagem-lado-oc">
                    <div className="tx-viagem-lado__cab">
                      <h3 id="viagem-lado-oc" className="tx-tipo-titulo tx-viagem-h3">
                        Ocorrências
                      </h3>
                      {v.podeOcorrencia ? (
                        <Botao variante="texto" tamanho="p" onClick={v.abrirOcorrencia} data-tx-nova-ocorrencia="">
                          Registrar
                        </Botao>
                      ) : null}
                    </div>
                    {v.semOcorrencia ? (
                      <p className="tx-tipo-legenda tx-sec tx-peso-400">Nenhuma ocorrência nesta viagem.</p>
                    ) : (
                      <ul className="tx-viagem-lista">
                        {v.ocorrencias.map((oc) => (
                          <li key={oc.id} className="tx-viagem-ocorrencia">
                            <div className="tx-viagem-ocorrencia__cab">
                              <Situacao tom={oc.grave ? 'bloqueio' : 'falta'}>{oc.tipo}</Situacao>
                              <span className="tx-mono tx-tipo-legenda tx-sec">{oc.id}</span>
                            </div>
                            <p className="tx-tipo-legenda tx-sec tx-peso-400">{oc.descricao}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </aside>
              </div>
            </>
          ) : null}
        </div>

        {/* ---------------------------------------------------------------- liberação: painel lateral, a viagem fica à vista */}
        {v.mAberto && v.mLiberar ? (
          <Drawer
            id="viagem-liberar"
            data-tx-modal="liberar"
            className="tx-viagem-drawer"
            titulo={'Liberar por autoridade, ' + v.vOrdem}
            sub="Não existe liberação sem registro. Os 9 campos são obrigatórios."
            aoFechar={v.fecharModal}
            rodape={
              <>
                <span className="tx-tipo-legenda tx-peso-700 num tx-viagem-drawer__conta">{v.libN} de 9</span>
                {v.mFalta ? (
                  <span className="tx-falta" aria-live="polite">
                    {v.mFalta}
                  </span>
                ) : null}
                <span className="tx-viagem-drawer__botoes">
                  <Botao onClick={v.fecharModal}>Cancelar</Botao>
                  <Botao variante="primario" inativo={!v.ctaOk} onClick={v.confirmarLiberar} data-tx-confirmar="">
                    Assinar liberação
                  </Botao>
                </span>
              </>
            }
          >
            {this.corpoModal(v)}
          </Drawer>
        ) : null}

        {v.mAberto && !v.mLiberar ? (
          <Modal
            id="viagem-modal"
            data-tx-modal={v.mK}
            tamanho={TAM_MODAL[v.mK] || 'm'}
            titulo={v.mTitulo}
            sub={v.mSub}
            extra={
              <Badge tom="marca" mono>
                {v.vOrdem}
              </Badge>
            }
            aoFechar={v.fecharModal}
            falta={v.mFoto || v.mRegistro || v.mMensagem ? '' : v.mFalta}
            acoes={this.acoesModal(v)}
          >
            {this.corpoModal(v)}
          </Modal>
        ) : null}
      </div>
    );
  }

  acoesModal(v) {
    const cancelar = (rot) => <Botao onClick={v.fecharModal}>{rot || 'Cancelar'}</Botao>;
    const prim = (rot, fn) => (
      <Botao variante="primario" inativo={!v.ctaOk} onClick={fn} data-tx-confirmar="">
        {rot}
      </Botao>
    );
    if (v.mMensagem)
      return (
        <>
          <Botao variante="texto" href={v.linkHref} target="_blank" rel="noopener">
            Abrir como motorista
          </Botao>
          <Botao onClick={v.copiarMensagem} data-tx-copiar-mensagem="">
            Copiar mensagem
          </Botao>
          <Botao variante="primario" href={v.whatsHref} target="_blank" rel="noopener" onClick={v.abrirWhats} data-tx-whatsapp="">
            Abrir no WhatsApp
          </Botao>
        </>
      );
    if (v.mFoto || v.mRegistro) return cancelar('Fechar');
    if (v.mDevolver)
      return (
        <>
          {cancelar()}
          {prim('Devolver ao motorista', v.confirmarDevolver)}
        </>
      );
    if (v.mManter)
      return (
        <>
          {cancelar()}
          {prim('Registrar e manter', v.confirmarManter)}
        </>
      );
    if (v.mRegularizar)
      return (
        <>
          {cancelar('Fechar')}
          {prim('Registrar regularização', v.confirmarRegularizar)}
        </>
      );
    if (v.mTrocar)
      return (
        <>
          {cancelar()}
          {prim('Trocar conjunto', v.confirmarTrocar)}
        </>
      );
    if (v.mLimpeza)
      return (
        <>
          {cancelar()}
          {prim('Registrar limpeza', v.confirmarLimpeza)}
        </>
      );
    if (v.mOcorrencia)
      return (
        <>
          {cancelar()}
          {prim('Registrar ocorrência', v.confirmarOcorrencia)}
        </>
      );
    if (v.mRetificar)
      return (
        <>
          {cancelar()}
          {prim('Registrar retificação', v.confirmarRetificar)}
        </>
      );
    if (v.mCancelar)
      return (
        <>
          {cancelar('Voltar')}
          <Botao variante="perigo" inativo={!v.ctaOk} onClick={v.confirmarCancelar} data-tx-confirmar="">
            Cancelar viagem
          </Botao>
        </>
      );
    return null;
  }

  corpoModal(v) {
    const motivo = (rotulo, dica, area, ph) => (
      <Campo id="viagem-motivo" rotulo={rotulo} dica={dica} campo="motivo">
        {area ? (
          <AreaTexto value={v.fMotivo} onChange={v.onMotivo} placeholder={ph} />
        ) : (
          <Entrada value={v.fMotivo} onChange={v.onMotivo} placeholder={ph} />
        )}
      </Campo>
    );
    const chips = (lista) => (lista || []).map((x) => ({ n: x.n, on: !!x.pressed, onClick: x.onClick }));

    if (v.mMensagem)
      return (
        <div>
          <p className="tx-viagem-mensagem">{v.mensagem}</p>
          <p className="tx-tipo-legenda tx-sec tx-viagem-meta">Para {v.motTel}</p>
        </div>
      );

    if (v.mFoto)
      return (
        <>
          <div className={'tx-viagem-foto tx-viagem-foto--grande tx-viagem-foto--' + v.fotoK}>
            <svg
              width="56"
              height="56"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d={v.fotoIcon} />
            </svg>
            <span className="tx-viagem-foto__hora tx-mono">{v.fotoMeta}</span>
          </div>
          <div className="tx-viagem-pilha">
            <Linha rotulo="Pergunta">
              <b>{v.fotoPergunta}</b>
            </Linha>
            <Linha rotulo="Resposta do motorista">
              <Situacao tom={v.fotoRespOk ? 'ok' : 'bloqueio'} forma="selo">
                {v.fotoResp}
              </Situacao>
            </Linha>
          </div>
        </>
      );

    if (v.mDevolver)
      return (
        <>
          <div className="tx-campo">
            <div id="viagem-dev-rotulo" className="tx-campo__rotulo">
              Itens que precisam de nova foto
            </div>
            <div role="group" aria-labelledby="viagem-dev-rotulo" className="tx-escolhas">
              {v.devItens.map((di) => (
                <Chip key={di.k} tipo="filtro" selecionado={!!di.pressed} onClick={di.onClick} data-tx-dev-item={di.k}>
                  {di.n}
                </Chip>
              ))}
            </div>
          </div>
          {motivo(
            'Motivo',
            'O motorista lê isto no link. Mínimo de 10 caracteres.',
            true,
            'Ex.: foto da lona sem foco, tire de novo de lado com a carreta inteira',
          )}
        </>
      );

    if (v.mLiberar)
      return (
        <>
          <section className="tx-viagem-grupo-form" aria-labelledby="viagem-lib-g1">
            <h3 id="viagem-lib-g1" className="tx-tipo-titulo tx-viagem-h3">
              O que está bloqueado
            </h3>
            <div className="tx-campo">
              <div className="tx-campo__rotulo">1. Regra liberada</div>
              <div className="tx-peso-700">{v.libRegra}</div>
              <div className="tx-tipo-legenda tx-sec tx-peso-400">{v.libRegraDet}</div>
            </div>
          </section>
          <section className="tx-viagem-grupo-form" aria-labelledby="viagem-lib-g2">
            <h3 id="viagem-lib-g2" className="tx-tipo-titulo tx-viagem-h3">
              Sua decisão
            </h3>
            <div className="tx-campo">
              <div id="viagem-lib-motivo" className="tx-campo__rotulo">
                2. Motivo (lista fechada desta regra)
              </div>
              <div role="radiogroup" aria-labelledby="viagem-lib-motivo" className="tx-viagem-pilha">
                {v.libMotivos.map((lm) => (
                  <OpcaoCartao key={lm.n} titulo={lm.n} selecionado={lm.checked} onClick={lm.onClick} data-tx-lib-motivo="" />
                ))}
              </div>
            </div>
            <Campo
              id="viagem-justificativa"
              rotulo="3. Justificativa"
              dica="Complemento do motivo. Mínimo de 20 caracteres."
              campo="justificativa"
            >
              <AreaTexto rows={2} value={v.fJust} onChange={v.onJust} />
            </Campo>
            <div className="tx-campo">
              <div className="tx-campo__rotulo">4. Quem assina</div>
              <Aviso
                tom={v.libAssOk ? 'ok' : 'perigo'}
                titulo={v.uNome + ', ' + v.uAlcada + '.'}
                acao={
                  v.libTrocar && !v.libPedidoFeito ? (
                    <Botao tamanho="p" onClick={v.libPedir}>
                      {v.libPedirRot}
                    </Botao>
                  ) : null
                }
              >
                {v.libAssTxt}
                {v.libTrocar && v.libPedidoFeito ? ' O pedido já está na fila de quem assina.' : ''}
              </Aviso>
            </div>
            <Escolhas id="viagem-lib-risco" rotulo="5. Risco residual" itens={chips(v.libRiscos)} />
            <Escolhas id="viagem-lib-validade" rotulo="6. Validade" itens={chips(v.libValidades)} />
          </section>
          <section className="tx-viagem-grupo-form" aria-labelledby="viagem-lib-g3">
            <h3 id="viagem-lib-g3" className="tx-tipo-titulo tx-viagem-h3">
              Evidência e ciência
            </h3>
            <div className="tx-campo">
              <div className="tx-campo__rotulo">7. Evidência</div>
              <div className="tx-viagem-arquivo">
                <label className="tx-botao tx-botao--contorno tx-botao--p">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" onChange={v.onEvidencia} className="tx-so-leitor" />
                  <span>Anexar arquivo</span>
                </label>
                <span className="tx-mono tx-tipo-legenda tx-sec">{v.fEvidTxt}</span>
                <Botao variante="texto" tamanho="p" onClick={v.evidenciaExemplo}>
                  Usar documento de exemplo
                </Botao>
              </div>
              {v.evidErro ? (
                <div className="tx-erro" role="alert" data-tx-arquivo-erro="">
                  {v.evidErro}
                </div>
              ) : null}
            </div>
            <Checkbox
              checked={v.fEscopo}
              onChange={v.toggleEscopo}
              rotulo={
                <>
                  <b>8. Escopo.</b> Vale só para esta viagem e não cria precedente para outras.
                </>
              }
            />
            <Checkbox
              checked={v.fCiencia}
              onChange={v.toggleCiencia}
              rotulo={
                <>
                  <b>9. Ciência.</b> O motor continua reprovando a regra; a reprovação e este registro ficam juntos na viagem.
                </>
              }
            />
          </section>
        </>
      );

    if (v.mRegistro)
      return v.regCampos.length ? (
        <div className="tx-viagem-pilha">
          {v.regCampos.map((rc) => (
            <Linha key={rc.l} rotulo={rc.l}>
              <span className="tx-viagem-registro__valor">{rc.v}</span>
            </Linha>
          ))}
        </div>
      ) : null;

    if (v.mManter)
      return (
        <>
          <Escolhas id="viagem-manter-acao" rotulo="Ação indicada" itens={chips(v.manterAcoes)} />
          {motivo('Motivo', 'Mínimo de 15 caracteres.', true)}
        </>
      );

    if (v.mRegularizar)
      return (
        <>
          <div role="radiogroup" aria-label="Caminho de regularização" className="tx-viagem-pilha">
            {v.regOpcoes.map((ro) => (
              <OpcaoCartao key={ro.n} titulo={ro.n} sub={ro.sub} selecionado={ro.checked} inativo={ro.ariaDisabled} onClick={ro.onClick}>
                <Badge tom={ro.statusOk ? 'ok' : 'aviso'}>{ro.status}</Badge>
              </OpcaoCartao>
            ))}
          </div>
          {v.regA ? (
            <>
              <div className="tx-viagem-duas">
                <Campo id="viagem-inspetor" rotulo="Inspetor independente" campo="inspetor">
                  <Entrada value={v.fInspetor} onChange={v.onInspetor} />
                </Campo>
                <Campo id="viagem-laudo" rotulo="Número do laudo" campo="laudo">
                  <Entrada mono value={v.fLaudo} onChange={v.onLaudo} />
                </Campo>
              </div>
              <p className="tx-tipo-denso tx-sec">
                Compartimento <b className="tx-mono">{v.regComp}</b>. O laudo confirma limpeza e inspeção após a carga proibida.
              </p>
            </>
          ) : null}
        </>
      );

    if (v.mTrocar)
      return (
        <>
          <EntradaCaixa
            icone={
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3 3" />
              </svg>
            }
            aria-label="Buscar por placa ou nome do transportador"
            placeholder="Buscar por placa ou nome do transportador"
            value={v.fBuscaPlaca}
            onChange={v.onBuscaPlaca}
            data-tx-campo="placa"
          />
          {v.trocaOpcoes.length ? (
            <div role="radiogroup" aria-label="Conjunto novo" className="tx-viagem-pilha tx-viagem-rolagem">
              {v.trocaOpcoes.map((to) => (
                <OpcaoCartao
                  key={to.id}
                  titulo={<span className="tx-mono">{to.placas.join(', ')}</span>}
                  sub={to.dono}
                  selecionado={to.checked}
                  onClick={to.onClick}
                  data-tx-troca={to.id}
                >
                  <span className="tx-viagem-troca__selos">
                    <Badge tom={to.docs.tom}>{to.docs.txt}</Badge>
                    {to.aviso ? <Badge tom="aviso">{to.aviso}</Badge> : null}
                  </span>
                </OpcaoCartao>
              ))}
            </div>
          ) : (
            <EstadoVazio titulo="Nenhum conjunto encontrado">Confira a placa ou busque pelo nome do transportador.</EstadoVazio>
          )}
          {v.trocaOcupado ? <Checkbox checked={v.fConfOcupado} onChange={v.toggleConfOcupado} rotulo={v.trocaOcupado} /> : null}
          {motivo('Motivo da troca', 'Mínimo de 5 caracteres.', false)}
        </>
      );

    if (v.mLimpeza)
      return (
        <>
          <div className="tx-campo">
            <div id="viagem-limp-comp" className="tx-campo__rotulo">
              Compartimentos lavados
            </div>
            <div role="group" aria-labelledby="viagem-limp-comp" className="tx-escolhas">
              {v.limpComps.map((lc) => (
                <Chip key={lc.k} tipo="filtro" selecionado={lc.pressed} onClick={lc.onClick}>
                  <span className="tx-mono">{lc.n}</span>
                </Chip>
              ))}
            </div>
          </div>
          <div className="tx-campo">
            <div id="viagem-limp-lavador" className="tx-campo__rotulo">
              Lavador credenciado
            </div>
            <div role="radiogroup" aria-labelledby="viagem-limp-lavador" className="tx-viagem-pilha">
              {v.limpLavadores.map((ll) => (
                <OpcaoCartao
                  key={ll.n}
                  titulo={ll.n}
                  sub={ll.sub}
                  selecionado={ll.checked}
                  inativo={ll.ariaDisabled}
                  onClick={ll.onClick}
                />
              ))}
            </div>
          </div>
          <div className="tx-viagem-duas">
            <Campo id="viagem-data-lavagem" rotulo="Data da lavagem" campo="data-lavagem" erro={v.erroDataLav}>
              <CampoData valor={v.fDataLav} aoMudar={v.aoDataLav} />
            </Campo>
            <Campo id="viagem-comprovante" rotulo="Número do comprovante" campo="comprovante">
              <Entrada mono value={v.fComprovante} onChange={v.onComprovante} />
            </Campo>
          </div>
          <div className="tx-campo">
            <div className="tx-campo__rotulo">Comprovante (foto ou PDF)</div>
            <div className="tx-viagem-arquivo">
              <label className="tx-botao tx-botao--contorno tx-botao--p">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" onChange={v.onArqLimp} className="tx-so-leitor" />
                <span>Anexar comprovante</span>
              </label>
              <span className="tx-mono tx-tipo-legenda tx-sec">{v.fArqLimp || 'nenhum arquivo'}</span>
              <Botao variante="texto" tamanho="p" onClick={v.arqLimpExemplo}>
                Usar documento de exemplo
              </Botao>
            </div>
            {v.arqLimpErro ? (
              <div className="tx-erro" role="alert">
                {v.arqLimpErro}
              </div>
            ) : null}
          </div>
        </>
      );

    if (v.mOcorrencia)
      return (
        <>
          <Escolhas id="viagem-oc-tipo" rotulo="Tipo" itens={chips(v.ocTipos)} />
          <div className="tx-campo">
            <div id="viagem-oc-grav" className="tx-campo__rotulo">
              Gravidade
            </div>
            <div role="radiogroup" aria-labelledby="viagem-oc-grav" className="tx-viagem-duas">
              {v.ocGravs.map((og) => (
                <OpcaoCartao key={og.n} titulo={og.n} sub={og.sub} selecionado={og.checked} onClick={og.onClick} />
              ))}
            </div>
          </div>
          {motivo('O que aconteceu', 'Mínimo de 15 caracteres.', true)}
        </>
      );

    if (v.mRetificar)
      return (
        <>
          <Escolhas id="viagem-ret-campo" rotulo="Fato a corrigir" itens={chips(v.retCampos)} />
          <div className="tx-viagem-duas">
            <div className="tx-campo">
              <div className="tx-campo__rotulo">Valor registrado</div>
              <div className="tx-viagem-valor tx-mono">{v.retAtual}</div>
            </div>
            <Campo
              id="viagem-novo"
              rotulo="Valor correto"
              campo="novo"
              erro={v.erroNovo}
              dica={v.retJanela ? 'Horário no formato HH:MM.' : undefined}
            >
              <Entrada
                mono={v.retJanela}
                inputMode={v.retJanela ? 'numeric' : undefined}
                placeholder={v.retJanela ? '17:30' : undefined}
                value={v.fNovo}
                onChange={v.onNovo}
              />
            </Campo>
          </div>
          {motivo('Motivo', 'Mínimo de 10 caracteres.', false)}
        </>
      );

    if (v.mCancelar) return motivo('Motivo', 'Mínimo de 15 caracteres.', true);
    return null;
  }
}
