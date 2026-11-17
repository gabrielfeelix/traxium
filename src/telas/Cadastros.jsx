// Cadastros: produtos e regimes (referência IDTF), manual e treinamentos, fornecedores e filiais.
// Coleção é lista com busca, filtro e ordem; a linha abre o registro num drawer.
'use client';
import { TX, Tela } from '@/lib/tx/tela';
import {
  Botao,
  Campo,
  Entrada,
  Chip,
  Escolhas,
  Situacao,
  Badge,
  Aviso,
  Abas,
  Tabela,
  TabelaCabecalho,
  TabelaColuna,
  TabelaLinha,
  TabelaEsqueleto,
  Celula,
  Cartao,
  Linha,
  CabecalhoPagina,
  EstadoVazio,
  Modal,
  Drawer,
  EntradaCaixa,
  BarraFiltros,
  CampoBusca,
  Dica,
  Termo,
  SeloRegime,
  IconeTipo,
  tipoDoServico,
  SetaLinha,
  textoFalta,
} from '@/components/ui';
import './Cadastros.css';

const LUPA = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    className="tx-apagado"
    aria-hidden
  >
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const SETA_BAIXO = (
  <svg
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
const VISTO = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
  </svg>
);

const COLS_PROD = 'minmax(0,1.2fr) minmax(0,1.5fr) minmax(0,1fr) 170px 96px';
const COLS_VERSOES = '72px 190px minmax(0,1fr) 150px';
const COLS_TREINO = '100px minmax(0,1.5fr) minmax(0,1fr) 72px minmax(0,1.3fr) 24px';
const COLS_FORN = 'minmax(0,1.4fr) 150px 140px 150px minmax(0,1.6fr) 24px';
const COLS_FIL = 'minmax(0,1.2fr) minmax(0,1fr) 130px minmax(0,1.5fr) 200px 24px';

// Permissão do usuário da sessão (matriz em tx-dados.js). Sem a API ainda carregada, libera.
const pode = (op, alvo) => (TX.pode ? TX.pode(op, alvo) : true);

const SERVICOS = [
  ['lavagem', 'Lavagem'],
  ['lonas e amarração', 'Lonas'],
  ['manutenção', 'Manutenção'],
];
// Prazo de resposta da Traxium a um pedido de classificação (premissa, docs/ds/pendencias.md).
const PRAZO_CLASSIFICACAO_DIAS = 2;

// Serviço do fornecedor em chip compacto: "Lavagem até C", com a explicação do regime na dica.
function ChipServico({ servico, regime }) {
  const nome = (SERVICOS.find((s) => s[0] === servico) || [servico, servico])[1];
  if (!regime) return <Badge tom="marca">{nome}</Badge>;
  const letras = ['A', 'B', 'C', 'D'].slice(0, ['A', 'B', 'C', 'D'].indexOf(regime) + 1).join(', ');
  return (
    <Dica conteudo={'Regime ' + regime + ': ' + TX.REGIMES[regime].desc + '. Pode fazer limpezas de regime ' + letras + '.'}>
      <span className="tx-badge tx-badge--marca tx-cad-dica" tabIndex={0}>
        {nome} até {regime}
      </span>
    </Dica>
  );
}

export default class Cadastros extends Tela {
  state = {
    loading: true,
    aba: null,
    pq: '',
    pReg: 'todos',
    modal: null,
    drawer: null,
    f: {},
    popAberto: null,
    verCartoes: false,
    hl: null,
    fq: '',
    fServ: null,
    fFiltroDoc: null,
    fOrdem: { k: 'venc', o: 'asc' },
    tq: '',
  };
  componentDidMount() {
    TX.ui.montar(this);
    const q = TX.ui.param('q');
    if (q) this.setState({ pq: q });
    const id = TX.ui.param('id');
    if (id && this.cadAtiva() === 'fornecedores') {
      this.setState({ hl: id });
      setTimeout(() => {
        const el = document.querySelector('[data-tx-forn="' + id + '"]');
        if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
    this.setState({ aba: k, drawer: null });
    try {
      TX.ui.trocarUrl('/cadastros?aba=' + k);
    } catch (e) {}
  }
  ordenar(k) {
    const o = this.state.fOrdem;
    this.setState({ fOrdem: { k, o: o.k === k && o.o === 'asc' ? 'desc' : 'asc' } });
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      aba = this.cadAtiva();
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
    const SUB = {
      produtos: 'Base IDTF ' + TX.db.baseIDTF.versao + ': a limpeza que cada carga exige antes de carregar ração.',
      manual: 'O que o motorista lê no link e os treinamentos que o auditor confere.',
      fornecedores: null,
      filiais: 'Registro GMP+, afretador e comunicação do gatekeeper ao organismo certificador.',
    };
    const vals = Object.assign({}, U.base(this));
    Object.assign(vals, {
      abaNome: ABAS.find((x) => x[0] === aba)[1],
      abaSub: SUB[aba],
      aba,
      mostrarAbas: vals.navL === 'none',
      abas: ABAS.map(([k, n]) => ({ k, n, ativa: aba === k, onClick: () => this.irAba(k) })),
      podeForn: pode('cadastrarFornecedor'),
      podeDoc: pode('atualizarDocumento'),
      podeOC: pode('comunicarOC'),
      podeManual: pode('publicarManual'),
      podeTreino: pode('registrarTreinamento'),
      podeClass: pode('pedirClassificacao'),
      novoFornecedor: () => this.setState({ modal: 'fornecedor', f: { servico: 'lavagem', regimeMax: 'B' } }),
      fecharDrawer: () => this.setState({ drawer: null }),
    });

    // ---------------------------------------------------------------- produtos
    const achados = s.pq ? TX.buscarProdutos(s.pq, 40).map((r) => r.produto) : TX.db.produtos;
    const lista = achados.filter((p) => s.pReg === 'todos' || p.regime === s.pReg);
    const REGS = [
      ['todos', 'Todos os regimes'],
      ['A', 'Seco'],
      ['B', 'Água'],
      ['C', 'Água e detergente'],
      ['D', 'Desinfecção'],
      ['X', 'Proibida para ração'],
    ];
    const pedir = (t) => {
      if (t.length < 3) return false;
      if (TX.produtoPorTexto(t)) {
        this.avisar('"' + t + '" já está na base como ' + TX.produtoPorTexto(t).nome + '.');
        return false;
      }
      TX.fazer('pedirClassificacao', { texto: t });
      this.avisar('Pedido enviado à Traxium. Viagens com esta carga anterior seguem travadas até a classificação.');
      return true;
    };
    const termo = (s.pq || '').trim(),
      jaPedido = TX.db.pedidosClassificacao.some((p) => p.texto.toLowerCase() === termo.toLowerCase());
    Object.assign(vals, {
      pq: s.pq,
      onPq: (e) => this.setState({ pq: e.target.value }),
      pVazio: !s.loading && lista.length === 0,
      pVazioPede: achados.length === 0 && termo.length >= 3 && !jaPedido && vals.podeClass,
      pVazioTit: achados.length ? 'Nenhum produto com esse regime' : 'Fora da base IDTF',
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
      regFiltrado: s.pReg !== 'todos',
      popRegime: s.popAberto === 'regime',
      abrirRegime: () => this.setState((st) => ({ popAberto: st.popAberto === 'regime' ? null : 'regime' })),
      pRegimes: REGS.map(([k, n]) => {
        const q = k === 'todos' ? achados.length : achados.filter((p) => p.regime === k).length;
        const podeIr = q > 0 || k === s.pReg;
        return {
          k,
          n,
          q,
          on: s.pReg === k,
          pode: podeIr,
          onClick: () => {
            if (podeIr) this.setState({ pReg: k, popAberto: null });
          },
        };
      }),
      produtos: lista.map((p) => ({
        id: p.id || p.nome,
        nome: p.nome,
        en: p.en,
        sin: p.sin.join(', '),
        cat: p.cat,
        regime: p.regime,
        racao: p.racao,
      })),
      abrirClassificar: () => this.setState({ modal: 'classificar', f: { texto: termo } }),
      pedidos: TX.db.pedidosClassificacao
        .filter((p) => !/classificad/.test(p.estado))
        .map((p) => {
          const prazo = TX.addDias(p.pedidoEm, PRAZO_CLASSIFICACAO_DIAS);
          return { id: p.id, t: p.texto, atrasado: prazo < TX.HOJE, prazo: F.data(prazo), quem: (TX.usuario(p.por) || {}).nome };
        }),
    });
    vals.classificarFn = pedir;

    // ---------------------------------------------------------------- manual e treinamentos
    const vig = TX.manualVigente();
    const tq = TX.norm(s.tq || '');
    const treinosTodos = TX.db.treinamentos
      .slice()
      .reverse()
      .map((t, i) => {
        const pessoas = t.participantes.map((p) => (TX.usuario(p) || TX.pessoa(p) || {}).nome);
        return {
          k: t.id || 'tr' + i,
          data: F.data(t.data),
          tema: t.tema,
          instrutor: t.instrutor,
          carga: t.carga,
          n: t.participantes.length,
          pessoas,
          resumo: pessoas.slice(0, 3).join(', ') + (pessoas.length > 3 ? ' e mais ' + (pessoas.length - 3) : ''),
        };
      });
    const treinos = treinosTodos.filter((t) => !tq || TX.norm([t.tema, t.instrutor].concat(t.pessoas).join(' ')).includes(tq));
    Object.assign(vals, {
      manualTitulo: TX.db.manual.titulo,
      cartoes: TX.db.manual.cartoes,
      verCartoes: s.verCartoes,
      cartoesRot: s.verCartoes ? 'Recolher os cartões' : 'Ver os cartões',
      cartoesSub: TX.db.manual.cartoes.length + ' cartões na v' + vig.v,
      alternarCartoes: () => this.setState({ verCartoes: !s.verCartoes }),
      versoes: TX.db.manual.versoes
        .slice()
        .reverse()
        .map((x) => {
          const n = TX.db.viagens.filter((v) => v.manual && v.manual.versao === x.v).length;
          const on = x.v === vig.v;
          return {
            v: x.v,
            on,
            st: on ? 'Vigente desde ' + F.data(x.desde) : F.data(x.desde) + ' a ' + F.data(x.ate),
            mud: x.mudancas,
            ciencias: n + (n === 1 ? ' ciência' : ' ciências'),
          };
        }),
      abrirPublicar: () => this.setState({ modal: 'manual', f: { versao: (parseFloat(vig.v) + 0.1).toFixed(1) } }),
      tq: s.tq,
      onTq: (t) => this.setState({ tq: t }),
      treinos,
      treinosTotal: treinosTodos.length,
      abrirTreino: () =>
        this.setState({ modal: 'treino', f: { data: TX.HOJE, carga: '1 h', instrutor: TX.sessao().nome, part: [], pq: '' } }),
    });
    vals.dTreino = s.drawer && s.drawer.treino != null ? treinosTodos.find((t) => t.k === s.drawer.treino) : null;

    // ---------------------------------------------------------------- fornecedores
    const fq = TX.norm(s.fq || '');
    const fornAll = TX.db.fornecedores.map((f) => {
      const docs = f.docs
        .map((d) => {
          const de = TX.docEstado(d.validade);
          const dias = de.dias == null ? -99999 : de.dias;
          return {
            k: f.id + ':' + d.n,
            n: d.n,
            r: de.rotulo,
            estado: de.estado,
            dias,
            validade: d.validade,
            prazo:
              de.estado === 'falta'
                ? 'não informado'
                : dias < 0
                  ? 'vencido há ' + -dias + (dias === -1 ? ' dia' : ' dias')
                  : dias < 60
                    ? 'em ' + dias + (dias === 1 ? ' dia' : ' dias')
                    : F.data(d.validade),
            tom: de.estado === 'ok' ? 'ok' : de.estado === 'vence' ? 'falta' : 'bloqueio',
            atualiza: de.estado !== 'ok',
            onAtualizar: (e) => {
              if (e) e.stopPropagation();
              this.setState({ modal: 'docForn', fForn: f.id, fDoc: d.n, f: { validade: '' } });
            },
          };
        })
        .sort((a, b) => a.dias - b.dias);
      const vencidos = docs.filter((d) => d.estado === 'vencido' || d.estado === 'falta').length;
      const aVencer = docs.filter((d) => d.estado === 'vence').length;
      const pior = docs[0] || null;
      return {
        id: f.id,
        nome: f.nome,
        ini: F.iniciais(f.nome),
        servico: f.servico,
        cidade: f.cidade,
        cnpj: f.cnpj,
        regime: f.regimeMax,
        docs,
        pior,
        vencidos,
        aVencer,
        docTom: vencidos ? 'bloqueio' : aVencer ? 'falta' : 'ok',
        docRot: !docs.length
          ? 'Sem documento'
          : vencidos
            ? vencidos + (vencidos === 1 ? ' vencido' : ' vencidos') + ' de ' + docs.length
            : aVencer
              ? aVencer + ' a vencer de ' + docs.length
              : docs.length + ' em dia',
        hl: s.hl === f.id,
        viagens: TX.db.viagens
          .filter((v) => (v.limpezas || []).some((l) => l.lavador === f.id))
          .sort((a, b) => b.data.localeCompare(a.data))
          .slice(0, 10)
          .map((v) => ({ id: v.id, ordem: v.ordem, data: F.data(v.data), href: '/viagem?id=' + v.id })),
        abrir: () => this.setState({ drawer: { forn: f.id }, hl: f.id }),
      };
    });
    const ord = s.fOrdem,
      sinal = ord.o === 'asc' ? 1 : -1;
    const fornLista = fornAll
      .filter((f) => !s.fServ || f.servico === s.fServ)
      .filter((f) => !s.fFiltroDoc || (s.fFiltroDoc === 'vence' ? f.aVencer > 0 : f.vencidos > 0))
      .filter(
        (f) =>
          !fq ||
          TX.norm([f.nome, f.cidade, f.cnpj, f.servico].join(' ')).includes(fq) ||
          (TX.soDigitos(s.fq).length >= 3 && TX.soDigitos(f.cnpj).includes(TX.soDigitos(s.fq))),
      )
      .sort((a, b) => {
        if (ord.k === 'nome') return sinal * a.nome.localeCompare(b.nome);
        if (ord.k === 'cidade') return sinal * a.cidade.localeCompare(b.cidade) || a.nome.localeCompare(b.nome);
        return sinal * ((a.pior ? a.pior.dias : 99999) - (b.pior ? b.pior.dias : 99999));
      });
    const ordemDe = (k) => (ord.k === k ? ord.o : null);
    Object.assign(vals, {
      fq: s.fq,
      onFq: (t) => this.setState({ fq: t }),
      fFiltros: [
        {
          k: 'todos',
          rotulo: 'Todos',
          contagem: fornAll.length,
          ativo: !s.fServ && !s.fFiltroDoc,
          aoClicar: () => this.setState({ fServ: null, fFiltroDoc: null }),
        },
        {
          k: 'vence',
          rotulo: 'Documento a vencer',
          contagem: fornAll.filter((f) => f.aVencer).length,
          alerta: true,
          ativo: s.fFiltroDoc === 'vence',
          aoClicar: () => this.setState({ fFiltroDoc: s.fFiltroDoc === 'vence' ? null : 'vence' }),
        },
        {
          k: 'vencido',
          rotulo: 'Vencido',
          contagem: fornAll.filter((f) => f.vencidos).length,
          alerta: true,
          ativo: s.fFiltroDoc === 'vencido',
          aoClicar: () => this.setState({ fFiltroDoc: s.fFiltroDoc === 'vencido' ? null : 'vencido' }),
        },
      ].concat(
        SERVICOS.map(([k, n]) => ({
          k,
          rotulo: n,
          contagem: fornAll.filter((f) => f.servico === k).length,
          ativo: s.fServ === k,
          aoClicar: () => this.setState({ fServ: s.fServ === k ? null : k }),
        })),
      ),
      fResultado:
        (fornLista.length === fornAll.length
          ? fornAll.length + ' fornecedores'
          : fornLista.length + ' de ' + fornAll.length + ' fornecedores') +
        '. ' +
        (fVence
          ? (fVence === 1 ? '1 documento vence' : fVence + ' documentos vencem') + ' em até 30 dias.'
          : 'Nenhum documento vence nos próximos 30 dias.'),
      fornecedores: fornLista,
      fVazio: !s.loading && fornLista.length === 0,
      temFiltroForn: !!(s.fq || s.fServ || s.fFiltroDoc),
      limparForn: () => this.setState({ fq: '', fServ: null, fFiltroDoc: null }),
      fCols: [
        { k: 'nome', rotulo: 'Fornecedor', ordenavel: true, ordem: ordemDe('nome'), aoOrdenar: () => this.ordenar('nome') },
        { k: 'servico', rotulo: 'Serviço' },
        { k: 'cidade', rotulo: 'Cidade', ordenavel: true, ordem: ordemDe('cidade'), aoOrdenar: () => this.ordenar('cidade') },
        { k: 'docs', rotulo: 'Documentos' },
        { k: 'venc', rotulo: 'Próximo vencimento', ordenavel: true, ordem: ordemDe('venc'), aoOrdenar: () => this.ordenar('venc') },
        { k: 'seta', rotulo: '', rotuloLeitor: 'Abrir' },
      ],
      dForn: s.drawer && s.drawer.forn ? fornAll.find((f) => f.id === s.drawer.forn) : null,
    });

    // ---------------------------------------------------------------- filiais
    const filiais = TX.db.filiais.map((f) => {
      const oc = f.comunicacaoOC;
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
        nome: f.nome + ' ' + f.uf,
        matriz: !!f.matriz,
        ini: F.iniciais(f.nome),
        reg: f.registro,
        afretador: TX.usuario(f.afretador).nome,
        gk,
        hrefMesa: '/hoje?filial=' + f.id,
        oc: !!oc,
        ocRot: oc ? 'Comunicado em ' + F.data(oc.data) : 'Não comunicado',
        ocSub: oc ? 'protocolo ' + oc.protocolo : 'viagens de TAC bloqueadas',
        abrir: () => this.setState({ drawer: { filial: f.id } }),
        registrar: (e) => {
          if (e) e.stopPropagation();
          this.setState({ modal: 'oc', fFil: f.id, f: { data: TX.HOJE, protocolo: '' } });
        },
      };
    });
    Object.assign(vals, {
      filiais,
      filiaisSemOc: filiais.filter((f) => !f.oc),
      dFilial: s.drawer && s.drawer.filial ? filiais.find((f) => f.id === s.drawer.filial) : null,
    });
    return Object.assign(vals, this.modalVals(vals));
  }
  modalVals(vals) {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      m = s.modal,
      f = s.f || {};
    const setF = (o) => this.setState({ f: Object.assign({}, s.f, o) });
    // Data digitada em DD/MM/AAAA: f[k] guarda a data em ISO e f[k + 'Txt'] o que foi digitado.
    const campo = (k, l, tipo, ph, col) => {
      if (tipo === 'date') {
        const txt = f[k + 'Txt'] != null ? f[k + 'Txt'] : f[k] ? F.data(f[k]) : '';
        return {
          k,
          l,
          data: true,
          ph: 'DD/MM/AAAA',
          col: col || 'auto',
          v: txt,
          erro: U.avisoData(txt),
          on: (e) => {
            const t2 = U.mascaraData(e.target.value);
            setF({ [k + 'Txt']: t2, [k]: U.dataIso(t2) || '' });
          },
        };
      }
      return { k, l, ph: ph || '', col: col || 'auto', v: f[k] || '', erro: '', on: (e) => setF({ [k]: e.target.value }) };
    };
    const base = {
      mAberto: !!m,
      mK: m || '',
      fecharModal: () => this.setState({ modal: null }),
      mCampos: [],
      mGrupos: [],
      mPessoas: null,
      mArquivo: false,
      mFalta: '',
    };
    // Faltas: lista [chave do campo, nome curto]. O primário inativo leva ao primeiro que falta.
    const fim = (faltas, rot, fn) => {
      const ok = faltas.length === 0;
      return {
        mCta: rot,
        ctaOk: ok,
        mFalta: ok ? '' : textoFalta(faltas.map((x) => x[1])),
        confirmar: () => {
          if (ok) {
            fn();
            return;
          }
          const el = document.querySelector('[data-tx-modal] [data-tx-campo="' + faltas[0][0] + '"]');
          if (el) el.focus();
        },
      };
    };
    if (m === 'classificar') {
      const faltas = (f.texto || '').trim().length < 3 ? [['classificar', 'nome do produto']] : [];
      return Object.assign(
        base,
        {
          mTitulo: 'Pedir classificação à Traxium',
          mSub:
            'Para carga fora da base IDTF. Até a classificação, ela não pode ser carga anterior. Resposta prevista em ' +
            PRAZO_CLASSIFICACAO_DIAS +
            ' dias.',
          mCampos: [
            Object.assign(campo('texto', 'Produto', 'text', 'Ex.: escória de alto-forno', '1 / span 2'), {
              k: 'classificar',
              on: (e) => setF({ texto: e.target.value }),
            }),
          ],
        },
        fim(faltas, 'Enviar pedido', () => {
          if (vals.classificarFn((f.texto || '').trim())) this.setState({ modal: null });
        }),
      );
    }
    if (m === 'oc') {
      const fil = TX.filial(s.fFil);
      const faltas = [];
      if (!f.data) faltas.push(['data', 'data']);
      if ((f.protocolo || '').trim().length < 4) faltas.push(['protocolo', 'protocolo']);
      return Object.assign(
        base,
        {
          mTitulo: 'Comunicação do gatekeeper',
          mExtra: fil.nome,
          mSub: 'Data e protocolo da comunicação ao organismo certificador. As viagens de TAC da filial são reavaliadas na hora.',
          mCampos: [campo('data', 'Data da comunicação', 'date'), campo('protocolo', 'Protocolo', 'text', 'OC-GK-2026-1008')],
        },
        fim(faltas, 'Registrar', () => {
          TX.fazer('comunicarOC', { filial: fil.id, data: f.data, protocolo: f.protocolo.trim() });
          this.setState({ modal: null });
          this.avisar('Comunicação registrada para ' + fil.nome + '. Viagens de TAC da filial foram reavaliadas.');
        }),
      );
    }
    if (m === 'treino') {
      const pessoas = TX.db.usuarios
        .filter((u) => u.papel === 'afretador')
        .map((u) => ({ id: u.id, n: u.nome, grupo: 'Afretador' }))
        .concat(TX.db.pessoas.filter((p) => p.vinculo === 'propria').map((p) => ({ id: p.id, n: p.nome, grupo: 'Frota própria' })));
      const part = f.part || [];
      const pq = TX.norm(f.pq || '');
      const frota = pessoas.filter((p) => p.grupo === 'Frota própria').map((p) => p.id);
      const faltas = [];
      if (!f.data) faltas.push(['data', 'data']);
      if ((f.tema || '').trim().length < 5) faltas.push(['tema', 'tema']);
      if ((f.instrutor || '').trim().length < 3) faltas.push(['instrutor', 'instrutor']);
      if (!part.length) faltas.push(['part', 'participantes']);
      return Object.assign(
        base,
        {
          mTitulo: 'Registrar treinamento',
          mSub: 'Entra na lista que o auditor confere.',
          mCampos: [
            campo('data', 'Data', 'date'),
            campo('carga', 'Carga horária', 'text', '2 h'),
            campo('tema', 'Tema', 'text', 'Ex.: limpeza seca e cargas proibidas', '1 / span 2'),
            campo('instrutor', 'Instrutor', 'text', '', '1 / span 2'),
          ],
          mPessoas: {
            pq: f.pq || '',
            onPq: (t) => setF({ pq: t }),
            n: part.length,
            todasFrota: frota.length > 0 && frota.every((id) => part.includes(id)),
            alternarFrota: () =>
              setF({
                part: frota.every((id) => part.includes(id))
                  ? part.filter((x) => !frota.includes(x))
                  : Array.from(new Set(part.concat(frota))),
              }),
            limpar: () => setF({ part: [] }),
            itens: pessoas
              .filter((p) => !pq || TX.norm(p.n).includes(pq))
              .map((p) => ({
                k: p.id,
                n: p.n,
                grupo: p.grupo,
                on: part.includes(p.id),
                onClick: () => setF({ part: part.includes(p.id) ? part.filter((x) => x !== p.id) : part.concat(p.id) }),
              })),
          },
        },
        fim(faltas, 'Registrar', () => {
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
      const faltas = [];
      if (!/^\d+\.\d+$/.test(f.versao || '')) faltas.push(['versao', 'versão no formato 3.3']);
      else if (TX.db.manual.versoes.some((x) => x.v === f.versao)) faltas.push(['versao', 'versão nova']);
      if ((f.mudancas || '').trim().length < 10) faltas.push(['mudancas', 'o que mudou']);
      return Object.assign(
        base,
        {
          mTitulo: 'Publicar nova versão do manual',
          mSub: 'Vale a partir de hoje. Ciências já dadas ficam na versão antiga; o link pede a nova nas próximas viagens.',
          mCampos: [
            campo('versao', 'Versão', 'text', '3.3'),
            campo('mudancas', 'O que mudou', 'text', 'Ex.: novo cartão sobre chuva na carga', '1 / span 2'),
          ],
        },
        fim(faltas, 'Publicar', () => {
          TX.fazer('publicarManual', { versao: f.versao, mudancas: f.mudancas.trim() });
          this.setState({ modal: null });
          this.avisar('Manual v' + f.versao + ' publicado. Viagens de hoje sem ciência nesta versão voltam a pedir leitura.');
        }),
      );
    }
    if (m === 'docForn') {
      const fo = TX.fornecedor(s.fForn),
        doc = fo.docs.find((x) => x.n === s.fDoc);
      const faltas = [];
      if (!f.validade) faltas.push(['validade', 'nova validade']);
      else if (f.validade <= TX.HOJE) faltas.push(['validade', 'validade depois de hoje']);
      return Object.assign(
        base,
        {
          mTitulo: s.fDoc,
          mExtra: fo.nome,
          mSub: 'O documento atual ' + TX.docEstado(doc.validade).rotulo + '. Com a validade nova, o aviso de vencimento sai de Hoje.',
          mCampos: [campo('validade', 'Nova validade', 'date')],
          mArquivo: true,
          arquivoNome: f.arquivo || '',
          onArquivo: (e) => setF({ arquivo: e.target.files && e.target.files[0] ? e.target.files[0].name : '' }),
        },
        fim(faltas, 'Atualizar', () => {
          TX.fazer('atualizarDocumento', {
            tipo: s.fDoc,
            fornecedor: fo.id,
            ref: fo.id,
            refNome: fo.nome,
            validade: f.validade,
            arquivo: f.arquivo || null,
          });
          this.setState({ modal: null, hl: fo.id });
          this.avisar('Documento atualizado: ' + s.fDoc.toLowerCase() + ' de ' + fo.nome + ', válido até ' + F.data(f.validade) + '.');
        }),
      );
    }
    if (m === 'fornecedor') {
      const lav = f.servico === 'lavagem';
      const faltas = [];
      if ((f.nome || '').trim().length < 4) faltas.push(['nome', 'nome']);
      if (TX.soDigitos(f.cnpj).length !== 14) faltas.push(['cnpj', 'CNPJ com 14 dígitos']);
      if ((f.cidade || '').trim().length < 3) faltas.push(['cidade', 'cidade']);
      if (!f.validade) faltas.push(['validade', lav ? 'validade da licença' : 'validade do alvará']);
      return Object.assign(
        base,
        {
          mTitulo: 'Cadastrar fornecedor',
          mSub: 'O lavador entra com o regime máximo que pode fazer; o registro de limpeza na viagem respeita esse limite.',
          mCampos: [
            campo('nome', 'Nome', 'text', '', '1 / span 2'),
            campo('cnpj', 'CNPJ', 'text', '00.000.000/0000-00'),
            campo('cidade', 'Cidade', 'text', 'Sorriso MT'),
            campo('validade', lav ? 'Validade da licença ambiental' : 'Validade do alvará', 'date'),
          ],
          mGrupos: [
            {
              id: 'cad-servico',
              rotulo: 'Serviço',
              itens: SERVICOS.map(([k, n]) => ({ k, n, on: f.servico === k, onClick: () => setF({ servico: k }) })),
            },
          ].concat(
            lav
              ? [
                  {
                    id: 'cad-regime',
                    rotulo: 'Limpeza até o regime',
                    itens: ['A', 'B', 'C', 'D'].map((r) => ({
                      k: 'r' + r,
                      n: r + ', ' + TX.REGIMES[r].n.toLowerCase(),
                      on: f.regimeMax === r,
                      onClick: () => setF({ regimeMax: r }),
                    })),
                  },
                ]
              : [],
          ),
        },
        fim(faltas, 'Cadastrar', () => {
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
      fim([], '', () => {}),
    );
  }

  // ---------------------------------------------------------------- render por seção
  renderProdutos(v) {
    return (
      <>
        {v.pedidos.length ? (
          <Aviso tom="info" titulo={'Em análise na Traxium (' + v.pedidos.length + ')'}>
            {v.pedidos.map((pd, i) => (
              <span key={pd.id}>
                {i ? '; ' : ''}&quot;{pd.t}&quot;, {pd.atrasado ? 'resposta atrasada desde ' : 'resposta prevista até '}
                {pd.prazo}
              </span>
            ))}
          </Aviso>
        ) : null}
        <Cartao lista className="tx-cad-folha">
          <div className="tx-cad-barra">
            <EntradaCaixa
              icone={LUPA}
              aria-label="Buscar produto pelo nome popular, comercial ou em inglês"
              value={v.pq ?? ''}
              onChange={v.onPq}
              data-tx-busca=""
              placeholder="Nome popular, comercial ou em inglês"
            />
            <div data-tx-pop="" className="tx-cad-pop-ancora">
              <Botao
                variante="contorno"
                onClick={v.abrirRegime}
                data-tx-dd="regime"
                aria-expanded={!!v.popRegime}
                aria-haspopup="menu"
                className={v.regFiltrado ? 'tx-cad-dd--on' : undefined}
              >
                <span className="tx-cad-dd-rot">Limpeza </span>
                {v.regRot} {SETA_BAIXO}
              </Botao>
              {v.popRegime ? (
                <div className="tx-cad-pop" role="menu" aria-label="Limpeza antes de ração">
                  {v.pRegimes.map((pr) => (
                    <button
                      key={pr.k}
                      type="button"
                      role="menuitemradio"
                      aria-checked={pr.on}
                      aria-disabled={pr.pode ? undefined : true}
                      onClick={pr.onClick}
                      data-tx-regime={pr.k}
                      className="tx-cad-pop__op"
                    >
                      <span className="tx-cad-pop__letra tx-mono" aria-hidden>
                        {pr.k === 'todos' ? '' : pr.k}
                      </span>
                      {pr.n}
                      <span className="tx-cad-pop__q num">{pr.q}</span>
                      <span className="tx-cad-pop__visto">{pr.on ? VISTO : null}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="tx-cad-barra__fim tx-cad-contagem num">{v.pContagem}</span>
          </div>
          <Tabela colunas={COLS_PROD} rotulo="Produtos da base IDTF">
            <TabelaCabecalho fixo>
              <span>Produto</span>
              <span>Também chamado de</span>
              <span>Categoria</span>
              <span>
                <Termo termo="regime">Limpeza antes de ração</Termo>
              </span>
              <span>Carga de ração</span>
            </TabelaCabecalho>
            {v.loading ? (
              <TabelaEsqueleto linhas={6} />
            ) : (
              v.produtos.map((p) => (
                <TabelaLinha key={p.id}>
                  <Celula forte={p.nome} sub={p.en} />
                  <span className="tx-sec">{p.sin}</span>
                  <span className="tx-sec">{p.cat}</span>
                  <span>
                    <SeloRegime regime={p.regime} palavra />
                  </span>
                  <span className={p.racao ? 'tx-sec' : 'tx-apagado'}>{p.racao ? 'Sim' : 'Não'}</span>
                </TabelaLinha>
              ))
            )}
          </Tabela>
          {v.pVazio ? (
            <div data-tx-vazio="">
              <EstadoVazio
                titulo={v.pVazioTit}
                acao={
                  v.pVazioPede ? (
                    <Botao variante="primario" tamanho="p" onClick={v.pedirDaBusca} data-tx-pedir-da-busca="">
                      {v.pVazioRot}
                    </Botao>
                  ) : null
                }
              >
                {v.pVazioTxt}
              </EstadoVazio>
            </div>
          ) : null}
        </Cartao>
      </>
    );
  }

  renderManual(v) {
    return (
      <>
        <Cartao
          lista
          titulo={v.manualTitulo}
          sub="O motorista lê em cartões, no link; a ciência grava a versão na viagem."
          acoes={
            v.podeManual ? (
              <Botao variante="contorno" tamanho="p" onClick={v.abrirPublicar} data-tx-publicar="">
                Publicar nova versão
              </Botao>
            ) : null
          }
        >
          <Tabela colunas={COLS_VERSOES} rotulo="Versões do manual">
            <TabelaCabecalho>
              <span>Versão</span>
              <span>Vigência</span>
              <span>O que mudou</span>
              <span>Ciências em viagens</span>
            </TabelaCabecalho>
            {v.versoes.map((vs) => (
              <TabelaLinha key={vs.v}>
                <span className="tx-mono tx-peso-700">v{vs.v}</span>
                {vs.on ? <Situacao tom="ok">{vs.st}</Situacao> : <span className="tx-apagado num">{vs.st}</span>}
                <span className="tx-sec">{vs.mud}</span>
                <span className="num">{vs.ciencias}</span>
              </TabelaLinha>
            ))}
          </Tabela>
          <div className="tx-cad-alternar">
            <Botao variante="contorno" tamanho="p" onClick={v.alternarCartoes} data-tx-ver-cartoes="" aria-expanded={!!v.verCartoes}>
              {v.cartoesRot}
            </Botao>
            <span className="tx-tipo-denso tx-apagado">{v.cartoesSub}</span>
          </div>
          {v.verCartoes ? (
            <div className="tx-cad-manual">
              {v.cartoes.map((ct) => (
                <div key={ct.t} className="tx-cad-manual__item">
                  <div className="tx-cad-manual__t">{ct.t}</div>
                  <div className="tx-cad-manual__txt">{ct.txt}</div>
                </div>
              ))}
            </div>
          ) : null}
        </Cartao>
        <Cartao
          lista
          titulo="Treinamentos"
          acoes={
            v.podeTreino ? (
              <Botao variante="contorno" tamanho="p" onClick={v.abrirTreino} data-tx-novo-treino="">
                Registrar treinamento
              </Botao>
            ) : null
          }
        >
          <div className="tx-cad-barra">
            <CampoBusca valor={v.tq || ''} aoMudar={v.onTq} placeholder="Tema, instrutor ou participante" rotulo="Buscar treinamento" />
            <span className="tx-cad-barra__fim tx-cad-contagem num">
              {v.treinos.length === v.treinosTotal ? v.treinosTotal + ' treinamentos' : v.treinos.length + ' de ' + v.treinosTotal}
            </span>
          </div>
          <Tabela colunas={COLS_TREINO} rotulo="Treinamentos registrados">
            <TabelaCabecalho>
              <span>Data</span>
              <span>Tema</span>
              <span>Instrutor</span>
              <span>Carga</span>
              <span>Participantes</span>
              <span />
            </TabelaCabecalho>
            {v.treinos.map((tr) => (
              <TabelaLinha
                key={tr.k}
                onClick={() => this.setState({ drawer: { treino: tr.k } })}
                aria-label={'Abrir treinamento ' + tr.tema}
              >
                <span className="tx-mono num">{tr.data}</span>
                <span className="tx-peso-700">{tr.tema}</span>
                <span className="tx-sec">{tr.instrutor}</span>
                <span className="tx-sec">{tr.carga}</span>
                <Celula forte={tr.n + (tr.n === 1 ? ' pessoa' : ' pessoas')} sub={tr.resumo} />
                <SetaLinha />
              </TabelaLinha>
            ))}
          </Tabela>
          {v.treinos.length === 0 ? (
            <EstadoVazio titulo={v.treinosTotal ? 'Nenhum treinamento com essa busca' : 'Nenhum treinamento registrado'}>
              {v.treinosTotal
                ? 'Busque pelo tema, pelo instrutor ou pelo nome de quem participou.'
                : 'Registre o primeiro para o auditor conferir.'}
            </EstadoVazio>
          ) : null}
        </Cartao>
      </>
    );
  }

  renderFornecedores(v) {
    return (
      <>
        <BarraFiltros
          busca={{ valor: v.fq || '', aoMudar: v.onFq, placeholder: 'Nome, CNPJ ou cidade', rotulo: 'Buscar fornecedor' }}
          filtros={v.fFiltros}
          rotuloFiltros="Filtrar fornecedores"
          aoLimpar={v.temFiltroForn ? v.limparForn : undefined}
          resultado={v.fResultado}
        />
        <Cartao lista className="tx-cad-folha">
          <Tabela colunas={COLS_FORN} rotulo="Fornecedores">
            <TabelaCabecalho fixo colunas={v.fCols} />
            {v.loading ? (
              <TabelaEsqueleto linhas={4} />
            ) : (
              v.fornecedores.map((fo) => (
                <div
                  key={fo.id}
                  role="row"
                  data-tx-forn={fo.id}
                  aria-selected={fo.hl || undefined}
                  className="tx-tabela__linha tx-tabela__linha--clicavel"
                  onClick={fo.abrir}
                  style={{ scrollMarginTop: 'var(--esp-12)' }}
                >
                  <span className="tx-cad-nome">
                    <IconeTipo tipo={tipoDoServico(fo.servico)} />
                    <span style={{ minWidth: '0' }}>
                      <button type="button" className="tx-cad-abrir" onClick={(e) => (e.stopPropagation(), fo.abrir())}>
                        {fo.nome}
                      </button>
                      <span className="tx-tabela__sub tx-mono">{fo.cnpj}</span>
                    </span>
                  </span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <ChipServico servico={fo.servico} regime={fo.regime} />
                  </span>
                  <span className="tx-sec">{fo.cidade}</span>
                  <Situacao tom={fo.docTom}>{fo.docRot}</Situacao>
                  <span className="tx-cad-venc">
                    {fo.pior ? (
                      <span style={{ minWidth: '0' }}>
                        <span className="tx-tabela__forte">{fo.pior.n}</span>
                        <span className={'tx-tabela__sub tx-cad-prazo tx-cad-prazo--' + fo.pior.tom}>{fo.pior.prazo}</span>
                      </span>
                    ) : (
                      <span className="tx-apagado">Sem documento</span>
                    )}
                    {fo.pior && fo.pior.atualiza && v.podeDoc ? (
                      <Botao variante="contorno" tamanho="p" onClick={fo.pior.onAtualizar} data-tx-atualizar-doc={fo.pior.k}>
                        Atualizar
                      </Botao>
                    ) : null}
                  </span>
                  <SetaLinha />
                </div>
              ))
            )}
          </Tabela>
          {v.fVazio ? (
            <EstadoVazio
              titulo="Nenhum fornecedor com esses filtros"
              acao={
                v.temFiltroForn ? (
                  <Botao tamanho="p" onClick={v.limparForn}>
                    Limpar filtros
                  </Botao>
                ) : v.podeForn ? (
                  <Botao variante="primario" tamanho="p" onClick={v.novoFornecedor}>
                    Cadastrar fornecedor
                  </Botao>
                ) : null
              }
            >
              {v.temFiltroForn ? 'Mude a busca ou tire um filtro.' : 'Cadastre o primeiro lavador ou prestador.'}
            </EstadoVazio>
          ) : null}
        </Cartao>
      </>
    );
  }

  renderFiliais(v) {
    return (
      <>
        {v.filiaisSemOc.length ? (
          <Aviso
            tom="perigo"
            titulo={v.filiaisSemOc.map((f) => f.nome).join(', ') + ': gatekeeper não comunicado ao organismo certificador.'}
          >
            A TS1.2 exige a comunicação antes do primeiro protocolo. Até lá, viagens de TAC dessa filial ficam bloqueadas.
          </Aviso>
        ) : null}
        <Cartao lista>
          <Tabela colunas={COLS_FIL} rotulo="Filiais">
            <TabelaCabecalho>
              <span>Filial</span>
              <span>Afretador</span>
              <span>
                <Termo termo="gatekeeper">Gatekeeper</Termo>, 45 dias
              </span>
              <span>Organismo certificador</span>
              <span />
              <span />
            </TabelaCabecalho>
            {v.loading ? (
              <TabelaEsqueleto linhas={4} />
            ) : (
              v.filiais.map((fl) => (
                <div
                  key={fl.id}
                  role="row"
                  data-tx-filial-card={fl.id}
                  className="tx-tabela__linha tx-tabela__linha--clicavel"
                  onClick={fl.abrir}
                >
                  <span style={{ minWidth: '0' }}>
                    <button type="button" className="tx-cad-abrir" onClick={(e) => (e.stopPropagation(), fl.abrir())}>
                      {fl.nome}
                      {fl.matriz ? <span className="tx-apagado tx-peso-600">, matriz</span> : null}
                    </button>
                    <span className="tx-tabela__sub tx-mono">{fl.reg}</span>
                  </span>
                  <span className="tx-sec">{fl.afretador}</span>
                  <span className="num tx-peso-700">{fl.gk + (fl.gk === 1 ? ' protocolo' : ' protocolos')}</span>
                  <Situacao tom={fl.oc ? 'ok' : 'bloqueio'} detalhe={fl.ocSub}>
                    {fl.ocRot}
                  </Situacao>
                  <span style={{ display: 'flex', gap: 'var(--esp-2)', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                    {fl.oc || !v.podeOC ? (
                      <Botao variante="contorno" tamanho="p" href={fl.hrefMesa}>
                        Abrir a mesa
                      </Botao>
                    ) : (
                      <Botao variante="primario" tamanho="p" onClick={fl.registrar} data-tx-registrar-oc={fl.id}>
                        Registrar comunicação
                      </Botao>
                    )}
                  </span>
                  <SetaLinha />
                </div>
              ))
            )}
          </Tabela>
        </Cartao>
      </>
    );
  }

  renderDrawers(v) {
    const fo = v.dForn;
    if (fo)
      return (
        <Drawer
          id="cad-forn"
          data-tx-drawer="forn"
          titulo={fo.nome}
          sub={fo.cnpj + ', ' + fo.cidade}
          aoFechar={v.fecharDrawer}
          rodape={<Botao onClick={v.fecharDrawer}>Fechar</Botao>}
        >
          <Linha rotulo="Serviço">
            <ChipServico servico={fo.servico} regime={fo.regime} />
          </Linha>
          {fo.regime ? (
            <Linha rotulo="Limpeza até">
              <SeloRegime regime={fo.regime} palavra />
            </Linha>
          ) : null}
          <h3 className="tx-cad-secao">Documentos</h3>
          {fo.docs.map((d) => (
            <Linha key={d.k} rotulo={d.n}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)' }}>
                <Situacao tom={d.tom}>{d.r}</Situacao>
                {d.atualiza && v.podeDoc ? (
                  <Botao variante="contorno" tamanho="p" onClick={d.onAtualizar} data-tx-d-atualizar-doc={d.k}>
                    Atualizar
                  </Botao>
                ) : null}
              </span>
            </Linha>
          ))}
          {fo.regime ? (
            <>
              <h3 className="tx-cad-secao">Viagens com limpeza aqui</h3>
              {fo.viagens.length ? (
                fo.viagens.map((vg) => (
                  <Linha key={vg.id} rotulo={<span className="num">{vg.data}</span>}>
                    <Botao variante="texto" tamanho="p" href={vg.href}>
                      {vg.ordem}
                    </Botao>
                  </Linha>
                ))
              ) : (
                <p className="tx-cad-texto">Nenhuma viagem registrou limpeza com este lavador.</p>
              )}
            </>
          ) : null}
        </Drawer>
      );
    const fl = v.dFilial;
    if (fl)
      return (
        <Drawer
          id="cad-filial"
          data-tx-drawer="filial"
          titulo={fl.nome}
          sub={fl.matriz ? 'Matriz' : 'Filial'}
          aoFechar={v.fecharDrawer}
          rodape={
            <>
              <Botao onClick={v.fecharDrawer}>Fechar</Botao>
              <Botao variante="primario" href={fl.hrefMesa}>
                Abrir a mesa
              </Botao>
            </>
          }
        >
          {!fl.oc ? (
            <Aviso
              tom="perigo"
              titulo="Gatekeeper não comunicado."
              acao={
                v.podeOC ? (
                  <Botao variante="primario" tamanho="p" onClick={fl.registrar} data-tx-d-registrar-oc={fl.id}>
                    Registrar
                  </Botao>
                ) : null
              }
            >
              Viagens de TAC desta filial ficam bloqueadas até a comunicação ao organismo certificador.
            </Aviso>
          ) : null}
          <Linha rotulo="Registro GMP+">
            <span className="tx-mono">{fl.reg}</span>
          </Linha>
          <Linha rotulo="Afretador">
            <span className="tx-peso-700">{fl.afretador}</span>
          </Linha>
          <Linha rotulo="Protocolos gatekeeper, 45 dias">
            <span className="num tx-peso-700">{fl.gk}</span>
          </Linha>
          <Linha rotulo="Organismo certificador">
            <Situacao tom={fl.oc ? 'ok' : 'bloqueio'} forma="selo">
              {fl.oc ? fl.ocRot + ', ' + fl.ocSub : fl.ocRot}
            </Situacao>
          </Linha>
        </Drawer>
      );
    const tr = v.dTreino;
    if (tr)
      return (
        <Drawer
          id="cad-treino"
          data-tx-drawer="treino"
          titulo={tr.tema}
          sub={tr.data}
          aoFechar={v.fecharDrawer}
          rodape={<Botao onClick={v.fecharDrawer}>Fechar</Botao>}
        >
          <Linha rotulo="Instrutor">
            <span className="tx-peso-700">{tr.instrutor}</span>
          </Linha>
          <Linha rotulo="Carga horária">
            <span className="tx-peso-700">{tr.carga}</span>
          </Linha>
          <h3 className="tx-cad-secao">Participantes ({tr.n})</h3>
          <div className="tx-cad-pessoas">
            {tr.pessoas.map((p, i) => (
              <Badge key={i} cheio>
                {p}
              </Badge>
            ))}
          </div>
        </Drawer>
      );
    return null;
  }

  renderModal(v) {
    if (!v.mAberto) return null;
    const mp = v.mPessoas;
    return (
      <Modal
        id="cad-modal"
        data-tx-modal={v.mK}
        tamanho="g"
        titulo={v.mTitulo}
        extra={v.mExtra ? <Badge tom="marca">{v.mExtra}</Badge> : null}
        sub={v.mSub}
        aoFechar={v.fecharModal}
        falta={v.mFalta}
        acoes={
          <>
            <Botao onClick={v.fecharModal}>Cancelar</Botao>
            <Botao variante="primario" inativo={!v.ctaOk} onClick={v.confirmar} data-tx-confirmar="">
              {v.mCta}
            </Botao>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--esp-3)' }}>
          {v.mCampos.map((mc) => (
            <Campo key={mc.k} id={'cad-m-' + mc.k} rotulo={mc.l} campo={mc.k} erro={mc.erro} style={{ gridColumn: mc.col }}>
              <Entrada
                mono={!!mc.data}
                value={mc.v ?? ''}
                onChange={mc.on}
                inputMode={mc.data ? 'numeric' : 'text'}
                maxLength={mc.data ? 10 : undefined}
                placeholder={mc.ph}
              />
            </Campo>
          ))}
          {v.mArquivo ? (
            <Campo id="cad-m-arquivo" rotulo="Documento novo" opcional dica={v.arquivoNome || 'PDF ou foto do documento renovado.'}>
              <input type="file" accept=".pdf,image/*" className="tx-entrada tx-cad-arquivo" onChange={v.onArquivo} />
            </Campo>
          ) : null}
        </div>
        {v.mGrupos.map((g) => (
          <Escolhas key={g.id} id={g.id} rotulo={g.rotulo} itens={g.itens} />
        ))}
        {mp ? (
          <div className="tx-campo">
            <div id="cad-part" className="tx-campo__rotulo">
              Participantes {mp.n ? <span className="tx-apagado num">({mp.n})</span> : null}
            </div>
            <div className="tx-cad-part-barra">
              <CampoBusca valor={mp.pq} aoMudar={mp.onPq} placeholder="Buscar pessoa" rotulo="Buscar participante" />
              <Botao variante="texto" tamanho="p" onClick={mp.alternarFrota}>
                {mp.todasFrota ? 'Tirar a frota própria' : 'Selecionar toda a frota própria'}
              </Botao>
              {mp.n ? (
                <Botao variante="texto" tamanho="p" onClick={mp.limpar}>
                  Limpar
                </Botao>
              ) : null}
            </div>
            <div className="tx-cad-part" role="group" aria-labelledby="cad-part" data-tx-campo="part" tabIndex={-1}>
              {mp.itens.map((it) => (
                <Chip key={it.k} tipo="filtro" selecionado={it.on} onClick={it.onClick} data-tx-chip={it.k} title={it.grupo}>
                  {it.n}
                </Chip>
              ))}
              {mp.itens.length === 0 ? <span className="tx-apagado tx-tipo-denso">Ninguém com esse nome.</span> : null}
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Cadastros" data-tela="Cadastros">
        <div className="tx-pagina">
          <CabecalhoPagina
            titulo={<span data-tx-titulo="">{v.abaNome}</span>}
            sub={v.abaSub}
            acoes={
              v.aba === 'fornecedores' && v.podeForn ? (
                <Botao variante="primario" onClick={v.novoFornecedor} data-tx-acao-aba="">
                  Cadastrar fornecedor
                </Botao>
              ) : v.aba === 'produtos' && v.podeClass ? (
                <Botao variante="contorno" onClick={v.abrirClassificar} data-tx-pedir-classificacao="">
                  Pedir classificação
                </Botao>
              ) : null
            }
          />
          {v.mostrarAbas ? <Abas rotulo="Seções de cadastros" itens={v.abas} /> : null}
          {v.aba === 'produtos' ? this.renderProdutos(v) : null}
          {v.aba === 'manual' ? this.renderManual(v) : null}
          {v.aba === 'fornecedores' ? this.renderFornecedores(v) : null}
          {v.aba === 'filiais' ? this.renderFiliais(v) : null}
        </div>
        {this.renderDrawers(v)}
        {this.renderModal(v)}
      </div>
    );
  }
}
