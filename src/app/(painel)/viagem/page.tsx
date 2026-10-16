import type { Metadata } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import Tela from '@/telas/Viagem';

export const metadata: Metadata = { title: 'Traxium: viagem' };

export default function Page() {
  return (
    <ChaveDaTela>
      <Tela />
    </ChaveDaTela>
  );
}
