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
