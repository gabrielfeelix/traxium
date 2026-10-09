# Qualiforce, Quali-e e outros softwares usados por empresas GMP+ no Brasil (pesquisa de 08/10/2026)

Escopo: Brasil, 2025-2026. Este arquivo complementa a seção 1 de `mercado_brasileiro.md` e não repete o fluxo de viagem já descrito lá (upload da ordem de carregamento, T-3, declarações, assinatura por WhatsApp com SHA-256, lavador como fornecedor, agências, CT-e, link para icrt-idtf.com).

Método e grau de certeza:
- "Verificado" significa que o fato está na fonte citada, lida em 08/10/2026.
- O site da Qualiforce é WordPress. As páginas foram lidas pelo HTML e pela API pública `wp-json`.
- O Quali-e foi lido de novo no bundle público `https://quali-e.com/assets/index-BDHtwLBE.js` (1,68 MB, o mesmo arquivo da pesquisa anterior), agora pelas rotas, pelas chaves de configuração e pelos status. O bundle mostra o que existe no código. Não mostra o que cada cliente usa.
- Busca web em português sobre esse nicho rende pouco. Vários itens pedidos ficaram em "Gaps".
- Telas do Traxium citadas: Gatekeeper, Academy, IDTF Brasil, Control Tower, Network, Dossiê de auditoria, Inspeção pré-carregamento, Exceções.

## 1. Qualiforce como empresa: histórico, equipe, números declarados, clientes, canais

### Takeaway
A Qualiforce é uma consultoria pequena (LinkedIn: 2 a 10 funcionários) com matriz em Criciúma/SC e unidade em Atibaia/SP. O CEO é Alexandre de Souza. Ela diz responder por "mais de 85% das certificações ativas" de GMP+ FSA no Brasil e por 93% de aprovação na primeira auditoria. Nenhum dos dois números tem fonte independente. A carteira visível é quase só de transportadoras rodoviárias. O software Quali-e é um produto lateral da consultoria, feito pela própria equipe.

### Cited Findings

**Identidade, sedes e tempo de mercado**
- O site se apresenta como "consultoria nacional especializada em certificações ISO, ESG, SASSMAQ, EcoVadis, licenças regulatórias e inventário de carbono", com "mais de duas décadas de atuação" e "mais de 1.200 empresas atendidas em todo o Brasil". A matriz fica em Criciúma/SC e há unidade em Atibaia/SP — [Qualiforce, Sobre nós](https://qualiforce.com.br/sobre-2/); [Qualiforce, Contato](https://qualiforce.com.br/contato/)
  - Relevância para o Traxium: posicionamento. O concorrente vende "certificação + licenças + ESG" para transportadoras. O Traxium compete só no pedaço GMP+ operacional e precisa deixar isso claro na página comercial.
- Contradição de datas: a página do LinkedIn informa fundação em 2011 e diz "Desde 2011 também atua com licenciamentos para o setor de transportes". O site fala em "+20 anos". O LinkedIn põe a sede em Atibaia (Rua Yunes Demétrio Sabag, 244). O site chama Criciúma de matriz — [LinkedIn QualiforceBrasil](https://br.linkedin.com/company/qualiforcebrasil); contradito por [Qualiforce, Início](https://qualiforce.com.br/)
  - Relevância para o Traxium: nenhuma tela. Serve para calibrar quanto peso dar aos números autodeclarados.
- Tamanho: o LinkedIn mostra "2-10 funcionários" (4 perfis vinculados), 116 seguidores e nenhum post. As especialidades listadas são "Qualidade, ISO 9001, ISO 9000, ISO 34001 e SASSMAQ". GMP+ não aparece — [LinkedIn QualiforceBrasil](https://br.linkedin.com/company/qualiforcebrasil)
  - Relevância para o Traxium: canal comercial. A equipe é pequena. Se o Traxium vender para a base da Qualiforce, a consultoria tende a ser parceira de indicação ou concorrente direta, porque não tem gente para sustentar muito software.
- O link do menu "LinkedIn" no site aponta para um perfil pessoal (`linkedin.com/in/qualiforce`), não para a página da empresa — [Qualiforce, Início](https://qualiforce.com.br/)

**Números declarados sobre GMP+**
- Página Sobre, FAQ: "A Qualiforce é pioneira na implantação da GMP+FSA no Brasil e responsável por mais de 85% das certificações ativas no país." — [Qualiforce, Sobre nós](https://qualiforce.com.br/sobre-2/)
- Home: "Liderança nacional em GMP+FSA. Entre as empresas com GMP+FSA no país, a grande maioria foi com a Qualiforce" e "Somos reconhecidos como líderes nacionais em certificações GMP+ no setor de transporte." — [Qualiforce, Início](https://qualiforce.com.br/)
- Página Contato: "+1.200 empresas atendidas", "93% de aprovação na 1ª auditoria", "Atendimento em até 24h" — [Qualiforce, Contato](https://qualiforce.com.br/contato/)
  - Relevância para o Traxium: pesquisa de mercado e vendas. Se o número de 85% estiver perto da verdade, a maioria das transportadoras GMP+ do Brasil passou por esse consultor e pode já ter recebido o Quali-e. Vale cruzar a lista pública de certificados GMP+ (base de empresas do GMP+ International) com a carteira da Qualiforce antes de prospectar.
- A Qualiforce não aparece na lista de GMP+ Registered Consultants do GMP+ International. Os consultores registrados com Brasil na região são Certifee (Valesca Bicca Vieira), Global Trusted Auditors (Isaac Bezerra), KDV Group, Marković Food Management (Leonardo Marcoviq Borges), SWOT Consultoria e Soluções (Fernanda Mateus, só transporte) e Virginia Mendonça. A página tem botão "Load more", então a lista lida pode estar incompleta — [GMP+ International, Registered Consultants](https://www.gmpplus.org/en/collaborations/registered-consultants)
  - Relevância para o Traxium: parcerias. Há pelo menos cinco consultores registrados no GMP+ que cobrem transporte no Brasil e não vendem software próprio de transporte (ver seção 3). São canais de parceria possíveis que não competem com o Traxium.

**Serviços**
- Página Serviços (criada em 2023): ISO 9001, 14001, 27001, 28001, 37001, 39001, 45001, SASSMAQ, "Good Manufacturing Practices GMP+", "Qualificação de transportadoras", auditorias internas, treinamentos presenciais e online, licenciamento ambiental, Exército, Polícia Federal, ANVISA, alvarás da Polícia Civil de SP, PR e MG, licenciamento para transporte internacional e credenciamento no Ministério da Agricultura — [Qualiforce, Serviços](https://qualiforce.com.br/servicos/)
  - Relevância para o Traxium: Gatekeeper. "Qualificação de transportadoras" é serviço de consultoria vendido à parte, ou seja, a qualificação de terceiros hoje é feita por gente, não por sistema. É exatamente o que o Gatekeeper automatiza.
- QGreen-c é a marca da Qualiforce para inventário de emissões (escopos 1, 2 e 3, ISO 14064), compensação e créditos de carbono e "Método QESG" baseado na ABNT PR 2030. Tem Instagram próprio, @qgreenc — [Qualiforce, QGreen-c](https://qualiforce.com.br/qgreenc/)
  - Relevância para o Traxium: nenhuma tela hoje. Mostra que a Qualiforce empurra o cliente transportador para ESG. Se o Traxium tratar EUDR ou pegada de carbono no futuro, vai encontrar a Qualiforce de novo.

**Equipe identificada**
- Alexandre de Souza, CEO, assina a página de contato — [Qualiforce, Contato](https://qualiforce.com.br/contato/)
- Rakel Quaresma, "Consultora de Qualidade", é a autora do "Manual do Motorista: Operações por Afretamento GMP+FSA", Revisão 01, 05/05/2026, servido dentro do Quali-e. O PDF tem metadados de autor "Rakel Quaresma" — [Quali-e, ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf)
- Depoimentos citam pelo primeiro nome "Gabi e Rakel" (União Brasil Transportes), "Raquel" (Grupo Camera) e "Alexandre" (Transportes JC) — [Qualiforce, Início](https://qualiforce.com.br/)
- O LinkedIn mostra Bruna Fernandes De Paula como funcionária, sem cargo — [LinkedIn QualiforceBrasil](https://br.linkedin.com/company/qualiforcebrasil)
  - Relevância para o Traxium: descoberta. A consultora que escreve o treinamento do motorista e conduz as auditorias GMP+ dos clientes (Rakel Quaresma) é a pessoa que define, na prática, o conteúdo do Quali-e.

**Clientes visíveis**
- Logos no site, carregados em 2023: Beviani, Fribon Transportes, Marqueti Transportes, Starnew, Sul Continental. Logos carregados em 26/01/2026: Transportes Angelina, Agrolog, Rodofrota, Rodomaster, Resolve Soluções Marítimas, Rodolider Transportes, Pactus Transportes, RodoViva Transportes, Mandira Transportes & Logística. Logo carregado em 11/2025: Transportes JC. Os logos não dizem quais clientes são GMP+ (identificação feita a partir dos arquivos de imagem do site) — [Qualiforce, Início](https://qualiforce.com.br/)
- Depoimentos com selo "Cliente GMP+FSA": União Brasil Transportes ("UBT") e Grupo Camera. Transportes JC aparece como "Cliente SASSMAQ & Licenciamentos" — [Qualiforce, Início](https://qualiforce.com.br/)
- A Rodofrota, que está entre os logos, publicou em 25/08/2026 que passou pela auditoria de monitoramento GMP+ FSA da Control Union em Paranaguá (PR), em 18 e 19/08/2026, com escopo de transporte e afretamento, "zero não conformidades", e que "a tecnologia Quali-e permite centralizar documentos e informações" — [Rodofrota](https://www.rodofrota.com.br/post/rodofrota-conclui-auditoria-de-monitoramento-de-certifica%C3%A7%C3%A3o-gmp-fsa-com-escopo-de-transporte-e-afre)
  - Relevância para o Traxium: lista de prospects e de entrevistas. A Rodofrota é o único cliente do Quali-e confirmado em fonte pública. Tem escopo de afretamento, que é o caso de uso do Gatekeeper. Vale uma entrevista de descoberta para entender o que o Quali-e resolve e o que falta.
- Não há embarcador, fábrica de ração nem trading entre os logos. A carteira visível é de transportadoras, mais uma empresa marítima (Resolve) — [Qualiforce, Início](https://qualiforce.com.br/)

**Redes, eventos e conteúdo**
- Instagram @qualiforce: "Qualiforce | Auditorias, Consultorias e Treinamentos", 4.418 seguidores, 5.001 seguindo. Destaques: QInsights, Feedbacks, SASSMAQ, ISO 9001, Quem somos. Não há destaque de GMP+ nem de Quali-e na parte visível. Link externo: qualiforce.canva.link — [Instagram Qualiforce](https://www.instagram.com/qualiforce/)
- Linktree "qualiforcebr", bio "Certificações & Licenciamentos para empresas de Transportes, Indústrias e Serviços". O primeiro link é "Evento Transport Meeting | Inscreva-se aqui", que aponta para icqbrasil.net/evento-transporte. A página do evento retornou 404 em 08/10/2026. Há também Facebook "QualiforceConsultorias" — [Linktree Qualiforce](https://linktr.ee/qualiforcebr); [ICQ Brasil, evento (404)](https://www.icqbrasil.net/evento-transporte)
  - Relevância para o Traxium: canal. A Qualiforce aparece em evento de transporte ligado à ICQ Brasil. Eventos de certificadoras com transportadoras são lugar natural para o Traxium aparecer.
- Blog "Além do Certificado": a API do WordPress não retorna nenhum post (`/wp-json/wp/v2/posts` vazio em 08/10/2026). A página do blog existe só como texto institucional — [Qualiforce, Blog](https://qualiforce.com.br/blog/); [API posts](https://qualiforce.com.br/wp-json/wp/v2/posts)
  - Relevância para o Traxium: conteúdo. Não há conteúdo técnico público de GMP+ transporte da Qualiforce. O espaço de conteúdo em português sobre T-3, IDTF e Gatekeeper está ocupado por Marković e Qualikadi, não pela Qualiforce.
- Os PDFs de treinamento do motorista apontam para dois vídeos do YouTube ("Para mais informações e cargas proibidas"): youtube.com/watch?v=_gABlPfOb-k e youtube.com/watch?v=Mn5bOetfYr0. O conteúdo e o dono dos vídeos não foram verificados — [Manual do Motorista no Quali-e](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf)

**Preço**
- Não há preço público da consultoria nem do Quali-e. O site só oferece "Agende um diagnóstico" e WhatsApp (48) 99975-4790 — [Qualiforce, Início](https://qualiforce.com.br/)

### Inferences
- O número de 85% é autodeclarado e não tem método. Ainda assim, a lista de logos (cerca de 15 transportadoras) e a Rodofrota sugerem que a Qualiforce tem de fato muitas transportadoras rodoviárias GMP+ na carteira. Para o Traxium, cada cliente da Qualiforce é ao mesmo tempo prospect e usuário potencial do Quali-e.
- A consultoria é pequena e o software foi feito por ela mesma (ver seção 2). O risco para o Traxium não é o produto, que é simples. O risco é o canal: o consultor que conduz a auditoria recomenda a ferramenta.
- Consultores registrados no GMP+ (SWOT, Certifee, GTA, Virginia Mendonça, Marković) não têm software de transporte visível. São parceiros mais naturais para o Traxium do que a Qualiforce.

### Gaps
- CNPJ, razão social e data real de abertura da Qualiforce: a busca não encontrou registro. Daria para resolver consultando a Receita por nome com acesso a uma base de CNPJ.
- Conteúdo dos posts do Instagram e do Facebook, vídeos no YouTube e webinars: o Instagram mostra só a grade e a bio sem login. Não achei canal de YouTube da Qualiforce.
- Data, local e programação do "Transport Meeting": a página retorna 404.
- Parcerias formais (certificadoras, GMP+ International): nenhuma encontrada.
- Reclame Aqui e Capterra Brasil: não encontrei perfis da Qualiforce nem do Quali-e nas buscas. Não consultei o Reclame Aqui diretamente.

## 2. Quali-e: módulos, app, ajuda, uso diário por transportadora, EUDR

### Takeaway
O site da Qualiforce descreve o Quali-e como uma plataforma de gestão de "certificações, licenças, treinamentos, cronogramas e prazos" com "planos de ação, evidências, alertas de pendências e registros de auditoria". O código público não tem nada disso. As rotas do app cobrem embarque (viagens, motoristas, frota, produtos, agências, fornecedores de limpeza, responsáveis por inspeção, assinatura, verificação de hash), mais conciliação de CT-e e cobrança de saldos de frete por WhatsApp. A tela chamada "Auditoria" importa planilha de CT-e e não tem relação com auditoria GMP+. Não há app nativo, não há nada de EUDR e o "treinamento" é um PDF de 4 páginas que o motorista precisa abrir antes de assinar.

### Cited Findings

**Promessa comercial contra o que o código tem**
- Promessa: "O Quali‑E é uma plataforma digital desenvolvida pela própria equipe da Qualiforce para facilitar a gestão de certificações, licenças, treinamentos, cronogramas e prazos. Com ele, sua empresa tem tudo centralizado em um só lugar: vencimentos, documentos obrigatórios, planos de ação, evidências, alertas de pendências e registros de auditoria." — [Qualiforce, Sobre nós](https://qualiforce.com.br/sobre-2/)
- Código: o roteador do app tem só estas rotas: `/`, `/admin-access`, `/admin-dashboard`, `/agencies`, `/auditoria`, `/comercial`, `/controle-viagens`, `/ctes-confirmados`, `/drivers`, `/frota`, `/inspection-responsibles`, `/pending-balances`, `/pending-balances-dashboard`, `/products`, `/reports`, `/signature`, `/suppliers`, `/trips`, `/users`, `/verificacao`, `/verification`, `/zapi-config`. Não existem rotas de planos de ação, não conformidades, cronograma, licenças da empresa, auditoria interna ou registros de auditoria GMP+ — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- A tela `/auditoria` tem o título "Auditoria" e o subtítulo "Importação e validação de relatórios de CTEs". Ela importa um Excel, cruza CT-e com viagem e marca divergências, por exemplo "Motorista não bate (planilha: ... / sistema: ...)" — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- A busca pelo termo "EUDR" no bundle não retornou nenhuma ocorrência. Também não há termos de desmatamento ou geolocalização de origem — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Dossiê de auditoria e Exceções. O concorrente não tem dossiê de auditoria GMP+, não tem registro de não conformidade e não tem plano de ação. O que ele chama de "auditoria" é conciliação fiscal. O Dossiê e as Exceções do Traxium não têm equivalente no Quali-e, apesar do que o site promete. Nos materiais de venda, vale nomear a tela como "Dossiê de auditoria GMP+" para não ser confundida com a "Auditoria" de CT-e.

**Mapa de telas (do menu e das rotas)**
- Menu lateral com ícones e rótulos que aparecem no hover. Itens identificados: Viagens, Controle de Viagens, Motoristas, Frota, Relatórios, Cadastros (com "Motoristas", "Agências", "Produtos"), Fornecedores, Responsáveis por Inspeção, Usuários, CT-e confirmados, Saldos pendentes, Configuração Z-API. Há "Manual do Usuário" para todos e "Manual do Administrador" só para o perfil ADMINISTRADOR — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- Perfis de acesso: ADMINISTRADOR, GESTOR, MOTORISTA — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Network e permissões. Três perfis bastam ao concorrente. O motorista é usuário do sistema (assina por link). O gestor de agência vê só os caminhões da agência.
- Multiempresa por "tenant": a tela de escolha lista "Sistema Demonstração", "Demo Transportes" e "Tainara Transportes" e redireciona para `/?tenant=<slug>` — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)

**Configurações por cliente (o que cada transportadora ajusta)**
- Chaves de configuração no código, com a descrição gravada no próprio código: `LOADING_ORDER_MODEL` ("Modelo de ordem de carregamento utilizado pelo sistema", valor padrão "MODELO SISTEMA ATUA"); `MANUAL_TRIP_CREATION` ("Permite criação manual de viagens na tela de processamento"); `CLEANING_DOCUMENTS_REGIME_A` ("Permite anexar comprovantes opcionais de limpeza para produtos de regime A"); `CNH_OBRIGATORIA`; `DRIVER_CHECKLIST_ENABLED` ("Exige o checklist do motorista na assinatura quando houver template cadastrado"); `EMAIL_ARQUIVAMENTO` ("Email de destino para arquivamento dos documentos assinados"); templates `TEMPLATE_TERMO_COMPROMISSO` (padrão "TERMO_NOVO.docx"), `TEMPLATE_TERMO_TRANSPORTADORA` e `TEMPLATE_DRIVER_CHECKLIST`. Subir ou baixar template exige uma senha mestre enviada no cabeçalho `x-inspection-master-password` — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Control Tower e configurações. (1) O leitor de ordem de carregamento é treinado por modelo de ERP. O padrão é o do "Sistema Atua", provavelmente o TMS/ERP usado pelos clientes (inferência, não confirmada). O Traxium precisa de um leitor por modelo de ordem, começando pelos TMS mais comuns no grão. (2) Os documentos são templates Word por cliente, o que indica que cada transportadora tem seu próprio Termo de Compromisso e o próprio checklist. O Traxium deve permitir modelo de documento por cliente. (3) Regime A não exige comprovante de limpeza por padrão. B, C e D exigem.

**Status e estados de tela**
- Status de assinatura: "ASSINADO", "PARCIAL" (só motorista ou só agência assinou), "NÃO ASSINADO". Status de envio: "LIBERADA" quando o e-mail de arquivo foi enviado, "AGUARDANDO ANEXOS" quando não. Outros: "VIAGEM CANCELADA", "AGUARDANDO ENVIO EMAIL", "EMAIL ENVIADO", "CRIAR VIAGEM MANUAL". Resultado de verificação: "VÁLIDO E ÍNTEGRO", "INVÁLIDO OU ALTERADO", "ASSINATURA VÁLIDA". Respostas do checklist: "CONFORME", "NÃO CONFORME", "NÃO APLICÁVEL" — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Control Tower e Inspeção pré-carregamento. No concorrente, "liberada" significa "papelada assinada e arquivada", não "compartimento elegível". A resposta do checklist tem três estados (conforme, não conforme, não aplicável). O Traxium deve ter os mesmos três estados e separar "liberação documental" de "decisão de elegibilidade".
- Data de treinamento: o formulário mostra um selo quando a data do treinamento é igual à data de embarque. Ou seja, o treinamento é registrado no mesmo dia do carregamento — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Academy. No mercado, "treinamento" do motorista terceiro acontece no próprio embarque, como leitura antes da assinatura. A Academy do Traxium precisa de um modo curto, feito no celular no momento do carregamento, além das trilhas.

**Frota contra afretamento**
- Relatórios e exportações separam "Frota" de "Afretamento" ("Tipo (Frota/Afretamento)", "Somente Frota", "Somente Afretamento", botões "Baixar Frota" e "Baixar Afretamento"). Colunas da exportação: "Número da Viagem", "Tipo", "Número CTE", "Placa Veículo", "Nome Motorista", "Cliente", "Produto" e status — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Gatekeeper e Dossiê. As duas categorias de certificação GMP+ (Road Transport e Affreightment) aparecem como filtro de relatório. O Dossiê do Traxium deve permitir o mesmo corte, porque o auditor olha as duas categorias separadas.

**Treinamento do motorista (conteúdo real)**
- O documento obrigatório é "Manual do Motorista: Operações por Afretamento GMP+FSA", 4 páginas, Revisão 01 de 05/05/2026, feito em Word. Ele vale "tanto para motoristas autônomos (TAC) quanto para subcontratados". Explica o Protocolo Gatekeeper ("permite que empresas certificadas GMP+FSA utilizem transportadoras não certificadas, desde que elas cumpram uma série de requisitos de controle e rastreabilidade"), o papel do motorista (compartimento limpo, informar as cargas anteriores, permitir inspeção, comunicar problemas, não fumar, comer ou beber perto da carga, usar EPI), os regimes de limpeza e os documentos ("Declaração das Três Últimas Cargas; Declaração de Conformidade das Condições Higiênicas; CT-e e MDF-e"). Também diz o que fazer em caso de problema (rasgo de lona, acidente, derramamento, suspeita de contaminação: "informar imediatamente a empresa contratante") — [Manual do Motorista no Quali-e](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf)
- O manual lista só três regimes: "Tipo A (a seco) – escovação ou uso de soprador. Indicada para grãos e farelos; Tipo B (com água)...; Tipo C (água + produto de limpeza)". O regime D (desinfecção) não aparece, embora exista no cadastro de produtos do app — [Manual do Motorista no Quali-e](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf); [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- Inspeção descrita para o motorista: o compartimento "deve estar limpo e seco, sem resíduos visíveis, odores estranhos, sinais de umidade ou danos estruturais", com verificação de "piso, as laterais, o teto, os cantos do compartimento, bem como a lona e os acessórios". Se houver problema, "o carregamento poderá ser adiado" — [Manual do Motorista no Quali-e](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf)
  - Relevância para o Traxium: Academy, Inspeção pré-carregamento e Exceções. (1) Este é o conteúdo mínimo que o mercado aceita como treinamento Gatekeeper do motorista terceiro. O primeiro módulo da Academy deve cobrir os mesmos tópicos, com a mesma linguagem (TAC, afretamento, lona, carga anterior). (2) A lista de pontos da inspeção (piso, laterais, teto, cantos, lona, acessórios) é a ordem natural de um checklist de compartimento graneleiro. (3) A lista de incidentes (rasgo de lona, acidente, derramamento, suspeita de contaminação) é uma lista pronta de tipos de exceção.

**Módulo de saldos de frete (não GMP+)**
- Status de cobrança de saldo pendente: "Pendente", "Mensagem Enviada", "Comprovantes na Agencia", "Comp. Enviados P/ Matriz", "Quebra Peso", "Proprietário C/ Comprovantes", "Já Foi Trocado - Verificar", "Solicitado Deposito Via Email", "TROCADO". Há envio em massa por Z-API para todos os "Pendente" e um painel por status, agência e mês de emissão — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- Mensagens de teste vão para um "grupo VERTTI", com a frase "Notificações VERTTI 24/7 sem intervenção manual" — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: decisão de escopo (não seguir). O módulo de saldos e o grupo "VERTTI" indicam que o Quali-e foi estendido sob medida para um cliente com operação de agenciamento de frete. É customização de um cliente, não um caminho de produto GMP+.

**Maturidade técnica e custos internos**
- O código inclui um painel interno da Qualiforce com custos do sistema: "Replit Core – Hospedagem e infraestrutura de desenvolvimento – R$ 110" por mês, "Neon PostgreSQL – Banco de dados gerenciado com backup automático – R$ 105", "Domínio quali-e.com – R$ 3", com renovações em junho e julho de 2025. Há também "Contratos de Venda" (com campo "Valor mensal (ex: R$ 300)"), "Gráfico de faturamento vs custos", "Controle de Domínios" e "Gerenciador de Tarefas" — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: posicionamento e argumentos de venda. O produto roda com cerca de R$ 220 por mês de infraestrutura, num ambiente de desenvolvimento (Replit), e expõe no bundle público a área administrativa do dono. É um produto feito pela consultoria, com renovações datadas de 2025, o que sugere lançamento por volta do primeiro semestre de 2025 (inferência). Segurança, isolamento entre clientes e trilha de auditoria são diferenciais que o Traxium pode demonstrar para o comprador de qualidade.

**Página comercial, demonstração e app**
- A página `/comercial` lista: "Automação Total", conformidade GMP+ FSA, assinatura eletrônica com "verificação hash", "Redução de Custos: Economia de até 80% no tempo de processamento", "Segurança Total: Controle de acesso por níveis, backup automático e criptografia de dados", "Relatórios Inteligentes: Dashboards em tempo real". Blocos de função: "Extração automática", "Geração da Viagem", "Checklist automático", "Declarações", "Verificação hash", "Sem instalação", "Agências", "Relatórios/Estatísticas/Métricas", "Validação/Verificação pública". O botão é "Solicitar Demonstração Gratuita" — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
- Não há app nativo. A busca "quali-e" no Google Play não traz o Quali-e (traz Qualicorp, QualiSign, Qualiex e outros). A própria página comercial vende "Sem instalação" — [Google Play, busca "quali-e"](https://play.google.com/store/search?q=quali-e&c=apps&hl=pt_BR); [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)
  - Relevância para o Traxium: Inspeção pré-carregamento e app de campo. O motorista usa um link web no celular. Um app instalável não é exigência do mercado. Um web app que funcione bem pelo link do WhatsApp é o padrão a igualar.
- Manuais do usuário e do administrador existem como botões, mas o conteúdo não é público — [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js)

**Como uma transportadora usa no dia a dia (reconstrução)**
- Sequência possível a partir das telas e dos status (fonte para todos os passos: [bundle Quali-e](https://quali-e.com/assets/index-BDHtwLBE.js) e [Manual do Motorista](https://quali-e.com/ATIVIDADE_DE_TRANSPORTE_MOTORISTA.pdf)):
  1. O operador da agência sobe a ordem de carregamento em PDF (modelo "Sistema Atua" ou outro), confere os dados extraídos e escolhe o fornecedor de limpeza.
  2. Informa as três últimas cargas ("baseado no histórico do motorista"), e o sistema mostra o regime mínimo. O operador pode clicar em "Conferir IDTF", que abre o site externo.
  3. O sistema gera a Declaração de Conformidade, a Declaração das Três Últimas Cargas, o Termo de Compromisso (padrão ou de transportadora contratada) e, se configurado, o checklist do motorista.
  4. Os links vão por WhatsApp (Z-API). O motorista abre o manual de treinamento, preenche o checklist (conforme, não conforme, não aplicável) e assina. Depois assina o responsável da agência.
  5. Com tudo assinado e os anexos de limpeza enviados (regimes B, C e D), o pacote vai por e-mail para arquivo e a viagem fica "LIBERADA".
  6. Mais tarde, o financeiro importa o relatório de CT-e ("Auditoria") e vincula cada CT-e à viagem. A cobrança de saldo de frete segue pelo módulo de saldos.
  - Relevância para o Traxium: Control Tower. O dia a dia do concorrente é "ordem entra, papelada sai assinada". Não há etapa em que o sistema diga "este compartimento não pode carregar este produto" e bloqueie. A demonstração do Traxium deve começar pelo mesmo gatilho (ordem de carregamento) e mostrar o bloqueio que o Quali-e não faz.

### Inferences
- Há uma distância grande entre a promessa do site (gestão de certificações, licenças, planos de ação, registros de auditoria) e o produto (gestão de embarque mais financeiro de frete). O mais provável é que o texto da página Sobre descreva um plano, ou o serviço da consultoria somado ao software. Na venda, o Traxium deve mostrar telas, não promessas.
- O fato de o manual de treinamento listar só A, B e C mostra que nem o material da consultoria líder segue com rigor os regimes do IDTF. Uma base IDTF embutida e correta (IDTF Brasil) tem valor real.
- O Quali-e parece ter poucos clientes ativos: há três tenants de exemplo no código, a única referência pública é a Rodofrota e há customizações nomeadas (VERTTI). Não há dado de número de clientes.

### Gaps
- Número de clientes, preço real e data de lançamento: não publicados. "R$ 300" e "R$ 40/ano" são placeholders de formulário.
- Vídeos ou capturas da interface real: não encontrei. A Qualiforce não tem posts no blog nem canal de YouTube identificado.
- Conteúdo dos manuais do usuário e do administrador: não público.
- App Store: não consultei diretamente. O Google Play não tem o app.
- Quem é "VERTTI" e o que é o "Sistema Atua": a busca não encontrou nenhum dos dois.

## 3. Outros softwares e consultorias usados por empresas GMP+ no Brasil

### Takeaway
Não encontrei nenhum outro software brasileiro feito para GMP+ transporte além do Quali-e. Os sistemas de qualidade genéricos (Qualyteam, Qualiex, SoftExpert, Interact) cobrem documentos, não conformidades, planos de ação, auditorias internas e fornecedores, sem nada de T-3, IDTF, compartimento ou motorista. As consultorias registradas no GMP+ que cobrem transporte no Brasil (Marković, SWOT, Certifee, GTA, Virginia Mendonça) vendem implantação e treinamento, não software. Para o Traxium, o concorrente direto continua sendo o Quali-e. Os SGQs genéricos são adjacentes e podem ser integração ou substituto parcial para a parte de sistema de gestão.

### Cited Findings

**SGQs genéricos brasileiros**
- Qualiex (ForLogic): módulos de planos de ação (Kanban e Gantt, prazos, responsáveis, custos), atas de reunião, auditorias ("Defina requisitos, colete evidências e acompanhe planos de ação em um único lugar"), indicadores, processos, fornecedores ("Gerencie e audite fornecedores", avaliações periódicas, vínculo com não conformidades) e metrologia. Tem uma página para indústria de alimentos citando "HACCP, FSSC, BPF e ANVISA". GMP+ não aparece. Preço não público ("Ver demonstração") — [Qualiex](https://www.qualiex.com/); [Qualiex, planos de ação](https://qualiex.com/planos-para-a-gestao-da-qualidade/)
- O Qualiex tem apps no Google Play: "Qualiex | ForLogic" e "Qualiex Auditorias | ForLogic" — [Google Play, busca](https://play.google.com/store/search?q=quali-e&c=apps&hl=pt_BR)
  - Relevância para o Traxium: Dossiê de auditoria e Exceções. O comprador de qualidade de uma fábrica de ração ou trading GMP+ provavelmente já usa um SGQ desse tipo para não conformidades e planos de ação. O Traxium não precisa refazer isso. Pode exportar exceções e evidências para o SGQ, ou manter um ciclo de exceção bem simples.
- Qualyteam: diz ter "+900 clientes". Tem trilha para alimentos ("conformidade e rastreabilidade dos processos de fabricação de alimentos") e um depoimento da Transportes Bertolini Ltda. sobre amadurecimento do SGQ. Preço não aparece no HTML da página de preços — [Qualyteam](https://qualyteam.com/pb/); [Qualyteam, preços](https://qualyteam.com/pb/precos/). Fundada em 2008, sede em Balneário Camboriú/SC, com módulos de documentos, indicadores, auditoria e riscos — [Craft, Qualyteam](https://craft.co/qualyteam)
  - Relevância para o Traxium: Network e prospecção. Transportadoras grandes (como a Bertolini) já compram SGQ genérico. O Traxium vai conviver com esse sistema, não substituí-lo.
- SoftExpert: tem página de preços com planos ("Start" e superiores, cada um incluindo o anterior). O preço é "plano escolhido" mais "número de usuários", mas os valores não aparecem no HTML. Há vertical "Transporte e Logística" e casos em alimentos (Raízen, Pharlab) — [SoftExpert, preços](https://www.softexpert.com/pt-BR/precos/); [SoftExpert](https://www.softexpert.com/pt-br/)
  - Relevância para o Traxium: preço. SoftExpert cobra por usuário. Para o Traxium, cobrar por usuário pesa no caso Gatekeeper, que tem muitos motoristas terceiros. Cobrar por carregamento ou por empresa evita esse problema.
- Interact Suite (Interact Solutions): SGQ e BPM com documentos, indicadores, planos de ação e não conformidades. Os depoimentos são de hospitais e universidades. Não há sinal de GMP+ nem de transporte — [Interact Solutions](https://www.interactsolutions.com/)
  - Relevância para o Traxium: nenhuma tela. É um adjacente distante.

**Consultorias com GMP+ transporte no Brasil**
- Marković Food Management (Leonardo Marcoviq Borges, consultor registrado no GMP+): post de 04/05/2025 "Transporte rodoviário no GMP+ FSA: o que uma transportadora precisa saber". Explica as categorias Road Transport of Feed e Affreightment of Road Transport e as normas R1.0, TS1.1, TS1.2, TS1.8 e TS1.9. Vende treinamento "Interpretação GMP+ FSA" para as duas categorias, consultoria e traduções. Nenhum software citado — [Marković FM](https://www.markovicfm.com/post/transporte-rodovi%C3%A1rio-no-gmp-fsa-o-que-uma-transportadora-precisa-saber). Publica todo ano as mudanças de revisão do GMP+ FSA (março de 2025 e março de 2026) — [Marković FM, mudanças março 2026](https://www.markovicfm.com/post/principais-mudan%C3%A7as-da-revis%C3%A3o-do-gmp-fsa-mar%C3%A7o-de-2026)
  - Relevância para o Traxium: Academy e parceria. É a principal fonte pública em português sobre GMP+ transporte. Bom candidato a parceiro de conteúdo ou validador técnico, e não compete em software.
- SWOT Consultoria e Soluções Ltda (Fernanda Mateus): consultor registrado no GMP+, região Brasil, especialidade só "Transport (Road, Rail, Inland Waterway)" — [GMP+ Registered Consultants](https://www.gmpplus.org/en/collaborations/registered-consultants)
- Certifee (Valesca Bicca Vieira): consultor registrado e instituto de treinamento registrado na GMP+ Academy, com transporte entre as especialidades — [GMP+ Registered Consultants](https://www.gmpplus.org/en/collaborations/registered-consultants); [GMP+ International, notícia](https://gmpplus.org/publications/news/registered-training-institute-from-brazil)
- Global Trusted Auditors (Isaac Bezerra), Brasil: consultor registrado desde 25/03/2025. Diz que vem "implementing GMP+FSA standards across production sites, warehouses and ports in Latin America". Só consultoria — [GMP+ International, GTA](https://gmpplus.org/publications/news/global-trusted-auditors)
- I9 Consultoria Empresarial (OEA Group): página de certificação GMP+ com seção "Clientes Certificados na GMP+" e FAQ genérica. Nenhum software — [I9 Consultoria](https://www.i9ce.com.br/certificacao-gmp/)
- Qualikadi (Smart Feed Program): já coberta na nota anterior. Programa de consultoria por etapas com uma "plataforma exclusiva" não descrita — [Qualikadi](https://www.qualikadi.com/blog/smart-feed-program-o-caminho-estrategico-para-a-certificacao-em-seguranca-de-alimentos-para-alimentacao-animal)
  - Relevância para o Traxium (para todas as consultorias acima): canal de parceria. Nenhuma tem ferramenta de operação de transporte. O Traxium pode ser a ferramenta que o consultor recomenda depois da certificação, o que o Quali-e já faz para a Qualiforce.

**Checklists genéricos**
- Ferramentas de checklist como Produttivo oferecem modelos digitais de checklist de veículos com foto — [Produttivo](https://www.produttivo.com.br/blog/checklist-de-veiculos/). Não achei uso documentado delas por transportadoras GMP+.
  - Relevância para o Traxium: Inspeção pré-carregamento. A alternativa barata ao Traxium é "checklist genérico com foto". O diferencial tem que estar no que acontece depois do checklist (decisão, bloqueio, dossiê), não no checklist.

### Inferences
- O mercado brasileiro tem duas camadas: SGQ genérico (documentos, não conformidades, auditoria interna) e consultoria. A camada do meio, a operação GMP+ do transporte, só tem o Quali-e, e o Quali-e cobre a papelada, não a decisão. O Traxium ocupa essa camada do meio.
- Como o comprador provavelmente já tem SGQ, o Traxium não deve tentar ser SGQ completo (planos de ação, gestão documental). Deve manter exceções e evidências ligadas ao carregamento e exportar para o SGQ.

### Gaps
- Verity, Ideagri, Sinapse, Food Design: não encontrei relação com GMP+ nem com transporte de ração. O Ideagri, pelo que conheço, é software de gestão de rebanho leiteiro, mas não verifiquei nesta pesquisa.
- Preços públicos de Qualyteam, Qualiex e SoftExpert: as páginas carregam os valores por JavaScript ou exigem demonstração. Não obtidos.
- Capterra Brasil e Reclame Aqui: não consultados diretamente.
- SGS e Bureau Veritas, treinamentos GMP+ no Brasil: não pesquisados nesta rodada.

## 4. O que transportadoras GMP+ brasileiras dizem usar

### Takeaway
Só uma transportadora certificada cita publicamente um sistema: a Rodofrota menciona o Quali-e no post sobre a auditoria de monitoramento de agosto de 2026. As outras falam da certificação sem citar ferramenta. Vagas de emprego com GMP+ e nome de sistema não apareceram nas buscas.

### Cited Findings
- Rodofrota: auditoria de monitoramento GMP+ FSA pela Control Union, Paranaguá/PR, 18 e 19/08/2026, escopo de transporte e afretamento, zero não conformidades, "a tecnologia Quali-e permite centralizar documentos e informações" — [Rodofrota](https://www.rodofrota.com.br/post/rodofrota-conclui-auditoria-de-monitoramento-de-certifica%C3%A7%C3%A3o-gmp-fsa-com-escopo-de-transporte-e-afre)
  - Relevância para o Traxium: Dossiê de auditoria e mensagem comercial. A transportadora associa o software a "centralizar documentos" para a auditoria. É o benefício que ela comunica. O Traxium deve ter uma frase equivalente para o Dossiê.
- Rodomaior: ampliou a certificação GMP+ FSA para afretamento em 23/07/2026 (certificada desde março de 2025). Não cita sistema nem consultoria — [Rodomaior](https://rodomaior.com.br/mais-um-importante-marco-na-trajetoria-da-rodomaior/)
  - Relevância para o Traxium: Gatekeeper. Segunda transportadora em 2026 com escopo de afretamento. A passagem para o afretamento é o gatilho de compra.
- Vagas: a busca por vagas de analista de qualidade em transportadora com GMP+ em 2026 não trouxe nenhuma vaga que cite GMP+ e um sistema. A mais próxima foi Analista da Qualidade Pleno na Transpedrosa (Betim/MG), de 03/09/2026, sem GMP+ — [Vagas.com, analista de transporte](https://www.vagas.com.br/vagas-de-analista-transporte?a%5B%5D=31)
  - Relevância para o Traxium: nenhuma tela. Indica que GMP+ ainda não é requisito nomeado em vaga e que quem opera é o analista de qualidade generalista.

### Inferences
- A combinação "consultoria Qualiforce + Quali-e" aparece pelo menos em um cliente com escopo de afretamento. É provável que outras transportadoras da lista de logos usem o mesmo arranjo, mas isso não está confirmado.

### Gaps
- Posts de LinkedIn de profissionais de qualidade de transportadoras GMP+ citando ferramentas: não acessíveis sem login e não apareceram na busca.
- Vagas na Gupy ou no LinkedIn Jobs citando "Quali-e": nenhuma encontrada.
- Estudos de caso de fábricas de ração e tradings sobre como recebem a documentação GMP+ do transportador: não encontrados nesta rodada.
