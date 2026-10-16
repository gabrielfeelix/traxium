// Revisão de UI e UX tela a tela (09-handoff-sistema-e-ui.md, Parte 3): formulários, estados, alvos e teclado.
// Uso: node scripts/e2e-ui.cjs http://localhost:8766 <pasta-capturas>
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
  const ir = async (rota, espera = 1100) => { await pg.goto(base + '/' + rota); await pg.waitForTimeout(espera); };
  const texto = sel => pg.locator(sel).innerText();
  await ir('hoje', 300); await pg.evaluate(() => localStorage.clear());

  // ---------------------------------------------------------------- Hoje
  await ir('hoje');
  // Nova viagem: o botão apagado diz o que falta, mostra o erro junto do campo e leva até ele
  await pg.click('[data-tx-nova-viagem]'); await pg.waitForTimeout(250);
  const rodape = () => pg.locator('[role="dialog"]').innerText();
  ok(/Falta: produto, ordem, embarcador e destinatário\./.test(await rodape()), 'Nova viagem: rodapé lista só o que falta');
  await pg.locator('[role="dialog"] [role="button"]', { hasText: /^Continuar$/ }).click(); await pg.waitForTimeout(200);
  ok(await pg.locator('[role="dialog"] .tx-erro').count() === 4, 'Nova viagem: Continuar sem preencher mostra 4 erros junto dos campos');
  ok(await pg.evaluate(() => document.activeElement.id === 'nv-produto'), 'Nova viagem: o foco vai para o primeiro campo que falta');
  ok((await pg.getAttribute('#nv-produto', 'aria-invalid')) === 'true' && (await pg.getAttribute('label[for="nv-produto"]', 'for')) === 'nv-produto', 'Nova viagem: rótulo ligado ao campo, campo marcado inválido');
  await pg.fill('[data-tx-campo="janela"]', '2599'); await pg.waitForTimeout(100);
  ok(await pg.inputValue('[data-tx-campo="janela"]') === '25:99' && /Horário inválido/.test(await rodape()), 'Nova viagem: horário com máscara e erro de faixa (25:99)');
  await pg.fill('[data-tx-campo="janela"]', '1830');
  ok(await pg.inputValue('[data-tx-campo="janela"]') === '18:30', 'Nova viagem: 1830 vira 18:30');
  await pg.click('[data-tx-grupo="nv-emb"] button >> nth=0');
  ok((await pg.getAttribute('[data-tx-grupo="nv-emb"] button >> nth=0', 'aria-checked')) === 'true' && !/Escolha o embarcador/.test(await rodape()), 'Nova viagem: escolha marcada como rádio e o erro some');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);

  // Vencimentos: "Ver todos" abre a lista inteira em Hoje, inclusive fornecedor
  const vt = pg.locator('[data-tx-venc-todos]');
  if (await vt.count()) {
    await vt.click(); await pg.waitForTimeout(150);
    ok(await pg.locator('a[href^="/cadastros?aba=fornecedores&id="]').count() >= 1, 'Vencimentos: Ver todos mostra o vencimento de fornecedor, com link para ele');
  } else ok(false, 'Vencimentos: botão Ver todos existe');
  // ação em texto com alvo de 32 px
  const alvo = await pg.locator('.tx-acao-texto').first().boundingBox();
  ok(alvo && alvo.height >= 32, 'ações em texto têm alvo de pelo menos 32 px (' + (alvo && Math.round(alvo.height)) + ')');
  await pg.screenshot({ path: out + '/ui-hoje.png' });

  // Hoje: PDF da ordem que não é PDF diz o porquê
  await pg.click('[data-tx-nova-viagem]'); await pg.waitForTimeout(250);
  await pg.setInputFiles('input[type="file"][accept=".pdf"]', { name: 'ordem.docx', mimeType: 'application/octet-stream', buffer: Buffer.from('x') });
  await pg.waitForTimeout(150);
  ok(/"ordem\.docx" não é PDF/.test(await texto('[data-tx-arquivo-erro]')), 'Nova viagem: arquivo que não é PDF mostra o erro junto da área de envio');
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(150);

  // ---------------------------------------------------------------- Viagens
  await ir('viagens');
  ok(!!(await pg.getAttribute('[data-tx-busca]', 'aria-label')), 'Viagens: busca da lista tem nome acessível');
  ok((await pg.evaluate(() => getComputedStyle(document.querySelector('[data-tx-linha]')).cursor)) === 'pointer' && (await pg.locator('a[data-tx-linha]').count()) > 0, 'Viagens: a linha inteira é link para a viagem');
  await ir('viagens?visao=sem_cte&conciliar=1', 1300);
  await pg.setInputFiles('[data-tx-modal="conciliar"] input[type="file"]', { name: 'cte.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
  await pg.waitForTimeout(150);
  ok(/"cte\.pdf" não é planilha nem XML de CT-e/.test(await texto('[data-tx-arquivo-erro]')), 'Conciliar: formato errado explica o que enviar');
  ok((await pg.getAttribute('[data-tx-modal="conciliar"] [aria-label="Fechar"]', 'role')) === 'button', 'Conciliar: o ✕ tem nome (Fechar)');
  await pg.focus('[data-tx-modal="conciliar"] input[type="file"]');
  ok(await pg.evaluate(() => document.activeElement.type === 'file'), 'Conciliar: o seletor de arquivo é alcançável pelo teclado');
  await pg.screenshot({ path: out + '/ui-viagens-conciliar.png' });

  ok(erros.length === 0, 'sem erro de JavaScript (' + erros.join(' | ') + ')');
  await browser.close();
  console.log(falhas ? falhas + ' falha(s)' : 'Revisão de UI: tudo certo');
  process.exit(falhas ? 1 : 0);
})();
