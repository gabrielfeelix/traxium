// Gerado de "SaaS moderno estilo Dribbble/Auditoria.dc.html" por scripts/converter-dc.mjs.
'use client';
import { TX, Tela } from '@/lib/tx/tela';
import {
  Botao,
  Checkbox,
  CelulaSelecao,
  BarraSelecao,
  Chip,
  Situacao,
  Badge,
  Tabela,
  TabelaCabecalho,
  TabelaEsqueleto,
  TabelaRodape,
  Paginacao,
  Cartao,
  Linha,
  CabecalhoPagina,
  EstadoVazio,
  Drawer,
  EntradaCaixa,
  Entrada,
} from '@/components/ui';
import './Auditoria.css';

const LUPA = (
  <svg
    width="16"
    height="16"
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
const CALENDARIO = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
    <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
  </svg>
);

export default class Auditoria extends Tela {
  state = { loading: true, q: '', de: '2026-09-01', ate: '2026-10-08', tipo: 'todos', sel: [], simIni: null };
  componentDidMount() {
    TX.ui.montar(this);
    if (location.hash)
      setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView({ block: 'center' });
      }, 900);
    this._tick = setInterval(() => {
      if (this.state.simIni) this.setState({ tick: Date.now() });
    }, 1000);
    const q = TX.ui.param('q');
    if (q) this.setState({ q });
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  resultados() {
    const s = this.state,
      q = TX.norm(s.q),
      qd = TX.soDigitos(s.q);
    // Escopo de filial: só as filiais que o usuário vê (API nova do motor; sem ela, as da sessão).
    const vis = TX.filiaisVisiveis ? TX.filiaisVisiveis() : (TX.sessao() || {}).filiais || null;
    return TX.db.viagens
      .filter((v) => !vis || vis.includes(v.filial))
      .filter(
        (v) =>
          v.assegurada &&
          !v.cancelada &&
          v.data >= s.de &&
          v.data <= s.ate &&
          v.data <= TX.HOJE &&
          (s.tipo === 'todos' || (s.tipo === 'propria') === (v.tipo === 'propria')),
      )
      .filter((v) => {
        if (!q) return true;
        const pl = TX.norm(TX.placasDoConjunto(v.conjunto).join(' '));
        return (
          pl.includes(q) ||
          TX.norm(v.ordem).includes(q) ||
          (qd.length >= 4 && v.cte && (v.cte.numero.includes(qd) || v.cte.nf.includes(qd)))
        );
      })
      .sort((a, b) => b.data.localeCompare(a.data));
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      e = U.esc;
    const res = this.resultados();
    const pg = U.paginar(this, res, 'viagens');
    const sel = s.sel.filter((id) => res.some((v) => v.id === id));
    const elapsed = s.simIni ? Math.floor((Date.now() - s.simIni) / 1000) : 0;
    const pedido =
      (s.q ? (/\d{5,}/.test(s.q) ? 'Documento ' : 'Placa ') + s.q.toUpperCase() + ', ' : 'Todas as viagens, ') +
      F.data(s.de) +
      ' a ' +
      F.data(s.ate);
    const itemViagem = (v) => {
      const d = TX.decidir(v),
        t = TX.transportador(v.transportador),
        mot = TX.pessoa(v.motorista);
      return (
        '<h2>' +
        e(v.ordem) +
        ' (' +
        e(v.id) +
        '), ' +
        e(F.data(v.data)) +
        '</h2><table>' +
        [
          ['Nota fiscal', v.cte ? v.cte.nf : 'ausente'],
          ['DACTE com declaração positiva', v.cte ? v.cte.numero + ': "' + TX.DECLARACAO_CTE + '"' : 'ausente'],
          ['Embarcador e destinatário', TX.embarcador(v.embarcador).nome + ' para ' + TX.destinatario(v.destinatario).nome],
          ['Produto', TX.produto(v.produto).nome],
          ['Filial', TX.filial(v.filial).nome],
          ['Subcontratado com RNTRC', t ? TX.nomeTransportador(t) + ', RNTRC ' + (t.rntrc ? t.rntrc.numero : 'ausente') : 'frota própria'],
          ['Motorista', mot.nome],
          ['Placas do conjunto', TX.placasDoConjunto(v.conjunto).join(', ')],
          [
            'Três últimas cargas',
            d.t3
              .map(
                (c) =>
                  c.placa +
                  ' ' +
                  c.pos +
                  ': ' +
                  c.cargas.map((x) => F.data(x.data) + ' ' + (x.produto ? x.produto.nome : x.texto)).join('; '),
              )
              .join(' | '),
          ],
          [
            'Termo de compromisso',
            v.termo ? 'assinado em ' + F.data(v.termo.em.slice(0, 10)) : d.cobertura === 'gatekeeper' ? 'ausente' : 'não se aplica',
          ],
          [
            'Verificação de conformidade',
            v.verificacao && v.verificacao.estado === 'aprovada'
              ? F.data(v.verificacao.em.slice(0, 10)) + ' por ' + TX.usuario(v.verificacao.por).nome
              : 'ausente',
          ],
          ['Resultado da decisão', d.rotulo],
          [
            'Limpeza do compartimento',
            (v.limpezas || []).length
              ? v.limpezas
                  .map(
                    (l) =>
                      l.comp.replace('#', ' ') +
                      ': regime ' +
                      l.regime +
                      ', ' +
                      ((TX.fornecedor(l.lavador) || {}).nome || l.lavador) +
                      ', comprovante ' +
                      l.comprovante +
                      ', ' +
                      F.data(l.em.slice(0, 10)),
                  )
                  .join(' | ')
              : 'não exigida ou não registrada',
          ],
          ['Ciência do manual', v.manual ? 'versão ' + v.manual.versao + ' em ' + F.data(v.manual.em.slice(0, 10)) : 'ausente'],
        ]
          .concat(
            (v.liberacoes || []).map((l) => [
              'Liberação por autoridade',
              [
                (TX.db.alcadas.find((a) => a.k === l.alcada) || {}).n +
                  ' por ' +
                  ((TX.usuario(l.assinante) || {}).nome || '') +
                  ' em ' +
                  F.data(l.em.slice(0, 10)),
                'item: ' + l.checagem,
                'motivo: ' + l.motivo,
                'justificativa: ' + l.justificativa,
                'risco: ' + l.risco,
                'validade: ' + l.validade,
                'evidência: ' + l.evidencia,
                'escopo: ' + l.escopo,
                'ciência do risco: ' + (l.ciencia ? 'sim' : 'não'),
              ].join('; '),
            ]),
          )
          .map(
            (l) =>
              '<tr><th style="width:230px">' +
              e(l[0]) +
              '</th><td' +
              (/ausente/.test(l[1]) ? ' class="aus"' : '') +
              '>' +
              e(l[1]) +
              '</td></tr>',
          )
          .join('') +
        '</table>'
      );
    };
    const exp = (titulo, html, msg) => {
      if (U.exportarDocumento(titulo, html)) this.avisar(msg);
      else this.avisar('O navegador bloqueou a aba nova. Libere pop-ups e tente de novo.');
    };
    const periodoGK = TX.db.viagens.filter(
      (v) => !v.cancelada && v.assegurada && v.data >= s.de && v.data <= s.ate && TX.coberturaDe(v) === 'gatekeeper',
    );
    // Datas digitadas em DD/MM/AAAA: o campo nativo mostra o formato do idioma do navegador.
    const iso = U.dataIso,
      mascara = U.mascaraData;
    const deTxt = s.deTxt != null ? s.deTxt : F.data(s.de),
      ateTxt = s.ateTxt != null ? s.ateTxt : F.data(s.ate);
    const deOk = !!iso(deTxt),
      ateOk = !!iso(ateTxt);
    const ATALHOS = [
      ['30', 'Últimos 30 dias', TX.addDias(TX.HOJE, -30)],
      ['90', 'Últimos 90 dias', TX.addDias(TX.HOJE, -90)],
      ['365', 'Últimos 12 meses', TX.addDias(TX.HOJE, -365)],
      ['ano', 'Este ano', TX.HOJE.slice(0, 4) + '-01-01'],
    ];
    const ultSim = TX.db.simulacoes.length ? TX.db.simulacoes[TX.db.simulacoes.length - 1] : null;
    if (ultSim) ATALHOS.push(['sim', 'Desde a última simulação', ultSim.em.slice(0, 10)]);
    const ocs = TX.db.ocorrencias
      .filter((o) => o.em.slice(0, 10) >= s.de && o.em.slice(0, 10) <= s.ate)
      .sort((a, b) => b.em.localeCompare(a.em));
    const ocLinha = (o) => {
      const v = TX.viagem(o.viagem),
        t = TX.transportador(o.transportador);
      return [
        F.data(o.em.slice(0, 10)),
        v ? v.ordem + ' (' + v.id + ')' : '',
        t ? TX.nomeTransportador(t) : 'Frota própria',
        o.tipo,
        o.gravidade,
        o.descricao,
        o.fotos,
        o.revisao
          ? F.data(o.revisao.em.slice(0, 10)) + ', ' + TX.usuario(o.revisao.por).nome + ': ' + o.revisao.motivo
          : o.gravidade === 'grave'
            ? 'pendente'
            : 'não exigida',
        TX.usuario(o.por).nome,
      ];
    };
    const OC_CAB = ['Data', 'Viagem', 'Transportador', 'Tipo', 'Gravidade', 'Descrição', 'Fotos', 'Revisão', 'Registrada por'];
    return Object.assign(
      {},
      U.base(this),
      {
        q: s.q,
        onQ: (ev) => this.setState({ q: ev.target.value, pag: 1 }),
        popPeriodo: s.popAberto === 'periodo',
        abrirPeriodo: () =>
          this.setState((st) => ({ popAberto: st.popAberto === 'periodo' ? null : 'periodo', deTxt: null, ateTxt: null })),
        perRot: F.data(s.de) + ' a ' + F.data(s.ate),
        atalhos: ATALHOS.map(([k, n, de]) => ({
          k,
          n,
          sub: de.slice(0, 4) !== TX.HOJE.slice(0, 4) ? F.data(de) + ' a ' + F.data(TX.HOJE) : F.curta(de) + ' a ' + F.curta(TX.HOJE),
          on: s.de === de && s.ate === TX.HOJE,
          onClick: () => this.setState({ de, ate: TX.HOJE, pag: 1, popAberto: null, deTxt: null, ateTxt: null }),
        })),
        deTxt,
        ateTxt,
        deOk,
        ateOk,
        onDeTxt: (ev) => {
          const t = mascara(ev.target.value);
          const d = iso(t);
          this.setState(Object.assign({ deTxt: t }, d ? { de: d, pag: 1 } : {}));
        },
        onAteTxt: (ev) => {
          const t = mascara(ev.target.value);
          const d = iso(t);
          this.setState(Object.assign({ ateTxt: t }, d ? { ate: d, pag: 1 } : {}));
        },
        dataMsg:
          deOk && ateOk
            ? s.de > s.ate
              ? 'A data inicial é depois da final.'
              : 'A lista atualiza enquanto você digita.'
            : 'Digite dia, mês e ano: 01/09/2026.',
        dataErro: !(deOk && ateOk && s.de <= s.ate),
        tipos: [
          ['todos', 'Todas'],
          ['afretamento', 'Afretamento'],
          ['propria', 'Frota própria'],
        ].map(([k, n]) => ({
          n,
          k,
          on: s.tipo === k,
          onClick: () => this.setState({ tipo: k, pag: 1 }),
        })),
        resumoBusca:
          res.length + ' viagens asseguradas de ' + F.data(s.de) + ' a ' + F.data(s.ate) + (s.q ? ' para "' + s.q + '"' : '') + '.',
        simAtiva: !!s.simIni,
        simTempo: Math.floor(elapsed / 60) + ' min ' + String(elapsed % 60).padStart(2, '0') + ' s',
        simRot: s.simIni ? 'Registrar simulação' : 'Iniciar simulação de rastreabilidade',
        onSim: () => {
          if (!s.simIni) {
            this.setState({ simIni: Date.now() });
            this.avisar('Simulação iniciada. Faça a busca pedida; ao terminar, registre. O tempo fica gravado.');
            return;
          }
          const min = Math.max(1, Math.round(elapsed / 60));
          TX.fazer('registrarSimulacao', { pedido, encontradas: res.length, duracaoMin: min });
          this.setState({ simIni: null });
          this.avisar('Simulação registrada: ' + pedido + ', ' + res.length + ' viagens em ' + min + ' min.');
        },
        nRes: res.length,
        cols: '28px 120px minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,1fr) 92px',
        linhas: s.loading
          ? []
          : pg.itens.map((v) => {
              const on = s.sel.includes(v.id);
              const dec = TX.decidir(v),
                tr = TX.transportador(v.transportador),
                mot = TX.pessoa(v.motorista);
              const termoOk = !!v.termo || TX.coberturaDe(v) !== 'gatekeeper',
                verOk = !!(v.verificacao && v.verificacao.estado === 'aprovada');
              return {
                ordem: v.ordem,
                res: dec.rotulo,
                tom:
                  dec.porAutoridade && dec.resultado === 'pronta'
                    ? 'autoridade'
                    : { pronta: 'ok', falta: 'falta', bloqueada: 'bloqueio', tecnico: 'tecnico' }[dec.resultado] || 'na',
                transp: tr ? TX.nomeTransportador(tr) : 'Frota própria',
                mot: mot ? mot.nome : '',
                on,
                termoOk,
                verOk,
                id: v.id,
                href: '/viagem?id=' + v.id,
                data: F.data(v.data),
                cte: v.cte ? v.cte.numero : 'pendente',
                nf: v.cte ? v.cte.nf : '',
                temCte: !!v.cte,
                rota: TX.embarcador(v.embarcador).nome + ' para ' + TX.destinatario(v.destinatario).nome,
                produto: TX.produto(v.produto).nome,
                placas: TX.placasDoConjunto(v.conjunto).join(' '),
                termo: v.termo ? F.curta(v.termo.em.slice(0, 10)) : TX.coberturaDe(v) === 'gatekeeper' ? 'falta' : 'n/a',

                ver: v.verificacao && v.verificacao.estado === 'aprovada' ? F.curta(v.verificacao.em.slice(0, 10)) : 'falta',

                toggle: () => this.setState({ sel: on ? s.sel.filter((x) => x !== v.id) : s.sel.concat(v.id) }),
              };
            }),
        vazio: !s.loading && res.length === 0,
        selTodasRot: sel.length === res.length && res.length ? 'Tirar todas da amostra' : 'Pôr todas na amostra',
        selTodas: () => this.setState({ sel: sel.length === res.length ? [] : res.map((v) => v.id) }),
        amostraTxt: sel.length
          ? sel.length +
            (sel.length === 1 ? ' viagem na amostra (' : ' viagens na amostra (') +
            sel.filter((id) => TX.viagem(id).tipo === 'propria').length +
            ' de frota própria, ' +
            sel.filter((id) => TX.viagem(id).tipo !== 'propria').length +
            ' de afretamento).'
          : 'Marque na lista as viagens que o auditor pediu.',
        nSel: sel.length,
        amOk: sel.length > 0,
        exportarAmostra: () => {
          if (!sel.length) return;
          exp(
            'Amostra de auditoria',
            '<h1>Amostra de auditoria</h1><div class="sub">' +
              e(TX.db.tenant.nome) +
              ', ' +
              sel.length +
              ' viagens. Itens conferidos por viagem.</div>' +
              sel.map((id) => itemViagem(TX.viagem(id))).join(''),
            'Amostra com ' + sel.length + ' viagens aberta em outra aba, em documento único.',
          );
        },
        apoio: [
          {
            k: 'ocorrencias',
            ancora: 'ocorrencias',
            n: 'Ocorrências do período',
            sub: ocs.length
              ? ocs.length +
                ' registradas, ' +
                ocs.filter((o) => o.gravidade === 'grave').length +
                ' grave' +
                (ocs.filter((o) => o.gravidade === 'grave').length === 1 ? '' : 's')
              : 'nenhuma ocorrência no período',
            rot: 'Documento',
            csvD: 'inline',
            onClick: () =>
              exp(
                'Ocorrências do período',
                '<h1>Ocorrências do período</h1><div class="sub">' +
                  e(TX.db.tenant.nome) +
                  ', ' +
                  F.data(s.de) +
                  ' a ' +
                  F.data(s.ate) +
                  ', ' +
                  ocs.length +
                  ' ocorrências</div><table><tr>' +
                  OC_CAB.map((c) => '<th>' + e(c) + '</th>').join('') +
                  '</tr>' +
                  ocs
                    .map(
                      (o) =>
                        '<tr>' +
                        ocLinha(o)
                          .map((c, i) => '<td' + (i === 7 && c === 'pendente' ? ' class="aus"' : '') + '>' + e(c) + '</td>')
                          .join('') +
                        '</tr>',
                    )
                    .join('') +
                  '</table>',
                ocs.length + ' ocorrências abertas em outra aba, prontas para o SGQ.',
              ),
            onCsv: () => {
              const csv =
                '\ufeff' +
                [OC_CAB]
                  .concat(ocs.map(ocLinha))
                  .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(';'))
                  .join('\r\n');
              const a = document.createElement('a');
              a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
              a.download = 'ocorrencias-' + s.de + '-a-' + s.ate + '.csv';
              document.body.appendChild(a);
              a.click();
              a.remove();
              this.avisar(ocs.length + ' ocorrências exportadas em planilha (CSV) para o SGQ.');
            },
          },
          {
            k: 'frota',
            n: 'Frota no escopo GMP+',
            sub: TX.db.conjuntos.filter((c) => c.dono === 'propria' && c.escopo && c.escopo.no).length + ' conjuntos com as placas',
            onClick: () =>
              exp(
                'Frota no escopo',
                '<h1>Frota própria no escopo GMP+</h1><table><tr><th>Cavalo</th><th>Compartimentos</th><th>Desde</th></tr>' +
                  TX.db.conjuntos
                    .filter((c) => c.dono === 'propria' && c.escopo && c.escopo.no)
                    .map(
                      (c) =>
                        '<tr><td class="mono">' +
                        e(c.cavalo) +
                        '</td><td class="mono">' +
                        e(
                          TX.compsDoConjunto(c)
                            .map((k) => k.placa + ' ' + k.pos)
                            .join(', '),
                        ) +
                        '</td><td>' +
                        e(F.data(c.escopo.desde)) +
                        '</td></tr>',
                    )
                    .join('') +
                  '</table>',
                'Lista da frota no escopo aberta em outra aba.',
              ),
          },
          {
            k: 'treinos',
            n: 'Treinamentos registrados',
            sub: TX.db.treinamentos.length + ' registros com participantes',
            onClick: () =>
              exp(
                'Treinamentos',
                '<h1>Treinamentos registrados</h1><table><tr><th>Data</th><th>Tema</th><th>Instrutor</th><th>Participantes</th></tr>' +
                  TX.db.treinamentos
                    .map(
                      (t) =>
                        '<tr><td>' +
                        e(F.data(t.data)) +
                        '</td><td>' +
                        e(t.tema) +
                        '</td><td>' +
                        e(t.instrutor) +
                        '</td><td>' +
                        e(t.participantes.map((p) => (TX.usuario(p) || TX.pessoa(p) || {}).nome).join(', ')) +
                        '</td></tr>',
                    )
                    .join('') +
                  '</table>',
                'Lista de treinamentos aberta em outra aba.',
              ),
          },
          {
            k: 'gatekeeper',
            n: 'Protocolos gatekeeper do período',
            sub: periodoGK.length + ' viagens e a comunicação ao organismo certificador',
            onClick: () =>
              exp(
                'Protocolos gatekeeper',
                '<h1>Protocolos gatekeeper</h1><div class="sub">' +
                  F.data(s.de) +
                  ' a ' +
                  F.data(s.ate) +
                  '</div><h2>Comunicação ao organismo certificador</h2><table>' +
                  TX.db.filiais
                    .map(
                      (f) =>
                        '<tr><th>' +
                        e(f.nome) +
                        '</th><td>' +
                        (f.comunicacaoOC
                          ? e(F.data(f.comunicacaoOC.data) + ', protocolo ' + f.comunicacaoOC.protocolo)
                          : '<span class="aus">não comunicada</span>') +
                        '</td></tr>',
                    )
                    .join('') +
                  '</table><h2>Viagens sob gatekeeper</h2><table><tr><th>Data</th><th>Ordem</th><th>Filial</th><th>Transportador</th><th>RNTRC</th></tr>' +
                  periodoGK
                    .map((v) => {
                      const t = TX.transportador(v.transportador);
                      return (
                        '<tr><td>' +
                        e(F.data(v.data)) +
                        '</td><td>' +
                        e(v.ordem) +
                        '</td><td>' +
                        e(TX.filial(v.filial).nome) +
                        '</td><td>' +
                        e(TX.nomeTransportador(t)) +
                        '</td><td>' +
                        e(t && t.rntrc ? t.rntrc.numero : '') +
                        '</td></tr>'
                      );
                    })
                    .join('') +
                  '</table>',
                'Protocolos gatekeeper abertos em outra aba.',
              ),
          },
        ].map((ap) =>
          Object.assign({ ancora: 'apoio-' + ap.k, temCsv: ap.k === 'ocorrencias', onCsv: () => {} }, ap, {
            destaque: !!ap.ancora && typeof location !== 'undefined' && location.hash === '#' + ap.ancora,
          }),
        ),
        ultimaSim: ultSim
          ? 'Última simulação de rastreabilidade: ' +
            F.data(ultSim.em.slice(0, 10)) +
            ', ' +
            ultSim.pedido +
            ', ' +
            Math.floor(ultSim.duracaoMin / 60) +
            'h' +
            String(ultSim.duracaoMin % 60).padStart(2, '0') +
            ' de 4h.'
          : 'Nenhuma simulação de rastreabilidade registrada.',
        drawerId: s.drawer && s.drawer.viagem,
        abrirViagem: (id) => this.setState({ drawer: { viagem: id } }),
        fecharDrawer: () => this.setState({ drawer: null }),
        limparAmostra: () => this.setState({ sel: [] }),
        todasMarcadas: sel.length > 0 && sel.length === res.length,
        algumasMarcadas: sel.length > 0 && sel.length < res.length,
        sims: TX.db.simulacoes
          .slice()
          .reverse()
          .map((m) => ({
            data: F.data(m.em.slice(0, 10)),
            dur: Math.floor(m.duracaoMin / 60) + 'h' + String(m.duracaoMin % 60).padStart(2, '0'),
            pedido: m.pedido,
            quem: TX.usuario(m.por).nome,
            n: m.encontradas,
          })),
      },
      pg.vals,
    );
  }

  renderDrawer(v) {
    const id = v.drawerId;
    const vg = id ? TX.viagem(id) : null;
    if (!vg) return null;
    const F = TX.fmt,
      d = TX.decidir(vg),
      tr = TX.transportador(vg.transportador),
      mot = TX.pessoa(vg.motorista);
    const tom =
      d.porAutoridade && d.resultado === 'pronta'
        ? 'autoridade'
        : { pronta: 'ok', falta: 'falta', bloqueada: 'bloqueio', tecnico: 'tecnico' }[d.resultado] || 'na';
    const on = this.state.sel.includes(vg.id);
    const alternar = () => this.setState((st) => ({ sel: on ? st.sel.filter((x) => x !== vg.id) : st.sel.concat(vg.id) }));
    return (
      <Drawer
        id="aud-viagem"
        data-tx-drawer="viagem"
        titulo={vg.ordem}
        sub={F.data(vg.data) + ', ' + TX.produto(vg.produto).nome}
        aoFechar={v.fecharDrawer}
        rodape={
          <>
            <Botao onClick={alternar}>{on ? 'Tirar da amostra' : 'Pôr na amostra'}</Botao>
            <Botao variante="primario" href={'/viagem?id=' + vg.id}>
              Abrir viagem completa
            </Botao>
          </>
        }
      >
        <Linha rotulo="Resultado">
          <Situacao tom={tom} forma="selo">
            {d.rotulo}
          </Situacao>
        </Linha>
        <Linha rotulo="CT-e e NF">
          <span className="tx-mono">{vg.cte ? vg.cte.numero + ' e ' + vg.cte.nf : 'CT-e pendente'}</span>
        </Linha>
        <Linha rotulo="Embarcador e destinatário">
          <span className="tx-peso-700" style={{ textAlign: 'right' }}>
            {TX.embarcador(vg.embarcador).nome + ' para ' + TX.destinatario(vg.destinatario).nome}
          </span>
        </Linha>
        <Linha rotulo="Filial">
          <span className="tx-peso-700">{TX.filial(vg.filial).nome}</span>
        </Linha>
        <Linha rotulo="Transportador">
          <span className="tx-peso-700" style={{ textAlign: 'right' }}>
            {tr ? TX.nomeTransportador(tr) + (tr.rntrc ? ', RNTRC ' + tr.rntrc.numero : '') : 'Frota própria'}
          </span>
        </Linha>
        <Linha rotulo="Motorista">
          <span className="tx-peso-700">{mot ? mot.nome : ''}</span>
        </Linha>
        <Linha rotulo="Placas">
          <span className="tx-mono">{TX.placasDoConjunto(vg.conjunto).join(' ')}</span>
        </Linha>
        <Linha rotulo="Termo de compromisso">
          <span className="tx-peso-700">
            {vg.termo ? F.data(vg.termo.em.slice(0, 10)) : TX.coberturaDe(vg) === 'gatekeeper' ? 'Falta' : 'Não se aplica'}
          </span>
        </Linha>
        <Linha rotulo="Verificação">
          <span className="tx-peso-700">
            {vg.verificacao && vg.verificacao.estado === 'aprovada'
              ? F.data(vg.verificacao.em.slice(0, 10)) + ', ' + TX.usuario(vg.verificacao.por).nome
              : 'Falta'}
          </span>
        </Linha>
        <Linha rotulo="Ciência do manual">
          <span className="tx-peso-700">{vg.manual ? 'v' + vg.manual.versao + ' em ' + F.data(vg.manual.em.slice(0, 10)) : 'Falta'}</span>
        </Linha>
        {(vg.liberacoes || []).map((l, i) => (
          <Linha key={i} rotulo="Liberação por autoridade">
            <span className="tx-peso-700" style={{ textAlign: 'right' }}>
              {(TX.usuario(l.assinante) || {}).nome + ', ' + F.data(l.em.slice(0, 10)) + ': ' + l.motivo}
            </span>
          </Linha>
        ))}
        <h3 className="tx-aud-secao">Três últimas cargas</h3>
        {d.t3.map((c) => (
          <Linha key={c.placa + c.pos} rotulo={<span className="tx-mono">{c.placa + ' ' + c.pos}</span>}>
            <span className="tx-sec" style={{ textAlign: 'right' }}>
              {c.cargas.map((x) => (x.produto ? x.produto.nome : x.texto)).join(', ') || 'sem registro'}
            </span>
          </Linha>
        ))}
      </Drawer>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Auditoria" data-tela="Auditoria">
        <div className="tx-pagina">
          <CabecalhoPagina
            titulo="Auditoria"
            sub="Rastrear por placa, CT-e, NF ou período e montar a amostra do auditor."
            acoes={
              <>
                {v.simAtiva ? (
                  <Badge tom="aviso" mono aria-live="polite">
                    {'simulação ' + v.simTempo}
                  </Badge>
                ) : null}
                <Botao variante={v.simAtiva ? 'primario' : 'contorno'} onClick={v.onSim} data-tx-simulacao="">
                  {v.simRot}
                </Botao>
              </>
            }
          />
          <div className="tx-aud-busca" role="search">
            <EntradaCaixa
              icone={LUPA}
              className="tx-aud-campo"
              aria-label="Rastrear por placa, CT-e, NF ou ordem"
              value={v.q ?? ''}
              onChange={v.onQ}
              data-tx-rastrear=""
              placeholder="Placa, CT-e, NF ou ordem"
            />
            <div data-tx-pop="" className="tx-aud-pop-ancora">
              <Botao
                variante="contorno"
                icone={CALENDARIO}
                onClick={v.abrirPeriodo}
                data-tx-dd="periodo"
                aria-expanded={!!v.popPeriodo}
                aria-haspopup="dialog"
              >
                <span className="tx-mono num">{v.perRot}</span> {SETA_BAIXO}
              </Botao>
              {v.popPeriodo ? (
                <div className="tx-aud-pop" role="dialog" aria-label="Período">
                  {v.atalhos.map((at) => (
                    <button
                      key={at.k}
                      type="button"
                      className="tx-aud-pop__op"
                      aria-pressed={at.on}
                      onClick={at.onClick}
                      data-tx-atalho={at.k}
                    >
                      {at.n}
                      <span className="tx-aud-pop__sub num">{at.sub}</span>
                    </button>
                  ))}
                  <div className="tx-aud-pop__datas">
                    <div className="tx-tipo-rotulo">Datas exatas</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-2)', marginTop: 'var(--esp-2)' }}>
                      <Entrada
                        mono
                        aria-label="Data inicial, DD/MM/AAAA"
                        aria-invalid={!v.deOk || undefined}
                        value={v.deTxt ?? ''}
                        onChange={v.onDeTxt}
                        data-tx-de=""
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        inputMode="numeric"
                      />
                      <span className="tx-apagado tx-tipo-legenda">a</span>
                      <Entrada
                        mono
                        aria-label="Data final, DD/MM/AAAA"
                        aria-invalid={!v.ateOk || undefined}
                        value={v.ateTxt ?? ''}
                        onChange={v.onAteTxt}
                        data-tx-ate=""
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        inputMode="numeric"
                      />
                    </div>
                    <div
                      className={'tx-tipo-legenda ' + (v.dataErro ? 'tx-aud-aviso' : 'tx-apagado')}
                      style={{ marginTop: 'var(--esp-1-5)' }}
                    >
                      {v.dataMsg}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ display: 'flex', gap: 'var(--esp-1-5)' }} role="group" aria-label="Tipo de viagem">
              {v.tipos.map((tp) => (
                <Chip key={tp.k} tipo="filtro" selecionado={tp.on} onClick={tp.onClick} data-tx-tipo={tp.k}>
                  {tp.n}
                </Chip>
              ))}
            </div>
          </div>
          <div className="tx-aud-faixa">
            <span className="tx-tipo-denso">
              <b className="num">{v.nRes}</b> {v.resumoBusca.replace(/^\d+ /, '')}
            </span>
            <span className="tx-aud-faixa__fim">
              {v.nRes ? (
                <Botao variante="texto" tamanho="p" onClick={v.selTodas}>
                  {v.selTodasRot}
                </Botao>
              ) : null}
            </span>
          </div>
          <div className="tx-aud-sims" aria-label="Simulações de rastreabilidade" role="list">
            <span className="tx-tipo-legenda tx-apagado">Simulações de rastreabilidade (limite: 4 horas)</span>
            {v.sims.length ? (
              v.sims.map((sm, i) => (
                <span key={i} role="listitem" data-tx-sim-item="" className="tx-aud-sim" title={sm.quem + ', ' + sm.n + ' viagens'}>
                  <span className="num tx-peso-700">{sm.data}</span>
                  <span className="tx-sec">{sm.pedido}</span>
                  <Badge tom="ok" mono>
                    {sm.dur}
                  </Badge>
                </span>
              ))
            ) : (
              <span className="tx-tipo-legenda tx-apagado">nenhuma registrada</span>
            )}
          </div>
          <div className="tx-aud-apoio" role="group" aria-label="Listas de apoio">
            {v.apoio.map((ap) => (
              <div
                key={ap.k}
                id={ap.ancora}
                data-tx-apoio={ap.k}
                className={'tx-aud-apoio__item' + (ap.destaque ? ' tx-aud-apoio__item--destaque' : '')}
              >
                <div className="tx-aud-apoio__texto">
                  <div className="tx-tipo-denso tx-peso-700">{ap.n}</div>
                  <div className="tx-tabela__sub">{ap.sub}</div>
                </div>
                <Botao variante="contorno" tamanho="p" onClick={ap.onClick} data-tx-apoio-doc={ap.k}>
                  Documento
                </Botao>
                {ap.temCsv ? (
                  <Botao variante="contorno" tamanho="p" onClick={ap.onCsv} data-tx-apoio-csv={ap.k}>
                    Planilha
                  </Botao>
                ) : null}
              </div>
            ))}
          </div>
          <Cartao lista>
            <Tabela colunas={v.cols} rotulo="Viagens encontradas" className="tx-aud-tabela">
              <TabelaCabecalho>
                <span>
                  {v.nRes ? (
                    <CelulaSelecao
                      marcada={v.todasMarcadas}
                      misto={v.algumasMarcadas}
                      aoMudar={v.selTodas}
                      rotulo="Marcar todas as viagens do período"
                    />
                  ) : null}
                </span>
                <span>Data e CT-e</span>
                <span>Produto e rota</span>
                <span>Transportador e motorista</span>
                <span>Resultado</span>
                <span>Termo, verificação</span>
              </TabelaCabecalho>
              {v.loading ? (
                <TabelaEsqueleto linhas={6} />
              ) : (
                v.linhas.map((r) => (
                  <div
                    key={r.id}
                    role="row"
                    data-tx-res={r.id}
                    aria-selected={r.on || undefined}
                    className="tx-tabela__linha tx-tabela__linha--clicavel"
                    onClick={() => v.abrirViagem(r.id)}
                  >
                    <span onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        rotulo={<span className="tx-so-leitor">{'Pôr ' + r.ordem + ' na amostra'}</span>}
                        checked={r.on}
                        onChange={r.toggle}
                        data-tx-sel={r.id}
                      />
                    </span>
                    <span style={{ minWidth: '0' }}>
                      <button
                        type="button"
                        className="tx-aud-abrir tx-mono num"
                        onClick={(e) => (e.stopPropagation(), v.abrirViagem(r.id))}
                      >
                        {r.data}
                      </button>
                      <span className={'tx-tabela__sub tx-mono' + (r.temCte ? '' : ' tx-aud-aviso')}>
                        {r.temCte ? r.cte + ', NF ' + r.nf : 'CT-e pendente'}
                      </span>
                    </span>
                    <span style={{ minWidth: '0' }}>
                      <span className="tx-tabela__forte">{r.produto}</span>
                      <span className="tx-tabela__sub">{r.rota}</span>
                    </span>
                    <span style={{ minWidth: '0' }}>
                      <span className="tx-tabela__forte">{r.transp}</span>
                      <span className="tx-tabela__sub">{r.mot}</span>
                      <span className="tx-tabela__sub tx-mono">{r.placas}</span>
                    </span>
                    <Situacao tom={r.tom}>{r.res}</Situacao>
                    <span className="tx-tipo-legenda">
                      <span className={'tx-mono ' + (r.termoOk ? 'tx-sec' : 'tx-aud-falta')} style={{ display: 'block' }}>
                        {'termo ' + r.termo}
                      </span>
                      <span className={'tx-mono ' + (r.verOk ? 'tx-sec' : 'tx-aud-falta')} style={{ display: 'block' }}>
                        {'verif. ' + r.ver}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </Tabela>
            {v.vazio ? (
              <EstadoVazio titulo="Nenhuma viagem assegurada encontrada">Mude a placa, o documento ou o período.</EstadoVazio>
            ) : null}
            <TabelaRodape>
              <Paginacao pagina={v.pagina} total={v.total} info={v.pagInfo} aoIr={v.irPara} />
            </TabelaRodape>
          </Cartao>
        </div>
        <BarraSelecao
          quantidade={v.nSel}
          texto={v.amostraTxt}
          aoLimpar={v.limparAmostra}
          rotuloLimpar="Limpar amostra"
          acoes={
            <Botao variante="primario" inativo={!v.amOk} onClick={v.exportarAmostra} data-tx-exportar-amostra="">
              Exportar amostra em documento único
            </Botao>
          }
        />
        {this.renderDrawer(v)}
      </div>
    );
  }
}
