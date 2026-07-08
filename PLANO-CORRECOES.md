# TRAXIUM — Plano de Correções (Fase 1.5 · handoff para novo agente)

> Este documento é **autossuficiente**. Corrige defeitos reportados no protótipo clicável.
> Contexto: protótipo sem backend, estado em memória via `src/lib/store/session.tsx` (Context que muta arrays de domínio + `version` bump). Toasts via `src/components/ui/toast.tsx` (`useToast`). Modais via `src/components/ui/dialog.tsx`.
> Padrão de modal que **funciona** (referência): `src/components/modals/nova-viagem-modal.tsx`.
> **Não** subir `next build` junto do `next dev` (polui `.next`). Verificar sempre com `npx tsc --noEmit` + dev server.

---

## P0 · Bug global — cursor de ponteiro ausente em TODO clicável

**Causa raiz:** `<button>` nativo usa cursor `default` (seta); Tailwind v4 não injeta `cursor: pointer`; `src/components/ui/button.tsx` (string base do `cva`, linha 8) não tem `cursor-pointer`; `globals.css` não tem regra global. Resultado: nenhum botão/elemento clicável mostra a mãozinha.

**Correção (2 partes):**

1. **Componente Button** — em `src/components/ui/button.tsx`, adicionar à base do `cva` (linha 8):
   `cursor-pointer disabled:cursor-not-allowed` (o `disabled:pointer-events-none` já existe; manter).

2. **Elementos clicáveis crus** — o app usa MUITO `<button>` cru e `<div/span onClick>` (cards, linhas de tabela, chips, seletores custom). Regra global em `src/app/globals.css`:
   ```css
   button:not(:disabled), [role="button"], a[href], label[for], summary { cursor: pointer; }
   ```
   Isso cobre `<button>` cru, `<a>` e `[role=button]`. **Mas não cobre `<div onClick>`**. Então:

3. **Auditar `<div>`/`<span>` clicáveis** — rodar:
   `grep -rn "onClick=" src/app src/components | grep -E "<div|<span|<tr|<li" `
   e adicionar `cursor-pointer` na className de cada um. Alvos conhecidos: cards de status/risco no dashboard, linhas de tabela clicáveis (frota compartimentos, dossiê), seletores de regime/tri-state, botões do simulador mobile, itens de lista clicáveis.

**Aceite:** passar o mouse em qualquer botão/card/linha clicável mostra ponteiro; elementos `disabled` mostram `not-allowed`.

---

## P0 · Dashboard (`src/app/(app)/page.tsx`) — botões mortos + hydration

1. **"Nova viagem"** (linha ~83) é `<Button>` sem ação. Trocar por `<NovaViagemModal />`:
   - importar `import { NovaViagemModal } from "@/components/modals/nova-viagem-modal";`
   - importar `useSession` e adicionar `const { version } = useSession();` + `data-v={version}` no root (para a lista/KPIs refletirem criações). A página já é `"use client"`.
2. **"Últimos 30 dias"** (linha ~80) — sem ação. Fazer dropdown de período (7/30/90 dias/tudo) OU, mínimo, `onClick` com `toast` informativo. Preferível dropdown que filtra os KPIs (mock: só troca o rótulo + toast).
3. **`relativeTime(...)` (Date.now)** nas linhas ~331 e ~477 → **risco de hydration mismatch** (mesmo bug já corrigido em `/bloqueios`). Trocar por `formatDate`/`formatDateTime` (determinístico) ou por texto fixo. Remover o import `relativeTime` se ficar órfão.

**Aceite:** "Nova viagem" no dashboard abre o wizard (idêntico ao de `/viagens`); console sem warning de hydration.

---

## P0 · Botões que hoje são TOAST e precisam virar MODAL com formulário

No passe P2 anterior, estes foram feitos como `toast` (confirmam sem abrir nada). O usuário quer formulário real:

### 3.1 Cadastrar motorista — `/motoristas`
Hoje: `onClick={() => toast(...)}`. Criar `src/components/modals/cadastrar-motorista-modal.tsx`.
**Campos:** nome, CPF, CNH (número, categoria, validade), tipo (`Próprio` | `Agregado`), telefone, cidade, UF, letramento digital (`Alto`/`Médio`/`Básico`), certificações iniciais (MOPP validade, Treinamento GMP+).
**Store:** adicionar `addMotorista` em `session.tsx` (tipo `Motorista` de `mock-data.ts`; `unshift` em `motoristas`; defaults: `totalViagens:0, conformidadeMedia:100, status:"Ativo", ultimaViagem:"—", certificacoes` a partir do form).
**Regra de negócio (ver §5):** este modal cria **próprio/agregado**. Motorista de subcontratado NÃO entra aqui.
Assinar `useSession()` na página de motoristas (`data-v`) para a lista atualizar.

### 3.2 Agendar treinamento — `/motoristas` (header + item do dropdown)
Hoje: toast "agendado" sem data. Criar `AgendarTreinamentoModal`.
**Campos:** tipo (GMP+ Básico / GMP+ Avançado / MOPP / EUDR), **data** (date), local, participantes (multiselect de `motoristas`; no item do dropdown, pré-selecionar o motorista `m`).
**Ação:** toast de confirmação **com a data escolhida** (ex.: "Treinamento GMP+ Básico agendado para 15/07/2026 · 3 participantes"). Persistência opcional (mock).

### 3.3 Programar auditoria — `/auditoria` (header) e dashboard
Hoje: toast. Criar `ProgramarAuditoriaModal`.
**Campos:** tipo (`GMP+ Anual` | `GMP+ Surpresa` | `Cliente comprador` | `Interna` | `EUDR`), **data**, auditor, organismo.
**Store:** `addAuditoria` (tipo `AuditoriaEvento`; `unshift` em `auditorias`; `status:"Programada", ncEncontradas:0`). Página assina `useSession`.

### 3.4 Plano de preparação — `/auditoria` (botão) e banner do dashboard
Hoje: toast (dashboard leva a `/auditoria` via Link, ok). Criar `PlanoPreparacaoModal` (read-only + ação).
**Conteúdo:** checklist dos "12 itens preparatórios pendentes" (ex.: dossiê por período, amostragem de viagens, evidências de limpeza D/C, certificados de subcontratados, T-3 por compartimento, treinamentos comprovados…), cada item com status ok/pendente. **Ações:** "Exportar plano" (usar `downloadCSV`/`printPDF` de `src/lib/export.ts`) + link para o Dossiê (`/dossie`).

---

## P1 · Verificar modais já implementados (provável já OK)

Estes JÁ usam o padrão do `nova-viagem-modal.tsx` (que o usuário confirmou funcionar). Foram reportados como "não abrem" porque testados **antes do último deploy**. **Ação do agente:** abrir cada um, preencher, submeter e confirmar que aparece na lista + toast. Se algum realmente não abrir, comparar `<DialogTrigger asChild><Button>…</Button></DialogTrigger>` com o de referência.

- **Cadastrar fazenda / GeoJSON** — `src/components/modals/nova-fazenda-modal.tsx` (wired em `/fazendas` linhas 57 e 72).
- **Novo lote** — `novo-lote-modal.tsx` (wired em `/lotes` linha 55).
- **Novo produto** — `novo-produto-modal.tsx` (wired em `/idtf` linha 75).
- **Classificar IDTF** — `classificar-idtf-modal.tsx` (fila em `/idtf`).
- **Adicionar ativo** — `adicionar-ativo-modal.tsx` (`/frota`).
- **Reportar NC** — `reportar-nc-modal.tsx` (`/bloqueios`).
- **Qualificar subcontratado** — `qualificar-subcontratado-modal.tsx` (`/subcontratados`).

---

## P1 · Outros botões que idealmente viram modal (secundário)

Hoje toast/nav; aceitável, mas melhora a demo:
- **Convidar usuário** (`/configuracoes`) → modal (e-mail + papel).
- **Enviar documento** (`/documentos`) → modal de upload simulado (nome, tipo, arquivo mock).
- **Adicionar nova transportadora** (topbar tenant menu) → modal (razão social, CNPJ, plano).
- **Novo modelo** (`/checklists` aba Modelos) → modal (título, tipo, regime, nº de itens).
- **Renovar certificação** (dropdown motorista + frota) → modal com nova validade (date) que atualiza o status Vencida→Válida.

---

## 5 · Decisão de negócio — Como a empresa cadastra um funcionário/motorista?

Definir explicitamente na UI (evita a confusão atual):

- **Motorista próprio ou agregado** → botão **"Cadastrar motorista"** em `/motoristas` (§3.1). É funcionário/agregado direto da transportadora.
- **Motorista de empresa subcontratada** → **NÃO** se cadastra em `/motoristas`. Vem da **qualificação da empresa** em `/subcontratados` (campo `motoristasAutorizados` do `QualificarSubcontratadoModal`). Motivo GMP+: o terceiro responde pelo próprio FSMS; a transportadora valida o escopo da empresa, não cadastra a pessoa.
- **Sugestão de UX:** no modal "Cadastrar motorista", tornar o campo **tipo** = {Próprio, Agregado} apenas; e adicionar uma nota/link: "É motorista de subcontratado? Qualifique a empresa em Subcontratados." Assim o fluxo fica óbvio.

---

## 6 · Store — ações a adicionar em `src/lib/store/session.tsx`

Seguir o padrão existente (`nextId`, `unshift`/`push` no array importado, `bump()`, expor no `value`):
- `addMotorista(input)` → array `motoristas` (import de `mock-data`).
- `addAuditoria(input)` → array `auditorias`.
- (opcional) `addTreinamento`, `renovarCertificado(motoristaOuImplementoId, novaValidade)`.

---

## 7 · Checklist de aceite (para o agente marcar)

- [ ] **Cursor pointer** em todo botão, link, card clicável, linha de tabela clicável e chip; `disabled` → `not-allowed`.
- [ ] **Dashboard "Nova viagem"** abre o wizard e cria viagem (reflete nos KPIs/lista).
- [ ] **Dashboard "Últimos 30 dias"** faz algo (dropdown/toast).
- [ ] **Cadastrar motorista** abre modal, cria e aparece na lista de `/motoristas`.
- [ ] **Agendar treinamento** abre modal com **data**; confirma com a data.
- [ ] **Programar auditoria** abre modal, cria em `/auditoria`.
- [ ] **Plano de preparação** abre modal (checklist) + exporta.
- [ ] **Cadastrar fazenda / Novo lote / Novo produto** verificados abrindo e persistindo.
- [ ] **Sem warning de hydration** no console (remover `relativeTime`/`Date.now()` de render — dashboard e qualquer outro; buscar `grep -rn "relativeTime\|Date.now()" src/app`).
- [ ] Fluxo de cadastro de motorista (próprio/agregado vs subcontratado) claro na UI.
- [ ] `npx tsc --noEmit` limpo e `npx next build` compila as rotas.

---

## 8 · Ordem sugerida de execução

1. **Cursor pointer** (P0 global — 15 min, alto impacto visual).
2. **Dashboard**: Nova viagem + Últimos 30 dias + remover `relativeTime`.
3. **Modais novos**: Cadastrar motorista → Programar auditoria → Agendar treinamento → Plano de preparação (com `addMotorista`/`addAuditoria` no store).
4. **Verificar** os modais já feitos (P1) e limpar qualquer `relativeTime` restante.
5. **Secundários** (P1): convidar usuário, enviar documento, adicionar transportadora, novo modelo, renovar certificação.

---

## 9 · Notas técnicas para o agente

- **Reatividade:** páginas que mostram itens criados precisam de `const { version } = useSession();` + `data-v={version}` no root (força re-render ao mutar arrays). Já é o padrão em `/viagens`, `/frota`, `/idtf`, etc.
- **Padrão de modal:** copiar a estrutura de `nova-viagem-modal.tsx` (Dialog controlado com `open`/`onOpenChange`, `DialogTrigger asChild` no botão gatilho, `reset()` ao fechar).
- **Datas:** usar strings ISO fixas (ex.: `"2026-07-08T10:00:00"`) e `formatDate`/`formatDateTime` de `src/lib/utils.ts`. **Nunca** `Date.now()`/`new Date()` em render (hydration). Em event handlers é permitido.
- **Toast:** `const { toast } = useToast();` — só funciona dentro do `Providers` (já envolve todo `(app)/layout.tsx`).
- **Ícones:** `lucide-react`. Remover imports órfãos ao substituir botões (evita warning no build).
