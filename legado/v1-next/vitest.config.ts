import { defineConfig } from "vitest/config";
import path from "node:path";

// Testes só do domínio do protótipo v1 (`legado/v1-next/src/lib/`): funções
// puras, sem React, sem DOM. Rodar da raiz: pnpm test:legado
export default defineConfig({
  test: { environment: "node", include: ["legado/v1-next/src/lib/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
