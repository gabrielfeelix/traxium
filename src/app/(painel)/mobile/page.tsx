import type { Metadata } from 'next';
import { SoNoNavegador } from '@/components/tela/so-no-navegador';
import { PrototipoMobile } from './prototipo-mobile';
import './mobile.css';

export const metadata: Metadata = { title: 'Traxium: protótipo mobile' };

// O link do motorista dentro de um celular, ao lado do roteiro das etapas e do que a filial vê.
export default function Page() {
  return (
    <SoNoNavegador>
      <PrototipoMobile />
    </SoNoNavegador>
  );
}
