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

const Ic = {
  camera: (
    <svg aria-hidden width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M2.5 5.5h2l1-1.6h5l1 1.6h2v7h-11z" />
      <circle cx="8" cy="9" r="2.2" />
    </svg>
  ),
  ok: (
    <svg aria-hidden width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  ),
  nuvem: (
    <svg aria-hidden width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5h7a3 3 0 0 0 .4-6A4 4 0 0 0 4.2 7.6 2.5 2.5 0 0 0 4.5 12.5z" />
      <line x1="2" y1="2" x2="14" y2="14" />
    </svg>
  ),
};

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
                  <span className="lk-passo-n">{feito ? '✓' : i + 1}</span>
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
            <div className="lk-tit">Identidade confirmada</div>
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
    const ok = s.cpfIn.length === 3 && s.cpfIn === TX.soDigitos(mot.cpf).slice(0, 3);
    const errado = s.cpfIn.length === 3 && !ok;
    const corpo = (
      <div className="lk-cartao">
        <div className="lk-tit">É você mesmo?</div>
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
          <div className="lk-tit">Falta um documento seu</div>
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
                <button type="button" className="lk-foto" onClick={() => this.abrirCamera('doc', d.k, d.n, 'documento inteiro, sem reflexo')} data-tx-doc={d.k}>
                  {Ic.camera}
                  Tirar foto
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
  etapaT3(ctx) {
    const { v, comps, prox } = ctx;
    const s = this.state;
    const F = TX.fmt;
    const inicial = this.t3Inicial(v, comps);
    const t3 = s.t3 || inicial;
    const jaEnviado = this.feito(v, 't3');
    const mudou = JSON.stringify(t3) !== JSON.stringify(inicial);
    const set = (key, i, campo, val) => {
      const n = JSON.parse(JSON.stringify(t3));
      n[key][i][campo] = val;
      if (campo === 'texto') n[key][i].produto = (TX.produtoPorTexto(val) || {}).id || null;
      this.setState({ t3: n });
    };
    // Linha certa: data antes desta carga, depois da linha de baixo (mais antiga), e o que carregou.
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
              <div className="lk-tit-p">
                O que a carreta <span className="lk-mono">{c.placa}</span>
                {dupla ? ' (compartimento ' + c.pos + ')' : ''} carregou nas últimas 3 viagens?
              </div>
              <div className="lk-dica" style={{ marginTop: 4 }}>
                Da mais recente para a mais antiga. Vale qualquer carga, não só ração.
              </div>
              {ant ? (
                <button
                  type="button"
                  className="lk-bt lk-bt-txt"
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {linhas.map((l, i) => {
                  const key = c.key + '-' + i;
                  const pr = l.produto ? TX.produto(l.produto) : null;
                  const sugs = !pr && (l.texto || '').length >= 2 ? TX.buscarProdutos(l.texto, 3) : [];
                  const ed = erroData(linhas, i);
                  let msg = null;
                  if (ed) msg = <div className="lk-erro">{ed}</div>;
                  else if (pr && pr.regime === 'X') msg = <div className="lk-erro">Carga proibida para quem leva ração. O afretador vai falar com você.</div>;
                  else if (pr) msg = <div className="lk-okmsg">Entendido: {pr.nome + (pr.regime !== 'A' ? ', pede lavagem (regime ' + pr.regime + ')' : '')}</div>;
                  else if (l.texto && !sugs.length) msg = <div className="lk-aviso">Não achamos na lista. Vai como está e a transportadora confere.</div>;
                  return (
                    <div key={key} className="lk-t3-linha" data-k={linhaOk(linhas, i) ? 'ok' : ''} data-realce={s.realce === key ? '1' : undefined} data-tx-t3-linha={key}>
                      <div className="lk-t3-cab">
                        <span className="lk-t3-rot">{i === 0 ? 'ÚLTIMA' : i === 1 ? 'PENÚLTIMA' : 'ANTEPENÚLTIMA'}</span>
                      </div>
                      <div className="lk-t3-grade">
                        <input
                          type="date"
                          className="lk-campo"
                          aria-label={'Data da ' + (i === 0 ? 'última' : i === 1 ? 'penúltima' : 'antepenúltima') + ' carga'}
                          value={l.data || ''}
                          max={ontem}
                          onChange={(e) => set(c.key, i, 'data', e.target.value)}
                          data-estado={ed ? 'erro' : undefined}
                          data-tx-t3-data={key}
                        />
                        <input
                          className="lk-campo"
                          aria-label={'O que carregou na ' + (i === 0 ? 'última' : i === 1 ? 'penúltima' : 'antepenúltima') + ' viagem'}
                          value={l.texto || ''}
                          onChange={(e) => set(c.key, i, 'texto', e.target.value)}
                          data-tx-t3-produto={key}
                          placeholder="Ex.: soja, adubo, casquinha"
                          autoComplete="off"
                        />
                      </div>
                      {msg}
                      {sugs.length ? (
                        <div className="lk-sugs">
                          {sugs.map((r) => (
                            <button type="button" key={r.produto.id} className="lk-sug" onClick={() => set(c.key, i, 'texto', r.produto.nome)} data-tx-sug={r.produto.id}>
                              {r.produto.nome}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
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
              <div className="lk-tit">Checklist enviado</div>
              <div className="lk-txt">
                {this.naFila('linkChecklist')
                  ? 'Guardado neste celular. Vai para a filial quando o sinal voltar.'
                  : 'Enviado às ' + this.horaFeito(v, 'check') + '. As fotos são a prova da inspeção: para trocar uma, a filial pede por este link.'}
              </div>
            </div>
            {TX.ITENS_CHECKLIST.map((it) => (
              <div key={it.k} className="lk-cartao" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 56, height: 44, borderRadius: 10, background: CENA[it.k], flex: 'none' }} />
                <span className="lk-tit-p" style={{ flex: 1 }}>
                  {it.n}
                </span>
                <span className="lk-selo" data-tom={(ck.itens || {})[it.k] === 'nao' ? 'aviso' : 'ok'}>
                  {(ck.itens || {})[it.k] === 'nao' ? 'não' : 'sim'}
                </span>
              </div>
            ))}
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
    const abertos = lista.filter((it) => !(itens[it.k] && fotos[it.k]));
    const corpo = (
      <>
        <div className="lk-cartao" style={{ padding: 16 }}>
          <div className="lk-tit-p">{devolvido ? 'Tire de novo só o que a filial pediu' : 'Olhe a carreta e responda'}</div>
          <div className="lk-txt-p" style={{ marginTop: 4 }}>
            {devolvido
              ? '"' + vf.motivo + '"'
              : 'Uma foto por item, tirada agora: a câmera abre aqui mesmo, a galeria não. A foto leva hora e local.'}
          </div>
        </div>
        {lista.map((it) => {
          const r = itens[it.k],
            f = fotos[it.k];
          const pronto = !!(r && f);
          return (
            <div key={it.k} className="lk-item" data-k={pronto ? 'pronto' : ''} data-realce={s.realce === it.k ? '1' : undefined} data-tx-ck={it.k}>
              <div className="lk-item-topo">
                <span className="lk-item-num">{TX.ITENS_CHECKLIST.indexOf(it) + 1} DE 5</span>
                <span className="lk-tit-p">{it.n}</span>
                {it.critico ? (
                  <span className="lk-selo" data-tom="tecnico">
                    item crítico
                  </span>
                ) : null}
                {pronto ? (
                  <span className="lk-selo" data-tom="ok">
                    pronto
                  </span>
                ) : null}
              </div>
              <div className="lk-txt-p" style={{ marginTop: 6 }}>
                {it.pergunta}
              </div>
              <div className="lk-ops" role="group" aria-label={it.pergunta}>
                <button type="button" className="lk-op" data-k="sim" aria-pressed={r === 'ok'} onClick={() => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'ok' }) })} data-tx-sim={it.k}>
                  Sim
                </button>
                <button type="button" className="lk-op" data-k="nao" aria-pressed={r === 'nao'} onClick={() => this.setState({ itens: Object.assign({}, s.itens, { [it.k]: 'nao' }) })} data-tx-nao={it.k}>
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
                <>
                  <button type="button" className="lk-foto" onClick={() => this.abrirCamera('ck', it.k, it.n, it.foto)} data-tx-foto-ck={it.k}>
                    {Ic.camera}
                    Tirar foto
                  </button>
                  <div className="lk-dica" style={{ marginTop: 6 }}>
                    Enquadre: {it.foto}.
                  </div>
                </>
              )}
            </div>
          );
        })}
      </>
    );
    const ok = abertos.length === 0;
    const faltaTxt = (it) => (!itens[it.k] ? 'responder' : 'foto');
    return {
      corpo,
      pode: ok,
      rot: devolvido ? 'Reenviar à filial' : 'Enviar checklist',
      falta:
        abertos.length === 1
          ? lista.length === 1
            ? 'Falta ' + (faltaTxt(abertos[0]) === 'foto' ? 'a foto' : 'responder')
            : 'Falta 1 item'
          : 'Faltam ' + abertos.length + ' de ' + lista.length + ' itens',
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
        this.setState({ itens: {}, fotos: {}, obs: {} });
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
      <div className="lk-manual" data-tx-cartao={i + 1}>
        <span className="lk-sobre">
          Manual v{vig.v}, cartão {i + 1} de {cartoes.length}
        </span>
        <div className="lk-tit" style={{ marginTop: 12 }}>
          {c.t}
        </div>
        <div className="lk-txt" style={{ marginTop: 10, lineHeight: 1.6, flex: 1 }}>
          {c.txt}
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
        <div className="lk-tit">{TX.db.termo.titulo}</div>
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
      falta: 'Assine no quadro para enviar',
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
          <span className="lk-fim-ic" data-tom={pend ? 'aviso' : undefined}>
            {pend ? Ic.nuvem : Ic.ok}
          </span>
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
              <button
                type="button"
                className="lk-sinal"
                data-tx-sinal={s.offline ? 'off' : 'on'}
                onClick={() => this.setOffline(!s.offline)}
                title="Demonstração: tocar simula a falta de sinal"
                aria-label={(s.offline ? 'Sem sinal' : 'Com sinal') + '. Demonstração: tocar alterna'}
              >
                <span className="lk-sinal-dot" />
                {s.offline ? 'sem sinal' : 'com sinal'}
              </button>
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
            {mostraProgresso ? (
              <>
                <div className="lk-progresso" aria-hidden>
                  {meio.map((k) => (
                    <span key={k} data-k={k === p ? 'atual' : this.feito(v, k) ? 'feito' : ''} />
                  ))}
                </div>
                <div className="lk-progresso-txt">
                  <span>
                    Etapa {nEtapa} de {meio.length}
                  </span>
                  <span>{NOMES[p]}</span>
                </div>
              </>
            ) : null}
          </header>

          {s.offline ? (
            <div className="lk-offline" data-tx-offline="" role="status">
              <span className="lk-offline-dot" />
              <span>
                {filaN
                  ? 'Sem sinal. ' + filaN + (filaN === 1 ? ' etapa guardada' : ' etapas guardadas') + ' no celular; vão sozinhas quando o sinal voltar.'
                  : 'Sem sinal. Pode continuar: o que fizer fica guardado no celular.'}
              </span>
            </div>
          ) : null}

          <main className="lk-corpo" key={p + (p === 'manual' ? s.cartao : '')}>
            {naoEnviado ? (
              <div className="lk-cartao">
                <div className="lk-tit">Este link ainda não foi enviado</div>
                <div className="lk-txt">Na operação real, o motorista só recebe o link depois que o afretador manda a mensagem pelo WhatsApp.</div>
                <button
                  type="button"
                  className="lk-bt lk-bt-pri lk-bt-bloco"
                  style={{ marginTop: 16 }}
                  onClick={() => {
                    TX.fazer('enviarLink', { id: v.id, canal: 'copiado' });
                    TX.fazer('linkAberto', { id: v.id, porMotorista: true });
                    this.avisar('Link enviado e aberto. A mesa da filial já mostra.');
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
                  <button type="button" className="lk-disparo" aria-label="Tirar a foto" onClick={() => this.disparar()} data-tx-camera-disparar="" />
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
