// Gerado de "SaaS moderno estilo Dribbble/Auditoria.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

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
    return TX.db.viagens
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
    const am = U.cta(sel.length > 0);
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
        ]
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
          sub: F.curta(de) + ' a ' + F.curta(TX.HOJE),
          fw: s.de === de && s.ate === TX.HOJE ? '800' : '600',
          onClick: () => this.setState({ de, ate: TX.HOJE, pag: 1, popAberto: null, deTxt: null, ateTxt: null }),
        })),
        deTxt,
        ateTxt,
        deBd: deOk ? 'var(--borda-campo)' : 'var(--aviso-2)',
        ateBd: ateOk ? 'var(--borda-campo)' : 'var(--aviso-2)',
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
        dataMsgC: deOk && ateOk && s.de <= s.ate ? 'var(--texto-apagado)' : 'var(--aviso)',
        tipos: [
          ['todos', 'Todas'],
          ['afretamento', 'Afretamento'],
          ['propria', 'Frota própria'],
        ].map(([k, n]) => ({
          n,
          onClick: () => this.setState({ tipo: k, pag: 1 }),
          bg: s.tipo === k ? '#fff' : 'transparent',
          c: s.tipo === k ? 'var(--primario-3)' : '#fff',
        })),
        resumoBusca:
          res.length +
          ' viagens asseguradas de ' +
          F.data(s.de) +
          ' a ' +
          F.data(s.ate) +
          (s.q ? ' para "' + s.q + '"' : '') +
          '. Colunas na ordem em que o auditor anota.',
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
        cols: '22px 82px 70px minmax(0,1.4fr) minmax(0,1fr) 124px 50px 74px',
        linhas: s.loading
          ? []
          : pg.itens.map((v) => {
              const on = s.sel.includes(v.id);
              return {
                id: v.id,
                href: '/viagem?id=' + v.id,
                data: F.data(v.data),
                cte: v.cte ? v.cte.numero : 'pendente',
                nf: v.cte ? v.cte.nf : '',
                cteC: v.cte ? 'var(--texto)' : 'var(--aviso)',
                rota: TX.embarcador(v.embarcador).nome + ' para ' + TX.destinatario(v.destinatario).nome,
                produto: TX.produto(v.produto).nome,
                placas: TX.placasDoConjunto(v.conjunto).join(' '),
                termo: v.termo ? F.curta(v.termo.em.slice(0, 10)) : TX.coberturaDe(v) === 'gatekeeper' ? 'falta' : 'n/a',
                termoC: v.termo || TX.coberturaDe(v) !== 'gatekeeper' ? 'var(--texto-2)' : 'var(--perigo)',
                ver: v.verificacao && v.verificacao.estado === 'aprovada' ? F.curta(v.verificacao.em.slice(0, 10)) : 'falta',
                verC: v.verificacao && v.verificacao.estado === 'aprovada' ? 'var(--texto-2)' : 'var(--perigo)',
                bg: on ? '#f3faf8' : '#fff',
                ck: on ? 'linear-gradient(135deg,var(--primario),var(--azul))' : '#fff',
                ckBd: on ? 'var(--primario)' : 'var(--borda-forte)',
                ckI: on ? '✓' : '',
                toggle: () => this.setState({ sel: on ? s.sel.filter((x) => x !== v.id) : s.sel.concat(v.id) }),
              };
            }),
        vazio: !s.loading && res.length === 0,
        selTodasRot: sel.length === res.length && res.length ? 'Tirar todas da amostra' : 'Pôr todas na amostra',
        selTodas: () => this.setState({ sel: sel.length === res.length ? [] : res.map((v) => v.id) }),
        amostraTxt: sel.length
          ? sel.length +
            ' viagens selecionadas (' +
            sel.filter((id) => TX.viagem(id).tipo === 'propria').length +
            ' de frota própria, ' +
            sel.filter((id) => TX.viagem(id).tipo !== 'propria').length +
            ' de afretamento).'
          : 'Marque as viagens que o auditor pediu na lista ao lado.',
        amBg: am.bg,
        amC: am.c,
        amSh: am.sh,
        amCur: am.cur,
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
                (ocs.filter((o) => o.gravidade === 'grave').length === 1 ? '' : 's') +
                ', com descrição e revisão'
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
            sub:
              TX.db.conjuntos.filter((c) => c.dono === 'propria' && c.escopo && c.escopo.no).length +
              ' conjuntos com placa de cada compartimento',
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
            sub: TX.db.treinamentos.length + ' registros com data, tema, instrutor e participantes',
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
            sub: periodoGK.length + ' viagens e a data de comunicação ao OC por filial',
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
          Object.assign({ ancora: 'apoio-' + ap.k, rot: 'Exportar', csvD: 'none', onCsv: () => {} }, ap, {
            bd: ap.ancora && location.hash === '#' + ap.ancora ? 'var(--primario)' : 'var(--borda-suave)',
          }),
        ),
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

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Auditoria" data-tela="Auditoria">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>Auditoria</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                Rastrear por placa, CT-e, NF ou período e montar a amostra. O auditor não opera: a qualidade opera ao lado dele.
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}></div>
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: '5',
              borderRadius: '22px',
              background: 'linear-gradient(115deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)',
              color: '#fff',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,.1)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: '13px',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  flex: '1',
                  minWidth: '260px',
                  maxWidth: '440px',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="rgba(255,255,255,.7)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <circle cx="7" cy="7" r="4.6"></circle>
                  <line x1="10.5" y1="10.5" x2="13.5" y2="13.5"></line>
                </svg>
                <input
                  value={v.q ?? ''}
                  onChange={v.onQ}
                  data-tx-rastrear=""
                  placeholder="Placa, CT-e, NF ou ordem. Ex.: QWM 4H57"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '16px',
                    padding: '12px 0',
                    flex: '1',
                    color: '#fff',
                    fontFamily: "'Spline Sans Mono',monospace",
                  }}
                />
              </div>
              <div data-tx-pop="" style={{ position: 'relative' }}>
                <div role="button" tabIndex={0}
                  onClick={v.abrirPeriodo}
                  data-tx-dd="periodo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,.25)',
                    background: 'rgba(255,255,255,.08)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  className="tx-hd5eb93c"
                >
                  <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: '600' }}>Período</span>
                  <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontWeight: '600' }}>{v.perRot}</span>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="rgba(255,255,255,.7)"
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
                        top: '50px',
                        background: 'var(--painel)',
                        color: 'var(--texto)',
                        border: '1px solid var(--borda)',
                        borderRadius: '14px',
                        boxShadow: '0 16px 40px rgba(9,61,68,.22)',
                        padding: '6px',
                        width: '280px',
                        zIndex: '60',
                      }}
                    >
                      {(Array.isArray(v.atalhos) ? v.atalhos : []).map((at, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={at?.onClick}
                            data-tx-atalho={at?.k}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 11px',
                              borderRadius: '9px',
                              fontSize: '13px',
                              fontWeight: at?.fw,
                              cursor: 'pointer',
                            }}
                            className="tx-h894fca3"
                          >
                            {at?.n}
                            <span
                              style={{ marginLeft: 'auto', fontFamily: "'Spline Sans Mono',monospace", fontSize: '11px', color: 'var(--texto-apagado)' }}
                            >
                              {at?.sub}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      <div style={{ borderTop: '1px solid var(--superficie-2)', marginTop: '4px', padding: '10px 11px 6px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: 'var(--texto-apagado)' }}>DATAS EXATAS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '7px' }}>
                          <input
                            value={v.deTxt ?? ''}
                            onChange={v.onDeTxt}
                            data-tx-de=""
                            placeholder="DD/MM/AAAA"
                            maxLength="10"
                            style={{
                              width: '108px',
                              border: `1px solid ${v.deBd ?? ''}`,
                              borderRadius: '9px',
                              padding: '8px 9px',
                              fontSize: '13px',
                              fontFamily: "'Spline Sans Mono',monospace",
                              outline: 'none',
                            }}
                          />
                          <span style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>a</span>
                          <input
                            value={v.ateTxt ?? ''}
                            onChange={v.onAteTxt}
                            data-tx-ate=""
                            placeholder="DD/MM/AAAA"
                            maxLength="10"
                            style={{
                              width: '108px',
                              border: `1px solid ${v.ateBd ?? ''}`,
                              borderRadius: '9px',
                              padding: '8px 9px',
                              fontSize: '13px',
                              fontFamily: "'Spline Sans Mono',monospace",
                              outline: 'none',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: v.dataMsgC, marginTop: '6px' }}>{v.dataMsg}</div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              {(Array.isArray(v.tipos) ? v.tipos : []).map((tp, $index) => (
                <Fragment key={$index}>
                  <span role="button" tabIndex={0}
                    onClick={tp?.onClick}
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      borderRadius: '99px',
                      padding: '7px 13px',
                      cursor: 'pointer',
                      background: tp?.bg,
                      color: tp?.c,
                      border: '1px solid rgba(255,255,255,.22)',
                    }}
                  >
                    {tp?.n}
                  </span>
                </Fragment>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {v.simAtiva ? (
                  <>
                    <span
                      style={{
                        fontFamily: "'Spline Sans Mono',monospace",
                        fontSize: '13px',
                        background: 'rgba(232,163,61,.25)',
                        border: '1px solid rgba(232,163,61,.5)',
                        borderRadius: '99px',
                        padding: '6px 12px',
                      }}
                    >
                      {'simulação '}
                      {v.simTempo}
                    </span>
                  </>
                ) : null}
                <span role="button" tabIndex={0}
                  onClick={v.onSim}
                  data-tx-simulacao=""
                  style={{
                    background: 'var(--painel)',
                    color: 'var(--primario-3)',
                    fontSize: '13px',
                    fontWeight: '800',
                    borderRadius: '99px',
                    padding: '9px 16px',
                    cursor: 'pointer',
                  }}
                >
                  {v.simRot}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.65)', marginTop: '10px' }}>{v.resumoBusca}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,340px)', gap: '20px', alignItems: 'start' }}>
            <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderBottom: '1px solid var(--borda-suave)' }}>
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Viagens encontradas</div>
                <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', color: 'var(--texto-sec)' }}>{v.nRes}</span>
                <span role="button" tabIndex={0}
                  onClick={v.selTodas}
                  style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                >
                  {v.selTodasRot}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: v.cols,
                  gap: '10px',
                  padding: '10px 18px',
                  background: 'var(--superficie)',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '.7px',
                  color: 'var(--texto-apagado)',
                }}
              >
                <span></span>
                <span>DATA</span>
                <span>CT-E E NF</span>
                <span>EMBARCADOR E DESTINATÁRIO</span>
                <span>PRODUTO</span>
                <span>PLACAS</span>
                <span>TERMO</span>
                <span>VERIFICAÇÃO</span>
              </div>
              {(Array.isArray(v.linhas) ? v.linhas : []).map((r, $index) => (
                <Fragment key={$index}>
                  <div
                    data-tx-res={r?.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: v.cols,
                      gap: '10px',
                      padding: '10px 18px',
                      borderTop: '1px solid var(--superficie-2)',
                      alignItems: 'center',
                      fontSize: '13px',
                      background: r?.bg,
                    }}
                  >
                    <span role="button" tabIndex={0}
                      onClick={r?.toggle}
                      data-tx-sel={r?.id}
                      style={{
                        width: '19px',
                        height: '19px',
                        borderRadius: '6px',
                        border: `2px solid ${r?.ckBd ?? ''}`,
                        background: r?.ck,
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {r?.ckI}
                    </span>
                    <A href={r?.href} style={{ fontFamily: "'Spline Sans Mono',monospace", fontWeight: '600', color: 'var(--texto)' }}>
                      {r?.data}
                    </A>
                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: r?.cteC, lineHeight: '1.45' }}>
                      {r?.cte}
                      <br />
                      {r?.nf}
                    </span>
                    <span style={{ minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r?.rota}</span>
                    <span style={{ minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r?.produto}</span>
                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12px' }}>{r?.placas}</span>
                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: r?.termoC }}>{r?.termo}</span>
                    <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: r?.verC }}>{r?.ver}</span>
                  </div>
                </Fragment>
              ))}
              {v.vazio ? (
                <>
                  <div style={{ padding: '40px 18px', textAlign: 'center', fontSize: '13px', color: 'var(--texto-sec)' }}>
                    Nenhuma viagem assegurada com esta placa, documento ou período.
                  </div>
                </>
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderTop: '1px solid var(--borda-suave)' }}>
                <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{v.pagInfo}</span>
                {v.temPaginacao ? (
                  <>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      {(Array.isArray(v.paginas) ? v.paginas : []).map((pg, $index) => (
                        <Fragment key={$index}>
                          <span role="button" tabIndex={0}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '18px 20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Amostra</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>{v.amostraTxt}</div>{' '}
                <span role="button" tabIndex={0}
                  onClick={v.exportarAmostra}
                  data-tx-exportar-amostra=""
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '12px',
                    background: v.amBg,
                    color: v.amC,
                    boxShadow: v.amSh,
                    cursor: v.amCur,
                    fontSize: '13px',
                    fontWeight: '800',
                    borderRadius: '99px',
                    padding: '10px',
                  }}
                >
                  Exportar amostra em documento único
                </span>{' '}
              </div>
              <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '18px 20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Listas de apoio</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>o que o auditor pede na mesma visita</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  {(Array.isArray(v.apoio) ? v.apoio : []).map((ap, $index) => (
                    <Fragment key={$index}>
                      <div
                        id={ap?.ancora}
                        data-tx-apoio={ap?.k}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          border: `1px solid ${ap?.bd ?? ''}`,
                          borderRadius: '12px',
                          padding: '10px 12px',
                          scrollMarginTop: '24px',
                        }}
                      >
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <div style={{ fontSize: '13px', fontWeight: '700' }}>{ap?.n}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{ap?.sub}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                          <span role="button" tabIndex={0}
                            onClick={ap?.onClick}
                            data-tx-apoio-doc={ap?.k}
                            style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            className="tx-h76d8d79"
                          >
                            {ap?.rot}
                          </span>
                          <span role="button" tabIndex={0}
                            onClick={ap?.onCsv}
                            data-tx-apoio-csv={ap?.k}
                            style={{
                              display: ap?.csvD,
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--texto-sec)',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            className="tx-h76d8d79"
                          >
                            Planilha
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '18px 20px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Simulações de rastreabilidade</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                  limite da auditoria: 4 horas do carregamento à descarga
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  {(Array.isArray(v.sims) ? v.sims : []).map((sm, $index) => (
                    <Fragment key={$index}>
                      <div
                        data-tx-sim-item=""
                        style={{ background: 'var(--superficie)', borderRadius: '12px', padding: '9px 12px', fontSize: '13px' }}
                      >
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <b>{sm?.data}</b>
                          <span
                            style={{ marginLeft: 'auto', fontFamily: "'Spline Sans Mono',monospace", color: 'var(--ok)', fontWeight: '600' }}
                          >
                            {sm?.dur}
                          </span>
                        </div>
                        <div style={{ color: 'var(--texto-2)', marginTop: '2px' }}>{sm?.pedido}</div>
                        <div style={{ color: 'var(--texto-apagado)', fontSize: '12px' }}>
                          {sm?.quem}
                          {', '}
                          {sm?.n}
                          {' viagens'}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
