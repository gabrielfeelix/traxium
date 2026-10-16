'use client';
/*
 * Quando a mesma rota recebe outros parâmetros (da busca global, de um link, do voltar do
 * navegador), a tela monta de novo, como no protótipo antigo em que cada clique recarregava.
 * Quando é a própria tela que reescreve a URL (TX.ui.trocarUrl: aba, filial, drawer), não monta:
 * o estado dela continua.
 */
import { Fragment, Suspense, useRef, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import TXmod from '@/lib/tx/tx-ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TX: any = TXmod;

function Chave({ children }: { children: ReactNode }) {
  const atual = usePathname() + '?' + useSearchParams().toString();
  const ref = useRef({ url: atual, n: 0 });
  if (ref.current.url !== atual) {
    if (TX.ui.urlPropria !== atual) ref.current.n++;
    ref.current.url = atual;
  }
  return <Fragment key={ref.current.n}>{children}</Fragment>;
}

export function ChaveDaTela({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <Chave>{children}</Chave>
    </Suspense>
  );
}
