import type { Metadata } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import Tela from '@/telas/Viagens';

export const metadata: Metadata = { title: 'Traxium: viagens' };

export default function Page() {
  return (
    <ChaveDaTela>
      <Tela />
    </ChaveDaTela>
  );
}
