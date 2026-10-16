'use client';
// Os dados do protótipo moram no navegador (localStorage): sem ele, nada a desenhar.
import { useEffect, useState, type ReactNode } from 'react';

export function SoNoNavegador({ children }: { children: ReactNode }) {
  const [pronto, setPronto] = useState(false);
  useEffect(() => setPronto(true), []);
  return pronto ? <>{children}</> : null;
}
