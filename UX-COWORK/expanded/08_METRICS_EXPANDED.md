# 08_UX_METRICS — Métricas de UX

> Arquivo de mensuração. Serve para **definir, escolher, interpretar e acompanhar métricas de UX** em projetos reais.
> O foco não é criar dashboard bonito: é medir experiência de forma útil para decisão, conectando objetivo → sinal → métrica → método → ação.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 31. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "métricas de UX"** na base. Ele orienta como escolher métricas que realmente ajudam a avaliar experiência, usabilidade, adoção, satisfação, eficiência, retenção e impacto.

Responde, na prática:

- O que é uma métrica de UX.
- Como diferenciar métrica de produto, métrica de negócio, métrica de usabilidade e métrica de percepção.
- Como escolher métricas com base em decisão, risco e objetivo.
- Como usar HEART, Goals-Signals-Metrics e frameworks de benchmarking.
- Como medir sucesso de tarefa, tempo, erro, satisfação, facilidade, NPS, SUS e SEQ.
- Quando usar analytics, survey, teste quantitativo ou dados de suporte.
- Como evitar métricas de vaidade.
- Como interpretar números sem fingir certeza onde só existe sinal.
- Como conectar métrica a recomendação e melhoria contínua.

Regra central: **métrica boa muda decisão. Métrica que não muda nada é decoração com número.**

---

## 2. O que são métricas de UX

Métricas de UX são indicadores quantitativos ou semi-quantitativos usados para avaliar algum aspecto da experiência de uma pessoa com um produto, serviço, fluxo ou tarefa.

Elas podem medir:

- se a pessoa conseguiu concluir uma tarefa;
- quanto tempo levou;
- quantos erros cometeu;
- quão fácil achou;
- se voltou a usar;
- se adotou uma funcionalidade;
- se abandonou um fluxo;
- se recomendaria;
- se ficou satisfeita;
- se encontrou o que precisava;
- se a experiência foi rápida, estável e responsiva;
- se o produto reduziu esforço operacional;
- se uma mudança melhorou ou piorou a experiência.

UX metrics não substituem pesquisa qualitativa. Elas respondem **quanto**, **com que frequência**, **com qual intensidade** ou **como evoluiu ao longo do tempo**. Para entender o **porquê**, quase sempre será necessário combinar com teste de usabilidade, entrevistas, análise de sessão, suporte ou pesquisa contextual.

---

## 3. Métrica, dado, KPI e insight

Esses termos costumam ser usados como se fossem iguais. Não são.

| Conceito | O que é | Exemplo | Erro comum |
|---|---|---|---|
| Dado | Registro bruto | 342 pessoas abandonaram o checkout | Olhar isoladamente sem contexto |
| Métrica | Indicador calculado ou acompanhado | Taxa de abandono do checkout: 62% | Medir sem saber que decisão apoia |
| KPI | Métrica-chave ligada a objetivo estratégico | Aumentar conclusão de checkout para 45% | Chamar qualquer número de KPI |
| Sinal | Comportamento ou evidência que indica progresso | Mais pessoas chegam ao pagamento sem erro | Confundir sinal com causa |
| Insight | Interpretação acionável do dado | Abandono aumenta quando frete aparece tarde | Chamar número puro de insight |

Número não é insight. Número é pista. Insight é a interpretação rastreável que explica o que aquele número sugere e qual decisão ele pode apoiar.

---

## 4. Por que medir UX

Medir UX serve para reduzir subjetividade e acompanhar se a experiência está melhorando ou piorando.

Boas métricas ajudam a:

- priorizar melhorias;
- comparar antes e depois;
- acompanhar saúde de produto;
- defender decisões de UX com evidência;
- identificar gargalos;
- medir impacto de redesign;
- medir adoção de novas funcionalidades;
- acompanhar eficiência operacional;
- detectar regressões;
- conectar UX a negócio;
- evitar decisões por gosto pessoal.

Sem métrica, o time fica preso a frases como:

- “Acho que melhorou.”
- “A tela ficou mais moderna.”
- “O usuário deve entender.”
- “Isso vai converter mais.”
- “O stakeholder gostou.”

Com métrica, a conversa muda para:

- “A taxa de sucesso subiu de 52% para 76%.”
- “O tempo mediano da tarefa caiu 38%.”
- “A busca sem resultado caiu 21%.”
- “O abandono no passo de frete continua alto.”
- “A satisfação pós-tarefa melhorou, mas os erros não caíram.”

Métrica boa não mata o julgamento de UX. Ela força o julgamento a prestar contas.

---

## 5. Quando usar métricas de UX

| Situação | Por que medir | Métricas possíveis | Método/Fonte |
|---|---|---|---|
| Redesign | Ver se a nova versão melhorou | Sucesso de tarefa, tempo, satisfação, conversão | Teste benchmark + analytics |
| Checkout | Reduzir abandono | Abandono por etapa, erro, conclusão, tempo | Analytics + teste |
| Formulário | Reduzir erro e fricção | Taxa de erro, conclusão, tempo, suporte | Analytics + teste |
| Busca | Melhorar encontrabilidade | Busca sem resultado, refinamento, sucesso | Analytics de busca + teste |
| IA/navegação | Validar estrutura | Sucesso, primeiro clique, caminho, tempo | Tree testing |
| Produto novo | Acompanhar adoção | Ativação, adoção, retenção, uso recorrente | Analytics |
| SaaS | Melhorar produtividade | Tempo de tarefa, erros, uso de feature | Analytics + teste |
| Sistema interno | Reduzir esforço operacional | Tempo, retrabalho, tickets, erros | Dados internos + teste |
| E-commerce | Melhorar decisão de compra | Add-to-cart, PDP engagement, checkout, conversão | Analytics + Baymard-style audit |
| Pós-lançamento | Detectar regressões | Funil, satisfação, suporte, performance | Monitoramento contínuo |

Métrica entra quando existe uma pergunta de decisão:

```txt
O que precisamos saber?
↓
Qual comportamento indicaria melhora?
↓
Como podemos medir esse comportamento?
↓
Que ação tomaremos com o resultado?
```

---

## 6. Quando não usar métrica como resposta principal

Métrica não é o método ideal quando:

- você ainda não entende o problema;
- o público ainda é desconhecido;
- a amostra é pequena demais para inferência;
- a instrumentação é ruim;
- não existe baseline;
- o produto ainda não tem tráfego suficiente;
- o comportamento depende muito de contexto qualitativo;
- a pergunta é “por que isso acontece?”;
- o time quer número apenas para justificar uma decisão já tomada;
- o objetivo é aprender profundamente, não medir escala.

Números ruins são perigosos porque parecem científicos. Uma métrica coletada de forma fraca pode ser mais convincente que uma opinião — e igualmente errada.

---

## 7. Tipos de métricas de UX

### 7.1 Métricas comportamentais

Medem o que pessoas fazem.

Exemplos:

- taxa de sucesso;
- conclusão de tarefa;
- abandono;
- cliques;
- navegação;
- uso de funcionalidade;
- retenção;
- erros;
- tempo;
- caminho percorrido.

São fortes porque capturam comportamento, mas nem sempre explicam causa.

### 7.2 Métricas atitudinais/percebidas

Medem o que pessoas dizem sentir ou perceber.

Exemplos:

- satisfação;
- facilidade percebida;
- confiança;
- NPS;
- SUS;
- SEQ;
- percepção de esforço;
- intenção declarada.

São úteis para entender percepção, mas precisam ser interpretadas com cuidado. Pessoas podem dizer que foi fácil mesmo com comportamento confuso, ou reclamar de algo que não afetou a tarefa.

### 7.3 Métricas de performance de tarefa

Medem eficácia e eficiência.

Exemplos:

- sucesso;
- tempo na tarefa;
- número de erros;
- ajuda necessária;
- passos até conclusão;
- retrabalho;
- first-click success.

### 7.4 Métricas de produto

Medem uso e evolução do produto.

Exemplos:

- adoção;
- ativação;
- retenção;
- engajamento;
- churn;
- frequência de uso;
- uso de feature;
- conversão.

### 7.5 Métricas de negócio influenciadas por UX

Medem resultado comercial/operacional que pode ser impactado pela experiência.

Exemplos:

- conversão;
- receita;
- ticket médio;
- custo de suporte;
- redução de retrabalho;
- tempo operacional;
- leads qualificados;
- finalização de pedido;
- redução de cancelamento.

### 7.6 Métricas técnicas com impacto em UX

Medem aspectos técnicos sentidos pelo usuário.

Exemplos:

- Core Web Vitals;
- tempo de carregamento;
- responsividade;
- estabilidade visual;
- erro de sistema;
- uptime;
- falha de integração.

Performance técnica não é UX inteira, mas afeta fortemente experiência.

---

## 8. Framework HEART

HEART é um framework criado no Google para organizar métricas centradas no usuário em produtos digitais. Ele ajuda a escolher o que medir sem cair na armadilha de medir tudo.

HEART significa:

- **Happiness** — satisfação, percepção, facilidade, recomendação.
- **Engagement** — nível de envolvimento ou uso.
- **Adoption** — novos usuários ou adoção de uma funcionalidade.
- **Retention** — retorno ao longo do tempo.
- **Task Success** — sucesso em tarefas importantes.

HEART não exige medir todas as dimensões. O valor está em escolher as dimensões relevantes para o objetivo do produto.

| Dimensão | O que mede | Exemplos de métrica | Quando usar |
|---|---|---|---|
| Happiness | Percepção e satisfação | CSAT, NPS, SUS, SEQ, facilidade percebida | Quando experiência subjetiva importa |
| Engagement | Intensidade/frequência de uso | Sessões, ações por usuário, uso recorrente | Produtos com uso contínuo |
| Adoption | Adoção inicial | Novos usuários, uso de nova feature, ativação | Lançamentos e features novas |
| Retention | Retorno no tempo | Retenção semanal/mensal, churn | Produtos recorrentes |
| Task Success | Conclusão de tarefas | Sucesso, erro, tempo, conclusão | Fluxos críticos e usabilidade |

### Exemplo: e-commerce

| Dimensão HEART | Aplicação |
|---|---|
| Happiness | Satisfação pós-compra, confiança na escolha |
| Engagement | Visualizações de PDP, uso de filtros, comparação |
| Adoption | Uso de nova busca ou guia de compra |
| Retention | Recompra, retorno ao catálogo |
| Task Success | Encontrar produto, adicionar ao carrinho, concluir checkout |

HEART é útil porque força o time a perguntar: “que aspecto da experiência queremos melhorar?” antes de escolher métrica.

---

## 9. Goals, Signals, Metrics

O complemento mais importante do HEART é a lógica **Goals → Signals → Metrics**.

### Goal

Objetivo qualitativo ou estratégico da experiência.

Exemplo: “Ajudar compradores iniciantes a escolher um produto com confiança.”

### Signal

Comportamento ou percepção que indicaria que o objetivo está acontecendo.

Exemplo: usuários comparam menos páginas aleatoriamente, escolhem um produto adequado e relatam confiança na decisão.

### Metric

Forma mensurável do sinal.

Exemplo: taxa de sucesso na tarefa de escolha, tempo até decisão, confiança pós-tarefa, add-to-cart em PDPs com recomendação.

| Goal | Signal | Metric |
|---|---|---|
| Tornar escolha de produto mais clara | Usuário encontra produto adequado sem ajuda | Taxa de sucesso na tarefa |
| Reduzir fricção no checkout | Menos usuários abandonam no passo de pagamento | Abandono por etapa |
| Aumentar confiança na marca | Usuários encontram garantia e prova social | Sucesso em tarefa + confiança pós-tarefa |
| Melhorar busca | Menos buscas sem resultado | Taxa de zero results |
| Acelerar tarefa operacional | Usuários concluem com menos passos | Tempo mediano + erros |

Essa estrutura evita o clássico erro: começar pela métrica porque a ferramenta mostra, não porque ela responde uma pergunta importante.

---

## 10. Métricas de usabilidade

Métricas clássicas de usabilidade medem eficácia, eficiência e satisfação.

### 10.1 Taxa de sucesso

Mede se a pessoa conseguiu completar a tarefa.

Exemplo:

```txt
8 participantes concluíram / 10 participantes = 80% de sucesso
```

Pode ser categorizada como:

- sucesso;
- sucesso parcial;
- falha.

É simples, direta e fácil de comunicar.

### 10.2 Tempo na tarefa

Mede quanto tempo a pessoa levou para concluir uma tarefa.

Útil para:

- comparar versões;
- medir eficiência;
- identificar esforço;
- acompanhar produtividade em sistemas internos.

Cuidado: tempo menor nem sempre significa experiência melhor. Em tarefas de decisão, o usuário pode demorar mais porque está comparando melhor.

### 10.3 Taxa de erro

Mede erros cometidos durante uma tarefa.

Exemplos:

- campo preenchido errado;
- clique em caminho incorreto;
- tentativa inválida;
- erro de validação;
- ação reversa;
- escolha de opção errada.

É importante definir o que conta como erro antes do teste.

### 10.4 Eficiência

Combina sucesso e esforço. Uma pessoa pode concluir a tarefa, mas com muitos passos, voltas e hesitações.

Exemplos:

- tempo por tarefa;
- número de cliques;
- número de telas;
- número de tentativas;
- ajuda necessária.

### 10.5 Satisfação pós-tarefa

Mede percepção após uma tarefa específica. Pode ser capturada por SEQ ou pergunta simples de facilidade.

Útil para cruzar com comportamento:

- concluiu rápido e achou fácil;
- concluiu rápido, mas achou inseguro;
- concluiu devagar e achou fácil;
- falhou e mesmo assim disse que era fácil.

A combinação revela mais que a métrica isolada.

---

## 11. Métricas percebidas: SUS, SEQ, NPS, CSAT e esforço

### 11.1 SUS — System Usability Scale

SUS é uma escala padronizada de percepção de usabilidade. É usada após interação com um produto ou protótipo e gera uma pontuação geral.

Use SUS quando:

- quiser medir percepção geral de usabilidade;
- quiser comparar versões;
- quiser benchmark em estudos repetidos;
- tiver uma experiência minimamente completa para avaliar.

Não use SUS para:

- avaliar uma única microtarefa;
- substituir observação;
- explicar por que algo falhou;
- medir conversão;
- tomar decisão com amostra pequena sem cuidado.

### 11.2 SEQ — Single Ease Question

SEQ mede facilidade percebida de uma tarefa específica, geralmente logo após a tarefa. É útil para complementar sucesso e tempo.

Use SEQ quando:

- quiser saber quão fácil a tarefa pareceu;
- precisar comparar tarefas;
- quiser identificar tarefas concluídas com sensação ruim.

### 11.3 NPS — Net Promoter Score

NPS mede disposição declarada de recomendação. Pode ter utilidade para relação com marca/produto, mas não é uma métrica pura de usabilidade.

Use com cuidado:

- precisa de amostra suficiente;
- mede percepção geral;
- não explica causa;
- pode ser influenciado por preço, marca, suporte, expectativa, contexto e fatores fora da interface.

NPS não deve substituir task success, tempo, erro ou teste de usabilidade. Dizer “NPS subiu” não prova que o fluxo ficou mais usável.

### 11.4 CSAT — Customer Satisfaction

CSAT mede satisfação declarada, geralmente após interação, compra, atendimento ou uso de serviço.

Útil para:

- atendimento;
- pós-compra;
- suporte;
- experiência pontual;
- monitoramento contínuo.

Limite: satisfação declarada não revela necessariamente o problema. Use junto com comentários e comportamento.

### 11.5 CES — Customer Effort Score

CES mede esforço percebido para concluir uma ação. É útil em suporte, checkout, formulários, onboarding e sistemas internos.

Boa pergunta associada:

```txt
Quão fácil foi concluir esta tarefa?
```

Esforço percebido deve ser cruzado com comportamento: tempo, erro e abandono.

---

## 12. Métricas de produto ligadas à experiência

UX não vive isolado. Em produtos digitais, muitas métricas de produto são afetadas pela experiência.

| Métrica | O que indica | Relação com UX | Cuidado |
|---|---|---|---|
| Ativação | Usuário chegou ao primeiro valor | Onboarding e clareza | Definir “valor” corretamente |
| Adoção de feature | Usuários começaram a usar algo | Descoberta, utilidade, comunicação | Uso não prova valor |
| Retenção | Usuários voltam | Valor contínuo e hábito | Pode ser impactada por fatores externos |
| Engajamento | Frequência/intensidade de uso | Utilidade e relevância | Mais uso nem sempre é melhor |
| Churn | Usuários deixam de usar | Valor, fricção, custo, concorrência | Causa precisa de pesquisa |
| Conversão | Usuários completam ação desejada | Clareza, confiança, fricção | Pode subir com tráfego ruim ou incentivo |
| Abandono | Usuários param no meio | Fricção, dúvida, erro, custo | Precisa análise por etapa |
| Recompra | Usuários compram novamente | Confiança e satisfação | Depende de ciclo de compra |
| Uso de busca | Tentativa de encontrar algo | IA pode estar fraca ou busca ser tarefa natural | Interpretar com contexto |
| Tickets de suporte | Dúvida ou falha de experiência | Conteúdo, IA, fluxo | Nem todo ticket é problema de UX |

Métrica de produto precisa de interpretação. “Engajamento alto” pode significar valor — ou dificuldade, se a pessoa precisa clicar muito para fazer algo simples.

---

## 13. Métricas de funil

Funil mede avanço por etapas. É especialmente útil em e-commerce, onboarding, cadastro, checkout, contratação e formulários.

### Exemplo de funil de compra

```txt
Visita categoria
↓
Visualiza produto
↓
Adiciona ao carrinho
↓
Inicia checkout
↓
Preenche entrega
↓
Escolhe pagamento
↓
Conclui compra
```

Métricas:

- taxa de avanço por etapa;
- taxa de abandono por etapa;
- tempo entre etapas;
- erro por etapa;
- volta para etapa anterior;
- uso de cupom;
- simulação de frete;
- falha de pagamento;
- conclusão.

| Etapa | Sinal de problema | Possível causa UX | Próxima investigação |
|---|---|---|---|
| PDP → Carrinho baixo | Usuários veem produto, mas não avançam | Informação insuficiente, preço, falta de confiança | Teste de PDP |
| Carrinho → Checkout baixo | Usuários hesitam antes de dados pessoais | Frete/custo total, confiança | Analytics + teste |
| Entrega → Pagamento baixo | Abandono após frete | Prazo/custo inesperado | Análise de frete |
| Pagamento → Compra baixo | Falhas ou medo | Erro, confiança, métodos limitados | Logs + teste |

Funil mostra onde investigar. Não mostra sozinho por que a pessoa saiu.

---

## 14. Analytics como fonte de UX

Analytics mostra comportamento em escala. Ele ajuda a identificar gargalos e priorizar investigação.

Pode responder:

- onde usuários abandonam;
- quais páginas recebem tráfego;
- quais caminhos são comuns;
- quais buscas não têm resultado;
- quais dispositivos performam pior;
- quais CTAs recebem clique;
- quais etapas do funil caem;
- quanto tempo usuários passam em páginas;
- quais features são usadas ou ignoradas.

Não responde sozinho:

- por que o usuário abandonou;
- se ele entendeu;
- se ficou confiante;
- se a informação era clara;
- se o fluxo parecia seguro;
- se o usuário usou do jeito esperado.

### Fontes úteis

- GA4;
- logs internos;
- eventos de produto;
- busca interna;
- heatmaps com cuidado;
- gravações de sessão com cuidado;
- CRM;
- suporte;
- vendas;
- dados de erro;
- BI.

Heatmap não é leitura da mente. Ele mostra clique e atenção provável, não intenção.

---

## 15. UX Benchmarking

UX benchmarking é medir a experiência de forma repetível contra uma referência: versão anterior, concorrente, meta interna ou padrão histórico.

Serve para responder:

- a experiência melhorou após o redesign?
- este fluxo é melhor que o anterior?
- como estamos em relação a concorrentes?
- quais tarefas estão piorando ao longo do tempo?
- qual é o baseline antes de investir?

### Etapas de um benchmark

1. Definir escopo.
2. Escolher tarefas críticas.
3. Definir métricas.
4. Definir participantes.
5. Rodar estudo com protocolo consistente.
6. Registrar baseline.
7. Repetir após mudanças.
8. Comparar resultados.
9. Interpretar com contexto.
10. Decidir próximos passos.

### Métricas comuns em benchmark

- taxa de sucesso;
- tempo na tarefa;
- SEQ;
- SUS;
- erros;
- abandono;
- satisfação;
- conversão;
- retenção;
- métricas de analytics.

Benchmark exige consistência. Se mudar tarefa, público, método e ferramenta a cada rodada, a comparação perde força.

---

## 16. Core Web Vitals e performance percebida

Core Web Vitals são métricas do Google para avaliar aspectos de experiência real em páginas web ligados a carregamento, responsividade e estabilidade visual.

As métricas principais atuais são:

- **LCP — Largest Contentful Paint:** mede desempenho de carregamento do conteúdo principal.
- **INP — Interaction to Next Paint:** mede responsividade às interações.
- **CLS — Cumulative Layout Shift:** mede estabilidade visual.

Elas importam porque performance afeta experiência diretamente. Página lenta, botão que demora a responder e layout que pula durante leitura geram fricção, erro e abandono.

| Métrica | Mede | Impacto em UX | Exemplo de problema |
|---|---|---|---|
| LCP | Carregamento do conteúdo principal | Espera e percepção de lentidão | Hero/produto demora a aparecer |
| INP | Resposta a interações | Sensação de travamento | Clique em filtro demora a responder |
| CLS | Mudança inesperada de layout | Erros e frustração | Botão muda de lugar e usuário clica errado |

Core Web Vitals não medem UX inteira. Um site pode ser rápido e ainda confuso. Mas se for lento e instável, a experiência já começa perdendo.

---

## 17. Métricas de busca e encontrabilidade

Busca e encontrabilidade conectam UX Metrics com Arquitetura da Informação.

Métricas úteis:

- volume de buscas;
- termos mais buscados;
- buscas sem resultado;
- refinamentos após busca;
- cliques em resultados;
- abandono após busca;
- conversão após busca;
- tempo até encontrar;
- primeiro clique;
- sucesso no tree testing;
- uso de filtros;
- remoção de filtros;
- zero results por termo.

| Métrica | O que pode indicar | Ação possível |
|---|---|---|
| Muitas buscas por termo específico | Conteúdo/produto importante | Destacar em navegação |
| Alta busca sem resultado | Termos do usuário não mapeados | Sinônimos e taxonomia |
| Muitos refinamentos | Resultados amplos ou filtros fracos | Melhorar ranking/facetas |
| Abandono após busca | Resultado ruim ou sem confiança | Melhorar resultados |
| Filtro pouco usado | Filtro irrelevante ou invisível | Rever faceta |
| Filtro usado e removido | Critério confuso ou resultados ruins | Ajustar label/opções |

Busca é conversa do usuário com a IA do produto. Quando a busca falha, a taxonomia está gritando por socorro.

---

## 18. Métricas de conteúdo

Conteúdo também deve ser medido, especialmente em páginas institucionais, centrais de ajuda, blogs, onboarding, páginas de produto e políticas.

Métricas possíveis:

- sucesso em encontrar informação;
- compreensão;
- cliques em links de apoio;
- scroll até seção crítica;
- busca interna por dúvida;
- tickets relacionados;
- tempo até encontrar resposta;
- redução de contato com suporte;
- taxa de leitura não basta, mas pode apoiar;
- feedback de utilidade;
- conversão após consumo de conteúdo;
- abandono em páginas de ajuda.

| Conteúdo | Objetivo | Métrica útil | Cuidado |
|---|---|---|---|
| FAQ | Reduzir dúvidas | Menos tickets / sucesso em tarefa | Ticket pode cair por outros fatores |
| PDP | Ajudar decisão | Add-to-cart, confiança, dúvidas | Conversão depende de preço e tráfego |
| Página institucional | Gerar confiança | Cliques em contato, tempo qualificado, pesquisa | Tempo alto pode ser confusão |
| Guia de compra | Orientar escolha | Uso do guia, produto escolhido, sucesso | Medir qualidade da decisão |

Métrica de conteúdo deve estar ligada à tarefa: encontrar, entender, decidir ou agir.

---

## 19. Métricas em e-commerce

Em e-commerce, UX impacta descoberta, comparação, confiança, carrinho, checkout e pós-compra.

Métricas úteis:

### Descoberta

- uso de busca;
- navegação por categoria;
- cliques em filtros;
- buscas sem resultado;
- CTR em cards de produto.

### Página de produto

- visualização de PDP;
- add-to-cart;
- interação com imagens/vídeos;
- simulação de frete;
- leitura de avaliações;
- cliques em garantia/troca;
- uso de comparação;
- abandono da PDP.

### Carrinho

- início de checkout;
- alteração de quantidade;
- remoção de item;
- cálculo de frete;
- uso de cupom;
- abandono do carrinho.

### Checkout

- conclusão por etapa;
- erro por campo;
- falha de pagamento;
- tempo por etapa;
- abandono por etapa;
- taxa de compra.

### Pós-compra

- contato com suporte;
- acompanhamento de pedido;
- troca/devolução;
- recompra;
- avaliação.

| Etapa | Métrica | Interpretação possível | Pesquisa complementar |
|---|---|---|---|
| Categoria | Uso baixo de filtro | Filtro invisível ou irrelevante | Teste de navegação |
| PDP | Add-to-cart baixo | Dúvida, preço, confiança ou informação insuficiente | Teste de PDP |
| Carrinho | Remoção alta | Custo total, frete ou cupom | Analytics + entrevista |
| Checkout | Erro alto em campo | Label, máscara ou validação ruim | Teste de formulário |
| Pós-compra | Ticket alto sobre prazo | Informação de entrega fraca | Auditoria de conteúdo |

Cuidado: conversão é métrica de negócio afetada por UX, mas não é métrica pura de UX. Preço, tráfego, oferta, estoque, reputação e sazonalidade pesam.

---

## 20. Métricas em SaaS e produtos internos

### SaaS

Métricas úteis:

- ativação;
- tempo até primeiro valor;
- adoção de feature;
- frequência de uso;
- retenção;
- churn;
- conclusão de onboarding;
- uso de templates;
- criação de projeto;
- colaboração;
- suporte por conta;
- NPS/CSAT com cuidado;
- sucesso em tarefas críticas.

| Objetivo | Métrica | Interpretação |
|---|---|---|
| Melhorar onboarding | Conclusão, tempo até primeiro valor | Se usuário chega ao valor inicial |
| Aumentar adoção | Uso de nova feature | Se a feature é descoberta e usada |
| Reduzir churn | Retenção/cohort | Se valor continua percebido |
| Melhorar produtividade | Tempo de tarefa e erros | Se fluxo ficou mais eficiente |

### Produtos internos

Métricas úteis:

- tempo por tarefa;
- erros operacionais;
- retrabalho;
- tickets internos;
- uso de planilha paralela;
- alternância entre sistemas;
- número de passos;
- SLA;
- volume processado;
- satisfação do operador;
- taxa de exceção.

Produto interno bom não mede só “uso”. Às vezes a pessoa usa porque é obrigada. Métrica precisa olhar eficiência, erro e esforço.

---

## 21. Métricas de acessibilidade

Acessibilidade também pode e deve ser acompanhada.

Métricas possíveis:

- critérios WCAG atendidos;
- problemas por severidade;
- sucesso de tarefas com tecnologias assistivas;
- navegação por teclado;
- foco visível;
- erros de contraste;
- labels ausentes;
- campos sem instrução;
- tempo de tarefa com leitor de tela;
- barreiras reportadas por usuários;
- taxa de conclusão por perfil de necessidade.

| Métrica | O que mede | Cuidado |
|---|---|---|
| Problemas WCAG por severidade | Conformidade técnica | Não substitui teste com usuários |
| Sucesso com teclado | Operabilidade | Testar fluxos completos |
| Sucesso com leitor de tela | Compatibilidade real | Recrutar usuários reais quando possível |
| Erros de foco | Navegação | Pode bloquear tarefas |
| Contraste | Percepção visual | Checklist automático ajuda, mas não basta |

Acessibilidade não deve ser só auditoria no fim. Deve entrar em métrica de qualidade contínua.

---

## 22. Métricas e amostra

Nem todo número permite a mesma confiança. Métricas coletadas com poucos participantes em estudo qualitativo são úteis como sinal, mas não como prova estatística.

### Em estudos qualitativos

Pode registrar:

- sucesso/falha;
- facilidade percebida;
- tempo aproximado;
- número de erros.

Mas a interpretação deve ser cuidadosa:

```txt
“3 de 5 participantes falharam nesta tarefa”
```

é aceitável como sinal qualitativo forte, mas não deve virar:

```txt
“60% dos usuários falham”
```

Isso seria extrapolação indevida.

### Em estudos quantitativos

Para comparar versões, medir taxa com precisão ou estimar população, o desenho precisa ser mais rigoroso:

- amostra maior;
- tarefas padronizadas;
- critérios claros;
- controle de variáveis;
- análise estatística;
- intervalo de confiança quando aplicável.

Amostra pequena não é vergonha. Fingir que ela é grande é.

---

## 23. Como escolher métricas certas

Processo recomendado:

1. Definir decisão.
2. Definir objetivo.
3. Identificar risco.
4. Escolher dimensão de experiência.
5. Definir sinal.
6. Definir métrica.
7. Definir fonte de dados.
8. Definir baseline.
9. Definir meta ou direção.
10. Definir ação prevista.

| Pergunta | Exemplo |
|---|---|
| Qual decisão será tomada? | Lançar ou revisar novo checkout |
| Qual objetivo? | Reduzir abandono no pagamento |
| Qual risco? | Usuário não entende erro de pagamento |
| Qual dimensão? | Task Success + Effort |
| Qual sinal? | Mais pessoas concluem sem ajuda |
| Qual métrica? | Conclusão por etapa + erro por campo |
| Qual fonte? | Analytics + teste de usabilidade |
| Qual baseline? | Abandono atual 48% |
| Qual meta/direção? | Reduzir abandono |
| Qual ação? | Ajustar validação, texto e métodos de pagamento |

Boa métrica nasce da decisão. Dashboard pronto de ferramenta raramente faz esse trabalho por você.

---

## 24. Métricas de vaidade

Métrica de vaidade parece boa, mas não apoia decisão real ou pode ser facilmente mal interpretada.

Exemplos comuns:

- pageviews sem contexto;
- tempo na página sem tarefa;
- quantidade de cliques sem objetivo;
- número de usuários cadastrados sem ativação;
- downloads sem uso;
- NPS como prova de usabilidade;
- heatmap como explicação de intenção;
- likes em protótipo;
- “engajamento” sem definição;
- bounce rate isolado;
- conversão sem segmentar tráfego;
- média sem distribuição.

| Métrica de vaidade | Problema | Métrica melhor |
|---|---|---|
| Tempo na página alto | Pode significar interesse ou confusão | Sucesso em encontrar informação |
| Pageviews | Volume sem qualidade | Tarefa concluída ou conversão qualificada |
| Cliques totais | Mais cliques podem ser fricção | Caminho eficiente até objetivo |
| NPS | Percepção geral | Sucesso, esforço e satisfação por tarefa |
| Downloads | Não prova uso | Ativação ou ação concluída |
| Heatmap | Não explica intenção | Teste de usabilidade |

Pergunta matadora: **se essa métrica subir ou cair, o que vamos fazer diferente?** Se a resposta for “não sei”, provavelmente é vaidade.

---

## 25. Baseline, meta e comparação

Métrica sem referência é difícil de interpretar.

### Baseline

Valor atual ou inicial usado como referência.

Exemplo:

```txt
Taxa atual de conclusão do checkout: 38%
```

### Meta

Valor desejado ou direção de melhora.

Exemplo:

```txt
Aumentar conclusão para 45% em 60 dias.
```

### Comparação

Pode ser contra:

- versão anterior;
- concorrente;
- benchmark interno;
- meta;
- segmento;
- dispositivo;
- canal;
- período;
- coorte.

| Tipo de comparação | Quando usar | Cuidado |
|---|---|---|
| Antes vs depois | Redesign/melhoria | Controlar sazonalidade |
| Segmentos | Perfis diferentes | Não misturar públicos |
| Dispositivos | Mobile vs desktop | Contexto de uso muda |
| Canais | Tráfego pago vs orgânico | Intenção do usuário muda |
| Concorrentes | Benchmark externo | Acesso limitado a dados reais |
| Coortes | Retenção e adoção | Definir coorte corretamente |

Não compare laranja com parafuso. Comparação ruim é fábrica de decisão torta.

---

## 26. Dashboards de UX

Dashboard de UX deve ser pequeno, claro e acionável. Ele deve ajudar o time a monitorar saúde da experiência e identificar onde investigar.

Um bom dashboard contém:

- poucas métricas;
- relação com objetivos;
- baseline;
- tendência;
- segmentação relevante;
- alerta de regressão;
- contexto qualitativo;
- dono da métrica;
- próxima ação.

### Estrutura recomendada

| Bloco | Métricas | Uso |
|---|---|---|
| Saúde geral | SUS, CSAT, NPS com cuidado, suporte | Visão ampla |
| Tarefas críticas | Sucesso, tempo, erro, esforço | Usabilidade |
| Funis | Conversão, abandono por etapa | Produto/negócio |
| Encontrabilidade | Busca sem resultado, tree success | IA/conteúdo |
| Performance | LCP, INP, CLS, erro técnico | Experiência técnica |
| Acessibilidade | Problemas por severidade | Inclusão |
| Qualitativo | Principais reclamações/achados | Explicar números |

Dashboard bom não responde tudo. Ele aponta onde olhar.

---

## 27. Como interpretar métricas com cuidado

Regras práticas:

- Métrica não explica causa sozinha.
- Correlação não é causalidade.
- Média esconde extremos.
- Segmentação importa.
- Contexto de tráfego importa.
- Mudança de canal muda comportamento.
- Sazonalidade existe.
- Amostra pequena não prova população.
- Métrica percebida pode divergir de comportamento.
- Métrica precisa ser comparada contra baseline.
- Uma métrica pode melhorar e outra piorar.
- Nem tudo que é bom para negócio é bom para usuário.
- Nem tudo que aumenta uso melhora experiência.

Exemplo:

```txt
Tempo na página de produto aumentou 40%.
```

Possíveis interpretações:

- usuário está mais engajado;
- conteúdo ficou mais rico;
- informação ficou confusa;
- página está lenta;
- tráfego mudou;
- produto é mais complexo;
- usuários estão comparando mais.

A métrica é o começo da pergunta, não o fim da resposta.

---

## 28. Como transformar métrica em decisão

Cadeia recomendada:

```txt
Objetivo
↓
Métrica
↓
Resultado
↓
Interpretação
↓
Hipótese
↓
Ação
↓
Novo acompanhamento
```

| Objetivo | Métrica | Resultado | Interpretação | Hipótese | Ação |
|---|---|---|---|---|---|
| Melhorar checkout | Abandono por etapa | Alta queda no frete | Custo aparece tarde | Frete surpreende usuário | Mostrar frete antes |
| Melhorar busca | Zero results | Alto para termos populares | Vocabulário do usuário não mapeado | Falta sinônimo/taxonomia | Adicionar sinônimos |
| Melhorar PDP | Add-to-cart | Baixo em produtos técnicos | Dúvida de escolha | Informação não traduz uso | Criar bloco “ideal para” |
| Reduzir suporte | Tickets de garantia | Alto volume | Informação não encontrada | Garantia está escondida | Expor em PDP e FAQ |
| Melhorar onboarding | Ativação | Baixa após cadastro | Usuário não chega ao valor | Primeiro passo é confuso | Recriar onboarding |

Métrica deve terminar em ação, investigação ou decisão. Se termina em “interessante”, ainda não virou trabalho.

---

## 29. Erros comuns em métricas de UX

- Medir tudo.
- Escolher métrica porque a ferramenta mostra.
- Usar métrica sem objetivo.
- Confundir NPS com usabilidade.
- Usar conversão como única métrica de UX.
- Ignorar segmentação.
- Comparar períodos incomparáveis.
- Não definir baseline.
- Não definir critério de sucesso.
- Usar média sem olhar distribuição.
- Tratar número de estudo qualitativo como estatística.
- Ignorar usuários que falharam.
- Medir satisfação sem comportamento.
- Medir comportamento sem contexto qualitativo.
- Criar dashboard grande demais.
- Não ter dono da métrica.
- Não transformar dado em ação.
- Otimizar métrica e piorar experiência.
- Usar métricas para provar decisão já tomada.
- Esconder resultados ruins.

Métrica ruim é o achismo com terno e crachá.

---

## 30. Como aplicar em um projeto real

Exemplo: **site institucional que será transformado em e-commerce**.

### Objetivo

Transformar o site em uma experiência que permita descobrir, confiar, escolher e comprar produtos.

### Métricas por etapa

| Etapa | Pergunta | Métricas |
|---|---|---|
| Home | Usuário entende proposta e caminho? | Cliques em categorias, busca, scroll, teste de compreensão |
| Categoria | Usuário encontra produtos? | Uso de filtros, CTR em cards, busca interna, tree success |
| Busca | Usuário acha o que procura? | Zero results, refinamento, clique em resultado, conversão pós-busca |
| PDP | Usuário entende e decide? | Add-to-cart, simulação de frete, interação com imagens/vídeo, confiança pós-tarefa |
| Carrinho | Usuário revisa sem fricção? | Remoção de item, cálculo de frete, início de checkout |
| Checkout | Usuário conclui compra? | Abandono por etapa, erro por campo, falha de pagamento, conversão |
| Institucional | História gera confiança? | Sucesso em tarefa de confiança, cliques em garantia/sobre, pesquisa qualitativa |
| Pós-compra | Usuário acompanha e resolve dúvidas? | Tickets, rastreio, CSAT, troca/devolução |

### Plano de mensuração inicial

1. Definir eventos principais.
2. Criar funil de compra.
3. Instrumentar busca e filtros.
4. Medir interações na PDP.
5. Capturar erros de formulário.
6. Medir abandono por etapa.
7. Rodar teste de usabilidade antes do lançamento.
8. Definir baseline no lançamento.
9. Revisar métricas após 2 a 4 semanas.
10. Priorizar melhorias por impacto.

### Eventos sugeridos

```txt
view_home
view_category
use_search
search_no_results
apply_filter
view_product
select_variant
calculate_shipping
view_warranty
add_to_cart
begin_checkout
shipping_step_error
payment_step_error
purchase
contact_support
view_order_tracking
```

### Exemplo completo

| Objetivo | Sinal | Métrica | Fonte | Ação |
|---|---|---|---|---|
| Ajudar iniciante a escolher | Escolhe produto adequado sem ajuda | Sucesso em teste + add-to-cart | Teste + analytics | Melhorar PDP e guias |
| Aumentar confiança | Encontra garantia antes da compra | Sucesso em tarefa + clique em garantia | Teste + evento | Expor garantia na PDP |
| Reduzir abandono | Menos saída no frete | Abandono por etapa | Analytics | Simular frete antes |
| Melhorar busca | Menos buscas vazias | Zero results | Busca interna | Sinônimos e taxonomia |
| Melhorar performance | Página responde rápido | LCP, INP, CLS | Web Vitals | Otimização técnica |

---

## 31. Fontes utilizadas

- Google Research — Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications: https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/
- Google Research PDF — Measuring the User Experience on a Large Scale: https://research.google.com/pubs/archive/36299.pdf
- Kerry Rodden — The HEART Framework for UX Metrics: https://kerryrodden.com/heart/
- NN/g — Quantitative UX: Glossary: https://www.nngroup.com/articles/quant-ux-glossary/
- NN/g — Quantitative Research: Study Guide: https://www.nngroup.com/articles/quantitative-research-study-guide/
- NN/g — Success Rate: The Simplest Usability Metric: https://www.nngroup.com/articles/success-rate-the-simplest-usability-metric/
- NN/g — User Satisfaction vs. Performance Metrics: https://www.nngroup.com/articles/satisfaction-vs-performance-metrics/
- NN/g — Measuring Perceived Usability with the SUS, NASA-TLX, and the Single Ease Question: https://www.nngroup.com/articles/measuring-perceived-usability/
- NN/g — Net Promoter Score: What a Customer-Relations Metric Can Tell You About UX: https://www.nngroup.com/articles/nps-ux/
- NN/g — Benchmarking UX: Tracking Metrics: https://www.nngroup.com/articles/benchmarking-ux/
- NN/g — 7 Steps to Benchmark Your Product’s UX: https://www.nngroup.com/articles/product-ux-benchmarks/
- NN/g — Documenting a UX-Benchmarking Study: https://www.nngroup.com/articles/ux-benchmarking-repository/
- NN/g — Why You Cannot Trust Numbers from Qualitative Usability Studies: https://www.nngroup.com/articles/true-score/
- NN/g — Usability Testing 101: https://www.nngroup.com/articles/usability-testing-101/
- NN/g — Tree Testing Part 2: Interpreting the Results: https://www.nngroup.com/articles/interpreting-tree-test-results/
- NN/g — CASTLE Framework for Productivity/Workplace Applications: https://www.nngroup.com/articles/castle-framework/
- NN/g — Calculating ROI for Design Projects in 4 Steps: https://www.nngroup.com/articles/calculating-roi-design-projects/
- NN/g — 10 Survey Challenges and How to Avoid Them: https://www.nngroup.com/articles/10-survey-challenges/
- Google Search Central — Understanding Core Web Vitals and Google Search Results: https://developers.google.com/search/docs/appearance/core-web-vitals
- web.dev — Web Vitals: https://web.dev/articles/vitals
- Google Books — A Practical Guide to the System Usability Scale: https://books.google.com.br/books?id=BL0kKQEACAAJ

---

## 32. Resumo executivo

Use este arquivo quando o projeto precisa medir experiência, acompanhar melhoria, comparar versões ou conectar UX com produto e negócio.

A lógica principal é:

```txt
Decisão
↓
Objetivo
↓
Sinal
↓
Métrica
↓
Fonte
↓
Baseline
↓
Meta/direção
↓
Ação
```

O Claude Cowork deve usar este documento para:

- escolher métricas de UX;
- montar HEART;
- definir Goals-Signals-Metrics;
- criar planos de mensuração;
- definir métricas de teste de usabilidade;
- interpretar analytics;
- montar benchmarks;
- diferenciar métrica comportamental e percebida;
- evitar métricas de vaidade;
- criar dashboards enxutos;
- transformar números em hipóteses, recomendações e próximos passos.

Métrica de UX não é enfeite de relatório. É instrumento de decisão. Se o número não orienta uma ação, ele provavelmente está só ocupando espaço.
