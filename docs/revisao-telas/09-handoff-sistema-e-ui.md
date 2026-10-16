# Handoff: protótipo como sistema único e revisão de UI e UX página por página

Escrito em 15/10/2026 para o próximo agente. Leia antes `HANDOFF.md` (como rodar, bateria de testes, arquitetura, regras do Gabriel na seção 9) e `07-revisao-v2.md` (o que já foi revisto e por quê). Este arquivo diz o que fazer agora.

## 1. O pedido do Gabriel (15/10/2026)

1. **Virar um sistema, não várias páginas HTML.** Hoje cada tela é um `.dc.html` com a própria cópia da sidebar e do header. Cada clique recarrega a página inteira e redesenha a moldura. Ele quer o que o Autofluxos faz: sidebar fixa e header fixo desenhados uma vez, e só o conteúdo da página mudando. Vale mesmo sendo protótipo. **É requisito, não sugestão.**
2. **Revisar página por página** o layout, a UI e a UX, com foco em boas práticas.
3. **Fundo e moldura com o Autofluxos como referência visual**, mas com as cores do Traxium. Ele mesmo disse "sei lá" quanto ao fundo: mostre opções em captura e deixe ele escolher.

## 2. Onde está o protótipo hoje

- Pasta `SaaS moderno estilo Dribbble/`, dez telas v2: `Hoje`, `Viagens v2`, `Viagem`, `Transportadores`, `Frota`, `Compartimento v2`, `Auditoria`, `Cadastros`, `Configuracoes v2` e `Link da Viagem` (celular, sem sidebar).
- Runtime `support.js` (gerado, não editar): lê o `<x-dc>` de cada arquivo e renderiza com React (`window.React`). Tem `sc-if`, `sc-for` e componentes filhos (`dc-import`, `x-import`).
- Dados e motor de decisão em `tx-dados.js` (roda no navegador e no Node, 674 conferências em `scripts/testar-tx-dados.mjs`). Valores comuns da moldura em `tx-ui.js`.
- A moldura (sidebar, header com busca global, modais do topo) sai de `scripts/gerar-sidebar.mjs`, que escreve a mesma cópia em cada uma das nove telas com sidebar. É exatamente isso que precisa acabar.
- Há um app Next.js antigo em `src/` (protótipo v1, dados fixos, organizado por módulos). Não é a referência.
- A branch é `fix/ux-fase-1-3`, enviada ao GitHub. A publicação na Vercel é com o Gabriel (a pasta está ligada a um projeto de outra conta; ele loga quando quiser publicar). **Não peça acesso nem conta a ele.**

## 3. Parte 1: uma moldura só

### O que precisa ficar verdadeiro no fim

1. A sidebar e o header são renderizados uma vez. Trocar de tela não recarrega a página, não pisca a moldura, e o estado da sidebar (recolhida, acordeão de Cadastros) continua.
2. No desktop só o conteúdo rola. A sidebar fica parada na altura da janela, sem depender de `position:sticky` em cada tela.
3. Cada tela tem endereço próprio (os parâmetros de hoje continuam: `?id=`, `?visao=`, `?aba=`, `?filial=`, `&liberar=1`, `#ocorrencias`), o botão voltar do navegador funciona e um link copiado abre na tela certa.
4. O Link da Viagem continua fora da moldura (é a tela do motorista no celular).
5. Toda a bateria da seção 2 do `HANDOFF.md` continua passando, adaptada às rotas novas.

### Duas formas de chegar lá

| | A. Migrar para o Next.js do repositório | B. Moldura única no runtime atual |
| --- | --- | --- |
| Como | App Router com `app/(painel)/layout.tsx` contendo sidebar e header; uma rota por tela; o template de cada `.dc.html` vira JSX; `tx-dados.js` entra como módulo (ou portado para TypeScript) | Um `App.dc.html` com sidebar, header e um roteador por hash; cada tela vira componente filho por `dc-import`, sem moldura própria |
| A favor | É exatamente o padrão do Autofluxos (Next 16, mesma versão do repositório), com código de moldura pronto para estudar. Vira a base do front-end real | Reaproveita os templates como estão. Mais rápido se o runtime aceitar trocar o filho por rota |
| Contra | Reescrever dez templates (trabalho mecânico, mas grande). Decidir o que fazer com o v1 em `src/`. A publicação precisa de build Next | Não está provado que `dc-import` aceita troca por rota e estado compartilhado. Continua protótipo descartável |

**Recomendação:** A. (Feito em 15/10/2026: etapa 1 do registro.) O pedido é "um sistema", o produto final vai ser React, e o Autofluxos já resolveu os mesmos problemas no mesmo framework. Antes de começar, mostre ao Gabriel em uma linha o custo (dez telas a converter) e o que acontece com `src/`; se ele não responder, siga com A, mantendo o protótipo `.dc.html` funcionando até a versão nova ter as dez telas (os sócios estão usando o link para testar).

Se for A: o `AGENTS.md` da raiz avisa que esta versão do Next tem mudanças. Leia o guia em `node_modules/next/dist/docs/` antes de escrever código. Não apague `src/` sem o Gabriel; mova para uma pasta de legado com um aviso ou combine com ele.

### Onde olhar no Autofluxos (`/home/gabfelix/dev/4yu-apps/autofluxos-ux`)

| Arquivo | O que tem |
| --- | --- |
| `src/components/design/shell.tsx` | Moldura do painel: no desktop, sidebar como coluna fixa e só o conteúdo rola (`md:h-screen md:overflow-hidden`); no celular, a barra vira faixa no topo |
| `src/components/design/cliente-shell.tsx` | Comentário explica por que a sidebar saiu da página e foi para o `layout.tsx`: ela era redesenhada a cada página e piscava em todo clique |
| `src/app/clientes/[clienteId]/layout.tsx` | Onde a sidebar mora de fato (`BarraDoCliente` e `MolduraDoCliente`) |
| `src/components/design/barra-lateral.tsx`, `barra-do-cliente.tsx` | Itens, grupos, recolher |
| `src/components/design/barra-de-lista.tsx` | Barra de lista com busca, "Filtros" em popover e filtros ativos removíveis (o padrão que Viagens já segue) |
| `src/app/globals.css`, linhas 110 a 270 | Tokens de cor: `--canvas #f6f7f9`, `--canvas-deep #eef0f4`, `--panel #fff`, `--surface #f2f4f7`, `--line #e5e8ec`, `--ink #131922`, `--muted #4f5967`, e o tema escuro |

Avalie os padrões; não copie componentes. A sidebar do Autofluxos é clara com borda; a do Traxium é teal escura e flutuante, aprovada (`SaaS moderno estilo Dribbble/CLAUDE.md`). Trocar a sidebar para clara só como opção mostrada em captura, nunca por conta própria.

## 4. Parte 2: fundo e tokens

1. **Tokens antes de cor.** Hoje as cores estão escritas à mão em estilo inline em todas as telas (`#f2f5f4`, `#e4eae8`, `#5c706e`, `#7c8f8d` e outras). Defina tokens (fundo, fundo profundo, painel, superfície, borda, borda forte, texto, texto secundário, texto apagado, primário, e os semânticos verde, âmbar e vermelho) e passe as telas a usá-los. É o que permite testar fundos sem editar dez arquivos.
2. **Fundo:** mostre ao Gabriel duas ou três opções lado a lado em 1366x768, por exemplo o fundo atual, um neutro esverdeado claro no espírito do `--canvas` do Autofluxos e um com a faixa do header em `--canvas-deep`. Paleta aprovada: teal `#127670`, `#0C5862`, `#093D44`, azul `#0E78B5`; verde `#1a8f57`, âmbar `#b97514`/`#e8a33d`, vermelho `#c43d3d`.
3. Painéis com borda de 1 px e pouca sombra, como no Autofluxos, combinam com os cartões brancos de raio 18 a 20 px já aprovados.

## 5. Parte 3: revisão página por página

Ordem: Hoje, Viagens, Viagem, Link da Viagem (390x844), Transportadores, Frota própria, Compartimento, Auditoria, Cadastros, Configurações. Uma tela por etapa, com captura antes e depois em 1366x768 e 1920x1080.

Os critérios de produto da primeira rodada continuam (`HANDOFF.md`, seção 6). Desta vez o foco é boa prática de interface. O que conferir em cada tela:

| Tema | O que olhar | Como está hoje (pontos já percebidos, confirme) |
| --- | --- | --- |
| Elementos clicáveis | Botão é `button`, link é `a`; clicável por teclado (Tab, Enter, espaço) | Quase toda ação é `<span onClick>` ou `<div onClick>`: não recebe foco nem responde ao teclado |
| Foco visível | Anel de foco em tudo que é interativo | Estilos inline tiram o contorno de campos (`outline:none`) e não há foco visível |
| Contraste | Texto pelo menos AA (4,5:1) | Cinzas `#7c8f8d` e `#9db0ae` sobre branco provavelmente não passam; meça |
| Escala tipográfica | Poucos tamanhos com papel claro (título, subtítulo, corpo, legenda, rótulo) | Há muitos tamanhos próximos (10,5; 11; 11,5; 12; 12,5; 13; 13,5; 14; 14,5; 15; 15,5; 16) |
| Espaçamento | Escala fixa (múltiplos de 4) entre blocos e dentro dos cartões | Valores variados em cada tela |
| Hierarquia | Um título, uma ação primária por área, secundárias com peso menor | Revisto nas rodadas anteriores; confirmar depois da moldura nova |
| Estados | Carregando, vazio, erro e sucesso em toda lista e todo envio | Carregando existe (esqueleto); vazio existe na maioria; erro quase não existe |
| Formulários | Rótulo visível ligado ao campo, mensagem de erro junto do campo, botão desabilitado que diz o que falta | O Link da Viagem já faz isso; os modais de escritório não |
| Tabelas | Cabeçalho alinhado às colunas, colunas numéricas à direita, linha inteira clicável quando abre detalhe | São grades de `div`; conferir alinhamento em 1366 px |
| Modais e drawers | Foco preso dentro, Esc fecha, foco volta ao botão que abriu | Esc fecha; foco preso e retorno não existem |
| Alvo de clique | Pelo menos 32 px no escritório e 44 px no celular | Links de texto pequenos ("Atualizar", "Entrar como") |
| Consistência | Mesmo componente para a mesma coisa em todas as telas (botões, chips, seletores, abas, avisos) | Com a moldura nova, extrair componentes compartilhados resolve boa parte |

Cada achado entra numa lista por tela; resolva, teste e registre.

## 6. Pendências que vieram da rodada anterior

1. Em Hoje, "Vencimentos", "Ver todos" leva a Transportadores; o vencimento de fornecedor aparece na lista mas não nesse destino.
2. Sidebar em altura abaixo de 600 px ainda sobra 8 px de rolagem (com a moldura nova, a sidebar deve rolar por dentro sem cortar o rodapé).
3. Premissas abertas no `HANDOFF.md`, seção 7 (convite de usuário, busca local, data no Link).

## 7. Como trabalhar

- Regras do Gabriel: `HANDOFF.md`, seção 9. Resumo: uma etapa por vez, captura antes e depois, bateria, commit em português com coautoria, registro do que mudou; sem travessão e sem ponto médio em texto; nenhum botão sem ação; não adicionar por adicionar; decidir com premissa reversível e registrar; mostrar progresso e entregar por partes.
- Ele é designer de UX e direto: não peça a ele o que é decisão técnica sua, nem acesso a conta. Pergunte só o que é escolha de produto ou de gosto (por exemplo, o fundo), mostrando as opções em captura.
- Push quando a etapa estiver pronta e testada; publicação na Vercel só quando ele pedir.
- Registre cada etapa no fim deste arquivo, seção 8, no mesmo formato de `07-revisao-v2.md` (problema, o que mudou, premissas).

## 8. Registro

### Etapa 1. Moldura única no Next.js (15/10/2026)

**Problema.** Cada tela era um `.dc.html` com a própria cópia da sidebar e do header. Todo clique recarregava a página inteira e redesenhava a moldura; a sidebar dependia de `position:sticky` em cada tela e, abaixo de 600 px de altura, sobrava rolagem.

**O que mudou.**

1. O app Next.js da raiz agora é o protótipo v2. Sidebar, header com busca global, menu da pessoa, modais do topo e toast são um componente só (`src/components/moldura/moldura.tsx`), montado em `src/app/(painel)/layout.tsx`. Trocar de tela troca só o conteúdo.
2. No desktop a página não rola: a sidebar é uma coluna na altura da janela e quem rola é a área de conteúdo (`[data-tx-conteudo]`). A sidebar rola por dentro em tela baixa; o rodapé não some mais (pendência 2 da seção 6 resolvida).
3. Rotas: `/hoje`, `/viagens`, `/viagem?id=`, `/transportadores`, `/frota`, `/compartimento?placa=&pos=`, `/auditoria`, `/cadastros?aba=`, `/configuracoes` e `/link?id=` (fora da moldura). Os parâmetros de antes continuam, inclusive `&liberar=1` e `#ocorrencias`. A raiz leva a `/hoje`.
4. As dez telas foram convertidas por `scripts/converter-dc.mjs`, que transforma o template e a classe de lógica de cada `.dc.html` num componente React com a mesma semântica (null seguro, `sc-if`, `sc-for`, `style-hover` em classe CSS). O resultado está em `src/telas/*.jsx` e já é código do app: o conversor não sobrescreve sem `--forcar`.
5. `tx-dados.js` passou para `src/lib/tx/` com as rotas novas; `tx-ui.js` virou módulo e perdeu a parte da moldura. `TX.ui.montar` agora tem par: `desmontar` tira ouvintes e temporizadores quando a tela sai.
6. Quando a mesma rota recebe outro parâmetro de fora (busca global, link, voltar do navegador), a tela monta de novo; quando a própria tela reescreve a URL (aba de Cadastros, filial de Hoje, drawer de Transportadores, por `TX.ui.trocarUrl`), não monta e o estado continua (`src/components/tela/chave-da-tela.tsx`).
7. Na moldura, o que é clicável virou `button` ou link com foco visível; o item aceso usa `aria-current`; os diálogos do topo prendem o foco, fecham com Esc e devolvem o foco ao avatar. As telas em si ainda são as do protótipo: isso é a Parte 3.
8. Tokens de cor criados em `src/app/globals.css` e usados pela moldura. As telas ainda têm as cores escritas à mão: isso é a Parte 2.
9. O v1 em Next foi para `legado/v1-next/` com aviso, sem apagar nada; os testes de domínio dele rodam com `pnpm test:legado` (127 passam). O protótipo `.dc.html` continua intacto em `SaaS moderno estilo Dribbble/` e é copiado para `public/prototipo/` no build: "Versão anterior" abre por lá.

**Teste.** Bateria da seção 2 do `HANDOFF.md` adaptada às rotas novas e movida para `scripts/` na raiz, mais `scripts/e2e-moldura.cjs` (21 conferências: sem recarregar ao trocar de tela, sidebar recolhida e acordeão mantidos, só o conteúdo rola, voltar e avançar do navegador, link direto, busca global na mesma rota, subitem de Cadastros, foco do diálogo, tela de 560 px e Link fora da moldura). Tudo passa. Capturas de Viagens antes e depois em 1366x768 e 1920x1080: idênticas no conteúdo.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Opção A do handoff (Next.js da raiz), seguida sem esperar resposta, como o próprio handoff manda | Se o Gabriel preferir manter só o `.dc.html`, o protótipo antigo está intacto; a moldura nova serve de referência para a opção B |
| O v1 em `src/` vira legado em `legado/v1-next/`, sem apagar | Apagar a pasta, ou voltá-la a um app separado, quando ele decidir |
| As telas ficam em `.jsx` sem tipos, convertidas fiéis; tipar e extrair componentes vem na revisão tela a tela | Tipar tudo agora custaria a revisão inteira antes de qualquer melhoria visível |
| A tela monta de novo a cada navegação, com o esqueleto de carregamento de 650 ms do protótipo | Se piscar demais, encurtar ou mostrar o esqueleto só na primeira visita |
| Publicação: o projeto Vercel `traxium-prototipo` publica a pasta estática; o app Next precisa de um projeto com raiz no repositório (o `traxium` da outra conta já aponta para a raiz) | Quando o Gabriel quiser publicar, escolher o projeto e ligar o build Next |

### Etapa 2. Tokens de cor nas telas (15/10/2026)

**Problema.** As cores estavam escritas à mão em estilo inline nas dez telas (cerca de 1.200 ocorrências de 30 tons). Testar outro fundo, ou corrigir um cinza que reprova em contraste, exigia editar todas.

**O que mudou.**

1. Tokens em `src/app/globals.css`: fundo (`--fundo`, `--fundo-fundo`), painel, superfícies, quatro níveis de borda, cinco de texto (`--texto`, `--texto-2`, `--texto-sec`, `--texto-apagado`, `--texto-desab`), marca (`--primario`, `--primario-2`, `--primario-3`, `--azul`) e semânticas com bordas e fundos (`--ok`, `--aviso`, `--perigo`, `--tecnico`).
2. As telas e `TX.ui` (tons, seleção, botão primário) passaram a usar `var(--token)`. Ficaram de fora, de propósito: as pontas de degradê dos regimes e dos avatares (arte, não tema), o HTML das exportações (abre em outra aba, sem os tokens) e as cores fixas em atributo de SVG. Três ícones que recebiam cor por atributo passaram a receber por `style`, porque `var()` não vale em atributo de SVG.
3. Dois tons quase iguais viraram um só: `#dfe7e5` e `#e0e7e5` (borda de campo), `#f5f8f7` e `#f7faf9` (superfície).

**Teste.** Captura das dez telas antes e depois comparada pixel a pixel: só ruído de antialiasing de fonte. Bateria inteira passa.

### Etapa 3. Opções de fundo (15/10/2026)

Três opções mostradas ao Gabriel em captura de 1366x768 (Hoje e Viagens): A, o fundo atual (`#f2f5f4`); B, um neutro esverdeado mais claro (`#f7f9f8`), no espírito do `--canvas` do Autofluxos; C, a moldura no tom mais fundo (`--fundo-fundo`, `#e9efed`) com o conteúdo numa folha clara de borda fina e canto de 20 px. As variantes estão em `src/components/moldura/moldura.css`, ligadas por `data-fundo` no `<html>`; a escolhida vira o padrão e as outras saem.

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Até a escolha, fica o fundo atual (A) | Trocar o padrão é mudar dois tokens e tirar as variantes |

### Etapa 4. Contraste, teclado e foco em todas as telas (15/10/2026)

Os três primeiros temas da tabela da seção 5 valem igual para as dez telas; resolvidos de uma vez, pelo mesmo padrão, antes da revisão tela a tela.

**Problema.** Medido contra a superfície mais escura em que texto cai (`#f0f4f3`): o cinza `#7c8f8d`, usado 111 vezes, dava 3,07:1; o placeholder, 2,49:1; o verde de texto, 3,71:1; o âmbar de texto, 3,37:1; o cinza secundário `#5c706e`, 4,74:1 (passava no branco, não na superfície). O cinza claro de "desabilitado" (2,05:1) também aparecia como informação ("ainda não", "nenhuma", situação não assegurada). Quase toda ação era `div` ou `span` com `onClick`: sem foco e sem teclado. Os campos tinham `outline:none` inline e nenhum foco visível. Os modais das telas fechavam com Esc, mas o foco ficava atrás deles e não voltava.

**O que mudou.**

1. Tokens: `--texto-sec` `#526664` (5,50:1 na superfície), `--texto-apagado` `#5f7270` (4,59:1), `--placeholder` `#66797a` (4,58:1 no branco dos campos), `--ok` `#177d4c` (4,65:1), `--aviso` `#9a6210` (4,59:1). `--texto-desab` ficou só para controle desabilitado, que a WCAG isenta; os usos informativos passaram para `--texto-apagado`. Na sidebar, rótulos de grupo e nome da empresa subiram de 40% e 50% para 58% e 62% de branco.
2. Os 167 clicáveis feitos de `div` ou `span` ganharam `role="button"` e `tabIndex`; `src/components/tela/teclado.tsx` faz Enter e espaço acionarem. Véus de modal ficaram de fora (o clique fora tem o Esc como par no teclado).
3. Foco visível: anel de 2 px no primário em tudo que recebe foco por teclado. Campo com borda própria ganha o anel; campo sem borda dentro de uma caixa acende a borda da caixa.
4. Os oito painéis de modal e drawer das telas viraram `role="dialog" aria-modal="true"`. Ao abrir, o foco vai para o primeiro campo (no celular, para o próprio diálogo, para não abrir o teclado por cima); Tab circula por dentro; ao fechar, o foco volta a quem abriu.

**Teste.** `e2e-moldura.cjs` ganhou cinco conferências de teclado (Enter abre o modal de Frota, foco entra, Tab fica dentro, Esc fecha e devolve o foco, campo em foco acende a caixa). Bateria inteira passa.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Os cinzas sobem de contraste mesmo ficando mais próximos entre si; a hierarquia passa a depender mais de peso e tamanho | Se o Gabriel achar a tela pesada, clarear só o que é texto grande (acima de 18 px, que pede 3:1) |
| `role="button"` em `div` é o caminho mais curto e fiel ao visual; trocar por `<button>` vem com os componentes compartilhados, tela a tela | Nenhuma: é o mesmo destino, por partes |

### Etapa 5. Escala tipográfica (15/10/2026)

**Problema.** 24 tamanhos de fonte nas telas, muitos a meio pixel um do outro (10,5; 11; 11,5; 12; 12,5; 13; 13,5; 14; 14,5; 15; 15,5; 16; 17...). Hoje sozinha usava 18; Viagem, 15. Tamanho próximo não comunica papel diferente, só parece descuido.

**O que mudou.** Sete degraus no escritório, cada um com papel: 11 rótulo, 12 legenda, 13 corpo denso de tabela, 14 corpo e controles, 16 título de cartão, 20 número de destaque, 24 título de página; 32 e 40 ficam para o número grande do painel. Meio pixel arredonda para cima a partir de 12,5 (12,5 vira 13, 13,5 vira 14), o que deixa o corpo levemente maior; 9 a 10,5 viram 11, e 17 vira 16. A escala está anotada em `globals.css`. O Link do motorista fica de fora: a escala de celular entra na revisão dele.

**Teste.** `scripts/conferir-largura.cjs` novo: em 1366x768, 15 estados das nove telas sem estouro lateral e sem rótulo de botão quebrado em duas linhas. Bateria inteira passa.

### Etapa 6. Espaçamento em múltiplos de 4 (15/10/2026)

**Problema.** Entre blocos e dentro dos cartões havia 13, 14, 18, 22, 26 px lado a lado com 12, 16, 20, 24; padding de cartão em `20px 22px`, `13px 15px`, `26px 28px`.

**O que mudou.** `gap`, margem vertical e `padding` de contêiner a partir de 12 px arredondados para o múltiplo de 4 mais próximo (empate para cima): 31 gaps, 41 margens e 80 paddings nas nove telas do escritório. O espaçamento miúdo de controle (abaixo de 12 px, como o `9px 12px` de um botão) ficou, para não mudar a altura de botões e campos já aprovados. Link do motorista fica para a etapa dele.

**Teste.** `conferir-largura.cjs` sem estouro nem quebra em 1366 px; bateria inteira passa.

### Etapa 7. Hoje (15/10/2026)

**Problema.** Na Nova viagem, os rótulos eram `div` soltos (leitor de tela não sabia de que campo eram), o cadastro mínimo do motorista só tinha placeholder como rótulo, e o botão apagado listava sempre os seis campos, mesmo os já preenchidos. Horário "25:99" ou peso zero só deixavam o botão apagado, sem dizer por quê; o regex aceitava qualquer HH:MM. Os chips de embarcador e destinatário (contorno teal) e os de dia (preenchidos de escuro) tinham dois estilos de selecionado no mesmo formulário e não diziam a leitor de tela qual estava escolhido. "Ver todos" de Vencimentos levava a Transportadores, onde vencimento de fornecedor e de frota não aparece (pendência 1 da seção 6). Ações em texto ("Abrir a mesa da filial", "usar ordem de exemplo", "Ver a viagem") tinham alvo de 16 a 18 px. Texto cortado com reticências não tinha como ser lido inteiro.

**O que mudou.**

1. Componentes de formulário compartilhados em `src/components/ui/formulario.tsx`: `Campo` (rótulo `label` ligado, erro junto do campo com `aria-invalid` e `aria-describedby`), `Escolhas` (grupo de rádio com um só chip de selecionado) e `listaFalta`. Servem às próximas telas.
2. Nova viagem: rodapé diz só o que falta ("Falta: produto e peso."). O botão apagado continua clicável: mostra o erro de cada campo pendente e leva o foco ao primeiro. Horário com máscara (1830 vira 18:30) e conferência de faixa; peso de 1 a 80 t. Erro de formato aparece já ao digitar; erro de campo vazio, só depois de tentar seguir. Cadastro mínimo com rótulos visíveis e erros por campo.
3. Vencimentos: "Ver todos (N)" abre a lista inteira ali mesmo; cada item já leva ao lugar dele (transportador, frota própria ou fornecedor em Cadastros). Pendência 1 resolvida.
4. Ação em texto ganhou classe `tx-acao-texto`: o texto fica onde estava e o alvo cresce para 32 px.
5. Em todas as telas: texto cortado com reticências mostra o conteúdo inteiro como dica ao passar o ponteiro (`teclado.tsx`).

**Teste.** `scripts/e2e-ui.cjs` novo, para esta revisão: rodapé com o que falta, quatro erros junto dos campos, foco no primeiro, rótulo ligado, máscara e faixa do horário, rádio marcado, Ver todos com fornecedor, alvo de 32 px. Bateria inteira passa; `conferir-largura.cjs` sem estouro.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Peso de uma viagem fica entre 1 e 80 t (rodotrem chega a 74 t de PBT) | Trocar o limite em `pesoOk` |
| Vencimentos fica completo em Hoje, sem tela própria | Se a lista crescer muito, virar uma visão em Transportadores que inclua fornecedor e frota |

### Etapa 8. Viagens, e campos e arquivos em todas as telas (15/10/2026)

**Problema.** Em Viagens a tabela já estava certa (cabeçalho na mesma grade das linhas, linha inteira é link para a viagem, vazio por visão). O que faltava se repetia nas outras telas: 20 campos tinham só placeholder, sem nome para leitor de tela; sete botões "✕" não tinham nome; os quatro seletores de arquivo (ordem em PDF, lote de CT-e, planilha de transportadores, evidência da liberação) usavam `display:none`, fora do alcance do Tab, e aceitavam qualquer arquivo sem dizer nada.

**O que mudou.**

1. Campo sem rótulo visível ganhou `aria-label` com o texto do placeholder; "✕" ganhou nome "Fechar".
2. Seletor de arquivo escondido só visualmente (`tx-so-leitor`): entra no Tab e acende a área de envio no foco.
3. `TX.ui.conferirArquivo` confere formato, arquivo vazio e tamanho (limite de 20 MB). O erro aparece logo abaixo da área de envio, diz o nome do arquivo e o que enviar ("cte.pdf" não é planilha nem XML de CT-e. Envie XML, CSV, XLSX ou ZIP.). Evidência da liberação passa a aceitar PDF e foto.

**Teste.** `e2e-ui.cjs`: PDF errado na Nova viagem, formato errado no lote, nome da busca, linha como link, nome do ✕, seletor de arquivo pelo teclado. Bateria inteira passa.

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Limite de 20 MB por arquivo | Ajustar em `conferirArquivo` quando houver backend com limite real |

### Etapa 9. Viagem, e rótulos ligados em todas as telas (15/10/2026)

**Problema.** A Viagem tem nove modais com formulário (devolver ao motorista, liberar por autoridade, manter o bloqueio, regularizar quarentena, trocar o conjunto, registrar limpeza, registrar ocorrência, retificar e cancelar). Todos deixavam o botão apagado sem dizer o que faltava; o mínimo de caracteres vinha escrito dentro do rótulo e não havia contagem. Os rótulos eram `div` soltos, em caixa alta em uns modais e em frase em outros ("MOTIVO (MÍNIMO 15 CARACTERES)" ao lado de "3. Justificativa (...)").

**O que mudou.**

1. Cada modal calcula a lista do que falta; o rodapé mostra ao lado dos botões ("Falta: motivo, justificativa (faltam 11 caracteres), risco residual..."), atualizada a cada tecla. Clicar no botão apagado leva o foco ao primeiro campo de texto pendente. Os botões do rodapé não quebram linha.
2. Rótulo visível logo antes de um campo virou `<label>` ligado a ele, em frase, nas telas que tinham esse padrão (Viagem 11, Configurações 2, Transportadores 2, Frota 1).

**Teste.** `e2e-ui.cjs`: no modal de liberação, rodapé lista os sete itens que faltam, conta os caracteres da justificativa, botão apagado leva à justificativa, rótulo ligado. Bateria inteira passa.
