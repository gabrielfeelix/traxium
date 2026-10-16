// Converte as telas .dc.html do protótipo v2 em componentes React do app Next.
//
// Cada .dc.html tem um template (HTML com {{ }}, sc-if, sc-for e style-hover) e uma
// classe `Component extends DCLogic` com renderVals(). O conversor:
//   1. tira a moldura gerada (blocos TX:SIDEBAR, TX:PERFIL e TX:MODAIS), que agora
//      mora uma vez só em src/app/(painel)/layout.tsx;
//   2. transforma o template em JSX, com a mesma semântica do runtime (support.js):
//      caminho com null seguro, sc-if por verdade, sc-for sobre lista, style em objeto,
//      style-hover em classe CSS;
//   3. troca os nomes de arquivo .dc.html pelas rotas novas.
//
// Uso: node scripts/converter-dc.mjs --forcar Hoje   (gera de novo src/telas/Hoje.jsx)
//      node scripts/converter-dc.mjs --forcar         (todas, e src/telas/estados.css)
// Depois de gerada, a tela é código do app: a revisão de UI edita o .jsx, não o .dc.html.
// Por isso, sem --forcar, o conversor não sobrescreve nada.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'htmlparser2';
import * as prettier from 'prettier';

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const origem = path.join(raiz, 'SaaS moderno estilo Dribbble');
const destino = path.join(raiz, 'src', 'telas');

export const ROTAS = {
  'Hoje': '/hoje',
  'Viagens v2': '/viagens',
  'Viagem': '/viagem',
  'Transportadores': '/transportadores',
  'Frota': '/frota',
  'Compartimento v2': '/compartimento',
  'Auditoria': '/auditoria',
  'Cadastros': '/cadastros',
  'Configuracoes v2': '/configuracoes',
  'Link da Viagem': '/link'
};
const COMPONENTE = {
  'Hoje': 'Hoje', 'Viagens v2': 'Viagens', 'Viagem': 'Viagem', 'Transportadores': 'Transportadores', 'Frota': 'Frota',
  'Compartimento v2': 'Compartimento', 'Auditoria': 'Auditoria', 'Cadastros': 'Cadastros', 'Configuracoes v2': 'Configuracoes', 'Link da Viagem': 'LinkDaViagem'
};

// ------------------------------------------------------------------ rotas no texto
export function trocarRotas(txt) {
  return txt.replace(/([A-Za-z0-9 ]+)\.dc\.html/g, (m, nome) => {
    const r = ROTAS[nome.trim()];
    if (!r) { console.warn('  aviso: tela sem rota nova: ' + m); return m; }
    return r;
  });
}

// ------------------------------------------------------------------ expressões {{ }}
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*/;
function expr(src, escopo) {
  const s = String(src).trim();
  let out = '', i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '"' || c === "'") {
      let j = i + 1; while (j < s.length && s[j] !== c) j++;
      out += JSON.stringify(s.slice(i + 1, j)); i = j + 1; continue;
    }
    if (/\s/.test(c)) { out += ' '; i++; continue; }
    if ('()!='.includes(c)) { out += c; i++; continue; }
    if (/[0-9-]/.test(c)) { const m = /^-?\d+(\.\d+)?/.exec(s.slice(i)); if (m) { out += m[0]; i += m[0].length; continue; } }
    const m = IDENT.exec(s.slice(i));
    if (!m) throw new Error('expressão não entendida: ' + s);
    const id = m[0]; i += id.length;
    if (['true', 'false', 'null', 'undefined'].includes(id)) { out += id; continue; }
    let p = escopo.has(id) ? escopo.get(id) : 'v.' + id;
    // segmentos seguintes: .x, .0 ou [expr], sempre com null seguro como no runtime
    while (i < s.length && (s[i] === '.' || s[i] === '[')) {
      if (s[i] === '.') {
        const mm = /^[A-Za-z_$][A-Za-z0-9_$]*|^\d+/.exec(s.slice(i + 1));
        if (!mm) break;
        p += /^\d/.test(mm[0]) ? '?.[' + mm[0] + ']' : '?.' + mm[0]; i += 1 + mm[0].length;
      } else {
        let d = 1, j = i + 1; while (j < s.length && d) { if (s[j] === '[') d++; else if (s[j] === ']') d--; if (d) j++; }
        p += '?.[' + expr(s.slice(i + 1, j), escopo) + ']'; i = j + 1;
      }
    }
    out += p;
  }
  return out.replace(/\s+/g, ' ').trim();
}
const INTERP = /\{\{([\s\S]+?)\}\}/g;
function inteiro(raw) { const m = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(raw); return m ? m[1] : null; }
// Valor de atributo: literal, expressão inteira ou template string.
function valorAttr(raw, escopo) {
  const w = inteiro(raw);
  if (w != null) return { tipo: 'expr', js: expr(w, escopo) };
  if (!raw.includes('{{')) return { tipo: 'lit', js: raw };
  const partes = raw.split(INTERP);
  const js = '`' + partes.map((p, i) => i & 1 ? '${' + expr(p, escopo) + ' ?? ""}' : p.replace(/[`\\]/g, '\\$&').replace(/\$\{/g, '\\${')).join('') + '`';
  return { tipo: 'tpl', js };
}

// ------------------------------------------------------------------ style
function camel(prop) {
  if (prop.startsWith('--')) return prop;
  return prop.replace(/^-(webkit|moz|ms)-/, (m, v) => v[0].toUpperCase() + v.slice(1) + '-').replace(/-([a-z])/g, (m, c) => c.toUpperCase());
}
function dividirDecl(css) {
  const out = []; let d = 0, q = null, cur = '', i = 0;
  while (i < css.length) {
    if (css.startsWith('{{', i)) { const j = css.indexOf('}}', i); cur += css.slice(i, j + 2); i = j + 2; continue; }
    const c = css[i];
    if (q) { if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === '(') d++;
    else if (c === ')') d--;
    else if (c === ';' && !d) { out.push(cur); cur = ''; i++; continue; }
    cur += c; i++;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
function estilo(raw, escopo) {
  const decls = dividirDecl(raw);
  // Declaração inteira vinda de valor (por exemplo {{ sbd.frota }}): o objeto sai em tempo de execução.
  const dinamico = decls.some(d => { const k = d.replace(INTERP, ''); return !k.includes(':'); });
  if (dinamico) return 'css(' + valorAttr(raw, escopo).js + ')';
  const pares = decls.map(d => {
    let i = -1, k = 0;
    for (let j = 0; j < d.length; j++) { if (d.startsWith('{{', j)) { j = d.indexOf('}}', j) + 1; continue; } if (d[j] === ':') { i = j; break; } }
    const prop = d.slice(0, i).trim(), val = d.slice(i + 1).trim();
    const v = valorAttr(val, escopo);
    const chave = /^[A-Za-z_$][\w$]*$/.test(camel(prop)) ? camel(prop) : JSON.stringify(camel(prop));
    return chave + ': ' + (v.tipo === 'lit' ? JSON.stringify(val) : v.js);
  });
  return '{ ' + pares.join(', ') + ' }';
}

// ------------------------------------------------------------------ pseudoclasses (style-hover)
const regras = new Map();
function pseudo(nome, css) {
  const k = nome + '|' + css;
  if (!regras.has(k)) {
    const cls = 'tx-' + nome.slice(0, 1) + crypto.createHash('sha1').update(k).digest('hex').slice(0, 7);
    const imp = dividirDecl(css).map(d => d + ' !important').join(';');
    regras.set(k, { cls, regra: '.' + cls + ':' + nome + '{' + imp + '}' });
  }
  return regras.get(k).cls;
}

// ------------------------------------------------------------------ atributos
const ATTR = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', colspan: 'colSpan', rowspan: 'rowSpan', maxlength: 'maxLength', minlength: 'minLength', readonly: 'readOnly', autocomplete: 'autoComplete', autofocus: 'autoFocus', inputmode: 'inputMode', spellcheck: 'spellCheck', contenteditable: 'contentEditable', enterkeyhint: 'enterKeyHint', autocapitalize: 'autoCapitalize', crossorigin: 'crossOrigin', srcset: 'srcSet', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace' };
const BOOL = new Set(['disabled', 'checked', 'readonly', 'autofocus', 'multiple', 'hidden', 'selected', 'required', 'novalidate', 'open']);
const VAZIOS = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'col', 'wbr']);
const CAMPOS = new Set(['input', 'textarea', 'select']);
function nomeAttr(n) {
  if (ATTR[n]) return ATTR[n];
  if (n.startsWith('data-') || n.startsWith('aria-')) return n;
  if (/^on[a-z]/i.test(n)) return 'on' + n[2].toUpperCase() + n.slice(3);
  if (n.includes('-')) return n.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
  return n;
}
function externo(href) { return /^(https?:|mailto:|tel:|#|javascript:|data:|blob:)/.test(href) || href === ''; }

function attrs(el, escopo) {
  const a = el.attribs || {};
  const tag = el.name;
  const out = [], classes = [];
  const tem = k => Object.prototype.hasOwnProperty.call(a, k);
  for (const [n0, raw0] of Object.entries(a)) {
    let n = n0, raw = raw0;
    if (n.startsWith('hint-') || n === 'sc-name') continue;
    if (n.startsWith('style-')) { classes.push(JSON.stringify(pseudo(n.slice(6), raw))); continue; }
    if (n === 'style') { out.push('style={' + estilo(raw, escopo) + '}'); continue; }
    if (n === 'class') { const v = valorAttr(raw, escopo); classes.unshift(v.tipo === 'lit' ? JSON.stringify(raw) : v.js); continue; }
    if (n === 'href' && tag === 'a') raw = trocarRotas(raw);
    if (n === 'onInput' && CAMPOS.has(tag) && !tem('onChange')) n = 'onChange';
    const jn = nomeAttr(n);
    if (raw === '' && (BOOL.has(n.toLowerCase()))) { out.push(jn); continue; }
    const v = valorAttr(raw, escopo);
    if (v.tipo === 'lit') out.push(jn + '=' + JSON.stringify(raw));
    else if ((jn === 'value') && CAMPOS.has(tag)) out.push(jn + '={' + v.js + ' ?? ""}');
    else out.push(jn + '={' + v.js + '}');
  }
  if (classes.length) out.push('className=' + (classes.length === 1 && classes[0].startsWith('"') ? classes[0] : '{[' + classes.join(', ') + '].filter(Boolean).join(" ")}'));
  return out;
}

// ------------------------------------------------------------------ texto
function texto(t, escopo) {
  if (!t.includes('{{')) {
    if (!t.trim()) return t.includes(' ') ? '{" "}' : '';
    const c = t.replace(/\s+/g, ' ');
    const nucleo = c.trim();
    const pre = c.startsWith(' ') ? '{" "}' : '', pos = c.endsWith(' ') ? '{" "}' : '';
    return pre + (/[{}<>]/.test(nucleo) ? '{' + JSON.stringify(nucleo) + '}' : nucleo) + pos;
  }
  return t.replace(/\s+/g, ' ').split(INTERP).map((p, i) => {
    if (i & 1) return '{' + expr(p, escopo) + '}';
    if (!p) return '';
    return /[{}<>]/.test(p) || /^\s|\s$/.test(p) ? '{' + JSON.stringify(p) + '}' : p;
  }).join('');
}

// ------------------------------------------------------------------ árvore
const RESERVADAS = new Set('do if in for let new try var case else enum eval null this true void with break catch class const false super throw while yield delete export import public return static switch typeof default extends finally package private continue debugger function arguments interface protected implements instanceof v'.split(' '));
// Espaço de indentação entre tags: o runtime mantinha, mas só pesa entre elementos em linha.
// Some quando o pai é flex ou grid, ou quando os vizinhos são blocos.
const BLOCO = new Set(['div', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'ul', 'ol', 'li', 'p', 'section', 'header', 'footer', 'nav', 'form', 'h1', 'h2', 'h3', 'sc-if', 'sc-for', 'select', 'option', 'svg', 'g', 'defs', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'linearGradient', 'lineargradient', 'stop', 'label', 'textarea', 'input']);
function ehFlex(el) { return /display:\s*(inline-)?(flex|grid)/.test((el && el.attribs && el.attribs.style) || ''); }
function vizinho(lista, i, passo) { for (let j = i + passo; j >= 0 && j < lista.length; j += passo) { const x = lista[j]; if (x.type === 'tag') return x; if (x.type === 'text' && x.data.trim()) return x; } return null; }
function nos(lista, escopo, flex) {
  return lista.map((n, i) => {
    if (n.type === 'text' && !n.data.trim() && /\n/.test(n.data)) {
      if (flex) return '';
      const a = vizinho(lista, i, -1), b = vizinho(lista, i, 1);
      if ((!a || (a.type === 'tag' && BLOCO.has(a.name))) && (!b || (b.type === 'tag' && BLOCO.has(b.name)))) return '';
    }
    return no(n, escopo, flex);
  }).filter(Boolean).join('\n');
}
function no(n, escopo, flexPai) {
  if (n.type === 'text') return texto(n.data, escopo);
  if (n.type === 'comment') return '';
  if (n.type !== 'tag' && n.type !== 'script' && n.type !== 'style') return '';
  const tag = n.name;
  if (tag === 'sc-if') {
    const w = inteiro(n.attribs.value || '');
    return '{' + expr(w, escopo) + ' ? (<>\n' + nos(n.children, escopo, flexPai) + '\n</>) : null}';
  }
  if (tag === 'sc-for') {
    const lista = expr(inteiro(n.attribs.list || ''), escopo);
    const as = n.attribs.as || 'item';
    const js = RESERVADAS.has(as) ? as + '_' : as;
    const sub = new Map(escopo); sub.set(as, js); sub.set('$index', '$index');
    return '{(Array.isArray(' + lista + ') ? ' + lista + ' : []).map((' + js + ', $index) => (<Fragment key={$index}>\n' + nos(n.children, sub, flexPai) + '\n</Fragment>))}';
  }
  if (tag === 'sc-else' || tag === 'dc-import' || tag === 'x-import') throw new Error('não suportado: <' + tag + '>');
  let jtag = tag;
  const a = attrs(n, escopo);
  if (tag === 'a' && n.attribs.href != null && !externo(n.attribs.href)) jtag = 'A';
  const abre = '<' + jtag + (a.length ? ' ' + a.join(' ') : '');
  if (VAZIOS.has(tag)) return abre + ' />';
  const filhos = nos(n.children, escopo, ehFlex(n));
  return filhos ? abre + '>' + filhos + '</' + jtag + '>' : abre + '></' + jtag + '>';
}

// ------------------------------------------------------------------ tela
function cortar(html, ini, fim) {
  const a = html.indexOf(ini);
  if (a < 0) return html;
  const b = html.indexOf(fim, a);
  return html.slice(0, a) + html.slice(b + fim.length);
}

export async function converter(nome) {
  const arq = path.join(origem, nome + '.dc.html');
  const src = fs.readFileSync(arq, 'utf8');
  let tpl = src.slice(src.indexOf('<x-dc>') + 6, src.indexOf('</x-dc>'));
  tpl = cortar(tpl, '<helmet>', '</helmet>');
  tpl = cortar(tpl, '<!-- TX:SIDEBAR -->', '<!-- /TX:SIDEBAR -->');
  tpl = cortar(tpl, '<!-- TX:PERFIL -->', '<!-- /TX:PERFIL -->');
  tpl = cortar(tpl, '<!-- TX:MODAIS -->', '<!-- /TX:MODAIS -->');
  const comMoldura = src.includes('<!-- TX:SIDEBAR -->');
  // O header agora é coluna da moldura, não sobreposição fixa: o conteúdo não reserva mais os 92 px.
  if (comMoldura) tpl = tpl.replace('padding:92px 32px 48px', 'padding:24px 32px 48px');

  const doc = parseDocument(tpl, { lowerCaseAttributeNames: false, lowerCaseTags: true, recognizeSelfClosing: true, decodeEntities: true });
  const raizes = doc.children.filter(n => n.type === 'tag');
  if (raizes.length !== 1) throw new Error(nome + ': esperava um elemento raiz, achei ' + raizes.length);
  const r = raizes[0];
  // O wrapper raiz desenhava a página inteira (sidebar + conteúdo); agora é só o conteúdo.
  if (comMoldura) r.attribs.style = 'min-height:100%';
  r.attribs['data-tela'] = COMPONENTE[nome];
  let jsx = no(r, new Map(), false);

  const sm = /<script type="text\/x-dc" data-dc-script>([\s\S]*?)<\/script>/.exec(src);
  let logica = sm[1].trim();
  logica = trocarRotas(logica)
    .replace(/class Component extends DCLogic \{/, 'export default class ' + COMPONENTE[nome] + ' extends Tela {')
    .replace(/\blocation\.href\s*=\s*/g, 'TX.ui.ir(')
    .replace(/\bhistory\.replaceState\(null, '', /g, 'TX.ui.trocarUrl(');
  // location.href = x;  vira  TX.ui.ir(x);  fecha o parêntese no fim da instrução
  logica = logica.replace(/TX\.ui\.ir\(([^;]*?)(;|\s*\})/g, (m, arg, fim) => 'TX.ui.ir(' + arg.trim() + ')' + fim);
  // render() no fim da classe
  const fecho = logica.lastIndexOf('}');
  logica = logica.slice(0, fecho) + '\n  render() {\n    const v = this.renderVals();\n    return (\n' + jsx + '\n    );\n  }\n}\n';

  const cabeca = '// Gerado de "SaaS moderno estilo Dribbble/' + nome + '.dc.html" por scripts/converter-dc.mjs.\n' +
    "'use client';\nimport { Fragment } from 'react';\nimport { TX, Tela, A, css } from '@/lib/tx/tela';\n\n";
  let saida = cabeca + logica;
  try { saida = await prettier.format(saida, { parser: 'babel', printWidth: 140, singleQuote: true }); }
  catch (e) { fs.writeFileSync(path.join(destino, COMPONENTE[nome] + '.jsx.erro'), saida); throw e; }
  fs.mkdirSync(destino, { recursive: true });
  fs.writeFileSync(path.join(destino, COMPONENTE[nome] + '.jsx'), saida);
  return COMPONENTE[nome];
}

if (!process.argv.includes('--forcar')) {
  console.log('As telas em src/telas já são código do app e foram editadas à mão. Para gerar de novo e perder essas edições: --forcar');
  process.exit(1);
}
const pedidas = process.argv.slice(2).filter(a => a !== '--forcar');
const lista = pedidas.length ? Object.keys(ROTAS).filter(n => pedidas.includes(n) || pedidas.includes(COMPONENTE[n])) : Object.keys(ROTAS);
for (const n of lista) {
  const c = await converter(n);
  console.log('ok ' + n + ' -> src/telas/' + c + '.jsx');
}
if (!pedidas.length) {
  const css = '/* Gerado por scripts/converter-dc.mjs: os style-hover e style-focus das telas. */\n' + [...regras.values()].map(x => x.regra).sort().join('\n') + '\n';
  fs.writeFileSync(path.join(destino, 'estados.css'), css);
  console.log(regras.size + ' regras de estado em src/telas/estados.css');
}
