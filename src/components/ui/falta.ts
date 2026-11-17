// Texto do rodapé "Falta:": ["produto", "ordem", "peso"] => "produto, ordem e peso".
export function listaFalta(itens: string[]): string {
  return itens.length <= 1 ? itens.join('') : itens.slice(0, -1).join(', ') + ' e ' + itens[itens.length - 1];
}
/** "Falta: produto, ordem e peso." ou '' quando nada falta. */
export function textoFalta(itens: string[]): string {
  const f = itens.filter(Boolean);
  return f.length ? 'Falta: ' + listaFalta(f) + '.' : '';
}
