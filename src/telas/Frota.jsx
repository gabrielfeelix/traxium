// Gerado de "SaaS moderno estilo Dribbble/Frota.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Frota extends Tela {
  state = { loading: true, modal: null };
  componentDidMount() {
    TX.ui.montar(this);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const cs = TX.db.conjuntos.filter((c) => c.dono === 'propria');
    const no = cs.filter((c) => c.escopo && c.escopo.no);
    const regT = (r) =>
      ({
        A: ['linear-gradient(135deg,#48c78e,var(--ok))', '#fff'],
        B: ['linear-gradient(135deg,#f1d55a,#e3c235)', '#5b4b05'],
        C: ['linear-gradient(135deg,#f4c15d,var(--aviso-2))', '#fff'],
        D: ['linear-gradient(135deg,#e88a5f,#d06a3c)', '#fff'],
        X: ['linear-gradient(135deg,#e46969,var(--perigo))', '#fff'],
      })[r] || ['var(--borda)', 'var(--texto-apagado)'];
    const venc = TX.vencimentos(30).filter((x) => x.dono.startsWith('Frota própria'));
    // No escopo primeiro; cada grupo ganha um título no primeiro conjunto.
    const lista = cs.filter((c) => c.escopo && c.escopo.no).concat(cs.filter((c) => !(c.escopo && c.escopo.no)));
    const nv30 = TX.db.viagens.filter(
      (v) => v.tipo === 'propria' && !v.cancelada && v.data >= TX.addDias(TX.HOJE, -30) && v.data <= TX.HOJE,
    ).length;
    const alvo = s.modal ? TX.conjunto(s.modal) : null;
    const tirar = alvo && alvo.escopo && alvo.escopo.no;
    const ok = !tirar || (s.fMotivo || '').trim().length >= 10;
    const c = U.cta(ok);
    return Object.assign({}, U.base(this), {
      subtitulo:
        cs.length +
        ' conjuntos, ' +
        no.length +
        ' no escopo GMP+. ' +
        nv30 +
        ' viagens nos últimos 30 dias. ' +
        (venc.length ? '' : 'Nenhuma CNH ou CRLV vencendo em 30 dias.'),
      temVenc: venc.length > 0,
      vencTxt:
        venc.length +
        (venc.length === 1 ? ' documento' : ' documentos') +
        ' da frota vencendo em até 30 dias: ' +
        venc
          .slice(0, 3)
          .map((x) => x.tipo + ' ' + x.ref)
          .join(', ') +
        (venc.length > 3 ? ' e mais ' + (venc.length - 3) : '') +
        '.',
      conjuntos: lista.map((cj, i) => {
        const dentro = !!(cj.escopo && cj.escopo.no);
        const primeiro = i === 0 || dentro !== !!(lista[i - 1].escopo && lista[i - 1].escopo.no);
        const mot = TX.pessoa(cj.motorista);
        const de = TX.docEstado(mot.cnh && mot.cnh.validade);
        const esc = cj.escopo || {};
        const treinos = TX.db.treinamentos.filter((t) => t.participantes.includes(mot.id));
        return {
          id: cj.id,
          op: esc.no ? '1' : '.85',
          cabD: primeiro ? 'flex' : 'none',
          cabPad: i === 0 ? '0 4px 2px' : '14px 4px 2px',
          cab: dentro ? 'No escopo GMP+' : 'Fora do escopo',
          cabQ: dentro ? no.length : cs.length - no.length,
          cabSub: dentro ? 'podem fazer viagem assegurada' : 'só carga não assegurada; incluir exige a data de entrada',
          modelo: TX.placa(cj.carretas[0]).modelo,
          filial: TX.filial(cj.filial).nome,
          placas: TX.placasDoConjunto(cj).map((p, i) => ({ p, bg: i === 0 ? 'var(--texto)' : 'var(--superficie-2)', c: i === 0 ? '#fff' : 'var(--texto)' })),
          motorista: mot.nome,
          ini: F.iniciais(mot.nome),
          g1: mot.g1,
          g2: mot.g2,
          cnh: 'CNH ' + de.rotulo,
          cnhC: de.estado === 'ok' ? 'var(--texto-sec)' : 'var(--aviso)',
          treinos:
            treinos.length + ' treinamentos registrados, último ' + (treinos.length ? F.curta(treinos[treinos.length - 1].data) : 'nenhum'),
          comps: TX.compsDoConjunto(cj).map((k) => ({
            nome: k.placa + ' ' + k.pos,
            href: '/compartimento?placa=' + encodeURIComponent(k.placa) + '&pos=' + k.pos,
            cargas: TX.historico(k.placa, k.pos)
              .slice(0, 3)
              .map((h) => {
                const p = TX.produto(h.produto);
                const t = regT(p ? p.regime : null);
                return {
                  r: p ? (p.regime === 'X' ? '✕' : p.regime) : '?',
                  n: p ? p.nome.split(' ')[0] : h.texto,
                  bg: t[0],
                  c: t[1],
                  tip: F.data(h.data) + ', ' + (p ? p.nome : h.texto),
                };
              }),
          })),
          esc: esc.no ? 'No escopo GMP+' : 'Fora do escopo',
          escC: esc.no ? 'var(--ok)' : 'var(--texto-apagado)',
          escDot: esc.no ? U.tom('ok').dot : U.tom('na').dot,
          escRing: esc.no ? U.tom('ok').ring : U.tom('na').ring,
          escSub: esc.no ? 'desde ' + F.data(esc.desde) : esc.motivo || 'nunca entrou',
          altRot: esc.no ? 'Tirar do escopo' : 'Incluir no escopo',
          altC: esc.no ? 'var(--perigo)' : 'var(--primario-2)',
          alternar: () => this.setState({ modal: cj.id, fMotivo: '' }),
        };
      }),
      mAberto: !!s.modal,
      fecharModal: () => this.setState({ modal: null }),
      pararClique: (e) => e.stopPropagation(),
      mTitulo: tirar ? 'Tirar ' + (alvo && alvo.cavalo) + ' do escopo GMP+' : 'Incluir ' + (alvo && alvo.cavalo) + ' no escopo GMP+',
      mSub: tirar
        ? 'A partir de hoje o conjunto não faz viagem assegurada. As viagens já feitas continuam com o escopo da data delas.'
        : 'A partir de hoje o conjunto pode fazer viagem assegurada. A data de entrada fica registrada para a auditoria.',
      fMotivo: s.fMotivo || '',
      onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
      mCta: tirar ? 'Tirar do escopo' : 'Incluir no escopo',
      confirmar: () => {
        if (!ok || !alvo) return;
        TX.fazer('escopoFrota', { conjunto: alvo.id, no: !tirar, motivo: (s.fMotivo || '').trim() || 'inclusão no escopo' });
        this.setState({ modal: null });
        this.avisar(alvo.cavalo + (tirar ? ' saiu do escopo GMP+.' : ' entrou no escopo GMP+.'));
      },
      ctaBg: c.bg,
      ctaC: c.c,
      ctaSh: c.sh,
      ctaCur: c.cur,
      exportarEscopo: () => {
        const e = U.esc;
        const html =
          '<h1>Frota própria no escopo GMP+</h1><div class="sub">' +
          e(TX.db.tenant.nome) +
          ', posição em ' +
          F.data(TX.HOJE) +
          '.</div><table><tr><th>Cavalo</th><th>Carretas e compartimentos</th><th>Filial</th><th>Motorista</th><th>No escopo desde</th></tr>' +
          no
            .map(
              (cj) =>
                '<tr><td class="mono">' +
                e(cj.cavalo) +
                '</td><td class="mono">' +
                e(
                  TX.compsDoConjunto(cj)
                    .map((k) => k.placa + ' ' + k.pos)
                    .join(', '),
                ) +
                '</td><td>' +
                e(TX.filial(cj.filial).nome) +
                '</td><td>' +
                e(TX.pessoa(cj.motorista).nome) +
                '</td><td>' +
                e(F.data(cj.escopo.desde)) +
                '</td></tr>',
            )
            .join('') +
          '</table><h2>Fora do escopo</h2><table>' +
          cs
            .filter((cj) => !(cj.escopo && cj.escopo.no))
            .map(
              (cj) =>
                '<tr><td class="mono">' + e(TX.placasDoConjunto(cj).join(', ')) + '</td><td>' + e(cj.escopo.motivo || '') + '</td></tr>',
            )
            .join('') +
          '</table>';
        if (U.exportarDocumento('Frota no escopo GMP+', html)) this.avisar('Lista do escopo aberta em outra aba, pronta para imprimir.');
        else this.avisar('O navegador bloqueou a aba nova. Libere pop-ups e tente de novo.');
      },
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Frota própria" data-tela="Frota">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>Frota própria</div>
              <div style={{ fontSize: '13.5px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.subtitulo}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={v.exportarEscopo}
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
                Exportar lista do escopo
              </div>
            </div>
          </div>
          {v.temVenc ? (
            <>
              <div
                data-tx-venc-frota=""
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderLeft: '3px solid var(--aviso-2)',
                  borderRadius: '14px',
                  padding: '11px 16px',
                  fontSize: '13px',
                  color: 'var(--texto-2)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '99px',
                    background: 'linear-gradient(135deg,#f4c15d,var(--aviso-2))',
                    flex: 'none',
                  }}
                ></span>
                <span style={{ flex: '1' }}>{v.vencTxt}</span>
              </div>
            </>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(Array.isArray(v.conjuntos) ? v.conjuntos : []).map((cj, $index) => (
              <Fragment key={$index}>
                <div style={{ display: cj?.cabD, alignItems: 'center', gap: '9px', padding: cj?.cabPad }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '99px',
                      background: cj?.escDot,
                      boxShadow: `0 0 0 3px ${cj?.escRing ?? ''}`,
                    }}
                  ></span>
                  <span style={{ fontSize: '15px', fontWeight: '800' }}>{cj?.cab}</span>
                  <span style={{ fontFamily: "'Spline Sans Mono',monospace", fontSize: '13px', fontWeight: '600', color: 'var(--texto-sec)' }}>
                    {cj?.cabQ}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--texto-apagado)' }}>{cj?.cabSub}</span>
                </div>
                <div
                  data-tx-conjunto={cj?.id}
                  style={{
                    background: 'var(--painel)',
                    border: '1px solid var(--borda)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(170px,220px) minmax(0,.8fr) minmax(0,1.6fr) 160px',
                    gap: '16px',
                    alignItems: 'center',
                    opacity: cj?.op,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(Array.isArray(cj?.placas) ? cj?.placas : []).map((pl, $index) => (
                        <Fragment key={$index}>
                          <span
                            style={{
                              fontFamily: "'Spline Sans Mono',monospace",
                              fontSize: '13px',
                              fontWeight: '600',
                              background: pl?.bg,
                              color: pl?.c,
                              borderRadius: '8px',
                              padding: '3px 9px',
                            }}
                          >
                            {pl?.p}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--texto-sec)', marginTop: '6px' }}>
                      {cj?.modelo}
                      {', base '}
                      {cj?.filial}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '0' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '99px',
                        flex: 'none',
                        background: `linear-gradient(135deg,${cj?.g1 ?? ''},${cj?.g2 ?? ''})`,
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cj?.ini}
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '700' }}>{cj?.motorista}</div>
                      <div style={{ fontSize: '11.5px', color: cj?.cnhC }}>{cj?.cnh}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--texto-apagado)' }}>{cj?.treinos}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(Array.isArray(cj?.comps) ? cj?.comps : []).map((cp, $index) => (
                      <Fragment key={$index}>
                        <A
                          href={cp?.href}
                          title={`Ver o histórico de cargas de ${cp?.nome ?? ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'inherit',
                            border: '1px solid var(--borda-suave)',
                            borderRadius: '11px',
                            padding: '6px 10px',
                            minWidth: '0',
                            overflow: 'hidden',
                          }}
                          className="tx-h30bbaa9"
                        >
                          <span
                            style={{
                              fontFamily: "'Spline Sans Mono',monospace",
                              fontSize: '11.5px',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                              flex: 'none',
                            }}
                          >
                            {cp?.nome}
                          </span>
                          {(Array.isArray(cp?.cargas) ? cp?.cargas : []).map((cg, $index) => (
                            <Fragment key={$index}>
                              <span
                                title={cg?.tip}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  fontSize: '11.5px',
                                  color: 'var(--texto-2)',
                                  whiteSpace: 'nowrap',
                                  minWidth: '0',
                                  overflow: 'hidden',
                                }}
                              >
                                <span
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    flex: 'none',
                                    borderRadius: '5px',
                                    background: cg?.bg,
                                    color: cg?.c,
                                    fontSize: '9.5px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {cg?.r}
                                </span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{cg?.n}</span>
                              </span>
                            </Fragment>
                          ))}
                          <span
                            style={{
                              marginLeft: 'auto',
                              fontSize: '13px',
                              fontWeight: '800',
                              color: 'var(--primario-2)',
                              flex: 'none',
                              paddingLeft: '2px',
                            }}
                          >
                            →
                          </span>
                        </A>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        color: cj?.escC,
                      }}
                    >
                      <span
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '99px',
                          background: cj?.escDot,
                          boxShadow: `0 0 0 3px ${cj?.escRing ?? ''}`,
                        }}
                      ></span>
                      {cj?.esc}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--texto-apagado)', textAlign: 'right' }}>{cj?.escSub}</span>
                    <span
                      onClick={cj?.alternar}
                      data-tx-escopo={cj?.id}
                      style={{ fontSize: '12px', fontWeight: '800', color: cj?.altC, cursor: 'pointer' }}
                    >
                      {cj?.altRot}
                    </span>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', lineHeight: '1.55', maxWidth: '900px' }}>
            Só os conjuntos no escopo GMP+ podem fazer viagem assegurada; o veículo diz se está ou não e desde quando. Conjuntos de TAC e
            ETC ficam em Transportadores. O histórico de cargas pertence ao compartimento (placa da carreta e posição) e continua quando o
            cavalo muda.
          </div>
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
                onClick={v.pararClique}
                data-tx-modal="escopo"
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: '520px',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.mTitulo}</div>
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
                <div style={{ fontSize: '12.5px', color: 'var(--texto-sec)', marginTop: '4px', lineHeight: '1.55' }}>{v.mSub}</div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '14px' }}>
                  MOTIVO (MÍNIMO 10 CARACTERES)
                </div>
                <input
                  value={v.fMotivo ?? ''}
                  onChange={v.onMotivo}
                  data-tx-campo="motivo"
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    border: '1px solid var(--borda-campo)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
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
                    onClick={v.confirmar}
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
