# Handoff: protótipo como sistema único e revisão de UI e UX página por página

Escrito em 15/10/2026 para o próximo agente. Leia antes `HANDOFF.md` (como rodar, bateria de testes, arquitetura, regras do Gabriel na seção 9) e `07-revisao-v2.md` (o que já foi revisto e por quê). Este arquivo diz o que fazer agora.

## 1. O pedido do Gabriel (15/10/2026)

1. **Virar um sistema, não várias páginas HTML.** Hoje cada tela é um `.dc.html` com a própria cópia da sidebar e do header. Cada clique recarrega a página inteira e redesenha a moldura. Ele quer o que o Autofluxos faz: sidebar fixa e header fixo desenhados uma vez, e só o conteúdo da página mudando. Vale mesmo sendo protótipo. **É requisito, não sugestão.**
2. **Revisar página por página** o layout, a UI e a UX, com foco em boas práticas.
3. **Fundo e moldura com o Autofluxos como referência visual**, mas com as cores do Traxium. Ele mesmo disse "sei lá" quanto ao fundo: mostre opções em captura e deixe ele escolher.

## 2. Onde está o protótipo hoje

- Pasta `SaaS moderno estilo Dribbble/`, dez telas v2: `Hoje`, `Viagens v2`, `Viagem`, `Transportadores`, `Frota`, `Compartimento v2`, `Auditoria`, `Cadastros`, `Configuracoes v2` e `Link da Viagem` (celular, sem sidebar).
- Runtime `support.js` (gerado, não editar): lê o `<x-dc>` de cada arquivo e renderiza com React (`window.React`). Tem `sc-if`, `sc-for` e componentes filhos (`dc-import`, `x-import`).
- Dados e motor de decisão em `tx-dados.js` (roda no navegador e no Node, 674 conferências em `scripts/testar-tx-dados.mjs`). Valores comuns da moldura em `tx-ui.js`.
- A moldura (sidebar, header com busca global, modais do topo) sai de `scripts/gerar-sidebar.mjs`, que escreve a mesma cópia em cada uma das nove telas com sidebar. É exatamente isso que precisa acabar.
- Há um app Next.js antigo em `src/` (protótipo v1, dados fixos, organizado por módulos). Não é a referência.
- A branch é `fix/ux-fase-1-3`, enviada ao GitHub. A publicação na Vercel é com o Gabriel (a pasta está ligada a um projeto de outra conta; ele loga quando quiser publicar). **Não peça acesso nem conta a ele.**

## 3. Parte 1: uma moldura só

### O que precisa ficar verdadeiro no fim

1. A sidebar e o header são renderizados uma vez. Trocar de tela não recarrega a página, não pisca a moldura, e o estado da sidebar (recolhida, acordeão de Cadastros) continua.
2. No desktop só o conteúdo rola. A sidebar fica parada na altura da janela, sem depender de `position:sticky` em cada tela.
3. Cada tela tem endereço próprio (os parâmetros de hoje continuam: `?id=`, `?visao=`, `?aba=`, `?filial=`, `&liberar=1`, `#ocorrencias`), o botão voltar do navegador funciona e um link copiado abre na tela certa.
4. O Link da Viagem continua fora da moldura (é a tela do motorista no celular).
5. Toda a bateria da seção 2 do `HANDOFF.md` continua passando, adaptada às rotas novas.

### Duas formas de chegar lá

| | A. Migrar para o Next.js do repositório | B. Moldura única no runtime atual |
| --- | --- | --- |
| Como | App Router com `app/(painel)/layout.tsx` contendo sidebar e header; uma rota por tela; o template de cada `.dc.html` vira JSX; `tx-dados.js` entra como módulo (ou portado para TypeScript) | Um `App.dc.html` com sidebar, header e um roteador por hash; cada tela vira componente filho por `dc-import`, sem moldura própria |
| A favor | É exatamente o padrão do Autofluxos (Next 16, mesma versão do repositório), com código de moldura pronto para estudar. Vira a base do front-end real | Reaproveita os templates como estão. Mais rápido se o runtime aceitar trocar o filho por rota |
| Contra | Reescrever dez templates (trabalho mecânico, mas grande). Decidir o que fazer com o v1 em `src/`. A publicação precisa de build Next | Não está provado que `dc-import` aceita troca por rota e estado compartilhado. Continua protótipo descartável |

**Recomendação:** A. O pedido é "um sistema", o produto final vai ser React, e o Autofluxos já resolveu os mesmos problemas no mesmo framework. Antes de começar, mostre ao Gabriel em uma linha o custo (dez telas a converter) e o que acontece com `src/`; se ele não responder, siga com A, mantendo o protótipo `.dc.html` funcionando até a versão nova ter as dez telas (os sócios estão usando o link para testar).

Se for A: o `AGENTS.md` da raiz avisa que esta versão do Next tem mudanças. Leia o guia em `node_modules/next/dist/docs/` antes de escrever código. Não apague `src/` sem o Gabriel; mova para uma pasta de legado com um aviso ou combine com ele.

### Onde olhar no Autofluxos (`/home/gabfelix/dev/4yu-apps/autofluxos-ux`)

| Arquivo | O que tem |
| --- | --- |
| `src/components/design/shell.tsx` | Moldura do painel: no desktop, sidebar como coluna fixa e só o conteúdo rola (`md:h-screen md:overflow-hidden`); no celular, a barra vira faixa no topo |
| `src/components/design/cliente-shell.tsx` | Comentário explica por que a sidebar saiu da página e foi para o `layout.tsx`: ela era redesenhada a cada página e piscava em todo clique |
| `src/app/clientes/[clienteId]/layout.tsx` | Onde a sidebar mora de fato (`BarraDoCliente` e `MolduraDoCliente`) |
| `src/components/design/barra-lateral.tsx`, `barra-do-cliente.tsx` | Itens, grupos, recolher |
| `src/components/design/barra-de-lista.tsx` | Barra de lista com busca, "Filtros" em popover e filtros ativos removíveis (o padrão que Viagens já segue) |
| `src/app/globals.css`, linhas 110 a 270 | Tokens de cor: `--canvas #f6f7f9`, `--canvas-deep #eef0f4`, `--panel #fff`, `--surface #f2f4f7`, `--line #e5e8ec`, `--ink #131922`, `--muted #4f5967`, e o tema escuro |

Avalie os padrões; não copie componentes. A sidebar do Autofluxos é clara com borda; a do Traxium é teal escura e flutuante, aprovada (`SaaS moderno estilo Dribbble/CLAUDE.md`). Trocar a sidebar para clara só como opção mostrada em captura, nunca por conta própria.

## 4. Parte 2: fundo e tokens

1. **Tokens antes de cor.** Hoje as cores estão escritas à mão em estilo inline em todas as telas (`#f2f5f4`, `#e4eae8`, `#5c706e`, `#7c8f8d` e outras). Defina tokens (fundo, fundo profundo, painel, superfície, borda, borda forte, texto, texto secundário, texto apagado, primário, e os semânticos verde, âmbar e vermelho) e passe as telas a usá-los. É o que permite testar fundos sem editar dez arquivos.
2. **Fundo:** mostre ao Gabriel duas ou três opções lado a lado em 1366x768, por exemplo o fundo atual, um neutro esverdeado claro no espírito do `--canvas` do Autofluxos e um com a faixa do header em `--canvas-deep`. Paleta aprovada: teal `#127670`, `#0C5862`, `#093D44`, azul `#0E78B5`; verde `#1a8f57`, âmbar `#b97514`/`#e8a33d`, vermelho `#c43d3d`.
3. Painéis com borda de 1 px e pouca sombra, como no Autofluxos, combinam com os cartões brancos de raio 18 a 20 px já aprovados.

## 5. Parte 3: revisão página por página

Ordem: Hoje, Viagens, Viagem, Link da Viagem (390x844), Transportadores, Frota própria, Compartimento, Auditoria, Cadastros, Configurações. Uma tela por etapa, com captura antes e depois em 1366x768 e 1920x1080.

Os critérios de produto da primeira rodada continuam (`HANDOFF.md`, seção 6). Desta vez o foco é boa prática de interface. O que conferir em cada tela:

| Tema | O que olhar | Como está hoje (pontos já percebidos, confirme) |
| --- | --- | --- |
| Elementos clicáveis | Botão é `button`, link é `a`; clicável por teclado (Tab, Enter, espaço) | Quase toda ação é `<span onClick>` ou `<div onClick>`: não recebe foco nem responde ao teclado |
| Foco visível | Anel de foco em tudo que é interativo | Estilos inline tiram o contorno de campos (`outline:none`) e não há foco visível |
| Contraste | Texto pelo menos AA (4,5:1) | Cinzas `#7c8f8d` e `#9db0ae` sobre branco provavelmente não passam; meça |
| Escala tipográfica | Poucos tamanhos com papel claro (título, subtítulo, corpo, legenda, rótulo) | Há muitos tamanhos próximos (10,5; 11; 11,5; 12; 12,5; 13; 13,5; 14; 14,5; 15; 15,5; 16) |
| Espaçamento | Escala fixa (múltiplos de 4) entre blocos e dentro dos cartões | Valores variados em cada tela |
| Hierarquia | Um título, uma ação primária por área, secundárias com peso menor | Revisto nas rodadas anteriores; confirmar depois da moldura nova |
| Estados | Carregando, vazio, erro e sucesso em toda lista e todo envio | Carregando existe (esqueleto); vazio existe na maioria; erro quase não existe |
| Formulários | Rótulo visível ligado ao campo, mensagem de erro junto do campo, botão desabilitado que diz o que falta | O Link da Viagem já faz isso; os modais de escritório não |
| Tabelas | Cabeçalho alinhado às colunas, colunas numéricas à direita, linha inteira clicável quando abre detalhe | São grades de `div`; conferir alinhamento em 1366 px |
| Modais e drawers | Foco preso dentro, Esc fecha, foco volta ao botão que abriu | Esc fecha; foco preso e retorno não existem |
| Alvo de clique | Pelo menos 32 px no escritório e 44 px no celular | Links de texto pequenos ("Atualizar", "Entrar como") |
| Consistência | Mesmo componente para a mesma coisa em todas as telas (botões, chips, seletores, abas, avisos) | Com a moldura nova, extrair componentes compartilhados resolve boa parte |

Cada achado entra numa lista por tela; resolva, teste e registre.

## 6. Pendências que vieram da rodada anterior

1. Em Hoje, "Vencimentos", "Ver todos" leva a Transportadores; o vencimento de fornecedor aparece na lista mas não nesse destino.
2. Sidebar em altura abaixo de 600 px ainda sobra 8 px de rolagem (com a moldura nova, a sidebar deve rolar por dentro sem cortar o rodapé).
3. Premissas abertas no `HANDOFF.md`, seção 7 (convite de usuário, busca local, data no Link).

## 7. Como trabalhar

- Regras do Gabriel: `HANDOFF.md`, seção 9. Resumo: uma etapa por vez, captura antes e depois, bateria, commit em português com coautoria, registro do que mudou; sem travessão e sem ponto médio em texto; nenhum botão sem ação; não adicionar por adicionar; decidir com premissa reversível e registrar; mostrar progresso e entregar por partes.
- Ele é designer de UX e direto: não peça a ele o que é decisão técnica sua, nem acesso a conta. Pergunte só o que é escolha de produto ou de gosto (por exemplo, o fundo), mostrando as opções em captura.
- Push quando a etapa estiver pronta e testada; publicação na Vercel só quando ele pedir.
- Registre cada etapa no fim deste arquivo, seção 8, no mesmo formato de `07-revisao-v2.md` (problema, o que mudou, premissas).

## 8. Registro

(vazio)
