# 10_ACCESSIBILITY_RESEARCH — Acessibilidade na Experiência

> Arquivo de acessibilidade aplicada ao UX Research. Serve para **incluir acessibilidade na pesquisa, avaliação, validação e melhoria contínua** de produtos e serviços digitais.
> O foco não é “passar em checklist”: é remover barreiras reais para pessoas reais, combinando padrões técnicos, avaliação manual, ferramentas, testes com usuários e decisões de produto.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 32. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "acessibilidade como parte da experiência"** na base. Ele orienta como incluir acessibilidade no processo de UX, desde discovery até teste, entrega e melhoria contínua.

Responde, na prática:

- O que é acessibilidade digital.
- Como WCAG, WAI, eMAG e guidelines institucionais entram no processo.
- Por que acessibilidade não é só checklist técnico.
- Como pesquisar com pessoas com deficiência.
- Como planejar testes com tecnologias assistivas.
- Como combinar teste automatizado, revisão manual e teste com usuários.
- Como documentar problemas de acessibilidade.
- Como classificar severidade.
- Como incorporar acessibilidade em discovery, IA, conteúdo, protótipo, teste e métricas.
- Como evitar que acessibilidade vire correção tardia e cara.

Regra central: **acessibilidade não é etapa final; é critério de qualidade desde o começo.**

---

## 2. O que é acessibilidade digital

Acessibilidade digital é a prática de criar produtos, serviços e conteúdos digitais que possam ser usados por pessoas com diferentes capacidades, deficiências, contextos, dispositivos e tecnologias de apoio.

Ela envolve pessoas com:

- deficiência visual;
- baixa visão;
- daltonismo;
- deficiência auditiva;
- deficiência motora;
- deficiência de fala;
- deficiência cognitiva;
- neurodivergências;
- dificuldades de leitura;
- limitações temporárias;
- limitações situacionais;
- envelhecimento;
- uso de tecnologias assistivas.

Acessibilidade não é “modo especial”. É projetar para que o produto funcione para mais pessoas, em mais condições.

Exemplos de barreiras:

- texto com baixo contraste;
- botão sem nome acessível;
- formulário sem label;
- erro explicado só por cor;
- navegação impossível por teclado;
- foco invisível;
- imagem sem alternativa textual;
- vídeo sem legenda;
- modal que prende leitor de tela;
- link genérico como “clique aqui”;
- conteúdo complexo demais;
- layout que quebra com zoom;
- componente customizado que não comunica estado.

Acessibilidade é parte da experiência. Se uma pessoa não consegue usar, não é apenas “problema técnico”; é falha de UX.

---

## 3. Acessibilidade, usabilidade e inclusão

Acessibilidade, usabilidade e inclusão se sobrepõem.

| Conceito | Foco | Exemplo | Erro comum |
|---|---|---|---|
| Acessibilidade | Remover barreiras de acesso e uso | Navegação por teclado, contraste, leitor de tela | Tratar como compliance final |
| Usabilidade | Tornar tarefas eficazes, eficientes e compreensíveis | Usuário conclui checkout sem erro | Testar só com usuários sem deficiência |
| Design inclusivo | Projetar considerando diversidade humana desde o início | Co-criar com pessoas com diferentes necessidades | Virar discurso sem prática |
| Assistive technology | Ferramentas usadas por pessoas para acessar conteúdo | Leitor de tela, ampliador, switch, comando por voz | Assumir que ferramenta resolve interface ruim |
| Compliance | Conformidade com norma ou lei | WCAG AA, eMAG, Section 508 | Achar que passar em checklist garante boa UX |

Acessibilidade é uma condição para boa usabilidade, mas não garante usabilidade completa. Um fluxo pode cumprir vários critérios técnicos e ainda ser confuso, cansativo ou ruim de entender.

---

## 4. Por que acessibilidade precisa entrar no UX Research

Acessibilidade precisa entrar na pesquisa porque muitos problemas só aparecem quando pessoas reais, com contextos reais, tentam usar o produto.

Automação detecta parte dos problemas, mas não detecta tudo. Ela pode apontar ausência de alt text, contraste, problemas de marcação ou labels, mas não avalia bem compreensão, expectativa, fluxo, esforço cognitivo, contexto de uso, qualidade do texto alternativo ou impacto real da barreira.

UX Research ajuda a responder:

- pessoas com deficiência conseguem concluir tarefas críticas?
- onde travam?
- que tecnologia assistiva usam?
- quais barreiras são bloqueadoras?
- quais adaptações do produto ajudam?
- que conteúdos são confusos?
- que componentes não comunicam estado?
- como a experiência muda em mobile, zoom, teclado ou leitor de tela?
- que problemas técnicos têm impacto real na tarefa?
- quais barreiras precisam ser priorizadas?

Acessibilidade sem pesquisa tende a focar no que é mais fácil de testar, não necessariamente no que mais impede o uso.

---

## 5. WCAG em linguagem prática

WCAG — Web Content Accessibility Guidelines — é a principal referência internacional para acessibilidade em conteúdo web. A WCAG 2.2 organiza critérios de sucesso em quatro princípios:

```txt
Perceptível
↓
Operável
↓
Compreensível
↓
Robusto
```

### 5.1 Perceptível

A informação precisa ser percebida pelos usuários de formas diferentes.

Exemplos:

- texto alternativo para imagens;
- legendas;
- contraste suficiente;
- conteúdo que não dependa só de cor;
- texto redimensionável;
- estrutura clara.

### 5.2 Operável

A interface precisa ser navegável e acionável.

Exemplos:

- navegação por teclado;
- foco visível;
- tempo suficiente;
- evitar conteúdo que cause risco;
- títulos e labels claros;
- formas de navegar e localizar.

### 5.3 Compreensível

A informação e a operação precisam ser compreensíveis.

Exemplos:

- linguagem clara;
- comportamento previsível;
- ajuda para erros;
- instruções;
- identificação de campos;
- consistência.

### 5.4 Robusto

O conteúdo precisa funcionar com tecnologias, navegadores e assistive technologies.

Exemplos:

- HTML semântico;
- nome, função e estado de componentes;
- compatibilidade com leitor de tela;
- mensagens de status programáticas;
- componentes customizados acessíveis.

### 5.5 Níveis A, AA e AAA

| Nível | O que representa | Uso prático |
|---|---|---|
| A | Critérios básicos | Mínimo, mas insuficiente para muitos contextos |
| AA | Critérios amplamente adotados | Meta comum para produtos e serviços digitais |
| AAA | Critérios mais exigentes | Nem sempre aplicável a todo conteúdo |

WCAG não deve ser tratada como lista decorativa. Ela é critério técnico testável, mas precisa ser combinada com pesquisa e validação real.

---

## 6. eMAG no contexto brasileiro

O eMAG — Modelo de Acessibilidade em Governo Eletrônico — é uma referência brasileira voltada ao desenvolvimento e adaptação de conteúdos digitais do governo, com recomendações para padronizar e facilitar a implementação de acessibilidade.

Em projetos no Brasil, especialmente serviços públicos, portais institucionais ou produtos que precisam dialogar com padrões governamentais, o eMAG pode ser usado como camada local complementar à WCAG.

### Como usar no processo

- Como referência em projetos públicos brasileiros.
- Como apoio para padronizar recomendações.
- Como checklist complementar.
- Como base para documentação de requisitos.
- Como referência de linguagem em português.
- Como ponte entre stakeholders brasileiros e WCAG.

### Cuidado

eMAG não substitui pesquisa com usuários, WCAG atualizada ou teste com tecnologias assistivas. Ele ajuda a contextualizar e operacionalizar, mas acessibilidade real precisa ser validada.

---

## 7. Quando pesquisar acessibilidade

Acessibilidade deve ser pesquisada e avaliada em vários momentos.

| Momento | O que fazer | Por quê |
|---|---|---|
| Discovery | Identificar públicos, barreiras, contextos e requisitos | Evita excluir desde o início |
| Arquitetura da informação | Testar navegação, labels e encontrabilidade | Barreiras de estrutura afetam todos |
| Conteúdo | Avaliar linguagem, instruções e compreensão | Clareza é acessibilidade |
| Protótipo | Testar fluxo antes do desenvolvimento | Corrigir cedo é mais barato |
| Design system | Validar componentes e estados | Componente inacessível multiplica problema |
| Desenvolvimento | Teste manual, automatizado e com teclado | Evita regressões |
| Pré-lançamento | Auditoria + teste com usuários | Reduz risco crítico |
| Pós-lançamento | Monitorar, medir e corrigir | Acessibilidade é contínua |

Acessibilidade tardia custa mais porque exige refazer estrutura, componente, conteúdo e comportamento.

---

## 8. Quem incluir na pesquisa

Não existe “usuário com deficiência” como um grupo único. Necessidades variam muito.

Perfis possíveis:

- usuários cegos que usam leitor de tela;
- usuários com baixa visão;
- usuários que ampliam zoom;
- usuários com daltonismo;
- usuários surdos ou com deficiência auditiva;
- usuários com deficiência motora;
- usuários que navegam por teclado;
- usuários que usam switch;
- usuários que usam comando por voz;
- usuários com dislexia;
- usuários com deficiência cognitiva;
- usuários neurodivergentes;
- idosos;
- pessoas com limitações temporárias;
- pessoas em contexto situacional limitado.

### Critérios de recrutamento

| Critério | Por que importa |
|---|---|
| Tecnologia assistiva usada | Define ambiente de teste |
| Frequência de uso digital | Afeta familiaridade |
| Experiência com domínio | Evita confundir acessibilidade com desconhecimento do tema |
| Dispositivo principal | Mobile/desktop muda barreiras |
| Navegador/SO | Leitores e atalhos variam |
| Necessidades de adaptação | Garante conforto e respeito |
| Tipo de tarefa | Alguns perfis são mais afetados por certas barreiras |

Não recrute só “uma pessoa cega” e trate como validação universal. Acessibilidade é diversidade, não token.

---

## 9. Como planejar pesquisa com pessoas com deficiência

Planejamento cuidadoso evita desconforto, viés e sessões ruins.

### Passo a passo

| Etapa | Objetivo | Cuidado | Entregável |
|---|---|---|---|
| 1. Definir objetivo | Saber o que será avaliado | Não tentar testar tudo | Objetivo de pesquisa |
| 2. Definir tarefas críticas | Focar em fluxos importantes | Incluir tarefas reais | Lista de tarefas |
| 3. Definir perfis | Recrutar necessidades relevantes | Não generalizar deficiência | Screener |
| 4. Perguntar adaptações | Garantir conforto | Não assumir necessidade | Perguntas de acomodação |
| 5. Preparar consentimento | Respeitar dados e gravação | Explicar uso do material | Termo de consentimento |
| 6. Preparar ambiente | Permitir tecnologia assistiva | Não forçar ferramenta do pesquisador | Setup |
| 7. Preparar moderador | Conduzir com respeito | Evitar paternalismo | Guia de moderação |
| 8. Fazer piloto | Validar tarefas e tecnologia | Problemas técnicos são comuns | Roteiro ajustado |
| 9. Conduzir sessões | Observar barreiras reais | Não ajudar cedo demais | Notas e gravações |
| 10. Sintetizar | Separar barreira, impacto e causa | Não reduzir tudo a WCAG | Relatório |

### Perguntas úteis antes da sessão

- Qual dispositivo você prefere usar?
- Usa alguma tecnologia assistiva?
- Há alguma configuração que precisa estar ativa?
- Prefere participar por vídeo, áudio ou presencial?
- Precisa de pausa ou adaptação de tempo?
- Há algo que devemos preparar para tornar a sessão mais confortável?
- Autoriza gravação de tela/áudio? Se não, qual registro é aceitável?

A pergunta correta é “o que você precisa para participar confortavelmente?”, não “qual é sua deficiência?” como se fosse curiosidade.

---

## 10. Teste de usabilidade com tecnologias assistivas

Tecnologias assistivas podem incluir:

- leitores de tela;
- ampliadores;
- navegação por teclado;
- switches;
- comando por voz;
- legendas;
- leitores de texto;
- softwares de contraste;
- configurações do sistema;
- dispositivos adaptados.

### O que observar

- A pessoa consegue navegar?
- O foco segue ordem lógica?
- O leitor de tela anuncia elementos corretamente?
- Botões têm nome acessível?
- Estados são comunicados?
- Mensagens de erro são anunciadas?
- Modais funcionam?
- Menus são operáveis?
- Tabelas são compreensíveis?
- Formulários têm labels?
- Conteúdo dinâmico é percebido?
- A tarefa pode ser concluída sem mouse?
- Zoom quebra layout?
- Contraste prejudica leitura?
- O usuário entende instruções?

### Cuidados de condução

- Deixe o participante usar sua configuração habitual quando possível.
- Não peça para “usar como uma pessoa cega usaria” se a pessoa não usa leitor de tela no dia a dia.
- Não desligue adaptações.
- Não corrija a ferramenta.
- Não trate tecnologia assistiva como obstáculo; obstáculo é a interface que não funciona com ela.
- Dê tempo.
- Registre impacto na tarefa, não apenas critério técnico.

---

## 11. Teste com teclado

Navegação por teclado é uma avaliação básica e poderosa.

### O que testar

- É possível acessar todos os elementos interativos?
- A ordem do foco faz sentido?
- O foco é visível?
- O usuário sabe onde está?
- Menus abrem e fecham?
- Modais prendem foco corretamente?
- É possível sair de modais?
- Dropdowns funcionam?
- Carrosséis não prendem navegação?
- Mensagens de erro são alcançáveis?
- CTA principal é acessível?
- Skip links existem quando necessários?

### Sinais de problema

- Foco invisível.
- Foco pula para lugar inesperado.
- Elemento interativo não recebe foco.
- Ordem visual e ordem de foco divergem.
- Tecla Tab prende o usuário.
- Modal não gerencia foco.
- Botão parece botão, mas não é botão.
- Elemento muda estado sem comunicar.

Teste de teclado é simples e pega muita coisa feia. É tipo raio-x barato da interface.

---

## 12. Leitores de tela

Leitores de tela transformam interface visual em navegação auditiva/estruturada. O produto precisa comunicar nome, função, estado e contexto.

### O que avaliar

- Títulos estruturam a página?
- Landmarks existem?
- Links têm nomes descritivos?
- Botões anunciam ação?
- Inputs têm labels?
- Erros são anunciados?
- Estados são comunicados?
- Imagens têm alt text adequado?
- Imagens decorativas são ignoradas?
- Tabelas têm cabeçalhos?
- Modais são anunciados?
- Conteúdo dinâmico é comunicado?
- A ordem de leitura faz sentido?

### Problemas comuns

| Problema | Impacto |
|---|---|
| Botão sem nome | Usuário não sabe ação |
| Link “clique aqui” | Usuário não entende destino |
| Imagem sem alt | Informação desaparece |
| Alt text genérico | Informação não ajuda |
| Campo sem label | Formulário fica inutilizável |
| Estado não anunciado | Usuário não sabe se abriu/selecionou |
| Modal sem foco | Usuário fica perdido |
| Erro só visual | Usuário não sabe corrigir |

Não basta “funcionar com leitor de tela”. Precisa fazer sentido.

---

## 13. Baixa visão, zoom e contraste

Muitas pessoas não usam leitor de tela, mas precisam de ampliação, contraste forte, zoom, temas do sistema ou fontes maiores.

### O que avaliar

- Texto tem contraste suficiente?
- Elementos interativos têm contraste?
- Foco tem contraste?
- Placeholder é legível?
- Informações não dependem só de cor?
- Zoom 200% mantém conteúdo utilizável?
- Layout reflow sem scroll horizontal desnecessário?
- Texto não sobrepõe elementos?
- Ícones têm rótulo ou contexto?
- Tamanho de fonte é confortável?
- Espaçamento ajuda leitura?

### Problemas comuns

- Cinza claro em texto importante.
- Erro indicado só em vermelho.
- Texto dentro de imagem.
- Layout quebra com zoom.
- Botão perde label.
- Modal não cabe.
- Foco quase invisível.
- Placeholder usado como instrução principal.
- Ícone sem texto.

Contraste é o básico do básico. Ainda assim, é onde muito produto “premium minimalista” tropeça bonito.

---

## 14. Deficiência auditiva e conteúdo multimídia

Pessoas surdas ou com deficiência auditiva precisam de alternativas para conteúdo sonoro.

### O que avaliar

- Vídeos têm legenda?
- Legendas são sincronizadas?
- Legendas incluem informação sonora relevante?
- Conteúdo importante em áudio tem transcrição?
- Alertas sonoros têm alternativa visual?
- Atendimento por telefone tem alternativa textual?
- Instruções em vídeo existem em texto?
- Webinars/aulas têm suporte adequado?
- Autoplay com áudio é evitado?

### Problemas comuns

- Vídeo de produto sem legenda.
- Tutorial só em áudio.
- Alerta sonoro sem equivalente visual.
- Atendimento apenas por telefone.
- Legenda automática sem revisão.
- Conteúdo essencial em live sem alternativa.

Se a informação é importante, ela não pode existir em apenas um canal sensorial.

---

## 15. Deficiência motora e interação

Barreiras motoras aparecem quando a interface exige precisão, velocidade, mouse ou gestos complexos.

### O que avaliar

- Alvos de toque são grandes o suficiente?
- Há espaçamento entre botões?
- É possível usar sem mouse?
- Gestos têm alternativa?
- Drag and drop tem alternativa?
- Tempo limite pode ser estendido?
- Campos não exigem digitação excessiva?
- Autocomplete ajuda?
- Erro é fácil de corrigir?
- Fluxos não exigem velocidade?
- Botões destrutivos têm confirmação?

### Problemas comuns

- Botões pequenos.
- Links muito próximos.
- Ações dependentes de hover.
- Drag obrigatório.
- Timeout curto.
- Captcha difícil.
- Máscara de campo rígida.
- Formulário longo sem salvamento.
- Calendário impossível por teclado.

Acessibilidade motora é uma área onde detalhes pequenos têm impacto gigante.

---

## 16. Cognição, linguagem e neurodiversidade

Acessibilidade também envolve compreensão, previsibilidade e carga cognitiva.

### O que avaliar

- Linguagem é clara?
- Instruções são objetivas?
- Layout é previsível?
- Etapas são visíveis?
- Erros explicam como corrigir?
- Informações importantes aparecem no momento certo?
- O usuário precisa memorizar dados?
- Há distrações desnecessárias?
- Animações podem ser reduzidas?
- Conteúdo complexo é quebrado em partes?
- Jargões são explicados?
- Tarefas longas têm progresso?

### Problemas comuns

- Texto jurídico sem tradução.
- Formulário sem instrução.
- Erro genérico.
- Fluxo longo sem progresso.
- Página poluída.
- Animação excessiva.
- Conteúdo técnico sem explicação.
- Ambiguidade em labels.
- Mudanças inesperadas de contexto.

Clareza é acessibilidade. Texto confuso também exclui.

---

## 17. Avaliação automática, manual e com usuários

Nenhum método sozinho basta.

| Tipo | O que detecta bem | Limites |
|---|---|---|
| Ferramenta automática | Contraste, labels ausentes, estrutura, ARIA, erros básicos | Não entende contexto, qualidade do alt, fluxo ou impacto real |
| Revisão manual | Teclado, foco, semântica, componentes, lógica da interface | Depende de expertise |
| Teste com usuário | Barreiras reais, impacto, estratégias, esforço | Mais caro e não cobre todos os critérios |
| Auditoria WCAG | Conformidade estruturada | Pode ficar técnica demais sem priorização UX |
| Analytics/suporte | Sinais em produção | Não identifica tudo e não explica causa sozinho |

Combinação recomendada:

```txt
Automático
↓
Manual
↓
Teclado
↓
Leitor de tela / tecnologias assistivas
↓
Teste com usuários
↓
Relatório priorizado
↓
Correção
↓
Reteste
```

Ferramenta automática é detector de fumaça. Não é bombeiro, engenheiro e morador ao mesmo tempo.

---

## 18. Easy Checks e avaliação preliminar

Easy Checks do W3C/WAI ajudam a fazer uma primeira revisão de acessibilidade. Eles não substituem auditoria completa, mas são úteis para triagem.

### O que checar

- título da página;
- headings;
- contraste;
- redimensionamento de texto;
- navegação por teclado;
- foco visível;
- links;
- labels;
- texto alternativo;
- multimídia;
- movimento e animação;
- erros básicos.

### Quando usar

- antes de teste com usuários;
- em QA de UX;
- em revisão rápida de protótipo implementado;
- em auditorias iniciais;
- como checklist de regressão;
- para educar time.

### Cuidado

Easy Checks dão sinal inicial. Não devem virar certificado de acessibilidade.

---

## 19. WCAG-EM e relatórios de avaliação

WCAG-EM é uma metodologia para avaliação de conformidade de websites com WCAG. O W3C também oferece ferramenta para ajudar a estruturar relatórios de avaliação.

Use quando:

- precisa avaliar site completo;
- precisa documentar conformidade;
- precisa criar relatório formal;
- projeto tem exigência legal;
- produto precisa de auditoria estruturada;
- time precisa rastrear problemas por critério.

### Estrutura básica de relatório

- escopo;
- páginas/telas avaliadas;
- versão da WCAG;
- nível alvo;
- métodos usados;
- ferramentas usadas;
- critérios avaliados;
- achados;
- severidade;
- evidências;
- recomendações;
- responsável;
- status;
- reteste.

Relatório bom não é só “passa/não passa”. Ele precisa orientar correção.

---

## 20. Como classificar problemas de acessibilidade

Classifique problemas considerando impacto real na tarefa.

| Severidade | Definição | Exemplo | Ação |
|---|---|---|---|
| Crítica | Bloqueia tarefa essencial para um grupo de usuários | Checkout impossível por teclado | Corrigir antes de lançar |
| Alta | Causa erro, perda de informação ou esforço grande | Erro de formulário não anunciado | Prioridade imediata |
| Média | Gera fricção, mas há contorno | Alt text pobre em imagem secundária | Corrigir em ciclo próximo |
| Baixa | Incômodo ou melhoria de qualidade | Label poderia ser mais descritivo | Backlog |
| Observação | Sinal a monitorar | Possível confusão em texto | Investigar |

Critérios:

- bloqueia tarefa?
- afeta fluxo crítico?
- quantos grupos são afetados?
- há alternativa?
- o usuário consegue se recuperar?
- tem impacto legal?
- tem impacto de negócio?
- afeta segurança ou dados?
- é recorrente em vários componentes?

Problema de acessibilidade em componente reutilizável tem severidade maior porque se multiplica.

---

## 21. Acessibilidade em formulários

Formulários concentram muitas barreiras.

### O que avaliar

- labels visíveis e programáticos;
- instruções claras;
- campos obrigatórios indicados;
- agrupamentos;
- mensagens de erro específicas;
- erro anunciado;
- foco enviado para o erro quando adequado;
- recuperação sem perder dados;
- autocomplete;
- teclado mobile correto;
- máscara flexível;
- ajuda contextual;
- linguagem simples.

### Problemas comuns

| Problema | Impacto | Correção |
|---|---|---|
| Campo sem label | Leitor de tela não identifica | Label associado |
| Placeholder como label | Some ao digitar | Label persistente |
| Erro só por cor | Usuário não percebe | Texto + ícone + ARIA |
| Mensagem genérica | Usuário não sabe corrigir | Explicar campo e formato |
| Foco não vai para erro | Usuário se perde | Gestão de foco |
| Campo obrigatório sem indicação | Erro evitável | Marcação clara |
| Máscara rígida | Bloqueia entrada válida | Aceitar formatos variados |

Formulário acessível reduz erro para todo mundo.

---

## 22. Acessibilidade em e-commerce

Em e-commerce, barreiras de acessibilidade podem impedir compra diretamente.

### Áreas críticas

- busca;
- filtros;
- cards de produto;
- imagens;
- variações;
- preço;
- frete;
- carrinho;
- checkout;
- pagamento;
- mensagens de erro;
- confirmação;
- rastreio;
- suporte.

### Perguntas de pesquisa

- Usuários conseguem encontrar produto com teclado/leitor de tela?
- Filtros são operáveis?
- Variações são anunciadas?
- Preço e promoção são compreensíveis?
- Imagens têm descrição útil?
- Erros de checkout são corrigíveis?
- Pagamento é acessível?
- Confirmação de pedido é percebida?
- Política de troca é encontrável?
- Mobile funciona com zoom?

### Métricas úteis

- sucesso em tarefas críticas;
- erro por campo;
- abandono por etapa;
- problemas por critério WCAG;
- tickets relacionados;
- sucesso com teclado;
- sucesso com leitor de tela;
- tempo de tarefa;
- severidade por etapa.

E-commerce inacessível não é só experiência ruim: é venda perdida e exclusão direta.

---

## 23. Acessibilidade em design systems

Design system pode escalar acessibilidade ou escalar problema. Componentes inacessíveis se repetem em dezenas de telas.

### O que documentar

- comportamento por teclado;
- estados de foco;
- labels e nomes acessíveis;
- contraste;
- uso correto de ARIA;
- mensagens de erro;
- estados disabled;
- estados selecionado/expandido;
- ordem de foco;
- uso em mobile;
- exemplos corretos e incorretos;
- critérios WCAG relacionados;
- testes esperados.

### Componentes críticos

- botão;
- link;
- input;
- select;
- checkbox;
- radio;
- modal;
- tooltip;
- accordion;
- tabs;
- menu;
- dropdown;
- toast;
- alert;
- tabela;
- paginação;
- carrossel;
- datepicker;
- upload;
- stepper.

Um componente bonito e inacessível é dívida técnica com maquiagem.

---

## 24. Acessibilidade em conteúdo

Conteúdo acessível é claro, estruturado e utilizável.

### O que avaliar

- títulos descritivos;
- hierarquia de headings;
- parágrafos curtos;
- linguagem simples;
- links com texto significativo;
- instruções no momento certo;
- glossário para termos técnicos;
- alt text útil;
- transcrições;
- legendas;
- tabelas compreensíveis;
- mensagens de erro claras;
- microcopy de ajuda.

### Erros comuns

- “Clique aqui”.
- Texto em imagem.
- Jargão sem explicação.
- Página sem headings.
- Título genérico.
- Política longa e incompreensível.
- Alerta só visual.
- Instrução depois do erro.
- FAQ que responde em linguagem interna.

Conteúdo acessível não é texto “bobo”. É texto que cumpre tarefa com menos barreira.

---

## 25. Acessibilidade em protótipos

Protótipos não substituem implementação acessível, mas podem antecipar barreiras.

### O que considerar no protótipo

- ordem lógica de conteúdo;
- hierarquia de headings;
- labels visíveis;
- mensagens de erro;
- estados;
- foco previsto;
- comportamento de modal;
- alternativas a cor;
- texto realista;
- contraste;
- zoom/layout;
- teclado quando possível;
- anotações para dev.

### Como documentar no handoff

- comportamento esperado por teclado;
- nome acessível de botões/ícones;
- texto alternativo necessário;
- estados ARIA esperados;
- foco inicial em modais;
- mensagens de erro;
- ordem de leitura;
- critérios de sucesso.

UX não precisa escrever todo o código, mas precisa especificar o comportamento que afeta experiência.

---

## 26. Checklist de pesquisa e avaliação

### Antes

- [ ] Objetivo de acessibilidade definido.
- [ ] Fluxos críticos escolhidos.
- [ ] Critérios WCAG relevantes mapeados.
- [ ] Perfis de participantes definidos.
- [ ] Tecnologias assistivas consideradas.
- [ ] Necessidades de acomodação perguntadas.
- [ ] Consentimento preparado.
- [ ] Ambiente testado.
- [ ] Tarefas realistas criadas.
- [ ] Ferramentas automáticas preparadas.

### Durante

- [ ] Participante usa configuração habitual quando possível.
- [ ] Moderador não induz.
- [ ] Barreiras são registradas com impacto.
- [ ] Tecnologia assistiva é respeitada.
- [ ] Foco, teclado, leitura e estado são observados.
- [ ] Desconforto é respeitado.
- [ ] Ajuda é marcada.
- [ ] Evidências são registradas.

### Depois

- [ ] Problemas agrupados.
- [ ] Severidade definida.
- [ ] Critérios WCAG relacionados mapeados.
- [ ] Impacto na tarefa descrito.
- [ ] Recomendações criadas.
- [ ] Responsáveis definidos.
- [ ] Reteste planejado.
- [ ] Aprendizados registrados no design system/repositório.

---

## 27. Métricas de acessibilidade

| Métrica | O que mede | Fonte |
|---|---|---|
| Problemas por severidade | Risco e prioridade | Auditoria |
| Critérios WCAG não atendidos | Conformidade | Revisão técnica |
| Sucesso com teclado | Operabilidade | Teste manual |
| Sucesso com leitor de tela | Compatibilidade real | Teste com usuário |
| Erros de contraste | Perceptibilidade | Ferramenta + revisão |
| Formulários com label correto | Robustez/compreensão | Auditoria |
| Tempo em tarefa acessível | Eficiência | Teste |
| Abandono por etapa | Fricção real | Analytics |
| Tickets de acessibilidade | Sinais em produção | Suporte |
| Regressões | Qualidade contínua | QA automatizado/manual |

Métrica boa combina conformidade e impacto. Só contar violações não basta; é preciso saber o que elas bloqueiam.

---

## 28. Como aplicar em um projeto real

Exemplo: **site institucional que será transformado em e-commerce**.

### Sequência recomendada

1. **Discovery**
   - Mapear usuários, tarefas críticas e riscos de exclusão.
   - Identificar se há requisitos legais ou institucionais.

2. **Inventário**
   - Levantar páginas, produtos, formulários, checkout, conteúdo institucional e políticas.

3. **Auditoria preliminar**
   - Rodar ferramentas automáticas.
   - Fazer Easy Checks.
   - Testar teclado.
   - Revisar contraste, headings, labels e links.

4. **Arquitetura e conteúdo**
   - Validar labels claros.
   - Garantir estrutura de headings.
   - Revisar linguagem e instruções.

5. **Protótipo**
   - Anotar foco, estados, erros, modal, ordem de leitura e comportamentos críticos.

6. **Teste com usuários**
   - Incluir pessoas com diferentes necessidades.
   - Testar busca, filtros, PDP, carrinho e checkout.

7. **Correção**
   - Priorizar problemas críticos e altos.
   - Registrar no backlog.

8. **Reteste**
   - Confirmar correção em fluxos críticos.

9. **Monitoramento**
   - Acompanhar regressões, tickets e métricas.

### Exemplo aplicado

| Área | Barreira possível | Pesquisa/avaliação | Recomendação |
|---|---|---|---|
| Busca | Campo sem label acessível | Leitor de tela + auditoria | Associar label e instrução |
| Filtros | Não operam por teclado | Teste de teclado | Revisar componente |
| PDP | Imagens sem alt útil | Auditoria + teste | Alt text orientado à decisão |
| Variações | Estado selecionado não anunciado | Leitor de tela | Comunicar estado |
| Frete | Erro só visual | Teste de formulário | Mensagem programática |
| Checkout | Foco não vai para erro | Teste com teclado | Gestão de foco |
| Política | Texto complexo | Teste de compreensão | Reescrever em linguagem clara |

---

## 29. Relação com outros arquivos da base

- **01_UX_RESEARCH_METHODS.md** — ajuda a escolher métodos para avaliar acessibilidade.
- **02_DISCOVERY_AND_DOUBLE_DIAMOND.md** — posiciona acessibilidade desde a descoberta.
- **03_USER_INTERVIEWS_AND_CONTEXT.md** — orienta pesquisa com pessoas e cuidado na condução.
- **04_SYNTHESIS_AND_MAPPING.md** — ajuda a transformar barreiras em achados e oportunidades.
- **05_INFORMATION_ARCHITECTURE.md** — conecta acessibilidade com navegação, labels, busca e estrutura.
- **06_IDEATION_AND_WORKSHOPS.md** — inclui acessibilidade em critérios de ideação e priorização.
- **07_USABILITY_TESTING.md** — estrutura testes de usabilidade com tarefas.
- **08_UX_METRICS.md** — define métricas de acessibilidade e monitoramento.
- **09_ECOMMERCE_UX_RESEARCH.md** — aplica acessibilidade a compra, PDP, carrinho e checkout.
- **11_RESEARCHOPS.md** — organiza recrutamento, consentimento, repositório e governança.
- **13_PROMPTS_AND_CHECKLISTS.md** — deve conter prompts e checklists operacionais de acessibilidade.

Acessibilidade atravessa a base inteira. Não é um arquivo isolado para ser lembrado no final.

---

## 30. Erros comuns em acessibilidade

- Tratar acessibilidade como checklist final.
- Rodar apenas ferramenta automática.
- Não testar teclado.
- Não testar com usuários reais.
- Assumir que cumprir contraste resolve tudo.
- Usar ARIA sem necessidade.
- Criar componente customizado inacessível.
- Esconder foco.
- Indicar erro só por cor.
- Usar placeholder como label.
- Criar conteúdo em imagem.
- Não legendar vídeo.
- Não escrever alt text útil.
- Ignorar zoom.
- Não considerar mobile.
- Recrutar uma pessoa e generalizar tudo.
- Não perguntar necessidades de acomodação.
- Tratar participante com deficiência como “caso especial”.
- Corrigir tela por tela e esquecer design system.
- Não fazer reteste.
- Não documentar padrão para evitar regressão.

Acessibilidade ruim geralmente não nasce de má intenção. Nasce de processo que não lembrou dela até tarde demais.

---

## 31. Resumo operacional

Fluxo recomendado:

```txt
Mapear tarefas críticas
↓
Identificar riscos de exclusão
↓
Aplicar WCAG/eMAG como referência
↓
Fazer checagem automática
↓
Fazer avaliação manual
↓
Testar teclado
↓
Testar tecnologias assistivas
↓
Testar com pessoas reais
↓
Classificar severidade
↓
Corrigir
↓
Retestar
↓
Documentar no design system
↓
Monitorar regressões
```

Acessibilidade boa é resultado de sistema: método, componente, conteúdo, desenvolvimento, QA, pesquisa e governança.

---

## 32. Fontes utilizadas

- W3C — Web Content Accessibility Guidelines (WCAG) 2.2: https://www.w3.org/TR/WCAG22/
- W3C WAI — WCAG 2 Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- W3C WAI — How to Meet WCAG Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- W3C WAI — Evaluating Web Accessibility Overview: https://www.w3.org/WAI/test-evaluate/
- W3C WAI — Easy Checks: A First Review of Web Accessibility: https://www.w3.org/WAI/test-evaluate/preliminary/
- W3C WAI — Involving Users in Evaluating Web Accessibility: https://www.w3.org/WAI/test-evaluate/involving-users/
- W3C WAI — Using Combined Expertise to Evaluate Web Accessibility: https://www.w3.org/WAI/test-evaluate/combined-expertise/
- W3C WAI — Evaluation Approaches for Specific Contexts: https://www.w3.org/WAI/eval/considerations
- W3C WAI — WCAG-EM Overview: https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/
- W3C WAI — WCAG-EM Report Tool: https://www.w3.org/WAI/eval/report-tool/
- W3C WAI — Web Accessibility Evaluation Tools List: https://www.w3.org/WAI/test-evaluate/tools/list/
- GOV.UK Service Manual — Making your service accessible: https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction
- GOV.UK Service Manual — Making your service more inclusive: https://www.gov.uk/service-manual/design/making-your-service-more-inclusive
- GOV.UK Service Manual — User research: https://www.gov.uk/service-manual/user-research
- GOV.UK Service Manual — Running research sessions with disabled people: https://www.gov.uk/service-manual/user-research/running-research-sessions-with-people-with-disabilities
- GOV.UK Design System — Accessibility strategy: https://design-system.service.gov.uk/accessibility/accessibility-strategy/
- Digital.gov — Accessibility: https://digital.gov/topics/accessibility
- Digital.gov — Accessibility for teams: UX design: https://digital.gov/guides/accessibility-for-teams/ux-design
- Digital.gov — Accessibility for teams: Product management: https://digital.gov/guides/accessibility-for-teams/product-management
- Digital.gov — Usability testing: https://digital.gov/guides/plain-language/test/usability-testing
- U.S. Web Design System — Accessibility: https://designsystem.digital.gov/documentation/accessibility/
- U.S. Web Design System — Design Principles: https://designsystem.digital.gov/design-principles/
- Section508.gov — Tips for Usability Testing with People with Disabilities: https://www.section508.gov/test/usability-testing-with-people-with-disabilities/
- Governo Digital Brasil — Modelo de Acessibilidade: https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade
- eMAG — Modelo de Acessibilidade em Governo Eletrônico: https://emag.governoeletronico.gov.br/
- Microsoft Inclusive Design: https://inclusive.microsoft.design/
- Microsoft Inclusive Design Toolkit Manual: https://download.microsoft.com/download/b/0/d/b0d4bf87-09ce-4417-8f28-d60703d672ed/inclusive_toolkit_manual_final.pdf
- NN/g — How to Conduct Usability Studies for Accessibility: https://www.nngroup.com/reports/how-to-conduct-usability-studies-accessibility/
- NN/g — Accessible Design for Users With Disabilities: https://www.nngroup.com/articles/accessible-design-for-users-with-disabilities/

---

## 33. Resumo executivo

Use este arquivo quando o projeto precisa garantir que a experiência possa ser usada por pessoas com diferentes capacidades, tecnologias, dispositivos e contextos.

A lógica principal é:

```txt
Acessibilidade desde o começo
↓
Padrões técnicos como referência
↓
Avaliação manual e automatizada
↓
Teste com pessoas reais
↓
Priorização por impacto na tarefa
↓
Correção e reteste
↓
Design system e governança
```

O Claude Cowork deve usar este documento para:

- planejar pesquisa de acessibilidade;
- criar checklists de avaliação;
- definir perfis de participantes;
- montar roteiro de teste com tecnologias assistivas;
- interpretar barreiras por severidade;
- relacionar problemas a WCAG/eMAG;
- criar recomendações para produto, conteúdo, design e desenvolvimento;
- incluir acessibilidade em discovery, teste, métricas e handoff.

Acessibilidade não é favor, plugin ou rodapé com botão de contraste. É qualidade mínima de produto digital.
