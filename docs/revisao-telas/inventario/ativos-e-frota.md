# Ativos e frota
Arquivo: `Ativos e Frota.dc.html`. Item da sidebar: "Ativos e frota" (seção PILARES, item ativo destacado em degradê, sem badge). Perfil a quem se destina (pelo que a tela diz): não declarado na tela; o usuário logado no mock é Rafael Antunes, "Gestor de qualidade / GMP+". Objetivo declarado na tela: subtítulo "cavalo, implemento e compartimento são coisas distintas; o histórico é do compartimento".

## Entradas e saídas
- Como se chega: pela sidebar (item "Ativos e frota" presente em `Compartimento Detalhe.dc.html` e `Inspecoes.dc.html`); pelo breadcrumb de `Compartimento Detalhe.dc.html` (links "Ativos e frota" e "SQT 9E18" apontam para esta tela). Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" → `Torre de Controle v2.dc.html`; "Viagens" → `Viagens.dc.html`; "Exceções e liberações" → `Excecoes.dc.html`; "Inspeções" → `Inspecoes.dc.html`; "Limpezas" → `Limpezas.dc.html`; "Motor IDTF" → `Motor IDTF.dc.html`; "Subcontratados" → `Subcontratados.dc.html`; "Motoristas" → `Motoristas.dc.html`; "Acessos externos" → `Acessos Externos.dc.html`; "Academy" → `Academy.dc.html`; "Dossiê de auditoria" → `Dossie.dc.html`; "Indicadores" → `Indicadores.dc.html`; "Não conformidades" → `Nao Conformidades.dc.html`; "Configurações" → `Configuracoes.dc.html`; "Onboarding público" → `Onboarding Publico.dc.html`; "Protótipo mobile" → `App de Campo.dc.html`. "Ativos e frota" é um div sem link (tela atual).
  - Linha expandida de conjunto, bloco "COMPARTIMENTOS E T-3": cada compartimento ("C1 ... abrir →") → `Compartimento Detalhe.dc.html`.
  - Botão primário da linha expandida com rótulo "Abrir histórico" (conjuntos QBB 4D18 e QCF 9E44) → `Compartimento Detalhe.dc.html` (via `window.location.href`).
  - Botão primário "Ver passaporte do dono" (conjunto RTQ 2F09) → `Subcontratados.dc.html`.
  - Modal "Plano de regularização / C2", botão "Abrir na Torre (VG-2487)" → `Torre de Controle v2.dc.html`.

## Estrutura da tela
1. Sidebar (canônica). Badges: Torre de Controle "7", Exceções e liberações "5", Inspeções "3", Limpezas "3", Motoristas "42", Acessos externos "2", Indicadores "11/15", Não conformidades "4", Onboarding público "6 passos", Protótipo mobile "12 telas". Botão "Recolher menu". Card de rodapé "Rede de ativos": "96 conjuntos mapeados", "148 compartimentos com T-3 vivo". Fixo.
2. Cabeçalho: título "Ativos e frota", subtítulo citado acima. À direita: campo de busca (placeholder "Placa, chassi ou terceiro…"), botão "Importar planilha", botão "+ Novo ativo", avatar "RA" com menu de perfil.
3. Faixa de 4 KPIs:
   - "Cavalos mecânicos": 72; rodapé "18 próprios / 54 de terceiros". Fixo.
   - "Implementos": 96; rodapé "148 compartimentos no total". Fixo.
   - "Duplicidades suspeitas": valor calculado (2 menos as resolvidas; cor âmbar se maior que 0, verde se 0); rodapé "mesma placa em dois cadastros". Reage à unificação.
   - "Aptidão da frota agora": "89%" e "86 de 96 conjuntos liberáveis"; barra segmentada 89% Aptos, 6% Pendência, restante hachurado; legenda "Aptos", "Pendência", "Travados". Fixo.
4. Card "Conjuntos" (coluna principal). Subtítulo "vínculo cavalo × implemento é muitos-para-muitos, com data". Chips de filtro: "Todos / 6", "Pendência / 3", "Travados / 1" (contagens calculadas sobre a lista, incluindo ativos criados na sessão). Lista de 6 conjuntos no mock (mais os criados), sem paginação. Cada linha:
   - Ícone + placas (ex.: "QAS 7C31 + SQT 9E18") + tipo (ex.: "graneleiro / 2 compartimentos").
   - Avatar + dono (ex.: "Lima Logística") + "vínculo desde mar 24".
   - Chips de compartimento com ponto de cor e tooltip (ex.: "C1" tooltip "T-3: milho / casca de soja / farelo de soja"; "C2" tooltip "T-1 com ureia pecuária: travado"). Estados de chip: ok, pend, trava.
   - Pill de status: "Apto", "Pendência" ou "Travado".
   - Chevron "▾" que expande/recolhe.
   - Área expandida (inicia aberta no conjunto QAS 7C31): coluna "COMPARTIMENTOS E T-3" com um link por compartimento (código, T-3 em texto, "abrir →"); coluna "SITUAÇÃO DO CONJUNTO" com checks (ícone ✓, ✕ ou !, texto e data; ex.: "Dono com certificado suspenso" "4 ago") e dois botões: primário com rótulo variável e "Trocar vínculo".
   - Dados do mock (placas / tipo / dono / status / ação primária):
     - QAS 7C31 + SQT 9E18 / graneleiro, 2 compartimentos / Lima Logística / Pendência / "Ver plano do C2".
     - QBB 4D18 + SQT 3A90 / graneleiro, 2 compartimentos / Cerrado Cargas / Apto / "Abrir histórico".
     - RTQ 2F09 + SQT 4B77 / graneleiro, 2 compartimentos / Lima Logística / Travado / "Ver passaporte do dono".
     - QKX 8A12 + SQT 1C55 / caçamba, 1 compartimento / Lima Logística / Pendência / "Ver agenda de inspeção".
     - QCF 9E44 + SQT 8B21 / tanque, 1 compartimento / Cerrado Cargas / Apto / "Abrir histórico".
     - QGH 5J33 + SQT 7D22 / graneleiro, 2 compartimentos / "J. Bortolini / TAC" / Pendência / "Disparar renovação".
   - Reage a busca, filtro, troca de vínculo, renovação e criação de ativo.
5. Rail direito, card "Duplicidades suspeitas": subtítulo "detectadas por placa e chassi na importação; ninguém cria cadastro em dobro sem ver isto". 2 itens no mock: "QAS 7C31" (chip "2 cadastros"; texto "cadastrada pela Lima Logística (mar 24) e de novo na importação de segunda, com chassi divergente em 1 dígito.") e "SQT 4B77" ("implemento aparece vinculado à Lima e à AgroLima ao mesmo tempo, sem data de troca."). Botões "Unificar cadastros" e "Comparar". Itens somem quando unificados.
6. Rail direito, card "Documentação a vencer": 3 itens fixos (placa, descrição, prazo colorido): "SQT 7D22 / laudo de inspeção do implemento / 12 dias"; "SQT 1C55 / inspeção estrutural agendada / 8 ago"; "SQT 3A90 / laudo de inspeção do implemento / 44 dias". Rodapé: "Venceu sem renovar: o conjunto sai da lista de elegíveis sozinho. Renovou: volta sozinho." Sem ações.
7. Rail direito, nota tracejada: "O compartimento carrega o próprio T-3 mesmo quando o implemento troca de cavalo ou de dono. Trocar vínculo nunca apaga histórico: cria evento novo com data." Fixa.
8. Toast inferior centralizado (some após 4,2 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Campo de busca | Cabeçalho | muda estado | Filtra a lista "Conjuntos" por placas, dono e tipo (texto livre, sem diferenciar maiúsculas). Chassi não faz parte dos dados pesquisados. |
| "Importar planilha" | Cabeçalho | modal | Abre "Importar frota por planilha" na fase 1. |
| "+ Novo ativo" | Cabeçalho | modal | Abre "Novo ativo" (handler chamado `toastNovo`). |
| Avatar "RA" | Cabeçalho | popover | Menu com "Meu perfil", "Preferências e notificações", "Papel ativo" (badge com o papel atual, ex. "Gestor"), "Sair". Fecha ao clicar fora ou com Esc. |
| Chips "Todos", "Pendência", "Travados" | Card Conjuntos | muda estado | Filtra por status. Não há chip para "Apto". |
| Linha do conjunto | Card Conjuntos | muda estado | Expande/recolhe a área de detalhe (uma por vez). |
| Link de compartimento ("abrir →") | Linha expandida | navegação | `Compartimento Detalhe.dc.html` (mesmo destino para qualquer compartimento). |
| "Ver plano do C2" | Linha QAS 7C31 | modal | Abre "Plano de regularização / C2". |
| "Abrir histórico" | Linhas QBB 4D18 e QCF 9E44 | navegação | `Compartimento Detalhe.dc.html`. |
| "Ver passaporte do dono" | Linha RTQ 2F09 | navegação | `Subcontratados.dc.html`. |
| "Ver agenda de inspeção" | Linha QKX 8A12 e linhas criadas na sessão | modal | Abre "Inspeção estrutural agendada". |
| "Disparar renovação" / "Acompanhar renovação" | Linha QGH 5J33 | modal | Abre modal de renovação (rótulo muda após o disparo). |
| "Trocar vínculo" | Toda linha expandida | modal | Abre "Trocar vínculo" com as placas da linha. |
| "Unificar cadastros" | Card Duplicidades | modal | Abre "Unificar cadastros" para a placa. |
| "Comparar" | Card Duplicidades | modal | Abre o mesmo modal "Unificar cadastros". |
| "Recolher menu" | Sidebar | muda estado | Alterna sidebar 264 px / 84 px; persiste em `localStorage` (`tx-nav`). |

Modais:

**Plano de regularização / C2** (chip "SQT 9E18"). Texto: "ureia pecuária no T-1 trava o compartimento. Ninguém aperta "liberar": o motor reavalia quando os fatos existirem." Linha do tempo com 4 passos fixos: 1 "Ocorrência registrada" (tag "feito"; "Edson Farias, pelo app / ureia pecuária no T-1 do C2"); 2 "Procedimento formal de liberação" (tag "em andamento"; "Qualidade define agente, dosagem e tempo pela base IDTF"); 3 "Limpeza qualificada / regime D" (tag "agendada"; "Higitrans Rondonópolis / amanhã, 14:00"); 4 "Inspeção + reavaliação pelo motor" (tag "aguarda"; "evidências capturadas no pátio; o motor reavalia sozinho"). Sem campos. Botões: "Fechar" e "Abrir na Torre (VG-2487)" (link). Somente leitura.

**Inspeção estrutural agendada**. Card com dia "08" / "AGO", "sexta, 8 de agosto", "pátio Rondonópolis / QKX 8A12 + SQT 1C55", hora "07:30". Inspetor "Jorge Mattos", "inspetor qualificado / trilha 6 vigente", chip "confirmado". Chips "estrutural", "higiênica", "fotos mínimas / 6 ângulos". Nota: "Aprovada, o conjunto vira Apto sozinho. Reprovada, abre não conformidade com plano." Sem campos. Botões:
- "Reagendar para 9 ago" / "Reagendar para 8 ago": alterna data entre sexta 8 ago 07:30 e "sábado, 9 de agosto" 08:00; o modal permanece aberto; toast "Inspeção reagendada. Jorge Mattos e o dono foram avisados."
- "Notificar o dono": fecha o modal; toast "Dono notificado por WhatsApp com data, hora e o que será inspecionado."

**Disparar renovação do laudo** (título passa a "Renovação em andamento" após confirmar). Card "SQT 7D22 / laudo de inspeção", "vence em 12 dias / 18 ago". Antes do envio: texto "O pedido vai ao dono (J. Bortolini, TAC) por WhatsApp com o prazo e a lista de oficinas credenciadas. Se vencer sem renovar, o conjunto sai da lista de elegíveis sozinho."; botões "Cancelar" e "Disparar renovação". Ao confirmar: estado `rnEnviada`; toast "Renovação disparada a J. Bortolini. O check do conjunto mudou para "em andamento"."; o modal mostra 3 passos ("Pedido enviado a J. Bortolini por WhatsApp" / "hoje, agora"; "Aguardando agendamento com oficina credenciada" / "prazo 18 ago"; "Novo laudo anexado: o conjunto volta a Apto sozinho") e botão "Fechar". Na lista, a linha QGH 5J33 passa a ter ação "Acompanhar renovação" e o check "Laudo de inspeção vence em 12 dias" vira "Renovação do laudo em andamento" / "enviada hoje". Sem campos.

**Trocar vínculo** (chip com as placas da linha). Campos:
- "NOVO RESPONSÁVEL" (radio, obrigatório): "Cerrado Cargas" ("ETC / GMP+ vigente / apto"), "AgroLima Ltda" ("agregado / acordo vence em 27 dias"), "Pantanal Granéis" ("ETC / bloqueado por reincidência").
- "A PARTIR DE" (chips, obrigatório): "hoje, 6 ago", "1 set (virada de contrato)".
Nota: "O vínculo atual é encerrado com data; o T-3 e as inspeções continuam no compartimento. Nada se apaga." Botões "Cancelar" e "Trocar vínculo" (desabilitado até escolher os dois). Ao confirmar: a linha passa a mostrar o novo dono, iniciais e "vínculo desde hoje" ou "vínculo desde 1 set"; toast "Vínculo de <placas> trocado para <dono>. O anterior foi encerrado com data; histórico preservado." Nenhuma validação impede escolher "Pantanal Granéis" nem o dono atual.

**Unificar cadastros** (chip com a placa). Subtítulo conforme a placa: QAS 7C31 "a mesma placa existe em dois cadastros com chassi divergente em 1 dígito. Um deles está errado."; SQT 4B77 "o implemento tem dois vínculos ativos ao mesmo tempo, sem data de troca. Escolha qual permanece ativo." Dois cartões selecionáveis (obrigatório escolher um):
- QAS 7C31: A "Cadastro da Lima Logística" (chassi "9BM…4471", criado em "mar 24", histórico "212 registros", fonte "cadastro manual"); B "Importação de segunda" (chassi "9BM…4477" em vermelho, criado em "4 ago", histórico "nenhum", fonte "planilha da Lima").
- SQT 4B77: A "Vínculo com a Lima" (desde "jan 25", viagens "48 em 2026", último uso "2 ago", situação "ativo"); B "Vínculo com a AgroLima" (desde "jun 23", viagens "0 em 2026", último uso "dez 24", situação "sem encerramento").
Nota: "Escolha o cadastro correto. O outro é arquivado como duplicata; T-3, inspeções e limpezas dos dois viram um histórico só, ordenado por data." Botões "Cancelar" e "Unificar mantendo o escolhido" (desabilitado sem escolha). Ao confirmar: a placa sai do card Duplicidades, o KPI "Duplicidades suspeitas" diminui 1; toast "<placa> unificada mantendo o cadastro <A|B>. A duplicata foi arquivada; o histórico virou um só."

**Novo ativo**. Campos:
- "PLACA DO IMPLEMENTO" (texto, placeholder "ABC 1D23", convertido para maiúsculas; obrigatório, mínimo 7 caracteres sem espaços). Se a placa for QAS7C31, SQT9E18, QBB4D18 ou SQT4B77: borda âmbar, chip "já cadastrada" e texto "Esta placa já existe na rede (Lima Logística, mar 24). Continuar criaria duplicidade; abra o cadastro existente ou unifique." e o botão fica bloqueado.
- "TIPO" (chips, obrigatório): "graneleiro", "caçamba", "tanque".
- "COMPARTIMENTOS" (chips, obrigatório): "1", "2", "3".
- "DONO / RESPONSÁVEL" (radio, obrigatório): "Cerrado Cargas", "AgroLima Ltda", "J. Bortolini / TAC".
Botões "Cancelar" e "Cadastrar e agendar inspeção" (desabilitado até tudo válido). Ao confirmar: cria linha no topo da lista com placas "<placa> (sem cavalo)", tipo "<tipo> / N compartimento(s)", "cadastrado agora", status Pendência, um chip "C1" (tooltip "sem histórico ainda"), T-3 "sem cargas registradas: T-3 nasce vazio", checks "Inspeção estrutural pendente / a agendar" e "Laudo de inspeção a anexar / pendente", ação "Ver agenda de inspeção"; limpa o formulário, filtro volta a "Todos" e busca é limpa; toast "<placa> cadastrado como Pendência: entra na lista de elegíveis quando a inspeção aprovar."

**Importar frota por planilha**. Fase 1: área "Solte a planilha aqui ou clique para simular" ("modelo .xlsx com placa, chassi, tipo, compartimentos e dono"); link "Baixar modelo .xlsx" (toast "Modelo .xlsx baixado: placa, chassi, tipo, compartimentos, dono e vínculos."); texto "duplicidades são detectadas por placa e chassi". Clique na área passa à fase 2: contadores "14 prontos para entrar", "3 já existem: atualizar", "2 conflito de placa"; lista de 4 linhas: "QRT 1A22" (novo), "QWE 8B44" (novo), "QBB 4D18" ("já existe: atualiza tara e chassi, T-3 preservado", atualizar), "QAS 7C31" ("conflito: placa já cadastrada com chassi divergente", revisar). Botões "Cancelar" e "Importar 17 e revisar 2": fecha; toast "17 ativos importados. Os 2 conflitos de placa foram para Duplicidades suspeitas, ao lado." Sem upload real nem campos.

**Meu perfil** (do menu do avatar). Leitura: "Rafael Antunes", "rafael.antunes@traxium.com.br", Papel "Gestor de qualidade", Autoridade na matriz "nível 3 / Gestor", Filiais "Rondonópolis, Sorriso", Liberações assinadas em 2026 "14". Sem botões além do fechar.

**Preferências e notificações**. 4 interruptores: "Bloqueio técnico na filial" (travado ligado, "sempre ativo: requisito da certificação"), "Item há mais de 2h na fila" (ligado), "Certificado de terceiro a vencer" (ligado), "Nova versão da base IDTF" (desligado). Alternam estado local sem toast.

**Papel ativo**. 5 opções: "Inspetor de pátio" (1), "Tráfego" (2), "Gestor de qualidade" (3, padrão), "Diretoria e Resp. Técnico" (4), "Auditor interno" (0). Clique troca o papel, fecha e mostra toast "Papel ativo agora é <papel>, nível <n>. A fila e as ações de assinatura passam a refletir esta autoridade." Só o badge do menu e o modal Sair refletem a troca.

**Sair da conta**. Mostra "Rafael Antunes" e "<papel> / nível <n> na matriz". Botões "Cancelar" e "Sair": fecha; toast "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data." Não navega.

Todos os modais fecham pelo "✕", por clique no fundo ou por "Cancelar"/"Fechar".

## Estados e simulações
- Loading/skeleton: não existe nesta tela.
- Vazio da lista Conjuntos: "Nenhum conjunto neste filtro" / "Ajuste a busca ou o filtro acima."
- Vazio do card Duplicidades: sem texto; o card fica só com título e subtítulo quando as 2 são unificadas. O KPI muda para 0 em verde.
- Erro: apenas o aviso de placa duplicada no modal Novo ativo.
- Botões desabilitados (cinza, cursor not-allowed) nos modais Trocar vínculo, Unificar e Novo ativo até o preenchimento.
- Estado inicial: conjunto QAS 7C31 expandido; filtro "Todos".
- Sem props de simulação declaradas.
- Esc fecha popovers e modais do perfil; não fecha os modais da tela (plano, agenda, renovação, vínculo, unificar, novo, importação).

## Entidades e operações
- Conjunto (cavalo + implemento): consultar, filtrar, buscar, expandir.
- Implemento / ativo: criar (Novo ativo), importar (planilha, simulado), unificar duplicidade (arquivar o outro cadastro).
- Compartimento: consultar T-3 resumido; navegar para o detalhe.
- Vínculo implemento × dono/responsável: editar (Trocar vínculo, com data de início); encerrar vínculo anterior (declarado).
- Dono / subcontratado: consultar (nome, situação); navegar para Subcontratados.
- Laudo de inspeção do implemento: consultar vencimento; disparar renovação (pedido ao dono).
- Inspeção estrutural: consultar agendamento; reagendar; notificar o dono.
- Plano de regularização: consultar (somente leitura).
- Duplicidade suspeita: consultar, comparar, unificar.
- Perfil do usuário / papel: consultar, trocar papel, alterar preferências, sair.
- Não há exportação nesta tela.

## Regras de negócio visíveis
- Cavalo, implemento e compartimento são entidades distintas; o histórico pertence ao compartimento.
- O vínculo cavalo × implemento é muitos-para-muitos, com data.
- Trocar vínculo encerra o vínculo atual com data e não apaga histórico; T-3 e inspeções ficam no compartimento.
- O compartimento mantém o próprio T-3 quando o implemento troca de cavalo ou de dono.
- Duplicidades são detectadas por placa e chassi; cadastro em dobro é bloqueado no formulário de novo ativo para 4 placas conhecidas.
- Unificar arquiva a duplicata e funde T-3, inspeções e limpezas em um histórico único ordenado por data.
- Documento vencido sem renovação retira o conjunto da lista de elegíveis automaticamente; renovado, volta automaticamente.
- Ureia pecuária no T-1 trava o compartimento; não existe botão "liberar"; o motor reavalia quando houver os fatos (procedimento formal, limpeza regime D, inspeção).
- Inspeção estrutural aprovada torna o conjunto Apto; reprovada abre não conformidade com plano.
- Ativo novo nasce como Pendência, com T-3 vazio, e entra na lista de elegíveis quando a inspeção aprovar.
- Preferência "Bloqueio técnico na filial" não pode ser desligada (requisito da certificação).
- Matriz de autoridade: ninguém assina acima do próprio nível; nível 0 é técnico; "Contaminação não se aprova, se regulariza."

## Observações factuais
- KPIs "Cavalos mecânicos" (72), "Implementos" (96) e "Aptidão da frota agora" (89%, 86 de 96) são fixos e não mudam quando um ativo é criado, importado ou unificado; o chip "Todos" passa de 6 para 7 após criar um ativo.
- A lista Conjuntos tem 6 itens no mock contra 96 implementos e 72 cavalos nos KPIs; não há paginação.
- Não existe chip de filtro "Apto", embora a lista tenha 2 conjuntos Aptos.
- Placeholder da busca menciona "chassi", mas a busca só pesquisa placas, dono e tipo.
- "Comparar" e "Unificar cadastros" abrem o mesmo modal, intitulado "Unificar cadastros".
- Para SQT 4B77 o modal trata de dois vínculos ativos, mas o texto fixo diz "O outro é arquivado como duplicata" e o botão diz "Unificar mantendo o escolhido"; após unificar, a linha RTQ 2F09 + SQT 4B77 não muda.
- "Importar 17 e revisar 2" mostra toast dizendo que os 2 conflitos foram para Duplicidades suspeitas, mas a lista Conjuntos e o card Duplicidades não mudam. A fase 2 mostra 4 linhas para 19 registros contados.
- "Baixar modelo .xlsx", "Notificar o dono" e "Sair" só mostram toast.
- "Reagendar" altera o modal, mas o card "Documentação a vencer" ("SQT 1C55 ... 8 ago") e o check "Inspeção estrutural pendente / 8 ago" da linha continuam com 8 ago.
- O modal "Inspeção estrutural agendada" mostra sempre "QKX 8A12 + SQT 1C55", inclusive quando aberto a partir de um ativo recém-criado.
- O botão "Cadastrar e agendar inspeção" cria a linha mas não agenda nem abre agenda.
- No Novo ativo, escolher 2 ou 3 compartimentos gera apenas um chip "C1" na linha criada; o texto de tipo diz "2 compartimentos" ou "3 compartimentos".
- O aviso de duplicidade no Novo ativo diz sempre "(Lima Logística, mar 24)", inclusive para QBB 4D18, cuja linha é da Cerrado Cargas. A lista de placas bloqueadas inclui "QAS7C31", que na lista aparece como placa de cavalo, sob o rótulo "PLACA DO IMPLEMENTO". O formulário não tem campo de chassi nem de cavalo.
- Listas de responsáveis diferentes entre modais: Trocar vínculo oferece Cerrado Cargas, AgroLima Ltda e Pantanal Granéis; Novo ativo oferece Cerrado Cargas, AgroLima Ltda e J. Bortolini / TAC.
- Trocar vínculo permite escolher "Pantanal Granéis" marcado como "bloqueado por reincidência"; após a troca, status e checks da linha (ex.: "Dono com certificado suspenso") não mudam.
- O subtítulo do card fala em vínculo "cavalo × implemento", e o modal "Trocar vínculo" troca o "NOVO RESPONSÁVEL" (empresa), não o cavalo.
- QAS 7C31 + SQT 9E18 e RTQ 2F09 + SQT 4B77 têm o mesmo check "Dono com certificado suspenso / 4 ago" (mesmo dono Lima Logística); o primeiro tem status Pendência e o segundo Travado. QKX 8A12 + SQT 1C55, também da Lima Logística, não tem esse check.
- O modal Unificar mostra histórico de "212 registros" para o cadastro da Lima (QAS 7C31); em `Compartimento Detalhe.dc.html` o toast de verificação fala em "214 registros" para o C1 do SQT 9E18.
- A linha QAS 7C31 + SQT 9E18 indica C2 travado por ureia no T-1; em `Inspecoes.dc.html` o pátio lista "C2 / QAS 7C31" como "bitrem / 3 compartimentos", com T-1 "Farelo de soja / 2 ago" e regime B. Nesta tela o mesmo conjunto é "graneleiro / 2 compartimentos".
- O check "Laudo de inspeção do implemento / set 27" da linha QAS 7C31 difere da ficha de `Compartimento Detalhe.dc.html` ("Conservação: boa / inspeção 5 ago"), que trata de outro tipo de registro; as duas telas não mostram o mesmo dado de laudo.
- Todos os links de compartimento levam ao mesmo arquivo, que mostra sempre "Compartimento C1 / SQT 9E18".
- "Hoje" nesta tela é "6 ago" (chip "hoje, 6 ago"); em `Inspecoes.dc.html` o cabeçalho diz "Terça, 5 ago".
- O cartão de rodapé da sidebar ("Rede de ativos") é específico desta tela; nas outras duas telas o cartão é outro.
- O handler do botão "+ Novo ativo" chama-se `toastNovo`, mas abre modal.
- Nas citações deste inventário, o ponto médio usado como separador na interface foi transcrito como barra (/).
