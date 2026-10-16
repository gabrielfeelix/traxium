// Gerado de "SaaS moderno estilo Dribbble/Link da Viagem.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class LinkDaViagem extends Tela {
  state = { passo: null, cpfIn: '', t3: null, itens: {}, fotos: {}, cartao: 0, pontos: [], desenhando: false, offline: false, fila: [] };
  componentDidMount() {
    TX.ui.montar(this, { semCarregar: true });
    const v = this.v();
    if (v.link.enviadoEm && !v.link.abertoEm) TX.fazer('linkAberto', { id: v.id, porMotorista: true });
    try {
      const f = JSON.parse(localStorage.getItem('tx-v2-fila-' + v.id) || '[]');
      if (f.length) this.setState({ fila: f, offline: true });
    } catch (e) {}
    window.addEventListener('online', () => this.setOffline(false));
    window.addEventListener('offline', () => this.setOffline(true));
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  v() {
    const p = TX.ui.param('id');
    return TX.viagem(p && TX.viagem(p) ? p : 'VG-3122');
  }
  // Grava a operação; sem sinal, guarda no aparelho e envia quando voltar.
  enviar(tipo, dados) {
    const d = Object.assign({ id: this.v().id, porMotorista: true }, dados);
    if (this.state.offline) {
      const fila = this.state.fila.concat([{ tipo, dados: d }]);
      try {
        localStorage.setItem('tx-v2-fila-' + d.id, JSON.stringify(fila));
      } catch (e) {}
      this.setState({ fila });
      return;
    }
    TX.fazer(tipo, d);
  }
  setOffline(off) {
    if (!off && this.state.fila.length) {
      const n = this.state.fila.length;
      this.state.fila.forEach((o) => {
        try {
          TX.fazer(o.tipo, o.dados);
        } catch (e) {}
      });
      try {
        localStorage.removeItem('tx-v2-fila-' + this.v().id);
      } catch (e) {}
      this.setState({ offline: false, fila: [] });
      this.avisar('Sinal de volta: ' + n + (n === 1 ? ' etapa enviada' : ' etapas enviadas') + ' à filial.');
      return;
    }
    this.setState({ offline: off });
  }
  passos(v, dec) {
    const ps = ['capa', 'id'];
    const docs = this.docsFaltando(v);
    if (docs.length || (v.link.docsEm && this.state.passo === 'docs')) ps.push('docs');
    if (v.tipo !== 'propria') ps.push('t3');
    ps.push('check', 'manual');
    if (dec.cobertura === 'gatekeeper') ps.push('termo');
    ps.push('fim');
    return ps;
  }
  docsFaltando(v) {
    const out = [];
    const t = TX.transportador(v.transportador),
      mot = TX.pessoa(v.motorista);
    const ruim = (val) => ['falta', 'vencido'].includes(TX.docEstado(val).estado);
    if (mot && ruim(mot.cnh && mot.cnh.validade))
      out.push({ k: 'CNH', tipo: 'CNH', n: 'CNH', sub: mot.cnh ? 'venceu em ' + TX.fmt.data(mot.cnh.validade) : 'ainda não temos' });
    if (t && ruim(t.rntrc && t.rntrc.validade))
      out.push({ k: 'RNTRC', tipo: 'RNTRC', n: 'RNTRC (ANTT)', sub: t.rntrc ? 'venceu' : 'ainda não temos' });
    TX.placasDoConjunto(v.conjunto).forEach((pl) => {
      const p = TX.placa(pl);
      if (ruim(p.crlv && p.crlv.validade))
        out.push({
          k: 'CRLV-' + pl,
          tipo: 'CRLV',
          placa: pl,
          n: 'CRLV da ' + pl,
          sub: p.crlv ? 'venceu em ' + TX.fmt.data(p.crlv.validade) : 'ainda não temos',
        });
    });
    return out;
  }
  passoAtual(ps, v, dec) {
    if (this.state.passo && ps.includes(this.state.passo)) return this.state.passo;
    const vf = v.verificacao;
    if (vf && vf.estado === 'devolvida' && !vf.reenviadoEm) return 'capa';
    if (TX.linkEstado(v).k === 'concluido') return 'fim';
    return 'capa';
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const v = this.v();
    const dec = TX.decidir(v);
    const mot = TX.pessoa(v.motorista),
      prod = TX.produto(v.produto),
      emb = TX.embarcador(v.embarcador),
      fil = TX.filial(v.filial);
    const ps = this.passos(v, dec);
    const p = this.passoAtual(ps, v, dec);
    const idx = ps.indexOf(p);
    const vf = v.verificacao;
    const devolvido = vf && vf.estado === 'devolvida' && !vf.reenviadoEm;
    const ir = (n) => {
      this.setState({ passo: n });
      window.scrollTo(0, 0);
    };
    const prox = () => ir(ps[idx + 1]);
    const conj = TX.conjunto(v.conjunto);
    const comps = TX.compsDoConjunto(conj);
    const naoEnviado = !v.link.enviadoEm;
    const vals = {
      empresa: TX.db.tenant.nome,
      filialNome: fil.nome,
      afretador: TX.usuario(fil.afretador).nome.split(' ')[0],
      cargaTitulo: prod.nome + ', ' + F.peso(v.peso),
      cargaSub: emb.nome + ', ' + F.extenso(v.data) + ', ' + v.janela,
      placasTxt: TX.placasDoConjunto(conj).join('  '),
      motPrimeiro: mot.nome.split(' ')[0],
      motNome: mot.nome,
      hojeTxt: F.data(TX.HOJE),
      offline: s.offline,
      offlineTxt: s.fila.length
        ? 'Sem sinal. ' +
          s.fila.length +
          (s.fila.length === 1 ? ' etapa salva' : ' etapas salvas') +
          ' no celular; vão sozinhas quando o sinal voltar.'
        : 'Sem sinal. Pode continuar: fica salvo no celular.',
      sinalK: s.offline ? 'off' : 'on',
      sinalRot: s.offline ? 'sem sinal' : 'com sinal',
      sinalBg: s.offline ? 'rgba(232,163,61,.85)' : 'rgba(255,255,255,.14)',
      alternarSinal: () => this.setOffline(!s.offline),
      mostraProgresso: !naoEnviado && p !== 'capa' && p !== 'fim',
      barra: ps
        .filter((x) => x !== 'capa' && x !== 'fim')
        .map((x, i) => ({ bg: ps.indexOf(x) < idx ? '#48c78e' : x === p ? '#fff' : 'rgba(255,255,255,.22)' })),
      passoTxt: 'Etapa ' + idx + ' de ' + (ps.length - 2),
      eNaoEnviado: naoEnviado,
      simularEnvio: () => {
        TX.fazer('enviarLink', { id: v.id, canal: 'copiado' });
        TX.fazer('linkAberto', { id: v.id, porMotorista: true });
        this.avisar('Link enviado e aberto. A mesa da filial já mostra.');
      },
      eCapa: !naoEnviado && p === 'capa',
      eDevolvido: !naoEnviado && p === 'capa' && devolvido,
      devMotivo: vf ? vf.motivo : '',
      devQuem: vf ? TX.usuario(vf.por).nome + ', ' + F.quando(vf.em) : '',
      resumoPassos: (v.tipo === 'propria'
        ? ['Confirmar quem você é', 'Checklist da carreta com fotos', 'Ler o manual em 5 cartões']
        : dec.cobertura === 'gatekeeper'
          ? ['Confirmar quem você é', 'Contar as 3 últimas cargas da carreta', 'Checklist com fotos', 'Ler o manual e assinar o termo']
          : ['Confirmar quem você é', 'Contar as 3 últimas cargas', 'Checklist com fotos', 'Ler o manual']
      ).map((n, i) => ({ i: i + 1, n })),
      eId: p === 'id',
      eDocs: p === 'docs',
      eT3: p === 't3',
      eCheck: p === 'check',
      eManual: p === 'manual',
      eTermo: p === 'termo',
      eFim: p === 'fim',
      toast: !!s.toast,
      toastMsg: s.toast || '',
    };
    let pode = true,
      rot = 'Continuar',
      acao = prox;
    // Botão apagado diz o que falta e, tocado, leva até lá.
    let falta = null,
      irFalta = () => {};
    const rolar = (sel, k) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (k) {
        this.setState({ realce: k });
        clearTimeout(this._realce);
        this._realce = setTimeout(() => this.setState({ realce: null }), 1600);
      }
    };

    if (p === 'capa') {
      rot = devolvido ? 'Refazer as fotos pedidas' : 'Começar';
      acao = () => ir(devolvido ? 'check' : 'id');
    }
    if (p === 'id') {
      const ok = s.cpfIn.length === 3 && s.cpfIn === TX.soDigitos(mot.cpf).slice(0, 3);
      const errado = s.cpfIn.length === 3 && !ok;
      Object.assign(vals, {
        cpfIn: s.cpfIn,
        onCpf: (e) => this.setState({ cpfIn: TX.soDigitos(e.target.value).slice(0, 3) }),
        cpfBd: ok ? '#1a8f57' : errado ? '#c43d3d' : '#dfe7e5',
        cpfMsg: ok
          ? 'Confere, ' + mot.nome.split(' ')[0] + '.'
          : errado
            ? 'Não confere com o CPF desta viagem. Confira ou fale com o afretador.'
            : '',
        cpfMsgC: ok ? '#1a8f57' : '#c43d3d',
        placasConf: TX.placasDoConjunto(conj).map((pl, i) => ({ papel: i === 0 ? 'CAVALO' : 'CARRETA ' + i, placa: pl })),
      });
      pode = ok;
      rot = 'Confirmar';
      falta = errado ? 'CPF não confere' : 'Digite os 3 números do CPF';
      irFalta = () => {
        const el = document.querySelector('[data-tx-campo="cpf"]');
        if (el) el.focus();
      };
      acao = () => {
        if (!ok) return;
        this.enviar('linkCpf', {});
        prox();
      };
    }
    if (p === 'docs') {
      const faltam = this.docsFaltando(v);
      const tirados = s.docsTirados || {};
      const todos = faltam.every((d) => tirados[d.k]);
      Object.assign(vals, {
        docsPedidos: faltam.map((d) => {
          const ok = !!tirados[d.k];
          return {
            k: d.k,
            n: d.n,
            sub: ok ? 'foto pronta para enviar' : d.sub,
            subC: ok ? '#1a8f57' : '#b97514',
            bd: ok ? '#cfe9dc' : '#f3dfb8',
            bt: ok ? 'Tirar de novo' : 'Tirar foto',
            btBg: ok ? '#f0f4f3' : 'linear-gradient(135deg,#127670,#0E78B5)',
            btC: ok ? '#0b2224' : '#fff',
            onClick: () => this.setState({ docsTirados: Object.assign({}, tirados, { [d.k]: true }) }),
          };
        }),
      });
      pode = todos && faltam.length > 0;
      rot = faltam.length ? 'Enviar documentos' : 'Continuar';
      const semFoto = faltam.filter((d) => !tirados[d.k]);
      falta = semFoto.length === 1 ? 'Falta a foto de 1 documento' : 'Faltam fotos de ' + semFoto.length + ' documentos';
      irFalta = () => {
        if (semFoto[0]) rolar('[data-tx-doc="' + semFoto[0].k + '"]');
      };
      acao = () => {
        if (!faltam.length) return prox();
        if (!todos) return;
        this.enviar('linkDocs', {
          docs: faltam.map((d) => ({
            tipo: d.tipo,
            placa: d.placa,
            validade: d.tipo === 'CNH' ? TX.addDias(TX.HOJE, 1825) : TX.addDias(TX.HOJE, 365),
          })),
        });
        this.setState({ docsTirados: {} });
        prox();
      };
    }
    if (p === 't3') {
      const t3 = s.t3 || this.t3Inicial(v, comps);
      const set = (key, i, campo, val) => {
        const n = JSON.parse(JSON.stringify(t3));
        n[key][i][campo] = val;
        if (campo === 'texto') n[key][i].produto = (TX.produtoPorTexto(val) || {}).id || null;
        this.setState({ t3: n });
      };
      const linhaOk = (l) => l.data && l.texto && l.data < v.data;
      const carretas = comps.map((c, ci) => {
        const ant = comps[ci - 1];
        return {
          placa: c.placa,
          posTxt: c.pos !== 'C1' || comps.filter((x) => x.placa === c.placa).length > 1 ? '(compartimento ' + c.pos + ') ' : '',
          temAtalho: ci > 0,
          atalhoPlaca: ant ? ant.placa + (ant.placa === c.placa ? ' ' + ant.pos : '') : '',
          atalho: () => {
            if (!ant) return;
            const n = JSON.parse(JSON.stringify(t3));
            n[c.key] = JSON.parse(JSON.stringify(t3[ant.key]));
            this.setState({ t3: n });
          },
          linhas: t3[c.key].map((l, i) => {
            const pr = l.produto ? TX.produto(l.produto) : null;
            const sugs = !pr && (l.texto || '').length >= 2 ? TX.buscarProdutos(l.texto, 3) : [];
            const dataRuim = l.data && l.data >= v.data;
            const msg = dataRuim
              ? 'A data tem que ser antes desta carga (' + F.data(v.data) + ').'
              : pr
                ? pr.regime === 'X'
                  ? 'Carga proibida para quem leva ração. O afretador vai falar com você.'
                  : 'Entendido: ' + pr.nome + (pr.regime !== 'A' ? ', pede lavagem (regime ' + pr.regime + ')' : '')
                : l.texto && !sugs.length
                  ? 'Não achamos na lista. Vai como está e a transportadora confere.'
                  : '';
            return {
              key: c.key + '-' + i,
              rot: i === 0 ? 'ÚLTIMA' : i === 1 ? 'PENÚLTIMA' : 'ANTEPENÚLTIMA',
              data: l.data,
              texto: l.texto,
              bd: s.realce === c.key + '-' + i ? '#e8a33d' : linhaOk(l) ? '#cfe9dc' : '#eef2f1',
              msg,
              msgC: dataRuim || (pr && pr.regime === 'X') ? '#c43d3d' : pr ? '#1a8f57' : '#b97514',
              onData: (e) => set(c.key, i, 'data', e.target.value),
              onTexto: (e) => set(c.key, i, 'texto', e.target.value),
              temSug: sugs.length > 0,
              sugs: sugs.map((r) => ({ id: r.produto.id, n: r.produto.nome, onClick: () => set(c.key, i, 'texto', r.produto.nome) })),
            };
          }),
        };
      });
      const ok = comps.every((c) => t3[c.key].every(linhaOk));
      Object.assign(vals, { t3Carretas: carretas });
      pode = ok;
      rot = 'Enviar as cargas';
      const incompletas = [].concat
        .apply(
          [],
          comps.map((c) => t3[c.key].map((l, i) => ({ k: c.key + '-' + i, l }))),
        )
        .filter((x) => !linhaOk(x.l));
      falta = incompletas.length === 1 ? 'Falta 1 carga' : 'Faltam ' + incompletas.length + ' cargas';
      irFalta = () => {
        if (incompletas[0]) rolar('[data-tx-t3-linha="' + incompletas[0].k + '"]', incompletas[0].k);
      };
      acao = () => {
        if (!ok) return;
        const out = {};
        comps.forEach((c) => {
          out[c.key] = t3[c.key].map((l) => (l.produto ? { data: l.data, produto: l.produto } : { data: l.data, texto: l.texto }));
        });
        this.enviar('linkT3', { t3: out });
        prox();
      };
    }
    if (p === 'check') {
      const so = devolvido ? vf.itens || [] : null;
      const itens = Object.assign(
        {},
        devolvido ? v.checklist.itens : v.checklist && !v.checklist.enviadoEm ? v.checklist.itens : {},
        s.itens,
      );
      const fotos = Object.assign(
        {},
        devolvido ? v.checklist.fotos : v.checklist && !v.checklist.enviadoEm ? v.checklist.fotos : {},
        s.fotos,
      );
      if (devolvido)
        so.forEach((k) => {
          if (!(k in s.fotos)) delete fotos[k];
        });
      const lista = TX.ITENS_CHECKLIST.filter((it) => !so || so.includes(it.k));
      const FT = {
        lona: 'repeating-linear-gradient(90deg,#2f5d73 0 14px,#33657c 14px 28px)',
        correntes: 'radial-gradient(circle at 30% 40%,#8a9aa0,#4c5c62 70%)',
        cintas: 'repeating-linear-gradient(-30deg,#c46a2a 0 10px,#d07a34 10px 20px)',
        carroceria: 'linear-gradient(160deg,#5d7a7a,#3f5757)',
        interior: 'repeating-linear-gradient(0deg,#8b6f4e 0 12px,#957857 12px 24px)',
      };
      Object.assign(vals, {
        ckItens: lista.map((it, i) => {
          const r = itens[it.k],
            f = fotos[it.k];
          const bt = (on) => ({ bd: on ? '#127670' : '#dfe7e5', bg: on ? '#eef7f6' : '#fff', c: on ? '#0C5862' : '#3c4f4e' });
          const bn = r === 'nao' ? { bd: '#c43d3d', bg: '#fdf6f6', c: '#c43d3d' } : bt(false);
          const bs = bt(r === 'ok');
          return {
            k: it.k,
            i: TX.ITENS_CHECKLIST.indexOf(it) + 1,
            n: it.n,
            pergunta: it.pergunta,
            critico: it.critico,
            bd: s.realce === it.k ? '#e8a33d' : r && f ? '#cfe9dc' : '#fff',
            sim: () => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'ok' }) }),
            nao: () => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'nao' }) }),
            simBd: bs.bd,
            simBg: bs.bg,
            simC: bs.c,
            naoBd: bn.bd,
            naoBg: bn.bg,
            naoC: bn.c,
            foto: () => {
              this.setState({ fotos: Object.assign({}, s.fotos, { [it.k]: 1 }) });
              this.avisar('Foto salva com hora e local: ' + it.n.toLowerCase() + '.');
            },
            fotoH: f ? '120px' : '64px',
            fotoBg: f ? FT[it.k] : '#fbfdfc',
            fotoBd: f ? 'transparent' : '#c9d5d3',
            fotoIc: f ? '#fff' : '#0C5862',
            fotoRot: f ? 'Foto tirada ' + TX.agoraHM() + '. Tocar para refazer' : 'Tirar foto',
            dica: 'Foto: ' + it.foto + '. Só câmera, sem galeria.',
            alerta: it.k === 'interior' && r === 'nao',
          };
        }),
      });
      const ok = lista.every((it) => itens[it.k] && fotos[it.k]);
      pode = ok;
      rot = devolvido ? 'Reenviar à filial' : 'Enviar checklist';
      const abertos = lista.filter((it) => !(itens[it.k] && fotos[it.k]));
      falta = abertos.length === 1 ? 'Falta 1 item' : 'Faltam ' + abertos.length + ' de ' + lista.length + ' itens';
      irFalta = () => {
        if (abertos[0]) rolar('[data-tx-ck="' + abertos[0].k + '"]', abertos[0].k);
      };
      acao = () => {
        if (!ok) return;
        const its = {},
          fts = {};
        TX.ITENS_CHECKLIST.forEach((it) => {
          its[it.k] = itens[it.k] || 'ok';
          fts[it.k] = fotos[it.k] || 1;
        });
        this.enviar('linkChecklist', { itens: its, fotos: fts, gps: TX.embarcador(v.embarcador).nome });
        this.setState({ itens: {}, fotos: {} });
        if (devolvido) ir('fim');
        else prox();
      };
    }
    if (p === 'manual') {
      const vig = TX.manualVigente(v.data);
      const c = TX.db.manual.cartoes[s.cartao] || TX.db.manual.cartoes[0];
      const ultimo = s.cartao >= TX.db.manual.cartoes.length - 1;
      Object.assign(vals, {
        manualVersao: vig.v,
        cartaoN: s.cartao + 1,
        cartaoT: c.t,
        cartaoTxt: c.txt,
        cartaoDots: TX.db.manual.cartoes.map((_, i) => ({ w: i === s.cartao ? '22px' : '7px', bg: i <= s.cartao ? '#127670' : '#dfe7e5' })),
      });
      rot = ultimo ? 'Li e entendi' : 'Próximo cartão';
      acao = () => {
        if (!ultimo) return this.setState({ cartao: s.cartao + 1 });
        this.enviar('linkManual', { versao: vig.v });
        prox();
      };
    }
    if (p === 'termo') {
      const pts = s.pontos;
      const path = pts.map((q, i) => (q.novo || i === 0 ? 'M' : 'L') + q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join(' ');
      const pos = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      Object.assign(vals, {
        termoTitulo: TX.db.termo.titulo,
        termoVersao: TX.db.termo.versao,
        termoTexto: TX.db.termo.texto,
        assPath: path || 'M0 0',
        assBd: pts.length > 12 ? '#1a8f57' : '#c9d5d3',
        assDown: (e) => {
          const q = pos(e);
          this._des = true;
          this.setState({ pontos: pts.concat([Object.assign(q, { novo: true })]) });
        },
        assMove: (e) => {
          if (!this._des) return;
          const q = pos(e);
          this.setState((st) => ({ pontos: st.pontos.concat([q]) }));
        },
        assUp: () => {
          this._des = false;
        },
        limparAss: () => this.setState({ pontos: [] }),
      });
      pode = pts.length > 12;
      rot = 'Assinar e enviar';
      falta = 'Assine no quadro para enviar';
      irFalta = () => rolar('[data-tx-assinatura]');
      acao = () => {
        if (!pode) return;
        this.enviar('linkAssinar', { versao: TX.db.termo.versao });
        prox();
      };
    }
    if (p === 'fim') {
      const l = v.link;
      const pend = s.fila.length > 0;
      Object.assign(vals, {
        fimTitulo: pend ? 'Salvo no celular' : devolvido ? 'Esperando a filial' : 'Enviado à filial ' + fil.nome,
        fimSub: pend
          ? 'Assim que o sinal voltar, tudo vai para a filial sozinho. Não feche o navegador.'
          : 'Pode fechar esta página. O afretador confere as fotos e libera a carga; se precisar de foto nova, ele manda mensagem e este mesmo link mostra o que refazer.',
        fimItens: [
          ['Dados confirmados', l.cpfEm],
          ['Três últimas cargas', v.tipo === 'propria' ? 'histórico' : l.t3Em],
          ['Checklist com fotos', l.checklistEm],
          ['Manual lido', l.manualEm],
          ['Termo assinado', dec.cobertura === 'gatekeeper' ? l.assinadoEm : 'não se aplica'],
        ]
          .filter((x) => x[1])
          .map((x) => ({ n: x[0], v: x[1].length > 10 ? F.hora(x[1]) : x[1] })),
      });
    }
    const b = TX.ui.cta(pode);
    return Object.assign(vals, {
      temBotao: !naoEnviado && p !== 'fim',
      temVoltar: idx > 1 && p !== 'capa',
      voltar: () => ir(ps[Math.max(1, idx - 1)]),
      avancar: () => {
        if (pode) acao();
        else irFalta();
      },
      btRot: pode || !falta ? rot : falta,
      btBg: b.bg,
      btC: b.c,
      btSh: b.sh,
      btCur: pode || falta ? 'pointer' : b.cur,
    });
  }
  // Segunda viagem do mesmo TAC: as cargas que ele já informou voltam preenchidas para conferir.
  t3Inicial(v, comps) {
    const out = {};
    comps.forEach((c) => {
      if (v.t3[c.key]) {
        out[c.key] = v.t3[c.key].map((x) => ({
          data: x.data,
          produto: x.produto || null,
          texto: x.produto ? TX.produto(x.produto).nome : x.texto,
        }));
        return;
      }
      const h = TX.historico(c.placa, c.pos)
        .filter((x) => x.data < v.data)
        .slice(0, 3);
      out[c.key] = [0, 1, 2].map((i) =>
        h[i]
          ? { data: h[i].data, produto: h[i].produto, texto: h[i].produto ? TX.produto(h[i].produto).nome : h[i].texto }
          : { data: '', produto: null, texto: '' },
      );
    });
    return out;
  }

  render() {
    const v = this.renderVals();
    return (
      <div
        data-screen-label="Link da viagem"
        style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '0' }}
        data-tela="LinkDaViagem"
      >
        <div
          style={{
            width: '100%',
            maxWidth: '430px',
            minHeight: '100vh',
            background: '#f5f8f7',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 0 60px rgba(9,34,36,.12)',
            position: 'relative',
          }}
        >
          <div style={{ background: 'linear-gradient(130deg,#093D44,#0C5862 60%,#0E78B5 140%)', color: '#fff', padding: '18px 18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '13px',
                }}
              >
                TR
              </span>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '14.5px', fontWeight: '800' }}>{v.empresa}</div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.7)' }}>
                  {'filial '}
                  {v.filialNome}
                  {', afretador '}
                  {v.afretador}
                </div>
              </div>
              <span
                data-tx-sinal={v.sinalK}
                onClick={v.alternarSinal}
                title="Demonstração: simular falta de sinal"
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '99px',
                  padding: '4px 10px',
                  background: v.sinalBg,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {v.sinalRot}
              </span>
            </div>
            <div
              style={{
                marginTop: '14px',
                background: 'rgba(255,255,255,.1)',
                border: '1px solid rgba(255,255,255,.16)',
                borderRadius: '14px',
                padding: '11px 13px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: '800' }}>{v.cargaTitulo}</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.78)', marginTop: '2px' }}>{v.cargaSub}</div>
              <div
                style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', marginTop: '6px', color: 'rgba(255,255,255,.9)' }}
              >
                {v.placasTxt}
              </div>
            </div>
            {v.mostraProgresso ? (
              <>
                <div style={{ display: 'flex', gap: '4px', marginTop: '14px' }}>
                  {(Array.isArray(v.barra) ? v.barra : []).map((br, $index) => (
                    <Fragment key={$index}>
                      <span style={{ flex: '1', height: '5px', borderRadius: '99px', background: br?.bg }}></span>
                    </Fragment>
                  ))}
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.7)', marginTop: '6px' }}>{v.passoTxt}</div>
              </>
            ) : null}
          </div>
          {v.offline ? (
            <>
              <div
                data-tx-offline=""
                style={{
                  background: '#fdf3e2',
                  color: '#8a5a0e',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  padding: '10px 16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: '#e8a33d' }}></span>
                {v.offlineTxt}
              </div>
            </>
          ) : null}
          <div
            style={{
              flex: '1',
              padding: '18px 16px 110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              animation: 'subir .25s ease',
            }}
          >
            {v.eNaoEnviado ? (
              <>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800' }}>Este link ainda não foi enviado</div>
                  <div style={{ fontSize: '13.5px', color: '#5c706e', marginTop: '6px', lineHeight: '1.5' }}>
                    Na operação real, o motorista só recebe o link depois que o afretador manda a mensagem pelo WhatsApp.
                  </div>{' '}
                  <span
                    onClick={v.simularEnvio}
                    data-tx-simular-envio=""
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      marginTop: '14px',
                      background: 'linear-gradient(135deg,#127670,#0E78B5)',
                      color: '#fff',
                      fontSize: '14.5px',
                      fontWeight: '800',
                      borderRadius: '14px',
                      padding: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Simular envio pelo afretador
                  </span>{' '}
                </div>
              </>
            ) : null}
            {v.eCapa ? (
              <>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px' }}>
                  <div style={{ fontSize: '19px', fontWeight: '800' }}>
                    {'Olá, '}
                    {v.motPrimeiro}
                  </div>
                  <div style={{ fontSize: '14px', color: '#3c4f4e', marginTop: '6px', lineHeight: '1.55' }}>
                    Antes de carregar, a transportadora precisa de 4 coisas suas. Leva uns 5 minutos e não precisa instalar nada.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                    {(Array.isArray(v.resumoPassos) ? v.resumoPassos : []).map((rp, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: 'flex', gap: '11px', alignItems: 'center', fontSize: '14px' }}>
                          <span
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '99px',
                              background: '#eef7f6',
                              color: '#0C5862',
                              fontWeight: '800',
                              fontSize: '12.5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 'none',
                            }}
                          >
                            {rp?.i}
                          </span>
                          {rp?.n}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7c8f8d', marginTop: '14px', lineHeight: '1.5' }}>
                    Se o sinal cair, o que você fez fica salvo no celular e vai sozinho quando voltar. Seus dados servem só para a
                    transportadora provar a carga em auditoria GMP+.
                  </div>
                </div>
              </>
            ) : null}
            {v.eDevolvido ? (
              <>
                <div style={{ background: '#fff', border: '1.5px solid #f1caca', borderRadius: '20px', padding: '16px 18px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#93313f' }}>A filial pediu foto nova</div>
                  <div style={{ fontSize: '13.5px', color: '#3c4f4e', marginTop: '5px', lineHeight: '1.5' }}>"{v.devMotivo}"</div>
                  <div style={{ fontSize: '12px', color: '#7c8f8d', marginTop: '6px' }}>{v.devQuem}</div>
                </div>
              </>
            ) : null}
            {v.eId ? (
              <>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800' }}>É você mesmo?</div>
                  <div style={{ fontSize: '13.5px', color: '#5c706e', marginTop: '4px' }}>Digite os 3 primeiros números do seu CPF.</div>
                  <input
                    value={v.cpfIn ?? ''}
                    onChange={v.onCpf}
                    data-tx-campo="cpf"
                    inputMode="numeric"
                    maxLength="3"
                    placeholder="000"
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      border: `1.5px solid ${v.cpfBd ?? ''}`,
                      borderRadius: '14px',
                      padding: '14px',
                      fontSize: '24px',
                      letterSpacing: '10px',
                      textAlign: 'center',
                      outline: 'none',
                      fontFamily: "'Spline Sans Mono',monospace",
                    }}
                  />
                  <div style={{ fontSize: '12.5px', color: v.cpfMsgC, marginTop: '6px', minHeight: '16px' }}>{v.cpfMsg}</div>
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#3c4f4e', marginTop: '10px' }}>As placas estão certas?</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {(Array.isArray(v.placasConf) ? v.placasConf : []).map((pc, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#f5f8f7',
                            borderRadius: '12px',
                            padding: '9px 12px',
                          }}
                        >
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#7c8f8d', width: '66px' }}>{pc?.papel}</span>
                          <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '15px', fontWeight: '600' }}>
                            {pc?.placa}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#7c8f8d', marginTop: '8px' }}>
                    Placa diferente? Fale com o afretador antes de seguir: a carga é liberada para estas placas.
                  </div>
                </div>
              </>
            ) : null}
            {v.eDocs ? (
              <>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800' }}>Só o que falta ou venceu</div>
                  <div style={{ fontSize: '13.5px', color: '#5c706e', marginTop: '4px' }}>
                    Tire foto do documento. O resto a transportadora já tem.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {(Array.isArray(v.docsPedidos) ? v.docsPedidos : []).map((dp, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: `1.5px solid ${dp?.bd ?? ''}`,
                            borderRadius: '14px',
                            padding: '12px 13px',
                          }}
                        >
                          <div style={{ flex: '1' }}>
                            <div style={{ fontSize: '14.5px', fontWeight: '800' }}>{dp?.n}</div>
                            <div style={{ fontSize: '12px', color: dp?.subC }}>{dp?.sub}</div>
                          </div>
                          <span
                            onClick={dp?.onClick}
                            data-tx-doc={dp?.k}
                            style={{
                              background: dp?.btBg,
                              color: dp?.btC,
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '9px 14px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {dp?.bt}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {v.eT3 ? (
              <>
                {(Array.isArray(v.t3Carretas) ? v.t3Carretas : []).map((tc, $index) => (
                  <Fragment key={$index}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '18px' }}>
                      <div style={{ fontSize: '15.5px', fontWeight: '800', lineHeight: '1.35' }}>
                        O que a carreta{' '}
                        <span
                          style={{
                            fontFamily: "'Spline Sans Mono',monospace",
                            background: '#0b2224',
                            color: '#fff',
                            borderRadius: '6px',
                            padding: '1px 6px',
                          }}
                        >
                          {tc?.placa}
                        </span>{' '}
                        {tc?.posTxt}carregou nas últimas 3 viagens?
                      </div>
                      {tc?.temAtalho ? (
                        <>
                          <span
                            onClick={tc?.atalho}
                            data-tx-atalho=""
                            style={{
                              display: 'inline-block',
                              marginTop: '10px',
                              fontSize: '12.5px',
                              fontWeight: '800',
                              color: '#0C5862',
                              border: '1.5px solid #cfe3e1',
                              borderRadius: '99px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            {'Carregou o mesmo que a '}
                            {tc?.atalhoPlaca}
                          </span>
                        </>
                      ) : null}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '12px' }}>
                        {(Array.isArray(tc?.linhas) ? tc?.linhas : []).map((tl, $index) => (
                          <Fragment key={$index}>
                            <div
                              data-tx-t3-linha={tl?.key}
                              style={{
                                border: `1.5px solid ${tl?.bd ?? ''}`,
                                borderRadius: '14px',
                                padding: '10px 12px',
                                position: 'relative',
                                scrollMargin: '120px',
                                transition: 'border-color .2s',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#7c8f8d', width: '76px' }}>{tl?.rot}</span>
                                <input
                                  type="date"
                                  value={tl?.data ?? ''}
                                  onChange={tl?.onData}
                                  data-tx-t3-data={tl?.key}
                                  style={{
                                    border: '1px solid #dfe7e5',
                                    borderRadius: '9px',
                                    padding: '5px 8px',
                                    fontSize: '13px',
                                    outline: 'none',
                                    fontFamily: "'Spline Sans Mono',monospace",
                                    marginLeft: 'auto',
                                  }}
                                />
                              </div>
                              <input
                                value={tl?.texto ?? ''}
                                onChange={tl?.onTexto}
                                data-tx-t3-produto={tl?.key}
                                placeholder="Ex.: soja, adubo, casquinha"
                                style={{
                                  width: '100%',
                                  marginTop: '8px',
                                  border: 'none',
                                  borderBottom: '1.5px solid #dfe7e5',
                                  padding: '6px 2px',
                                  fontSize: '15px',
                                  fontWeight: '700',
                                  outline: 'none',
                                  background: 'transparent',
                                }}
                              />
                              <div style={{ fontSize: '12px', color: tl?.msgC, marginTop: '5px', minHeight: '15px' }}>{tl?.msg}</div>
                              {tl?.temSug ? (
                                <>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                    {(Array.isArray(tl?.sugs) ? tl?.sugs : []).map((sg, $index) => (
                                      <Fragment key={$index}>
                                        <span
                                          onClick={sg?.onClick}
                                          data-tx-sug={sg?.id}
                                          style={{
                                            fontSize: '12.5px',
                                            fontWeight: '700',
                                            borderRadius: '99px',
                                            padding: '5px 11px',
                                            background: '#eef7f6',
                                            color: '#0C5862',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          {sg?.n}
                                        </span>
                                      </Fragment>
                                    ))}
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </>
            ) : null}
            {v.eCheck ? (
              <>
                {(Array.isArray(v.ckItens) ? v.ckItens : []).map((ci, $index) => (
                  <Fragment key={$index}>
                    <div
                      data-tx-ck={ci?.k}
                      style={{
                        background: '#fff',
                        borderRadius: '20px',
                        padding: '16px',
                        border: `1.5px solid ${ci?.bd ?? ''}`,
                        transition: 'border-color .2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#7c8f8d' }}>
                          {ci?.i}
                          {' DE 5'}
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: '800' }}>{ci?.n}</span>
                        {ci?.critico ? (
                          <>
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: '800',
                                color: '#93313f',
                                border: '1px solid #ebc3c8',
                                borderRadius: '99px',
                                padding: '1px 8px',
                              }}
                            >
                              item crítico
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div style={{ fontSize: '14px', color: '#3c4f4e', marginTop: '6px', lineHeight: '1.45' }}>{ci?.pergunta}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                        <span
                          onClick={ci?.sim}
                          data-tx-sim={ci?.k}
                          style={{
                            textAlign: 'center',
                            borderRadius: '12px',
                            padding: '11px',
                            fontSize: '14.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            border: `1.5px solid ${ci?.simBd ?? ''}`,
                            background: ci?.simBg,
                            color: ci?.simC,
                          }}
                        >
                          Sim
                        </span>
                        <span
                          onClick={ci?.nao}
                          data-tx-nao={ci?.k}
                          style={{
                            textAlign: 'center',
                            borderRadius: '12px',
                            padding: '11px',
                            fontSize: '14.5px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            border: `1.5px solid ${ci?.naoBd ?? ''}`,
                            background: ci?.naoBg,
                            color: ci?.naoC,
                          }}
                        >
                          Não
                        </span>
                      </div>
                      <div
                        onClick={ci?.foto}
                        data-tx-foto-ck={ci?.k}
                        style={{
                          marginTop: '10px',
                          height: ci?.fotoH,
                          borderRadius: '13px',
                          background: ci?.fotoBg,
                          border: `1.5px dashed ${ci?.fotoBd ?? ''}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '9px',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke={ci?.fotoIc}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 5.5h2l1-1.6h5l1 1.6h2v7h-11z"></path>
                          <circle cx="8" cy="9" r="2.2"></circle>
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: ci?.fotoIc }}>{ci?.fotoRot}</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#7c8f8d', marginTop: '6px' }}>{ci?.dica}</div>
                      {ci?.alerta ? (
                        <>
                          <div style={{ marginTop: '8px', fontSize: '12.5px', color: '#93313f', fontWeight: '700', lineHeight: '1.45' }}>
                            Com resto de carga a carreta não carrega ração. Limpe e responda de novo, ou avise o afretador.
                          </div>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </>
            ) : null}
            {v.eManual ? (
              <>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '20px',
                    minHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#7c8f8d' }}>
                      MANUAL V{v.manualVersao}
                      {', CARTÃO '}
                      {v.cartaoN}
                      {' DE 5'}
                    </span>
                  </div>
                  <div style={{ fontSize: '21px', fontWeight: '800', marginTop: '12px' }}>{v.cartaoT}</div>
                  <div style={{ fontSize: '16px', color: '#3c4f4e', marginTop: '10px', lineHeight: '1.6', flex: '1' }}>{v.cartaoTxt}</div>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '14px' }}>
                    {(Array.isArray(v.cartaoDots) ? v.cartaoDots : []).map((cd, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={{ width: cd?.w, height: '7px', borderRadius: '99px', background: cd?.bg, transition: 'all .2s' }}
                        ></span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {v.eTermo ? (
              <>
                <div style={{ background: '#fff', borderRadius: '20px', padding: '20px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800' }}>{v.termoTitulo}</div>
                  <div style={{ fontSize: '11.5px', color: '#7c8f8d', marginTop: '2px' }}>
                    {'versão '}
                    {v.termoVersao}
                  </div>
                  <div style={{ fontSize: '14px', color: '#3c4f4e', marginTop: '10px', lineHeight: '1.6' }}>{v.termoTexto}</div>
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#3c4f4e', marginTop: '14px' }}>Assine com o dedo</div>
                  <div
                    onPointerDown={v.assDown}
                    onPointerMove={v.assMove}
                    onPointerUp={v.assUp}
                    onPointerLeave={v.assUp}
                    data-tx-assinatura=""
                    style={{
                      marginTop: '6px',
                      height: '150px',
                      borderRadius: '14px',
                      border: `1.5px dashed ${v.assBd ?? ''}`,
                      background: '#fbfdfc',
                      position: 'relative',
                      touchAction: 'none',
                      cursor: 'crosshair',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                    }}
                  >
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: '0', pointerEvents: 'none' }}>
                      <path
                        d={v.assPath}
                        fill="none"
                        stroke="#0b2224"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>{' '}
                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        bottom: '10px',
                        fontSize: '11.5px',
                        color: '#9db0ae',
                        pointerEvents: 'none',
                      }}
                    >
                      {v.motNome}
                      {', '}
                      {v.hojeTxt}
                    </span>{' '}
                    <span
                      onClick={v.limparAss}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '8px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        color: '#7c8f8d',
                        cursor: 'pointer',
                      }}
                    >
                      limpar
                    </span>{' '}
                  </div>
                </div>
              </>
            ) : null}
            {v.eFim ? (
              <>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '99px',
                      background: 'linear-gradient(135deg,#48c78e,#1a8f57)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 7px rgba(72,199,142,.18)',
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
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
                  <div style={{ fontSize: '19px', fontWeight: '800', marginTop: '14px' }}>{v.fimTitulo}</div>
                  <div style={{ fontSize: '14px', color: '#3c4f4e', marginTop: '6px', lineHeight: '1.55' }}>{v.fimSub}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', width: '100%' }}>
                    {(Array.isArray(v.fimItens) ? v.fimItens : []).map((fi, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            background: '#f5f8f7',
                            borderRadius: '11px',
                            padding: '9px 12px',
                          }}
                        >
                          <span>{fi?.n}</span>
                          <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: '#1a8f57' }}>{fi?.v}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {v.temBotao ? (
            <>
              <div
                style={{
                  position: 'sticky',
                  bottom: '0',
                  padding: '12px 16px 16px',
                  background: 'linear-gradient(180deg,rgba(245,248,247,0),#f5f8f7 30%)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                {v.temVoltar ? (
                  <>
                    <span
                      onClick={v.voltar}
                      style={{
                        background: '#fff',
                        border: '1.5px solid #dfe7e5',
                        color: '#0b2224',
                        fontSize: '15px',
                        fontWeight: '800',
                        borderRadius: '16px',
                        padding: '15px 18px',
                        cursor: 'pointer',
                      }}
                    >
                      Voltar
                    </span>
                  </>
                ) : null}
                <span
                  onClick={v.avancar}
                  data-tx-avancar=""
                  style={{
                    flex: '1',
                    textAlign: 'center',
                    background: v.btBg,
                    color: v.btC,
                    boxShadow: v.btSh,
                    cursor: v.btCur,
                    fontSize: '15.5px',
                    fontWeight: '800',
                    borderRadius: '16px',
                    padding: '15px',
                  }}
                >
                  {v.btRot}
                </span>
              </div>
            </>
          ) : null}
          {v.toast ? (
            <>
              <div
                data-tx-toast=""
                style={{
                  position: 'fixed',
                  bottom: '96px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: '50',
                  background: '#0b2224',
                  color: '#fff',
                  borderRadius: '14px',
                  padding: '11px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  width: 'max-content',
                  maxWidth: 'min(398px,calc(100vw - 32px))',
                  textAlign: 'center',
                  boxShadow: '0 16px 40px rgba(9,34,36,.35)',
                }}
              >
                {v.toastMsg}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }
}
