// Junta classes, ignorando vazias. cx('tx-botao', on && 'tx-botao--p') => 'tx-botao tx-botao--p'.
export function cx(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(' ');
}
