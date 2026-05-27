# Traxium · Protótipo SaaS de Compliance Agrologística

Protótipo navegável da plataforma Traxium para benchmarking e validação. Cobre o back-office web completo (gestores de transportadora) e preview do app mobile do motorista.

## Stack

- **Next.js 16 (App Router)** com Turbopack
- **TypeScript** estrito
- **Tailwind CSS v4**
- **shadcn/ui** (Radix UI primitives) — montado localmente
- **Recharts** para gráficos
- **Lucide React** para iconografia
- **Geist Sans + Geist Mono** (fontes)

## Rodando localmente

```bash
pnpm install
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para começar pelo login: [http://localhost:3000/login](http://localhost:3000/login).

## Roteiro sugerido para benchmarking

1. `/login` — tela de entrada com pitch da marca.
2. `/` — Dashboard operacional. Banner de auditoria, KPIs, charts de conformidade, viagens em destaque, NCs abertas, risco EUDR.
3. `/viagens` — Lista completa com filtros.
4. `/viagens/v-002` — Detalhe de viagem **bloqueada** mostrando o sequenciamento T-3 e o motor de regras IDTF.
5. `/viagens/v-001` — Detalhe de viagem em trânsito com rastreio.
6. `/checklists` — Templates LCI, base IDTF e execuções recentes.
7. `/bloqueios` — Não conformidades classificadas por severidade.
8. `/frota` — Cavalos e carretas com certificação GMP+.
9. `/motoristas` — Próprios, agregados, subcontratados. Letramento digital declarado.
10. `/fazendas` — Polígonos EUDR, validação cruzada INPE/MapBiomas/CAR.
11. `/lotes` — Lotes de exportação e pipeline DDS.
12. `/traces` — Gateway TRACES NT (SOAP/WS-Security), logs, schemas, webhooks.
13. `/auditoria` — Auditorias programadas e plano de preparação.
14. `/conformidade` — Score consolidado, ranking de motoristas, recomendações.
15. `/documentos` — Repositório de certificados, políticas, DDS.
16. `/atividade` — Timeline de eventos do sistema.
17. `/configuracoes` — Organização, equipe, integrações, API, faturamento.
18. `/mobile` — **Preview interativo do app do motorista** com 6 telas navegáveis.

## Design system

Consulte [DESIGN.md](./DESIGN.md) para a documentação completa de cores, tipografia, componentes, espaçamento, iconografia e padrões.

Paleta: verde-azulado `#1FA89F` + azul `#0E78B5` + branco. Sidebar escura `#1A2942`.

## Estrutura do código

```
src/
├── app/
│   ├── (app)/              # Rotas autenticadas com shell (sidebar + topbar)
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Dashboard
│   │   └── [módulos]/
│   └── (auth)/             # Rotas públicas
│       └── login/
├── components/
│   ├── ui/                 # Primitivos shadcn-style
│   ├── shell/              # Sidebar, Topbar, PageHeader, KPICard, StatusBadge
│   └── logo.tsx
└── lib/
    ├── utils.ts            # cn(), formatters
    └── mock-data.ts        # Dados de domínio (viagens, motoristas, etc)
```

## Decisões importantes do protótipo

- Sem backend real. Todos os dados vêm de `src/lib/mock-data.ts` e podem ser editados livremente para gerar variações.
- O multi-tenant é representado por um seletor no topbar; troca de tenant é local, não persistida.
- Mapas usam SVG inline em vez de Leaflet/Mapbox para evitar dependência de tile servers no protótipo. A próxima iteração troca por mapa real.
- App mobile é simulado em um phone frame dentro da rota `/mobile`. A entrega real é um app React Native ou PWA.
- Toda a UI é client-side por simplicidade do protótipo.

## Próximas evoluções planejadas

1. Backend Supabase ou Postgres + Row Level Security para multi-tenant real
2. Mapa Leaflet com tiles do MapBox e camadas vetoriais EUDR
3. Mock real do gateway TRACES NT (SOAP fake server)
4. App mobile React Native ou PWA com IndexedDB para offline
5. Motor de regras T-3 como serviço separado (rules engine)
6. Pesquisa com motoristas de Rondonópolis para validar a UX mobile
