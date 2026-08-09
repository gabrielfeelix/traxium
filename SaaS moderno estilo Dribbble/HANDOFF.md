# TRAXIUM — Documento de handoff para o próximo agente

Leia este arquivo INTEIRO antes de tocar em qualquer tela. Ele é a fonte da verdade do projeto: padrões visuais, decisões de UX aprovadas pelo usuário, estado de cada arquivo e o que falta. As regras persistentes também estão em `CLAUDE.md` (leia). O briefing original está em `uploads/BRIEFING-DESIGN.md` e o PDF do P.O. em `uploads/pilares.pdf` (cópia de `uploads/Traxium - 5 Pilares prioritários.pdf`).

## 1. O produto

Traxium: SaaS de compliance e rastreabilidade GMP+ para transporte de feed (ração animal) no agronegócio brasileiro. Conceito central que o usuário AMA e repete: **o estado deriva dos fatos, ninguém digita estado**. O motor de regras decide (12 condições); pessoas mudam fatos (limpeza, certificado, trilha) e o motor reavalia sozinho. Bloqueio técnico (contaminação) NÃO tem botão de aprovar: tem plano de regularização. "Manter bloqueio" também é decisão registrada. Nada se apaga: correção vira evento novo (retificação, revogação, cancelamento).

Os 5 pilares do PDF: 1 Gatekeeper/Subcontratados (comercialmente o mais importante), 2 Academy, 3 Motor IDTF, 4 Control Tower, 5 Network/Ativos. Dossiê de auditoria é o critério de aceite: reconstruir amostra de meses atrás em minutos.

## 2. Direção visual APROVADA (não desviar)

O usuário quer "dribbble/awwwards", tátil, com dopamina; ele ODEIA cara de IA.

- **Fontes**: Hanken Grotesk (UI) + Spline Sans Mono (códigos, placas, números, horas, hashes). Google Fonts no helmet.
- **Paleta**: teal #127670, #0C5862, #093D44 (sidebar), azul #0E78B5. Semânticas: verde #1a8f57 (ok), âmbar #b97514 texto / #e8a33d dot (atenção), vermelho #c43d3d (bloqueio), amarelo regime B #e3c235. Tinta #0b2224, texto secundário #5c706e, terciário #7c8f8d, bordas #e4eae8/#eef2f1, fundo página #f2f5f4, fundo suave #f7faf9.
- **PROIBIDO (cara de IA)**: fill pastel chapado monocolor (fundo pastel + texto do mesmo tom), travessão (—) em qualquer texto de UI (usar : , ou .), emoji, gradientes agressivos de fundo, Inter/Roboto.
- **Tratamentos táteis aprovados no lugar de fill chapado**: dot com anel (`width:9px;border-radius:99px;background:linear-gradient(...);box-shadow:0 0 0 3px rgba(...,.16)`) + número em tinta escura; split bars com degradê + fundo hachurado (`repeating-linear-gradient(-45deg,#eef2f1 0 5px,#e2e9e7 5px 10px)`); barras verticais com degradê.
- **Componentes assinatura**: sidebar teal escura em degradê (`linear-gradient(178deg,#093D44,#0A4650)`) com item ativo em pílula degradê (`linear-gradient(90deg,rgba(26,158,147,.35),rgba(14,120,181,.28))` + borda rgba(255,255,255,.14)); cards brancos radius 18-20px com borda #e4eae8; avatares de iniciais com degradê e ANEL (`box-shadow:0 0 0 3px #fff,0 0 0 4.5px <cor>`); chips pill (border-radius:99px); botão primário `linear-gradient(135deg,#127670,#0E78B5)` em pílula com sombra `0 6px 14px rgba(18,118,112,.3)` e hover translateY(-1px); heros escuros `linear-gradient(115deg,#093D44,#0C5862 60%,#0E78B5 140%)` com glow radial branco.
- **Skeletons**: shimmer `@keyframes txsh` + `linear-gradient(90deg,#eef2f1 25%,#f7faf9 40%,#eef2f1 55%);background-size:600px 100%`, com `state.loading` + setTimeout 900ms.
- **Toast padrão**: fixed bottom center, fundo #0b2224, pílula, dot verde ✓; método `avisar(msg)` com clearTimeout/setTimeout ~4200ms.
- **Modais**: overlay `rgba(9,34,36,.45)` + backdrop blur 3px; card branco radius 24, sombra `0 40px 100px rgba(9,34,36,.4)`; botão X em círculo #f0f4f3. Botão confirmar DESABILITADO (cinza #eef2f1 / texto #9db0ae / cursor not-allowed) até preencher o obrigatório.
- **Drawers**: da direita, 480-560px, capa em degradê teal escuro, `animation:deslizar .3s` (keyframes no helmet).
- **Radios/chips de seleção**: borda 1.5px; selecionado = borda #127670 + fundo #eef7f6 + dot degradê.
- **Layout**: 1920px, `min-width:1560px` no wrapper raiz, sidebar 264px sticky (retraída 84px, persistida em `localStorage 'tx-nav'` via `navVals()`, padrão copiado em toda tela). Grid conteúdo: `1fr 392px` (fila + rail).
- **Dados**: pt-BR, realistas de feed: soja/farelo/milho/calcário, placas BR (QAS 7C31), rotas MT/MS/GO/MG, nomes brasileiros, CNPJs. Nunca lorem.
- **Idioma dos empty states**: amigáveis, explicam o próximo passo.
- **Todo botão visível deve fazer algo** (modal, drawer, navegação ou toast explicando a consequência). O usuário cobra isso ferozmente: já devolveu o trabalho duas vezes por "botão morto".

## 3. Arquitetura técnica

- Cada tela é um Design Component `.dc.html` standalone; estilos 100% inline; `<helmet>` com fonts + body reset + keyframes; classe `Component extends DCLogic` com `renderVals()` que espalha `{...this.navVals(), ...this.mainVals(), ...}`.
- Navegação entre telas por `<a href="Nome.dc.html">` na sidebar (todas as 10 telas desktop têm a mesma sidebar; itens sem tela têm tag "em breve").
- `navVals()` idêntico em todas: colapso da sidebar com localStorage `tx-nav`; badges da sidebar somem quando retraída (`display:{{ navL }}`).
- App mobile usa `android-frame.jsx` via `<x-import component-from-global-scope="AndroidDevice" from="./android-frame.jsx" hint-size="393px,830px">`, telas lado a lado num canvas (`design_doc_mode: canvas`).
- Mapas (Viagem Detalhe, app Lavagem) usam Leaflet carregado no helmet.

## 4. Estado dos arquivos (todos entregues e revisados)

| Arquivo | Conteúdo e interações funcionais |
|---|---|
| `Torre de Controle v2.dc.html` | TELA PRINCIPAL. Triagem (split bar 79% motor×autoridade), fila de decisões (risco GMP+ + prazo carregamento + tempo em fila, expandir com evidências ✓/✕ em ícones, cta2 por item), Plano de regularização (modal timeline 4 passos), filial/período recalculam KPIs e fila (cenario()), busca com dropdown, Exportar (modal blocos+formato), Ver todos (drawer 12 vencimentos com links), perfil/preferências, skeleton. Props: evidenciasComoIcones, simularFilaVazia |
| `Torre de Controle.dc.html` | v1 antiga com as 3 direções (1a/1b/1c). NÃO evoluir; manter como histórico |
| `Viagens.dc.html` | Tabela com filtros decisão/status/regime, busca, skeleton; Nova viagem completa (produto com busca + análise técnica p/ não reconhecido, conjunto, motorista inelegível explicado, cliente, origem/destino, peso, janela) cria VG-2497 na lista |
| `Viagem Detalhe.dc.html` | Breadcrumb, banners por estado (prop estadoDaViagem: bloqueada/liberada_por_autoridade/liberada_pelo_motor), stepper do ciclo operacional (avança de verdade; bloqueada trava), checagens do motor com chips R-01..R-12 abrindo a regra, reavaliar, tabs (resumo/T-3 com mapa Leaflet/evidências/linha do tempo), contatar motorista, guia, trocar veículo/motorista, NC, retificar fato, cancelar com motivo, anexar comprovante |
| `Excecoes.dc.html` | Fila de exceções, matriz de autoridade 0-5, modal de liberação com 9 campos obrigatórios (progresso 4/9→9/9), manter bloqueio com fluxo próprio (motivo + ação indicada + assinatura), registro lacrado com validade/expiração e Revogar liberação, pedir evidência com destinatário+prazo, plano de regularização do bloqueio técnico |
| `Subcontratados.dc.html` | Funil dos 9 estados clicável, lista com avatar anelado por estado, menu por linha (exportar/renovar/trilha/suspender com vigência/arquivar), Passaporte Feed Safety (drawer: selos, apto para, o que falta, certificado completo com número/sites/validade/doc original, acordo, frota com vincular/desvincular datados, eventos), convite com canal+destinatário obrigatório, importar planilha com triagem de duplicidades |
| `Motor IDTF.dc.html` | Busca brasileira (casquinha→soybean hulls) com sinônimos destacados, veredito por compartimento (simulador recalcula), Base v2026.07 com histórico de versões, Ficha completa (drawer: restrições, risco, nomes regionais, fonte+evidência, responsável, histórico, colisões/recusas), fila técnica de não reconhecidos com modal de classificação (sugestão do motor + busca real p/ vincular) |
| `Academy.dc.html` | KPIs, 10 trilhas com drawer (conteúdo, quem falta, nova versão/editar/arquivar), competência por motorista Lista/Matriz (7×10 células clicáveis), timeline "o que aconteceu" diferenciando vencida × reprovada 2×, card just-in-time, regras de liberação, enviar em massa, relatório |
| `Ativos e Frota.dc.html` | KPIs + split bar aptidão, lista de conjuntos expandível (compartimentos com T-3 linkando ao detalhe, checks, ações contextuais), plano C2, agenda de inspeção (reagendar muda data), disparar renovação (muda o check), trocar vínculo (troca o dono na lista), unificar/comparar duplicidades (KPI cai), novo ativo (detecta placa duplicada, insere na lista), importar planilha com triagem |
| `Compartimento Detalhe.dc.html` | Passaporte do compartimento: T-3 vivo, limpezas e inspeções abrem drawer do registro (campos, evidências com download, hash, iniciar retificação), registrar limpeza retroativa (regime+executante+justificativa min 15), verificar integridade da cadeia, breadcrumb→Ativos |
| `Dossie.dc.html` | Amostra com filtros dropdown, seleção de viagens, gerar reconstrução (fases inicial/gerando/gerado), tabs entre as 3 VGs (VG-2344 é parcial com lacuna declarada + reprocessar), hash raiz copiar/verificar, 16 blocos clicáveis (modal com campos+hash+encadeamento), exportações, compartilhar com auditor (email+expiração) |
| `Inspecoes.dc.html` | Fila do pátio (compartimentos esperando, com T-3 e prazo) e inspeções registradas. Componente assinatura: a **prancheta dos 6 ângulos obrigatórios** (capturado = hachura teal com anel ✓; faltando = borda tracejada vermelha), cada ângulo clicável abre modal com metadados ou notifica o inspetor. Checklist dinâmico por tipo de implemento no rail (Graneleiro 8/3 críticos, Tanque 9/4, Baú 7/2) que troca ao vivo. Modal "Despachar inspeção" mostra o checklist detectado do implemento e trava motorista com trilha vencida. Drawer do registro lacrado com hash e retificação. Prop: simularPatioVazio |
| `Limpezas.dc.html` | Distribuição por regime A-D em barras com degradê semântico, comprovantes pendentes, retroativas. Componente assinatura: a **escada dos regimes** (A 4 campos → B 8 → C 13 → D 19, indentada e clicável, mostrando o que cada um exige). Modal "Registrar limpeza" com contador vivo de campos, "importar do comprovante da estação" que preenche 13 campos de uma vez, estação não credenciada recusa regime acima do seu nível, e o **guardrail do par proibido**: escolher o C2 risca os quatro regimes e troca o CTA para plano de regularização. Callout de bloqueio técnico ligado à VG-2487 |
| `Indicadores.dc.html` | Os 15 indicadores do §7.16 com a honestidade de dado como design. Componente assinatura: a **barra de cobertura 11 de 15** no hero escuro, 11 segmentos sólidos e 4 hachurados tracejados, cada segmento clicável. Os 11 calculados trazem sparkline SVG, delta com sinal correto (indicador inverso como bloqueios e duplicados tem cor invertida) e a fórmula resumida no rodapé do card; o drawer abre fórmula, origem do número, série de 12 períodos em barras e link para a tela onde se resolve. Os 4 não medidos ficam em bloco próprio, hachurados, com "não medido" no lugar do número e modal com os passos de instrumentação que faltam |
| `Nao Conformidades.dc.html` | NCs com o ciclo completo até a raiz. Componente assinatura: o **trilho horizontal de 4 etapas** (ação imediata, causa raiz, ação corretiva, verificação de eficácia) dentro de cada NC expandida, com a etapa atual em degradê e sombra, e prazo vencido em vermelho com ícone próprio. Rail de reincidência por subcontratado (2 ou mais NCs da mesma categoria em 90 dias) e distribuição por categoria. Modal Abrir NC exige origem, severidade, categoria, descrição de 20+ e ação imediata de 15+. Modal de verificação de eficácia com duas saídas: eficaz fecha a NC, não eficaz devolve para causa raiz preservando o histórico. NC crítica linka ao bloqueio na tela de Exceções |
| `App de Campo.dc.html` | Canvas com 12 telas Android: 1 minhas viagens (tabs, notificações, sync), 2 viagem de hoje (sheets T-3/checklist), 3 checklist interativo (recalcula ao vivo), 4 câmera antifraude, 5 bloqueio que explica, 6 sincronização (divergência é estado), 7 sucesso, 8 pós-captura (refazer/confirmar interativo), 9 assinatura (toque+enviar), 10 resolver divergência (escolha+justificativa), 11 contingência/entrada por código, 12 versão do inspetor de pátio. Tab Lavagem tem mapa Leaflet + lista |
| `android-frame.jsx`, `image-slot.js`, `support.js` | Infra; não editar |

## 5. Regras de domínio que o design JÁ respeita (não regredir)

- Implemento NÃO tem "certificação GMP+": usar **laudo de inspeção / documentação do implemento**. Certificado GMP+ é da EMPRESA (com número, sites, certificadora). MOPP não é requisito GMP+ (nunca mostrar como NC genérica).
- T-3 = três últimas cargas DO COMPARTIMENTO (não do veículo). O histórico pertence ao compartimento e sobrevive a trocas de vínculo.
- Regimes de limpeza A (seca, 4 campos), B (água), C (detergente), D (desinfecção, mais campos). Carga proibida no T-1 não tem regime que resolva: procedimento formal.
- Matriz de autoridade níveis 0-5; nível 0 = técnico = ninguém libera. Liberação por autoridade = registro de 9 campos; o motor segue reprovando e os dois registros convivem.
- Competência do motorista deriva da trilha vigente (não existe campo "apto"). Reprovou 2× = reforço obrigatório. Venceu = bloqueio automático; concluiu = volta sozinho.
- Estados de qualificação (9): Pré-cadastrado, Pendente documental, Pendente treinamento, Pendente inspeção, Apto, Apto com restrição, Bloqueado, Suspenso, Inativo. Não existe excluir; arquivar preserva histórico.
- Offline-first no app é requisito de conformidade; divergência de sync é um estado próprio com resolução justificada, nunca erro silencioso; registro sincronizado trava (correção = evento novo).
- Personas: Rafael Antunes (gestor de qualidade, avatar RA laranja), Helena Duarte (Qualidade), Jorge Mattos (inspetor JM), Ivan Prado (motorista IP), Valdir Nunes (VN, trilha vencida), João Bortolini (TAC, reprovado 2×), Lima Logística (suspensa na base pública: o caso-fio-condutor), Transrocha (vence em 12d), Cerrado Cargas (apta).

## 6. O que FALTA (validado contra o PDF em 6 ago)

Inspeções, Limpezas, Indicadores e Não conformidades foram entregues em 6 ago (ver tabela acima). A sidebar não tem mais nenhum item "em breve". Restam, por ordem de valor:

1. **Formulário público de onboarding** (o que o motorista abre no link do convite): CPF, CNH, placas, T-3, aceite; sem conta.
2. **Configurações / motor de regras**: classificar cada regra (bloqueio automático / alerta com justificativa / condicional), regras de liberação da Academy (nota mínima, tentativas, reciclagem), por cliente/produto/filial.
3. **Console administrativo Traxium**: precificação por faixas, módulos, integrações, usuários admin.
4. Fora do PDF (escopo novo, só se o usuário pedir): portal do subcontratado, visão do auditor (já existe o link só leitura no Dossiê), EUDR (PDF manda deixar para a segunda onda, só "trilhos").

## 7. Como trabalhar com este usuário

- Ele comenta nas telas (ferramenta de comentários): quando pedir, ler comentários e resolver um a um.
- Ele pede fluxo de verdade: nunca entregar botão que só existe visualmente. Toast é o mínimo aceitável; modal/drawer/estado é o preferido.
- Perguntar antes de criar telas fora do PDF; ele gosta de opinião de UX fundamentada ("como meu UX/UI designer, decida").
- Ao terminar qualquer tela, conectar na sidebar de TODAS as outras (padrão: transformar o `<div>` do item em `<a href>`; script em lote via run_script já foi usado para isso).
- Novas versões relevantes: copiar o arquivo (`X v2.dc.html`) em vez de sobrescrever quando for redesign.

## 8. Estado da amarração (6 ago)

Auditado e corrigido: o avatar do topo era markup idêntico em 10 telas mas só a Torre v2 tinha o `onClick`; nas outras nove era bolinha decorativa. Agora todas compartilham o mesmo `perfilVals()` (dropdown, Meu perfil, Preferências com o toggle de bloqueio técnico travado). Nas telas corrigidas em lote o stopPropagation dos modais chama-se `pararCliquePerfil` para não sombrear o `pararClique` que a tela já tinha.

Sidebar: os quatro itens que eram "em breve" viraram `<a href>` nas 14 telas desktop. Nenhuma sidebar tem item morto, e todo alvo de `href` referenciado no projeto existe em disco (14 alvos, zero quebrado).

O que ainda amarraria mais: (a) uma tela "Início/Login" apontando para a Torre; (b) varrer os links contextuais um a um, porque hoje só se garantiu que o destino existe, não que o item certo abra o registro certo.
