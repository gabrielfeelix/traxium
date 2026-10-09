# App de Campo

Arquivo: App de Campo.dc.html. Item da sidebar: "Protótipo mobile" (bloco inferior da sidebar das telas web, badge "12 telas"). Perfil a quem se destina (pelo que a tela diz): título do canvas "App de campo | motorista"; telas 1 a 11 usam o motorista Ivan Prado ("motorista | Lima Logística | CNH ****4407"); a tela 12 é "Versão do inspetor de pátio", com Jorge Mattos ("inspetor de pátio | Rondonópolis"). Objetivo declarado na tela: "Android de entrada, sinal instável, uma ação principal por vez. Offline-first é requisito de conformidade. O checklist da tela 3 é interativo: toque nos itens."

Formato: canvas (meta `design_doc_mode` = canvas) com 12 molduras Android (393 × 830 px) lado a lado, cada uma com rótulo numerado acima. Não há sidebar, cabeçalho web nem navegação entre as molduras.

Nota de grafia: nos rótulos citados, o separador de ponto médio usado pela interface aparece substituído por barra vertical (|).

## Entradas e saídas

- Como se chega: item "Protótipo mobile" da sidebar de Limpezas.dc.html e Nao Conformidades.dc.html. Demais origens: ver mapa do site.
- Para onde leva:
  - Tela 1, aba "Lavagem": botão "Rota ›" de cada um dos 3 pontos abre, em nova aba, https://www.google.com/maps/search/lava+jato+Rondon%C3%B3polis+MT (mesmo endereço para os 3 pontos).
  - Nenhum link para telas do protótipo web. Nenhum botão leva de uma moldura a outra.
  - Recursos externos carregados: Leaflet 1.9.4 (unpkg) e tiles do CARTO (basemaps.cartocdn.com) para o mapa.

## Estrutura da tela

Cabeçalho do canvas: "App de campo | motorista" e o texto de objetivo citado acima. Abaixo, 12 molduras numeradas.

### Tela 1: "1 | Minhas viagens" (motorista)

- Topo: avatar "IP", "Boa tarde, Ivan", "1 viagem hoje | tudo salvo no aparelho", sino com ponto vermelho (abre notificações).
- Faixa de sincronização: "Salvo no aparelho | esperando sinal" com contador "2" (fixo).
- Barra de abas inferior: "Viagens", "Lavagem", "Perfil" (aba ativa em degradê).
- Aba "Viagens" (padrão):
  - Seção "HOJE".
  - Card VG-2490: chip "checklist pendente", "Farelo de soja | 37 t", "Sorriso MT → Uberlândia MG | carrega amanhã, 06:30", chips "B limpeza com água" e "compart. C1", botão "Começar checklist".
  - Card VG-2496 (opacidade reduzida): chip "amanhã", "Calcário calcítico | 28 t", "Nobres MT → Sinop MT | 08:00".
  - Card "Lavagem perto de você", "Higitrans a 12 km | aberta agora", seta "›" (leva à aba Lavagem).
- Aba "Lavagem":
  - Mapa Leaflet (200px) com marcador "IP" ("Você está aqui") e 3 pinos com popup: "Higitrans" "regime D | 12 km | aberta"; "LavaMax BR-364" "regime D | 31 km | aberta"; "Posto Trevo" "regime B | 44 km | fecha 18h". Chip sobreposto "3 pontos num raio de 45 km".
  - Seção "MAIS PERTO PRIMEIRO", 3 cards: nome, meta, chip "regime X", chip de situação, botão "Rota ›". Ex.: "Higitrans", "BR-163, km 118 | Sorriso MT | 12 km", "regime D", "aberta agora". Demais: "LavaMax BR-364" "Rondonópolis MT | 31 km" "regime D" "aberta agora"; "Posto Trevo | box de lavagem" "Nova Mutum MT | 44 km" "regime B" "fecha às 18h".
  - Nota: "Para a VG-2490 (regime B), qualquer uma das três serve. O comprovante da estação entra direto no registro da limpeza."
- Aba "Perfil":
  - Card: avatar "IP", "Ivan Prado", "motorista | Lima Logística | CNH ****4407", chips "✓ 10 trilhas vigentes" e "✓ elegível".
  - Card "Minhas trilhas": "1 vence em 40 dias", barra a 90%, "9 vigentes | Regimes de limpeza vence em 14 set".
  - Lista: "Meus documentos ›", "Trocar usuário" ("aparelho compartilhado"), "Sair" (vermelho).
- Popover "Notificações" (sobre a aba ativa): link "fechar" e 2 itens: "VG-2490 aguarda decisão da Qualidade" "sua ocorrência foi recebida | há 1h"; "Trilha "Regimes de limpeza" vence em 40 dias" "reciclagem de 45 min disponível offline | ontem".
- Conteúdo fixo, exceto troca de abas e popover.

### Tela 2: "2 | A viagem de hoje" (motorista)

- Topo: "‹", "VG-2490", chip "salvo".
- Card escuro "o que você leva": "Farelo de soja | 37 t", "para NutriMax Rações, Uberlândia MG", chips "carrega amanhã 06:30" e "compartimento C1".
- Card "ANTES DE CARREGAR", 3 passos: "✓ Limpeza B feita" "Higitrans | ontem 17:40"; "2 Checklist do compartimento" "8 itens | 3 a 5 minutos" (clicável, abre folha); "3 Fotos e assinatura" "libera depois do checklist" (cinza).
- Card clicável "C1" "Últimas cargas deste compartimento" "milho | casca de soja | farelo de soja" (abre folha).
- Botão "Continuar | checklist".
- Folha inferior "Últimas cargas | C1": "as três últimas definem a limpeza de hoje"; T-1 "Milho a granel" "31 jul | descarga Uberlândia MG" selo B; T-2 "Casca de soja" "24 jul | descarga Rio Verde GO" selo A; T-3 "Farelo de soja" "18 jul | descarga Chapecó SC" selo A; nota "Milho antes de farelo de soja pede limpeza com água (B). Já registrada ontem na Higitrans."
- Folha inferior "Checklist do C1 | 8 itens": "itens do graneleiro; tanque teria válvula e mangote"; 6 linhas: "Sem resíduos visíveis" crítico, "Sem odores estranhos" crítico, "Sem pragas" crítico, "Lona íntegra e limpa", "Bica de descarga limpa" crítico, "Vedações e borrachas | + 2 itens"; botão "Começar agora | 3 a 5 min".
- Conteúdo fixo.

### Tela 3: "3 | Checklist (interativo: toque nos itens)" (motorista)

- Topo: "‹", "Checklist | compartimento C1", chip "salvo".
- Faixa de resultado calculada: "Reprovada" "item crítico não conforme: a carga não segue"; "Aprovada com pendência" "N item não crítico para corrigir"; ou "Aprovada" "resultado calculado ao vivo enquanto você preenche".
- Lista de 6 itens, cada um com ícone (✓, ✕ e um ponto), nome, linha de criticidade ("crítico: reprova sozinho" ou "não crítico: vira pendência") e chip de estado ("conforme", "não conforme", "não se aplica"): Sem resíduos visíveis, Sem odores estranhos, Sem pragas, Lona íntegra e limpa, Bica de descarga limpa, Vedações e borrachas.
- Legenda "toque para alternar: conforme → não conforme → não se aplica".
- Botão inferior: "Registrar ocorrência" (fundo escuro) quando há crítico não conforme; senão "Fotos e assinatura →".
- Estado inicial: Sem pragas "não se aplica", Bica de descarga "não conforme", demais "conforme"; resultado inicial "Reprovada".

### Tela 4: "4 | Câmera antifraude" (motorista, pelo contexto do fluxo da VG-2490)

- Moldura escura. Topo: "‹", "Foto 5 de 6 | bica de descarga".
- Visor: área de imagem substituível (image-slot "app-camera-bica", placeholder "arraste uma foto do compartimento aqui"), cantos de enquadramento, chip "GPS ✓", carimbo "06 ago | 10:52", rótulo "Bica de descarga" "enquadre a bica aberta dentro das marcas", seletores "1x", "2x", "⚡ auto", aviso "galeria bloqueada | hash + marca d'água automáticos".
- Rodapé: pilha de miniaturas com selo "4", botão obturador, contador "5/6" "restam 2".
- Conteúdo fixo; nenhum elemento tem ação.

### Tela 5: "5 | Bloqueio que explica" (motorista)

- Topo: "‹", "VG-2487 | bloqueada", chip "bloqueio".
- Card central: ícone, "Esta carga não pode seguir", "O compartimento C2 levou ureia pecuária na última viagem. Farelo de amendoim depois de ureia é combinação proibida. Não é multa sua: é a regra que protege a ração."
- Card "O QUE FAZER AGORA": "1 Registrar a ocorrência (2 toques, já preenchida)", "2 Levar a uma estação de limpeza qualificada", "3 A Qualidade acompanha; você não precisa ligar".
- Card "LAVAGEM PERTO DE VOCÊ": "Higitrans | Rondonópolis" "regime D credenciada | 12 km | aberta" "Rota ›"; "LavaMax BR-364" "regime D credenciada | 31 km | aberta" "Rota ›".
- Botão "Registrar ocorrência".
- Conteúdo fixo; nenhum elemento tem ação.

### Tela 6: "6 | Fila de sincronização" (motorista)

- Topo: "‹", "Sincronização".
- Card de progresso: "Sinal voltou | subindo registros", barra a 64%, "2 de 3 enviados | 480 KB restantes".
- Lista de 4 itens: "✓ Checklist VG-2490" "sincronizado 10:58 | edição travada"; "✓ 6 fotos do compartimento C1" "sincronizadas 10:59 | hash conferido"; "↑ Assinatura + geolocalização" "sincronizando…" com spinner; "! Limpeza VG-2481 | divergente" "o servidor discorda do carimbo local | toque para resolver" com "›".
- Nota: "Divergência é um estado próprio, nunca um erro silencioso. Depois de sincronizado, o registro trava: correção vira evento novo."
- Conteúdo fixo; nenhum elemento tem ação.

### Tela 7: "7 | Fim do ciclo: liberada" (motorista)

- Ícone de sucesso, "Carga liberada!", "O motor conferiu as 12 condições e liberou às 11:04, sem precisar de ninguém. Boa viagem, Ivan."
- Card com 3 linhas: "Checklist aprovado" 10:58; "6 fotos com hash e marca d'água" 10:59; "Assinatura sincronizada" 11:02.
- Nota: "Siga para a doca 4 do armazém Boa Safra. Quando a viagem concluir, esta carga vira o T-1 do compartimento."
- Botões "Ir para o carregamento" e "Ver resumo da viagem".
- Conteúdo fixo; nenhum elemento tem ação.

### Tela 8: "8 | Pós-captura (interativo: refazer / confirmar)" (motorista)

- Moldura escura. Título "Revise a foto | bica de descarga".
- Área de foto (placeholder hachurado com ícone de câmera), chip "GPS e hora carimbados", rodapé "hash 7c1f…a940 | marca d'água VG-2490 | 06 ago 10:52", chip "nitidez baixa detectada" (só na primeira tentativa).
- Botões "Refazer" e botão principal com rótulo variável.
- Nota inferior variável.
- Estado 1 (inicial): chip de nitidez baixa visível, botão "Usar mesmo assim", nota "a nitidez baixa fica declarada no registro se você confirmar".
- Estado 2 (após "Refazer"): chip some, botão "Confirmar foto 5 de 6", nota "refeita: nitidez ok | hash novo gerado, o anterior fica no histórico".

### Tela 9: "9 | Assinatura (interativo: toque no quadro)" (motorista)

- Título "Assine para fechar o checklist", "VG-2490 | farelo de soja | compartimento C1".
- Card "VOCÊ DECLARA": "Que executou o checklist do C1 pessoalmente, que as 6 fotos retratam o estado real do compartimento e que não houve carga não declarada desde a última limpeza."
- Quadro de assinatura tracejado: vazio mostra "toque e assine com o dedo"; assinado mostra traço, "Ivan Prado | assinado agora" e "GPS -12.5453, -55.7211 | 11:02".
- Botão com 3 estados: "Assine antes de enviar" (cinza), "Enviar assinatura" (degradê), "✓ Assinatura enviada" (verde).

### Tela 10: "10 | Resolver divergência (interativo)" (motorista)

- Card âmbar "Limpeza VG-2481 | divergente": "O carimbo salvo no seu aparelho diz 17:40; o servidor recebeu da estação 18:05. Os dois registros existem; escolha qual vale, com justificativa."
- 2 opções exclusivas: "Vale o carimbo do aparelho" "registrado por você, no local, offline" "17:40"; "Vale o carimbo da estação" "enviado pela Higitrans ao servidor" "18:05".
- Campo de texto, placeholder "justificativa, ex.: fila na estação atrasou o carimbo".
- Nota: "Nenhum registro é apagado: a resolução vira um terceiro evento apontando para os dois, com autor e hora."
- Botão "Resolver divergência", que vira "✓ Divergência resolvida".
- Sem cabeçalho nem botão voltar.

### Tela 11: "11 | Contingência: entrada por código" (motorista)

- Faixa escura: "Sistema central indisponível" "modo contingência: tudo salva no aparelho e reconcilia depois".
- Card "Entre com o código da viagem", "está impresso na ordem de carregamento e no QR da balança", 6 caixas de caractere, botão "Simular digitação" (vira "Código completo ✓").
- Ao completar: card "✓ VG-2490 encontrada no cache", "Checklist, fotos e assinatura funcionam offline. A decisão do motor sai quando o sistema voltar; até lá a carga não segue sem a última decisão válida."
- Nota inferior: "Papel nunca substitui o registro: a contingência captura tudo com carimbo local e reconcilia como evento, nunca por edição."
- Não há teclado nem leitura de QR; só a simulação.

### Tela 12: "12 | Versão do inspetor de pátio" (inspetor de pátio)

- Topo: avatar "JM", "Jorge Mattos", "inspetor de pátio | Rondonópolis", chip "trilha 6 vigente".
- Seção "FILA DO PÁTIO | 3", 3 cards:
  - "VG-2494", chip "falta 1 ângulo", "Capturar: bica de descarga | C1", "RXQ 4B19 | doca 2 | a viagem reavalia sozinha após a foto", botão "Abrir câmera".
  - "SQT 1C55", chip "8 ago | 07:30", "Inspeção estrutural agendada", "caçamba | 1 compartimento | checklist de 8 itens".
  - "VG-2487" (opacidade reduzida), chip "aguarda limpeza D", "Inspeção pós-limpeza | C2", "libera para captura quando a Higitrans concluir amanhã, 14:00".
- Nota: "O inspetor só vê o que exige olho qualificado. Captura assinada entra lacrada no registro da viagem."
- Conteúdo fixo; nenhum elemento tem ação.

## Ações

| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Sino | Tela 1, topo | muda estado | Abre/fecha o popover "Notificações". |
| "fechar" | Tela 1, popover | muda estado | Fecha o popover. |
| "VG-2490 aguarda decisão da Qualidade" | Tela 1, popover | muda estado | Fecha o popover e vai para a aba "Viagens". |
| "Trilha "Regimes de limpeza" vence em 40 dias" | Tela 1, popover | muda estado | Fecha o popover e vai para a aba "Perfil". |
| Abas "Viagens", "Lavagem", "Perfil" | Tela 1, rodapé | muda estado | Troca o conteúdo; também fecha o popover. |
| Card "Lavagem perto de você" | Tela 1, aba Viagens | muda estado | Vai para a aba "Lavagem". |
| "Começar checklist" | Tela 1, card VG-2490 | nada | Sem handler. |
| Mapa | Tela 1, aba Lavagem | muda estado | Zoom por roda do mouse, arrasto, popups nos pinos. |
| "Rota ›" | Tela 1, aba Lavagem | navegação externa | Google Maps, nova aba, mesmo endereço para os 3 pontos. |
| "Meus documentos", "Trocar usuário", "Sair" | Tela 1, aba Perfil | nada | Sem handler. |
| "Checklist do compartimento" | Tela 2 | folha inferior | Abre a folha "Checklist do C1 \| 8 itens". |
| Card "Últimas cargas deste compartimento" | Tela 2 | folha inferior | Abre a folha "Últimas cargas \| C1". |
| Fundo escurecido da folha | Tela 2 | muda estado | Fecha a folha. Não há botão de fechar. |
| "Começar agora \| 3 a 5 min" | Tela 2, folha | nada | Sem handler. |
| "‹", "Continuar \| checklist" | Tela 2 | nada | Sem handler. |
| Item do checklist | Tela 3 | muda estado | Cicla conforme → não conforme → não se aplica; faixa de resultado e botão recalculam ao vivo. |
| "Registrar ocorrência" / "Fotos e assinatura →" | Tela 3 | nada | Cursor de clique, sem handler. |
| "‹" | Telas 2, 3, 4, 5, 6 | nada | Sem handler. |
| Obturador, miniaturas, "1x", "2x", "⚡ auto" | Tela 4 | nada | Sem handler. |
| "Rota ›", "Registrar ocorrência" | Tela 5 | nada | Sem handler ("Rota ›" é texto, não link). |
| "Limpeza VG-2481 \| divergente" | Tela 6 | nada | Texto diz "toque para resolver", sem handler. |
| "Ir para o carregamento", "Ver resumo da viagem" | Tela 7 | nada | Sem handler. |
| "Refazer" | Tela 8 | muda estado | Passa para o estado 2 (nitidez ok). |
| "Usar mesmo assim" / "Confirmar foto 5 de 6" | Tela 8 | nada visível | O handler regrava o mesmo estado; nada muda na tela. |
| Quadro de assinatura | Tela 9 | muda estado | Mostra assinatura simulada com nome, GPS e hora. Não há como limpar. |
| "Enviar assinatura" | Tela 9 | muda estado | Só funciona após assinar; vira "✓ Assinatura enviada". Sem volta. |
| Opções de carimbo | Tela 10 | muda estado | Seleção exclusiva. |
| Campo justificativa | Tela 10 | muda estado | Texto livre. |
| "Resolver divergência" | Tela 10 | muda estado | Exige opção escolhida e justificativa com 10 ou mais caracteres (limite não exibido); vira "✓ Divergência resolvida". Sem volta. |
| "Simular digitação" | Tela 11 | muda estado | Acrescenta 2 caracteres por toque ("VG", "VG24", "VG2490"); no terceiro toque mostra o card "VG-2490 encontrada no cache". Sem volta. |
| "Abrir câmera" | Tela 12 | nada | Sem handler. |

Folhas inferiores (tela 2): ver estrutura acima; não têm campos nem botões funcionais, fecham pelo fundo. Não há modais, toasts nem drawers nas outras telas.

## Estados e simulações

- Loading/skeleton: não há. Animação de entrada ("subir") nos cards das telas 1, 5 e 7. Spinner fixo em "sincronizando…" (tela 6).
- Vazio: não há.
- Erro / exceção representados como telas: bloqueio de carga (tela 5), divergência de sincronização (telas 6 e 10), sistema central indisponível (tela 11), checklist reprovado (tela 3), nitidez baixa (tela 8).
- Estado de sinal: "Salvo no aparelho | esperando sinal" (tela 1), "Sinal voltou | subindo registros" (tela 6), chips "salvo" (telas 2 e 3).
- Estados iniciais simulados no código: checklist com bica "não conforme" e pragas "não se aplica" (reprovado); foto na primeira tentativa (nitidez baixa); assinatura vazia; divergência sem escolha; código vazio; aba "Viagens".
- Sem props ou alternadores de cenário.

## Entidades e operações

- Viagem (VG-2490, VG-2496, VG-2487, VG-2494, VG-2481): consultar; localizar por código em contingência (simulado).
- Compartimento e histórico T-3: consultar (folha "Últimas cargas").
- Checklist: preencher itens (tela 3, interativo, sem gravação); consultar itens (folha da tela 2).
- Foto / evidência: capturar (tela 4, sem ação), revisar, refazer, confirmar (tela 8).
- Assinatura: assinar e enviar (tela 9, simulado).
- Ocorrência: registrar (botões nas telas 3 e 5, sem ação).
- Fila de sincronização: consultar (tela 6); resolver divergência (tela 10).
- Limpeza: consultar status (tela 2) e divergência de carimbo (tela 10).
- Estação de lavagem: consultar no mapa e em lista, abrir rota externa.
- Motorista: consultar perfil, trilhas e elegibilidade (tela 1, aba Perfil).
- Notificação: consultar e abrir destino (tela 1).
- Inspeção (fila do inspetor): consultar (tela 12).
- Decisão de liberação: consultar resultado (tela 7).

## Regras de negócio visíveis

- Offline-first: tudo salva no aparelho e sincroniza quando houver sinal.
- Item crítico não conforme reprova sozinho; item não crítico vira pendência.
- As três últimas cargas (T-1 a T-3) definem a limpeza do dia.
- Par proibido (ureia pecuária → farelo de amendoim) impede a carga.
- Galeria bloqueada; hash e marca d'água automáticos; GPS e hora carimbados na foto.
- Foto com nitidez baixa pode ser usada, mas a condição fica declarada no registro; refazer gera hash novo e o anterior fica no histórico.
- Fotos e assinatura só liberam depois do checklist.
- Assinatura declara execução pessoal do checklist, veracidade das 6 fotos e ausência de carga não declarada desde a última limpeza.
- Registro sincronizado trava; correção vira evento novo.
- Divergência é estado próprio; resolução vira terceiro evento com autor e hora, com justificativa.
- Em contingência, a decisão do motor só sai quando o sistema voltar; a carga não segue sem a última decisão válida.
- A carga liberada vira o T-1 do compartimento ao concluir a viagem.
- O motor libera sozinho após conferir "12 condições".
- O inspetor só vê o que exige olho qualificado; captura assinada entra lacrada no registro da viagem.

## Observações factuais

- O título do canvas é "App de campo | motorista", mas a tela 12 é do inspetor de pátio. O texto de abertura cita só o checklist da tela 3 como interativo; as telas 1, 2, 8, 9, 10 e 11 também têm interação.
- Não há navegação entre as 12 molduras: "Começar checklist", "Continuar | checklist", "Começar agora", "Fotos e assinatura →", "Registrar ocorrência", "Abrir câmera", "Ir para o carregamento", os "‹" e o item divergente da tela 6 não têm ação.
- A folha da tela 2 diz "Checklist do C1 | 8 itens" e o passo diz "8 itens"; a tela 3 tem 6 itens.
- Perfil do motorista: o chip diz "✓ 10 trilhas vigentes" e o card "Minhas trilhas" diz "9 vigentes". O card diz "1 vence em 40 dias" e "Regimes de limpeza vence em 14 set" com a data da câmera "06 ago" (diferença de 39 dias).
- Notificação "VG-2490 aguarda decisão da Qualidade" / "sua ocorrência foi recebida" convive com o card VG-2490 "checklist pendente" e com a tela 7, em que a VG-2490 é liberada pelo motor "sem precisar de ninguém".
- Faixa da tela 1 mostra "2" itens esperando sinal; a tela 6 diz "2 de 3 enviados" e lista 4 itens.
- Na tela 8, a nota após "Refazer" diz "hash novo gerado", mas o hash exibido continua "7c1f…a940". O botão principal não muda nada na tela em nenhum dos estados.
- As telas 9, 10 e 11 não têm volta: assinatura enviada, divergência resolvida e código completo permanecem até recarregar.
- A divergência resolvida na tela 10 não altera o item "Limpeza VG-2481 | divergente" da tela 6.
- O GPS da assinatura ("-12.5453, -55.7211") coincide com a posição do pino da Higitrans no mapa (-12.545, -55.721), e não com a posição "Você está aqui" (-12.63, -55.85).
- Dados das estações divergem dentro do arquivo: o card da aba Viagens diz "Higitrans a 12 km"; a lista da aba Lavagem põe a Higitrans em "BR-163, km 118 | Sorriso MT | 12 km"; a tela 5 diz "Higitrans | Rondonópolis" a 12 km. LavaMax BR-364 aparece em "Rondonópolis MT | 31 km". Em Limpezas.dc.html, Higitrans é "Rondonópolis MT | 4 km do pátio" e LavaMax é "Sorriso MT | 128 km".
- O Posto Trevo aparece aqui como "Posto Trevo | box de lavagem", "Nova Mutum MT | 44 km", "regime B" (popup do mapa: "regime B | 44 km | fecha 18h"); em Limpezas.dc.html é "Posto Trevo Lavagem", "Lucas do Rio Verde MT | 62 km", credenciado "até C".
- Os três botões "Rota ›" da aba Lavagem abrem a mesma busca "lava jato Rondonópolis MT" no Google Maps, independente da estação.
- A nota da aba Lavagem diz que, para a VG-2490 (regime B), "qualquer uma das três serve" e que "O comprovante da estação entra direto no registro da limpeza"; em Limpezas.dc.html o Posto Trevo não aparece como executante possível no modal.
- Regime do par milho → farelo de soja: aqui, C1 da VG-2490 com T-1 "Milho a granel" pede "limpeza com água (B)"; em Limpezas.dc.html, o modal mostra C1 | SQT 7D22 com T-1 "Milho a granel" e carga "Farelo de soja" como "regime A".
- A tela 2 diz "Limpeza B feita | Higitrans | ontem 17:40" para a VG-2490; em Limpezas.dc.html, a limpeza B da Higitrans às 17:40 é a LP-8812, de "hoje", ligada à VG-2494. A divergência da tela 10 (VG-2481) também usa 17:40 como carimbo do aparelho.
- A tela 12 mostra a VG-2494 com placa "RXQ 4B19" e compartimento C1; em Limpezas.dc.html a VG-2494 é do C1 | QAS 7C31.
- A tela 5 (VG-2487, C2, ureia pecuária → farelo de amendoim) traz "Registrar ocorrência" como ação do motorista; em Limpezas.dc.html e Nao Conformidades.dc.html, a ocorrência da VG-2487 já consta como registrada por "Edson Farias, pelo app, hoje 07:52", e a NC-0412 descreve que "o inspetor identificou" o resíduo. A tela 5 orienta "Levar a uma estação de limpeza qualificada"; a tela 12 e o plano de Limpezas dizem que a limpeza D na Higitrans está agendada para "amanhã, 14:00".
- O motorista é "Lima Logística" com "✓ elegível"; em Nao Conformidades.dc.html, a NC-0409 diz que a Lima Logística saiu de Apto por certificado suspenso.
- O inspetor Jorge Mattos aparece com "trilha 6 vigente"; em Nao Conformidades.dc.html, a NC-0407 (responsável Jorge Mattos) tem como ação corretiva em andamento "Trilha 6 de reforço atribuída".
- Pelo código, o mapa da aba Lavagem é inicializado uma única vez (variável `_mapLav`); se o bloco da aba for recriado ao sair e voltar, o mapa não é reinicializado.
- O mapa depende de rede (Leaflet via unpkg e tiles do CARTO), embora a tela declare offline-first.
- Datas: a câmera e a pós-captura marcam "06 ago"; Limpezas.dc.html e Nao Conformidades.dc.html marcam "Terça, 5 ago".
- A tela 6 mostra a assinatura "sincronizando…", e a tela 7 mostra "Assinatura sincronizada 11:02"; a tela 9 mostra a assinatura feita às 11:02.
