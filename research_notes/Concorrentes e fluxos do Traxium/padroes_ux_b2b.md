# Padrões de UX para SaaS B2B operacional (back office): evidências para a arquitetura e as telas do Traxium

Coleta feita em 2026-10-08. Convenção destas notas: cada achado traz a fonte entre parênteses. Quando a fonte é opinião de praticante, blog de fornecedor ou resumo de mecanismo de busca (sem leitura da página primária), isso vem marcado. Termos de produto e de UI ficam no original.

## 1. Arquétipos de página (lista/tabela, detalhe, fila de trabalho, dashboard, wizard) e hierarquia de ações

### Takeaway
Os design systems convergem num esqueleto fixo: um page header por página (breadcrumb, título, ações à direita), no máximo uma ação primária por página ou por seção, ações de tabela concentradas em toolbar (até 5), ações de linha inline só quando são poucas (menos de 3) e o resto em overflow, ações em lote numa barra que aparece ao selecionar. Estados vazio, carregando e erro são parte do arquétipo, não acessórios.

### Cited Findings

**Page header (todas as páginas)**
- Atlassian: "Use one page header per page" e "Use a page header at the start of any page in Atlassian apps". Não usar page header dentro de popup, dialog ou drawer. Anatomia: breadcrumbs, título e busca/filtros alinhados à esquerda; ações (botões primary, secondary, subtle) alinhadas à direita, ao lado do título. A barra de busca e filtros faz parte do header ([Atlassian Design System, Page header](https://atlassian.design/components/page-header/usage)).
  - Relevância para o Traxium: padrão transversal. Todas as ~20 telas desktop devem abrir com o mesmo header (título, contexto, ação primária à direita). Resolve a sensação de "aleatório" quando cada tela posiciona ações de um jeito.
- Atlassian não especifica número máximo de ações no header ([Atlassian, Page header](https://atlassian.design/components/page-header/usage)).
- Salesforce Lightning Design System separa tipos de page header: base, object home (lista de um objeto, com list view switcher e meta text), record home (detalhe de registro, com faixa inferior de campos-chave), vertical e related list. Há uma coluna dedicada a "page actions" e uma linha de "controls" ([SLDS v1, Page headers](http://v1.lightningdesignsystem.com/components/page-headers/)). A página consultada é referência de classes CSS; não traz regras de quantidade de ações.
  - Relevância para o Traxium: a distinção "object home" (lista) vs "record home" (detalhe com campos-chave no topo) se aplica diretamente a Viagens vs Detalhe da viagem, Subcontratados vs ficha, Ativos e frota vs Detalhe do compartimento.

**Ação primária vs secundária**
- Atlassian (Forge UI Kit): botão primary é para submissão de formulário ou "the most important call to action on a page"; deve aparecer uma vez por área, e nem toda tela precisa de primary ([Atlassian Forge, Button](https://developer.atlassian.com/platform/forge/ui-kit-2/button)). Segundo resumo de busca, as guidelines do pacote Atlaskit recomendam um primary por seção, subtle para secundárias e danger com parcimônia (não verificado na página primária).
- Opinião de praticante (Nathan Curtis): exceção aceitável quando há um conjunto paralelo de objetos equivalentes (ex.: pilha de resultados), cada um com seu primary ([Medium, Buttons in Design Systems](https://medium.com/@nathanacurtis/buttons-in-design-systems-eac3acf7e23)).
  - Relevância para o Traxium: motor de consulta de produto. Os links "Ficha completa", "Editar matriz", "Classificar" lado a lado sob o resultado não têm hierarquia. Pela regra, o resultado deve ter uma ação principal (provavelmente "Ficha completa" ou "Classificar", conforme o objetivo da tela) e as demais em botão secundário ou overflow.

**Ações de tabela (toolbar, linha, lote)**
- Carbon: a toolbar da tabela é reservada a ações globais (configurações, filtros complexos, exportar, editar dados). "Include up to five actions within the table toolbar." Busca pode ficar sempre aberta sob o título. Tabela com ação primária segue a regra do primary button ([Carbon, Data table usage](https://carbondesignsystem.com/components/data-table/usage/)).
- Carbon, ações de linha: "When the overflow menu contains fewer than three options, keep the actions inline as icon buttons instead." O overflow fica visível em cada linha por padrão; há opção de mostrar só no hover/foco, mas em touch fica sempre visível ([Carbon, Data table](https://carbondesignsystem.com/components/data-table/usage/)).
- Carbon, ações em lote: ao selecionar um item, a batch action bar aparece no topo da tabela; durante o modo lote, ícones e overflow das linhas ficam desabilitados; sai-se por "Cancel" ou desmarcando tudo; a altura da barra iguala a da linha ([Carbon, Data table](https://carbondesignsystem.com/components/data-table/usage/)).
- NN/g: tabelas corporativas servem a quatro tarefas: "Find record(s) that fit specific criteria", "Compare data", "View, edit or add a single row's data", "Take action(s) on records". Ações inline numa linha ficam apertadas quando são muitas, e escondê-las em hover ou menu "Actions" prejudica a descoberta. Lote via checkbox + botões/menus; "Select All" é útil quando a ação costuma valer para o conjunto inteiro ([NN/g, Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/)).
- NN/g: a primeira coluna deve ser um identificador legível por humano, não um ID gerado ([NN/g, Data tables](https://www.nngroup.com/articles/data-tables/)).
- NN/g: para editar uma linha, opções são edição in place (só tabelas estreitas), modal, painel não modal e accordion; modais são desaconselhados para edição profunda porque cobrem registros vizinhos que o usuário consulta ([NN/g, Data tables](https://www.nngroup.com/articles/data-tables/)).
  - Relevância para o Traxium: Viagens, Exceções, Subcontratados, Motoristas, Inspeções, Limpezas, Não conformidades. Cada lista deve ter: toolbar com no máximo 5 ações globais, coluna 1 legível (placa, nome do motorista, nº da viagem), overflow por linha quando houver 3+ ações, barra de lote só se houver ação em lote real (ex.: atribuir responsável a várias exceções).

**Fila de trabalho / inbox**
- Linear Triage: "Triage is a special inbox for your team." Cada item tem um conjunto fechado de saídas: Accept (vai ao status padrão, com comentário opcional), Decline (status Canceled, com comentário opcional), Mark as duplicate (escolhe o item existente, migra anexos, cancela o novo), Snooze (some até uma data ou até nova atividade) e comentar mantendo na fila. Atalhos de teclado 1, 2, 3, H. Itens de triagem ficam fora das views normais por padrão ([Linear Docs, Triage](https://linear.app/docs/triage)).
  - Relevância para o Traxium: Control Tower (fila de decisão) e Exceções. O padrão responde ao "começo, fim" pedido pelo dono do produto: cada item da fila tem um número pequeno e explícito de desfechos (aprovar, recusar com motivo, marcar duplicado, adiar até X), e o item sai da fila ao receber um desfecho. "E se ninguém decidir?" corresponde ao snooze com retorno automático e a itens que voltam com nova atividade.

**Wizard / fluxo multi-etapas**
- GOV.UK: uma página "Check answers" imediatamente antes da confirmação em transações pequenas e médias; em transações grandes multi-seção, pode haver uma por seção (testar). Cada seção tem link "Change"; após a mudança o usuário volta à página de revisão sem refazer o fluxo; perguntas opcionais puladas aparecem como "Not provided"; o botão de envio nomeia a ação específica; deixar claro que nada foi concluído até confirmar ([GOV.UK Design System, Check answers](https://design-system.service.gov.uk/patterns/check-answers/)).
- Carbon: não usar pagination para jornadas lineares como progressão de formulário ([Carbon, Pagination](https://carbondesignsystem.com/components/pagination/usage/)).
  - Relevância para o Traxium: onboarding, cadastro de subcontratado, abertura de não conformidade, montagem do dossiê de auditoria, fluxos do app de campo (inspeção, limpeza). Dá o "fim" explícito: revisão + confirmação.

**Estados vazio, carregando, erro**
- Carbon, empty states: três tipos: sem dados (primeiro uso), resultado de ação do usuário (ex.: busca sem resultado, sugerir ajustar busca ou filtros) e erro (permissão, falha de sistema, configuração pendente). Estrutura: título curto (positivo quando possível), corpo explicando o próximo passo, uma ação primária e link secundário opcional. Uma tabela vazia não deve manter cabeçalho e rodapé; não cobrir várias opções num único empty state; evitar becos sem saída; em várias áreas vazias na mesma tela, usar botões terciários para não competir ([Carbon, Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)).
- Carbon: quando o carregamento demora, usar skeleton em vez de spinner ([Carbon, Data table](https://carbondesignsystem.com/components/data-table/usage/)).
  - Relevância para o Traxium: todas as listas. Distinguir "nenhum motorista cadastrado ainda" (primeiro uso, com ação de adicionar) de "nenhum resultado para estes filtros" (com "limpar filtros") e de "sem permissão" (acesso externo). Responde diretamente ao "e se X acontecer".

### Inferences
- Um contrato por arquétipo resolveria a sensação de telas "aleatórias". Lista: header com título + contagem + ação primária, faixa de filtros, tabela, paginação no rodapé, empty/loading/error. Detalhe: header com identificador, status, ações (Editar como secundária ou primária conforme o caso, demais em overflow), resumo de campos-chave, abas ou seções, histórico. Fila: item, desfechos fechados, saída do item. Wizard: etapas, revisão, confirmação.
- No motor de consulta de produto, o conjunto de links soltos sob o resultado contraria tanto a regra de um primary por área quanto a regra do Carbon (3+ ações vão para overflow). Esta é uma inferência minha, não uma prescrição das fontes para esse caso específico.

### Gaps
- A página de Page/Page actions do Polaris (Shopify) redireciona para shopify.dev e não pôde ser lida; as regras do Polaris sobre "primaryAction", "secondaryActions" e "More actions" ficaram sem verificação nesta coleta.
- A página do floorplan List Report e do Object Page do SAP Fiori retornou 403; só a parte de filter bar e draft handling foi obtida via versões antigas.
- Sem fonte primária sobre o arquétipo "dashboard" (layout, quantidade de cards). Não encontrei artigo da NN/g específico sobre isso nesta rodada.

## 2. Adicionar registros: criar manualmente vs convidar vs importar; botões "Add" com menu; fluxo de importação

### Takeaway
Quando há uma ação dominante e alternativas relacionadas, o padrão é split button (clique no rótulo executa a principal, a seta abre as alternativas); quando as opções têm o mesmo peso, usa-se dropdown simples. A importação tem uma sequência consolidada pela prática (template, upload, mapeamento, validação por linha, decisão sobre duplicados, resumo de resultado), embora a maior parte das fontes seja de praticantes e fornecedores, não de design systems.

### Cited Findings

**Split button vs dropdown**
- PatternFly: split button quando há "multiple actions related to each other, but one action is more likely or important than the rest"; o toggle só leva estilo primary quando é a ação principal da página ([PatternFly, Dropdown design guidelines](https://www.patternfly.org/components/menus/dropdown/design-guidelines/)).
- AEMO GEL: split button exige uma ação padrão; se todas as opções têm o mesmo peso, usar dropdown ([AEMO GEL, Split button](https://gel.aemo.com.au/docs/components/buttons-and-links/split-button)).
- Spiris/Visma: as ações do menu devem pertencer à mesma família da ação principal ([Spiris Design System, Split button](https://designsystem.spiris.se/development/documentation/docs/split-button/)).
- Opinião (Eleken, agência): em interfaces touch ou de público iniciante, os dois alvos do split button são difíceis de descobrir; preferir dropdown ou botões separados ([Eleken, Split button UI](https://www.eleken.co/blog-posts/split-button-ui)).
  - Relevância para o Traxium: Motoristas, Subcontratados, Ativos e frota, Acesso externo. Ex.: "Adicionar motorista" como ação principal, com menu "Importar planilha"; ou, se convidar for o caminho normal, "Convidar" como principal. Não usar split button no app móvel de campo.

**Fluxo de importação**
- Smart Interface Design Patterns (Vitaly Friedman, curso/artigo de praticante): pré-importação com guardrails e "an example or an Excel template"; upload com drag-and-drop, teclado e colar; "Map header columns, check values, and add inline editing for corrections"; "a validation step that allows users to identify and fix issues directly within the interface"; "Flag duplicates and allow users to see only rows with errors"; "Show a final summary and support adding tags, labels, or categories to the batch"; observa que "once an import has completed, it's usually very difficult to reverse the process". Mensagens genéricas como "invalid" ou "corrupt" não ajudam a corrigir ([Smart Interface Design Patterns, Bulk UX](https://smart-interface-design-patterns.com/articles/bulk-ux/)).
- SaaS UI Design (blog de praticante): pré-visualizar antes de gravar (linhas detectadas, colunas encontradas, amostra interpretada); auto-mapear com correção e mapeamento salvo para reuso; colunas não mapeadas com escolha explícita (mapear, criar campo, ignorar); validação por linha com mensagem quantificada ("212 rows missing a required email") deixando as válidas entrarem; duplicados com chave de correspondência explícita e escolha entre skip, update ou create, prevista em números ("340 of these rows match existing contacts, update them, or skip?"); em importações grandes, progresso assíncrono, notificação ao concluir, resumo com criados, atualizados, ignorados e com erro, link para linhas com erro e desfazer ou lote marcado que pode ser revertido. Cita Airtable, Notion, HubSpot, Attio, Stripe, Linear e Intercom como produtos que tratam importação como fluxo de primeira classe, sem detalhar a implementação de cada um ([SaaS UI Design, Data import mapping UX patterns](https://www.saasui.design/blog/saas-data-import-mapping-ux-patterns)).
- CSVBox (fornecedor de importador; viés comercial): mostrar exatamente o que o parser interpretou e deixar corrigir antes de salvar ([CSVBox blog, CSV preview before save](https://blog.csvbox.io/csv-preview-before-save/)). Lido apenas via resumo de busca.
  - Relevância para o Traxium: importação de motoristas, veículos e compartimentos, subcontratados e matriz de produtos. Em compliance, o lote importado precisa ficar marcado (origem, quem, quando) para trilha de auditoria, e a chave de duplicidade deve ser explícita (CPF do motorista, placa, CNPJ do subcontratado).

**Convidar vs criar**
- Linear e GitHub tratam "convidar" como o caminho para dar acesso a uma pessoa (e-mail, papel, convite pendente até aceitar) ([Linear Docs, Invite members](https://linear.app/docs/invite-members); [GitHub Docs, Inviting users to join your organization](https://docs.github.com/en/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization)). Ver seção 8.

### Inferences
- Critério de decisão (inferência a partir das fontes acima): "Criar" quando o registro é um objeto que não faz login (veículo, compartimento, produto); "Convidar" quando a entidade é uma pessoa que vai acessar o sistema (usuário interno, contato do subcontratado, auditor externo); "Importar" como alternativa em volume para o mesmo objeto que se cria manualmente, nunca como terceiro caminho com resultado diferente. Motorista é o caso ambíguo do Traxium: pode ser só um cadastro (objeto) e, à parte, receber acesso ao app de campo (convite). Separar "cadastrar motorista" de "dar acesso ao app" evita misturar os dois conceitos.
- O resumo de resultado da importação é o "fim" do fluxo que o dono do produto pediu.

### Gaps
- Não obtive documentação oficial de importação de HubSpot, Airtable ou Shopify (fluxo de CSV de produtos) nesta rodada; as fontes sobre importação são de praticantes e fornecedores.
- Não encontrei guideline de design system de referência (Carbon, Polaris, Atlassian) dedicada a importação em massa.
- Não verifiquei a guideline oficial de split button do Material ou da Atlassian.

## 3. Listas grandes: paginação vs scroll infinito vs "load more"; tamanho de página; contagem total; cabeçalho fixo

### Takeaway
Para listas orientadas a tarefa (achar, comparar, reencontrar um registro), as fontes desaconselham scroll infinito e favorecem paginação ou "load more". Em tabelas de design systems corporativos, a paginação fica no rodapé da tabela e mostra intervalo atual e total. Cabeçalho e primeira coluna fixos são recomendados quando a tabela excede a tela.

### Cited Findings
- NN/g: scroll infinito "works best for situations where users will want to scroll through homogeneous items with no particular task or goal in mind". Não é recomendado quando o usuário precisa achar algo específico, "Compare items in a long list" ou só olhar os primeiros resultados; nesses casos, pagination, Load More ou integrated pagination servem melhor. Paginação ajuda a reencontrar conteúdo. "Load More" devolve acesso ao rodapé, ao custo de um clique. O artigo conclui que não há solução superior em todos os casos e não dá números de tamanho de página ([NN/g, Infinite scrolling tips](https://www.nngroup.com/articles/infinite-scrolling-tips/)).
- Carbon, quando usar paginação: "When there is too much data to display on one page or within one view of a component" e quando carregar tudo levaria muito tempo; "Do not use pagination superfluously, and aim to use it to improve usability or performance" ([Carbon, Pagination](https://carbondesignsystem.com/components/pagination/usage/)).
- Carbon, conteúdo: exibe o intervalo atual de itens e o total de itens, a página atual e o total de páginas; a variante avançada tem seletor de itens por página e salto para página. Com data table, a paginação fica empilhada logo abaixo da tabela, sem padding. Carbon não fixa valores padrão de itens por página ([Carbon, Pagination](https://carbondesignsystem.com/components/pagination/usage/); [Carbon, Data table](https://carbondesignsystem.com/components/data-table/usage/)).
- NN/g: "Freeze header rows and header columns (if the table is larger than the screen)"; primeira coluna e cabeçalho fixos podem levar sombra sutil; colunas devem poder ser ocultadas e reordenadas com facilidade, inclusive sem drag and drop, com indicação clara de colunas ocultas ([NN/g, Data tables](https://www.nngroup.com/articles/data-tables/)).
- Carbon, densidade: 5 alturas de linha (24, 32, 40 padrão, 48, 64 px); 64 px só para conteúdo de 2 linhas ([Carbon, Data table](https://carbondesignsystem.com/components/data-table/usage/)).
  - Relevância para o Traxium: Viagens (a lista mais longa), Inspeções, Limpezas, Não conformidades, Motoristas, Ativos e frota. Responde ao "e com 80 registros?": paginação no rodapé com "1 a 25 de 80" e seletor de tamanho, cabeçalho fixo, densidade compacta (32 ou 40 px) para operação.

### Inferences
- Com 80 registros, a quantidade em si não exige scroll infinito nem virtualização; o ponto é manter total visível e filtros aplicados visíveis. Tamanho padrão de página (25 ou 50) é decisão de produto; não encontrei valor recomendado com evidência.
- O Control Tower, por ser fila, pode dispensar paginação se o volume diário for pequeno, mas deve mostrar total da fila e ordenação explícita (inferência).

### Gaps
- Não encontrei evidência quantitativa (estudo) sobre tamanho de página padrão em tabelas B2B.
- Não verifiquei guideline de "sticky header" em Carbon, Polaris ou Atlassian; só NN/g cobre o ponto.
- Não verifiquei como Polaris IndexTable pagina (cursor com anterior/próximo, sem total, é o comportamento conhecido do Shopify Admin, mas não confirmei nesta coleta).

## 4. Filtros em escala: barra vs painel/drawer, "mais filtros", chips aplicados, views salvas, larguras de laptop

### Takeaway
O padrão que escala é: poucos filtros fixos e frequentes visíveis, demais acessíveis por "Adicionar filtro"/"Adapt Filters", indicação sempre visível de quantos filtros estão ativos e como limpá-los, e views salvas (variants, saved views) que restauram um conjunto de filtros pela URL. SAP Fiori, Polaris e Linear seguem variações desse modelo.

### Cited Findings
- Carbon: múltiplas categorias de filtro ficam na lateral esquerda ou no topo do conjunto de dados; "Multiple categories should never be put within a menu or dropdown". Quando os filtros ficam escondidos em drawer, dropdown ou menu, "there should be an indicator visible on the closed filter state", no mínimo com o número de filtros aplicados e um modo de limpar sem reabrir. Limpar por categoria e limpar tudo. Batch update (botão "Apply filters") para seleções complexas ou dados lentos; instant update para categoria única ([Carbon, Filtering pattern](https://carbondesignsystem.com/patterns/filtering/)).
- NN/g: filtragem interativa para usuários exploratórios; batch para quem já tem vários critérios em mente ou quando o sistema é lento; botão Apply ajuda; atualização após 1 a 2 s de inatividade com indicador de progresso; contagem por facet evita resultado zero; evitar saltar a página ao topo a cada filtro ([NN/g, Applying filters: batch vs interactive](https://www.nngroup.com/articles/applying-filters/)).
- NN/g: "there should be a clear visual indication that filters are active"; filtros devem ser descobríveis, rápidos e com sintaxe transparente ([NN/g, Data tables](https://www.nngroup.com/articles/data-tables/)).
- SAP Fiori filter bar: filtros padrão no grupo "Basic" (obrigatórios, frequentes ou que mais reduzem a lista); o usuário pode ocultar filtros pouco usados da barra expandida; o link "Adapt Filters (x)" abre o diálogo para adicionar ou ocultar filtros e mostra a contagem; variants são conjuntos de filtros salvos, com "Save As"; um asterisco marca a variant alterada e não salva ("dirty state"), com opção de sobrescrever ou salvar com novo nome; botão Reset sempre presente ([SAP Fiori, Filter bar usage v1-96](https://www.sap.com/design-system/fiori-design-web/v1-96/ui-elements/filter-bar/usage)). Lido via resumo de busca de versões da guideline; as versões variam.
- Polaris Index filters: componente para filtrar, buscar, ordenar dados de index table e criar saved views a partir do resultado ([Polaris, Index filters](https://polaris.shopify.com/components/selection-and-input/index-filters)). O guia de migração da Shopify define: escolher uma saved view restaura seus parâmetros de query; alterar um filtro individual sai da saved view; criar view salva os parâmetros atuais; estado de filtros, busca e ordenação na URL ([Shopify.dev, Migrate Index Filters](https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/index-filters)).
- Linear: filtros abertos por botão ou tecla F; múltiplos filtros simultâneos; operadores explícitos ("is", "is not", "is either of", "includes any/all"); AND/OR com grupos aninhados em filtros avançados; digitar o nome de uma propriedade cria o filtro direto; filtros refinam views e criam custom views; filtros aplicados ficam na URL (opções de exibição não) ([Linear Docs, Filters](https://linear.app/docs/filters)).
  - Relevância para o Traxium: Viagens (lista com muitos filtros), Exceções, Inspeções, Limpezas, Não conformidades, Indicadores. Para não quebrar em 1280 a 1440 px: busca + 3 ou 4 filtros fixos de maior uso (período, status, subcontratado, por exemplo), botão "Mais filtros (n)" ou "Adicionar filtro", linha de chips dos filtros ativos com "Limpar tudo", e views salvas como abas ou seletor ("Minhas viagens", "Com exceção aberta").

### Inferences
- A sequência Fiori/Polaris/Linear sugere que o problema de largura não se resolve com uma barra horizontal que cresce, e sim com "filtros fixos + adicionar filtro + chips". Isso também resolve "o que acontece quando surgir o 9º filtro": ele entra no menu, não na barra.
- Views salvas na URL permitem links compartilháveis do Control Tower para listas filtradas (ex.: clicar num card de exceções abre Viagens já filtrada). Inferência alinhada ao guia da Shopify.

### Gaps
- Não obtive documentação oficial de como Jira ou Salesforce list views lidam com muitos filtros em larguras de laptop; nem de Shopify Admin em larguras específicas. Não há fonte com breakpoints numéricos para barra de filtros.
- O Carbon não define painel lateral vs toolbar inline de forma separada.

## 5. Métricas acima de listas: refletem filtros ou período? Rotulagem de escopo

### Takeaway
O exemplo verificado (Shopify Admin, página Orders) usa métricas governadas por um seletor de período próprio, com comparação ao período anterior e link para o relatório, separadas dos filtros da lista. A remoção do rótulo de período na home do Shopify gerou reclamações de lojistas, o que reforça que o escopo da métrica precisa estar escrito.

### Cited Findings
- Shopify: na página Orders, a barra de analytics mostra métricas "for the time period that you select" por um seletor de datas; cada métrica compara com o período anterior equivalente (7 ou 30 dias; "hoje" compara com a média diária dos últimos 7 dias); cada métrica leva ao relatório correspondente ([Shopify Help, Viewing order analytics](https://help.shopify.com/en/manual/orders/analytics)).
- Lojistas relataram que os números da home do Shopify deixaram de mostrar o período a que se referem e de permitir mudá-lo, e reclamaram da perda de contexto (relato de comunidade, não documentação oficial) ([Shopify Community](https://community.shopify.com/t/home-page-stats-no-longer-show-time-period-or-allow-date-range-changes/637497)).
- ServiceTitan: o dashboard de KPIs mostra por padrão o dia atual para todas as unidades de negócio ativas e avisa que filtros aplicados não são salvos e voltam ao padrão ao recarregar (documentação de fornecedor) ([ServiceTitan Help, Filter dashboards](https://help.servicetitan.com/how-to/modular-dashboard-filter-dashboard)).
  - Relevância para o Traxium: Control Tower, Viagens, Exceções, Indicadores. Cada card de KPI precisa dizer seu escopo em texto ("últimos 30 dias", "abertas agora", "na seleção atual") e o produto precisa decidir, tela a tela, se o número segue os filtros da tabela ou um período fixo.

### Inferences
- Regra prática que decorre do caso Shopify (inferência, não prescrição de design system): métricas de estado atual ("exceções abertas agora") não dependem de período; métricas de fluxo ("viagens concluídas", "taxa de não conformidade") precisam de período explícito; se a métrica muda com os filtros da tabela, o rótulo deve dizer "na seleção" e a contagem total da tabela deve bater com ela. Misturar os dois comportamentos na mesma faixa sem rótulo é o que gera desconfiança.
- Clicar no card deve levar à lista já filtrada com os mesmos critérios (consistente com o padrão Shopify de métrica que linka ao relatório).

### Gaps
- Não encontrei artigo da NN/g, Carbon ou Polaris que prescreva explicitamente se KPIs acima de lista devem seguir filtros. Esta é a maior lacuna de evidência da coleta; a recomendação acima é inferência.

## 6. Edição vs registros imutáveis: editar, arquivar em vez de excluir, histórico, corrigir em software regulado

### Takeaway
Em contexto regulado, a referência normativa mais citada (21 CFR Part 11, FDA) exige trilha de auditoria gerada pelo sistema, com data e hora, que registre criação, alteração e exclusão e que não apague o valor anterior. Em UI, os padrões que derivam disso são: rascunho vs versão salva (Fiori), arquivar como estado somente leitura reversível (GitHub) e correção que preserva original e valor corrigido.

### Cited Findings
- 21 CFR 11.10(e) exige trilhas de auditoria seguras, geradas por computador e com carimbo de tempo, que registrem de forma independente data e hora das entradas e ações que criam, modificam ou excluem registros eletrônicos; mudanças "shall not obscure previously recorded information"; a trilha deve ser retida pelo mesmo prazo do registro e ficar disponível para inspeção ([eCFR, 21 CFR Part 11](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11)). Texto reproduzido por fontes secundárias que consultei via busca ([Pharmaceutical Technology](https://pharmtech.com/view/configuring-software-compliance-21-cfr-part-11-audit-trail-requirements); [Clarkston Consulting](https://clarkstonconsulting.com/insights/new-21-cfr-part-11-guidance-emphasizes-data-integrity/)); não li a página do eCFR diretamente.
- Fontes secundárias de compliance: a trilha deve ser gravada em ordem cronológica, sem que novas entradas sobrescrevam antigas; quem altera registros não pode alterar a trilha; a correção deve mostrar valor original e corrigido; a guidance de integridade de dados da FDA recomenda revisar a trilha de dados críticos antes da aprovação final do registro (via resumo de busca) ([Pharmaceutical Technology](https://pharmtech.com/view/configuring-software-compliance-21-cfr-part-11-audit-trail-requirements); [QT9 glossary](https://qt9software.com/glossary/audit-trail)).
- SAP Fiori draft handling: ao entrar em edição, o botão Edit some e aparecem Cancel e Save (versões antigas) ou um seletor draft/saved version ao lado do título (versões novas); rascunho autossalvo a cada 20 s, mas a versão ativa só muda com Save; descartar pergunta "Discard this draft?" (criação) ou "Discard all changes?" (edição); rascunho exclusivo bloqueia o objeto para outros usuários até expirar o lock; mensagem de sucesso ao sair do modo edição ([SAP Fiori, Draft handling v1-120](https://www.sap.com/design-system/fiori-design-web/v1-120/foundations/best-practices/global-patterns/object-handling/draft-handling)).
- GitHub: arquivar torna o repositório somente leitura para todos (issues, PRs, código, comentários, permissões) e o marca como não mantido; para alterar é preciso desarquivar, em "Danger Zone", confirmando com o nome do repositório ([GitHub Docs, Archiving repositories](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories)).
- Linear: membros podem ser suspensos (status "Suspended") além de removidos, e a lista de membros filtra por esse status ([Linear Docs, Members and roles](https://linear.app/docs/members-roles)).
  - Relevância para o Traxium: Detalhe da viagem, Não conformidades, Inspeções, Limpezas, Dossiê de auditoria, Matriz de produtos, Subcontratados, Motoristas. Registros que viram evidência (inspeção assinada, limpeza executada, viagem encerrada) não devem ter "Editar" livre: devem ter "Corrigir" com motivo, preservando o valor anterior no histórico. Cadastros mestres (motorista, veículo, subcontratado) devem ter "Arquivar/Inativar" em vez de "Excluir", porque viagens passadas os referenciam. Cada detalhe precisa de aba ou seção "Histórico" com quem, quando, o quê, valor anterior e novo.

### Inferences
- Três classes de registro para o Traxium (inferência): (a) cadastros mestres: editáveis, com histórico, arquiváveis; (b) registros operacionais em andamento: editáveis até um marco (ex.: encerramento da viagem, assinatura da inspeção); (c) registros de evidência após o marco: imutáveis, só corrigíveis por adendo com motivo e autor. Isso responde ao "o que dá para editar" de cada tela.
- A regulação brasileira aplicável (MAPA, normas de transporte de ingredientes para alimentação animal) não foi pesquisada aqui; 21 CFR Part 11 serve como referência de boa prática, não como requisito legal para o Traxium.

### Gaps
- Não consultei norma brasileira equivalente (MAPA, ANVISA, LGPD sobre retenção) nem a guidance atual da FDA sobre enforcement discretion da trilha de auditoria (uma fonte de fornecedor alega que a trilha pode não ser exigida em alguns casos; não verificado).
- Não encontrei guideline de design system sobre o componente de "histórico de alterações" (activity log) em si.

## 7. Arquitetura de informação para SaaS operacional: quantos itens de navegação, agrupamento, consolidação de telas

### Takeaway
Não há evidência que sustente um limite fixo de itens no menu (a regra "7±2" é um uso indevido de Miller, segundo NN/g citada por terceiros e pela UX Myths). A pesquisa citada indica que estruturas largas e rasas tendem a funcionar melhor que profundas. O número deve sair do conteúdo e de teste com usuários.

### Cited Findings
- UX Myths: o limite de sete escolhas é mito; o estudo de Miller trata de memória de curto prazo e discriminação de estímulos unidimensionais, enquanto um menu é tarefa de reconhecimento, não de memorização; pesquisas indicam que menus largos e rasos podem funcionar melhor que profundos ([UX Myths, Myth #23](https://uxmyths.com/post/931925744/myth-23-choices-should-always-be-limited-to-seven)).
- Stephanie Walter (praticante): a navegação não precisa obedecer ao 7±2; decidir pelo conteúdo e por testes ([Stephanie Walter, Your menu doesn't need Miller's 7±2 rule](https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7±2-rule/)).
- Segundo fonte secundária, a NN/g afirma em "How Chunking Helps Content Processing" que designers usam mal o "Mythical Number Seven" para justificar limitações desnecessárias (citação não verificada na página da NN/g) ([UX Myths](https://uxmyths.com/post/931925744/myth-23-choices-should-always-be-limited-to-seven)).
- Linear separa a fila de entrada (Triage) das views de trabalho, mantendo itens de triagem fora das views padrão ([Linear Docs, Triage](https://linear.app/docs/triage)).
  - Relevância para o Traxium: sidebar canônica com ~20 destinos. Agrupar por objetivo (Operação: Control Tower, Viagens, Exceções; Rede: Subcontratados, Motoristas, Ativos; Qualidade: Inspeções, Limpezas, Não conformidades; Auditoria e Indicadores; Administração: Acesso externo, Configurações, Console admin) tende a ser mais defensável do que cortar itens para atingir um número.

### Inferences
- Candidatos a consolidação (inferência, para validar): Detalhe do compartimento como aba/seção dentro de Ativos e frota; Inspeções e Limpezas como abas de uma mesma área se compartilham objeto (compartimento) e fluxo; Exceções como view salva de Viagens ou como fila no Control Tower, caso a sobreposição seja grande. O critério é: telas que listam o mesmo objeto com filtros diferentes viram views salvas, não itens de menu.

### Gaps
- Não encontrei estudo com contagem de itens de navegação em SaaS B2B operacional (Samsara, Salesforce) nem dados de consolidação de telas com métricas antes/depois.
- Não consegui ler diretamente os artigos da NN/g sobre chunking e sobre navegação de aplicações; as citações vieram de fontes secundárias.

## 8. Convites e gestão de usuários: membros e convites pendentes, papéis, reenviar/revogar, expiração, acesso externo/guest

### Takeaway
GitHub e Linear seguem o mesmo modelo: convite por e-mail com papel definido no ato, lista de membros filtrável por status (ativo, pendente, suspenso), ações por linha via overflow, expiração do convite (7 dias no GitHub) com "retry" e "cancel", e papel de convidado (guest) com visão restrita.

### Cited Findings
- GitHub: convite não aceito em 7 dias expira automaticamente (exceto convites gerados via SCIM no Enterprise Cloud); convites expirados ou falhos podem ser reenviados ("Retry invitation") ou cancelados ("Cancel invitation") individualmente ou em lote a partir da página People; convite por e-mail só pode ser aceito se o e-mail bater com um e-mail verificado da conta ([GitHub Docs, Inviting users to join your organization](https://docs.github.com/en/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization)). Informação obtida via resumo de busca dessa página.
- Linear: em Settings > Administration > Members, botão "Invite people", e-mails, papel em "Invite as..." (planos pagos) e times de entrada opcionais; o convidado recebe link por e-mail ([Linear Docs, Invite members](https://linear.app/docs/invite-members)).
- Linear: a lista de membros filtra por papel ou status (Pending invites, Suspended, quem saiu); mudança de papel pelo overflow (⋯) na linha do membro; guests só veem issues dos times de que fazem parte; só admins convidam guests; com SCIM no Enterprise, a gestão passa ao provedor de identidade ([Linear Docs, Members and roles](https://linear.app/docs/members-roles)).
- Conflito de fontes: um guia de terceiros (Stitchflow) diz que o Linear não tem suspensão e só tem Admin e Member; a documentação oficial descreve suspensão e Guest. Prevalece a oficial ([Stitchflow](https://www.stitchflow.com/user-management/linear/manual); [Linear Docs](https://linear.app/docs/members-roles)).
- Não confirmado na documentação oficial do Linear: expiração em 7 dias e passo a passo de revogar convite pendente (afirmado só por guia de terceiros).
  - Relevância para o Traxium: Acesso externo, Configurações (usuários e papéis), Console admin, convites de subcontratados e auditores. Lista única com status (Ativo, Convite pendente, Expirado, Suspenso), coluna de papel e de expiração, overflow por linha com Reenviar, Revogar, Alterar papel, Suspender; acesso externo como papel de escopo limitado (ex.: auditor vê só o dossiê compartilhado; subcontratado vê só suas viagens).

### Inferences
- Para acesso externo em compliance, faz sentido acrescentar ao modelo GitHub/Linear uma data de término do acesso e o escopo explícito (qual dossiê, qual período), já que auditores externos têm acesso temporário. Inferência; não encontrei fonte específica de "guest com expiração" nesta coleta.

### Gaps
- Não verifiquei Slack (Single-Channel Guest), Notion (guests por página) ou Atlassian (acesso externo) nesta rodada, que seriam referências diretas para acesso externo com escopo.
- Não obtive guideline de design system para a tela de membros e convites.
