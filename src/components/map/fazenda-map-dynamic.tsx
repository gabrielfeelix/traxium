"use client";

import dynamic from "next/dynamic";

export const FazendaMap = dynamic(
  () => import("./fazenda-map").then((m) => m.FazendaMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-[hsl(180_14%_94%)] rounded-xl flex items-center justify-center"
        style={{ height: 500 }}
      >
        <div className="flex flex-col items-center gap-2 text-[hsl(210_14%_42%)]">
          <div className="size-8 border-2 border-[hsl(176_84%_25%)] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Carregando mapa…</p>
        </div>
      </div>
    ),
  }
);
