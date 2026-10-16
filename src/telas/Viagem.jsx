// Gerado de "SaaS moderno estilo Dribbble/Viagem.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Viagem extends Tela {
  state = { loading: true, modal: null, acoesOpen: false };
  componentDidMount() {
    TX.ui.montar(this);
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
    const regTom = (r) =>
      ({
        A: ['linear-gradient(135deg,#48c78e,var(--ok))', '#fff'],
        B: ['linear-gradient(135deg,#f1d55a,#e3c235)', '#5b4b05'],
        C: ['linear-gradient(135deg,#f4c15d,var(--aviso-2))', '#fff'],
        D: ['linear-gradient(135deg,#e88a5f,#d06a3c)', '#fff'],
        X: ['linear-gradient(135deg,#e46969,var(--perigo))', '#fff'],
      })[r] || ['var(--borda)', 'var(--texto-apagado)'];
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
    const motivoNA = !prod.racao ? prod.nome + ' não é ração.' : 'Destinatário sem certificação GMP+.';
    const heroTitulo = {
      pronta: dec.porAutoridade ? 'Liberada por autoridade' : 'Pronta para assegurar',
      falta: fl.length === 1 ? 'Falta 1 item para assegurar' : 'Faltam ' + fl.length + ' itens para assegurar',
      bloqueada: 'Bloqueada: ' + minusc(primeiro.o || ''),
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
        : 'As ' + dec.total + ' checagens aplicáveis passaram. Copie a declaração no CT-e emitido no TMS.',
      falta: 'quem resolve cada um está ao lado',
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
      if (/Motorista/.test(f.quem)) return [le.k === 'nao_enviado' ? 'Enviar link' : 'Lembrar o motorista', () => this.abrir('mensagem')];
      if (f.k === 't3' && v.tipo === 'propria')
        return [
          'Abrir frota',
          () => {
            TX.ui.ir('/frota');
          },
        ];
      return null;
    };
    const faltaLista = fl.map((f) => {
      const a = acaoFalta(f);
      return { k: f.k, o: f.o, detalhe: f.detalhe, quem: f.quem, temAcao: !!a, acao: a ? a[0] : '', onClick: a ? a[1] : null };
    });

    // passos
    const feito = (n) => ({
      bg: 'linear-gradient(135deg,var(--primario),var(--azul))',
      c: '#fff',
      sh: '0 4px 10px rgba(18,118,112,.25)',
      icon: '✓',
      subC: 'var(--texto-sec)',
      st: 'feito',
    });
    const atual = (n) => ({ bg: '#fff', c: 'var(--primario-2)', sh: '0 0 0 2.5px var(--primario)', icon: n, subC: 'var(--aviso)', st: 'atual' });
    const pend = (n) => ({ bg: 'var(--superficie-2)', c: 'var(--texto-apagado)', sh: 'none', icon: n, subC: 'var(--texto-apagado)', st: 'pend' });
    const bloq = (n) => ({
      bg: 'linear-gradient(135deg,#e46969,var(--perigo))',
      c: '#fff',
      sh: '0 4px 10px rgba(196,61,61,.25)',
      icon: '✕',
      subC: 'var(--perigo)',
      st: 'bloq',
    });
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
    const passos = passosDef.map((p, i) =>
      Object.assign(
        {
          n: p[0],
          sub: p[1],
          linhaD: i === 0 ? 'none' : 'block',
          linha:
            p[2].st === 'feito'
              ? 'linear-gradient(90deg,var(--primario),var(--azul))'
              : 'repeating-linear-gradient(-45deg,var(--borda-suave) 0 4px,#e2e9e7 4px 8px)',
        },
        p[2],
      ),
    );

    // checagens
    const ROT = { ok: 'passou', falta: 'falta', bloqueio: 'bloqueia', na: 'não se aplica' };
    const checagens = dec.checagens.map((c) => {
      const k = c.liberadaPor ? 'autoridade' : c.estado === 'bloqueio' && c.tecnico ? 'tecnico' : c.estado;
      const tm = U.tom(k);
      return {
        k: c.k,
        estado: c.estado,
        nome: c.nome,
        detalhe: c.detalhe,
        dot: tm.dot,
        ring: tm.ring,
        c: tm.c,
        tc: c.estado === 'na' ? 'var(--texto-apagado)' : 'var(--texto)',
        rot: c.liberadaPor ? 'reprova' : c.tecnico && c.estado === 'bloqueio' ? 'técnico' : ROT[c.estado],
        aviso: !!c.aviso && c.estado === 'ok',
        lib: !!c.liberadaPor,
      };
    });

    // T-3
    const compsT3 = dec.t3.map((c) => {
      const r = c.regimeExigido;
      const rt = regTom(r === '?' ? null : r);
      const cargas = [0, 1, 2].map((i) => {
        const x = c.cargas[i];
        if (!x)
          return {
            rot: 'T-' + (i + 1),
            data: '',
            nome: 'não informada',
            nc: 'var(--texto-apagado)',
            bg: 'repeating-linear-gradient(-45deg,var(--superficie) 0 6px,var(--superficie-2) 6px 12px)',
            bd: 'var(--borda-suave)',
            regD: 'none',
            regL: '',
            regBg: '',
            regC: '',
            fonte: v.tipo === 'propria' ? 'sem registro na frota' : 'o motorista informa pelo link',
            temHref: false,
            semHref: true,
          };
        const xt = regTom(x.regime);
        const proib = x.regime === 'X';
        const fonte = x.confere
          ? (x.fonte === 'viagem' && v.tipo !== 'propria' ? 'confere com a ' : 'viagem ') + x.confere
          : x.fonte === 'registro'
            ? 'registro inicial da frota'
            : 'declarada pelo motorista';
        return {
          rot: 'T-' + (i + 1),
          data: F.curta(x.data),
          nome: x.produto ? x.produto.nome : '"' + x.texto + '" (fora da base)',
          nc: proib ? 'var(--perigo)' : 'var(--texto)',
          bg: proib ? '#fff' : 'var(--superficie)',
          bd: proib ? 'var(--perigo-borda)' : 'var(--borda-suave)',
          regD: 'flex',
          regL: x.regime === 'X' ? '✕' : x.regime || '?',
          regBg: xt[0],
          regC: xt[1],
          fonte,
          temHref: !!x.confere,
          semHref: !x.confere,
          href: '/viagem?id=' + x.confere,
        };
      });
      return {
        placa: c.placa,
        pos: c.pos,
        origemTxt: c.origem === 'historico' ? 'lido do histórico da frota' : 'declarado pelo motorista no link',
        regL: r === 'X' ? '✕' : r || '?',
        regBg: rt[0],
        regC: rt[1],
        href: '/compartimento?placa=' + encodeURIComponent(c.placa) + '&pos=' + c.pos,
        cargas,
      };
    });

    // verificação
    const FOTOS = {
      lona: [
        'repeating-linear-gradient(90deg,#2f5d73 0 14px,#33657c 14px 28px)',
        'M2 6c2-2 4-2 6 0s4 2 6 0M2 10c2-2 4-2 6 0s4 2 6 0',
        '#cfe3ee',
      ],
      correntes: [
        'radial-gradient(circle at 30% 40%,#8a9aa0,#4c5c62 70%)',
        'M3 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M9 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 8h2',
        '#e8eef0',
      ],
      cintas: ['repeating-linear-gradient(-30deg,#c46a2a 0 10px,#d07a34 10px 20px)', 'M2 5h12M2 8h12M2 11h12', '#fbe3cf'],
      carroceria: ['linear-gradient(160deg,#5d7a7a,#3f5757)', 'M2 5h12v6H2zM5 5v6M8 5v6M11 5v6', '#dfeaea'],
      interior: ['repeating-linear-gradient(0deg,#8b6f4e 0 12px,#957857 12px 24px)', 'M3 12 5 4h6l2 8z', '#f4e7d6'],
    };
    const devolvidos = vf && vf.estado === 'devolvida' && !vf.reenviadoEm ? vf.itens || [] : [];
    const itensCk = TX.ITENS_CHECKLIST.map((it) => {
      const resp = ck && ck.itens ? ck.itens[it.k] : null;
      const temFoto = ck && ck.fotos && ck.fotos[it.k];
      const dev = devolvidos.includes(it.k);
      const f = FOTOS[it.k];
      return {
        k: it.k,
        n: it.n,
        foto: temFoto ? f[0] : 'repeating-linear-gradient(-45deg,var(--superficie) 0 7px,var(--borda-suave) 7px 14px)',
        icon: f[1],
        iconC: temFoto ? f[2] : 'var(--borda-forte)',
        hora: ck && ck.enviadoEm ? F.hora(ck.enviadoEm) : '',
        horaD: temFoto && ck.enviadoEm ? 'block' : 'none',
        respRot: resp === 'ok' ? 'OK' : resp === 'nao' ? 'NÃO' : '',
        respBg: resp === 'ok' ? 'rgba(26,143,87,.9)' : resp === 'nao' ? 'rgba(196,61,61,.92)' : 'transparent',
        bd: dev ? 'var(--perigo)' : resp === 'nao' ? 'var(--perigo-borda)' : 'var(--borda-suave)',
        cur: temFoto ? 'pointer' : 'default',
        sub: dev ? 'devolvido: nova foto' : it.critico ? 'item crítico' : temFoto ? 'abrir foto' : 'sem foto ainda',
        subC: dev ? 'var(--perigo)' : it.critico ? 'var(--tecnico)' : 'var(--texto-apagado)',
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
    const tomLt = { motorista: U.tom('info'), equipe: U.tom('ok'), alerta: U.tom('falta'), sistema: U.tom('na') };
    const tempo = lt.map((e, i) => ({
      texto: e.texto,
      quem: e.quem,
      quando: F.quando(e.em),
      dot: tomLt[e.tipo].dot,
      ring: tomLt[e.tipo].ring,
      linhaD: i === lt.length - 1 ? 'none' : 'block',
    }));

    // transportador
    const de = (val) => {
      const d = TX.docEstado(val, v.data < TX.HOJE ? v.data : TX.HOJE);
      return { dot: U.tom(d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio').dot, tip: d.rotulo, dotD: 'block' };
    };
    let tNome, tTipo, tIni, tG1, tG2, tDocs, tHref, tLink;
    if (!t) {
      tNome = mot.nome;
      tTipo = 'Motorista da frota própria';
      tIni = F.iniciais(mot.nome);
      tG1 = mot.g1;
      tG2 = mot.g2;
      tDocs = [
        { l: 'CPF', v: F.cpfMascara(mot.cpf), dotD: 'none' },
        Object.assign({ l: 'CNH', v: mot.cnh.numero }, de(mot.cnh.validade)),
        { l: 'Telefone', v: mot.telefone, dotD: 'none' },
        { l: 'Escopo', v: conj.escopo && conj.escopo.no ? 'no escopo GMP+' : 'fora do escopo', dotD: 'none' },
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
        { l: 'CPF', v: F.cpfMascara(mot.cpf), dotD: 'none' },
        Object.assign(
          { l: 'RNTRC', v: t.rntrc ? t.rntrc.numero : 'não informado' },
          t.rntrc ? de(t.rntrc.validade) : { dot: U.tom('falta').dot, dotD: 'block', tip: 'não informado' },
        ),
        Object.assign(
          { l: 'CNH', v: mot.cnh ? mot.cnh.numero : 'não informada' },
          mot.cnh ? de(mot.cnh.validade) : { dot: U.tom('falta').dot, dotD: 'block', tip: 'não informada' },
        ),
        { l: 'Telefone', v: mot.telefone, dotD: 'none' },
      ];
      tHref = '/transportadores?id=' + t.id;
      tLink = 'Abrir cadastro do TAC';
    } else {
      tNome = t.nome;
      tTipo = cobTxt;
      tIni = F.iniciais(t.nome);
      tG1 = 'var(--primario-2)';
      tG2 = 'var(--azul)';
      tDocs = [{ l: 'CNPJ', v: t.cnpj, dotD: 'none' }, Object.assign({ l: 'RNTRC', v: t.rntrc.numero }, de(t.rntrc.validade))];
      if (t.certificado) tDocs.push(Object.assign({ l: 'Certificado', v: t.certificado.numero }, de(t.certificado.validade)));
      tDocs.push(Object.assign({ l: 'Motorista', v: mot.nome + ', CNH' }, de(mot.cnh.validade)));
      tHref = '/transportadores?id=' + t.id;
      tLink = 'Abrir cadastro da ETC';
    }
    const qual = t ? TX.qualificacao(t) : null;
    const tAnel = qual ? U.tom({ apto: 'ok', restricao: 'falta', pendente: 'falta', bloqueado: 'bloqueio' }[qual.k]).c : 'var(--primario)';

    const conjPlacas = TX.placasDoConjunto(conj).map((pl, i) => {
      const p = TX.placa(pl);
      const d = TX.docEstado(p.crlv && p.crlv.validade, v.data < TX.HOJE ? v.data : TX.HOJE);
      const tm = U.tom(d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio');
      return {
        papel: i === 0 ? 'CAVALO' : 'CARRETA ' + i,
        placa: pl,
        crlv: 'CRLV ' + d.rotulo,
        dot: tm.dot,
        c: tm.c,
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
      bg: p[1] ? 'linear-gradient(135deg,#48c78e,var(--ok))' : '#dde5e3',
      icon: p[1] ? '✓' : '',
      c: p[1] ? 'var(--texto)' : 'var(--texto-apagado)',
    }));
    const lt2 = {
      nao_enviado: U.tom('falta'),
      enviado: U.tom('info'),
      aberto: U.tom('info'),
      preenchendo: U.tom('info'),
      concluido: U.tom('ok'),
      cancelado: U.tom('na'),
    }[le.k];
    const naoEnviado = le.k === 'nao_enviado';

    // registro para auditoria
    const temT3 = dec.t3.length && dec.t3.every((c) => c.completo);
    const auditItens = [
      [
        'Declaração das três últimas cargas',
        temT3,
        temT3 ? (v.tipo === 'propria' ? 'histórico' : F.curta((l.t3Em || '').slice(0, 10))) : 'pendente',
      ],
      ['Conformidade do compartimento', vAprov, vAprov ? F.curta(vf.em.slice(0, 10)) : 'pendente'],
      ['Termo de compromisso', !gk || !!v.termo, !gk ? 'não se aplica' : v.termo ? F.curta(v.termo.em.slice(0, 10)) : 'pendente'],
      [
        'Ciência do manual',
        dec.cobertura === 'certificado' || !!v.manual,
        dec.cobertura === 'certificado'
          ? 'não se aplica'
          : v.manual
            ? 'v' + v.manual.versao + ', ' + F.curta(v.manual.em.slice(0, 10))
            : 'pendente',
      ],
      ['Registro de viagem', true, F.curta((v.criadaEm || '').slice(0, 10))],
      ['DACTE com declaração positiva', !!v.cte, v.cte ? v.cte.numero : 'a conciliar'],
      ['Nota fiscal', !!v.cte, v.cte ? v.cte.nf : 'a conciliar'],
    ].map((a) => ({ n: a[0], dot: a[1] ? U.tom('ok').dot : U.tom('falta').dot, v: a[2], c: a[1] ? 'var(--texto-2)' : 'var(--aviso)' }));

    const ocorrencias = TX.db.ocorrencias
      .filter((o) => o.viagem === v.id)
      .map((o) => ({
        id: o.id,
        tipo: o.tipo,
        descricao: o.descricao,
        dot: o.gravidade === 'grave' ? U.tom('bloqueio').dot : U.tom('falta').dot,
      }));

    const cancel = !!v.cancelada;
    const acao = (n, sub, fn, perigo, off) => ({
      n,
      sub,
      onClick: () => {
        if (off) return;
        this.setState({ acoesOpen: false });
        fn();
      },
      c: perigo ? 'var(--perigo)' : 'var(--texto)',
      cur: off ? 'not-allowed' : 'pointer',
      op: off ? '.45' : '1',
    });
    const acoesLista = [
      acao('Registrar ocorrência', 'resíduo, lona, carga divergente, reclamação', () =>
        this.abrir('ocorrencia', { fTipo: 'Resíduo no compartimento', fGrav: 'leve' }),
      ),
      acao('Retificar um fato', 'correção vira evento novo; o original fica', () => this.abrir('retificar'), false, cancel),
      acao('Trocar conjunto', 'T-3, checklist e termo voltam a ser pedidos', () => this.abrir('trocar'), false, cancel || !!v.cte),
      acao('Exportar registro da viagem', 'documento único com os itens do auditor', () => this.exportar()),
      acao('Cancelar viagem', 'fica registrada como cancelada, com motivo', () => this.abrir('cancelar'), true, cancel || !!v.cte),
    ];

    const tecProibida = tecPrimeiro.k === 'regime' && /proibida/.test(tecPrimeiro.detalhe || '');
    return {
      pronto: !s.loading,
      vOrdem: v.ordem || v.id,
      vTitulo: prod.nome + ', ' + F.peso(v.peso),
      resK: dec.resultado,
      resRotulo: dec.rotulo,
      resDot: tom.dot,
      resRing: tom.ring,
      resC: tom.c,
      resBd: tom.bd,
      cicloN: cic.n,
      cicloSub: cic.sub || '',
      embNome: emb.nome,
      embCidade: emb.cidade,
      destNome: dest.nome,
      destCidade: dest.cidade,
      ids: [
        { l: 'Ordem', v: v.ordem, c: 'var(--texto)' },
        { l: 'CT-e', v: v.cte ? v.cte.numero : 'a conciliar', c: v.cte ? 'var(--texto)' : 'var(--aviso)' },
        { l: 'NF', v: v.cte ? v.cte.nf : 'a conciliar', c: v.cte ? 'var(--texto)' : 'var(--aviso)' },
        { l: 'Filial', v: fil.nome, c: 'var(--texto)' },
        { l: 'Código', v: v.id, c: 'var(--texto-sec)' },
      ],
      placasTxt: TX.placasDoConjunto(conj).join('  '),
      heroPronta: dec.resultado === 'pronta',
      heroFalta: dec.resultado === 'falta',
      heroBloq: dec.resultado === 'bloqueada',
      heroTec: dec.resultado === 'tecnico',
      heroNeutro: dec.resultado === 'nao_assegurada' || dec.resultado === 'cancelada',
      heroTitulo,
      heroSub,
      declaracao: TX.DECLARACAO_CTE,
      copiarDeclaracao: () => {
        U.copiar(TX.DECLARACAO_CTE);
        this.avisar('Declaração copiada. Cole no campo de observações do CT-e no TMS.');
      },
      temAutoridade: !!libCheck,
      autoridadeTxt: libCheck ? 'O motor continua reprovando: ' + libCheck.nome.toLowerCase() + '.' : '',
      verRegistro: () => this.abrir('registro'),
      faltaLista,
      bloqResolver:
        bloqItem.resolver ||
        (podeLib
          ? 'Pode ser liberada com registro de ' +
            (bloqItem.alcada === 'direcao' ? 'Direção e RT' : 'Gestor da qualidade') +
            ', ou resolvida corrigindo o fato.'
          : ''),
      podeLiberar: podeLib && !cancel && (!libV || assina),
      abrirLiberar: () => this.abrir('liberar', { fEscopo: false }),
      podePedir: !!libV && !assina && !libV.pedido,
      pedirLib: () => TX.ui.pedirLiberacao(this, v, libV),
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
      compsT3,
      itensCk,
      verifK,
      verifRot,
      verifC: vt.c,
      verifBd: vt.bd,
      verifDot: vt.dot,
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
      conjPlacas,
      linkRot: le.n,
      linkC: lt2.c,
      linkPassos,
      msgRot: naoEnviado ? 'Enviar link' : 'Copiar mensagem',
      msgBg: naoEnviado ? 'linear-gradient(135deg,var(--primario),var(--azul))' : '#fff',
      msgC: naoEnviado ? '#fff' : 'var(--texto)',
      msgSh: naoEnviado ? '0 6px 14px rgba(18,118,112,.3)' : 'inset 0 0 0 1px var(--borda-campo)',
      abrirMensagem: () => this.abrir('mensagem'),
      linkHref: '/link?id=' + v.id,
      auditItens,
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
      mW: '560px',
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
    const ctaOf = (ok) => {
      const c = U.cta(ok);
      return { ctaBg: c.bg, ctaC: c.c, ctaSh: c.sh, ctaCur: c.cur };
    };
    const motivo = (s.fMotivo || '').trim();
    if (!m) return Object.assign(base, ctaOf(false));

    if (m === 'mensagem') {
      const naoEnviado = !v.link.enviadoEm;
      return Object.assign(
        base,
        {
          mTitulo: naoEnviado ? 'Enviar link ao motorista' : 'Mensagem do link',
          mSub: 'Sai do seu WhatsApp, que o motorista já conhece. Copie e cole na conversa com ele.',
          mensagem: TX.mensagemLink(v),
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
      const FT = {
        lona: 'repeating-linear-gradient(90deg,#2f5d73 0 22px,#33657c 22px 44px)',
        correntes: 'radial-gradient(circle at 30% 40%,#8a9aa0,#4c5c62 70%)',
        cintas: 'repeating-linear-gradient(-30deg,#c46a2a 0 16px,#d07a34 16px 32px)',
        carroceria: 'linear-gradient(160deg,#5d7a7a,#3f5757)',
        interior: 'repeating-linear-gradient(0deg,#8b6f4e 0 18px,#957857 18px 36px)',
      };
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
          mW: '640px',
          mTitulo: 'Foto: ' + it.n,
          mSub: 'Câmera do link, sem acesso à galeria. Hora e local gravados na captura.',
          fotoBg: FT[it.k],
          fotoIcon: IC[it.k],
          fotoIconC: 'rgba(255,255,255,.75)',
          fotoMeta: F.quando(v.checklist.enviadoEm) + (v.checklist.gps ? ', ' + v.checklist.gps : ''),
          fotoPergunta: it.pergunta,
          fotoResp: resp === 'ok' ? 'Sim, está OK' : 'Não',
          fotoRespC: resp === 'ok' ? 'var(--ok)' : 'var(--perigo)',
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
            if (!ok) return;
            TX.fazer('conferir', { id: v.id, decisao: 'devolver', motivo, itens });
            this.setState({ modal: null });
            this.avisar('Devolvido ao motorista. Ele vê o motivo no link e reenvia as fotos.');
          },
        },
        ctaOf(ok),
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
            mW: '620px',
            mTitulo: 'Registro de liberação',
            mSub: 'Lacrado. Correção só por revogação, que entra como evento novo.',
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
      const ck = (on) => ({
        bd: on ? 'var(--primario)' : 'var(--borda-forte)',
        bg: on ? 'linear-gradient(135deg,var(--primario),var(--azul))' : '#fff',
        icon: on ? '✓' : '',
      });
      const esc = ck(s.fEscopo),
        cie = ck(s.fCiencia);
      return Object.assign(
        base,
        {
          mW: '640px',
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
          libAssBg: podeAssinar ? 'var(--primario-fraco)' : 'var(--perigo-fundo)',
          libAssC: podeAssinar ? 'var(--ok)' : 'var(--perigo)',
          libAssTxt: podeAssinar ? 'Sua alçada assina esta regra.' : 'Sua alçada não assina esta regra: precisa de ' + precisa + '.',
          libTrocar: !podeAssinar,
          libRiscos: ['Baixo', 'Médio'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fRisco: x }) }, U.chip(s.fRisco === x)),
          ),
          libValidades: ['Somente esta viagem', 'Até o fim do dia'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fValidade: x }) }, U.chip(s.fValidade === x)),
          ),
          onEvidencia: (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) this.setState({ fEvid: f.name });
          },
          evidenciaExemplo: () =>
            this.setState({ fEvid: alvo.k === 'ocorrencia' ? 'relatorio-acao-corretiva.pdf' : 'protocolo-renovacao.pdf' }),
          fEvidTxt: s.fEvid || 'nenhum arquivo',
          toggleEscopo: () => this.setState({ fEscopo: !s.fEscopo }),
          toggleCiencia: () => this.setState({ fCiencia: !s.fCiencia }),
          escBd: esc.bd,
          escBg: esc.bg,
          escIcon: esc.icon,
          cieBd: cie.bd,
          cieBg: cie.bg,
          cieIcon: cie.icon,
          confirmarLiberar: () => {
            if (!ok) return;
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
        ctaOf(ok),
      );
    }
    if (m === 'manter') {
      const ok = motivo.length >= 15 && !!s.fAcao;
      return Object.assign(
        base,
        {
          mTitulo: 'Manter o bloqueio',
          mSub: 'Manter também é decisão registrada: fica na linha do tempo com seu nome, o motivo e a ação indicada.',
          manterAcoes: ['Trocar o conjunto', 'Aguardar documento', 'Cancelar a viagem', 'Outra'].map((x) =>
            Object.assign({ n: x, onClick: () => this.setState({ fAcao: x }) }, U.chip(s.fAcao === x)),
          ),
          confirmarManter: () => {
            if (!ok) return;
            const bl = dec.falta.find((f) => f.estado === 'bloqueio') || {};
            TX.fazer('manterBloqueio', { id: v.id, checagem: bl.k, motivo, acao: s.fAcao });
            this.setState({ modal: null });
            this.avisar('Bloqueio mantido e registrado na linha do tempo.');
          },
        },
        ctaOf(ok),
      );
    }
    if (m === 'regularizar') {
      const comp = dec.t3.find((c) => c.proibida) || dec.t3[0];
      const hist = TX.historico(comp.placa, comp.pos);
      const naoRacao = hist.filter((h) => h.data > comp.proibida.data && h.produto && !TX.produto(h.produto).racao).length;
      const opB = naoRacao >= 5;
      const opA = s.fOpcao === 'A';
      const ok = opA && (s.fInspetor || '').trim().length >= 5 && (s.fLaudo || '').trim().length >= 4;
      return Object.assign(
        base,
        {
          mW: '640px',
          mTitulo: 'Regularizar conforme a TS1.9',
          mSub: 'Carga proibida não se aprova. O compartimento volta a carregar ração depois de um dos caminhos abaixo, registrado passo a passo.',
          regOpcoes: [
            Object.assign(
              {
                n: 'Opção A: inspetor independente',
                sub: 'Limpeza completa e inspeção por inspetor independente, com laudo.',
                status: 'disponível',
                sc: 'var(--ok)',
                onClick: () => this.setState({ fOpcao: 'A' }),
              },
              U.sel(opA),
            ),
            Object.assign(
              {
                n: 'Opção B: cinco cargas não ração',
                sub: 'Cinco transportes de carga não ração após a proibida e liberação pelo inspetor do carregador.',
                status: naoRacao + ' de 5 cargas não ração desde ' + F.curta(comp.proibida.data),
                sc: opB ? 'var(--ok)' : 'var(--aviso)',
                onClick: () => {
                  if (opB) this.setState({ fOpcao: 'B' });
                  else this.avisar('Opção B ainda não: faltam ' + (5 - naoRacao) + ' cargas não ração depois da carga proibida.');
                },
              },
              U.sel(!opA, opB),
            ),
          ],
          regA: opA,
          regComp: comp.placa + ' ' + comp.pos,
          fInspetor: s.fInspetor || '',
          onInspetor: (e) => this.setState({ fInspetor: e.target.value }),
          fLaudo: s.fLaudo || '',
          onLaudo: (e) => this.setState({ fLaudo: e.target.value }),
          confirmarRegularizar: () => {
            if (!ok) return;
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
        ctaOf(ok),
      );
    }
    if (m === 'trocar') {
      const q = TX.norm(s.fBuscaPlaca || '');
      const hoje = TX.db.viagens.filter((x) => x.data === v.data && !x.cancelada && x.id !== v.id).map((x) => x.conjunto);
      const ops = TX.db.conjuntos
        .filter((c) => c.id !== v.conjunto && (c.dono !== 'propria' || (c.escopo && c.escopo.no)))
        .filter((c) => !q || TX.norm(TX.placasDoConjunto(c).join(' ') + ' ' + TX.nomeTransportador(c.dono)).includes(q))
        .slice(0, 8);
      const ok = !!s.fConj && motivo.length >= 5;
      return Object.assign(
        base,
        {
          mTitulo: 'Trocar o conjunto',
          mSub: 'O T-3, o checklist e o termo voltam a ser pedidos para o conjunto novo. A troca entra na linha do tempo.',
          fBuscaPlaca: s.fBuscaPlaca || '',
          onBuscaPlaca: (e) => this.setState({ fBuscaPlaca: e.target.value }),
          trocaOpcoes: ops.map((c) => {
            const sx = U.sel(s.fConj === c.id);
            const ocupado = hoje.includes(c.id);
            return Object.assign(
              {
                id: c.id,
                placas: TX.placasDoConjunto(c).join('  '),
                dono: TX.nomeTransportador(c.dono === 'propria' ? null : c.dono) + (c.dono === 'propria' ? ', no escopo GMP+' : ''),
                aviso: ocupado ? 'já carrega hoje' : '',
                onClick: () => this.setState({ fConj: c.id }),
              },
              sx,
              { c: ocupado ? 'var(--aviso)' : 'var(--texto-apagado)' },
            );
          }),
          confirmarTrocar: () => {
            if (!ok) return;
            TX.fazer('trocarConjunto', { id: v.id, conjunto: s.fConj, motivo });
            this.setState({ modal: null });
            this.avisar('Conjunto trocado. Mande o link de novo para o motorista informar as cargas e as fotos.');
          },
        },
        ctaOf(ok),
      );
    }
    if (m === 'limpeza') {
      const comps = dec.t3.filter((c) => c.regimeExigido && !['A', 'X', '?'].includes(c.regimeExigido));
      const lista = comps.length ? comps : dec.t3;
      const alvo = lista.find((c) => c.key === s.fComp) || lista[0];
      const exig = alvo ? (['A', 'B', 'C', 'D'].includes(alvo.regimeExigido) ? alvo.regimeExigido : 'A') : 'A';
      const ok = !!alvo && !!s.fLavador && (s.fComprovante || '').trim().length >= 4;
      return Object.assign(
        base,
        {
          mTitulo: 'Registrar limpeza',
          mSub:
            'Regime exigido em ' +
            (alvo ? alvo.placa + ' ' + alvo.pos : '') +
            ': ' +
            exig +
            ' (' +
            TX.REGIMES[exig].n.toLowerCase() +
            '). Credenciamento do lavador limita o regime que ele pode fazer.',
          limpComps: lista.map((c) =>
            Object.assign({ n: c.placa + ' ' + c.pos, onClick: () => this.setState({ fComp: c.key }) }, U.chip(alvo && alvo.key === c.key)),
          ),
          limpLavadores: TX.db.fornecedores
            .filter((f) => f.servico === 'lavagem')
            .map((f) => {
              const pode = TX.REGIMES[f.regimeMax].ordem >= TX.REGIMES[exig].ordem;
              const sx = U.sel(s.fLavador === f.id, pode);
              return Object.assign(
                {
                  n: f.nome,
                  sub: f.cidade + ', credenciado até regime ' + f.regimeMax + (pode ? '' : ': não faz regime ' + exig),
                  onClick: () => {
                    if (pode) this.setState({ fLavador: f.id });
                  },
                },
                sx,
              );
            }),
          fComprovante: s.fComprovante || '',
          onComprovante: (e) => this.setState({ fComprovante: e.target.value }),
          confirmarLimpeza: () => {
            if (!ok) return;
            TX.fazer('registrarLimpeza', {
              id: v.id,
              comp: alvo.key,
              regime: exig,
              lavador: s.fLavador,
              comprovante: s.fComprovante.trim(),
            });
            this.setState({ modal: null });
            this.avisar('Limpeza registrada no compartimento e na viagem.');
          },
        },
        ctaOf(ok),
      );
    }
    if (m === 'ocorrencia') {
      const ok = !!s.fTipo && !!s.fGrav && motivo.length >= 15;
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
            if (!ok) return;
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
        ctaOf(ok),
      );
    }
    if (m === 'retificar') {
      const campo = s.fCampo || 'peso';
      const atual = { peso: F.peso(v.peso), janela: v.janela, ordem: v.ordem }[campo];
      const novo = (s.fNovo || '').trim();
      const ok = novo.length > 0 && motivo.length >= 10 && (campo !== 'peso' || /^\d+([.,]\d+)?$/.test(novo));
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
          onNovo: (e) => this.setState({ fNovo: e.target.value }),
          confirmarRetificar: () => {
            if (!ok) return;
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
        ctaOf(ok),
      );
    }
    if (m === 'cancelar') {
      const ok = motivo.length >= 15;
      const c = U.ctaPerigo(ok);
      return Object.assign(
        base,
        {
          mTitulo: 'Cancelar a viagem',
          mSub: 'A viagem não some: fica registrada como cancelada, com motivo, autor e hora.',
          ctaPBg: c.bg,
          ctaPC: c.c,
          ctaPSh: c.sh,
          ctaPCur: c.cur,
          confirmarCancelar: () => {
            if (!ok) return;
            TX.fazer('cancelarViagem', { id: v.id, motivo });
            this.setState({ modal: null });
            this.avisar('Viagem cancelada. O registro continua em Viagens, com o motivo.');
          },
        },
        ctaOf(ok),
      );
    }
    return Object.assign(base, ctaOf(false));
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Viagem" data-tela="Viagem">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '20px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--texto-sec)' }}>
              <A href="/viagens" style={{ color: 'var(--texto-sec)' }} className="tx-h76d8d79">
                Viagens
              </A>
              <span style={{ color: '#b8c6c4' }}>›</span>
              <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: 'var(--texto)' }}>{v.vOrdem}</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div role="button" tabIndex={0}
                onClick={v.abrirExportar}
                style={{
                  background: 'var(--painel)',
                  border: '1px solid var(--borda-campo)',
                  borderRadius: '11px',
                  padding: '9px 15px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="tx-h30bbaa9"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2.5v8M4.8 7.4 8 10.6l3.2-3.2M3 13.5h10"></path>
                </svg>
                Exportar registro
              </div>
              <div data-tx-pop="" style={{ position: 'relative' }}>
                <div role="button" tabIndex={0}
                  onClick={v.abrirAcoes}
                  data-tx-acoes=""
                  style={{
                    background: 'var(--primario-3)',
                    color: '#fff',
                    borderRadius: '11px',
                    padding: '9px 16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  className="tx-hae10539"
                >
                  Ações ▾
                </div>
                {v.acoesOpen ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '46px',
                        background: 'var(--painel)',
                        border: '1px solid var(--borda)',
                        borderRadius: '16px',
                        boxShadow: '0 16px 40px rgba(9,61,68,.16)',
                        padding: '6px',
                        width: '290px',
                        zIndex: '80',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {(Array.isArray(v.acoesLista) ? v.acoesLista : []).map((ac, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={ac?.onClick}
                            style={{ padding: '9px 12px', borderRadius: '10px', cursor: ac?.cur, opacity: ac?.op }}
                            className="tx-h894fca3"
                          >
                            <div style={{ fontSize: '13px', fontWeight: '700', color: ac?.c }}>{ac?.n}</div>
                            <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '1px' }}>{ac?.sub}</div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          {v.loading ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span
                  style={{
                    height: '30px',
                    width: '38%',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                    backgroundSize: '600px 100%',
                    animation: 'txsh 1.3s linear infinite',
                  }}
                ></span>
                <span
                  style={{
                    height: '16px',
                    width: '55%',
                    borderRadius: '99px',
                    background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                    backgroundSize: '600px 100%',
                    animation: 'txsh 1.3s linear infinite',
                  }}
                ></span>
                <span
                  style={{
                    height: '150px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                    backgroundSize: '600px 100%',
                    animation: 'txsh 1.3s linear infinite',
                  }}
                ></span>
                <span
                  style={{
                    height: '380px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                    backgroundSize: '600px 100%',
                    animation: 'txsh 1.3s linear infinite',
                  }}
                ></span>
              </div>
            </>
          ) : null}
          {v.pronto ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-.2px' }}>{v.vTitulo}</div>
                  <span
                    data-tx-resultado={v.resK}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      fontWeight: '800',
                      color: v.resC,
                      background: 'var(--painel)',
                      border: `1.5px solid ${v.resBd ?? ''}`,
                      borderRadius: '99px',
                      padding: '5px 14px',
                    }}
                  >
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '99px',
                        background: v.resDot,
                        boxShadow: `0 0 0 3px ${v.resRing ?? ''}`,
                      }}
                    ></span>
                    {v.resRotulo}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'var(--texto-2)',
                      background: 'var(--painel)',
                      border: '1px solid var(--borda-campo)',
                      borderRadius: '99px',
                      padding: '5px 12px',
                    }}
                  >
                    {v.cicloN}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--texto-2)' }}>
                  <b style={{ fontWeight: '700' }}>{v.embNome}</b>
                  {', '}
                  {v.embCidade} <span style={{ color: 'var(--texto-apagado)' }}>→</span> <b style={{ fontWeight: '700' }}>{v.destNome}</b>
                  {', '}
                  {v.destCidade}
                  <span style={{ color: 'var(--texto-apagado)' }}>
                    {', '}
                    {v.cicloSub}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {(Array.isArray(v.ids) ? v.ids : []).map((id, $index) => (
                    <Fragment key={$index}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          background: 'var(--painel)',
                          border: '1px solid var(--borda)',
                          borderRadius: '10px',
                          padding: '5px 11px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '.8px',
                            color: 'var(--texto-apagado)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {id?.l}
                        </span>
                        <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600', color: id?.c }}>
                          {id?.v}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--texto)',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '5px 11px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '.8px',
                        color: 'rgba(255,255,255,.55)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Placas
                    </span>
                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>{v.placasTxt}</span>
                  </span>
                </div>
              </div>
              {v.heroPronta ? (
                <>
                  <div
                    data-tx-hero="pronta"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '22px',
                      background: 'linear-gradient(115deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 470px',
                      gap: '28px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: '-80px',
                        top: '-120px',
                        width: '360px',
                        height: '360px',
                        borderRadius: '99px',
                        background: 'radial-gradient(circle,rgba(255,255,255,.16),transparent 65%)',
                      }}
                    ></div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '99px',
                            background: 'linear-gradient(135deg,#48c78e,var(--ok))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 0 5px rgba(72,199,142,.22)',
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5 6.5 12 13 4.5"></path>
                          </svg>
                        </span>
                        <div style={{ fontSize: '20px', fontWeight: '800' }}>{v.heroTitulo}</div>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,.78)',
                          marginTop: '9px',
                          lineHeight: '1.55',
                          maxWidth: '620px',
                        }}
                      >
                        {v.heroSub}
                      </div>
                      {v.temAutoridade ? (
                        <>
                          <div role="button" tabIndex={0}
                            onClick={v.verRegistro}
                            style={{
                              marginTop: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '9px',
                              background: 'rgba(255,255,255,.1)',
                              border: '1px solid rgba(255,255,255,.2)',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                            className="tx-h53feea5"
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '99px',
                                background: 'linear-gradient(135deg,#f4c15d,#d97544)',
                              }}
                            ></span>
                            {v.autoridadeTxt}
                            {' Ver o registro'}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        background: 'rgba(255,255,255,.08)',
                        border: '1px solid rgba(255,255,255,.18)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.4px', color: 'rgba(255,255,255,.6)' }}>
                        DECLARAÇÃO PARA O CT-E
                      </div>
                      <div
                        data-tx-declaracao=""
                        style={{
                          fontFamily: "'Spline Sans Mono',monospace",
                          fontSize: '14px',
                          fontWeight: '600',
                          marginTop: '8px',
                          lineHeight: '1.5',
                        }}
                      >
                        {v.declaracao}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                        <span role="button" tabIndex={0}
                          onClick={v.copiarDeclaracao}
                          data-tx-copiar-declaracao=""
                          style={{
                            background: 'var(--painel)',
                            color: 'var(--primario-3)',
                            fontSize: '13px',
                            fontWeight: '800',
                            borderRadius: '99px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flex: 'none',
                          }}
                          className="tx-h0882f37"
                        >
                          Copiar texto
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)', lineHeight: '1.4' }}>
                          CT-e emitido no TMS. O número chega pela conciliação em lote.
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {v.heroFalta ? (
                <>
                  <div
                    data-tx-hero="falta"
                    style={{
                      background: 'var(--painel)',
                      border: '1px solid var(--borda)',
                      borderRadius: '22px',
                      padding: '20px 24px',
                      boxShadow: 'inset 4px 0 0 var(--aviso-2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '99px',
                          background: 'linear-gradient(135deg,#f4c15d,var(--aviso-2))',
                          boxShadow: '0 0 0 4px rgba(232,163,61,.2)',
                        }}
                      ></span>
                      <div style={{ fontSize: '20px', fontWeight: '800' }}>{v.heroTitulo}</div>
                      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{v.heroSub}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '16px' }}>
                      {(Array.isArray(v.faltaLista) ? v.faltaLista : []).map((fl, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              background: 'var(--superficie)',
                              borderRadius: '14px',
                              padding: '10px 14px',
                            }}
                          >
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700' }}>{fl?.o}</div>
                              <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '1px' }}>{fl?.detalhe}</div>
                            </div>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: 'var(--texto-2)',
                                border: '1px solid var(--borda-campo)',
                                borderRadius: '99px',
                                padding: '3px 10px',
                                whiteSpace: 'nowrap',
                                background: 'var(--painel)',
                              }}
                            >
                              {fl?.quem}
                            </span>
                            {fl?.temAcao ? (
                              <>
                                <span role="button" tabIndex={0}
                                  onClick={fl?.onClick}
                                  data-tx-falta-acao={fl?.k}
                                  style={{
                                    background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    borderRadius: '99px',
                                    padding: '7px 15px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 6px 14px rgba(18,118,112,.28)',
                                  }}
                                  className="tx-h0882f37"
                                >
                                  {fl?.acao}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {v.heroBloq ? (
                <>
                  <div
                    data-tx-hero="bloqueada"
                    style={{
                      background: 'var(--painel)',
                      border: '1px solid var(--perigo-borda)',
                      borderRadius: '22px',
                      padding: '20px 24px',
                      boxShadow: 'inset 4px 0 0 var(--perigo)',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg,#e46969,var(--perigo))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3.5" y="7" width="9" height="6.5" rx="1.6"></rect>
                        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"></path>
                      </svg>
                    </span>
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800' }}>{v.heroTitulo}</div>
                      <div style={{ fontSize: '14px', color: 'var(--texto-2)', marginTop: '4px', lineHeight: '1.5' }}>{v.heroSub}</div>
                      <div style={{ fontSize: '13px', color: 'var(--primario-2)', fontWeight: '700', marginTop: '6px' }}>{v.bloqResolver}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'flex-end', flex: 'none' }}>
                      {v.podePedir ? (
                        <>
                          <span role="button" tabIndex={0}
                            onClick={v.pedirLib}
                            data-tx-pedir-liberacao=""
                            style={{
                              background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '9px 18px',
                              cursor: 'pointer',
                              boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                            }}
                            className="tx-h0882f37"
                          >
                            Pedir liberação
                          </span>
                        </>
                      ) : null}
                      {v.temPedido ? (
                        <>
                          <span
                            data-tx-pedido-lib=""
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--aviso)',
                              maxWidth: '250px',
                              textAlign: 'right',
                              lineHeight: '1.4',
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '99px',
                                background: 'var(--aviso-2)',
                                boxShadow: '0 0 0 3px rgba(232,163,61,.2)',
                                flex: 'none',
                              }}
                            ></span>
                            {v.pedidoTxt}
                          </span>
                        </>
                      ) : null}
                      {v.podeLiberar ? (
                        <>
                          <span role="button" tabIndex={0}
                            onClick={v.abrirLiberar}
                            data-tx-liberar=""
                            style={{
                              background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '9px 18px',
                              cursor: 'pointer',
                              boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                            }}
                            className="tx-h0882f37"
                          >
                            Liberar por autoridade
                          </span>
                        </>
                      ) : null}
                      {v.bloqTemHref ? (
                        <>
                          <A
                            href={v.bloqHref}
                            style={{
                              background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '9px 18px',
                              boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                            }}
                            className="tx-h0e7da8b"
                          >
                            Resolver em Cadastros
                          </A>
                        </>
                      ) : null}
                      <span role="button" tabIndex={0}
                        onClick={v.abrirManter}
                        style={{
                          background: 'var(--superficie-2)',
                          color: 'var(--texto)',
                          fontSize: '13px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '9px 18px',
                          cursor: 'pointer',
                        }}
                        className="tx-h5a3ff2f"
                      >
                        Manter bloqueio
                      </span>
                      {v.semLiberacao ? (
                        <>
                          <span style={{ fontSize: '12px', color: 'var(--texto-apagado)', maxWidth: '230px', textAlign: 'right' }}>
                            {v.semLiberacaoTxt}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}
              {v.heroTec ? (
                <>
                  <div
                    data-tx-hero="tecnico"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '22px',
                      background: 'linear-gradient(115deg,#3a1219,#6e1f2b 60%,var(--tecnico) 130%)',
                      color: '#fff',
                      padding: '24px 28px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'repeating-linear-gradient(-45deg,rgba(255,255,255,.03) 0 10px,transparent 10px 20px)',
                      }}
                    ></div>
                    <div
                      style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 520px', gap: '24px', alignItems: 'center' }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.6px', color: 'rgba(255,255,255,.6)' }}>
                          BLOQUEIO TÉCNICO: NINGUÉM APROVA
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>{v.heroTitulo}</div>
                        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.82)', marginTop: '8px', lineHeight: '1.55' }}>
                          {v.heroSub}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div role="button" tabIndex={0}
                          onClick={v.abrirTrocar}
                          data-tx-trocar=""
                          style={{
                            background: 'rgba(255,255,255,.08)',
                            border: '1px solid rgba(255,255,255,.2)',
                            borderRadius: '16px',
                            padding: '16px 16px',
                            cursor: 'pointer',
                          }}
                          className="tx-h681b28c"
                        >
                          <div style={{ fontSize: '14px', fontWeight: '800' }}>Trocar o conjunto</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', marginTop: '4px', lineHeight: '1.45' }}>
                            Outro TAC ou outra carreta. T-3 e checklist voltam a ser pedidos.
                          </div>
                        </div>
                        <div role="button" tabIndex={0}
                          onClick={v.abrirRegularizar}
                          data-tx-regularizar=""
                          style={{
                            background: 'rgba(255,255,255,.08)',
                            border: '1px solid rgba(255,255,255,.2)',
                            borderRadius: '16px',
                            padding: '16px 16px',
                            cursor: 'pointer',
                          }}
                          className="tx-h681b28c"
                        >
                          <div style={{ fontSize: '14px', fontWeight: '800' }}>{v.tecAcao2}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', marginTop: '4px', lineHeight: '1.45' }}>
                            {v.tecAcao2Sub}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {v.heroNeutro ? (
                <>
                  <div
                    style={{
                      background: 'var(--painel)',
                      border: '1px solid var(--borda)',
                      borderRadius: '22px',
                      padding: '20px 24px',
                      boxShadow: 'inset 4px 0 0 var(--borda-forte)',
                    }}
                  >
                    <div style={{ fontSize: '20px', fontWeight: '800' }}>{v.heroTitulo}</div>
                    <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '4px' }}>{v.heroSub}</div>
                  </div>
                </>
              ) : null}
              <div
                style={{
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                {(Array.isArray(v.passos) ? v.passos : []).map((ps, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        minWidth: '0',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: 'calc(-50% + 20px)',
                          right: 'calc(50% + 20px)',
                          height: '3px',
                          borderRadius: '99px',
                          background: ps?.linha,
                          display: ps?.linhaD,
                        }}
                      ></div>
                      <span
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '99px',
                          background: ps?.bg,
                          color: ps?.c,
                          fontSize: '13px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: ps?.sh,
                          position: 'relative',
                        }}
                      >
                        {ps?.icon}
                      </span>
                      <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '8px', textAlign: 'center' }}>{ps?.n}</div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: ps?.subC,
                          marginTop: '2px',
                          textAlign: 'center',
                          fontFamily: "'Spline Sans Mono',monospace",
                        }}
                      >
                        {ps?.sub}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 392px', gap: '20px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0' }}>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Checagens</div>
                      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>derivadas dos fatos; ninguém digita estado</div>
                      <div
                        style={{
                          marginLeft: 'auto',
                          fontFamily: "'Spline Sans Mono',monospace",
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--texto-2)',
                        }}
                      >
                        {v.okN}
                        {' de '}
                        {v.totalN}
                      </div>
                      <span role="button" tabIndex={0}
                        onClick={v.chToggle}
                        data-tx-ver-checagens=""
                        style={{
                          fontSize: '13px',
                          fontWeight: '800',
                          color: 'var(--primario-2)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          marginLeft: '6px',
                        }}
                        className="tx-h76d8d79"
                      >
                        {v.chToggleRot}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: '12px',
                        height: '8px',
                        borderRadius: '99px',
                        overflow: 'hidden',
                        display: 'flex',
                        background: 'repeating-linear-gradient(-45deg,var(--borda-suave) 0 5px,#e2e9e7 5px 10px)',
                      }}
                    >
                      <div style={{ width: v.okPct, background: 'linear-gradient(90deg,#48c78e,var(--primario))', transition: 'width .4s' }}></div>
                    </div>
                    {v.chFechado ? (
                      <>
                        <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '10px' }}>{v.chResumo}</div>
                      </>
                    ) : null}
                    {v.chAberto ? (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                          {(Array.isArray(v.checagens) ? v.checagens : []).map((ck, $index) => (
                            <Fragment key={$index}>
                              <div
                                data-tx-checagem={ck?.k}
                                data-tx-estado={ck?.estado}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '10px 4px',
                                  borderBottom: '1px solid var(--superficie-2)',
                                }}
                              >
                                <span
                                  style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '99px',
                                    background: ck?.dot,
                                    boxShadow: `0 0 0 3px ${ck?.ring ?? ''}`,
                                    flex: 'none',
                                  }}
                                ></span>
                                <div style={{ flex: '1', minWidth: '0' }}>
                                  <div style={{ fontSize: '14px', fontWeight: '700', color: ck?.tc }}>{ck?.nome}</div>
                                  <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '1px' }}>{ck?.detalhe}</div>
                                </div>
                                {ck?.aviso ? (
                                  <>
                                    <span
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: 'var(--aviso)',
                                        border: '1px solid var(--aviso-borda)',
                                        borderRadius: '99px',
                                        padding: '2px 9px',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      a vencer
                                    </span>
                                  </>
                                ) : null}
                                {ck?.lib ? (
                                  <>
                                    <span role="button" tabIndex={0}
                                      onClick={v.verRegistro}
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: '#b85a2e',
                                        border: '1px solid #f0d3bf',
                                        borderRadius: '99px',
                                        padding: '2px 9px',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      liberada por autoridade
                                    </span>
                                  </>
                                ) : null}
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: ck?.c,
                                    whiteSpace: 'nowrap',
                                    minWidth: '84px',
                                    textAlign: 'right',
                                  }}
                                >
                                  {ck?.rot}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Três últimas cargas</div>
                      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>
                        por compartimento; o regime sai da carga anterior pela IDTF
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {(Array.isArray(v.compsT3) ? v.compsT3 : []).map((cp, $index) => (
                        <Fragment key={$index}>
                          <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '16px', padding: '16px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span
                                style={{
                                  fontFamily: "'Spline Sans Mono',monospace",
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  background: 'var(--texto)',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  padding: '3px 9px',
                                }}
                              >
                                {cp?.placa}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: '700' }}>
                                {'compartimento '}
                                {cp?.pos}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{cp?.origemTxt}</span>
                              <span
                                style={{
                                  marginLeft: 'auto',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '7px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  color: 'var(--texto-2)',
                                }}
                              >
                                regime exigido{' '}
                                <span
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '8px',
                                    background: cp?.regBg,
                                    color: cp?.regC,
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {cp?.regL}
                                </span>
                              </span>
                              <A href={cp?.href} style={{ fontSize: '13px', fontWeight: '700' }} className="tx-h76d8d79">
                                Histórico →
                              </A>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginTop: '12px' }}>
                              {(Array.isArray(cp?.cargas) ? cp?.cargas : []).map((cg, $index) => (
                                <Fragment key={$index}>
                                  <div
                                    style={{
                                      borderRadius: '13px',
                                      padding: '10px 12px',
                                      background: cg?.bg,
                                      border: `1px solid ${cg?.bd ?? ''}`,
                                      minHeight: '74px',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                      <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: 'var(--texto-apagado)' }}>
                                        {cg?.rot}
                                      </span>
                                      <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: 'var(--texto-sec)' }}>
                                        {cg?.data}
                                      </span>
                                      <span
                                        style={{
                                          marginLeft: 'auto',
                                          width: '20px',
                                          height: '20px',
                                          borderRadius: '7px',
                                          background: cg?.regBg,
                                          color: cg?.regC,
                                          fontSize: '11px',
                                          fontWeight: '800',
                                          display: cg?.regD,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        {cg?.regL}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '5px', color: cg?.nc }}>{cg?.nome}</div>
                                    {cg?.temHref ? (
                                      <>
                                        <A href={cg?.href} style={{ fontSize: '12px', fontWeight: '700' }}>
                                          {cg?.fonte}
                                        </A>
                                      </>
                                    ) : null}
                                    {cg?.semHref ? (
                                      <>
                                        <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{cg?.fonte}</div>
                                      </>
                                    ) : null}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div
                    id="tx-verif"
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Verificação do compartimento</div>
                      <span
                        data-tx-verif={v.verifK}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: v.verifC,
                          border: `1px solid ${v.verifBd ?? ''}`,
                          borderRadius: '99px',
                          padding: '3px 11px',
                        }}
                      >
                        <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: v.verifDot }}></span>
                        {v.verifRot}
                      </span>
                      <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--texto-sec)' }}>{v.verifMeta}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                      O motorista responde e fotografa pelo link; o afretador confere aqui e aprova ou devolve com motivo.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginTop: '16px' }}>
                      {(Array.isArray(v.itensCk) ? v.itensCk : []).map((it, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={it?.onClick}
                            data-tx-foto={it?.k}
                            style={{
                              borderRadius: '15px',
                              border: `1.5px solid ${it?.bd ?? ''}`,
                              overflow: 'hidden',
                              cursor: it?.cur,
                              background: 'var(--painel)',
                              transition: 'transform .15s',
                            }}
                            className="tx-hb08bac3"
                          >
                            <div
                              style={{
                                height: '96px',
                                background: it?.foto,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 16 16"
                                fill="none"
                                style={{ stroke: it?.iconC }}
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d={it?.icon}></path>
                              </svg>
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '8px',
                                  bottom: '7px',
                                  fontFamily: "'Spline Sans Mono',monospace",
                                  fontSize: '11px',
                                  color: '#fff',
                                  background: 'rgba(9,34,36,.55)',
                                  borderRadius: '6px',
                                  padding: '1px 6px',
                                  display: it?.horaD,
                                }}
                              >
                                {it?.hora}
                              </span>
                              <span
                                style={{
                                  position: 'absolute',
                                  right: '8px',
                                  top: '7px',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  color: '#fff',
                                  background: it?.respBg,
                                  borderRadius: '99px',
                                  padding: '2px 8px',
                                }}
                              >
                                {it?.respRot}
                              </span>
                            </div>
                            <div style={{ padding: '9px 11px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '800' }}>{it?.n}</div>
                              <div style={{ fontSize: '11px', color: it?.subC, marginTop: '1px' }}>{it?.sub}</div>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {v.verifDevolvida ? (
                      <>
                        <div
                          style={{
                            marginTop: '12px',
                            border: '1px dashed var(--perigo-borda)',
                            borderRadius: '14px',
                            padding: '11px 14px',
                            fontSize: '13px',
                            color: 'var(--tecnico)',
                          }}
                        >
                          <b>Devolvido ao motorista</b> {v.verifDevTxt}
                        </div>
                      </>
                    ) : null}
                    {v.podeConferir ? (
                      <>
                        <div
                          style={{
                            marginTop: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'var(--superficie)',
                            borderRadius: '16px',
                            padding: '12px 16px',
                          }}
                        >
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '99px',
                              background: 'linear-gradient(135deg,#f4c15d,var(--aviso-2))',
                              boxShadow: '0 0 0 3px rgba(232,163,61,.2)',
                            }}
                          ></span>
                          <div style={{ flex: '1', fontSize: '13px' }}>
                            <b>Sua vez de conferir.</b> Abra cada foto se precisar. Item crítico (interior) reprovado bloqueia a viagem.
                          </div>
                          <span role="button" tabIndex={0}
                            onClick={v.abrirDevolver}
                            data-tx-devolver=""
                            style={{
                              background: 'var(--painel)',
                              border: '1px solid var(--borda-campo)',
                              color: 'var(--texto)',
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '9px 18px',
                              cursor: 'pointer',
                            }}
                            className="tx-hb24e7a4"
                          >
                            Devolver ao motorista
                          </span>
                          <span role="button" tabIndex={0}
                            onClick={v.aprovar}
                            data-tx-aprovar=""
                            style={{
                              background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '9px 20px',
                              cursor: 'pointer',
                              boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                            }}
                            className="tx-h0882f37"
                          >
                            Aprovar verificação
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                  {v.mostraLimpeza ? (
                    <>
                      <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '800' }}>Limpeza</div>
                          <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>
                            regime acima de seco pede lavador credenciado e comprovante
                          </div>
                          <span role="button" tabIndex={0}
                            onClick={v.abrirLimpeza}
                            style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                            className="tx-h76d8d79"
                          >
                            Registrar limpeza
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                          {(Array.isArray(v.limpezas) ? v.limpezas : []).map((lp, $index) => (
                            <Fragment key={$index}>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  fontSize: '13px',
                                  background: 'var(--superficie)',
                                  borderRadius: '12px',
                                  padding: '9px 13px',
                                }}
                              >
                                <b>
                                  {'Regime '}
                                  {lp?.regime}
                                </b>
                                <span>{lp?.comp}</span>
                                <span style={{ color: 'var(--texto-sec)' }}>{lp?.lavador}</span>
                                <span style={{ marginLeft: 'auto', fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px' }}>
                                  {lp?.comprovante}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                          {v.semLimpeza ? (
                            <>
                              <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>Nenhuma limpeza registrada ainda.</div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Linha do tempo</div>
                      <div style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>
                        nada se apaga: correção e cancelamento entram como evento novo
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                      {(Array.isArray(v.tempo) ? v.tempo : []).map((lt, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '14px', flex: 'none' }}>
                              <span
                                style={{
                                  width: '11px',
                                  height: '11px',
                                  borderRadius: '99px',
                                  background: lt?.dot,
                                  boxShadow: `0 0 0 3px ${lt?.ring ?? ''}`,
                                  marginTop: '4px',
                                }}
                              ></span>
                              <span style={{ flex: '1', width: '2px', background: 'var(--borda-suave)', margin: '4px 0', display: lt?.linhaD }}></span>
                            </div>
                            <div style={{ paddingBottom: '14px', flex: '1', minWidth: '0', display: 'flex', gap: '12px' }}>
                              <div style={{ flex: '1', minWidth: '0' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{lt?.texto}</div>
                                <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '1px' }}>{lt?.quem}</div>
                              </div>
                              <span
                                style={{
                                  fontFamily: "'Spline Sans Mono',monospace",
                                  fontSize: '12px',
                                  color: 'var(--texto-sec)',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {lt?.quando}
                              </span>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '99px',
                          flex: 'none',
                          background: `linear-gradient(135deg,${v.tG1 ?? ''},${v.tG2 ?? ''})`,
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 0 3px #fff,0 0 0 4.5px ${v.tAnel ?? ''}`,
                        }}
                      >
                        {v.tIni}
                      </span>
                      <div style={{ minWidth: '0', flex: '1' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.tNome}</div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{v.tTipo}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
                      {(Array.isArray(v.tDocs) ? v.tDocs : []).map((td, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '13px',
                              background: 'var(--superficie)',
                              borderRadius: '11px',
                              padding: '8px 12px',
                            }}
                          >
                            <span style={{ color: 'var(--texto-sec)', width: '84px', flex: 'none' }}>{td?.l}</span>
                            <span
                              style={{
                                fontFamily: "'Spline Sans Mono',monospace",
                                fontWeight: '600',
                                flex: '1',
                                minWidth: '0',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {td?.v}
                            </span>
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '99px',
                                background: td?.dot,
                                flex: 'none',
                                display: td?.dotD,
                              }}
                              title={td?.tip}
                            ></span>
                          </div>
                        </Fragment>
                      ))}
                    </div>{' '}
                    <A href={v.tHref} style={{ display: 'block', marginTop: '12px', fontSize: '13px', fontWeight: '700' }}>
                      {v.tLink}
                      {' →'}
                    </A>{' '}
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>Conjunto</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                      {(Array.isArray(v.conjPlacas) ? v.conjPlacas : []).map((cj, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: '1px solid var(--borda-suave)',
                              borderRadius: '12px',
                              padding: '9px 12px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                letterSpacing: '.8px',
                                color: 'var(--texto-apagado)',
                                width: '70px',
                                flex: 'none',
                              }}
                            >
                              {cj?.papel}
                            </span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>
                              {cj?.placa}
                            </span>
                            <span
                              title={cj?.crlv}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '11px',
                                color: cj?.c,
                                fontWeight: '700',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: cj?.dot }}></span>
                              CRLV
                            </span>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                              {(Array.isArray(cj?.comps) ? cj?.comps : []).map((cc, $index) => (
                                <Fragment key={$index}>
                                  <A
                                    href={cc?.href}
                                    title="Histórico do compartimento"
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      border: '1px solid #d9e5e3',
                                      borderRadius: '99px',
                                      padding: '2px 9px',
                                    }}
                                    className="tx-h30bbaa9"
                                  >
                                    {cc?.pos}
                                  </A>
                                </Fragment>
                              ))}
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '10px', lineHeight: '1.5' }}>
                      O histórico pertence ao compartimento (placa da carreta e posição), não ao cavalo.
                    </div>
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Link do motorista</div>
                      <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '700', color: v.linkC }}>{v.linkRot}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '10px' }}>
                      {(Array.isArray(v.linkPassos) ? v.linkPassos : []).map((lk, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 2px', fontSize: '13px' }}>
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '99px',
                                background: lk?.bg,
                                color: '#fff',
                                fontSize: '11px',
                                fontWeight: '800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 'none',
                              }}
                            >
                              {lk?.icon}
                            </span>
                            <span style={{ flex: '1', color: lk?.c, fontWeight: '600' }}>{lk?.n}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: 'var(--texto-sec)' }}>
                              {lk?.em}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.abrirMensagem}
                        data-tx-mensagem=""
                        style={{
                          flex: '1',
                          textAlign: 'center',
                          background: v.msgBg,
                          color: v.msgC,
                          fontSize: '13px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '9px 12px',
                          cursor: 'pointer',
                          boxShadow: v.msgSh,
                        }}
                        className="tx-h0882f37"
                      >
                        {v.msgRot}
                      </span>
                      <A
                        href={v.linkHref}
                        target="_blank"
                        rel="noopener"
                        data-tx-abrir-link=""
                        style={{
                          flex: '1',
                          textAlign: 'center',
                          background: 'var(--superficie-2)',
                          color: 'var(--texto)',
                          fontSize: '13px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '9px 12px',
                        }}
                        className="tx-hcab3cde"
                      >
                        Abrir como motorista
                      </A>
                    </div>
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>Registro para auditoria</div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '2px' }}>o que o auditor anota por viagem</div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                      {(Array.isArray(v.auditItens) ? v.auditItens : []).map((au, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '7px 0',
                              borderBottom: '1px solid var(--superficie-2)',
                              fontSize: '13px',
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: au?.dot, flex: 'none' }}></span>
                            <span style={{ flex: '1' }}>{au?.n}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: au?.c }}>{au?.v}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Ocorrências</div>
                      <span role="button" tabIndex={0}
                        onClick={v.abrirOcorrencia}
                        data-tx-nova-ocorrencia=""
                        style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                        className="tx-h76d8d79"
                      >
                        Registrar
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                      {(Array.isArray(v.ocorrencias) ? v.ocorrencias : []).map((oc, $index) => (
                        <Fragment key={$index}>
                          <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '12px', padding: '9px 12px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: oc?.dot }}></span>
                              <span style={{ fontSize: '13px', fontWeight: '800' }}>{oc?.tipo}</span>
                              <span
                                style={{
                                  marginLeft: 'auto',
                                  fontFamily: "'Spline Sans Mono',monospace",
                                  fontSize: '11px',
                                  color: 'var(--texto-apagado)',
                                }}
                              >
                                {oc?.id}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '3px', lineHeight: '1.45' }}>{oc?.descricao}</div>
                          </div>
                        </Fragment>
                      ))}
                      {v.semOcorrencia ? (
                        <>
                          <div style={{ fontSize: '13px', color: 'var(--texto-apagado)' }}>
                            Nenhuma ocorrência nesta viagem. Resíduo, lona rasgada ou reclamação no destino entram aqui e contam no
                            transportador.
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {v.mAberto ? (
          <>
            <div
              onClick={v.fecharModal}
              style={{
                position: 'fixed',
                inset: '0',
                background: 'rgba(9,34,36,.45)',
                backdropFilter: 'blur(3px)',
                zIndex: '1000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
              }}
            >
              <div role="dialog" aria-modal="true"
                onClick={v.pararClique}
                data-tx-modal={v.mK}
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: v.mW,
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '28px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.mTitulo}</div>
                  <span
                    style={{
                      fontFamily: "'Spline Sans Mono',monospace",
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--primario-2)',
                      border: '1px solid #cfe3e1',
                      borderRadius: '99px',
                      padding: '2px 10px',
                    }}
                  >
                    {v.vOrdem}
                  </span>
                  <span role="button" tabIndex={0}
                    onClick={v.fecharModal}
                    style={{
                      marginLeft: 'auto',
                      width: '32px',
                      height: '32px',
                      borderRadius: '99px',
                      background: 'var(--superficie-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                    className="tx-h5a3ff2f"
                  >
                    ✕
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.55' }}>{v.mSub}</div>
                {v.mMensagem ? (
                  <>
                    <div style={{ marginTop: '16px', background: '#e7f1ec', borderRadius: '16px', padding: '16px' }}>
                      <div
                        style={{
                          background: 'var(--painel)',
                          borderRadius: '4px 14px 14px 14px',
                          padding: '11px 13px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          boxShadow: '0 1px 2px rgba(0,0,0,.08)',
                        }}
                      >
                        {v.mensagem}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--texto-sec)', marginTop: '6px', textAlign: 'right' }}>
                        {'para '}
                        {v.motTel}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <A
                        href={v.linkHref}
                        target="_blank"
                        rel="noopener"
                        style={{
                          background: 'var(--superficie-2)',
                          color: 'var(--texto)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                        }}
                        className="tx-hcab3cde"
                      >
                        Abrir como motorista
                      </A>
                      <span role="button" tabIndex={0}
                        onClick={v.copiarMensagem}
                        data-tx-copiar-mensagem=""
                        style={{
                          background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                          cursor: 'pointer',
                          boxShadow: '0 8px 18px rgba(18,118,112,.35)',
                        }}
                      >
                        Copiar mensagem
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mFoto ? (
                  <>
                    <div
                      style={{
                        marginTop: '16px',
                        height: '300px',
                        borderRadius: '16px',
                        background: v.fotoBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <svg
                        width="70"
                        height="70"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ stroke: v.fotoIconC }}
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={v.fotoIcon}></path>
                      </svg>
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          bottom: '12px',
                          fontFamily: "'Spline Sans Mono',monospace",
                          fontSize: '12px',
                          color: '#fff',
                          background: 'rgba(9,34,36,.6)',
                          borderRadius: '8px',
                          padding: '4px 9px',
                        }}
                      >
                        {v.fotoMeta}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--texto-sec)' }}>Pergunta:</span>
                      <b>{v.fotoPergunta}</b>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--texto-sec)' }}>Resposta do motorista:</span>
                      <b style={{ color: v.fotoRespC }}>{v.fotoResp}</b>
                    </div>
                  </>
                ) : null}
                {v.mDevolver ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.6px', color: 'var(--texto-2)', marginTop: '16px' }}>
                      ITENS QUE PRECISAM DE NOVA FOTO
                    </div>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {(Array.isArray(v.devItens) ? v.devItens : []).map((di, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
                            onClick={di?.onClick}
                            data-tx-dev-item={di?.k}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${di?.bd ?? ''}`,
                              background: di?.bg,
                              color: di?.c,
                            }}
                          >
                            {di?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '.6px', color: 'var(--texto-2)', marginTop: '16px' }}>
                      MOTIVO (O MOTORISTA LÊ ISTO NO LINK)
                    </div>
                    <textarea
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      rows="3"
                      placeholder="Ex.: foto da lona sem foco, tire de novo de lado com a carreta inteira"
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarDevolver}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Devolver ao motorista
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mLiberar ? (
                  <>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          flex: '1',
                          height: '8px',
                          borderRadius: '99px',
                          overflow: 'hidden',
                          background: 'repeating-linear-gradient(-45deg,var(--borda-suave) 0 5px,#e2e9e7 5px 10px)',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: v.libPct,
                            background: 'linear-gradient(90deg,#f4c15d,#d97544)',
                            transition: 'width .3s',
                          }}
                        ></div>
                      </div>
                      <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', fontWeight: '600' }}>
                        {v.libN}
                        {' de 9'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>1. Regra liberada</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>{v.libRegra}</div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{v.libRegraDet}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>2. Motivo (lista fechada desta regra)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                          {(Array.isArray(v.libMotivos) ? v.libMotivos : []).map((lm, $index) => (
                            <Fragment key={$index}>
                              <div role="button" tabIndex={0}
                                onClick={lm?.onClick}
                                data-tx-lib-motivo=""
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  border: `1.5px solid ${lm?.bd ?? ''}`,
                                  background: lm?.bg,
                                  borderRadius: '12px',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                }}
                              >
                                <span
                                  style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '99px',
                                    border: `2px solid ${lm?.dotBd ?? ''}`,
                                    background: lm?.dot,
                                    flex: 'none',
                                  }}
                                ></span>
                                {lm?.n}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>
                          3. Justificativa (complemento, mínimo 20 caracteres)
                        </div>
                        <textarea
                          value={v.fJust ?? ''}
                          onChange={v.onJust}
                          data-tx-campo="justificativa"
                          rows="2"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '12px',
                            padding: '9px 12px',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical',
                          }}
                        ></textarea>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>4. Quem assina</div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '6px',
                            borderRadius: '12px',
                            padding: '9px 12px',
                            background: v.libAssBg,
                          }}
                        >
                          <span
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '99px',
                              background: `linear-gradient(135deg,${v.uG1 ?? ''},${v.uG2 ?? ''})`,
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {v.uIni}
                          </span>
                          <div style={{ flex: '1' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700' }}>
                              {v.uNome}
                              {', '}
                              {v.uAlcada}
                            </div>
                            <div style={{ fontSize: '12px', color: v.libAssC }}>{v.libAssTxt}</div>
                          </div>
                          {v.libTrocar ? (
                            <>
                              <span role="button" tabIndex={0}
                                onClick={v.abrirEntrar}
                                style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                              >
                                Entrar como quem assina
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>5. Risco residual</div>
                        <div style={{ display: 'flex', gap: '7px', marginTop: '6px' }}>
                          {(Array.isArray(v.libRiscos) ? v.libRiscos : []).map((lr, $index) => (
                            <Fragment key={$index}>
                              <span role="button" tabIndex={0}
                                onClick={lr?.onClick}
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '6px 14px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${lr?.bd ?? ''}`,
                                  background: lr?.bg,
                                  color: lr?.c,
                                }}
                              >
                                {lr?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>6. Validade</div>
                        <div style={{ display: 'flex', gap: '7px', marginTop: '6px' }}>
                          {(Array.isArray(v.libValidades) ? v.libValidades : []).map((lv, $index) => (
                            <Fragment key={$index}>
                              <span role="button" tabIndex={0}
                                onClick={lv?.onClick}
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '6px 14px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${lv?.bd ?? ''}`,
                                  background: lv?.bg,
                                  color: lv?.c,
                                }}
                              >
                                {lv?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>7. Evidência</div>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '6px',
                            border: '1.5px dashed var(--borda-forte)',
                            borderRadius: '12px',
                            padding: '9px 12px',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          <input type="file" onChange={v.onEvidencia} style={{ display: 'none' }} />
                          <span style={{ fontWeight: '800', color: 'var(--primario-2)' }}>Anexar arquivo</span>
                          <span style={{ color: 'var(--texto-sec)', fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px' }}>
                            {v.fEvidTxt}
                          </span>
                        </label>
                        <span role="button" tabIndex={0}
                          onClick={v.evidenciaExemplo}
                          style={{ fontSize: '12px', color: 'var(--texto-apagado)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          usar documento de exemplo
                        </span>
                      </div>
                      <div role="button" tabIndex={0} onClick={v.toggleEscopo} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <span
                          style={{
                            width: '19px',
                            height: '19px',
                            borderRadius: '6px',
                            border: `2px solid ${v.escBd ?? ''}`,
                            background: v.escBg,
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 'none',
                          }}
                        >
                          {v.escIcon}
                        </span>
                        <div style={{ fontSize: '13px' }}>
                          <b>8. Escopo.</b> Vale só para esta viagem e não cria precedente para outras.
                        </div>
                      </div>
                      <div role="button" tabIndex={0} onClick={v.toggleCiencia} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                        <span
                          style={{
                            width: '19px',
                            height: '19px',
                            borderRadius: '6px',
                            border: `2px solid ${v.cieBd ?? ''}`,
                            background: v.cieBg,
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 'none',
                          }}
                        >
                          {v.cieIcon}
                        </span>
                        <div style={{ fontSize: '13px' }}>
                          <b>9. Ciência.</b> O motor continua reprovando a regra; a reprovação e este registro ficam juntos na viagem.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarLiberar}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Assinar liberação
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mRegistro ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
                      {(Array.isArray(v.regCampos) ? v.regCampos : []).map((rc, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              fontSize: '13px',
                              background: 'var(--superficie)',
                              borderRadius: '11px',
                              padding: '8px 12px',
                            }}
                          >
                            <span style={{ color: 'var(--texto-sec)', width: '150px', flex: 'none' }}>{rc?.l}</span>
                            <span style={{ fontWeight: '600' }}>{rc?.v}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.mManter ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>AÇÃO INDICADA</div>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {(Array.isArray(v.manterAcoes) ? v.manterAcoes : []).map((ma, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
                            onClick={ma?.onClick}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${ma?.bd ?? ''}`,
                              background: ma?.bg,
                              color: ma?.c,
                            }}
                          >
                            {ma?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>
                      MOTIVO (MÍNIMO 15 CARACTERES)
                    </div>
                    <textarea
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      rows="3"
                      style={{
                        width: '100%',
                        marginTop: '8px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarManter}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Registrar e manter
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mRegularizar ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                      {(Array.isArray(v.regOpcoes) ? v.regOpcoes : []).map((ro, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={ro?.onClick}
                            style={{
                              border: `1.5px solid ${ro?.bd ?? ''}`,
                              background: ro?.bg,
                              borderRadius: '15px',
                              padding: '12px 16px',
                              cursor: ro?.cur,
                              opacity: ro?.op,
                            }}
                          >
                            <div style={{ fontSize: '14px', fontWeight: '800' }}>{ro?.n}</div>
                            <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '3px', lineHeight: '1.45' }}>{ro?.sub}</div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: ro?.sc, marginTop: '6px' }}>{ro?.status}</div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {v.regA ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Inspetor independente</div>
                            <input
                              value={v.fInspetor ?? ''}
                              onChange={v.onInspetor}
                              data-tx-campo="inspetor"
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                border: '1px solid var(--borda-campo)',
                                borderRadius: '11px',
                                padding: '9px 12px',
                                fontSize: '14px',
                                outline: 'none',
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Número do laudo</div>
                            <input
                              value={v.fLaudo ?? ''}
                              onChange={v.onLaudo}
                              data-tx-campo="laudo"
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                border: '1px solid var(--borda-campo)',
                                borderRadius: '11px',
                                padding: '9px 12px',
                                fontSize: '14px',
                                outline: 'none',
                                fontFamily: "'Spline Sans Mono',monospace",
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '8px' }}>
                          Compartimento: <b>{v.regComp}</b>. O laudo confirma limpeza e inspeção após a carga proibida.
                        </div>
                      </>
                    ) : null}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Fechar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarRegularizar}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Registrar regularização
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mTrocar ? (
                  <>
                    <input
                      value={v.fBuscaPlaca ?? ''}
                      onChange={v.onBuscaPlaca}
                      data-tx-campo="placa"
                      placeholder="Buscar por placa ou nome do transportador"
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginTop: '10px',
                        maxHeight: '300px',
                        overflow: 'auto',
                      }}
                    >
                      {(Array.isArray(v.trocaOpcoes) ? v.trocaOpcoes : []).map((to, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={to?.onClick}
                            data-tx-troca={to?.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: `1.5px solid ${to?.bd ?? ''}`,
                              background: to?.bg,
                              borderRadius: '13px',
                              padding: '9px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            <span
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '99px',
                                border: `2px solid ${to?.dotBd ?? ''}`,
                                background: to?.dot,
                                flex: 'none',
                              }}
                            ></span>
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>
                                {to?.placas}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{to?.dono}</div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: to?.c }}>{to?.aviso}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>MOTIVO DA TROCA</div>
                    <input
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarTrocar}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Trocar conjunto
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mLimpeza ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>COMPARTIMENTO</div>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {(Array.isArray(v.limpComps) ? v.limpComps : []).map((lc, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
                            onClick={lc?.onClick}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${lc?.bd ?? ''}`,
                              background: lc?.bg,
                              color: lc?.c,
                            }}
                          >
                            {lc?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>LAVADOR CREDENCIADO</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {(Array.isArray(v.limpLavadores) ? v.limpLavadores : []).map((ll, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={ll?.onClick}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: `1.5px solid ${ll?.bd ?? ''}`,
                              background: ll?.bg,
                              borderRadius: '12px',
                              padding: '8px 12px',
                              cursor: ll?.cur,
                              opacity: ll?.op,
                            }}
                          >
                            <span
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '99px',
                                border: `2px solid ${ll?.dotBd ?? ''}`,
                                background: ll?.dot,
                                flex: 'none',
                              }}
                            ></span>
                            <div style={{ flex: '1' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700' }}>{ll?.n}</div>
                              <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{ll?.sub}</div>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>NÚMERO DO COMPROVANTE</div>
                    <input
                      value={v.fComprovante ?? ''}
                      onChange={v.onComprovante}
                      data-tx-campo="comprovante"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: "'Spline Sans Mono',monospace",
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarLimpeza}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Registrar limpeza
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mOcorrencia ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>TIPO</div>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {(Array.isArray(v.ocTipos) ? v.ocTipos : []).map((ot, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
                            onClick={ot?.onClick}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${ot?.bd ?? ''}`,
                              background: ot?.bg,
                              color: ot?.c,
                            }}
                          >
                            {ot?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>GRAVIDADE</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                      {(Array.isArray(v.ocGravs) ? v.ocGravs : []).map((og, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={og?.onClick}
                            style={{
                              border: `1.5px solid ${og?.bd ?? ''}`,
                              background: og?.bg,
                              borderRadius: '13px',
                              padding: '10px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: '800' }}>{og?.n}</div>
                            <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '2px', lineHeight: '1.4' }}>{og?.sub}</div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>
                      O QUE ACONTECEU (MÍNIMO 15 CARACTERES)
                    </div>
                    <textarea
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      rows="3"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarOcorrencia}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Registrar ocorrência
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mRetificar ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>FATO A CORRIGIR</div>
                    <div style={{ display: 'flex', gap: '7px', marginTop: '6px' }}>
                      {(Array.isArray(v.retCampos) ? v.retCampos : []).map((rt, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
                            onClick={rt?.onClick}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${rt?.bd ?? ''}`,
                              background: rt?.bg,
                              color: rt?.c,
                            }}
                          >
                            {rt?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Valor registrado</div>
                        <div
                          style={{
                            marginTop: '6px',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            background: 'var(--superficie)',
                            fontFamily: "'Spline Sans Mono',monospace",
                            fontSize: '13px',
                          }}
                        >
                          {v.retAtual}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Valor correto</div>
                        <input
                          value={v.fNovo ?? ''}
                          onChange={v.onNovo}
                          data-tx-campo="novo"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: "'Spline Sans Mono',monospace",
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>MOTIVO</div>
                    <input
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarRetificar}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaBg,
                          color: v.ctaC,
                          boxShadow: v.ctaSh,
                          cursor: v.ctaCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Registrar retificação
                      </span>
                    </div>
                  </>
                ) : null}
                {v.mCancelar ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '16px' }}>
                      MOTIVO (MÍNIMO 15 CARACTERES)
                    </div>
                    <textarea
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      rows="3"
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                      <span role="button" tabIndex={0}
                        onClick={v.fecharModal}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '14px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Voltar
                      </span>
                      <span role="button" tabIndex={0}
                        onClick={v.confirmarCancelar}
                        data-tx-confirmar=""
                        style={{
                          background: v.ctaPBg,
                          color: v.ctaPC,
                          boxShadow: v.ctaPSh,
                          cursor: v.ctaPCur,
                          fontSize: '14px',
                          fontWeight: '800',
                          borderRadius: '99px',
                          padding: '10px 22px',
                        }}
                      >
                        Cancelar viagem
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}
