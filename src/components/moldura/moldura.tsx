'use client';
/*
 * A moldura do painel: sidebar, header com busca global e menu da pessoa, modais do
 * topo e toast. Mora no layout de (painel), então é desenhada uma vez: trocar de tela
 * troca só o conteúdo, sem piscar e sem perder o estado da sidebar.
 *
 * A sidebar mostra só o que o papel usa (M39). O toast aceita uma ação (Desfazer): as telas
 * mandam o evento tx-aviso com { texto, acao, onAcao } em vez do texto puro.
 */
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import TXmod from '@/lib/tx/tx-ui';
import { Badge, Botao, IconeFechar, Linha, Switch } from '@/components/ui';
import { avisar as avisarToast, PostoAvisos } from '@/components/ui/toast';
import { Icone } from './icones';
import './moldura.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TX: any = TXmod;

type Item = { k: string; n: string; href: string; badge?: 'hoje' | 'transportadores'; badgeTip?: string; tag?: string; novaAba?: boolean; externo?: boolean; tip?: string };

const GRUPOS: { n: string; itens: Item[] }[] = [
  { n: 'Operação', itens: [
    { k: 'hoje', n: 'Hoje', href: '/hoje', badge: 'hoje', badgeTip: 'viagens de hoje com pendência' },
    { k: 'viagens', n: 'Viagens', href: '/viagens' }
  ] },
  { n: 'Quem transporta', itens: [
    { k: 'transportadores', n: 'Transportadores', href: '/transportadores', badge: 'transportadores', badgeTip: 'transportadores com documento vencido ou vencendo em 15 dias' },
    { k: 'frota', n: 'Frota própria', href: '/frota' }
  ] },
  { n: 'Qualidade', itens: [
    { k: 'auditoria', n: 'Auditoria', href: '/auditoria' }
  ] }
];
const CADASTROS = [
  { k: 'produtos', n: 'Produtos e regimes' },
  { k: 'manual', n: 'Manual e treinamentos' },
  { k: 'fornecedores', n: 'Fornecedores' },
  { k: 'filiais', n: 'Filiais' }
];
const RODAPE: Item[] = [
  { k: 'config', n: 'Configurações', href: '/configuracoes' }
];
// Demonstração: some quando houver cliente usando (12-revisao-ux, U101).
const DEMO: Item[] = [
  { k: 'link', n: 'Protótipo mobile', tag: 'demo', href: '/mobile', tip: 'O link que o motorista recebe pelo WhatsApp, num celular, com as viagens de exemplo' },
  // O protótipo .dc.html (v1 e v2) é copiado para public/prototipo no build: scripts/copiar-prototipo.mjs.
  { k: 'anterior', n: 'Versão anterior', tag: 'demo', href: '/prototipo/versao-anterior.html', externo: true }
];

// Telas por papel (premissa da 11-revisao-mvp, M39). Com TX.podeVer no motor, ele decide.
const TELAS_PAPEL: Record<string, string[]> = {
  afretador: ['hoje', 'viagens', 'transportadores'],
  frota: ['hoje', 'viagens', 'frota'],
  consultoria: ['viagens', 'auditoria', 'cadastros'],
};
function veTela(papel: string, k: string) {
  if (k === 'link' || k === 'anterior') return true;
  if (typeof TX.podeVer === 'function') {
    try { const r = TX.podeVer('tela', k); if (typeof r === 'boolean') return r; } catch { /* API em construção */ }
  }
  const lista = TELAS_PAPEL[papel];
  return !lista || lista.includes(k);
}

// "Ir para" da busca global: telas pelo nome.
const TELAS_BUSCA = [
  { k: 'hoje', n: 'Hoje', href: '/hoje' },
  { k: 'viagens', n: 'Viagens', href: '/viagens' },
  { k: 'transportadores', n: 'Transportadores', href: '/transportadores' },
  { k: 'frota', n: 'Frota própria', href: '/frota' },
  { k: 'auditoria', n: 'Auditoria', href: '/auditoria' },
  { k: 'cadastros', n: 'Produtos e regimes', href: '/cadastros?aba=produtos' },
  { k: 'cadastros', n: 'Manual e treinamentos', href: '/cadastros?aba=manual' },
  { k: 'cadastros', n: 'Fornecedores', href: '/cadastros?aba=fornecedores' },
  { k: 'cadastros', n: 'Filiais', href: '/cadastros?aba=filiais' },
  { k: 'config', n: 'Configurações', href: '/configuracoes' },
];

// Item aceso pela rota. Compartimento é de frota própria ou de transportador: decide o dado.
function itemAtivo(rota: string, busca: URLSearchParams): string | null {
  const r = rota.split('/')[1] || '';
  if (r === 'viagem') return 'viagens';
  if (r === 'compartimento') {
    const p = TX.placa(busca.get('placa'));
    return !p || p.dono === 'propria' ? 'frota' : 'transportadores';
  }
  if (r === 'configuracoes') return 'config';
  if (r === 'mobile') return 'link';
  return r || null;
}
function abaCadastros(busca: URLSearchParams) {
  const a = busca.get('aba');
  return CADASTROS.some(c => c.k === a) ? a : 'produtos';
}

function lerLS(k: string, padrao: string) { try { const v = localStorage.getItem(k); return v === null ? padrao : v; } catch { return padrao; } }
function gravarLS(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } }

const PREFS = [
  { k: 'bloq', t: 'Bloqueio técnico na minha filial', sub: 'Sempre ligado: requisito da certificação.', lock: true },
  { k: 'link', t: 'Motorista terminou o link', sub: 'Na tela e no celular.' },
  { k: 'venc', t: 'Documento de transportador a vencer', sub: 'Aos 60, 30 e 15 dias.' },
  { k: 'idtf', t: 'Nova versão da base IDTF', sub: 'Quando a Traxium publicar.' }
];

const LUPA = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ flex: 'none' }} aria-hidden><circle cx="7" cy="7" r="4.6" /><line x1="10.5" y1="10.5" x2="13.5" y2="13.5" /></svg>;
const IR = <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mo-gb-ir" aria-hidden><path d="M3 8h9.5M8.5 4l4 4-4 4" /></svg>;

type GbItem = { t: string; sub: string; href: string; dot?: string; tag?: string; tagC?: string; ir?: boolean };
type AvisoDetalhe = string | { texto: string; acao?: string; onAcao?: () => void };

export function Moldura({ children }: { children: ReactNode }) {
  const rota = usePathname();
  const busca = useSearchParams();
  const router = useRouter();

  // Sessão, badges e preferências vêm do navegador (localStorage): nada é desenhado antes de montar.
  const [pronto, setPronto] = useState(false);
  const [, setVersao] = useState(0);
  const [recolhida, setRecolhida] = useState(false);
  const [cadAberto, setCadAberto] = useState(true);
  const [baixa, setBaixa] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [modal, setModal] = useState<null | 'perfil' | 'prefs' | 'entrar' | 'saiu' | 'sair'>(null);
  const [gbQ, setGbQ] = useState('');
  const [gbAberta, setGbAberta] = useState(false);
  const [gbAtivo, setGbAtivo] = useState(-1);
  const [prefsOn, setPrefsOn] = useState<Record<string, boolean>>({ venc: true, link: true, idtf: false });
  const campoBusca = useRef<HTMLInputElement>(null);
  const abriuModal = useRef<HTMLElement | null>(null);

  const avisar = useCallback((d: AvisoDetalhe) => {
    if (typeof d === 'string') { avisarToast({ texto: d }); return; }
    const onAcao = d.onAcao;
    avisarToast({ texto: d.texto, acao: d.acao && onAcao ? { rotulo: d.acao, aoClicar: onAcao } : undefined });
  }, []);

  useEffect(() => {
    TX.ui.roteador = router;
    TX.ui.moldura = true;
    setRecolhida(lerLS('tx-nav', '0') === '1');
    setCadAberto(lerLS('tx-nav-cad', '1') === '1');
    const altura = () => setBaixa(window.innerHeight < 820);
    altura();
    setPronto(true);
    const off = TX.ouvir((v: number) => setVersao(v));
    const aviso = (e: Event) => avisar((e as CustomEvent).detail);
    const topo = (e: Event) => { abriuModal.current = document.activeElement as HTMLElement; setModal((e as CustomEvent).detail); };
    window.addEventListener('resize', altura);
    window.addEventListener('tx-aviso', aviso);
    window.addEventListener('tx-topo', topo);
    return () => {
      off();
      TX.ui.moldura = false;
      window.removeEventListener('resize', altura);
      window.removeEventListener('tx-aviso', aviso);
      window.removeEventListener('tx-topo', topo);
    };
  }, [router, avisar]);

  // Trocou de tela: fecha o que é da tela anterior e volta o conteúdo ao topo.
  const endereco = rota + '?' + busca.toString();
  useEffect(() => {
    setGbAberta(false);
    setGbQ('');
    setPerfilAberto(false);
  }, [endereco]);
  useEffect(() => {
    const el = document.querySelector('[data-tx-conteudo]');
    if (el && !location.hash) el.scrollTop = 0;
  }, [rota]);

  // Clique fora fecha popover; Esc fecha modal, depois popover; "/" vai para a busca.
  useEffect(() => {
    const fora = (ev: MouseEvent) => {
      const t = ev.target as HTMLElement;
      if (!t.closest || !t.closest('[data-tx-mo-pop]')) { setPerfilAberto(false); setGbAberta(false); }
    };
    const tecla = (ev: KeyboardEvent) => {
      const t = ev.target as HTMLElement;
      if (ev.key === '/' && !ev.ctrlKey && !ev.metaKey) {
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        ev.preventDefault(); campoBusca.current?.focus(); return;
      }
      if (ev.key !== 'Escape') return;
      if (modal) { fecharModal(); return; }
      if (t && t.matches && t.matches('[data-tx-gbusca]') && !gbAberta && gbQ) { setGbQ(''); return; }
      setPerfilAberto(false); setGbAberta(false);
    };
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', tecla);
    return () => { document.removeEventListener('mousedown', fora); document.removeEventListener('keydown', tecla); };
  });

  function fecharModal() {
    setModal(null);
    const volta = abriuModal.current;
    abriuModal.current = null;
    if (volta && document.contains(volta)) setTimeout(() => volta.focus(), 0);
  }
  function abrirModal(qual: 'perfil' | 'prefs' | 'entrar' | 'sair') {
    abriuModal.current = document.querySelector('[data-tx-avatar]');
    setPerfilAberto(false);
    setModal(qual);
  }
  function alternarNav() {
    const n = !recolhida;
    gravarLS('tx-nav', n ? '1' : '0');
    setRecolhida(n);
    window.dispatchEvent(new CustomEvent('tx-nav', { detail: n }));
  }

  if (!pronto) {
    return <div className="mo"><div style={{ width: 264 }} className="mo-sb"><div className="mo-sb-cartao" /></div><div className="mo-col" /></div>;
  }

  const u = TX.sessao();
  const b = TX.badges(u);
  const ativo = itemAtivo(rota, busca);
  const naCadastros = ativo === 'cadastros';
  const aba = naCadastros ? abaCadastros(busca) : null;
  const cadVisivel = (naCadastros || cadAberto) && !recolhida;
  const sbPad = baixa ? 'var(--esp-1-5) var(--esp-3)' : 'var(--esp-2) var(--esp-3)';
  const sbSubPad = '0 var(--esp-3) 0 39px';
  const sbGrupoPad = baixa ? 'var(--esp-1-5) var(--esp-3) var(--esp-0-5)' : 'var(--esp-2-5) var(--esp-3) var(--esp-1)';
  const largura = recolhida ? 84 : 264;
  const alc = u.alcada ? TX.db.alcadas.find((a: { k: string }) => a.k === u.alcada) : null;
  const filiaisTxt = u.filiais.length === 4 ? 'Todas as filiais' : u.filiais.map((f: string) => TX.filial(f).nome).join(', ');
  const assinadas = TX.db.viagens.reduce((n: number, v: { liberacoes?: { assinante: string }[] }) => n + (v.liberacoes || []).filter(l => l.assinante === u.id).length, 0);
  const todasHref = '/viagens?periodo=tudo&q=' + encodeURIComponent(gbQ);
  const iniciais = TX.fmt.iniciais(u.nome);

  // Busca global: registros do motor, depois "Ir para" com as telas que o papel vê.
  const qn = TX.norm(gbQ);
  const grupos: { n: string; itens: GbItem[] }[] = gbAberta && qn.length >= 2 ? TX.ui.buscaGlobal(gbQ).map((g: { n: string; itens: GbItem[] }) => ({ n: g.n, itens: g.itens })) : [];
  const telasAchadas = gbAberta && qn.length >= 2 ? TELAS_BUSCA.filter(t => veTela(u.papel, t.k) && TX.norm(t.n).includes(qn)) : [];
  if (telasAchadas.length) grupos.push({ n: 'IR PARA', itens: telasAchadas.map(t => ({ t: t.n, sub: 'Tela', href: t.href, ir: true })) });
  const planos = grupos.flatMap(g => g.itens);
  const vaiPara = (href: string) => { setGbAberta(false); router.push(href); };

  const visiveis = (lista: Item[]) => lista.filter(d => veTela(u.papel, d.k));
  const gruposVis = GRUPOS.map(g => ({ ...g, itens: visiveis(g.itens) })).filter(g => g.itens.length || (g.n === 'Qualidade' && veTela(u.papel, 'cadastros')));

  function item(d: Item) {
    const on = d.k === ativo;
    const qtd = d.badge ? b[d.badge] : 0;
    const frase = qtd > 0 && d.badgeTip ? qtd + ' ' + d.badgeTip : '';
    const miolo = (
      <>
        <Icone k={d.k} />
        {!recolhida && <span data-tx-item={d.k} className="mo-item-rot">{d.n}</span>}
        {!recolhida && qtd > 0 && <span title={frase} data-tx-badge={d.k} className="mo-badge num" aria-hidden>{qtd}</span>}
        {!recolhida && d.tag && <span className="mo-tag">{d.tag}</span>}
      </>
    );
    const rotulo = recolhida || frase ? d.n + (frase ? ', ' + frase : '') : undefined;
    const props = { title: d.tip || d.n, className: 'mo-item', style: { padding: sbPad }, 'aria-label': rotulo };
    if (d.novaAba) return <a key={d.k} href={d.href} target="_blank" rel="noopener" {...props}>{miolo}</a>;
    if (d.externo) return <a key={d.k} href={d.href} {...props}>{miolo}</a>;
    return <Link key={d.k} href={d.href} aria-current={on ? 'page' : undefined} {...props}>{miolo}</Link>;
  }

  return (
    <div className="mo">
      <nav data-tx-sidebar aria-label="Menu principal" className="mo-sb" style={{ width: largura }}>
        <div className="mo-sb-cartao" style={{ padding: 'var(--esp-5) ' + (recolhida ? 'var(--esp-3)' : 'var(--esp-4)') }}>
          <Link href="/hoje" title="Traxium: ir para Hoje" className="mo-marca">
            <Icone k="logo" />
            {!recolhida && <div><div className="mo-marca-nome">Traxium</div><div className="mo-marca-tenant">{TX.db.tenant.nome.replace(' Ltda', '')}</div></div>}
          </Link>
          {gruposVis.map(g => (
            <div key={g.n}>
              {recolhida ? <div className="mo-sep" /> : <div className="mo-grupo" style={{ padding: sbGrupoPad }}>{g.n}</div>}
              <div className="mo-lista">
                {g.itens.map(item)}
                {g.n === 'Qualidade' && veTela(u.papel, 'cadastros') && (
                  <>
                    <button type="button" className="mo-item" style={{ padding: sbPad }} title="Cadastros" aria-expanded={cadVisivel}
                      aria-current={naCadastros && recolhida ? 'page' : undefined}
                      onClick={() => {
                        if (recolhida) { router.push('/cadastros'); return; }
                        if (naCadastros) return;
                        const n = !cadAberto; gravarLS('tx-nav-cad', n ? '1' : '0'); setCadAberto(n);
                      }}>
                      <Icone k="cadastros" />
                      {!recolhida && <span data-tx-item="cadastros" className="mo-item-rot">Cadastros</span>}
                      {!recolhida && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mo-chev" aria-hidden><path d="M4.5 2.5 8 6l-3.5 3.5" /></svg>}
                    </button>
                    {cadVisivel && (
                      <div className="mo-sub">
                        {CADASTROS.map(c => (
                          <Link key={c.k} href={'/cadastros?aba=' + c.k} data-tx-sub={c.k} className="mo-subitem" style={{ padding: sbSubPad }} aria-current={aba === c.k ? 'page' : undefined}>
                            <span className="mo-subitem-dot" />{c.n}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="mo-rodape">
            {visiveis(RODAPE).map(item)}
            {recolhida ? <div className="mo-sep" /> : <div className="mo-grupo" style={{ padding: sbGrupoPad }}>Demonstração</div>}
            {DEMO.map(item)}
            {!recolhida && !baixa && <div title="Base IDTF mantida pela Traxium" className="mo-base"><span className="mo-base-dot" />Base IDTF {TX.db.baseIDTF.versao} vigente</div>}
            <button type="button" onClick={alternarNav} title="Recolher ou expandir o menu" aria-label={recolhida ? 'Expandir menu' : 'Recolher menu'} className="mo-item mo-recolher" style={{ padding: sbPad }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9.5 3 4.5 8l5 5" /><line x1="12" y1="3" x2="12" y2="13" /></svg>
              {!recolhida && <span className="mo-item-rot">Recolher menu</span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="mo-col">
        <header data-tx-header className="mo-hd">
          <div data-tx-mo-pop className="mo-busca" role="search">
            <div className="mo-busca-campo">
              {LUPA}
              <input ref={campoBusca} value={gbQ} data-tx-gbusca aria-label="Busca global"
                role="combobox" aria-expanded={gbAberta && qn.length >= 2} aria-controls="mo-gb" aria-autocomplete="list"
                aria-activedescendant={gbAtivo >= 0 && planos[gbAtivo] ? 'mo-gb-' + gbAtivo : undefined}
                placeholder="Buscar viagem, placa, CT-e, NF, transportador ou tela"
                onChange={e => { setGbQ(e.target.value); setGbAberta(true); setGbAtivo(-1); }}
                onFocus={() => { if (gbQ) setGbAberta(true); }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    if (!planos.length) return;
                    e.preventDefault();
                    const d = e.key === 'ArrowDown' ? 1 : -1;
                    setGbAtivo(i => (i + d + planos.length) % planos.length);
                    return;
                  }
                  if (e.key !== 'Enter') return;
                  if (gbAtivo >= 0 && planos[gbAtivo]) { vaiPara(planos[gbAtivo].href); return; }
                  const g = TX.ui.buscaGlobal(gbQ);
                  const prim = g[0] && g[0].itens[0];
                  router.push(prim ? prim.href : todasHref);
                }} />
              <span title="Atalho: tecla barra" className="mo-tecla" aria-hidden>/</span>
            </div>
            {gbAberta && qn.length >= 2 && (
              <div id="mo-gb" data-tx-gb-resultados className="mo-gb" role="listbox" aria-label="Resultados da busca">
                {(() => {
                  let i = -1;
                  return grupos.map(gg => (
                    <div key={gg.n} role="group" aria-label={gg.n}>
                      <div className="mo-gb-grupo" aria-hidden>{gg.n}</div>
                      {gg.itens.map(gi => {
                        i++;
                        const meu = i;
                        return (
                          <Link key={gi.href} id={'mo-gb-' + meu} role="option" aria-selected={meu === gbAtivo} href={gi.href} data-tx-gb-item className="mo-gb-item"
                            data-ativo={meu === gbAtivo ? '' : undefined} onClick={() => setGbAberta(false)} onMouseEnter={() => setGbAtivo(meu)}>
                            {gi.ir ? IR : <span className="mo-gb-dot" style={{ background: gi.dot }} />}
                            <div className="mo-gb-texto"><div className="mo-gb-t">{gi.t}</div><div className="mo-gb-sub">{gi.sub}</div></div>
                            {gi.tag ? <span className="mo-gb-tag" style={{ color: gi.tagC }}>{gi.tag}</span> : null}
                          </Link>
                        );
                      })}
                    </div>
                  ));
                })()}
                {grupos.length === 0 && <div className="mo-gb-vazio">Nada encontrado para &quot;{gbQ}&quot;. A busca aceita ordem, CT-e, NF, placa, nome, CPF, RNTRC, produto e nome de tela.</div>}
                <Link href={todasHref} className="mo-gb-todas" onClick={() => setGbAberta(false)}>Buscar &quot;{gbQ}&quot; em todas as viagens</Link>
              </div>
            )}
          </div>
          <div className="mo-pessoa">
            <div className="mo-pessoa-nome"><div className="mo-pessoa-n">{u.nome}</div><div className="mo-pessoa-c">{u.cargo}</div></div>
            <div data-tx-mo-pop className="mo-pop">
              <button type="button" onClick={() => setPerfilAberto(x => !x)} title={u.nome} aria-label={'Menu de ' + u.nome} aria-expanded={perfilAberto} aria-haspopup="menu"
                data-tx-avatar className="mo-avatar">{iniciais}</button>
              {perfilAberto && (
                <div className="mo-menu" role="menu">
                  <div className="mo-menu-cab">
                    <span className="mo-avatar mo-avatar--m" aria-hidden>{iniciais}</span>
                    <div style={{ minWidth: 0 }}><div className="mo-pessoa-n">{u.nome}</div><div className="mo-pessoa-c">{u.cargo}</div></div>
                  </div>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('perfil')}>Meu perfil</button>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('prefs')}>Avisos</button>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('entrar')}>Entrar como<Badge cheio>demo</Badge></button>
                  <div className="mo-menu-sep" />
                  <button type="button" role="menuitem" className="mo-menu-op mo-menu-op--perigo" onClick={() => abrirModal('sair')}>Sair...</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main data-tx-conteudo className="mo-conteudo">
          <div className="mo-miolo">{children}</div>
        </main>
      </div>

      {modal && (
        <div className="mo-veu" onClick={fecharModal}>
          <Dialogo onFechar={fecharModal}
            largura={modal === 'perfil' ? 470 : modal === 'prefs' ? 520 : modal === 'sair' ? 440 : 540}
            titulo={modal === 'perfil' ? 'Meu perfil' : modal === 'prefs' ? 'Avisos' : modal === 'sair' ? 'Sair da conta' : modal === 'saiu' ? 'Sessão encerrada' : 'Entrar como'}>
            {modal === 'perfil' && (
              <>
                <div className="mo-perfil">
                  <span className="mo-avatar mo-avatar--g" aria-hidden>{iniciais}</span>
                  <div className="mo-perfil-n">{u.nome}</div>
                  <div className="mo-perfil-e">{u.email}</div>
                </div>
                <div className="mo-modal-corpo">
                  <Linha rotulo="Papel"><span className="tx-peso-700">{u.cargo}</span></Linha>
                  <Linha rotulo="Filiais"><span className="tx-peso-700">{filiaisTxt}</span></Linha>
                  <Linha rotulo="Alçada de liberação"><span className="tx-peso-700">{alc ? alc.n : 'Sem alçada de liberação'}</span></Linha>
                  <Linha rotulo="Liberações assinadas"><span className="tx-mono num tx-peso-600">{assinadas}</span></Linha>
                </div>
                <div className="mo-nota">{alc ? alc.libera : 'Pode conferir, registrar e pedir; liberação por autoridade fica com a Qualidade ou a Direção.'}</div>
              </>
            )}
            {modal === 'prefs' && (
              <>
                <div className="mo-modal-sub">O que chega para você, na tela e no celular.</div>
                <div className="mo-modal-corpo">
                  {PREFS.map(p => (
                    <div key={p.k} className="mo-pref">
                      <Switch rotulo={<span className="tx-peso-700">{p.t}</span>} dica={p.sub} checked={!!(p.lock || prefsOn[p.k])} disabled={p.lock}
                        onChange={() => setPrefsOn({ ...prefsOn, [p.k]: !prefsOn[p.k] })} data-tx-pref={p.k} />
                    </div>
                  ))}
                </div>
              </>
            )}
            {(modal === 'entrar' || modal === 'saiu') && (
              <>
                <div className="mo-modal-sub">{modal === 'saiu' ? 'O que você registrou continua na viagem com seu nome e a hora. Escolha quem entra agora.' : 'Demonstração: veja a tela como cada papel vê. Filiais, menu e alçada mudam junto.'}</div>
                <div className="mo-modal-corpo" role="radiogroup" aria-label="Usuário">
                  {TX.db.usuarios.map((x: { id: string; nome: string; cargo: string; filiais: string[] }) => {
                    const on = x.id === u.id;
                    return (
                      <button key={x.id} type="button" role="radio" aria-checked={on} data-tx-usuario={x.id} className="mo-op"
                        onClick={() => {
                          TX.entrarComo(x.id);
                          setModal(null);
                          window.dispatchEvent(new CustomEvent('tx-usuario', { detail: x }));
                          avisar('Agora você está como ' + x.nome + ' (' + x.cargo.toLowerCase() + ').');
                        }}>
                        <span className="mo-op-ponto" aria-hidden />
                        <span className="mo-avatar mo-avatar--m" aria-hidden>{TX.fmt.iniciais(x.nome)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}><div className="mo-op-t">{x.nome}</div><div className="mo-op-s">{x.cargo}, {x.filiais.length === 4 ? 'todas as filiais' : 'filial ' + x.filiais.map(f => TX.filial(f).nome).join(', ')}</div></div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {modal === 'sair' && (
              <>
                <div className="mo-quem">
                  <span className="mo-avatar mo-avatar--m" aria-hidden>{iniciais}</span>
                  <div><div className="mo-pessoa-n">{u.nome}</div><div className="mo-pessoa-c">{u.cargo}</div></div>
                </div>
                <div className="mo-nota">O que você registrou continua na viagem, com seu nome e a hora. Formulário aberto sem confirmar não foi gravado.</div>
                <div className="mo-acoes">
                  <Botao onClick={fecharModal}>Cancelar</Botao>
                  <Botao variante="perigo" onClick={() => setModal('saiu')}>Sair</Botao>
                </div>
              </>
            )}
          </Dialogo>
        </div>
      )}

      <PostoAvisos />
    </div>
  );
}

// Diálogo com foco preso dentro: Tab circula entre os controles, e o foco começa no primeiro.
function Dialogo({ titulo, largura, onFechar, children }: { titulo: string; largura: number; onFechar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focaveis = () => Array.from(el.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(x => !x.hasAttribute('disabled'));
    (focaveis()[1] || focaveis()[0])?.focus();
    const tab = (ev: KeyboardEvent) => {
      if (ev.key !== 'Tab') return;
      const f = focaveis();
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
    };
    el.addEventListener('keydown', tab);
    return () => el.removeEventListener('keydown', tab);
  }, [titulo]);
  return (
    <div ref={ref} role="dialog" aria-modal="true" data-foco-proprio aria-label={titulo} className="mo-modal" style={{ width: largura }} onClick={e => e.stopPropagation()}>
      <div className="mo-modal-cab">
        <h2 className="mo-modal-tit">{titulo}</h2>
        <Botao variante="icone" aria-label="Fechar" title="Fechar" onClick={onFechar} icone={IconeFechar} />
      </div>
      {children}
    </div>
  );
}
