"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), { ssr: false });

interface MapViewProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onInvalidClick?: (reason: string) => void;
  selectedLat?: number;
  selectedLng?: number;
  theme?: "dark" | "light";
}

export default function MapView(props: MapViewProps) {
  const bg = props.theme === "light" ? "#f7f7f7" : "#1c1c1c";
  return (
    <div className="w-full h-full" style={{ background: bg }}>
      <MapClient {...props} />
    </div>
  );
}
