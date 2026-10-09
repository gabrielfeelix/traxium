// Fluxo F1 de ponta a ponta no navegador: mesa (Hoje) + link do motorista em outra aba + conferência.
// Uso: node scripts/e2e-f1.cjs http://localhost:8765 <pasta-capturas>
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const [base = 'http://localhost:8765', out = '.'] = process.argv.slice(2);
const exe = process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
let falhas = 0;
const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHOU ') + m); if (!c) falhas++; };
(async () => {
  const browser = await chromium.launch({ executablePath: exe });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const erros = [];
  ctx.on('page', p => p.on('pageerror', e => erros.push(e.message)));
  const mesa = await ctx.newPage();
  mesa.on('pageerror', e => erros.push(e.message));
  await mesa.goto(base + '/Hoje.dc.html');
  await mesa.evaluate(() => { localStorage.clear(); localStorage.setItem('tx-v2-sessao', 'u-diego'); });
  await mesa.reload(); await mesa.waitForTimeout(1500);
  const linha = mesa.locator('[data-tx-linha="VG-3122"]');
  ok(await linha.count() === 1, 'mesa de Sorriso mostra a VG-3122');
  ok(/link não enviado/.test(await linha.innerText()), 'VG-3122 começa com link não enviado');
  await linha.locator('[data-tx-acao-linha="link"]').click(); await mesa.waitForTimeout(300);
  ok(/link enviado/.test(await linha.innerText()), 'afretador enviou o link pela mesa');
  await mesa.screenshot({ path: out + '/c-mesa-1.png' });

  const cel = await ctx.newPage();
  await cel.setViewportSize({ width: 400, height: 860 });
  await cel.goto(base + '/Link%20da%20Viagem.dc.html?id=VG-3122'); await cel.waitForTimeout(1500);
  await cel.screenshot({ path: out + '/c-link-capa.png' });
  await mesa.waitForTimeout(400);
  ok(/aberto pelo motorista/.test(await linha.innerText()), 'mesa vê o link aberto (outra aba)');
  const av = () => cel.locator('[data-tx-avancar]').click();
  await av(); await cel.waitForTimeout(200);
  await cel.fill('[data-tx-campo="cpf"]', '633'); await av(); await cel.waitForTimeout(200);
  // três últimas cargas
  const datas = ['2026-10-04', '2026-09-28', '2026-09-20'], prods = ['soja', 'casquinha', 'adubo'];
  for (const key of ['RCB 9M16#C1']) for (let i = 0; i < 3; i++) {
    await cel.fill(`[data-tx-t3-data="${key}-${i}"]`, datas[i]);
    await cel.fill(`[data-tx-t3-produto="${key}-${i}"]`, prods[i]);
  }
  await cel.waitForTimeout(200);
  await cel.screenshot({ path: out + '/c-link-t3.png', fullPage: true });
  await av(); await cel.waitForTimeout(300);
  await mesa.waitForTimeout(300);
  ok(/em preenchimento/.test(await linha.innerText()), 'mesa vê o motorista em preenchimento');
  for (const k of ['lona', 'correntes', 'cintas', 'carroceria', 'interior']) { await cel.click(`[data-tx-sim="${k}"]`); await cel.click(`[data-tx-foto-ck="${k}"]`); }
  await cel.screenshot({ path: out + '/c-link-check.png', fullPage: true });
  await av(); await cel.waitForTimeout(200);
  for (let i = 0; i < 5; i++) { await av(); await cel.waitForTimeout(120); }
  await cel.screenshot({ path: out + '/c-link-termo.png' });
  const box = await cel.locator('[data-tx-assinatura]').boundingBox();
  await cel.mouse.move(box.x + 30, box.y + 90); await cel.mouse.down();
  for (let i = 0; i < 30; i++) await cel.mouse.move(box.x + 30 + i * 9, box.y + 90 + Math.sin(i / 2) * 25);
  await cel.mouse.up();
  await av(); await cel.waitForTimeout(400);
  await cel.screenshot({ path: out + '/c-link-fim.png' });
  ok(/Enviado à filial/.test(await cel.innerText('body')), 'motorista termina o link');
  await mesa.bringToFront(); await mesa.waitForTimeout(400);
  ok(/enviado pelo motorista/.test(await linha.innerText()), 'mesa vê o link concluído');
  ok(await linha.locator('[data-tx-acao-linha="conferir"]').count() === 1, 'mesa pede a conferência das fotos');
  await mesa.screenshot({ path: out + '/c-mesa-2.png' });
  await linha.locator('[data-tx-acao-linha="conferir"]').click(); await mesa.waitForTimeout(1600);
  ok(mesa.url().includes('Viagem.dc.html?id=VG-3122'), 'conferir abre a viagem');
  await mesa.click('[data-tx-aprovar]'); await mesa.waitForTimeout(400);
  ok(await mesa.locator('[data-tx-resultado="pronta"]').count() === 1, 'após aprovar, a viagem fica pronta para assegurar');
  ok(await mesa.locator('[data-tx-declaracao]').count() === 1, 'declaração do CT-e liberada');
  await mesa.screenshot({ path: out + '/c-viagem-pronta.png' });

  // Nova viagem com TAC novo, a partir do PDF da ordem
  await mesa.goto(base + '/Hoje.dc.html'); await mesa.waitForTimeout(1200);
  await mesa.click('[data-tx-nova-viagem]'); await mesa.click('[data-tx-ordem-exemplo]'); await mesa.waitForTimeout(150);
  await mesa.click('[data-tx-confirmar]');
  await mesa.fill('[data-tx-campo="quem"]', 'RZZ 1A11'); await mesa.waitForTimeout(150);
  await mesa.fill('[data-tx-campo="cm-nome"]', 'Teodoro Lins'); await mesa.fill('[data-tx-campo="cm-tel"]', '(66) 99100-2030'); await mesa.fill('[data-tx-campo="cm-placas"]', 'RZZ1A11, RZZ1A12');
  await mesa.screenshot({ path: out + '/c-nova.png' });
  await mesa.click('[data-tx-confirmar]'); await mesa.waitForTimeout(200);
  ok(/criada para Teodoro Lins/.test(await mesa.innerText('body')), 'nova viagem criada com cadastro mínimo');
  await mesa.click('[data-tx-confirmar]'); await mesa.waitForTimeout(300);
  ok(await mesa.locator('[data-tx-linha="VG-3131"]').count() === 1, 'VG-3131 aparece na mesa com link enviado');
  ok(erros.length === 0, 'sem erro de JavaScript (' + erros.join(' | ') + ')');
  await browser.close();
  console.log(falhas ? falhas + ' falhas' : 'F1 de ponta a ponta: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
