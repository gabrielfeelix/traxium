// Gerado de "SaaS moderno estilo Dribbble/Viagens v2.dc.html" por scripts/converter-dc.mjs.
'use client';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Abas,
  Aviso,
  Badge,
  Botao,
  CabecalhoPagina,
  Checkbox,
  Chip,
  EntradaCaixa,
  EstadoVazio,
  Modal,
  Paginacao,
  Situacao,
  TabelaEsqueleto,
} from '@/components/ui';
import './Viagens.css';

// Permissões do usuário atual. TX.pode chega com a revisão do motor (M40); até lá vale a premissa
// da matriz: consultoria só lê e exporta, frota não concilia CT-e.
function pode(op, alvo) {
  if (TX.pode) return TX.pode(op, alvo);
  const papel = TX.sessao().papel;
  if (papel === 'consultoria') return false;
  if (papel === 'frota') return op === 'escopoFrota' || op === 'atualizarDocumento';
  return true;
}
// Motivo em forma de falha (M09, M42): o motor passa a devolver item.motivo ou TX.rotuloFalha;
// até lá, o mesmo mapa da mesa (Hoje) para as checagens escritas como afirmação positiva.
const FALHA = {
  ocorrencia: 'Transportador em revisão após ocorrência grave',
  'docs-conj': 'CRLV vencido no conjunto',
  'docs-mot': 'CNH vencida',
  'docs-transp': 'RNTRC vencido',
  produto: 'Produto não é ração',
};
function motivoFalha(f, dec) {
  const t = motivoFalhaBruto(f, dec);
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}
function motivoFalhaBruto(f, dec) {
  if (!f) return '';
  if (f.motivo) return f.motivo;
  const r = TX.rotuloFalha ? TX.rotuloFalha(f.k) : '';
  if (r) return r.replace(/^./, (c) => c.toUpperCase());
  if (FALHA[f.k]) return FALHA[f.k];
  if (dec && dec.cobertura === 'gatekeeper' && f.k === 'cobertura') return 'Filial sem comunicação à certificadora';
  if (f.tecnico || f.alcada === 'tecnico') return f.detalhe.split(':')[0];
  return f.o;
}
const Chevron = (
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
const IconeBusca = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const IconeBaixar = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 2.5v8" />
    <path d="M4.8 7.5 8 10.7l3.2-3.2" />
    <path d="M3 13.2h10" />
  </svg>
);
// Ordem das situações quando a coluna Situação ordena: o que pede ação primeiro.
const PESO_SIT = { tecnico: 0, bloqueada: 1, falta: 2, sem_cte: 3, pronta: 4, transito: 5, concluida: 6, cancelada: 7 };
// Parâmetros da URL na ordem em que aparecem (deep link: visão, filtros, ordem e página).
const URL_PARAMS = ['visao', 'periodo', 'q', 'situacao', 'tipo', 'filial', 'ordem', 'pag'];

export default class Viagens extends Tela {
  state = {
    loading: true,
    busca: '',
    periodo: '30',
    tipo: 'todos',
    filial: null,
    sit: 'todas',
    visao: 'todas',
    modal: null,
    popAberto: null,
    nomeVisao: '',
    ordem: 'carga-desc',
    sel: {},
    apagada: null,
  };
  componentDidMount() {
    TX.ui.montar(this);
    const P = TX.ui.param;
    const ini = {};
    if (P('visao') && this.visoes().some((x) => x.k === P('visao'))) Object.assign(ini, this.entrarVisao(P('visao')));
    if (P('conciliar')) Object.assign(ini, this.entrarVisao('sem_cte'), { modal: 'conciliar' });
    if (P('q')) ini.busca = P('q');
    if (P('situacao')) ini.sit = P('situacao');
    if (P('periodo')) ini.periodo = P('periodo');
    if (P('tipo')) ini.tipo = P('tipo');
    if (P('filial') && TX.sessao().filiais.includes(P('filial'))) ini.filial = P('filial');
    if (P('ordem')) ini.ordem = P('ordem');
    if (P('pag')) ini.pag = Math.max(1, +P('pag') || 1);
    this.setState(ini);
  }
  // A URL acompanha visão, busca, filtros, ordem e página, para mandar o link de uma lista filtrada.
  componentDidUpdate(_, antes) {
    const s = this.state;
    const mudou = ['visao', 'busca', 'periodo', 'tipo', 'filial', 'sit', 'ordem', 'pag'].some((k) => antes[k] !== s[k]);
    if (!mudou) return;
    const vi = this.visao(s.visao);
    const perDef = vi.usuario ? (vi.filtros && vi.filtros.periodo) || '30' : vi.periodo;
    const val = {
      visao: s.visao !== 'todas' ? s.visao : '',
      periodo: s.periodo !== perDef ? s.periodo : '',
      q: s.busca || '',
      situacao: s.sit !== 'todas' ? s.sit : '',
      tipo: s.tipo !== 'todos' ? s.tipo : '',
      filial: s.filial || '',
      ordem: s.ordem !== 'carga-desc' ? s.ordem : '',
      pag: s.pag > 1 ? String(s.pag) : '',
    };
    const qs = URL_PARAMS.filter((k) => val[k])
      .map((k) => k + '=' + encodeURIComponent(val[k]))
      .join('&');
    try {
      TX.ui.trocarUrl('/viagens' + (qs ? '?' + qs : ''));
    } catch (e) {}
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  visoesSalvas() {
    try {
      return JSON.parse(TX.ui.lerLS('tx-v2-visoes', '[]'));
    } catch (e) {
      return [];
    }
  }
  // Visões de fábrica: recortes que antes eram telas (Limpezas, Exceções) e filas com ação.
  visoes() {
    const comOc = new Set(TX.db.ocorrencias.map((o) => o.viagem));
    return [
      { k: 'todas', n: 'Todas', periodo: '30', f: () => true },
      {
        k: 'limpeza',
        n: 'Limpeza exigida',
        periodo: '90',
        cor: 'var(--aviso-2)',
        f: (x) => !x.v.cancelada && (['B', 'C', 'D'].includes(x.dec.regime) || (x.v.limpezas || []).length > 0),
        conta: (x) => !x.v.cancelada && x.dec.falta.some((c) => c.k === 'regime' && c.estado === 'falta'),
        dica: 'Viagens em que a carga anterior pediu lavagem. As que estão em Falta algo esperam o comprovante do lavador: abra a viagem para anexar.',
        vazio: ['Nenhuma viagem pediu lavagem no período', 'Amplie o período para ver limpezas mais antigas.'],
      },
      {
        k: 'sem_cte',
        n: 'Aguardando CT-e',
        periodo: 'tudo',
        conta: true,
        semSituacao: true,
        cor: 'var(--autoridade-2)',
        f: (x) => this.sitDe(x) === 'sem_cte',
        dica: 'Viagens já carregadas que ainda não têm CT-e. Importe o arquivo do TMS e o Traxium casa cada CT-e com a viagem pela placa e pela data.',
        acao: 'Conciliar CT-e em lote',
        vazio: ['Nenhuma viagem esperando CT-e', 'Toda viagem carregada já está conciliada com o TMS.'],
      },
      {
        k: 'autoridade',
        n: 'Liberadas por autoridade',
        periodo: '90',
        cor: 'var(--autoridade)',
        f: (x) => x.dec.porAutoridade,
        dica: 'Viagens que seguiram com um bloqueio liberado pela Qualidade ou pela Direção. Quem assinou, o motivo e a medida ficam registrados em cada viagem.',
        vazio: ['Nenhuma liberação por autoridade no período', 'Amplie o período para ver liberações mais antigas.'],
      },
      {
        k: 'ocorrencia',
        n: 'Com ocorrência',
        periodo: '90',
        cor: 'var(--perigo)',
        f: (x) => comOc.has(x.v.id),
        dica: 'Viagens com ocorrência registrada na conferência ou no destino. A lista para o SGQ, com descrição e revisão, sai em Auditoria.',
        link: ['Ocorrências do período', '/auditoria#ocorrencias'],
        vazio: ['Nenhuma ocorrência no período', 'Amplie o período para ver ocorrências mais antigas.'],
      },
    ].concat(this.visoesSalvas().map((u) => ({ k: u.k, n: u.n, usuario: true, base: u.base || 'todas', filtros: u.f })));
  }
  visao(k) {
    const t = this.visoes();
    return t.find((x) => x.k === k) || t[0];
  }
  entrarVisao(k) {
    const vi = this.visao(k);
    const limpo = { busca: '', tipo: 'todos', filial: null, sit: 'todas', pag: 1, popAberto: null, sel: {} };
    if (vi.usuario) return Object.assign(limpo, vi.filtros, { visao: vi.k });
    return Object.assign(limpo, { periodo: vi.periodo, visao: vi.k });
  }
  predicado(vi) {
    return vi.usuario ? this.visao(vi.base).f : vi.f;
  }
  enriquecer(lista) {
    return lista.map((v) => {
      const dec = TX.decidir(v),
        cic = TX.ciclo(v),
        t = TX.transportador(v.transportador),
        conj = TX.conjunto(v.conjunto),
        mot = TX.pessoa(v.motorista);
      const txt = TX.norm(
        [
          v.ordem,
          v.id,
          v.cte && v.cte.numero,
          v.cte && v.cte.nf,
          TX.placasDoConjunto(conj).join(' '),
          mot.nome,
          TX.nomeTransportador(t),
          t && t.rntrc && t.rntrc.numero,
          TX.produto(v.produto).nome,
          TX.embarcador(v.embarcador).nome,
          TX.destinatario(v.destinatario).nome,
        ].join(' '),
      );
      return { v, dec, cic, t, conj, mot, txt };
    });
  }
  noEscopo() {
    const u = TX.sessao();
    return TX.db.viagens.filter((v) => u.filiais.includes(v.filial));
  }
  filtrar(todasEnr) {
    const s = this.state;
    const fil = s.filial || 'todas';
    const lim = { hoje: TX.HOJE, 7: TX.addDias(TX.HOJE, -7), 30: TX.addDias(TX.HOJE, -30), 90: TX.addDias(TX.HOJE, -90), tudo: '0000' }[
      s.periodo
    ];
    const q = TX.norm(s.busca);
    return todasEnr
      .filter(
        (x) =>
          (fil === 'todas' || x.v.filial === fil) &&
          x.v.data >= lim &&
          (s.periodo !== 'hoje' || x.v.data === TX.HOJE) &&
          (s.tipo === 'todos' || (s.tipo === 'propria') === (x.v.tipo === 'propria')),
      )
      .filter((x) => !q || x.txt.includes(q) || TX.soDigitos(x.txt).includes(TX.soDigitos(s.busca) || '#'));
  }
  sitDe(x) {
    if (x.v.cancelada) return 'cancelada';
    if (x.cic.k === 'concluida') return 'concluida';
    if (x.cic.k === 'sem_cte') return 'sem_cte';
    if (x.cic.k === 'transito') return 'transito';
    return { pronta: 'pronta', falta: 'falta', bloqueada: 'bloqueada', tecnico: 'tecnico', nao_assegurada: 'pronta' }[x.dec.resultado];
  }
  renderVals() {
    return Object.assign({}, TX.ui.base(this), this.telaVals(), this.concVals());
  }
  telaVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      u = TX.sessao();
    const todasEnr = this.enriquecer(this.noEscopo());
    const VIS = this.visoes();
    const vi = this.visao(s.visao);
    const pred = this.predicado(vi);
    const base = this.filtrar(todasEnr).filter(pred);
    const SIT = [
      ['todas', 'Todas', 'na'],
      ['falta', 'Falta algo', 'falta'],
      ['bloqueada', 'Bloqueadas', 'bloqueio'],
      ['tecnico', 'Bloqueio técnico', 'tecnico'],
      ['pronta', 'Prontas', 'ok'],
      ['transito', 'Em trânsito', 'info'],
      ['concluida', 'Concluídas', 'ok'],
      ['cancelada', 'Canceladas', 'na'],
    ];
    // Ordenação por coluna (U21): chave-direção, padrão carregamento mais recente primeiro.
    const [oc, od] = (s.ordem || 'carga-desc').split('-');
    const chave =
      {
        carga: (x) => x.v.data + x.v.janela,
        ordem: (x) => x.v.ordem,
        transp: (x) => TX.norm(x.t ? TX.nomeTransportador(x.t) : 'frota propria'),
        sit: (x) => String(PESO_SIT[this.sitDe(x)] ?? 9) + (x.v.data + x.v.janela),
      }[oc] || ((x) => x.v.data + x.v.janela);
    const lista = base
      .filter((x) => s.sit === 'todas' || this.sitDe(x) === s.sit)
      .sort((a, b) => (od === 'asc' ? 1 : -1) * chave(a).localeCompare(chave(b)));
    const pg = U.paginar(this, lista, 'viagens');
    const set = (o) => this.setState(Object.assign({ pag: 1, popAberto: null }, o));
    const pop = (k) => () => this.setState((st) => ({ popAberto: st.popAberto === k ? null : k }));
    const perDef = vi.usuario ? vi.filtros.periodo || '30' : vi.periodo;
    const PER = [
      ['hoje', 'Hoje'],
      ['7', 'Últimos 7 dias'],
      ['30', 'Últimos 30 dias'],
      ['90', 'Últimos 90 dias'],
      ['tudo', 'Desde o início'],
    ];
    const TIPOS = [
      ['todos', 'Todos'],
      ['afretamento', 'Afretamento'],
      ['propria', 'Frota própria'],
    ];
    const filtroAtivo = !!(s.busca || s.sit !== 'todas' || s.tipo !== 'todos' || s.filial || s.periodo !== perDef);
    const nomeOk = TX.norm(s.nomeVisao || '').length > 0;
    const salvar = () => {
      if (!nomeOk) return;
      const k = 'u' + Date.now();
      const nova = this.visoesSalvas().concat([
        {
          k,
          n: s.nomeVisao.trim(),
          base: vi.usuario ? vi.base : vi.k,
          f: { periodo: s.periodo, sit: s.sit, tipo: s.tipo, filial: s.filial, busca: s.busca },
        },
      ]);
      U.gravarLS('tx-v2-visoes', JSON.stringify(nova));
      this.setState({ visao: k, popAberto: null, nomeVisao: '', txv: Date.now() });
      this.avisar('Visão "' + s.nomeVisao.trim() + '" salva. Ela abre como aba acima da lista.');
    };
    const sel = s.sel || {};
    const selecionadas = lista.filter((x) => sel[x.v.id]);
    const idsPagina = pg.itens.map((x) => x.v.id);
    const todasPagina = idsPagina.length > 0 && idsPagina.every((id) => sel[id]);
    const ordenar = (c) => () => {
      const atual = (s.ordem || 'carga-desc').split('-');
      const dir = atual[0] === c ? (atual[1] === 'asc' ? 'desc' : 'asc') : c === 'carga' ? 'desc' : 'asc';
      this.setState({ ordem: c + '-' + dir, pag: 1 });
    };
    const colOrdem = (c) => (oc === c ? (od === 'asc' ? 'ascending' : 'descending') : 'none');
    return Object.assign(
      {
        contagem: lista.length === 1 ? '1 viagem' : lista.length + ' viagens',
        abas: VIS.map((x) => {
          const q = x.conta ? todasEnr.filter(typeof x.conta === 'function' ? x.conta : x.f).length : 0;
          return {
            k: x.k,
            n: x.n,
            q,
            on: x.k === vi.k,
            usuario: !!x.usuario,
            onClick: () => this.setState(this.entrarVisao(x.k)),
            // Apagar uma visão salva é reversível: apaga na hora e oferece Desfazer por 8 s.
            remover: () => {
              const salvas = this.visoesSalvas();
              const i = salvas.findIndex((y) => y.k === x.k);
              U.gravarLS('tx-v2-visoes', JSON.stringify(salvas.filter((y) => y.k !== x.k)));
              clearTimeout(this._desfazer);
              this._desfazer = setTimeout(() => this.setState({ apagada: null }), 8000);
              this.setState(
                Object.assign(x.k === vi.k ? this.entrarVisao('todas') : {}, { txv: Date.now(), apagada: { item: salvas[i], i } }),
              );
            },
          };
        }),
        apagadaNome: s.apagada ? s.apagada.item.n : '',
        desfazerApagar: () => {
          const a = s.apagada;
          if (!a) return;
          const salvas = this.visoesSalvas();
          salvas.splice(a.i, 0, a.item);
          U.gravarLS('tx-v2-visoes', JSON.stringify(salvas));
          clearTimeout(this._desfazer);
          this.setState({ apagada: null, txv: Date.now() });
        },
        busca: s.busca,
        onBusca: (e) => this.setState({ busca: e.target.value, pag: 1 }),
        perRot: (PER.find((x) => x[0] === s.periodo) || PER[2])[1].replace('Últimos ', ''),
        perMudou: s.periodo !== perDef,
        popPeriodo: s.popAberto === 'periodo',
        abrirPeriodo: pop('periodo'),
        periodos: PER.map(([k, n]) => ({ k, n, on: s.periodo === k, onClick: () => set({ periodo: k }) })),
        temSituacao: !vi.semSituacao,
        situacoes: SIT.map(([k, n, tom]) => {
          const q = k === 'todas' ? base.length : base.filter((x) => this.sitDe(x) === k).length;
          return { k, n, q, tom, on: s.sit === k, onClick: () => set({ sit: s.sit === k && k !== 'todas' ? 'todas' : k }) };
        }).filter((x) => x.k === 'todas' || x.q > 0 || x.on),
        tipoRot: TIPOS.find((x) => x[0] === s.tipo)[1],
        tipoMudou: s.tipo !== 'todos',
        popTipo: s.popAberto === 'tipo',
        abrirTipo: pop('tipo'),
        tipos: TIPOS.map(([k, n]) => ({ k, n, on: s.tipo === k, onClick: () => set({ tipo: k }) })),
        temFiliais: u.filiais.length > 1,
        filialRot: s.filial ? TX.filial(s.filial).nome : 'Todas',
        filialMudou: !!s.filial,
        popFilial: s.popAberto === 'filial',
        abrirFilial: pop('filial'),
        filiais: [[null, 'Todas as filiais']].concat(u.filiais.map((f) => [f, TX.filial(f).nome])).map(([k, n]) => ({
          k: k || 'todas',
          n,
          on: (s.filial || null) === k,
          onClick: () => set({ filial: k }),
        })),
        filtroAtivo,
        limpar: () => this.setState(Object.assign(this.entrarVisao(vi.k), { busca: '' })),
        popSalvar: s.popAberto === 'salvar',
        abrirSalvar: pop('salvar'),
        nomeVisao: s.nomeVisao || '',
        onNomeVisao: (e) => this.setState({ nomeVisao: e.target.value }),
        teclaVisao: (e) => {
          if (e.key === 'Enter') salvar();
        },
        confirmarVisao: salvar,
        visOk: nomeOk,
        temDica: !!vi.dica,
        dica: vi.dica || '',
        temDicaAcao: !!vi.acao && pode('conciliarCTe'),
        dicaAcaoRot: vi.acao || '',
        dicaAcao: () => this.setState({ modal: 'conciliar', lote: null }),
        temDicaLink: !!vi.link,
        dicaLinkRot: vi.link ? vi.link[0] : '',
        dicaHref: vi.link ? vi.link[1] : '#',
        colOrdem,
        ordenar,
        // seleção (U23)
        selQ: selecionadas.length,
        todasPagina,
        algumaPagina: idsPagina.some((id) => sel[id]),
        alternarPagina: () => {
          const n = Object.assign({}, sel);
          idsPagina.forEach((id) => (todasPagina ? delete n[id] : (n[id] = true)));
          this.setState({ sel: n });
        },
        limparSel: () => this.setState({ sel: {} }),
        exportarSel: () => this.exportarCsv(selecionadas),
        linhas: s.loading
          ? []
          : pg.itens.map((x) => {
              const v = x.v;
              const sit = this.sitDe(x);
              const alertas = x.dec.alertas || (x.dec.checagens || []).filter((c) => c.aviso).map((c) => ({ motivo: c.nome }));
              const tom =
                sit === 'concluida' ? 'ok' : sit === 'sem_cte' ? 'autoridade' : sit === 'transito' ? 'info' : U.tomResultado(x.dec).k;
              const fl = x.dec.falta;
              const motivo = fl.length ? (sit === 'falta' ? fl[0].o : motivoFalha(fl[0], x.dec)) : '';
              const sub = v.cancelada
                ? v.cancelada.motivo || 'cancelada'
                : sit === 'concluida' || sit === 'transito'
                  ? x.cic.sub
                  : sit === 'sem_cte'
                    ? 'conciliar com o TMS'
                    : fl.length
                      ? motivo + (fl.length > 1 ? ' e mais ' + (fl.length - 1) : '')
                      : x.dec.porAutoridade
                        ? 'regra liberada: ' + ((x.dec.checagens.find((c) => c.liberadaPor) || {}).nome || '')
                        : alertas.length
                          ? 'Alerta: ' + alertas.map((c) => c.motivo).join(', ')
                          : '';
              const id = v.id;
              return {
                id,
                href: '/viagem?id=' + id,
                data: F.curta(v.data) + ' ' + v.janela,
                filial: TX.filial(v.filial).nome,
                ordem: v.ordem,
                cte: v.cte ? 'CT-e ' + v.cte.numero : '',
                produto: TX.produto(v.produto).nome,
                semGmp: !v.assegurada,
                rota:
                  TX.embarcador(v.embarcador).nome +
                  ' → ' +
                  TX.destinatario(v.destinatario).nome +
                  ', ' +
                  TX.destinatario(v.destinatario).cidade,
                transp: x.t ? TX.nomeTransportador(x.t) : 'Frota própria',
                transpSub: x.t
                  ? x.t.tipo === 'TAC'
                    ? 'TAC, RNTRC ' + (x.t.rntrc ? x.t.rntrc.numero : 'pendente')
                    : 'motorista ' + x.mot.nome
                  : 'motorista ' + x.mot.nome,
                placas: TX.placasDoConjunto(x.conj),
                res:
                  sit === 'concluida'
                    ? 'Concluída'
                    : sit === 'sem_cte'
                      ? 'Aguardando CT-e'
                      : sit === 'transito'
                        ? 'Em trânsito'
                        : x.dec.rotulo +
                          (sit === 'pronta' && alertas.length
                            ? alertas.length === 1
                              ? ', 1 alerta'
                              : ', ' + alertas.length + ' alertas'
                            : ''),
                tom,
                sub,
                on: !!sel[id],
                alternar: () => {
                  const n = Object.assign({}, sel);
                  if (n[id]) delete n[id];
                  else n[id] = true;
                  this.setState({ sel: n });
                },
              };
            }),
        vazio: !s.loading && lista.length === 0,
        vazioT: filtroAtivo || !vi.vazio ? 'Nenhuma viagem com estes filtros' : vi.vazio[0],
        vazioSub:
          filtroAtivo || !vi.vazio
            ? 'Amplie o período ou limpe os filtros. A busca aceita placa, CT-e, NF, ordem, nome e RNTRC.'
            : vi.vazio[1],
        exportarRot: 'Exportar ' + (lista.length === 1 ? '1 viagem' : lista.length + ' viagens'),
        exportar: () => this.exportarCsv(lista),
      },
      pg.vals,
    );
  }
  exportarCsv(lista) {
    const F = TX.fmt;
    const cab = [
      'Data',
      'Janela',
      'Filial',
      'Ordem',
      'Código interno',
      'CT-e',
      'NF',
      'Produto',
      'Peso (t)',
      'Embarcador',
      'Destinatário',
      'Transportador',
      'RNTRC',
      'Motorista',
      'Placas',
      'Assegurada GMP+',
      'Resultado',
      'Termo assinado',
      'Verificação aprovada',
    ];
    const lin = lista.map((x) => {
      const v = x.v;
      return [
        F.data(v.data),
        v.janela,
        TX.filial(v.filial).nome,
        v.ordem,
        v.id,
        v.cte ? v.cte.numero : '',
        v.cte ? v.cte.nf : '',
        TX.produto(v.produto).nome,
        v.peso,
        TX.embarcador(v.embarcador).nome,
        TX.destinatario(v.destinatario).nome,
        TX.nomeTransportador(x.t),
        x.t && x.t.rntrc ? x.t.rntrc.numero : '',
        x.mot.nome,
        TX.placasDoConjunto(x.conj).join(' '),
        v.assegurada ? 'sim' : 'não',
        x.dec.rotulo,
        v.termo ? F.data(v.termo.em.slice(0, 10)) : '',
        v.verificacao && v.verificacao.estado === 'aprovada' ? F.data(v.verificacao.em.slice(0, 10)) : '',
      ];
    });
    const csv =
      '﻿' +
      [cab]
        .concat(lin)
        .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(';'))
        .join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'viagens-' + TX.HOJE + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.avisar(lista.length + ' viagens exportadas em planilha (CSV), com os filtros da tela.');
  }
  concVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const aberta = s.modal === 'conciliar';
    const lote = s.lote;
    const casadas = lote ? lote.linhas.filter((l) => l.casou) : [];
    return {
      concAberta: aberta,
      fecharModal: () => this.setState({ modal: null, lote: null }),
      pararClique: (e) => e.stopPropagation(),
      abrirConciliar: () => this.setState({ modal: 'conciliar', lote: null }),
      arqOk: !!lote,
      arqTitulo: lote ? 'Arquivo: ' + lote.arquivo : 'Escolher arquivo do TMS',
      arqErro: s.arqErro,
      onArquivo: (e) => {
        const f = e.target.files && e.target.files[0];
        const erro = TX.ui.conferirArquivo(f, ['.xml', '.csv', '.xlsx', '.zip'], 'planilha nem XML de CT-e');
        e.target.value = '';
        this.setState({ arqErro: erro });
        if (f && !erro) {
          const l = TX.loteCTe();
          l.arquivo = f.name;
          this.setState({ lote: l });
        }
      },
      usarExemplo: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ lote: TX.loteCTe() });
      },
      temLote: !!lote,
      // M10: a situação da viagem no carregamento aparece ao lado do CT-e; o que não estava pronto se destaca.
      lote: lote
        ? lote.linhas.map((l) => {
            const vg = l.casou ? TX.viagem(l.viagem) : null;
            const dec = vg ? TX.decidir(vg) : null;
            const pronta = !!dec && dec.resultado === 'pronta';
            return {
              k: l.cte,
              cte: l.cte,
              nf: l.nf,
              placa: l.placa,
              data: F.curta(l.data),
              casou: !!l.casou,
              viagem: vg ? vg.ordem + ', ' + TX.pessoa(vg.motorista).nome : 'sem correspondência: ' + l.motivo.toLowerCase(),
              sitTom: dec ? (dec.porAutoridade && pronta ? 'autoridade' : U.tomResultado(dec).k) : 'na',
              sitRot: dec ? dec.rotulo : 'fica fora',
              alerta: !!dec && !pronta && dec.resultado !== 'nao_assegurada',
            };
          })
        : [],
      loteAlertas: lote
        ? casadas.filter((l) => {
            const d = TX.decidir(TX.viagem(l.viagem));
            return d.resultado !== 'pronta' && d.resultado !== 'nao_assegurada';
          }).length
        : 0,
      loteResumo: lote
        ? casadas.length +
          ' CT-e casados com viagens; ' +
          (lote.linhas.length - casadas.length) +
          ' sem correspondência ficam fora. Nada é digitado viagem a viagem.'
        : '',
      concRot: casadas.length ? 'Conciliar ' + casadas.length + ' viagens' : 'Conciliar',
      confirmarConciliar: () => {
        if (!casadas.length) {
          const el = document.querySelector('[data-tx-modal="conciliar"] input[type="file"]');
          if (el) el.focus();
          return;
        }
        TX.fazer('conciliarCTe', { arquivo: lote.arquivo, linhas: casadas });
        this.setState({ modal: null, lote: null });
        this.avisar(casadas.length + ' viagens conciliadas. As de descarga passada já aparecem como concluídas.');
      },
      ctaOk: casadas.length > 0,
      podeConciliar: pode('conciliarCTe'),
    };
  }

  // Botão de filtro com menu: mostra o valor escolhido e fica marcado quando sai do padrão.
  filtroMenu({ k, rotulo, valor, mudou, aberto, abrir, itens, attr }) {
    return (
      <div data-tx-pop="" className="tx-viagens-pop">
        <button
          type="button"
          onClick={abrir}
          data-tx-dd={k}
          aria-expanded={aberto}
          aria-haspopup="menu"
          className={'tx-viagens-filtro' + (mudou ? ' tx-viagens-filtro--on' : '')}
        >
          <span className="tx-viagens-filtro__rot">{rotulo}</span>
          <span className="tx-viagens-filtro__val">{valor}</span>
          {Chevron}
        </button>
        {aberto ? (
          <div role="menu" aria-label={rotulo} className="tx-viagens-menu">
            {itens.map((it) => (
              <button
                key={it.k}
                type="button"
                role="menuitemradio"
                aria-checked={it.on}
                onClick={it.onClick}
                className="tx-viagens-menu__op"
                {...{ [attr]: it.k }}
              >
                {it.n}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  cabCol(v, c, rot) {
    const o = v.colOrdem(c);
    return (
      <span role="columnheader" aria-sort={o}>
        <button type="button" onClick={v.ordenar(c)} className="tx-viagens-ordenar" data-tx-ordenar={c}>
          {rot}
          <span className="tx-viagens-ordenar__seta" aria-hidden>
            {o === 'ascending' ? '↑' : o === 'descending' ? '↓' : '↕'}
          </span>
        </button>
      </span>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Viagens" data-tela="Viagens">
        <div className="tx-pagina tx-viagens">
          <CabecalhoPagina
            titulo={
              <span className="tx-viagens-titulo">
                Viagens <span className="tx-viagens-titulo__q num">{v.contagem}</span>
              </span>
            }
            acoes={
              <>
                <EntradaCaixa
                  className="tx-viagens-busca"
                  icone={IconeBusca}
                  aria-label="Buscar placa, CT-e, NF, ordem, motorista ou RNTRC"
                  value={v.busca ?? ''}
                  onChange={v.onBusca}
                  data-tx-busca=""
                  placeholder="Buscar placa, CT-e, NF, ordem..."
                />
                <Botao
                  variante="contorno"
                  icone={IconeBaixar}
                  onClick={v.exportar}
                  data-tx-exportar=""
                  title="Baixa a lista com os filtros da tela, em CSV"
                >
                  {v.exportarRot}
                </Botao>
                {(!TX.pode || TX.pode('criarViagem')) && (
                  <Botao variante="primario" href="/hoje?nova=1" data-tx-viagens-nova="">
                    Nova viagem
                  </Botao>
                )}
              </>
            }
          />
          <div className="tx-viagens-folha">
            <Abas
              rotulo="Visões de viagens"
              className="tx-viagens-abas"
              itens={v.abas.map((ab) => ({
                k: ab.k,
                n: <span data-tx-visao={ab.k}>{ab.n}</span>,
                q: ab.q,
                ativa: ab.on,
                onClick: ab.onClick,
                depois: ab.usuario ? (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={'Apagar a visão ' + ab.n}
                    title="Apagar esta visão"
                    data-tx-apagar-visao={ab.k}
                    className="tx-viagens-apagar"
                    onClick={(e) => {
                      e.stopPropagation();
                      ab.remover();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        ab.remover();
                      }
                    }}
                  >
                    ×
                  </span>
                ) : null,
              }))}
            />
            {v.apagadaNome ? (
              <div className="tx-viagens-desfazer" role="status">
                Visão "{v.apagadaNome}" apagada.
                <Botao variante="texto" onClick={v.desfazerApagar} data-tx-desfazer="">
                  Desfazer
                </Botao>
              </div>
            ) : null}
            <div className="tx-viagens-barra">
              {this.filtroMenu({
                k: 'periodo',
                rotulo: 'Período',
                valor: v.perRot,
                mudou: v.perMudou,
                aberto: v.popPeriodo,
                abrir: v.abrirPeriodo,
                itens: v.periodos,
                attr: 'data-tx-periodo',
              })}
              {v.temFiliais
                ? this.filtroMenu({
                    k: 'filtros',
                    rotulo: 'Filial',
                    valor: v.filialRot,
                    mudou: v.filialMudou,
                    aberto: v.popFilial,
                    abrir: v.abrirFilial,
                    itens: v.filiais,
                    attr: 'data-tx-filial-chip',
                  })
                : null}
              {this.filtroMenu({
                k: 'tipo',
                rotulo: 'Tipo',
                valor: v.tipoRot,
                mudou: v.tipoMudou,
                aberto: v.popTipo,
                abrir: v.abrirTipo,
                itens: v.tipos,
                attr: 'data-tx-tipo',
              })}
              {v.filtroAtivo ? (
                <div className="tx-viagens-barra__fim">
                  <Botao variante="texto" onClick={v.limpar} data-tx-limpar="">
                    Limpar filtros
                  </Botao>
                  <div data-tx-pop="" className="tx-viagens-pop">
                    <Botao variante="contorno" tamanho="p" onClick={v.abrirSalvar} data-tx-salvar-visao="" aria-expanded={v.popSalvar}>
                      Salvar como visão
                    </Botao>
                    {v.popSalvar ? (
                      <div className="tx-viagens-menu tx-viagens-menu--salvar" role="dialog" aria-label="Salvar como visão">
                        <div className="tx-tipo-corpo tx-peso-800">Salvar como visão</div>
                        <div className="tx-tipo-legenda tx-peso-400 tx-sec" style={{ marginTop: 'var(--esp-0-5)' }}>
                          Vira uma aba acima da lista, com estes filtros. Fica salva neste navegador.
                        </div>
                        <input
                          aria-label="Nome da visão"
                          className="tx-entrada"
                          value={v.nomeVisao ?? ''}
                          onChange={v.onNomeVisao}
                          onKeyDown={v.teclaVisao}
                          data-tx-nome-visao=""
                          placeholder="Nome da visão"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--esp-2-5)' }}>
                          <Botao variante="primario" tamanho="p" inativo={!v.visOk} onClick={v.confirmarVisao} data-tx-confirmar-visao="">
                            Salvar
                          </Botao>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            {v.temSituacao ? (
              <div className="tx-viagens-chips">
                <span className="tx-viagens-chips__rot" id="tx-viagens-sit" data-tx-dd="situacao">
                  Situação
                </span>
                <div role="group" aria-labelledby="tx-viagens-sit" className="tx-viagens-chips__lista">
                  {v.situacoes.map((st) => (
                    <Chip key={st.k} tipo="filtro" selecionado={st.on} onClick={st.onClick} data-tx-situacao={st.k}>
                      {st.k !== 'todas' ? (
                        <span className={'tx-situacao tx-situacao--' + st.tom}>
                          <span className="tx-situacao__ponto" aria-hidden />
                        </span>
                      ) : null}
                      {st.n}
                      <span className="tx-viagens-chips__q num">{st.q}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}
            {v.temDica ? (
              <div className="tx-viagens-dica">
                <Aviso
                  tom="info"
                  acao={
                    v.temDicaAcao ? (
                      <Botao variante="primario" tamanho="p" onClick={v.dicaAcao} data-tx-conciliar="">
                        {v.dicaAcaoRot}
                      </Botao>
                    ) : v.temDicaLink ? (
                      <Botao variante="texto" href={v.dicaHref}>
                        {v.dicaLinkRot}
                      </Botao>
                    ) : null
                  }
                >
                  {v.dica}
                </Aviso>
              </div>
            ) : null}
            {v.selQ ? (
              <div className="tx-viagens-selecao" role="region" aria-label="Seleção">
                <span className="tx-peso-700">
                  <span className="num">{v.selQ}</span> {v.selQ === 1 ? 'selecionada' : 'selecionadas'}
                </span>
                <Botao variante="contorno" tamanho="p" icone={IconeBaixar} onClick={v.exportarSel} data-tx-exportar-sel="">
                  Exportar selecionadas
                </Botao>
                <Botao variante="texto" onClick={v.limparSel}>
                  Limpar seleção
                </Botao>
              </div>
            ) : null}
            <div role="table" aria-label="Viagens" aria-rowcount={v.linhas.length} className="tx-viagens-tabela">
              <div role="row" className="tx-viagens-linha tx-viagens-cab">
                <span role="columnheader" className="tx-viagens-sel">
                  <Checkbox
                    rotulo={<span className="tx-so-leitor">Selecionar as viagens desta página</span>}
                    checked={v.todasPagina}
                    ref={(el) => {
                      if (el) el.indeterminate = v.algumaPagina && !v.todasPagina;
                    }}
                    onChange={v.alternarPagina}
                  />
                </span>
                {this.cabCol(v, 'carga', 'Carregamento')}
                {this.cabCol(v, 'ordem', 'Ordem')}
                <span role="columnheader">Produto e rota</span>
                {this.cabCol(v, 'transp', 'Transportador')}
                <span role="columnheader">Placas</span>
                {this.cabCol(v, 'sit', 'Situação')}
              </div>
              {v.loading ? <TabelaEsqueleto linhas={6} /> : null}
              {v.linhas.map((r) => (
                <div key={r.id} role="row" className="tx-viagens-linha" aria-selected={r.on || undefined}>
                  <span role="cell" className="tx-viagens-sel">
                    <Checkbox rotulo={<span className="tx-so-leitor">Selecionar a {r.ordem}</span>} checked={r.on} onChange={r.alternar} />
                  </span>
                  <span role="cell">
                    <span className="tx-viagens-mono tx-peso-600" style={{ display: 'block' }}>
                      {r.data}
                    </span>
                    <span className="tx-viagens-sub">{r.filial}</span>
                  </span>
                  <span role="cell" style={{ minWidth: '0' }}>
                    <A href={r.href} data-tx-linha={r.id} className="tx-viagens-abrir">
                      {r.ordem}
                    </A>
                    <span className="tx-viagens-sub tx-viagens-mono">{r.cte}</span>
                  </span>
                  <span role="cell" className="tx-viagens-rota">
                    <span className="tx-viagens-forte">
                      {r.produto}
                      {r.semGmp ? <span className="tx-viagens-semgmp"> sem GMP+</span> : null}
                    </span>
                    <span className="tx-viagens-sub tx-viagens-corta">{r.rota}</span>
                  </span>
                  <span role="cell" style={{ minWidth: '0' }}>
                    <span className="tx-viagens-forte tx-viagens-corta">{r.transp}</span>
                    <span className="tx-viagens-sub tx-viagens-corta">{r.transpSub}</span>
                  </span>
                  <span role="cell" className="tx-viagens-placas">
                    {r.placas.map((pl) => (
                      <span key={pl} className="tx-viagens-placa">
                        {pl}
                      </span>
                    ))}
                  </span>
                  <span role="cell" style={{ minWidth: '0' }}>
                    <Situacao tom={r.tom}>{r.res}</Situacao>
                    {r.sub ? (
                      <span className="tx-viagens-motivo" title={r.sub}>
                        {r.sub}
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}
              {v.vazio ? (
                <EstadoVazio
                  titulo={v.vazioT}
                  acao={
                    v.filtroAtivo ? (
                      <Botao tamanho="p" onClick={v.limpar}>
                        Limpar filtros
                      </Botao>
                    ) : null
                  }
                >
                  {v.vazioSub}
                </EstadoVazio>
              ) : null}
              <div className="tx-viagens-rodape">
                <Paginacao pagina={v.pagina} total={v.total} info={v.pagInfo} aoIr={v.irPara} />
              </div>
            </div>
          </div>
        </div>
        {v.concAberta ? (
          <Modal
            id="conciliar"
            data-tx-modal="conciliar"
            tamanho="xg"
            titulo="Conciliar CT-e e NF em lote"
            sub="Importe a planilha ou os XML de CT-e do período exportados do TMS. O Traxium casa cada CT-e com a viagem pela placa do cavalo e pela data. Viagem conciliada com descarga passada se conclui sozinha."
            aoFechar={v.fecharModal}
            falta={v.temLote ? '' : 'Falta: o arquivo do TMS.'}
            acoes={
              <>
                <Botao onClick={v.fecharModal}>Cancelar</Botao>
                {v.podeConciliar ? (
                  <Botao variante="primario" inativo={!v.ctaOk} onClick={v.confirmarConciliar} data-tx-confirmar="">
                    {v.concRot}
                  </Botao>
                ) : null}
              </>
            }
          >
            <div>
              <label className={'tx-viagens-arquivo' + (v.arqOk ? ' tx-viagens-arquivo--ok' : '')}>
                <input type="file" accept=".xml,.csv,.xlsx,.zip" onChange={v.onArquivo} className="tx-so-leitor" />
                <span style={{ flex: '1', minWidth: '0' }}>
                  <span className="tx-tipo-corpo tx-peso-800" style={{ display: 'block' }}>
                    {v.arqTitulo}
                  </span>
                  <span className="tx-tipo-legenda tx-peso-400 tx-sec" style={{ display: 'block' }}>
                    planilha (.xlsx, .csv) ou XML de CT-e (.xml, .zip)
                  </span>
                </span>
                <Botao variante="texto" onClick={v.usarExemplo} data-tx-lote-exemplo="" className="tx-acao-texto">
                  Usar o lote de exemplo
                </Botao>
              </label>
              {v.arqErro ? (
                <div className="tx-erro" role="alert" data-tx-arquivo-erro="">
                  {v.arqErro}
                </div>
              ) : null}
            </div>
            {v.temLote ? (
              <>
                <div role="table" aria-label="CT-e do lote" className="tx-viagens-lote">
                  <div role="row" className="tx-viagens-lote__linha tx-viagens-lote__cab">
                    <span role="columnheader">CT-e</span>
                    <span role="columnheader">NF</span>
                    <span role="columnheader">Placa</span>
                    <span role="columnheader">Data</span>
                    <span role="columnheader">Viagem</span>
                    <span role="columnheader">Ao carregar</span>
                  </div>
                  {v.lote.map((lt) => (
                    <div key={lt.k} role="row" className={'tx-viagens-lote__linha' + (lt.alerta ? ' tx-viagens-lote__linha--alerta' : '')}>
                      <span role="cell" className="tx-mono">
                        {lt.cte}
                      </span>
                      <span role="cell" className="tx-mono">
                        {lt.nf}
                      </span>
                      <span role="cell" className="tx-mono">
                        {lt.placa}
                      </span>
                      <span role="cell" className="tx-mono">
                        {lt.data}
                      </span>
                      <span role="cell" className={lt.casou ? 'tx-peso-700' : 'tx-viagens-lote__sem'}>
                        {lt.viagem}
                      </span>
                      <span role="cell">
                        {lt.casou ? <Situacao tom={lt.sitTom}>{lt.sitRot}</Situacao> : <span className="tx-apagado">fica fora</span>}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="tx-tipo-denso tx-sec">{v.loteResumo}</div>
                {v.loteAlertas ? (
                  <Aviso
                    tom="aviso"
                    titulo={
                      v.loteAlertas === 1
                        ? '1 viagem não estava pronta ao carregar.'
                        : v.loteAlertas + ' viagens não estavam prontas ao carregar.'
                    }
                  >
                    Confira se o DACTE saiu sem a declaração GMP+. Elas aparecem destacadas na lista.
                  </Aviso>
                ) : null}
              </>
            ) : null}
          </Modal>
        ) : null}
      </div>
    );
  }
}
