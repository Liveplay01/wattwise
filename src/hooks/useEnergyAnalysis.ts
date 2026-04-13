"use client";

import { useQuery } from "@tanstack/react-query";
import { analyseLocation } from "@/lib/analysis";
import type { EnergyScore } from "@/lib/energy/types";

export interface AnalyseRequest {
  lat: number;
  lng: number;
  address?: string;
}

export function useEnergyAnalysis(location: AnalyseRequest | null) {
  return useQuery<EnergyScore, Error>({
    queryKey: ["analyse", location?.lat, location?.lng],
    queryFn: () => analyseLocation(location!.lat, location!.lng, location!.address),
    enabled: !!location,
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 1,
  });
}
