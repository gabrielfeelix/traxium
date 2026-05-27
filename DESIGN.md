# Traxium · Design System

Documento de referência para o design system do Traxium SaaS. Todas as decisões visuais e de interação seguem o que está descrito aqui. Quando houver dúvida entre o que está no código e o que está aqui, este documento prevalece e o código deve ser ajustado.

---

## 1. Princípios

1. **Clareza acima de estética.** O usuário gestor está olhando para um motor de risco regulatório. Cada tela responde rapidamente a duas perguntas: o que está acontecendo agora e o que exige ação imediata.
2. **Densidade calibrada.** O back-office é informacional. Tabelas, KPIs e listas têm densidade alta, mas com hierarquia tipográfica e espaçamento que evitam ruído.
3. **Sinal regulatório nunca ambíguo.** Status críticos (bloqueio, NC crítica, certificação vencida) usam cor, ícone e rótulo simultaneamente. Nunca dependem só de cor.
4. **Trust pelo dado, não pela decoração.** O sistema mostra origens de validação, timestamps, autores. Gradientes e animações são reservados para reforçar confiança em momentos-chave.
5. **Distintivo, não genérico.** Nenhuma tela deve parecer "qualquer outro SaaS". Tipografia ajustada, espaçamento ousado, micro-detalhes (números proporcionais, sombras coloridas, micro-gradientes).

---

## 2. Paleta

### 2.1 Marca

| Token | HSL | Hex aprox. | Uso |
| --- | --- | --- | --- |
| `brand-500` | `174 78% 32%` | `#127670` | Verde-azulado primário. Botões, links, indicadores. |
| `brand-600` | `176 84% 25%` | `#0C5862` | Hover/pressed estado primário. |
| `brand-700` | `180 80% 18%` | `#093D44` | Textos sobre fundo claro, ênfase máxima da marca. |
| `sky-500` | `200 90% 36%` | `#0E78B5` | Azul de apoio. CTAs secundários, indicadores. |
| `sky-600` | `202 92% 30%` | `#0A638F` | Hover do azul. |

### 2.2 Funcionais

| Token | HSL | Uso |
| --- | --- | --- |
| `success-500` | `142 71% 36%` | Aprovação, conformidade, regime A. |
| `warning-500` | `28 92% 48%` | Atenção, regime C, certificação a vencer, risco médio/alto. |
| `danger-500` | `0 78% 50%` | Bloqueio, NC crítica, regime D, risco crítico. |

### 2.3 Surface

| Token | HSL | Uso |
| --- | --- | --- |
| `bg` | `180 14% 97%` | Fundo principal. Não branco puro — leve toque verde-azulado. |
| `bg-elev` | `0 0% 100%` | Cards e elementos elevados. |
| `fg` | `200 25% 12%` | Texto primário. |
| `fg-muted` | `210 14% 42%` | Texto secundário. |
| `border` | `200 18% 88%` | Bordas. |
| `ink` | `195 30% 8%` | Sidebar escura. |

### 2.4 Gradiente da marca

```css
linear-gradient(135deg, hsl(176 84% 25%) 0%, hsl(180 80% 18%) 50%, hsl(200 92% 24%) 100%)
```

Uso restrito: logo, banners hero, CTAs primários, ícones de identidade.

---

## 3. Tipografia

- **Família principal:** Geist Sans
- **Família monoespaçada:** Geist Mono — para códigos de viagem, CAR, HS Codes, DDS, hashes
- **Letter-spacing global:** `-0.005em` (otimização sutil de leitura)
- **Números:** sempre `font-variant-numeric: tabular-nums` (classe `.num`)

### 3.1 Escala

| Token | Tamanho | Peso | Uso |
| --- | --- | --- | --- |
| Display | 28–34px | 700 | Hero KPIs, números grandes. Tracking `-0.02em`. |
| H1 | 22–26px | 700 | Título de página. Tracking `-0.015em`. |
| H2 | 15px | 600 | Card title. Tracking `-0.01em`. |
| Body | 13px | 400/500 | Texto padrão. |
| Small | 12px | 400/500 | Descriptions, labels. |
| Micro | 10–11px | 600/700 | Uppercase labels, badges, kbd. Tracking `0.12em–0.14em`. |

### 3.2 Regras

- Títulos sempre alinhados à esquerda.
- Códigos técnicos (DDS, viagem, CAR) em monoespaçada para reforçar legibilidade.
- Nunca usar mais de 3 níveis hierárquicos em uma página.
- Uppercase labels sempre com tracking acima de 0.1em.

---

## 4. Espaçamento e grid

Base 4px. Container principal `max-w-screen-2xl` com `px-6 py-6`.

- Padding interno de card: `px-5 pt-5 pb-3` no header, `px-5 pb-5` no body.
- Gap entre cards em grid de KPI: `gap-4` (16px).
- Gap entre seções dentro de uma página: `gap-5` (20px).
- Sidebar `260px`. Topbar `60px`.

---

## 5. Radius e elevação

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-sm` | 4px | Badges micro. |
| `rounded-md` | 6–8px | Inputs, botões, dropdowns. |
| `rounded-lg` | 12px | Tabs, modais. |
| `rounded-xl` | 16px | Cards. |

Sombras customizadas (brand-tinted):

- `shadow-brand-sm` em cards estáticos
- `shadow-brand-md` em popovers, hover de cards
- `shadow-brand-lg` em modais e elementos hero

Sombras são em HSL azul-acinzentado, nunca preto puro.

---

## 6. Componentes-chave

### 6.1 Botão

Variantes: `default` (verde-azulado), `gradient` (gradiente da marca), `secondary` (azul), `outline`, `ghost`, `destructive`, `link`.

- Altura padrão: 36px (`h-9`).
- Tipografia: 13px peso 500.
- Hover em `gradient`: leve translate-y -1px e shadow-brand-lg.

### 6.2 Card

- Fundo branco, borda `border` (HSL 200 18% 92%), radius `xl`, sombra `brand-sm`.
- Header com `CardTitle` (15px peso 600) e `CardDescription` (12px muted).

### 6.3 Badge

Variantes: `default` (verde-azulado claro), `secondary` (azul claro), `success`, `warning`, `destructive`, `muted`, `outline`, e variantes específicas `regimeA/B/C/D`.

Texto: 11px, peso 600. Padding `px-2 py-0.5`.

### 6.4 Tabela

- Header com `bg-muted` (HSL 200 18% 97%), texto uppercase 10px tracking 0.1em.
- Linha padrão `py-3` (12px+12px). Border bottom HSL 200 18% 94%.
- Hover linha em HSL 174 64% 98%.

### 6.5 Status de viagem

Combina ícone + label + cor. Sempre 3 sinais (não só cor).

### 6.6 KPI card

Estrutura:

1. Label uppercase 10px tracking 0.12em
2. Valor principal 28px peso 700 com `.num`
3. Delta como badge (TrendingUp/Down) com background semântico
4. Sparkline opcional (12 barras)
5. Hint em rodapé 11px muted

---

## 7. Layout

### 7.1 Shell

- Sidebar fixa de 260px à esquerda. Fundo `ink` (HSL 195 30% 8%).
- Topbar de 60px com seletor de tenant (inicial colorido), busca global com atalho ⌘K, Copilot pill, notificações com badge, avatar.
- Conteúdo com `flex-1` em fundo `bg` (HSL 180 14% 97%, levemente azul-acinzentado, não branco puro).

### 7.2 Sidebar

- Logo Traxium light no topo com pill "Compliance"
- Grupos: Operação, Cadastros, EUDR · TRACES NT, Compliance, Sistema
- Item ativo: fundo `white/[0.07]` + barra indicadora à esquerda (gradiente).
- Badges com contagem (NCs em vermelho, contadores normais em branco translúcido).
- Footer: card do tenant ativo com iniciais coloridas + chevron de troca.

---

## 8. Mapas (Leaflet)

- Provider padrão: OpenStreetMap
- Alternativos via control: Esri Satellite, OpenTopoMap, Carto Light
- Polígonos de fazenda: cor por risco EUDR (verde/laranja/vermelho)
- Polígono selecionado: opacity 0.35, weight 3
- Polígonos não-selecionados: opacity 0.18, weight 2
- Polígonos com desmatamento pós-2020: borda dashed
- Marcadores: pin custom SVG colorido por risco
- Filtros CSS sutis no tile pane: saturate(0.85) brightness(1.02)

---

## 9. Iconografia

Biblioteca: `lucide-react`. Stroke 1.75.

| Conceito | Ícone |
| --- | --- |
| Dashboard | `LayoutDashboard` |
| Viagens | `Truck` |
| Frota | `Container` |
| Motoristas | `IdCard` |
| Checklists | `ClipboardCheck` |
| Fazendas | `Trees` |
| Lotes / DDS | `PackageCheck` |
| Gateway TRACES | `Database` |
| Auditoria | `ShieldCheck` |
| NC / Bloqueios | `AlertOctagon` |
| Documentos | `FileText` |
| Atividade | `Activity` |
| Mobile preview | `Smartphone` |
| Configurações | `Settings` |
| Compliance | `BadgeCheck` |
| AI/Motor | `Sparkles` |

---

## 10. Voz e tom

- Português brasileiro, formal-direto. Sem gírias, sem emoji decorativo.
- Termos regulatórios sempre em forma canônica: GMP+ FSA, EUDR, TRACES NT, LCI, DDS, CAR, IDTF, FSMS, tractionair, T-3.
- Datas no formato `dd/MM/yyyy`. Horários `HH:mm`.
- Mensagens de bloqueio sempre incluem causa + ação.

Exemplo de mensagem de bloqueio:

> Carga bloqueada. A última carga registrada para o compartimento PHC-2B17 foi defensivo agrícola líquido em 22/05. A IDTF determina regime D (Desinfecção) antes do carregamento atual. Limpeza correspondente não foi evidenciada.

---

## 11. Padrões de página

Toda página segue:

1. **Page header** — título, descrição, accessory pill, ações primárias à direita.
2. **Stats row** — KPIs ou métricas-chave.
3. **Filtros / abas** — quando aplicável.
4. **Conteúdo principal** — tabela, grid de cards ou mapa.
5. **Conteúdo secundário** — relacionado ou recomendações.

---

## 12. Micro-detalhes que separam o produto de um template

- Sombras coloridas (brand-tinted) em vez de preto puro
- Bordas em HSL 200 (toque azul) em vez de cinza neutro
- Números sempre tabular (.num)
- Uppercase labels com tracking acima de 0.12em
- Gradientes da marca em diagonal 135° (não horizontal)
- Sidebar com grid pattern overlay sutil (opacity 0.025)
- Página fundo levemente verde-azulado (HSL 180 14% 97%) em vez de branco puro
- Pulse-ring animation em estados "atual" (T-3 sequencing)
- Sparklines em KPIs
- Hover de card eleva sombra mas mantém borda
- Botão gradient com hover sutil de translate-y -1px

---

## 13. Estados

Cada componente tem: Default, Hover, Focus (`ring-2 ring-brand-500/18`), Active, Disabled (opacity 50%), Loading (skeleton ou spinner), Empty (ilustração + CTA), Error.

---

## 14. Acessibilidade

- Contraste mínimo 4.5:1 para texto em todos os pares de cor.
- Foco visível em todos os controles interativos.
- Labels associadas a inputs via `htmlFor`.
- Botões só com ícone têm `aria-label`.
- Modais bloqueiam scroll e devolvem foco ao trigger.
- Ícones decorativos têm `aria-hidden`.

---

## 15. Decisões registradas

- **Sem dark mode** nesta primeira versão (foco no ambiente diurno do gestor).
- **Sidebar escura** é proposital: ancoragem visual e contraste com a área de trabalho clara.
- **Multi-tenant** é representado por seletor explícito no topbar, com initials coloridas, não por subdomínio.
- **Mapa real** (Leaflet + OSM + Esri Satellite) substitui SVGs estáticos.
- **Polígonos de fazenda** têm pelo menos 15 vértices para parecer realista.
- **Tipografia** Geist com letter-spacing negativo sutil em títulos.
- **Não usar emojis** decorativos exceto onde regulatoriamente justificado.
