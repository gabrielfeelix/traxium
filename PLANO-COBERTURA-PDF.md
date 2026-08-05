# Plano de cobertura da diretriz do P.O. — Fases 4 a 10

> **Para quem executar:** as etapas usam `- [ ]` para acompanhamento. Cada tarefa termina em algo verificável e commitável. Execute uma tarefa por vez e rode a verificação antes de commitar.

**Objetivo:** fechar todas as lacunas apontadas em `PAREAMENTO-PDF.md`, deixando o motor de regras completo (as 8 condições do verde) e configurável (as 4 classes de regra).

**Arquitetura:** o domínio (`src/lib/domain/`) continua sendo funções puras sobre arrays em memória; as telas derivam tudo dele. Duas mudanças estruturais: (1) o motor passa a **avaliar todas as condições** e só então decidir, em vez de sair na primeira falha — isso é o que permite o verde exigir 8 checagens e o dossiê mostrar o quadro inteiro; (2) a classe de cada regra vira **configuração**, com piso por regra para que nenhuma regra crítica possa ser rebaixada.

**Stack:** Next.js 16.2.6 (App Router, Turbopack), TS estrito, Tailwind v4, Radix. Sem backend.

## Restrições globais

Valem para toda tarefa, sem repetição nos passos:

- **Honestidade de dado.** Nenhum número, toast ou estado que não venha do store. Sem dado → empty state, nunca um valor plausível.
- **`DESIGN.md` prevalece.** Sombras brand-tinted, bordas HSL-200, `.num` em números, sem emoji decorativo, PT formal-direto, gradiente 135° só em momento-chave.
- **Contraste mínimo 4,5:1** para texto (`DESIGN.md` §14). Ícone responde a 3:1.
- **`AGENTS.md`:** ler `node_modules/next/dist/docs/` antes de usar API do Next que você não tenha usado neste repo.
- **Responsivo em 375 / 768 / 1280.** O shell já resolve; o conteúdo novo é responsabilidade da tarefa.
- **Commits em PT, conventional.** Antes de cada commit: `npx tsc --noEmit` e `npm run build`.

## Verificação — adaptação necessária

O repo **não tem test runner** (`package.json` só tem `dev`/`build`/`start`). O plano não finge que tem. Duas consequências:

1. **A Tarefa 0 instala Vitest para `src/lib/domain/**`.** Não é cerimônia: são 1.647 linhas de função pura sem React, e a Fase 5 vai triplicar a complexidade do motor. Regra de decisão errada aqui libera carga contaminada — é o único código do repo que merece teste de verdade.
2. **Telas continuam verificadas rodando o app**: `npm run dev`, navegação dirigida e leitura da tela. Não há teste de componente e o plano não pede.

---

# Sequência e dependências

| Fase | Entrega | Depende de |
| --- | --- | --- |
| **0** | Vitest no domínio | — |
| **4** | Academy: competência, trilhas, avaliação, elegibilidade | 0 |
| **5** | Motor completo (8 condições) e configurável (4 classes) | 4 |
| **6** | Gatekeeper: onboarding público, acordo assinado, checklist dinâmico | 5 |
| **7** | Control Tower: liberação padronizada, dossiê completo, painel | 5 |
| **8** | IDTF: cadastro completo e governança da base | 5 |
| **9** | Network: m:n, importação, operação em massa | 6 |
| **10** | Transversais: LGPD e indicadores do MVP | 7, 8, 9 |

A ordem não é arbitrária. **Academy vem antes do motor** porque a competência do motorista é uma das oito condições do verde — inverter obrigaria a mexer no motor duas vezes. E **6, 7 e 8 são paralelizáveis** entre si depois da 5.

---

# Decisões de UX que este plano fixa

Registradas aqui porque mudam o que se constrói, e não devem ser redecididas dentro de uma tarefa.

### 1. Motorista inelegível aparece desabilitado, não some

O PDF diz "não aparece como elegível". A leitura literal — sumir da lista — é pior UX: o despachante procura o Mauricio, não acha, e conclui que o cadastro sumiu. **Decisão: aparece, desabilitado, com o motivo e o caminho.** "Mauricio Lima — treinamento GMP+ vencido há 87 dias · atribuir trilha". Cumpre o princípio (não é selecionável) e ensina.

### 2. Academy tem casa própria em `/academy`

`/motoristas` é o cadastro e continua sendo. `/academy` é a sala virtual (trilhas, turmas, avaliações). O crachá em `/motoristas` ganha o anel de competência e leva para lá. Separar evita que a tela de cadastro vire um caldeirão.

### 3. O momento-assinatura do Academy é o anel de competência no crachá

O crachá já existe e já tem anel de conformidade. Ele passa a mostrar **competência por trilha** em segmentos do anel — cada arco é uma trilha exigida, cheio se vigente, vazado se vencido. Lê-se a elegibilidade de longe, sem texto. É a mesma gramática do horizonte de vencimento e da matriz de sequenciamento: a regra virando forma.

### 4. Regra crítica não pode ser rebaixada na configuração

O motor vira configurável, mas com **piso por regra**. "Carga anterior proibida" não pode virar "informação complementar" nem que o admin queira. Na tela, essas regras aparecem travadas com o motivo. É o mesmo princípio do "sem aprovar mesmo assim", aplicado à configuração — senão a trava da Fase 3 seria contornável pelas Configurações.

### 5. Motivo padronizado é lista fechada por regra

O PDF pede "motivo padronizado" no registro da liberação manual. Texto livre não sobrevive a auditoria. Cada regra do motor passa a ter sua lista de motivos aceitáveis; a justificativa livre continua, mas **como complemento**, nunca no lugar.

### 6. Onboarding público vive fora do shell

`/convite/[token]` não tem sidebar nem topbar — quem abre é um TAC no celular, no pátio. Mobile-first, botões grandes, um campo por vez, ≤5 minutos, conforme §4 "baixa fricção".

---

# Fase 0 · Vitest no domínio

**Arquivos**
- Modificar: `package.json`
- Criar: `vitest.config.ts`
- Criar: `src/lib/domain/__tests__/rules-engine.test.ts`

**Interfaces**
- Produz: comando `npm test`, consumido por todas as fases seguintes.

- [ ] **Passo 1: instalar**

```bash
npm i -D vitest@^3
```

- [ ] **Passo 2: configurar**

Criar `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["src/lib/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

Em `package.json`, adicionar aos `scripts`: `"test": "vitest run"`.

- [ ] **Passo 3: teste de caracterização do motor atual**

Trava o comportamento existente antes de a Fase 5 mexer nele. Criar `src/lib/domain/__tests__/rules-engine.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { avaliarCarregamento, getT3 } from "../rules-engine";

describe("avaliarCarregamento — comportamento atual", () => {
  it("bloqueia v-002: carga anterior proibida sem limpeza D", () => {
    const d = avaliarCarregamento("v-002");
    expect(d.tier).toBe("BLOQUEIO");
    expect(d.regra).toBe("Carga anterior proibida");
  });

  it("libera v-001 com todas as checagens ok", () => {
    const d = avaliarCarregamento("v-001");
    expect(d.tier).toBe("LIBERADO");
    expect(d.checagens.every((c) => c.ok)).toBe(true);
  });

  it("grava a versão da base usada na decisão", () => {
    expect(avaliarCarregamento("v-001").versaoBaseIDTF).toBe("IDTF-BR 2026.05");
  });

  it("T-3 do compartimento traz 3 cargas, mais recente primeiro", () => {
    const t3 = getT3("comp-002");
    expect(t3).toHaveLength(3);
    expect(t3[0].determinante).toBe(true);
  });
});
```

- [ ] **Passo 4: rodar**

`npm test` — esperado: 4 passando. Se algum falhar, o teste está errado sobre o mock; corrija o teste, não o motor.

- [ ] **Passo 5: commitar**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/domain/__tests__/
git commit -m "test: vitest no domínio, com caracterização do motor antes da Fase 5"
```

---

# Fase 4 · Academy

**Meta:** entregar competência derivada e a regra de elegibilidade. O princípio central do Pilar 2 sai do PDF e entra no código.

**Arquivos**
- Criar: `src/lib/domain/academy.ts` — trilhas, conclusões, competência, gatilhos
- Criar: `src/lib/domain/__tests__/academy.test.ts`
- Criar: `src/app/(app)/academy/page.tsx` — sala virtual
- Criar: `src/components/academy/anel-competencia.tsx` — o anel segmentado
- Criar: `src/components/modals/atribuir-trilha-modal.tsx`
- Modificar: `src/components/motoristas/credencial.tsx` — anel de competência
- Modificar: `src/components/modals/nova-viagem-modal.tsx` — select com inelegíveis desabilitados
- Modificar: `src/components/shell/sidebar.tsx` — item `/academy` no pilar Academy
- Modificar: `src/app/(app)/mobile/page.tsx` — micro-treino just-in-time

**Interfaces**
- Consome: `Regime`, `HOJE`, `diasEntre` de `model.ts`; `motoristas` de `mock-data.ts`.
- Produz: `competenciaMotorista(motoristaId, hoje?, ctx?)`, `trilhasExigidas(ctx)`, `trilhasJustInTime(motoristaId, ctx)`, `TRILHAS`, `conclusoes` — a Fase 5 consome `competenciaMotorista().elegivel`.
- **Chave de junção é `motorista.id`, não CPF**: os CPFs em `mock-data.ts` estão mascarados por LGPD (`***.456.789-**`) e não identificam ninguém.

### Tarefa 4.1 — modelo de competência

- [ ] **Passo 1: teste primeiro**

Criar `src/lib/domain/__tests__/academy.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { competenciaMotorista, trilhasExigidas } from "../academy";

describe("competenciaMotorista", () => {
  it("motorista com todas as trilhas obrigatórias vigentes é elegível", () => {
    const c = competenciaMotorista("m-001");
    expect(c.elegivel).toBe(true);
    expect(c.situacao).toBe("apto");
  });

  it("trilha obrigatória vencida torna inelegível e explica o motivo", () => {
    const c = competenciaMotorista("m-002");
    expect(c.elegivel).toBe(false);
    expect(c.situacao).toBe("vencida");
    expect(c.motivo).toMatch(/vencid/i);
    expect(c.trilhasPendentes.length).toBeGreaterThan(0);
  });

  it("nunca fez a trilha obrigatória é inelegível, e não 'vencida'", () => {
    const c = competenciaMotorista("m-999");
    expect(c.situacao).toBe("nunca_fez");
    expect(c.elegivel).toBe(false);
  });

  it("a vencer em menos de 30 dias ainda é elegível, mas sinaliza", () => {
    const c = competenciaMotorista("m-003");
    expect(c.elegivel).toBe(true);
    expect(c.situacao).toBe("a_vencer");
  });
});

describe("trilhasExigidas", () => {
  it("regime D exige a trilha de cargas proibidas além das obrigatórias", () => {
    const t = trilhasExigidas({ regime: "D", gatekeeper: false });
    expect(t.map((x) => x.codigo)).toContain("T04");
  });

  it("operação gatekeeper exige a trilha específica", () => {
    const t = trilhasExigidas({ regime: "A", gatekeeper: true });
    expect(t.map((x) => x.codigo)).toContain("T10");
  });
});
```

- [ ] **Passo 2: rodar e ver falhar**

`npm test` — esperado: falha com "Cannot find module '../academy'".

- [ ] **Passo 3: implementar o módulo**

Criar `src/lib/domain/academy.ts` com as 10 trilhas do PDF (§Pilar 2, "Primeiras trilhas recomendadas"), na ordem em que ele lista:

```ts
// TRAXIUM Academy — competência como requisito de elegibilidade, não como
// certificado arquivado (PDF §Pilar 2). O princípio: motorista sem competência
// comprovada não é selecionável para a operação.

import { HOJE, diasEntre, type Regime } from "./model";

export type Trilha = {
  id: string;
  codigo: string;
  titulo: string;
  duracaoMin: number;
  versaoConteudo: string;
  validadeMeses: number;
  notaMinima: number;
  tentativasMax: number;
  gatilho: Gatilho;
};

/** Quando a trilha é exigida. `sempre` = base obrigatória de todo motorista. */
export type Gatilho =
  | { tipo: "sempre" }
  | { tipo: "regime"; regime: Regime }
  | { tipo: "gatekeeper" }
  | { tipo: "reincidencia_foto" };

export const TRILHAS: Trilha[] = [
  { id: "t01", codigo: "T01", titulo: "Introdução ao GMP+ FSA para motoristas", duracaoMin: 12, versaoConteudo: "v2 · 2026.03", validadeMeses: 12, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t02", codigo: "T02", titulo: "Responsabilidades do motorista no transporte de feed", duracaoMin: 10, versaoConteudo: "v1 · 2026.01", validadeMeses: 12, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t03", codigo: "T03", titulo: "Últimas três cargas e histórico T-3", duracaoMin: 8, versaoConteudo: "v2 · 2026.05", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t04", codigo: "T04", titulo: "Cargas proibidas e cargas incompatíveis", duracaoMin: 14, versaoConteudo: "v2 · 2026.05", validadeMeses: 12, notaMinima: 80, tentativasMax: 2, gatilho: { tipo: "regime", regime: "D" } },
  { id: "t05", codigo: "T05", titulo: "Regimes de limpeza A, B, C e D", duracaoMin: 16, versaoConteudo: "v1 · 2026.02", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t06", codigo: "T06", titulo: "Inspeção higiênica e estrutural do implemento", duracaoMin: 15, versaoConteudo: "v1 · 2026.02", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t07", codigo: "T07", titulo: "Uso do checklist TRAXIUM", duracaoMin: 7, versaoConteudo: "v3 · 2026.06", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t08", codigo: "T08", titulo: "Comunicação de desvios e suspeita de contaminação", duracaoMin: 9, versaoConteudo: "v1 · 2026.01", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "sempre" } },
  { id: "t09", codigo: "T09", titulo: "Proteção da carga no transporte, carregamento e descarga", duracaoMin: 11, versaoConteudo: "v1 · 2026.03", validadeMeses: 24, notaMinima: 70, tentativasMax: 3, gatilho: { tipo: "reincidencia_foto" } },
  { id: "t10", codigo: "T10", titulo: "Boas práticas para subcontratados em condição Gatekeeper", duracaoMin: 13, versaoConteudo: "v1 · 2026.04", validadeMeses: 12, notaMinima: 80, tentativasMax: 3, gatilho: { tipo: "gatekeeper" } },
];

/** Registro de conclusão — é a evidência que a auditoria pede. */
export type Conclusao = {
  motoristaId: string;
  trilhaId: string;
  concluidoEm: string;
  nota: number;
  tentativas: number;
  aceiteCiencia: boolean;
  /** Versão do conteúdo efetivamente assistido — muda a validade da evidência. */
  versaoConteudo: string;
  certificadoId: string;
};

export const conclusoes: Conclusao[] = [
  // Edivaldo Souza — em dia
  { motoristaId: "m-001", trilhaId: "t01", concluidoEm: "2026-02-10", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0001" },
  { motoristaId: "m-001", trilhaId: "t02", concluidoEm: "2026-02-10", nota: 85, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0002" },
  { motoristaId: "m-001", trilhaId: "t03", concluidoEm: "2026-02-11", nota: 95, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0003" },
  { motoristaId: "m-001", trilhaId: "t05", concluidoEm: "2026-02-11", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0004" },
  { motoristaId: "m-001", trilhaId: "t06", concluidoEm: "2026-02-12", nota: 78, tentativas: 2, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0005" },
  { motoristaId: "m-001", trilhaId: "t07", concluidoEm: "2026-02-12", nota: 92, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0006" },
  { motoristaId: "m-001", trilhaId: "t08", concluidoEm: "2026-02-13", nota: 83, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0007" },
  // Mauricio Lima — T01 vencida (concluída há mais de 12 meses)
  { motoristaId: "m-002", trilhaId: "t01", concluidoEm: "2025-01-15", nota: 72, tentativas: 2, aceiteCiencia: true, versaoConteudo: "v1 · 2025.01", certificadoId: "CERT-0100" },
  { motoristaId: "m-002", trilhaId: "t02", concluidoEm: "2026-03-02", nota: 80, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0101" },
  // Carlos Aparecido — T01 vence em menos de 30 dias
  { motoristaId: "m-003", trilhaId: "t01", concluidoEm: "2025-07-25", nota: 88, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.03", certificadoId: "CERT-0200" },
  { motoristaId: "m-003", trilhaId: "t02", concluidoEm: "2026-01-20", nota: 90, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0201" },
  { motoristaId: "m-003", trilhaId: "t03", concluidoEm: "2026-01-20", nota: 84, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v2 · 2026.05", certificadoId: "CERT-0202" },
  { motoristaId: "m-003", trilhaId: "t05", concluidoEm: "2026-01-21", nota: 86, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0203" },
  { motoristaId: "m-003", trilhaId: "t06", concluidoEm: "2026-01-21", nota: 75, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.02", certificadoId: "CERT-0204" },
  { motoristaId: "m-003", trilhaId: "t07", concluidoEm: "2026-01-22", nota: 91, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v3 · 2026.06", certificadoId: "CERT-0205" },
  { motoristaId: "m-003", trilhaId: "t08", concluidoEm: "2026-01-22", nota: 82, tentativas: 1, aceiteCiencia: true, versaoConteudo: "v1 · 2026.01", certificadoId: "CERT-0206" },
];

export type ContextoOperacao = { regime?: Regime; gatekeeper?: boolean; reincidenciaFoto?: boolean };

/** Trilhas exigidas para operar neste contexto. Base obrigatória + gatilhos. */
export function trilhasExigidas(ctx: ContextoOperacao = {}): Trilha[] {
  return TRILHAS.filter((t) => {
    switch (t.gatilho.tipo) {
      case "sempre": return true;
      case "regime": return ctx.regime === t.gatilho.regime;
      case "gatekeeper": return ctx.gatekeeper === true;
      case "reincidencia_foto": return ctx.reincidenciaFoto === true;
    }
  });
}

export type SituacaoCompetencia = "apto" | "a_vencer" | "vencida" | "nunca_fez";

export type Competencia = {
  situacao: SituacaoCompetencia;
  /** É o que o motor e o select de motorista consomem. */
  elegivel: boolean;
  motivo: string;
  trilhasPendentes: Trilha[];
  proximoVencimento?: string;
};

function venceEm(c: Conclusao, t: Trilha): string {
  const d = new Date(c.concluidoEm);
  d.setMonth(d.getMonth() + t.validadeMeses);
  return d.toISOString().slice(0, 10);
}

/**
 * Competência derivada. Nunca é campo editável: sai das conclusões registradas
 * contra as trilhas exigidas, exatamente como `estadoQualificacao` faz para a
 * empresa.
 */
export function competenciaMotorista(motoristaId: string, hoje = HOJE, ctx: ContextoOperacao = {}): Competencia {
  const exigidas = trilhasExigidas(ctx);
  const minhas = conclusoes.filter((c) => c.motoristaId === motoristaId);

  const nunca = exigidas.filter((t) => !minhas.some((c) => c.trilhaId === t.id));
  if (nunca.length) {
    return {
      situacao: "nunca_fez",
      elegivel: false,
      motivo: `${nunca.length} trilha(s) obrigatória(s) nunca concluída(s): ${nunca.map((t) => t.codigo).join(", ")}.`,
      trilhasPendentes: nunca,
    };
  }

  const comValidade = exigidas.map((t) => {
    const c = minhas.find((x) => x.trilhaId === t.id)!;
    return { t, validade: venceEm(c, t), dias: diasEntre(hoje, venceEm(c, t)) };
  });

  const vencidas = comValidade.filter((x) => x.dias < 0);
  if (vencidas.length) {
    const pior = vencidas.sort((a, b) => a.dias - b.dias)[0];
    return {
      situacao: "vencida",
      elegivel: false,
      motivo: `${pior.t.codigo} vencida há ${Math.abs(pior.dias)} dias.`,
      trilhasPendentes: vencidas.map((x) => x.t),
      proximoVencimento: pior.validade,
    };
  }

  const proxima = comValidade.sort((a, b) => a.dias - b.dias)[0];
  if (proxima.dias <= 30) {
    return {
      situacao: "a_vencer",
      elegivel: true,
      motivo: `${proxima.t.codigo} vence em ${proxima.dias} dias.`,
      trilhasPendentes: [],
      proximoVencimento: proxima.validade,
    };
  }

  return {
    situacao: "apto",
    elegivel: true,
    motivo: `${exigidas.length} trilhas obrigatórias vigentes.`,
    trilhasPendentes: [],
    proximoVencimento: proxima.validade,
  };
}

/** Trilha oferecida no momento da operação (treino just-in-time, §Pilar 2). */
export function trilhasJustInTime(motoristaId: string, ctx: ContextoOperacao): Trilha[] {
  const exigidas = trilhasExigidas(ctx);
  const base = trilhasExigidas({});
  const especificas = exigidas.filter((t) => !base.includes(t));
  const minhas = conclusoes.filter((c) => c.motoristaId === motoristaId);
  return especificas.filter((t) => !minhas.some((c) => c.trilhaId === t.id));
}
```

- [ ] **Passo 4: alinhar os CPFs do mock**

A junção é por `motorista.id`, **não por CPF**: os CPFs em `mock-data.ts` estão mascarados por LGPD (`***.456.789-**`) e não servem como chave. Confirme que `m-001` é Edivaldo Souza, `m-002` Mauricio Lima e `m-003` Carlos Aparecido; `m-999` no teste é um id inexistente de propósito, para cobrir o caso "nunca fez".

- [ ] **Passo 5: rodar os testes**

`npm test` — esperado: 6 passando (as 4 de competência + as 2 de trilhas exigidas).

- [ ] **Passo 6: commitar**

```bash
git add src/lib/domain/academy.ts src/lib/domain/__tests__/academy.test.ts
git commit -m "feat(academy): competência derivada das trilhas concluídas"
```

### Tarefa 4.2 — elegibilidade no despacho

O princípio do Pilar 2 entrando na tela onde importa.

- [ ] **Passo 1: teste da regra**

Acrescentar em `src/lib/domain/__tests__/academy.test.ts`:

```ts
describe("elegibilidade no despacho", () => {
  it("motorista com trilha vencida não é elegível para regime nenhum", () => {
    expect(competenciaMotorista("m-002", undefined, { regime: "A" }).elegivel).toBe(false);
  });

  it("elegível em regime A pode ser inelegível em regime D, que exige T04", () => {
    const a = competenciaMotorista("m-001", undefined, { regime: "A" });
    const d = competenciaMotorista("m-001", undefined, { regime: "D" });
    expect(a.elegivel).toBe(true);
    expect(d.elegivel).toBe(false);
    expect(d.trilhasPendentes.map((t) => t.codigo)).toContain("T04");
  });
});
```

- [ ] **Passo 2: rodar e ver falhar ou passar**

`npm test`. Se já passar, o modelo da 4.1 está correto — siga. Se falhar, o gatilho por regime não está sendo aplicado; corrija `trilhasExigidas`.

- [ ] **Passo 3: aplicar no modal de nova viagem**

Em `src/components/modals/nova-viagem-modal.tsx`, o `SelectItem` de motorista passa a consultar a competência no contexto do regime exigido pelo compartimento escolhido. Item inelegível recebe `disabled` e mostra o motivo:

```tsx
{motoristas.map((m) => {
  const comp = competenciaMotorista(m.id, undefined, { regime: decisao?.regimeExigido });
  return (
    <SelectItem key={m.id} value={m.nome} disabled={!comp.elegivel}>
      <span className="flex items-center gap-2">
        <span className={cn(!comp.elegivel && "text-fg-soft line-through")}>{m.nome}</span>
        {!comp.elegivel && (
          <span className="text-[10px] font-semibold text-danger-700">{comp.motivo}</span>
        )}
      </span>
    </SelectItem>
  );
})}
```

Importar `competenciaMotorista` de `@/lib/domain/academy`.

- [ ] **Passo 4: verificar rodando**

`npm run dev`, abrir Nova viagem, escolher um compartimento cuja carga anterior exija regime D. Esperado: Mauricio Lima desabilitado com "T01 vencida há N dias"; e um motorista sem T04 desabilitado com "1 trilha(s) obrigatória(s) nunca concluída(s): T04".

- [ ] **Passo 5: commitar**

```bash
git add src/components/modals/nova-viagem-modal.tsx
git commit -m "feat(academy): motorista sem competência não é selecionável no despacho"
```

### Tarefa 4.3 — anel de competência no crachá

- [ ] **Passo 1: criar o componente**

Criar `src/components/academy/anel-competencia.tsx`. Um arco por trilha exigida, cheio se vigente, vazado se pendente. SVG puro, sem biblioteca:

```tsx
"use client";

// Anel de competência — cada arco é uma trilha exigida. Cheio = vigente,
// vazado = pendente. A elegibilidade se lê de longe, sem texto.

import { competenciaMotorista, trilhasExigidas, conclusoes } from "@/lib/domain/academy";
import { cn } from "@/lib/utils";

export function AnelCompetencia({ motoristaId, size = 44 }: { motoristaId: string; size?: number }) {
  const exigidas = trilhasExigidas({});
  const minhas = conclusoes.filter((c) => c.motoristaId === motoristaId);
  const comp = competenciaMotorista(motoristaId);
  const r = size / 2 - 3;
  const circ = 2 * Math.PI * r;
  const passo = circ / exigidas.length;
  const gap = 3;

  return (
    <svg width={size} height={size} className="shrink-0" role="img"
         aria-label={`Competência: ${comp.situacao}. ${comp.motivo}`}>
      {exigidas.map((t, i) => {
        const feita = minhas.some((c) => c.trilhaId === t.id);
        const pendente = comp.trilhasPendentes.some((p) => p.id === t.id);
        return (
          <circle
            key={t.id}
            cx={size / 2} cy={size / 2} r={r}
            fill="none" strokeWidth={3} strokeLinecap="round"
            className={cn(
              feita && !pendente ? "stroke-success-500" : pendente ? "stroke-danger-500" : "stroke-border",
            )}
            strokeDasharray={`${passo - gap} ${circ - passo + gap}`}
            strokeDashoffset={-i * passo}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      })}
    </svg>
  );
}
```

- [ ] **Passo 2: usar no crachá**

Em `src/components/motoristas/credencial.tsx`, envolver o avatar com `<AnelCompetencia motoristaId={m.id} />` posicionado absoluto por cima, e trocar o anel de conformidade atual por ele. O `title`/`aria-label` já carrega o motivo.

- [ ] **Passo 3: verificar rodando**

`npm run dev`, abrir `/motoristas`. Esperado: Edivaldo com todos os arcos verdes; Mauricio com o arco da T01 vermelho. Conferir contraste do vermelho sobre o card (danger-500 = 4,72:1, passa).

- [ ] **Passo 4: commitar**

```bash
git add src/components/academy/ src/components/motoristas/credencial.tsx
git commit -m "feat(academy): anel de competência por trilha no crachá"
```

### Tarefa 4.4 — sala virtual em `/academy`

- [ ] **Passo 1: rota e nav**

Criar `src/app/(app)/academy/page.tsx`. Em `sidebar.tsx`, acrescentar ao `navigation`, no grupo "Cadastros":

```ts
{ href: "/academy", label: "Academy", icon: GraduationCap, pilar: "Academy", mvp: true,
  access: { gestor: "full", diretoria_rt: "read", admin_subcontratados: "full", auditor_interno: "read" } },
```

Importar `GraduationCap` de `lucide-react`.

- [ ] **Passo 2: a página**

Estrutura conforme `DESIGN.md` §11: PageHeader · StatTiles (motoristas aptos / a vencer / inelegíveis, todos derivados de `competenciaMotorista`) · tabela de trilhas (código, título, duração, validade, nota mínima, tentativas, versão do conteúdo, quantos motoristas vigentes) · matriz motorista × trilha usando o mesmo `AnelCompetencia` por linha. Botão "Atribuir trilha" abre a 4.5.

Sem número que não venha de `conclusoes`/`TRILHAS`. Trilha sem nenhuma conclusão mostra `0`, não some.

- [ ] **Passo 3: verificar rodando**

`npm run dev`, abrir `/academy` em 1280 e 375. Conferir que os contadores batem com `/motoristas`.

- [ ] **Passo 4: commitar**

```bash
git add "src/app/(app)/academy/page.tsx" src/components/shell/sidebar.tsx
git commit -m "feat(academy): sala virtual com trilhas, validade e matriz de competência"
```

### Tarefa 4.5 — atribuir trilha e registrar conclusão

- [ ] **Passo 1: ações no store**

Em `src/lib/store/session.tsx`, acrescentar ao `SessionCtx`:

```ts
registrarConclusao: (i: {
  motoristaId: string; trilhaId: string; nota: number; tentativas: number; aceiteCiencia: boolean;
}) => boolean;
```

Implementação: rejeita (`return false`) se `nota < trilha.notaMinima` ou `tentativas > trilha.tentativasMax`; senão faz `conclusoes.unshift({...})` com `concluidoEm: HOJE`, `versaoConteudo` da trilha, `certificadoId` sequencial, e `bump()`.

- [ ] **Passo 2: o modal**

Criar `src/components/modals/atribuir-trilha-modal.tsx`: seleciona motorista e trilha, mostra nota mínima e tentativas máximas da trilha, campo de nota, checkbox de aceite de ciência. Botão desabilitado sem aceite. Toast reflete o resultado real: reprovado por nota mostra "Reprovado — nota N, mínimo M. Tentativa X de Y", e **não** registra.

- [ ] **Passo 3: verificar rodando**

Registrar uma conclusão com nota abaixo do mínimo e confirmar que nada entra na matriz. Registrar acima e confirmar que o anel do motorista fecha e ele passa a ser selecionável no despacho.

- [ ] **Passo 4: commitar**

```bash
git add src/components/modals/atribuir-trilha-modal.tsx src/lib/store/session.tsx
git commit -m "feat(academy): registro de conclusão com nota mínima e tentativas"
```

### Tarefa 4.6 — treino just-in-time no app do motorista

- [ ] **Passo 1: cartão no fluxo**

Em `src/app/(app)/mobile/page.tsx`, antes da tela de checklist, se `trilhasJustInTime(motoristaId, { regime: regimeDaViagem })` retornar algo, exibir um cartão de micro-treino com o título da trilha, a duração e um botão "Fazer agora (N min)". Sem trilha pendente, o cartão não aparece — não é placeholder.

- [ ] **Passo 2: verificar rodando**

Abrir `/mobile` com uma viagem de regime D e um motorista sem T04. Esperado: o cartão aparece. Com motorista completo: não aparece.

- [ ] **Passo 3: commitar**

```bash
git add "src/app/(app)/mobile/page.tsx"
git commit -m "feat(academy): micro-treino just-in-time acionado pelo risco da operação"
```

---

# Fase 5 · Motor completo e configurável

**Meta:** o verde passar a exigir as 8 condições do PDF, e cada regra ganhar classe configurável com piso.

**Arquivos**
- Criar: `src/lib/domain/motor-config.ts` — as 4 classes, os pisos, a config ativa
- Modificar: `src/lib/domain/rules-engine.ts` — avaliar tudo antes de decidir
- Modificar: `src/lib/domain/__tests__/rules-engine.test.ts`
- Modificar: `src/app/(app)/configuracoes/page.tsx` — aba "Motor de regras"
- Modificar: `src/lib/domain/control-tower.ts` — mapear as regras novas à autoridade

**Interfaces**
- Consome: `competenciaMotorista` da Fase 4; `estadoQualificacao`, `AcordoQA` de `model.ts`.
- Produz: `ClasseRegra`, `RegraId`, `configMotor`, `CLASSE_MINIMA`, `Decisao.checagens` com as 8 entradas — consumido pelas fases 7 (dossiê) e 10 (indicadores).

**Mudança estrutural.** Hoje `avaliarCarregamento` sai na primeira falha, então uma viagem bloqueada mostra 2 checagens no dossiê. Passa a **avaliar as 8 e depois decidir**: a decisão vira a pior classe entre as falhas. Isso é o que permite o PDF ser cumprido ("verde quando as 8 condições") e melhora o dossiê de graça.

**As 8 condições** (§Pilar 4, "Liberação automática"), com origem do dado:

| Regra | `RegraId` | Vem de |
| --- | --- | --- |
| Cadastro válido | `cadastro_valido` | `estadoQualificacao(sub).opera` |
| Acordo vigente | `acordo_vigente` | `sub.acordo.vigenciaFim` vs data da viagem |
| Treinamento concluído | `competencia_motorista` | `competenciaMotorista(m.id, ..., { regime }).elegivel` — Fase 4 |
| Histórico T-3 completo | `t3_completo` | `getT3().length >= 3` |
| Produto reconhecido | `produto_reconhecido` | `statusClassificacao !== "em_fila"` |
| Limpeza compatível | `limpeza_compativel` | `ORDEM_REGIME` aplicado vs exigido |
| Checklist aprovado | `checklist_aprovado` | `inspecaoDaViagem().resultado` |
| Fotos mínimas recebidas | `fotos_minimas` | `inspecao.fotos.length >= MIN_FOTOS` |

`carga_anterior` (proibida) e `certificado_valido` continuam como estão — somam 10 regras no total.

**Tarefas**

- **5.1** `motor-config.ts` com `ClasseRegra = "bloqueio" | "alerta" | "registro" | "informacao"`, `CLASSE_MINIMA: Record<RegraId, ClasseRegra>` (piso — `carga_anterior`, `limpeza_compativel`, `certificado_valido`, `t3_completo` e `cadastro_valido` travados em `bloqueio`) e `configMotor` mutável no store. Teste: rebaixar regra travada é rejeitado.
- **5.2** Reescrever `avaliarCarregamento` para avaliar as 10 e decidir pela pior classe. Os testes de caracterização da Fase 0 **devem continuar passando** — se algum quebrar, ou a reescrita mudou comportamento sem querer, ou o teste capturou o early-return; investigue antes de alterar o teste.
- **5.3** Acrescentar as 4 checagens novas, uma por vez, com teste antes.
- **5.4** Aba "Motor de regras" em `/configuracoes`: as 10 regras com seletor de classe; as travadas aparecem bloqueadas com o motivo ("Rebaixar esta regra permitiria carregar sobre carga proibida"). Mesmo princípio do "sem aprovar mesmo assim".
- **5.5** `autoridadeDaRegra` em `control-tower.ts` ganha entrada para cada `RegraId` novo. `competencia_motorista` → `gestor` (dá para resolver atribuindo trilha); `acordo_vigente` → `tecnico` (só assinando); `fotos_minimas` → `gestor`; `produto_reconhecido` → `gestor`.

**Aceite:** a Torre mostra a taxa de automação recalculada sobre 10 condições; o dossiê lista as 10 na §Decisão; `/configuracoes` não permite rebaixar regra travada.

---

# Fase 6 · Gatekeeper completo

**Arquivos**
- Criar: `src/app/convite/[token]/page.tsx` — **fora** de `(app)`, sem shell
- Criar: `src/components/gatekeeper/assinatura-acordo.tsx`
- Modificar: `src/lib/domain/model.ts` — `TipoVinculo` com os 7, `AcordoQA` completo
- Modificar: `src/app/(app)/checklists/page.tsx` — dinâmico por tipo, item crítico
- Modificar: `src/components/modals/passaporte-modal.tsx` — inspeções e produtos aptos

**Tarefas**

- **6.1** `TipoVinculo` ganha `"Motorista empregado"` e `"Motorista vinculado a empresa terceira"`. Ajustar o mock para usar os dois.
- **6.2** `AcordoQA` ganha `renovacaoEm?`, `representantes: string[]`, `cienciaMotorista?: { motoristaId: string; aceitoEm: string }`. `estadoQualificacao` já bloqueia por vigência — cobrir com teste.
- **6.3** Onboarding público em `/convite/[token]`: os 11 campos do PDF em passos, um por tela, mobile-first, ≤5 min. Ao concluir, cria o subcontratado em estado `Pré-cadastrado` — nunca `Apto`.
- **6.4** Assinatura eletrônica: canvas de assinatura + registro de `dispositivo`, `assinadoEm`, `assinante`. Reaproveitar a assinatura que `/mobile` já tem.
- **6.5** QR real: gerar SVG de QR do link do convite sem dependência externa (implementação mínima de QR ou `<img>` com data URI gerado em runtime). Se o custo for alto, **remover a menção a QR do texto** em vez de manter promessa não cumprida.
- **6.6** Checklist dinâmico: `CAMPOS_POR_TIPO: Record<Implemento["tipo"], ItemChecklist[]>`, e `critico: boolean` por item — item crítico negativo reprova a inspeção automaticamente, sem passar por humano.
- **6.7** Passaporte ganha "Inspeções realizadas" e "Produtos/operações para os quais está apto" (derivado do escopo GMP+ + regimes que a empresa evidencia).

---

# Fase 7 · Control Tower completo

**Arquivos**
- Criar: `src/lib/domain/liberacao.ts` — motivos padronizados e registro completo
- Modificar: `src/app/(app)/excecoes/page.tsx`, `src/app/(app)/dossie/page.tsx`, `src/components/shell/torre-de-controle.tsx`

**Tarefas**

- **7.1** `MOTIVOS_POR_REGRA: Record<RegraId, string[]>` — lista fechada. Aprovar exceção passa a exigir motivo escolhido; justificativa livre continua como complemento.
- **7.2** `RegistroLiberacao` com os 9 campos do PDF: motivo padronizado, justificativa, evidência, responsável, data/hora, **situação anterior**, **situação posterior**, **impacto**, **validade da decisão**. Anterior/posterior são capturados automaticamente do estado da viagem; impacto e validade são escolhidos.
- **7.3** Hierarquia com os 6 níveis: `NivelAutoridade` ganha `"trafego"` (pendências simples) e `"inspetor"` (condição física). `podeAprovarExcecao` e `NIVEL_ESCOPO` acompanham.
- **7.4** Dossiê ganha os blocos faltantes: transportador, cavalo mecânico, assinaturas, acordo vigente, treinamentos (da Fase 4), documentos da viagem. Mantém a cadeia de hash — **cada bloco novo entra na cadeia**.
- **7.5** Fila ganha risco GMP+ e miniatura das evidências essenciais; notificações pendentes por item.

---

# Fase 8 · IDTF completo

**Tarefas**

- **8.1** `ProdutoIDTF` ganha os 7 campos faltantes: `nomeOficialFonte`, `sinonimosRegionais`, `nomesComerciais`, `nomesIngles`, `errosComuns`, `estadoFisico`, `restricoes`, `esquemaCertificacao`, `atualizadoEm`, `responsavelValidacao`, `fonteDecisao`. `resolveProdutoPorNome` passa a varrer todas as listas de sinônimo.
- **8.2** Os 9 rótulos operacionais do PDF viram saída explícita: `rotuloOperacional(decisao)` → "Liberado" | "Liberado após limpeza A/B/C/D" | "Necessita procedimento especial" | "Carga anterior proibida" | "Produto não identificado" | "Aguardando análise da Qualidade".
- **8.3** Governança: `HistoricoBase` com alterações datadas, responsável e fonte; aba de governança em `/idtf` mostrando versão vigente, histórico e quem aprovou cada sinônimo.

---

# Fase 9 · Network

**Tarefas**

- **9.1** Vínculo m:n de verdade: `Vinculo = { motoristaCpf, ativoId, inicio, fim? }` substituindo as listas de string, com histórico preservado.
- **9.2** Importação por planilha: parser de CSV colado em textarea (sem dependência), pré-visualização com **detecção de duplicidade** por CPF/CNPJ/placa antes de gravar.
- **9.3** Consulta rápida por CPF, CNPJ, placa ou telefone na busca global.
- **9.4** Ações em massa: renovação coletiva de acordos, envio coletivo de trilhas (usa a Fase 4), alertas em massa.
- **9.5** Arquivamento sem apagar histórico + filtros por contratante e período.

---

# Fase 10 · Transversais

**Tarefas**

- **10.1** Motor de regras com as 4 classes já existe da Fase 5 — aqui entra "registro obrigatório" e "informação complementar" **na tela**: regra de classe `registro` exige anexo antes de seguir; `informacao` só informa.
- **10.2** LGPD: prazo de retenção por tipo de evidência, política de inativação, tela de consentimentos e bases legais em `/configuracoes`.
- **10.3** Os 14 indicadores faltantes do §8, cada um derivado do store. Os que dependem de telemetria inexistente (tempo médio de checklist, tempo de cadastro de TAC) **entram como "não medido" explícito**, não como número inventado.

---

# Auto-revisão

**Cobertura da spec.** Conferido contra `PAREAMENTO-PDF.md`, item a item: Pilar 1 → Fase 6; Pilar 2 → Fase 4; Pilar 3 → Fase 8; Pilar 4 → Fases 5 e 7; Pilar 5 → Fase 9; transversais → Fases 5 e 10; §8 indicadores → Fase 10. §5 já está fechado. §6 EUDR permanece 2ª onda por decisão do próprio PDF.

**Lacuna assumida:** os itens do §8 que dependem de telemetria (tempo médio de cadastro, tempo de checklist, % de fotos rejeitadas) não têm como ser medidos num protótipo sem backend. A Fase 10.3 os marca como não medidos em vez de fabricar. Se o P.O. quiser esses números de verdade, é decisão de arquitetura, não de tela.

**Consistência de tipos.** `competenciaMotorista(motoristaId, hoje?, ctx?)` é chamada com a mesma assinatura nas Fases 4 e 5. `RegraId` definido em 5.1 é consumido em 5.5, 7.1 e 7.2. `ClasseRegra` definido em 5.1 é consumido em 5.4 e 10.1. `Trilha` da 4.1 é consumida em 4.3, 4.4, 4.6 e 9.4.

**Granularidade.** Fase 0 e Fase 4 estão em passos executáveis. Fases 5 a 10 estão em tarefas com arquivos, interfaces e critério de aceite — cada uma vira seu próprio documento de passos quando chegar a vez, conforme a orientação de não escrever plano de execução para subsistema que ainda vai mudar por causa da fase anterior.
