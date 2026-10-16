// Gerado de "SaaS moderno estilo Dribbble/Compartimento v2.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Compartimento extends Tela {
  state = { loading: true };
  componentDidMount() {
    TX.ui.montar(this);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  sbAtivo() {
    const p = TX.placa(this.alvo().placa);
    return p && p.dono === 'propria' ? 'frota' : 'transportadores';
  }
  alvo() {
    const pl = TX.ui.param('placa');
    const pos = TX.ui.param('pos') || 'C1';
    const p = pl && TX.placa(pl);
    return p && p.tipo === 'carreta'
      ? { placa: pl, pos: (p.comps || ['C1']).includes(pos) ? pos : 'C1' }
      : { placa: 'SQT 6B77', pos: 'C1' };
  }
  renderVals() {
    const U = TX.ui,
      F = TX.fmt;
    const a = this.alvo();
    const p = TX.placa(a.placa);
    const conj = TX.db.conjuntos.find((c) => c.carretas.includes(a.placa));
    const propria = p.dono === 'propria';
    const hist = TX.historico(a.placa, a.pos);
    const regT = (r) =>
      ({
        A: ['linear-gradient(135deg,#48c78e,var(--ok))', '#fff'],
        B: ['linear-gradient(135deg,#f1d55a,#e3c235)', '#5b4b05'],
        C: ['linear-gradient(135deg,#f4c15d,var(--aviso-2))', '#fff'],
        D: ['linear-gradient(135deg,#e88a5f,#d06a3c)', '#fff'],
        X: ['linear-gradient(135deg,#e46969,var(--perigo))', '#fff'],
      })[r] || ['var(--borda)', 'var(--texto-apagado)'];
    const key = a.placa + '#' + a.pos;
    const limpezas = TX.db.viagens.flatMap((v) =>
      (v.limpezas || []).filter((l) => l.comp === key).map((l) => Object.assign({ viagem: v.id }, l)),
    );
    const regs = TX.db.viagens.flatMap((v) => (v.regularizacoes || []).filter((r) => r.comp === key));
    const t3 = hist.slice(0, 3);
    const proib = t3.find((h) => h.produto && TX.produto(h.produto).regime === 'X');
    const t1 = t3[0] && t3[0].produto ? TX.produto(t3[0].produto) : null;
    const quarentena = proib && !regs.length;
    const titulo = a.placa + ' ' + a.pos;
    // Viagem de hoje em diante que usa este compartimento e está travada por ele: é onde se regulariza.
    const vReg = quarentena
      ? TX.db.viagens
          .filter(
            (v) =>
              !v.cancelada &&
              v.data >= TX.HOJE &&
              TX.compsDoConjunto(v.conjunto).some((k) => k.key === key) &&
              TX.decidir(v).resultado === 'tecnico',
          )
          .sort((x, y) => (x.data < y.data ? -1 : 1))[0]
      : null;
    const foraBase = t3.some((h) => !h.produto);
    const LIMP = {
      A: 'Sim, com limpeza seca',
      B: 'Sim, depois de lavar com água',
      C: 'Sim, depois de lavar com detergente',
      D: 'Sim, depois de lavar e desinfetar',
    };
    let pode, podeSub, podeDot;
    if (quarentena) {
      pode = 'Não: em quarentena';
      podeSub = TX.produto(proib.produto).nome + ' em ' + F.data(proib.data) + ', carga proibida';
      podeDot = '#ff8a8a';
    } else if (!t3.length) {
      pode = 'Ainda não se sabe';
      podeSub = 'T-3 vazio: a primeira viagem pede as três últimas cargas';
      podeDot = 'var(--aviso-2)';
    } else if (foraBase) {
      pode = 'Ainda não';
      podeSub = 'carga fora da base IDTF no T-3, esperando classificação';
      podeDot = 'var(--aviso-2)';
    } else if (regs.length) {
      pode = LIMP.A;
      podeSub = 'regularizado pela TS1.9, laudo ' + regs[0].laudo;
      podeDot = '#3ddc97';
    } else {
      pode = LIMP[t1.regime];
      podeSub = 'pela última carga: ' + t1.nome.toLowerCase() + ', regime ' + t1.regime;
      podeDot = '#3ddc97';
    }
    const linhas = hist.map((h, i) => {
      const pr = h.produto ? TX.produto(h.produto) : null;
      const r = pr ? pr.regime : null;
      const t = regT(r);
      const lp = limpezas.find((l) => l.em.slice(0, 10) >= h.data);
      const fonte =
        h.fonte === 'viagem'
          ? 'viagem ' + TX.viagem(h.viagem).ordem
          : h.fonte === 'declarada'
            ? 'declarada pelo motorista na ' + TX.viagem(h.viagem).ordem
            : 'registro inicial da frota';
      return {
        t: i < 3 ? 'T-' + (i + 1) : '',
        tVis: i < 3 ? 'visible' : 'hidden',
        tC: r === 'X' ? 'var(--perigo)' : 'var(--primario-2)',
        tBd: r === 'X' ? 'var(--perigo-borda)' : '#cfe3e1',
        op: i < 3 ? '1' : '.62',
        lC: r === 'X' ? 'var(--perigo)' : 'var(--texto-sec)',
        data: F.data(h.data),
        produto: pr ? pr.nome : '"' + h.texto + '"',
        cat: pr ? pr.cat + (pr.racao ? ', ração' : '') : 'fora da base IDTF',
        nc: r === 'X' ? 'var(--perigo)' : 'var(--texto)',
        bg: r === 'X' ? '#fdf8f8' : '#fff',
        r: r === 'X' ? '✕' : r || '?',
        rBg: t[0],
        rC: t[1],
        fonte,
        temHref: !!h.viagem,
        semHref: !h.viagem,
        href: h.viagem ? '/viagem?id=' + h.viagem : '',
        limpeza:
          r === 'A'
            ? 'seca, no checklist'
            : lp
              ? 'regime ' + lp.regime + ', ' + lp.comprovante
              : r === 'X'
                ? 'não resolve'
                : 'sem comprovante',
      };
    });
    return Object.assign({}, U.base(this), {
      titulo,
      modelo: p.modelo + ', CRLV ' + TX.docEstado(p.crlv && p.crlv.validade).rotulo,
      voltarHref: propria ? '/frota' : '/transportadores',
      voltarRot: propria ? 'Frota própria' : 'Transportadores',
      temDono: !propria,
      donoHref: '/transportadores?id=' + p.dono,
      dono: propria ? 'Frota própria' : TX.nomeTransportador(p.dono),
      conjuntoTxt: conj ? 'hoje com o cavalo ' + conj.cavalo : 'sem conjunto',
      pode,
      podeSub,
      podeDot,
      t3: [0, 1, 2].map((i) => {
        const h = t3[i];
        const pr = h && h.produto ? TX.produto(h.produto) : null;
        const r = pr ? pr.regime : null;
        const t = regT(r);
        return {
          k: 'T-' + (i + 1),
          data: h ? F.data(h.data).slice(0, 5) : 'sem dado',
          r: !h ? '' : r === 'X' ? '✕' : r || '?',
          rBg: h ? t[0] : 'rgba(255,255,255,.12)',
          rC: t[1],
          tip: h ? (pr ? pr.nome : h.texto) + ', ' + F.data(h.data) : 'sem carga registrada',
        };
      }),
      quarentena: !!quarentena,
      qTemViagem: !!vReg,
      qHref: vReg ? '/viagem?id=' + vReg.id : '',
      qRot: vReg ? 'Regularizar na ' + vReg.ordem : '',
      qTexto: quarentena
        ? 'Limpeza não tira o compartimento da quarentena. Precisa de inspeção independente e laudo, registrados na viagem pela TS1.9.' +
          (vReg
            ? ' A ' + vReg.ordem + ', de ' + F.data(vReg.data) + ', está travada por isso.'
            : ' Faça na próxima viagem que usar esta carreta.')
        : '',
      heroBg: quarentena
        ? 'linear-gradient(115deg,#3a1219,#6e1f2b 60%,var(--tecnico) 130%)'
        : 'linear-gradient(115deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)',
      linhas,
      vazio: !hist.length,
      temIrmaos: !!conj && TX.compsDoConjunto(conj).length > 1,
      irmaos: conj
        ? TX.compsDoConjunto(conj).map((k) => ({
            n: k.placa + ' ' + k.pos,
            href: '/compartimento?placa=' + encodeURIComponent(k.placa) + '&pos=' + k.pos,
            c: k.key === key ? 'var(--texto)' : 'var(--texto-sec)',
            bg: k.key === key ? '#fff' : 'transparent',
            sh: k.key === key ? '0 1px 4px rgba(9,61,68,.12)' : 'none',
          }))
        : [],
      exportar: () => {
        const e = U.esc;
        const html =
          '<h1>Histórico do compartimento ' +
          e(titulo) +
          '</h1><div class="sub">' +
          e(p.modelo) +
          '. Dono: ' +
          e(propria ? 'frota própria' : TX.nomeTransportador(p.dono)) +
          '.</div><table><tr><th>Data</th><th>Produto</th><th>Regime IDTF</th><th>Origem</th><th>Limpeza</th></tr>' +
          linhas
            .map(
              (l) =>
                '<tr><td class="mono">' +
                e(l.data) +
                '</td><td>' +
                e(l.produto) +
                '</td><td>' +
                e(l.r) +
                '</td><td>' +
                e(l.fonte) +
                '</td><td>' +
                e(l.limpeza) +
                '</td></tr>',
            )
            .join('') +
          '</table>';
        if (U.exportarDocumento('Compartimento ' + titulo, html)) this.avisar('Histórico aberto em outra aba, pronto para imprimir.');
        else this.avisar('O navegador bloqueou a aba nova. Libere pop-ups e tente de novo.');
      },
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Compartimento" data-tela="Compartimento">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '18px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--texto-sec)' }}>
              <A href={v.voltarHref} style={{ color: 'var(--texto-sec)' }}>
                {v.voltarRot}
              </A>
              {v.temDono ? (
                <>
                  <span style={{ color: '#b8c6c4' }}>›</span>
                  <A href={v.donoHref} style={{ color: 'var(--texto-sec)' }}>
                    {v.dono}
                  </A>
                </>
              ) : null}
              <span style={{ color: '#b8c6c4' }}>›</span>
              <span style={{ fontFamily: "'Spline Sans Mono',monospace", color: 'var(--texto)' }}>{v.titulo}</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div role="button" tabIndex={0}
                onClick={v.exportar}
                data-tx-exportar=""
                style={{
                  background: 'var(--primario-3)',
                  color: '#fff',
                  borderRadius: '11px',
                  padding: '9px 16px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
                className="tx-hae10539"
              >
                Exportar histórico
              </div>
            </div>
          </div>
          <div
            data-tx-hero=""
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '22px',
              background: v.heroBg,
              color: '#fff',
              padding: '22px 26px',
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr 1.25fr 1.15fr',
              gap: '22px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.4px', color: 'rgba(255,255,255,.6)' }}>
                COMPARTIMENTO
              </div>
              <div
                style={{
                  fontFamily: "'Spline Sans Mono',monospace",
                  fontSize: '26px',
                  fontWeight: '600',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {v.titulo}
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.75)' }}>{v.modelo}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,.15)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.7)' }}>Dono hoje</div>
              <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '3px' }}>{v.dono}</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.6)' }}>{v.conjuntoTxt}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,.15)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.7)' }}>Pode carregar ração?</div>
              <div
                data-tx-pode=""
                style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '16px', fontWeight: '800', marginTop: '3px' }}
              >
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '99px',
                    background: v.podeDot,
                    boxShadow: '0 0 0 3px rgba(255,255,255,.18)',
                    flex: 'none',
                  }}
                ></span>
                {v.pode}
              </div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.7)', marginTop: '1px' }}>{v.podeSub}</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,.15)', paddingLeft: '20px' }}>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.7)' }}>Três últimas cargas (T-3)</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {(Array.isArray(v.t3) ? v.t3 : []).map((t, $index) => (
                  <Fragment key={$index}>
                    <div
                      title={t?.tip}
                      style={{
                        flex: '1',
                        minWidth: '0',
                        background: 'rgba(255,255,255,.08)',
                        border: '1px solid rgba(255,255,255,.12)',
                        borderRadius: '11px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                      }}
                    >
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '7px',
                          background: t?.rBg,
                          color: t?.rC,
                          fontSize: '11px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 'none',
                        }}
                      >
                        {t?.r}
                      </span>
                      <div style={{ minWidth: '0' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: '800', color: 'rgba(255,255,255,.6)' }}>{t?.k}</div>
                        <div style={{ fontSize: '11px', fontFamily: "'Spline Sans Mono',monospace", whiteSpace: 'nowrap' }}>{t?.data}</div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            {v.quarentena ? (
              <>
                <div
                  data-tx-quarentena=""
                  style={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderTop: '1px solid rgba(255,255,255,.15)',
                    paddingTop: '16px',
                  }}
                >
                  <div style={{ flex: '1', fontSize: '13px', lineHeight: '1.55', color: 'rgba(255,255,255,.88)' }}>{v.qTexto}</div>
                  {v.qTemViagem ? (
                    <>
                      <A
                        href={v.qHref}
                        data-tx-regularizar-viagem=""
                        style={{
                          background: 'var(--painel)',
                          color: '#6e1f2b',
                          borderRadius: '99px',
                          padding: '10px 18px',
                          fontSize: '13px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap',
                        }}
                        className="tx-haf27d80"
                      >
                        {v.qRot}
                        {' →'}
                      </A>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
          <div style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '16px', fontWeight: '800' }}>Histórico de cargas</div>
              <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)' }}>
                a mais recente em cima; as três primeiras são o T-3 da próxima viagem
              </div>
              {v.temIrmaos ? (
                <>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--texto-apagado)', fontWeight: '600' }}>No mesmo conjunto</span>
                    <div style={{ display: 'flex', background: 'var(--superficie-2)', borderRadius: '11px', padding: '3px', gap: '2px' }}>
                      {(Array.isArray(v.irmaos) ? v.irmaos : []).map((ir, $index) => (
                        <Fragment key={$index}>
                          <A
                            href={ir?.href}
                            data-tx-irmao={ir?.n}
                            style={{
                              fontFamily: "'Spline Sans Mono',monospace",
                              fontSize: '12px',
                              fontWeight: '600',
                              borderRadius: '9px',
                              padding: '5px 11px',
                              color: ir?.c,
                              background: ir?.bg,
                              boxShadow: ir?.sh,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {ir?.n}
                          </A>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '46px 96px 1.4fr 70px 1.3fr 1fr',
                gap: '12px',
                padding: '14px 4px 8px',
                fontSize: '10.5px',
                fontWeight: '800',
                letterSpacing: '.7px',
                color: 'var(--texto-apagado)',
                borderBottom: '1px solid var(--borda-suave)',
              }}
            >
              <span></span>
              <span>DATA</span>
              <span>PRODUTO</span>
              <span>REGIME</span>
              <span>ORIGEM DO REGISTRO</span>
              <span>LIMPEZA</span>
            </div>
            {(Array.isArray(v.linhas) ? v.linhas : []).map((l, $index) => (
              <Fragment key={$index}>
                <div
                  data-tx-carga=""
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '46px 96px 1.4fr 70px 1.3fr 1fr',
                    gap: '12px',
                    padding: '11px 4px',
                    borderBottom: '1px solid var(--superficie-2)',
                    alignItems: 'center',
                    background: l?.bg,
                    opacity: l?.op,
                  }}
                >
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      color: l?.tC,
                      border: `1px solid ${l?.tBd ?? ''}`,
                      borderRadius: '7px',
                      padding: '2px 0',
                      textAlign: 'center',
                      visibility: l?.tVis,
                    }}
                  >
                    {l?.t}
                  </span>
                  <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '12.5px' }}>{l?.data}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: l?.nc }}>{l?.produto}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--texto-apagado)' }}>{l?.cat}</div>
                  </div>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: l?.rBg,
                      color: l?.rC,
                      fontSize: '11.5px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {l?.r}
                  </span>
                  <div style={{ fontSize: '12.5px' }}>
                    {l?.temHref ? (
                      <>
                        <A href={l?.href} style={{ fontWeight: '700' }}>
                          {l?.fonte}
                        </A>
                      </>
                    ) : null}
                    {l?.semHref ? (
                      <>
                        <span style={{ color: 'var(--texto-sec)' }}>{l?.fonte}</span>
                      </>
                    ) : null}
                  </div>
                  <span style={{ fontSize: '12px', color: l?.lC }}>{l?.limpeza}</span>
                </div>
              </Fragment>
            ))}
            {v.vazio ? (
              <>
                <div style={{ padding: '28px 4px', fontSize: '13px', color: 'var(--texto-sec)' }}>
                  Nenhuma carga registrada neste compartimento. O T-3 nasce vazio e a primeira viagem pede as três últimas cargas.
                </div>
              </>
            ) : null}
            <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '12px', lineHeight: '1.55' }}>
              A limpeza exigida antes de ração sai da carga anterior, pela base IDTF. Carga proibida no T-3 põe o compartimento em
              quarentena: limpeza não resolve, só a regularização da TS1.9 registrada na viagem.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
