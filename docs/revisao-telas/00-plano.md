# Revisão das telas do protótipo: plano

Início em 08/10/2026. Objeto: as 21 telas do protótipo em `SaaS moderno estilo Dribbble/`.

## Motivação

O protótipo foi construído por agentes, tela a tela, sem uma revisão de conjunto. A pesquisa de mercado de 08/10/2026 (`reports/Concorrentes e fluxos do Traxium.md`, notas em `research_notes/Concorrentes e fluxos do Traxium/`) mostrou três coisas que pedem essa revisão: o núcleo de decisão do Traxium não tem concorrente; algumas telas parecem maiores do que o usuário precisa; e faltam itens que o mercado já trata como mínimo.

## Etapas

| Etapa | Entrega | Arquivo |
| --- | --- | --- |
| 1 | Registro da pesquisa e deste plano | `00-plano.md`, `reports/`, `research_notes/` |
| 2 | Inventário de cada tela: dados exibidos, ações, modais, estados, entradas e saídas, entidades tocadas | `inventario/*.md` e `01-inventario.md` (mapa do site) |
| 3 | Usuários e trabalhos: quem compra, quem usa, o que cada um precisa fazer no dia, na qualificação de terceiros e na auditoria | `02-usuarios-e-trabalhos.md` |
| 4 | Diagnóstico tela a tela: essencial, excesso, falta, duplicidade, com evidência do inventário e do mercado | `03-diagnostico.md` |
| 5 | Arquitetura proposta: telas, navegação e fluxos ponta a ponta | `04-arquitetura-proposta.md` |

Cada etapa termina em commit. A etapa 5 termina com a proposta; alterar, fundir ou cortar telas no protótipo depende de aprovação e fica para depois.

## Critérios usados no diagnóstico

1. A tela serve a uma tarefa real de um usuário identificado na etapa 3.
2. A informação exibida é usada para decidir ou agir; informação sem decisão associada é candidata a corte.
3. Cada registro tem início, fim e dono, e o caminho de criar, consultar, corrigir e exportar está claro.
4. A tela continua utilizável com 80 ou mais registros.
5. A regra exibida corresponde ao que a norma ou o cliente realmente exige (GMP+ TS1.2, TS1.9, R1.0; EUDR; ANTT).
6. O que o mercado já trata como mínimo existe; o que nenhum usuário pediu e nenhuma norma exige precisa de justificativa.
