# HANDOFF — Traxium

Para quem chega sem contexto. Leia as seções 1 a 4 antes de tocar em qualquer arquivo; elas custam cinco minutos e evitam os erros que já custaram caro.

---

## 1. O que é isto

Protótipo Next.js 16.2.6 (App Router, Turbopack), TS estrito, Tailwind v4, Radix. **Sem backend**: os dados vivem em `src/lib/mock-data.ts` e `src/lib/domain/`; o store (`src/lib/store/session.tsx`) muta os arrays exportados **in-place** e chama `bump()` para re-render. Recarregar a página zera tudo — é o comportamento esperado.

O produto é a camada operacional que decide se uma carga pode seguir sob a cadeia GMP+ FSA: **qualifica, verifica, bloqueia, libera e comprova cada transporte**. Não é um gestor de documentos.

**Branch de trabalho: `fix/ux-fase-1-3`.** `main` **não tem** o modo MVP — quando for abrir PR, é este branch que vai por cima.

## 2. Comandos

```bash
pnpm install          # pnpm, NÃO npm — ver armadilha #1
pnpm dev              # localhost:3000
pnpm test             # vitest, só o domínio (src/lib/**)
npx tsc --noEmit      # antes de todo commit
npm run build         # antes de todo commit
```

## 3. Armadilhas — leia antes de debugar

**1. O repo é pnpm.** Existe `pnpm-lock.yaml`. `npm install` quebra com `Cannot read properties of null (reading 'matches')`. Se o `node_modules` parecer corrompido, foi isso.

**2. A taxa de automação da Torre é 40%, e isso está certo.** Já foi 60%. A regra antiga de checklist só bloqueava inspeção explicitamente *reprovada*, então viagem **sem inspeção nenhuma** era liberada automaticamente. A Fase 5 corrigiu. **Não "conserte" o 40% de volta para 60%.**

**3. Os testes de `rules-engine.test.ts` são de caracterização.** Existem para segurar refatorações do motor. Se um quebrar num refactor, o padrão é: investigar o que mudou de comportamento, **não** ajustar a asserção para passar.

**4. A ordem de `ORDEM_REGRAS` em `motor-config.ts` é deliberada.** As cinco primeiras mantêm a precedência histórica do motor. Reordenar troca a `regra` reportada em `Decisao`, que `control-tower.ts`, `/excecoes` e o mock de exceções já leem por string.

**5. Os CPFs em `mock-data.ts` estão mascarados** (`***.456.789-**`) por LGPD. Não servem de chave. Junção de motorista é sempre por `motorista.id`.

**6. Datas contam contra `HOJE` (`2026-07-08`), não `Date.now()`.** `tempoEmFila()`, `competenciaMotorista()` e `nivelVencimento()` usam a data de referência do protótipo. Usar o relógio real faz as idades crescerem sozinhas e os números mentirem.

**7. O PDF da diretriz é gitignored.** `Traxium - 5 Pilares prioritários.pdf` não vem no clone. Peça ao Gabriel se precisar. O conteúdo dele já está destrinchado em `PAREAMENTO-PDF.md`.

**8. `vercel deploy` está não autorizado nesta máquina.** `vercel whoami` → *Not authorized*; o `.vercel/project.json` está correto. Precisa de um `vercel login` do Gabriel. **Nada foi publicado em preview desde a Fase 3** — todas as fases estão commitadas e pushadas, nenhuma está no ar.

## 4. O princípio que sustenta o código

**Estado nunca é campo editável. Estado é derivado do fato.**

Quatro funções são o coração do produto e todas seguem isso:

| Função | Onde | Deriva |
| --- | --- | --- |
| `estadoQualificacao(sub)` | `model.ts` | 9 estados da empresa, de cert + base pública + acordo + treinamento |
| `competenciaMotorista(id, hoje?, ctx?)` | `academy.ts` | elegibilidade do motorista, das trilhas concluídas |
| `avaliarCarregamento(viagemId)` | `rules-engine.ts` | 12 condições → decisão, pela classe mais severa entre as falhas |
| `triarViagem(viagem)` | `control-tower.ts` | verde/amarelo/vermelho + **quem liberou** (motor ou autoridade) |

Ao acrescentar qualquer regra ou estado, derive. Um campo `status` editável à mão é regressão arquitetural, mesmo que a tela fique igual.

Corolários que já foram testados na prática e devem se manter:
- Assinar o acordo de uma empresa **não** a torna apta se a base pública ainda diz Suspenso.
- Reprovar numa trilha **não** gera competência.
- Exceção aprovada libera a viagem, mas o motor **continua reprovando** — o fato não mudou, e os dois ficam registrados.

## 5. Regras não negociáveis

- **Honestidade de dado.** Nenhum toast, número ou estado que não venha do store. Sem dado → empty state, nunca um valor plausível. Se uma métrica não é medível, escreva "não medido"; não invente.
- **`DESIGN.md` prevalece** sobre o código. Sombras brand-tinted, bordas HSL-200, `.num` em números, **sem emoji decorativo**, PT formal-direto, gradiente 135° só em momento-chave.
- **Contraste mínimo 4,5:1** para texto (§14). Ícone responde a 3:1.
- **`AGENTS.md`**: ler `node_modules/next/dist/docs/` antes de usar API do Next que você não conhece neste repo.
- Fim de cada fase: **commit + push + deploy**, commit em PT conventional, com `tsc` e `build` limpos antes.

## 6. Como verificar de verdade

`tsc` e `build` não provam que a tela funciona. O ciclo usado até aqui:

```bash
pnpm dev &
# screenshot simples:
~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1280,1000 --virtual-time-budget=7000 \
  --screenshot=/tmp/x.png http://localhost:3000/
```

Para fluxos com clique (modais, drawer, formulários), há `playwright-core` disponível em `/mnt/d/solar-buy-side-v2/node_modules/playwright-core` — importar de lá num `.mjs` e dirigir a página. Foi assim que se verificou o gate de reprovação da Academy, o drawer mobile e a assinatura do acordo. **Olhe o screenshot.** Frame em branco é falha de carregamento.

Sempre conferir 375 / 768 / 1280.

## 7. Onde o projeto está

Diretriz do P.O.: 5 pilares. Estado por pilar (detalhe item a item em **`PAREAMENTO-PDF.md`**):

| Pilar | Estado |
| --- | --- |
| 1 · Gatekeeper | ✓ fechado (Fase 6) |
| 2 · Academy | ✓ fechado no essencial (Fase 4) |
| 3 · IDTF Brasil | ~ 2/3 — falta cadastro de 18 campos e governança da base |
| 4 · Control Tower | ✓ fechado (Fases 3 e 5) |
| 5 · Network | ~ 1/4 — falta m:n, importação, operação em massa |
| Transversais | ~ 3/4 — falta LGPD (retenção, inativação, consentimentos) |
| §8 Indicadores | ✗ 1 de 15 |

## 8. O que vem agora

O roadmap completo está em **`PLANO-COBERTURA-PDF.md`**, com decisões de UX já fixadas e critério de aceite por fase. Fases 0, 4, 5 e 6 estão entregues.

**Próxima: Fase 7 — Control Tower completo.** As fases 7 e 8 são paralelizáveis.

1. **Motivo padronizado na liberação manual.** Hoje é texto livre, e texto livre não sobrevive a auditoria. Vira lista fechada por regra (`MOTIVOS_POR_REGRA: Record<RegraId, string[]>`), com a justificativa livre continuando como complemento, nunca no lugar.
2. **Os 9 campos do registro de liberação** (§Control Tower): motivo padronizado, justificativa, evidência, responsável, data/hora, **situação anterior**, **situação posterior**, **impacto**, **validade da decisão**. Anterior/posterior saem automaticamente do estado da viagem.
3. **Hierarquia com os 6 níveis.** `NivelAutoridade` tem 4; faltam `trafego` (pendências simples) e `inspetor` (condição física do compartimento).
4. **Dossiê com os 16 itens.** Hoje são 9 seções; faltam transportador, cavalo mecânico, assinaturas, acordo vigente, treinamentos e documentos da viagem. **Cada bloco novo entra na cadeia de hash.**

## 9. Dívida conhecida (deixada de propósito)

**Control Tower**
- Reavaliação após regularização só acontece porque o motor recalcula a cada render. Falta a ação explícita ("registrar limpeza → reavaliar") com o antes/depois visível.
- `avaliadoEm` usa `viagem.iniciadaEm`. Um ledger append-only, com a versão da base vigente em cada avaliação, é o que sustentaria "o motor decidiu às 14:22 com a base 2026.05".
- Regra nova não mapeada cai no fallback `gestor` em `autoridadeDaRegra()`. **Ao acrescentar regra ao motor, mapeie a autoridade junto** — senão vira aprovável por descuido.

**Academy**
- Não existe conteúdo (vídeo/PDF), só o registro da avaliação.
- Regras de liberação por cliente, produto ou filial não existem — só por trilha.
- Dois dos cinco gatilhos just-in-time faltam: produto sensível e item de checklist reprovado.

**UI/UX** (ver `REVISAO-UI-UX.md`)
- PageHeaders longos em quase todas as páginas; só a Torre foi enxugada.
- `transition-all` em ~43 lugares.
- `emFilaDesde` só existe em `ProdutoIDTF`; subcontratado pendente não mostra tempo em fila.
- Telas fora do MVP (`/traces`, `/lotes`, `/fazendas`) não foram olhadas em 375/768 — o shell já resolve o overflow, mas o conteúdo interno não foi revisado.

**Indicadores (§8)** — vários dependem de telemetria que um protótipo sem backend não tem (tempo médio de cadastro, tempo de checklist, % de fotos rejeitadas). A Fase 10 os marca como **"não medido"** em vez de fabricar número. Se o P.O. quiser esses de verdade, é decisão de arquitetura, não de tela.

## 10. Mapa de arquivos

```
src/lib/domain/
  model.ts           # entidades, estadoQualificacao, tipos de vínculo, acordo
  rules-engine.ts    # avaliarCarregamento (12 condições) + CAPA + T-3
  motor-config.ts    # 4 classes, 12 RegraId, piso por regra
  academy.ts         # trilhas, conclusões, competenciaMotorista
  control-tower.ts   # triagem, automação, autoridadeDaRegra, tempoEmFila
  __tests__/         # vitest (30 testes)
src/lib/store/session.tsx   # todas as ações de escrita
src/components/shell/       # sidebar (+drawer), topbar, torre-de-controle
src/app/(app)/              # back-office (tem shell)
src/app/convite/[token]/    # onboarding público (SEM shell, de propósito)
```

**Documentos:** `PAREAMENTO-PDF.md` (diretriz × entregue, item a item) · `PLANO-COBERTURA-PDF.md` (roadmap fases 7–10) · `REVISAO-UI-UX.md` (revisão visual com medições de contraste) · `DESIGN.md` (design system) · `PLANO-PRODUTO.md`, `PESQUISA-UX.md`.

## 11. Log das fases

| Fase | Commit | Entrega |
| --- | --- | --- |
| 1 | `70aeef8` | Modo MVP, sidebar por pilar, Torre de Controle, correções §5 do PDF |
| 2 | `8e562c7` | Gatekeeper: 9 estados derivados, Passaporte, convite por link |
| — | `057e112` | Merge de `main` (o branch estava 8 commits atrás) |
| 3 | `21b54d5` | Control Tower: triagem, nível `tecnico` (sem "aprovar mesmo assim"), dossiê com autoridade |
| — | `3fa2c2e` | Revisão de UI/UX: shell responsivo, contraste AA, reduced-motion, fila com espinha e tempo em fila |
| 0 | `25c168c` | Vitest no domínio + caracterização do motor |
| 4 | `a76cf16`…`e1a0bf2` | Academy: competência derivada, elegibilidade no despacho, `/academy`, anel no crachá, just-in-time |
| 5 | `50427c7` | Motor: 12 condições avaliadas antes de decidir, 4 classes configuráveis com piso |
| 6 | `9110cd3` | Gatekeeper: onboarding público, QR real, acordo assinável, checklist dinâmico, passaporte completo |

## 12. Notion

Ecossistema do projeto em Notion ("Traxium HQ") — ver memória `notion-traxium-hq.md`. Docs, pesquisa e decisões moram lá; o repo é a fonte de verdade técnica.
