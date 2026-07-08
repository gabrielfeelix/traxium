# TRAXIUM — Plano de Interações (Fase 1.5 · Protótipo clicável)

> Objetivo: tornar o protótipo **100% clicável para apresentação**, sem backend.
> Toda ação reflete no **estado da sessão** (em memória) — cria, edita, aprova, exporta — e volta a zero ao recarregar. Isso é suficiente e honesto para demo.
>
> Companheiro de `PLANO-PRODUTO.md` (fluxos/negócio) e `DESIGN.md` (visual).
> Cada modal aqui é especificado por: **conteúdo · fluxo · regra de negócio · comportamento no protótipo**.

---

## 0. Infra do protótipo (pré-requisito — construir primeiro)

Sem backend, mas com estado real na sessão:

1. **Session store** (`src/lib/store/session.tsx`) — React Context seeded a partir de `mock-data`/`domain`, com coleções mutáveis (`viagens`, `naoConformidades`, `implementos`, `compartimentos`, `subcontratados`, `lotes`, `cleaningEvents`, `inspectionEvents`, `produtosIDTF`, `excecoes`) e ações `add*/update*`. Telas passam a ler do store em vez de importar arrays direto.
2. **Toast** (`src/components/ui/toast.tsx`) — feedback de sucesso/erro leve, sem dependência externa. Toda ação confirma ("Viagem TX-… criada", "Limpeza Regime C registrada").
3. **Dialog** — já existe (`ui/dialog.tsx`), nunca usado. Vira a base de todos os modais.
4. **Command palette** (`⌘K`) e **Copilot drawer** (`⌘J`) — componentes próprios, sem lib.

Princípio: **nenhuma ação é botão morto**. Ou abre modal, ou executa e dá toast, ou navega.

---

## 1. Inventário completo do que falta

Prioridade demo: **P0** = você clica no palco · **P1** = provável · **P2** = raro/decorativo.

| # | Interação | Local | Tipo | Prio |
|---|---|---|---|:-:|
| C1 | **Nova viagem** | /viagens | Modal wizard | P0 |
| C2 | **Reportar NC manual** | /bloqueios | Modal | P0 |
| C3 | **Adicionar ativo** (cavalo/implemento/compartimento) | /frota | Modal | P0 |
| C4 | **Qualificar subcontratado** | /subcontratados | Modal wizard | P0 |
| C6 | **Classificar produto** (fila IDTF) | /idtf | Modal | P0 |
| C11 | **Registrar limpeza** (persistir) | /limpezas | já tem form → salvar | P0 |
| C12 | **Registrar inspeção** (persistir) | /checklists | já tem form → salvar | P0 |
| C7 | **Novo lote EUDR** (+ origens) | /lotes | Modal wizard | P1 |
| C8 | **Nova fazenda / import polígono** | /fazendas | Modal | P1 |
| C5 | Novo produto IDTF | /idtf | Modal | P1 |
| C9 | Novo modelo de checklist | /checklists | Modal | P2 |
| C10 | Convidar usuário | /configuracoes | Modal | P2 |
| H1 | Perfil | header | Modal | P1 |
| H2 | Preferências | header | Modal | P1 |
| H3 | Sair | header | Confirm → /login | P1 |
| H4 | Notificações (marcar lida / ver todas) | header | Inline + página | P1 |
| H5 | **Busca global ⌘K** | header | Command palette | P0 |
| H6 | Copilot ⌘J | header | Drawer (mock) | P2 |
| H7 | Ajuda / atalhos | header | Modal | P2 |
| H8 | Adicionar transportadora | header | Modal | P2 |
| I3 | Renovar certificação / MOPP / treinamento | motoristas/frota | Modal | P1 |
| I4 | Agendar treinamento / inspeção | motoristas/frota | Modal | P2 |
| I5 | Contatar motorista | /viagens/[id] | Modal (WhatsApp/ligar) | P1 |
| I6 | **Re-validar regras** | /viagens/[id] | Ação + toast | P0 |
| I7 | Tratar NC / editar CAPA | /bloqueios | Modal | P1 |
| I1 | Editar / Excluir / Duplicar | várias listas | Modal/confirm | P1 |
| E1 | **Exportar** (listas → CSV) | 7 telas | Download real | P0 |
| E2 | **Dossiê PDF/Excel/ZIP** | /dossie | Download real | P0 |
| E3 | Exportar histórico do compartimento | /frota/compartimento | Download | P1 |
| E5 | Guia / documentos da viagem | /viagens/[id] | Download PDF | P1 |
| U1 | Enviar DDS / gerar pacote EUDR | /lotes | Modal + status | P1 |
| U2 | Import de polígono | /fazendas | Modal upload | P1 |

---

## 2. Specs detalhadas — P0 (o que roda na apresentação)

### C1 · Nova viagem ★ (o modal mais importante)

`/viagens` → botão "Nova viagem" · **Modal wizard 3 passos**

Reflete o fluxo real de despacho (pergunta 06, passos 1–7) e força a tese do produto: **compartimento + motor antes de liberar**.

**Passo 1 — Pedido de frete**
- Cliente (input/select), Produto (select da base IDTF), Origem, Destino, Janela de carregamento (data), Peso/volume
- Toggles: exige GMP+ · exige EUDR

**Passo 2 — Veículo e compartimento**
- Cavalo (select) · Implemento (select) · **Compartimento (select)** ← chave
- Motorista (select)
- Ao escolher o compartimento: **prévia inline do T-3** (últimas 3 cargas + regime exigido) puxada do motor

**Passo 3 — Validação do motor**
- Roda `avaliarCarregamento` com a seleção → mostra o **tier**:
  - 🟢 LIBERADO → cria viagem status "Agendada/Em carregamento"
  - 🟠 ALERTA → exige **justificativa** (textarea) para criar
  - 🔴 BLOQUEIO → **não cria liberada**; cria como "Bloqueada" e oferece "Abrir exceção" (leva a /excecoes)

**Regra de negócio:** o despachante não consegue criar uma viagem "limpa" por cima de um compartimento sujo — o sistema mostra o bloqueio *antes* do carregamento. É a demonstração central do valor.

**No protótipo:** adiciona ao store; aparece na lista `/viagens` e no dossiê; se bloqueada, aparece em /excecoes. Toast.

---

### C2 · Reportar NC manual ★

`/bloqueios` → "Reportar NC manual" · **Modal**

- Severidade (Crítica/Maior/Menor) · Categoria (select das categorias existentes) · Descrição
- Vincular a: viagem / compartimento / subcontratado / motorista (selects opcionais)
- Responsável · (opcional) abrir CAPA agora
- Se Crítica → aviso de que gera bloqueio e pode exigir exceção

**Negócio:** qualidade/inspetor registra o que o motor não pega automaticamente (ex.: ferrugem vista em pátio — pergunta 23). Alimenta o mesmo fluxo NC+CAPA.

**Protótipo:** cria NC no store → aparece em /bloqueios com CAPA vazia para preencher. Toast.

---

### C3 · Adicionar ativo ★

`/frota` → "Adicionar ativo" · **Modal com seletor de tipo**

- Tipo: Cavalo · Implemento · Compartimento
- **Cavalo:** placa, modelo, ano, documentação
- **Implemento:** placa, tipo (graneleiro/bitrem/tanque…), nº de compartimentos, proprietário (frota/subcontratado), cert GMP+ (número/validade/escopo)
- **Compartimento:** implemento pai (select), identificador, capacidade, material, estado

**Negócio:** cadastrar implemento **cria automaticamente N compartimentos** (o subasset que carrega o T-3). Reforça o modelo compartimento-cêntrico no ato do cadastro.

**Protótipo:** adiciona ao store → aparece nas abas de /frota. Compartimento novo nasce "Sem histórico". Toast.

---

### C4 · Qualificar subcontratado ★

`/subcontratados` → "Qualificar subcontratado" · **Modal wizard 3 passos**

- **Passo 1 Empresa:** CNPJ, razão social, contrato
- **Passo 2 Certificação:** número GMP+, certificadora, escopo (Road Transport of Feed / Affreightment — multiselect), validade, sites cobertos, status base pública
- **Passo 3 Autorização + treinamento:** veículos autorizados (multiselect da frota), motoristas autorizados, treinamento (vídeo/quiz/aceite — toggles)

**Negócio:** valida **mais que o CNPJ** (pergunta 21). Cert vencido ou escopo incompatível → nasce "Bloqueado". Sem qualificação, não opera cadeia certificada (pergunta 12).

**Protótipo:** adiciona ao store → card em /subcontratados com badge Apto/Bloqueado calculado. Toast.

---

### C6 · Classificar produto (fila IDTF) ★

`/idtf` → item da fila "Classificar" · **Modal**

- Produto em fila (Casca de soja / Sal mineral) pré-carregado
- Campos: nome canônico, alias (chips), HS code, categoria, IDTF code, **regime mínimo antes de feed** (A/B/C/D), bloqueia feed? (toggle), risco EUDR
- Ação: classificar → sai da fila

**Negócio:** produto desconhecido **trava o uso** até a qualidade classificar (pergunta 19). O motor passa a reconhecê-lo. Demonstra a base como motor de regra, não PDF.

**Protótipo:** move o produto de `em_fila` → `classificado` no store; contador da fila cai; some do bloqueio. Toast.

---

### C11 · Registrar limpeza (persistir) ★  ·  C12 · Registrar inspeção (persistir) ★

`/limpezas` e `/checklists` — os forms **já calculam** o resultado ao vivo. Falta o "Registrar" **salvar**.

**Ação:** ao clicar Registrar (form completo) → cria `CleaningEvent` / `InspectionEvent` no store, vinculado ao compartimento e (inspeção) à viagem, com geo/timestamp/hash simulados. Reseta o form.

**Negócio + efeito em cadeia:** registrar a limpeza **muda o status do compartimento** (ex.: de "requer limpeza" → "apto") e **destrava viagens** que dependiam dela. Registrar inspeção reprovada abre pendência. É o loop vivo do MVP.

**Protótipo:** aparece em "recentes", muda `statusCompartimento`, reflete na Frota/Dossiê. Toast.

---

### I6 · Re-validar regras ★

`/viagens/[id]` → "Re-validar regras" · **Ação inline + toast**

Re-executa `avaliarCarregamento` (útil depois de registrar uma limpeza) → atualiza banner/decisão/score. Toast com o novo tier.

**Negócio:** o gestor limpa a pendência e re-valida sem recriar a viagem — fluidez do dia a dia.

---

### H5 · Busca global ⌘K ★

Header → **Command palette** (modal)

- Atalho ⌘K abre; input filtra
- Grupos: **Navegar** (todas as telas), **Ações rápidas** (Nova viagem, Reportar NC, Registrar limpeza…), **Ir para** (viagem/placa/compartimento por código)
- Enter navega ou dispara a ação

**Negócio:** operação rápida do gestor (pergunta 03 — "filtros, rastreável"). É o tipo de detalhe que faz o protótipo parecer produto.

---

### E1/E2 · Exportações reais ★

Todo "Exportar" e o Dossiê PDF/Excel/ZIP geram **arquivo de verdade** client-side:
- Listas → **CSV** (Blob download) com os dados filtrados na tela
- Dossiê → **JSON** (pacote de reconstrução) + **PDF via `window.print()`** de uma view formatada + "ZIP" (mock: baixa o JSON com aviso)

**Negócio:** o auditor recebe evidência organizada (pergunta 05). Mesmo em protótipo, baixar um CSV/JSON real vende a ideia.

---

## 3. Specs concisas — P1/P2

- **C7 Novo lote EUDR** (wizard): produto/HS, toneladas, **origens = N fazendas com toneladas** (add múltiplas), cenário de mistura, destinatário/país. Cria lote com status "Rascunho". *(Base da Fase 2.)*
- **C8 Nova fazenda / U2 Import polígono**: produtor/CAR/município + upload simulado de shapefile/GeoJSON/KML/PDF → normaliza campos; mostra no mapa. Score de risco calculado.
- **C5 Novo produto IDTF**: mesmo form da classificação, entrada manual.
- **H1 Perfil**: nome, e-mail, papel (read-only no protótipo), foto (iniciais).
- **H2 Preferências**: idioma, formato de data, densidade da tabela, notificações — persistidas na sessão (afetam a UI de verdade onde possível).
- **H3 Sair**: confirm → navega para /login.
- **H4 Notificações**: "marcar todas como lidas" zera o badge; item → navega ao contexto; "ver todas" → /atividade.
- **I3 Renovar cert/MOPP/treinamento**: modal com nova validade → atualiza status (Vencida→Válida) e some da lista de alertas.
- **I5 Contatar motorista**: modal com telefone + botões "WhatsApp" (abre `wa.me`) e "Ligar" (`tel:`).
- **I7 Tratar NC / editar CAPA**: modal para preencher causa raiz/ação corretiva/prazo/eficácia de NC sem CAPA.
- **I1 Editar/Excluir/Duplicar**: editar reabre o modal de criação preenchido; excluir → confirm → remove do store; duplicar → clona.
- **U1 Enviar DDS**: modal de revisão do pacote → muda status do lote (Rascunho→Enviado TRACES) + log no Gateway.
- **E5 Guia da viagem**: PDF via print da trilha (parecido com o dossiê de 1 viagem).
- **H6 Copilot / H7 Ajuda / H8 Add transportadora / C9 Modelo / C10 Convidar / I4 Agendar / E6 Fatura·Token**: modais simples, P2 (decorativos para demo).

---

## 4. Ordem de execução

1. ✅ **Infra** (§0): `store/session.tsx` (muta arrays + version bump), `ui/toast.tsx`, `shell/providers.tsx` no layout, Dialog (já existia).
2. ✅ **P0 criação**: C1 Nova viagem (wizard + motor) · C3 Adicionar ativo (implemento cria N compartimentos) · C2 Reportar NC · C4 Qualificar subcontratado · C6 Classificar IDTF.
3. ✅ **P0 loop vivo**: C11 registrar limpeza (muda status do compartimento) · C12 registrar inspeção · I6 re-validar regras. Listas assinam o store → item novo aparece na hora.
4. ✅ **P0 shell**: ⌘K command palette + ⌘J Copilot + exports reais (CSV nas listas, Dossiê PDF/Excel/ZIP).
5. ✅ **P1**: header completo (perfil/preferências/sair/notificações/ajuda), EUDR (novo lote, nova fazenda, validar/enviar DDS, import polígono, MapBiomas), item actions (contatar motorista, guia, novo produto, re-validar).
6. ✅ **P2**: motoristas, configurações, documentos, auditoria, traces, modelos de checklist — todos os botões com modal, navegação, download ou toast.

**Fase 1.5 — COMPLETA. Zero botão morto.** Protótipo 100% clicável, estado em memória na sessão.

**Critério de pronto:** clicar em qualquer botão principal faz algo visível (modal, navegação ou toast). Zero botão morto nas telas P0.

---

*Próximo: revisar/ajustar o conteúdo de cada modal (você disse "depois veremos o que colocar") e então executar a partir da Infra.*
