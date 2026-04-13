"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
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

interface ClickHandlerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function ClickHandler({ onLocationSelect }: ClickHandlerProps) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (isInGermany(lat, lng)) {
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
}

interface MapClientProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
}

export default function MapClient({
  onLocationSelect,
  selectedLat,
  selectedLng,
}: MapClientProps) {
  return (
    <MapContainer
      center={GERMANY_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={18}
      maxBounds={GERMANY_BOUNDS}
      maxBoundsViscosity={0.8}
      className="w-full h-full"
      style={{ background: "#1c1c1c" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      <ClickHandler onLocationSelect={onLocationSelect} />
      {selectedLat !== undefined && selectedLng !== undefined && (
        <LocationMarker lat={selectedLat} lng={selectedLng} />
      )}
    </MapContainer>
  );
}
