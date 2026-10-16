"use client";

// Anel de competência — cada arco é uma trilha obrigatória. A elegibilidade se
// lê de longe, sem texto: um arco vermelho já diz que o motorista não opera.
//
// Substitui o gauge contínuo de conformidade média que ficava aqui. A média
// continua no card, como número; o anel passa a carregar a informação que
// decide se a pessoa pode ou não carregar.

import { competenciaMotorista, trilhasExigidas, estadoTrilha, type EstadoTrilha } from "@/lib/domain/academy";
import { cn } from "@/lib/utils";

const COR: Record<EstadoTrilha, string> = {
  vigente: "stroke-success-500",
  a_vencer: "stroke-warning-500",
  vencida: "stroke-danger-500",
  nunca: "stroke-danger-500",
};

export function AnelCompetencia({
  motoristaId,
  iniciais,
  size = 56,
}: {
  motoristaId: string;
  iniciais: string;
  size?: number;
}) {
  const exigidas = trilhasExigidas({});
  const comp = competenciaMotorista(motoristaId);

  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const passo = circ / exigidas.length;
  const vao = Math.min(4, passo * 0.22); // respiro entre arcos

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Competência: ${comp.motivo}`}
      title={comp.motivo}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        {exigidas.map((t, i) => (
          <circle
            key={t.id}
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={3.5}
            strokeLinecap="round"
            className={cn("fill-none", COR[estadoTrilha(motoristaId, t)])}
            strokeDasharray={`${passo - vao} ${circ - passo + vao}`}
            strokeDashoffset={-i * passo}
          />
        ))}
      </svg>
      <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-brand-600 to-sky-600 text-white flex items-center justify-center text-[13px] font-bold">
        {iniciais}
      </div>
    </div>
  );
}
