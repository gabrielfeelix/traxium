// Compartimento: ficha de leitura. Primeiro a resposta (pode carregar ração? sim ou não, e por quê), depois o histórico.
'use client';
import { TX, Tela, A } from '@/lib/tx/tela';
import {
  Botao,
  Situacao,
  Badge,
  Tabela,
  TabelaCabecalho,
  TabelaLinha,
  EstadoVazio,
  Cartao,
  EntradaCaixa,
  TabelaEsqueleto,
} from '@/components/ui';
import { SeloRegime, REGIME } from './Frota';
import './Compartimento.css';

const COLS = '44px 100px minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.4fr) minmax(0,1.1fr)';
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
const LUPA = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="7" cy="7" r="4.6" />
    <line x1="10.5" y1="10.5" x2="13.5" y2="13.5" />
  </svg>
);
const ICONE = {
  sim: <path d="M5 10.5 8.5 14 15 6.5" />,
  nao: <path d="M6 6l8 8M14 6l-8 8" />,
  talvez: <path d="M10 5.5v5.5M10 14.2v.1" />,
};

export default class Compartimento extends Tela {
  state = { loading: true, procura: '' };
  componentDidMount() {
    TX.ui.montar(this);
  }
  avisar(m) {
    TX.ui.avisar(this, m);
  }
  sbAtivo() {
    const a = this.alvo();
    const p = a && TX.placa(a.placa);
    return !p || p.dono === 'propria' ? 'frota' : 'transportadores';
  }
  // Placa e posição da URL. Placa que não existe ou não é carreta, ou posição que a carreta não tem: null (estado "não encontrado").
  alvo() {
    // Aceita a placa sem espaço ou com hífen (QHG7L34, QHG-7L34) e a posição só com o número (1 = C1).
    const bruta = (TX.ui.param('placa') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const achada = bruta && TX.db.placas.find((x) => x.placa.replace(/[^A-Z0-9]/g, '') === bruta);
    const pl = achada ? achada.placa : TX.ui.param('placa');
    const pr = (TX.ui.param('pos') || 'C1').toUpperCase();
    const pos = /^\d+$/.test(pr) ? 'C' + pr : pr;
    const p = pl && TX.placa(pl);
    if (!p || p.tipo !== 'carreta' || !(p.comps || ['C1']).includes(pos)) return null;
    return { placa: pl, pos };
  }
  valsProcura() {
    const s = this.state;
    const q = TX.norm(s.procura || '');
    const achados =
      q.length >= 2
        ? TX.db.placas
            .filter((p) => p.tipo === 'carreta' && TX.norm(p.placa).replace(/\s/g, '').includes(q.replace(/\s/g, '')))
            .flatMap((p) =>
              (p.comps || ['C1']).map((pos) => ({
                n: p.placa + ' ' + pos,
                href: '/compartimento?placa=' + encodeURIComponent(p.placa) + '&pos=' + pos,
              })),
            )
            .slice(0, 8)
        : [];
    return { procura: s.procura || '', onProcura: (e) => this.setState({ procura: e.target.value }), achados };
  }
  renderVals() {
    const U = TX.ui,
      F = TX.fmt;
    const a = this.alvo();
    if (!a) {
      const pl = TX.ui.param('placa');
      const pos = TX.ui.param('pos');
      return Object.assign({}, U.base(this), this.valsProcura(), {
        naoAchou: true,
        pedido: pl ? pl + (pos ? ' posição ' + pos : '') : '',
      });
    }
    const p = TX.placa(a.placa);
    const conj = TX.db.conjuntos.find((c) => c.carretas.includes(a.placa));
    const propria = p.dono === 'propria';
    const hist = TX.historico(a.placa, a.pos);
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
    let pode, porque, tom, icone;
    if (quarentena) {
      pode = 'Não: em quarentena';
      porque =
        'Porque ' +
        TX.produto(proib.produto).nome.toLowerCase() +
        ', carga proibida, foi carregada em ' +
        F.data(proib.data) +
        '. Limpeza não resolve: precisa de inspeção independente e laudo, registrados na viagem pela TS1.9.' +
        (vReg
          ? ' A ' + vReg.ordem + ', de ' + F.data(vReg.data) + ', está travada por isso.'
          : ' Faça na próxima viagem que usar esta carreta.');
      tom = 'perigo';
      icone = 'nao';
    } else if (!t3.length) {
      pode = 'Ainda não se sabe';
      porque = 'Porque não há carga registrada. A primeira viagem pede ao motorista as três últimas cargas (T-3).';
      tom = 'aviso';
      icone = 'talvez';
    } else if (foraBase) {
      pode = 'Ainda não';
      porque = 'Porque uma das três últimas cargas está fora da base IDTF e espera classificação.';
      tom = 'aviso';
      icone = 'talvez';
    } else if (regs.length) {
      pode = LIMP.A;
      porque = 'Porque o compartimento foi regularizado pela TS1.9, laudo ' + regs[0].laudo + '.';
      tom = 'ok';
      icone = 'sim';
    } else {
      pode = LIMP[t1.regime];
      porque = 'Porque a última carga foi ' + t1.nome.toLowerCase() + ', regime ' + t1.regime + ' na base IDTF.';
      tom = 'ok';
      icone = 'sim';
    }
    const linhas = hist.map((h, i) => {
      const pr = h.produto ? TX.produto(h.produto) : null;
      const r = pr ? pr.regime : null;
      const lp = limpezas.find((l) => l.em.slice(0, 10) >= h.data);
      const fonte =
        h.fonte === 'viagem'
          ? 'viagem ' + TX.viagem(h.viagem).ordem
          : h.fonte === 'declarada'
            ? 'declarada pelo motorista na ' + TX.viagem(h.viagem).ordem
            : 'registro inicial da frota';
      return {
        k: h.data + '-' + i,
        t: i < 3 ? 'T-' + (i + 1) : '',
        t3: i < 3,
        proibida: r === 'X',
        data: F.data(h.data),
        produto: pr ? pr.nome : '"' + h.texto + '"',
        cat: pr ? pr.cat + (pr.racao ? ', ração' : '') : 'fora da base IDTF',
        r,
        rotulo: r ? (r === 'X' ? 'proibida' : REGIME[r].n) : 'a classificar',
        fonte,
        href: h.viagem ? '/viagem?id=' + h.viagem : '',
        // Só a carga feita em viagem do Traxium tem checklist; a declarada ou inicial não tem registro de limpeza próprio.
        limpeza:
          r === 'X'
            ? 'não resolve'
            : lp
              ? 'regime ' + lp.regime + ', ' + lp.comprovante
              : r === 'A' && h.fonte === 'viagem'
                ? 'seca, no checklist'
                : 'não registrada',
        limpezaAlerta: r === 'X',
      };
    });
    const dono = propria ? 'Frota própria' : TX.nomeTransportador(p.dono);
    return Object.assign({}, U.base(this), {
      naoAchou: false,
      titulo,
      modelo: p.modelo,
      crlv: TX.docEstado(p.crlv && p.crlv.validade),
      trilha: propria
        ? [{ n: 'Frota própria', href: '/frota' }].concat(conj ? [{ n: conj.cavalo, href: '/frota', mono: true }] : [])
        : [
            { n: 'Transportadores', href: '/transportadores' },
            { n: dono, href: '/transportadores?id=' + p.dono },
          ],
      dono,
      conjuntoTxt: conj ? 'cavalo ' + conj.cavalo : 'sem conjunto hoje',
      pode,
      porque,
      tom,
      icone,
      quarentena: !!quarentena,
      qTemViagem: !!vReg,
      qHref: vReg ? '/viagem?id=' + vReg.id : '',
      qRot: vReg ? 'Regularizar na ' + vReg.ordem : '',
      linhas,
      vazio: !hist.length,
      temIrmaos: !!conj && TX.compsDoConjunto(conj).length > 1,
      irmaos: conj
        ? TX.compsDoConjunto(conj).map((k) => ({
            n: k.placa + ' ' + k.pos,
            href: '/compartimento?placa=' + encodeURIComponent(k.placa) + '&pos=' + k.pos,
            atual: k.key === key,
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
          '. Pode carregar ração: ' +
          e(pode) +
          '.</div><table><tr><th>Data</th><th>Produto</th><th>Regime IDTF</th><th>Origem</th><th>Limpeza</th></tr>' +
          linhas
            .map(
              (l) =>
                '<tr><td class="mono">' +
                e(l.data) +
                '</td><td>' +
                e(l.produto) +
                '</td><td>' +
                e(l.r || '?') +
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

  renderNaoAchou(v) {
    return (
      <div className="tx-pagina">
        <nav aria-label="Caminho" className="tx-compartimento-trilha">
          <A href="/frota">Frota própria</A>
          <span aria-hidden>›</span>
          <span aria-current="page">Compartimento</span>
        </nav>
        <Cartao>
          <EstadoVazio titulo={v.pedido ? 'Compartimento não encontrado: ' + v.pedido : 'Escolha um compartimento'}>
            {v.pedido
              ? 'Nenhuma carreta com essa placa e posição na base. Confira a placa ou procure abaixo.'
              : 'Digite a placa da carreta para ver o histórico de cargas de cada compartimento.'}
          </EstadoVazio>
          <div className="tx-compartimento-procura">
            <EntradaCaixa
              icone={LUPA}
              value={v.procura}
              onChange={v.onProcura}
              placeholder="Placa da carreta, por exemplo SQT 6B77"
              aria-label="Procurar compartimento pela placa da carreta"
              data-tx-procura=""
              autoFocus
            />
            {v.achados.length ? (
              <ul className="tx-compartimento-achados">
                {v.achados.map((x) => (
                  <li key={x.href}>
                    <Botao tamanho="p" variante="contorno" href={x.href}>
                      <span className="tx-mono">{x.n}</span>
                    </Botao>
                  </li>
                ))}
              </ul>
            ) : v.procura.trim().length >= 2 ? (
              <p className="tx-tipo-denso tx-sec" role="status" style={{ margin: 0 }}>
                Nenhuma carreta com esse trecho de placa.
              </p>
            ) : null}
            <div style={{ display: 'flex', gap: 'var(--esp-2)', justifyContent: 'center' }}>
              <Botao tamanho="p" variante="texto" href="/frota">
                Ir para Frota própria
              </Botao>
              <Botao tamanho="p" variante="texto" href="/transportadores">
                Ir para Transportadores
              </Botao>
            </div>
          </div>
        </Cartao>
      </div>
    );
  }

  render() {
    const v = this.renderVals();
    if (v.naoAchou)
      return (
        <div style={{ minHeight: '100%' }} data-screen-label="Compartimento" data-tela="Compartimento" data-tx-nao-encontrado="">
          {this.renderNaoAchou(v)}
        </div>
      );
    return (
      <div style={{ minHeight: '100%' }} data-screen-label="Compartimento" data-tela="Compartimento">
        <div className="tx-pagina">
          <nav aria-label="Caminho" className="tx-compartimento-trilha">
            {v.trilha.map((t) => (
              <span key={t.n} style={{ display: 'contents' }}>
                <A href={t.href} className={t.mono ? 'tx-mono' : ''}>
                  {t.n}
                </A>
                <span aria-hidden>›</span>
              </span>
            ))}
            <span aria-current="page" className="tx-mono">
              {v.titulo}
            </span>
          </nav>

          <div className="tx-compartimento-cab">
            <div style={{ minWidth: 0 }}>
              <h1 className="tx-compartimento-titulo tx-mono">{v.titulo}</h1>
              <div className="tx-compartimento-meta">
                <span>{v.modelo}</span>
                <span>
                  CRLV{' '}
                  <Situacao tom={v.crlv.estado === 'ok' ? 'ok' : v.crlv.estado === 'vence' ? 'falta' : 'bloqueio'}>
                    {v.crlv.rotulo}
                  </Situacao>
                </span>
                <span style={{ display: 'inline' }}>
                  Dono hoje: <b>{v.dono}</b>, {v.conjuntoTxt}
                </span>
              </div>
            </div>
            <div className="tx-pagina-cab__acoes">
              <Botao variante="contorno" icone={BAIXAR} onClick={v.exportar} data-tx-exportar="">
                Exportar histórico
              </Botao>
            </div>
          </div>

          <section
            className={'tx-compartimento-veredito tx-compartimento-veredito--' + v.tom}
            aria-labelledby="comp-pergunta"
            data-tx-hero=""
            {...(v.quarentena ? { 'data-tx-quarentena': '' } : {})}
          >
            <span className="tx-compartimento-veredito__icone" aria-hidden>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONE[v.icone]}
              </svg>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 id="comp-pergunta" className="tx-tipo-rotulo" style={{ margin: 0 }}>
                Pode carregar ração?
              </h2>
              <div className="tx-compartimento-veredito__resposta" data-tx-pode="">
                {v.pode}
              </div>
              <p className="tx-compartimento-veredito__porque">{v.porque}</p>
            </div>
            {v.qTemViagem ? (
              <Botao variante="primario" href={v.qHref} data-tx-regularizar-viagem="">
                {v.qRot}
              </Botao>
            ) : null}
          </section>

          <Cartao
            lista
            titulo="Histórico de cargas"
            sub="A mais recente em cima. As três primeiras são o T-3 da próxima viagem."
            acoes={
              v.temIrmaos ? (
                <nav aria-label="Compartimentos do mesmo conjunto" className="tx-compartimento-seg">
                  {v.irmaos.map((ir) => (
                    <A
                      key={ir.n}
                      href={ir.href}
                      data-tx-irmao={ir.n}
                      aria-current={ir.atual ? 'page' : undefined}
                      className="tx-compartimento-seg__item"
                    >
                      {ir.n}
                    </A>
                  ))}
                </nav>
              ) : null
            }
          >
            <Tabela colunas={COLS} rotulo={'Histórico de cargas de ' + v.titulo}>
              <TabelaCabecalho>
                <span role="columnheader">
                  <span className="tx-so-leitor">Posição no T-3</span>
                </span>
                <span role="columnheader">Data</span>
                <span role="columnheader">Produto</span>
                <span role="columnheader">Limpeza antes de ração</span>
                <span role="columnheader">Origem do registro</span>
                <span role="columnheader">Limpeza feita</span>
              </TabelaCabecalho>
              {v.loading ? (
                <TabelaEsqueleto linhas={3} />
              ) : (
                v.linhas.map((l) => (
                  <TabelaLinha
                    key={l.k}
                    data-tx-carga=""
                    className={
                      (l.t3 ? 'tx-compartimento-t3' : 'tx-compartimento-antiga') + (l.proibida ? ' tx-compartimento-proibida' : '')
                    }
                  >
                    <span role="cell" className="tx-compartimento-t">
                      {l.t}
                    </span>
                    <span role="cell" className="num tx-mono">
                      {l.data}
                    </span>
                    <span role="cell" className="tx-tabela__celula">
                      <span className="tx-tabela__forte">{l.produto}</span>
                      <span className="tx-tabela__sub">{l.cat}</span>
                    </span>
                    <span role="cell">
                      <SeloRegime r={l.r} rotulo={l.rotulo} />
                    </span>
                    <span role="cell">{l.href ? <A href={l.href}>{l.fonte}</A> : <span className="tx-sec">{l.fonte}</span>}</span>
                    <span role="cell" className={l.limpezaAlerta ? 'tx-compartimento-alerta' : 'tx-sec'}>
                      {l.limpeza}
                    </span>
                  </TabelaLinha>
                ))
              )}
              {v.vazio && !v.loading ? (
                <EstadoVazio titulo="Nenhuma carga registrada">
                  O T-3 nasce vazio: a primeira viagem pede ao motorista as três últimas cargas deste compartimento.
                </EstadoVazio>
              ) : null}
            </Tabela>
          </Cartao>
        </div>
      </div>
    );
  }
}
