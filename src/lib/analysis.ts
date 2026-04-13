/**
 * Client-side analysis — calls external APIs directly from the browser.
 * All three APIs (Open-Meteo, Overpass, Nominatim) support CORS.
 */

import { isInGermany } from "@/lib/utils";
import { computeEnergyScore } from "@/lib/energy/scoring";
import type { EnergyScore } from "@/lib/energy/types";

async function fetchOpenMeteoForecast(lat: number, lng: number) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 7);
  const end = new Date(today);
  end.setDate(today.getDate() + 7);
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    daily: "shortwave_radiation_sum,wind_speed_10m_max",
    timezone: "Europe/Berlin",
    start_date: fmt(start),
    end_date: fmt(end),
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Open-Meteo Anfrage fehlgeschlagen");
  return res.json();
}

async function fetchElevation(lat: number, lng: number): Promise<number> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
  });
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?${params}`);
    if (!res.ok) return 100;
    const data = await res.json();
    return data.elevation?.[0] ?? 100;
  } catch {
    return 100;
  }
}

async function fetchWaterways(lat: number, lng: number): Promise<number> {
  const query = `[out:json][timeout:10];(way["waterway"~"river|stream|canal|beck"](around:2000,${lat},${lng}););out count;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const totalTag = data.elements?.[0]?.tags?.total;
    if (totalTag !== undefined) return parseInt(String(totalTag), 10) || 0;
    return data.elements?.length ?? 0;
  } catch {
    return 0;
  }
}

export async function analyseLocation(
  lat: number,
  lng: number,
  address?: string
): Promise<EnergyScore> {
  if (!isInGermany(lat, lng)) {
    throw new Error(
      "Wattwise ist derzeit nur für Deutschland verfügbar 🇩🇪. Bitte wähle einen Standort in Deutschland."
    );
  }

  const [forecast, elevation, waterwayCount] = await Promise.all([
    fetchOpenMeteoForecast(lat, lng),
    fetchElevation(lat, lng),
    fetchWaterways(lat, lng),
  ]);

  const radiationValues: number[] = forecast.daily?.shortwave_radiation_sum ?? [];
  const windValues: number[] = forecast.daily?.wind_speed_10m_max ?? [];

  const validRadiation = radiationValues.filter((v: number) => v != null && v > 0);
  const avgRadiation =
    validRadiation.length > 0
      ? validRadiation.reduce((a: number, b: number) => a + b, 0) / validRadiation.length
      : 11.52;

  // Open-Meteo daily shortwave_radiation_sum is in MJ/m² → convert to kWh/m²
  const avgRadiationKwh = avgRadiation * 0.277778;

  const validWind = windValues.filter((v: number) => v != null && v > 0);
  const avgWind =
    validWind.length > 0
      ? validWind.reduce((a: number, b: number) => a + b, 0) / validWind.length
      : 5.0;

  return computeEnergyScore(
    {
      solarRadiation: avgRadiationKwh,
      windSpeed: avgWind,
      elevation,
      waterwayCount,
    },
    lat,
    lng,
    address
  );
}
