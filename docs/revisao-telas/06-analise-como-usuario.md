# Análise como usuário

Registro de 08/10/2026. Última passada antes da construção: o fluxo da arquitetura proposta (`04-arquitetura-proposta.md`) percorrido do ponto de vista de cada usuário de `02-usuarios-e-trabalhos.md`, confrontado com a auditoria real (`evidencia-auditoria-real.md`), o resumo de mercado do Rafael e a pesquisa sobre o Quali-e. O objetivo é verificar se o fluxo faz sentido e se é fácil, e corrigir o plano antes de construir.

## 1. O afretador da filial em dia de safra

Contexto: filial de Sorriso, 15 a 25 viagens afretadas por dia, trabalha no computador e no WhatsApp ao mesmo tempo, fala com o TAC por mensagem. A ordem de carregamento sai do TMS (Atua). O carregamento é no armazém do cliente, a quilômetros da filial.

| Passo | Como está no plano | O que o afretador vive | Ajuste |
| --- | --- | --- | --- |
| Criar a viagem | Importa o PDF da ordem ou digita | Já tem a ordem do TMS; digitar de novo é retrabalho | Mantém o PDF como caminho principal; digitação mínima (produto, cliente, filial, data) como alternativa |
| Quem carrega | Digita placa ou CPF; reaproveita cadastro | O TAC chega por grupo de WhatsApp ou plataforma de frete; o afretador tem CPF e placas na conversa | Mantém. Cadastro novo pede só nome, telefone e placas; o resto vem pelo link |
| Mandar o link | WhatsApp ao motorista | É o gesto que ele já faz hoje | Botão "Copiar mensagem" com o texto pronto, além de enviar; o afretador manda do próprio WhatsApp, que o TAC reconhece |
| Esperar | Linha da viagem mostra respostas | Precisa saber em que pé está sem ligar | Estados visíveis na linha: enviado, aberto, em preenchimento, enviado pelo motorista, com hora |
| Verificar o compartimento | Afretador avalia no celular, no pátio | **Ele não está no pátio.** A auditoria fala em "verificação de conformidade online"; no Quali-e o motorista preenche o checklist e a agência confere | **Corrigido:** o motorista responde o checklist e manda as fotos pelo link; o afretador confere na mesa e aprova ou devolve com motivo |
| Liberar | Viagem "pronta para assegurar" e texto da declaração | Quem emite o CT-e pode ser outra pessoa, no TMS | Mantém o texto para copiar; o número do CT-e não é exigido para liberar |
| Informar CT-e e NF | Digitação ou integração | Voltar viagem por viagem para digitar número é o retrabalho que ele abandona | **Corrigido:** conciliação em lote: importar a planilha ou os XML de CT-e do período e casar por placa e data; viagens sem CT-e aparecem como pendência de registro para a qualidade, não para o afretador |
| Concluir | Ação de concluir após descarga | Ninguém conclui viagem manualmente em sistema de apoio | **Corrigido:** conclusão automática quando o CT-e é conciliado e a data de descarga passa |

Resultado: o trabalho diário do afretador cai para quatro gestos por viagem (criar a partir da ordem, informar placas, mandar o link, conferir o que voltou). O que não é dele (CT-e, conclusão) sai do caminho.

## 2. O motorista TAC

Contexto: celular Android simples, sinal fraco no armazém, recebe dezenas de mensagens, nunca ouviu falar em "compartimento" nem em "T-3".

| Passo | Risco | Como o link resolve |
| --- | --- | --- |
| Abrir o link | Mensagem de número desconhecido parece golpe | A mensagem sai do WhatsApp do afretador, com o nome da transportadora, o produto e a data da carga |
| Identificar-se | Senha e cadastro afastam | Confirma com os 3 primeiros dígitos do CPF; nada de senha |
| Documentos | Pedir CNH, CRLV e RNTRC toda vez cansa | Só pede o que falta ou venceu; foto pela câmera |
| Três últimas cargas | "Compartimento" não é palavra dele | Pergunta por placa: "O que a carreta QWM 4H57 carregou nas últimas 3 viagens?", com busca que entende "casquinha", "farelo", "adubo"; atalho "as outras carretas carregaram o mesmo" |
| Checklist e fotos | Formulário longo na fila do armazém | Cinco itens (lona, correntes, cintas, carroceria, interior), cada um com uma foto guiada; menos de 5 minutos |
| Manual | Ninguém lê PDF de 4 páginas | Cinco cartões curtos (limpeza, cargas proibidas, o que fazer se algo der errado), "Li e entendi" no fim |
| Assinar | Assinatura desenhada é estranha | Assinatura com o dedo, com nome e data já preenchidos |
| Sem sinal | Perde o que fez | Salva no aparelho e envia quando voltar o sinal, com aviso claro |

TAC que volta numa segunda viagem só responde as cargas, as fotos e assina. A meta é ele terminar em 3 minutos na segunda vez.

## 3. A responsável da qualidade

Contexto: matriz, acompanha quatro filiais, prepara a auditoria anual e a interna, é cobrada pela direção.

| Pergunta dela | Onde responde | Ajuste |
| --- | --- | --- |
| "As viagens asseguradas estão com registro completo?" | Hoje, com filial "todas" | **Corrigido:** em "todas", Hoje deixa de ser a fila do dia e mostra pendências de registro do período (sem termo, sem fotos aprovadas, sem CT-e conciliado), vencimentos e a prontidão para auditoria |
| "Quais documentos vencem?" | Hoje e Transportadores | Mantém, com 60, 30 e 15 dias |
| "Se o auditor pedir a placa X?" | Auditoria | Mantém a busca por placa, CT-e, NF ou período |
| "Preciso registrar a simulação de rastreabilidade" (a empresa auditada mantém um formulário para isso) | não estava previsto | **Acrescentado:** em Auditoria, "Registrar simulação": a busca feita fica registrada com data, quem fez, o que foi pedido e quanto tempo levou, pronta para mostrar ao auditor |
| "Comuniquei o organismo certificador sobre o gatekeeper?" | Cadastros, Filiais | Mantém, com a data da comunicação por filial |

## 4. Os demais

- **Despachante da frota própria:** usa a mesma criação de viagem, escolhendo conjunto no escopo; o link vai ao motorista empregado com o mesmo checklist. Sem tela própria. Faz sentido.
- **Direção:** abre Hoje em "todas" uma vez por semana. Não precisa de tela de indicadores na v1.
- **Auditor:** não usa o sistema; vê a qualidade operar a Auditoria e recebe a exportação. Faz sentido com o plano de auditoria (rastreabilidade e protocolos gatekeeper verificados com alguém da empresa).
- **Consultoria:** não tem tela; recebe exportação de ocorrências e treinamentos. Pode virar canal comercial depois.

## 5. O que pareceu demais e sai do plano da v1

- "Hoje no celular" com inspeção no pátio: substituído pela conferência das fotos na mesa. O afretador ainda pode abrir Hoje no celular, mas não há tela de inspeção presencial na v1.
- Ação manual de concluir viagem.
- Digitação de CT-e viagem a viagem.

## 6. O que continua sem resposta e pesa no fluxo

1. Se o motorista próprio também responde checklist pelo link ou se a frota própria tem outra rotina (o relatório cita checklist de viagem do motorista para manutenção e checklist do compartimento antes de cada carga; o plano assume o mesmo link).
2. Se as fotos são exigidas sempre ou só em alguns clientes (o relatório lista itens avaliados, não fotos).
3. Quem, na filial, envia o link: o afretador ou um assistente. O plano assume o afretador.

## 7. Veredito

Com as correções acima, o fluxo principal tem começo (a ordem), meio (o link e a conferência) e fim (a declaração no CT-e e a conciliação), cada usuário faz só o que é dele, e a prova para o auditor sai como subproduto do trabalho diário, sem montagem de pasta. É o fluxo que será construído.
