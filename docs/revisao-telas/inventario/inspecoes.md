# Inspeções pré-carregamento
Arquivo: `Inspecoes.dc.html`. Item da sidebar: "Inspeções" (seção OPERAÇÃO, item ativo destacado, badge "3"). Perfil a quem se destina (pelo que a tela diz): não declarado explicitamente; o modal de despacho diz "Aqui você escolhe quem executa e confere o que vai ser exigido"; o usuário logado no mock é Rafael Antunes, "Gestor de qualidade / GMP+". Objetivo declarado na tela: não há frase de objetivo; o subtítulo é dinâmico, "Terça, 5 ago / 18 inspeções no período / 3 compartimentos esperando / Filial Rondonópolis MT"; a primeira seção é "No pátio, esperando inspeção" ("ordenado por prazo de carregamento").

## Entradas e saídas
- Como se chega: pela sidebar (item "Inspeções" presente em `Ativos e Frota.dc.html` e `Compartimento Detalhe.dc.html`). Demais origens: ver mapa do site.
- Para onde leva:
  - Código de viagem em cada inspeção registrada (ex.: "VG-2494") → `Viagem Detalhe.dc.html` (clique não expande a linha).
  - Botão "Ver o compartimento" na inspeção expandida → `Compartimento Detalhe.dc.html`.
  - Botão "Ver no dossiê" no drawer de registro lacrado → `Dossie.dc.html`.
  - Sidebar: 16 links da sidebar canônica ("Torre de Controle" → `Torre de Controle v2.dc.html`, "Viagens" → `Viagens.dc.html`, "Exceções e liberações" → `Excecoes.dc.html`, "Limpezas" → `Limpezas.dc.html`, "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota" → `Ativos e Frota.dc.html`, "Dossiê de auditoria", "Indicadores", "Não conformidades", "Configurações", "Onboarding público", "Protótipo mobile" → `App de Campo.dc.html`). "Inspeções" é div sem link.

## Estrutura da tela
1. Sidebar canônica com "Inspeções" ativo. Card de rodapé "Checklist vigente": "v4 / 3 tipos de implemento", "Publicado em 12 jul / Qualidade". Fixo.
2. Cabeçalho: título "Inspeções pré-carregamento"; subtítulo dinâmico (só o nome da filial reage). À direita: busca (placeholder "Buscar placa, compartimento, viagem…", com selo "⌘K"), botão "Filial Rondonópolis MT ▾", botão "Exportar", avatar "RA" com menu de perfil.
3. Faixa de 4 KPIs (valores fixos no código, visíveis também durante o loading):
   - "Aprovadas na primeira inspeção": "78%", "14 de 18 inspeções do período"; barra segmentada 78% / 11% / 11%; legenda "Aprovada", "Pendência corrigível", "Reprovada por item crítico".
   - "Esperando o inspetor": 3; rodapé "mais antigo: 26 min no pátio".
   - "Reprovadas no período": 2; rodapé "item crítico reprova sozinho".
   - "Sem sincronizar": 1; rodapé "salva no aparelho de Jorge Mattos".
4. Seção "No pátio, esperando inspeção" ("ordenado por prazo de carregamento"). 3 cartões no mock. Campos: quadrado com o compartimento, placa, tipo, "vai subir: <produto>", "T-1 DO COMPARTIMENTO", pill "Regime X" (tooltip "regime mínimo que a base IDTF exige a partir do T-3"), prazo + "carrega", espera + "no pátio", botão "Despachar inspeção". Itens:
   - "C1 / SQT 7D22 / graneleiro / 2 compartimentos / vai subir: Farelo de soja / T-1 Milho a granel / 31 jul / Regime A / hoje 16:00 / 26 min" (espera em vermelho).
   - "C2 / QAS 7C31 / bitrem / 3 compartimentos / Casca de soja peletizada / T-1 Farelo de soja / 2 ago / Regime B / hoje 17:30 / 12 min".
   - "T1 / RTB 5J18 / tanque / 1 compartimento / Óleo de soja degomado / T-1 Óleo de palma / 28 jul / Regime C / amanhã 06:30 / 4 min".
   Não reage a busca nem a filial; vazio com a prop de simulação.
5. Seção "Inspeções registradas" com chips de filtro "Todas / 5", "Aprovadas / 2", "Pendência / 1", "Reprovadas / 1". Lista de 5 inspeções, paginação de 6 por página (não aparece com 5 itens). Linha recolhida: avatar do inspetor com anel colorido pelo resultado, "<comp> / <placa>", link da viagem, "<quem> / <quando> / <tipo>", pill de resultado, "N de 6 ângulos" (verde se 6, vermelho se menos), "N de M checklist", chevron. Itens:
   - INS-4471: "C1 / QAS 7C31", VG-2494, Jorge Mattos, "hoje, 18:20", Graneleiro, "pendência corrigível", 5 de 6 ângulos (falta BICA), 8 de 8 checklist. Inicia expandida.
   - INS-4470: "C1 / SQT 3A90", VG-2490, Jorge Mattos, "hoje, 19:05", "aprovada", 6 de 6, 7 de 8 (lona "não aplicável").
   - INS-4468: "C2 / QAS 7C31", VG-2487, Edson Farias, "hoje, 07:48", "reprovada / item crítico", 6 de 6, 7 de 8 ("Resíduo de carga anterior" não conforme).
   - INS-4465: "T1 / RTB 5J18", VG-2489, Jorge Mattos, "ontem, 15:32", Tanque, "aprovada", 6 de 6, 9 de 9.
   - INS-4462: "C1 / SQT 7D22", VG-2486, Jorge Mattos, "ontem, 11:14", "aguardando sincronização", 6 de 6, 8 de 8.
   Área expandida:
   - "ÂNGULOS OBRIGATÓRIOS" com dica ("seis de seis capturados pela câmera do app" ou "a inspeção não fecha com ângulo faltando"); 6 miniaturas clicáveis: GERAL, CANTOS, TETO, PISO, BICA, PLACA, com selo ✓ ou ✕ e tooltip "<nome>: capturado" ou ": faltando".
   - "CHECKLIST / <tipo>": itens com ícone (✓, ✕, –), texto, selo "CRÍTICO" quando aplicável e situação ("conforme", "não conforme", "não aplicável").
   - "O QUE O REGISTRO CARREGA": "Assinatura" (inspetor), "GPS" (ex.: "-16.4673, -54.6372"), "Sincronização" ("sincronizada" ou "salva no aparelho"), "Hash" (ex.: "e91c…37ab" ou "pendente"); nota específica por inspeção (ex.: "Falta um ângulo obrigatório. A viagem segue na fila da Torre até a captura; nada aqui se resolve no escritório.").
   - Botões "Abrir registro lacrado", "Retificar", "Ver o compartimento" e, só quando falta ângulo, "Notificar o inspetor".
6. Rail, card "O checklist muda com o implemento" ("tanque pergunta de válvula e mangote; graneleiro pergunta de lona e bica"). Seletor "Graneleiro" / "Tanque" / "Baú". Mostra "<N> itens / <K> críticos" e a lista de itens com ponto colorido e selo "CRÍTICO". Graneleiro 8 itens, 3 críticos ("Resíduo de carga anterior", "Odor estranho ou fermentado", "Estado da bica de descarga" críticos; "Integridade da lona", "Vedação das tampas e escotilhas", "Presença de água ou umidade", "Ferrugem ou solda solta", "Identificação do compartimento legível"). Tanque 9 itens, 4 críticos ("Filme ou resíduo na parede interna", "Estado do mangote", "Vedação da válvula de fundo", "Lacre íntegro"; mais "Odor estranho", "Estado da escotilha superior", "Ausência de água residual", "Comprovante de lavagem afixado", "Identificação do tanque legível"). Baú 7 itens, 2 críticos ("Sujidade ou resíduo no piso", "Vedação das portas"; mais "Odor estranho", "Estado do assoalho", "Sinais de praga ou infestação", "Iluminação interna funcional", "Identificação do baú legível"). Rodapé: "Um item crítico reprova a inspeção sozinho. Item não crítico deixa pendência, e pendência se corrige." Reage ao seletor.
7. Rail, card "Cobertura fotográfica" ("quantas das 18 inspeções do período têm cada ângulo"). 6 barras fixas: "Visão geral interna 18 de 18", "Cantos e frestas 18 de 18", "Teto, lona ou tampa 18 de 18", "Piso e fundo 17 de 18", "Bica de descarga 15 de 18", "Identificação externa 18 de 18" (verde 100%, âmbar 90 a 99%, vermelho abaixo). Rodapé: "A bica de descarga é o ângulo que mais falta: é o mais desconfortável de fotografar com o conjunto engatado."
8. Toast inferior (some após 4,2 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Busca | Cabeçalho | muda estado | Filtra "Inspeções registradas" por id, compartimento, placa, viagem e inspetor; volta para página 1. Não filtra o pátio. |
| Selo "⌘K" | Busca | nada | Sem atalho associado. |
| "Filial <nome> ▾" | Cabeçalho | popover + toast | Opções "Rondonópolis MT", "Sorriso MT", "Cuiabá MT", "Rio Verde GO". Escolha muda o rótulo e o subtítulo; toast "Filial <nome>: pátio e inspeções recalculados." Dados não mudam. |
| "Exportar" | Cabeçalho | toast | "Inspeções do período exportadas com checklist, ângulos e hashes, carimbadas em 6 ago por Rafael Antunes." |
| Avatar "RA" | Cabeçalho | popover | "Meu perfil", "Preferências e notificações", "Papel ativo", "Sair". |
| "Despachar inspeção" | Cartão do pátio | modal | Abre "Despachar inspeção" do compartimento. |
| Chips de filtro | Inspeções registradas | muda estado | "Todas", "Aprovadas", "Pendência", "Reprovadas"; volta para página 1. |
| Linha da inspeção | Inspeções registradas | muda estado | Expande/recolhe (uma por vez). |
| Código "VG-xxxx" | Linha | navegação | `Viagem Detalhe.dc.html`. |
| Miniatura de ângulo | Linha expandida | modal | Abre modal do ângulo. |
| "Abrir registro lacrado" | Linha expandida | drawer | Drawer "REGISTRO DE INSPEÇÃO / <comp> / <placa>". |
| "Retificar" | Linha expandida | toast | "Retificação de <id> iniciada. O registro original continua no dossiê; a correção entra como evento novo." Sem formulário, sem mudança de estado. |
| "Ver o compartimento" | Linha expandida | navegação | `Compartimento Detalhe.dc.html`. |
| "Notificar o inspetor" | Linha expandida (só INS-4471) | toast | "Jorge Mattos notificado pelo app: falta o ângulo da bica de descarga no C1." |
| Paginação "Anterior", números, "Próxima" | Abaixo da lista | muda estado | Só aparece com mais de 6 itens; não aparece no mock. |
| Seletor "Graneleiro / Tanque / Baú" | Rail checklist | muda estado | Troca a lista de itens exibida. |
| "Recolher menu" | Sidebar | muda estado | Persistido em `localStorage`. |

Modal **Despachar inspeção** (chip "<comp> / <placa>"). Texto: "a inspeção acontece no app, com foto pela câmera e GPS do aparelho. Aqui você escolhe quem executa e confere o que vai ser exigido." Resumo: "T-1 DO COMPARTIMENTO", "VAI SUBIR", "REGIME" (colorido). Campo:
- "QUEM EXECUTA" (radio, obrigatório): "Jorge Mattos" ("inspetor de pátio / Rondonópolis", "trilha 6 vigente"), "Ivan Prado" ("motorista da viagem / app instalado", "trilha 6 vigente"), "Valdir Nunes" ("motorista / trilha de inspeção vencida", "não elegível" em vermelho).
Informativo: "O CHECKLIST QUE VAI SER APLICADO" ("detectado do tipo do implemento: graneleiro" ou "tanque"), chips de todos os itens (críticos em vermelho); "FOTOS OBRIGATÓRIAS" ("seis ângulos, pela câmera do app, sem galeria") com 6 placeholders GERAL a PLACA.
Validação: Valdir Nunes pode ser selecionado (borda vermelha) mas mantém o botão bloqueado, com dica "Valdir Nunes está com a trilha de inspeção do implemento vencida. A competência deriva da trilha vigente: não há como marcá-lo apto aqui." Sem seleção: "Escolha quem executa para despachar." Com seleção válida: "Chega como tarefa no app, offline-first. A inspeção só existe quando sincronizar."
Botões "Cancelar" e "Enviar ao app". Ao confirmar: fecha; toast "Inspeção do <comp> / <placa> despachada para <nome>. Aparece no app dele agora." O cartão permanece no pátio.

Drawer **Registro lacrado** (lateral direita, 520 px, animação deslizar). Cabeçalho: "REGISTRO DE INSPEÇÃO / <comp> / <placa>", título "<id> / <resultado>", subtítulo "<quando> / <quem> / <tipo>". "CAMPOS DO REGISTRO": inspetor ("<nome> / trilha 6 vigente"), data e hora, resultado, checklist ("8 itens / 3 críticos"), ângulos ("N de 6 capturados"), GPS, sincronização, viagem. "EVIDÊNCIAS / N" com link "Baixar tudo →" e uma linha por foto capturada (ex.: "geral-c1.jpg" com o hash da inspeção e "baixar"). Bloco "Registro lacrado" ("sincronizado, não editável. Correção entra como evento novo.") com "Iniciar retificação" e "Ver no dossiê". Ações:
- Linha de evidência: toast "<arquivo> baixado com hash conferido e carimbo de 6 ago."
- "Baixar tudo →": toast "Registro completo baixado: checklist, fotos, assinatura e hashes num pacote lacrado."
- "Iniciar retificação": fecha o drawer; toast "Retificação iniciada: o registro original fica intacto; a correção entra como evento novo com justificativa obrigatória."
- "Ver no dossiê": navega para `Dossie.dc.html`.

Modal **Ângulo** (título = nome do ângulo, ex.: "Bica de descarga"; subtítulo "<comp> / <placa> / <id>"). Área de imagem com estado "capturado pela câmera do app" ou "ângulo obrigatório ainda não capturado". Campos de leitura:
- Capturado: "arquivo" (ex.: "bica-c1.jpg"), "capturada em", "origem" ("câmera do app / galeria bloqueada"), "hash". Botão "Baixar foto": fecha; toast "<arquivo> baixado com metadados de integridade e marca d’água."
- Faltando: "exigido por" ("checklist graneleiro / v4"), "quem captura", "efeito" ("a inspeção não fecha"). Botão "Notificar o inspetor": fecha; toast "Jorge Mattos notificado: falta o ângulo bica de descarga. A viagem reavalia sozinha quando a foto sincronizar."
Botão "Fechar" em ambos.

Modais do perfil: **Meu perfil**, **Preferências e notificações** (4 interruptores, "Bloqueio técnico na filial" travado), **Papel ativo** (5 papéis, toast na troca), **Sair da conta** (toast "Sessão encerrada. ...", sem navegação). Iguais às outras duas telas.

## Estados e simulações
- Loading: 900 ms na montagem. Skeleton shimmer de 3 cartões apenas na seção do pátio. Durante o loading a lista "Inspeções registradas" fica sem itens e sem texto de vazio; os KPIs e o rail já aparecem.
- Prop de simulação `simularPatioVazio` (boolean, padrão false, seção "Fila do pátio"): esvazia o pátio e mostra o estado vazio.
- Vazio do pátio: "Nenhum compartimento esperando" / "Todo conjunto com carregamento marcado já foi inspecionado. Quando o despachante vincular um compartimento a uma viagem, ele aparece aqui."
- Vazio da lista: "Nada neste recorte" com "Nada corresponde à busca "<termo>" neste filtro." (com busca) ou "Nenhuma inspeção com este resultado no período." (sem busca).
- Paginação: texto "mostrando X a Y de Z inspeções" ou "nenhum registro"; botões desabilitados nas extremidades. Não visível com o mock atual (5 itens, 6 por página).
- Botão "Enviar ao app" desabilitado sem executor ou com executor não elegível.
- Estado inicial: INS-4471 expandida, filtro "Todas", tipo de checklist "Graneleiro".
- Esc fecha popovers e modais do perfil; não fecha despacho, drawer nem modal de ângulo.

## Entidades e operações
- Compartimento no pátio (fila de inspeção): consultar; despachar inspeção para executor.
- Inspeção pré-carregamento: consultar (lista, filtro, busca), consultar registro lacrado, retificar (toast), exportar (toast), ver no dossiê.
- Ângulo / foto: consultar; baixar (toast); notificar captura faltante (toast).
- Checklist por tipo de implemento: consultar (Graneleiro, Tanque, Baú).
- Inspetor / executor: consultar elegibilidade (trilha); notificar.
- Viagem: navegar.
- Filial: trocar contexto (só rótulo).
- Perfil / papel: consultar, trocar papel, preferências, sair.

## Regras de negócio visíveis
- A inspeção é feita no app, com foto pela câmera e GPS do aparelho; galeria bloqueada.
- Seis ângulos obrigatórios (geral, cantos, teto, piso, bica, placa); a inspeção não fecha com ângulo faltando.
- O checklist é detectado pelo tipo do implemento e muda com ele (graneleiro, tanque, baú).
- Item crítico reprova a inspeção sozinho; item não crítico gera pendência corrigível.
- "Não aplicável é resposta válida, não lacuna."
- Inspeção reprovada por item crítico somada a T-1 de ureia pecuária vira bloqueio técnico: "nenhuma autoridade libera, existe plano de regularização".
- Inspeção sem sincronizar não conta como evidência para o motor; "A inspeção só existe quando sincronizar."
- Pendência de ângulo não se resolve no escritório; a viagem segue na fila da Torre até a captura e reavalia sozinha quando a foto sincronizar.
- Competência do executor deriva da trilha vigente; trilha vencida torna "não elegível" e não há como marcar apto na tela.
- Registro lacrado é sincronizado e não editável; correção entra como evento novo.
- O regime mínimo exibido no pátio vem da base IDTF a partir do T-3.

## Observações factuais
- Os KPIs são constantes no código (18 no período, 14 aprovadas, 2 pendências, 2 reprovadas, 3 na fila, 1 sem sincronizar); a lista tem 5 inspeções, com 1 reprovada e 1 pendência.
- O KPI "Esperando o inspetor" (3) e o subtítulo "3 compartimentos esperando" não mudam com `simularPatioVazio`.
- Trocar a filial muda o rótulo e o subtítulo e mostra toast "pátio e inspeções recalculados", mas pátio, lista e KPIs não mudam. O menu oferece 4 filiais; o modal "Meu perfil" lista "Rondonópolis, Sorriso".
- Não há chip de filtro para "aguardando sincronização"; INS-4462 só aparece em "Todas" (os chips somam 4 de 5).
- Paginação implementada (6 por página) não aparece porque a lista tem 5 itens.
- "Enviar ao app" fecha o modal com toast, mas o cartão continua no pátio e nada é criado na lista.
- "Retificar" (linha) e "Iniciar retificação" (drawer) só mostram toast; nenhum formulário de justificativa abre, embora o toast diga que a justificativa é obrigatória.
- "Exportar", "Baixar tudo →", downloads de evidência e "Baixar foto" só mostram toast.
- O drawer exibe "Registro lacrado / sincronizado, não editável" também para INS-4462, cuja sincronização é "salva no aparelho" e hash "pendente".
- O campo "checklist" do drawer é calculado pelo tipo; "inspetor" sempre recebe "trilha 6 vigente".
- Os toasts de notificação citam sempre "Jorge Mattos" e, no botão da linha, sempre "bica de descarga" (coincide com o único item com ângulo faltando no mock).
- O selo "⌘K" não tem atalho de teclado associado.
- O subtítulo diz "Terça, 5 ago"; os toasts de download e exportação falam em "carimbo de 6 ago" / "carimbadas em 6 ago".
- O pátio identifica "C2 / QAS 7C31" como "bitrem / 3 compartimentos", com T-1 "Farelo de soja / 2 ago"; `Ativos e Frota.dc.html` mostra QAS 7C31 + SQT 9E18 como "graneleiro / 2 compartimentos" e o C2 travado por ureia pecuária no T-1. A própria INS-4468 (C2 / QAS 7C31) cita "T-1 de ureia pecuária".
- Nesta tela os compartimentos são identificados pela placa QAS 7C31, que em `Ativos e Frota.dc.html` é a placa do cavalo do conjunto; em `Compartimento Detalhe.dc.html` o compartimento é identificado pela placa do implemento (SQT 9E18).
- INS-4470 ("C1 / SQT 3A90", VG-2490, hoje 19:05, Jorge Mattos, aprovada, hash a3f8…9c2e) coincide em viagem, horário e hash com a inspeção do "C1 / SQT 9E18" em `Compartimento Detalhe.dc.html`.
- O hash de INS-4465 (7b10…44d1) é o mesmo do bloco "Limpeza B registrada" em `Compartimento Detalhe.dc.html`.
- "Ver o compartimento" leva sempre ao C1 do SQT 9E18, inclusive para o tanque T1 RTB 5J18.
- Jorge Mattos é descrito como "inspetor de pátio / Rondonópolis" aqui e como "inspetor qualificado / trilha 6 vigente" em `Ativos e Frota.dc.html`.
- A busca não filtra o pátio, embora o placeholder cite "compartimento".
- O drawer de registro desta tela tem "Baixar tudo →" e "Ver no dossiê"; o de `Compartimento Detalhe.dc.html` tem "Baixar registro completo" e não tem link para o dossiê. O toast de "Iniciar retificação" é idêntico nas duas telas.
- Cartão de rodapé da sidebar ("Checklist vigente") é específico desta tela.
- Nas citações deste inventário, o ponto médio usado como separador na interface foi transcrito como barra (/).
