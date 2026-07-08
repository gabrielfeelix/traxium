# 01_UX_RESEARCH_METHODS — Métodos de UX Research

> Arquivo-base da biblioteca. Serve para decidir **qual método de pesquisa usar** em um projeto real, conectando dúvida → risco → método → evidência → decisão.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 13. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o ponto de partida para qualquer decisão de pesquisa dentro da base. Ele responde a três perguntas práticas:

- **O que** dá para investigar em UX e com qual tipo de método.
- **Quando** usar cada método (e quando não usar).
- **Como** transformar pesquisa em decisão de produto com evidência.

Não é um curso. É uma referência de consulta: abrir, encontrar o método certo para a situação, saber o que ele entrega e quais armadilhas evitar.

---

## 2. O que é UX Research

UX Research é o trabalho de **reduzir incerteza sobre usuários, problemas e contexto** antes (e durante) o desenho de uma solução, usando evidência em vez de achismo.

Na prática, é responder perguntas como: quem é a pessoa, o que ela está tentando fazer, onde isso acontece, o que a trava, e se uma solução proposta funciona. A pesquisa pode ouvir percepções, observar comportamentos, medir números — ou combinar tudo isso.

O objetivo final nunca é "fazer pesquisa". É **embasar uma decisão**: o que construir, o que priorizar, o que corrigir, o que abandonar.

---

## 3. Por que pesquisar antes de desenhar

Começar pela tela (UI) sem entender problema, usuário e contexto é o erro mais caro e mais comum. O risco:

- **Resolver o problema errado.** Uma interface linda para uma necessidade que não existe continua sendo desperdício.
- **Otimizar o detalhe e ignorar o todo.** Ajustar botão e cor enquanto o fluxo ou a arquitetura estão quebrados.
- **Decidir por opinião do mais forte.** Sem evidência, ganha quem fala mais alto (gestor, solicitante, designer), não quem está certo.
- **Retrabalho.** Corrigir depois do desenvolvimento custa muito mais do que descobrir antes.

Pesquisa não atrasa o projeto: ela **direciona o esforço de UI para o lugar certo**. Mesmo em times com pouca margem para pesquisa formal, há métodos leves (desk research, análise de dados existentes, benchmark, análise heurística) que reduzem incerteza sem grande custo — ver Seções 6 e 8.

---

## 4. Tipos de pesquisa em UX

As "categorias" abaixo não são caixas isoladas: são **eixos** que se cruzam. Um mesmo estudo pode ser, por exemplo, qualitativo + comportamental + avaliativo. Pensar por eixos ajuda a escolher o método certo.

### 4.1 Pesquisa qualitativa

Coleta dados de **poucas pessoas, em profundidade**, geralmente por observação ou conversa direta. Responde **"por quê"** e **"como"**. Boa para entender motivações, dores, expectativas e descobrir o que você ainda nem sabia perguntar. Exemplos: entrevistas, pesquisa contextual, testes de usabilidade qualitativos, diary studies.

### 4.2 Pesquisa quantitativa

Coleta dados de **muitas pessoas** e gera números. Responde **"quanto"** e **"quantos"**, mede a dimensão de um problema e permite estatística. Boa para priorizar, dimensionar e acompanhar ao longo do tempo. Exemplos: surveys, analytics, testes A/B, testes de usabilidade quantitativos (taxa de sucesso, tempo de tarefa).

### 4.3 Pesquisa comportamental

Foca no que as pessoas **fazem** — ações observáveis. Mais confiável para entender uso real, porque comportamento não depende do que a pessoa lembra ou admite. Exemplos: testes de usabilidade, analytics, A/B, first-click test, tree testing.

### 4.4 Pesquisa atitudinal

Foca no que as pessoas **dizem** — percepções, crenças, preferências, satisfação. Útil para entender o "porquê" e a experiência subjetiva, mas **limitada pelo que a pessoa percebe e está disposta a relatar**. Exemplos: entrevistas, surveys, focus groups, testes de desejabilidade.

> Regra de ouro (NN/g): *o que as pessoas dizem ≠ o que as pessoas fazem.* Quando a decisão é importante, prefira evidência comportamental ou combine os dois.

### 4.5 Pesquisa generativa

Também chamada de descoberta, exploratória ou foundational. Acontece **no início**, quando o problema ainda é nebuloso. Serve para **gerar ideias e descobrir oportunidades**: entender o problema, o usuário e o contexto antes de propor solução. Costuma ser qualitativa. Exemplos: entrevistas, pesquisa contextual, desk research, diary study.

### 4.6 Pesquisa avaliativa

Serve para **avaliar uma solução** (ideia, protótipo ou produto existente) e ver se funciona. Subdivide-se em:
- **Formativa:** durante o desenho, para melhorar (ex.: teste de usabilidade em protótipo).
- **Somativa:** ao final, para medir/comprovar (ex.: teste quantitativo, benchmark de métricas).

Exemplos: testes de usabilidade, análise heurística, A/B, tree testing.

---

## 5. Matriz de escolha de métodos

| Situação do projeto | Pergunta que preciso responder | Método recomendado | Tipo de dado | Entregável esperado |
|---|---|---|---|---|
| **Início de projeto** | Qual é o problema e quem são os usuários? | Desk research + análise de dados existentes + entrevistas | Qualitativo / generativo | Matriz CSD, mapa de achados, hipóteses |
| **Dúvida sobre público** | Quem realmente usa e o que precisa? | Entrevistas + survey de perfil + analytics de segmentação | Qual + quant | Personas, segmentação |
| **Dúvida sobre problema** | Que dores, necessidades e contexto existem? | Entrevistas + pesquisa contextual + diary study | Qualitativo | Insights, JTBD, jornada do usuário |
| **Validação de arquitetura** | A estrutura faz sentido? As pessoas encontram as coisas? | Card sorting (gerar) + tree testing (validar) | Comportamental | Arquitetura da informação validada |
| **Teste de protótipo** | As pessoas conseguem concluir as tarefas? Onde travam? | Teste de usabilidade (moderado ou não moderado) | Qualitativo / comportamental | Lista priorizada de problemas + recomendações |
| **Avaliação de produto existente** | Onde estão os problemas de usabilidade hoje? | Análise heurística + teste de usabilidade | Qualitativo | Relatório de problemas por severidade |
| **Melhoria pós-lançamento** | O que melhorar primeiro? O ajuste funcionou? | Analytics + A/B + feedback contínuo | Quantitativo | Backlog de oportunidades, decisão data-informed |
| **Análise de métricas** | Qual a dimensão? Quanto / quantos? | Analytics + survey + métricas (SUS, taxa de sucesso) | Quantitativo | Dashboard / benchmark de UX |

---

## 6. Principais métodos de UX Research

Formato fixo por método: para que serve · quando usar · quando não usar · como aplicar · entregáveis · cuidados.

### 6.1 Desk research
**Para que serve:** reunir o que já se sabe (estudos, relatórios de mercado, documentos internos, pesquisas anteriores) antes de coletar dado novo.
**Quando usar:** no início, para não reinventar a roda e embasar hipóteses.
**Quando não usar:** como substituto do contato com usuário real ou quando a pergunta exige comportamento atual.
**Como aplicar:** levantar fontes internas e externas, sintetizar o que é relevante, mapear lacunas que viram perguntas de pesquisa.
**Entregáveis:** síntese de contexto, lista de lacunas e hipóteses.
**Cuidados:** fontes desatualizadas; confundir "opinião de mercado" com necessidade comprovada do seu usuário.

### 6.2 Análise de dados existentes
**Para que serve:** usar analytics, tickets de suporte, dados de vendas e gravações de sessão para descobrir onde o produto dói.
**Quando usar:** quando há histórico de uso; para priorizar onde investigar a fundo.
**Quando não usar:** para entender o "porquê" (dados mostram o quê, não a causa).
**Como aplicar:** definir perguntas claras, cruzar fontes (funil, drop-off, buscas internas, tickets), identificar padrões.
**Entregáveis:** mapa de pontos críticos, hipóteses priorizadas.
**Cuidados:** correlação não é causa; instrumentação ruim gera dado enganoso.

### 6.3 Benchmark UX
**Para que serve:** comparar a experiência do seu produto com concorrentes e referências para achar forças, lacunas e padrões.
**Quando usar:** início e exploração; ao justificar decisões de escopo.
**Quando não usar:** como cópia cega ("o concorrente faz, então é certo") ou substituto de pesquisa com seu usuário.
**Como aplicar:** definir critérios e fluxos, avaliar concorrentes nas mesmas tarefas, registrar padrões e quebras.
**Entregáveis:** matriz comparativa, lista de padrões e oportunidades.
**Cuidados:** "todo mundo faz" não valida nada; o concorrente também pode estar errado.

### 6.4 Entrevistas com usuários
**Para que serve:** entender percepções, motivações, contexto e necessidades reais (atitudinal e qualitativo).
**Quando usar:** descoberta; quando você precisa entender o "porquê".
**Quando não usar:** para medir comportamento ou prever uso futuro — *"você usaria?"* não é evidência.
**Como aplicar:** roteiro semiestruturado, perguntas abertas sobre experiências passadas e concretas, ~5–8 pessoas por perfil.
**Entregáveis:** roteiro, notas/transcrições, insights, citações de apoio.
**Cuidados:** perguntas que induzem a resposta; futuro hipotético; entrevistar o perfil errado.

### 6.5 Pesquisa contextual / observação
**Para que serve:** observar o usuário **no ambiente real de uso**, capturando comportamento + contexto que ele não saberia descrever.
**Quando usar:** quando o contexto importa muito — B2B, fluxos de trabalho, ambientes específicos.
**Quando não usar:** sem acesso ao ambiente real; quando a pergunta é de escala (quanto/quantos).
**Como aplicar:** ir ao local (ou observar remotamente), observar a tarefa acontecendo e perguntar durante, não só depois.
**Entregáveis:** notas de campo, jornada real, insights contextuais.
**Cuidados:** efeito observador (a pessoa muda quando é observada); generalizar a partir de poucos casos.

### 6.6 Diary study
**Para que serve:** capturar comportamento e percepção **ao longo do tempo** (dias ou semanas), com registros feitos pelo próprio usuário.
**Quando usar:** jornadas longas, uso recorrente, mudança de hábito, experiências que variam no tempo.
**Quando não usar:** quando precisa de resposta rápida; sem engajamento dos participantes.
**Como aplicar:** definir gatilhos de registro, fornecer um meio simples de captura, acompanhar adesão, sintetizar ao final.
**Entregáveis:** linha do tempo da experiência, padrões longitudinais.
**Cuidados:** abandono e registros incompletos; exige incentivo e lembretes.

### 6.7 Surveys
**Para que serve:** coletar dados de **muitas pessoas** em escala — prevalência, segmentação, satisfação.
**Quando usar:** quando já há hipóteses claras a medir; para dimensionar e priorizar.
**Quando não usar:** para descobrir o desconhecido (você só pergunta o que já imagina); amostra pequena para conclusão quantitativa.
**Como aplicar:** objetivo claro, maioria de perguntas fechadas + poucas abertas, testar antes de enviar, garantir amostra suficiente.
**Entregáveis:** relatório quantitativo, segmentação.
**Cuidados:** perguntas tendenciosas; amostra não representativa; tirar conclusão causal de dado descritivo.

### 6.8 Card sorting
**Para que serve:** entender o **modelo mental** dos usuários sobre como agrupar e nomear conteúdo.
**Quando usar:** ao criar ou repensar a arquitetura da informação.
**Quando não usar:** para validar uma estrutura já pronta — para isso use tree testing.
**Como aplicar:** aberto (o usuário cria os grupos) ou fechado (categorias dadas); presencial ou por ferramenta.
**Entregáveis:** agrupamentos, matriz de similaridade, proposta de IA.
**Cuidados:** tratar o resultado como decisão final automática; amostra pequena para card sorting quantitativo.

### 6.9 Tree testing
**Para que serve:** validar se as pessoas **encontram** itens dentro de uma estrutura de navegação, sem interferência de UI.
**Quando usar:** depois de propor a arquitetura; para medir "achabilidade".
**Quando não usar:** para gerar a estrutura (isso é card sorting).
**Como aplicar:** montar a árvore de navegação em texto, dar tarefas de localização, medir taxa de sucesso e caminhos percorridos.
**Entregáveis:** taxa de sucesso por tarefa, pontos de confusão, ajustes de IA.
**Cuidados:** tarefas mal escritas que entregam a resposta; ignorar diferença entre caminho direto e indireto.

### 6.10 Teste de usabilidade moderado
**Para que serve:** observar usuários realizando tarefas com um facilitador, pensando alto (comportamental + qualitativo). É o método central para entender **por que** algo falha.
**Quando usar:** em protótipos e produtos; quando precisa de profundidade.
**Quando não usar:** para medir em escala estatística; quando só precisa de número.
**Como aplicar:** definir perguntas e tarefas reais, recrutar usuários reais do serviço, separar facilitador e observador, ~5 por rodada, iterar.
**Entregáveis:** lista priorizada de problemas, recomendações, clipes/evidências.
**Cuidados:** dar dicas ao usuário; tarefas artificiais; transformar 1 caso isolado em regra.

### 6.11 Teste de usabilidade não moderado
**Para que serve:** usuários realizam tarefas **sem facilitador**, via ferramenta. Mais rápido, barato e escalável.
**Quando usar:** validação rápida, muitos participantes, público distribuído.
**Quando não usar:** fluxos complexos que exigem sondagem ao vivo; quando precisa entender o "porquê" em profundidade.
**Como aplicar:** roteiro autoexplicativo, tarefas claras e sem ambiguidade, coletar métricas + gravações.
**Entregáveis:** métricas de sucesso/tempo, gravações, lista de problemas.
**Cuidados:** sem facilitador não dá para perguntar; instrução ambígua estraga o dado inteiro.

### 6.12 Análise heurística
**Para que serve:** especialistas avaliam a interface contra princípios consolidados (ex.: heurísticas de Nielsen) para achar problemas **sem usuário**.
**Quando usar:** triagem rápida; antes ou junto do teste com usuário; recursos limitados.
**Quando não usar:** como substituto do teste com usuário real — os achados são hipóteses de especialista, não "verdade do usuário".
**Como aplicar:** 2–3 avaliadores percorrem os fluxos, registram problemas e classificam por severidade.
**Entregáveis:** lista de problemas por severidade, recomendações.
**Cuidados:** viés do especialista; deixa passar o que o usuário real faria de fato.

### 6.13 Testes A/B
**Para que serve:** comparar duas ou mais versões com tráfego real e medir qual performa melhor (quantitativo + comportamental).
**Quando usar:** pós-lançamento, otimização, decisões em telas com volume suficiente.
**Quando não usar:** com pouco tráfego (sem significância estatística); para descobrir o porquê.
**Como aplicar:** hipótese clara, mudar uma variável por vez, definir métrica primária, rodar até atingir significância.
**Entregáveis:** resultado estatístico, decisão, aprendizado documentado.
**Cuidados:** parar o teste cedo demais; testar muitas coisas ao mesmo tempo; otimizar a métrica errada.

### 6.14 Métricas e analytics
**Para que serve:** medir comportamento real **em escala e no tempo** — funil, conversão, drop-off, conclusão de tarefa.
**Quando usar:** contínuo; priorização; medir impacto de mudanças.
**Quando não usar:** para entender intenção e motivação; sem instrumentação confiável.
**Como aplicar:** definir métricas ligadas a objetivos (ex.: framework HEART), instrumentar, monitorar, cruzar com dado qualitativo.
**Entregáveis:** dashboard, benchmark, hipóteses de melhoria.
**Cuidados:** vanity metrics; número sem contexto; medir o que é fácil em vez do que importa.

### 6.15 Pesquisa contínua
**Para que serve:** manter **contato recorrente** com usuários (ex.: entrevistas semanais) para decidir com evidência de forma constante, não apenas em "projetos" isolados.
**Quando usar:** times de produto maduros; abordagem de continuous discovery (Teresa Torres).
**Quando não usar:** sem cadência mínima ou sem alguém que sintetize e aja sobre os achados.
**Como aplicar:** cadência fixa de conversas, conectar cada achado a oportunidades e decisões, manter um repositório vivo.
**Entregáveis:** fluxo contínuo de insights, árvore de oportunidades, backlog vivo.
**Cuidados:** virar "pesquisa pela pesquisa"; coletar e não agir; não sintetizar.

---

## 7. Como escolher o método certo

Um processo simples, na ordem. Responda antes de abrir o Figma:

1. **Qual decisão precisa ser tomada?** Sem decisão-alvo, a pesquisa vira passatempo.
2. **Qual risco precisa ser reduzido?** É risco de valor, de usabilidade, de navegação? (Ver Seção 8.)
3. **O que já sabemos?** Dados, pesquisas anteriores, suporte — desk research primeiro.
4. **O que ainda é suposição?** O que é hipótese disfarçada de certeza é o que você precisa testar.
5. **Preciso observar comportamento ou ouvir percepção?** Comportamento → métodos comportamentais. Percepção/motivação → atitudinais.
6. **Preciso de profundidade ou de escala?** Profundidade → qualitativo. Dimensão/quantidade → quantitativo.
7. **O que cabe no prazo e no orçamento?** Método perfeito que não cabe na realidade não serve; escolha o mais forte que é viável.

Regra prática: **a dúvida e o risco definem o método — não o contrário.** Comece pela decisão, não pela técnica favorita.

---

## 8. Relação entre método, risco e decisão

A matriz **risco → método → evidência** (o atalho mais útil da base) vive agora em **`_METHOD_PICKER` §3** — arquivo-régua sempre no contexto. Não duplicada aqui para manter um único dono.

> Regra: parte do **risco** (o que pode dar errado) e indica o método que produz a evidência certa. Viabilidade e parte do risco de negócio não se resolvem com pesquisa de usuário, mas o UX precisa conhecê-los para não desenhar fora do possível.

---

## 9. Entregáveis comuns de UX Research

- **Plano de pesquisa** — objetivo, perguntas, método, participantes, cronograma. Alinha todos antes de começar.
- **Roteiro de entrevista** — guia semiestruturado de perguntas abertas.
- **Matriz CSD** — Certezas, Suposições e Dúvidas. Separa o que se sabe do que se supõe e do que se precisa investigar.
- **Mapa de achados** — organização dos dados brutos em temas.
- **Insights** — conclusões acionáveis que conectam achado a decisão.
- **Jornada do usuário** — etapas, ações, emoções e pontos de atrito ao longo da experiência.
- **Jobs To Be Done (JTBD)** — o "trabalho" que a pessoa contrata o produto para fazer.
- **Personas** *(quando fizer sentido)* — arquétipos baseados em dados reais, não em suposição. Sem pesquisa, viram ficção.
- **Relatório de pesquisa** — síntese de método, achados e recomendações.
- **Recomendações priorizadas** — o que fazer, em ordem de impacto/esforço.
- **Backlog de oportunidades** — lista viva de problemas e melhorias a explorar.
- **Hipóteses de solução** — apostas a validar, não verdades.
- **Plano de validação** — como cada hipótese será testada.

---

## 10. Erros comuns em UX Research

- **Perguntar "você usaria?"** — futuro hipotético não prevê comportamento real.
- **Pesquisar só opinião** — preferência declarada raramente bate com o que a pessoa faz.
- **Confundir preferência com comportamento** — gostar de algo ≠ usar algo.
- **Entrevistar as pessoas erradas** — dado bom de perfil errado é dado inútil.
- **Amostra pequena demais para decisão quantitativa** — número sem base estatística é ilusão de certeza.
- **Ignorar dados existentes** — sair coletando sem olhar analytics e suporte que já existem.
- **Transformar achado isolado em verdade absoluta** — um caso é pista, não lei.
- **Procurar validação para uma ideia já decidida** — pesquisa que só busca confirmar é teatro.
- **Não documentar evidências** — sem registro, o insight some e a decisão fica frágil.
- **Não conectar pesquisa com decisão** — pesquisa que não muda nada é custo, não valor.

---

## 11. Checklist rápido para escolher método

Antes de iniciar qualquer pesquisa, responda:

- [ ] **Qual decisão** esta pesquisa vai apoiar?
- [ ] **Qual risco** estou tentando reduzir?
- [ ] **O que já sei** (dados, pesquisas, suporte) e já consultei?
- [ ] **O que ainda é suposição** que preciso testar?
- [ ] Preciso de **comportamento** (o que fazem) ou **percepção** (o que dizem)?
- [ ] Preciso de **profundidade** (qualitativo) ou **escala** (quantitativo)?
- [ ] **Quem** é o perfil certo e **como** vou recrutar?
- [ ] O método **cabe no prazo e no orçamento**?
- [ ] Que **entregável** sai disso e **quem** vai usá-lo para decidir?
- [ ] Como vou **documentar** a evidência?

Se não der para responder "qual decisão" e "qual risco", **pare**: ainda não é hora de pesquisar.

---

## 12. Como aplicar em um projeto real

**Cenário:** um site institucional que será transformado em e-commerce.

Sequência de métodos, do problema à melhoria contínua:

1. **Alinhamento inicial** — entrevistar stakeholders e solicitantes para entender objetivo de negócio, restrições e definição de sucesso.
2. **Desk research** — levantar pesquisas, dados de mercado e documentação interna existentes; mapear lacunas.
3. **Benchmark UX** — analisar concorrentes de e-commerce nos fluxos críticos (busca, listagem, produto, checkout) e registrar padrões.
4. **Análise de dados existentes** — olhar analytics do site atual, buscas internas e suporte para ver onde as pessoas já travam.
5. **Entrevistas** — conversar com usuários reais para entender necessidades, dúvidas e contexto de compra.
6. **Arquitetura da informação** — propor a estrutura de categorias e navegação com base nos achados.
7. **Card sorting + tree testing** — gerar e validar a organização do catálogo (card sorting para criar, tree testing para validar achabilidade).
8. **Protótipo** — desenhar os fluxos principais já informado por tudo acima.
9. **Teste de usabilidade** — observar usuários concluindo tarefas-chave (encontrar produto, comprar) e corrigir os problemas prioritários.
10. **Métricas pós-lançamento** — acompanhar conversão, drop-off no checkout e tarefas; usar A/B e feedback contínuo para priorizar melhorias.

Nem todo projeto comporta as 10 etapas. Com pouca margem para pesquisa formal, o núcleo de maior retorno costuma ser: **2 (desk), 3 (benchmark), 4 (dados existentes) e 9 (teste de usabilidade)** — métodos que reduzem incerteza sem depender de grandes estudos.

---

## 13. Fontes utilizadas

Links que você enviou e que sustentam este arquivo (resumidos com palavras próprias; nenhum conteúdo copiado). Status de acesso indicado.

1. **When to Use Which User-Experience Research Methods — NN/g** — https://www.nngroup.com/articles/which-ux-research-methods/ — *Acessível.* Base do framework de 3 dimensões: atitudinal × comportamental, qualitativo × quantitativo e contexto de uso.
2. **UX Research Cheat Sheet — NN/g** — https://www.nngroup.com/articles/ux-research-cheat-sheet/ — *Acessível.* Base do "quando usar cada método" ao longo das fases Descobrir / Explorar / Testar / Ouvir.
3. **User research — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research — *Acessível.* Métodos de pesquisa em contexto ágil/institucional: entrevistas, teste moderado, mapas de experiência, pop-up research.
4. **Research — Digital.gov** — https://digital.gov/topics/research/ — *Acessível.* Pesquisa com usuários em contexto institucional, consentimento e tratamento de dados pessoais (PII).
5. **Usability — Digital.gov** — https://digital.gov/topics/usability/ — *Acessível.* Definição e prática de testes de usabilidade, com scripts, checklists e planos de pesquisa de exemplo.
6. **User research methods — Defra digital** — https://digital.defra.gov.uk/user-research/research-methods — *Não consegui acessar este URL exato* (não retornou nas buscas; provavelmente mudou de endereço). Para não inventar, **não usei conteúdo deste link**. Existe material público correlato da Defra (blog de pesquisa e um "user research manual" recém-criado), mas em outro domínio.
7. **18F Methods: Usability testing — Digital Government Hub** — https://digitalgovernmenthub.org/library/18f-methods-usability-testing/ — *Acessível.* Método de teste de usabilidade do 18F: observar o usuário realizando tarefas pensando alto, com ≤ 9 participantes.

**Sugestões adicionais (não enviadas por você — sinalizadas como opcionais):**
- *User Research Methods — A4 (NN/g, PDF):* o "mapa" visual de métodos posicionados nos eixos. Bom como pôster de consulta.
- *18F Methods (hub de guias):* catálogo aberto de métodos (recrutamento, card sorting, métricas de sucesso etc.), útil para o arquivo 05 e 07.

---

## 14. Resumo executivo

Este arquivo é a **porta de entrada metodológica** da base. O Claude Cowork deve usá-lo assim:

1. Diante de um projeto, comece pela **Seção 7** (qual decisão? qual risco?) e pela **Seção 8** (risco → método → evidência).
2. Use a **Seção 5** (matriz) para ir da situação ao método e ao entregável.
3. Consulte a **Seção 6** para o detalhe de cada método (quando usar, quando não, cuidados).
4. Em contextos com pouca margem para pesquisa formal, priorize os métodos leves destacados nas Seções 6, 8 e 12 (desk research, dados existentes, benchmark, análise heurística).
5. Sempre feche conectando **pesquisa → decisão**: se o método escolhido não muda nenhuma decisão, ele não deve ser feito.

Princípio que guia tudo: **menos opinião, mais evidência; comece pela dúvida, não pela técnica.**
