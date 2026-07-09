"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Rastreio da viagem sobre mapa real (Leaflet + OSM, DESIGN §8) — substitui o
 * grid cinza fake. Trecho percorrido em linha sólida, restante tracejado,
 * posição atual pulsando entre origem e destino.
 */

export type PontoRota = { lat: number; lng: number; label: string };

function FitRota({ pontos }: { pontos: PontoRota[] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(pontos.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [pontos, map]);
  return null;
}

function pinIcon(color: string) {
  return L.divIcon({
    className: "trx-marker",
    html: `
      <svg viewBox="0 0 28 36" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 36 14 36 S28 24.5 28 14 C28 6.27 21.73 0 14 0 Z" fill="${color}"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
        <circle cx="14" cy="14" r="2.5" fill="${color}"/>
      </svg>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

function posicaoIcon() {
  return L.divIcon({
    className: "trx-marker",
    html: `
      <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="9" fill="#0E78B5" stroke="white" stroke-width="2.5"/>
        <circle cx="18" cy="18" r="9" fill="none" stroke="#0E78B5" stroke-width="1.5" opacity="0.6">
          <animate attributeName="r" values="9;17" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -14],
  });
}

export function RastreioMap({
  origem,
  destino,
  progresso,
  height = 420,
}: {
  origem: PontoRota;
  destino: PontoRota;
  /** 0–100, fração da rota percorrida. */
  progresso: number;
  height?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} className="rounded-lg bg-bg" />;

  const t = Math.min(Math.max(progresso, 0), 100) / 100;
  const atual = {
    lat: origem.lat + (destino.lat - origem.lat) * t,
    lng: origem.lng + (destino.lng - origem.lng) * t,
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border-soft" style={{ height }}>
      <MapContainer
        center={[atual.lat, atual.lng]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRota pontos={[origem, destino]} />

        {/* Percorrido: sólido · restante: tracejado */}
        <Polyline
          positions={[[origem.lat, origem.lng], [atual.lat, atual.lng]]}
          pathOptions={{ color: "#0C5862", weight: 4, opacity: 0.9 }}
        />
        <Polyline
          positions={[[atual.lat, atual.lng], [destino.lat, destino.lng]]}
          pathOptions={{ color: "#0C5862", weight: 3, opacity: 0.55, dashArray: "8 8" }}
        />

        <Marker position={[origem.lat, origem.lng]} icon={pinIcon("#127670")}>
          <Popup>{origem.label}</Popup>
        </Marker>
        <Marker position={[atual.lat, atual.lng]} icon={posicaoIcon()}>
          <Popup>Posição atual · {Math.round(progresso)}% da rota</Popup>
        </Marker>
        <Marker position={[destino.lat, destino.lng]} icon={pinIcon("#DC2626")}>
          <Popup>{destino.label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
