"use client";

import { useState, useCallback } from "react";
import { isInGermany } from "@/lib/utils";

export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

export function useMapLocation() {
  const [location, setLocation] = useState<MapLocation | null>(null);

  const selectLocation = useCallback(
    (lat: number, lng: number, address?: string) => {
      if (!isInGermany(lat, lng)) return false;
      setLocation({ lat, lng, address });
      return true;
    },
    []
  );

  const clearLocation = useCallback(() => {
    setLocation(null);
  }, []);

  return { location, selectLocation, clearLocation };
}
