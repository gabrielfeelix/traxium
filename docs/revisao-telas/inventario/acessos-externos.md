# Acessos externos
Arquivo: Acessos Externos.dc.html (data-screen-label "Acessos externos"). Item da sidebar: "Acessos externos", no grupo PILARES, badge fixo "2". Perfil a quem se destina (pelo que a tela diz): usuário interno da contratante que convida e revoga acessos de fora; o usuário logado é "Rafael Antunes", "Gestor de qualidade", nível 3. Objetivo declarado na tela: mostrar "Quem enxerga o quê" fora da empresa, por superfície (portal do subcontratado, app de campo, visão do auditor), e acompanhar o caminho de cada convite; "todo convite do produto desemboca aqui". Convenção: o separador ponto médio dos rótulos da interface é transcrito como barra (/).

## Entradas e saídas
- Como se chega: pelo item "Acessos externos" da sidebar de Subcontratados e Motoristas. Nenhum elemento de conteúdo dessas duas telas aponta para cá. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html), "Viagens" (Viagens.dc.html), "Exceções e liberações" (Excecoes.dc.html), "Inspeções" (Inspecoes.dc.html), "Limpezas" (Limpezas.dc.html), "Motor IDTF" (Motor IDTF.dc.html), "Subcontratados" (Subcontratados.dc.html), "Motoristas" (Motoristas.dc.html), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html), "Não conformidades" (Nao Conformidades.dc.html), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html), "Protótipo mobile" (App de Campo.dc.html).
  - Linha expandida, botão secundário: "Abrir a empresa" (Subcontratados.dc.html) em AC-118, AC-126, AC-129, AC-131; "Abrir o motorista" (Motoristas.dc.html) em AC-121, AC-127; "Ver a amostra" (Dossie.dc.html) em AC-124; "Ver inspeções" (Inspecoes.dc.html) em AC-133. Os links levam à tela, não ao registro.
  - Bloco "As três superfícies de fora": "Portal do subcontratado" (Subcontratados.dc.html), "App de campo" (App de Campo.dc.html), "Visão do auditor" (Dossie.dc.html).
  - Bloco "De onde vem cada convite": "Subcontratados" (Subcontratados.dc.html), "Motoristas" (Motoristas.dc.html), "Dossiê" (Dossie.dc.html).

## Estrutura da tela
1. Sidebar. Mesmos itens e badges das demais telas; item ativo "Acessos externos" com badge "2" (fixo no HTML). Botão "Recolher menu". Sem o cartão "Safra 2026/27".
2. Cabeçalho. Título "Acessos externos"; subtítulo calculado "Terça, 5 ago / 4 acessos ativos / 2 convites parados / Filial Rondonópolis MT" (data e filial fixas; contagens derivadas do mock e atualizadas após revogação). Busca com placeholder "Buscar pessoa, empresa, telefone…". Botões "Exportar" e "Convidar". Avatar "RA" com menu "Meu perfil", "Preferências e notificações", "Papel ativo" (chip "Gestor"), "Sair".
3. Faixa de 4 KPIs (derivados do mock; reagem a revogação, não a filtro ou busca):
   - "Onde os convites param": número de ativos (4) e "acessos ativos de 8 convites"; barra segmentada com legenda "ativos / 4", "abriram / 1", "sem abrir / 1", "encerrados / 2".
   - "Enviados e nunca abertos": 1, rodapé "antes de reenviar, confira o contato".
   - "Expiram em 7 dias": 1 (conta só registros com rótulo "expira em"), rodapé "acesso de auditor tem prazo curto".
   - "TAC com acesso duplo": 1, rodapé "uma pessoa, dois papéis, um convite".
4. Coluna principal "Quem enxerga o quê" (cabeçalho fixo ao rolar), contagem "8 acessos / página 1 de 2", filtros em pílula: "Todos / 8", "Ativos / 4", "Parados / 2", "Encerrados / 2".
5. Lista de acessos (cartões expansíveis). Mock: 8 registros (AC-118 João Bortolini, AC-121 Ivan Prado, AC-124 Marcos Beltrão, AC-126 Transrocha Transportes, AC-127 Valdir Nunes, AC-129 AgroLima Ltda, AC-131 Lima Logística, AC-133 Jorge Mattos). 5 por página, 2 páginas. AC-118 vem expandido.
   - Linha recolhida: avatar com iniciais e anel; nome (ex.: "João Bortolini"); chip "TAC / DOIS PAPÉIS" quando há mais de um papel; subtítulo (ex.: "TAC / CPF 118.443.002-90 / WhatsApp (66) 99612 4408"); chips de superfície "PORTAL", "APP", "AUDITOR" (tooltip "Portal do subcontratado: a empresa terceira" etc.); chip de status ("ativo", "abriu, não terminou", "enviado, sem abrir", "expirado", "revogado"); prazo com rótulo (ex.: "há 4 dias" / "ativo desde"; "6 dias" / "expira em" em vermelho; "2 dias" / "parado há"; "1 dia" / "sem abrir há"; "11 dias" / "expirado há"; "3 dias" / "revogado há"); chevron.
   - Linha expandida: "O CAMINHO DO CONVITE" com 4 etapas ("Enviado" com data e canal, "Link aberto", "Aceite e assinatura", "Acesso ativo" ou "Encerrado"), cada uma com ✓, número ou "!" e texto (ex.: "2 ago, 09:12 / WhatsApp", "ainda não abriu", "parou no meio", "aguarda", "sem prazo", "expirou em 26 jul"). "O QUE ESTA PESSOA ENXERGA": 2 itens ✓ por superfície e 1 item ✕ "não vê ..." por superfície (ex.: ✓ "a própria empresa, certificado e acordo", ✕ "não vê viagens de outros motoristas, nem valor de frete"). Botões: ação principal ("Ver o que ele vê", "Reenviar convite" ou "Convidar de novo"), link secundário (ver Entradas e saídas), "Revogar acesso" (só se não encerrado). Campos: "convidado por" (ex.: "Rafael Antunes", "Helena Duarte"), "canal" ("WhatsApp", "e-mail", "link direto"), "validade" (ex.: "sem prazo", "enquanto tiver vínculo", "em 6 dias", "em 12 dias", "expirou em 26 jul", "revogado em 3 ago"), "código" (ex.: "AC-118"). Nota explicativa por registro (ex.: "Autônomo é empresa e motorista na mesma pessoa. Um convite, dois acessos, uma mensagem só no WhatsApp dele.").
6. Paginação: "mostrando 5 de 8", "Anterior", números, "Próxima" (oculta durante loading ou com 1 página).
7. Coluna lateral, card escuro "As três superfícies de fora", subtítulo "o que cada uma deliberadamente não mostra é requisito, não simplificação". 3 cartões-link com letra, nome, público, quantidade de acessos ativos e "não vê:": "D" "Portal do subcontratado" "a empresa terceira" 1, "não vê: viagens de outros transportadores, nem a fila de decisão da contratante"; "C" "App de campo" "motorista e inspetor de pátio" 3, "não vê: viagens de outros motoristas, nem valor de frete"; "E" "Visão do auditor" "auditor externo" 1, "não vê: nada fora da amostra sorteada, e não escreve em lugar nenhum". Quantidades derivadas do mock.
8. Card "De onde vem cada convite", subtítulo "todo convite do produto desemboca aqui". 3 linhas-link com sigla, nome, descrição e quantidade fixa: "Subcontratados" "convite de empresa terceira" 4; "Motoristas" "acesso ao app de campo" 3; "Dossiê" "leitura de amostra para auditor" 1. Nota: "Importar planilha não dispara convite. A planilha traz CNPJ e placa, não traz certificado nem treinamento, então o convite continua sendo ato explícito."
9. Modal "Convidar acesso externo" (ver Ações).
10. Modal "Revogar acesso" (ver Ações).
11. Modais do avatar renderizados: "Meu perfil" e "Preferências e notificações".
12. Toast inferior, some após 4,2 s.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Itens da sidebar | Sidebar | navegação | Ver Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Alterna largura; persiste em localStorage. |
| Busca | Cabeçalho | muda estado (filtra) | Compara com nome + subtítulo + código; volta à página 1. Telefones aparecem no subtítulo só de quem tem telefone no texto. |
| "Exportar" | Cabeçalho | toast | "Acessos externos exportados: quem, qual superfície, desde quando, até quando e quem convidou." Sem arquivo. |
| "Convidar" | Cabeçalho | modal | Abre "Convidar acesso externo" vazio. |
| Avatar "RA" | Cabeçalho | popover | Menu do perfil. |
| "Meu perfil" | Menu do avatar | modal | "Rafael Antunes", "rafael.antunes@traxium.com.br", "Papel" "Gestor de qualidade", "Autoridade na matriz" "nível 3 / Gestor", "Convites enviados em 2026" 38. Nota "Todo convite enviado fica no seu nome, com data. Revogação também." |
| "Preferências e notificações" | Menu do avatar | modal, muda estado | 4 interruptores: "Bloqueio técnico na filial" (travado), "Convite parado há mais de 48h" (ligado), "Acesso de auditor expirando" ("aos 3 dias do fim do prazo", ligado), "Revogação automática por vínculo encerrado" ("quando o motorista sai da empresa", desligado). |
| "Papel ativo" | Menu do avatar | nada visível | O handler define o modal "papel", mas não há marcação desse modal no HTML; o menu fecha e nada aparece. |
| "Sair" | Menu do avatar | nada visível | Mesmo caso: não há marcação do modal "Sair da conta". |
| Filtro "Todos", "Ativos", "Parados", "Encerrados" | Cabeçalho da lista | muda estado (filtra) | "Parados" = enviado ou aberto; "Encerrados" = expirado ou revogado. Volta à página 1. |
| Linha recolhida | Lista | expande/recolhe | Só uma linha aberta por vez. |
| "Ver o que ele vê" | Linha expandida (status ativo) | toast | "{nome} enxerga hoje: {superfícies}. Nada além disso." Não abre prévia. |
| "Reenviar convite" | Linha expandida (aberto ou enviado) | toast | "Convite reenviado a {nome} por {canal}. O prazo de 14 dias recomeça agora." Datas e prazo do registro não mudam. |
| "Convidar de novo" | Linha expandida (expirado ou revogado) | modal | Abre "Convidar acesso externo" vazio, sem a pessoa pré-selecionada. |
| Link secundário ("Abrir a empresa", "Abrir o motorista", "Ver a amostra", "Ver inspeções") | Linha expandida | navegação | Para a tela correspondente, sem abrir o registro. |
| "Revogar acesso" | Linha expandida (ativo, aberto ou enviado) | modal | Abre "Revogar acesso". |
| "Anterior", número, "Próxima" | Paginação | muda estado | 5 por página. |
| Cartão de superfície | Card "As três superfícies de fora" | navegação | Subcontratados, App de Campo ou Dossiê. |
| Linha de origem | Card "De onde vem cada convite" | navegação | Subcontratados, Motoristas ou Dossiê. |
| Modal "Convidar acesso externo" | Aberto por "Convidar" ou "Convidar de novo" | modal, toast | Texto: "O convite é por papel, não por pessoa. Quem é as duas coisas, como o TAC, recebe os dois acessos numa mensagem só." Campos: "QUEM" (obrigatório, escolha única entre 4 opções fixas: "J. Bortolini Transportes" "TAC / CNPJ 31.902.774/0001-40 / Pré-cadastrado" com chip "TAC"; "Sindona Transportes" "empresa / CNPJ 19.774.005/0001-22 / Pré-cadastrado"; "Milton Costa" "motorista da frota própria / sem acesso ao app"; "Convidar auditor externo" "acesso de leitura a uma amostra, com prazo"). Não há campo para digitar nome, contato, CPF, CNPJ, e-mail, prazo ou amostra. "QUAIS PAPÉIS" (obrigatório ao menos um; caixas "Portal do subcontratado" D, "App de campo" C, "Visão do auditor" E, cada uma com descrição "{enxerga}. Não vê {não vê}."). Ao escolher a pessoa, os papéis vêm pré-marcados (TAC: portal e app; Sindona: portal; Milton: app; auditor: auditor). Validação: sem pessoa, toast "Escolha quem vai ser convidado antes de marcar o papel."; auditor não acumula papel de operação e vice-versa, toast "Auditor externo não acumula papel de operação. O acesso dele é de leitura, sobre uma amostra." (opções bloqueadas com opacidade). Dica do campo: "este é TAC: os dois papéis já vieram marcados, e o convite sai numa mensagem só" / "marcado conforme o tipo de vínculo; dá para ajustar" / "escolha quem primeiro". "POR ONDE VAI" (obrigatório): "WhatsApp", "E-mail", "QR no pátio". Prévia "O QUE {primeiro nome} VAI RECEBER" com mensagem (ex.: "A Transrural Log convidou você. Abra o link para cadastrar sua empresa e usar o app das suas viagens. Não precisa de senha.") e chips dos destinos. Dica do rodapé: "Escolha quem vai ser convidado." / "Marque ao menos um papel." / "Escolha por onde o link vai." / "Vai uma mensagem só, com os dois acessos dentro." / "O convite expira em 14 dias se não for aceito." Botões "Cancelar" e "Enviar convite" (desabilitado até pessoa, papel e canal). Ao enviar: fecha e mostra toast "Convite enviado a {nome} por {canal}, com {n} acessos numa mensagem só. Expira em 14 dias sem aceite." (ou "com 1 acesso."). Nenhum registro é adicionado à lista. |
| Modal "Revogar acesso" | Aberto por "Revogar acesso" | modal, muda estado, toast | Mostra avatar, nome e subtítulo do registro e o efeito: para auditor "O auditor perde o acesso à amostra na hora. O que ele já baixou continua com ele, e o log registra o que foi aberto."; para os demais "A pessoa perde o acesso na hora. Registros que ela já enviou continuam íntegros no dossiê, com o nome dela." Campo "MOTIVO" (obrigatório, escolha única: "Vínculo encerrado", "Certificado suspenso na base pública", "Auditoria concluída", "Pedido do próprio titular"). Dica: "O motivo é obrigatório: revogação sem motivo não se explica numa auditoria." / "A revogação vale na hora e fica datada." Botões "Cancelar" e "Revogar" (desabilitado sem motivo). Ao confirmar: o registro passa a "revogado" com prazo "agora" / "revogado", some o botão de revogar, a ação vira "Convidar de novo", KPIs, filtros, subtítulo e contagens recalculam; toast "Acesso de {nome} revogado agora, motivo: {motivo}. O histórico do que ele viu continua no log." |
| Esc | Global | fecha | Fecha menu do avatar, modais do avatar, modal de convite e modal de revogação. |

## Estados e simulações
- Loading: ao montar, `loading` fica verdadeiro por 900 ms; a lista mostra 5 linhas de skeleton com shimmer (`txsh`); KPIs, filtros e coluna lateral aparecem já preenchidos; a contagem mostra "0 acessos".
- Vazio: "Ninguém de fora enxergando nada", com subtexto "Nada corresponde à busca "{termo}"." quando há busca, ou "Nenhum acesso neste recorte. Convite que nunca sai deixa o terceiro fora da operação sem ninguém perceber." quando o filtro não retorna nada.
- Erro: não há estado de erro.
- Simulações: o mock cobre os 5 status (ativo 4, aberto 1, enviado 1, expirado 1, revogado 1) e as 3 superfícies, incluindo um TAC com dois papéis. A revogação é a única ação que altera os dados exibidos (lista de revogados em estado). Não há props nem toggles.

## Entidades e operações
- Acesso externo / convite (código AC-nnn, pessoa, papéis, status, datas de envio, abertura e aceite, validade, canal, quem convidou): consultar, filtrar, buscar, convidar (só toast), reenviar (só toast), convidar de novo (abre o modal), revogar (muda estado), exportar (só toast).
- Superfície externa (Portal do subcontratado, App de campo, Visão do auditor): consultar o que cada uma enxerga e não enxerga; navegar.
- Pessoa externa (TAC, empresa terceira, motorista, inspetor de pátio, auditor externo): consultar; navegação para a tela de origem.
- Origem do convite (Subcontratados, Motoristas, Dossiê): consultar contagem fixa; navegar.
- Preferências de notificação do usuário: editar.

## Regras de negócio visíveis
- O convite é por papel, não por pessoa; o TAC recebe portal e app numa mensagem só.
- Auditor externo não acumula papel de operação; o acesso é de leitura sobre uma amostra sorteada e com prazo curto; ele "não escreve em lugar nenhum".
- Cada superfície tem o que "deliberadamente não mostra", tratado como requisito.
- O convite expira em 14 dias sem aceite; reenviar recomeça o prazo.
- Convite expirado não vira acesso; a empresa continua Pré-cadastrada e precisa de convite novo.
- Acesso do motorista "morre junto com o vínculo"; "Desvincular na tela de motoristas revoga aqui sozinho".
- Revogação exige motivo, vale na hora, fica datada e preserva no log o que a pessoa viu; registros já enviados continuam no dossiê.
- Acesso de portal é revogado quando a certificadora suspende a empresa (nota de AC-131).
- Importar planilha não dispara convite; o convite é ato explícito.
- Todo convite fica no nome de quem convidou, com data.
- O inspetor de pátio usa a mesma superfície do motorista (app), em tablet.
- A preferência "Bloqueio técnico na filial" não pode ser desligada.

## Observações factuais
- O convite pelo modal só produz toast; nenhum registro novo entra na lista. "Reenviar convite", "Ver o que ele vê" e "Exportar" também só produzem toast.
- O campo "QUEM" do modal de convite oferece 4 opções fixas e não permite informar uma pessoa nova (nome, telefone, e-mail, CPF ou CNPJ); "Convidar de novo" abre o modal sem a pessoa do registro.
- "Papel ativo" e "Sair" do menu do avatar não abrem nada nesta tela (os modais não existem no HTML), ao contrário de Subcontratados e Motoristas.
- O badge "2" da sidebar é fixo no HTML; o valor calculado `navBadge` não é usado. Coincide com os 2 convites parados do mock e não muda após revogação.
- As quantidades do card "De onde vem cada convite" (4, 3, 1) são fixas. Pelos links dos registros do mock: 4 apontam para Subcontratados, 2 para Motoristas, 1 para Inspeções (Jorge Mattos) e 1 para Dossiê.
- A origem "Motoristas" ("acesso ao app de campo") não tem correspondente na tela Motoristas: lá não há ação de convidar nem de dar acesso ao app, e "Novo motorista" não envia convite.
- A nota de AC-121 diz "Desvincular na tela de motoristas revoga aqui sozinho"; a tela Motoristas não tem ação "Desvincular", só "Alterar vínculo", cujo toast não menciona acesso. A preferência "Revogação automática por vínculo encerrado" vem desligada por padrão.
- O cartão "Portal do subcontratado" e os botões "Abrir a empresa" levam a Subcontratados.dc.html, que é a tela interna da contratante, não o portal. "Visão do auditor" leva a Dossie.dc.html.
- "Revogar acesso" aparece também para convites ainda não aceitos (status "abriu, não terminou" e "enviado, sem abrir"), que não têm acesso ativo.
- Canais do convite aqui: "WhatsApp", "E-mail", "QR no pátio"; no convite de Subcontratados: "WhatsApp", "SMS", "QR Code no pátio". Validade aqui: 14 dias; em Subcontratados: "Vale por 7 dias".
- A mensagem de convite diz "A Transrural Log convidou você"; o Onboarding Público mostra "Cerrado Cargas convidou você a transportar".
- O cabeçalho mostra a data "Terça, 5 ago"; 5 de agosto de 2026 é quarta-feira. AC-126 e AC-127 foram enviados em 5 ago e mostram "em 12 dias" de validade, com prazo de 14 dias.
- O mesmo CNPJ 08.441.220/0001-73 aparece em AgroLima Ltda (AC-129) e em Lima Logística (AC-131). Em Subcontratados, AgroLima tem "CNPJ 12.220.410/0001-05" e Lima "CNPJ 08.412.977/0001-31".
- Transrocha Transportes aqui tem "CNPJ 42.118.556/0001-09"; em Subcontratados, "CNPJ 21.007.554/0001-90".
- João Bortolini: aqui AC-118 "TAC / CPF 118.443.002-90", acesso ativo a portal e app desde 2 ago; no modal de convite "J. Bortolini Transportes", "CNPJ 31.902.774/0001-40", "Pré-cadastrado"; em Subcontratados "CPF ***.882.441-**", "Apto"; em Motoristas "Agregado" da "Cerrado Cargas S.A.", "CPF ***.772.901-**".
- Sindona Transportes: aqui "CNPJ 19.774.005/0001-22", "Pré-cadastrado"; em Subcontratados "CNPJ 55.902.331/0001-14", "Pendente inspeção".
- Valdir Nunes: aqui "motorista agregado / CPF 660.294.771-33", convite enviado e não aberto; em Motoristas "Próprio" da "Transrural Log Ltda", "CPF ***.882.410-**", "Bloqueado".
- Ivan Prado: aqui "motorista da Cerrado Cargas", aceite em 28 jul; em Motoristas "Próprio" da "Transrural Log Ltda"; no Onboarding Público a assinatura é de 6 ago.
- Lima Logística: aqui portal "revogado em 3 ago", "quando a certificadora suspendeu a empresa"; em Subcontratados a suspensão foi detectada em "4 ago, 06:12" e a própria Lima anexou protocolo "via link" em 5 ago.
- O KPI "Expiram em 7 dias" conta só o auditor (rótulo "expira em"); convites com "em 12 dias" não entram por terem rótulo diferente.
- O auditor aparece aqui convidado pela tela de acessos e, segundo o card de origens, pelo Dossiê; o perfil "Auditor interno" (nível 0) do menu de papéis é outro conceito.
- Lista com 8 registros e paginação de 5 por página (2 páginas).
- O modal "Meu perfil" desta tela mostra "Convites enviados em 2026" 38; o das outras telas mostra "Filiais" e "Liberações assinadas em 2026" 14. As preferências também diferem por tela.
- Sidebar sem o cartão "Safra 2026/27" presente em Subcontratados.
