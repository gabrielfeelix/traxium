# Onboarding público
Arquivo: Onboarding Publico.dc.html (data-screen-label "Onboarding público"; meta `design_doc_mode` "canvas"). Item da sidebar: "Onboarding público", no grupo inferior da sidebar das outras telas, com badge "6 passos"; a própria tela não tem sidebar. Perfil a quem se destina (pelo que a tela diz): o transportador ou motorista que recebe o link ("Onboarding público do transportador"; "Linguagem de quem dirige, não de quem audita"); na demonstração, Ivan Prado da Silveira convidado por "Cerrado Cargas". Objetivo declarado na tela: cadastro pelo celular, sem conta e sem senha, em seis passos: "Seu cadastro para levar carga de ração". Convenção: o separador ponto médio dos rótulos da interface é transcrito como barra (/).

## Entradas e saídas
- Como se chega: pelo item "Onboarding público" da sidebar de Subcontratados, Acessos Externos e Motoristas. Na narrativa da tela, pelo link recebido "por WhatsApp, QR ou link direto". Demais origens: ver mapa do site.
- Para onde leva: nenhum lugar. A tela não tem nenhum `href`, não tem sidebar e não tem botão de voltar. O script de shell tem uma função que injetaria "Voltar ao back-office" nesta tela, mas ela está comentada em `enhance()`. Nenhum botão "Começar", "Continuar", "Enviar cadastro", "Enviar meu certificado agora" ou "Fazer isso depois pelo WhatsApp" tem ação.

## Estrutura da tela
A página é uma prancha (canvas) com título, texto e 8 molduras de celular (393 x 812 px) lado a lado, numeradas de 0 a 7. Todas mostram a barra de endereço "traxium.com.br/convite/8f3a". As molduras 1 a 6 mostram barra de progresso de 6 segmentos (concluídos em verde, atual em degradê, futuros em cinza) e "Passo N de 6".

1. Cabeçalho da prancha. Título "Onboarding público do transportador". Texto: "O link chega por WhatsApp, QR ou link direto e abre no navegador do celular. Sem conta, sem senha, seis passos. Linguagem de quem dirige, não de quem audita. Os passos 2, 4, 5 e 6 são interativos: toque neles."
2. Moldura "0 / O LINK DO WHATSAPP". Logo Traxium. Cartão do convidante: avatar "CC", "Cerrado Cargas", "convidou você a transportar". Título "Seu cadastro para levar carga de ração". Texto "São seis perguntas sobre você, seu caminhão e as últimas cargas que ele levou. Leva uns seis minutos e não precisa de senha." Lista de 6 passos: "Seus documentos", "Como você trabalha", "O caminhão e as bocas", "As três últimas cargas", "A limpeza que foi feita", "As regras e sua assinatura". Botão "Começar". Nota "Pode parar no meio e voltar depois pelo mesmo link. O que você já respondeu fica guardado." Conteúdo fixo.
3. Moldura "1 / QUEM É VOCÊ" ("Passo 1 de 6", título "Quem é você"). 5 campos já preenchidos, todos com ✓ (não são inputs): "CPF" 842.115.330-07; "Nome completo" "Ivan Prado da Silveira" com dica "Puxamos do seu CPF. Confira se está certo."; "Número da CNH" 04829116370; "Categoria" E; "Vencimento da CNH" 14/03/2029. Aviso: "Seu CPF e sua CNH ficam guardados só para provar quem dirigiu em cada carga. Não vão para propaganda nem para terceiros." Botão "Continuar". Conteúdo fixo.
4. Moldura "2 / COMO VOCÊ TRABALHA / INTERATIVO" ("Passo 2 de 6", título "Como você trabalha", subtítulo "Escolha o que mais parece com a sua situação. Isso muda o que vamos pedir depois."). 7 opções de escolha única, com título e descrição: "Sou da frota da empresa" ("o caminhão é da transportadora que te chamou"), "Sou agregado" ("caminhão seu, rodando fixo para uma empresa"), "Sou autônomo, TAC" ("caminhão seu, você pega frete de quem aparecer"), "Tenho empresa com certificado GMP+" ("sua transportadora já é certificada"), "Tenho empresa, sem certificado" ("você roda sob a certificação de quem contrata"), "Faço afretamento" ("você contrata outros para levar a carga"), "Sou de cooperativa" ("a cooperativa responde pelo seu vínculo"). Dica acima do botão muda conforme a escolha. Botão "Continuar" muda de aparência (cinza sem escolha, degradê com escolha). Reage ao estado.
5. Moldura "3 / O CAMINHÃO" ("Passo 3 de 6", título "O caminhão"). "Placa do cavalo" QAS 7C31 com nota "O cavalo só puxa. O histórico da carga não fica nele."; "Placa da carreta" SQT 7D22; "Que tipo de carreta": chips "Graneleiro" (selecionado), "Tanque", "Baú", "Caçamba"; "Quantas bocas ela tem": contador "−" 2 "+" com rótulo "compartimentos"; aviso "Cada boca guarda o próprio histórico. Se uma levou calcário e a outra levou milho, elas não são iguais para a próxima carga." Botão "Continuar". Conteúdo fixo; chips e contador não respondem a clique.
6. Moldura "4 / AS TRÊS ÚLTIMAS CARGAS / INTERATIVO" ("Passo 4 de 6 / boca 1 de 2", título "O que essa boca levou nas últimas 3 viagens", subtítulo "É a pergunta mais importante do cadastro. O que veio antes decide o que pode subir agora."). 3 cartões: "Última" / "a que saiu agora" / "Milho a granel" (fixo); "Antes dela" / "a viagem anterior" / "Casca de soja" (fixo); "Mais atrás" / "a terceira de trás para frente" / "toque para escolher" com 5 chips: "Farelo de soja", "Milho", "Calcário", "Ureia pecuária", "Não lembro". Aviso âmbar dinâmico. Botão com texto "Falta a terceira carga" (cinza) ou "Continuar" (degradê). Reage ao estado. Só a boca 1 é mostrada.
7. Moldura "5 / A LIMPEZA / INTERATIVO" ("Passo 5 de 6", título "Depois da última carga, o que você fez na boca", subtítulo "Sem julgamento. Responder certo aqui evita você chegar no pátio e não poder carregar."). 5 opções de escolha única: "Só varri e soprei" ("sem água", letra A), "Lavei com água" ("mangueira ou jato, sem produto", B), "Lavei com água e detergente" ("produto próprio para alimento", C), "Lavei e desinfetei" ("em estação, com comprovante", D), "Não fui eu que fiz" ("ou não sei dizer o que foi feito", sem letra). Aviso dinâmico (fundo âmbar para "Não fui eu que fiz", verde-água nos demais). Botão "Continuar" muda de aparência. Reage ao estado.
8. Moldura "6 / AS REGRAS E O ACEITE / INTERATIVO" ("Passo 6 de 6", título "As regras da carga de ração"). 4 cartões de regra com ícone: "Carga de ração é comida de animal", "Você nunca libera uma carga travada", "Foto é pela câmera do app", "Sem sinal também funciona", cada um com explicação. Caixa de aceite "Li e entendi as regras acima, e sei que informação errada aqui pode contaminar ração de animal." Área "Sua assinatura": vazia mostra "Toque para assinar com o dedo"; assinada mostra traço de assinatura e "Ivan Prado / 6 ago, 09:14". Dica dinâmica e botão "Enviar cadastro" que muda de aparência. Reage ao estado.
9. Moldura "7 / O QUE ACONTECE DEPOIS". Ícone ✓ e "Cadastro enviado". Card "SUA SITUAÇÃO AGORA": "Pré-cadastrado", "Isso ainda não libera carga. É honesto dizer agora em vez de te deixar viajar até o pátio para descobrir lá." Seção "O QUE FALTA PARA VOCÊ CARREGAR" com 3 itens numerados: "O certificado da sua empresa" ("ou o aviso de que você roda sob a certificação de quem contrata. Conferimos direto na base da certificadora."), "O acordo de qualidade assinado" ("um documento curto com as regras de segurança da ração. Chega no seu WhatsApp para assinar pelo celular."), "Um treinamento de 40 minutos" ("no celular, pode parar e voltar. Sem ele você não aparece como disponível para carga de ração."). Nota: "Ninguém vai marcar você como apto na mão. Assim que as três coisas acima existirem, o sistema recalcula sozinho e a Cerrado Cargas já pode te chamar." Botões "Enviar meu certificado agora" e "Fazer isso depois pelo WhatsApp". Conteúdo fixo, não reage às escolhas dos passos anteriores.

## Ações
| Elemento | Onde | O que acontece | Detalhe |
| --- | --- | --- | --- |
| "Começar" | Moldura 0 | nada | Sem handler. |
| "Continuar" | Molduras 1 e 3 | nada | Sem handler; aparência sempre ativa. |
| Opção de vínculo (7) | Moldura 2 | muda estado | Seleciona uma opção. Dica: sem escolha "Escolha uma opção para continuar." (âmbar); "Tenho empresa, sem certificado" mostra "Sem certificado próprio você roda sob a certificação de quem contrata, e vamos pedir um treinamento a mais no fim."; "Tenho empresa com certificado GMP+" mostra "Vamos pedir o número do seu certificado GMP+ e conferir na base da certificadora."; demais "Certo. O que pedimos daqui para frente segue essa escolha." |
| "Continuar" | Moldura 2 | nada (muda só a aparência) | Fica em degradê quando há escolha; sem handler. |
| Chip de produto da terceira carga (5) | Moldura 4, cartão "Mais atrás" | muda estado | Seleciona o produto; "Ureia pecuária" e "Não lembro" ficam em vermelho quando escolhidos. Aviso: "Ureia pecuária é carga pesada de resolver. Não tem problema ter levado, mas a próxima carga de ração vai exigir procedimento antes de subir."; "Não lembro" gera "Sem saber o que veio antes, essa boca não recebe carga sensível até alguém inspecionar. Não lembrar é resposta válida, e é melhor que chutar."; demais "Pronto. Com as três cargas, o sistema já sabe dizer o que essa boca pode receber e que limpeza pedir." Sem escolha: "Se não lembrar de alguma, marque "não lembro". Chutar aqui é pior do que não saber." |
| Botão inferior | Moldura 4 | nada (muda texto e aparência) | "Falta a terceira carga" sem escolha; "Continuar" com escolha. Sem handler. |
| Opção de limpeza (5) | Moldura 5 | muda estado | Seleciona. Aviso: sem escolha "Escolha o que foi feito. Cada nível de limpeza libera cargas diferentes."; "Não fui eu que fiz" gera "Sem saber a limpeza, a boca entra como não verificada e vai precisar de inspeção no pátio antes de carregar."; "Lavei e desinfetei" gera "Desinfecção é o nível mais alto. Vamos pedir o comprovante da estação depois, sem pressa agora."; demais "Anotado. Se a próxima carga pedir mais que isso, avisamos antes de você sair." |
| "Continuar" | Moldura 5 | nada (muda só a aparência) | Sem handler. |
| Caixa de aceite | Moldura 6 | muda estado | Marca e desmarca. |
| Área de assinatura | Moldura 6 | muda estado | Alterna entre assinado e não assinado (não há desenho real). |
| "Enviar cadastro" | Moldura 6 | nada (muda texto da dica e aparência) | Dica: "Marque que você leu as regras." / "Falta assinar com o dedo." / "Tudo certo. Seu cadastro vai para a Cerrado Cargas com data e hora." Botão ativo só com aceite e assinatura, mas sem handler; não leva à moldura 7. |
| "Enviar meu certificado agora" | Moldura 7 | nada | Sem handler. |
| "Fazer isso depois pelo WhatsApp" | Moldura 7 | nada | Sem handler. |

Não há modais, drawers, toasts, busca, filtros, exportação nem menus nesta tela.

## Estados e simulações
- Loading: não há.
- Vazio: não há estado vazio; os estados "não escolhido" dos passos 2, 4, 5 e 6 mostram dicas e botões cinza.
- Erro: não há mensagem de erro; CPF, CNH e placas não são editáveis nem validados.
- Simulações: as 8 molduras mostram o fluxo inteiro ao mesmo tempo; cada moldura simula um passo. Estado inicial: nenhum vínculo, terceira carga vazia, nenhuma limpeza, aceite desmarcado, não assinado. Não há props nem toggles; não há variação por tipo de vínculo nos passos seguintes.

## Entidades e operações
- Motorista/transportador (pessoa): criar (narrativa do cadastro; nada é gravado), dados exibidos CPF, nome, CNH, categoria, vencimento.
- Vínculo (tipo de relação com a contratante): escolher entre 7 tipos.
- Conjunto/veículo: exibir placa do cavalo, placa da carreta, tipo de carreta, número de compartimentos (não editáveis).
- Compartimento (boca): informar T-3 (só a terceira carga é escolhível) e limpeza após a última carga.
- Regras e aceite: aceitar e assinar.
- Estado de qualificação: exibir "Pré-cadastrado" ao final.
- Pendências (certificado, acordo, treinamento): consultar.
- Convite: a tela é o destino do convite; não cria, reenvia nem revoga convite.

## Regras de negócio visíveis
- Sem conta e sem senha; o link abre no navegador do celular; pode parar e voltar pelo mesmo link com respostas guardadas.
- O nome é "puxado" do CPF.
- CPF e CNH são guardados para provar quem dirigiu cada carga (finalidade declarada, LGPD).
- O tipo de vínculo muda o que será pedido depois; sem certificado próprio, o transportador roda sob a certificação de quem contrata e terá treinamento a mais; com certificado, o número será conferido na base da certificadora.
- O histórico de carga fica na carreta e em cada boca (compartimento), não no cavalo.
- As três últimas cargas (T-3) de cada boca decidem o que pode subir; "Não lembro" é resposta válida e faz a boca não receber carga sensível até inspeção; "Ureia pecuária" exige procedimento antes da próxima carga de ração.
- Os níveis de limpeza A, B, C, D correspondem a varrer e soprar, lavar com água, lavar com água e detergente, lavar e desinfetar; limpeza desconhecida deixa a boca "não verificada" e exige inspeção no pátio; desinfecção exige comprovante da estação.
- O motorista nunca libera carga travada; quem libera é a qualidade da empresa.
- Foto de evidência só pela câmera do app, não da galeria.
- O app funciona sem sinal e sincroniza depois.
- O envio exige aceite das regras e assinatura.
- Ao final o estado é "Pré-cadastrado", que não libera carga; a aptidão depende de certificado (ou condição de rodar sob a certificação da contratante), acordo de qualidade assinado e treinamento de 40 minutos; o sistema recalcula sozinho e ninguém marca apto à mão.

## Observações factuais
- A tela não tem nenhuma navegação de saída: sem sidebar, sem link e sem "voltar"; o botão "Voltar ao back-office" do shell está desativado.
- Nenhum botão de avanço tem ação; os passos não se encadeiam, e "Enviar cadastro" não gera estado, toast nem transição para a moldura 7.
- O cabeçalho diz "seis passos" e o badge da sidebar diz "6 passos"; a prancha tem 8 molduras (0 a 7), sendo 6 de perguntas.
- O cabeçalho diz que os passos 2, 4, 5 e 6 são interativos; os passos 1 e 3 são fixos (campos preenchidos, chips e contador sem resposta).
- O passo 4 indica "boca 1 de 2", e não existe tela para a boca 2; o passo 5 pergunta a limpeza sem indicar qual boca.
- No passo 4 só a terceira carga é escolhível; as duas primeiras são fixas ("Milho a granel", "Casca de soja"). A lista de opções usa "Milho" enquanto a carga fixa é "Milho a granel".
- As dicas do passo 2 prometem pedidos que nenhum passo seguinte faz: "vamos pedir um treinamento a mais no fim" e "Vamos pedir o número do seu certificado GMP+". Os passos 3 a 7 são iguais para qualquer vínculo escolhido, inclusive "Sou da frota da empresa" e "Faço afretamento"; a moldura 7 pede "O certificado da sua empresa" a todos.
- Os rótulos da lista da moldura 0 diferem dos títulos dos passos: "Seus documentos" vs. "Quem é você"; "O caminhão e as bocas" vs. "O caminhão"; "A limpeza que foi feita" vs. "Depois da última carga, o que você fez na boca"; "As regras e sua assinatura" vs. "As regras da carga de ração".
- O convidante é "Cerrado Cargas", que em Subcontratados é uma transportadora terceira (ETC, Apto). Em Acessos Externos a mensagem de convite diz "A Transrural Log convidou você", e em Motoristas a empresa de frota própria é "Transrural Log Ltda".
- A URL do convite é "traxium.com.br/convite/8f3a"; em Subcontratados o link é "traxium.app/c/RD-7K2M".
- O treinamento é "de 40 minutos" aqui; em Subcontratados a pendência é "Concluir trilha "Regimes de limpeza" (45 min)".
- O passo 1 não pede telefone, e-mail nem foto da CNH; o modal "Convidar terceiro" de Subcontratados descreve o fluxo como "informa CPF, CNH, placas e T-3, e assina o aceite".
- Não há passo para anexar certificado, assinar o acordo de qualidade ou iniciar treinamento; esses itens aparecem só como pendências na moldura 7.
- A assinatura registrada é "Ivan Prado / 6 ago, 09:14". Em Acessos Externos, Ivan Prado (AC-121, "motorista da Cerrado Cargas", mesmo CPF 842.115.330-07) tem convite enviado, aberto e aceito em 28 jul. Em Motoristas, "Ivan Prado da Silveira" é "Próprio" da "Transrural Log Ltda" desde 12 fev 2022, "Elegível", com CNH E e vencimento 14/03/2029 iguais aos desta tela.
- A placa do cavalo "QAS 7C31" é, em Subcontratados, de um conjunto da Lima Logística ("QAS 7C31 + SQT 9E18").
- O estado final "Pré-cadastrado" é o mesmo dos três caminhos de entrada de Subcontratados; em Motoristas o cadastro manual gera o estado "Pendente".
- A tela não tem tema escuro (excluída no shell) nem menu de perfil.
