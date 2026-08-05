# Revisão de UI/UX — Traxium (modo MVP)

Revisado contra: `DESIGN.md` (design system) e `Traxium - 5 Pilares prioritários.pdf` (diretriz de produto).
Data: 05/08/2026 · Telas capturadas no app rodando, 1280 / 768 / 375px.

## Capturas

| Tela | Breakpoint | O que mostra |
| --- | --- | --- |
| `torre-desktop` | 1280×1000 | Torre de Controle (home do MVP) |
| `torre-tablet` | 768×1200 | Mesma tela — evidencia a quebra de layout |
| `torre-mobile` | 375×1300 | Mesma tela — evidencia a ausência de navegação |
| `sub-desktop` | 1280×1400 | Subcontratados (Gatekeeper) |
| `idtf-desktop` | 1280×1200 | Motor IDTF |
| `motoristas-desktop` | 1280×1200 | Motoristas (Academy) |

Capturas em `/tmp/.../scratchpad/shots/` — fora do repo de propósito, para não virar ruído versionado.

## Resumo

O diagnóstico de "tudo flat, sem personalidade" **não se sustenta como leitura do produto inteiro**. Três telas têm identidade real e nada genérica: a matriz de sequenciamento do IDTF, o horizonte de vencimento dos subcontratados e as credenciais de motorista. São momentos de assinatura de verdade — nenhum outro SaaS de compliance se parece com aquilo.

O diagnóstico **acerta em cheio numa tela só: a Torre de Controle** — que é a home, a primeira coisa que qualquer pessoa vê, e a que acabou de ser construída na Fase 3. Três cards brancos empilhados, nenhuma assinatura visual, ao lado de telas internas muito mais fortes. A percepção de "produto flat" vem daí: a porta de entrada é a peça mais fraca do conjunto.

O problema mais grave da revisão, porém, não é estético: **o layout quebra em tablet e não navega em mobile**, e três tokens de cor usados como texto reprovam no contraste mínimo que o próprio `DESIGN.md` exige.

## Must fix

1. **Layout quebra em 768px, em todas as páginas.** A sidebar é `260px` fixa sem breakpoint e a topbar não recolhe: busca, Copilot, notificações e avatar saem da tela à direita. Ver `torre-tablet`. Não é questão de gosto — é overflow horizontal. _Correção: sidebar colapsando para ícones (ou drawer) abaixo de `lg`, e topbar com a busca virando botão de ícone._

2. **Mobile 375px não tem navegação.** A sidebar desaparece e nada a substitui: não há hambúrguer, não há tab bar. Quem abrir a tela fica preso nela. Ver `torre-mobile`. O `/mobile` (app do motorista) é outra superfície e não resolve isto. _Correção: drawer acionado por botão na topbar, reaproveitando `gruposPorPilar`._

3. **Contraste abaixo de WCAG AA**, contra o que o `DESIGN.md` §14 exige explicitamente ("contraste mínimo 4.5:1 para texto em todos os pares de cor"). Medido sobre card branco:

   | Token | Contraste | Situação |
   | --- | --- | --- |
   | `fg-soft` (210 12% 58%) | **3,10:1** | reprova — e é o mais usado, em textos de 10–11px |
   | `text-white/40` e `/35` na sidebar | **3,82:1** e pior | reprova — rótulos de grupo e itens somente-leitura |
   | `warning-500` no chip "offline" (`/mobile`) | **3,01:1** | reprova — é texto de 9px sobre branco |

   `fg-muted` (5,46:1), `danger-500` (4,72:1), `brand-600` (5,53:1) e `warning-700` (6,61:1) passam.

   **Ressalva sobre `success-500`/`warning-500`:** a primeira leitura desta revisão os listou como reprovados de forma genérica. Conferindo uso a uso, as 8 ocorrências de `text-success-500`/`text-warning-500` são **ícones**, não texto — e ícone responde ao critério de não-texto (WCAG 1.4.11, 3:1), que ambos cumprem. O único uso como texto é o chip "offline" acima. Os tokens não precisam mudar; só aquele chip.

   _Correção: escurecer `fg-soft` para `210 14% 46%` (~4,7:1); subir os brancos da sidebar para `white/55`; trocar o chip "offline" para `warning-700`._

4. **Nenhum `prefers-reduced-motion` no projeto** — zero ocorrências em `src/`. Com `animate-pulse-ring` rodando em loop infinito em cinco telas, isso é um problema real para quem tem sensibilidade vestibular. _Correção: bloco global em `globals.css` zerando `animation`/`transition-duration` sob a media query._

## Should fix

5. **A Torre de Controle é a tela mais fraca do produto — e é a home.** Comparada com `/idtf` (rail de severidade + colunas A/B/C/D) e `/subcontratados` (horizonte de vencimento contra a janela regulatória), a Torre é uma pilha de cards brancos. Só a faixa de triagem tem assinatura. É a origem da sensação de "flat". _Sugestão: a fila de decisões é o assunto da tela e hoje é uma lista dividida por linha. Tratá-la como o momento de assinatura — trilho vertical de severidade, tempo em fila visível (o PDF §Control Tower pede "tempo em fila" e ele não existe em lugar nenhum), e o item de bloqueio técnico com peso visual distinto do item de análise._

6. **Legenda da faixa de triagem trunca em tablet** — "Libera…", "Aguar…", "Bloqu…". Ver `torre-tablet`. `grid-cols-4` a partir de `sm:` (640px) é cedo demais para a largura que sobra. _Correção: manter 2 colunas até `lg`._

7. **Vocabulário de motion declarado e não usado.** `globals.css` define `shimmer`, `pulse-ring`, `fade-in` e `slide-in`. Fora do próprio arquivo: `animate-slide-in` tem **0 uso**, `animate-shimmer` **0 uso**, `animate-fade-in` **1 uso** (command palette). O `DESIGN.md` §12 promete "sparklines em KPIs" — não existem no MVP. A percepção de "sem motion" é justa: o sistema foi especificado e não aplicado. _Sugestão: entrada escalonada na fila de decisões e nos StatTiles (o dashboard da Solução completa já faz isso com as barras de regime), e `shimmer` como skeleton onde hoje não há estado de carregamento._

8. **`transition-all` em 48 lugares**, contra 40 de `transition-colors`. Anima layout e box-shadow junto com cor — custa repaint e produz hover impreciso. _Correção: trocar por `transition-colors` ou `transition-[color,box-shadow]` conforme o caso._

## Could improve

9. **Descrições de PageHeader longas demais.** Toda página abre com 2–3 linhas de texto corrido (Subcontratados tem 4 linhas, ~50 palavras) antes de qualquer dado. Empurra o conteúdo para baixo e compete com ele. _Sugestão: uma linha; o resto vira tooltip ou vai para o corpo._

10. **"Pilares do MVP" na Torre duplica a sidebar.** Mesmos cinco destinos, mesmos ícones, a 20cm de distância na mesma tela. _Sugestão: ou vira contador de pendências por pilar sem cara de menu, ou sai._

11. **Falta "tempo em fila".** O PDF §Control Tower lista explicitamente `tempo em fila` no painel administrativo, e a fila hoje não mostra há quanto tempo cada item espera. É a informação que transforma uma lista em uma fila.

## O que está bom e deve continuar

- **Matriz de sequenciamento (`/idtf`)** — rail de severidade menor→maior com as quatro colunas de regime e os produtos dentro. Ensina a regra ao mesmo tempo que a aplica. É a melhor peça do produto.
- **Horizonte de vencimento (`/subcontratados`)** — cada certificado plotado contra a janela 15/30/60. Um gráfico que é a própria regra regulatória, não um gráfico decorativo.
- **Credenciais de motorista (`/motoristas`)** — metáfora de crachá com faixa colorida por conformidade e anel no avatar. Distintiva sem ser fofa.
- **Sinal regulatório triplo.** Cor + ícone + rótulo em todo status crítico, como manda o §1.3. Cumprido de forma consistente.
- **Disciplina tipográfica.** Mono nos códigos técnicos, `.num` nos números, uppercase com tracking alto nos micro-labels. É o que impede as telas de parecerem template.
- **Honestidade de dado.** Nenhum número decorativo encontrado. Todos os contadores batem com o store.
