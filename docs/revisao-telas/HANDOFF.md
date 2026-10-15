# Handoff: protótipo v2 construído, próxima etapa é lacunas e revisão de interface

Atualizado em 14/10/2026. Ponto de entrada para quem continuar. Substitui a versão de 08/10/2026 deste arquivo. As regras visuais de `SaaS moderno estilo Dribbble/CLAUDE.md` e `SaaS moderno estilo Dribbble/HANDOFF.md` (v1) continuam valendo.

## 1. Situação

1. Entre 08/10 e 14/10/2026 o protótipo v1 (21 telas) foi revisado contra o mercado, a norma e uma auditoria GMP+ real (documentos 00 a 06 desta pasta). Conclusão: o v1 acertava a regra e errava o usuário.
2. O protótipo v2 foi construído nas fases A a F de `05-plano-de-construcao.md`, uma por commit, de `34e2e4c` a `7f8ea8a`, na branch `fix/ux-fase-1-3`, já enviada ao GitHub (`gabrielfeelix/traxium`). O registro de execução e as diferenças em relação ao plano estão na seção 6 de `05-plano-de-construcao.md`.
3. O Gabriel aprovou a direção: "preferi bem mais a versão atual". O v2 é a base daqui em diante. O v1 continua no disco, listado em `versao-anterior.html`.
4. Publicação na Vercel do v2: **não feita**. Só com autorização explícita do Gabriel. O endereço atual `traxium-prototipo.vercel.app` ainda serve o v1.

**O que o Gabriel pediu para a próxima etapa** (mensagem de 14/10/2026, em resumo):

- Verificar se o v2 perdeu telas, funcionalidades ou usabilidade em relação ao v1. Onde perdeu e fizer sentido, criar fluxo ou tela nova. "Não só para adicionar, tem que fazer sentido de fato."
- Revisar cada tela como usuário, em interface e usabilidade: dá para entender rápido? Tem informação demais ou coisa jogada? Está bonita e intuitiva? Há telas com filtros demais e sem organização, que precisam ser enxugadas.
- Avaliar como referência visual o sistema Autofluxos (seção 8): header fixo, sidebar retrátil e arredondada com fundo bonito, abas que abrem subabas. Ele mesmo ponderou que o Traxium é feito de fluxos, em que cada tela se resolve em si e abre novos fluxos, então subabas só fazem sentido onde houver uma área central que abre outras telas, como um acordeão.

## 2. Como rodar e verificar

- Servidor: `python3 -m http.server 8765` dentro de `SaaS moderno estilo Dribbble/`. Abrir `http://localhost:8765/`, que redireciona para `Hoje.dc.html`. Não há build: é HTML estático, recarregar basta.
- Dados: tudo o que se faz nas telas fica no `localStorage` do navegador (chave `tx-v2`) como log de operações sobre a semente. Para voltar ao início: Configurações, "Voltar à semente", ou `localStorage.clear()`.
- Usuário da sessão: menu do avatar, "Entrar como". Rafael Antunes (qualidade, todas as filiais) é o padrão. Diego Saldanha (afretador de Sorriso) mostra a mesa. Luiz Fernando Bastos (Direção e RT) assina o que pede Direção.
- Chromium em `~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`; `playwright-core` em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core`.

Bateria de verificação (rodar dentro de `SaaS moderno estilo Dribbble/`, com o servidor de pé). Tudo passava em 08/10/2026:

| Comando | O que confere |
| --- | --- |
| `node scripts/testar-tx-dados.mjs` | 660 conferências da base: referências, contagens, três viagens canônicas, fluxos F1 e F3, persistência |
| `node scripts/gerar-sidebar.mjs --conferir` | Assinatura única de sidebar (ordem, itens, badges) nas 9 telas com sidebar |
| `node scripts/conferir-v2.mjs` | Links quebrados, travessão, ponto médio, elemento clicável sem ação, tags desbalanceadas |
| `node scripts/e2e-f1.cjs http://localhost:8765 <pasta>` | F1 no navegador em duas abas: mesa, link do motorista, conferência, declaração liberada, nova viagem |
| `node scripts/e2e-f5.cjs http://localhost:8765 <pasta>` | F5 (auditoria), Cadastros e Configurações com efeito no motor, varredura de erros de JavaScript em todas as telas |
| `node scripts/varrer-texto.cjs` | Texto renderizado de 44 estados sem travessão, ponto médio, `undefined`, `NaN` ou `null` |

Ao mudar uma tela: rodar a bateria, tirar captura com Playwright e olhar a imagem. Quadro em branco é falha.

## 3. Arquitetura técnica do v2

### Arquivos

| Arquivo | Papel |
| --- | --- |
| `tx-dados.js` | `window.TX`. Semente, motor de decisão e persistência. Também roda em Node (o teste carrega o arquivo). |
| `tx-ui.js` | `TX.ui`. Valores comuns às telas: sidebar (badges, recolher), sessão, perfil, avisos, toast, paginação de 25, estilos de seleção, botão desabilitado, exportação em aba nova. |
| `scripts/gerar-sidebar.mjs` | Definição única da sidebar, do bloco de perfil e dos modais do topo. Reescreve os trechos entre `<!-- TX:SIDEBAR -->`, `<!-- TX:PERFIL -->` e `<!-- TX:MODAIS -->` de cada tela. |
| `support.js` | Runtime dos `.dc.html` (gerado, não editar). As telas v2 **não** carregam `prototype-shell.js`. |
| `*.dc.html` | Uma tela por arquivo: `<x-dc>`, `<helmet>`, template com `{{ }}`, `<sc-for>`, `<sc-if>`, e `class Component extends DCLogic` com `renderVals()`. |

### Regras do template (runtime)

- Dentro de `{{ }}` só cabem caminho (`a.b.c`), `===`, `!==`, `!` e literais. Toda condição e todo texto composto se calcula em JS e chega pronto.
- Eventos aceitos: `onClick`, `onInput`, `onChange`, `onKeyDown`, eventos de mouse e de pointer (a assinatura com o dedo usa `onPointerDown`, `onPointerMove` e `onPointerUp`).
- `style-hover="..."` cria o hover. Estilos são todos inline.
- O console mostra avisos `<path> attribute d: Expected moveto` quando um `d` vem de `{{ }}`. É ruído de parse do template, não é erro.

### Base comum (`tx-dados.js`)

- `HOJE` fixo em `2026-10-08`. `TX.agoraHM()` usa a hora real no expediente e cai entre 10:00 e 10:59 fora dele, para os prazos não aparecerem todos vencidos à noite.
- Semente: Transrural Log Ltda, 4 filiais (Rondonópolis matriz, Sorriso, Rio Verde, Paranaguá sem comunicação do gatekeeper ao OC), 8 usuários, 21 pessoas (CPF é a chave), 11 TACs e 3 ETCs (Cerrado certificada, Lima sob gatekeeper e em revisão por ocorrência grave, Transrocha certificada com certificado vencendo), 6 conjuntos próprios (4 no escopo GMP+), 30 produtos IDTF com sinônimos e regime, 30 viagens (15 passadas, 13 de hoje, 2 de amanhã), ocorrências, treinamentos, manual em duas versões, termo, fornecedores, simulação de rastreabilidade.
- Viagens canônicas: **VG-3116** TAC pronta, **VG-3117** frota própria pronta, **VG-3118** TAC com bloqueio técnico (cama de frango no T-2). A **VG-3122** começa com link não enviado e é o ponto de partida da demonstração do F1.
- `TX.decidir(viagem)` deriva checagens, resultado (`pronta`, `falta`, `bloqueada`, `tecnico`, `nao_assegurada`, `cancelada`) e a lista do que falta com quem resolve. Estado nunca é campo editável.
- Escrita: `TX.fazer(tipo, dados)` valida, grava no log, reconstrói e avisa as telas, inclusive de outras abas pelo evento `storage`. Operações existentes: `criarViagem`, `enviarLink`, `linkAberto`, `linkCpf`, `linkDocs`, `linkT3`, `linkChecklist`, `linkManual`, `linkAssinar`, `conferir`, `registrarLimpeza`, `liberar`, `manterBloqueio`, `regularizar`, `trocarConjunto`, `registrarOcorrencia`, `revisarTransportador`, `cadastrarTransportador`, `convidar`, `atualizarDocumento`, `escopoFrota`, `conciliarCTe`, `cancelarViagem`, `retificar`, `comunicarOC`, `registrarTreinamento`, `registrarSimulacao`, `pedirClassificacao`, `cadastrarFornecedor`, `publicarManual`, `classeRegra`.
- Funcionalidade nova que escreve: criar o `case` em `aplicar()`, cobrir no `testar-tx-dados.mjs` e, ao mudar o formato da semente, subir `VERSAO_SEMENTE` (o log antigo é descartado).

### Tela nova ou alterada

1. Copiar o `<head>` e o `<helmet>` de uma tela v2 (carregam `tx-dados.js`, `tx-ui.js` e `support.js`, nessa ordem).
2. Pôr os três marcadores. Se a tela tem sidebar, registrar o arquivo e o item ativo em `TELAS` de `gerar-sidebar.mjs`, rodar o script e conferir a assinatura.
3. `componentDidMount() { TX.ui.montar(this); }`: cuida de clique fora, Esc, skeleton e recarga quando a base muda. Modais usam o estado `modal`; drawers usam `drawer`. São os nomes que o Esc fecha.
4. `renderVals()` devolve `Object.assign({}, TX.ui.base(this), ...valores da tela)`.
5. Acrescentar a tela a `TELAS` em `conferir-v2.mjs` e a `telas` em `varrer-texto.cjs`.

## 4. As telas do v2

Sidebar canônica: Hoje (badge: viagens de hoje com pendência no escopo do usuário), Viagens, Transportadores (badge: documentos vencidos ou vencendo em 15 dias), Frota própria, Auditoria; grupo Cadastros, recolhido (Produtos e regimes, Manual e treinamentos, Fornecedores, Filiais); rodapé com Configurações, Link do motorista (abre em outra aba a VG-3122) e Versão anterior.

| Tela | Para quem | O que tem | Notas para a revisão de interface |
| --- | --- | --- | --- |
| `Hoje.dc.html` (`?filial=`) | Afretador; qualidade em "todas" | **Filial:** 4 contadores, grupos Falta algo, Bloqueadas e Prontas, linha com janela, motorista, ordem e placas, 5 etapas, estado do link com hora, o que falta e quem resolve, ação na linha. Nova viagem em 3 passos (ordem por PDF ou mínima; placa ou CPF com cadastro mínimo; mensagem do link). **Todas as filiais:** prontidão para auditoria, cards por filial, pendências de registro, vencimentos, última simulação. | É a tela mais importante. Os contadores também funcionam como filtro e repetem os grupos logo abaixo: avaliar se precisam existir. Na linha cabem nove informações; conferir a leitura no notebook. Falta o bloco "esperando sua assinatura" (seção 6). |
| `Viagem.dc.html` (`?id=`) | Afretador, qualidade, direção | Cabeçalho com ordem, CT-e, NF, filial e placas; decisão em quatro formatos (pronta com a declaração para copiar; falta algo com ação por item; bloqueada com liberação por autoridade; bloqueio técnico com troca de conjunto ou regularização TS1.9); 6 passos; checagens; T-3 por compartimento; verificação com 5 fotos e conferência; limpeza; linha do tempo; rail com transportador, conjunto, link, registro para auditoria e ocorrências; menu Ações. | Tela de referência e a mais densa. Pergunta para a revisão: o rail direito com 5 cards e o bloco Checagens repetem o que a decisão já diz? Avaliar recolher o que estiver ok e destacar só o que falta. |
| `Viagens v2.dc.html` | Qualidade, afretador | Lista com busca (placa, CT-e, NF, ordem, motorista, RNTRC), período, tipo, filial, situação com contagem, visões salvas, paginação de 25, exportação CSV, conciliação de CT-e em lote (`?conciliar=1`). | **É a tela "de 55 mil filtros"**: 3 linhas de controles, cerca de 27 chips antes da tabela. Precisa ser enxugada (seção 7). |
| `Transportadores.dc.html` (`?id=`, `?filtro=vencendo`) | Qualidade, afretador | 4 cards de resumo que filtram, busca, tipo, situação, tabela com documentos, viagens, ocorrências e convite na linha. Drawer com documentos atualizáveis, conjuntos, motoristas da ETC, viagens, ocorrências, convite e revisão após ocorrência grave. Cadastro com duplicidade pelos dígitos e importação de planilha. | Os 4 cards e os chips de situação filtram a mesma coisa duas vezes. A tabela tem 7 colunas; avaliar juntar documento e RNTRC com a identidade. |
| `Frota.dc.html` | Gestor de frota, qualidade | 4 cards, um card por conjunto (placas, motorista com CNH e treinamentos, compartimentos com as 3 últimas cargas, escopo GMP+ datado com incluir ou tirar), exportação da lista do escopo. | Tela curta e clara. Dois cards de resumo não filtram nada ("a vencer" e "viagens em 30 dias"); decidir se ficam. |
| `Compartimento v2.dc.html` (`?placa=&pos=`) | Qualidade, auditor ao lado | Hero com dono, próxima carga de ração e quarentena; histórico de cargas com regime, origem e limpeza; outros compartimentos; exportação. | Simples e boa. Só se chega por link de contexto, o que está certo. |
| `Auditoria.dc.html` (`?q=`) | Qualidade | Busca por placa, CT-e, NF ou ordem com período e tipo; tabela com as colunas que o auditor anota; seleção e amostra em documento único; listas de apoio (frota no escopo, treinamentos, protocolos gatekeeper); simulação de rastreabilidade cronometrada. | Os campos de data aparecem no formato do idioma do navegador. Falta a exportação de ocorrências entre as listas de apoio (seção 6). |
| `Cadastros.dc.html` (`?aba=`) | Qualidade | Abas Produtos e regimes (busca por sinônimo, filtro por regime, pedido de classificação à Traxium), Manual e treinamentos (versões, cartões, publicar versão, registrar treinamento), Fornecedores (com regime máximo), Filiais (registro, afretador, comunicação ao OC). | É o único lugar onde aba ou acordeão faz sentido de fato (seção 8). |
| `Configuracoes v2.dc.html` | Qualidade, administração | Usuários e papéis (com "Entrar como"), 3 alçadas, regras com classe e piso (a classe muda o motor), modelos copiáveis, LGPD e retenção, integrações, voltar à semente. | Navegação lateral por âncoras. Avaliar se "Usuários" precisa de convite real: hoje não se cria usuário. |
| `Link da Viagem.dc.html` (`?id=`) | Motorista, no celular | Capa, CPF com 3 dígitos, documentos que faltam, três últimas cargas por carreta com sugestão de produto e atalho "carregou o mesmo", checklist de 5 itens com foto, manual em 5 cartões, termo com assinatura com o dedo, fim. Fila sem sinal (botão "com sinal" na capa simula a queda). Mostra o pedido de foto nova quando a filial devolve. | Superfície móvel, sem sidebar. Não usar `min-width:1560px` aqui. |
| `versao-anterior.html`, `index.html` | | Lista das 21 telas do v1 com o destino de cada uma; o index redireciona para Hoje. | |

## 5. O que mudou de lugar em relação ao v1

| v1 | v2 |
| --- | --- |
| Torre de Controle | Hoje |
| Viagens, Viagem Detalhe | Viagens v2, Viagem (sem rastreio GPS e sem ciclo de balança) |
| Exceções e liberações | Liberar por autoridade (9 campos) e Manter bloqueio dentro da Viagem |
| Inspeções | Verificação do compartimento na Viagem; quem confere é o afretador |
| Limpezas | Seção de limpeza na Viagem; lavador em Fornecedores com regime máximo |
| Subcontratados, Motoristas, Acessos externos | Transportadores (convite na linha); motoristas próprios em Frota |
| Ativos e frota, Compartimento Detalhe | Frota própria, Compartimento v2 |
| Motor IDTF | Cadastros, Produtos e regimes (consulta e pedido de classificação) |
| Dossiê | Auditoria |
| Academy | Cadastros, Manual e treinamentos |
| Não conformidades | Ocorrência na Viagem, contada no transportador |
| Indicadores | Prontidão para auditoria no painel da qualidade |
| Onboarding público, App de campo | Link da Viagem |
| Console Traxium | Inalterado; continua no v1 |

## 6. Lacunas funcionais encontradas em 14/10/2026

Avaliação feita ao responder ao Gabriel. As quatro primeiras são ajustes que fazem sentido; a quinta é decisão de produto.

1. **Ocorrências da empresa.** A premissa da seção 1 do plano diz "exportável para o SGQ", e isso não foi construído. Hoje a ocorrência só aparece dentro da viagem e do transportador. Proposta: lista de apoio "Ocorrências do período" em Auditoria, com exportação no formato que a consultoria usa (data, viagem, transportador, tipo, gravidade, descrição, fotos, revisão), mais a visão "Com ocorrência" em Viagens. Não precisa de tela nova na sidebar.
2. **Fila de assinatura.** No v1, a Direção abria Exceções e via o que esperava por ela. No v2 não há essa visão. Proposta: no painel da qualidade (Hoje em todas as filiais), um bloco "Esperando sua assinatura", calculado pela alçada do usuário da sessão: viagens bloqueadas cuja regra a alçada dele libera, com prazo de carregamento. Para o afretador, a ação "pedir liberação" na linha avisa a alçada certa.
3. **Entradas para o que virou seção.** Quem procurava Limpezas ou Exceções não tem mais por onde entrar. Proposta: visões salvas de fábrica em Viagens ("Limpeza com comprovante pendente", "Liberadas por autoridade", "Com ocorrência", "Aguardando CT-e") e busca global no header (seção 8) que encontra viagem, placa, transportador e produto.
4. **Cadastros escondido.** O grupo começa recolhido e a sidebar parece vazia. Proposta: abrir por padrão, ou mostrar os quatro itens sem grupo. Decidir junto com a seção 8.
5. **Pilares cortados ou reduzidos que divergem da diretriz do P.O.:** Academy com trilhas, prova e matriz de competência; ciclo completo de não conformidade; os 15 indicadores; o lado Traxium do Motor IDTF (classificar, editar a base, simular, versões), que pela premissa da seção 1 fica no Console. Isso é decisão do Gabriel e do Rafael (ver `03-diagnostico.md`, seção 6). Não reconstruir sem pedido. Se pedirem, a ordem natural é: Console Traxium v2 com a governança da base IDTF; depois trilhas com prova como evolução de "Manual e treinamentos".

Também ficou de fora, por decisão consciente: tema escuro (o `prototype-shell.js` do v1 tinha; as telas v2 não carregam o shell), mapa e rastreio por GPS, hash de cada bloco do dossiê na tela.

## 7. Revisão de interface e usabilidade a fazer

Pedido do Gabriel: revisar uma por uma, pensando como o usuário daquela tela. Critérios:

1. Em 5 segundos, o usuário entende para que serve a tela e qual é a próxima ação?
2. Toda informação exibida serve a uma decisão? A que não serve sai ou recolhe.
3. Filtro só onde há volume. Padrão de mercado (`research_notes/.../padroes_ux_b2b.md`): busca, no máximo dois filtros fixos, botão "Filtros" com o resto num popover e visões salvas. Contagem dentro do chip só onde ajuda a decidir.
4. Nada filtra a mesma coisa duas vezes (card de resumo e chip para o mesmo recorte).
5. Uma ação primária por área. Ações de linha em menu quando passam de duas.
6. Bonita e intuitiva no visual aprovado (seção 9), sem fill pastel chapado, com estados vazio, carregando e erro.
7. Funciona em notebook de 1366 px e em 1920 px. Hoje o wrapper tem `min-width:1560px`: verificar o que acontece abaixo disso.

Problemas já conhecidos, por prioridade:

- **Viagens v2**: período (5 chips), tipo (3), filial (5), situação (8, com contagem) e visões (4 mais "salvar") ocupam três linhas. Proposta: busca larga, Período e Situação como dois seletores compactos, "Filtros" (tipo, filial) em popover com contador, visões salvas como abas discretas acima da tabela, "Limpar" só quando houver filtro ativo.
- **Transportadores**: cards de resumo e chips de situação duplicados. Deixar os cards como o único filtro de situação, ou trocar os cards por um resumo em uma linha.
- **Hoje**: contadores repetem os grupos. Avaliar transformar os contadores na própria navegação entre grupos, ou removê-los.
- **Viagem**: densidade. Rail com 5 cards mais checagens mais T-3 mais verificação mais linha do tempo. Avaliar abas internas só aqui (Resumo, Cargas e verificação, Linha do tempo), mantendo a decisão e os passos sempre visíveis.
- **Frota**: dois cards de resumo sem ação.
- **Auditoria**: hero escuro com busca, datas, tipo e simulação na mesma faixa. Conferir a leitura e as datas em pt-BR.

Método sugerido: para cada tela, captura antes, lista de problemas como usuário, mudança, captura depois, bateria da seção 2 e commit por tela.

## 8. Referência visual: Autofluxos

O Gabriel gosta do visual do Autofluxos e pediu para avaliar, não copiar. Repositórios em `/home/gabfelix/dev/4yu-apps/`. O mais recente em UX é `autofluxos-ux` (último commit `1e2d713f`, "docs(ux): onde parou depois da Fase 12 e da 12.2"). Também existem `autofluxos`, `autofluxos-casca` e `autofluxos-casca-pub`.

Onde olhar em `autofluxos-ux`:

- `src/components/design/barra-lateral.tsx`: sidebar retrátil.
- `src/components/design/moldura-do-cliente.tsx` e `cliente-shell.tsx`: moldura com header fixo e o fundo.
- `src/components/design/menu-de-ajustes.tsx`, `itens-de-ajustes.ts`, `aba-do-caminho.ts`: abas que abrem subabas.
- `src/components/design/barra-de-lista.tsx`, `dropdown.tsx`, `ajuda-da-tela.tsx`: padrões de lista, filtro e ajuda.
- `docs/BRIEF-UI.md` e `docs/ESTADO.md`: as decisões de interface de lá.

Leitura inicial, a validar com o Gabriel:

- **Header fixo**: faz sentido no Traxium. Pode levar a busca global (seção 6, item 3), a filial da sessão e o avatar, o que tiraria esses controles do topo de cada tela.
- **Sidebar arredondada e flutuante, com fundo**: compatível com o visual aprovado se mantiver a paleta teal e o item ativo em degradê. Mudar em `gerar-sidebar.mjs`, que propaga para todas as telas.
- **Abas com subabas, em acordeão**: no Traxium as telas são fluxos que se resolvem em si; não criar subaba onde não existe área central. Os candidatos reais são Cadastros (quatro itens que já são abas da mesma tela) e talvez Configurações. Hoje, Viagens, Transportadores, Frota e Auditoria não ganham nada com subaba.

## 9. Regras do Gabriel que valem sempre

- Commit ao fim de cada etapa, em português, no formato convencional, com a linha de coautoria. Push e publicação na Vercel só quando ele pedir.
- Nada de botão sem ação: toda ação deixa efeito visível onde o usuário espera; toast é só confirmação.
- Texto de UI e documentos internos sem travessão nem ponto médio; tom impessoal, sem assinatura, com datas absolutas.
- Visual aprovado: Hanken Grotesk e Spline Sans Mono; teal `#127670`, `#0C5862`, `#093D44` e azul `#0E78B5`; semânticas verde `#1a8f57`, âmbar `#b97514`/`#e8a33d`, vermelho `#c43d3d`; cards brancos com raio de 18 a 20 px; ponto com anel e barras com degradê e hachura em vez de fill pastel; botão primário em degradê teal para azul; nada de emoji.
- Sidebar idêntica em todas as telas, gerada de definição única; estrutura em `div`; dropdowns fecham com clique fora e Esc.
- Ele decide rápido e prefere opinião de produto fundamentada. Quando faltar dado, seguir com premissa reversível registrada, sem esperar os sócios.
- Ele é impaciente com análise longa sem entrega: mostrar progresso, entregar por partes.

## 10. Em aberto

- Perguntas ao Rafael: `03-diagnostico.md` seção 5 e `06-analise-como-usuario.md` seção 6. As premissas que as substituem estão em `05-plano-de-construcao.md` seção 1.
- Divergências com a diretriz do P.O. (Academy, estados de qualificação, dossiê, alçadas, indicadores): `03-diagnostico.md` seção 6.
- PDFs da Control Union na máquina do Gabriel (`D:\Downloads`), fora do repositório por terem dados pessoais. O resumo está em `evidencia-auditoria-real.md`.
- Nome do produto: o Rafael sugeriu Vantix ou Vantrix, TrustWay e Rovier System; não houve decisão.
- `ola.txt` na raiz é a transcrição de uma sessão antiga, fora do git. Não versionar sem pedido.

## 11. Mapa dos documentos

| Arquivo | Conteúdo |
| --- | --- |
| `00-plano.md` | Etapas da revisão e os seis critérios |
| `01-inventario.md` e `inventario/*.md` | Inventário factual das 21 telas do v1 |
| `evidencia-auditoria-real.md` | O que o auditor GMP+ verificou de fato |
| `02-usuarios-e-trabalhos.md` | Quem compra, quem usa, trabalhos por momento |
| `03-diagnostico.md` | Veredito por tela do v1, perguntas ao Rafael, divergências com a diretriz |
| `04-arquitetura-proposta.md` | Navegação v2, fluxos F1 a F6, modelo de dados |
| `05-plano-de-construcao.md` | Premissas, telas, base comum, fases A a F e registro de execução |
| `06-analise-como-usuario.md` | Caminhada como afretador, motorista e qualidade |
| `reports/Concorrentes e fluxos do Traxium.md` e `research_notes/` | Pesquisa de mercado (Quali-e, ATUA, padrões B2B, apps de campo, GMP+, EUDR) |
