"use client";

import { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

const emeraldIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:28px;height:28px;
        border-radius:50%;
        background:rgba(62,207,142,0.2);
        animation:pulse-ring 1.5s ease-out infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:16px;height:16px;
        border-radius:50%;
        background:#3ecf8e;
        border:2px solid #fff;
        box-shadow:0 0 0 2px #3ecf8e, 0 2px 8px rgba(0,0,0,0.5);
      "></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface LocationMarkerProps {
  lat: number;
  lng: number;
}

export default function LocationMarker({ lat, lng }: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 12), {
      duration: 1.2,
    });
  }, [lat, lng, map]);

  return <Marker position={[lat, lng]} icon={emeraldIcon} />;
}
