// Frota própria: lista de ativos. A linha abre o drawer do conjunto; cada compartimento tem "Ver histórico";
// o escopo GMP+ muda pelo menu da linha (ou pelo drawer), sempre com confirmação, motivo e data.
'use client';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Botao,
  Campo,
  CampoData,
  Entrada,
  EntradaCaixa,
  Chip,
  Situacao,
  Badge,
  Aviso,
  Tabela,
  TabelaCabecalho,
  TabelaEsqueleto,
  Cartao,
  Linha,
  EstadoVazio,
  Modal,
  Drawer,
} from '@/components/ui';
import './Frota.css';

// Regime IDTF da carga: a limpeza exigida antes de carregar ração depois dela (texto do glossário).
export const REGIME = {
  A: { tom: 'ok', n: 'limpeza seca', dica: 'Regime A: depois desta carga, limpeza seca basta.' },
  B: { tom: 'info', n: 'lavar com água', dica: 'Regime B: depois desta carga, lavar com água.' },
  C: { tom: 'aviso', n: 'água e detergente', dica: 'Regime C: depois desta carga, lavar com água e detergente.' },
  D: { tom: 'autoridade', n: 'desinfecção', dica: 'Regime D: depois desta carga, lavar e desinfetar.' },
  X: { tom: 'perigo', n: 'proibida', dica: 'Carga proibida: nenhuma limpeza resolve, o compartimento entra em quarentena.' },
};
const COLS = 'minmax(180px,1.15fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.1fr) 40px';
const DICA_ESCOPO = 'Só conjunto no escopo GMP+ faz viagem assegurada. O veículo diz se está ou não e desde quando.';

// Permissões do usuário atual (TX.pode chega com a revisão do motor; até lá, tudo liberado).
const pode = (op, alvo) => (TX.pode ? TX.pode(op, alvo) : true);
const porque = (op, alvo) => (TX.porque ? TX.porque(op, alvo) : '') || '';
const TOM_DOC = { ok: 'ok', vence: 'falta', vencido: 'bloqueio', falta: 'bloqueio' };

const LUPA = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const PONTOS = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="3.5" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="12.5" cy="8" r="1.4" />
  </svg>
);
const BAIXAR = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
  </svg>
);
const SETA = (d) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

/* Selo do regime com explicação ao passar o ponteiro e ao focar com Tab (glossário). */
export function SeloRegime({ r, rotulo }) {
  const x = REGIME[r];
  const dica = x ? x.dica : 'Carga fora da base IDTF, esperando classificação.';
  return (
    <span className="tx-frota-termo" tabIndex={0} data-dica={dica} aria-label={dica}>
      <Badge tom={x ? x.tom : 'neutro'} mono>
        {x ? (r === 'X' ? '✕' : r) : '?'}
      </Badge>
      {rotulo ? <span className="tx-frota-termo__texto">{rotulo}</span> : null}
    </span>
  );
}

/* Pode carregar ração neste compartimento? Mesmo critério da tela Compartimento (pendência: levar ao motor). */
function veredito(placa, pos) {
  const key = placa + '#' + pos;
  const t3 = TX.historico(placa, pos).slice(0, 3);
  const regs = TX.db.viagens.flatMap((v) => (v.regularizacoes || []).filter((r) => r.comp === key));
  const proib = t3.find((h) => h.produto && TX.produto(h.produto).regime === 'X');
  if (proib && !regs.length) return { tom: 'tecnico', n: 'Não: em quarentena' };
  if (!t3.length) return { tom: 'falta', n: 'Ainda não se sabe: T-3 vazio' };
  if (t3.some((h) => !h.produto)) return { tom: 'falta', n: 'Ainda não: carga a classificar' };
  const r = regs.length ? 'A' : TX.produto(t3[0].produto).regime;
  return { tom: 'ok', n: 'Sim, ' + REGIME[r].n };
}

export default class Frota extends Tela {
  state = { loading: true, modal: null, drawer: null, menuOpen: false, busca: '', fEscopo: 'todos' };
  componentDidMount() {
    TX.ui.montar(this);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  // Abre a confirmação de escopo devolvendo antes o foco ao gatilho do menu (o item some com o menu).
  abrirEscopo(id) {
    if (!pode('escopoFrota', id)) return this.avisar(porque('escopoFrota', id));
    const g = typeof document !== 'undefined' && document.querySelector('[data-tx-menu="' + id + '"]');
    if (g && !this.state.drawer) g.focus();
    this.setState({ menuOpen: false, modal: id, fMotivo: '', tentou: false });
  }
  abrirDoc(doc) {
    if (!pode('atualizarDocumento', doc.ref)) return this.avisar(porque('atualizarDocumento', doc.ref));
    const val = TX.addDias(TX.HOJE, 365);
    this.setState({
      modal: 'doc',
      fDoc: doc,
      fVal: val,
      fValTxt: TX.fmt.data(val),
      fNum: doc.numero || '',
      fArq: '',
      fArqErro: '',
      tentou: false,
    });
  }
  renderVals() {
    const s = this.state,
      U = TX.ui,
      F = TX.fmt;
    const cs = TX.db.conjuntos.filter((c) => c.dono === 'propria');
    const dentro = (c) => !!(c.escopo && c.escopo.no);
    const no = cs.filter(dentro);
    const venc = TX.vencimentos(30).filter((x) => x.dono.startsWith('Frota própria'));
    const qn = TX.norm(s.busca || '');
    const podeEscopo = pode('escopoFrota');
    const podeDocs = pode('atualizarDocumento');
    const info = (cj) => {
      const mot = TX.pessoa(cj.motorista);
      const de = TX.docEstado(mot.cnh && mot.cnh.validade);
      const esc = cj.escopo || {};
      const treinos = TX.db.treinamentos.filter((t) => t.participantes.includes(mot.id));
      const placas = TX.placasDoConjunto(cj);
      const docs = [];
      const dd = (k, n, val, tipo, ref, refNome, numero) => {
        const e = TX.docEstado(val);
        docs.push({
          k,
          n,
          estado: e.estado,
          rotulo: e.rotulo,
          tom: TOM_DOC[e.estado] || 'na',
          doc: { tipo, ref, refNome, n, numero, atual: e.rotulo },
        });
      };
      dd('cnh', 'CNH de ' + mot.nome, mot.cnh && mot.cnh.validade, 'CNH', mot.id, mot.nome, mot.cnh && mot.cnh.numero);
      placas.forEach((pl) => {
        const p = TX.placa(pl);
        dd('crlv-' + pl, 'CRLV ' + pl, p.crlv && p.crlv.validade, 'CRLV', pl, pl, '');
      });
      const ordem = { vencido: 0, falta: 0, vence: 1, ok: 2 };
      docs.sort((a, b) => ordem[a.estado] - ordem[b.estado]);
      const comps = TX.compsDoConjunto(cj).map((k) => {
        const hist = TX.historico(k.placa, k.pos);
        return {
          key: k.key,
          nome: k.placa + ' ' + k.pos,
          pos: k.pos,
          href: '/compartimento?placa=' + encodeURIComponent(k.placa) + '&pos=' + k.pos,
          veredito: veredito(k.placa, k.pos),
          cargas: hist.slice(0, 3).map((h, i) => {
            const p = TX.produto(h.produto);
            return { k: 'T-' + (i + 1), r: p ? p.regime : null, n: p ? p.nome : h.texto, data: F.curta(h.data) };
          }),
        };
      });
      const ult = comps[0] && comps[0].cargas[0];
      const vs = TX.db.viagens.filter((v) => v.conjunto === cj.id && !v.cancelada).sort((a, b) => b.data.localeCompare(a.data));
      const docRuim = docs.filter((d) => d.estado !== 'ok');
      return {
        id: cj.id,
        no: !!esc.no,
        cavalo: placas[0],
        carretas: placas.slice(1),
        placasTxt: placas.join(', '),
        tipo: TX.placa(cj.carretas[0]).modelo,
        base: TX.filial(cj.filial).nome,
        motorista: mot.nome,
        cnh: 'CNH ' + de.rotulo,
        cnhAlerta: de.estado !== 'ok',
        semTreino: !treinos.length,
        treinos: treinos.length
          ? treinos.length +
            (treinos.length === 1 ? ' registrado' : ' registrados') +
            ', último ' +
            F.data(treinos[treinos.length - 1].data)
          : 'nenhum registrado',
        comps,
        umComp: comps.length === 1,
        compsTxt: comps.length + ' compartimentos',
        ult,
        escTxt: esc.no ? 'No escopo desde ' + F.data(esc.desde) : 'Fora: ' + (esc.motivo || 'nunca entrou'),
        escCurto: esc.no ? 'No escopo' : 'Fora do escopo',
        escSub: esc.no ? 'desde ' + F.data(esc.desde) : esc.motivo || 'nunca entrou',
        docs,
        docRuim: docRuim.length,
        docAviso: docRuim.length ? docRuim[0].n + ' ' + docRuim[0].rotulo : '',
        viagens: vs.slice(0, 5).map((v) => {
          const dec = TX.decidir(v);
          const cic = TX.ciclo(v);
          return {
            id: v.id,
            href: '/viagem?id=' + v.id,
            data: F.curta(v.data),
            ordem: v.ordem,
            produto: TX.produto(v.produto).nome,
            tom: cic.k === 'concluida' ? 'ok' : U.tomResultado(dec).k || 'na',
            res: cic.k === 'concluida' ? 'Concluída' : dec.rotulo,
          };
        }),
        busca: TX.norm([placas.join(' '), mot.nome, TX.filial(cj.filial).nome].join(' ')),
      };
    };
    const todos = cs.map(info);
    const FILT = { todos: () => true, no: (x) => x.no, fora: (x) => !x.no, docs: (x) => x.docRuim > 0 };
    const lista = todos
      .filter((x) => FILT[s.fEscopo](x) && (!qn || x.busca.includes(qn)))
      .sort((a, b) => (a.no === b.no ? a.cavalo.localeCompare(b.cavalo) : a.no ? -1 : 1));
    const idx = s.drawer ? lista.findIndex((x) => x.id === s.drawer) : -1;
    const dr = s.drawer ? todos.find((x) => x.id === s.drawer) : null;
    const alvo = s.modal && s.modal !== 'doc' ? TX.conjunto(s.modal) : null;
    const tirar = !!(alvo && alvo.escopo && alvo.escopo.no);
    const motivo = (s.fMotivo || '').trim();
    const ok = !tirar || motivo.length >= 10;
    const fd = s.fDoc || {};
    const numOk = (s.fNum || '').trim().length >= 4;
    const valOk = !!s.fVal && s.fVal > TX.HOJE;
    const docOk = numOk && valOk;
    return Object.assign({}, U.base(this), {
      contagem: cs.length + ' conjuntos',
      semVenc: venc.length === 0,
      temVenc: venc.length > 0,
      vencTitulo: venc.length + (venc.length === 1 ? ' documento da frota vence' : ' documentos da frota vencem') + ' em até 30 dias.',
      vencTxt:
        venc
          .slice(0, 3)
          .map((x) => x.tipo + ' ' + x.ref + ' (' + x.rotulo + ')')
          .join(', ') +
        (venc.length > 3 ? ' e mais ' + (venc.length - 3) : '') +
        '.',
      filtros: [
        ['todos', 'Todos', todos.length],
        ['no', 'No escopo GMP+', no.length],
        ['fora', 'Fora do escopo', cs.length - no.length],
        ['docs', 'Documento a vencer', todos.filter(FILT.docs).length],
      ].map(([k, n, q]) => ({ k, n, q, on: s.fEscopo === k, onClick: () => this.setState({ fEscopo: k }) })),
      busca: s.busca || '',
      onBusca: (e) => this.setState({ busca: e.target.value }),
      temFiltro: !!qn || s.fEscopo !== 'todos',
      limpar: () => this.setState({ busca: '', fEscopo: 'todos' }),
      linhas: lista.map((x) => ({
        ...x,
        aberta: s.drawer === x.id,
        abrir: () => this.setState({ drawer: x.id, menuOpen: false }),
        menuAberto: s.menuOpen === x.id,
        alternarMenu: (e) => {
          e.stopPropagation();
          this.setState({ menuOpen: s.menuOpen === x.id ? false : x.id });
        },
        alternarEscopo: () => this.abrirEscopo(x.id),
        podeEscopo,
        escopoNao: pode('escopoFrota', x.id) ? '' : porque('escopoFrota', x.id),
        altRot: x.no ? 'Tirar do escopo GMP+...' : 'Incluir no escopo GMP+...',
      })),
      vazio: !s.loading && lista.length === 0,
      // Drawer do conjunto
      dr,
      fecharDrawer: () => this.setState({ drawer: null }),
      dAlternar: dr ? () => this.abrirEscopo(dr.id) : null,
      dAnterior: idx > 0 ? () => this.setState({ drawer: lista[idx - 1].id }) : null,
      dProximo: idx >= 0 && idx < lista.length - 1 ? () => this.setState({ drawer: lista[idx + 1].id }) : null,
      dPosicao: idx >= 0 ? idx + 1 + ' de ' + lista.length : '',
      podeEscopo,
      podeDocs,
      dDocs: dr
        ? dr.docs.map((d) => ({
            ...d,
            nao: pode('atualizarDocumento', d.doc.ref) ? '' : porque('atualizarDocumento', d.doc.ref),
            atualizar: () => this.abrirDoc(d.doc),
          }))
        : [],
      dEscopoNao: dr && !pode('escopoFrota', dr.id) ? porque('escopoFrota', dr.id) : '',
      // Confirmação de escopo
      mAberto: !!alvo,
      fecharModal: () => this.setState({ modal: null }),
      tirar,
      mTitulo: alvo ? (tirar ? 'Tirar ' + alvo.cavalo + ' do escopo GMP+?' : 'Incluir ' + alvo.cavalo + ' no escopo GMP+?') : '',
      mSub: tirar
        ? 'O conjunto deixa de fazer viagem assegurada. As viagens já feitas continuam com o escopo da data delas.'
        : 'O conjunto passa a poder fazer viagem assegurada. A data de entrada fica registrada para a auditoria.',
      mData: F.data(TX.HOJE),
      fMotivo: s.fMotivo || '',
      onMotivo: (e) => this.setState({ fMotivo: e.target.value }),
      erroMotivo: tirar && s.tentou && !ok ? 'Escreva o motivo com pelo menos 10 caracteres (' + motivo.length + ' agora).' : '',
      mFalta: ok ? '' : 'Falta: motivo.',
      ctaOk: ok,
      mCta: tirar ? 'Tirar do escopo' : 'Incluir no escopo',
      confirmar: () => {
        if (!alvo) return;
        if (!ok) {
          this.setState({ tentou: true });
          const c = document.querySelector('[data-tx-campo="motivo"]');
          if (c) c.focus();
          return;
        }
        TX.fazer('escopoFrota', { conjunto: alvo.id, no: !tirar, motivo: motivo || 'inclusão no escopo' });
        this.setState({ modal: null });
        this.avisar(alvo.cavalo + (tirar ? ' saiu do escopo GMP+ em ' : ' entrou no escopo GMP+ em ') + F.data(TX.HOJE) + '.');
      },
      // Atualizar documento (CNH e CRLV da frota própria)
      mDoc: s.modal === 'doc',
      docNome: fd.n || '',
      docAtual: fd.atual || '',
      docTipo: fd.tipo || '',
      fNum: s.fNum || '',
      onNum: (e) => this.setState({ fNum: e.target.value }),
      fValTxt: s.fValTxt || '',
      onVal: (t) => this.setState({ fValTxt: t, fVal: U.dataIso(t) || '' }),
      erroVal:
        U.avisoData(s.fValTxt) ||
        (s.fVal && s.fVal <= TX.HOJE
          ? 'A nova validade tem que ser depois de hoje.'
          : s.tentou && !s.fVal
            ? 'Informe a nova validade.'
            : ''),
      erroNum: s.tentou && !numOk ? 'Informe o número do documento.' : '',
      fArq: s.fArq || '',
      fArqErro: s.fArqErro || '',
      onArq: (e) => {
        const f = e.target.files && e.target.files[0];
        const erro = U.conferirArquivo(f, ['.pdf', '.jpg', '.jpeg', '.png'], 'PDF ou foto');
        e.target.value = '';
        this.setState({ fArqErro: erro, fArq: f && !erro ? f.name : s.fArq || '' });
      },
      docFalta: docOk ? '' : 'Falta: ' + [numOk ? '' : 'número', valOk ? '' : 'validade'].filter(Boolean).join(' e ') + '.',
      docOk,
      salvarDoc: () => {
        if (!docOk) {
          this.setState({ tentou: true });
          const c = document.querySelector(numOk ? '[data-tx-campo="validade"]' : '[data-tx-campo="numero"]');
          if (c) c.focus();
          return;
        }
        TX.fazer('atualizarDocumento', {
          tipo: fd.tipo,
          ref: fd.ref,
          refNome: fd.refNome,
          validade: s.fVal,
          numero: s.fNum.trim(),
          arquivo: s.fArq || null,
        });
        this.setState({ modal: null });
        this.avisar(fd.tipo + ' de ' + fd.refNome + ' atualizado: vale até ' + F.data(s.fVal) + '.');
      },
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
            .filter((cj) => !dentro(cj))
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

  renderLinha(r) {
    return (
      <div
        key={r.id}
        role="row"
        data-tx-conjunto={r.id}
        aria-selected={r.aberta || undefined}
        className={'tx-tabela__linha tx-frota-linha' + (r.no ? '' : ' tx-frota-linha--fora')}
        onClick={r.abrir}
      >
        <span role="cell" style={{ minWidth: 0 }}>
          <button type="button" className="tx-frota-abrir" onClick={r.abrir} aria-label={'Abrir o conjunto ' + r.placasTxt}>
            <span className="tx-frota-placa tx-frota-placa--cavalo">{r.cavalo}</span>
            {r.carretas.map((p) => (
              <span key={p} className="tx-frota-placa">
                {p}
              </span>
            ))}
          </button>
        </span>
        <span role="cell" className="tx-tabela__celula">
          <span className="tx-tabela__forte tx-peso-600">{r.tipo}</span>
          <span className="tx-tabela__sub">base {r.base}</span>
        </span>
        <span role="cell" className="tx-tabela__celula">
          <span className="tx-tabela__forte tx-peso-600">{r.motorista}</span>
          {r.cnhAlerta ? <span className="tx-tabela__sub tx-frota-alerta">{r.cnh}</span> : null}
          {r.semTreino ? (
            <Badge tom="aviso" style={{ marginTop: 'var(--esp-1)' }}>
              sem treinamento
            </Badge>
          ) : null}
        </span>
        <span role="cell" className="tx-tabela__celula">
          {r.umComp && r.ult ? (
            <>
              <span className="tx-frota-ultima">
                <SeloRegime r={r.ult.r} />
                <span className="tx-tabela__forte tx-peso-600">{r.ult.n}</span>
              </span>
              <span className="tx-tabela__sub">em {r.ult.data}</span>
            </>
          ) : r.umComp ? (
            <span className="tx-tabela__sub">sem carga registrada</span>
          ) : (
            <>
              <span className="tx-tabela__forte tx-peso-600">{r.compsTxt}</span>
              <span className="tx-tabela__sub">detalhe no conjunto</span>
            </>
          )}
        </span>
        <span role="cell" style={{ minWidth: 0 }}>
          <Situacao tom={r.no ? 'ok' : 'na'} title={DICA_ESCOPO}>
            {r.escCurto}
          </Situacao>
          <span className="tx-tabela__sub">{r.escSub}</span>
          {r.docRuim ? <span className="tx-tabela__sub tx-frota-alerta">{r.docAviso}</span> : null}
        </span>
        <span role="cell" className="tx-frota-menu-ancora" data-tx-pop="" onClick={(e) => e.stopPropagation()}>
          <Botao
            variante="icone"
            aria-label={'Ações de ' + r.cavalo}
            aria-haspopup="menu"
            aria-expanded={r.menuAberto}
            data-tx-menu={r.id}
            onClick={r.alternarMenu}
            icone={PONTOS}
          />
          {r.menuAberto ? (
            <div role="menu" className="tx-frota-menu" aria-label={'Ações de ' + r.cavalo}>
              <button type="button" role="menuitem" className="tx-frota-menu__item" onClick={r.abrir}>
                Abrir o conjunto
              </button>
              {r.comps.map((cp) => (
                <A key={cp.key} role="menuitem" className="tx-frota-menu__item" href={cp.href}>
                  <span>
                    Ver histórico de cargas{r.umComp ? '' : ' do ' + cp.pos + ' (' + cp.nome.split(' ').slice(0, 2).join(' ') + ')'}
                  </span>
                </A>
              ))}
              {r.podeEscopo ? (
                <>
                  <span className="tx-frota-menu__sep" aria-hidden />
                  <button
                    type="button"
                    role="menuitem"
                    className={'tx-frota-menu__item' + (r.no ? ' tx-frota-menu__item--perigo' : '')}
                    aria-disabled={r.escopoNao ? true : undefined}
                    title={r.escopoNao || undefined}
                    onClick={r.alternarEscopo}
                    data-tx-escopo={r.id}
                  >
                    {r.altRot}
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </span>
      </div>
    );
  }

  renderDrawer(v) {
    const d = v.dr;
    return (
      <Drawer
        id="frota-conjunto"
        data-tx-drawer={d.id}
        className="tx-frota-drawer"
        titulo={
          <span className="tx-frota-placas">
            <span className="tx-frota-placa tx-frota-placa--cavalo">{d.cavalo}</span>
            {d.carretas.map((p) => (
              <span key={p} className="tx-frota-placa tx-frota-placa--inversa">
                {p}
              </span>
            ))}
          </span>
        }
        sub={d.tipo + ', base ' + d.base}
        aoFechar={v.fecharDrawer}
        rodape={
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--esp-1)', marginRight: 'auto' }}>
              <Botao
                variante="icone"
                aria-label="Conjunto anterior"
                desabilitado={!v.dAnterior}
                onClick={v.dAnterior || undefined}
                icone={SETA('M10 3.5 5.5 8l4.5 4.5')}
              />
              <Botao
                variante="icone"
                aria-label="Próximo conjunto"
                desabilitado={!v.dProximo}
                onClick={v.dProximo || undefined}
                icone={SETA('M6 3.5 10.5 8 6 12.5')}
              />
              <span className="tx-tipo-legenda tx-apagado num">{v.dPosicao}</span>
            </div>
            {v.podeEscopo ? (
              <Botao
                variante="contorno"
                inativo={!!v.dEscopoNao}
                title={v.dEscopoNao || undefined}
                onClick={v.dAlternar}
                data-tx-escopo={d.id}
              >
                {d.no ? 'Tirar do escopo GMP+...' : 'Incluir no escopo GMP+...'}
              </Botao>
            ) : null}
          </>
        }
      >
        <div className="tx-frota-drawer-estado">
          <Situacao tom={d.no ? 'ok' : 'na'} forma="selo" title={DICA_ESCOPO}>
            {d.escTxt}
          </Situacao>
        </div>

        <section className="tx-frota-secao" aria-labelledby="frota-comps">
          <h3 id="frota-comps" className="tx-tipo-titulo">
            Compartimentos
          </h3>
          {d.comps.map((cp) => (
            <div key={cp.key} className="tx-frota-comp" data-tx-comp={cp.nome}>
              <div className="tx-frota-comp__topo">
                <span className="tx-mono tx-peso-700">{cp.nome}</span>
                <Situacao tom={cp.veredito.tom}>Pode carregar ração? {cp.veredito.n}</Situacao>
              </div>
              {cp.cargas.length ? (
                <ol className="tx-frota-t3" aria-label={'Três últimas cargas de ' + cp.nome}>
                  {cp.cargas.map((cg) => (
                    <li key={cg.k}>
                      <span className="tx-tipo-rotulo">{cg.k}</span>
                      <SeloRegime r={cg.r} />
                      <span className="tx-frota-t3__nome">{cg.n}</span>
                      <span className="tx-apagado num">{cg.data}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <span className="tx-frota-legenda">Sem carga registrada.</span>
              )}
              <Botao tamanho="p" variante="contorno" href={cp.href} data-tx-historico={cp.nome}>
                Ver histórico de {cp.nome}
              </Botao>
            </div>
          ))}
        </section>

        <section className="tx-frota-secao" aria-labelledby="frota-mot">
          <h3 id="frota-mot" className="tx-tipo-titulo">
            Motorista
          </h3>
          <dl className="tx-frota-dados">
            <dt>Nome</dt>
            <dd className="tx-peso-700">{d.motorista}</dd>
            <dt>Treinamentos</dt>
            <dd className={d.semTreino ? 'tx-frota-alerta' : ''}>{d.treinos}</dd>
          </dl>
        </section>

        <section className="tx-frota-secao" aria-labelledby="frota-docs">
          <h3 id="frota-docs" className="tx-tipo-titulo">
            Documentos
          </h3>
          <ul className="tx-frota-lista">
            {v.dDocs.map((dc) => (
              <li key={dc.k} data-tx-doc={dc.k}>
                <span className="tx-peso-600" style={{ flex: 1, minWidth: 0 }}>
                  {dc.n}
                </span>
                <Situacao tom={dc.tom}>{dc.rotulo}</Situacao>
                {v.podeDocs ? (
                  <Botao
                    tamanho="p"
                    variante="texto"
                    inativo={!!dc.nao}
                    title={dc.nao || undefined}
                    onClick={dc.atualizar}
                    data-tx-atualizar-doc={dc.k}
                    aria-label={'Atualizar ' + dc.n}
                  >
                    Atualizar
                  </Botao>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="tx-frota-secao" aria-labelledby="frota-vgs">
          <h3 id="frota-vgs" className="tx-tipo-titulo">
            Últimas viagens
          </h3>
          {d.viagens.length ? (
            <ul className="tx-frota-lista">
              {d.viagens.map((vg) => (
                <li key={vg.id}>
                  <A href={vg.href} className="tx-frota-viagem">
                    <span className="num tx-apagado">{vg.data}</span>
                    <span className="tx-mono tx-peso-600">{vg.ordem}</span>
                    <span className="tx-frota-t3__nome">{vg.produto}</span>
                    <Situacao tom={vg.tom}>{vg.res}</Situacao>
                    <span aria-hidden className="tx-frota-chevron">
                      ›
                    </span>
                  </A>
                </li>
              ))}
            </ul>
          ) : (
            <span className="tx-frota-legenda">Nenhuma viagem deste conjunto.</span>
          )}
        </section>
      </Drawer>
    );
  }

  render() {
    const v = this.renderVals();
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Frota própria" data-tela="Frota">
        <div className="tx-pagina">
          <div className="tx-pagina-cab">
            <div
              className="tx-pagina-cab__titulos"
              style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--esp-3)', flexWrap: 'wrap' }}
            >
              <h1 className="tx-pagina-cab__titulo">Frota própria</h1>
              <span className="tx-tipo-corpo tx-sec num">{v.contagem}</span>
              {v.semVenc ? (
                <Badge tom="ok" data-tx-venc-ok="">
                  CNH e CRLV em dia nos próximos 30 dias
                </Badge>
              ) : null}
            </div>
            <div className="tx-pagina-cab__acoes">
              <Botao
                variante="contorno"
                icone={BAIXAR}
                onClick={v.exportarEscopo}
                data-tx-exportar=""
                title="Abre a lista do escopo pronta para imprimir"
              >
                Exportar lista do escopo
              </Botao>
            </div>
          </div>
          {v.temVenc ? (
            <div data-tx-venc-frota="">
              <Aviso tom="aviso" titulo={v.vencTitulo}>
                {v.vencTxt}
              </Aviso>
            </div>
          ) : null}
          <Cartao lista>
            <div className="tx-frota-ferramentas">
              <EntradaCaixa
                icone={LUPA}
                value={v.busca}
                onChange={v.onBusca}
                placeholder="Buscar placa ou motorista"
                aria-label="Buscar conjunto por placa ou motorista"
                data-tx-busca=""
              />
              <div role="group" aria-label="Filtrar conjuntos" style={{ display: 'flex', gap: 'var(--esp-1-5)', flexWrap: 'wrap' }}>
                {v.filtros.map((f) => (
                  <Chip key={f.k} tipo="filtro" selecionado={f.on} onClick={f.onClick} data-tx-filtro={f.k}>
                    {f.n} <span className="num">{f.q}</span>
                  </Chip>
                ))}
              </div>
            </div>
            <Tabela colunas={COLS} rotulo="Conjuntos da frota própria">
              <TabelaCabecalho>
                <span role="columnheader">Conjunto</span>
                <span role="columnheader">Tipo e base</span>
                <span role="columnheader">Motorista</span>
                <span role="columnheader">Última carga</span>
                <span role="columnheader">Escopo GMP+</span>
                <span role="columnheader">
                  <span className="tx-so-leitor">Ações</span>
                </span>
              </TabelaCabecalho>
              {v.loading ? <TabelaEsqueleto linhas={4} /> : v.linhas.map((r) => this.renderLinha(r))}
              {v.vazio ? (
                <EstadoVazio
                  titulo="Nenhum conjunto com esse filtro"
                  acao={
                    v.temFiltro ? (
                      <Botao tamanho="p" onClick={v.limpar}>
                        Limpar filtros
                      </Botao>
                    ) : null
                  }
                >
                  Busque pela placa do cavalo ou da carreta, ou pelo nome do motorista. Conjuntos de TAC e ETC ficam em Transportadores.
                </EstadoVazio>
              ) : null}
            </Tabela>
          </Cartao>
        </div>
        {v.dr ? this.renderDrawer(v) : null}
        {v.mDoc ? (
          <Modal
            id="frota-doc"
            data-tx-modal="doc"
            titulo={'Atualizar ' + v.docNome}
            sub={'Hoje: ' + v.docAtual + '. O documento anterior continua no histórico; viagens já decididas não mudam.'}
            aoFechar={v.fecharModal}
            falta={v.docFalta}
            acoes={
              <>
                <Botao onClick={v.fecharModal}>Cancelar</Botao>
                <Botao variante="primario" inativo={!v.docOk} onClick={v.salvarDoc} data-tx-confirmar="">
                  Salvar
                </Botao>
              </>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--esp-3)' }}>
              <Campo
                id="frota-doc-numero"
                rotulo={v.docTipo === 'CRLV' ? 'Número do CRLV (Renavam)' : 'Número da ' + v.docTipo}
                erro={v.erroNum}
                campo="numero"
              >
                <Entrada mono value={v.fNum} onChange={v.onNum} />
              </Campo>
              <Campo id="frota-doc-validade" rotulo="Nova validade" erro={v.erroVal} campo="validade">
                <CampoData valor={v.fValTxt} aoMudar={v.onVal} />
              </Campo>
            </div>
            <div className="tx-campo">
              <span className="tx-campo__rotulo">
                Arquivo do documento <span className="tx-campo__opcional">(recomendado)</span>
              </span>
              <label className="tx-frota-arquivo">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={v.onArq} className="tx-so-leitor" />
                <span className="tx-peso-700">{v.fArq ? v.fArq : 'Escolher PDF ou foto'}</span>
                <span className="tx-apagado tx-tipo-legenda">o auditor confere o documento, não só a data</span>
              </label>
              {v.fArqErro ? (
                <div className="tx-campo__erro" role="alert">
                  {v.fArqErro}
                </div>
              ) : null}
            </div>
          </Modal>
        ) : null}
        {v.mAberto ? (
          <Modal
            id="frota-escopo"
            data-tx-modal="escopo"
            titulo={v.mTitulo}
            sub={v.mSub}
            aoFechar={v.fecharModal}
            falta={v.mFalta}
            acoes={
              <>
                <Botao onClick={v.fecharModal}>Cancelar</Botao>
                <Botao variante={v.tirar ? 'perigo' : 'primario'} inativo={!v.ctaOk} onClick={v.confirmar} data-tx-confirmar="">
                  {v.mCta}
                </Botao>
              </>
            }
          >
            <Linha rotulo={v.tirar ? 'Sai do escopo em' : 'Entra no escopo em'}>
              <span className="num tx-peso-700">{v.mData}, hoje</span>
            </Linha>
            <Campo
              id="frota-motivo"
              rotulo={v.tirar ? 'Motivo' : 'Observação'}
              opcional={!v.tirar}
              dica={v.tirar ? 'Mínimo de 10 caracteres. Fica no histórico do conjunto e na exportação.' : 'Fica no histórico do conjunto.'}
              erro={v.erroMotivo}
              campo="motivo"
            >
              <Entrada value={v.fMotivo} onChange={v.onMotivo} />
            </Campo>
          </Modal>
        ) : null}
      </div>
    );
  }
}
