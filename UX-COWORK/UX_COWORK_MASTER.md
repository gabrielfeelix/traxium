# UX_COWORK_MASTER — Fallback portátil dos CORE

> Os 14 arquivos CORE concatenados, para colar e usar fora do Cowork. **Fonte canônica = a base completa** em `UX-COWORK/` (com `expanded/`, `templates/`, `checklists/`, `_GLOSSARY`, `_METHOD_PICKER`, `_SOURCES`). Este arquivo é um espelho só dos CORE — pode ficar desatualizado; em dúvida, a base manda.



═══════════════════════════════════════════════════
  01_METHODS
═══════════════════════════════════════════════════

# 01_METHODS — CORE

## 1. Para que serve

Porta de entrada metodológica da base. Diante de qualquer projeto, transforma a corrente **dúvida → risco → método → evidência → decisão** em uma escolha concreta: qual método produz a evidência certa para a decisão que está na mesa. Não é curso de pesquisa; é régua de decisão.

Princípio que manda em tudo: **a dúvida e o risco definem o método — não a técnica favorita.** Pesquisa que não muda nenhuma decisão não deve ser feita.

## 2. Quando usar / Quando NÃO usar

**Quando usar (este arquivo):**
- Antes de abrir o Figma, para decidir *o que* investigar e *com qual* método.
- Quando há uma decisão de produto em risco (o que construir, priorizar, corrigir, abandonar).
- Para defender tecnicamente uma escolha de método diante de gestor/dev/solicitante.

**Quando NÃO buscar resposta em pesquisa de usuário:**
- **Risco de viabilidade** (dá para construir no nosso stack/prazo?) → spike técnico com devs; UX só informa escopo.
- **Risco de negócio puro** (custo, legal, marca) → alinhamento com stakeholders, não usuário.
- Quando não há decisão-alvo nem risco claro → pare; ainda não é hora de pesquisar.
- Eixos de pesquisa (quali/quanti, comportamental/atitudinal, generativa/avaliativa) **não se redefinem aqui** → ver `_GLOSSARY` §3.

## 3. Processo operacional

Responda nesta ordem, antes de escolher qualquer técnica:

1. **Qual decisão** precisa ser tomada? Sem decisão-alvo, pesquisa vira passatempo.
2. **Qual risco** reduzir? Valor, usabilidade, navegação, adoção. (mapa risco→método no EXPANDED)
3. **O que já sabemos?** Dados, pesquisas anteriores, suporte — desk research primeiro, não recoletar o que já existe.
4. **O que ainda é suposição?** Hipótese disfarçada de certeza é o que precisa de teste.
5. **Comportamento ou percepção?** O que fazem → método comportamental. O que dizem/pensam → atitudinal. (dito ≠ feito, `_GLOSSARY` §3)
6. **Profundidade ou escala?** Por quê/como → qualitativo. Quanto/quantos → quantitativo.
7. **Cabe no prazo e orçamento?** Método perfeito que não cabe não serve; escolha o mais forte viável.

→ Pick rápido "qual método para esta situação" em uma tela: `_METHOD_PICKER`.

## 4. Checklist

Antes de iniciar qualquer pesquisa, responda — se travar em "qual decisão" ou "qual risco", **pare**:

- [ ] Qual **decisão** esta pesquisa apoia?
- [ ] Qual **risco** estou reduzindo?
- [ ] O que **já sei** (dados/suporte/pesquisas) e já consultei?
- [ ] O que ainda é **suposição** que preciso testar?
- [ ] Preciso de **comportamento** ou **percepção**? **Profundidade** ou **escala**?
- [ ] O método **cabe no prazo/orçamento** e gera **entregável** que alguém usa para decidir?

→ Checklist completo (10 itens, com recrutamento e documentação) no EXPANDED.

## 5. Erros comuns

- Não pergunte **"você usaria?"** — futuro hipotético não prevê comportamento real.
- Não trate **preferência declarada** como comportamento — gostar ≠ usar.
- Não entreviste o **perfil errado** — dado bom de pessoa errada é dado inútil.
- Não tire conclusão quantitativa de **amostra pequena** — número sem base é ilusão de certeza.
- Não faça pesquisa **só para confirmar** uma ideia já decidida — isso é teatro, não evidência.

## 6. Relação com outros arquivos

- **Eixos quali/quanti, comportamental/atitudinal, generativa/avaliativa** → definidos em `_GLOSSARY` §3.
- **Escolha rápida de método em 1 tela** → `_METHOD_PICKER`.
- **Entrevista, pesquisa contextual, diary study** → dono é `03`.
- **Síntese, achados, jornada, JTBD, matriz CSD** → dono é `04` (CSD/Opportunity Tree no `02`).
- **Card sorting, tree testing, arquitetura da informação** → dono é `05`.
- **Tipos de teste de usabilidade e severidade de problemas** → dono é `07`.
- **Métricas, HEART, SUS, taxa de sucesso, funil** → dono é `08`.
- **Auditoria de e-commerce / funil de compra** → dono é `09`.
- **UX quando não há margem para pesquisa formal (proxies)** → dono é `14`.

## 7. Fontes principais

- **When to Use Which UX Research Methods — NN/g** — base do framework atitudinal×comportamental / quali×quanti.
- **UX Research Cheat Sheet — NN/g** — "quando usar cada método" pelas fases Descobrir/Explorar/Testar/Ouvir.
- **User research — GOV.UK Service Manual** — métodos em contexto ágil/institucional.

Demais fontes (Digital.gov, 18F) → `_SOURCES.md`.

→ Aprofundamento: expanded/01_METHODS_EXPANDED.md

---

## NOTA DE LACUNA

- Fonte original listava *User research methods — Defra digital* como referência, marcada **inacessível** na destilação (URL não retornou). Nenhum conteúdo dela foi usado aqui; não preencher de cabeça. Reavaliar se o link correto aparecer.


═══════════════════════════════════════════════════
  02_DISCOVERY
═══════════════════════════════════════════════════

# 02_DISCOVERY — CORE

## 1. Para que serve

Manual da fase inicial. Transforma um pedido vago ("precisamos da tela X") em um **problema bem definido, com riscos mapeados e hipóteses testáveis**, antes de gastar recurso em solução. Discovery é processo de investigação até haver evidência suficiente para decidir — não é reunião nem documento.

Princípio que manda em tudo: **entenda o problema antes de desenhar a solução; reduza o risco certo; decida com evidência.** Discovery que não muda nenhuma decisão foi teatro.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Início de projeto, pedido vago, problema ainda nebuloso.
- Quando há risco alto e ainda sem evidência (o que construir / priorizar / abandonar).
- Para alinhar negócio, design e dev sobre o que se sabe vs. se supõe.

**Quando NÃO usar (ou usar enxuto):**
- Problema já validado e risco baixo → vá para ideação/execução.
- **Risco de viabilidade técnica** → spike com devs; UX só informa escopo.
- Não trate discovery como **kickoff de 1h** — é processo até ter evidência.
- Sem margem para pesquisa formal → rode o **discovery mínimo viável** (dados existentes, desk, benchmark, heurística), nunca pule pra UI. Aprofundamento → `14`.

## 3. Processo operacional

A espinha é o **Double Diamond** (Design Council): dois losangos, cada um abre (divergir) e fecha (convergir). Diamante 1 = problema, Diamante 2 = solução.

1. **Discover** (abrir problema) — explorar amplamente: falar com afetados, observar, levantar dados/contexto. Saída: material bruto + hipóteses de dor.
2. **Define** (fechar problema) — sintetizar e recortar **o problema que vale resolver**. Saída: definição clara do problema.
3. **Develop** (abrir solução) — gerar muitas respostas: ideação, cocriação, protótipos. Saída: leque de alternativas.
4. **Deliver** (fechar solução) — testar em pequena escala, descartar o que falha, refinar, entregar, medir. Saída: solução validada.

**Motor — divergir/convergir:** abrir o suficiente para ter boas opções, fechar com critério para agir. Só convergir = fecha na ideia do mais forte. Só divergir = nunca decide. Não é linear: volte de Define→Discover quando a evidência mandar.

**Instrumentos (donos deste arquivo):**

- **Matriz CSD** — separa fato de achismo no começo:
  - *Certeza* = sabido com evidência. *Suposição* = acreditado, não comprovado. *Dúvida* = ainda desconhecido.
  - Regra: a suposição mais perigosa é a que o time **mais acredita e menos comprova**. Comece por ela.
- **Lente dos 4 riscos (SVPG)** — a maioria das ideias falha por motivo previsível. Avalie quais riscos são significativos *neste* caso (tratar tudo como risco máximo trava o time):

  | Risco | Pergunta crítica |
  |---|---|
  | **Valor** | Querem/precisam disso a ponto de usar ou pagar? |
  | **Usabilidade** | Conseguem entender e usar? |
  | **Viabilidade técnica** | Dá pra construir no nosso stack/prazo? |
  | **Negócio** | Funciona p/ custo, marca, legal, vendas? |

  (+ *adoção* e *entrega* como lentes complementares.) → método para cada risco: ver `_METHOD_PICKER` (matriz risco→método→evidência).

- **Opportunity Solution Tree (OST)** — mapa de 4 níveis que impede pular pra solução:
  - **Outcome** (raiz) = métrica de comportamento/negócio, não feature.
  - **Oportunidades** = necessidades/dores reais (espaço do problema).
  - **Soluções** = ideias para uma oportunidade (várias por oportunidade).
  - **Experimentos** = testes de suposição que provam se a solução move o outcome.
  - Regra: toda solução pendurada numa oportunidade, toda oportunidade no outcome. Solução solta = feature sem problema. (estrutura visual no EXPANDED)

- **Dúvida → hipótese → experimento** — converta antes de pesquisar. Hipótese boa é **falsificável** (dá pra dar errado). Se nada a refutaria, é desejo, não hipótese.

**Sequência mínima viável** (times sem pesquisa formal): alinhamento de negócio → CSD → dados existentes → teste de usabilidade → métricas.

## 4. Checklist

Antes de avançar de discovery para ideação/protótipo — muitos "não" = discovery não está pronto:

- [ ] Sabemos **qual decisão** precisa ser tomada e **quais riscos** reduzir?
- [ ] Temos **evidência**, não só opinião de stakeholder?
- [ ] Sabemos **quem é o usuário** e o **contexto de uso**?
- [ ] Há **hipóteses testáveis** e **critério de sucesso** definidos?
- [ ] O problema está **recortado** (não genérico)?
- [ ] As **oportunidades foram priorizadas** pelo outcome e sabemos **como validar**?

→ Checklist completo (10 itens) no EXPANDED.

## 5. Erros comuns

- Não trate discovery como **reunião inicial** — é processo até haver evidência.
- Não transforme **opinião de stakeholder** em verdade — opinião é hipótese.
- Não **pule pra solução** nem faça **ideação antes de definir o problema**.
- Não use o **Double Diamond como slide decorativo** — se não muda o processo, é enfeite.
- Não valide **só a solução preferida** do time — busque teste honesto, não confirmação.

## 6. Relação com outros arquivos

- **Como executar cada método e qual técnica por risco** → `01` + `_METHOD_PICKER`.
- **Cadeia oportunidade / insight / hipótese de solução** → definida em `_GLOSSARY` §1.
- **Entrevistas e pesquisa contextual** (Discover) → dono é `03`.
- **Síntese, affinity, jornada, insights** (etapa de síntese) → dono é `04`.
- **Card sorting, tree testing, arquitetura da informação** → dono é `05`.
- **Ideação: HMW, Crazy 8, facilitação** (Develop) → dono é `06`.
- **Testes de usabilidade** (Deliver) → dono é `07`.
- **Métricas e definição de outcome** → dono é `08`.
- **Discovery mínimo viável sob restrição** → dono é `14`.

## 7. Fontes principais

- **The Double Diamond — Design Council** — as 4 fases e a lógica divergente/convergente.
- **Product Discovery — SVPG (Marty Cagan)** — os riscos de produto (valor, usabilidade, viabilidade, negócio).
- **Opportunity Solution Trees — Product Talk (Teresa Torres)** — outcome → oportunidades → soluções → experimentos.

Demais fontes (Framework for Innovation, IDEO, IBM EDT) → `_SOURCES.md`.

→ Aprofundamento: expanded/02_DISCOVERY_EXPANDED.md

---

## NOTA DE LACUNA

- Fontes **SVPG** (índices de product discovery) e **IBM Enterprise Design Thinking Toolkit**: na destilação original os URLs de índice **não retornaram isoladamente** nas buscas. O conteúdo foi fundamentado nas fontes primárias (SVPG "Four Big Risks", página de framework da IBM), não inventado. Revalidar URLs ao consolidar `_SOURCES`.


═══════════════════════════════════════════════════
  03_INTERVIEWS
═══════════════════════════════════════════════════

# 03_INTERVIEWS — CORE

## 1. Para que serve

Manual de pesquisa qualitativa com pessoas: planejar, conduzir e interpretar **entrevistas e pesquisa em contexto**. Serve para entender o **"porquê"** — contexto, comportamento passado, necessidade e critério de decisão — sem induzir resposta.

Princípio que manda em tudo: **pergunte sobre o passado concreto, observe o comportamento real e separe o que a pessoa diz do que ela faz.** Entrevista é para **entender**, não para **medir** nem para **avaliar usabilidade**.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Entender motivação, contexto, histórico, dores e critério de decisão.
- Reconstruir como a pessoa faz hoje e por quê (comportamento passado real).
- Investigar o "porquê" por trás de um número (ex.: motivo de um abandono visto em analytics → `08`).

**Quando NÃO usar como método principal:**
- **Medir frequência** ("quantos %?") → survey/analytics.
- **Prever compra/uso futuro** ("você usaria/pagaria?") → intenção declarada não é evidência.
- **Comparar interfaces ou layout** → teste de usabilidade / A-B (`07`), que medem comportamento.
- **Provar hipótese estatisticamente** → amostra pequena não sustenta conclusão quantitativa.
- **Avaliar usabilidade** → para saber se é usável, **observe a pessoa usando**, não pergunte "é fácil?".

## 3. Processo operacional

**Planejar → conduzir → sintetizar:**

1. **Objetivo + decisão-alvo** — o que aprender e qual decisão isso apoia. Sem decisão, repense.
2. **Perfil + recrutamento** — usuários reais ou prováveis; evite amostra de conveniência (amigos/colegas). → `templates/screener.md`.
3. **Roteiro** — guia semiestruturado (não script lido). Estrutura: abertura → consentimento → aquecimento → contexto → comportamento passado → dores → critério de decisão → soluções atuais → encerramento.
4. **Consentimento + setup** — consentimento antes de qualquer gravação; testar equipamento; ambiente acessível. (consentimento/LGPD → `11`; `templates/consentimento.md`)
5. **Piloto** — testar o roteiro com 1 pessoa; quase sempre revela perguntas confusas.
6. **Conduzir** — falar menos que o participante; pedir exemplos reais do passado; deixar o silêncio trabalhar; reação neutra; registrar frases literais; separar fato de interpretação.
7. **Sintetizar** — agrupar padrões → dores/necessidades/critérios → insights. (affinity, jornada, insight → dono `04`)

**Pergunta boa vs ruim** (o padrão por trás):
- ❌ "Você usaria isso?" → ✅ "Como você resolve isso hoje?"
- ❌ "Você gostou?" → ✅ "O que você fez depois dessa tela?"
- ❌ "Você pagaria?" → ✅ "Conte da última vez que pagou por algo assim. Como decidiu?"
- Regra: troque **futuro hipotético / opinião** por **história concreta do passado / comportamento observável**.

**Métodos de contexto** (observar > perguntar; detalhe no EXPANDED):
- **Pesquisa contextual / contextual inquiry** — observar no ambiente real *enquanto acontece*; alta validade ecológica. Use quando contexto importa.
- **Field study** — acompanhar a atividade *in situ* por um período curto; melhor em dupla.
- **Diary study** — participante registra a própria experiência ao longo de dias/semanas; para jornadas longas. Adesão é o maior risco.

## 4. Checklist

**Antes:** objetivo + decisão definidos · perfil e critério de recrutamento claros · participantes são usuários reais · roteiro sem indução · piloto feito · consentimento e setup combinados · definido quem conduz e quem anota.

**Durante:** consentimento obtido antes de gravar · falando menos que o participante · pedindo exemplos reais do passado · evitando induzir · deixando o silêncio · registrando frases literais (fato ≠ interpretação) · aprofundando com "por quê / me conta mais".

**Depois:** notas organizadas por sessão · fato/fala/interpretação separados · padrões agrupados · insights ligados a evidência · dados anonimizados e seguros.

→ Checklists completos (antes/durante/depois) no EXPANDED.

## 5. Erros comuns

- Não entreviste **amigos/colegas** como se fossem usuários — amostra de conveniência distorce tudo.
- Não aceite **opinião como evidência** — opinião é hipótese, não fato.
- Não pergunte sobre **futuro hipotético** ("você usaria?") nem **induza** a resposta.
- Não **fale mais que o participante** — quem conduz escuta, não preenche.
- Não transforme **uma fala isolada em verdade** — um caso é pista, não regra. (contradição dito×feito é achado, não erro a esconder)

## 6. Relação com outros arquivos

- **Catálogo geral de métodos e escolha por risco** → `01` + `_METHOD_PICKER`.
- **Onde entrevista/contexto entram no discovery (etapas Discover)** → `02`.
- **Síntese: affinity mapping, jornada, insight, JTBD** → dono é `04` (a síntese aqui é só a ponte).
- **Critério de decisão e linguagem do usuário viram vocabulário/estrutura** → `05`.
- **Comportamento de uso (entrevista capta percepção; teste capta comportamento)** → `07`. Use os dois.
- **Consentimento, LGPD, privacidade e repositório de dados** → dono é `11`.
- **Eixos quali/atitudinal, dado→insight** → `_GLOSSARY` §1 e §3.

## 7. Fontes principais

- **User Interviews 101 — NN/g** — conduzir entrevistas para perceber, não para medir usabilidade.
- **Context Methods: Study Guide — NN/g** — field studies, diary studies e contextual inquiry e suas diferenças.
- **Using in-depth interviews — GOV.UK Service Manual** — entrevistas em profundidade com usuários reais/prováveis.

Demais fontes (NN/g: 3 Types, Stakeholder, Field/Diary/Remote CI; GOV.UK notas/privacidade) → `_SOURCES.md`.

→ Aprofundamento: expanded/03_INTERVIEWS_EXPANDED.md

---

## NOTA DE LACUNA

- Dois posts do **GOV.UK User Research Blog** ("Researching in context", "Advice for better moderated usability testing") **não retornaram isoladamente** nas buscas da destilação original; usados de forma complementar, tema fundamentado pelo Service Manual da própria GOV.UK. Revalidar URLs ao consolidar `_SOURCES`.
- Consentimento/LGPD aponta para `11`, hoje em stub. Ponteiro correto; destino a preencher.


═══════════════════════════════════════════════════
  04_SYNTHESIS
═══════════════════════════════════════════════════

# 04_SYNTHESIS — CORE

## 1. Para que serve

Dono do tema **síntese**: o que fazer **depois** de coletar pesquisa (`03`) — sair de notas e observações soltas para padrões, insights, oportunidades e recomendações que mudam decisões. Inclui os mapas (empatia, jornada, experiência, blueprint).

Princípio que manda em tudo: **síntese é interpretar com rastreabilidade, não resumir.** Todo insight rastreável até o dado bruto; mapa que não muda decisão não deveria existir.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Depois de coletar pesquisa, para dar sentido a um volume de dado qualitativo.
- Para gerar entendimento compartilhado e priorizar oportunidades.
- É o "fechar" do primeiro diamante (Define, `02`): dado do Discover vira problema definido.

**Quando NÃO usar:**
- **Sem dado real** → mapa/persona sem pesquisa é ficção bonita; agrupar suposição não é síntese.
- **Pergunta quantitativa** ("quanto/quantos") → analytics/survey (`08`), não análise temática.
- Não faça mapa como **peça decorativa** — se ninguém sabe o que fazer depois, o exercício falhou.

## 3. Processo operacional

**A cadeia da pesquisa** (não pule etapas): dado bruto → observação → padrão → achado → insight → oportunidade → recomendação → hipótese de solução. *Definições em `_GLOSSARY §1`; aqui mora o processo.* Erro mais comum: tratar achado (o "o quê") como insight (o "porquê").

**Analisar dado qualitativo:**
1. **Reunir** notas/gravações de todas as fontes (preservar contexto).
2. **Separar fala, comportamento e interpretação** — não misturar inferência com fato.
3. **Codificar temas** — rótulos curtos vindos do dado, não de hipótese pré-formada.
4. **Agrupar padrões** (affinity) — por evidência, com critério explícito; exigir repetição em **+1 fonte**.
5. **Registrar tensões e contradições** — não esconder; revelam segmento/contexto.
6. **Gerar insights** — o porquê, sempre ligado a evidência.
7. **Conectar a oportunidades** → priorizar recomendações (impacto × esforço × confiança).

**Affinity mapping** — quebrar dado em unidades pequenas e agrupar por similaridade até temas emergirem. É ferramenta de **organização/síntese**, não método de pesquisa. Erro nº 1: agrupar sem critério ("agrupar com base em quê?"). Agrupamento é meio; segue priorização.

**Escolher o mapa certo** (detalhe e tabelas no EXPANDED):
- **Empathy map** — alinhar o time sobre **um tipo de usuário** e revelar lacunas de pesquisa. Não cronológico. "Diz/Faz" = observável; "Pensa/Sente" = inferência ancorada em pesquisa.
- **Journey map** — experiência de **uma persona** rumo a um objetivo, no tempo e nos canais, com emoções. Exige **pessoa + cenário + objetivo**; 1 mapa por perfil.
- **Experience map** — comportamento humano **amplo**, sem dono comercial. Anterior ao produto.
- **Service blueprint** — estende a jornada "para baixo da linha": frontstage/backstage/suporte. Revela pontos de falha operacionais. Para serviço complexo/omnichannel.

**Distinções que não podem colar:** jornada ≠ user flow · empathy map ≠ persona (`_GLOSSARY §6`) · journey map (cliente) ≠ service blueprint (organização).

## 4. Checklist

Qualidade da síntese antes de entregar:

- [ ] **Insights têm evidência** rastreável até o dado bruto?
- [ ] **Padrões aparecem em +1 fonte**?
- [ ] **Contradições** registradas (não escondidas)?
- [ ] **Escopo do mapa** claro; jornada com **pessoa, cenário e objetivo**; 1 público por mapa?
- [ ] **Oportunidades acionáveis** e **recomendações ligadas a decisões**?
- [ ] Camada qualitativa (**emoções, dúvidas, contexto**) presente, e o time **sabe o que fazer depois**?

→ Checklist completo (10 itens) no EXPANDED.

## 5. Erros comuns

- Não **mapeie sem pesquisa** — mapa sem dado é ficção; persona/jornada inventada é suposição com cara de fato.
- Não **confunda achado com insight** — descrever o padrão não é interpretar o porquê.
- Não **misture públicos num mapa só** — 1 mapa por perfil; juntar tudo apaga diferenças.
- Não **deixe o stakeholder dominar a interpretação** — a evidência define, não quem fala mais alto.
- Não **termine com mapa bonito sem decisão** — se não muda nada, não deveria existir.

## 6. Relação com outros arquivos

- **Métodos que geram o dado** sintetizado aqui → `01`.
- **Síntese é o Define (fechar 1º diamante)** → `02`.
- **Matéria-prima (notas, observações de entrevista/contexto)** → `03` (a síntese lá é só a ponte).
- **Padrões de linguagem e agrupamentos viram vocabulário/estrutura** → `05`.
- **Oportunidades priorizadas são a entrada da ideação** → `06`.
- **Hipóteses de solução geradas aqui viram o que se testa** → `07`.
- **Métricas penduradas na jornada** → dono é `08`.
- **Rastreabilidade e repositório de evidências** → operacionalizados por `11`.
- **Cadeia dado→insight→recomendação; persona** → definidas em `_GLOSSARY §1` e §6.

## 7. Fontes principais

- **How to Analyze Qualitative Data: Thematic Analysis — NN/g** — base da análise temática.
- **UX Mapping Methods Compared: A Cheat Sheet — NN/g** — empathy/journey/experience map e service blueprint comparados.
- **Journey Mapping 101 — NN/g** — componentes da jornada (ações, mindsets, emoções, oportunidades).

Demais fontes (NN/g: Affinity pitfalls, Empathy, Service Blueprint, User Journeys vs Flows; Atlassian Playbook) → `_SOURCES.md`.

→ Aprofundamento: expanded/04_SYNTHESIS_EXPANDED.md

---

## NOTA DE LACUNA

- Vários URLs específicos da NN/g (Affinity Diagramming, Customer Journey Mapping, Journey Mapping How/FAQ, Service Blueprinting in Practice) **não retornaram isoladamente** nas buscas da destilação original; conceitos confirmados via artigos irmãos da própria NN/g (pitfalls, cheat sheet, study guide). Revalidar URLs ao consolidar `_SOURCES`.


═══════════════════════════════════════════════════
  05_INFO_ARCH
═══════════════════════════════════════════════════

# 05_INFO_ARCH — CORE

## 1. Para que serve

Dono do tema **estrutura**: organizar, revisar e validar a **Arquitetura da Informação (AI)** de sites, e-commerces, SaaS, portais, apps e sistemas com muito conteúdo. Foco em ajudar o usuário a **encontrar, entender e navegar** com menos esforço — não fazer menu bonito.

Princípio que manda em tudo: **organize pelo modelo mental do usuário, nomeie com clareza, valide com pesquisa.** Se você não está testando sua AI, está adivinhando.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Site novo, redesign, e-commerce, portal/SaaS com muito conteúdo ou funcionalidade.
- Quando "usuários não encontram o importante" — sinal de AI ou rótulo ruim.

**Quando NÃO usar (ou não confundir):**
- **AI não é menu nem sitemap** — consertar o menu sem consertar a estrutura por trás raramente resolve.
- **Card sorting não valida** estrutura pronta → para isso, tree testing.
- Não organize pelo **organograma da empresa** — estrutura interna ≠ modelo mental do usuário.
- Sem conteúdo/dado real para inventariar e testar → não há o que estruturar com evidência.

## 3. Processo operacional

**Saber o que AI é (e não é):**
- **AI** = estrutura, organização e nomenclatura das relações entre conteúdos. O backbone. (`_GLOSSARY §6`)
- **Sitemap** = diagrama visual da hierarquia; *saída* da AI, não a AI.
- **Navegação/menu** = manifestação visível da AI na UI (a ponta do iceberg), não a AI inteira.
- **Taxonomia** = vocabulário controlado de bastidor que classifica o conteúdo e alimenta as facetas.
- **User flow** = sequência de passos de uma tarefa (caminho de cliques); não é AI.

**Descobrir antes de estruturar:**
- **Modelo mental** — como o usuário *espera* que esteja organizado. Usuários agrupam por objetivo/tarefa; o time interno por produto/área. Categorias vêm de evidência (sorting, busca, tarefas), não de palpite. (`_GLOSSARY §6`)
- **Top tasks** — o pequeno conjunto de tarefas que mais importam. Critério objetivo do que fica acessível; organize por tarefa do usuário, não por departamento. (`_GLOSSARY §6`)

**Criar e validar (par fixo):**
- **Card sorting** — participantes agrupam itens como faz sentido para eles; **gera/informa** a estrutura e revela rótulos. Aberto (cria grupos), fechado (encaixa em categorias dadas), híbrido. Cedo, ao criar a AI.
- **Tree testing** — usuário busca itens numa **árvore textual sem UI**; **avalia findability** (se encontram). Depois de propor a AI. Isola estrutura e rótulos do layout.
- **Regra:** card sorting gera, tree testing valida — **um não substitui o outro**.

**Nomear:**
- **Rótulos** são a promessa do que há atrás do link. Mire **information scent alto**: vocabulário do usuário, palavra-chave primeiro, específico > genérico. Verbo vago ("Explorar", "Soluções") e jargão de marca têm scent baixo. Teste labels com tree testing e análise de busca.

**Fluxo de proposta** (enxuto): inventário → auditoria → top tasks + entrevistas (modelo mental/vocabulário) → card sorting → sitemap + taxonomia + labels → navegação → **tree testing** → ajustar → documentar regras. (detalhe no EXPANDED)

## 4. Checklist

Qualidade da AI antes de entregar:

- [ ] Usuários **preveem** o que existe em cada categoria; **labels claros** (scent alto)?
- [ ] Navegação reflete **top tasks**, não departamentos?
- [ ] AI **escala** com conteúdo novo sem quebrar?
- [ ] **Filtros** ajudam decisões reais e **busca** cobre os termos do usuário?
- [ ] Conteúdo importante é **encontrável** e há **evidência** por trás das decisões?
- [ ] Estrutura **validada com tree testing**?

→ Checklist completo (10 itens) no EXPANDED.

## 5. Erros comuns

- Não **confunda AI com sitemap/menu** — são saída e manifestação, não a estrutura.
- Não **organize pelo organograma** — estrutura interna ≠ modelo mental do usuário.
- Não **use nomes internos** (jargão/marca) — information scent baixo, usuário não sabe o que há atrás.
- Não **crie categorias ambíguas** — sobreposição faz o usuário errar; teste e considere poli-hierarquia.
- Não **deixe de testar labels e estrutura** — rótulo e AI não validados são aposta; tarefa de tree testing não pode entregar a resposta.

## 6. Relação com outros arquivos

- **Card sorting e tree testing no catálogo geral** → resumidos em `01` (dono é aqui).
- **AI entra na transição Define→Develop; top tasks recortam o problema** → `02`.
- **Entrevistas revelam vocabulário e modelo mental que viram categorias/labels** → `03`.
- **Síntese (padrões, linguagem do usuário) alimenta a taxonomia; jornada mostra onde a AI entrega** → `04`.
- **Card sorting / proposta de AI como workshop** → `06`.
- **Tree testing (sem UI) complementa o teste de usabilidade (com UI)** → `07`.
- **Taxa de sucesso, busca interna e analytics medem a saúde da AI** → métricas são dono de `08`.
- **Categorias, filtros e busca no contexto de e-commerce** → `09`.
- **Navegação e labels claros também são requisitos de acessibilidade** → `10`.

## 7. Fontes principais

- **Information Architecture vs. Sitemaps — NN/g** — AI é o processo; sitemap é a saída visual.
- **Card Sorting — NN/g** — aberto/fechado/híbrido; descobrir o modelo mental.
- **Tree Testing — NN/g** — avalia findability sem interferência visual.

Demais fontes (NN/g: Taxonomy 101, Card vs Tree, Information Scent, Menu Design; Digital.gov; GOV.UK) → `_SOURCES.md`.

→ Aprofundamento: expanded/05_INFO_ARCH_EXPANDED.md

---

## NOTA DE LACUNA

- Vários URLs NN/g específicos (Information Architecture Study Guide, Information Scent, Category Names, Top Tasks vídeo) e 1 post do **GOV.UK User Research Blog** (card sorting) **não retornaram isoladamente** nas buscas da destilação original; conceitos confirmados via artigos irmãos da NN/g e Digital.gov. Revalidar URLs ao consolidar `_SOURCES`.


═══════════════════════════════════════════════════
  06_IDEATION
═══════════════════════════════════════════════════

# 06_IDEATION — CORE

## 1. Para que serve

Dono de **ideação e workshops**: o que fazer **depois** de discovery, pesquisa e síntese — transformar achados, insights e oportunidades em soluções possíveis, protótipos e experimentos. Inclui HMW, Crazy 8, Design Sprint, priorização e facilitação.

Princípio que manda em tudo: **ideação boa não começa em tela; começa em oportunidade bem formulada.** Idea que nasce de dor rastreável pode ser testada; idea que nasce só da preferência do time é aposta solta.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Após discovery/síntese: há clareza do problema, mas ainda não há consenso sobre o caminho de solução.
- Time preso numa única solução, ou stakeholders com soluções conflitantes (tirar a disputa do campo da opinião).
- Antes de prototipar, para não prototipar a primeira ideia.

**Quando NÃO idear ainda** (volte para discovery/síntese):
- Problema indefinido, público mal compreendido, sem evidência mínima de dor.
- Objetivo de negócio ou critérios de sucesso não definidos.
- Sessão usada só para **legitimar uma solução já decidida** — isso é teatro.
- "Querem ideias criativas" antes de saber o que precisa mudar.

## 3. Processo operacional

**A ponte** (cadeia em `_GLOSSARY §1`): insight → oportunidade → **HMW** → ideias → critérios → **hipótese** → protótipo → teste. Evita o salto "usuário não entende → vamos fazer uma landing bonita".

**How Might We (HMW / "Como podemos…")** — transforma problema em oportunidade de solução. Bom HMW: começa com "Como podemos…", parte de insight real, **não embute solução**, escopo claro, abre +1 alternativa.
- ❌ amplo demais: "Como podemos melhorar a experiência?"
- ❌ estreito demais (já é solução): "Como podemos criar um quiz?"
- ✅ "Como podemos traduzir especificações em benefícios práticos para iniciantes?"

**Crazy 8** — sketching rápido: **8 ideias em 8 minutos**. Tira o time da 1ª ideia (a mais óbvia) e força variedade. Serve para gerar volume, evitar debate prematuro, fazer todos contribuírem. **Não** serve para layout final nem para substituir pesquisa. Regra do facilitador: *não estamos desenhando a tela final; estamos explorando caminhos.* Funciona só com desafio bem recortado (1 oportunidade por rodada).

**Compartilhar e votar** — compartilhar ≠ vender (explique o problema que tentou resolver, sem campanha). Votar (dot voting) mostra interesse, não verdade — **defina critério antes** e registre **por que** a ideia foi escolhida. Sem justificativa, a decisão some na 1ª discordância.

**Design Sprint** — processo de 5 dias (GV) que comprime entender→idear→decidir→prototipar→testar para responder uma pergunta crítica. Rode quando há um **desafio bem definido** e decisão difícil a destravar. **Não** rode para qualquer problema, nem para substituir discovery contínuo, nem para "sair com tela pronta". Fases e formatos adaptados (mini sprint) no EXPANDED.

**Hipótese testável** — a ideia com compromisso. Formato: *Acreditamos que [solução] / para [público] / ao [mudança] / mediremos [métrica] / saberemos que funcionou se [resultado].* Boa hipótese é específica o bastante para testar e aberta o bastante para ser descartada se falhar.

## 4. Checklist

Workshop bom termina com:

- [ ] **O que** decidimos e **por que** (com base em qual evidência)?
- [ ] As ideias saíram de **oportunidade/insight rastreável**, não de gosto?
- [ ] Houve **separação entre gerar e julgar** (divergir antes, convergir depois)?
- [ ] A escolha usou **critério explícito**, não voto por gosto nem hierarquia?
- [ ] Cada solução virou **hipótese testável** com próximo teste definido?
- [ ] **Quem faz o quê** e qual a próxima entrega?

→ Planejamento completo de workshop (11 passos) e dinâmicas no EXPANDED.

## 5. Erros comuns

- Não **idee sem problema definido** — gera solução para nada; volte ao discovery.
- Não deixe o **stakeholder mais forte decidir tudo** — transforme opinião forte em hipótese ou critério.
- Não **vote sem critério** — ganha o mais bonito/familiar, não o que resolve.
- Não **misture ideação e crítica** ao mesmo tempo — ninguém arrisca ideia diferente.
- Não **chame preferência visual de validação** — "gostei" não prova usabilidade; prototipe e teste (`07`).

## 6. Relação com outros arquivos

- **Métodos que geram a evidência antes de idear** → `01`.
- **Ideação é o 2º diamante (Develop), depois de definir o problema** → `02`.
- **Dados qualitativos que viram oportunidades** → `03`.
- **Síntese transforma pesquisa em insights, HMW e oportunidades; workshop de síntese** → dono é `04`.
- **Quando o problema é estrutura/navegação/labels; card sorting como workshop** → `05`.
- **Validar as soluções geradas** → `07`.
- **Como medir se a hipótese funcionou** → `08`.
- **Ideação em compra/PDP/checkout** → `09`.
- **Cadeia insight→oportunidade→hipótese; MVP** → `_GLOSSARY §1` e §7.

## 7. Fontes principais

- **Google Design Sprint Kit — Methodology / Crazy 8's** — dinâmica de sketching e fases do sprint.
- **GV — The Design Sprint (Jake Knapp)** — o processo de 5 dias.
- **IDEO.org — Design Kit (Human-Centered Design)** — mindsets e métodos de ideação.

Demais fontes (IBM Enterprise Design Thinking) → `_SOURCES.md`.

→ Aprofundamento: expanded/06_IDEATION_EXPANDED.md


═══════════════════════════════════════════════════
  07_USABILITY
═══════════════════════════════════════════════════

# 07_USABILITY — CORE

## 1. Para que serve

Dono do tema **teste de usabilidade**: validar fluxos, protótipos, páginas, produtos e serviços a partir de **comportamento observado**. Participantes representativos tentam tarefas reais enquanto o pesquisador observa onde clicam, hesitam, erram, abandonam e o que esperavam.

Princípio que manda em tudo: **teste de usabilidade não mede gosto; observa desempenho, compreensão, erro, esforço e confiança em tarefas reais.** "Foi fácil?" recebe "sim" mesmo de quem errou 3 vezes. O comportamento conta a história com menos maquiagem.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Existe **solução concreta** para avaliar: protótipo, fluxo, conteúdo, navegação, formulário, produto em produção ou serviço.
- Para descobrir **onde e por que** as pessoas travam (problemas e causas prováveis), com poucos participantes.

**Quando NÃO usar como método principal:**
- **Descobrir necessidade/contexto** → entrevista exploratória (`03`).
- **Medir impacto em escala / preferência estatística / conversão** → analytics, A/B, métricas (`08`).
- **Validar problema ainda indefinido** → volte ao discovery (`02`).
- **QA técnico** → teste de usabilidade vê se a pessoa *consegue usar*, não se o sistema *funciona*.
- **Escolher visual por gosto** — "gostei" não é usabilidade.

## 3. Processo operacional

**Tipos** (definições em `_GLOSSARY §4`): moderado (entende o porquê) vs não moderado (escala) · presencial vs remoto · formativo (corrigir durante o desenho) vs somativo (medir o maduro) · qualitativo (descobrir problemas, ~5–8 por perfil) vs quantitativo (medir, amostra maior).

**Planejar → conduzir → analisar:**
1. **Objetivo + decisão-alvo** — comece pela decisão, não pelo protótipo.
2. **Hipóteses** — o que pode falhar (sem enviesar para "provar").
3. **Tarefas + critério de sucesso** — definidos **antes** da sessão.
4. **Recrutar perfil certo + piloto** — participante errado invalida o achado; piloto quase sempre revela falha.
5. **Conduzir** — não induzir, não ensinar, não defender a interface; think aloud.
6. **Analisar** — agrupar problemas por padrão, separar causa de sintoma, classificar severidade.

**Tarefa boa** dá contexto e objetivo, não o caminho:
- ❌ "Clique em Produtos e depois em Violões" (entrega o caminho).
- ✅ "Você quer comprar seu primeiro instrumento para estudar. Encontre uma opção adequada." (observa navegação real)
- Critério de sucesso definido por tarefa; cenário curto e realista, sem termo de interface.

**Conduzir sem induzir** (think aloud):
- Evite: "Clique ali", "Você viu o menu?", "Esse botão está claro?", "isso!/quase".
- Prefira: "O que você está procurando?", "O que esperava que acontecesse?", "O que te fez escolher esse caminho?"
- Participante travado: silêncio → "o que procura?" → registre como problema. Só ajude se o teste depender, e marque que não concluiu sem assistência. *Ajudar rápido demais destrói o dado.*

**O que observar:** hesitação, clique errado, voltar atrás, releitura, busca por ajuda, confusão com termo, abandono, contorno (sai pro Google), sucesso com esforço alto, sucesso parcial. O que a pessoa **faz** vale mais que o que diz racionalizando depois.

**Severidade** (priorizar correção — não é só frequência; 1 problema que impede a compra pode ser crítico):
- **Crítico** — impede tarefa essencial / abandono grave → corrigir antes de lançar.
- **Alto** — erro importante, perda de confiança, esforço alto → ciclo atual.
- **Médio** — fricção com contorno → próxima iteração.
- **Baixo** — incômodo menor → acumular.
- **Observação** — sinal a monitorar.
Justifique com evidência, não com dramaticidade.

**Problema → recomendação:** observação → problema → evidência → impacto → causa provável → **recomendação** → próximo teste. Recomendação boa é específica, rastreável e testável; "melhorar a experiência" não é recomendação.

## 4. Checklist

**Antes:** objetivo + decisão · hipóteses · perfil e recrutamento · tarefas + cenários + critério de sucesso · protótipo/ambiente pronto · roteiro · consentimento · gravação testada · **piloto** · observadores alinhados.

**Durante:** "o teste é do produto, não de você" · consentimento · think aloud · ler tarefa sem entregar caminho · observar · não induzir/defender · registrar evidência · marcar ajuda · tempo.

**Depois:** consolidar notas por tarefa · marcar sucesso/parcial/falha · agrupar problemas · separar bug/usabilidade/AI/conteúdo/acessibilidade · classificar severidade · ligar a evidência · recomendações priorizadas · reteste dos críticos.

→ Roteiro de moderação, estrutura de relatório (13 itens) e checklists completos no EXPANDED.

## 5. Erros comuns

- Não pergunte **"você gostou?"** como pergunta central — mede percepção, não usabilidade.
- Não **ensine nem entregue o caminho** no enunciado — tarefa artificial não testa nada.
- Não **teste com participantes errados** nem **tarde demais** — invalida o achado; corrigir cedo é mais barato.
- Não trate **5 sessões como prova estatística** nem **conte problemas em vez de pesar severidade**.
- Não **saia sem recomendação e próximo passo** — relatório gigante sem decisão falhou; pior que não testar é testar mal e achar que validou.

## 6. Relação com outros arquivos

- **Quando teste de usabilidade é o método certo** → `01`.
- **Posiciona o teste no Deliver/validação e em ciclos** → `02`.
- **Teste ≠ entrevista (comportamento vs percepção); condução sem viés** → `03`.
- **Transformar observações em achados e recomendações (síntese)** → `04`.
- **Navegação, busca, labels; tree testing (sem UI) ↔ teste (com UI)** → `05`.
- **Hipóteses e protótipos que serão testados aqui** → `06`.
- **Taxa de sucesso, tempo, taxa de erro, SUS, satisfação: definição e benchmark** → dono é `08`.
- **Teste aplicado a PDP, carrinho, checkout, busca/filtros** → `09`.
- **Testes com pessoas com deficiência e tecnologias assistivas** → dono é `10`.
- **Recrutamento, consentimento, repositório e cadência** → `11`.
- **Tipos de teste (moderado/formativo/quali); severidade (escala canônica aqui)** → `_GLOSSARY §4` e §5.

## 7. Fontes principais

- **Usability Testing 101 — NN/g** — o método observacional e sua condução.
- **Severity Ratings for Usability Problems — NN/g** — a escala de severidade.
- **Using moderated usability testing — GOV.UK Service Manual** — condução moderada em contexto institucional.

Demais fontes (NN/g: 5 Users, Success Rate, Task Scenarios, Thinking Aloud; Digital.gov) → `_SOURCES.md`.

→ Aprofundamento: expanded/07_USABILITY_EXPANDED.md


═══════════════════════════════════════════════════
  08_METRICS
═══════════════════════════════════════════════════

# 08_METRICS — CORE

## 1. Para que serve

Dono do tema **métricas de UX**: definir, escolher, interpretar e acompanhar indicadores de experiência de forma útil para **decisão** — não para dashboard bonito. Conecta **objetivo → sinal → métrica → fonte → ação**.

Princípio que manda em tudo: **métrica boa muda decisão.** Métrica que não muda nada é decoração com número. Número não é insight — é pista; insight é a interpretação rastreável que explica o que ele sugere. (vocabulário dado/métrica/sinal/KPI/vaidade/baseline → `_GLOSSARY §2`)

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Comparar antes/depois (redesign), acompanhar saúde do produto, detectar regressão, priorizar melhoria.
- Defender decisão de UX com evidência; conectar UX a produto e negócio.

**Quando NÃO usar como resposta principal:**
- Você ainda **não entende o problema** ou a pergunta é **"por quê?"** → quali (teste, entrevista).
- **Sem baseline**, sem tráfego suficiente, ou **amostra pequena** tratada como inferência.
- Instrumentação ruim → número fraco parece científico e convence igual, errado.
- Número só para **justificar decisão já tomada**.

## 3. Processo operacional

**Tipos de métrica:** comportamental (o que faz — sucesso, abandono, retenção) · atitudinal/percebida (o que diz — satisfação, SUS, NPS) · performance de tarefa (sucesso, tempo, erro, first-click) · produto (ativação, adoção, churn, conversão) · negócio influenciada por UX (receita, custo de suporte) · técnica (Core Web Vitals). Comportamento é forte mas não explica causa; percepção precisa de cuidado (pessoa diz "fácil" com comportamento confuso).

**HEART** (Google — escolher o que medir sem medir tudo): **H**appiness · **E**ngagement · **A**doption · **R**etention · **T**ask Success. Não meça todas — só as dimensões relevantes ao objetivo.

**Goals → Signals → Metrics** (a lógica que evita "medir porque a ferramenta mostra"):
- **Goal** — objetivo qualitativo ("ajudar iniciante a escolher com confiança").
- **Signal** — comportamento/percepção que indicaria progresso ("escolhe produto adequado sem ajuda").
- **Metric** — forma mensurável do sinal ("taxa de sucesso na tarefa de escolha").

**Métricas de usabilidade** (definição dos termos → `_GLOSSARY §2`; aqui, o uso):
- **Taxa de sucesso** — % que concluiu (sucesso / parcial / falha). Interprete junto com observação — 80% sofrendo ainda é ruim.
- **Tempo na tarefa** — eficiência; menor nem sempre é melhor (decisão exige comparar).
- **Taxa de erro** — defina o que conta como erro **antes**.
- **Satisfação pós-tarefa / SEQ** — cruze com comportamento (concluiu rápido mas inseguro?).
- Percebidas: **SUS** (percepção geral, comparar versões) · **SEQ** (facilidade de 1 tarefa) · **NPS** (recomendação — não é usabilidade) · **CSAT** (satisfação pontual) · **CES** (esforço). "NPS subiu" não prova fluxo mais usável.

**Funil** — avanço por etapa (categoria→PDP→carrinho→checkout→compra). Mostra **onde** investigar, não **por que** a pessoa saiu.

**Analytics** mostra comportamento em escala (onde abandonam, zero results, caminhos) — **não** o porquê, se entendeu, se confiou. Heatmap mostra clique, não intenção.

**Benchmarking** — medir de forma **repetível** contra referência (versão anterior, concorrente, meta). Exige consistência: mudar tarefa/público/método a cada rodada faz a comparação perder força. Registre **baseline** antes de mudar.

**Core Web Vitals** (técnico que afeta UX): **LCP** (carregamento) · **INP** (responsividade) · **CLS** (estabilidade visual). Site rápido pode ser confuso; lento e instável já começa perdendo.

**Escolher a métrica certa** (nasce da decisão, não do dashboard): decisão → objetivo → risco → dimensão → sinal → métrica → fonte → baseline → meta/direção → ação prevista.

**Vaidade** — parece boa, não muda decisão (pageviews, tempo na página sem tarefa, NPS como usabilidade, downloads sem uso). Pergunta matadora: **se essa métrica subir ou cair, o que faremos diferente?** Se "não sei", é vaidade.

## 4. Checklist

Antes de coletar qualquer métrica:

- [ ] Qual **decisão** essa métrica apoia? (se "não sei", não colete)
- [ ] Qual **objetivo** e **sinal** ela mede (Goal→Signal→Metric)?
- [ ] Há **baseline** e **fonte** confiável (instrumentação)?
- [ ] É **comportamental ou percebida** — e estou cruzando as duas?
- [ ] A **amostra** sustenta a conclusão (sinal quali ≠ estatística)?
- [ ] A métrica termina em **ação/investigação**, não em "interessante"?

## 5. Erros comuns

- Não **meça tudo** nem escolha métrica porque a ferramenta mostra — comece pela decisão.
- Não trate **número de estudo qualitativo** como estatística ("3 de 5" ≠ "60% dos usuários").
- Não use **conversão como única métrica de UX** nem **NPS como usabilidade** — sofrem influência externa.
- Não **compare períodos incomparáveis** nem use **média sem distribuição**; sem baseline não há "melhorou".
- Não **otimize uma métrica piorando a experiência** — nem tudo que aumenta uso melhora UX.

## 6. Relação com outros arquivos

- **Vocabulário dado/métrica/sinal/KPI/vaidade/baseline** → `_GLOSSARY §2`.
- **Quando medir é o método certo** → `01`.
- **Outcome/métrica-alvo do discovery; medição pós-lançamento** → `02`.
- **Métricas penduradas na jornada** → `04`.
- **Taxa de sucesso/first-click/tree success da AI; busca interna** → `05`.
- **Métricas de teste de usabilidade (sucesso, tempo, erro); severidade é dono lá** → `07`.
- **Como medir se a hipótese de ideação funcionou** → `06`.
- **Funil de compra, métricas de PDP/checkout/conversão** → `09`.
- **Métricas de acessibilidade (WCAG por severidade, sucesso com tecnologia assistiva)** → `10`.
- **Instrumentação, repositório e cadência de medição** → `11`.

## 7. Fontes principais

- **The HEART Framework / Measuring UX at Large Scale (Google, Rodden)** — HEART + Goals-Signals-Metrics.
- **Success Rate & Measuring Perceived Usability (SUS/SEQ) — NN/g** — métricas clássicas de usabilidade.
- **Benchmarking UX — NN/g** — medir de forma repetível contra referência.

Demais fontes (NN/g: NPS, Quant UX Glossary, True Score; Core Web Vitals / web.dev) → `_SOURCES.md`.

→ Aprofundamento: expanded/08_METRICS_EXPANDED.md


═══════════════════════════════════════════════════
  09_ECOMMERCE
═══════════════════════════════════════════════════

# 09_ECOMMERCE — CORE

## 1. Para que serve

Dono do tema **UX Research em e-commerce**: pesquisar, diagnosticar, validar e melhorar lojas virtuais — descoberta, busca, filtros, categorias, página de produto, carrinho, checkout, mobile, confiança e pós-compra. Arquivo **vertical**: aplica os métodos gerais da base no contexto onde a decisão do usuário é **compra**.

Princípio que manda em tudo: **e-commerce bom reduz risco percebido e aumenta clareza de decisão.** Conversão é resultado, não foco — a pesquisa entende o que acontece antes: como chega, procura, compara, confia e decide.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Loja virtual, marketplace, catálogo, fluxo de compra, PDP, checkout; migração de site institucional → e-commerce.
- Diagnosticar onde o funil cai e por quê (microdecisões: encontrar → entender → confiar → escolher → comprar).

**Quando NÃO confundir / NÃO fazer:**
- **UX ≠ CRO ≠ UI** — UX research **melhora a qualidade das hipóteses de CRO** (testa mudança porque viu problema, não por palpite); não embeleza fluxo quebrado.
- Não **copiar concorrente cego** — padrão comum não é prova de qualidade; benchmark gera hipótese, não decisão.
- Não tratar **PDP como catálogo técnico** — especificação sem tradução não decide.
- Não confundir **tráfego ruim / preço alto** com problema de interface.

## 3. Processo operacional

**Jornada de compra** (cadeia): descoberta → exploração → busca/navegação → listagem → PDP → comparação → carrinho → checkout → pagamento → confirmação → entrega → pós-compra → recompra. Identifique **quais etapas são críticas** para *este* negócio — nem todo e-commerce tem o mesmo gargalo.

**Levante os dados internos antes** de entrevistar/desenhar: analytics/funil, busca interna (termos, zero results), atendimento (dúvidas/objeções), vendas/estoque, devoluções (motivos), reviews. Research bom não finge que a empresa não sabe nada.

**Áreas-chave a pesquisar:**
- **Home** — orienta o próximo passo (top tasks, busca visível, proposta clara), não mostra tudo.
- **Categorias / busca / filtros** — refletem como o usuário procura, não o estoque. Estrutura, taxonomia e facetas → dono é `05`. Filtro bom nasce da decisão do usuário; busca precisa dos termos reais (sinônimos, erro de digitação, zero results com alternativa).
- **PDP** — responde as dúvidas de decisão; **traduz técnica em uso** ("eletroacústico" → "toca com ou sem amplificador"), mostra "ideal para", preço/frete/prazo, garantia, prova social, variações.
- **Carrinho** — revisão clara: itens, custo total, frete, editar. Sem custo surpresa.
- **Checkout** — a intenção encontra a fricção; o trabalho é **não atrapalhar**: sem cadastro forçado cedo, campos mínimos, erro que ajuda a corrigir, sem frete surpresa, recuperação de falha.
- **Mobile** — não é desktop menor: filtros acessíveis, CTA visível, teclado certo, performance. Fricção pequena vira abandono grande.
- **Confiança / risco percebido** — construída em cada etapa (avaliações, garantia, política de troca visível, transparência de preço, checkout seguro), não bloco no rodapé.
- **Pós-compra** — confirmação, rastreio, troca/devolução, suporte. Falha aqui mata recompra.

**Custo total** (preço + frete + prazo + parcelamento): apareça **cedo**. Custo escondido é convite ao abandono.

**Funil de compra** — define onde investigar, não por que a pessoa saiu. Métrica/evento/funil são dono de `08`; aqui, a aplicação ao funil de compra (view_product → add_to_cart → begin_checkout → add_shipping → add_payment → purchase).

**Produto técnico / decisão complexa** exige UX educativa: guia de escolha, comparador, glossário, "ideal para / não recomendado para". Quem entende demais do produto esquece como é não entender.

## 4. Checklist

Auditoria UX de e-commerce (por área):

- [ ] **Descoberta:** entende o que a loja vende? categorias claras? busca visível? caminho p/ iniciante e experiente?
- [ ] **Busca/filtros:** sinônimos e erro de digitação? zero results com alternativa? filtros ajudam decisão, com label claro, removíveis, usáveis no mobile?
- [ ] **Listagem:** cards dão informação p/ decidir o próximo clique? preço e disponibilidade claros? indisponível tratado?
- [ ] **PDP:** specs traduzidas em benefício? "ideal para"? preço/frete/prazo, garantia/troca, prova social, variações claras? CTA claro?
- [ ] **Carrinho/checkout:** revisão e custo total? frete não surpreende? cadastro não é barreira? erros ajudam? pagamento confiável e recuperável?
- [ ] **Pós-compra:** confirmação, rastreio, troca/devolução e suporte encontráveis?

## 5. Erros comuns

- Não **foque só em conversão** nem teste botão antes de entender a **decisão de compra**.
- Não **esconda frete e prazo** — abandono clássico no custo surpresa.
- Não use **filtros baseados no banco** em vez do critério do usuário; não ignore a **busca interna**.
- Não **teste só desktop** nem **avalie checkout só visualmente** — meça erro por campo e teste no mobile real.
- Não **separe institucional e e-commerce** — confiança e compra andam juntas; ignore o pós-compra por sua conta e risco.

## 6. Relação com outros arquivos

- **Escolher método para cada pergunta de e-commerce** → `01`.
- **Começo do projeto, separar problema de solução** → `02`.
- **Entrevistas sobre decisão de compra, confiança, contexto** → `03`.
- **Jornada de compra, oportunidades, recomendações (síntese)** → `04`.
- **Categorias, busca, filtros, taxonomia, labels** → dono é `05`.
- **Oportunidades → hipóteses e protótipos** → `06`.
- **Validar PDP, carrinho, checkout, navegação** → `07`.
- **Eventos, funil, métricas e conversão (definição)** → dono é `08`.
- **Compra possível para mais pessoas (acessibilidade)** → `10`.
- **Cadência de pesquisa, recrutamento, repositório** → `11`.

## 7. Fontes principais

- **Baymard Institute — Ecommerce UX Research & Guidelines** — PDP, listagem/filtros, busca, carrinho/checkout, mobile.
- **NN/g — Ecommerce UX Research Reports** — product pages, search, carts/checkout/registration.
- **Google Search Central / Merchant Center — Product structured data** — dados estruturados de produto (descoberta).

Demais fontes (Baymard por tema; NN/g shopping cart, mobile checkout) → `_SOURCES.md`.

→ Aprofundamento: expanded/09_ECOMMERCE_EXPANDED.md


═══════════════════════════════════════════════════
  10_ACCESSIBILITY
═══════════════════════════════════════════════════

# 10_ACCESSIBILITY — CORE

## 1. Para que serve

Dono do tema **acessibilidade como parte da experiência**: incluir a11y na pesquisa, avaliação, validação e melhoria contínua — do discovery ao monitoramento. Foco em **remover barreiras reais para pessoas reais**, combinando padrão técnico (WCAG), avaliação manual, ferramenta, teste com usuários e decisão de produto. Não é "passar em checklist".

Princípio que manda em tudo: **acessibilidade não é etapa final; é critério de qualidade desde o começo.** Se uma pessoa não consegue usar, não é "problema técnico" — é falha de UX. (usabilidade ≠ acessibilidade → `_GLOSSARY §6`)

## 2. Quando usar / Quando NÃO usar

**Quando usar:** sempre, e cedo — discovery, AI, conteúdo, protótipo, design system, dev, pré e pós-lançamento. A11y tardia custa mais (refazer estrutura, componente, conteúdo, comportamento).

**Quando NÃO reduzir a:**
- **Só ferramenta automática** — detecta contraste/label/ARIA ausente, mas não avalia compreensão, fluxo, qualidade do alt nem impacto real. É detector de fumaça, não o bombeiro.
- **Só compliance/checklist** — passar em critério técnico não garante usabilidade (fluxo pode cumprir WCAG e ainda ser confuso).
- **Recrutar 1 pessoa com deficiência e generalizar** — a11y é diversidade, não token.

## 3. Processo operacional

**WCAG (referência internacional) — 4 princípios (POUR):**
- **Perceptível** — alt text, legenda, contraste, não depender só de cor, texto redimensionável.
- **Operável** — navegação por teclado, foco visível, tempo suficiente, títulos/labels claros.
- **Compreensível** — linguagem clara, comportamento previsível, ajuda para erro.
- **Robusto** — HTML semântico; nome/função/estado de componentes; compatível com leitor de tela.
- Níveis: **A** (mínimo) · **AA** (meta comum de produto) · **AAA** (mais exigente, nem sempre aplicável). No Brasil/serviço público: **eMAG** como camada local complementar à WCAG.

**Combinar métodos — nenhum sozinho basta:** automático → manual → **teclado** → **leitor de tela / tecnologia assistiva** → **teste com pessoas reais** → relatório priorizado → correção → **reteste**. Automação acha o fácil de testar, não necessariamente o que mais impede o uso.

**Pesquisar com pessoas com deficiência:**
- Recrute pela **diversidade real** (leitor de tela, baixa visão, daltonismo, surdez, motora, cognitiva/neurodivergência, idoso, limitação temporária/situacional).
- Pergunte **"o que você precisa para participar confortavelmente?"** — não "qual sua deficiência?". Deixe a pessoa usar a **configuração habitual**; não desligue adaptações; dê tempo; registre **impacto na tarefa**, não só critério técnico.

**Áreas de barreira a avaliar:** teclado (foco visível e em ordem, modal gerencia foco) · leitor de tela (nome/função/estado, alt útil, erro anunciado) · baixa visão/zoom/contraste (200% sem quebrar, não depender de cor) · auditiva (legenda, transcrição, alternativa visual a som) · motora (alvo de toque, sem hover/drag obrigatório, sem timeout curto) · cognição/linguagem (clareza, previsibilidade, progresso, jargão explicado).

**Severidade de a11y** (recorte do `07`; classifique por **impacto na tarefa**, não só violação):
- **Crítica** (bloqueia tarefa essencial p/ um grupo — ex.: checkout impossível por teclado) → antes de lançar.
- **Alta** (erro/perda/esforço grande) · **Média** (fricção com contorno) · **Baixa** (melhoria) · **Observação**.
- Problema em **componente reutilizável** tem severidade maior — multiplica em dezenas de telas. Design system escala a11y **ou** escala o problema.

## 4. Checklist

**Easy Checks** (W3C/WAI — triagem inicial, não certificado): título da página · headings · contraste · redimensionar texto · navegação por teclado · foco visível · links descritivos · labels · alt text · multimídia · movimento/animação.

**Ciclo de pesquisa:**
- **Antes:** objetivo + fluxos críticos · critérios WCAG relevantes · perfis e tecnologia assistiva · acomodações perguntadas · consentimento · ambiente testado.
- **Durante:** configuração habitual do participante · não induzir · registrar barreira **com impacto** · respeitar a tecnologia e o desconforto.
- **Depois:** agrupar problemas · severidade · relacionar a WCAG · descrever impacto na tarefa · recomendações + responsáveis · **reteste** · registrar padrão no design system.

## 5. Erros comuns

- Não trate a11y como **checklist final** nem rode **só ferramenta automática** — teste teclado e pessoas reais.
- Não **indique erro só por cor**, **use placeholder como label**, nem **esconda o foco** — quebram leitor de tela e baixa visão.
- Não **crie componente customizado inacessível** nem **use ARIA sem necessidade** — semântica nativa primeiro.
- Não **recrute uma pessoa e generalize** nem trate participante com deficiência como "caso especial".
- Não **corrija tela por tela esquecendo o design system** nem pule o **reteste** — sem padrão documentado, a regressão volta.

## 6. Relação com outros arquivos

- **Escolher método para avaliar a11y** → `01`.
- **A11y desde a descoberta (não excluir no início)** → `02`.
- **Pesquisa com pessoas, condução sem viés, consentimento** → `03` (LGPD/consentimento é `11`).
- **Barreiras viram achados e oportunidades (síntese)** → `04`.
- **Navegação, labels, estrutura e busca acessíveis** → `05`.
- **A11y como critério de ideação e priorização** → `06`.
- **Teste de usabilidade com tarefas; severidade geral** → dono é `07` (este arquivo é o recorte a11y).
- **Métricas de a11y (WCAG por severidade, sucesso com tecnologia assistiva)** → `08`.
- **Compra acessível: busca, filtros, PDP, carrinho, checkout** → `09`.
- **Recrutamento, consentimento, repositório, governança** → `11`.
- **Usabilidade ≠ acessibilidade** → `_GLOSSARY §6`.

## 7. Fontes principais

- **WCAG 2.2 — W3C** — os 4 princípios (POUR), critérios e níveis A/AA/AAA.
- **Easy Checks / Evaluating Web Accessibility — W3C WAI** — triagem preliminar e abordagens de avaliação.
- **Making your service accessible — GOV.UK Service Manual** — a11y no processo, pesquisa com pessoas com deficiência.

Demais fontes (WAI Quick Ref, WCAG-EM, eMAG, Digital.gov, USWDS, Microsoft Inclusive Design, NN/g) → `_SOURCES.md`.

→ Aprofundamento: expanded/10_ACCESSIBILITY_EXPANDED.md


═══════════════════════════════════════════════════
  11_RESEARCHOPS
═══════════════════════════════════════════════════

# 11_RESEARCHOPS — CORE

## 1. Para que serve

Dono do tema **ResearchOps**: a operação que sustenta a pesquisa — recrutamento, **consentimento, privacidade/LGPD**, **intake**, templates, **repositório** e disseminação de aprendizados. É a infraestrutura que impede a pesquisa de depender só de memória, boa vontade e improviso.

Princípio que manda em tudo: **ResearchOps existe para aumentar a qualidade e o impacto da pesquisa, não para criar processo por processo.** ResearchOps bom remove atrito e aumenta confiança; ruim é burocracia premium.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Pesquisa **recorrente**, time crescendo, "cada squad pesquisa de um jeito".
- Insights se perdem ("a gente já pesquisou, mas ninguém acha"); risco de privacidade; democratização sem critério.

**Quando NÃO exagerar:**
- Pesquisa pontual sobrevive sem muita operação — não monte estrutura gigante de saída.
- Não **crie processo antes de entender a dor** nem **comece pela ferramenta** (ferramenta sem processo só acelera bagunça).
- Não burocratize a ponto de ninguém pesquisar.

## 3. Processo operacional

Fluxo: demanda → **intake** → priorização → plano → recrutamento → **consentimento** → sessões → síntese → **repositório** → playback → decisão → impacto.

**Intake** (a entrada — sem ele, vira balcão: todo pedido vira estudo). A pergunta que decide tudo: **"Que decisão será tomada com esta pesquisa?"** Se ninguém responde, a demanda não está pronta. Campos-chave: solicitante · contexto · decisão · pergunta de pesquisa · risco (valor/usabilidade/viabilidade/negócio) · público · prazo · evidência já existente · dono da decisão.

**Recrutamento e participantes** (`03`/`07`/`10` dependem disto): critério de recrutamento claro — participante errado gera evidência errada. **Screener** pergunta comportamento passado concreto ("há quanto tempo usa X?"), não autoavaliação ("você é iniciante?") nem intenção futura; não entregar o perfil desejado. Painel mínimo: armazene **só o necessário** (dado demais = risco), com controle de frequência (não reconvidar sempre os mesmos) e opt-out. **Incentivo compensa participação, não compra opinião** — claro e sem coerção.

**Consentimento informado** (delegado por `03`/`07`/`10` — base ética de tudo). Obtido **antes** de qualquer nota/gravação. Deve cobrir: objetivo · o que o participante fará · **gravação** · tipos de dado coletados · uso e **quem terá acesso** · confidencialidade/anonimização · incentivo · **direito de desistir** · prazo de retenção · autorização para **observadores** e para **uso de trechos**. Consentimento ≠ assinatura: exige linguagem simples e possibilidade real de recusa. **Reconfirmar quando o escopo mudar.** Menores: consentimento do responsável + assentimento da criança.

**Privacidade e LGPD** (dono): coletar o **mínimo**, explicar finalidade, registrar base adequada, **acesso restrito**, anonimizar quando possível, **retenção definida** (não guardar gravação para sempre), permitir exclusão, proteger gravações, **não reusar para outra finalidade** sem permissão. No Brasil a **LGPD** regula o tratamento — prever coleta, finalidade, retenção, descarte e direitos do titular. Não substitui jurídico; serve para o time de UX não operar no escuro. Privacidade não é formulário no rodapé — é cadeia de decisões.

**Research repository** (dono): sistema de conhecimento **com governança**, não pasta no drive. Serve para achar pesquisa antiga, evitar duplicidade, reutilizar evidência, preservar memória. **Taxonomia/tags** consistentes (produto · jornada · método · tema · perfil · status ativo/arquivado/superado · força da evidência) com **dono da taxonomia** e revisão periódica. Mantém **rastreabilidade**: insight → evidência → fonte → decisão → resultado (cadeia em `_GLOSSARY §1`). Não entram sem cuidado: dado pessoal desnecessário, gravação sem consentimento, achado sem evidência.

**Observadores/stakeholders:** informar o participante (e permitir recusa), manter em silêncio, debrief **depois**, não durante. Stakeholder vendo pesquisa é ótimo; interferindo é desastre.

**Democratização com guardrails:** não-pesquisadores podem observar, anotar, recrutar simples e ajudar na síntese — com treinamento, templates aprovados, roteiro revisado e supervisão de UXR. Sem isso vira "achismo com usuário real, só que agora gravado". Pesquisa sensível/complexa fica com especialista.

## 4. Checklist

**ResearchOps mínimo viável** (time pequeno ou sem cultura de pesquisa — comece pelo maior gargalo, não monte tudo):

- [ ] **Consentimento padrão** pronto (1º passo — destrava ética).
- [ ] Templates básicos: **plano de pesquisa, roteiro, screener**.
- [ ] **Repositório** organizado + taxonomia simples (poucas tags).
- [ ] **Planilha de participantes** com consentimento e regra de **retenção**.
- [ ] **Intake** mínimo (qual decisão? qual risco?).
- [ ] **Playback** curto recorrente + **registro de decisões** (pesquisa que não vira decisão é custo).

> Em contexto sem cultura de pesquisa / output acima de validação, combine este mínimo com o playbook de UX sob restrição → `14`.

## 5. Erros comuns

- Não **crie processo antes de entender a dor** nem comece pela ferramenta.
- Não **guarde gravação para sempre** nem deixe de **registrar consentimento** — risco ético e legal.
- Não **democratize sem treinamento** — vira achismo gravado.
- Não trate o **repositório como pasta** (sem taxonomia/dono vira cemitério de PDF) nem deixe estudo obsoleto sem arquivar.
- Não **deixe de medir impacto** — ResearchOps que não mede nada vira sensação de organização.

## 6. Relação com outros arquivos

- **Consentimento, gravação e privacidade na condução de entrevista** → usados por `03` (mecânica e base legal são daqui).
- **Consentimento e dados em teste de usabilidade** → `07` aponta pra cá.
- **Consentimento, recrutamento e governança em pesquisa com pessoas com deficiência** → `10` aponta pra cá.
- **Rastreabilidade insight→evidência→decisão; repositório de evidências** → cadeia em `_GLOSSARY §1`; síntese é `04`.
- **Intake usa a lente de risco do discovery** → `02`.
- **Templates de plano/screener/consentimento** → `templates/`.
- **Métricas de ResearchOps (operacional/qualidade/impacto)** → conceito de métrica é `08`.
- **ResearchOps mínimo em time sem cultura de pesquisa** → `14`.

## 7. Fontes principais

- **ResearchOps 101 / Study Guide — NN/g** — o que é e como estruturar a operação.
- **The Eight Pillars of User Research — ResearchOps Community** — pilares para diagnosticar a operação.
- **Getting users' consent / Managing research data and participant privacy — GOV.UK Service Manual** — consentimento e privacidade no processo.

Demais fontes (NN/g consent/minors/repositories; LGPD/ANPD; Dovetail, Maze, ResearchOps Brasil) → `_SOURCES.md`.

→ Aprofundamento: expanded/11_RESEARCHOPS_EXPANDED.md


═══════════════════════════════════════════════════
  12_AI_PRODUCT_UX
═══════════════════════════════════════════════════

# 12_AI_PRODUCT_UX — CORE

## 1. Para que serve

Dono do tema **UX para produtos com Inteligência Artificial (IA)**: pesquisar, projetar, validar e medir experiências com sistemas **probabilísticos** — IA generativa, recomendação, classificação, chatbot, copiloto, busca semântica, automação e agentes. Foco em experiências úteis, compreensíveis, **controláveis**, seguras e confiáveis. (sigla: IA = Inteligência Artificial; AI = Arquitetura da Informação → `05`)

Princípio que manda em tudo: **IA é meio, não estratégia.** Se a IA não reduz risco, esforço ou complexidade do usuário, provavelmente é só glitter caro. IA ruim transfere a complexidade para o usuário numa interface mais mágica e menos previsível.

## 2. Quando usar / Quando NÃO usar

**Quando faz sentido** — a pergunta certa não é "onde usar IA?", é: *qual tarefa do usuário está difícil/cara/lenta/incerta, e a IA reduz isso melhor que uma solução simples?* Boa para problema probabilístico, interpretativo ou repetitivo (resumir, classificar, recomendar, gerar rascunho, responder sobre base, extrair dados).

**Quando NÃO usar:**
- **Regra simples, busca/filtro/taxonomia** resolvem (`05`) — muita IA é UI fugindo de resolver arquitetura.
- Usuário precisa de **resposta exata e auditável**; erro de **alto impacto sem supervisão**; **sem dados adequados**.
- Problema ainda indefinido; IA por **marketing**; troca de interface clara por **caixa preta**; latência mata a tarefa.

## 3. Processo operacional

**Determinístico vs probabilístico** — software tradicional: mesmo input → mesmo output. IA generativa: mesmo input pode gerar resposta diferente, com qualidade variável, exigindo avaliação e correção. **Desenhar para IA assume falha como requisito**, não pessimismo.

**Interação Humano-IA** (Microsoft HAX / Google PAIR): deixar claro **o que a IA faz e o que não faz** · informar **quando é IA** · ajustar expectativa (sem promessa ampla tipo "resolve tudo") · permitir **correção, controle e desfazer** · não fingir certeza · não substituir julgamento humano em decisão crítica sem supervisão.

**Confiança calibrada** (conceito-dono): o usuário confia **na medida certa** — confia quando o sistema é competente, verifica quando há incerteza, sabe quando assumir controle.
- **Overtrust** (aceita erro sem verificar) e **undertrust** (rejeita ajuda útil) são os dois extremos; um erro crítico causa *trust collapse*.
- Calibrar: mostrar **fonte/evidência**, mostrar **incerteza** quando útil, explicar limites, dar controle e reversão, **pedir confirmação em ação crítica**, fazer a IA **admitir incerteza**, evitar tom confiante e antropomorfismo. Dizer que algo é "feito com IA" informa a tecnologia, não prova valor.

**Transparência e explicabilidade** (conceito-dono): explicar capacidade ("posso resumir docs"), **limite** ("posso errar detalhes; revise"), **fonte** ("baseado nos docs A e B"), critério ("recomendado porque..."), incerteza ("não encontrei evidência suficiente"). A melhor explicação ajuda o usuário a **decidir o que fazer com a saída**. Fontes/rastreabilidade são críticas em saúde/jurídico/financeiro, compra cara, produto técnico — diferencie **citação de inferência**; sem rastreabilidade, IA vira máquina de confiança falsa.

**Fallback** (conceito-dono — falhar bem é das partes mais importantes): bom fallback **explica o problema, não culpa o usuário, oferece próximo passo, preserva o trabalho, permite tentar de novo, oferece alternativa manual, escala para humano** e **não inventa resposta para parecer útil**. ❌ "Não foi possível." ✅ "Não encontrei nos documentos disponíveis. Você pode enviar outro arquivo, reformular ou escolher uma fonte."

**Controle do usuário** — quanto mais autonomia a IA tem, mais controle a pessoa precisa: aceitar/rejeitar/editar/regenerar/comparar/desfazer/aprovar antes de executar. Controle ruim = sensação de aprisionamento.

**Agentes e human-in-the-loop** — agente planeja e executa ações: deixe o **plano visível**, peça **permissão para ações críticas** (enviar/comprar/apagar), limite escopo, registre logs, permita interromper e desfazer. Mantenha humano no loop quando o erro tem impacto, a decisão é sensível ou difícil de desfazer — **sem jogar toda a revisão no usuário** (se precisa revisar tudo do zero, a IA não está ajudando).

**Prototipar sem IA real** — Wizard of Oz (humano simula), fake door, output estático, modelo simples. Teste o **risco principal** (geralmente confiança/controle), não gaste semanas treinando modelo para descobrir que ninguém quer delegar.

**Privacidade e segurança** entram na experiência: comunicar que dados são usados/salvos/treinam modelo; minimização; não inserir dado sensível; moderação e recusa **bem desenhada** (protege e redireciona, não hostil).

## 4. Checklist

**Antes de construir:** problema claro? IA melhor que solução simples? dados adequados? erro aceitável? usuário terá controle? precisa de fonte? existe fallback? privacidade e acessibilidade consideradas? como medir sucesso?

**No design:** capacidades e limites claros? usuário sabe que é IA? input guiado? output revisável com fonte? incerteza comunicada? pode corrigir e desfazer? ação crítica pede confirmação? erro tem fallback útil?

**Antes/depois de lançar:** teste de usabilidade (`07`) + avaliação de qualidade do output + teste adversarial (red teaming) + logs/monitoramento; depois, acompanhar **overtrust/undertrust**, erro e feedback. Produto com IA não fica "pronto" — modelo, dados e contexto mudam.

> **Métricas com cuidado** (`08`): alta aceitação pode ser qualidade **ou** confiança cega; baixa edição pode ser output bom **ou** usuário sem capacidade de revisar. Interprete com pesquisa.

## 5. Erros comuns

- Não use **IA sem problema claro** nem como argumento de marketing — IA é valor, não enfeite.
- Não **prometa demais** ("resolve tudo") nem **esconda que é IA** nem use tom humano que cria falsa expectativa.
- Não deixe de **mostrar fonte, comunicar limite e planejar erro/fallback** — sem isso o usuário trabalha mais para saber se pode confiar.
- Não **automatize decisão sensível sem supervisão** nem jogue a **revisão inteira no usuário**.
- Não **meça só adoção** ignorando confiança, qualidade, segurança e correção; não ignore privacidade nem acessibilidade (`10`).

## 6. Relação com outros arquivos

- **Decidir se IA resolve o problema (discovery, risco)** → `02`.
- **Quando busca/filtro/taxonomia resolvem melhor que IA; sigla AI** → `05`.
- **Pesquisa e teste de produtos com IA (Wizard of Oz, usabilidade)** → `01`, `03`, `07`.
- **Hipótese de solução com IA** → `06`.
- **Métricas de IA (aceitação, edição, qualidade); interpretação** → `08`.
- **IA em e-commerce (busca, recomendação, chatbot) respeitando preço/estoque** → `09`.
- **Acessibilidade da interface e do output de IA** → `10`.
- **Governança, consentimento e privacidade de dados de pesquisa** → `11`.

## 7. Fontes principais

- **People + AI Guidebook — Google PAIR** — desenhar experiências humano-IA confiáveis.
- **HAX Toolkit / Guidelines for Human-AI Interaction — Microsoft** — diretrizes por fase da interação.
- **AI Risk Management Framework — NIST** — mapear, medir e governar risco de IA.

Demais fontes (OECD AI Principles; OpenAI/Anthropic safety; W3C WAI AI & Accessibility; NN/g AI) → `_SOURCES.md`.

→ Aprofundamento: expanded/12_AI_PRODUCT_UX_EXPANDED.md


═══════════════════════════════════════════════════
  14_UX_SEM_PESQUISA_FORMAL
═══════════════════════════════════════════════════

# 14_UX_SEM_PESQUISA_FORMAL — CORE

## 1. Para que serve

Playbook para o contexto real onde a gestão prioriza **output** (fábrica de features), **veta pesquisa formal** (sem entrevista/survey estruturado) e o trabalho acontece **sobre um design system pronto** (ex.: AdminLTE), onde telas novas entram por cima. Toda a base pressupõe acesso a usuário e tempo de pesquisa que este contexto não tem — este arquivo é a **ponte**: como fazer UX defensável sem poder pesquisar formalmente. Dono do conceito **proxies de evidência** (`_GLOSSARY §5`).

Princípio que manda em tudo: **sem pesquisa formal não é sem evidência — é evidência indireta + rigor explícito sobre o que é suposição.** O que muda não é o critério, é a fonte.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Há **veto a pesquisa formal**, pressão de prazo, ou design system pronto que limita o que dá para mudar.
- Você precisa **defender uma decisão de UX** sem poder citar entrevista/teste.

**Quando NÃO usar (não vire desculpa):**
- **Não use a ausência de pesquisa formal para pular a evidência que JÁ existe** — analytics, busca interna e atendimento já estão no prédio.
- Não invoque o "contexto restrito" para **decisão de alto risco e irreversível** — aí vale brigar por uma validação mínima.
- Não trate como permissão para desenhar no escuro: proxy é evidência **indireta**, não achismo com crachá.

## 3. Processo operacional

**Esgote as fontes de evidência indireta** (nenhuma exige pesquisa formal):
- **Analytics / comportamento** — funil, drop-off, caminhos, páginas, dispositivos. Onde travam, não por quê. (métrica → `08`)
- **Busca interna** — termos reais, zero results, refinamentos: a linguagem e as lacunas do usuário, de graça.
- **Tickets de suporte / atendimento** — dúvidas e objeções recorrentes = problemas de UX já reportados.
- **Reclamações, devoluções e reviews** — onde a experiência quebrou na prática.
- **Dados de venda / operação** — o que é usado, ignorado, abandonado.
- **Avaliação heurística (Nielsen, 10 heurísticas)** — especialista acha problema **sem usuário**; achado é hipótese de especialista, não verdade do usuário. (catálogo → `01`)
- **Benchmark** — como referências resolvem o mesmo fluxo; gera hipótese, não decisão.
- **Revisão de especialista / par** — segunda opinião estruturada contra princípios.

**Marque evidência vs suposição — explicitamente, em toda entrega.** Rastreabilidade honesta: cada recomendação leva um rótulo — *"dado de suporte (forte)"*, *"heurística (médio)"*, *"suposição minha (a validar)"*. Recomendação sem rótulo vira opinião disfarçada de fato. Isto **é** o rigor que substitui a pesquisa formal.

**Trabalhar sobre design system pronto** (AdminLTE etc.): respeite o padrão existente, **proponha por cima** (microcopy, hierarquia, ordem de campos, estados, feedback, agrupamento), **não refaça a estrutura sem mandato**. Mudança que respeita o DS é barata, reversível e aprovável; refatorar o DS sem autorização queima capital político e raramente passa.

**Transforme "achismo do gestor" em hipótese barata e testável** sem pesquisa formal: reformule o palpite como *"se [mudança], então [proxy de comportamento] melhora"*, e meça pelo proxy que já existe (evento de analytics, ticket, taxa de erro de formulário). A disputa sai do "eu acho × você acha" e vira "vamos olhar o número depois". Prefira mudanças **reversíveis** — barato testar, barato desfazer.

## 4. Checklist

Antes de entregar sem pesquisa formal:

- [ ] **Esgotei a evidência que JÁ existe** (analytics, busca interna, suporte, vendas, reviews)?
- [ ] **Marquei o que é suposição** vs evidência em cada recomendação (com força da fonte)?
- [ ] Apliquei **heurística/benchmark** onde não havia dado?
- [ ] A decisão é **reversível** (ou de baixo risco)? Se for irreversível e arriscada, pedi validação mínima?
- [ ] Respeitei o **design system** (propus por cima, não refiz a estrutura)?
- [ ] Defini o **proxy de sucesso** — como saberei depois se deu certo (qual número/sinal olhar)?

## 5. Erros comuns

- Não trate **ausência de pesquisa como ausência de critério** — o critério continua; muda a fonte.
- Não **apresente suposição como fato** — rotular o que é palpite é o que torna a entrega defensável.
- Não **ignore analytics/suporte porque "não é pesquisa"** — é a evidência mais barata e já está disponível.
- Não **refaça o design system sem mandato** — proponha por cima; refatoração não pedida não passa e queima confiança.
- Não **entregue sem proxy de sucesso** — sem definir o que olhar depois, ninguém sabe se funcionou e a próxima decisão volta a ser por gosto.

## 6. Relação com outros arquivos

- **Lente de risco (reduzir o risco certo; viabilidade não é pesquisa de usuário)** → `02`.
- **Métodos leves no catálogo: heurística, benchmark, desk research, dados existentes** → `01`.
- **Proxies usam métricas/analytics/funil — definição e interpretação** → `08`.
- **ResearchOps mínimo viável (templates, consentimento, repositório enxuto)** → `11`.
- **Quando dá para rodar teste leve mesmo sem orçamento (poucos usuários, observação remota)** → `07`.
- **Discovery mínimo viável (desk, benchmark, dados existentes)** → `02`.
- **Proxy de evidência, evidência, validação** → definidos em `_GLOSSARY §5`.

## 7. Fontes principais

- **10 Usability Heuristics for User Interface Design — NN/g** — avaliação por especialista sem usuário.
- **When to Use Which UX Research Methods / métodos de baixo atrito — NN/g** — usar a evidência existente quando não se pode pesquisar.
- **GOV.UK Service Manual — User research em contexto ágil/restrito** — pesquisa leve e proporcional ao risco.

Demais fontes (Baymard como benchmark; analytics como proxy) → `_SOURCES.md`.

---

→ Relacionados: `02` (risco/discovery mínimo) · `01` (métodos leves) · `08` (proxies e métricas) · `11` (ResearchOps mínimo) · `_GLOSSARY §5` (proxy de evidência). Sem expanded: este CORE é autossuficiente.


═══════════════════════════════════════════════════
  15_DOCUMENTATION
═══════════════════════════════════════════════════

# 15_DOCUMENTATION — CORE

## 1. Para que serve

Dono do **ato de registrar**: o elo entre *fazer* pesquisa e *ter* pesquisa utilizável. Define **o quê, quando e em que formato** registrar — notas de sessão, formato de insight, log de hipótese, readout. Fica no meio do caminho que os outros arquivos não cobrem:

> **04 pensa · 15 escreve · 11 guarda.**
> (`04` = como pensar: dado → insight. `11` = o sistema de repositório: governança, taxonomia. `15` = o ato de escrever.)

Princípio que manda em tudo: **pesquisa não documentada é pesquisa que não aconteceu** — vira memória, e memória não escala nem se defende. Mas o corolário pesa igual: **documentação enxuta que se mantém > documentação completa que ninguém atualiza.** Não é manual de processo; é como registrar sem virar burocrata.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Depois de **toda** entrevista, teste ou sessão — e ao comunicar achados a quem decide.
- Quando um insight ou hipótese precisa sobreviver ao sprint, ao designer e ao esquecimento.

**Quando NÃO usar (não vire burocracia):**
- Não transforme registro em **documento pesado** por reflexo — o esforço de documentar é **proporcional ao risco da decisão**.
- Decisão pequena e reversível → recap de duas linhas. Relatório de 20 páginas que custa mais que a decisão que apoia é desperdício com capa.

## 3. Processo operacional

**Captura em sessão** (durante):
- **Cada pessoa anota separado** antes de comparar — evita groupthink (o primeiro a falar ancora o resto).
- Use a **ferramenta mais simples** que funcione; a fricção da ferramenta mata o registro.
- Separe **fala literal + comportamento** de **interpretação** — três colunas distintas, nunca misturadas.
- Organize **por problema**, não por participante (lista por pessoa esconde o padrão).

**Debrief pós-sessão:** resuma os achados **logo após**, enquanto está fresco — em horas, não dias. Daí vai para o repositório (`11`). Memória de uma semana atrás já é ficção.

**Formato de insight rastreável:** todo insight carrega **achado + evidência (qual sessão/dado o sustenta) + força** (forte/médio/fraco). Insight sem rastro até o dado bruto é opinião com fonte bonita. (cadeia achado→insight em `_GLOSSARY §1`)

**Log de hipóteses:** *hipótese → previsão → como testei → resultado (confirmada / refutada / inconclusiva) → decisão.* Registre **o que falhou** (para não repetir) tanto quanto o que deu certo (para reusar). É o ativo que mais se perde e mais economiza retrabalho. (template copiável → `templates/`)

**Readout honesto:** diga **quem os dados representam** e as **limitações**, sempre. Não transforme 5 sessões em "60% dos usuários". Estrutura curta: **contexto → o que fiz → achados por severidade → recomendações → o que ainda é suposição**. (severidade → `07`)

**Registro contínuo leve:** prefira **recap curto e regular** a relatório gigante no fim. Em ritmo ágil, um resumo a cada rodada mantém a base viva sem virar projeto paralelo.

## 4. Checklist

Antes de considerar uma sessão "documentada":

- [ ] **Anotei durante** (cada um separado) e fiz **debrief** enquanto fresco?
- [ ] Cada **insight tem evidência rastreável** (sessão/dado) e força marcada?
- [ ] **Registrei as hipóteses** — inclusive as que falharam — com resultado e decisão?
- [ ] O **readout diz quem os dados representam** e as limitações (sem virar estatística)?
- [ ] O esforço é **proporcional** ao risco da decisão?
- [ ] Foi para o **repositório** (`11`), não para uma pasta pessoal perdida?

## 5. Erros comuns

- Não **confie na memória** — "depois eu escrevo" é como o insight morre; registre na hora.
- Não **liste por participante** — esconde o padrão que só aparece quando se organiza por problema.
- Não **misture interpretação com fala** — o que a pessoa disse, o que fez e o que você concluiu são três coisas; juntá-las contamina o achado.
- Não **trate quali como estatística** — "3 de 5" é sinal, não "60%"; readout desonesto destrói a credibilidade da próxima pesquisa.
- Não **faça relatório gigante** que custa mais do que a decisão que apoia — documentação que ninguém mantém é pior que recap curto que todos leem.

## 6. Relação com outros arquivos

- **Como pensar: dado → padrão → insight (análise)** → dono é `04`.
- **Onde guardar: repositório, taxonomia, governança, retenção** → dono é `11`.
- **Definições de achado, insight, hipótese de solução, evidência** → `_GLOSSARY §1`.
- **Como formular a hipótese que entra no log** → `06`.
- **Severidade dos achados no readout** → `07`.
- **Amostra, representatividade e por que 5 sessões ≠ percentual** → `08`.
- **Registro mínimo viável quando o contexto proíbe pesquisa formal** → `14`.
- **Templates copiáveis (log de hipótese, notas, readout)** → `templates/`.

## 7. Fontes principais

- **Group Notetaking for User Research — NN/g** — captura sem groupthink; organizar por problema, não por participante.
- **Lean UX Documentation for Tracking and Communicating in Agile — NN/g** — registro leve e recap regular em vez de relatório gigante.
- **How to Present UX Research Results Responsively (vídeo) — NN/g** — readout honesto: quem os dados representam e suas limitações.

Demais fontes (Documenting a UX-Benchmarking Study — NN/g) → `_SOURCES.md`.

---

→ Relacionados: `04` (análise dado→insight) · `11` (repositório/governança) · `06` (formular hipótese) · `07` (severidade) · `08` (amostra) · `14` (registro mínimo) · `_GLOSSARY §1` (achado/insight/hipótese) · `templates/`. Sem expanded: este CORE é autossuficiente.
