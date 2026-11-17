import type { Metadata } from 'next';
import Vitrine from './vitrine';
import './ds.css';

/*
 * Design system vivo do Traxium (/design-system). Fica fora da moldura do painel de propósito:
 * é uma página de referência, sem sessão. O conteúdo é client component porque os exemplos são
 * interativos e os valores dos tokens são lidos do CSS em execução.
 */
export const metadata: Metadata = { title: 'Traxium: design system' };

export default function DesignSystem() {
  return <Vitrine />;
}
