# Motoristas
Arquivo: Motoristas.dc.html (data-screen-label "Motoristas"). Item da sidebar: "Motoristas", no grupo PILARES, badge "42". Perfil a quem se destina (pelo que a tela diz): usuário interno da contratante; o usuário logado é "Rafael Antunes", "Gestor de qualidade", nível 3, papel trocável. Objetivo declarado na tela: "competência calculada, vínculo com vigência e documentos sob LGPD"; "Ninguém marca um motorista como apto." Convenção: o separador ponto médio dos rótulos da interface é transcrito como barra (/).

## Entradas e saídas
- Como se chega: pelo item "Motoristas" da sidebar de Subcontratados e Acessos Externos; em Acessos Externos também pelos botões "Abrir o motorista" (AC-121 Ivan Prado, AC-127 Valdir Nunes) e pela origem "Motoristas" do card "De onde vem cada convite". Demais origens: ver mapa do site.
- Para onde leva:
  - Sidebar: "Torre de Controle" (Torre de Controle v2.dc.html), "Viagens" (Viagens.dc.html), "Exceções e liberações" (Excecoes.dc.html), "Inspeções" (Inspecoes.dc.html), "Limpezas" (Limpezas.dc.html), "Motor IDTF" (Motor IDTF.dc.html), "Subcontratados" (Subcontratados.dc.html), "Acessos externos" (Acessos Externos.dc.html), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html), "Não conformidades" (Nao Conformidades.dc.html), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html), "Protótipo mobile" (App de Campo.dc.html).
  - Card "Atenção nos próximos 30 dias": botão "Abrir matriz da Academy" (Academy.dc.html).
  - Drawer, card "Trilhas obrigatórias": botão "Abrir histórico completo na Academy" (Academy.dc.html).

## Estrutura da tela
1. Sidebar. Mesmos itens das demais telas; item ativo "Motoristas" com badge "42". "Acessos externos" com badge "2". Botão "Recolher menu". Sem o cartão "Safra 2026/27".
2. Cabeçalho. Título "Motoristas"; subtítulo "competência calculada, vínculo com vigência e documentos sob LGPD". Busca com placeholder "Nome, CPF, CNH ou empresa…". Botões "Exportar" e "Novo motorista". Avatar "RA" com menu "Meu perfil", "Preferências e notificações", "Papel ativo" (chip "Gestor"), "Sair".
3. Faixa escura com bloco explicativo "ELEGIBILIDADE É RESULTADO", "Ninguém marca um motorista como apto.", "CNH, vínculo e trilhas vigentes produzem o estado automaticamente." e 4 KPIs fixos (não derivados do mock): "Motoristas ativos" 42 "+3 no mês" "próprios e terceiros"; "Elegíveis agora" 34 "81%" "resultado dos fatos vigentes"; "Vencem em 30 dias" 5 "atenção" "trilha ou documento"; "Bloqueados" 3 "−1" "não aparecem na escala".
4. Filtros em pílula por tipo de vínculo, com contagem derivada do mock: "Todos / 8", "Próprios / 3", "Agregados / 2", "Subcontratados / 3"; à direita "{n} de 8 registros nesta amostra".
5. Lista de motoristas (cartões em grade). Colunas sem cabeçalho de tabela, com rótulos internos: avatar com iniciais e anel, nome e "CPF {mascarado}" (ex.: "Ivan Prado da Silveira", "CPF ***.115.330-**"); "VÍNCULO ATUAL" com empresa e tipo (ex.: "Transrural Log Ltda", "Próprio"); "CNH" com "Categoria E" e "vence 14/03/2029" (âmbar quando próximo, ex.: "vence 18/12/2026"); chip de estado e motivo (ex.: "Elegível" / "4 trilhas vigentes"); seta "›". Mock: 8 motoristas (Ivan Prado da Silveira, Valdir Nunes, João Bortolini, Marcos Antônio Reis, Carlos Henrique Souza, André Luiz Moreira, Rogério Ferreira, Eduardo Dias Lopes). Estados no mock: "Elegível" (3), "Bloqueado" (2), "Reforço obrigatório" (1), "Vence em 12 dias" (1), "Pendente" (1). Empresas: "Transrural Log Ltda" (4), "Cerrado Cargas S.A." (2), "Lima Logística" (1), "Transrocha Transportes" (1). Reage a filtro e busca. Sem paginação. Motoristas criados no modal entram no fim da lista.
6. Estado vazio da lista (ver Estados).
7. Coluna lateral fixa ao rolar:
   - Card "Como o estado nasce", subtítulo "uma conta visível, nunca um campo editável": 4 linhas "1" "CNH vigente" "categoria compatível"; "2" "Vínculo vigente" "sem sobreposição"; "3" "Trilhas válidas" "nota e validade"; "=" "Elegibilidade" "derivada agora". Nota: "Quando qualquer fato vence, a elegibilidade cai sozinha. Corrigir o fato faz o estado voltar sem aprovação manual." Fixo.
   - Card "Atenção nos próximos 30 dias", badge fixo "5", 3 itens clicáveis: "André Luiz Moreira" "Feed Safety" "12 dias"; "João Bortolini" "Reforço obrigatório" "agora"; "Eduardo Dias Lopes" "Integração inicial" "pendente". Botão "Abrir matriz da Academy".
8. Drawer "PASSAPORTE DO MOTORISTA" (570px):
   - Capa: avatar, nome, "CPF {mascarado} / CNH {categoria}", chip do tipo de vínculo, chip do estado.
   - "Vínculo vigente", ação "Alterar vínculo": sigla, empresa, "desde {data} / sem sobreposição de vigência".
   - "Por que este estado?": 4 verificações com ✓ "confirmado" ou "!" "impede escala": "CNH vigente" ("categoria E / vence 14/03/2029"), "Vínculo vigente" ("{empresa} / desde {data}"), "Trilhas obrigatórias" (textos "todas dentro da validade", "uma trilha próxima do vencimento", "há pendência que impede escala", "integração ainda não concluída"), "Empresa elegível" ("frota própria", "empresa apta no escopo", "suspensa na base pública").
   - "Trilhas obrigatórias": 4 trilhas fixas "Fundamentos GMP+", "Contaminação cruzada", "Inspeção e evidência", "Contingência e bloqueio", com status ("vigente", "vencida", "reprovada 2×", "não iniciada", "vence em 12 dias"). Botão "Abrir histórico completo na Academy".
   - Botões "Enviar reciclagem" e "Exportar passaporte".
9. Modal "Alterar vínculo" (ver Ações).
10. Modal "Cadastrar motorista" (ver Ações).
11. Modais do avatar: "Papel ativo", "Sair da conta", "Meu perfil", "Preferências e notificações".
12. Toast inferior, some após 4,2 s.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Itens da sidebar | Sidebar | navegação | Ver Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Alterna largura; persiste em localStorage. |
| Busca | Cabeçalho | muda estado (filtra) | Compara com nome + CPF mascarado + empresa. Número de CNH não está nos dados. Não reseta o filtro de tipo. |
| "Exportar" | Cabeçalho | toast | "Lista exportada com documentos mascarados, vínculo vigente e origem de cada estado." Sem arquivo. |
| "Novo motorista" | Cabeçalho | modal | Abre "Cadastrar motorista". |
| Avatar e menu | Cabeçalho | popover e modais | "Meu perfil" (mesmo conteúdo de Subcontratados: e-mail, papel, "nível 3 / Gestor", "Filiais" "Rondonópolis, Sorriso", "Liberações assinadas em 2026" 14); "Preferências e notificações" (mesmos 4 interruptores de Subcontratados); "Papel ativo" (5 papéis, toast "Papel ativo agora é {papel}, nível {n}. A fila e as ações de assinatura passam a refletir esta autoridade."); "Sair" (modal "Sair da conta", toast "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data."). |
| Filtro de tipo | Acima da lista | muda estado (filtra) | "Todos", "Próprios", "Agregados", "Subcontratados". |
| Cartão de motorista | Lista | drawer | Abre o passaporte. |
| Item de "Atenção nos próximos 30 dias" | Coluna lateral | drawer | Abre o passaporte do motorista. |
| "Abrir matriz da Academy" | Coluna lateral | navegação | Academy.dc.html. |
| "✕" / fundo escuro | Drawer | fecha drawer | |
| "Alterar vínculo" | Drawer | modal | Abre "Alterar vínculo" com a empresa atual pré-selecionada. |
| "Abrir histórico completo na Academy" | Drawer | navegação | Academy.dc.html. |
| "Enviar reciclagem" | Drawer | toast | "Reciclagem enviada para {nome}. O estado só muda quando a trilha for concluída." Sem escolha de trilha. |
| "Exportar passaporte" | Drawer | toast | "Passaporte de {nome} exportado com vínculos, documentos e trilhas." |
| Modal "Alterar vínculo" | Drawer | modal, muda estado, toast | Texto: "O vínculo atual será encerrado com data. O histórico das viagens anteriores continua apontando para a empresa original." Campo: empresa (escolha única entre 4 fixas: "Transrural Log Ltda" "frota própria", "Cerrado Cargas S.A." "subcontratado", "Transrocha Transportes" "subcontratado", "Lima Logística" "subcontratado"); vem pré-selecionada a empresa atual. Sem campo de data, tipo de vínculo ou motivo. Botões "Cancelar" e "Registrar novo vínculo". Sem empresa, toast "Escolha a empresa do novo vínculo." Ao confirmar: a empresa, a sigla e "desde" ("06 ago 2026") do motorista mudam na lista e no drawer; o tipo de vínculo e o estado não mudam; toast "Novo vínculo registrado com início hoje. O anterior foi preservado no histórico." Escolher a mesma empresa também registra. |
| Modal "Cadastrar motorista" | Cabeçalho | modal, muda estado, toast | Subtítulo "o estado nasce pendente até os fatos serem conferidos". Campos: "Nome completo" (placeholder "nome do motorista"; exigido com 5 ou mais caracteres); "CPF" (placeholder "000.000.000-00"; exigido com 11 ou mais caracteres, contando pontuação, sem validação de dígito nem de duplicidade); "Categoria da CNH" (valor fixo "E", não editável); "Tipo de vínculo" (escolha entre "Próprio", "Agregado", "Subcontratado"; padrão "Próprio"). Aviso: "Cadastrar não libera para viagem. CNH, vínculo e trilhas serão verificados antes de o motorista aparecer como elegível." Botões "Cancelar" e "Cadastrar e conferir fatos" (fica cinza quando inválido, mas continua clicável; inválido mostra toast "Preencha nome completo e CPF para conferir os fatos."). Ao cadastrar: novo cartão no fim da lista com estado "Pendente", motivo "conferindo documentos e trilhas", CNH "E" com vencimento "em conferência", empresa "Transrural Log Ltda" (se Próprio) ou "Vínculo a conferir" (se Agregado ou Subcontratado), "desde" "06 ago 2026"; o filtro volta para "Todos"; toast "Motorista cadastrado como pendente. Nenhuma elegibilidade foi afirmada." Não há campo de número da CNH, vencimento, telefone, e-mail, empresa ou convite. |
| Esc | Global | fecha popover e modais do avatar | Não fecha drawer nem os modais "Alterar vínculo" e "Cadastrar motorista". |

## Estados e simulações
- Loading: não há skeleton; a animação `txsh` está declarada e não é usada.
- Vazio: "Nenhum motorista encontrado", "Ajuste a busca ou volte para todos os vínculos."
- Erro: não há estado de erro; validações do cadastro só por toast.
- Simulações: o mock tem um motorista por variação de estado (nivel "ok", "bloq", "ref", "vence", "pend"); o drawer abre por padrão com dados do primeiro motorista quando nenhum está selecionado (valor usado só internamente). Motoristas criados e vínculos alterados ficam no estado da página até recarregar. Não há props nem toggles.

## Entidades e operações
- Motorista: consultar (lista, busca, filtro por tipo, passaporte), criar (modal, entra como "Pendente"), exportar (lista e passaporte, só toast). Não há editar dados pessoais, arquivar, inativar, excluir, convidar nem revogar acesso.
- Vínculo do motorista com empresa: consultar, alterar (registra novo vínculo com data de hoje). Não há encerrar vínculo sem novo vínculo.
- CNH: consultar categoria e vencimento; no cadastro, categoria fixa.
- Trilha obrigatória: consultar status; enviar reciclagem (só toast); navegar para Academy.
- Estado de elegibilidade: consultar com explicação ("Por que este estado?"); não editável.
- Empresa (transportadora): referenciada como vínculo; não editável aqui.
- Papel do usuário logado: trocar.

## Regras de negócio visíveis
- Elegibilidade é resultado de CNH vigente (categoria compatível), vínculo vigente (sem sobreposição) e trilhas válidas (nota e validade); "Ninguém marca um motorista como apto."
- Quando um fato vence, a elegibilidade cai sozinha; corrigir o fato restaura o estado sem aprovação manual.
- Empresa suspensa na base pública bloqueia o motorista vinculado ("empresa suspensa na base pública").
- Reprovação 2× na mesma trilha gera "Reforço obrigatório".
- Bloqueados "não aparecem na escala".
- Alterar vínculo encerra o anterior com data; histórico de viagens continua apontando para a empresa original; vigências não se sobrepõem.
- Cadastro não libera para viagem; o estado nasce pendente; nenhuma elegibilidade é afirmada no cadastro.
- O estado só muda quando a trilha de reciclagem for concluída.
- Documentos sob LGPD; CPF exibido mascarado; exportação com documentos mascarados.
- A preferência "Bloqueio técnico na filial" não pode ser desligada.

## Observações factuais
- Os KPIs (42, 34, 5, 3) e o badge "5" de "Atenção nos próximos 30 dias" são fixos; a lista tem 8 motoristas, o card lista 3 itens, e o mock tem 2 bloqueados.
- A tela não tem ação de convidar o motorista nem de dar acesso ao app de campo; Acessos Externos diz que a origem "Motoristas" gera convites de "acesso ao app de campo" e que "Desvincular na tela de motoristas revoga aqui sozinho". Esta tela não tem "Desvincular", e o toast de "Alterar vínculo" não menciona acesso.
- O drawer não mostra se o motorista tem acesso ao app nem o status do convite.
- O estado de um motorista novo é "Pendente"; os cadastros de terceiros em Subcontratados e no Onboarding Público terminam em "Pré-cadastrado". Os estados desta tela ("Elegível", "Bloqueado", "Reforço obrigatório", "Vence em 12 dias", "Pendente") não coincidem com os 9 estados de Subcontratados.
- Tipos de vínculo aqui: "Próprio", "Agregado", "Subcontratado" (3). Subcontratados e Onboarding Público usam 7 tipos; não existe "TAC" aqui.
- O cadastro não pede empresa: Agregado e Subcontratado nascem com "Vínculo a conferir", e não há na tela ação que conclua essa conferência além de "Alterar vínculo".
- A categoria da CNH no cadastro é fixa em "E"; o mock tem motoristas com categoria "D".
- A verificação "CNH vigente" é sempre "confirmado", inclusive para motorista recém-cadastrado com vencimento "em conferência".
- "Alterar vínculo" muda a empresa, mas não muda o tipo nem o estado: um motorista "Próprio" movido para "Lima Logística" continua "Próprio" e com o estado anterior na lista, embora a verificação "Vínculo vigente" do drawer passe a "impede escala".
- Para Marcos Antônio Reis (bloqueado por "empresa suspensa na base pública"), a trilha "Contaminação cruzada" aparece como "vencida" e a verificação de trilhas como "há pendência que impede escala", porque a regra de status das trilhas usa só o nível "bloq".
- O motivo de André Luiz Moreira é "Feed Safety vence em 18 ago"; no drawer a trilha marcada "vence em 12 dias" é "Fundamentos GMP+". Não existe trilha "Feed Safety" na lista de 4 trilhas.
- O placeholder da busca promete "CNH"; os dados não têm número de CNH e a busca compara só nome, CPF mascarado e empresa.
- Os valores "06 ago 2026" do novo vínculo e do novo cadastro são fixos.
- Não há paginação; a lista tem 8 itens e o rodapé diz "registros nesta amostra".
- João Bortolini aqui é "Agregado" da "Cerrado Cargas S.A.", "CPF ***.772.901-**", "Reforço obrigatório"; em Subcontratados é TAC "Apto" com "CPF ***.882.441-**"; em Acessos Externos é TAC com "CPF 118.443.002-90".
- Valdir Nunes aqui é "Próprio" da "Transrural Log Ltda", "CPF ***.882.410-**", "Bloqueado"; em Acessos Externos é "motorista agregado", "CPF 660.294.771-33".
- Ivan Prado da Silveira aqui é "Próprio" da "Transrural Log Ltda" desde "12 fev 2022"; em Acessos Externos é "motorista da Cerrado Cargas"; no Onboarding Público é convidado pela "Cerrado Cargas" e conclui o cadastro como "Pré-cadastrado" em 6 ago.
- Empresas aparecem com nomes diferentes entre telas: "Lima Logística" aqui e em Acessos Externos, "Lima Logística Ltda" em Subcontratados; "Cerrado Cargas S.A." aqui, "Cerrado Cargas" em Subcontratados e no Onboarding Público.
- "Transrural Log Ltda" (frota própria aqui) não aparece em Subcontratados; em Acessos Externos é o nome da contratante na mensagem do convite.
- O modal "Cadastrar motorista" usa o rótulo "Novo motorista" no botão de abertura e "Cadastrar motorista" no título.
- Sidebar sem o cartão "Safra 2026/27" de Subcontratados.
