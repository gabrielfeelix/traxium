'use client';
/*
 * Design system vivo do Traxium. Tudo o que aparece aqui é o componente real de src/components/ui
 * e os valores dos tokens são lidos do CSS em execução (getComputedStyle): mudou o token em
 * globals.css, esta página acompanha. É a fonte da biblioteca do Figma, um para um.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { Icone } from '@/components/moldura/icones';
import {
  Abas, AreaTexto, Aviso, Badge, Botao, CabecalhoPagina, CampoData, Campo, Cartao, Celula, Checkbox, Chip, Drawer, Entrada, EntradaCaixa,
  Escolhas, EstadoVazio, Linha, Modal, OpcaoCartao, Paginacao, ROTULO_TOM, Selecao, Situacao, Switch, Tabela, TabelaCabecalho,
  TabelaEsqueleto, TabelaLinha, TabelaRodape, Toast, TONS, textoFalta, type Tom,
} from '@/components/ui';

// ---------------------------------------------------------------- tokens
type T = { t: string; uso: string };
const CORES: { g: string; quando: string; texto?: boolean; itens: T[] }[] = [
  {
    g: 'Marca',
    quando: 'Ação principal, link, item ativo e identidade. O degradê vai só no botão primário, no logo e no cabeçalho do drawer, sempre em diagonal.',
    itens: [
      { t: '--primario', uso: 'Teal da marca. Anel de foco, borda de campo ativo, aba ativa.' },
      { t: '--primario-2', uso: 'Link, ação em texto, chip escolhido, código.' },
      { t: '--primario-3', uso: 'Ênfase máxima. Início do degradê escuro.' },
      { t: '--azul', uso: 'Azul de apoio: fim do degradê, preenchimento informativo. Não é texto: use --info.' },
      { t: '--primario-fraco', uso: 'Fundo de chip, opção ou linha escolhida.' },
      { t: '--primario-borda', uso: 'Borda do código em pílula e do papel.' },
      { t: '--degrade-primario', uso: 'Botão primário, caixa marcada, switch ligado.' },
      { t: '--degrade-escuro', uso: 'Cabeçalho do drawer, capa.' },
    ],
  },
  {
    g: 'Texto',
    texto: true,
    quando: 'A razão no canto é contra o branco. Todos passam 4,5:1 também na --superficie-2, a superfície mais escura onde texto cai.',
    itens: [
      { t: '--texto', uso: 'Texto principal e títulos.' },
      { t: '--texto-2', uso: 'Rótulo de campo, chip, corpo secundário forte.' },
      { t: '--texto-sec', uso: 'Subtítulo, descrição, informação da paginação.' },
      { t: '--texto-apagado', uso: 'Cabeçalho de tabela, dica, legenda, "Falta:".' },
      { t: '--placeholder', uso: 'Só placeholder, só dentro de campo branco.' },
      { t: '--texto-desab', uso: 'Só controle desabilitado (isento pela WCAG).' },
    ],
  },
  {
    g: 'Situação',
    texto: true,
    quando: 'Cor de texto de cada tom. Sempre com ponto e rótulo; nunca só a cor.',
    itens: [
      { t: '--ok', uso: 'Pronta para assegurar, salvo, conforme.' },
      { t: '--aviso', uso: 'Falta algo, contador de pendência.' },
      { t: '--perigo', uso: 'Bloqueada, erro de campo, ação destrutiva.' },
      { t: '--tecnico', uso: 'Bloqueio técnico: nenhuma alçada libera.' },
      { t: '--info', uso: 'Em trânsito, informativo.' },
      { t: '--autoridade', uso: 'Liberada por autoridade.' },
    ],
  },
  {
    g: 'Situação: preenchimentos, bordas e fundos',
    quando: 'Pares claros do ponto em degradê, borda de selo e fundo tingido do Aviso. Nenhum destes é cor de texto.',
    itens: [
      { t: '--ok-claro', uso: 'Início do ponto verde.' },
      { t: '--aviso-2', uso: 'Ponto, faixa lateral e barra âmbar.' },
      { t: '--aviso-claro', uso: 'Início do ponto âmbar.' },
      { t: '--perigo-claro', uso: 'Início do ponto vermelho.' },
      { t: '--perigo-cta', uso: 'Início do degradê do botão de perigo.' },
      { t: '--info-claro', uso: 'Início do ponto azul.' },
      { t: '--autoridade-2', uso: 'Fim do ponto de autoridade.' },
      { t: '--neutro-ponto', uso: 'Ponto de sem declaração ou cancelada.' },
      { t: '--ok-borda', uso: 'Borda verde.' },
      { t: '--aviso-borda', uso: 'Borda âmbar.' },
      { t: '--perigo-borda', uso: 'Borda vermelha, chip inválido.' },
      { t: '--tecnico-borda', uso: 'Borda do bloqueio técnico.' },
      { t: '--info-borda', uso: 'Borda azul.' },
      { t: '--autoridade-borda', uso: 'Borda de autoridade.' },
      { t: '--ok-fundo', uso: 'Fundo do Aviso ok.' },
      { t: '--aviso-fundo', uso: 'Fundo do Aviso âmbar.' },
      { t: '--perigo-fundo', uso: 'Fundo do Aviso de perigo.' },
      { t: '--tecnico-fundo', uso: 'Fundo do Aviso técnico.' },
      { t: '--info-fundo', uso: 'Fundo do Aviso informativo.' },
      { t: '--autoridade-fundo', uso: 'Fundo tingido de autoridade.' },
    ],
  },
  {
    g: 'Fundos',
    quando: 'A página nunca é branco puro: o fundo tem toque verde-azulado e o cartão é branco.',
    itens: [
      { t: '--fundo', uso: 'Fundo da página.' },
      { t: '--painel', uso: 'Cartão, modal, campo, menu.' },
      { t: '--superficie', uso: 'Cabeçalho de tabela, linha dentro de cartão, corpo do drawer.' },
      { t: '--superficie-2', uso: 'Botão secundário, divisória de linha.' },
      { t: '--superficie-3', uso: 'Hover do secundário e do botão de ícone.' },
      { t: '--superficie-hover', uso: 'Hover de linha e de item de menu.' },
      { t: '--veu', uso: 'Atrás de modal e drawer.' },
    ],
  },
  {
    g: 'Bordas',
    quando: 'Bordas com toque verde-azulado, nunca cinza neutro. --borda-controle é a única que passa 3:1: vai onde a borda é o único sinal do controle.',
    itens: [
      { t: '--borda-suave', uso: 'Divisória interna. Fundo de botão inativo.' },
      { t: '--borda', uso: 'Cartão, modal, popover.' },
      { t: '--borda-campo', uso: 'Campo, chip, selo neutro.' },
      { t: '--borda-forte', uso: 'Hover de campo, chip e opção.' },
      { t: '--borda-controle', uso: 'Caixa de seleção, trilho do switch, ponto da opção.' },
    ],
  },
];
const TIPOS = [
  { k: 'rotulo', px: 11, uso: 'Rótulo em caixa alta: cabeçalho de tabela, grupo.', ex: 'CARREGAMENTO', caixa: true },
  { k: 'legenda', px: 12, uso: 'Legenda, rótulo de campo (800), dica, erro, chip, selo.', ex: 'Nome do motorista' },
  { k: 'denso', px: 13, uso: 'Corpo denso: linha de tabela, subtítulo de modal, ação em texto.', ex: 'Toda viagem com a situação e o histórico' },
  { k: 'corpo', px: 14, uso: 'Corpo e controles: campo, botão, aba.', ex: 'Pronta para assegurar' },
  { k: 'titulo', px: 16, uso: 'Título de cartão, de modal e de estado vazio.', ex: 'Enviar link ao motorista' },
  { k: 'destaque', px: 20, uso: 'Número de destaque (tabular), título do drawer.', ex: '128 viagens' },
  { k: 'pagina', px: 24, uso: 'Título de página. Tracking -0,2 px.', ex: 'Viagens' },
];
const ESPACOS = ['--esp-0-5', '--esp-1', '--esp-1-5', '--esp-2', '--esp-2-5', '--esp-3', '--esp-4', '--esp-5', '--esp-6', '--esp-7', '--esp-8', '--esp-10', '--esp-12'];
const RAIOS: T[] = [
  { t: '--raio-xxs', uso: 'Barra fina, marcador.' },
  { t: '--raio-xs', uso: 'Tecla, código em linha, caixa de seleção.' },
  { t: '--raio-p', uso: 'Ação em texto, página da paginação, item de menu.' },
  { t: '--raio-m', uso: 'Campo, botão de contorno, linha em cartão.' },
  { t: '--raio-g', uso: 'Popover, opção com descrição, aviso.' },
  { t: '--raio-xg', uso: 'Cartão de conteúdo.' },
  { t: '--raio-xxg', uso: 'Modal, capa.' },
  { t: '--raio-pilula', uso: 'Botão, chip, selo, contador, toast.' },
];
const SOMBRAS: T[] = [
  { t: '--sombra-xs', uso: 'Campo de busca do topo.' },
  { t: '--sombra-p', uso: 'Hover de cartão clicável.' },
  { t: '--sombra-m', uso: 'Popover, menu da pessoa.' },
  { t: '--sombra-g', uso: 'Sidebar, resultado da busca.' },
  { t: '--sombra-xg', uso: 'Modal.' },
  { t: '--sombra-drawer', uso: 'Drawer.' },
  { t: '--sombra-toast', uso: 'Toast.' },
  { t: '--sombra-cta', uso: 'Botão primário.' },
  { t: '--sombra-cta-p', uso: 'Botão primário pequeno.' },
  { t: '--sombra-perigo', uso: 'Botão de perigo.' },
];
const OUTROS: T[] = [
  { t: '--controle-p', uso: 'Altura mínima de qualquer alvo no escritório.' },
  { t: '--controle-m', uso: 'Botão e campo padrão.' },
  { t: '--controle-mobile', uso: 'Botão e campo no celular (.tx-mobile, Link do motorista).' },
  { t: '--z-fixo', uso: 'Cabeçalho grudado dentro da tela.' },
  { t: '--z-cabecalho', uso: 'Header da moldura.' },
  { t: '--z-sidebar', uso: 'Sidebar.' },
  { t: '--z-pop', uso: 'Popover de filtro.' },
  { t: '--z-menu', uso: 'Menu da pessoa.' },
  { t: '--z-busca', uso: 'Resultado da busca global.' },
  { t: '--z-drawer', uso: 'Drawer.' },
  { t: '--z-modal', uso: 'Modal.' },
  { t: '--z-toast', uso: 'Toast.' },
  { t: '--dur-rapida', uso: 'Hover: cor, borda, fundo.' },
  { t: '--dur-media', uso: 'Sombra, deslocamento, switch.' },
  { t: '--dur-lenta', uso: 'Entrada do drawer, barra de progresso.' },
  { t: '--dur-carga', uso: 'Brilho do esqueleto.' },
];

// ---------------------------------------------------------------- contraste (lido do valor em execução)
function rgb(v: string): number[] | null {
  const s = v.trim();
  const h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (h) {
    const x = h[1].length === 3 ? h[1].split('').map((c) => c + c).join('') : h[1];
    return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
  }
  return null;
}
function razao(a: string, b = '#ffffff'): number | null {
  const A = rgb(a), B = rgb(b);
  if (!A || !B) return null;
  const L = (c: number[]) => c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
  const la = L(A), lb = L(B);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function useTokens(): Record<string, string> {
  const [v, setV] = useState<Record<string, string>>({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const nomes = [...CORES.flatMap((g) => g.itens.map((i) => i.t)), ...ESPACOS, ...RAIOS.map((r) => r.t), ...SOMBRAS.map((s) => s.t), ...OUTROS.map((o) => o.t), ...TIPOS.flatMap((t) => ['--fs-' + t.k, '--lh-' + t.k, '--fw-' + t.k])];
    setV(Object.fromEntries(nomes.map((n) => [n, cs.getPropertyValue(n).trim()])));
  }, []);
  return v;
}

// ---------------------------------------------------------------- moldura da página
function Cod({ children }: { children: ReactNode }) {
  return <code className="ds-cod">{children}</code>;
}
function Secao({ id, n, titulo, intro, children }: { id: string; n: string; titulo: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="ds-sec" id={id}>
      <div className="ds-sec-cab">
        <span className="ds-sec-num">{n}</span>
        <h2 className="ds-h2">{titulo}</h2>
      </div>
      {intro ? <p className="ds-intro">{intro}</p> : null}
      {children}
    </section>
  );
}
type Prop = [string, string, string, string];
function Componente({ id, nome, arquivo, resumo, props, classes, sim, nao, fundo, children }: {
  id: string; nome: string; arquivo: string; resumo: ReactNode; props: Prop[]; classes: ReactNode; sim: string[]; nao: string[]; fundo?: 'liso' | 'fundo'; children: ReactNode;
}) {
  const [aba, setAba] = useState<'props' | 'classes' | 'regras'>('props');
  return (
    <article className="ds-comp" id={id}>
      <div className="ds-comp-cab">
        <h3 className="ds-comp-nome">{nome}</h3>
        <span className="ds-comp-arquivo">{arquivo}</span>
      </div>
      <p className="ds-quando" style={{ marginTop: 'var(--esp-1)' }}>{resumo}</p>
      <div className="ds-palco">
        <div className={'ds-palco-corpo' + (fundo ? ' ds-palco-corpo--' + fundo : '')}>{children}</div>
        <div className="ds-abas-doc">
          <Abas
            rotulo={'Documentação de ' + nome}
            className="ds-abas-doc-lista"
            itens={[
              { k: 'props', n: 'Props', ativa: aba === 'props', onClick: () => setAba('props') },
              { k: 'classes', n: 'Classes', ativa: aba === 'classes', onClick: () => setAba('classes') },
              { k: 'regras', n: 'Fazer e não fazer', ativa: aba === 'regras', onClick: () => setAba('regras') },
            ]}
          />
        </div>
        <div className="ds-detalhe">
          {aba === 'props' ? (
            <table className="ds-tab">
              <thead><tr><th>Prop</th><th>Tipo</th><th>Padrão</th><th>Para quê</th></tr></thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p[0]}><td><Cod>{p[0]}</Cod></td><td className="tx-mono" style={{ fontSize: 'var(--fs-legenda)' }}>{p[1]}</td><td className="tx-mono" style={{ fontSize: 'var(--fs-legenda)' }}>{p[2]}</td><td>{p[3]}</td></tr>
                ))}
              </tbody>
            </table>
          ) : aba === 'classes' ? (
            <div className="ds-quando" style={{ margin: 0, maxWidth: 'none' }}>{classes}</div>
          ) : (
            <div className="ds-regras" style={{ marginTop: 0 }}>
              <div className="ds-regra ds-regra--sim"><h4>Fazer</h4><ul>{sim.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div className="ds-regra ds-regra--nao"><h4>Não fazer</h4><ul>{nao.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
function Estado({ rot, children }: { rot: string; children: ReactNode }) {
  return (
    <div className="ds-estado">
      <span className="ds-rot">{rot}</span>
      {children}
    </div>
  );
}

const NAV: [string, [string, string][]][] = [
  ['Fundamentos', [['cores', 'Cores'], ['tipografia', 'Tipografia'], ['espaco', 'Espaço e forma'], ['outros', 'Alturas, camadas e movimento']]],
  ['Ações', [['botao', 'Botao']]],
  ['Formulário', [['campo', 'Campo'], ['checkbox', 'Checkbox e Switch'], ['chip', 'Chip e opções']]],
  ['Situação', [['situacao', 'Situacao'], ['badge', 'Badge'], ['aviso', 'Aviso']]],
  ['Estrutura', [['cartao', 'Cartao e página'], ['abas', 'Abas'], ['tabela', 'Tabela'], ['paginacao', 'Paginacao'], ['vazio', 'EstadoVazio']]],
  ['Sobreposição', [['modal', 'Modal'], ['drawer', 'Drawer'], ['toast', 'Toast']]],
  ['Regras', [['regras', 'Regras gerais']]],
];

const LINHAS: [string, string, string, string, string, string, string, Tom, string][] = [
  ['17/11 08:30', 'OC-24817', 'Ração ensacada', 'Rondonópolis a Sorriso', 'Transportes Araguaia', 'TAC', 'RXT2B17', 'ok', 'Todas as checagens passaram'],
  ['17/11 09:10', 'OC-24822', 'Milho granel', 'Lucas a Sinop', 'Frota própria', 'Matriz', 'QBC4D21', 'falta', 'Falta o laudo de limpeza'],
  ['17/11 10:00', 'OC-24830', 'Farelo de soja', 'Primavera a Cuiabá', 'Rodo Cerrado', 'ETC', 'PHC2B17', 'bloqueio', 'Carga anterior proibida no T-2'],
  ['17/11 11:40', 'OC-24833', 'Casca de soja', 'Sorriso a Nova Mutum', 'Valmir Schneider', 'TAC', 'RQA7C55', 'autoridade', 'Assinada pela Direção às 11:02'],
];
const COLS = '110px 100px minmax(0,1.4fr) minmax(0,1fr) 90px minmax(0,1.3fr)';

export default function Vitrine() {
  const tk = useTokens();
  const [aba, setAba] = useState('todas');
  const [tipo, setTipo] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<string[]>(['hoje']);
  const [frota, setFrota] = useState('propria');
  const [pag, setPag] = useState(2);
  const [data, setData] = useState('31/02/2026');
  const [modal, setModal] = useState(false);
  const [motivo, setMotivo] = useState('Resíduo de');
  const [toast, setToast] = useState(false);
  const [linhaSel, setLinhaSel] = useState('OC-24822');

  const faltaModal = textoFalta([!tipo ? 'tipo' : '', motivo.trim().length < 20 ? 'motivo (faltam ' + (20 - motivo.trim().length) + ' caracteres)' : '']);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="ds">
      <nav className="ds-nav" aria-label="Seções do design system">
        <div className="ds-nav-marca">{Icone({ k: 'logo' })}<span>Traxium DS</span></div>
        {NAV.map(([g, itens]) => (
          <div key={g} style={{ display: 'contents' }}>
            <div className="ds-nav-grupo">{g}</div>
            {itens.map(([id, n]) => <a key={id} href={'#' + id}>{n}</a>)}
          </div>
        ))}
      </nav>

      <div className="ds-miolo">
        <header className="ds-capa">
          <div className="ds-capa-rot">Traxium SaaS, versão de 17/11/2026</div>
          <h1>Design system</h1>
          <p>
            Tokens e componentes do escritório e do Link do motorista. Cada exemplo abaixo é o componente real de <code>src/components/ui</code>,
            com as classes de <code>ui.css</code>; cada valor é lido de <code>globals.css</code> enquanto a página roda. A biblioteca do Figma espelha
            esta página um para um: mesmo nome de token, de componente, de variante e de estado.
          </p>
          <div className="ds-capa-numeros">
            <div><b>{CORES.reduce((s, g) => s + g.itens.length, 0)}</b><span>tokens de cor</span></div>
            <div><b>7</b><span>passos de texto</span></div>
            <div><b>{ESPACOS.length}</b><span>passos de espaço</span></div>
            <div><b>17</b><span>componentes</span></div>
            <div><b>4,5:1</b><span>contraste mínimo de texto</span></div>
          </div>
        </header>

        {/* ================================================================ fundamentos */}
        <Secao id="cores" n="01" titulo="Cores" intro={<>Toda cor sai de um token de <Cod>globals.css</Cod>. Contrastes completos em <Cod>docs/ds/contraste.md</Cod>.</>}>
          {CORES.map((g) => (
            <div key={g.g}>
              <h3 className="ds-h3">{g.g}</h3>
              <p className="ds-quando">{g.quando}</p>
              <div className="ds-grade">
                {g.itens.map((c) => {
                  const r = g.texto ? razao(tk[c.t] || '') : null;
                  return (
                    <div key={c.t} className="ds-amostra">
                      <div className="ds-cor" style={{ background: `var(${c.t})` }}>
                        {r ? <span className="ds-cor-razao">{r.toFixed(2).replace('.', ',')}:1</span> : null}
                      </div>
                      <div className="ds-amostra-txt">
                        <div className="ds-nome">{c.t}</div>
                        <div className="ds-valor">{tk[c.t] || '...'}</div>
                        <div className="ds-uso">{c.uso}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Secao>

        <Secao id="tipografia" n="02" titulo="Tipografia" intro={<>Hanken Grotesk para toda a interface; Spline Sans Mono para código (ordem, CT-e, placa, contador, tecla). Carregadas do Google Fonts no layout raiz, pesos 400 a 800 e mono 500 e 600. Use <Cod>font: var(--tipo-corpo)</Cod> ou a classe <Cod>.tx-tipo-corpo</Cod>; número em coluna com <Cod>.num</Cod>.</>}>
          <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: 'var(--esp-5)' }}>
            <div className="tx-cartao">
              <div className="ds-nome">--fonte</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, letterSpacing: '-.4px' }}>Hanken Grotesk</div>
              <div className="ds-uso">Aa Bb Cc 0123456789. Pesos 400, 600, 700 e 800.</div>
            </div>
            <div className="tx-cartao">
              <div className="ds-nome">--fonte-mono</div>
              <div className="tx-mono" style={{ fontSize: 28, fontWeight: 600, marginTop: 8 }}>OC-24817 RXT2B17</div>
              <div className="ds-uso">Spline Sans Mono 500 e 600. Só para código e número de controle.</div>
            </div>
          </div>
          <h3 className="ds-h3">Escala de 7 passos</h3>
          <p className="ds-quando">Só estes tamanhos. 32 e 40 px (<Cod>--fs-painel</Cod>, <Cod>--fs-painel-g</Cod>) ficam para o número grande de painel. O Link do motorista usa 12, 14, 16, 20 e 24, com campo de 16 px.</p>
          <div className="tx-cartao tx-cartao--lista" style={{ overflowX: 'auto' }}>
            <table className="ds-tab">
              <thead><tr><th>Token</th><th>Tamanho</th><th>Peso</th><th>Entrelinha</th><th>Uso</th><th>Exemplo</th></tr></thead>
              <tbody>
                {TIPOS.map((e) => (
                  <tr key={e.k}>
                    <td><Cod>{'--tipo-' + e.k}</Cod></td>
                    <td className="tx-mono num">{tk['--fs-' + e.k] || e.px + 'px'}</td>
                    <td className="tx-mono">{tk['--fw-' + e.k]}</td>
                    <td className="tx-mono">{tk['--lh-' + e.k]}</td>
                    <td style={{ color: 'var(--texto-2)', maxWidth: 260 }}>{e.uso}</td>
                    <td className={'tx-tipo-' + e.k} style={{ whiteSpace: 'nowrap' }}>{e.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ds-nota">Parágrafo de várias linhas: <Cod>--lh-paragrafo</Cod> (1,55). Rótulo em caixa alta sempre com <Cod>--ls-rotulo</Cod> (0,7 px).</p>
        </Secao>

        <Secao id="espaco" n="03" titulo="Espaço e forma" intro="Espaço em base 4. 6 e 10 existem porque são o ritmo dos chips e das listas (119 usos nas telas); 7 e 9 não existem mais.">
          <h3 className="ds-h3">Espaçamento</h3>
          <div className="tx-cartao">
            <table className="ds-tab">
              <tbody>
                {ESPACOS.map((n) => (
                  <tr key={n}>
                    <td style={{ width: 120 }}><Cod>{n}</Cod></td>
                    <td className="tx-mono num" style={{ width: 60 }}>{tk[n]}</td>
                    <td><div className="ds-barra" style={{ width: `var(${n})` }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="ds-h3">Raios</h3>
          <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {RAIOS.map((r) => (
              <div key={r.t} className="ds-amostra" style={{ padding: 'var(--esp-3)' }}>
                <div className="ds-raio" style={{ borderRadius: `var(${r.t})` }} />
                <div className="ds-nome" style={{ marginTop: 'var(--esp-2)' }}>{r.t}</div>
                <div className="ds-valor">{tk[r.t]}</div>
                <div className="ds-uso">{r.uso}</div>
              </div>
            ))}
          </div>
          <h3 className="ds-h3">Sombras</h3>
          <p className="ds-quando">Sempre tingidas com a marca (rgba de #093d44, #092224, teal ou vermelho), nunca preto.</p>
          <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--esp-6)', padding: 'var(--esp-2)' }}>
            {SOMBRAS.map((s) => (
              <div key={s.t} className="ds-sombra" style={{ boxShadow: `var(${s.t})` }}>
                <div className="ds-nome">{s.t}</div>
                <div className="ds-valor">{tk[s.t]}</div>
                <div className="ds-uso">{s.uso}</div>
              </div>
            ))}
          </div>
        </Secao>

        <Secao id="outros" n="04" titulo="Alturas, camadas e movimento">
          <div className="tx-cartao tx-cartao--lista" style={{ marginTop: 'var(--esp-5)' }}>
            <table className="ds-tab">
              <thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead>
              <tbody>
                {OUTROS.map((o) => (
                  <tr key={o.t}><td><Cod>{o.t}</Cod></td><td className="tx-mono num">{tk[o.t]}</td><td style={{ color: 'var(--texto-2)' }}>{o.uso}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ds-nota">Com <Cod>prefers-reduced-motion</Cod>, botão, modal, drawer, switch e esqueleto param de animar.</p>
        </Secao>

        {/* ================================================================ componentes */}
        <Secao id="componentes" n="05" titulo="Componentes" intro={<>Importe de <Cod>@/components/ui</Cod>. Em .jsx que ainda não migrou, as mesmas classes servem direto. O contrato de troca, padrão por padrão, está em <Cod>docs/ds/guia-migracao.md</Cod>.</>}>
          <Componente
            id="botao" nome="Botao" arquivo="src/components/ui/botao.tsx"
            resumo="Um primário por área (rodapé de modal, cabeçalho de página). O primário fica inativo enquanto falta o obrigatório: continua focável e o clique leva ao campo que falta. Renderiza <button>, ou <a> quando tem href."
            props={[
              ['variante', "'primario' | 'secundario' | 'contorno' | 'perigo' | 'texto' | 'icone'", "'secundario'", 'Peso visual da ação.'],
              ['tamanho', "'p' | 'm'", "'m'", 'm: 40 px. p: 32 px, para lista e linha. No celular (.tx-mobile) os dois têm 44 px.'],
              ['inativo', 'boolean', 'false', 'aria-disabled: apagado, mas o clique ainda chega (leva ao que falta).'],
              ['desabilitado', 'boolean', 'false', 'disabled nativo: sem foco e sem clique.'],
              ['carregando', 'boolean', 'false', 'Mostra o giro no lugar do texto e marca aria-busy.'],
              ['icone', 'ReactNode', '', 'Ícone antes do texto; no variante icone, o conteúdo inteiro.'],
              ['href', 'string', '', 'Vira link (next/link quando começa com /).'],
              ['largo', 'boolean', 'false', 'Ocupa a largura toda (celular).'],
              ['aria-label', 'string', '', 'Obrigatório no variante icone.'],
            ]}
            classes={<><Cod>.tx-botao</Cod> + <Cod>.tx-botao--primario</Cod> | <Cod>--secundario</Cod> | <Cod>--contorno</Cod> | <Cod>--perigo</Cod> | <Cod>--texto</Cod> | <Cod>--icone</Cod>; tamanho <Cod>.tx-botao--p</Cod>; <Cod>.tx-botao--carregando</Cod> com <Cod>.tx-botao__giro</Cod>; <Cod>.tx-botao--largo</Cod>. Estado por atributo: <Cod>[aria-disabled=&quot;true&quot;]</Cod>, <Cod>:disabled</Cod>. Em .jsx: <Cod>{'className={U.cta(ok).cls} aria-disabled={U.cta(ok).ariaDisabled}'}</Cod>. A antiga <Cod>.tx-acao-texto</Cod> é o mesmo desenho de <Cod>--texto</Cod>.</>}
            sim={['Um primário por área; ao lado, o secundário Cancelar.', 'Primário inativo com o rodapé "Falta:" dizendo o quê.', 'Texto do botão com verbo e objeto: "Registrar ocorrência".', 'Botão de ícone sempre com aria-label.', 'Perigo só para ação que apaga, cancela ou revoga.']}
            nao={['Dois primários lado a lado.', '<span role="button"> no lugar de <button>.', 'disabled no primário de formulário (o clique precisa levar ao campo).', 'Perigo para ação reversível.', 'Botão de texto para a ação principal.']}
          >
            <div className="ds-matriz">
              <span className="ds-rot">.</span><span className="ds-rot">Repouso</span><span className="ds-rot">Hover</span><span className="ds-rot">Foco</span><span className="ds-rot">Inativo</span><span className="ds-rot">Carregando</span>
              {([['primario', 'Salvar viagem'], ['secundario', 'Cancelar'], ['contorno', 'Exportar planilha'], ['perigo', 'Cancelar viagem'], ['texto', 'Ver todas']] as const).map(([v, n]) => (
                <div key={v} style={{ display: 'contents' }}>
                  <span className="ds-rot">{v}</span>
                  <span><Botao variante={v}>{n}</Botao></span>
                  <span><Botao variante={v} className="ds-forca-hover" tabIndex={-1}>{n}</Botao></span>
                  <span><Botao variante={v} className="ds-forca-foco" tabIndex={-1}>{n}</Botao></span>
                  <span><Botao variante={v} inativo>{n}</Botao></span>
                  <span>{v === 'texto' ? null : <Botao variante={v} carregando>{n}</Botao>}</span>
                </div>
              ))}
            </div>
            <div className="ds-linha" style={{ marginTop: 'var(--esp-6)', gap: 'var(--esp-6)' }}>
              <Estado rot="Pequeno (p)"><div className="ds-linha"><Botao variante="primario" tamanho="p">Resolver</Botao><Botao tamanho="p">Ver</Botao></div></Estado>
              <Estado rot="Ícone"><div className="ds-linha"><Botao variante="icone" aria-label="Fechar" icone={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" /></svg>} /><Botao variante="icone" className="ds-forca-hover" aria-label="Fechar" tabIndex={-1} icone={<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" /></svg>} /></div></Estado>
              <Estado rot="Com ícone"><Botao variante="contorno" icone={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 2.5v8" /><path d="M4.8 7.5 8 10.7l3.2-3.2" /><path d="M3 13.2h10" /></svg>}>Exportar planilha</Botao></Estado>
              <Estado rot="Link (href)"><Botao variante="secundario" href="#botao">Abrir viagem</Botao></Estado>
              <Estado rot="Desabilitado (nativo)"><Botao desabilitado>Sem permissão</Botao></Estado>
            </div>
          </Componente>

          <Componente
            id="campo" nome="Campo" arquivo="src/components/ui/campo.tsx"
            resumo="Rótulo sempre visível e ligado ao controle. Dica embaixo; o erro substitui a dica, aparece só depois da primeira tentativa de salvar e diz o que fazer. Placeholder é exemplo, nunca o rótulo."
            props={[
              ['id', 'string', '', 'Obrigatório. Vai para o controle; o rótulo aponta para ele.'],
              ['rotulo', 'ReactNode', '', 'Texto do <label>.'],
              ['dica', 'ReactNode', '', 'Ajuda curta. Ligada por aria-describedby.'],
              ['erro', 'string', '', 'Mensagem de erro. Marca aria-invalid e aria-describedby no controle.'],
              ['opcional', 'boolean', 'false', 'Escreve "(opcional)" depois do rótulo.'],
              ['campo', 'string', '', 'Nome para o rodapé "Falta:" focar (vira data-tx-campo).'],
              ['children', 'Entrada | AreaTexto | Selecao | CampoData', '', 'O controle. Recebe id e ARIA por clonagem.'],
              ['Entrada.mono', 'boolean', 'false', 'Fonte mono (placa, CPF, número).'],
              ['CampoData.valor / aoMudar', 'string / (v) => void', '', 'Data DD/MM/AAAA com máscara; aoMudar recebe o texto mascarado.'],
              ['EntradaCaixa.icone', 'ReactNode', '', 'Campo com ícone dentro (busca).'],
            ]}
            classes={<><Cod>.tx-campo</Cod>, <Cod>.tx-campo__rotulo</Cod> (= <Cod>.tx-rotulo</Cod>), <Cod>.tx-campo__opcional</Cod>, <Cod>.tx-campo__dica</Cod> (= <Cod>.tx-dica</Cod>), <Cod>.tx-campo__erro</Cod> (= <Cod>.tx-erro</Cod>). Controle: <Cod>.tx-entrada</Cod> (input, textarea, select) com <Cod>.tx-entrada--mono</Cod>; estados <Cod>:hover</Cod>, <Cod>:focus-visible</Cod>, <Cod>[aria-invalid=&quot;true&quot;]</Cod>, <Cod>:disabled</Cod>. Busca: <Cod>.tx-entrada-caixa</Cod>. Celular: dentro de <Cod>.tx-mobile</Cod>, 44 px e 16 px de fonte.</>}
            sim={['Rótulo curto em cima do campo.', 'Erro com a ação: "Digite a data como 05/11/2026".', 'Data sempre em DD/MM/AAAA com CampoData.', 'Placa, CPF e código com Entrada mono.']}
            nao={['Placeholder no lugar do rótulo.', 'Erro em toast ou alert do navegador.', 'Erro antes de a pessoa tentar salvar.', 'input type="date" (mostra o formato do navegador).']}
          >
            <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--esp-6)' }}>
              <Estado rot="Repouso"><Campo id="ds-c1" rotulo="Nome do motorista" dica="Como aparece na CNH." style={{ width: '100%' }}><Entrada placeholder="Como no documento" /></Campo></Estado>
              <Estado rot="Foco"><Campo id="ds-c2" rotulo="Celular com DDD" style={{ width: '100%' }}><Entrada defaultValue="(66) 99812-4" className="ds-forca-foco" tabIndex={-1} /></Campo></Estado>
              <Estado rot="Erro"><Campo id="ds-c3" rotulo="Data do carregamento" erro="Data inválida: fevereiro não tem 31 dias." style={{ width: '100%' }}><CampoData valor={data} aoMudar={setData} /></Campo></Estado>
              <Estado rot="Desabilitado"><Campo id="ds-c4" rotulo="Placa da carreta" style={{ width: '100%' }}><Entrada mono disabled defaultValue="RXT2B17" /></Campo></Estado>
              <Estado rot="Seleção"><Campo id="ds-c5" rotulo="Filial" style={{ width: '100%' }}><Selecao defaultValue="sorriso"><option value="matriz">Rondonópolis, matriz</option><option value="sorriso">Sorriso MT</option></Selecao></Campo></Estado>
              <Estado rot="Opcional"><Campo id="ds-c6" rotulo="Observação" opcional style={{ width: '100%' }}><AreaTexto placeholder="Aparece no histórico da viagem" rows={2} /></Campo></Estado>
              <Estado rot="Busca"><div style={{ width: '100%' }}><label className="tx-campo__rotulo" htmlFor="ds-c7">Filtrar esta mesa</label><EntradaCaixa id="ds-c7" placeholder="Ordem, placa ou motorista" icone={<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" strokeLinecap="round" /></svg>} /></div></Estado>
            </div>
          </Componente>

          <Componente
            id="checkbox" nome="Checkbox e Switch" arquivo="src/components/ui/escolha.tsx"
            resumo="Checkbox marca itens independentes (pôr viagem na amostra, aceitar termo). Switch liga e desliga uma configuração que vale na hora, sem botão de salvar. Os dois usam o input nativo: teclado e leitor de tela funcionam sem código."
            props={[
              ['rotulo', 'ReactNode', '', 'Texto ao lado; clicar nele marca.'],
              ['dica', 'ReactNode', '', 'Linha de baixo, menor.'],
              ['invalido', 'boolean', 'false', 'Só Checkbox: borda vermelha (termo obrigatório não aceito).'],
              ['checked / defaultChecked / onChange / disabled / name', 'nativas', '', 'Passam direto para o input.'],
            ]}
            classes={<><Cod>.tx-check</Cod> com <Cod>.tx-check__input</Cod>, <Cod>.tx-check__caixa</Cod>, <Cod>.tx-check__texto</Cod>, <Cod>.tx-check__dica</Cod>. <Cod>.tx-switch</Cod> com <Cod>.tx-switch__input</Cod> (role=&quot;switch&quot;) e <Cod>.tx-switch__trilho</Cod>. Estado pelo input: <Cod>:checked</Cod>, <Cod>:indeterminate</Cod>, <Cod>:disabled</Cod>, <Cod>:focus-visible</Cod>. Borda em repouso: <Cod>--borda-controle</Cod> (3,27:1).</>}
            sim={['Checkbox para lista de itens; Switch para preferência que vale na hora.', 'Rótulo que diz o estado ligado: "Avisar o motorista por SMS".']}
            nao={['Desenhar a caixa com <div> e ✓ em texto.', 'Switch dentro de formulário que tem botão Salvar.', 'Borda clara (--borda-forte) como único sinal da caixa.']}
          >
            <div className="ds-linha" style={{ gap: 'var(--esp-8)', alignItems: 'flex-start' }}>
              <div className="ds-pilha" style={{ gap: 'var(--esp-1)' }}>
                <Checkbox rotulo="Pôr na amostra" defaultChecked />
                <Checkbox rotulo="Incluir frota própria" />
                <Checkbox rotulo="Li e aceito o termo" invalido />
                <Checkbox rotulo="Assinada (sem alçada)" disabled defaultChecked />
                <Checkbox rotulo="Exportar com fotos" dica="Arquivo fica maior, até 20 MB." />
              </div>
              <div className="ds-pilha" style={{ gap: 'var(--esp-1)' }}>
                <Switch rotulo="Avisar o motorista por SMS" defaultChecked />
                <Switch rotulo="Exigir foto do lacre" />
                <Switch rotulo="Bloquear sem CT-e" disabled />
                <Switch rotulo="Resumo diário por e-mail" dica="Às 07:00, para a Qualidade." defaultChecked />
              </div>
            </div>
          </Componente>

          <Componente
            id="chip" nome="Chip, Escolhas e OpcaoCartao" arquivo="src/components/ui/escolha.tsx"
            resumo="Poucas opções exclusivas viram Escolhas (rádio em chip). Filtro de lista que liga e desliga é Chip tipo filtro (escuro quando ligado). Opção que precisa de explicação é OpcaoCartao."
            props={[
              ['Chip.tipo', "'opcao' | 'filtro'", "'opcao'", 'opcao: role=radio com aria-checked. filtro: aria-pressed.'],
              ['Chip.selecionado', 'boolean', 'false', 'Escolhido ou ligado.'],
              ['Chip.inativo', 'boolean', 'false', 'Opção que não vale agora (aria-disabled).'],
              ['Escolhas.id / rotulo', 'string / ReactNode', '', 'Rótulo do grupo (aria-labelledby).'],
              ['Escolhas.itens', '{ n, on, onClick, k, inativo }[]', '', 'As opções.'],
              ['Escolhas.erro', 'string', '', 'Borda vermelha nas opções e mensagem embaixo.'],
              ['OpcaoCartao.titulo / sub', 'ReactNode', '', 'Título e descrição da opção.'],
              ['OpcaoCartao.selecionado / inativo', 'boolean', 'false', 'Estado. Use dentro de role="radiogroup".'],
            ]}
            classes={<><Cod>.tx-escolhas</Cod> (grupo), <Cod>.tx-chip</Cod> com <Cod>[aria-checked=&quot;true&quot;]</Cod>; filtro <Cod>.tx-chip--filtro</Cod> com <Cod>[aria-pressed=&quot;true&quot;]</Cod>; erro <Cod>[aria-invalid=&quot;true&quot;] &gt; .tx-chip</Cod>. Opção: <Cod>.tx-opcao</Cod>, <Cod>.tx-opcao__ponto</Cod>, <Cod>__texto</Cod>, <Cod>__titulo</Cod>, <Cod>__sub</Cod>. Em .jsx: <Cod>U.chip(on).cls</Cod>, <Cod>U.sel(on).cls</Cod>.</>}
            sim={['Até 5 opções curtas: Escolhas. Mais que isso: Selecao.', 'Filtro escuro só em barra de filtro de lista.']}
            nao={['Misturar chip de opção e de filtro no mesmo grupo.', 'Chip para ação (é botão).']}
          >
            <div className="ds-pilha">
              <Escolhas id="ds-e1" rotulo="Tipo de carga" itens={['Ração ensacada', 'Granel', 'Insumo líquido'].map((n) => ({ n, k: n, on: tipo === n, onClick: () => setTipo(n) }))} />
              <Escolhas id="ds-e2" rotulo="Tipo de carga (com erro)" erro="Escolha o tipo de carga." itens={['Ração ensacada', 'Granel'].map((n) => ({ n, k: n }))} />
              <div>
                <div className="tx-campo__rotulo">Filtro de lista</div>
                <div className="tx-escolhas">
                  {[['hoje', 'Hoje'], ['7d', '7 dias'], ['30d', '30 dias'], ['pend', 'Com pendência']].map(([k, n]) => (
                    <Chip key={k} tipo="filtro" selecionado={filtros.includes(k)} onClick={() => setFiltros((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]))}>{n}</Chip>
                  ))}
                  <Chip tipo="filtro" className="ds-forca-hover" tabIndex={-1}>Hover</Chip>
                  <Chip tipo="filtro" inativo>Sem dados</Chip>
                </div>
              </div>
              <div role="radiogroup" aria-label="Quem transporta" style={{ display: 'grid', gap: 'var(--esp-2)', maxWidth: 440 }}>
                <OpcaoCartao titulo="Frota própria" sub="Veículo e motorista da empresa" selecionado={frota === 'propria'} onClick={() => setFrota('propria')} />
                <OpcaoCartao titulo="Transportador terceiro" sub="TAC ou ETC com RNTRC" selecionado={frota === 'terceiro'} onClick={() => setFrota('terceiro')} />
                <OpcaoCartao titulo="Cooperativa" sub="Não cadastrada nesta filial" inativo />
              </div>
            </div>
          </Componente>

          <Componente
            id="situacao" nome="Situacao" arquivo="src/components/ui/situacao.tsx"
            resumo="O resultado do motor (TX.decidir) em Viagens, Hoje e Viagem. Sempre ponto, cor e rótulo juntos. Na linha de tabela, a forma ponto (com o motivo embaixo); em filtro, cabeçalho e lista curta, o selo com borda. Os tons são as chaves de TX.ui.TOM, um para um."
            props={[
              ['tom', "'ok' | 'falta' | 'bloqueio' | 'tecnico' | 'autoridade' | 'na' | 'info'", '', 'Chave de TX.ui.TOM. Da decisão: tomDaDecisao(dec).'],
              ['forma', "'ponto' | 'selo'", "'ponto'", 'ponto: linha de tabela. selo: com borda.'],
              ['children', 'ReactNode', 'ROTULO_TOM[tom]', 'Rótulo; em geral dec.rotulo.'],
              ['detalhe', 'ReactNode', '', 'Motivo embaixo (só forma ponto).'],
            ]}
            classes={<><Cod>.tx-situacao</Cod> + <Cod>.tx-situacao--{'{tom}'}</Cod>, ponto <Cod>.tx-situacao__ponto</Cod>, selo <Cod>.tx-situacao--selo</Cod>, motivo <Cod>.tx-situacao__detalhe</Cod>. Em .jsx: <Cod>U.tomResultado(dec).cls</Cod> ou <Cod>U.tomClasse(k, selo)</Cod>. Cada tom define só <Cod>--_c</Cod>, <Cod>--_ponto</Cod>, <Cod>--_anel</Cod>, <Cod>--_borda</Cod>, <Cod>--_fundo</Cod>.</>}
            sim={['Rótulo que vem do motor (dec.rotulo).', 'Motivo curto embaixo na tabela.', '"Em trânsito" e outros informativos com tom info.']}
            nao={['Só a cor, sem rótulo.', 'Verde para "liberada por autoridade": é o tom autoridade.', 'Inventar tom fora dos 7.']}
          >
            <table className="ds-tab">
              <thead><tr><th>Tom</th><th>Ponto</th><th>Selo</th><th>Com motivo</th></tr></thead>
              <tbody>
                {TONS.map((t) => (
                  <tr key={t}>
                    <td><Cod>{t}</Cod></td>
                    <td><Situacao tom={t} /></td>
                    <td><Situacao tom={t} forma="selo" /></td>
                    <td><Situacao tom={t} detalhe={{ ok: 'Todas as checagens passaram', falta: 'Falta o laudo de limpeza', bloqueio: 'Carga anterior proibida no T-2', tecnico: 'Regime D sem desinfecção', autoridade: 'Assinada pela Direção', na: 'Fora do escopo GMP+', info: 'Saiu às 08:40' }[t]}>{ROTULO_TOM[t]}</Situacao></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Componente>

          <Componente
            id="badge" nome="Badge" arquivo="src/components/ui/situacao.tsx"
            resumo="Selo de texto que não é a situação da viagem: papel, responsável, código, prazo, contador ao lado de aba ou título."
            props={[
              ['tom', "'neutro' | 'marca' | 'ok' | 'aviso' | 'perigo' | 'tecnico' | 'info' | 'autoridade'", "'neutro'", 'Cor do texto e da borda.'],
              ['mono', 'boolean', 'false', 'Código (ordem, placa, RNTRC).'],
              ['contador', 'boolean', 'false', 'Número pequeno em mono, sem padding lateral largo.'],
              ['cheio', 'boolean', 'false', 'Fundo --superficie-2 sem borda.'],
            ]}
            classes={<><Cod>.tx-badge</Cod> + <Cod>.tx-badge--{'{tom}'}</Cod>, <Cod>.tx-badge--mono</Cod>, <Cod>.tx-badge--contador</Cod>, <Cod>.tx-badge--cheio</Cod>.</>}
            sim={['Código da viagem ao lado do título do modal (marca, mono).', 'Contador âmbar só quando há pendência.']}
            nao={['Badge para situação da viagem (é Situacao).', 'Badge clicável (é Chip ou Botao).']}
          >
            <div className="ds-linha">
              <Badge>Qualidade</Badge>
              <Badge tom="marca" mono>OC-24817</Badge>
              <Badge tom="ok">CT-e conciliado</Badge>
              <Badge tom="aviso">CT-e não conciliado</Badge>
              <Badge tom="perigo">vencido</Badge>
              <Badge tom="tecnico">regime D</Badge>
              <Badge tom="info">convite enviado</Badge>
              <Badge tom="autoridade">liberada por autoridade</Badge>
              <Badge cheio>frota própria</Badge>
              <Badge tom="aviso" contador>3</Badge>
              <Badge contador>12</Badge>
            </div>
          </Componente>

          <Componente
            id="aviso" nome="Aviso" arquivo="src/components/ui/cartao.tsx"
            resumo="Alerta em linha dentro da página, do cartão ou do modal. Bloqueio sempre com causa e ação. Perigo e técnico interrompem o leitor de tela (role=alert); os outros são status."
            props={[
              ['tom', "'info' | 'ok' | 'aviso' | 'perigo' | 'tecnico'", "'info'", 'Cor, fundo tingido e ícone.'],
              ['titulo', 'ReactNode', '', 'Primeira frase, em negrito na cor do tom.'],
              ['acao', 'ReactNode', '', 'Botão à direita (Botao tamanho p).'],
              ['children', 'ReactNode', '', 'Explicação.'],
            ]}
            classes={<><Cod>.tx-aviso</Cod> + <Cod>.tx-aviso--ok</Cod> | <Cod>--aviso</Cod> | <Cod>--perigo</Cod> | <Cod>--tecnico</Cod>; <Cod>.tx-aviso__icone</Cod>, <Cod>__corpo</Cod>, <Cod>__titulo</Cod>, <Cod>__acao</Cod>.</>}
            sim={['Título com o fato; texto com o que fazer.', 'Um aviso por assunto.']}
            nao={['Aviso para confirmar ação feita (é Toast).', 'Erro de campo em Aviso (vai no Campo).']}
          >
            <div className="ds-pilha" style={{ gap: 'var(--esp-3)' }}>
              <Aviso titulo="Link enviado ao motorista.">Ele responde pelo celular; a viagem acende quando o checklist chegar.</Aviso>
              <Aviso tom="ok" titulo="Viagem pronta para assegurar.">Todas as checagens aplicáveis passaram em 17/11/2026 às 09:12.</Aviso>
              <Aviso tom="aviso" titulo="Falta o laudo de limpeza." acao={<Botao tamanho="p">Pedir ao lavador</Botao>}>Sem ele, a viagem não sai como assegurada.</Aviso>
              <Aviso tom="perigo" titulo="Carga bloqueada." acao={<Botao tamanho="p" variante="primario">Pedir liberação</Botao>}>A última carga do compartimento PHC-2B17 foi defensivo agrícola em 22/05. A IDTF exige regime D antes deste carregamento.</Aviso>
              <Aviso tom="tecnico" titulo="Bloqueio técnico.">Regime D sem desinfecção registrada. Nenhuma alçada libera: registre a desinfecção.</Aviso>
            </div>
          </Componente>

          <Componente
            id="cartao" nome="Cartao, Linha e CabecalhoPagina" arquivo="src/components/ui/cartao.tsx" fundo="fundo"
            resumo="Cartao agrupa uma área da página. A página começa com CabecalhoPagina dentro de .tx-pagina. Linha é o par rótulo e valor dentro de cartão, drawer ou modal."
            props={[
              ['Cartao.titulo / sub / acoes', 'ReactNode', '', 'Cabeçalho do cartão; acoes à direita.'],
              ['Cartao.lista', 'boolean', 'false', 'Sem padding: para Tabela dentro.'],
              ['Cartao.href', 'string', '', 'O cartão inteiro vira link, com sombra no hover.'],
              ['Cartao.como', "'div' | 'section' | 'article'", "'div'", 'Elemento HTML.'],
              ['Linha.rotulo', 'ReactNode', '', 'Rótulo à esquerda; children é o valor.'],
              ['CabecalhoPagina.titulo / sub / acoes', 'ReactNode', '', 'Título de 24 px, subtítulo e ações.'],
            ]}
            classes={<><Cod>.tx-pagina</Cod>, <Cod>.tx-pagina-cab</Cod> (<Cod>__titulo</Cod>, <Cod>__sub</Cod>, <Cod>__acoes</Cod>). <Cod>.tx-cartao</Cod>, <Cod>.tx-cartao--lista</Cod>, <Cod>.tx-cartao--clicavel</Cod>, <Cod>__cab</Cod>, <Cod>__titulos</Cod>, <Cod>__titulo</Cod>, <Cod>__sub</Cod>, <Cod>__acoes</Cod>, <Cod>__corpo</Cod>. <Cod>.tx-linha</Cod> (era <Cod>.mo-linha</Cod>).</>}
            sim={['Um cartão por assunto.', 'Número de destaque com .tx-tipo-destaque.']}
            nao={['Cartão dentro de cartão.', 'Sombra em cartão parado (só no hover do clicável).']}
          >
            <CabecalhoPagina titulo="Viagens" sub="Toda viagem com a situação e o histórico" acoes={<><Botao variante="contorno">Exportar planilha</Botao><Botao variante="primario">Nova viagem</Botao></>} />
            <div className="ds-grade" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 'var(--esp-4)', gap: 'var(--esp-4)' }}>
              <Cartao titulo="Viagens de hoje" sub="Matriz, 17/11/2026">
                <div className="tx-tipo-destaque">12</div>
                <div style={{ display: 'grid', gap: 'var(--esp-2)', marginTop: 'var(--esp-3)' }}>
                  <Linha rotulo="Com pendência"><b className="num" style={{ color: 'var(--aviso)' }}>4</b></Linha>
                  <Linha rotulo="Bloqueadas"><b className="num" style={{ color: 'var(--perigo)' }}>1</b></Linha>
                </div>
              </Cartao>
              <Cartao titulo="Sorriso MT" sub="GMP+ 105745" href="#cartao" acoes={<Badge tom="aviso" contador>6</Badge>}>
                <Situacao tom="ok">Gatekeeper comunicado</Situacao>
                <div className="ds-nota">Cartão clicável: passe o ponteiro.</div>
              </Cartao>
              <Cartao titulo="Vencimentos" acoes={<Botao variante="texto">Ver todos</Botao>}>
                <div style={{ display: 'grid', gap: 'var(--esp-2)' }}>
                  <Linha rotulo="CRLV QHG 7L34"><Badge tom="perigo">vencido</Badge></Linha>
                  <Linha rotulo="CNH Ivo Barcellos"><Badge tom="aviso">7 dias</Badge></Linha>
                </div>
              </Cartao>
            </div>
          </Componente>

          <Componente
            id="abas" nome="Abas" arquivo="src/components/ui/abas.tsx"
            resumo="Trocam a visão de uma mesma lista. A ativa tem texto 800 e sublinhado teal de 2,5 px; o contador âmbar só aparece quando há pendência."
            props={[
              ['itens', '{ k, n, q?, qTom?, ativa?, onClick?, href?, depois? }[]', '', 'As abas. q > 0 mostra o contador; href faz a aba mudar a URL.'],
              ['rotulo', 'string', '', 'aria-label do grupo.'],
            ]}
            classes={<><Cod>.tx-abas</Cod>, <Cod>.tx-aba</Cod> com <Cod>[aria-selected=&quot;true&quot;]</Cod> (botão role=tab) ou <Cod>[aria-current=&quot;page&quot;]</Cod> (link); contador <Cod>.tx-badge--contador</Cod>.</>}
            sim={['Rótulo curto; o contador diz quantos esperam ação.']}
            nao={['Abas para navegar entre telas diferentes (é a sidebar).', 'Mais de 6 abas fixas.']}
          >
            <div className="tx-cartao tx-cartao--lista">
              <Abas
                rotulo="Visões de viagens"
                itens={[['todas', 'Todas', 0], ['cte', 'Esperando CT-e', 3], ['lavagem', 'Lavagem', 0], ['autoridade', 'Liberadas por autoridade', 1]].map(([k, n, q]) => ({ k: k as string, n: n as string, q: q as number, ativa: aba === k, onClick: () => setAba(k as string) }))}
              />
              <div style={{ padding: 'var(--esp-4) var(--esp-5)' }} className="tx-tipo-denso tx-sec">Visão ativa: {aba}. Hover forçado: <span className="tx-aba ds-forca-hover" style={{ display: 'inline-flex', minHeight: 0, padding: 0 }}>Lavagem</span></div>
            </div>
          </Componente>

          <Componente
            id="tabela" nome="Tabela" arquivo="src/components/ui/tabela.tsx" fundo="fundo"
            resumo="Lista longa de registros (Viagens, Transportadores, Frota). Grade CSS, não <table>: as colunas são definidas uma vez. A linha inteira é o link. Código e placa em mono; a situação fica na última coluna."
            props={[
              ['Tabela.colunas', 'string', '', 'grid-template-columns (vira --tx-colunas).'],
              ['Tabela.rotulo', 'string', '', 'aria-label.'],
              ['TabelaLinha.href', 'string', '', 'A linha vira link.'],
              ['TabelaLinha.onClick', '() => void', '', 'A linha vira role=button.'],
              ['TabelaLinha.selecionada', 'boolean', 'false', 'Fundo --primario-fraco e faixa à esquerda.'],
              ['Celula.forte / sub / mono', 'ReactNode / ReactNode / boolean', '', 'Duas linhas de texto numa célula.'],
              ['TabelaEsqueleto.linhas', 'number', '3', 'Barras de carregando.'],
              ['TabelaRodape', 'children', '', 'Rodapé (paginação).'],
            ]}
            classes={<><Cod>.tx-tabela</Cod> (com <Cod>style=&#123;&#123;&apos;--tx-colunas&apos;: ...&#125;&#125;</Cod>, a única variável inline permitida), <Cod>.tx-tabela__cab</Cod>, <Cod>.tx-tabela__linha</Cod> (<Cod>:hover</Cod> quando é link ou botão, <Cod>[aria-selected=&quot;true&quot;]</Cod>), <Cod>.tx-tabela__forte</Cod>, <Cod>__sub</Cod>, <Cod>__codigo</Cod>, <Cod>__celula</Cod>, <Cod>__esqueleto</Cod> com <Cod>.tx-esqueleto</Cod>, <Cod>__rodape</Cod>.</>}
            sim={['Linha inteira clicável, sem botão "Ver" na ponta.', 'Data e número com .num.', 'Esqueleto com a mesma altura das linhas.']}
            nao={['<table> para lista de registros.', 'Mais de 7 colunas.', 'Situação só com cor.']}
          >
            <Cartao lista>
              <Tabela colunas={COLS} rotulo="Viagens">
                <TabelaCabecalho><span>Carregamento</span><span>Ordem</span><span>Produto e rota</span><span>Transportador</span><span>Placas</span><span>Situação</span></TabelaCabecalho>
                {LINHAS.map((r, i) => (
                  <TabelaLinha key={r[1]} onClick={() => setLinhaSel(r[1])} selecionada={linhaSel === r[1]} className={i === 2 ? 'ds-forca-hover' : undefined}>
                    <span className="num" style={{ fontWeight: 700 }}>{r[0]}</span>
                    <span className="tx-tabela__codigo">{r[1]}</span>
                    <Celula forte={r[2]} sub={r[3]} />
                    <Celula forte={r[4]} sub={r[5]} />
                    <span className="tx-mono tx-tipo-legenda" style={{ color: 'var(--texto-2)' }}>{r[6]}</span>
                    <Situacao tom={r[7]} detalhe={r[8]}>{ROTULO_TOM[r[7]]}</Situacao>
                  </TabelaLinha>
                ))}
                <TabelaEsqueleto linhas={2} />
                <TabelaRodape><Paginacao pagina={pag} total={5} info={'mostrando ' + ((pag - 1) * 25 + 1) + ' a ' + Math.min(pag * 25, 112) + ' de 112 viagens'} aoIr={setPag} /></TabelaRodape>
              </Tabela>
            </Cartao>
            <p className="ds-nota">Linha OC-24830 com hover forçado; clique numa linha para marcá-la (selecionada).</p>
          </Componente>

          <Componente
            id="paginacao" nome="Paginacao" arquivo="src/components/ui/paginacao.tsx"
            resumo="25 registros por página, total sempre visível. Sem navegação quando há uma página só."
            props={[
              ['pagina', 'number', '', 'Página atual (1 em diante).'],
              ['total', 'number', '', 'Número de páginas.'],
              ['info', 'string', '', '"mostrando 26 a 50 de 112 viagens".'],
              ['aoIr', '(n: number) => void', '', 'Troca de página. Com TX.ui.paginar: aoIr={v.irPara}.'],
            ]}
            classes={<><Cod>.tx-paginacao</Cod>, <Cod>__info</Cod>, <Cod>__paginas</Cod>, <Cod>__pag</Cod> com <Cod>[aria-current=&quot;page&quot;]</Cod>, <Cod>__seta</Cod> com <Cod>:disabled</Cod>. Página com 32x32 (era 30).</>}
            sim={['Dentro de TabelaRodape.']}
            nao={['Rolagem infinita em lista de auditoria.']}
          >
            <div className="ds-pilha">
              <Paginacao pagina={pag} total={5} info={'mostrando ' + ((pag - 1) * 25 + 1) + ' a ' + Math.min(pag * 25, 112) + ' de 112 viagens'} aoIr={setPag} />
              <Paginacao pagina={1} total={1} info="mostrando 1 a 9 de 9 transportadores" aoIr={() => undefined} />
            </div>
          </Componente>

          <Componente
            id="vazio" nome="EstadoVazio" arquivo="src/components/ui/cartao.tsx"
            resumo="Lista sem resultado. O título diz o que não há; o texto diz o que fazer (ampliar período, limpar filtro). Sem ilustração."
            props={[
              ['titulo', 'ReactNode', '', 'O que não há.'],
              ['children', 'ReactNode', '', 'O que fazer.'],
              ['acao', 'ReactNode', '', 'Botão (Limpar filtros).'],
            ]}
            classes={<><Cod>.tx-vazio</Cod>, <Cod>__titulo</Cod>, <Cod>__texto</Cod>, <Cod>__acao</Cod>.</>}
            sim={['Texto específico da visão: "Nenhuma viagem esperando CT-e".']}
            nao={['"Nenhum resultado" genérico.', 'Ilustração ou emoji.']}
          >
            <Cartao lista>
              <EstadoVazio titulo="Nenhuma viagem esperando CT-e" acao={<Botao tamanho="p">Limpar filtros</Botao>}>Toda viagem carregada já está conciliada com o TMS.</EstadoVazio>
            </Cartao>
          </Componente>

          <Componente
            id="modal" nome="Modal" arquivo="src/components/ui/sobreposicao.tsx" fundo="liso"
            resumo="Ação curta sobre um registro (registrar ocorrência, enviar link, liberar por autoridade). O primário fica inativo enquanto falta algo, e o rodapé diz exatamente o quê (padrão Falta:). Clicar no primário inativo leva o foco ao primeiro campo que falta."
            props={[
              ['id', 'string', '', 'Base dos ids (título vira id-titulo, ligado por aria-labelledby).'],
              ['titulo / sub', 'ReactNode', '', 'Título de 16 px e explicação de uma linha.'],
              ['extra', 'ReactNode', '', 'Ao lado do título: Badge mono com o código ou Situacao.'],
              ['aoFechar', '() => void', '', 'Mostra o botão fechar e fecha no clique fora.'],
              ['tamanho', "'p' | 'm' | 'g' | 'xg'", "'m'", '440, 520, 600 ou 760 px.'],
              ['falta', 'string', '', 'Texto "Falta: ..." (use textoFalta). Vazio quando nada falta.'],
              ['acoes', 'ReactNode', '', 'Botões do rodapé: Cancelar e o primário.'],
              ['estatico', 'boolean', 'false', 'Desenha no fluxo (documentação).'],
            ]}
            classes={<><Cod>.tx-veu</Cod>, <Cod>.tx-modal</Cod> (+ <Cod>--p</Cod> | <Cod>--g</Cod> | <Cod>--xg</Cod>), <Cod>__cab</Cod>, <Cod>__titulos</Cod>, <Cod>__titulo-linha</Cod>, <Cod>__titulo</Cod>, <Cod>__sub</Cod>, <Cod>__corpo</Cod>, <Cod>__rodape</Cod>; <Cod>.tx-falta</Cod> com <Cod>aria-live=&quot;polite&quot;</Cod> antes dos botões. Esc fecha (TX.ui.montar); foco preso e devolvido (teclado.tsx).</>}
            sim={['Primário inativo com Falta: e foco no campo ao clicar.', 'Código da viagem ao lado do título.', 'Cancelar sempre à esquerda do primário.']}
            nao={['Formulário longo em modal (vai para a tela).', 'Modal sobre modal.', 'Fechar sem aviso quando há texto digitado.']}
          >
            <div className="ds-linha" style={{ marginBottom: 'var(--esp-4)' }}>
              <Botao variante="primario" onClick={() => setModal(true)}>Abrir modal de verdade</Botao>
              <span className="ds-nota" style={{ marginTop: 0 }}>Escolha o tipo e escreva 20 caracteres: o rodapé acompanha.</span>
            </div>
            <Modal
              id="ds-m1" estatico titulo="Registrar ocorrência" extra={<Badge tom="marca" mono>OC-24822</Badge>}
              sub="A ocorrência fica no histórico da viagem e conta no transportador." aoFechar={() => undefined}
              falta={faltaModal}
              acoes={<><Botao>Cancelar</Botao><Botao variante="primario" inativo={!!faltaModal}>Registrar</Botao></>}
            >
              <Escolhas id="ds-m1-tipo" rotulo="Tipo" itens={['Resíduo', 'Lona rasgada', 'Reclamação no destino'].map((n) => ({ n, k: n, on: tipo === n, onClick: () => setTipo(n) }))} />
              <Campo id="ds-m1-motivo" rotulo="Motivo" campo="motivo"><AreaTexto value={motivo} onChange={(e) => setMotivo(e.target.value)} /></Campo>
            </Modal>
            {modal ? (
              <Modal
                id="ds-m2" titulo="Enviar link ao motorista" sub="Ele recebe por SMS e responde pelo celular." aoFechar={() => setModal(false)} tamanho="p"
                acoes={<><Botao onClick={() => setModal(false)}>Cancelar</Botao><Botao variante="primario" onClick={() => { setModal(false); setToast(true); }}>Enviar link</Botao></>}
              >
                <Campo id="ds-m2-tel" rotulo="Celular com DDD" dica="O mesmo do cadastro do motorista."><Entrada mono defaultValue="(66) 99812-4410" /></Campo>
              </Modal>
            ) : null}
          </Componente>

          <Componente
            id="drawer" nome="Drawer" arquivo="src/components/ui/sobreposicao.tsx" fundo="liso"
            resumo="Detalhe de um cadastro sem sair da lista (Transportadores, Frota). Entra pela direita, 560 px, cabeçalho no degradê escuro."
            props={[
              ['id / titulo / sub', 'string / ReactNode', '', 'Título de 20 px e subtítulo.'],
              ['avatar', 'ReactNode', '', 'Iniciais no círculo.'],
              ['aoFechar', '() => void', '', 'Botão fechar e clique fora.'],
              ['rodape', 'ReactNode', '', 'Ações fixas embaixo.'],
              ['estatico', 'boolean', 'false', 'Desenha no fluxo (documentação).'],
            ]}
            classes={<><Cod>.tx-veu.tx-veu--lateral</Cod>, <Cod>.tx-drawer</Cod>, <Cod>__cab</Cod>, <Cod>__avatar</Cod>, <Cod>__titulos</Cod>, <Cod>__titulo</Cod>, <Cod>__sub</Cod>, <Cod>__corpo</Cod>, <Cod>__rodape</Cod>.</>}
            sim={['Linhas de par rótulo e valor (Linha) no corpo.']}
            nao={['Formulário de criação em drawer (é modal ou tela).']}
          >
            <Drawer id="ds-d1" estatico titulo="Transportes Araguaia" sub="TAC, RNTRC 048213977" avatar="TA" aoFechar={() => undefined} rodape={<><Botao>Revogar acesso</Botao><Botao variante="primario">Abrir cadastro</Botao></>}>
              <Linha rotulo="Certificação GMP+"><Situacao tom="ok" forma="selo">Válida até 03/2027</Situacao></Linha>
              <Linha rotulo="Ocorrências (90 dias)"><b className="num">2</b></Linha>
              <Linha rotulo="Convite"><Badge tom="info">enviado em 12/11</Badge></Linha>
            </Drawer>
          </Componente>

          <Componente
            id="toast" nome="Toast" arquivo="src/components/ui/sobreposicao.tsx"
            resumo="Confirma uma ação que deu certo e some em 4,2 s. Uma frase com o que foi feito. Na tela, use TX.ui.avisar(c, texto): a moldura desenha."
            props={[
              ['children', 'ReactNode', '', 'A frase.'],
              ['tom', "'ok' | 'erro'", "'ok'", 'erro só para falha de sistema (não de validação).'],
              ['estatico', 'boolean', 'false', 'Desenha no fluxo (documentação).'],
            ]}
            classes={<><Cod>.tx-toast</Cod>, <Cod>.tx-toast--erro</Cod>, <Cod>.tx-toast--estatico</Cod>, <Cod>.tx-toast__icone</Cod>. A moldura usa hoje <Cod>.mo-toast</Cod>, com o mesmo desenho.</>}
            sim={['"Ocorrência registrada na viagem OC-24822."']}
            nao={['Erro de validação em toast.', 'Dois toasts ao mesmo tempo.']}
          >
            <div className="ds-pilha" style={{ justifyItems: 'start' }}>
              <Toast estatico>Ocorrência registrada na viagem OC-24822.</Toast>
              <Toast estatico tom="erro">Não foi possível falar com o TMS. Tente de novo em 1 minuto.</Toast>
              <Botao onClick={() => setToast(true)}>Mostrar toast de verdade</Botao>
            </div>
            {toast ? <Toast>Link enviado ao motorista da OC-24822.</Toast> : null}
          </Componente>
        </Secao>

        <Secao id="regras" n="06" titulo="Regras gerais" intro="Resumo de DESIGN.md e das decisões da revisão de telas.">
          <div className="ds-regras">
            <div className="ds-regra ds-regra--sim">
              <h4>Fazer</h4>
              <ul>
                <li>Componente de <Cod>@/components/ui</Cod>; em .jsx, as classes <Cod>tx-</Cod>.</li>
                <li>Todo valor por token: cor, espaço, raio, sombra, texto.</li>
                <li>Situação com ponto, cor e rótulo juntos.</li>
                <li>Número com <Cod>.num</Cod>; código, placa e ordem em mono.</li>
                <li>Alvo de 32 px no escritório e 44 px no celular.</li>
                <li>Rótulo ligado ao campo; erro junto do campo, com a ação.</li>
                <li>Primário inativo diz o que falta e leva ao campo.</li>
                <li>Degradê da marca sempre em diagonal.</li>
                <li>Datas em DD/MM/AAAA, horas em HH:mm.</li>
              </ul>
            </div>
            <div className="ds-regra ds-regra--nao">
              <h4>Não fazer</h4>
              <ul>
                <li><Cod>style=&#123;&#123;...&#125;&#125;</Cod> com valor visual (só layout de página e <Cod>--tx-colunas</Cod>).</li>
                <li>Hex solto, <Cod>99px</Cod>, sombra preta.</li>
                <li><Cod>--aviso-2</Cod>, <Cod>--azul</Cod> ou <Cod>--texto-desab</Cod> como texto legível.</li>
                <li>Tamanho de fonte fora dos 7 passos; peso 500.</li>
                <li><Cod>{'<span role="button">'}</Cod> no lugar de <Cod>{'<button>'}</Cod>.</li>
                <li>Erro de validação em toast ou alert do navegador.</li>
                <li>Placeholder no lugar do rótulo.</li>
                <li>Mais de um primário na mesma área.</li>
                <li>Travessão, ponto médio e emoji em texto de interface.</li>
              </ul>
            </div>
          </div>
        </Secao>
      </div>
    </div>
  );
}
