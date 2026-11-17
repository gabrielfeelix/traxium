import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { Icone } from '@/components/moldura/icones';
import '@/components/moldura/moldura.css';
import './ds.css';

/*
 * Design system vivo do Traxium. Referência para quem desenha (refazer no Figma a partir de capturas)
 * e para quem programa (que classe ou token usar). Os componentes abaixo reaproveitam as classes de
 * globals.css e moldura.css e copiam os estilos inline das telas em src/telas; nada aqui inventa estilo.
 * Fica fora da moldura do painel de propósito: é uma página estática, sem estado de sessão.
 */

export const metadata: Metadata = { title: 'Traxium: design system' };

const MONO = "'Spline Sans Mono',monospace";

// ---------------------------------------------------------------- cores (src/app/globals.css)
type Cor = { t: string; v: string; uso: string; claro?: boolean };
const CORES: { g: string; quando: string; itens: Cor[] }[] = [
  {
    g: 'Marca',
    quando: 'Ação principal, link, item ativo e identidade. O degradê vai só no botão primário, no logo e no cabeçalho do drawer.',
    itens: [
      { t: '--primario', v: '#127670', uso: 'Teal da marca. Anel de foco, borda de campo ativo, aba ativa.' },
      { t: '--primario-2', v: '#0c5862', uso: 'Link, texto de ação em texto, chip selecionado. Hover do primário.' },
      { t: '--primario-3', v: '#093d44', uso: 'Ênfase máxima. Início do degradê do drawer e da sidebar.' },
      { t: '--azul', v: '#0e78b5', uso: 'Azul de apoio. Fim do degradê primário, estado informativo.' },
      { t: '--primario-fraco', v: '#eef7f6', uso: 'Fundo de chip ou opção selecionada.', claro: true },
      { t: '--degrade-primario', v: 'linear-gradient(135deg, #127670, #0e78b5)', uso: 'Botão primário (CTA). Sempre em 135 graus.' },
    ],
  },
  {
    g: 'Semânticas (situação da viagem)',
    quando: 'Sempre junto de rótulo e ponto, nunca só a cor. Verde e âmbar de texto foram escurecidos para passar 4,5:1.',
    itens: [
      { t: '--ok', v: '#177d4c', uso: 'Pronta para assegurar, conforme, salvo.' },
      { t: '--aviso', v: '#9a6210', uso: 'Texto de Falta algo, contador de pendência.' },
      { t: '--aviso-2', v: '#e8a33d', uso: 'Só preenchimento (ponto, faixa lateral). Não usar como texto.' },
      { t: '--perigo', v: '#c43d3d', uso: 'Bloqueada, erro de campo, ação destrutiva.' },
      { t: '--tecnico', v: '#93313f', uso: 'Bloqueio técnico: o motor reprova e nenhuma alçada libera.' },
      { t: '--ok-borda', v: '#cfe9dc', uso: 'Borda de selo ou caixa verde.', claro: true },
      { t: '--aviso-borda', v: '#f3dfb8', uso: 'Borda de selo âmbar, contador da aba.', claro: true },
      { t: '--perigo-borda', v: '#f1caca', uso: 'Borda de caixa de erro, chip inválido.', claro: true },
      { t: '--perigo-fundo', v: '#fdf6f6', uso: 'Fundo de caixa de bloqueio.', claro: true },
      { t: '--info-borda', v: '#cfe1ef', uso: 'Borda de caixa informativa (azul).', claro: true },
    ],
  },
  {
    g: 'Texto',
    quando: 'Contrastes medidos contra o branco e contra a superfície mais escura em que texto cai (#f0f4f3).',
    itens: [
      { t: '--texto', v: '#0b2224', uso: 'Texto principal e títulos. Fundo do toast.' },
      { t: '--texto-2', v: '#3c4f4e', uso: 'Rótulo de campo, texto de chip, corpo secundário forte.' },
      { t: '--texto-sec', v: '#526664', uso: 'Subtítulo, descrição. 6,10:1 no branco, 5,50:1 na superfície.' },
      { t: '--texto-apagado', v: '#5f7270', uso: 'Cabeçalho de tabela, dica, Falta:. 5,09:1 e 4,59:1.' },
      { t: '--placeholder', v: '#66797a', uso: 'Placeholder de campo. 4,58:1 no branco.' },
      { t: '--texto-desab', v: '#9db0ae', uso: 'Só controle desabilitado (isento pela WCAG).' },
    ],
  },
  {
    g: 'Fundos',
    quando: 'A página nunca é branco puro: o fundo tem toque verde-azulado e o cartão é branco.',
    itens: [
      { t: '--fundo', v: '#f2f5f4', uso: 'Fundo da página (body).', claro: true },
      { t: '--fundo-fundo', v: '#e9efed', uso: 'Fundo atrás da folha (opção C de fundo, em avaliação).', claro: true },
      { t: '--painel', v: '#ffffff', uso: 'Cartão, modal, campo, menu.', claro: true },
      { t: '--superficie', v: '#f7faf9', uso: 'Cabeçalho de tabela, linha de item dentro de cartão, fundo do drawer.', claro: true },
      { t: '--superficie-2', v: '#f0f4f3', uso: 'Botão secundário, botão fechar, divisória de linha de tabela.', claro: true },
      { t: '--superficie-hover', v: '#f6f9f8', uso: 'Hover de linha, item de menu, ação em texto.', claro: true },
    ],
  },
  {
    g: 'Bordas',
    quando: 'Bordas com toque verde-azulado, nunca cinza neutro.',
    itens: [
      { t: '--borda-suave', v: '#eef2f1', uso: 'Divisória interna (abas, tabela). Fundo de botão desabilitado.', claro: true },
      { t: '--borda', v: '#e4eae8', uso: 'Borda de cartão, modal, popover.', claro: true },
      { t: '--borda-campo', v: '#e0e7e5', uso: 'Borda de campo, chip e selo neutro.', claro: true },
      { t: '--borda-forte', v: '#c9d5d3', uso: 'Hover de chip e opção, borda de arquivo a enviar.', claro: true },
    ],
  },
  {
    g: 'Sidebar e foco',
    quando: 'A sidebar é escura de propósito: ancora o olhar e separa da área de trabalho clara.',
    itens: [
      { t: '--sb-fundo', v: 'radial teal + radial azul + linear #093d44 a #0a4650', uso: 'Fundo do cartão da sidebar (.mo-sb-cartao).' },
      { t: '--sb-texto', v: 'rgba(255,255,255,.66)', uso: 'Texto de item da sidebar em repouso.' },
      { t: '--sb-ativo', v: 'linear-gradient(90deg, teal .35, azul .28)', uso: 'Fundo do item ativo (aria-current).' },
      { t: '--foco', v: '0 0 0 2px #fff, 0 0 0 4px #127670', uso: 'Anel de foco em sombra, quando outline não serve.' },
    ],
  },
];

const ESCALA = [
  { px: 11, peso: '800', lh: '1.3', uso: 'Rótulo em caixa alta: cabeçalho de tabela (tracking .7px), grupo da sidebar.', ex: 'CARREGAMENTO', caixa: true },
  { px: 12, peso: '600 a 800', lh: '1.4', uso: 'Legenda, rótulo de campo (.tx-rotulo, 800), erro e dica, chip, selo.', ex: 'Nome do motorista' },
  { px: 13, peso: '400 a 700', lh: '1.5', uso: 'Corpo denso: linha de tabela, subtítulo de modal, ação em texto.', ex: 'Toda viagem com a situação e o histórico' },
  { px: 14, peso: '400 a 800', lh: '1.5', uso: 'Corpo e controles: campo, botão, aba, item da sidebar.', ex: 'Pronta para assegurar' },
  { px: 16, peso: '800', lh: '1.3', uso: 'Título de cartão, de modal e de estado vazio.', ex: 'Enviar link ao motorista' },
  { px: 20, peso: '800', lh: '1.2', uso: 'Número de destaque (tabular-nums), título do resultado da viagem.', ex: '128 viagens' },
  { px: 24, peso: '800', lh: '1.2', uso: 'Título de página. Tracking -.2px.', ex: 'Viagens' },
];

const ESPACOS = [4, 8, 12, 16, 20, 24, 32, 48];
const RAIOS = [
  { v: '6px', uso: 'Tecla de atalho (.mo-tecla), código em linha.' },
  { v: '8 a 9px', uso: 'Alvo de ação em texto, subitem da sidebar, item de menu.' },
  { v: '11px', uso: 'Campo de formulário, item da sidebar.' },
  { v: '12 a 14px', uso: 'Linha dentro de cartão, busca global, opção (.mo-op, 15px).' },
  { v: '16px', uso: 'Popover, menu da pessoa, caixa de mensagem.' },
  { v: '20px', uso: 'Cartão de conteúdo (o mais usado nas telas).' },
  { v: '22px', uso: 'Cartão da sidebar.' },
  { v: '24px', uso: 'Modal.' },
  { v: '99px', uso: 'Botão, chip, selo, contador, avatar, toast.' },
];
const SOMBRAS = [
  { n: 'Campo e busca', v: '0 2px 10px rgba(9,61,68,.04)', uso: 'Campo de busca do topo.' },
  { n: 'Botão pequeno', v: '0 6px 14px rgba(18,118,112,.28)', uso: 'Botão primário pequeno em lista (Resolver).' },
  { n: 'Botão primário', v: '0 8px 18px rgba(18,118,112,.35)', uso: 'CTA de rodapé de modal e de página.' },
  { n: 'Botão perigo', v: '0 8px 18px rgba(196,61,61,.3)', uso: 'Ação destrutiva habilitada.' },
  { n: 'Hover de cartão', v: '0 12px 30px rgba(9,61,68,.09)', uso: 'Cartão clicável em hover.' },
  { n: 'Popover e menu', v: '0 16px 40px rgba(9,61,68,.16)', uso: 'Menu da pessoa, popover de filtro.' },
  { n: 'Sidebar', v: '0 18px 44px rgba(9,61,68,.22)', uso: 'Cartão da sidebar, resultado da busca global.' },
  { n: 'Modal', v: '0 40px 100px rgba(9,34,36,.4)', uso: 'Modal e diálogo do topo.' },
  { n: 'Drawer', v: '-30px 0 80px rgba(9,34,36,.35)', uso: 'Painel lateral (Transportadores, Frota).' },
];

// Situações da decisão (TX.ui.TOM em src/lib/tx/tx-ui.js; rótulos de TX.decidir em tx-dados.js).
const TOM: Record<string, { dot: string; ring: string; c: string; bd: string }> = {
  ok: { dot: 'linear-gradient(135deg,#48c78e,var(--ok))', ring: 'rgba(26,143,87,.16)', c: 'var(--ok)', bd: 'var(--ok-borda)' },
  falta: { dot: 'linear-gradient(135deg,#f4c15d,var(--aviso-2))', ring: 'rgba(232,163,61,.2)', c: 'var(--aviso)', bd: 'var(--aviso-borda)' },
  bloqueio: { dot: 'linear-gradient(135deg,#e46969,var(--perigo))', ring: 'rgba(196,61,61,.16)', c: 'var(--perigo)', bd: 'var(--perigo-borda)' },
  tecnico: { dot: 'linear-gradient(135deg,var(--perigo),#7d2232)', ring: 'rgba(147,49,63,.2)', c: 'var(--tecnico)', bd: '#ebc3c8' },
  na: { dot: '#dde5e3', ring: 'rgba(157,176,174,.14)', c: 'var(--texto-apagado)', bd: 'var(--borda)' },
  info: { dot: 'linear-gradient(135deg,#5b8def,var(--azul))', ring: 'rgba(14,120,181,.16)', c: 'var(--azul)', bd: 'var(--info-borda)' },
  autoridade: { dot: 'linear-gradient(135deg,#f4c15d,#d97544)', ring: 'rgba(217,117,68,.18)', c: '#b85a2e', bd: '#f0d3bf' },
};
const SITUACOES = [
  { k: 'ok', rot: 'Pronta para assegurar', res: 'pronta', quando: 'Todas as checagens aplicáveis passaram.' },
  { k: 'falta', rot: 'Falta algo', res: 'falta', quando: 'Falta documento ou dado que alguém da operação resolve.' },
  { k: 'bloqueio', rot: 'Bloqueada', res: 'bloqueada', quando: 'Uma regra reprova e uma alçada pode liberar.' },
  { k: 'tecnico', rot: 'Bloqueio técnico', res: 'tecnico', quando: 'Regra técnica reprova; nenhuma alçada libera.' },
  { k: 'autoridade', rot: 'Liberada por autoridade', res: 'pronta + porAutoridade', quando: 'Bloqueio não técnico liberado por quem assina. O motor continua reprovando.' },
  { k: 'na', rot: 'Sem declaração GMP+', res: 'nao_assegurada / cancelada', quando: 'Viagem fora do escopo assegurado, ou cancelada.' },
  { k: 'info', rot: 'Em trânsito', res: 'info', quando: 'Estado informativo, sem pendência.' },
];

// Estilos copiados das telas (TX.ui.cta, ctaPerigo, chip e os inline de Viagem, Viagens e Hoje).
const BTN_PRIMARIO: CSSProperties = { background: 'linear-gradient(135deg,var(--primario),var(--azul))', color: '#fff', fontSize: '14px', fontWeight: 800, borderRadius: '99px', padding: '10px 22px', cursor: 'pointer', boxShadow: '0 8px 18px rgba(18,118,112,.35)', border: 'none', display: 'inline-block' };
const BTN_DESAB: CSSProperties = { ...BTN_PRIMARIO, background: 'var(--borda-suave)', color: 'var(--texto-desab)', boxShadow: 'none', cursor: 'not-allowed' };
const BTN_PEQ: CSSProperties = { ...BTN_PRIMARIO, fontSize: '13px', padding: '7px 15px', boxShadow: '0 6px 14px rgba(18,118,112,.28)' };
const BTN_SEC: CSSProperties = { background: 'var(--superficie-2)', color: 'var(--texto)', fontSize: '14px', fontWeight: 700, borderRadius: '99px', padding: '10px 20px', cursor: 'pointer', border: 'none', display: 'inline-block' };
const BTN_PERIGO: CSSProperties = { ...BTN_PRIMARIO, background: 'linear-gradient(135deg,#e46969,var(--perigo))', boxShadow: '0 8px 18px rgba(196,61,61,.3)' };
const CAMPO: CSSProperties = { width: '100%', marginTop: '6px', border: '1px solid var(--borda-campo)', borderRadius: '11px', padding: '9px 12px', fontSize: '14px', outline: 'none', background: '#fff' };
const CARTAO: CSSProperties = { background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px' };

function Cod({ children }: { children: ReactNode }) {
  return <code className="ds-cod">{children}</code>;
}

function Bloco({ titulo, quando, codigo, children }: { titulo: string; quando: ReactNode; codigo: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="ds-h3">{titulo}</h3>
      <p className="ds-quando">{quando}</p>
      <div className="ds-cartao">{children}</div>
      <p className="ds-nota">Em código: {codigo}</p>
    </div>
  );
}

function Estado({ rot, children }: { rot: string; children: ReactNode }) {
  return (
    <div>
      <div className="ds-rot">{rot}</div>
      {children}
    </div>
  );
}

function Situacao({ k, rot }: { k: string; rot: string }) {
  const t = TOM[k];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 700, color: t.c }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: t.dot, boxShadow: `0 0 0 3px ${t.ring}`, flex: 'none' }} />
      {rot}
    </span>
  );
}

function Selo({ k, rot }: { k: string; rot: string }) {
  const t = TOM[k];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: t.c, border: `1px solid ${t.bd}`, borderRadius: '99px', padding: '3px 10px', background: 'var(--painel)', whiteSpace: 'nowrap' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '99px', background: t.dot, flex: 'none' }} />
      {rot}
    </span>
  );
}

const SECOES = [
  ['cores', 'Cores'],
  ['tipografia', 'Tipografia'],
  ['espaco', 'Espaçamento, raios e sombras'],
  ['componentes', 'Componentes'],
  ['regras', 'Regras'],
];

export default function DesignSystem() {
  return (
    <div className="ds">
      <div className="ds-topo">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="ds-rot">Traxium SaaS, referência visual</div>
          <h1 className="ds-h1">Design system</h1>
          <div className="ds-sub">
            Tokens e componentes em uso nas telas do escritório. Tudo aqui é renderizado com as classes de <Cod>globals.css</Cod> e{' '}
            <Cod>moldura.css</Cod> e com os mesmos estilos inline de <Cod>src/telas</Cod>. Para mudar uma cor, mude o token em{' '}
            <Cod>globals.css</Cod>; esta página acompanha. Versão de 17/11/2026.
          </div>
        </div>
      </div>
      <nav className="ds-indice" aria-label="Seções">
        {SECOES.map(([id, n]) => (
          <a key={id} href={'#' + id}>{n}</a>
        ))}
      </nav>

      {/* ------------------------------------------------------------ 1. cores */}
      <section className="ds-sec" id="cores">
        <h2 className="ds-h2">1. Cores</h2>
        {CORES.map((g) => (
          <div key={g.g}>
            <h3 className="ds-h3">{g.g}</h3>
            <p className="ds-quando">{g.quando}</p>
            <div className="ds-grade">
              {g.itens.map((c) => (
                <div key={c.t} className="ds-amostra">
                  <div className="ds-cor" style={{ background: `var(${c.t})` }} />
                  <div className="ds-amostra-txt">
                    <div className="ds-nome">var({c.t})</div>
                    <div className="ds-valor">{c.v}</div>
                    <div className="ds-uso">{c.uso}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------ 2. tipografia */}
      <section className="ds-sec" id="tipografia">
        <h2 className="ds-h2">2. Tipografia</h2>
        <h3 className="ds-h3">Famílias</h3>
        <p className="ds-quando">Carregadas do Google Fonts no layout raiz, pesos 400 a 800 e mono 500 e 600.</p>
        <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="ds-cartao">
            <div className="ds-nome">var(--fonte)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>Hanken Grotesk</div>
            <div className="ds-uso">Todo o texto de interface. Fallback system-ui, sans-serif.</div>
          </div>
          <div className="ds-cartao">
            <div className="ds-nome">var(--fonte-mono)</div>
            <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px', fontFamily: 'var(--fonte-mono)' }}>OC-24817 RXT2B17</div>
            <div className="ds-uso">Códigos: ordem, CT-e, placa, contador, tecla de atalho. Spline Sans Mono.</div>
          </div>
        </div>
        <h3 className="ds-h3">Escala do escritório (7 passos)</h3>
        <p className="ds-quando">
          Só estes tamanhos. 32 e 40 px ficam reservados ao número grande de painel. O Link do motorista (celular) usa 12, 14, 16, 20 e 24, com
          campo de 16 px. Número em coluna ou destaque usa <Cod>fontVariantNumeric: &apos;tabular-nums&apos;</Cod>.
        </p>
        <div className="ds-cartao" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="ds-tab">
            <thead>
              <tr><th>Tamanho</th><th>Peso</th><th>Entrelinha</th><th>Uso</th><th>Exemplo</th></tr>
            </thead>
            <tbody>
              {ESCALA.map((e) => (
                <tr key={e.px}>
                  <td style={{ fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>{e.px} px</td>
                  <td style={{ fontFamily: MONO }}>{e.peso}</td>
                  <td style={{ fontFamily: MONO }}>{e.lh}</td>
                  <td style={{ color: 'var(--texto-2)', maxWidth: '320px' }}>{e.uso}</td>
                  <td style={{ fontSize: e.px + 'px', fontWeight: 800, letterSpacing: e.caixa ? '.7px' : e.px === 24 ? '-.2px' : undefined, color: e.caixa ? 'var(--texto-apagado)' : undefined, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{e.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ds-nota">Parágrafo de várias linhas: entrelinha 1,5 a 1,55. Linha única de controle: entrelinha normal.</p>
      </section>

      {/* ------------------------------------------------------------ 3. espaço, raios e sombras */}
      <section className="ds-sec" id="espaco">
        <h2 className="ds-h2">3. Espaçamento, raios e sombras</h2>
        <h3 className="ds-h3">Espaçamento (base 4)</h3>
        <p className="ds-quando">
          Padding de cartão 20px 24px; de página 24px 32px 48px; linha de tabela 12px 20px; campo 9px 12px; botão 10px 20px. Gap entre
          cartões 16 ou 20. Gaps de 6 e 10 aparecem entre chips e itens de lista: são as exceções aceitas.
        </p>
        <div className="ds-cartao ds-linha" style={{ alignItems: 'flex-end' }}>
          {ESPACOS.map((n) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ width: n + 'px', height: n + 'px', background: 'var(--primario)', borderRadius: '2px', margin: '0 auto' }} />
              <div className="ds-valor" style={{ marginTop: '6px' }}>{n}</div>
            </div>
          ))}
        </div>
        <h3 className="ds-h3">Raios</h3>
        <p className="ds-quando">Não há token de raio em CSS: os valores abaixo são os usados nas telas, escritos direto no estilo.</p>
        <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {RAIOS.map((r) => (
            <div key={r.v} className="ds-amostra" style={{ padding: '12px' }}>
              <div style={{ height: '56px', background: 'var(--primario-fraco)', border: '1.5px solid var(--primario)', borderRadius: r.v.startsWith('99') ? '99px' : r.v.split(' ')[0].replace(/px$/, '') + 'px' }} />
              <div className="ds-nome" style={{ marginTop: '8px' }}>{r.v}</div>
              <div className="ds-uso">{r.uso}</div>
            </div>
          ))}
        </div>
        <h3 className="ds-h3">Sombras</h3>
        <p className="ds-quando">Sempre tingidas com a cor da marca (#093d44, #092224, teal ou vermelho), nunca preto puro.</p>
        <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {SOMBRAS.map((s) => (
            <div key={s.n} style={{ background: 'var(--painel)', borderRadius: '16px', padding: '16px', boxShadow: s.v, margin: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>{s.n}</div>
              <div className="ds-valor">{s.v}</div>
              <div className="ds-uso">{s.uso}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ 4. componentes */}
      <section className="ds-sec" id="componentes">
        <h2 className="ds-h2">4. Componentes</h2>

        <Bloco
          titulo="Botões"
          quando="Um primário por área (rodapé de modal, cabeçalho de página). O primário só acende quando o obrigatório está preenchido; antes disso fica desabilitado e o rodapé diz o que falta. Perigo só para ação destrutiva. Ação em texto para navegação leve (Ver todos, Abrir a mesa)."
          codigo={<><Cod>TX.ui.cta(pronto)</Cod>, <Cod>TX.ui.ctaPerigo(pronto)</Cod>, <Cod>.mo-botao</Cod>, <Cod>.mo-botao-perigo</Cod>, <Cod>.tx-acao-texto</Cod>, <Cod>.mo-fechar</Cod>; hover do primário em <Cod>.tx-h0882f37</Cod> (sobe 1 px), do secundário em <Cod>.tx-hcab3cde</Cod>. Alvo mínimo 32 px.</>}
        >
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="ds-linha" style={{ gap: '24px' }}>
              <Estado rot="Primário"><span role="button" tabIndex={0} style={BTN_PRIMARIO} className="tx-h0882f37">Salvar viagem</span></Estado>
              <Estado rot="Hover"><span style={{ ...BTN_PRIMARIO, transform: 'translateY(-1px)' }}>Salvar viagem</span></Estado>
              <Estado rot="Foco"><span style={{ ...BTN_PRIMARIO, outline: '2px solid var(--primario)', outlineOffset: '2px' }}>Salvar viagem</span></Estado>
              <Estado rot="Desabilitado"><span aria-disabled="true" style={BTN_DESAB}>Salvar viagem</span></Estado>
              <Estado rot="Primário pequeno (lista)"><span role="button" tabIndex={0} style={BTN_PEQ} className="tx-h0882f37">Resolver</span></Estado>
            </div>
            <div className="ds-linha" style={{ gap: '24px' }}>
              <Estado rot="Secundário"><span role="button" tabIndex={0} style={BTN_SEC} className="tx-hcab3cde">Cancelar</span></Estado>
              <Estado rot="Secundário (.mo-botao)"><button type="button" className="mo-botao">Voltar</button></Estado>
              <Estado rot="Hover"><span style={{ ...BTN_SEC, background: '#e4ebe9' }}>Cancelar</span></Estado>
              <Estado rot="Perigo"><span role="button" tabIndex={0} style={BTN_PERIGO} className="tx-h0882f37">Cancelar viagem</span></Estado>
              <Estado rot="Perigo (.mo-botao-perigo)"><button type="button" className="mo-botao mo-botao-perigo">Sair</button></Estado>
            </div>
            <div className="ds-linha" style={{ gap: '32px' }}>
              <Estado rot="Ação em texto"><span style={{ display: 'inline-block', padding: '6px 8px' }}><button type="button" className="tx-acao-texto">Ver todas as viagens</button></span></Estado>
              <Estado rot="Hover"><span style={{ display: 'inline-block', padding: '6px 8px' }}><span className="tx-acao-texto" style={{ background: 'var(--superficie-hover)', color: 'var(--primario)' }}>Ver todas as viagens</span></span></Estado>
              <Estado rot="Fechar (ícone)"><button type="button" className="mo-fechar" aria-label="Fechar" style={{ marginLeft: 0 }}>✕</button></Estado>
            </div>
          </div>
        </Bloco>

        <Bloco
          titulo="Situação da decisão (status)"
          quando="Mostra o resultado do motor (TX.decidir) em Viagens, Hoje e Viagem. Sempre ponto, cor e rótulo juntos. Na linha de tabela usa a forma com ponto e anel; em filtro, cabeçalho e listas usa o selo com borda."
          codigo={<><Cod>TX.ui.tomResultado(dec)</Cod> devolve <Cod>{'{ dot, ring, c, bd }'}</Cod>; <Cod>TX.ui.tom(k)</Cod> para <Cod>ok</Cod>, <Cod>falta</Cod>, <Cod>bloqueio</Cod>, <Cod>tecnico</Cod>, <Cod>autoridade</Cod>, <Cod>na</Cod>, <Cod>info</Cod>. Rótulos em <Cod>tx-dados.js</Cod> (ROT).</>}
        >
          <table className="ds-tab">
            <thead><tr><th>Linha de tabela</th><th>Selo</th><th>Tom</th><th>Quando</th></tr></thead>
            <tbody>
              {SITUACOES.map((s) => (
                <tr key={s.k}>
                  <td><Situacao k={s.k} rot={s.rot} /></td>
                  <td><Selo k={s.k} rot={s.rot} /></td>
                  <td><Cod>{s.k}</Cod><div className="ds-valor">{s.res}</div></td>
                  <td style={{ color: 'var(--texto-2)' }}>{s.quando}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Bloco>

        <Bloco
          titulo="Chips e opções"
          quando="Escolha entre poucas opções vira grupo de rádio com chip (Escolhas). Filtro de lista usa o chip escuro. Opção com descrição usa o cartão de opção. O selo de responsável (quem resolve) é neutro."
          codigo={<><Cod>{'<Escolhas>'}</Cod> de <Cod>src/components/ui/formulario.tsx</Cod> com <Cod>.tx-chip[aria-checked]</Cod>; filtro com <Cod>TX.ui.chip(on)</Cod>; opção com <Cod>.mo-op[aria-checked]</Cod>; contador da sidebar <Cod>.mo-badge</Cod>.</>}
        >
          <div style={{ display: 'grid', gap: '20px' }}>
            <Estado rot="Rádio em chip (.tx-chip)">
              <div role="radiogroup" aria-label="Tipo de carga" className="tx-escolhas">
                <button type="button" role="radio" aria-checked="true" className="tx-chip">Ração ensacada</button>
                <button type="button" role="radio" aria-checked="false" className="tx-chip">Granel</button>
                <button type="button" role="radio" aria-checked="false" className="tx-chip">Insumo líquido</button>
              </div>
            </Estado>
            <Estado rot="Rádio em chip com erro">
              <div role="radiogroup" aria-label="Tipo de carga" aria-invalid="true" className="tx-escolhas">
                <button type="button" role="radio" aria-checked="false" className="tx-chip">Ração ensacada</button>
                <button type="button" role="radio" aria-checked="false" className="tx-chip">Granel</button>
              </div>
              <div className="tx-erro">Escolha o tipo de carga</div>
            </Estado>
            <Estado rot="Filtro (TX.ui.chip)">
              <div className="ds-linha" style={{ gap: '6px' }}>
                {[['Hoje', true], ['7 dias', false], ['30 dias', false]].map(([n, on]) => (
                  <span key={n as string} style={{ fontSize: '13px', fontWeight: 700, borderRadius: '99px', padding: '6px 14px', background: on ? 'var(--texto)' : '#fff', color: on ? '#fff' : 'var(--texto-2)', border: `1px solid ${on ? 'var(--texto)' : 'var(--borda-campo)'}` }}>{n as string}</span>
                ))}
              </div>
            </Estado>
            <Estado rot="Opção com descrição (.mo-op)">
              <div style={{ display: 'grid', gap: '8px', maxWidth: '420px' }}>
                <button type="button" role="radio" aria-checked="true" className="mo-op">
                  <span><span style={{ display: 'block', fontSize: '14px', fontWeight: 700 }}>Frota própria</span><span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>Veículo e motorista da empresa</span></span>
                </button>
                <button type="button" role="radio" aria-checked="false" className="mo-op">
                  <span><span style={{ display: 'block', fontSize: '14px', fontWeight: 700 }}>Transportador terceiro</span><span style={{ fontSize: '12px', color: 'var(--texto-sec)' }}>TAC ou ETC com RNTRC</span></span>
                </button>
              </div>
            </Estado>
            <Estado rot="Selo neutro e código">
              <div className="ds-linha" style={{ gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--texto-2)', border: '1px solid var(--borda-campo)', borderRadius: '99px', padding: '3px 10px', background: 'var(--painel)' }}>Qualidade</span>
                <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--primario-2)', border: '1px solid #cfe3e1', borderRadius: '99px', padding: '2px 10px' }}>OC-24817</span>
                <span className="mo-papel">Direção</span>
                <span className="mo-tecla">Ctrl K</span>
              </div>
            </Estado>
          </div>
        </Bloco>

        <Bloco
          titulo="Campos de formulário"
          quando="Rótulo sempre visível e ligado ao campo. O erro aparece embaixo do campo, só depois da primeira tentativa de salvar, e diz o que fazer. Placeholder é exemplo, nunca o rótulo."
          codigo={<><Cod>{'<Campo id rotulo erro dica>'}</Cod> de <Cod>formulario.tsx</Cod> (gera <Cod>.tx-rotulo</Cod>, <Cod>aria-invalid</Cod>, <Cod>.tx-erro</Cod> ou <Cod>.tx-dica</Cod>). Campo: borda <Cod>--borda-campo</Cod>, raio 11, padding 9px 12px, 14 px. Foco: outline 2px <Cod>--primario</Cod> (globals.css). Marque <Cod>data-tx-campo</Cod> para o rodapé levar ao campo.</>}
        >
          <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <div className="ds-rot">Normal</div>
              <label htmlFor="ds-c1" className="tx-rotulo">Nome do motorista</label>
              <input id="ds-c1" placeholder="Como no documento" style={CAMPO} />
              <div className="tx-dica">Como aparece na CNH.</div>
            </div>
            <div>
              <div className="ds-rot">Foco</div>
              <label htmlFor="ds-c2" className="tx-rotulo">Celular com DDD</label>
              <input id="ds-c2" defaultValue="(66) 99812-4" style={{ ...CAMPO, outline: '2px solid var(--primario)', outlineOffset: '1px' }} />
            </div>
            <div>
              <div className="ds-rot">Erro</div>
              <label htmlFor="ds-c3" className="tx-rotulo">Data do carregamento</label>
              <input id="ds-c3" defaultValue="31/02/2026" aria-invalid="true" aria-describedby="ds-c3-erro" style={CAMPO} />
              <div id="ds-c3-erro" className="tx-erro">Data inválida</div>
            </div>
            <div>
              <div className="ds-rot">Desabilitado</div>
              <label htmlFor="ds-c4" className="tx-rotulo" style={{ color: 'var(--texto-desab)' }}>Placa da carreta</label>
              <input id="ds-c4" disabled defaultValue="RXT2B17" style={{ ...CAMPO, background: '#fafcfb', borderColor: 'var(--borda-suave)', color: 'var(--texto-desab)', cursor: 'not-allowed', fontFamily: MONO }} />
            </div>
          </div>
        </Bloco>

        <Bloco
          titulo="Abas"
          quando="Trocam a visão de uma mesma lista (Viagens). A ativa tem texto 800 e sublinhado teal de 2,5 px; o contador âmbar só aparece quando há pendência."
          codigo={<>Estilo inline de <Cod>Viagens.jsx</Cod> (<Cod>v.abas</Cod>): 14 px, padding 16px 12px 12px, <Cod>borderBottom: 2.5px solid var(--primario)</Cod> na ativa; hover <Cod>.tx-hec6a165</Cod>. Contador: mono 11 px, <Cod>--aviso</Cod> com borda <Cod>--aviso-borda</Cod>.</>}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: '1px solid var(--borda-suave)', overflowX: 'auto' }}>
            {[['Todas', true, 0], ['Esperando CT-e', false, 3], ['Lavagem', false, 0], ['Liberadas por autoridade', false, 1]].map(([n, on, q]) => (
              <div key={n as string} role="button" tabIndex={0} className="tx-hec6a165" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '16px 12px 12px', fontSize: '14px', fontWeight: on ? 800 : 600, color: on ? 'var(--texto)' : 'var(--texto-sec)', borderBottom: `2.5px solid ${on ? 'var(--primario)' : 'transparent'}`, marginBottom: '-1px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {n as string}
                {(q as number) > 0 && <span style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 600, color: 'var(--aviso)', border: '1px solid var(--aviso-borda)', borderRadius: '99px', padding: '0 7px' }}>{q as number}</span>}
              </div>
            ))}
          </div>
        </Bloco>

        <Bloco
          titulo="Tabela e lista"
          quando="Listas longas de registros (Viagens, Transportadores, Frota). A linha inteira é o link. Cabeçalho em caixa alta 11 px sobre superfície; código e placa em mono; a situação fica na última coluna."
          codigo={<>Grade CSS (<Cod>display: grid</Cod> com <Cod>gridTemplateColumns</Cod>), não <Cod>{'<table>'}</Cod>. Cabeçalho: padding 11px 20px, <Cod>--superficie</Cod>, 11 px 800, tracking .7px, <Cod>--texto-apagado</Cod>. Linha: padding 12px 20px, divisória <Cod>--superficie-2</Cod>, hover <Cod>.tx-h894fca3</Cod>. Carregando: barra com animação <Cod>txsh</Cod>.</>}
        >
          <div style={{ ...CARTAO, overflow: 'hidden', margin: '-20px -24px' }}>
            {(() => {
              const cols = '110px 120px 1.4fr 1fr 110px 1.2fr';
              const linhas = [
                ['17/11 08:30', 'OC-24817', 'Ração ensacada', 'Rondonópolis a Sorriso', 'Transportes Araguaia', 'TAC', 'RXT2B17', 'ok', 'Pronta para assegurar', 'Todas as checagens passaram'],
                ['17/11 09:10', 'OC-24822', 'Milho granel', 'Lucas a Sinop', 'Frota própria', 'Matriz', 'QBC4D21', 'falta', 'Falta algo', 'Falta o laudo de limpeza'],
                ['17/11 10:00', 'OC-24830', 'Farelo de soja', 'Primavera a Cuiabá', 'Rodo Cerrado', 'ETC', 'PHC2B17', 'bloqueio', 'Bloqueada', 'Carga anterior proibida no T-2'],
              ];
              return (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '16px', padding: '11px 20px', background: 'var(--superficie)', borderBottom: '1px solid var(--borda-suave)', fontSize: '11px', fontWeight: 800, letterSpacing: '.7px', color: 'var(--texto-apagado)' }}>
                    <span>CARREGAMENTO</span><span>ORDEM E CT-E</span><span>PRODUTO E ROTA</span><span>TRANSPORTADOR</span><span>PLACAS</span><span>SITUAÇÃO</span>
                  </div>
                  {linhas.map((r) => (
                    <a key={r[1]} href="#componentes" className="tx-h894fca3" style={{ display: 'grid', gridTemplateColumns: cols, gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--superficie-2)', alignItems: 'center', color: 'inherit' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r[0]}</span>
                      <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--primario-2)', fontWeight: 600 }}>{r[1]}</span>
                      <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontSize: '13px', fontWeight: 700 }}>{r[2]}</span><span style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{r[3]}</span></span>
                      <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{r[4]}</span><span style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{r[5]}</span></span>
                      <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--texto-2)' }}>{r[6]}</span>
                      <span style={{ minWidth: 0 }}><Situacao k={r[7]} rot={r[8]} /><span style={{ display: 'block', fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '2px' }}>{r[9]}</span></span>
                    </a>
                  ))}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ height: '16px', borderRadius: '99px', background: 'linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)', backgroundSize: '600px 100%', animation: 'txsh 1.3s linear infinite' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', fontSize: '13px', color: 'var(--texto-sec)' }}>
                    <span>1 a 3 de 128 viagens</span>
                  </div>
                </>
              );
            })()}
          </div>
        </Bloco>

        <Bloco
          titulo="Modal com rodapé Falta:"
          quando="Ação curta sobre um registro (registrar ocorrência, enviar link, liberar por autoridade). O botão principal fica apagado enquanto falta algo, e o rodapé diz exatamente o quê. Clicar no botão apagado leva o foco ao primeiro campo que falta."
          codigo={<>Véu: <Cod>.mo-veu</Cod>; caixa: <Cod>.mo-modal</Cod> (raio 24, padding 28, sombra de modal) com <Cod>role=&quot;dialog&quot; aria-modal</Cod>; título <Cod>.mo-modal-tit</Cod>, subtítulo <Cod>.mo-modal-sub</Cod>, fechar <Cod>.mo-fechar</Cod>. Rodapé: <Cod>{'<span className="tx-falta" aria-live="polite">'}</Cod> antes dos botões. Padrão em Viagem: <Cod>ctaOf(ok, falta)</Cod>, <Cod>minimo(texto, n, ...)</Cod>, <Cod>levarAoQueFalta()</Cod>; em Hoje: <Cod>focarFalta</Cod>. Texto da falta com <Cod>listaFalta()</Cod> (&quot;produto, ordem e peso&quot;).</>}
        >
          <div style={{ background: 'rgba(9,34,36,.45)', borderRadius: '16px', padding: '32px', display: 'flex', justifyContent: 'center', margin: '-20px -24px' }}>
            <div role="dialog" aria-modal="false" aria-labelledby="ds-m-tit" className="mo-modal" style={{ width: '520px', maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div id="ds-m-tit" className="mo-modal-tit">Registrar ocorrência</div>
                <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 600, color: 'var(--primario-2)', border: '1px solid #cfe3e1', borderRadius: '99px', padding: '2px 10px' }}>OC-24822</span>
                <button type="button" className="mo-fechar" aria-label="Fechar">✕</button>
              </div>
              <div className="mo-modal-sub">A ocorrência fica no histórico da viagem e conta no transportador.</div>
              <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
                <div>
                  <div className="tx-rotulo">Tipo</div>
                  <div role="radiogroup" aria-label="Tipo" className="tx-escolhas">
                    <button type="button" role="radio" aria-checked="false" className="tx-chip">Resíduo</button>
                    <button type="button" role="radio" aria-checked="false" className="tx-chip">Lona rasgada</button>
                    <button type="button" role="radio" aria-checked="false" className="tx-chip">Reclamação no destino</button>
                  </div>
                </div>
                <div>
                  <label htmlFor="ds-m-motivo" className="tx-rotulo">Motivo</label>
                  <textarea id="ds-m-motivo" data-tx-campo="motivo" defaultValue="Resíduo de" rows={3} style={{ ...CAMPO, resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span className="tx-falta" aria-live="polite">Falta: tipo e motivo (faltam 10 caracteres)</span>
                <span role="button" tabIndex={0} style={BTN_SEC} className="tx-hcab3cde">Cancelar</span>
                <span role="button" tabIndex={0} aria-disabled="true" style={BTN_DESAB}>Registrar</span>
              </div>
            </div>
          </div>
        </Bloco>

        <Bloco
          titulo="Drawer (painel lateral)"
          quando="Detalhe de um cadastro sem sair da lista (Transportadores, Frota). Entra pela direita, 560 px, cabeçalho com o degradê escuro da marca."
          codigo={<>Estilo inline de <Cod>Transportadores.jsx</Cod>: véu <Cod>rgba(9,34,36,.45)</Cod> com blur 3px; painel 560 px, fundo <Cod>--superficie</Cod>, sombra de drawer, animação <Cod>deslizar .3s</Cod>; cabeçalho <Cod>linear-gradient(130deg, --primario-3, --primario-2 55%, --azul 130%)</Cod>, padding 24px 28px. Fecha com Esc (<Cod>TX.ui.montar</Cod>).</>}
        >
          <div style={{ background: 'rgba(9,34,36,.45)', borderRadius: '16px', display: 'flex', justifyContent: 'flex-end', margin: '-20px -24px', overflow: 'hidden', minHeight: '260px' }}>
            <div role="dialog" aria-label="Transportes Araguaia" style={{ width: '420px', maxWidth: '90%', background: 'var(--superficie)', boxShadow: '-30px 0 80px rgba(9,34,36,.35)' }}>
              <div style={{ background: 'linear-gradient(130deg,var(--primario-3),var(--primario-2) 55%,var(--azul) 130%)', color: '#fff', padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '48px', height: '48px', borderRadius: '99px', background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>TA</span>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>Transportes Araguaia</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.75)' }}>TAC, RNTRC 048213977</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px 28px', display: 'grid', gap: '8px' }}>
                <div className="mo-linha"><span>Certificação GMP+</span><Selo k="ok" rot="Válida até 03/2027" /></div>
                <div className="mo-linha"><span>Ocorrências (90 dias)</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>2</b></div>
              </div>
            </div>
          </div>
        </Bloco>

        <Bloco
          titulo="Toast"
          quando="Confirma uma ação que deu certo, some sozinho em 4,2 s. Uma frase com o que foi feito. Erro de validação não vai em toast: vai no campo."
          codigo={<><Cod>.mo-toast</Cod> com <Cod>.mo-toast-ok</Cod>, disparado por <Cod>TX.ui.avisar(c, texto)</Cod>. Fixo embaixo, centralizado (aqui mostrado no fluxo da página).</>}
        >
          <div className="mo-toast" role="status" style={{ position: 'static', transform: 'none', display: 'inline-flex' }}>
            <span className="mo-toast-ok" aria-hidden>✓</span>
            Ocorrência registrada na viagem OC-24822.
          </div>
        </Bloco>

        <Bloco
          titulo="Estado vazio"
          quando="Lista sem resultado. Título diz o que não há; a linha de baixo diz o que fazer (ampliar período, limpar filtro). Sem ilustração."
          codigo={<>Estilo inline de <Cod>Viagens.jsx</Cod>: padding 48px 20px, centralizado; título 16 px 800; texto 13 px <Cod>--texto-sec</Cod>. Textos por visão em <Cod>VIS[].vazio</Cod>.</>}
        >
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Nenhuma viagem esperando CT-e</div>
            <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>Toda viagem carregada já está conciliada com o TMS.</div>
          </div>
        </Bloco>

        <Bloco
          titulo="Item de sidebar"
          quando="Navegação principal, desenhada uma vez na moldura. Item ativo pela rota; contador mostra pendência; subitens só para Cadastros."
          codigo={<><Cod>.mo-sb-cartao</Cod>, <Cod>.mo-grupo</Cod>, <Cod>.mo-item</Cod> (ativo com <Cod>aria-current=&quot;page&quot;</Cod>), <Cod>.mo-item-rot</Cod>, <Cod>.mo-badge</Cod>, <Cod>.mo-sub</Cod> e <Cod>.mo-subitem</Cod> com <Cod>.mo-subitem-dot</Cod>, <Cod>.mo-base</Cod>. Padding do item 8px 12px. Ícones em <Cod>{'<Icone k>'}</Cod> de <Cod>icones.tsx</Cod>, 16 px.</>}
        >
          <div className="mo-sb-cartao" style={{ height: 'auto', width: '264px', padding: '18px 16px', boxShadow: 'none' }}>
            <div className="mo-grupo" style={{ padding: '10px 12px 3px' }}>Operação</div>
            <div className="mo-lista">
              <span className="mo-item" aria-current="page" style={{ padding: '8px 12px' }}><Icone k="hoje" /><span className="mo-item-rot">Hoje</span><span className="mo-badge">4</span></span>
              <span className="mo-item" style={{ padding: '8px 12px' }}><Icone k="viagens" /><span className="mo-item-rot">Viagens</span></span>
              <span className="mo-item" style={{ padding: '8px 12px', background: 'rgba(255,255,255,.07)', color: '#fff' }}><Icone k="transportadores" /><span className="mo-item-rot">Transportadores (hover)</span></span>
            </div>
            <div className="mo-grupo" style={{ padding: '10px 12px 3px', marginTop: '8px' }}>Qualidade</div>
            <div className="mo-lista">
              <span className="mo-item" style={{ padding: '8px 12px' }}><Icone k="cadastros" /><span className="mo-item-rot">Cadastros</span></span>
              <div className="mo-sub">
                <span className="mo-subitem" aria-current="page" style={{ padding: '6px 12px 6px 22px' }}><span className="mo-subitem-dot" />Produtos</span>
                <span className="mo-subitem" style={{ padding: '6px 12px 6px 22px' }}><span className="mo-subitem-dot" />Motoristas</span>
              </div>
            </div>
            <div className="mo-base"><span className="mo-base-dot" />Base sincronizada</div>
          </div>
        </Bloco>

        <Bloco
          titulo="Cartão"
          quando="Agrupa uma área de conteúdo da página (lista, resumo, histórico)."
          codigo={<>Inline nas telas: <Cod>background: var(--painel)</Cod>, <Cod>border: 1px solid var(--borda)</Cod>, <Cod>borderRadius: 20px</Cod>, padding 20px 24px; clicável ganha <Cod>.tx-hbfbd724</Cod> (sombra de hover). Linha interna: <Cod>.mo-linha</Cod>.</>}
        >
          <div style={{ ...CARTAO, padding: '20px 24px', maxWidth: '420px' }} className="tx-hbfbd724">
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Viagens de hoje</div>
            <div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '2px' }}>Matriz, 17/11/2026</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginTop: '12px' }}>12</div>
            <div className="mo-linha" style={{ marginTop: '12px' }}><span>Com pendência</span><b style={{ color: 'var(--aviso)', fontVariantNumeric: 'tabular-nums' }}>4</b></div>
          </div>
        </Bloco>
      </section>

      {/* ------------------------------------------------------------ 5. regras */}
      <section className="ds-sec" id="regras">
        <h2 className="ds-h2">5. Regras</h2>
        <p className="ds-quando">Resumo de DESIGN.md e das decisões registradas na revisão de telas.</p>
        <div className="ds-regras">
          <div className="ds-cartao">
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ok)' }}>Fazer</div>
            <ul>
              <li>Toda cor sai de um token de <Cod>globals.css</Cod>.</li>
              <li>Sombra tingida com a marca (rgba de #093d44, #092224 ou teal); bordas com toque verde-azulado.</li>
              <li>Situação com ponto, cor e rótulo juntos. Nunca só cor.</li>
              <li>Número em coluna ou destaque com tabular-nums; código, placa e ordem em mono.</li>
              <li>Texto com contraste mínimo de 4,5:1, inclusive sobre <Cod>--superficie-2</Cod>.</li>
              <li>Foco visível em todo controle; alvo de clique de 32 px ou mais (<Cod>.tx-alvo</Cod>, <Cod>.tx-acao-texto</Cod>).</li>
              <li>Rótulo ligado ao campo (<Cod>{'<Campo>'}</Cod>); erro junto do campo, com a ação.</li>
              <li>Botão principal apagado diz o que falta (<Cod>.tx-falta</Cod>) e leva ao campo.</li>
              <li>Degradê da marca sempre em 135 graus.</li>
              <li>Mensagem de bloqueio com causa e ação. Datas em dd/MM/aaaa, horas em HH:mm.</li>
            </ul>
          </div>
          <div className="ds-cartao">
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--perigo)' }}>Não fazer</div>
            <ul>
              <li>Hex solto no estilo quando existe token.</li>
              <li>Sombra preta (rgba(0,0,0,...)) ou borda cinza neutra.</li>
              <li>Emoji decorativo, em qualquer tela.</li>
              <li>Usar <Cod>--aviso-2</Cod> ou <Cod>--texto-desab</Cod> como cor de texto legível.</li>
              <li>Tamanho de fonte fora da escala de 7 passos.</li>
              <li>Mais de três níveis de hierarquia de título numa página.</li>
              <li>Erro de validação em toast ou alert do navegador.</li>
              <li>Placeholder no lugar do rótulo.</li>
              <li>Mais de um botão primário na mesma área.</li>
              <li>Travessão e ponto médio em texto de interface.</li>
            </ul>
          </div>
        </div>
        <p className="ds-nota">
          Divergências conhecidas entre DESIGN.md e o código: DESIGN.md fala em Geist Sans e Geist Mono, o código usa Hanken Grotesk e Spline Sans
          Mono; DESIGN.md cita a classe <Cod>.num</Cod>, que não existe em <Cod>globals.css</Cod> (as telas usam <Cod>fontVariantNumeric</Cod> inline);
          raios e sombras não têm token em CSS. Esta página mostra o que o código faz hoje.
        </p>
      </section>
    </div>
  );
}
