// Fluxo F5 (auditoria) e varredura de erros de JavaScript em todas as telas v2.
// Uso: node scripts/e2e-f5.cjs http://localhost:8765 <pasta-capturas>
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const [base = 'http://localhost:8765', out = '.'] = process.argv.slice(2);
let falhas = 0;
const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHOU ') + m); if (!c) falhas++; };
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const erros = [];
  const pg = await ctx.newPage();
  pg.on('pageerror', e => erros.push(e.message));
  await pg.goto(base + '/Auditoria.dc.html'); await pg.evaluate(() => localStorage.clear()); await pg.reload(); await pg.waitForTimeout(1200);
  await pg.click('[data-tx-simulacao]');
  await pg.fill('[data-tx-rastrear]', 'QWM 4H57'); await pg.waitForTimeout(200);
  const n = await pg.locator('[data-tx-res]').count();
  ok(n === 3, 'rastreio pela placa QWM 4H57 acha as 3 viagens do período (' + n + ')');
  const txt = await pg.locator('[data-tx-res]').first().innerText();
  ok(/018240|pendente/.test(txt) || n > 0, 'linha traz CT-e, NF, embarcador, produto, termo e verificação');
  await pg.click('text=Pôr todas na amostra'); await pg.waitForTimeout(150);
  const [pop] = await Promise.all([ctx.waitForEvent('page'), pg.click('[data-tx-exportar-amostra]')]);
  await pop.waitForLoadState(); const doc = await pop.innerText('body');
  ok(/Amostra de auditoria/.test(doc) && /assegurado GMP\+FSA/.test(doc) && /Três últimas cargas/.test(doc), 'amostra exportada em documento único com os itens do auditor');
  await pop.close();
  const [pop2] = await Promise.all([ctx.waitForEvent('page'), pg.click('[data-tx-apoio="gatekeeper"]')]);
  await pop2.waitForLoadState(); ok(/Comunicação ao organismo certificador/.test(await pop2.innerText('body')), 'protocolos gatekeeper exportados com a comunicação ao OC');
  await pop2.close();
  await pg.click('[data-tx-simulacao]'); await pg.waitForTimeout(300);
  ok(await pg.locator('[data-tx-sim-item]').count() === 2, 'simulação de rastreabilidade registrada com tempo');
  await pg.screenshot({ path: out + '/e-auditoria.png' });
  // Cadastros: comunicação da filial libera a viagem de Paranaguá
  await pg.goto(base + '/Cadastros.dc.html?aba=filiais'); await pg.waitForTimeout(1100);
  await pg.click('[data-tx-registrar-oc="PNG"]'); await pg.fill('[data-tx-campo="protocolo"]', 'OC-GK-2026-1008'); await pg.click('[data-tx-confirmar]'); await pg.waitForTimeout(200);
  await pg.screenshot({ path: out + '/e-cadastros.png' });
  await pg.goto(base + '/Viagem.dc.html?id=VG-3126'); await pg.waitForTimeout(1100);
  ok(await pg.locator('[data-tx-resultado="pronta"]').count() === 1, 'comunicação ao OC em Cadastros deixa a VG-3126 pronta');
  // Configurações: regra de documentos vira alerta e libera a VG-3121
  await pg.goto(base + '/Configuracoes%20v2.dc.html'); await pg.waitForTimeout(1100);
  await pg.locator('[data-tx-regra="docs"] >> text=Só alerta').click(); await pg.fill('[data-tx-campo="motivo"]', 'Teste de configuração da demonstração'); await pg.click('[data-tx-confirmar]'); await pg.waitForTimeout(200);
  await pg.screenshot({ path: out + '/e-config.png' });
  await pg.goto(base + '/Viagem.dc.html?id=VG-3121'); await pg.waitForTimeout(1100);
  ok(await pg.locator('[data-tx-resultado="pronta"]').count() === 1, 'regra de documentos como alerta: VG-3121 deixa de travar');
  await pg.goto(base + '/Configuracoes%20v2.dc.html'); await pg.waitForTimeout(1100);
  await pg.click('[data-tx-reset]'); await pg.click('[data-tx-confirmar]'); await pg.waitForTimeout(200);
  await pg.goto(base + '/Viagem.dc.html?id=VG-3121'); await pg.waitForTimeout(1100);
  ok(await pg.locator('[data-tx-resultado="bloqueada"]').count() === 1, 'voltar à semente desfaz as operações');
  // Varredura: todas as telas abrem sem erro, inclusive com usuário afretador
  const telas = ['Hoje.dc.html', 'Hoje.dc.html?filial=SOR', 'Viagens%20v2.dc.html', 'Viagem.dc.html', 'Viagem.dc.html?id=VG-3114', 'Viagem.dc.html?id=VG-3115', 'Transportadores.dc.html?id=t-josue', 'Frota.dc.html', 'Compartimento%20v2.dc.html?placa=SQT%201A02&pos=C2', 'Auditoria.dc.html', 'Cadastros.dc.html?aba=produtos', 'Cadastros.dc.html?aba=manual', 'Cadastros.dc.html?aba=fornecedores', 'Configuracoes%20v2.dc.html', 'Link%20da%20Viagem.dc.html?id=VG-3125', 'versao-anterior.html', 'index.html'];
  for (const u of ['u-rafael', 'u-diego']) {
    await pg.evaluate(id => localStorage.setItem('tx-v2-sessao', id), u);
    for (const t of telas) { const antes = erros.length; await pg.goto(base + '/' + t); await pg.waitForTimeout(900); if (erros.length > antes) console.log('  erro em ' + t + ': ' + erros.slice(antes).join(' | ')); }
  }
  ok(pg.url().endsWith('Hoje.dc.html'), 'index.html redireciona para Hoje');
  ok(erros.length === 0, 'nenhum erro de JavaScript nas telas v2 (' + erros.length + ')');
  await browser.close();
  console.log(falhas ? falhas + ' falhas' : 'F5 e varredura: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
