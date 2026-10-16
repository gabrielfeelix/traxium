// Gerado de "SaaS moderno estilo Dribbble/Cadastros.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Cadastros extends Tela {
  state = { loading: true, aba: null, pq: '', pReg: 'todos', modal: null, f: {}, popAberto: null, verCartoes: false, hl: null };
  componentDidMount() {
    TX.ui.montar(this);
    const q = TX.ui.param('q');
    if (q) this.setState({ pq: q });
    const id = TX.ui.param('id');
    if (id && this.cadAtiva() === 'fornecedores') {
      this.setState({ hl: id });
      setTimeout(() => {
        const el = document.querySelector('[data-tx-forn="' + id + '"]');
        if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 400);
    }
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  cadAtiva() {
    const a = this.state.aba || TX.ui.param('aba');
    return ['produtos', 'manual', 'fornecedores', 'filiais'].includes(a) ? a : 'produtos';
  }
  irAba(k) {
    this.setState({ aba: k });
    try {
      TX.ui.trocarUrl('/cadastros?aba=' + k);
    } catch (e) {}
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      aba = this.cadAtiva();
    const regT = (r) =>
      ({
        A: ['linear-gradient(135deg,#48c78e,var(--ok))', '#fff'],
        B: ['linear-gradient(135deg,#f1d55a,#e3c235)', '#5b4b05'],
        C: ['linear-gradient(135deg,#f4c15d,var(--aviso-2))', '#fff'],
        D: ['linear-gradient(135deg,#e88a5f,#d06a3c)', '#fff'],
        X: ['linear-gradient(135deg,#e46969,var(--perigo))', '#fff'],
      })[r];
    const ABAS = [
      ['produtos', 'Produtos e regimes'],
      ['manual', 'Manual e treinamentos'],
      ['fornecedores', 'Fornecedores'],
      ['filiais', 'Filiais'],
    ];
    const docsForn = [].concat.apply(
      [],
      TX.db.fornecedores.map((f) => f.docs.map((d) => TX.docEstado(d.validade))),
    );
    const fVence = docsForn.filter((de) => de.estado !== 'ok' && de.dias <= 30).length;
    const semOC = TX.db.filiais.filter((f) => !f.comunicacaoOC).length;
    const SUB = {
      produtos:
        TX.db.produtos.length +
        ' produtos da base IDTF ' +
        TX.db.baseIDTF.versao +
        ', mantida pela Traxium, com a limpeza que cada um exige da carga seguinte.',
      manual: 'Manual do motorista com versões e ciências, e treinamentos da equipe e da frota própria.',
      fornecedores:
        TX.db.fornecedores.length +
        ' fornecedores que tocam a viagem. ' +
        (fVence
          ? (fVence === 1 ? '1 documento vence' : fVence + ' documentos vencem') + ' em até 30 dias.'
          : 'Nenhum documento vence nos próximos 30 dias.'),
      filiais:
        TX.db.filiais.length +
        ' filiais com registro GMP+ próprio. ' +
        (semOC
          ? (semOC === 1 ? '1 ainda não comunicou' : semOC + ' ainda não comunicaram') + ' o gatekeeper ao organismo certificador.'
          : 'Todas comunicaram o gatekeeper ao organismo certificador.'),
    };
    const vals = Object.assign({}, U.base(this));
    Object.assign(vals, {
      abaNome: ABAS.find((x) => x[0] === aba)[1],
      abaSub: SUB[aba],
      aProdutos: aba === 'produtos',
      aManual: aba === 'manual',
      aFornecedores: aba === 'fornecedores',
      aFiliais: aba === 'filiais',
      mostrarAbas: vals.navL === 'none',
      abas: ABAS.map(([k, n]) => ({
        k,
        n,
        onClick: () => this.irAba(k),
        c: aba === k ? 'var(--texto)' : 'var(--texto-apagado)',
        bd: aba === k ? 'var(--primario)' : 'transparent',
      })),
      temAcao: aba === 'fornecedores',
      acaoRot: 'Cadastrar fornecedor',
      acao: () => this.setState({ modal: 'fornecedor', f: { servico: 'lavagem', regimeMax: 'B' } }),
    });
    // produtos
    const achados = s.pq ? TX.buscarProdutos(s.pq, 40).map((r) => r.produto) : TX.db.produtos;
    const lista = achados.filter((p) => s.pReg === 'todos' || p.regime === s.pReg);
    const pc = U.cta((s.pcTexto || '').trim().length >= 3);
    const REGS = [
      ['todos', 'Todos os regimes'],
      ['A', 'Seco'],
      ['B', 'Água'],
      ['C', 'Água e detergente'],
      ['D', 'Desinfecção'],
      ['X', 'Proibida para ração'],
    ];
    const pedir = (t) => {
      if (t.length < 3) return;
      if (TX.produtoPorTexto(t)) {
        this.avisar('"' + t + '" já está na base como ' + TX.produtoPorTexto(t).nome + '.');
        return;
      }
      TX.fazer('pedirClassificacao', { texto: t });
      this.setState({ pcTexto: '' });
      this.avisar('Pedido enviado à Traxium. Viagens com esta carga anterior seguem travadas até a classificação.');
    };
    const termo = (s.pq || '').trim(),
      jaPedido = TX.db.pedidosClassificacao.some((p) => p.texto.toLowerCase() === termo.toLowerCase());
    Object.assign(vals, {
      pq: s.pq,
      onPq: (e) => this.setState({ pq: e.target.value }),
      pVazio: lista.length === 0,
      pVazioPede: achados.length === 0 && termo.length >= 3 && !jaPedido,
      pVazioTxt: achados.length
        ? 'Nenhum produto com esse regime ' + (termo ? 'para "' + termo + '"' : '') + '.'
        : jaPedido
          ? '"' + termo + '" não está na base IDTF e a classificação já foi pedida. Até lá, não pode ser carga anterior.'
          : (termo ? '"' + termo + '" não está na base IDTF.' : 'Não está na base IDTF.') +
            ' Carga não classificada não pode ser carga anterior.',
      pVazioRot: 'Pedir classificação de "' + termo + '"',
      pedirDaBusca: () => pedir(termo),
      pContagem: lista.length === TX.db.produtos.length ? lista.length + ' produtos' : lista.length + ' de ' + TX.db.produtos.length,
      regRot: s.pReg === 'todos' ? 'Todos' : REGS.find((x) => x[0] === s.pReg)[1],
      regBd: s.pReg !== 'todos' ? 'var(--primario)' : 'var(--borda-campo)',
      popRegime: s.popAberto === 'regime',
      abrirRegime: () => this.setState((st) => ({ popAberto: st.popAberto === 'regime' ? null : 'regime' })),
      pRegimes: REGS.map(([k, n]) => {
        const q = k === 'todos' ? achados.length : achados.filter((p) => p.regime === k).length;
        const t = k === 'todos' ? ['transparent', 'var(--texto-apagado)'] : regT(k);
        const pode = q > 0 || k === s.pReg;
        return {
          k,
          n,
          q,
          r: k === 'todos' ? '' : k === 'X' ? '✕' : k,
          rBg: t[0],
          rT: t[1],
          fw: s.pReg === k ? '800' : '600',
          cor: pode ? 'var(--texto)' : 'var(--texto-apagado)',
          cur: pode ? 'pointer' : 'default',
          ckOp: s.pReg === k ? '1' : '0',
          onClick: () => {
            if (pode) this.setState({ pReg: k, popAberto: null });
          },
        };
      }),
      produtos: lista.map((p) => {
        const t = regT(p.regime);
        return {
          nome: p.nome,
          en: p.en,
          sin: p.sin.join(', '),
          cat: p.cat,
          r: p.regime === 'X' ? '✕' : p.regime,
          rBg: t[0],
          rT: t[1],
          rn: TX.REGIMES[p.regime].n.toLowerCase(),
          rc: p.regime === 'X' ? 'var(--perigo)' : 'var(--texto-2)',
          racao: p.racao ? 'sim' : 'não',
        };
      }),
      pcTexto: s.pcTexto || '',
      onPcTexto: (e) => this.setState({ pcTexto: e.target.value }),
      pcBg: pc.bg,
      pcC: pc.c,
      pcCur: pc.cur,
      pedirClass: () => pedir((s.pcTexto || '').trim()),
      pedidos: TX.db.pedidosClassificacao
        .slice()
        .reverse()
        .map((p) => ({ t: p.texto, sub: p.id + ', ' + F.data(p.pedidoEm) + ', ' + (TX.usuario(p.por) || {}).nome + ': ' + p.estado })),
    });
    // manual e treinamentos
    const vig = TX.manualVigente();
    Object.assign(vals, {
      manualTitulo: TX.db.manual.titulo,
      cartoes: TX.db.manual.cartoes,
      verCartoes: s.verCartoes,
      cartoesRot: TX.db.manual.cartoes.length + ' cartões',
      cartoesSub: 'o que o motorista lê na v' + vig.v,
      cartoesAcao: s.verCartoes ? 'Recolher' : 'Ver os cartões',
      alternarCartoes: () => this.setState({ verCartoes: !s.verCartoes }),
      versoes: TX.db.manual.versoes
        .slice()
        .reverse()
        .map((x) => {
          const n = TX.db.viagens.filter((v) => v.manual && v.manual.versao === x.v).length;
          const on = x.v === vig.v;
          return {
            v: x.v,
            st: on ? 'vigente desde ' + F.data(x.desde) : 'de ' + F.data(x.desde) + ' a ' + F.data(x.ate),
            c: on ? 'var(--ok)' : 'var(--texto-apagado)',
            bd: on ? 'var(--ok-borda)' : 'var(--borda-suave)',
            mud: x.mudancas,
            ciencias: n + ' ciências em viagens',
          };
        }),
      abrirPublicar: () => this.setState({ modal: 'manual', f: { versao: (parseFloat(vig.v) + 0.1).toFixed(1) } }),
      treinos: TX.db.treinamentos
        .slice()
        .reverse()
        .map((t) => ({
          data: F.data(t.data),
          tema: t.tema,
          instrutor: t.instrutor,
          carga: t.carga,
          n: t.participantes.length,
          quem: t.participantes.map((p) => (TX.usuario(p) || TX.pessoa(p) || {}).nome).join(', '),
        })),
      abrirTreino: () => this.setState({ modal: 'treino', f: { data: TX.HOJE, carga: '1 h', instrutor: TX.sessao().nome, part: [] } }),
    });
    // fornecedores
    Object.assign(vals, {
      fornecedores: TX.db.fornecedores.map((f) => ({
        id: f.id,
        nome: f.nome,
        servico: f.servico,
        cidade: f.cidade,
        cnpj: f.cnpj,
        bd: s.hl === f.id ? 'var(--primario)' : 'var(--borda)',
        sh: s.hl === f.id ? '0 0 0 4px rgba(18,118,112,.12)' : 'none',
        regime: f.regimeMax
          ? 'Credenciado para limpeza até regime ' + f.regimeMax + ' (' + TX.REGIMES[f.regimeMax].n.toLowerCase() + ')'
          : 'Não faz limpeza',
        docs: f.docs.map((d) => {
          const de = TX.docEstado(d.validade);
          const tm = U.tom(de.estado === 'ok' ? 'ok' : de.estado === 'vence' ? 'falta' : 'bloqueio');
          return {
            k: f.id + ':' + d.n,
            n: d.n,
            r: de.rotulo,
            dot: tm.dot,
            c: tm.c,
            atualiza: de.estado !== 'ok',
            onAtualizar: () => this.setState({ modal: 'docForn', fForn: f.id, fDoc: d.n, f: { validade: '' } }),
          };
        }),
      })),
    });
    // filiais
    Object.assign(vals, {
      filiais: TX.db.filiais.map((f) => {
        const oc = f.comunicacaoOC;
        const tm = U.tom(oc ? 'ok' : 'bloqueio');
        const gk = TX.db.viagens.filter(
          (v) =>
            v.filial === f.id &&
            !v.cancelada &&
            v.data >= TX.addDias(TX.HOJE, -45) &&
            v.data <= TX.HOJE &&
            TX.coberturaDe(v) === 'gatekeeper',
        ).length;
        return {
          id: f.id,
          nome: f.nome + ' ' + f.uf + (f.matriz ? ', matriz' : ''),
          reg: f.registro,
          afretador: TX.usuario(f.afretador).nome,
          gk,
          hrefMesa: '/hoje?filial=' + f.id,
          bd: oc ? 'var(--borda)' : 'var(--perigo-borda)',
          oc: oc ? 'Gatekeeper comunicado ao organismo certificador' : 'Gatekeeper ainda não comunicado',
          ocSub: oc
            ? F.data(oc.data) + ', protocolo ' + oc.protocolo
            : 'A TS1.2 exige comunicar antes do primeiro protocolo. Viagens de TAC desta filial ficam bloqueadas.',
          ocC: tm.c,
          ocDot: tm.dot,
          ocRing: tm.ring,
          ocBd: oc ? 'var(--borda-suave)' : 'var(--perigo-borda)',
          semOc: !oc,
          registrar: () => this.setState({ modal: 'oc', fFil: f.id, f: { data: TX.HOJE, protocolo: '' } }),
        };
      }),
    });
    return Object.assign(vals, this.modalVals());
  }
  modalVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      m = s.modal,
      f = s.f || {};
    // Campo de data: digita DD/MM/AAAA; f[k] guarda a data em ISO e f[k + 'Txt'] o que foi digitado.
    const campo = (k, l, t, ph, col) => {
      if (t === 'date') {
        const txt = f[k + 'Txt'] != null ? f[k + 'Txt'] : f[k] ? F.data(f[k]) : '';
        return {
          k,
          l,
          ph: 'DD/MM/AAAA',
          col: col || 'auto',
          im: 'numeric',
          ff: "'Spline Sans Mono',monospace",
          v: txt,
          msg: U.avisoData(txt),
          on: (e) => {
            const t2 = U.mascaraData(e.target.value);
            this.setState({ f: Object.assign({}, s.f, { [k + 'Txt']: t2, [k]: U.dataIso(t2) || '' }) });
          },
        };
      }
      return {
        k,
        l,
        ph: ph || '',
        col: col || 'auto',
        im: 'text',
        ff: 'inherit',
        v: f[k] || '',
        msg: '',
        on: (e) => this.setState({ f: Object.assign({}, s.f, { [k]: e.target.value }) }),
      };
    };
    const base = {
      mAberto: !!m,
      mK: m || '',
      fecharModal: () => this.setState({ modal: null }),
      pararClique: (e) => e.stopPropagation(),
      mTemChips: false,
      mChips: [],
      mChipsRot: '',
      mCampos: [],
    };
    const fim = (ok, rot, fn) => {
      const c = U.cta(ok);
      return {
        mCta: rot,
        ctaBg: c.bg,
        ctaC: c.c,
        ctaSh: c.sh,
        ctaCur: c.cur,
        confirmar: () => {
          if (ok) fn();
        },
      };
    };
    if (m === 'oc') {
      const fil = TX.filial(s.fFil);
      const ok = !!f.data && (f.protocolo || '').trim().length >= 4;
      return Object.assign(
        base,
        {
          mTitulo: 'Comunicação do gatekeeper: ' + fil.nome,
          mSub: 'Registre a data e o protocolo da comunicação ao organismo certificador. As viagens de TAC da filial são reavaliadas na hora.',
          mCampos: [campo('data', 'Data da comunicação', 'date'), campo('protocolo', 'Protocolo', 'text', 'OC-GK-2026-1008')],
        },
        fim(ok, 'Registrar', () => {
          TX.fazer('comunicarOC', { filial: fil.id, data: f.data, protocolo: f.protocolo.trim() });
          this.setState({ modal: null });
          this.avisar('Comunicação registrada para ' + fil.nome + '. Viagens de TAC da filial foram reavaliadas.');
        }),
      );
    }
    if (m === 'treino') {
      const pessoas = TX.db.usuarios
        .filter((u) => u.papel === 'afretador')
        .map((u) => [u.id, u.nome])
        .concat(TX.db.pessoas.filter((p) => p.vinculo === 'propria').map((p) => [p.id, p.nome]));
      const part = f.part || [];
      const ok = !!f.data && (f.tema || '').trim().length >= 5 && (f.instrutor || '').trim().length >= 3 && part.length > 0;
      return Object.assign(
        base,
        {
          mTitulo: 'Registrar treinamento',
          mSub: 'Fica na lista que o auditor confere, com data, tema, instrutor e participantes.',
          mCampos: [
            campo('data', 'Data', 'date'),
            campo('carga', 'Carga horária', 'text', '2 h'),
            campo('tema', 'Tema', 'text', 'Ex.: limpeza seca e cargas proibidas', '1 / span 2'),
            campo('instrutor', 'Instrutor', 'text', '', '1 / span 2'),
          ],
          mTemChips: true,
          mChipsRot: 'PARTICIPANTES',
          mChips: pessoas.map(([id, n]) =>
            Object.assign(
              {
                k: id,
                n,
                onClick: () =>
                  this.setState({ f: Object.assign({}, f, { part: part.includes(id) ? part.filter((x) => x !== id) : part.concat(id) }) }),
              },
              U.chip(part.includes(id)),
            ),
          ),
        },
        fim(ok, 'Registrar', () => {
          TX.fazer('registrarTreinamento', {
            data: f.data,
            tema: f.tema.trim(),
            instrutor: f.instrutor.trim(),
            carga: f.carga || '1 h',
            participantes: part,
          });
          this.setState({ modal: null });
          this.avisar('Treinamento registrado com ' + part.length + ' participantes.');
        }),
      );
    }
    if (m === 'manual') {
      const ok =
        /^\d+\.\d+$/.test(f.versao || '') && (f.mudancas || '').trim().length >= 10 && !TX.db.manual.versoes.some((x) => x.v === f.versao);
      return Object.assign(
        base,
        {
          mTitulo: 'Publicar nova versão do manual',
          mSub: 'Vale a partir de hoje. Ciências já dadas continuam gravadas na versão antiga; o link pede a nova nas próximas viagens.',
          mCampos: [
            campo('versao', 'Versão', 'text', '3.3'),
            campo('mudancas', 'O que mudou', 'text', 'Ex.: novo cartão sobre chuva na carga', '1 / span 2'),
          ],
        },
        fim(ok, 'Publicar', () => {
          TX.fazer('publicarManual', { versao: f.versao, mudancas: f.mudancas.trim() });
          this.setState({ modal: null });
          this.avisar('Manual v' + f.versao + ' publicado. Viagens de hoje sem ciência nesta versão voltam a pedir leitura.');
        }),
      );
    }
    if (m === 'docForn') {
      const fo = TX.fornecedor(s.fForn),
        doc = fo.docs.find((x) => x.n === s.fDoc);
      const ok = !!f.validade && f.validade > TX.HOJE;
      return Object.assign(
        base,
        {
          mTitulo: s.fDoc + ': ' + fo.nome,
          mSub:
            'O documento atual ' +
            TX.docEstado(doc.validade).rotulo +
            '. Informe a validade do documento novo: o aviso de vencimento sai de Hoje.',
          mCampos: [campo('validade', 'Nova validade', 'date')],
        },
        fim(ok, 'Atualizar', () => {
          TX.fazer('atualizarDocumento', { tipo: s.fDoc, fornecedor: fo.id, ref: fo.id, refNome: fo.nome, validade: f.validade });
          this.setState({ modal: null, hl: fo.id });
          this.avisar('Documento atualizado: ' + s.fDoc.toLowerCase() + ' de ' + fo.nome + ', válido até ' + F.data(f.validade) + '.');
        }),
      );
    }
    if (m === 'fornecedor') {
      const lav = f.servico === 'lavagem';
      const ok =
        (f.nome || '').trim().length >= 4 &&
        TX.soDigitos(f.cnpj).length === 14 &&
        (f.cidade || '').trim().length >= 3 &&
        (!lav || !!f.validade);
      return Object.assign(
        base,
        {
          mTitulo: 'Cadastrar fornecedor',
          mSub: 'Lavador entra com o regime máximo que pode fazer; o registro de limpeza na viagem respeita esse limite.',
          mCampos: [
            campo('nome', 'Nome', 'text', '', '1 / span 2'),
            campo('cnpj', 'CNPJ', 'text', '00.000.000/0000-00'),
            campo('cidade', 'Cidade', 'text', 'Sorriso MT'),
            campo('validade', lav ? 'Validade da licença ambiental' : 'Validade do alvará', 'date'),
          ],
          mTemChips: true,
          mChipsRot: lav ? 'SERVIÇO E REGIME MÁXIMO' : 'SERVIÇO',
          mChips: [
            ['lavagem', 'Lavagem'],
            ['lonas e amarração', 'Lonas'],
            ['manutenção', 'Manutenção'],
          ]
            .map(([k, n]) =>
              Object.assign({ k, n, onClick: () => this.setState({ f: Object.assign({}, f, { servico: k }) }) }, U.chip(f.servico === k)),
            )
            .concat(
              lav
                ? ['A', 'B', 'C', 'D'].map((r) =>
                    Object.assign(
                      { k: 'r' + r, n: 'até ' + r, onClick: () => this.setState({ f: Object.assign({}, f, { regimeMax: r }) }) },
                      U.chip(f.regimeMax === r),
                    ),
                  )
                : [],
            ),
        },
        fim(ok, 'Cadastrar', () => {
          TX.fazer('cadastrarFornecedor', {
            nome: f.nome.trim(),
            servico: f.servico,
            cidade: f.cidade.trim(),
            cnpj: f.cnpj,
            regimeMax: lav ? f.regimeMax : null,
            docs: [{ n: lav ? 'Licença ambiental' : 'Alvará de funcionamento', validade: f.validade }],
          });
          this.setState({ modal: null });
          this.avisar(f.nome.trim() + ' cadastrado.');
        }),
      );
    }
    return Object.assign(
      base,
      fim(false, '', () => {}),
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Cadastros" data-tela="Cadastros">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '1.2px',
                  color: 'var(--texto-apagado)',
                  textTransform: 'uppercase',
                }}
              >
                Cadastros
              </div>
              <div data-tx-titulo="" style={{ fontSize: '24px', fontWeight: '800', marginTop: '1px' }}>
                {v.abaNome}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.abaSub}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {v.temAcao ? (
                <>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={v.acao}
                    data-tx-acao-aba=""
                    style={{
                      background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                      color: '#fff',
                      borderRadius: '99px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 6px 14px rgba(18,118,112,.3)',
                    }}
                  >
                    {v.acaoRot}
                  </span>
                </>
              ) : null}
            </div>
          </div>
          {v.mostrarAbas ? (
            <>
              <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--borda-campo)' }}>
                {(Array.isArray(v.abas) ? v.abas : []).map((ab, $index) => (
                  <Fragment key={$index}>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={ab?.onClick}
                      data-tx-aba={ab?.k}
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        color: ab?.c,
                        borderBottom: `2.5px solid ${ab?.bd ?? ''}`,
                        marginBottom: '-1px',
                      }}
                    >
                      {ab?.n}
                    </span>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {v.aProdutos ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
                <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px' }}>
                    <div
                      style={{
                        background: 'var(--superficie)',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '11px',
                        padding: '0 12px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flex: '1',
                        maxWidth: '440px',
                        minWidth: '0',
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#7c8f8d"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        style={{ flex: 'none' }}
                      >
                        <circle cx="7" cy="7" r="4.6"></circle>
                        <line x1="10.5" y1="10.5" x2="13.5" y2="13.5"></line>
                      </svg>
                      <input
                        aria-label="Nome popular, comercial ou em inglês"
                        value={v.pq ?? ''}
                        onChange={v.onPq}
                        data-tx-busca=""
                        placeholder="Nome popular, comercial ou em inglês"
                        style={{
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '14px',
                          padding: '9px 0',
                          flex: '1',
                          minWidth: '0',
                        }}
                      />
                    </div>
                    <div data-tx-pop="" style={{ position: 'relative' }}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={v.abrirRegime}
                        data-tx-dd="regime"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          height: '38px',
                          padding: '0 12px 0 12px',
                          borderRadius: '11px',
                          border: `1px solid ${v.regBd ?? ''}`,
                          background: 'var(--painel)',
                          fontSize: '13px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        className="tx-h30bbaa9"
                      >
                        <span style={{ color: 'var(--texto-apagado)', fontWeight: '600' }}>Depois dele</span>
                        <span style={{ fontWeight: '700' }}>{v.regRot}</span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="#7c8f8d"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 4.5 6 7.5l3-3"></path>
                        </svg>
                      </div>
                      {v.popRegime ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              left: '0',
                              top: '44px',
                              background: 'var(--painel)',
                              border: '1px solid var(--borda)',
                              borderRadius: '14px',
                              boxShadow: '0 16px 40px rgba(9,61,68,.16)',
                              padding: '6px',
                              minWidth: '250px',
                              zIndex: '60',
                            }}
                          >
                            {(Array.isArray(v.pRegimes) ? v.pRegimes : []).map((pr, $index) => (
                              <Fragment key={$index}>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={pr?.onClick}
                                  data-tx-regime={pr?.k}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 11px',
                                    borderRadius: '9px',
                                    fontSize: '13px',
                                    fontWeight: pr?.fw,
                                    color: pr?.cor,
                                    cursor: pr?.cur,
                                  }}
                                  className="tx-h894fca3"
                                >
                                  <span
                                    style={{
                                      width: '20px',
                                      height: '20px',
                                      borderRadius: '6px',
                                      background: pr?.rBg,
                                      color: pr?.rT,
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flex: 'none',
                                    }}
                                  >
                                    {pr?.r}
                                  </span>
                                  {pr?.n}
                                  <span
                                    style={{
                                      marginLeft: 'auto',
                                      fontFamily: "'Spline Sans Mono',monospace",
                                      fontSize: '12px',
                                      color: 'var(--texto-apagado)',
                                    }}
                                  >
                                    {pr?.q}
                                  </span>
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="#127670"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ flex: 'none', opacity: pr?.ckOp }}
                                  >
                                    <path d="M3.5 8.5 6.5 11.5 12.5 4.5"></path>
                                  </svg>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--texto-apagado)', whiteSpace: 'nowrap' }}>
                      {v.pContagem}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.3fr 1.4fr 1fr 110px 80px',
                      gap: '12px',
                      padding: '10px 18px',
                      background: 'var(--superficie)',
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '.7px',
                      color: 'var(--texto-apagado)',
                    }}
                  >
                    <span>PRODUTO</span>
                    <span>TAMBÉM CHAMADO DE</span>
                    <span>CATEGORIA</span>
                    <span>DEPOIS DELE</span>
                    <span>É RAÇÃO</span>
                  </div>
                  {(Array.isArray(v.produtos) ? v.produtos : []).map((p, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.3fr 1.4fr 1fr 110px 80px',
                          gap: '12px',
                          padding: '10px 18px',
                          borderTop: '1px solid var(--superficie-2)',
                          alignItems: 'center',
                          fontSize: '13px',
                        }}
                      >
                        <div>
                          <b>{p?.nome}</b>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{p?.en}</div>
                        </div>
                        <span style={{ color: 'var(--texto-sec)', fontSize: '13px' }}>{p?.sin}</span>
                        <span style={{ color: 'var(--texto-sec)' }}>{p?.cat}</span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: p?.rc,
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '7px',
                              background: p?.rBg,
                              color: p?.rT,
                              fontSize: '11px',
                              fontWeight: '800',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {p?.r}
                          </span>
                          {p?.rn}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{p?.racao}</span>
                      </div>
                    </Fragment>
                  ))}
                  {v.pVazio ? (
                    <>
                      <div
                        data-tx-vazio=""
                        style={{
                          padding: '24px 20px',
                          fontSize: '13px',
                          color: 'var(--texto-sec)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: '1', lineHeight: '1.5' }}>{v.pVazioTxt}</div>
                        {v.pVazioPede ? (
                          <>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={v.pedirDaBusca}
                              data-tx-pedir-da-busca=""
                              style={{
                                background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: '800',
                                borderRadius: '99px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {v.pVazioRot}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 20px' }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>Pedir classificação à Traxium</div>
                    <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px', lineHeight: '1.5' }}>
                      Para carga que não está na base. Até a classificação, viagem com ela como carga anterior fica travada.
                    </div>
                    <input
                      aria-label="escória de alto-forno"
                      value={v.pcTexto ?? ''}
                      onChange={v.onPcTexto}
                      data-tx-campo="classificar"
                      placeholder="Ex.: escória de alto-forno"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />{' '}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={v.pedirClass}
                      data-tx-pedir-classificacao=""
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: '8px',
                        background: v.pcBg,
                        color: v.pcC,
                        cursor: v.pcCur,
                        fontSize: '13px',
                        fontWeight: '800',
                        borderRadius: '99px',
                        padding: '9px',
                      }}
                    >
                      Enviar pedido
                    </span>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                      {(Array.isArray(v.pedidos) ? v.pedidos : []).map((pd, $index) => (
                        <Fragment key={$index}>
                          <div style={{ fontSize: '13px', background: 'var(--superficie)', borderRadius: '11px', padding: '8px 11px' }}>
                            <b>"{pd?.t}"</b>
                            <div style={{ color: 'var(--texto-apagado)' }}>{pd?.sub}</div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {v.aManual ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.manualTitulo}</div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={v.abrirPublicar}
                      data-tx-publicar=""
                      style={{
                        marginLeft: 'auto',
                        paddingLeft: '12px',
                        fontSize: '13px',
                        fontWeight: '800',
                        color: 'var(--primario-2)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Publicar nova versão
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                    O motorista lê no link, em cartões, e a ciência grava a versão na viagem.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '12px' }}>
                    {(Array.isArray(v.versoes) ? v.versoes : []).map((vs, $index) => (
                      <Fragment key={$index}>
                        <div style={{ border: `1px solid ${vs?.bd ?? ''}`, borderRadius: '13px', padding: '10px 13px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <b style={{ fontFamily: "'Spline Sans Mono',monospace" }}>v{vs?.v}</b>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: vs?.c }}>{vs?.st}</span>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--texto-sec)' }}>{vs?.ciencias}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>{vs?.mud}</div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={v.alternarCartoes}
                    data-tx-ver-cartoes=""
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '16px',
                      padding: '10px 13px',
                      borderRadius: '12px',
                      background: 'var(--superficie)',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                    className="tx-h6eff871"
                  >
                    <b>{v.cartoesRot}</b>
                    <span style={{ color: 'var(--texto-sec)' }}>{v.cartoesSub}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '800', color: 'var(--primario-2)' }}>
                      {v.cartoesAcao}
                    </span>
                  </div>
                  {v.verCartoes ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                        {(Array.isArray(v.cartoes) ? v.cartoes : []).map((ct, $index) => (
                          <Fragment key={$index}>
                            <div style={{ background: 'var(--superficie)', borderRadius: '13px', padding: '11px 13px' }}>
                              <div style={{ fontSize: '13px', fontWeight: '800' }}>{ct?.t}</div>
                              <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '3px', lineHeight: '1.45' }}>
                                {ct?.txt}
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>Treinamentos registrados</div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={v.abrirTreino}
                      data-tx-novo-treino=""
                      style={{
                        marginLeft: 'auto',
                        paddingLeft: '12px',
                        fontSize: '13px',
                        fontWeight: '800',
                        color: 'var(--primario-2)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Registrar treinamento
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                    Lista datada com tema, instrutor e participantes: o registro que o auditor confere.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {(Array.isArray(v.treinos) ? v.treinos : []).map((tr, $index) => (
                      <Fragment key={$index}>
                        <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '13px', padding: '11px 13px' }}>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <b style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px' }}>{tr?.data}</b>
                            <b style={{ fontSize: '13px' }}>{tr?.tema}</b>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                            {tr?.instrutor}
                            {', '}
                            {tr?.carga}
                            {', '}
                            {tr?.n}
                            {' participantes'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '2px' }}>{tr?.quem}</div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {v.aFornecedores ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
                {(Array.isArray(v.fornecedores) ? v.fornecedores : []).map((fo, $index) => (
                  <Fragment key={$index}>
                    <div
                      data-tx-forn={fo?.id}
                      style={{
                        background: 'var(--painel)',
                        border: `1.5px solid ${fo?.bd ?? ''}`,
                        boxShadow: fo?.sh,
                        borderRadius: '18px',
                        padding: '16px 20px',
                        scrollMarginTop: '96px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800' }}>{fo?.nome}</div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--primario-2)',
                            border: '1px solid #cfe3e1',
                            borderRadius: '99px',
                            padding: '2px 9px',
                          }}
                        >
                          {fo?.servico}
                        </span>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--texto-sec)' }}>{fo?.cidade}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--texto-apagado)',
                          marginTop: '3px',
                          fontFamily: "'Spline Sans Mono',monospace",
                        }}
                      >
                        {fo?.cnpj}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--texto-2)', marginTop: '6px' }}>{fo?.regime}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                        {(Array.isArray(fo?.docs) ? fo?.docs : []).map((fd, $index) => (
                          <Fragment key={$index}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '9px',
                                fontSize: '13px',
                                background: 'var(--superficie)',
                                borderRadius: '10px',
                                padding: '7px 11px',
                              }}
                            >
                              <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: fd?.dot }}></span>
                              <span style={{ flex: '1' }}>{fd?.n}</span>
                              <span style={{ color: fd?.c, fontWeight: '700' }}>{fd?.r}</span>
                              {fd?.atualiza ? (
                                <>
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={fd?.onAtualizar}
                                    data-tx-atualizar-doc={fd?.k}
                                    style={{ fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer', paddingLeft: '6px' }}
                                    className="tx-h76d8d79"
                                  >
                                    Atualizar
                                  </span>
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
            </>
          ) : null}
          {v.aFiliais ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
                {(Array.isArray(v.filiais) ? v.filiais : []).map((fl, $index) => (
                  <Fragment key={$index}>
                    <div
                      data-tx-filial-card={fl?.id}
                      style={{
                        background: 'var(--painel)',
                        border: `1.5px solid ${fl?.bd ?? ''}`,
                        borderRadius: '18px',
                        padding: '16px 20px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800' }}>{fl?.nome}</div>
                        <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: 'var(--texto-sec)' }}>
                          {fl?.reg}
                        </span>
                        <A href={fl?.hrefMesa} style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '800' }}>
                          Abrir a mesa →
                        </A>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                        <div style={{ background: 'var(--superficie)', borderRadius: '12px', padding: '9px 12px' }}>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>Afretador</div>
                          <div style={{ fontSize: '13px', fontWeight: '700' }}>{fl?.afretador}</div>
                        </div>
                        <div style={{ background: 'var(--superficie)', borderRadius: '12px', padding: '9px 12px' }}>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>Protocolos gatekeeper, 45 dias</div>
                          <div style={{ fontSize: '13px', fontWeight: '700', fontFamily: "'Spline Sans Mono',monospace" }}>{fl?.gk}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          border: `1px solid ${fl?.ocBd ?? ''}`,
                        }}
                      >
                        <span
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '99px',
                            background: fl?.ocDot,
                            boxShadow: `0 0 0 3px ${fl?.ocRing ?? ''}`,
                          }}
                        ></span>
                        <div style={{ flex: '1' }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: fl?.ocC }}>{fl?.oc}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{fl?.ocSub}</div>
                        </div>
                        {fl?.semOc ? (
                          <>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={fl?.registrar}
                              data-tx-registrar-oc={fl?.id}
                              style={{
                                background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: '800',
                                borderRadius: '99px',
                                padding: '7px 14px',
                                cursor: 'pointer',
                              }}
                            >
                              Registrar comunicação
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Fragment>
                ))}
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
              <div
                role="dialog"
                aria-modal="true"
                onClick={v.pararClique}
                data-tx-modal={v.mK}
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: '580px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '28px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.mTitulo}</div>
                  <span
                    role="button"
                    aria-label="Fechar"
                    title="Fechar"
                    tabIndex={0}
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
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.55' }}>{v.mSub}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  {(Array.isArray(v.mCampos) ? v.mCampos : []).map((mc, $index) => (
                    <Fragment key={$index}>
                      <div style={{ gridColumn: mc?.col }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>{mc?.l}</div>
                        <input
                          value={mc?.v ?? ''}
                          onChange={mc?.on}
                          data-tx-campo={mc?.k}
                          inputMode={mc?.im}
                          placeholder={mc?.ph}
                          style={{
                            width: '100%',
                            marginTop: '5px',
                            border: '1px solid var(--borda-campo)',
                            borderRadius: '11px',
                            padding: '9px 12px',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: mc?.ff,
                          }}
                        />
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--perigo)', marginTop: '3px' }}>{mc?.msg}</div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                {v.mTemChips ? (
                  <>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>{v.mChipsRot}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {(Array.isArray(v.mChips) ? v.mChips : []).map((mh, $index) => (
                        <Fragment key={$index}>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={mh?.onClick}
                            data-tx-chip={mh?.k}
                            style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '5px 11px',
                              cursor: 'pointer',
                              border: `1.5px solid ${mh?.bd ?? ''}`,
                              background: mh?.bg,
                              color: mh?.c,
                            }}
                          >
                            {mh?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <span
                    role="button"
                    tabIndex={0}
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
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={v.confirmar}
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
                    {v.mCta}
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
