// Confere as telas v2: links quebrados, travessão e ponto médio em texto, botão sem ação, tags de controle desbalanceadas.
// Uso: node scripts/conferir-v2.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const pasta = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TELAS = ['Hoje.dc.html', 'Viagens v2.dc.html', 'Viagem.dc.html', 'Transportadores.dc.html', 'Frota.dc.html', 'Compartimento v2.dc.html', 'Auditoria.dc.html', 'Cadastros.dc.html', 'Configuracoes v2.dc.html', 'Link da Viagem.dc.html', 'versao-anterior.html', 'index.html'];
let problemas = 0;
const p = (arq, msg) => { problemas++; console.log('  ' + arq + ': ' + msg); };
for (const arq of TELAS) {
  const f = path.join(pasta, arq);
  if (!fs.existsSync(f)) { console.log('(ainda não existe) ' + arq); continue; }
  const src = fs.readFileSync(f, 'utf8');
  // 1. links: href literal e hrefs montados em JS ('Algo.dc.html?...')
  const alvos = new Set();
  for (const m of src.matchAll(/href="([^"{}#]+?)(?:[?#][^"]*)?"/g)) alvos.add(m[1]);
  for (const m of src.matchAll(/'([A-Za-zÀ-ú0-9 \-]+\.(?:dc\.)?html)(?:\?[^']*)?'/g)) alvos.add(m[1]);
  for (const m of src.matchAll(/location\.(?:href|replace)\(?\s*=?\s*'([^'?#]+)/g)) alvos.add(m[1]);
  for (const a of alvos) {
    if (/^(https?:|mailto:|\.\/support|\.\/tx-)/.test(a) || a.endsWith('.js') || a.includes('fonts.googleapis')) continue;
    const alvo = decodeURIComponent(a.replace(/^\.\//, ''));
    if (!fs.existsSync(path.join(pasta, alvo))) p(arq, 'link quebrado para "' + alvo + '"');
  }
  // 2. travessão e ponto médio em qualquer texto da tela
  const semScripts = src;
  for (const ch of ['—', '·']) {
    const n = (semScripts.match(new RegExp(ch, 'g')) || []).length;
    if (n) p(arq, n + ' ocorrência(s) de "' + ch + '"');
  }
  // 3. botão sem ação: elemento com cursor:pointer sem onClick, fora de <a> e de <label>
  const tpl = src.split('<script type="text/x-dc"')[0];
  for (const m of tpl.matchAll(/<(div|span)\b([^>]*cursor:pointer[^>]*)>/g)) {
    if (!/onClick=/.test(m[2])) {
      const antes = tpl.slice(Math.max(0, m.index - 2000), m.index);
      const abertoA = antes.lastIndexOf('<a ') > antes.lastIndexOf('</a>');
      const abertoL = antes.lastIndexOf('<label') > antes.lastIndexOf('</label>');
      if (!abertoA && !abertoL) p(arq, 'elemento clicável sem ação: ' + m[0].slice(0, 90));
    }
  }
  // 4. sc-if e sc-for balanceados
  for (const t of ['sc-if', 'sc-for', 'a', 'label']) {
    const ab = (tpl.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length, fe = (tpl.match(new RegExp('</' + t + '>', 'g')) || []).length;
    if (ab !== fe) p(arq, '<' + t + '> desbalanceado: ' + ab + ' aberturas, ' + fe + ' fechamentos');
  }
}
console.log(problemas ? '\n' + problemas + ' problema(s)' : '\nNenhum problema: links, travessão, ponto médio, botões e tags conferidos.');
process.exit(problemas ? 1 : 0);
