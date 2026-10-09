// Varre o texto renderizado das telas v2 (e de modais abertos) atrás de travessão, ponto médio e valores vazados.
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:8765';
const RUIM = [/—/, /·/, /\bundefined\b/, /\bNaN\b/, /\bnull\b/, /\[object Object\]/, /\{\{/];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  let n = 0;
  const conferir = async (rot) => { const t = await pg.evaluate(() => document.getElementById('dc-root') ? document.getElementById('dc-root').innerText : document.body.innerText); for (const r of RUIM) { const m = t.match(new RegExp('.{0,40}' + r.source + '.{0,40}')); if (m) { n++; console.log('  ' + rot + ': ' + JSON.stringify(m[0])); } } };
  const telas = ['Hoje.dc.html', 'Hoje.dc.html?filial=SOR', 'Hoje.dc.html?filial=PNG', 'Viagens%20v2.dc.html', 'Transportadores.dc.html?id=e-lima', 'Transportadores.dc.html?id=t-joao', 'Frota.dc.html', 'Compartimento%20v2.dc.html', 'Auditoria.dc.html', 'Cadastros.dc.html?aba=produtos', 'Cadastros.dc.html?aba=manual', 'Cadastros.dc.html?aba=fornecedores', 'Cadastros.dc.html?aba=filiais', 'Configuracoes%20v2.dc.html', 'Link%20da%20Viagem.dc.html?id=VG-3125'];
  for (let i = 3116; i <= 3130; i++) telas.push('Viagem.dc.html?id=VG-' + i);
  ['3101', '3104', '3113', '3114', '3115'].forEach(i => telas.push('Viagem.dc.html?id=VG-' + i));
  await pg.goto(base + '/Hoje.dc.html'); await pg.evaluate(() => localStorage.clear());
  for (const t of telas) { await pg.goto(base + '/' + t); await pg.waitForTimeout(800); await conferir(t); }
  // modais da viagem
  const modais = [['VG-3121', '[data-tx-liberar]'], ['VG-3118', '[data-tx-regularizar]'], ['VG-3118', '[data-tx-trocar]'], ['VG-3120', '[data-tx-devolver]'], ['VG-3122', '[data-tx-mensagem]'], ['VG-3116', '[data-tx-nova-ocorrencia]'], ['VG-3113', 'text=liberada por autoridade']];
  for (const [id, sel] of modais) { await pg.goto(base + '/Viagem.dc.html?id=' + id); await pg.waitForTimeout(800); await pg.locator(sel).first().click(); await pg.waitForTimeout(200); await conferir(id + ' ' + sel); }
  await pg.goto(base + '/Hoje.dc.html?filial=SOR'); await pg.waitForTimeout(800); await pg.click('[data-tx-nova-viagem]'); await conferir('nova viagem');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); await pg.click('[data-tx-avatar]'); await conferir('menu perfil'); await pg.mouse.click(900, 600); await pg.waitForTimeout(150); if (await pg.locator('text=Entrar como').count()) { n++; console.log('  menu do perfil não fechou com clique fora'); }
  console.log(n ? n + ' ocorrência(s)' : 'Texto renderizado limpo em ' + (telas.length + modais.length + 2) + ' estados.');
  await b.close(); process.exit(n ? 1 : 0);
})();
