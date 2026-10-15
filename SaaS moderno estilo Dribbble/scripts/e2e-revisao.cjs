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

  // Configurações: âncora abaixo do header, seção ativa acompanha a rolagem, convite de usuário
  await ir('Configuracoes%20v2.dc.html');
  await pg.click('[data-tx-secao="regras"]'); await pg.waitForTimeout(1200);
  const topo = await pg.evaluate(() => document.getElementById('sec-regras').getBoundingClientRect().top);
  ok(topo >= 80 && topo <= 100, 'Configurações: âncora para logo abaixo do header (' + Math.round(topo) + ' px)');
  const ativa = () => pg.evaluate(() => [...document.querySelectorAll('[data-tx-secao]')].find(e => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)').dataset.txSecao);
  await pg.mouse.wheel(0, 900); await pg.waitForTimeout(500);
  ok(await ativa() !== 'regras', 'Configurações: seção ativa muda com a rolagem (' + await ativa() + ')');
  await pg.click('[data-tx-secao="usuarios"]'); await pg.waitForTimeout(1000);
  await pg.click('[data-tx-convidar]'); await pg.fill('[data-tx-campo="nome"]', 'Joana Freitas'); await pg.fill('[data-tx-campo="email"]', 'diego.saldanha@transrural.com.br');
  await pg.click('[data-tx-papel="afretador"]'); await pg.click('[data-tx-cv-filial="SOR"]'); await pg.waitForTimeout(150);
  ok(/já tem acesso/.test(await pg.locator('[data-tx-modal="convite"]').innerText()), 'Convite: e-mail de quem já tem acesso é recusado');
  await pg.fill('[data-tx-campo="email"]', 'joana.freitas@transrural.com.br'); await pg.click('[data-tx-confirmar]'); await pg.waitForTimeout(250);
  ok(await pg.locator('[data-tx-convite]').count() === 1, 'Convite: aparece na lista de usuários como pendente');
  await pg.click('[data-tx-cancelar-convite]'); await pg.waitForTimeout(200);
  ok(await pg.locator('[data-tx-convite]').count() === 0, 'Convite: cancelado sai da lista');

  // Compartimento: responde se pode carregar ração; quarentena leva à viagem que regulariza
  await ir('Compartimento%20v2.dc.html?placa=RAD%203K20&pos=C1');
  ok(/Não: em quarentena/.test(await pg.locator('[data-tx-pode]').innerText()), 'Compartimento: quarentena responde que não pode carregar ração');
  ok((await pg.getAttribute('[data-tx-regularizar-viagem]', 'href')) === 'Viagem.dc.html?id=VG-3118', 'Compartimento: quarentena leva à viagem travada (VG-3118)');
  ok(/linear-gradient/.test(await pg.getAttribute('a[title="Transportadores"]', 'style')), 'Compartimento de transportador destaca Transportadores na sidebar');
  ok(await pg.locator('[data-tx-carga]').count() === 3 && (await pg.locator('[data-tx-carga]').first().innerText()).startsWith('T-1'), 'Compartimento: linhas do T-3 marcadas');
  await ir('Compartimento%20v2.dc.html?placa=SQT%201A02&pos=C2');
  ok(/Sim, com limpeza seca/.test(await pg.locator('[data-tx-pode]').innerText()), 'Compartimento: frota própria limpa pode carregar com limpeza seca');
  ok(await pg.locator('[data-tx-irmao]').count() === 2 && /linear-gradient/.test(await pg.getAttribute('a[title="Frota própria"]', 'style')), 'Compartimento: seletor do conjunto e Frota própria ativa');

  // Link da Viagem no celular: botão apagado diz o que falta e leva até lá
  const cel = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  cel.on('pageerror', e => erros.push(e.message));
  await cel.goto(base + '/Link%20da%20Viagem.dc.html?id=VG-3122'); await cel.evaluate(() => localStorage.clear()); await cel.reload(); await cel.waitForTimeout(900);
  const bt = () => cel.locator('[data-tx-avancar]').innerText();
  await cel.click('[data-tx-simular-envio]'); await cel.click('[data-tx-avancar]');
  ok(await bt() === 'Digite os 3 números do CPF', 'Link: botão diz o que falta na identidade');
  await cel.fill('[data-tx-campo="cpf"]', '633'); await cel.click('[data-tx-avancar]'); await cel.waitForTimeout(200);
  ok(await bt() === 'Faltam 3 cargas', 'Link: T-3 vazio diz quantas cargas faltam');
  const dd = await cel.$$('[data-tx-t3-data]'), pp = await cel.$$('[data-tx-t3-produto]');
  await dd[0].fill('2026-10-09'); await pp[0].fill('soja'); await cel.waitForTimeout(100);
  ok(/antes desta carga/.test(await cel.locator('[data-tx-t3-linha]').first().innerText()), 'Link: data do T-3 depois da carga é apontada');
  for (const [i, d, t] of [[0, '2026-10-05', 'soja'], [1, '2026-09-28', 'milho'], [2, '2026-09-20', 'farelo de soja']]) { await dd[i].fill(d); await pp[i].fill(t); }
  await cel.click('[data-tx-avancar]'); await cel.waitForTimeout(200);
  for (const k of ['lona', 'correntes', 'cintas', 'carroceria']) { await cel.click(`[data-tx-sim="${k}"]`); await cel.click(`[data-tx-foto-ck="${k}"]`); }
  ok(await bt() === 'Falta 1 item', 'Link: checklist diz quantos itens faltam');
  await cel.click('[data-tx-avancar]'); await cel.waitForTimeout(300);
  ok(/rgb\(232, 163, 61\)/.test(await cel.locator('[data-tx-ck="interior"]').evaluate(e => getComputedStyle(e).borderColor)), 'Link: tocar no botão realça o item que falta');
  await cel.click('[data-tx-sim="interior"]'); await cel.click('[data-tx-foto-ck="interior"]'); await cel.click('[data-tx-avancar]');
  for (let i = 0; i < 5; i++) { await cel.click('[data-tx-avancar]'); await cel.waitForTimeout(80); }
  const bx = await cel.locator('[data-tx-assinatura]').boundingBox(); await cel.mouse.move(bx.x + 20, bx.y + 60); await cel.mouse.down(); for (let i = 0; i < 30; i++) await cel.mouse.move(bx.x + 20 + i * 8, bx.y + 60 + Math.sin(i / 2) * 25); await cel.mouse.up();
  ok(await cel.evaluate(() => String(getSelection())) === '', 'Link: assinar não seleciona texto da página');
  await cel.click('[data-tx-avancar]'); await cel.waitForTimeout(300);
  ok(/Pode fechar esta página/.test(await cel.innerText('body')), 'Link: fim diz que pode fechar');
  await cel.screenshot({ path: out + '/revisao-link-fim.png' });

  ok(erros.length === 0, 'sem erro de JavaScript (' + erros.join(' | ') + ')');
  console.log(falhas ? falhas + ' falha(s)' : 'Revisão: tudo certo');
  await browser.close(); process.exit(falhas ? 1 : 0);
})();
