import type { Metadata } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import Tela from '@/telas/Frota';

export const metadata: Metadata = { title: 'Traxium: frota própria' };

export default function Page() {
  return (
    <ChaveDaTela>
      <Tela />
    </ChaveDaTela>
  );
}
