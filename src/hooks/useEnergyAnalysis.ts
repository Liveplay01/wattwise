"use client";

import { useQuery } from "@tanstack/react-query";
import { analyseLocation } from "@/lib/analysis";
import type { EnergyScore, UserPreferences } from "@/lib/energy/types";

export interface AnalyseRequest {
  lat: number;
  lng: number;
  address?: string;
}

/** Stable bitfield hash of 8 preference booleans → string "0"–"255" */
function prefsHash(prefs?: UserPreferences): string {
  if (!prefs) return "0";
  const flags = [
    prefs.batterySpeicher,
    prefs.hatSolaranlage,
    prefs.limitiertesBudget,
    prefs.grosszuegigesBudget,
    prefs.umweltbewusstsein,
    prefs.hoherHeizbedarf,
    prefs.grossesGrundstueck,
    prefs.kenntFoerderprogramme,
  ];
  return flags.reduce((acc, f, i) => acc + (f ? (1 << i) : 0), 0).toString();
}

export function useEnergyAnalysis(
  location: AnalyseRequest | null,
  prefs?: UserPreferences
) {
  return useQuery<EnergyScore, Error>({
    queryKey: ["analyse", location?.lat, location?.lng, prefsHash(prefs)],
    queryFn: () => analyseLocation(location!.lat, location!.lng, location!.address, prefs),
    enabled: !!location,
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 1,
  });
}
