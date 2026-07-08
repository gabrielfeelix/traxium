# 09_ECOMMERCE — CORE

## 1. Para que serve

Dono do tema **UX Research em e-commerce**: pesquisar, diagnosticar, validar e melhorar lojas virtuais — descoberta, busca, filtros, categorias, página de produto, carrinho, checkout, mobile, confiança e pós-compra. Arquivo **vertical**: aplica os métodos gerais da base no contexto onde a decisão do usuário é **compra**.

Princípio que manda em tudo: **e-commerce bom reduz risco percebido e aumenta clareza de decisão.** Conversão é resultado, não foco — a pesquisa entende o que acontece antes: como chega, procura, compara, confia e decide.

## 2. Quando usar / Quando NÃO usar

**Quando usar:**
- Loja virtual, marketplace, catálogo, fluxo de compra, PDP, checkout; migração de site institucional → e-commerce.
- Diagnosticar onde o funil cai e por quê (microdecisões: encontrar → entender → confiar → escolher → comprar).

**Quando NÃO confundir / NÃO fazer:**
- **UX ≠ CRO ≠ UI** — UX research **melhora a qualidade das hipóteses de CRO** (testa mudança porque viu problema, não por palpite); não embeleza fluxo quebrado.
- Não **copiar concorrente cego** — padrão comum não é prova de qualidade; benchmark gera hipótese, não decisão.
- Não tratar **PDP como catálogo técnico** — especificação sem tradução não decide.
- Não confundir **tráfego ruim / preço alto** com problema de interface.

## 3. Processo operacional

**Jornada de compra** (cadeia): descoberta → exploração → busca/navegação → listagem → PDP → comparação → carrinho → checkout → pagamento → confirmação → entrega → pós-compra → recompra. Identifique **quais etapas são críticas** para *este* negócio — nem todo e-commerce tem o mesmo gargalo.

**Levante os dados internos antes** de entrevistar/desenhar: analytics/funil, busca interna (termos, zero results), atendimento (dúvidas/objeções), vendas/estoque, devoluções (motivos), reviews. Research bom não finge que a empresa não sabe nada.

**Áreas-chave a pesquisar:**
- **Home** — orienta o próximo passo (top tasks, busca visível, proposta clara), não mostra tudo.
- **Categorias / busca / filtros** — refletem como o usuário procura, não o estoque. Estrutura, taxonomia e facetas → dono é `05`. Filtro bom nasce da decisão do usuário; busca precisa dos termos reais (sinônimos, erro de digitação, zero results com alternativa).
- **PDP** — responde as dúvidas de decisão; **traduz técnica em uso** ("eletroacústico" → "toca com ou sem amplificador"), mostra "ideal para", preço/frete/prazo, garantia, prova social, variações.
- **Carrinho** — revisão clara: itens, custo total, frete, editar. Sem custo surpresa.
- **Checkout** — a intenção encontra a fricção; o trabalho é **não atrapalhar**: sem cadastro forçado cedo, campos mínimos, erro que ajuda a corrigir, sem frete surpresa, recuperação de falha.
- **Mobile** — não é desktop menor: filtros acessíveis, CTA visível, teclado certo, performance. Fricção pequena vira abandono grande.
- **Confiança / risco percebido** — construída em cada etapa (avaliações, garantia, política de troca visível, transparência de preço, checkout seguro), não bloco no rodapé.
- **Pós-compra** — confirmação, rastreio, troca/devolução, suporte. Falha aqui mata recompra.

**Custo total** (preço + frete + prazo + parcelamento): apareça **cedo**. Custo escondido é convite ao abandono.

**Funil de compra** — define onde investigar, não por que a pessoa saiu. Métrica/evento/funil são dono de `08`; aqui, a aplicação ao funil de compra (view_product → add_to_cart → begin_checkout → add_shipping → add_payment → purchase).

**Produto técnico / decisão complexa** exige UX educativa: guia de escolha, comparador, glossário, "ideal para / não recomendado para". Quem entende demais do produto esquece como é não entender.

## 4. Checklist

Auditoria UX de e-commerce (por área):

- [ ] **Descoberta:** entende o que a loja vende? categorias claras? busca visível? caminho p/ iniciante e experiente?
- [ ] **Busca/filtros:** sinônimos e erro de digitação? zero results com alternativa? filtros ajudam decisão, com label claro, removíveis, usáveis no mobile?
- [ ] **Listagem:** cards dão informação p/ decidir o próximo clique? preço e disponibilidade claros? indisponível tratado?
- [ ] **PDP:** specs traduzidas em benefício? "ideal para"? preço/frete/prazo, garantia/troca, prova social, variações claras? CTA claro?
- [ ] **Carrinho/checkout:** revisão e custo total? frete não surpreende? cadastro não é barreira? erros ajudam? pagamento confiável e recuperável?
- [ ] **Pós-compra:** confirmação, rastreio, troca/devolução e suporte encontráveis?

## 5. Erros comuns

- Não **foque só em conversão** nem teste botão antes de entender a **decisão de compra**.
- Não **esconda frete e prazo** — abandono clássico no custo surpresa.
- Não use **filtros baseados no banco** em vez do critério do usuário; não ignore a **busca interna**.
- Não **teste só desktop** nem **avalie checkout só visualmente** — meça erro por campo e teste no mobile real.
- Não **separe institucional e e-commerce** — confiança e compra andam juntas; ignore o pós-compra por sua conta e risco.

## 6. Relação com outros arquivos

- **Escolher método para cada pergunta de e-commerce** → `01`.
- **Começo do projeto, separar problema de solução** → `02`.
- **Entrevistas sobre decisão de compra, confiança, contexto** → `03`.
- **Jornada de compra, oportunidades, recomendações (síntese)** → `04`.
- **Categorias, busca, filtros, taxonomia, labels** → dono é `05`.
- **Oportunidades → hipóteses e protótipos** → `06`.
- **Validar PDP, carrinho, checkout, navegação** → `07`.
- **Eventos, funil, métricas e conversão (definição)** → dono é `08`.
- **Compra possível para mais pessoas (acessibilidade)** → `10`.
- **Cadência de pesquisa, recrutamento, repositório** → `11`.

## 7. Fontes principais

- **Baymard Institute — Ecommerce UX Research & Guidelines** — PDP, listagem/filtros, busca, carrinho/checkout, mobile.
- **NN/g — Ecommerce UX Research Reports** — product pages, search, carts/checkout/registration.
- **Google Search Central / Merchant Center — Product structured data** — dados estruturados de produto (descoberta).

Demais fontes (Baymard por tema; NN/g shopping cart, mobile checkout) → `_SOURCES.md`.

→ Aprofundamento: expanded/09_ECOMMERCE_EXPANDED.md
