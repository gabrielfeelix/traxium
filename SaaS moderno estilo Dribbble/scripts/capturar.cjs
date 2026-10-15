// Captura de tela com Playwright para conferir uma tela antes e depois de mudar.
// Uso: node scripts/capturar.cjs <saida.png> <caminho-da-tela> [largura] [altura] [pagina-inteira 1|0] [js-antes-da-captura]
// Ex.: node scripts/capturar.cjs /tmp/viagens.png "Viagens%20v2.dc.html?visao=sem_cte" 1366 768 0
// Precisa do servidor de pé: python3 -m http.server 8765 nesta pasta.
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
(async () => {
  const [out, rel, w = '1366', h = '768', full = '0', js = ''] = process.argv.slice(2);
  if (!out || !rel) { console.log('uso: node scripts/capturar.cjs <saida.png> <tela> [largura] [altura] [1|0] [js]'); process.exit(1); }
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.goto('http://localhost:8765/' + rel); await p.waitForTimeout(1200);
  if (js) { await p.evaluate(js); await p.waitForTimeout(600); }
  await p.screenshot({ path: out, fullPage: full === '1' });
  if (erros.length) { console.log('ERROS DE JAVASCRIPT', erros); process.exit(1); }
  await b.close();
})();
