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
