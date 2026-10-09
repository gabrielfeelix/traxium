# Software e ferramentas internacionais para compliance no transporte a granel de feed/food (GMP+ FSA, IDTF, documentos de limpeza, transporte sanitário)

Pesquisa feita em 08/10/2026. Fontes primárias priorizadas (GMP+ International, ICRT-IDTF, EFTCO/ECLIC, eCFR via Cornell LII, requisitos publicados por recebedores). Material de fornecedor é marcado como tal. Datas das fontes indicadas quando conhecidas; o que é anterior a 2024 está sinalizado como "antigo".

Nomes das telas do Traxium usados abaixo: Control Tower, Viagens (lista), Detalhe da viagem, Exceções/liberações, Motor IDTF, Subcontratados, Onboarding público, Acesso externo, Motoristas, Academy, Ativos e frota, Detalhe do compartimento, Inspeções, Limpezas, Não conformidades (CAPA), Dossiê de auditoria, Indicadores, Configurações, Console admin, App de campo.

---

## 1. Quais produtos e ferramentas existem para compliance de transporte GMP+/feed, histórico de últimas cargas e decisão de regime de limpeza?

### Takeaway
Não foi encontrado nenhum software comercial, na Europa ou nos EUA, que faça o que o Traxium faz: cruzar automaticamente as 3 últimas cargas de um compartimento com a IDTF e decidir se pode carregar. O "motor de decisão" do mercado é hoje a própria IDTF, uma base pública de consulta manual mantida pelo ICRT, mais planilhas, papel (diário de bordo/journey sheet, ECD) e checagem humana no portão do recebedor. As ferramentas oficiais (IDTF, GMP+ Academy, HACCP Excel, QS-Datenbank) são de consulta, treinamento ou cadastro, não de operação.

### Cited Findings

**IDTF (International Database Transport for Feed), a base oficial**
- A IDTF é uma base de dados de cargas anteriores e seus regimes de limpeza correspondentes, criada pelo ICRT (International Committee Road Transport), que mostra os requisitos mínimos de limpeza dos esquemas de certificação para transporte rodoviário a granel ([GMP+ IDTF](https://www.gmpplus.org/service-support/risk-management/idtf)).
  - Relevância para o Traxium: Motor IDTF (a base do Traxium é derivada desta; deve exibir a mesma semântica e as mesmas fontes).
- Membros do ICRT que mantêm a base: Qualimat, Ovocom, GMP+ International, QS, EFISC-GTP, AIC e AMA-Marketing ([IDTF newsletter 1/2025](https://www.icrt-idtf.com/international-database-for-transport-of-feed-idtf-newsletter-1-2025/); [IDTF Procedures](https://www.icrt-idtf.com/procedures/)).
  - Relevância para o Traxium: Motor IDTF, Configurações (escolha do esquema do cliente/destinatário: GMP+, QS, Ovocom/FCA, Qualimat, AIC, AMA).
- Busca da IDTF: "Companies can search by product name, product number, or cleaning regime"; para cada produto existe uma "data sheet" com "nature, minimal cleaning regime, and additional instructions" ([IDTF Procedures](https://www.icrt-idtf.com/procedures/)).
  - Relevância para o Traxium: Motor IDTF (busca por nome, número IDTF e regime; ficha do produto com natureza, regime mínimo e instruções adicionais).
- Interface atual (homepage alemã, 2026): seletor "Modul für" com "Straßentransport" (rodoviário) e "Binnenschifffahrt" (fluvial); filtros por regime de limpeza A, B, C, D; filtros "Verbotene Vorfracht" (carga anterior proibida) e "Liste mit Unterschieden" (lista de diferenças entre esquemas); caixa de texto com opção "Nur ganze Wörter", autocomplete a partir de 3 caracteres; idiomas DE, NL, EN, FR; link para manual do usuário; links úteis "Liste mit Unterschieden", "Anträge zur Einstufung" (pedido de classificação) e "Excel Generator" ([IDTF homepage DE](https://www.icrt-idtf.com/de/index.php?act=show&id=26)).
  - Relevância para o Traxium: Motor IDTF (filtro de proibidos, lista de diferenças por esquema, exportação tipo "Excel Generator", fluxo de "pedir classificação" para produto não listado em Exceções/liberações).
- Não há login, API pública nem app documentados para a IDTF; não foi encontrada documentação de integração ([busca sem resultado de API, ver GMP+ IDTF](https://www.gmpplus.org/service-support/risk-management/idtf)). A IDTF é atualizada por newsletters; lista recente: 3/2024 (02-12-2024), 1/2025 (06-03-2025), 2/2025 (17-06-2025), 3/2025 (10-10-2025), 1/2026 (02-04-2026), 2/2026 (24-09-2026) ([IDTF News](https://www.icrt-idtf.com/news/)).
  - Relevância para o Traxium: Motor IDTF e Console admin (versionamento da base, registro de qual versão/newsletter embasou cada decisão; alerta quando um produto muda de regime).
- Newsletter 1/2025: para o nº IDTF 30047 ("All feed additives approved in the EU (transported in bulk)"), regime "B", foi removida a lista de exemplos e adicionada a regra "Also if feed is transported as previous load, the cleaning regimes need to be checked", ou seja, feed como carga anterior também exige checagem de regime, buscando o material específico ([IDTF newsletter 1/2025](https://www.icrt-idtf.com/international-database-for-transport-of-feed-idtf-newsletter-1-2025/)).
  - Relevância para o Traxium: Motor IDTF (não tratar "feed" como carga anterior automaticamente segura; exigir produto específico na T-3).
- Documentos de procedimento publicados no site da IDTF: "Procedure of the (re-)classification of products in the IDTF" (2023-05-11), "Requirements for transport sequence, cleaning and disinfection" (2022-04-28), "Procedure for the acceptance of loading compartments after the transport of forbidden loads" (2022-01-01), "Exception cleaning regime" (Ovocom), "Request templates for a cleaning regime" (QS), "Procédure Qualimat de réaffectation de contenant" ([IDTF Procedures](https://www.icrt-idtf.com/procedures/)).
  - Relevância para o Traxium: Exceções/liberações (cada esquema tem um procedimento de exceção/reafetação próprio), Motor IDTF.

**GMP+ TS1.9 Transport activities (regra que o software tem que implementar)**
- Versão EN lida: 3 March 2025; a página da GMP+ já lista "Version: 2 March 2026" sem changelog visível ([TS1.9 PDF 2025](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf); [página TS1.9](https://www.gmpplus.org/feed-certification-scheme/scheme-documents/fsa-requirements/ts19)). Existe versão em português ([TS1.9 PT](https://www.gmpplus.org/media/emohgfb0/ts19-atividades-de-transporte-pt.pdf)).
  - Relevância para o Traxium: Console admin/Configurações (versão da norma vigente), Dossiê de auditoria (citar versão).
- Papéis separados na norma: quem ordena o transporte (cap. 2), quem arranja/fretamento ("affreightment", cap. 3: aceitar ordem, selecionar compartimento, ordenar LCI, aprovar compartimento) e quem transporta (cap. 4: limpeza, transporte, documentação) ([TS1.9](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Configurações (papéis da empresa), Subcontratados (quem é o transportador físico vs quem arranja), Viagens.
- Quem ordena deve informar ao transportador: descrição do produto e características, estado físico (seco, úmido/líquido, solúvel em água, gorduroso) e o esquema de certificação do recebedor ([TS1.9 §2](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Detalhe da viagem (campos obrigatórios da ordem: produto, estado físico, esquema do destinatário).
- Antes de aceitar a ordem, determinar o regime pela IDTF; se o destinatário for de outro esquema, aplica-se "the strictest of the two cleaning regimes in the IDTF List of Differences" ([TS1.9 §3.1](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Motor IDTF (decisão por esquema de origem e destino, regra do mais rigoroso), Control Tower.
- Tabela de seleção de compartimento (rodoviário): nome/natureza/número do compartimento; prova de que o compartimento comprado está no escopo do sistema do fornecedor certificado ou que o procedimento de liberação foi aplicado; descrição do produto "preferably IDTF number"; cláusula de limpeza (limpo, vazio, seco se necessário, sem odores); "at least the last three previous loads and the cleaning operations performed after them"; em cargas parciais, indicar carga secundária não GMP+ em outro compartimento. A empresa transportadora "must confirm this documentation when accepting the transport" ([TS1.9 §3.2.1](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Detalhe do compartimento (T-3 com limpeza após cada carga), Detalhe da viagem (aceite/confirmação do transportador), Subcontratados (compartimento contratado precisa provar escopo de certificação), Viagens (carga parcial/compartimentos mistos).
- LCI (Loading Compartment Inspection) por organismo externo é obrigatória para fluvial, marítimo e ferroviário, não para rodoviário; o relatório de LCI tem campos mínimos (título padrão, identificação da unidade, local/data, destino, contratante, peso, produto, confirmação das cargas anteriores, checklist vazio/limpo/seco/sem odor/sem insetos/sem resíduos/íntegro e fechável, tipo de aquecimento para tanques, resultado aceite/recusa, observações, assinaturas) ([TS1.9 §3.2.2 a 3.2.4](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Inspeções (o checklist de pré-carregamento do Traxium pode espelhar este checklist; resultado binário aceite/recusa com assinatura).
- Programa de limpeza obrigatório do transportador: responsabilidades, métodos, frequência, agentes (food grade), aplicação do regime IDTF conforme carga anterior, e um plano de monitoramento da eficácia da limpeza com frequência mínima ([TS1.9 §4.1](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Limpezas (cadastro de método/agente), Indicadores (eficácia de limpeza), Configurações (programa de limpeza).
- Cargas proibidas: tudo que está classificado como proibido ou não está classificado na IDTF; o transportador precisa demonstrar que não transportou carga proibida, ou provar a liberação ([TS1.9 §4.2.1](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Motor IDTF (produto não encontrado = bloqueio), Exceções/liberações.
- Documentação: viagens sucessivas, limpezas entre elas, inspeções e checagens; "journey sheet" por compartimento com cargas "preferably with an IDTF number" e limpezas; registro das 3 cargas anteriores "provided with date and signature of the company responsible for the transport of feed" ([TS1.9 §4.3](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Detalhe do compartimento (journey sheet), Dossiê de auditoria (assinatura e data na T-3).
- Regimes: A seca; B água (inclui regra: tanques graneleiros "must wet clean these tankers at least once every three months unless it can be demonstrated that there are no remains"); C água + detergente food grade (proteína/gordura; água máx. 60 °C, CIP 80 °C em tanque); D desinfecção após A, B ou C. Verificações opcionais de eficácia: ATP, placas de ágar, HPLC/MS, microscopia (Reg. 152/2009) ([TS1.9 Apêndice ii](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Limpezas (tipo de regime, temperatura, agente, teste de eficácia), Ativos e frota (alerta de lavagem úmida trimestral para tanques graneleiros), Indicadores.
- Liberação após carga proibida (rodoviário): Opção A, inspetor de organismo independente após limpeza por protocolo, com possíveis medições ATP/ágar/água de enxágue e declaração emitida; Opção B, 5 cargas com limpeza A/B/C (não feed) + limpeza específica comprovada por ECD ou certificado equivalente (identificação do compartimento, data/hora, última carga proibida, etapas, partes limpas, agentes, temperatura, duração, testes) + inspeção por inspetor próprio do carregador GMP+ (nunca o próprio transportador); algumas cargas (Cat. 1/2 de subprodutos animais, gasolina, óleo lubrificante, lixo doméstico, lodo de esgoto, radioativos etc.) só pela Opção A; proteínas animais processadas, farinha de peixe e afins só por procedimento autorizado pela autoridade competente (Reg. 999/2001) ([TS1.9 Apêndice iii e iv](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Exceções/liberações (fluxo de liberação com contagem de 5 cargas, tipo de liberador, anexos), Limpezas (campos do certificado), Detalhe do compartimento (estado "quarentena"), Dossiê.
- Veículos combinados (feed e carga proibida em compartimentos diferentes): separação física total, equipamentos separados, identificação clara de quais compartimentos são para feed; flexitanks com vida útil máxima de 5 anos e checagem anual ([TS1.9 §4.2.1.1](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Ativos e frota/Detalhe do compartimento (atributo "dedicado a feed" vs "proibido", vencimento de flexitank).
- Não-certificados: se o contêiner é gerido e lacrado pelo produtor/trader GMP+ e o transportador não tem influência sobre o feed, o transportador não precisa ser GMP+; ele não pode usar mangueiras/equipamentos próprios sem permissão. "Tractionaires" podem ser incluídos no sistema do principal (similar a multi-site) (resumo de busca sobre [S9.11 Q&A Transport](https://www.gmpplus.org/feed-certification-scheme/scheme-documents/support/s911); texto integral não lido).
  - Relevância para o Traxium: Subcontratados (estado "agregado incluído no sistema do contratante" vs "certificado próprio"), Onboarding público.

**Ferramentas oficiais da GMP+ International para transportadores**
- Página "Services for transport" lista: "HACCP Transport interactieve Excel" (riscos e medidas para transporte rodoviário, com guia S9.6), microlearning "GMP+ Academy" (planejamento, uso da IDTF, carga/descarga, limpeza; módulo "Veilig transport van GMP+ diervoeder", multilíngue, com login), "Q&A Transport" (S9.11), IDTF, e "Registered Services" com prestadores externos citados certag.eu e bulkvision.eu; ferramentas gerais: Early Warning System (app.gmpplus.org) e Company database ([GMP+ Services for transport](https://www.gmpplus.org/nl/services/services-for-transport/)).
  - Relevância para o Traxium: Academy (concorre/complementa GMP+ Academy; trilha de motorista), Não conformidades (EWS como referência de reporte), Subcontratados (consulta à Company database para validar certificado).
- O diretor da GMP+ (Roland van der Post) enfatiza motoristas: devem saber "what they transport and what the risks are"; GMP+ Academy tem e-learning para motoristas ([trans.info, 15/03/2024](https://trans.info/en/gmp-compliance-381736)).
  - Relevância para o Traxium: Motoristas, Academy.

**QS (Alemanha)**
- QS define a IDTF como base do ICRT para limpeza antes de carregar feed solto; produtos não classificados são proibidos ([QS FAQ IDTF](https://q-s.de/faq-de/was-ist-die-idtf.html)). As ferramentas QS são a "QS-Datenbank"/Softwareplattform (cadastro de participantes do sistema), "QS-Apps" e o chatbot "Frag QS"; nenhuma ferramenta QS específica de cargas anteriores foi encontrada ([QS FAQ](https://q-s.de/faq-de/was-ist-die-idtf.html); [QS Softwareplattform](https://q-s.de/softwareplattform/)).
  - Relevância para o Traxium: Subcontratados (status de participante QS como evidência), Configurações.

**Ovocom / Feed Chain Alliance (Bélgica)**
- Pedidos de classificação de produto não listado vão à Ovocom pelo documento BT-06; após carga proibida, o compartimento só volta a levar feed para empresas FCA após limpeza/desinfecção registrada e avaliação por organismo aprovado pela Ovocom, que emite certificado; limpeza em lavador independente pode seguir o "procedure B (5.2)" do BT-06 (resumo de busca de documento de auditoria belga, data incerta: [BDB/Vegaplan checklist](https://www.bdb.be/certalent/documenten/Tussentijdse%20audit%20VegaplanLOON_Contr%c3%b4le%20interm%c3%a9diaires%20Entrepreneurs/Nederlands/CL_VSloon%20sec%20transport_UG3_N.pdf)).
  - Relevância para o Traxium: Exceções/liberações (variações por esquema do recebedor).

**AIC / TASCC / Red Tractor (Reino Unido)**
- TASCC tem a "Haulage Exclusion List": materiais totalmente excluídos; caminhões que já levaram algo da lista ficam excluídos do esquema "at any time"; novos aderentes com reboques usados precisam provar o histórico de uso ([Kiwa TASCC](https://www.kiwa.com/gb/en/products/tascc-certification)). O formulário de aplicação diz que o auditor verá "detailed records of your trailer/rigid vehicle history/previous use" ([Kiwa TASCC form](https://www.kiwa.com/497cb1/globalassets/uk/af/scf-007-003-iss-26-tascc-application-form.pdf)).
  - Relevância para o Traxium: Ativos e frota (histórico de vida do reboque desde aquisição; reboque usado exige prova de histórico), Onboarding público (subcontratado com veículo comprado de segunda mão).
- Red Tractor (transporte próprio) exige registro das 3 cargas anteriores por reboque e uso das listas AIC "Haulage Exclusion and Sensitive", além de registro do veículo com ID, data de compra/aluguel e de baixa ([Red Tractor own transport](https://redtractorassurance.org.uk/standards/own-transport/)).
  - Relevância para o Traxium: Ativos e frota (datas de entrada/saída do ativo), Motor IDTF (listas "sensitive" como categoria intermediária).
- Não foi encontrada ferramenta digital da AIC para cargas anteriores.

**Qualimat Transport (França)**
- Cahier des charges V6; nível D exige limpeza antes de nova carga independentemente de transportes intermediários (§7.2); desde 01/01/2016 há medidas específicas para alimentos compostos (transferência entre lotes) segundo instrução do contratante; reconhecimento mútuo e regra do nível mais rigoroso devem constar na 1ª página do relatório de auditoria (resumo de busca do [Recueil de Positions Techniques QTp 02/2022](https://certis.com.fr//storage/115/QTp_Recueil_de_Positions_Techniques_022022_diffusion.pdf), antigo).
  - Relevância para o Traxium: Motor IDTF (regras de esquema), Dossiê.

**Requisitos de recebedores que funcionam como "motor de decisão" no portão**
- DMK (laticínios, Alemanha), "Vorgaben zur Belieferung mit Bulk-/Silofahrzeugen" V2, 22/04/2024: exige ECD; o certificado deve mostrar as 3 últimas cargas; certificado com no máximo 48 h na carga (72 h com pausas/fim de semana); lacres em todas as aberturas após limpeza e após carga, com números anotados no certificado; lista de cargas anteriores proibidas para halal/kosher; para feed, "Unloading may take place if all 3 preloads are listed in the IDTF... and appropriate cleaning has taken place according to the cleaning certificate"; produto não classificado = não descarrega; transportador certificado QS ou reconhecido (GMP+ FSA); filtro de ar comprimido mínimo ePM10/M5 ([DMK Vorgaben V2](https://dmk.de/fileadmin/user_upload/redaktion/Footer/Lieferanteninfo/Lieferanten_Selbstauditierungsb%C3%B6gen/DE/Vorgaben_zur_Belieferung_mit_Bulk-Fahrzeugen_V2.pdf)).
  - Relevância para o Traxium: Motor IDTF (validade temporal da limpeza, regras adicionais por cliente como halal/kosher/alérgenos), Limpezas (lacres), Inspeções (item ar comprimido/filtro), Configurações (regras por cliente/destinatário), Acesso externo (recebedor consultando a decisão).
- OQ Chemicals exige que o motorista apresente os certificados de limpeza da última carga antes do carregamento sob regras GMP+ e afirma que a limpeza é responsabilidade do transportador (resumo de busca: [OQ CPU requirements](https://chemicals.oq.com/fileadmin/user_upload/OQ-Chemicals/Company/Contact/CPU/Marl/OQ_Requirements_CPU_AF_products.pdf)).
  - Relevância para o Traxium: App de campo (motorista exibe certificado), Acesso externo.
- Bunge (Austrália) publica uma "Prior load matrix": se o resíduo não bater com o declarado, pode pedir prova das 3 cargas anteriores; Class 1 em qualquer carga anterior = recusa ([Bunge Prior load matrix](https://delivery.bunge.com/-/media/Files/Australia/Agriculture/Delivering-to-Bunge-SA-or-Vic/Vehicle-Hygiene/Prior-load-matrix.ashx)). Greenfield (Canadá) e Valero (DDGS) reservam o direito de pedir documentação das 3 últimas cargas e da limpeza a qualquer momento ([Greenfield](https://greenfield.com//transpo-reqs); [Valero pre-load ticket](https://www.valero.com/sites/default/files/Hartley-V2459-Pre-Load-Ticket-HR.pdf)).
  - Relevância para o Traxium: Acesso externo (link de consulta da T-3 para cliente), Dossiê (exportação por viagem sob demanda).
- Donau Soja (diretriz R-07, 2025) exige, para cargas anteriores, documento com nome e assinatura do motorista, placas do cavalo e reboque, natureza da carga e data; se a carga anterior for de risco, certificado de limpeza com nome/assinatura de quem limpou, data/hora de/até, medidas e local ([Donau Soja R-07](https://donausoja.org/wp-content/uploads/2025/02/Donau-Soja-Guidelines_R-07-Transportion-and-Cleaning.pdf)).
  - Relevância para o Traxium: Limpezas (campos mínimos), Detalhe do compartimento.

### Inferences
- O espaço de "decisão automatizada de carregamento por compartimento com T-3 x IDTF" parece não ter produto dedicado; o mercado resolve com IDTF manual + ECD em papel + conferência no portão do recebedor. Isso é a principal tese de diferenciação do Traxium, mas também indica que o cliente-alvo está acostumado a papel, e o onboarding precisa aceitar PDF/foto de ECD.
- A regra real é multi-esquema (GMP+, QS, FCA, Qualimat, AIC, AMA) e multi-cliente (DMK, Bunge etc. acrescentam regras próprias: validade de 48 h, lacres, halal/kosher, alérgenos). Um Motor IDTF só com regime A/B/C/D é insuficiente; ele precisa de uma camada de "regras do cliente/destinatário".
- A norma separa claramente quem ordena, quem arranja (fretamento) e quem transporta. A tela de Subcontratados do Traxium deveria refletir essa distinção, inclusive o caso "agregado no sistema do contratante".
- A Opção B de liberação (5 cargas não-feed + ECD + inspetor do carregador) é um fluxo de várias etapas e vários atores, e combina com a tela Exceções/liberações como uma "trilha de liberação" com contador.

### Gaps
- O manual do usuário da IDTF (v4) não pôde ser lido (link do archive.org recusou conexão; o PDF atual não foi localizado por busca). Campos exatos da ficha de produto (data sheet) não confirmados.
- Mudanças da TS1.9 versão 2 March 2026 em relação à de 2025 não foram encontradas.
- Conteúdo das newsletters IDTF 2/2025 a 2/2026 não foi lido.
- Os sites certag.eu (HTTP 403) e bulkvision.eu (só navegação) não revelaram funcionalidades; não se confirmou o que a "Registered Service" certag faz.
- Não foi encontrado nenhum app holandês/belga/alemão específico para transportadores de feed com checagem de IDTF; pode existir em TMS locais (ex.: módulos de "Vorfracht" em TMS alemães), mas nada citável apareceu.
- Ferramentas digitais da AIC/UFAS e da Qualimat não foram encontradas.

---

## 2. Documentação de limpeza de tanques e reboques: ECD/eECD, software de estação de lavagem, SQAS

### Takeaway
Na Europa o documento de limpeza padrão é o ECD da EFTCO, emitido somente por estações de lavagem avaliadas por SQAS e membros de associação nacional; ele registra o produto anterior declarado, os códigos de limpeza e lacres. A versão digital (eECD 2.0, via plataforma ECLIC) é híbrida (papel ou digital com QR code verificável por qualquer pessoa) e a adoção tem sido mais lenta que o previsto. Surgem alternativas com verificação criptográfica (ENFIT/bulkvision em blockchain; VERA da Fraunhofer, set/2026). O emissor é sempre a estação de lavagem; transportador e carregador apenas consultam/apresentam.

### Cited Findings

**ECD (EFTCO Cleaning Document / European Cleaning Document)**
- Desenvolvido pela EFTCO com ECTA e Cefic em 2005; mais de 4.000.000 ECDs em papel emitidos por ano (dado de 2022), em 4 vias ([ECLIC eECD solution](https://www.eclic.eu/eecd-solution/)).
  - Relevância para o Traxium: Limpezas (aceitar ECD como documento-padrão, incluindo upload de foto da via em papel).
- Só estações avaliadas por SQAS podem usar o ECD (autorização pelas associações nacionais de limpeza); a EFTCO detém a propriedade e o copyright; as associações nacionais cuidam de tradução, impressão, distribuição e numeração única ([Tank News International, validade do ECD](https://tanknewsinternational.com/?p=61851)).
  - Relevância para o Traxium: Limpezas (validar número único do ECD e se a estação é SQAS/membro EFTCO; cadastro de estações de lavagem confiáveis).
- O ECD registra o último produto carregado "as declared to the cleaning station" e usa os "EFTCO Tank Cleaning Codes" para descrever as operações; em 2021 a EFTCO publicou 31 revisões de códigos; o ECD está traduzido em mais de 20 idiomas ([Tank News International, códigos 2021](https://tanknewsinternational.com/eftco-updates-cleaning-codes-for-tank-safety/); [Tank News, validade](https://tanknewsinternational.com/?p=61851)).
  - Relevância para o Traxium: Limpezas (mapear códigos EFTCO para regimes A/B/C/D da IDTF; produto anterior é declaração do motorista, não verificação).
- Muitos grupos de alimentos e químicos exigem o ECD antes de liberar tanque para enchimento (Stockmeier: sem certificado padronizado a maioria dos embarcadores não aceita o veículo; tendência para documento eletrônico) ([Stockmeier tank cleaning](https://www.stockmeier.com/en/products/chemicals/cleaning-solutions/surface-cleaning/tank-cleaning/)).
  - Relevância para o Traxium: Control Tower (pendência "sem certificado de limpeza" como motivo de bloqueio).
- SQAS cobre também limpeza de tanques além do serviço de transporte; o selo SQAS é usado comercialmente ([DEKRA SQAS](https://www.dekra-certification.de/en/sqas-safety-and-quality-assessment-for-sustainability/)).
  - Relevância para o Traxium: Subcontratados/Limpezas (certificação da estação de lavagem como atributo).
- A EFTCO assinou um membro global no Brasil, a Depotrans (título de notícia em [Tank News International](https://tanknewsinternational.com/eftco-signs-new-global-member-depotrans-brazil/); conteúdo não lido).
  - Relevância para o Traxium: Limpezas (pode haver ECD emitido no Brasil; verificar).

**eECD 2.0 (ECLIC)**
- O eECD é a versão digital do ECD, num projeto de EFTCO, Cefic/essenscia e ECTA supervisionado pela ECLIC (European Chemical Logistics Information Council vzw) ([EFTCO 2019](https://www.eftco.org/news/2019/electronic-eftco-cleaning-document-eecd); [EFTCO 2023](https://www.eftco.org/news/2023/the-new-eecd-2-0-solution-launched)).
  - Relevância para o Traxium: Limpezas (possível integração futura).
- eECD 2.0 lançado em 2023 (Q2 segundo ECLIC, Q3 segundo ECTA): documento "híbrido"; qualquer ator pode escanear o QR code único para checar validade "even without an eECD licence"; três modos: eECD em papel, cópia papel do eECD 2.0 com QR, ou processo 100% digital ([ECLIC eECD solution](https://www.eclic.eu/eecd-solution/); [ECTA 2024](https://www.ecta.com/?p=9358)).
  - Relevância para o Traxium: Limpezas e App de campo (ler QR do ECD e anexar validação), Inspeções.
- "Compliancy score": caixa nº 16 no eECD, com "estrelas" que crescem ao longo de limpeza, planejamento e carregamento; mede colaboração digital e acurácia de dados e "does not assess the actual performance of the physical cleaning process itself" ([ECLIC eECD solution](https://www.eclic.eu/eecd-solution/)).
  - Relevância para o Traxium: Indicadores (score de qualidade de dados por transportador/subcontratado), Subcontratados.
- Benefícios declarados (setor): menos rejeição de caminhões com notificações em tempo real, "Fast Lane" no portão de carregamento, menos administração; ganho setorial estimado acima de 16 M€/ano; checagem de configuração do equipamento antes do carregamento e arquivamento automático são citados como funcionalidades ([ECLIC eECD solution](https://www.eclic.eu/eecd-solution/); resumo de busca de [EFTCO/ECLIC](https://www.eftco.org/download/media/385)).
  - Relevância para o Traxium: Control Tower (notificação proativa antes da chegada ao portão), Acesso externo (carregador recebe status antecipado).
- Em 2024 a ECTA admite que a transição digital "has turned out to be more complex and takes more time" do que o previsto três anos antes; plataforma migrando para NxtPort International; 6 idiomas (EN, DE, FR, NL, ES, IT) ([ECTA 2024](https://www.ecta.com/?p=9358)).
  - Relevância para o Traxium: Onboarding público/Limpezas (não depender de integração eECD; manter caminho por foto/PDF).
- Uso do ECD é restrito a estações aprovadas membros de associação nacional; estações precisam estar autorizadas a usar o ECD antes de registrar na ECLIC ([EFTCO 2023](https://www.eftco.org/news/2023/the-new-eecd-2-0-solution-launched), via resumo de busca).

**ENFIT / bulkvision (Alemanha)**
- O sistema ENFIT em blockchain, construído com bulkvision, digitaliza o check-in na estação e gera o certificado após a limpeza; motoristas recebem no smartphone a previsão de início da limpeza ([ENFIT tank cleaning](https://www.enfit.eu/en/tank-cleaning/cleaning-of-chemical-transport-container)).
  - Relevância para o Traxium: App de campo (motorista acompanha fila de lavagem), Limpezas.
- Estações podem executar todo o processo no software ENFIT bulkvision até o certificado "ECC-ENFIT"; o certificado é protegido em blockchain e o carregador/descarregador verifica autenticidade; há base de produtos mantida pelos fabricantes com fichas de segurança ([Tank News, bulkvision](https://tanknewsinternational.com/new-bulk-vision-development-for-the-safe-and-effective-cleaning-of-tank-containers/); [flyer ENFIT 2023](https://dev.qualityaustria.com/wp-content/uploads/flyer-enfit-2023-de.pdf)).
  - Relevância para o Traxium: Limpezas (autenticidade verificável do certificado), Motor IDTF (base de produtos com ficha).
- Hardware "GID" vincula o contêiner-tanque ao registro digital, sem bateria nem SIM, a 10-15% do custo de um rastreador GPS ([Tank News, ENFIT GID](https://tanknewsinternational.com/track-and-trace-your-tank-container-fleet-with-enfit-gid/)).
  - Relevância para o Traxium: Ativos e frota/Detalhe do compartimento (identificação física do compartimento por tag/QR).
- bulkvision GmbH (Hamburgo) se apresenta com áreas "Globale Identifikation", "Digitaler Zwilling", "Digitalisierung" para transporte, indústria e lavadores; é citada pela GMP+ como "Registered Service" ([bulkvision](https://www.bulkvision.eu/); [GMP+ Services for transport](https://www.gmpplus.org/nl/services/services-for-transport/)).
  - Relevância para o Traxium: concorrente/parceiro potencial mais próximo no ecossistema GMP+ europeu (Limpezas, Ativos).

**VERA (Fraunhofer FIT, TALKE, Spherity), 14/09/2026**
- Certificado de limpeza digital emitido pela estação logo após a limpeza, como "digitaler Produktpass"; motorista recupera e apresenta; verificação por link ou QR (substitui PDF por e-mail, sempre versão atual); cada emissor tem identidade digital e cada certificado é assinado criptograficamente; armazenamento descentralizado (cada empresa guarda os seus), baseado em padrões abertos de credenciais verificáveis do EU Digital Product Passport; teste gratuito para estações, transportadoras, embarcadores e fornecedores de software da logística química; integração em preparação com o software C-BANK (IGF); foco declarado só em química ([Fraunhofer FIT, 14/09/2026](https://www.fit.fraunhofer.de/de/presse/26-09-14_Digitale-Reinigungsnachweise-statt-Papier.html)).
  - Relevância para o Traxium: Limpezas (receber credencial verificável), Acesso externo (link/QR em vez de PDF), Dossiê.

**Software de gestão de estação de lavagem (lado do lavador)**
- CTW Cleaning: software documenta da ordem de limpeza à documentação final, gerando ECD, recibos e faturas automaticamente ([CTW](https://www.ctwcleaning.com/en/tank-cleaning-heating/software-certification)).
- CleanWRXS: web, "from intake to invoice", assinatura e impressão de ordens e certificados sob demanda, fotos por celular ([CleanWRXS](https://cleanwrxs.com/)).
- TankSoft Pro: nuvem ou on-premises, "from check-in through completion of washout docs and invoicing", EUA e Canadá ([TankSoft Pro](https://tanksoftpro.com/)).
- Quala (maior operador de lavagem dos EUA) com OnTrax: integração por EDI com o TMS dos clientes para evitar portais ("I can't stand going to a portal for this and a portal for that") e redução de 20% de não conformidades por 1.000 lavagens (resumo de busca de [Bulk Transporter](https://www.bulktransporter.com/equipment/tank-cleaning/article/21260785/tank-truck-fleets-turn-to-qualas-ontrax-for-transformational-wash-planning); página com 403, data não confirmada).
- TMW Systems: certificado com etapas executadas; formatos variam por cliente, "never one standard certificate" (antigo, ~2016: [Bulk Transporter](https://www.bulktransporter.com/technology/article/21656437/software-giving-companies-better-control-over-tank-cleaning-operations)).
  - Relevância para o Traxium (bloco): Limpezas (o Traxium não deve ser software de lavador; deve receber dados do lavador por upload, e-mail, EDI ou QR), Acesso externo (link para estação de lavagem preencher), Configurações (integrações).

### Inferences
- Em todo o ecossistema europeu o certificado de limpeza é emitido pela estação e consultado pelo transportador e pelo carregador. O Traxium, ao registrar limpeza, deveria distinguir "limpeza em estação com certificado" de "limpeza própria (A/B) registrada pelo motorista", com pesos de evidência diferentes.
- A tendência 2024-2026 é verificabilidade (QR, blockchain, credenciais assinadas). Um QR por compartimento ou por viagem que abra a decisão e a T-3 no Traxium segue o mesmo padrão e serve à tela Acesso externo.
- A adoção lenta do eECD sugere que o Traxium não deve exigir integração digital do lavador no MVP.

### Gaps
- Fluxo passo a passo do eECD (atores, campos, licenças, preços) não foi lido (seção paga/"my login" e partes truncadas da página ECLIC).
- Campos completos do ECD (caixas 1 a 16) e lista atual de códigos EFTCO não obtidos.
- Preços de ECLIC, ENFIT/bulkvision, CleanWRXS, TankSoft Pro não encontrados.
- Critérios detalhados do SQAS para estações de lavagem não obtidos.

---

## 3. FDA FSMA Sanitary Transportation Rule: regras e software que registra carga anterior, lavagem e inspeção

### Takeaway
A regra americana (21 CFR Part 1 Subpart O) atribui papéis a shipper, loader, carrier e receiver; para veículos a granel o carrier só precisa informar carga anterior e a limpeza mais recente quando o shipper pede, e manter procedimentos escritos de limpeza e inspeção. O software americano que atende essa regra é majoritariamente telemática de frota (temperatura, DVIR) com módulos de "wash ticket"; não há equivalente à IDTF nem decisão automática por regime.

### Cited Findings
- §1.908(e)(4) e (e)(5): o carrier que oferece veículo a granel deve, se o shipper solicitar, informar a carga anterior e descrever "the most recent cleaning of the bulk vehicle"; §1.908(e)(6): procedimentos escritos de limpeza, sanitização quando necessário e inspeção, incluindo como cumpre (e)(4) e (e)(5) ([21 CFR 1.908, Cornell LII](https://www.law.cornell.edu/cfr/text/21/1.908)).
  - Relevância para o Traxium: Acesso externo (shipper solicita e recebe T-3 e última limpeza), Configurações (procedimentos escritos anexados).
- §1.908(c)(1): o loader, antes de carregar alimento não embalado, deve determinar que o veículo está em condição sanitária apropriada, "free of visible evidence of pest infestation and previous cargo that could cause the food to become unsafe"; §1.908(b)(1): o shipper especifica por escrito ao carrier as especificações sanitárias do veículo ([21 CFR 1.908](https://www.law.cornell.edu/cfr/text/21/1.908)).
  - Relevância para o Traxium: Inspeções (inspeção pré-carregamento pelo carregador), Detalhe da viagem (especificação sanitária do embarcador anexada à ordem).
- Retenção (§1.912): procedimentos escritos e acordos por 12 meses após deixarem de ser usados; não foi confirmado prazo para os registros de carga anterior/limpeza em si ([21 CFR 1.912](https://www.law.cornell.edu/cfr/text/21/1.912)). Samsara resume: registros de treinamento mantidos 12 meses após o término das funções; carriers devem dar treinamento básico em práticas sanitárias e manter registros; isenção para receita anual abaixo de US$ 500.000; datas de conformidade 2017/2018 ([Samsara FSMA guide](https://www.samsara.com/pdf/docs/fsma-solution-guide.pdf), material de fornecedor, antigo).
  - Relevância para o Traxium: Academy (registro de treinamento com retenção), Configurações (políticas de retenção por jurisdição).
- Samsara: oferta FSMA centrada em sensores de temperatura/umidade (EM-series), alertas por e-mail/SMS, histórico em dashboard web; não descreve registro de carga anterior ou lavagem ([Samsara FSMA guide](https://www.samsara.com/pdf/docs/fsma-solution-guide.pdf)).
  - Relevância para o Traxium: mostra que telemática genérica não cobre o núcleo do Traxium (Control Tower, Motor IDTF).
- FleetRabbit (fornecedor, frotas de alimento): "wash ticket" digital criado no box de lavagem com campos lavadora e box, tipo de lavagem (rinse, wash, full sanitize), agente químico, técnico e horário, número do reboque e produto anterior, próxima carga atribuída, fotos do interior; captura offline no app com sincronização; ticket vinculado ao reboque e à próxima carga; exportação de todos os registros por período, reboque ou contrato de cliente em um clique; a página não descreve bloqueio de despacho sem lavagem válida ([FleetRabbit washout software](https://fleetrabbit.com/industry/food-and-beverage/washout-sanitation-ticket-software-fsma-sanitary-transportation-compliance)). A mesma empresa cita retenção típica de 3 anos em uma página e 12 meses em outra (conflito entre páginas do mesmo fornecedor, segundo resumo de busca).
  - Relevância para o Traxium: Limpezas (campos do ticket), App de campo (offline), Dossiê (exportação por período/ativo/cliente).
- Guia antigo da FDA para tanques a granel: a transportadora deve poder apresentar documentação independente, como conhecimentos de embarque, das 3 últimas cargas; certificados de limpeza registrados; números de lacre anotados no wash ticket e verificados pelo recebedor (resumo de busca, documento muito antigo: [FDA via webharvest](https://webharvest.gov/peth04/20041031041201/http://www.cfsan.fda.gov/~acrobat/transafe.pdf)).
  - Relevância para o Traxium: Detalhe do compartimento (evidência independente da T-3, ex. NF/CT-e da carga anterior), Limpezas (lacres).
- FAO (código de transporte a granel): manter registro das 3 cargas anteriores mais recentes e limpeza/desinfecção, disponível ao embarcador e autoridades; registro completo de cargas por 6 meses ([FAO](https://www.fao.org/4/x4296e/x4296e0p.htm), antigo).
  - Relevância para o Traxium: Configurações (retenção), Dossiê.
- Artigo de trade press (~10 anos) descreve plano de registrar automaticamente entrada e saída de reboques em locais de lavagem via geocerca ([CCJ](https://www.ccjdigital.com/business/article/14933992/complying-with-fsma-an-update-of-options-for-motor-carriers), antigo, resumo de busca).
  - Relevância para o Traxium: Limpezas (evidência automática por geolocalização como reforço), App de campo.

### Inferences
- O modelo FSMA é "sob demanda" (shipper pede, carrier fornece), enquanto GMP+ é "sempre" (T-3 obrigatória em cada aceite). O Traxium, ao atender exportadores para os EUA, pode reaproveitar o mesmo dossiê; a tela Acesso externo com link de solicitação atende ambos.
- O papel "loader" da FSMA corresponde à inspeção pré-carregamento do Traxium; vale permitir que a inspeção seja feita por um ator externo (carregador/armazém) via Acesso externo.

### Gaps
- Prazo exato de retenção para registros de carga anterior/limpeza sob a FSMA não confirmado no texto lido.
- Não foram encontradas avaliações (G2/Capterra) de software FSMA de lavagem.
- Detalhes do OnTrax (Quala) indisponíveis (403 e sem documentação pública).

---

## 4. Por produto: objetos centrais, fluxos, aprovação/bloqueio, quem digita, obrigatório vs opcional, exportação, preço

### Takeaway
Os produtos se dividem em quatro famílias: (a) base de referência pública (IDTF), (b) documento/credencial de limpeza emitido pela estação (ECD, eECD, ENFIT, VERA), (c) software operacional do lavador (CTW, CleanWRXS, TankSoft Pro, OnTrax) e (d) telemática/frota com registro sanitário (Samsara, FleetRabbit). Nenhum faz bloqueio automático do carregamento a partir da T-3 do compartimento; o bloqueio acontece no portão do recebedor, por pessoa, com base em documentos.

### Cited Findings
Tabela-síntese (cada célula baseada nas fontes citadas nas seções 1 a 3):

| Produto | Objetos centrais | Fluxo principal | Aprovar/bloquear | Quem digita | Exportação | Preço |
|---|---|---|---|---|---|---|
| IDTF ([site](https://www.icrt-idtf.com/de/index.php?act=show&id=26)) | Produto (nº IDTF, nome, descrição), regime A-D, proibido, lista de diferenças, modo (rodoviário/fluvial) | Usuário busca por nome/nº/regime e lê ficha | Não decide; "não classificado = proibido" é regra textual | ICRT mantém; usuário só consulta | "Excel Generator" | Gratuito (sem login visível) |
| ECD papel ([Tank News](https://tanknewsinternational.com/?p=61851)) | Documento numerado, produto anterior declarado, códigos EFTCO, lacres | Estação SQAS emite após limpeza; motorista leva; carregador confere | Carregador recusa sem ECD (ex. DMK) | Estação de lavagem | Papel (4 vias) | Não público |
| eECD 2.0 / ECLIC ([ECLIC](https://www.eclic.eu/eecd-solution/)) | eECD com QR, compliance score (caixa 16) | Estação licenciada gera; qualquer um valida QR; integração API/ERP | Pré-checagem de equipamento antes do carregamento citada; detalhe não lido | Estação (licenciada) | Arquivamento automático citado | Licença; valor não público |
| ENFIT/bulkvision ([ENFIT](https://www.enfit.eu/en/tank-cleaning/cleaning-of-chemical-transport-container)) | Check-in, certificado ECC-ENFIT em blockchain, base de produtos, GID | Check-in digital, previsão ao motorista, certificado, verificação pelo carregador | Verificação de autenticidade | Estação; fabricantes mantêm base de produtos | Não informado | Não público |
| VERA ([Fraunhofer](https://www.fit.fraunhofer.de/de/presse/26-09-14_Digitale-Reinigungsnachweise-statt-Papier.html)) | Credencial assinada, identidade do emissor | Estação emite; motorista recupera; link/QR verifica | Verificação de integridade | Estação | Desktop ou integração (C-BANK) | Teste gratuito |
| CTW / CleanWRXS / TankSoft Pro | Ordem de limpeza, certificado, fatura, fotos | Check-in a fatura | Não | Operador do lavador | Certificado impresso/PDF | Não público |
| Quala OnTrax (resumo de busca) | Plano de lavagem, EDI | Integração ao TMS do cliente | Não informado | Lavador | EDI | Não público |
| Samsara ([guia](https://www.samsara.com/pdf/docs/fsma-solution-guide.pdf)) | Sensor, veículo, alerta de temperatura | Monitoramento contínuo | Alerta, não bloqueio | Automático (sensor) | Histórico no dashboard | Não público no guia |
| FleetRabbit ([página](https://fleetrabbit.com/industry/food-and-beverage/washout-sanitation-ticket-software-fsma-sanitary-transportation-compliance)) | Wash ticket, reboque, próxima carga | Ticket no box, vínculo à próxima carga | Não descrito | Técnico do lavador/motorista no app | Pacote por período/reboque/contrato | Página de preços não lida |

- Relevância para o Traxium: Control Tower e Motor IDTF (o bloqueio automático é exclusivo do Traxium), Limpezas e Acesso externo (receber dados do lavador e expor ao carregador), Dossiê de auditoria (exportação por viagem/ativo/cliente/período é padrão no mercado).

**Obrigatório vs opcional, segundo a norma GMP+ TS1.9 (rodoviário)**
- Obrigatório: regime IDTF antes de aceitar; T-3 + limpezas por compartimento com data e assinatura; journey sheet; programa de limpeza com monitoramento de eficácia; prova de ausência de carga proibida ou de liberação; lavagem úmida trimestral em tanques graneleiros; esquema mais rigoroso na lista de diferenças. "Preferencialmente": número IDTF na descrição. Não obrigatório no rodoviário: LCI por organismo externo (obrigatória só em fluvial/marítimo/ferroviário). Opcional: ATP/ágar/HPLC como verificação ([TS1.9](https://www.gmpplus.org/media/sqolw1fa/ts19-transport-activities-en.pdf)).
  - Relevância para o Traxium: Configurações (o que é bloqueante vs alerta), Inspeções, Limpezas, Dossiê.

### Inferences
- O objeto central do mercado é o documento de limpeza (por evento); o objeto central da norma é o compartimento com histórico (journey sheet). O Traxium, centrado em compartimento + viagem + decisão, alinha-se mais à norma que aos produtos existentes.
- "Quem digita" é o ponto fraco do mercado: produto anterior no ECD é declaração do motorista à estação. O Traxium pode cruzar a T-3 declarada com dados de viagem próprios (e de subcontratados) para detectar divergência.

### Gaps
- Preços de quase todos os produtos não são públicos.
- Telas reais (screenshots) da IDTF, eECD e ENFIT não puderam ser vistas.

---

## 5. O que usuários reclamam ou elogiam

### Takeaway
Quase não há reviews públicas (G2/Capterra) desses produtos de nicho. Os sinais disponíveis vêm da indústria: a digitalização do eECD foi mais complexa e lenta que o esperado; operadores odeiam múltiplos portais (preferem EDI); formatos de certificado variam por cliente; e o risco operacional citado é a rejeição de carga e a complacência na limpeza.

### Cited Findings
- ECTA (2024): a transição digital do eECD "has turned out to be more complex and takes more time than anticipated three years ago" ([ECTA 2024](https://www.ecta.com/?p=9358)).
  - Relevância para o Traxium: Onboarding público, Limpezas (manter caminho simples sem dependência de integração).
- Presidente da Quala sobre portais: "I can't stand going to a portal for this and a portal for that" (resumo de busca de [Bulk Transporter](https://www.bulktransporter.com/equipment/tank-cleaning/article/21260785/tank-truck-fleets-turn-to-qualas-ontrax-for-transformational-wash-planning)).
  - Relevância para o Traxium: Acesso externo e Onboarding público (link sem login e sem conta nova para lavador/carregador; integrações).
- Certificados de limpeza: "It's never one standard certificate" porque cada cliente pede formato próprio (antigo, [Bulk Transporter TMW](https://www.bulktransporter.com/technology/article/21656437/software-giving-companies-better-control-over-tank-cleaning-operations)).
  - Relevância para o Traxium: Dossiê de auditoria (modelos por cliente), Configurações.
- GMP+ (2024): o maior risco é complacência na limpeza; cargas contaminadas são rejeitadas e geram custo extra ou perda de cliente; "If you know what you're transporting, you should also know how to clean" ([trans.info](https://trans.info/en/gmp-compliance-381736)).
  - Relevância para o Traxium: Indicadores (rejeições, custo), Não conformidades.
- ECLIC promete menos rejeição de caminhão, "Fast Lane" no portão e menos administração, estimando mais de 16 M€/ano em ganhos setoriais ([ECLIC](https://www.eclic.eu/eecd-solution/)).
  - Relevância para o Traxium: Indicadores (tempo de portão, rejeições evitadas como métrica de valor).
- Quala reporta redução de 20% de não conformidades por 1.000 lavagens com OnTrax (resumo de busca, [Bulk Transporter](https://www.bulktransporter.com/equipment/tank-cleaning/article/21260785/tank-truck-fleets-turn-to-qualas-ontrax-for-transformational-wash-planning)).
  - Relevância para o Traxium: Indicadores (NC por 1.000 viagens como KPI comparável).

### Inferences
- A dor recorrente é atrito entre empresas (papel, portais, formatos), não a regra em si. Isso favorece as telas Acesso externo, Onboarding público por link e Dossiê exportável.

### Gaps
- Nenhuma review em G2/Capterra encontrada para IDTF, eECD, ENFIT, CleanWRXS ou TankSoft Pro.
- Nenhum fórum/LinkedIn com reclamações de transportadores sobre a IDTF foi localizado; a busca não retornou material citável.

---

## 6. Funcionalidades comuns (table stakes) e raras (diferenciais)

### Takeaway
Comuns: registro de limpeza com produto anterior, certificado gerado/anexado, vínculo veículo/reboque, exportação por período/ativo, fotos, app móvel (às vezes offline). Raras: verificação criptográfica/QR do certificado, score de qualidade de dados, previsão de fila de lavagem ao motorista, integração EDI. Ausente no mercado: decisão automática de carregamento por compartimento com T-3 x IDTF x esquema do destinatário, e gestão de subcontratados com certificação de feed.

### Cited Findings
- Table stakes observados: produto anterior e tipo de lavagem no ticket, fotos, vínculo à próxima carga, captura offline, exportação por período/reboque/contrato ([FleetRabbit](https://fleetrabbit.com/industry/food-and-beverage/washout-sanitation-ticket-software-fsma-sanitary-transportation-compliance)); certificado assinado/impresso sob demanda e fotos ([CleanWRXS](https://cleanwrxs.com/)); geração automática de ECD a partir da ordem ([CTW](https://www.ctwcleaning.com/en/tank-cleaning-heating/software-certification)).
  - Relevância para o Traxium: Limpezas, App de campo, Dossiê (mínimo esperado).
- Raros: QR verificável por qualquer ator sem licença e compliance score ([ECLIC](https://www.eclic.eu/eecd-solution/)); blockchain e verificação de autenticidade pelo carregador, previsão de horário de limpeza no smartphone do motorista, tag GID sem bateria ([ENFIT](https://www.enfit.eu/en/tank-cleaning/cleaning-of-chemical-transport-container); [Tank News GID](https://tanknewsinternational.com/track-and-trace-your-tank-container-fleet-with-enfit-gid/)); credencial assinada com identidade do emissor ([VERA](https://www.fit.fraunhofer.de/de/presse/26-09-14_Digitale-Reinigungsnachweise-statt-Papier.html)); EDI com TMS do cliente (OnTrax, resumo de busca).
  - Relevância para o Traxium: Acesso externo (QR/link verificável), Indicadores (score de qualidade de dados), Limpezas.
- Regras de recebedor que nenhum software encontrado automatiza: validade temporal do certificado (48 h/72 h), lacres anotados, listas halal/kosher, alérgenos ([DMK](https://dmk.de/fileadmin/user_upload/redaktion/Footer/Lieferanteninfo/Lieferanten_Selbstauditierungsb%C3%B6gen/DE/Vorgaben_zur_Belieferung_mit_Bulk-Fahrzeugen_V2.pdf)); matriz de cargas anteriores do cliente ([Bunge](https://delivery.bunge.com/-/media/Files/Australia/Agriculture/Delivering-to-Bunge-SA-or-Vic/Vehicle-Hygiene/Prior-load-matrix.ashx)).
  - Relevância para o Traxium: Motor IDTF/Configurações (regras por cliente como diferencial), Control Tower.

### Inferences
- Para revisão das telas do Traxium, a leitura do mercado sugere:
  - Control Tower e Motor IDTF são o diferencial real; vale mostrar na decisão a regra aplicada (IDTF nº, regime, esquema, regra do cliente, versão da base).
  - Limpezas deve aceitar ECD/eECD (foto, PDF, QR) e distinguir emissor (estação SQAS vs próprio).
  - Exceções/liberações precisa contemplar a liberação após carga proibida (Opções A e B, contador de 5 cargas, quem libera) e o pedido de classificação de produto não listado.
  - Ativos e frota precisa de histórico de vida do ativo (aquisição, reboque usado, dedicação feed vs proibido, lavagem úmida trimestral, vencimento de flexitank).
  - Acesso externo e Dossiê devem permitir ao carregador/recebedor ver a T-3 e o certificado por link/QR sem conta, pois é exatamente o que recebedores (DMK, Bunge, Greenfield, Valero, OQ) pedem no portão.
  - Indicadores podem incluir rejeições no portão, NC por 1.000 viagens e qualidade/completude de dados por subcontratado (inspirado no compliance score do eECD).
  - Academy tem referência direta na GMP+ Academy (módulo de transporte para motoristas); pode ser excesso se replicar conteúdo oficial em vez de registrar evidência de treinamento.

### Gaps
- Não foi possível verificar se TMS europeus de nicho (alemães/holandeses) têm checagem de "Vorfracht" contra a IDTF; nenhuma fonte citável apareceu.
- Não foram encontrados produtos que gerenciem qualificação de subcontratados especificamente para transporte de feed; o mais próximo são as bases de empresas certificadas (GMP+ Company database, QS-Datenbank), que são de consulta.
