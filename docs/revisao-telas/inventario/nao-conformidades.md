# Não conformidades

Arquivo: Nao Conformidades.dc.html. Item da sidebar: "Não conformidades" (seção PROVA, badge "4", item ativo). Perfil a quem se destina (pelo que a tela diz): usuário logado Rafael Antunes, "Gestor de qualidade | GMP+", papel ativo padrão "Gestor de qualidade" (nível 3); o modal "Papel ativo" informa que "Auditor interno" (nível 0) tem "somente leitura, mais abrir não conformidade". Objetivo declarado na tela: acompanhar não conformidades (NCs) pelo ciclo ação imediata, causa raiz, ação corretiva e verificação de eficácia, com reincidência por subcontratado. Textos que declaram o objetivo: "O CICLO ATÉ A RAIZ" (detalhe da NC), "a NC nasce com a ação imediata, porque desvio sem contenção continua acontecendo enquanto se investiga." (modal Abrir NC) e "a NC não fecha porque a ação foi executada; fecha quando se comprova que o desvio parou de acontecer." (modal de eficácia).

Nota de grafia: nos rótulos citados, o separador de ponto médio usado pela interface aparece substituído por barra vertical (|).

## Entradas e saídas

- Como se chega: pela sidebar de qualquer tela (item "Não conformidades"), inclusive Limpezas.dc.html. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: mesmos 17 destinos de Limpezas.dc.html ("Torre de Controle", "Viagens", "Exceções e liberações", "Inspeções", "Limpezas" (Limpezas.dc.html, badge 3), "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota", "Dossiê de auditoria", "Indicadores", "Configurações", "Onboarding público", "Protótipo mobile" (App de Campo.dc.html)).
  - Detalhe expandido de cada NC, segundo botão (rótulo varia por NC):
    - NC-0412: "Abrir a viagem" leva a Viagem Detalhe.dc.html.
    - NC-0409: "Abrir o subcontratado" leva a Subcontratados.dc.html.
    - NC-0407: "Ver cobertura por ângulo" leva a Inspecoes.dc.html.
    - NC-0403: "Abrir as limpezas" leva a Limpezas.dc.html.
    - NC-0398: "Ver duplicidades" leva a Ativos e Frota.dc.html.
  - NC-0412 (única com exceção ligada): botão "Ver o bloqueio ligado" leva a Excecoes.dc.html.
  - Todos os links são genéricos: o destino não recebe identificador da NC, viagem, empresa ou registro.

## Estrutura da tela

1. Sidebar. Igual à de Limpezas.dc.html, com o item "Não conformidades" ativo. Card inferior diferente: "Prazo vencido", "1 ação corretiva", "NC-0403 | vencida há 2 dias" (fixo).

2. Cabeçalho. Título "Não conformidades". Subtítulo "Terça, 5 ago | 4 abertas | 1 com prazo vencido | Filial Rondonópolis MT" (o número de abertas é calculado; "1 com prazo vencido" é fixo; filial reage ao seletor). À direita: busca (placeholder "Buscar código, origem, responsável…", chip "⌘K"), seletor "Filial Rondonópolis MT ▾", "Exportar", "Abrir NC", avatar "RA".

3. Faixa de KPIs (4 cards):
   - "Onde as NCs abertas estão paradas": "4" "abertas | 12 concluídas no ano"; barra empilhada com legenda "Causa raiz | 1", "Ação corretiva | 2", "Verificação | 0", "Prazo vencido | 1" (tooltip "1 em causa raiz"). Abertas e etapas calculadas; "12 concluídas" fixo.
   - "Críticas": 1, rodapé "ligada à exceção correspondente" (calculado).
   - "Prazo vencido": 1, rodapé "ação corretiva sem entrega" (calculado).
   - "Subcontratados reincidentes": 2, rodapé "2 ou mais na mesma categoria em 90d" (fixo).
   Não reagem a filtro, busca nem filial; os calculados reagem ao fechamento de NC pelo modal de eficácia.

4. Lista "Não conformidades", subtítulo "severidade → prazo → idade". Chips: "Abertas | 4" (padrão), "Críticas | 1", "Prazo vencido | 1", "Todas | 5". Mock com 5 NCs (4 abertas, 1 fechada). Por linha:
   - Ícone por categoria em degradê da cor da severidade.
   - Código (ex.: "NC-0412"), categoria (ex.: "Contaminação cruzada"), chip "REINCIDENTE" quando aplicável (só NC-0409).
   - Resumo (ex.: "Resíduo de ureia pecuária no C2 com farelo de amendoim programado").
   - Chip de severidade: "crítica", "maior" ou "menor".
   - "ORIGEM" (ex.: "VG-2487 | C2 | QAS 7C31").
   - Prazo (ex.: "hoje 18:00", "vencido há 2 dias", "concluída") com rótulo "prazo".
   - Idade (ex.: "9h", "fechada em 1 ago") com rótulo "aberta".
   - Chevron.
   Detalhe expandido (uma por vez; NC-0412 aberta por padrão):
   - Descrição longa.
   - "O CICLO ATÉ A RAIZ": 4 etapas horizontais (Ação imediata, Causa raiz, Ação corretiva, Verificação de eficácia), cada uma com ícone, tag ("feito", "em andamento", "aguarda", "prazo vencido") e texto. Ex. NC-0412: "Ação imediata" feito "Conjunto retido no pátio e viagem bloqueada pelo motor às 07:52."
   - Botão de ação (rótulo calculado), botão de navegação, "Ver o bloqueio ligado" (só NC-0412).
   - Nota (ex.: "NC crítica está ligada ao bloqueio técnico da VG-2487. Fechar a NC não libera a viagem: são trilhas separadas, e a viagem depende do plano de regularização.").
   - Quadro: "Responsável" (ex.: "Rafael Antunes"), "Aberta por" (ex.: "Edson Farias | app"), "Evidências" (ex.: "6 fotos e 1 laudo").
   Dados das 5 NCs:
   - NC-0412, crítica, Contaminação cruzada, origem VG-2487 | C2 | QAS 7C31, prazo hoje 18:00, 9h, resp. Rafael Antunes, autor Edson Farias | app, etapa atual Causa raiz.
   - NC-0409, maior, Documentação de terceiro, REINCIDENTE, origem Lima Logística | CNPJ 08.441.220/0001-73, prazo em 3 dias, 2 dias, resp. Helena Duarte, autor "consulta automática à base", etapa atual Ação corretiva.
   - NC-0407, menor, Evidência fotográfica, origem "Padrão detectado em 15 dias", prazo em 6 dias, 1 dia, resp. Jorge Mattos, autor Rafael Antunes, etapa atual Ação corretiva.
   - NC-0403, maior, Registro de limpeza, origem C2 | SQT 3A90, "vencido há 2 dias", 4 dias, resp. Paulo Lima, autor Helena Duarte, Ação corretiva com "prazo vencido".
   - NC-0398, menor, Cadastro duplicado, origem "Auditoria interna | amostra de julho", concluída, fechada em 1 ago, resp. Helena Duarte, autor "auditoria interna", todas as etapas feitas.
   Reage a: filtro, busca (procura em código, categoria, origem, responsável e resumo). Não reage à filial.

5. Paginação: 6 por página, "mostrando X a Y de Z NCs". Com 5 itens, nunca aparece.

6. Rail, card "Reincidência por subcontratado", subtítulo "o que melhor prevê bloqueio futuro: repetir a mesma categoria". 4 empresas com avatar, categoria, número e barra: Lima Logística "documentação de terceiro" 2; Transrocha Transportes "registro de limpeza" 2; AgroLima Ltda "evidência fotográfica" 1; Cerrado Cargas "nenhuma categoria repetida" 0. Rodapé "Duas NCs de categorias diferentes na mesma empresa não contam como reincidência: o padrão é que importa." Fixo.

7. Rail, card "Por categoria, em 90 dias", subtítulo "de onde os desvios vêm". 5 barras: Doc. terceiro 5, Limpeza 4, Fotos 3, Contaminação 2, Cadastro 1 (tooltip com o nome completo). Fixo.

8. Toast inferior central (4,2 s).

## Ações

| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Links da sidebar | Sidebar | navegação | Ver "Para onde leva". |
| "Recolher menu" | Sidebar | muda estado | Igual a Limpezas. |
| Campo de busca | Cabeçalho | muda estado | Filtra a lista; volta à página 1. |
| Chip "⌘K" | Cabeçalho | nada | Sem atalho no código. |
| "Filial Rondonópolis MT ▾" | Cabeçalho | popover + toast | Opções: Rondonópolis MT, Sorriso MT, Cuiabá MT, Todas as filiais. Toast "Filial Sorriso MT: NCs e reincidência recalculadas." Só o nome exibido muda. |
| "Exportar" | Cabeçalho | toast | "NCs exportadas com severidade, origem, ciclo e prazo. Vencidas primeiro, que é a ordem de quem vai cobrar." |
| "Abrir NC" | Cabeçalho | modal | Modal Abrir não conformidade. |
| Avatar "RA" | Cabeçalho | popover | Mesmo menu de Limpezas. |
| Chips de filtro | Lista | muda estado | Abertas, Críticas (abertas), Prazo vencido, Todas. |
| Cabeçalho da linha | Lista | muda estado | Expande/recolhe; uma por vez. |
| Botão de ação "Avançar a etapa" | NC-0412, NC-0409, NC-0407 | toast | "NC-0412 avançou de etapa. Cada avanço grava autor e data; nada retrocede sem evento novo." Etapa não muda. |
| Botão de ação "Replanejar o prazo" | NC-0403 | toast | "Replanejamento aberto para NC-0403: nova data exige justificativa, e o atraso original fica registrado." Sem formulário, prazo não muda. |
| Botão de ação "Ver o registro fechado" | NC-0398 (visível no filtro Todas) | toast | "NC-0398 está fechada e lacrada. O registro segue no dossiê com as quatro etapas e a verificação." |
| Botão de ação "Registrar verificação de eficácia" | NC aberta com Ação corretiva "feito" | modal | Nenhuma NC do mock atende à condição; o rótulo não aparece. |
| Botão de navegação | Linha expandida | navegação | Ver "Para onde leva". |
| "Ver o bloqueio ligado" | NC-0412 | navegação | Excecoes.dc.html. |
| Item de reincidência | Rail | toast | v ≥ 2: "Lima Logística é reincidente em documentação de terceiro. Reincidência entra na avaliação de qualificação da empresa." Demais: "AgroLima Ltda: evidência fotográfica. Fora da contagem de reincidência." |
| Barras de categoria | Rail | nada | Só tooltip. |
| Paginação | Lista | muda estado | Nunca visível com o mock. |
| Esc | Teclado | muda estado | Fecha popovers e modais do perfil; não fecha os modais Abrir NC e Verificação de eficácia. |

Modal "Abrir não conformidade" (640px; fecha por ✕, "Cancelar" ou fundo):
- Texto "a NC nasce com a ação imediata, porque desvio sem contenção continua acontecendo enquanto se investiga."
- ORIGEM (obrigatório, escolha única): Viagem, Compartimento, Subcontratado, Auditoria. Não há campo para indicar qual viagem, compartimento ou empresa.
- SEVERIDADE (obrigatório): "Crítica" "segurança do feed em risco; conecta à exceção"; "Maior" "falha de processo com efeito sobre a evidência"; "Menor" "desvio pontual, corrigível sem parar a operação". Crítica selecionada fica em vermelho.
- CATEGORIA (obrigatório): Contaminação cruzada, Documentação de terceiro, Evidência fotográfica, Registro de limpeza, Cadastro duplicado, Competência do motorista.
- DESCRIÇÃO DO DESVIO (obrigatório, mínimo 20 caracteres): textarea, placeholder "O que foi observado, onde e quando. Fato, não interpretação."
- AÇÃO IMEDIATA DE CONTENÇÃO (obrigatório, mínimo 15 caracteres): textarea, placeholder "O que foi feito agora para o desvio parar de acontecer enquanto se investiga a raiz."
- Não há campos de responsável, prazo, evidência ou anexo.
- Dica no rodapé, em sequência: "Escolha a origem do desvio.", "Escolha a severidade: ela define quem responde.", "Escolha a categoria: é ela que mede reincidência.", "Descreva o desvio com pelo menos 20 caracteres.", "A ação imediata é obrigatória: desvio sem contenção continua acontecendo.", e então "NC crítica abre também o vínculo com a exceção correspondente." (se Crítica) ou "Pronto. A NC nasce na etapa de causa raiz."
- Botões "Cancelar" e "Abrir NC" (desabilitado visualmente até completo).
- Ao confirmar: fecha e mostra "NC-0413 aberta por Rafael Antunes, com a ação imediata registrada. Próxima etapa: causa raiz." O código guarda a NC num array de estado, mas esse array não é lido pela lista: a NC não aparece, contadores não mudam. O código seguinte seria NC-0414, NC-0415.

Modal "Verificação de eficácia" (560px; fecha por ✕, "Cancelar" ou fundo):
- Chip com o código da NC. Texto "a NC não fecha porque a ação foi executada; fecha quando se comprova que o desvio parou de acontecer."
- "A AÇÃO CORRETIVA FOI EFICAZ?" (obrigatório): "Sim, o desvio parou de acontecer" "a NC fecha e a verificação fica no registro com a amostra conferida"; "Não, o desvio se repetiu" "a NC volta para causa raiz; ação corretiva ineficaz é informação, não fracasso a esconder".
- "EVIDÊNCIA DA VERIFICAÇÃO" (obrigatório, mínimo 20 caracteres): placeholder "O que foi conferido, em que amostra e em que período."
- Dica: "Escolha o resultado da verificação.", "Descreva o que foi conferido, com pelo menos 20 caracteres.", "A NC fecha e entra na contagem de eficácia verificada." ou "A NC volta para causa raiz com o histórico preservado."
- Botões "Cancelar" e "Registrar verificação".
- Sim: a NC passa a fechada (prazo "concluída", etapa 4), KPIs e chips recalculam; toast "NC-XXXX fechada com eficácia verificada por Rafael Antunes. Entra na contagem do indicador." Não: só toast "NC-XXXX devolvida para causa raiz: a ação corretiva não impediu a repetição. O histórico anterior fica intacto."; o ciclo não muda.
- Inalcançável com o mock atual (ver Observações).

Modais do perfil: idênticos aos de Limpezas.dc.html ("Meu perfil", "Preferências e notificações", "Papel ativo", "Sair da conta"), com os mesmos textos e toasts.

## Estados e simulações

- Loading: 900 ms com 4 cartões skeleton com shimmer na lista; KPIs e rail visíveis durante o loading.
- Vazio: ícone ✓, "Nada neste recorte" e "Nada corresponde à busca "texto" neste filtro." ou "Nenhuma NC neste recorte. Desvio que não vira NC continua acontecendo em silêncio, então vale conferir a fila de exceções."
- Erro: não há.
- Estado inicial: filtro "Abertas", NC-0412 expandida.
- Cenários cobertos pelo mock: NC crítica ligada a exceção, NC reincidente, NC com prazo vencido, NC fechada com eficácia verificada. Sem props ou alternadores.

## Entidades e operações

- Não conformidade: criar (modal, sem efeito na lista), consultar (lista e detalhe), avançar etapa (só toast), replanejar prazo (só toast), fechar por verificação de eficácia (modal com mudança de estado, inalcançável no mock), reabrir para causa raiz (resultado "Não" do modal, só toast), exportar (só toast).
- Ciclo CAPA (ação imediata, causa raiz, ação corretiva, verificação de eficácia): consultar.
- Subcontratado: consultar reincidência (rail, toast), navegar para Subcontratados.
- Viagem, exceção, inspeção, limpeza, cadastro: só navegação por link genérico.
- Usuário e papel: mesmas operações de Limpezas.

## Regras de negócio visíveis

- Toda NC nasce com ação imediata de contenção obrigatória.
- Severidade define quem responde; NC crítica se liga à exceção correspondente.
- Categoria mede reincidência; reincidência é contada por empresa e categoria (2 ou mais na mesma categoria em 90 dias). Categorias diferentes na mesma empresa não contam.
- A NC nova nasce na etapa de causa raiz.
- A NC só fecha com verificação de eficácia comprovada; resultado negativo devolve a NC para causa raiz preservando o histórico.
- A verificação só fica disponível quando a ação corretiva está "feito".
- Prazo vencido não fecha sozinho nem some da fila; replanejamento exige justificativa e o atraso original fica registrado.
- Cada avanço grava autor e data; nada retrocede sem evento novo.
- Fechar a NC não libera a viagem: NC e bloqueio da viagem são trilhas separadas.
- Padrão de ausência de evidência é NC mesmo quando cada caso foi corrigido (NC-0407).
- Reprovar não gera competência: trilha de reforço só conta concluída com nota (NC-0407).
- Ordenação declarada: "severidade → prazo → idade".

## Observações factuais

- O modal "Registrar verificação de eficácia" não é alcançável com os dados do mock: a condição exige NC aberta com "Ação corretiva" em "feito", e nenhuma das 4 NCs abertas atende (NC-0412 "aguarda", NC-0409 e NC-0407 "em andamento", NC-0403 "prazo vencido").
- "Abrir NC" termina com toast: a NC criada é guardada em estado, mas não aparece na lista nem altera KPIs, chips, subtítulo ou badge da sidebar.
- "Avançar a etapa", "Replanejar o prazo", "Ver o registro fechado", "Exportar", clique em reincidência e troca de filial produzem só toast, sem mudança de estado. O toast de "Avançar a etapa" afirma que a NC "avançou de etapa", mas o ciclo exibido não muda.
- O subtítulo da lista declara a ordem "severidade → prazo → idade", mas a ordem exibida é a do array: crítica (NC-0412), maior (NC-0409), menor (NC-0407), maior (NC-0403), menor (NC-0398).
- "12 concluídas no ano" e "Subcontratados reincidentes 2" são fixos; o filtro "Todas | 5" mostra só 1 NC fechada.
- "1 com prazo vencido" no subtítulo e o card da sidebar "Prazo vencido | 1 ação corretiva | NC-0403 | vencida há 2 dias" são fixos.
- O gráfico "Por categoria, em 90 dias" soma 15 NCs e tem 5 categorias; o modal Abrir NC oferece 6 categorias (inclui "Competência do motorista", ausente do gráfico).
- As origens do modal (Viagem, Compartimento, Subcontratado, Auditoria) não cobrem origens exibidas na lista como "Padrão detectado em 15 dias" e "consulta automática à base" (autor da NC-0409).
- A lista exibe "Responsável" e prazo para cada NC, mas o modal de abertura não pede responsável nem prazo.
- A dica do modal para severidade crítica diz que a NC "abre também o vínculo com a exceção correspondente", mas o modal não tem campo para indicar a exceção.
- A seleção de filial inclui "Todas as filiais"; em Limpezas.dc.html, a quarta opção é "Rio Verde GO".
- A NC-0403 (origem "C2 | SQT 3A90", resp. Paulo Lima) tem resumo "Comprovante da estação pendente em duas limpezas regime B", mas a descrição diz que faltam "a foto do interior após a lavagem" e "o tempo de aplicação" em limpezas no pátio próprio. Em Limpezas.dc.html, a LP-8796 (C2, SQT 3A90, Pátio próprio | Paulo Lima) tem exatamente esses dois campos faltantes, e a outra limpeza B pendente (LP-8812) é da Estação Higitrans, não do pátio próprio.
- A NC-0412 descreve o mesmo caso do card "BLOQUEIO TÉCNICO" e do modal "Plano de regularização" de Limpezas.dc.html (C2, QAS 7C31, VG-2487, Edson Farias pelo app às 07:52). A nota da NC diz que a viagem "depende do plano de regularização", mas o link da NC leva a Excecoes.dc.html, e o plano está em Limpezas.dc.html. Nenhuma das duas telas liga uma à outra para este caso.
- A NC-0409 diz que a Lima Logística saiu de Apto e teve viagens reatribuídas; em App de Campo.dc.html o motorista Ivan Prado aparece como "motorista | Lima Logística" com chip "✓ elegível".
- A NC-0407 atribui a Jorge Mattos a "Trilha 6 de reforço" com ação corretiva "em andamento"; em App de Campo.dc.html, Jorge Mattos aparece com chip "trilha 6 vigente".
- Na reincidência, "Transrocha Transportes" tem 2 em "registro de limpeza" e "AgroLima Ltda" 1 em "evidência fotográfica"; nenhuma NC da lista tem essas empresas como origem. A NC de registro de limpeza (NC-0403) é do pátio próprio.
- Paginação existe (6 por página), mas nunca aparece com 5 itens.
- Esc não fecha os modais Abrir NC e Verificação de eficácia.
- Menu e modais do perfil, seletor de filial, botão "Exportar", busca com "⌘K", skeleton e paginação repetem a estrutura de Limpezas.dc.html.
