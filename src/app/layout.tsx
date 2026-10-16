import type { Metadata } from 'next';
import './globals.css';
import '@/telas/estados.css';
import { TecladoClicavel } from '@/components/tela/teclado';

export const metadata: Metadata = {
  title: 'Traxium',
  description: 'Transporte de ração e insumos com GMP+ FSA: viagens, transportadores, frota e auditoria.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* As telas escrevem 'Hanken Grotesk' e 'Spline Sans Mono' pelo nome: a folha do Google mantém os nomes. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Spline+Sans+Mono:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TecladoClicavel />
        {children}
      </body>
    </html>
  );
}
