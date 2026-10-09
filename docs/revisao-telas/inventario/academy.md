# Academy
Arquivo: `Academy.dc.html`. Item da sidebar: "Academy" (grupo PILARES, estado ativo, sem badge). Perfil a quem se destina (pelo que a tela diz): usuário logado "Rafael Antunes", "Gestor de qualidade / GMP+"; a tela fala de motoristas da rede (frota própria, agregados, subcontratados, TAC) e de regras "configuráveis por cliente, produto e filial". Objetivo declarado na tela: "qualificação contínua ligada à liberação / 46 motoristas na rede ativa"; card da sidebar "Regra central": "Motorista sem competência comprovada **não aparece como elegível**. A trilha é requisito, não biblioteca."

## Entradas e saídas
- Como se chega: item "Academy" da sidebar em `Motor IDTF.dc.html` e `Configuracoes.dc.html`. Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar (mesma de Motor IDTF e Configurações): "Torre de Controle" (7) → `Torre de Controle v2.dc.html`; "Viagens" → `Viagens.dc.html`; "Exceções e liberações" (5) → `Excecoes.dc.html`; "Inspeções" (3) → `Inspecoes.dc.html`; "Limpezas" (3) → `Limpezas.dc.html`; "Motor IDTF" → `Motor IDTF.dc.html`; "Subcontratados" → `Subcontratados.dc.html`; "Motoristas" (42) → `Motoristas.dc.html`; "Acessos externos" (2) → `Acessos Externos.dc.html`; "Ativos e frota" → `Ativos e Frota.dc.html`; "Dossiê de auditoria" → `Dossie.dc.html`; "Indicadores" (11/15) → `Indicadores.dc.html`; "Não conformidades" (4) → `Nao Conformidades.dc.html`; "Configurações" → `Configuracoes.dc.html`; "Onboarding público" (6 passos) → `Onboarding Publico.dc.html`; "Protótipo mobile" (12 telas) → `App de Campo.dc.html`.
  - Nenhum elemento do conteúdo navega para outra tela; nomes de motoristas não levam a `Motoristas.dc.html`.

## Estrutura da tela
1. Sidebar com card de rodapé "Regra central" (texto citado acima). Recolhível.
2. Cabeçalho: título "Academy", subtítulo citado. À direita: campo de busca (placeholder "Motorista ou trilha…"), botão primário "Enviar em massa", avatar "RA" com menu de perfil.
3. Faixa de 4 KPIs (valores fixos, não reagem a filtro nem busca):
   - "Motoristas com competência vigente": "87%", "40 de 46 elegíveis agora"; barra dividida 87% verde e 7% âmbar sobre fundo hachurado; legenda "Vigente", "Vence em 30d", "Vencida".
   - "Bloqueados por trilha": "3", com "não aparecem como elegíveis".
   - "Disparos just-in-time / 7 dias": "12", com "acionados pelo risco da operação".
   - "Nota média / 90 dias": "8,4", com "mínima exigida: 7,0 / 2 tentativas".
4. Card "Trilhas do programa", subtítulo "10 trilhas / versão gravada em cada conclusão", link "+ Nova trilha". Grade de 2 colunas com 10 cartões. Campos por cartão: número (ex.: "05"), nome (ex.: "Regimes de limpeza A, B, C e D"), barra e percentual (ex.: "74%"), chip de saúde ("saudável", "atenção", "crítica"). Mock: 01 a 10; 7 "saudável", 2 "atenção" (05 com 74%, 09 com 66%), 1 "crítica" (10 "Boas práticas Gatekeeper", 58%). Reage à busca (filtra por nome da trilha). O subtítulo "10 trilhas" não muda com o filtro.
5. Card "Competência por motorista". Alternador "Lista" / "Matriz" e 3 filtros: "Todos / 7", "Bloqueados / 3", "Vencem / 1".
   - Vista Lista (padrão): sem cabeçalho de colunas. 7 linhas. Campos: avatar com anel colorido pelo status, nome (ex.: "Valdir Nunes"), vínculo ("frota própria", "agregado", "Lima Logística / subcontratado", "TAC / Gatekeeper"), barra hachurada com fração de trilhas (ex.: "9/10"), chip de situação ("Elegível", "Vence em breve", "Bloqueado"), texto de próximo evento (ex.: "trilha 5 vencida há 6 dias", em vermelho), botão circular de envio (title "Enviar trilha por WhatsApp"). Clicar na linha expande o bloco "O QUE ACONTECEU" (linha do tempo com 2 ou 3 eventos), botão de ação contextual e regra. Reage à busca (nome e vínculo) e ao filtro.
   - Vista Matriz: grade "MOTORISTA × TRILHA" com 7 linhas e 10 colunas (cabeçalho "01" a "10", title com o nome da trilha). Célula colorida com ícone: "✓" vigente, "!" vence em 30d, "✕" vencida ou reprovada, um ponto pequeno centralizado para nunca iniciou. Legenda e texto "clique na célula para ver nota, tentativas e certificado". Não reage à busca nem aos filtros.
   - Mock de motoristas: Ivan Prado (Elegível, 10/10, "reciclagem em 14 set"), Sérgio Ramos (Elegível, 10/10, "nada nos próximos 90d"), Valdir Nunes (Bloqueado, 9/10), Milton Costa (Vence em breve, 10/10, "trilha 9 vence em 12 dias"), Paulo Lima (Bloqueado, 9/10, "trilha 9 vencida há 2 dias"), Edson Farias (Elegível, 10/10, "reciclagem em 30 out"), João Bortolini (Bloqueado, 8/10, "trilha 10 reprovada 2×: reforço").
6. Rail direito, card escuro "Acionado pelo risco", subtítulo "o sistema dispara a trilha na hora em que o conhecimento vira requisito". 4 eventos fixos, não clicáveis: "Carga exige limpeza C" ("orientação enviada a Milton Costa / VG-2483", "há 2h"); "Gatekeeper pela 1ª vez" ("trilha 10 disparada a Valdomiro Sanches", "ontem"); "2ª foto rejeitada no mês" ("microtreinamento corretivo / Paulo Lima", "ontem"); "Produto sensível na rota" ("instrução pré-confirmação / Ivan Prado", "seg").
7. Rail direito, card "Regras de liberação", subtítulo "configuráveis por cliente, produto e filial". 4 linhas fixas: "Nota mínima: 7,0"; "Tentativas: 2 / depois reforço obrigatório"; "Reciclagem: 12 meses por trilha"; "NutriMax exige: trilha 9 (proteção da carga)". Nota: "Reprovou duas vezes: bloqueia e aciona reforço. A liberação volta pela nova avaliação, nunca por edição manual." Sem ação de edição.
8. Rail direito, card "Relatório de auditoria": "Conclusões com nota, tentativas, aceite de ciência, versão do conteúdo e validade. Exportável por período e por motorista." Botão escuro "Exportar relatório".
9. Overlays: drawer da trilha, modal "Enviar em massa", modais de perfil, toast.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| Itens da sidebar | Sidebar | navegação | Ver Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Igual às demais telas; persiste em `localStorage` (`tx-nav`). |
| Campo de busca | Cabeçalho | muda estado | Filtra trilhas (por nome) e linhas da lista de motoristas (por nome e vínculo). Não filtra a matriz nem os contadores dos filtros. |
| "Enviar em massa" | Cabeçalho | modal | Abre o modal com seleção zerada. |
| Modal "Enviar em massa" | Sobre a tela | modal / toast | Campos: "TRILHA" (escolha única obrigatória entre as 6 primeiras trilhas, rótulo com número e 3 primeiras palavras, ex.: "05 / Regimes de limpeza"); "PARA QUEM" (escolha única obrigatória): "Quem está vencido ou vence em 30 dias" ("9 motoristas"), "Todos em condição Gatekeeper" ("14 terceiros"), "Filial Rondonópolis inteira" ("46 motoristas"). Botões "Cancelar" e "Enviar por WhatsApp" (cinza e cursor bloqueado até os dois campos estarem preenchidos). Ao enviar: fecha e toast "Trilha <nn> enviada ao grupo escolhido. Cada conclusão grava nota, tentativas e versão." Nenhum dado da tela muda. Fecha por "✕", "Cancelar" ou clique no fundo. |
| "+ Nova trilha" | Card "Trilhas do programa" | toast | "Nova trilha: nasce como rascunho v1.0, invisível aos motoristas até a Qualidade publicar." Nada é criado. |
| Cartão de trilha | Card "Trilhas do programa" | drawer | Abre o drawer da trilha. |
| Drawer da trilha | Lateral direita, 520px | drawer | Cabeçalho "TRILHA <nn> / v3.2", nome, "4 vídeos + PDF + avaliação / 45 min / validade 12 meses", 3 KPIs: "concluíram" (calculado, ex.: "34 de 46"), "nota média" ("8,1"), "tentativas médias" ("1,3"). Seção "Conteúdo": 5 itens ("Por que o regime existe: contaminação cruzada" 6 min; "Regime A e B na prática do pátio" 9 min; "Regime C e D: agente, dosagem, tempo" 11 min; "Guia visual de evidências por regime (PDF)" leitura; "Avaliação: 10 questões / nota mínima 7,0" 10 min). Seção "Quem falta concluir (<n>)" com 3 pessoas: Valdir Nunes ("vencida há 6 dias / bloqueado"), João Bortolini ("nunca iniciou"), Valdomiro Sanches ("parou no vídeo 2"), cada uma com "Enviar →". Nota: "Cada conclusão grava nota, tentativas, aceite de ciência e a versão v3.2 assistida. Atualizar o conteúdo cria v3.3; conclusões antigas não mudam." Botões "Nova versão (v3.3)", "Editar rascunho", "Arquivar" (vermelho, à direita). Fecha por "✕" ou clique no fundo. |
| "Enviar →" | Drawer, "Quem falta concluir" | toast | "Trilha <nn> enviada a <nome> por WhatsApp." |
| "Nova versão (v3.3)" | Drawer | toast | "v3.3 criada como rascunho. Publicar dispara reciclagem só para quem a regra do cliente exigir; conclusões da v3.2 não mudam." A versão exibida continua v3.2. |
| "Editar rascunho" | Drawer | toast | "Editor da trilha aberto em rascunho: vídeos, PDF e questões. Nada muda para os motoristas até publicar." Nenhum editor abre. |
| "Arquivar" | Drawer | toast | "Trilha <nn> arquivada: sai das exigências novas; conclusões e certificados existentes ficam válidos no histórico." Sem confirmação; a trilha continua na lista. |
| "Lista" / "Matriz" | Card "Competência por motorista" | muda estado | Alterna a vista. |
| Filtros "Todos", "Bloqueados", "Vencem" | Card "Competência por motorista" | muda estado | Filtram a lista por situação; na vista Matriz não têm efeito visível. Não há filtro para "Elegível". |
| Linha do motorista | Lista | muda estado | Expande ou recolhe o bloco "O QUE ACONTECEU" (um por vez). |
| Botão de envio (ícone avião) | Linha do motorista | toast | "Trilha pendente enviada a <nome> por WhatsApp. Conclusão recalcula a elegibilidade sozinha." Disponível também para motoristas 10/10 sem pendência. |
| Botão contextual do bloco expandido | Linha expandida | toast | Rótulos: "Enviar reciclagem (45 min)" (Valdir Nunes, Paulo Lima), "Acompanhar reforço" (João Bortolini), "Reenviar aviso" (Milton Costa), "Ver certificados" (demais). Toast: "<rótulo>: feito para <nome>. Tudo fica gravado no registro dele." Regra ao lado, ex.: "concluiu: volta a ser elegível sozinho, sem edição manual". |
| Célula da matriz | Vista Matriz | toast | "<nome> × trilha <nn> (<nome da trilha>): <detalhe>." Ex.: "vencida / era nota 8,5 / reciclagem pendente, bloqueia elegibilidade". Title de hover com o primeiro trecho. |
| "Exportar relatório" | Card "Relatório de auditoria" | toast | "Relatório de treinamento exportado: conclusões, notas, tentativas e versões, carimbado em 6 ago." Sem seleção de período ou motorista; nenhum arquivo. |
| Avatar "RA" e menu de perfil | Cabeçalho | popover / modais | Idêntico a Motor IDTF: "Meu perfil" (leitura), "Preferências e notificações" (4 interruptores, 1 travado), "Papel ativo" (5 papéis, toast "Papel ativo agora é..."), "Sair" (modal, toast "Sessão encerrada..."). |

## Estados e simulações
- Loading: não há skeleton nem estado de carregamento.
- Vazio da lista de motoristas: "Ninguém neste filtro" / "Ajuste a busca ou o filtro de situação." (só na vista Lista).
- Trilhas sem resultado na busca: a grade fica vazia, sem mensagem.
- Vista Lista ou Matriz como alternância de estado. Expansão de linha como estado.
- Botões desabilitados: "Enviar por WhatsApp" até escolher trilha e público.
- Sem estados de erro.

## Entidades e operações
- Trilha: consultar (cartão e drawer), criar (só toast), versionar (só toast), editar (só toast), arquivar (só toast), enviar (toast).
- Motorista: consultar situação, histórico e matriz de competência; enviar trilha (toast). Sem edição (declarado: "nunca por edição manual").
- Conclusão/competência (motorista × trilha): consultar (matriz, histórico).
- Disparo just-in-time: consultar (lista fixa).
- Regra de liberação: consultar (sem edição).
- Relatório de auditoria de treinamento: exportar (toast).
- Grupo de envio: escolher no envio em massa.

## Regras de negócio visíveis
- Motorista sem competência comprovada não aparece como elegível; "A trilha é requisito, não biblioteca."
- Nota mínima 7,0; 2 tentativas; reprovação dupla bloqueia e aciona reforço obrigatório antes de nova avaliação.
- Reciclagem a cada 12 meses por trilha; vencimento bloqueia automaticamente ("não foi nota: a trilha venceu").
- Aviso automático aos 30 dias do vencimento.
- A elegibilidade volta sozinha com a conclusão ou aprovação; "nunca por edição manual".
- Cada conclusão grava nota, tentativas, aceite de ciência e versão do conteúdo; nova versão não altera conclusões antigas.
- Nova trilha nasce como rascunho v1.0, invisível aos motoristas até a Qualidade publicar.
- Arquivar tira a trilha das exigências novas sem invalidar conclusões existentes.
- Cliente pode exigir trilha específica ("NutriMax exige: trilha 9").
- Trilha 10 exigida pela condição Gatekeeper.

## Observações factuais
- Convenção deste inventário: o separador ponto médio usado na interface aparece transcrito como barra (/).
- Contagem de motoristas inconsistente: subtítulo e KPI dizem 46 na rede; filtro "Todos / 7" e a lista têm 7; o badge "Motoristas" da sidebar diz 42. A lista não tem paginação nem indicação de que mostra só parte dos 46.
- KPI "Disparos just-in-time / 7 dias: 12" contra 4 eventos listados no card "Acionado pelo risco". KPI "Bloqueados por trilha: 3" coincide com os 3 bloqueados do mock.
- A legenda do KPI de competência usa cinza para "Vencida"; a legenda da matriz usa vermelho para "vencida ou reprovada" e cinza para "nunca iniciou".
- Ivan Prado aparece como "Elegível" e 10/10 na lista, mas na matriz tem a trilha 9 com "!" (vence em 12 dias), o mesmo estado que deixa Milton Costa como "Vence em breve".
- O drawer de trilha mostra o mesmo conteúdo para qualquer trilha: versão "v3.2", nota "8,1", tentativas "1,3", as 5 aulas sobre regimes de limpeza (conteúdo da trilha 05) e as mesmas 3 pessoas em "Quem falta concluir". O título da seção usa um número calculado (ex.: 34 faltantes na trilha 05, 2 na trilha 01) enquanto a lista tem sempre 3 nomes.
- No drawer, João Bortolini aparece como "nunca iniciou" para todas as trilhas, enquanto a matriz o mostra reprovado na trilha 10 e sem início só na trilha 9. Valdomiro Sanches aparece no drawer e no card "Acionado pelo risco", mas não está na lista nem na matriz.
- Ações que só mostram toast, sem mudança de estado: "+ Nova trilha", "Nova versão (v3.3)", "Editar rascunho", "Arquivar", "Enviar →", envio por linha, botão contextual da linha, células da matriz, "Enviar por WhatsApp", "Exportar relatório".
- "Arquivar" executa sem confirmação, e a trilha continua visível.
- O botão contextual "Ver certificados" gera o toast "Ver certificados: feito para <nome>. Tudo fica gravado no registro dele.", texto de ação executada para um rótulo de consulta.
- Para Sérgio Ramos, o histórico mostra "Próxima reciclagem programada" com data "nada nos próximos 90d" (texto derivado do campo "próximo").
- O envio em massa só oferece as 6 primeiras trilhas; as trilhas 07 a 10, incluindo a 09 citada em "NutriMax exige" e a 10 "crítica", não estão disponíveis ali. Os rótulos são truncados nas 3 primeiras palavras e alguns terminam em conjunção (ex.: "04 / Cargas proibidas e", "06 / Inspeção higiênica e").
- O card "Regras de liberação" diz "configuráveis por cliente, produto e filial", mas não há ação de configuração aqui; a tela `Configuracoes.dc.html` também não tem seção para essas regras (a regra R-08 "Competência do motorista" aparece lá como travada).
- O card "Relatório de auditoria" diz "Exportável por período e por motorista", mas o botão exporta sem nenhuma escolha.
- O botão de envio por WhatsApp aparece em todas as linhas, inclusive motoristas 10/10 sem pendência, com o texto "Trilha pendente enviada".
- Esc não fecha o drawer nem o modal "Enviar em massa" (só os modais de perfil e o menu de perfil).
- Modais de perfil idênticos aos de `Motor IDTF.dc.html` e `Configuracoes.dc.html`.
