# Inventário do protótipo: mapa do site

Levantamento de 08/10/2026 sobre os 21 arquivos `.dc.html` de `SaaS moderno estilo Dribbble/` e o `prototype-shell.js`. O detalhe de cada tela (blocos, campos, ações, modais, estados, entidades, regras e observações) está em `inventario/<tela>.md`. Este arquivo reúne a visão de conjunto: como as telas se organizam, como se ligam e o que se repete entre elas.

O inventário é factual. O julgamento sobre manter, simplificar, fundir, cortar ou acrescentar fica para `03-diagnostico.md`.

## 1. Superfícies e navegação

O protótipo tem quatro superfícies. Só o back-office tem navegação comum.

| Superfície | Telas | Como se navega |
| --- | --- | --- |
| Back-office da transportadora | 17 telas com sidebar canônica | Sidebar de 18 itens, igual em todas |
| Console Traxium | 1 tela | Sidebar própria; leva à Torre e ao Motor IDTF |
| App de campo | 1 arquivo com 12 telas Android lado a lado | Nenhuma tela leva a outra |
| Onboarding público | 1 arquivo com 8 quadros de celular | Nenhum botão de avanço funciona |

A Torre de Controle v1 (`Torre de Controle.dc.html`) é histórico: três direções visuais com os mesmos dados, sem navegação.

### Sidebar do back-office

| Seção | Item | Badge fixo | Arquivo |
| --- | --- | --- | --- |
| Topo | Torre de Controle | 7 | Torre de Controle v2 |
| Operação | Viagens | | Viagens |
| Operação | Exceções e liberações | 5 | Excecoes |
| Operação | Inspeções | 3 | Inspecoes |
| Operação | Limpezas | 3 | Limpezas |
| Pilares | Motor IDTF | | Motor IDTF |
| Pilares | Subcontratados | | Subcontratados |
| Pilares | Motoristas | 42 | Motoristas |
| Pilares | Acessos externos | 2 | Acessos Externos |
| Pilares | Academy | | Academy |
| Pilares | Ativos e frota | | Ativos e Frota |
| Prova | Dossiê de auditoria | | Dossie |
| Prova | Indicadores | 11/15 | Indicadores |
| Prova | Não conformidades | 4 | Nao Conformidades |
| Rodapé | Configurações | | Configuracoes |
| Rodapé | Onboarding público | 6 passos | Onboarding Publico |
| Rodapé | Protótipo mobile | 12 telas | App de Campo |

Viagem Detalhe e Compartimento Detalhe não estão na sidebar; abrem por link de contexto. Onboarding público e Protótipo mobile estão na sidebar como atalho de demonstração, embora sejam de outras superfícies.

### Ligações de contexto (fora da sidebar)

| De | Para | Observação |
| --- | --- | --- |
| Torre de Controle | Viagem Detalhe | Sempre abre VG-2490 |
| Viagens | Viagem Detalhe | Toda linha abre VG-2490 |
| Exceções | Viagem Detalhe | Idem |
| Viagem Detalhe | Compartimento Detalhe, Exceções, Viagens | Compartimento sempre C1 / SQT 9E18 |
| Ativos e frota | Compartimento Detalhe | Qualquer compartimento abre C1 / SQT 9E18 |
| Compartimento Detalhe | Ativos e frota, Viagem Detalhe | Breadcrumb e T-3 |
| Inspeções | Compartimento Detalhe, Viagem Detalhe, Dossiê | |
| Limpezas | Compartimento Detalhe, Viagem Detalhe, Dossiê | |
| Motor IDTF | Viagens | |
| Motoristas | Academy | |
| Não conformidades | Exceções | NC crítica leva ao bloqueio |
| Configurações | Exceções | "Ver a matriz de autoridade" |
| Console Traxium | Torre de Controle, Motor IDTF | |

Não há link de contexto para Subcontratados, Motoristas, Acessos externos, Academy (exceto a partir de Motoristas), Indicadores ou Não conformidades vindo das telas onde esses objetos aparecem. Os links abrem a tela, não o registro.

## 2. Telas em números

Contagens aproximadas, tiradas dos inventários. "Mudam estado" são as ações cujo efeito aparece na tela; as demais terminam em toast.

| Tela | Blocos | Ações | Modais e drawers próprios | Ações que mudam estado | Entidades principais |
| --- | --- | --- | --- | --- | --- |
| Torre de Controle | 7 | 22 | 2 modais, 1 drawer | filial, período, expandir item | viagem, compartimento, subcontratado, certificado |
| Viagens | 6 | 19 | 1 modal (Nova viagem) | filtros de status, criar viagem (sempre VG-2497) | viagem, produto, conjunto, motorista |
| Viagem Detalhe | 21 | 27 | 9 modais | cancelar, anexar comprovante, avançar ciclo | viagem, regra, exceção, NC, retificação |
| Exceções e liberações | 7 | 16 | 5 modais | registrar liberação, manter bloqueio | pedido de exceção, registro de liberação |
| Motor IDTF | 10 | 28 | 3 modais, 1 drawer | consulta, cadastrar produto no catálogo | produto, sinônimo, matriz, fila técnica, versão |
| Subcontratados | 10 | 37 | 5 modais, 1 drawer | filtro do funil | subcontratado, certificado, acordo, convite |
| Onboarding público | 8 quadros | 11 | nenhum | nenhuma | transportador, veículo, T-3, aceite |
| Acessos externos | 12 | 22 | 2 modais | revogar | acesso externo, convite, superfície |
| Motoristas | 11 | 20 | 2 modais, 1 drawer | cadastrar motorista, alterar empresa | motorista, vínculo, CNH, trilha |
| Academy | 8 | 20 | 1 modal, 1 drawer | nenhuma de escrita | trilha, competência, regra de liberação |
| Ativos e frota | 8 | 16 | 6 modais | reagendar, renovar, trocar vínculo, novo ativo | conjunto, implemento, compartimento, laudo |
| Compartimento Detalhe | 9 | 12 | 1 modal, 1 drawer | registrar limpeza retroativa | compartimento, carga, limpeza, inspeção, hash |
| Inspeções | 8 | 16 | 2 modais, 1 drawer | trocar tipo de checklist | inspeção, ângulo, checklist por tipo |
| Limpezas | 9 | 25 | 2 modais, 1 drawer | nenhuma de escrita | limpeza, regime, estação, plano de regularização |
| Não conformidades | 8 | 20 | 2 modais | expandir; abrir NC grava mas não aparece | NC, ciclo CAPA, reincidência |
| Dossiê | 6 | 15 | 2 modais | fases da reconstrução, abas | amostra, bloco, hash, link do auditor |
| Indicadores | 7 | 13 | 1 modal, 1 drawer | filtro de chips | indicador medido e não medido |
| Configurações | 5 seções | 17 | 2 modais | classe das 5 regras configuráveis | regra, LGPD, papel, filial, integração |
| Console Traxium | 8 | 20 | 1 drawer | ligar e desligar módulos | cliente, faixa, módulo, usuário admin |
| App de campo | 12 telas | cerca de 30 | 2 sheets | checklist e assinatura dentro da tela | viagem, checklist, foto, sincronização, lavagem |

Toda tela do back-office repete os quatro modais de perfil (Meu perfil, Preferências, Papel ativo, Sair).

## 3. Fatos transversais

São padrões que aparecem em várias telas e que o diagnóstico precisa tratar em conjunto, não tela a tela.

### 3.1 O registro aberto é sempre o mesmo
Toda viagem abre VG-2490; todo compartimento abre C1 / SQT 9E18; o dossiê reconstrói sempre as mesmas três viagens com os mesmos 16 blocos; o drawer de subcontratado tem conteúdo próprio só para a Lima Logística; o drawer de trilha da Academy mostra o conteúdo da trilha 05 para qualquer trilha. Isso é limite do protótipo, mas esconde se a tela de detalhe funciona para casos diferentes (viagem liberada, viagem sem T-3, tanque com vários compartimentos).

### 3.2 Boa parte das ações de escrita termina em toast
Exemplos: adicionar, convidar, suspender, arquivar, vincular e desvincular subcontratado; trocar veículo, abrir NC, retificar e editar na viagem; registrar limpeza; avançar etapa de NC; nova trilha, nova versão e arquivar trilha; gerar token; todas as exportações. A importação de subcontratados chama um método inexistente e não abre. Para o diagnóstico, isso indica fluxo desenhado até o botão, sem o resultado: onde o registro aparece depois, que estado assume, quem é avisado.

### 3.3 Filtros globais trocam o rótulo, não os dados
Filial e período na Torre, Indicadores, Inspeções, Limpezas e Exceções mostram "recalculado" e mantêm os números. Visões salvas de Viagens ("Travadas hoje", "Carregam em 2h", "Regime C e D") também não filtram.

### 3.4 Números divergem entre telas
Bloqueios técnicos abertos: 3 em Indicadores, 1 na Torre. Idade média da fila: 1h 48min em Indicadores, 1h 09min em Exceções. Motoristas: 46 em Academy, 42 no badge, 7 na lista da Academy, 8 cards em Motoristas. Base IDTF: 1.240 produtos e 8.900 sinônimos no Motor, 1.284 e 3.911 no Console. KPIs de Inspeções, Limpezas, Ativos e Motoristas são fixos e não batem com as listas abaixo deles. O funil de Subcontratados soma 212 para 10 linhas.

### 3.5 As mesmas pessoas e coisas mudam de identidade
João Bortolini aparece com quatro identidades entre Subcontratados, Motoristas, Acessos e Onboarding. QAS 7C31 é placa de cavalo em Ativos e identifica compartimento em Inspeções e Limpezas. O par milho para farelo de soja exige regime B no app e A em Limpezas. Posto Trevo tem cidade e regime máximo diferentes no app e em Limpezas. A empresa que convida é Cerrado Cargas no onboarding e Transrural Log na mensagem de Acessos. A Lima Logística aparece como elegível no app e como suspensa em Subcontratados e NC-0409.

### 3.6 Entrada de terceiros e acesso
Subcontratados tem três portas (cadastro por CNPJ com convite opcional ao portal; convite por nome e telefone com link de 7 dias; importação, que não abre). Onboarding público termina em Pré-cadastrado. Motoristas cria motorista em Pendente sem empresa nem convite. Acessos externos se apresenta como destino de todos os convites, com convite por papel, validade de 14 dias e canais diferentes dos de Subcontratados, e diz que Motoristas gera convites de app, o que Motoristas não faz. Nem Subcontratados nem Motoristas mostram se o registro tem acesso ou convite pendente.

### 3.7 Perfil e papéis
Há duas versões de Meu perfil e Preferências (das telas e do shell). Papel ativo não persiste entre telas e, em Acessos externos, não abre. Os papéis da matriz de Configurações não são os mesmos do modal Papel ativo. O nível de autoridade 4 aparece com três grafias. Exceções registra toda liberação como Diretoria + Responsável Técnico, enquanto o perfil diz Gestor nível 3.

### 3.8 Listas e paginação
Paginam: Viagens (8 por página), Subcontratados (7), Acessos externos (5), Limpezas. Não paginam: Motoristas (8 cards), Academy (7 linhas), Inspeções, Não conformidades, Exceções, Torre. A ordem prometida em Não conformidades ("severidade, prazo, idade") não é a ordem exibida.

### 3.9 Motor IDTF depois do commit 5161acc
O cartão de resultado já tem só "Ficha completa" e um menu "⋯"; "Editar matriz" e "Classificar" saíram do cartão. Existem dois caminhos de criação de produto com efeitos diferentes (o do catálogo grava; o da fila e o de aprovação só avisam) e os dois descrevem a regra em direções opostas.

### 3.10 App de campo e onboarding sem caminho
Nenhuma das 12 telas do app leva a outra; "Começar checklist", "Continuar", "Abrir câmera" e as setas de voltar não fazem nada. No onboarding, nenhum botão de avanço funciona, o passo 2 promete perguntas que não aparecem, e o cabeçalho fala em seis passos para oito quadros.
