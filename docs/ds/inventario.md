# Inventário de estilo das telas

Levantamento de 17/11/2026, antes da migração para o design system. Fontes lidas: `src/telas/*.jsx` (10 telas), `src/lib/tx/tx-ui.js`, `src/components/moldura/moldura.css` e `src/telas/estados.css`. Contagem por script: cada par `propriedade: 'valor'` dos objetos `style={{...}}` e cada declaração dos .css; cores contadas em qualquer lugar do texto (hex e rgba). Valores calculados em tempo de execução (por exemplo `background: v.ctaBg`) entram pelo helper que os gera (`TX.ui.cta`, `chip`, `sel`, `TOM`).

Total: 1.394 objetos de estilo inline nas telas (a contagem de padrões da seção 2, refeita horas depois, achou 1.329: entre uma e outra entraram os commits da frente mobile, que mexeram no Link do motorista). As tabelas abaixo são a evidência das decisões em `src/app/globals.css`.

## 1. Resumo e decisões

| Grupo | O que o código tinha | Decisão (token) |
| --- | --- | --- |
| Tamanho de fonte | 13 (253), 12 (223), 14 (152), 16 (64), 11 (52), 20 (12), 24 (10); fora da escala só na moldura (13,5; 12,5; 11,5; 10,5; 10; 17) e 32/40 no painel de Hoje | Escala de 7 passos: `--fs-rotulo` 11, `--fs-legenda` 12, `--fs-denso` 13, `--fs-corpo` 14, `--fs-titulo` 16, `--fs-destaque` 20, `--fs-pagina` 24; `--fs-painel` 32 e `--fs-painel-g` 40. Os meios-pixels da moldura ficam registrados para a migração da moldura |
| Peso | 800 (263), 700 (155), 600 (48), 500 (2) | 400, 600, 700, 800. 500 sai (2 usos viram 600) |
| Entrelinha | 1,5 (20), 1,55 (15), 1,45 (9), 1,4 (3), 1,6 (2), 1,35 (1) | Por passo (`--lh-*`) e `--lh-paragrafo` 1,55 para parágrafo; 1,45 e 1,6 viram 1,5 ou 1,55 |
| Raio | 99 (195), 20 (48), 11 (45), 12 (40), 14 (24), 16 (22), 9 (17), 13 (11), 22 (10), 6/8/10/24 (8 cada), 18 e 15 (6), 7 (4), 3 (3), 5 (1) | `--raio-xxs` 4, `--raio-xs` 6, `--raio-p` 8, `--raio-m` 12, `--raio-g` 16, `--raio-xg` 20, `--raio-xxg` 24, `--raio-pilula` 999. 3 e 5 viram 4; 7 e 9 viram 8; 10, 11 e 13 viram 12; 14 e 15 viram 16; 18 e 22 viram 20 |
| Vão (gap) | 10 (83), 8 (65), 12 (40), 16 (39), 6 (36), 7 (32), 20 (11), 9 (10), 5 (9) | Escala base 4 (`--esp-1` 4 a `--esp-12` 48). 7 vira 8; 9 vira 8 (ou 10 quando é o vão entre itens que já usam 10); 5 vira 4 ou 6. 6 e 10 ficam como `--esp-1-5` e `--esp-2-5` porque juntos somam 119 usos e marcam ritmo próprio (chips e listas) |
| Padding | `9px 12px` (39, campo), `20px 24px` (22, cartão), `10px 20px` (21) e `10px 22px` (17) (botões), `16px 20px` (14), `24px 32px 48px` (9, página) | Campo: altura `--controle-m` 40 e padding 8/12; botão: 40 de altura e 20 dos lados (22 vira 20); cartão 20/24; página 24/32/48 |
| Sombra | 23 valores distintos, todos tingidos da marca menos um `rgba(0,0,0,.08)` | `--sombra-xs`, `-p`, `-m`, `-g`, `-xg`, `-drawer`, `-toast`, `-cta`, `-cta-p`, `-perigo`. As variações de opacidade .14/.18/.22 do popover viram `--sombra-m`; .25/.28/.3 do botão pequeno viram `--sombra-cta-p`; o preto vira `--sombra-xs` |
| Camada (z-index) | 1000 (8), 60 (7), 5 (2), 80 (2), 35, 40, 50, 90, 900, 1200 | `--z-base` 1, `--z-fixo` 5, `--z-cabecalho` 35, `--z-sidebar` 40, `--z-pop` 60, `--z-menu` 80, `--z-busca` 90, `--z-drawer` 900, `--z-modal` 1000, `--z-toast` 1200. 50 (Link) vira `--z-pop` |
| Duração | .15s, .2s, .25s, .3s, .4s; esqueleto 1,3s | `--dur-rapida` .15, `--dur-media` .2, `--dur-lenta` .3, `--dur-carga` 1,3. .25 vira .2 ou .3; .4 (barra de progresso) vira .3 |
| Cor | 134 cores soltas além dos tokens | Ver seção 3: quase-duplicatas recolhidas, cores de situação viraram tokens |
| Tracking | .8px (10), .7px (6), 1,4px (4), 1,6px (2) e outros 6 | `--ls-rotulo` .7px para rótulo em caixa alta; `--ls-pagina` -.2px. 1,4 e 1,6 ficam só na moldura (grupo da sidebar) |

## 2. Padrões repetidos (assinatura do objeto de estilo, sem propriedades de layout)

Cada linha é um objeto de estilo idêntico que se repete. É daqui que saíram os componentes.

| usos | estilo | telas |
| ---: | --- | --- |
| 44 | `fontSize:16px; fontWeight:800` | Auditoria, Cadastros, Compartimento, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 40 | `borderRadius:99px` | Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 23 | `color:var(--texto-apagado); fontSize:12px` | Auditoria, Cadastros, Compartimento, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 18 | `fontSize:14px; fontWeight:800` | Hoje, Transportadores, Viagem, Viagens |
| 17 | `gap:10px` | Cadastros, Frota, Hoje, Viagem |
| 16 | `fontSize:13px; fontWeight:700` | Auditoria, Cadastros, Configuracoes, Hoje, Transportadores, Viagem, Viagens |
| 15 | `gap:16px` | Auditoria, Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 15 | `color:var(--texto-sec); fontSize:13px` | Auditoria, Cadastros, Compartimento, Configuracoes, Hoje, Transportadores, Viagem, Viagens |
| 15 | `color:var(--texto-2); fontSize:12px; fontWeight:800` | Cadastros, Configuracoes, Transportadores, Viagem |
| 15 | `gap:8px; marginTop:16px` | Cadastros, Configuracoes, Frota, Transportadores, Viagem, Viagens |
| 15 | `background:var(--superficie-2); borderRadius:99px; fontSize:14px; fontWeight:700; padding:10px 20px` | Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 15 | `borderRadius:99px; fontSize:14px; fontWeight:800; padding:10px 22px` | Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 14 | `color:var(--texto-sec); fontSize:12px` | Cadastros, Configuracoes, Hoje, Viagem, Viagens |
| 12 | `color:var(--texto-sec)` | Cadastros, Compartimento, Transportadores, Viagem |
| 11 | `gap:12px` | Auditoria, Compartimento, Configuracoes, Frota, Hoje, Transportadores, Viagem |
| 11 | `background:var(--painel); border:1px solid var(--borda); borderRadius:20px; padding:20px 24px` | Cadastros, Compartimento, Hoje, Viagem |
| 11 | `color:var(--texto-2); fontSize:12px; fontWeight:800; marginTop:12px` | Cadastros, Configuracoes, Transportadores, Viagem |
| 10 | `gap:10px; marginLeft:auto` | Auditoria, Cadastros, Compartimento, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 10 | `fontFamily:Spline Sans Mono,monospace` | Auditoria, Cadastros, Transportadores, Viagens |
| 10 | `color:var(--texto-sec); fontSize:13px; marginTop:3px` | Auditoria, Cadastros, Configuracoes, Viagem |
| 9 | `minHeight:100%` | Auditoria, Cadastros, Compartimento, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 9 | `gap:8px` | Auditoria, Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem |
| 9 | `fontSize:14px; fontWeight:700` | Compartimento, Configuracoes, Frota, Viagem, Viagens |
| 9 | `borderRadius:99px; fontSize:13px; fontWeight:700; padding:6px 14px` | Hoje, Transportadores, Viagem |
| 8 | `gap:6px; marginTop:10px` | Auditoria, Hoje, Transportadores, Viagem |
| 8 | `fontWeight:700` | Cadastros, Compartimento, Transportadores, Viagem, Viagens |
| 8 | `fontSize:13px` | Cadastros, Compartimento, Configuracoes, Transportadores, Viagem |
| 8 | `color:var(--texto-2); fontSize:12px; fontWeight:800; marginTop:16px` | Frota, Viagem |
| 8 | `fontFamily:Spline Sans Mono,monospace; fontSize:13px; fontWeight:600` | Hoje, Viagem, Viagens |
| 7 | `color:var(--texto-sec); fontSize:14px; marginTop:2px` | Auditoria, Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagens |
| 7 | `color:var(--primario-2); fontSize:12px; fontWeight:800` | Auditoria, Hoje, Transportadores, Viagem, Viagens |
| 7 | `background:var(--superficie-2); borderRadius:99px; fontSize:13px; marginLeft:auto` | Cadastros, Configuracoes, Frota, Hoje, Transportadores, Viagem, Viagens |
| 7 | `background:var(--painel); border:1px solid var(--borda); borderRadius:20px; padding:20px 24px; scrollMarginTop:24px` | Configuracoes |
| 7 | `background:var(--painel); border:1px solid var(--borda); borderRadius:20px; padding:20px` | Hoje, Viagem |
| 7 | `border:1px solid var(--borda-campo); borderRadius:11px; fontFamily:Spline Sans Mono,monospace; fontSize:14px; marginTop:6px; outline:none; padding:9px 12px` | Hoje, Transportadores, Viagem |
| 6 | `gap:16px; padding:24px 32px 48px` | Auditoria, Cadastros, Configuracoes, Frota, Transportadores, Viagens |
| 6 | `fontSize:24px; fontWeight:800` | Auditoria, Configuracoes, Frota, Hoje, Transportadores, Viagens |
| 6 | `borderRadius:9px; fontSize:13px; gap:10px; padding:8px 11px` | Auditoria, Cadastros, Viagens |
| 6 | `color:var(--texto-apagado)` | Cadastros, Transportadores, Viagem, Viagens |
| 6 | `fontSize:13px; fontWeight:800` | Cadastros, Hoje, Viagem, Viagens |
| 6 | `color:var(--texto-sec); fontFamily:Spline Sans Mono,monospace; fontSize:12px` | Cadastros, Hoje, Viagem |
| 6 | `backdropFilter:blur(3px); background:rgba(9,34,36,.45); inset:0; padding:32px; zIndex:1000` | Cadastros, Configuracoes, Frota, Transportadores, Viagem, Viagens |
| 6 | `color:var(--texto-sec); fontSize:13px; lineHeight:1.55; marginTop:4px` | Cadastros, Configuracoes, Frota, Transportadores, Viagem, Viagens |
| 6 | `fontSize:12px` | Compartimento, Frota, Hoje, Transportadores, Viagem |
| 6 | `marginTop:10px` | Configuracoes, Hoje, Viagem, Viagens |

Leitura dos padrões e o componente que os substitui:

| Padrão | Evidência | Componente |
| --- | --- | --- |
| Título de cartão 16/800 | 50 objetos iguais em 10 telas | `Cartao titulo` ou `.tx-cartao__titulo`; `.tx-tipo-titulo` |
| Botão secundário `--superficie-2`, 99, 14/700, 10px 20px | 15 | `Botao variante="secundario"` |
| Botão primário 14/800, 99, 10px 22px com `TX.ui.cta` | 15, mais 17 com `cta(...)` | `Botao variante="primario" inativo={!ok}` |
| Botão de contorno `--painel`, borda `--borda-campo`, raio 11, hover `.tx-h30bbaa9` | 11 | `Botao variante="contorno"` |
| Botão pequeno 13/700, 6px 14px | 9 | `Botao tamanho="p"` |
| Rótulo de campo 12/800 `--texto-2` (com marginTop 12 ou 16) | 35 | `Campo` (gera `.tx-campo__rotulo`) |
| Campo `--borda-campo`, raio 11, 9px 12px, 14 px | 39 (7 em mono) | `Entrada`, `AreaTexto`, `Selecao`, `CampoData` (`.tx-entrada`) |
| Cartão `--painel`, borda `--borda`, raio 20, 20px 24px | 18 (mais 7 com padding 20) | `Cartao` (`.tx-cartao`) |
| Véu `rgba(9,34,36,.45)` com blur 3, zIndex 1000 | 6 telas | `Modal` (`.tx-veu` + `.tx-modal`) |
| Legenda 12 `--texto-apagado` | 23 | `.tx-tabela__sub`, `.tx-campo__dica`, `.tx-apagado` |
| Cabeçalho de página 24/800 + subtítulo 14 `--texto-sec` | 9 telas | `CabecalhoPagina` dentro de `.tx-pagina` |
| Cabeçalho de tabela 11/800 .7px `--texto-apagado` em `--superficie` | 5 telas | `TabelaCabecalho` |
| Linha de tabela 12px 20px com divisória `--superficie-2`, hover `.tx-h894fca3` | 9 hovers | `TabelaLinha` |
| Selo pílula com borda (12/700, 2px 9px ou 3px 10px) | 6 + selos de situação | `Badge`, `Situacao forma="selo"` |
| Chip de filtro escuro (`TX.ui.chip`) | 14 chamadas | `Chip tipo="filtro"` |
| Opção em cartão (`TX.ui.sel`) | 12 chamadas | `OpcaoCartao` |
| Caixa de seleção 19x19, raio 6, borda 2 `--borda-forte` | Auditoria | `Checkbox` |
| Esqueleto com `txsh 1.3s` | 7 | `TabelaEsqueleto`, `.tx-esqueleto` |
| Vazio 48px 20px, título 16/800, texto 13 `--texto-sec` | Viagens, Transportadores, Frota | `EstadoVazio` |
| Paginação com página 30x30 raio 9 e setas | Viagens, Transportadores, Auditoria | `Paginacao` (página passa a 32x32) |
| Drawer 560 px, cabeçalho em degradê escuro | Transportadores, Frota | `Drawer` |
| Caixa tingida (`--perigo-fundo`, `--aviso-borda`, `--info-borda`) | Transportadores, Viagem, Link | `Aviso` |

## 3. Cores

### 3.1 Uso dos tokens existentes (quantas vezes cada `var(--...)` aparece)

| token | usos |
| --- | ---: |
| `--texto-sec` | 142 |
| `--texto-apagado` | 120 |
| `--painel` | 105 |
| `--texto-2` | 77 |
| `--borda` | 72 |
| `--borda-campo` | 63 |
| `--superficie-2` | 58 |
| `--primario` | 56 |
| `--perigo` | 50 |
| `--primario-2` | 50 |
| `--borda-suave` | 48 |
| `--texto` | 42 |
| `--azul` | 42 |
| `--superficie` | 40 |
| `--ok` | 34 |
| `--aviso` | 26 |
| `--aviso-2` | 24 |
| `--borda-forte` | 17 |
| `--primario-fraco` | 13 |
| `--primario-3` | 12 |
| `--perigo-borda` | 12 |
| `--tecnico` | 9 |
| `--aviso-borda` | 7 |
| `--ok-borda` | 6 |
| `--perigo-fundo` | 3 |
| `--texto-desab` | 3 |
| `--info-borda` | 2 |
| `--fonte-mono` | 2 |
| `--superficie-hover` | 2 |
| `--sb-fundo` | 1 |
| `--sb-texto` | 1 |
| `--sb-ativo` | 1 |
| `--fundo-fundo` | 1 |
| `--fundo` | 1 |

### 3.2 Quase-duplicatas recolhidas

| Valores soltos | Vira | Diferença |
| --- | --- | --- |
| `#e4ebe9` (hover do secundário, 6) | `--superficie-3` (`#e4eae8`, mesmo valor de `--borda`) | 1 unidade no verde |
| `#fafcfb`, `#fbfdfc`, `#f7f9f8` | `--superficie` `#f7faf9` | imperceptível |
| `#f3faf8` (linha marcada) | `--primario-fraco` `#eef7f6` | imperceptível |
| `#eef4f2` (hover) | `--superficie-2` | imperceptível |
| `#fdf8f8`, `#fdf1f1` | `--perigo-fundo` `#fdf6f6` | imperceptível |
| `#e2e9e7`, `#e8eef0`, `#dfeaea` | `--borda` | imperceptível |
| `#d9e5e3`, `#d8e4e2`, `#b9c9c6`, `#b8c6c4` | `--borda-forte` | os dois últimos são mais escuros; quando marcam controle, vão para `--borda-controle` |
| `#cfe3ee` | `--info-borda` `#cfe1ef` | imperceptível |
| `#cfe3e1` (6) | `--primario-borda` (novo) | era hex solto |
| `#7c8f8d` (7, texto) | `--texto-apagado` | reprovava em contraste |
| `#127670`, `#0b2224`, `#c43d3d`, `#0C5862`, `#f6f9f8`, `#f7faf9`, `#f0f4f3` escritos em hex | o token de mesmo valor | o conversor escreveu o valor no lugar do nome |
| `#48c78e`, `#f4c15d`, `#e46969`, `#5b8def`, `#7d2232`, `#d97544`, `#b85a2e`, `#f0d3bf`, `#ebc3c8`, `#dde5e3` | `--ok-claro`, `--aviso-claro`, `--perigo-claro`, `--info-claro`, `--tecnico-escuro`, `--autoridade-2`, `--autoridade`, `--autoridade-borda`, `--tecnico-borda`, `--neutro-ponto` | eram hex soltos em `TX.ui.TOM` e nas telas |
| `rgba(9,34,36,.45)` (9) | `--veu` | era hex solto |
| `#fff` como fundo (117 usos de `#fff`, a maioria fundo) | `--painel`; como texto sobre a marca, `--texto-inverso` | |

Cores que ficam fora dos tokens de propósito: a paleta das cores de veículo no desenho do caminhão (Viagem, LinkDaViagem: `#2f5d73`, `#8b6f4e` e afins) e a paleta amarela de placa Mercosul (`#f1d55a`, `#e3c235`, `#5b4b05`). São ilustração, não interface; ficam no componente que desenha.

### 3.3 Todas as cores soltas encontradas


| cor | usos | onde |
|---|---:|---|
| `#fff` | 117 | Auditoria 7, Cadastros 7, Compartimento 8, Configuracoes 4, Frota 7, Hoje 12, LinkDaViagem 10, Transportadores 6, Viagem 33, Viagens 3, tx-ui 6, moldura 13, estados 1 |
| `#48c78e` | 16 | Cadastros 1, Compartimento 1, Frota 1, Hoje 5, LinkDaViagem 2, Viagem 4, tx-ui 1, moldura 1 |
| `rgba(255,255,255,.7)` | 14 | Auditoria 3, Compartimento 4, Hoje 1, LinkDaViagem 2, Viagem 2, moldura 2 |
| `#f4c15d` | 14 | Cadastros 1, Compartimento 1, Frota 2, Hoje 3, Viagem 5, tx-ui 2 |
| `#e46969` | 12 | Cadastros 1, Compartimento 1, Frota 1, Hoje 2, Viagem 3, tx-ui 2, moldura 2 |
| `rgba(255,255,255,.08)` | 9 | Auditoria 1, Compartimento 1, Hoje 1, Viagem 3, moldura 3 |
| `rgba(9,34,36,.45)` | 9 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 2, Viagem 1, Viagens 1, moldura 1 |
| `rgba(255,255,255,.6)` | 9 | Compartimento 3, Hoje 2, Viagem 3, moldura 1 |
| `rgba(18,118,112,.3)` | 8 | Cadastros 1, Hoje 1, Transportadores 1, Viagem 5 |
| `rgba(9,61,68,.16)` | 8 | Cadastros 1, Hoje 1, Viagem 1, Viagens 4, moldura 1 |
| `#127670` | 8 | Cadastros 1, Viagens 4, moldura 1, estados 2 |
| `rgba(9,34,36,.4)` | 8 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `#7c8f8d` | 7 | Cadastros 2, Hoje 1, Transportadores 1, Viagens 3 |
| `rgba(255,255,255,.14)` | 7 | Hoje 2, LinkDaViagem 2, moldura 2, estados 1 |
| `rgba(255,255,255,.1)` | 6 | Auditoria 1, LinkDaViagem 1, Transportadores 1, Viagem 1, moldura 2 |
| `#cfe3e1` | 6 | Cadastros 1, Compartimento 1, LinkDaViagem 1, Viagem 1, Viagens 1, moldura 1 |
| `#b85a2e` | 6 | Hoje 3, Viagem 1, Viagens 1, tx-ui 1 |
| `#e4ebe9` | 6 | Hoje 2, moldura 2, estados 2 |
| `#c43d3d` | 6 | moldura 2, estados 4 |
| `rgba(255,255,255,.2)` | 5 | Auditoria 1, Viagem 3, moldura 1 |
| `rgba(255,255,255,.15)` | 5 | Compartimento 4, Hoje 1 |
| `#f1d55a` | 4 | Cadastros 1, Compartimento 1, Frota 1, Viagem 1 |
| `#e3c235` | 4 | Cadastros 1, Compartimento 1, Frota 1, Viagem 1 |
| `#5b4b05` | 4 | Cadastros 1, Compartimento 1, Frota 1, Viagem 1 |
| `#e88a5f` | 4 | Cadastros 1, Compartimento 1, Frota 1, Viagem 1 |
| `#d06a3c` | 4 | Cadastros 1, Compartimento 1, Frota 1, Viagem 1 |
| `#3ddc97` | 4 | Compartimento 2, moldura 2 |
| `rgba(18,118,112,.25)` | 4 | Configuracoes 1, Hoje 1, Viagem 1, Viagens 1 |
| `#f0d3bf` | 4 | Hoje 2, Viagem 1, tx-ui 1 |
| `rgba(255,255,255,.55)` | 4 | Hoje 1, Viagem 1, moldura 1, estados 1 |
| `#d97544` | 4 | Viagem 2, Viagens 1, tx-ui 1 |
| `rgba(232,163,61,.2)` | 4 | Viagem 3, tx-ui 1 |
| `rgba(255,255,255,.22)` | 3 | Auditoria 1, LinkDaViagem 1, moldura 1 |
| `rgba(255,255,255,.12)` | 3 | Compartimento 2, Transportadores 1 |
| `#6e1f2b` | 3 | Compartimento 2, Viagem 1 |
| `#b8c6c4` | 3 | Compartimento 2, Viagem 1 |
| `rgba(255,255,255,.75)` | 3 | Compartimento 1, Hoje 1, Viagem 1 |
| `rgba(255,255,255,.18)` | 3 | Compartimento 1, Transportadores 1, Viagem 1 |
| `#2f5d73` | 3 | LinkDaViagem 1, Viagem 2 |
| `#33657c` | 3 | LinkDaViagem 1, Viagem 2 |
| `#8a9aa0` | 3 | LinkDaViagem 1, Viagem 2 |
| `#4c5c62` | 3 | LinkDaViagem 1, Viagem 2 |
| `#c46a2a` | 3 | LinkDaViagem 1, Viagem 2 |
| `#d07a34` | 3 | LinkDaViagem 1, Viagem 2 |
| `#5d7a7a` | 3 | LinkDaViagem 1, Viagem 2 |
| `#3f5757` | 3 | LinkDaViagem 1, Viagem 2 |
| `#8b6f4e` | 3 | LinkDaViagem 1, Viagem 2 |
| `#957857` | 3 | LinkDaViagem 1, Viagem 2 |
| `rgba(255,255,255,.16)` | 3 | LinkDaViagem 1, Viagem 1, estados 1 |
| `#0b2224` | 3 | LinkDaViagem 1, estados 2 |
| `rgba(9,34,36,.35)` | 3 | LinkDaViagem 1, Transportadores 1, moldura 1 |
| `#e2e9e7` | 3 | Viagem 3 |
| `rgba(255,255,255,.25)` | 2 | Auditoria 1, Transportadores 1 |
| `rgba(9,61,68,.22)` | 2 | Auditoria 1, moldura 1 |
| `#3a1219` | 2 | Compartimento 1, Viagem 1 |
| `rgba(9,61,68,.12)` | 2 | Compartimento 1, Transportadores 1 |
| `rgba(18,118,112,.28)` | 2 | Hoje 1, Viagem 1 |
| `rgba(9,61,68,.04)` | 2 | Hoje 1, moldura 1 |
| `#6ba8a4` | 2 | Hoje 2 |
| `#e7f1ec` | 2 | Hoje 1, Viagem 1 |
| `#fbfdfc` | 2 | LinkDaViagem 2 |
| `rgba(255,255,255,.78)` | 2 | LinkDaViagem 1, Viagem 1 |
| `#8a5a0e` | 2 | LinkDaViagem 1, Transportadores 1 |
| `#ebc3c8` | 2 | LinkDaViagem 1, tx-ui 1 |
| `#dde5e3` | 2 | Viagem 1, tx-ui 1 |
| `rgba(18,118,112,.35)` | 2 | Viagem 1, tx-ui 1 |
| `rgba(196,61,61,.3)` | 2 | tx-ui 1, moldura 1 |
| `rgba(255,255,255,.06)` | 2 | moldura 2 |
| `#eef2f1` | 2 | moldura 2 |
| `#f7faf9` | 2 | moldura 1, estados 1 |
| `#f7f9f8` | 2 | moldura 2 |
| `#f3faf8` | 1 | Auditoria 1 |
| `rgba(232,163,61,.25)` | 1 | Auditoria 1 |
| `rgba(232,163,61,.5)` | 1 | Auditoria 1 |
| `rgba(255,255,255,.65)` | 1 | Auditoria 1 |
| `rgba(18,118,112,.12)` | 1 | Cadastros 1 |
| `#ff8a8a` | 1 | Compartimento 1 |
| `#fdf8f8` | 1 | Compartimento 1 |
| `rgba(255,255,255,.88)` | 1 | Compartimento 1 |
| `#b9c9c6` | 1 | Configuracoes 1 |
| `#fdf6ec` | 1 | Hoje 1 |
| `#9fe0c3` | 1 | Hoje 1 |
| `#9fc9c6` | 1 | Hoje 1 |
| `rgba(9,61,68,.14)` | 1 | Hoje 1 |
| `rgba(232,163,61,.85)` | 1 | LinkDaViagem 1 |
| `rgba(9,34,36,.12)` | 1 | LinkDaViagem 1 |
| `rgba(255,255,255,.9)` | 1 | LinkDaViagem 1 |
| `#fdf3e2` | 1 | LinkDaViagem 1 |
| `rgba(72,199,142,.18)` | 1 | LinkDaViagem 1 |
| `rgba(245,248,247,0)` | 1 | LinkDaViagem 1 |
| `rgba(255,255,255,.72)` | 1 | Transportadores 1 |
| `rgba(196,61,61,.25)` | 1 | Viagem 1 |
| `#cfe3ee` | 1 | Viagem 1 |
| `#e8eef0` | 1 | Viagem 1 |
| `#fbe3cf` | 1 | Viagem 1 |
| `#dfeaea` | 1 | Viagem 1 |
| `#f4e7d6` | 1 | Viagem 1 |
| `rgba(26,143,87,.9)` | 1 | Viagem 1 |
| `rgba(196,61,61,.92)` | 1 | Viagem 1 |
| `rgba(72,199,142,.22)` | 1 | Viagem 1 |
| `rgba(255,255,255,.03)` | 1 | Viagem 1 |
| `rgba(255,255,255,.82)` | 1 | Viagem 1 |
| `rgba(9,34,36,.55)` | 1 | Viagem 1 |
| `#d9e5e3` | 1 | Viagem 1 |
| `rgba(0,0,0,.08)` | 1 | Viagem 1 |
| `rgba(9,34,36,.6)` | 1 | Viagem 1 |
| `rgba(26,143,87,.16)` | 1 | tx-ui 1 |
| `rgba(196,61,61,.16)` | 1 | tx-ui 1 |
| `#7d2232` | 1 | tx-ui 1 |
| `rgba(147,49,63,.2)` | 1 | tx-ui 1 |
| `rgba(157,176,174,.14)` | 1 | tx-ui 1 |
| `#5b8def` | 1 | tx-ui 1 |
| `rgba(14,120,181,.16)` | 1 | tx-ui 1 |
| `rgba(217,117,68,.18)` | 1 | tx-ui 1 |
| `#fafcfb` | 1 | tx-ui 1 |
| `#1d2b2c` | 1 | tx-ui 1 |
| `#ccd6d4` | 1 | tx-ui 1 |
| `#d5dedc` | 1 | tx-ui 1 |
| `#f1f5f4` | 1 | tx-ui 1 |
| `#a33` | 1 | tx-ui 1 |
| `rgba(255,255,255,.62)` | 1 | moldura 1 |
| `rgba(255,255,255,.58)` | 1 | moldura 1 |
| `rgba(255,255,255,.07)` | 1 | moldura 1 |
| `rgba(255,255,255,.28)` | 1 | moldura 1 |
| `rgba(61,220,151,.18)` | 1 | moldura 1 |
| `#7fe0d4` | 1 | moldura 1 |
| `rgba(9,61,68,.18)` | 1 | moldura 1 |
| `#d8e4e2` | 1 | moldura 1 |
| `#eef4f2` | 1 | estados 1 |
| `#f6f9f8` | 1 | estados 1 |
| `#f0f4f3` | 1 | estados 1 |
| `#0c5862` | 1 | estados 1 |
| `#fdf1f1` | 1 | estados 1 |
| `rgba(9,61,68,.09)` | 1 | estados 1 |


## 4. Hovers gerados (`src/telas/estados.css`)

As classes `.tx-h...` foram geradas pelo conversor a partir do protótipo. Cada uma vira um estado do componente; depois da migração o arquivo pode ser apagado.

| classe | usos | regra | vira |
| --- | ---: | --- | --- |
| `.tx-h76d8d79` | 11 | `color:#127670 !important` | cor do texto vira --primario (ação em texto, link) |
| `.tx-h30bbaa9` | 11 | `border-color:#127670 !important` | botão de contorno: borda --primario |
| `.tx-h0882f37` | 10 | `transform:translateY(-1px) !important` | botão primário sobe 1 px |
| `.tx-h894fca3` | 9 | `background:#f6f9f8 !important` | linha de tabela: --superficie-hover |
| `.tx-hc05ca3a` | 4 | `background:#f7faf9 !important` | item: --superficie |
| `.tx-hae10539` | 3 | `background:#0C5862 !important` | fundo --primario-2 |
| `.tx-h0e7da8b` | 2 | `color:#fff !important;transform:translateY(-1px) !important` | texto branco e sobe 1 px |
| `.tx-hec6a165` | 2 | `color:#0b2224 !important` | aba: texto --texto |
| `.tx-h5a3ff2f` | 2 | `background:#e4ebe9 !important` | secundário: --superficie-3 |
| `.tx-h681b28c` | 2 | `background:rgba(255,255,255,.14) !important` | sobre a marca: branco .14 |
| `.tx-hcab3cde` | 2 | `background:#e4ebe9 !important;color:#0b2224 !important` | secundário: --superficie-3 e --texto |
| `.tx-hd5eb93c` | 1 | `border-color:rgba(255,255,255,.55) !important` | sobre a marca: borda branca .55 |
| `.tx-h6eff871` | 1 | `background:#eef4f2 !important` | fundo #eef4f2 (vira --superficie-2) |
| `.tx-haf27d80` | 1 | `background:#fdf1f1 !important` | fundo #fdf1f1 (vira --perigo-fundo) |
| `.tx-hbfbd724` | 1 | `box-shadow:0 12px 30px rgba(9,61,68,.09) !important` | cartão clicável: --sombra-p |
| `.tx-h53feea5` | 1 | `background:rgba(255,255,255,.16) !important` | sobre a marca: branco .16 |
| `.tx-hb08bac3` | 1 | `transform:translateY(-2px) !important` | cartão sobe 2 px |
| `.tx-hb24e7a4` | 1 | `border-color:#c43d3d !important;color:#c43d3d !important` | contorno de perigo |
| `.tx-ha5daa28` | 1 | `background:#f0f4f3 !important;color:#c43d3d !important` | remover: fundo --superficie-2, texto --perigo |
| `.tx-h39963fb` | 1 | `color:#c43d3d !important` | texto --perigo |

## 5. Contagem completa por propriedade

Até 60 valores por propriedade, do mais usado ao menos usado.

### minHeight

| valor | usos | onde |
|---|---:|---|
| `100%` | 10 | Auditoria 1, Cadastros 1, Compartimento 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `100vh` | 2 | LinkDaViagem 2 |
| `0` | 1 | moldura 1 |
| `44px` | 1 | LinkDaViagem 1 |
| `16px` | 1 | LinkDaViagem 1 |
| `15px` | 1 | LinkDaViagem 1 |
| `280px` | 1 | LinkDaViagem 1 |
| `74px` | 1 | Viagem 1 |
| `36px` | 1 | moldura 1 |

### padding

| valor | usos | onde |
|---|---:|---|
| `9px 12px` | 39 | Auditoria 1, Cadastros 4, Configuracoes 4, Hoje 8, LinkDaViagem 2, Transportadores 3, Viagem 16, moldura 1 |
| `20px 24px` | 22 | Auditoria 1, Cadastros 2, Compartimento 1, Configuracoes 7, Hoje 2, Viagem 9 |
| `10px 20px` | 21 | Cadastros 2, Configuracoes 1, Frota 1, Hoje 3, Transportadores 2, Viagem 10, Viagens 1, moldura 1 |
| `10px 12px` | 17 | Auditoria 1, Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, LinkDaViagem 1, Transportadores 4, Viagem 7 |
| `10px 22px` | 17 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 10, Viagens 1, moldura 1 |
| `16px 20px` | 14 | Auditoria 1, Cadastros 3, Frota 1, Hoje 2, LinkDaViagem 2, Transportadores 2, Viagem 1, Viagens 2 |
| `20px` | 14 | Hoje 2, LinkDaViagem 7, Viagem 5 |
| `16px 16px` | 12 | Hoje 2, Transportadores 7, Viagem 3 |
| `6px 14px` | 10 | Hoje 1, Transportadores 1, Viagem 8 |
| `24px 32px 48px` | 9 | Auditoria 1, Cadastros 1, Compartimento 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1 |
| `6px` | 8 | Auditoria 1, Cadastros 1, Hoje 1, Viagem 1, Viagens 3, moldura 1 |
| `8px 11px` | 8 | Auditoria 1, Cadastros 2, Transportadores 1, Viagens 4 |
| `12px 20px` | 7 | Auditoria 1, Hoje 1, Transportadores 3, Viagens 2 |
| `8px 16px` | 7 | Cadastros 1, Configuracoes 1, Hoje 2, Transportadores 1, Viagem 1, Viagens 1 |
| `32px` | 7 | Cadastros 1, Configuracoes 1, Frota 1, Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `28px 28px` | 7 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1 |
| `12px 16px` | 7 | Configuracoes 2, Hoje 1, Transportadores 1, Viagem 2, Viagens 1 |
| `11px 13px` | 6 | Cadastros 2, Configuracoes 1, Hoje 1, LinkDaViagem 1, Viagem 1 |
| `2px 9px` | 6 | Cadastros 1, Hoje 1, Transportadores 1, Viagem 3 |
| `5px 11px` | 6 | Cadastros 1, Compartimento 1, Configuracoes 1, LinkDaViagem 1, Viagem 2 |
| `9px 18px` | 6 | Configuracoes 1, Viagem 5 |
| `16px` | 6 | Hoje 1, LinkDaViagem 3, Viagem 1, Viagens 1 |
| `8px 12px` | 6 | Transportadores 1, Viagem 4, moldura 1 |
| `10px 18px` | 5 | Auditoria 2, Cadastros 2, Compartimento 1 |
| `10px 13px` | 5 | Cadastros 2, Hoje 3 |
| `24px 28px` | 5 | Compartimento 1, Hoje 1, Transportadores 1, Viagem 2 |
| `9px 16px` | 4 | Auditoria 1, Compartimento 1, Frota 1, Viagem 1 |
| `20px 20px` | 4 | Auditoria 3, Cadastros 1 |
| `0 12px` | 4 | Cadastros 1, Transportadores 1, Viagens 2 |
| `7px 14px` | 4 | Cadastros 1, Transportadores 3 |
| `10px 4px` | 4 | Configuracoes 3, Viagem 1 |
| `9px 14px` | 4 | Hoje 1, LinkDaViagem 1, Viagens 2 |
| `11px 14px` | 4 | Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `0 16px` | 3 | Auditoria 2, Hoje 1 |
| `0 12px 0 12px` | 3 | Cadastros 1, Viagens 2 |
| `11px 4px` | 3 | Compartimento 1, Configuracoes 1, Hoje 1 |
| `9px 15px` | 3 | Transportadores 1, Viagem 1, Viagens 1 |
| `0` | 2 | LinkDaViagem 1, moldura 1 |
| `8px 9px` | 2 | Auditoria 2 |
| `6px 12px` | 2 | Auditoria 1, LinkDaViagem 1 |
| `10px 16px` | 2 | Cadastros 1, LinkDaViagem 1 |
| `24px 20px` | 2 | Cadastros 1, LinkDaViagem 1 |
| `3px` | 2 | Compartimento 1, Transportadores 1 |
| `8px` | 2 | Configuracoes 1, moldura 1 |
| `5px 12px` | 2 | Configuracoes 1, Viagem 1 |
| `11px 16px` | 2 | Frota 1, LinkDaViagem 1 |
| `3px 9px` | 2 | Frota 1, Viagem 1 |
| `6px 10px` | 2 | Frota 1, Hoje 1 |
| `1px 9px` | 2 | Hoje 1, moldura 1 |
| `1px 6px` | 2 | LinkDaViagem 1, Viagem 1 |
| `1px 8px` | 2 | LinkDaViagem 1, moldura 1 |
| `11px` | 2 | LinkDaViagem 2 |
| `0 20px` | 2 | Transportadores 1, Viagens 1 |
| `16px 12px 12px` | 2 | Transportadores 1, Viagens 1 |
| `0 7px` | 2 | Transportadores 1, Viagens 1 |
| `3px 10px` | 2 | Transportadores 1, Viagem 1 |
| `10px 14px` | 2 | Viagem 1, moldura 1 |
| `9px 11px` | 2 | Viagem 1, Viagens 1 |
| `4px 8px` | 2 | Viagens 2 |
| `1px 7px` | 2 | moldura 2 |
| (mais 60 valores com 60 usos) | | |

### gap

| valor | usos | onde |
|---|---:|---|
| `10px` | 83 | Auditoria 7, Cadastros 8, Compartimento 1, Configuracoes 5, Frota 2, Hoje 10, LinkDaViagem 2, Transportadores 7, Viagem 29, Viagens 8, moldura 4 |
| `8px` | 65 | Auditoria 4, Cadastros 7, Compartimento 3, Configuracoes 2, Frota 3, Hoje 5, LinkDaViagem 8, Transportadores 7, Viagem 21, Viagens 4, moldura 1 |
| `12px` | 40 | Auditoria 1, Cadastros 2, Compartimento 4, Configuracoes 6, Frota 2, Hoje 6, LinkDaViagem 1, Transportadores 4, Viagem 9, Viagens 2, moldura 3 |
| `16px` | 39 | Auditoria 3, Cadastros 6, Compartimento 1, Configuracoes 3, Frota 3, Hoje 9, LinkDaViagem 1, Transportadores 3, Viagem 4, Viagens 6 |
| `6px` | 36 | Auditoria 2, Cadastros 3, Configuracoes 3, Frota 2, Hoje 6, LinkDaViagem 3, Transportadores 7, Viagem 9, Viagens 1 |
| `7px` | 32 | Cadastros 3, Compartimento 1, Frota 1, Hoje 4, Transportadores 3, Viagem 14, Viagens 6 |
| `20px` | 11 | Auditoria 1, Cadastros 2, Compartimento 1, Configuracoes 1, Hoje 2, Viagem 4 |
| `9px` | 10 | Auditoria 1, Cadastros 1, Compartimento 1, Frota 1, Hoje 2, LinkDaViagem 2, Viagem 2 |
| `5px` | 9 | Auditoria 1, Cadastros 1, Frota 1, Hoje 1, LinkDaViagem 1, Transportadores 1, Viagem 2, Viagens 1 |
| `2px` | 4 | Compartimento 1, Configuracoes 1, Transportadores 1, Viagem 1 |
| `4px` | 4 | Hoje 1, LinkDaViagem 1, Transportadores 1, Viagens 1 |
| `11px` | 4 | LinkDaViagem 1, Transportadores 1, moldura 2 |
| `3px` | 3 | Auditoria 1, Hoje 1, moldura 1 |
| `24px` | 3 | Compartimento 1, Hoje 1, Viagem 1 |
| `28px` | 2 | Hoje 1, Viagem 1 |
| `1px` | 2 | moldura 2 |
| `14px` | 1 | moldura 1 |

### fontSize

| valor | usos | onde |
|---|---:|---|
| `13px` | 253 | Auditoria 19, Cadastros 29, Compartimento 11, Configuracoes 16, Frota 9, Hoje 35, Transportadores 31, Viagem 69, Viagens 28, moldura 6 |
| `12px` | 223 | Auditoria 8, Cadastros 20, Compartimento 8, Configuracoes 22, Frota 9, Hoje 30, LinkDaViagem 27, Transportadores 18, Viagem 67, Viagens 13, moldura 1 |
| `14px` | 152 | Auditoria 1, Cadastros 8, Compartimento 2, Configuracoes 13, Frota 6, Hoje 22, LinkDaViagem 20, Transportadores 20, Viagem 49, Viagens 9, moldura 2 |
| `16px` | 64 | Auditoria 5, Cadastros 6, Compartimento 3, Configuracoes 8, Frota 2, Hoje 10, LinkDaViagem 13, Transportadores 3, Viagem 11, Viagens 2, moldura 1 |
| `11px` | 52 | Auditoria 4, Cadastros 4, Compartimento 6, Frota 1, Hoje 5, Transportadores 3, Viagem 21, Viagens 6, moldura 2 |
| `20px` | 12 | Hoje 3, LinkDaViagem 3, Transportadores 1, Viagem 5 |
| `24px` | 10 | Auditoria 1, Cadastros 1, Compartimento 1, Configuracoes 1, Frota 1, Hoje 1, LinkDaViagem 1, Transportadores 1, Viagem 1, Viagens 1 |
| `13.5px` | 4 | moldura 4 |
| `10.5px` | 3 | moldura 3 |
| `11.5px` | 3 | moldura 3 |
| `10px` | 2 | moldura 2 |
| `12.5px` | 2 | moldura 2 |
| `40px` | 1 | Hoje 1 |
| `32px` | 1 | Hoje 1 |
| `17px` | 1 | moldura 1 |

### fontWeight

| valor | usos | onde |
|---|---:|---|
| `800` | 263 | Auditoria 12, Cadastros 24, Compartimento 9, Configuracoes 21, Frota 9, Hoje 28, LinkDaViagem 30, Transportadores 27, Viagem 82, Viagens 15, moldura 6 |
| `700` | 155 | Auditoria 3, Cadastros 12, Compartimento 4, Configuracoes 12, Frota 4, Hoje 22, LinkDaViagem 6, Transportadores 14, Viagem 56, Viagens 13, moldura 9 |
| `600` | 48 | Auditoria 4, Cadastros 1, Compartimento 4, Frota 3, Hoje 8, LinkDaViagem 2, Transportadores 2, Viagem 14, Viagens 7, moldura 3 |
| `500` | 2 | Hoje 1, moldura 1 |

### color

| valor | usos | onde |
|---|---:|---|
| `var(--texto-sec)` | 125 | Auditoria 8, Cadastros 16, Compartimento 6, Configuracoes 10, Frota 5, Hoje 19, LinkDaViagem 3, Transportadores 10, Viagem 35, Viagens 8, moldura 5 |
| `var(--texto-apagado)` | 93 | Auditoria 6, Cadastros 12, Compartimento 4, Configuracoes 8, Frota 3, Hoje 10, LinkDaViagem 11, Transportadores 12, Viagem 13, Viagens 14 |
| `var(--texto-2)` | 65 | Auditoria 1, Cadastros 3, Configuracoes 6, Frota 3, Hoje 4, LinkDaViagem 8, Transportadores 6, Viagem 31, Viagens 3 |
| `#fff` | 58 | Auditoria 3, Cadastros 3, Compartimento 2, Configuracoes 2, Frota 2, Hoje 5, LinkDaViagem 4, Transportadores 4, Viagem 19, Viagens 2, moldura 11, estados 1 |
| `var(--primario-2)` | 30 | Auditoria 2, Cadastros 5, Configuracoes 1, Frota 1, Hoje 3, LinkDaViagem 3, Transportadores 4, Viagem 7, Viagens 3, moldura 1 |
| `var(--texto)` | 11 | Auditoria 2, Compartimento 1, Hoje 1, LinkDaViagem 1, Transportadores 1, Viagem 5 |
| `rgba(255,255,255,.7)` | 10 | Auditoria 1, Compartimento 4, Hoje 1, LinkDaViagem 2, Viagem 2 |
| `rgba(255,255,255,.6)` | 8 | Compartimento 3, Hoje 2, Viagem 3 |
| `inherit` | 8 | Frota 1, Hoje 3, Transportadores 1, Viagens 1, moldura 2 |
| `var(--perigo)` | 6 | Cadastros 1, Configuracoes 2, Hoje 1, Transportadores 2 |
| `var(--tecnico)` | 5 | LinkDaViagem 3, Transportadores 1, Viagem 1 |
| `#b8c6c4` | 3 | Compartimento 2, Viagem 1 |
| `var(--aviso)` | 3 | Configuracoes 1, Viagem 2 |
| `#c43d3d` | 3 | estados 3 |
| `var(--primario-3)` | 2 | Auditoria 1, Viagem 1 |
| `var(--ok)` | 2 | Auditoria 1, LinkDaViagem 1 |
| `rgba(255,255,255,.75)` | 2 | Compartimento 1, Hoje 1 |
| `rgba(255,255,255,.55)` | 2 | Hoje 1, Viagem 1 |
| `#b85a2e` | 2 | Hoje 1, Viagem 1 |
| `rgba(255,255,255,.78)` | 2 | LinkDaViagem 1, Viagem 1 |
| `#8a5a0e` | 2 | LinkDaViagem 1, Transportadores 1 |
| `rgba(255, 255, 255, .7)` | 2 | moldura 2 |
| `#0b2224` | 2 | estados 2 |
| `rgba(255,255,255,.65)` | 1 | Auditoria 1 |
| `rgba(255,255,255,.88)` | 1 | Compartimento 1 |
| `#6e1f2b` | 1 | Compartimento 1 |
| `var(--azul)` | 1 | Hoje 1 |
| `rgba(255,255,255,.9)` | 1 | LinkDaViagem 1 |
| `rgba(255,255,255,.72)` | 1 | Transportadores 1 |
| `rgba(255,255,255,.82)` | 1 | Viagem 1 |
| `rgba(255, 255, 255, .62)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .58)` | 1 | moldura 1 |
| `var(--sb-texto)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .6)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .55)` | 1 | moldura 1 |
| `#127670` | 1 | estados 1 |

### zIndex

| valor | usos | onde |
|---|---:|---|
| `1000` | 8 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `60` | 7 | Auditoria 1, Cadastros 1, Hoje 1, Viagens 4 |
| `5` | 2 | Auditoria 1, Hoje 1 |
| `80` | 2 | Viagem 1, moldura 1 |
| `35` | 1 | moldura 1 |
| `40` | 1 | moldura 1 |
| `50` | 1 | LinkDaViagem 1 |
| `90` | 1 | moldura 1 |
| `900` | 1 | Transportadores 1 |
| `1200` | 1 | moldura 1 |

### borderRadius

| valor | usos | onde |
|---|---:|---|
| `99px` | 195 | Auditoria 4, Cadastros 11, Compartimento 2, Configuracoes 12, Frota 7, Hoje 31, LinkDaViagem 10, Transportadores 21, Viagem 74, Viagens 12, moldura 11 |
| `20px` | 48 | Auditoria 4, Cadastros 4, Compartimento 1, Configuracoes 7, Frota 1, Hoje 6, LinkDaViagem 10, Transportadores 1, Viagem 13, Viagens 1 |
| `11px` | 45 | Cadastros 5, Compartimento 3, Configuracoes 2, Frota 2, Hoje 10, LinkDaViagem 1, Transportadores 8, Viagem 8, Viagens 5, moldura 1 |
| `12px` | 40 | Auditoria 3, Cadastros 4, Configuracoes 2, Frota 1, Hoje 4, LinkDaViagem 3, Transportadores 4, Viagem 16, moldura 3 |
| `14px` | 24 | Auditoria 1, Cadastros 1, Frota 1, Hoje 4, LinkDaViagem 7, Transportadores 1, Viagem 3, Viagens 5, moldura 1 |
| `16px` | 22 | Hoje 3, LinkDaViagem 2, Transportadores 7, Viagem 8, moldura 2 |
| `9px` | 17 | Auditoria 4, Cadastros 1, Compartimento 1, Hoje 1, LinkDaViagem 1, Transportadores 2, Viagens 5, moldura 2 |
| `13px` | 11 | Auditoria 1, Cadastros 3, Configuracoes 1, LinkDaViagem 1, Transportadores 1, Viagem 3, Viagens 1 |
| `22px` | 10 | Auditoria 1, Compartimento 1, Hoje 1, Viagem 5, moldura 2 |
| `6px` | 8 | Auditoria 1, Cadastros 1, LinkDaViagem 1, Viagem 3, Viagens 1, moldura 1 |
| `10px` | 8 | Cadastros 1, Configuracoes 1, LinkDaViagem 1, Viagem 3, Viagens 1, moldura 1 |
| `24px` | 8 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1, moldura 1 |
| `8px` | 8 | Compartimento 1, Frota 1, Hoje 1, Transportadores 1, Viagem 3, Viagens 1 |
| `18px` | 6 | Cadastros 2, Configuracoes 1, Hoje 3 |
| `15px` | 6 | Configuracoes 2, Viagem 2, Viagens 1, moldura 1 |
| `7px` | 4 | Cadastros 1, Compartimento 2, Viagem 1 |
| `3px` | 3 | Hoje 3 |
| `4px 14px 14px 14px` | 2 | Hoje 1, Viagem 1 |
| `5px` | 1 | Frota 1 |

### background

| valor | usos | onde |
|---|---:|---|
| `var(--painel)` | 105 | Auditoria 6, Cadastros 9, Compartimento 2, Configuracoes 10, Frota 3, Hoje 14, LinkDaViagem 11, Transportadores 10, Viagem 25, Viagens 10, moldura 5 |
| `var(--superficie-2)` | 31 | Cadastros 2, Compartimento 1, Configuracoes 2, Frota 2, Hoje 3, Transportadores 4, Viagem 13, Viagens 2, moldura 2 |
| `var(--superficie)` | 29 | Auditoria 2, Cadastros 8, Configuracoes 1, LinkDaViagem 3, Transportadores 5, Viagem 6, Viagens 3, moldura 1 |
| `linear-gradient(135deg,var(--primario),var(--azul))` | 17 | Cadastros 3, Configuracoes 1, Hoje 3, LinkDaViagem 1, Transportadores 2, Viagem 6, Viagens 1 |
| `rgba(9,34,36,.45)` | 8 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 2, Viagem 1, Viagens 1 |
| `transparent` | 7 | Auditoria 1, Cadastros 1, Hoje 1, LinkDaViagem 1, Transportadores 1, Viagens 1, moldura 1 |
| `linear-gradient(90deg,var(--borda-suave) 25%,var(--superficie) 40%,var(--borda-suave) 55%)` | 6 | Hoje 1, Viagem 4, Viagens 1 |
| `rgba(255,255,255,.08)` | 5 | Auditoria 1, Compartimento 1, Viagem 3 |
| `var(--texto)` | 5 | LinkDaViagem 2, Viagem 2, moldura 1 |
| `rgba(255,255,255,.1)` | 4 | Auditoria 1, LinkDaViagem 1, Transportadores 1, Viagem 1 |
| `var(--primario-fraco)` | 4 | Hoje 1, LinkDaViagem 2, moldura 1 |
| `#e4ebe9` | 4 | moldura 2, estados 2 |
| `linear-gradient(115deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)` | 3 | Auditoria 1, Hoje 1, Viagem 1 |
| `var(--primario-3)` | 3 | Compartimento 1, Frota 1, Viagem 1 |
| `linear-gradient(135deg,#f4c15d,var(--aviso-2))` | 3 | Frota 1, Viagem 2 |
| `var(--aviso-2)` | 3 | Hoje 1, LinkDaViagem 1, Viagem 1 |
| `linear-gradient(135deg,#48c78e,var(--ok))` | 3 | Hoje 1, LinkDaViagem 1, Viagem 1 |
| `repeating-linear-gradient(-45deg,var(--superficie-2) 0 5px,#e4ebe9 5px 10px)` | 2 | Hoje 2 |
| `#e7f1ec` | 2 | Hoje 1, Viagem 1 |
| `rgba(255,255,255,.14)` | 2 | LinkDaViagem 1, estados 1 |
| `repeating-linear-gradient(-45deg,var(--borda-suave) 0 5px,#e2e9e7 5px 10px)` | 2 | Viagem 2 |
| `rgba(255, 255, 255, .1)` | 2 | moldura 2 |
| `none` | 2 | moldura 2 |
| `rgba(255, 255, 255, .06)` | 2 | moldura 2 |
| `#3ddc97` | 2 | moldura 2 |
| `var(--superficie-hover)` | 2 | moldura 2 |
| `linear-gradient(135deg, #e46969, #c43d3d)` | 2 | moldura 2 |
| `rgba(232,163,61,.25)` | 1 | Auditoria 1 |
| `var(--azul)` | 1 | Hoje 1 |
| `linear-gradient(135deg,#48c78e,var(--primario))` | 1 | Hoje 1 |
| `radial-gradient(circle,rgba(255,255,255,.14),transparent 65%)` | 1 | Hoje 1 |
| `repeating-linear-gradient(-45deg,rgba(255,255,255,.08) 0 5px,rgba(255,255,255,.15) 5px 10px)` | 1 | Hoje 1 |
| `linear-gradient(90deg,#48c78e,#9fe0c3)` | 1 | Hoje 1 |
| `linear-gradient(90deg,#e46969,var(--perigo))` | 1 | Hoje 1 |
| `linear-gradient(90deg,#f4c15d,var(--aviso-2))` | 1 | Hoje 1 |
| `linear-gradient(90deg,#9fc9c6,#6ba8a4)` | 1 | Hoje 1 |
| `var(--perigo)` | 1 | Hoje 1 |
| `#6ba8a4` | 1 | Hoje 1 |
| `linear-gradient(130deg,var(--primario-3),var(--primario-2) 60%,var(--azul) 140%)` | 1 | LinkDaViagem 1 |
| `#fdf3e2` | 1 | LinkDaViagem 1 |
| `#fbfdfc` | 1 | LinkDaViagem 1 |
| `linear-gradient(180deg,rgba(245,248,247,0),var(--superficie) 30%)` | 1 | LinkDaViagem 1 |
| `linear-gradient(130deg,var(--primario-3),var(--primario-2) 55%,var(--azul) 130%)` | 1 | Transportadores 1 |
| `rgba(255,255,255,.12)` | 1 | Transportadores 1 |
| `radial-gradient(circle,rgba(255,255,255,.16),transparent 65%)` | 1 | Viagem 1 |
| `linear-gradient(135deg,#f4c15d,#d97544)` | 1 | Viagem 1 |
| `linear-gradient(135deg,#e46969,var(--perigo))` | 1 | Viagem 1 |
| `linear-gradient(115deg,#3a1219,#6e1f2b 60%,var(--tecnico) 130%)` | 1 | Viagem 1 |
| `repeating-linear-gradient(-45deg,rgba(255,255,255,.03) 0 10px,transparent 10px 20px)` | 1 | Viagem 1 |
| `linear-gradient(90deg,#48c78e,var(--primario))` | 1 | Viagem 1 |
| `rgba(9,34,36,.55)` | 1 | Viagem 1 |
| `var(--borda-suave)` | 1 | Viagem 1 |
| `rgba(9,34,36,.6)` | 1 | Viagem 1 |
| `linear-gradient(90deg,#f4c15d,#d97544)` | 1 | Viagem 1 |
| `var(--primario)` | 1 | Viagens 1 |
| `var(--sb-fundo)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .07)` | 1 | moldura 1 |
| `var(--sb-ativo)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .14)` | 1 | moldura 1 |
| `rgba(255, 255, 255, .28)` | 1 | moldura 1 |
| (mais 13 valores com 13 usos) | | |

### border

| valor | usos | onde |
|---|---:|---|
| `1px solid var(--borda)` | 62 | Auditoria 5, Cadastros 5, Compartimento 1, Configuracoes 8, Frota 2, Hoje 9, Transportadores 8, Viagem 15, Viagens 6, moldura 3 |
| `1px solid var(--borda-campo)` | 46 | Cadastros 3, Configuracoes 3, Frota 1, Hoje 11, LinkDaViagem 1, Transportadores 6, Viagem 16, Viagens 3, moldura 2 |
| `none` | 11 | Auditoria 1, Cadastros 1, Hoje 1, LinkDaViagem 1, Transportadores 1, Viagens 1, moldura 5 |
| `1px solid var(--borda-suave)` | 11 | Cadastros 1, Configuracoes 2, Frota 1, Hoje 1, Transportadores 2, Viagem 3, Viagens 1 |
| `1px solid rgba(255,255,255,.2)` | 4 | Auditoria 1, Viagem 3 |
| `1px solid #cfe3e1` | 4 | Cadastros 1, Viagem 1, Viagens 1, moldura 1 |
| `1.5px solid var(--perigo-borda)` | 3 | Configuracoes 1, LinkDaViagem 1, Transportadores 1 |
| `1px solid #f0d3bf` | 2 | Hoje 1, Viagem 1 |
| `1.5px dashed var(--borda-forte)` | 2 | Hoje 1, Viagem 1 |
| `1.5px solid var(--borda-campo)` | 2 | LinkDaViagem 1, moldura 1 |
| `1px solid rgba(255,255,255,.18)` | 2 | Transportadores 1, Viagem 1 |
| `1px solid rgba(255,255,255,.25)` | 1 | Auditoria 1 |
| `1px solid rgba(255,255,255,.22)` | 1 | Auditoria 1 |
| `1px solid rgba(232,163,61,.5)` | 1 | Auditoria 1 |
| `1px solid rgba(255,255,255,.12)` | 1 | Compartimento 1 |
| `1.5px dashed #b9c9c6` | 1 | Configuracoes 1 |
| `1px solid rgba(255,255,255,.16)` | 1 | LinkDaViagem 1 |
| `1.5px solid #cfe3e1` | 1 | LinkDaViagem 1 |
| `1px solid #ebc3c8` | 1 | LinkDaViagem 1 |
| `1.5px solid var(--aviso-borda)` | 1 | Transportadores 1 |
| `1px solid var(--perigo-borda)` | 1 | Viagem 1 |
| `1px solid var(--aviso-borda)` | 1 | Viagem 1 |
| `1px dashed var(--perigo-borda)` | 1 | Viagem 1 |
| `1px solid #d9e5e3` | 1 | Viagem 1 |
| `1px solid transparent` | 1 | moldura 1 |
| `1px solid rgba(255, 255, 255, .22)` | 1 | moldura 1 |
| `1px solid rgba(255, 255, 255, .08)` | 1 | moldura 1 |

### outline

| valor | usos | onde |
|---|---:|---|
| `none` | 42 | Auditoria 3, Cadastros 3, Configuracoes 3, Frota 1, Hoje 10, LinkDaViagem 3, Transportadores 4, Viagem 12, Viagens 2, moldura 1 |
| `2px solid #7fe0d4` | 1 | moldura 1 |

### boxShadow

| valor | usos | onde |
|---|---:|---|
| `0 6px 14px rgba(18,118,112,.3)` | 7 | Cadastros 1, Hoje 1, Transportadores 1, Viagem 4 |
| `0 16px 40px rgba(9,61,68,.16)` | 7 | Cadastros 1, Hoje 1, Viagem 1, Viagens 4 |
| `0 40px 100px rgba(9,34,36,.4)` | 7 | Cadastros 1, Configuracoes 1, Frota 1, Hoje 1, Transportadores 1, Viagem 1, Viagens 1 |
| `0 6px 14px rgba(18,118,112,.25)` | 3 | Configuracoes 1, Hoje 1, Viagens 1 |
| `0 0 0 3px rgba(232,163,61,.2)` | 2 | Viagem 2 |
| `0 16px 40px rgba(9,61,68,.22)` | 1 | Auditoria 1 |
| `0 0 0 3px rgba(255,255,255,.18)` | 1 | Compartimento 1 |
| `0 2px 10px rgba(9,61,68,.04)` | 1 | Hoje 1 |
| `0 14px 30px rgba(9,61,68,.14)` | 1 | Hoje 1 |
| `0 0 60px rgba(9,34,36,.12)` | 1 | LinkDaViagem 1 |
| `0 0 0 7px rgba(72,199,142,.18)` | 1 | LinkDaViagem 1 |
| `0 16px 40px rgba(9,34,36,.35)` | 1 | LinkDaViagem 1 |
| `-30px 0 80px rgba(9,34,36,.35)` | 1 | Transportadores 1 |
| `0 0 0 3px rgba(255,255,255,.25)` | 1 | Transportadores 1 |
| `0 0 0 5px rgba(72,199,142,.22)` | 1 | Viagem 1 |
| `inset 4px 0 0 var(--aviso-2)` | 1 | Viagem 1 |
| `0 0 0 4px rgba(232,163,61,.2)` | 1 | Viagem 1 |
| `0 6px 14px rgba(18,118,112,.28)` | 1 | Viagem 1 |
| `inset 4px 0 0 var(--perigo)` | 1 | Viagem 1 |
| `inset 4px 0 0 var(--borda-forte)` | 1 | Viagem 1 |
| `0 1px 2px rgba(0,0,0,.08)` | 1 | Viagem 1 |
| `0 8px 18px rgba(18,118,112,.35)` | 1 | Viagem 1 |
| `0 18px 44px rgba(9, 61, 68, .22), inset 0 1px 0 rgba(255, 255, 255, .08)` | 1 | moldura 1 |
| `0 0 0 3px rgba(61, 220, 151, .18)` | 1 | moldura 1 |
| `0 2px 10px rgba(9, 61, 68, .04)` | 1 | moldura 1 |
| `0 18px 44px rgba(9, 61, 68, .18)` | 1 | moldura 1 |
| `0 0 0 3px #fff, 0 0 0 4.5px #d8e4e2` | 1 | moldura 1 |
| `0 0 0 3px #fff, 0 0 0 4.5px var(--primario)` | 1 | moldura 1 |
| `0 16px 40px rgba(9, 61, 68, .16)` | 1 | moldura 1 |
| `0 40px 100px rgba(9, 34, 36, .4)` | 1 | moldura 1 |
| `0 8px 18px rgba(196, 61, 61, .3)` | 1 | moldura 1 |
| `0 16px 40px rgba(9, 34, 36, .35)` | 1 | moldura 1 |
| `0 12px 30px rgba(9,61,68,.09)` | 1 | estados 1 |

### borderTop

| valor | usos | onde |
|---|---:|---|
| `1px solid var(--superficie-2)` | 6 | Auditoria 2, Cadastros 1, Viagens 2, moldura 1 |
| `1px solid var(--borda-suave)` | 3 | Auditoria 1, Transportadores 1, Viagens 1 |
| `1px solid rgba(255,255,255,.15)` | 1 | Compartimento 1 |

### letterSpacing

| valor | usos | onde |
|---|---:|---|
| `.8px` | 10 | Auditoria 1, LinkDaViagem 2, Viagem 4, Viagens 2, moldura 1 |
| `.7px` | 6 | Auditoria 1, Cadastros 1, Compartimento 1, Transportadores 1, Viagens 2 |
| `1.4px` | 4 | Compartimento 1, Hoje 1, Viagem 1, moldura 1 |
| `1.6px` | 2 | Viagem 1, moldura 1 |
| `1.2px` | 1 | Cadastros 1 |
| `10px` | 1 | LinkDaViagem 1 |
| `-.2px` | 1 | Viagem 1 |
| `.6px` | 1 | Viagem 1 |
| `.2px` | 1 | moldura 1 |
| `.4px` | 1 | moldura 1 |

### borderBottom

| valor | usos | onde |
|---|---:|---|
| `1px solid var(--superficie-2)` | 14 | Compartimento 1, Configuracoes 4, Hoje 3, Transportadores 2, Viagem 2, Viagens 2 |
| `1px solid var(--borda-suave)` | 6 | Auditoria 1, Compartimento 1, Transportadores 2, Viagens 2 |
| `1px solid var(--borda-campo)` | 1 | Cadastros 1 |
| `1.5px solid var(--borda-campo)` | 1 | LinkDaViagem 1 |
| `none` | 1 | moldura 1 |

### lineHeight

| valor | usos | onde |
|---|---:|---|
| `1.5` | 20 | Cadastros 2, Configuracoes 2, Hoje 2, LinkDaViagem 3, Transportadores 4, Viagem 4, Viagens 3 |
| `1.55` | 15 | Cadastros 1, Compartimento 2, Configuracoes 2, Frota 2, LinkDaViagem 2, Transportadores 1, Viagem 3, Viagens 1, moldura 1 |
| `1.45` | 9 | Auditoria 1, Cadastros 1, Configuracoes 1, LinkDaViagem 2, Viagem 4 |
| `1.4` | 3 | Viagem 3 |
| `1.6` | 2 | LinkDaViagem 2 |
| `1.35` | 1 | LinkDaViagem 1 |
| `1.25` | 1 | moldura 1 |

### borderLeft

| valor | usos | onde |
|---|---:|---|
| `1px solid rgba(255,255,255,.15)` | 3 | Compartimento 3 |
| `3px solid var(--aviso-2)` | 1 | Frota 1 |
| `1px solid var(--borda-suave)` | 1 | Hoje 1 |
| `1px solid rgba(255,255,255,.14)` | 1 | Hoje 1 |

### animation

| valor | usos | onde |
|---|---:|---|
| `txsh 1.3s linear infinite` | 7 | Hoje 1, Viagem 4, Viagens 1, moldura 1 |
| `pulso 1.6s infinite` | 1 | Hoje 1 |
| `subir .25s ease` | 1 | LinkDaViagem 1 |
| `deslizar .3s ease` | 1 | Transportadores 1 |

### transition

| valor | usos | onde |
|---|---:|---|
| `border-color .2s` | 2 | LinkDaViagem 2 |
| `box-shadow .2s` | 1 | Hoje 1 |
| `all .2s` | 1 | LinkDaViagem 1 |
| `width .4s` | 1 | Viagem 1 |
| `transform .15s` | 1 | Viagem 1 |
| `width .3s` | 1 | Viagem 1 |
| `width .25s ease` | 1 | moldura 1 |
| `transform .2s` | 1 | moldura 1 |
| `all .15s` | 1 | moldura 1 |

### margin

| valor | usos | onde |
|---|---:|---|
| `0 20px 14px` | 2 | Transportadores 1, Viagens 1 |
| `4px 0` | 1 | Viagem 1 |
| `12px 10px 8px` | 1 | moldura 1 |
| `12px` | 1 | moldura 1 |

### fontFamily

| valor | usos | onde |
|---|---:|---|
| `var(--fonte-mono)` | 2 | moldura 2 |

