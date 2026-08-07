# Fluxos de Produto e Skeletons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Amarrar os ciclos de cadastro, qualificação, acesso e histórico do Traxium, começando por estados de carregamento consistentes e pelo fluxo de subcontratados.

**Architecture:** Preservar a interface atual e concentrar regras em módulos puros de domínio. As rotas usam componentes compartilhados para estados de carregamento; cadastros, importações e convites convergem para o mesmo ciclo, com origem e próximos passos explícitos. Registros operacionais continuam imutáveis e recebem retificações, enquanto dados mestres mantêm histórico de alterações.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest.

---

### Task 1: Inventário e contrato de carregamento

**Files:**
- Create: `src/components/shell/page-skeleton.tsx`
- Create: `src/app/(app)/loading.tsx`
- Create: `src/app/(auth)/loading.tsx`
- Create: `src/app/convite/[token]/loading.tsx`

**Step 1:** Confirmar quais segmentos possuem `loading.tsx` e agrupar as páginas por formato: back-office, autenticação e onboarding público.

**Step 2:** Criar skeletons sem JavaScript de cliente, com dimensões estáveis, `motion-safe:animate-pulse`, `role="status"` e texto acessível.

**Step 3:** Adicionar os limites de carregamento nos três segmentos para cobrir todas as páginas atuais sem duplicar componentes por rota.

**Step 4:** Executar `pnpm test` e `pnpm build`; esperado: testes e build aprovados.

**Step 5:** Revisar visualmente `/`, `/subcontratados`, `/login` e `/convite/demo` em 1366, 1280 e 375 px.

### Task 2: Modelo único de entrada de subcontratados

**Files:**
- Create: `src/lib/domain/onboarding.ts`
- Create: `src/lib/domain/__tests__/onboarding.test.ts`
- Modify: `src/lib/domain/model.ts`
- Modify: `src/lib/store/session.tsx`

**Step 1:** Escrever testes para as origens `manual`, `importacao` e `convite`, todas iniciando no mesmo ciclo de pré-cadastro/qualificação.

**Step 2:** Modelar estado do convite: não enviado, enviado, aberto, concluído, expirado e revogado.

**Step 3:** Modelar o próximo passo derivado sem marcar nenhuma empresa como apta apenas pela origem do registro.

**Step 4:** Integrar as mutações de sessão ao modelo e executar os testes de domínio.

### Task 3: Tornar as três portas de entrada explícitas

**Files:**
- Modify: `src/app/(app)/subcontratados/page.tsx`
- Modify: `src/components/modals/qualificar-subcontratado-modal.tsx`
- Modify: `src/components/modals/importar-planilha-modal.tsx`
- Modify: `src/components/modals/onboarding-link-modal.tsx`

**Step 1:** Renomear a entrada individual para “Cadastrar manualmente” e explicar que ela não envia acesso por padrão.

**Step 2:** Fazer a importação terminar numa revisão, oferecendo envio posterior de onboarding em massa.

**Step 3:** Fazer o convite exibir destinatário, canal, validade e estado.

**Step 4:** Mostrar origem, estado e próximo passo na listagem/detalhe do subcontratado.

**Step 5:** Validar cadastro individual, importação e convite de ponta a ponta.

### Task 4: Resolver empresa, TAC e motorista sem vínculo circular

**Files:**
- Modify: `src/components/modals/cadastrar-motorista-modal.tsx`
- Modify: `src/components/modals/qualificar-subcontratado-modal.tsx`
- Modify: `src/app/(app)/motoristas/page.tsx`
- Modify: `src/lib/store/session.tsx`
- Test: `src/lib/domain/__tests__/network.test.ts`

**Step 1:** Cobrir por teste vínculo com vigência e troca de empresa sem reescrever histórico.

**Step 2:** Permitir, a partir da empresa, vincular existente, cadastrar novo ou convidar motorista.

**Step 3:** Representar TAC como uma pessoa que pode acumular perfil transportador e motorista sem duplicar identidade.

**Step 4:** Separar convite para fornecer dados de convite para acessar o App de Campo.

### Task 5: Provisionamento por superfície

**Files:**
- Modify: `src/lib/domain/model.ts`
- Modify: `src/components/shell/perfil-switcher.tsx`
- Modify: `src/components/modals/convidar-usuario-modal.tsx`
- Modify: `src/app/(app)/configuracoes/page.tsx`
- Modify: `src/components/shell/surfaces/portal-d.tsx`
- Modify: `src/components/shell/surfaces/visao-auditor-e.tsx`

**Step 1:** Separar auditor interno de auditor externo no vocabulário e nas permissões.

**Step 2:** Manter auditor externo como exportação no MVP e rotular login read-only como Fase 2.

**Step 3:** Criar contrato de acesso para administrador do subcontratado e para seus motoristas.

**Step 4:** Exibir expiração, revogação e registro de acesso nos convites externos.

### Task 6: Padrão de listas grandes e filtros

**Files:**
- Create: `src/components/kit/list-toolbar.tsx`
- Create: `src/components/kit/pagination.tsx`
- Create: `src/lib/domain/__tests__/pagination.test.ts`
- Modify: `src/app/(app)/bloqueios/page.tsx`
- Modify: `src/app/(app)/limpezas/page.tsx`
- Modify: `src/app/(app)/viagens/page.tsx`
- Modify: `src/app/(app)/subcontratados/page.tsx`
- Modify: `src/app/(app)/motoristas/page.tsx`
- Modify: `src/app/(app)/frota/page.tsx`

**Step 1:** Testar paginação determinística e contagem sobre o conjunto filtrado completo.

**Step 2:** Criar paginação de 25/50 itens e toolbar com “Mais filtros”.

**Step 3:** Persistir busca, filtros, ordenação e página nos parâmetros da URL.

**Step 4:** Aplicar `content-visibility` às listas longas e validar com 80 e 1.000 registros sintéticos.

### Task 7: Responsividade do back-office

**Files:**
- Modify: `src/components/shell/surface-shell.tsx`
- Modify: `src/components/shell/sidebar.tsx`
- Modify: páginas que ainda excederem a viewport após medição.

**Step 1:** Criar medição automatizada de `scrollWidth - clientWidth` nas rotas críticas.

**Step 2:** Eliminar larguras mínimas rígidas, priorizar colunas e mover detalhes para drawers.

**Step 3:** Validar 1560, 1366, 1280, 1024, 768 e 375 px sem corte horizontal global.

### Task 8: Padronizar CRUD e retificação

**Files:**
- Modify: `src/app/(app)/idtf/page.tsx`
- Modify: `src/app/(app)/frota/page.tsx`
- Modify: `src/app/(app)/viagens/page.tsx`
- Modify: `src/app/(app)/limpezas/page.tsx`
- Modify: `src/app/(app)/checklists/page.tsx`
- Modify: `src/app/(app)/bloqueios/page.tsx`

**Step 1:** Dados mestres recebem editar, inativar/arquivar e histórico.

**Step 2:** Registros sincronizados recebem somente retificação com autor, data e justificativa.

**Step 3:** Padronizar exportação conforme o filtro atual e registrar o escopo exportado.

**Step 4:** Revisar o texto do Motor IDTF e substituir “Usar mesmo assim” por ação inequívoca.

### Task 9: Verificação e entrega

**Files:**
- Modify: `HANDOFF.md`

**Step 1:** Executar `pnpm test`.

**Step 2:** Executar `pnpm build`.

**Step 3:** Percorrer os fluxos manual, importação, convite, vínculo de motorista, auditor e retificação com Playwright.

**Step 4:** Validar console do navegador e responsividade nas rotas críticas.

**Step 5:** Atualizar o handoff com comportamento entregue, riscos e próximos itens; só publicar na Vercel após aprovação local.
