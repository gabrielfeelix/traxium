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
