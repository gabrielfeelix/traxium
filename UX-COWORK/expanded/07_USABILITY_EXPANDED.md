# 07_USABILITY_TESTING — Testes de Usabilidade

> Arquivo de validação comportamental. Serve para **planejar, conduzir, analisar e documentar testes de usabilidade** em projetos reais.
> O foco não é perguntar se o usuário gostou: é observar se pessoas conseguem realizar tarefas reais, onde travam, por que travam e o que precisa ser melhorado.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 33. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "teste de usabilidade"** na base. Ele orienta como validar fluxos, protótipos, páginas, produtos em produção e serviços digitais a partir de comportamento observado.

Responde, na prática:

- O que é teste de usabilidade e o que ele não é.
- Quando usar teste moderado, não moderado, remoto, presencial, qualitativo ou quantitativo.
- Como criar objetivos, hipóteses, tarefas, cenários e critérios de sucesso.
- Como conduzir sessões sem induzir o participante.
- Como usar think aloud.
- Como registrar observações e evidências.
- Como transformar problema observado em recomendação.
- Como classificar severidade e priorizar correções.
- Como criar relatório de teste de usabilidade.
- Como conectar usabilidade com acessibilidade, métricas, IA e e-commerce.

Regra central: **teste de usabilidade não mede gosto; observa desempenho, compreensão, erro, esforço e confiança durante tarefas reais.**

---

## 2. O que é teste de usabilidade

Teste de usabilidade é um método de pesquisa em que participantes representativos tentam realizar tarefas usando um produto, serviço, protótipo ou conteúdo enquanto o pesquisador observa o que acontece.

É um método **observacional** porque o valor principal vem do comportamento:

- onde a pessoa clica;
- onde hesita;
- o que procura;
- que caminho escolhe;
- quando erra;
- quando abandona;
- quando precisa de ajuda;
- o que esperava que acontecesse;
- se consegue completar a tarefa.

### Testar opinião vs observar comportamento

Perguntar “você gostou?” mede percepção, educação social e preferência declarada. Observar uma pessoa tentando comprar, cadastrar, configurar, encontrar uma informação ou concluir um fluxo mostra a experiência real.

A pergunta “foi fácil?” pode receber “sim” mesmo quando a pessoa errou três vezes e só concluiu por sorte. O comportamento conta a história com menos maquiagem.

### Teste de usabilidade vs entrevista

- **Entrevista** investiga contexto, comportamento passado, critérios de decisão e percepção.
- **Teste de usabilidade** avalia se uma solução é compreensível, navegável e executável em uma tarefa.

Entrevista responde “por que isso importa e como a pessoa faz hoje?”.
Teste de usabilidade responde “essa solução permite que a pessoa faça isso?”.

### Teste de usabilidade vs QA técnico

QA verifica se o sistema funciona conforme o especificado: bugs, erros técnicos, validações, integrações, responsividade, regressões.

Teste de usabilidade verifica se pessoas conseguem usar o sistema com sucesso, mesmo que ele esteja tecnicamente “funcionando”.

Um campo pode validar tecnicamente e ainda ser ruim de usar. Clássico.

### Teste de usabilidade vs teste A/B

- **Teste de usabilidade** descobre problemas e causas prováveis com poucos participantes, geralmente de forma qualitativa.
- **Teste A/B** mede impacto de variações em comportamento real em escala, geralmente com usuários em produção.

Teste de usabilidade ajuda a saber **o que está errado e por quê**.
A/B ajuda a saber **qual alternativa performa melhor em uma métrica**.

### Teste de usabilidade vs pesquisa de satisfação

Satisfação é atitude declarada. Usabilidade é a capacidade de concluir tarefas de forma eficaz, eficiente e compreensível. Uma pessoa pode gostar da marca e ainda travar no checkout.

---

## 3. Para que serve teste de usabilidade

Teste de usabilidade ajuda a descobrir:

- se usuários entendem a interface;
- se conseguem completar tarefas;
- onde ocorrem erros;
- onde há confusão;
- onde há esforço desnecessário;
- onde a linguagem atrapalha;
- onde o fluxo quebra expectativas;
- onde o conteúdo não responde à dúvida;
- onde a arquitetura da informação falha;
- onde a navegação parece invisível;
- onde uma decisão de produto cria fricção;
- quais melhorias são prioritárias.

Ele é especialmente poderoso porque mostra problemas que o time não percebe mais. Quem desenhou sabe onde tudo está. Usuário não.

---

## 4. Quando usar teste de usabilidade

| Situação do projeto | Por que testar | Tipo de teste recomendado | Entregável esperado |
|---|---|---|---|
| Protótipo inicial | Descobrir problemas antes do desenvolvimento | Moderado qualitativo | Lista de problemas e recomendações |
| Redesign | Comparar se a nova solução resolve dores antigas | Moderado ou benchmark comparativo | Diagnóstico + ajustes |
| Novo fluxo | Ver se a sequência faz sentido | Moderado com tarefas | Problemas por etapa |
| Checkout | Identificar abandono, dúvidas e fricções | Moderado + métricas de tarefa | Recomendações de conversão |
| Formulário | Encontrar problemas de label, validação e erro | Moderado ou não moderado | Ajustes de campos e mensagens |
| Página de produto | Ver se o usuário entende e decide | Moderado qualitativo | Melhorias de conteúdo e hierarquia |
| Navegação | Ver se usuários encontram o que procuram | Tree testing + teste de usabilidade | IA e labels ajustados |
| App mobile | Validar tarefas no contexto de tela pequena | Remoto ou presencial com device real | Problemas de interação e fluxo |
| Sistema interno | Reduzir erro e esforço operacional | Contextual + teste com tarefas | Recomendações de produtividade |
| Produto em produção | Diagnosticar gargalos reais | Teste com produto atual + analytics | Backlog priorizado |
| Melhoria pós-lançamento | Confirmar se ajuste funcionou | Reteste + métricas | Evidência de melhoria |

Use teste de usabilidade quando existe uma **solução concreta** para avaliar: protótipo, fluxo, conteúdo, navegação, formulário, produto em produção ou serviço.

---

## 5. Quando não usar teste de usabilidade como método principal

Teste de usabilidade não é o melhor método para:

- descobrir necessidades profundas do usuário;
- entender contexto amplo de vida ou trabalho;
- validar intenção futura de compra;
- provar demanda de mercado;
- medir preferência estatística;
- substituir entrevistas exploratórias;
- substituir analytics;
- substituir QA técnico;
- escolher visual por gosto pessoal;
- decidir branding ou direção estética sem critério;
- medir conversão real sem tráfego;
- validar problema ainda indefinido.

Se você ainda não sabe qual problema resolver, volte para discovery. Se você quer saber quanto impacta em escala, use métricas/analytics/A-B. Se você quer saber se está bonito, cuidado: isso provavelmente é outra conversa.

---

## 6. Tipos de teste de usabilidade

### 6.1 Teste moderado

**Para que serve:** entender comportamento e raciocínio durante a tarefa.  
**Quando usar:** quando você precisa observar, perguntar e aprofundar.  
**Vantagem:** revela causas, expectativas e dúvidas.  
**Limitação:** menos escalável.  
**Cuidado:** moderador não pode ensinar nem conduzir.

### 6.2 Teste não moderado

**Para que serve:** coletar comportamento em escala maior sem pesquisador presente.  
**Quando usar:** tarefas simples, maduras e bem escritas.  
**Vantagem:** rápido e escalável.  
**Limitação:** menos contexto sobre o porquê.  
**Cuidado:** tarefas ambíguas arruínam o estudo.

### 6.3 Teste presencial

**Para que serve:** observar detalhes de comportamento, ambiente, postura e uso físico.  
**Quando usar:** contexto ou dispositivo importa muito.  
**Vantagem:** observação rica.  
**Limitação:** logística mais pesada.  
**Cuidado:** presença do pesquisador pode influenciar.

### 6.4 Teste remoto

**Para que serve:** testar com participantes à distância.  
**Quando usar:** recrutamento distribuído, prazos curtos, produto digital.  
**Vantagem:** acesso a mais perfis.  
**Limitação:** risco técnico e menor leitura de contexto físico.  
**Cuidado:** testar ferramenta antes.

### 6.5 Teste formativo

**Para que serve:** encontrar problemas durante o desenho para melhorar.  
**Quando usar:** wireframe, protótipo, versão inicial.  
**Vantagem:** corrige cedo.  
**Limitação:** não mede performance final.  
**Cuidado:** não exigir perfeição estatística.

### 6.6 Teste somativo

**Para que serve:** medir desempenho de uma solução mais madura.  
**Quando usar:** antes/depois de lançamento, benchmark, comparação.  
**Vantagem:** gera métricas mais formais.  
**Limitação:** exige planejamento mais rigoroso.  
**Cuidado:** amostra e critérios precisam ser claros.

### 6.7 Teste qualitativo

**Para que serve:** descobrir problemas e entender causas.  
**Quando usar:** maioria dos testes de protótipo e fluxo.  
**Vantagem:** profundidade.  
**Limitação:** não prova frequência estatística.  
**Cuidado:** não transformar 5 sessões em “verdade quantitativa”.

### 6.8 Teste quantitativo

**Para que serve:** medir desempenho com números.  
**Quando usar:** benchmark, comparação, acompanhamento.  
**Vantagem:** permite medir taxa, tempo e sucesso.  
**Limitação:** exige mais participantes e controle.  
**Cuidado:** números sem observação podem esconder causa.

### 6.9 Teste com protótipo

**Para que serve:** aprender antes de construir.  
**Quando usar:** fluxos, navegação, conteúdo, conceitos.  
**Vantagem:** barato e rápido.  
**Limitação:** não mede performance real de sistema.  
**Cuidado:** protótipo precisa ser realista o suficiente para a tarefa.

### 6.10 Teste com produto em produção

**Para que serve:** diagnosticar experiência real.  
**Quando usar:** produto existente, redesign, melhoria contínua.  
**Vantagem:** contexto mais próximo da realidade.  
**Limitação:** pode envolver dados reais e riscos operacionais.  
**Cuidado:** usar ambiente seguro quando necessário.

---

## 7. Teste moderado

Teste moderado é uma sessão em que um facilitador acompanha o participante realizando tarefas. O moderador explica o contexto, observa, faz perguntas neutras e mantém a sessão no caminho sem entregar respostas.

### Papel do moderador

- Explicar objetivo.
- Reforçar que o teste é do produto, não da pessoa.
- Pedir para pensar em voz alta.
- Ler tarefas.
- Observar comportamento.
- Fazer perguntas neutras.
- Controlar tempo.
- Evitar ajuda prematura.
- Cuidar do conforto do participante.
- Encerrar e agradecer.

### Papel do observador

- Registrar comportamento, falas e problemas.
- Separar observação de interpretação.
- Não interromper.
- Não ajudar.
- Marcar evidências por tarefa.
- Apoiar a síntese depois.

### Think aloud

Think aloud ajuda a entender o que a pessoa está tentando fazer, o que espera e por que escolhe um caminho. O moderador pode lembrar a pessoa de falar, mas sem induzir.

### Como não induzir

Evite:

- “Clique ali.”
- “Você viu o menu?”
- “Você não acha melhor ir para produtos?”
- “Esse botão está claro?”
- “O certo seria...”

Prefira:

- “O que você está procurando agora?”
- “O que você esperava que acontecesse?”
- “O que te fez escolher esse caminho?”
- “Me conta o que passou pela sua cabeça.”
- “O que você faria agora?”

### Participante travado

Se a pessoa travar:

1. Dê alguns segundos de silêncio.
2. Pergunte o que ela está procurando.
3. Pergunte o que esperava encontrar.
4. Se ainda estiver travado, registre como problema.
5. Só ajude se a continuidade do teste depender disso.
6. Ao ajudar, marque que a tarefa não foi concluída sem assistência.

Ajudar rápido demais destrói o dado. Parece gentileza, mas é sabotagem metodológica com sorriso.

---

## 8. Teste não moderado

Teste não moderado acontece sem pesquisador presente. A pessoa recebe tarefas em uma ferramenta e executa sozinha, normalmente com gravação de tela, cliques, tempo, sucesso/falha e respostas abertas.

### Quando usar

- Tarefas simples e bem definidas.
- Fluxos maduros.
- Necessidade de mais participantes.
- Comparação de versões.
- Validação de problemas já conhecidos.
- Quando não há necessidade de aprofundar em tempo real.

### Quando não usar

- Produto muito novo ou confuso.
- Tarefas complexas.
- Participantes com alto risco de erro por contexto.
- Pesquisa exploratória.
- Quando perguntas de aprofundamento são essenciais.
- Quando o protótipo pode quebrar e exigir assistência.

### Vantagens

- Escala maior.
- Menor custo por sessão.
- Menos influência do moderador.
- Mais rapidez para coletar respostas.

### Limitações

- Você não pode pedir esclarecimento no momento.
- Se a tarefa for mal escrita, perde-se a sessão.
- Problemas técnicos podem invalidar dados.
- Dificuldade de entender motivação profunda.

### Como escrever tarefas mais claras

- Use linguagem do usuário.
- Dê contexto, não instrução de clique.
- Defina um objetivo.
- Evite termos de interface.
- Deixe claro quando a tarefa termina.
- Evite tarefa longa demais.

---

## 9. Teste remoto

Teste remoto pode ser moderado ou não moderado. Em teste remoto moderado, o participante compartilha a tela e realiza tarefas enquanto conversa com o moderador.

### Como preparar

- Confirmar dispositivo e navegador.
- Enviar instruções simples.
- Testar link da reunião.
- Testar compartilhamento de tela.
- Preparar plano B.
- Confirmar autorização de gravação.
- Evitar tarefas com dados sensíveis reais.
- Ter protótipo e links prontos.

### Durante a sessão

- Reforce que o teste é do produto.
- Peça para compartilhar tela.
- Confirme que o participante consegue acessar.
- Oriente o think aloud.
- Observe cursor, hesitação, leitura, caminho e erros.
- Não assuma que silêncio significa entendimento.
- Registre problemas técnicos separadamente.

### Limitações

- Menos leitura de contexto físico.
- Possíveis atrasos e falhas de conexão.
- Dificuldade com pessoas pouco confortáveis com ferramentas.
- Menor controle sobre ambiente.
- Gravação e privacidade exigem cuidado.

---

## 10. Participantes e amostra

O participante certo vale mais que uma multidão errada. Testar com pessoas fora do público-alvo gera problemas que podem não existir e oculta problemas reais.

### Como definir perfil

Considere:

- experiência com o tema;
- frequência de uso;
- contexto de compra ou uso;
- dispositivo usado;
- idade/alfabetização digital quando relevante;
- necessidades de acessibilidade;
- papel no processo;
- experiência anterior com produtos parecidos;
- relação com o negócio.

### Qualitativo vs quantitativo

Em testes qualitativos, o objetivo é descobrir problemas. Ciclos pequenos funcionam bem quando há um grupo de usuários relativamente homogêneo e tarefas claras.

Em testes quantitativos, o objetivo é medir desempenho. Aí a amostra precisa ser maior, o protocolo mais rígido e os critérios mais controlados.

| Objetivo do teste | Perfil de participantes | Quantidade sugerida em alto nível | Observação |
|---|---|---|---|
| Descobrir problemas em protótipo | 1 perfil principal | 5 a 8 por rodada | Melhor iterar em ciclos |
| Comparar dois perfis | 2 segmentos distintos | 5 a 8 por segmento | Não misturar resultados |
| Testar fluxo crítico em produção | Usuários reais do fluxo | 6 a 10 qualitativo | Combinar com analytics |
| Medir taxa de sucesso | Perfil bem definido | Amostra maior | Exige desenho quantitativo |
| Testar acessibilidade | Pessoas com necessidades específicas | Depende do recorte | Recrutamento planejado |
| Benchmark formal | Segmento e tarefas estáveis | Amostra maior e controle | Definir métricas antes |

Não trate número como regra sagrada. O desenho do estudo depende do risco, do público e da decisão que será tomada.

---

## 11. Como planejar um teste de usabilidade

| Etapa | Objetivo | Cuidado | Entregável |
|---|---|---|---|
| 1. Definir objetivo do teste | Saber o que precisa aprender | Objetivo vago gera tarefa ruim | Objetivo do teste |
| 2. Definir decisões que o teste precisa apoiar | Conectar pesquisa à ação | Teste sem decisão vira relatório decorativo | Decisões-alvo |
| 3. Definir público-alvo | Recrutar pessoas certas | Participante errado invalida achado | Critérios de recrutamento |
| 4. Definir hipóteses | Declarar o que pode falhar | Não enviesar o teste para “provar” | Hipóteses |
| 5. Definir tarefas | Observar comportamento real | Não entregar o caminho | Lista de tarefas |
| 6. Definir critérios de sucesso | Julgar resultado com consistência | Definir antes da sessão | Critérios de sucesso |
| 7. Preparar protótipo ou ambiente | Garantir que a tarefa possa ser feita | Protótipo quebrado gera ruído | Protótipo/ambiente pronto |
| 8. Criar roteiro de moderação | Padronizar condução | Roteiro não é fala robótica | Guia de moderação |
| 9. Preparar termo de consentimento | Garantir ética e privacidade | Explicar gravação e uso dos dados | Consentimento |
| 10. Recrutar participantes | Cobrir perfis certos | Evitar só amigos/colegas | Screener |
| 11. Fazer piloto | Testar roteiro e ferramenta | Piloto quase sempre revela falhas | Roteiro ajustado |
| 12. Conduzir sessões | Coletar evidências | Não induzir, não ensinar | Notas e gravações |
| 13. Analisar resultados | Encontrar padrões e causas | Separar fato de interpretação | Mapa de problemas |
| 14. Priorizar problemas | Decidir o que corrigir primeiro | Severidade não é só frequência | Lista priorizada |
| 15. Comunicar recomendações | Mover decisão | Sem evidência, perde força | Relatório ou playback |

Um teste bem planejado começa pela decisão que precisa ser tomada, não pelo protótipo.

---

## 12. Objetivos e hipóteses do teste

Teste sem objetivo claro vira passeio guiado. O objetivo define quais tarefas serão criadas, quais participantes serão recrutados e quais dados importam.

### Diferença entre objetivo, hipótese e tarefa

| Elemento | O que é | Exemplo |
|---|---|---|
| Objetivo | O que queremos aprender | Entender se usuários conseguem encontrar e comparar produtos |
| Hipótese | O que suspeitamos que pode acontecer | Usuários terão dificuldade para diferenciar modelos porque atributos técnicos não estão claros |
| Tarefa | O que o participante fará | Encontre um produto adequado para uma pessoa iniciante e explique por que escolheria esse |
| Critério de sucesso | Como saber se a tarefa foi concluída | Usuário encontra produto adequado sem ajuda e justifica com informações da página |

### Exemplo completo

**Objetivo:** entender se compradores iniciantes conseguem escolher um produto adequado.  
**Hipótese:** usuários terão dificuldade porque a ficha técnica não traduz atributos em benefícios práticos.  
**Tarefa:** “Imagine que você vai comprar seu primeiro instrumento para estudar em casa. Encontre uma opção que pareça adequada e explique por que escolheria essa.”  
**Critério de sucesso:** encontra produto compatível, entende indicação de uso e demonstra confiança na decisão.

---

## 13. Como criar boas tarefas

Boas tarefas parecem situações reais. Elas dão contexto e objetivo, mas não entregam o caminho.

Princípios:

- Tarefas devem parecer reais.
- Tarefas devem ter objetivo, não instrução de clique.
- Não usar nomes exatos de botões.
- Não entregar a categoria, se a busca por categoria é parte do teste.
- Evitar linguagem interna.
- Não explicar a solução na tarefa.
- Permitir observar comportamento.
- Ter critério de sucesso definido.
- Evitar tarefas longas demais.
- Adaptar a tarefa ao perfil do participante.

| Tarefa ruim | Por que é ruim | Tarefa melhor | Por que é melhor | Critério de sucesso |
|---|---|---|---|---|
| Clique em “Produtos” e depois em “Violões” | Entrega o caminho | Você quer comprar seu primeiro instrumento para estudar. Encontre uma opção adequada. | Observa navegação real | Encontra produto compatível sem ajuda |
| Ache o botão de checkout | Testa label específico | Finalize a compra até a etapa de escolher pagamento. | Simula objetivo real | Chega ao pagamento sem erro crítico |
| Veja se essa landing está boa | Pede opinião vaga | Você quer entender se essa empresa resolve seu problema. Onde procuraria essa informação? | Observa busca por confiança | Encontra proposta e prova |
| Preencha esse formulário | Genérico demais | Solicite uma simulação usando dados fictícios e avise quando terminar. | Tem contexto e fim | Envia ou chega à confirmação |
| Use o filtro de preço | Entrega solução | Encontre uma opção dentro de um orçamento de R$ 500. | Testa filtro naturalmente | Aplica refinamento correto |
| Procure ajuda | Pouco realista | Você comprou e quer saber como trocar o produto. Encontre a orientação. | Testa central de ajuda | Encontra política correta |

Tarefa boa não pergunta “você sabe usar?”. Ela cria uma situação em que o uso precisa acontecer.

---

## 14. Cenários de tarefa

Cenário é o contexto que dá sentido à tarefa. Tarefa é a ação que a pessoa deve realizar.

### Exemplo

**Cenário:** você está comprando um presente para alguém que começou a tocar recentemente, mas você não entende muito de instrumentos.  
**Tarefa:** encontre uma opção que pareça segura para presente e explique o que te deu confiança.

O cenário ajuda a pessoa entrar na situação. Mas cenário longo demais vira novela e aumenta carga cognitiva.

### Cenário bom

- Curto.
- Realista.
- Tem motivação.
- Não entrega o caminho.
- Compatível com o perfil do participante.

### Cenário ruim

- Longo demais.
- Cheio de detalhes irrelevantes.
- Usa termos internos.
- Entrega a seção ou botão.
- Força um comportamento artificial.

| Cenário ruim | Problema | Cenário melhor |
|---|---|---|
| “Entre no menu Produtos, clique em Guitarras e veja a Fender X.” | Entrega o caminho | “Você quer comprar uma guitarra para estudar em casa. Encontre uma opção que pareça adequada.” |
| “Sua persona é um usuário digital omnichannel em jornada de conversão.” | Linguagem artificial | “Você quer comparar duas opções antes de comprar.” |
| “Você precisa acessar a área institucional para comprovar reputação.” | Entrega intenção interna | “Antes de comprar, você quer saber se a marca é confiável.” |

---

## 15. Roteiro de moderação

### 15.1 Abertura

- Olá, obrigado por participar.
- Hoje vamos testar um produto/protótipo, não você.
- Não existe resposta certa ou errada.
- Queremos entender o que funciona, o que confunde e o que pode melhorar.
- Algumas partes podem estar incompletas.
- Posso gravar a sessão para análise interna?
- Você pode parar a qualquer momento.

### 15.2 Aquecimento

Perguntas rápidas:

- Você já usou algo parecido?
- Como costuma resolver esse tipo de situação hoje?
- Que dispositivo normalmente usaria?
- Quão familiar você é com esse tema?

O aquecimento não deve virar entrevista longa. Ele existe para contextualizar a sessão.

### 15.3 Instruções

- Aja como faria normalmente.
- Pense em voz alta sempre que possível.
- Conte o que está procurando.
- Se algo estiver confuso, fale.
- Se você ficar travado, tudo bem.
- Eu posso fazer perguntas, mas vou tentar não ajudar no caminho.

### 15.4 Tarefas

Modelo:

```txt
Tarefa 1:
[cenário curto]
[objetivo da tarefa]

Perguntas pós-tarefa:
- O que aconteceu nessa tarefa?
- O que ficou claro?
- O que ficou confuso?
- O que você esperava encontrar?
- Quão confiante você ficou na decisão?
```

### 15.5 Encerramento

- Tem algo que você esperava encontrar e não encontrou?
- Teve alguma parte especialmente confusa?
- O que você mudaria primeiro?
- Há algo importante que eu não perguntei?
- Obrigado pela participação.

---

## 16. Think aloud

Think aloud é pedir que a pessoa fale o que está pensando enquanto executa a tarefa. Ele ajuda a entender intenção, expectativa e confusão no momento em que acontecem.

### Quando usar

- Testes moderados qualitativos.
- Protótipos com incerteza de compreensão.
- Fluxos com decisão.
- Navegação, busca, formulário e checkout.

### Limitações

- Algumas pessoas falam pouco.
- Falar pode alterar o tempo da tarefa.
- Em teste quantitativo, pode interferir na métrica.
- Em tarefas muito cognitivas, pode sobrecarregar.

### Como incentivar sem induzir

Frases neutras:

- “O que você está pensando agora?”
- “O que você está procurando?”
- “O que te fez escolher esse caminho?”
- “O que você esperava que acontecesse?”
- “Me conte o que está passando pela sua cabeça.”
- “O que chamou sua atenção?”
- “O que você faria agora se estivesse sozinho?”

Evite reagir com “isso!”, “perfeito”, “quase”, “não é por aí”. Isso entrega feedback e muda o comportamento.

---

## 17. O que observar durante o teste

| Sinal observado | O que pode indicar | Exemplo | Como investigar sem induzir |
|---|---|---|---|
| Hesitação | Dúvida ou baixa confiança | Para antes de clicar | “O que você está considerando?” |
| Clique errado | Label ou expectativa ruim | Clica em “Sobre” procurando garantia | “O que você esperava encontrar ali?” |
| Volta para tela anterior | Caminho não confirmou expectativa | Abre categoria e volta | “O que fez você voltar?” |
| Leitura repetida | Texto pouco claro | Relê instrução do formulário | “O que está tentando entender?” |
| Busca por ajuda | Fluxo não é autossuficiente | Procura FAQ no checkout | “Que informação você está procurando?” |
| Confusão com termo | Linguagem interna | Não entende “eletroacústico” | “Como você interpretou esse termo?” |
| Frustração | Esforço alto | Suspira, ri, diz “não achei” | “O que está dificultando?” |
| Abandono | Problema crítico | Desiste da tarefa | “O que faria você parar aqui?” |
| Contorno do fluxo | Solução alternativa | Abre Google para buscar | “Por que escolheu esse caminho?” |
| Sucesso com esforço alto | Tarefa concluída, mas com atrito | Compra, mas demorou muito | “Como foi esse processo para você?” |
| Sucesso parcial | Chega perto, mas não conclui | Acha produto, não calcula frete | Registrar como parcial |
| Comentário espontâneo | Sinal de expectativa ou dor | “Achei que teria comparação” | Pedir exemplo |

O que a pessoa faz vale mais do que o que ela diz depois tentando racionalizar.

---

## 18. Como registrar notas

Notas boas separam **observação** de **interpretação**.

Observação: “P2 clicou em FAQ para procurar garantia.”  
Interpretação: “O link de garantia não está visível na PDP.”  
Recomendação: “Adicionar bloco de garantia próximo ao CTA.”

Modelo:

| Participante | Tarefa | Observação | Fala relevante | Resultado | Severidade preliminar | Possível causa | Evidência |
|---|---|---|---|---|---|---|---|
| P1 | Encontrar produto iniciante | Abriu 3 produtos e voltou à lista | “Não sei qual é para iniciante.” | Parcial | Alta | Falta de indicação por perfil | Vídeo 12:30 |
| P2 | Calcular frete | Procurou frete no checkout, não na PDP | “Só vou saber no final?” | Sucesso com esforço | Média | Frete aparece tarde | Nota sessão |
| P3 | Encontrar política de troca | Usou busca e digitou “devolver” | “Não achei troca no rodapé.” | Falha | Alta | Label invisível | Gravação 08:10 |

### Boas práticas

- Registrar momento da tarefa.
- Marcar se houve ajuda.
- Anotar falas literais curtas.
- Registrar caminho percorrido.
- Separar bug, usabilidade, conteúdo e IA.
- Evitar conclusões durante a sessão.
- Manter evidência rastreável.

---

## 19. Métricas úteis em teste de usabilidade

| Métrica | O que mede | Quando usar | Cuidado |
|---|---|---|---|
| Sucesso da tarefa | Se a pessoa concluiu | Todo teste com tarefa | Definir critério antes |
| Sucesso direto | Concluiu sem erro/ajuda | Fluxos críticos | Pode ser rigoroso demais |
| Sucesso indireto | Concluiu com desvio/ajuda | Diagnóstico qualitativo | Não esconder esforço alto |
| Falha | Não concluiu | Fluxos essenciais | Entender causa |
| Tempo na tarefa | Eficiência | Benchmark e comparação | Não usar sozinho |
| Número de erros | Qualidade do caminho | Formulários e checkout | Definir erro previamente |
| Pedidos de ajuda | Autonomia | Teste moderado | Ajuda muda resultado |
| Caminho percorrido | Navegação/IA | Busca, menu, categorias | Interpretar com contexto |
| Taxa de abandono | Ponto de desistência | Produto em produção | Precisa analytics |
| Confiança percebida | Segurança na decisão | Compra, cadastro, configuração | Atitudinal; combinar com comportamento |
| Satisfação pós-tarefa | Percepção imediata | Benchmark leve | Não substitui observação |
| Severidade | Prioridade do problema | Síntese | Não é só frequência |

Métrica boa responde uma decisão. Se você não sabe o que fará com a métrica, provavelmente não precisa coletá-la.

---

## 20. Taxa de sucesso

Taxa de sucesso é uma das métricas mais simples e úteis: mede a proporção de participantes que concluíram uma tarefa.

### Categorias possíveis

- **Sucesso:** concluiu sem ajuda relevante e atingiu o objetivo.
- **Sucesso parcial:** chegou perto, concluiu com esforço alto ou ajuda.
- **Falha:** não concluiu, desistiu ou chegou ao resultado errado.

### Exemplo simples

Tarefa: encontrar uma opção adequada para iniciante.

| Participante | Resultado |
|---|---|
| P1 | Sucesso |
| P2 | Sucesso parcial |
| P3 | Falha |
| P4 | Sucesso |
| P5 | Falha |

Se considerar apenas sucesso completo:

```txt
2 sucessos / 5 participantes = 40% de sucesso
```

Se considerar sucesso + parcial separadamente:

```txt
Sucesso completo: 40%
Sucesso parcial: 20%
Falha: 40%
```

A taxa de sucesso precisa ser interpretada junto com observações. Uma tarefa pode ter 80% de sucesso e ainda ser ruim se todos chegam lá sofrendo.

---

## 21. Severidade de problemas

Severidade ajuda a priorizar o que corrigir primeiro. Ela não depende apenas de quantas pessoas tiveram o problema. Um problema que acontece uma vez, mas impede compra, pode ser crítico.

Critérios úteis:

- impacto na conclusão da tarefa;
- frequência observada;
- persistência;
- facilidade de recuperação;
- impacto no negócio;
- impacto em acessibilidade;
- confiança na evidência;
- etapa do funil;
- risco legal ou operacional.

| Nível | Definição | Exemplo | Ação recomendada |
|---|---|---|---|
| Crítico | Impede tarefa essencial ou causa abandono grave | Usuário não consegue finalizar pagamento | Corrigir antes de lançar |
| Alto | Causa erro importante, perda de confiança ou esforço alto | Usuário não entende qual plano/produto escolher | Priorizar no ciclo atual |
| Médio | Gera fricção, mas há contorno | Usuário acha garantia só depois de procurar muito | Corrigir em iteração próxima |
| Baixo | Incômodo menor, sem bloquear tarefa | Texto repetitivo ou label melhorável | Acumular e corrigir quando possível |
| Observação | Sinal a acompanhar | Comentário isolado sem impacto claro | Monitorar ou pesquisar mais |

Severidade deve ser justificada com evidência, não com dramaticidade do pesquisador. Drama sem evidência é teatro, não UX.

---

## 22. Como analisar os resultados

| Etapa | Objetivo | Cuidado | Entregável |
|---|---|---|---|
| 1. Reunir notas | Centralizar dados | Não perder contexto | Base de observações |
| 2. Organizar por tarefa | Comparar comportamento | Não misturar tarefas diferentes | Quadro por tarefa |
| 3. Identificar sucessos e falhas | Ver desempenho | Critério definido antes | Taxas qualitativas |
| 4. Agrupar problemas semelhantes | Encontrar padrões | Não forçar agrupamentos | Grupos de problemas |
| 5. Identificar causas prováveis | Entender por que ocorreu | Separar causa de sintoma | Hipóteses de causa |
| 6. Classificar severidade | Priorizar | Considerar impacto e frequência | Lista priorizada |
| 7. Separar tipos de problema | Direcionar solução | Usabilidade ≠ bug ≠ conteúdo | Categorias |
| 8. Criar recomendações | Transformar achado em ação | Não pular evidência | Recomendações |
| 9. Priorizar próximos passos | Conectar com entrega | Alinhar esforço e impacto | Backlog |
| 10. Preparar relatório | Comunicar decisão | Ser direto | Relatório/playback |

Tipos de problema:

- **Usabilidade:** comportamento, interação, fluxo, feedback.
- **Conteúdo:** texto, label, instrução, informação ausente.
- **IA:** estrutura, categoria, navegação, busca.
- **Visual/hierarquia:** atenção, destaque, legibilidade.
- **Acessibilidade:** teclado, contraste, leitor de tela, foco.
- **Bug:** comportamento técnico incorreto.
- **Performance:** lentidão, carregamento, travamento.
- **Negócio:** regra, preço, política, restrição.

---

## 23. Como transformar problema em recomendação

Cadeia recomendada:

```txt
Observação
↓
Problema
↓
Evidência
↓
Impacto
↓
Causa provável
↓
Recomendação
↓
Próximo teste
```

| Observação | Problema | Evidência | Impacto | Recomendação | Prioridade |
|---|---|---|---|---|---|
| 4 de 6 usuários procuraram frete na PDP e não acharam | Custo total aparece tarde | Tarefas 2 e 3 | Risco de abandono | Adicionar simulação de frete na PDP | Alta |
| 3 usuários não entenderam “eletroacústico” | Linguagem técnica não traduz uso | Falas e hesitação | Escolha insegura | Criar bloco “o que significa na prática” | Alta |
| Usuários clicaram em “Sobre” procurando garantia | Política de garantia tem baixo scent | Caminhos errados | Perda de confiança | Linkar garantia na PDP e rodapé | Média |
| Participantes não perceberam CTA secundário | Hierarquia visual fraca | Observação de cliques | Ação importante invisível | Revisar contraste e posição | Média |

Recomendação boa é específica, rastreável e testável. Recomendação ruim é “melhorar a experiência”.

---

## 24. Relatório de teste de usabilidade

Estrutura recomendada:

### 1. Contexto

O que foi testado, por quê e em que estágio.

### 2. Objetivo do teste

Quais decisões o teste deveria apoiar.

### 3. Método

Moderado/não moderado, remoto/presencial, qualitativo/quantitativo, duração e formato.

### 4. Participantes

Perfil, quantidade, critérios de recrutamento e observações relevantes.

### 5. Protótipo ou produto testado

Versão, link, limitações e escopo.

### 6. Tarefas

Lista de tarefas e cenários.

### 7. Critérios de sucesso

Como sucesso, parcial e falha foram definidos.

### 8. Principais achados

3 a 7 achados principais. Poucos, fortes e acionáveis.

### 9. Problemas por severidade

Problemas críticos, altos, médios e baixos.

### 10. Evidências

Observações, falas, trechos de gravação, prints e métricas.

### 11. Recomendações

O que fazer, por quê, prioridade e responsável.

### 12. Próximos passos

Correções, reteste, novas pesquisas ou métricas.

### 13. Apêndice

Roteiro, screener, notas, dados brutos anonimizados.

Relatório bom não é grande. É claro. Se o stakeholder não sabe o que fazer depois de ler, o relatório falhou.

---

## 25. Teste de usabilidade e acessibilidade

Acessibilidade precisa entrar no teste de usabilidade porque usuários têm capacidades, tecnologias, contextos e limitações diferentes. Testar só com usuários sem necessidades de acesso pode esconder barreiras sérias.

### Quando recrutar pessoas com deficiência

- Serviços públicos ou essenciais.
- Produtos com público amplo.
- Fluxos críticos de compra, cadastro, pagamento ou suporte.
- Produtos que precisam cumprir requisitos de acessibilidade.
- Quando há suspeita de barreira em teclado, leitura, contraste, foco ou entendimento.

### Cuidados

- Recrutar com respeito e clareza.
- Perguntar necessidades antes da sessão.
- Permitir tecnologias assistivas.
- Dar mais tempo quando necessário.
- Não tratar a pessoa como “caso especial”.
- Adaptar formato de sessão.
- Não forçar exposição de informações sensíveis.
- Garantir consentimento e privacidade.

### Usabilidade vs acessibilidade

Um problema pode ser geral de usabilidade e também ter impacto maior em acessibilidade. Exemplo: foco invisível atrapalha qualquer pessoa, mas pode bloquear quem navega por teclado.

Checklist automático não substitui teste com pessoas. Ferramenta encontra parte dos problemas; comportamento real mostra o impacto.

---

## 26. Testes em diferentes estágios

| Estágio | O que testar | Tipo de protótipo/produto | Método recomendado | Saída esperada |
|---|---|---|---|---|
| Sketch/wireframe | Conceito, estrutura, sequência | Baixa fidelidade | Moderado qualitativo | Problemas grandes e ajustes |
| Protótipo navegável | Fluxo, compreensão, conteúdo | Média/alta fidelidade | Moderado com tarefas | Lista de problemas por tarefa |
| Beta | Uso quase real | Produto funcional | Moderado + analytics | Ajustes antes do lançamento |
| Produto em produção | Gargalos reais | Produto atual | Teste + analytics | Backlog priorizado |
| Redesign | Comparação e riscos | Atual + novo protótipo | Teste comparativo qualitativo | Riscos da mudança |
| Melhoria contínua | Pontos específicos | Produto atual | Rodadas curtas | Evidência para iteração |

Quanto mais cedo o teste, mais barato corrigir. Quanto mais tarde, mais fiel o comportamento. O ideal é testar em ciclos.

---

## 27. Erros comuns em testes de usabilidade

- Perguntar “você gostou?” como pergunta central.
- Ensinar o usuário durante a tarefa.
- Entregar o caminho no enunciado.
- Defender a interface.
- Testar com participantes errados.
- Testar tarde demais.
- Testar só desktop.
- Ignorar mobile.
- Confundir bug com problema de usabilidade.
- Não fazer piloto.
- Não definir critério de sucesso.
- Não registrar evidência.
- Apresentar opinião do pesquisador como achado.
- Tratar teste pequeno como prova estatística.
- Ignorar problemas de acessibilidade.
- Sair sem recomendação e próximo passo.
- Usar tarefa artificial.
- Mudar o roteiro a cada participante sem motivo.
- Misturar vários perfis e tirar conclusão única.
- Focar em quantidade de problemas em vez de severidade.
- Fazer relatório gigante sem decisão.

Teste de usabilidade ruim pode dar falsa segurança. Pior do que não testar é testar mal e achar que validou.

---

## 28. Checklist antes do teste

- [ ] Objetivo definido.
- [ ] Decisões que o teste apoiará definidas.
- [ ] Hipóteses claras.
- [ ] Público-alvo definido.
- [ ] Critérios de recrutamento definidos.
- [ ] Tarefas criadas.
- [ ] Cenários revisados.
- [ ] Critérios de sucesso definidos.
- [ ] Protótipo/produto pronto.
- [ ] Dados sensíveis evitados ou protegidos.
- [ ] Roteiro revisado.
- [ ] Termo de consentimento preparado.
- [ ] Ferramenta de gravação testada.
- [ ] Link de reunião/protótipo testado.
- [ ] Piloto realizado.
- [ ] Observadores alinhados.
- [ ] Planilha/template de notas preparado.

---

## 29. Checklist durante o teste

- [ ] Reforçar que o teste é do produto, não da pessoa.
- [ ] Confirmar consentimento.
- [ ] Explicar gravação.
- [ ] Pedir think aloud.
- [ ] Ler tarefas sem explicar caminho.
- [ ] Observar comportamento.
- [ ] Não induzir.
- [ ] Não defender interface.
- [ ] Registrar evidências.
- [ ] Marcar ajuda/intervenção.
- [ ] Fazer perguntas neutras.
- [ ] Controlar tempo.
- [ ] Respeitar desconforto do participante.
- [ ] Encerrar com agradecimento.

---

## 30. Checklist depois do teste

- [ ] Consolidar notas.
- [ ] Revisar gravações quando necessário.
- [ ] Organizar por tarefa.
- [ ] Marcar sucesso, parcial e falha.
- [ ] Agrupar problemas.
- [ ] Separar bug, usabilidade, IA, conteúdo e acessibilidade.
- [ ] Classificar severidade.
- [ ] Conectar problemas a evidências.
- [ ] Gerar recomendações.
- [ ] Priorizar correções.
- [ ] Compartilhar relatório/playback.
- [ ] Definir responsáveis.
- [ ] Planejar reteste dos pontos críticos.

---

## 31. Como aplicar em um projeto real

Exemplo: **site institucional que será transformado em e-commerce**.

### Sequência recomendada

1. **Definir objetivos do teste**
   - Entender se usuários encontram produtos, compreendem a marca e conseguem comprar.

2. **Selecionar perfis de participantes**
   - Iniciante comprando primeiro produto.
   - Comprador experiente.
   - Pessoa comprando presente.
   - Revendedor/vendedor, se fizer sentido.

3. **Criar tarefas de compra e busca**
   - Encontrar produto para iniciante.
   - Comparar dois modelos.
   - Entender garantia.
   - Calcular frete.
   - Finalizar compra até pagamento.

4. **Testar navegação por categorias**
   - Observar se categorias e labels fazem sentido.

5. **Testar página de produto**
   - Ver se preço, ficha técnica, uso indicado, garantia e CTA estão claros.

6. **Testar comparação de produtos**
   - Observar se usuários conseguem diferenciar modelos.

7. **Testar carrinho**
   - Ver se resumo, frete, quantidade e alterações estão claros.

8. **Testar checkout**
   - Identificar erros, fricções e abandono.

9. **Testar busca e filtros**
   - Observar termos usados e refinamento.

10. **Testar conteúdo institucional de confiança**
   - Ver se história, garantia e prova social ajudam ou distraem.

11. **Registrar problemas**
   - Por tarefa, severidade e evidência.

12. **Priorizar melhorias**
   - Impacto para compra, esforço e risco.

13. **Retestar pontos críticos**
   - Principalmente PDP, busca/filtros e checkout.

### Exemplo aplicado

| Elemento | Exemplo |
|---|---|
| Hipótese | Usuários iniciantes não conseguirão escolher entre modelos por falta de tradução técnica. |
| Tarefa | “Você quer comprar seu primeiro instrumento para estudar em casa. Encontre uma opção adequada e explique por que escolheria essa.” |
| Critério de sucesso | Usuário encontra produto compatível, entende indicação e demonstra confiança sem ajuda. |
| Problema observado | Usuários abrem várias PDPs e voltam à listagem sem conseguir diferenciar. |
| Severidade | Alta |
| Recomendação | Adicionar bloco “Ideal para”, comparação simples e explicação de termos técnicos. |

Outro exemplo:

| Elemento | Exemplo |
|---|---|
| Hipótese | Usuários abandonarão se o frete só aparecer no checkout. |
| Tarefa | “Antes de comprar, veja quanto ficaria para receber em sua cidade.” |
| Critério de sucesso | Usuário encontra cálculo de frete sem precisar iniciar checkout. |
| Problema observado | Usuário procura frete na PDP, rodapé e FAQ antes de ir ao carrinho. |
| Severidade | Alta |
| Recomendação | Inserir simulação de frete na PDP e no carrinho. |

---

## 32. Relação com outros arquivos da base

- **01_UX_RESEARCH_METHODS.md** — ajuda a escolher quando teste de usabilidade é o método certo.
- **02_DISCOVERY_AND_DOUBLE_DIAMOND.md** — posiciona teste na fase de Deliver/validação e em ciclos de aprendizado.
- **03_USER_INTERVIEWS_AND_CONTEXT.md** — diferencia teste de entrevista e ajuda na condução sem viés.
- **04_SYNTHESIS_AND_MAPPING.md** — orienta como transformar observações em achados e recomendações.
- **05_INFORMATION_ARCHITECTURE.md** — conecta teste de usabilidade com navegação, busca, labels e tree testing.
- **06_IDEATION_AND_WORKSHOPS.md** — gera hipóteses e protótipos que serão testados aqui.
- **08_UX_METRICS.md** — aprofunda taxa de sucesso, SUS, tempo, satisfação e benchmark.
- **09_ECOMMERCE_UX_RESEARCH.md** — aplica teste a busca, filtros, PDP, carrinho e checkout.
- **10_ACCESSIBILITY_RESEARCH.md** — aprofunda testes com pessoas com deficiência e tecnologias assistivas.
- **11_RESEARCHOPS.md** — organiza recrutamento, consentimento, repositório e cadência de testes.

Teste de usabilidade é a ponte entre solução proposta e comportamento real observado.

---

## 33. Fontes utilizadas

- NN/g — Usability Testing 101: https://www.nngroup.com/articles/usability-testing-101/
- NN/g — Usability Testing 101 (Video): https://www.nngroup.com/videos/usability-testing-101/
- NN/g — Qualitative Usability Testing Study Guide: https://www.nngroup.com/articles/qual-usability-testing-study-guide/
- NN/g — Why You Only Need to Test with 5 Users: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/
- NN/g — Success Rate: The Simplest Usability Metric: https://www.nngroup.com/articles/success-rate-the-simplest-usability-metric/
- NN/g — Task Scenarios for Usability Testing: https://www.nngroup.com/articles/task-scenarios-usability-testing/
- NN/g — Turn User Goals into Task Scenarios for Usability Testing: https://www.nngroup.com/articles/usability-test-tasks/
- NN/g — Thinking Aloud: The #1 Usability Tool: https://www.nngroup.com/articles/thinking-aloud-the-1-usability-tool/
- NN/g — What You Can Get Wrong in Usability Testing: https://www.nngroup.com/articles/usability-testing-wrong/
- NN/g — Severity Ratings for Usability Problems: https://www.nngroup.com/articles/severity-ratings/
- GOV.UK Service Manual — Using moderated usability testing: https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing
- GOV.UK Service Manual — Remote user research by phone and video call: https://www.gov.uk/service-manual/user-research/remote-user-research-phone-video-call
- GOV.UK Service Manual — Taking notes and recording user research sessions: https://www.gov.uk/service-manual/user-research/taking-notes-and-recording-user-research-sessions
- GOV.UK Service Manual — Managing user research data and participant privacy: https://www.gov.uk/service-manual/user-research/managing-user-research-data-participant-privacy
- GOV.UK Service Manual — Running research sessions with people with disabilities: https://www.gov.uk/service-manual/user-research/running-research-sessions-with-people-with-disabilities
- GOV.UK User Research Blog — Advice for better moderated usability testing: https://userresearch.blog.gov.uk/2019/08/05/advice-for-better-moderated-usability-testing/
- Digital.gov — Usability testing: https://digital.gov/guides/research-collaboration/testing/usability
- Digital.gov — Usability: https://digital.gov/topics/usability
- Digital.gov — Plain Language: Usability testing: https://digital.gov/guides/plain-language/test/usability-testing
- Digital.gov — Test for understanding: https://digital.gov/guides/plain-language/test
- Digital.gov — Uncovering impactful solutions through user research: https://digital.gov/2024/10/04/uncovering-impactful-solutions-through-user-research
- Digital NSW — Usability testing: https://www.digital.nsw.gov.au/delivery/digital-service-toolkit/resources/user-research-methods/usability-testing

---

## 34. Resumo executivo

Use este arquivo quando houver uma solução concreta para avaliar: protótipo, fluxo, página, produto em produção, serviço ou conteúdo.

A lógica principal é:

```txt
Objetivo do teste
↓
Hipóteses
↓
Tarefas realistas
↓
Critérios de sucesso
↓
Sessões com usuários
↓
Observações
↓
Problemas
↓
Severidade
↓
Recomendações
↓
Reteste
```

O Claude Cowork deve usar este documento para:

- planejar testes de usabilidade;
- criar tarefas e cenários;
- montar roteiro de moderação;
- definir critérios de sucesso;
- orientar condução neutra;
- classificar problemas por severidade;
- transformar observações em recomendações;
- criar relatório e plano de correção;
- conectar teste com métricas, acessibilidade e próximos ciclos.

Teste de usabilidade não “aprova” uma solução por gosto. Ele revela se pessoas conseguem usar a solução para cumprir tarefas reais com clareza, confiança e o menor esforço possível.
