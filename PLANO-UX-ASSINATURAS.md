# TRAXIUM — Plano de Assinaturas de Tela (handoff)

> Documento de execução para o próximo agente. **Self-contained** — não depende de histórico de chat.
> Objetivo: tirar o produto do "cara de IA" dando **identidade própria a cada tela**, sem virar 22 flocos de neve aleatórios.
> Fonte de verdade visual: `DESIGN.md`. Este plano opera **por cima** do que já está feito (§2).

---

## 1. O problema

O sistema é visualmente competente (paleta de marca confiante, tipografia Geist, microcopy regulatório forte). Mas sofre de **arquétipo único**: quase toda tela é `PageHeader → fileira de KPIs → Card branco com tabela`. Resultado: "entra numa, parece a outra". Isso é o tell macro de IA — o modelo cai no template mais seguro e repete.

Diagnóstico validado por auditoria das 22 telas. Os tells **de fundo** (emoji, cor slate genérica, KPI reinventado por tela, botões-fake, estados vazios mortos) **já foram varridos** (§2). O que falta é o nível acima: **momento-assinatura** — uma visualização por tela, ligada ao objeto de domínio dela, que faça o olho reconhecer onde está na hora.

**Regra anti-slop:** variação editorial tem que sair de um **kit fechado** (§3), não de invenção por tela. Reuso = coerência; sem kit, cada tela nova diverge mais.

---

## 2. O que já está pronto (REUSAR, não refazer)

### Fundação de token
- `src/app/globals.css` (`@theme`): tokens semânticos completos — `brand-*`, `success/warning/danger-*`, `fg`/`fg-muted`/`fg-soft`, `border`/`border-soft`, `ink-*`, e a família **`regime-a/b/c/d` (+`-bg`/`-fg`)**.
- **REGRA DURA:** usar classes de token (`text-fg-muted`, `bg-brand-50`, `border-border-soft`, `bg-regime-d`…). **Nunca** `bg-[hsl(...)]` inline. As telas antigas ainda têm HSL inline legado — ao tocar numa, tokenize o que mexer.

### Kit compartilhado (`src/components/kit/`)
- `regime.tsx` → `REGIME_META` (nome/método/disc/ring por regime), `REGIMES`, `<RegimeDisc regime className>`. Vocabulário único da escada de limpeza A→D.
- `stat-tile.tsx` → `<StatTile icon label value hint tone>`. Tile de métrica **único** do sistema (já adotado em 8 telas). Para métrica rica (sparkline/delta) existe `src/components/shell/kpi-card.tsx`.

### 2 assinaturas de referência (copiar o padrão)
- **Matriz de severidade** → `src/components/idtf/regime-matrix.tsx` (usada em `/idtf`). Padrão: escada A→D + régua de intensidade + chips do domínio + overlay de 2ª dimensão + lanes clicáveis que filtram a tabela abaixo.
- **Cadeia causal** → `src/components/frota/cadeia-proveniencia.tsx` (usada em `/frota/compartimento/[id]`). Padrão: stepper horizontal `Node`+`Conn` com portão pass/falha e "quebra" vermelha. **Este é o template direto pra Bloqueios/CAPA.**

### Varredura já aplicada (todas as telas)
Slate `hsl(215…)` → token (app inteiro, incl. primitivos de UI); emoji removido (Documentos); `StatTile` em 8 telas; botões-fake removidos; abas/estados vazios → funcionais. Não refazer.

### Motor de regras (fonte única — derivar, nunca hardcodar)
`src/lib/domain/rules-engine.ts` e `src/lib/domain/model.ts`. Ex.: `statusCompartimento`, `avaliarCarregamento`, `getT3`, `ORDEM_REGIME`, `nivelVencimento`. Toda assinatura deve **ler o veredito do motor**, não recalcular à mão.

---

## 3. O kit de assinatura (7 dispositivos)

Toda assinatura sai de UM destes. Se um dispositivo se repetir, **promova pro `components/kit/`**.

| Dispositivo | Existe? | Serve pra |
|---|---|---|
| Escada/matriz de severidade | ✅ `regime-matrix` | IDTF |
| Cadeia causal (stepper + portão) | ✅ `cadeia-proveniencia` | Compartimento, **Bloqueios/CAPA** |
| Sequence rail (timeline h/v) | ❌ construir | Viagens (T-3), Lotes (DDS), Auditoria (D-N), Atividade |
| Horizonte de vencimento (gantt/countdown) | ❌ construir | Subcontratados, Motoristas, Documentos |
| Monitor de conexão vivo | ❌ construir | Traces |
| Credencial / ID-card | ❌ construir | Motoristas |
| Radar/score-herói | parcial (Recharts) | Conformidade |

E **4 arquétipos** de página pra variar o ritmo (hoje só existe o 1º): **A** lista densa · **B** bancada (form + resultado vivo) · **C** comando/monitor (viz-herói domina) · **D** mestre-detalhe/dossiê.

---

## 4. Método (como dar assinatura a QUALQUER tela)

1. **Objeto de domínio** — o que a tela decide? (1 frase)
2. **Dispositivo** — escolha do §3. Se já existe, importe; se não, construa e promova ao kit.
3. **Herói + detalhe** — a viz vira o topo/full-width; a tabela recua a detalhe; **conecte os dois** (herói filtra/linka o detalhe). Mata o "blocos desconectados".
4. **Token + kit** — zero HSL inline; reusa `RegimeDisc`/`StatTile`/etc.
5. **Derive do motor** — veredito vem de `rules-engine`, não hardcode.
6. **Verifique** — `npx tsc --noEmit` (exit 0) + `curl` na rota (HTTP 200, sem `error.digest`) + olhada visual no dev.
7. **Commit por assinatura** (bisectável) + `vercel --prod`.

---

## 5. Backlog priorizado (wow/hora × tráfego)

> Formato: **Tela** — objeto → **assinatura** (dispositivo). Arquivo atual.

1. **Bloqueios/NC** — NC + CAPA → **cadeia causal 5-porquês** (Ação imediata → Causa raiz → Corretiva → Eficácia) como fluxo horizontal com portão de eficácia, no lugar dos 3 inputs empilhados. **Reusa `cadeia-proveniencia`** (extrair `Node`/`Conn` pro kit como `CausalChain`). Arquivo: `src/app/(app)/bloqueios/page.tsx` (dado: `NaoConformidade` + `CapaPanel`). **← COMEÇAR AQUI (o cliente pediu).**
2. **Subcontratados** — cert GMP+ → **horizonte de vencimento** (gantt/countdown contra janela ≤60d). `VencimentoBadge`/`nivelVencimento` já calculam o dado. Arquivo: `subcontratados/page.tsx`.
3. **Conformidade** — score → **radar-herói central grande** + fim do estado 100% estático (ligar à `useSession`). Arquivo: `conformidade/page.tsx` (hoje sem session, sem PageHeader actions — a menos acabada).
4. **Viagens** — viagem → **sequence rail T-3** no topo (carga anterior → regime → status), tabela vira detalhe. Arquivo: `viagens/page.tsx`.
5. **Traces** — gateway → **monitor de conexão vivo** (log SOAP OUT/IN vira sequência bidirecional Traxium↔CE + sparkline de latência). Arquivo: `traces/page.tsx`.
6. **Lotes/DDS** — lote → **rail do ciclo DDS** (Rascunho→Pronto→Enviado→Aprovado) por lote + origens multi-fazenda em mini-mapa. Arquivo: `lotes/page.tsx`.
7. **Dossiê** — reconstrução → **estética de dossiê forense impresso** (T-3 cronológico carimbado, selo/hash-chain). Arquivo: `dossie/page.tsx` (o `Reconstrucao` já é forte, só elevar).
8. **Motoristas** — motorista → **ID-card de qualificação** (validade CNH/cert, medidor de conformidade, anel de treino). Arquivo: `motoristas/page.tsx`.
9. **Auditoria** — ciclo → **contagem D-N** (rail) + prontidão de evidência. Também **alinhar os tamanhos de tipografia default** (`text-lg/sm/xs`) ao padrão px do resto — está fora do idioma. Arquivo: `auditoria/page.tsx`.
10. **Documentos** — repositório → **timeline de validade** por certificado. ⚠️ Requer adicionar campo `validade?: string` ao type `Documento` em `mock-data.ts` (mudança de dado). Arquivo: `documentos/page.tsx` (base já limpa).
11. **Frota** — compartimento → **grid de "vagas"** com status T-3 por célula. Arquivo: `frota/page.tsx`.
12. **Configurações** — org → equipe vira **matriz papel×permissão** e integrações vira **mapa de sistemas conectados** (TRACES/INPE/MapBiomas/CAR/SEFAZ) com status. Arquivo: `configuracoes/page.tsx`.
13. **Atividade** — log → timeline **agrupada por dia** + avatar de ator + disclosure de payload. Arquivo: `atividade/page.tsx` (já tem timeline vertical, só evoluir).
14. **Checklists/LCI** — inspeção → **grid de 6 ângulos com thumbnails + chips geo/hash/timestamp** (hoje tiles que só contam). Arquivo: `checklists/page.tsx`.

Telas já com assinatura: **IDTF** (1), **Compartimento** (2). Telas já distintas por natureza (manter): **Mobile** (phone-frame), **Fazendas** (mapa herói).

---

## 6. Guarda-corpos (obrigatório)

- **Token, nunca HSL inline.** Ao tocar numa tela, tokenize o que mexer.
- **Sem emoji decorativo** (DESIGN §10). Ícones = `lucide-react`, stroke 1.75 (§9).
- **Sem dark mode** (decisão registrada, DESIGN §15).
- **Sinal regulatório = cor + ícone + rótulo** (nunca só cor) — DESIGN §1.3.
- **Reusar/estender o kit**, não duplicar. Dispositivo recorrente → promover pra `components/kit/`.
- **Derivar do `rules-engine`/`model`** — não hardcodar veredito/score.
- **Não refatorar o store** (`lib/store/session.tsx`) — padrão muta-array + `version` é frágil; só estender.
- **Verificar sempre:** `npx tsc --noEmit` + `curl` da rota (200, sem erro) antes de commit. **1 commit por assinatura.**
- Deploy: `npx vercel --prod --yes` (projeto `traxium` já linkado em `.vercel/`).

---

## 7. Dívida técnica ainda aberta (não bloqueia, mas some com "cara de IA" e bugs)

- **Bug de cor no KPICard** — `src/components/shell/kpi-card.tsx:67-71`: delta negativo cai em verde quase sempre. Falta prop de polaridade (menos NC = bom vs menos viagem = ruim). Corrigir ao mexer no dashboard.
- **`conformidade` 100% estática** — sem `useSession`, sem PageHeader actions. Ligar ao resolver a assinatura #3.
- **Acessibilidade rasa** — só ~7 atributos `aria-` no app inteiro; DESIGN §14 promete mais. Adicionar `aria-label` em botões-só-ícone, landmarks, foco visível — de preferência por tela, ao tocar nela.
- **HSL inline legado** — ainda há ~1.6k ocorrências `bg-[hsl(...)]` fora das telas varridas. Candidato a codemod amplo (mapear cada valor → token), mas de baixo risco fazer incrementalmente ao tocar cada tela.

---

## 8. Estado do repositório neste handoff

- Branch: `fix/ux-fase-1-3` (commits **locais**, não pushados pro GitHub — só deploy foi feito).
- Últimos commits relevantes: `feat(idtf)` matriz · `feat(compartimento)` cadeia · `refactor(ui)` StatTile+Documentos · `refactor(ui)` varredura anti-slop.
- Produção no ar: `https://traxium-three.vercel.app`.
- Não commitados (deixados de propósito): `PLANO-PERFIS.md`, `TRAXIUM-Fases-UX.pdf`.
