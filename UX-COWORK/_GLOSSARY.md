# _GLOSSARY — Glossário único

> Fonte única de definições. Nenhum arquivo `core/` ou `expanded/` redefine um termo daqui — só usa.
> Definições curtas de propósito: glossário inchado vira outro arquivo para ninguém ler. v1 — 2026-06-15.

---

## 0. Convenção de siglas (regra dura)

- **IA = Inteligência Artificial.** Sempre. (arquivo `12`)
- **AI = Arquitetura da Informação.** Sempre. (arquivo `05`)
- **Regra dos dois sentidos:** nunca "IA" para Arquitetura da Informação, e nunca "AI" para Inteligência Artificial. A troca vale para os dois lados.
- **Primeira menção** em qualquer arquivo: escreva por extenso + sigla — "Arquitetura da Informação (AI)" / "Inteligência Artificial (IA)" — e use a sigla depois. "AI" sozinho é ambíguo em PT/EN; o extenso na primeira vez mata a dúvida.

---

## 1. Cadeia da pesquisa (do dado à decisão)

Ordem em que a pesquisa "sobe" de dado bruto até ação. Termo definido aqui, processo no arquivo `04`.

- **Dado bruto** — registro cru, sem interpretação (fala, clique, gravação, número).
- **Observação** — um fato pontual notado no dado. Ainda não é padrão.
- **Padrão** — observação que se repete entre pessoas/sessões.
- **Achado (*finding*)** — padrão descrito com evidência. Responde "o que vimos". Neutro, sem solução embutida.
- **Insight** — interpretação do porquê do achado. Responde "o que isso significa". Acionável.
- **Oportunidade** — espaço de melhoria que o insight abre. Responde "onde podemos agir". (formato Opportunity Solution Tree no `02`)
- **Recomendação** — ação proposta a partir da oportunidade. Responde "o que fazer".
- **Hipótese de solução** — aposta testável ("se X, então Y"). Ainda não é verdade; precisa de validação.

Regra: **achado ≠ insight ≠ recomendação.** Não pule etapas no relatório. Recomendação sem achado é opinião.

---

## 2. Métrica e vizinhos (arquivo `08` é o dono)

- **Dado** — valor bruto coletado.
- **Métrica** — dado tratado que mede algo ao longo do tempo (ex.: taxa de sucesso).
- **Sinal (*signal*)** — evento observável que indica progresso rumo a um objetivo (o "S" de Goals-Signals-Metrics).
- **KPI** — métrica eleita como indicadora-chave de uma meta de negócio/produto. Todo KPI é métrica; nem toda métrica é KPI.
- **Métrica de vaidade** — número que sobe e parece bom, mas não apoia decisão (ex.: pageviews isolados).
- **Baseline** — valor atual de referência, medido antes de mudar algo. Sem baseline não há "melhorou".

---

## 3. Eixos de pesquisa (arquivo `01` é o dono)

- **Qualitativo** — entende *por que* e *como*. Poucas pessoas, profundidade. Gera hipótese.
- **Quantitativo** — mede *quanto* e *quantos*. Muitas pessoas, números. Testa hipótese.
- **Comportamental** — o que a pessoa *faz* (observado).
- **Atitudinal** — o que a pessoa *diz/pensa* (declarado). Cuidado: dito ≠ feito.
- **Generativa (exploratória)** — descobre o problema. Vem antes da solução.
- **Avaliativa** — testa uma solução já existente. Vem depois do esboço.

---

## 4. Tipos de teste (arquivo `07` é o dono)

- **Moderado** — com facilitador ao vivo. Permite aprofundar e adaptar.
- **Não moderado** — pessoa faz sozinha, ferramenta grava. Escala, mas não pergunta "por quê".
- **Formativo** — durante o design, para corrigir. Qualitativo, poucas pessoas.
- **Somativo** — ao final, para avaliar/comparar. Tende a quantitativo.
- **Think aloud** — pedir para a pessoa narrar o pensamento enquanto age.

---

## 5. Avaliação e prioridade

- **Severidade** — gravidade de um problema, não sua frequência. Um erro que acontece 1 vez mas impede a compra é crítico. Escala canônica no arquivo `07`; recorte de acessibilidade no `10`.
- **Evidência** — base observada que sustenta uma afirmação. Oposto de suposição.
- **Validação** — checar uma hipótese contra a realidade (usuário, dado, teste). "Sem validação" = adivinhação.
- **Proxy de evidência** — sinal indireto usado quando não há pesquisa formal (analytics, atendimento, reclamações, heurística, benchmark). Base do arquivo `14`.

---

## 6. Estrutura e usuário

- **Arquitetura da Informação (AI)** — Estrutura, organização e nomenclatura que definem as relações entre conteúdos e funcionalidades de um produto. O *backbone* invisível: **não** é o sitemap (saída visual) nem o menu (componente de navegação). (arquivo `05`)
- **Top task** — tarefa que a maioria dos usuários mais precisa concluir. Organiza prioridade. (arquivo `05`)
- **Modelo mental** — como o usuário acha que o sistema funciona. A estrutura deve seguir ele, não o organograma da empresa.
- **Persona** — arquétipo de usuário baseado em pesquisa. Sem pesquisa, é personagem fictício — sinalize como suposição.
- **Jornada (*journey map*)** — etapas que o usuário percorre para um objetivo, com emoções e fricções. (arquivo `04`)
- **Usabilidade ≠ Acessibilidade** — usabilidade = fácil de usar; acessibilidade = utilizável por pessoas com deficiência. Relacionadas, não sinônimos. (arquivos `07` e `10`)

---

## 7. Discovery e produto (arquivo `02` é o dono)

- **Discovery** — Processo de reduzir incerteza antes de comprometer recurso com uma solução; vai do pedido vago ao problema definido. Não é reunião — é investigação até haver evidência.
- **Matriz CSD** — Quadro que separa **C**ertezas (com evidência), **S**uposições (acreditadas, não comprovadas) e **D**úvidas (a investigar). Expõe o risco escondido.
- **Riscos de produto (4 riscos)** — Lente SVPG: valor, usabilidade, viabilidade técnica e negócio (+ adoção, entrega). Avalie quais são significativos antes de focar a pesquisa.
- **Continuous discovery** — Substituir a pesquisa-por-projeto por um **fluxo de cadência fixa (~semanal) acoplado às decisões de produto do dia a dia** (Teresa Torres). O diferencial não é "pesquisar muito" — é a pesquisa estar ligada à decisão contínua.
- **MVP** — Menor escopo que entrega valor e endereça os maiores riscos; ponto de corte do que construir primeiro.

---

## 8. Síntese (arquivo `04` é o dono)

- **Affinity mapping** — Técnica de síntese: quebrar dado em unidades pequenas e agrupar por similaridade até temas emergirem. É organização/síntese, **não** método de pesquisa.
- **JTBD (Jobs To Be Done)** — Lente de enquadramento de necessidade: o "trabalho" que a pessoa contrata o produto para fazer. Foca o problema/objetivo, não a solução.

---

## 9. Métodos de contexto (arquivo `03` é o dono; aqui só desambigua os três)

- **Contextual inquiry** — Observação **+ entrevista** na tarefa real, perguntando o porquê durante a ação.
- **Field study** — Observação *in situ* no ambiente natural, **sem** a entrevista guiada do contextual inquiry.
- **Diary study** — **Auto-registro** do participante ao longo do tempo (remoto, assíncrono); os outros dois são observação presencial pontual.

---

## 10. Como manter este arquivo

- Só entra termo que **aparece em 2+ arquivos** ou que **causou divergência** na base bruta.
- Definição em 1–2 linhas. Aprofundamento mora no arquivo dono (indicado entre parênteses).
- Termo novo durante a destilação → adicione aqui **antes** de usá-lo nos CORE.