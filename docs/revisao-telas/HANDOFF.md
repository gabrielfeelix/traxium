# Handoff: protótipo v2 revisado por inteiro e pente fino passado

Atualizado em 15/10/2026, ao fim da segunda rodada (quatro telas restantes e pente fino). Ponto de entrada para quem continuar. Substitui as versões de 08/10 e de 14/10 deste arquivo. As regras visuais de `SaaS moderno estilo Dribbble/CLAUDE.md` e `SaaS moderno estilo Dribbble/HANDOFF.md` (v1) continuam valendo.

## 1. Situação

1. O protótipo v2 (10 telas em `SaaS moderno estilo Dribbble/`) foi construído nas fases A a F (`05-plano-de-construcao.md`) e aprovado pelo Gabriel: "preferi bem mais a versão atual". É a base daqui em diante. O v1 continua no disco, listado em `versao-anterior.html`.
2. Em 14/10/2026 o Gabriel pediu três coisas: fechar lacunas do v2 em relação ao v1, revisar a interface tela a tela pensando como o usuário (Viagens tinha filtros demais) e avaliar o Autofluxos como referência visual. Isso foi feito em sete etapas, uma por commit, de `26866bb` a `69f1804`, na branch `fix/ux-fase-1-3`. **O registro de cada etapa, com o problema visto, o que mudou e as premissas, está em `07-revisao-v2.md`. Leia antes de mexer.**
3. Os sete commits **não foram enviados ao GitHub** e **nada foi publicado na Vercel** (`traxium-prototipo.vercel.app` ainda serve o v1). Push e publicação só com pedido explícito do Gabriel.
4. Em 14 e 15/10/2026 a segunda rodada reviu as quatro telas que faltavam (etapas 8 a 11: Cadastros, Configurações, Compartimento, Link da Viagem) e resolveu os doze itens do pente fino, um commit por item, de `35c69f3` a `62dd1ad`. Registro em `07-revisao-v2.md`, seções "Etapa 8" em diante e "Pente fino". Também não enviados nem publicados.

## 2. Como rodar e verificar

- Servidor: `python3 -m http.server 8765` dentro de `SaaS moderno estilo Dribbble/`. Abrir `http://localhost:8765/` (redireciona para Hoje). HTML estático, sem build.
- O servidor e a pasta temporária da sessão caíram mais de uma vez entre turnos. Antes de capturar, confira com `curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/` e suba de novo em segundo plano se precisar.
- Dados: tudo fica no `localStorage` (chave `tx-v2`) como log de operações sobre a semente. A semente está na **versão 10**; ao subir a versão, o log antigo é descartado. Para voltar ao início: Configurações, "Voltar à semente", ou `localStorage.clear()`.
- Usuário da sessão: menu do avatar no header, "Entrar como". Rafael Antunes (qualidade, alçada de qualidade, todas as filiais) é o padrão. Diego Saldanha (afretador de Sorriso, sem alçada) mostra a mesa e o "Pedir liberação". Luiz Fernando Bastos (Direção e RT) assina o que pede Direção.
- Captura: `node scripts/capturar.cjs <saida.png> <tela> [largura] [altura] [1|0] [js]`, versionado nesta rodada. Sai com erro se a tela tiver erro de JavaScript. Use 1366x768 e 1920x1080.
- Chromium em `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`; `playwright-core` em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core`.

Bateria (rodar dentro de `SaaS moderno estilo Dribbble/`, servidor de pé). Tudo passava em 15/10/2026 ao fim do commit `62dd1ad`:

| Comando | O que confere |
| --- | --- |
| `node scripts/testar-tx-dados.mjs` | 674 conferências da base: referências, contagens, viagens canônicas, F1, F3, fila de assinatura e pedido de liberação, persistência |
| `node scripts/gerar-sidebar.mjs --conferir` | Assinatura única de sidebar nas 9 telas com sidebar (sai com código 1 se divergir) |
| `node scripts/conferir-v2.mjs` | Links quebrados, travessão, ponto médio, clicável sem ação, tags desbalanceadas |
| `node scripts/e2e-f1.cjs http://localhost:8765 <pasta>` | F1 no navegador: mesa, link do motorista, conferência, declaração, nova viagem |
| `node scripts/e2e-f5.cjs http://localhost:8765 <pasta>` | Auditoria (amostra, gatekeeper, ocorrências), Cadastros e Configurações com efeito no motor, erros de JavaScript em todas as telas |
| `node scripts/e2e-revisao.cjs http://localhost:8765 <pasta>` | Fluxos das duas rodadas de revisão: pedido de liberação (Hoje e Viagem), fila de assinatura, visões de Viagens, busca global, planilha de ocorrências, Cadastros, Configurações, Compartimento, datas DD/MM/AAAA, drawer de Transportadores e o Link em 390x844 |
| `node scripts/varrer-texto.cjs` | Texto renderizado de 61 estados sem travessão, ponto médio, `undefined`, `NaN` ou `null` |

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

Acrescentado na primeira rodada à base: operação `pedirLiberacao` (grava em `v.pedidosLib`, entra na linha do tempo); funções `liberacaoDe(v)`, `podeAssinar(u, alcada)` e `filaAssinatura(u)`, que devolve `{ minhas, acima }`.

Acrescentado na segunda rodada: `convitesUsuario` na semente (v10) com `convidarUsuario` e `cancelarConviteUsuario`; `atualizarDocumento` aceita `fornecedor`. Em `TX.ui`: `pedirLiberacao` e `nomeAlcada` (Hoje e Viagem), `mascaraData`, `dataIso` e `avisoData` (todo campo de data de escritório é texto DD/MM/AAAA; o Link do motorista mantém o nativo), `sbAtivo` (item ativo da sidebar escolhido pelo dado; no gerador, `dinamico` em `TELAS`), espaçamentos da sidebar para tela baixa (`sbPad`, `sbSubPad`, `sbGrupoPad`, `sbBaseD`, abaixo de 730 px de altura) e o header que acompanha a rolagem lateral abaixo de 1280 px.

## 4. Telas do v2 hoje

Moldura comum: sidebar flutuante e arredondada com três grupos (Operação: Hoje, Viagens; Quem transporta: Transportadores, Frota própria; Qualidade: Auditoria, Cadastros em acordeão aberto), rodapé com Configurações, Link do motorista, Versão anterior, base IDTF e Recolher. Header fixo com busca global ("/" foca, Esc fecha, Enter abre o primeiro resultado ou Viagens com o termo) e o menu da pessoa.

| Tela | Estado depois da rodada | Revista tela a tela? |
| --- | --- | --- |
| `Hoje.dc.html` | Mesa com barra de resumo; linha bloqueada com Liberar ou Pedir liberação; painel com "Esperando sua assinatura" | Sim (etapa 2) |
| `Viagens v2.dc.html` (`?visao=`, `?q=`, `?periodo=`, `?situacao=`, `?conciliar=1`) | Visões em abas (Limpeza exigida, Aguardando CT-e, Liberadas por autoridade, Com ocorrência e as salvas), filtros numa linha com popover, 6 colunas | Sim (etapa 1) |
| `Viagem.dc.html` (`?id=`, `&liberar=1`) | Checagens recolhidas por padrão; `&liberar=1` abre o modal; quem não assina vê Pedir liberação | Sim (etapa 5 e pente fino, item 2) |
| `Transportadores.dc.html` (`?id=`, `?filtro=vencendo`) | Situações em abas com contagem, tipo em seletor segmentado, 6 colunas; drawer sem repetição e convite coerente | Sim (etapa 4 e pente fino, item 5) |
| `Frota.dc.html` | Sem cartões; lista em dois grupos por escopo | Sim (etapa 6) |
| `Auditoria.dc.html` (`?q=`, `#ocorrencias`) | Período com atalhos e datas DD/MM/AAAA; lista de apoio "Ocorrências do período" com documento e planilha | Sim (etapa 3) |
| `Compartimento v2.dc.html` (`?placa=&pos=`) | Hero responde "pode carregar ração?", mostra o T-3 e leva à viagem que regulariza a quarentena; sidebar destaca Frota ou Transportadores pelo dono | Sim (etapa 10) |
| `Cadastros.dc.html` (`?aba=`, `?q=`, `&id=` em fornecedores) | Título diz a seção; abas na página só com a sidebar recolhida; regime em seletor; Atualizar em documento de fornecedor | Sim (etapa 8) |
| `Configuracoes v2.dc.html` | Âncoras abaixo do header, menu lateral acompanha a rolagem, Convidar usuário | Sim (etapa 9) |
| `Link da Viagem.dc.html` (`?id=`) | Botão apagado diz o que falta e leva até lá; testado em 390x844 | Sim (etapa 11) |

## 5. Lacunas em relação ao v1

1. Ocorrências exportáveis: **fechada** (etapa 3).
2. Fila "esperando sua assinatura": **fechada** em Hoje (etapa 2) e na Viagem (pente fino, item 2).
3. Entradas para o que virou seção: **fechada** com as visões de Viagens (etapa 1) e a busca global (etapa 7).
4. Cadastros escondido: **fechada** (etapa 7).
5. Academy com prova e matriz de competência, ciclo de não conformidade, os 15 indicadores, governança da base IDTF: **dependem do Gabriel e do Rafael. Não reconstruir sem pedido.** Detalhe em `03-diagnostico.md`, seção 6.

Fora por decisão consciente: tema escuro, mapa e rastreio por GPS, hash de bloco do dossiê na tela.

## 6. As quatro telas que faltavam: feito

Cadastros, Configurações, Compartimento e Link da Viagem foram revistas em 14 e 15/10/2026 (etapas 8 a 11 de `07-revisao-v2.md`), com o mesmo método e os seis critérios da primeira rodada: em 5 segundos o usuário entende a tela e a próxima ação; toda informação serve a uma decisão; filtro só onde há volume; uma ação primária por área e nenhum botão sem ação; cabe em 1366 px e fica bem em 1920 px; subaba só onde há área central (Cadastros).

## 7. Pente fino: feito; o que ficou em aberto

Os doze itens foram resolvidos (`07-revisao-v2.md`, seção "Pente fino"). Pontos que ficaram como premissa e podem voltar:

1. **Convite de usuário** (etapa 9): o gestor da qualidade convida; Direção e RT não se convida pela tela; o convite não expira. Se a Traxium criar os acessos na implantação, trocar o botão por "Pedir acesso à Traxium".
2. **Busca local** (item 6): ficou, dizendo "Filtrar". Se confundir em teste com usuário, tirar e deixar o header filtrar a lista da tela.
3. **Data no Link do motorista** (etapa 11): campo nativo, porque segue o idioma do celular. Se aparecer motorista com celular em outro idioma, usar a máscara de `TX.ui`.
4. **Hoje, "Vencimentos" "Ver todos"** leva a Transportadores filtrado; vencimento de fornecedor entra na lista de Hoje mas não nesse "Ver todos". Não mexido; pequeno.
5. **Sidebar abaixo de 600 px de altura** sobra uma rolagem de 8 px. Aceitável.

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
| `07-revisao-v2.md` | **Revisão do v2 (14 e 15/10/2026)**: etapas 1 a 11, os doze itens do pente fino, premissas e a situação ao fim |
| `00-plano.md` | Etapas da revisão do v1 e os seis critérios |
| `01-inventario.md` e `inventario/*.md` | Inventário factual das 21 telas do v1 |
| `evidencia-auditoria-real.md` | O que o auditor GMP+ verificou de fato |
| `02-usuarios-e-trabalhos.md` | Quem compra, quem usa, trabalhos por momento |
| `03-diagnostico.md` | Veredito por tela do v1, perguntas ao Rafael, divergências com a diretriz |
| `04-arquitetura-proposta.md` | Navegação v2, fluxos F1 a F6, modelo de dados |
| `05-plano-de-construcao.md` | Premissas, telas, base comum, fases A a F e registro de execução |
| `06-analise-como-usuario.md` | Caminhada como afretador, motorista e qualidade |
| `reports/Concorrentes e fluxos do Traxium.md` e `research_notes/` | Pesquisa de mercado |
