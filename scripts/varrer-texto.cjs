// Varre o texto renderizado das telas v2 (e de modais abertos) atrás de travessão, ponto médio e valores vazados.
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const base = process.argv[2] || 'http://localhost:8766';
const RUIM = [/—/, /·/, /\bundefined\b/, /\bNaN\b/, /\bnull\b/, /\[object Object\]/, /\{\{/];
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  let n = 0;
  const conferir = async (rot) => { const t = await pg.evaluate(() => document.getElementById('dc-root') ? document.getElementById('dc-root').innerText : document.body.innerText); for (const r of RUIM) { const m = t.match(new RegExp('.{0,40}' + r.source + '.{0,40}')); if (m) { n++; console.log('  ' + rot + ': ' + JSON.stringify(m[0])); } } };
  const telas = ['hoje', 'hoje?filial=SOR', 'hoje?filial=PNG', 'viagens', 'transportadores?id=e-lima', 'transportadores?id=t-joao', 'frota', 'compartimento', 'auditoria', 'cadastros?aba=produtos', 'cadastros?aba=manual', 'cadastros?aba=fornecedores', 'cadastros?aba=filiais', 'configuracoes', 'link?id=VG-3125'];
  telas.push('viagens?visao=limpeza', 'viagens?visao=sem_cte', 'viagens?visao=autoridade', 'viagens?visao=ocorrencia',
    'compartimento?placa=RAD%203K20&pos=C1', 'compartimento?placa=SQT%201A02&pos=C2', 'cadastros?aba=produtos&q=escoria', 'cadastros?aba=fornecedores&id=f-lavarv', 'link?id=VG-3122');
  for (let i = 3116; i <= 3130; i++) telas.push('viagem?id=VG-' + i);
  ['3101', '3104', '3113', '3114', '3115'].forEach(i => telas.push('viagem?id=VG-' + i));
  await pg.goto(base + '/hoje'); await pg.evaluate(() => localStorage.clear());
  for (const t of telas) { await pg.goto(base + '/' + t); await pg.waitForTimeout(800); await conferir(t); }
  // modais da viagem
  const modais = [['VG-3121', '[data-tx-liberar]'], ['VG-3118', '[data-tx-regularizar]'], ['VG-3118', '[data-tx-trocar]'], ['VG-3120', '[data-tx-devolver]'], ['VG-3122', '[data-tx-mensagem]'], ['VG-3116', '[data-tx-nova-ocorrencia]'], ['VG-3113', 'text=liberada por autoridade']];
  for (const [id, sel] of modais) { await pg.goto(base + '/viagem?id=' + id); await pg.waitForTimeout(800); await pg.locator(sel).first().click(); await pg.waitForTimeout(200); await conferir(id + ' ' + sel); }
  // Estados abertos por interação: busca global, popovers, modais desta rodada e a fila de Direção
  const extras = [
    ['busca global aberta', 'hoje', async () => { await pg.click('[data-tx-gbusca]'); await pg.keyboard.type('QVT'); }],
    ['busca global sem resultado', 'hoje', async () => { await pg.click('[data-tx-gbusca]'); await pg.keyboard.type('zzqx'); }],
    ['período da Auditoria', 'auditoria', async () => { await pg.click('[data-tx-dd="periodo"]'); }],
    ['regime em Produtos', 'cadastros?aba=produtos', async () => { await pg.click('[data-tx-dd="regime"]'); }],
    ['atualizar documento de fornecedor', 'cadastros?aba=fornecedores', async () => { await pg.locator('[data-tx-atualizar-doc]').first().click(); }],
    ['convite de usuário', 'configuracoes', async () => { await pg.click('[data-tx-convidar]'); }],
    ['Hoje de Direção com todas as filiais', 'hoje?filial=todas', async () => { await pg.evaluate(() => localStorage.setItem('tx-v2-sessao', 'u-luiz')); await pg.reload(); await pg.waitForTimeout(800); }],
    ['Viagem bloqueada vista pelo afretador', 'viagem?id=VG-3127', async () => { await pg.evaluate(() => localStorage.setItem('tx-v2-sessao', 'u-diego')); await pg.reload(); await pg.waitForTimeout(800); }]
  ];
  for (const [rot, tela, fn] of extras) { await pg.goto(base + '/' + tela); await pg.waitForTimeout(800); await fn(); await pg.waitForTimeout(300); await conferir(rot); }
  await pg.evaluate(() => localStorage.setItem('tx-v2-sessao', 'u-rafael'));
  await pg.goto(base + '/hoje?filial=SOR'); await pg.waitForTimeout(800); await pg.click('[data-tx-nova-viagem]'); await conferir('nova viagem');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); await pg.click('[data-tx-avatar]'); await conferir('menu perfil'); await pg.mouse.click(900, 600); await pg.waitForTimeout(150); if (await pg.locator('text=Entrar como').count()) { n++; console.log('  menu do perfil não fechou com clique fora'); }
  console.log(n ? n + ' ocorrência(s)' : 'Texto renderizado limpo em ' + (telas.length + modais.length + extras.length + 2) + ' estados.');
  await b.close(); process.exit(n ? 1 : 0);
})();
