# Revisão do MVP: o fluxo mínimo fecha?

Revisão de 17/11/2026 sobre o app Next.js da raiz (branch `fix/ux-fase-1-3`, commit `7956634`), servidor em `http://localhost:3000`, semente versão 10 (dia da demonstração: 08/10/2026). Cada perfil foi percorrido no navegador fazendo o trabalho de fato (criar, enviar, conferir, registrar, pedir, liberar, manter, conciliar, auditar), com Playwright e sessão trocada por `tx-v2-sessao`. Capturas em `/tmp/claude-1000/revisao-mvp/` (citadas pelo nome do arquivo). Nenhum código foi alterado.

Pergunta: a versão reduzida é um MVP aceitável, isto é, um fluxo mínimo lógico e funcional que um desenvolvedor só consegue construir, cobrindo a operação de uma filial da ordem ao CT-e e à auditoria?

**Resposta curta:** sim, como especificação, com nove correções de severidade alta antes de entregar ao desenvolvimento. O caminho feliz fecha de ponta a ponta (ordem, link, decisão, conferência, limpeza, liberação, declaração, conciliação, amostra). O que não fecha: permissões por papel (hoje não existem, só a alçada de liberar), escopo de filial (só visual), três desfechos que ficam sem saída (bloqueio mantido, viagem bloqueada que carrega mesmo assim, CT-e de viagem que nunca ficou pronta), um bloqueio do motorista (TAC novo sem CPF) e a amostra de auditoria que omite a liberação por autoridade.

Observação de ambiente: outro agente editava `LinkDaViagem.jsx`, `Viagem.jsx` e a moldura durante a revisão. Os números de linha abaixo são do estado de 17/11/2026 e podem ter andado alguns pontos; o nome do método ou do modal localiza o trecho. Um erro `RES is not defined` apareceu uma vez durante a recarga a quente e não se repetiu; não entrou como defeito.

## Fluxo mínimo do MVP

1. **Preparar a filial (qualidade, uma vez):** comunicação do gatekeeper ao organismo certificador registrada em Cadastros, Filiais; manual vigente publicado; lavadores credenciados cadastrados; usuários da filial convidados com papel e filial.
2. **Ordem chega (afretador, Hoje):** Nova viagem pelo PDF da ordem ou pelo mínimo (produto, ordem, embarcador, destinatário, data, horário, peso). O sistema diz se a viagem é assegurada GMP+.
3. **Quem carrega:** placa ou CPF trazem TAC, ETC ou conjunto da frota própria; TAC novo nasce com cadastro mínimo.
4. **Link:** a mensagem é copiada para o WhatsApp; a mesa passa a "link enviado".
5. **Motorista (celular):** confirma CPF e placas, manda documentos que faltam, informa as três últimas cargas de cada compartimento, faz o checklist com foto, lê o manual e assina o termo.
6. **Motor decide:** falta algo, bloqueada, bloqueio técnico ou pronta, com quem resolve cada item.
7. **Afretador confere as fotos:** aprova ou devolve com motivo.
8. **Limpeza (quando o regime pede mais que seco):** afretador registra lavador e comprovante.
9. **Exceção:** bloqueio com alçada vira pedido de liberação; qualidade ou direção libera com os 9 campos ou mantém o bloqueio com ação indicada; bloqueio técnico se resolve trocando o conjunto (ou regularizando pela TS1.9).
10. **Pronta:** afretador copia a declaração positiva para o CT-e emitido no TMS. Se a viagem não fica pronta e carrega mesmo assim, segue sem declaração (passo que falta hoje, ver M12).
11. **Conciliação:** lote de CT-e e NF do TMS casado por placa e data; a viagem fica em trânsito e depois concluída; a carga entra no histórico do compartimento.
12. **Auditoria (qualidade com o auditor):** rastrear por placa e período, marcar a amostra, exportar o documento único e as listas de apoio (frota no escopo, protocolos gatekeeper, ocorrências, treinamentos).

## 1. Corrigir agora

Severidade: **alta** impede o fluxo de fechar, dá permissão errada ou produz registro de auditoria enganoso; **média** atrapalha o trabalho ou o entendimento, com contorno; **baixa** acabamento.

### Hoje.jsx

**M01 (alta). Nova viagem, passo 2, cadastro mínimo de TAC: CPF opcional trava o motorista no link.** Linhas 566 e 2288 (`cmCpf`, rótulo "CPF (opcional)").
- Acontece: criada a viagem com TAC novo sem CPF (OC 48140, Teodoro Lins), o link pede "os 3 primeiros números do seu CPF" e compara com vazio. Qualquer número dá "Não confere com o CPF desta viagem" e o motorista não passa da etapa 1. Capturas `d25-novo-tac-sem-cpf.png`, `m07-link-tac-sem-cpf.png`.
- Deveria: CPF obrigatório e validado (11 dígitos) no cadastro mínimo, ou o link pedir o CPF inteiro quando a base não tem e gravar no cadastro.

**M02 (média). Nova viagem, passo 1: carregamento só "hoje" ou "amanhã".** Linha 622 (`nDias`).
- Acontece: ordem para depois de amanhã (fim de semana, fila de safra) não entra.
- Deveria: data em DD/MM/AAAA com "hoje" e "amanhã" como atalhos, como as outras datas de escritório (`TX.ui.mascaraData`).

**M03 (média). Nova viagem, passo 2: ETC ou TAC com mais de um conjunto sempre leva o primeiro.** Linha 565 (`conjunto: t.conjuntos[0]`, `motorista: t.motoristas[0]`).
- Acontece: Cerrado Cargas tem dois conjuntos (QCE 1T10/1T11 e QCE 1T20/1T21); o afretador não escolhe conjunto nem motorista. O erro só aparece depois, como troca de conjunto.
- Deveria: depois de escolher o transportador, escolher conjunto e motorista quando houver mais de um.

**M04 (média). Nova viagem: sem aviso de conjunto já ocupado no dia nem de ordem repetida.** Método `novaVals`, função `criar` (linhas 541 a 568).
- Acontece: a OC 48200 foi criada para Rosana Teles às 19:00 com o mesmo conjunto RRT 5E06/5E07 que já carrega a OC 48119 às 12:00; nenhum aviso. Número de ordem não é conferido contra as viagens existentes. Captura `d06-mesa-apos-criar.png`.
- Deveria: avisar "RRT 5E06 já carrega hoje às 12:00 (OC 48119)" e recusar ordem já usada na filial.

**M05 (média). Mesa: linha com bloqueio técnico não tem ação.** Linhas 80 a 98 (montagem da linha).
- Acontece: VG-3118 (cama de frango no T-3) mostra "Bloqueio técnico ... Ninguém aprova" sem botão; o caminho (Trocar o conjunto) só aparece dentro da viagem. Captura `d01-hoje-diego.png`.
- Deveria: a linha oferecer "Trocar conjunto", que é a ação do afretador.

**M06 (média). Hoje para Gestor de frota e Consultoria abre o painel da qualidade.** Linha 203 (`'painel da qualidade com as ' + ...`).
- Acontece: Sérgio (frota) vê "painel da qualidade", "Pendências de registro: quem trata é a qualidade", "Conciliar CT-e em lote" e Nova viagem; Ana (consultoria) vê Nova viagem. Capturas `s01-hoje-sergio.png`, `ana-hoje.png`.
- Deveria: frota ver as viagens de frota própria e os vencimentos da frota; consultoria entrar direto em Viagens ou Auditoria, sem ação de escrita (ver M37).

**M07 (baixa). Painel: "Documentos a vencer 8" inclui dois vencidos.** Bloco de números do painel.
- Acontece: CRLV QHG 7L34 e CNH de Ivo Barcellos já venceram e entram em "a vencer". Captura `r02-hoje-rafael.png`.
- Deveria: "Documentos vencidos ou a vencer", ou separar os vencidos.

**M08 (baixa). Nova viagem com "Todas as filiais" cria em Rondonópolis sem perguntar.** Linhas 474 e 783 (`TX.sessao().filiais[0]`).
- Acontece: qualidade, direção, frota e consultoria criam viagem na primeira filial da lista; o modal só mostra "filial Rondonópolis" no subtítulo.
- Deveria: pedir a filial no passo 1 quando a sessão tem mais de uma.

### Viagens.jsx

**M09 (média). Coluna Situação mostra o nome da checagem, que é uma afirmação positiva.** Linha 347 (`fl[0].o`).
- Acontece: "Bloqueio técnico / Carga anterior permitida" (VG-3118), "Bloqueada / Transportador sem ocorrência grave em aberto" (VG-3127), "Bloqueada / Gatekeeper comunicado ao organismo certificador" (VG-3126). Lê-se o contrário do motivo. Capturas `d20-viagens-diego.png`, `l08-vg3121-apos-regra.png`.
- Deveria: usar o mesmo rótulo de falha da mesa (Hoje, linhas 80 a 95), movido para `tx-dados.js` (ver M42).

**M10 (média). Conciliar CT-e em lote: o modal não mostra a situação da viagem na hora do carregamento.** Modal de conciliação.
- Acontece: o lote lista CT-e, NF, placa, data e viagem; não diz se a viagem estava pronta, liberada por autoridade ou bloqueada. Captura `d22-conciliar-lote.png`.
- Deveria: coluna "situação ao carregar" e destaque para viagem que não estava pronta (motor em M44).

**M11 (baixa). Viagem pronta por regra em "Só alerta" aparece igual a uma pronta limpa.**
- Acontece: com Documentos em "Só alerta", a VG-3121 (CRLV vencido) aparece "Pronta para assegurar" sem sinal de alerta. Captura `l08-vg3121-apos-regra.png`.
- Deveria: "Pronta, 1 alerta" na situação.

### Viagem.jsx

**M12 (alta). Falta o desfecho "carregou sem declaração GMP+".** Hero e menu Ações (linhas 540 a 560).
- Acontece: para viagem bloqueada (técnico ou bloqueio mantido) as saídas são pedir, liberar, manter, trocar ou cancelar. Na operação a carga pode seguir sem a declaração (`02-usuarios-e-trabalhos.md`, 3.4). Sem esse desfecho, a VG-3118 vira "Aguardando CT-e" no dia seguinte e recebe CT-e como se fosse assegurada.
- Deveria: ação "Carregar sem declaração GMP+" com motivo, que tira a marcação de assegurada, some da fila de pendências e faz a conciliação esperar CT-e sem a frase.

**M13 (média). Título do bloqueio diz o contrário do motivo.** Linha 104 (`'Bloqueada: ' + minusc(primeiro.o)`).
- Acontece: "Bloqueada: transportador sem ocorrência grave em aberto" (VG-3127, `r01-vg3127-rafael.png`), "Bloqueada: gatekeeper comunicado ao organismo certificador" (VG-3126, `r21-vg3126.png`).
- Deveria: rótulo de falha único (M42), o mesmo da mesa ("transportador em revisão após ocorrência grave", "filial sem comunicação ao organismo certificador").

**M14 (média). "Manter bloqueio" aparece para quem não decide.** Botão do hero, linha 2073 (`abrirManter`), sem condição de alçada.
- Acontece: Diego (afretador) e Ana (consultoria) veem e conseguem registrar "Manter bloqueio". Capturas `d11-vg3121-pedido.png`, `ana-viagem_id_VG-3121.png`.
- Deveria: só quem tem a alçada daquele bloqueio (mesma regra de "Liberar por autoridade").

**M15 (média). "Pedir liberação" não leva justificativa nem anexo.** `TX.ui.pedirLiberacao` em `tx-ui.js`, linha 148, chamado pela mesa e pela viagem.
- Acontece: um clique grava o pedido; o afretador não consegue dizer "CRLV renovado, protocolo Detran 2026/883311" nem anexar o protocolo. Quem assina recebe "sem nota". Captura `d11-vg3121-pedido.png`.
- Deveria: campo curto opcional e anexo no pedido; o modal de liberação abre com isso preenchido em Justificativa e Evidência.

**M16 (média). Registro de liberação promete revogação que não existe.** Modal "Registro de liberação", linha 897.
- Acontece: "Lacrado. Correção só por revogação, que entra como evento novo." Não há ação de revogar em lugar nenhum. Captura `r04-registro-liberacao.png`.
- Deveria: ação "Revogar liberação" com motivo (evento novo, viagem volta a bloqueada), ou tirar a frase.

**M17 (média). Validade "Até o fim do dia" não tem efeito.** Modal de liberação, linha 978 (`libValidades`).
- Acontece: a liberação vale para a checagem daquela viagem em qualquer caso; "Até o fim do dia" não estende a outra viagem nem expira.
- Deveria: tirar a opção (fica "Somente esta viagem") ou implementar o que ela promete.

**M18 (média). Modais de liberação e de reabilitação oferecem "Entrar como Direção e RT".** Linha 3554 (`libTrocar`) e `Transportadores.jsx` linha 1548.
- Acontece: quem não tem alçada recebe um atalho de demonstração dentro do fluxo. Captura `r11-revisar-rafael.png`.
- Deveria: "Pedir à Direção e RT" (gera o pedido e põe na fila dela).

**M19 (média). Registrar limpeza: só o número do comprovante, um compartimento por vez, lavador sem conferência de documento.** Modal `limpeza`, linhas 1154 a 1210.
- Acontece: na VG-3119 foi preciso registrar duas vezes o mesmo comprovante (QVT 1A91 C1 e QVT 1A92 C1); não há arquivo nem data da lavagem; um lavador com licença vencida continua escolhível (a lista não olha `fornecedor.docs`). Capturas `d18-limpeza-modal.png`, `d19-vg3119-apos-limpeza.png`. O texto da pendência diz "Afretador anexa o comprovante", mas nada se anexa.
- Deveria: marcar vários compartimentos, anexar o comprovante (foto ou PDF), data da lavagem, e lavador com documento vencido apagado com o motivo.

**M20 (média). Troca de conjunto não mostra se o conjunto novo pode carregar.** Modal `trocar`, linhas 1114 a 1150.
- Acontece: a lista mostra "já carrega hoje" em sete de oito conjuntos e deixa escolher; não mostra documento vencido (Genivaldo, CRLV vencido, aparece igual) nem compartimento em quarentena. Captura `d08-trocar-modal.png`.
- Deveria: situação de documentos e do T-3 conhecido de cada conjunto; ocupado no mesmo horário apagado ou com confirmação.

**M21 (média). Retificar aceita janela em texto livre e quebra a mesa.** Modal `retificar`, linha 1244; efeito em `Hoje.jsx` linhas 133 e 347.
- Acontece: janela retificada para "fim da tarde" na VG-3122; a mesa passa a mostrar "fim da tarde / em NaN h". Capturas `d26-retificar-janela.png`, `d27-hoje-janela-invalida.png`. Também não se retifica a data do carregamento (ordem adiada exige cancelar e criar de novo).
- Deveria: janela HH:MM validada como na Nova viagem; retificar data de carregamento.

**M22 (média). Bloqueio por documento não leva ao documento.** `acaoFalta`, linhas 136 a 154.
- Acontece: VG-3121 bloqueada por CRLV vencido mostra "Pode ser liberada ... ou resolvida corrigindo o fato", mas não há ação para corrigir: é preciso achar o transportador em outra tela. Captura `d10-vg3121-diego.png`.
- Deveria: "Atualizar CRLV" abrindo o drawer do transportador no documento (ou o modal de atualizar direto).

**M23 (média). Bloco "Registro para auditoria" diz o que não vai acontecer e esconde o que aconteceu.** Linha 452.
- Acontece: na VG-3118 (bloqueio técnico) mostra "DACTE com declaração positiva: a conciliar" (`d07-viagem-tecnico.png`); na VG-3127 liberada pela Direção o bloco não menciona a liberação (`l11-vg3127-liberada.png`).
- Deveria: "sem declaração" quando a viagem não está pronta; linha "Liberação por autoridade" com link para o registro de 9 campos.

**M24 (média). Viagem pronta por regra em "Só alerta" esconde o alerta.** Hero `pronta`.
- Acontece: com Documentos em "Só alerta", a VG-3121 mostra "Pronta para assegurar. As 10 checagens aplicáveis passaram" e "Todas passaram"; o CRLV vencido só aparece abrindo as checagens.
- Deveria: "Pronta com 1 alerta: CRLV QHG 7L34 vencido em 01/10/2026" no hero.

**M25 (baixa). Regularizar pela TS1.9, opção B, escolhe mas nunca confirma.** Linha 1053 (`const ok = opA && ...`).
- Acontece: quando há cinco cargas não ração, a opção B fica selecionável, mas o botão só confirma a opção A.
- Deveria: confirmar B com o inspetor do carregador, ou não deixar escolher (ver seção 2).

**M26 (baixa). Registro exportado mistura data relativa.** Exportar registro da viagem.
- Acontece: "Aprovada por Diego Saldanha em hoje 08:38", "assinado hoje 08:26". Captura `r05-export-registro.png`.
- Deveria: data absoluta em documento exportado (08/10/2026 08:38).

### Transportadores.jsx

**M27 (média). Atualizar documento pede só a nova validade.** Modal `atualizar`, linha 472.
- Acontece: CRLV QHG 7L34 atualizado com "05/10/2027", sem número nem arquivo; a viagem passa a pronta. Captura `r10-atualizar-crlv.png`.
- Deveria: número e anexo do documento (o auditor confere CRLV e RNTRC); o anterior fica no histórico.

**M28 (média). Revisar e reabilitar: quem não é Direção só tem "Entrar como Direção e RT".** Linha 1548. Mesmo caso de M18.
- Deveria: "Pedir revisão à Direção", que aparece para o Luiz como pendência.

### Frota.jsx

**M29 (média). Gestor de frota não atualiza CRLV nem CNH da frota própria.** Linhas 110 e 124 (só Tirar e Incluir no escopo).
- Acontece: os vencimentos da frota apontam para `/frota` (`tx-dados.js`, `vencimentos`, linha 1084), mas a tela não tem "Atualizar". O papel descrito em Configurações é "Cuida da frota própria e dos documentos dela". Captura `s02-frota.png`.
- Deveria: "Atualizar" em CRLV de cada placa e CNH de cada motorista, como em Transportadores.

### Compartimento.jsx

**M30 (média). Coluna Limpeza afirma "seca, no checklist" para cargas sem checklist.** Linha 125.
- Acontece: em QVT 1A91 C1, as cargas de 25/09 e 17/09 (declaradas pelo motorista no T-3 da OC 48077) aparecem com "seca, no checklist", mas não houve checklist do Traxium nessas cargas. Captura `r13-compartimento-qvt.png`.
- Deveria: "não registrada" quando a limpeza não tem registro próprio; "seca, no checklist" só para carga feita em viagem do Traxium.

### Auditoria.jsx

**M31 (alta). Amostra exportada omite a liberação por autoridade, a limpeza e a ciência do manual.** `exportarAmostra`, linha 278 (`itemViagem`).
- Acontece: a OC 48095 (VG-3113) foi liberada pelo Gestor da qualidade com CNH vencida (protocolo Detran 884512); o documento da amostra não diz isso. Também não traz comprovante de limpeza nem versão do manual. Captura `r17-export-amostra.png`.
- Deveria: por viagem, o resultado da decisão, o registro de 9 campos quando houve liberação, a limpeza com lavador e comprovante, e a ciência do manual com versão.

**M32 (média). Lista do período inclui viagens de hoje ainda não carregadas, sem situação.** Linha 35 (`v.data <= TX.HOJE`).
- Acontece: "26 viagens asseguradas" incluem as 13 de 08/10, entre elas a VG-3118 em bloqueio técnico e a VG-3122 sem T-3; a tabela não tem coluna de resultado. Captura `r14-auditoria.png`.
- Deveria: só viagens carregadas (data anterior a hoje ou com CT-e), ou coluna "Resultado" (pronta, liberada por autoridade, sem declaração).

**M33 (baixa). Tabela não mostra transportador, RNTRC, motorista nem T-3.** Cabeçalho da tabela.
- Acontece: o texto diz "Colunas na ordem em que o auditor anota", mas faltam itens que o auditor anota (`evidencia-auditoria-real.md`, 2.4). Estão só no documento exportado.
- Deveria: coluna "Subcontratado e motorista" ao menos; T-3 pode ficar no documento.

**M34 (baixa). Atalho "Últimos 12 meses" aparece como "08/10 a 08/10".** Linha 140.
- Deveria: mostrar o ano quando o período passa de um ano civil (08/10/2025 a 08/10/2026).

### Cadastros.jsx

**M35 (média). Pedido de classificação não tem saída.** Seção Produtos e regimes, "Pedir classificação à Traxium".
- Acontece: PC-014 ("escória de alto-forno", 06/10/2026) fica "na fila da Traxium" sem prazo nem retorno; a viagem com essa carga anterior fica travada sem caminho no app. Captura `r19-produto-mamona.png`.
- Deveria: no mínimo, prazo esperado e aviso quando classificado; quem classifica depende do time (seção 3, item 11).

### Configuracoes.jsx

**M36 (média). Usuários: não se muda papel, filial ou alçada, nem se desativa acesso.** Linha 100 (`usuarios`).
- Acontece: a lista só tem "Entrar como". Quem sai da empresa não perde acesso; afretador que muda de filial não muda; não há substituto de alçada em férias. Capturas `l01-config.png`, `l06-convite-lista.png`.
- Deveria: editar papel e filial, "Desativar acesso" com registro, e alçada atribuível a outro usuário (com quem decide isso validado, seção 3).

**M37 (alta). Regras, convites e "Voltar à semente" abertos a qualquer papel.** Seções Regras e Usuários.
- Acontece: Ana (consultoria, "só leitura e exportação") mudou "Ciência do manual vigente" para "Só alerta" com motivo "Teste da consultoria externa" e o motor passou a usar. Diego (afretador) também vê "Bloqueia / Só alerta" e "Convidar usuário". Capturas `a01-ana-mudou-regra.png`, `diego-configuracoes.png`. Motor em M40.
- Deveria: regras e convites só para Qualidade e Direção; demais papéis veem a tela sem ações ou não veem.

**M38 (média). Integrações dizem "ativa" para o que não consulta nada.** Linha 184 (`integracoes`), semente em `tx-dados.js` linhas 313 a 318.
- Acontece: "Consulta RNTRC (ANTT): ativa" e "Base pública de certificados GMP+: ativa". No piloto, quem lê vai supor que o RNTRC é conferido na ANTT.
- Deveria: "planejada" ou esconder até existir (seção 2).

### Moldura (`src/components/moldura/`)

**M39 (média). Sidebar igual para todos os papéis.** `moldura.tsx`, `GRUPOS`, `CADASTROS`, `RODAPE`.
- Acontece: o afretador vê Auditoria, Cadastros (com Publicar manual e Registrar comunicação) e Configurações; consultoria e frota veem tudo. Capturas `diego-cadastros_aba_manual.png`, `diego-cadastros_aba_filiais.png`.
- Deveria: itens por papel. Premissa para o piloto: afretador com Hoje, Viagens, Transportadores; frota com Hoje, Viagens, Frota própria; consultoria com Viagens, Auditoria e Cadastros em leitura; qualidade e direção com tudo.

### tx-dados.js

**M40 (alta). Nenhuma operação confere papel.** `fazer` (linha 1199) e `aplicar` (linha 499).
- Acontece: qualquer usuário executa qualquer operação; as telas só conferem alçada para liberar (`podeAssinar`). Evidências em M14, M37, M39 e na varredura `ana-*.png`, `sergio-*.png`: consultoria com Nova viagem, Cadastrar transportador, Tirar do escopo, Publicar nova versão, Registrar treinamento, Convidar usuário.
- Deveria: matriz única papel por operação (por exemplo `TX.pode(usuario, tipo, dados)`), usada em `fazer` para recusar e nas telas para esconder. Premissa de matriz: afretador cria, envia, confere, registra limpeza, pede liberação, troca conjunto, registra ocorrência, retifica, cancela e concilia na própria filial; qualidade faz tudo isso em todas as filiais, mais liberar no nível qualidade, manter bloqueio, documentos, cadastros e regras; direção tudo; frota escopo e documentos da frota própria; consultoria só leitura e exportação. É a mesma matriz que o back-end vai precisar.

**M41 (alta). Escopo de filial só existe na lista.** `viagensDaFilial` (linha 1063), `loteCTe` (linha 1190), busca global e Auditoria.
- Acontece: Diego (Sorriso) abre e pode agir na VG-3123 de Rondonópolis pela URL (`d24-diego-viagem-outra-filial.png`); a conciliação dele casou a OC 48061 de Rondonópolis (`d22-conciliar-lote.png`); a Auditoria dele lista as 26 viagens de todas as filiais.
- Deveria: leitura e escrita de viagem filtradas por `usuario.filiais`; a base de transportadores segue compartilhada como premissa (seção 3, item 4).

**M42 (média). Falta um rótulo de falha por checagem.** `decidir`, linhas 889 a 1028.
- Acontece: cada tela compõe o motivo do bloqueio a partir do nome da checagem (`o`), que é escrito como afirmação positiva; só a mesa tem um mapa próprio (`Hoje.jsx` linhas 80 a 95). Origem de M09 e M13.
- Deveria: `decidir` devolver em cada item de `falta` um `motivo` curto já em forma de falha, usado por Hoje, Viagens, Viagem e exportações.

**M43 (alta). Manter bloqueio não tira a viagem da fila nem chega à mesa.** `liberacaoDe`, linha 1107, ignora `v.manutencoes`.
- Acontece: Rafael manteve o bloqueio da VG-3121 com ação "Trocar o conjunto"; a viagem continua em "Esperando sua assinatura" e a mesa do Diego continua com "Pedir liberação", sem a decisão. Capturas `r06-manter-modal.png`, `r07-vg3121-mantido.png`, `r08-fila-apos-manter.png`.
- Deveria: manutenção posterior ao último pedido tira da fila; mesa e hero mostram "Bloqueio mantido por Rafael Antunes: trocar o conjunto"; novo pedido só depois de fato novo (documento atualizado, conjunto trocado).

**M44 (alta). CT-e conciliado em viagem que nunca ficou pronta.** `loteCTe` (linha 1190) e `conciliarCTe` (linha 663).
- Acontece: o lote pega toda viagem passada sem CT-e, sem olhar a decisão; uma viagem bloqueada ou com falta hoje recebe CT-e amanhã como qualquer outra e passa a "Em trânsito" e "Concluída".
- Deveria: gravar a decisão no momento da conciliação; viagem que não estava pronta nem liberada recebe o CT-e com alerta "conferir se o DACTE saiu sem a declaração" e entra nas pendências da qualidade. Depende de M12.

**M45 (alta). Troca de conjunto mantém "link enviado" para um motorista que não recebeu.** `trocarConjunto`, linha 608.
- Acontece: na VG-3118 o conjunto passou de Ademir Kunz para Josué Ribeiro; a linha do tempo e o passo 2 continuam "Link enviado hoje 07:35" e as pendências dizem "Lembrar o motorista". Captura `d09-apos-troca.png`.
- Deveria: quando o motorista muda, o link volta a "não enviado" (o envio anterior fica na linha do tempo como do motorista antigo) e a ação vira "Enviar link".

**M46 (média). Regra "Foto em todo item do checklist" não tem efeito.** `regraDe`, linha 993, só mapeia documentos e manual.
- Acontece: Bloqueia ou Só alerta em "fotos" não muda nenhuma decisão; o link já exige uma foto por item.
- Deveria: ligar a regra ao motor e ao link, ou tirá-la da lista.

**M47 (média). Mudar a classe de uma regra reavalia viagens passadas.** `decidir`, linhas 993 a 997, lê `config.regras` atual para toda viagem.
- Acontece: a tela diz "Decisões já registradas não mudam" (`l04-regra-modal.png`), mas uma viagem concluída com documento vencido muda de resultado se a regra voltar a bloquear ou passar a alerta.
- Deveria: aplicar a classe vigente na data da viagem (guardar o histórico de `classeRegra`) ou gravar a decisão quando a viagem carrega.

**M48 (baixa). Retificar destinatário não recalcula "assegurada".** `retificar`, linha 673.
- Acontece: latente (a tela não oferece o campo hoje), mas trocar para Solo Fértil Insumos (não certificado) manteria a declaração.
- Deveria: recalcular `assegurada` quando produto ou destinatário mudam.

### Link do motorista (`/link?id=VG-3122`, 390 px)

Outro agente cuida deste fluxo; registro só os bloqueios vistos.

- Bloqueio: TAC novo sem CPF não passa da etapa 1 (M01).
- Sem estouro lateral em 390 px (`scrollWidth` 390). T-3 com "Entendido: Soja em grãos" funciona (`m04-link-t3.png`). Avançar sem fotos não passa (`m05-link-sem-fotos.png`).
- O aviso de demonstração "Link enviado e aberto. A mesa da filial já mostra." aparece para o motorista e cobre a antepenúltima carga, acima do botão Enviar as cargas (`m04-link-t3.png`).
- O campo de data é o nativo; no navegador em inglês aparece 10/04/2026 para 04/10/2026. É a premissa já registrada em `HANDOFF.md` 7.3; num celular em português sai DD/MM.

## 2. Fora do MVP

O que pode ficar escondido ou simplificado no piloto de uma filial sem quebrar o fluxo:

| O que | Onde | Por que pode sair | O que fica no lugar |
| --- | --- | --- | --- |
| Visões salvas | Viagens | As quatro abas fixas cobrem a filial | Abas fixas e filtro de período |
| Convite do transportador para manter documentos (Convidar, Revogar, Reenviar, Convidar de novo, aba "Convite pendente") | Transportadores | O portal do transportador não existe no V2; o motorista já manda documento pelo link | Documento pelo link da viagem e "Atualizar" pela qualidade |
| Importar planilha de transportadores | Transportadores | Carga inicial é trabalho de implantação | Cadastro mínimo na Nova viagem |
| Regularização TS1.9 opção B e o modal de duas opções | Viagem | Raro em granel sólido; opção B está quebrada (M25) | Trocar o conjunto; opção A só para a qualidade |
| Simulação de rastreabilidade com cronômetro | Auditoria | Útil, mas a filial vive sem ela no piloto | Registrar simulação como texto, se pedirem |
| Treinamentos | Cadastros | O registro vive na consultoria (`evidencia-auditoria-real.md`, 2.5); depende da pergunta 7 | Lista de apoio só se o Rafael confirmar |
| Fornecedores que não lavam | Cadastros | A viagem só usa lavador | Só lavadores com documentos |
| Modelos, LGPD e retenção, Integrações, Dados do protótipo | Configurações | Leitura ou demonstração; Integrações engana (M38) | Usuários, Alçadas (leitura) e Regras |
| "Entrar como", "Versão anterior", "Link do motorista demo" ou "Protótipo mobile", chip da base IDTF | Moldura | Demonstração | Login real |
| Painel "Todas as filiais" (Prontidão, Protocolos gatekeeper, cartões por filial) | Hoje | Piloto com uma filial | Mesa da filial e Pendências de registro para a qualidade |
| Frota própria e Nova viagem de frota própria | Frota, Hoje | Só entra se a filial do piloto tem conjunto próprio no escopo | Afretamento apenas |
| Busca local "Filtrar" nas listas | Viagens, Transportadores, Cadastros | A busca global já cobre | Busca global |

Do V1, o que o fluxo precisa e falta:

1. **Desfecho "carregou sem declaração GMP+"** para viagem bloqueada (M12). O V1 tinha exceção com decisão final; o V2 tem liberar ou manter, mas não "seguiu sem a frase".
2. **Aviso fora da tela** para pedido de liberação e bloqueio mantido. No V2 o pedido só aparece se quem assina abrir Hoje. Com prazo de carregamento em horas, é parte do fluxo (decisão técnica na seção 3).
3. **Quem responde a fila de classificação IDTF** (no V1 o Motor IDTF tinha a classificação no cliente). No V2 a fila fica parada (M35).
4. **Login, papéis e filiais** (o V1 também simulava; é back-end, listado em `08-resposta-pm-mvp.md`, seção 4).

## 3. Validar com o time

Só o que depende de outras pessoas; cada item diz o que muda conforme a resposta.

**Operação do cliente (Rafael, com um afretador se possível)**

1. Quem faz a verificação do compartimento: motorista com fotos e afretador à distância (como está), ou afretador presencial no pátio? (pergunta 4 de `03-diagnostico.md`). Muda a etapa 3 do link e a conferência.
2. Quando a viagem não fica pronta a tempo, a filial deixa de carregar, troca o conjunto ou carrega sem a declaração? Define M12 e M44.
3. Onde nasce o CT-e e em que formato o TMS exporta (planilha ou XML), e se o mesmo conjunto faz duas cargas no dia (o casamento é por placa e data). Define a conciliação.
4. A base de transportadores é compartilhada entre filiais e o afretador vê viagens de outra filial? (pergunta 9). Hoje a premissa é base compartilhada e viagem por filial (M41).
5. Quanto é ETC com vários conjuntos e motoristas na filial do piloto (pergunta 3). Define a prioridade de M03.
6. Ordem com carregamento para depois de amanhã é comum? Define M02.
7. A filial do piloto tem frota própria no escopo GMP+? Define se Frota própria entra.

**Regras normativas (Rafael)**

8. Quais regras podem ficar em "Só alerta" (documentos, manual, foto por item) e se a mudança vale só daqui para frente. Define M46 e M47.
9. Alçadas: quem substitui o gestor da qualidade e a Direção na ausência; quem pode dar alçada a outro usuário; se "até o fim do dia" existe na prática. Define M17 e M36.
10. Comprovante de limpeza: basta o número ou precisa do arquivo e da data; lavador com licença vencida pode ser usado? Define M19.
11. Quem classifica produto fora da base IDTF durante o piloto e em quanto tempo (pergunta 10). Define M35.
12. Treinamentos e ocorrências ficam no Traxium ou na consultoria (perguntas 7 e 8). Define o que sai na seção 2.
13. Para a regularização TS1.9, basta a opção A no piloto? Define M25.
14. A consultoria entra no piloto, e só com leitura e exportação? Confirma a matriz de M40.
15. A Direção e RT é convidada pela tela ou criada na implantação? (premissa de `HANDOFF.md`, 7.1).

**Escolhas técnicas (Bruno)**

16. Onde mora a matriz de permissões: no servidor, com a tela só escondendo. A proposta de M40 serve de ponto de partida.
17. Canal de aviso do pedido de liberação e do bloqueio mantido (e-mail, WhatsApp, notificação), com o prazo da janela de carregamento.
18. Identidade do motorista no link: três dígitos do CPF bastam com um link único por viagem? Expiração do link e o que acontece quando o conjunto ou o motorista mudam (M45).
19. Guarda de fotos, comprovantes e documentos, com carimbo de hora e local.
20. Decisão gravada na hora do carregamento versus decisão sempre recalculada (M44, M47). Muda o modelo de dados.
21. Se o motor de `tx-dados.js` vira especificação executável ou ponto de partida do código.

## Contagem

| Seção | Itens |
| --- | --- |
| Corrigir agora | 48 (alta 9, média 31, baixa 8) |
| Fora do MVP | 12 linhas na tabela e 4 faltas do V1 |
| Validar com o time | 21 (operação 7, normas 8, técnica 6) |
