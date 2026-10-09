# Viagem Detalhe
Arquivo: Viagem Detalhe.dc.html (rótulo da tela: "Viagem VG-2490"). Item da sidebar: nenhum item fica marcado como ativo; "Viagens" aparece como link comum. Perfil a quem se destina (pelo que a tela diz): não declarado; o usuário logado é "Rafael Antunes", "Gestor de qualidade, GMP+"; os avanços do ciclo são registrados em nome dele ("registrado por Rafael Antunes"). Objetivo declarado na tela: não há frase de objetivo; a tela apresenta uma viagem (VG-2490, "Farelo de soja, 37 t") com a decisão do motor, o ciclo operacional, as checagens, o T-3, a inspeção e o rastreio.

## Entradas e saídas
- Como se chega: qualquer linha da tabela de Viagens (todas apontam para este arquivo); os cartões T-3, T-2 e T-1 da própria aba "Sequenciamento T-3" apontam para este mesmo arquivo. Demais origens: ver mapa do site.
- Para onde leva:
  - Breadcrumb "Viagens": Viagens.dc.html.
  - Banner bloqueada, botão "Solicitar exceção": Excecoes.dc.html.
  - Banner liberada por autoridade, botão "Ver registro de 9 campos": Excecoes.dc.html.
  - Cartão "Conjunto", link "histórico T-3 →": Compartimento Detalhe.dc.html.
  - Aba "Sequenciamento T-3", link "Abrir compartimento C1 →": Compartimento Detalhe.dc.html.
  - Aba "Sequenciamento T-3", links "VG-2381 →", "VG-2412 →", "VG-2455 →": Viagem Detalhe.dc.html (a própria tela).
  - Sidebar: os mesmos 16 destinos de Viagens, mais "Viagens" (Viagens.dc.html).

## Estrutura da tela
1. Sidebar canônica, igual à de Viagens (mesmos itens, badges e card "Base IDTF Brasil / v2026.07 vigente / Revisada em 28 jul"), porém sem item ativo.
2. Cabeçalho. Breadcrumb "Viagens › VG-2490". Título "Farelo de soja, 37 t" e chip de estado conforme a prop: "Bloqueada", "Liberada por autoridade" ou "Liberada pelo motor". Linha "Sorriso MT → Uberlândia MG / NutriMax Rações / carrega amanhã, 06:30" (fixa). Botões "Contatar motorista", "Baixar guia", "Ações ▾" e avatar "RA".
3. Banner de decisão (um dos três, conforme a prop):
   - Bloqueada: "Bloqueada pelo motor: subcontratado não apto"; "Causa: o certificado GMP+ da Lima Logística consta suspenso na base pública da certificadora, mesmo com o acordo de qualidade vigente. Ação: reatribuir a outro transportador apto ou aguardar regularização na base."; botões "Solicitar exceção" e "Reatribuir transportador".
   - Liberada por autoridade: "Liberada por autoridade: o motor continua reprovando"; texto com "Diretoria + Resp. Técnico em 4 ago, 18:22", "impacto declarado: risco residual aceito com monitoramento", "validade: somente esta viagem"; botão "Ver registro de 9 campos".
   - Liberada pelo motor: "Liberada pelo motor: sem intervenção humana"; "As 12 condições avaliadas passaram. Esta decisão nunca chegou à mesa de ninguém." Sem botão.
4. Faixa de registro obrigatório (duas variantes, conforme o anexo):
   - Pendente: "1 registro obrigatório pendente: comprovante da estação de lavagem (regime B) ainda não anexado; a viagem opera, mas não fecha enquanto faltar." com link "Anexar comprovante →".
   - Completo: "Registros obrigatórios completos: comprovante da estação anexado hoje, 10:41. A viagem pode fechar quando o bloqueio for resolvido." com "✓ nada pendente".
5. Ciclo operacional (stepper com 5 fases): "Agendada" ("4 ago 16:10"), "Carregamento" ("amanhã 06:30"), "Em trânsito" ("previsto 7 ago"), "Descarga" ("previsto 7 ago"), "Concluída". Botão à direita com rótulo por fase ("Iniciar carregamento", "Confirmar carregamento", "Confirmar descarga", "Concluir viagem", "Ciclo concluído") e nota abaixo. Reage ao avanço, ao cancelamento e à prop.
6. Abas: "Resumo" (padrão), "Sequenciamento T-3", "Inspeção & fotos", "Rastreio".

Aba Resumo (coluna principal e trilho à direita):
7. "Operação": ORIGEM "Sorriso MT", "Fazenda Boa Safra / 6 ago, 06:30"; separador "986 km / 2 dias"; DESTINO "Uberlândia MG", "NutriMax Rações / 8 ago, 14:00". Quatro blocos: "Produto" ("Farelo de soja", "rótulo IDTF: liberado após limpeza B"), "Peso" ("37.000 kg", "granel / HS 2304.00"), "Cliente" ("NutriMax Rações", "pedido PC-88412"), "Regime exigido" ("B", "Limpeza com água", "derivado do T-3 / base v2026.07"). Fixo.
8. "Checagens do motor" ("uma linha por condição avaliada / base v2026.07"): chip de placar ("10 de 12 / 2 falhas" quando bloqueada ou liberada por autoridade; "12 de 12 / conforme" quando liberada pelo motor) e link "Reavaliar". Grade de 12 linhas com ícone, nome, resultado e chip do código da regra: R-01 "Histórico T-3 completo", R-02 "Carga anterior permitida", R-03 "Limpeza compatível com o regime", R-04 "Checklist aprovado", R-05 "Certificado vigente e no escopo" (falha: "suspenso na base pública"), R-06 "Subcontratado apto" (falha: "derivado do certificado"), R-07 "Acordo de qualidade vigente", R-08 "Competência do motorista", R-09 "Produto reconhecido na base", R-10 "Fotos mínimas presentes", R-11 "Documentação ≥ 30 dias de validade", R-12 "Inspeção sincronizada". R-05 e R-06 passam só com a prop "liberada_pelo_motor".
9. "Linha do tempo": 6 eventos. "Viagem criada pelo despachante" (4 ago, 09:12, "Pedido PC-88412 / NutriMax Rações."), "Conjunto vinculado" (4 ago, 09:20), "T-3 verificado / regime B calculado" (4 ago, 09:20), "Limpeza B registrada" (5 ago, 17:40, "6 de 7 campos / comprovante pendente."), "Inspeção aprovada e sincronizada" (5 ago, 19:05) e o último conforme a prop: "Motor bloqueou a viagem" (5 ago, 19:14), "Liberada por autoridade" (4 ago, 18:22) ou "Motor liberou a viagem" (5 ago, 19:14).
10. Cartão "Motorista": avatar "IP", "Ivan Prado", "CNH ****4187 / vínculo: subcontratado", chips "✓ 10 trilhas vigentes" e "✓ elegível", "Competência derivada das trilhas, recalculada em 4 ago." Fixo, sem link.
11. Cartão "Conjunto": "CAVALO QAS 7C31" ("só tração / sem histórico"), "IMPLEMENTO SQT 9E18" ("graneleiro / 2 compart."), "COMPART. C1" com link "histórico T-3 →"; nota "O histórico pertence ao compartimento: trocar o cavalo não altera nada."
12. Cartão "Documentos gerados": 3 itens: "Ordem de carregamento" ("gerada em 4 ago, 09:22", "PDF / 84 KB"), "Registro de limpeza B" ("Higitrans / 5 ago, 17:40", "PDF / 1,2 MB"), "Relatório de inspeção" ("lacrado em 5 ago, 19:12", "PDF / 3,8 MB").

Aba Sequenciamento T-3:
13. "Sequenciamento do compartimento C1" ("as três últimas cargas definem o que pode subir agora") com link "Abrir compartimento C1 →". 3 cartões: "T-3" "Farelo de soja" ("18 jul / descarga Chapecó SC", "VG-2381 →", regime A), "T-2" "Casca de soja" ("24 jul / descarga Rio Verde GO", "VG-2412 →", A), "T-1" "Milho a granel" ("31 jul / descarga Uberlândia MG", "VG-2455 →", B); cartão "AGORA" "Farelo de soja", "veredito da base IDTF v2026.07", "B Liberado após limpeza B". Caixa "Por quê: milho (T-1) × farelo de soja é combinação compatível, mas exige remoção úmida de resíduos: regime B, limpeza com água. Próximo passo: registrar a limpeza B com os campos do regime." Fixo.
14. "Limpeza registrada": "B", "Água sob pressão", "Estação Higitrans / Sorriso MT / 5 ago, 17:40"; linhas "Executor: Higitrans / CNPJ ****0031", "Fotos da limpeza: ✓ 4 anexadas", "Comprovante da estação: pendente"; nota "Regime B exige 7 campos / 6 completos. O comprovante é registro obrigatório: não bloqueia a carga, impede o fechamento." Fixo.

Aba Inspeção & fotos:
15. "Inspeção pré-carregamento" com chip "Aprovada": "Jorge Mattos", "Inspetor de pátio / 5 ago, 19:05"; "Geolocalização: -12.5453, -55.7211", "Assinatura: ✓ capturada no app", "Sincronização: ✓ 5 ago, 19:12"; nota "Depois de enviada, a inspeção não se edita. Correção é evento novo de retificação." Fixo.
16. "Itens verificados": 6 itens, todos "✓", com criticidade: "Ausência de resíduos visíveis" (crítico), "Ausência de odores estranhos" (crítico), "Ausência de pragas" (crítico), "Lona íntegra e limpa" (não crítico), "Bica de descarga limpa" (crítico), "Vedações e borrachas" (não crítico).
17. "Fotos por ângulo obrigatório" ("arraste as fotos reais para os quadros", chip "6 de 6 capturadas"): 6 quadros de imagem (componente image-slot) com nome e hash: "Visão geral interna" ("a3f8…c2"), "Cantos e frestas", "Teto / lona / tampa", "Piso / fundo", "Bica de descarga", "Identificação externa"; legenda "câmera do app / GPS ✓ / marca d'água ✓".

Aba Rastreio:
18. Mapa Leaflet (tiles CARTO) com rota planejada tracejada Sorriso a Uberlândia, trecho percorrido sólido, marcadores "Origem" e "Destino" com popup e marcador do caminhão "IP" (popup "QAS 7C31 / Ivan Prado", "check-in hoje, 09:12 / BR-163, Nova Mutum MT", "a caminho da origem"). Sobreposição: "Conjunto QAS 7C31 / a caminho da origem", "último check-in há 24 min / rota planejada tracejada".
19. "Último check-in": "Ivan Prado", "pelo app do motorista / hoje, 09:12", "Posição: -13.8302, -56.0821", "Local: BR-163 / Nova Mutum MT", "Sincronização: ✓ sincronizado".
20. "Marcos da viagem": barra de progresso preenchida em 34%, legenda "deslocamento até a origem / 212 de 318 km"; 4 marcos: "Saiu de Lucas do Rio Verde MT" ("hoje, 05:50 / check-in do app"), "Check-in BR-163 / Nova Mutum MT" ("hoje, 09:12 / posição atual"), "Chegada à origem / Sorriso MT" ("previsto hoje, 12:40"), "Carregamento" ("amanhã, 06:30 / aguarda decisão da exceção").
21. Nota: "A posição vem do check-in do app, não de telemetria contínua; entre check-ins, o sistema declara a lacuna em vez de estimar."

Toast fixo no rodapé (some após 3,8 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Breadcrumb "Viagens" | Cabeçalho | navegação | Viagens.dc.html. |
| "Contatar motorista" | Cabeçalho | modal | Modal de contato (detalhe abaixo). |
| "Baixar guia" | Cabeçalho | modal | Modal "Baixar guia da viagem". |
| "Ações ▾" | Cabeçalho | popover | Menu com "Editar dados da viagem", "Trocar veículo / compartimento", "Trocar motorista", "Gerar dossiê desta viagem", "Exportar registro", "Abrir não conformidade", "Retificar um fato", "Cancelar viagem" (vermelho) e a nota "Trocar veículo ou motorista recalcula a decisão: o motor reavalia tudo do zero." |
| "Editar dados da viagem" | Menu Ações | modal | Modal de edição. |
| "Trocar veículo / compartimento" | Menu Ações | modal | Abre o modal único de troca. |
| "Trocar motorista" | Menu Ações | modal | Abre o mesmo modal de troca. |
| "Gerar dossiê desta viagem" | Menu Ações | toast | "Dossiê da VG-2490 entrou na fila de geração. Você recebe o pacote em minutos." Não navega. |
| "Exportar registro" | Menu Ações | toast | "Registro da VG-2490 exportado com carimbo de 6 ago, 10:32." |
| "Abrir não conformidade" | Menu Ações | modal | Modal de NC. |
| "Retificar um fato" | Menu Ações | modal | Modal de retificação. |
| "Cancelar viagem" | Menu Ações | modal | Modal de cancelamento. |
| Avatar "RA" | Cabeçalho | popover | Mesmo menu de perfil de Viagens ("Meu perfil", "Preferências e notificações", "Papel ativo", "Sair"), com os mesmos 4 modais e toasts. |
| "Solicitar exceção" | Banner bloqueada | navegação | Excecoes.dc.html. |
| "Reatribuir transportador" | Banner bloqueada | modal | Abre o modal de troca. |
| "Ver registro de 9 campos" | Banner liberada por autoridade | navegação | Excecoes.dc.html. |
| "Anexar comprovante →" | Faixa de registro pendente | modal | Modal de anexo. |
| Botão do ciclo | Ciclo operacional | muda estado e toast | Avança uma fase por clique. Toasts: "Carregamento iniciado às 06:31, registrado por Rafael Antunes."; "Carregamento confirmado: 37,2 t na balança. Em trânsito."; "Descarga confirmada no destino com GPS e assinatura."; "Viagem concluída. O dossiê fechou com todos os registros." Com prop bloqueada e fase 0, fica desabilitado e o clique mostra "O ciclo não anda com a viagem bloqueada. Resolva o bloqueio ou registre exceção." |
| Abas | Abaixo do ciclo | muda estado | Alterna o conteúdo; a aba "Rastreio" inicializa o mapa. |
| "Reavaliar" | Checagens do motor | muda estado | Mostra a nota "✓ Reavaliada agora (20:41): nada mudou: o certificado segue suspenso na base pública. O estado deriva do fato." Tooltip: "O motor reavalia as 12 condições contra os fatos atuais: não muda estado, recalcula do fato". |
| Chip do código da regra (R-01 a R-12) | Checagens do motor | modal | Modal "A regra por trás do resultado". |
| Itens de "Documentos gerados" | Resumo | nada | Cursor de clique e hover, sem ação. |
| "histórico T-3 →" | Cartão Conjunto | navegação | Compartimento Detalhe.dc.html. |
| "Abrir compartimento C1 →" | Aba T-3 | navegação | Compartimento Detalhe.dc.html. |
| "VG-2381 →", "VG-2412 →", "VG-2455 →" | Aba T-3 | navegação | Recarregam Viagem Detalhe.dc.html (VG-2490). |
| Mapa | Aba Rastreio | interação do mapa | Zoom, arraste e popups dos marcadores. |

Modal "A regra por trás do resultado": chip com o código da regra; caixa com nome e texto da regra; linhas "avaliada com: base v2026.07", "resultado nesta viagem", "fato de entrada", "quem mantém a regra: Qualidade / matriz"; rodapé "A decisão gravou a versão exata da regra usada. Se a base mudar amanhã, este registro continua provando o que valia hoje." Conteúdo existe para 3 regras: R-02 "Compatibilidade do T-3" (fato "T-3: milho / casca / farelo", "passou"), R-06 "Aptidão do subcontratado" (fato "certificado suspenso em 4 ago", "reprovou"), R-08 "Competência do motorista" (fato "10 trilhas vigentes / Ivan Prado", "passou"). Os demais códigos abrem o conteúdo da R-06. Só leitura.

Modal "Abrir não conformidade" (chip "VG-2490"):
- TIPO: chips "Resíduo encontrado", "Documento divergente", "Lacre violado", "Desvio de rota". Obrigatório.
- O QUE FOI OBSERVADO: campo "descreva o desvio, mínimo 20 caracteres". Obrigatório, mínimo de 20 caracteres.
- Texto: "A NC nasce vinculada à viagem, ao compartimento e ao terceiro. Reincidência conta para o bloqueio automático do subcontratado."
- Botões "Cancelar" e "Abrir NC" (habilitado com tipo e 20 caracteres).
- Ao confirmar: fecha e mostra "NC-0311 aberta: {tipo}. Vinculada à VG-2490, ao C1 e à Lima Logística; a Qualidade recebe o plano." Nada muda na tela.

Modal "Retificar um fato" (subtítulo "nada se apaga: a retificação vira um evento novo apontando para o original, com autor e hora"):
- QUAL FATO: rádio com 3 opções: "Peso na balança (37,2 t)" ("registrado hoje, 06:52"), "Carimbo da limpeza B (5 ago, 17:40)" ("registrado pela Higitrans"), "Foto 3 da inspeção (ângulo da bica)" ("capturada ontem, 19:05"). Obrigatório.
- JUSTIFICATIVA: campo "por que o registro original está errado, mínimo 20 caracteres". Obrigatório, mínimo 20.
- Botões "Cancelar" e "Registrar retificação".
- Ao confirmar: toast "Retificação registrada como evento novo, apontando para o original. O motor reavaliou: nada mudou na decisão." Linha do tempo não muda. Não há campo para o valor corrigido.

Modal "Cancelar a VG-2490" (subtítulo "a viagem sai da operação, mas o registro fica: cancelamento é evento, não exclusão"):
- MOTIVO: chips "Cliente desistiu", "Sem veículo apto na janela", "Condição da estrada", "Erro de cadastro". Obrigatório. Sem campo de texto.
- Botões "Voltar" e "Cancelar viagem" (vermelho, habilitado com motivo).
- Ao confirmar: estado "cancelada"; o ciclo passa a mostrar "Viagem cancelada", nota "registro preservado no dossiê" e "cancelada" sob a fase "Carregamento". Toast "VG-2490 cancelada: {motivo}. O registro completo permanece no dossiê."

Modal de contato: "Ivan Prado", "motorista / Lima Logística / em deslocamento"; linhas "Celular: (65) 99812-4407", "Último check-in: hoje, 09:12 / BR-163", "App do motorista: ✓ online, sincronizado". Botões "Abrir WhatsApp" (toast "Abrindo conversa com Ivan Prado no WhatsApp…") e "Avisar pelo app" (toast "Aviso enviado ao app do motorista. Entrega registrada na trilha."). Ambos fecham o modal; não há campo de mensagem.

Modal "Baixar guia da viagem" ("documentos lacrados da VG-2490 / a versão baixada carimba data e hora"): 3 itens clicáveis: "Guia completa da viagem" ("operação + decisão + evidências / PDF, 4,1 MB"; toast "Guia completa da VG-2490 baixada com carimbo de data e hora."), "Ordem de carregamento" ("para o armazém / PDF, 84 KB"; toast "Ordem de carregamento baixada."), "Relatório de inspeção lacrado" ("com fotos e hash / PDF, 3,8 MB"; toast "Relatório de inspeção baixado. O lacre confere."). Nenhum arquivo é baixado.

Modal "Anexar comprovante da estação" ("limpeza B / Estação Higitrans / 5 ago, 17:40 / campo 7 de 7 do regime"): área "Arraste o PDF ou toque para escolher" ("o arquivo recebe hash, data e hora; depois de sincronizado, não se edita"), sem ação ao clicar. Botões "Cancelar" e "Anexar comprovante-higitrans.pdf" (sempre habilitado). Ao confirmar: faixa vira "Registros obrigatórios completos" e toast "Comprovante anexado com hash e carimbo de 6 ago, 10:41. Regime B completo: 7 de 7 campos."

Modal "Trocar veículo, compartimento ou motorista": rádio com 3 opções: "Compartimento C2 do mesmo implemento" ("T-3: sorgo, milheto, soja / regime A pelo produto atual"), "Conjunto QBD 3E90 + SQT 6B77 (frota própria)" ("disponível na filial a partir das 14:00 / T-3 compatível"), "Motorista substituto: Paulo Lima" desabilitado ("não selecionável: trilha "Proteção da carga" vencida há 2 dias"). Aviso "A troca recalcula a decisão do zero: T-3 do novo compartimento, competência do novo motorista, tudo. Nada do histórico é apagado." Botões "Cancelar" e "Confirmar troca" (habilitado com uma opção). Ao confirmar: toast "Troca registrada. O motor está reavaliando as 12 condições com os novos fatos." Conjunto, motorista, checagens e banner não mudam.

Modal "Editar dados da viagem" (chip "VG-2487"; "Antes de carregar, o que é logística se edita. O que já virou evidência, não."):
- EDITÁVEL ENQUANTO NÃO CARREGA: "Janela de carregamento" (valor "6 ago, 14:00 às 16:00", placeholder "dia e faixa de horário"), "Peso previsto (kg)" ("32.000", "só números"), "Doca" ("Doca 3", "onde encosta"), "Observação para o motorista" (vazio, "aparece no app dele, opcional"). Nenhum campo obrigatório e nenhuma validação de formato; campo alterado ganha borda verde.
- TRAVADO, E POR QUÊ: "Compartimento e implemento", "Produto e classificação IDTF", "Motorista", "Cliente e destino", cada um com a justificativa (ex.: "constam do contrato de transporte e do documento fiscal já emitido.").
- Rodapé: dica "Nada alterado ainda." ou "A alteração fica no histórico da viagem, com autor e hora."; botões "Cancelar" e "Salvar" (habilitado só se algum valor mudou).
- Ao salvar: fecha e mostra "Dados de logística atualizados por Rafael Antunes. A decisão do motor não muda: nenhum fato que ele avalia foi tocado." Os valores editados não aparecem em outro lugar da tela.

## Estados e simulações
- Prop "estadoDaViagem" (seção "Decisão", enum): "bloqueada" (padrão), "liberada_por_autoridade", "liberada_pelo_motor". Controla chip do cabeçalho, banner, placar e resultados R-05/R-06, último evento da linha do tempo e trava do ciclo.
- Estados internos: aba ativa, fase do ciclo (0 a 4), cancelada, anexado, reavaliado, troca selecionada, campos dos modais, papel e preferências.
- Sem loading, sem skeleton, sem estado vazio, sem estado de erro.

## Entidades e operações
- Viagem: consultar; editar (logística: janela, peso previsto, doca, observação); avançar ciclo (iniciar carregamento, confirmar carregamento, confirmar descarga, concluir); cancelar (com motivo); exportar registro (toast); gerar dossiê (toast); baixar guias (toast).
- Decisão do motor / regras: consultar checagens e regra; reavaliar.
- Exceção / liberação: consultar banner; navegar para Exceções ("Solicitar exceção", "Ver registro de 9 campos").
- Não conformidade: criar (toast "NC-0311 aberta").
- Fato registrado (peso, carimbo de limpeza, foto): retificar (toast).
- Conjunto, compartimento, motorista: trocar (toast); consultar; navegar ao compartimento.
- Limpeza B: consultar; anexar comprovante.
- Inspeção e fotos: consultar.
- Rastreio / check-in: consultar.
- Motorista: contatar (WhatsApp ou aviso no app, toast).
- Usuário/papel: mesmas operações de Viagens.

## Regras de negócio visíveis
- 12 condições avaliadas pelo motor, cada uma com código de regra R-01 a R-12; a decisão grava a versão da regra ("base v2026.07").
- Liberação por autoridade não apaga a reprovação: "As duas decisões convivem e ficam registradas: o fato (certificado suspenso) não mudou."; validade "somente esta viagem".
- "O ciclo só anda depois da liberação": com bloqueio, o ciclo não sai de "Agendada".
- Registro obrigatório pendente não bloqueia a carga, impede o fechamento: "a viagem opera, mas não fecha enquanto faltar"; nota da fase 3: "exige registros obrigatórios completos".
- "Regime B exige 7 campos."
- Regime derivado do T-3: "milho (T-1) × farelo de soja é combinação compatível, mas exige remoção úmida de resíduos: regime B".
- "O histórico pertence ao compartimento: trocar o cavalo não altera nada."
- Troca de veículo, compartimento ou motorista manda o motor reavaliar do zero; motorista com trilha vencida não é selecionável.
- Edição: só dados de logística, antes do carregamento; compartimento, produto, motorista, cliente e destino ficam travados com justificativa.
- "Depois de enviada, a inspeção não se edita. Correção é evento novo de retificação." Retificação mínima de 20 caracteres de justificativa.
- Cancelamento "é evento, não exclusão"; exige motivo.
- NC "nasce vinculada à viagem, ao compartimento e ao terceiro. Reincidência conta para o bloqueio automático do subcontratado."; exige tipo e 20 caracteres.
- "Competência derivada das trilhas"; R-08: "não existe campo manual de apto".
- R-06: certificado GMP+ consultado na base pública da certificadora "2× ao dia".
- Rastreio por check-in do app, não telemetria; "o sistema declara a lacuna em vez de estimar".

## Observações factuais
- "Trocar veículo / compartimento", "Trocar motorista" e "Reatribuir transportador" abrem o mesmo modal. A única opção de motorista está desabilitada, então "Trocar motorista" não tem escolha possível.
- O modal "Editar dados da viagem" mostra o chip "VG-2487" numa tela da VG-2490; o peso previsto vem como "32.000" enquanto a tela mostra "37.000 kg" e "37 t"; a janela vem como "6 ago, 14:00 às 16:00" enquanto o cabeçalho diz "carrega amanhã, 06:30" e a origem "6 ago, 06:30".
- "Confirmar troca", "Abrir NC", "Registrar retificação", "Salvar" (edição), "Gerar dossiê desta viagem", "Exportar registro", "Abrir WhatsApp", "Avisar pelo app" e os 3 itens de "Baixar guia" só fecham e mostram toast; nada muda na tela (linha do tempo, conjunto, checagens e documentos ficam iguais).
- "Gerar dossiê desta viagem" diz que o dossiê entrou "na fila de geração", e não leva ao Dossie; a tela Dossie gera reconstrução por amostra de viagens, sem a VG-2490.
- Ao cancelar, o chip do cabeçalho e o banner de decisão continuam iguais; o menu "Ações" segue com todas as opções, inclusive "Cancelar viagem".
- Com prop liberada, o botão "Concluir viagem" fica habilitado mesmo com o comprovante pendente, e o toast diz "O dossiê fechou com todos os registros."; a nota da fase 3 diz "exige registros obrigatórios completos".
- Avançar o ciclo não altera o chip do cabeçalho, o rastreio ("a caminho da origem") nem os marcos ("aguarda decisão da exceção").
- Depois de anexar o comprovante, a aba T-3 continua mostrando "Comprovante da estação: pendente" e "6 completos", e a linha do tempo continua "6 de 7 campos / comprovante pendente".
- O modal de anexo confirma sem escolher arquivo; o nome "comprovante-higitrans.pdf" está fixo no botão; a área de arrastar não tem ação.
- A nota de "Reavaliar" diz sempre "o certificado segue suspenso na base pública", inclusive com a prop "liberada_pelo_motor", em que R-05 e R-06 aparecem como "passou". O modal da R-06 também mostra sempre "reprovou".
- Nove dos 12 códigos de regra (R-01, R-03, R-04, R-05, R-07, R-09, R-10, R-11, R-12) abrem o texto da R-06 "Aptidão do subcontratado".
- Com a prop "liberada_por_autoridade", o último evento da linha do tempo ("4 ago, 18:22") aparece depois de eventos de 5 ago.
- "Agendada" no ciclo traz "4 ago 16:10"; a linha do tempo registra a criação em "4 ago, 09:12".
- Datas de descarga divergem: "8 ago, 14:00" no cartão Operação e no popup do mapa, "previsto 7 ago" no ciclo e "concluída em 7 ago, 15:20" na nota final do ciclo.
- "Hoje" é usado como 5 ago ("carrega amanhã, 06:30" com origem "6 ago, 06:30") e como 6 ago ("anexado hoje, 10:41" com toast "6 ago, 10:41"; "Foto 3 ... capturada ontem, 19:05" para inspeção de 5 ago). O retificar oferece "Peso na balança (37,2 t) registrado hoje, 06:52" numa viagem que ainda não carregou.
- A barra de "Marcos da viagem" está em 34% e a legenda diz "212 de 318 km" (cerca de 67%).
- O mapa desenha como trecho percorrido a linha de Sorriso (origem) até Nova Mutum, enquanto os textos dizem que o conjunto vem de Lucas do Rio Verde "a caminho da origem".
- O código cria o mapa uma única vez (variável "_map"); ao voltar para a aba "Rastreio" o mapa não é recriado.
- Clique fora e Esc não fecham o menu "Ações ▾" (o código fecha a chave "menuOpen", mas o menu usa a chave "menu"). Esc também não fecha os modais da viagem, só os de perfil.
- Os itens de "Documentos gerados" têm cursor de clique sem ação; a lista difere da do modal "Baixar guia" ("Registro de limpeza B" só no cartão; "Guia completa da viagem" só no modal).
- Os links das viagens do T-3 (VG-2381, VG-2412, VG-2455) reabrem a própria VG-2490.
- A sidebar não marca nenhum item como ativo nesta tela.
- O cabeçalho oferece "Abrir WhatsApp"; o subtítulo do Dossie promete reconstrução "sem WhatsApp".
- Os modais de perfil, preferências, papel e sair são idênticos aos de Viagens e Dossie.
- "Paulo Lima" aparece como não selecionável no modal de troca, e em Viagens é o motorista da VG-2486 "Em carregamento", liberada pelo motor.
