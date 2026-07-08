# _GABARITO_CORE — Padrão dos arquivos core/

> Especificação canônica de TODO arquivo em `core/`. O agente de destilação obedece este documento.
> Se algo aqui conflitar com um arquivo individual, este vence. v1 — 2026-06-15.

---

## 1. Esqueleto fixo (ordem obrigatória)

​```
# NN_NOME — CORE

## 1. Para que serve
(2–3 linhas. Substitui o antigo "Resumo executivo". É a primeira coisa lida.)

## 2. Quando usar / Quando NÃO usar
(Dois blocos de bullets curtos. O "quando NÃO usar" é obrigatório — é o que evita método errado.)

## 3. Processo operacional
(Passo a passo enxuto, só o essencial. Numerado. Sem narrativa.)

## 4. Checklist
(Inline se curto, OU uma linha: "→ checklists/NOME.md".)

## 5. Erros comuns
(Máximo 5. Um por linha. Imperativo: "Não faça X".)

## 6. Relação com outros arquivos
(1 linha por link. Aponta o DONO de cada conceito que este arquivo usa mas não define.)

## 7. Fontes principais
(Máximo 3. O resto vive em _SOURCES.md.)

→ Aprofundamento: expanded/NN_NOME_EXPANDED.md
​```

Exceções: `00_INDEX` e `14` não têm `expanded/`. O `00` é índice puro (não segue as 7 seções).

---

## 2. Tamanho

- **Alvo:** 150–250 linhas / **≤ ~1.200 palavras**.
- Passou disso → o excedente vai para `expanded/`. Sem exceção "esse tema é importante demais": importante vira link para o expanded, não justifica inflar o CORE.

---

## 3. Tom

- Telegráfico e imperativo. "Faça X. Evite Y." Sem parágrafo de aquecimento.
- Sem "Resumo executivo" (a seção 1 já é o resumo).
- Sem "Exemplo completo" narrativo → vai para `expanded/`.
- Tabela só quando compara 2+ coisas. Senão, bullets.

---

## 4. Regra de ouro: 1 conceito = 1 dono

- Antes de explicar algo, pergunte: **"qual arquivo é o dono disto?"** (ver tabela na seção 5 de `ARQUITETURA.md`).
- Se não for este arquivo → **referencie, não reexplique**.
- Termo recorrente → vive no `_GLOSSARY.md`. Decisão de método → `_METHOD_PICKER.md`. Fonte → `_SOURCES.md`.

---

## 5. O que sempre preservar

Quando usar / quando NÃO usar · checklist · erros comuns · 1 fonte primária no mínimo · os cross-refs corretos.

## 6. O que sempre remover do CORE

Resumo executivo · exemplo completo longo · tipologias extensas (ex.: "8 tipos de entrevista" → 2 linhas + link) · redefinição de termo já no glossário · listas de 20+ fontes.