# Protótipo v1 em Next.js (legado)

Movido de `src/` em 15/10/2026, quando o protótipo v2 virou o app Next.js da raiz
(moldura única em `src/app/(painel)/layout.tsx`). Nada foi apagado.

- Não é mais compilado pelo `next build` da raiz (excluído no `tsconfig.json`).
- Os testes de domínio continuam rodando: `pnpm test:legado`.
- Para rodar o app v1 de novo, volte esta pasta para `src/` num checkout à parte
  (o commit anterior à mudança é `6432016`).
