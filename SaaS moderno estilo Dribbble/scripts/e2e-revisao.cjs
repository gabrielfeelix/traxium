// Fluxos da rodada de revisão do v2 (07-revisao-v2.md) no navegador.
// Uso: node scripts/e2e-revisao.cjs http://localhost:8765 <pasta-capturas>
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const [base = 'http://localhost:8765', out = '.'] = process.argv.slice(2);
let falhas = 0;
const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHOU ') + m); if (!c) falhas++; };
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const erros = [];
  const pg = await ctx.newPage();
  pg.on('pageerror', e => erros.push(e.message));
  const ir = async (tela, espera) => { await pg.goto(base + '/' + tela); await pg.waitForTimeout(espera || 900); };
  const zerar = async () => { await ir('Hoje.dc.html', 300); await pg.evaluate(() => localStorage.clear()); };

  // Cadastros: a sidebar navega; as abas da página só aparecem com a sidebar recolhida
  await zerar();
  await ir('Cadastros.dc.html?aba=produtos');
  ok(await pg.locator('[data-tx-aba]').count() === 0, 'Cadastros: sem abas na página com a sidebar aberta');
  ok((await pg.locator('[data-tx-titulo]').innerText()) === 'Produtos e regimes', 'Cadastros: título diz a seção');
  await pg.evaluate(() => localStorage.setItem('tx-nav', '1')); await ir('Cadastros.dc.html?aba=produtos');
  ok(await pg.locator('[data-tx-aba]').count() === 4, 'Cadastros: abas na página com a sidebar recolhida');
  await pg.evaluate(() => localStorage.setItem('tx-nav', '0')); await ir('Cadastros.dc.html?aba=produtos');

  // Produtos: regime em seletor com contagem; busca sem resultado pede classificação com o termo
  await pg.click('[data-tx-dd="regime"]'); await pg.click('[data-tx-regime="B"]'); await pg.waitForTimeout(200);
  ok(/5 de 30/.test(await pg.innerText('body')), 'Produtos: seletor de regime filtra (5 de 30 com água)');
  await pg.click('[data-tx-dd="regime"]'); await pg.click('[data-tx-regime="todos"]');
  await pg.fill('[data-tx-busca]', 'escória de cobre'); await pg.waitForTimeout(200);
  await pg.click('[data-tx-pedir-da-busca]'); await pg.waitForTimeout(250);
  ok(/já foi pedida/.test(await pg.locator('[data-tx-vazio]').innerText()), 'Produtos: pedido de classificação direto da busca vazia');
  ok(await pg.locator('text="escória de cobre"').count() >= 1, 'Produtos: pedido aparece na lista de pedidos');

  // Fornecedores: vencimento de Hoje abre o fornecedor e o documento se atualiza ali
  await ir('Cadastros.dc.html?aba=fornecedores&id=f-lavarv', 1200);
  ok(await pg.locator('[data-tx-atualizar-doc]').count() === 2, 'Fornecedores: documentos vencendo têm Atualizar (2)');
  await pg.click('[data-tx-atualizar-doc="f-lavarv:Licença ambiental"]');
  await pg.fill('[data-tx-campo="validade"]', '2027-09-30'); await pg.click('[data-tx-confirmar]'); await pg.waitForTimeout(300);
  ok(await pg.locator('[data-tx-atualizar-doc]').count() === 1, 'Fornecedores: documento atualizado sai da lista a resolver');
  ok(/1 documento vence/.test(await pg.innerText('body')), 'Fornecedores: subtítulo recontado');

  // Manual: cartões recolhidos por padrão
  await ir('Cadastros.dc.html?aba=manual');
  const antes = /Antes de carregar/.test(await pg.innerText('body'));
  await pg.click('[data-tx-ver-cartoes]'); await pg.waitForTimeout(150);
  ok(!antes && /Antes de carregar/.test(await pg.innerText('body')), 'Manual: cartões recolhidos abrem com Ver os cartões');
  await pg.screenshot({ path: out + '/revisao-cadastros.png' });

  ok(erros.length === 0, 'sem erro de JavaScript (' + erros.join(' | ') + ')');
  console.log(falhas ? falhas + ' falha(s)' : 'Revisão: tudo certo');
  await browser.close(); process.exit(falhas ? 1 : 0);
})();
