# Indicadores
Arquivo: Indicadores.dc.html. Item da sidebar: "Indicadores" (seção PROVA, ativo, badge "11/15"). Perfil a quem se destina (pelo que a tela diz): não declarado; o usuário logado é "Rafael Antunes", "Gestor de qualidade / GMP+"; o modal de não medido fala em pedido "para a Qualidade e o time de produto". Objetivo declarado na tela: subtítulo "Últimos 30 dias / 11 de 15 indicadores medidos / Filial Rondonópolis MT"; hero "COBERTURA DA MEDIÇÃO" "11 de 15" "contada, não afirmada"; seção "Não medidos" com "ficam separados de propósito: número estimado é indistinguível de número medido depois que entra numa reunião".

Convenção deste inventário: o separador ponto médio da interface aparece como " / " nas citações.

## Entradas e saídas
- Como se chega: item "Indicadores" da sidebar de Torre de Controle v2.dc.html e Excecoes.dc.html. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html), "Viagens", "Exceções e liberações", "Inspeções", "Limpezas", "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota", "Dossiê de auditoria", "Não conformidades", "Configurações", "Onboarding público", "Protótipo mobile" (App de Campo.dc.html). O item "Indicadores" é um div sem link.
  - Botão principal do drawer de cada indicador:
    - "Ver a fila de decisões" → Torre de Controle v2.dc.html (Operações liberadas sem intervenção humana)
    - "Ver compartimentos" → Ativos e Frota.dc.html (Viagens com T-3 completo)
    - "Ver a matriz de competência" → Academy.dc.html (Motoristas com treinamento vigente)
    - "Ver subcontratados" → Subcontratados.dc.html (Subcontratados aptos)
    - "Ver cobertura por ângulo" → Inspecoes.dc.html (Viagens com evidência fotográfica completa)
    - "Ver inspeções" → Inspecoes.dc.html (Inspeções aprovadas na primeira)
    - "Ver exceções e bloqueios" → Excecoes.dc.html (Bloqueios técnicos abertos)
    - "Ver a fila de exceções" → Excecoes.dc.html (Idade média da fila de exceções)
    - "Ver a matriz de autoridade" → Excecoes.dc.html (Liberações com registro completo)
    - "Ver duplicidades" → Ativos e Frota.dc.html (Cadastros duplicados)
    - "Ver não conformidades" → Nao Conformidades.dc.html (Subcontratados reincidentes)
  - Nenhum outro elemento navega.

## Estrutura da tela
1. Sidebar canônica (ver shell-global.md). Item ativo "Indicadores" com badge branco "11/15". O card de rodapé desta tela é "Cobertura da medição": "11 de 15 medidos" (ponto âmbar), "4 declarados como não medidos".
2. Cabeçalho. Título "Indicadores"; subtítulo "{período} / 11 de 15 indicadores medidos / Filial {filial}". Reage a filial e período só no texto.
3. Barra superior à direita: "Filial Rondonópolis MT ▾" (Rondonópolis MT, Sorriso MT, Cuiabá MT, Todas as filiais), "Últimos 30 dias ▾" (Últimos 30 dias, Últimos 90 dias, Este ano, Desde o início), "Exportar", avatar "RA". Sem busca.
4. Hero escuro "COBERTURA DA MEDIÇÃO": "11" "de 15", "contada, não afirmada". À direita "MAPA DOS INDICADORES" com dica "passe o mouse para ver o nome completo / clique para abrir": 15 blocos numerados 01 a 15 com rótulo curto; 11 sólidos verdes com ✓ (Autonomia, T-3 completo, Treinamento, Terceiros aptos, Evidências, 1ª aprovação, Bloqueios, Idade da fila, Registros, Duplicados, Reincidência) e 4 hachurados tracejados (Cadastro, Checklist, Fotos rejeitadas, Dossiê). Tooltip ex.: "1. Operações liberadas sem intervenção humana: calculado agora" ou "12. Tempo de cadastro de um transportador: ainda sem dados". Legenda "Verde = calculado agora" e "Hachurado = ainda sem dados". Fixo.
5. Seção "Calculados no momento da consulta", dica "clique em qualquer um para ver a fórmula e a origem do número", chips de filtro "Todos / 11", "Motor e fila / 4", "Terceiros / 4", "Campo / 2". Grade de 4 colunas com 11 cards. Cada card: nome, ponto colorido (verde se o delta é bom, âmbar se ruim), valor grande, delta colorido, sparkline SVG de 12 pontos, rodapé com a primeira linha da fórmula. Reage ao filtro.

| # | Indicador | Valor | Delta (cor exibida) | Grupo | Rodapé (fórmula) |
|---|---|---|---|---|---|
| 1 | Operações liberadas sem intervenção humana | 79% | +6 p.p. (verde) | Motor e fila | viagens decididas pelo motor sem registro de liberação |
| 2 | Viagens com T-3 completo | 94% | +2 p.p. (verde) | Motor e fila | viagens cujo compartimento tem 3 cargas anteriores registradas |
| 3 | Motoristas com treinamento vigente | 87% | −3 p.p. (vermelho) | pessoas (sem chip) | motoristas com todas as trilhas obrigatórias vigentes |
| 4 | Subcontratados aptos | 68% | +4 p.p. (verde) | Terceiros | empresas em Apto ou Apto com restrição |
| 5 | Viagens com evidência fotográfica completa | 91% | +1 p.p. (verde) | Campo | viagens com os 6 ângulos obrigatórios capturados |
| 6 | Inspeções aprovadas na primeira | 78% | −2 p.p. (vermelho) | Campo | inspeções sem item crítico reprovado |
| 7 | Bloqueios técnicos abertos | 3 | +1 (verde) | Motor e fila | contagem de viagens com bloqueio de classe técnica em aberto |
| 8 | Idade média da fila de exceções | 1h 48min | −22min (verde) | Motor e fila | média de (agora − criação) das exceções em aberto |
| 9 | Liberações com registro completo | 100% | estável (verde) | Terceiros | liberações com os 9 campos preenchidos |
| 10 | Cadastros duplicados | 4 | −3 (vermelho) | Terceiros | documentos com os mesmos dígitos em cadastros distintos e não arquivados |
| 11 | Subcontratados reincidentes | 2 | estável (verde) | Terceiros | empresas com 2 ou mais NCs da mesma categoria em 90 dias |

6. Seção "Não medidos" com o subtítulo citado acima. Grade de 4 cards hachurados e tracejados: nome, ponto hachurado, "não medido", rodapé "falta: {item}". Fixo.
   - "Tempo de cadastro de um transportador", falta "carimbo de abertura do convite".
   - "Tempo de preenchimento do checklist", falta "carimbo de início no app".
   - "Percentual de fotos rejeitadas", falta "evento de rejeição na captura".
   - "Tempo para gerar um dossiê", falta "carimbo de início da reconstrução".

## Ações

| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| "Filial {x} ▾" | Barra superior | muda texto + toast | Atualiza o subtítulo; toast "Filial Sorriso MT: os 11 indicadores recalculados sobre este escopo." Valores não mudam. |
| "{período} ▾" | Barra superior | muda texto + toast | Atualiza o subtítulo e o botão; toast "Recalculado para últimos 90 dias. Os 4 não medidos continuam sem número: janela maior não cria dado." Valores não mudam. |
| "Exportar" | Barra superior | toast | "Exportados 11 indicadores com fórmula e origem, e os 4 não medidos com o que falta instrumentar." Sem modal. |
| Avatar "RA" | Barra superior | menu | Menu de perfil igual ao da Torre de Controle ("Meu perfil", "Preferências e notificações", "Aparência" injetado pelo shell, "Papel ativo", "Sair"). |
| Bloco do mapa (medido) | Hero | drawer | Abre o drawer do indicador. |
| Bloco do mapa (não medido) | Hero | modal | Abre o modal do não medido. |
| Chips de filtro | Seção calculados | muda estado | Filtram os cards por grupo. |
| Card calculado | Grade | drawer | Abre o drawer do indicador. |
| Card não medido | Grade | modal | Abre o modal do não medido. |
| Botão principal do drawer | Drawer | navegação | Ver lista em "Para onde leva". |
| "Exportar a série" | Drawer | toast | "Série de "operações liberadas sem intervenção humana" exportada com a fórmula e a fonte de cada ponto." |
| "Solicitar instrumentação" | Modal não medido | toast | Fecha; "Pedido de instrumentação de "tempo de cadastro de um transportador" registrado para a Qualidade e o time de produto." Nada muda. |
| "Recolher menu" | Sidebar | muda estado | Persistido em localStorage. |
| Clique fora / Esc | Global | muda estado | Fecham dropdowns; Esc fecha modais do perfil, não fecha drawer nem modal de não medido. |

Drawer e modais:

- Drawer do indicador (da direita, 540px, animação de deslizar). Capa: "INDICADOR CALCULADO NA CONSULTA", nome, valor grande, "no período selecionado". Card "DE ONDE SAI O NÚMERO": fórmula completa em fonte mono (ex.: "viagens decididas pelo motor sem registro de liberação ÷ viagens decididas no período") e texto de origem (ex.: "Conta a decisão gravada em cada viagem e a ausência de registro de liberação por autoridade. Não usa amostra: percorre todas as viagens do período."). Card "ÚLTIMOS 12 PERÍODOS": "{delta} contra o período anterior", 12 barras verticais (a última em verde), tooltip "período 12: 79", eixo "set/25" e "ago/26". Card "O QUE MOVE ESTE NÚMERO": texto (ex.: "Sobe quando terceiro fica apto, trilha de motorista fica vigente e T-3 fica completo antes do carregamento. Cai quando alguém precisa assinar por cima de um bloqueio."), botão de navegação e "Exportar a série". Sem campos. Fecha pelo X ou clique no fundo.
- Modal do não medido: título com o nome, chip "NÃO MEDIDO", texto "Este indicador não aparece com número porque o dado que o produziria não existe. Preencher com valor plausível seria mentira que sobrevive à reunião."; quadro "não medido" / "nenhum valor estimado ocupa este espaço"; "O QUE PRECISARIA EXISTIR" com 2 passos numerados (ex. para cadastro: "Gravar o instante em que o link de convite é aberto pela primeira vez, hoje o sistema só registra a conclusão." e "Gravar o instante do aceite no passo 6 do onboarding público, separando o tempo de preenchimento do tempo parado."); card "Depois de instrumentado, a cobertura vira 12 de 15" / "a contagem sobe sozinha; ninguém digita cobertura". Botões "Fechar" e "Solicitar instrumentação". Sem campos.
- Modais do perfil ("Meu perfil", "Preferências e notificações", "Papel ativo", "Sair da conta"): mesmos campos, textos e toasts da Torre de Controle (ver torre-de-controle.md).

## Estados e simulações
- Loading: 900 ms de skeleton com shimmer (8 cards) só na grade dos calculados. Hero, mapa de cobertura e não medidos aparecem direto.
- Vazio: não há texto de estado vazio; todos os filtros têm itens.
- Erro: nenhum.
- Props: nenhuma.
- O próprio bloco "Não medidos" funciona como estado de ausência de dado, com texto fixo "não medido".

## Entidades e operações
- Indicador calculado (11): consultar (card, drawer), filtrar por grupo, exportar série (toast).
- Indicador não medido (4): consultar, solicitar instrumentação (toast).
- Conjunto de indicadores: exportar (toast).
- Filial e período: filtrar (só texto e toast).
- Entidades citadas nas fórmulas e textos, sem operação aqui: viagem, compartimento (T-3), motorista e trilha, subcontratado (Lima Logística), inspeção e fotos (6 ângulos, bica de descarga), bloqueio técnico e plano de regularização, exceção, registro de liberação de 9 campos, cadastro duplicado (CNPJ), não conformidade, convite de onboarding, checklist do app, dossiê.
- Papel e preferências do usuário: editar no estado da tela.
- Não há criar, editar, retificar, cancelar ou arquivar.

## Regras de negócio visíveis
- Número estimado não aparece: indicador sem dado fica como "não medido"; "nenhum valor estimado ocupa este espaço"; "ninguém digita cobertura".
- Competência deriva das trilhas concluídas com nota e validade, "nunca de um campo "apto""; trilha vencida sai do numerador no dia do vencimento.
- Estado do subcontratado deriva de certificado, status na base pública, acordo de qualidade e treinamento; "Nenhum dos quatro é editável"; suspensão na base pública derruba a empresa mesmo com acordo assinado.
- T-3 é lido do histórico do compartimento, não da placa; o fechamento da viagem empurra a carga atual para o histórico.
- Evidência fotográfica conta arquivos com hash e metadados de captura; foto importada da galeria não conta como evidência crítica.
- Item crítico reprova a inspeção sozinho.
- Bloqueio técnico não tem autoridade que libere; sai da contagem só quando o plano de regularização se completa.
- Liberações com registro completo são 100% "por construção": registro incompleto desfaz a liberação.
- Duplicidade compara só os dígitos do documento; arquivado sai da contagem sem apagar histórico; a importação por planilha barra duplicidade antes de gravar.
- Reincidência: 2 ou mais NCs da mesma categoria em 90 dias, janela móvel.
- Referência de prazo da fila: 15 minutos a 4 horas em caso simples, 1 a 2 dias em caso crítico.

## Observações factuais
- Filial e período mudam só o texto do subtítulo e mostram toast dizendo que houve recálculo; valores, deltas, sparklines e séries não mudam.
- A lista de filiais desta tela tem "Todas as filiais" e não tem "Rio Verde GO"; a Torre de Controle e Exceções têm "Rio Verde GO" e não têm "Todas as filiais".
- "Motoristas com treinamento vigente" pertence ao grupo "pessoas", que não tem chip; só aparece em "Todos". Os chips de grupo somam 10 de 11.
- "Liberações com registro completo" está no chip "Terceiros".
- Cores dos deltas: "Bloqueios técnicos abertos" "+1" aparece em verde; "Cadastros duplicados" "−3" aparece em vermelho com ponto âmbar; "Subcontratados reincidentes" "estável" aparece em verde com ponto verde.
- O eixo do drawer é sempre "set/25" a "ago/26" e o rótulo diz "no período selecionado", qualquer que seja o período escolhido.
- O modal de não medido diz sempre "a cobertura vira 12 de 15", independentemente do indicador.
- "Solicitar instrumentação", "Exportar a série" e "Exportar" só mostram toast.
- Valores que divergem de outras telas: "Bloqueios técnicos abertos" 3, enquanto a Torre de Controle mostra "1 bloqueio técnico" e Exceções tem 1 item técnico (VG-2487); "Idade média da fila de exceções" "1h 48min", enquanto Exceções diz "idade média: 1h 09min"; "Operações liberadas sem intervenção humana" 79% (30 dias), enquanto a Torre de Controle chama o KPI de "Liberadas sem intervenção humana" e mostra 77% em Rondonópolis MT / Hoje.
- Três indicadores levam a Excecoes.dc.html e dois a Inspecoes.dc.html, com rótulos de botão diferentes para o mesmo destino ("Ver cobertura por ângulo" e "Ver inspeções"; "Ver exceções e bloqueios", "Ver a fila de exceções" e "Ver a matriz de autoridade").
- O drawer abre tanto pelo card quanto pelo bloco correspondente do mapa de cobertura; os 4 não medidos também abrem pelos dois caminhos.
- O badge da sidebar "11/15" e o card de rodapé da sidebar repetem a cobertura já mostrada no hero e no subtítulo.
- O skeleton cobre só a grade dos calculados; o mapa de cobertura com 11 blocos verdes aparece antes dos cards.
