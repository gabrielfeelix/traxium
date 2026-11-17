# 12. Revisão de UX e design visual

Revisão feita em 17/11/2026 no app Next.js da branch `fix/ux-fase-1-3`, servidor em `http://localhost:3000`, com Playwright em 1366x768, 1920x1080 e 390x844 (Link). Foram abertos todos os modais, drawers, menus, abas e filtros alcançáveis, com os oito usuários de "Entrar como", teclado (Tab em cinco telas), estados vazios (busca sem resultado em Viagens, Auditoria, Hoje e busca global) e o fluxo inteiro do Link até a assinatura.

Lente: usabilidade e design visual. Regras de negócio e permissões estão em `11-revisao-mvp.md` e não são repetidas aqui; quando um item toca permissão, ele trata só do que a pessoa vê.

Capturas em `/tmp/claude-1000/revisao-ux/` (o caminho completo vem em cada item). As telas estavam sendo refatoradas durante a revisão: o item da sidebar "Link do motorista" virou "Protótipo mobile" entre duas capturas, por exemplo. Cada item cita o arquivo e o texto visível para ser encontrado mesmo que o estilo mude.

Severidade: **alta** atrapalha o trabalho diário ou leva a erro; **média** custa tempo ou confunde; **baixa** é acabamento.

Heurísticas de Nielsen, usadas pelo número em todo o documento:

| N | Heurística |
| --- | --- |
| H1 | Visibilidade do estado do sistema |
| H2 | Correspondência com o mundo real (linguagem do usuário) |
| H3 | Controle e liberdade (sair, desfazer) |
| H4 | Consistência e padrões |
| H5 | Prevenção de erros |
| H6 | Reconhecer em vez de lembrar |
| H7 | Flexibilidade e eficiência de uso |
| H8 | Estética e design minimalista |
| H9 | Ajudar a reconhecer, diagnosticar e recuperar erros |
| H10 | Ajuda e documentação |

---

## 1. Diagnóstico em um parágrafo

O produto tem a lógica certa e o texto mais cuidadoso que a média, mas a forma não ajuda. Quase toda tela é a mesma coisa: título grande, frase de subtítulo, e uma pilha de cartões brancos de raio 18 com cartões cinza dentro, alguns com faixa escura em degradê no topo (Hoje, Auditoria e Compartimento usam o mesmo herói teal). Sem uma forma própria por tarefa, a pessoa não sabe em que tela está sem ler o título. Dentro das telas, o que é clicável não se distingue do que é informação: a pílula de compartimento da Frota é o único caminho para o histórico e parece um rótulo; os cartões "Trocar o conjunto" do bloqueio técnico parecem aviso; a linha da Frota não abre nada; "Revogar" apaga o acesso de uma transportadora com um clique, sem confirmar e sem desfazer. E a mesma pendência aparece em até quatro lugares da mesma página (Viagem). As dez mudanças abaixo atacam esses três problemas: identidade por tela, afordância e repetição.

---

## 2. As 10 mudanças de maior impacto (em ordem)

### Top 1. Frota própria: a linha vira objeto clicável, com drawer do conjunto (caso de referência de afordância)

**Antes:** `/tmp/claude-1000/revisao-ux/full-frota.png`, `/tmp/claude-1000/revisao-ux/frota-clique-linha.png` (clicar em "Paulo Lima" não faz nada), `/tmp/claude-1000/revisao-ux/frota-1920.png`.

Hoje cada conjunto é um cartão com placas, motorista, "CNH vale até", "2 treinamentos registrados", uma ou duas pílulas largas "SQT 6B77 C1 [A] Farelo [A] Farelo [A] Milho →" e, à direita, "No escopo GMP+ desde 10/01/2026" com "Tirar do escopo" em vermelho. A pílula é o único caminho para o histórico (só um `title` diz isso), a linha não responde, o selo "A" não tem legenda, e a ação destrutiva fica solta na linha. Não há busca nem filtro. Viola H4, H6, H5, H8.

**Proposta (layout, 1366):**

```
Frota própria                                   [Exportar escopo]  [+ Incluir conjunto*]
6 conjuntos  4 no escopo  2 fora                (* se existir o fluxo; senão só Exportar, em contorno)
[Buscar placa ou motorista........]  (No escopo 4) (Fora 2) (Documento a vencer 0)
-----------------------------------------------------------------------------------------
CONJUNTO              TIPO E BASE            MOTORISTA        ÚLTIMA CARGA (C1)   ESCOPO              
[QBD 3E90] SQT 6B77   Graneleira, Rondonóp.  Paulo Lima       Farelo de soja  A   No escopo desde 10/01   [...]
[QCP 8A55] SQT 5F31   Graneleira, Rio Verde  Valdir Nunes     2 compartimentos    No escopo desde 03/02   [...]
           SQT 5F32
[QJD 9F03] SQT 4A66   Basculante, Paranaguá  Sérgio Ramos     Fertilizante    A   Fora: dedicado a calcário [...]
```

- Componente: `Tabela` com linha inteira clicável (`cursor: pointer`, fundo de hover `--fundo-hover`, chevron `›` à direita que aparece no hover). Clique ou Enter abre o **drawer do conjunto** à direita (480 px, sem desfoque no fundo, lista continua visível e rolável).
- Agrupamento: as seções "No escopo GMP+" e "Fora do escopo" viram filtros rápidos (chips com contagem) na barra; a coluna Escopo diz o estado de cada linha. Assim o cabeçalho de seção não repete o que a linha já diz.
- A placa do cavalo é a "cara" do conjunto (chip escuro, mono). Sem avatar de motorista na lista: o motorista é texto simples na coluna dele.
- Coluna "Última carga" mostra só a carga mais recente do compartimento com o selo do regime; o selo ganha tooltip: "Regime A: depois desta carga, limpeza seca basta". Quando há mais de um compartimento: "2 compartimentos", e o detalhe fica no drawer.
- Menu de linha `[...]` (botão de ícone 32 px, `aria-label="Ações de QBD 3E90"`): "Ver histórico de cargas", "Exportar histórico", separador, "Tirar do escopo..." (vermelho). Tirar do escopo abre o diálogo de motivo que já existe (`frota-tirar.png`), com o botão vermelho "Tirar do escopo" e, depois, toast com "Desfazer" por 8 s.
- "2 treinamentos registrados, último 18/06" sai da linha (é igual em todas) e só aparece como alerta quando falta treinamento: chip laranja "sem treinamento" na coluna Motorista.
- O parágrafo de rodapé ("Só os conjuntos no escopo GMP+ podem fazer viagem assegurada...") sai; a regra vira o texto do tooltip do chip "No escopo".

**Drawer do conjunto:**

```
[QBD 3E90] [SQT 6B77]                              No escopo GMP+ desde 10/01/2026   [x]
Graneleira, base Rondonópolis
[Ver histórico do C1]  [Exportar histórico]                            [...] Tirar do escopo
--------------------------------------------------------------
Compartimentos
  SQT 6B77 C1   Pode carregar ração: sim, limpeza seca     T-1 Farelo 05/10  T-2 Farelo 10/09  T-3 Milho 28/08   [Abrir histórico ›]
Motorista
  Paulo Lima   CNH vale até 04/04/2028   Treinamentos: 2 (último 18/06/2026)
Documentos do conjunto
  CRLV QBD 3E90   vale até ...      CRLV SQT 6B77  vale até ...
Últimas viagens
  08/10 OC 48118 Farelo de soja  Pronta     05/10 OC 48061 ...
```

O botão "Abrir histórico" é rotulado e leva a `/compartimento?placa=...&pos=...`. Navegação com setas ↑ ↓ (ou J/K) troca o conjunto do drawer sem fechar.

**Arquivos:** `src/telas/Frota.jsx`; drawer e menu de linha como componentes em `src/components/ui/` (ver Top 10).

---

### Top 2. Identidade por tela: um padrão de página por tarefa, menos cartões dentro de cartões

**Antes:** compare `/tmp/claude-1000/revisao-ux/full-hoje.png`, `/tmp/claude-1000/revisao-ux/full-auditoria.png`, `/tmp/claude-1000/revisao-ux/compartimento-ok.png` (mesmo herói teal escuro), e `/tmp/claude-1000/revisao-ux/full-cadastros_aba_filiais.png`, `/tmp/claude-1000/revisao-ux/full-cadastros_aba_fornecedores.png`, `/tmp/claude-1000/revisao-ux/full-frota.png` (mesma grade de cartões brancos).

Proposta concreta na seção 3 (arquétipo, esboço e tabela de Nielsen por tela). As regras gerais que o implementador aplica em todas:

1. **Um arquétipo por tela, e só um.** Mesa de ações (Hoje), tabela de dados (Viagens), detalhe com linha do tempo (Viagem), diretório com drawer (Transportadores, Frota, Fornecedores), área de pesquisa e relatório (Auditoria), ficha de leitura (Compartimento), referência (Produtos), configurações em abas (Configurações).
2. **Cabeçalho de página com três formas, não uma.** (a) Mesa: saudação curta + data + filtro de filial + ação primária. (b) Lista: título + contagem em texto secundário + busca + filtros rápidos + ação primária, tudo numa faixa só, sem frase de subtítulo. (c) Detalhe: breadcrumb + objeto (placa, OC) em mono grande + estado em badge + ação primária, e esse cabeçalho fica fixo ao rolar.
3. **Herói escuro em degradê só numa tela:** Hoje do gestor (painel). Auditoria troca o herói por uma barra de pesquisa clara (fundo `--painel`, borda); Compartimento troca por uma faixa clara com o veredito colorido ("Pode carregar ração: Sim").
4. **Região comum sem caixa dentro de caixa (Gestalt).** Dentro de um cartão, separar por espaço e linha divisória de 1 px, nunca por outro cartão cinza com raio. Casos a achatar: Filiais (cartão > caixas cinza > caixa de borda), Fornecedores (cartão > linhas cinza de documento), Viagem "Três últimas cargas" (cartão > caixa > três ladrilhos), Configurações "Alçadas" e "LGPD".
5. **Proximidade:** ação junto do que ela afeta. Ex.: "Enviar link" uma vez, junto do bloco do motorista; "Atualizar" no documento, dentro do drawer.
6. **Semelhança:** o mesmo estado tem a mesma forma em todas as telas: componente `Situacao` (bolinha + rótulo) para estado; `Badge` para categoria; chip escuro mono para placa; texto teal sublinhado no hover para link. Hoje "Falta algo" é pílula com borda em Viagem e texto com bolinha em Viagens.
7. **Figura e fundo:** fundo da página `--fundo`, conteúdo em uma folha branca por região de trabalho (não uma por bloco de informação). Em listas, a tabela é a folha; em detalhe, duas colunas de seções sem borda individual, separadas por títulos H2 e 24 px.

**Arquivos:** `src/components/ui/` (novo `CabecalhoPagina` em três variantes), todas as telas em `src/telas/`.

---

### Top 3. Coleções: lista densa com drawer como padrão, cartões só onde a coleção é pequena e fixa

Pedido do usuário com o exemplo de Fornecedores. **Antes:** `/tmp/claude-1000/revisao-ux/full-cadastros_aba_fornecedores.png`.

**Decisão: lista (tabela) para toda coleção que pode passar de 20 itens. Sem alternador lista/cartões.** Motivo: o trabalho nessas telas é varrer e achar o que está vencendo; a tabela alinha os mesmos campos em coluna, o que deixa o olho comparar de cima a baixo (vencimento, situação) sem reler o nome de cada campo. O cartão repete rótulos, ocupa 4 a 6 vezes mais altura (4 fornecedores ocupam a dobra inteira em 1366x768) e não ordena. Um alternador dobra os estados a manter e testar, e o que o cartão mostraria a mais (todos os documentos) cabe no drawer. Cartões ficam só para Filiais (conjunto pequeno, quase fixo, até ~20) e versões do Manual (poucas, com texto).

**Avatar, iniciais ou logo?** A âncora visual de cada linha é aquilo pelo que a pessoa procura: placa para veículo, nome para pessoa, nome e CNPJ para empresa. Regras:
- Pessoa (TAC, motorista, usuário): iniciais em círculo de 28 px, **cor neutra** (`--primario-fraco` com texto `--primario-3`), igual para todos. As cores aleatórias de hoje (vermelho, laranja, roxo) parecem estado e competem com as cores de situação.
- Empresa (ETC, fornecedor): sem avatar. Um ícone pequeno de tipo (gota para lavagem, lona para lonas, chave para manutenção) em 16 px, cinza, antes do nome. Logo não: não há fonte de logos, e logos de terceiros de qualidade variável deixam a lista com cara de rede social.
- Veículo: o chip de placa já é a identidade; nada de avatar do motorista na lista.

**Fornecedores, design concreto:**

```
Fornecedores   4                         [Buscar nome, CNPJ ou cidade...]   [+ Cadastrar fornecedor]
(Todos 4) (Documento a vencer 2) (Vencido 0) (Lavagem 3) (Lonas 1)
------------------------------------------------------------------------------------------------
FORNECEDOR                      SERVIÇO            CIDADE            DOCUMENTOS          PRÓXIMO VENCIMENTO
(gota) Estação de Lavagem BR-163     [Lavagem até D]    Rondonópolis MT   ● 1 a vencer de 3   Laudo de potabilidade  em 25 dias  [Atualizar]
   21.884.017/0001-63
(gota) Lava Cargas Rio Verde         [Lavagem até B]    Rio Verde GO      ● 1 a vencer de 2   Licença ambiental      em 17 dias  [Atualizar]
(gota) Lavador Posto Trevo           [Lavagem até C]    Sorriso MT        ● 2 em dia          Laudo de potabilidade  10/12/2026
   Lonas Ribeiro                 [Lonas]            Sorriso MT        ● 1 em dia          Alvará                 28/02/2027
```
("(gota)" representa o ícone de tipo em SVG, 16 px, cinza)

- Ordem padrão: por próximo vencimento, o mais urgente em cima. Cabeçalhos ordenáveis (`aria-sort`).
- "Credenciado para limpeza até regime C (água e detergente)" vira o chip compacto `[Lavagem até C]` com tooltip "Regime C: água e detergente. Pode fazer limpezas de regime A, B e C." "Não faz limpeza" vira simplesmente o chip `[Lonas]`.
- Coluna Documentos: bolinha da pior situação + contagem ("1 a vencer de 3", "1 vencido de 2", "2 em dia").
- Próximo vencimento: nome do documento + prazo relativo quando menor que 60 dias ("em 25 dias", laranja; "vencido há 3 dias", vermelho) ou data absoluta quando longe. "Atualizar" é botão pequeno de contorno (32 px), só aparece quando há documento a vencer ou vencido; nas outras linhas fica no menu `[...]`.
- Clique na linha: drawer com cabeçalho (nome, CNPJ, cidade, chip de serviço), lista completa de documentos (vencidos primeiro), "Viagens que usaram este fornecedor" (últimas 10) e ações "Atualizar documento", "Editar dados", "Descredenciar..." (com confirmação).
- Densidade: linha de 52 px com duas linhas de texto (nome e CNPJ), 44 px quando uma linha.

**Escala de 50 a 500 itens, para todas as coleções:** busca com filtro instantâneo (debounce 150 ms); filtros rápidos em chips com contagem; ordenação por coluna; paginação de 50 por página com "mostrando 1 a 50 de 312"; cabeçalho da tabela fixo ao rolar; seleção por checkbox com barra de ações em massa que aparece embaixo ("3 selecionados: Exportar  Convidar  Limpar seleção"); URL guarda busca, filtro, ordem e página (deep link).

Recomendação por coleção (detalhe na seção 4): Transportadores lista (já é); Frota lista (Top 1); Fornecedores lista; Produtos lista (já é); Treinamentos lista; Filiais cartões achatados até 20, tabela acima disso; Usuários lista; Auditoria tabela de largura total; Viagens tabela (já é).

**Arquivos:** `src/telas/Cadastros.jsx` (Fornecedores, Treinamentos, Filiais), `src/telas/Transportadores.jsx`, `src/telas/Frota.jsx`, `src/telas/Configuracoes.jsx` (Usuários); componentes `Tabela`, `BarraSelecao`, `Drawer` em `src/components/ui/`.

---

### Top 4. Viagem: uma ação por pendência, cabeçalho fixo, e a mesma pendência em um só lugar

**Antes:** `/tmp/claude-1000/revisao-ux/full-viagem_id_VG-3122.png`, `/tmp/claude-1000/revisao-ux/viagem-enviar-link.png`.

Problemas: o bloco "Faltam 4 itens para assegurar" tem quatro botões "Enviar link" iguais, que mandam o mesmo link; o cartão "Link do motorista" tem um quinto "Enviar link". A mesma pendência aparece no aviso, em "Checagens 5 de 9", em "Registro para auditoria" (pendente x4) e no checklist do "Link do motorista". O passo a passo (Viagem criada > ... > CT-e conciliado) fica abaixo do aviso. A página tem 2084 px em 1366 e, ao rolar, título, estado e ação somem. Viola H8, H4, H1.

**Proposta:**

```
Viagens › OC 48130                                                [Exportar registro] [Ações ▾]
Farelo de soja, 37 t   ● Falta algo    hoje 17:00   Agro Sorriso Armazéns, Sorriso MT → NutriMax, Uberlândia MG
ORDEM OC 48130   CT-e a conciliar   NF a conciliar   FILIAL Sorriso   PLACAS [RCB 9M15] [RCB 9M16]
(1 Viagem criada ✓)──(2 Link enviado)──(3 Motorista preencheu)──(4 Conferência)──(5 Pronta)──(6 CT-e conciliado)
----------------------------------------------------------------------------------------------
┃ Faltam 4 itens, todos com o motorista pelo link                                   [Enviar link ao motorista]
┃   ○ Três últimas cargas por compartimento      ○ Verificação do compartimento
┃   ○ Termo de compromisso assinado              ○ Ciência do manual vigente
```

- **Cabeçalho fixo** (sticky) com breadcrumb, título, badge de estado e a ação primária do momento; ao rolar mais de 120 px, ele encolhe para uma barra de 56 px: "OC 48130  Farelo de soja  ● Falta algo  [Enviar link ao motorista]".
- O passo a passo sobe para dentro do cabeçalho, logo abaixo das placas, em 40 px de altura.
- **Agrupar pendências por quem resolve.** Quando todos os itens são "Motorista pelo link", um único botão "Enviar link ao motorista" no título do bloco; os itens viram lista de duas colunas com bolinha vazia. Quando há responsáveis diferentes, um subgrupo por responsável, cada um com uma ação ("Motorista: Enviar link"; "Afretador: Conferir fotos"; "Qualidade: Pedir liberação").
- "Checagens 5 de 9 / Ver as 9" deixa de ser um cartão: vira o link "Ver as 9 checagens" no canto do bloco de pendências.
- "Registro para auditoria" mostra só o que é próprio dele (o que o auditor anota) e passa a usar o mesmo componente `Situacao`. Itens que já estão no bloco de pendências aparecem como "ver pendência acima" em texto secundário, não como um segundo "pendente" laranja.
- O cartão "Link do motorista" perde o botão primário "Enviar link" quando o bloco de pendências já tem esse botão; fica "Copiar mensagem" e "Abrir como motorista" em contorno.
- Modal "Enviar link ao motorista" (`viagem-enviar-link.png`): botão primário "Abrir no WhatsApp" (abre `https://wa.me/55<telefone>?text=<mensagem>`), secundário "Copiar mensagem", terciário "Abrir como motorista". Copy do subtítulo: "A mensagem vai do seu WhatsApp, que o motorista já conhece."

**Arquivos:** `src/telas/Viagem.jsx`.

---

### Top 5. Ações destrutivas: confirmar, dar desfazer, e tirar da linha

**Antes:** `/tmp/claude-1000/revisao-ux/transp-revogar.png`: um clique em "Revogar" na linha de Cerrado Cargas revogou o acesso na hora; só um toast "Acesso de Cerrado Cargas Ltda revogado. O histórico continua.", sem "Desfazer". Em `full-frota.png`, "Tirar do escopo" em vermelho a 80 px de um link de navegação. Não existe "Desfazer" em nenhum arquivo de `src/telas` nem da moldura. Viola H3 e H5.

**Proposta:**

- Regra única, escrita no design system: ação destrutiva nunca é texto solto na linha. Fica no menu `[...]` da linha ou no drawer, separada por divisor, em vermelho, com reticências no rótulo ("Revogar acesso...", "Tirar do escopo...", "Cancelar viagem...", "Descredenciar...").
- Duas intensidades: (a) **reversível e de baixo custo** (revogar convite, tirar do escopo): executa na hora e mostra toast com botão "Desfazer" por 8 s; (b) **irreversível ou com efeito em terceiros** (cancelar viagem, liberar por autoridade, voltar à semente): diálogo de confirmação com o efeito escrito no corpo ("O link do motorista para de funcionar. As viagens já feitas continuam no histórico.") e botão vermelho com o verbo ("Revogar acesso"), nunca "OK".
- Toast da moldura ganha um slot de ação: `TX.ui.avisar(texto, { acao: 'Desfazer', onAcao })`, botão de texto teal claro dentro do toast, foco alcançável por Tab, fecha com Esc.
- Casos a aplicar: Transportadores "Revogar" e "Convidar de novo"; Frota "Tirar do escopo" e "Incluir no escopo"; Viagem "Cancelar viagem" (já no menu, conferir confirmação); Configurações "Só alerta" (mudar regra), "Voltar à semente" (já confirma).

**Arquivos:** `src/components/moldura/moldura.tsx` (toast com ação), `src/telas/Transportadores.jsx`, `src/telas/Frota.jsx`, `src/telas/Configuracoes.jsx`; componente `MenuLinha` e `Confirmar` em `src/components/ui/`.

---

### Top 6. Hoje do gestor: entender em 5 segundos o que precisa de mim

**Antes:** `/tmp/claude-1000/revisao-ux/full-hoje.png`, `/tmp/claude-1000/revisao-ux/hoje-como-u-luiz.png`, `/tmp/claude-1000/revisao-ux/hoje-filtro-vazio.png`.

O primeiro bloco é um herói de indicadores (77%, 13, 17, 8) com rótulo em duas linhas e nota de rodapé com fórmula. O que pede ação da pessoa ("Esperando sua assinatura") vem depois. As filiais são quatro cartões com o número GMP+ quebrando linha e "Gatekeeper comunicado ao OC em 12/01" (OC aqui é organismo certificador; em todo o resto do app, OC é ordem de carregamento). "Filtrar esta mesa" com "zzzz" não muda nada na visão do gestor, sem aviso. Teste dos 5 segundos: um novo usuário lê "77%" primeiro e não sabe o que fazer. Viola H1, H2, H8.

**Proposta (1366):**

```
Bom dia, Rafael   quinta, 08/10/2026                         [Todas as filiais ▾]  [Nova viagem]
-------------------------------------------------------------------------------------------
PRECISA DE VOCÊ (2)
 16:00 em 6 h  OC 48126 Genivaldo Souza, Sorriso   CRLV vencido em 01/10/2026     [Analisar e assinar]
 18:00 em 8 h  OC 48131 Ivan Prado, Sorriso        espera Direção e RT            Ver viagem ›
-------------------------------------------------------------------------------------------
[Prontidão 77% ▮▮▮▮▮▮▯▯ 10 de 13]  [Viagens hoje 13, 10 com pendência]  [Gatekeeper 17 em 45 dias]  [Documentos a vencer 8]
-------------------------------------------------------------------------------------------
FILIAIS HOJE                                            | VENCIMENTOS (8)           Ver todos
Filial          Hoje  Pendência  Gatekeeper     Afretador |  ● CRLV QHG 7L34  vencido
Rondonópolis      2      1       comunicado    Paula      |  ● CNH Ivo Barcellos vencido
Sorriso           7      6       comunicado    Diego      |  ...
Paranaguá         1      1       ● não comunicado  Marcos |
PENDÊNCIAS DE REGISTRO (3)            Conciliar CT-e em lote
```

- **Primeira dobra = o que precisa da pessoa.** O bloco "Precisa de você" sobe para o topo; quando vazio, uma linha verde: "Nada esperando sua assinatura. Próximo carregamento bloqueado: 18:00, com Direção e RT."
- Indicadores viram uma faixa de quatro números em 72 px de altura, fundo claro (sem herói escuro; ver Top 2), cada um clicável e levando à lista filtrada (77% leva a Viagens com "incompletas"; 8 leva a Vencimentos). Rótulo numa linha: "Prontidão para auditoria"; a fórmula vai para um tooltip no ícone (i): "Viagem completa: T-3, verificação aprovada, termo (quando gatekeeper) e CT-e conciliado. Últimos 45 dias."
- Filiais: tabela compacta de 4 a 20 linhas; linha inteira é link `<a href="/hoje?filial=SOR">`. Coluna Gatekeeper: "comunicado" (verde, data no tooltip) ou "não comunicado" (vermelho, com botão "Registrar comunicação").
- Copy: trocar "comunicado ao OC" por "comunicado à certificadora" em todo o app; OC fica só para ordem de carregamento.
- O filtro "Filtrar esta mesa" filtra de fato as listas do gestor (Precisa de você, Pendências, Vencimentos) e, sem resultado, mostra "Nada com "zzzz" nesta mesa. [Limpar]". Se não for filtrar, sai da visão do gestor.

**Arquivos:** `src/telas/Hoje.jsx`.

---

### Top 7. Auditoria: tabela de largura total, amostra como barra fixa, checkbox de verdade

**Antes:** `/tmp/claude-1000/revisao-ux/full-auditoria.png`, `/tmp/claude-1000/revisao-ux/auditoria-amostra.png`, `/tmp/claude-1000/revisao-ux/teclado-auditoria.png`.

A tabela divide a largura com a coluna "Amostra / Listas de apoio / Simulações" e fica espremida: "Agro Sorriso ...", "Farelo d...", cabeçalho "EMBARCADOR E DESTINATÁRIO" em três linhas. O checkbox da amostra é `span role="button"` sem nome (o leitor de tela lê "botão"), e só a data é link para a viagem. "Pôr todas na amostra" aparece com 0 resultados. O placeholder da busca no herói escuro é cortado ("Ex.: QWM") e o foco desenha borda dupla. Viola H4, H6, H7, H8.

**Proposta:**

```
Auditoria                                                    [Iniciar simulação de rastreabilidade]
[Placa, CT-e, NF ou ordem.................]  [01/09/2026 a 08/10/2026 ▾]  (Todas)(Afretamento)(Frota própria)
26 viagens asseguradas no período                                  [Listas de apoio ▾]
--------------------------------------------------------------------------------------------------
[ ] DATA        CT-e / NF          EMBARCADOR → DESTINATÁRIO                 PRODUTO          PLACAS            TERMO   VERIFICAÇÃO
[ ] 08/10/2026  pendente           Agro Sorriso Armazéns → NutriMax Rações   Farelo de soja   RBK 2F41 QWM 4H57  08/10   08/10
...
==================================================================================================
(barra fixa no rodapé, aparece com 1 ou mais marcadas)
 3 viagens na amostra    [Ver amostra]   [Exportar amostra em documento único]   Limpar
```

- Busca em barra clara (sem herói), com placeholder curto "Placa, CT-e, NF ou ordem" e exemplo como texto de ajuda abaixo só quando vazio.
- Período com atalhos: "Últimos 30 dias", "Últimos 90 dias", "Desde a última auditoria (14/07/2026)", "Personalizado".
- Tabela com toda a largura; colunas com largura mínima para não truncar nome de embarcador em 1366 (texto em duas linhas quando necessário, nunca reticências no campo que o auditor anota).
- Checkbox nativo `<input type="checkbox">` (ou componente `Checkbox` do DS) com `aria-label="Pôr OC 48134 na amostra"`; checkbox no cabeçalho com estado misto para "todas".
- Linha inteira abre a viagem num drawer de leitura (o auditor está ao lado; trocar de página perde a lista); botão "Abrir viagem completa" no drawer.
- "Listas de apoio" (ocorrências, frota no escopo, treinamentos, protocolos gatekeeper) num menu de exportação no cabeçalho; "Simulações de rastreabilidade" vira uma linha de histórico abaixo da barra de busca: "Última simulação: 14/07/2026, QBD 3E90, 1h13 de 4h".

**Arquivos:** `src/telas/Auditoria.jsx`.

---

### Top 8. Liberar por autoridade: painel lateral de decisão, não modal comprido

**Antes:** `/tmp/claude-1000/revisao-ux/hoje-analisar.png`.

"Analisar e assinar" abre um modal de 9 campos sobre a viagem desfocada. Em 768 px de altura, a metade dos campos fica abaixo da dobra e a pessoa decide sem ver o documento vencido, o histórico e o TAC. Viola H6 (lembrar o que estava na viagem) e H1.

**Proposta:**
- Drawer de decisão à direita, 520 px, fundo da viagem visível e rolável (sem desfoque), cabeçalho fixo "Liberar por autoridade  OC 48126  [x]", rodapé fixo com "Falta: motivo, justificativa..." e os botões "Cancelar" e "Assinar liberação".
- Corpo em três grupos com títulos: "O que está bloqueado" (regra, documento, data; link "ver documento"), "Sua decisão" (motivo, justificativa, risco residual, validade), "Evidência e ciência" (anexo, escopo, ciência). A barra "2 de 9" vira contagem no rodapé.
- Ao assinar: o drawer fecha, a viagem atualiza o badge para "Liberada por autoridade" com animação de 200 ms no badge, toast "Liberação assinada. A viagem pode carregar." com "Ver registro".

**Arquivos:** `src/telas/Viagem.jsx` (`modalVals` do liberar), componente `Drawer` em `src/components/ui/`.

---

### Top 9. Jargão com explicação no lugar: componente Termo e legenda de regime

**Antes:** `full-frota.png` (selos "A" sem legenda), `compartimento-ok.png` (coluna Regime "A"), `full-cadastros_aba_produtos.png` (coluna "Depois dele"), `full-hoje.png` ("Protocolos gatekeeper", "comunicado ao OC"), `full-viagem_id_VG-3122.png` ("T-1", "regime exigido ?").

Quem chega novo não sabe o que é T-3, IDTF, regime A a D, gatekeeper, TAC, ETC, "Bloqueio técnico" ou "Liberadas por autoridade". Hoje a explicação está espalhada em frases de subtítulo que todo mundo lê todo dia. Viola H2, H10, H8.

**Proposta:**
- Componente `Termo` (texto com sublinhado pontilhado 1 px `--texto-apagado`, `cursor: help`, tooltip ao passar o ponteiro e ao focar com Tab, 280 px de largura máxima). Primeira ocorrência de cada termo por tela usa `Termo`; as outras ficam texto normal.
- Glossário único em `src/lib/tx/glossario.js`, com textos curtos:
  - T-3: "As três últimas cargas do compartimento, da mais recente (T-1) para a mais antiga (T-3)."
  - IDTF: "Base internacional que classifica cada carga e diz a limpeza exigida antes de carregar ração."
  - Regime A: "Limpeza seca." B: "Água." C: "Água e detergente." D: "Desinfecção." Proibida: "Nenhuma limpeza resolve."
  - Gatekeeper: "Transportador sem certificado GMP+ que a empresa qualifica viagem a viagem."
  - TAC: "Transportador autônomo de cargas (pessoa)." ETC: "Empresa de transporte de cargas."
  - Bloqueio técnico: "Bloqueio que ninguém pode liberar; só resolve trocando o conjunto ou regularizando."
- Selo de regime: "A" sozinho vira selo + palavra quando houver espaço ("A seco"), como já é em Produtos; nos lugares apertados (Frota, Compartimento) o selo tem tooltip com o texto do glossário.
- Produtos: cabeçalho "Depois dele" vira "Limpeza antes de ração".
- Subtítulos que só explicam conceito saem (lista na seção 5).

**Arquivos:** novo `src/components/ui/termo.tsx`, `src/lib/tx/glossario.js`; uso em `Hoje.jsx`, `Viagem.jsx`, `Frota.jsx`, `Compartimento.jsx`, `Cadastros.jsx`, `Viagens.jsx`.

---

### Top 10. Afordância em todo lugar: o que clica parece clicável, o que não clica não parece

**Antes:** `frota-hover-pill.png`, `viagem-bloqueio-tecnico.png`, `full-viagem_id_VG-3122.png`, `full-hoje.png`, `cfg-so-alerta.png`, `teclado-hoje.png`.

Casos encontrados (texto visível e arquivo):

| Onde | Elemento | Problema | Correção |
| --- | --- | --- | --- |
| Frota.jsx | pílula "SQT 6B77 C1 [A] Farelo ... →" | Único caminho para o histórico, parece rótulo | Top 1 |
| Frota.jsx | linha do conjunto | Parece clicável (cartão com hover de sombra), não faz nada | Top 1 |
| Viagem.jsx | cartões "Trocar o conjunto" e "Regularizar conforme a TS1.9" no herói vermelho | São botões (`role="button"`), parecem avisos | Botões de verdade: "Trocar o conjunto ›" branco sólido (primário sobre fundo escuro) e "Regularizar..." contorno branco; descrição abaixo do botão em texto secundário |
| Viagem.jsx | badge "Carrega hoje" com borda, ao lado de "Falta algo" | Parece botão, é informação | Texto secundário sem borda: "carrega hoje, 17:00" |
| Viagem.jsx | chips "CT-e a conciliar", "NF a conciliar" em laranja | Parecem ação, não são | Se houver ação, virar link "Conciliar"; se não, texto apagado "não conciliado" |
| Hoje.jsx | "Abrir a mesa da filial →" | `span role="button"`: não abre em nova aba, não é link | `<a href="/hoje?filial=...">` |
| Hoje.jsx | linhas de "Pendências de registro" | São links, sem chevron nem sublinhado | Chevron `›` à direita no hover, fundo de hover |
| Transportadores.jsx | "Convidar", "Revogar", "Reenviar" ao lado do chip de convite | Texto teal de 13 px colado ao chip: lê como parte do rótulo | Menu `[...]` (Top 5); chip de convite fica só informativo |
| Transportadores.jsx | drawer: "Clique na carreta para ver o histórico de cargas" | Instrução existe porque o chip de placa não parece clicável | Botão "Histórico de cargas ›" ao lado de cada placa; tirar a instrução |
| Auditoria.jsx | checkbox de amostra | `span` sem nome | Top 7 |
| Auditoria.jsx | data "08/10/2026" é o único link da linha | Ninguém procura o link na data | Linha inteira abre (Top 7) |
| Configuracoes.jsx | "Só alerta" apagado nas regras de norma | Parece desabilitado, mas clica e mostra toast | Ícone de cadeado + texto "Bloqueia sempre (norma)", sem botão |
| Configuracoes.jsx | "Bloqueia" / "Só alerta" lado a lado | Não fica claro qual está valendo | `SegmentedControl` com o selecionado em fundo branco elevado e o outro em texto; rótulo de grupo "Quando falhar" |
| Cadastros.jsx | "Ver os cartões", "Publicar nova versão", "Registrar treinamento" | Ações de texto de 13 px no canto de cartão | Botão pequeno de contorno (32 px) |
| LinkDaViagem.jsx | "com sinal" no cabeçalho | Parece estado, é um botão de demonstração | Mover para o painel de demonstração; no app real, só indicador sem borda |

Regras para o design system: (1) ação em texto sempre teal `--primario-2`, peso 700, sublinhado no hover e foco, alvo de 32 px; (2) cartão inteiro clicável só quando tem uma ação só, e então mostra chevron e eleva no hover; (3) informação nunca usa pílula com borda (reservada a chips de filtro e opções); (4) `cursor: pointer` só em quem tem ação.

**Arquivos:** os citados na tabela; regra escrita em `src/app/design-system`.

---

## 3. Identidade e diferenciação das telas

Cada tela abaixo tem: arquétipo, objeto principal, esboço de layout e tabela de Nielsen (só heurísticas com violação; as demais sem violação relevante).

### 3.1 Hoje (`Hoje.jsx`): mesa de ações

Objeto principal: a fila do dia, ordenada por horário de carregamento. Gestor vê "Precisa de você" + painel; afretador vê a fila por estado (já existe e é a melhor tela do app: `hoje-como-u-diego.png`).

```
AFRETADOR (1366)
Hoje em Sorriso   quinta, 08/10                        [Filtrar mesa]  [Nova viagem]
7 viagens  ▮▮▮▮▮▮▮▮▮▮▮▮▮▮ 3 falta algo  3 bloqueadas  1 pronta      1 motorista no link agora
FALTA ALGO (3)
 12:00 em 76 min | RT Rosana Teles TAC | Farelo → Rações Vitale | OC 48119 RRT 5E06 | ▮▮▮▯▮ 4 de 5 no link | Verificação do compartimento: conferir fotos   [Conferir fotos]
BLOQUEADAS (3)
 15:30 | AK Ademir Kunz | ... | Bloqueio técnico: RAD 3K20 C1 levou cama de frango (proibida)                               [Trocar conjunto]
```

| H | Violação | Correção |
| --- | --- | --- |
| H1 | Gestor: "Filtrar esta mesa" não filtra e não avisa (`hoje-filtro-vazio.png`) | Filtrar as listas ou tirar o campo (Top 6) |
| H2 | "comunicado ao OC": OC é ordem de carregamento no resto do app | "comunicado à certificadora" |
| H6 | Barra de 5 segmentos sem legenda na fila do afretador | Rótulo "4 de 5 no link" e tooltip por segmento (Abriu, Dados, Cargas, Checklist, Termo) |
| H7 | Bloqueio técnico sem ação na fila ("Ninguém aprova") | Botão "Trocar conjunto" |
| H8 | Herói de indicadores antes do que pede ação | Top 6 |
| H8 | Motivo do bloqueio cortado com reticências, que é a informação mais importante da linha | Duas linhas para o motivo; ação abaixo do motivo em 1366 |

### 3.2 Viagens (`Viagens.jsx`): tabela de dados

Objeto: a viagem como linha. Sem cartões além da folha da tabela.

```
Viagens  29                          [Buscar placa, CT-e, NF, ordem...]  [Exportar 29]
(Todas)(Limpeza exigida 1)(Aguardando CT-e 3)(Liberadas por autoridade)(Com ocorrência)   Período 30 dias ▾  Filial ▾  Tipo ▾  Situação ▾
[ ] CARREGAMENTO ↓  ORDEM     PRODUTO E ROTA                 TRANSPORTADOR        PLACAS             SITUAÇÃO
[ ] 09/10 09:00     OC 48134  Farelo de soja                 Luciano Farias       QLF 8N02 QLF 8N03  ● Falta algo
    Rio Verde                 Granos Rio Verde → Granja...   TAC                                     Três últimas cargas
```

| H | Violação | Correção |
| --- | --- | --- |
| H4 | Três mecanismos de filtro (abas, "Situação", "Filtros" com Tipo e Filial) | Abas viram visões salvas; Período, Filial, Tipo, Situação como botões de filtro na mesma barra, cada um com o valor escolhido visível |
| H6 | Motivo da situação cortado ("Três últimas cargas por comparti...") | Duas linhas, ou rótulos curtos ("T-3", "Verificação", "Limpeza") com tooltip |
| H7 | Sem ordenação por coluna; sem seleção em massa | Ordenar por Carregamento, Ordem, Transportador, Situação; checkbox + barra "Exportar selecionadas" |
| H8 | Dois códigos por linha (OC 48134 e VG-3130) | Mostrar só a OC; código VG no drawer e na busca |

### 3.3 Viagem (`Viagem.jsx`): detalhe com linha do tempo

Objeto: a viagem, identificada pela OC. Esboço no Top 4. Coluna esquerda: pendências, cargas, verificação, linha do tempo. Coluna direita (320 px): transportador, conjunto, link do motorista, registro para auditoria, ocorrências, sem borda individual; separadas por título e divisor.

| H | Violação | Correção |
| --- | --- | --- |
| H1 | Ao rolar, estado e ação somem | Cabeçalho fixo (Top 4) |
| H4 | Cinco botões "Enviar link" para o mesmo link | Um só (Top 4) |
| H6 | Liberação decidida num modal que esconde a viagem | Drawer de decisão (Top 8) |
| H8 | Mesma pendência em quatro blocos | Top 4 |
| H8 | Frases de filosofia nos títulos ("derivadas dos fatos; ninguém digita estado", "nada se apaga...") | Tirar (seção 5) |

### 3.4 Transportadores (`Transportadores.jsx`): diretório com drawer

Objeto: o transportador (pessoa ou empresa). Já é lista; ajustes na seção 4 e por arquivo.

```
Transportadores  14                 [Buscar nome, CPF, CNPJ, placa, RNTRC]   [Importar planilha] [+ Cadastrar]
(Todos 14)(Documento a resolver 4)(Em revisão 1)(Convite pendente 2)(Em dia 7)        TAC | ETC
[ ] TRANSPORTADOR ↑                 CONJUNTOS             DOCUMENTOS            VIAGENS      OCORRÊNCIAS   CONVITE
[ ] (GS) Genivaldo Souza  TAC       QHG 7L33 QHG 7L34     ● CRLV vencido 01/10  1, últ. 08/10  nenhuma      expirado   [...]
```

| H | Violação | Correção |
| --- | --- | --- |
| H3 | "Revogar" sem confirmação nem desfazer | Top 5 |
| H4 | "Apto" para ETC e "Documentos em dia" para TAC, mesmo estado | Um rótulo: "Em dia" |
| H6 | Drawer desfoca a lista; para comparar, fecha e abre | Drawer sem desfoque, navegação ↑ ↓ |
| H8 | Avatares com cores fortes diferentes por pessoa | Cor neutra única (Top 3) |
| H5 | Placas digitadas como texto livre "ABC1D23, ABC1D24" no cadastro | Campo de chips por placa com validação de formato Mercosul |

### 3.5 Frota própria (`Frota.jsx`): lista de ativos

Esboço e correções no Top 1.

| H | Violação | Correção |
| --- | --- | --- |
| H4 | Linha não clica; pílula clica | Linha abre drawer |
| H5 | "Tirar do escopo" em vermelho na linha | Menu da linha + desfazer |
| H6 | Selo "A" sem legenda | Tooltip do glossário |
| H7 | Sem busca e sem filtro | Busca por placa e motorista; filtros rápidos |
| H8 | "No escopo GMP+" no título da seção e em cada linha; treinamento igual em todas as linhas | Top 1 |

### 3.6 Compartimento (`Compartimento.jsx`): ficha de leitura

Objeto: o compartimento (placa da carreta + posição).

```
Frota própria › QBD 3E90 › SQT 6B77 C1                                     [Exportar histórico]
SQT 6B77 C1        Graneleira, CRLV vale até 31/03/2027       Dono hoje: Frota própria (cavalo QBD 3E90)
┌ Pode carregar ração?  ● Sim, com limpeza seca (regime A, pela última carga: farelo de soja) ┐   (faixa clara, borda verde)
HISTÓRICO DE CARGAS
T-1  05/10/2026  Farelo de soja   A seco   viagem OC 48061   seca, no checklist
...
```

| H | Violação | Correção |
| --- | --- | --- |
| H9 | Placa inexistente na URL (`?placa=QHG7L34&pos=1`) mostra outro compartimento (SQT 6B77 C1) sem aviso: `full-compartimento_placa_QHG7L34_pos_1.png` | Estado "Compartimento não encontrado: QHG7L34 posição 1" com busca de placa e link para Frota |
| H1 | Na mesma URL inválida, a sidebar acende "Transportadores" e o breadcrumb diz "Frota própria" | Item aceso e breadcrumb derivados do mesmo dono |
| H8 | T-1, T-2, T-3 no herói repetem as três primeiras linhas da tabela | Tirar do herói; marcar as três linhas com faixa lateral |
| H4 | Herói escuro igual ao de Hoje e Auditoria | Faixa clara com veredito colorido |

### 3.7 Auditoria (`Auditoria.jsx`): área de pesquisa e relatório

Esboço no Top 7.

| H | Violação | Correção |
| --- | --- | --- |
| H4 | Checkbox feito de `span` sem nome | Checkbox real |
| H6 | Colunas truncadas no que o auditor anota | Tabela de largura total |
| H7 | Período só por digitação de DD/MM/AAAA | Atalhos de período |
| H8 | "Pôr todas na amostra" com 0 resultados | Esconder com 0 |
| H1 | Amostra montada só visível no cartão da direita, fora da vista ao rolar | Barra fixa de amostra |

### 3.8 Cadastros (`Cadastros.jsx`): referência e diretórios

Produtos é tabela de referência (consulta); Manual é documento versionado; Fornecedores e Treinamentos são diretórios; Filiais é conjunto pequeno.

| H | Violação | Correção |
| --- | --- | --- |
| H8 | Fornecedores e Filiais em cartões com caixas dentro | Top 3; Filiais achatado |
| H2 | "Depois dele", "É ração" | "Limpeza antes de ração", "Carga de ração" |
| H7 | Treinamentos sem busca por participante (o auditor pede "treinamento do motorista X") | Lista com busca por participante |
| H7 | Participantes do treinamento escolhidos em nuvem de chips (`cad-treinamento.png`), não escala | Campo de seleção múltipla com busca e "Selecionar todos da frota própria" |
| H4 | Serviço e regime máximo na mesma fileira de chips no cadastro de fornecedor (`cad-forn-novo.png`) | Dois grupos rotulados; regime só aparece quando o serviço é Lavagem |

### 3.9 Configurações (`Configuracoes.jsx`): configurações em abas

Hoje é uma página de 2626 px com índice à esquerda que não acompanha a rolagem. Proposta: o índice da esquerda vira abas de verdade (uma seção por vez, URL `?secao=regras`), cada seção com o próprio cabeçalho e ação.

| H | Violação | Correção |
| --- | --- | --- |
| H1 | Índice continua marcando "Usuários e papéis" com a página rolada até LGPD (`cfg-semente.png`) | Abas com uma seção por vez |
| H4 | Regras de norma com "Só alerta" apagado mas clicável | Cadeado e texto (Top 10) |
| H8 | "Entrar como" repetido em sete linhas | Ícone com tooltip, ou menu da linha |
| H6 | Lista de usuários sem cabeçalho de coluna | Cabeçalhos Nome, Papel, Filiais |

### 3.10 Moldura (`moldura.tsx`)

| H | Violação | Correção |
| --- | --- | --- |
| H1 | Badges da sidebar (10, 4) sem dizer o que contam, só no `title` | Tooltip visível ao foco e rótulo no leitor: "10 viagens de hoje com pendência" |
| H3 | Toast sem ação de desfazer | Top 5 |
| H7 | Busca global só acha registros; não leva a telas nem a ações | Resultados de "Ir para" (telas) e "Ações" (Nova viagem, Cadastrar transportador) no mesmo painel |
| H8 | Desfoque forte no fundo de modal e drawer | Só escurecer (rgba 0,0,0,.24); desfoque no máximo 2 px em modal, nenhum em drawer |

### 3.11 Link da Viagem (`LinkDaViagem.jsx`): fluxo de celular passo a passo

| H | Violação | Correção |
| --- | --- | --- |
| H1 | "Faltam 5 de 5 itens" depois de responder "Sim" aos cinco: conta foto e resposta juntas (`link-check-feito.png`) | "Faltam 5 fotos" ou "Faltam 2 respostas e 5 fotos" |
| H1 | Estado "Sim" escolhido quase igual ao não escolhido | Fundo teal sólido, texto branco, ícone ✓ |
| H8 | Cabeçalho de 215 px em todas as etapas | Cabeçalho compacto depois da capa |
| H9 | Erro de carga proibida fica atrás do rodapé fixo (`link-t3-proibida.png`) | Rolar até o erro e reservar 96 px de respiro acima do rodapé |
| H2 | Toast "Link enviado e aberto. A mesa da filial já mostra." para o motorista | Mensagem só para o escritório; no celular, nenhuma |

---

## 4. Coleções: lista, cartões, avatar, escala

| Coleção | Tela | Hoje | Recomendação | Colunas | Drawer no clique | Avatar | 50 a 500 itens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Viagens | Viagens.jsx | Tabela | Tabela | Carregamento, Ordem, Produto e rota, Transportador, Placas, Situação | Não: abre a página da Viagem (é o objeto de trabalho) | Não | Já pagina 25; ordenar, seleção, cabeçalho fixo |
| Transportadores | Transportadores.jsx | Tabela | Tabela | Transportador, Conjuntos, Documentos (pior primeiro), Viagens, Ocorrências, Convite, [...] | Sim, já existe; sem desfoque, ↑ ↓ | Iniciais neutras para TAC; ETC sem avatar | Seleção com "Convidar selecionados", "Exportar" |
| Frota própria | Frota.jsx | Cartões | Tabela | Top 1 | Sim (Top 1) | Não | Busca por placa, filtros de escopo, ordenar por base |
| Fornecedores | Cadastros.jsx | Cartões | Tabela | Top 3 | Sim (Top 3) | Ícone de tipo, sem avatar | Filtros por serviço e por vencimento |
| Produtos e regimes | Cadastros.jsx | Tabela | Tabela | Produto (nome e inglês), Também chamado de, Categoria, Limpeza antes de ração, Carga de ração | Não; tooltip nas linhas com sinônimos longos | Não | Filtro por categoria e regime; a base IDTF pode passar de 500: paginar ou virtualizar |
| Manual (versões) | Cadastros.jsx | Cartões | Lista de versões tipo linha do tempo | Versão, Vigência, Ciências, O que mudou | Sim: cartões da versão | Não | Não cresce |
| Treinamentos | Cadastros.jsx | Cartões | Tabela | Data, Tema, Instrutor, Carga horária, Participantes (contagem + 3 nomes) | Sim: lista completa de participantes e anexo | Não na lista | Busca por participante e tema; filtro por ano |
| Filiais | Cadastros.jsx | Cartões | Cartões achatados até 20; tabela acima | Filial, Registro GMP+, Afretador, Protocolos 45 dias, Gatekeeper | Não; "Abrir a mesa" | Não | Raro |
| Usuários | Configuracoes.jsx | Lista sem cabeçalho | Tabela | Nome (e-mail), Papel, Filiais, Último acesso, [...] | Sim: papel, filiais, alçada, liberações assinadas | Iniciais neutras | Busca quando passar de 20 |
| Viagens da auditoria | Auditoria.jsx | Tabela espremida | Tabela de largura total | Top 7 | Sim, leitura | Não | Período + busca; paginação 50 |
| Histórico de cargas | Compartimento.jsx | Tabela | Tabela | Já correta | Não | Não | Paginar a partir de 50 |

---

## 5. Texto solto para cortar ou virar tooltip

| Tela | Texto atual | Destino |
| --- | --- | --- |
| Viagens | "Toda viagem com a situação e o histórico, todas as filiais" | Cortar; a contagem fica ao lado do título |
| Transportadores | "11 TACs e 3 ETCs, base compartilhada entre as filiais. A qualificação do TAC é feita viagem a viagem." | Cortar; contagem já aparece em "14 transportadores"; "base compartilhada" vira tooltip no título |
| Frota | "6 conjuntos, 4 no escopo GMP+. 7 viagens nos últimos 30 dias. Nenhuma CNH ou CRLV vencendo em 30 dias." | Contagens nos chips de filtro; "Nenhuma CNH ou CRLV vencendo" vira chip verde |
| Frota | Parágrafo de rodapé "Só os conjuntos no escopo GMP+ podem fazer viagem assegurada; ..." | Tooltip do chip "No escopo" |
| Frota | "2 treinamentos registrados, último 18/06" em toda linha | Só quando falta |
| Auditoria | "O auditor não opera: a qualidade opera ao lado dele." | Cortar (é decisão de projeto, não instrução) |
| Auditoria | "Colunas na ordem em que o auditor anota." | Cortar |
| Viagem | "derivadas dos fatos; ninguém digita estado" | Cortar |
| Viagem | "nada se apaga: correção e cancelamento entram como evento novo" | Tooltip no título "Linha do tempo" |
| Viagem | "por compartimento; o regime sai da carga anterior pela IDTF" | `Termo` em "regime" |
| Viagem | "O histórico pertence ao compartimento (placa da carreta e posição), não ao cavalo." | Tooltip no link "Histórico" |
| Viagem | "quem resolve cada um está ao lado" | Cortar; agrupamento por responsável já diz (Top 4) |
| Hoje | "viagem completa = T-3, verificação aprovada, termo quando gatekeeper e CT-e conciliado" | Tooltip (i) |
| Hoje | "Viagens asseguradas já carregadas com item faltando. Quem trata é a qualidade." | Cortar a segunda frase |
| Hoje | "Certificado GMP+ GMP+ FSA 104377" | "Certificado GMP+ FSA 104377" |
| Compartimento | Parágrafo de rodapé sobre limpeza e quarentena | Tooltip nos selos e no veredito |
| Cadastros, Fornecedores | "Credenciado para limpeza até regime C (água e detergente)" | Chip "Lavagem até C" com tooltip |
| Cadastros, Filiais | "4 filiais com registro GMP+ próprio. 1 ainda não comunicou o gatekeeper ao organismo certificador." | Manter só a segunda frase como aviso quando for verdade |
| Configurações | "Mudar uma regra hoje não altera decisão já registrada." no subtítulo da página | Mover para a seção Regras |
| Configurações | "Na demonstração, "Entrar como" troca o usuário da sessão." | Tooltip no botão |
| Transportadores, drawer | "Clique na carreta para ver o histórico de cargas." | Botão rotulado (Top 10) |
| Transportadores, drawer | "o passaporte do TAC é o histórico das viagens dele" | Cortar |

---

## 6. Lista completa por arquivo

Formato: id, o que está errado, correção, severidade.

### Hoje.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U01 | Gestor: indicadores antes de "Esperando sua assinatura" | "Precisa de você" no topo; indicadores em faixa clara de 72 px (Top 6) | alta |
| U02 | "Gatekeeper comunicado ao OC": OC confunde com ordem de carregamento | "comunicado à certificadora" em todo o app | alta |
| U03 | "Filtrar esta mesa" não filtra a visão do gestor e não dá retorno (`hoje-filtro-vazio.png`) | Filtrar as três listas, com estado vazio e "Limpar"; ou esconder o campo na visão do gestor | alta |
| U04 | Afretador: motivo do bloqueio cortado ("Bloqueio técnico: RAD 3K20 C1 levou cama de fra...") | Motivo em até duas linhas; botão abaixo em 1366 | alta |
| U05 | Afretador: linha de bloqueio técnico sem ação ("Ninguém aprova") | Botão "Trocar conjunto" que abre o mesmo fluxo da Viagem | alta |
| U06 | Afretador: barra de 5 segmentos sem legenda | "4 de 5 no link" e tooltip por segmento | média |
| U07 | Cartões de filial: "GMP+ 105744" quebra em duas linhas; quatro cartões altos | Tabela compacta "Filiais hoje" com linha clicável (Top 6) | média |
| U08 | "Abrir a mesa da filial →" é `span role="button"`, não link | `<a href="/hoje?filial=SOR">` | média |
| U09 | Mesa da filial aberta pelo gestor ("Hoje em Sorriso") sem caminho de volta além do seletor | Chip removível "Sorriso ×" ao lado do título e breadcrumb "Empresa › Sorriso" | média |
| U10 | Rótulo do indicador em duas linhas ("PRONTIDÃO PARA AUDITORIA, ÚLTIMOS 45 DIAS") e fórmula em nota | Uma linha "Prontidão para auditoria" e tooltip (i) | média |
| U11 | Indicadores não clicam | Cada número leva à lista filtrada correspondente | média |
| U12 | "Pendências de registro": linhas são links sem sinal de link | Chevron no hover e fundo de hover | média |
| U13 | Gestor de frota (Sérgio) vê "painel da qualidade com as 4 filiais", nada da frota (`hoje-como-u-sergio.png`) | Hoje do gestor de frota: conjuntos no escopo, documentos da frota a vencer, viagens da frota hoje (ver seção 7) | média |
| U14 | Consultoria (Ana, só leitura) vê "Nova viagem" como ação primária (`hoje-como-u-ana.png`) | Não mostrar ação que o papel não pode fazer; no lugar, "Exportar" | média |
| U15 | Nova viagem: embarcador e destinatário em nuvem de 7 a 9 chips; não escala a 50 clientes (`hoje-nova-viagem-erros.png`) | Campo de busca com sugestão (combobox) e os 3 mais usados da filial como chips de atalho | média |
| U16 | Coluna esquerda termina em 760 px e a direita vai a 1020 px: buraco branco em 1366 | Card "Auditoria" para a coluna esquerda, ou grade que equilibra | baixa |
| U17 | "Certificado GMP+ GMP+ FSA 104377" com palavra repetida | "Certificado GMP+ FSA 104377" | baixa |
| U18 | "Pendências de registro": "Ivo Barcellos..." cortado por dois chips | Chips abaixo do nome quando houver dois | baixa |
| U19 | Afretador: linhas sem botão (motorista preenchendo) não dizem o próximo passo | Texto apagado "Aguardando motorista" no lugar do botão | baixa |

### Viagens.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U20 | Coluna Situação corta o motivo ("Três últimas cargas por comparti...") | Duas linhas ou rótulo curto com tooltip | média |
| U21 | Sem ordenação por coluna | Cabeçalhos ordenáveis com `aria-sort`; padrão Carregamento desc | média |
| U22 | Abas, "Situação" e "Filtros" (Tipo, Filial) são três jeitos de filtrar | Abas como visões; filtros numa barra única com valor visível em cada botão | média |
| U23 | Sem seleção nem ação em massa | Checkbox por linha e barra "Exportar selecionadas" | média |
| U24 | Cabeçalho da tabela não fica fixo ao rolar 25 linhas | `position: sticky` no `thead` dentro da área que rola | média |
| U25 | Dois códigos por linha (OC e VG) | Só OC na lista | baixa |
| U26 | Estado vazio sem botão de limpar (`viagens-vazio.png`) | Botão "Limpar filtros" no próprio estado vazio | baixa |
| U27 | 1920: "Produto e rota" ocupa metade da tabela e Placas fica longe | Larguras máximas por coluna; rota com `max-width` de 420 px | baixa |
| U28 | "Exportar planilha" não diz o que exporta | "Exportar 29 viagens" (muda com filtro) | baixa |

### Viagem.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U29 | Quatro "Enviar link" no aviso e um quinto no cartão do link | Um botão por responsável (Top 4) | alta |
| U30 | Ao rolar 2084 px, título, estado e ação primária somem | Cabeçalho fixo que encolhe (Top 4) | alta |
| U31 | Mesma pendência em aviso, Checagens, Registro para auditoria e Link do motorista | Top 4 | alta |
| U32 | Liberar por autoridade em modal de 9 campos que esconde a viagem (`hoje-analisar.png`) | Drawer de decisão (Top 8) | alta |
| U33 | Cartões "Trocar o conjunto" e "Regularizar conforme a TS1.9" parecem aviso | Botões sólidos e de contorno sobre o vermelho (Top 10) | alta |
| U34 | Passo a passo abaixo do aviso | Dentro do cabeçalho | média |
| U35 | "Carrega hoje" em pílula com borda parece botão | Texto secundário | média |
| U36 | Modal "Enviar link" só copia | "Abrir no WhatsApp" como primário | média |
| U37 | "CT-e a conciliar" e "NF a conciliar" em laranja nos chips de identificação | Texto apagado "não conciliado"; ação "Conciliar" se existir | baixa |
| U38 | "Exportar registro" no cabeçalho e "Exportar registro da viagem" no menu Ações | Deixar só no cabeçalho | baixa |
| U39 | "Três últimas cargas": cartão > caixa > três ladrilhos hachurados | Uma linha por T-n com divisor, sem caixa interna | baixa |
| U40 | "Checagens" como cartão próprio com barra de progresso | Link "Ver as 9 checagens" no bloco de pendências | média |

### Transportadores.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U41 | "Revogar" revoga na hora, sem confirmar nem desfazer (`transp-revogar.png`) | Menu da linha; toast com "Desfazer" (Top 5) | alta |
| U42 | Ações de convite em texto colado ao chip ("aceito Revogar", "revogado Convidar de novo") | Chip informativo; ações no menu `[...]`; a ação recomendada ("Reenviar" para expirado) como botão pequeno de contorno | média |
| U43 | Drawer desfoca a lista e não navega para o próximo | Sem desfoque; ↑ ↓ e botões "anterior/próximo" no cabeçalho do drawer | média |
| U44 | Drawer: documento vencido (CRLV QHG 7L34) por último na lista | Ordenar documentos por situação: vencido, a vencer, em dia | média |
| U45 | Drawer: "Clique na carreta para ver o histórico de cargas" | Botão "Histórico de cargas ›" por placa | média |
| U46 | "Apto" (ETC) e "Documentos em dia" (TAC) para o mesmo estado | "Em dia" para os dois | média |
| U47 | Cadastrar: placas em texto livre; sem "Falta:" no rodapé (`transp-cadastrar.png`) | Campo de chips de placa com validação; padrão `listaFalta` | média |
| U48 | Importar planilha sem modelo para baixar e sem prévia (`transp-importar.png`) | Link "Baixar modelo (.xlsx)"; passo de prévia com "12 novos, 2 duplicados ficam de fora" antes de importar | média |
| U49 | Sem ordenação e sem seleção em massa | Ordenar por nome, documentos, última viagem; "Convidar selecionados" | média |
| U50 | Avatares em cores fortes e variadas | Iniciais em cor neutra; ETC sem avatar | baixa |
| U51 | "1, 1 grave aberta" na coluna Ocorrências | "1 grave aberta" ou "1 (grave, aberta)" | baixa |
| U52 | Aba "Em dia" sem contagem enquanto as outras têm | Contagem em todas | baixa |

### Frota.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U53 | Linha do conjunto não clica (`frota-clique-linha.png`) | Linha abre drawer do conjunto (Top 1) | alta |
| U54 | Pílula do compartimento é o único caminho para o histórico | Ação rotulada "Ver histórico de cargas" no drawer e no menu da linha | alta |
| U55 | "Tirar do escopo" em vermelho solto na linha | Menu da linha, com motivo e "Desfazer" | alta |
| U56 | Selos "A" repetidos sem legenda | Só a última carga com selo + tooltip do glossário | média |
| U57 | Sem busca nem filtros | Busca por placa e motorista; chips No escopo, Fora, Documento a vencer | média |
| U58 | "Exportar lista do escopo" é o botão primário escuro da tela | Botão de contorno; o primário fica para a ação de cadastro, se houver | baixa |
| U59 | "No escopo GMP+" no título da seção e em cada linha | Coluna Escopo e filtros (Top 1) | baixa |
| U60 | "2 treinamentos registrados, último 18/06" igual em todas as linhas | Só quando falta treinamento | baixa |
| U61 | Motivo de fora do escopo em texto de 12 px alinhado à direita | Na coluna Escopo, "Fora: dedicado a calcário" | baixa |
| U62 | Parágrafo de rodapé explicativo | Tooltip no chip "No escopo" | baixa |

### Compartimento.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U63 | Placa inválida na URL mostra outro compartimento sem aviso | Estado "não encontrado" com busca de placa | alta |
| U64 | Item aceso na sidebar (Transportadores) diverge do breadcrumb (Frota própria) com URL inválida | Derivar os dois do dono do compartimento | média |
| U65 | Selo de regime "A" sem legenda na tabela | "A seco" ou tooltip | média |
| U66 | Herói escuro igual ao de Hoje e Auditoria | Faixa clara com veredito colorido (seção 3.6) | média |
| U67 | T-1, T-2, T-3 no herói repetem a tabela | Tirar do herói | baixa |
| U68 | Breadcrumb não mostra o conjunto ("Frota própria › SQT 6B77 C1") | "Frota própria › QBD 3E90 › SQT 6B77 C1"; para TAC, "Transportadores › nome › placa" | baixa |

### Auditoria.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U69 | Tabela espremida pela coluna lateral; nomes e produtos cortados | Largura total; laterais viram menu e barra (Top 7) | alta |
| U70 | Checkbox de amostra é `span role="button"` sem nome | Checkbox real com `aria-label` | alta |
| U71 | Só a data é link para a viagem | Linha inteira abre drawer de leitura | média |
| U72 | Amostra montada fica no cartão lateral, fora da vista | Barra fixa no rodapé com contagem e "Exportar amostra" | média |
| U73 | Período só por digitação | Atalhos (30, 90 dias, desde a última auditoria) | média |
| U74 | Busca no herói escuro: placeholder cortado e foco com borda dupla | Barra clara; placeholder curto; um só anel de foco | média |
| U75 | "Pôr todas na amostra" com 0 resultados (`auditoria-busca-vazia.png`) | Esconder quando vazio | baixa |
| U76 | Cabeçalho "EMBARCADOR E DESTINATÁRIO" em três linhas | "Embarcador → destinatário" em uma linha com largura mínima | baixa |
| U77 | "Documento" e "Planilha" como links minúsculos em "Listas de apoio" | Menu "Exportar ▾" com formato em cada item | baixa |

### Cadastros.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U78 | Fornecedores em cartões, sem busca, sem ordem por vencimento | Tabela com drawer (Top 3) | alta |
| U79 | "Credenciado para limpeza até regime C (água e detergente)" em frase | Chip "Lavagem até C" com tooltip | média |
| U80 | Treinamentos em cartões na metade da tela; sem busca por participante | Tabela com busca e drawer (seção 4) | média |
| U81 | Participantes do treinamento em nuvem de chips | Seleção múltipla com busca e "Selecionar todos da frota própria" | média |
| U82 | Cadastro de fornecedor mistura serviço e regime na mesma fileira de chips | Dois grupos rotulados; regime só para Lavagem | média |
| U83 | "Atualizar" documento de fornecedor pede só a nova data, sem o arquivo (`cad-forn-atualizar.png`) | Campo de arquivo do documento novo ao lado da validade | média |
| U84 | Produtos: painel fixo "Pedir classificação à Traxium" ocupa 260 px ao lado da tabela | Botão "Pedir classificação" no cabeçalho, modal; pedidos em andamento como filtro "Em análise (1)" | média |
| U85 | Produtos: "Depois dele" e "É ração" | "Limpeza antes de ração" e "Carga de ração" | média |
| U86 | Filiais: cartão > caixas cinza > caixa com borda | Uma linha por informação, sem caixas internas | média |
| U87 | Ações em texto de 13 px no canto dos cartões ("Publicar nova versão", "Registrar treinamento", "Ver os cartões") | Botões pequenos de contorno de 32 px | baixa |
| U88 | Sem abas na página; troca de seção só pela sidebar (some com a sidebar recolhida) | Sobrelinha "CADASTROS" vira breadcrumb clicável com menu das quatro seções | baixa |
| U89 | Produtos: cabeçalho da tabela não fica fixo em 30 linhas | `thead` fixo | baixa |

### Configuracoes.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U90 | Página única de 2626 px; índice lateral não acompanha a rolagem | Abas com uma seção por vez e `?secao=` | média |
| U91 | Regras de norma: "Só alerta" apagado mas clicável (toast) | Cadeado + "Bloqueia sempre (norma)" | média |
| U92 | "Bloqueia / Só alerta" sem indicar claramente o valor atual | `SegmentedControl` com rótulo "Quando falhar" | média |
| U93 | Lista de usuários sem cabeçalho de coluna; "Entrar como" repetido | Cabeçalhos; "Entrar como" em ícone ou menu | baixa |
| U94 | Convidar usuário: papel Afretador sem campo de filial visível no formulário inicial (`cfg-convidar.png`) | Campo "Filial" aparece logo abaixo ao escolher Afretador, com "Falta: filial" no rodapé | média |
| U95 | Modelos em cartões de alturas diferentes | Lista com prévia de duas linhas e "Ver tudo" | baixa |

### moldura (`src/components/moldura/moldura.tsx`, `moldura.css`)

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U96 | Toast sem slot de ação | `avisar(texto, { acao, onAcao })`, 8 s quando há ação | alta |
| U97 | Desfoque forte no fundo de modal e drawer | Só escurecer; drawer sem desfoque | média |
| U98 | Badges da sidebar sem significado visível | Tooltip no foco; `aria-label` com a frase | baixa |
| U99 | Busca global só acha registros | Grupos "Ir para" e "Ações"; ↑ ↓ e Enter | média |
| U100 | Subitens de Cadastros com 27 px de altura | 32 px | baixa |
| U101 | "Versão anterior" e "Protótipo mobile" no menu principal, entre itens do produto; rótulo mudou entre capturas | Grupo "Demonstração" no rodapé, com nome fixo | baixa |
| U102 | Sem cabeçalho de página fixo comum às telas | `CabecalhoPagina` com variante fixa para detalhe (Top 2, Top 4) | média |
| U103 | "Entrar como" no menu da pessoa sem marca de demonstração | Item com tag "demo" | baixa |

### LinkDaViagem.jsx

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U104 | Cabeçalho de 215 px (25% da tela de 844) em todas as etapas | Depois da capa, barra de 64 px: empresa, "Etapa 3 de 5" e barra de progresso; o cartão da carga abre ao tocar | alta |
| U105 | Escolha "Sim" com contraste fraco | Sólido com ✓; "Não" escolhido em vermelho claro com ✕ | alta |
| U106 | "Faltam 5 de 5 itens" mistura resposta e foto | "Faltam 5 fotos" ou "Faltam 2 respostas e 5 fotos" | média |
| U107 | Erro de carga proibida atrás do rodapé fixo | Rolar até o erro; `scroll-margin-bottom` de 96 px | média |
| U108 | Rótulo do botão "Assine no quadro para enviar" ocupa a largura inteira do botão em 390 px e corta em telas de 360 px (`link-termo.png`) | "Assine para enviar" | média |
| U109 | Toast de escritório para o motorista ("A mesa da filial já mostra") | Não mostrar no celular | baixa |
| U110 | Data da carga só por seletor nativo | Atalhos "Ontem", "Semana passada" acima do seletor; o seletor fica para outras datas | baixa |
| U111 | Produto livre sem sugestões | Chips das 5 cargas mais comuns da filial abaixo do campo | baixa |
| U112 | Cartão do manual com metade vazia e 5 toques em "Próximo cartão" | Arrastar para o lado; altura pelo conteúdo | baixa |
| U113 | Botão do obturador da câmera sem nome acessível | `aria-label="Tirar foto"` | baixa |
| U114 | "com sinal" parece estado mas é botão de demonstração | Mover para o painel de demonstração | baixa |

### design-system (`src/app/design-system`)

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U115 | Faltam os componentes que esta revisão pede | Acrescentar: `Drawer` (sem desfoque, ↑ ↓), `MenuLinha` (`[...]`), `Confirmar`, toast com ação, `Termo` (glossário), `SegmentedControl`, `Combobox`, `PeriodoComAtalhos`, `Tabela` com ordenação, seleção e cabeçalho fixo, `BarraSelecao`, `CabecalhoPagina` em três variantes, `Breadcrumb`, `Skeleton` de tabela | alta |
| U116 | Regras de afordância e de ação destrutiva não estão escritas | Seção "Regras gerais" com as quatro regras do Top 10 e a regra de destrutivas do Top 5, com exemplo "faça e não faça" | média |
| U117 | Erro de hidratação no exemplo de Modal (estilo do `textarea` difere entre servidor e cliente), visto no console em `/design-system` | Igualar o estilo inicial, ou montar o exemplo só no cliente | média |
| U118 | Política de avatar não documentada | Seção no `Badge`/avatar: pessoa com iniciais neutras, empresa sem avatar, veículo pela placa | baixa |

### Transversal (vale para todas as telas, aplicar junto com o arquivo de cada uma)

| Id | O que está errado | Correção | Sev. |
| --- | --- | --- | --- |
| U119 | Herói teal escuro em Hoje, Auditoria e Compartimento deixa as telas iguais | Só em Hoje do gestor (Top 2) | alta |
| U120 | Subtítulos de página que repetem a lista ou explicam conceito | Seção 5 | média |
| U121 | Sem nenhuma ordenação de tabela no app (`aria-sort` não existe em `src/telas`) | Componente `Tabela` | média |
| U122 | Nenhum "Desfazer" no app | Top 5 | alta |
| U123 | Termos técnicos sem explicação no lugar | Top 9 | alta |

---

## 7. Para validar com o time

Só decisões de produto ou gosto; o resto acima pode ser feito sem perguntar.

1. **Hoje do gestor de frota.** Hoje ele vê o painel da qualidade. Opções: (a) uma mesa própria com conjuntos, documentos da frota e viagens da frota; (b) o painel da qualidade com o filtro "Frota própria" ligado por padrão; (c) manter como está.
2. **Abrir o WhatsApp direto.** "Abrir no WhatsApp" com `wa.me` e mensagem pronta tira o copiar e colar, mas abre o WhatsApp da máquina em que o afretador está (pode ser o Web, de outra conta). Opções: abrir direto como primário, ou manter copiar como primário.
3. **Código interno da viagem (VG-3122).** Se o código tem uso fora do sistema (suporte, integração), fica visível; se não, aparece só no detalhe.
4. **Conferência das fotos item a item.** Hoje a aprovação é do conjunto das cinco fotos. Opção: aprovar ou devolver cada foto, com motivo por item.
5. **Atalhos de teclado nas listas** (↑ ↓ ou J/K para mover a seleção, Enter para abrir, Esc para fechar o drawer). Úteis para quem passa o dia na tela; exigem um aviso de atalhos (tecla "?").
6. **Página própria de compartimento ou só drawer.** A proposta mantém a página `/compartimento` (link direto para auditoria) e acrescenta o drawer do conjunto. Opção alternativa: o histórico vira uma aba dentro do drawer e a página deixa de existir.
7. **Logo de empresa** (ETC, fornecedor) enviado pelo cliente. A recomendação é não usar; se o time quiser, o lugar é o cabeçalho do drawer, nunca a linha da lista.
8. **Densidade da tabela** escolhida pela pessoa (confortável, 52 px; compacta, 40 px). Útil na safra, custa um controle a mais.
9. **Itens "Versão anterior" e "Protótipo mobile" no menu.** Ficam enquanto o produto é demonstração; saem quando houver cliente usando.

---

## 8. Capturas

Todas em `/tmp/claude-1000/revisao-ux/`:

- Telas inteiras em 1366: `full-hoje.png`, `full-viagens.png`, `full-viagem_id_VG-3122.png`, `full-transportadores.png`, `full-frota.png`, `full-auditoria.png`, `full-cadastros_aba_produtos.png`, `full-cadastros_aba_manual.png`, `full-cadastros_aba_fornecedores.png`, `full-cadastros_aba_filiais.png`, `full-configuracoes.png`, `full-compartimento_placa_QHG7L34_pos_1.png` (URL inválida).
- Dobra em 1366 e 1920: `<tela>-1366.png`, `<tela>-1920.png`.
- Por papel: `hoje-como-u-rafael.png`, `hoje-como-u-luiz.png`, `hoje-como-u-diego.png`, `hoje-como-u-paula.png`, `hoje-como-u-camila.png`, `hoje-como-u-marcos.png`, `hoje-como-u-sergio.png`, `hoje-como-u-ana.png`, `hoje-mesa-filial.png`.
- Modais, menus e drawers: `hoje-nova-viagem.png`, `hoje-nova-viagem-erros.png`, `hoje-analisar.png`, `hoje-menu-filial.png`, `busca-global-qhg.png`, `busca-global-vazia.png`, `entrar-como.png`, `viagens-filtros.png`, `viagens-periodo.png`, `viagem-acoes.png`, `viagem-enviar-link.png`, `viagem-ocorrencia.png`, `viagem-bloqueio-tecnico.png`, `conferir-fotos.png`, `transp-drawer.png`, `transp-cadastrar.png`, `transp-importar.png`, `transp-revogar.png`, `frota-tirar.png`, `frota-clique-linha.png`, `auditoria-simulacao.png`, `auditoria-amostra.png`, `cad-forn-novo.png`, `cad-forn-atualizar.png`, `cad-treinamento.png`, `cfg-convidar.png`, `cfg-so-alerta.png`, `cfg-semente.png`.
- Estados vazios: `viagens-vazio.png`, `auditoria-busca-vazia.png`, `hoje-filtro-vazio.png`, `busca-global-vazia.png`.
- Teclado (foco após 19 Tabs): `teclado-hoje.png`, `teclado-viagens.png`, `teclado-frota.png`, `teclado-auditoria.png`, `teclado-cadastros_aba_fornecedores.png`.
- Link em 390x844: `link-1.png` (capa), `link-2.png` (quem é você), `link-p3-full.png` (cargas), `link-t3-proibida.png`, `link-check-feito.png`, `link-camera.png`, `link-camera-2.png`, `link-manual.png`, `link-termo.png`.
- Design system: `design-system-1366.png`, `ds-componentes.png`.
