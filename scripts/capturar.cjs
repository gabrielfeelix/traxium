// Captura de tela com Playwright para conferir uma tela antes e depois de mudar.
// Uso: node scripts/capturar.cjs <saida.png> <caminho> [largura] [altura] [pagina-inteira 1|0] [js-antes-da-captura]
// Ex.: node scripts/capturar.cjs /tmp/viagens.png "viagens?visao=sem_cte" 1366 768 0
// Servidor: pnpm build && pnpm start -p 8766 (ou TX_BASE=http://localhost:3000 com pnpm dev).
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
(async () => {
  const [out, rel, w = '1366', h = '768', full = '0', js = ''] = process.argv.slice(2);
  if (!out || rel == null) { console.log('uso: node scripts/capturar.cjs <saida.png> <tela> [largura] [altura] [1|0] [js]'); process.exit(1); }
  const base = process.env.TX_BASE || 'http://localhost:8766';
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  p.on('console', m => { if (m.type() === 'error') erros.push('console: ' + m.text()); });
  p.on('response', r => { if (r.status() >= 400) erros.push(r.status() + ' ' + r.url()); });
  await p.goto(base + '/' + rel); await p.waitForTimeout(1200);
  if (js) { await p.evaluate(js); await p.waitForTimeout(600); }
  if (full === '1') {
    // Só o conteúdo rola: para a página inteira, solta a altura da moldura antes de capturar.
    await p.addStyleTag({ content: '.mo{height:auto!important;overflow:visible!important}.mo-conteudo{overflow:visible!important}.mo-sb{position:sticky;top:0;height:100vh!important}' });
    await p.waitForTimeout(200);
  }
  await p.screenshot({ path: out, fullPage: full === '1' });
  await b.close();
  if (erros.length) { console.log('ERROS DE JAVASCRIPT', erros); process.exit(1); }
})();
