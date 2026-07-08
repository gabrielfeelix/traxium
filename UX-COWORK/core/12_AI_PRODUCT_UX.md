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
