// Gerado de "SaaS moderno estilo Dribbble/Hoje.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

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
    const fz = (on, atual) =>
      on ? 'linear-gradient(90deg,#48c78e,var(--ok))' : atual ? 'linear-gradient(90deg,#f4c15d,var(--aviso-2))' : 'var(--borda)';
    const etapas = [
      { tip: 'link enviado', bg: fz(!!l.enviadoEm, !l.enviadoEm) },
      { tip: 'três últimas cargas', bg: fz(dec.t3.every((c) => c.completo) && dec.t3.length, !!l.abertoEm) },
      { tip: 'checklist com fotos', bg: fz(ck && ck.enviadoEm, !!l.abertoEm) },
      {
        tip: 'conferência do afretador',
        bg: fz(vf && vf.estado === 'aprovada' && !conferir, conferir || (vf && vf.estado === 'devolvida')),
      },
      { tip: gk ? 'termo assinado' : 'ciência do manual', bg: fz(gk ? !!v.termo : !!v.manual, !!l.abertoEm) },
    ];
    const ltom = {
      nao_enviado: U.tom('falta'),
      enviado: U.tom('info'),
      aberto: U.tom('info'),
      preenchendo: U.tom('info'),
      concluido: U.tom('ok'),
      cancelado: U.tom('na'),
    }[le.k];
    const f0 = dec.falta[0];
    const lib = TX.liberacaoDe(v);
    let falta, faltaC, quem;
    if (dec.resultado === 'pronta') {
      falta = dec.porAutoridade ? 'Liberada por autoridade' : 'Pronta para assegurar';
      faltaC = 'var(--ok)';
      quem = 'declaração do CT-e liberada';
    } else {
      falta =
        dec.resultado === 'tecnico'
          ? 'Bloqueio técnico: ' + f0.detalhe.split(':')[0]
          : dec.resultado === 'bloqueada'
            ? 'Bloqueada: ' +
              ({
                ocorrencia: 'transportador em revisão após ocorrência grave',
                'docs-conj': 'CRLV vencido no conjunto',
                'docs-mot': 'CNH vencida',
                'docs-transp': 'RNTRC vencido',
                produto: 'produto não é ração',
              }[f0.k] ||
                (dec.cobertura === 'gatekeeper' && f0.k === 'cobertura'
                  ? 'filial sem comunicação ao organismo certificador'
                  : f0.o.toLowerCase()))
            : f0.o;
      faltaC = tomR.c;
      quem = dec.falta.length > 1 ? f0.quem + ' e mais ' + (dec.falta.length - 1) : f0.quem;
    }
    if (lib && lib.pedido)
      quem = 'liberação pedida às ' + F.hora(lib.pedido.em) + ', esperando assinatura de ' + this.nomeAlcada(lib.alcada);
    let acao = null;
    if (le.k === 'nao_enviado' && !v.cancelada) acao = { k: 'link', n: 'Enviar link', fn: () => this.mandarLink(v), prim: true };
    else if (conferir)
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
      else if (!lib.pedido) acao = { k: 'pedir', n: 'Pedir liberação', fn: () => this.pedirLiberacao(v, lib), prim: false };
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
      prazoC: dif < 120 && dec.resultado !== 'pronta' ? 'var(--perigo)' : 'var(--texto-apagado)',
      ini: F.iniciais(mot.nome),
      g1: mot.g1,
      g2: mot.g2,
      anel: tomR.c,
      motorista: mot.nome,
      tipo: v.tipo === 'propria' ? 'frota própria' : t.tipo === 'ETC' ? t.nome.replace(' Ltda', '') : 'TAC',
      produto: prod.nome,
      destino: dest.nome,
      ordem: v.ordem,
      placas: TX.placasDoConjunto(conj).join(' '),
      etapas,
      linkRot: le.n,
      linkC: ltom.c,
      linkDot: ltom.dot,
      linkHora: le.em ? F.hora(le.em) : l.enviadoEm ? F.hora(l.enviadoEm) : '',
      pulso: le.k === 'preenchendo' || le.k === 'aberto' ? 'pulso 1.6s infinite' : 'none',
      falta,
      faltaC,
      quem,
      temAcao: !!acao,
      acao: acao ? acao.n : '',
      acaoK: acao ? acao.k : '',
      onAcao: acao ? acao.fn : null,
      acaoBg: acao && acao.prim ? 'linear-gradient(135deg,var(--primario),var(--azul))' : 'var(--superficie-2)',
      acaoC: acao && acao.prim ? '#fff' : 'var(--texto)',
      acaoSh: acao && acao.prim ? '0 6px 14px rgba(18,118,112,.28)' : 'none',
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
    const filNome = todas ? 'todas as filiais' : 'filial ' + TX.filial(fil).nome;
    const base = {
      titulo: todas ? 'Hoje na empresa' : 'Hoje em ' + TX.filial(fil).nome,
      subtitulo:
        F.extenso(TX.HOJE).replace(/^./, (c) => c.toUpperCase()) +
        ', ' +
        (todas ? 'painel da qualidade com as ' + u.filiais.length + ' filiais' : 'mesa do afretador'),
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
          bg: on ? 'var(--primario-fraco)' : '#fff',
          dot: on ? 'var(--primario)' : 'var(--borda-forte)',
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
          nDia: TX.HOJE,
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
        }),
    };
    if (todas) return Object.assign(base, this.painelVals(u));
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
        dot: tm.dot,
        ring: tm.ring,
        aberto: !!abertos[k] && ls.length > 0,
        linhas: ls,
        toggleRot: ls.length ? (abertos[k] ? 'recolher' : 'mostrar') : '',
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
      ['falta', 'falta algo', U.tom('falta'), 'linear-gradient(90deg,#f4c15d,var(--aviso-2))'],
      ['bloq', 'bloqueadas', U.tom('bloqueio'), 'linear-gradient(90deg,#e46969,var(--perigo))'],
      ['pronta', 'prontas', U.tom('ok'), 'linear-gradient(90deg,#48c78e,var(--ok))'],
    ];
    const noLink = linhas.filter((l) => /preenchimento|aberto/.test(l.linkRot)).length;
    const tot = Math.max(1, linhas.length);
    return Object.assign(base, {
      temResumo: linhas.length > 0 && !q,
      resTotal: linhas.length,
      resTotalRot: linhas.length === 1 ? 'viagem hoje' : 'viagens hoje',
      resSeg: RES.map(([k, n, tm, bg]) => ({ w: (g(k).length / tot) * 100 + '%', bg })).filter((x) => x.w !== '0%'),
      resItens: RES.filter(([k]) => g(k).length).map(([k, n, tm]) => ({
        k,
        n: ' ' + n,
        q: g(k).length,
        dot: tm.dot,
        ring: tm.ring,
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

  painelVals(u) {
    const U = TX.ui,
      F = TX.fmt;
    const pr = TX.prontidao('todas');
    const pend = TX.pendenciasRegistro('todas');
    const venc = TX.vencimentos(60);
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
    const acima = fila.acima;
    const prazoDe = (v) => {
      if (v.data !== TX.HOJE) return { t: F.curta(v.data), c: 'var(--texto-apagado)' };
      const hm = TX.agoraHM();
      const dif = +v.janela.slice(0, 2) * 60 + +v.janela.slice(3, 5) - (+hm.slice(0, 2) * 60 + +hm.slice(3, 5));
      return {
        t: dif < 0 ? 'passou' : dif < 120 ? 'em ' + dif + ' min' : 'em ' + Math.round(dif / 60) + ' h',
        c: dif < 120 ? 'var(--perigo)' : 'var(--texto-apagado)',
      };
    };
    return {
      temFila: !!u.alcada,
      filaQ: fila.minhas.length,
      filaQD: fila.minhas.length ? 'inline-block' : 'none',
      filaSub: 'viagens bloqueadas que a sua alçada (' + alcN + ') libera, com o prazo de carregamento',
      filaVazia: fila.minhas.length === 0,
      fila: fila.minhas.map((x) => {
        const v = x.viagem,
          pz = prazoDe(v);
        return {
          id: v.id,
          href: '/viagem?id=' + v.id + '&liberar=1',
          janela: v.janela,
          prazo: pz.t,
          prazoC: pz.c,
          motorista: TX.pessoa(v.motorista).nome,
          ordem: v.ordem,
          filial: TX.filial(v.filial).nome,
          motivo: x.item.o,
          detalhe: x.item.detalhe,
          pedido: x.pedido
            ? 'pedida por ' + TX.usuario(x.pedido.por).nome.split(' ')[0] + ' às ' + F.hora(x.pedido.em)
            : 'sem pedido da filial',
          pedC: x.pedido ? '#b85a2e' : 'var(--texto-desab)',
          pedFw: x.pedido ? '700' : '500',
        };
      }),
      temAcima: acima.length > 0,
      acimaTxt:
        acima.length === 1
          ? 'A ' +
            acima[0].viagem.ordem +
            ' (' +
            TX.filial(acima[0].viagem.filial).nome +
            ', ' +
            acima[0].viagem.janela +
            ') também está bloqueada e espera ' +
            this.nomeAlcada(acima[0].alcada) +
            '.'
          : acima.length + ' viagens bloqueadas esperam alçada acima da sua.',
      acimaHref: acima.length ? '/viagem?id=' + acima[0].viagem.id : '#',
      acimaLink: acima.length === 1 ? 'Ver a viagem' : 'Ver a primeira',
      prPct: pr.pct + '%',
      prSub: pr.completas + ' de ' + pr.total + ' viagens asseguradas completas',
      heroNums: [
        {
          n: 'Viagens hoje',
          v: hojeTodas.length,
          sub: hojeTodas.filter((v) => TX.decidir(v).resultado !== 'pronta').length + ' com pendência',
        },
        { n: 'Protocolos gatekeeper', v: gk, sub: 'viagens com TAC ou ETC não certificada, 45 dias' },
        { n: 'Documentos a vencer', v: venc.length, sub: v15 + ' em até 15 dias' },
      ],
      cardsFilial: TX.db.filiais
        .filter((f) => u.filiais.includes(f.id))
        .map((f) => {
          const hj = TX.viagensDoDia(f.id).filter((v) => !v.cancelada);
          const pd = hj.filter((v) => TX.decidir(v).resultado !== 'pronta').length;
          const oc = f.comunicacaoOC;
          return {
            id: f.id,
            n: f.nome + ' ' + f.uf + (f.matriz ? ', matriz' : ''),
            reg: f.registro,
            hoje: hj.length,
            pend: pd,
            pendC: pd ? 'var(--aviso)' : 'var(--texto-sec)',
            oc: oc ? 'Gatekeeper comunicado ao OC em ' + F.curta(oc.data) : 'Gatekeeper não comunicado ao OC',
            ocC: oc ? 'var(--ok)' : 'var(--perigo)',
            ocDot: oc ? 'var(--ok)' : 'var(--perigo)',
            afretador: TX.usuario(f.afretador).nome,
            onClick: () => this.setFilial(f.id),
          };
        }),
      pendRegs: pend.map((p) => {
        const v = p.viagem;
        return {
          href: '/viagem?id=' + v.id,
          ordem: v.ordem,
          filial: TX.filial(v.filial).nome,
          data: F.curta(v.data),
          quem: TX.pessoa(v.motorista).nome + ', ' + TX.produto(v.produto).nome.toLowerCase(),
          itens: p.itens.map((i) => ({ n: i.n, c: i.leve ? '#b85a2e' : 'var(--aviso)', bd: i.leve ? '#f0d3bf' : 'var(--aviso-borda)' })),
        };
      }),
      semPend: pend.length === 0,
      vW1: Math.round((v15 / vt) * 100) + '%',
      vW2: Math.round((v30 / vt) * 100) + '%',
      vW3: Math.round((v60 / vt) * 100) + '%',
      v15,
      v30,
      v60,
      vencs: venc
        .slice(0, 6)
        .map((x) => ({
          t: x.tipo + ' ' + x.ref,
          dono: x.dono,
          href: x.href,
          d: x.estado === 'vencido' ? 'vencido' : x.dias + ' dias',
          c: x.dias <= 15 ? 'var(--perigo)' : x.dias <= 30 ? 'var(--aviso)' : 'var(--texto-sec)',
        })),
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

  novaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    if (!s.nova) return { novaAberta: false, fecharModal: () => {}, ctaBg: '', ctaC: '', ctaSh: '', ctaCur: '' };
    const fil = this.filialAtual() === 'todas' ? TX.sessao().filiais[0] : this.filialAtual();
    const filObj = TX.filial(fil);
    const p = s.nPasso || 1;
    const fechar = () => this.setState({ nova: false });
    const prod = s.nProd ? TX.produto(s.nProd) : null;
    const dest = s.nDest ? TX.destinatario(s.nDest) : null;
    const v1 =
      !!prod &&
      !!s.nEmb &&
      !!s.nDest &&
      /^\d{2}:\d{2}$/.test(s.nJanela || '') &&
      +(s.nPeso || 0) > 0 &&
      (s.nOrdem || '').trim().length >= 3;
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
    const cmOk = (s.cmNome || '').trim().length >= 5 && TX.soDigitos(s.cmTel).length >= 10 && placasCm.length >= 2;
    const terceiro = s.nTipo === 'terceiro';
    const selConj = terceiro
      ? s.nSel
        ? TX.conjunto((TX.transportador(s.nSel).conjuntos || [])[0])
        : null
      : s.nSel
        ? TX.conjunto(s.nSel)
        : null;
    const v2 = terceiro ? !!s.nSel || (achados.length === 0 && q.length >= 3 && cmOk) : !!s.nSel;
    const criar = () => {
      const d = {
        filial: fil,
        produto: s.nProd,
        peso: +String(s.nPeso).replace(',', '.'),
        embarcador: s.nEmb,
        destinatario: s.nDest,
        data: s.nDia,
        janela: s.nJanela,
        ordem: s.nOrdem.trim(),
        origemOrdem: s.nPdf ? 'pdf' : 'digitada',
      };
      if (!terceiro)
        Object.assign(d, { tipo: 'propria', transportador: 'propria', conjunto: s.nSel, motorista: TX.conjunto(s.nSel).motorista });
      else if (s.nSel) {
        const t = TX.transportador(s.nSel);
        Object.assign(d, { transportador: t.id, conjunto: t.conjuntos[0], motorista: t.tipo === 'TAC' ? t.pessoa : t.motoristas[0] });
      } else Object.assign(d, { novoTAC: { nome: s.cmNome.trim(), telefone: s.cmTel.trim(), cpf: s.cmCpf, placas: placasCm } });
      const id = TX.fazer('criarViagem', d);
      this.setState({ nPasso: 3, nCriada: id });
    };
    const c = U.cta(p === 1 ? v1 : p === 2 ? v2 : true);
    const criada = s.nCriada ? TX.viagem(s.nCriada) : null;
    const vals = {
      novaAberta: true,
      fecharModal: fechar,
      pararClique: (e) => e.stopPropagation(),
      nTitulo: p === 3 ? 'Viagem criada' : 'Nova viagem',
      nFilialNome: filObj.nome,
      nPassos: [
        ['Ordem', 1],
        ['Quem carrega', 2],
        ['Link', 3],
      ].map(([n, i]) => ({ n, bg: i <= p ? 'linear-gradient(90deg,var(--primario),var(--azul))' : 'var(--borda)', c: i <= p ? 'var(--primario-2)' : 'var(--texto-desab)' })),
      nP1: p === 1,
      nP2: p === 2,
      nP3: p === 3,
      pdfBd: s.nPdf ? 'var(--primario)' : 'var(--borda-forte)',
      pdfBg: s.nPdf ? 'var(--primario-fraco)' : '#fff',
      pdfTitulo: s.nPdf ? 'Ordem importada: ' + s.nPdf : 'Importar o PDF da ordem de carregamento',
      pdfSub: s.nPdf
        ? 'Produto, embarcador, destinatário, data e peso preenchidos. Confira abaixo.'
        : 'O caminho mais rápido: o TMS já gerou a ordem, não precisa digitar de novo.',
      onPdf: (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) this.preencherOrdem(f.name);
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
      nEmbs: TX.db.embarcadores.map((x) =>
        Object.assign({ n: x.nome, onClick: () => this.setState({ nEmb: x.id }) }, U.sel(s.nEmb === x.id)),
      ),
      nDests: TX.db.destinatarios.map((x) =>
        Object.assign({ n: x.nome, onClick: () => this.setState({ nDest: x.id }) }, U.sel(s.nDest === x.id)),
      ),
      nDias: [
        [TX.HOJE, 'hoje'],
        [TX.addDias(TX.HOJE, 1), 'amanhã'],
      ].map(([d, n]) => Object.assign({ n, onClick: () => this.setState({ nDia: d }) }, U.chip(s.nDia === d))),
      nJanela: s.nJanela,
      onJanela: (e) => this.setState({ nJanela: e.target.value }),
      nPeso: s.nPeso,
      onPeso: (e) => this.setState({ nPeso: e.target.value.replace(/[^0-9,.]/g, '') }),
      asTxt:
        assegura === null
          ? 'Escolha produto e destinatário: o sistema diz se a viagem leva a declaração GMP+.'
          : assegura
            ? 'Viagem assegurada GMP+: produto é ração e o destinatário é certificado.'
            : 'Sem declaração GMP+: ' + (prod.racao ? 'destinatário não certificado.' : prod.nome + ' não é ração.'),
      asBg: assegura === null ? 'var(--superficie)' : assegura ? 'var(--primario-fraco)' : '#fdf6ec',
      asC: assegura === null ? 'var(--texto-sec)' : assegura ? 'var(--primario-2)' : 'var(--aviso)',
      asDot: assegura === null ? 'var(--borda-forte)' : assegura ? 'var(--ok)' : 'var(--aviso-2)',
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
            g1: p0 ? p0.g1 : 'var(--primario-2)',
            g2: p0 ? p0.g2 : 'var(--azul)',
            placas: (t.conjuntos || []).map((c) => TX.placasDoConjunto(c).join(' ')).join('  /  '),
            docs: qual.ocorrencia
              ? 'em revisão após ocorrência grave: a Direção decide'
              : ruins
                ? qual.n + ': o motorista atualiza pelo link'
                : 'documentos em dia, dados voltam preenchidos',
            docC: qual.ocorrencia ? 'var(--perigo)' : ruins ? 'var(--aviso)' : 'var(--ok)',
            onClick: () => this.setState({ nSel: t.id }),
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
              subC: no ? 'var(--texto-sec)' : 'var(--perigo)',
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
      nDica:
        p === 1
          ? 'Produto, ordem, embarcador, destinatário, horário e peso.'
          : p === 2
            ? 'Placa ou CPF trazem o cadastro e os documentos de volta.'
            : '',
      nVoltar: p === 2,
      nVoltarFn: () => this.setState({ nPasso: 1 }),
      nAvancarRot: p === 1 ? 'Continuar' : p === 2 ? 'Criar viagem' : 'Copiar mensagem do link',
      nAvancar: () => {
        if (p === 1) {
          if (v1) this.setState({ nPasso: 2 });
          return;
        }
        if (p === 2) {
          if (v2) criar();
          return;
        }
        TX.ui.copiar(TX.mensagemLink(criada));
        TX.fazer('enviarLink', { id: criada.id, canal: 'copiado' });
        this.setState({ nova: false });
        this.avisar('Mensagem copiada. A ' + criada.ordem + ' está na mesa com o link enviado.');
      },
      ctaBg: c.bg,
      ctaC: c.c,
      ctaSh: c.sh,
      ctaCur: c.cur,
    };
    return vals;
  }
  preencherOrdem(nome) {
    const fil = this.filialAtual() === 'todas' ? TX.sessao().filiais[0] : this.filialAtual();
    const emb = { SOR: 'em-agrosorriso', RON: 'em-planalto', RVD: 'em-granosrv', PNG: 'em-litoral' }[fil];
    this.setState({
      nPdf: nome,
      nProd: 'farelo-soja',
      nProdBusca: 'Farelo de soja',
      nOrdem: 'OC ' + (48140 + TX.db.viagens.length - 30),
      nEmb: emb,
      nDest: 'de-nutrimax',
      nDia: TX.HOJE,
      nJanela: '18:30',
      nPeso: '37',
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Hoje" data-tela="Hoje">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '20px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>{v.titulo}</div>
              <div style={{ fontSize: '13.5px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.subtitulo}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  background: 'var(--painel)',
                  border: '1px solid var(--borda-campo)',
                  borderRadius: '11px',
                  padding: '0 14px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#7c8f8d" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="7" cy="7" r="4.6"></circle>
                  <line x1="10.5" y1="10.5" x2="13.5" y2="13.5"></line>
                </svg>
                <input
                  value={v.busca ?? ''}
                  onChange={v.onBusca}
                  data-tx-busca=""
                  placeholder="Filtrar esta mesa"
                  title="Filtra só as viagens desta mesa: placa, ordem ou motorista"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13.5px',
                    padding: '10px 0',
                    width: '210px',
                  }}
                />
              </div>
              {v.temFiliais ? (
                <>
                  <div data-tx-pop="" style={{ position: 'relative' }}>
                    <div
                      onClick={v.onFilial}
                      data-tx-filial=""
                      style={{
                        background: 'var(--painel)',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '11px',
                        padding: '9px 14px',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                      className="tx-h30bbaa9"
                    >
                      {v.filialRot}
                      {' ▾'}
                    </div>
                    {v.filialOpen ? (
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            right: '0',
                            top: '46px',
                            background: 'var(--painel)',
                            border: '1px solid var(--borda)',
                            borderRadius: '14px',
                            boxShadow: '0 16px 40px rgba(9,61,68,.16)',
                            padding: '6px',
                            width: '250px',
                            zIndex: '60',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {(Array.isArray(v.filiais) ? v.filiais : []).map((fl, $index) => (
                            <Fragment key={$index}>
                              <div
                                onClick={fl?.onClick}
                                data-tx-filial-op={fl?.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '9px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  padding: '9px 12px',
                                  borderRadius: '9px',
                                  cursor: 'pointer',
                                  background: fl?.bg,
                                }}
                                className="tx-h894fca3"
                              >
                                <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: fl?.dot }}></span>
                                <span style={{ flex: '1' }}>{fl?.n}</span>
                                <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '11.5px', color: 'var(--texto-apagado)' }}>
                                  {fl?.q}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              <span
                onClick={v.abrirNova}
                data-tx-nova-viagem=""
                style={{
                  background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                  color: '#fff',
                  borderRadius: '99px',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                }}
                className="tx-h0882f37"
              >
                Nova viagem
              </span>
            </div>
          </div>
          {v.loading ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(Array.isArray(v.skel) ? v.skel : []).map((sk, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        height: '74px',
                        borderRadius: '20px',
                        background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                        backgroundSize: '600px 100%',
                        animation: 'txsh 1.3s linear infinite',
                      }}
                    ></div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {v.modoMesa ? (
            <>
              {v.temResumo ? (
                <>
                  <div
                    data-tx-resumo=""
                    style={{
                      background: 'var(--painel)',
                      border: '1px solid var(--borda)',
                      borderRadius: '18px',
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '22px',
                    }}
                  >
                    <div style={{ flex: 'none' }}>
                      <span style={{ fontSize: '22px', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>{v.resTotal}</span>
                      <span style={{ fontSize: '13px', color: 'var(--texto-sec)', marginLeft: '6px' }}>{v.resTotalRot}</span>
                    </div>
                    <div
                      style={{
                        flex: '1',
                        minWidth: '140px',
                        height: '10px',
                        borderRadius: '99px',
                        overflow: 'hidden',
                        display: 'flex',
                        gap: '3px',
                        background: 'repeating-linear-gradient(-45deg,var(--superficie-2) 0 5px,#e4ebe9 5px 10px)',
                      }}
                    >
                      {(Array.isArray(v.resSeg) ? v.resSeg : []).map((sg, $index) => (
                        <Fragment key={$index}>
                          <div style={{ width: sg?.w, background: sg?.bg, borderRadius: '99px' }}></div>
                        </Fragment>
                      ))}
                    </div>
                    {(Array.isArray(v.resItens) ? v.resItens : []).map((ri, $index) => (
                      <Fragment key={$index}>
                        <span
                          onClick={ri?.onClick}
                          data-tx-ir-grupo={ri?.k}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: 'var(--texto-2)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                          className="tx-h76d8d79"
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '99px',
                              background: ri?.dot,
                              boxShadow: `0 0 0 3px ${ri?.ring ?? ''}`,
                            }}
                          ></span>
                          <b style={{ fontVariantNumeric: 'tabular-nums' }}>{ri?.q}</b>
                          {ri?.n}
                        </span>
                      </Fragment>
                    ))}
                    {v.temNoLink ? (
                      <>
                        <span
                          title="abriram o link e ainda não terminaram"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            color: 'var(--azul)',
                            whiteSpace: 'nowrap',
                            paddingLeft: '18px',
                            borderLeft: '1px solid var(--borda-suave)',
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '99px',
                              background: 'var(--azul)',
                              animation: 'pulso 1.6s infinite',
                            }}
                          ></span>
                          {v.noLinkRot}
                        </span>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.mesaVazia ? (
                <>
                  <div
                    style={{
                      background: 'var(--painel)',
                      border: '1px solid var(--borda)',
                      borderRadius: '20px',
                      padding: '50px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '99px',
                        background: 'linear-gradient(135deg,#48c78e,var(--primario))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 8.5 6.5 12 13 4.5"></path>
                      </svg>
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.vazioTitulo}</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--texto-sec)' }}>{v.vazioSub}</div>
                  </div>
                </>
              ) : null}
              {(Array.isArray(v.grupos) ? v.grupos : []).map((gr, $index) => (
                <Fragment key={$index}>
                  <div id={gr?.ancora} style={{ display: 'flex', flexDirection: 'column', gap: '10px', scrollMarginTop: '16px' }}>
                    <div
                      onClick={gr?.toggle}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 4px 0', cursor: 'pointer' }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '99px',
                          background: gr?.dot,
                          boxShadow: `0 0 0 3px ${gr?.ring ?? ''}`,
                        }}
                      ></span>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>{gr?.n}</div>
                      <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600', color: 'var(--texto-sec)' }}>
                        {gr?.q}
                      </span>
                      <div style={{ fontSize: '12.5px', color: 'var(--texto-apagado)' }}>{gr?.sub}</div>
                      <span style={{ marginLeft: 'auto', fontSize: '12.5px', fontWeight: '700', color: 'var(--primario-2)' }}>{gr?.toggleRot}</span>
                    </div>
                    {gr?.aberto ? (
                      <>
                        {(Array.isArray(gr?.linhas) ? gr?.linhas : []).map((ln, $index) => (
                          <Fragment key={$index}>
                            <div
                              data-tx-linha={ln?.id}
                              style={{
                                background: 'var(--painel)',
                                border: '1px solid var(--borda-suave)',
                                borderRadius: '18px',
                                boxShadow: '0 2px 10px rgba(9,61,68,.04)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '13px 18px',
                                transition: 'box-shadow .2s',
                              }}
                              className="tx-hbfbd724"
                            >
                              <A
                                href={ln?.href}
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1', minWidth: '0', color: 'inherit' }}
                              >
                                <div style={{ width: '62px', flex: 'none', textAlign: 'center' }}>
                                  <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '17px', fontWeight: '600' }}>
                                    {ln?.janela}
                                  </div>
                                  <div style={{ fontSize: '10.5px', color: ln?.prazoC, fontWeight: '700' }}>{ln?.prazo}</div>
                                </div>
                                <span
                                  style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '99px',
                                    flex: 'none',
                                    background: `linear-gradient(135deg,${ln?.g1 ?? ''},${ln?.g2 ?? ''})`,
                                    color: '#fff',
                                    fontSize: '13.5px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 0 0 3px #fff,0 0 0 4.5px ${ln?.anel ?? ''}`,
                                  }}
                                >
                                  {ln?.ini}
                                </span>
                                <div style={{ minWidth: '0', width: '270px', flex: 'none' }}>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                                    <span
                                      style={{
                                        fontSize: '14.5px',
                                        fontWeight: '800',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {ln?.motorista}
                                    </span>
                                    <span style={{ fontSize: '11.5px', color: 'var(--texto-apagado)', whiteSpace: 'nowrap' }}>{ln?.tipo}</span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '12.5px',
                                      color: 'var(--texto-sec)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {ln?.produto}
                                    {' para '}
                                    {ln?.destino}
                                  </div>
                                  <div
                                    style={{
                                      fontFamily: "'Spline Sans Mono',monospace",
                                      fontSize: '11.5px',
                                      color: 'var(--texto-2)',
                                      marginTop: '2px',
                                    }}
                                  >
                                    {ln?.ordem} {ln?.placas}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '250px', flex: 'none' }}>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    {(Array.isArray(ln?.etapas) ? ln?.etapas : []).map((et, $index) => (
                                      <Fragment key={$index}>
                                        <span
                                          title={et?.tip}
                                          style={{ flex: '1', height: '6px', borderRadius: '99px', background: et?.bg }}
                                        ></span>
                                      </Fragment>
                                    ))}
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '7px',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                      color: ln?.linkC,
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '99px',
                                        background: ln?.linkDot,
                                        animation: ln?.pulso,
                                      }}
                                    ></span>
                                    {ln?.linkRot}
                                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontWeight: '500', color: 'var(--texto-apagado)' }}>
                                      {ln?.linkHora}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ flex: '1', minWidth: '0' }}>
                                  <div
                                    style={{
                                      fontSize: '13px',
                                      fontWeight: '700',
                                      color: ln?.faltaC,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {ln?.falta}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '11.5px',
                                      color: 'var(--texto-apagado)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {ln?.quem}
                                  </div>
                                </div>
                              </A>
                              {ln?.temAcao ? (
                                <>
                                  <span
                                    onClick={ln?.onAcao}
                                    data-tx-acao-linha={ln?.acaoK}
                                    style={{
                                      background: ln?.acaoBg,
                                      color: ln?.acaoC,
                                      boxShadow: ln?.acaoSh,
                                      fontSize: '12.5px',
                                      fontWeight: '800',
                                      borderRadius: '99px',
                                      padding: '8px 16px',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flex: 'none',
                                    }}
                                    className="tx-h0882f37"
                                  >
                                    {ln?.acao}
                                  </span>
                                </>
                              ) : null}
                            </div>
                          </Fragment>
                        ))}
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </>
          ) : null}
          {v.modoPainel ? (
            <>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '22px',
                  background: 'linear-gradient(115deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)',
                  color: '#fff',
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                  gap: '26px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: '-60px',
                    top: '-120px',
                    width: '340px',
                    height: '340px',
                    borderRadius: '99px',
                    background: 'radial-gradient(circle,rgba(255,255,255,.14),transparent 65%)',
                  }}
                ></div>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.4px', color: 'rgba(255,255,255,.6)' }}>
                    PRONTIDÃO PARA AUDITORIA, ÚLTIMOS 45 DIAS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                    <span style={{ fontSize: '40px', fontWeight: '800' }}>{v.prPct}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.75)' }}>{v.prSub}</span>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      overflow: 'hidden',
                      background: 'repeating-linear-gradient(-45deg,rgba(255,255,255,.08) 0 5px,rgba(255,255,255,.15) 5px 10px)',
                    }}
                  >
                    <div style={{ height: '100%', width: v.prPct, background: 'linear-gradient(90deg,#48c78e,#9fe0c3)' }}></div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.6)', marginTop: '7px' }}>
                    viagem completa = T-3, verificação aprovada, termo quando gatekeeper e CT-e conciliado
                  </div>
                </div>
                {(Array.isArray(v.heroNums) ? v.heroNums : []).map((hn, $index) => (
                  <Fragment key={$index}>
                    <div style={{ position: 'relative', borderLeft: '1px solid rgba(255,255,255,.14)', paddingLeft: '22px' }}>
                      <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.7)' }}>{hn?.n}</div>
                      <div style={{ fontSize: '30px', fontWeight: '800', marginTop: '4px' }}>{hn?.v}</div>
                      <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.55)' }}>{hn?.sub}</div>
                    </div>
                  </Fragment>
                ))}
              </div>
              {v.temFila ? (
                <>
                  <div
                    data-tx-fila=""
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '18px 22px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800' }}>Esperando sua assinatura</div>
                      <span
                        style={{
                          display: v.filaQD,
                          fontFamily: "'Spline Sans Mono',monospace",
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#b85a2e',
                          border: '1px solid #f0d3bf',
                          borderRadius: '99px',
                          padding: '1px 9px',
                        }}
                      >
                        {v.filaQ}
                      </span>
                      <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)' }}>{v.filaSub}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                      {(Array.isArray(v.fila) ? v.fila : []).map((fq, $index) => (
                        <Fragment key={$index}>
                          <div
                            data-tx-fila-linha={fq?.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '11px 0',
                              borderBottom: '1px solid var(--superficie-2)',
                            }}
                          >
                            <div style={{ width: '58px', flex: 'none' }}>
                              <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '15px', fontWeight: '600' }}>
                                {fq?.janela}
                              </div>
                              <div style={{ fontSize: '10.5px', fontWeight: '700', color: fq?.prazoC }}>{fq?.prazo}</div>
                            </div>
                            <div style={{ width: '230px', flex: 'none', minWidth: '0' }}>
                              <div
                                style={{
                                  fontSize: '13.5px',
                                  fontWeight: '800',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {fq?.motorista}
                              </div>
                              <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '11.5px', color: 'var(--texto-sec)' }}>
                                {fq?.ordem}
                                {', '}
                                {fq?.filial}
                              </div>
                            </div>
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: 'var(--perigo)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {fq?.motivo}
                              </div>
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  color: 'var(--texto-apagado)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {fq?.detalhe}
                              </div>
                            </div>
                            <div style={{ width: '190px', flex: 'none', fontSize: '12px', fontWeight: fq?.pedFw, color: fq?.pedC }}>
                              {fq?.pedido}
                            </div>
                            <A
                              href={fq?.href}
                              data-tx-assinar={fq?.id}
                              style={{
                                flex: 'none',
                                background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                                color: '#fff',
                                fontSize: '12.5px',
                                fontWeight: '800',
                                borderRadius: '99px',
                                padding: '8px 16px',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 6px 14px rgba(18,118,112,.25)',
                              }}
                              className="tx-h0e7da8b"
                            >
                              Analisar e assinar
                            </A>
                          </div>
                        </Fragment>
                      ))}
                      {v.filaVazia ? (
                        <>
                          <div style={{ fontSize: '13px', color: 'var(--texto-sec)', padding: '12px 0 4px' }}>
                            Nada esperando a sua assinatura. Viagem bloqueada por regra que a sua alçada libera aparece aqui, com o prazo de
                            carregamento.
                          </div>
                        </>
                      ) : null}
                      {v.temAcima ? (
                        <>
                          <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', paddingTop: '10px' }}>
                            {v.acimaTxt}{' '}
                            <A href={v.acimaHref} style={{ fontWeight: '800' }}>
                              {v.acimaLink}
                              {' →'}
                            </A>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                {(Array.isArray(v.cardsFilial) ? v.cardsFilial : []).map((cf, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        background: 'var(--painel)',
                        border: '1px solid var(--borda)',
                        borderRadius: '18px',
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800' }}>{cf?.n}</div>
                        <span style={{ fontSize: '11px', color: 'var(--texto-apagado)', fontFamily: "'Spline Sans Mono',monospace" }}>{cf?.reg}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px' }}>
                        <span>
                          <b style={{ fontSize: '18px' }}>{cf?.hoje}</b> hoje
                        </span>
                        <span style={{ color: cf?.pendC }}>
                          <b style={{ fontSize: '18px' }}>{cf?.pend}</b> com pendência
                        </span>
                      </div>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: cf?.ocC, fontWeight: '700' }}
                      >
                        <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: cf?.ocDot }}></span>
                        {cf?.oc}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>
                        {'afretador: '}
                        {cf?.afretador}
                      </div>
                      <span
                        onClick={cf?.onClick}
                        data-tx-abrir-mesa={cf?.id}
                        style={{
                          marginTop: '2px',
                          alignSelf: 'flex-start',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          color: 'var(--primario-2)',
                          cursor: 'pointer',
                        }}
                        className="tx-h76d8d79"
                      >
                        Abrir a mesa da filial →
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(320px,400px)', gap: '20px', alignItems: 'start' }}>
                <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>Pendências de registro</div>
                    <A
                      href="/viagens?conciliar=1"
                      style={{ marginLeft: 'auto', fontSize: '12.5px', fontWeight: '800', whiteSpace: 'nowrap' }}
                    >
                      Conciliar CT-e em lote →
                    </A>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                    Viagens asseguradas já carregadas com item faltando. Quem trata é a qualidade.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                    {(Array.isArray(v.pendRegs) ? v.pendRegs : []).map((pr, $index) => (
                      <Fragment key={$index}>
                        <A
                          href={pr?.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '11px 4px',
                            borderBottom: '1px solid var(--superficie-2)',
                            color: 'inherit',
                          }}
                          className="tx-hc05ca3a"
                        >
                          <span
                            style={{
                              fontFamily: "'Spline Sans Mono',monospace",
                              fontSize: '12.5px',
                              fontWeight: '600',
                              width: '84px',
                              flex: 'none',
                            }}
                          >
                            {pr?.ordem}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--texto-sec)', width: '90px', flex: 'none' }}>
                            {pr?.filial}
                            {', '}
                            {pr?.data}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              flex: '1',
                              minWidth: '0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {pr?.quem}
                          </span>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            {(Array.isArray(pr?.itens) ? pr?.itens : []).map((pi, $index) => (
                              <Fragment key={$index}>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: pi?.c,
                                    border: `1px solid ${pi?.bd ?? ''}`,
                                    borderRadius: '99px',
                                    padding: '2px 9px',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {pi?.n}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </A>
                      </Fragment>
                    ))}
                    {v.semPend ? (
                      <>
                        <div style={{ fontSize: '13px', color: 'var(--texto-sec)', padding: '16px 4px' }}>
                          Nenhuma pendência de registro no período. Tudo pronto para a amostra.
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '15.5px', fontWeight: '800' }}>Vencimentos</div>
                      <A href="/transportadores?filtro=vencendo" style={{ marginLeft: 'auto', fontSize: '12.5px', fontWeight: '800' }}>
                        Ver todos →
                      </A>
                    </div>
                    <div
                      style={{
                        marginTop: '14px',
                        height: '12px',
                        borderRadius: '99px',
                        overflow: 'hidden',
                        display: 'flex',
                        background: 'repeating-linear-gradient(-45deg,var(--superficie-2) 0 5px,#e4ebe9 5px 10px)',
                      }}
                    >
                      <div style={{ width: v.vW1, background: 'linear-gradient(90deg,#e46969,var(--perigo))' }}></div>
                      <div style={{ width: v.vW2, background: 'linear-gradient(90deg,#f4c15d,var(--aviso-2))' }}></div>
                      <div style={{ width: v.vW3, background: 'linear-gradient(90deg,#9fc9c6,#6ba8a4)' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', marginTop: '9px', fontSize: '12px', color: 'var(--texto-sec)', fontWeight: '600' }}>
                      <span>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '3px',
                            background: 'var(--perigo)',
                            marginRight: '5px',
                          }}
                        ></span>
                        {v.v15}
                        {' até 15 dias'}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '3px',
                            background: 'var(--aviso-2)',
                            marginRight: '5px',
                          }}
                        ></span>
                        {v.v30}
                        {' até 30'}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '3px',
                            background: '#6ba8a4',
                            marginRight: '5px',
                          }}
                        ></span>
                        {v.v60}
                        {' até 60'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                      {(Array.isArray(v.vencs) ? v.vencs : []).map((vc, $index) => (
                        <Fragment key={$index}>
                          <A
                            href={vc?.href}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '9px 2px',
                              borderBottom: '1px solid var(--superficie-2)',
                              color: 'inherit',
                            }}
                            className="tx-hc05ca3a"
                          >
                            <div style={{ minWidth: '0', flex: '1' }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {vc?.t}
                              </div>
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  color: 'var(--texto-sec)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {vc?.dono}
                              </div>
                            </div>
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: vc?.c,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: vc?.c }}></span>
                              {vc?.d}
                            </span>
                          </A>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ fontSize: '15.5px', fontWeight: '800' }}>Auditoria</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.5' }}>{v.simTxt}</div>{' '}
                    <A href="/auditoria" style={{ display: 'inline-block', marginTop: '10px', fontSize: '12.5px', fontWeight: '800' }}>
                      Rastrear placa ou montar amostra →
                    </A>{' '}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {v.novaAberta ? (
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
                padding: '28px',
              }}
            >
              <div
                onClick={v.pararClique}
                data-tx-modal="nova"
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: '700px',
                  maxHeight: '92vh',
                  overflow: 'auto',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800' }}>{v.nTitulo}</div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--texto-sec)' }}>
                    {'filial '}
                    {v.nFilialNome}
                  </span>
                  <span
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
                  >
                    ✕
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                  {(Array.isArray(v.nPassos) ? v.nPassos : []).map((np, $index) => (
                    <Fragment key={$index}>
                      <div style={{ flex: '1' }}>
                        <div style={{ height: '4px', borderRadius: '99px', background: np?.bg }}></div>
                        <div style={{ fontSize: '11.5px', fontWeight: '700', color: np?.c, marginTop: '5px' }}>{np?.n}</div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                {v.nP1 ? (
                  <>
                    <label
                      data-tx-importar-pdf=""
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        border: `1.5px dashed ${v.pdfBd ?? ''}`,
                        background: v.pdfBg,
                        borderRadius: '16px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="file" accept=".pdf" onChange={v.onPdf} style={{ display: 'none' }} />
                      <span
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 2H4.5A1.5 1.5 0 0 0 3 3.5v9A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V6z"></path>
                          <path d="M9 2v4h4"></path>
                        </svg>
                      </span>
                      <div style={{ flex: '1' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>{v.pdfTitulo}</div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{v.pdfSub}</div>
                      </div>
                      <span
                        onClick={v.usarOrdemExemplo}
                        data-tx-ordem-exemplo=""
                        style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', whiteSpace: 'nowrap' }}
                      >
                        usar ordem de exemplo
                      </span>
                    </label>
                    <div style={{ fontSize: '11.5px', color: 'var(--texto-apagado)', marginTop: '8px' }}>ou preencha o mínimo:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Produto</div>
                        <input
                          value={v.nProdBusca ?? ''}
                          onChange={v.onProdBusca}
                          data-tx-campo="produto"
                          placeholder="farelo, milho, casquinha…"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            fontSize: '13.5px',
                            outline: 'none',
                          }}
                        />
                        {v.nProdLista ? (
                          <>
                            <div
                              style={{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                top: '66px',
                                background: 'var(--painel)',
                                border: '1px solid var(--borda)',
                                borderRadius: '12px',
                                boxShadow: '0 14px 30px rgba(9,61,68,.14)',
                                padding: '5px',
                                zIndex: '5',
                              }}
                            >
                              {(Array.isArray(v.nProdOps) ? v.nProdOps : []).map((po, $index) => (
                                <Fragment key={$index}>
                                  <div
                                    onClick={po?.onClick}
                                    data-tx-produto-op={po?.id}
                                    style={{ padding: '7px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                                    className="tx-h894fca3"
                                  >
                                    <b>{po?.n}</b> <span style={{ color: 'var(--texto-apagado)', fontSize: '11.5px' }}>{po?.via}</span>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Ordem de carregamento</div>
                        <input
                          value={v.nOrdem ?? ''}
                          onChange={v.onOrdem}
                          data-tx-campo="ordem"
                          placeholder="OC 48140"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            fontSize: '13.5px',
                            outline: 'none',
                            fontFamily: "'Spline Sans Mono',monospace",
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Embarcador</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {(Array.isArray(v.nEmbs) ? v.nEmbs : []).map((ne, $index) => (
                            <Fragment key={$index}>
                              <span
                                onClick={ne?.onClick}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '5px 11px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${ne?.bd ?? ''}`,
                                  background: ne?.bg,
                                  color: ne?.c,
                                }}
                              >
                                {ne?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Destinatário</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {(Array.isArray(v.nDests) ? v.nDests : []).map((nd, $index) => (
                            <Fragment key={$index}>
                              <span
                                onClick={nd?.onClick}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '5px 11px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${nd?.bd ?? ''}`,
                                  background: nd?.bg,
                                  color: nd?.c,
                                }}
                              >
                                {nd?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Carregamento</div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                          {(Array.isArray(v.nDias) ? v.nDias : []).map((nx, $index) => (
                            <Fragment key={$index}>
                              <span
                                onClick={nx?.onClick}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '5px 11px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${nx?.bd ?? ''}`,
                                  background: nx?.bg,
                                  color: nx?.c,
                                }}
                              >
                                {nx?.n}
                              </span>
                            </Fragment>
                          ))}
                          <input
                            value={v.nJanela ?? ''}
                            onChange={v.onJanela}
                            data-tx-campo="janela"
                            style={{
                              width: '76px',
                              border: '1px solid var(--borda-campo)',
                              borderRadius: '11px',
                              padding: '6px 10px',
                              fontSize: '13px',
                              outline: 'none',
                              fontFamily: "'Spline Sans Mono',monospace",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Peso (t)</div>
                        <input
                          value={v.nPeso ?? ''}
                          onChange={v.onPeso}
                          data-tx-campo="peso"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            fontSize: '13.5px',
                            outline: 'none',
                            fontFamily: "'Spline Sans Mono',monospace",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        borderRadius: '12px',
                        padding: '10px 13px',
                        background: v.asBg,
                        fontSize: '12.5px',
                        color: v.asC,
                        fontWeight: '700',
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: v.asDot }}></span>
                      {v.asTxt}
                    </div>
                  </>
                ) : null}
                {v.nP2 ? (
                  <>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                      {(Array.isArray(v.nTipos) ? v.nTipos : []).map((nt, $index) => (
                        <Fragment key={$index}>
                          <span
                            onClick={nt?.onClick}
                            data-tx-tipo={nt?.k}
                            style={{
                              fontSize: '12.5px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${nt?.bd ?? ''}`,
                              background: nt?.bg,
                              color: nt?.c,
                            }}
                          >
                            {nt?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    {v.nTerceiro ? (
                      <>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '14px' }}>
                          PLACA DO CAVALO OU CPF DO MOTORISTA
                        </div>
                        <input
                          value={v.nQuem ?? ''}
                          onChange={v.onQuem}
                          data-tx-campo="quem"
                          placeholder="Ex.: RCB 9M15 ou 633.081.277-19"
                          style={{
                            width: '100%',
                            marginTop: '6px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: "'Spline Sans Mono',monospace",
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                          {(Array.isArray(v.nAchados) ? v.nAchados : []).map((na, $index) => (
                            <Fragment key={$index}>
                              <div
                                onClick={na?.onClick}
                                data-tx-achado={na?.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  border: `1.5px solid ${na?.bd ?? ''}`,
                                  background: na?.bg,
                                  borderRadius: '14px',
                                  padding: '10px 13px',
                                  cursor: 'pointer',
                                }}
                              >
                                <span
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '99px',
                                    border: `2px solid ${na?.dotBd ?? ''}`,
                                    background: na?.dot,
                                    flex: 'none',
                                  }}
                                ></span>
                                <span
                                  style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '99px',
                                    background: `linear-gradient(135deg,${na?.g1 ?? ''},${na?.g2 ?? ''})`,
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 'none',
                                  }}
                                >
                                  {na?.ini}
                                </span>
                                <div style={{ flex: '1', minWidth: '0' }}>
                                  <div style={{ fontSize: '13.5px', fontWeight: '800' }}>{na?.nome}</div>
                                  <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '11.5px', color: 'var(--texto-2)' }}>
                                    {na?.placas}
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: na?.docC, marginTop: '1px' }}>{na?.docs}</div>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                          {v.nNaoAchou ? (
                            <>
                              <div style={{ border: '1.5px dashed var(--borda-forte)', borderRadius: '14px', padding: '12px 14px' }}>
                                <div style={{ fontSize: '13px', fontWeight: '800' }}>Não encontrado na base. Cadastro mínimo:</div>
                                <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                                  O resto (CNH, RNTRC, CRLV) o motorista manda pelo link.
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                  <input
                                    value={v.cmNome ?? ''}
                                    onChange={v.onCmNome}
                                    data-tx-campo="cm-nome"
                                    placeholder="Nome do motorista"
                                    style={{
                                      border: '1px solid var(--borda-campo)',
                                      borderRadius: '11px',
                                      padding: '9px 12px',
                                      fontSize: '13.5px',
                                      outline: 'none',
                                    }}
                                  />
                                  <input
                                    value={v.cmTel ?? ''}
                                    onChange={v.onCmTel}
                                    data-tx-campo="cm-tel"
                                    placeholder="(66) 99999-0000"
                                    style={{
                                      border: '1px solid var(--borda-campo)',
                                      borderRadius: '11px',
                                      padding: '9px 12px',
                                      fontSize: '13.5px',
                                      outline: 'none',
                                    }}
                                  />
                                  <input
                                    value={v.cmCpf ?? ''}
                                    onChange={v.onCmCpf}
                                    data-tx-campo="cm-cpf"
                                    placeholder="CPF"
                                    style={{
                                      border: '1px solid var(--borda-campo)',
                                      borderRadius: '11px',
                                      padding: '9px 12px',
                                      fontSize: '13.5px',
                                      outline: 'none',
                                      fontFamily: "'Spline Sans Mono',monospace",
                                    }}
                                  />
                                  <input
                                    value={v.cmPlacas ?? ''}
                                    onChange={v.onCmPlacas}
                                    data-tx-campo="cm-placas"
                                    placeholder="Placas: cavalo, carreta 1, carreta 2"
                                    style={{
                                      border: '1px solid var(--borda-campo)',
                                      borderRadius: '11px',
                                      padding: '9px 12px',
                                      fontSize: '13.5px',
                                      outline: 'none',
                                      fontFamily: "'Spline Sans Mono',monospace",
                                    }}
                                  />
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                    {v.nPropria ? (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
                          {(Array.isArray(v.nConjs) ? v.nConjs : []).map((nc, $index) => (
                            <Fragment key={$index}>
                              <div
                                onClick={nc?.onClick}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  border: `1.5px solid ${nc?.bd ?? ''}`,
                                  background: nc?.bg,
                                  borderRadius: '14px',
                                  padding: '10px 13px',
                                  cursor: nc?.cur,
                                  opacity: nc?.op,
                                }}
                              >
                                <span
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '99px',
                                    border: `2px solid ${nc?.dotBd ?? ''}`,
                                    background: nc?.dot,
                                    flex: 'none',
                                  }}
                                ></span>
                                <div style={{ flex: '1' }}>
                                  <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>
                                    {nc?.placas}
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: nc?.subC }}>{nc?.sub}</div>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}
                {v.nP3 ? (
                  <>
                    <div
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'var(--primario-fraco)',
                        borderRadius: '16px',
                        padding: '14px 16px',
                      }}
                    >
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '99px',
                          background: 'linear-gradient(135deg,#48c78e,var(--ok))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
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
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>{v.nCriadaTxt}</div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-2)' }}>
                          Agora mande o link: o motorista informa as cargas, as fotos e assina pelo celular.
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', background: '#e7f1ec', borderRadius: '16px', padding: '14px' }}>
                      <div
                        style={{
                          background: 'var(--painel)',
                          borderRadius: '4px 14px 14px 14px',
                          padding: '11px 13px',
                          fontSize: '13px',
                          lineHeight: '1.5',
                        }}
                      >
                        {v.nMensagem}
                      </div>
                    </div>
                  </>
                ) : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '18px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginRight: 'auto' }}>{v.nDica}</span>
                  {v.nVoltar ? (
                    <>
                      <span
                        onClick={v.nVoltarFn}
                        style={{
                          background: 'var(--superficie-2)',
                          fontSize: '13.5px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        Voltar
                      </span>
                    </>
                  ) : null}
                  {v.nP3 ? (
                    <>
                      <A
                        href={v.nHref}
                        style={{
                          background: 'var(--superficie-2)',
                          color: 'var(--texto)',
                          fontSize: '13.5px',
                          fontWeight: '700',
                          borderRadius: '99px',
                          padding: '10px 20px',
                        }}
                      >
                        Abrir viagem
                      </A>
                    </>
                  ) : null}
                  <span
                    onClick={v.nAvancar}
                    data-tx-confirmar=""
                    style={{
                      background: v.ctaBg,
                      color: v.ctaC,
                      boxShadow: v.ctaSh,
                      cursor: v.ctaCur,
                      fontSize: '13.5px',
                      fontWeight: '800',
                      borderRadius: '99px',
                      padding: '10px 22px',
                    }}
                  >
                    {v.nAvancarRot}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}
