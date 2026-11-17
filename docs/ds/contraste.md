# Contraste dos tokens

Versão de 17/11/2026. Razões calculadas pela fórmula da WCAG 2.2 (luminância relativa), com os valores de `src/app/globals.css`. Script de cálculo refeito a cada mudança de token; os números abaixo são a saída dele.

Critérios: texto normal 4,5:1 (1.4.3); borda ou ícone que é o único sinal de um controle ou estado, 3:1 (1.4.11). Controle desabilitado é isento.

## Correções feitas nos tokens

| Problema | Antes | Depois | Token |
| --- | --- | --- | --- |
| Texto branco no início do degradê do botão de perigo | `#e46969`, 3,22:1 | `#cf4444`, 4,60:1 | `--perigo-cta` (novo); `TX.ui.ctaPerigo` e `.tx-botao--perigo` passam a usar |
| Borda da caixa de seleção, do trilho do switch e do ponto da opção (único sinal do controle) | `--borda-forte` `#c9d5d3`, 1,51:1 | `#7f9290`, 3,27:1 | `--borda-controle` (novo) |
| Azul como texto (situação "Em trânsito", aviso informativo) na `--superficie-2` | `--azul` `#0e78b5`, 4,33:1 | `#0c6ca3`, 5,13:1 | `--info` (novo); `--azul` fica para preenchimento e degradê |
| Laranja de "Liberada por autoridade" na `--superficie-2` | `#b85a2e`, 4,17:1 | `#a5502a`, 5,01:1 | `--autoridade` (novo); `TX.ui.TOM.autoridade.c` já usa |
| Cinza solto `#7c8f8d` como texto em 4 telas (7 usos) | 3,40:1 | `--texto-apagado`, 5,09:1 | mapeado no guia de migração |
| Subtítulo branco translúcido no cabeçalho do drawer | `rgba(255,255,255,.75)` | `--texto-inverso-2` (branco a 0,8), 5,85:1 no meio do degradê | `--texto-inverso-2` (novo) |

Os tokens antigos que já passavam (`--texto-sec`, `--texto-apagado`, `--placeholder`, `--ok`, `--aviso`) foram mantidos; os valores já tinham sido escurecidos em outubro.

## Pares que ficam como estão, com motivo

- `--placeholder` só aparece dentro de campo, que é sempre `--painel` (4,58:1). Nas outras superfícies o placeholder não é usado; campo desabilitado (fundo `--superficie`) é isento.
- `--borda-campo` (1,26:1) não é o único sinal do campo de texto: o rótulo visível em cima e o fundo branco sobre `--fundo` identificam o campo, e a WCAG não exige borda em campo de texto. Ao focar, a borda vira `--primario` (5,45:1) com anel.
- O ponto da situação (`--aviso-2`, `--neutro-ponto`, degradês claros) nunca está sozinho: o rótulo colorido ao lado passa 4,5:1 e carrega o sentido.

## 1. Texto sobre fundos neutros

Mínimo 4,5:1 (texto normal). Linhas: cor do texto. Colunas: fundo.

| texto | `--painel` #ffffff | `--fundo` #f2f5f4 | `--superficie` #f7faf9 | `--superficie-2` #f0f4f3 | `--superficie-hover` #f6f9f8 | `--primario-fraco` #eef7f6 |
|---|---:|---:|---:|---:|---:|---:|
| `--texto` #0b2224 | 16,55 | 15,09 | 15,76 | 14,93 | 15,63 | 15,19 |
| `--texto-2` #3c4f4e | 8,68 | 7,91 | 8,26 | 7,82 | 8,19 | 7,96 |
| `--texto-sec` #526664 | 6,10 | 5,56 | 5,81 | 5,50 | 5,76 | 5,60 |
| `--texto-apagado` #5f7270 | 5,09 | 4,64 | 4,84 | 4,59 | 4,80 | 4,67 |
| `--placeholder` #66797a | 4,58 | **4,18**  | **4,37**  | **4,13**  | **4,33**  | **4,21**  |
| `--primario` #127670 | 5,45 | 4,97 | 5,19 | 4,92 | 5,15 | 5,00 |
| `--primario-2` #0c5862 | 8,11 | 7,40 | 7,73 | 7,32 | 7,66 | 7,45 |
| `--ok` #177d4c | 5,15 | 4,70 | 4,91 | 4,65 | 4,87 | 4,73 |
| `--aviso` #9a6210 | 5,09 | 4,64 | 4,84 | 4,59 | 4,80 | 4,67 |
| `--perigo` #c43d3d | 5,14 | 4,69 | 4,90 | 4,64 | 4,86 | 4,72 |
| `--tecnico` #93313f | 7,63 | 6,96 | 7,27 | 6,88 | 7,20 | 7,00 |
| `--info` #0c6ca3 | 5,69 | 5,19 | 5,42 | 5,13 | 5,37 | 5,22 |
| `--autoridade` #a5502a | 5,55 | 5,06 | 5,29 | 5,01 | 5,24 | 5,10 |

## 2. Cor de situação sobre o próprio fundo tingido (Aviso, selo cheio)

| texto | fundo | razão | resultado |
|---|---|---:|---|
| `--ok` #177d4c | `--ok-fundo` #eff8f3 | 4,76 | passa |
| `--aviso` #9a6210 | `--aviso-fundo` #fdf6ec | 4,74 | passa |
| `--perigo` #c43d3d | `--perigo-fundo` #fdf6f6 | 4,82 | passa |
| `--tecnico` #93313f | `--tecnico-fundo` #fbf2f3 | 6,94 | passa |
| `--info` #0c6ca3 | `--info-fundo` #eff6fb | 5,22 | passa |
| `--autoridade` #a5502a | `--autoridade-fundo` #fdf5ef | 5,15 | passa |
| `--texto-2` #3c4f4e | `--ok-fundo` #eff8f3 | 8,01 | passa |
| `--texto-2` #3c4f4e | `--aviso-fundo` #fdf6ec | 8,09 | passa |
| `--texto-2` #3c4f4e | `--perigo-fundo` #fdf6f6 | 8,13 | passa |
| `--texto-2` #3c4f4e | `--tecnico-fundo` #fbf2f3 | 7,89 | passa |
| `--texto-2` #3c4f4e | `--info-fundo` #eff6fb | 7,95 | passa |
| `--texto-2` #3c4f4e | `--autoridade-fundo` #fdf5ef | 8,05 | passa |
| `--texto-sec` #526664 | `--ok-fundo` #eff8f3 | 5,63 | passa |
| `--texto-sec` #526664 | `--aviso-fundo` #fdf6ec | 5,68 | passa |
| `--texto-sec` #526664 | `--perigo-fundo` #fdf6f6 | 5,72 | passa |
| `--texto-sec` #526664 | `--tecnico-fundo` #fbf2f3 | 5,55 | passa |
| `--texto-sec` #526664 | `--info-fundo` #eff6fb | 5,59 | passa |
| `--texto-sec` #526664 | `--autoridade-fundo` #fdf5ef | 5,66 | passa |

## 3. Texto branco sobre cor (botões, toast, drawer, filtro ligado, página atual)

| uso | fundo | razão | resultado |
|---|---|---:|---|
| Botão primário, início do degradê | `--primario #127670` | 5,45 | passa |
| Botão primário, fim do degradê | `--azul #0e78b5` | 4,80 | passa |
| Botão perigo, início (antes) | `#e46969` | 3,22 | **reprova** |
| Botão perigo, início (agora) | `--perigo-cta #cf4444` | 4,60 | passa |
| Botão perigo, fim | `--perigo #c43d3d` | 5,14 | passa |
| Toast, chip de filtro ligado, página atual | `--texto #0b2224` | 16,55 | passa |
| Drawer, título | `--primario-3 #093d44` | 11,91 | passa |
| Drawer, título no meio do degradê | `--primario-2 #0c5862` | 8,11 | passa |
| Drawer, subtítulo `--texto-inverso-2` (branco a 0.8) | `--primario-2` | 5,85 | passa |
| Drawer, subtítulo `--texto-inverso-2` (branco a 0.8) | `--primario-3` | 8,20 | passa |
| Drawer, subtítulo `--texto-inverso-2` (branco a 0.75) | `--primario-2 (valor antigo .75)` | 5,33 | passa |

## 4. Bordas e ícones que carregam sentido (mínimo 3:1, WCAG 1.4.11)

| elemento | cor | sobre | razão | resultado |
|---|---|---|---:|---|
| Caixa de seleção, trilho do switch, ponto da opção (antes) | `--borda-forte #c9d5d3` | #ffffff | 1,51 | **reprova** |
| Caixa de seleção, trilho do switch, ponto da opção (agora) | `--borda-controle #7f9290` | #ffffff | 3,27 | passa |
| Caixa marcada, switch ligado, opção escolhida | `--primario #127670` | #ffffff | 5,45 | passa |
| Chip escolhido (borda) | `--primario #127670` | #ffffff | 5,45 | passa |
| Sublinhado da aba ativa | `--primario #127670` | #ffffff | 5,45 | passa |
| Anel de foco | `--primario #127670` | #f2f5f4 | 4,97 | passa |
| Campo com erro (borda) | `--perigo #c43d3d` | #ffffff | 5,14 | passa |
| Ícone do Aviso (círculo) | `--aviso #9a6210` | #fdf6ec | 4,74 | passa |
| Ícone do Aviso (círculo) | `--info #0c6ca3 / --azul` | #eff6fb | 4,40 | passa |

## 5. Cores que nunca são texto (registradas para não voltarem como texto)

| token | sobre branco | onde pode |
|---|---:|---|
| `--aviso-2` | 2,16 | ponto, faixa lateral, barra |
| `--perigo-claro` | 3,22 | início do degradê do ponto |
| `--ok-claro` | 2,14 | início do degradê do ponto |
| `--neutro-ponto` | 1,28 | ponto de "sem declaração" (o rótulo ao lado carrega o sentido) |
| `--texto-desab` | 2,27 | controle desabilitado (isento pela WCAG 1.4.3) |
| `--borda-campo` | 1,26 | borda de campo de texto: o campo é identificado pelo rótulo visível e pelo fundo branco; a WCAG não exige borda em campo de texto |
| `#7c8f8d (cinza antigo)` | 3,40 | nenhum: aparece 7 vezes nas telas como texto e reprova; vira --texto-apagado na migração |

## 6. Sidebar (moldura.css, fora deste trabalho, só medido)

| texto | fundo | razão |
|---|---|---:|
| branco a 0.66, item em repouso --sb-texto | #093d44 | 6,11 |
| branco a 0.66, item em repouso --sb-texto | #0a4650 | 5,53 |
| branco a 0.58, grupo (.mo-grupo) | #093d44 | 5,12 |
| branco a 0.58, grupo (.mo-grupo) | #0a4650 | 4,63 |
| branco a 0.6, subitem | #093d44 | 5,32 |
| branco a 0.6, subitem | #0a4650 | 4,86 |
