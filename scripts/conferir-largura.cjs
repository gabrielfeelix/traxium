// Confere, em 1366x768, se alguma tela estoura para os lados ou quebra rótulos de botão em duas linhas.
// Uso: node scripts/conferir-largura.cjs [base]
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:8766';
const TELAS = ['hoje', 'hoje?filial=SOR', 'viagens', 'viagem?id=VG-3122', 'viagem?id=VG-3121', 'transportadores', 'transportadores?id=e-lima', 'frota', 'compartimento?placa=RAD%203K20&pos=C1', 'auditoria', 'cadastros?aba=produtos', 'cadastros?aba=manual', 'cadastros?aba=fornecedores', 'cadastros?aba=filiais', 'configuracoes'];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage({ viewport: { width: 1366, height: 768 } });
  let probs = 0;
  for (const t of TELAS) {
    await pg.goto(base + '/' + t); await pg.waitForTimeout(1100);
    const r = await pg.evaluate(() => {
      const c = document.querySelector('[data-tx-conteudo]');
      const sobra = c.scrollWidth - c.clientWidth;
      // botão (role=button ou button) de uma linha que quebrou: altura maior que 1,8 linha
      const quebrados = [...document.querySelectorAll('[data-tela] [role="button"], [data-tela] button')].filter(e => {
        if (!e.offsetParent) return false;
        const txt = (e.innerText || '').trim();
        if (!txt || txt.length > 40 || txt.includes('\n')) return false;
        // linhas de texto de verdade: topos distintos dos retângulos do texto
        const r = document.createRange(); r.selectNodeContents(e);
        const tops = [...r.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top));
        const lh = parseFloat(getComputedStyle(e).fontSize);
        return tops.some(t => t - Math.min(...tops) > lh * 0.9);
      }).map(e => e.innerText.trim());
      return { sobra, quebrados };
    });
    const ruim = r.sobra > 0 || r.quebrados.length;
    if (ruim) probs++;
    console.log((ruim ? 'ATENÇÃO ' : 'ok      ') + t + (r.sobra > 0 ? ' estoura ' + r.sobra + ' px' : '') + (r.quebrados.length ? ' quebra: ' + r.quebrados.join(' | ') : ''));
  }
  await b.close();
  process.exit(probs ? 1 : 0);
})();
