"use client";

// QR do convite. A diretriz cita QR três vezes no onboarding do transportador —
// até a Fase 6 havia só o ícone e uma frase dizendo que existia, o que é uma
// promessa não cumprida na tela. Este QR é real e escaneável.
//
// Desenhado como SVG a partir da matriz de módulos: imprime bem, escala sem
// perder nitidez e não depende de canvas.

import qrcode from "qrcode-generator";

export function QRConvite({ url, size = 148 }: { url: string; size?: number }) {
  // Tipo 0 = versão automática pelo tamanho do dado; correção "M" tolera o
  // desgaste de um papel afixado no pátio.
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();

  const n = qr.getModuleCount();
  const quiet = 2; // zona de silêncio exigida para leitura
  const total = n + quiet * 2;

  const modulos: string[] = [];
  for (let linha = 0; linha < n; linha++) {
    for (let col = 0; col < n; col++) {
      if (qr.isDark(linha, col)) {
        modulos.push(`M${col + quiet},${linha + quiet}h1v1h-1z`);
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR Code do convite: ${url}`}
      className="rounded-lg border border-border-soft bg-white p-0"
    >
      <rect width={total} height={total} fill="white" />
      <path d={modulos.join("")} fill="hsl(195 30% 8%)" />
    </svg>
  );
}
