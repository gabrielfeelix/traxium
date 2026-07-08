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
