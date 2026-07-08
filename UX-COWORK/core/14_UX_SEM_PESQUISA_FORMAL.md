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
