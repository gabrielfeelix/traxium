"use client";

// Campo de assinatura reutilizável. Extraído do fluxo do motorista, que já
// tinha o traço a dedo — o acordo de qualidade precisa exatamente do mesmo
// gesto, e duas implementações do mesmo traço divergiriam com o tempo.
//
// Devolve a assinatura como data URL para virar evidência, junto com o
// dispositivo e o carimbo de tempo que o acordo registra.

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssinaturaCanvas({
  onChange,
  altura = 180,
  className,
}: {
  /** Recebe o data URL quando há traço, e `null` quando o campo é limpo. */
  onChange: (dataUrl: string | null) => void;
  altura?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const desenhando = useRef(false);
  const ultimo = useRef<{ x: number; y: number } | null>(null);
  const [temTraco, setTemTraco] = useState(false);

  const posOf = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    };
  };

  const start = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    desenhando.current = true;
    ultimo.current = posOf(e);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current) return;
    const g = canvasRef.current?.getContext("2d");
    if (!g || !ultimo.current) return;
    const p = posOf(e);
    g.strokeStyle = "#0b3d44";
    g.lineWidth = 2.5;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(ultimo.current.x, ultimo.current.y);
    g.lineTo(p.x, p.y);
    g.stroke();
    ultimo.current = p;
    if (!temTraco) setTemTraco(true);
  };

  const end = () => {
    desenhando.current = false;
    ultimo.current = null;
    if (temTraco) onChange(canvasRef.current?.toDataURL("image/png") ?? null);
  };

  const limpar = () => {
    const c = canvasRef.current;
    const g = c?.getContext("2d");
    if (c && g) g.clearRect(0, 0, c.width, c.height);
    setTemTraco(false);
    onChange(null);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50"
        style={{ height: altura }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="absolute inset-0 h-full w-full touch-none"
        />
        {!temTraco && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] text-fg-muted">
            Assine com o dedo ou o mouse
          </span>
        )}
        {/* Linha de assinatura, como num documento em papel. */}
        <span className="pointer-events-none absolute inset-x-6 bottom-7 border-b border-fg/25" />
      </div>
      {temTraco && (
        <button
          type="button"
          onClick={limpar}
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-fg-muted hover:text-fg"
        >
          <Eraser className="size-3.5" /> Limpar e assinar de novo
        </button>
      )}
    </div>
  );
}
