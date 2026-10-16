// Alvos de clique abaixo de 32 px de altura nas telas do escritório (1366x768).
// Uso: node scripts/conferir-alvos.cjs [base]
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:8766';
const TELAS = ['hoje', 'viagens', 'viagem?id=VG-3122', 'viagem?id=VG-3121', 'transportadores', 'transportadores?id=e-lima', 'transportadores?id=t-joao', 'frota', 'compartimento?placa=RAD%203K20&pos=C1', 'auditoria', 'cadastros?aba=produtos', 'cadastros?aba=manual', 'cadastros?aba=fornecedores', 'cadastros?aba=filiais', 'configuracoes'];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage({ viewport: { width: 1366, height: 1600 } });
  let total = 0;
  for (const t of TELAS) {
    await pg.goto(base + '/' + t); await pg.waitForTimeout(1100);
    const r = await pg.evaluate(() => [...document.querySelectorAll('[data-tela] [role="button"], [data-tela] button, [data-tela] a[href], [data-tela] input, [data-tela] select')]
      .filter(e => e.offsetParent && getComputedStyle(e).visibility !== 'hidden' && e.type !== 'checkbox' && !e.classList.contains('tx-so-leitor'))
      // campo sem borda dentro de uma caixa: o alvo é a caixa
      .filter(e => !(e.tagName === 'INPUT' && getComputedStyle(e).borderTopStyle === 'none'))
      .map(e => { const q = e.getBoundingClientRect(); const extra = e.classList.contains('tx-alvo') ? 16 : 0; return { t: (e.innerText || e.placeholder || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 34).replace(/\n/g, ' '), h: Math.round(q.height) + extra }; })
      .filter(x => x.h < 32));
    const uniq = {}; r.forEach(x => { const k = x.h + ' ' + x.t; uniq[k] = (uniq[k] || 0) + 1; });
    const ks = Object.keys(uniq); total += ks.length;
    console.log(t + ': ' + (ks.length ? ks.map(k => k + (uniq[k] > 1 ? ' (x' + uniq[k] + ')' : '')).join(' | ') : 'ok'));
  }
  await b.close();
  console.log(total ? total + ' alvo(s) abaixo de 32 px' : 'Todos os alvos com 32 px ou mais.');
  process.exit(total ? 1 : 0);
})();
