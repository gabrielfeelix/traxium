"use client";

import dynamic from "next/dynamic";

export const RastreioMap = dynamic(
  () => import("./rastreio-map").then((m) => m.RastreioMap),
  {
    ssr: false,
    // Leaflet é um chunk pesado e este é um carregamento real. O shimmer mostra a
    // forma do que vem; um spinner solto só informa que algo trava.
    loading: () => (
      <div className="skeleton rounded-lg flex items-center justify-center" style={{ height: 420 }}>
        <p className="relative z-10 text-[11px] font-medium uppercase tracking-[0.12em] text-fg-muted">
          Carregando mapa
        </p>
      </div>
    ),
  }
);
