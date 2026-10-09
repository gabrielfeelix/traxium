# Subcontratados
Arquivo: Subcontratados.dc.html (data-screen-label "Subcontratados (Gatekeeper)"). Item da sidebar: "Subcontratados", no grupo PILARES, sem badge. Perfil a quem se destina (pelo que a tela diz): usuário interno da contratante; o usuário logado é "Rafael Antunes", "Gestor de qualidade" (nível 3 na matriz), papel trocável no menu do avatar. Objetivo declarado na tela: "Gatekeeper: quem pode transportar por você, e a prova disso", com 212 terceiros "na rede". Convenção: o separador ponto médio dos rótulos da interface é transcrito como barra (/).

## Entradas e saídas
- Como se chega: pela sidebar das telas Acessos Externos e Motoristas (item "Subcontratados"); em Acessos Externos também pelos botões "Abrir a empresa" das linhas expandidas (AC-118, AC-126, AC-129, AC-131), pelo cartão "Portal do subcontratado" do bloco "As três superfícies de fora" e pela origem "Subcontratados" do bloco "De onde vem cada convite". Demais origens: ver mapa do site.
- Para onde leva: somente a sidebar navega. Links: "Torre de Controle" (Torre de Controle v2.dc.html), "Viagens" (Viagens.dc.html), "Exceções e liberações" (Excecoes.dc.html), "Inspeções" (Inspecoes.dc.html), "Limpezas" (Limpezas.dc.html), "Motor IDTF" (Motor IDTF.dc.html), "Motoristas" (Motoristas.dc.html), "Acessos externos" (Acessos Externos.dc.html), "Academy" (Academy.dc.html), "Ativos e frota" (Ativos e Frota.dc.html), "Dossiê de auditoria" (Dossie.dc.html), "Indicadores" (Indicadores.dc.html), "Não conformidades" (Nao Conformidades.dc.html), "Configurações" (Configuracoes.dc.html), "Onboarding público" (Onboarding Publico.dc.html), "Protótipo mobile" (App de Campo.dc.html). Nenhum elemento do conteúdo, drawer ou modal navega para outra tela; o link "baixar modelo" do modal de importação tem href "#" e só gera toast.

## Estrutura da tela
1. Sidebar. Logo "Traxium / Compliance"; itens com badges fixos: "Torre de Controle" 7, "Exceções e liberações" 5, "Inspeções" 3, "Limpezas" 3, "Motoristas" 42, "Acessos externos" 2, "Indicadores" 11/15, "Não conformidades" 4, "Onboarding público" "6 passos", "Protótipo mobile" "12 telas". Item ativo "Subcontratados" sem badge. Botão "Recolher menu" (alterna largura 264px/84px, persiste em localStorage `tx-nav`). Cartão fixo no rodapé: "Safra 2026/27", "212 terceiros na rede", "87% aptos / cadastro sem atrito" (oculto com o menu recolhido).
2. Cabeçalho. Título "Subcontratados"; subtítulo "Gatekeeper: quem pode transportar por você, e a prova disso / 212 na rede" (fixo). Campo de busca com placeholder "CPF, CNPJ, placa, telefone ou nome…". Botão "+ Adicionar terceiro". Avatar "RA" com menu: cabeçalho "Rafael Antunes", "Gestor de qualidade / GMP+"; itens "Meu perfil", "Preferências e notificações", "Papel ativo" (chip com o papel, ex.: "Gestor"), "Sair".
3. Card "Estados de qualificação", subtítulo "clique para filtrar / o estado deriva dos fatos, ninguém digita". 9 chips, cada um com ponto colorido, número e nome. Valores fixos (não derivados do mock): "Apto" 184, "Apto com restrição" 6, "Pendente documental" 8, "Pendente treinamento" 4, "Pendente inspeção" 3, "Pré-cadastrado" 3, "Bloqueado" 2, "Suspenso" 1, "Inativo" 1 (soma 212). O chip clicado fica destacado e filtra a lista; os números não mudam com filtro ou busca.
4. Lista de terceiros (tabela). Colunas: "TERCEIRO" (avatar com iniciais e anel na cor do estado, nome, documento; ex.: "Lima Logística Ltda", "CNPJ 08.412.977/0001-31"), "VÍNCULO" (chip; ex.: "ETC"), "CERTIFICADO / ACORDO" (duas linhas; ex.: "GMP+ B4.3 suspenso" e "acordo v3 vigente"), "FROTA VINCULADA" (ex.: "3 conjuntos / 5 compart." e "4 motoristas"), "ESTADO" (chip; ex.: "Suspenso"), "VÁLIDO ATÉ" (ex.: "suspenso", "18 ago", "02 fev 27", "aguarda trilha", "em cadastro", "inspeção 8 ago"), coluna sem título com botão "⋯". Mock: 10 linhas (Lima Logística Ltda, Transrocha Transportes, João Bortolini, Cerrado Cargas, Valdomiro Sanches, AgroLima Ltda, Marcos Rocha, Pantanal Granéis, Sindona Transportes, Oliveira e Filhos). Vínculos usados no mock: "ETC" (6), "TAC" (3), "agregado" (2, em minúsculas). Cada um dos 9 estados aparece pelo menos uma vez ("Apto" duas vezes). Reage a busca e ao filtro do funil. Paginação de 7 por página: com as 10 linhas aparecem 2 páginas, rodapé "mostrando 1 a 7 de 10 empresas", botões "Anterior", números de página, "Próxima".
5. Estado vazio da lista (ver Estados).
6. Nota de rodapé fixa: "Estado nunca é editado à mão: deriva de certificado, acordo, trilhas e inspeções. Quem quiser mudar o estado, muda o fato."
7. Drawer "PASSAPORTE FEED SAFETY" (560px, abre ao clicar numa linha). Blocos:
   - Capa: avatar, nome, documento, chip do estado, chip do vínculo; 4 selos: "motoristas ativos", "trilhas vigentes", "viagens em 2026", "ocorrências 12m". Valores só têm duas variantes: para Lima ("4", "92%", "31", "2" com seta "↑"); para qualquer outra linha ("10", "100%", "58", "0").
   - "Apto para": chips com ✓ ou ✕. Lima: ✕ "grãos e farelos", ✕ "minerais", ✕ "operação Gatekeeper", ✓ "cadastro e consulta". Demais: ✓ "grãos e farelos", ✓ "minerais", ✓ "operação Gatekeeper", ✕ "líquidos (sem tanque)".
   - "O que falta para ficar apto" (só se o estado não for Apto nem Inativo): 2 itens numerados com CTA. Lima: "Certificado GMP+ regularizado na base pública" / "Reavaliar agora →"; "Reavaliação automática ao constar vigente" / "Ver regra →". Demais: "Concluir trilha "Regimes de limpeza" (45 min)" / "Enviar trilha →"; "Inspeção do implemento agendada" / "Ver agenda →".
   - Dois cards lado a lado. "CERTIFICADO GMP+": texto do certificado da linha, subtítulo ("escopo Road Transport / certificadora QSCert" para Lima, "escopo Road Transport / vigente" para os demais), "número" GMP059814 (fixo para todos), "válido até" ("suspenso desde 4 ago 26" para Lima, "19 set 2027" para os demais), "sites cobertos" "matriz Sorriso + filial Rondonópolis" (fixo), link "Ver documento original →", nota "consulta automática à base pública, 2× ao dia". "ACORDO DE QUALIDADE": texto do acordo da linha, "vigência 12 meses / renovação coletiva na safra", "v3 / assinatura eletrônica / aparelho registrado".
   - "Frota e motoristas vinculados", rótulo "vínculos com data", ação "+ Vincular". Lista de conjuntos: placa (ex.: "QAS 7C31 + SQT 9E18"), descrição (ex.: "graneleiro / 2 compartimentos / vínculo desde mar 24"), chip ("inspeção ok" ou "pend. inspeção"), botão ✕ com title "Desvincular com data; histórico preservado". Lima: 3 conjuntos; demais: 2 conjuntos fixos ("QBB 4D18 + SQT 3A90", "QCF 9E44 + SQT 8B21"). Nenhum motorista é listado no bloco.
   - "Últimos eventos": linha do tempo com título, data e subtítulo. Lima: 4 eventos (ex.: "Suspensão detectada na base pública", "4 ago, 06:12"). Demais: 3 eventos fixos (ex.: "Inspeção aprovada / QBB 4D18", "1 ago, 08:15", "Jorge Mattos / 6 fotos").
   - Botões "Exportar passaporte" e "Renovar acordo".
8. Modal "Adicionar terceiro" (620px). Texto: "Os três caminhos abaixo diferem em uma coisa só: quem digita os dados. Nenhum deles decide se a empresa opera." 3 opções, cada uma com título, quando usar e "quem digita": "Cadastrar eu mesmo" (quem digita: você), "Convidar para preencher" (o próprio terceiro), "Importar planilha" (você, em massa). Rodapé: "Os três terminam em Pré-cadastrado, que não opera. A aptidão vem depois, do certificado, da base pública, do acordo e do treinamento. A forma como o registro nasceu não muda o estado dele."
9. Modal "Cadastrar terceiro" com selo "VOCÊ DIGITA" (ver Ações).
10. Modal "Convidar terceiro" com selo "sem conta, sem app obrigatório" (ver Ações).
11. Modal "Importar planilha" em duas fases (ver Ações).
12. Modal "Suspender {nome}" (ver Ações).
13. Modais do avatar: "Meu perfil", "Preferências e notificações", "Papel ativo", "Sair da conta".
14. Toast inferior centralizado, some após 4,2 s.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| Itens da sidebar | Sidebar | navegação | Destinos listados em Entradas e saídas. |
| "Recolher menu" | Sidebar | muda estado | Alterna largura; persiste em localStorage. |
| Busca | Cabeçalho | muda estado (filtra) | Compara o texto com nome + documento + vínculo da linha; volta para a página 1. Placa e telefone não estão nos campos comparados. |
| "+ Adicionar terceiro" | Cabeçalho | modal | Abre "Adicionar terceiro". |
| Avatar "RA" | Cabeçalho | popover | Menu do perfil; fecha ao clicar fora ou Esc. |
| "Meu perfil" | Menu do avatar | modal | Mostra "Rafael Antunes", "rafael.antunes@traxium.com.br", "Papel" "Gestor de qualidade", "Autoridade na matriz" "nível 3 / Gestor", "Filiais" "Rondonópolis, Sorriso", "Liberações assinadas em 2026" 14. Só leitura. |
| "Preferências e notificações" | Menu do avatar | modal, muda estado | 4 interruptores: "Bloqueio técnico na filial" (travado, sempre ligado), "Item há mais de 2h na fila" (ligado), "Certificado de terceiro a vencer" (ligado), "Nova versão da base IDTF" (desligado). Nota: "O alerta de bloqueio técnico não pode ser desligado: é requisito da certificação." |
| "Papel ativo" | Menu do avatar | modal, muda estado, toast | 5 papéis com nível: "Inspetor de pátio" 1, "Tráfego" 2, "Gestor de qualidade" 3, "Diretoria e Resp. Técnico" 4, "Auditor interno" 0. Selecionar muda o chip do menu e mostra toast "Papel ativo agora é {papel}, nível {n}. A fila e as ações de assinatura passam a refletir esta autoridade." Nada mais na tela muda. |
| "Sair" | Menu do avatar | modal, toast | Modal "Sair da conta" com "Cancelar" e "Sair"; "Sair" fecha e mostra toast "Sessão encerrada. Registros assinados continuam no dossiê com seu nome e a data." Não navega. |
| Chip de estado do funil | Card "Estados de qualificação" | muda estado (filtra) | Filtra a lista pelo estado; clicar de novo volta a todos. Não volta para a página 1. |
| Linha da lista | Lista | drawer | Abre o passaporte do terceiro (se o menu da linha estiver fechado). |
| "⋯" | Linha | popover | Menu com 5 ações e a nota "Não existe excluir: o histórico sustenta o dossiê. Arquivar preserva tudo." |
| "Exportar passaporte" | Menu da linha | toast | "Passaporte de {nome} exportado com carimbo de 6 ago." Sem arquivo, sem mudança de estado. |
| "Renovar acordo" | Menu da linha | toast | "Renovação do acordo enviada a {nome} para assinatura eletrônica." Sem mudança de estado. |
| "Enviar trilha ou aviso" | Menu da linha | toast | "Envio para {nome}: escolha trilha ou aviso na próxima tela (Academy, em construção)." Não navega. |
| "Suspender manualmente…" | Menu da linha | modal | Abre "Suspender {nome}". |
| "Arquivar (inativar)" | Menu da linha | toast | "{nome} arquivado. Histórico e dossiês preservados; reativação a um clique." O estado da linha não muda; não há ação de reativar na tela. |
| "Anterior", número, "Próxima" | Rodapé da lista | muda estado | Paginação de 7 por página. |
| "✕" / fundo escuro | Drawer | fecha drawer | |
| CTA das pendências | Drawer, "O que falta para ficar apto" | toast | Lima: "Reavaliar agora" gera "Consulta feita agora: certificado segue suspenso na base da certificadora."; "Ver regra" gera "Regra R-06: subcontratado apto deriva do certificado. Sem edição manual." Demais: "Enviar trilha" gera "Trilha enviada por WhatsApp. A elegibilidade recalcula na conclusão."; "Ver agenda" gera "Inspeção marcada para 8 ago, 07:30, pátio Rondonópolis." |
| "Ver documento original →" | Drawer, certificado | toast | "Documento original do certificado aberto: PDF emitido pela QSCert, com QR de verificação na base pública." |
| "+ Vincular" | Drawer, frota | toast | "Vínculo novo: informe a placa ou o CPF; o vínculo nasce com data de hoje e o histórico anterior fica intacto." Nenhum campo é aberto. |
| "✕" do conjunto | Drawer, frota | toast | "Vínculo de {placa do cavalo} encerrado com data de hoje. O histórico do compartimento fica com o conjunto." O conjunto continua na lista. |
| "Exportar passaporte" | Drawer, rodapé | toast | "Passaporte Feed Safety exportado com carimbo de 6 ago. Credencial viva: reflete o estado de agora." |
| "Renovar acordo" | Drawer, rodapé | toast | "Renovação do acordo v3 enviada para assinatura eletrônica." |
| "Cadastrar eu mesmo" | Modal "Adicionar terceiro" | modal | Fecha e abre "Cadastrar terceiro" com campos vazios e o convite marcado. |
| "Convidar para preencher" | Modal "Adicionar terceiro" | modal | Fecha e abre "Convidar terceiro". |
| "Importar planilha" | Modal "Adicionar terceiro" | erro de script | O handler fecha o modal e chama `this.toastImportar()`, método que não existe na classe; o modal "Importar planilha" (estado `imp`) não é aberto por nenhum elemento. O valor `toastImport`, que abriria a fase 1, não está ligado a nenhum elemento. |
| Modal "Cadastrar terceiro" | Aberto por "Cadastrar eu mesmo" | modal, toast | Texto: "para quando os dados já chegaram por WhatsApp ou e-mail e não vale a pena mandar link para uma empresa só." Campos: "CNPJ" (placeholder "00.000.000/0000-00"; obrigatório; valida 14 dígitos; mensagens "A checagem de duplicidade compara só os dígitos, então grafia diferente não engana.", "Faltam {n} dígitos.", "Documento livre nesta base.", "Documento já cadastrado nesta base."); "RAZÃO SOCIAL" (placeholder "como está no cartão CNPJ"; obrigatório, mínimo 3 caracteres); "TIPO DE VÍNCULO" (obrigatório, 7 chips: "Frota própria", "Agregado", "TAC autônomo", "Subcontratado certificado", "Subcontratado Gatekeeper", "Afretamento", "Cooperado"); "CONTATO PARA O QUE VIER DEPOIS" (placeholder "WhatsApp ou e-mail de quem responde pela empresa"; obrigatório, mínimo 6 caracteres). Bloco "O QUE ACONTECE AO SALVAR": "A empresa nasce Pré-cadastrada e não recebe viagem. Nenhum certificado é presumido a partir daqui. O passo seguinte é o convite para ela anexar certificado, assinar o acordo e concluir o treinamento." Caixa de seleção "Já mandar o convite do portal para esse contato" (marcada por padrão). Duplicidade: os CNPJs 08.441.220/0001-73 ("Lima Logística") e 42.118.556/0001-09 ("Transrocha Transportes") disparam o alerta "Já existe cadastro com esses dígitos" com texto sobre dividir o histórico e botão "Abrir o cadastro existente" (fecha o modal e mostra toast "Abrindo o cadastro de {nome}. Se for a mesma empresa, o caminho é atualizar este registro, não criar outro."; não abre o drawer). Dica dinâmica à esquerda dos botões (ex.: "Falta o tipo de vínculo: ele muda o que será exigido.", "Pronto. Nasce Pré-cadastrada, como as outras duas portas."). Botões "Cancelar" e "Cadastrar" (desabilitado até tudo válido). Ao cadastrar: fecha e mostra toast "{razão social} cadastrada como Pré-cadastrada. Convite do portal enviado ao contato informado." ou, sem convite, "... Sem convite: ela não consegue anexar certificado sozinha até receber um." Nenhuma linha é adicionada à lista. |
| Modal "Convidar terceiro" | Aberto por "Convidar para preencher" | modal, toast | Texto: "o motorista abre um link, informa CPF, CNH, placas e T-3, e assina o aceite. Pronto." Canal (escolha única, padrão WhatsApp): "WhatsApp" ("link direto no telefone do motorista"), "SMS" ("para aparelho sem WhatsApp"), "QR Code no pátio" ("imprime e cola na balança ou portaria"). Campos: "nome do destinatário" e "telefone, ex.: (66) 99812-4407" (ambos exigidos no envio). Link fixo "traxium.app/c/RD-7K2M" com ação "copiar" (toast "Link copiado. Vale por 7 dias; CPF repetido reaproveita o cadastro."). Nota: "Se o CPF já existir na rede, o cadastro é reaproveitado: nada de duplicidade. Acesso temporário por código para o eventual de safra." Botão "Enviar convite" sempre com aparência ativa; sem nome e telefone mostra toast "Informe nome e telefone do destinatário antes de enviar."; com ambos fecha, limpa os campos e mostra toast "Convite enviado a {nome} por {WhatsApp, SMS ou QR Code}. O terceiro entra como Pré-cadastrado." Nenhuma linha é adicionada. Não há campo de CPF, CNPJ nem de tipo de vínculo. |
| Modal "Importar planilha" | Não alcançável pela interface | modal, toast | Fase 1: "CSV ou XLSX / colunas: nome, CPF/CNPJ, telefone, vínculo, placas / baixar modelo"; área "Arraste a planilha ou toque para escolher", "simular com terceiros-safra.xlsx (demonstração)"; clicar na área passa à fase 2; "baixar modelo" gera toast "Modelo de planilha baixado: 6 colunas, uma linha por terceiro." Fase 2: três contadores fixos "37" "novos, prontos para entrar", "4" "duplicados, serão reaproveitados", "2" "com erro, ficam de fora"; 5 linhas de amostra com nome, documento e chip ("novo", "reaproveitado", "erro"; ex.: "Ederson Palma", "CPF ***.402.118-** / TAC", "novo"); nota "Duplicidade detectada por CPF, CNPJ e placa. Erros: CPF inválido na linha 12, telefone ausente na linha 29."; botões "Cancelar" e "Importar 41 terceiros". Confirmar fecha e mostra toast "41 terceiros importados: 37 novos como Pré-cadastrados, 4 reaproveitados. Convites em massa disponíveis." Nenhuma linha é adicionada. |
| Modal "Suspender {nome}" | Aberto por "Suspender manualmente…" | modal, toast | Texto: "suspensão manual é decisão registrada: motivo, responsável, vigência. Viagens futuras deste terceiro bloqueiam na hora." Campos obrigatórios: "MOTIVO PADRONIZADO *" (escolha única entre "Ocorrência grave em apuração", "Determinação da Qualidade", "Solicitação do próprio terceiro", "Pendência contratual com a Diretoria") e "VIGÊNCIA *" ("até regularizar", "30 dias", "90 dias"). Linha fixa "Responsável e assinatura" "Rafael Antunes / Gestor". Botões "Cancelar" e "Suspender e registrar" (desabilitado até motivo e vigência). Ao confirmar: toast "{nome} suspenso por {vigência}. Registro com motivo, responsável e hora; viagens futuras bloqueiam já." O estado da linha e o funil não mudam. Não há campo de observação. |
| Esc | Global | fecha popovers e modais do avatar | Não fecha drawer nem os modais de cadastro, convite, importação e suspensão. |

## Estados e simulações
- Loading: não há skeleton; a animação `txsh` está declarada no CSS e não é usada.
- Vazio: quando busca ou filtro não retornam linhas, aparece ícone, "Nenhum terceiro neste filtro" e "Ajuste a busca ou o estado selecionado no funil acima." A paginação mostra "nenhum registro" apenas se houver mais de uma página, o que não ocorre com zero linhas.
- Erro: não há estado de erro de carregamento. Erros de formulário aparecem no modal "Cadastrar terceiro" (CNPJ incompleto, duplicidade) e por toast no convite.
- Simulações: o drawer tem duas variantes de conteúdo, "Lima" (estado Suspenso) e "todas as outras linhas". A duplicidade de CNPJ é simulada com dois CNPJs fixos. O modal de importação simula a leitura de "terceiros-safra.xlsx". Não há props nem toggles de cenário.

## Entidades e operações
- Terceiro (empresa ETC, TAC, agregado): consultar (lista, busca, filtro por estado, passaporte), criar (cadastro manual, convite, importação; todos só por toast), exportar (passaporte, por toast), arquivar (por toast), suspender (modal com motivo e vigência, por toast). Não há editar, excluir nem reativar. O estado não é editável.
- Estado de qualificação (9 valores): consultar e filtrar; não editável.
- Certificado GMP+: consultar (número, validade, sites, base pública), "Ver documento original" (toast). Não há upload nem edição.
- Acordo de qualidade: consultar, renovar (envio para assinatura, por toast).
- Conjunto/frota vinculada: consultar, vincular (toast sem formulário), desvincular (toast).
- Pendências do terceiro: consultar; reavaliar, enviar trilha, ver agenda de inspeção (todos por toast).
- Eventos do terceiro: consultar.
- Convite ao terceiro: criar (modal "Convidar terceiro" ou caixa "Já mandar o convite do portal"), copiar link.
- Trilha de treinamento: enviar (toast).
- Papel do usuário logado: trocar.

## Regras de negócio visíveis
- O estado deriva de fatos (certificado, acordo, trilhas, inspeções) e "nunca é editado à mão"; "Quem quiser mudar o estado, muda o fato."
- Os três caminhos de entrada (cadastro manual, convite, planilha) terminam em "Pré-cadastrado", que "não opera" e "não recebe viagem"; "A forma como o registro nasceu não muda o estado dele."
- No cadastro manual "Nenhum certificado é presumido"; o passo seguinte é o convite para anexar certificado, assinar acordo e concluir treinamento. Sem convite, a empresa "não consegue anexar certificado sozinha".
- Duplicidade checada pelos dígitos do CNPJ no cadastro manual; por CPF, CNPJ e placa na importação; por CPF no convite ("CPF repetido reaproveita o cadastro").
- Importação "Detecta duplicidade antes de gravar e não dispara convite sozinho."
- Não existe excluir; arquivar preserva histórico e dossiês.
- Suspensão manual exige motivo padronizado, vigência e responsável; bloqueia viagens futuras na hora.
- Certificado consultado automaticamente na base pública 2 vezes ao dia; suspensão na base pública recalcula o estado para Suspenso e bloqueia viagem (evento "VG-2490 bloqueada pelo motor", "derivado: subcontratado não apto").
- "Regra R-06: subcontratado apto deriva do certificado. Sem edição manual."
- Vínculo de conjunto nasce e termina com data; o histórico do compartimento fica com o conjunto.
- Link de convite vale 7 dias; acesso temporário por código para o "eventual de safra".
- O tipo de vínculo "muda o que será exigido".
- Preferência "Bloqueio técnico na filial" não pode ser desligada.
- Papéis: ninguém assina acima do próprio nível; nível 0 é técnico.

## Observações factuais
- A opção "Importar planilha" do modal "Adicionar terceiro" chama um método inexistente (`toastImportar`); o modal de importação, com as duas fases, não é alcançável por nenhum elemento.
- Cadastro manual, convite, importação, suspensão, arquivamento, vincular e desvincular só produzem toast; a lista, o funil e o drawer não mudam.
- Os números do funil (184, 6, 8, 4, 3, 3, 2, 1, 1) são fixos e não correspondem às 10 linhas do mock (ex.: filtro "Apto" mostra 2 linhas com chip 184).
- O drawer tem conteúdo específico só para Lima Logística; todas as outras 9 linhas mostram os mesmos selos, os mesmos conjuntos ("QBB 4D18", "QCF 9E44"), os mesmos eventos e as mesmas pendências, independente do estado. Ex.: Pantanal Granéis (Bloqueado) aparece com ✓ "grãos e farelos" e "operação Gatekeeper"; João Bortolini (TAC, "ele mesmo") mostra "10" motoristas ativos.
- Número do certificado "GMP059814" e "sites cobertos" "matriz Sorriso + filial Rondonópolis" são iguais para todos, inclusive TACs cujo certificado é "condição Gatekeeper".
- "válido até" no drawer ("19 set 2027") difere do "VÁLIDO ATÉ" da linha para todos exceto Cerrado Cargas (ex.: João Bortolini "02 fev 27", Transrocha "18 ago").
- O bloco "Frota e motoristas vinculados" lista só conjuntos; nenhum motorista aparece.
- Coluna "VÁLIDO ATÉ" mistura datas e textos ("suspenso", "aguarda trilha", "em cadastro", "inspeção 8 ago").
- Para AgroLima a coluna "CERTIFICADO / ACORDO" mostra "acordo vence em 27 dias" na linha do certificado.
- Os CNPJs usados para simular duplicidade (08.441.220/0001-73 Lima, 42.118.556/0001-09 Transrocha) diferem dos CNPJs das mesmas empresas na lista (08.412.977/0001-31 e 21.007.554/0001-90). Os CNPJs da simulação coincidem com os de Acessos Externos (onde 08.441.220/0001-73 aparece tanto para Lima Logística quanto para AgroLima Ltda).
- O placeholder da busca promete "placa" e "telefone", mas a busca compara só nome, documento e vínculo; CPFs estão mascarados no mock.
- O rodapé de paginação chama os registros de "empresas", embora a lista inclua TACs (pessoas físicas).
- Vínculos da lista ("ETC", "TAC", "agregado") não usam o mesmo vocabulário dos 7 tipos do cadastro manual ("Frota própria", "Agregado", "TAC autônomo", "Subcontratado certificado", "Subcontratado Gatekeeper", "Afretamento", "Cooperado"); "ETC" não está entre os 7. Motoristas usa 3 tipos ("Próprio", "Agregado", "Subcontratado") e o Onboarding Público usa 7 frases equivalentes às do cadastro manual.
- O cadastro manual só aceita CNPJ, embora ofereça o vínculo "TAC autônomo"; o convite não tem campo de CPF nem de vínculo.
- O modal "Convidar terceiro" fala em "o motorista abre um link", com destinatário "nome do destinatário"; o título é "Convidar terceiro". Canais: WhatsApp, SMS, QR Code no pátio; em Acessos Externos os canais são WhatsApp, E-mail, QR no pátio.
- O link do convite exibido é fixo, "traxium.app/c/RD-7K2M"; no Onboarding Público a URL é "traxium.com.br/convite/8f3a".
- Validade do link: "Vale por 7 dias" aqui; Acessos Externos diz "O convite expira em 14 dias se não for aceito."
- O botão "Enviar convite" tem sempre aparência habilitada e valida só por toast; o canal "QR Code no pátio" também exige telefone.
- Texto do modal de importação lista 5 colunas; o toast de "baixar modelo" fala em "6 colunas".
- O toast de "Arquivar" promete "reativação a um clique"; não existe ação de reativar.
- "Enviar trilha ou aviso" diz "Academy, em construção", e a sidebar tem link ativo para Academy.dc.html.
- "Exportar passaporte" e "Renovar acordo" aparecem no menu da linha e no rodapé do drawer, com textos de toast diferentes.
- O treinamento citado aqui é "Concluir trilha "Regimes de limpeza" (45 min)"; no Onboarding Público é "Um treinamento de 40 minutos".
- O acompanhamento dos convites enviados (enviado, aberto, aceito, expirado, revogado) não aparece nesta tela; ele está em Acessos Externos. O drawer não mostra se o terceiro tem acesso ao portal.
- Lima Logística: aqui a suspensão foi detectada em "4 ago, 06:12" e houve "Protocolo de renovação anexado" "pela própria Lima, via link" em "5 ago"; em Acessos Externos o portal da Lima foi "revogado em 3 ago".
- João Bortolini aparece aqui como TAC "Apto", "CPF ***.882.441-**"; em Acessos Externos como TAC com acesso ativo, "CPF 118.443.002-90", e no modal de convite como "J. Bortolini Transportes", "CNPJ 31.902.774/0001-40", "Pré-cadastrado"; em Motoristas como "Agregado" da "Cerrado Cargas S.A.", "CPF ***.772.901-**".
- Sindona Transportes: aqui "CNPJ 55.902.331/0001-14", "Pendente inspeção"; no convite de Acessos Externos "CNPJ 19.774.005/0001-22", "Pré-cadastrado".
- A placa "QAS 7C31" pertence aqui a um conjunto da Lima Logística; no Onboarding Público é a placa do cavalo de Ivan Prado.
- O modal de suspensão não limpa a vigência escolhida ao ser fechado por "Cancelar"; reabrir em outra linha mantém a vigência anterior.
- Sidebar desta tela tem o cartão "Safra 2026/27"; as sidebars de Acessos Externos e Motoristas não têm.
