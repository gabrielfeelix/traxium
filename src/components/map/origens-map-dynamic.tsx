"use client";

import dynamic from "next/dynamic";

export const OrigensMap = dynamic(
  () => import("./origens-map").then((m) => m.OrigensMap),
  {
    ssr: false,
    loading: () => <div className="skeleton rounded-lg" style={{ height: 190 }} />,
  }
);
