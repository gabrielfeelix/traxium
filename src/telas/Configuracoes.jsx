// Configurações: uma seção por vez, escolhida no índice da esquerda (abas verticais, ?secao=).
// Usuários, alçadas, regras, modelos, LGPD, integrações e os dados da demonstração.
'use client';
import { TX, Tela } from '@/lib/tx/tela';
import {
  Botao,
  Campo,
  Entrada,
  Chip,
  OpcaoCartao,
  Situacao,
  Badge,
  Aviso,
  Tabela,
  TabelaCabecalho,
  TabelaLinha,
  Cartao,
  Linha,
  CabecalhoPagina,
  Modal,
  Drawer,
  textoFalta,
} from '@/components/ui';
import './Configuracoes.css';

// Permissão do usuário da sessão (matriz em tx-dados.js). Sem a API carregada, só Qualidade e Direção mexem.
const GESTAO = ['qualidade', 'direcao'];
const pode = (op, alvo) => (TX.pode ? TX.pode(op, alvo) : GESTAO.includes((TX.sessao() || {}).papel));
const porque = (op, alvo) => (TX.porque ? TX.porque(op, alvo) : 'Só Qualidade e Direção mudam isto.');

// Aviso da moldura com ação (Desfazer). Sem a moldura, cai no aviso simples.
function avisarComAcao(tela, texto, acao, onAcao) {
  if (TX.ui.moldura) window.dispatchEvent(new CustomEvent('tx-aviso', { detail: { texto, acao, onAcao } }));
  else TX.ui.avisar(tela, texto);
}

const SEC = [
  ['usuarios', 'Usuários e papéis'],
  ['alcadas', 'Alçadas'],
  ['regras', 'Regras'],
  ['modelos', 'Modelos'],
  ['lgpd', 'LGPD e retenção'],
  ['integracoes', 'Integrações'],
  ['dados', 'Dados da demonstração'],
];
const PAPEIS = [
  ['afretador', 'Afretador', 'Monta e acompanha as viagens de uma filial. Sem alçada de liberação.'],
  ['qualidade', 'Gestor da qualidade', 'Todas as filiais. Libera pendência corrigível.'],
  ['frota', 'Gestor de frota', 'Todas as filiais. Cuida da frota própria e dos documentos dela.'],
  ['consultoria', 'Consultoria externa', 'Todas as filiais, só leitura e exportação.'],
];
// ANTT e base GMP+ ainda não consultam nada: a tela diz isso, qualquer que seja a semente.
const NAO_CONECTADAS = ['antt', 'gmp'];

const COLS_USU = 'minmax(0,1.7fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr) 140px';
const COLS_ALC = '200px minmax(0,2fr) minmax(0,1fr)';
const COLS_REGRA = 'minmax(0,1.6fr) minmax(0,1fr) 220px';
const COLS_MOD = 'minmax(0,1fr) minmax(0,2fr) 96px';
const COLS_INT = 'minmax(0,1.6fr) 180px';

const CADEADO = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" />
    <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
  </svg>
);
const SETA_DIR = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="tx-cfg-seta"
    aria-hidden
  >
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

export default class Configuracoes extends Tela {
  state = { loading: true, modal: null, drawer: null, secao: 'usuarios' };
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
    const sec = TX.ui.param('secao');
    if (SEC.some((x) => x[0] === sec)) setTimeout(() => this.irSecao(sec), 300);
  }
  componentWillUnmount() {
    if (this._rolagem) this._rolagem.removeEventListener('scroll', this._spy);
    super.componentWillUnmount();
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  irSecao(k) {
    this._spyPausa = Date.now() + 900;
    this.setState({ secao: k });
    const el = document.getElementById('sec-' + k);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt,
      u = TX.sessao(),
      db = TX.db;
    const regra = s.modal && s.modal.regra ? db.config.regras.find((r) => r.k === s.modal.regra) : null;
    const reset = s.modal && s.modal.reset,
      conv = s.modal && s.modal.convite,
      desat = s.modal && s.modal.desativar ? TX.usuario(s.modal.desativar) : null;
    const cv = s.cv || {},
      emailTxt = (cv.email || '').trim(),
      emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailTxt),
      emailNovo = !db.usuarios
        .concat(db.convitesUsuario.filter((x) => x.estado === 'enviado'))
        .some((x) => x.email.toLowerCase() === emailTxt.toLowerCase());
    const todas = db.filiais.map((f) => f.id);
    const setCv = (o) => this.setState({ cv: Object.assign({}, cv, o) });
    const escopo = (fs) => (fs.length === db.filiais.length ? 'Todas as filiais' : fs.map((f) => TX.filial(f).nome).join(', '));

    // Faltas de cada modal: [chave do campo, nome curto]. O primário inativo leva ao primeiro.
    let faltas = [];
    if (conv) {
      if ((cv.nome || '').trim().length < 5) faltas.push(['nome', 'nome completo']);
      if (!emailOk) faltas.push(['email', 'e-mail']);
      else if (!emailNovo) faltas.push(['email', 'e-mail sem acesso']);
      if (!cv.papel) faltas.push(['papel', 'papel']);
      if (cv.papel === 'afretador' && !cv.filial) faltas.push(['filial', 'filial']);
    } else if (!reset && (s.fMotivo || '').trim().length < 10) faltas.push(['motivo', 'motivo com 10 letras ou mais']);
    const okM = faltas.length === 0;

    const podeRegra = pode('classeRegra'),
      podeConvidar = pode('convidarUsuario'),
      podeCancelar = pode('cancelarConviteUsuario'),
      podeEditar = pode('editarUsuario'),
      podeReset = GESTAO.includes(u.papel);

    const usuarios = db.usuarios.map((x) => ({
      id: x.id,
      nome: x.nome,
      ini: F.iniciais(x.nome),
      email: x.email,
      cargo: x.cargo,
      papel: x.papel,
      ativo: x.ativo !== false,
      escopo: escopo(x.filiais),
      filiais: x.filiais,
      alcada: x.alcada ? (db.alcadas.find((a) => a.k === x.alcada) || {}).n : 'Sem alçada',
      voce: x.id === u.id,
      abrir: () => this.setState({ drawer: { usuario: x.id } }),
    }));
    const dUsu = s.drawer && s.drawer.usuario ? usuarios.find((x) => x.id === s.drawer.usuario) : null;
    const ed = s.ed || {};

    return Object.assign({}, U.base(this), {
      secao: s.secao,
      secoes: SEC.map(([k, n]) => ({ k, n, on: s.secao === k, onClick: () => this.irSecao(k) })),
      podeRegra,
      porqueRegra: porque('classeRegra'),
      podeConvidar,
      podeCancelar,
      podeEditar,
      podeReset,
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
            enviado: 'enviado ' + F.quando(x.em),
            escopo: escopo(x.filiais),
            cancelar: () => {
              TX.fazer('cancelarConviteUsuario', { convite: x.id });
              avisarComAcao(this, 'Convite de ' + x.nome + ' cancelado. O link enviado deixa de valer.', 'Desfazer', () => {
                TX.fazer('convidarUsuario', { nome: x.nome, email: x.email, papel: x.papel, filiais: x.filiais });
                this.avisar('Convite de ' + x.nome + ' enviado de novo.');
              });
            },
          };
        }),
      usuarios,
      dUsu,
      editando: !!(s.drawer && s.drawer.editar),
      ed,
      comecarEdicao: () =>
        dUsu &&
        this.setState({
          drawer: { usuario: dUsu.id, editar: true },
          ed: { papel: dUsu.papel, filial: dUsu.filiais.length === 1 ? dUsu.filiais[0] : null },
        }),
      setEd: (o) => this.setState({ ed: Object.assign({}, ed, o) }),
      salvarEdicao: () => {
        if (!dUsu) return;
        if (ed.papel === 'afretador' && !ed.filial) {
          const el = document.querySelector('[data-tx-drawer] [data-tx-ed-filial]');
          if (el) el.focus();
          return;
        }
        try {
          TX.fazer('editarUsuario', { usuario: dUsu.id, papel: ed.papel, filiais: ed.papel === 'afretador' ? [ed.filial] : todas });
          this.setState({ drawer: { usuario: dUsu.id } });
          this.avisar('Papel de ' + dUsu.nome + ' alterado. Vale no próximo acesso.');
        } catch (e) {
          this.avisar('Não gravado: a edição de usuário ainda não existe no motor desta demonstração.');
        }
      },
      cancelarEdicao: () => dUsu && this.setState({ drawer: { usuario: dUsu.id } }),
      entrarComo: (x) => {
        TX.entrarComo(x.id);
        this.setState({ drawer: null });
        this.avisar('Agora você está como ' + x.nome + '.');
      },
      abrirDesativar: (x) => this.setState({ modal: { desativar: x.id }, fMotivo: '' }),
      alcadas: db.alcadas.map((a) => ({
        k: a.k,
        n: a.n,
        libera: a.libera,
        tom: a.k === 'tecnico' ? 'tecnico' : a.k === 'direcao' ? 'autoridade' : 'ok',
        quem:
          a.k === 'tecnico'
            ? 'Ninguém'
            : db.usuarios
                .filter((x) => x.alcada === a.k)
                .map((x) => x.nome)
                .join(', '),
      })),
      regras: db.config.regras.map((r) => ({
        k: r.k,
        n: r.n,
        base: r.base,
        travada: r.travada,
        classe: r.classe,
        sub: r.travada
          ? 'Exigência da norma'
          : r.alteradaEm
            ? 'Alterada por ' + TX.usuario(r.alteradaPor).nome + ' ' + F.quando(r.alteradaEm) + ': ' + r.motivo
            : r.piso === 'alerta'
              ? 'Regra interna'
              : 'Regra interna, fica em bloqueio',
        classes: ['bloqueio', 'alerta'].map((cl) => {
          const on = r.classe === cl;
          const permitida = cl === 'bloqueio' || r.piso === 'alerta';
          return {
            k: cl,
            n: cl === 'bloqueio' ? 'Bloqueia' : 'Só alerta',
            on,
            inativo: !permitida,
            onClick: () => {
              if (on) return;
              if (!permitida) {
                this.avisar('Esta regra fica em bloqueio.');
                return;
              }
              this.setState({ modal: { regra: r.k, classe: cl }, fMotivo: '' });
            },
          };
        }),
      })),
      modelos: [
        { k: 'cte', n: 'Declaração positiva do CT-e', v: 'texto fixo', txt: TX.DECLARACAO_CTE, mono: true },
        { k: 'termo', n: db.termo.titulo, v: 'versão ' + db.termo.versao, txt: db.termo.texto },
        {
          k: 'checklist',
          n: 'Checklist do compartimento',
          v: '5 itens',
          txt: TX.ITENS_CHECKLIST.map((i) => i.n + ': ' + i.pergunta).join(' '),
        },
        { k: 'link', n: 'Mensagem do link ao motorista', v: 'WhatsApp', txt: TX.mensagemLink(TX.viagem('VG-3122')) },
      ].map((m) =>
        Object.assign(m, {
          abrir: () => this.setState({ drawer: { modelo: m.k } }),
          copiar: (e) => {
            if (e) e.stopPropagation();
            U.copiar(m.txt);
            this.avisar('Modelo copiado: ' + m.n.toLowerCase() + '.');
          },
        }),
      ),
      lgpd: [
        { l: 'Base legal', v: db.config.lgpd.base },
        { l: 'Finalidade', v: db.config.lgpd.finalidade },
        { l: 'Retenção', v: db.config.retencaoAnos + ' anos após a viagem (a norma pede 3)' },
      ],
      integracoes: db.config.integracoes.map((i) => {
        const nc = NAO_CONECTADAS.includes(i.k);
        return {
          k: i.k,
          n: i.n,
          sub: nc ? 'Planejada. Hoje a conferência é manual, no cadastro.' : i.sub,
          tom: nc ? 'na' : i.estado === 'ativo' ? 'ok' : 'falta',
          e: nc ? 'Não conectada' : i.estado === 'ativo' ? 'Ativa' : 'Importação manual',
        };
      }),
      nOps: TX.ops.length,
      abrirReset: () => this.setState({ modal: { reset: true } }),
      // modal
      mConvite: !!conv,
      cvNome: cv.nome || '',
      cvEmail: cv.email || '',
      cvEmailErro: emailTxt && emailOk && !emailNovo ? 'Esse e-mail já tem acesso ou convite pendente.' : '',
      onCvNome: (e) => setCv({ nome: e.target.value }),
      onCvEmail: (e) => setCv({ email: e.target.value }),
      cvPapeis: PAPEIS.map(([k, n, sub]) => ({
        k,
        n,
        sub,
        on: cv.papel === k,
        onClick: () => setCv({ papel: k, filial: k === 'afretador' ? cv.filial : null }),
      })),
      cvTemFilial: cv.papel === 'afretador',
      cvFiliais: db.filiais.map((f) => ({ k: f.id, n: f.nome, on: cv.filial === f.id, onClick: () => setCv({ filial: f.id }) })),
      mAberto: !!s.modal,
      mK: reset ? 'reset' : conv ? 'convite' : desat ? 'desativar' : 'regra',
      fecharModal: () => this.setState({ modal: null }),
      mTitulo: reset ? 'Voltar à semente' : conv ? 'Convidar usuário' : desat ? 'Desativar acesso de ' + desat.nome : 'Mudar a regra',
      mSub: conv
        ? 'A pessoa recebe um link por e-mail, cria a senha e entra com o papel escolhido.'
        : reset
          ? 'Apaga as ' + TX.ops.length + ' operações feitas neste navegador e volta às 30 viagens iniciais.'
          : desat
            ? 'A pessoa deixa de entrar. O que ela registrou continua nas viagens, com o nome dela.'
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
      mCta: reset ? 'Voltar à semente' : conv ? 'Enviar convite' : desat ? 'Desativar acesso' : 'Mudar regra',
      mPerigo: !!(reset || desat),
      ctaOk: okM,
      mFalta: okM ? '' : textoFalta(faltas.map((x) => x[1])),
      confirmar: () => {
        if (!okM) {
          const el = document.querySelector('[data-tx-modal] [data-tx-campo="' + faltas[0][0] + '"]');
          if (el) el.focus();
          return;
        }
        if (conv) {
          TX.fazer('convidarUsuario', {
            nome: cv.nome.trim(),
            email: emailTxt.toLowerCase(),
            papel: cv.papel,
            filiais: cv.papel === 'afretador' ? [cv.filial] : todas,
          });
          this.setState({ modal: null });
          this.avisar('Convite enviado para ' + emailTxt.toLowerCase() + '.');
          return;
        }
        if (reset) {
          TX.reset();
          this.setState({ modal: null });
          this.avisar('Dados voltaram à semente.');
          return;
        }
        if (desat) {
          try {
            TX.fazer('desativarUsuario', { usuario: desat.id, motivo: s.fMotivo.trim() });
            this.setState({ modal: null, drawer: null });
            this.avisar('Acesso de ' + desat.nome + ' desativado.');
          } catch (e) {
            this.setState({ modal: null });
            this.avisar('Não gravado: desativar acesso ainda não existe no motor desta demonstração.');
          }
          return;
        }
        TX.fazer('classeRegra', { regra: regra.k, classe: s.modal.classe, motivo: s.fMotivo.trim() });
        this.setState({ modal: null });
        this.avisar('Regra alterada. As viagens abertas foram reavaliadas.');
      },
      fecharDrawer: () => this.setState({ drawer: null }),
      dModelo: s.drawer && s.drawer.modelo ? s.drawer.modelo : null,
    });
  }

  // ---------------------------------------------------------------- seções
  secUsuarios(v) {
    return (
      <Cartao
        lista
        como="section"
        titulo="Usuários e papéis"
        sub="O papel define as filiais que a pessoa vê e a alçada de liberação."
        acoes={
          v.podeConvidar ? (
            <Botao variante="primario" tamanho="p" onClick={v.abrirConvite} data-tx-convidar="">
              Convidar usuário
            </Botao>
          ) : null
        }
      >
        <Tabela colunas={COLS_USU} rotulo="Usuários">
          <TabelaCabecalho>
            <span>Nome</span>
            <span>Papel</span>
            <span>Filiais</span>
            <span>Alçada</span>
            <span />
          </TabelaCabecalho>
          {v.usuarios.map((us) => (
            <TabelaLinha key={us.id} onClick={us.abrir} data-tx-usuario-linha={us.id} aria-label={'Abrir ' + us.nome}>
              <span className="tx-cfg-pessoa">
                <span className="tx-cfg-ini" aria-hidden>
                  {us.ini}
                </span>
                <span style={{ minWidth: '0' }}>
                  <span className="tx-tabela__forte">
                    {us.nome}
                    {us.voce ? <span className="tx-apagado tx-peso-600"> (você)</span> : null}
                  </span>
                  <span className="tx-tabela__sub">{us.email}</span>
                </span>
              </span>
              <span>{us.cargo}</span>
              <span className="tx-sec">{us.escopo}</span>
              <span className="tx-sec">{us.alcada}</span>
              <span className="tx-cfg-fim">{us.ativo ? SETA_DIR : <Badge tom="perigo">desativado</Badge>}</span>
            </TabelaLinha>
          ))}
          {v.convites.map((cv) => (
            <div key={cv.id} role="row" data-tx-convite={cv.id} className="tx-tabela__linha">
              <span className="tx-cfg-pessoa">
                <span className="tx-cfg-ini tx-cfg-ini--convite" aria-hidden>
                  {cv.ini}
                </span>
                <span style={{ minWidth: '0' }}>
                  <span className="tx-tabela__forte">{cv.nome}</span>
                  <span className="tx-tabela__sub">{cv.email}</span>
                </span>
              </span>
              <span>
                {cv.cargo}
                <span className="tx-tabela__sub">
                  <Badge tom="aviso">convite {cv.enviado}</Badge>
                </span>
              </span>
              <span className="tx-sec">{cv.escopo}</span>
              <span className="tx-apagado">Sem primeiro acesso</span>
              <span className="tx-cfg-fim">
                {v.podeCancelar ? (
                  <Botao variante="contorno" tamanho="p" onClick={cv.cancelar} data-tx-cancelar-convite={cv.id}>
                    Cancelar convite
                  </Botao>
                ) : null}
              </span>
            </div>
          ))}
        </Tabela>
      </Cartao>
    );
  }
  secAlcadas(v) {
    return (
      <Cartao
        lista
        como="section"
        titulo="Alçadas de liberação"
        sub="Liberar por autoridade exige o registro de 9 campos; o motor continua mostrando a falha."
      >
        <Tabela colunas={COLS_ALC} rotulo="Alçadas">
          <TabelaCabecalho>
            <span>Alçada</span>
            <span>O que libera</span>
            <span>Quem assina</span>
          </TabelaCabecalho>
          {v.alcadas.map((al) => (
            <TabelaLinha key={al.k}>
              <Situacao tom={al.tom}>{al.n}</Situacao>
              <span className="tx-sec">{al.libera}</span>
              <span>{al.quem}</span>
            </TabelaLinha>
          ))}
        </Tabela>
      </Cartao>
    );
  }
  secRegras(v) {
    return (
      <Cartao
        lista
        como="section"
        titulo="Regras"
        sub="O que trava a viagem quando falha. Regras da norma bloqueiam sempre; as internas podem só alertar, com motivo. Decisões já registradas não mudam."
      >
        {!v.podeRegra ? (
          <div style={{ padding: 'var(--esp-4) var(--esp-5) 0' }}>
            <Aviso tom="info">{v.porqueRegra}</Aviso>
          </div>
        ) : null}
        <Tabela colunas={COLS_REGRA} rotulo="Regras">
          <TabelaCabecalho>
            <span>Regra</span>
            <span>Base</span>
            <span>Quando falhar</span>
          </TabelaCabecalho>
          {v.regras.map((rg) => (
            <div key={rg.k} role="row" data-tx-regra={rg.k} className="tx-tabela__linha">
              <Celula2 forte={rg.n} sub={rg.sub} />
              <span className="tx-sec">{rg.base}</span>
              <span className="tx-cfg-fim">
                {rg.travada ? (
                  <span className="tx-cfg-trava">{CADEADO}Bloqueia sempre (norma)</span>
                ) : v.podeRegra ? (
                  <span className="tx-cfg-seg" role="radiogroup" aria-label={'Quando falhar: ' + rg.n}>
                    {rg.classes.map((cl) => (
                      <button
                        key={cl.k}
                        type="button"
                        role="radio"
                        aria-checked={cl.on}
                        aria-disabled={cl.inativo || undefined}
                        className="tx-cfg-seg__op"
                        onClick={cl.onClick}
                        data-tx-classe={cl.k}
                      >
                        {cl.n}
                      </button>
                    ))}
                  </span>
                ) : (
                  <Situacao tom={rg.classe === 'bloqueio' ? 'bloqueio' : 'falta'}>
                    {rg.classe === 'bloqueio' ? 'Bloqueia' : 'Só alerta'}
                  </Situacao>
                )}
              </span>
            </div>
          ))}
        </Tabela>
      </Cartao>
    );
  }
  secModelos(v) {
    return (
      <Cartao lista como="section" titulo="Modelos" sub="Textos que saem do sistema. Clique para ver inteiro.">
        <Tabela colunas={COLS_MOD} rotulo="Modelos">
          <TabelaCabecalho>
            <span>Modelo</span>
            <span>Prévia</span>
            <span />
          </TabelaCabecalho>
          {v.modelos.map((md) => (
            <div key={md.k} role="row" className="tx-tabela__linha tx-tabela__linha--clicavel" onClick={md.abrir}>
              <span style={{ minWidth: '0' }}>
                <button type="button" className="tx-cfg-abrir" onClick={(e) => (e.stopPropagation(), md.abrir())}>
                  {md.n}
                </button>
                <span className="tx-tabela__sub">{md.v}</span>
              </span>
              <span className={'tx-cfg-previa tx-sec' + (md.mono ? ' tx-mono' : '')}>{md.txt}</span>
              <span className="tx-cfg-fim">
                <Botao variante="contorno" tamanho="p" onClick={md.copiar}>
                  Copiar
                </Botao>
              </span>
            </div>
          ))}
        </Tabela>
      </Cartao>
    );
  }
  secLgpd(v) {
    return (
      <Cartao como="section" titulo="LGPD e retenção">
        <div style={{ display: 'grid', gap: 'var(--esp-2)' }}>
          {v.lgpd.map((lg) => (
            <Linha key={lg.l} rotulo={lg.l}>
              <span className="tx-peso-700" style={{ textAlign: 'right' }}>
                {lg.v}
              </span>
            </Linha>
          ))}
        </div>
      </Cartao>
    );
  }
  secIntegracoes(v) {
    return (
      <Cartao lista como="section" titulo="Integrações">
        <Tabela colunas={COLS_INT} rotulo="Integrações">
          <TabelaCabecalho>
            <span>Integração</span>
            <span>Situação</span>
          </TabelaCabecalho>
          {v.integracoes.map((ig) => (
            <TabelaLinha key={ig.k}>
              <Celula2 forte={ig.n} sub={ig.sub} />
              <Situacao tom={ig.tom}>{ig.e}</Situacao>
            </TabelaLinha>
          ))}
        </Tabela>
      </Cartao>
    );
  }
  secDados(v) {
    return (
      <Cartao como="section" titulo="Dados da demonstração">
        <p className="tx-cfg-texto">
          Tudo o que foi feito nas telas fica gravado neste navegador como <b className="num">{v.nOps}</b> operações sobre a semente (30
          viagens, 4 filiais). Voltar à semente apaga só essas operações.
        </p>
        {v.podeReset ? (
          <div style={{ marginTop: 'var(--esp-4)' }}>
            <Botao variante="contorno" className="tx-cfg-perigo" onClick={v.abrirReset} data-tx-reset="">
              Voltar à semente...
            </Botao>
          </div>
        ) : null}
      </Cartao>
    );
  }

  renderDrawer(v) {
    const us = v.dUsu;
    if (us) {
      const ed = v.ed;
      return (
        <Drawer
          id="cfg-usuario"
          data-tx-drawer="usuario"
          titulo={us.nome}
          sub={us.email}
          avatar={us.ini}
          aoFechar={v.fecharDrawer}
          rodape={
            v.editando ? (
              <>
                <Botao onClick={v.cancelarEdicao}>Cancelar</Botao>
                <Botao variante="primario" inativo={ed.papel === 'afretador' && !ed.filial} onClick={v.salvarEdicao}>
                  Salvar
                </Botao>
              </>
            ) : (
              <>
                {!us.voce ? (
                  <Botao onClick={() => v.entrarComo(us)} title="Demonstração: troca o usuário da sessão" data-tx-entrar-como={us.id}>
                    Entrar como <Badge cheio>demo</Badge>
                  </Botao>
                ) : null}
                {v.podeEditar && !us.voce ? (
                  <Botao variante="primario" onClick={v.comecarEdicao}>
                    Editar papel e filial
                  </Botao>
                ) : null}
              </>
            )
          }
        >
          {v.editando ? (
            <>
              <div role="radiogroup" aria-label="Papel" style={{ display: 'grid', gap: 'var(--esp-2)' }}>
                {PAPEIS.map(([k, n, sub]) => (
                  <OpcaoCartao key={k} titulo={n} sub={sub} selecionado={ed.papel === k} onClick={() => v.setEd({ papel: k })} />
                ))}
              </div>
              {ed.papel === 'afretador' ? (
                <div className="tx-campo">
                  <div id="cfg-ed-filial" className="tx-campo__rotulo">
                    Filial
                  </div>
                  <div className="tx-escolhas" role="radiogroup" aria-labelledby="cfg-ed-filial" data-tx-ed-filial="" tabIndex={-1}>
                    {TX.db.filiais.map((f) => (
                      <Chip key={f.id} selecionado={ed.filial === f.id} onClick={() => v.setEd({ filial: f.id })}>
                        {f.nome}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <Linha rotulo="Papel">
                <span className="tx-peso-700">{us.cargo}</span>
              </Linha>
              <Linha rotulo="Filiais">
                <span className="tx-peso-700">{us.escopo}</span>
              </Linha>
              <Linha rotulo="Alçada de liberação">
                <span className="tx-peso-700">{us.alcada}</span>
              </Linha>
              <Linha rotulo="Acesso">
                <Situacao tom={us.ativo ? 'ok' : 'bloqueio'} forma="selo">
                  {us.ativo ? 'Ativo' : 'Desativado'}
                </Situacao>
              </Linha>
              {v.podeEditar && !us.voce && us.ativo ? (
                <div className="tx-cfg-zona">
                  <Botao variante="contorno" tamanho="p" className="tx-cfg-perigo" onClick={() => v.abrirDesativar(us)}>
                    Desativar acesso...
                  </Botao>
                </div>
              ) : null}
            </>
          )}
        </Drawer>
      );
    }
    const md = v.dModelo ? v.modelos.find((m) => m.k === v.dModelo) : null;
    if (md)
      return (
        <Drawer
          id="cfg-modelo"
          data-tx-drawer="modelo"
          titulo={md.n}
          sub={md.v}
          aoFechar={v.fecharDrawer}
          rodape={
            <>
              <Botao onClick={v.fecharDrawer}>Fechar</Botao>
              <Botao variante="primario" onClick={md.copiar}>
                Copiar
              </Botao>
            </>
          }
        >
          <div className={'tx-cfg-modelo' + (md.mono ? ' tx-mono' : '')}>{md.txt}</div>
        </Drawer>
      );
    return null;
  }

  renderModal(v) {
    if (!v.mAberto) return null;
    return (
      <Modal
        id="cfg-modal"
        data-tx-modal={v.mK}
        tamanho={v.mConvite ? 'g' : 'm'}
        titulo={v.mTitulo}
        sub={v.mSub}
        aoFechar={v.fecharModal}
        falta={v.mFalta}
        acoes={
          <>
            <Botao onClick={v.fecharModal}>Cancelar</Botao>
            <Botao variante={v.mPerigo ? 'perigo' : 'primario'} inativo={!v.ctaOk} onClick={v.confirmar} data-tx-confirmar="">
              {v.mCta}
            </Botao>
          </>
        }
      >
        {v.mConvite ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--esp-3)' }}>
              <Campo id="cfg-nome" rotulo="Nome" campo="nome">
                <Entrada value={v.cvNome ?? ''} onChange={v.onCvNome} autoComplete="off" />
              </Campo>
              <Campo id="cfg-email" rotulo="E-mail" campo="email" erro={v.cvEmailErro}>
                <Entrada
                  type="email"
                  value={v.cvEmail ?? ''}
                  onChange={v.onCvEmail}
                  placeholder="nome@transrural.com.br"
                  autoComplete="off"
                />
              </Campo>
            </div>
            <div className="tx-campo">
              <div id="cfg-papel" className="tx-campo__rotulo">
                Papel
              </div>
              <div
                role="radiogroup"
                aria-labelledby="cfg-papel"
                data-tx-campo="papel"
                tabIndex={-1}
                style={{ display: 'grid', gap: 'var(--esp-2)' }}
              >
                {v.cvPapeis.map((pp) => (
                  <OpcaoCartao key={pp.k} titulo={pp.n} sub={pp.sub} selecionado={pp.on} onClick={pp.onClick} data-tx-papel={pp.k} />
                ))}
              </div>
            </div>
            {v.cvTemFilial ? (
              <div className="tx-campo">
                <div id="cfg-filial" className="tx-campo__rotulo">
                  Filial
                </div>
                <div className="tx-escolhas" role="radiogroup" aria-labelledby="cfg-filial" data-tx-campo="filial" tabIndex={-1}>
                  {v.cvFiliais.map((cf) => (
                    <Chip key={cf.k} selecionado={cf.on} onClick={cf.onClick} data-tx-cv-filial={cf.k}>
                      {cf.n}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
        {v.mTemMotivo ? (
          <Campo id="cfg-motivo" rotulo="Motivo" campo="motivo" dica="Fica no registro, com seu nome e a hora.">
            <Entrada value={v.fMotivo ?? ''} onChange={v.onMotivo} placeholder="Mínimo de 10 letras" />
          </Campo>
        ) : null}
      </Modal>
    );
  }

  render() {
    const v = this.renderVals();
    const SECOES = {
      usuarios: () => this.secUsuarios(v),
      alcadas: () => this.secAlcadas(v),
      regras: () => this.secRegras(v),
      modelos: () => this.secModelos(v),
      lgpd: () => this.secLgpd(v),
      integracoes: () => this.secIntegracoes(v),
      dados: () => this.secDados(v),
    };
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Configurações" data-tela="Configuracoes">
        <div className="tx-pagina">
          <CabecalhoPagina titulo="Configurações" sub="Quem acessa, quem assina e o que trava a viagem." />
          <div className="tx-cfg-grade">
            <nav className="tx-cfg-nav" aria-label="Seções">
              {v.secoes.map((sc) => (
                <button
                  key={sc.k}
                  type="button"
                  aria-current={sc.on ? 'true' : undefined}
                  className="tx-cfg-nav__item"
                  onClick={sc.onClick}
                  data-tx-secao={sc.k}
                >
                  {sc.n}
                </button>
              ))}
            </nav>
            <div className="tx-cfg-secoes">
              {SEC.map(([k]) => (
                <div key={k} id={'sec-' + k} data-tx-sec={k} style={{ scrollMarginTop: 'var(--esp-6)' }}>
                  {SECOES[k]()}
                </div>
              ))}
            </div>
          </div>
        </div>
        {this.renderDrawer(v)}
        {this.renderModal(v)}
      </div>
    );
  }
}

function Celula2({ forte, sub }) {
  return (
    <span style={{ minWidth: '0' }}>
      <span className="tx-tabela__forte">{forte}</span>
      {sub ? <span className="tx-tabela__sub">{sub}</span> : null}
    </span>
  );
}
