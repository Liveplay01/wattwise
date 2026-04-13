"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1c1c1c] flex items-center justify-center">
      <div className="text-muted-foreground text-sm animate-pulse">
        Karte wird geladen…
      </div>
    </div>
  ),
});

interface MapViewProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
}

export default function MapView(props: MapViewProps) {
  return <MapClient {...props} />;
}
