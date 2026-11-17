// Transportadores: diretório de TAC e ETC. Tabela com busca, filtros e ordenação; a linha abre o drawer com abas
// (Dados, Documentos, Conjuntos, Ocorrências). Ações destrutivas no menu da linha ou no drawer, sempre com confirmação.
'use client';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Botao,
  Campo,
  Entrada,
  CampoData,
  EntradaCaixa,
  Chip,
  Escolhas,
  Situacao,
  Badge,
  Aviso,
  Abas,
  Tabela,
  TabelaCabecalho,
  TabelaEsqueleto,
  TabelaRodape,
  Paginacao,
  Cartao,
  EstadoVazio,
  Modal,
  Drawer,
  textoFalta,
} from '@/components/ui';
import './Frota.css';
import './Transportadores.css';

const COLS = 'minmax(220px,1.4fr) minmax(170px,1fr) minmax(0,1.3fr) minmax(0,.7fr) minmax(0,.8fr) 120px 40px';
const pode = (op, alvo) => (TX.pode ? TX.pode(op, alvo) : true);
const porque = (op, alvo) => (TX.porque ? TX.porque(op, alvo) : '') || '';
const TOM_DOC = { ok: 'ok', vence: 'falta', vencido: 'bloqueio', falta: 'bloqueio' };
const PESO_DOC = { vencido: 0, falta: 1, vence: 2, ok: 3 };
const TOM_Q = { apto: 'ok', restricao: 'falta', pendente: 'falta', bloqueado: 'bloqueio' };
const CONVITE = {
  nao_convidado: { n: 'não convidado', tom: 'neutro' },
  enviado: { n: 'convite enviado', tom: 'info' },
  aceito: { n: 'acesso ativo', tom: 'ok' },
  expirado: { n: 'convite expirado', tom: 'aviso' },
  revogado: { n: 'acesso revogado', tom: 'perigo' },
};

const LUPA = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const PONTOS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="3.5" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.5" cy="8" r="1.4" />
  </svg>
);
const PREDIO = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
    <path d="M3 14V3.5L9 2v12M9 6h4v8M1.5 14h13M5.5 5.5v.1M5.5 8.5v.1M5.5 11.5v.1" strokeLinecap="round" />
  </svg>
);
const MAIS = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M8 3v10M3 8h10" />
  </svg>
);
const SETA = (d) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

export default class Transportadores extends Tela {
  state = { loading: true, busca: '', tipo: 'todos', filtro: 'todos', drawer: null, modal: null, ordem: 'nome', dir: 1, menuOpen: false };
  componentDidMount() {
    TX.ui.montar(this);
    const id = TX.ui.param('id');
    const f = TX.ui.param('filtro');
    const aba = TX.ui.param('aba');
    this.setState({
      drawer: id && TX.transportador(id) ? id : null,
      dAba: ['dados', 'documentos', 'conjuntos', 'ocorrencias'].includes(aba) ? aba : null,
      filtro: f === 'vencendo' ? 'docs' : 'todos',
    });
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  abrir(id) {
    this.setState({ drawer: id, dAba: null, menuOpen: false });
    try {
      TX.ui.trocarUrl('/transportadores?id=' + id);
    } catch (e) {}
  }
  // Ações do convite. Revogar sempre passa pela confirmação.
  convidar(t, nome) {
    if (!pode('convidar', t.id)) return this.avisar(porque('convidar', t.id));
    TX.fazer('convidar', { transportador: t.id, acao: 'convidar' });
    this.setState({ menuOpen: false });
    this.avisar('Convite enviado por WhatsApp para ' + nome + '. Vale 7 dias.');
  }
  pedirRevogar(t) {
    const g = typeof document !== 'undefined' && document.querySelector('[data-tx-menu="' + t.id + '"]');
    if (g && !this.state.drawer) g.focus();
    this.setState({ menuOpen: false, modal: 'revogar', alvo: t.id });
  }
  renderVals() {
    return Object.assign({}, TX.ui.base(this), this.telaVals(), this.drawerVals(), this.modalVals());
  }
  info(t) {
    const F = TX.fmt;
    const nome = TX.nomeTransportador(t);
    const p = t.tipo === 'TAC' ? TX.pessoa(t.pessoa) : null;
    const q = TX.qualificacao(t);
    const vs = TX.db.viagens.filter((v) => v.transportador === t.id && !v.cancelada).sort((a, b) => b.data.localeCompare(a.data));
    const ocs = TX.db.ocorrencias.filter((o) => o.transportador === t.id);
    const placas = (t.conjuntos || []).flatMap((c) => TX.placasDoConjunto(c));
    const busca = TX.norm(
      [nome, p && p.cpf, p && p.telefone, t.cnpj, t.telefone, t.rntrc && t.rntrc.numero, placas.join(' ')]
        .concat((t.motoristas || []).map((m) => TX.pessoa(m).nome + ' ' + TX.pessoa(m).cpf))
        .join(' '),
    );
    // Documentos do transportador com a mesma regra da qualificação, do pior para o melhor.
    const docs = [];
    const dd = (k, n, val, tipo, ref, refNome, numero) => {
      const d = TX.docEstado(val);
      docs.push({
        k,
        n,
        estado: d.estado,
        rotulo: d.rotulo,
        tom: TOM_DOC[d.estado],
        doc: { tipo, ref, refNome, n, numero, atual: d.rotulo },
      });
    };
    dd(
      'rntrc',
      'RNTRC' + (t.rntrc ? ' ' + t.rntrc.numero : ''),
      t.rntrc && t.rntrc.validade,
      'RNTRC',
      t.id,
      nome,
      t.rntrc && t.rntrc.numero,
    );
    if (t.certificado)
      dd('cert', 'Certificado ' + t.certificado.numero, t.certificado.validade, 'Certificado GMP+', t.id, nome, t.certificado.numero);
    (t.tipo === 'TAC' ? [t.pessoa] : t.motoristas || []).forEach((pid) => {
      const ps = TX.pessoa(pid);
      if (ps) dd('cnh-' + pid, 'CNH de ' + ps.nome, ps.cnh && ps.cnh.validade, 'CNH', ps.id, ps.nome, ps.cnh && ps.cnh.numero);
    });
    placas.forEach((pl) => {
      const pp = TX.placa(pl);
      dd('crlv-' + pl, 'CRLV ' + pl, pp && pp.crlv && pp.crlv.validade, 'CRLV', pl, pl, '');
    });
    docs.sort((a, b) => PESO_DOC[a.estado] - PESO_DOC[b.estado]);
    const ruins = docs.filter((d) => d.estado !== 'ok');
    return { t, nome, p, q, vs, ocs, placas, busca, docs, ruins, ultima: vs[0] ? vs[0].data : '', ini: F.iniciais(nome) };
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
      convite: (x) => x.t.convite.estado === 'enviado',
      dia: (x) => x.q.k === 'apto',
    };
    const ORD = {
      nome: (a, b) => a.nome.localeCompare(b.nome),
      docs: (a, b) =>
        (a.ruins[0] ? PESO_DOC[a.ruins[0].estado] : 9) - (b.ruins[0] ? PESO_DOC[b.ruins[0].estado] : 9) || a.nome.localeCompare(b.nome),
      ultima: (a, b) => (a.ultima || '').localeCompare(b.ultima || '') || a.nome.localeCompare(b.nome),
    };
    const lista = todos
      .filter(
        (x) =>
          (s.tipo === 'todos' || x.t.tipo === s.tipo) &&
          FILT[s.filtro](x) &&
          (!qn || x.busca.includes(qn) || (qd.length >= 4 && TX.soDigitos(x.busca).includes(qd))),
      )
      .sort((a, b) => s.dir * ORD[s.ordem](a, b));
    this._lista = lista.map((x) => x.t.id);
    const pg = U.paginar(this, lista, 'transportadores');
    const ABAS = [
      ['todos', 'Todos', 'na'],
      ['docs', 'Documento a resolver', 'aviso'],
      ['revisao', 'Em revisão', 'perigo'],
      ['convite', 'Convite pendente', 'info'],
      ['dia', 'Em dia', 'ok'],
    ];
    const DICA = {
      docs: 'Documento vencido ou vencendo em 15 dias. O aviso sai aos 60, 30 e 15 dias; abra o transportador para atualizar.',
      revisao: 'Ocorrência grave sem revisão: viagem assegurada fica suspensa até a Direção e RT revisar.',
      convite: 'Convite enviado e ainda não aceito. O convite deixa o próprio transportador manter os documentos.',
    };
    const podeConv = pode('convidar');
    const ordenar = (k) => () => this.setState({ ordem: k, dir: s.ordem === k ? -s.dir : 1, pag: 1 });
    const sortDe = (k) => (s.ordem === k ? (s.dir === 1 ? 'ascending' : 'descending') : 'none');
    return Object.assign(
      {
        contagem: todos.length + ' transportadores',
        podeCad: pode('cadastrarTransportador'),
        abas: ABAS.map(([k, n, tom]) => ({
          k,
          n,
          q: todos.filter((x) => (s.tipo === 'todos' || x.t.tipo === s.tipo) && FILT[k](x)).length,
          tom,
          on: s.filtro === k,
          onClick: () => this.setState({ filtro: k, pag: 1 }),
        })),
        busca: s.busca,
        onBusca: (e) => this.setState({ busca: e.target.value, pag: 1 }),
        tipos: [
          ['todos', 'TAC e ETC'],
          ['TAC', 'TAC'],
          ['ETC', 'ETC'],
        ].map(([k, n]) => ({ k, n, on: s.tipo === k, onClick: () => this.setState({ tipo: k, pag: 1 }) })),
        dica: DICA[s.filtro] || '',
        ordenar,
        sortDe,
        temFiltro: !!qn || s.filtro !== 'todos' || s.tipo !== 'todos',
        limpar: () => this.setState({ busca: '', filtro: 'todos', tipo: 'todos', pag: 1 }),
        linhas: s.loading
          ? []
          : pg.itens.map((x) => {
              const t = x.t;
              const ocAb = x.ocs.filter((o) => o.gravidade === 'grave' && !o.revisao).length;
              const cv = t.convite.estado;
              const pior = x.ruins[0];
              return {
                id: t.id,
                nome: x.nome,
                empresa: t.tipo === 'ETC',
                ini: x.ini,
                tipo:
                  t.tipo === 'TAC'
                    ? 'TAC' + (t.cadastroMinimo ? ', cadastro mínimo' : '')
                    : 'ETC' + (t.cobertura === 'certificado' ? ', certificada GMP+' : ''),
                doc: x.p ? F.cpfMascara(x.p.cpf) : t.cnpj,
                placas: x.placas.slice(0, 2),
                placasMais: x.placas.length > 2 ? '+' + (x.placas.length - 2) : '',
                placasTodas: x.placas.join(', '),
                qTom: TOM_Q[x.q.k] || 'na',
                qn: x.q.k === 'apto' ? 'Em dia' : x.q.n,
                qSub: pior ? pior.n + ' ' + pior.rotulo : x.q.k === 'bloqueado' ? 'ocorrência grave sem revisão' : '',
                nv: x.vs.length,
                ultima: x.vs[0] ? 'última ' + F.curta(x.vs[0].data) : 'nenhuma',
                oc: ocAb
                  ? ocAb + (ocAb === 1 ? ' grave aberta' : ' graves abertas')
                  : x.ocs.length
                    ? x.ocs.length + (x.ocs.length === 1 ? ' revisada' : ' revisadas')
                    : 'nenhuma',
                ocTom: ocAb ? 'perigo' : x.ocs.length ? 'aviso' : '',
                cv: CONVITE[cv],
                aberta: s.drawer === t.id,
                abrir: () => this.abrir(t.id),
                menuAberto: s.menuOpen === t.id,
                alternarMenu: (e) => {
                  e.stopPropagation();
                  this.setState({ menuOpen: s.menuOpen === t.id ? false : t.id });
                },
                podeConv,
                convRot:
                  cv === 'nao_convidado'
                    ? 'Convidar a manter os documentos'
                    : cv === 'revogado'
                      ? 'Convidar de novo'
                      : cv === 'aceito'
                        ? ''
                        : 'Reenviar convite',
                convidar: () => this.convidar(t, x.nome),
                podeRevogar: cv === 'aceito' || cv === 'enviado',
                revogar: () => this.pedirRevogar(t),
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
    if (!s.drawer) return { drAberto: false };
    const x = this.info(TX.transportador(s.drawer)),
      t = x.t;
    const oc = TX.ocorrenciaGraveAberta(t.id);
    const lista = this._lista || [];
    const idx = lista.indexOf(t.id);
    const aba = s.dAba || (x.ruins.length ? 'documentos' : 'dados');
    const podeDocs = pode('atualizarDocumento');
    const cv = t.convite.estado;
    const ocsAbertas = x.ocs.filter((o) => o.gravidade === 'grave' && !o.revisao).length;
    return {
      drAberto: true,
      dId: t.id,
      fecharDrawer: () => {
        this.setState({ drawer: null });
        try {
          TX.ui.trocarUrl('/transportadores');
        } catch (e) {}
      },
      dAnterior: idx > 0 ? () => this.abrir(lista[idx - 1]) : null,
      dProximo: idx >= 0 && idx < lista.length - 1 ? () => this.abrir(lista[idx + 1]) : null,
      dPosicao: idx >= 0 ? idx + 1 + ' de ' + lista.length : '',
      dNome: x.nome,
      dEmpresa: t.tipo === 'ETC',
      dIni: x.ini,
      dSub: t.tipo === 'TAC' ? 'Transportador autônomo (TAC)' : 'Empresa de transporte (ETC), ' + t.cidade,
      dSelos: [
        { n: t.cobertura === 'certificado' ? 'certificada GMP+' : 'gatekeeper: qualificado viagem a viagem', tom: 'marca' },
        { n: x.q.k === 'apto' ? 'Em dia' : x.q.n, tom: { ok: 'ok', falta: 'aviso', bloqueio: 'perigo' }[TOM_Q[x.q.k]] || 'neutro' },
        { n: CONVITE[cv].n, tom: CONVITE[cv].tom },
      ],
      dOcAberta: !!oc,
      dOcTitulo: oc ? 'Em revisão após ocorrência grave.' : '',
      dOcTxt: oc
        ? oc.id + ', ' + F.data(oc.em.slice(0, 10)) + ': ' + oc.descricao + ' Viagens asseguradas ficam suspensas até a revisão da Direção.'
        : '',
      abrirRevisar: () => this.setState({ modal: 'revisar', fMotivo: '', tentou: false }),
      aba,
      dAbas: [
        { k: 'dados', n: 'Dados' },
        { k: 'documentos', n: 'Documentos', q: x.ruins.length },
        { k: 'conjuntos', n: 'Conjuntos', q: 0 },
        { k: 'ocorrencias', n: 'Ocorrências', q: ocsAbertas, qTom: 'perigo' },
      ].map((a) => ({ ...a, ativa: aba === a.k, onClick: () => this.setState({ dAba: a.k }) })),
      // Dados
      dDados: [
        ['Tipo', t.tipo === 'TAC' ? 'TAC, pessoa física' : 'ETC, empresa'],
        [t.tipo === 'TAC' ? 'CPF' : 'CNPJ', x.p ? F.cpfMascara(x.p.cpf) : t.cnpj],
        ['Telefone', (x.p ? x.p.telefone : t.telefone) || 'não informado'],
        ['RNTRC', t.rntrc ? t.rntrc.numero : 'não informado'],
        ['Na base desde', F.data(t.desde)],
      ],
      dEtc: t.tipo === 'ETC',
      dMots: (t.motoristas || []).map((m) => {
        const p = TX.pessoa(m);
        const d = TX.docEstado(p.cnh && p.cnh.validade);
        return { id: m, n: p.nome, cpf: F.cpfMascara(p.cpf), cnh: 'CNH ' + d.rotulo, tom: TOM_DOC[d.estado] };
      }),
      dViagens: x.vs.slice(0, 8).map((v) => {
        const dec = TX.decidir(v);
        const cic = TX.ciclo(v);
        return {
          id: v.id,
          href: '/viagem?id=' + v.id,
          data: F.curta(v.data),
          ordem: v.ordem,
          produto: TX.produto(v.produto).nome,
          tom: cic.k === 'concluida' ? 'ok' : U.tomResultado(dec).k || 'na',
          res: cic.k === 'concluida' ? 'Concluída' : dec.rotulo,
        };
      }),
      dConvite: {
        nao_convidado: 'Não convidado.',
        enviado: 'Convite enviado em ' + F.curta(t.convite.em || '') + ', ainda não aceito.',
        aceito: 'Acesso ativo desde ' + F.curta(t.convite.em || '') + '.',
        expirado: 'Convite expirado sem aceite.',
        revogado: 'Acesso revogado.',
      }[cv],
      dPodeConvidar: pode('convidar') && cv !== 'aceito',
      dConvidarRot: cv === 'enviado' || cv === 'expirado' ? 'Reenviar convite' : cv === 'revogado' ? 'Convidar de novo' : 'Enviar convite',
      dPodeRevogar: pode('convidar') && (cv === 'aceito' || cv === 'enviado'),
      dConvidar: () => this.convidar(t, x.nome),
      dRevogar: () => this.pedirRevogar(t),
      // Documentos
      podeDocs,
      dDocs: x.docs.map((d) => ({
        ...d,
        nao: pode('atualizarDocumento', d.doc.ref) ? '' : porque('atualizarDocumento', d.doc.ref),
        atualizar: () => {
          if (!pode('atualizarDocumento', d.doc.ref)) return this.avisar(porque('atualizarDocumento', d.doc.ref));
          const val = TX.addDias(TX.HOJE, 365);
          this.setState({
            modal: 'doc',
            fDoc: d.doc,
            fVal: val,
            fValTxt: F.data(val),
            fNum: d.doc.numero || '',
            fArq: '',
            fArqErro: '',
            tentou: false,
          });
        },
      })),
      // Conjuntos
      dConjs: (t.conjuntos || []).map((cid) => {
        const comps = TX.compsDoConjunto(cid);
        return {
          id: cid,
          compsTxt: comps.length === 1 ? '1 compartimento' : comps.length + ' compartimentos',
          placas: TX.placasDoConjunto(cid).map((pl, i) => {
            const p = TX.placa(pl);
            const d = TX.docEstado(p.crlv && p.crlv.validade);
            return {
              placa: pl,
              cavalo: i === 0,
              crlv: 'CRLV ' + d.rotulo,
              tom: TOM_DOC[d.estado],
              comps: comps
                .filter((k) => k.placa === pl)
                .map((k) => ({ n: k.placa + ' ' + k.pos, href: '/compartimento?placa=' + encodeURIComponent(k.placa) + '&pos=' + k.pos })),
            };
          }),
        };
      }),
      // Ocorrências: a grave sem revisão já está descrita no alerta do topo; aqui fica só a linha.
      dOcs: x.ocs.map((o) => {
        const noTopo = o.gravidade === 'grave' && !o.revisao;
        return {
          id: o.id,
          tipo: o.tipo,
          data: F.data(o.em.slice(0, 10)),
          tom: o.gravidade === 'grave' ? (o.revisao ? 'ok' : 'bloqueio') : 'falta',
          grav: o.gravidade + (o.revisao ? ', revisada' : noTopo ? ', descrita no alerta acima' : ''),
          desc: noTopo ? '' : o.descricao,
        };
      }),
    };
  }
  modalVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      m = s.modal;
    const base = {
      mK: m || '',
      fecharModal: () => this.setState({ modal: null }),
      abrirCadastro: () =>
        this.setState({ modal: 'cadastro', cTipo: 'TAC', cNome: '', cDoc: '', cTel: '', cPlacas: '', cCidade: '', tentou: false }),
      abrirImportar: () => this.setState({ modal: 'importar', imp: null, impErro: '' }),
    };
    // Primário inativo leva ao primeiro campo que falta (padrão "Falta:").
    const fim = (faltas, rot, fn, primeiro) => ({
      mOk: !faltas.length,
      mFalta: textoFalta(faltas),
      mCta: rot,
      confirmar: () => {
        if (faltas.length) {
          this.setState({ tentou: true });
          const c = primeiro && document.querySelector('[data-tx-campo="' + primeiro + '"]');
          if (c) c.focus();
          return;
        }
        fn();
      },
    });
    if (m === 'cadastro') {
      const tac = s.cTipo === 'TAC';
      const dig = TX.soDigitos(s.cDoc);
      const dup =
        dig.length >= 8
          ? TX.db.transportadores.find((t) => (t.tipo === 'TAC' ? TX.soDigitos(TX.pessoa(t.pessoa).cpf) : TX.soDigitos(t.cnpj)) === dig)
          : null;
      const brutas = (s.cPlacas || '')
        .toUpperCase()
        .split(/[,;\s]+(?=[A-Z]{3})/)
        .map((x) => x.trim())
        .filter(Boolean);
      const chips = brutas.map((b) => {
        const n = b.replace(/[^A-Z0-9]/g, '');
        const ok = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(n);
        const pl = ok ? n.slice(0, 3) + ' ' + n.slice(3) : b;
        const ja = ok && TX.placa(pl);
        return { pl, ok, ja: !!ja, dono: ja ? TX.nomeTransportador(ja.dono === 'propria' ? null : ja.dono) : '' };
      });
      const placas = chips.filter((c) => c.ok && !c.ja).map((c) => c.pl);
      const placaRuim = chips.find((c) => !c.ok);
      const placaDup = chips.find((c) => c.ja);
      const nomeOk = (s.cNome || '').trim().length >= 5;
      const docOk = dig.length === (tac ? 11 : 14);
      const faltas = [
        nomeOk ? '' : tac ? 'nome' : 'razão social',
        docOk ? '' : tac ? 'CPF' : 'CNPJ',
        dup ? (tac ? 'CPF novo' : 'CNPJ novo') : '',
        placaRuim || placaDup ? 'placas válidas' : '',
      ].filter(Boolean);
      const campo = (k, l, ph, extra) => ({ k, l, ph, v: s[k] || '', on: (e) => this.setState({ [k]: e.target.value }), ...(extra || {}) });
      return Object.assign(
        base,
        {
          mTitulo: 'Cadastrar transportador',
          mSub: 'Nasce sem convite e com documentos faltando. O resto vem pelo link da primeira viagem.',
          cadTac: tac,
          cadTipos: [
            ['TAC', 'TAC (pessoa)'],
            ['ETC', 'ETC (empresa)'],
          ].map(([k, n]) => ({ k, n, on: s.cTipo === k, onClick: () => this.setState({ cTipo: k }) })),
          cadCampos: tac
            ? [
                campo('cNome', 'Nome completo', 'Nome como na CNH', { erro: s.tentou && !nomeOk ? 'Escreva o nome completo.' : '' }),
                campo('cDoc', 'CPF', '000.000.000-00', { mono: true, erro: s.tentou && !docOk ? 'CPF com 11 dígitos.' : '' }),
                campo('cTel', 'Telefone', '(66) 99999-0000', { opcional: true }),
              ]
            : [
                campo('cNome', 'Razão social', 'Transportes Exemplo Ltda', { erro: s.tentou && !nomeOk ? 'Escreva a razão social.' : '' }),
                campo('cDoc', 'CNPJ', '00.000.000/0000-00', { mono: true, erro: s.tentou && !docOk ? 'CNPJ com 14 dígitos.' : '' }),
                campo('cTel', 'Telefone', '(66) 3000-0000', { opcional: true }),
                campo('cCidade', 'Cidade', 'Sorriso MT', { opcional: true }),
              ],
          cPlacas: s.cPlacas || '',
          onPlacas: (e) => this.setState({ cPlacas: e.target.value }),
          chips,
          erroPlacas: placaRuim
            ? '"' + placaRuim.pl + '" não é placa. Use o formato ABC1D23 ou ABC1234.'
            : placaDup
              ? 'A placa ' + placaDup.pl + ' já está na base, de ' + placaDup.dono + '.'
              : '',
          cadDup: !!dup,
          cadDupNome: dup ? TX.nomeTransportador(dup) : '',
          cadDupId: dup ? dup.id : '',
          abrirDup: () => dup && this.setState({ modal: null, drawer: dup.id, dAba: null }),
          cadDocRot: tac ? 'CPF' : 'CNPJ',
        },
        fim(
          faltas,
          'Cadastrar',
          () => {
            const id = TX.fazer(
              'cadastrarTransportador',
              tac
                ? { tipo: 'TAC', nome: s.cNome.trim(), cpf: s.cDoc, telefone: s.cTel, placas }
                : { tipo: 'ETC', nome: s.cNome.trim(), cnpj: s.cDoc, telefone: s.cTel, cidade: s.cCidade },
            );
            this.setState({ modal: null, drawer: id, dAba: null });
            this.avisar(s.cNome.trim() + ' cadastrado, ainda sem convite.');
          },
          !nomeOk ? 'cNome' : 'cDoc',
        ),
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
          mSub: 'Cada linha nasce sem convite e sem documento. Quem já existe (mesmo CPF ou CNPJ) fica de fora.',
          imp: s.imp || '',
          impErro: s.impErro || '',
          onImpArq: (e) => {
            const f = e.target.files && e.target.files[0];
            const erro = U.conferirArquivo(f, ['.csv', '.xlsx'], 'planilha');
            e.target.value = '';
            this.setState({ impErro: erro });
            if (f && !erro) this.setState({ imp: f.name });
          },
          impExemplo: () => this.setState({ imp: 'tacs-safra-2026.xlsx', impErro: '' }),
          baixarModelo: () => {
            try {
              const csv = 'nome;cpf;telefone;placas\nMaria Exemplo;000.000.000-00;(66) 99999-0000;ABC1D23 ABC1D24\n';
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
              a.download = 'modelo-transportadores.csv';
              a.click();
              setTimeout(() => URL.revokeObjectURL(a.href), 2000);
            } catch (e) {
              this.avisar('Não foi possível baixar o modelo neste navegador.');
            }
          },
          impResumo: s.imp
            ? novos.length +
              (novos.length === 1 ? ' novo' : ' novos') +
              ', ' +
              (linhas.length - novos.length) +
              ' já na base ficam de fora.'
            : '',
          impLinhas: linhas.map((l) => {
            const d = exist.has(l.cpf);
            return {
              k: l.cpf,
              nome: l.nome,
              doc: F.cpfMascara(l.cpf),
              st: d ? 'já existe, fica de fora' : 'novo, sem documento',
              tom: d ? 'aviso' : 'ok',
            };
          }),
        },
        fim(
          s.imp ? (novos.length ? [] : ['linha nova na planilha']) : ['planilha'],
          novos.length ? 'Importar ' + novos.length : 'Importar',
          () => {
            novos.forEach((l) =>
              TX.fazer('cadastrarTransportador', { tipo: 'TAC', nome: l.nome, cpf: l.cpf, telefone: l.tel, placas: l.placas }),
            );
            this.setState({ modal: null, filtro: 'docs', pag: 1 });
            this.avisar(novos.length + ' transportadores importados, todos sem documento. O filtro mostra quem falta.');
          },
        ),
      );
    }
    if (m === 'doc') {
      const d = s.fDoc || {};
      const numOk = (s.fNum || '').trim().length >= 4;
      const valOk = !!s.fVal && s.fVal > TX.HOJE;
      return Object.assign(
        base,
        {
          mTitulo: 'Atualizar ' + (d.n || 'documento'),
          mSub:
            'Hoje: ' +
            (d.atual || '') +
            '. Use quando o documento renovado chegou por fora do link (e-mail, balcão). O anterior continua no histórico.',
          docTipo: d.tipo,
          fNum: s.fNum || '',
          onNum: (e) => this.setState({ fNum: e.target.value }),
          erroNum: s.tentou && !numOk ? 'Informe o número do documento.' : '',
          docVal: s.fValTxt || '',
          onDocVal: (t) => this.setState({ fValTxt: t, fVal: U.dataIso(t) || '' }),
          docAviso: U.avisoData(s.fValTxt) || (s.fVal && s.fVal <= TX.HOJE ? 'A nova validade tem que ser depois de hoje.' : ''),
          fArq: s.fArq || '',
          fArqErro: s.fArqErro || '',
          onArq: (e) => {
            const f = e.target.files && e.target.files[0];
            const erro = U.conferirArquivo(f, ['.pdf', '.jpg', '.jpeg', '.png'], 'PDF ou foto');
            e.target.value = '';
            this.setState({ fArqErro: erro, fArq: f && !erro ? f.name : s.fArq || '' });
          },
        },
        fim(
          [numOk ? '' : 'número', valOk ? '' : 'validade'].filter(Boolean),
          'Salvar',
          () => {
            TX.fazer('atualizarDocumento', {
              tipo: d.tipo,
              ref: d.ref,
              refNome: d.refNome,
              validade: s.fVal,
              numero: s.fNum.trim(),
              arquivo: s.fArq || null,
            });
            this.setState({ modal: null });
            this.avisar(d.tipo + ' atualizado. Viagens de hoje deste transportador já foram reavaliadas.');
          },
          numOk ? 'validade' : 'numero',
        ),
      );
    }
    if (m === 'revisar') {
      const u = TX.sessao();
      const podeRev = TX.pode ? TX.pode('revisarTransportador', s.drawer) : u.alcada === 'direcao';
      const motivoOk = (s.fMotivo || '').trim().length >= 20;
      const direcao = TX.db.usuarios.find((x) => x.papel === 'direcao' || x.alcada === 'direcao');
      return Object.assign(
        base,
        {
          mTitulo: podeRev ? 'Revisar e reabilitar' : 'Pedir revisão à Direção e RT',
          mSub: podeRev
            ? 'A revisão encerra a suspensão. A ocorrência continua no histórico do transportador.'
            : 'Só a Direção e RT reabilita depois de ocorrência grave. O pedido vai com o que já foi feito.',
          revPode: podeRev,
          revQuem: podeRev ? 'Você assina como ' + u.cargo + '.' : 'Vai para ' + (direcao ? direcao.nome : 'a Direção e RT') + '.',
          fMotivo: s.fMotivo || '',
          onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
          erroMotivo: s.tentou && !motivoOk ? 'Descreva o que foi feito, com pelo menos 20 caracteres.' : '',
        },
        fim(
          motivoOk ? [] : ['o que foi feito'],
          podeRev ? 'Reabilitar' : 'Pedir revisão',
          () => {
            if (podeRev) {
              TX.fazer('revisarTransportador', { transportador: s.drawer, motivo: s.fMotivo.trim() });
              this.setState({ modal: null });
              this.avisar('Transportador reabilitado. As viagens de hoje dele foram reavaliadas.');
              return;
            }
            try {
              TX.fazer('pedirRevisao', { transportador: s.drawer, motivo: s.fMotivo.trim() });
              this.setState({ modal: null });
              this.avisar('Pedido de revisão enviado a ' + (direcao ? direcao.nome : 'Direção e RT') + '.');
            } catch (e) {
              this.setState({ modal: null });
              this.avisar(
                'O pedido ainda não é registrado pelo sistema. Avise ' + (direcao ? direcao.nome : 'a Direção e RT') + ' para revisar.',
              );
            }
          },
          'motivo',
        ),
      );
    }
    if (m === 'revogar') {
      const t = TX.transportador(s.alvo);
      const nome = t ? TX.nomeTransportador(t) : '';
      return Object.assign(base, {
        mTitulo: 'Revogar o acesso de ' + nome + '?',
        mSub: 'O link próprio do transportador para de funcionar e ele não atualiza mais os documentos por conta própria. Documentos, viagens e ocorrências continuam no histórico. Para voltar, é preciso um convite novo.',
        mOk: true,
        mFalta: '',
        mCta: 'Revogar acesso',
        confirmar: () => {
          TX.fazer('convidar', { transportador: s.alvo, acao: 'revogar' });
          this.setState({ modal: null });
          this.avisar('Acesso de ' + nome + ' revogado. O histórico continua.');
        },
      });
    }
    return Object.assign(base, { mOk: false, mFalta: '', mCta: '', confirmar: () => {} });
  }

  renderLinha(r) {
    return (
      <div
        key={r.id}
        role="row"
        data-tx-linha={r.id}
        aria-selected={r.aberta || undefined}
        className="tx-tabela__linha tx-transp-linha"
        onClick={r.abrir}
      >
        <span role="cell" style={{ minWidth: 0 }}>
          <button type="button" className="tx-transp-nome" onClick={r.abrir} aria-label={'Abrir ' + r.nome}>
            <span className={'tx-transp-avatar' + (r.empresa ? ' tx-transp-avatar--empresa' : '')} aria-hidden>
              {r.empresa ? PREDIO : r.ini}
            </span>
            <span className="tx-tabela__celula">
              <span className="tx-tabela__forte">{r.nome}</span>
              <span className="tx-tabela__sub">
                {r.tipo}, <span className="tx-mono">{r.doc}</span>
              </span>
            </span>
          </button>
        </span>
        <span role="cell" className="tx-frota-placas" title={r.placasTodas || undefined}>
          {r.placas.length ? (
            r.placas
              .map((p, i) => (
                <span key={p} className={'tx-frota-placa' + (i === 0 ? ' tx-frota-placa--cavalo' : '')}>
                  {p}
                </span>
              ))
              .concat(
                r.placasMais
                  ? [
                      <span key="mais" className="tx-tipo-legenda tx-apagado">
                        {r.placasMais}
                      </span>,
                    ]
                  : [],
              )
          ) : (
            <span className="tx-apagado">sem conjunto</span>
          )}
        </span>
        <span role="cell" style={{ minWidth: 0 }}>
          <Situacao tom={r.qTom} detalhe={r.qSub || undefined}>
            {r.qn}
          </Situacao>
        </span>
        <span role="cell" className="tx-tabela__celula">
          <span className="tx-tabela__forte num">{r.nv}</span>
          <span className="tx-tabela__sub">{r.ultima}</span>
        </span>
        <span role="cell" className={r.ocTom === 'perigo' ? 'tx-transp-perigo tx-peso-700' : 'tx-sec'}>
          {r.oc}
        </span>
        <span role="cell">
          <Badge tom={r.cv.tom}>{r.cv.n}</Badge>
        </span>
        <span role="cell" className="tx-frota-menu-ancora" data-tx-pop="" onClick={(e) => e.stopPropagation()}>
          <Botao
            variante="icone"
            aria-label={'Ações de ' + r.nome}
            aria-haspopup="menu"
            aria-expanded={r.menuAberto}
            data-tx-menu={r.id}
            onClick={r.alternarMenu}
            icone={PONTOS}
          />
          {r.menuAberto ? (
            <div role="menu" className="tx-frota-menu" aria-label={'Ações de ' + r.nome}>
              <button type="button" role="menuitem" className="tx-frota-menu__item" onClick={r.abrir}>
                Abrir o transportador
              </button>
              {r.podeConv && r.convRot ? (
                <button type="button" role="menuitem" className="tx-frota-menu__item" onClick={r.convidar} data-tx-convite={r.id}>
                  {r.convRot}
                </button>
              ) : null}
              {r.podeConv && r.podeRevogar ? (
                <>
                  <span className="tx-frota-menu__sep" aria-hidden />
                  <button
                    type="button"
                    role="menuitem"
                    className="tx-frota-menu__item tx-frota-menu__item--perigo"
                    onClick={r.revogar}
                    data-tx-revogar={r.id}
                  >
                    Revogar acesso...
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </span>
      </div>
    );
  }

  renderDrawer(v) {
    return (
      <Drawer
        id="transp"
        data-tx-drawer={v.dId}
        className="tx-transp-drawer"
        titulo={v.dNome}
        sub={v.dSub}
        avatar={v.dEmpresa ? PREDIO : v.dIni}
        aoFechar={v.fecharDrawer}
        rodape={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-1)', marginRight: 'auto' }}>
            <Botao
              variante="icone"
              aria-label="Transportador anterior"
              desabilitado={!v.dAnterior}
              onClick={v.dAnterior || undefined}
              icone={SETA('M10 3.5 5.5 8l4.5 4.5')}
            />
            <Botao
              variante="icone"
              aria-label="Próximo transportador"
              desabilitado={!v.dProximo}
              onClick={v.dProximo || undefined}
              icone={SETA('M6 3.5 10.5 8 6 12.5')}
            />
            <span className="tx-tipo-legenda tx-apagado num">{v.dPosicao}</span>
          </div>
        }
      >
        <div className="tx-transp-selos">
          {v.dSelos.map((x) => (
            <Badge key={x.n} tom={x.tom}>
              {x.n}
            </Badge>
          ))}
        </div>
        {v.dOcAberta ? (
          <Aviso
            tom="perigo"
            titulo={v.dOcTitulo}
            acao={
              <Botao tamanho="p" variante="primario" onClick={v.abrirRevisar} data-tx-revisar="">
                Revisar e reabilitar
              </Botao>
            }
          >
            {v.dOcTxt}
          </Aviso>
        ) : null}
        <Abas rotulo="Seções do transportador" itens={v.dAbas} />
        <div className="tx-transp-painel" role="tabpanel" aria-label={v.dAbas.find((a) => a.ativa).n}>
          {v.aba === 'dados' ? this.renderDados(v) : null}
          {v.aba === 'documentos' ? this.renderDocs(v) : null}
          {v.aba === 'conjuntos' ? this.renderConjs(v) : null}
          {v.aba === 'ocorrencias' ? this.renderOcs(v) : null}
        </div>
      </Drawer>
    );
  }
  renderDados(v) {
    return (
      <>
        <dl className="tx-frota-dados">
          {v.dDados.map(([k, val]) => (
            <span key={k} style={{ display: 'contents' }}>
              <dt>{k}</dt>
              <dd className={/CPF|CNPJ|RNTRC/.test(k) ? 'tx-mono' : ''}>{val}</dd>
            </span>
          ))}
        </dl>
        {v.dEtc ? (
          <section className="tx-transp-secao" aria-labelledby="transp-mots">
            <h3 id="transp-mots" className="tx-tipo-titulo">
              Motoristas da empresa
            </h3>
            <ul className="tx-frota-lista">
              {v.dMots.map((m) => (
                <li key={m.id}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="tx-peso-700">{m.n}</span> <span className="tx-mono tx-apagado">{m.cpf}</span>
                  </span>
                  <Situacao tom={m.tom}>{m.cnh}</Situacao>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="tx-transp-secao" aria-labelledby="transp-acesso">
          <h3 id="transp-acesso" className="tx-tipo-titulo">
            Acesso do transportador
          </h3>
          <p className="tx-tipo-denso tx-sec" style={{ margin: 0, lineHeight: 'var(--lh-paragrafo)' }}>
            Opcional: com o convite, o transportador atualiza CNH, CRLV e RNTRC por um link próprio. {v.dConvite}
          </p>
          {v.dPodeConvidar || v.dPodeRevogar ? (
            <div style={{ display: 'flex', gap: 'var(--esp-2)', flexWrap: 'wrap' }}>
              {v.dPodeConvidar ? (
                <Botao tamanho="p" variante="contorno" onClick={v.dConvidar} data-tx-d-convidar="">
                  {v.dConvidarRot}
                </Botao>
              ) : null}
              {v.dPodeRevogar ? (
                <Botao tamanho="p" variante="texto" onClick={v.dRevogar} data-tx-d-revogar="" className="tx-transp-perigo">
                  Revogar acesso...
                </Botao>
              ) : null}
            </div>
          ) : null}
        </section>
        <section className="tx-transp-secao" aria-labelledby="transp-vgs">
          <h3 id="transp-vgs" className="tx-tipo-titulo">
            Últimas viagens
          </h3>
          {v.dViagens.length ? (
            <ul className="tx-frota-lista">
              {v.dViagens.map((vg) => (
                <li key={vg.id}>
                  <A href={vg.href} className="tx-frota-viagem">
                    <span className="num tx-apagado">{vg.data}</span>
                    <span className="tx-mono tx-peso-600">{vg.ordem}</span>
                    <span className="tx-frota-t3__nome">{vg.produto}</span>
                    <Situacao tom={vg.tom}>{vg.res}</Situacao>
                    <span aria-hidden className="tx-frota-chevron">
                      ›
                    </span>
                  </A>
                </li>
              ))}
            </ul>
          ) : (
            <span className="tx-frota-legenda">Nenhuma viagem ainda.</span>
          )}
        </section>
      </>
    );
  }
  renderDocs(v) {
    return (
      <ul className="tx-frota-lista">
        {v.dDocs.map((dd) => (
          <li key={dd.k}>
            <span className="tx-peso-600" style={{ flex: 1, minWidth: 0 }}>
              {dd.n}
            </span>
            <Situacao tom={dd.tom}>{dd.rotulo}</Situacao>
            {v.podeDocs ? (
              <Botao
                tamanho="p"
                variante={dd.estado === 'ok' ? 'texto' : 'contorno'}
                inativo={!!dd.nao}
                title={dd.nao || undefined}
                onClick={dd.atualizar}
                data-tx-atualizar-doc={dd.k}
                aria-label={'Atualizar ' + dd.n}
              >
                Atualizar
              </Botao>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
  renderConjs(v) {
    if (!v.dConjs.length) return <EstadoVazio titulo="Nenhum conjunto ainda">As placas entram na primeira viagem.</EstadoVazio>;
    return v.dConjs.map((cj) => (
      <section key={cj.id} className="tx-transp-secao" aria-label={'Conjunto ' + cj.placas[0].placa}>
        <span className="tx-tipo-rotulo">{cj.compsTxt}</span>
        {cj.placas.map((pl) => (
          <div key={pl.placa} className="tx-transp-conj">
            <div className="tx-transp-conj__placa">
              <span className={'tx-frota-placa' + (pl.cavalo ? ' tx-frota-placa--cavalo' : '')}>{pl.placa}</span>
              <span className="tx-apagado tx-tipo-legenda">{pl.cavalo ? 'cavalo' : 'carreta'}</span>
              <Situacao tom={pl.tom}>{pl.crlv}</Situacao>
            </div>
            {pl.comps.length ? (
              <div style={{ display: 'flex', gap: 'var(--esp-2)', flexWrap: 'wrap' }}>
                {pl.comps.map((k) => (
                  <Botao key={k.n} tamanho="p" variante="contorno" href={k.href} data-tx-historico={k.n}>
                    Histórico de cargas de {k.n}
                  </Botao>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </section>
    ));
  }
  renderOcs(v) {
    if (!v.dOcs.length)
      return <EstadoVazio titulo="Nenhuma ocorrência">Ocorrências registradas nas viagens deste transportador aparecem aqui.</EstadoVazio>;
    return (
      <div>
        {v.dOcs.map((o) => (
          <div key={o.id} className="tx-transp-oc">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)', flexWrap: 'wrap' }}>
              <span className="tx-peso-700">{o.tipo}</span>
              <span className="num tx-apagado">{o.data}</span>
              <Situacao tom={o.tom}>{o.grav}</Situacao>
            </div>
            {o.desc ? <p>{o.desc}</p> : null}
          </div>
        ))}
      </div>
    );
  }

  renderModal(v) {
    const perigo = v.mK === 'revogar';
    return (
      <Modal
        id={'transp-' + v.mK}
        data-tx-modal={v.mK}
        tamanho={v.mK === 'importar' ? 'g' : 'm'}
        titulo={v.mTitulo}
        sub={v.mSub}
        aoFechar={v.fecharModal}
        falta={v.mFalta}
        acoes={
          <>
            <Botao onClick={v.fecharModal}>Cancelar</Botao>
            <Botao variante={perigo ? 'perigo' : 'primario'} inativo={!v.mOk} onClick={v.confirmar} data-tx-confirmar="">
              {v.mCta}
            </Botao>
          </>
        }
      >
        {v.mK === 'cadastro' ? (
          <>
            <Escolhas id="transp-cad-tipo" rotulo="Tipo" itens={v.cadTipos} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--esp-3)' }}>
              {v.cadCampos.map((cc) => (
                <Campo key={cc.k} id={'transp-' + cc.k} rotulo={cc.l} opcional={cc.opcional} erro={cc.erro} campo={cc.k}>
                  <Entrada mono={cc.mono} value={cc.v} onChange={cc.on} placeholder={cc.ph} />
                </Campo>
              ))}
            </div>
            {v.cadDup ? (
              <Aviso
                tom="aviso"
                titulo={'Já existe: ' + v.cadDupNome + ' tem este ' + v.cadDocRot + '.'}
                acao={
                  <Botao tamanho="p" variante="texto" onClick={v.abrirDup}>
                    Abrir o cadastro
                  </Botao>
                }
              >
                A duplicidade é conferida pelos dígitos do documento.
              </Aviso>
            ) : null}
            {v.cadTac ? (
              <Campo
                id="transp-cPlacas"
                rotulo="Placas do conjunto"
                opcional
                dica="Primeiro o cavalo, depois as carretas, separadas por vírgula ou espaço."
                erro={v.erroPlacas}
                campo="cPlacas"
              >
                <Entrada mono value={v.cPlacas} onChange={v.onPlacas} placeholder="ABC1D23, ABC1D24" />
              </Campo>
            ) : null}
            {v.cadTac && v.chips.length ? (
              <div className="tx-transp-chips" aria-label="Placas reconhecidas">
                {v.chips.map((c, i) => (
                  <Badge key={c.pl + i} tom={!c.ok || c.ja ? 'perigo' : 'marca'} mono>
                    {c.pl}
                    {c.ok && !c.ja ? (i === 0 ? ' cavalo' : ' carreta') : c.ja ? ' já existe' : ' inválida'}
                  </Badge>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
        {v.mK === 'importar' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)', flexWrap: 'wrap' }}>
              <span className="tx-tipo-denso tx-sec">Colunas: nome, CPF, telefone e placas.</span>
              <Botao tamanho="p" variante="texto" onClick={v.baixarModelo} data-tx-modelo="">
                Baixar modelo (.csv)
              </Botao>
            </div>
            <label className="tx-transp-arquivo" {...(v.imp ? { 'data-cheio': '' } : {})}>
              <input type="file" accept=".csv,.xlsx" onChange={v.onImpArq} className="tx-so-leitor" />
              <span className="tx-peso-700" style={{ flex: 1 }}>
                {v.imp ? 'Planilha: ' + v.imp : 'Escolher planilha (.csv ou .xlsx)'}
              </span>
            </label>
            {!v.imp ? (
              <div>
                <Botao tamanho="p" variante="texto" onClick={v.impExemplo} data-tx-imp-exemplo="">
                  Usar a planilha de exemplo
                </Botao>
              </div>
            ) : null}
            {v.impErro ? (
              <div className="tx-erro" role="alert" data-tx-arquivo-erro="">
                {v.impErro}
              </div>
            ) : null}
            {v.imp ? (
              <div>
                <div className="tx-tipo-denso tx-peso-700" role="status">
                  Prévia: {v.impResumo}
                </div>
                <ul className="tx-transp-previa">
                  {v.impLinhas.map((il) => (
                    <li key={il.k}>
                      <span className="tx-peso-700">{il.nome}</span>
                      <span className="tx-mono tx-sec">{il.doc}</span>
                      <Situacao tom={il.tom === 'ok' ? 'ok' : 'falta'}>{il.st}</Situacao>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}
        {v.mK === 'doc' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--esp-3)' }}>
              <Campo
                id="transportadores-numero"
                rotulo={v.docTipo === 'CRLV' ? 'Número do CRLV (Renavam)' : 'Número do ' + v.docTipo}
                erro={v.erroNum}
                campo="numero"
              >
                <Entrada mono value={v.fNum} onChange={v.onNum} />
              </Campo>
              <Campo id="transportadores-validade" rotulo="Nova validade" erro={v.docAviso} campo="validade">
                <CampoData valor={v.docVal} aoMudar={v.onDocVal} />
              </Campo>
            </div>
            <div className="tx-campo">
              <span className="tx-campo__rotulo">
                Arquivo do documento <span className="tx-campo__opcional">(recomendado)</span>
              </span>
              <label className="tx-frota-arquivo">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={v.onArq} className="tx-so-leitor" />
                <span className="tx-peso-700">{v.fArq ? v.fArq : 'Escolher PDF ou foto'}</span>
                <span className="tx-apagado tx-tipo-legenda">o auditor confere o documento, não só a data</span>
              </label>
              {v.fArqErro ? (
                <div className="tx-campo__erro" role="alert">
                  {v.fArqErro}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        {v.mK === 'revisar' ? (
          <>
            <Aviso tom={v.revPode ? 'info' : 'aviso'}>{v.revQuem}</Aviso>
            <Campo
              id="transportadores-motivo"
              rotulo="O que foi feito"
              dica="Mínimo de 20 caracteres. Fica no histórico do transportador."
              erro={v.erroMotivo}
              campo="motivo"
            >
              <textarea className="tx-entrada" rows={3} value={v.fMotivo} onChange={v.onMotivo} />
            </Campo>
          </>
        ) : null}
      </Modal>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Transportadores" data-tela="Transportadores">
        <div className="tx-pagina">
          <div className="tx-pagina-cab">
            <div className="tx-pagina-cab__titulos tx-transp-cab-titulo">
              <h1 className="tx-pagina-cab__titulo" title="Base compartilhada entre as filiais">
                Transportadores
              </h1>
              <span className="tx-tipo-corpo tx-sec num">{v.contagem}</span>
            </div>
            {v.podeCad ? (
              <div className="tx-pagina-cab__acoes">
                <Botao variante="contorno" onClick={v.abrirImportar} data-tx-importar="">
                  Importar planilha
                </Botao>
                <Botao variante="primario" icone={MAIS} onClick={v.abrirCadastro} data-tx-cadastrar="">
                  Cadastrar
                </Botao>
              </div>
            ) : null}
          </div>
          <Cartao lista>
            <div role="tablist" aria-label="Filtrar transportadores" className="tx-abas">
              {v.abas.map((ab) => (
                <button
                  key={ab.k}
                  type="button"
                  role="tab"
                  aria-selected={ab.on}
                  className="tx-aba"
                  onClick={ab.onClick}
                  data-tx-filtro={ab.k}
                >
                  {ab.n}
                  <Badge tom={ab.q && ab.tom !== 'na' ? ab.tom : 'neutro'} contador>
                    {ab.q}
                  </Badge>
                </button>
              ))}
            </div>
            <div className="tx-transp-ferramentas">
              <EntradaCaixa
                icone={LUPA}
                value={v.busca}
                onChange={v.onBusca}
                placeholder="Nome, CPF, CNPJ, placa ou RNTRC"
                aria-label="Buscar transportador por nome, CPF, CNPJ, placa ou RNTRC"
                data-tx-busca=""
              />
              <div role="group" aria-label="Tipo de transportador" style={{ display: 'flex', gap: 'var(--esp-1-5)', marginLeft: 'auto' }}>
                {v.tipos.map((tp) => (
                  <Chip key={tp.k} tipo="filtro" selecionado={tp.on} onClick={tp.onClick} data-tx-tipo={tp.k}>
                    {tp.n}
                  </Chip>
                ))}
              </div>
            </div>
            {v.dica ? <div className="tx-transp-dica">{v.dica}</div> : null}
            <Tabela colunas={COLS} rotulo="Transportadores">
              <TabelaCabecalho>
                <span role="columnheader" aria-sort={v.sortDe('nome')}>
                  <button type="button" className="tx-transp-ordem" onClick={v.ordenar('nome')}>
                    Transportador{' '}
                    <span className="tx-transp-ordem__seta" aria-hidden>
                      {v.sortDe('nome') === 'descending' ? '↓' : '↑'}
                    </span>
                  </button>
                </span>
                <span role="columnheader">Conjuntos</span>
                <span role="columnheader" aria-sort={v.sortDe('docs')}>
                  <button type="button" className="tx-transp-ordem" onClick={v.ordenar('docs')}>
                    Documentos{' '}
                    <span className="tx-transp-ordem__seta" aria-hidden>
                      {v.sortDe('docs') === 'descending' ? '↓' : '↑'}
                    </span>
                  </button>
                </span>
                <span role="columnheader" aria-sort={v.sortDe('ultima')}>
                  <button type="button" className="tx-transp-ordem" onClick={v.ordenar('ultima')}>
                    Viagens{' '}
                    <span className="tx-transp-ordem__seta" aria-hidden>
                      {v.sortDe('ultima') === 'descending' ? '↓' : '↑'}
                    </span>
                  </button>
                </span>
                <span role="columnheader">Ocorrências</span>
                <span role="columnheader">Acesso</span>
                <span role="columnheader">
                  <span className="tx-so-leitor">Ações</span>
                </span>
              </TabelaCabecalho>
              {v.loading ? <TabelaEsqueleto linhas={6} /> : v.linhas.map((r) => this.renderLinha(r))}
              {v.vazio ? (
                <EstadoVazio
                  titulo="Nenhum transportador com esse filtro"
                  acao={
                    v.temFiltro ? (
                      <Botao tamanho="p" onClick={v.limpar}>
                        Limpar filtros
                      </Botao>
                    ) : null
                  }
                >
                  Busque por CPF, placa ou nome. Se for novo, ele entra pela primeira viagem ou em Cadastrar.
                </EstadoVazio>
              ) : null}
              {!v.loading && !v.vazio ? (
                <TabelaRodape>
                  <Paginacao pagina={v.pagina} total={v.total} info={v.pagInfo} aoIr={v.irPara} />
                </TabelaRodape>
              ) : null}
            </Tabela>
          </Cartao>
        </div>
        {v.drAberto ? this.renderDrawer(v) : null}
        {v.mK ? this.renderModal(v) : null}
      </div>
    );
  }
}
