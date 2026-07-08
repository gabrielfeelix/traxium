# 03_USER_INTERVIEWS_AND_CONTEXT — Entrevistas e Pesquisa Contextual

> Arquivo de pesquisa qualitativa com pessoas. Serve para **planejar, conduzir e interpretar entrevistas e pesquisa em contexto** em projetos reais.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 25. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é a base para tudo que envolve **ouvir e observar usuários** com método. Ele orienta como conduzir entrevistas e pesquisa contextual sem induzir respostas, e como transformar conversas e observações em achados que mudam decisões.

Serve também como fonte para gerar artefatos: roteiros de entrevista, scripts de moderação, checklists de preparação/condução/síntese, modelos de perguntas boas e ruins e instruções de pesquisa contextual.

Regra que atravessa o arquivo: **entrevista entende percepção, contexto, comportamento passado, necessidade e critério de decisão — não serve para validar opinião nem prever compra futura.**

---

## 2. O papel das entrevistas no UX Research

Entrevistas servem para entender **o "porquê"** por trás do que as pessoas fazem: motivações, contexto, histórico, critérios de decisão e dores reais. São rápidas de montar e profundas no que revelam.

**Que perguntas elas ajudam a responder:** como a pessoa faz hoje? por que faz assim? o que a trava? o que ela já tentou? o que pesa na decisão dela? qual o contexto em que isso acontece?

**Por que não servem para validar promessa de compra ou preferência abstrata:** o que a pessoa *diz* que faria no futuro ("eu usaria", "eu pagaria") é uma previsão pouco confiável — as pessoas não sabem prever o próprio comportamento e tendem a agradar o entrevistador. Entrevista capta intenção declarada, não comportamento.

**Ouvir opinião ≠ entender contexto.** Opinião ("achei legal") é frágil e volátil. O valor da entrevista está em extrair:
- **Contexto** — onde, quando e sob quais condições a pessoa age.
- **Comportamento** — o que ela de fato fez (não o que imagina que faria).
- **Necessidade** — o problema/objetivo por trás da ação.
- **Critério de decisão** — o que faz ela escolher A em vez de B.

Foque em **fatos e histórias concretas do passado**, não em opiniões e hipóteses sobre o futuro.

---

## 3. Quando usar entrevistas com usuários

| Situação | Por que entrevistar | Tipo de aprendizado esperado | Entregável gerado |
|---|---|---|---|
| **Início de projeto** | Entender o território antes de decidir | Contexto, hipóteses, linguagem do usuário | Insights iniciais, matriz CSD |
| **Descoberta de público** | Saber quem realmente usa e por quê | Perfis, motivações, segmentação qualitativa | Esboço de personas, perfis |
| **Entendimento de jornada** | Reconstruir como a pessoa faz hoje | Etapas, atritos e emoções ao longo do caminho | Jornada do usuário |
| **Investigação de dores** | Achar problemas reais, não supostos | Dores, necessidades e workarounds | Mapa de achados, lista de dores |
| **Decisão de compra** | Entender o que pesa na escolha | Critérios de decisão, objeções, gatilhos | Critérios de decisão, JTBD |
| **Abandono de fluxo** | Entender o "porquê" por trás do drop-off visto em dados | Motivos e contexto do abandono | Hipóteses de melhoria |
| **Mudança de produto existente** | Entender impacto e expectativas reais | Hábitos atuais, riscos de mudança | Recomendações, riscos mapeados |
| **Criação de novo serviço** | Validar que há necessidade real | Necessidades não atendidas, oportunidades | Mapa de oportunidades |

---

## 4. Quando não usar entrevistas como método principal

Entrevista é qualitativa e atitudinal. Ela **não** é o método certo para:

- **Medir frequência com precisão** — "quantos %?" exige survey ou analytics, não conversa.
- **Validar comportamento futuro** — "você usaria?" não prevê o que a pessoa fará.
- **Comparar performance de interfaces** — isso é teste de usabilidade/A-B, baseado em comportamento.
- **Provar estatisticamente uma hipótese** — amostra pequena não sustenta conclusão quantitativa.
- **Decidir entre duas versões de layout** — isso pede teste comportamental (usabilidade/A-B), não percepção declarada.
- **Medir conversão** — métrica de comportamento real, vem de analytics.
- **Substituir teste de usabilidade** — perguntar "esse fluxo é fácil?" não é o mesmo que observar a pessoa tentando usar. Para usabilidade, observe; não pergunte.

Em uma frase: entrevista é para **entender**, não para **medir** nem para **avaliar usabilidade**.

---

## 5. Tipos de entrevista

### 5.1 Entrevista estruturada
**Para que serve:** fazer as mesmas perguntas, na mesma ordem, a todos, para comparar respostas. **Quando usar:** quando comparabilidade entre participantes importa mais que profundidade. **Cuidados:** rigidez faz perder descobertas inesperadas. **Exemplo:** comparar como diferentes perfis descrevem o mesmo processo.

### 5.2 Entrevista semiestruturada
**Para que serve:** seguir um roteiro-guia, com liberdade para aprofundar quando algo interessante surge. É o padrão em UX. **Quando usar:** na maioria dos discoveries. **Cuidados:** exige facilitador que saiba sondar sem induzir. **Exemplo:** entender a jornada e as dores de um perfil de comprador.

### 5.3 Entrevista não estruturada
**Para que serve:** conversa aberta, sem roteiro rígido, seguindo o fluxo do participante. **Quando usar:** exploração muito inicial de um território desconhecido. **Cuidados:** difícil de sintetizar e comparar; fácil divagar. **Exemplo:** primeiras conversas em um domínio totalmente novo.

### 5.4 Entrevista em profundidade
**Para que serve:** conversa 1:1 longa para entender contexto, problemas e o porquê das ações (tipicamente de 30 min a 2 h). **Quando usar:** descoberta que exige profundidade. **Cuidados:** custo de tempo e recrutamento; cansaço do participante em sessões longas. **Exemplo:** entender em detalhe como alguém escolhe e compra um produto.

### 5.5 Entrevista com stakeholder
**Para que serve:** conversar com quem tem interesse no projeto (gestor, solicitante, áreas internas) para entender objetivos de negócio, restrições, histórico e métricas de sucesso. **Quando usar:** no início, para alinhar e mapear o terreno. **Cuidados:** *não confundir opinião de stakeholder com necessidade de usuário.* **Diferença-chave vs entrevista com usuário:** aqui você **pesquisa quem é o interlocutor antes** e busca alinhamento/engajamento; na entrevista com usuário você mantém **neutralidade** e sabe pouco sobre a pessoa de propósito, para não enviesar. (Use stakeholder interviews neste arquivo só para marcar essa diferença — o foco é o usuário.)

### 5.6 Entrevista com especialista
**Para que serve:** acelerar o entendimento de um domínio complexo conversando com quem o domina (que pode não ser usuário). **Quando usar:** temas técnicos, regulados ou de nicho. **Cuidados:** especialista ≠ usuário; pode ter visão enviesada pela própria expertise. **Exemplo:** entender regras de um setor antes de desenhar o fluxo.

### 5.7 Entrevista exploratória
**Para que serve:** descobrir o desconhecido, gerar hipóteses e mapear o território (generativa). **Quando usar:** começo do discovery. **Cuidados:** sem objetivo de pesquisa, vira papo solto. **Exemplo:** levantar hipóteses de dor antes de definir o problema.

### 5.8 Entrevista avaliativa
**Para que serve:** captar **percepções e reações** sobre uma solução ou conceito. **Quando usar:** para entender o que a pessoa acha de uma proposta. **Cuidados:** **não substitui teste de usabilidade** — entrevista capta percepção declarada, não o comportamento de uso. Para saber se é usável, observe a pessoa usando. **Exemplo:** ouvir reações a um conceito de produto (não à usabilidade da tela).

---

## 6. Como planejar uma entrevista

### 1. Definir objetivo da pesquisa
**Objetivo:** saber o que se quer aprender. **Cuidados:** objetivo vago gera roteiro inútil. **Entregável:** pergunta(s) de pesquisa.

### 2. Definir decisões que a pesquisa precisa apoiar
**Objetivo:** amarrar a pesquisa a uma decisão real. **Cuidados:** se nenhuma decisão depende disso, repense. **Entregável:** lista de decisões-alvo.

### 3. Definir público-alvo
**Objetivo:** decidir com quem falar. **Cuidados:** perfil errado = dado inútil. **Entregável:** definição de perfis.

### 4. Criar critérios de recrutamento
**Objetivo:** garantir que os participantes sejam usuários reais ou prováveis. **Cuidados:** evitar amostra de conveniência (amigos, colegas). **Entregável:** screener de recrutamento.

### 5. Criar roteiro
**Objetivo:** estruturar a conversa em torno do objetivo. **Cuidados:** roteiro é guia, não script lido. **Entregável:** roteiro de entrevista.

### 6. Preparar consentimento
**Objetivo:** informar e obter consentimento antes de gravar/coletar dados. **Cuidados:** consentimento antes de qualquer registro. **Entregável:** termo/ficha de consentimento.

### 7. Preparar ambiente e gravação
**Objetivo:** garantir um setup que funcione (inclusive acessível) e o registro combinado. **Cuidados:** testar equipamento; respeitar o que foi consentido. **Entregável:** checklist de setup.

### 8. Realizar piloto
**Objetivo:** testar o roteiro com 1 pessoa antes de rodar tudo. **Cuidados:** quase sempre revela perguntas confusas. **Entregável:** roteiro ajustado.

### 9. Conduzir entrevistas
**Objetivo:** coletar histórias e comportamento reais. **Cuidados:** falar menos que o participante; não induzir. **Entregável:** notas e gravações.

### 10. Sintetizar achados
**Objetivo:** transformar dado bruto em padrões e insights. **Cuidados:** separar fato de interpretação. **Entregável:** mapa de achados, insights.

### 11. Compartilhar aprendizados
**Objetivo:** levar a evidência a quem decide. **Cuidados:** anonimizar dados pessoais. **Entregável:** relatório/playback.

### 12. Conectar achados a decisões de produto
**Objetivo:** fechar o ciclo pesquisa → decisão. **Cuidados:** se não muda nada, foi desperdício. **Entregável:** recomendações priorizadas.

---

## 7. Como criar um bom roteiro de entrevista

Princípios:
- **Comece com perguntas fáceis** para deixar a pessoa confortável.
- **Construa rapport** antes de entrar em temas sensíveis.
- **Pergunte sobre experiências reais e passadas** ("conte sobre a última vez que…").
- **Peça exemplos concretos**, não generalizações ("sempre faço assim" → "me conta da última vez").
- **Evite perguntas induzidas** (que sugerem a resposta).
- **Evite perguntas hipotéticas demais** ("você usaria se…").
- **Aprofunde** com "por quê?", "me conta mais", "o que aconteceu depois?".
- **Separe os tipos de pergunta**: contexto, comportamento, dor, decisão e expectativa têm objetivos diferentes — não misture tudo numa pergunta só.

**Modelo de roteiro (estrutura):**

- **Abertura** — apresentar-se, explicar o objetivo, dizer que não há resposta certa/errada e que você quer aprender com a experiência da pessoa.
- **Consentimento** — explicar gravação e uso dos dados; obter consentimento.
- **Aquecimento** — perguntas fáceis sobre o dia a dia para criar rapport. *Ex.: "Me conta um pouco sobre como é seu dia a dia com [tema]."*
- **Contexto** — entender o ambiente e a situação de uso. *Ex.: "Onde e quando isso costuma acontecer?"*
- **Comportamento passado** — reconstruir ações reais. *Ex.: "Me conta sobre a última vez que você [fez X]. O que aconteceu, do começo ao fim?"*
- **Dores e fricções** — descobrir o que trava. *Ex.: "O que foi mais difícil ou irritante nessa última vez?"*
- **Critérios de decisão** — entender a escolha. *Ex.: "Como você decidiu entre as opções? O que pesou mais?"*
- **Soluções atuais** — o que a pessoa usa hoje e por quê. *Ex.: "Como você resolve isso hoje? O que você já tentou?"*
- **Encerramento** — perguntar se há algo que não foi abordado, agradecer, explicar próximos passos. *Ex.: "Tem algo importante sobre isso que eu não perguntei?"*

---

## 8. Perguntas boas vs perguntas ruins

| Pergunta ruim | Por que é ruim | Pergunta melhor | Por que é melhor |
|---|---|---|---|
| "Você usaria isso?" | Futuro hipotético; previsão não confiável | "Como você resolve isso hoje?" | Captura comportamento real e atual |
| "Você gostou?" | Convida elogio vago; sem ação | "O que você fez depois dessa tela?" | Foca em comportamento observável |
| "Você pagaria por isso?" | Intenção declarada ≠ compra real | "Conte da última vez que você pagou por algo assim. Como decidiu?" | Revela critério e disposição reais do passado |
| "Esse botão está bom?" | Pede opinião sobre UI; induz aprovação | "O que você esperava que acontecesse ao tocar aqui?" | Revela expectativa e modelo mental |
| "Você acha importante?" | Quase todo mundo diz "sim" | "Da última vez, isso afetou sua decisão? Como?" | Liga importância a um fato concreto |
| "O que você quer em um app?" | Pede solução imaginada; gera lista de desejos | "Qual foi a maior dificuldade da última vez que usou um app assim?" | Foca no problema real, não na solução sonhada |
| "Você prefere A ou B?" | Preferência declarada ≠ comportamento; vira survey | "Mostre como você faria isso normalmente." | Observa o comportamento em vez de perguntar preferência |

---

## 9. Como conduzir a sessão

- **Não venda a ideia** — você está aprendendo, não convencendo.
- **Não defenda a solução** — se a pessoa critica, explore a crítica em vez de justificar.
- **Deixe o silêncio acontecer** — pausas fazem a pessoa elaborar; não preencha.
- **Peça exemplos reais** — sempre que ouvir uma generalização, peça o caso concreto.
- **Não corrija o participante** — não existe resposta "errada"; o "erro" é dado.
- **Não explique demais** — instrução longa enviesa; pergunte e escute.
- **Observe linguagem corporal** quando possível — hesitação e expressão dizem muito.
- **Registre frases importantes** — citações literais sustentam achados depois.
- **Diferencie fala, comportamento e interpretação** — o que a pessoa disse, o que ela fez e o que você concluiu são três coisas distintas.
- **Controle o tempo sem cortar descobertas** — siga o roteiro, mas abra espaço quando surgir algo valioso.

---

## 10. Viés em entrevistas

### Viés de confirmação
**O que é:** ouvir/valorizar só o que confirma sua hipótese. **Exemplo:** anotar elogios e ignorar críticas. **Como reduzir:** buscar ativamente evidência que contrarie sua hipótese; registrar tudo.

### Viés de desejabilidade social
**O que é:** a pessoa responde o que acha socialmente aceitável ou o que agrada o entrevistador. **Exemplo:** dizer que "se preocupa muito com segurança" porque soa bem. **Como reduzir:** perguntar sobre comportamento passado concreto, manter postura neutra.

### Viés de recência
**O que é:** dar peso demais ao que aconteceu por último (na vida da pessoa ou na sua sequência de entrevistas). **Exemplo:** lembrar só da última entrevista na síntese. **Como reduzir:** sintetizar com base em notas de todas as sessões, não de memória.

### Viés de autoridade
**O que é:** a pessoa concorda porque o entrevistador parece especialista ou "dono" da solução. **Exemplo:** "se você fez assim, deve estar certo". **Como reduzir:** não se posicionar como autor da solução; reforçar que quer a opinião honesta.

### Viés de formulação da pergunta
**O que é:** a forma da pergunta induz a resposta. **Exemplo:** "Você não achou isso fácil?" empurra para o "sim". **Como reduzir:** perguntas abertas e neutras; revisar o roteiro caçando indução.

### Viés do entrevistador
**O que é:** tom, expressões e reações do entrevistador moldam as respostas. **Exemplo:** sorrir/assentir só quando ouve o que esperava. **Como reduzir:** reação neutra e consistente; idealmente, dois pesquisadores para checagem.

### Viés de amostra
**O que é:** falar com as pessoas erradas e generalizar. **Exemplo:** entrevistar só colegas e concluir sobre "os usuários". **Como reduzir:** recrutar pelo critério certo (usuários reais/prováveis) e com diversidade.

---

## 11. Pesquisa contextual

**O que é:** pesquisa feita no **ambiente real** em que a pessoa age (casa, trabalho, loja), observando comportamento natural em vez de só perguntar sobre ele.

**Diferença para a entrevista comum:** na entrevista, a pessoa **recorre à memória** e resume o processo — e detalhes (motivações, passos, modelo mental) se perdem. No contexto, você **observa enquanto acontece**, captando distrações, gambiarras e interrupções que ninguém lembra de relatar.

**Por que muda a qualidade dos achados:** garante alta **validade ecológica** — a certeza de que você está vendo o comportamento real, não uma versão idealizada. As pessoas conseguem falar com facilidade do que estão fazendo *enquanto fazem*.

**Quando usar:** quando o contexto e o ambiente importam (fluxos de trabalho, uso em situações específicas), e quando o domínio é desconhecido para você.

**Quando não usar:** quando não há acesso ao ambiente real, quando a pergunta é de escala (quanto/quantos) ou quando a tarefa não acontece num lugar observável.

---

## 12. Field studies

**O que são:** estudos no ambiente natural do usuário (*in situ*), em que o pesquisador acompanha a pessoa e observa seus comportamentos e atividades normais, geralmente por um período curto (como um dia).

**Quando usar:** para entender comportamento ligado a um ambiente específico; quando você não conhece bem o trabalho/atividade observada.

**Como aplicar:** ir ao local, observar a atividade real, fazer perguntas pontuais para entender o que vê. Funciona melhor **em dupla** (uma pessoa observa/registra, outra conduz).

**Exemplos de perguntas que respondem:** como a tarefa realmente acontece no dia a dia? que ferramentas e atalhos a pessoa usa? onde estão os atritos no ambiente real?

**Entregáveis possíveis:** notas de campo, fotos, mapa de experiência/jornada, insights contextuais.

**Cuidados éticos e logísticos:** consentimento de todos os presentes; permissão do local para foto/vídeo; respeito à privacidade e ao bem-estar; acesso ao ambiente pode ser difícil de conseguir.

---

## 13. Contextual inquiry

**O que é:** um tipo de field study que **combina observação aprofundada e entrevista** com uma pequena amostra, para entender práticas e comportamentos a fundo. Criado por Hugh Beyer e Karen Holtzblatt.

**Como combina observação e entrevista:** o pesquisador observa a pessoa realizando a tarefa **e** pergunta, durante a ação, como e por que ela faz cada coisa — interpretando junto com o participante.

**Quando usar:** nas fases iniciais de descoberta de um produto/feature, porque os dados moldam requisitos, personas, arquitetura e conteúdo.

**Como conduzir:** breve entrevista inicial para entender o contexto e o dia típico → observação da tarefa real → perguntas de esclarecimento durante a execução → interpretação colaborativa.

**Diferença entre perguntar depois e observar durante:** perguntar depois depende da memória e do resumo da pessoa (perde detalhe e motivação); observar durante captura o comportamento real e o "porquê" no momento em que ele ocorre.

**Exemplos em produtos digitais:** acompanhar um operador usando um sistema interno enquanto trabalha; observar alguém comprando online no próprio dispositivo e ambiente.

---

## 14. Diary studies

**O que é:** método de contexto em que os participantes **registram suas próprias experiências** (pensamentos, sentimentos, comportamentos) ao longo de um período. É feito de forma remota e assíncrona.

**Quando usar:** para entender experiências e atitudes **ao longo do tempo**, jornadas longas e atividades repetidas (algo que uma única sessão não captura).

**Quando não usar:** quando se precisa de resposta rápida; sem engajamento e acompanhamento dos participantes.

**Como planejar:** definir o que registrar e quando (gatilhos), fornecer um meio simples de captura, acompanhar a adesão e sintetizar ao final.

**Duração recomendada (alto nível):** tipicamente de alguns dias a algumas semanas — tempo suficiente para a experiência se manifestar, sem esgotar os participantes.

**Tipos de registro possíveis:** texto, foto, áudio, vídeo ou respostas a prompts curtos — quanto mais fácil registrar, melhor a adesão.

**Como evitar baixa adesão:** registros rápidos, lembretes/gatilhos claros, incentivo e instruções simples. Adesão é o principal risco do método.

**Como analisar os registros:** agrupar por padrões e por momento da jornada; buscar repetição (saturação) e variações ao longo do tempo.

**Exemplos de aplicação:** acompanhar o planejamento de uma compra que leva dias/semanas; entender como o uso de um produto evolui no primeiro mês.

---

## 15. Pesquisa remota em contexto

Dá para adaptar pesquisa contextual ao remoto, ciente de que apenas o usuário está *in situ* (a NN/g chama de "semicontextual inquiry"):

- **Compartilhamento de tela** — observar a pessoa usando o produto no próprio ambiente digital, em tempo real.
- **Gravação de jornada** — pedir que registre/grave o passo a passo de uma tarefa quando ela acontece.
- **Fotos do ambiente** — solicitar imagens do espaço/contexto real de uso.
- **Diários digitais** — registros assíncronos ao longo do tempo (ver Seção 14).
- **Entrevistas por vídeo** — conversa com observação parcial do ambiente via câmera.
- **Limites e cuidados:** sua visão do ambiente é limitada — distrações e gambiarras são mais difíceis de notar; exige mais atenção. Funciona melhor para tarefas que a pessoa consegue mostrar pela tela/câmera.

---

## 16. Notas, gravações e privacidade

- **Por que pedir consentimento:** as pessoas têm o direito de saber o que está sendo coletado e como será usado; é exigência legal (ex.: GDPR/LGPD) e ética. Obtenha consentimento **antes** de qualquer nota ou gravação.
- **Como registrar notas:** notas devem ficar em **observações** (o que se viu/ouviu), não em interpretações pessoais. Capte o que as pessoas *fazem* (tarefas, barreiras, navegação), *pensam* (objetivos, decisões, expectativas) e *sentem* (motivações, frustrações).
- **Como separar observação de interpretação:** registre o fato e a citação literal de um lado; suas hipóteses e conclusões do outro. Não os misture.
- **Como proteger dados pessoais:** use o material só para o que foi consentido; armazene com segurança; apague de dispositivos pessoais assim que transferir para local seguro.
- **Como anonimizar achados:** evite coletar dados que identifiquem (nomes, locais, organizações) quando possível; revise notas e gravações para remover dados pessoais antes de compartilhar.
- **Como compartilhar evidências com segurança:** use trechos/citações anonimizados; restrinja acesso ao material bruto; combine com a equipe como e o que pode ser compartilhado.

---

## 17. Síntese de entrevistas e contexto

Como transformar dado qualitativo em achado:

1. **Reunir notas e gravações** de todas as sessões.
2. **Separar fatos, falas e interpretações** — manter o que foi observado distinto do que foi concluído.
3. **Agrupar padrões** (ex.: affinity mapping) — juntar o que se repete entre participantes.
4. **Identificar dores, necessidades e critérios de decisão** a partir dos padrões.
5. **Criar insights** — conclusões acionáveis que ligam achado a significado.
6. **Conectar insights a oportunidades** — onde dá para melhorar a experiência.
7. **Priorizar recomendações** — o que fazer primeiro, por impacto/esforço.

| Dado bruto | Padrão observado | Insight | Oportunidade | Recomendação |
|---|---|---|---|---|
| "Abri 4 abas pra comparar preço e frete" (3 participantes) | Pessoas comparam preço **com frete** em várias abas | A decisão depende do **custo total**, não só do preço do produto | Mostrar custo total (com frete) cedo no fluxo | Exibir estimativa de frete já na página do produto |
| "Desisti porque não sabia se chegava a tempo" | Incerteza de prazo trava a compra | Falta de previsibilidade de entrega gera abandono | Tornar prazo de entrega visível e confiável | Adicionar estimativa de prazo por CEP antes do checkout |

---

## 18. Entregáveis comuns

- **Roteiro de entrevista** — guia semiestruturado de perguntas.
- **Screener de recrutamento** — critérios para selecionar participantes certos.
- **Termo de consentimento** — documento de consentimento informado.
- **Guia de moderação** — instruções de condução da sessão.
- **Notas de pesquisa** — registro estruturado de observações e falas.
- **Mapa de achados** — dados organizados em temas.
- **Affinity map** — agrupamento visual de padrões.
- **Matriz de insights** — insights ligados a evidências e oportunidades.
- **Jornada do usuário** — etapas, ações, emoções e atritos.
- **Jobs To Be Done** — o "trabalho" que a pessoa contrata o produto para fazer.
- **Mapa de oportunidades** — oportunidades priorizadas ligadas ao objetivo.
- **Relatório de pesquisa** — síntese de método, achados e recomendações.
- **Recomendações priorizadas** — o que fazer, em ordem de impacto.

---

## 19. Erros comuns

- **Entrevistar amigos como se fossem usuários** — amostra de conveniência distorce tudo.
- **Aceitar opinião como evidência** — opinião é hipótese, não fato.
- **Perguntar sobre futuro hipotético** — "você usaria?" não prevê comportamento.
- **Induzir resposta** — perguntas e reações que empurram para um lado.
- **Falar mais que o participante** — quem conduz deve escutar, não preencher.
- **Não registrar contexto** — sem contexto, a fala perde significado.
- **Ignorar contradições** — o que a pessoa diz e faz divergir é um achado, não um erro a esconder.
- **Transformar uma fala isolada em verdade** — um caso é pista, não regra.
- **Não recrutar os perfis corretos** — dado bom de perfil errado é inútil.
- **Não documentar evidências** — sem registro, o aprendizado some.
- **Não conectar pesquisa com decisão** — pesquisa que não muda nada é custo.

---

## 20. Checklist antes de entrevistar

- [ ] Objetivo de pesquisa e **decisão-alvo** definidos?
- [ ] Perfil de participante e **critérios de recrutamento** claros?
- [ ] Participantes são **usuários reais ou prováveis** (não amigos/colegas)?
- [ ] **Roteiro** pronto, com perguntas abertas e sem indução?
- [ ] **Piloto** realizado e roteiro ajustado?
- [ ] **Consentimento** preparado e setup/gravação combinados?
- [ ] Ambiente **acessível** ao participante?
- [ ] Definido **quem conduz** e **quem anota**?

---

## 21. Checklist durante a entrevista

- [ ] Expliquei o objetivo e obtive **consentimento** antes de gravar?
- [ ] Estou **falando menos** que o participante?
- [ ] Estou pedindo **exemplos reais do passado** em vez de hipóteses?
- [ ] Estou **evitando induzir** e mantendo reação neutra?
- [ ] Estou **deixando o silêncio** trabalhar?
- [ ] Estou **registrando frases literais** e separando fato de interpretação?
- [ ] Estou **aprofundando** com "por quê / me conta mais"?
- [ ] Estou **no tempo**, sem cortar descobertas importantes?

---

## 22. Checklist depois da entrevista

- [ ] **Notas e gravações** organizadas por sessão?
- [ ] **Fatos, falas e interpretações** separados?
- [ ] **Padrões** agrupados entre participantes?
- [ ] **Dores, necessidades e critérios de decisão** identificados?
- [ ] **Insights** criados e ligados a evidência?
- [ ] **Oportunidades e recomendações** priorizadas?
- [ ] Dados pessoais **anonimizados** e armazenados com segurança?
- [ ] Aprendizados **compartilhados** e conectados a decisões?

---

## 23. Como aplicar em um projeto real

**Cenário:** um site institucional de uma loja de instrumentos musicais que será transformado em e-commerce.

Sequência de entrevistas e pesquisa contextual:

1. **Entrevistar compradores iniciantes** — entender dúvidas, medos e critérios de quem está começando.
2. **Entrevistar compradores experientes** — entender o que valorizam, como comparam e o que os faz confiar numa loja.
3. **Entrevistar quem compra instrumento como presente** — perfil com pouca familiaridade técnica e critérios diferentes (preço, "vai agradar?", prazo).
4. **Entrevistar revendedores ou vendedores** — entender objeções recorrentes e dúvidas que mais aparecem no balcão.
5. **Observar como usuários pesquisam e comparam produtos** (pesquisa contextual / contextual inquiry remoto) — ver o comportamento real de comparação.
6. **Mapear dúvidas e critérios de decisão** a partir dos padrões.
7. **Identificar objeções de compra** (frete, confiança, dúvida técnica, prazo).
8. **Transformar achados em requisitos** de conteúdo (o que explicar), navegação (como organizar) e fluxo (como simplificar a compra).
9. **Validar com teste de usabilidade** depois — confirmar comportamento no protótipo.

**Exemplos de perguntas para esse caso:**
- *Iniciante:* "Conte sobre a última vez que você pesquisou um instrumento. O que te deixou inseguro?"
- *Experiente:* "Como você decide em qual loja comprar? O que te faz confiar (ou desistir)?"
- *Presente:* "Como foi escolher um instrumento de presente sem entender muito do assunto? O que te ajudou ou atrapalhou?"
- *Vendedor:* "Quais são as dúvidas e objeções que mais aparecem na hora da compra?"
- *Observação:* "Mostre como você normalmente compararia dois modelos antes de decidir."

> Mesmo sem orçamento para pesquisa formal, dá para rodar uma versão enxuta: poucas entrevistas com usuários reais + observação remota por compartilhamento de tela. É baixo atrito e muito superior a desenhar no escuro.

---

## 24. Relação com outros arquivos da base

- **`01_UX_RESEARCH_METHODS.md`** — o catálogo geral. Este arquivo aprofunda as entrevistas e os métodos de contexto que lá aparecem resumidos.
- **`02_DISCOVERY_AND_DOUBLE_DIAMOND.md`** — entrevistas e pesquisa contextual são o motor das etapas Discover (3 e 6 do discovery). Este arquivo detalha *como executá-las*.
- **`04_SYNTHESIS_AND_MAPPING.md`** — recebe a saída deste arquivo (notas e observações) e detalha affinity mapping, jornada e insights (a Seção 17 aqui é a ponte).
- **`05_INFORMATION_ARCHITECTURE.md`** — critérios de decisão e linguagem do usuário capturados em entrevista alimentam a arquitetura e o vocabulário.
- **`07_USABILITY_TESTING.md`** — complementa: entrevista capta percepção e contexto; teste de usabilidade capta comportamento. Use os dois, não um no lugar do outro.
- **`08_UX_METRICS.md`** — o qualitativo daqui explica o "porquê" por trás dos números (ex.: motivo de um abandono visto em analytics).

---

## 25. Fontes utilizadas

Links que você enviou, resumidos com palavras próprias (nenhum conteúdo copiado). Status de acesso indicado.

1. **User Interviews 101 — NN/g** — https://www.nngroup.com/articles/user-interviews/ — *Acessível (fundamentado).* Base sobre conduzir entrevistas e usá-las para perceber, não para medir usabilidade.
2. **Interviewing Users (topic) — NN/g** — https://www.nngroup.com/topic/interviewing-users/ — *Acessível.* Página-tema que reúne os materiais de entrevista da NN/g.
3. **The 3 Types of User Interviews — NN/g** — https://www.nngroup.com/videos/3-types-user-interviews/ — *Acessível.* Estruturada, semiestruturada e não estruturada; entrevistas medem percepção, não usabilidade.
4. **Stakeholder Interviews 101 — NN/g** — https://www.nngroup.com/articles/stakeholder-interviews/ — *Acessível.* Diferença entre entrevista com stakeholder e com usuário (neutralidade vs pesquisar o interlocutor).
5. **Using in-depth interviews — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research/using-in-depth-interviews — *Acessível.* Entrevistas em profundidade (30 min–2 h), com usuários reais/prováveis, combináveis com teste de usabilidade.
6. **Researching user experiences — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research/researching-user-experiences — *Acessível.* Reconstrução da experiência com cartões de eventos e mapa de experiência (60–90 min).
7. **Taking notes and recording sessions — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research/taking-notes-and-recording-user-research-sessions — *Acessível.* Notas como observação (não interpretação); consentimento antes de gravar; proteção de dados.
8. **Managing user research data and participant privacy — GOV.UK Service Manual** — https://www.gov.uk/service-manual/user-research/managing-user-research-data-participant-privacy — *Acessível.* O que conta como dado pessoal e como protegê-lo (referência a GDPR).
9. **Field Studies — NN/g** — https://www.nngroup.com/articles/field-studies/ — *Acessível.* Observação no ambiente natural (*in situ*), em período curto.
10. **When to Use Context Methods: Field and Diary Studies — NN/g** — https://www.nngroup.com/articles/context-methods-field-diary-studies/ — *Acessível.* Quando usar observação (field/CI) vs diário (ao longo do tempo); validade ecológica.
11. **Context Methods: Study Guide — NN/g** — https://www.nngroup.com/articles/context-methods-study-guide/ — *Acessível.* Visão geral de field studies, diary studies e contextual inquiry e suas diferenças.
12. **Diary Studies — NN/g** — https://www.nngroup.com/articles/diary-studies/ — *Acessível.* Diário remoto e assíncrono para experiências de longo prazo; conceito de saturação.
13. **Remote Contextual Inquiry — NN/g** — https://www.nngroup.com/articles/remote-contextual-inquiry/ — *Acessível.* "Semicontextual inquiry": só o usuário está in situ; bom para tarefas mostráveis por tela/vídeo.
14. **Researching in context — GOV.UK User Research Blog** — https://userresearch.blog.gov.uk/2019/05/02/researching-in-context/ — *Domínio acessível;* este post específico não retornou isoladamente nas buscas. Tema fundamentado pelo guia "Contextual research and observation" do próprio Service Manual.
15. **Advice for better moderated usability testing — GOV.UK User Research Blog** — https://userresearch.blog.gov.uk/2019/08/05/advice-for-better-moderated-usability-testing/ — *Domínio acessível;* este post específico não retornou isoladamente nas buscas. Usado de forma complementar (foco do arquivo é entrevista/contexto, não teste de usabilidade — ver `07`).

---

## 26. Resumo executivo

Este arquivo é o **manual de pesquisa qualitativa com pessoas** da base. O Claude Cowork deve usá-lo assim:

1. Para entender o **"porquê"** (contexto, comportamento, necessidade, critério de decisão), use **entrevistas** — nunca para medir frequência, prever compra ou avaliar usabilidade (Seções 2 e 4).
2. Para gerar artefatos, use os modelos: **roteiro** (Seção 7), **perguntas boas vs ruins** (Seção 8) e os **checklists** (Seções 20–22).
3. Para captar o comportamento real, prefira **pesquisa contextual / contextual inquiry**: observe enquanto acontece em vez de perguntar sobre o passado (Seções 11–13).
4. Para experiências ao longo do tempo, use **diary studies** (Seção 14); adapte ao **remoto** quando faltar acesso (Seção 15).
5. Cuide de **viés, consentimento e privacidade** (Seções 10 e 16) e feche transformando dado em **insight → oportunidade → recomendação** (Seção 17).

Princípio que guia tudo: **pergunte sobre o passado concreto, observe o comportamento real e separe o que a pessoa diz do que ela faz.**
