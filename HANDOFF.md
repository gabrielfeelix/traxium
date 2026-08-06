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

### Revisão de UI/UX (commit `3fa2c2e`) — ver `REVISAO-UI-UX.md`
- **Shell responsivo**: sidebar fixa só em `lg`; abaixo disso a mesma nav vai para drawer (`SidebarDrawer`), acionado pelo botão da topbar. `Sheet` ganhou `side="left"`. Copilot e nome do usuário só em `xl` (em `lg` a sidebar já come 260px).
- **Contraste**: `fg-soft` foi para `210 14% 46%` (4,72:1); brancos da sidebar para `white/55`. `success-500`/`warning-500` **ficam como estão** — são usados em ícone, onde o critério é 3:1.
- **Movimento**: `prefers-reduced-motion` global (não existia). `.animate-list-in` na fila/legenda/registro; `.skeleton` nos dois `dynamic()` de Leaflet. `animate-slide-in` e `.animate-shimmer` foram removidos: eram declarados e nunca usados.
- **Torre**: fila agrupada por severidade com espinha contínua + **tempo em fila** (contado contra `HOJE`, não `Date.now()`). "Pilares do MVP" virou "Onde a pendência está".

### Fase 0 + Fase 4 (commits `25c168c`…`e1a0bf2`) — Academy
- **Vitest no domínio** (`pnpm test`). O repo usa **pnpm**, não npm. Testes só de `src/lib/**`; telas continuam verificadas rodando o app. `rules-engine.test.ts` é caracterização: trava o motor antes de a Fase 5 reescrevê-lo.
- **`src/lib/domain/academy.ts`**: as 10 trilhas da diretriz, `Conclusao` (nota, tentativas, aceite, versão do conteúdo, certificado), `competenciaMotorista()` derivando elegibilidade, `estadoTrilha()`, `trilhasJustInTime()`, `orientacaoDoRegime()`. **Junção por `motorista.id`** — os CPFs no mock estão mascarados por LGPD.
- **Elegibilidade no despacho**: `nova-viagem-modal` desabilita o motorista inelegível com o motivo (não esconde), e `podeCriar` trava se trocar o compartimento tornar o escolhido inelegível.
- **`/academy`**: matriz motorista × trilha, catálogo com as regras de liberação, export CSV para auditoria, modal de registro de conclusão. `registrarConclusao` recusa nota abaixo do mínimo, tentativas esgotadas ou falta de aceite.
- **Anel de competência** no crachá: um arco por trilha obrigatória. Substituiu o gauge de conformidade média.
- **Micro-treino just-in-time** em `/mobile`, separando trilha pendente (requisito) de orientação do regime (revisão).

### Fase 5 (commit `50427c7`) — motor completo e configurável
- **`src/lib/domain/motor-config.ts`**: `ClasseRegra` (bloqueio/alerta/registro/informação), `RegraId` (12 regras), `CLASSE_MINIMA` (**piso por regra**) e `setClasseRegra` que recusa rebaixamento. 7 regras travadas em bloqueio — senão a trava da Fase 3 seria contornável pelas Configurações.
- **`avaliarCarregamento` reescrito**: avalia as 12 e decide pela classe mais severa entre as falhas, com desempate pela ordem de `ORDEM_REGRAS`. **A ordem das 5 primeiras é histórica de propósito** — mudá-la trocaria a `regra` reportada, que outras telas já leem. `Decisao.checagens` agora traz `regra`, `classe` e as 12 sempre.
- **Condições novas**: cadastro do subcontratado, acordo vigente, competência do motorista, produto reconhecido, fotos mínimas. `InspectionEvent.fotos` foi modelado (`FOTOS_MINIMAS = 6`); as duas telas que criam inspeção passam a contagem real.
- **Aba "Motor de regras"** em `/configuracoes`.
- ⚠️ **A automação caiu de 60% para 40% e isso está certo**: a regra antiga de checklist só bloqueava inspeção "reprovada", então viagem **sem inspeção nenhuma** era liberada automaticamente. Não reverta achando que é regressão.

### Fase 6 — Gatekeeper completo
- **`src/app/convite/[token]/page.tsx`** — onboarding público, **fora de `(app)`** (rota sem shell por construção). Seis passos, um assunto por tela. Cria via `addSubcontratadoPreCadastro`, sempre `Pré-cadastrado`.
- **`qrcode-generator`** (dependência nova, ~10KB, zero deps) → `components/gatekeeper/qr-convite.tsx`, SVG inline. O link aponta para `window.location.origin`, então o QR funciona em preview e local.
- **`components/gatekeeper/assinatura-canvas.tsx`** — extraído do `AssinaturaScreen` do `/mobile`. Usar este, não duplicar o traço.
- **`assinar-acordo-modal.tsx` + `assinarAcordo` no store** — fecha o ciclo que a Fase 5 abriu: `acordo_vigente` bloqueava sem oferecer saída.
- **Checklist**: `CONDICOES_POR_TIPO` por `Implemento["tipo"]` e flag `critico`. Item crítico negativo reprova sozinho; não crítico → pendente.
- **Passaporte**: blocos de inspeções e "apto para". O regime máximo sai de `cleaningEvents` reais.

## Mapa MVP: pilar → telas
Torre de Controle (home + /viagens + /excecoes + /bloqueios + /dossie) · Gatekeeper (/subcontratados + /checklists) · Academy (/motoristas) · IDTF Brasil (/idtf + /limpezas) · Network (/frota) · App do motorista (/mobile). Escondido no MVP: /fazendas /lotes /traces /auditoria /conformidade /documentos /atividade + superfícies Console/Portal/Auditor.

## Próximo — ver `PLANO-COBERTURA-PDF.md`
O roadmap completo (fases 5 a 10) fechando todas as lacunas de `PAREAMENTO-PDF.md` está lá, com decisões de UX fixadas e critério de aceite por fase.

**Fases 0, 4, 5 e 6 entregues.** A próxima é a **Fase 7 — Control Tower completo**: motivo padronizado na liberação manual (hoje é texto livre e não sobrevive a auditoria), os 9 campos do registro de liberação, hierarquia com os 6 níveis e dossiê com os 16 itens. Fases 7 e 8 são paralelizáveis.

## Ainda faltando no Gatekeeper (deixado de propósito na Fase 2)
Página pública de onboarding (fluxo do transportador), assinatura eletrônica real do acordo, "Pendente de inspeção" derivado, QR real. Ver §Gatekeeper do PDF.

## Ainda faltando no Control Tower (deixado de propósito na Fase 3)
- **Reavaliação após regularização**: hoje o bloqueio técnico só cai porque o motor recalcula a cada render. Falta a ação explícita ("registrar limpeza → reavaliar") fechando o ciclo na tela, com o antes/depois visível.
- **Trilha temporal da decisão automática**: `avaliadoEm` usa `viagem.iniciadaEm`. Um ledger real (append-only, com a versão da base vigente em cada avaliação) é o que sustenta "o motor decidiu às 14:22 com a base 2026.05".
- **Regras novas não mapeadas** caem no fallback `gestor` em `autoridadeDaRegra()`. Ao acrescentar regra ao motor, mapear a autoridade junto — senão vira aprovável por descuido.

## Dívida de UI/UX ainda aberta (ver `REVISAO-UI-UX.md`)
- **PageHeaders longos** em quase todas as páginas (Subcontratados tem ~50 palavras antes do primeiro dado). Só a Torre foi enxugada.
- **`transition-all` em ~43 lugares** — anima layout junto com cor. Só `input.tsx` e três telas foram estreitados.
- **`emFilaDesde` só existe em `ProdutoIDTF`.** Subcontratado pendente não guarda desde quando espera, então não mostra tempo em fila. Para cobertura total do §Control Tower, o estado de qualificação precisa carregar carimbo.
- **Telas fora do MVP não foram revisadas** em 375/768 (só o shell foi corrigido, o que já resolve o overflow; o conteúdo interno de /traces, /lotes, /fazendas não foi olhado).

## Pendência operacional
`vercel deploy` está **não autorizado** nesta máquina (`vercel whoami` → Not authorized); `.vercel/project.json` está correto. Gabriel precisa rodar `vercel login` uma vez — a Fase 3 está commitada e pushada, mas **sem preview publicado**.

## Notion
Ecossistema do projeto em Notion ("Traxium HQ") — ver memória do Claude `notion-traxium-hq.md`. Docs/pesquisa/decisões moram lá; repo é fonte de verdade técnica.
