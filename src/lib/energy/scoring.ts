import { clamp } from "@/lib/utils";
import type { EnergyScore, EnergyType } from "./types";
import {
  ENERGY_LABELS,
  getSolarClass,
  getWindClass,
  getWaterProximity,
  getWaterPotential,
} from "./constants";

interface RawApiData {
  solarRadiation: number;   // average kWh/m²/day from Open-Meteo
  windSpeed: number;        // max wind speed m/s from Open-Meteo
  elevation: number;        // meters above sea level
  waterwayCount: number;    // number of waterways within 2km
}

/**
 * Compute a solar score (0–100) from average shortwave radiation.
 * Germany annual daily avg: ~2.5–4.2 kWh/m²/day (south Bavaria highest)
 * Short-term 14-day window: ~1.5–6.0 kWh/m²/day (season dependent)
 */
export function computeSolarScore(radiation: number): number {
  // Linear map: 2.0 → 25, 5.0 → 100
  const score = ((radiation - 2.0) / (5.0 - 2.0)) * 75 + 25;
  return Math.round(clamp(score, 10, 100));
}

/**
 * Compute a wind score (0–100) from wind speed.
 * Germany range: ~3–10 m/s
 */
export function computeWindScore(windSpeed: number): number {
  // Linear map: 3 m/s → 15, 10 m/s → 100
  const score = ((windSpeed - 3) / (10 - 3)) * 85 + 15;
  return Math.round(clamp(score, 5, 100));
}

/**
 * Compute a water/hydro score (0–100).
 * Based on number of nearby waterways and elevation (higher = more gradient potential).
 */
export function computeWaterScore(waterwayCount: number, elevation: number): number {
  const waterwayScore = Math.min(waterwayCount * 12, 60);
  const elevationBonus = elevation > 500 ? 30 : elevation > 300 ? 20 : elevation > 150 ? 10 : 0;
  const score = waterwayScore + elevationBonus;
  return Math.round(clamp(score, waterwayCount === 0 ? 5 : 8, 95));
}

function buildReasoning(
  recommendation: EnergyType,
  solar: number,
  wind: number,
  water: number,
  data: RawApiData
): string {
  switch (recommendation) {
    case "solar":
      return `Mit einer durchschnittlichen Sonneneinstrahlung von ${data.solarRadiation.toFixed(1)} kWh/m²/Tag (Score: ${solar}/100) bietet dein Standort das beste Potenzial für eine Solaranlage. ${
        wind < 40 ? "Der Wind ist hier vergleichsweise schwach" : "Auch die Windbedingungen sind vorhanden"
      }, aber Solar liefert hier den höchsten Ertrag.`;
    case "wind":
      return `Mit Windgeschwindigkeiten von ${data.windSpeed.toFixed(1)} m/s (Score: ${wind}/100) ist dein Standort gut für eine Windanlage geeignet. ${
        data.elevation > 300
          ? `Die Höhenlage von ${Math.round(data.elevation)} m begünstigt konstante Winde.`
          : "Die Windverhältnisse überwiegen hier gegenüber Solar und Wasser."
      }`;
    case "water":
      return `Mit ${data.waterwayCount} Gewässer${data.waterwayCount !== 1 ? "n" : ""} im Umkreis von 2 km und einer Höhenlage von ${Math.round(
        data.elevation
      )} m bietet dein Standort das beste Wasserkraftpotenzial (Score: ${water}/100). ${
        data.elevation > 300
          ? "Das Gefälle im hügeligen Terrain ermöglicht effiziente Wasserkraftnutzung."
          : "Nahe Gewässer mit nutzbarem Gefälle machen Wasserkraft hier attraktiv."
      }`;
  }
}

export function computeEnergyScore(
  data: RawApiData,
  lat: number,
  lng: number,
  address?: string
): EnergyScore {
  const solar = computeSolarScore(data.solarRadiation);
  const wind = computeWindScore(data.windSpeed);
  const water = computeWaterScore(data.waterwayCount, data.elevation);

  // Determine recommendation: highest score wins; solar tiebreaks over wind over water
  let recommendation: EnergyType = "solar";
  let maxScore = solar;
  if (wind > maxScore + 4) {
    recommendation = "wind";
    maxScore = wind;
  }
  if (water > maxScore + 4) {
    recommendation = "water";
  }

  const jahresertrag = Math.round(data.solarRadiation * 365 * 0.18); // ~18% panel efficiency

  return {
    solar,
    wind,
    water,
    recommendation,
    recommendationLabel: ENERGY_LABELS[recommendation],
    reasoning: buildReasoning(recommendation, solar, wind, water, data),
    lat,
    lng,
    address,
    metrics: {
      solar: {
        jahresertrag: `${jahresertrag} kWh/kWp/Jahr`,
        einstrahlungsklasse: getSolarClass(data.solarRadiation),
        strahlungswert: `${data.solarRadiation.toFixed(2)} kWh/m²/Tag`,
      },
      wind: {
        mittlereWindgeschwindigkeit: `${data.windSpeed.toFixed(1)} m/s`,
        windklasse: getWindClass(data.windSpeed),
        spitzengeschwindigkeit: `${(data.windSpeed * 1.4).toFixed(1)} m/s`,
      },
      water: {
        gewaessernähe: getWaterProximity(data.waterwayCount),
        anzahlGewaesser: data.waterwayCount,
        hoehenlage: `${Math.round(data.elevation)} m ü. NN`,
        potenzialklasse: getWaterPotential(water),
      },
    },
    rawData: data,
  };
}
