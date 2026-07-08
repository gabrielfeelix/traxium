# 12_AI_PRODUCT_UX — UX para Produtos com IA

> Arquivo de UX para produtos, features e agentes baseados em IA. Serve para **pesquisar, projetar, validar e medir experiências com sistemas probabilísticos**, incluindo IA generativa, recomendações, automações, chatbots, copilotos, classificadores e agentes.
> O foco não é “colocar IA no produto”: é criar experiências úteis, compreensíveis, controláveis, seguras e confiáveis.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 35. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "UX para produtos com IA"** na base. Ele orienta como aplicar UX Research, Product Discovery, design de interação, avaliação, segurança e governança em produtos que usam inteligência artificial.

Responde, na prática:

- Quando faz sentido usar IA em um produto.
- Quando IA é exagero ou risco desnecessário.
- Como pesquisar problemas que podem envolver IA.
- Como desenhar experiências probabilísticas.
- Como lidar com erro, incerteza, confiança e controle.
- Como comunicar capacidades e limitações.
- Como criar fluxos com revisão humana.
- Como projetar chatbots, copilotos, recomendações e agentes.
- Como avaliar qualidade, segurança, utilidade e confiança.
- Como medir sucesso em produtos com IA.
- Como evitar dark patterns de automação, overtrust e falsa precisão.
- Como conectar UX com risco, governança, privacidade e acessibilidade.

Regra central: **IA é meio, não estratégia. Se a IA não reduz risco, esforço ou complexidade do usuário, provavelmente é só glitter caro.**

---

## 2. O que é UX para produtos com IA

UX para produtos com IA é a prática de projetar experiências em que parte do comportamento do sistema é gerado, recomendado, previsto, classificado ou executado por modelos de IA.

Diferente de software tradicional, sistemas com IA podem ser:

- probabilísticos;
- não determinísticos;
- sensíveis ao contexto;
- difíceis de explicar;
- dependentes de dados;
- sujeitos a erro inesperado;
- afetados por viés;
- capazes de gerar conteúdo plausível, mas incorreto;
- capazes de automatizar ações;
- capazes de mudar a relação de controle entre usuário e sistema.

Em software tradicional, o usuário espera consistência: se clicar no mesmo botão, espera o mesmo resultado.

Em sistemas com IA, a experiência precisa preparar o usuário para variabilidade:

```txt
Mesmo input
↓
Pode gerar resposta diferente
↓
Com qualidade variável
↓
Exigindo avaliação, correção e controle
```

UX para IA não é só interface de prompt. É desenhar relações de confiança, controle, expectativa, explicação, erro e supervisão.

---

## 3. IA como solução: quando faz sentido

IA deve entrar quando há um problema em que suas capacidades realmente ajudam.

IA pode fazer sentido para:

- resumir conteúdo longo;
- classificar grandes volumes de informação;
- recomendar opções;
- identificar padrões;
- personalizar experiência;
- gerar rascunhos;
- responder perguntas em uma base de conhecimento;
- auxiliar decisão;
- automatizar tarefas repetitivas;
- extrair dados de documentos;
- traduzir ou transformar formato;
- detectar anomalias;
- apoiar atendimento;
- criar variações;
- orquestrar etapas com ferramentas;
- sugerir próximos passos.

Mas a pergunta certa não é “onde podemos usar IA?”. A pergunta certa é:

```txt
Qual tarefa do usuário está difícil, cara, lenta ou incerta?
↓
IA reduz esse problema melhor que uma solução simples?
```

### Critérios para decidir se IA faz sentido

| Critério | Pergunta |
|---|---|
| Valor | IA resolve um problema real ou só impressiona? |
| Adequação | O problema é probabilístico, interpretativo ou repetitivo? |
| Dados | Existem dados suficientes e adequados? |
| Erro | O que acontece se a IA errar? |
| Controle | O usuário pode revisar, corrigir ou desfazer? |
| Transparência | O sistema consegue explicar limites e confiança? |
| Segurança | Há risco de dano, fraude, exposição ou decisão sensível? |
| Alternativa | Uma regra simples, filtro ou busca resolveria melhor? |
| Custo | O ganho justifica complexidade, latência e manutenção? |
| Confiança | O usuário aceitará IA nesse contexto? |

IA boa costuma reduzir complexidade percebida. IA ruim transfere a complexidade para o usuário com uma interface mais mágica e menos previsível.

---

## 4. Quando não usar IA

Não use IA quando:

- regras simples resolvem;
- busca/filtro/taxonomia resolvem;
- o usuário precisa de resposta exata e auditável;
- o erro tem alto impacto e não há supervisão;
- não há dados adequados;
- o problema ainda não está definido;
- a equipe quer IA por marketing;
- o usuário não ganha autonomia;
- o sistema cria opacidade desnecessária;
- a organização não consegue monitorar risco;
- a IA aumenta esforço de revisão;
- a saída não pode ser confiavelmente verificada;
- há risco sensível sem controle humano;
- a experiência precisa ser rápida e a IA adiciona latência;
- a solução só substitui uma interface clara por uma caixa preta.

### Exemplo

| Problema | Solução simples | IA pode ser exagero quando... |
|---|---|---|
| Usuário quer filtrar produtos por preço | Filtro de preço | IA recomenda produtos sem explicar critério |
| Usuário quer saber prazo de entrega | Cálculo determinístico | IA “estima” prazo sem base confiável |
| Usuário quer navegar categorias | IA chat | Menu e busca resolvem melhor |
| Usuário quer preencher endereço | Autocomplete | IA inventa complemento ou corrige errado |
| Usuário quer comparar specs | Tabela comparativa | IA resume sem fonte e erra detalhes |

Muita IA em produto é só UI fugindo de resolver arquitetura da informação.

---

## 5. Tipos de produtos e features com IA

| Tipo | O que faz | Exemplo | Risco UX |
|---|---|---|---|
| Recomendação | Sugere opções | Produtos, filmes, tarefas | Bolha, falta de controle |
| Classificação | Categoriza inputs | Tickets, imagens, documentos | Erro invisível |
| Predição | Estima resultado | Risco, demanda, churn | Falsa precisão |
| Geração | Cria conteúdo | Texto, imagem, código, resumo | Alucinação, qualidade variável |
| Conversação | Interage por diálogo | Chatbot, assistente | Expectativa exagerada |
| Copiloto | Ajuda dentro de uma tarefa | Escrever, analisar, configurar | Dependência e revisão |
| Automação | Executa etapas | Preencher, agendar, enviar | Controle e reversibilidade |
| Agente | Planeja e usa ferramentas | Resolver tarefa multi-etapa | Autonomia, erro em cadeia |
| Busca semântica | Recupera conteúdo por significado | FAQ, docs, pesquisa | Fonte e relevância |
| Extração | Tira dados de documento | Nota fiscal, contrato | Precisão e validação |
| Moderação | Detecta risco | Conteúdo, comentários | Falso positivo/negativo |
| Personalização | Adapta experiência | Conteúdo, layout, oferta | Privacidade e controle |

Cada tipo exige padrões diferentes de UX. Um classificador precisa de confiança e correção. Um gerador precisa de revisão e edição. Um agente precisa de controle, confirmação e logs.

---

## 6. IA determinística vs probabilística

Software tradicional tende a ser determinístico: mesmas regras, mesmos inputs, mesmos outputs.

IA, especialmente modelos generativos, tende a ser probabilística: outputs podem variar e depender de contexto, prompt, dados, configuração e versão do modelo.

### Implicações de UX

| Característica | Impacto na experiência | Ação de design |
|---|---|---|
| Saídas variáveis | Usuário pode se surpreender | Comunicar variação |
| Erros plausíveis | Resposta pode parecer certa e estar errada | Mostrar fontes, revisão e limites |
| Confiança instável | Usuário pode confiar demais ou de menos | Calibrar confiança |
| Latência | Geração pode demorar | Feedback de progresso |
| Dependência de contexto | Input ruim gera output ruim | Ajudar o usuário a formular |
| Mudança de modelo | Produto pode mudar comportamento | Monitoramento e regressão |
| Dados incompletos | Resposta pode ser limitada | Indicar lacunas |

Design para IA precisa assumir falha. Não como pessimismo, mas como requisito.

---

## 7. Princípios de Human-AI Interaction

A Microsoft HAX Toolkit organiza diretrizes para interação humano-IA em fases da experiência: antes da interação, durante a interação, quando o sistema está errado e ao longo do tempo.

Em linguagem prática, bons produtos com IA devem:

- deixar claro o que o sistema pode fazer;
- deixar claro o que ele não pode fazer;
- informar quando está usando IA;
- ajustar expectativas;
- oferecer exemplos;
- mostrar incerteza quando necessário;
- permitir correção;
- permitir controle;
- permitir desfazer;
- manter o usuário informado;
- aprender com feedback sem ser invasivo;
- proteger privacidade;
- falhar de forma segura;
- não fingir certeza;
- não substituir julgamento humano em decisões críticas sem supervisão.

### Tradução para checklist

| Princípio | Pergunta de UX |
|---|---|
| Capacidades claras | O usuário sabe o que a IA faz? |
| Limites claros | O usuário sabe onde a IA pode errar? |
| Estado visível | O usuário sabe o que está acontecendo? |
| Controle | O usuário pode editar, aceitar, rejeitar, desfazer? |
| Feedback | O usuário pode corrigir a IA? |
| Transparência | O usuário sabe por que aquilo foi sugerido? |
| Aprendizado | O sistema melhora sem ficar invasivo? |
| Segurança | Erros são contidos antes de causar dano? |
| Privacidade | O usuário sabe como dados são usados? |
| Confiança calibrada | O design evita confiança cega e desconfiança injusta? |

---

## 8. Confiança calibrada

Confiança calibrada é quando o usuário confia no sistema **na medida certa**:

- confia quando o sistema é competente;
- verifica quando há incerteza;
- entende limites;
- sabe quando precisa assumir controle;
- não delega cegamente;
- não rejeita uma boa ajuda por falta de clareza.

### Overtrust e undertrust

| Problema | O que é | Exemplo | Risco |
|---|---|---|---|
| Overtrust | Confiar demais | Aceitar resumo sem verificar fonte | Erro propagado |
| Undertrust | Confiar de menos | Ignorar recomendação útil | Valor perdido |
| Trust collapse | Perder confiança após erro | Um erro crítico contamina tudo | Abandono |
| Automation bias | Aceitar sugestão automática como correta | Sistema classifica ticket errado e operador confirma | Decisão ruim |
| Algorithm aversion | Rejeitar IA após ver erro | Usuário abandona feature útil | Baixa adoção |

### Como calibrar confiança

- Mostrar fonte ou evidência.
- Mostrar nível de confiança quando útil.
- Explicar limites.
- Permitir comparação.
- Dar controle e reversão.
- Não usar tom excessivamente confiante.
- Evitar linguagem antropomórfica exagerada.
- Mostrar exemplos corretos de uso.
- Criar feedback claro.
- Registrar histórico e ações.
- Pedir confirmação em ações críticas.
- Fazer a IA admitir incerteza.

Confiança em IA não se resolve com “powered by AI”. Isso só informa a tecnologia, não prova valor.

---

## 9. Transparência e explicabilidade

Transparência significa que o usuário entende o papel da IA, o que ela está fazendo, quais dados usa e quais limitações existem.

Explicabilidade significa que o sistema ajuda o usuário a entender por que uma sugestão, classificação ou saída foi gerada.

### Tipos de explicação

| Tipo | Quando usar | Exemplo |
|---|---|---|
| Explicação de capacidade | Antes de usar | “Posso resumir documentos enviados por você.” |
| Explicação de limite | Antes/durante | “Posso errar detalhes técnicos; revise antes de enviar.” |
| Explicação de fonte | Saída informativa | “Resposta baseada nos documentos A e B.” |
| Explicação de critério | Recomendação/classificação | “Recomendado porque corresponde ao seu orçamento e uso.” |
| Explicação de incerteza | Resultado incerto | “Não encontrei evidência suficiente para afirmar.” |
| Explicação de ação | Agente/automação | “Vou consultar estoque, calcular frete e preparar resumo.” |
| Explicação de erro | Falha | “Não consegui acessar o arquivo; envie novamente.” |

### Cuidados

- Explicação não deve ser desculpa para sistema ruim.
- Explicação longa demais pode atrapalhar.
- Usuários diferentes precisam de níveis diferentes de explicação.
- Explicar tudo o tempo todo cria ruído.
- Em contexto crítico, explicação precisa ser mais forte.
- Fonte e rastreabilidade importam mais que “a IA acha”.

A melhor explicação é aquela que ajuda o usuário a decidir o que fazer com a saída.

---

## 10. Capacidades e limites

Produtos com IA precisam comunicar claramente:

- o que a IA faz;
- o que ela não faz;
- de onde vem a informação;
- quando a resposta pode estar incompleta;
- o que o usuário precisa revisar;
- quais ações são automatizadas;
- quais ações exigem confirmação;
- que dados são usados;
- o que é salvo;
- como corrigir.

### Exemplo ruim

```txt
“Nosso assistente resolve tudo para você.”
```

Problema: promessa ampla, impossível de verificar, cria expectativa irreal.

### Exemplo melhor

```txt
“Este assistente ajuda a encontrar produtos, comparar opções e responder dúvidas com base nas informações da loja. Ele pode cometer erros; confirme preço, prazo e especificações antes de comprar.”
```

### Modelo prático

| Área | Comunicação necessária |
|---|---|
| Chatbot | Escopo, fontes, possibilidade de erro |
| Recomendação | Critério da recomendação |
| Geração de texto | Necessidade de revisão |
| Agente | Etapas, permissões e confirmação |
| Classificador | Confiança, correção e exceções |
| Busca semântica | Base consultada e limites |
| Automação | O que será feito antes de executar |

Limite claro não reduz valor. Reduz frustração e risco.

---

## 11. Controle do usuário

Quanto mais autonomia a IA tem, mais controle o usuário precisa.

### Formas de controle

- aceitar;
- rejeitar;
- editar;
- regenerar;
- comparar versões;
- desfazer;
- pausar;
- interromper;
- ajustar preferências;
- corrigir;
- ver histórico;
- aprovar antes de enviar;
- limitar escopo;
- escolher fontes;
- desligar personalização;
- revisar antes de executar;
- reportar problema.

| Tipo de IA | Controle necessário |
|---|---|
| Gerador de texto | editar, regenerar, comparar, copiar |
| Recomendador | ajustar preferências, ocultar, explicar |
| Classificador | corrigir categoria, confirmar, revisar baixa confiança |
| Chatbot | reformular, ver fontes, transferir para humano |
| Copiloto | aceitar por partes, desfazer, revisar |
| Agente | aprovar etapas críticas, pausar, logs, rollback |

Controle ruim gera sensação de aprisionamento. Controle bom transforma IA em ferramenta, não em chefe misterioso.

---

## 12. Feedback, correção e aprendizado

Sistemas com IA precisam de mecanismos de feedback. Mas feedback deve servir ao usuário, ao produto e à melhoria do sistema — sem parecer buraco negro.

### Tipos de feedback

| Tipo | Exemplo | Uso |
|---|---|---|
| Binário | útil/não útil | Sinal simples |
| Correção | “a categoria correta é X” | Melhorar classificação |
| Edição | usuário altera saída | Aprender padrão |
| Reporte | “resposta incorreta” | Segurança/qualidade |
| Preferência | “não mostrar isso” | Personalização |
| Avaliação pós-tarefa | facilidade/confiança | UX metrics |
| Comentário aberto | explicação do problema | Diagnóstico |

### Boas práticas

- Dizer o que acontece com o feedback.
- Não pedir feedback demais.
- Permitir correção no fluxo.
- Dar forma de reverter.
- Não tratar thumbs down como diagnóstico completo.
- Priorizar feedback em pontos críticos.
- Usar feedback para triagem, não como única métrica.

### Exemplo

```txt
“Essa resposta não ajudou?”
[Incorreta] [Incompleta] [Não era o que procurei] [Outro]
```

Feedback útil é específico. “Gostei/não gostei” raramente basta.

---

## 13. Onboarding para IA

Onboarding de IA precisa ensinar:

- o que a IA faz;
- quais tarefas resolve;
- como pedir;
- que tipo de input funciona;
- quais limites existem;
- como revisar;
- como corrigir;
- como proteger dados;
- quando procurar ajuda humana;
- como desfazer ações.

### Elementos úteis

- exemplos de prompts;
- sugestões contextuais;
- templates;
- ações rápidas;
- limites claros;
- dicas progressivas;
- estado vazio útil;
- demonstração curta;
- histórico;
- aviso de revisão;
- exemplos de bom uso.

### Erros comuns

- “Pergunte qualquer coisa”.
- Promessa ampla demais.
- Estado vazio sem orientação.
- Onboarding que esconde risco.
- Linguagem mágica.
- Mostrar termos técnicos de modelo.
- Pedir prompt sem contexto.
- Não ensinar como corrigir.

O usuário não deveria precisar ser “engenheiro de prompt” para extrair valor de uma feature.

---

## 14. Inputs, prompts e formulação de pedidos

A qualidade da saída de IA depende muito da qualidade do input. UX deve ajudar o usuário a formular pedidos bons sem exigir conhecimento técnico.

### Padrões úteis

- sugestões de prompt;
- campos estruturados;
- chips de intenção;
- templates;
- exemplos preenchidos;
- perguntas guiadas;
- upload contextual;
- seleção de fonte;
- ajuste de tom/objetivo;
- pré-visualização;
- validação de input;
- pergunta de clarificação.

### Comparação

| Interface | Vantagem | Risco |
|---|---|---|
| Campo livre | Flexível | Usuário não sabe pedir |
| Prompt sugerido | Reduz partida fria | Pode limitar pensamento |
| Formulário guiado | Estrutura e clareza | Menos flexível |
| Chat | Natural e iterativo | Pode virar labirinto |
| Ações rápidas | Rápido | Pode esconder opções |
| Workflow estruturado | Bom para tarefa crítica | Mais pesado |

### Exemplo

Em vez de:

```txt
“Digite seu pedido.”
```

Use:

```txt
“O que você quer gerar?”
[Resumo] [Comparação] [Resposta para cliente] [Checklist]

“Qual material devo usar como base?”
[Documento enviado] [Página atual] [Base de conhecimento]
```

A melhor interface de IA muitas vezes não parece prompt. Parece ferramenta clara.

---

## 15. Outputs e qualidade da resposta

A saída da IA precisa ser projetada. Não basta jogar texto na tela.

### O que avaliar em outputs

- acurácia;
- completude;
- clareza;
- estrutura;
- tom;
- fonte;
- incerteza;
- utilidade;
- ação recomendada;
- risco;
- facilidade de revisão;
- compatibilidade com a tarefa;
- acessibilidade;
- consistência.

### Padrões úteis

- resumo com pontos principais;
- fontes/citações;
- nível de confiança;
- próximos passos;
- opções comparadas;
- destaques de risco;
- “não encontrei evidência suficiente”;
- botões de ação;
- editar/copiar/exportar;
- comparar versões;
- expandir detalhes;
- mostrar raciocínio resumido, não caixa-preta absoluta.

### Erros comuns

- resposta longa demais;
- tom confiante sem base;
- ausência de fonte;
- misturar fato e inferência;
- não indicar incerteza;
- não diferenciar recomendação de dado;
- output impossível de editar;
- não mostrar próximo passo;
- resposta que parece final, mas precisa revisão.

A IA pode gerar texto, mas o design precisa gerar decisão.

---

## 16. Fontes, citações e rastreabilidade

Quando IA responde com informação, o usuário precisa entender de onde veio.

### Quando fontes são críticas

- saúde, jurídico, financeiro ou decisões sensíveis;
- compras caras;
- produto técnico;
- documentação interna;
- atendimento ao cliente;
- análise de contrato/documento;
- comparação;
- recomendação;
- resumo de base extensa;
- decisão operacional.

### Boas práticas

- listar fontes usadas;
- diferenciar citação de inferência;
- permitir abrir fonte;
- destacar trechos relevantes;
- informar quando não há fonte;
- indicar data/versão quando relevante;
- evitar inventar referência;
- permitir “ver evidências”;
- separar resposta do modelo e dado recuperado.

### Modelo de resposta

```txt
Resposta
↓
Baseada em
↓
Fonte 1
Fonte 2
↓
Limitações
↓
O que revisar
```

Sem rastreabilidade, IA vira máquina de confiança falsa.

---

## 17. Erros, falhas e fallback

Sistemas com IA falham. O design precisa planejar essas falhas.

### Tipos de falha

| Falha | Exemplo | Resposta de UX |
|---|---|---|
| Não entendeu input | Pedido ambíguo | Perguntar clarificação |
| Sem dados | Base não tem resposta | Dizer que não encontrou |
| Baixa confiança | Resultado incerto | Mostrar incerteza e pedir revisão |
| Conteúdo inseguro | Pedido arriscado | Bloquear/recusar com alternativa segura |
| Ferramenta falhou | API indisponível | Explicar e oferecer retry |
| Ação parcial | Agente concluiu parte | Mostrar status e pendências |
| Output incorreto | Resposta errada | Permitir reporte/correção |
| Latência alta | Demora | Mostrar progresso e opção de cancelar |

### Fallback bom

- explica o problema;
- não culpa o usuário;
- oferece próximo passo;
- preserva o trabalho;
- permite tentar novamente;
- oferece alternativa manual;
- escala para humano quando necessário;
- não inventa resposta para parecer útil.

### Exemplo ruim

```txt
“Não foi possível.”
```

### Exemplo melhor

```txt
“Não consegui encontrar essa informação nos documentos disponíveis. Você pode enviar outro arquivo, reformular a pergunta ou escolher uma fonte específica.”
```

Falhar bem é uma das partes mais importantes da UX de IA.

---

## 18. Segurança, moderação e uso responsável

Produtos com IA precisam prever abuso, conteúdo inadequado, dados sensíveis, erros perigosos e automações indevidas.

### Medidas de segurança

- moderação de input;
- moderação de output;
- limites de uso;
- bloqueios por categoria de risco;
- revisão humana;
- logs;
- rate limits;
- autenticação;
- permissões;
- isolamento de dados;
- filtros de conteúdo;
- proteção contra prompt injection;
- testes adversariais;
- avaliação contínua;
- canal de reporte;
- fallback seguro;
- políticas de uso.

### Perguntas de UX e produto

- Que usos são permitidos?
- Que usos são proibidos?
- O usuário entende limites?
- Como o sistema responde a pedido inseguro?
- Como evitar que a IA exponha dados?
- Quem revisa casos críticos?
- Como registrar e auditar ações?
- Como impedir execução indevida?
- Como comunicar recusa sem ser hostil?
- Como proteger menores e públicos vulneráveis?

### Segurança como experiência

Uma recusa mal desenhada frustra. Uma recusa bem desenhada protege e redireciona.

Exemplo:

```txt
“Não posso ajudar com isso. Posso, porém, ajudar a criar uma alternativa segura para [objetivo permitido].”
```

Segurança não deve ser remendo invisível. Ela precisa aparecer na experiência quando afeta a tarefa.

---

## 19. Privacidade e dados

IA frequentemente usa dados do usuário como input. Isso exige clareza.

### O que comunicar

- que dados são usados;
- se dados são salvos;
- se dados treinam modelos;
- quem tem acesso;
- por quanto tempo ficam armazenados;
- como excluir;
- como desativar personalização;
- se há dados enviados a terceiros;
- se há logs;
- se arquivos enviados são retidos;
- quais dados não devem ser inseridos.

### Riscos

- usuário colar dado sensível;
- documentos internos vazarem;
- prompt conter informação pessoal;
- output revelar dado de outro usuário;
- histórico expor informação;
- integrações acessarem escopo amplo demais;
- agente executar ferramenta com permissão excessiva.

### Princípios

- minimização de dados;
- controle de usuário;
- transparência;
- consentimento quando necessário;
- retenção limitada;
- permissões explícitas;
- isolamento;
- logs auditáveis;
- exclusão;
- revisão jurídica/privacidade em contextos sensíveis.

Privacidade em IA não é só política. É produto: botões, avisos, permissões, escopo e comportamento.

---

## 20. Agentes e autonomia

Agente é um sistema que pode planejar, decidir etapas, usar ferramentas e executar ações para atingir um objetivo. Isso muda a UX porque o usuário não está apenas recebendo resposta: ele está delegando trabalho.

### Níveis de autonomia

| Nível | Comportamento | Controle necessário |
|---|---|---|
| Sugestão | IA recomenda | Aceitar/rejeitar |
| Copiloto | IA ajuda a executar | Revisar/editar |
| Automação assistida | IA prepara ação | Confirmar |
| Agente supervisionado | IA executa etapas com aprovação | Logs, pausa, confirmação |
| Agente autônomo | IA age com pouca intervenção | Escopo, auditoria, rollback forte |

### Princípios para agentes

- começar simples;
- deixar plano visível;
- mostrar etapas;
- pedir permissão para ações críticas;
- limitar escopo;
- permitir interrupção;
- registrar ações;
- permitir desfazer;
- confirmar antes de enviar/comprar/apagar/alterar;
- explicar falhas;
- testar interface agente-ferramenta;
- evitar autonomia desnecessária.

### Exemplo de fluxo

```txt
Usuário define objetivo
↓
Agente propõe plano
↓
Usuário aprova ou ajusta
↓
Agente executa etapa 1
↓
Mostra resultado
↓
Pede confirmação em ação crítica
↓
Registra histórico
↓
Permite desfazer ou corrigir
```

Agente sem controle é ansiedade automatizada.

---

## 21. Human-in-the-loop

Human-in-the-loop significa manter pessoas no processo para revisar, aprovar, corrigir ou assumir controle.

Use quando:

- erro tem impacto relevante;
- a IA atua em decisão sensível;
- output será enviado para outra pessoa;
- ação é difícil de desfazer;
- dados são críticos;
- modelo tem baixa confiança;
- caso foge do padrão;
- há risco legal, financeiro, reputacional ou operacional;
- o usuário precisa aprender ou manter domínio.

### Padrões

| Padrão | Exemplo |
|---|---|
| Revisar antes de enviar | IA redige e humano envia |
| Aprovar antes de executar | Agente prepara compra/alteração e pede confirmação |
| Escalar baixa confiança | Sistema encaminha para humano |
| Amostragem de qualidade | Humanos revisam parte dos outputs |
| Correção supervisionada | Usuário corrige classificação |
| Duplo controle | Ação crítica exige segunda aprovação |
| Rollback | Humano pode desfazer ação |

Human-in-the-loop não deve ser desculpa para jogar todo o trabalho de revisão no usuário. Se a pessoa precisa revisar tudo do zero, talvez a IA não esteja ajudando.

---

## 22. Pesquisa em produtos com IA

Pesquisa para IA precisa cobrir problema, contexto, expectativa, confiança, erro e comportamento.

### Métodos úteis

| Método | Para que serve em IA |
|---|---|
| Entrevistas | Entender tarefas, confiança, risco e contexto |
| Pesquisa contextual | Ver como trabalho acontece hoje |
| Wizard of Oz | Simular IA antes de construir |
| Protótipo de baixa fidelidade | Validar fluxo e expectativas |
| Teste de usabilidade | Observar uso, revisão e erro |
| Diary study | Entender uso recorrente e confiança ao longo do tempo |
| Benchmark | Comparar padrões de IA |
| Avaliação heurística HAX | Revisar diretrizes humano-IA |
| Red teaming | Testar abuso, falha e segurança |
| Analytics | Medir adoção e comportamento |
| Surveys | Medir percepção em escala |
| Logs e feedback | Monitorar qualidade e erro em produção |

### Perguntas de pesquisa

- Qual tarefa a IA deveria ajudar?
- O usuário quer automação, sugestão ou controle?
- Que erro seria aceitável?
- Que erro seria grave?
- O que o usuário precisa entender antes de confiar?
- Quando ele quer revisar?
- Que informação precisa de fonte?
- Como ele corrige a IA?
- Que dados ele aceita compartilhar?
- O que faria abandonar?
- Como confiança muda após erros?

Pesquisa de IA precisa investigar expectativas. Usuários chegam com fantasia, medo ou experiência ruim anterior.

---

## 23. Prototipação de IA

Você não precisa treinar um modelo para testar a experiência. Muitas perguntas de UX podem ser respondidas com protótipos.

### Formas de prototipar

| Técnica | Como funciona | Quando usar |
|---|---|---|
| Wizard of Oz | Humano simula IA | Discovery de interação |
| Fake door | Botão/feature mede interesse | Validar demanda inicial |
| Concierge | Pessoa entrega serviço manualmente | Entender valor antes de automatizar |
| Protótipo clicável | Simula fluxo | Validar interface |
| Output estático | Mostra respostas simuladas | Testar formato de saída |
| Prompt playground | Testa inputs e saídas | Refinar comportamento |
| Modelo simples | Usa regra/heurística | Testar valor antes de IA complexa |
| RAG protótipo | Busca em base limitada | Testar respostas com fontes |
| Agente simulado | Mostra plano/etapas | Testar controle e confiança |

### O que testar sem IA real

- O usuário entende a proposta?
- Sabe o que pedir?
- Confia no output?
- Sabe revisar?
- Entende limites?
- Quer controle?
- Aceita fluxo de confirmação?
- O formato da resposta ajuda?
- A IA resolve tarefa ou adiciona trabalho?

Protótipo de IA deve testar o risco principal. Se o risco é confiança, não gaste semanas treinando modelo para descobrir que ninguém quer delegar a tarefa.

---

## 24. Avaliação de qualidade em IA

Avaliar produto com IA exige mais que teste de interface. É preciso avaliar output e comportamento do sistema.

### Dimensões de avaliação

| Dimensão | Pergunta |
|---|---|
| Utilidade | A resposta ajuda a tarefa? |
| Acurácia | Está correta? |
| Completude | Cobre o que precisa? |
| Clareza | É compreensível? |
| Relevância | Responde ao pedido? |
| Segurança | Evita conteúdo ou ação indevida? |
| Robustez | Aguenta variações de input? |
| Consistência | Mantém padrão aceitável? |
| Fonte | É rastreável? |
| Controle | Usuário pode corrigir? |
| Latência | Tempo é aceitável? |
| Privacidade | Protege dados? |
| Acessibilidade | Output e interação são acessíveis? |
| Confiança | Usuário entende quando revisar? |

### Avaliação combinada

```txt
Avaliação automática
+
Avaliação humana
+
Teste com usuários
+
Logs de produção
+
Red teaming
+
Monitoramento contínuo
```

Produto com IA não fica “pronto”. Ele precisa de avaliação contínua porque modelo, dados, usuários e contexto mudam.

---

## 25. Métricas para produtos com IA

| Objetivo | Métrica possível |
|---|---|
| Adoção | uso da feature, usuários ativos, ativação |
| Valor | tarefa concluída, tempo economizado, qualidade percebida |
| Confiança | confiança pós-tarefa, aceitação de sugestão, revisão |
| Qualidade | acurácia, completude, utilidade, taxa de erro |
| Segurança | violações, bloqueios, reportes, incidentes |
| Controle | edições, rejeições, desfazer, correções |
| Eficiência | tempo até output útil, número de iterações |
| Recuperação | sucesso após erro, fallback, transferência humana |
| Transparência | uso de fontes, cliques em evidência |
| Retenção | retorno à feature, uso recorrente |
| Custo | custo por tarefa, tokens, latência |
| Acessibilidade | sucesso por perfil, barreiras reportadas |

### Métricas específicas

- taxa de aceitação de sugestão;
- taxa de edição do output;
- taxa de regeneração;
- taxa de thumbs down;
- taxa de reporte de resposta incorreta;
- tempo até primeira resposta útil;
- número de turnos por tarefa;
- taxa de escalonamento humano;
- taxa de alucinação identificada;
- respostas com fonte;
- respostas sem evidência;
- ações críticas executadas com confirmação;
- ações revertidas;
- incidentes de segurança;
- satisfação pós-tarefa;
- task success com IA vs sem IA.

Cuidado: alta aceitação pode significar qualidade ou confiança cega. Baixa edição pode significar output bom ou usuário sem capacidade de revisar. Métrica de IA precisa ser interpretada com pesquisa.

---

## 26. UX de chatbots e assistentes conversacionais

Chatbots são uma forma comum de IA, mas nem toda tarefa deveria virar chat.

### Quando chat faz sentido

- pergunta aberta;
- suporte;
- busca em conhecimento;
- orientação guiada;
- triagem;
- tarefas com linguagem natural;
- múltiplas etapas variáveis;
- contexto que precisa ser esclarecido;
- usuário não sabe onde encontrar informação.

### Quando chat é ruim

- tarefa simples com botão claro;
- escolha entre opções conhecidas;
- fluxo transacional curto;
- informação que precisa ser escaneada;
- comparação visual;
- ação crítica sem confirmação;
- catálogo que funciona melhor com filtros;
- quando usuário precisa ver muitas opções.

### Boas práticas

- escopo claro;
- exemplos de perguntas;
- fontes;
- fallback;
- transferência humana;
- histórico;
- edição de mensagem;
- confirmação em ações;
- não fingir ser humano;
- respostas curtas e estruturadas;
- ações rápidas;
- estado de carregamento;
- mensagens de erro úteis;
- acessibilidade por teclado/leitor de tela.

Chat não é interface universal. Às vezes uma tabela resolve melhor que uma conversa de 12 turnos.

---

## 27. Copilotos

Copiloto é uma IA que ajuda o usuário em uma tarefa, mas não assume controle total.

### Características

- trabalha no contexto da tarefa;
- sugere;
- resume;
- escreve rascunhos;
- explica;
- automatiza pequenos passos;
- deixa usuário decidir;
- aprende com feedback.

### Padrões úteis

- sugestão inline;
- rascunho editável;
- comparar versões;
- aceitar por trecho;
- aplicar parcialmente;
- explicar mudança;
- desfazer;
- revisar antes de enviar;
- manter fonte ou contexto;
- não interromper fluxo.

### Riscos

- output parecer final demais;
- usuário aceitar sem revisar;
- IA atrapalhar especialista;
- sugestões genéricas;
- excesso de automação;
- dependência;
- perda de autoria;
- dificuldade de corrigir.

Copiloto bom aumenta capacidade. Copiloto ruim vira estagiário confiante com acesso ao botão de enviar.

---

## 28. Recomendações e personalização

Sistemas de recomendação precisam explicar valor e permitir controle.

### O que mostrar

- por que foi recomendado;
- como ajustar;
- como ocultar;
- como dar feedback;
- se é patrocinado;
- se usa dados pessoais;
- quais critérios importam;
- alternativas;
- diversidade de opções.

### Riscos

- bolha de recomendação;
- repetição;
- viés;
- falta de controle;
- manipulação comercial;
- recomendação irrelevante;
- personalização invasiva;
- usuário não entende por que vê aquilo.

### Exemplo

```txt
“Recomendado porque você filtrou por até R$ 500 e selecionou ‘iniciante’.”
```

Melhor do que:

```txt
“Escolhido para você.”
```

Personalização sem explicação pode parecer esperta ou assustadora. O contexto decide.

---

## 29. IA em e-commerce

IA em e-commerce pode ajudar, mas também pode atrapalhar se substituir padrões bons de compra.

### Usos possíveis

- busca semântica;
- recomendação;
- guia de compra;
- comparação;
- resumo de reviews;
- chatbot de suporte;
- compatibilidade;
- descrição de produto;
- classificação de catálogo;
- atendimento pós-compra;
- personalização.

### Perguntas de UX

- IA ajuda o usuário a escolher ou só empurra produto?
- O usuário entende por que algo foi recomendado?
- A IA respeita preço, estoque e filtros?
- Resumo de reviews preserva nuances?
- Chatbot sabe transferir para humano?
- A IA inventa especificação?
- Resposta tem fonte?
- O usuário consegue comparar opções?
- IA reduz ou aumenta esforço?

### Riscos

- recomendar produto indisponível;
- inventar especificação;
- ocultar critérios comerciais;
- personalização invasiva;
- resumir reviews de forma enviesada;
- chat substituir filtro eficiente;
- atendimento travar em bot;
- erro em frete, preço ou garantia.

Em e-commerce, IA precisa respeitar dado estruturado. Preço, estoque, prazo e especificação não podem virar palpite.

---

## 30. Acessibilidade em produtos com IA

Produtos com IA precisam ser acessíveis tanto na interface quanto no output.

### Questões importantes

- Chat funciona por teclado?
- Leitor de tela anuncia mensagens novas?
- Histórico é navegável?
- Loading é comunicado?
- Erros são anunciados?
- Respostas longas têm estrutura?
- Fontes são acessíveis?
- Controles de aceitar/rejeitar são claros?
- Conteúdo gerado respeita linguagem clara?
- Imagens geradas têm alternativas?
- Áudio tem transcrição?
- Voz tem alternativa textual?
- Usuários com deficiência participaram da avaliação?
- IA cria barreiras novas?

### Riscos específicos

- output longo demais para leitor de tela;
- mudança dinâmica sem anúncio;
- chat com foco ruim;
- botões sem nome;
- conteúdo gerado sem headings;
- imagem gerada sem descrição;
- áudio sem texto;
- personalização que não considera necessidades;
- IA usada para “resolver acessibilidade” sem validação.

IA pode ajudar acessibilidade, mas também pode criar barreiras novas em velocidade industrial.

---

## 31. Governança e risco

Produtos com IA precisam de governança porque riscos não são só de interface.

### Referências úteis

- NIST AI Risk Management Framework para mapear, medir, gerenciar e governar riscos.
- OECD AI Principles para princípios de IA confiável, centrada em pessoas e alinhada a direitos.
- Políticas de uso e safety best practices de provedores.
- Frameworks internos de segurança, privacidade e compliance.
- Avaliações de impacto, quando aplicável.

### Riscos a mapear

| Risco | Exemplo |
|---|---|
| Acurácia | Resposta incorreta |
| Segurança | Conteúdo ou ação indevida |
| Privacidade | Vazamento de dados |
| Viés | Recomendação desigual |
| Autonomia | Ação sem confirmação |
| Transparência | Usuário não sabe que é IA |
| Overtrust | Usuário aceita erro |
| Undertrust | Usuário rejeita ajuda útil |
| Acessibilidade | Feature inacessível |
| Operacional | IA aumenta suporte |
| Legal | Uso não permitido |
| Reputacional | Output inadequado público |
| Custo | Uso caro sem valor |
| Manutenção | Modelo muda comportamento |

### Perguntas de governança

- Quem é dono da feature?
- Quem monitora qualidade?
- Quem aprova riscos?
- Como incidentes são tratados?
- Como feedback vira melhoria?
- Como modelos são avaliados?
- Como mudanças são comunicadas?
- Como dados são protegidos?
- Como usuários são informados?
- Como ações críticas são auditadas?

Governança não é inimiga da UX. Em IA, governança é parte da experiência confiável.

---

## 32. Erros comuns em UX para IA

- Usar IA sem problema claro.
- Chamar tudo de “assistente”.
- Prometer demais.
- Não comunicar limites.
- Não mostrar fontes.
- Não planejar erro.
- Não oferecer controle.
- Não permitir desfazer.
- Não pedir confirmação em ação crítica.
- Não monitorar qualidade.
- Medir só adoção.
- Ignorar privacidade.
- Ignorar acessibilidade.
- Criar chatbot para tarefa que seria melhor com UI estruturada.
- Usar tom humano demais e criar falsa expectativa.
- Esconder que é IA.
- Não testar com usuários reais.
- Não fazer red teaming.
- Não considerar impacto de erro.
- Transformar feedback em botão inútil.
- Usar IA como argumento de marketing, não como valor.
- Jogar revisão inteira no usuário.
- Automatizar decisão sensível sem supervisão.
- Não documentar fontes, limitações e critérios.

IA ruim não falha só quando erra. Ela também falha quando faz o usuário trabalhar mais para descobrir se pode confiar.

---

## 33. Checklist de UX para produtos com IA

### Antes de construir

- [ ] O problema está claro?
- [ ] IA é melhor que solução simples?
- [ ] Há dados adequados?
- [ ] O erro é aceitável?
- [ ] O usuário terá controle?
- [ ] Há risco sensível?
- [ ] A feature precisa de fonte?
- [ ] Existe fallback?
- [ ] Privacidade foi considerada?
- [ ] Acessibilidade foi considerada?
- [ ] Como medir sucesso?

### Durante o design

- [ ] Capacidades estão claras?
- [ ] Limites estão claros?
- [ ] O usuário sabe que é IA?
- [ ] O input é guiado?
- [ ] O output é revisável?
- [ ] Há fontes ou evidência?
- [ ] Incerteza é comunicada?
- [ ] O usuário pode corrigir?
- [ ] O usuário pode desfazer?
- [ ] Ações críticas pedem confirmação?
- [ ] Erros têm fallback útil?

### Antes de lançar

- [ ] Teste de usabilidade realizado?
- [ ] Avaliação de qualidade de output feita?
- [ ] Teste de segurança/adversarial feito?
- [ ] Logs e monitoramento definidos?
- [ ] Métricas definidas?
- [ ] Privacidade revisada?
- [ ] Acessibilidade testada?
- [ ] Suporte preparado?
- [ ] Políticas de uso consideradas?
- [ ] Plano de incidente definido?

### Depois de lançar

- [ ] Monitorar erro e feedback.
- [ ] Revisar outputs problemáticos.
- [ ] Acompanhar adoção e retenção.
- [ ] Verificar overtrust/undertrust.
- [ ] Corrigir padrões de falha.
- [ ] Atualizar comunicação de limites.
- [ ] Retestar mudanças.
- [ ] Atualizar documentação.

---

## 34. Como aplicar em um projeto real

Exemplo: **site institucional que será transformado em e-commerce**.

### Possíveis usos de IA

- assistente de escolha de produto;
- busca semântica;
- resumo de especificações;
- comparador inteligente;
- recomendação por perfil de uso;
- chatbot de suporte;
- resumo de avaliações;
- atendimento pós-compra;
- geração de descrições de produto para operação interna;
- triagem de dúvidas para suporte.

### Sequência recomendada

1. **Discovery**
   - Entender como usuários escolhem, onde travam e que risco sentem.

2. **Decidir se IA faz sentido**
   - Ex.: guia de escolha pode ser melhor que chatbot completo.

3. **Mapear riscos**
   - Produto errado, especificação inventada, recomendação enviesada, confiança falsa.

4. **Definir escopo**
   - Ex.: IA pode sugerir, mas não alterar preço, estoque ou prazo.

5. **Prototipar**
   - Wizard of Oz para assistente de escolha.
   - Protótipo de comparação.
   - Respostas simuladas com fontes.

6. **Testar**
   - Usuários iniciantes escolhem produto com e sem assistente.
   - Observar confiança, entendimento, revisão e decisão.

7. **Medir**
   - Sucesso da tarefa.
   - Confiança.
   - Add-to-cart.
   - Correções.
   - Reporte de resposta ruim.
   - Abandono.

8. **Controlar**
   - Mostrar fonte.
   - Explicar critério.
   - Permitir comparar.
   - Confirmar antes de adicionar ao carrinho.
   - Encaminhar para humano quando necessário.

### Exemplo aplicado

| Achado | Oportunidade | IA possível | Risco | Controle |
|---|---|---|---|---|
| Iniciantes não entendem especificações | Traduzir specs em uso prático | Assistente de escolha | Recomendar produto errado | Mostrar critério e alternativas |
| Usuários não sabem comparar modelos | Criar comparação clara | Comparador com resumo | Inventar diferença | Basear em dados estruturados |
| Usuários perguntam garantia | Responder com fonte | Chatbot de suporte | Resposta incompleta | Linkar política oficial |
| Usuário quer presente | Recomendar por perfil | Guia conversacional | Personalização invasiva | Perguntas mínimas e claras |
| Produto técnico tem dúvidas | Explicar termos | Glossário assistido | Excesso de confiança | Indicar revisão e fonte |

### Exemplo de hipótese

```txt
Acreditamos que um guia de escolha assistido por IA
para compradores iniciantes
ao traduzir especificações em linguagem de uso
aumentará a taxa de sucesso na escolha de produto adequado
e saberemos que funcionou se usuários concluírem a tarefa com mais confiança e menos ajuda.
```

---

## 35. Fontes utilizadas

- Google PAIR — People + AI Guidebook: https://pair.withgoogle.com/guidebook/
- Google Design — People + AI Research: https://design.google/library/people-ai-research
- Google Developers Codelab — Building Trusted AI Products with the PAIR Guidebook: https://codelabs.developers.google.com/codelabs/pair-guidebook
- Microsoft HAX Toolkit: https://www.microsoft.com/en-us/haxtoolkit/
- Microsoft HAX Toolkit — Guidelines for Human-AI Interaction: https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- Microsoft Research — Guidelines for Human-AI Interaction: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/
- Microsoft Research — Guidelines for Human-AI Interaction publication: https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- NIST — AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST — AI RMF Profile on Trustworthy AI in Critical Infrastructure: https://www.nist.gov/programs-projects/concept-note-ai-rmf-profile-trustworthy-ai-critical-infrastructure
- OECD — AI Principles: https://www.oecd.org/en/topics/sub-issues/ai-principles.html
- OECD.AI — AI Principles overview: https://oecd.ai/en/ai-principles
- OpenAI API — Safety best practices: https://developers.openai.com/api/docs/guides/safety-best-practices
- OpenAI — Usage Policies: https://openai.com/policies/usage-policies/
- Anthropic — Building Effective AI Agents: https://www.anthropic.com/research/building-effective-agents
- W3C WAI — Artificial Intelligence and Accessibility Research Symposium: https://www.w3.org/WAI/research/ai2023/
- W3C WAI — Voice Systems and Conversational Interfaces: https://www.w3.org/TR/coga-voice/
- W3C WAI — WCAG Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- W3C WAI — ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- NN/g — State of UX 2026: Design Deeper to Differentiate: https://www.nngroup.com/articles/state-of-ux-2026/
- NN/g — AI & Machine Learning topic: https://www.nngroup.com/topic/ai-and-machine-learning/
- NN/g — AI as a UX Assistant: https://www.nngroup.com/articles/ai-ux-assistant/
- arXiv — Investigating How Practitioners Use Human-AI Guidelines: A Case Study on the People + AI Guidebook: https://arxiv.org/abs/2301.12243
- arXiv — Human-Centered Explainable AI (XAI): From Algorithms to User Experiences: https://arxiv.org/abs/2110.10790
- arXiv — AI Assistance for UX: A Literature Review Through Human-Centered AI: https://arxiv.org/abs/2402.06089

---

## 36. Resumo executivo

Use este arquivo quando o projeto envolve IA, machine learning, IA generativa, recomendações, chatbots, copilotos, busca semântica, automações ou agentes.

A lógica principal é:

```txt
Problema real
↓
IA é adequada?
↓
Risco e contexto
↓
Capacidades e limites
↓
Controle do usuário
↓
Transparência
↓
Prototipação
↓
Teste com usuários
↓
Avaliação de output
↓
Segurança e privacidade
↓
Monitoramento contínuo
```

O Claude Cowork deve usar este documento para:

- decidir se IA faz sentido;
- desenhar experiências humano-IA;
- criar checklists de confiança, controle e transparência;
- planejar pesquisa com produtos de IA;
- prototipar features de IA sem construir tudo;
- avaliar chatbots, copilotos, recomendações e agentes;
- definir métricas de IA;
- mapear riscos;
- criar fluxos de fallback, revisão e feedback;
- conectar UX com segurança, governança e acessibilidade.

Produto com IA bom não tenta parecer mágico. Ele tenta ser útil, claro, revisável, seguro e honesto sobre seus limites.
