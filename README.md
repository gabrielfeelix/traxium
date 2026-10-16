# Traxium

Protótipo navegável do Traxium: transporte de ração e insumos com GMP+ FSA (viagens, transportadores, frota própria, auditoria e o link do motorista).

Desde 15/10/2026 o app Next.js da raiz é o protótipo v2 com moldura única: sidebar e header desenhados uma vez em `src/app/(painel)/layout.tsx`, e só o conteúdo muda na troca de tela.

```bash
pnpm install
pnpm dev            # http://localhost:3000 (abre /hoje)
./scripts/servir.sh # compila e sobe em http://localhost:8766 para a bateria de testes
```

| Pasta | O que tem |
| --- | --- |
| `src/app/(painel)/` | Rotas das telas do escritório; `layout.tsx` monta a moldura |
| `src/app/link/` | Link da Viagem, a tela do motorista no celular (fora da moldura) |
| `src/components/moldura/` | Sidebar, header, busca global, menu da pessoa, modais do topo e toast |
| `src/telas/` | As dez telas (convertidas do `.dc.html` por `scripts/converter-dc.mjs`) |
| `src/lib/tx/` | Base de dados e motor de decisão (`tx-dados.js`) e utilidades de interface (`tx-ui.js`) |
| `scripts/` | Bateria de testes, captura de tela, conversor |
| `SaaS moderno estilo Dribbble/` | Protótipo `.dc.html` (v1 e v2), congelado como referência; copiado para `public/prototipo/` no build |
| `legado/v1-next/` | O primeiro protótipo em Next.js, guardado |
| `docs/revisao-telas/` | Revisões, decisões e handoff. Comece por `HANDOFF.md` e `09-handoff-sistema-e-ui.md` |
