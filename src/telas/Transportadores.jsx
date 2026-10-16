// Gerado de "SaaS moderno estilo Dribbble/Transportadores.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Transportadores extends Tela {
  state = { loading: true, busca: '', tipo: 'todos', filtro: 'todos', drawer: null, modal: null };
  componentDidMount() {
    TX.ui.montar(this);
    const id = TX.ui.param('id');
    const f = TX.ui.param('filtro');
    this.setState({ drawer: id && TX.transportador(id) ? id : null, filtro: f === 'vencendo' ? 'docs' : 'todos' });
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  renderVals() {
    return Object.assign({}, TX.ui.base(this), this.telaVals(), this.drawerVals(), this.modalVals());
  }
  info(t) {
    const nome = TX.nomeTransportador(t);
    const p = t.tipo === 'TAC' ? TX.pessoa(t.pessoa) : null;
    const q = TX.qualificacao(t);
    const vs = TX.db.viagens.filter((v) => v.transportador === t.id && !v.cancelada).sort((a, b) => b.data.localeCompare(a.data));
    const ocs = TX.db.ocorrencias.filter((o) => o.transportador === t.id);
    const placas = (t.conjuntos || []).map((c) => TX.placasDoConjunto(c).join(' ')).join(' / ');
    const busca = TX.norm(
      [nome, p && p.cpf, p && p.telefone, t.cnpj, t.telefone, t.rntrc && t.rntrc.numero, placas]
        .concat((t.motoristas || []).map((m) => TX.pessoa(m).nome + ' ' + TX.pessoa(m).cpf))
        .join(' '),
    );
    return { t, nome, p, q, vs, ocs, placas, busca };
  }
  telaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const todos = TX.db.transportadores.map((t) => this.info(t));
    const qn = TX.norm(s.busca),
      qd = TX.soDigitos(s.busca);
    const venc15 = new Set(
      TX.vencimentos(15)
        .filter((x) => x.transportador)
        .map((x) => x.transportador),
    );
    const FILT = {
      todos: () => true,
      docs: (x) => venc15.has(x.t.id) || x.q.k === 'pendente',
      revisao: (x) => x.q.k === 'bloqueado',
      dia: (x) => x.q.k === 'apto',
      convite: (x) => x.t.convite.estado === 'enviado',
    };
    const lista = todos
      .filter(
        (x) =>
          (s.tipo === 'todos' || x.t.tipo === s.tipo) &&
          FILT[s.filtro](x) &&
          (!qn || x.busca.includes(qn) || (qd.length >= 4 && TX.soDigitos(x.busca).includes(qd))),
      )
      .sort((a, b) => a.nome.localeCompare(b.nome));
    const pg = U.paginar(this, lista, 'transportadores');
    const tq = (k) => U.tom({ apto: 'ok', restricao: 'falta', pendente: 'falta', bloqueado: 'bloqueio' }[k]);
    const CV = {
      nao_convidado: ['não convidado', 'var(--texto-apagado)', 'var(--borda)', 'Convidar'],
      enviado: ['convite enviado', 'var(--azul)', 'var(--info-borda)', 'Reenviar'],
      aceito: ['aceito', 'var(--ok)', 'var(--ok-borda)', 'Revogar'],
      expirado: ['expirado', 'var(--aviso)', 'var(--aviso-borda)', 'Reenviar'],
      revogado: ['revogado', 'var(--perigo)', 'var(--perigo-borda)', 'Convidar de novo'],
    };
    const nTac = todos.filter((x) => x.t.tipo === 'TAC').length,
      nEtc = todos.length - nTac;
    const ABAS = [
      ['todos', 'Todos', null, false],
      ['docs', 'Documento a resolver', U.tom('falta'), true],
      ['revisao', 'Em revisão', U.tom('bloqueio'), true],
      ['convite', 'Convite pendente', U.tom('info'), true],
      ['dia', 'Em dia', U.tom('ok'), false],
    ];
    const DICA = {
      docs: 'Documento vencido ou vencendo em 15 dias. O aviso sai aos 60, 30 e 15 dias; abra o transportador para atualizar.',
      revisao: 'Transportador com ocorrência grave sem revisão: viagem assegurada fica suspensa até a Direção revisar.',
      convite: 'Convite enviado e ainda não aceito. O convite deixa o próprio transportador manter os documentos.',
    };
    return Object.assign(
      {
        subtitulo: nTac + ' TACs e ' + nEtc + ' ETCs, base compartilhada entre as filiais. A qualificação do TAC é feita viagem a viagem.',
        abas: ABAS.map(([k, n, tm, conta]) => {
          const on = s.filtro === k;
          const q = todos.filter((x) => (s.tipo === 'todos' || x.t.tipo === s.tipo) && FILT[k](x)).length;
          return {
            k,
            n,
            fw: on ? '800' : '600',
            c: on ? 'var(--texto)' : 'var(--texto-sec)',
            bd: on ? 'var(--primario)' : 'transparent',
            dot: tm ? tm.dot : '',
            dotD: tm ? 'inline-block' : 'none',
            q,
            qD: conta && q ? 'inline-block' : 'none',
            qC: tm ? tm.c : 'var(--texto-sec)',
            qBd: tm ? tm.bd : 'var(--borda)',
            onClick: () => this.setState({ filtro: k, pag: 1 }),
          };
        }),
        busca: s.busca,
        onBusca: (e) => this.setState({ busca: e.target.value, pag: 1 }),
        tipos: [
          ['todos', 'Todos'],
          ['TAC', 'TAC'],
          ['ETC', 'ETC'],
        ].map(([k, n]) => {
          const on = s.tipo === k;
          return {
            k,
            n,
            bg: on ? '#fff' : 'transparent',
            c: on ? 'var(--texto)' : 'var(--texto-sec)',
            sh: on ? '0 1px 3px rgba(9,61,68,.12)' : 'none',
            onClick: () => this.setState({ tipo: k, pag: 1 }),
          };
        }),
        contagem: lista.length === 1 ? '1 transportador' : lista.length + ' transportadores',
        temDica: !!DICA[s.filtro],
        dica: DICA[s.filtro] || '',
        dicaCor: (ABAS.find((a) => a[0] === s.filtro)[2] || U.tom('na')).c,
        cols: 'minmax(0,1.7fr) minmax(0,1fr) minmax(0,1fr) 92px 100px 186px',
        linhas: s.loading
          ? []
          : pg.itens.map((x) => {
              const t = x.t,
                tm = tq(x.q.k),
                cv = CV[t.convite.estado];
              const ruins = x.q.docs.filter((d) => d.estado !== 'ok');
              const ocAb = x.ocs.filter((o) => o.gravidade === 'grave' && !o.revisao).length;
              return {
                id: t.id,
                nome: x.nome,
                tipo:
                  t.tipo === 'TAC'
                    ? 'TAC sob gatekeeper' + (t.cadastroMinimo ? ', cadastro mínimo' : '')
                    : 'ETC ' + (t.cobertura === 'certificado' ? 'certificada GMP+' : 'sob gatekeeper'),
                ini: F.iniciais(x.nome),
                g1: x.p ? x.p.g1 : 'var(--primario-2)',
                g2: x.p ? x.p.g2 : 'var(--azul)',
                anel: tm.c,
                doc: x.p ? F.cpfMascara(x.p.cpf) : t.cnpj,
                rntrc: t.rntrc ? t.rntrc.numero : 'pendente',
                placas: x.placas || 'sem conjunto',
                qn: x.q.n,
                qc: tm.c,
                qdot: tm.dot,
                qring: tm.ring,
                qsub: ruins.length
                  ? ruins
                      .map((d) => d.rotulo)
                      .filter(Boolean)
                      .slice(0, 1)
                      .join('')
                  : 'nada a resolver',
                nv: x.vs.length,
                ultima: x.vs[0] ? 'última ' + F.curta(x.vs[0].data) : 'nenhuma',
                oc: x.ocs.length ? x.ocs.length + (ocAb ? ', 1 grave aberta' : '') : 'nenhuma',
                ocC: ocAb ? 'var(--perigo)' : x.ocs.length ? 'var(--aviso)' : 'var(--texto-apagado)',
                cv: cv[0],
                cvC: cv[1],
                cvBd: cv[2],
                cvRot: cv[3],
                cvAcao: () => {
                  const rev = t.convite.estado === 'aceito';
                  TX.fazer('convidar', { transportador: t.id, acao: rev ? 'revogar' : 'convidar' });
                  this.avisar(
                    rev
                      ? 'Acesso de ' + x.nome + ' revogado. O histórico continua.'
                      : 'Convite enviado para ' + x.nome + ' manter os documentos. Validade de 7 dias.',
                  );
                },
                abrir: () => this.setState({ drawer: t.id }),
              };
            }),
        vazio: !s.loading && lista.length === 0,
      },
      pg.vals,
    );
  }
  drawerVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    if (!s.drawer) return { drAberto: false, fecharDrawer: () => {}, pararClique: (e) => e.stopPropagation() };
    const x = this.info(TX.transportador(s.drawer)),
      t = x.t;
    const docs = [];
    const dd = (k, n, val, tipo, ref, refNome) => {
      const d = TX.docEstado(val);
      const tm = U.tom(d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio');
      docs.push({
        k,
        n,
        sub: d.rotulo,
        c: tm.c,
        dot: tm.dot,
        onClick: () =>
          this.setState({
            modal: 'doc',
            fDoc: { tipo, ref, refNome, n, atual: d.rotulo },
            fVal: TX.addDias(TX.HOJE, 365),
            fValTxt: F.data(TX.addDias(TX.HOJE, 365)),
          }),
      });
    };
    dd('rntrc', 'RNTRC ' + (t.rntrc ? t.rntrc.numero : ''), t.rntrc && t.rntrc.validade, 'RNTRC', t.id, x.nome);
    if (t.certificado)
      dd(
        'cert',
        'Certificado ' + t.certificado.numero + ', ' + t.certificado.escopo,
        t.certificado.validade,
        'Certificado GMP+',
        t.id,
        x.nome,
      );
    if (x.p) dd('cnh', 'CNH ' + (x.p.cnh ? x.p.cnh.numero : ''), x.p.cnh && x.p.cnh.validade, 'CNH', x.p.id, x.p.nome);
    (t.conjuntos || []).forEach((c) =>
      TX.placasDoConjunto(c).forEach((pl) => {
        const p = TX.placa(pl);
        dd('crlv-' + pl, 'CRLV ' + pl, p.crlv && p.crlv.validade, 'CRLV', pl, pl);
      }),
    );
    const oc = TX.ocorrenciaGraveAberta(t.id);
    return {
      drAberto: true,
      dId: t.id,
      fecharDrawer: () => {
        this.setState({ drawer: null });
        try {
          TX.ui.trocarUrl('/transportadores');
        } catch (e) {}
      },
      pararClique: (e) => e.stopPropagation(),
      dNome: x.nome,
      dTipo:
        t.tipo === 'TAC'
          ? 'Transportador autônomo (TAC), ' + (x.p ? 'CPF ' + F.cpfMascara(x.p.cpf) + ', ' + x.p.telefone : '')
          : 'Empresa (ETC), CNPJ ' + t.cnpj + ', ' + t.cidade,
      dIni: F.iniciais(x.nome),
      dG1: x.p ? x.p.g1 : 'var(--primario)',
      dG2: x.p ? x.p.g2 : 'var(--azul)',
      dChips: [t.cobertura === 'certificado' ? 'certificado GMP+' : 'sob gatekeeper', x.q.n, 'na base desde ' + F.data(t.desde)],
      dOcAberta: !!oc,
      dOcTxt: oc
        ? oc.id + ', ' + F.data(oc.em.slice(0, 10)) + ': ' + oc.descricao + ' Viagens asseguradas ficam suspensas até a revisão da Direção.'
        : '',
      abrirRevisar: () => this.setState({ modal: 'revisar', fMotivo: '' }),
      dDocs: docs,
      dConjs: (t.conjuntos || []).map((cid) => ({
        placas: TX.placasDoConjunto(cid).map((pl) => {
          const p = TX.placa(pl);
          const d = TX.docEstado(p.crlv && p.crlv.validade);
          return {
            placa: pl,
            href: p.tipo === 'carreta' ? '/compartimento?placa=' + encodeURIComponent(pl) + '&pos=C1' : '#',
            dot: U.tom(d.estado === 'ok' ? 'ok' : d.estado === 'vence' ? 'falta' : 'bloqueio').dot,
          };
        }),
        sub:
          (TX.compsDoConjunto(cid).length === 1 ? '1 compartimento' : TX.compsDoConjunto(cid).length + ' compartimentos') +
          '. Clique na carreta para ver o histórico de cargas.',
      })),
      dSemConj: !(t.conjuntos || []).length,
      dEtc: t.tipo === 'ETC',
      dMots: (t.motoristas || []).map((m) => {
        const p = TX.pessoa(m);
        const d = TX.docEstado(p.cnh && p.cnh.validade);
        return { n: p.nome, cpf: F.cpfMascara(p.cpf), cnh: 'CNH ' + d.rotulo, dot: U.tom(d.estado === 'ok' ? 'ok' : 'falta').dot };
      }),
      dViagensSub: t.tipo === 'TAC' ? 'o passaporte do TAC é o histórico das viagens dele' : 'últimas viagens da empresa',
      dViagens: x.vs.slice(0, 8).map((v) => {
        const dec = TX.decidir(v);
        const cic = TX.ciclo(v);
        const tm = cic.k === 'concluida' ? U.tom('ok') : U.tomResultado(dec);
        return {
          href: '/viagem?id=' + v.id,
          data: F.curta(v.data),
          ordem: v.ordem,
          produto: TX.produto(v.produto).nome,
          res: cic.k === 'concluida' ? 'concluída' : dec.rotulo.toLowerCase(),
          c: tm.c,
        };
      }),
      // A grave sem revisão já está descrita no alerta do topo: aqui fica só a linha.
      dOcs: x.ocs.map((o) => {
        const noTopo = o.gravidade === 'grave' && !o.revisao;
        return {
          tipo: o.tipo,
          data: F.curta(o.em.slice(0, 10)),
          grav: o.gravidade + (o.revisao ? ', revisada' : noTopo ? ', descrita no alerta acima' : ''),
          desc: noTopo ? '' : o.descricao,
          descD: noTopo ? 'none' : 'block',
        };
      }),
      dSemOc: !x.ocs.length,
      dConvite: {
        nao_convidado: 'não convidado',
        enviado: 'convite enviado em ' + F.curta(t.convite.em || ''),
        aceito: 'aceito em ' + F.curta(t.convite.em || ''),
        expirado: 'expirado',
        revogado: 'revogado',
      }[t.convite.estado],
      dPodeConvidar: t.convite.estado !== 'aceito',
      dConvidarRot: t.convite.estado === 'enviado' || t.convite.estado === 'expirado' ? 'Reenviar convite' : 'Enviar convite',
      dPodeRevogar: t.convite.estado === 'aceito' || t.convite.estado === 'enviado',
      dConvidar: () => {
        TX.fazer('convidar', { transportador: t.id, acao: 'convidar' });
        this.avisar('Convite enviado por WhatsApp para ' + x.nome + '.');
      },
      dRevogar: () => {
        TX.fazer('convidar', { transportador: t.id, acao: 'revogar' });
        this.avisar('Acesso revogado. Documentos e viagens continuam no histórico.');
      },
    };
  }
  modalVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      m = s.modal;
    const base = {
      mAberto: !!m,
      mK: m || '',
      fecharModal: () => this.setState({ modal: null }),
      mCad: m === 'cadastro',
      mImp: m === 'importar',
      mDoc: m === 'doc',
      mRev: m === 'revisar',
      fMotivo: s.fMotivo || '',
      onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
      abrirCadastro: () => this.setState({ modal: 'cadastro', cTipo: 'TAC', cNome: '', cDoc: '', cTel: '', cPlacas: '' }),
      abrirImportar: () => this.setState({ modal: 'importar', imp: null }),
    };
    const fim = (ok, rot, fn) => {
      const c = U.cta(ok);
      return {
        ctaBg: c.bg,
        ctaC: c.c,
        ctaSh: c.sh,
        ctaCur: c.cur,
        mCta: rot,
        confirmar: () => {
          if (ok) fn();
        },
      };
    };
    if (m === 'cadastro') {
      const tac = s.cTipo === 'TAC';
      const dig = TX.soDigitos(s.cDoc);
      const dup =
        dig.length >= 8
          ? TX.db.transportadores.find((t) => (t.tipo === 'TAC' ? TX.soDigitos(TX.pessoa(t.pessoa).cpf) : TX.soDigitos(t.cnpj)) === dig)
          : null;
      const placas = (s.cPlacas || '')
        .toUpperCase()
        .split(/[,;]+/)
        .map((x) => x.trim().replace(/^([A-Z]{3})-?(\w{4})$/, '$1 $2'))
        .filter((x) => /^[A-Z]{3} \w{4}$/.test(x));
      const placaDup = placas.find((pl) => TX.placa(pl));
      const ok = (s.cNome || '').trim().length >= 5 && dig.length === (tac ? 11 : 14) && !dup && !placaDup;
      const campo = (k, l, ph) => ({ k, l, ph, v: s[k] || '', on: (e) => this.setState({ [k]: e.target.value }) });
      return Object.assign(
        base,
        {
          mTitulo: 'Cadastrar transportador',
          mSub: 'Nasce como "não convidado" e com documentos faltando. O resto vem pelo link da primeira viagem ou pelo convite.',
          cadTipos: [
            ['TAC', 'TAC (pessoa)'],
            ['ETC', 'ETC (empresa)'],
          ].map(([k, n]) => Object.assign({ n, onClick: () => this.setState({ cTipo: k }) }, U.chip(s.cTipo === k))),
          cadCampos: tac
            ? [
                campo('cNome', 'Nome', 'Nome completo'),
                campo('cDoc', 'CPF', '000.000.000-00'),
                campo('cTel', 'Telefone', '(66) 99999-0000'),
                campo('cPlacas', 'Placas (cavalo, carretas)', 'ABC1D23, ABC1D24'),
              ]
            : [
                campo('cNome', 'Razão social', 'Transportes Exemplo Ltda'),
                campo('cDoc', 'CNPJ', '00.000.000/0000-00'),
                campo('cTel', 'Telefone', '(66) 3000-0000'),
                campo('cCidade', 'Cidade', 'Sorriso MT'),
              ],
          cadDup: !!dup || !!placaDup,
          cadDupTxt: dup
            ? 'Já existe: ' +
              TX.nomeTransportador(dup) +
              ' tem este ' +
              (tac ? 'CPF' : 'CNPJ') +
              '. A duplicidade é conferida pelos dígitos do documento.'
            : placaDup
              ? 'A placa ' +
                placaDup +
                ' já está na base, de ' +
                TX.nomeTransportador(TX.placa(placaDup).dono === 'propria' ? null : TX.placa(placaDup).dono) +
                '.'
              : '',
        },
        fim(ok, 'Cadastrar', () => {
          const id = TX.fazer(
            'cadastrarTransportador',
            tac
              ? { tipo: 'TAC', nome: s.cNome.trim(), cpf: s.cDoc, telefone: s.cTel, placas }
              : { tipo: 'ETC', nome: s.cNome.trim(), cnpj: s.cDoc, telefone: s.cTel, cidade: s.cCidade },
          );
          this.setState({ modal: null, drawer: id });
          this.avisar(s.cNome.trim() + ' cadastrado, ainda não convidado.');
        }),
      );
    }
    if (m === 'importar') {
      const linhas = s.imp
        ? [
            { nome: 'Moacir Tedesco', cpf: '72019344851', tel: '(66) 99441-2001', placas: ['RMT 2A10', 'RMT 2A11'] },
            { nome: 'Sueli Ramalho', cpf: '83120455962', tel: '(65) 99512-3302', placas: ['SRA 4C55', 'SRA 4C56'] },
            { nome: 'Josué Ribeiro', cpf: '41277803915', tel: '(66) 99812-4410', placas: [] },
            { nome: 'Adilson Prestes', cpf: '94231566073', tel: '(66) 99623-4403', placas: ['ADP 9E01', 'ADP 9E02'] },
          ]
        : [];
      const exist = new Set(TX.db.pessoas.map((p) => TX.soDigitos(p.cpf)));
      const novos = linhas.filter((l) => !exist.has(l.cpf));
      return Object.assign(
        base,
        {
          mTitulo: 'Importar planilha de transportadores',
          mSub: 'Cada linha nasce como "não convidado" e sem documento. Duplicados (mesmo CPF ou CNPJ) ficam de fora.',
          impBd: s.imp ? 'var(--primario)' : 'var(--borda-forte)',
          impTitulo: s.imp ? 'Planilha: ' + s.imp : 'Escolher planilha (.csv ou .xlsx)',
          impErro: s.impErro,
          onImpArq: (e) => {
            const f = e.target.files && e.target.files[0];
            const erro = TX.ui.conferirArquivo(f, ['.csv', '.xlsx'], 'planilha');
            e.target.value = '';
            this.setState({ impErro: erro });
            if (f && !erro) this.setState({ imp: f.name });
          },
          impExemplo: (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setState({ imp: 'tacs-safra-2026.xlsx' });
          },
          impLinhas: linhas.map((l) => {
            const d = exist.has(l.cpf);
            return {
              nome: l.nome,
              doc: F.cpfMascara(l.cpf),
              st: d ? 'já existe: fica de fora' : 'novo, sem documento',
              c: d ? 'var(--aviso)' : 'var(--ok)',
            };
          }),
        },
        fim(novos.length > 0, novos.length ? 'Importar ' + novos.length : 'Importar', () => {
          novos.forEach((l) =>
            TX.fazer('cadastrarTransportador', { tipo: 'TAC', nome: l.nome, cpf: l.cpf, telefone: l.tel, placas: l.placas }),
          );
          this.setState({ modal: null, filtro: 'docs' });
          this.avisar(novos.length + ' transportadores importados, todos sem documento. O filtro mostra quem falta.');
        }),
      );
    }
    if (m === 'doc') {
      const d = s.fDoc || {};
      const ok = !!s.fVal && s.fVal > TX.HOJE;
      return Object.assign(
        base,
        {
          mTitulo: 'Atualizar documento',
          mSub: 'Use quando o documento renovado chegou por fora do link (e-mail, balcão).',
          docNome: d.n,
          docAtual: d.atual,
          docVal: s.fValTxt || '',
          docAviso: U.avisoData(s.fValTxt) || (s.fVal && s.fVal <= TX.HOJE ? 'A nova validade tem que ser depois de hoje' : ''),
          onDocVal: (e) => {
            const t = U.mascaraData(e.target.value);
            this.setState({ fValTxt: t, fVal: U.dataIso(t) || '' });
          },
        },
        fim(ok, 'Salvar', () => {
          TX.fazer('atualizarDocumento', { tipo: d.tipo, ref: d.ref, refNome: d.refNome, validade: s.fVal });
          this.setState({ modal: null });
          this.avisar(d.tipo + ' atualizado. Viagens de hoje deste transportador já foram reavaliadas.');
        }),
      );
    }
    if (m === 'revisar') {
      const u = TX.sessao();
      const pode = u.alcada === 'direcao';
      const ok = pode && (s.fMotivo || '').trim().length >= 20;
      return Object.assign(
        base,
        {
          mTitulo: 'Revisar e reabilitar',
          mSub: 'A revisão encerra a suspensão. A ocorrência continua no histórico do transportador.',
          revBg: pode ? 'var(--primario-fraco)' : 'var(--perigo-fundo)',
          revC: pode ? 'var(--primario-2)' : 'var(--perigo)',
          revTxt: pode
            ? 'Você assina como Direção e RT.'
            : 'Só a Direção e RT reabilita depois de ocorrência grave. Você está como ' + u.cargo.toLowerCase() + '.',
          revTrocar: !pode,
        },
        fim(ok, 'Reabilitar', () => {
          TX.fazer('revisarTransportador', { transportador: s.drawer, motivo: s.fMotivo.trim() });
          this.setState({ modal: null });
          this.avisar('Transportador reabilitado. As viagens de hoje dele foram reavaliadas.');
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
      <div style={{ minHeight: '100%' }} data-screen-label="Transportadores" data-tela="Transportadores">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>Transportadores</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.subtitulo}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                role="button"
                tabIndex={0}
                onClick={v.abrirImportar}
                data-tx-importar=""
                style={{
                  background: 'var(--painel)',
                  border: '1px solid var(--borda-campo)',
                  borderRadius: '11px',
                  padding: '9px 15px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
                className="tx-h30bbaa9"
              >
                Importar planilha
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={v.abrirCadastro}
                data-tx-cadastrar=""
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
                className="tx-h0882f37"
              >
                Cadastrar
              </span>
            </div>
          </div>
          <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '4px',
                padding: '0 20px',
                borderBottom: '1px solid var(--borda-suave)',
                overflowX: 'auto',
              }}
            >
              {(Array.isArray(v.abas) ? v.abas : []).map((ab, $index) => (
                <Fragment key={$index}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={ab?.onClick}
                    data-tx-filtro={ab?.k}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '16px 12px 12px',
                      fontSize: '14px',
                      fontWeight: ab?.fw,
                      color: ab?.c,
                      borderBottom: `2.5px solid ${ab?.bd ?? ''}`,
                      marginBottom: '-1px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    className="tx-hec6a165"
                  >
                    <span style={{ display: ab?.dotD, width: '7px', height: '7px', borderRadius: '99px', background: ab?.dot }}></span>
                    {ab?.n}
                    <span
                      style={{
                        display: ab?.qD,
                        fontFamily: "'Spline Sans Mono',monospace",
                        fontSize: '11px',
                        fontWeight: '600',
                        color: ab?.qC,
                        border: `1px solid ${ab?.qBd ?? ''}`,
                        borderRadius: '99px',
                        padding: '0 7px',
                      }}
                    >
                      {ab?.q}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', flexWrap: 'wrap' }}>
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
                  minWidth: '240px',
                  maxWidth: '400px',
                  height: '38px',
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
                  aria-label="Filtrar: nome, CPF, CNPJ, placa ou RNTRC"
                  value={v.busca ?? ''}
                  onChange={v.onBusca}
                  data-tx-busca=""
                  placeholder="Filtrar: nome, CPF, CNPJ, placa ou RNTRC"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', flex: '1', minWidth: '0' }}
                />
              </div>
              <div style={{ display: 'flex', background: 'var(--superficie-2)', borderRadius: '11px', padding: '3px', gap: '2px' }}>
                {(Array.isArray(v.tipos) ? v.tipos : []).map((tp, $index) => (
                  <Fragment key={$index}>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={tp?.onClick}
                      data-tx-tipo={tp?.k}
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        borderRadius: '9px',
                        padding: '7px 14px',
                        cursor: 'pointer',
                        background: tp?.bg,
                        color: tp?.c,
                        boxShadow: tp?.sh,
                      }}
                    >
                      {tp?.n}
                    </span>
                  </Fragment>
                ))}
              </div>
              <span
                style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--texto-apagado)', fontFamily: "'Spline Sans Mono',monospace" }}
              >
                {v.contagem}
              </span>
            </div>
            {v.temDica ? (
              <>
                <div
                  style={{
                    margin: '0 20px 14px',
                    padding: '11px 14px',
                    borderRadius: '13px',
                    border: '1px solid var(--borda)',
                    borderLeft: `3px solid ${v.dicaCor ?? ''}`,
                    fontSize: '13px',
                    color: 'var(--texto-2)',
                    lineHeight: '1.5',
                  }}
                >
                  {v.dica}
                </div>
              </>
            ) : null}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: v.cols,
                gap: '12px',
                padding: '12px 20px',
                background: 'var(--superficie)',
                borderTop: '1px solid var(--borda-suave)',
                borderBottom: '1px solid var(--borda-suave)',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '.7px',
                color: 'var(--texto-apagado)',
              }}
            >
              <span>TRANSPORTADOR</span>
              <span>CONJUNTOS</span>
              <span>DOCUMENTOS</span>
              <span>VIAGENS</span>
              <span>OCORRÊNCIAS</span>
              <span>CONVITE</span>
            </div>
            {(Array.isArray(v.linhas) ? v.linhas : []).map((r, $index) => (
              <Fragment key={$index}>
                <div
                  data-tx-linha={r?.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: v.cols,
                    gap: '12px',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--superficie-2)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={r?.abrir}
                    style={{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', minWidth: '0' }}
                  >
                    <span
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '99px',
                        flex: 'none',
                        background: `linear-gradient(135deg,${r?.g1 ?? ''},${r?.g2 ?? ''})`,
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 0 3px #fff,0 0 0 4.5px ${r?.anel ?? ''}`,
                      }}
                    >
                      {r?.ini}
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r?.nome}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--texto-apagado)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r?.tipo}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Spline Sans Mono',monospace",
                          fontSize: '11px',
                          color: 'var(--texto-sec)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r?.doc}
                        {' RNTRC '}
                        {r?.rntrc}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: 'var(--texto-2)', lineHeight: '1.5' }}>
                    {r?.placas}
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: r?.qc,
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '99px',
                          background: r?.qdot,
                          boxShadow: `0 0 0 3px ${r?.qring ?? ''}`,
                        }}
                      ></span>
                      {r?.qn}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '1px' }}>{r?.qsub}</div>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    <b style={{ fontFamily: "'Spline Sans Mono',monospace" }}>{r?.nv}</b>{' '}
                    <span style={{ color: 'var(--texto-apagado)' }}>{r?.ultima}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: r?.ocC, fontWeight: '700' }}>{r?.oc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: r?.cvC,
                        border: `1px solid ${r?.cvBd ?? ''}`,
                        borderRadius: '99px',
                        padding: '2px 9px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r?.cv}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={r?.cvAcao}
                      data-tx-convite={r?.id}
                      style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {r?.cvRot}
                    </span>
                  </div>
                </div>
              </Fragment>
            ))}
            {v.vazio ? (
              <>
                <div style={{ padding: '44px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>Ninguém com esse filtro</div>
                  <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>
                    Busque por CPF, placa ou nome. Se for novo, ele entra pela primeira viagem ou em Cadastrar.
                  </div>
                </div>
              </>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{v.pagInfo}</span>
              {v.temPaginacao ? (
                <>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                    {(Array.isArray(v.paginas) ? v.paginas : []).map((pg, $index) => (
                      <Fragment key={$index}>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={pg?.onClick}
                          style={{
                            fontFamily: "'Spline Sans Mono',monospace",
                            fontSize: '13px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '9px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: `1px solid ${pg?.bd ?? ''}`,
                            background: pg?.bg,
                            color: pg?.c,
                          }}
                        >
                          {pg?.n}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {v.drAberto ? (
          <>
            <div
              onClick={v.fecharDrawer}
              style={{
                position: 'fixed',
                inset: '0',
                background: 'rgba(9,34,36,.45)',
                backdropFilter: 'blur(3px)',
                zIndex: '900',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                onClick={v.pararClique}
                data-tx-drawer={v.dId}
                style={{
                  width: '560px',
                  background: 'var(--superficie)',
                  height: '100vh',
                  overflow: 'auto',
                  boxShadow: '-30px 0 80px rgba(9,34,36,.35)',
                  animation: 'deslizar .3s ease',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(130deg,var(--primario-3),var(--primario-2) 55%,var(--azul) 130%)',
                    color: '#fff',
                    padding: '24px 28px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '99px',
                        background: `linear-gradient(135deg,${v.dG1 ?? ''},${v.dG2 ?? ''})`,
                        fontSize: '16px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 0 3px rgba(255,255,255,.25)',
                      }}
                    >
                      {v.dIni}
                    </span>
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800' }}>{v.dNome}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.72)' }}>{v.dTipo}</div>
                    </div>
                    <span
                      role="button"
                      aria-label="Fechar"
                      title="Fechar"
                      tabIndex={0}
                      onClick={v.fecharDrawer}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '99px',
                        background: 'rgba(255,255,255,.12)',
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
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {(Array.isArray(v.dChips) ? v.dChips : []).map((dc, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            background: 'rgba(255,255,255,.1)',
                            border: '1px solid rgba(255,255,255,.18)',
                            borderRadius: '99px',
                            padding: '3px 10px',
                          }}
                        >
                          {dc}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {v.dOcAberta ? (
                    <>
                      <div
                        style={{
                          background: 'var(--painel)',
                          border: '1.5px solid var(--perigo-borda)',
                          borderRadius: '16px',
                          padding: '16px 16px',
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--tecnico)' }}>Em revisão após ocorrência grave</div>
                        <div style={{ fontSize: '13px', color: 'var(--texto-2)', marginTop: '4px', lineHeight: '1.5' }}>
                          {v.dOcTxt}
                        </div>{' '}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={v.abrirRevisar}
                          data-tx-revisar=""
                          style={{
                            display: 'inline-block',
                            marginTop: '10px',
                            background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: '800',
                            borderRadius: '99px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                          }}
                        >
                          Revisar e reabilitar
                        </span>{' '}
                      </div>
                    </>
                  ) : null}
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '16px', padding: '16px 16px' }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Documentos</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                      {(Array.isArray(v.dDocs) ? v.dDocs : []).map((dd, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: 'var(--superficie)',
                              borderRadius: '11px',
                              padding: '9px 12px',
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: dd?.dot, flex: 'none' }}></span>
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700' }}>{dd?.n}</div>
                              <div style={{ fontSize: '12px', color: dd?.c }}>{dd?.sub}</div>
                            </div>
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={dd?.onClick}
                              data-tx-atualizar-doc={dd?.k}
                              style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                            >
                              Atualizar
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '16px', padding: '16px 16px' }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Conjuntos</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                      {(Array.isArray(v.dConjs) ? v.dConjs : []).map((cj, $index) => (
                        <Fragment key={$index}>
                          <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '12px', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {(Array.isArray(cj?.placas) ? cj?.placas : []).map((pl, $index) => (
                                <Fragment key={$index}>
                                  <A
                                    href={pl?.href}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      fontFamily: "'Spline Sans Mono',monospace",
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      border: '1px solid var(--borda-campo)',
                                      borderRadius: '8px',
                                      padding: '3px 8px',
                                      color: 'var(--texto)',
                                    }}
                                  >
                                    <span style={{ width: '6px', height: '6px', borderRadius: '99px', background: pl?.dot }}></span>
                                    {pl?.placa}
                                  </A>
                                </Fragment>
                              ))}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '6px' }}>{cj?.sub}</div>
                          </div>
                        </Fragment>
                      ))}
                      {v.dSemConj ? (
                        <>
                          <div style={{ fontSize: '13px', color: 'var(--texto-apagado)' }}>
                            Nenhum conjunto ainda. As placas entram na primeira viagem.
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {v.dEtc ? (
                    <>
                      <div
                        style={{
                          background: 'var(--painel)',
                          border: '1px solid var(--borda)',
                          borderRadius: '16px',
                          padding: '16px 16px',
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>Motoristas da empresa</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                          {(Array.isArray(v.dMots) ? v.dMots : []).map((dm, $index) => (
                            <Fragment key={$index}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: dm?.dot }}></span>
                                <b>{dm?.n}</b>
                                <span
                                  style={{ color: 'var(--texto-apagado)', fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px' }}
                                >
                                  {dm?.cpf}
                                </span>
                                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--texto-sec)' }}>{dm?.cnh}</span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '16px', padding: '16px 16px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800' }}>Viagens</div>
                      <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--texto-apagado)' }}>{v.dViagensSub}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                      {(Array.isArray(v.dViagens) ? v.dViagens : []).map((dv, $index) => (
                        <Fragment key={$index}>
                          <A
                            href={dv?.href}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 2px',
                              borderBottom: '1px solid var(--superficie-2)',
                              color: 'inherit',
                              fontSize: '13px',
                            }}
                            className="tx-hc05ca3a"
                          >
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", width: '44px' }}>{dv?.data}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", width: '76px' }}>{dv?.ordem}</span>
                            <span style={{ flex: '1', minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {dv?.produto}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: dv?.c, fontWeight: '700' }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: dv?.c }}></span>
                              {dv?.res}
                            </span>
                          </A>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '16px', padding: '16px 16px' }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Ocorrências</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      {(Array.isArray(v.dOcs) ? v.dOcs : []).map((do_, $index) => (
                        <Fragment key={$index}>
                          <div style={{ fontSize: '13px', background: 'var(--superficie)', borderRadius: '11px', padding: '8px 11px' }}>
                            <b>{do_?.tipo}</b>{' '}
                            <span style={{ color: 'var(--texto-apagado)' }}>
                              {do_?.data}
                              {', '}
                              {do_?.grav}
                            </span>
                            <div style={{ display: do_?.descD, color: 'var(--texto-sec)', marginTop: '2px' }}>{do_?.desc}</div>
                          </div>
                        </Fragment>
                      ))}
                      {v.dSemOc ? (
                        <>
                          <div style={{ fontSize: '13px', color: 'var(--texto-apagado)' }}>Nenhuma ocorrência registrada.</div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div
                    style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '16px', padding: '16px 16px' }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Convite para manter documentos</div>
                    <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.5' }}>
                      Opcional. O transportador atualiza CNH, CRLV e RNTRC por um link próprio, sem esperar a próxima viagem. Estado:{' '}
                      <b>{v.dConvite}</b>.
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      {v.dPodeConvidar ? (
                        <>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={v.dConvidar}
                            data-tx-d-convidar=""
                            style={{
                              background: 'var(--superficie-2)',
                              fontSize: '13px',
                              fontWeight: '800',
                              borderRadius: '99px',
                              padding: '7px 14px',
                              cursor: 'pointer',
                            }}
                          >
                            {v.dConvidarRot}
                          </span>
                        </>
                      ) : null}
                      {v.dPodeRevogar ? (
                        <>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={v.dRevogar}
                            style={{
                              fontSize: '13px',
                              fontWeight: '800',
                              color: 'var(--perigo)',
                              borderRadius: '99px',
                              padding: '7px 14px',
                              cursor: 'pointer',
                            }}
                          >
                            Revogar acesso
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
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
                  width: '600px',
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
                {v.mCad ? (
                  <>
                    <div style={{ display: 'flex', gap: '7px', marginTop: '16px' }}>
                      {(Array.isArray(v.cadTipos) ? v.cadTipos : []).map((ct, $index) => (
                        <Fragment key={$index}>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={ct?.onClick}
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              borderRadius: '99px',
                              padding: '6px 14px',
                              cursor: 'pointer',
                              border: `1.5px solid ${ct?.bd ?? ''}`,
                              background: ct?.bg,
                              color: ct?.c,
                            }}
                          >
                            {ct?.n}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                      {(Array.isArray(v.cadCampos) ? v.cadCampos : []).map((cc, $index) => (
                        <Fragment key={$index}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>{cc?.l}</div>
                            <input
                              value={cc?.v ?? ''}
                              onChange={cc?.on}
                              data-tx-campo={cc?.k}
                              placeholder={cc?.ph}
                              style={{
                                width: '100%',
                                marginTop: '5px',
                                border: '1px solid var(--borda-campo)',
                                borderRadius: '11px',
                                padding: '9px 12px',
                                fontSize: '14px',
                                outline: 'none',
                              }}
                            />
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {v.cadDup ? (
                      <>
                        <div
                          style={{
                            marginTop: '10px',
                            border: '1.5px solid var(--aviso-borda)',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            fontSize: '13px',
                            color: '#8a5a0e',
                          }}
                        >
                          {v.cadDupTxt}
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}
                {v.mImp ? (
                  <>
                    <label
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: `1.5px dashed ${v.impBd ?? ''}`,
                        borderRadius: '14px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="file" accept=".csv,.xlsx" onChange={v.onImpArq} className="tx-so-leitor" />
                      <div style={{ flex: '1', fontSize: '14px', fontWeight: '800' }}>{v.impTitulo}</div>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={v.impExemplo}
                        data-tx-imp-exemplo=""
                        style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)' }}
                      >
                        usar planilha de exemplo
                      </span>
                    </label>
                    {v.impErro ? (
                      <div className="tx-erro" role="alert" data-tx-arquivo-erro="">
                        {v.impErro}
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                      {(Array.isArray(v.impLinhas) ? v.impLinhas : []).map((il, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '13px',
                              border: '1px solid var(--borda-suave)',
                              borderRadius: '11px',
                              padding: '8px 12px',
                            }}
                          >
                            <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: il?.c }}></span>
                            <b style={{ flex: '1' }}>{il?.nome}</b>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: 'var(--texto-sec)' }}>{il?.doc}</span>
                            <span style={{ color: il?.c, fontWeight: '700' }}>{il?.st}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.mDoc ? (
                  <>
                    <div style={{ marginTop: '16px', fontSize: '14px' }}>
                      <b>{v.docNome}</b> <span style={{ color: 'var(--texto-sec)' }}>{v.docAtual}</span>
                    </div>
                    <label
                      htmlFor="transportadores-validade"
                      className="tx-rotulo"
                      style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}
                    >
                      Nova validade
                    </label>
                    <input
                      id="transportadores-validade"

                      value={v.docVal ?? ''}
                      onChange={v.onDocVal}
                      data-tx-campo="validade"
                      inputMode="numeric"
                      placeholder="DD/MM/AAAA"
                      style={{
                        marginTop: '6px',
                        width: '150px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '11px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: "'Spline Sans Mono',monospace",
                      }}
                    />
                    <span style={{ marginLeft: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--perigo)' }}>{v.docAviso}</span>{' '}
                    <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '8px' }}>
                      O documento anterior continua no histórico; viagens já decididas não mudam.
                    </div>
                  </>
                ) : null}
                {v.mRev ? (
                  <>
                    <div
                      style={{
                        marginTop: '12px',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        background: v.revBg,
                        fontSize: '13px',
                        color: v.revC,
                        fontWeight: '700',
                      }}
                    >
                      {v.revTxt}
                    </div>
                    <label
                      htmlFor="transportadores-motivo"
                      className="tx-rotulo"
                      style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}
                    >
                      O que foi feito (mínimo 20 caracteres)
                    </label>
                    <textarea
                      id="transportadores-motivo"
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
                    {v.revTrocar ? (
                      <>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={v.abrirEntrar}
                          style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            fontSize: '13px',
                            fontWeight: '800',
                            color: 'var(--primario-2)',
                            cursor: 'pointer',
                          }}
                        >
                          Entrar como Direção e RT
                        </span>
                      </>
                    ) : null}
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
