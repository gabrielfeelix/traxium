import type { Metadata } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import Tela from '@/telas/Configuracoes';

export const metadata: Metadata = { title: 'Traxium: configurações' };

export default function Page() {
  return (
    <ChaveDaTela>
      <Tela />
    </ChaveDaTela>
  );
}
