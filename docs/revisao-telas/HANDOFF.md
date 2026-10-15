# Handoff: protótipo v2 revisado, falta fechar quatro telas e passar o pente fino

Atualizado em 14/10/2026, ao fim da rodada de revisão. Ponto de entrada para quem continuar. Substitui as versões de 08/10 e de 14/10 (manhã) deste arquivo. As regras visuais de `SaaS moderno estilo Dribbble/CLAUDE.md` e `SaaS moderno estilo Dribbble/HANDOFF.md` (v1) continuam valendo.

## 1. Situação

1. O protótipo v2 (10 telas em `SaaS moderno estilo Dribbble/`) foi construído nas fases A a F (`05-plano-de-construcao.md`) e aprovado pelo Gabriel: "preferi bem mais a versão atual". É a base daqui em diante. O v1 continua no disco, listado em `versao-anterior.html`.
2. Em 14/10/2026 o Gabriel pediu três coisas: fechar lacunas do v2 em relação ao v1, revisar a interface tela a tela pensando como o usuário (Viagens tinha filtros demais) e avaliar o Autofluxos como referência visual. Isso foi feito em sete etapas, uma por commit, de `26866bb` a `69f1804`, na branch `fix/ux-fase-1-3`. **O registro de cada etapa, com o problema visto, o que mudou e as premissas, está em `07-revisao-v2.md`. Leia antes de mexer.**
3. Os sete commits **não foram enviados ao GitHub** e **nada foi publicado na Vercel** (`traxium-prototipo.vercel.app` ainda serve o v1). Push e publicação só com pedido explícito do Gabriel.
4. O Gabriel pediu, ao fechar a rodada: "faz um handoff pro agente continuar o que falta e passar um pente fino". As seções 6 e 7 são exatamente isso.

## 2. Como rodar e verificar

- Servidor: `python3 -m http.server 8765` dentro de `SaaS moderno estilo Dribbble/`. Abrir `http://localhost:8765/` (redireciona para Hoje). HTML estático, sem build.
- O servidor e a pasta temporária da sessão caíram mais de uma vez entre turnos. Antes de capturar, confira com `curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/` e suba de novo em segundo plano se precisar.
- Dados: tudo fica no `localStorage` (chave `tx-v2`) como log de operações sobre a semente. A semente está na **versão 9**; ao subir a versão, o log antigo é descartado. Para voltar ao início: Configurações, "Voltar à semente", ou `localStorage.clear()`.
- Usuário da sessão: menu do avatar no header, "Entrar como". Rafael Antunes (qualidade, alçada de qualidade, todas as filiais) é o padrão. Diego Saldanha (afretador de Sorriso, sem alçada) mostra a mesa e o "Pedir liberação". Luiz Fernando Bastos (Direção e RT) assina o que pede Direção.
- Captura: `node scripts/capturar.cjs <saida.png> <tela> [largura] [altura] [1|0] [js]`, versionado nesta rodada. Sai com erro se a tela tiver erro de JavaScript. Use 1366x768 e 1920x1080.
- Chromium em `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`; `playwright-core` em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core`.

Bateria (rodar dentro de `SaaS moderno estilo Dribbble/`, servidor de pé). Tudo passava em 14/10/2026 ao fim do commit `69f1804`:

| Comando | O que confere |
| --- | --- |
| `node scripts/testar-tx-dados.mjs` | 669 conferências da base: referências, contagens, viagens canônicas, F1, F3, fila de assinatura e pedido de liberação, persistência |
| `node scripts/gerar-sidebar.mjs --conferir` | Assinatura única de sidebar nas 9 telas com sidebar (sai com código 1 se divergir) |
| `node scripts/conferir-v2.mjs` | Links quebrados, travessão, ponto médio, clicável sem ação, tags desbalanceadas |
| `node scripts/e2e-f1.cjs http://localhost:8765 <pasta>` | F1 no navegador: mesa, link do motorista, conferência, declaração, nova viagem |
| `node scripts/e2e-f5.cjs http://localhost:8765 <pasta>` | Auditoria (amostra, gatekeeper, ocorrências), Cadastros e Configurações com efeito no motor, erros de JavaScript em todas as telas |
| `node scripts/varrer-texto.cjs` | Texto renderizado de 44 estados sem travessão, ponto médio, `undefined`, `NaN` ou `null` |

## 3. Arquitetura técnica (o que importa para mexer)

| Arquivo | Papel |
| --- | --- |
| `tx-dados.js` | `window.TX`: semente, motor de decisão (`TX.decidir`), persistência por log (`TX.fazer`). Roda também em Node. |
| `tx-ui.js` | `TX.ui`: sidebar (badges, recolher, Cadastros aberto por padrão), sessão, perfil, toast, paginação, estilos de seleção, exportação, **busca global do header** (`buscaGlobal`) e o atalho "/". |
| `scripts/gerar-sidebar.mjs` | Definição única da sidebar **e do header fixo** (busca global, nome, papel, avatar) e dos modais do topo. Reescreve os blocos entre `<!-- TX:SIDEBAR -->`, `<!-- TX:PERFIL -->` (hoje vazio, o avatar foi para o header) e `<!-- TX:MODAIS -->`. **Nunca edite esses blocos à mão nas telas**: mude o gerador e rode `node scripts/gerar-sidebar.mjs`. |
| `support.js` | Runtime dos `.dc.html`. Gerado, não editar. |

Regras do template: dentro de `{{ }}` só caminho (`a.b.c`), `===`, `!==`, `!` e literais; toda condição e todo texto composto saem prontos de `renderVals()`. Eventos: `onClick`, `onInput`, `onChange`, `onKeyDown`, mouse e pointer. Hover por `style-hover`. Estilos inline. Popovers dentro de `data-tx-pop` fecham com clique fora e Esc; o estado `popAberto` é o que `TX.ui.montar` zera. Modais usam `modal`, drawers usam `drawer`.

Tela nova ou alterada: copiar `<head>` e `<helmet>` de uma tela v2; pôr os três marcadores; registrar em `TELAS` de `gerar-sidebar.mjs`, de `conferir-v2.mjs` e de `varrer-texto.cjs`; `componentDidMount() { TX.ui.montar(this); }`; `renderVals()` devolve `Object.assign({}, TX.ui.base(this), ...)`. O conteúdo logo após a sidebar usa `padding:92px 32px 48px` por causa do header fixo, e o wrapper raiz usa `min-width:1280px`.

Funcionalidade nova que escreve: criar o `case` em `aplicar()`, cobrir em `testar-tx-dados.mjs` e, se mudar o formato da semente, subir `VERSAO_SEMENTE`.

Acrescentado nesta rodada à base: operação `pedirLiberacao` (grava em `v.pedidosLib`, entra na linha do tempo); funções `liberacaoDe(v)`, `podeAssinar(u, alcada)` e `filaAssinatura(u)`, que devolve `{ minhas, acima }`.

## 4. Telas do v2 hoje

Moldura comum: sidebar flutuante e arredondada com três grupos (Operação: Hoje, Viagens; Quem transporta: Transportadores, Frota própria; Qualidade: Auditoria, Cadastros em acordeão aberto), rodapé com Configurações, Link do motorista, Versão anterior, base IDTF e Recolher. Header fixo com busca global ("/" foca, Esc fecha, Enter abre o primeiro resultado ou Viagens com o termo) e o menu da pessoa.

| Tela | Estado depois da rodada | Revista tela a tela? |
| --- | --- | --- |
| `Hoje.dc.html` | Mesa com barra de resumo; linha bloqueada com Liberar ou Pedir liberação; painel com "Esperando sua assinatura" | Sim (etapa 2) |
| `Viagens v2.dc.html` (`?visao=`, `?q=`, `?periodo=`, `?situacao=`, `?conciliar=1`) | Visões em abas (Limpeza exigida, Aguardando CT-e, Liberadas por autoridade, Com ocorrência e as salvas), filtros numa linha com popover, 6 colunas | Sim (etapa 1) |
| `Viagem.dc.html` (`?id=`, `&liberar=1`) | Checagens recolhidas por padrão; `&liberar=1` abre o modal de liberação | Sim (etapa 5) |
| `Transportadores.dc.html` (`?id=`, `?filtro=vencendo`) | Situações em abas com contagem, tipo em seletor segmentado, 6 colunas | Lista sim (etapa 4); drawer e modais não |
| `Frota.dc.html` | Sem cartões; lista em dois grupos por escopo | Sim (etapa 6) |
| `Auditoria.dc.html` (`?q=`, `#ocorrencias`) | Período com atalhos e datas DD/MM/AAAA; lista de apoio "Ocorrências do período" com documento e planilha | Sim (etapa 3) |
| `Compartimento v2.dc.html` | Só moldura nova e `min-width` | **Não** |
| `Cadastros.dc.html` (`?aba=`, `?q=` em produtos) | Só moldura nova, `min-width` e `?q=` | **Não** |
| `Configuracoes v2.dc.html` | Só moldura nova e `min-width` | **Não** |
| `Link da Viagem.dc.html` (`?id=`) | Intocada (superfície móvel, sem sidebar) | **Não** |

## 5. Lacunas em relação ao v1

1. Ocorrências exportáveis: **fechada** (etapa 3).
2. Fila "esperando sua assinatura": **fechada** em Hoje (etapa 2). Ver o item 2 da seção 7: falta na Viagem.
3. Entradas para o que virou seção: **fechada** com as visões de Viagens (etapa 1) e a busca global (etapa 7).
4. Cadastros escondido: **fechada** (etapa 7).
5. Academy com prova e matriz de competência, ciclo de não conformidade, os 15 indicadores, governança da base IDTF: **dependem do Gabriel e do Rafael. Não reconstruir sem pedido.** Detalhe em `03-diagnostico.md`, seção 6.

Fora por decisão consciente: tema escuro, mapa e rastreio por GPS, hash de bloco do dossiê na tela.

## 6. O que falta: as quatro telas não revistas

Mesmo método das etapas 1 a 7: captura antes (1366x768 e 1920x1080), lista de problemas como usuário daquela tela, mudança, captura depois, bateria da seção 2, registro em `07-revisao-v2.md` e commit por tela. Critérios (do pedido do Gabriel):

1. Em 5 segundos o usuário entende para que serve a tela e qual é a próxima ação.
2. Toda informação serve a uma decisão; a que não serve sai ou recolhe.
3. Filtro só onde há volume: busca, no máximo dois filtros fixos, o resto em popover. Nada filtra a mesma coisa duas vezes (o padrão que se repetiu nesta rodada foi cartão de resumo mais chip para o mesmo recorte).
4. Uma ação primária por área; nenhum botão sem ação.
5. Cabe em 1366 px sem rolagem lateral e fica bem em 1920 px.
6. Subaba só onde há uma área central que abre outras telas (Cadastros é o caso; as demais telas são fluxos que se resolvem em si).

Ordem sugerida e o que olhar em cada uma:

| Tela | Para quem | O que olhar |
| --- | --- | --- |
| `Cadastros.dc.html` | Qualidade | As abas na página repetem os subitens do acordeão da sidebar: decidir se a página mantém as abas (o Gabriel gostou de "abas que abrem subabas") ou se só a sidebar navega. Produtos: filtro por regime em 6 chips, avaliar seletor. Manual e treinamentos, Fornecedores e Filiais: conferir 1366 px. |
| `Configuracoes v2.dc.html` | Qualidade, administração | Navegação lateral por âncoras: avaliar se convive bem com o header fixo (a âncora pode cair embaixo do header de 72 px; usar `scroll-margin-top`). "Usuários" não cria usuário: decidir convite real ou deixar claro que é demonstração. |
| `Compartimento v2.dc.html` | Qualidade, auditor ao lado | Tela simples; conferir hero e histórico em 1366 px e se "próxima carga de ração" e quarentena ficam claros. |
| `Link da Viagem.dc.html` | Motorista no celular | Testar em 390x844. Não tem sidebar nem header e não deve ganhar. Conferir o campo de data nativo (é celular brasileiro, o formato do sistema deve servir, mas confirmar). |

## 7. Pente fino: problemas já identificados

Achados ao fechar a rodada, em ordem de prioridade. Cada um é pequeno; resolver, testar e registrar.

1. **Testes não cobrem os fluxos novos.** `e2e-f1.cjs` e `e2e-f5.cjs` não exercitam nada desta rodada. Acrescentar (pode ser um `e2e-revisao.cjs` novo): Diego pede liberação da VG-3121 em `Hoje.dc.html?filial=SOR`, a linha muda de texto e some a ação; Rafael vê a VG-3121 no topo de "Esperando sua assinatura" e "Analisar e assinar" abre `Viagem.dc.html?id=VG-3121&liberar=1` com o modal; abas de Viagens (`?visao=limpeza` mostra VG-3119 e VG-3116; `?visao=sem_cte` mostra 3); salvar e apagar visão; busca global por "QVT" traz viagens e compartimentos; Enter sem resultado vai para Viagens; exportação CSV de ocorrências.
2. **A Viagem não oferece "Pedir liberação".** O afretador só consegue pedir pela linha de Hoje. No cartão de decisão da Viagem bloqueada, quem não tem alçada deveria ver "Pedir liberação" (mesma operação `pedirLiberacao`) ou, se já pediu, "Liberação pedida às HH:MM". Hoje a Viagem mostra "Liberar por autoridade" só para quem pode assinar (`podeLib` em `Viagem.dc.html`).
3. **`varrer-texto.cjs` não inclui os estados novos.** Acrescentar: `Viagens%20v2.dc.html?visao=limpeza`, `?visao=sem_cte`, `?visao=autoridade`, `?visao=ocorrencia`; `Hoje.dc.html?filial=todas` com Luiz (fila com duas viagens); busca global aberta; popover de período da Auditoria.
4. **Campo de data nativo em Transportadores** (modal de atualizar documento, `data-tx-campo="validade"`, linha 248): tem o mesmo problema que foi corrigido na Auditoria (formato do idioma do navegador). Trocar pelo padrão DD/MM/AAAA com máscara usado em `Auditoria.dc.html` (funções `iso` e `mascara` dentro de `renderVals`); considerar mover essas duas funções para `tx-ui.js`. Atenção: `e2e-f5.cjs` preenche esse campo.
5. **Drawer de Transportadores não foi revisto**: documentos, conjuntos, motoristas da ETC, viagens, ocorrências, convite e revisão num painel só. Conferir densidade e 1366 px.
6. **Busca local mais busca global em Hoje e Viagens.** Hoje tem a busca da mesa ("Placa, ordem, motorista") logo abaixo da busca global do header. Decidir se a local fica (filtra a lista visível, o que é diferente de buscar em tudo) e, se ficar, deixar o placeholder dizer que filtra só a lista.
7. **Header fixo abaixo de 1280 px**: o wrapper rola de lado, mas o header é `position:fixed` e não acompanha. Baixa prioridade (o alvo é 1366 px), mas conferir em 1280 px.
8. **Sidebar em 768 px de altura com Cadastros ativo**: sobra uma rolagem pequena dentro da sidebar e "Recolher menu" fica no limite. Conferir em `Cadastros.dc.html` em 1366x768.
9. **Frota**: em 1366 px o nome "Calcário" corta no compartimento do conjunto fora do escopo (o nome inteiro aparece no `title`). Aceitável; melhorar se sobrar tempo.
10. **Esc na busca global** fecha a lista mas mantém o texto. Decidir se o segundo Esc limpa.
11. **Consistência de rótulos entre telas**: a mesma situação aparece como "Pronta para assegurar", "Prontas", "Pronta por autoridade" e "Liberada por autoridade" conforme a tela. Fazer uma passada lendo as telas lado a lado e alinhar onde for a mesma coisa.
12. **Revisão de texto**: passar `node scripts/varrer-texto.cjs` depois de cada item e ler as capturas procurando frase longa demais, frase que repete o título e termo técnico sem explicação para o afretador.

## 8. Referência visual: Autofluxos

Repositórios em `/home/gabfelix/dev/4yu-apps/` (`autofluxos-ux` é o mais recente em UX). O que foi aproveitado: rótulos de grupo na sidebar, header fixo, sidebar retrátil, barra de lista com "Filtros" em popover e filtros ativos removíveis (`src/components/design/barra-de-lista.tsx`). A sidebar de lá é clara e com borda; a do Traxium manteve o teal e ficou flutuante. Não copiar componentes; avaliar padrões.

## 9. Regras do Gabriel que valem sempre

- Uma tela ou um ajuste por vez. Captura antes e depois, bateria da seção 2 e commit ao fim de cada etapa, em português, formato convencional, com a linha de coautoria. Push e Vercel só quando ele pedir.
- Nenhum botão sem ação: toda ação deixa efeito visível onde o usuário espera; toast é só confirmação.
- Texto de UI e documentos sem travessão nem ponto médio; tom impessoal; datas absolutas.
- Visual aprovado: Hanken Grotesk e Spline Sans Mono; teal `#127670`, `#0C5862`, `#093D44`, azul `#0E78B5`; verde `#1a8f57`, âmbar `#b97514`/`#e8a33d`, vermelho `#c43d3d`; cards brancos com raio de 18 a 20 px; ponto com anel e barras com degradê e hachura, nada de fill pastel chapado; primário em degradê teal para azul; nada de emoji.
- Não adicionar por adicionar: tela ou fluxo novo só onde fizer sentido de fato. Academy, não conformidades, indicadores e governança da base IDTF esperam decisão dele e do Rafael.
- Quando faltar dado, decidir com premissa reversível e registrar numa tabela "premissa / o que muda se a resposta vier diferente". Não esperar os sócios.
- Ele é impaciente com análise longa sem entrega: mostrar progresso e entregar por partes.

## 10. Em aberto (fora desta etapa)

- Perguntas ao Rafael: `03-diagnostico.md` seção 5 e `06-analise-como-usuario.md` seção 6. Premissas que as substituem: `05-plano-de-construcao.md` seção 1.
- PDFs da Control Union na máquina do Gabriel (`D:\Downloads`), fora do repositório por terem dados pessoais. Resumo em `evidencia-auditoria-real.md`.
- Nome do produto: sugestões do Rafael (Vantix ou Vantrix, TrustWay, Rovier System); sem decisão.
- `ola.txt` na raiz é transcrição de sessão antiga, fora do git. Não versionar sem pedido.

## 11. Mapa dos documentos

| Arquivo | Conteúdo |
| --- | --- |
| `07-revisao-v2.md` | **Rodada de 14/10/2026**: as sete etapas, o que mudou, premissas e a situação ao fim |
| `00-plano.md` | Etapas da revisão do v1 e os seis critérios |
| `01-inventario.md` e `inventario/*.md` | Inventário factual das 21 telas do v1 |
| `evidencia-auditoria-real.md` | O que o auditor GMP+ verificou de fato |
| `02-usuarios-e-trabalhos.md` | Quem compra, quem usa, trabalhos por momento |
| `03-diagnostico.md` | Veredito por tela do v1, perguntas ao Rafael, divergências com a diretriz |
| `04-arquitetura-proposta.md` | Navegação v2, fluxos F1 a F6, modelo de dados |
| `05-plano-de-construcao.md` | Premissas, telas, base comum, fases A a F e registro de execução |
| `06-analise-como-usuario.md` | Caminhada como afretador, motorista e qualidade |
| `reports/Concorrentes e fluxos do Traxium.md` e `research_notes/` | Pesquisa de mercado |
