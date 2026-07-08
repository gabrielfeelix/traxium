# 09_ECOMMERCE_UX_RESEARCH — UX Research em E-commerce

> Arquivo vertical de aplicação. Serve para **pesquisar, diagnosticar, validar e melhorar experiências de e-commerce**, cobrindo descoberta de produto, busca, filtros, categorias, página de produto, carrinho, checkout, mobile, confiança e pós-compra.
> O foco não é “deixar a loja bonita”: é ajudar pessoas a encontrar, entender, confiar, escolher e comprar com menos fricção.
> Conteúdo resumido com palavras próprias a partir das fontes da Seção 33. Nenhum trecho foi copiado.

---

## 1. Objetivo deste arquivo

Este documento é o **dono do tema "e-commerce UX Research"** na base. Ele orienta como aplicar métodos de UX Research especificamente em lojas virtuais, marketplaces, catálogos, fluxos de compra, páginas de produto e checkout.

Responde, na prática:

- Quais perguntas de pesquisa importam em e-commerce.
- Como pesquisar jornada de compra.
- Como diagnosticar busca, filtros e categorias.
- Como avaliar página de produto.
- Como testar carrinho e checkout.
- Como medir confiança, decisão, abandono e conversão.
- Como pensar mobile commerce.
- Como transformar dados de analytics, atendimento, vendas e pesquisa em melhorias.
- Como usar benchmarks de e-commerce sem copiar concorrente cegamente.
- Como equilibrar institucional, conteúdo e compra em uma loja.

Regra central: **e-commerce bom reduz risco percebido e aumenta clareza de decisão.**

---

## 2. O que é UX Research em e-commerce

UX Research em e-commerce é a aplicação de pesquisa, validação e mensuração para entender como pessoas descobrem, comparam, escolhem, confiam e compram produtos online.

O foco não é apenas “converter”. Conversão é resultado. A pesquisa precisa entender o que acontece antes:

- Como o usuário chega à loja.
- O que ele procura.
- Como entende categorias.
- Como usa busca.
- Como filtra.
- Como compara produtos.
- Quais informações precisa para decidir.
- Onde surge dúvida.
- Onde perde confiança.
- Onde abandona.
- O que espera do pós-compra.

Em e-commerce, UX é a soma de:

```txt
Encontrabilidade
+
Informação
+
Confiança
+
Comparação
+
Preço/custo total
+
Carrinho
+
Checkout
+
Entrega
+
Pós-compra
```

Se qualquer uma dessas partes quebra, a compra pode cair.

---

## 3. Diferença entre e-commerce UX, CRO e UI

Essas áreas se sobrepõem, mas não são iguais.

| Área | Foco | Pergunta principal | Risco comum |
|---|---|---|---|
| UX Research em e-commerce | Entender comportamento, fricção e decisão | Por que o usuário não encontra, entende, confia ou compra? | Ficar só em diagnóstico e não priorizar |
| CRO | Melhorar conversão e receita | Qual mudança aumenta resultado? | Otimizar métrica e piorar experiência |
| UI Design | Apresentação visual e interação | A interface comunica bem e orienta ação? | Embelezar fluxo quebrado |
| Produto | Estratégia, valor e priorização | O que devemos construir ou melhorar primeiro? | Decidir por negócio sem evidência do usuário |
| Marketing | Aquisição, oferta e posicionamento | Como atrair tráfego qualificado? | Jogar tráfego em experiência ruim |

UX Research em e-commerce não compete com CRO. Ele melhora a qualidade das hipóteses de CRO. Em vez de testar botão por palpite, você testa uma mudança porque viu um problema real.

---

## 4. Principais perguntas de pesquisa em e-commerce

| Área | Perguntas de pesquisa |
|---|---|
| Público | Quem compra? Quem pesquisa? Quem decide? Quem paga? |
| Descoberta | Como usuários chegam aos produtos? Por busca, categoria, campanha, indicação? |
| Categoria | A organização faz sentido? Os nomes são claros? |
| Busca | Usuários encontram o que procuram? Que termos usam? |
| Filtros | Os filtros ajudam decisão ou só enfeitam? |
| Listagem | Cards dão informação suficiente para escolher o próximo clique? |
| Produto | A página responde dúvidas de decisão? |
| Comparação | O usuário consegue comparar alternativas? |
| Confiança | O que precisa aparecer para a pessoa acreditar na loja/produto? |
| Preço | Custo total, frete, prazo e parcelamento estão claros? |
| Carrinho | O usuário entende o que está comprando e consegue revisar? |
| Checkout | O fluxo é simples, confiável e sem erro? |
| Mobile | A compra funciona bem em tela pequena e contexto real? |
| Pós-compra | A pessoa consegue acompanhar, trocar, devolver e pedir suporte? |
| Métricas | Onde o funil cai e o que isso sugere? |

E-commerce é uma cadeia de microdecisões. A compra final depende de várias pequenas respostas dadas no momento certo.

---

## 5. Jornada de compra em e-commerce

Uma jornada genérica de e-commerce pode ser vista assim:

```txt
Descoberta
↓
Exploração
↓
Busca ou navegação
↓
Listagem/categoria
↓
Página de produto
↓
Comparação
↓
Carrinho
↓
Checkout
↓
Pagamento
↓
Confirmação
↓
Entrega
↓
Pós-compra
↓
Recompra ou recomendação
```

### Riscos por etapa

| Etapa | Usuário quer | Risco UX | Evidência possível |
|---|---|---|---|
| Descoberta | Entender a proposta | Mensagem confusa | Teste de compreensão |
| Exploração | Ver o que existe | Categorias ruins | Card sorting, analytics |
| Busca | Encontrar algo específico | Busca sem resultado | Logs de busca |
| Listagem | Comparar opções | Cards pobres, filtros ruins | Teste de tarefa |
| Produto | Decidir | Informação insuficiente | Teste de PDP |
| Comparação | Escolher melhor opção | Diferenças invisíveis | Entrevistas + teste |
| Carrinho | Revisar | Custo surpresa | Analytics + teste |
| Checkout | Finalizar | Erros, cadastro, fricção | Funil + teste |
| Pagamento | Concluir com segurança | Falha ou desconfiança | Logs + suporte |
| Pós-compra | Acompanhar | Falta de rastreio/suporte | Tickets + CSAT |
| Recompra | Voltar | Experiência esquecível | Retenção/recompra |

A pesquisa deve identificar quais etapas são críticas para aquele negócio. Nem todo e-commerce tem o mesmo gargalo.

---

## 6. Métodos de pesquisa mais úteis em e-commerce

| Método | Para que serve em e-commerce | Quando usar | Entregável |
|---|---|---|---|
| Analytics/funil | Ver onde usuários caem | Produto em produção | Diagnóstico de gargalos |
| Logs de busca | Entender termos e falhas | Busca ativa | Mapa de termos e zero results |
| Entrevistas | Entender decisão, medo, critérios | Discovery e problemas complexos | Critérios de compra |
| Teste de usabilidade | Observar compra e comparação | Protótipo ou produto | Problemas por tarefa |
| Benchmark UX | Comparar padrões e oportunidades | Início/redesign | Matriz comparativa |
| Card sorting | Organizar categorias | Catálogo novo/redesign | Taxonomia inicial |
| Tree testing | Validar navegação | Antes de UI final | Estrutura validada |
| Survey | Quantificar dores ou perfis | Hipóteses claras | Segmentação/escala |
| Análise de atendimento | Descobrir dúvidas repetidas | Operação existente | Backlog de conteúdo |
| Avaliação heurística | Diagnóstico rápido | Baixo prazo | Lista de problemas |
| Teste A/B | Medir variação em escala | Tráfego suficiente | Decisão quantitativa |
| Session replay/heatmap | Gerar hipóteses | Produto em produção | Sinais de fricção |

O método depende da pergunta. Se a pergunta é “por que abandonam?”, analytics sozinho não basta. Se a pergunta é “onde abandonam?”, entrevista não é o primeiro caminho.

---

## 7. Dados internos que devem ser levantados

Antes de entrevistar ou desenhar, levante o que a operação já sabe.

| Fonte | O que procurar | O que pode virar |
|---|---|---|
| Analytics | Funil, tráfego, dispositivos, abandono | Hipóteses de gargalo |
| Search Console | Termos orgânicos, páginas de entrada | Oportunidades de conteúdo |
| Busca interna | Termos, zero results, refinamentos | Sinônimos, taxonomia, filtros |
| ERP/estoque | Produtos vendidos, margem, ruptura | Priorização comercial |
| Atendimento | Dúvidas, reclamações, objeções | FAQ, PDP, políticas |
| CRM | Perfil de cliente, recorrência | Segmentos |
| Vendas | Produtos campeões, sazonalidade | Prioridade de catálogo |
| Devoluções/trocas | Motivos de arrependimento | Conteúdo de decisão |
| Reviews | Expectativas e frustrações | Prova social e melhorias |
| Mídia paga | Campanhas, termos, intenção | Alinhamento promessa → página |
| Logs técnicos | Erros, falhas de pagamento | Problemas críticos |

Esses dados não substituem usuários, mas ajudam a fazer perguntas melhores. Research bom não começa do zero fingindo que a empresa não sabe nada.

---

## 8. Benchmark UX em e-commerce

Benchmark UX em e-commerce serve para entender padrões de mercado, expectativas dos usuários e lacunas competitivas. Não serve para copiar tela.

### O que analisar

- Homepage.
- Menu e categorias.
- Busca.
- Resultados de busca.
- Listagem.
- Filtros e facetas.
- Cards de produto.
- Página de produto.
- Comparação.
- Carrinho.
- Checkout.
- Mobile.
- Políticas.
- Garantia.
- Entrega.
- Pós-compra.
- Conteúdo de confiança.
- Promoções e ofertas.
- Reviews e prova social.

### Modelo de matriz

| Loja/referência | Área analisada | Ponto forte | Ponto fraco | Oportunidade para nosso projeto |
|---|---|---|---|---|
| Concorrente A | PDP | Fotos boas e garantia clara | Ficha técnica confusa | Explicar specs em linguagem de uso |
| Concorrente B | Filtros | Facetas úteis | Filtros demais | Priorizar filtros por decisão |
| Referência C | Checkout | Fluxo curto | Pouca transparência no frete | Mostrar custo total cedo |
| Marketplace D | Busca | Sinônimos fortes | Página poluída | Melhorar busca sem sobrecarregar |

### Cuidados

- Concorrente grande também erra.
- Padrão comum não é prova de qualidade.
- Referência visual não substitui pesquisa.
- Copiar feature sem contexto pode piorar a experiência.
- Benchmark deve gerar hipóteses, não decisões finais.

---

## 9. Homepage e entrada da loja

A home de e-commerce precisa orientar rapidamente:

- que loja é essa;
- o que vende;
- por que confiar;
- onde começar;
- quais categorias ou ofertas importam;
- qual é a proposta de valor;
- como acessar busca, categorias e promoções;
- se há frete, garantia, troca ou benefício relevante.

### Perguntas de pesquisa

- Usuários entendem o que a loja vende?
- A home ajuda a começar a compra?
- A busca está visível?
- Categorias principais estão claras?
- A home prioriza tarefas reais ou interesses internos?
- Benefícios comerciais são compreensíveis?
- Conteúdo institucional ajuda ou distrai?
- Promoções estão claras ou poluem?

### Sinais de problema

- Muitos usuários clicam em elementos não clicáveis.
- Busca é usada imediatamente porque categorias não ajudam.
- Scroll alto sem clique.
- Baixa entrada em categorias.
- Usuários não entendem proposta.
- Banners não comunicam oferta clara.
- Home vira mural de campanha interna.

### Recomendações comuns

- Priorizar top tasks.
- Expor categorias principais.
- Deixar busca visível.
- Explicar proposta de valor.
- Mostrar confiança sem exagero.
- Evitar carrossel inútil.
- Reduzir banner genérico.
- Conectar institucional com compra.

Home boa não tenta mostrar tudo. Ela ajuda a escolher o próximo passo.

---

## 10. Categorias, menu e navegação

Categorias são uma das principais formas de descoberta. Em e-commerce, elas precisam refletir como o usuário procura, não como o estoque interno foi cadastrado.

### Perguntas de pesquisa

- Usuários entendem os nomes das categorias?
- Produtos estão agrupados de forma previsível?
- Categorias competem entre si?
- Existem categorias vazias ou pobres?
- A navegação ajuda iniciantes e experientes?
- Menu expõe o que importa?
- Usuários chegam a produtos sem depender da busca?

### Métodos úteis

- Inventário de catálogo.
- Card sorting.
- Tree testing.
- Analytics de navegação.
- Logs de busca.
- Entrevistas sobre decisão de compra.
- Teste de usabilidade com tarefas de encontrar produto.

### Erros comuns

- Organizar por departamento interno.
- Usar nomes de linha/marca que usuários não conhecem.
- Misturar tipo de produto, benefício, público e promoção no mesmo nível.
- Criar categoria com poucos produtos.
- Esconder categorias importantes.
- Colocar “Todos” como fuga para IA ruim.
- Não prever crescimento do catálogo.

### Exemplo

| Label fraco | Problema | Label melhor |
|---|---|---|
| Linha Premium | Não diz o que vende | Violões profissionais |
| Soluções | Genérico | Acessórios para guitarra |
| Diversos | Depósito de bagunça | Suportes e manutenção |
| Especiais | Não tem scent | Produtos em promoção |

---

## 11. Busca em e-commerce

Busca é crítica quando usuários sabem o que querem ou não querem navegar por categorias. Em muitos e-commerces, busca e navegação dividem a estratégia de product finding.

### O que pesquisar

- Quais termos usuários digitam.
- Quais termos não retornam resultado.
- Quais sinônimos são usados.
- Erros de digitação.
- Busca por marca, tipo, atributo, problema ou uso.
- Busca por linguagem leiga.
- Busca por código/SKU.
- Busca por compatibilidade.
- Busca por preço.
- Busca por ocasião.

### Métricas úteis

- volume de busca;
- taxa de zero results;
- taxa de refinamento;
- cliques em resultado;
- conversão pós-busca;
- abandono após busca;
- tempo até clique;
- termos mais buscados;
- termos que geram suporte.

### Problemas comuns

| Problema | Exemplo | Ação |
|---|---|---|
| Sem sinônimos | “violão elétrico” não encontra “eletroacústico” | Mapear linguagem do usuário |
| Erro ortográfico falha | “capotraste” vs “capo traste” | Tolerância e sinônimos |
| Resultado irrelevante | Busca por “iniciante” mostra qualquer produto | Tag por perfil de uso |
| Zero result seco | Página vazia | Sugestões e categorias alternativas |
| Filtro pós-busca ruim | Usuário não consegue refinar | Facetas por atributos úteis |
| Busca invisível no mobile | Usuário não encontra campo | Priorizar busca |

Busca boa precisa de taxonomia, catálogo limpo e linguagem do usuário. Não é só colocar uma lupa.

---

## 12. Listagem de produtos e cards

A listagem é onde o usuário compara opções. O card precisa dar informação suficiente para decidir se vale abrir a PDP, sem virar ficha técnica completa.

### Perguntas de pesquisa

- O usuário entende as diferenças entre produtos?
- Os cards mostram critérios de decisão importantes?
- Preço, parcelamento, disponibilidade e frete aparecem no momento certo?
- Imagens ajudam a comparar?
- Badges ajudam ou poluem?
- Usuários conseguem ordenar e filtrar?
- Produto indisponível é tratado corretamente?

### Informações possíveis no card

- imagem;
- nome;
- preço;
- preço parcelado;
- disponibilidade;
- avaliação;
- variações principais;
- benefício-chave;
- etiqueta “ideal para”;
- promoção;
- frete ou retirada;
- comparação;
- quick view com cuidado.

### Erros comuns

- Nome técnico longo e indistinguível.
- Cards iguais demais.
- Falta de preço ou disponibilidade.
- Badge demais.
- Imagem sem padrão.
- Informação importante só na PDP.
- Ordenação confusa.
- Produto indisponível competindo com disponível.
- Filtro aplicado sem feedback.

### Modelo de análise

| Elemento do card | Pergunta | Evidência |
|---|---|---|
| Nome | O usuário entende o produto? | Teste de listagem |
| Imagem | Ajuda a diferenciar? | Observação |
| Preço | Está claro? | Teste + analytics |
| Badge | Ajuda decisão ou distrai? | Teste A/B |
| Atributo-chave | Mostra diferença relevante? | Entrevistas |
| CTA | Faz sentido nessa etapa? | Teste de tarefa |

---

## 13. Filtros e facetas

Filtros ajudam usuários a reduzir um catálogo grande a opções relevantes. Facetas são filtros baseados em atributos estruturados do catálogo, combináveis entre si.

### Perguntas de pesquisa

- Quais critérios usuários usam para escolher?
- Quais filtros são realmente úteis?
- A ordem dos filtros faz sentido?
- Labels são claros?
- Usuários entendem que filtros estão aplicados?
- É fácil remover filtros?
- Filtros escondem opções demais?
- Filtros mobile funcionam bem?
- Resultados atualizam com feedback claro?

### Filtros comuns

- preço;
- marca;
- categoria;
- tamanho;
- cor;
- avaliação;
- disponibilidade;
- uso principal;
- nível do usuário;
- compatibilidade;
- material;
- especificação técnica;
- promoção;
- entrega rápida.

### Erros comuns

- Filtros demais.
- Filtros técnicos que iniciantes não entendem.
- Filtros com nomes internos.
- Filtros sem contagem.
- Filtro aplicado sem feedback.
- Remoção difícil.
- Não mostrar combinações sem resultado.
- Mobile com painel de filtro ruim.
- Atributos mal cadastrados.

### Exemplo de priorização

| Filtro | Serve para decisão? | Público | Prioridade |
|---|---|---|---|
| Preço | Sim | Todos | Alta |
| Nível do usuário | Sim | Iniciantes | Alta |
| Marca | Sim | Experientes | Alta |
| Código interno | Não para consumidor | Interno | Baixa |
| Cor | Depende do produto | Todos | Média |
| Material técnico | Sim, mas exige explicação | Experientes | Média |

Filtro bom nasce da decisão do usuário. Filtro ruim nasce do banco de dados.

---

## 14. Página de produto — PDP

A página de produto é onde a decisão ganha ou perde força. Ela precisa responder dúvidas suficientes para o usuário confiar na escolha e avançar.

### Perguntas de pesquisa

- O usuário entende o que é o produto?
- Entende para quem serve?
- Consegue avaliar se é compatível com sua necessidade?
- Confia nas fotos?
- Entende preço, parcelamento, frete e prazo?
- Encontra garantia e troca?
- Consegue comparar com alternativas?
- Entende variações?
- Sabe o que vem na caixa?
- Encontra avaliações/prova social?
- O CTA está claro?
- Mobile permite decidir sem ficar perdido?

### Blocos importantes

- nome claro;
- imagens e vídeos;
- preço e parcelamento;
- disponibilidade;
- frete e prazo;
- variações;
- CTA;
- benefício principal;
- especificações;
- “ideal para”;
- “não ideal para”, quando útil;
- comparação;
- avaliações;
- perguntas frequentes;
- garantia;
- troca/devolução;
- formas de pagamento;
- conteúdo institucional de confiança;
- produtos relacionados;
- acessórios compatíveis.

### Informação técnica vs decisão

Ficha técnica é necessária, mas nem sempre suficiente. Muitos usuários precisam de tradução:

| Informação técnica | Tradução para decisão |
|---|---|
| “Eletroacústico” | Pode ser usado sem amplificador ou ligado em caixa/interface |
| “Cordas de aço” | Som mais brilhante; exige mais força nos dedos |
| “Tamanho 3/4” | Mais compacto; pode servir para crianças ou transporte |
| “Captação X” | Melhor para tocar amplificado |
| “Material Y” | Impacta peso, durabilidade ou sonoridade |

PDP boa não joga especificação na cara do usuário e sai correndo. Ela explica por que aquilo importa.

---

## 15. Imagens, vídeo e prova visual

Em e-commerce, imagem é informação. Ela reduz incerteza sobre forma, tamanho, acabamento, escala, detalhes e qualidade.

### O que pesquisar

- Imagens mostram detalhes importantes?
- Usuários conseguem perceber escala?
- Vídeos ajudam decisão?
- Imagens respondem dúvidas que texto não responde?
- Há fotos de uso real?
- Variações mostram imagem correta?
- Zoom é útil?
- Mobile permite ver detalhes?

### Possíveis melhorias

- galeria com ângulos;
- zoom;
- vídeo curto de demonstração;
- foto em contexto;
- imagem de escala;
- detalhe de acabamento;
- variações visuais;
- imagem do que vem na caixa;
- comparação lado a lado;
- conteúdo gerado por usuários, quando confiável.

### Erros comuns

- Imagem única.
- Foto decorativa que não mostra produto.
- Variação muda, imagem não muda.
- Zoom ruim.
- Vídeo escondido.
- Falta de escala.
- Imagens pesadas e lentas.
- Fotos inconsistentes entre produtos.

---

## 16. Avaliações, reviews e prova social

Reviews ajudam a reduzir risco percebido, mas precisam ser fáceis de interpretar.

### Perguntas de pesquisa

- Usuários procuram reviews?
- Quais informações buscam nos reviews?
- Avaliação média é suficiente?
- Comentários ajudam a decidir?
- Usuários filtram reviews por perfil, uso ou problema?
- Reviews negativos são úteis?
- Fotos de clientes aumentam confiança?
- A ausência de reviews prejudica?

### Elementos úteis

- média geral;
- número de avaliações;
- distribuição de notas;
- comentários;
- fotos/vídeos de clientes;
- filtros por avaliação;
- reviews por atributo;
- perguntas respondidas;
- indicação de compra verificada;
- resumo de pontos fortes/fracos.

### Cuidados

- Review falso destrói confiança.
- Só mostrar avaliação perfeita pode parecer suspeito.
- Reviews sem contexto ajudam pouco.
- Produtos novos precisam de outras provas: garantia, vídeo, conteúdo e política clara.

---

## 17. Preço, frete, prazo e custo total

Preço não é só número. A decisão depende de custo total percebido: preço, frete, prazo, parcelamento, cupom, impostos, garantia e risco.

### Perguntas de pesquisa

- Usuário entende o preço final?
- Frete aparece cedo o suficiente?
- Prazo está claro?
- Parcelamento é compreensível?
- Cupom gera frustração?
- Taxas aparecem tarde?
- O custo total muda no checkout?
- A loja explica formas de pagamento?
- Promoções são claras?

### Sinais de problema

- Abandono após cálculo de frete.
- Uso alto de campo de cupom sem cupom disponível.
- Suporte perguntando prazo.
- Usuários indo ao checkout só para ver frete.
- Reclamações de custo surpresa.
- Falha de pagamento por método limitado.

### Recomendações comuns

- Simular frete na PDP.
- Mostrar prazo estimado.
- Explicar parcelamento.
- Evitar custo surpresa.
- Mostrar políticas de troca antes do checkout.
- Exibir métodos de pagamento.
- Tratar cupom com clareza.
- Mostrar estoque/disponibilidade.

Custo escondido não é estratégia. É convite para abandono.

---

## 18. Carrinho

Carrinho é etapa de revisão e decisão. Ele precisa deixar claro o que será comprado, quanto custará e o que o usuário pode ajustar.

### Perguntas de pesquisa

- Usuário entende os itens no carrinho?
- Consegue alterar quantidade?
- Consegue remover item?
- Pode voltar à PDP?
- Entende frete e prazo?
- Vê custo total?
- Confia para seguir ao checkout?
- Recomendações ajudam ou distraem?
- Carrinho preserva itens?

### Elementos importantes

- imagem do produto;
- nome claro;
- variação selecionada;
- preço;
- quantidade;
- subtotal;
- frete;
- prazo;
- cupom;
- total;
- remover/editar;
- continuar comprando;
- CTA para checkout;
- segurança/garantia;
- disponibilidade.

### Erros comuns

- Não permitir edição fácil.
- Esconder variações.
- Remover sem desfazer.
- CTA fraco.
- Total incompleto.
- Cross-sell agressivo.
- Frete só no checkout.
- Carrinho vazio sem orientação.

Carrinho bom ajuda o usuário a revisar e seguir. Carrinho ruim parece armadilha.

---

## 19. Checkout

Checkout é onde a intenção encontra a fricção. Usuários já decidiram comprar; o trabalho do UX é não atrapalhar.

### Perguntas de pesquisa

- O checkout exige cadastro desnecessário?
- O número de campos é adequado?
- Labels são claros?
- Validação ajuda ou pune?
- Erros são compreensíveis?
- O usuário entende etapas?
- Frete e prazo estão claros?
- Pagamento funciona?
- Mobile é confortável?
- Segurança e privacidade estão claras?
- É possível revisar antes de pagar?

### Áreas críticas

- login/cadastro;
- dados pessoais;
- endereço;
- entrega;
- pagamento;
- revisão;
- confirmação;
- mensagens de erro;
- recuperação de falha;
- segurança.

### Erros comuns

- Cadastro obrigatório cedo demais.
- Campo demais.
- Máscara ruim.
- Validação tardia.
- Mensagem de erro genérica.
- Perder dados após erro.
- Não indicar etapa.
- Frete surpresa.
- Métodos de pagamento limitados.
- Falha sem recuperação.
- Redirecionamento assustador.
- Checkout mobile apertado.

### Método recomendado

- Analytics por etapa.
- Teste de usabilidade moderado.
- Análise de erros por campo.
- Session replay com cuidado.
- Logs de pagamento.
- Atendimento/suporte.
- Reteste após correção.

Checkout é um dos lugares em que UX e dinheiro se cumprimentam diretamente.

---

## 20. Formulários em e-commerce

Formulários aparecem em cadastro, endereço, pagamento, cupom, newsletter, atendimento e login.

### O que testar

- labels;
- placeholders;
- máscaras;
- validação;
- mensagens de erro;
- campos obrigatórios;
- ordem dos campos;
- autofill;
- teclado mobile;
- recuperação de erro;
- campos de endereço;
- CPF/CNPJ, quando aplicável;
- telefone;
- cupom;
- senha;
- confirmação.

### Boas perguntas de pesquisa

- Usuário entende o que preencher?
- Entende por que aquele dado é solicitado?
- O erro ajuda a corrigir?
- O teclado certo aparece no mobile?
- Autofill funciona?
- O usuário perde dados após erro?
- Campos obrigatórios são realmente necessários?
- A pessoa confia em informar dados?

### Problemas comuns

| Problema | Impacto | Ação |
|---|---|---|
| Placeholder como label | Usuário perde contexto ao digitar | Usar label persistente |
| Erro genérico | Usuário não sabe corrigir | Mensagem específica |
| Validação só no final | Retrabalho | Validar no momento certo |
| Campo obrigatório sem motivo | Desconfiança | Remover ou explicar |
| Máscara rígida | Erros desnecessários | Aceitar formatos flexíveis |
| Teclado errado no mobile | Esforço alto | Definir input correto |

---

## 21. Confiança, risco percebido e credibilidade

Compra online exige confiança. O usuário precisa acreditar que produto, loja, pagamento, entrega, troca e suporte são confiáveis.

### Fatores de confiança

- marca conhecida;
- história;
- avaliações;
- reviews;
- fotos reais;
- política de troca;
- garantia;
- canais de atendimento;
- informações de empresa;
- meios de pagamento seguros;
- prazo e rastreio;
- transparência de preço;
- qualidade do conteúdo;
- ausência de erros;
- design profissional;
- consistência visual e textual;
- dados de contato;
- selo ou certificação real, quando aplicável.

### Perguntas de pesquisa

- O usuário confia na loja?
- O que gera confiança?
- O que gera desconfiança?
- O conteúdo institucional ajuda?
- Garantia está visível?
- Política de troca é compreensível?
- Atendimento parece acessível?
- A loja parece legítima?
- O checkout parece seguro?

### Erros comuns

- Esconder política de troca.
- Usar selo sem contexto.
- Não mostrar contato.
- Conteúdo institucional genérico.
- Página “Sobre” sem substância.
- Avaliações inexistentes sem alternativa de confiança.
- Erros de português em áreas críticas.
- Checkout com aparência diferente demais do site.
- Pedir dados sensíveis sem explicar.

Confiança não é bloco no rodapé. É sensação construída em cada etapa.

---

## 22. Mobile commerce

Mobile não é desktop menor. Em e-commerce, mobile traz limitações e contextos próprios: tela pequena, toque, conexão variável, atenção dividida e mais fricção para preencher dados.

### O que pesquisar no mobile

- busca visível;
- menu claro;
- filtros acessíveis;
- listagem escaneável;
- imagens navegáveis;
- CTA visível;
- PDP sem perda de contexto;
- carrinho simples;
- checkout confortável;
- teclado certo por campo;
- autofill;
- pagamento rápido;
- performance;
- estabilidade visual;
- toque confortável;
- mensagens de erro.

### Erros comuns

- Filtros escondidos demais.
- Modal de filtro confuso.
- CTA perdido abaixo da dobra.
- Imagem ocupa tudo e esconde compra.
- Formulário longo sem progresso.
- Teclado inadequado.
- Elementos pequenos.
- Performance ruim.
- Conteúdo técnico comprimido sem hierarquia.
- Checkout com muitas etapas sem indicação.

### Perguntas de teste

- Usuário consegue encontrar produto no mobile?
- Consegue filtrar sem se perder?
- Entende a PDP?
- Consegue calcular frete?
- Consegue preencher endereço sem erro?
- Consegue pagar sem abandonar?
- O layout muda inesperadamente?
- A página responde rápido?

Mobile é onde fricção pequena vira abandono grande.

---

## 23. Conteúdo institucional dentro do e-commerce

Algumas lojas precisam vender produto e marca ao mesmo tempo. Isso é comum em marcas próprias, produtos técnicos, nichos, marcas com história ou empresas que estão migrando de site institucional para loja.

### Objetivo do conteúdo institucional

- gerar confiança;
- explicar autoridade;
- contar história;
- diferenciar marca;
- reduzir risco percebido;
- apoiar decisão;
- comunicar garantia;
- apresentar suporte;
- fortalecer SEO;
- educar compradores.

### Risco

Conteúdo institucional pode ajudar, mas também pode atrapalhar se competir com a tarefa de compra.

### Como pesquisar

- Teste de compreensão da home.
- Entrevistas sobre confiança.
- Teste de PDP com e sem prova institucional.
- Analytics de navegação institucional → compra.
- Avaliação de conteúdo.
- Teste de tarefa: “antes de comprar, descubra se esta marca é confiável”.

### Boas práticas

- Colocar história onde ela ajuda confiança.
- Não esconder produto atrás de manifesto.
- Conectar storytelling com benefício.
- Usar conteúdo institucional na PDP quando reduz risco.
- Criar página “Sobre” substancial.
- Expor garantia e suporte perto da decisão.
- Evitar texto genérico de marca.

Institucional bom responde: “por que devo confiar?”. Institucional ruim responde: “olha como somos incríveis”. O usuário sente a diferença.

---

## 24. Pós-compra, suporte, troca e devolução

A experiência não acaba na compra. Pós-compra ruim destrói recompra e confiança.

### Perguntas de pesquisa

- Usuário entende confirmação do pedido?
- Recebe informação clara de rastreio?
- Sabe quando chega?
- Sabe como trocar ou devolver?
- Encontra suporte?
- Entende garantia?
- Consegue consultar pedido?
- Recebe comunicação adequada?
- O pós-compra reduz ansiedade?

### Métricas úteis

- tickets pós-compra;
- tickets sobre rastreio;
- tickets sobre troca;
- CSAT de atendimento;
- taxa de devolução;
- motivo de devolução;
- atraso de entrega;
- recompra;
- avaliação pós-compra.

### Problemas comuns

- Confirmação vaga.
- Rastreio escondido.
- Política de troca difícil.
- Suporte sem canal claro.
- E-mails confusos.
- Status de pedido pouco informativo.
- Falta de documentação de garantia.
- Dúvida recorrente que deveria estar no site.

Pós-compra é onde a promessa da loja encontra a realidade. Se falha, o usuário lembra.

---

## 25. E-commerce de produto técnico ou de decisão complexa

Produtos técnicos exigem UX mais educativa. O usuário pode não entender especificação, compatibilidade, diferença entre modelos ou critério de escolha.

Exemplos:

- instrumentos musicais;
- eletrônicos;
- peças;
- suplementos não regulados? evitar em contexto sensível;
- equipamentos profissionais;
- móveis sob medida;
- softwares;
- produtos B2B;
- ferramentas;
- equipamentos de segurança não restritos;
- itens com variação técnica.

### Necessidades comuns

- guia de escolha;
- comparador;
- glossário;
- “ideal para”;
- “compatível com”;
- “não recomendado para”;
- vídeo demonstrativo;
- reviews por perfil de uso;
- FAQ técnico;
- atendimento consultivo;
- filtros educativos;
- conteúdos de compra.

### Perguntas de pesquisa

- O usuário entende as diferenças?
- Quais atributos importam?
- Quais termos confundem?
- Onde sente risco?
- Precisa de ajuda humana?
- Comparador ajuda?
- Guia de compra reduz indecisão?
- Conteúdo técnico está no nível certo?

Produto técnico exige tradução. Quem entende demais do produto costuma esquecer como é não entender.

---

## 26. Métricas principais em e-commerce UX

| Área | Métrica | O que indica | Cuidado |
|---|---|---|---|
| Busca | Zero results | Linguagem/taxonomia falhando | Pode ser termo fora do catálogo |
| Categoria | CTR em cards | Interesse/clareza dos cards | Depende de tráfego |
| Filtros | Uso de facetas | Critérios de decisão | Uso baixo pode ser invisibilidade |
| PDP | Add-to-cart | Força da decisão | Preço/oferta influenciam |
| PDP | Simulação de frete | Interesse + preocupação com custo | Pode indicar frete importante |
| Carrinho | Abandono | Custo, confiança, prazo | Precisa segmentar |
| Checkout | Erro por campo | Formulário/validação ruim | Pode ser dado inválido real |
| Checkout | Conclusão | Eficácia do fluxo | Depende de pagamento/tráfego |
| Pós-compra | Tickets | Dúvidas não resolvidas | Pode indicar volume alto |
| Recompra | Retenção | Confiança e satisfação | Depende de ciclo de produto |

### Funil mínimo

```txt
view_category
↓
view_product
↓
add_to_cart
↓
begin_checkout
↓
add_shipping_info
↓
add_payment_info
↓
purchase
```

### Eventos úteis

```txt
use_search
search_no_results
apply_filter
sort_products
compare_products
view_product_images
watch_product_video
select_variant
calculate_shipping
view_warranty
view_return_policy
add_to_cart
remove_from_cart
apply_coupon
checkout_error
payment_error
purchase
track_order
contact_support
```

---

## 27. Pesquisa e validação por área

| Área | Método recomendado | O que observar |
|---|---|---|
| Home | Teste de compreensão + analytics | Se usuário entende proposta e caminhos |
| Categorias | Card sorting + tree testing | Se estrutura bate com modelo mental |
| Busca | Logs + teste de tarefa | Termos, zero results, relevância |
| Filtros | Teste de listagem | Se filtros ajudam decisão |
| PDP | Teste de usabilidade | Clareza, confiança, informação |
| Carrinho | Teste de fluxo | Revisão, custo total, edição |
| Checkout | Funil + teste moderado | Erros, abandono, recuperação |
| Mobile | Teste em dispositivo real | Toque, performance, formulário |
| Institucional | Teste de confiança | Se história reduz risco |
| Pós-compra | Suporte + pesquisa | Dúvidas, rastreio, troca |

---

## 28. Erros comuns em e-commerce UX Research

- Focar só em conversão.
- Testar botão antes de entender a decisão de compra.
- Copiar concorrente sem validar.
- Ignorar busca interna.
- Ignorar atendimento e suporte.
- Tratar PDP como catálogo técnico.
- Não pesquisar critérios de decisão.
- Usar filtros baseados no banco, não no usuário.
- Esconder frete e prazo.
- Avaliar checkout só visualmente.
- Testar apenas desktop.
- Não segmentar iniciantes e experientes.
- Confundir tráfego ruim com UX ruim.
- Confundir preço alto com problema de interface.
- Ignorar indisponibilidade/estoque.
- Não medir erro por campo no checkout.
- Não acompanhar pós-compra.
- Achar que institucional e e-commerce são mundos separados.
- Usar review/prova social sem pensar em confiança real.
- Não instrumentar eventos importantes.

E-commerce é sensível: um problema pequeno no lugar errado custa venda.

---

## 29. Checklist de auditoria UX para e-commerce

### Descoberta e navegação

- [ ] Usuário entende o que a loja vende?
- [ ] Categorias principais estão claras?
- [ ] Busca está visível?
- [ ] Menu reflete tarefas do usuário?
- [ ] Existe caminho para iniciantes?
- [ ] Existe caminho para compradores experientes?

### Busca e filtros

- [ ] Busca aceita sinônimos?
- [ ] Busca lida com erros?
- [ ] Zero results oferece alternativas?
- [ ] Filtros ajudam decisão?
- [ ] Filtros têm labels claros?
- [ ] Filtros mobile são usáveis?
- [ ] Filtros aplicados ficam visíveis?
- [ ] É fácil remover filtros?

### Listagem

- [ ] Cards mostram informação suficiente?
- [ ] Produtos são comparáveis?
- [ ] Preço e disponibilidade estão claros?
- [ ] Ordenação faz sentido?
- [ ] Produto indisponível é tratado bem?

### PDP

- [ ] Nome do produto é claro?
- [ ] Imagens ajudam decisão?
- [ ] Preço, parcelamento e frete estão claros?
- [ ] Especificações são traduzidas em benefício?
- [ ] Há indicação de uso?
- [ ] Garantia/troca estão visíveis?
- [ ] CTA é claro?
- [ ] Variações são compreensíveis?
- [ ] Reviews/prova social ajudam?

### Carrinho e checkout

- [ ] Carrinho permite revisão?
- [ ] Custo total aparece?
- [ ] Frete não surpreende?
- [ ] Cadastro não é barreira desnecessária?
- [ ] Campos são claros?
- [ ] Erros ajudam a corrigir?
- [ ] Pagamento é confiável?
- [ ] Usuário consegue recuperar falhas?

### Pós-compra

- [ ] Confirmação é clara?
- [ ] Rastreio é fácil?
- [ ] Troca/devolução é compreensível?
- [ ] Suporte é acessível?
- [ ] Garantia é encontrável?

---

## 30. Como aplicar em um projeto real

Exemplo: **site institucional que será transformado em e-commerce**.

### Sequência recomendada

1. **Alinhamento de negócio**
   - O que será vendido?
   - Quais produtos são prioridade?
   - Quem compra?
   - Qual plataforma?
   - Qual checkout?
   - Quais restrições?

2. **Inventário**
   - Páginas institucionais.
   - Produtos.
   - Categorias.
   - Fichas técnicas.
   - Políticas.
   - Conteúdos de suporte.
   - Mídias.

3. **Dados existentes**
   - Produtos mais vendidos.
   - Dúvidas de atendimento.
   - Busca orgânica.
   - Vendas por canal.
   - Reclamações.
   - Devoluções.

4. **Benchmark**
   - Concorrentes diretos.
   - Marketplaces.
   - Referências de PDP.
   - Referências de checkout.
   - Marcas com storytelling forte.

5. **Entrevistas**
   - Comprador iniciante.
   - Comprador experiente.
   - Pessoa comprando presente.
   - Revendedor/vendedor.
   - Atendimento/suporte.

6. **Síntese**
   - Critérios de decisão.
   - Objeções.
   - Linguagem do usuário.
   - Dores e oportunidades.

7. **Arquitetura da informação**
   - Categorias.
   - Labels.
   - Filtros.
   - Navegação.
   - Busca.
   - Conteúdo institucional.

8. **Prototipação**
   - Home.
   - Categoria/listagem.
   - PDP.
   - Carrinho.
   - Checkout.
   - Sobre/garantia.
   - Guia de compra.

9. **Teste de usabilidade**
   - Encontrar produto.
   - Comparar modelos.
   - Entender garantia.
   - Calcular frete.
   - Finalizar compra.

10. **Mensuração**
   - Eventos.
   - Funil.
   - Busca.
   - Filtros.
   - PDP.
   - Checkout.
   - Pós-compra.

### Exemplo para marca com história

| Desafio | Pesquisa | Solução candidata |
|---|---|---|
| Marca tem história, mas precisa vender | Teste de confiança | Blocos institucionais próximos de decisões |
| Produto técnico confunde iniciante | Entrevistas + PDP test | “Ideal para”, glossário e comparador |
| Usuário quer saber frete cedo | Teste + analytics | Simulador na PDP |
| Categorias internas não ajudam | Card sorting | Taxonomia por tipo/uso/perfil |
| Checkout pode assustar | Teste de fluxo | Guest checkout e erros claros |

---

## 31. Relação com outros arquivos da base

- **01_UX_RESEARCH_METHODS.md** — ajuda a escolher métodos para cada pergunta de e-commerce.
- **02_DISCOVERY_AND_DOUBLE_DIAMOND.md** — estrutura o começo do projeto e separa problema de solução.
- **03_USER_INTERVIEWS_AND_CONTEXT.md** — orienta entrevistas sobre decisão de compra, confiança e contexto.
- **04_SYNTHESIS_AND_MAPPING.md** — transforma achados em jornada, oportunidades e recomendações.
- **05_INFORMATION_ARCHITECTURE.md** — sustenta categorias, busca, filtros e taxonomia.
- **06_IDEATION_AND_WORKSHOPS.md** — transforma oportunidades em hipóteses e protótipos.
- **07_USABILITY_TESTING.md** — valida PDP, carrinho, checkout e navegação.
- **08_UX_METRICS.md** — define eventos, funis e métricas.
- **10_ACCESSIBILITY_RESEARCH.md** — garante que compra seja possível para mais pessoas.
- **11_RESEARCHOPS.md** — organiza cadência de pesquisa, recrutamento e repositório.

Este arquivo é vertical: ele usa os métodos gerais da base dentro de um contexto específico, onde a decisão do usuário é compra.

---

## 32. E-commerce UX e SEO/estrutura de dados

SEO e dados estruturados não substituem UX, mas ajudam descoberta e qualidade da informação em mecanismos de busca.

### Pontos importantes

- Produto precisa ter informações visíveis e consistentes.
- Dados estruturados podem ajudar mecanismos de busca a entender preço, disponibilidade, avaliações e informações de produto.
- Merchant Center e feeds exigem dados corretos e atualizados.
- Informações inconsistentes entre página, feed e estoque geram problemas.
- SEO de produto deve refletir linguagem do usuário, não só nome técnico interno.

### Relação com UX

| Tema técnico | Impacto na experiência |
|---|---|
| Product structured data | Pode melhorar apresentação do produto em busca |
| Disponibilidade correta | Evita frustração |
| Preço consistente | Evita quebra de confiança |
| Reviews estruturados | Ajuda prova social |
| Imagem de produto | Afeta decisão antes do clique |
| Nome e descrição | Afetam encontrabilidade e compreensão |

SEO ruim pode impedir descoberta. UX ruim pode desperdiçar descoberta.

---

## 33. Fontes utilizadas

- Baymard Institute — Ecommerce UX Research & Guidelines: https://baymard.com/
- Baymard Institute — Product Lists & Filtering UX: https://baymard.com/research/ecommerce-product-lists
- Baymard Institute — E-Commerce Search UX: https://baymard.com/research/ecommerce-search
- Baymard Institute — Homepage & Category Navigation UX: https://baymard.com/research/homepage-and-category-usability
- Baymard Institute — Product Page UX Research: https://baymard.com/research/product-page
- Baymard Institute — Product Page UX Best Practices: https://baymard.com/blog/current-state-ecommerce-product-page-ux
- Baymard Institute — Cart & Checkout Usability Research: https://baymard.com/research/checkout-usability
- Baymard Institute — Checkout UX Best Practices: https://baymard.com/blog/current-state-of-checkout-ux
- Baymard Institute — Cart Abandonment Rate Statistics: https://baymard.com/lists/cart-abandonment-rate
- Baymard Institute — Mobile E-Commerce Usability: https://baymard.com/research/mcommerce-usability
- Baymard Institute — Native Mobile App UX Research: https://baymard.com/research/mobile-app
- Baymard Institute — E-commerce Filter UI Best Practices: https://baymard.com/learn/ecommerce-filter-ui
- Baymard Institute — Product Finding Research Update: https://baymard.com/blog/product-finding-2024-launch
- NN/g — Ecommerce Product Pages: https://www.nngroup.com/articles/ecommerce-product-pages/
- NN/g — Ecommerce UX Research Report: https://www.nngroup.com/reports/ecommerce-user-experience/
- NN/g — Ecommerce Search User Experience: https://www.nngroup.com/reports/ecommerce-ux-search-including-faceted-search/
- NN/g — Shopping Carts, Checkout & Registration: https://www.nngroup.com/reports/ecommerce-ux-shopping-carts-checkout-registration/
- NN/g — Decision Making in the Ecommerce Shopping Cart: https://www.nngroup.com/articles/shopping-cart/
- NN/g — The Mobile Checkout Experience: https://www.nngroup.com/articles/mobile-checkout-ux/
- Google Search Central — Introduction to Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Google Search Central — Merchant listing structured data: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- Google Merchant Center Help — Product data specification: https://support.google.com/merchants/answer/7052112
- Google Merchant Center Help — Set up structured data for Merchant Center: https://support.google.com/merchants/answer/7331077
- Google Search Central — Introduction to structured data markup: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

---

## 34. Resumo executivo

Use este arquivo quando o projeto envolve loja virtual, catálogo, marketplace, checkout, compra online, product finding ou transformação de site institucional em e-commerce.

A lógica principal é:

```txt
Descobrir como o usuário compra
↓
Mapear critérios de decisão
↓
Organizar catálogo e navegação
↓
Validar busca, filtros e categorias
↓
Garantir PDP clara e confiável
↓
Reduzir fricção no carrinho
↓
Simplificar checkout
↓
Medir funil e comportamento
↓
Ajustar continuamente
```

O Claude Cowork deve usar este documento para:

- criar plano de pesquisa para e-commerce;
- auditar jornadas de compra;
- montar benchmark de lojas;
- planejar entrevistas sobre decisão de compra;
- revisar busca, filtros e taxonomia;
- avaliar páginas de produto;
- planejar testes de carrinho e checkout;
- definir eventos e métricas de e-commerce;
- transformar achados em backlog de melhoria;
- equilibrar conteúdo institucional e compra.

E-commerce UX Research é, no fundo, pesquisa sobre decisão. Quem entende como a pessoa decide compra melhor, desenha melhor e desperdiça menos tráfego.
