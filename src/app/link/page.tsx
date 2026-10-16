import type { Metadata, Viewport } from 'next';
import { ChaveDaTela } from '@/components/tela/chave-da-tela';
import { SoNoNavegador } from '@/components/tela/so-no-navegador';
import Tela from '@/telas/LinkDaViagem';

// A tela do motorista, no celular: fora da moldura do escritório.
export const metadata: Metadata = { title: 'Traxium: viagem' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function Page() {
  return (
    <SoNoNavegador>
      <ChaveDaTela>
        <Tela />
      </ChaveDaTela>
    </SoNoNavegador>
  );
}
