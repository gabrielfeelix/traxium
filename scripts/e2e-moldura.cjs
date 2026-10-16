// Moldura única: trocar de tela não recarrega a página, a sidebar guarda o estado, só o conteúdo rola,
// cada tela tem endereço próprio, o voltar do navegador funciona e o Link da Viagem fica fora da moldura.
// Uso: node scripts/e2e-moldura.cjs http://localhost:8766 <pasta-capturas>
const { chromium } = require('/mnt/d/solar-buy-side-v2/node_modules/playwright-core');
const [base = 'http://localhost:8766', out = '.'] = process.argv.slice(2);
const exe = process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
let falhas = 0;
const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHOU ') + m); if (!c) falhas++; };
(async () => {
  const browser = await chromium.launch({ executablePath: exe });
  const pg = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const erros = [];
  pg.on('pageerror', e => erros.push(e.message));
  const marcar = () => pg.evaluate(() => { window.__semRecarregar = true; document.querySelector('[data-tx-sidebar]').dataset.marca = 'mesma'; });
  const mesmaPagina = () => pg.evaluate(() => window.__semRecarregar === true && document.querySelector('[data-tx-sidebar]').dataset.marca === 'mesma');
  const titulo = () => pg.evaluate(() => { const t = [...document.querySelectorAll('[data-tela] div')].find(d => getComputedStyle(d).fontSize === '24px'); return t ? t.innerText : ''; });

  await pg.goto(base + '/hoje'); await pg.evaluate(() => localStorage.clear()); await pg.reload(); await pg.waitForTimeout(1200);
  await marcar();

  // 1. trocar de tela pela sidebar não recarrega e não troca a sidebar
  await pg.click('[data-tx-sidebar] a[title="Viagens"]'); await pg.waitForURL(/\/viagens$/); await pg.waitForTimeout(900);
  ok(await mesmaPagina(), 'Hoje para Viagens sem recarregar a página nem redesenhar a sidebar');
  ok(await titulo() === 'Viagens', 'Viagens aparece no conteúdo');
  ok((await pg.getAttribute('a[title="Viagens"]', 'aria-current')) === 'page', 'item Viagens aceso');

  // 2. estado da sidebar: recolhida continua recolhida na tela seguinte
  await pg.click('[data-tx-sidebar] button[title="Recolher ou expandir o menu"]'); await pg.waitForTimeout(400);
  await pg.click('[data-tx-sidebar] a[title="Frota própria"]'); await pg.waitForURL(/\/frota$/); await pg.waitForTimeout(700);
  ok(await pg.evaluate(() => document.querySelector('[data-tx-sidebar]').getBoundingClientRect().width) === 84 && await mesmaPagina(), 'sidebar recolhida continua recolhida em Frota, sem recarregar');
  await pg.click('[data-tx-sidebar] button[title="Recolher ou expandir o menu"]'); await pg.waitForTimeout(400);
  // acordeão de Cadastros fechado continua fechado
  await pg.click('[data-tx-sidebar] button[title="Cadastros"]'); await pg.waitForTimeout(200);
  await pg.click('[data-tx-sidebar] a[title="Auditoria"]'); await pg.waitForURL(/\/auditoria$/); await pg.waitForTimeout(700);
  ok(await pg.locator('[data-tx-sub]').count() === 0, 'acordeão de Cadastros fechado continua fechado em Auditoria');
  await pg.click('[data-tx-sidebar] button[title="Cadastros"]'); await pg.waitForTimeout(200);

  // 3. só o conteúdo rola; a sidebar fica parada
  await pg.goto(base + '/viagens'); await pg.waitForTimeout(1200);
  const rol = await pg.evaluate(() => {
    const c = document.querySelector('[data-tx-conteudo]');
    const sb = document.querySelector('[data-tx-sidebar]');
    const antes = sb.getBoundingClientRect().top, hd = document.querySelector('[data-tx-header]').getBoundingClientRect().top;
    c.scrollTop = 600;
    return { pagina: document.scrollingElement.scrollHeight - innerHeight, conteudo: c.scrollTop, sb: sb.getBoundingClientRect().top - antes, hd: document.querySelector('[data-tx-header]').getBoundingClientRect().top - hd };
  });
  ok(rol.pagina <= 0, 'a página em si não rola (' + rol.pagina + ' px de sobra)');
  ok(rol.conteudo > 0 && rol.sb === 0 && rol.hd === 0, 'o conteúdo rola e sidebar e header ficam parados');
  await pg.screenshot({ path: out + '/moldura-rolada.png' });

  // 4. endereço próprio, voltar do navegador e link copiado
  await marcar();
  await pg.click('[data-tx-sidebar] a[title="Transportadores"]'); await pg.waitForURL(/\/transportadores$/); await pg.waitForTimeout(800);
  await pg.goBack(); await pg.waitForURL(/\/viagens$/); await pg.waitForTimeout(900);
  ok(await titulo() === 'Viagens' && await mesmaPagina(), 'voltar do navegador volta a Viagens sem recarregar');
  await pg.goForward(); await pg.waitForURL(/\/transportadores$/); await pg.waitForTimeout(900);
  ok(await titulo() === 'Transportadores', 'avançar do navegador volta a Transportadores');
  await pg.goto(base + '/viagem?id=VG-3121'); await pg.waitForTimeout(1300);
  ok(/OC 48125|VG-3121/.test(await pg.innerText('[data-tela="Viagem"]')), 'link direto abre a viagem pedida (VG-3121)');
  ok((await pg.getAttribute('a[title="Viagens"]', 'aria-current')) === 'page', 'na Viagem, o item Viagens fica aceso e continua link');

  // 5. mesma rota com outro parâmetro (busca global): a tela troca de viagem
  await marcar();
  const antes = await pg.innerText('[data-tela="Viagem"]');
  await pg.fill('[data-tx-gbusca]', 'VG-3122'); await pg.keyboard.press('Enter'); await pg.waitForURL(/id=VG-3122/); await pg.waitForTimeout(1200);
  const depois = await pg.innerText('[data-tela="Viagem"]');
  ok(depois !== antes && /VG-3122/.test(depois) && await mesmaPagina(), 'busca global troca de viagem na mesma rota, sem recarregar');
  ok(await pg.inputValue('[data-tx-gbusca]') === '', 'a busca global se limpa ao trocar de tela');

  // 6. subitem de Cadastros troca a seção
  await pg.goto(base + '/cadastros?aba=produtos'); await pg.waitForTimeout(1200); await marcar();
  await pg.click('[data-tx-sub="filiais"]'); await pg.waitForURL(/aba=filiais/); await pg.waitForTimeout(900);
  ok(await titulo() === 'Filiais' && (await pg.getAttribute('[data-tx-sub="filiais"]', 'aria-current')) === 'page' && await mesmaPagina(), 'subitem Filiais troca a seção e acende, sem recarregar');

  // 7. toast da tela sai na moldura; Entrar como, aberto pela tela, troca a pessoa
  await pg.goto(base + '/frota'); await pg.waitForTimeout(1200);
  await pg.click('[data-tx-avatar]'); await pg.click('text=Entrar como'); await pg.waitForTimeout(200);
  ok(await pg.locator('[role="dialog"]').count() === 1, 'menu da pessoa abre Entrar como');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);
  ok(await pg.locator('[role="dialog"]').count() === 0 && await pg.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-tx-avatar')), 'Esc fecha o diálogo e o foco volta ao avatar');
  await pg.click('[data-tx-avatar]'); await pg.click('text=Entrar como'); await pg.click('[data-tx-usuario="u-diego"]'); await pg.waitForTimeout(300);
  ok(/Diego Saldanha/.test(await pg.innerText('[data-tx-header]')) && /Diego Saldanha/.test(await pg.innerText('[data-tx-toast]')), 'Entrar como troca a pessoa no header e avisa no toast');

  // 7b. teclado: clicável de tela abre com Enter, foco fica no diálogo, Esc fecha e devolve o foco
  await pg.goto(base + '/frota'); await pg.waitForTimeout(1200);
  const gatilho = pg.locator('[data-tx-escopo]').first();
  await gatilho.focus(); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
  ok(await pg.locator('[data-tela="Frota"] [role="dialog"]').count() === 1, 'Enter num clicável da tela abre o modal');
  ok(await pg.evaluate(() => !!document.activeElement.closest('[role="dialog"]')), 'o foco entra no modal');
  for (let i = 0; i < 8; i++) await pg.keyboard.press('Tab');
  ok(await pg.evaluate(() => !!document.activeElement.closest('[role="dialog"]')), 'Tab circula só dentro do modal');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(250);
  ok(await pg.locator('[data-tela="Frota"] [role="dialog"]').count() === 0 && await pg.evaluate(() => document.activeElement.hasAttribute('data-tx-escopo')), 'Esc fecha e o foco volta ao botão que abriu');
  await pg.focus('[data-tx-gbusca]');
  ok(await pg.evaluate(() => getComputedStyle(document.querySelector('.mo-busca-campo')).borderColor) === 'rgb(18, 118, 112)', 'campo em foco acende a caixa');

  // 8. tela baixa: a sidebar rola por dentro e o rodapé não some
  await pg.setViewportSize({ width: 1366, height: 560 }); await pg.waitForTimeout(300);
  const baixa = await pg.evaluate(() => {
    const c = document.querySelector('.mo-sb-cartao');
    return { pagina: document.scrollingElement.scrollHeight - innerHeight, rola: c.scrollHeight > c.clientHeight };
  });
  ok(baixa.pagina <= 0, 'a 560 px de altura a página não sobra rolagem (' + baixa.pagina + ' px)');
  await pg.evaluate(() => { const c = document.querySelector('.mo-sb-cartao'); c.scrollTop = c.scrollHeight; });
  const rec = await pg.locator('button[title="Recolher ou expandir o menu"]').boundingBox();
  ok(rec && rec.y + rec.height <= 560, 'a 560 px, Recolher menu fica alcançável rolando a sidebar');
  await pg.screenshot({ path: out + '/moldura-560.png' });

  // 9. Link da Viagem fora da moldura
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.goto(base + '/link?id=VG-3122'); await pg.waitForTimeout(1200);
  ok(await pg.locator('[data-tx-sidebar]').count() === 0 && await pg.locator('[data-tx-header]').count() === 0 && /Farelo de soja/.test(await pg.innerText('body')), 'Link da Viagem abre fora da moldura');

  ok(erros.length === 0, 'sem erro de JavaScript (' + erros.join(' | ') + ')');
  await browser.close();
  console.log(falhas ? falhas + ' falha(s)' : 'Moldura: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
