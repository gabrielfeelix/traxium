'use client';
// O que toda tela convertida de .dc.html importa: a base TX (dados e TX.ui), a classe base,
// o link interno e o leitor de estilo em texto.
import { Component, createElement } from 'react';
import Link from 'next/link';
import TX from './tx-ui';

export { TX };

// Classe base: o que TX.ui.montar liga no componentDidMount, desliga aqui.
export class Tela extends Component {
  componentWillUnmount() {
    TX.ui.desmontar(this);
  }
}

// Link interno: navega sem recarregar a página, então a moldura fica onde está.
// Aceita ainda nomes antigos (Viagem.dc.html?id=...) vindos de dado salvo.
const ROTAS = {
  'Hoje': '/hoje', 'Viagens v2': '/viagens', 'Viagem': '/viagem', 'Transportadores': '/transportadores', 'Frota': '/frota',
  'Compartimento v2': '/compartimento', 'Auditoria': '/auditoria', 'Cadastros': '/cadastros', 'Configuracoes v2': '/configuracoes', 'Link da Viagem': '/link'
};
export function rota(href) {
  if (!href) return href;
  return String(href).replace(/^([A-Za-z0-9 ]+)\.dc\.html/, (m, n) => ROTAS[n] || m);
}
export function A(props) {
  const { href, target, ...resto } = props;
  const r = rota(href);
  if (typeof r !== 'string' || !r.startsWith('/') || target === '_blank') return createElement('a', { href: r, target, ...resto });
  return createElement(Link, { href: r, ...resto });
}

// style="..." com declarações inteiras vindas de valor (por exemplo o item ativo da sidebar).
const cache = new Map();
export function css(texto) {
  if (cache.has(texto)) return cache.get(texto);
  const o = {};
  String(texto).split(';').forEach(d => {
    const i = d.indexOf(':');
    if (i < 0) return;
    const p = d.slice(0, i).trim();
    o[p.startsWith('--') ? p : p.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = d.slice(i + 1).trim();
  });
  cache.set(texto, o);
  return o;
}
