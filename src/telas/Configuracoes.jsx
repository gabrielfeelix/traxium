// Gerado de "SaaS moderno estilo Dribbble/Configuracoes v2.dc.html" por scripts/converter-dc.mjs.
'use client';
import { Fragment } from 'react';
import { TX, Tela, A, css } from '@/lib/tx/tela';

export default class Configuracoes extends Tela {
  state = { loading: true, modal: null, secao: 'usuarios' };
  componentDidMount() {
    TX.ui.montar(this);
    // A seção ativa acompanha a rolagem: a última cujo topo passou da linha do header.
    this._spy = () => {
      if (Date.now() < (this._spyPausa || 0)) return;
      const secs = Array.from(document.querySelectorAll('[data-tx-sec]'));
      let at = secs.length ? secs[0].dataset.txSec : 'usuarios';
      secs.forEach((el) => {
        if (el.getBoundingClientRect().top <= 140) at = el.dataset.txSec;
      });
      const r = this._rolagem;
      if (r && r.scrollTop + r.clientHeight >= r.scrollHeight - 4 && secs.length) at = secs[secs.length - 1].dataset.txSec;
      if (at !== this.state.secao) this.setState({ secao: at });
    };
    // Quem rola é a área de conteúdo da moldura, não a janela.
    this._rolagem = TX.ui.rolagem();
    this._rolagem.addEventListener('scroll', this._spy, { passive: true });
  }
  componentWillUnmount() {
    if (this._rolagem) this._rolagem.removeEventListener('scroll', this._spy);
    super.componentWillUnmount();
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      u = TX.sessao(),
      db = TX.db;
    const SEC = [
      ['usuarios', 'Usuários e papéis'],
      ['alcadas', 'Alçadas'],
      ['regras', 'Regras'],
      ['modelos', 'Modelos'],
      ['lgpd', 'LGPD e retenção'],
      ['integracoes', 'Integrações'],
      ['dados', 'Dados do protótipo'],
    ];
    const regra = s.modal && s.modal.regra ? db.config.regras.find((r) => r.k === s.modal.regra) : null;
    const reset = s.modal && s.modal.reset,
      conv = s.modal && s.modal.convite;
    const PAPEIS = [
      ['afretador', 'Afretador', 'Monta e acompanha as viagens de uma filial. Sem alçada de liberação.'],
      ['qualidade', 'Gestor da qualidade', 'Todas as filiais. Libera pendência corrigível.'],
      ['frota', 'Gestor de frota', 'Todas as filiais. Cuida da frota própria e dos documentos dela.'],
      ['consultoria', 'Consultoria externa', 'Todas as filiais, só leitura e exportação.'],
    ];
    const cv = s.cv || {},
      emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((cv.email || '').trim()),
      emailNovo = !db.usuarios
        .concat(db.convitesUsuario.filter((x) => x.estado === 'enviado'))
        .some((x) => x.email.toLowerCase() === (cv.email || '').trim().toLowerCase());
    const okC = (cv.nome || '').trim().length >= 5 && emailOk && emailNovo && !!cv.papel && (cv.papel !== 'afretador' || !!cv.filial);
    const okM = reset || (conv ? okC : (s.fMotivo || '').trim().length >= 10);
    const c = reset ? U.ctaPerigo(true) : U.cta(okM);
    const setCv = (o) => this.setState({ cv: Object.assign({}, cv, o) });
    const todas = db.filiais.map((f) => f.id);
    return Object.assign({}, U.base(this), {
      secoes: SEC.map(([k, n]) => ({
        k,
        n,
        c: s.secao === k ? 'var(--primario-2)' : 'var(--texto-2)',
        bg: s.secao === k ? 'var(--primario-fraco)' : 'transparent',
        onClick: () => {
          this._spyPausa = Date.now() + 900;
          this.setState({ secao: k });
          const el = document.getElementById('sec-' + k);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      })),
      abrirConvite: () => this.setState({ modal: { convite: true }, cv: {} }),
      convites: db.convitesUsuario
        .filter((x) => x.estado === 'enviado')
        .map((x) => {
          const p = PAPEIS.find((pp) => pp[0] === x.papel);
          return {
            id: x.id,
            nome: x.nome,
            email: x.email,
            ini: F.iniciais(x.nome),
            cargo: p ? p[1] : x.papel,
            estado: 'convite enviado ' + F.quando(x.em) + ', sem primeiro acesso',
            escopo:
              x.filiais.length === db.filiais.length ? 'todas as filiais' : 'filial ' + x.filiais.map((f) => TX.filial(f).nome).join(', '),
            cancelar: () => {
              TX.fazer('cancelarConviteUsuario', { convite: x.id });
              this.avisar('Convite de ' + x.nome + ' cancelado. O link enviado deixa de valer.');
            },
          };
        }),
      usuarios: db.usuarios.map((x) => ({
        id: x.id,
        nome: x.nome,
        ini: F.iniciais(x.nome),
        g1: x.g1,
        g2: x.g2,
        email: x.email,
        cargo: x.cargo,
        escopo: x.filiais.length === 4 ? 'todas as filiais' : 'filial ' + x.filiais.map((f) => TX.filial(f).nome).join(', '),
        er: x.id === u.id ? 'você está aqui' : 'Entrar como',
        ec: x.id === u.id ? 'var(--texto-apagado)' : 'var(--primario-2)',
        entrar: () => {
          if (x.id === u.id) return;
          TX.entrarComo(x.id);
          this.avisar('Agora você está como ' + x.nome + '.');
        },
      })),
      alcadas: db.alcadas.map((a) => ({
        n: a.n,
        libera: a.libera,
        dot: a.k === 'tecnico' ? U.tom('tecnico').dot : a.k === 'direcao' ? U.tom('autoridade').dot : U.tom('ok').dot,
        quem:
          a.k === 'tecnico'
            ? 'nenhum usuário'
            : db.usuarios
                .filter((x) => x.alcada === a.k)
                .map((x) => x.nome)
                .join(', '),
      })),
      regras: db.config.regras.map((r) => ({
        k: r.k,
        n: r.n,
        base: 'Base: ' + r.base,
        sub: r.travada
          ? 'travada em bloqueio pela norma'
          : r.alteradaEm
            ? 'alterada por ' + TX.usuario(r.alteradaPor).nome + ' ' + F.quando(r.alteradaEm) + ': ' + r.motivo
            : r.piso === 'alerta'
              ? 'regra interna: pode passar a só alertar'
              : 'regra interna, fica em bloqueio',
        classes: ['bloqueio', 'alerta'].map((cl) => {
          const on = r.classe === cl;
          const pode = !r.travada && !on && (cl === 'bloqueio' || r.piso === 'alerta');
          return {
            k: cl,
            n: cl === 'bloqueio' ? 'Bloqueia' : 'Só alerta',
            bd: on ? 'var(--texto)' : 'var(--borda-campo)',
            bg: on ? 'var(--texto)' : '#fff',
            c: on ? '#fff' : 'var(--texto-2)',
            cur: pode ? 'pointer' : 'default',
            op: r.travada && !on ? '.4' : '1',
            onClick: () => {
              if (r.travada) {
                this.avisar('Regra de norma: fica em bloqueio.');
                return;
              }
              if (pode) this.setState({ modal: { regra: r.k, classe: cl }, fMotivo: '' });
            },
          };
        }),
      })),
      modelos: [
        { n: 'Declaração positiva do CT-e', v: 'texto fixo', txt: TX.DECLARACAO_CTE, font: "'Spline Sans Mono',monospace" },
        { n: db.termo.titulo, v: 'versão ' + db.termo.versao, txt: db.termo.texto, font: 'inherit' },
        {
          n: 'Checklist do compartimento',
          v: '5 itens, interior é crítico',
          txt: TX.ITENS_CHECKLIST.map((i) => i.n + ': ' + i.pergunta).join(' '),
          font: 'inherit',
        },
        { n: 'Mensagem do link ao motorista', v: 'WhatsApp do afretador', txt: TX.mensagemLink(TX.viagem('VG-3122')), font: 'inherit' },
      ].map((m) =>
        Object.assign(m, {
          copiar: () => {
            U.copiar(m.txt);
            this.avisar('Modelo copiado: ' + m.n.toLowerCase() + '.');
          },
        }),
      ),
      lgpd: [
        { l: 'Base legal', v: db.config.lgpd.base },
        { l: 'Finalidade', v: db.config.lgpd.finalidade },
        { l: 'Retenção', v: db.config.retencaoAnos + ' anos após a viagem (mínimo da norma: 3 anos)' },
      ],
      integracoes: db.config.integracoes.map((i) => ({
        n: i.n,
        sub: i.sub,
        e: i.estado === 'ativo' ? 'ativa' : 'importação manual',
        c: i.estado === 'ativo' ? 'var(--ok)' : 'var(--aviso)',
        dot: i.estado === 'ativo' ? U.tom('ok').dot : U.tom('falta').dot,
      })),
      dadosTxt:
        'Tudo o que foi feito nas telas fica gravado neste navegador como ' +
        TX.ops.length +
        ' operações sobre a semente (30 viagens, 4 filiais). Voltar à semente apaga só essas operações.',
      abrirReset: () => this.setState({ modal: { reset: true } }),
      mConvite: !!conv,
      cvNome: cv.nome || '',
      cvEmail: cv.email || '',
      onCvNome: (e) => setCv({ nome: e.target.value }),
      onCvEmail: (e) => setCv({ email: e.target.value }),
      cvPapeis: PAPEIS.map(([k, n, sub]) =>
        Object.assign(
          { k, n, sub, onClick: () => setCv({ papel: k, filial: k === 'afretador' ? cv.filial : null }) },
          U.sel(cv.papel === k, true),
        ),
      ),
      cvTemFilial: cv.papel === 'afretador',
      cvFiliais: db.filiais.map((f) =>
        Object.assign({ k: f.id, n: f.nome, onClick: () => setCv({ filial: f.id }) }, U.chip(cv.filial === f.id)),
      ),
      mAberto: !!s.modal,
      mK: reset ? 'reset' : conv ? 'convite' : 'regra',
      fecharModal: () => this.setState({ modal: null }),
      pararClique: (e) => e.stopPropagation(),
      mTitulo: reset ? 'Voltar à semente' : conv ? 'Convidar usuário' : 'Mudar a classe da regra',
      mSub: conv
        ? cv.email && emailOk && !emailNovo
          ? 'Esse e-mail já tem acesso ou convite pendente.'
          : 'A pessoa recebe um link por e-mail, cria a senha e entra com o papel escolhido. Até o primeiro acesso, o convite fica na lista e pode ser cancelado.'
        : reset
          ? 'Apaga as ' +
            TX.ops.length +
            ' operações feitas neste navegador e volta às 30 viagens iniciais. Usado para repetir a demonstração.'
          : regra
            ? '"' +
              regra.n +
              '" passa a ' +
              (s.modal.classe === 'alerta' ? 'só alertar: a viagem não trava por ela, mas o aviso fica escrito.' : 'bloquear a viagem.') +
              ' Decisões já registradas não mudam.'
            : '',
      mTemMotivo: !reset && !conv,
      fMotivo: s.fMotivo || '',
      onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
      mCta: reset ? 'Voltar à semente' : conv ? 'Enviar convite' : 'Mudar regra',
      ctaBg: c.bg,
      ctaC: c.c,
      ctaSh: c.sh,
      ctaCur: c.cur,
      confirmar: () => {
        if (!okM) return;
        if (conv) {
          TX.fazer('convidarUsuario', {
            nome: cv.nome.trim(),
            email: cv.email.trim().toLowerCase(),
            papel: cv.papel,
            filiais: cv.papel === 'afretador' ? [cv.filial] : todas,
          });
          this.setState({ modal: null });
          this.avisar('Convite enviado para ' + cv.email.trim().toLowerCase() + '.');
          return;
        }
        if (reset) {
          TX.reset();
          this.setState({ modal: null });
          this.avisar('Dados voltaram à semente.');
          return;
        }
        TX.fazer('classeRegra', { regra: regra.k, classe: s.modal.classe, motivo: s.fMotivo.trim() });
        this.setState({ modal: null });
        this.avisar('Regra alterada. As viagens abertas foram reavaliadas.');
      },
    });
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Configurações" data-tela="Configuracoes">
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>Configurações</div>
              <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>
                Quem acessa, quem assina e o que trava a viagem. Mudar uma regra hoje não altera decisão já registrada.
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>
            <div
              style={{
                position: 'sticky',
                top: '24px',
                background: 'var(--painel)',
                border: '1px solid var(--borda)',
                borderRadius: '18px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {(Array.isArray(v.secoes) ? v.secoes : []).map((sc, $index) => (
                <Fragment key={$index}>
                  <span role="button" tabIndex={0}
                    onClick={sc?.onClick}
                    data-tx-secao={sc?.k}
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: sc?.c,
                      background: sc?.bg,
                    }}
                  >
                    {sc?.n}
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                id="sec-usuarios"
                data-tx-sec="usuarios"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>Usuários e papéis</div>
                  <span role="button" tabIndex={0}
                    onClick={v.abrirConvite}
                    data-tx-convidar=""
                    style={{
                      marginLeft: 'auto',
                      background: 'linear-gradient(135deg,var(--primario),var(--azul))',
                      color: '#fff',
                      borderRadius: '99px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 6px 14px rgba(18,118,112,.25)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Convidar usuário
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                  O papel define o escopo de filiais e a alçada. Na demonstração, "Entrar como" troca o usuário da sessão.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                  {(Array.isArray(v.usuarios) ? v.usuarios : []).map((us, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '38px 1.3fr 1.3fr 1.2fr 150px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px 4px',
                          borderBottom: '1px solid var(--superficie-2)',
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '99px',
                            background: `linear-gradient(135deg,${us?.g1 ?? ''},${us?.g2 ?? ''})`,
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {us?.ini}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700' }}>{us?.nome}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{us?.email}</div>
                        </div>
                        <span style={{ fontSize: '13px' }}>{us?.cargo}</span>
                        <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{us?.escopo}</span>
                        <span role="button" tabIndex={0}
                          onClick={us?.entrar}
                          data-tx-entrar-como={us?.id}
                          style={{ fontSize: '12px', fontWeight: '800', color: us?.ec, cursor: 'pointer', textAlign: 'right' }}
                        >
                          {us?.er}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  {(Array.isArray(v.convites) ? v.convites : []).map((cv, $index) => (
                    <Fragment key={$index}>
                      <div
                        data-tx-convite={cv?.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '38px 1.3fr 1.3fr 1.2fr 150px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '10px 4px',
                          borderBottom: '1px solid var(--superficie-2)',
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '99px',
                            border: '1.5px dashed #b9c9c6',
                            color: 'var(--texto-apagado)',
                            fontSize: '12px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {cv?.ini}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700' }}>{cv?.nome}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{cv?.email}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '13px' }}>{cv?.cargo}</div>
                          <div style={{ fontSize: '12px', color: 'var(--aviso)', fontWeight: '700' }}>{cv?.estado}</div>
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--texto-sec)' }}>{cv?.escopo}</span>
                        <span role="button" tabIndex={0}
                          onClick={cv?.cancelar}
                          data-tx-cancelar-convite={cv?.id}
                          style={{ fontSize: '12px', fontWeight: '800', color: 'var(--perigo)', cursor: 'pointer', textAlign: 'right' }}
                        >
                          Cancelar convite
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-alcadas"
                data-tx-sec="alcadas"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Alçadas de liberação</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                  Três alçadas. Liberação por autoridade exige o registro de 9 campos e o motor continua reprovando.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '12px' }}>
                  {(Array.isArray(v.alcadas) ? v.alcadas : []).map((al, $index) => (
                    <Fragment key={$index}>
                      <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '15px', padding: '13px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '9px', height: '9px', borderRadius: '99px', background: al?.dot }}></span>
                          <b style={{ fontSize: '14px' }}>{al?.n}</b>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--texto-2)', marginTop: '6px', lineHeight: '1.5' }}>{al?.libera}</div>
                        <div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '6px' }}>{al?.quem}</div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-regras"
                data-tx-sec="regras"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Regras</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px' }}>
                  As regras de norma ficam travadas em bloqueio. As internas podem passar a só alertar, com motivo registrado.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                  {(Array.isArray(v.regras) ? v.regras : []).map((rg, $index) => (
                    <Fragment key={$index}>
                      <div
                        data-tx-regra={rg?.k}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.6fr 1fr 210px',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '11px 4px',
                          borderBottom: '1px solid var(--superficie-2)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700' }}>{rg?.n}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{rg?.sub}</div>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{rg?.base}</span>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {(Array.isArray(rg?.classes) ? rg?.classes : []).map((cl, $index) => (
                            <Fragment key={$index}>
                              <span role="button" tabIndex={0}
                                onClick={cl?.onClick}
                                data-tx-classe={cl?.k}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '5px 12px',
                                  cursor: cl?.cur,
                                  border: `1.5px solid ${cl?.bd ?? ''}`,
                                  background: cl?.bg,
                                  color: cl?.c,
                                  opacity: cl?.op,
                                }}
                              >
                                {cl?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-modelos"
                data-tx-sec="modelos"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Modelos</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  {(Array.isArray(v.modelos) ? v.modelos : []).map((md, $index) => (
                    <Fragment key={$index}>
                      <div style={{ border: '1px solid var(--borda-suave)', borderRadius: '15px', padding: '13px 15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <b style={{ fontSize: '14px' }}>{md?.n}</b>
                          <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--texto-apagado)' }}>{md?.v}</span>
                          <span role="button" tabIndex={0}
                            onClick={md?.copiar}
                            style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '800', color: 'var(--primario-2)', cursor: 'pointer' }}
                          >
                            Copiar
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--texto-2)', marginTop: '6px', lineHeight: '1.5', fontFamily: md?.font }}>
                          {md?.txt}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-lgpd"
                data-tx-sec="lgpd"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>LGPD e retenção</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '12px' }}>
                  {(Array.isArray(v.lgpd) ? v.lgpd : []).map((lg, $index) => (
                    <Fragment key={$index}>
                      <div style={{ background: 'var(--superficie)', borderRadius: '13px', padding: '11px 13px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{lg?.l}</div>
                        <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '3px', lineHeight: '1.45' }}>{lg?.v}</div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-integracoes"
                data-tx-sec="integracoes"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Integrações</div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                  {(Array.isArray(v.integracoes) ? v.integracoes : []).map((ig, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 4px',
                          borderBottom: '1px solid var(--superficie-2)',
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: ig?.dot }}></span>
                        <div style={{ flex: '1' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700' }}>{ig?.n}</div>
                          <div style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{ig?.sub}</div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: ig?.c }}>{ig?.e}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="sec-dados"
                data-tx-sec="dados"
                style={{
                  scrollMarginTop: '24px',
                  background: 'var(--painel)',
                  border: '1px solid var(--borda)',
                  borderRadius: '20px',
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '800' }}>Dados do protótipo</div>
                <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '3px', lineHeight: '1.55' }}>{v.dadosTxt}</div>{' '}
                <span role="button" tabIndex={0}
                  onClick={v.abrirReset}
                  data-tx-reset=""
                  style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    background: 'var(--painel)',
                    border: '1.5px solid var(--perigo-borda)',
                    color: 'var(--perigo)',
                    fontSize: '13px',
                    fontWeight: '800',
                    borderRadius: '99px',
                    padding: '9px 18px',
                    cursor: 'pointer',
                  }}
                >
                  Voltar à semente
                </span>{' '}
              </div>
            </div>
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
              <div role="dialog" aria-modal="true"
                onClick={v.pararClique}
                data-tx-modal={v.mK}
                style={{
                  background: 'var(--painel)',
                  borderRadius: '24px',
                  width: '540px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 40px 100px rgba(9,34,36,.4)',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>{v.mTitulo}</div>
                  <span role="button" tabIndex={0}
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
                {v.mConvite ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>Nome</div>
                        <input
                          value={v.cvNome ?? ''}
                          onChange={v.onCvNome}
                          data-tx-campo="nome"
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
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)' }}>E-mail</div>
                        <input
                          value={v.cvEmail ?? ''}
                          onChange={v.onCvEmail}
                          data-tx-campo="email"
                          placeholder="nome@transrural.com.br"
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
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>PAPEL</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {(Array.isArray(v.cvPapeis) ? v.cvPapeis : []).map((pp, $index) => (
                        <Fragment key={$index}>
                          <div role="button" tabIndex={0}
                            onClick={pp?.onClick}
                            data-tx-papel={pp?.k}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              border: `1.5px solid ${pp?.bd ?? ''}`,
                              background: pp?.bg,
                              borderRadius: '12px',
                              padding: '9px 12px',
                              cursor: 'pointer',
                            }}
                          >
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '99px',
                                border: `2.5px solid ${pp?.dotBd ?? ''}`,
                                background: pp?.dot,
                                flex: 'none',
                              }}
                            ></span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700' }}>{pp?.n}</div>
                              <div style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>{pp?.sub}</div>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {v.cvTemFilial ? (
                      <>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>FILIAL</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {(Array.isArray(v.cvFiliais) ? v.cvFiliais : []).map((cf, $index) => (
                            <Fragment key={$index}>
                              <span role="button" tabIndex={0}
                                onClick={cf?.onClick}
                                data-tx-cv-filial={cf?.k}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  borderRadius: '99px',
                                  padding: '5px 11px',
                                  cursor: 'pointer',
                                  border: `1.5px solid ${cf?.bd ?? ''}`,
                                  background: cf?.bg,
                                  color: cf?.c,
                                }}
                              >
                                {cf?.n}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </>
                ) : null}
                {v.mTemMotivo ? (
                  <>
                    <input
                      value={v.fMotivo ?? ''}
                      onChange={v.onMotivo}
                      data-tx-campo="motivo"
                      placeholder="Motivo (mínimo 10 caracteres)"
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        border: '1px solid var(--borda-campo)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </>
                ) : null}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <span role="button" tabIndex={0}
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
                  <span role="button" tabIndex={0}
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
