# 02_DISCOVERY_AND_DOUBLE_DIAMOND — Discovery e Double Diamond

> Arquivo da fase inicial. Serve para **estruturar o começo de um projeto** quando ainda há muita incerteza sobre problema, público, solução, prioridade e estratégia.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 16. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento orienta a **descoberta**: o trabalho de transformar um pedido vago ("precisamos de uma tela X") em um problema bem definido, com riscos mapeados e hipóteses testáveis, antes de investir em solução.

Ele responde, na prática:
- Como conduzir a fase inicial de um projeto de UX/produto.
- Como usar o **Double Diamond** para separar problema de solução.
- Como usar **Product Discovery** para reduzir os riscos certos.
- Como organizar oportunidades com a **Opportunity Solution Tree**.
- Como evitar pular direto para a UI.

É a ponte entre o pedido do negócio e a execução com evidência.

---

## 2. O que é Discovery

Discovery é a etapa em que o time **reduz incerteza antes de comprometer recursos** com uma solução. Não é uma reunião nem um documento: é um processo de investigação que continua até haver evidência suficiente para decidir.

Discovery cumpre quatro papéis ao mesmo tempo:

- **Discovery como investigação** — entender problema, usuário, contexto e dados reais, em vez de assumir.
- **Discovery como redução de risco** — descobrir cedo o que pode fazer a solução falhar (valor, usabilidade, viabilidade, negócio), quando corrigir ainda é barato.
- **Discovery como alinhamento de equipe** — colocar negócio, design e desenvolvimento na mesma página sobre o que se sabe, o que se supõe e o que se decidiu.
- **Discovery como base para decisões de produto** — gerar evidência que sustenta o que construir, priorizar ou abandonar.

Se o trabalho de discovery não muda nenhuma decisão, ele não foi discovery — foi teatro.

---

## 3. Por que não começar direto pela solução

Abrir o Figma e desenhar telas (wireframe, layout, tecnologia) antes de entender o contexto é o erro mais caro do processo. Começar pela solução sem entender o que vem abaixo gera desperdício previsível:

- **Problema** — você pode estar resolvendo o problema errado com perfeição.
- **Usuário** — sem saber para quem, a tela atende a uma pessoa imaginária.
- **Contexto** — onde, quando e sob quais condições o uso acontece muda tudo.
- **Negócio** — a solução pode ser inviável comercialmente, legalmente ou em custo.
- **Restrições** — prazo, tecnologia e equipe definem o que é possível.
- **Riscos** — sem mapear o que pode dar errado, você não sabe o que precisa testar.
- **Evidências necessárias** — sem saber qual prova é preciso obter, a decisão fica no achismo.

A consequência clássica: **construir a solução certa para o problema errado.** Discovery não substitui o desenho — ele garante que o esforço de desenho seja gasto no lugar certo.

> Realidade de times "fábrica de features": quando não há margem para pesquisa formal, o discovery mínimo viável usa os métodos de baixo atrito (dados existentes, desk research, benchmark, análise heurística). Mesmo um discovery enxuto é melhor do que nenhum.

---

## 4. Double Diamond

O **Double Diamond** (Design Council) é um mapa visual do processo de design em dois losangos. O primeiro trata do **problema**; o segundo, da **solução**. Cada losango alterna um momento de **abrir** (divergir, explorar amplamente) e **fechar** (convergir, decidir com foco).

A lógica central: **entender o problema antes de desenhar a solução** — e, dentro de cada etapa, primeiro abrir possibilidades, depois estreitar para uma decisão.

Além das quatro fases, o *Framework for Innovation* (a versão expandida) acrescenta princípios e cultura de trabalho: foco nas pessoas, comunicação visual e inclusiva, colaboração/cocriação e iteração contínua.

### 4.1 Discover
**Diamante 1 — abrir (problema).** Explorar amplamente: entender o problema de verdade em vez de assumir. Falar com quem é afetado, observar comportamento, levantar dados e contexto. Saída: muito material bruto e várias hipóteses sobre onde está a dor.

### 4.2 Define
**Diamante 1 — fechar (problema).** Sintetizar o que foi aprendido, recortar o problema e escolher o foco. Aqui o desafio inicial costuma ser redefinido com base na evidência. Saída: uma **definição clara do problema** que vale a pena resolver.

### 4.3 Develop
**Diamante 2 — abrir (solução).** Gerar muitas respostas para o problema já definido: ideação, inspiração externa, cocriação, hipóteses de solução e protótipos. Saída: um leque de alternativas, não uma única ideia.

### 4.4 Deliver
**Diamante 2 — fechar (solução).** Testar as soluções em pequena escala, descartar o que não funciona, refinar o que funciona, entregar e medir impacto. Saída: solução validada e aprendizado para iterar.

> O Double Diamond não é linear na vida real: é comum voltar de Define para Discover, ou de Deliver para Develop, quando a evidência aponta outro caminho.

---

## 5. Pensamento divergente e convergente

O motor do Double Diamond é a alternância entre dois modos de pensar:

- **Divergir (abrir possibilidades)** — gerar muitas opções, buscar perspectivas diferentes, adiar o julgamento. Vale para problemas (quais dores existem?) e para soluções (quais respostas possíveis?).
- **Convergir (fechar decisões)** — comparar, filtrar por critério e escolher. Reduz o leque a uma decisão fundamentada.

**Por que alternar evita decisões pobres:** quem só converge fecha rápido demais na primeira ideia (geralmente a do mais forte na sala). Quem só diverge nunca decide e se perde em possibilidades. A força está no ritmo: abrir o suficiente para ter boas opções, fechar com critério para agir.

**Como aparece em projetos reais:**
- Divergir no problema: entrevistas, dados, benchmark trazem muitas hipóteses de dor.
- Convergir no problema: síntese e priorização recortam o problema principal.
- Divergir na solução: Crazy 8, brainstorming geram várias ideias.
- Convergir na solução: protótipo + teste eliminam o que não funciona e refinam o que funciona.

Erro comum: pular a divergência ("já sei a solução") e ir direto convergir — é assim que se constrói a coisa errada com eficiência.

---

## 6. Discovery em Produto

Product Discovery (SVPG / Marty Cagan) parte de uma ideia simples: **a maioria das ideias de produto falha, e falha por motivos previsíveis.** O papel do discovery é **reunir evidência para eliminar esses riscos antes de construir**.

No modelo canônico da SVPG, todo produto enfrenta **quatro riscos**: **valor, usabilidade, viabilidade (técnica) e viabilidade de negócio**. Times fortes gastam a maior parte do tempo em **valor** e **negócio** — porque usabilidade e viabilidade técnica costumam ser os riscos mais fáceis. A tabela abaixo inclui ainda **adoção** e **entrega** como lentes complementares (alguns times tratam adoção como parte do valor e entrega como parte da viabilidade técnica).

Nem todo item tem os seis riscos altos. O primeiro passo do discovery é **avaliar quais riscos são significativos** neste caso e focar neles — tratar tudo como risco máximo deixa o time lento demais.

| Tipo de risco | Pergunta crítica | Método de discovery recomendado | Evidência esperada |
|---|---|---|---|
| **Valor** | As pessoas querem/precisam disso a ponto de usar ou pagar? | Entrevistas, desk research, teste de desejabilidade, landing/fake-door test | Sinais de demanda e necessidade real |
| **Usabilidade** | As pessoas conseguem entender e usar? | Teste de usabilidade em protótipo, análise heurística, tree testing | Taxa de sucesso, problemas observados |
| **Viabilidade (técnica)** | Dá para construir com nossa tecnologia, tempo e equipe? | Spike técnico e prototipação com devs (UX informa o escopo) | Parecer de engenharia |
| **Viabilidade de negócio** | Funciona para vendas, marketing, jurídico, custo e marca? | Alinhamento com stakeholders, análise de restrições e de modelo de negócio | Restrições mapeadas, viabilidade comercial |
| **Adoção** | As pessoas vão mudar de comportamento e adotar de fato? | Analytics, A/B, piloto/beta, pesquisa contínua | Métricas de adoção e retenção |
| **Entrega** | Conseguimos lançar, operar e manter com qualidade? | Revisão técnica/operacional, prova de conceito, plano de rollout | Confirmação de capacidade de entrega |

> O detalhamento de cada método está em `01_UX_RESEARCH_METHODS.md` (Seção 8). Aqui o foco é **enxergar o risco**; lá, **escolher a técnica**.

---

## 7. Opportunity Solution Tree

A **Opportunity Solution Tree (OST)**, de Teresa Torres (Product Talk), é um mapa visual que liga um **resultado desejado** às **oportunidades** (necessidades reais dos usuários) e às **soluções** e **experimentos** que podem alcançá-lo. Ela existe para **forçar o time a explorar o espaço do problema antes de saltar para a solução** e para tornar explícitas as suposições escondidas.

Os quatro níveis:

- **Outcome (resultado desejado)** — a raiz. Uma métrica de negócio/comportamento (ex.: aumentar conclusão de checkout), não uma feature. Define o escopo do discovery.
- **Oportunidades** — necessidades, dores e desejos descobertos em conversas com usuários. São o "espaço do problema". Quebrar oportunidades grandes em menores deixa tudo mais solúvel.
- **Soluções** — ideias de como atender a uma oportunidade. É o "espaço da solução". O ideal é ter várias soluções por oportunidade para comparar.
- **Experimentos (testes de suposição)** — como validar se uma solução de fato move o outcome. Quebrar a ideia em suposições permite testar em dias, não semanas.

Estrutura visual (texto):

```
                 OUTCOME  (resultado desejado / métrica)
                          │
        ┌─────────────────┼─────────────────┐
   Oportunidade 1    Oportunidade 2    Oportunidade 3
   (necessidade/dor) (necessidade/dor) (necessidade/dor)
        │
   ┌────┴────┐
Solução A   Solução B
   │
Experimento / teste de suposição
```

**Como ela evita o salto para a solução:** ao exigir que toda solução esteja pendurada em uma oportunidade, que por sua vez está pendurada no outcome, a árvore deixa óbvio quando alguém propôs uma feature sem problema correspondente. Quando um experimento falha, o time volta na árvore e decide: refinar a solução, escolher outra oportunidade ou rever o outcome.

---

## 8. Etapas práticas de um Discovery inicial

Passo a passo para um projeto começando do zero. Nem todo projeto usa as 13 etapas — em contextos enxutos, priorize 1, 2, 3, 5 e 12.

### 1. Alinhamento de negócio
**Objetivo:** entender objetivo, restrições e definição de sucesso. **Responde:** por que agora? o que é sucesso? quais restrições? **Métodos:** entrevista com stakeholders, kickoff. **Entregáveis:** briefing de UX, mapa de stakeholders, métrica-alvo.

### 2. Mapeamento de certezas, suposições e dúvidas
**Objetivo:** separar fato de achismo. **Responde:** o que é evidência vs suposição? o que falta saber? **Métodos:** workshop de matriz CSD. **Entregáveis:** matriz CSD.

### 3. Levantamento de dados existentes
**Objetivo:** usar o que já existe antes de coletar dado novo. **Responde:** o que analytics, suporte e vendas já mostram? **Métodos:** análise de analytics, tickets, gravações de sessão. **Entregáveis:** mapa de pontos críticos, hipóteses priorizadas.

### 4. Desk research
**Objetivo:** reunir conhecimento externo e interno relevante. **Responde:** o que já se sabe sobre o problema e o mercado? **Métodos:** revisão de estudos, relatórios e documentação. **Entregáveis:** síntese de contexto + lacunas.

### 5. Benchmark
**Objetivo:** comparar com concorrentes e referências. **Responde:** como outros resolvem? quais padrões e quebras? **Métodos:** análise de concorrentes nos mesmos fluxos críticos. **Entregáveis:** matriz comparativa, oportunidades.

### 6. Pesquisa com usuários
**Objetivo:** entender necessidades, contexto e comportamento reais. **Responde:** o que as pessoas fazem, precisam e onde travam? **Métodos:** entrevistas, pesquisa contextual. **Entregáveis:** insights, citações de apoio.

### 7. Síntese
**Objetivo:** transformar dado bruto em padrões. **Responde:** que temas e dores se repetem? **Métodos:** affinity mapping, construção de jornada. **Entregáveis:** mapa de achados, jornada, insights.

### 8. Definição do problema
**Objetivo:** recortar o problema certo. **Responde:** qual problema vale a pena resolver? **Métodos:** problem statement, "Como podemos…" (HMW). **Entregáveis:** definição do problema, perguntas de oportunidade.

### 9. Priorização de oportunidades
**Objetivo:** focar onde há mais impacto no outcome. **Responde:** quais oportunidades movem o resultado? **Métodos:** Opportunity Solution Tree, matriz impacto × esforço. **Entregáveis:** oportunidades priorizadas.

### 10. Ideação
**Objetivo:** gerar alternativas de solução. **Responde:** quais respostas possíveis para a oportunidade escolhida? **Métodos:** Crazy 8, brainstorming estruturado, cocriação. **Entregáveis:** leque de ideias.

### 11. Prototipação
**Objetivo:** tornar a ideia testável. **Responde:** como a solução fica na prática? **Métodos:** protótipo de baixa/média fidelidade. **Entregáveis:** protótipo.

### 12. Validação
**Objetivo:** testar a solução contra os riscos. **Responde:** funciona? resolve? as pessoas usam? **Métodos:** teste de usabilidade, teste de suposição, A/B. **Entregáveis:** evidências, decisão.

### 13. Recomendação de próximos passos
**Objetivo:** conectar discovery à decisão de produto. **Responde:** o que construir, priorizar ou descartar? **Métodos:** síntese final, recomendação priorizada. **Entregáveis:** recomendação, escopo de MVP, plano.

---

## 9. Matriz CSD no Discovery

A matriz **CSD (Certezas, Suposições, Dúvidas)** organiza o que o time sabe, acredita e ignora. É uma das primeiras ferramentas do discovery porque expõe onde está o risco escondido (geralmente nas suposições tratadas como certezas).

| Tipo | O que significa | Exemplo | O que fazer com isso |
|---|---|---|---|
| **Certeza** | O que sabemos com evidência | "70% dos acessos vêm do mobile (analytics)" | Usar como base de decisão; revisar a confiabilidade da fonte |
| **Suposição** | O que acreditamos, mas não comprovamos | "As pessoas abandonam o checkout por causa do frete" | Priorizar as mais arriscadas, virar hipótese e testar |
| **Dúvida** | O que ainda não sabemos | "Por que as pessoas não concluem o cadastro?" | Transformar em pergunta de pesquisa e investigar |

Regra prática: a suposição mais perigosa é aquela em que o time **mais acredita** e tem **menos evidência**. Comece por ela.

---

## 10. Como transformar dúvidas em hipóteses pesquisáveis

Três coisas diferentes, frequentemente confundidas:

- **Dúvida** — uma pergunta aberta sobre algo que não se sabe.
- **Hipótese** — uma afirmação testável que propõe uma relação ("se… então…"), com base em alguma evidência ou raciocínio.
- **Experimento** — a forma concreta de testar a hipótese e gerar evidência.

**Exemplo 1:**
- *Dúvida:* "Usuários entendem a diferença entre os planos?"
- *Hipótese:* "Se explicarmos os planos por perfil de uso, os usuários escolherão com mais confiança."
- *Experimento:* "Teste de usabilidade comparando a página atual com a nova estrutura por perfil, medindo tempo de decisão e dúvidas."

**Exemplo 2:**
- *Dúvida:* "Por que o checkout é abandonado?"
- *Hipótese:* "Se o custo de frete aparecer antes da última etapa, o abandono no checkout cai."
- *Experimento:* "Teste A/B exibindo o frete já na página do produto vs apenas no fim, medindo a taxa de conclusão."

Boa hipótese é **falsificável**: dá para ela dar errado. Se nenhum resultado a refutaria, não é hipótese — é desejo.

---

## 11. Entregáveis comuns de Discovery

- **Briefing de UX** — síntese do objetivo, escopo, restrições e sucesso do projeto.
- **Matriz CSD** — certezas, suposições e dúvidas mapeadas.
- **Mapa de stakeholders** — quem decide, influencia e é afetado.
- **Mapa de riscos** — quais riscos (valor, usabilidade, etc.) são significativos.
- **Desk research** — síntese do conhecimento existente.
- **Benchmark** — comparação com concorrentes e referências.
- **Roteiro de entrevista** — guia de perguntas abertas.
- **Mapa de achados** — dados brutos organizados em temas.
- **Insights** — conclusões acionáveis que ligam achado a decisão.
- **Jobs To Be Done** — o "trabalho" que a pessoa contrata o produto para fazer.
- **Jornada do usuário** — etapas, ações, emoções e atritos.
- **Definição do problema** — o problema recortado que vale resolver.
- **Opportunity Solution Tree** — outcome, oportunidades, soluções e experimentos.
- **Hipóteses de solução** — apostas a validar.
- **Plano de validação** — como cada hipótese será testada.
- **Recomendação priorizada** — o que fazer, em ordem de impacto/esforço.

---

## 12. Erros comuns em Discovery

- **Tratar discovery como reunião inicial** — discovery é processo até haver evidência, não um kickoff de uma hora.
- **Transformar opinião de stakeholder em verdade** — opinião é hipótese, não evidência.
- **Entrevistar sem objetivo** — conversa sem pergunta de pesquisa gera dado inútil.
- **Confundir desejo do usuário com comportamento real** — o que dizem não prevê o que fazem.
- **Pular direto para a solução** — desenhar antes de definir o problema.
- **Usar o Double Diamond só como desenho bonito** — virar slide decorativo sem mudar o processo.
- **Fazer ideação antes de definir o problema** — gerar soluções para um problema ainda nebuloso.
- **Validar apenas a solução preferida do time** — buscar confirmação em vez de teste honesto.
- **Não conectar discovery com decisão de produto** — pesquisa que não muda nada é custo.
- **Não documentar evidências** — sem registro, o aprendizado some e a decisão fica frágil.

---

## 13. Checklist de Discovery

Use antes de avançar de discovery para ideação/protótipo. Se houver muitos "não", o discovery ainda não está pronto.

- [ ] Sabemos **qual decisão** precisa ser tomada?
- [ ] Sabemos **quais riscos** queremos reduzir (e quais são significativos)?
- [ ] Temos **evidência suficiente** — e não só opinião?
- [ ] Sabemos **quem é o usuário** de verdade?
- [ ] Entendemos o **contexto de uso**?
- [ ] Existem **hipóteses claras** (testáveis)?
- [ ] Há **critérios de sucesso** definidos?
- [ ] As **oportunidades foram priorizadas** (com base no outcome)?
- [ ] O problema está **definido e recortado** (não genérico)?
- [ ] Sabemos **como** vamos validar a solução?

---

## 14. Como aplicar em um projeto real

**Cenário:** um site institucional que será transformado em e-commerce.

Sequência mapeada no Double Diamond:

**Discover (abrir o problema)**
1. **Entender objetivos do negócio** — entrevistar stakeholders: meta, restrições, definição de sucesso (ex.: vender online com X de conversão).
2. **Mapear dados existentes** — analytics do site atual, buscas internas, suporte: onde as pessoas já travam.
3. **Pesquisar usuários** — entrevistas para entender necessidades, dúvidas e contexto de compra.
4. **Entender a jornada de compra** — mapear etapas, do interesse à decisão, e os pontos de atrito.

**Define (fechar o problema)**
5. **Mapear dúvidas e objeções** — o que impede a compra (confiança, frete, comparação de produtos).
6. **Organizar oportunidades** — montar a Opportunity Solution Tree ligada ao outcome de conversão e priorizar.

**Develop (abrir a solução)**
7. **Gerar hipóteses de solução** — ideias para as oportunidades prioritárias (estrutura de catálogo, página de produto, checkout).

**Deliver (fechar a solução)**
8. **Testar arquitetura, conteúdo e fluxo de compra** — card sorting/tree testing para a estrutura, teste de usabilidade no protótipo de compra.
9. **Priorizar o MVP** — definir o escopo mínimo que entrega valor e endereça os maiores riscos.
10. **Medir pós-lançamento** — acompanhar conversão e abandono no checkout; usar A/B e feedback contínuo para iterar.

Em times sem margem para pesquisa formal, o núcleo viável aqui costuma ser **1, 2, 8 e 10** — alinhamento, dados existentes, teste de usabilidade e métricas.

---

## 15. Relação com outros arquivos da base

- **`01_UX_RESEARCH_METHODS.md`** — o catálogo de métodos. Este arquivo decide *quando/por que* pesquisar no discovery; o 01 detalha *como* executar cada técnica e a relação risco → método → evidência.
- **`03_USER_INTERVIEWS_AND_CONTEXT.md`** — aprofunda as entrevistas e a pesquisa contextual usadas nas etapas 3 e 6 do discovery.
- **`04_SYNTHESIS_AND_MAPPING.md`** — detalha a síntese (etapa 7): affinity mapping, jornada, insights e a passagem de dado bruto para definição de problema.
- **`05_INFORMATION_ARCHITECTURE.md`** — apoia a validação de estrutura (card sorting/tree testing) citada na aplicação real.
- **`06_IDEATION_AND_WORKSHOPS.md`** — detalha a fase Develop: Crazy 8, Design Sprint e facilitação para gerar soluções.
- **`07_USABILITY_TESTING.md`** — detalha a validação (Deliver): como planejar e rodar testes de usabilidade.
- **`08_UX_METRICS.md`** — apoia a definição de outcome e a medição pós-lançamento (etapa 10).

---

## 16. Fontes utilizadas

Links que você enviou, resumidos com palavras próprias (nenhum conteúdo copiado). Status de acesso indicado.

1. **The Double Diamond — Design Council** — https://www.designcouncil.org.uk/resources/the-double-diamond/ — *Acessível.* Base das quatro fases (Discover, Define, Develop, Deliver) e da lógica divergente/convergente.
2. **Framework for Innovation — Design Council** — https://www.designcouncil.org.uk/resources/framework-for-innovation/ — *Acessível.* Versão expandida do Double Diamond com princípios, métodos e cultura de trabalho (licença CC BY 4.0).
3. **Product Discovery — SVPG** — https://www.svpg.com/product-discovery/ — *Fonte acessível.* Conteúdo de product discovery da SVPG fundamentado nos próprios artigos (em especial "The Four Big Risks"). Este URL de índice não retornou isoladamente nas buscas, mas o material é da fonte primária e não foi inventado.
4. **Product Discovery Series — SVPG** — https://www.svpg.com/product-discovery-series/ — *Fonte acessível;* URL de índice não confirmado isoladamente. Usado via os artigos de discovery da própria SVPG.
5. **Product Discovery Articles — SVPG** — https://www.svpg.com/insights/product-discovery-articles/ — *Fonte acessível;* URL de índice não confirmado isoladamente. Usado via os artigos de discovery da própria SVPG.
6. **Opportunity Solution Trees — Product Talk** — https://www.producttalk.org/opportunity-solution-trees/ — *Acessível.* Base da OST: outcome → oportunidades → soluções → experimentos.
7. **Product Talk (home)** — https://www.producttalk.org/ — *Acessível.* Continuous discovery, product trio e definição de outcome.
8. **Design Thinking — IDEO** — https://designthinking.ideo.com/ — *Acessível.* Human-centered design e os três espaços: inspiração, ideação, implementação (desejável/viável/factível).
9. **Design Kit — IDEO.org** — https://www.designkit.org/ — *Acessível.* Mindsets, métodos (Inspiration, Ideation, Implementation), ferramentas e estudos de caso de HCD.
10. **Enterprise Design Thinking — IBM** — https://www.ibm.com/training/enterprise-design-thinking — *Acessível.* O Loop (Observe, Reflect, Make), 3 princípios e 3 práticas (Hills, Playbacks, Sponsor Users).
11. **Enterprise Design Thinking Toolkit — IBM** — https://www.ibm.com/training/enterprise-design-thinking/toolkit — *Fonte acessível;* esta subpágina de toolkit não retornou isoladamente nas buscas. O conteúdo de EDT foi fundamentado na página de framework da própria IBM, sem invenção.

---

## 17. Resumo executivo

Este arquivo é o **manual da fase inicial** da base. O Claude Cowork deve usá-lo assim:

1. Diante de um pedido vago, comece pelo **alinhamento de negócio** e pela **matriz CSD** (Seções 8 e 9) para separar fato de suposição.
2. Use o **Double Diamond** (Seção 4) como mapa: primeiro entenda o problema (Discover/Define), só depois desenhe a solução (Develop/Deliver), sempre alternando divergir e convergir.
3. Use a tabela de **riscos de produto** (Seção 6) para focar discovery no que pode fazer a solução falhar.
4. Organize o trabalho com a **Opportunity Solution Tree** (Seção 7): outcome → oportunidades → soluções → experimentos, para nunca pular direto à solução.
5. Transforme dúvidas em **hipóteses testáveis** (Seção 10) e feche com **recomendação priorizada** conectada à decisão.
6. Em contextos sem pesquisa formal, rode o **discovery mínimo viável** (dados existentes, desk, benchmark, análise heurística) — melhor enxuto do que inexistente.

Princípio que guia tudo: **entenda o problema antes de desenhar a solução; reduza o risco certo; decida com evidência.**
