# HANDOFF — Traxium (modo MVP / 5 pilares)

Protótipo Next.js 16.2.6 (App Router, Turbopack), TS, Tailwind v4, shadcn-style. Sem backend: dados em `src/lib/mock-data.ts` + `src/lib/domain/`, store muta arrays in-place e faz `bump()` pra re-render. Recarregar zera (esperado).

Branch de trabalho: **`fix/ux-fase-1-3`**. Prod: `traxium-three.vercel.app` (intocada). Deploys de fase são **preview** (`vercel deploy --yes`).

## Fontes de verdade (ler antes de mexer)
- **`Traxium - 5 Pilares prioritários.pdf`** (raiz) — diretriz do MVP: 5 pilares + requisitos transversais + correções §5. É o norte atual. **Atenção: PDF é gitignored** (`.env*`/binários fora do repo) — não veio no clone. Pedir a Gabriel se a sessão precisar dele.
- `PLANO-PRODUTO.md`, `PESQUISA-UX.md`, `DESIGN.md` (design system — seguir à risca).
- `AGENTS.md`: **ler `node_modules/next/dist/docs/` antes de codar** (Next fora do padrão).

## Regras não negociáveis
- **Honestidade de dado**: nenhum toast/número/estado fake. Se não há dado → empty state. Tudo puxa do store real.
- **DESIGN.md**: sombras brand-tinted, bordas HSL-200, tabular-nums (`.num`), **sem emoji decorativo**, PT formal-direto, gradiente 135° só em momento-chave. Nada de "card genérico com cara de IA".
- Fim de cada fase: **commit + push + deploy** (Gabriel pediu). Commit em PT, conventional; rodar `npx tsc --noEmit` e `npm run build` antes.

## O eixo do MVP (mecânica)
- Store `src/lib/store/session.tsx`: eixo `produto: 'mvp' | 'completa'` (default mvp, localStorage, hydration-safe), ortogonal a accountType/papel/surface.
- Toggle no header: `src/components/shell/produto-toggle.tsx` (usado no `topbar.tsx`).
- Nav: `src/components/shell/sidebar.tsx` — cada item tem `pilar` + `mvp`; modo mvp reagrupa nos 5 pilares (`gruposPorPilar`), completa usa agrupamento funcional. `rotaVisivelNoMvp()` alimenta o soft-gate.
- Soft-gate rota fora do escopo: `src/components/shell/escopo-gate.tsx`, ligado em `surface-shell.tsx`.

## Feito

### Fase 1 (commit `70aeef8`)
Toggle MVP⇄Completa · sidebar reagrupada nos 5 pilares · soft-gate on-brand · **Torre de Controle** (home do MVP, `src/components/shell/torre-de-controle.tsx`: 3 níveis semafóricos + fila de decisões unificada + certificados a vencer + entrada nos pilares, tudo real) · **correções §5** (cert GMP+ é da empresa/subcontratado, não da carreta; MOPP fora do GMP+; "Inspeção pré-carregamento" no lugar de LCI). **Já aplicadas — não refazer.**

### Fase 2 (commit `8e562c7`) — Gatekeeper
- `src/lib/domain/model.ts`: `TipoVinculo`, `AcordoQA`, `EstadoQualificacao` + `ESTADO_QUALIFICACAO` (metadata tone/opera) + `estadoQualificacao(sub)` (9 estados **derivados**). Campos opcionais `tipoVinculo`/`acordo` no `Subcontratado`. Mock ampliado p/ 4 subcontratados.
- `src/components/modals/passaporte-modal.tsx` — **Passaporte Feed Safety** (credencial viva + export CSV).
- `src/components/modals/onboarding-link-modal.tsx` — convite por link/WhatsApp.
- `src/app/(app)/subcontratados/page.tsx` — badge de estado, tipo de vínculo, banner por motivo, botão Passaporte, StatTiles por estado.
- Toast do `qualificar-subcontratado-modal.tsx` agora reflete o estado real derivado.

### Merge de `main` (commit `057e112`)
O branch saiu de `b73836e` e ficou 8 commits atrás de `main`. Merge feito, 4 conflitos resolvidos a favor do dado real (recomendações derivadas em /conformidade, `NavItem` exportado como fonte da matriz de permissões, hooks antes do early return em `/page.tsx`, estados de qualificação + `ExpiryHorizon` convivendo em /subcontratados). **`main` continua sem o modo MVP** — quando fizer o PR, é este branch que vai por cima.

### Fase 3 (commit `21b54d5`) — Control Tower automation
- **`src/lib/domain/control-tower.ts`** (novo): `triarViagem()` classifica viagem ativa em verde/amarelo/vermelho e separa **quem liberou** (`liberadaPor: "motor" | "autoridade" | null`). Exceção aprovada sobre bloqueio → verde, mas o motor segue reprovando (o fato não mudou) — os dois ficam registrados. `automacao()` mede sobre o **total em rota, pendentes incluídos**: fila cheia tem que derrubar a taxa. `autoridadeDaRegra()` roteia regra do motor → nível.
- **Nível `tecnico`** em `NivelAutoridade` (o nível de ninguém): `podeAprovarExcecao()` nega para todos, inclusive diretoria/master. Caem nele carga proibida, cert vencido, T-3 ausente, limpeza não evidenciada. `exc-001` migrada de `diretoria_rt` → `tecnico` (era o "aprovar mesmo assim" literal). `/excecoes` não renderiza botão, renderiza o caminho da regularização; a matriz da tela agora **deriva** de `NIVEIS_AUTORIDADE`/`NIVEL_ESCOPO` (antes eram 4 cartões hardcoded contra 3 níveis no tipo).
- `avaliarNovoCarregamento()` devolve `regra` — o modal de nova viagem roteia por ela em vez de regex na mensagem.
- Torre: faixa de triagem com taxa de automação (barra proporcional ao real), fila **deduplicada** (exceção é escalonamento da viagem, não item separado), registro "Liberadas pelo motor" com checagens/base IDTF/data, e cada item diz quem libera — ou que ninguém libera.
- Dossiê: checagens item a item na §Decisão + nova **§Autoridade da liberação** (motor vs. pessoa deixam rastros diferentes).
- Verificado no app rodando: 60% resolvido sem humano (3 de 5 em rota), técnico sem botão, dossiê nos dois ramos.

## Mapa MVP: pilar → telas
Torre de Controle (home + /viagens + /excecoes + /bloqueios + /dossie) · Gatekeeper (/subcontratados + /checklists) · Academy (/motoristas) · IDTF Brasil (/idtf + /limpezas) · Network (/frota) · App do motorista (/mobile). Escondido no MVP: /fazendas /lotes /traces /auditoria /conformidade /documentos /atividade + superfícies Console/Portal/Auditor.

## Próximo (roadmap faseado)
- **Fase 4 — Academy**: sala virtual (trilhas, avaliação, certificado, validade) + treino just-in-time por risco. Regra: motorista sem competência não aparece elegível.
- **Fase 5 — Network**: cadastro em massa, import planilha, relações m:n, consulta rápida por CPF/CNPJ/placa.
- **Fase 6 — Trilhos EUDR**: só modelo de dados (lote/origem/CAR/polígono), sem telas avançadas (2ª onda).

## Ainda faltando no Gatekeeper (deixado de propósito na Fase 2)
Página pública de onboarding (fluxo do transportador), assinatura eletrônica real do acordo, "Pendente de inspeção" derivado, QR real. Ver §Gatekeeper do PDF.

## Ainda faltando no Control Tower (deixado de propósito na Fase 3)
- **Reavaliação após regularização**: hoje o bloqueio técnico só cai porque o motor recalcula a cada render. Falta a ação explícita ("registrar limpeza → reavaliar") fechando o ciclo na tela, com o antes/depois visível.
- **Trilha temporal da decisão automática**: `avaliadoEm` usa `viagem.iniciadaEm`. Um ledger real (append-only, com a versão da base vigente em cada avaliação) é o que sustenta "o motor decidiu às 14:22 com a base 2026.05".
- **Regras novas não mapeadas** caem no fallback `gestor` em `autoridadeDaRegra()`. Ao acrescentar regra ao motor, mapear a autoridade junto — senão vira aprovável por descuido.

## Pendência operacional
`vercel deploy` está **não autorizado** nesta máquina (`vercel whoami` → Not authorized); `.vercel/project.json` está correto. Gabriel precisa rodar `vercel login` uma vez — a Fase 3 está commitada e pushada, mas **sem preview publicado**.

## Notion
Ecossistema do projeto em Notion ("Traxium HQ") — ver memória do Claude `notion-traxium-hq.md`. Docs/pesquisa/decisões moram lá; repo é fonte de verdade técnica.
