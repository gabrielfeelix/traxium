// Junta classes, ignorando vazias. cx('tx-botao', on && 'tx-botao--p') => 'tx-botao tx-botao--p'.
export function cx(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(' ');
}

/*
 * Último gatilho de menu acionado. Quando um item de MenuLinha abre um Confirmar, o item some com o
 * menu; ao fechar o diálogo, o foco volta para este botão em vez de cair no <body>.
 */
let gatilho: HTMLElement | null = null;
export function lembrarGatilho(el: HTMLElement | null) { gatilho = el; }
export function devolverFocoAoGatilho(): boolean {
  if (gatilho && gatilho.isConnected) { gatilho.focus({ preventScroll: true }); return true; }
  return false;
}
