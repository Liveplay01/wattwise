import { clamp } from "@/lib/utils";
import type { EnergyScore, EnergyType } from "./types";
import {
  ENERGY_LABELS,
  COST_INFO,
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

export function computeSolarScore(radiation: number): number {
  const score = ((radiation - 2.0) / (5.0 - 2.0)) * 75 + 25;
  return Math.round(clamp(score, 10, 100));
}

export function computeWindScore(windSpeed: number): number {
  const score = ((windSpeed - 3) / (10 - 3)) * 85 + 15;
  return Math.round(clamp(score, 5, 100));
}

export function computeWaterScore(waterwayCount: number, elevation: number): number {
  const waterwayScore = Math.min(waterwayCount * 12, 60);
  const elevationBonus = elevation > 500 ? 30 : elevation > 300 ? 20 : elevation > 150 ? 10 : 0;
  const score = waterwayScore + elevationBonus;
  return Math.round(clamp(score, waterwayCount === 0 ? 5 : 8, 95));
}

function buildReasoning(
  recommendation: EnergyType,
  solarAdj: number,
  windAdj: number,
  waterAdj: number,
  data: RawApiData
): string {
  switch (recommendation) {
    case "solar":
      return `Mit ${data.solarRadiation.toFixed(1)} kWh/m²/Tag Sonneneinstrahlung und einem gewichteten Score von ${solarAdj}/100 bietet dein Standort das beste Verhältnis aus Potenzial und Aufwand für eine Solaranlage. ${
        windAdj < 40 ? "Der Wind ist hier vergleichsweise schwach." : "Solar punktet hier durch die deutlich niedrigeren Kosten und einfachere Installation."
      }`;
    case "wind":
      return `Mit ${data.windSpeed.toFixed(1)} m/s Windgeschwindigkeit (gewichteter Score: ${windAdj}/100) lohnt sich an deinem Standort trotz höherer Investitionskosten eine Windanlage. ${
        data.elevation > 300
          ? `Die Höhenlage von ${Math.round(data.elevation)} m begünstigt konstante Winde.`
          : "Das Windpotenzial überwiegt hier klar gegenüber den anderen Optionen."
      }`;
    case "water":
      return `Mit ${data.waterwayCount} Gewässer${data.waterwayCount !== 1 ? "n" : ""} im Umkreis und ${Math.round(data.elevation)} m Höhenlage erreicht Wasserkraft hier einen gewichteten Score von ${waterAdj}/100. Trotz komplexer Genehmigungslage hat dein Standort das höchste Wasserkraftpotenzial.`;
  }
}

export function computeEnergyScore(
  data: RawApiData,
  lat: number,
  lng: number,
  address?: string
): EnergyScore {
  // Raw potential scores
  const solar = computeSolarScore(data.solarRadiation);
  const wind = computeWindScore(data.windSpeed);
  const water = computeWaterScore(data.waterwayCount, data.elevation);

  // Cost-adjusted scores (raw × cost factor)
  const solarAdj = Math.round(solar * COST_INFO.solar.costFactor);
  const windAdj = Math.round(wind * COST_INFO.wind.costFactor);
  const waterAdj = Math.round(water * COST_INFO.water.costFactor);

  // Recommendation based on adjusted scores; solar wins ties
  let recommendation: EnergyType = "solar";
  let maxAdj = solarAdj;
  if (windAdj > maxAdj + 5) { recommendation = "wind"; maxAdj = windAdj; }
  if (waterAdj > maxAdj + 5) { recommendation = "water"; }

  const jahresertrag = Math.round(data.solarRadiation * 365 * 0.18);

  return {
    solar,
    wind,
    water,
    solarAdjusted: solarAdj,
    windAdjusted: windAdj,
    waterAdjusted: waterAdj,
    recommendation,
    recommendationLabel: ENERGY_LABELS[recommendation],
    reasoning: buildReasoning(recommendation, solarAdj, windAdj, waterAdj, data),
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
    costInfo: {
      solar: COST_INFO.solar,
      wind: COST_INFO.wind,
      water: COST_INFO.water,
    },
    rawData: data,
  };
}
