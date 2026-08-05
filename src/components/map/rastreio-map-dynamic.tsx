"use client";

import dynamic from "next/dynamic";

export const RastreioMap = dynamic(
  () => import("./rastreio-map").then((m) => m.RastreioMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-bg rounded-lg flex items-center justify-center" style={{ height: 420 }}>
        <div className="flex flex-col items-center gap-2 text-fg-muted">
          <div className="size-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Carregando mapa…</p>
        </div>
      </div>
    ),
  }
);
