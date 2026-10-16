// Copia o protótipo .dc.html (v1 e v2) para public/prototipo, para o app servir a
// "Versão anterior" no mesmo endereço. Roda antes de dev e build (package.json).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const de = path.join(raiz, 'SaaS moderno estilo Dribbble');
const para = path.join(raiz, 'public', 'prototipo');
fs.rmSync(para, { recursive: true, force: true });
fs.mkdirSync(para, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(de)) {
  if (!/\.(html|js|jsx|png|jpg|svg|webp)$/.test(f)) continue;
  fs.copyFileSync(path.join(de, f), path.join(para, f));
  n++;
}
if (fs.existsSync(path.join(de, 'uploads'))) fs.cpSync(path.join(de, 'uploads'), path.join(para, 'uploads'), { recursive: true });
console.log('protótipo .dc.html copiado para public/prototipo (' + n + ' arquivos)');
