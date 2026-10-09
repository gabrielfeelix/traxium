# Compartimento C1 / SQT 9E18 (detalhe do compartimento)
Arquivo: `Compartimento Detalhe.dc.html`. Item da sidebar: nenhum item destacado (todos os itens, inclusive "Ativos e frota", aparecem como links comuns); o breadcrumb indica pertencer a "Ativos e frota". Perfil a quem se destina (pelo que a tela diz): não declarado; o usuário logado no mock é Rafael Antunes, "Gestor de qualidade / GMP+"; o modal de limpeza fala em "registro retroativo pela mesa". Objetivo declarado na tela: subtítulo "graneleiro / Lima Logística (subcontratado) / a unidade de controle é o compartimento, não a placa".

## Entradas e saídas
- Como se chega: de `Ativos e Frota.dc.html` (links "abrir →" de cada compartimento na linha expandida e botão "Abrir histórico"); de `Inspecoes.dc.html` (botão "Ver o compartimento" em cada inspeção expandida). Demais origens: ver mapa do site.
- Para onde leva:
  - Breadcrumb "‹ Ativos e frota" → `Ativos e Frota.dc.html`; breadcrumb "SQT 9E18" → `Ativos e Frota.dc.html`; "C1" é texto.
  - Card "Histórico de cargas": código de viagem de cada carga (ex.: "VG-2455 →") → `Viagem Detalhe.dc.html` (6 links, mesmo destino).
  - Sidebar: mesmos 17 destinos da sidebar canônica ("Torre de Controle" → `Torre de Controle v2.dc.html`, "Viagens", "Exceções e liberações", "Inspeções", "Limpezas", "Motor IDTF", "Subcontratados", "Motoristas", "Acessos externos", "Academy", "Ativos e frota" → `Ativos e Frota.dc.html`, "Dossiê de auditoria", "Indicadores", "Não conformidades", "Configurações", "Onboarding público", "Protótipo mobile").

## Estrutura da tela
1. Sidebar canônica sem item ativo. Mesmos badges das demais telas (Torre 7, Exceções 5, Inspeções 3, Limpezas 3, Motoristas 42, Acessos externos 2, Indicadores 11/15, Não conformidades 4, Onboarding 6 passos, Protótipo mobile 12 telas). Card de rodapé "Base IDTF Brasil": "v2026.07 vigente", "Revisada em 28 jul / Qualidade". Fixo.
2. Cabeçalho: breadcrumb "Ativos e frota › SQT 9E18 › C1"; título "Compartimento C1 / SQT 9E18"; chip verde "registros íntegros" (fixo); subtítulo citado acima. À direita: botão "Verificar integridade" (ícone de cadeado), botão "Exportar histórico", avatar "RA" com menu de perfil.
3. Skeleton de carregamento (900 ms): 3 cartões com barras shimmer na coluna principal e 1 cartão no rail.
4. Coluna principal, card "Histórico de cargas". Subtítulo "as três mais recentes formam o T-3 vigente"; chip fixo "T-3 completo". Linha do tempo com 6 cargas fixas. Campos por carga: tag de posição ("T-1", "T-2", "T-3", ou mês "jul"/"jun" para as antigas), quadrado de regime (A ou B), produto, data, "descarga em <destino>", link da viagem. Exemplo: "T-1 / B / Milho a granel / 31 jul / descarga em Uberlândia MG / VG-2455". Demais: T-2 "Casca de soja peletizada" 24 jul Rio Verde GO VG-2412 regime A; T-3 "Farelo de soja" 18 jul Chapecó SC VG-2381 A; "Sorgo granífero" 10 jul Uberaba MG VG-2344 A; "Milheto" 28 jun Goiânia GO VG-2301 A; "Soja em grãos" 15 jun Rondonópolis MT VG-2260 A. Rodapé fixo: "Com o T-3 vigente (milho, casca de soja, farelo de soja), a próxima carga de **farelo de soja** exige **regime B**. Quando a VG-2490 concluir, ela entra como T-1 e o T-3 recalcula." Não reage a nada.
5. Coluna principal, card "Limpezas registradas". Link "Registrar limpeza →". 3 itens no mock (mais a registrada na sessão, no topo). Campos: regime (quadrado), método, "quando / executante", pill de situação. Exemplo: "B / Água sob pressão / 5 ago, 17:40 / Estação Higitrans / Sorriso MT / comprovante pendente". Demais: "A / Varrição e sopro (limpeza seca) / 24 jul, 08:15 / pátio próprio / Milton Costa / completa / 4 de 4"; "A / Varrição e sopro (limpeza seca) / 18 jul, 07:50 / pátio próprio / Paulo Lima / completa / 4 de 4". Rodapé: "Regime A pede 4 campos; regime D pede 19. Carga anterior proibida não tem botão de "lavado": exige procedimento formal." Cada linha abre o drawer de registro.
6. Coluna principal, card "Inspeções realizadas". 3 itens fixos. Campos: avatar com anel, título, "quando / quem / N fotos", pill de resultado. Exemplos: "Inspeção pré-carregamento / VG-2490 / 5 ago, 19:05 / Jorge Mattos / 6 fotos / aprovada"; "Retificação / resíduo removido / 24 jul, 10:30 / Jorge Mattos / 6 fotos / aprovada"; "Inspeção pré-carregamento / VG-2412 / 24 jul, 08:40 / Jorge Mattos / 6 fotos / reprovada / item crítico". Rodapé: "Inspeção enviada não se edita. A reprovação de 24 jul segue no histórico; a correção entrou como evento novo." Cada linha abre o drawer de registro.
7. Rail, card "Ficha do implemento" (fixo): "Implemento: SQT 9E18 / graneleiro"; "Compartimentos: 2 / C1 e C2, T-3 independentes"; "Capacidade do C1: 19 t"; "Material: alumínio naval"; "Conservação: boa / inspeção 5 ago" (verde); "Proprietário hoje: Lima Logística". Rodapé: "O vínculo de propriedade depende da data: uma viagem de maio aponta para quem era dono em maio." Sem ações.
8. Rail, card "Integridade da cadeia". Indicador à direita: "íntegra" ou, após verificar, "verificada agora" (sempre verde). Subtítulo "cada registro carrega o hash do anterior". 4 blocos fixos (título, hora, hash ← hash anterior): "Inspeção aprovada / 5 ago, 19:12 / a3f8…9c2e ← 7b10…44d1"; "Limpeza B registrada / 5 ago, 17:41 / 7b10…44d1 ← c95a…e770"; "Fechamento VG-2455 (vira T-1) / 31 jul, 16:02 / c95a…e770 ← 2d4f…a18b"; "Retificação da inspeção / 24 jul, 10:32 / 2d4f…a18b ← 90bc…f532". Rodapé: "Alterar ou remover qualquer registro quebra a cadeia visivelmente. É isso que sustenta o dossiê em auditoria."
9. Toast inferior (some após 3,8 s).

## Ações
| Elemento | Onde | O que acontece | Detalhe |
|---|---|---|---|
| "Verificar integridade" | Cabeçalho | muda estado + toast | Rótulo do card Integridade passa de "íntegra" para "verificada agora". Toast "Cadeia verificada: 214 registros, nenhuma quebra. Hash raiz confere com o carimbo de 5 ago." |
| "Exportar histórico" | Cabeçalho | toast | "Histórico do C1 exportado: cargas, limpezas, inspeções e hashes, com carimbo de 6 ago." Sem arquivo. |
| Avatar "RA" | Cabeçalho | popover | "Meu perfil", "Preferências e notificações", "Papel ativo", "Sair" (iguais às outras telas). |
| Breadcrumb "Ativos e frota" e "SQT 9E18" | Cabeçalho | navegação | `Ativos e Frota.dc.html`. |
| Link "VG-xxxx →" | Histórico de cargas | navegação | `Viagem Detalhe.dc.html` (mesmo destino para as 6). |
| "Registrar limpeza →" | Limpezas registradas | modal | Abre "Registrar limpeza" com campos zerados. |
| Linha de limpeza | Limpezas registradas | drawer | Abre drawer "REGISTRO DE LIMPEZA / C1". |
| Linha de inspeção | Inspeções realizadas | drawer | Abre drawer "REGISTRO DE INSPEÇÃO / C1". |
| "↓" em cada evidência | Drawer | toast | "<arquivo> baixado com hash conferido e carimbo de 6 ago." |
| "Baixar registro completo" | Drawer | toast | "Registro completo baixado: campos, evidências e hashes num pacote lacrado." |
| "Iniciar retificação" | Drawer | fecha drawer + toast | "Retificação iniciada: o registro original fica intacto; a correção entra como evento novo com justificativa obrigatória." Não abre formulário. |
| "Recolher menu" | Sidebar | muda estado | Alterna largura; persiste em `localStorage`. |

Drawer **Registro** (lateral direita, 520 px, compartilhado entre limpeza e inspeção). Cabeçalho: tipo ("REGISTRO DE LIMPEZA / C1" ou "REGISTRO DE INSPEÇÃO / C1"), título e subtítulo. Bloco "Campos do registro" (somente leitura):
- Limpeza: título "Limpeza <regime> / <método>"; campos "regime executado", "executante", "data e hora", "situação", "campos exigidos" ("4 de 4 preenchidos" para A, "7 de 7 preenchidos" para os demais). Evidências: "Evidências (4)" para A com antes-c1.jpg, durante-c1.jpg, depois-c1.jpg, bica.jpg; "Evidências (7)" para os demais, com esses 4 mais carimbo-estacao.pdf e nota-servico.pdf.
- Inspeção: título igual ao item; subtítulo "<quando> / <quem> / resultado: <resultado>"; campos "inspetor" ("Jorge Mattos / trilha 6 vigente"), "data e hora", "resultado", "checklist" ("8 itens / 3 críticos"), "GPS" ("-16.4673, -54.6372 / pátio Rondonópolis"). "Evidências (6)": frente.jpg, fundo.jpg, lateral-e.jpg, lateral-d.jpg, bica.jpg, teto.jpg.
Texto "hash conferido em cada arquivo". Miniaturas hachuradas com ícone de câmera. Botões "Baixar registro completo" e "Iniciar retificação". Nota: "Registro enviado não se edita. Retificar cria um evento novo apontando para este, com autor, hora e justificativa." Fecha pelo "✕" ou clique no fundo. Sem campos editáveis.

Modal **Registrar limpeza** (chip "C1 / SQT 9E18"). Texto: "registro retroativo pela mesa: o normal nasce no app do pátio. Retroativo exige justificativa e fica marcado assim." Campos:
- "REGIME EXECUTADO" (obrigatório, 4 cartões): "A" seca, "B" água, "C" detergente, "D" desinfecção.
- "QUEM EXECUTOU" (obrigatório, radio): "Estação Higitrans / Sorriso MT" ("credenciada até regime D"), "LavaMax BR-364" ("credenciada até regime D"), "Pátio próprio" ("somente regimes A e B").
- "JUSTIFICATIVA DO REGISTRO RETROATIVO" (obrigatório, texto, placeholder "ex.: app sem sinal no pátio; comprovante em papel anexado"). Validação: mínimo 15 caracteres; dica abaixo alterna entre "Justificativa obrigatória (mínimo 15 caracteres)." e "Justificativa ok. O registro fica marcado como retroativo, com autor e hora reais."
Botões "Cancelar" e "Registrar como retroativo" (desabilitado até os três campos válidos). Ao confirmar: fecha; insere no topo de "Limpezas registradas" um item com o regime escolhido, método correspondente (A "Varrição e sopro (limpeza seca)", B "Água sob pressão", C "Água + detergente qualificado", D "Desinfecção com agente aprovado"), "hoje, agora", executante, pill "retroativa / justificada"; toast "Limpeza <regime> registrada como retroativa por Rafael Antunes. O motor já considera o novo regime." Um novo registro substitui o anterior criado na sessão (só um item novo é mantido).

Modais do perfil (iguais às outras telas): **Meu perfil** (leitura), **Preferências e notificações** (4 interruptores, o primeiro travado), **Papel ativo** (5 papéis, toast na troca), **Sair da conta** (toast, sem navegação).

## Estados e simulações
- Loading: skeleton com shimmer por 900 ms na montagem (`state.loading`), depois o conteúdo.
- Empty states: não há textos de vazio; as listas são fixas.
- Erro: nenhum estado de erro; o único estado de validação é o botão desabilitado e a dica da justificativa no modal de limpeza.
- Estado "verificada agora" no card Integridade após o clique em "Verificar integridade".
- Sem props de simulação declaradas.
- Esc fecha popovers e modais do perfil; não fecha o drawer nem o modal de limpeza.

## Entidades e operações
- Compartimento (C1 do implemento SQT 9E18): consultar; exportar histórico (toast).
- Carga / T-3: consultar; navegar para a viagem.
- Limpeza: consultar registro e evidências; criar registro retroativo; baixar evidência e registro (toast); retificar (toast).
- Inspeção: consultar registro e evidências; baixar (toast); retificar (toast).
- Implemento: consultar ficha.
- Proprietário / vínculo: consultar ("Proprietário hoje").
- Cadeia de integridade (hashes): consultar; verificar.
- Perfil / papel: consultar, trocar papel, preferências, sair.

## Regras de negócio visíveis
- A unidade de controle é o compartimento, não a placa; C1 e C2 têm T-3 independentes.
- As três cargas mais recentes formam o T-3 vigente; uma viagem concluída entra como T-1 e o T-3 recalcula.
- Com T-3 milho, casca de soja, farelo de soja, a próxima carga de farelo de soja exige regime B.
- Regime A pede 4 campos; regime D pede 19.
- Carga anterior proibida não tem botão "lavado": exige procedimento formal.
- Registro normal de limpeza nasce no app do pátio; registro pela mesa é retroativo, exige justificativa (mínimo 15 caracteres) e fica marcado como retroativo, com autor e hora reais.
- Executantes têm credenciamento por regime ("credenciada até regime D", "somente regimes A e B").
- Inspeção ou registro enviado não se edita; correção entra como evento novo (retificação) com autor, hora e justificativa.
- Cada registro carrega o hash do anterior; alterar ou remover quebra a cadeia visivelmente.
- O vínculo de propriedade depende da data: viagem antiga aponta para o dono da época.

## Observações factuais
- A tela é fixa em "Compartimento C1 / SQT 9E18": qualquer link de compartimento vindo de `Ativos e Frota.dc.html` (C1, C2 de qualquer conjunto) e qualquer "Ver o compartimento" de `Inspecoes.dc.html` (inclusive o tanque T1 RTB 5J18) abre este mesmo conteúdo.
- Nenhum item da sidebar fica destacado nesta tela.
- O modal de limpeza não impede combinar "Pátio próprio" ("somente regimes A e B") com regime C ou D.
- Ao registrar limpeza com regime C ou D, o quadrado de regime do novo item fica sem cor de fundo e de texto (o mapa de cores da tela só tem A e B).
- Registrar limpeza adiciona o item à lista, mas não cria bloco no card "Integridade da cadeia", não muda o rodapé do T-3 e não altera o chip "registros íntegros". O toast diz que "O motor já considera o novo regime".
- O toast da limpeza retroativa cita sempre "Rafael Antunes", independente do papel ativo escolhido.
- No drawer de limpeza de regime diferente de A, o título diz "Evidências (7)" e são listados 6 arquivos; "campos exigidos" mostra "7 de 7 preenchidos" para B, C ou D, enquanto o rodapé do card diz que regime D pede 19 campos.
- "Exportar histórico", "Baixar registro completo", download de evidência e "Iniciar retificação" só mostram toast; a retificação apenas fecha o drawer.
- "Verificar integridade" muda o rótulo para "verificada agora" na mesma cor verde; o chip "registros íntegros" do cabeçalho é fixo.
- Toast de verificação fala em "214 registros"; o card mostra 4 blocos; `Ativos e Frota.dc.html` mostra "212 registros" de histórico no cadastro da Lima (QAS 7C31).
- A inspeção "Inspeção pré-carregamento / VG-2490", 5 ago 19:05, Jorge Mattos, aprovada, com hash a3f8…9c2e no card de integridade, aparece em `Inspecoes.dc.html` como INS-4470 do "C1 / SQT 3A90", mesmo horário e mesmo hash.
- O hash 7b10…44d1 é da "Limpeza B registrada" nesta tela e da inspeção INS-4465 (tanque RTB 5J18) em `Inspecoes.dc.html`.
- O rodapé do T-3 diz que a VG-2490 ainda vai concluir e entrar como T-1; a lista "Inspeções realizadas" já mostra a inspeção pré-carregamento da VG-2490 como aprovada.
- A linha do Histórico de cargas da carga T-1 (Milho a granel, VG-2455) mostra regime B; a ficha "Limpezas registradas" mostra a limpeza B mais recente com "comprovante pendente".
- Em `Ativos e Frota.dc.html` o C2 do SQT 9E18 está travado por ureia pecuária no T-1; a "Ficha do implemento" aqui não menciona o estado do C2.
- O cabeçalho do drawer de inspeção desta tela diz "REGISTRO DE INSPEÇÃO / C1"; o de `Inspecoes.dc.html` inclui a placa ("REGISTRO DE INSPEÇÃO / C1 / QAS 7C31"). O botão de download completo aqui é "Baixar registro completo"; lá é "Baixar tudo →". O drawer de lá tem "Ver no dossiê"; este não tem.
- Texto do toast de retificação idêntico ao de `Inspecoes.dc.html` ("Retificação iniciada: o registro original fica intacto; ...").
- Cartão de rodapé da sidebar mostra "Base IDTF Brasil", diferente do cartão de `Ativos e Frota.dc.html` ("Rede de ativos") e de `Inspecoes.dc.html` ("Checklist vigente").
- Listas sem paginação: 6 cargas, 3 limpezas, 3 inspeções, 4 blocos de cadeia.
- O código contém uma chave vazia `_insDummy` não usada no markup.
- Nas citações deste inventário, o ponto médio usado como separador na interface foi transcrito como barra (/).
