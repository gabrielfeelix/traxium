import { Suspense } from 'react';
import { Moldura } from '@/components/moldura/moldura';

// Sidebar e header moram aqui, uma vez: o layout não é redesenhado na troca de tela.
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <Moldura>{children}</Moldura>
    </Suspense>
  );
}
