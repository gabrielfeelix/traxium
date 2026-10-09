# Configurações
Arquivo: `Configuracoes.dc.html`. Item da sidebar: "Configurações" (rodapé da sidebar, estado ativo). Perfil a quem se destina (pelo que a tela diz): usuário logado "Rafael Antunes", "Gestor de qualidade / GMP+"; a parametrização é atribuída à transportadora "Transrural Log Ltda", "auditada em 28 jul por Helena Duarte". Objetivo declarado na tela: subtítulo "Transrural Log Ltda / 4 filiais / parametrização auditada em 28 jul por Helena Duarte"; seção padrão "As doze condições que o motor avalia".

## Entradas e saídas
- Como se chega: item "Configurações" da sidebar em `Motor IDTF.dc.html` e `Academy.dc.html`. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar (mesma de Motor IDTF e Academy, sem card de rodapé): "Torre de Controle" (7) → `Torre de Controle v2.dc.html`; "Viagens" → `Viagens.dc.html`; "Exceções e liberações" (5) → `Excecoes.dc.html`; "Inspeções" (3) → `Inspecoes.dc.html`; "Limpezas" (3) → `Limpezas.dc.html`; "Motor IDTF" → `Motor IDTF.dc.html`; "Subcontratados" → `Subcontratados.dc.html`; "Motoristas" (42) → `Motoristas.dc.html`; "Acessos externos" (2) → `Acessos Externos.dc.html`; "Academy" → `Academy.dc.html`; "Ativos e frota" → `Ativos e Frota.dc.html`; "Dossiê de auditoria" → `Dossie.dc.html`; "Indicadores" (11/15) → `Indicadores.dc.html`; "Não conformidades" (4) → `Nao Conformidades.dc.html`; "Onboarding público" (6 passos) → `Onboarding Publico.dc.html`; "Protótipo mobile" (12 telas) → `App de Campo.dc.html`.
  - Seção "Organização e filiais", card "As cinco superfícies do produto": "A Console Traxium" → `Console Traxium.dc.html`; "B Back-office" → `Torre de Controle v2.dc.html`; "C App de campo" → `App de Campo.dc.html`; "D Onboarding público" → `Onboarding Publico.dc.html`; "E Visão auditor" → `Dossie.dc.html`.
  - Modal de regra travada: botão "Ver a matriz de autoridade" → `Excecoes.dc.html`.

## Estrutura da tela
1. Sidebar (sem card de rodapé nesta tela). Recolhível.
2. Cabeçalho: título "Configurações", subtítulo citado. À direita: botão escuro "Exportar parametrização" e avatar "RA" com menu de perfil.
3. Navegação interna (coluna esquerda de 250px, fixa ao rolar): 5 seções, com ponto indicador: "Motor de regras" (chip âmbar "7 travadas"), "LGPD e retenção", "Equipe e permissões", "Organização e filiais", "Integrações e tokens". Seção inicial: "Motor de regras". Não há abas no topo; a troca é por esta lista.
4. Skeleton: nos primeiros 900 ms, 3 cartões com shimmer substituem o conteúdo de qualquer seção.
5. Seção "Motor de regras":
   - Banner escuro "As doze condições que o motor avalia": "A classe de cada regra é configurável, com piso. As sete que a diretriz define como bloqueio técnico aparecem travadas, com o motivo da trava. Configurável não significa negociável." Contador "7" / "travadas de 12".
   - 12 linhas de regra. Campos: código (ex.: "R-05"), nome (ex.: "Certificado vencido ou de escopo incompatível"), descrição (ex.: "certificado GMP+ fora da validade ou fora do escopo de transporte de feed") e, à direita, ou o seletor de classe (4 pílulas "Informação", "Registro", "Alerta", "Bloqueio"; abaixo do piso ficam esmaecidas) ou a caixa vermelha "Bloqueio travado / por que?".
     - Travadas (7): R-02 "Carga anterior proibida", R-03 "Limpeza incompatível com o regime exigido", R-04 "Checklist reprovado", R-05 "Certificado vencido ou de escopo incompatível", R-06 "Subcontratado não apto", R-07 "Acordo de garantia da qualidade não vigente", R-08 "Competência do motorista".
     - Configuráveis (5), com piso e classe inicial: R-01 "Histórico T-3 incompleto" (piso Alerta, atual Bloqueio); R-09 "Produto não reconhecido pela base" (Alerta, Bloqueio); R-10 "Fotos mínimas ausentes" (Registro, Registro); R-11 "Certificação a vencer" (Informação, Alerta); R-12 "Inspeção pendente de sincronização" (Registro, Registro).
   - Card informativo "i": "Mudar uma regra hoje não altera decisão histórica: cada decisão grava a versão da base e a classe vigente no momento em que foi tomada. O dossiê de maio continua explicando maio."
6. Seção "LGPD e retenção":
   - Card "Os sete tipos de dado pessoal", subtítulo "cada um com prazo de retenção, base legal e o que acontece no fim do prazo". 7 linhas clicáveis: ponto (azul para dado crítico, verde-água para os demais), nome e base legal, prazo ("retenção"), destino ("no fim do prazo"). Ex.: "CPF e CNH do motorista", "obrigação regulatória", "5 anos", "anonimização". Demais: "Geolocalização da captura", "Fotos de evidência", "Assinatura eletrônica", "Telefone e WhatsApp" (legítimo interesse, "2 anos após o último vínculo", "exclusão"), "Dados do veículo e do implemento", "Logs de acesso ao sistema" (legítimo interesse, "12 meses", "exclusão").
   - Card "Consentimentos", subtítulo "revogar um consentimento tem efeito diferente conforme a base legal, e a tela afirma isso em vez de esconder". 3 itens com nome, "base legal: <base>", botão e caixa "Se revogado: <efeito>": "Uso de imagem em evidência de inspeção" (obrigação regulatória, botão "Tentar revogar", tom âmbar); "Comunicação por WhatsApp" (legítimo interesse, "Revogar"); "Comunicação sobre novidades do produto" (consentimento, "Revogar").
   - Card "Política de inativação", subtítulo "cada regra declara o que é preservado; nada aqui apaga o passado". 3 itens fixos com "✓": "Empresa arquivada", "Motorista inativado", "Ativo desvinculado", cada um com a descrição do que é preservado.
7. Seção "Equipe e permissões": card "Papel × permissão", subtítulo "o que cada papel faz, e o que ele nunca faz", botão "Convidar da equipe". Matriz 6 permissões × 5 papéis. Linhas: "Ver a fila de decisões", "Criar viagem", "Aprovar exceção", "Classificar produto", "Abrir NC", "Configurar o motor". Colunas (avatar com iniciais e rótulo curto): "Qualidade" (GQ, tudo ✓), "Despacho" (DE: ✓ ver fila, criar viagem, abrir NC), "Diretoria" (DR: ✓ ver fila, aprovar exceção, abrir NC, configurar motor), "Terceiros" (AS: ✓ ver fila, abrir NC), "Auditoria" (AI: ✓ ver fila, abrir NC). Nota: "O despachante nunca aprova exceção e o cliente embarcador libera apenas escopo comercial. Essas duas ausências são requisito da operação real, não simplificação da matriz." Não há lista de membros da equipe.
8. Seção "Organização e filiais":
   - Card "A transportadora": 5 campos fixos: "Razão social: Transrural Log Ltda", "CNPJ: 11.204.336/0001-58", "Certificado GMP+ FSA: B4.3 / transporte de feed", "Número do certificado: GMP-BR-114228", "Certificadora: Control Union do Brasil". Sem edição.
   - Card "Filiais e escopo de certificação", subtítulo "escopo errado bloqueia, mesmo com certificado válido". 4 linhas: iniciais, nome, "tipo / viagens no mês", chip de escopo, prazo. Ex.: "Rondonópolis MT", "matriz / 44 viagens no mês", "transporte de feed", "318 dias"; "Cuiabá MT", "filial / 18 viagens no mês", "afretamento" (âmbar), "96 dias". Demais: Sorriso MT, Rio Verde GO.
   - Card "As cinco superfícies do produto", subtítulo "o que cada uma deliberadamente não mostra é requisito de conformidade, não simplificação". 5 links com letra, nome, público, "OBJETO PRIMÁRIO" e chip de status: A "Console Traxium" ("a Traxium, fornecedora do software", "o cliente, não os dados dele", "tela pronta"); B "Back-office" ("equipe de escritório da transportadora", "varia por papel", "você está aqui"); C "App de campo" ("motorista e inspetor de pátio", "o checklist da viagem de hoje", "tela pronta"); D "Onboarding público" ("transportador terceiro, sem conta", "o próprio cadastro", "tela pronta"); E "Visão auditor" ("auditor externo", "a amostra sorteada, só leitura", "no dossiê").
9. Seção "Integrações e tokens":
   - Card "Integrações", subtítulo "o que entra automático deixa de depender de digitação". 4 linhas: iniciais, nome, descrição, status com ponto, botão. "Base pública da certificadora" (ativa, "Configurar"); "WhatsApp Business" (ativa, "Configurar"); "ERP de transporte" ("em homologação", "Ver logs"); "Telemetria de rastreamento" ("não conectada", "Conectar").
   - Card "Tokens de API", subtítulo "token some da tela depois de criado; aqui fica só o prefixo", botão "Gerar token". 3 linhas: nome, prefixo, escopo, último uso, "Revogar". Ex.: "Integração ERP", "txm_live_a3f8…", "leitura de viagens e status de liberação", "há 4 min". Demais: "Painel do cliente embarcador" (há 2h), "Exportação de dossiê" (há 3 dias).
10. Overlays: modal da regra travada, modal do dado LGPD, modais de perfil, toast.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Itens da sidebar | Sidebar | navegação | Ver Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Persiste em `localStorage` (`tx-nav`). |
| "Exportar parametrização" | Cabeçalho | toast | "Parametrização exportada: as 12 regras com classe e piso, os 7 tipos de dado, a matriz de permissão e as integrações." Nenhum arquivo. |
| Item da navegação interna | Coluna esquerda | muda estado | Troca a seção exibida. Não há skeleton na troca. |
| Pílula de classe permitida | Regra configurável | muda estado / toast | Aplica a classe e mostra "<R-xx> passou a valer como <classe>. Decisões já tomadas mantêm a classe que valia na época." Sem confirmação, sem salvar, sem persistência após recarregar. Clicar na classe já vigente não faz nada. Title: "classe vigente" ou "aplicar <classe>". |
| Pílula abaixo do piso | Regra configurável | toast | "R-xx tem piso em <piso>. Configurável não significa negociável: abaixo do piso não existe opção." Title: "abaixo do piso desta regra, que é <piso>". |
| "Bloqueio travado / por que?" | Regra travada | modal | Modal com código e nome da regra, caixa "Bloqueio travado no piso" com o motivo específico (ex.: R-02: "Nenhum regime de limpeza resolve um par proibido..."), 4 cartões de classe ("Bloqueio" com tag "vigente"; "Informação", "Registro", "Alerta" riscados com tag "indisponível", cursor bloqueado), texto "Nenhuma autoridade libera uma regra de bloqueio técnico, e nenhuma configuração a rebaixa. O caminho é o plano de regularização, que muda o fato em vez de mudar a leitura dele." Botões "Fechar" e "Ver a matriz de autoridade" (navega para `Excecoes.dc.html`). Fecha por "✕", "Fechar" ou clique no fundo. |
| Linha de tipo de dado | Card "Os sete tipos de dado pessoal" | modal | Modal com título do dado e 5 linhas: "Base legal", "Fundamento", "Prazo de retenção", "No fim do prazo", "Exibição na interface" (ex.: "mascarado, últimos 3 dígitos"), mais nota explicativa. Botão "Fechar". Somente leitura. |
| "Tentar revogar" | Consentimento "Uso de imagem..." | toast | "Revogação registrada, sem efeito sobre a evidência: a base legal é obrigação regulatória, não consentimento. O pedido fica no histórico do titular." Sem confirmação. |
| "Revogar" | Consentimentos WhatsApp e novidades | toast | "<nome>: consentimento revogado. O efeito vale a partir de agora e fica datado no registro do titular." O botão e o item não mudam de estado. |
| "Convidar da equipe" | Seção Equipe | toast | "Convite da equipe: o papel escolhido define a autoridade na matriz, e ninguém assina acima do próprio nível." Nenhum formulário de convite. |
| Célula da matriz de permissão | Seção Equipe | toast | "<papel> pode <permissão>." ou "<papel> nunca faz isso: <permissão>." Title equivalente. Não altera a permissão. |
| Linha de filial | Card "Filiais e escopo" | toast | "<filial>: escopo <escopo>. Escopo de afretamento não cobre transporte de feed, e o motor bloqueia a viagem que tentar usar esta filial para feed." |
| Cartão de superfície | Card "As cinco superfícies" | navegação | Destinos listados em Entradas e saídas. |
| "Configurar", "Ver logs", "Conectar" | Card "Integrações" | toast | Para ativas e em homologação: "<integração>: configuração aberta. Alterações ficam registradas com autor e data." Para telemetria: "Telemetria de rastreamento: telemetria é evolução, não MVP. Conectar não muda nenhuma decisão do motor hoje." Nenhuma tela de configuração ou log abre. |
| "Gerar token" | Card "Tokens de API" | toast | "Token gerado e exibido uma única vez. Depois desta tela sobra o prefixo, nunca o segredo." Nenhum token é exibido nem adicionado à lista. |
| "Revogar" | Linha de token | toast | "<token>: token revogado agora. Chamadas com ele passam a falhar, e a revogação fica datada no log de segurança." Sem confirmação; a linha continua na lista. |
| Avatar "RA" e menu de perfil | Cabeçalho | popover / modais | Idêntico a Motor IDTF e Academy: "Meu perfil", "Preferências e notificações", "Papel ativo", "Sair". |

## Estados e simulações
- Loading: skeleton de 3 cartões com shimmer (`txsh`) por 900 ms ao abrir a tela (`setTimeout`). Só ocorre na montagem.
- Vazio: nenhuma seção tem estado vazio.
- Erro: nenhum estado de erro; o único bloqueio é o toast de piso.
- Simulação de classe de regra: escolher a classe altera a pílula ativa em memória.
- Estado inicial controlado por `state.secao` ('motor').

## Entidades e operações
- Regra do motor (R-01 a R-12): consultar; editar classe (5 regras configuráveis, respeitando piso); consultar motivo da trava (7 regras). Exportar (toast).
- Classe de regra (Informação, Registro, Alerta, Bloqueio): escolher.
- Tipo de dado pessoal LGPD: consultar (lista e modal).
- Consentimento: revogar (toast).
- Política de inativação (empresa, motorista, ativo): consultar.
- Papel e permissão: consultar (matriz). Convite de usuário: criar (só toast).
- Transportadora (razão social, CNPJ, certificado): consultar.
- Filial e escopo de certificação: consultar.
- Superfície do produto: consultar e navegar.
- Integração: consultar status; configurar, ver logs, conectar (só toast).
- Token de API: consultar prefixo; criar e revogar (só toast).

## Regras de negócio visíveis
- 12 condições avaliadas pelo motor; 7 são bloqueio técnico travado no piso, sem rebaixamento por configuração nem liberação por autoridade.
- Regras configuráveis têm piso; abaixo do piso "não existe opção". "Configurável não significa negociável."
- Mudança de classe não altera decisão histórica; cada decisão grava versão da base e classe vigente.
- Saída para bloqueio técnico é o "plano de regularização, que muda o fato em vez de mudar a leitura dele".
- Retenção LGPD: 5 anos para dados de obrigação regulatória; 2 anos após o último vínculo para telefone; 12 meses para logs. Destinos: anonimização, preservação no dossiê, exclusão.
- Revogar consentimento de imagem não remove a evidência (base é obrigação regulatória).
- Inativação nunca apaga histórico (empresa arquivada, motorista inativado, ativo desvinculado).
- Despachante nunca aprova exceção; cliente embarcador libera apenas escopo comercial.
- Escopo de certificação "afretamento" não cobre transporte de feed; escopo errado bloqueia mesmo com certificado válido.
- Token só é exibido uma vez; depois resta o prefixo.
- Telemetria "é evolução, não MVP".

## Observações factuais
- Convenção deste inventário: o separador ponto médio usado na interface aparece transcrito como barra (/).
- Ações que só mostram toast, sem mudança de estado: "Exportar parametrização", "Tentar revogar", "Revogar" (consentimentos), "Convidar da equipe", células da matriz de permissão, linhas de filial, "Configurar", "Ver logs", "Conectar", "Gerar token", "Revogar" (tokens).
- O texto de "Gerar token" diz "exibido uma única vez", mas nenhum token é exibido; a lista de tokens não muda após gerar ou revogar.
- "Revogar" de consentimento e de token não pede confirmação e não altera o item exibido.
- A mudança de classe de regra é aplicada sem confirmação e não persiste ao recarregar.
- Os papéis da matriz "Papel × permissão" (Gestor de qualidade, Despachante, Diretoria e RT, Admin de subcontratados, Auditor interno) diferem dos papéis do modal "Papel ativo" presente nesta mesma tela e em Motor IDTF e Academy (Inspetor de pátio, Tráfego, Gestor de qualidade, Diretoria e Resp. Técnico, Auditor interno). "Inspetor de pátio" e "Tráfego" não aparecem na matriz; "Despachante" e "Admin de subcontratados" não aparecem no modal. O nome "Diretoria e RT" na matriz é "Diretoria e Resp. Técnico" no modal.
- A nota da matriz cita o "cliente embarcador", mas não há coluna para esse papel.
- Na matriz, "Diretoria e RT" não tem "Classificar produto" nem "Criar viagem"; "Auditor interno" tem "Ver a fila de decisões" e "Abrir NC", coerente com o modal ("somente leitura, mais abrir não conformidade").
- O toast das linhas de filial é o mesmo texto para todas, incluindo a frase sobre afretamento também nas filiais de escopo "transporte de feed".
- O subtítulo diz "4 filiais" e a lista tem 4; o modal "Meu perfil" mostra "Filiais: Rondonópolis, Sorriso".
- O chip "você está aqui" está na superfície B "Back-office", cujo link leva para `Torre de Controle v2.dc.html`, não para esta tela.
- O botão "Ver a matriz de autoridade" leva para `Excecoes.dc.html` ("Exceções e liberações").
- Os dados da transportadora (razão social, CNPJ, certificado) são exibidos sem ação de edição; também aparecem no drawer de cliente de `Console Traxium.dc.html` (mesmo CNPJ "11.204.336/0001-58").
- O card "Regras de liberação" de `Academy.dc.html` declara regras "configuráveis por cliente, produto e filial" (nota mínima, tentativas, reciclagem), mas esta tela não tem seção para elas.
- O modal de dado LGPD e o de regra travada não fecham com Esc (Esc fecha só os modais de perfil e o menu de perfil).
- Modais de perfil idênticos aos de `Motor IDTF.dc.html` e `Academy.dc.html`.
- A sidebar desta tela não tem card de rodapé (Motor IDTF mostra "Base IDTF Brasil"; Academy mostra "Regra central").
