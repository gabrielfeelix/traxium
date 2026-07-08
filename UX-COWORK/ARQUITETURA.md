# ARQUITETURA DA BASE — UX Cowork

> Mapa da estrutura. Define pastas, convenções de nome, regras de carregamento de contexto e o gabarito CORE.
> **Estado: conteúdo escrito.** Os 14 CORE, os 12 expanded, glossário, sources, method-picker, templates e checklists estão preenchidos. O que falta é só índice/README (ver §6).
> Scaffold criado em 2026-06-15; atualizado para refletir o estado real.

---

## 1. Árvore de pastas

```
UX-COWORK/
├── README_FOR_CLAUDE.md     ← cérebro: rota por pedido + regras de resposta   [sempre no contexto]
├── _GLOSSARY.md             ← definições únicas (resolve IA vs AI)             [sempre no contexto]
├── _METHOD_PICKER.md        ← "qual método uso?" + matriz risco→método        [sempre no contexto]
├── _SOURCES.md              ← bibliografia master                             [sob demanda]
├── GABARITO_CORE.md         ← especificação canônica dos core/                [referência]
├── ARQUITETURA.md           ← este arquivo                                    [referência]
│
├── core/                    ← fino, consulta diária        [carregar vários ao mesmo tempo]
│   ├── 00_INDEX.md
│   ├── 01_METHODS.md
│   ├── 02_DISCOVERY.md
│   ├── 03_INTERVIEWS.md
│   ├── 04_SYNTHESIS.md
│   ├── 05_INFO_ARCH.md
│   ├── 06_IDEATION.md
│   ├── 07_USABILITY.md
│   ├── 08_METRICS.md
│   ├── 09_ECOMMERCE.md
│   ├── 10_ACCESSIBILITY.md
│   ├── 11_RESEARCHOPS.md
│   ├── 12_AI_PRODUCT_UX.md
│   ├── 14_UX_SEM_PESQUISA_FORMAL.md   ← contexto real (output > validação); autossuficiente
│   └── 15_DOCUMENTATION.md            ← o ato de registrar; autossuficiente
│
├── expanded/                ← fundo, aprofundamento         [carregar 1 por vez, sob demanda]
│   └── NN_NOME_EXPANDED.md  (12 arquivos: espelham os core 01–12)
│
├── templates/               ← copiar-colar direto (6)       [carregar só o usado]
│   ├── intake.md · plano-de-pesquisa.md · screener.md
│   ├── consentimento.md · relatorio-usabilidade.md · log-hipoteses.md
│
└── checklists/              ← checklists copiáveis (12)     [carregar só o usado]
    └── (discovery, entrevistas, sintese, arquitetura-informacao, teste-usabilidade,
         ecommerce, acessibilidade, produto-ia, ideacao, metricas, researchops, plano-de-pesquisa)
```

> **A pasta `prompts/` foi removida.** Sua função foi absorvida pelos `core/` (conhecimento/como-fazer) + `templates/` (formulários copiáveis). Não é esquecimento — é decisão.

---

## 2. Convenções de nomenclatura

- **CORE:** `core/NN_NOME.md` — sufixo nenhum.
- **EXPANDED:** `expanded/NN_NOME_EXPANDED.md` — mesmo número e nome do core + `_EXPANDED`. O conteúdo expanded é a base bruta destilada (ex-`ux-research-knowledge-pack`), posicionada aqui.
- **Arquivos de infraestrutura:** prefixo `_` (`_GLOSSARY`, `_METHOD_PICKER`, `_SOURCES`).
- **templates / checklists:** nome-em-minúsculas-com-hífen, sem número.
- **Sigla (regra dura):** **IA = Inteligência Artificial** (arquivo `12`). **AI = Arquitetura da Informação** (arquivo `05`). Vale nos dois sentidos; primeira menção por extenso. Detalhe em `_GLOSSARY §0`.

### Numeração — não "consertar" depois

- **O arquivo 13 não existe.** O antigo `13_PROMPTS_AND_CHECKLISTS` foi explodido em `checklists/` e `templates/` (e a `prompts/` daí derivada já foi removida). Não recriar um `13`.
- **O salto 12 → 14 → 15 é proposital.** `14` (UX sem pesquisa formal) e `15` (documentação) são arquivos novos, autossuficientes, sem expanded. **Não renumerar** — os cross-refs de toda a base apontam por número; renumerar quebra os ponteiros.

---

## 3. Regras de carregamento (anti-saturação de contexto)

| Camada | Quando entra no contexto |
|---|---|
| README + `_GLOSSARY` + `_METHOD_PICKER` | **Sempre** |
| `core/` | Vários juntos, conforme o tema do pedido |
| `expanded/` | Só quando o CORE não basta; um por vez |
| `templates` / `checklists` | Só o item invocado |
| `_SOURCES` | Só quando se pede fonte/aprofundamento |

Princípio: **o CORE é o que está sempre à mão; o resto é puxado quando necessário.** É isso que evita estourar o contexto do Cowork. O `_METHOD_PICKER` fica sempre no contexto por ser régua de decisão de uma tela.

---

## 4. Gabarito CORE (resumo — spec canônica em `GABARITO_CORE.md`)

```
# NN_NOME — CORE
1. Para que serve
2. Quando usar / Quando NÃO usar
3. Processo operacional
4. Checklist
5. Erros comuns (máx. 5)
6. Relação com outros arquivos
7. Fontes principais (máx. 3; resto em _SOURCES)
→ Aprofundamento: expanded/NN_NOME_EXPANDED.md   (exceto 00, 14, 15)
```

**Alvo de tamanho:** 150–250 linhas / ≤ ~1.200 palavras por CORE.
**Exceções sem expanded:** `00` (índice puro), `14` e `15` (autossuficientes — encerram com cross-refs, sem ponteiro de aprofundamento).

---

## 5. Mapa de "dono único" por conceito

Regra de ouro: **um conceito, um dono.** Quem não é dono apenas referencia.

| Conceito | Dono |
|---|---|
| Tipos de pesquisa / escolha de método | 01 + _METHOD_PICKER |
| Double Diamond, CSD, Opportunity Solution Tree | 02 |
| Entrevista, contextual inquiry, diary/field | 03 |
| Affinity, empathy/journey/experience map, blueprint | 04 |
| Card sorting, tree testing, taxonomia, sitemap | 05 |
| HMW, Crazy 8, Design Sprint, facilitação | 06 |
| Severidade de problemas, tipos de teste | 07 |
| TODA métrica (HEART, GSM, SUS, taxa de sucesso, funil) | 08 |
| Funil de compra, auditoria de e-commerce | 09 |
| WCAG aplicado, Easy Checks, severidade a11y | 10 |
| Consentimento, LGPD, intake, repositório | 11 |
| Confiança calibrada, transparência, fallback (IA) | 12 |
| UX sob restrição (output > validação), proxies de evidência | 14 |
| O ato de registrar (notas, formato de insight, log de hipótese, readout) | 15 |
| Matriz risco → método → evidência (migrada do 01) | _METHOD_PICKER |
| Definições de termos | _GLOSSARY |
| Fontes | _SOURCES |

---

## 6. Status atual

- [x] Pastas criadas
- [x] Gabarito CORE (`GABARITO_CORE.md`)
- [x] `_GLOSSARY` (v1 + seções 7–9 promovidas + §0 sigla reforçada)
- [x] **14 CORE** escritos (01–12, 14, 15)
- [x] **12 expanded** posicionados (base bruta destilada → 01–12)
- [x] `_METHOD_PICKER` (mapa por decisão + matriz de risco migrada do 01)
- [x] `_SOURCES` consolidado (lacunas de URL resolvidas via web)
- [x] **6 templates** + **12 checklists**
- [ ] `00_INDEX` (índice ainda stub)
- [ ] `README_FOR_CLAUDE` (roteador ainda stub)
- [ ] MD mestre / governança de uso (se necessário)
