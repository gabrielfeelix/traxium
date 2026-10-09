# Console Traxium
Arquivo: `Console Traxium.dc.html`. Item da sidebar: a tela tem sidebar própria ("Traxium / Console interno", selo "SUPERFÍCIE A / A FORNECEDORA") com itens "Clientes" (ativo por padrão, badge 6), "Planos e faixas", "Módulos", "Usuários admin"; não consta na sidebar do back-office. Perfil a quem se destina (pelo que a tela diz): equipe interna da Traxium; usuário logado "Marina Sales", "Customer Success / Traxium"; acesso "Console". Objetivo declarado na tela: "Agosto de 2026 / 6 clientes / a Traxium vê uso e contrato, nunca conteúdo de decisão"; seção Clientes: "consumo do mês contra a faixa contratada".

## Entradas e saídas
- Como se chega: em `Configuracoes.dc.html`, seção "Organização e filiais", card "As cinco superfícies do produto", item "A Console Traxium". Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar, rodapé: "Voltar ao back-office" → `Torre de Controle v2.dc.html`.
  - Menu de perfil: "Ir ao back-office do cliente" → `Torre de Controle v2.dc.html`.
  - Rail, card "Base IDTF Brasil": "Abrir a governança da base" → `Motor IDTF.dc.html`.
  - Os 4 itens da sidebar não navegam: trocam a seção dentro da mesma tela.

## Estrutura da tela
1. Sidebar própria, fundo mais escuro que a do back-office. Logo com "Console interno"; selo âmbar "SUPERFÍCIE A / A FORNECEDORA"; 4 itens de seção (só "Clientes" tem badge, fixo "6"); rodapé com "Voltar ao back-office" e "Recolher menu".
2. Cabeçalho. Título dinâmico conforme a seção ("Clientes", "Planos e faixas", "Módulos", "Usuários admin"); subtítulo fixo citado acima. À direita: busca (placeholder "Buscar cliente, CNPJ, plano…"), botão primário "Novo cliente", avatar "MS" com menu. Busca e botão aparecem em todas as seções.
3. Faixa de 4 KPIs (visível em todas as seções):
   - "Clientes por faixa contratada": "5", "ativos / 1 em avaliação"; barra segmentada por faixa e legenda "Faixa 1 / 2", "Faixa 2 / 2", "Faixa 3 / 1", "Faixa 4 / 0" (title por segmento, ex.: "2 clientes na Faixa 1").
   - "Receita recorrente": "R$ 31,4 mil", "+ R$ 3,5 mil se a faixa 2 fechar".
   - "Acima da faixa": "1", "conversa de upgrade, não corte".
   - "Viagens processadas no mês": "2.479", "contagem agregada, sem conteúdo".
   - "5", "1" e "Acima da faixa" são calculados a partir do mock; receita e viagens são textos fixos (coincidem com a soma do mock).
4. Seção "Clientes" (padrão):
   - Cabeçalho "Clientes", "consumo do mês contra a faixa contratada", 3 filtros: "Todos / 6", "Acima da faixa / 1", "Em avaliação / 1".
   - Skeleton de 5 linhas por 900 ms na abertura.
   - Lista de 6 cartões-linha clicáveis. Campos: avatar com iniciais, nome (ex.: "Transrural Log Ltda"), CNPJ (ex.: "11.204.336/0001-58"), "<filiais> / cliente desde <mês>" (ex.: "4 filiais MT e GO / cliente desde mar 2025"), chip de situação ("ativo", "acima da faixa", "em avaliação", "inadimplente"), uso "<n> de <limite> viagens" com barra (âmbar quando estoura, ex.: "247 de 200"), faixa e valor (ex.: "Faixa 2", "R$ 6.400"; "Avaliação", "sem cobrança"), 6 quadrados de módulo com sigla ("GK", "AC", "ID", "CT", "NW", "DS"; apagado quando não contratado; title "<módulo>: contratado/não contratado"). Borda colorida para "acima da faixa" e "inadimplente".
   - Mock: Transrural Log Ltda (ativo, Faixa 2, 512/600), AgroSafra Transportes (acima da faixa, Faixa 1, 247/200), Cerrado Cargas S.A. (ativo, Faixa 3, 1180/1500), Planalto Logística (em avaliação, 34/200), Norte Grãos Transportes (inadimplente, Faixa 2, 388/600), Vale do Rio Transportes (ativo, Faixa 1, 118/200).
   - Reage à busca (nome, CNPJ, faixa) e ao filtro.
5. Seção "Planos e faixas": cabeçalho "Faixas de preço", "o preço acompanha o volume de viagens decididas, não o número de usuários". 4 cartões: número, nome, limite, valor "por mês", quantidade "clientes", botão "Ver clientes". Ex.: "Faixa 1", "até 200 viagens decididas por mês", "R$ 2.900", "2"; "Faixa 4", "acima de 1.500, com contrato dedicado", "sob proposta", "0". Card informativo "i": "Estourar a faixa não corta o serviço nem bloqueia decisão de carga..." Quantidades fixas no código.
6. Seção "Módulos": cabeçalho "Módulos", "quantos clientes têm cada um ativo". 7 cartões: sigla, nome, descrição, "<qtd> de <total> clientes" com barra, chip "em todos", "opcional" ou "segunda onda". Ex.: "AC Academy", "competência do motorista como requisito", "3 de 5 clientes", "opcional". Lista: Gatekeeper e subcontratados, Academy, Motor IDTF Brasil, Control Tower, Network e ativos, Dossiê de auditoria, EUDR e origem ("segunda onda, ainda não liberado"). Reage às ativações feitas no drawer de cliente. Sem ações.
7. Seção "Usuários admin": cabeçalho "Usuários da Traxium", "quem tem acesso a este console e até onde". 4 linhas: avatar, nome, papel, "PODE" e escopo, último acesso, botão "Ajustar". Ex.: "Marina Sales", "Customer Success", "contrato, uso agregado e módulos", "agora". Demais: Diego Nakamura (Suporte técnico, "logs de integração, sem dado de viagem", "há 2h"), Cláudia Bueno (Qualidade Traxium, "governança da base IDTF", "ontem"), Fernando Reis (Financeiro, "faturamento e faixas", "há 3 dias").
8. Rail direito (todas as seções):
   - Card escuro "O que este console não mostra", subtítulo "o espaço negativo desta superfície é requisito de conformidade, não recurso que faltou". 5 itens com "✕": "viagens, produtos e rotas de um cliente", "nomes de motoristas ou subcontratados", "fotos, assinaturas e dossiês", "motivo de bloqueio de uma carga específica", "quem assinou uma liberação". Nota: "A Traxium enxerga contagem de uso, nunca conteúdo de decisão. Suporte que precisa ver um caso pede acesso ao cliente, e o acesso fica registrado nos dois lados."
   - Card "Base IDTF Brasil", "a base normativa é produto da Traxium e serve todos os clientes", "v2026.07 vigente", 4 linhas fixas: "Produtos na base: 1.284", "Sinônimos regionais: 3.911", "Fila de classificação: 7 em análise", "Próxima revisão: out 2026". Botão "Abrir a governança da base".
9. Overlays: drawer do cliente, modal "Meu perfil", modal "Sair da conta", toast. O markup também contém o modal "Papel ativo", sem gatilho nesta tela.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| "Clientes", "Planos e faixas", "Módulos", "Usuários admin" | Sidebar | muda estado | Troca a seção e o título. Não há skeleton na troca. |
| "Voltar ao back-office" | Sidebar | navegação | `Torre de Controle v2.dc.html`. |
| "Recolher menu" | Sidebar | muda estado | Persiste em `localStorage` (`tx-nav`), compartilhado com o back-office. |
| Busca | Cabeçalho | muda estado | Filtra a lista de clientes por nome, CNPJ e faixa. Sem efeito nas outras seções. |
| "Novo cliente" | Cabeçalho | toast | "Novo cliente: o cadastro pede CNPJ, faixa inicial e módulos. A operação dele nasce vazia, sem dado nenhum vindo daqui." Nenhum formulário. |
| Avatar "MS" | Cabeçalho | popover | Cabeçalho "Marina Sales / Customer Success / Traxium"; "Meu perfil"; linha não clicável "Acesso" com chip "Console"; link "Ir ao back-office do cliente"; "Sair". |
| "Meu perfil" | Menu | modal | Leitura: "Marina Sales", "marina.sales@traxium.com.br", "Papel: Customer Success", "Superfície: A / Console Traxium", "Acesso a dado de cliente: nenhum, sem pedido" (vermelho). Nota: "Seu acesso cobre contrato, uso agregado e módulos. Ver um caso concreto exige pedido nominal, aprovado pelo cliente e registrado nos dois lados." |
| "Ir ao back-office do cliente" | Menu | navegação | `Torre de Controle v2.dc.html`. |
| "Sair" | Menu | modal / toast | Modal "Sair da conta" com avatar "RA", "Rafael Antunes", "Gestor / nível 3 na matriz" e texto "Nada é perdido ao sair. Registro lacrado continua lacrado...". "Cancelar" ou "Sair"; "Sair" mostra toast "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data." Não navega. |
| Filtros "Todos", "Acima da faixa", "Em avaliação" | Seção Clientes | muda estado | Filtram por situação. Não há filtro para "inadimplente" nem por faixa. |
| Cartão de cliente | Seção Clientes | drawer | Abre o drawer do cliente. |
| Drawer do cliente | Lateral direita, 540px | drawer | Cabeçalho "CLIENTE", avatar, nome, CNPJ. Bloco "CONTRATO": "Faixa contratada" (ex.: "Faixa 2 / até 600 viagens/mês"), "Valor mensal", "Uso no mês" (ex.: "512 viagens decididas"), "Situação", "Cliente desde"; botões "Propor mudança de faixa" e "Ver faturas". Bloco "MÓDULOS CONTRATADOS": 7 linhas com sigla, nome e interruptor. Bloco "USO NO MÊS": gráfico de 12 barras sem eixos nem rótulos (última barra destacada) e nota (ex.: "Cresceu 34% em seis meses. No ritmo atual estoura a faixa 2 em novembro..."). Bloco "SUPORTE": texto sobre pedido de acesso nominal e botão "Pedir acesso temporário". Fecha por "✕" ou clique no fundo; Esc não fecha. |
| "Propor mudança de faixa" | Drawer | toast | "Proposta de faixa gerada para <cliente>. Nada muda no serviço até o cliente aceitar." Sem escolha de faixa. |
| "Ver faturas" | Drawer | toast | "Faturas de <cliente> abertas. Valor por faixa, sem cobrança por usuário." Nada abre. |
| Interruptor de módulo | Drawer | muda estado / toast | Liga ou desliga o módulo para o cliente, sem confirmação; reflete nos quadrados da lista e nas contagens da seção Módulos. Toast: "<módulo> ativado|desativado para <cliente>. A mudança entra na próxima fatura e fica no log do contrato." EUDR: não muda; toast "EUDR é segunda onda e não está liberado para nenhum cliente. A diretriz manda deixar só os trilhos prontos." Não persiste ao recarregar. |
| "Pedir acesso temporário" | Drawer | toast | "Pedido de acesso temporário enviado ao gestor de qualidade de <cliente>. Você só entra se ele aprovar, e o acesso expira em 24h." Sem campo de motivo; sem estado de pedido pendente. |
| "Ver clientes" | Seção Planos e faixas | muda estado / toast | Vai para a seção Clientes com filtro "Todos" (não filtra pela faixa) e toast "<Faixa n>: <qtd> clientes. O preço acompanha viagens decididas, não usuários cadastrados." |
| "Ajustar" | Seção Usuários admin | toast | "<nome>: acesso ajustável dentro do console. Nenhum papel daqui enxerga dado de viagem sem pedido nominal ao cliente." Nada abre. |
| "Abrir a governança da base" | Rail, card Base IDTF | navegação | `Motor IDTF.dc.html`. |

## Estados e simulações
- Loading: skeleton de 5 linhas com shimmer na lista de clientes por 900 ms após montar; KPIs, rail e outras seções não têm skeleton.
- Vazio da lista de clientes: título "Nenhum cliente neste recorte"; texto "Nada corresponde à busca \"<termo>\"." (com busca) ou "Nenhum cliente com este status agora." (sem busca).
- Seções Planos, Módulos e Usuários não têm estado vazio.
- Simulação de situação por cliente no mock: ativo, acima da faixa (AgroSafra), em avaliação (Planalto), inadimplente (Norte Grãos).
- Ativação de módulos em memória (`state.mods`).
- Sem estados de erro.

## Entidades e operações
- Cliente (transportadora contratante): consultar (lista e drawer), filtrar, buscar; criar (só toast). Sem editar, arquivar ou exportar.
- Contrato e faixa: consultar; propor mudança (só toast).
- Fatura: consultar (só toast).
- Módulo contratado: ativar e desativar por cliente (muda estado); consultar adoção (seção Módulos).
- Faixa de preço: consultar.
- Usuário admin da Traxium: consultar; ajustar (só toast).
- Pedido de acesso ao cliente: criar (só toast).
- Base IDTF: consultar indicadores; navegar para a governança.

## Regras de negócio visíveis
- A Traxium vê uso e contrato, "nunca conteúdo de decisão"; lista explícita do que o console não mostra.
- Ver caso concreto exige pedido nominal, aprovado pelo gestor de qualidade do cliente, registrado nos dois lados, com expiração em 24h.
- Preço por faixa de viagens decididas, não por usuário (faixas 1 a 4: até 200, até 600, até 1.500, acima de 1.500 sob proposta).
- Estourar a faixa não corta serviço nem bloqueia decisão de carga; abre conversa comercial.
- Inadimplência não suspende o motor ("suspender a decisão de carga por inadimplência colocaria ração contaminada na estrada por causa de um boleto").
- Mudança de módulo entra na próxima fatura e fica no log do contrato.
- EUDR é segunda onda e não pode ser ativado para nenhum cliente.
- Novo cliente nasce com operação vazia.
- A base IDTF é produto da Traxium e serve todos os clientes.

## Observações factuais
- Convenção deste inventário: o separador ponto médio usado na interface aparece transcrito como barra (/).
- A seção Módulos mostra "<qtd> de 5 clientes" usando como total os clientes não em avaliação (5), enquanto a contagem inclui os 6 clientes; resultado no mock: "6 de 5 clientes" para Gatekeeper e subcontratados, Motor IDTF Brasil e Control Tower (chip "em todos"), e "5 de 5 clientes" para Dossiê de auditoria com chip "opcional". A barra usa 6 como total.
- O KPI "Clientes por faixa contratada" diz "5 ativos", mas entre os 5 estão 1 "inadimplente" e 1 "acima da faixa"; o filtro "Todos" e o subtítulo dizem 6 clientes.
- O modal "Sair da conta" mostra "Rafael Antunes", avatar "RA" e "nível <n> na matriz", embora a usuária logada seja "Marina Sales" (avatar "MS"). O toast fala em "Registros assinados continuam no dossiê", texto do back-office.
- O markup contém o modal "Papel ativo" (5 papéis do back-office), mas nenhum elemento desta tela o abre.
- Números da base IDTF divergem de `Motor IDTF.dc.html`: aqui "1.284" produtos, "3.911" sinônimos e "7 em análise" na fila; lá "1.240 produtos", "8.900 sinônimos" e "Fila técnica (3)". Nesta tela os sinônimos são chamados "Sinônimos regionais"; lá, "Sinônimos aprovados".
- Ações que só mostram toast, sem mudança de estado: "Novo cliente", "Propor mudança de faixa", "Ver faturas", "Pedir acesso temporário", "Ajustar".
- "Ver clientes" de cada faixa leva à lista sem filtro por faixa; o toast informa a quantidade.
- Badge "6" do item "Clientes" é fixo; quantidades por faixa são fixas no código (coincidem com o mock).
- Busca, botão "Novo cliente" e KPIs aparecem também nas seções Planos, Módulos e Usuários, onde a busca não tem efeito.
- O bloco "USO NO MÊS" do drawer mostra 12 barras sem rótulos de período; Planalto Logística, cliente desde jun 2026, aparece com 7 barras zeradas. A nota de Planalto diz "Avaliação de 60 dias, no dia 31".
- O CNPJ e a razão social de "Transrural Log Ltda" (11.204.336/0001-58) são os mesmos exibidos em `Configuracoes.dc.html`, card "A transportadora"; aqui ela aparece com "4 filiais MT e GO", lá as 4 filiais são de MT e GO.
- Ativar ou desativar módulo acontece sem confirmação, apesar do toast mencionar efeito em fatura.
- O link "Ir ao back-office do cliente" e "Voltar ao back-office" levam ao mesmo destino fixo, sem escolha de cliente, e não passam pelo "Pedir acesso temporário".
- Esc fecha só o menu e o modal de perfil; não fecha o drawer.
- A lista de 6 clientes não tem paginação nem ordenação.
