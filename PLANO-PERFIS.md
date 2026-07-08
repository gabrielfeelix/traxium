# TRAXIUM — Plano de Perfis, Superfícies e Acessos

> Como o sistema **muda inteiramente** conforme quem loga. Fonte de verdade para o RBAC e a navegação por perfil.
> Companheiro de `PLANO-PRODUTO.md` (§3 tem a matriz de permissões de ação). Aqui: **quem entra em qual app e vê quais abas.**
> Princípio: entre planos = **superfícies separadas**; dentro de um plano = **gating por papel**. Não existe app-deus com flag de papel escondendo 90% das telas.

---

## 0. Os dois eixos

**Eixo 1 — `accountType` (decide a SUPERFÍCIE):** `traxium_admin` · `tenant_user` · `subcontractor_admin` · `auditor`.
**Eixo 2 — `papel` (só dentro de `tenant_user`, decide nav/ação):** papéis de escritório (→ Back-office) vs papéis de campo (→ App).

O seletor que já existe (`setPapel`) é o **eixo 2**. Falta o **eixo 1 por cima**. No store: `accountType` acima de `papel`. Login resolve o eixo 1 → escolhe superfície → dentro do tenant o eixo 2 filtra abas.

```
login → accountType
  ├─ traxium_admin ─────────→ Console (A)               [cross-tenant]
  ├─ tenant_user + papel
  │     ├─ escritório (gestor / despachante / diretoria_rt / admin_sub / auditor_interno)
  │     │        └─→ Back-office (B)   nav+ações gated pelo papel
  │     └─ campo (motorista / inspetor)
  │              └─→ App (C)   uma superfície inteiramente diferente
  ├─ subcontractor_admin ───→ Portal (D)                [só os dados dele]
  └─ auditor (externo) ─────→ Visão Auditor (E)         [somente leitura, amostra]
```

---

## 1. As 5 superfícies

| Superfície | accountType | Objeto primário | Device | Escopo de dado |
|---|---|---|---|---|
| **A · Console Traxium** | `traxium_admin` | Tenant, Plano/Fatura, Base IDTF global, Suporte | desktop | **todos os clientes** |
| **B · Back-office** | `tenant_user` (escritório) | varia por papel (Viagem / NC / Subcontratado / Dossiê) | desktop | 1 tenant (+ filial) |
| **C · App de campo** | `tenant_user` (campo) | Checklist / viagem do dia | mobile/tablet, offline | viagens atribuídas ao usuário |
| **D · Portal Subcontratado** | `subcontractor_admin` | própria empresa, cert, motoristas dele | desktop leve | só a empresa dele + viagens compartilhadas |
| **E · Visão Auditor** | `auditor` | amostra de auditoria (read) | desktop | só a amostra liberada |

Todas compartilham backend + design system. Não compartilham navegação.

---

## 2. Catálogo de logins (o que aparece quando você "entra como…")

Legenda de nav: **✓** ação/acesso · **R** somente leitura · **—** oculto.

### A0 · Apresentação — Master  `[protótipo apenas]`
- **Superfície:** todas (chave-mestra de demo).
- **Pra que serve:** apresentar o sistema inteiro sem trocar de login. **Não é papel de produção** — é conveniência de palco. Rótulo sempre visível: "Modo apresentação — tudo liberado".
- **Nav:** todas as abas de todas as superfícies.

### A1 · Traxium Admin (Console)  `accountType: traxium_admin`
- **Superfície:** A. **Objeto primário:** o CLIENTE, não os dados do cliente.
- **Landing:** lista de tenants + saúde da plataforma.
- **Nav própria:** Tenants · Faturamento (cobra as transportadoras) · **IDTF Global** (cura a base e publica versões pra todos) · Usuários · **Suporte / Impersonar** · Métricas.
- **Não opera o sistema.** Não cria fazenda/viagem pra si. Toca telas operacionais **só via impersonation** (§4).
- **Resolve os usuários de teste:** cria tenant demo (flag `sandbox`) → semeia → entrega login ou impersona.
- **Espaço negativo:** não vê dado operacional do cliente sem impersonation logada.

### B1 · Gestor GMP+/Qualidade  (tenant · escritório) — *Thiago*
- **Superfície:** B. **Objeto primário:** Dossiê / Exceção / IDTF. É o dono da conformidade — nav mais larga do tenant.
- **Landing:** dashboard de conformidade (bloqueios, NCs, auditoria em D-N).
- **Espaço negativo:** não mexe em plano/faturamento; não acessa o Console.

### B2 · Despachante/Tráfego  (tenant · escritório) — *Jéssica*
- **Superfície:** B. **Objeto primário:** Viagem (dono do create/edit).
- **Landing:** fila de viagens do dia.
- **Espaço negativo:** **não aprova exceção**, **não classifica IDTF**, não abre CAPA, sem faturamento.

### B3 · Diretoria + Resp. Técnico  (tenant · escritório) — *Roberto*
- **Superfície:** B, **nav enxuta** (3 min entre reuniões). **Objeto primário:** Exceção nível 2 / Conformidade.
- **Landing:** "o que espera minha assinatura" (exceções nível 2) + painel executivo.
- **Espaço negativo:** não opera o dia a dia (viagem/limpeza/inspeção).

### B4 · Admin de Subcontratados  (tenant · escritório) — *Fernanda*
- **Superfície:** B, **nav focada**. **Objeto primário:** Subcontratado.
- **Landing:** subcontratados + certificados a vencer (60/30/15d).
- **Espaço negativo:** não cria viagem, não aprova exceção, não classifica IDTF.

### B5 · Auditor interno  (tenant · escritório) — *Patrícia*  `[opcional]`
- **Superfície:** B, **read + abrir NC**. **Objeto primário:** amostra + NC.
- **Espaço negativo:** não cria viagem, não aprova exceção, não edita cadastro.

### C1 · Motorista  (tenant · campo) — *Valdir / Cleiton / Wesley*
- **Superfície:** **C — só o app. Sem sidebar, sem back-office.** Este é o exemplo mais claro de "o sistema muda inteiramente".
- **Landing:** "Minha próxima viagem".
- **Fluxo único:** viagem do dia → checklist LCI → câmera (fotos obrigatórias) → limpeza → assinatura → fila de sync → tela de bloqueio explicativa.
- **Espaço negativo:** **tudo o mais.** Não vê dashboard, frota, IDTF, outras viagens, nem aprova nada.

### C2 · Inspetor de pátio  (tenant · campo) — *Marcão*
- **Superfície:** C (tablet), focada em inspeção. **Objeto primário:** inspeção do compartimento à frente dele.
- **Landing:** "Compartimentos/viagens aguardando inspeção".
- **Fluxo:** inspeção LCI (tri-state + 6 ângulos de foto) → aprovar/reprovar → reportar NC (ex.: ferrugem).
- **Espaço negativo:** não cria viagem, não aprova exceção, sem faturamento.

### D1 · Subcontratado (Portal)  `accountType: subcontractor_admin` — *Souza Transportes*
- **Superfície:** D — tenant-lite, **escopado só à empresa dele**. **Objeto primário:** própria empresa + certificado.
- **Nav:** Minha empresa (cert GMP+ — renovar/anexar) · Meus motoristas autorizados · Meus veículos/implementos · Treinamento (comprovar) · Viagens compartilhadas comigo · Pendências.
- **Espaço negativo:** **não vê outros subcontratados, não vê a operação do contratante, sem dado comercial.** Os motoristas dele usam o App (C).

### E1 · Auditor externo (Visão Auditor)  `accountType: auditor`  `[prévia Fase 2]`
- **Superfície:** E — **somente leitura**, banner "SOMENTE LEITURA · amostra". **Objeto primário:** reconstrução da decisão da amostra.
- **Nav:** Amostra de viagens (read) · Dossiê (read) · Evidências travadas (foto+geo+hash).
- **Espaço negativo:** **nada de edição, nada fora da amostra, nada de terceiro (LGPD).**
- **Honestidade:** no MVP real isto é **export-only** (Q05). O login read-only é prévia de Fase 2 — mostrar como visão, rotulado.

---

## 3. Matriz de navegação — Back-office (superfície B)

Só os papéis de escritório do tenant. Campo (motorista/inspetor), portal e auditor têm nav própria (§2).

| Rota | Master | Gestor | Despachante | Diretoria | Admin Sub | Auditor int. |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| `/` Dashboard *(conteúdo varia)* | ✓ | ✓ | ✓ | ✓ | ✓ | R |
| `/viagens` | ✓ | R | **✓** | R | — | R |
| `/idtf` Motor IDTF | ✓ | **✓** | R | — | — | R |
| `/checklists` Inspeção LCI | ✓ | R | — | — | — | R |
| `/limpezas` | ✓ | ✓ | — | — | — | R |
| `/bloqueios` NC + CAPA | ✓ | **✓** | R | R | R* | ✓ |
| `/excecoes` | ✓ | ✓ (N1) | ✓ (solicita) | **✓ (N2)** | — | R |
| `/frota` Ativos | ✓ | R | R | — | ✓* | R |
| `/motoristas` | ✓ | R | R | — | ✓* | R |
| `/subcontratados` | ✓ | R | R | — | **✓** | R |
| `/fazendas` | ✓ | ✓ | — | — | — | R |
| `/lotes` Lotes e DDS | ✓ | ✓ | — | — | — | R |
| `/traces` Gateway TRACES | ✓ | ✓ | — | — | — | — |
| `/auditoria` | ✓ | ✓ | — | R | — | ✓ |
| `/dossie` | ✓ | **✓** | R | R/export | — | R |
| `/conformidade` | ✓ | ✓ | R | ✓ | R | R |
| `/documentos` | ✓ | ✓ | R | R | R* | R |
| `/atividade` | ✓ | ✓ | R | R | R* | ✓ |
| `/configuracoes` | ✓ | R (equipe) | — | ✓ (org/fatura) | — | — |

`*` = escopado só ao que é do próprio subcontratado (seus terceiros / seus documentos).

---

## 4. Impersonation (admin → tenant)

Admin clica "Entrar como Bom Frete" → cai na superfície B **com banner fixo**: *"Você é Traxium operando como Bom Frete · tudo registrado."*
- Toda ação loga o **ator real** (admin X agindo como tenant Y) — nunca silenciosamente como o cliente.
- Resolve: suporte, reproduzir bug, demo, usuários de teste.
- Num produto de auditoria, a trilha do fornecedor tocando o dado do cliente é ela mesma feature de confiança.

---

## 5. Filial (dentro do tenant)

O switcher do header **não** troca de transportadora (isso é ação do Console A). Ele troca de **filial** dentro do mesmo tenant, quando o cliente tem filiais — para controle interno. Trocar de filial **re-escopa o dado** (não só o rótulo). Rótulo: "Filial ativa", não "Operando como".

---

## 6. Como demonstrar no protótipo (sem auth real)

- Login vira **"Entrar como…"**: dois níveis — primeiro `accountType`, depois `papel` (quando tenant). Roteia pra superfície + filtra a nav.
- Um seletor no topo troca de perfil na hora → na reunião você diz *"agora enquanto motorista"*, clica, e o sistema **vira o app do motorista** ao vivo. *"Agora enquanto auditor"* → vira a visão read-only. Isso vende a arquitetura melhor que slide e alimenta hipóteses em tempo real.
- **Corrigir o dropdown atual:** hoje ele lista Motorista e Inspetor junto com papéis de escritório num menu de desktop — quebra o modelo. Motorista/Inspetor pertencem à superfície C; ao escolhê-los, **sai do back-office e abre o app**, não muda uma aba do desktop.

---

## 7. Corte de MVP

- **Agora:** B (role-gated) · C (app operável: motorista + inspetor) · **A mínimo** (criar/impersonar tenant + IDTF global) — habilita test users e a gestão de vocês.
- **Fase 2:** D (portal do subcontratado self-service) · E (auditor read-only).
- **Sempre:** o espaço negativo de cada superfície é requisito de compliance, não polimento.

---

## 8. Decisões em aberto

1. Auditor interno (B5) é papel próprio ou some dentro do Gestor? *(sugestão: papel leve próprio — read + abrir NC.)*
2. Analista EUDR é papel próprio ou fica no Gestor? *(hoje as abas fazenda/lotes/traces estão no Gestor.)*
3. Inspetor de pátio: tablet dentro do App (C) ou uma visão desktop-focada? *(sugestão: App/tablet, irmão do motorista.)*
