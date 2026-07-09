"use client";

import dynamic from "next/dynamic";

export const OrigensMap = dynamic(
  () => import("./origens-map").then((m) => m.OrigensMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-bg rounded-lg flex items-center justify-center" style={{ height: 190 }}>
        <div className="size-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);
