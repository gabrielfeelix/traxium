# 05_INFORMATION_ARCHITECTURE — Arquitetura da Informação

> Arquivo de estrutura. Serve para **organizar, revisar e validar a arquitetura da informação** de sites, e-commerces, SaaS, portais, apps e sistemas com muito conteúdo ou funcionalidade.
> Foco: ajudar o usuário a **encontrar, entender e navegar** com menos esforço — não fazer menu bonito.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 27. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "estrutura"** na base. Ele orienta como decidir onde cada coisa mora, como nomear, como organizar categorias e navegação, e como **validar** isso com pesquisa (card sorting e tree testing) em vez de adivinhar.

Responde, na prática:
- O que é IA e por que ela não é só sitemap nem só menu.
- Como descobrir o modelo mental do usuário e transformá-lo em estrutura.
- Quando usar card sorting (criar/informar) e tree testing (validar).
- Como melhorar findability (encontrabilidade) e discoverability.
- Como conectar IA a conteúdo, navegação, busca, filtros e métricas.

---

## 2. O que é Arquitetura da Informação

**Arquitetura da Informação (IA)** é a organização, a estrutura e a nomenclatura que definem **as relações entre os conteúdos e funcionalidades** de um produto. É a "espinha dorsal" da informação: invisível na tela, mas determinante para a experiência.

- **IA não é só sitemap.** O sitemap é um **diagrama visual** que comunica a organização a stakeholders — uma *saída* da IA, menos detalhada. A IA é o processo completo de decidir como o conteúdo se agrupa e se relaciona.
- **IA não é só menu.** O menu é um componente de **navegação** (UI). A IA existe acima e abaixo do menu — inclui taxonomia, rótulos, busca e regras que o menu nem mostra.
- **IA conecta tudo:** conteúdo, navegação, taxonomia, linguagem e **modelo mental** do usuário. Ela traduz "como a empresa pensa o conteúdo" para "como o usuário espera encontrá-lo".
- **IA ruim custa caro.** Quando a estrutura não bate com o modelo mental, aumenta o **esforço cognitivo**, cresce o erro de navegação, o usuário não encontra o que importa e recorre à busca (ou desiste).

Regra: *se você não está testando sua IA, está adivinhando.*

---

## 3. IA, sitemap, navegação, taxonomia e user flow

### 3.1 Arquitetura da Informação
A estrutura, organização e nomenclatura que define as relações entre conteúdos. O "backbone".

### 3.2 Sitemap
Diagrama visual da hierarquia de páginas/seções. Saída da IA, para comunicação.

### 3.3 Navegação
Elementos de UI que permitem chegar ao conteúdo. Manifestação visível da IA (a ponta do iceberg).

### 3.4 Taxonomia
Vocabulário controlado de bastidor que classifica o conteúdo. Complementa a navegação e é a base das facetas.

### 3.5 User flow
Sequência de interações concretas para concluir **uma tarefa específica** (um caminho de cliques). Não é IA.

### 3.6 Menu
Componente de navegação específico (global, local, mega menu etc.).

### 3.7 Busca
Sistema para encontrar conteúdo por consulta textual, quando navegar não basta.

### 3.8 Filtros e facetas
Mecanismos para refinar uma lista de resultados a partir de atributos.

| Conceito | O que é | Para que serve | Exemplo | Erro comum |
|---|---|---|---|---|
| **IA** | Estrutura/relações/nomenclatura do conteúdo | Definir como tudo se organiza | Decisão de que "frete" vive em "Entrega" | Tratá-la como se fosse o sitemap |
| **Sitemap** | Diagrama da hierarquia de páginas | Comunicar a estrutura a stakeholders | Árvore Home → Categorias → Produtos | Achar que o sitemap é o entregável final da IA |
| **Navegação** | Elementos de UI para chegar ao conteúdo | Permitir o deslocamento | Menu global, breadcrumb | Confundir navegação com a IA inteira |
| **Taxonomia** | Vocabulário controlado de classificação | Classificar conteúdo e alimentar facetas | "Marca", "Nível", "Tipo de produto" | Misturar critérios diferentes numa só categoria |
| **User flow** | Sequência de passos de uma tarefa | Otimizar a execução de uma tarefa | Fluxo de checkout passo a passo | Tratar user flow como journey map ou como IA |
| **Menu** | Componente de navegação | Expor categorias para escolha | Mega menu de categorias | Esconder navegação atrás de hambúrguer no desktop |
| **Busca** | Sistema de consulta por texto | Encontrar quando navegar não basta | Busca por "violão elétrico" | Ignorar a busca e os termos reais do usuário |
| **Filtros/facetas** | Refino de resultados por atributo | Estreitar uma lista grande | Faceta "faixa de preço" + "marca" | Filtro que não ajuda nenhuma decisão real |

---

## 4. Quando trabalhar Arquitetura da Informação

| Situação do projeto | Por que IA é importante | Método recomendado | Entregável esperado |
|---|---|---|---|
| **Site novo** | Definir a estrutura do zero | Top tasks + card sorting + tree testing | Sitemap e taxonomia |
| **Redesign** | Corrigir estrutura que não funciona | Teste da IA atual + card sorting + tree testing | IA revisada validada |
| **E-commerce** | Catálogo grande exige categorias e filtros claros | Card sorting de produtos + tree testing + facetas | Taxonomia e modelo de filtros |
| **Portal com muito conteúdo** | Volume sem estrutura vira labirinto | Inventário + card sorting + tree testing | Mapa de conteúdo e navegação |
| **SaaS com muitos módulos** | Funções dispersas confundem | Top tasks + card sorting de funções | Estrutura de módulos e menu |
| **App com muitas funcionalidades** | Tela pequena exige prioridade | Top tasks + tree testing | Navegação priorizada |
| **Intranet** | Conteúdo organizado por departamento atrapalha | Card sorting com funcionários | IA por tarefa, não por área |
| **Central de ajuda** | Pessoas precisam achar respostas rápido | Top tasks + tree testing | Estrutura de tópicos e busca |
| **Blog / categorias de conteúdo** | Categorias e tags inconsistentes | Taxonomia + card sorting | Taxonomia de conteúdo |
| **Produto com busca e filtros** | Filtros ruins travam a decisão | Taxonomia facetada | Modelo de facetas |
| **Usuários não encontram o importante** | Sinal claro de IA ou rótulo ruim | Analytics + tree testing + revisão de labels | Diagnóstico e ajustes |

---

## 5. Princípios de uma boa IA

- **Clareza** — o usuário entende o que cada parte significa.
- **Encontrabilidade (findability)** — quem procura algo específico consegue chegar.
- **Discoverability** — quem não sabe que algo existe acaba descobrindo ao navegar.
- **Consistência** — mesmos critérios e padrões em toda a estrutura.
- **Linguagem do usuário** — rótulos no vocabulário de quem usa, não no interno.
- **Agrupamento por modelo mental** — organizar como o usuário pensa, não como a empresa se organiza.
- **Progressão do geral para o específico** — do amplo ao detalhado, sem saltos.
- **Prioridade por tarefas principais** — o que importa mais fica mais acessível (top tasks).
- **Escalabilidade** — a estrutura comporta conteúdo novo sem quebrar.
- **Baixa ambiguidade** — cada item tem um lugar previsível; pouca sobreposição.
- **Rótulos descritivos** — nomes que dizem o que há atrás deles (information scent alto).
- **Menor dependência de memória** — reconhecer em vez de lembrar; mostrar onde se está.

---

## 6. Modelo mental dos usuários

**Modelo mental** é a forma como a pessoa **espera** que as coisas estejam organizadas, baseada em experiências anteriores. A IA funciona quando bate com esse modelo.

- **Usuários agrupam diferente do time interno.** A equipe pensa por produto, área ou tecnologia; o usuário pensa por objetivo, contexto ou tarefa.
- **Pesquisa revela os agrupamentos reais.** Card sorting, entrevistas e análise de busca mostram como as pessoas de fato categorizam.
- **Nomes internos costumam ser ruins para navegar.** Termos de marca, jargão e nomes de departamento têm baixo information scent — o usuário não sabe o que há atrás.
- **Categorias vêm de evidência, não de palpite.** A estrutura sai do dado (sorting, busca, tarefas), não da opinião do mais forte na reunião.

**Exemplo aplicado a e-commerce** (formas de organizar o mesmo catálogo):
- **Por tipo de produto** — Violões, Teclados, Baterias. (Familiar, mas pode não casar com a tarefa.)
- **Por perfil de uso** — Estúdio, Palco, Casa.
- **Por nível do usuário** — Iniciante, Intermediário, Avançado.
- **Por tarefa** — "Montar meu primeiro setup", "Presentear".

A escolha (ou a combinação) deve sair da pesquisa — não de qual faz mais sentido para o estoque interno.

---

## 7. Inventário de conteúdo

**O que é:** um levantamento sistemático de **tudo** que existe (páginas, telas, conteúdos), sem julgar ainda — só mapear.

**Quando usar:** em redesigns e migrações; antes de reorganizar qualquer estrutura grande.

**Como fazer:** percorrer o site/produto (ou exportar do CMS/analytics), registrar cada item e seus atributos em uma planilha.

**Quais campos mapear:** URL/tela, tipo, categoria atual, público, objetivo, status, problema, ação.

| URL ou tela | Tipo de conteúdo | Categoria atual | Público | Objetivo | Status | Problema | Ação recomendada |
|---|---|---|---|---|---|---|---|
| `/sobre` | Institucional | Empresa | Geral | Gerar confiança | Ativo | Texto datado | Reescrever |
| `/produtos/violao-x` | Produto | Violões | Comprador | Vender | Ativo | Sem specs claras | Enriquecer PDP |
| `/blog/dica-antiga` | Conteúdo | Blog | Iniciante | Educar | Desatualizado | Redundante | Unir ou remover |

---

## 8. Auditoria de conteúdo

**Inventário ≠ auditoria.** O inventário **lista** o que existe; a auditoria **julga** a qualidade e decide o destino de cada item.

**Como avaliar:** utilidade (serve a uma tarefa real?), clareza (entende-se?), atualização (está vigente?), redundância (repete outro conteúdo?), tom de voz (consistente?) e prioridade (importa para top tasks?).

**Como decidir o destino:** **manter** (bom e útil), **remover** (inútil/obsoleto), **unir** (redundante com outro), **reescrever** (útil, mas ruim) ou **criar** (lacuna identificada).

| Conteúdo | Problema | Evidência | Decisão | Prioridade |
|---|---|---|---|---|
| Página "Sobre" | Texto institucional vago | Baixo tempo na página (analytics) | Reescrever | Média |
| 3 posts sobre frete | Informação repetida | Busca interna por "frete" alta | Unir em 1 guia | Alta |
| FAQ desatualizado | Respostas antigas | Tickets repetem dúvidas já "respondidas" | Reescrever | Alta |

---

## 9. Top Tasks

**O que são:** o pequeno conjunto de tarefas que **mais importam** para a maioria dos usuários. A maior parte do valor se concentra em poucas tarefas; o resto é cauda longa.

**Por que ajudam a priorizar IA:** dão um critério objetivo para decidir o que fica acessível. Sem isso, a navegação tende a refletir o **organograma da empresa** em vez das necessidades do usuário.

**Como identificar:** levantar tarefas candidatas (entrevistas, suporte, busca, analytics) e priorizar por importância × frequência, idealmente com votação/dados de usuários reais.

**Como evitar refletir só departamentos:** organizar por **o que o usuário quer fazer**, não por quem produz o conteúdo. ("Acompanhar pedido" é tarefa; "Logística" é departamento.)

**Onde ajudam:** definem o que aparece no menu, na home, na busca e nas categorias principais.

| Tarefa do usuário | Importância | Frequência | Evidência | Onde deve aparecer |
|---|---|---|---|---|
| Encontrar um produto específico | Alta | Alta | Busca interna, analytics | Busca + menu + home |
| Comparar opções antes de comprar | Alta | Média | Entrevistas | Página de listagem/PDP |
| Acompanhar pedido | Alta | Alta | Tickets de suporte | Topo/área do cliente |
| Tirar dúvida de frete/prazo | Alta | Alta | Busca por "frete" | PDP + central de ajuda |

---

## 10. Taxonomia

**O que é:** um vocabulário controlado de **bastidor** que classifica o conteúdo de forma consistente. Diferente da navegação visível e da estrutura geral da IA — ela alimenta as duas.

**Para que serve:** garantir nomes consistentes, conectar conteúdos relacionados e viabilizar **navegação facetada** (filtros combináveis).

**Categoria, atributo, tag, filtro e faceta:**
- **Categoria** — grupo principal a que o item pertence (ex.: "Violões").
- **Atributo** — propriedade estruturada do item (ex.: cor, marca, nível).
- **Tag** — rótulo livre, não hierárquico, para conexões soltas.
- **Filtro** — qualquer critério aplicado para reduzir uma lista.
- **Faceta** — conjunto de filtros baseados em atributos de uma **taxonomia facetada**, combináveis simultaneamente.

**Nomes consistentes:** mesmo padrão de grafia, nível e gramática dentro de cada dimensão.

**Categorias ambíguas:** quando um item caberia em dois lugares, use evidência (tree testing) e considere **poli-hierarquia** (cross-listing: o mesmo item em mais de uma categoria).

**Hierarquias, poli-hierarquias e exceções:** a maioria do conteúdo é hierárquica; alguns itens precisam aparecer em vários ramos (poli-hierarquia); documente as exceções para não virarem inconsistência.

| Item | Categoria principal | Categoria secundária | Atributos | Tags | Observações |
|---|---|---|---|---|---|
| Violão de aço X | Violões | Iniciantes | Marca, nível, faixa de preço | "promoção" | Cross-listado em "Presentes" |
| Pedal de efeito Y | Acessórios | Guitarra | Marca, compatibilidade | "lançamento" | Atributo "compatibilidade" vira faceta |

---

## 11. Card sorting

**O que é:** método em que participantes agrupam cartões (itens de conteúdo) da forma que faz sentido para eles, revelando o **modelo mental**.

**Para que serve:** **gerar e informar** a estrutura — descobrir como as pessoas agrupam e nomeiam. (Não é validação final.)

**Quando usar:** cedo, ao criar ou repensar a IA. **Quando não usar:** para validar uma estrutura pronta (para isso, tree testing).

**Aberto, fechado e híbrido:**
- **Aberto** — o usuário cria e nomeia os grupos. Gera modelo mental e rótulos (generativo).
- **Fechado** — categorias dadas; o usuário encaixa os itens. Mais avaliativo (a NN/g recomenda tree testing no lugar para avaliar navegação).
- **Híbrido** — algumas categorias dadas + liberdade de criar. Usar com cautela: as categorias prontas **enviesam** o usuário.

**Preparar cartões:** itens representativos do conteúdo real, ~30–50 cartões para evitar fadiga; rótulos neutros, sem dar a resposta.

**Recrutar participantes:** usuários reais/prováveis; diversidade de perfis.

**Conduzir:** presencial ou por ferramenta (ex.: OptimalSort); moderado (entende o "porquê") ou não moderado (escala).

**Analisar resultados:** matriz de similaridade, dendrograma, padrões de agrupamento e de nomes.

**Entregáveis:** agrupamentos, matriz de similaridade, proposta de categorias e rótulos.

**Erros comuns:** cartões mal escritos, amostra de conveniência, tratar o resultado como decisão automática, ignorar o "porquê".

| Tipo de card sort | Quando usar | Vantagem | Limitação | Exemplo |
|---|---|---|---|---|
| **Aberto** | Criar IA do zero / explorar modelo mental | Revela grupos e rótulos do usuário | Mais difícil de analisar | "Organize estes produtos como preferir" |
| **Fechado** | Checar encaixe em categorias definidas | Mais simples de analisar | Avaliativo e enviesado; tree testing costuma ser melhor | "Coloque cada item nestas 5 categorias" |
| **Híbrido** | Quando há 1–2 categorias certas e o resto incerto | Combina os dois | Categorias prontas enviesam | "Use estas 2 categorias e crie outras" |

---

## 12. Como planejar um card sorting

### 1. Definir objetivo
**Objetivo:** saber o que se quer descobrir sobre o agrupamento. **Cuidado:** objetivo vago gera dado inútil. **Entregável:** pergunta de pesquisa.

### 2. Selecionar conteúdo ou itens
**Objetivo:** escolher itens representativos. **Cuidado:** evitar itens demais (fadiga). **Entregável:** lista de itens.

### 3. Preparar cartões
**Objetivo:** escrever rótulos claros e neutros. **Cuidado:** não dar a resposta no cartão. **Entregável:** baralho de cartões.

### 4. Definir o tipo de card sort
**Objetivo:** escolher aberto, fechado ou híbrido conforme o objetivo. **Cuidado:** fechado/híbrido enviesam. **Entregável:** desenho do estudo.

### 5. Recrutar participantes
**Objetivo:** trazer usuários reais. **Cuidado:** amostra de conveniência distorce. **Entregável:** participantes recrutados.

### 6. Escolher ferramenta ou formato
**Objetivo:** decidir presencial vs online, moderado vs não. **Cuidado:** moderado dá "porquê"; não moderado dá escala. **Entregável:** setup definido.

### 7. Conduzir sessões
**Objetivo:** coletar agrupamentos. **Cuidado:** não induzir. **Entregável:** dados brutos.

### 8. Analisar agrupamentos
**Objetivo:** achar padrões de agrupamento e nomes. **Cuidado:** olhar similaridade, não casos isolados. **Entregável:** matriz de similaridade.

### 9. Identificar padrões e divergências
**Objetivo:** ver onde há consenso e onde há conflito. **Cuidado:** divergência é informação. **Entregável:** mapa de consenso.

### 10. Criar proposta de IA
**Objetivo:** transformar padrões em estrutura. **Cuidado:** proposta ≠ verdade final. **Entregável:** sitemap/taxonomia rascunho.

### 11. Validar com tree testing
**Objetivo:** testar se a estrutura proposta funciona. **Cuidado:** card sorting não valida sozinho. **Entregável:** plano de tree testing.

---

## 13. Tree testing

**O que é:** método baseado em tarefas em que o usuário procura itens dentro de uma **árvore de navegação textual**, sem design visual. Também chamado de "reverse card sort".

**Para que serve:** avaliar a **findability** de uma estrutura proposta — se as pessoas encontram o que precisam.

**Quando usar:** depois de propor a IA (saída do card sorting). **Quando não usar:** para descobrir o modelo mental do zero (isso é card sorting).

**Por que avalia a estrutura sem interferência visual:** sem cores, ícones ou posição, o teste isola a **estrutura e os rótulos** — você descobre se o problema é a organização, não o layout.

**Card sorting vs tree testing:** card sorting **gera/informa** a estrutura (como agrupar); tree testing **avalia** a estrutura (se funciona). Um não substitui o outro.

**Métricas a observar:**
- **Taxa de sucesso** — % que chegou ao destino certo.
- **Sucesso direto** — chegou sem voltar atrás (directness alta).
- **Sucesso indireto** — chegou, mas com idas e vindas.
- **Primeiro clique** — a primeira escolha (forte preditor de sucesso).
- **Caminho percorrido** — a rota até o destino.
- **Tempo na tarefa** — quanto demorou.
- **Backtracking** — quantas vezes voltou (sinal de confusão).
- **Destinos errados** — onde as pessoas erraram (revela sobreposição de categorias).

> Diagnóstico típico: se o primeiro clique se espalha por várias categorias, há **sobreposição** no topo; se o primeiro clique acerta mas o destino final erra, há sobreposição entre **subcategorias irmãs**.

---

## 14. Como planejar um tree testing

### 1. Definir objetivo do teste
**Objetivo:** saber o que validar na estrutura. **Cuidado:** sem foco, vira teste genérico. **Entregável:** perguntas do teste.

### 2. Criar a árvore de navegação
**Objetivo:** montar a hierarquia textual a testar. **Cuidado:** refletir a proposta real. **Entregável:** árvore.

### 3. Criar tarefas realistas
**Objetivo:** escrever tarefas de busca que o usuário faria. **Cuidado:** a tarefa não pode entregar a resposta (não repetir o rótulo da categoria). **Entregável:** lista de tarefas.

### 4. Definir critérios de sucesso
**Objetivo:** decidir o que conta como acerto. **Cuidado:** alinhar destino correto por tarefa. **Entregável:** gabarito.

### 5. Recrutar participantes
**Objetivo:** trazer usuários reais. **Cuidado:** amostra suficiente (quantitativo exige mais). **Entregável:** participantes.

### 6. Rodar o teste
**Objetivo:** coletar caminhos e cliques. **Cuidado:** rodar piloto antes. **Entregável:** dados.

### 7. Analisar caminhos
**Objetivo:** ver sucesso, diretividade e primeiro clique. **Cuidado:** olhar o caminho, não só o resultado. **Entregável:** métricas por tarefa.

### 8. Identificar rótulos problemáticos
**Objetivo:** achar onde a confusão está. **Cuidado:** destino errado revela sobreposição/label ruim. **Entregável:** lista de problemas.

### 9. Ajustar a IA
**Objetivo:** corrigir estrutura e rótulos. **Cuidado:** mudar uma coisa por vez. **Entregável:** IA revisada.

### 10. Retestar se necessário
**Objetivo:** confirmar que o ajuste resolveu. **Cuidado:** iterar até estabilizar. **Entregável:** estrutura validada.

---

## 15. Card sorting vs tree testing

- **Card sorting** ajuda a **criar/informar** a estrutura — descobre como o usuário agrupa.
- **Tree testing** ajuda a **avaliar** se a estrutura funciona — mede se o usuário encontra.
- **Um não substitui o outro:** gerar e validar são propósitos diferentes.
- **Use apenas um quando:** você só precisa explorar agrupamentos (card sorting) **ou** só validar uma estrutura existente (tree testing).
- **Use os dois quando:** está desenhando/refazendo a IA — card sorting para propor, tree testing para validar.

| Critério | Card sorting | Tree testing |
|---|---|---|
| Propósito | Gerar/informar a estrutura | Avaliar a estrutura |
| Pergunta | Como o usuário agrupa? | O usuário encontra? |
| Momento | Antes (criação) | Depois (validação) |
| Saída | Agrupamentos, rótulos | Taxa de sucesso, caminhos |
| Natureza | Generativo | Avaliativo |
| Tarefa do participante | Organizar itens | Achar um item |

---

## 16. Rótulos e nomenclatura

- **Labels são críticos** — o rótulo é a promessa do que há atrás do link; rótulo ruim quebra a navegação mesmo com estrutura boa.
- **Information scent** — o "cheiro" da informação: pistas que indicam se aquele caminho leva ao objetivo. Rótulos com **alto information scent** dizem claramente o que entregam; com **baixo**, o usuário não sabe e hesita ou erra.
- **Nomes bonitos podem ser ruins** — verbos vagos (Explorar, Descobrir, Conhecer) e termos "criativos" têm baixo scent: não diferenciam nem ajudam a escolher.
- **Jargão interno prejudica** — nomes de marca/departamento que só a empresa entende afastam o usuário.
- **Como escolher nomes claros** — usar o vocabulário do usuário, front-load (palavra-chave primeiro), específico em vez de genérico.
- **Como testar rótulos** — tree testing e análise de busca revelam labels confusos.
- **Ambiguidade** — quando um rótulo cobre coisas heterogêneas demais, subdivida ou renomeie.

| Rótulo fraco | Por que é fraco | Rótulo melhor | Por que é melhor |
|---|---|---|---|
| "Soluções" | Genérico, baixo scent | "Produtos para estúdio" | Diz o que há atrás |
| "Explore" | Verbo vago, não diferencia | "Ver violões" | Específico e acionável |
| "Universo [Marca]" | Jargão de marca | "Sobre a loja" | Linguagem do usuário |
| "Recursos" | Ambíguo (downloads? ajuda? specs?) | "Guias e tutoriais" | Escopo claro |

---

## 17. Navegação

**Relação entre IA e navegação:** a navegação é a **manifestação visível** da IA na interface — não a IA inteira. A IA define a estrutura; a navegação expõe parte dela.

**Tipos de navegação:**
- **Global** — presente em todo o site (menu principal); dá a visão do escopo.
- **Local** — dentro de uma seção; mostra o que há naquele ramo.
- **Breadcrumbs** — indicam onde o usuário está e o caminho de volta (reduzem dependência de memória).
- **Menus** — componentes que expõem categorias (incluindo mega menus).
- **Links contextuais** — conexões dentro do conteúdo (relacionados).
- **Busca** — atalho para quem sabe o que quer.
- **Filtros** — refino dentro de uma listagem.
- **Categorias** — agrupamentos que estruturam o conteúdo.

> Princípio: **navegação é uma manifestação da IA, não a IA.** Consertar o menu sem consertar a estrutura por trás raramente resolve.

---

## 18. Busca, filtros e facetas

- **Quando a busca importa:** catálogos grandes, usuários que já sabem o que querem, conteúdo difícil de prever na navegação. A busca deve cobrir os **termos reais** do usuário (sinônimos, erros comuns).
- **Quando filtros importam:** listas grandes em que o usuário precisa estreitar por atributo.
- **Filtro vs faceta:** **filtro** é qualquer critério que reduz a lista; **faceta** é um filtro estruturado a partir de uma **taxonomia facetada**, e várias facetas se **combinam simultaneamente** (preço + marca + nível).
- **Como a IA afeta a busca:** boa IA melhora a busca (resultados situados na estrutura, "onde isto fica"); IA ruim faz a busca virar muleta para estrutura quebrada.
- **Como a taxonomia melhora filtros:** atributos consistentes viram facetas confiáveis; sem taxonomia, os filtros ficam incompletos e incoerentes.
- **Como definir filtros:** a partir dos **atributos que o usuário usa para decidir** — não de todo dado que existe no banco.

**Exemplo de facetas para e-commerce:**
- **Categoria** (Violões, Teclados)
- **Faixa de preço**
- **Nível do usuário** (iniciante, intermediário, avançado)
- **Tipo de produto** (acústico, elétrico)
- **Marca**
- **Uso principal** (estúdio, palco, casa)
- **Compatibilidade** (com quê funciona)

---

## 19. IA em e-commerce

Onde a IA aparece:
- **Home** — orienta os caminhos principais (top tasks: buscar, navegar categorias, promoções).
- **Menu** — expõe a taxonomia de categorias.
- **Categorias** — agrupamento que reflete o modelo mental.
- **Páginas de listagem** — onde filtros/facetas operam.
- **Filtros** — refino por atributos de decisão.
- **Busca** — para quem já sabe o que quer.
- **Página de produto (PDP)** — specs, dúvidas, frete/prazo.
- **Guia de compra** — apoio à decisão (especialmente iniciantes).
- **Comparação** — entre modelos.
- **Conteúdo institucional** — confiança (sobre, políticas).
- **Central de ajuda** — dúvidas de frete, troca, pedido.

**Estrutura exemplo** para "site institucional → e-commerce" (marcada como exemplo):
```
Home
├── Produtos (por categoria)
│   ├── Violões → [facetas: preço, nível, tipo, marca]
│   ├── Teclados
│   └── Acessórios
├── Guias de compra (por tarefa/nível)
├── Comparar
├── Ofertas
├── Ajuda (frete, prazo, trocas, pedido)
└── Sobre a loja (institucional, políticas)
```

---

## 20. IA em SaaS e sistemas internos

Onde a IA aparece:
- **Módulos** — grandes blocos de funcionalidade.
- **Menus laterais** — navegação principal de sistemas densos.
- **Dashboards** — priorização do que aparece primeiro.
- **Permissões** — o que cada perfil vê (a IA muda por papel).
- **Configurações** — agrupamento de ajustes (fonte clássica de bagunça).
- **Busca interna** — essencial quando há muitas telas.
- **Tabelas** — colunas, filtros e ordenação são IA.
- **Fluxos operacionais** — sequência de telas de uma tarefa.
- **Central de ajuda** — documentação e suporte embutidos.

> **Risco central:** organizar o sistema pela **estrutura interna da empresa** (áreas, times, tecnologia) em vez das tarefas do usuário. O resultado é um menu que faz sentido para quem construiu e confunde quem usa. Sempre valide com tree testing e top tasks.

---

## 21. Como criar uma proposta de IA

### 1. Entender objetivos do negócio
**Objetivo:** saber o que o produto precisa alcançar. **Método:** entrevista com stakeholders. **Entregável:** briefing.

### 2. Mapear usuários e tarefas
**Objetivo:** saber para quem e para quê. **Método:** top tasks, entrevistas. **Entregável:** lista de top tasks.

### 3. Fazer inventário
**Objetivo:** listar tudo que existe. **Método:** crawl/export. **Entregável:** inventário.

### 4. Auditar conteúdo
**Objetivo:** julgar e decidir destino. **Método:** auditoria. **Entregável:** decisões por conteúdo.

### 5. Levantar dados de busca e analytics
**Objetivo:** ver comportamento real. **Método:** análise de busca interna e navegação. **Entregável:** termos e pontos de atrito.

### 6. Rodar entrevistas ou pesquisa contextual
**Objetivo:** entender modelo mental e linguagem. **Método:** entrevistas (ver Arquivo 03). **Entregável:** insights e vocabulário.

### 7. Rodar card sorting, se necessário
**Objetivo:** descobrir agrupamentos. **Método:** card sorting aberto. **Entregável:** padrões de agrupamento.

### 8. Criar sitemap
**Objetivo:** desenhar a hierarquia. **Método:** síntese das evidências. **Entregável:** sitemap.

### 9. Criar taxonomia
**Objetivo:** definir categorias, atributos e facetas. **Método:** modelagem de taxonomia. **Entregável:** taxonomia.

### 10. Definir labels
**Objetivo:** nomear com alto information scent. **Método:** linguagem do usuário + revisão. **Entregável:** lista de rótulos.

### 11. Definir navegação
**Objetivo:** decidir como expor a IA. **Método:** padrões de navegação. **Entregável:** mapa de navegação.

### 12. Validar com tree testing
**Objetivo:** confirmar findability. **Método:** tree testing. **Entregável:** métricas e problemas.

### 13. Ajustar
**Objetivo:** corrigir o que falhou. **Método:** iteração. **Entregável:** IA revisada.

### 14. Documentar regras
**Objetivo:** garantir consistência futura. **Método:** guia de taxonomia e nomenclatura. **Entregável:** regras de crescimento.

---

## 22. Entregáveis comuns de IA

- **Inventário de conteúdo** — lista de tudo que existe.
- **Auditoria de conteúdo** — decisão (manter/remover/unir/reescrever/criar).
- **Top tasks** — tarefas prioritárias com evidência.
- **Taxonomia** — categorias, atributos, facetas.
- **Sitemap** — diagrama da hierarquia.
- **Mapa de navegação** — como a IA se expõe na UI.
- **Proposta de menu** — estrutura e rótulos do menu.
- **Matriz de categorias** — itens × categorias/atributos.
- **Relatório de card sorting** — agrupamentos e rótulos do usuário.
- **Relatório de tree testing** — métricas de findability.
- **Lista de labels** — rótulos definidos.
- **Regras de nomenclatura** — padrões para consistência.
- **Modelo de filtros** — facetas e atributos.
- **Requisitos de busca** — termos, sinônimos, comportamento.
- **Recomendações de conteúdo** — o que criar/ajustar.

---

## 23. Erros comuns em Arquitetura da Informação

- **Confundir IA com sitemap** — o sitemap é só a saída visual.
- **Organizar pelo organograma da empresa** — estrutura interna ≠ modelo mental do usuário.
- **Usar nomes internos** — jargão e marca têm baixo information scent.
- **Criar categorias ambíguas** — sobreposição faz o usuário errar.
- **Menus fundos demais sem necessidade** — muitos níveis cansam.
- **Menus rasos demais e cheios de opções** — excesso de itens no mesmo nível paralisa.
- **Ignorar a busca** — para muitos usuários, é o caminho principal.
- **Ignorar usuários iniciantes** — quem não conhece o jargão se perde.
- **Colocar tudo na home** — sem prioridade, nada se destaca.
- **Não testar labels** — rótulo não validado é aposta.
- **Card sorting com cartões ruins** — entrada ruim, saída ruim.
- **Tree testing com tarefas mal escritas** — tarefa que entrega a resposta não testa nada.
- **Filtro que não ajuda a decidir** — atributo do banco ≠ critério do usuário.
- **Misturar critérios na mesma categoria** — quebra a lógica e a previsibilidade.
- **Não atualizar a IA conforme o produto cresce** — estrutura velha não escala.

---

## 24. Checklist de qualidade da IA

- [ ] Os usuários conseguem **prever** o que existe em cada categoria?
- [ ] Os **labels são claros** (alto information scent)?
- [ ] A navegação reflete **tarefas reais** (top tasks), não departamentos?
- [ ] A IA **escala** com novos conteúdos sem quebrar?
- [ ] Os **filtros ajudam decisões reais** do usuário?
- [ ] A **busca cobre os termos** que o usuário usa?
- [ ] Há **redundância desnecessária** a eliminar?
- [ ] Os **conteúdos importantes são encontráveis**?
- [ ] A estrutura foi **validada com usuários** (tree testing)?
- [ ] Há **evidência** por trás das principais decisões?

---

## 25. Como aplicar em um projeto real

**Cenário:** um site institucional que será transformado em e-commerce.

Sequência:
1. **Inventariar** conteúdo institucional e produtos.
2. **Auditar** páginas existentes (manter/remover/unir/reescrever).
3. **Levantar categorias e atributos** dos produtos.
4. **Entrevistar usuários** para entender a decisão de compra e o vocabulário.
5. **Mapear top tasks** (encontrar, comparar, comprar, acompanhar pedido).
6. **Card sorting** com produtos, categorias e conteúdos.
7. **Propor o sitemap.**
8. **Definir menu e labels** (alto information scent).
9. **Definir filtros e facetas** a partir dos atributos de decisão.
10. **Criar a estrutura das páginas de categoria.**
11. **Validar com tree testing.**
12. **Ajustar** com base nos resultados.
13. **Documentar regras** para crescimento futuro.

**Exemplos (marcados como exemplo):**
- *Categorias:* Violões, Teclados, Baterias, Acessórios.
- *Filtros:* faixa de preço, nível, tipo, marca, uso principal, compatibilidade.
- *Label ruim:* "Universo Musical" (jargão, baixo scent).
- *Label melhor:* "Instrumentos por categoria" (claro e específico).
- *Tarefa de tree testing:* "Você quer comprar seu primeiro violão e gastar pouco. Onde você procuraria?" (não usa a palavra "iniciante" nem "violão" como no rótulo, para não entregar a resposta).

---

## 26. Relação com outros arquivos da base

- **`01_UX_RESEARCH_METHODS.md`** — card sorting e tree testing aparecem lá resumidos; aqui são detalhados e aplicados à IA.
- **`02_DISCOVERY_AND_DOUBLE_DIAMOND.md`** — a IA costuma entrar na transição Define→Develop; top tasks ajudam a recortar o problema.
- **`03_USER_INTERVIEWS_AND_CONTEXT.md`** — entrevistas revelam o vocabulário e o modelo mental que viram categorias e labels.
- **`04_SYNTHESIS_AND_MAPPING.md`** — a síntese (padrões, linguagem do usuário) alimenta a taxonomia; jornadas mostram onde a IA precisa entregar.
- **`06_IDEATION_AND_WORKSHOPS.md`** — card sorting e propostas de IA podem ser conduzidos como workshop.
- **`07_USABILITY_TESTING.md`** — complementa o tree testing: a IA testada sem UI lá ganha o teste com a interface completa.
- **`08_UX_METRICS.md`** — taxa de sucesso, busca interna e analytics medem a saúde da IA ao longo do tempo.
- **`09_ECOMMERCE_UX_RESEARCH.md`** — aprofunda categorias, filtros e busca no contexto específico de e-commerce.
- **`10_ACCESSIBILITY_RESEARCH.md`** — navegação e labels claros são também requisitos de acessibilidade (estrutura semântica, previsibilidade).

---

## 27. Fontes utilizadas

Links que você enviou, resumidos com palavras próprias (nenhum conteúdo copiado). Status de acesso indicado.

1. **Information Architecture (topic) — NN/g** — https://www.nngroup.com/topic/information-architecture/ — *Tema acessível e fundamentado;* página-tema, conteúdo coberto pelos artigos abaixo.
2. **Information Architecture Study Guide — NN/g** — https://www.nngroup.com/articles/ia-study-guide/ — *Tema acessível e fundamentado;* URL específico não retornou isoladamente nas buscas.
3. **Information Architecture vs. Sitemaps — NN/g** — https://www.nngroup.com/articles/information-architecture-sitemaps/ — *Acessível.* IA é o processo; sitemap é a saída visual, menos detalhada.
4. **The Difference Between IA and Navigation — NN/g** — https://www.nngroup.com/articles/ia-vs-navigation/ — *Acessível.* IA é o backbone; navegação é a ponta do iceberg na UI.
5. **Information Architecture: 3 Models (vídeo) — NN/g** — https://www.nngroup.com/videos/information-architecture-models/ — *Acessível.* Navegação, taxonomia e estrutura IA como modelos distintos.
6. **Taxonomy 101 — NN/g** — https://www.nngroup.com/articles/taxonomy-101/ — *Acessível.* Taxonomia como estrutura de bastidor; base das facetas; vocabulário controlado.
7. **Card Sorting — NN/g** — https://www.nngroup.com/articles/card-sorting-definition/ — *Acessível.* Aberto/fechado/híbrido; 30–50 cartões; usado para descobrir modelo mental.
8. **Card Sorting vs. Tree Testing — NN/g** — https://www.nngroup.com/articles/card-sorting-tree-testing-differences/ — *Acessível.* Card sorting gera; tree testing avalia.
9. **Tree Testing — NN/g** — https://www.nngroup.com/articles/tree-testing/ — *Acessível.* Avalia findability sem interferência visual; "se não está checando, está adivinhando".
10. **Interpreting Tree Test Results — NN/g** — https://www.nngroup.com/articles/interpreting-tree-test-results/ — *Acessível.* Primeiro clique, sucesso/diretividade, destinos errados, sobreposição de categorias.
11. **Information Scent — NN/g** — https://www.nngroup.com/articles/information-scent/ — *Tema acessível e fundamentado* (via "3 IA Mistakes"); URL específico não retornou isoladamente.
12. **3 Common IA Mistakes — NN/g** — https://www.nngroup.com/articles/3-ia-mistakes/ — *Acessível.* Erros por baixo information scent; verbos vagos como categoria.
13. **Category Names — NN/g** — https://www.nngroup.com/articles/category-names-suck/ — *Tema acessível e fundamentado* (via artigos de labels/IA mistakes); URL específico não retornou isoladamente.
14. **Menu-Design Checklist — NN/g** — https://www.nngroup.com/articles/menu-design/ — *Acessível.* Indicar localização atual; labels familiares; sem jargão; hambúrguer não no desktop.
15. **Top Tasks (vídeo) — NN/g** — https://www.nngroup.com/videos/top-tasks-ux-design/ — *Tema acessível e fundamentado;* URL específico não retornou isoladamente. Conceito de top tasks usado para priorizar IA.
16. **Information Architecture — Digital.gov** — https://digital.gov/topics/information-architecture/ — *Tema acessível e fundamentado;* página-tema do Digital.gov.
17. **Open-source IA Design (card sorting e tree testing) — Digital.gov** — https://digital.gov/2022/01/06/open-source-information-architecture-design-using-the-tools-you-have-to-conduct-card-sorting-and-tree-testing/ — *Acessível.* Caso real (onrr.gov): card sort no GitHub + tree test em protótipo, ~10 tarefas revisadas.
18. **How we refined our approach to card sorting — GOV.UK User Research Blog** — https://userresearch.blog.gov.uk/2018/03/23/how-we-refined-our-approach-to-card-sorting/ — *Domínio acessível;* este post específico não retornou isoladamente nas buscas. Tema fundamentado pelas fontes da NN/g e Digital.gov.
19. **Doing user research remotely (phone/video) — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research/remote-user-research-phone-video-call — *Acessível* (listado no índice do Service Manual). Apoio para card sorting/tree testing remotos.

---

## 28. Resumo executivo

Este arquivo é o **manual de estrutura** da base. O Claude Cowork deve usá-lo assim:

1. Trate IA como a **estrutura completa** (organização + rótulos + navegação + busca), não como sitemap nem como menu (Seções 2–3).
2. Antes de estruturar, descubra o **modelo mental** e as **top tasks** (Seções 6 e 9) — organize por tarefa do usuário, não pelo organograma.
3. Para **criar/informar** a estrutura use **card sorting**; para **validar** use **tree testing** — um não substitui o outro (Seções 11–15).
4. Cuide dos **rótulos** (information scent alto) e da **taxonomia** que sustenta filtros e busca (Seções 10, 16, 18).
5. Feche sempre **validando com evidência** (tree testing, analytics, busca) e **documentando regras** para escalar (Seções 21, 24).

Princípio que guia tudo: **organize pelo modelo mental do usuário, nomeie com clareza e valide com pesquisa — se não está checando, está adivinhando.**
