"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fazendas } from "@/lib/mock-data";

/**
 * Mini-mapa das origens do lote — Leaflet real (DESIGN §8), compacto e
 * não-interativo. Fazendas do lote em brand, demais esmaecidas para contexto.
 */

function FitOrigens({ ids }: { ids: string[] }) {
  const map = useMap();
  useEffect(() => {
    const alvo = fazendas.filter((f) => ids.includes(f.id));
    const base = alvo.length ? alvo : fazendas;
    const bounds = L.latLngBounds(base.map((f) => [f.centroide.lat, f.centroide.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 8 });
  }, [ids, map]);
  return null;
}

export function OrigensMap({ ids, height = 190 }: { ids: string[]; height?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} className="rounded-lg bg-bg" />;

  return (
    <div className="rounded-lg overflow-hidden border border-border-soft" style={{ height }}>
      <MapContainer
        center={[-12.8, -55.5]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitOrigens ids={ids} />
        {fazendas.map((f) => {
          const sel = ids.includes(f.id);
          return (
            <CircleMarker
              key={f.id}
              center={[f.centroide.lat, f.centroide.lng]}
              radius={sel ? 8 : 4}
              pathOptions={
                sel
                  ? { color: "#0C5862", weight: 2, fillColor: "#127670", fillOpacity: 0.9 }
                  : { color: "#94A3AD", weight: 1, fillColor: "#94A3AD", fillOpacity: 0.4 }
              }
            >
              <Popup>{f.nome} · {f.cidade}/{f.uf}</Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
