# Viagens
Arquivo: Viagens.dc.html. Item da sidebar: "Viagens" (seção OPERAÇÃO, item ativo, sem badge). Perfil a quem se destina (pelo que a tela diz): não declarado na tela; o usuário logado é "Rafael Antunes", "Gestor de qualidade, GMP+"; o modal "Nova viagem" traz o selo "o motor decide, você vincula", e a linha do tempo da Viagem Detalhe atribui a criação da viagem ao "despachante". Objetivo declarado na tela: não há frase de objetivo; o subtítulo é "Terça, 5 ago / Filial Rondonópolis MT / 9 operações no período" e o rodapé diz "Motorista sem competência vigente não é selecionável ao criar uma viagem, e a tela diz o motivo, não apenas desabilita."

## Entradas e saídas
- Como se chega: item "Viagens" da sidebar em Viagem Detalhe e em Dossie; breadcrumb "Viagens" (com seta para a esquerda) no topo de Viagem Detalhe. Demais origens: ver mapa do site.
- Para onde leva:
  - Cada linha da tabela é um link para "Viagem Detalhe.dc.html" (todas as linhas, inclusive a criada pelo modal, levam ao mesmo arquivo, que mostra sempre a VG-2490).
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html), "Exceções e liberações" (Excecoes.dc.html), "Inspeções" (Inspecoes.dc.html), "Limpezas" (Limpezas.dc.html), "Motor IDTF" (Motor IDTF.dc.html), "Subcontratados" (Subcontratados.dc.html), "Motoristas" (Motoristas.dc.html), "Acessos externos" (Acessos Externos.dc.html), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html), "Não conformidades" (Nao Conformidades.dc.html), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html), "Protótipo mobile" (App de Campo.dc.html).
  - Nenhum outro elemento da tela navega.

## Estrutura da tela
1. Sidebar (canônica). Logo "Traxium / Compliance". Itens e badges: "Torre de Controle" 7; OPERAÇÃO: "Viagens" (ativo), "Exceções e liberações" 5, "Inspeções" 3, "Limpezas" 3; PILARES: "Motor IDTF", "Subcontratados", "Motoristas" 42, "Acessos externos" 2, "Academy", "Ativos e frota"; PROVA: "Dossiê de auditoria", "Indicadores" 11/15, "Não conformidades" 4; rodapé: "Configurações", "Onboarding público" "6 passos", "Protótipo mobile" "12 telas", "Recolher menu". Card "Base IDTF Brasil": "v2026.07 vigente", "Revisada em 28 jul / Qualidade". Badges fixos.
2. Cabeçalho. Título "Viagens"; subtítulo "Terça, 5 ago / Filial Rondonópolis MT / {total} operações no período" (total = 9 no mock, soma 1 a cada viagem criada; não reage ao período). À direita: campo de busca (placeholder "Buscar código, produto, placa, cliente…"), seletor de período (valor inicial "Esta semana ▾"), botão "+ Nova viagem", avatar "RA" com menu de perfil.
3. Barra de filtros.
   - Grupo "VISÃO" com 4 chips: "Todas" (tooltip "sem recorte"), "Travadas hoje" ("bloqueadas ou aguardando análise, com carregamento hoje"), "Carregam em 2h" ("janela de carregamento nas próximas duas horas"), "Regime C e D" ("as que exigem limpeza pesada antes de carregar"). O chip ativo muda de cor; as linhas não mudam (ver Observações).
   - 5 chips de decisão com contagem calculada sobre todas as viagens: "Todas / 9", "Motor / 3", "Autoridade / 1", "Análise / 3", "Bloqueadas / 2". Filtram a tabela.
   - Botão "Filtros" à direita, com badge numérico de filtros ativos; abre popover (ver Ações).
4. Tabela (card branco). Colunas: "VIAGEM" (código, produto, peso; ex.: "VG-2490", "Farelo de soja", "37 t"), "ROTA / CLIENTE" (ex.: "Sorriso MT → Uberlândia MG", "NutriMax Rações"), "MOTORISTA" (avatar com iniciais, nome, vínculo; ex.: "IP", "Ivan Prado", "subcontratado / Lima Logística"), "CONJUNTO" (cavalo, implemento e compartimento; ex.: "QAS 7C31 / SQT 9E18", "C1"), "REGIME" (letra em quadrado colorido; ex.: "B"; valores no mock: A, B, ⊘), "DECISÃO DO MOTOR" (chip; valores: "✓ Liberada pelo motor", "✓ Por autoridade", "Aguardando análise", "✕ Bloqueada"), "STATUS" (ponto colorido e texto; valores: "Agendada", "Em carregamento", "Em trânsito", "Concluída").
   - Mock: 9 viagens (VG-2496, VG-2494, VG-2492, VG-2490, VG-2487, VG-2486, VG-2483, VG-2481, VG-2478). Distribuição: decisão motor 3, autoridade 1, análise 3, bloqueada 2; regime A 5, B 3, ⊘ 1; status Agendada 5, Em carregamento 1, Em trânsito 2, Concluída 1.
   - Reage a: busca (código, produto, rota, cliente, motorista, cavalo, implemento), chips de decisão, filtro de status e filtro de regime do popover. Não reage a visão nem a período.
   - Paginação: 8 por página; com 9 viagens aparecem 2 páginas, texto "mostrando 1 a 8 de 9 viagens", botões "Anterior", "1", "2", "Próxima". A paginação some quando há 1 página só.
5. Nota de rodapé fixa: "Motorista sem competência vigente não é selecionável ao criar uma viagem, e a tela diz o motivo, não apenas desabilita."
6. Toast (fixo no rodapé, some após 4,2 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Itens da sidebar | Sidebar | navegação | Destinos listados em Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Alterna sidebar entre 264 px e 84 px; grava em localStorage "tx-nav". |
| Campo de busca | Cabeçalho | muda estado | Filtra linhas ao digitar e volta para a página 1. |
| Seletor de período | Cabeçalho | popover | Opções "Hoje", "Esta semana", "Este mês", "Últimos 90 dias". Ao escolher, só troca o rótulo; tabela e total não mudam. |
| "+ Nova viagem" | Cabeçalho | modal | Abre o modal "Nova viagem" com todos os campos zerados (detalhe abaixo). |
| Avatar "RA" | Cabeçalho | popover | Mostra "Rafael Antunes", "Gestor de qualidade, GMP+" e as opções "Meu perfil", "Preferências e notificações", "Papel ativo" (com badge do papel, ex.: "Gestor"), "Sair". Fecha ao clicar fora ou com Esc. |
| "Meu perfil" | Menu do avatar | modal | Modal "Meu perfil" (detalhe abaixo). |
| "Preferências e notificações" | Menu do avatar | modal | Modal com interruptores (detalhe abaixo). |
| "Papel ativo" | Menu do avatar | modal | Modal de troca de papel (detalhe abaixo). |
| "Sair" | Menu do avatar | modal | Modal "Sair da conta" (detalhe abaixo). |
| Chips de "VISÃO" | Barra de filtros | toast e muda estado | Marca o chip, volta para a página 1 e mostra toast "Visão "{nome}": {tooltip}." ou, para "Todas", "Recorte limpo.". As linhas não são filtradas. |
| Chips de decisão | Barra de filtros | muda estado | Filtram a tabela por decisão; clicar no ativo não desmarca (só "Todas" volta ao total). Sem toast. |
| "Filtros" | Barra de filtros | popover | Popover "Filtros" com seções "STATUS OPERACIONAL", "REGIME DE LIMPEZA", "AINDA NÃO FILTRÁVEL" e o texto "Filtro novo entra aqui dentro, não na barra. A barra é para o que se usa todo dia; o resto é para quando precisa." |
| Chips de status ("Agendada", "Carregando", "Em trânsito", "Concluída") | Popover Filtros | muda estado | Alterna filtro de status (um por vez; clicar no ativo desliga). Conta no badge de "Filtros". |
| Chips de regime ("✳", "A", "B", "C", "D") | Popover Filtros | muda estado | Alterna filtro de regime. Não conta no badge e não é limpo por "Limpar tudo" (ver Observações). |
| Chips "Conjunto", "Rota", "Cliente", "Filial de origem" | Popover Filtros, "AINDA NÃO FILTRÁVEL" | toast | "Filtrar por {nome} ainda não existe. Quando existir, entra aqui dentro, sem ocupar a barra." Nenhuma mudança de estado. |
| "Limpar tudo" | Popover Filtros | toast e muda estado | Ativo só quando há filtro de status; zera status (e a chave fRg) e mostra "Filtros limpos. A visão salva continua valendo." |
| Linha da tabela | Tabela | navegação | Abre "Viagem Detalhe.dc.html". |
| "Anterior", números, "Próxima" | Paginação | muda estado | Troca de página; "Anterior" e "Próxima" ficam com cursor bloqueado nos limites. |

Modal "Nova viagem" (selo "o motor decide, você vincula"; fecha por "✕" ou clique no fundo; não tem botão Cancelar):
- PRODUTO (legenda "base IDTF: 1.240 produtos"): campo "Buscar produto na base…" e chips de produto. Sem busca mostra 4 chips ("Farelo de soja", "Milho a granel", "Soja em grãos", "Calcário calcítico"); com busca, até 6 resultados de um catálogo de 10 itens. Seleção única. Obrigatório.
- Busca sem resultado: caixa ""{termo}" não está na base IDTF. Sem produto oficial, a viagem não nasce." com botão "Enviar para análise técnica", que mostra toast ""{termo}" enviado à fila técnica do Motor IDTF. A Qualidade classifica; a viagem pode nascer quando houver produto oficial." e limpa a busca. Nada é criado na tela.
- CARGA E JANELA: chips de cliente ("NutriMax Rações", "Coop. Aurora", "Granja Sto. Expedito", "Bela Vista Nutrição"), obrigatório; campo "peso, ex.: 37" com sufixo "t" (aceita só dígitos, vírgula e ponto), obrigatório; campos livres "origem, ex.: Rondonópolis MT" e "destino, ex.: Uberlândia MG", obrigatórios; "CARREGA" com chips "hoje 14:00", "amanhã 06:30", "amanhã 14:00", obrigatório; legenda "descarga estimada pela rota".
- CONJUNTO E COMPARTIMENTO: 3 opções de rádio, obrigatório: "QBD 3E90 + SQT 6B77 / C1" ("graneleiro / frota própria / disponível agora", "T-3: A"); "QAS 7C31 + SQT 9E18 / C2" ("graneleiro / Lima Logística / livre após as 14:00", "T-3: A"); "QCP 8A55 + SQT 5F31 / C1" ("graneleiro / frota própria / em manutenção leve", "T-3: B").
- MOTORISTA: 4 cartões, obrigatório: "Sérgio Ramos", "Milton Costa", "Edson Farias" ("10 trilhas vigentes / elegível") e "Valdir Nunes" desabilitado com o texto em vermelho "não selecionável: trilha "Regimes de limpeza" vencida há 6 dias".
- Rodapé: "Ao criar, o motor avalia as 12 condições na hora. Ninguém digita o resultado." e botão "Criar viagem", habilitado só com os 8 campos preenchidos (produto, conjunto, motorista, cliente, janela, peso, origem, destino).
- Resultado: fecha o modal, insere no topo da tabela a linha "VG-2497" com produto, peso, rota e cliente digitados, motorista escolhido, vínculo "próprio", conjunto "QBD 3E90 / SQT 6B77", "C1", regime "A", decisão "✓ Liberada pelo motor", status "Agendada". Toast: "VG-2497 criada para {cliente}, carrega {janela}. O motor avaliou as 12 condições em 0,9s: liberada, regime A."

Modal "Meu perfil": avatar "RA", "Rafael Antunes", "rafael.antunes@traxium.com.br"; linhas "Papel: Gestor de qualidade", "Autoridade na matriz: nível 3 / Gestor", "Filiais: Rondonópolis, Sorriso", "Liberações assinadas em 2026: 14"; texto "Toda assinatura sua fica no registro lacrado da viagem. O papel define o que a matriz permite; ninguém assina acima do próprio nível." Só leitura, sem botões além de "✕".

Modal "Preferências e notificações": 4 interruptores: "Bloqueio técnico na filial" ("sempre ativo: requisito da certificação", travado ligado), "Item há mais de 2h na fila" ("aviso no app e por e-mail", ligado), "Certificado de terceiro a vencer" ("aos 30 e aos 15 dias", ligado), "Nova versão da base IDTF" ("quando a Qualidade publicar revisão", desligado). Clique alterna o estado; sem toast nem botão salvar. Rodapé: "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação."

Modal "Papel ativo": texto "O papel define o que a matriz de autoridade permite assinar. A autoridade escala para cima, nunca para baixo, e ninguém assina acima do próprio nível."; 5 opções com nível: "Inspetor de pátio" 1, "Tráfego" 2, "Gestor de qualidade" 3 (padrão), "Diretoria e Resp. Técnico" 4, "Auditor interno" 0, cada uma com o que resolve. Clique troca o papel, fecha e mostra "Papel ativo agora é {papel}, nível {n}. A fila e as ações de assinatura passam a refletir esta autoridade." Muda só o badge do menu e o texto do modal Sair. Rodapé: "Nível 0 é técnico: é o nível de autoridade de ninguém. Contaminação não se aprova, se regulariza."

Modal "Sair da conta": cartão com "Rafael Antunes", "{papel} / nível {n} na matriz"; texto "Nada é perdido ao sair. Registro lacrado continua lacrado, e o que estava em preenchimento não foi gravado em lugar nenhum."; botões "Cancelar" e "Sair". "Sair" fecha o modal e mostra "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data."; não navega.

## Estados e simulações
- Loading: ao montar, 900 ms de skeleton com 6 linhas e efeito shimmer na tabela.
- Vazio: quando nenhum registro passa nos filtros, "Nenhuma viagem neste filtro" e "Ajuste a busca ou os filtros de decisão e regime."
- Sem estado de erro.
- Sem props de simulação. Estado interno: filtros, período, visão, página, modal de nova viagem, viagens criadas na sessão (lista "extra", perdida ao recarregar), papel ativo, preferências.

## Entidades e operações
- Viagem: consultar (lista, busca, filtros), criar (modal "Nova viagem"). Não há editar, cancelar, exportar ou ação em lote nesta tela.
- Produto (base IDTF): consultar no seletor do modal; "Enviar para análise técnica" quando não existe (só toast).
- Cliente, conjunto/compartimento, motorista: só seleção ao criar viagem.
- Usuário/papel: consultar perfil, trocar papel ativo, alternar preferências de notificação, sair.

## Regras de negócio visíveis
- "Motorista sem competência vigente não é selecionável ao criar uma viagem, e a tela diz o motivo, não apenas desabilita." Aplicado a "Valdir Nunes" no modal.
- "Sem produto oficial, a viagem não nasce." Produto fora da base só pode ser enviado à fila técnica.
- "Ao criar, o motor avalia as 12 condições na hora. Ninguém digita o resultado." A decisão não é campo do formulário.
- Todos os 8 campos do modal são obrigatórios para habilitar "Criar viagem".
- Cada conjunto aparece com o regime derivado do T-3 ("T-3: A", "T-3: B").
- "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação."
- Papéis: "ninguém assina acima do próprio nível"; "Auditor interno" nível 0 resolve "somente leitura, mais abrir não conformidade".

## Observações factuais
- Os chips de "VISÃO" só mudam de cor e mostram toast; o filtro da tabela não lê a visão escolhida. A definição de "Carregam em 2h" usa o status "carregando", valor que não existe nos dados (o código usa "car").
- O seletor de período só troca o rótulo; o subtítulo continua "9 operações no período" e a tabela não muda.
- O badge de "Filtros" e o "Limpar tudo" consideram a chave "fRg", mas os chips de regime gravam "fReg". Resultado: filtro de regime ativo não aparece no badge, deixa "Limpar tudo" desabilitado e não é limpo por ele.
- O filtro de regime oferece "✳", "A", "B", "C", "D"; o mock não tem viagem C nem D, e o regime "⊘" da VG-2487 não tem chip.
- O rótulo de status no filtro é "Carregando"; na tabela o mesmo status aparece como "Em carregamento". Na Viagem Detalhe a fase se chama "Carregamento".
- A coluna se chama "DECISÃO DO MOTOR" mas inclui o valor "✓ Por autoridade". Na Viagem Detalhe o mesmo estado se chama "Liberada por autoridade".
- O valor "Aguardando análise" (3 viagens) não tem estado correspondente na Viagem Detalhe, cuja prop só aceita bloqueada, liberada por autoridade e liberada pelo motor.
- Todas as linhas abrem a mesma Viagem Detalhe (VG-2490), inclusive VG-2478, VG-2487 e a VG-2497 criada.
- "Criar viagem" ignora o conjunto escolhido: a linha criada sempre recebe "QBD 3E90 / SQT 6B77", "C1", regime "A" e decisão "Liberada pelo motor", e o toast sempre diz "liberada, regime A", mesmo se o conjunto escolhido for o de "T-3: B". O vínculo do motorista é sempre "próprio".
- O código da viagem criada é fixo ("VG-2497"); criar duas vezes gera duas linhas VG-2497.
- O conjunto "em manutenção leve" é selecionável sem aviso.
- "Valdir Nunes" está bloqueado no modal por trilha vencida, mas na lista é o motorista da VG-2492 (Agendada, Aguardando análise).
- A legenda "base IDTF: 1.240 produtos" convive com um catálogo de 10 produtos no mock.
- "Enviar para análise técnica", "Sair" e as opções "AINDA NÃO FILTRÁVEL" só mostram toast, sem mudança de estado visível. "Sair" não navega para nenhuma tela.
- Lista com 9 itens e paginação de 8 por página (2 páginas).
- Esc fecha os popovers e os modais de perfil, mas não fecha o modal "Nova viagem".
- O subtítulo "Terça, 5 ago" é fixo; a Viagem Detalhe usa "hoje" ora como 5 ago ("carrega amanhã, 06:30" para 6 ago) ora como 6 ago (comprovante "anexado hoje, 10:41" e toast com "6 ago, 10:41").
- Os modais de perfil, preferências, papel e sair são idênticos aos da Viagem Detalhe e do Dossie.
