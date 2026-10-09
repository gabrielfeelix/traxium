# Torre de Controle
Arquivo: Torre de Controle v2.dc.html. Item da sidebar: "Torre de Controle" (primeiro item, acima das seções, ativo, badge "7"). Perfil a quem se destina (pelo que a tela diz): o usuário logado é "Rafael Antunes", "Gestor de qualidade / GMP+"; a fila mostra, por item, quem resolve a pendência ("Bloqueio técnico: ninguém libera", "Diretoria + Resp. Técnico", "Gestor de qualidade", "Inspetor de pátio", "Tráfego"). Objetivo declarado na tela: não há frase de objetivo; o subtítulo resume o dia ("Terça, 5 ago / 44 viagens / 7 esperam decisão / Filial Rondonópolis MT") e a fila se chama "Fila de decisões", ordenada por "risco GMP+ → prazo de carregamento → tempo em fila". É a tela de entrada do protótipo (index.html redireciona para ela).

Convenção deste inventário: o separador ponto médio da interface aparece como " / " nas citações.

## Entradas e saídas
- Como se chega: `index.html` redireciona para esta tela; item "Torre de Controle" da sidebar de Excecoes.dc.html e Indicadores.dc.html; botão "Ver a fila de decisões" no drawer do indicador "Operações liberadas sem intervenção humana" em Indicadores.dc.html. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Viagens" (Viagens.dc.html), "Exceções e liberações" (Excecoes.dc.html), "Inspeções" (Inspecoes.dc.html), "Limpezas" (Limpezas.dc.html), "Motor IDTF" (Motor IDTF.dc.html), "Subcontratados" (Subcontratados.dc.html), "Motoristas" (Motoristas.dc.html), "Acessos externos" (Acessos Externos.dc.html), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html), "Não conformidades" (Nao Conformidades.dc.html), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html), "Protótipo mobile" (App de Campo.dc.html). O item "Torre de Controle" é um div sem link.
  - Dropdown da busca: cada resultado é link para "Viagem Detalhe.dc.html" (mesmo arquivo para qualquer VG).
  - Item expandido da fila: botão "Abrir viagem" é link para "Viagem Detalhe.dc.html" (mesmo arquivo para qualquer VG).
  - Drawer "Vai travar em breve / 12": cada linha é link. Transrocha Transportes, AgroLima Ltda, Cerrado Cargas e Sindona Transportes levam a Subcontratados.dc.html; SQT 7D22 e SQT 3A90 levam a Ativos e Frota.dc.html; Milton Costa e "J. Bortolini / TAC" levam a Academy.dc.html.
  - Nenhum outro elemento navega.

## Estrutura da tela
1. Sidebar canônica (ver shell-global.md). Item ativo "Torre de Controle" com badge branco "7". Card de rodapé "Base IDTF Brasil": "v2026.07 vigente", "Revisada em 28 jul / Qualidade". Badges fixos.
2. Cabeçalho. Título "Torre de Controle". Subtítulo calculado: "{rótulo do período} / {viagens} viagens / {análise + bloqueadas} esperam decisão / Filial {filial}"; com período encerrado troca "esperam decisão" por "período encerrado". Exemplo: "Terça, 5 ago / 44 viagens / 7 esperam decisão / Filial Rondonópolis MT". Reage a filial e período.
3. Barra superior à direita, nesta ordem:
   - Campo de busca, placeholder "Buscar viagem, produto, rota…", chip "⌘K".
   - Botão "Filial Rondonópolis MT ▾" (4 opções: Rondonópolis MT, Sorriso MT, Cuiabá MT, Rio Verde GO, com ponto indicando a ativa).
   - Botão "Hoje ▾" (4 opções: Hoje, Ontem, Esta semana, Este mês).
   - Botão "Exportar".
   - Avatar "RA" que abre o menu de perfil.
4. Triagem: 4 cards em linha. Reagem a filial e período.
   - "Liberadas sem intervenção humana": percentual grande (ex.: "77%"), texto "34 pelo motor / 3 por autoridade", barra dividida (motor em verde, autoridade em âmbar, resto hachurado) e legenda "Motor", "Autoridade", "Em aberto".
   - "Liberadas por autoridade": número (ex.: 3) e rodapé "assinadas sobre bloqueio".
   - "Aguardando análise": número (ex.: 5) e rodapé com a idade da mais antiga (ex.: "mais antiga: 42 min").
   - "Bloqueadas": número (ex.: 2) e rodapé (ex.: "1 bloqueio técnico").
   - Valores por filial no período "Hoje" (viagens / motor / autoridade / análise / bloqueadas / rodapés): Rondonópolis MT 44 / 34 / 3 / 5 / 2 / "mais antiga: 42 min", "1 bloqueio técnico"; Sorriso MT 27 / 22 / 1 / 2 / 1 / "mais antiga: 18 min", "certificado suspenso"; Cuiabá MT 18 / 15 / 1 / 2 / 0 / "mais antiga: 12 min", "nenhum bloqueio hoje"; Rio Verde GO 9 / 9 / 0 / 0 / 0 / "fila zerada", "nenhum bloqueio hoje".
   - Período: "Hoje" rótulo "Terça, 5 ago" (fator 1); "Ontem" rótulo "Segunda, 4 ago" (fator 1,1; análise e bloqueadas zeradas, rodapés "período encerrado" e "tudo resolvido no período"); "Esta semana" rótulo "4 a 8 ago" (fator 4,2); "Este mês" rótulo "Agosto" (fator 18). O fator multiplica viagens, motor e autoridade; análise e bloqueadas não são multiplicadas.
5. Fila de decisões (coluna esquerda).
   - Título "Fila de decisões", subtítulo "risco GMP+ → prazo de carregamento → tempo em fila".
   - Chips de filtro: "Todas / 5", "Bloqueadas / 2", "Em análise / 3" (contagens refletem a filial, não a busca).
   - Cada item é um card recolhível com: avatar de iniciais com anel (EF, IP, VN, JM, RS, sem legenda), produto, código da viagem, rota com cliente, chip de risco com tooltip "risco GMP+ da pendência" ("crítico", "alto", "médio", "baixo"), nível que resolve + "resolve esta pendência", prazo + "carrega", tempo + "em fila" (vermelho quando antigo), chevron.
   - Expandido: texto do motivo, linha "→ {ação}", botões "Abrir viagem" e um segundo botão variável; bloco "EVIDÊNCIAS ESSENCIAIS" com 6 ícones (T-3, LIMP, INSP, FOTO, CERT, COMP) marcados ✓ ou ✕, tooltip "Limpeza: faltando" ou "T-3: ok"; bloco "PENDÊNCIAS EM ABERTO" com texto e idade.
   - Mock com 5 itens, sem paginação. Por padrão VG-2487 abre expandido.

| VG | Produto | Rota / cliente | Risco | Resolve | Carrega | Em fila | 2º botão | Evidência ✕ | Pendências |
|---|---|---|---|---|---|---|---|---|---|
| VG-2487 | Farelo de amendoim | Rondonópolis MT → Chapecó SC / Coop. Aurora | crítico | Bloqueio técnico: ninguém libera | hoje 14:00 | 3h 12min | Plano de regularização | Limpeza | "Ocorrência registrada pelo motorista" há 3h 05min; "Resposta da Qualidade" em aberto |
| VG-2490 | Farelo de soja | Sorriso MT → Uberlândia MG / NutriMax Rações | crítico | Diretoria + Resp. Técnico | amanhã 06:30 | 1h 05min | Solicitar exceção | Certificado | "Consulta à base pública (automática)" há 1h 02min |
| VG-2492 | Milho a granel | Lucas do Rio Verde MT → Rio Verde GO / Granja Sto. Expedito | alto | Gestor de qualidade | hoje 17:30 | 42 min | Enviar trilha ao motorista | Competência | "Solicitação de análise do despachante" há 42 min |
| VG-2494 | Casca de soja peletizada | Rondonópolis MT → Campo Grande MS / Bela Vista Nutrição | médio | Inspetor de pátio | hoje 16:00 | 18 min | Notificar inspetor | Fotos | "Captura do ângulo faltante" há 18 min |
| VG-2496 | Calcário calcítico | Nobres MT → Sinop MT / Agropec. Talismã | baixo | Tráfego | amanhã 08:00 | 9 min | Justificar e liberar | Certificado | "Justificativa do tráfego" há 9 min |

   - Exemplos de motivo e ação: VG-2487 "Carga anterior proibida no compartimento C2 (T-1: ureia pecuária). Não existe regime de limpeza que libere esta combinação; a base IDTF classifica como proibida." / "→ Regularizar o fato: procedimento formal de liberação + inspeção qualificada + reavaliação pelo motor". VG-2492 "Trilha "Regimes de limpeza" do motorista Valdir Nunes vencida há 6 dias. A competência é derivada da trilha vigente; não há campo para marcá-lo como apto." VG-2496 "Documentação do implemento SQT 7D22 (laudo de inspeção) vence em 12 dias. A regra é de alerta: permite seguir mediante justificativa registrada, e o vencimento travará sozinho."
   - Itens por filial: Rondonópolis MT mostra os 5; Sorriso MT mostra VG-2490 e VG-2496; Cuiabá MT mostra VG-2492 e VG-2494; Rio Verde GO não mostra nenhum.
6. Rail direito, card "Onde a pendência está", subtítulo "itens em aberto por pilar": 5 barras verticais com degradê e valor: "Viagens e liberação" 7, "Qualif. terceiros" 4, "Competência" 3, "Consulta e regimes" 2, "Cadastro e ativos" 1. Fixo.
7. Rail direito, card "Vai travar em breve (12)" com link "Ver todos →": barra dividida (12% vermelho, 24% âmbar, 38% teal) com legenda "1 / 15d", "3 / 30d", "8 / 60d"; lista de 4 linhas (avatar, nome, documento, dias com ponto colorido): "Transrocha Transportes", "GMP+ B4.3 / escopo transporte", "12 dias"; "AgroLima Ltda", "Acordo de qualidade v3", "27 dias"; "Cerrado Cargas", "GMP+ B4.3 / afretamento", "44 dias"; "J. Bortolini / TAC", "Trilha: regimes de limpeza", "58 dias". Fixo.

## Ações

| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Campo de busca | Barra superior | muda estado | Filtra a fila por código, produto, rota e motivo; abre dropdown com até 5 resultados (código, produto, chip "Bloqueada" ou "Em análise"), cada um link para Viagem Detalhe; sem resultado mostra "Nada encontrado na fila de hoje."; rodapé "a fila abaixo já está filtrada por esta busca". O dropdown fica aberto enquanto houver texto. |
| Chip "⌘K" | Dentro da busca | nada | Apenas visual; não há atalho de teclado no arquivo. |
| "Filial {x} ▾" | Barra superior | muda estado + toast | Troca triagem, subtítulo e itens da fila. Toast: "Filial Sorriso MT: fila e triagem agora mostram só esta operação." |
| "{período} ▾" | Barra superior | muda estado + toast | Recalcula triagem e subtítulo; "Ontem" esvazia a fila. Toast: "Mostrando ontem: triagem e fila recalculadas." |
| "Exportar" | Barra superior | modal | Abre "Exportar a torre". |
| Avatar "RA" | Barra superior | menu | Abre menu de perfil (ver abaixo). |
| Chips "Todas", "Bloqueadas", "Em análise" | Fila | muda estado | Filtram por severidade. |
| Cabeçalho do card da fila | Fila | muda estado | Expande ou recolhe; só um item aberto por vez. |
| "Abrir viagem" | Item expandido | navegação | Viagem Detalhe.dc.html. |
| "Plano de regularização" | Item VG-2487 | modal | Abre "Plano de regularização". |
| "Solicitar exceção" | Item VG-2490 | toast | "Pedido de exceção aberto: vai à mesa de Diretoria + Resp. Técnico com o registro de 9 campos." Nenhuma mudança de estado. |
| "Enviar trilha ao motorista" | Item VG-2492 | toast | "Trilha "Regimes de limpeza" enviada a Valdir Nunes por WhatsApp. Conclusão reavalia a viagem sozinha." Nenhuma mudança de estado. |
| "Notificar inspetor" | Item VG-2494 | toast | "Inspetor de pátio notificado: falta o ângulo da bica de descarga no C1." Nenhuma mudança de estado. |
| "Justificar e liberar" | Item VG-2496 | toast | "Justificativa registrada e renovação disparada ao subcontratado. A viagem segue liberável até o vencimento." Não abre campo de justificativa; nenhuma mudança de estado. |
| Ícones de evidência | Item expandido | nada | Só tooltip. |
| Linhas de "Vai travar em breve" | Rail | nada | Têm cursor de clique e hover, sem ação. |
| "Ver todos →" | Rail | drawer | Abre drawer de vencimentos. |
| Linhas do drawer | Drawer | navegação | Ver "Para onde leva". |
| "Recolher menu" | Sidebar | muda estado | Recolhe a sidebar (persistido em localStorage `tx-nav`). |
| Clique fora / Esc | Global | muda estado | Fecham menus suspensos (filial, período, perfil); Esc também fecha os modais do perfil. Esc não fecha Plano, Exportar nem o drawer. |

Menu de perfil (dropdown): cabeçalho "Rafael Antunes", "Gestor de qualidade / GMP+"; itens "Meu perfil", "Preferências e notificações", "Aparência" (injetado pelo shell, alterna tema claro/escuro), "Papel ativo" com chip do papel ("Gestor"), separador, "Sair" em vermelho. O shell reposiciona este menu para posição fixa no canto superior direito.

Modais e drawers:

- Modal "Plano de regularização" (chip "VG-2487"). Subtítulo: "bloqueio técnico não tem aprovação: tem plano. A viagem só reavalia quando os fatos abaixo existirem." Linha do tempo com 4 passos e tag de estado: "Ocorrência registrada" (feito; "Edson Farias, pelo app, hoje 07:52 / ureia pecuária no T-1 do C2"); "Procedimento formal de liberação" (em andamento; "Qualidade preenche o procedimento com agente, dosagem e tempo exigidos pela base IDTF"); "Limpeza qualificada / regime D" (agendada; "Higitrans Rondonópolis / amanhã, 14:00 / credenciada para regime D"); "Inspeção qualificada + reavaliação pelo motor" (aguarda; "inspetor de pátio captura as evidências; o motor reavalia sozinho. Ninguém aperta "liberar"."). Card "Edson Farias segue com o conjunto parado no pátio", "notificado no app / pontos de lavagem sugeridos na tela dele". Sem campos. Botões "Fechar" e "Notificar envolvidos". "Notificar envolvidos" fecha e mostra toast "Qualidade, Higitrans e o motorista notificados. O plano fica anexado à VG-2487." Nada é criado ou alterado.
- Modal "Exportar a torre". Subtítulo calculado: "escopo atual: terça, 5 ago / Filial Rondonópolis MT. O arquivo sai com carimbo de data e autor." Seção "O QUE VAI NO ARQUIVO" com 3 caixas de seleção: "Triagem do período" ("liberadas pelo motor, por autoridade, bloqueadas", marcada), "Fila de decisões" ("pendências com risco, prazo, responsável e motivo", marcada), "Vencimentos próximos" ("certificados, acordos e laudos em 60 dias", desmarcada). "FORMATO": "planilha (.xlsx)" (padrão) ou "PDF assinado". Botões "Cancelar" e "Gerar arquivo". Nenhum campo obrigatório; gera mesmo com zero blocos marcados. Toast: "Arquivo gerado em planilha (.xlsx), com carimbo de 6 ago e autor Rafael Antunes." Seleções ficam guardadas no estado da tela.
- Drawer "Vai travar em breve / 12". Subtítulo "vencimentos que tiram alguém da lista de elegíveis; cada um leva à tela onde se resolve". 8 linhas (avatar, nome, documento, dias): Transrocha Transportes, "certificado GMP+ B4.3 / escopo transporte", 12 dias; SQT 7D22, "laudo de inspeção do implemento", 12 dias; AgroLima Ltda, "acordo de qualidade v3", 27 dias; Milton Costa, "trilha 9 / proteção da carga", 12 dias; Cerrado Cargas, "certificado GMP+ B4.3 / afretamento", 44 dias; SQT 3A90, "laudo de inspeção do implemento", 44 dias; "J. Bortolini / TAC", "trilha 10 / boas práticas Gatekeeper", 58 dias; Sindona Transportes, "acordo de qualidade v3", 60 dias. Fecha pelo X ou clique no fundo.
- Modal "Meu perfil" (somente leitura): avatar, "Rafael Antunes", "rafael.antunes@traxium.com.br"; linhas "Papel: Gestor de qualidade", "Autoridade na matriz: nível 3 / Gestor", "Filiais: Rondonópolis, Sorriso", "Liberações assinadas em 2026: 14"; nota "Toda assinatura sua fica no registro lacrado da viagem. O papel define o que a matriz permite; ninguém assina acima do próprio nível." Só fechar.
- Modal "Preferências e notificações": 4 interruptores: "Bloqueio técnico na filial" ("sempre ativo: requisito da certificação", travado ligado), "Item há mais de 2h na fila" ("aviso no app e por e-mail", ligado), "Certificado de terceiro a vencer" ("aos 30 e aos 15 dias", ligado), "Nova versão da base IDTF" ("quando a Qualidade publicar revisão", desligado). Nota "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação." Sem botão salvar; alternar muda só o estado da tela; sem toast.
- Modal "Papel ativo": texto "O papel define o que a matriz de autoridade permite assinar. A autoridade escala para cima, nunca para baixo, e ninguém assina acima do próprio nível." Lista de 5 papéis (rádio, nível, descrição): "Inspetor de pátio" 1, "Tráfego" 2, "Gestor de qualidade" 3 (padrão), "Diretoria e Resp. Técnico" 4, "Auditor interno" 0 ("somente leitura, mais abrir não conformidade"). Nota "Nível 0 é técnico: é o nível de autoridade de ninguém. Contaminação não se aprova, se regulariza." Clicar num papel fecha o modal, troca o chip do menu e mostra toast "Papel ativo agora é Tráfego, nível 2. A fila e as ações de assinatura passam a refletir esta autoridade."
- Modal "Sair da conta": card com "Rafael Antunes" e "{papel} / nível {n} na matriz" (ex.: "Gestor / nível 3 na matriz"); texto "Nada é perdido ao sair. Registro lacrado continua lacrado, e o que estava em preenchimento não foi gravado em lugar nenhum." Botões "Cancelar" e "Sair". "Sair" fecha o modal e mostra toast "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data." Não navega.

## Estados e simulações
- Loading: ao abrir, 900 ms de skeleton com shimmer na fila (4 cards). Triagem e rail aparecem direto.
- Vazio da fila: card "Nada esperando decisão" com subtítulo variável: "Todas as viagens de hoje foram resolvidas pelo motor." (prop `simularFilaVazia` ou período "Ontem"); "Nada corresponde à busca "{texto}" neste filtro." (busca sem resultado); "Nenhum item neste filtro agora." (filtro ou filial sem itens, como Rio Verde GO).
- Vazio do dropdown de busca: "Nada encontrado na fila de hoje."
- Erro: nenhum estado de erro.
- Props do componente (seção "Fila de decisões"): `evidenciasComoIcones` (padrão verdadeiro; falso mostra as evidências como chips com palavra, ex.: "✕ Limpeza"); `simularFilaVazia` (padrão falso).
- Cenários embutidos: 4 filiais por 4 períodos alteram triagem e fila.
- Sidebar recolhida persistida em localStorage.

## Entidades e operações
- Viagem (VG-2487 a VG-2496): consultar (fila, busca, filtros), abrir detalhe.
- Pendência / exceção: consultar; "Solicitar exceção" (só toast).
- Plano de regularização do bloqueio técnico: consultar; notificar envolvidos (só toast).
- Compartimento (C1, C2), produto, cliente, rota: consultar dentro do item.
- Motorista (Edson Farias, Valdir Nunes, Milton Costa), trilha da Academy: consultar; "Enviar trilha ao motorista" (só toast).
- Subcontratado / transportador (Lima Logística, Transrocha, AgroLima, Cerrado Cargas, Sindona, J. Bortolini TAC), certificado GMP+, acordo de qualidade: consultar vencimentos; navegar.
- Implemento (SQT 7D22, SQT 3A90), laudo de inspeção: consultar vencimento; "Justificar e liberar" (só toast).
- Inspeção / fotos, limpeza (regime D), estação (Higitrans Rondonópolis): consultar no plano; "Notificar inspetor" (só toast).
- Filial e período: filtrar.
- Papel do usuário e preferências de notificação: editar no estado da tela, sem persistência.
- Arquivo de exportação da torre: exportar (toast).
- Não há criar, editar registro, retificar, cancelar ou arquivar nesta tela.

## Regras de negócio visíveis
- Bloqueio técnico não tem quem libere: "Bloqueio técnico: ninguém libera"; "bloqueio técnico não tem aprovação: tem plano"; "Ninguém aperta "liberar"."
- Carga anterior proibida no T-1 não tem regime de limpeza que resolva; o caminho é procedimento formal, limpeza regime D, inspeção qualificada e reavaliação automática.
- Certificado GMP+ suspenso na base pública bloqueia mesmo com acordo de qualidade vigente; resolve em "Diretoria + Resp. Técnico".
- Competência do motorista deriva da trilha vigente; não há campo para marcar apto; reciclagem de 45 min.
- Regra de alerta (documentação do implemento a vencer) permite seguir com justificativa registrada; o vencimento trava sozinho.
- Fotos mínimas: 6 ângulos, a falta de um (bica de descarga) segura a viagem; recaptura reavalia sozinha.
- Matriz de autoridade por papel: níveis 1 a 4 mais "Auditor interno" 0; "ninguém assina acima do próprio nível"; "A autoridade escala para cima, nunca para baixo".
- O alerta de bloqueio técnico não pode ser desligado (requisito da certificação).
- Exportação leva carimbo de data e autor.
- Ordenação declarada: risco GMP+, depois prazo de carregamento, depois tempo em fila.

## Observações factuais
- A data do período "Hoje" é "Terça, 5 ago", mas o toast da exportação diz "carimbo de 6 ago"; Excecoes.dc.html usa "Quarta, 6 ago".
- Em Rondonópolis MT / Hoje, o subtítulo diz "7 esperam decisão" (5 em análise + 2 bloqueadas nos cards) e o badge da sidebar é 7, mas a fila mostra 5 itens: 3 "Em análise" e 2 "Bloqueadas". O card "Aguardando análise" diz 5 e o chip "Em análise" diz 3.
- A filial Rondonópolis MT exibe os 5 itens, incluindo rotas que saem de Sorriso MT, Lucas do Rio Verde MT e Nobres MT; a filial Sorriso MT exibe VG-2496, cuja rota é Nobres MT → Sinop MT.
- "Esta semana" e "Este mês" multiplicam viagens, motor e autoridade, mas mantêm análise, bloqueadas, rodapés e a fila iguais aos de "Hoje". "Ontem" esvazia a fila com o texto "Todas as viagens de hoje foram resolvidas pelo motor."
- Os cards "Onde a pendência está" (soma 17) e "Vai travar em breve" são fixos: não reagem a filial nem a período.
- "Vai travar em breve (12)": a legenda diz "1 / 15d", mas o drawer lista três itens com "12 dias" (Transrocha, SQT 7D22, Milton Costa). O título do drawer diz 12 e a lista tem 8 itens, sem paginação.
- "J. Bortolini / TAC" aparece no rail com "Trilha: regimes de limpeza" e no drawer com "trilha 10 / boas práticas Gatekeeper".
- As linhas do rail têm cursor de clique e hover, sem ação; as linhas do drawer navegam.
- "Abrir viagem" e todos os resultados da busca levam ao mesmo arquivo Viagem Detalhe.dc.html, sem identificar a VG.
- O chip "⌘K" não tem atalho correspondente no arquivo.
- Quatro dos cinco botões secundários da fila ("Solicitar exceção", "Enviar trilha ao motorista", "Notificar inspetor", "Justificar e liberar") só mostram toast; o item continua na fila sem mudança. "Justificar e liberar" não pede texto de justificativa, embora o toast diga "Justificativa registrada".
- "Solicitar exceção" diz que o pedido "vai à mesa de Diretoria + Resp. Técnico"; a mesma VG-2490 já aparece em Excecoes.dc.html como pendente, com "solicitado por Ivan Prado (motorista)".
- Trocar o papel ativo mostra toast dizendo que "A fila e as ações de assinatura passam a refletir esta autoridade", mas a fila não muda.
- O modal "Papel ativo" lista "Auditor interno" com nível 0, e a nota do mesmo modal diz "Nível 0 é técnico: é o nível de autoridade de ninguém."
- O mesmo nível aparece com três grafias: "Diretoria + Resp. Técnico" (fila), "Diretoria e Resp. Técnico" (modal Papel ativo), "Diretoria + RT" (Excecoes.dc.html).
- O Plano de regularização da VG-2487 nesta tela tem passos diferentes do plano da mesma VG em Excecoes.dc.html (aqui: ocorrência, procedimento formal, limpeza regime D, inspeção + reavaliação; lá: destinação do resíduo com laudo, limpeza regime D, inspeção com fotos, reavaliação). Os botões também diferem: "Notificar envolvidos" aqui, "Notificar responsáveis" lá.
- Horários da VG-2487 divergem: ocorrência "hoje 07:52" no plano; pendência "há 3h 05min" com fila "3h 12min"; Excecoes.dc.html diz "hoje, 07:12" e "3h 20min em fila". O prazo de carregamento é "hoje 14:00" e a limpeza regime D está "agendada" para "amanhã, 14:00".
- Os tempos em fila diferem dos de Excecoes.dc.html para as mesmas VGs: VG-2490 1h 05min contra 1h 12min; VG-2492 42 min contra 49 min; VG-2496 9 min contra 16 min.
- VG-2496 marca ✕ em "Certificado", enquanto o motivo é o laudo de inspeção do implemento.
- Os avatares da fila misturam iniciais de motoristas (EF, IP, VN), inspetor (JM) e tráfego (RS), sem legenda.
- O modal "Preferências e notificações" desta tela tem 4 interruptores e nenhum botão salvar; a versão do shell (usada em telas sem menu nativo) tem 3 interruptores e "Salvar preferências".
- O botão "Sair" não encerra nada além de fechar o modal e mostrar toast.
- A exportação gera com zero blocos selecionados.
- Esc fecha os modais do perfil, mas não fecha Plano, Exportar nem o drawer.
