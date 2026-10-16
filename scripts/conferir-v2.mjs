// Confere as telas do app: links quebrados, travessão e ponto médio, clicável sem ação e resto de .dc.html.
// Uso: node scripts/conferir-v2.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function arquivos(dir, ext) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...arquivos(f, ext));
    else if (ext.test(e.name)) out.push(f);
  }
  return out;
}
// Rotas que existem: pastas de src/app com page.tsx (grupos entre parênteses não entram na URL).
const rotas = new Set(arquivos(path.join(raiz, 'src', 'app'), /^page\.tsx$/).map(f => '/' + path.relative(path.join(raiz, 'src', 'app'), path.dirname(f)).split(path.sep).filter(s => !/^\(.*\)$/.test(s)).join('/')).map(r => r === '/' ? '/' : r.replace(/\/$/, '')));
const existe = alvo => rotas.has(alvo) || fs.existsSync(path.join(raiz, 'public', alvo)) || (alvo.startsWith('/prototipo/') && fs.existsSync(path.join(raiz, 'SaaS moderno estilo Dribbble', alvo.slice(11))));

// Fim da tag de abertura JSX a partir de "<div", respeitando chaves e aspas.
function tagAberta(src, i) {
  let d = 0, q = null;
  for (let j = i + 1; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === q && src[j - 1] !== '\\') q = null; continue; }
    if (c === '"' || c === "'" || c === '`') q = c;
    else if (c === '{') d++;
    else if (c === '}') d--;
    else if (c === '>' && d === 0) return src.slice(i, j + 1);
  }
  return src.slice(i);
}

let problemas = 0;
const p = (arq, msg) => { problemas++; console.log('  ' + path.relative(raiz, arq) + ': ' + msg); };
const fontes = [...arquivos(path.join(raiz, 'src', 'telas'), /\.jsx$/), ...arquivos(path.join(raiz, 'src', 'components'), /\.tsx$/), ...arquivos(path.join(raiz, 'src', 'app'), /\.tsx$/), ...arquivos(path.join(raiz, 'src', 'lib', 'tx'), /\.js$/)];
for (const arq of fontes) {
  const src = fs.readFileSync(arq, 'utf8');
  // 1. links: href literal e rotas montadas em texto ('/viagem?id=' + ...)
  const alvos = new Set();
  for (const m of src.matchAll(/href="(\/[^"?#]*)/g)) alvos.add(m[1]);
  for (const m of src.matchAll(/'(\/(?:[a-z-]+)(?:\/[a-z.-]+)*)(?:[?#][^']*)?'/g)) alvos.add(m[1]);
  for (const a of alvos) if (!existe(a)) p(arq, 'link quebrado para "' + a + '"');
  if (/\.dc\.html['"?]/.test(src.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')) && !arq.endsWith('tela.js')) p(arq, 'ainda aponta para arquivo .dc.html');
  // 2. travessão e ponto médio em qualquer texto
  for (const ch of ['—', '·']) {
    const n = (src.match(new RegExp(ch, 'g')) || []).length;
    if (n) p(arq, n + ' ocorrência(s) de "' + ch + '"');
  }
  // 3. clicável sem ação: div ou span com cursor pointer e sem onClick, fora de link e de label
  for (const m of src.matchAll(/<(div|span)\b/g)) {
    const t = tagAberta(src, m.index);
    if (!/cursor: 'pointer'/.test(t) || /onClick=/.test(t)) continue;
    const antes = src.slice(Math.max(0, m.index - 3000), m.index);
    const dentroA = Math.max(antes.lastIndexOf('<A '), antes.lastIndexOf('<a '), antes.lastIndexOf('<Link ')) > Math.max(antes.lastIndexOf('</A>'), antes.lastIndexOf('</a>'), antes.lastIndexOf('</Link>'));
    const dentroL = antes.lastIndexOf('<label') > antes.lastIndexOf('</label>');
    if (!dentroA && !dentroL) p(arq, 'elemento clicável sem ação: ' + t.replace(/\s+/g, ' ').slice(0, 100));
  }
}
console.log(problemas ? '\n' + problemas + ' problema(s)' : '\nNenhum problema em ' + fontes.length + ' arquivos: links, travessão, ponto médio e clicáveis conferidos.');
process.exit(problemas ? 1 : 0);
