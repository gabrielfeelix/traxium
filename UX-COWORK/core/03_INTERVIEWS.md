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
