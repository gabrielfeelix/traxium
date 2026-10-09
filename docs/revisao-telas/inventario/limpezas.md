# Limpezas

Arquivo: Limpezas.dc.html. Item da sidebar: "Limpezas" (seção OPERAÇÃO, badge "3", item ativo). Perfil a quem se destina (pelo que a tela diz): usuário logado Rafael Antunes, "Gestor de qualidade | GMP+", papel ativo padrão "Gestor de qualidade" (nível 3); a tela não declara outro público. Objetivo declarado na tela: registrar e consultar as limpezas de compartimento por regime A, B, C ou D, com os campos que cada regime exige. Textos que declaram o objetivo: "O regime não se escolhe: vem do par carga anterior × carga atual." (card de KPI) e "o regime vem do par carga anterior × carga atual. O formulário não fecha enquanto os campos daquele regime não existirem." (modal Registrar limpeza).

Nota de grafia: nos rótulos citados, o separador de ponto médio usado pela interface aparece substituído por barra vertical (|).

## Entradas e saídas

- Como se chega: pela sidebar de qualquer tela (item "Limpezas"); em Nao Conformidades.dc.html, pelo botão "Abrir as limpezas" no detalhe da NC-0403. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html, badge 7), "Viagens" (Viagens.dc.html), "Exceções e liberações" (Excecoes.dc.html, badge 5), "Inspeções" (Inspecoes.dc.html, badge 3), "Motor IDTF" (Motor IDTF.dc.html), "Subcontratados" (Subcontratados.dc.html), "Motoristas" (Motoristas.dc.html, badge 42), "Acessos externos" (Acessos Externos.dc.html, badge 2), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html, badge "11/15"), "Não conformidades" (Nao Conformidades.dc.html, badge 4), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html, badge "6 passos"), "Protótipo mobile" (App de Campo.dc.html, badge "12 telas").
  - Card de bloqueio técnico: pílula "VG-2487" leva a Viagem Detalhe.dc.html.
  - Linha da lista: o link "C1 | QAS 7C31" (compartimento e placa) leva a Compartimento Detalhe.dc.html.
  - Detalhe expandido da linha: botão "Ver o compartimento" leva a Compartimento Detalhe.dc.html.
  - Drawer do registro lacrado: botão "Ver no dossiê" leva a Dossie.dc.html.
  - Todos os links são genéricos: o destino não recebe identificador da viagem, do compartimento ou do registro.

## Estrutura da tela

1. Sidebar (largura 264px, recolhível para 84px). Logo "Traxium / Compliance", 17 links agrupados em OPERAÇÃO, PILARES, PROVA e bloco inferior, botão "Recolher menu" e card inferior "Base IDTF Brasil", "v2026.07 vigente", "define o regime mínimo de cada par". Card fixo. O estado recolhido é guardado no navegador (chave `tx-nav`).

2. Cabeçalho. Título "Limpezas". Subtítulo: "Terça, 5 ago | 14 registros no período | 3 comprovantes pendentes | Filial Rondonópolis MT"; só o nome da filial reage ao seletor, o resto é fixo. À direita: campo de busca (placeholder "Buscar placa, compartimento, estação…", chip "⌘K"), seletor "Filial Rondonópolis MT ▾", botão "Exportar", botão "Registrar limpeza", avatar "RA" com menu.

3. Faixa de KPIs (4 cards, todos com valores fixos no código):
   - "Regimes aplicados no período", "14 registros": gráfico de 4 barras A, B, C, D com valores 6, 5, 2, 1 e legenda "A seca | B água | C detergente | D desinfecção. O regime não se escolhe: vem do par carga anterior × carga atual."
   - "Comprovantes pendentes": 3, rodapé "a viagem opera, mas não fecha".
   - "Retroativas justificadas": 2, rodapé "lançadas fora da janela".
   - "Sem regime possível": 1, rodapé "carga anterior proibida".
   Não reagem a filtro, busca ou filial.

4. Card de bloqueio técnico (coluna principal, topo). Título "Nenhum regime resolve este compartimento", chip "BLOQUEIO TÉCNICO", texto "C2 | QAS 7C31 tem ureia pecuária no T-1 e recebeu farelo de amendoim. A base IDTF classifica o par como proibido: não existe A, B, C ou D que libere, e não existe botão de "lavado"." Botões "Plano de regularização" e "VG-2487". Um único card, fixo, não reage a filtro, busca nem filial.

5. Lista "Limpezas registradas". Chips de filtro à direita: "Todas | 5", "Pendentes | 2", "Retroativas | 1", "Regime D | 1" (contagens calculadas sobre os 5 itens do mock). Mock com 5 registros: LP-8812, LP-8809, LP-8805, LP-8801, LP-8796. Por linha (cabeçalho clicável):
   - Selo com a letra do regime (ex.: "B") em degradê da cor do regime.
   - Método (ex.: "Água sob pressão") e link "compartimento | placa" (ex.: "C1 | QAS 7C31").
   - Executante e quando (ex.: "Estação Higitrans | Rondonópolis MT | hoje, 17:40").
   - Chip de situação: "completa", "comprovante pendente" ou "retroativa | justificada".
   - Contador "X de Y campos do regime" (ex.: "7 de 8") com barra de progresso.
   - Chevron de expandir.
   Detalhe expandido (uma linha aberta por vez; LP-8812 abre expandida por padrão):
   - "CAMPOS EXIGIDOS PELO REGIME B": chips com ✓ (preenchido) ou ✕ (faltante), ex.: "✕ foto do interior após".
   - Nota em texto (ex.: "A lavagem aconteceu e a viagem opera. Sem a foto do interior, porém, ela não fecha: registro obrigatório pendente não bloqueia o carregamento, bloqueia a conclusão.").
   - Botões "Abrir registro lacrado", "Cobrar comprovante" (só quando há campo faltante), "Ver o compartimento".
   - "O QUE ESTA LIMPEZA HABILITA": "Carga anterior" (ex.: "Farelo de soja | 2 ago"), "Regime exigido" (ex.: "B | pela base v2026.07"), "Viagem" (ex.: "VG-2494"), "Hash" (ex.: "7b10…44d1").
   Dados dos 5 registros: LP-8812 (B, C1, QAS 7C31, VG-2494, Higitrans, hoje 17:40, pendente, falta "foto do interior após"); LP-8809 (C, T1, RTB 5J18, VG-2489, LavaMax BR-364 Sorriso MT, ontem 14:02, completa); LP-8805 (A, C1, SQT 7D22, VG-2486, Pátio próprio | Milton Costa, ontem 08:15, completa); LP-8801 (D, C3, MJK 2B77, VG-2478, Higitrans, 3 ago 11:20, retroativa); LP-8796 (B, C2, SQT 3A90, VG-2471, Pátio próprio | Paulo Lima, 2 ago 16:48, pendente, faltam "foto do interior após" e "tempo de aplicação").
   Reage a: filtro, busca (procura em código, compartimento, placa, executante e método). Não reage à filial.

6. Paginação: 6 itens por página, com "mostrando X a Y de Z limpezas", "Anterior", números, "Próxima". Com 5 itens no mock, nunca aparece.

7. Rail direito, card "A escada dos regimes", subtítulo "quanto mais alto o degrau, mais o registro exige". 4 degraus clicáveis: A "Seca" "varrição e sopro" 4 campos; B "Água" "lavagem sob pressão" 8 campos; C "Detergente" "água mais detergente food grade" 13 campos; D "Desinfecção" "detergente mais agente aprovado" 19 campos. Abaixo, caixa "REGIME C EXIGE" (C selecionado por padrão) com os chips dos campos do regime escolhido. Lista de campos acumulativa: A = executante, data e hora, método aplicado, responsável pela conferência; B soma local da lavagem, pressão da água, tempo de aplicação, foto do interior após; C soma detergente utilizado, certificação food grade, concentração, tempo de contato, comprovante da estação; D soma agente desinfetante, concentração do agente, tempo de ação, temperatura da água, secagem confirmada, laudo da estação credenciada. Reage apenas ao clique no degrau.

8. Rail direito, card "Estações credenciadas", subtítulo "o credenciamento define até que regime cada uma pode executar". 4 itens: "Estação Higitrans" "Rondonópolis MT | 4 km do pátio" "até D"; "LavaMax BR-364" "Sorriso MT | 128 km" "até D"; "Posto Trevo Lavagem" "Lucas do Rio Verde MT | 62 km" "até C"; "Pátio próprio" "Rondonópolis MT | sem credenciamento C e D" "até B". Rodapé "Pátio próprio não é credenciado para C e D: essas exigem comprovante de estação com laudo." Fixo.

9. Toast inferior central (some após 4,2 s).

## Ações

| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Links da sidebar | Sidebar | navegação | Ver "Para onde leva". |
| "Recolher menu" | Sidebar | muda estado | Alterna largura 264px/84px; esconde rótulos, seções e card; persiste no navegador. |
| Campo de busca | Cabeçalho | muda estado | Filtra a lista ao digitar; volta para página 1. |
| Chip "⌘K" | Cabeçalho | nada | Não há atalho de teclado associado no código. |
| "Filial Rondonópolis MT ▾" | Cabeçalho | popover + toast | Opções: Rondonópolis MT, Sorriso MT, Cuiabá MT, Rio Verde GO. Ao escolher: troca o nome no botão e no subtítulo e mostra "Filial Sorriso MT: registros e estações recalculados." Lista, KPIs e estações não mudam. |
| "Exportar" | Cabeçalho | toast | "Limpezas exportadas com regime, campos preenchidos, executante e hash. Pendentes marcadas, para a estação cobrar comprovante." Sem escolha de formato ou recorte. |
| "Registrar limpeza" | Cabeçalho | modal | Modal Registrar limpeza (abaixo). |
| Avatar "RA" | Cabeçalho | popover | Cabeçalho "Rafael Antunes", "Gestor de qualidade | GMP+"; itens "Meu perfil", "Preferências e notificações", "Papel ativo" (badge com o papel), "Sair". |
| "Plano de regularização" | Card de bloqueio | modal | Modal Plano de regularização. |
| "VG-2487" | Card de bloqueio | navegação | Viagem Detalhe.dc.html. |
| Chips de filtro | Lista | muda estado | Todas, Pendentes (situação pendente), Retroativas, Regime D. Volta para página 1. |
| Cabeçalho da linha | Lista | muda estado | Expande ou recolhe; só uma linha aberta por vez. |
| Link "C1 \| QAS 7C31" | Linha | navegação | Compartimento Detalhe.dc.html; não expande a linha. |
| "Abrir registro lacrado" | Linha expandida | drawer | Drawer do registro (abaixo). |
| "Cobrar comprovante" | Linha expandida (só pendentes) | toast | "Cobrança enviada à Estação Higitrans: faltam 1 campos da LP-8812. Prazo de 24h registrado." Para LP-8796: "Cobrança enviada à Pátio próprio: faltam 2 campos da LP-8796. Prazo de 24h registrado." Sem mudança de estado. |
| "Ver o compartimento" | Linha expandida | navegação | Compartimento Detalhe.dc.html. |
| "Anterior", números, "Próxima" | Paginação | muda estado | Nunca visível com o mock atual. |
| Degrau da escada | Rail | muda estado | Troca a caixa "REGIME X EXIGE". |
| Item de estação | Rail | toast | Ex.: "Estação Higitrans: credenciada até regime D. Acima disso, o registro não aceita esta estação como executante." |
| Esc | Teclado | muda estado | Fecha popovers e modais do perfil. Não fecha o modal Registrar limpeza, o modal Plano nem o drawer. |
| Clique fora | Página | muda estado | Fecha popovers (filial, perfil). |

Modal "Registrar limpeza" (largura 660px; fecha por ✕, "Cancelar" ou clique no fundo):
- Texto: "o regime vem do par carga anterior × carga atual. O formulário não fecha enquanto os campos daquele regime não existirem."
- COMPARTIMENTO (obrigatório, escolha única entre 3): "C1 | SQT 7D22" "T-1: Milho a granel | vai subir: Farelo de soja" chip "regime A"; "C2 | QAS 7C31" "T-1: Ureia pecuária | vai subir: Farelo de amendoim" chip "proibido"; "T1 | RTB 5J18" "T-1: Óleo de palma | vai subir: Óleo de soja degomado" chip "regime C". Trocar o compartimento zera regime, executante e campos.
- Se o compartimento é proibido: aparece caixa "Nenhum regime resolve esta combinação" com o texto "Ureia pecuária no T-1 com farelo de amendoim na sequência é par proibido pela base IDTF. Marcar "lavado" aqui produziria evidência falsa: o caminho é o procedimento formal de liberação, com inspeção qualificada e reavaliação pelo motor." e os quatro regimes riscados, não clicáveis. O botão principal vira "Abrir plano de regularização", que fecha este modal e abre o modal Plano.
- REGIME APLICADO (obrigatório): 4 opções A, B, C, D com subtítulo e número de campos (4, 8, 13, 19). Dica: "escolha o compartimento primeiro" ou "a base exige regime A para este par; regime acima do exigido é permitido, abaixo não". Clicar sem compartimento: toast "Escolha o compartimento antes: o regime mínimo vem do T-1 dele." Trocar o regime zera executante e campos.
- QUEM EXECUTOU (obrigatório, aparece após o regime): "Estação Higitrans | Rondonópolis MT" "credenciada até regime D"; "LavaMax BR-364 | Sorriso MT" "credenciada até regime D"; "Pátio próprio | Rondonópolis" "sem credenciamento para C e D". Cada opção mostra "cobre até D" (verde) ou "só até B" (vermelho). Opção não credenciada fica com opacidade reduzida e, ao clique, toast "Pátio próprio | Rondonópolis não é credenciada para regime C. Credenciamento não se contorna no formulário."
- CAMPOS DO REGIME X (obrigatórios todos): contador "X de Y", barra de progresso e chips clicáveis que alternam entre "+" e "✓". Não há entrada de valor: o chip só marca o campo como preenchido.
- Link "Importar do comprovante da estação →": sem regime, toast "Escolha o regime antes: o comprovante preenche só os campos daquele regime."; sem executante ou com Pátio próprio, toast "Só estação credenciada emite comprovante importável. Pátio próprio preenche à mão."; caso contrário marca os campos de estação do regime e mostra "3 campos vieram do comprovante da estação. Os demais são da conferência de quem recebe." (3 para B, 8 para C, 13 para D, 0 para A).
- Dica no rodapé, em sequência: "Escolha o compartimento para o motor dizer o regime mínimo.", "Escolha o regime aplicado.", "Escolha quem executou.", "Faltam N campos do regime X. O formulário não fecha incompleto.", "Tudo preenchido. O registro nasce lacrado e o motor reavalia a viagem sozinho."; com proibido, "Este compartimento não tem caminho por aqui."
- Botões: "Cancelar" e "Registrar limpeza" (desabilitado visualmente até tudo pronto).
- Ao confirmar: fecha o modal e mostra toast "Limpeza A do C1 registrada por Rafael Antunes, executada por Estação Higitrans | Rondonópolis MT. O motor já reavaliou a viagem." Nada é acrescentado à lista nem aos KPIs.

Modal "Plano de regularização" (largura 600px; fecha por ✕, "Fechar" ou fundo):
- Chip "C2 | QAS 7C31". Texto "bloqueio técnico não tem aprovação: tem plano. O compartimento volta a operar quando os fatos abaixo existirem."
- Linha do tempo de 4 passos, só leitura: "Ocorrência registrada" tag "feito", "Edson Farias, pelo app, hoje 07:52 | ureia pecuária no T-1 do C2"; "Procedimento formal de liberação" tag "em andamento", "Qualidade preenche o procedimento com agente, dosagem e tempo exigidos pela base IDTF"; "Limpeza qualificada | regime D" tag "agendada", "Estação Higitrans Rondonópolis | amanhã, 14:00 | credenciada para regime D"; "Inspeção qualificada e reavaliação pelo motor" tag "aguarda", "inspetor de pátio captura as evidências; o motor reavalia sozinho. Ninguém aperta "liberar"."
- Botões "Fechar" e "Notificar envolvidos". Este último fecha e mostra toast "Qualidade, Higitrans e o motorista notificados. O plano fica anexado ao C2 e à VG-2487." Sem campos, sem mudança de estado nos passos.

Drawer "Registro lacrado" (lateral direita, 520px; fecha por ✕ ou fundo):
- Cabeçalho: tipo "REGISTRO DE LIMPEZA | C1 | QAS 7C31", título "Limpeza B | Água sob pressão", subtítulo "hoje, 17:40 | Estação Higitrans | Rondonópolis MT".
- "CAMPOS DO REGISTRO" (8 linhas): regime executado ("B | Água sob pressão"), exigido pela base ("B | a partir do T-1"), carga anterior, executante, data e hora, campos do regime ("7 de 8 preenchidos"), situação ("comprovante pendente"), viagem ("VG-2494").
- "EVIDÊNCIAS | N" com link "Baixar tudo →". Arquivos: antes-c1.jpg, durante-c1.jpg, depois-c1.jpg, mais comprovante-estacao.pdf (regimes B, C, D) e laudo-desinfeccao.pdf (regime D). Cada arquivo mostra o mesmo hash do registro e o texto "baixar". Quando há campo faltante aparece a caixa tracejada "Comprovante da estação ausente" "a lacuna é informação de auditoria, não some do registro".
- Selo: "Registro lacrado" "sincronizado, não editável. Correção entra como evento novo." ou, para retroativa, "Registro retroativo, lacrado" "lançado fora da janela, com justificativa. O carimbo real fica visível para sempre."
- Botões "Iniciar retificação" e "Ver no dossiê".
- Clique em evidência: toast "antes-c1.jpg baixado com hash conferido e carimbo de 6 ago." "Baixar tudo →": toast "Registro completo baixado: campos do regime, evidências e hashes num pacote lacrado." "Iniciar retificação": fecha o drawer e mostra "Retificação iniciada: o registro original fica intacto; a correção entra como evento novo com justificativa obrigatória." Não há formulário de retificação.

Modais do perfil (fecham por ✕, fundo ou Esc):
- "Meu perfil": avatar, "Rafael Antunes", "rafael.antunes@traxium.com.br", Papel "Gestor de qualidade", Autoridade na matriz "nível 3 | Gestor", Filiais "Rondonópolis, Sorriso", Liberações assinadas em 2026 "14", nota sobre assinatura. Só leitura.
- "Preferências e notificações": 4 interruptores: "Bloqueio técnico na filial" (sempre ligado, travado), "Item há mais de 2h na fila" (ligado), "Certificado de terceiro a vencer" (ligado), "Nova versão da base IDTF" (desligado). Alternam sem toast. Rodapé "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação."
- "Papel ativo": 5 papéis (Inspetor de pátio nível 1, Tráfego 2, Gestor de qualidade 3, Diretoria e Resp. Técnico 4, Auditor interno 0) com o que cada um resolve. Escolher fecha e mostra "Papel ativo agora é Tráfego, nível 2. A fila e as ações de assinatura passam a refletir esta autoridade." Muda só o badge do menu e o texto do modal Sair; nada mais na tela muda.
- "Sair da conta": cartão com nome e papel, texto "Nada é perdido ao sair...", botões "Cancelar" e "Sair". "Sair" fecha e mostra "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data." Permanece na mesma tela.

## Estados e simulações

- Loading: por 900 ms após abrir, a lista mostra 4 cartões skeleton com shimmer. KPIs, card de bloqueio, filtros e rail aparecem normalmente durante o loading.
- Vazio: card "Nada neste recorte" com "Nada corresponde à busca "texto" neste filtro." (quando há busca) ou "Nenhum registro com este recorte no período."
- Erro: não há estado de erro.
- Estado inicial: LP-8812 expandida, filtro "Todas", regime C selecionado na escada.
- Sem props ou alternadores de cenário. O cenário de compartimento proibido é simulado pela opção C2 no modal.

## Entidades e operações

- Limpeza (registro): criar (modal, sem efeito na lista), consultar (lista e drawer), retificar (só toast), exportar (só toast), cobrar comprovante (só toast).
- Regime de limpeza A/B/C/D: consultar campos exigidos (escada, linha, modal).
- Compartimento: consultar via link para Compartimento Detalhe.
- Viagem: consultar via link (VG-2487) e exibida como texto nas linhas.
- Estação de lavagem / executante: consultar nível de credenciamento (rail, toast), escolher no modal.
- Evidência (foto, comprovante, laudo): consultar e baixar (toast).
- Bloqueio técnico / plano de regularização: consultar plano, notificar envolvidos (toast).
- Usuário e papel: consultar perfil, editar preferências, trocar papel ativo, sair (só toast).

## Regras de negócio visíveis

- O regime vem do par carga anterior × carga atual; não se escolhe livremente.
- Regimes acumulam campos: A 4, B 8, C 13, D 19.
- Par proibido não tem regime que libere; não existe botão de "lavado"; o caminho é o plano de regularização com procedimento formal, limpeza D, inspeção qualificada e reavaliação pelo motor.
- Executante limitado pelo credenciamento: Pátio próprio só até B; C e D exigem estação com comprovante e laudo.
- Só estação credenciada emite comprovante importável; Pátio próprio preenche à mão.
- O formulário não fecha incompleto.
- Registro obrigatório pendente não bloqueia o carregamento, bloqueia a conclusão da viagem.
- Comprovante pendente que envelhece vira não conformidade por reincidência (nota da LP-8796).
- Registro retroativo fica marcado para sempre; o carimbo real não se reescreve.
- Registro sincronizado é lacrado e não editável; correção entra como evento novo com justificativa obrigatória.
- Regime acima do exigido é permitido, abaixo não (texto da dica do modal).
- Alerta de bloqueio técnico não pode ser desligado.
- Ninguém assina acima do próprio nível; nível 0 é técnico.

## Observações factuais

- O modal "Registrar limpeza" termina só com toast: o registro não entra na lista, nem altera KPIs, chips ou subtítulo.
- A dica do modal diz "regime acima do exigido é permitido, abaixo não", mas o código aceita qualquer regime: no T1 (exigido C) é possível escolher A e concluir o registro.
- Os KPIs são fixos (14 registros, 3 pendentes, 2 retroativas, 1 sem regime) e não batem com a lista de 5 itens, cujos chips mostram "Pendentes | 2" e "Retroativas | 1". O subtítulo do cabeçalho repete "14 registros" e "3 comprovantes pendentes" fixos.
- Trocar a filial só troca o nome exibido e mostra o toast "registros e estações recalculados"; lista, KPIs e estações não mudam.
- O seletor de filial tem Rondonópolis MT, Sorriso MT, Cuiabá MT e Rio Verde GO; o mesmo seletor em Nao Conformidades.dc.html tem "Todas as filiais" no lugar de Rio Verde GO.
- O card de bloqueio técnico é fixo e não reage a filtro, busca nem filial; não há link dele para a NC-0412, que trata do mesmo caso em Nao Conformidades.dc.html.
- "Cobrar comprovante", "Exportar", "Iniciar retificação", "Notificar envolvidos", "Baixar tudo →", clique em evidência e clique em estação produzem apenas toast, sem mudança de estado.
- "Cobrar comprovante" na LP-8796 (Pátio próprio) gera "Cobrança enviada à Pátio próprio", isto é, cobrança dirigida ao próprio pátio.
- O texto do modal diz que o formulário não fecha incompleto, mas a lista exibe registros com campos faltantes (LP-8812, LP-8796) e o drawer os apresenta como "Registro lacrado".
- No drawer, o número em "EVIDÊNCIAS | N" é a contagem de campos preenchidos (ex.: 7 na LP-8812), não a de arquivos listados (4 na LP-8812).
- A caixa "Comprovante da estação ausente" aparece sempre que falta qualquer campo. Na LP-8812 o campo faltante é "foto do interior após" e o arquivo comprovante-estacao.pdf está na lista; na LP-8796 (regime B, Pátio próprio) o comprovante da estação nem é campo do regime B.
- O chip de situação "comprovante pendente" é usado para a LP-8796, cujos campos faltantes são foto e tempo de aplicação.
- No drawer, "exigido pela base" sempre repete o regime executado.
- Todas as evidências de um registro exibem o mesmo hash, igual ao hash do registro. O toast de download diz "carimbo de 6 ago" para qualquer registro, inclusive LP-8801 (3 ago) e LP-8796 (2 ago).
- "Importar do comprovante da estação" com regime A e estação credenciada mostra "0 campos vieram do comprovante da estação".
- O modal lista 3 executantes; o rail lista 4 estações. "Posto Trevo Lavagem" (até C) não aparece como executante no modal.
- Compartimento e placa variam entre blocos para o mesmo veículo: o card de bloqueio e o modal tratam C2 como QAS 7C31; a lista tem C1 | QAS 7C31 (LP-8812) e C2 | SQT 3A90 (LP-8796).
- O par C1 SQT 7D22 "Milho a granel" → "Farelo de soja" aparece como "regime A" no modal. Em App de Campo.dc.html, o C1 da VG-2490 com T-1 milho e carga farelo de soja pede "limpeza com água (B)".
- Locais das estações divergem entre telas: aqui LavaMax BR-364 fica em "Sorriso MT | 128 km" e Posto Trevo Lavagem em "Lucas do Rio Verde MT | 62 km" (até C); no App de Campo, LavaMax está em "Rondonópolis MT | 31 km" e "Posto Trevo | box de lavagem" em "Nova Mutum MT | 44 km" (regime B).
- Paginação existe no código (6 por página), mas com 5 itens no mock nunca aparece.
- O chip "⌘K" não tem atalho associado.
- Esc não fecha o modal Registrar limpeza, o modal Plano nem o drawer.
- Menu do perfil, modais "Meu perfil", "Preferências e notificações", "Papel ativo" e "Sair da conta", seletor de filial, "Exportar" e skeleton são idênticos aos de Nao Conformidades.dc.html.
- "Sair" não sai: fecha o modal, mostra toast e mantém a tela.
