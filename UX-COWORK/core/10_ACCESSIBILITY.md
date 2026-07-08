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
