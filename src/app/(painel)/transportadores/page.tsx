import type { Metadata } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import Tela from '@/telas/Transportadores';

export const metadata: Metadata = { title: 'Traxium: transportadores' };

export default function Page() {
  return (
    <ChaveDaTela>
      <Tela />
    </ChaveDaTela>
  );
}
