# Fluxo do motorista no Link da Viagem

Atualizado em 17/11/2026. Descreve o fluxo mínimo do motorista como está no protótipo (`/link?id=VG-...` e, dentro de um celular, `/mobile`). Serve de especificação para o desenvolvimento.

Código de referência: `src/telas/LinkDaViagem.jsx` (tela e regras), `src/app/link/link.css` (estilo), `src/app/(painel)/mobile/` (página de demonstração). Os eventos são aplicados em `src/lib/tx/tx-dados.js` (`aplicar`, casos `link*`).

## 1. Princípios

1. Um link por viagem, enviado pelo WhatsApp. Abre no navegador do celular, sem login e sem instalar nada.
2. Uma ação principal por tela, no rodapé fixo. Quando a etapa não está completa, o botão fica apagado e diz o que falta ("Falta 1 item", "Digite os 3 números do CPF"). Tocar nele rola até o que falta e realça o campo.
3. Cada etapa concluída vira um evento no back-end, com a hora. Nada se apaga: correção é um evento novo.
4. Alvos de toque com pelo menos 44 px; campos com 48 px de altura e fonte de 16 px (o iOS não amplia a página). Escala de texto: 12, 14, 16, 20, 24.
5. Texto em português, direto, na segunda pessoa ("você").

## 2. Ordem das etapas

| # | Etapa | Quando aparece | Obrigatória para concluir o link |
|---|-------|----------------|----------------------------------|
| 0 | Capa | sempre | não (só abre) |
| 1 | Quem é você (CPF e placas) | sempre | sim |
| 2 | Documentos | só se falta ou venceu CNH, RNTRC ou CRLV | não: pode ficar para depois, mas a carga segue bloqueada |
| 3 | Últimas cargas (T-3) | não aparece para frota própria | sim |
| 4 | Checklist com fotos | sempre | sim |
| 5 | Manual | sempre | sim |
| 6 | Termo | só para transportador sem certificado GMP+ (gatekeeper) | sim |
| 7 | Fim | sempre | não |

O link conta como concluído quando o termo está assinado (gatekeeper) ou quando checklist e manual estão feitos (frota própria e transportador certificado). Regra em `linkEstado`.

A etapa de documentos continua na lista depois de enviada, para a contagem "Etapa 2 de 5" não mudar no meio do caminho.

## 3. Retomar de onde parou

- O celular guarda um rascunho por viagem (`tx-v2-rascunho-<id>`): etapa aberta, CPF digitado, cargas, respostas, fotos ainda não enviadas, cartão do manual, documento adiado e o estado de sinal.
- Recarregar a página volta exatamente na etapa e com o que já foi feito.
- Abrir o link de novo, sem rascunho, mostra a capa com as etapas já feitas (com a hora) e o botão "Continuar: <próxima etapa>".
- O que o back-end já tem conta como feito. Exemplo da semente: VG-3119 tem CPF e cargas enviados e duas fotos do checklist salvas; o link abre na capa e "Continuar" leva ao checklist com as duas fotos.
- Link concluído abre direto no fim.
- "Voltar" vai para a etapa anterior. No manual, volta um cartão. Uma etapa já enviada mostra o que foi enviado e o botão vira "Continuar"; nas cargas, se o motorista mudar algo, vira "Enviar correção".
- "Continuar" pula etapas já feitas e o documento adiado.

## 4. Etapas

### 4.0 Capa

- **Objetivo:** dizer quem pede, para qual carga, e o que vai ser preciso.
- **Mostra:** empresa, filial e afretador; produto, peso, embarcador, data e janela; placas; lista numerada das etapas desta viagem, com as feitas marcadas e a hora; aviso de que sem sinal o que fizer fica no celular; para que servem os dados.
- **Ação:** "Começar", ou "Continuar: <etapa>" quando já começou.
- **Devolvida pela filial:** cartão no topo com o motivo, quem pediu e quando. Ação: "Refazer a foto pedida", que abre o checklist só com os itens pedidos.
- **Link ainda não enviado:** mensagem de que o link chega pelo WhatsApp. Na demonstração há "Simular envio pelo afretador".
- **Evento:** `linkAberto` na primeira abertura (a mesa passa de "link enviado" para "aberto pelo motorista").

### 4.1 Quem é você

- **Objetivo:** confirmar que é o motorista da viagem e que o conjunto é o certo.
- **Campos:** 3 primeiros números do CPF (teclado numérico, 3 dígitos). Lista das placas (cavalo e carretas), só leitura.
- **Validações:** CPF confere com o cadastro da viagem. Errado: "Não confere com o CPF desta viagem. Confira os números ou fale com <afretador>, o afretador."
- **Placa errada:** "Alguma placa está errada" abre o aviso "Não siga com placa diferente" e trava o botão ("Placa errada: fale com o afretador"). O afretador corrige a viagem e o mesmo link passa a mostrar as placas certas. "Olhei de novo: as placas estão certas" desfaz.
- **Já feito:** mostra nome, CPF mascarado e placas, com a hora.
- **Evento:** `linkCpf { id }`.

### 4.2 Documentos

- **Objetivo:** receber só o que falta ou venceu: CNH do motorista, RNTRC do transportador, CRLV de cada placa.
- **Campos:** uma foto por documento, pela câmera (ver 4.8).
- **Validações:** todas as fotos tiradas para enviar ("Falta a foto de 1 documento").
- **Sem o documento novo:** "Mandar depois" segue para a próxima etapa. A capa e o fim mostram "Ainda falta: CNH" com o botão "Mandar a foto agora". A viagem continua bloqueada por documento até a filial receber.
- **Evento:** `linkDocs { id, docs: [{ tipo, placa?, validade }] }` mais os arquivos. No protótipo a validade é presumida; no produto ela é lida da foto ou conferida pela filial.

### 4.3 Últimas cargas (T-3)

- **Objetivo:** as três últimas cargas de cada compartimento, da mais recente para a mais antiga.
- **Campos por linha:** data (seletor de data do celular) e o que carregou (texto livre com sugestões da base de produtos).
- **Pré-preenchimento:** quando o sistema conhece o histórico do compartimento, as linhas vêm preenchidas para conferir.
- **Atalho:** a partir da segunda carreta, "Carregou o mesmo que a <placa>".
- **Validações:**
  - data antes da data desta carga;
  - cada linha mais antiga que a de cima ("Esta carga é mais antiga: a data tem que ser antes de 03/10/2026.");
  - texto preenchido.
- **Mensagens por linha:** produto reconhecido ("Entendido: milho"); regime que pede lavagem; carga proibida ("O afretador vai falar com você"); não reconhecido ("Vai como está e a transportadora confere"). Nenhuma delas impede o envio: o motorista declara, o sistema decide.
- **Evento:** `linkT3 { id, t3: { "<placa>#<comp>": [{ data, produto } | { data, texto }] x3 } }`.

### 4.4 Checklist com fotos

- **Objetivo:** inspeção do conjunto antes de carregar: lona, correntes, cintas, carroceria e interior (crítico).
- **Campos por item:** Sim ou Não, e uma foto pela câmera. Com "Não": o que fazer naquele item e um campo opcional "O que está errado?".
- **Validações:** todos os itens respondidos e com foto. O botão diz quantos faltam ("Faltam 3 de 5 itens", "Falta 1 item").
- **Não no interior:** aviso em vermelho de que com resto de carga a carreta não carrega ração.
- **Fotos salvas antes** (rascunho no servidor ou no celular) voltam como miniatura, com "Tirar de novo".
- **Devolvida:** só os itens pedidos, com o motivo no topo; o botão vira "Reenviar à filial" e o fim diz "Foto nova enviada".
- **Já enviado:** lista só de leitura com as respostas. Para trocar uma foto, a filial devolve.
- **Evento:** `linkChecklist { id, itens: { k: "ok" | "nao" }, fotos: { k: ref }, obs, gps }`. `obs` junta as observações dos itens com Não.

### 4.5 Manual

- **Objetivo:** ciência do manual de boas práticas vigente.
- **Tela:** um cartão por vez (5 cartões), com indicador de posição. "Próximo cartão"; no último, "Li e entendi". "Voltar" volta um cartão.
- **Evento:** `linkManual { id, versao }`.

### 4.6 Termo

- **Objetivo:** termo de compromisso do transportador, só para gatekeeper.
- **Tela:** título, versão, texto e quadro de assinatura com o dedo (nome e data impressos no quadro). "Limpar" apaga.
- **Validações:** um traço mínimo no quadro ("Assine no quadro para enviar").
- **Evento:** `linkAssinar { id, versao }` mais a imagem da assinatura.

### 4.7 Fim

- **Enviado:** "Enviado à filial <nome>. Pode fechar esta página."
- **O que acontece agora:**
  1. a filial confere fotos e cargas (ou "conferiu e aprovou às 09:12");
  2. se precisar de foto nova, o afretador avisa pelo WhatsApp e o link mostra só o que refazer;
  3. com tudo certo, a carga fica liberada para o embarcador, data e janela.
- **Resumo:** cada etapa com a hora; "no celular" quando ainda está na fila; "falta" no documento adiado.
- **Sem sinal:** título "Guardado no celular" e a instrução de abrir o link de novo se fechar a página antes de enviar.
- **Evento:** nenhum novo.

### 4.8 Câmera (simulada no protótipo)

1. "Tirar foto" abre a câmera em tela cheia, com a instrução de enquadramento do item e a nota "só câmera, sem galeria".
2. O disparador tira a foto.
3. A prévia mostra o carimbo de data, hora e local e pergunta "Ficou boa?".
4. "Tirar de novo" volta ao visor; "Usar esta foto" guarda a foto no item.
5. "Cancelar" fecha sem foto.

No produto: `<input type="file" accept="image/*" capture="environment">` ou a câmera pela API do navegador; compressão no celular antes de subir; hora e GPS do momento da foto, não do envio.

## 5. Sem sinal

- Estado mostrado no topo ("com sinal" ou "sem sinal") e, sem sinal, uma faixa: "Sem sinal. Pode continuar: o que fizer fica guardado no celular." Com etapas na fila: "2 etapas guardadas no celular; vão sozinhas quando o sinal voltar."
- Cada etapa enviada sem sinal entra na fila do celular (`tx-v2-fila-<id>`), na ordem.
- O motorista segue normalmente: as etapas da fila contam como feitas para avançar.
- Quando o sinal volta, a fila é enviada em ordem e aparece o aviso "Sinal de volta: 3 etapas enviadas à filial."
- Se a página for fechada com fila e reaberta com sinal, a fila é enviada ao abrir.
- Na demonstração, tocar no indicador do topo (ou no controle do `/mobile`) simula a falta de sinal.

## 6. O que a filial vê

| Evento | Na mesa (Hoje) e na Viagem |
|--------|----------------------------|
| `linkAberto` | "aberto pelo motorista" |
| `linkCpf` | "em preenchimento"; identidade e placas confirmadas na linha do tempo |
| `linkDocs` | documento no cadastro com origem "link"; checagem de documentos refeita |
| `linkT3` | cargas por compartimento; classificação pela base IDTF; limpeza pedida quando o regime exige |
| `linkChecklist` | fotos para conferir: aprovar ou devolver com motivo |
| `linkManual` | ciência da versão do manual |
| `linkAssinar` | termo assinado; link "enviado pelo motorista" |

## 7. Demonstração em /mobile

Página no menu como "Protótipo mobile". Mostra o link num celular de 390 x 844 (iframe de `/link?id=`), com:

- **Viagens de exemplo:**

  | Viagem | Motorista | Situação inicial |
  |--------|-----------|------------------|
  | VG-3123 | João | link recém-chegado, duas carretas |
  | VG-3119 | Valmir | parou no checklist |
  | VG-3130 | Luciano | CNH vencida, preparada pela página |
  | VG-3125 | Edimar | foto devolvida |
  | VG-3120 | Rosana | tudo enviado |

- **Etapas:** lista clicável que leva o celular à etapa.
- **Nesta etapa:** o que o motorista vê, o que a filial vê e o evento.
- **Sinal:** controle de sinal do celular.
- **Eventos:** os eventos da viagem chegando ao escritório, com link para abrir a viagem.
- **Reiniciar este link:** apaga do log local os eventos de link e de conferência daquela viagem e o rascunho do celular, e volta à situação inicial do exemplo.

## 8. Fora do protótipo, para o produto

- Link com token único por viagem, com validade e revogável; abrir não exige login.
- Envio de fotos e documentos com retentativa, e guarda com hora e GPS de captura.
- Fila sem sinal com Service Worker e Background Sync onde houver; onde não houver (iOS), envio ao reabrir a página.
- Afretador pode preencher em nome do motorista, com registro de quem fez (`08-resposta-pm-mvp.md`, riscos).

## 9. Validar com o time

1. Quem faz a inspeção na prática: o motorista sozinho com fotos, alguém da filial ou do embarcador no pátio, ou os dois? Se houver inspeção presencial, a etapa de checklist precisa de uma variação.
2. O link no navegador basta para o piloto, ou o plano é um aplicativo (Flutter) para o motorista? Isso muda a câmera, a fila sem sinal e a entrega do link.
3. A entrega do link será pela API oficial do WhatsApp Business (mensagem iniciada pela empresa, com modelo aprovado) ou pelo afretador copiando a mensagem para o próprio WhatsApp?
4. Os 3 primeiros números do CPF bastam como confirmação de identidade, ou é preciso algo mais forte (código por SMS ou WhatsApp, foto da CNH)?
5. Quando o motorista não tem o documento renovado, a filial prefere que ele siga com o resto do link (como está) ou que pare até mandar o documento?
6. A validade do documento enviado pelo link é conferida por alguém da filial, lida automaticamente da foto, ou as duas coisas?
7. A foto da galeria fica sempre proibida, ou há casos aceitos (por exemplo, documento já fotografado antes)?
8. Resposta "Não" num item não crítico deve impedir o carregamento, ou basta registrar e deixar a decisão com a filial (como está)?
9. Qual o tempo esperado para a filial conferir as fotos? O fim diz "costuma levar poucos minutos".
10. O motorista deve receber aviso pelo WhatsApp quando a carga for liberada, além de quando a foto for devolvida?
11. O termo assinado pelo motorista vale também pelo transportador (TAC é a mesma pessoa), ou o termo da empresa transportadora (ETC) precisa de outro assinante?
12. Para conjunto com mais de uma carreta, o motorista sabe dizer as cargas de cada compartimento, ou isso fica com o dono do conjunto?
