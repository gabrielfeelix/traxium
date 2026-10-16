# Handoff: continuar a revisão de UI e UX no app Next.js

Escrito em 15/10/2026, ao fim da sessão que transformou o protótipo v2 num app Next.js com moldura única. Este arquivo basta para começar. Para o histórico, leia `09-handoff-sistema-e-ui.md` (o pedido do Gabriel e o registro das etapas 1 a 11, seção 8) e `HANDOFF.md` (contexto do produto e regras do Gabriel, seção 9).

## 1. Situação em 15/10/2026

- Branch `fix/ux-fase-1-3`, último commit `635c52d`, tudo enviado ao GitHub. Nada publicado na Vercel.
- O app Next.js da raiz **é** o protótipo v2. Sidebar, header, busca global, menu da pessoa, modais do topo e toast são desenhados uma vez em `src/app/(painel)/layout.tsx`; trocar de tela troca só o conteúdo.
- O protótipo `.dc.html` em `SaaS moderno estilo Dribbble/` está **congelado**: não editar. Ele é copiado para `public/prototipo/` no build e abre pelo item "Versão anterior" da sidebar.
- O primeiro protótipo em Next (v1) está em `legado/v1-next/`, sem uso. Não apagar sem o Gabriel.
- Feito: moldura única; tokens de cor; contraste AA; teclado e foco; escala tipográfica; espaçamento em múltiplos de 4; campos com nome acessível; seletor de arquivo com erro de formato; alvos de clique; revisão de Hoje, Viagens, Viagem e Link da Viagem.

## 2. O que fazer, nesta ordem

1. **Fundo.** O Gabriel recebeu três opções em captura: A, o fundo atual (`#f2f5f4`); B, neutro esverdeado claro (`#f7f9f8`); C, moldura em `--fundo-fundo` com o conteúdo numa folha clara de borda fina. Até a resposta, vale A. Com a resposta: tornar a escolhida padrão nos tokens de `src/app/globals.css` e apagar o bloco "opções de fundo" no fim de `src/components/moldura/moldura.css`. Para ver uma opção: `document.documentElement.dataset.fundo = 'b'`.
2. **Revisar, uma por etapa:** Transportadores, Frota própria, Compartimento, Auditoria, Cadastros e Configurações. Método na seção 4.
3. **Botão compartilhado** em `src/components/ui/` (primário, secundário, perigo, ação em texto), como `<button>`, trocando os `span role="button"` tela a tela. Resolve os 21 alvos que ficaram com 31 px (abas TAC/ETC, linhas da Frota, "Enviar link", "Revogar acesso", "Registrar comunicação").
4. Premissas abertas do `HANDOFF.md`, seção 7 (convite de usuário, busca local, data no Link), seguem como estão.

O que já se sabe das seis telas restantes, para começar:

| Tela | Pontos já vistos |
| --- | --- |
| Transportadores | Modais de cadastrar, importar planilha, convite e revisar e reabilitar sem rodapé "Falta:"; ações "Convidar", "Revogar", "Reenviar", "Atualizar" como texto; drawer longo |
| Frota própria | Modal de tirar ou incluir no escopo (motivo de 10 caracteres) sem "Falta:"; linha do conjunto com 31 px |
| Compartimento | Tela de leitura; conferir hierarquia do hero e da tabela de histórico |
| Auditoria | Tabela de viagens com checkbox de amostra feito de `span`; datas como link; paginação; período com datas DD/MM/AAAA |
| Cadastros | Quatro seções; modais de publicar manual, registrar treinamento, atualizar documento de fornecedor e pedir classificação |
| Configurações | Convidar usuário (formulário), regras "Bloqueia / Só alerta" (28 px de altura), "Copiar", "Entrar como" |

## 3. Como rodar e testar

```bash
./scripts/servir.sh            # compila e sobe em http://localhost:8766 (para o servidor anterior antes)
pnpm dev                       # para trabalhar, em http://localhost:3000
```

Rotas: `/hoje`, `/viagens`, `/viagem?id=`, `/transportadores`, `/frota`, `/compartimento?placa=&pos=`, `/auditoria`, `/cadastros?aba=`, `/configuracoes`, `/link?id=`. Dados no `localStorage` (`tx-v2`); usuário pelo menu do avatar, "Entrar como".

Bateria, na raiz, com o servidor de pé em 8766 (`<pasta>` é qualquer pasta para capturas):

| Comando | O que confere |
| --- | --- |
| `node scripts/testar-tx-dados.mjs` | 674 conferências da base de dados e do motor |
| `node scripts/conferir-v2.mjs` | Link para rota inexistente, resto de `.dc.html`, travessão, ponto médio, clicável sem ação |
| `node scripts/e2e-moldura.cjs http://localhost:8766 <pasta>` | Moldura: sem recarregar, estado da sidebar, rolagem, voltar, teclado nos modais |
| `node scripts/e2e-ui.cjs http://localhost:8766 <pasta>` | Revisão de UI: uma seção por tela revista. **Acrescente a seção de cada tela nova aqui** |
| `node scripts/e2e-f1.cjs`, `e2e-f5.cjs`, `e2e-revisao.cjs` (mesmos argumentos) | Fluxos de negócio das rodadas anteriores |
| `node scripts/varrer-texto.cjs` | Texto renderizado de 61 estados sem travessão, `undefined`, `NaN` ou `null` |
| `node scripts/conferir-largura.cjs` | Nada estoura nem quebra rótulo de botão em 1366 px |
| `node scripts/conferir-alvos.cjs` | Alvos com 32 px ou mais (21 conhecidos com 31 px até o botão compartilhado) |
| `pnpm build` | Compila e confere tipos |

Captura: `node scripts/capturar.cjs <saida.png> <rota> [largura] [altura] [1|0] [js]`. O `1` captura a página inteira (o script solta a altura da moldura). Sai com erro se houver erro de JavaScript ou recurso 404.

## 4. Método por tela (o mesmo das etapas 7 a 10)

1. Capturar antes em 1366x768 e 1920x1080, nos estados principais (modais abertos, drawer, vazio).
2. Conferir os temas da tabela da seção 5 de `09-handoff-sistema-e-ui.md`: clicáveis, foco, contraste, tipografia, espaçamento, hierarquia, estados (carregando, vazio, erro, sucesso), formulários, tabelas, modais, alvos, consistência. Contraste, teclado, foco, escala e espaçamento já estão resolvidos em todas as telas; o trabalho agora é formulário, estado de erro, tabela e hierarquia.
3. Formulário de modal: usar o padrão da Viagem (seção 5 abaixo).
4. Acrescentar a seção da tela em `scripts/e2e-ui.cjs`; rodar a bateria inteira, `conferir-largura` e `conferir-alvos`.
5. Capturar depois; registrar em `09-handoff-sistema-e-ui.md`, seção 8, como "Etapa 12. Transportadores (data)" no formato problema, o que mudou, teste, premissas; commit em português, formato convencional, com a linha de coautoria; push.

## 5. Arquitetura que importa

| Arquivo | Papel |
| --- | --- |
| `src/app/(painel)/layout.tsx` | Monta a moldura, uma vez |
| `src/components/moldura/moldura.tsx` e `.css` | Sidebar (itens em `GRUPOS`, `CADASTROS`, `RODAPE`), header, busca global, menu da pessoa, diálogos do topo, toast. Item aceso por rota (`itemAtivo`) |
| `src/telas/*.jsx` | As dez telas. Componentes de classe que estendem `Tela`; `renderVals()` calcula tudo e `render()` usa `v.*`. Convertidas por `scripts/converter-dc.mjs`, que não sobrescreve sem `--forcar`: **as telas já foram editadas à mão, não reconverter** |
| `src/lib/tx/tx-dados.js` | Semente (versão 10), motor de decisão (`TX.decidir`), operações (`TX.fazer`), rotas novas nos `href`. Funcionalidade que escreve: `case` em `aplicar()` e teste em `testar-tx-dados.mjs` |
| `src/lib/tx/tx-ui.js` | `TX.ui`: `montar`/`desmontar` (ouvintes e temporizadores da tela), `avisar` (toast da moldura), `ir` (navega sem recarregar), `trocarUrl` (a tela reescreve a própria URL sem montar de novo), `rolagem` (a área que rola), `conferirArquivo`, `abrirTopo('entrar')`, `sel`, `chip`, `cta`, `paginar`, `buscaGlobal` |
| `src/lib/tx/tela.js` | O que cada tela importa: `TX`, `Tela`, `A` (link interno com `next/link`), `css` |
| `src/components/tela/chave-da-tela.tsx` | A tela monta de novo quando a rota recebe outro parâmetro de fora; não monta quando foi ela que trocou a URL por `TX.ui.trocarUrl` |
| `src/components/tela/teclado.tsx` | Global: Enter e espaço em `role="button"`; foco preso e devolvido em `aria-modal`; texto cortado mostra o inteiro ao passar o ponteiro |
| `src/components/ui/formulario.tsx` | `Campo` (label ligado, erro junto do campo), `Escolhas` (grupo de rádio com um chip só), `listaFalta` |
| `src/app/globals.css` | Tokens (cores, escala tipográfica anotada) e classes comuns: `tx-rotulo`, `tx-erro`, `tx-dica`, `tx-chip`, `tx-falta`, `tx-acao-texto`, `tx-alvo`, `tx-so-leitor` |
| `src/telas/estados.css` | Classes de hover geradas pelo conversor (`tx-h...`) |

Padrão do formulário de modal (Viagem, `modalVals`): cada modal chama `ctaOf(ok, falta)`, onde `falta` é uma lista de `[texto, campo]`; `minimo(texto, n, 'motivo', 'motivo')` gera "motivo (faltam 7 caracteres)". O rodapé mostra `v.mFalta` em `<span className="tx-falta">` antes dos botões. A confirmação faz `if (!ok) return this.levarAoQueFalta();`, que foca o `[data-tx-campo="..."]` do primeiro item. Em Hoje, a Nova viagem usa `Campo`, `Escolhas`, erros por campo depois de tentar (`nTentou1`) e `focarFalta`.

Escalas: escritório em 11, 12, 13, 14, 16, 20, 24 (32 e 40 só no número de painel); Link do motorista em 12, 14, 16, 20, 24, com campo de 44 px e fonte de 16 px.

## 6. Armadilhas

- Depois de `pnpm build`, o servidor antigo continua servindo arquivos velhos: use sempre `./scripts/servir.sh`. Não rode `pkill -f "next start"` dentro de um comando que contenha esse texto: mata o próprio shell.
- `var(--token)` não vale em atributo de SVG (`stroke=`, `fill=`): use `style={{ stroke: ... }}`. O HTML das exportações abre em outra aba, sem os tokens: lá as cores ficam fixas.
- Em `renderVals` as telas dividem a lógica em métodos (`telaVals`, `painelVals`, `novaVals`, `modalVals`); confira que `s` existe no método antes de usar `s.alguma`. Já houve tela quebrada por isso.
- As fontes vêm do Google pelo nome (`'Hanken Grotesk'`, `'Spline Sans Mono'`), porque as telas escrevem o nome no estilo: não trocar por `next/font` sem trocar os nomes.
- Next 16: leia `node_modules/next/dist/docs/` antes de mexer em rotas. `useSearchParams` precisa de `Suspense` (já está no layout e em `ChaveDaTela`).
- Depois de editar uma tela com script, rode `npx prettier --write src/telas/<Tela>.jsx --print-width 140 --single-quote`.
- `ola.txt` na raiz é de sessão antiga, fora do git. Não versionar.

## 7. Regras do Gabriel (resumo do `HANDOFF.md`, seção 9)

- Uma tela ou um ajuste por vez; captura antes e depois; bateria; commit e registro ao fim de cada etapa; push quando pronta e testada. Vercel só quando ele pedir; não pedir acesso nem conta.
- Texto de interface e documentos sem travessão e sem ponto médio, tom impessoal, datas absolutas.
- Nenhum botão sem ação; não adicionar por adicionar; Academy, não conformidades, indicadores e governança da base IDTF esperam decisão dele e do Rafael.
- Visual aprovado: Hanken Grotesk e Spline Sans Mono; teal `#127670`, `#0C5862`, `#093D44`, azul `#0E78B5`; cartões brancos de raio 18 a 20 px; sidebar teal escura; nada de emoji nem fill pastel chapado.
- Decidir com premissa reversível e registrar em tabela "premissa / o que muda se a resposta vier diferente". Perguntar a ele só o que é gosto ou produto, com captura.
- Ele é designer de UX, direto e impaciente com análise longa: mostrar progresso e entregar por partes.
