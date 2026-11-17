# Traxium · Design System

Documento de referência para o design system do Traxium SaaS. Todas as decisões visuais e de interação seguem o que está descrito aqui. Quando houver dúvida entre o que está no código e o que está aqui, este documento prevalece e o código deve ser ajustado.

---

## 1. Princípios

1. **Clareza acima de estética.** O usuário gestor está olhando para um motor de risco regulatório. Cada tela responde rapidamente a duas perguntas: o que está acontecendo agora e o que exige ação imediata.
2. **Densidade calibrada.** O back-office é informacional. Tabelas, KPIs e listas têm densidade alta, mas com hierarquia tipográfica e espaçamento que evitam ruído.
3. **Sinal regulatório nunca ambíguo.** Status críticos (bloqueio, NC crítica, certificação vencida) usam cor, ícone e rótulo simultaneamente. Nunca dependem só de cor.
4. **Trust pelo dado, não pela decoração.** O sistema mostra origens de validação, timestamps, autores. Gradientes e animações são reservados para reforçar confiança em momentos-chave.
5. **Distintivo, não genérico.** Nenhuma tela deve parecer "qualquer outro SaaS". Tipografia ajustada, espaçamento ousado, micro-detalhes (números proporcionais, sombras coloridas, micro-gradientes).

---

## 2. Paleta

Fonte única: os tokens de `src/app/globals.css`. A página `/design-system` mostra cada um com o valor lido em execução, e a biblioteca do Figma usa os mesmos nomes. Contrastes medidos em `docs/ds/contraste.md`; evidência de cada valor em `docs/ds/inventario.md`.

### 2.1 Marca

| Token | Hex | Uso |
| --- | --- | --- |
| `--primario` | `#127670` | Teal primário. Foco, borda de campo ativo, aba ativa, início do degradê. |
| `--primario-2` | `#0C5862` | Link, ação em texto, chip escolhido, código. |
| `--primario-3` | `#093D44` | Ênfase máxima, início do degradê escuro, sidebar. |
| `--azul` | `#0E78B5` | Azul de apoio: fim do degradê e preenchimento informativo. Não é cor de texto. |
| `--primario-fraco` | `#eef7f6` | Fundo de chip, opção ou linha escolhida. |
| `--degrade-primario` | `135deg, #127670, #0e78b5` | Botão primário, caixa marcada, switch ligado. |
| `--degrade-escuro` | `130deg, --primario-3, --primario-2, --azul` | Cabeçalho do drawer, capa. |

### 2.2 Situação (funcionais)

Cada tom tem cor de texto (4,5:1 no branco e na `--superficie-2`), borda, fundo tingido e o par claro do ponto em degradê. Os tons são as chaves de `TX.ui.TOM`.

| Tom | Texto | Uso |
| --- | --- | --- |
| `ok` | `--ok` `#177d4c` | Pronta para assegurar, conforme. |
| `falta` | `--aviso` `#9a6210` (ponto `--aviso-2` `#e8a33d`) | Falta algo, pendência. |
| `bloqueio` | `--perigo` `#c43d3d` | Bloqueada, erro, ação destrutiva. |
| `tecnico` | `--tecnico` `#93313f` | Bloqueio técnico, nenhuma alçada libera. |
| `autoridade` | `--autoridade` `#a5502a` | Liberada por autoridade. |
| `info` | `--info` `#0c6ca3` | Em trânsito, informativo. |
| `na` | `--texto-apagado` | Sem declaração GMP+, cancelada. |

### 2.3 Superfície, texto e borda

| Token | Hex | Uso |
| --- | --- | --- |
| `--fundo` | `#f2f5f4` | Fundo da página. Não é branco puro: leve toque verde-azulado. |
| `--painel` | `#ffffff` | Cartão, modal, campo. |
| `--superficie`, `--superficie-2`, `--superficie-3` | `#f7faf9`, `#f0f4f3`, `#e4eae8` | Cabeçalho de tabela; botão secundário; hover do secundário. |
| `--texto` | `#0b2224` | Texto primário. |
| `--texto-2`, `--texto-sec`, `--texto-apagado` | `#3c4f4e`, `#526664`, `#5f7270` | Rótulo; descrição; legenda e cabeçalho de tabela. Todos 4,5:1 ou mais. |
| `--borda-suave`, `--borda`, `--borda-campo`, `--borda-forte` | `#eef2f1` a `#c9d5d3` | Divisória, cartão, campo, hover. |
| `--borda-controle` | `#7f9290` | Borda que é o único sinal do controle (caixa de seleção, switch). 3:1. |

### 2.4 Gradiente da marca

Sempre em diagonal (135 graus no primário, 130 no escuro). Uso restrito: logo, botão primário, controle marcado, cabeçalho do drawer, sidebar.

---

## 3. Tipografia

- **Família principal:** Hanken Grotesk (`--fonte`), pesos 400, 600, 700 e 800, carregada do Google Fonts no layout raiz.
- **Família monoespaçada:** Spline Sans Mono (`--fonte-mono`), pesos 500 e 600, para códigos de viagem, ordem, CT-e, placa, RNTRC, contador e tecla de atalho.
- As telas escrevem os nomes `'Hanken Grotesk'` e `'Spline Sans Mono'`; não trocar por `next/font` sem trocar os nomes.
- **Números:** sempre `font-variant-numeric: tabular-nums` (classe `.num`) em coluna e destaque.

### 3.1 Escala (7 passos)

| Token | Tamanho | Peso | Entrelinha | Uso |
| --- | --- | --- | --- | --- |
| `--tipo-rotulo` | 11 px | 800 | 1,3 | Rótulo em caixa alta (cabeçalho de tabela), tracking `--ls-rotulo` 0,7 px. |
| `--tipo-legenda` | 12 px | 600 | 1,4 | Legenda, rótulo de campo (800), dica, erro, chip, selo. |
| `--tipo-denso` | 13 px | 400 | 1,5 | Corpo denso: linha de tabela, subtítulo de modal. |
| `--tipo-corpo` | 14 px | 400 | 1,5 | Corpo e controles: campo, botão, aba. |
| `--tipo-titulo` | 16 px | 800 | 1,3 | Título de cartão, modal e estado vazio. |
| `--tipo-destaque` | 20 px | 800 | 1,2 | Número de destaque, título do drawer. |
| `--tipo-pagina` | 24 px | 800 | 1,2 | Título de página, tracking -0,2 px. |

32 e 40 px (`--fs-painel`, `--fs-painel-g`) só no número grande de painel. O Link do motorista usa 12, 14, 16, 20 e 24, com campo de 16 px. Parágrafo: `--lh-paragrafo` 1,55. Classes: `.tx-tipo-*` e `.tx-peso-*`.

### 3.2 Regras

- Títulos sempre alinhados à esquerda.
- Códigos técnicos (ordem, placa, CT-e, RNTRC) em monoespaçada.
- Nunca usar mais de 3 níveis hierárquicos em uma página.
- Rótulo em caixa alta sempre com `--ls-rotulo`.

---

## 4. Espaçamento e alturas

Base 4: `--esp-1` (4) a `--esp-12` (48), com `--esp-0-5` (2), `--esp-1-5` (6) e `--esp-2-5` (10). 6 e 10 existem por serem o ritmo de chips e listas; 7 e 9 não existem.

- Página: `.tx-pagina`, padding 24 / 32 / 48, gap 16 entre blocos.
- Cartão: padding 20 / 24. Linha de tabela: 12 / 20.
- Controles: `--controle-p` 32 px (alvo mínimo do escritório), `--controle-m` 40 px (botão e campo), `--controle-mobile` 44 px (celular).

---

## 5. Raio, elevação, camada e movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--raio-xxs` | 4 px | Barra fina. |
| `--raio-xs` | 6 px | Tecla, código em linha, caixa de seleção. |
| `--raio-p` | 8 px | Ação em texto, página da paginação, item de menu. |
| `--raio-m` | 12 px | Campo, botão de contorno, linha dentro de cartão. |
| `--raio-g` | 16 px | Popover, opção com descrição, aviso. |
| `--raio-xg` | 20 px | Cartão. |
| `--raio-xxg` | 24 px | Modal. |
| `--raio-pilula` | 999 px | Botão, chip, selo, toast. |

Sombras tingidas com a marca, nunca preto: `--sombra-xs` (campo de busca), `--sombra-p` (hover de cartão), `--sombra-m` (popover), `--sombra-g` (sidebar), `--sombra-xg` (modal), `--sombra-drawer`, `--sombra-toast`, `--sombra-cta`, `--sombra-cta-p`, `--sombra-perigo`.

Camadas: `--z-fixo` 5, `--z-cabecalho` 35, `--z-sidebar` 40, `--z-pop` 60, `--z-menu` 80, `--z-busca` 90, `--z-drawer` 900, `--z-modal` 1000, `--z-toast` 1200. Durações: `--dur-rapida` 0,15 s, `--dur-media` 0,2 s, `--dur-lenta` 0,3 s, `--dur-carga` 1,3 s; tudo para com `prefers-reduced-motion`.

---

## 6. Componentes

Código em `src/components/ui` (importar de `@/components/ui`), estilo em `src/components/ui/ui.css`, classes `tx-` em BEM. Referência viva com todas as variantes e estados: `/design-system`. Troca do estilo inline das telas: `docs/ds/guia-migracao.md`.

| Componente | Variantes e estados |
| --- | --- |
| `Botao` | primario, secundario, contorno, perigo, texto, icone; tamanhos p (32) e m (40); hover, foco, inativo (aria-disabled, ainda clicável para levar ao que falta), desabilitado, carregando. 44 px no celular. |
| `Campo` + `Entrada`, `AreaTexto`, `Selecao`, `CampoData`, `EntradaCaixa` | rótulo ligado, dica, erro com aria-invalid e aria-describedby, opcional, mono, data DD/MM/AAAA. |
| `Checkbox`, `Switch` | marcado, inválido, desabilitado; input nativo. |
| `Chip`, `Escolhas`, `OpcaoCartao` | opção (rádio), filtro (escuro quando ligado), inativo, grupo com erro. |
| `Situacao` | 7 tons de `TX.ui.TOM`; forma ponto (tabela) e selo; motivo embaixo. |
| `Badge` | neutro, marca, ok, aviso, perigo, tecnico, info, autoridade; mono, contador, cheio. |
| `Aviso` | info, ok, aviso, perigo, tecnico; título, ação. |
| `Abas` | ativa, contador, botão ou link. |
| `Tabela` | cabeçalho, linha (link, botão), hover, selecionada, esqueleto, vazio, rodapé. |
| `Paginacao`, `EstadoVazio`, `Cartao`, `Linha`, `CabecalhoPagina` | |
| `Modal` | p, m, g, xg; rodapé com o padrão "Falta:". |
| `Drawer`, `Toast` | |

Status de viagem combina ponto, rótulo e cor. Sempre os três sinais, nunca só cor.

---

## 7. Layout

### 7.1 Shell

- Sidebar fixa de 260px à esquerda. Fundo `ink` (HSL 195 30% 8%).
- Topbar de 60px com seletor de tenant (inicial colorido), busca global com atalho ⌘K, Copilot pill, notificações com badge, avatar.
- Conteúdo com `flex-1` em fundo `bg` (HSL 180 14% 97%, levemente azul-acinzentado, não branco puro).

### 7.2 Sidebar

- Logo Traxium light no topo com pill "Compliance"
- Grupos: Operação, Cadastros, EUDR · TRACES NT, Compliance, Sistema
- Item ativo: fundo `white/[0.07]` + barra indicadora à esquerda (gradiente).
- Badges com contagem (NCs em vermelho, contadores normais em branco translúcido).
- Footer: card do tenant ativo com iniciais coloridas + chevron de troca.

---

## 8. Mapas (Leaflet)

- Provider padrão: OpenStreetMap
- Alternativos via control: Esri Satellite, OpenTopoMap, Carto Light
- Polígonos de fazenda: cor por risco EUDR (verde/laranja/vermelho)
- Polígono selecionado: opacity 0.35, weight 3
- Polígonos não-selecionados: opacity 0.18, weight 2
- Polígonos com desmatamento pós-2020: borda dashed
- Marcadores: pin custom SVG colorido por risco
- Filtros CSS sutis no tile pane: saturate(0.85) brightness(1.02)

---

## 9. Iconografia

Ícones próprios em SVG inline, não uma biblioteca. Fonte: `src/components/moldura/icones.tsx` (sidebar e logo, função `Icone({ k })`) e os SVG dos componentes de `src/components/ui` (fechar, visto, alerta, menu de linha, tipo de empresa). `lucide-react` está instalado mas não é usado nas telas; não misture.

Regras do desenho:

- Grade de 16 x 16 (`viewBox="0 0 16 16"`), `fill="none"`, `stroke="currentColor"`, pontas e junções arredondadas.
- Traço de 1,6 na sidebar e nos ícones de 16 px. Ícones de 12 a 14 px dentro de componente (fechar, visto do toast, alerta do aviso) usam 1,8 a 2, para não sumir no tamanho menor.
- Cor sempre herdada (`currentColor`); o ícone nunca carrega cor de situação sozinho.
- Decorativo leva `aria-hidden`; ícone que é o único conteúdo de um botão leva `aria-label` no botão.

| Conceito | Chave em `Icone` |
| --- | --- |
| Hoje | `hoje` |
| Viagens | `viagens` |
| Transportadores | `transportadores` |
| Frota própria | `frota` |
| Auditoria | `auditoria` |
| Cadastros | `cadastros` |
| Configurações | `config` |
| Link do motorista / protótipo mobile | `link` |
| Voltar | `anterior` |
| Marca | `logo` |

Tipo de empresa (fornecedor, transportadora) em listas: componente `IconeTipo` de `src/components/ui/identidade.tsx`, 16 px, cinza.

--- | --- |
| Dashboard | `LayoutDashboard` |
| Viagens | `Truck` |
| Frota | `Container` |
| Motoristas | `IdCard` |
| Checklists | `ClipboardCheck` |
| Fazendas | `Trees` |
| Lotes / DDS | `PackageCheck` |
| Gateway TRACES | `Database` |
| Auditoria | `ShieldCheck` |
| NC / Bloqueios | `AlertOctagon` |
| Documentos | `FileText` |
| Atividade | `Activity` |
| Mobile preview | `Smartphone` |
| Configurações | `Settings` |
| Compliance | `BadgeCheck` |
| AI/Motor | `Sparkles` |

---

## 10. Voz e tom

- Português brasileiro, formal-direto. Sem gírias, sem emoji decorativo.
- Termos regulatórios sempre em forma canônica: GMP+ FSA, EUDR, TRACES NT, LCI, DDS, CAR, IDTF, FSMS, tractionair, T-3.
- Datas no formato `dd/MM/yyyy`. Horários `HH:mm`.
- Mensagens de bloqueio sempre incluem causa + ação.

Exemplo de mensagem de bloqueio:

> Carga bloqueada. A última carga registrada para o compartimento PHC-2B17 foi defensivo agrícola líquido em 22/05. A IDTF determina regime D (Desinfecção) antes do carregamento atual. Limpeza correspondente não foi evidenciada.

---

## 11. Padrões de página

Toda página segue:

1. **Page header** — título, descrição, accessory pill, ações primárias à direita.
2. **Stats row** — KPIs ou métricas-chave.
3. **Filtros / abas** — quando aplicável.
4. **Conteúdo principal** — tabela, grid de cards ou mapa.
5. **Conteúdo secundário** — relacionado ou recomendações.

---

## 12. Micro-detalhes que separam o produto de um template

- Sombras coloridas (brand-tinted) em vez de preto puro
- Bordas em HSL 200 (toque azul) em vez de cinza neutro
- Números sempre tabular (`.num`)
- Uppercase labels com tracking acima de 0.12em
- Gradientes da marca em diagonal 135° (não horizontal)
- Sidebar com grid pattern overlay sutil (opacity 0.025)
- Página fundo levemente verde-azulado (HSL 180 14% 97%) em vez de branco puro
- Pulse-ring animation em estados "atual" (T-3 sequencing)
- Sparklines em KPIs
- Hover de card eleva sombra mas mantém borda
- Botão gradient com hover sutil de translate-y -1px

---

## 13. Estados

Cada componente tem: repouso, hover, foco (contorno de 2 px em `--primario`), inativo ou desabilitado (`--borda-suave` com `--texto-desab`, sem opacidade), carregando (esqueleto ou giro), vazio (título e o que fazer, sem ilustração) e erro (junto do campo).

---

## 14. Acessibilidade

- Contraste mínimo 4,5:1 para texto em todos os pares de cor e 3:1 para borda que é o único sinal de um controle (`docs/ds/contraste.md`).
- Alvo de clique de 32 px no escritório e 44 px no celular.
- Foco visível em todos os controles interativos.
- Labels associadas a inputs via `htmlFor`.
- Botões só com ícone têm `aria-label`.
- Modais bloqueiam scroll e devolvem foco ao trigger.
- Ícones decorativos têm `aria-hidden`.

---

## 15. Decisões registradas

- **Sem dark mode** nesta primeira versão (foco no ambiente diurno do gestor).
- **Sidebar escura** é proposital: ancoragem visual e contraste com a área de trabalho clara.
- **Multi-tenant** é representado por seletor explícito no topbar, com initials coloridas, não por subdomínio.
- **Mapa real** (Leaflet + OSM + Esri Satellite) substitui SVGs estáticos.
- **Polígonos de fazenda** têm pelo menos 15 vértices para parecer realista.
- **Tipografia** Hanken Grotesk e Spline Sans Mono (o que está no ar desde o protótipo), com letter-spacing negativo sutil só no título de página. Geist foi descartada em 17/11/2026 para não divergir do código.
- **Não usar emojis** decorativos exceto onde regulatoriamente justificado.
