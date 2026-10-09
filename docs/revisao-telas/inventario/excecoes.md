# Exceções e liberações
Arquivo: Excecoes.dc.html. Item da sidebar: "Exceções e liberações" (seção OPERAÇÃO, ativo, badge "5"). Perfil a quem se destina (pelo que a tela diz): quem detém autoridade na matriz para assinar liberações ou manter bloqueios; o usuário logado é "Rafael Antunes", "Gestor de qualidade / GMP+", e o modal de liberação o mostra assinando "como Diretoria + Resp. Técnico". Objetivo declarado na tela: subtítulo "Quarta, 6 ago / a fila de aprovação com trilha de autoridade / idade média: 1h 09min".

Convenção deste inventário: o separador ponto médio da interface aparece como " / " nas citações.

## Entradas e saídas
- Como se chega: item "Exceções e liberações" da sidebar de Torre de Controle v2.dc.html e Indicadores.dc.html; em Indicadores.dc.html, os botões do drawer "Ver exceções e bloqueios" (indicador "Bloqueios técnicos abertos"), "Ver a fila de exceções" ("Idade média da fila de exceções") e "Ver a matriz de autoridade" ("Liberações com registro completo"). Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html), "Viagens", "Inspeções", "Limpezas", "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota", "Dossiê de auditoria", "Indicadores", "Não conformidades", "Configurações", "Onboarding público", "Protótipo mobile" (App de Campo.dc.html). O item "Exceções e liberações" é um div sem link.
  - Código da viagem em cada card (ex.: "VG-2490") é link para "Viagem Detalhe.dc.html" (mesmo arquivo para qualquer VG).
  - Nenhum outro elemento navega.

## Estrutura da tela
1. Sidebar canônica (ver shell-global.md). Item ativo "Exceções e liberações" com badge branco "5". Card de rodapé "Base IDTF Brasil", "v2026.07 vigente", "Revisada em 28 jul / Qualidade".
2. Cabeçalho. Título "Exceções e liberações"; subtítulo fixo "Quarta, 6 ago / a fila de aprovação com trilha de autoridade / idade média: 1h 09min".
3. Barra superior à direita: "Filial Rondonópolis MT ▾" (Rondonópolis MT, Sorriso MT, Cuiabá MT, Rio Verde GO), botão "Exportar", avatar "RA" com menu de perfil. Não há busca nem seletor de período.
4. Chips de filtro: "Todas / 6", "Aguardando decisão / 4", "Decididas / 2". Contagens fixas no código.
5. Fila (coluna esquerda): cards, 6 itens no mock, sem paginação. Cada card tem: avatar com iniciais do solicitante e anel colorido; código da viagem (link); produto; chip "regra: {código e nome}"; linha "solicitado por {nome (função)} / {quando} / {n} evidências anexadas"; à direita chip do nível + "autoridade requerida"; texto do motivo; linha de ações conforme o estado; à direita "{idade} em fila".
   - Estado pendente: botões "Analisar e decidir" e "Pedir mais evidência".
   - Estado técnico: chip vermelho "Não existe motivo que libere esta regra" e botão "Ver plano de regularização".
   - Estado decidido: chip "✓ Liberada por autoridade / motor segue reprovando" (âmbar) ou "Bloqueio mantido / decisão registrada" (cinza), e botão "Ver registro de 9 campos".

| VG | Produto | Regra | Autoridade | Solicitado por | Quando | Evid. | Idade | Estado inicial |
|---|---|---|---|---|---|---|---|---|
| VG-2490 | Farelo de soja | R-06 subcontratado não apto | Diretoria + RT | Ivan Prado (motorista) | hoje, 09:20 | 2 | 1h 12min | pendente |
| VG-2487 | Farelo de amendoim | R-02 carga anterior proibida | Bloqueio técnico | Edson Farias (motorista) | hoje, 07:12 | 3 | 3h 20min (vermelho) | técnico |
| VG-2492 | Milho a granel | R-08 competência do motorista | Gestor | Ana Beltrão (despachante) | hoje, 09:43 | 1 | 49 min | pendente |
| VG-2496 | Calcário calcítico | R-11 documentação a vencer | Tráfego | Rogério Sales (tráfego) | hoje, 10:16 | 1 | 16 min | pendente |
| VG-2483 | Farelo de trigo | R-11 documentação a vencer | Tráfego | Rogério Sales (tráfego) | ontem, 15:02 | 2 | decidida | liberada por autoridade |
| VG-2471 | Sorgo granífero | R-03 limpeza incompatível | Gestor | Milton Costa (motorista) | segunda, 08:40 | 1 | decidida | bloqueio mantido |

   - Exemplo de motivo (VG-2490): "Certificado GMP+ da Lima Logística suspenso na base pública da certificadora. Acordo de qualidade vigente; a suspensão bloqueia mesmo assim. Transportadora afirma que a renovação já foi protocolada." VG-2487: "Ureia pecuária no T-1 do compartimento C2. Contaminação não se aprova; se regulariza. A lista de motivos desta regra é vazia por definição."
   - A fila reage aos chips de filtro e às decisões tomadas na sessão (o card muda de estado). Não reage à filial.
6. Rail direito, card "Matriz de autoridade", subtítulo "escala para cima, nunca para baixo": 6 níveis (número, nome, o que resolve): 0 "Técnico" ("Ninguém. Contaminação não se aprova; se regulariza.", destacado em vermelho); 1 "Inspetor" ("Condição física: checklist reprovado, fotos ausentes"); 2 "Tráfego" ("Pendência simples: certificação a vencer, sincronização"); 3 "Gestor" ("Pendência corrigível mediante evidência da correção"); 4 "Diretoria + RT" ("Impacto contratual, risco residual, terceiro emergencial"); 5 "Cliente" ("Só escopo comercial. Nunca "perdoa" contaminação."). Rodapé: "Não existe botão genérico de "aprovar mesmo assim" em lugar nenhum do produto. A ausência dele é decisão de produto." Fixo.
7. Rail direito, card "A fila em números": "Caso simples (15 min a 4h)" 3 com barra 60%; "Caso crítico (1 a 2 dias)" 2 com barra 40%. Rodapé "A idade do item na fila é informação de primeira classe." Fixo.

## Ações

| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| "Filial {x} ▾" | Barra superior | toast | Marca a filial escolhida e mostra "Vendo a fila da filial Sorriso MT."; a lista não muda. |
| "Exportar" | Barra superior | toast | "Fila de exceções exportada: itens, decisões, responsáveis e motivos, com carimbo de 6 ago." Sem modal. |
| Avatar "RA" | Barra superior | menu | Menu de perfil (ver abaixo). |
| Chips de filtro | Topo da fila | muda estado | "Aguardando decisão" mostra pendentes e técnico; "Decididas" mostra decididos. |
| Código da VG | Card | navegação | Viagem Detalhe.dc.html. |
| "Analisar e decidir" | Card pendente | modal | Abre "Registro de liberação / {VG}" (9 campos). |
| "Pedir mais evidência" | Card pendente | modal | Abre "Pedir mais evidência". |
| "Ver plano de regularização" | Card VG-2487 | modal | Abre "Plano de regularização / VG-2487". |
| "Ver registro de 9 campos" | Card decidido | modal | Abre "Registro lacrado / {VG}". |
| "Manter bloqueio" | Rodapé do modal de 9 campos | modal | Abre "Manter o bloqueio" por cima. |
| "Revogar liberação" | Modal do registro lacrado | muda estado + toast | Ver abaixo. |
| "Recolher menu" | Sidebar | muda estado | Persistido em localStorage. |
| Clique fora / Esc | Global | muda estado | Fecham dropdowns; Esc fecha modais do perfil, não fecha os modais da fila. |

Menu de perfil: cabeçalho "Rafael Antunes", "Gestor de qualidade / GMP+"; "Meu perfil"; "Preferências e notificações"; "Aparência" (injetado pelo shell); "Papel ativo" com chip; "Sair". Conteúdo dos modais "Meu perfil", "Preferências e notificações", "Papel ativo" e "Sair da conta" é idêntico ao da Torre de Controle (ver torre-de-controle.md), com as diferenças anotadas em Observações.

Modais:

- Modal "Registro de liberação / {VG}" (largura 1060px). Cabeçalho: "{produto} / regra: {regra} / autoridade: {nível}", contador "{n} de 9 campos" (âmbar até 9, verde em 9), X.
  - 1 "MOTIVO PADRONIZADO *": dica "lista fechada desta regra; a justificativa complementa, nunca substitui"; rádio com 3 opções por regra. VG-2490: "Certificado renovado, aguardando atualização da base pública", "Divergência cadastral confirmada com a certificadora", "Auditoria emergencial realizada no terceiro". VG-2492: "Reciclagem concluída, aguardando recálculo da matriz", "Motorista substituto confirmado para o carregamento", "Prorrogação técnica avaliada pela Qualidade". VG-2496: "Renovação protocolada dentro do prazo", "Implemento substituto indisponível na janela", "Janela de carregamento inadiável do cliente". Obrigatório.
  - 2 "JUSTIFICATIVA *": textarea, placeholder "Complemento do motivo: contexto, protocolo, contato com a certificadora… (mínimo 20 caracteres)". Conta como preenchido com 20 ou mais caracteres sem espaços nas pontas.
  - 3 "EVIDÊNCIAS *": chips de anexo, pré-preenchidos com "Protocolo de renovação GMP+ nº 44.812" e "E-mail da certificadora (05 ago)"; botão "+ anexar" acrescenta "Anexo 3 / comprovante.pdf" (numeração sequencial). Sem remoção.
  - 4 "RESPONSÁVEL / automático": "Rafael Antunes", "assina como Diretoria + Resp. Técnico".
  - 5 "DATA E HORA / automático": "6 ago 2026 / 10:32".
  - 6 "SITUAÇÃO ANTERIOR / capturada do estado real": "Bloqueada / motor reprova (11 de 12)".
  - 7 "SITUAÇÃO POSTERIOR / capturada, não digitada": "Liberada por autoridade / motor segue reprovando".
  - 8 "IMPACTO DECLARADO *": rádio "Sem impacto sobre a segurança do feed", "Risco residual aceito com monitoramento", "Risco mitigado por evidência da correção".
  - 9 "VALIDADE *": rádio "Somente esta viagem", "72 horas", "7 dias", "Até a regularização do fato".
  - Aviso: "Se o registro não for completado, a liberação é desfeita por inteiro. Não existe liberação sem registro."
  - Rodapé: "Manter bloqueio" com legenda "manter também é decisão registrada, com responsável e motivo"; botão principal desabilitado "Assinar liberação (complete os 9 campos)" que vira "Assinar liberação" com os 9 campos. Campos 4 a 7 contam sempre como preenchidos.
  - Ao assinar: fecha, o card passa a "✓ Liberada por autoridade / motor segue reprovando" com "Ver registro de 9 campos". Toast: "Liberação da VG-2490 assinada e registrada. O motor segue reprovando; os dois registros ficam no dossiê."
- Modal "Manter o bloqueio" (chip "também é decisão registrada"). "MOTIVO DA REJEIÇÃO" (rádio, obrigatório): "Evidência insuficiente para o risco declarado", "A correção do fato é viável antes da janela", "Fora da minha alçada na matriz: escalar", "Pedido não se sustenta contra a regra". "AÇÃO INDICADA A QUEM PEDIU" (campo de texto, obrigatório, mínimo 15 caracteres, placeholder "o que precisa acontecer para reapresentar, mínimo 15 caracteres"). Linha "Assina como Rafael Antunes / Gestor de qualidade (nível 3)". Botões "Voltar" e "Assinar e manter bloqueio" (desabilitado até motivo e 15 caracteres). Ao confirmar: fecha os dois modais, card passa a "Bloqueio mantido / decisão registrada". Toast: "Bloqueio da VG-2490 mantido e assinado por Rafael Antunes. Motivo e ação indicada foram para o registro lacrado."
- Modal "Pedir mais evidência" (chip com a VG). "PARA QUEM" (rádio, obrigatório): "Ivan Prado" ("motorista / quem está com a carga"), "Lima Logística" ("subcontratado / dono do certificado"), "Jorge Mattos" ("inspetor de pátio / evidência física"). "PRAZO" (chips, obrigatório): "2 horas", "até 18:00 de hoje", "24 horas". Nota: "O item continua na fila com o relógio correndo. Vencido o prazo sem resposta, a solicitação escala um nível na matriz." Botões "Cancelar" e "Enviar pedido" (desabilitado até destinatário e prazo). Toast: "Pedido de evidência enviado com prazo de 2 horas. Sem resposta no prazo, escala um nível na matriz." O card não muda.
- Modal "Plano de regularização / VG-2487". Subtítulo "bloqueio técnico: nenhuma assinatura substitui estas etapas. O caminho é regularizar o fato." 4 etapas com estado: 1 "Destinação do resíduo com laudo" ("remover a ureia com destino documentado", em andamento); 2 "Limpeza qualificada / regime D" ("estação credenciada, 19 campos de evidência", pendente); 3 "Inspeção qualificada com fotos" ("6 ângulos + assinatura do inspetor", pendente); 4 "Reavaliação pelo motor" ("o estado recalcula do fato; ninguém assina por cima", automática). Botões "Fechar" e "Notificar responsáveis". Toast: "Responsáveis notificados: Qualidade e estação de lavagem. Etapas na trilha da VG-2487." Nada muda.
- Modal "Registro lacrado / {VG}". Chip do tipo ("Liberada por autoridade" ou "Bloqueio mantido"); linha com cadeado "imutável desde a assinatura / hash 9f2c…e41a" (liberação) ou "b71d…08cc" (manutenção).
  - Para liberação: faixa "Validade da liberação: somente esta viagem / expira no fechamento da VG ou em 72h, o que vier antes" com "expirada, a viagem volta ao estado do fato"; 9 linhas: "1 / MOTIVO" "Renovação protocolada dentro do prazo (lista fechada da regra R-11)"; "2 / JUSTIFICATIVA" "Protocolo nº 44.812 confirmado com a certificadora por telefone e e-mail; janela do cliente inadiável."; "3 / EVIDÊNCIAS" "2 anexos: protocolo de renovação, e-mail da certificadora"; "4 / RESPONSÁVEL" "Rogério Sales / assinou como Tráfego"; "5 / DATA E HORA" "5 ago 2026 / 15:02"; "6 / SITUAÇÃO ANTERIOR" "Bloqueada / motor reprova (11 de 12) / capturada do estado real"; "7 / SITUAÇÃO POSTERIOR" "Liberada por autoridade / motor segue reprovando / capturada, não digitada"; "8 / IMPACTO DECLARADO" "Sem impacto sobre a segurança do feed"; "9 / VALIDADE" "Somente esta viagem". Abaixo: "Revogar não apaga nada: cria um evento novo e devolve a viagem ao estado do fato." e botão "Revogar liberação".
  - Para bloqueio mantido: 6 linhas: "DECISÃO" "Manter o bloqueio. Manter também é decisão registrada, não é "não fazer nada"."; "MOTIVO" "A limpeza declarada (regime A) não atende o regime B exigido pelo T-3 do compartimento."; "RESPONSÁVEL" "Helena Duarte / assinou como Gestora de qualidade"; "DATA E HORA" "4 ago 2026 / 11:18"; "AÇÃO INDICADA" "Executar limpeza no regime B com evidência e reapresentar. O motor reavalia sozinho."; "SITUAÇÃO" "Bloqueada antes / bloqueada depois. O fato não mudou; o registro prova que alguém olhou."
  - "Revogar liberação": sem confirmação nem motivo; marca a VG como revogada e mantida, mostra faixa vermelha "Liberação revogada hoje por Rafael Antunes. A viagem voltou ao estado do fato: bloqueada. O registro original permanece lacrado." Toast: "Liberação da VG-2483 revogada. A viagem voltou ao estado do fato; os dois registros ficam no dossiê." O card passa a "Bloqueio mantido / decisão registrada".
- Modais do perfil ("Meu perfil", "Preferências e notificações", "Papel ativo", "Sair da conta"): mesmos campos e textos da Torre de Controle.

## Estados e simulações
- Loading: 900 ms de skeleton com shimmer na fila (4 cards). Cabeçalho, filtros e rail aparecem direto.
- Vazio: não há texto de estado vazio no arquivo; os três filtros sempre têm itens no mock.
- Erro: nenhum.
- Props: nenhuma.
- Estado de sessão: decisões (assinar, manter, revogar) mudam o card enquanto a página está aberta; nada é persistido.

## Entidades e operações
- Pedido de exceção / item da fila: consultar, filtrar.
- Registro de liberação por autoridade (9 campos): criar (assinar), consultar, revogar.
- Registro de manutenção de bloqueio: criar (assinar), consultar.
- Pedido de evidência: criar (só toast, sem registro visível).
- Plano de regularização: consultar, notificar responsáveis (só toast).
- Viagem: consultar (link), estado alterado pela decisão.
- Regra do motor (R-02, R-03, R-06, R-08, R-11): consultar no card.
- Evidência / anexo: anexar (no modal), consultar.
- Matriz de autoridade: consultar.
- Motorista, subcontratado (Lima Logística), inspetor (Jorge Mattos): destinatários do pedido de evidência.
- Fila de exceções: exportar (toast).
- Papel e preferências do usuário: editar no estado da tela.
- Não há editar registro, retificar, cancelar ou arquivar.

## Regras de negócio visíveis
- Liberação exige os 9 campos; os campos 1, 2, 3, 8 e 9 são obrigatórios e marcados com asterisco; justificativa com no mínimo 20 caracteres; motivo vem de lista fechada por regra.
- "Se o registro não for completado, a liberação é desfeita por inteiro. Não existe liberação sem registro."
- Liberação por autoridade não muda o veredito do motor: "motor segue reprovando"; os dois registros convivem no dossiê.
- Bloqueio técnico (nível 0) não tem lista de motivos nem botão de análise: "Não existe motivo que libere esta regra"; só plano de regularização.
- Manter o bloqueio é decisão registrada, exige motivo e ação indicada com no mínimo 15 caracteres.
- Pedido de evidência exige destinatário e prazo; sem resposta no prazo, escala um nível na matriz.
- Registro lacrado é imutável, tem hash; revogar cria evento novo e devolve a viagem ao estado do fato.
- Validade da liberação: expira no fechamento da VG ou em 72h.
- Matriz de autoridade de 0 a 5, escala para cima; nível 5 "Cliente" só escopo comercial, "Nunca "perdoa" contaminação."
- Não existe botão "aprovar mesmo assim".
- Prazos de referência: caso simples de 15 min a 4h, caso crítico de 1 a 2 dias.

## Observações factuais
- O seletor de filial só mostra toast; a fila não muda. Não há busca nem período, diferente da Torre de Controle.
- "Exportar" só mostra toast; na Torre de Controle o mesmo botão abre modal com blocos e formato.
- As contagens dos chips ("Todas / 6", "Aguardando decisão / 4", "Decididas / 2") são fixas e não mudam depois de assinar, manter ou revogar.
- O badge da sidebar é 5 e o chip "Aguardando decisão" é 4. "A fila em números" (3 + 2 = 5) é fixa.
- A idade média no subtítulo ("1h 09min") é fixa; Indicadores.dc.html mostra "Idade média da fila de exceções" "1h 48min".
- Datas e tempos diferem da Torre de Controle para as mesmas VGs (aqui "Quarta, 6 ago"; lá "Terça, 5 ago"; VG-2487 3h 20min aqui, 3h 12min lá; ver torre-de-controle.md).
- VG-2494 (Inspetor de pátio) está na fila da Torre de Controle e não aparece aqui; VG-2483 e VG-2471 aparecem só aqui.
- O campo 4 "Responsável" diz sempre "assina como Diretoria + Resp. Técnico", para qualquer item, inclusive os de nível Tráfego e Gestor. O modal "Manter o bloqueio" diz "Assina como Rafael Antunes / Gestor de qualidade (nível 3)". O perfil mostra "nível 3 / Gestor".
- Não há verificação de alçada: o usuário de nível 3 abre e assina a liberação da VG-2490, que exige "Diretoria + RT"; o papel ativo escolhido não afeta a fila nem os modais.
- Os campos 5, 6 e 7 são os mesmos para todos os itens ("6 ago 2026 / 10:32", "Bloqueada / motor reprova (11 de 12)").
- As duas evidências vêm pré-anexadas em todos os itens (protocolo GMP+ e e-mail da certificadora, ambos do caso Lima Logística); por isso o contador começa em "5 de 9 campos". Os anexos acrescentados permanecem ao abrir outro item.
- O registro lacrado não mostra o que foi preenchido: qualquer liberação abre o conteúdo fixo da VG-2483 (Rogério Sales, 5 ago) e qualquer bloqueio mantido abre o da VG-2471 (Helena Duarte, 4 ago). A faixa de validade diz sempre "somente esta viagem", independentemente da validade escolhida.
- O botão "Ver registro de 9 campos" aparece também nos bloqueios mantidos, cujo registro tem 6 linhas.
- Depois de revogar, o mesmo modal passa a exibir a faixa de revogação junto com as 6 linhas do registro de bloqueio mantido da VG-2471.
- "Revogar liberação" não pede confirmação nem motivo.
- Os destinatários de "Pedir mais evidência" são sempre Ivan Prado, Lima Logística e Jorge Mattos, para qualquer VG (inclusive VG-2492, pedida por Ana Beltrão, e VG-2496, pedida por Rogério Sales). O pedido só gera toast; o card não registra o pedido.
- Para itens decididos, a idade aparece como "decidida em fila".
- A matriz de autoridade do rail tem 6 níveis (0 a 5, com "Técnico" no 0 e "Cliente" no 5); o modal "Papel ativo" tem 5 papéis, com "Auditor interno" no nível 0 e sem "Cliente".
- Nomes de nível divergem: "Diretoria + RT" (card), "Diretoria + Resp. Técnico" (campo 4), "Diretoria e Resp. Técnico" (Papel ativo); "Gestor" (card) e "Gestor de qualidade" (perfil).
- Neste arquivo, trocar o papel ativo e confirmar "Sair" não mostram toast (a função de aviso usada por esses dois modais não existe nesta tela; o toast da tela usa outra função). Na Torre de Controle e em Indicadores os toasts aparecem.
- O Plano de regularização da VG-2487 tem etapas diferentes do plano da mesma VG na Torre de Controle.
- Existe no código uma ação "manter" direta (toast "Bloqueio da {VG} mantido. Decisão registrada com responsável e motivo.") que não está ligada a nenhum elemento.
