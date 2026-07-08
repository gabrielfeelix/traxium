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
