# Traxium: revisão de fluxos do protótipo

Auditoria de 8 de agosto de 2026 sobre as 18 telas do protótipo, comparadas com o app em `src/`. O objetivo não é acrescentar telas: é fechar as pontas dos fluxos que já existem e nomear as decisões que ainda não foram tomadas.

Método: inventário dos modais, drawers e chamadas de ação de cada tela; leitura das rotas do app; conferência de cada ponto contra o briefing e o PDF dos cinco pilares.

---

## 1. O diagnóstico em uma frase

O protótipo modela bem **o que o motor decide**. Ele quase não modela **como as coisas entram no sistema e quem as mantém**.

Das 18 telas, 8 têm alguma ação de criar. Nenhuma tem edição explícita fora de retificação. Nenhuma pagina. E o convite, que é a porta de entrada de todo terceiro, existe em três telas diferentes sem nenhum lugar que responda "quem tem acesso hoje e até quando".

---

## 2. Achados confirmados

Cada item abaixo foi verificado no arquivo, não inferido.

### 2.1 Não existe cadastrar um subcontratado

`Subcontratados.dc.html` tem exatamente duas portas de entrada: **Convidar terceiro** e **Importar planilha**. Não há criação manual.

O incômodo é legítimo, e a causa não é a falta do botão. É que as duas portas foram desenhadas como se fossem alternativas de **volume** (um contra muitos), quando na verdade a diferença entre elas é **quem digita**:

| Caminho | Quem preenche | Quando faz sentido |
| --- | --- | --- |
| Cadastrar | a transportadora | os dados já chegaram por WhatsApp ou e-mail |
| Convidar | o próprio terceiro | não se tem os dados, e digitar por ele gera dado errado |
| Importar | a transportadora, em massa | migração de base, entrada de uma nova filial |

Os três desembocam no mesmo estado: **Pré-cadastrado**. É isso que torna o modelo coerente com o princípio do produto: o modo como o registro nasceu não altera o estado, porque estado deriva de fato, não de origem.

Recomendação: as três entradas passam a conviver no mesmo ponto da tela, com a mesma linguagem, e a tela declara que todas terminam em Pré-cadastrado.

### 2.2 Não existe cadastrar produto no Motor IDTF

`Motor IDTF.dc.html` não tem nenhuma ação de criação. A fila de classificação apenas **vincula** um nome não reconhecido a um produto que já existe na base.

Consequência prática: quando o produto não existe na base, o fluxo não tem saída. O caso real é frequente, porque a base nasce da norma internacional e o Brasil tem coproduto que ela não cataloga.

Recomendação: a fila de classificação ganha uma segunda saída, "criar produto na base", com os dezoito campos do §7.5 e o registro de quem aprovou. Não é tela nova: é um segundo botão no modal que já existe.

### 2.3 Botões soltos no resultado da consulta IDTF

No card de resultado convivem, no mesmo nível visual, três links com seta: `Ficha completa →`, `Editar matriz →` e `Classificar →`.

São três coisas de natureza diferente empilhadas sem hierarquia:

- Ficha completa: **consultar** o produto que acabou de aparecer
- Classificar: **resolver** uma pendência da fila técnica
- Editar matriz: **governar** a base normativa

Editar matriz não pertence a um resultado de consulta. Quem consulta um produto para liberar uma carga não está governando a base naquele momento, e a proximidade convida ao erro justamente na tela onde erro contamina todas as decisões futuras.

Recomendação: uma ação primária no card (Ficha completa), o resto em menu de excedente. Editar matriz sai do card e vive na seção de governança da base.

### 2.4 Nenhuma tela do protótipo pagina

Zero paginação nas 18 telas. Todas renderizam a lista inteira.

Com 80 não conformidades ou 80 limpezas, três coisas quebram ao mesmo tempo:

1. A lista vira rolagem sem fim, sem noção de tamanho.
2. Os filtros saem da tela ao rolar, então filtrar exige voltar ao topo.
3. Os KPIs do topo descrevem **o período**, mas encostados numa lista longa passam a parecer que descrevem **o que está à vista**. Um número que muda de significado conforme a rolagem é pior que número ausente.

Distinção que importa: a Torre de Controle **não** deve paginar. Ela é fila de trabalho, e fila de trabalho com 80 itens já é o sintoma, não o problema de UI. As telas de registro (NCs, Limpezas, Inspeções, Viagens, Subcontratados) são tabelas e precisam de contagem, paginação e filtro fixo.

### 2.5 Auditor não tem cadastro nem listagem

O auditor aparece uma única vez no protótipo: em `Dossie.dc.html`, no modal de compartilhar, como e-mail mais prazo de expiração.

Não existe listagem de auditores, não existe revogação visível, não existe "este auditor abriu a amostra em tal data". Para um produto cujo critério de aceite é sobreviver a uma auditoria, o auditor ser um campo de e-mail é a lacuna mais grave da lista.

### 2.6 Academy arquiva, mas não cria

`Academy.dc.html` permite arquivar trilha e publicar nova versão. Não permite criar trilha nova. As dez trilhas são tratadas como constantes do sistema.

Pode ser decisão consciente, já que as dez vêm da diretriz. Se for, a tela precisa dizer isso, porque hoje a ausência parece esquecimento.

---

## 3. O buraco estrutural: o convite não tem o outro lado

Este é o achado que reorganiza os demais.

No protótipo, convidar alguém acontece em **três telas diferentes**, com três interfaces diferentes:

| Onde | O que envia | Para quem |
| --- | --- | --- |
| Subcontratados | convite com canal e destinatário | empresa terceira |
| Dossiê | link de leitura com expiração | auditor externo |
| Academy | trilha de treinamento | motorista |

Três origens, nenhum destino comum. Não existe nenhuma tela que responda: **quem tem acesso externo hoje, de que tipo, desde quando, até quando, e como revogo.**

O app já resolveu parte disso, e o protótipo não sabe. Em `src/app/acesso/[token]` existe ativação de acesso externo com dois tipos declarados:

```
portal_subcontratado  →  "Portal do subcontratado"
app_motorista         →  "App do motorista"
```

com estados `revogado` e `expirado`. Ou seja: a decisão de que existem **dois destinos distintos de convite** já foi tomada no app. O protótipo mostra o envio e nunca mostra a chegada.

### O que isso significa para as perguntas em aberto

**Importar planilha dispara convite?** Recomendação: não, e por um motivo de conteúdo. A planilha traz CNPJ, razão social e placa. Não traz certificado, acordo assinado nem treinamento, que é exatamente o que produz aptidão. Importar deve criar os registros e, ao terminar, oferecer a ação seguinte com a conta na cara: "42 empresas importadas, 42 sem certificado comprovado. Convidar todas?". O convite continua sendo ato explícito, com destinatário e canal, porque disparar 42 mensagens sem querer é um erro que não se desfaz.

**Motorista e subcontratado usam a mesma tela?** Não, e o app já separou. São superfícies diferentes do §5 do briefing: o motorista abre o app de campo, cujo objeto primário é o checklist da viagem de hoje; a empresa abre o portal do subcontratado, cujo objeto primário é ela mesma e seus certificados.

**E o TAC, que é as duas coisas?** É o caso que ninguém desenhou, e é o mais comum no agronegócio brasileiro. O autônomo é empresa e motorista na mesma pessoa. Recomendação: o convite passa a ser **por papel**, não por pessoa. Um TAC recebe os dois acessos do mesmo convite, e a superfície dele abre com alternância entre "minhas viagens" e "minha empresa". Desenhar isso como dois convites separados para o mesmo CPF produz duas mensagens no WhatsApp da mesma pessoa, e é assim que se perde um cadastro.

**O auditor entra onde?** Como terceiro tipo de acesso externo, ao lado dos dois que já existem, com o mesmo ciclo de vida: convite, token, aceite, expiração, revogação.

### Recomendação central desta revisão

Uma superfície única de **acessos externos**, que lista todo mundo de fora que enxerga alguma coisa: subcontratado, motorista, auditor. Com tipo, estado, quando aceitou, quando expira e revogação em um clique.

Isso não é tela nova no sentido de aumentar o produto. É o destino que três telas já existentes precisam ter e não têm. E resolve de uma vez a pergunta "para onde vai depois que convidou", que hoje não tem resposta em lugar nenhum.

---

## 4. Densidade e escala

### 4.1 Filtros da tela de Viagens

Hoje os filtros ocupam a barra do cabeçalho na horizontal. Em notebook já ficam apertados, e a observação sobre acrescentar filtro está correta: a próxima filtragem quebra o layout.

Recomendação, na ordem:

1. Os dois ou três filtros mais usados ficam visíveis como chips.
2. O restante colapsa em um botão **Filtros (3)**, com a contagem de filtros ativos, abrindo painel lateral.
3. Acima dos filtros, **visões salvas**: "travadas hoje", "carregam em 2h", "sem T-3". Uma visão salva resolve o que três filtros combinados resolveriam, com um clique e sem ocupar largura.

O ponto de UX: acrescentar filtro é resposta linear para um problema que cresce. Visão salva é resposta que não cresce.

### 4.2 O que acontece com 80 registros

Por tela, o que precisa existir:

| Tela | Com 80 registros |
| --- | --- |
| Torre de Controle | não pagina. 80 itens em fila de decisão é alerta de operação, e a tela deve dizer isso |
| Não conformidades | pagina, com contagem e filtro fixo. Ordenação por prazo vencido primeiro |
| Limpezas, Inspeções | paginam. O KPI do topo declara escopo do período, separado da lista |
| Viagens | pagina. É a tela mais próxima de tabela do produto |
| Subcontratados | o funil de 9 estados já funciona como filtro primário e segura bem; a lista abaixo pagina |

---

## 5. O que é cadastrável hoje

Levantamento por tela. "Editar" considera apenas edição direta, não retificação por evento novo.

| Tela | Cria | Edita | Exporta |
| --- | --- | --- | --- |
| Viagens | sim | não | não |
| Subcontratados | convite e importação | por menu de linha | sim |
| Ativos e frota | sim | vínculo e agenda | não |
| Não conformidades | sim | avança etapa | não |
| Limpezas | sim | não, só retificação | não |
| Inspeções | despacha ao app | não, só retificação | sim |
| Motor IDTF | não | matriz | não |
| Academy | não | versão e arquivo | sim |
| Motoristas | sim | vínculo | não |
| Dossiê | gera | não, é lacrado | sim |
| Indicadores | não se aplica | não se aplica | sim |

Duas leituras deste quadro:

**Ausência correta.** Limpeza, inspeção e dossiê não editam de propósito. Registro sincronizado trava, e correção é evento novo. Isso é conformidade, não lacuna, e a tela já explica.

**Ausência a corrigir.** Viagem não edita nada depois de criada, nem antes de carregar. Trocar a janela de carregamento de uma viagem agendada é operação banal e hoje não tem caminho. Exportação também falta em telas onde é pedido óbvio: NCs para reunião de qualidade, limpezas para a estação cobrar comprovante.

---

## 6. O que vale trazer do app para o protótipo

O app tem 25 rotas, o protótipo tem 18 telas. A diferença não deve ser eliminada: o protótipo é deliberadamente menor. A triagem:

**Trazer:**

- `acesso/[token]`, a ativação de acesso externo. É a metade que falta do convite e a origem da superfície de acessos externos recomendada no §3.

**Avaliar:**

- `checklists`, o editor de modelo de checklist por tipo de implemento. Responde diretamente a "tudo é cadastrável". Hoje o protótipo mostra o checklist dinâmico funcionando, mas ninguém o edita.

**Não trazer, e a diretriz concorda:** `atividade`, `auditoria`, `conformidade`, `documentos`, `fazendas`, `lotes`, `traces`. São segunda onda. `bloqueios` já está coberto por Exceções, e `mobile` já existe como App de Campo.

---

## 7. Ordem sugerida

Da maior consequência para a menor.

1. Superfície de acessos externos, e o convite passando a ser por papel. Fecha o buraco do §3 e responde às perguntas de convite de uma vez.
2. Cadastro manual de subcontratado, e as três entradas convergindo visivelmente em Pré-cadastrado.
3. Criação de produto na base IDTF, como segunda saída da fila de classificação.
4. Paginação, contagem e filtro fixo nas cinco telas de registro.
5. Filtros da tela de Viagens em painel, com visões salvas.
6. Hierarquia das ações no card de resultado do IDTF, e Editar matriz saindo dali.
7. Edição de viagem agendada, e exportação em NCs e Limpezas.

---

## 8. Perguntas que ainda dependem de decisão

Não são falhas do desenho. São escolhas de produto que ninguém tomou ainda, e que o desenho não consegue esconder por muito mais tempo.

1. O TAC recebe um convite ou dois? A recomendação aqui é um, por papel, mas contraria a separação de superfícies do briefing e precisa de aval.
2. O auditor é convidado por amostra, como hoje no dossiê, ou tem cadastro permanente com acesso recorrente? O ciclo de auditoria é anual e a resposta muda o modelo de dados.
3. Importar planilha cria empresa **e** motorista, ou só empresa? A planilha real do cliente costuma ter as duas coisas na mesma linha.
4. Quem aprova a criação de um produto novo na base: a Qualidade do cliente ou a Traxium? A base é produto da Traxium e serve todos os clientes, então criação local vira divergência entre bases.
