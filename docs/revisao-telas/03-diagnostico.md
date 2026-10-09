# Diagnóstico tela a tela

Etapa 4 da revisão, 08/10/2026. Confronta o inventário (`01-inventario.md` e `inventario/*.md`) com os usuários e trabalhos (`02-usuarios-e-trabalhos.md`) e com a auditoria real (`evidencia-auditoria-real.md`), pelos seis critérios de `00-plano.md`. A arquitetura proposta (telas, navegação, fluxos ponta a ponta) fica para `04-arquitetura-proposta.md`; aqui se decide o que cada tela deve ser.

Convenções:

- Fontes: INV/<tela> = `inventario/<tela>.md`; MAPA = `01-inventario.md`; UT = `02-usuarios-e-trabalhos.md`; EVID = `evidencia-auditoria-real.md`; MERC = `reports/Concorrentes e fluxos do Traxium.md`; BRIEF = `BRIEFING-DESIGN.md`; RF = `SaaS moderno estilo Dribbble/REVISAO-FLUXOS.md`. O número após a sigla é a seção.
- "Inferência" marca o que não está em documento real nem na norma.
- Ação que só mostra toast é limite do protótipo. O diagnóstico só aponta quando o desfecho (onde o registro vai, que estado assume, quem é avisado) nunca foi desenhado.
- Vereditos: manter; simplificar; fundir com <tela>; rebaixar (sai da navegação principal, continua acessível); cortar.

## 1. Resumo

O protótipo acerta a regra e erra o usuário. A regra está bem modelada: T-3 por compartimento, estado derivado do fato, bloqueio técnico sem aprovação, registro lacrado com correção por evento novo, versão da base gravada na decisão. O usuário imaginado, porém, é um gestor de qualidade que decide exceções numa fila, numa transportadora com a frota própria inteira no escopo, regimes C e D frequentes e terceiros qualificados como empresa. A auditoria de agosto de 2026 mostra outra operação (EVID 2 e 4): quem trabalha todo dia é o afretador da filial; o TAC é qualificado viagem a viagem, motorista a motorista e compartimento a compartimento; a viagem é identificada por CT-e, nota fiscal e placas; só se usa limpeza seca; o treinamento exigido é lista datada e manual assinado; as NCs que contam vivem no formulário da consultoria; e o teste decisivo é rastrear por placa em até 4 horas.

Das 21 telas, 3 ficam como estão no essencial, 8 precisam ser simplificadas, 4 devem ser fundidas em outras, 3 saem da navegação principal e 3 devem ser cortadas. A tela mais usada do produto não existe: a mesa do afretador.

Mudanças mais importantes, em ordem de consequência:

1. **Criar a mesa do afretador** a partir da Torre de Controle: fila de viagens do dia da filial com o que falta em cada uma (documentos do TAC e do conjunto, T-3 recebido, verificação do compartimento, termo assinado, CT-e emitido). Com filial "todas", a mesma tela é o painel da qualidade.
2. **Dar à viagem a identidade real**: CT-e e DACTE com a declaração positiva, nota fiscal, embarcador e destinatário, filial, transportador com RNTRC, todas as placas do conjunto, e a marcação "assegurada GMP+". O código VG passa a interno.
3. **Transformar o Onboarding público no link da viagem do TAC**: identificação reaproveitada por CPF, placas, três últimas cargas por compartimento, manual, termo e assinatura. O resultado cai na viagem, não num cadastro em "Pré-cadastrado".
4. **Refazer o Dossiê como rastreabilidade e amostra**: busca por placa, CT-e, NF ou período que lista as viagens com os campos que o auditor anota, e exportação da amostra com os 7 a 9 itens conferidos por viagem, em vez de 16 blocos encadeados por hash.
5. **Cortar Não conformidades e Acessos externos, e reduzir a Academy.** Academy vira, na primeira versão, manual versionado com ciência na viagem e lista simples de treinamentos, com trilhas e prova para depois; NC vira ocorrência registrada na viagem, com o ciclo de ação corretiva fora do Traxium; convites e acessos voltam para a linha de cada transportador.
6. **Fundir Inspeções e Limpezas na Viagem.** A verificação do compartimento é passo da viagem feito pelo afretador; a limpeza é registrada na viagem e no compartimento; lavadores viram fornecedores homologados.
7. **Reorganizar terceiros e frota em duas bases**: transportadores (TAC como pessoa mais conjunto, ETC com motoristas, absorvendo Motoristas) e frota própria com flag "no escopo GMP+" e placas de cavalo e de cada compartimento.
8. **Tratar a filial como unidade** (registro GMP+ próprio, afretador próprio, escopo de dados) e fazer filtros de filial e período filtrarem de fato.

O que é forte e deve ser preservado:

- Estado derivado do fato, sem campo de status editável (INV/subcontratados, "Estado nunca é editado à mão"; INV/motoristas, "Ninguém marca um motorista como apto").
- T-3 e histórico pertencem ao compartimento, não ao cavalo (INV/viagem-detalhe, cartão "Conjunto"; INV/ativos-e-frota).
- Bloqueio técnico sem caminho de aprovação; ausência de "aprovar mesmo assim" (INV/excecoes, matriz).
- Registro de liberação de 9 campos com motivo em lista fechada, validade e "Não existe liberação sem registro"; manter bloqueio também é decisão registrada.
- Correção como evento novo, cancelamento como evento, nada se apaga (INV/viagem-detalhe, modais "Retificar um fato" e "Cancelar a VG-2490").
- Versão da base gravada em cada decisão (INV/motor-idtf, "Governança da base").
- Duplicidade por dígitos do documento e por placa e chassi (INV/subcontratados; INV/ativos-e-frota).
- Ausência declarada em vez de valor plausível (INV/dossie, "Bloco sem dado mostra a ausência").
- Motivo exibido junto do bloqueio ("a tela diz o motivo, não apenas desabilita", INV/viagens).
- No app: offline-first, câmera sem galeria, item crítico que reprova sozinho, registro sincronizado que trava.

## 2. Diagnóstico por tela

### 2.1 Torre de Controle

- **Trabalho que atende:** "O que está pendente na empresa" (responsável da qualidade, UT 5). Atende de forma parcial o "Liberar a viagem afretada em minutos" do afretador, que não tem tela (UT 2).
- **Essencial:**
  - "Fila de decisões" com motivo em linguagem de causa, prazo de carregamento e tempo em fila.
  - Bloco "EVIDÊNCIAS ESSENCIAIS" (T-3, LIMP, INSP, FOTO, CERT, COMP): é o embrião da lista "o que falta nesta viagem".
  - Seletor "Filial ▾", o único do protótipo que troca dados de fato (INV/torre-de-controle, Ações).
  - Drawer "Vai travar em breve", com link para a tela onde se resolve.
  - Busca na fila.
- **Excesso:**
  - Card "Onde a pendência está" (5 pilares, fixo, soma 17): agrupa pela estrutura do produto, sem decisão associada.
  - "Liberadas sem intervenção humana" como primeiro card: mede o produto (BRIEF 7.1), não um trabalho; repete Indicadores (#1, 79%).
  - Três sinais por item onde basta um: chip de risco, nível que resolve e avatares sem legenda (EF, IP, VN, JM, RS).
  - Modal "Exportar a torre" com blocos e formatos: nenhum trabalho pede a fila do dia em arquivo.
- **Falta:**
  - As viagens do dia que não estão em exceção. Com mais de 100 protocolos gatekeeper (EVID 2.4), o afretador precisa ver todas, com o que falta em cada uma, e não só 5 itens problemáticos.
  - Identificação por CT-e ou ordem e por placas, no lugar de VG (EVID 4).
  - Separação frota própria e afretamento (MERC, Viagens: filtro do Quali-e).
  - Visão consolidada das filiais para a qualidade da matriz (EVID 1: matriz e oito filiais).
- **Problemas de fluxo:**
  - Quatro dos cinco botões secundários ("Solicitar exceção", "Enviar trilha ao motorista", "Notificar inspetor", "Justificar e liberar") não têm desfecho: o item fica na fila sem estado novo, e "Justificar e liberar" registra justificativa sem campo de texto.
  - O "Plano de regularização" diz "o motor reavalia sozinho. Ninguém aperta liberar". A TS1.9 exige, após carga proibida, liberação por inspetor independente (Opção A) ou pelo inspetor do carregador após cinco cargas (Opção B) (MERC, "O obrigatório é mais estreito"). Regra mal enunciada; o mesmo plano tem passos diferentes em Exceções.
  - "Esta semana" e "Este mês" multiplicam viagens e mantêm a fila de hoje; subtítulo "7 esperam decisão", chip "Em análise / 3" e card "Aguardando análise 5" não fecham.
  - Fila sem paginação é correta (RF 2.4), mas só se sustenta com 100 viagens por dia se for fila de viagens com filtro "falta algo".
- **Veredito:** simplificar. Prioridade alta. A Torre vira a mesa de trabalho por filial e, com "todas as filiais", o painel da qualidade. Saem o card de pilares e a métrica de autonomia do topo.
- **Confiança:** média. O afretador e a viagem como unidade são evidência (EVID 2.4); uma fila única para afretador e qualidade é inferência.

### 2.2 Viagens

- **Trabalho que atende:** rastrear por placa, CT-e ou nota em até 4 horas (qualidade diante do auditor, EVID 2.2); montar a viagem a partir da ordem (tráfego, UT 2); ver as viagens da filial (afretador).
- **Essencial:**
  - Tabela com produto, rota e cliente, motorista com vínculo ("subcontratado / Lima Logística"), conjunto (cavalo, implemento, compartimento) e decisão.
  - Busca que já cobre placa de cavalo e de implemento.
  - Paginação com total ("mostrando 1 a 8 de 9 viagens") e chips de decisão que filtram.
  - Padrão de motivo visível na seleção ("não selecionável: ...").
- **Excesso:**
  - Visões "Regime C e D" (a operação observada só usa seco, EVID 2.1) e "Carregam em 2h" (status inexistente nos dados).
  - Seletor de período sem efeito; legenda "base IDTF: 1.240 produtos" no modal.
  - "DECISÃO DO MOTOR" e "STATUS" com vocabulários que não batem com a Viagem Detalhe ("Carregando", "Em carregamento", "Carregamento"; "Por autoridade", "Liberada por autoridade").
- **Falta:**
  - CT-e, nota fiscal, embarcador e destinatário, filial, transportador com RNTRC e todas as placas (2 a 4), como colunas e como chaves de busca. São os campos que o auditor anotou por viagem (EVID 2.4).
  - Marcação "assegurada GMP+" e o número do DACTE com a declaração positiva (EVID 2.3).
  - Filtro frota própria e afretamento.
  - Busca por placa com período e exportação: é o teste de rastreabilidade (EVID 2.2: "por placa, listar as viagens do período com data, número do CT-e, embarcador e destinatário, produto e nota fiscal").
  - Criação a partir do PDF da ordem de carregamento ou do CT-e do TMS (MERC: Quali-e com modelo "MODELO SISTEMA ATUA").
  - No modal "Nova viagem", caminho para TAC: só há dois conjuntos de frota própria e um da Lima, e nenhum campo para placas de um terceiro novo.
- **Problemas de fluxo:**
  - "Criar viagem" ignora o conjunto escolhido e sempre libera regime A; o código é fixo (VG-2497).
  - Todas as linhas abrem VG-2490.
  - Filtro de regime fora do badge e de "Limpar tudo" (chaves fRg e fReg).
  - Sem exportação na tela que responde ao auditor.
  - "Aguardando análise" não existe como estado na Viagem Detalhe.
- **Veredito:** manter. Prioridade alta. É a tela de rastreabilidade; precisa da identidade real da viagem e de exportação por placa e período.
- **Confiança:** alta (EVID 2.2, 2.4; R1.0, 4 horas, em MERC).

### 2.3 Viagem Detalhe

- **Trabalho que atende:** "Saber se pode carregar" e "deixar tudo ligado à viagem" (UT 3.1, passos 3 a 7); amostra do auditor (EVID 2.4).
- **Essencial:**
  - Banner de decisão com causa e ação, inclusive "Liberada por autoridade: o motor continua reprovando".
  - Faixa "registro obrigatório pendente: a viagem opera, mas não fecha".
  - Aba "Sequenciamento T-3": T-3, T-2 e T-1 com data e produto, veredito e "Por quê".
  - "Checagens do motor" com código de regra e modal "A regra por trás do resultado", com a versão da base.
  - "Linha do tempo"; "Retificar um fato" e "Cancelar viagem" como eventos; "Editar dados da viagem" com campos travados e justificativa.
- **Excesso:**
  - Aba "Rastreio" inteira (mapa, check-in, marcos, barra de 34%). Posição do caminhão não é trabalho de ninguém (BRIEF 12: "Não é rastreamento em tempo real") e o nome confunde com rastreabilidade, que é outra coisa (EVID 2.2).
  - Ciclo operacional de cinco fases com "37,2 t na balança" e "Descarga confirmada no destino com GPS e assinatura": é TMS (BRIEF 12). Basta a viagem fechar e virar T-1.
  - "Inspeção & fotos" com seis ângulos obrigatórios e hash por foto: o auditor conferiu a data da verificação de conformidade, não fotos (EVID 2.4). Fotos ficam como evidência opcional (inferência sobre o valor delas).
  - Menu "Ações ▾" com oito itens, três abrindo o mesmo modal ("Trocar veículo / compartimento", "Trocar motorista", "Reatribuir transportador").
- **Falta (o que o auditor anotou por viagem, EVID 2.4):**
  - CT-e e DACTE com "O serviço fornecido é assegurado GMP+FSA", nota fiscal, embarcador e destinatário, filial.
  - Subcontratado com RNTRC e todas as placas do conjunto.
  - Data de assinatura do termo de compromisso e da ciência do manual.
  - Data e responsável da verificação de conformidade (lonas, correntes, cintas, carroceria, condições externas).
  - Origem do T-3: declarado pelo TAC no link ou lido do histórico do compartimento próprio.
  - Os documentos mínimos de rastreio (EVID 2.2): Declaração das três últimas cargas, Declaração de conformidade das condições higiênicas, Registro de viagem. "Documentos gerados" hoje lista ordem de carregamento, registro de limpeza e relatório de inspeção.
- **Problemas de fluxo:**
  - Sem desfecho: "Abrir NC" (NC-0311 não aparece em Não conformidades), "Confirmar troca" (nada recalcula), "Retificar um fato" (sem campo para o valor corrigido, sem evento na linha do tempo), "Salvar" da edição.
  - Com prop liberada, "Concluir viagem" funciona com comprovante pendente e diz "O dossiê fechou com todos os registros", contra a própria regra.
  - Modal de edição mostra "VG-2487" e peso 32.000 na VG-2490.
  - Só existe um caso (bloqueio por certificado da Lima); não há viagem de TAC liberada, viagem sem T-3 nem conjunto com dois compartimentos (ver 3.5).
- **Veredito:** simplificar. Prioridade alta. Ficam decisão, T-3 por compartimento, condição do compartimento, termo e documentos, linha do tempo e correção. Saem Rastreio e o ciclo de balança. Entram CT-e, NF, placas, RNTRC, termo e verificação. Absorve Inspeções (2.13), Limpezas (2.14) e o registro de liberação (2.4).
- **Confiança:** alta (EVID 2.2 a 2.4; BRIEF 12).

### 2.4 Exceções e liberações

- **Trabalho que atende:** "assinar o que fugir da regra" (direção, UT 2); o momento de exceção (UT 3.4), cuja frequência parece baixa em granel sólido (hipótese, UT 3.4).
- **Essencial:**
  - Modal "Registro de liberação" de 9 campos: motivo em lista fechada por regra, justificativa como complemento, impacto, validade, "Não existe liberação sem registro". Alinhado à prática de concessão (MERC, Exceções).
  - "Manter o bloqueio" com motivo e ação indicada; "Revogar liberação" como evento novo.
  - "Pedir mais evidência" com destinatário e prazo.
  - Estado técnico "Não existe motivo que libere esta regra".
- **Excesso:**
  - Card "Matriz de autoridade" com seis níveis (0 Técnico a 5 Cliente). O nível 0 é ninguém e o 5 nunca libera contaminação; sobram quatro, e o mercado opera com até três blocos por função (MERC). A auditoria real não mostra escalonamento por nível.
  - Fila própria que repete a Torre (VG-2487, VG-2490, VG-2492, VG-2496 nas duas, com tempos diferentes).
  - Card "A fila em números" fixo; filial que só mostra toast.
- **Falta:**
  - Escopo da liberação e a declaração de que ela não cria precedente (MERC).
  - Trilha de liberação após carga proibida conforme TS1.9: Opção A ou B, contador de cinco cargas, quem libera, anexos. O "Plano de regularização" atual não segue a norma (ver 2.1).
  - Histórico pesquisável de liberações para a amostra: o registro lacrado sempre abre o conteúdo fixo da VG-2483.
- **Problemas de fluxo:**
  - Sem verificação de alçada: o nível 3 assina item de "Diretoria + RT"; o campo 4 diz sempre "assina como Diretoria + Resp. Técnico".
  - "Pedir mais evidência" não deixa marca no card.
  - "Revogar liberação" sem motivo nem confirmação, enquanto manter bloqueio exige motivo.
  - Contagens dos chips não mudam após decidir.
- **Veredito:** fundir com Torre de Controle. Prioridade média. O pendente vira o filtro "precisa de assinatura" na fila; o registro de 9 campos vira a ação "Liberar por autoridade" dentro da Viagem Detalhe; o histórico vira filtro de Viagens. A matriz cai para três alçadas configuráveis.
- **Confiança:** média. A estrutura do registro tem respaldo; a frequência de exceções no afretamento é hipótese (pergunta 1).

### 2.5 Motor IDTF

- **Trabalho que atende:** obter o regime pela IDTF e travar carga proibida ou não classificada (UT 3.1, passo 3). Quem consome isso é a viagem; consulta avulsa é da qualidade, ocasional (inferência).
- **Essencial:**
  - Busca por nome popular, comercial, inglês e código.
  - "Produto não reconhecido": o termo vai para a fila técnica e trava até definição.
  - "Fila técnica" com "Classificar" e "Pedir detalhe a quem registrou".
  - Versão gravada na decisão ("a VG-2455 foi decidida na v2026.06 e assim permanece").
  - Bloqueio de colisão de apelido.
- **Excesso:**
  - Card "Os nove vereditos possíveis", legenda sem decisão.
  - "Simular outro compartimento" com três compartimentos fixos: a simulação real é a viagem.
  - Modal "Catálogo de produtos e matriz de limpeza" e modal "Criar produto na base" dentro do cliente. Governar a base é da Traxium (INV/console-traxium: "a base normativa é produto da Traxium e serve todos os clientes"); dois caminhos de criação com efeitos opostos mostram o custo de não decidir (RF 8, pergunta 4).
  - Popover de versões sem ação; menu "⋯" com três toasts, sendo "Histórico deste produto" repetido no drawer.
- **Falta:**
  - A regra da norma escrita: produto não classificado na IDTF não pode ser carga anterior (TS1.9, em MERC).
  - O mais rigoroso entre esquemas quando o destinatário é de outro esquema (TS1.9 3.1).
  - Regras por cliente ou destinatário (DMK, Bunge, em MERC).
- **Problemas de fluxo:**
  - Direção da regra inconsistente entre catálogo ("carga anterior → limpeza exigida" antes deste produto), proposta ("regime que ele exige de quem vem depois") e drawer ("regime após carga"). Numa base que decide carga, é erro de regra.
  - A matriz por cinco grupos de carga anterior simplifica a IDTF, que define o regime pela carga anterior específica (inferência a conferir na tabela IDTF).
  - Edição salva aparece como "vigente / v2026.07" na hora, contra "entra na próxima versão".
  - "Pedir detalhe" tira da fila um termo que, segundo o texto, segue bloqueado.
- **Veredito:** rebaixar. Prioridade média. Consulta e fila técnica ficam acessíveis pela viagem (produto não reconhecido) e por item secundário; catálogo, matriz e versões vão para o Console Traxium.
- **Confiança:** média. A norma sustenta as regras; quem governa a base é decisão de negócio (pergunta 10).

### 2.6 Subcontratados

- **Trabalho que atende:** manter TACs e conjuntos recorrentes com documentos válidos; certificados de transportadoras certificadas (UT 3.2); "seleção de transportadores" e "controle por documento" do procedimento de afretamento (EVID 2.4). Usuários: qualidade e afretador.
- **Essencial:**
  - Busca por CPF, CNPJ, placa e telefone (hoje só nome, documento e vínculo funcionam).
  - Duplicidade por dígitos; as três portas (cadastrar, convidar, importar) terminando no mesmo estado.
  - "Estado nunca é editado à mão"; consulta automática à base pública da certificadora.
  - Vínculo de conjunto com data; "Não existe excluir: arquivar preserva tudo".
  - "Suspender" com motivo e vigência.
- **Excesso:**
  - Funil "Estados de qualificação" com nove estados por empresa. A qualificação do TAC é por motorista e compartimento a cada viagem (EVID 2.4 e 4); estado por empresa só faz sentido para ETC recorrente.
  - Drawer "Passaporte Feed Safety" com selos ("trilhas vigentes", "ocorrências 12m") e "Apto para" (grãos e farelos, minerais, operação Gatekeeper), categorias sem fonte.
  - Certificado com número e sites cobertos exibido para TAC: TAC sob gatekeeper não tem certificado.
  - "Exportar passaporte" e "Renovar acordo" no menu da linha e no drawer.
  - Sete tipos de vínculo no cadastro, três na lista, três em Motoristas.
- **Falta:**
  - Por TAC: CPF, RNTRC, CNH, telefone, conjuntos com placa de cavalo e de cada carreta e CRLV com validade, termo de compromisso (EVID 2.4: "RNTRC, CRLV, declaração das três últimas cargas, declaração de conformidade, termo de compromisso, treinamento").
  - Cobertura em três valores: certificado GMP+ com escopo e especificação, equivalente aceito, sob gatekeeper (MERC; S9.1).
  - Notificação ao organismo certificador antes do primeiro gatekeeper (TS1.2 4.4.1; EVID 2.4). É dado da empresa contratante; cabe em Configurações.
  - Viagens feitas por aquele transportador e conjunto: o auditor parte da viagem e chega ao subcontratado.
  - Status do convite na própria linha (MERC, Sixfold).
- **Problemas de fluxo:**
  - Cadastro manual só aceita CNPJ, mas oferece "TAC autônomo"; convite sem CPF e sem vínculo.
  - "Importar planilha" quebra (método inexistente).
  - Nenhuma porta cria linha; "Arquivar" promete reativação inexistente.
  - Funil soma 212 para 10 linhas; nove das dez linhas abrem o mesmo drawer. Com milhares de TACs, a entrada precisa ser busca por CPF ou placa, não funil.
- **Veredito:** simplificar. Prioridade alta. Vira a base de transportadores: TAC (pessoa mais conjunto) e ETC (empresa, motoristas, conjuntos), com documentos e validade, histórico de viagens e status de convite. Estado de empresa só para ETC. Absorve Motoristas (2.9) e os convites de Acessos externos (2.8).
- **Confiança:** alta (EVID 2.4 e 4; TS1.2 4.4.1).

### 2.7 Onboarding público

- **Trabalho que atende:** "Motorista TAC sem instalar app: link público com manual, três últimas cargas, assinatura" (UT 5; EVID 2.4: "recebe o manual GMP no celular ... e assina digitalmente").
- **Essencial:**
  - Link sem conta e sem senha por WhatsApp ou QR; "Pode parar no meio e voltar".
  - Passo 4 "As três últimas cargas" por boca, com "Não lembro" como resposta válida.
  - Passo 6 com regras, aceite e assinatura.
  - Linguagem de quem dirige; finalidade LGPD declarada no passo 1.
- **Excesso:**
  - Passo 2 com sete vínculos, incluindo "Sou da frota da empresa" e "Faço afretamento": o link é para o TAC, e as respostas não mudam nada nos passos seguintes.
  - Passo 5 com quatro regimes declarados pelo motorista: na operação observada a condição é avaliada pelo afretador e o regime é seco (EVID 2.1, 2.4). Pode virar pergunta única (inferência).
  - Moldura 7 pedindo "O certificado da sua empresa" a todos e "Um treinamento de 40 minutos": o TAC sob gatekeeper não tem certificado, e o treinamento exigido é o manual lido na viagem. Regra mal enunciada.
- **Falta:**
  - Contexto da viagem: ordem ou CT-e, produto, embarcador, placas. Termo e verificação têm data por viagem (EVID 2.4); o link real é por viagem.
  - Manual para leitura antes de assinar, com versão e registro de ciência (Quali-e: "Você deve visualizar o documento de treinamento antes de assinar", MERC).
  - Termo de compromisso como documento assinado, com hash e verificação pública (Quali-e, Lei 14.063/2020, MERC).
  - Reaproveitamento por CPF: na segunda viagem, confirmar placas e T-3 (Trizy, MERC).
  - RNTRC, foto da CNH e CRLV na primeira vez; página de revisão antes de enviar.
- **Problemas de fluxo:**
  - Nenhum botão avança; "boca 1 de 2" sem boca 2; passo 5 sem indicar a boca.
  - Termina em "Pré-cadastrado" sem dizer quem recebe nem o que acontece. O desfecho que importa (viagem com T-3 e termo, pronta para a verificação do afretador) não foi desenhado.
  - O convidante "Cerrado Cargas" é uma ETC terceira em Subcontratados; URL diferente da de Subcontratados.
- **Veredito:** simplificar. Prioridade alta. Vira o link da viagem do TAC: identificação (reaproveitada por CPF), placas, T-3 por compartimento, manual, termo e assinatura, alimentando a mesa do afretador.
- **Confiança:** alta (EVID 2.4; MERC, Quali-e).

### 2.8 Acessos externos

- **Trabalho que atende:** nenhum identificado como trabalho próprio. O convite é passo de outros trabalhos (cadastrar transportador, mandar link da viagem), e o auditor "não opera o sistema, pede e alguém mostra" (UT 2).
- **Essencial:** revogação com motivo obrigatório e data; estados do convite (enviado, aberto, aceito, expirado, revogado); o que cada acesso "não vê".
- **Excesso:**
  - A tela como destino de navegação, com KPIs "Onde os convites param" e "TAC com acesso duplo".
  - Cards "As três superfícies de fora" e "De onde vem cada convite" (quantidades fixas; explicam o produto em vez de servir um trabalho).
  - "Visão do auditor" e "Portal do subcontratado" como superfícies: nenhuma das duas aparece na operação observada (manual e assinatura por link).
- **Falta:** nada que justifique a tela; o que é útil cabe nas listas.
- **Problemas de fluxo:**
  - "Convidar" só oferece quatro pessoas fixas; não se convida ninguém novo.
  - Contradiz Subcontratados (7 contra 14 dias; canais diferentes) e Motoristas (diz que Motoristas gera convite e que desvincular revoga; Motoristas não faz nenhum dos dois).
  - "Papel ativo" e "Sair" não abrem.
- **Veredito:** cortar. Prioridade média. Status e reenvio de convite vão para a linha do transportador; link de leitura do auditor, se mantido, fica no Dossiê; o log de acessos externos vai para Configurações.
- **Confiança:** alta para sair da navegação (UT 2; MERC, Acessos externos). Média quanto a um portal para ETC (pergunta 3).

### 2.9 Motoristas

- **Trabalho que atende:** motoristas próprios (checklist, assinatura, treinamento registrado; UT 2) e a qualificação motorista a motorista do TAC (EVID 2.4).
- **Essencial:**
  - "Por que este estado?" com a conta visível (CNH, vínculo, empresa elegível).
  - Vínculo com data e "O anterior foi preservado no histórico".
  - CPF mascarado; cadastro que "nasce pendente".
- **Excesso:**
  - Card "Trilhas obrigatórias", "Enviar reciclagem" e estado "Reforço obrigatório": dependem da Academy (2.10).
  - KPIs fixos (42, 34, 5, 3) e card permanente "Como o estado nasce".
- **Falta:**
  - Número e validade da CNH (não estão nos dados), telefone, RNTRC quando TAC, tipo TAC.
  - Viagens do motorista com data do termo e da ciência do manual em cada uma.
  - Lista de treinamento datada para o motorista próprio (EVID 2.5).
- **Problemas de fluxo:**
  - Cadastro sem empresa, sem CNH, sem telefone e sem convite; categoria fixa "E".
  - "Alterar vínculo" troca a empresa e mantém tipo e estado.
  - Oito cartões sem paginação; a grade não serve para centenas de TACs.
  - A mesma pessoa com identidades diferentes em quatro telas (3.7).
- **Veredito:** fundir com Subcontratados. Prioridade média. O motorista vira registro dentro da base de transportadores (TAC, ETC, frota própria).
- **Confiança:** média. A qualificação por motorista é evidência; uma base única é inferência (pergunta 3).

### 2.10 Academy

- **Trabalho que atende:** em tese, "treinamentos registrados com data e participante" (UT 3.2) e o manual lido pelo TAC (EVID 2.4). A tela não faz nenhum dos dois.
- **Essencial:** versão do conteúdo gravada em cada ciência ("versão gravada em cada conclusão"); exportação do relatório de treinamento.
- **Excesso:**
  - Dez trilhas, nota mínima 7,0, duas tentativas, reforço obrigatório, matriz motorista por trilha, "Disparos just-in-time", card "Acionado pelo risco", "Enviar em massa". Nenhum requisito pede trilha, prova ou nota ao motorista (MERC, Academy; EVID 4: "O registro exigido é a lista de treinamento com data; para o TAC, o manual lido e assinado na viagem").
  - A regra R-08 "Competência do motorista" derivada de trilha, que se espalha por Viagens (Valdir Nunes não selecionável), Torre (VG-2492), Inspeções (despacho) e Motoristas.
- **Falta:**
  - Registro de treinamento em lista: data, tema, instrutor, participantes, anexo (EVID 2.5).
  - Manual GMP versionado, o mesmo que o link da viagem mostra (2.7).
- **Problemas de fluxo:** criar, editar, versionar e arquivar trilha só por toast; drawer igual para as dez trilhas; 46, 42 e 7 motoristas conforme o bloco.
- **Veredito:** rebaixar e reduzir. Prioridade alta, porque a regra de trilha contamina quatro outras telas. Na primeira versão ficam (a) manual versionado com ciência registrada na viagem, que já cumpre "motorista sem competência comprovada não aparece como elegível" para o TAC, e (b) registro simples de treinamentos da equipe e dos motoristas próprios, ambos fora da navegação principal. R-08 passa a ser "ciência do manual vigente registrada nesta viagem". Trilhas com avaliação, nota e tentativas ficam para uma segunda versão, como evolução do mesmo registro.
- **Confiança:** média. A evidência de auditoria (EVID 2.4, 2.5, 4) e o mercado (MERC) apontam para corte; a diretriz do P.O. (pilar 2) pede a sala virtual e trata o treinamento ligado à liberação como diferencial. Ver seção 6.

### 2.11 Ativos e frota

- **Trabalho que atende:** manter a lista de veículos no escopo GMP+, com placa do cavalo e de cada compartimento (gestor de frota e qualidade, UT 3.2; EVID 2.1).
- **Essencial:**
  - Separação cavalo, implemento e compartimento; "o histórico é do compartimento".
  - Vínculo com data e "Trocar vínculo nunca apaga histórico".
  - Duplicidade por placa e chassi; importação com conflito; bloqueio de placa repetida no "Novo ativo"; ativo novo com "T-3 nasce vazio".
- **Excesso:**
  - KPIs fixos "Cavalos mecânicos 72", "Implementos 96", "Aptidão da frota agora 89%".
  - "Plano de regularização / C2", quarta cópia do mesmo plano.
  - "Inspeção estrutural agendada" e "laudo de inspeção do implemento" com reagendamento: sem base na auditoria, que mostra checklist de manutenção por motorista (EVID 2.1). Pode ser documento do cliente, não regra GMP+ (inferência).
  - Conjuntos de Lima, Cerrado e TAC na mesma lista da frota: terceiros vivem melhor na base de transportadores.
- **Falta:**
  - Flag "no escopo GMP+" por conjunto, com data de entrada e saída (EVID 2.1: quatro conjuntos no escopo; EVID 4: "o veículo precisa dizer se está ou não").
  - Placa de cada carreta ou compartimento (2 a 4 placas; EVID 2.4).
  - Checklist de manutenção por motorista ligado ao veículo (EVID 2.1); CRLV com validade.
  - Paginação e busca por chassi (o placeholder promete).
- **Problemas de fluxo:**
  - "Novo ativo" pede placa de implemento, bloqueia placa de cavalo, não pede cavalo nem chassi; 2 ou 3 compartimentos geram só "C1".
  - "Trocar vínculo" anuncia cavalo por implemento e troca a empresa; aceita dono "bloqueado por reincidência".
  - "Unificar" trata vínculo duplo como duplicata.
  - Seis conjuntos sem paginação contra 96 nos KPIs.
- **Veredito:** simplificar. Prioridade alta. Lista da frota própria com flag de escopo, placas e documentos; conjuntos de terceiros na base de transportadores; compartimento como detalhe.
- **Confiança:** alta (EVID 2.1).

### 2.12 Compartimento Detalhe

- **Trabalho que atende:** journey sheet por compartimento, com T-3 e limpezas datadas (TS1.9 4.3, em MERC); resposta ao auditor sobre um compartimento da frota própria.
- **Essencial:**
  - "Histórico de cargas" com T-1 a T-3 e viagem de origem.
  - "Limpezas registradas" e "Inspeções realizadas"; "Inspeção enviada não se edita".
  - "Proprietário hoje" com a regra "uma viagem de maio aponta para quem era dono em maio".
  - Limpeza retroativa marcada como tal, com justificativa.
- **Excesso:**
  - Card "Integridade da cadeia" com hashes e botão "Verificar integridade": não há evidência de que auditores peçam hash (MERC, Dossiê). A integridade fica no motor e na exportação.
  - "Ficha do implemento" com material e conservação, sem decisão associada.
- **Falta:**
  - Exportar o journey sheet (hoje toast).
  - Estado de quarentena após carga proibida.
  - Distinção entre carga registrada em viagem própria e carga declarada por terceiro.
- **Problemas de fluxo:** sempre C1 / SQT 9E18, inclusive para tanque e para C2 travado; limpeza C ou D sem cor; "Pátio próprio" aceita regime C; retificação só por toast.
- **Veredito:** manter. Prioridade média, como detalhe de Ativos e frota.
- **Confiança:** alta quanto ao conteúdo (TS1.9 4.3; EVID 2.1). Prioridade média porque o volume observado é afretado e o T-3 do TAC vem da declaração.

### 2.13 Inspeções

- **Trabalho que atende:** verificação de conformidade do compartimento antes do carregamento, feita e lançada pelo afretador (EVID 2.4); checklist do compartimento antes de cada carregamento na frota própria (EVID 2.1).
- **Essencial:**
  - Checklist com três respostas e item crítico que reprova sozinho.
  - Checklist por tipo de implemento.
  - Registro com data, responsável, GPS e assinatura; correção como evento.
- **Excesso:**
  - Tela própria com "No pátio, esperando inspeção" e "Despachar inspeção" para um inspetor de pátio. Esse papel não aparece na operação real; quem inspeciona é o afretador (EVID 2.4 e 4).
  - Card "Cobertura fotográfica" e KPI "Aprovadas na primeira inspeção": medem fotografia, não segurança da carga.
  - Seis ângulos obrigatórios com "a inspeção não fecha com ângulo faltando": regra sem fonte na norma nem na auditoria.
- **Falta:**
  - Os itens verificados de fato: lonas, correntes, cintas, carroceria, condições externas, interior (EVID 2.4).
  - Vocabulário de campo: tampas das bicas, fueiros, kit de limpeza (MERC).
  - Tipos distintos: autoinspeção, inspeção inicial e periódica do gatekeeper, liberação após carga proibida (MERC, Inspeções).
- **Problemas de fluxo:**
  - Título "Inspeções pré-carregamento" e card "Checklist vigente" sugerem exigência GMP+ de inspeção externa antes de carregar. A LCI não se aplica ao rodoviário (TS1.9 3.2.1, em MERC). Regra mal enunciada.
  - Despacho não cria nada; "Retificar" sem formulário; INS-4470 com o mesmo hash da inspeção do SQT 9E18; "QAS 7C31" usado como compartimento.
- **Veredito:** fundir com Viagem Detalhe. Prioridade alta. A verificação vira passo da viagem, preenchido pelo afretador na mesa ou no celular; o modelo de checklist vai para Configurações.
- **Confiança:** alta (EVID 2.4; TS1.9 3.2.1).

### 2.14 Limpezas

- **Trabalho que atende:** limpeza quando o regime exige mais que seco, com comprovante do lavador (UT 4, item 6); fornecedores de lavagem homologados (EVID 2.5).
- **Essencial:**
  - Regime derivado do par ("O regime não se escolhe").
  - "Carga anterior proibida não tem botão de lavado".
  - Credenciamento limitando o executante ("Credenciamento não se contorna no formulário").
  - Comprovante pendente que impede o fechamento; retroativa marcada.
- **Excesso:**
  - Tela própria com KPIs fixos (14, 3, 2, 1), "A escada dos regimes" (A 4, B 8, C 13, D 19 campos) e card de bloqueio técnico fixo, dimensionada para regimes C e D frequentes. A operação observada usa só seco, mesmo com fertilizante e sulfato de amônio como cargas anteriores (EVID 2.1, 2.2).
  - "Cobrar comprovante" dirigido ao "Pátio próprio".
- **Falta:**
  - Lavador como fornecedor homologado: CNPJ, licença ambiental, laudo de potabilidade, validade (Quali-e, MERC; lista de fornecedores, EVID 2.5).
  - Registro simples de limpeza seca feita pelo motorista, o caso mais comum.
  - Comprovante por foto, PDF ou QR (MERC).
- **Problemas de fluxo:** registrar não entra na lista; a regra "abaixo não" não é aplicada (o T1 aceita A); registros com campo faltando aparecem como "lacrado"; o par milho e farelo de soja pede B no app e A aqui.
- **Veredito:** fundir com Viagem Detalhe. Prioridade média. Registro de limpeza na viagem e no compartimento; "comprovante pendente" vira filtro em Viagens; lavadores vão para um cadastro de fornecedores.
- **Confiança:** média. O regime seco é evidência de um cliente; clientes com tanque podem usar C e D (pergunta 2).

### 2.15 Não conformidades

- **Trabalho que atende:** "Mostrar que as NCs da auditoria anterior foram fechadas" (UT 3.3). Essas NCs vivem no formulário da consultoria (EVID 2.5 e 4). Ocorrência operacional (carga proibida, resíduo) pertence à viagem.
- **Essencial:**
  - Ligação da ocorrência grave com a viagem bloqueada; "Fechar a NC não libera a viagem".
  - Reincidência por transportador como sinal de qualificação.
- **Excesso:**
  - Ciclo completo (ação imediata, causa raiz, ação corretiva, verificação de eficácia) para toda ocorrência: duplica o SGQ e a consultoria (MERC: "Exportar NC e evidência em vez de virar SGQ").
  - Severidades crítica, maior e menor aplicadas a ocorrências de operação. São as categorias da CR2.0 para NC de auditoria, com prazos de 2 semanas, 6 semanas e próxima auditoria (EVID 2.6). Regra deslocada.
  - Cards "Por categoria, em 90 dias" e KPIs.
- **Falta:** se algo ficar, exportação de ocorrências com evidência no formato do formulário da consultoria.
- **Problemas de fluxo:** "Abrir NC" não aparece na lista; o modal de eficácia é inalcançável; "Avançar a etapa" só toast; abertura sem responsável nem prazo; a ordem declarada não é a exibida.
- **Veredito:** cortar. Prioridade média. Ocorrência vira evento da viagem (foto e descrição) e conta na linha do transportador; NC de auditoria fica no SGQ do cliente.
- **Confiança:** alta (EVID 2.5, 2.6, 4; MERC).

### 2.16 Dossiê de auditoria

- **Trabalho que atende:** "Rastrear qualquer placa ou período em até 4 horas" e "Mostrar uma amostra de viagens gatekeeper com todos os documentos" (UT 3.3; EVID 2.2, 2.4).
- **Essencial:**
  - Filtro por período, placa, produto e status; seleção da amostra.
  - Reconstrução "como estava na data da viagem, não como está hoje".
  - "Bloco sem dado mostra a ausência".
  - Exportação em planilha e pacote.
- **Excesso:**
  - Dezesseis blocos por viagem encadeados por hash, com "HASH RAIZ", "Verificar cadeia" e "Reprocessar bloco". O auditor confere 7 a 9 itens por viagem (EVID 4).
  - "Compartilhar com auditor": o auditor não opera o sistema (UT 2).
  - Subtítulo "menos de dois minutos, sem WhatsApp": a exigência real é 4 horas para rastrear.
- **Falta:**
  - Busca por placa ou período que liste as viagens com data, CT-e, embarcador e destinatário, produto e NF: o teste literal (EVID 2.2). O filtro "Código ou placa" só oferece valores prontos e não filtra.
  - Por viagem, os itens anotados pelo auditor: NF, DACTE com declaração positiva, filial, subcontratado com RNTRC, motorista, placas, T-3 com datas, data do termo, data da verificação (EVID 2.4).
  - Recorte frota própria e afretamento; pacote da amostra num documento único.
  - Na mesma visita o auditor pede frota no escopo e treinamentos (EVID 3), ao menos como exportação.
- **Problemas de fluxo:** filtros só trocam rótulo; abas sempre VG-2455, VG-2412 e VG-2344; blocos iguais nas três; VG-2412 muda de produto e rota; "Gerar dossiê desta viagem" (Viagem Detalhe) não chega aqui.
- **Veredito:** simplificar. Prioridade alta. Vira rastreabilidade e amostra: busca por placa, CT-e, NF ou período, lista de resultado, seleção e exportação. O conteúdo por viagem continua sendo a lista do "Dossiê automático" da diretriz do P.O. (ordem, motorista, transportador, cavalo, implemento e compartimento, três últimas cargas, limpezas, decisão IDTF, checklist, fotos, assinaturas, acordo, treinamentos, exceções, aprovações, documentos), com os itens que o auditor anota em primeiro plano. O encadeamento por hash continua no dado, como garantia de imutabilidade, e sai do primeiro plano da tela.
- **Confiança:** alta (EVID 2.2, 2.4; R1.0).

### 2.17 Indicadores

- **Trabalho que atende:** indicadores e análise crítica da direção (UT 2: "objetivos acompanhados no Quali-e"; EVID 2.5).
- **Essencial:** fórmula e origem de cada número; "não medido" honesto; link do card para a lista filtrada.
- **Excesso:**
  - Os quatro "Não medidos" (tempo de cadastro, de checklist, fotos rejeitadas, tempo de dossiê): instrumentação do produto, que interessa à Traxium. Pertencem ao Console.
  - Hero "COBERTURA DA MEDIÇÃO 11 de 15", repetido no badge e no card da sidebar.
  - Indicadores que medem o desenho do protótipo, como "Liberações com registro completo" ("100% por construção") e "Viagens com evidência fotográfica completa".
- **Falta:** os números que a direção usa, por filial e período: viagens asseguradas, viagens com documentação completa, documentos de terceiros vencendo, tempo do teste de rastreabilidade (inferência a validar).
- **Problemas de fluxo:** filial e período não mudam valores; números divergem da Torre e de Exceções (3 contra 1 bloqueio técnico; 1h 48min contra 1h 09min).
- **Veredito:** rebaixar. Prioridade baixa. Poucos números com escopo escrito, acessíveis a partir do painel da qualidade; os não medidos vão para o Console.
- **Confiança:** média (sem evidência direta de quais indicadores a direção acompanha).

### 2.18 Configurações

- **Trabalho que atende:** parametrizar filiais, equipe e regras (qualidade e administração); notificar o organismo certificador (UT 3.2).
- **Essencial:**
  - Regras com classe e piso; as travadas com motivo; "Mudar uma regra hoje não altera decisão histórica".
  - LGPD com base legal e efeito de revogar; política de inativação que declara o que se preserva.
  - Filiais com escopo; integrações com base pública, WhatsApp e ERP.
- **Excesso:**
  - Card "As cinco superfícies do produto", que explica o produto e linka o Console.
  - Matriz "Papel × permissão" com papéis diferentes dos do modal "Papel ativo" e sem afretador.
  - "Tokens de API" e "Telemetria de rastreamento" no MVP (inferência: cabem depois).
- **Falta:**
  - Filial como unidade, com registro GMP+ próprio, afretador responsável e escopo (EVID 1).
  - Lista de usuários (há só a matriz).
  - Registro da notificação ao organismo certificador sobre o gatekeeper (TS1.2).
  - Modelos: termo de compromisso, manual GMP versionado, checklist de verificação, texto da declaração positiva do CT-e (EVID 2.3).
  - Fornecedores homologados ligados à operação (lavagem).
  - Retenção mínima de três anos declarada (R1.0).
- **Problemas de fluxo:** classe de regra muda sem confirmação e sem registro de quem mudou; "Convidar da equipe" sem formulário; revogações sem confirmação; o toast de afretamento aparece para filiais de escopo feed.
- **Veredito:** simplificar. Prioridade média.
- **Confiança:** média.

### 2.19 Console Traxium

- **Trabalho que atende:** nenhum do cliente. É ferramenta da Traxium (contrato, faixa, módulos, base IDTF).
- **Essencial:** "a Traxium vê uso e contrato, nunca conteúdo de decisão"; pedido de acesso nominal com expiração; base IDTF como produto da Traxium.
- **Excesso:** módulos com nomes de pilares que esta revisão corta ("Academy", "Network e ativos").
- **Falta:** governança da base IDTF vinda do Motor (catálogo, sinônimos, versões, impacto em decisões abertas; MERC, Console); indicadores de instrumentação vindos de Indicadores.
- **Problemas de fluxo:** "6 de 5 clientes"; modal "Sair" mostra Rafael Antunes; números da base divergentes dos do Motor.
- **Veredito:** manter. Prioridade baixa; revisar depois do back-office.
- **Confiança:** alta.

### 2.20 App de campo

- **Trabalho que atende:** motorista próprio (checklist do veículo e do compartimento, limpeza seca, assinatura; UT 2). O motorista TAC não instala nada (UT 2; EVID 2.4) e é atendido pelo link da viagem (2.7). O afretador, que verifica o compartimento no pátio do cliente (EVID 2.4), não tem tela.
- **Diagnóstico do conjunto:**
  - Doze telas para um caminho que no mercado tem cinco passos: escolher a viagem, checklist com câmera, resumo, assinar, enviado (MERC, Apps de campo).
  - O app supõe o motorista que inspeciona e o motor que libera ("Carga liberada! O motor conferiu as 12 condições e liberou às 11:04, sem precisar de ninguém"). Na operação observada, quem inspeciona e libera é o afretador ou a qualidade.
  - Nenhuma tela leva a outra; checklist de 6 itens anunciado como "8 itens"; Ivan Prado "elegível" pela Lima, suspensa em Subcontratados e na NC-0409.
- **Veredito do conjunto:** simplificar. Prioridade média. **Confiança:** média (pergunta 4).

| # | Tela | Trabalho | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| 1 | Minhas viagens | Motorista próprio vê a viagem do dia | manter | Absorve a sincronização como estado por item (tela 6). Sai a aba "Perfil" com trilhas; a aba "Lavagem" deixa de ser destino e vai para dentro do bloqueio (tela 5) |
| 2 | A viagem de hoje | Ver T-3 e limpeza antes de começar | manter | Mostrar placas e ordem ou CT-e junto do T-3 do compartimento |
| 3 | Checklist | Checklist do compartimento | manter | Trocar os itens pelos verificados de fato (lona, correntes, cintas, carroceria, interior, bica) e pelo vocabulário de campo |
| 4 | Câmera antifraude | Evidência fotográfica | fundir com 3 | Modo de câmera dentro do item; nenhum produto faz disso etapa (MERC) |
| 5 | Bloqueio que explica | Entender por que não carrega e o que fazer | manter | Peça central; lavadores próximos filtrados pelo regime exigido |
| 6 | Fila de sincronização | Nenhum trabalho próprio | fundir com 1 | Status por item na lista é o padrão (MERC) |
| 7 | Fim do ciclo: liberada | Saber que terminou | simplificar | Dizer "enviado à filial" ou "recebido"; a liberação não é do app |
| 8 | Pós-captura | Nenhum trabalho próprio | cortar | Nenhum produto tem revisão separada; o aviso de nitidez vai para a tela 3 |
| 9 | Assinatura | Assinar a declaração | manter | Vira resumo, declaração e assinatura numa tela |
| 10 | Resolver divergência | Nenhum trabalho próprio | cortar | Registro com um autor não tem conflito de edição; divergência vira mensagem |
| 11 | Contingência: código | Entrar sem login | simplificar | Entrada por CPF e código; queda do servidor é caso raro |
| 12 | Inspetor de pátio | Verificação do compartimento | fundir com Torre de Controle | O papel real é o afretador (EVID 2.4); a tela vira a versão de celular da mesa do afretador |

### 2.21 Torre de Controle v1

Arquivo histórico sem link e ainda publicado (INV/torre-de-controle-v1): cortar da publicação. Prioridade baixa, confiança alta.

## 3. Diagnóstico transversal

### 3.1 Entrada de terceiros e acesso

- **Hoje:** cinco portas que não conversam (MAPA 3.6). Subcontratados tem cadastro por CNPJ, convite por nome e telefone com link de 7 dias e importação quebrada; Onboarding termina em "Pré-cadastrado"; Motoristas cria "Pendente" sem empresa nem convite; Acessos externos convida por papel com link de 14 dias; Dossiê convida auditor por e-mail. Nenhuma lista mostra se o registro tem convite pendente.
- **O que a evidência pede:** o terceiro que importa é o TAC, e ele entra pela viagem. O afretador contrata, manda o link, o TAC informa T-3, lê o manual e assina; o afretador verifica o compartimento (EVID 2.4). O cadastro do TAC é efeito colateral da primeira viagem e se reaproveita por CPF nas seguintes.
- **Proposta:** uma porta principal (link da viagem, disparado da mesa do afretador) e uma secundária (cadastro ou importação na base de transportadores, que nasce como "não convidado", padrão Sixfold em MERC). Status do convite na linha do transportador. O auditor não recebe acesso por padrão (UT 2); se um cliente pedir, o link de leitura nasce no Dossiê.
- **Regra a corrigir:** "Pré-cadastrado" exige do TAC "o certificado da sua empresa" (INV/onboarding-publico, moldura 7). Sob gatekeeper, a cobertura é a da contratante; o que o TAC precisa é RNTRC, CRLV, CNH, termo e ciência do manual (EVID 2.4).

### 3.2 Identidade de viagem, veículo e compartimento

- **Viagem:** o protótipo usa o código interno VG-nnnn em toda parte. O mundo real usa CT-e (e DACTE), nota fiscal, placas e embarcador e destinatário (EVID 2.2 e 4). A VG pode existir como chave interna, mas a primeira coluna, a busca e o título da viagem precisam ser CT-e ou ordem mais placas.
- **Veículo:** a mesma placa troca de papel. QAS 7C31 é cavalo em Ativos, compartimento em Inspeções e Limpezas, conjunto da Lima em Subcontratados e cavalo de Ivan Prado no Onboarding (MAPA 3.5). O conjunto real tem de 2 a 4 placas (EVID 2.4); cada carreta tem placa e CRLV próprios (MERC, Ativos).
- **Compartimento:** é identificado por placa da carreta mais posição (C1, C2), nunca pela placa do cavalo. O modelo "o histórico é do compartimento" está certo; falta aplicá-lo de forma consistente.
- **Pessoa:** CPF é a chave do motorista e do TAC; CNPJ é a chave da ETC. Hoje a mesma pessoa tem quatro CPFs (3.7).

### 3.3 Filial: unidade, não filtro

- Na empresa auditada, cada filial tem registro GMP+ próprio e afretador próprio (EVID 1 e 2.4). No protótipo, filial é rótulo: Exceções, Inspeções, Limpezas, Indicadores e Não conformidades mostram "recalculado" e mantêm os números (MAPA 3.3); só a Torre filtra.
- O seletor tem listas diferentes por tela (Rio Verde GO em umas, "Todas as filiais" em outras); o perfil diz "Filiais: Rondonópolis, Sorriso" e o menu oferece quatro.
- **Proposta:** a filial do usuário define o escopo padrão (afretador vê a sua; qualidade da matriz vê todas). Filtro de filial só onde a pessoa tem mais de uma, e sempre filtrando os dados. Viagem, protocolo gatekeeper e CT-e pertencem a uma filial; a base de transportadores pode ser compartilhada (pergunta 9).

### 3.4 Listas em escala

- **Volumes reais:** mais de 100 protocolos gatekeeper declarados (o relatório cita também 4.000), oito filiais, frota no escopo pequena (EVID 1, 2.1, 2.4).
- **Hoje:** paginam Viagens, Subcontratados, Acessos externos e Limpezas (esta sem chegar a mostrar). Não paginam Motoristas (grade de cartões), Academy, Inspeções, Não conformidades, Exceções, Torre e Ativos (6 itens contra 96 nos KPIs) (MAPA 3.8).
- **Quem quebra com 80 registros:** Motoristas (cartões), Ativos e frota (lista expansível sem paginação), Subcontratados (funil como filtro primário não serve com milhares de TACs; a entrada tem de ser busca por CPF, placa ou nome), Dossiê (seleção de amostra a partir de lista fixa de 4).
- **Regra:** telas de registro paginam com total visível e busca pela chave do mundo real; a fila de trabalho do dia não pagina, mas filtra por "falta algo" (RF 2.4). KPIs no topo de lista precisam declarar o escopo (MERC, UX B2B).

### 3.5 O registro fixo

- Toda viagem abre VG-2490; todo compartimento abre C1 / SQT 9E18; o Dossiê reconstrói sempre as mesmas três viagens com os mesmos blocos; o drawer de subcontratado só tem conteúdo próprio para a Lima; a trilha abre sempre a 05 (MAPA 3.1).
- **Consequência para a revisão:** não dá para verificar se as telas de detalhe servem aos casos que dominam a operação real. O único caso desenhado em profundidade é uma viagem de ETC bloqueada por certificado suspenso, que a auditoria não mostrou acontecer. O caso dominante, uma viagem afretada de TAC, liberada, com T-3 declarado no link, regime seco, termo assinado e verificação feita pelo afretador, não existe em tela nenhuma.
- **Antes de redesenhar:** a próxima versão precisa de pelo menos três viagens completas e distintas: TAC sob gatekeeper liberado; frota própria com T-3 do histórico; bloqueio por carga anterior proibida com a liberação conforme TS1.9.

### 3.6 Perfil e papéis

- Há duas versões de "Meu perfil" e de "Preferências" (das telas e do shell), "Papel ativo" que não persiste e que em Acessos externos não abre, e "Sair" que não sai (MAPA 3.7; INV/shell-global).
- Os papéis do modal "Papel ativo" (Inspetor de pátio, Tráfego, Gestor, Diretoria e RT, Auditor interno) não são os da matriz de Configurações (Qualidade, Despacho, Diretoria, Terceiros, Auditoria); o nível 4 tem três grafias; Exceções assina tudo como Diretoria e RT.
- **Nenhum desses papéis é o afretador**, e o inspetor de pátio não aparece na operação real (EVID 2.4).
- **Proposta (inferência a validar):** cinco papéis, alinhados a UT 2: afretador (filial), qualidade (matriz, todas as filiais), gestor de frota, direção (assina exceções), consultoria (leitura e exportação, vários clientes). Alçada de liberação como atributo do papel, com três níveis no máximo. Um menu de perfil só, do shell.

### 3.7 Consistência de dados

Divergências que fazem o protótipo parecer errado diante de quem conhece a operação (MAPA 3.4 e 3.5):

- Bloqueios técnicos abertos: 3 em Indicadores, 1 na Torre. Idade média da fila: 1h 48min contra 1h 09min.
- Motoristas: 46, 42, 8 e 7 conforme a tela. Base IDTF: 1.240 produtos e 8.900 sinônimos no Motor; 1.284 e 3.911 no Console.
- João Bortolini com quatro identidades (TAC "Apto", agregado da Cerrado, TAC com CPF por extenso, "J. Bortolini Transportes" com CNPJ). Ivan Prado é próprio da Transrural, motorista da Cerrado e motorista da Lima.
- O par milho para farelo de soja exige B no app e A em Limpezas. Posto Trevo muda de cidade e de regime máximo.
- A empresa que convida é Cerrado Cargas no Onboarding e Transrural Log em Acessos externos; a Lima é elegível no app e suspensa em Subcontratados.
- Datas: "Terça, 5 ago" e "Quarta, 6 ago" para o mesmo "hoje"; 5 de agosto de 2026 é quarta-feira.

**Proposta:** uma massa de dados única (uma contratante, quatro filiais, dez transportadores, trinta viagens) usada por todas as telas, gerada de um arquivo só. É pré-requisito para a etapa 5 ser avaliável.

### 3.8 A mesa do afretador

- **O que é:** a fila de trabalho do afretador da filial, que "inspeciona o compartimento e lança os dados" (EVID 2.4), várias viagens por dia na safra, com prazo de minutos antes do carregamento (UT 2 e 3.1).
- **Onde está hoje:** espalhada. Documentos do TAC em Subcontratados; T-3 no Onboarding; verificação em Inspeções (despachada a um inspetor que não existe); assinatura no App de campo; viagem em Viagens; pendências na Torre, que só mostra exceções.
- **O que a mesa precisa mostrar por viagem:** ordem ou CT-e, embarcador e destinatário, produto, placas, motorista ou TAC; e o estado de cada passo: documentos do TAC e do conjunto válidos, link enviado, T-3 recebido e regime calculado, verificação do compartimento feita, termo e manual assinados, CT-e emitido com declaração. Ações: mandar o link, preencher a verificação (inclusive no celular), liberar, registrar ocorrência.
- **Base:** a fila e o bloco "EVIDÊNCIAS ESSENCIAIS" da Torre já têm essa forma; falta trocar o objeto (todas as viagens do dia, não só exceções) e os passos (os da auditoria, não os do protótipo).

### 3.9 O que é do sistema de gestão e fica fora do Traxium

- **Fora:** manual de boas práticas, política, objetivos e análise crítica, APPCC, procedimento de emergência e EWS, controle de documentos externos, auditoria interna, ação corretiva de auditoria, descrição de cargos e homologação de fornecedores que não tocam a viagem (auditoria, controle de pragas, manutenção). Tudo isso vive em documentos da consultoria e é verificado por amostra (EVID 2.5). Os SGQs genéricos já cobrem NC, plano de ação e fornecedor (MERC).
- **Dentro, porque toca a viagem:** frota no escopo, base de transportadores e conjuntos, T-3, verificação, termo, manual com ciência, limpeza e lavador, declaração positiva do CT-e, rastreabilidade e amostra.
- **Fronteira:** registro de treinamentos e ocorrências. O Traxium registra o que nasce na viagem (ciência do manual, ocorrência) e exporta no formato que a consultoria usa; não reproduz o ciclo de ação corretiva nem um LMS.
- **Consequência:** Não conformidades e Academy saem; Indicadores encolhe; a consultoria vira usuária (leitura e exportação em vários clientes), o que também serve ao canal de venda (UT 2).

## 4. Quadro final

| Tela | Veredito | Prioridade | Confiança | Razão |
| --- | --- | --- | --- | --- |
| Torre de Controle | simplificar | alta | média | Vira a mesa do afretador e o painel da qualidade; fila de viagens do dia com o que falta, não só exceções |
| Viagens | manter | alta | alta | É a tela de rastreabilidade; falta a identidade real (CT-e, NF, placas, RNTRC) e exportação por placa e período |
| Viagem Detalhe | simplificar | alta | alta | Núcleo da decisão; sai rastreio e ciclo de balança, entram os itens que o auditor confere |
| Exceções e liberações | fundir com Torre de Controle | média | média | Registro de 9 campos é bom, mas fila própria duplica a Torre e a matriz de 6 níveis excede a operação |
| Motor IDTF | rebaixar | média | média | Regra serve à viagem; governança da base é da Traxium e vai para o Console |
| Subcontratados | simplificar | alta | alta | Qualificação real é por motorista e conjunto a cada viagem; vira base de transportadores |
| Onboarding público | simplificar | alta | alta | Vira o link da viagem do TAC: T-3, manual, termo e assinatura |
| Acessos externos | cortar | média | alta | Convite é passo de outro trabalho; auditor não opera o sistema |
| Motoristas | fundir com Subcontratados | média | média | Motorista é registro dentro da base de transportadores |
| Academy | rebaixar e reduzir | alta | média | Exigência real é lista de treinamento e manual assinado; trilhas com prova ficam para a segunda versão, por respeito ao pilar 2 da diretriz |
| Ativos e frota | simplificar | alta | alta | Falta flag de escopo GMP+ e placas de cada compartimento; terceiros saem da lista |
| Compartimento Detalhe | manter | média | alta | Journey sheet exigido pela TS1.9; hash sai da tela |
| Inspeções | fundir com Viagem Detalhe | alta | alta | Verificação é passo da viagem feito pelo afretador; LCI não se aplica ao rodoviário |
| Limpezas | fundir com Viagem Detalhe | média | média | Operação observada usa só seco; registro na viagem e lavador como fornecedor |
| Não conformidades | cortar | média | alta | NCs que contam vivem no formulário da consultoria; ocorrência vira evento da viagem |
| Dossiê de auditoria | simplificar | alta | alta | Teste real é busca por placa em 4 horas e amostra com 7 a 9 itens, não 16 blocos com hash |
| Indicadores | rebaixar | baixa | média | Mede o produto, não os objetivos do cliente; não medidos vão para o Console |
| Configurações | simplificar | média | média | Falta filial como unidade, usuários, modelos de termo, manual e declaração do CT-e |
| Console Traxium | manter | baixa | alta | Ferramenta interna; recebe a governança da base IDTF |
| App de campo | simplificar | média | média | Doze telas para cinco passos; TAC usa link, afretador inspeciona |
| Torre de Controle v1 | cortar | baixa | alta | Histórico sem link ainda publicado |

Contagem: manter 3; simplificar 8; fundir 4; rebaixar 3; cortar 3.

## 5. Perguntas para o Rafael

1. **Em quantas viagens por mês alguém precisa liberar algo fora da regra, e quem assina?** Se for frequente e com mais de um nível de alçada, Exceções volta a ser tela própria; se for raro, confirma a fusão com a Torre e a matriz de três níveis.
2. **Algum cliente em vista usa tanque ou regimes C e D com frequência?** Se sim, Limpezas mantém tela própria e a escada de campos por regime; se não, confirma a fusão com a Viagem.
3. **Quanto do afretamento é TAC e quanto é ETC recorrente com motoristas próprios? A ETC precisa de portal para manter documentos?** Define se o estado de empresa e um portal do subcontratado sobrevivem (Subcontratados, Acessos externos) e se Motoristas se funde na base de transportadores.
4. **A verificação de conformidade é sempre do afretador, ou o motorista preenche em alguns casos? Ela leva fotos? O afretador faz isso no celular, no pátio do cliente?** Define o destino de Inspeções, a tela 12 do app (inspetor), os seis ângulos e se a mesa do afretador precisa de versão de celular.
5. **Quem emite o CT-e com a declaração positiva, em que sistema, e em que momento em relação à verificação?** Define se a viagem nasce no Traxium ou vem do TMS (Viagens, Configurações) e se a declaração é gerada ou só conferida.
6. **O auditor da Control Union alguma vez pediu acesso direto a um sistema, ou sempre pede e alguém mostra?** Confirma o corte de Acessos externos e do "Compartilhar com auditor" do Dossiê.
7. **Para o TAC, basta o manual lido e assinado na viagem? Para a equipe interna, a lista de treinamento fica no Traxium ou na consultoria?** Confirma o corte da Academy e define onde vive o registro de treinamentos.
8. **O cliente quer registrar no Traxium as ocorrências operacionais (lona rasgada, resíduo, carga proibida declarada), e em que formato a consultoria precisa recebê-las?** Confirma o corte de Não conformidades e define a exportação.
9. **A base de TACs e conjuntos é compartilhada entre filiais? O afretador de uma filial vê viagens de outra?** Define o escopo de filial (Torre, Subcontratados, Configurações) e os papéis.
10. **Quem mantém a lista de produtos e regimes: a Traxium para todos os clientes, ou cada cliente com a própria Qualidade?** Define se catálogo e matriz saem do Motor IDTF para o Console ou continuam no cliente.

## 6. Onde o diagnóstico diverge da diretriz do P.O.

A diretriz dos 5 pilares é do P.O. e foi escrita antes da auditoria de agosto de 2026. Onde a evidência de auditoria aponta para outro lado, o diagnóstico não decide sozinho: registra a divergência e propõe um caminho que preserva a intenção da diretriz.

| Ponto da diretriz | O que a evidência mostra | Caminho proposto |
| --- | --- | --- |
| Pilar 2: sala virtual com vídeo, avaliação, nota, tentativas e certificado; "motorista sem competência comprovada não aparece como elegível" | O auditor pediu lista de treinamento com data e, para o TAC, manual lido e assinado na viagem | Primeira versão: manual versionado com ciência na viagem e registro de treinamentos. Trilhas com prova como segunda versão, sobre o mesmo registro. A regra de elegibilidade continua, com critério mais simples |
| Pilar 1: estados de qualificação da empresa subcontratada (9) e Passaporte Feed Safety | Para TAC, a qualificação é por motorista e compartimento a cada viagem | Estados de empresa ficam para ETC recorrente; para TAC, o "passaporte" é o histórico das viagens dele, montado a partir dos registros de cada viagem |
| Pilar 4: dossiê automático com 16 itens; evidência imutável | O auditor confere 7 a 9 itens por viagem e testa rastreio por placa | Os 16 itens continuam como conteúdo; a tela passa a começar pela busca e pela amostra; hash fica no dado, fora do primeiro plano |
| Pilar 4: hierarquia de autoridade com seis papéis | Nenhuma exceção apareceu na auditoria; formulários de concessão do mercado usam cerca de três alçadas | Manter o registro de 9 campos e o bloqueio técnico sem aprovação; reduzir as alçadas exibidas às que o cliente configurar |
| §8: 15 indicadores do MVP | A direção acompanha objetivos próprios (pontualidade, satisfação, treinamento) | Indicadores do produto vão para o Console; o cliente vê os que servem aos objetivos dele |

Estas cinco linhas são decisões de produto para o Gabriel e o Rafael, não ajustes de tela.
