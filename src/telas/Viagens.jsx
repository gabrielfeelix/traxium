// Gerado de "SaaS moderno estilo Dribbble/Viagens v2.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

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
    this.setState(ini);
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
        cor: '#d97544',
        f: (x) => this.sitDe(x) === 'sem_cte',
        dica: 'Viagens já carregadas que ainda não têm CT-e. Importe o arquivo do TMS e o Traxium casa cada CT-e com a viagem pela placa e pela data.',
        acao: 'Conciliar CT-e em lote',
        vazio: ['Nenhuma viagem esperando CT-e', 'Toda viagem carregada já está conciliada com o TMS.'],
      },
      {
        k: 'autoridade',
        n: 'Liberadas por autoridade',
        periodo: '90',
        cor: '#b85a2e',
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
    const limpo = { busca: '', tipo: 'todos', filial: null, sit: 'todas', pag: 1, popAberto: null };
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
      ['todas', 'Todas', U.tom('na')],
      ['falta', 'Falta algo', U.tom('falta')],
      ['bloqueada', 'Bloqueadas', U.tom('bloqueio')],
      ['tecnico', 'Bloqueio técnico', U.tom('tecnico')],
      ['pronta', 'Prontas', U.tom('ok')],
      ['transito', 'Em trânsito', U.tom('info')],
      ['concluida', 'Concluídas', U.tom('ok')],
      ['cancelada', 'Canceladas', U.tom('na')],
    ];
    const lista = base
      .filter((x) => s.sit === 'todas' || this.sitDe(x) === s.sit)
      .sort((a, b) => (b.v.data + b.v.janela).localeCompare(a.v.data + a.v.janela));
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
    const sitAtual = SIT.find((x) => x[0] === s.sit) || SIT[0];
    const ativos = [];
    if (s.tipo !== 'todos') ativos.push({ n: TIPOS.find((x) => x[0] === s.tipo)[1], onClick: () => set({ tipo: 'todos' }) });
    if (s.filial) ativos.push({ n: 'Filial ' + TX.filial(s.filial).nome, onClick: () => set({ filial: null }) });
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
    const tm = vi.cor || 'var(--primario)';
    const escopoTxt = s.filial
      ? 'filial ' + TX.filial(s.filial).nome
      : u.filiais.length > 1
        ? 'todas as filiais'
        : 'filial ' + TX.filial(u.filiais[0]).nome;
    return Object.assign(
      {
        subtitulo: 'Toda viagem com a situação e o histórico, ' + escopoTxt,
        abas: VIS.map((x) => {
          const on = x.k === vi.k;
          const q = x.conta ? todasEnr.filter(typeof x.conta === 'function' ? x.conta : x.f).length : 0;
          return {
            k: x.k,
            n: x.n,
            fw: on ? '800' : '600',
            c: on ? 'var(--texto)' : 'var(--texto-sec)',
            bd: on ? 'var(--primario)' : 'transparent',
            q,
            qD: x.conta && q ? 'inline-block' : 'none',
            qC: 'var(--aviso)',
            qBd: 'var(--aviso-borda)',
            xD: x.usuario ? 'inline-flex' : 'none',
            onClick: () => this.setState(this.entrarVisao(x.k)),
            remover: (e) => {
              e.stopPropagation();
              U.gravarLS('tx-v2-visoes', JSON.stringify(this.visoesSalvas().filter((y) => y.k !== x.k)));
              this.setState(Object.assign(on ? this.entrarVisao('todas') : {}, { txv: Date.now() }));
              this.avisar('Visão "' + x.n + '" apagada.');
            },
          };
        }),
        busca: s.busca,
        onBusca: (e) => this.setState({ busca: e.target.value, pag: 1 }),
        perRot: (PER.find((x) => x[0] === s.periodo) || PER[2])[1].replace('Últimos ', ''),
        perBd: s.periodo !== perDef ? 'var(--primario)' : 'var(--borda-campo)',
        popPeriodo: s.popAberto === 'periodo',
        abrirPeriodo: pop('periodo'),
        periodos: PER.map(([k, n]) => ({
          k,
          n,
          fw: s.periodo === k ? '800' : '600',
          ckD: s.periodo === k ? 'block' : 'none',
          onClick: () => set({ periodo: k }),
        })),
        temSituacao: !vi.semSituacao,
        sitRot: sitAtual[1],
        sitDot: sitAtual[2].dot,
        sitDotD: s.sit === 'todas' ? 'none' : 'inline-block',
        sitBd: s.sit !== 'todas' ? 'var(--primario)' : 'var(--borda-campo)',
        popSituacao: s.popAberto === 'situacao',
        abrirSituacao: pop('situacao'),
        situacoes: SIT.map(([k, n, t]) => {
          const q = k === 'todas' ? base.length : base.filter((x) => this.sitDe(x) === k).length;
          return {
            k,
            n,
            q,
            dot: t.dot,
            fw: s.sit === k ? '800' : '600',
            cor: q || s.sit === k ? 'var(--texto)' : 'var(--texto-desab)',
            ckOp: s.sit === k ? '1' : '0',
            onClick: () => set({ sit: k }),
          };
        }),
        popFiltros: s.popAberto === 'filtros',
        abrirFiltros: pop('filtros'),
        filQ: ativos.length,
        filQD: ativos.length ? 'inline-flex' : 'none',
        filBd: ativos.length ? 'var(--primario)' : 'var(--borda-campo)',
        tipos: TIPOS.map(([k, n]) => ({
          k,
          n,
          fw: s.tipo === k ? '800' : '600',
          ckD: s.tipo === k ? 'block' : 'none',
          onClick: () => set({ tipo: k }),
        })),
        temFiliais: u.filiais.length > 1,
        filiais: [[null, 'Todas as filiais']]
          .concat(u.filiais.map((f) => [f, TX.filial(f).nome]))
          .map(([k, n]) => ({
            k: k || 'todas',
            n,
            fw: (s.filial || null) === k ? '800' : '600',
            ckD: (s.filial || null) === k ? 'block' : 'none',
            onClick: () => set({ filial: k }),
          })),
        ativos,
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
        visCta: U.cta(nomeOk),
        contagem: lista.length === 1 ? '1 viagem' : lista.length + ' viagens',
        temDica: !!vi.dica,
        dica: vi.dica || '',
        dicaCor: tm,
        temDicaAcao: !!vi.acao,
        dicaAcaoRot: vi.acao || '',
        dicaAcao: () => this.setState({ modal: 'conciliar', lote: null }),
        temDicaLink: !!vi.link,
        dicaLinkRot: vi.link ? vi.link[0] : '',
        dicaHref: vi.link ? vi.link[1] : '#',
        cols: '108px 150px minmax(0,1.4fr) minmax(0,1fr) 140px 190px',
        skel: [1, 2, 3, 4, 5, 6],
        linhas: s.loading
          ? []
          : pg.itens.map((x) => {
              const v = x.v;
              const sit = this.sitDe(x);
              const tom =
                sit === 'concluida'
                  ? U.tom('ok')
                  : sit === 'sem_cte'
                    ? U.tom('autoridade')
                    : sit === 'transito'
                      ? U.tom('info')
                      : U.tomResultado(x.dec);
              const fl = x.dec.falta;
              const sub = v.cancelada
                ? v.cancelada.motivo || 'cancelada'
                : sit === 'concluida' || sit === 'transito'
                  ? x.cic.sub
                  : sit === 'sem_cte'
                    ? 'conciliar com o TMS'
                    : fl.length
                      ? fl[0].o + (fl.length > 1 ? ' e mais ' + (fl.length - 1) : '')
                      : x.dec.porAutoridade
                        ? 'regra liberada: ' + ((x.dec.checagens.find((c) => c.liberadaPor) || {}).nome || '')
                        : '';
              return {
                id: v.id,
                href: '/viagem?id=' + v.id,
                data: F.curta(v.data) + ' ' + v.janela,
                filial: TX.filial(v.filial).nome,
                ordem: v.ordem,
                ordemSub: v.cte ? 'CT-e ' + v.cte.numero + ', NF ' + v.cte.nf : v.id,
                subC: v.cte ? 'var(--texto-2)' : 'var(--texto-desab)',
                produto: TX.produto(v.produto).nome,
                assegTxt: v.assegurada ? '' : '(sem GMP+)',
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
                placas: TX.placasDoConjunto(x.conj).join(' '),
                res:
                  sit === 'concluida'
                    ? 'Concluída'
                    : sit === 'sem_cte'
                      ? 'Aguardando CT-e'
                      : sit === 'transito'
                        ? 'Em trânsito'
                        : x.dec.rotulo,
                c: tom.c,
                dot: tom.dot,
                ring: tom.ring,
                sub,
              };
            }),
        vazio: !s.loading && lista.length === 0,
        vazioT: filtroAtivo || !vi.vazio ? 'Nenhuma viagem com estes filtros' : vi.vazio[0],
        vazioSub:
          filtroAtivo || !vi.vazio
            ? 'Amplie o período ou limpe os filtros. A busca aceita placa, CT-e, NF, ordem, nome e RNTRC.'
            : vi.vazio[1],
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
    const c = U.cta(casadas.length > 0);
    return {
      concAberta: aberta,
      fecharModal: () => this.setState({ modal: null, lote: null }),
      pararClique: (e) => e.stopPropagation(),
      abrirConciliar: () => this.setState({ modal: 'conciliar', lote: null }),
      arqBd: lote ? 'var(--primario)' : 'var(--borda-forte)',
      arqBg: lote ? 'var(--primario-fraco)' : '#fff',
      arqTitulo: lote ? 'Arquivo: ' + lote.arquivo : 'Escolher arquivo do TMS',
      onArquivo: (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) {
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
      lote: lote
        ? lote.linhas.map((l) => ({
            cte: l.cte,
            nf: l.nf,
            placa: l.placa,
            data: F.curta(l.data),
            viagem: l.casou
              ? TX.viagem(l.viagem).ordem + ', ' + TX.pessoa(TX.viagem(l.viagem).motorista).nome
              : 'sem correspondência: ' + l.motivo.toLowerCase(),
            c: l.casou ? 'var(--ok)' : 'var(--aviso)',
          }))
        : [],
      loteResumo: lote
        ? casadas.length +
          ' CT-e casados com viagens; ' +
          (lote.linhas.length - casadas.length) +
          ' sem correspondência ficam fora. Nada é digitado viagem a viagem.'
        : '',
      concRot: casadas.length ? 'Conciliar ' + casadas.length + ' viagens' : 'Conciliar',
      confirmarConciliar: () => {
        if (!casadas.length) return;
        TX.fazer('conciliarCTe', { arquivo: lote.arquivo, linhas: casadas });
        this.setState({ modal: null, lote: null });
        this.avisar(casadas.length + ' viagens conciliadas. As de descarga passada já aparecem como concluídas.');
      },
      ctaBg: c.bg,
      ctaC: c.c,
      ctaSh: c.sh,
      ctaCur: c.cur,
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Viagens" data-tela="Viagens">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>Viagens</div>
              <div style={{ fontSize: '13.5px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.subtitulo}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={v.exportar}
                data-tx-exportar=""
                title="Baixa a lista com os filtros da tela"
                style={{
                  background: 'var(--painel)',
                  border: '1px solid var(--borda-campo)',
                  borderRadius: '11px',
                  padding: '9px 15px',
                  fontSize: '13.5px',
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
                  <path d="M8 2.5v8"></path>
                  <path d="M4.8 7.5 8 10.7l3.2-3.2"></path>
                  <path d="M3 13.2h10"></path>
                </svg>
                Exportar planilha
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px' }}>
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
                    onClick={ab?.onClick}
                    data-tx-visao={ab?.k}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '15px 12px 12px',
                      fontSize: '13.5px',
                      fontWeight: ab?.fw,
                      color: ab?.c,
                      borderBottom: `2.5px solid ${ab?.bd ?? ''}`,
                      marginBottom: '-1px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    className="tx-hec6a165"
                  >
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
                    <span
                      onClick={ab?.remover}
                      data-tx-apagar-visao={ab?.k}
                      title="Apagar esta visão"
                      style={{
                        display: ab?.xD,
                        width: '18px',
                        height: '18px',
                        borderRadius: '99px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'var(--texto-desab)',
                      }}
                      className="tx-ha5daa28"
                    >
                      ×
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', flexWrap: 'wrap' }}>
              <div
                style={{
                  background: 'var(--superficie)',
                  border: '1px solid var(--borda-campo)',
                  borderRadius: '11px',
                  padding: '0 13px',
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
                  value={v.busca ?? ''}
                  onChange={v.onBusca}
                  data-tx-busca=""
                  placeholder="Filtrar a lista: placa, CT-e, NF, ordem ou motorista"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13.5px', flex: '1', minWidth: '0' }}
                />
              </div>
              <div data-tx-pop="" style={{ position: 'relative' }}>
                <div
                  onClick={v.abrirPeriodo}
                  data-tx-dd="periodo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '38px',
                    padding: '0 12px 0 13px',
                    borderRadius: '11px',
                    border: `1px solid ${v.perBd ?? ''}`,
                    background: 'var(--painel)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  className="tx-h30bbaa9"
                >
                  <span style={{ color: 'var(--texto-apagado)', fontWeight: '600' }}>Período</span>
                  <span style={{ fontWeight: '700' }}>{v.perRot}</span>
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
                {v.popPeriodo ? (
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
                        minWidth: '210px',
                        zIndex: '60',
                      }}
                    >
                      {(Array.isArray(v.periodos) ? v.periodos : []).map((pd, $index) => (
                        <Fragment key={$index}>
                          <div
                            onClick={pd?.onClick}
                            data-tx-periodo={pd?.k}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 11px',
                              borderRadius: '9px',
                              fontSize: '13px',
                              fontWeight: pd?.fw,
                              cursor: 'pointer',
                            }}
                            className="tx-h894fca3"
                          >
                            {pd?.n}
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="#127670"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginLeft: 'auto', display: pd?.ckD }}
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
              {v.temSituacao ? (
                <>
                  <div data-tx-pop="" style={{ position: 'relative' }}>
                    <div
                      onClick={v.abrirSituacao}
                      data-tx-dd="situacao"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        height: '38px',
                        padding: '0 12px 0 13px',
                        borderRadius: '11px',
                        border: `1px solid ${v.sitBd ?? ''}`,
                        background: 'var(--painel)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                      className="tx-h30bbaa9"
                    >
                      <span style={{ color: 'var(--texto-apagado)', fontWeight: '600' }}>Situação</span>
                      <span style={{ display: v.sitDotD, width: '7px', height: '7px', borderRadius: '99px', background: v.sitDot }}></span>
                      <span style={{ fontWeight: '700' }}>{v.sitRot}</span>
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
                    {v.popSituacao ? (
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
                            minWidth: '230px',
                            zIndex: '60',
                          }}
                        >
                          {(Array.isArray(v.situacoes) ? v.situacoes : []).map((st, $index) => (
                            <Fragment key={$index}>
                              <div
                                onClick={st?.onClick}
                                data-tx-situacao={st?.k}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 11px',
                                  borderRadius: '9px',
                                  fontSize: '13px',
                                  fontWeight: st?.fw,
                                  color: st?.cor,
                                  cursor: 'pointer',
                                }}
                                className="tx-h894fca3"
                              >
                                <span
                                  style={{ width: '8px', height: '8px', borderRadius: '99px', background: st?.dot, flex: 'none' }}
                                ></span>
                                {st?.n}
                                <span
                                  style={{
                                    marginLeft: 'auto',
                                    fontFamily: "'Spline Sans Mono',monospace",
                                    fontSize: '11.5px',
                                    color: 'var(--texto-apagado)',
                                  }}
                                >
                                  {st?.q}
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
                                  style={{ flex: 'none', opacity: st?.ckOp }}
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
                </>
              ) : null}
              <div data-tx-pop="" style={{ position: 'relative' }}>
                <div
                  onClick={v.abrirFiltros}
                  data-tx-dd="filtros"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '38px',
                    padding: '0 13px',
                    borderRadius: '11px',
                    border: `1px solid ${v.filBd ?? ''}`,
                    background: 'var(--painel)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  className="tx-h30bbaa9"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="2.5" y1="4.5" x2="13.5" y2="4.5"></line>
                    <line x1="4.5" y1="8" x2="11.5" y2="8"></line>
                    <line x1="6.5" y1="11.5" x2="9.5" y2="11.5"></line>
                  </svg>
                  Filtros
                  <span
                    style={{
                      display: v.filQD,
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '6px',
                      background: 'var(--primario)',
                      color: '#fff',
                      fontSize: '10.5px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                    }}
                  >
                    {v.filQ}
                  </span>
                </div>
                {v.popFiltros ? (
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
                        width: '250px',
                        zIndex: '60',
                      }}
                    >
                      <div
                        style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '.8px', color: 'var(--texto-apagado)', padding: '8px 11px 4px' }}
                      >
                        TIPO
                      </div>
                      {(Array.isArray(v.tipos) ? v.tipos : []).map((tp, $index) => (
                        <Fragment key={$index}>
                          <div
                            onClick={tp?.onClick}
                            data-tx-tipo={tp?.k}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 11px',
                              borderRadius: '9px',
                              fontSize: '13px',
                              fontWeight: tp?.fw,
                              cursor: 'pointer',
                            }}
                            className="tx-h894fca3"
                          >
                            {tp?.n}
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="#127670"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ marginLeft: 'auto', display: tp?.ckD }}
                            >
                              <path d="M3.5 8.5 6.5 11.5 12.5 4.5"></path>
                            </svg>
                          </div>
                        </Fragment>
                      ))}
                      {v.temFiliais ? (
                        <>
                          <div
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '800',
                              letterSpacing: '.8px',
                              color: 'var(--texto-apagado)',
                              padding: '10px 11px 4px',
                              marginTop: '4px',
                              borderTop: '1px solid var(--superficie-2)',
                            }}
                          >
                            FILIAL
                          </div>
                          {(Array.isArray(v.filiais) ? v.filiais : []).map((fl, $index) => (
                            <Fragment key={$index}>
                              <div
                                onClick={fl?.onClick}
                                data-tx-filial-chip={fl?.k}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 11px',
                                  borderRadius: '9px',
                                  fontSize: '13px',
                                  fontWeight: fl?.fw,
                                  cursor: 'pointer',
                                }}
                                className="tx-h894fca3"
                              >
                                {fl?.n}
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="#127670"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ marginLeft: 'auto', display: fl?.ckD }}
                                >
                                  <path d="M3.5 8.5 6.5 11.5 12.5 4.5"></path>
                                </svg>
                              </div>
                            </Fragment>
                          ))}
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
              {(Array.isArray(v.ativos) ? v.ativos : []).map((at, $index) => (
                <Fragment key={$index}>
                  <span
                    onClick={at?.onClick}
                    title="Tirar este filtro"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--primario-2)',
                      border: '1px solid #cfe3e1',
                      borderRadius: '8px',
                      padding: '5px 9px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    className="tx-h30bbaa9"
                  >
                    {at?.n}
                    <span style={{ color: 'var(--texto-apagado)' }}>×</span>
                  </span>
                </Fragment>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
                {v.filtroAtivo ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        onClick={v.limpar}
                        data-tx-limpar=""
                        style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--texto-sec)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        className="tx-h39963fb"
                      >
                        Limpar
                      </span>
                      <div data-tx-pop="" style={{ position: 'relative' }}>
                        {' '}
                        <span
                          onClick={v.abrirSalvar}
                          data-tx-salvar-visao=""
                          style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                          className="tx-h76d8d79"
                        >
                          Salvar como visão
                        </span>{' '}
                        {v.popSalvar ? (
                          <>
                            <div
                              style={{
                                position: 'absolute',
                                right: '0',
                                top: '30px',
                                background: 'var(--painel)',
                                border: '1px solid var(--borda)',
                                borderRadius: '14px',
                                boxShadow: '0 16px 40px rgba(9,61,68,.16)',
                                padding: '14px',
                                width: '300px',
                                zIndex: '60',
                              }}
                            >
                              <div style={{ fontSize: '13.5px', fontWeight: '800' }}>Salvar como visão</div>
                              <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '2px', lineHeight: '1.5' }}>
                                Vira uma aba acima da lista, com estes filtros. Fica salva neste navegador.
                              </div>
                              <input
                                value={v.nomeVisao ?? ''}
                                onChange={v.onNomeVisao}
                                onKeyDown={v.teclaVisao}
                                data-tx-nome-visao=""
                                placeholder="Nome da visão"
                                style={{
                                  marginTop: '10px',
                                  width: '100%',
                                  border: '1px solid var(--borda-campo)',
                                  borderRadius: '10px',
                                  padding: '9px 11px',
                                  fontSize: '13px',
                                  outline: 'none',
                                }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <span
                                  onClick={v.confirmarVisao}
                                  data-tx-confirmar-visao=""
                                  style={{
                                    background: v.visCta?.bg,
                                    color: v.visCta?.c,
                                    boxShadow: v.visCta?.sh,
                                    cursor: v.visCta?.cur,
                                    fontSize: '13px',
                                    fontWeight: '800',
                                    borderRadius: '99px',
                                    padding: '8px 18px',
                                  }}
                                >
                                  Salvar
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </>
                ) : null}
                <span style={{ fontSize: '12.5px', color: 'var(--texto-apagado)', whiteSpace: 'nowrap', fontFamily: "'Spline Sans Mono',monospace" }}>
                  {v.contagem}
                </span>
              </div>
            </div>
            {v.temDica ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '0 20px 14px',
                    padding: '11px 14px',
                    borderRadius: '13px',
                    border: '1px solid var(--borda)',
                    borderLeft: `3px solid ${v.dicaCor ?? ''}`,
                  }}
                >
                  <div style={{ fontSize: '12.5px', color: 'var(--texto-2)', lineHeight: '1.5', flex: '1' }}>{v.dica}</div>
                  {v.temDicaAcao ? (
                    <>
                      <span
                        onClick={v.dicaAcao}
                        data-tx-conciliar=""
                        style={{
                          background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                          color: '#fff',
                          borderRadius: '99px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 6px 14px rgba(18,118,112,.25)',
                        }}
                        className="tx-h0882f37"
                      >
                        {v.dicaAcaoRot}
                      </span>
                    </>
                  ) : null}
                  {v.temDicaLink ? (
                    <>
                      <A href={v.dicaHref} style={{ fontSize: '12.5px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                        {v.dicaLinkRot}
                        {' →'}
                      </A>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: v.cols,
                gap: '14px',
                padding: '11px 20px',
                background: 'var(--superficie)',
                borderTop: '1px solid var(--borda-suave)',
                borderBottom: '1px solid var(--borda-suave)',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '.7px',
                color: 'var(--texto-apagado)',
              }}
            >
              <span>CARREGAMENTO</span>
              <span>ORDEM E CT-E</span>
              <span>PRODUTO E ROTA</span>
              <span>TRANSPORTADOR</span>
              <span>PLACAS</span>
              <span>SITUAÇÃO</span>
            </div>
            {v.loading ? (
              <>
                {(Array.isArray(v.skel) ? v.skel : []).map((sk, $index) => (
                  <Fragment key={$index}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--superficie-2)' }}>
                      <div
                        style={{
                          height: '16px',
                          borderRadius: '99px',
                          background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)',
                          backgroundSize: '600px 100%',
                          animation: 'txsh 1.3s linear infinite',
                        }}
                      ></div>
                    </div>
                  </Fragment>
                ))}
              </>
            ) : null}
            {(Array.isArray(v.linhas) ? v.linhas : []).map((r, $index) => (
              <Fragment key={$index}>
                {' '}
                <A
                  href={r?.href}
                  data-tx-linha={r?.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: v.cols,
                    gap: '14px',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--superficie-2)',
                    alignItems: 'center',
                    color: 'inherit',
                  }}
                  className="tx-hc05ca3a"
                >
                  <div>
                    <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>{r?.data}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--texto-apagado)' }}>{r?.filial}</div>
                  </div>
                  <div style={{ minWidth: '0' }}>
                    <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600' }}>{r?.ordem}</div>
                    <div
                      style={{
                        fontFamily: "'Spline Sans Mono',monospace",
                        fontSize: '11.5px',
                        color: r?.subC,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {r?.ordemSub}
                    </div>
                  </div>
                  <div style={{ minWidth: '0' }}>
                    <div
                      style={{ fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {r?.produto}
                      <span style={{ fontWeight: '600', color: 'var(--texto-apagado)', fontSize: '12px' }}> {r?.assegTxt}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-sec)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r?.rota}
                    </div>
                  </div>
                  <div style={{ minWidth: '0' }}>
                    <div
                      style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {r?.transp}
                    </div>
                    <div
                      style={{ fontSize: '11.5px', color: 'var(--texto-apagado)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {r?.transpSub}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px', color: 'var(--texto-2)', lineHeight: '1.5' }}>
                    {r?.placas}
                  </div>
                  <div style={{ minWidth: '0' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: r?.c,
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '99px',
                          background: r?.dot,
                          boxShadow: `0 0 0 3px ${r?.ring ?? ''}`,
                          flex: 'none',
                        }}
                      ></span>
                      {r?.res}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--texto-apagado)',
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {r?.sub}
                    </div>
                  </div>
                </A>{' '}
              </Fragment>
            ))}
            {v.vazio ? (
              <>
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>{v.vazioT}</div>
                  <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>{v.vazioSub}</div>
                </div>
              </>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--texto-sec)' }}>{v.pagInfo}</span>
              {v.temPaginacao ? (
                <>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <span
                      onClick={v.pagAnt}
                      style={{ fontSize: '13px', fontWeight: '700', color: v.pagAntC, cursor: v.pagAntCur, padding: '4px 8px' }}
                    >
                      ‹
                    </span>
                    {(Array.isArray(v.paginas) ? v.paginas : []).map((pg, $index) => (
                      <Fragment key={$index}>
                        <span
                          onClick={pg?.onClick}
                          style={{
                            fontFamily: "'Spline Sans Mono',monospace",
                            fontSize: '12.5px',
                            fontWeight: '600',
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
                    <span
                      onClick={v.pagProx}
                      style={{ fontSize: '13px', fontWeight: '700', color: v.pagProxC, cursor: v.pagProxCur, padding: '4px 8px' }}
                    >
                      ›
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {v.concAberta ? (
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
                onClick={v.pararClique}
                data-tx-modal="conciliar"
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: '760px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>Conciliar CT-e e NF em lote</div>
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
                <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.55' }}>
                  Importe a planilha ou os XML de CT-e do período exportados do TMS. O Traxium casa cada CT-e com a viagem pela placa do
                  cavalo e pela data. Viagem conciliada com descarga passada se conclui sozinha.
                </div>
                <label
                  style={{
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: `1.5px dashed ${v.arqBd ?? ''}`,
                    background: v.arqBg,
                    borderRadius: '15px',
                    padding: '13px 15px',
                    cursor: 'pointer',
                  }}
                >
                  <input type="file" accept=".xml,.csv,.xlsx,.zip" onChange={v.onArquivo} style={{ display: 'none' }} />
                  <div style={{ flex: '1' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '800' }}>{v.arqTitulo}</div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>planilha (.xlsx, .csv) ou XML de CT-e (.xml, .zip)</div>
                  </div>
                  <span onClick={v.usarExemplo} data-tx-lote-exemplo="" style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)' }}>
                    usar o lote de exemplo
                  </span>
                </label>
                {v.temLote ? (
                  <>
                    <div style={{ marginTop: '14px', border: '1px solid var(--borda-suave)', borderRadius: '14px', overflow: 'hidden' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 80px 100px 70px 1fr',
                          gap: '10px',
                          padding: '9px 14px',
                          background: 'var(--superficie)',
                          fontSize: '10.5px',
                          fontWeight: '800',
                          letterSpacing: '.7px',
                          color: 'var(--texto-apagado)',
                        }}
                      >
                        <span>CT-E</span>
                        <span>NF</span>
                        <span>PLACA</span>
                        <span>DATA</span>
                        <span>VIAGEM</span>
                      </div>
                      {(Array.isArray(v.lote) ? v.lote : []).map((lt, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '80px 80px 100px 70px 1fr',
                              gap: '10px',
                              padding: '9px 14px',
                              borderTop: '1px solid var(--superficie-2)',
                              fontSize: '12.5px',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace" }}>{lt?.cte}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace" }}>{lt?.nf}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace" }}>{lt?.placa}</span>
                            <span style={{ fontFamily: "'Spline Sans Mono',monospace" }}>{lt?.data}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: lt?.c, fontWeight: '700' }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: lt?.c }}></span>
                              {lt?.viagem}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--texto-2)', marginTop: '10px' }}>{v.loteResumo}</div>
                  </>
                ) : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <span
                    onClick={v.fecharModal}
                    style={{
                      background: 'var(--superficie-2)',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      borderRadius: '99px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </span>
                  <span
                    onClick={v.confirmarConciliar}
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
                    {v.concRot}
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
