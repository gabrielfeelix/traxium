# Revisão do protótipo v2: lacunas e interface

Iniciada em 14/10/2026, a partir da seção 6 e 7 de `HANDOFF.md`. Uma etapa por commit. Cada etapa registra o problema visto como usuário, o que mudou e as premissas adotadas.

## Etapa 1. Viagens (14/10/2026)

**Problema como usuário.** Três faixas com cerca de 27 chips antes da primeira linha (período, tipo, filial, situação com contagem, visões salvas). Visões salvas ficavam por último, abaixo dos filtros. "Limpar filtros" aparecia mesmo sem filtro. Em 1366 px a tela estourava para a direita e escondia "Exportar planilha" e a coluna Situação. A segunda linha da Situação repetia a data do carregamento.

**O que mudou.**

1. Visões viram abas acima da lista: Todas, Limpeza exigida, Aguardando CT-e, Liberadas por autoridade, Com ocorrência, e as visões salvas pelo usuário (com botão para apagar). Filas com ação mostram contagem em âmbar. Cada visão de fábrica tem uma linha de explicação e, quando cabe, a ação dela (Conciliar CT-e em lote; link para as ocorrências em Auditoria).
2. Uma linha de controles: busca, Período e Situação em seletores compactos, "Filtros" (tipo e filial) em popover com contador. Filtro escondido aparece como chip removível ao lado. "Limpar" e "Salvar como visão" só aparecem com filtro ativo. Salvar pede um nome.
3. Cortes para nada filtrar duas vezes: "Hoje com pendência" saiu (é a tela Hoje); "Aguardando CT-e" saiu da Situação e ficou só como aba; "Bloqueio técnico" virou opção da Situação. Na fila de CT-e o seletor Situação some, porque só teria uma opção.
4. "Conciliar CT-e em lote" saiu do topo e virou a ação da aba Aguardando CT-e. O link `?conciliar=1` vindo de Hoje continua abrindo o modal, já na aba certa.
5. Tabela com 6 colunas: CT-e e NF passam para baixo da ordem (sem CT-e, mostra o código interno). A segunda linha da Situação diz o que falta ("Limpeza conforme o regime e mais 3"), a descarga prevista ou o motivo do cancelamento.
6. `min-width` do wrapper desta tela caiu de 1560 para 1280 px. Em 1366 px a tela cabe inteira.
7. Novo parâmetro `?visao=` (`limpeza`, `sem_cte`, `autoridade`, `ocorrencia`) para outras telas abrirem uma fila.

**Mudança na semente (versão 8).** Toda a semente era regime A, então nenhuma viagem demonstrava lavagem com comprovante. A VG-3119 passou a ter fosfato monoamônico (regime B) como última carga declarada, sem comprovante: entra em Falta algo com a limpeza pendente. A VG-3116 recebeu a mesma carga anterior com lavagem registrada no Lavador Posto Trevo: continua pronta e mostra o comprovante anexado.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Quem procurava a antiga tela Limpezas quer ver as viagens que pediram lavagem, com as pendentes destacadas, e não um cadastro de lavagens | Criar uma lista de lavagens por fornecedor em Cadastros, Fornecedores |
| Visões salvas ficam no navegador do usuário | Passar a gravar por usuário na base quando houver backend |

## Etapa 2. Hoje e fila de assinatura (14/10/2026)

**Problema como usuário.** Na mesa do afretador, três dos quatro contadores repetiam os cabeçalhos dos grupos logo abaixo. As linhas bloqueadas diziam quem resolve ("Qualidade", "Direção e RT"), mas não davam ação: o afretador não tinha como pedir a liberação. No painel da qualidade não havia o que a Direção via no v1 em Exceções: o que espera a assinatura dela (lacuna 2 do handoff). Em 1366 px o painel estourava para a direita.

**O que mudou.**

1. Mesa: os quatro cartões viraram uma barra de resumo numa linha (total de viagens de hoje, barra segmentada, legenda por grupo e "motoristas no link agora"). Clicar na legenda abre o grupo e rola até ele.
2. Linha bloqueada por regra que uma alçada libera ganha ação. Quem tem a alçada vê "Liberar", que abre a Viagem com o modal de liberação. Quem não tem vê "Pedir liberação": grava o pedido, avisa quem assina e a linha passa a dizer "liberação pedida às 10:52, esperando assinatura de Gestor da qualidade".
3. Painel: bloco "Esperando sua assinatura", logo abaixo da prontidão, só para quem tem alçada. Lista as viagens de hoje em diante bloqueadas só por regra que a alçada do usuário libera, com prazo de carregamento, motivo, se a filial pediu e o botão "Analisar e assinar". Pedidos vêm primeiro. O que espera alçada maior aparece numa linha abaixo ("A OC 48131 também está bloqueada e espera Direção e RT").
4. Bloqueio técnico e falta de comunicação ao OC não entram na fila: o primeiro ninguém assina, o segundo se resolve registrando o fato.
5. `Viagem.dc.html?id=&liberar=1` abre o modal de liberação quando a viagem tem o que liberar.
6. `min-width` de Hoje caiu para 1280 px; grade de baixo do painel com coluna lateral flexível; texto da simulação sem a placa em minúsculas.

**Base.** Operação nova `pedirLiberacao` (grava em `v.pedidosLib`, entra na linha do tempo) e funções `liberacaoDe`, `podeAssinar` e `filaAssinatura`. Nove conferências novas no teste da base (669 no total).

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| O pedido de liberação avisa todos com a alçada na filial; o primeiro com a alçada exata é citado no aviso | Escolher um assinante por filial em Configurações, Alçadas |
| A fila mostra só viagens de hoje em diante: bloqueio passado sem liberação já é pendência de registro | Incluir as passadas numa seção à parte |

## Etapa 3. Auditoria e ocorrências exportáveis (14/10/2026)

**Problema como usuário.** Os campos de data nativos mostravam o formato do idioma do navegador: num navegador em inglês, 01/09/2026 aparecia como 09/01/2026. Numa tela que o auditor lê junto, isso é erro de leitura certo. As ocorrências não tinham exportação (lacuna 1 do handoff), e o link "Ocorrências do período" posto em Viagens não tinha destino. Em 1366 px a tabela espremia embarcador e produto até sumirem.

**O que mudou.**

1. Período num seletor compacto no hero, com atalhos (últimos 30 e 90 dias, últimos 12 meses, este ano) e datas exatas digitadas em DD/MM/AAAA, com máscara e aviso quando a data está incompleta ou invertida.
2. Lista de apoio nova, a primeira: "Ocorrências do período", com documento e planilha (CSV). Colunas no formato da consultoria: data, viagem, transportador, tipo, gravidade, descrição, fotos, revisão e quem registrou. Grave sem revisão sai marcada como pendente. `Auditoria.dc.html#ocorrencias` rola até ela e a destaca.
3. Tabela com CT-e e NF empilhados numa coluna; coluna lateral flexível; `min-width` em 1280 px.
4. O hero deixou de cortar os popovers.

**Teste.** `e2e-f5.cjs` passa a clicar no botão de exportar da lista de apoio e cobre a exportação de ocorrências.

## Etapa 4. Transportadores (14/10/2026)

**Problema como usuário.** Quatro cartões de resumo filtravam a lista, e logo abaixo quatro chips de situação filtravam a mesma coisa. "Convites pendentes" só existia como cartão. A tabela tinha 7 colunas, com documento e RNTRC numa coluna à parte, e em 1366 px as colunas de convite ficavam fora da tela.

**O que mudou.**

1. Cartões e chips viraram abas da tabela: Todos, Documento a resolver, Em revisão, Convite pendente e Em dia. As três que pedem ação mostram contagem e uma linha de explicação. `?filtro=vencendo` continua abrindo em Documento a resolver.
2. Tipo (Todos, TAC, ETC) virou um seletor segmentado ao lado da busca.
3. Nome, tipo e documento com RNTRC ficam na mesma célula; tabela com 6 colunas; `min-width` em 1280 px.

## Etapa 5. Viagem (14/10/2026)

**Problema como usuário.** O cartão de decisão no topo já lista o que falta, com quem resolve e a ação de cada item. Logo abaixo, Checagens repetia os mesmos itens no meio das que passaram (10 linhas), empurrando o T-3 e a verificação para baixo.

**O que mudou.**

1. Checagens fica recolhida por padrão: barra de progresso, "6 de 10" e um resumo ("6 passaram. As 4 que não passaram estão no topo da tela, com quem resolve"). "Ver as 10" abre a lista completa com detalhe e origem de cada dado. A página da VG-3119 encurtou cerca de 20%.
2. `min-width` em 1280 px.

**Não feito, de propósito.** Abas internas (Resumo, Cargas e verificação, Linha do tempo), sugeridas no handoff. A viagem é o fluxo inteiro e o auditor confere T-3, verificação e registro lado a lado; abas esconderiam justamente o que ele compara. Com Checagens recolhida, a densidade caiu sem esconder nada que pede decisão. O rail continua com os cinco cartões: cada um responde a uma pergunta diferente (quem é, qual conjunto, onde o motorista está, o que o auditor anota, ocorrências).

**Correção na semente (versão 9).** Na etapa 1 o fosfato da VG-3119 ficou em 06/10, dia em que a VG-3111 levou casca de soja no mesmo conjunto, e a tela mostrava "Fosfato, confere com a VG-3111". O fosfato passou para 07/10 (frete de retorno) e a casca de soja de 06/10 virou o T-2, conferida com a VG-3111.

## Etapa 6. Frota própria (14/10/2026)

**Problema como usuário.** Quatro cartões de resumo para 6 conjuntos. Dois não tinham filtro próprio e, por erro, mudavam o filtro para um valor que a lista lia como "fora do escopo": clicar em "CRLV ou CNH a vencer" mostrava os conjuntos fora do escopo. Em 1366 px a tela estourava e o botão de exportar sumia.

**O que mudou.**

1. Com 6 conjuntos não há volume que peça filtro. Os cartões saíram; os números foram para o subtítulo ("6 conjuntos, 4 no escopo GMP+. 7 viagens nos últimos 30 dias.").
2. A lista ficou em dois grupos com título e contagem: No escopo GMP+ e Fora do escopo.
3. Documento da frota vencendo em 30 dias aparece numa faixa âmbar só quando existe; sem vencimento, o subtítulo diz isso.
4. Colunas do cartão do conjunto rebalanceadas para 1366 px; compartimento sem quebrar linha; `min-width` em 1280 px.

## Etapa 7. Moldura: sidebar, header fixo e busca global (14/10/2026)

**Referência.** O Autofluxos (`~/dev/4yu-apps/autofluxos-ux`) foi avaliado, não copiado. De lá vieram os rótulos de grupo na navegação, o header fixo e a sidebar retrátil. A sidebar de lá é clara e com borda; a do Traxium manteve o teal e o item ativo em degradê, agora flutuante e arredondada, com brilho radial no fundo.

**O que mudou (tudo gerado por `scripts/gerar-sidebar.mjs`).**

1. Sidebar flutuante (margem de 12 px, raio de 22 px, sombra), com três grupos: Operação (Hoje, Viagens), Quem transporta (Transportadores, Frota própria) e Qualidade (Auditoria, Cadastros). Recolhida, vira coluna de ícones com divisórias no lugar dos rótulos.
2. Cadastros continua acordeão, porque é a única área central que abre outras telas, e agora começa aberto (lacuna 4). Quem recolher fica com a escolha salva no navegador.
3. Header fixo em todas as telas com sidebar: busca global à esquerda, nome, papel e avatar à direita. O avatar saiu do título de cada tela; o bloco `TX:PERFIL` ficou vazio e continua marcado.
4. Busca global (lacuna 3): viagens (ordem, código, CT-e, NF, placa, motorista), transportadores (nome, CPF, CNPJ, RNTRC), compartimentos (placa da carreta, com a última carga) e produtos (nome e sinônimos, abre Cadastros já filtrado por `?q=`). Atalho "/", Esc fecha, Enter abre o primeiro resultado ou, sem resultado, Viagens com o termo em todo o período.
5. Base IDTF reduzida a uma linha no rodapé da sidebar; espaçamentos apertados para caber em 768 px de altura.
6. Conteúdo das 9 telas com 92 px no topo para o header; `min-width` em 1280 px em todas (Compartimento, Cadastros e Configurações eram as que faltavam).

## Etapa 8. Cadastros (14/10/2026)

**Problema como usuário.** A sidebar abre Cadastros em quatro subitens e, logo abaixo do título, a página repetia os mesmos quatro como abas: duas navegações para a mesma coisa. Em Produtos, cinco chips de regime espremiam a busca até cortar o exemplo do campo em 1366 px, e o regime C (água e detergente) nem aparecia; o cartão "Base IDTF" repetia o rodapé da sidebar; a busca sem resultado mandava "pedir ao lado" sem levar o termo. Em Manual, os cinco cartões do manual ocupavam a coluna inteira sem pedir decisão nenhuma, e "Publicar nova versão" quebrava em duas linhas. Em Fornecedores, documento com "vence em 17 dias" não tinha ação; o vencimento listado em Hoje levava para cá e parava ali.

**O que mudou.**

1. O título passa a ser a seção ("Produtos e regimes", com "Cadastros" acima, pequeno). As abas da página só aparecem com a sidebar recolhida, quando o acordeão some e a página precisa navegar sozinha.
2. Produtos: regime virou um seletor compacto ("Depois dele: Todos") com as seis opções, a contagem de cada uma conforme a busca e a opção vazia apagada. A contagem ("5 de 30") fica no fim da linha. O cartão da base IDTF saiu; a versão foi para o subtítulo. Busca sem resultado oferece "Pedir classificação de "escória de cobre"", que grava o pedido na hora; se o termo já foi pedido, a linha diz isso.
3. Manual: cartões do manual recolhidos numa linha ("5 cartões, o que o motorista lê na v3.2", Ver os cartões). Ações das duas colunas sem quebra.
4. Fornecedores: documento vencido ou vencendo ganha "Atualizar", que pede a nova validade. O subtítulo conta os documentos que vencem em 30 dias. O vencimento de fornecedor em Hoje abre `Cadastros.dc.html?aba=fornecedores&id=`, que rola até o fornecedor e o destaca.
5. Filiais: subtítulo conta as filiais sem comunicação ao organismo certificador. Fora isso, sem mudança: a filial pendente já se destaca em vermelho e tem a ação.

**Base.** `atualizarDocumento` aceita `fornecedor` (atualiza o documento pelo nome). Três conferências novas no teste da base (672 no total).

**Teste.** `scripts/e2e-revisao.cjs` novo, que vai juntar os fluxos desta rodada. Nesta etapa cobre abas e sidebar, seletor de regime, pedido de classificação pela busca, atualizar documento de fornecedor e cartões do manual.

**Pendente para o pente fino.** Os campos de data dos modais de Cadastros (comunicação ao OC, treinamento, fornecedor e o novo de validade) usam o campo nativo, que mostra o formato do idioma do navegador. Entram no item 4 junto com Transportadores.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| A sidebar é a navegação de Cadastros; a página não repete as abas | Voltar as abas na página e tirar os subitens da sidebar (um só lugar) |
| Atualizar documento de fornecedor pede só a nova validade, como em Transportadores | Pedir também o arquivo do documento quando houver anexo de verdade |

## Etapa 9. Configurações (14/10/2026)

**Problema como usuário.** A navegação lateral por âncoras levava a seção para o topo da janela, embaixo do header fixo de 72 px: clicar em "Regras" escondia o título de Regras. A própria navegação, presa a 20 px do topo, também sumia sob o header ao rolar, e o item ativo só mudava no clique, nunca na rolagem. Em "Usuários e papéis" não havia como pôr ninguém: o gestor da qualidade que contrata um afretador novo não tinha por onde dar o acesso. O subtítulo da página repetia a lista de seções do menu lateral, e as regras diziam "piso: alerta", termo que só faz sentido para quem escreveu o motor.

**O que mudou.**

1. Seções com `scroll-margin-top` de 92 px: a âncora para logo abaixo do header. Navegação lateral presa a 92 px.
2. O item ativo acompanha a rolagem (a última seção cujo topo passou do header; no fim da página, a última). Durante a rolagem suave disparada pelo clique, o acompanhamento espera, para o destaque não pular de item em item.
3. "Convidar usuário" no cabeçalho de Usuários: nome, e-mail, papel (afretador, gestor da qualidade, gestor de frota, consultoria externa) e filial quando é afretador. E-mail de quem já tem acesso ou convite pendente é recusado no próprio modal. O convite aparece na lista com avatar tracejado, "convite enviado hoje 10:52, sem primeiro acesso" e "Cancelar convite".
4. Subtítulo diz para que serve a tela ("Quem acessa, quem assina e o que trava a viagem"). Regras: "regra interna: pode passar a só alertar" no lugar de "piso: alerta".

**Base (versão 10 da semente).** Lista nova `convitesUsuario` e operações `convidarUsuario` e `cancelarConviteUsuario`. O convite fica fora de `usuarios` até o primeiro acesso, que o protótipo não simula: não entra em "Entrar como", na fila de assinatura nem nos avisos de liberação. Duas conferências novas (674 no total).

**Teste.** `e2e-revisao.cjs` cobre âncora abaixo do header, seção ativa com a rolagem, recusa de e-mail repetido, convite pendente e cancelamento. `e2e-f5.cjs` passou a achar o botão da classe da regra por `data-tx-classe`, e não pelo texto.

**Premissas.**

| Premissa | O que muda se a resposta vier diferente |
| --- | --- |
| Quem administra a conta (gestor da qualidade) convida os usuários; Direção e RT não se convida pela tela | Se a Traxium criar os acessos na implantação, trocar o botão por "Pedir acesso à Traxium" |
| Convite de Direção e RT fica de fora: a alçada máxima é dada por contrato | Incluir o papel no convite, com confirmação de quem já é Direção |
| O convite vale até o primeiro acesso, sem prazo de expiração | Expirar em 7 dias e oferecer "Reenviar" |

## Situação ao fim de 14/10/2026

- Lacunas 1 a 4 do handoff fechadas: ocorrências exportáveis (etapa 3), fila de assinatura (etapa 2), entradas para o que virou seção (visões em Viagens na etapa 1 e busca global na etapa 7), Cadastros visível (etapa 7). A lacuna 5 continua dependendo do Gabriel e do Rafael.
- Revisão de interface feita em Viagens, Hoje, Auditoria, Transportadores, Viagem e Frota. Não revistas uma a uma: Compartimento, Cadastros, Configurações e Link da Viagem; ganharam só a moldura nova e o `min-width`.
- Nada publicado na Vercel e nada enviado ao GitHub nesta rodada.
