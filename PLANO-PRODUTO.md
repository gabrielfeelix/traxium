# TRAXIUM — Plano de Produto (MVP Auditável)

> Fonte de verdade de produto. Complementa `DESIGN.md` (visual) e `AGENTS.md` (engenharia).
> Quando o código divergir deste documento, o documento prevalece e o código se ajusta.
>
> **Base de requisitos:** `traxium_perguntas_rafael_v2` (30 perguntas, RD Insight / Bom Frete).
> **Objetivo:** produto que segue o fluxo REAL da operação rodoviária de grãos/feed no Brasil, resolve o problema de compliance GMP+ FSA / EUDR e passa em auditoria.

---

## 0. Princípios-guia (inegociáveis)

1. **Auditável antes de bonito.** Cada tela responde: *o que aconteceu, por quê, quem validou, cadê a evidência.* Se um auditor não reconstrói a decisão a partir do sistema, a tela falhou.
2. **A unidade de controle é o COMPARTIMENTO, não a viagem.** Histórico de cargas e limpeza acompanha a carreta/tanque/compartimento que toca o produto — nunca a placa do cavalo. *(Perguntas 01, 16, 20 — "define sucesso ou fracasso técnico do sistema".)*
3. **Três tipos de decisão, sempre explícitos:** `BLOQUEIO` automático · `ALERTA` com justificativa obrigatória · `REGISTRO` simples. Toda regra do sistema declara a qual tier pertence. *(Página 2 do doc.)*
4. **Offline-first é requisito de conformidade, não feature.** O motorista fica sem sinal exatamente no momento crítico (inspeção, foto, assinatura). *(Perguntas 08, 09.)*
5. **Integridade > dado.** O auditor não quer só ver o dado; quer confiar que aquele dado pertence àquele compartimento, naquele momento. Antifraude e imutabilidade são núcleo. *(Perguntas 14, 20.)*
6. **Baixa fricção no campo.** Motorista: 3–5 min, poucas telas, linguagem operacional, Android de entrada. Gestor: rastreável, com filtro/evidência/trilha. *(Perguntas 03, 09, 10.)*

### Premissa de entrega (corrigir se necessário)

Este plano assume **protótipo funcional navegável com estado real**: store em memória persistente na sessão, motor de regras simulado de verdade (não texto fixo), fila de sincronização e transições de estado reais. Todos os fluxos são demonstráveis ponta-a-ponta **sem backend**. A camada de produção (Postgres, auth, offline nativo em app, integrações) está isolada na **Fase 4**. Se o alvo já é produção real desde já, sobe-se a Fase 4 para o começo.

---

## 1. Modelo de dados — o coração do sistema

> Refatoração estrutural nº 1. Tudo depende disto. O modelo atual (`Viagem` guarda `cavalo`/`carreta` como string e embute `cargasAnteriores`) é substituído.

### 1.1 Hierarquia de ativos (o ponto-chave)

```
Cavalo (Truck)                        registrado na viagem; NÃO carrega T-3 (não toca produto)
Implemento (asset principal)          carreta / tanque / caçamba / baú / graneleiro
  └─ Compartimento (subasset)         boca / divisória / tanque compartimentado — T-3 MORA AQUI
       ├─ LoadHistory[]               cargas anteriores (append-only, imutável)
       ├─ CleaningEvent[]             limpezas entre cargas
       └─ InspectionEvent[]           inspeções pré-carregamento
Viagem = Cavalo + Implemento + Motorista + Produto + Origem/Destino
         → a decisão de limpeza é SEMPRE resolvida no compartimento
```

Um implemento simples (graneleiro) tem 1 compartimento. Bitrem/rodotrem/tanque compartimentado têm N compartimentos, cada um com seu T-3 independente.

### 1.2 Entidades e campos essenciais

**Tenant / Filial** — multiempresa/multifilial desde o nascimento *(pergunta 15: 50–200 motoristas, 30–100 ativos, 10–100 checklists/dia)*.
`id, razaoSocial, cnpj, filiais[], escoposGMP[] (RoadTransportOfFeed | Affreightment), plano, certificacoes[]`

**Usuário + Papel** — RBAC (ver §3).
`id, nome, cpf, papel, filialId, letramentoDigital, ativo`

**Cavalo** — `id, placa, modelo, ano, docsVeiculo, motoristaVinculado?` — sem T-3.

**Implemento** — `id, placa, tipo (graneleiro|tanque|cacamba|bau|bitrem|rodotrem), nCompartimentos, certGMP{status,validade,escopo}, proprietario (frota|subcontratado), subcontratadoId?`

**Compartimento** ⭐ — `id, implementoId, identificador (ex.: "boca 1"), capacidadeT, materialConstrutivo, estadoConservacao, loadHistoryIds[], ultimaLimpezaId?, ultimaInspecaoId?`

**Produto / IDTF** ⭐ — motor de regra, não PDF anexado *(perguntas 17, 19)*.
`id, nomeCanonico, alias[] ("farelo", "soja farelo", "soybean meal"), hsCode, categoria, idtfCode, regimeMinimo (A|B|C|D), riscoGMP, riscoEUDR, proibidoPara[], versaoBase, statusClassificacao (classificado|em_fila|proibido)`
→ Produto desconhecido entra em **fila de classificação da qualidade** e trava o uso até análise.

**LoadHistory** (carga anterior por compartimento) — `id, compartimentoId, produtoId, data, viagemId, regimeAplicadoDepois?, imutavel:true`

**CleaningEvent** ⭐ — evidência **dinâmica por regime** *(pergunta 18)*.
`id, compartimentoId, regime (A|B|C|D|liberacaoCargaProibida), metodo, local, executorId, produtoQuimico?, concentracao?, tempoAcao?, temperatura?, comprovanteEstacao?, fotos[], dataHora, geo, assinatura`
Campos obrigatórios variam por regime (regime A ≠ 20 campos; regime D não libera com só "limpo").

**InspectionEvent** (checklist pré-carregamento / LCI) — `id, compartimentoId, viagemId, itens[], resultado (aprovado|reprovado), fotos[] (ângulos mínimos), inspetorId, dataHora, geo, assinatura, offline:bool`

**Viagem / Remessa** — `id, codigo, status, cavaloId, implementoId, compartimentoIds[], motoristaId, produtoId, origem, destino, cliente, pesoVolume, docsTransporte (CTe/MDFe), loteEUDRId?, decisaoMotor{tier,regra,versaoBase}, aberturaExcecaoId?`

**Subcontratado (empresa)** ⭐ — entidade própria, não só `Motorista.tipo` *(perguntas 12, 21)*.
`id, cnpj, razaoSocial, contrato, certGMP{numero,certificadora,escopo (RoadTransportOfFeed|Affreightment),validade,sitesCobertos[],statusBasePublica}, veiculosAutorizados[], motoristasAutorizados[], treinamento{comprovante,quiz,aceiteRegras}, alertasVencimento (60/30/15d)`

**Exceção / Liberação** — matriz de autoridade *(pergunta 04)*.
`id, viagemId, motivoBloqueio, nivelRequerido (gestor|diretoria+RT|cliente), solicitanteId, aprovadorId?, evidencias[], status, riscoResidualAceito?`

**NC / CAPA** — `id, codigo, severidade (critica|maior|menor), categoria, origem (viagem|compartimento|subcontratado|auditoria), descricao, causaRaiz, acaoCorretiva, responsavel, status`

**Fazenda / Origem EUDR** — `id, produtor, cpfCnpj, car, municipio, uf, poligono (GeoJSON), fonteRecebida (produtor|coop|trading|consultoria), desmatamentoPosMarco, scoreRisco, fontesValidacao[], guardiaEvidencia:true` *(perguntas 25, 26 — transportadora é guardiã, não dona do polígono).*

**Lote → Sublotes/Origens** ⭐ — EUDR é rede, não linha reta *(pergunta 27)*.
`id, codigo, produto, hsCode, toneladas, origens[]{fazendaId, toneladas, loteInterno?}, cenarioMistura (direto|coop_mistura|transbordo|parcial), destinatario, statusDDS, numeroDDS?, versaoDados`

**Evidência (foto)** ⭐ — antifraude *(pergunta 14)*.
`id, hash, origem (camera_app|galeria_importada), geo, precisaoGPS, dataHoraDispositivo, watermark, vinculo{viagemId,compartimentoId,tipo}, imutavelAposSync:true`

**SyncItem** — fila offline *(pergunta 08)*.
`id, entidade, payload, estado (salvo_aparelho|sincronizando|sincronizado|divergente), carimboLocal, carimboServidor?`

**AuditLog / Retificação** ⭐ — imutabilidade *(pergunta 20)*.
Campos travam após sync. Correção = **evento novo** `Retificacao{campoOriginal, valorOriginal, valorNovo, motivo, responsavel, dataHora}` preservando o original. Nunca apagar o passado.

---

## 2. Motor de regras (decision engine)

O núcleo que transforma norma em decisão executável. Roda no despacho e é re-executável na tela de viagem.

### 2.1 Entradas
Compartimento (+ T-3), produto atual, IDTF (versão), certificados (motorista, implemento, subcontratado), inspeção, evidências.

### 2.2 Regras e seus tiers

| Regra | Verifica | Tier | Mensagem (causa + ação) |
|---|---|---|---|
| Carga anterior proibida | LoadHistory[0] × IDTF do produto atual | 🔴 BLOQUEIO | "Compartimento X levou defensivo em dd/mm. IDTF exige regime D antes de farelo. Limpeza não evidenciada." |
| Limpeza incompatível | regime aplicado < regime mínimo IDTF | 🔴 BLOQUEIO | regime exigido + ação |
| T-3 ausente/incompleto | LoadHistory < 3 ou por placa errada | 🔴 BLOQUEIO | "Histórico das 3 últimas cargas incompleto para o compartimento." |
| Checklist reprovado | InspectionEvent.resultado | 🔴 BLOQUEIO | item reprovado |
| Certificado vencido/escopo incompatível | subcontratado/implemento | 🔴 BLOQUEIO | qual cert, validade |
| Produto não classificado no IDTF | statusClassificacao | 🔴 BLOQUEIO → fila qualidade | "Produto não classificado. Enviado à qualidade." |
| Documentação incompleta sem risco direto | CTe/MDFe/foto complementar | 🟠 ALERTA (justificativa obrigatória) | pendência + campo de justificativa |
| Cert a vencer (60/30/15d) | validade | 🟠 ALERTA | dias restantes |
| Dado complementar | metadados não críticos | ⚪ REGISTRO | — |

### 2.3 Saída
`{ tier, regraDisparada, mensagem, acaoSugerida, versaoBaseIDTF, timestamp }` — **a versão da base IDTF usada fica gravada na decisão** *(pergunta 19 — auditável)*.

### 2.4 Matriz IDTF (carga anterior × carga atual)
Estrutura de dados curada/importada manualmente com controle de versão *(pergunta 19)*. Cada célula → regime mínimo ou "proibido". Alias resolve nomes comerciais BR.

---

## 3. Perfis e matriz de permissões (RBAC)

Fase I usa: gestor/qualidade, despachante, motorista, inspetor, admin de subcontratados. Auditor externo = só exportação *(perguntas 03, 05)*.

| Ação | Motorista | Inspetor | Despachante | Gestor/Qualidade | Diretoria/RT | Admin Subcontr. |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Criar viagem / vincular veículo | — | — | ✅ | ✅ | ✅ | — |
| Executar checklist / foto / assinar | ✅ | ✅ | — | — | — | — |
| Aprovar inspeção | — | ✅ | — | ✅ | — | — |
| Registrar ocorrência / solicitar análise | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Liberar exceção nível 1** (doc corrigível, refoto, nova inspeção) | ❌ | ❌ | ❌ | ✅ | ✅ | — |
| **Liberar exceção nível 2** (impacto contratual, terceiro emergencial, risco residual) | ❌ | ❌ | ❌ | co-assina | ✅ | — |
| Classificar produto no IDTF | ❌ | ❌ | ❌ | ✅ | ✅ | — |
| Cadastrar/qualificar subcontratado | ❌ | ❌ | — | ✅ | ✅ | ✅ |
| Exportar dossiê de auditoria | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |

Regra dura: **o motorista nunca libera exceção sozinho.** Cliente/embarcador libera só escopo comercial (atraso, troca de veículo) — nunca "perdoa" contaminação *(pergunta 04)*.

---

## 4. Fluxos REAIS ponta-a-ponta (o foco pedido)

### 4.1 Fluxo mestre da viagem — 11 passos *(pergunta 06)*

Swimlane: quem faz o quê, onde, online/offline, qual tela.

| # | Passo | Ator | Local | Rede | Tela | Estado sistema |
|---|---|---|---|:-:|---|---|
| 1 | Pedido/ordem de frete | Cliente→Despachante | escritório | on | Nova viagem | `Agendada` |
| 2 | Seleção veículo + compartimento + motorista | Despachante | escritório | on | Viagem / seletor de compartimento | vincula assets |
| 3 | Verificação documental (CNH, RNTRC, cert GMP+, treinamento) | Despachante + motor | escritório | on | Motor de regras | valida certs |
| 4 | **Verificação T-3 do compartimento** | Motor | — | on | Sequenciamento T-3 | regime mínimo calculado |
| 5 | Limpeza (regime A/B/C/D) | Motorista/lavador/estação | pátio/posto/fazenda | **off** | App: CleaningEvent dinâmico | evidência anexada |
| 6 | Inspeção pré-carregamento | Motorista/inspetor | pátio | **off** | App: checklist LCI + fotos | InspectionEvent |
| 7 | Liberação para carregar | Motor | — | on/sync | Viagem | `Liberada` ou 🔴 `Bloqueada` |
| 8 | Carregamento | Armazém/terminal | doca | off | App: confirmar | `Em carregamento` |
| 9 | Transporte | Motorista | rodovia | intermitente | App: status/ocorrência | `Em trânsito` |
| 10 | Descarga | Destino | destino | on | App: confirmar/NC | `Descarregando` |
| 11 | Fechamento (dossiê, atualiza T-3 do compartimento) | Sistema | — | on | Viagem | `Concluída` + LoadHistory++ |

**Ponto crítico:** no passo 11, a carga atual vira `LoadHistory` do compartimento — é assim que o T-3 se mantém vivo entre viagens.

### 4.2 Subfluxos

- **Bloqueio → liberação** *(pergunta 04):* motor bloqueia → motorista registra ocorrência + evidência → roteia ao nível de autoridade correto → aprovação/negação com trilha → libera ou mantém. Tempo real: 15min–4h simples, 1–2 dias crítico.
- **Limpeza por regime** *(pergunta 18):* seleção do regime muda os campos obrigatórios. Carga proibida anterior ≠ limpeza comum → procedimento de liberação + inspeção qualificada + aprovação do gestor.
- **Offline → sync → divergência** *(pergunta 08):* preenche offline com carimbo local → fila visível ("salvo no aparelho") → volta rede → sincroniza ("sincronizado com sucesso") → trava edição → divergência abre alerta.
- **EUDR origem → lote → DDS** *(perguntas 26, 27, 28):* recebe origem (shapefile/GeoJSON/KML/PDF/manual) → normaliza campos pesquisáveis → vincula ao lote (1..N fazendas) → status pendente→recebido→validado→exportado→vinculado à DDS → exporta pacote (Excel/PDF/JSON). TRACES manual primeiro.
- **Qualificação de subcontratado** *(perguntas 12, 21):* cadastro (CNPJ, contrato, cert, escopo, sites, veículos/motoristas) → treinamento comprovável (vídeo+quiz+aceite) → valida escopo (não só CNPJ) → alerta 60/30/15d → bloqueio no vencimento.
- **Montagem de dossiê de auditoria** *(perguntas 01, 05, 24):* filtra por período/placa/compartimento/cliente/produto/status → agrega evidências travadas + trilha de aprovação → exporta PDF/Excel/ZIP.

---

## 5. Módulos e telas — escopo por prioridade

Legenda: 🆕 nova · 🔧 refatorar · ✅ manter

| Tela / módulo | Estado | Prioridade | Mudança principal |
|---|---|:-:|---|
| Frota → **Ativos** (Cavalos / Implementos / **Compartimentos**) | 🔧 | P0 | adicionar nível compartimento; T-3 e limpeza por compartimento |
| **Compartimento (detalhe)** — T-3, limpezas, inspeções, estado | 🆕 | P0 | tela nova; é onde o auditor abre o histórico |
| Viagens | 🔧 | P0 | seletor de compartimento; decisão do motor com tier + versão IDTF |
| Viagem (detalhe) → Sequenciamento T-3 | 🔧 | P0 | ler do **compartimento**, não de `viagem.cargasAnteriores` |
| **Motor de regras / IDTF** (base, alias, versão, fila de classificação) | 🆕 | P0 | tela nova de gestão da matriz + fila da qualidade |
| **Limpezas** (CleaningEvent, formulário dinâmico por regime) | 🆕 | P0 | evidência sobe conforme regime |
| Checklists LCI | 🔧 | P0 | virar InspectionEvent real vinculado a compartimento+viagem |
| **Subcontratados** (empresa, escopo GMP+, validade, autorizados) | 🆕 | P0 | entidade própria; hoje só existe no motorista |
| NC / Bloqueios → **NC + CAPA** | 🔧 | P0 | causa raiz + ação corretiva + matriz de autoridade |
| **Exceções / Liberações** (fila de aprovação por nível) | 🆕 | P0 | trilha de autoridade |
| **Dossiê de auditoria** (construtor + exportação) | 🆕 | P0 | entrega central do MVP |
| App do motorista (offline + antifraude) | 🔧 | P0 | estados de sync visíveis, hash, bloqueio de galeria, contingência |
| Motoristas | ✅/🔧 | P1 | vincular a subcontratado; treinamento comprovável |
| Fazendas e polígonos | ✅ | P1 | guardiã de evidência; múltiplos formatos de import |
| Lotes e DDS | 🔧 | P1 | lote→sublotes explícito + status workflow + versão de dados |
| Gateway TRACES | 🔧 | P2 | manual-first; integração é evolução |
| Auditoria (calendário/eventos) | ✅ | P1 | consulta contínua, não "arrumado para auditoria" |
| Conformidade / Dashboard | ✅ | P1 | KPIs por tier de decisão |
| Documentos | ✅ | P1 | modelos normativos (pergunta 22) |
| Rastreio tempo real / telemetria | 🔧 | P2 | **rebaixar** — é evolução, não MVP |
| Auditor read-only | ⛔ | Fase 3 | não projetar login de auditor no MVP |

---

## 6. App do motorista — offline-first + antifraude

*(Perguntas 08, 09, 10, 11, 14)*

**Restrições:** 3–5 min, Android de entrada, aparelho compartilhado, sinal instável, baixo letramento. Uma ação principal por tela.

**Estados de sincronização (obrigatório serem visíveis):**
`salvo no aparelho` → `sincronizando` → `sincronizado com sucesso` → (trava edição). Fila de pendências com contador. Divergência ao subir gera alerta.

**Captura de evidência (antifraude):**
- Foto **direto pela câmera do app** — galeria bloqueada para foto crítica (ou marcada "foto importada").
- **Hash** do arquivo + geo + data/hora do dispositivo + watermark automático.
- Ângulos mínimos obrigatórios: visão geral interna, cantos/frestas, teto/lona/tampa, piso/fundo, descarga/bica, **identificação externa da placa/compartimento**.
- Bloqueio de edição do checklist após envio.

**Checklist mínimo para liberar** (separado de evidência complementar): placa/compartimento, produto atual, última carga, limpeza realizada, fotos obrigatórias, condições visuais essenciais, assinatura. Detalhe longo fica para inspetor/qualidade.

**Formulário contingencial** *(pergunta 13):* em queda sistêmica, formulário aprovado pela qualidade, com lançamento posterior e justificativa. Nunca adesão voluntária.

**Telas:** Login (CPF+senha, sem biometria obrigatória) · Início (viagens) · Detalhe viagem (ação obrigatória em destaque) · Checklist/limpeza dinâmico · Câmera com GPS · Bloqueio explicativo (por quê + o que fazer + pontos de lavagem) · **Fila de sincronização** 🆕.

---

## 7. Dossiê de auditoria (entrega central do MVP)

*(Perguntas 01, 05, 24)* — auditor externo trabalha por amostragem e recebe evidência organizada; **não acessa o sistema no MVP**.

**Construtor:** filtros por período, placa, compartimento, cliente, produto, viagem, status. **Saída:** PDF / Excel / ZIP com anexos, fotos e trilha de aprovação. Deve permitir **reconstruir a decisão**: por que aquele veículo foi liberado, qual carga anterior existia, qual limpeza foi exigida, quem validou, qual evidência comprova. Critério: gerar amostra de 3–6 meses atrás em minutos.

---

## 8. EUDR

*(Perguntas 25–28)* — marco operacional **30/12/2026**; preparar agora.

- **Separar "dado de origem" de "dado de transporte".** Transportadora é **guardiã** da evidência recebida, raramente dona do polígono.
- **Lote → sublotes/origens.** Uma remessa pode ter N fazendas. Cenários: direto · coop com mistura · transbordo (perda de identidade física) · carga parcial. Nunca forçar 1 remessa = 1 fazenda.
- **Import multiformato** → normaliza para campos pesquisáveis: shapefile, GeoJSON, KML, PDF de declaração, planilha, API, upload manual.
- **Status:** pendente → recebido → validado → divergente → exportado → vinculado à DDS. Controle de versão dos dados enviados ao cliente.
- **TRACES NT manual-first.** Integração via API = Fase II/III. Não prometer integração oficial como requisito de primeira entrega — prometer dado estruturado, exportável e auditável.

---

## 9. Imutabilidade e trilha *(pergunta 20)*

Após enviado/sincronizado, **imutável sem trilha de correção**: viagem/remessa/lote, placa do implemento + compartimento, motorista/executor, produto atual + carga anterior, regime exigido + limpeza declarada, fotos + metadados, data/hora + geo, resultado do checklist, assinaturas, responsável pela liberação, certificado do subcontratado no momento da viagem, dados EUDR usados na decisão.

Correção = **evento de retificação** (motivo, responsável, data/hora, preserva original). Nunca apagar o passado.

---

## 10. Roadmap faseado

### Fase 0 — Fundação (bloqueia tudo) — ✅ ENTREGUE
Modelo compartimento-cêntrico em `src/lib/domain/model.ts`. Motor de regras `src/lib/domain/rules-engine.ts` (3 tiers + versão IDTF gravada). Sequenciamento T-3 da viagem lê do compartimento. **Provado em runtime:** trocar cavalo não perde histórico; carga proibida bloqueia.

### Fase 1 — MVP auditável (P0)
- ✅ **Ativos + Compartimento** — Frota reescrita (Cavalos/Implementos/Compartimentos) + tela de detalhe do compartimento (`/frota/compartimento/[id]`) com T-3, limpezas, inspeções, ficha e status.
- ✅ **Motor IDTF + fila de classificação** — `/idtf`: base com alias/versão/risco + fila de produtos não classificados que travam o uso.
- ✅ **Limpezas dinâmicas** — `/limpezas`: formulário que muda campos obrigatórios por regime (A=4 … D=19), progresso e trava até completo.
- ✅ **Subcontratados** — `/subcontratados`: escopo GMP+, validade com alerta 60/30/15, status base pública, autorizados, treinamento; vencido/suspenso bloqueia.
- ✅ **Exceções/autoridade** — `/excecoes`: matriz de autoridade (4 níveis) + fila com aprovar/manter-bloqueio; motorista nunca libera. Banner de bloqueio da viagem linka aqui.
- ✅ **Dossiê exportável** — `/dossie`: filtros (período/status/produto/placa) + seleção + **reconstrução da decisão** por viagem (motor, T-3, limpeza, inspeção, cert no momento, evidências) + export PDF/Excel/ZIP.
- ✅ **App offline + antifraude** — `/mobile`: toggle online/offline, **fila de sincronização** (salvo no aparelho / sincronizando / sincronizado / divergente), banner offline no início, câmera com galeria bloqueada + hash SHA-256 + foto obrigatória da placa externa + bloqueio de edição após envio.
- ✅ **NC + CAPA** — `/bloqueios`: painel CAPA por NC (ação imediata → causa raiz → ação corretiva → responsável/prazo → eficácia); crítica linka para exceção. Removido `Date.now()` (hydration-safe).
- ✅ **Inspeção/LCI real** — `/checklists` virou hub de Inspeção LCI: captura com contexto T-3 do compartimento, condições visuais (tri-state conforme/não-conforme), fotos por ângulo obrigatório, resultado calculado ao vivo (aprovado/reprovado/pendente), separação mínimo-obrigatório × complementar + inspeções recentes (InspectionEvent) + modelos.

**Fase 1 — COMPLETA.** Ciclo P0 auditável ponta-a-ponta: cadastro (ativos/compartimento/subcontratado) → motor IDTF → limpeza → inspeção LCI → bloqueio/exceção → NC+CAPA → dossiê exportável, com app do motorista offline+antifraude.
**Critério de aceite (§11).**

### Fase 2 — EUDR + profundidade (P1)
Lote→sublotes, guardião de origem, status workflow, treinamento comprovável, auditoria como consulta contínua, KPIs por tier.

### Fase 3 — Integrações e auditor (P2/Fase futura)
Auditor read-only com escopo/logs/anonimização, TRACES API, validação geoespacial automatizada, telemetria/seguradora.

### Fase 4 — Produção real
Postgres, auth/RBAC real, offline nativo (service worker/app), hash server-side, versionamento de base IDTF, API ERP/TMS.

---

## 11. Critérios de aceite (definição de pronto do MVP)

Testes de auditabilidade — o sistema passa se:

1. **Reconstrução:** dada uma viagem qualquer, reconstruir em < 2 min: por que liberou/bloqueou, carga anterior do compartimento, limpeza exigida vs. aplicada, quem validou, evidência com geo+hash.
2. **T-3 correto:** trocar o cavalo de uma carreta **não** altera o T-3 do compartimento.
3. **Bloqueio real:** carga anterior proibida sem limpeza compatível **impede** o carregamento (não é aviso ignorável).
4. **Subcontratado:** certificado vencido ou escopo incompatível **bloqueia** sem depender de memória do despachante.
5. **Offline:** checklist preenchido sem sinal sincroniza depois com carimbo local preservado e trava edição.
6. **Imutabilidade:** correção de um campo gera retificação com original preservado.
7. **Dossiê:** exportar amostra de 3–6 meses por placa/compartimento/período em minutos.
8. **IDTF:** produto desconhecido cai em fila de classificação e trava o uso.

---

## 12. Débitos do protótipo atual a corrigir

| Item | Onde | Ação |
|---|---|---|
| T-3 modelado na viagem | `mock-data.ts:106` `cargasAnteriores` | mover para compartimento (Fase 0) |
| Sem entidade Compartimento | `Veiculo.tipo` só Cavalo/Carreta | criar subasset |
| Sequenciamento lê da viagem | `viagens/[id]/page.tsx:185` | ler do compartimento |
| Termo inventado "tractionair" | `DESIGN.md:217`, `mobile/page.tsx:35` | remover — usar agregado/subcontratado/terceiro |
| Subcontratado só como `Motorista.tipo` | `mock-data.ts:271` | entidade empresa com escopo GMP+ |
| IDTF sem alias/versão/fila | `idtfRules` | motor de regra completo |
| Sem estados de sync no app | `mobile/page.tsx` | fila + salvo/sincronizado/divergente |
| Antifraude parcial | evidências | hash + bloqueio galeria + placa externa |
| Telemetria/rastreio no MVP | aba Rastreio | rebaixar para Fase 3 |
| Sem imutabilidade/retificação | — | trilha de correção |

---

## 13. Glossário canônico

GMP+ FSA · EUDR · TRACES NT · **LCI** (inspeção pré-carregamento) · **DDS** (Due Diligence Statement) · **CAR** · **IDTF** (base de cargas/regimes) · **T-3** (três últimas cargas do compartimento) · **FSMS** · **TS 1.9** (Transport activities) · **TS 1.1** (Prerequisite program) · **R1.0** (FSMS) · **Affreightment** (organização/contratação de transporte de terceiros) · Regimes **A** (seca) / **B** (água) / **C** (água+detergente food grade) / **D** (+ desinfecção) · **agregado/subcontratado/terceiro** (nunca "tractionair").

---

*Próximo passo sugerido: executar a Fase 0 (refatoração do modelo de dados) — sem ela, nenhuma outra tela fica correta.*
