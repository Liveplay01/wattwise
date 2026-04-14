"use client";

import { MapContainer, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationMarker from "./LocationMarker";
import { isInGermany } from "@/lib/utils";

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const GERMANY_CENTER: [number, number] = [51.2, 10.5];
const GERMANY_BOUNDS: [[number, number], [number, number]] = [
  [47.27, 5.87],
  [55.06, 15.03],
];

// OSM classes that count as selectable property
const ALLOWED_CLASSES = new Set(["building"]);
const ALLOWED_LANDUSE = new Set(["residential", "garden", "allotments", "farmyard", "farm"]);

async function checkIsProperty(lat: number, lng: number): Promise<{ ok: boolean; reason?: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18`,
      { headers: { "Accept-Language": "de", "User-Agent": "Wattwise/1.0 WDG-Schulprojekt" } }
    );
    if (!res.ok) return { ok: true }; // Im Zweifel erlauben
    const data = await res.json();
    const cls: string = data.class ?? "";
    const type: string = data.type ?? "";

    if (ALLOWED_CLASSES.has(cls)) return { ok: true };
    if (cls === "landuse" && ALLOWED_LANDUSE.has(type)) return { ok: true };
    if (cls === "place" && type === "house") return { ok: true };

    if (cls === "highway" || cls === "railway" || cls === "aeroway") {
      return { ok: false, reason: "Straßen und Wege können nicht analysiert werden. Bitte wähle ein Gebäude oder Grundstück." };
    }
    if (cls === "leisure" || (cls === "landuse" && ["park", "recreation_ground", "grass", "forest"].includes(type))) {
      return { ok: false, reason: "Öffentliche Grünflächen sind nicht auswählbar. Bitte wähle ein Wohngrundstück." };
    }
    if (cls === "amenity" || cls === "tourism" || cls === "boundary") {
      return { ok: false, reason: "Öffentliche Orte können nicht analysiert werden. Bitte wähle ein Haus oder einen Garten." };
    }

    // Unbekannte Klasse – im Zweifel ablehnen und Hinweis geben
    return { ok: false, reason: "Bitte wähle ein Gebäude oder ein Wohngrundstück aus." };
  } catch {
    return { ok: true }; // Netzwerkfehler → trotzdem erlauben
  }
}

interface ClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onInvalidClick?: (reason: string) => void;
}

function ClickHandler({ onLocationSelect, onInvalidClick }: ClickHandlerProps) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      if (!isInGermany(lat, lng)) {
        onInvalidClick?.("Wattwise analysiert nur Standorte in Deutschland.");
        return;
      }
      const { ok, reason } = await checkIsProperty(lat, lng);
      if (!ok) {
        onInvalidClick?.(reason ?? "Bitte wähle ein Gebäude oder Grundstück.");
        return;
      }
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

interface MapClientProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onInvalidClick?: (reason: string) => void;
  selectedLat?: number;
  selectedLng?: number;
  theme?: "dark" | "light";
}

export default function MapClient({
  onLocationSelect,
  onInvalidClick,
  selectedLat,
  selectedLng,
  theme = "dark",
}: MapClientProps) {
  const tileUrl  = theme === "light" ? TILE_LIGHT : TILE_DARK;
  const mapBg    = theme === "light" ? "#f7f7f7" : "#1c1c1c";

  return (
    <MapContainer
      center={GERMANY_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      maxBounds={GERMANY_BOUNDS}
      maxBoundsViscosity={0.8}
      className="w-full h-full"
      style={{ background: mapBg }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
        subdomains="abcd"
      />
      {/* Zoom-Buttons unten rechts, weg vom Logo */}
      <ZoomControl position="bottomright" />
      <ClickHandler onLocationSelect={onLocationSelect} onInvalidClick={onInvalidClick} />
      {selectedLat !== undefined && selectedLng !== undefined && (
        <LocationMarker lat={selectedLat} lng={selectedLng} />
      )}
    </MapContainer>
  );
}
