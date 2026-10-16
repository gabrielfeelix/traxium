"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup, LayersControl, useMap, ScaleControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Fazenda } from "@/lib/mock-data";

const RISK_COLOR: Record<string, { fill: string; stroke: string }> = {
  Baixo:    { fill: "#1FA89F", stroke: "#0C5862" },
  Médio:    { fill: "#F59E0B", stroke: "#B45309" },
  Alto:     { fill: "#F97316", stroke: "#9A3412" },
  "Crítico":{ fill: "#DC2626", stroke: "#7F1D1D" },
};

function FlyToFazenda({ fazenda }: { fazenda: Fazenda }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(fazenda.poligono.map((p) => [p.lat, p.lng]));
    map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
  }, [fazenda, map]);
  return null;
}

function PinIcon({ color }: { color: string }) {
  return L.divIcon({
    className: "trx-marker",
    html: `
      <div style="position: relative; width: 28px; height: 36px;">
        <svg viewBox="0 0 28 36" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
          </defs>
          <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 36 14 36 S28 24.5 28 14 C28 6.27 21.73 0 14 0 Z" fill="${color}" filter="url(#shadow)"/>
          <circle cx="14" cy="14" r="5" fill="white"/>
          <circle cx="14" cy="14" r="2.5" fill="${color}"/>
        </svg>
      </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

interface FazendaMapProps {
  fazenda: Fazenda;
  fazendas?: Fazenda[];
  height?: number | string;
  showAllPolygons?: boolean;
  className?: string;
}

export function FazendaMap({ fazenda, fazendas = [], height = 500, showAllPolygons = false, className }: FazendaMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          height,
          background: "linear-gradient(135deg, hsl(180 14% 94%), hsl(195 20% 90%))",
          borderRadius: 12,
        }}
      />
    );
  }

  const color = RISK_COLOR[fazenda.scoreRiscoEUDR] ?? RISK_COLOR.Baixo;

  const allFazendas = showAllPolygons ? fazendas : [fazenda];

  return (
    <div className={className} style={{ height, position: "relative" }}>
      <MapContainer
        center={[fazenda.centroide.lat, fazenda.centroide.lng]}
        zoom={13}
        scrollWheelZoom
        zoomControl
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap" checked>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satélite (Esri)">
            <TileLayer
              attribution="Esri WorldImagery"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topográfico">
            <TileLayer
              attribution="OpenTopoMap"
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Light">
            <TileLayer
              attribution="CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ScaleControl position="bottomleft" imperial={false} />

        {allFazendas.map((f) => {
          const c = RISK_COLOR[f.scoreRiscoEUDR] ?? RISK_COLOR.Baixo;
          const isSelected = f.id === fazenda.id;
          return (
            <Polygon
              key={f.id}
              positions={f.poligono.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: c.stroke,
                fillColor: c.fill,
                fillOpacity: isSelected ? 0.35 : 0.18,
                weight: isSelected ? 3 : 2,
                opacity: isSelected ? 1 : 0.7,
                dashArray: f.desmatamentoPos2020 ? "8,4" : undefined,
              }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0C5862" }}>{f.nome}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                    {f.cidade}/{f.uf} · {f.areaTotalHa.toLocaleString("pt-BR")} ha
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11 }}>
                    <strong>CAR:</strong>{" "}
                    <span style={{ fontFamily: "monospace" }}>{f.car.slice(-12)}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11 }}>
                    <strong>Risco EUDR:</strong>{" "}
                    <span style={{ color: c.stroke, fontWeight: 700 }}>{f.scoreRiscoEUDR}</span>
                  </div>
                  {f.desmatamentoPos2020 && (
                    <div
                      style={{
                        marginTop: 6,
                        padding: "4px 6px",
                        background: "#FEE2E2",
                        color: "#991B1B",
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 4,
                      }}
                    >
                      ⚠ Alerta INPE pós-2020
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {allFazendas.map((f) => {
          const c = RISK_COLOR[f.scoreRiscoEUDR] ?? RISK_COLOR.Baixo;
          return (
            <Marker
              key={`m-${f.id}`}
              position={[f.centroide.lat, f.centroide.lng]}
              icon={PinIcon({ color: c.stroke })}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{f.nome}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>
                    Centroide · {f.centroide.lat.toFixed(4)}, {f.centroide.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FlyToFazenda fazenda={fazenda} />
      </MapContainer>
    </div>
  );
}
