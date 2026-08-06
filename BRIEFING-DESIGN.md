# TRAXIUM — Briefing de produto para design

Documento de contexto para quem vai desenhar o sistema. Descreve **o que o produto faz, quem usa, quais telas existem, qual o objetivo de cada uma, que informação vive em cada uma e como os fluxos se encadeiam**. Não descreve interface: layout, componentes, hierarquia visual e interação ficam a cargo do design.

Fontes: diretriz do P.O. (`Traxium - 5 Pilares prioritários.pdf`), `traxium_perguntas_rafael_v2` (30 perguntas de descoberta com a operação real) e o protótipo funcional já construído.

---

## 1. O problema

Uma transportadora que leva grãos e ingredientes para ração (*feed*) opera sob a certificação **GMP+ FSA**. A norma exige que, antes de cada carregamento, alguém consiga afirmar: este compartimento está apto a receber este produto, considerando o que ele carregou antes, a limpeza que foi feita, o estado físico do equipamento, a validade dos certificados de quem transporta e a competência de quem dirige.

Hoje, na operação real, essa decisão acontece em WhatsApp, planilha e memória do despachante. Quando o auditor chega — meses depois, por amostragem — ninguém reconstrói por que aquela carga saiu.

O Traxium é a camada que **decide se uma carga pode seguir e prova por que**. Não é um repositório de documentos, não é um TMS, não é rastreamento. É um motor de decisão com trilha de evidência.

### O teste que define sucesso

> Dada uma viagem qualquer, sorteada por um auditor, o sistema reconstrói em menos de dois minutos: por que liberou ou bloqueou, qual carga anterior existia no compartimento, qual limpeza era exigida, qual foi aplicada, quem validou, e qual evidência comprova cada afirmação.

Tudo no produto existe para servir esse teste.

---

## 2. Os três princípios que moldam o produto

**1. Estado é derivado do fato, nunca digitado.**
Ninguém marca uma empresa como "apta". A aptidão é calculada do certificado, da base pública da certificadora, do acordo de qualidade assinado e do treinamento concluído. Ninguém marca um motorista como "elegível" — isso vem das trilhas de treinamento vigentes. Não existe campo de status editável no produto. Isso tem consequência direta para o design: **não há tela que "muda um estado"; há tela que registra um fato, e o estado se recalcula.**

**2. Honestidade de dado.**
Nenhum número aparece sem origem rastreável. Onde não há dado, o sistema declara a ausência — nunca preenche com um valor plausível. Onde uma métrica não é mensurável, ela aparece explicitamente como *não medida*, junto do que precisaria existir para medi-la. Um número estimado é indistinguível de um número medido depois que entra numa reunião.

**3. A unidade de controle é o compartimento, não o veículo.**
O histórico das três últimas cargas (**T-3**) e as limpezas pertencem ao compartimento que toca o produto — a boca do graneleiro, o tanque, a divisória. Não pertencem à placa do cavalo, que é só tração. Trocar o cavalo de uma carreta não altera nada do histórico. Um bitrem tem vários compartimentos, cada um com seu T-3 independente.

---

## 3. Vocabulário mínimo

Termos que aparecem nas telas e precisam ser entendidos para desenhá-las.

| Termo | O que é |
| --- | --- |
| **GMP+ FSA** | Esquema de certificação internacional de segurança de alimentos para animais. É a norma que o produto operacionaliza. |
| **Compartimento** | Subdivisão do implemento que toca o produto. É a unidade de controle do sistema. |
| **Implemento** | Carreta, tanque, caçamba, baú, bitrem, rodotrem. Tem 1 ou N compartimentos. |
| **Cavalo** | Unidade tratora. Não toca produto, não carrega histórico. |
| **T-3** | As três últimas cargas de um compartimento. Define o que pode subir agora. |
| **IDTF** | Base normativa que cruza carga anterior × carga atual e devolve o regime de limpeza mínimo — ou "proibido". |
| **Regime A / B / C / D** | Níveis crescentes de limpeza. A = seca. B = água. C = água + detergente food grade. D = C + desinfecção. |
| **LCI / Inspeção pré-carregamento** | Verificação higiênica e estrutural do compartimento antes de carregar. |
| **TAC** | Transportador autônomo de carga. Um dos tipos de vínculo. |
| **Subcontratado** | Empresa terceira que transporta sob a cadeia de certificação da contratante. |
| **Acordo de Garantia da Qualidade** | Contrato de feed safety entre a transportadora e cada terceiro. Tem vigência; expirado, bloqueia. |
| **NC / CAPA** | Não conformidade e o ciclo de ação corretiva que ela abre. |
| **Dossiê** | Reconstrução completa e lacrada da decisão de uma viagem. Entrega central do produto. |
| **EUDR / DDS / CAR** | Regulação europeia antidesmatamento, sua declaração de devida diligência e o cadastro ambiental rural brasileiro. Segunda onda do produto. |

---

## 4. Marca

**Verde-azulado (teal) escuro é a cor primária.** A paleta de marca:

| | Hex | Papel |
| --- | --- | --- |
| Primária | `#127670` | Cor principal da marca |
| Primária escura | `#0C5862` | Variação de profundidade |
| Primária máxima | `#093D44` | Ênfase máxima, superfícies escuras |
| Azul de apoio | `#0E78B5` | Cor secundária |

Gradiente de marca: teal escuro → azul, em diagonal.

Cores funcionais (semânticas do domínio, não decorativas): verde para conformidade e regime A, âmbar para atenção e regime C, vermelho para bloqueio e regime D, amarelo para regime B.

**Logo:** marca hexagonal (selo/certificado) contendo uma polilinha com quatro vértices marcados (trajeto com checkpoints). Assinatura textual "Traxium" com a palavra "Compliance" como descritor. Existe em versão clara, escura e monocromática.

---

## 5. Quem usa — cinco superfícies distintas

O sistema **muda inteiramente** conforme quem entra. Não é um aplicativo único com abas escondidas por permissão: são superfícies com objetivos, objetos primários e escopos de dado diferentes. O espaço negativo de cada uma — o que ela deliberadamente **não** mostra — é requisito de conformidade, não simplificação.

| Superfície | Quem entra | Objeto primário | Escopo de dado |
| --- | --- | --- | --- |
| **A · Console Traxium** | A Traxium (fornecedora do software) | O cliente, não os dados do cliente | Todos os clientes |
| **B · Back-office** | Equipe de escritório da transportadora | Varia por papel: viagem, NC, subcontratado, dossiê | Uma transportadora, uma filial |
| **C · App de campo** | Motorista e inspetor de pátio | O checklist da viagem de hoje | Só as viagens atribuídas a ele |
| **D · Portal do subcontratado** | A empresa terceira | A própria empresa e seus certificados | Só ela |
| **E · Visão auditor** | Auditor externo | A amostra sorteada | Só a amostra, somente leitura |

### Os perfis do back-office (superfície B)

Cada um tem um objeto primário diferente e uma primeira pergunta diferente ao abrir o sistema.

| Perfil | Primeira pergunta que ele faz ao sistema | O que ele nunca faz |
| --- | --- | --- |
| **Gestor de qualidade / GMP+** | "O que está bloqueado e por quê?" | Não mexe em plano nem faturamento |
| **Despachante / tráfego** | "Quais viagens saem hoje e quais estão travadas?" | **Não aprova exceção**, não classifica produto |
| **Diretoria + Responsável Técnico** | "O que espera minha assinatura?" | Não opera o dia a dia |
| **Admin de subcontratados** | "Que certificado vence nos próximos 60 dias?" | Não cria viagem, não aprova exceção |
| **Auditor interno** | "Esta amostra se sustenta?" | Somente leitura + abrir NC |

Regra dura, vinda da operação real: **o motorista nunca libera uma exceção.** Ele registra a ocorrência e solicita análise. E o cliente embarcador libera apenas escopo comercial (atraso, troca de veículo) — nunca "perdoa" contaminação.

---

## 6. Dois escopos de produto

O sistema tem duas configurações de escopo, e o design precisa acomodar as duas:

- **MVP** — as telas que a diretriz define como entrega prioritária, organizadas pelos cinco pilares (Gatekeeper, Academy, IDTF Brasil, Control Tower, Network). É o que se demonstra.
- **Solução completa** — inclui as telas de segunda onda: EUDR (fazendas, lotes, gateway europeu), conformidade consolidada, repositório de documentos, linha do tempo de auditoria e ciclos de auditoria.

No escopo MVP, a tela inicial é a **Torre de Controle** — uma fila de decisões. No escopo completo, é um painel operacional consolidado.

---

## 7. As telas

### 7.1 Torre de Controle — tela inicial do MVP

**Objetivo:** ser a fila de trabalho de quem decide. Não é um painel de gráficos; é a lista do que precisa de decisão humana agora, ordenada pelo que dói mais e pelo que espera há mais tempo.

**Informação que vive aqui:**
- Quatro contagens de triagem: liberadas pelo motor (sem intervenção humana), liberadas por autoridade (exceção aprovada sobre bloqueio), aguardando análise (alerta pendente de justificativa) e bloqueadas.
- A **fila de decisões**, agrupada por severidade e ordenada por idade. Cada item traz: a viagem, o motivo da pendência em linguagem de causa e não de código, o **responsável pela análise** (qual nível de autoridade resolve aquilo), o prazo de carregamento, o **tempo em fila**, o **risco GMP+** derivado da decisão, as **seis evidências essenciais** com o que existe e o que falta, e as pendências de resposta em aberto com a idade real de cada uma.
- Itens marcados como **bloqueio técnico** — aqueles em que nenhuma autoridade libera. Não existe caminho de aprovação para eles; existe caminho de regularização.
- Onde a pendência está: itens em aberto agrupados pelos cinco pilares (viagens e liberação · qualificação de terceiros · competência do motorista · consulta e regimes · cadastro e ativos).
- Certificados que vencem nos próximos 60, 30 e 15 dias — o que vai travar em breve.

**A informação mais importante da tela:** a separação entre o que o motor liberou sozinho e o que exigiu assinatura humana. É essa razão que mede se o produto está funcionando.

### 7.2 Viagens (lista)

**Objetivo:** ver todas as operações de transporte e o veredito do motor sobre cada uma.

**Informação:** código da viagem, status operacional, produto, origem e destino, cliente, motorista, cavalo e implemento, regime de limpeza exigido, e a decisão do motor de regras. Filtros por status e por regime.

**Fluxo de criação:** ao abrir uma viagem nova, o despachante vincula cavalo, implemento, **compartimento específico**, motorista e produto. Motorista sem competência vigente **não é selecionável** — e a tela diz o motivo, não apenas desabilita.

### 7.3 Viagem (detalhe)

**Objetivo:** ser a página onde a decisão sobre uma carga é entendida e resolvida.

**Informação, em cinco recortes:**
1. **Resumo** — operação (produto, peso, origem, destino, cliente, datas), motorista e veículo, score de conformidade **calculado das checagens do motor** (uma linha por condição avaliada, com o que passou e o que falhou), documentos gerados e linha do tempo dos eventos.
2. **Sequenciamento T-3** — as três últimas cargas do compartimento, com data e produto, e o regime mínimo que a base IDTF exige a partir delas. Aqui aparece o **rótulo operacional** do produto (ver §8.4).
3. **Inspeção pré-carregamento** — resultado, itens verificados, fotos por ângulo, inspetor, data, geolocalização e assinatura.
4. **Evidências fotográficas** — as fotos com seus metadados de integridade.
5. **Rastreio** — posição, quando existe.

**Além disso:** os **registros obrigatórios** pendentes. Certas regras não bloqueiam a carga, mas exigem evidência anexada — a viagem **opera mas não fecha** enquanto faltar. E o bloqueio, quando existe, aparece com causa, ação sugerida e caminho para a solicitação de exceção.

### 7.4 Exceções e liberações

**Objetivo:** ser a fila de aprovação com trilha de autoridade. É onde o bloqueio vira decisão registrada — ou continua bloqueio.

**Informação:**
- A **matriz de autoridade** com os seis níveis, dizendo qual nível resolve cada tipo de pendência.
- A fila de exceções: viagem, motivo do bloqueio, regra que disparou, nível de autoridade requerido, quem solicitou, quando, evidências anexadas, observação técnica e status.

**Fluxo de liberação — o mais crítico do produto.** Quando uma autoridade libera manualmente, ela não escreve texto livre. Ela preenche um registro de **nove campos**:

1. **Motivo padronizado** — escolhido de uma **lista fechada específica daquela regra**. Cada regra tem seus motivos possíveis; regras de bloqueio técnico têm lista vazia, e a tela afirma que não existe motivo que as libere.
2. **Justificativa** — texto livre, como complemento do motivo, nunca em lugar dele.
3. **Evidências** anexadas.
4. **Responsável** — quem assinou.
5. **Data e hora**.
6. **Situação anterior** — capturada do estado real da viagem antes da decisão, não digitada.
7. **Situação posterior** — idem, depois.
8. **Impacto declarado** — lista fechada: sem impacto sobre a segurança do feed · risco residual aceito com monitoramento · e as demais gradações.
9. **Validade** — lista fechada: somente esta viagem · 72 horas · 7 dias · até a regularização do fato.

Se o registro não for completado, **a liberação é desfeita por inteiro**. Não existe liberação sem registro.

**Fluxo de rejeição:** manter o bloqueio é uma decisão registrada como qualquer outra, com responsável e motivo. Não é "não fazer nada".

**Fato importante para o design:** exceção aprovada libera a viagem, mas **o motor continua reprovando** — o fato não mudou. Os dois convivem e ambos ficam registrados. A tela precisa conseguir mostrar "liberada por autoridade, apesar de reprovada pelo motor" sem que isso pareça um erro.

### 7.5 Motor IDTF

**Objetivo:** operar a base normativa como motor de regra, não como PDF anexado.

**Três recortes de informação:**
1. **Base de produtos** — cada produto com dezoito campos: nome oficial e sua fonte, sinônimos regionais (com a região a que pertencem), nomes comerciais, nomes em inglês, erros de grafia comuns, estado físico, categoria, código HS, regime mínimo exigido, restrições, esquema de certificação, risco, se bloqueia uso em feed, data de atualização e responsável pela validação. Campo não preenchido aparece como *não informado* — em produto ainda em análise, a lacuna **é** a informação.
2. **Fila de classificação** — produtos cujo nome a base não reconheceu. Enquanto estiverem na fila, **travam o uso**. É a resposta ao problema real: o motorista escreve "casquinha" e ninguém sabe se é casca de soja ou farelo — e as duas exigem limpezas diferentes.
3. **Governança da base** — versão vigente, fonte oficial, periodicidade de revisão, quem aprova um sinônimo novo, licenciamento, política de divergência e o **histórico datado** de cada alteração, com responsável e fonte da decisão. Inclui recusas: quando um sinônimo é rejeitado por colidir com outro produto, a recusa fica registrada.

**Consulta de sequenciamento:** o usuário informa carga anterior e carga atual e recebe o veredito. A busca aceita todo o vocabulário brasileiro — sinônimo regional, nome comercial, nome em inglês, erro de digitação, com ou sem acento.

**Regra de dado:** um mesmo apelido nunca pode pertencer a dois produtos com regimes diferentes. É a colisão que mata a confiança na base.

### 7.6 Inspeção pré-carregamento

**Objetivo:** produzir o registro imutável de que o compartimento foi verificado antes de carregar.

**Informação:** o compartimento inspecionado com seu contexto T-3 visível durante a inspeção; o **mínimo obrigatório para liberar** (condições visuais em três estados — conforme, não conforme, não aplicável; fotos por ângulo obrigatório; assinatura) separado da **evidência complementar**; o resultado calculado ao vivo enquanto se preenche; e as inspeções recentes.

**Regra de fluxo:** o checklist é **dinâmico por tipo de implemento** — tanque pergunta sobre válvula e mangote, graneleiro pergunta sobre lona e bica. Um item marcado como **crítico** reprova a inspeção sozinho; um item não crítico deixa pendência, que é corrigível.

**Ângulos fotográficos obrigatórios:** visão geral interna, cantos e frestas, teto/lona/tampa, piso/fundo, bica de descarga e identificação externa da placa ou compartimento.

**Depois de enviada, a inspeção não se edita.** Correção é evento novo de retificação, preservando o original.

### 7.7 Limpezas

**Objetivo:** registrar higienização com a evidência que o regime exige — nem mais, nem menos.

**Informação:** compartimento, regime aplicado, método, local, executor, e então os campos que **variam por regime**: regime A pede quatro campos; regime D pede dezenove (produto químico, concentração, tempo de ação, temperatura, comprovante da estação de lavagem, fotos). O formulário não fecha enquanto o regime escolhido não estiver completo.

**Regra de produto:** carga anterior proibida **não tem botão de "lavado"**. Exige procedimento formal de liberação, inspeção qualificada e aprovação — não uma marcação.

### 7.8 Não conformidades e bloqueios

**Objetivo:** tratar o desvio até a raiz, não apenas anotá-lo.

**Informação por NC:** código, severidade (crítica / maior / menor), categoria, origem (viagem, compartimento, subcontratado, auditoria), descrição, e o ciclo completo: ação imediata → causa raiz → ação corretiva → responsável e prazo → verificação de eficácia. NC crítica se conecta à exceção correspondente.

### 7.9 Subcontratados

**Objetivo:** responder "esta empresa pode transportar hoje?" — e provar a resposta.

**Informação por empresa:** razão social, CNPJ, tipo de vínculo (sete tipos distintos), **estado de qualificação derivado** (ver §8.1), certificado GMP+ com número, certificadora, escopo (transporte de feed × afretamento), validade, sites cobertos e **status na base pública da certificadora**; acordo de qualidade com versão, vigência, assinante e dispositivo; treinamento comprovado; e os ativos e motoristas vinculados **com data de início e fim de cada vínculo**.

**Ponto que a diretriz enfatiza:** a validação confere mais que o CNPJ. Escopo errado bloqueia. Certificado vencido bloqueia. Status suspenso na base pública bloqueia — **mesmo com o acordo assinado**.

**Fluxos desta tela:**
- **Cadastro em lote por planilha** — o sistema detecta o separador, mostra a pré-visualização linha a linha e **detecta duplicidade antes de gravar**, tanto contra a base quanto dentro do próprio lote, comparando só os dígitos do documento (pega "Lima Logística" e "Lima Logistica" com o mesmo CNPJ). Empresa importada nasce **sem certificado comprovado**.
- **Operação em massa** — renovação coletiva de acordos, envio coletivo de treinamento, alertas em massa. Cada ação declara **quantas empresas realmente atinge** antes de executar. Acordo renovado volta **não assinado**; trilha atribuída **não vira competência**; alerta registra o disparo, não a entrega.
- **Arquivamento** — carimba a data e encerra os vínculos vigentes. **Não apaga.** Viagens e dossiês antigos continuam apontando para a empresa.
- **Consulta rápida** por CPF, CNPJ, placa ou telefone, respondendo de quem é o ativo hoje.

**Regra que sustenta o dossiê:** a empresa responsável por um ativo **depende da data**. Ler o vínculo de hoje para explicar uma viagem de maio reescreve o passado.

### 7.10 Onboarding público do transportador

**Objetivo:** cadastrar um transportador terceiro sem que ele precise de login, em seis passos, pelo celular, com o mínimo de atrito.

**Os seis passos:** quem é você (documento, CNH) → vínculo (qual dos sete tipos) → veículo (placas, implemento) → últimas três cargas → limpezas realizadas → regras de feed safety com aceite e assinatura.

**Fluxo de entrada:** o link chega por WhatsApp, por link direto ou por QR. Ao concluir, a empresa nasce no estado **Pré-cadastrado** — que não opera. A qualificação vem depois, dos fatos.

### 7.11 Academy

**Objetivo:** tornar a competência do motorista um requisito verificável de elegibilidade, não um certificado guardado numa pasta.

**Informação:** a **matriz de competência** — cada motorista contra cada trilha obrigatória, com o estado (vigente, a vencer, vencida, ausente) e o motivo da inelegibilidade quando existe; e o **catálogo de dez trilhas**, cada uma com duração, versão do conteúdo, validade em meses, nota mínima, número máximo de tentativas e o gatilho que a torna obrigatória.

As dez trilhas: introdução ao GMP+ para motoristas · responsabilidades no transporte de feed · histórico T-3 · cargas proibidas e incompatíveis · regimes de limpeza · inspeção do implemento · uso do checklist · comunicação de desvios e suspeita de contaminação · proteção da carga · boas práticas para subcontratados em condição Gatekeeper.

**O princípio central deste pilar:** motorista sem competência comprovada **não aparece como elegível** para a operação. A trava existe em dois lugares: na seleção do motorista ao criar a viagem, e como uma das condições que o motor avalia.

**Registro de cada conclusão:** nota obtida, número de tentativas, aceite de ciência, certificado interno e a **versão do conteúdo assistido**. Reprovar não gera competência. Treinamento acionado por risco — regime de limpeza novo, condição Gatekeeper, reincidência em problema de foto — aparece para o motorista no momento em que importa.

### 7.12 Ativos e frota

**Objetivo:** expor a cadeia cavalo → implemento → compartimento e deixar claro onde mora o histórico.

**Informação:** os três níveis, separados. Cavalos com placa, modelo, documentação. Implementos com tipo, número de compartimentos, certificação e proprietário (frota própria ou subcontratado). Compartimentos com identificador, capacidade, material construtivo e estado de conservação.

### 7.13 Compartimento (detalhe)

**Objetivo:** é a tela onde o auditor abre o histórico. Provavelmente a página de maior densidade probatória do sistema.

**Informação:** o **histórico T-3** com as cargas anteriores em ordem, cada uma com produto, data e viagem de origem; as **limpezas registradas** com regime e evidência; as **inspeções** realizadas; a ficha do implemento a que pertence; e a **integridade** — a verificação de que os registros não foram alterados.

### 7.14 Motoristas

**Objetivo:** o cadastro de quem dirige, próprio ou de terceiro.

**Informação:** nome, documento (mascarado por LGPD), tipo de vínculo, empresa a que está vinculado hoje, certificações, e a competência derivada das trilhas. Separação entre próprios, agregados e subcontratados.

### 7.15 Dossiê de auditoria

**Objetivo:** a entrega central do MVP — reconstruir a decisão sem depender de WhatsApp.

**Fluxo:** filtra por período, código ou placa, produto e status → seleciona as viagens da amostra → gera a reconstrução → exporta.

**Informação por viagem, em dezesseis blocos:** decisão do motor · autoridade que decidiu · registro da liberação com os nove campos · transportador · acordo de qualidade · motorista · treinamentos · cavalo · implemento e compartimento · produto e classificação IDTF · histórico T-3 · limpeza · inspeção · fotos · assinaturas · documentos.

**Duas regras estruturais:**
- **Bloco sem dado mostra a ausência** em vez de desaparecer. A lacuna é informação de auditoria.
- Os blocos são **encadeados por hash**: cada um carrega a impressão do anterior, de modo que a remoção ou alteração de qualquer um quebra a cadeia visivelmente. O dossiê é lacrado, não montado.

Exportável em planilha, documento e pacote de reconstrução.

### 7.16 Indicadores do MVP

**Objetivo:** medir o produto sem mentir sobre o que não é medido.

**Informação:** quinze indicadores definidos pela diretriz. **Onze** são calculados no momento da consulta, cada um declarando de onde o número sai: operações liberadas automaticamente · viagens com T-3 completo · motoristas com treinamento vigente · subcontratados aptos · viagens com evidência fotográfica completa · inspeções aprovadas · bloqueios técnicos abertos · idade média da fila de exceções · liberações com registro completo · cadastros duplicados · subcontratados reincidentes.

**Quatro** aparecem explicitamente como **não medidos**, cada um dizendo o que precisaria ser instrumentado: tempo de cadastro de um transportador, tempo de preenchimento do checklist, percentual de fotos rejeitadas e tempo para gerar um dossiê. Eles ficam separados dos demais de propósito.

A cobertura ("onze de quinze") é contada, não afirmada.

### 7.17 Configurações

**Objetivo:** parametrizar a operação, a equipe e o motor.

**Informação, em recortes:**
- **Organização** — dados da transportadora, filiais, escopos de certificação.
- **Equipe** e a matriz papel × permissão.
- **Motor de regras** — a classe de cada uma das doze regras é configurável, **com piso**: as sete que a diretriz define como bloqueio técnico aparecem travadas, com o motivo da trava. Configurável não significa negociável.
- **LGPD** — sete tipos de dado, cada um com prazo de retenção, base legal, fundamento e destino ao fim do prazo; a política de inativação, onde **cada regra declara o que é preservado**; e os consentimentos com sua base legal. O efeito de revogar um consentimento é mostrado explicitamente: evidência de segurança de feed se apoia em obrigação regulatória, então revogar **não** a derruba — e a tela afirma isso em vez de esconder.
- **Notificações**, **segurança**, **integrações**, **tokens de API** e **faturamento**.

### 7.18 App de campo (motorista e inspetor)

**Objetivo:** deixar o motorista cumprir a obrigação em três a cinco minutos, em Android de entrada, com sinal instável, aparelho às vezes compartilhado e baixo letramento digital. Uma ação principal por vez.

**As telas do app:** entrada → minhas viagens → a viagem de hoje → checklist → câmera → assinatura → bloqueio explicativo → fila de sincronização → pontos de lavagem.

**Informação e regras que definem o app:**
- **Offline-first é requisito de conformidade, não recurso.** O motorista fica sem sinal exatamente no momento crítico. Ele precisa abrir, preencher, fotografar, assinar e salvar sem internet.
- **Quatro estados de sincronização, sempre visíveis:** salvo no aparelho → sincronizando → sincronizado com sucesso → divergente. Com contador de pendências. Depois de sincronizado, trava a edição.
- **Antifraude na captura:** foto tirada pela câmera do app, com a galeria bloqueada para evidência crítica (ou marcada como importada); hash do arquivo, geolocalização, data e hora do dispositivo, marca d'água automática.
- **A tela de bloqueio explica**: por que a carga não pode seguir, o que fazer para resolver, e onde estão os pontos de lavagem próximos. Bloqueio sem caminho de saída é bloqueio que vira ligação telefônica.
- **Formulário contingencial**: em queda sistêmica, existe um caminho aprovado pela qualidade, com lançamento posterior e justificativa — nunca adesão voluntária.

O **inspetor de pátio** usa a mesma superfície, em tablet, com objeto primário diferente: os compartimentos aguardando inspeção à sua frente.

### 7.19 Telas de segunda onda

Existem no produto e no modelo de dados, mas fora do escopo prioritário. A própria diretriz manda não desviar esforço para elas agora.

| Tela | Objetivo | Informação principal |
| --- | --- | --- |
| **Conformidade** | Score consolidado GMP+ derivado do motor | Seis dimensões do sistema de gestão, checagem a checagem, ranking por motorista e as ações de maior impacto |
| **Documentos** | Repositório normativo | Certificados, políticas, procedimentos, relatórios, material de treinamento, com vigência |
| **Auditoria** | O ciclo de auditoria como consulta contínua, não arrumação de véspera | Auditorias programadas, histórico e plano de preparação |
| **Atividade** | Trilha de eventos do sistema | Cada ação com data, ator e conteúdo, filtrável por tipo, severidade e período |
| **Fazendas e polígonos** | Guardar a evidência de origem EUDR | Produtor, CAR, município, polígono, fonte de recebimento, alertas de supressão |
| **Lotes e DDS** | Agregar origens em lote e declarar | Lote → sublotes/origens (uma remessa pode ter N fazendas), cenário de mistura, status da declaração |
| **Gateway europeu** | Submissão da declaração ao portal da Comissão | Configuração, esquemas, eventos de retorno |

Princípio do bloco EUDR: a transportadora é **guardiã** da evidência recebida, raramente dona do polígono. Separar dado de origem de dado de transporte.

---

## 8. Os vocabulários de estado

Cinco famílias de estado percorrem o produto inteiro. Elas precisam ser legíveis e distinguíveis, porque a leitura errada de um estado é uma carga liberada indevidamente.

### 8.1 Estado de qualificação da empresa — nove estados

Apto · Apto com restrição · Pré-cadastrado · Pendente documental · Pendente de treinamento · Pendente de inspeção · Bloqueado · Suspenso · Inativo.

Apenas os dois primeiros operam. Todos são **derivados** — do certificado, da base pública, do acordo e do treinamento. Assinar o acordo não torna apta uma empresa que a base pública diz estar suspensa.

### 8.2 Triagem da viagem — três níveis, quatro resultados

Verde (liberada) · amarelo (aguardando análise) · vermelho (bloqueada). O verde se subdivide no que mais importa: **liberada pelo motor** (nunca chegou à mesa de ninguém) × **liberada por autoridade** (alguém assinou por cima de um bloqueio).

### 8.3 Classe da regra — quatro classes com efeito distinto

| Classe | Efeito |
| --- | --- |
| **Bloqueio** | Impede o carregamento. Não é aviso ignorável. |
| **Alerta** | Permite seguir mediante justificativa registrada. |
| **Registro** | Não impede carregar, mas **impede concluir** a viagem até a evidência ser anexada. |
| **Informação** | Registra sem interferir. |

As doze regras avaliadas pelo motor: histórico T-3 incompleto · carga anterior proibida · limpeza incompatível com o regime exigido · checklist reprovado · certificado vencido ou de escopo incompatível · subcontratado não apto · acordo de qualidade não vigente · competência do motorista · produto não reconhecido · fotos mínimas ausentes · certificação a vencer · inspeção pendente de sincronização.

A decisão final é a **classe mais severa entre as falhas**, e a mensagem sempre traz causa **e** ação.

### 8.4 Resultado da consulta IDTF — nove rótulos operacionais

Liberado · Liberado após limpeza A · Liberado após limpeza B · Liberado após limpeza C · Liberado após limpeza D · Necessita procedimento especial · Carga anterior proibida · Produto não identificado · Aguardando análise da Qualidade.

Cada rótulo vem acompanhado do motivo em uma frase e do próximo passo — exceto "Liberado", que não tem próximo passo.

### 8.5 Hierarquia de autoridade — seis níveis

| Nível | Resolve |
| --- | --- |
| **Técnico** | **Ninguém.** É o nível de autoridade de nenhuma pessoa. Contaminação não se aprova; se regulariza. |
| **Inspetor** | Condição física do equipamento: checklist reprovado, fotos ausentes |
| **Tráfego** | Pendência simples: certificação a vencer, sincronização pendente |
| **Gestor** | Pendência corrigível mediante evidência da correção |
| **Diretoria + Responsável Técnico** | Impacto contratual, risco residual aceito, terceiro emergencial |
| **Cliente** | Apenas escopo comercial. Nunca contaminação. |

A autoridade **escala para cima, nunca para baixo**: quem pode mais resolve o que o nível abaixo resolveria. E **não existe um botão genérico de "aprovar mesmo assim"** em lugar nenhum do produto — a ausência dele é uma decisão de produto, não um esquecimento.

---

## 9. Os fluxos ponta a ponta

### 9.1 Fluxo mestre da viagem — onze passos

| # | Passo | Quem | Onde | Rede | Estado resultante |
| --- | --- | --- | --- | :-: | --- |
| 1 | Pedido de frete | Cliente → despachante | escritório | on | Agendada |
| 2 | Seleção de veículo, **compartimento** e motorista | Despachante | escritório | on | Ativos vinculados |
| 3 | Verificação documental (habilitação, registro, certificado, treinamento) | Despachante + motor | escritório | on | Certificados validados |
| 4 | **Verificação do T-3 do compartimento** | Motor | — | on | Regime mínimo calculado |
| 5 | Limpeza no regime exigido | Motorista, lavador ou estação | pátio, posto ou fazenda | **off** | Evidência anexada |
| 6 | Inspeção pré-carregamento | Motorista ou inspetor | pátio | **off** | Registro de inspeção |
| 7 | **Decisão de liberação** | Motor | — | on | **Liberada** ou **Bloqueada** |
| 8 | Carregamento | Armazém ou terminal | doca | off | Em carregamento |
| 9 | Transporte | Motorista | rodovia | intermitente | Em trânsito |
| 10 | Descarga | Destino | destino | on | Descarregando |
| 11 | Fechamento | Sistema | — | on | Concluída |

**O passo 11 é estruturalmente crítico:** ao concluir, a carga atual vira histórico do compartimento. É assim que o T-3 se mantém vivo entre viagens. Uma viagem que não fecha corretamente contamina a decisão da próxima.

### 9.2 Bloqueio → liberação (ou manutenção do bloqueio)

```
Motor bloqueia
  └─ o bloqueio é técnico?
       ├─ SIM → não existe caminho de aprovação.
       │         Caminho é regularizar o fato (executar a limpeza,
       │         evidenciar, reavaliar). Nenhuma assinatura resolve.
       └─ NÃO → motorista registra ocorrência + evidência
                 └─ roteia para o nível de autoridade correto
                      ├─ APROVA → preenche o registro de 9 campos
                      │             ├─ registro completo → viagem liberada
                      │             │    (e o motor continua reprovando —
                      │             │     os dois ficam registrados)
                      │             └─ registro incompleto → liberação desfeita
                      └─ MANTÉM BLOQUEIO → decisão registrada com
                                            responsável e motivo
```

Tempo real da operação, para calibrar expectativa: 15 minutos a 4 horas em caso simples; 1 a 2 dias em caso crítico. A idade do item na fila é informação de primeira classe.

### 9.3 Offline → sincronização → divergência

Preenche sem sinal, com carimbo local → entra na fila visível como "salvo no aparelho" → volta o sinal → sincroniza → trava a edição. Se o servidor discordar do carimbo local, abre divergência — que é um estado próprio, não um erro silencioso.

### 9.4 Qualificação de um terceiro

Convite (link, WhatsApp ou QR) → onboarding público em seis passos → nasce **Pré-cadastrado** → anexa certificado → o sistema confere escopo, validade, site coberto e status na base pública → assina o acordo de qualidade → conclui o treinamento → **o estado se recalcula** para Apto. Alertas em 60, 30 e 15 dias antes do vencimento; no vencimento, bloqueia sozinho.

### 9.5 Conclusão da viagem

A viagem só fecha quando: não há bloqueio ativo **e** não há registro obrigatório pendente. As duas travas dão mensagens diferentes, porque exigem ações diferentes de pessoas diferentes.

### 9.6 Montagem do dossiê

Filtra a amostra → seleciona as viagens → o sistema monta os dezesseis blocos de cada uma, encadeados → exporta. Critério de aceite: gerar uma amostra de três a seis meses atrás em minutos, não em dias.

---

## 10. Imutabilidade — o que nunca é sobrescrito

Depois de enviado e sincronizado, este conjunto é imutável: viagem, placa do implemento e compartimento, motorista e executor, produto atual e carga anterior, regime exigido e limpeza declarada, fotos e seus metadados, data, hora e geolocalização, resultado do checklist, assinaturas, responsável pela liberação, o certificado do subcontratado **como estava no momento da viagem**, e os dados de origem usados na decisão.

Correção é **evento novo de retificação** — com motivo, responsável e data —, preservando o original. Nunca apagar o passado. Da mesma forma, mudar uma regra hoje **não altera decisões históricas**: cada decisão grava a versão da base que a produziu.

---

## 11. Prioridade das telas

Se for preciso escolher onde investir primeiro:

**Primeiro time — o caminho crítico da operação:**
Torre de Controle · Viagem (detalhe) · Exceções e liberações · Compartimento (detalhe) · App de campo · Dossiê.

Essas seis carregam o teste do §1. Se elas funcionarem, o produto funciona.

**Segundo time — o que alimenta o primeiro:**
Motor IDTF · Subcontratados · Inspeção pré-carregamento · Limpezas · Academy · Viagens (lista) · Ativos e frota.

**Terceiro time — o que sustenta e mede:**
Indicadores · Não conformidades · Configurações · Motoristas · Onboarding público.

**Segunda onda:** conformidade, documentos, auditoria, atividade e todo o bloco europeu.

---

## 12. O que este produto não é

Delimitação útil, porque cada uma dessas confusões já apareceu na descoberta:

- **Não é um repositório de documentos.** Documento é insumo da decisão, não o produto.
- **Não é rastreamento em tempo real.** Telemetria é evolução, não MVP.
- **Não é um TMS.** Não gerencia frete, tabela ou pagamento.
- **Não é um checklist digitalizado.** Um formulário que não bloqueia nada não muda a operação.
- **Não é um painel de gráficos.** A tela principal é uma fila de decisões. Gráfico que ninguém usa para decidir é ruído.
