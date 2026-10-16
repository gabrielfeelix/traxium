'use client';
/*
 * A moldura do painel: sidebar, header com busca global e menu da pessoa, modais do
 * topo e toast. Mora no layout de (painel), então é desenhada uma vez: trocar de tela
 * troca só o conteúdo, sem piscar e sem perder o estado da sidebar.
 *
 * No protótipo .dc.html esta marcação era copiada em cada tela por
 * scripts/gerar-sidebar.mjs, e cada clique recarregava a página inteira.
 */
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import TXmod from '@/lib/tx/tx-ui';
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
    { k: 'transportadores', n: 'Transportadores', href: '/transportadores', badge: 'transportadores', badgeTip: 'documentos vencidos ou vencendo em 15 dias' },
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
  { k: 'config', n: 'Configurações', href: '/configuracoes' },
  { k: 'link', n: 'Link do motorista', tag: 'demo', href: '/link?id=VG-3122', novaAba: true, tip: 'Abre em outra aba a página que o motorista recebe pelo WhatsApp' },
  // O protótipo .dc.html (v1 e v2) é copiado para public/prototipo no build: scripts/copiar-prototipo.mjs.
  { k: 'anterior', n: 'Versão anterior', href: '/prototipo/versao-anterior.html', externo: true }
];

// Item aceso pela rota. Compartimento é de frota própria ou de transportador: decide o dado.
function itemAtivo(rota: string, busca: URLSearchParams): string | null {
  const r = rota.split('/')[1] || '';
  if (r === 'viagem') return 'viagens';
  if (r === 'compartimento') {
    const p = TX.placa(busca.get('placa'));
    return p && p.dono === 'propria' ? 'frota' : 'transportadores';
  }
  if (r === 'configuracoes') return 'config';
  return r || null;
}
function abaCadastros(busca: URLSearchParams) {
  const a = busca.get('aba');
  return CADASTROS.some(c => c.k === a) ? a : 'produtos';
}

function lerLS(k: string, padrao: string) { try { const v = localStorage.getItem(k); return v === null ? padrao : v; } catch { return padrao; } }
function gravarLS(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } }

const PREFS = [
  { k: 'bloq', t: 'Bloqueio técnico na minha filial', sub: 'sempre ativo: requisito da certificação', lock: true },
  { k: 'link', t: 'Motorista terminou o link', sub: 'aviso na tela e no celular' },
  { k: 'venc', t: 'Documento de transportador a vencer', sub: 'aos 60, 30 e 15 dias' },
  { k: 'idtf', t: 'Nova versão da base IDTF', sub: 'quando a Traxium publicar' }
];

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
  const [toast, setToast] = useState<string | null>(null);
  const [prefsOn, setPrefsOn] = useState<Record<string, boolean>>({ venc: true, link: true, idtf: false });
  const toastT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const campoBusca = useRef<HTMLInputElement>(null);
  const abriuModal = useRef<HTMLElement | null>(null);

  const avisar = useCallback((msg: string) => {
    setToast(msg);
    if (toastT.current) clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 4200);
  }, []);

  useEffect(() => {
    TX.ui.roteador = router;
    TX.ui.moldura = true;
    setRecolhida(lerLS('tx-nav', '0') === '1');
    setCadAberto(lerLS('tx-nav-cad', '1') === '1');
    const altura = () => setBaixa(window.innerHeight < 730);
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
  const sbPad = baixa ? '6px 12px' : '8px 12px';
  const sbSubPad = baixa ? '3px 12px 3px 39px' : '5px 12px 5px 39px';
  const sbGrupoPad = baixa ? '6px 12px 2px' : '10px 12px 3px';
  const largura = recolhida ? 84 : 264;
  const alc = u.alcada ? TX.db.alcadas.find((a: { k: string }) => a.k === u.alcada) : null;
  const filiaisTxt = u.filiais.length === 4 ? 'Todas as filiais' : u.filiais.map((f: string) => TX.filial(f).nome).join(', ');
  const assinadas = TX.db.viagens.reduce((n: number, v: { liberacoes?: { assinante: string }[] }) => n + (v.liberacoes || []).filter(l => l.assinante === u.id).length, 0);
  const grupos = gbAberta && TX.norm(gbQ).length >= 2 ? TX.ui.buscaGlobal(gbQ) : [];
  const todasHref = '/viagens?periodo=tudo&q=' + encodeURIComponent(gbQ);
  const iniciais = TX.fmt.iniciais(u.nome);

  function item(d: Item) {
    const on = d.k === ativo;
    const qtd = d.badge ? b[d.badge] : 0;
    const miolo = (
      <>
        <Icone k={d.k} />
        {!recolhida && <span data-tx-item={d.k} className="mo-item-rot">{d.n}</span>}
        {!recolhida && qtd > 0 && <span title={d.badgeTip} data-tx-badge={d.k} className="mo-badge">{qtd}</span>}
        {!recolhida && d.tag && <span className="mo-tag">{d.tag}</span>}
      </>
    );
    const props = { title: d.tip || d.n, className: 'mo-item', style: { padding: sbPad }, 'aria-label': recolhida ? d.n : undefined };
    if (d.novaAba) return <a key={d.k} href={d.href} target="_blank" rel="noopener" {...props}>{miolo}</a>;
    if (d.externo) return <a key={d.k} href={d.href} {...props}>{miolo}</a>;
    return <Link key={d.k} href={d.href} aria-current={on ? 'page' : undefined} {...props}>{miolo}</Link>;
  }

  return (
    <div className="mo">
      <nav data-tx-sidebar aria-label="Menu principal" className="mo-sb" style={{ width: largura }}>
        <div className="mo-sb-cartao" style={{ padding: '18px ' + (recolhida ? '14px' : '16px') }}>
          <Link href="/hoje" title="Traxium: ir para Hoje" className="mo-marca">
            <Icone k="logo" />
            {!recolhida && <div><div className="mo-marca-nome">Traxium</div><div className="mo-marca-tenant">{TX.db.tenant.nome.replace(' Ltda', '')}</div></div>}
          </Link>
          {GRUPOS.map(g => (
            <div key={g.n}>
              {recolhida ? <div className="mo-sep" /> : <div className="mo-grupo" style={{ padding: sbGrupoPad }}>{g.n}</div>}
              <div className="mo-lista">
                {g.itens.map(item)}
                {g.n === 'Qualidade' && (
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
                      {!recolhida && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mo-chev" style={{ transform: cadVisivel ? 'rotate(90deg)' : 'none' }}><path d="M4.5 2.5 8 6l-3.5 3.5" /></svg>}
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
            {RODAPE.map(item)}
            {!recolhida && !baixa && <div title="Base IDTF mantida pela Traxium" className="mo-base"><span className="mo-base-dot" />Base IDTF {TX.db.baseIDTF.versao} vigente</div>}
            <button type="button" onClick={alternarNav} title="Recolher ou expandir o menu" aria-label={recolhida ? 'Expandir menu' : 'Recolher menu'} className="mo-item mo-recolher" style={{ padding: sbPad }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transform: recolhida ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}><path d="M9.5 3 4.5 8l5 5" /><line x1="12" y1="3" x2="12" y2="13" /></svg>
              {!recolhida && <span className="mo-item-rot">Recolher menu</span>}
            </button>
          </div>
        </div>
      </nav>

      <div className="mo-col">
        <header data-tx-header className="mo-hd">
          <div data-tx-mo-pop className="mo-busca" role="search">
            <div className="mo-busca-campo">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7c8f8d" strokeWidth="1.6" strokeLinecap="round" style={{ flex: 'none' }} aria-hidden><circle cx="7" cy="7" r="4.6" /><line x1="10.5" y1="10.5" x2="13.5" y2="13.5" /></svg>
              <input ref={campoBusca} value={gbQ} data-tx-gbusca aria-label="Busca global"
                placeholder="Buscar viagem, placa, CT-e, NF, transportador ou produto"
                onChange={e => { setGbQ(e.target.value); setGbAberta(true); }}
                onFocus={() => { if (gbQ) setGbAberta(true); }}
                onKeyDown={e => {
                  if (e.key !== 'Enter') return;
                  const g = TX.ui.buscaGlobal(gbQ);
                  const prim = g[0] && g[0].itens[0];
                  router.push(prim ? prim.href : todasHref);
                }} />
              <span title="Atalho: tecla barra" className="mo-tecla" aria-hidden>/</span>
            </div>
            {gbAberta && TX.norm(gbQ).length >= 2 && (
              <div data-tx-gb-resultados className="mo-gb">
                {grupos.map((gg: { n: string; itens: { t: string; sub: string; href: string; dot: string; tag: string; tagC: string }[] }) => (
                  <div key={gg.n}>
                    <div className="mo-gb-grupo">{gg.n}</div>
                    {gg.itens.map(gi => (
                      <Link key={gi.href} href={gi.href} data-tx-gb-item className="mo-gb-item" onClick={() => setGbAberta(false)}>
                        <span className="mo-gb-dot" style={{ background: gi.dot }} />
                        <div style={{ minWidth: 0, flex: 1 }}><div className="mo-gb-t">{gi.t}</div><div className="mo-gb-sub">{gi.sub}</div></div>
                        <span className="mo-gb-tag" style={{ color: gi.tagC }}>{gi.tag}</span>
                      </Link>
                    ))}
                  </div>
                ))}
                {grupos.length === 0 && <div className="mo-gb-vazio">Nada encontrado para &quot;{gbQ}&quot;. A busca aceita ordem, CT-e, NF, placa, nome, CPF, RNTRC e produto.</div>}
                <Link href={todasHref} className="mo-gb-todas" onClick={() => setGbAberta(false)}>Buscar &quot;{gbQ}&quot; em todas as viagens →</Link>
              </div>
            )}
          </div>
          <div className="mo-pessoa">
            <div className="mo-pessoa-nome"><div style={{ fontSize: 13, fontWeight: 800 }}>{u.nome}</div><div style={{ fontSize: 11.5, color: 'var(--texto-sec)' }}>{u.cargo}</div></div>
            <div data-tx-mo-pop style={{ position: 'relative' }}>
              <button type="button" onClick={() => setPerfilAberto(x => !x)} title={u.nome} aria-label={'Menu de ' + u.nome} aria-expanded={perfilAberto} aria-haspopup="menu"
                data-tx-avatar className="mo-avatar" style={{ background: 'linear-gradient(135deg,' + u.g1 + ',' + u.g2 + ')' }}>{iniciais}</button>
              {perfilAberto && (
                <div className="mo-menu" role="menu">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 12px', borderBottom: '1px solid var(--superficie-2)', marginBottom: 4 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 99, background: 'linear-gradient(135deg,' + u.g1 + ',' + u.g2 + ')', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{iniciais}</span>
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 800 }}>{u.nome}</div><div style={{ fontSize: 11.5, color: 'var(--texto-sec)' }}>{u.cargo}</div></div>
                  </div>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('perfil')}>Meu perfil</button>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('prefs')}>Avisos</button>
                  <button type="button" role="menuitem" className="mo-menu-op" onClick={() => abrirModal('entrar')}>Entrar como<span className="mo-papel">{TX.ui.ROTULO_PAPEL[u.papel] || u.papel}</span></button>
                  <div style={{ height: 1, background: 'var(--superficie-2)', margin: '5px 8px' }} />
                  <button type="button" role="menuitem" className="mo-menu-op" style={{ color: 'var(--perigo)' }} onClick={() => abrirModal('sair')}>Sair</button>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 14 }}>
                  <span style={{ width: 72, height: 72, borderRadius: 99, background: 'linear-gradient(135deg,' + u.g1 + ',' + u.g2 + ')', color: '#fff', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px #fff,0 0 0 6px #e4eae8' }}>{iniciais}</span>
                  <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4 }}>{u.nome}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--texto-sec)' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 18 }}>
                  <div className="mo-linha"><span style={{ color: 'var(--texto-sec)' }}>Papel</span><span style={{ fontWeight: 700, textAlign: 'right' }}>{u.cargo}</span></div>
                  <div className="mo-linha"><span style={{ color: 'var(--texto-sec)' }}>Escopo</span><span style={{ fontWeight: 700, textAlign: 'right' }}>{filiaisTxt}</span></div>
                  <div className="mo-linha"><span style={{ color: 'var(--texto-sec)' }}>Alçada de liberação</span><span style={{ fontWeight: 700, textAlign: 'right' }}>{alc ? alc.n : 'Sem alçada de liberação'}</span></div>
                  <div className="mo-linha"><span style={{ color: 'var(--texto-sec)' }}>Liberações assinadas</span><span style={{ fontFamily: 'var(--fonte-mono)', fontWeight: 600 }}>{assinadas}</span></div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--texto-sec)', marginTop: 12, lineHeight: 1.55 }}>{alc ? alc.libera : 'Pode conferir, registrar e pedir; liberação por autoridade fica com a Qualidade ou a Direção.'}</div>
              </>
            )}
            {modal === 'prefs' && (
              <>
                <div className="mo-modal-sub">O que chega para você, na tela e no celular.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                  {PREFS.map(p => {
                    const on = !!(p.lock || prefsOn[p.k]);
                    return (
                      <button key={p.k} type="button" role="switch" aria-checked={on} className="mo-op" style={{ borderWidth: 1, borderColor: 'var(--borda-suave)', background: 'var(--painel)', borderRadius: 14, padding: '12px 14px' }}
                        onClick={() => { if (p.lock) { avisar('O aviso de bloqueio técnico não desliga: é requisito da certificação.'); return; } setPrefsOn({ ...prefsOn, [p.k]: !prefsOn[p.k] }); }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{p.t}</div><div style={{ fontSize: 11.5, color: 'var(--texto-sec)' }}>{p.sub}</div></div>
                        <span style={{ width: 40, height: 23, borderRadius: 99, background: on ? 'var(--degrade-primario)' : '#dde5e3', position: 'relative', flex: 'none', transition: 'background .2s' }}>
                          <span style={{ position: 'absolute', top: 2.5, left: on ? 19.5 : 2.5, width: 18, height: 18, borderRadius: 99, background: '#fff', boxShadow: '0 1px 4px rgba(9,34,36,.25)', transition: 'left .2s' }} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {(modal === 'entrar' || modal === 'saiu') && (
              <>
                <div className="mo-modal-sub">{modal === 'saiu' ? 'Nada foi perdido: o que você registrou continua na viagem com seu nome e a hora. Escolha quem entra agora.' : 'Demonstração: troque de usuário para ver a tela como cada papel vê. Filial, badges e alçada mudam junto.'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 14 }} role="radiogroup" aria-label="Usuário">
                  {TX.db.usuarios.map((x: { id: string; nome: string; cargo: string; g1: string; g2: string; filiais: string[] }) => {
                    const on = x.id === u.id;
                    return (
                      <button key={x.id} type="button" role="radio" aria-checked={on} data-tx-usuario={x.id} className="mo-op"
                        onClick={() => {
                          TX.entrarComo(x.id);
                          setModal(null);
                          window.dispatchEvent(new CustomEvent('tx-usuario', { detail: x }));
                          avisar('Agora você está como ' + x.nome + ' (' + x.cargo.toLowerCase() + ').');
                        }}>
                        <span style={{ width: 18, height: 18, borderRadius: 99, border: '2.5px solid ' + (on ? 'var(--primario)' : 'var(--borda-forte)'), background: on ? 'var(--degrade-primario)' : '#fff', flex: 'none' }} />
                        <span style={{ width: 34, height: 34, borderRadius: 99, flex: 'none', background: 'linear-gradient(135deg,' + x.g1 + ',' + x.g2 + ')', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{TX.fmt.iniciais(x.nome)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 800 }}>{x.nome}</div><div style={{ fontSize: 11.5, color: 'var(--texto-sec)', marginTop: 1 }}>{x.cargo}, {x.filiais.length === 4 ? 'todas as filiais' : 'filial ' + x.filiais.map(f => TX.filial(f).nome).join(', ')}</div></div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {modal === 'sair' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--superficie)', borderRadius: 15, padding: '13px 15px', marginTop: 16 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 99, flex: 'none', background: 'linear-gradient(135deg,' + u.g1 + ',' + u.g2 + ')', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{iniciais}</span>
                  <div><div style={{ fontSize: 13.5, fontWeight: 800 }}>{u.nome}</div><div style={{ fontSize: 11.5, color: 'var(--texto-sec)' }}>{u.cargo}</div></div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--texto-sec)', marginTop: 14, lineHeight: 1.6 }}>O que você registrou continua na viagem, com seu nome e a hora. O que estava aberto num formulário sem confirmar não foi gravado.</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
                  <button type="button" className="mo-botao" onClick={fecharModal}>Cancelar</button>
                  <button type="button" className="mo-botao mo-botao-perigo" onClick={() => setModal('saiu')}>Sair</button>
                </div>
              </>
            )}
          </Dialogo>
        </div>
      )}

      {toast && (
        <div data-tx-toast className="mo-toast" role="status" aria-live="polite"><span className="mo-toast-ok" aria-hidden>✓</span>{toast}</div>
      )}
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="mo-modal-tit">{titulo}</div>
        <button type="button" title="Fechar" aria-label="Fechar" className="mo-fechar" onClick={onFechar}>✕</button>
      </div>
      {children}
    </div>
  );
}
