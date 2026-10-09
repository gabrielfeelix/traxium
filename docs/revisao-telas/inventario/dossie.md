# Dossiê de auditoria
Arquivo: Dossie.dc.html. Item da sidebar: "Dossiê de auditoria" (seção PROVA, item ativo). Perfil a quem se destina (pelo que a tela diz): quem prepara a amostra para o auditor; a tela fala de "a amostra que o auditor sorteou" e oferece "Compartilhar com auditor"; o usuário logado é "Rafael Antunes", "Gestor de qualidade, GMP+". Objetivo declarado na tela: "reconstrói a decisão de qualquer viagem em menos de dois minutos, sem WhatsApp"; card da sidebar "Critério de aceite": "Reconstruir uma amostra de 3 a 6 meses atrás em minutos, não em dias."

## Entradas e saídas
- Como se chega: item "Dossiê de auditoria" da sidebar em Viagens e em Viagem Detalhe. "Gerar dossiê desta viagem" na Viagem Detalhe não navega para cá (só toast). Demais origens: ver mapa do site.
- Para onde leva: apenas a sidebar ("Torre de Controle", "Viagens", "Exceções e liberações", "Inspeções", "Limpezas", "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota", "Indicadores", "Não conformidades", "Configurações", "Onboarding público", "Protótipo mobile"). Nenhum elemento do conteúdo navega; não há link para a Viagem Detalhe.

## Estrutura da tela
1. Sidebar. Mesmos itens e badges de Viagens, com "Dossiê de auditoria" ativo. O card inferior é diferente das outras duas telas: em vez de "Base IDTF Brasil / v2026.07 vigente", mostra "Critério de aceite" com o texto "Reconstruir uma amostra de 3 a 6 meses atrás em minutos, não em dias."
2. Cabeçalho. Título "Dossiê de auditoria"; subtítulo "reconstrói a decisão de qualquer viagem em menos de dois minutos, sem WhatsApp"; avatar "RA" com menu de perfil. Sem busca e sem botões de ação.
3. Coluna esquerda, cartão "1 / Filtrar a amostra" (título na tela com ponto médio): 4 linhas tipo dropdown, cada uma com rótulo e valor atual: "Período" ("maio a julho 2026"), "Código ou placa" ("qualquer"), "Produto" ("todos"), "Status" ("concluídas"). Opções:
   - Período: "maio a julho 2026", "últimos 30 dias", "últimos 90 dias", "2026 inteiro".
   - Código ou placa: "qualquer", "só SQT 9E18", "só QAS 7C31", "digitar código…".
   - Produto: "todos", "farelo de soja", "milho a granel", "casca de soja", "sorgo granífero".
   - Status: "concluídas", "liberadas por autoridade", "bloqueadas no período", "todas".
   A escolha muda só o valor exibido.
4. Coluna esquerda, cartão "2 / Selecionar viagens": chip "{n} de 4" (inicial "3 de 4"); subtítulo "a amostra que o auditor sorteou"; 4 viagens com caixa de seleção, código, produto, linha secundária e chip de decisão: "VG-2455" "Milho a granel" ("31 jul / QCP 8A55 / Valdir Nunes", "motor"), "VG-2412" "Casca de soja" ("24 jul / SQT 9E18 C1 / Milton Costa", "motor"), "VG-2344" "Sorgo granífero" ("10 jul / SQT 9E18 C1 / Ivan Prado", "autoridade"), "VG-2301" "Milheto" ("28 jun / SQT 4A66 / Sérgio Ramos", "motor"). As 3 primeiras vêm marcadas. Botão "Gerar reconstrução" (desabilitado com 0 selecionadas; durante a geração mostra "Reconstruindo…").
5. Coluna direita, área de reconstrução, com 3 estados:
   - Inicial: "Nenhuma reconstrução gerada ainda" e "Selecione as viagens da amostra à esquerda e gere. Cada viagem vira dezesseis blocos encadeados por hash, lacrados."
   - Gerando (1,5 s): "Reconstruindo {n} viagens…", barra de progresso animada, "lendo T-3, limpezas, inspeções, certificados como estavam na data, assinaturas…".
   - Gerado: cartão com:
     - Abas de viagem (pílulas com ponto colorido): "VG-2455", "VG-2412", "VG-2344"; legenda "navegue entre as viagens da amostra".
     - Título "Reconstrução / {código} / {produto}" e linha secundária (ex.: "31 jul 2026 / Lucas do Rio Verde MT → Uberlândia MG / gerada em 41 segundos"); selo à direita ("lacrado / cadeia íntegra" em verde para VG-2455 e VG-2412; "parcial / 15 de 16 blocos" em âmbar para VG-2344).
     - Faixa "HASH RAIZ" com o hash (ex.: "3f9a71c8e2d4b06f5a1e8c9d7b2f4a60d1c3e5f7"), "copiar" e "Verificar cadeia".
     - Só para VG-2344: faixa "Reconstrução parcial: o bloco 14 (fotos) não pôde ser lido do armazenamento frio; a lacuna está declarada e não quebra a cadeia dos demais." com link "Reprocessar bloco →".
     - Grade de 16 blocos (número, título, conteúdo, hash curto): 01 "Decisão do motor" ("liberada / 12 de 12 condições / base v2026.06", "f2a1…"), 02 "Autoridade" ("nenhuma: nunca chegou à mesa de ninguém"), 03 "Registro de liberação" ("não se aplica: sem exceção nesta viagem"), 04 "Transportador" ("frota própria / certificado GMP+ B4.3 vigente na data"), 05 "Acordo de qualidade" ("v3 / vigente / assinado por J. Lima em 02 mar"), 06 "Motorista" ("Valdir Nunes / CNH ****9917 / vínculo próprio"), 07 "Treinamentos" ("10 trilhas vigentes na data / nota mínima atendida"), 08 "Cavalo" ("QCP 8A55 / só tração, sem histórico"), 09 "Implemento e compartimento" ("SQT 5F31 / C1 / alumínio / conservação boa"), 10 "Produto e classificação IDTF" ("milho a granel / HS 1005.90 / regime B pelo T-3"), 11 "Histórico T-3" ("farelo de trigo / soja em grãos / milheto"), 12 "Limpeza" ("regime B / Estação Higitrans / 7 de 7 campos"), 13 "Inspeção" ("aprovada / Jorge Mattos / assinada no app"), 14 "Fotos" ("ausência declarada: teto sem marca d'água (padrão antigo)", destacado em âmbar), 15 "Assinaturas" ("motorista + inspetor / hash e geolocalização conferem"), 16 "Documentos" ("ordem, registro de limpeza, relatório lacrado").
     - Nota: "Bloco sem dado mostra a ausência em vez de desaparecer: a lacuna é informação de auditoria. O bloco 14 declara a foto de teto fora do padrão de marca d'água daquela época."
     - Botões de saída: "Exportar planilha", "Documento de reconstrução", "Pacote completo (.zip)", "Compartilhar com auditor"; legenda "+ {n-1} outras viagens nesta amostra".
6. Toast fixo no rodapé (some após 4,2 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Itens da sidebar | Sidebar | navegação | Destinos listados em Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Alterna largura; grava em localStorage. |
| Avatar "RA" | Cabeçalho | popover | Mesmo menu de Viagens: "Meu perfil", "Preferências e notificações", "Papel ativo", "Sair", com os mesmos modais e toasts. |
| Linha de filtro (Período, Código ou placa, Produto, Status) | Cartão 1 | popover | Abre lista de opções sob a linha; clicar de novo fecha. |
| Opção de filtro | Popover do filtro | toast e muda estado | Troca o valor exibido e mostra "Amostra refiltrada: {filtro} = {opção}." A lista de viagens não muda. "digitar código…" vira valor, sem campo de digitação. |
| Viagem da amostra | Cartão 2 | muda estado | Marca ou desmarca; atualiza "{n} de 4", a habilitação de "Gerar reconstrução" e a legenda "+ n outras viagens". |
| "Gerar reconstrução" | Cartão 2 | muda estado | Exige pelo menos 1 viagem marcada. Passa ao estado "Gerando" e, após 1,5 s, ao estado "Gerado". Pode ser clicado de novo depois de gerado. |
| Pílula de viagem | Reconstrução | muda estado | Troca código, produto, linha secundária, selo, hash raiz e faixa parcial. Os 16 blocos não mudam. |
| "copiar" (hash raiz) | Reconstrução | toast | "Hash raiz da {código} copiado. Cole no verificador público para conferir a integridade." Nada vai para a área de transferência. |
| "Verificar cadeia" | Reconstrução | toast | VG-2455 e VG-2412: "Cadeia da {código} verificada: 16 blocos, nenhuma quebra. O hash raiz confere com o carimbo da geração." VG-2344: "...: 15 de 16 blocos íntegros; a lacuna do bloco 14 está declarada e assinada." |
| "Reprocessar bloco →" | Faixa parcial (VG-2344) | toast | "Bloco 14 reenviado ao armazenamento frio. Se o arquivo aparecer, a cadeia regrava com evento novo; a lacuna atual fica no histórico." Estado não muda. |
| Bloco (01 a 16) | Grade de blocos | modal | Modal do bloco (detalhe abaixo). |
| "Exportar planilha" | Saídas | toast | "Planilha da amostra exportada: {n} viagens, 16 blocos por viagem, hash raiz no rodapé." |
| "Documento de reconstrução" | Saídas | toast | "Documento de reconstrução gerado com carimbo de 6 ago, pronto para o auditor." |
| "Pacote completo (.zip)" | Saídas | toast | "Pacote completo em preparação: evidências, fotos e cadeia de hashes. Você recebe o link em instantes." |
| "Compartilhar com auditor" | Saídas | modal | Modal "Compartilhar com o auditor". |

Modal do bloco (título com número e nome do bloco; subtítulo "como estava na data da viagem, não como está hoje"):
- Linhas: "conteúdo" (texto do bloco), "capturado de" ("estado real na data / nunca digitado"), "gravado em" ("31 jul 2026 / junto com a decisão"), "fonte" ("registro lacrado da viagem"; no bloco 14, "app do motorista / padrão antigo"), "encadeamento" ("aponta o hash do bloco raiz" no 01; "aponta o hash do bloco {anterior}" nos demais).
- Faixa "HASH DO BLOCO" com hash completo e "copiar" (toast "Hash do bloco copiado.").
- Botão "Baixar evidências do bloco": fecha e mostra "Evidências do bloco baixadas num pacote com hash conferido."
- Fecha por "✕" ou clique no fundo. Só leitura.

Modal "Compartilhar com o auditor" (selo "visão temporária, só leitura"):
- Campo "e-mail do auditor, ex.: auditor@qscert.com". Obrigatório; validação: precisa conter "@".
- "EXPIRA EM": chips "48 horas", "7 dias", "30 dias". Obrigatório, sem valor inicial.
- Texto: "O auditor vê a amostra reconstruída e as evidências, sem editar nada. Cada acesso fica logado; o link morre sozinho no prazo."
- Botões "Cancelar" e "Gerar link e enviar" (habilitado com e-mail válido e prazo).
- Ao confirmar: fecha e mostra "Link só leitura enviado a {e-mail}, expira em {prazo}. Cada acesso fica logado." Nenhum registro de acesso aparece na tela.

Modais de perfil ("Meu perfil", "Preferências e notificações", "Papel ativo", "Sair da conta"): idênticos aos de Viagens (campos, interruptores, 5 papéis, toasts).

## Estados e simulações
- Estado inicial da reconstrução (vazio): "Nenhuma reconstrução gerada ainda" com instrução.
- Estado "Gerando": barra animada por 1,5 s (animação "txbar").
- Estado "Gerado" com reconstrução completa (VG-2455, VG-2412) ou parcial (VG-2344, "parcial / 15 de 16 blocos").
- Sem skeleton de carregamento da página (a animação "txsh" está declarada no estilo e não é usada). Sem estado de erro além da reconstrução parcial.
- Sem props de simulação. Estado interno: valores dos filtros, viagens marcadas, fase da geração, viagem ativa, bloco aberto, campos do modal do auditor, papel e preferências.

## Entidades e operações
- Amostra de auditoria: filtrar (só rótulo), selecionar viagens, gerar reconstrução.
- Reconstrução/dossiê por viagem: consultar (16 blocos), verificar cadeia de hash, copiar hash, reprocessar bloco (toast), exportar (planilha, documento, pacote .zip; todos toast).
- Bloco de evidência: consultar, copiar hash, baixar evidências (toast).
- Acesso do auditor: criar link temporário só leitura com prazo (toast).
- Usuário/papel: mesmas operações de Viagens.
- Não há editar, retificar, cancelar ou arquivar.

## Regras de negócio visíveis
- "Cada viagem vira dezesseis blocos encadeados por hash, lacrados"; cada bloco "aponta o hash do bloco" anterior; o 01 aponta a raiz.
- Os blocos mostram o estado "como estava na data da viagem, não como está hoje"; "capturado de: estado real na data / nunca digitado".
- "Bloco sem dado mostra a ausência em vez de desaparecer: a lacuna é informação de auditoria."
- Reconstrução parcial é declarada e "não quebra a cadeia dos demais"; reprocessar regrava "com evento novo" e "a lacuna atual fica no histórico".
- Acesso do auditor: só leitura, temporário (48 horas, 7 dias ou 30 dias), cada acesso logado, link expira sozinho.
- Critério de aceite: reconstruir amostra de 3 a 6 meses atrás em minutos; subtítulo fala em "menos de dois minutos".

## Observações factuais
- Os filtros da amostra só trocam o valor exibido e mostram toast; a lista de 4 viagens é fixa.
- As pílulas da reconstrução são sempre VG-2455, VG-2412 e VG-2344, independentemente da seleção: VG-2301, se marcada, nunca aparece; uma viagem desmarcada continua aparecendo. A legenda "+ {n} outras viagens nesta amostra" usa a contagem de marcadas.
- Os 16 blocos são os mesmos para as 3 viagens e descrevem a VG-2455 (Valdir Nunes, QCP 8A55, SQT 5F31, milho). Na VG-2344, marcada como "autoridade" na amostra, o bloco 01 diz "liberada / 12 de 12 condições" e os blocos 02 e 03 dizem "nunca chegou à mesa de ninguém" e "sem exceção nesta viagem". O modal de todo bloco diz "gravado em 31 jul 2026", também para VG-2412 (24 jul) e VG-2344 (10 jul).
- O bloco 14 aparece como "ausência declarada" (marca d'água, padrão antigo) nas 3 viagens, inclusive nas que têm selo "lacrado / cadeia íntegra" e "16 blocos, nenhuma quebra". Para a VG-2344 a faixa parcial dá outro motivo para o mesmo bloco 14 ("não pôde ser lido do armazenamento frio").
- A VG-2412 é "Casca de soja" na lista da amostra e "Farelo de soja" na reconstrução; a rota da reconstrução é "Sorriso MT → Chapecó SC", e na Viagem Detalhe a mesma VG-2412 é "Casca de soja", "descarga Rio Verde GO".
- A VG-2455 está no compartimento C1 do implemento SQT 9E18 segundo o T-3 da Viagem Detalhe; aqui aparece com "QCP 8A55" e "SQT 5F31 / C1".
- O bloco 01 cita "base v2026.06" para uma viagem de 31 jul; a sidebar das outras telas informa "v2026.07 vigente, Revisada em 28 jul".
- O bloco 04 diz "frota própria" e o bloco 05 traz acordo de qualidade "assinado por J. Lima".
- O card inferior da sidebar é "Critério de aceite", diferente do card "Base IDTF Brasil" de Viagens e Viagem Detalhe.
- "copiar", "Verificar cadeia", "Reprocessar bloco →", "Exportar planilha", "Documento de reconstrução", "Pacote completo (.zip)", "Baixar evidências do bloco" e "Gerar link e enviar" só mostram toast, sem mudança de estado visível.
- O chip "{n} de 4" e "Gerar reconstrução" reagem à seleção; depois de gerada, desmarcar todas desabilita o botão mas a reconstrução continua exibida.
- Não há busca por código de viagem na tela; o filtro "Código ou placa" só oferece valores prontos.
- Não há link da reconstrução para a Viagem Detalhe nem para a tela de acessos externos.
- O filtro "Período" carrega o atributo "data-comment-anchor" com valor "67bbc7582e-div".
- Esc fecha só os popovers e modais de perfil; não fecha o modal do bloco, o do auditor nem o popover dos filtros da amostra (que usa a chave "fOpen").
- O subtítulo diz "sem WhatsApp"; a Viagem Detalhe oferece "Abrir WhatsApp" no contato com o motorista.
- Os modais de perfil, preferências, papel e sair são idênticos aos de Viagens e Viagem Detalhe.
