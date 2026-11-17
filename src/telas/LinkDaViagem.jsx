// Link da Viagem: o que o motorista abre no celular pelo WhatsApp. Sem login e sem instalar nada.
// Fluxo e regras em docs/mobile/fluxo-motorista.md. Estilo em src/app/link/link.css (classes lk-).
//
// Etapas: capa, id, docs (só se falta ou venceu documento), t3 (não para frota própria), check,
// manual, termo (só gatekeeper), fim. Cada etapa enviada vira um evento no back-end
// (linkCpf, linkDocs, linkT3, linkChecklist, linkManual, linkAssinar).
//
// Rascunho no celular (tx-v2-rascunho-<id>): etapa, respostas e fotos ainda não enviadas. Quem fecha
// e abre de novo volta onde parou. Sem sinal, as etapas enviadas ficam na fila (tx-v2-fila-<id>) e
// vão quando o sinal volta.
//
// Dentro de /mobile (iframe), a página conversa com a moldura por postMessage:
// recebe {tx:'link-ir', passo} e {tx:'link-sinal', offline}; manda {tx:'link-estado', ...}.
'use client';
import { TX, Tela } from '@/lib/tx/tela';

const NOMES = {
  capa: 'Início',
  id: 'Quem é você',
  docs: 'Documentos',
  t3: 'Últimas cargas',
  check: 'Checklist com fotos',
  manual: 'Manual',
  termo: 'Termo',
  fim: 'Enviado',
};
const EVENTO = { id: 'linkCpf', docs: 'linkDocs', t3: 'linkT3', check: 'linkChecklist', manual: 'linkManual', termo: 'linkAssinar' };
const CARIMBO_LINK = { id: 'cpfEm', docs: 'docsEm', t3: 't3Em', check: 'checklistEm', manual: 'manualEm', termo: 'assinadoEm' };

// O que fazer quando a resposta é "Não", por item.
const SE_NAO = {
  lona: 'Troque ou remende a lona antes de carregar. Se não der, siga e conte abaixo: a filial decide.',
  correntes: 'Prenda ou troque a corrente antes de carregar. Se não der, conte abaixo.',
  cintas: 'Cinta com óleo ou rasgada contamina a carga. Troque, ou conte abaixo.',
  carroceria: 'Furo ou tábua solta deixa a carga vazar ou molhar. Conte abaixo o que viu.',
  interior: 'Com resto de carga a carreta não carrega ração. Limpe e responda de novo, ou avise o afretador.',
};
// Cena do visor da câmera simulada, por item.
const CENA = {
  lona: 'repeating-linear-gradient(90deg,#2f5d73 0 14px,#33657c 14px 28px)',
  correntes: 'radial-gradient(circle at 30% 40%,#8a9aa0,#4c5c62 70%)',
  cintas: 'repeating-linear-gradient(-30deg,#c46a2a 0 10px,#d07a34 10px 20px)',
  carroceria: 'linear-gradient(160deg,#5d7a7a,#3f5757)',
  interior: 'repeating-linear-gradient(0deg,#8b6f4e 0 12px,#957857 12px 24px)',
  doc: 'linear-gradient(135deg,#dfe9e4 0 46%,#cddcd5 46% 100%)',
};

// Ícones de linha no mesmo traço da sidebar (16 x 16, traço 1,6).
const svg = (d, s = 20) => (
  <svg aria-hidden width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const DESENHO = {
  camera: (
    <>
      <path d="M2.5 5.5h2l1-1.6h5l1 1.6h2v7h-11z" />
      <circle cx="8" cy="9" r="2.2" />
    </>
  ),
  ok: <path d="M3 8.5 6.5 12 13 4.5" />,
  x: <path d="M4 4l8 8M12 4l-8 8" />,
  busca: (
    <>
      <circle cx="7" cy="7" r="4.6" />
      <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
    </>
  ),
  seta: <path d="M6 3.5 10.5 8 6 12.5" />,
  calendario: (
    <>
      <rect x="2.5" y="3.2" width="11" height="10.3" rx="2.4" />
      <line x1="2.5" y1="6.6" x2="13.5" y2="6.6" />
      <line x1="5.6" y1="1.8" x2="5.6" y2="4.2" />
      <line x1="10.4" y1="1.8" x2="10.4" y2="4.2" />
    </>
  ),
  nuvem: (
    <>
      <path d="M4.5 12.5h7a3 3 0 0 0 .4-6A4 4 0 0 0 4.2 7.6 2.5 2.5 0 0 0 4.5 12.5z" />
      <line x1="2" y1="2" x2="14" y2="14" />
    </>
  ),
  // Etapas
  id: (
    <>
      <rect x="1.5" y="3" width="13" height="10" rx="2" />
      <circle cx="5.5" cy="7.2" r="1.6" />
      <path d="M3.3 11c.4-1.1 1.2-1.7 2.2-1.7s1.8.6 2.2 1.7M9.6 6.5h3M9.6 9h2" />
    </>
  ),
  docs: (
    <>
      <path d="M4 1.8h5.5L12.5 5v9.2h-8.5z" />
      <path d="M9.5 1.8V5h3M6 8h4.5M6 10.5h3" />
    </>
  ),
  t3: (
    <>
      <path d="M2.6 8a5.4 5.4 0 1 0 1.6-3.8" />
      <path d="M2.4 2.6v2.6H5" />
      <path d="M8 5.2V8l1.9 1.3" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="2.5" width="10" height="11.5" rx="1.8" />
      <path d="M6 1.8h4v1.8H6z" />
      <path d="M5.6 8.8 7.3 10.5 10.6 6.8" />
    </>
  ),
  manual: <path d="M2 3.6c2-.8 4-.7 6 .6v9.4c-2-1.3-4-1.4-6-.6zM14 3.6c-2-.8-4-.7-6 .6v9.4c2-1.3 4-1.4 6-.6z" />,
  termo: (
    <>
      <path d="M10.4 2.4l3.2 3.2L6.2 13H3v-3.2z" />
      <path d="M8.8 4l3.2 3.2" />
    </>
  ),
  // Itens do checklist
  lona: (
    <>
      <path d="M1.8 9.2C3.5 5 12.5 5 14.2 9.2" />
      <path d="M1.8 9.2h12.4v2.3H1.8z" />
      <path d="M5 6.4 6 9.2M8 5.8v3.4M11 6.4 10 9.2" />
      <circle cx="4.3" cy="13" r="1.1" />
      <circle cx="11.7" cy="13" r="1.1" />
    </>
  ),
  correntes: (
    <>
      <rect x="1.2" y="5.6" width="7.2" height="4.8" rx="2.4" />
      <rect x="7.6" y="5.6" width="7.2" height="4.8" rx="2.4" />
    </>
  ),
  cintas: (
    <>
      <path d="M1.5 4.8h13M1.5 11.2h13" />
      <rect x="5.8" y="3" width="4.4" height="10" rx="1.2" />
      <path d="M8 6v4" />
    </>
  ),
  carroceria: (
    <>
      <rect x="1.4" y="4" width="9.6" height="6.6" rx="1" />
      <path d="M11 6.4h2.3l1.3 2v2.2H11z" />
      <circle cx="4.4" cy="12.2" r="1.3" />
      <circle cx="12" cy="12.2" r="1.3" />
    </>
  ),
  interior: (
    <>
      <rect x="2" y="2.6" width="12" height="10.8" rx="1.6" />
      <rect x="4.4" y="5" width="7.2" height="6" rx=".8" />
      <path d="M4.4 5 2 2.6M11.6 5 14 2.6M4.4 11 2 13.4M11.6 11 14 13.4" />
    </>
  ),
};
const Ic = Object.fromEntries(Object.keys(DESENHO).map((k) => [k, svg(DESENHO[k])]));
const icone = (k, s) => svg(DESENHO[k], s);

// Ilustrações maiores: caminhão conferido (fim) e celular esperando a mensagem (link não enviado).
const IL_CAMINHAO = (
  <svg aria-hidden width="168" height="96" viewBox="0 0 168 96" fill="none">
    <ellipse cx="84" cy="86" rx="70" ry="6" fill="#e3eeec" />
    <rect x="14" y="28" width="92" height="44" rx="6" fill="#eef7f6" stroke="#127670" strokeWidth="3" />
    <path d="M106 42h24l14 16v14h-38z" fill="#fff" stroke="#127670" strokeWidth="3" strokeLinejoin="round" />
    <path d="M114 46h14l8 10h-22z" fill="#cfe9dc" />
    <circle cx="38" cy="76" r="9" fill="#fff" stroke="#0c5862" strokeWidth="3" />
    <circle cx="124" cy="76" r="9" fill="#fff" stroke="#0c5862" strokeWidth="3" />
    <circle cx="60" cy="44" r="16" fill="#177d4c" />
    <path d="M52 44.5l5.5 5.5L68 39" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IL_CELULAR = (
  <svg aria-hidden width="120" height="96" viewBox="0 0 120 96" fill="none">
    <rect x="34" y="8" width="44" height="80" rx="8" fill="#fff" stroke="#127670" strokeWidth="3" />
    <line x1="50" y1="16" x2="62" y2="16" stroke="#127670" strokeWidth="3" strokeLinecap="round" />
    <path d="M66 30h40a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H80l-8 7v-7h-6a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6z" fill="#eef7f6" stroke="#0e78b5" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="76" cy="43" r="2.4" fill="#0e78b5" />
    <circle cx="86" cy="43" r="2.4" fill="#0e78b5" />
    <circle cx="96" cy="43" r="2.4" fill="#0e78b5" />
  </svg>
);

function lerJSON(k, padrao) {
  try {
    const t = localStorage.getItem(k);
    return t ? JSON.parse(t) : padrao;
  } catch (e) {
    return padrao;
  }
}
function gravarJSON(k, v) {
  try {
    if (v == null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    /* sem armazenamento: segue em memória */
  }
}

export default class LinkDaViagem extends Tela {
  state = {
    passo: null,
    cpfIn: '',
    placaErrada: false,
    t3: null,
    itens: {},
    fotos: {},
    obs: {},
    docsTirados: {},
    docsDepois: false,
    cartao: 0,
    pontos: [],
    offline: false,
    fila: [],
    camera: null,
    seletor: null,
    aberto: null,
    realce: null,
    toast: null,
  };

  componentDidMount() {
    TX.ui.montar(this, { semCarregar: true });
    const v = this.v();
    this._id = v.id;
    const r = lerJSON(this.chaveRascunho(), null);
    const fila = lerJSON('tx-v2-fila-' + v.id, []);
    const ini = Object.assign({}, r || {}, { fila });
    // Fila guardada com o sinal de volta: a página foi fechada antes de enviar; manda agora.
    const tentar = fila.length && !(r && r.offline);
    this.setState(ini, () => {
      if (tentar) this.setOffline(false);
      if (v.link.enviadoEm && !v.link.abertoEm) this.enviar('linkAberto', {});
    });
    this._online = () => this.setOffline(false);
    this._offline = () => this.setOffline(true);
    this._msg = (e) => this.mensagem(e);
    window.addEventListener('online', this._online);
    window.addEventListener('offline', this._offline);
    window.addEventListener('message', this._msg);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('online', this._online);
    window.removeEventListener('offline', this._offline);
    window.removeEventListener('message', this._msg);
  }
  componentDidUpdate() {
    this.guardarRascunho();
    this.contarParaMoldura();
  }

  // ------------------------------------------------------------------ dados
  v() {
    const p = TX.ui.param('id');
    return TX.viagem(p && TX.viagem(p) ? p : 'VG-3122');
  }
  chaveRascunho() {
    return 'tx-v2-rascunho-' + (this._id || this.v().id);
  }
  guardarRascunho() {
    const s = this.state;
    const vazio =
      !s.passo && !s.cpfIn && !s.t3 && !Object.keys(s.itens).length && !Object.keys(s.fotos).length && !Object.keys(s.docsTirados).length && !s.docsDepois && !s.cartao && !s.offline;
    const r = vazio
      ? null
      : { passo: s.passo, cpfIn: s.cpfIn, t3: s.t3, itens: s.itens, fotos: s.fotos, obs: s.obs, docsTirados: s.docsTirados, docsDepois: s.docsDepois, cartao: s.cartao, offline: s.offline };
    const txt = JSON.stringify(r);
    if (txt === this._rascunho) return;
    this._rascunho = txt;
    gravarJSON(this.chaveRascunho(), r);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }

  // Grava a operação; sem sinal, guarda no aparelho e envia quando voltar.
  enviar(tipo, dados) {
    const d = Object.assign({ id: this.v().id, porMotorista: true }, dados);
    if (this.state.offline) {
      const fila = this.state.fila.concat([{ tipo, dados: d, em: TX.agoraHM() }]);
      gravarJSON('tx-v2-fila-' + d.id, fila);
      this.setState({ fila });
      return;
    }
    TX.fazer(tipo, d);
  }
  setOffline(off) {
    if (!off && this.state.fila.length) {
      const n = this.state.fila.filter((o) => o.tipo !== 'linkAberto').length;
      this.state.fila.forEach((o) => {
        try {
          TX.fazer(o.tipo, o.dados);
        } catch (e) {
          /* etapa recusada pelo servidor: segue com as outras */
        }
      });
      gravarJSON('tx-v2-fila-' + this.v().id, null);
      this.setState({ offline: false, fila: [] });
      if (n) this.avisar('Sinal de volta: ' + n + (n === 1 ? ' etapa enviada' : ' etapas enviadas') + ' à filial.');
      return;
    }
    this.setState({ offline: off });
  }
  // Dentro do /mobile o controle de sinal fica no painel ao lado.
  embutido() {
    try {
      return window.parent !== window;
    } catch (e) {
      return true;
    }
  }
  naFila(tipo) {
    return this.state.fila.some((o) => o.tipo === tipo);
  }

  docsFaltando(v) {
    const out = [];
    const t = TX.transportador(v.transportador),
      mot = TX.pessoa(v.motorista);
    const ruim = (val) => ['falta', 'vencido'].includes(TX.docEstado(val).estado);
    if (mot && ruim(mot.cnh && mot.cnh.validade))
      out.push({ k: 'CNH', tipo: 'CNH', n: 'CNH', sub: mot.cnh ? 'venceu em ' + TX.fmt.data(mot.cnh.validade) : 'ainda não temos' });
    if (t && t.id !== 'propria' && ruim(t.rntrc && t.rntrc.validade))
      out.push({ k: 'RNTRC', tipo: 'RNTRC', n: 'RNTRC (ANTT)', sub: t.rntrc ? 'venceu em ' + TX.fmt.data(t.rntrc.validade) : 'ainda não temos' });
    TX.placasDoConjunto(v.conjunto).forEach((pl) => {
      const p = TX.placa(pl);
      if (p && ruim(p.crlv && p.crlv.validade))
        out.push({ k: 'CRLV-' + pl, tipo: 'CRLV', placa: pl, n: 'CRLV da ' + pl, sub: p.crlv ? 'venceu em ' + TX.fmt.data(p.crlv.validade) : 'ainda não temos' });
    });
    return out;
  }
  devolvido(v) {
    const vf = v.verificacao;
    return !!(vf && vf.estado === 'devolvida' && !vf.reenviadoEm && !this.naFila('linkChecklist'));
  }
  passos(v) {
    const ps = ['capa', 'id'];
    if (this.docsFaltando(v).length || v.link.docsEm || this.naFila('linkDocs')) ps.push('docs');
    if (v.tipo !== 'propria') ps.push('t3');
    ps.push('check', 'manual');
    if (TX.coberturaDe(v) === 'gatekeeper') ps.push('termo');
    ps.push('fim');
    return ps;
  }
  // Etapa feita: o servidor já tem, ou está na fila do celular esperando sinal.
  feito(v, k) {
    const l = v.link || {};
    if (k === 'docs') return !this.docsFaltando(v).length || this.naFila('linkDocs');
    if (k === 'check') return (!!(v.checklist && v.checklist.enviadoEm) && !this.devolvido(v)) || this.naFila('linkChecklist');
    if (EVENTO[k]) return !!l[CARIMBO_LINK[k]] || this.naFila(EVENTO[k]);
    return false;
  }
  horaFeito(v, k) {
    const ts = (v.link || {})[CARIMBO_LINK[k]];
    if (ts && !(k === 'docs' && this.docsFaltando(v).length)) return TX.fmt.hora(ts);
    const f = this.state.fila.find((o) => o.tipo === EVENTO[k]);
    return f ? 'no celular' : '';
  }
  // Primeira etapa que falta. Documento adiado pelo motorista não segura o resto.
  pendente(v, ps) {
    if (this.devolvido(v)) return 'check';
    return ps.find((k) => k !== 'capa' && k !== 'fim' && !this.feito(v, k) && !(k === 'docs' && this.state.docsDepois)) || 'fim';
  }
  passoAtual(v, ps) {
    if (this.state.passo && ps.includes(this.state.passo)) return this.state.passo;
    const pend = this.pendente(v, ps);
    if (pend === 'fim' && !this.devolvido(v)) return 'fim';
    return 'capa';
  }

  // ------------------------------------------------------------------ navegação
  ir(n) {
    this.setState({ passo: n, realce: null, placaErrada: false });
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }
  mensagem(e) {
    if (e.origin !== location.origin || !e.data || typeof e.data !== 'object') return;
    const d = e.data;
    if (d.tx === 'link-ir' && typeof d.passo === 'string') {
      if (d.passo === 'manual') this.setState({ cartao: 0 });
      this.ir(d.passo);
    }
    if (d.tx === 'link-sinal') this.setOffline(!!d.offline);
  }
  contarParaMoldura() {
    if (typeof window === 'undefined' || window.parent === window) return;
    const v = this.v();
    const ps = this.passos(v);
    const msg = {
      tx: 'link-estado',
      id: v.id,
      enviado: !!v.link.enviadoEm,
      passo: this._passo,
      passos: ps.map((k) => ({ k, n: NOMES[k], feito: k === 'capa' ? !!v.link.abertoEm : k === 'fim' ? this.pendente(v, ps) === 'fim' : this.feito(v, k) })),
      offline: this.state.offline,
      fila: this.state.fila.filter((o) => o.tipo !== 'linkAberto').length,
      camera: !!this.state.camera,
    };
    const txt = JSON.stringify(msg);
    if (txt === this._contado) return;
    this._contado = txt;
    try {
      window.parent.postMessage(msg, location.origin);
    } catch (e) {
      /* moldura de outra origem: ignora */
    }
  }
  rolar(sel, k) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (k) {
      this.setState({ realce: k });
      clearTimeout(this._realceT);
      this._realceT = setTimeout(() => this.setState({ realce: null }), 1600);
    }
  }

  // ------------------------------------------------------------------ câmera simulada
  abrirCamera(alvo, k, titulo, dica) {
    this.setState({ camera: { alvo, k, titulo, dica, fase: 'mirar' } });
  }
  disparar() {
    const c = this.state.camera;
    this.setState({ camera: Object.assign({}, c, { fase: 'ver', em: TX.agoraHM() }) });
  }
  usarFoto() {
    const c = this.state.camera;
    const foto = { em: c.em };
    if (c.alvo === 'doc') this.setState({ docsTirados: Object.assign({}, this.state.docsTirados, { [c.k]: foto }), camera: null });
    else this.setState({ fotos: Object.assign({}, this.state.fotos, { [c.k]: foto }), camera: null });
    this.avisar('Foto guardada com hora e local.');
  }

  // ------------------------------------------------------------------ etapas
  // Cada uma devolve { corpo, pode, rot, falta, irFalta, acao }.
  etapaCapa(ctx) {
    const { v, ps, mot, fil } = ctx;
    const vf = v.verificacao;
    const devolvido = this.devolvido(v);
    const pend = this.pendente(v, ps);
    const meio = ps.some((k) => k !== 'capa' && k !== 'fim' && this.feito(v, k));
    const lista = ps.filter((k) => k !== 'capa' && k !== 'fim');
    const corpo = (
      <>
        {devolvido ? (
          <div className="lk-cartao" data-tom="tecnico" data-tx-devolvido="">
            <div className="lk-tit-p" style={{ color: 'var(--tecnico)' }}>
              A filial pediu foto nova
            </div>
            <div className="lk-txt">&quot;{vf.motivo}&quot;</div>
            <div className="lk-dica" style={{ marginTop: 6 }}>
              {TX.usuario(vf.por).nome}, {TX.fmt.quando(vf.em)}
            </div>
          </div>
        ) : null}
        <div className="lk-cartao">
          <div className="lk-tit-g">Olá, {mot.nome.split(' ')[0]}</div>
          <div className="lk-txt">
            {devolvido
              ? 'Só falta refazer o que a filial pediu. O resto já foi aceito.'
              : meio
                ? 'Você já começou. O que foi enviado está guardado; falta pouco.'
                : 'Antes de carregar, a transportadora precisa de algumas informações suas. Leva uns 5 minutos e não precisa instalar nada.'}
          </div>
          <div className="lk-passos" data-tx-capa-passos="">
            {lista.map((k, i) => {
              const feito = this.feito(v, k);
              const prox = !devolvido && k === pend;
              const adiado = k === 'docs' && !feito && this.state.docsDepois;
              return (
                <div key={k} className="lk-passo" data-k={feito ? 'feito' : prox ? 'proximo' : ''}>
                  <span className="lk-passo-n">{icone(feito ? 'ok' : k, 20)}</span>
                  <span className="lk-passo-t">
                    {NOMES[k]}
                    {adiado ? ' (falta enviar)' : ''}
                  </span>
                  {feito ? <span className="lk-passo-hora">{this.horaFeito(v, k)}</span> : null}
                </div>
              );
            })}
          </div>
          <div className="lk-dica" style={{ marginTop: 16 }}>
            Sem sinal, o que você fizer fica guardado neste celular e vai quando o sinal voltar. Seus dados servem só para a{' '}
            {TX.db.tenant.nome.replace(' Ltda', '')} provar a carga em auditoria GMP+. Dúvida? Fale com {TX.usuario(fil.afretador).nome.split(' ')[0]}, afretador
            da filial {fil.nome}.
          </div>
          {!this.embutido() && !this.state.offline ? (
            <button type="button" className="lk-bt lk-bt-txt" style={{ marginTop: 8 }} onClick={() => this.setOffline(true)} data-tx-sinal="on">
              Demonstração: simular falta de sinal
            </button>
          ) : null}
        </div>
      </>
    );
    return {
      corpo,
      pode: true,
      rot: devolvido ? 'Refazer a foto pedida' : meio ? 'Continuar: ' + NOMES[pend].toLowerCase() : 'Começar',
      acao: () => this.ir(devolvido ? 'check' : pend === 'fim' ? 'fim' : pend),
    };
  }

  etapaId(ctx) {
    const { v, mot, conj, fil, prox } = ctx;
    const s = this.state;
    const placas = TX.placasDoConjunto(conj).map((pl, i) => ({ papel: i === 0 ? 'Cavalo' : 'Carreta ' + i, placa: pl }));
    const afretador = TX.usuario(fil.afretador).nome.split(' ')[0];
    if (this.feito(v, 'id')) {
      return {
        corpo: (
          <div className="lk-cartao">
            <div className="lk-cab-ic">
              <span className="lk-ic-tile" data-tom="ok">{icone('ok', 22)}</span>
              <div className="lk-tit">Identidade confirmada</div>
            </div>
            <div className="lk-txt">
              {mot.nome}, CPF <span className="lk-mono">{TX.fmt.cpfMascara(mot.cpf)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {placas.map((p) => (
                <div key={p.placa} className="lk-placa">
                  <span className="lk-placa-papel">{p.papel}</span>
                  <span className="lk-placa-n">{p.placa}</span>
                </div>
              ))}
            </div>
            <div className="lk-dica" style={{ marginTop: 12 }}>
              Confirmado {this.horaFeito(v, 'id') === 'no celular' ? 'neste celular, esperando sinal' : 'às ' + this.horaFeito(v, 'id')}.
            </div>
          </div>
        ),
        pode: true,
        rot: 'Continuar',
        acao: prox,
      };
    }
    if (TX.soDigitos(mot.cpf).length !== 11) {
      return {
        corpo: (
          <div className="lk-cartao" data-tom="aviso" data-tx-sem-cpf="">
            <div className="lk-cab-ic">
              <span className="lk-ic-tile" data-tom="aviso">{icone('id', 22)}</span>
              <div className="lk-tit">Falta o seu CPF no cadastro</div>
            </div>
            <div className="lk-txt">
              Não dá para confirmar que é você. Avise {afretador}, o afretador da filial {fil.nome}: ele completa o cadastro e este mesmo link continua daqui.
            </div>
          </div>
        ),
        pode: false,
        rot: 'Confirmar',
        falta: 'CPF não cadastrado: fale com o afretador',
        irFalta: () => this.rolar('[data-tx-sem-cpf]'),
        acao: () => {},
      };
    }
    const ok = s.cpfIn.length === 3 && s.cpfIn === TX.soDigitos(mot.cpf).slice(0, 3);
    const errado = s.cpfIn.length === 3 && !ok;
    const corpo = (
      <div className="lk-cartao">
        <div className="lk-cab-ic">
          <span className="lk-ic-tile">{icone('id', 22)}</span>
          <div className="lk-tit">É você mesmo?</div>
        </div>
        <label className="lk-txt" htmlFor="lk-cpf" style={{ display: 'block' }}>
          Digite os 3 primeiros números do seu CPF.
        </label>
        <input
          id="lk-cpf"
          className="lk-campo lk-campo-cpf"
          style={{ marginTop: 12 }}
          data-estado={ok ? 'ok' : errado ? 'erro' : undefined}
          value={s.cpfIn}
          onChange={(e) => this.setState({ cpfIn: TX.soDigitos(e.target.value).slice(0, 3) })}
          data-tx-campo="cpf"
          inputMode="numeric"
          autoComplete="off"
          maxLength={3}
          placeholder="000"
          aria-describedby="lk-cpf-msg"
        />
        <div id="lk-cpf-msg" aria-live="polite" style={{ minHeight: 24 }}>
          {ok ? <div className="lk-okmsg">Confere, {mot.nome.split(' ')[0]}.</div> : null}
          {errado ? <div className="lk-erro">Não confere com o CPF desta viagem. Confira os números ou fale com {afretador}, o afretador.</div> : null}
        </div>
        <div className="lk-rotulo" style={{ marginTop: 16 }}>
          Estas são as placas do seu conjunto?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {placas.map((p) => (
            <div key={p.placa} className="lk-placa">
              <span className="lk-placa-papel">{p.papel}</span>
              <span className="lk-placa-n">{p.placa}</span>
            </div>
          ))}
        </div>
        {s.placaErrada ? (
          <div className="lk-cartao" data-tom="aviso" style={{ marginTop: 12, padding: 16 }} data-tx-placa-errada="">
            <div className="lk-tit-p">Não siga com placa diferente</div>
            <div className="lk-txt-p" style={{ marginTop: 4 }}>
              A carga é liberada só para estas placas. Avise {afretador}, o afretador da filial {fil.nome}: ele corrige a viagem e este mesmo link passa a mostrar as placas certas.
            </div>
            <button type="button" className="lk-bt lk-bt-txt" style={{ marginTop: 4 }} onClick={() => this.setState({ placaErrada: false })}>
              Olhei de novo: as placas estão certas
            </button>
          </div>
        ) : (
          <button type="button" className="lk-bt lk-bt-txt" style={{ marginTop: 4 }} onClick={() => this.setState({ placaErrada: true })} data-tx-placa-errada-bt="">
            Alguma placa está errada
          </button>
        )}
      </div>
    );
    return {
      corpo,
      pode: ok && !s.placaErrada,
      rot: 'Confirmar',
      falta: s.placaErrada ? 'Placa errada: fale com o afretador' : errado ? 'CPF não confere' : 'Digite os 3 números do CPF',
      irFalta: () => {
        if (s.placaErrada) return this.rolar('[data-tx-placa-errada]');
        const el = document.querySelector('[data-tx-campo="cpf"]');
        if (el) el.focus();
      },
      acao: () => {
        this.enviar('linkCpf', {});
        prox();
      },
    };
  }

  etapaDocs(ctx) {
    const { v, prox } = ctx;
    const s = this.state;
    const faltam = this.docsFaltando(v);
    const naFila = this.naFila('linkDocs');
    if (!faltam.length || naFila) {
      return {
        corpo: (
          <div className="lk-cartao" data-tom="ok">
            <div className="lk-tit">Documentos recebidos</div>
            <div className="lk-txt">
              {naFila ? 'As fotos estão guardadas neste celular e vão quando o sinal voltar.' : 'A filial já tem o que precisava. A validade é conferida pela foto.'}
            </div>
          </div>
        ),
        pode: true,
        rot: 'Continuar',
        acao: prox,
      };
    }
    const tirados = s.docsTirados;
    const semFoto = faltam.filter((d) => !tirados[d.k]);
    const corpo = (
      <>
        <div className="lk-cartao">
          <div className="lk-cab-ic">
            <span className="lk-ic-tile" data-tom="aviso">{icone('docs', 22)}</span>
            <div className="lk-tit">Falta um documento seu</div>
          </div>
          <div className="lk-txt">
            Tire foto do documento <strong>em dia</strong>, inteiro e sem reflexo. O resto a transportadora já tem.
          </div>
        </div>
        {faltam.map((d) => {
          const f = tirados[d.k];
          return (
            <div key={d.k} className="lk-item" data-k={f ? 'pronto' : ''} data-realce={s.realce === d.k ? '1' : undefined} data-tx-doc-item={d.k}>
              <div className="lk-item-topo">
                <span className="lk-tit-p">{d.n}</span>
                {f ? (
                  <span className="lk-selo" data-tom="ok">
                    foto pronta
                  </span>
                ) : (
                  <span className="lk-selo" data-tom="aviso">
                    {d.sub}
                  </span>
                )}
              </div>
              {f ? (
                <div className="lk-mini" style={{ background: CENA.doc }}>
                  <span className="lk-mini-carimbo">foto {f.em}</span>
                  <button type="button" className="lk-mini-refazer" onClick={() => this.abrirCamera('doc', d.k, d.n, 'documento inteiro, sem reflexo')} data-tx-doc={d.k}>
                    Tirar de novo
                  </button>
                </div>
              ) : (
                <button type="button" className="lk-enquadre" onClick={() => this.abrirCamera('doc', d.k, d.n, 'documento inteiro, sem reflexo')} data-tx-doc={d.k}>
                  <span className="lk-enquadre-cena" aria-hidden>
                    <span className="lk-canto" data-c="1" />
                    <span className="lk-canto" data-c="2" />
                    <span className="lk-canto" data-c="3" />
                    <span className="lk-canto" data-c="4" />
                    {icone('camera', 44)}
                  </span>
                  <span className="lk-enquadre-dica">Documento aberto, inteiro, sem reflexo</span>
                  <span className="lk-enquadre-bt">
                    {icone('camera', 20)}
                    Tirar foto
                  </span>
                </button>
              )}
            </div>
          );
        })}
        <div className="lk-cartao" style={{ padding: 16 }}>
          <div className="lk-txt-p">Ainda não tem o documento novo? Pode seguir com o resto agora e mandar a foto depois por este mesmo link. Sem ele, a carga não é liberada.</div>
          <button
            type="button"
            className="lk-bt lk-bt-sec lk-bt-bloco"
            style={{ marginTop: 12 }}
            data-tx-docs-depois=""
            onClick={() => {
              this.setState({ docsDepois: true, docsTirados: {} });
              prox();
            }}
          >
            Mandar depois
          </button>
        </div>
      </>
    );
    return {
      corpo,
      pode: semFoto.length === 0,
      rot: faltam.length === 1 ? 'Enviar documento' : 'Enviar documentos',
      falta: semFoto.length === 1 ? 'Falta a foto de 1 documento' : 'Faltam fotos de ' + semFoto.length + ' documentos',
      irFalta: () => semFoto[0] && this.rolar('[data-tx-doc-item="' + semFoto[0].k + '"]', semFoto[0].k),
      acao: () => {
        this.enviar('linkDocs', {
          docs: faltam.map((d) => ({ tipo: d.tipo, placa: d.placa, validade: d.tipo === 'CNH' ? TX.addDias(TX.HOJE, 1825) : TX.addDias(TX.HOJE, 365) })),
        });
        this.setState({ docsTirados: {}, docsDepois: false });
        prox();
      },
    };
  }

  t3Inicial(v, comps) {
    const out = {};
    comps.forEach((c) => {
      if (v.t3[c.key]) {
        out[c.key] = v.t3[c.key].map((x) => ({ data: x.data, produto: x.produto || null, texto: x.produto ? TX.produto(x.produto).nome : x.texto }));
        return;
      }
      // Segunda viagem do mesmo conjunto: o que ele já informou volta preenchido, para conferir.
      const h = TX.historico(c.placa, c.pos)
        .filter((x) => x.data < v.data)
        .slice(0, 3);
      out[c.key] = [0, 1, 2].map((i) =>
        h[i] ? { data: h[i].data, produto: h[i].produto, texto: h[i].produto ? TX.produto(h[i].produto).nome : h[i].texto } : { data: '', produto: null, texto: '' },
      );
    });
    return out;
  }
  t3Atual() {
    const v = this.v();
    return this.state.t3 || this.t3Inicial(v, TX.compsDoConjunto(TX.conjunto(v.conjunto)));
  }
  setT3(key, i, campos) {
    const n = JSON.parse(JSON.stringify(this.t3Atual()));
    Object.assign(n[key][i], campos);
    this.setState({ t3: n });
  }
  etapaT3(ctx) {
    const { v, comps, prox } = ctx;
    const s = this.state;
    const F = TX.fmt;
    const inicial = this.t3Inicial(v, comps);
    const t3 = s.t3 || inicial;
    const jaEnviado = this.feito(v, 't3');
    const mudou = JSON.stringify(t3) !== JSON.stringify(inicial);
    // Linha certa: data antes desta carga, mais antiga que a de cima, e o que carregou.
    const erroData = (linhas, i) => {
      const l = linhas[i];
      if (!l.data) return '';
      if (l.data >= v.data) return 'A data tem que ser antes desta carga (' + F.data(v.data) + ').';
      const cima = linhas[i - 1];
      if (cima && cima.data && l.data > cima.data) return 'Esta carga é mais antiga: a data tem que ser antes de ' + F.data(cima.data) + '.';
      return '';
    };
    const linhaOk = (linhas, i) => !!(linhas[i].data && (linhas[i].texto || '').trim() && !erroData(linhas, i));
    const ontem = TX.addDias(v.data, -1);
    const ROT = ['Última carga', 'Penúltima', 'Antepenúltima'];
    const RAPIDAS = [
      ['Ontem', 1],
      ['Há 3 dias', 3],
      ['Há 1 semana', 7],
      ['Há 2 semanas', 14],
    ];
    const corpo = (
      <>
        {jaEnviado ? (
          <div className="lk-cartao" data-tom="ok" style={{ padding: 16 }}>
            <div className="lk-txt-p">
              Enviado {this.horaFeito(v, 't3') === 'no celular' ? 'para a fila deste celular' : 'às ' + this.horaFeito(v, 't3')}. Se corrigir algo, a filial recebe a correção com a hora.
            </div>
          </div>
        ) : null}
        {comps.map((c, ci) => {
          const ant = comps[ci - 1];
          const linhas = t3[c.key];
          const dupla = comps.filter((x) => x.placa === c.placa).length > 1;
          return (
            <div key={c.key} className="lk-cartao">
              <div className="lk-cab-ic">
                <span className="lk-ic-tile">{icone('t3', 22)}</span>
                <div className="lk-tit-p">
                  O que a carreta <span className="lk-mono">{c.placa}</span>
                  {dupla ? ' (compartimento ' + c.pos + ')' : ''} carregou antes?
                </div>
              </div>
              <div className="lk-dica" style={{ marginTop: 8 }}>
                As 3 últimas viagens, da mais recente para a mais antiga. Vale qualquer carga, não só ração.
              </div>
              {ant ? (
                <button
                  type="button"
                  className="lk-bt lk-bt-sec lk-bt-bloco"
                  style={{ marginTop: 12, fontSize: 14 }}
                  data-tx-atalho=""
                  onClick={() => {
                    const n = JSON.parse(JSON.stringify(t3));
                    n[c.key] = JSON.parse(JSON.stringify(t3[ant.key]));
                    this.setState({ t3: n });
                  }}
                >
                  Carregou o mesmo que a {ant.placa + (ant.placa === c.placa ? ' ' + ant.pos : '')}
                </button>
              ) : null}
              <ol className="lk-tl">
                {linhas.map((l, i) => {
                  const key = c.key + '-' + i;
                  const pr = l.produto ? TX.produto(l.produto) : null;
                  const ed = erroData(linhas, i);
                  const cima = linhas[i - 1];
                  const limite = cima && cima.data && cima.data < ontem ? TX.addDias(cima.data, -1) : ontem;
                  const rapidas = RAPIDAS.map(([n, d]) => [n, TX.addDias(TX.HOJE, -d)]).filter(([, d]) => d <= limite);
                  let msg = null;
                  if (ed) msg = <div className="lk-erro">{ed}</div>;
                  else if (pr && pr.regime === 'X') msg = <div className="lk-erro">Carga proibida para quem leva ração. O afretador vai falar com você.</div>;
                  else if (pr && pr.regime !== 'A') msg = <div className="lk-aviso">Esta carga pede lavagem antes da ração (regime {pr.regime}).</div>;
                  else if (l.texto && !pr) msg = <div className="lk-aviso">Fora da lista: vai como você escreveu e a transportadora confere.</div>;
                  return (
                    <li key={key} className="lk-tl-i" data-k={linhaOk(linhas, i) ? 'ok' : ''} data-realce={s.realce === key ? '1' : undefined} data-tx-t3-linha={key}>
                      <span className="lk-tl-ponto" aria-hidden>
                        {linhaOk(linhas, i) ? icone('ok', 14) : i + 1}
                      </span>
                      <div className="lk-tl-rot">{ROT[i]}</div>
                      <button
                        type="button"
                        className="lk-escolha"
                        data-vazio={l.texto ? undefined : '1'}
                        aria-haspopup="dialog"
                        onClick={() => this.setState({ seletor: { key, k: c.key, i, q: '', rot: ROT[i].toLowerCase() } })}
                        data-tx-t3-produto={key}
                      >
                        <span className="lk-escolha-ic">{icone(l.texto ? 'ok' : 'busca', 18)}</span>
                        <span className="lk-escolha-t">{l.texto || 'Escolher o que carregou'}</span>
                        <span className="lk-escolha-seta">{icone('seta', 18)}</span>
                      </button>
                      {msg}
                      <div className="lk-datas" role="group" aria-label={'Quando foi a ' + ROT[i].toLowerCase()}>
                        {(l.data ? [] : rapidas).map(([n, d]) => (
                          <button type="button" key={n} className="lk-sug" aria-pressed={l.data === d} onClick={() => this.setT3(c.key, i, { data: d })} data-tx-t3-rapida={key}>
                            {n}
                          </button>
                        ))}
                        <label className="lk-data">
                          <span className="lk-data-ic">{icone('calendario', 18)}</span>
                          <span className="tx-so-leitor">Data da {ROT[i].toLowerCase()}</span>
                          <input type="date" value={l.data || ''} max={limite} onChange={(e) => this.setT3(c.key, i, { data: e.target.value })} data-tx-t3-data={key} />
                          <span className="lk-data-t">{l.data ? F.data(l.data).slice(0, 5) + ', ' + F.relativo(l.data) + ' (trocar)' : 'Outra data'}</span>
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </>
    );
    const incompletas = [];
    comps.forEach((c) => t3[c.key].forEach((l, i) => !linhaOk(t3[c.key], i) && incompletas.push(c.key + '-' + i)));
    const ok = incompletas.length === 0;
    return {
      corpo,
      pode: ok,
      rot: jaEnviado ? (mudou ? 'Enviar correção' : 'Continuar') : 'Enviar as cargas',
      falta: incompletas.length === 1 ? 'Falta 1 carga' : 'Faltam ' + incompletas.length + ' cargas',
      irFalta: () => incompletas[0] && this.rolar('[data-tx-t3-linha="' + incompletas[0] + '"]', incompletas[0]),
      acao: () => {
        if (!jaEnviado || mudou) {
          const out = {};
          comps.forEach((c) => {
            out[c.key] = t3[c.key].map((l) => (l.produto ? { data: l.data, produto: l.produto } : { data: l.data, texto: l.texto }));
          });
          this.enviar('linkT3', { t3: out });
        }
        this.setState({ t3: null });
        prox();
      },
    };
  }

  // Folha de baixo para escolher o produto: comuns em atalho, busca por nome e apelido, e "não achei".
  folhaProduto() {
    const sel = this.state.seletor;
    if (!sel) return null;
    const q = sel.q || '';
    const COMUNS = ['soja', 'milho', 'farelo-soja', 'casca-soja', 'trigo', 'npk', 'map', 'calcario'];
    const achados = q.trim() ? TX.buscarProdutos(q, 8) : [];
    const escolher = (p) => {
      this.setT3(sel.k, sel.i, { texto: p.nome, produto: p.id });
      this.setState({ seletor: null });
      if (p.regime === 'X')
        setTimeout(() => {
          const el = document.querySelector('[data-tx-t3-linha="' + sel.key + '"] .lk-erro');
          if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 60);
    };
    const fechar = () => this.setState({ seletor: null });
    const regime = (p) =>
      p.regime === 'X' ? { t: 'proibida', tom: 'tecnico' } : p.regime === 'A' ? { t: 'limpeza a seco', tom: 'ok' } : { t: 'pede lavagem', tom: 'aviso' };
    return (
      <div className="lk-veu" onClick={fechar}>
        <div className="lk-folha" role="dialog" aria-modal="true" aria-label={'O que carregou na ' + sel.rot} onClick={(e) => e.stopPropagation()} data-tx-folha-produto="">
          <span className="lk-folha-alca" aria-hidden />
          <div className="lk-folha-cab">
            <div className="lk-tit-p" style={{ flex: 1 }}>
              O que carregou na {sel.rot}?
            </div>
            <button type="button" className="lk-bt lk-bt-txt" onClick={fechar}>
              Fechar
            </button>
          </div>
          <label className="lk-busca">
            <span className="lk-busca-ic">{icone('busca', 18)}</span>
            <span className="tx-so-leitor">Procurar produto</span>
            <input
              className="lk-campo"
              autoFocus
              value={q}
              placeholder="Procurar: soja, adubo, casquinha"
              onChange={(e) => this.setState({ seletor: Object.assign({}, sel, { q: e.target.value }) })}
              data-tx-produto-busca=""
              autoComplete="off"
            />
          </label>
          <div className="lk-folha-corpo">
            {!q.trim() ? (
              <>
                <div className="lk-sobre" style={{ marginTop: 4 }}>
                  Mais comuns
                </div>
                <div className="lk-sugs">
                  {COMUNS.map((id) => TX.produto(id)).filter(Boolean).map((p) => (
                    <button type="button" key={p.id} className="lk-sug" onClick={() => escolher(p)} data-tx-produto={p.id}>
                      {p.nome}
                    </button>
                  ))}
                </div>
                <div className="lk-dica" style={{ marginTop: 12 }}>
                  Não está aqui? Escreva acima do jeito que você chama: farelinho, adubo, casquinha.
                </div>
              </>
            ) : (
              <ul className="lk-lista">
                {achados.map((r) => {
                  const rg = regime(r.produto);
                  return (
                    <li key={r.produto.id}>
                      <button type="button" className="lk-lista-i" onClick={() => escolher(r.produto)} data-tx-produto={r.produto.id}>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span className="lk-lista-t">{r.produto.nome}</span>
                          {r.via ? <span className="lk-lista-sub">também chamado de {r.via}</span> : null}
                        </span>
                        <span className="lk-selo" data-tom={rg.tom} style={{ marginLeft: 0 }}>
                          {rg.t}
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    className="lk-lista-i"
                    data-k="livre"
                    onClick={() => {
                      this.setT3(sel.k, sel.i, { texto: q.trim(), produto: null });
                      this.setState({ seletor: null });
                    }}
                    data-tx-produto-livre=""
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="lk-lista-t">Não achei o produto</span>
                      <span className="lk-lista-sub">Usar &quot;{q.trim()}&quot; como escrevi. A transportadora classifica.</span>
                    </span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  etapaCheck(ctx) {
    const { v, prox } = ctx;
    const s = this.state;
    const devolvido = this.devolvido(v);
    const vf = v.verificacao;
    // Enviado e não devolvido: as fotos são prova, só a filial pede de novo.
    if (this.feito(v, 'check')) {
      const ck = v.checklist || {};
      return {
        corpo: (
          <>
            <div className="lk-cartao" data-tom="ok">
              <div className="lk-cab-ic">
                <span className="lk-ic-tile" data-tom="ok">{icone('check', 22)}</span>
                <div className="lk-tit">Checklist enviado</div>
              </div>
              <div className="lk-txt">
                {this.naFila('linkChecklist')
                  ? 'Guardado neste celular. Vai para a filial quando o sinal voltar.'
                  : 'Enviado às ' + this.horaFeito(v, 'check') + '. As fotos são a prova da inspeção: para trocar uma, a filial pede por este link.'}
              </div>
            </div>
            {TX.ITENS_CHECKLIST.map((it) => {
              const nao = (ck.itens || {})[it.k] === 'nao';
              return (
                <div key={it.k} className="lk-feito">
                  <span className="lk-feito-mini" style={{ background: CENA[it.k] }} />
                  <span className="lk-feito-ic">{icone(it.k, 20)}</span>
                  <span className="lk-tit-p" style={{ flex: 1 }}>
                    {it.n}
                  </span>
                  <span className="lk-selo" data-tom={nao ? 'aviso' : 'ok'}>
                    {nao ? 'não' : 'sim'}
                  </span>
                </div>
              );
            })}
          </>
        ),
        pode: true,
        rot: 'Continuar',
        acao: prox,
      };
    }
    const so = devolvido ? vf.itens || [] : null;
    const rascunhoServidor = v.checklist && !v.checklist.enviadoEm ? v.checklist : null;
    const base = devolvido ? v.checklist : rascunhoServidor;
    const itens = Object.assign({}, base ? base.itens : {}, s.itens);
    const fotos = {};
    Object.keys((base && base.fotos) || {}).forEach((k) => {
      fotos[k] = { em: rascunhoServidor ? 'antes' : TX.fmt.hora(v.checklist.enviadoEm) };
    });
    if (devolvido) so.forEach((k) => delete fotos[k]);
    Object.assign(fotos, s.fotos);
    const lista = TX.ITENS_CHECKLIST.filter((it) => !so || so.includes(it.k));
    const pronto = (it) => !!(itens[it.k] && fotos[it.k]);
    const abertos = lista.filter((it) => !pronto(it));
    const nProntos = lista.length - abertos.length;
    const corpo = (
      <>
        <div className="lk-cartao" style={{ padding: 16 }} data-tx-ck-progresso="">
          <div className="lk-cab-ic">
            <span className="lk-ic-tile">{icone('check', 22)}</span>
            <div style={{ flex: 1 }}>
              <div className="lk-tit-p">{devolvido ? 'Tire de novo o que a filial pediu' : 'Olhe a carreta e responda'}</div>
              <div className="lk-dica">
                {nProntos} de {lista.length} {lista.length === 1 ? 'item pronto' : 'itens prontos'}
              </div>
            </div>
          </div>
          {lista.length > 1 ? (
            <div className="lk-barra-ck" aria-hidden>
              {lista.map((it) => (
                <span key={it.k} data-k={pronto(it) ? 'ok' : undefined} />
              ))}
            </div>
          ) : null}
          <div className="lk-txt-p" style={{ marginTop: 10 }}>
            {devolvido ? '"' + vf.motivo + '"' : 'Para cada item: responda Sim ou Não e tire uma foto agora. A câmera abre aqui; a galeria, não.'}
          </div>
        </div>
        {lista.map((it) => {
          const r = itens[it.k],
            f = fotos[it.k];
          const n = TX.ITENS_CHECKLIST.indexOf(it) + 1;
          // Item pronto encolhe numa linha com a foto; "Alterar" abre de novo.
          if (pronto(it) && s.aberto !== it.k) {
            return (
              <div key={it.k} className="lk-feito" data-k="pronto" data-realce={s.realce === it.k ? '1' : undefined} data-tx-ck={it.k}>
                <span className="lk-feito-mini" style={{ background: CENA[it.k] }} />
                <span className="lk-feito-ic">{icone(it.k, 20)}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="lk-tit-p" style={{ display: 'block' }}>
                    {it.n}
                  </span>
                  <span className="lk-dica" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r === 'nao' ? 'Não' + (s.obs[it.k] ? ': ' + s.obs[it.k] : '') : 'Sim'}, foto {f.em === 'antes' ? 'já enviada' : f.em}
                  </span>
                </span>
                <button type="button" className="lk-bt lk-bt-txt" onClick={() => this.setState({ aberto: it.k })} data-tx-ck-alterar={it.k}>
                  Alterar
                </button>
              </div>
            );
          }
          return (
            <div key={it.k} className="lk-item" data-k={pronto(it) ? 'pronto' : ''} data-realce={s.realce === it.k ? '1' : undefined} data-tx-ck={it.k}>
              <div className="lk-cab-ic">
                <span className="lk-ic-tile" data-tom={it.critico ? 'tecnico' : undefined}>
                  {icone(it.k, 24)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lk-item-num">
                    {n} DE 5{it.critico ? ', ITEM CRÍTICO' : ''}
                  </div>
                  <div className="lk-tit-p">{it.n}</div>
                </div>
              </div>
              <div className="lk-txt" style={{ marginTop: 10 }}>
                {it.pergunta}
              </div>
              <div className="lk-seg" role="group" aria-label={it.pergunta}>
                <button type="button" className="lk-op" data-k="sim" aria-pressed={r === 'ok'} onClick={() => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'ok' }) })} data-tx-sim={it.k}>
                  {icone('ok', 20)}
                  Sim
                </button>
                <button type="button" className="lk-op" data-k="nao" aria-pressed={r === 'nao'} onClick={() => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'nao' }) })} data-tx-nao={it.k}>
                  {icone('x', 20)}
                  Não
                </button>
              </div>
              {r === 'nao' ? (
                <>
                  <div className={it.critico ? 'lk-erro' : 'lk-aviso'} style={{ marginTop: 8 }}>
                    {SE_NAO[it.k]}
                  </div>
                  <textarea
                    className="lk-campo"
                    style={{ marginTop: 8 }}
                    aria-label={'O que está errado em ' + it.n.toLowerCase() + ' (opcional)'}
                    placeholder="O que está errado? (opcional)"
                    value={s.obs[it.k] || ''}
                    onChange={(e) => this.setState({ obs: Object.assign({}, s.obs, { [it.k]: e.target.value }) })}
                    data-tx-obs={it.k}
                  />
                </>
              ) : null}
              {f ? (
                <div className="lk-mini" style={{ background: CENA[it.k] }}>
                  <span className="lk-mini-carimbo">{f.em === 'antes' ? 'foto já enviada' : 'foto ' + f.em}</span>
                  <button type="button" className="lk-mini-refazer" onClick={() => this.abrirCamera('ck', it.k, it.n, it.foto)} data-tx-foto-ck={it.k}>
                    Tirar de novo
                  </button>
                </div>
              ) : (
                <button type="button" className="lk-enquadre" onClick={() => this.abrirCamera('ck', it.k, it.n, it.foto)} data-tx-foto-ck={it.k}>
                  <span className="lk-enquadre-cena" aria-hidden>
                    <span className="lk-canto" data-c="1" />
                    <span className="lk-canto" data-c="2" />
                    <span className="lk-canto" data-c="3" />
                    <span className="lk-canto" data-c="4" />
                    {icone('camera', 44)}
                  </span>
                  <span className="lk-enquadre-dica">Enquadre: {it.foto}</span>
                  <span className="lk-enquadre-bt">
                    {icone('camera', 20)}
                    Tirar foto
                  </span>
                </button>
              )}
              {pronto(it) && s.aberto === it.k ? (
                <button type="button" className="lk-bt lk-bt-sec lk-bt-bloco" style={{ marginTop: 12 }} onClick={() => this.setState({ aberto: null })}>
                  Pronto
                </button>
              ) : null}
            </div>
          );
        })}
      </>
    );
    const ok = abertos.length === 0;
    return {
      corpo,
      pode: ok,
      rot: devolvido ? 'Reenviar à filial' : 'Enviar checklist',
      falta: (() => {
        const r = lista.filter((it) => !itens[it.k]).length;
        const f = lista.filter((it) => !fotos[it.k]).length;
        const rt = r ? (r === 1 ? '1 resposta' : r + ' respostas') : '';
        const ft = f ? (f === 1 ? '1 foto' : f + ' fotos') : '';
        if (lista.length === 1) return f ? 'Falta a foto' : 'Falta responder';
        return (r + f === 1 ? 'Falta ' : 'Faltam ') + [rt, ft].filter(Boolean).join(' e ');
      })(),
      irFalta: () => abertos[0] && this.rolar('[data-tx-ck="' + abertos[0].k + '"]', abertos[0].k),
      acao: () => {
        const its = {},
          fts = {};
        TX.ITENS_CHECKLIST.forEach((it) => {
          its[it.k] = itens[it.k] || 'ok';
          fts[it.k] = 1;
        });
        const obs = Object.keys(s.obs)
          .filter((k) => its[k] === 'nao' && (s.obs[k] || '').trim())
          .map((k) => TX.ITENS_CHECKLIST.find((x) => x.k === k).n + ': ' + s.obs[k].trim())
          .join('; ');
        this.enviar('linkChecklist', { itens: its, fotos: fts, obs, gps: TX.embarcador(v.embarcador).nome });
        this.setState({ itens: {}, fotos: {}, obs: {}, aberto: null });
        if (devolvido) this.ir('fim');
        else prox();
      },
    };
  }

  etapaManual(ctx) {
    const { v, prox } = ctx;
    const s = this.state;
    const vig = TX.manualVigente(v.data);
    const cartoes = TX.db.manual.cartoes;
    const i = Math.min(s.cartao, cartoes.length - 1);
    const c = cartoes[i];
    const ultimo = i >= cartoes.length - 1;
    const jaLido = this.feito(v, 'manual');
    const corpo = (
      <div
        className="lk-manual"
        data-tx-cartao={i + 1}
        onPointerDown={(e) => (this._arraste = e.clientX)}
        onPointerUp={(e) => {
          if (this._arraste == null) return;
          const dx = e.clientX - this._arraste;
          this._arraste = null;
          if (dx < -50 && !ultimo) this.setState({ cartao: i + 1 });
          if (dx > 50 && i > 0) this.setState({ cartao: i - 1 });
        }}
      >
        <div className="lk-cab-ic">
          <span className="lk-ic-tile">{icone('manual', 22)}</span>
          <span className="lk-sobre">
            Manual v{vig.v}, cartão {i + 1} de {cartoes.length}
          </span>
        </div>
        <div className="lk-tit" style={{ marginTop: 12 }}>
          {c.t}
        </div>
        <div className="lk-txt" style={{ marginTop: 10, lineHeight: 1.6, flex: 1 }}>
          {c.txt}
        </div>
        <div className="lk-dica" style={{ textAlign: 'center', marginTop: 16 }}>
          Arraste para o lado ou toque em {ultimo ? '"Li e entendi"' : '"Próximo cartão"'}.
        </div>
        <div className="lk-pontos" aria-hidden>
          {cartoes.map((_, j) => (
            <span key={j} data-k={j === i ? 'atual' : j < i ? 'lido' : ''} />
          ))}
        </div>
      </div>
    );
    return {
      corpo,
      pode: true,
      rot: !ultimo ? 'Próximo cartão' : jaLido ? 'Continuar' : 'Li e entendi',
      acao: () => {
        if (!ultimo) return this.setState({ cartao: i + 1 });
        if (!jaLido) this.enviar('linkManual', { versao: vig.v });
        this.setState({ cartao: 0 });
        prox();
      },
      voltar: i > 0 ? () => this.setState({ cartao: i - 1 }) : null,
    };
  }

  etapaTermo(ctx) {
    const { v, mot, prox } = ctx;
    const s = this.state;
    if (this.feito(v, 'termo')) {
      return {
        corpo: (
          <div className="lk-cartao" data-tom="ok">
            <div className="lk-tit">Termo assinado</div>
            <div className="lk-txt">
              {TX.db.termo.titulo}, versão {TX.db.termo.versao}.{' '}
              {this.horaFeito(v, 'termo') === 'no celular' ? 'Guardado neste celular.' : 'Assinado às ' + this.horaFeito(v, 'termo') + '.'}
            </div>
          </div>
        ),
        pode: true,
        rot: 'Continuar',
        acao: prox,
      };
    }
    const pts = s.pontos;
    const path = pts.map((q, j) => (q.novo || j === 0 ? 'M' : 'L') + q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join(' ');
    const pos = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const assinado = pts.length > 12;
    const corpo = (
      <div className="lk-cartao">
        <div className="lk-cab-ic">
          <span className="lk-ic-tile">{icone('termo', 22)}</span>
          <div className="lk-tit">{TX.db.termo.titulo}</div>
        </div>
        <div className="lk-dica" style={{ marginTop: 2 }}>
          versão {TX.db.termo.versao}
        </div>
        <div className="lk-txt" style={{ lineHeight: 1.6 }}>
          {TX.db.termo.texto}
        </div>
        <div className="lk-rotulo" style={{ marginTop: 16 }}>
          Assine com o dedo
        </div>
        <div
          className="lk-assinatura"
          data-k={assinado ? 'ok' : ''}
          data-tx-assinatura=""
          onPointerDown={(e) => {
            const q = pos(e);
            this._des = true;
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch (er) {
              /* sem captura */
            }
            this.setState({ pontos: pts.concat([Object.assign(q, { novo: true })]) });
          }}
          onPointerMove={(e) => {
            if (!this._des) return;
            const q = pos(e);
            this.setState((st) => ({ pontos: st.pontos.concat([q]) }));
          }}
          onPointerUp={() => (this._des = false)}
          onPointerLeave={() => (this._des = false)}
        >
          {!pts.length ? <span className="lk-assinatura-vazio">Assine aqui</span> : null}
          <svg width="100%" height="100%">
            <path d={path || 'M0 0'} fill="none" stroke="var(--texto)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="lk-assinatura-nome">
            {mot.nome}, {TX.fmt.data(TX.HOJE)}
          </span>
          {pts.length ? (
            <button type="button" className="lk-bt lk-bt-txt lk-assinatura-limpar" onPointerDown={(e) => e.stopPropagation()} onClick={() => this.setState({ pontos: [] })}>
              Limpar
            </button>
          ) : null}
        </div>
      </div>
    );
    return {
      corpo,
      pode: assinado,
      rot: 'Assinar e enviar',
      falta: 'Assine para enviar',
      irFalta: () => this.rolar('[data-tx-assinatura]'),
      acao: () => {
        this.enviar('linkAssinar', { versao: TX.db.termo.versao });
        this.setState({ pontos: [] });
        prox();
      },
    };
  }

  etapaFim(ctx) {
    const { v, ps, fil, emb } = ctx;
    const s = this.state;
    const pend = s.fila.filter((o) => o.tipo !== 'linkAberto').length > 0;
    const vf = v.verificacao;
    const reenviado = vf && vf.estado === 'devolvida' && (vf.reenviadoEm || this.naFila('linkChecklist'));
    const docsFaltam = this.docsFaltando(v);
    const faltaDoc = docsFaltam.length > 0 && !this.naFila('linkDocs');
    const afretador = TX.usuario(fil.afretador).nome.split(' ')[0];
    const aprovada = vf && vf.estado === 'aprovada';
    const lista = ps.filter((k) => k !== 'capa' && k !== 'fim');
    const titulo = pend ? 'Guardado no celular' : reenviado ? 'Foto nova enviada' : 'Enviado à filial ' + fil.nome;
    const sub = pend
      ? 'Está guardado neste celular. Quando tiver sinal, vai sozinho; se fechar a página, abra o link de novo para terminar o envio.'
      : 'Pode fechar esta página. Se a filial precisar de algo, este mesmo link mostra o que fazer.';
    const depois = [
      aprovada
        ? { ok: true, t: 'A filial conferiu e aprovou às ' + TX.fmt.hora(vf.em) + '.' }
        : { t: reenviado ? 'A filial confere a foto nova.' : 'A filial confere as fotos e as cargas anteriores. Costuma levar poucos minutos.' },
      { t: 'Se precisar de foto nova, ' + afretador + ' avisa pelo WhatsApp e este link mostra só o que refazer.' },
      { t: 'Com tudo certo, a carga fica liberada para ' + emb.nome + ', ' + TX.fmt.extenso(v.data) + ', a partir das ' + v.janela + '.' },
    ];
    const corpo = (
      <>
        <div className="lk-cartao" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '28px 20px' }} data-tx-fim="">
          {pend ? (
            <span className="lk-fim-ic" data-tom="aviso">
              {icone('nuvem', 32)}
            </span>
          ) : (
            IL_CAMINHAO
          )}
          <div className="lk-tit" style={{ marginTop: 16 }}>
            {titulo}
          </div>
          <div className="lk-txt">{sub}</div>
        </div>
        {faltaDoc ? (
          <div className="lk-cartao" data-tom="aviso">
            <div className="lk-tit-p">Ainda falta: {docsFaltam.map((d) => d.n).join(', ')}</div>
            <div className="lk-txt-p" style={{ marginTop: 4 }}>
              Sem o documento em dia a carga não é liberada.
            </div>
            <button type="button" className="lk-bt lk-bt-pri lk-bt-bloco" style={{ marginTop: 12 }} onClick={() => this.ir('docs')} data-tx-fim-docs="">
              Mandar a foto agora
            </button>
          </div>
        ) : null}
        <div className="lk-cartao">
          <div className="lk-tit-p">O que acontece agora</div>
          <div className="lk-depois">
            {depois.map((d, i) => (
              <div key={i} className="lk-depois-i" data-k={d.ok ? 'ok' : undefined}>
                <span className="lk-depois-n">{d.ok ? '✓' : i + 1}</span>
                <span>{d.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lk-cartao" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {lista.map((k) => {
            const h = this.horaFeito(v, k);
            const adiado = k === 'docs' && faltaDoc;
            return (
              <div key={k} className="lk-linha">
                <span>{NOMES[k]}</span>
                <span className="lk-linha-v" data-k={adiado || h === 'no celular' ? 'fila' : undefined}>
                  {adiado ? 'falta' : h === 'no celular' ? 'no celular' : h || 'feito'}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
    return { corpo, pode: true, semBotao: true };
  }

  // ------------------------------------------------------------------ desenho
  render() {
    const s = this.state;
    const v = this.v();
    const F = TX.fmt;
    const mot = TX.pessoa(v.motorista),
      prod = TX.produto(v.produto),
      emb = TX.embarcador(v.embarcador),
      fil = TX.filial(v.filial);
    const conj = TX.conjunto(v.conjunto);
    const comps = TX.compsDoConjunto(conj);
    const ps = this.passos(v);
    const naoEnviado = !v.link.enviadoEm;
    const p = naoEnviado ? 'capa' : this.passoAtual(v, ps);
    this._passo = naoEnviado ? 'nao_enviado' : p;
    const idx = ps.indexOf(p);
    const prox = () => {
      // Avança para a próxima etapa que ainda falta; se nada falta, fim.
      const resto = ps.slice(idx + 1).find((k) => k === 'fim' || (!this.feito(this.v(), k) && !(k === 'docs' && this.state.docsDepois)));
      this.ir(resto || 'fim');
    };
    const ctx = { v, ps, mot, fil, emb, conj, comps, prox };
    const et = naoEnviado
      ? null
      : {
          capa: () => this.etapaCapa(ctx),
          id: () => this.etapaId(ctx),
          docs: () => this.etapaDocs(ctx),
          t3: () => this.etapaT3(ctx),
          check: () => this.etapaCheck(ctx),
          manual: () => this.etapaManual(ctx),
          termo: () => this.etapaTermo(ctx),
          fim: () => this.etapaFim(ctx),
        }[p]();
    const meio = ps.filter((k) => k !== 'capa' && k !== 'fim');
    const mostraProgresso = !naoEnviado && p !== 'capa' && p !== 'fim';
    const nEtapa = meio.indexOf(p) + 1;
    const filaN = s.fila.filter((o) => o.tipo !== 'linkAberto').length;
    const voltar = et && et.voltar ? et.voltar : idx > 0 && p !== 'capa' && p !== 'fim' ? () => this.ir(ps[idx - 1]) : null;
    const cam = s.camera;

    return (
      <div className="lk-pagina" data-screen-label="Link da viagem" data-tela="LinkDaViagem" data-tx-passo={this._passo}>
        <div className="lk-app">
          {mostraProgresso ? (
            <header className="lk-topo lk-topo-curto">
              <div className="lk-topo-linha">
                <span className="lk-marca" aria-hidden>
                  TR
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lk-empresa">
                    Etapa {nEtapa} de {meio.length}: {NOMES[p]}
                  </div>
                  <div className="lk-empresa-sub">
                    {prod.nome}, {v.janela}
                  </div>
                </div>
                {s.offline ? (
                  <span className="lk-sinal" data-tx-sinal="off" role="status">
                    <span className="lk-sinal-dot" />
                    sem sinal
                  </span>
                ) : null}
                <button type="button" className="lk-carga-bt" aria-expanded={!!s.cargaAberta} onClick={() => this.setState({ cargaAberta: !s.cargaAberta })} data-tx-carga-bt="">
                  Carga
                  <span className="lk-carga-seta" data-aberta={s.cargaAberta ? '1' : undefined}>
                    {icone('seta', 16)}
                  </span>
                </button>
              </div>
              {s.cargaAberta ? (
                <div className="lk-carga">
                  <div className="lk-carga-t">
                    {prod.nome}, {F.peso(v.peso)}
                  </div>
                  <div className="lk-carga-sub">
                    {emb.nome}, {F.extenso(v.data)}, {v.janela}
                  </div>
                  <div className="lk-placas">{TX.placasDoConjunto(conj).join('  ')}</div>
                  <div className="lk-carga-sub" style={{ marginTop: 6 }}>
                    {TX.db.tenant.nome}, filial {fil.nome}, afretador {TX.usuario(fil.afretador).nome.split(' ')[0]}
                  </div>
                </div>
              ) : null}
              <div className="lk-progresso" aria-hidden>
                {meio.map((k) => (
                  <span key={k} data-k={k === p ? 'atual' : this.feito(v, k) ? 'feito' : ''} />
                ))}
              </div>
            </header>
          ) : (
            <header className="lk-topo">
              <div className="lk-topo-linha">
                <span className="lk-marca" aria-hidden>
                  TR
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lk-empresa">{TX.db.tenant.nome}</div>
                  <div className="lk-empresa-sub">
                    filial {fil.nome}, afretador {TX.usuario(fil.afretador).nome.split(' ')[0]}
                  </div>
                </div>
                {s.offline ? (
                  <span className="lk-sinal" data-tx-sinal="off" role="status">
                    <span className="lk-sinal-dot" />
                    sem sinal
                  </span>
                ) : null}
              </div>
              <div className="lk-carga">
                <div className="lk-carga-t">
                  {prod.nome}, {F.peso(v.peso)}
                </div>
                <div className="lk-carga-sub">
                  {emb.nome}, {F.extenso(v.data)}, {v.janela}
                </div>
                <div className="lk-placas">{TX.placasDoConjunto(conj).join('  ')}</div>
              </div>
            </header>
          )}

          {s.offline ? (
            <div className="lk-offline" data-tx-offline="" role="status">
              <span className="lk-offline-dot" />
              <span>
                {filaN
                  ? 'Sem sinal. ' + filaN + (filaN === 1 ? ' etapa guardada' : ' etapas guardadas') + ' no celular; vão sozinhas quando o sinal voltar.'
                  : 'Sem sinal. Pode continuar: o que fizer fica guardado no celular.'}
              </span>
              {!this.embutido() ? (
                <button type="button" className="lk-demo" onClick={() => this.setOffline(false)} data-tx-sinal="off">
                  Demonstração: sinal de volta
                </button>
              ) : null}
            </div>
          ) : null}

          <main className="lk-corpo" key={p + (p === 'manual' ? s.cartao : '')}>
            {naoEnviado ? (
              <div className="lk-cartao">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{IL_CELULAR}</div>
                <div className="lk-tit">Este link ainda não foi enviado</div>
                <div className="lk-txt">Na operação real, o motorista só recebe o link depois que o afretador manda a mensagem pelo WhatsApp.</div>
                <button
                  type="button"
                  className="lk-bt lk-bt-pri lk-bt-bloco"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    TX.fazer('enviarLink', { id: v.id, canal: 'copiado' });
                    TX.fazer('linkAberto', { id: v.id, porMotorista: true });
                  }}
                  data-tx-simular-envio=""
                >
                  Simular envio pelo afretador
                </button>
              </div>
            ) : (
              et.corpo
            )}
          </main>

          {et && !et.semBotao ? (
            <div className="lk-rodape">
              {voltar ? (
                <button type="button" className="lk-bt lk-bt-sec" onClick={voltar} data-tx-voltar="">
                  Voltar
                </button>
              ) : null}
              <button
                type="button"
                className="lk-bt lk-bt-pri"
                data-pronto={et.pode ? undefined : 'nao'}
                aria-describedby={et.pode ? undefined : 'lk-falta'}
                onClick={() => (et.pode ? et.acao() : et.irFalta && et.irFalta())}
                data-tx-avancar=""
              >
                {et.pode || !et.falta ? et.rot : et.falta}
              </button>
              {!et.pode && et.falta ? (
                <span id="lk-falta" className="tx-so-leitor">
                  Tocar leva até o que falta.
                </span>
              ) : null}
            </div>
          ) : null}

          {this.folhaProduto()}

          {cam ? (
            <div className="lk-camera" role="dialog" aria-modal="true" aria-label={'Câmera: ' + cam.titulo} data-tx-camera={cam.fase}>
              <div className="lk-camera-topo">
                <div className="lk-camera-t">{cam.fase === 'mirar' ? 'Foto: ' + cam.titulo : 'Ficou boa?'}</div>
                <div className="lk-camera-sub">{cam.fase === 'mirar' ? 'Enquadre ' + cam.dica + '.' : 'Dá para ver tudo, com foco e sem reflexo?'}</div>
              </div>
              <div className="lk-visor">
                <div className="lk-visor-cena" style={{ background: CENA[cam.alvo === 'doc' ? 'doc' : cam.k] }} />
                {cam.fase === 'mirar' ? (
                  <>
                    <div className="lk-visor-guia" />
                    <div className="lk-visor-dica">
                      <span>só câmera, sem galeria</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lk-flash" />
                    <div className="lk-visor-carimbo">
                      {F.data(TX.HOJE)} {cam.em}
                      <br />
                      {emb.nome}
                    </div>
                  </>
                )}
              </div>
              {cam.fase === 'mirar' ? (
                <div className="lk-camera-base">
                  <button type="button" className="lk-bt lk-bt-txt" onClick={() => this.setState({ camera: null })} data-tx-camera-cancelar="">
                    Cancelar
                  </button>
                  <button type="button" className="lk-disparo" aria-label="Tirar foto" onClick={() => this.disparar()} data-tx-camera-disparar="" />
                  <span />
                </div>
              ) : (
                <div className="lk-camera-ver">
                  <button type="button" className="lk-bt lk-bt-sec" onClick={() => this.setState({ camera: Object.assign({}, cam, { fase: 'mirar' }) })} data-tx-camera-refazer="">
                    Tirar de novo
                  </button>
                  <button type="button" className="lk-bt lk-bt-pri" onClick={() => this.usarFoto()} data-tx-camera-usar="">
                    Usar esta foto
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {s.toast ? (
            <div className="lk-toast" data-tx-toast="" role="status" aria-live="polite">
              {s.toast}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
