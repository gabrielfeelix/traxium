import { defineConfig } from "vitest/config";
import path from "node:path";

// Testes só do domínio (`src/lib/`): funções puras, sem React, sem DOM.
// É onde uma regra errada libera carga contaminada — o resto do app é
// verificado rodando a aplicação.
export default defineConfig({
  test: { environment: "node", include: ["src/lib/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
