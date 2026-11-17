# Guia de migração para o design system

Versão de 17/11/2026. Este arquivo é o contrato entre quem migra as telas (`src/telas/*.jsx`) e o design system (`src/components/ui`, `src/components/ui/ui.css`, tokens em `src/app/globals.css`). A referência visual viva é `/design-system`. A evidência de cada valor está em `docs/ds/inventario.md`; os contrastes, em `docs/ds/contraste.md`.

Objetivo: trocar estilo inline por componente ou classe, sem mudar o desenho. As únicas mudanças visíveis previstas estão na seção 9.

## 0. Regras do contrato

1. **Não editar** `src/app/globals.css`, `src/components/ui/**`, `src/app/design-system/**`, `DESIGN.md`. Faltou variante, token ou classe: anote em `docs/ds/pendencias.md` (crie se não existir) com tela, linha e o que precisava, e use a saída provisória da seção 8. Não invente classe nova dentro da tela.
2. **Componente primeiro.** Em .jsx pode importar os componentes React: `import { Botao, Campo, Entrada, Situacao } from '@/components/ui';`. Quando o JSX é gerado por um `map` de valores de `renderVals` e trocar por componente exigiria reescrever a lógica, use as classes `tx-` direto no elemento: é igualmente aceito.
3. **O que pode ficar em `style={{}}`:** só layout da tela, e com token quando for medida de espaço:
   - `display`, `flex`, `flexDirection`, `flexWrap`, `flex: 'none'`, `alignItems`, `alignSelf`, `justifyContent`, `gridTemplateColumns` (fora da Tabela), `gridColumn`, `order`;
   - `gap`, `margin*`, `padding*` **só com** `var(--esp-*)`;
   - `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight` (medida de layout da tela, em px ou %);
   - `lineHeight` **só com** `var(--lh-*)` (parágrafo: `var(--lh-paragrafo)`);
   - `position`, `inset`, `top/right/bottom/left`, `overflow*`, `textAlign`, `whiteSpace`, `textOverflow`, `wordBreak`, `scrollMarginTop`;
   - a variável `--tx-colunas` da Tabela;
   - valor que muda em tempo de execução e não tem classe (largura de barra de progresso `width: pct + '%'`, cor de avatar `g1/g2` da pessoa).
   
   **Nunca** em `style`: `color`, `background`, `border*`, `borderRadius`, `boxShadow`, `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing`, `cursor`, `transition`, `animation`, `zIndex`, `outline`. Se aparecer um desses, é classe, componente ou token (seção 2).
4. **Elemento certo.** `<span role="button" tabIndex={0}>` vira `<button type="button">` (via `Botao`, `Chip`, ou a classe no `<button>`). Link interno continua `<A href>` ou `Botao href`.
5. **Atributos de teste ficam.** Todo `data-tx-*` (`data-tx-confirmar`, `data-tx-modal`, `data-tx-campo`, `data-tx-visao`...) passa para o novo elemento; `Botao`, `Modal`, `Drawer`, `TabelaLinha`, `Chip` repassam atributos extras. Se `scripts/e2e-ui.cjs` seleciona por `[role="button"]`, atualize o seletor para `button` ou `getByRole('button')` na mesma etapa.
6. **Estado por atributo, não por estilo calculado.** O valor que hoje vem de `renderVals` como cor (`ctaBg`, `c`, `bd`, `fw`) vira booleano (`ok`, `ativa`, `on`) e o componente decide o desenho. Os campos antigos podem ficar em `renderVals` até a tela terminar; apague-os quando nada mais os usar.
7. **Ao terminar uma tela:** `npx prettier --write src/telas/<Tela>.jsx --print-width 140 --single-quote`; `npx tsc --noEmit`; captura antes e depois em 1366x768 (`TX_BASE=http://localhost:3000 node scripts/capturar.cjs ...`); conferência da seção 10.

## 1. Imports

```jsx
// .jsx de tela
import { TX, Tela, A, css } from '@/lib/tx/tela';
import {
  Botao, Campo, Entrada, AreaTexto, Selecao, CampoData, EntradaCaixa, Checkbox, Switch, Chip, Escolhas, OpcaoCartao,
  Situacao, Badge, Aviso, Abas, Tabela, TabelaCabecalho, TabelaLinha, TabelaEsqueleto, TabelaRodape, Celula, Paginacao,
  Cartao, Linha, CabecalhoPagina, EstadoVazio, Modal, Drawer, Toast, textoFalta, listaFalta,
} from '@/components/ui';
```

`@/components/ui/formulario` continua exportando `Campo`, `Escolhas` e `listaFalta` (são os mesmos). No código novo, importe de `@/components/ui`.

## 2. Troca de valor por token (quando o valor fica em layout ou em caso não coberto)

### 2.1 Espaço (gap, margin, padding)

| px | token | | px | token |
| --- | --- | --- | --- | --- |
| 2 | `var(--esp-0-5)` | | 16 | `var(--esp-4)` |
| 3, 4, 5 | `var(--esp-1)` | | 18, 20 | `var(--esp-5)` |
| 6 | `var(--esp-1-5)` | | 22, 24 | `var(--esp-6)` |
| 7, 8, 9 | `var(--esp-2)` | | 26, 28 | `var(--esp-7)` |
| 10, 11 | `var(--esp-2-5)` | | 30, 32 | `var(--esp-8)` |
| 12, 13, 14 | `var(--esp-3)` | | 36, 40 | `var(--esp-10)` |
| 15 | `var(--esp-4)` | | 44, 48 | `var(--esp-12)` |

Regra do 9: vira `--esp-2` (8), salvo quando os vizinhos do mesmo grupo usam 10, aí `--esp-2-5`. Padding composto troca cada parte: `'16px 20px'` vira `'var(--esp-4) var(--esp-5)'`.

### 2.2 Texto

| antes | depois |
| --- | --- |
| `fontSize: '11px', fontWeight: '800', letterSpacing: '.7px'` (ou `.8px`), caixa alta | `className="tx-tipo-rotulo"` |
| `fontSize: '12px'` | `className="tx-tipo-legenda"` (peso 600 embutido; outro peso com `tx-peso-*`) |
| `fontSize: '13px'` | `className="tx-tipo-denso"` |
| `fontSize: '14px'` | `className="tx-tipo-corpo"` |
| `fontSize: '16px', fontWeight: '800'` | `className="tx-tipo-titulo"` (ou `Cartao titulo`, `Modal titulo`) |
| `fontSize: '20px', fontWeight: '800'` | `className="tx-tipo-destaque"` (já tem tabular-nums) |
| `fontSize: '24px', fontWeight: '800'` | `CabecalhoPagina` ou `className="tx-tipo-pagina"` |
| `fontSize: '32px'` / `'40px'` (painel de Hoje) | `fontSize: 'var(--fs-painel)'` / `'var(--fs-painel-g)'` com `className="num"` |
| `fontVariantNumeric: 'tabular-nums'` | `className="num"` |
| `fontFamily: "'Spline Sans Mono',monospace"` | `className="tx-mono"` |
| `color: 'var(--texto-sec)'` | `className="tx-sec"` |
| `color: 'var(--texto-apagado)'` ou `'#7c8f8d'` | `className="tx-apagado"` |
| `lineHeight: '1.5'` a `'1.6'` em parágrafo | `lineHeight: 'var(--lh-paragrafo)'` (é layout de texto; aceito em style) |

Peso: as classes `tx-tipo-*` trazem o peso do passo (rótulo 800, legenda 600, denso e corpo 400, título, destaque e página 800). Outro peso: junte `tx-peso-400`, `tx-peso-600`, `tx-peso-700` ou `tx-peso-800` depois da classe de tipo (`className="tx-tipo-denso tx-peso-700"`). `fontWeight: '500'` vira `tx-peso-600`. Sem classe de tipo (o tamanho vem do pai), use só `tx-peso-*`.

### 2.3 Cor solta para token

| solto | token |
| --- | --- |
| `#fff` como fundo | `var(--painel)` |
| `#fff` como texto sobre a marca | `var(--texto-inverso)` |
| `rgba(255,255,255,.75)` texto sobre a marca | `var(--texto-inverso-2)` |
| `#127670` | `var(--primario)` |
| `#0C5862`, `#0c5862` | `var(--primario-2)` |
| `#0b2224` | `var(--texto)` |
| `#7c8f8d` | `var(--texto-apagado)` |
| `#c43d3d` | `var(--perigo)` |
| `#48c78e` | `var(--ok-claro)` |
| `#f4c15d` | `var(--aviso-claro)` |
| `#e46969` | `var(--perigo-claro)` (preenchimento) ou `var(--perigo-cta)` (início do botão) |
| `#5b8def` | `var(--info-claro)` |
| `#7d2232` | `var(--tecnico-escuro)` |
| `#b85a2e` | `var(--autoridade)` |
| `#d97544` | `var(--autoridade-2)` |
| `#f0d3bf` | `var(--autoridade-borda)` |
| `#ebc3c8` | `var(--tecnico-borda)` |
| `#dde5e3` | `var(--neutro-ponto)` |
| `#cfe3e1` | `var(--primario-borda)` |
| `#cfe3ee` | `var(--info-borda)` |
| `#e4ebe9` | `var(--superficie-3)` |
| `#f6f9f8` | `var(--superficie-hover)` |
| `#f7faf9`, `#fafcfb`, `#fbfdfc`, `#f7f9f8` | `var(--superficie)` |
| `#f0f4f3`, `#eef4f2` | `var(--superficie-2)` |
| `#f3faf8` | `var(--primario-fraco)` |
| `#fdf8f8`, `#fdf1f1` | `var(--perigo-fundo)` |
| `#fdf6ec`, `#fdf3e2` | `var(--aviso-fundo)` |
| `#e7f1ec` | `var(--ok-fundo)` |
| `#e2e9e7`, `#e8eef0`, `#dfeaea` | `var(--borda)` |
| `#d9e5e3`, `#d8e4e2` | `var(--borda-forte)` |
| `#b8c6c4`, `#b9c9c6` (borda de controle) | `var(--borda-controle)` |
| `rgba(9,34,36,.45)` | `var(--veu)` (ou use `Modal`/`Drawer`) |
| `var(--azul)` como **cor de texto** | `var(--info)` |

Ficam como estão (ilustração, não interface): cores do desenho do caminhão e da placa Mercosul (`#2f5d73`, `#33657c`, `#8b6f4e`, `#957857`, `#f1d55a`, `#e3c235`, `#5b4b05`, `#e88a5f`, `#d06a3c` e afins), e o HTML de `TX.ui.exportarDocumento`, que abre em outra aba sem os tokens.

### 2.4 Raio, sombra, camada, duração

| antes | depois |
| --- | --- |
| `borderRadius: '99px'` | `var(--raio-pilula)` |
| `'3px'`, `'4px'`, `'5px'` | `var(--raio-xxs)` |
| `'6px'` | `var(--raio-xs)` |
| `'7px'`, `'8px'`, `'9px'` | `var(--raio-p)` |
| `'10px'`, `'11px'`, `'12px'`, `'13px'` | `var(--raio-m)` |
| `'14px'`, `'15px'`, `'16px'` | `var(--raio-g)` |
| `'18px'`, `'20px'`, `'22px'` | `var(--raio-xg)` |
| `'24px'` | `var(--raio-xxg)` |
| `'0 2px 10px rgba(9,61,68,.04)'`, `'0 1px 2px rgba(0,0,0,.08)'` | `var(--sombra-xs)` |
| `'0 12px 30px rgba(9,61,68,.09)'`, `'0 14px 30px rgba(9,61,68,.14)'` | `var(--sombra-p)` |
| `'0 16px 40px rgba(9,61,68,.14/.16/.18/.22)'` | `var(--sombra-m)` |
| `'0 18px 44px rgba(9,61,68,.22)'` | `var(--sombra-g)` |
| `'0 40px 100px rgba(9,34,36,.4)'` | `var(--sombra-xg)` |
| `'-30px 0 80px rgba(9,34,36,.35)'` | `var(--sombra-drawer)` |
| `'0 16px 40px rgba(9,34,36,.35)'` | `var(--sombra-toast)` |
| `'0 8px 18px rgba(18,118,112,.35)'` | `var(--sombra-cta)` |
| `'0 6px 14px rgba(18,118,112,.25/.28/.3)'` | `var(--sombra-cta-p)` |
| `'0 8px 18px rgba(196,61,61,.3)'` | `var(--sombra-perigo)` |
| `zIndex: '1000'` | `var(--z-modal)` (ou `Modal`) |
| `zIndex: '900'` | `var(--z-drawer)` (ou `Drawer`) |
| `zIndex: '60'`, `'50'` | `var(--z-pop)` |
| `zIndex: '80'` | `var(--z-menu)` |
| `zIndex: '5'` | `var(--z-fixo)` |
| `.15s` / `.2s`, `.25s` / `.3s`, `.4s` | `var(--dur-rapida)` / `var(--dur-media)` / `var(--dur-lenta)` |
| `'txsh 1.3s linear infinite'` | classe `tx-esqueleto` |

Raio, sombra, camada e duração **não ficam em style** (regra 0.3): se o elemento não é um componente, anote em pendências e, provisoriamente, use o token em style.

## 3. Botões

### 3.1 Primário com `TX.ui.cta` e o padrão "Falta:"

Antes (Viagem, `ctaOf`):

```jsx
<span role="button" tabIndex={0} onClick={v.confirmarDevolver} data-tx-confirmar=""
  style={{ background: v.ctaBg, color: v.ctaC, boxShadow: v.ctaSh, cursor: v.ctaCur, fontSize: '14px', fontWeight: '800', borderRadius: '99px', padding: '10px 22px' }}>
  Devolver ao motorista
</span>
```

Depois:

```jsx
<Botao variante="primario" inativo={!v.ctaOk} onClick={v.confirmarDevolver} data-tx-confirmar="">
  Devolver ao motorista
</Botao>
```

Em `renderVals`, `ctaOf` passa a devolver também `ctaOk: ok`. **Não** use `desabilitado`: o clique no primário inativo precisa chegar ao `onClick`, que chama `levarAoQueFalta()` / `focarFalta`.

Sem componente (classe direto, quando o botão vem de um map): `className={c.cls} aria-disabled={c.ariaDisabled}` onde `c = U.cta(ok)`.

### 3.2 Secundário

Antes: `<span role="button" ... style={{ background: 'var(--superficie-2)', fontSize: '14px', fontWeight: '700', borderRadius: '99px', padding: '10px 20px', cursor: 'pointer' }} className="tx-hcab3cde">Cancelar</span>`

Depois: `<Botao onClick={v.fecharModal}>Cancelar</Botao>` (variante padrão é `secundario`).

Também vira secundário: `.mo-botao` e o hover `.tx-h5a3ff2f` / `.tx-hcab3cde`.

### 3.3 Contorno (ação de cabeçalho: Exportar planilha, Filtros, Todas as filiais)

Antes: `style={{ background: 'var(--painel)', border: '1px solid var(--borda-campo)', borderRadius: '11px', padding: '9px 15px', fontSize: '14px', fontWeight: '700', ... }} className="tx-h30bbaa9"` com svg dentro.

Depois: `<Botao variante="contorno" icone={<svg .../>} onClick={v.exportar} data-tx-exportar="" title="Baixa a lista com os filtros da tela">Exportar planilha</Botao>`

Popover que abre com esse botão: o botão ganha `aria-expanded={!!s.filialOpen}` e `aria-haspopup="menu"`.

### 3.4 Perigo

Antes: `U.ctaPerigo(ok)` em style, ou `.mo-botao-perigo`.
Depois: `<Botao variante="perigo" inativo={!ok} onClick={...}>Cancelar viagem</Botao>`.

### 3.5 Pequeno (lista, linha, cartão)

Antes: `fontSize: '13px', fontWeight: '700', borderRadius: '99px', padding: '6px 14px'` (ou `7px 15px` com `boxShadow: '0 6px 14px rgba(18,118,112,.3)'`).
Depois: `<Botao tamanho="p">Ver</Botao>` ou `<Botao variante="primario" tamanho="p">Resolver</Botao>`.

### 3.6 Ação em texto (Ver todos, Abrir a mesa, Conciliar CT-e em lote)

Antes: `<span role="button" className="tx-acao-texto">` ou `<A ... style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primario-2)' }} className="tx-h76d8d79">`.
Depois: `<Botao variante="texto" href="/viagens">Ver todas</Botao>` (link) ou `<Botao variante="texto" onClick={...}>`. A classe `.tx-acao-texto` continua valendo e é o mesmo desenho.

### 3.7 Só ícone (fechar, remover)

Antes: `<span role="button" aria-label="Fechar" title="Fechar" tabIndex={0} onClick={v.fecharModal} style={{ marginLeft: 'auto', width: '32px', height: '32px', borderRadius: '99px', background: 'var(--superficie-2)', ... }}>✕</span>`
Depois: `<Botao variante="icone" aria-label="Fechar" onClick={v.fecharModal} icone={IconeFechar} />` (`IconeFechar` vem de `@/components/ui`). Dentro de `Modal`/`Drawer` o fechar já vem pronto com `aoFechar`.

## 4. Formulário

### 4.1 Rótulo e campo

Antes:

```jsx
<div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--texto-2)', marginTop: '12px' }}>Motivo</div>
<textarea value={v.fMotivo} onChange={v.onMotivo} data-tx-campo="motivo"
  style={{ width: '100%', marginTop: '6px', border: '1px solid var(--borda-campo)', borderRadius: '11px', padding: '10px 12px', fontSize: '14px', resize: 'vertical', outline: 'none' }} />
```

Depois:

```jsx
<Campo id="ocorr-motivo" rotulo="Motivo" campo="motivo" erro={v.erroMotivo} style={{ marginTop: 'var(--esp-3)' }}>
  <AreaTexto value={v.fMotivo} onChange={v.onMotivo} />
</Campo>
```

- `id` único na página: `<modal ou área>-<campo>`.
- `campo` substitui o `data-tx-campo` (o Campo escreve no controle).
- `Entrada` para input; `Entrada mono` quando o estilo tinha `fontFamily: "'Spline Sans Mono'..."` (placa, CPF, RNTRC, número).
- `Selecao` para select. Seta desenhada pela classe; não ponha `appearance` em style.
- Campo dentro de caixa com ícone (`border: none` dentro de uma div com borda): `<EntradaCaixa icone={<svg/>} value=... onChange=... placeholder=... aria-label="Filtrar esta mesa" />`. Sem rótulo visível, `aria-label` é obrigatório.

### 4.2 Data

Antes: `<input value={v.fData} onChange={e => this.setState({ fData: TX.ui.mascaraData(e.target.value) })} placeholder="DD/MM/AAAA" style={{...}} />` e `TX.ui.avisoData(...)` em algum texto.
Depois:

```jsx
<Campo id="nova-data" rotulo="Data do carregamento" erro={v.nTentou1 ? TX.ui.avisoData(s.fData) : ''}>
  <CampoData valor={s.fData || ''} aoMudar={(t) => this.setState({ fData: t })} />
</Campo>
```

`TX.ui.mascaraData`, `dataIso` e `avisoData` continuam; `CampoData` já aplica a máscara.

### 4.3 Chip de opção (rádio)

Já migrado em Hoje: `Escolhas`. Para chip solto: `<Chip selecionado={on} onClick={...}>Granel</Chip>` dentro de `<div role="radiogroup" aria-labelledby=... className="tx-escolhas">`.

### 4.4 Chip de filtro (`TX.ui.chip`)

Antes: `itens.map(x => Object.assign({ n: x, onClick }, U.chip(s.fRisco === x)))` e no render `style={{ background: it.bg, color: it.c, border: '1px solid ' + it.bd, borderRadius: '99px', padding: '6px 14px', fontSize: '13px', fontWeight: '700' }}`.
Depois, no render: `<Chip tipo="filtro" selecionado={it.pressed} onClick={it.onClick}>{it.n}</Chip>`. (`U.chip(on)` agora devolve também `pressed` e `cls`.)

Se o grupo é exclusivo (um só ligado por vez) e escolhe um valor de formulário, é `Escolhas` (rádio), não filtro.

### 4.5 Opção com descrição (`TX.ui.sel`)

Antes: `const sx = U.sel(s.nSel === t.id)` e no render um card com `border: '1.5px solid ' + sx.bd`, `background: sx.bg`, ponto com `sx.dot` e `sx.dotBd`.
Depois:

```jsx
<div role="radiogroup" aria-label="Transportador" style={{ display: 'grid', gap: 'var(--esp-2)' }}>
  {v.nAchados.map((t) => (
    <OpcaoCartao key={t.id} titulo={t.nome} sub={t.placas} selecionado={t.checked} inativo={t.ariaDisabled} onClick={t.onClick} />
  ))}
</div>
```

`U.sel(on, hab)` agora devolve `checked` e `ariaDisabled`. Conteúdo extra (avatar, linha de documento) vai como `children` do `OpcaoCartao`, depois do texto.

### 4.6 Caixa de seleção (Auditoria)

Antes: `<span onClick={r.toggle} style={{ width: '19px', height: '19px', borderRadius: '6px', border: '2px solid ' + r.ckBd, background: r.ck }}>{r.ckI}</span>`
Depois: `<Checkbox rotulo={<span className="tx-so-leitor">Pôr {r.ordem} na amostra</span>} checked={r.on} onChange={r.toggle} />`. Em `renderVals`, devolva `on` em vez de `ck`, `ckBd`, `ckI`. Linha marcada: `TabelaLinha selecionada={r.on}` (substitui `bg: '#f3faf8'`).

### 4.7 Switch

Não existe nas telas hoje. Use `Switch` para preferência que vale na hora (Configurações). Não use dentro de formulário com Salvar.

## 5. Situação, selo e aviso

### 5.1 Situação da decisão

Antes (`tomResultado` espalhado em `dot`, `ring`, `c`):

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '700', color: r?.c }}>
  <span style={{ width: '8px', height: '8px', borderRadius: '99px', background: r?.dot, boxShadow: `0 0 0 3px ${r?.ring ?? ''}`, flex: 'none' }}></span>
  {r?.res}
</div>
<div style={{ fontSize: '12px', color: 'var(--texto-apagado)', marginTop: '2px' }}>{r?.motivo}</div>
```

Depois: em `renderVals`, `tom: U.tomResultado(dec).k`; no render:

```jsx
<Situacao tom={r.tom} detalhe={r.motivo}>{r.res}</Situacao>
```

Forma selo (com borda, 12 px, ponto de 7 px, era `padding: '3px 10px'`, `border: '1px solid ' + t.bd`): `<Situacao tom={r.tom} forma="selo">{r.res}</Situacao>`.

Só o ponto (sem rótulo ao lado, por exemplo na lista da busca): `<span className={'tx-situacao tx-situacao--' + k}><span className="tx-situacao__ponto" aria-hidden /></span>` e o rótulo em outro lugar da mesma linha. Ponto sozinho, sem texto na linha, não é permitido.

Mapa: `ok` pronta; `falta` falta algo; `bloqueio` bloqueada; `tecnico` bloqueio técnico; `autoridade` liberada por autoridade; `na` sem declaração GMP+ e cancelada; `info` em trânsito e qualquer estado informativo.

### 5.2 Selo que não é situação

| antes | depois |
| --- | --- |
| código em pílula: `fontFamily: mono, fontSize: '12px', fontWeight: '600', color: 'var(--primario-2)', border: '1px solid #cfe3e1', borderRadius: '99px', padding: '2px 10px'` | `<Badge tom="marca" mono>OC-24817</Badge>` |
| selo neutro: `fontSize: '12px', fontWeight: '700', color: 'var(--texto-2)', border: '1px solid var(--borda-campo)', borderRadius: '99px', padding: '3px 10px'` | `<Badge>Qualidade</Badge>` |
| selo colorido por estado do convite, do documento (`c` e `bd` vindos de `renderVals`, ex.: Transportadores `['convite enviado', 'var(--azul)', 'var(--info-borda)']`) | `<Badge tom="info">convite enviado</Badge>`; em `renderVals` troque o par de cores pelo tom (`'info'`, `'ok'`, `'aviso'`, `'perigo'`) |
| fundo cinza sem borda (`background: 'var(--superficie-2)', borderRadius: '99px', fontSize: '13px'`) | `<Badge cheio>frota própria</Badge>` |
| contador (`fontFamily: mono, fontSize: '11px', color: 'var(--aviso)', border: '1px solid var(--aviso-borda)', padding: '0 7px'`) | `<Badge tom="aviso" contador>{q}</Badge>` |
| `.mo-papel` | `<Badge tom="marca">Direção</Badge>` |

### 5.3 Caixa tingida (bloqueio, pendência, informação)

Antes: `style={{ background: 'var(--perigo-fundo)', border: '1px solid var(--perigo-borda)', borderRadius: '14px', padding: '12px 16px', fontSize: '13px' }}` com título em `color: 'var(--perigo)'`.
Depois: `<Aviso tom="perigo" titulo="Carga bloqueada." acao={<Botao tamanho="p" variante="primario">Pedir liberação</Botao>}>A última carga ...</Aviso>`.

Tons: `info` (azul), `ok`, `aviso` (âmbar), `perigo`, `tecnico`. Caixa que só alterna fundo de seleção (`revBg: pode ? 'var(--primario-fraco)' : 'var(--perigo-fundo)'`) é `Aviso` com tom calculado (`pode ? 'info' : 'perigo'`).

Faixa lateral de cartão (`boxShadow: 'inset 4px 0 0 var(--aviso-2)'`): mantém em style com o token até existir a variante (anotar em pendências).

## 6. Estrutura

### 6.1 Página e cabeçalho

Antes:

```jsx
<div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '24px 32px 48px', gap: '16px', minWidth: '0' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div>
      <div style={{ fontSize: '24px', fontWeight: '800' }}>Viagens</div>
      <div style={{ fontSize: '14px', color: 'var(--texto-sec)', marginTop: '2px' }}>{v.subtitulo}</div>
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>...ações...</div>
  </div>
```

Depois:

```jsx
<div className="tx-pagina">
  <CabecalhoPagina titulo="Viagens" sub={v.subtitulo} acoes={<>...ações...</>} />
```

O título vira `<h1>`. Uma página tem um `h1` só.

### 6.2 Cartão

Antes: `style={{ background: 'var(--painel)', border: '1px solid var(--borda)', borderRadius: '20px', padding: '20px 24px' }}` e título `fontSize: '16px', fontWeight: '800'` com subtítulo `fontSize: '13px', color: 'var(--texto-sec)'`.
Depois: `<Cartao titulo="Pendências de registro" sub="Viagens asseguradas já carregadas com item faltando." acoes={<Botao variante="texto">Conciliar CT-e em lote</Botao>}>...</Cartao>`.

- Cartão com padding `20px` (sem 24 dos lados): use `Cartao` normal (o 20 vira 20/24). Se o conteúdo encostar, anote.
- Cartão com tabela ou abas dentro (sem padding): `<Cartao lista>`.
- Cartão clicável (`.tx-hbfbd724`, `.tx-hb08bac3`): `<Cartao href="/viagem?id=...">`.
- Cartão escuro do painel de Hoje (degradê, KPI): fica como está nesta rodada, com tokens (`var(--degrade-escuro)`, `var(--raio-xg)`); anotar.

### 6.3 Par rótulo e valor

Antes: `.mo-linha` ou `style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--superficie)', borderRadius: '12px', padding: '10px 14px', fontSize: '13px' }}`.
Depois: `<Linha rotulo="Certificação GMP+"><Situacao tom="ok" forma="selo">Válida até 03/2027</Situacao></Linha>`.

### 6.4 Abas

Antes: `v.abas.map(ab => <div role="button" ... style={{ fontWeight: ab.fw, color: ab.c, borderBottom: '2.5px solid ' + ab.bd, ... }} className="tx-hec6a165">{ab.n}<span style={{ display: ab.qD, ... }}>{ab.q}</span>...</div>)`.
Depois:

```jsx
<Abas rotulo="Visões de viagens" itens={v.abas.map((ab) => ({ k: ab.k, n: ab.n, q: ab.q, ativa: ab.on, onClick: ab.onClick, depois: ab.remover ? <BotaoRemoverVisao ab={ab} /> : null }))} />
```

Em `renderVals`, cada aba devolve `on` (booleano) no lugar de `fw`, `c`, `bd`, `qD`, `qC`, `qBd`. O botão de apagar a visão (o "x" de 18 px) vai em `depois` como `<Botao variante="icone" tamanho="p" aria-label="Apagar esta visão" onClick={...} />` e precisa de `onClick={(e) => { e.stopPropagation(); ab.remover(); }}`.

### 6.5 Tabela (lista em grade)

Antes:

```jsx
<div style={{ display: 'grid', gridTemplateColumns: cols, gap: '16px', padding: '11px 20px', background: 'var(--superficie)', borderBottom: '1px solid var(--borda-suave)', fontSize: '11px', fontWeight: '800', letterSpacing: '.7px', color: 'var(--texto-apagado)' }}>
  <span>CARREGAMENTO</span>...
</div>
{v.linhas.map((r) => (
  <A href={r.href} className="tx-h894fca3" style={{ display: 'grid', gridTemplateColumns: cols, gap: '16px', padding: '12px 20px', borderBottom: '1px solid var(--superficie-2)', alignItems: 'center', color: 'inherit' }}>
    <span style={{ fontSize: '13px', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>{r.hora}</span>
    <span style={{ fontFamily: mono, fontSize: '12px', color: 'var(--primario-2)', fontWeight: '600' }}>{r.ordem}</span>
    <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontSize: '13px', fontWeight: '700' }}>{r.prod}</span><span style={{ fontSize: '12px', color: 'var(--texto-apagado)' }}>{r.rota}</span></span>
    ...
  </A>
))}
```

Depois:

```jsx
<Cartao lista>
  <Tabela colunas={COLS} rotulo="Viagens">
    <TabelaCabecalho><span>Carregamento</span><span>Ordem e CT-e</span>...</TabelaCabecalho>
    {v.loading ? <TabelaEsqueleto linhas={4} /> : v.linhas.map((r) => (
      <TabelaLinha key={r.id} href={r.href}>
        <span className="num tx-peso-700">{r.hora}</span>
        <span className="tx-tabela__codigo">{r.ordem}</span>
        <Celula forte={r.prod} sub={r.rota} />
        ...
        <Situacao tom={r.tom} detalhe={r.motivo}>{r.res}</Situacao>
      </TabelaLinha>
    ))}
    {v.vazio ? <EstadoVazio titulo={v.vazioT}>{v.vazioSub}</EstadoVazio> : null}
    <TabelaRodape><Paginacao pagina={v.pagina} total={v.total} info={v.pagInfo} aoIr={v.irPara} /></TabelaRodape>
  </Tabela>
</Cartao>
```

- O cabeçalho em caixa alta passa a ser escrito em caixa normal (`Carregamento`); a classe põe em caixa alta. Assim o leitor de tela não soletra.
- `COLS` é a mesma string de `gridTemplateColumns` que a tela já usava.
- Linha com clique em vez de link: `TabelaLinha onClick`. Linha marcada: `selecionada`.
- Peso diferente do da linha (13/400): `tx-peso-700` (seção 2.2).

### 6.6 Paginação

Antes: `v.pagInfo`, `v.paginas.map(...)` com `pg.bg/pg.c/pg.bd`, setas com `v.pagAntC`.
Depois: `<Paginacao pagina={v.pagina} total={v.total} info={v.pagInfo} aoIr={v.irPara} />`. `TX.ui.paginar` já devolve `pagina`, `total` e `irPara`.

### 6.7 Estado vazio

Antes: `<div style={{ padding: '48px 20px', textAlign: 'center' }}><div style={{ fontSize: '16px', fontWeight: '800' }}>{v.vazioT}</div><div style={{ fontSize: '13px', color: 'var(--texto-sec)', marginTop: '4px' }}>{v.vazioSub}</div></div>`
Depois: `<EstadoVazio titulo={v.vazioT} acao={v.temFiltro ? <Botao tamanho="p" onClick={v.limpar}>Limpar filtros</Botao> : null}>{v.vazioSub}</EstadoVazio>`.

### 6.8 Esqueleto

Antes: `<div style={{ height: '16px', borderRadius: '99px', background: 'linear-gradient(90deg,var(--borda-suave) 25%,...)', backgroundSize: '600px 100%', animation: 'txsh 1.3s linear infinite' }} />`
Depois: `<span className="tx-esqueleto" />` (largura por style, se precisar: `style={{ width: '60%' }}`) ou `<TabelaEsqueleto linhas={n} />`.

## 7. Sobreposição

### 7.1 Modal com rodapé "Falta:"

Antes (Viagens, Viagem, Hoje, Cadastros, Configurações, Frota, Transportadores):

```jsx
{v.modalAberto ? (
  <div onClick={v.fecharModal} style={{ position: 'fixed', inset: '0', background: 'rgba(9,34,36,.45)', backdropFilter: 'blur(3px)', zIndex: '1000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
    <div role="dialog" aria-modal="true" onClick={v.pararClique} data-tx-modal="conciliar" style={{ background: 'var(--painel)', borderRadius: '24px', width: '760px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 40px 100px rgba(9,34,36,.4)', padding: '28px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '800' }}>Conciliar CT-e e NF em lote</div>
        <span role="button" aria-label="Fechar" ...>✕</span>
      </div>
      ...campos...
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {v.mFalta ? <span className="tx-falta" aria-live="polite">{v.mFalta}</span> : null}
        <span role="button" ...>Cancelar</span>
        <span role="button" ... style={{ background: v.ctaBg, ... }}>Conciliar</span>
      </div>
    </div>
  </div>
) : null}
```

Depois:

```jsx
{v.modalAberto ? (
  <Modal
    id="conciliar"
    data-tx-modal="conciliar"
    tamanho="xg"
    titulo="Conciliar CT-e e NF em lote"
    sub="..."
    extra={<Badge tom="marca" mono>{v.ordem}</Badge>}
    aoFechar={v.fecharModal}
    falta={v.mFalta}
    acoes={<>
      <Botao onClick={v.fecharModal}>Cancelar</Botao>
      <Botao variante="primario" inativo={!v.ctaOk} onClick={v.confirmar} data-tx-confirmar="">Conciliar</Botao>
    </>}
  >
    ...campos (Campo, Escolhas)...
  </Modal>
) : null}
```

- Largura: `440px` ou menos: `tamanho="p"`; `520` a `540`: padrão; `580` a `620`: `"g"`; `700` a `760`: `"xg"`.
- O corpo do modal já tem `gap` de 16 entre filhos: tire os `marginTop: '12px'`/`'16px'` dos blocos diretos.
- `pararClique` deixa de ser necessário: o `Modal` só fecha quando o clique é no véu.
- `v.mFalta` continua vindo de `ctaOf` (texto "Falta: ..."); para montar novo, `textoFalta(['tipo', 'motivo'])`.
- Modais da moldura (`.mo-veu`, `.mo-modal`) ficam com quem mexe na moldura.

### 7.2 Drawer

Antes (Transportadores, Frota): véu `rgba(9,34,36,.45)` + painel 560 px com `animation: 'deslizar .3s ease'` e cabeçalho `linear-gradient(130deg,var(--primario-3),var(--primario-2) 55%,var(--azul) 130%)`.
Depois:

```jsx
<Drawer id="transp" data-tx-drawer="" titulo={v.dNome} sub={v.dSub} avatar={v.dIni} aoFechar={v.fecharDrawer} rodape={<>...</>}>
  <Linha rotulo="Certificação GMP+">...</Linha>
  ...
</Drawer>
```

O corpo é uma grade com gap 8; seções com título dentro do drawer usam `<h3 className="tx-tipo-titulo">`.

### 7.3 Toast

Nas telas, continua `TX.ui.avisar(this, 'texto')`: a moldura desenha. `Toast` só para tela fora da moldura (Link do motorista): `{s.toast ? <Toast>{s.toast}</Toast> : null}`.

## 8. Hovers gerados (`.tx-h...`) e casos não cobertos

Cada classe de `src/telas/estados.css` some quando o elemento vira componente:

| classe | vira |
| --- | --- |
| `.tx-h0882f37` (sobe 1 px) | `Botao variante="primario"` ou `"perigo"` |
| `.tx-hcab3cde`, `.tx-h5a3ff2f` | `Botao` (secundário) |
| `.tx-h30bbaa9` | `Botao variante="contorno"` |
| `.tx-h76d8d79` | `Botao variante="texto"` |
| `.tx-h894fca3`, `.tx-hc05ca3a` | `TabelaLinha` (href ou onClick) |
| `.tx-hec6a165` | `Abas` |
| `.tx-hbfbd724`, `.tx-hb08bac3` | `Cartao href` |
| `.tx-ha5daa28`, `.tx-h39963fb` | `Botao variante="icone"` de remover (anotar se precisar de hover vermelho) |
| `.tx-hb24e7a4` | `Botao variante="contorno"` de ação destrutiva leve; anotar em pendências |
| `.tx-hae10539`, `.tx-h0e7da8b`, `.tx-h681b28c`, `.tx-h53feea5`, `.tx-hd5eb93c` | botões sobre fundo escuro (painel de Hoje, drawer, Compartimento): anotar em pendências; manter a classe por enquanto |
| `.tx-h6eff871`, `.tx-haf27d80` | hover de item de lista; anotar |

Saída provisória para o que não tem componente: manter o elemento com o estilo trocado por **tokens** (seção 2), sem hex nem px de cor, raio ou sombra, e registrar em `docs/ds/pendencias.md`:

```
| tela | linha | padrão | proposta |
| Hoje | 412 | botão claro sobre o painel escuro (.tx-hae10539) | Botao variante "inverso" |
```

## 9. Mudanças visíveis previstas (aceitas)

| O quê | Antes | Depois | Por quê |
| --- | --- | --- | --- |
| Altura de botão e campo | 38 a 39 px (padding 9 ou 10) | 40 px (`--controle-m`) | grade de 4 |
| Padding lateral do primário | 22 px | 20 px | grade de 4 |
| Chip de rádio | 30 px de altura | 32 px | alvo mínimo |
| Página da paginação | 30x30, raio 9 | 32x32, raio 8 | alvo mínimo |
| Raio do campo e do botão de contorno | 11 px | 12 px | escala de raios |
| Botão de perigo | degradê de `#e46969` | degradê de `#cf4444` | contraste 4,6:1 |
| Texto "Liberada por autoridade" | `#b85a2e` | `#a5502a` | contraste na superfície |
| Texto azul (Em trânsito, convite enviado) | `--azul` | `--info` `#0c6ca3` | contraste na superfície |
| Caixa de seleção | borda `#c9d5d3`, 19 px | borda `#7f9290`, 20 px | contraste 3:1 do controle |
| Cabeçalho de tabela | 11px 20px | 10px 20px | grade |
| Cinza `#7c8f8d` | 3,40:1 | `--texto-apagado` | contraste |

Qualquer outra diferença na captura de antes e depois é erro de migração.

## 10. Conferência por tela

```bash
F=src/telas/Viagens.jsx
# nada de cor, raio, sombra, fonte em style (deve dar 0 ou só os casos anotados em pendências)
grep -nE "(color|background|border[A-Za-z]*|borderRadius|boxShadow|fontSize|fontFamily|letterSpacing|cursor|zIndex|outline|transition|animation)\s*:" $F | grep -v "var(--" | wc -l
# hex solto
grep -nE "#[0-9a-fA-F]{3,6}\b" $F | wc -l
# span com role de botão
grep -n 'role="button"' $F | wc -l
# hovers gerados
grep -nE "tx-h[0-9a-f]{7}" $F | wc -l
npx tsc --noEmit
TX_BASE=http://localhost:3000 node scripts/capturar.cjs /tmp/claude-1000/<tela>-depois.png <rota> 1366 768 1
```

Os quatro números devem cair a zero (ou ao que está em pendências). As capturas de antes e depois devem diferir só pelo que está na seção 9.
