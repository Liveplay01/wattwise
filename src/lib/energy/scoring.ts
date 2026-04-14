import { clamp } from "@/lib/utils";
import type { EnergyScore, EnergyType, UserPreferences } from "./types";
import {
  ENERGY_LABELS,
  COST_INFO,
  getSolarClass,
  getWindClass,
  getWaterProximity,
  getWaterPotential,
  getGeothermalDepthClass,
  getGeothermalPotential,
} from "./constants";

interface RawApiData {
  solarRadiation: number;   // average kWh/m²/day from Open-Meteo
  windSpeed: number;        // max wind speed m/s from Open-Meteo
  elevation: number;        // meters above sea level
  waterwayCount: number;    // number of waterways within 2km
  meanTemperature: number;  // mean 2m air temperature °C from Open-Meteo
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

export function computeGeothermalScore(meanTemperature: number, elevation: number): number {
  // Temperature component: 6°C → 5 pts, 13°C → 70 pts
  const tempScore = clamp(((meanTemperature - 6.0) / (13.0 - 6.0)) * 70, 5, 70);
  // Elevation bonus: lower elevation = cheaper drilling + warmer shallow ground
  const elevBonus = elevation < 200 ? 30 : elevation < 500 ? 20 : elevation < 800 ? 12 : 5;
  return Math.round(clamp(tempScore + elevBonus, 5, 95));
}

function getBoreholeDepthEstimate(elevation: number): string {
  if (elevation < 200) return "ca. 80–120 m";
  if (elevation < 500) return "ca. 100–150 m";
  if (elevation < 800) return "ca. 130–180 m";
  return "ca. 160–220 m";
}

function buildReasoning(
  recommendation: EnergyType,
  solarAdj: number,
  windAdj: number,
  waterAdj: number,
  geothermalAdj: number,
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
    case "geothermal":
      return `Mit einer geschätzten Grundtemperatur von ${(data.meanTemperature + 0.5).toFixed(1)}°C und ${Math.round(data.elevation)} m Höhenlage erreicht Geothermie hier einen gewichteten Score von ${geothermalAdj}/100. ${
        data.elevation < 200
          ? "Die flache Lage ermöglicht günstige Bohrbedingungen."
          : data.elevation < 500
          ? "Die Höhenlage erfordert etwas tiefere Bohrungen."
          : "Die Höhenlage macht Bohrungen aufwendiger — trotzdem sinnvoll bei ausreichend Wärme."
      } Eine Erdwärmesonde ist ganzjährig nutzbar und unabhängig von Wetter und Jahreszeit.`;
  }
}

export function computeEnergyScore(
  data: RawApiData,
  lat: number,
  lng: number,
  address?: string,
  prefs?: UserPreferences
): EnergyScore {
  // Raw potential scores
  const solar = computeSolarScore(data.solarRadiation);
  const wind = computeWindScore(data.windSpeed);
  const water = computeWaterScore(data.waterwayCount, data.elevation);
  const geothermal = computeGeothermalScore(data.meanTemperature, data.elevation);

  // Effective cost factors — start from base values, apply preference deltas
  let solarCF = COST_INFO.solar.costFactor;       // 1.00
  let windCF  = COST_INFO.wind.costFactor;         // 0.75
  let waterCF = COST_INFO.water.costFactor;        // 0.65
  let geoCF   = COST_INFO.geothermal.costFactor;   // 0.60

  if (prefs) {
    if (prefs.batterySpeicher)     { solarCF += 0.10; }
    if (prefs.hatSolaranlage)      { solarCF -= 0.20; windCF += 0.05; waterCF += 0.05; geoCF += 0.05; }
    if (prefs.limitiertesBudget)   { solarCF += 0.10; windCF -= 0.05; waterCF -= 0.05; geoCF -= 0.05; }
    if (prefs.grosszuegigesBudget) {
      solarCF  = Math.min(solarCF  + 0.08, 1.0);
      windCF   = Math.min(windCF   + 0.08, 1.0);
      waterCF  = Math.min(waterCF  + 0.08, 1.0);
      geoCF    = Math.min(geoCF    + 0.08, 1.0);
    }
    if (prefs.umweltbewusstsein)    { solarCF += 0.05; windCF += 0.05; waterCF += 0.05; geoCF += 0.05; }
    if (prefs.hoherHeizbedarf)      { geoCF += 0.15; }
    if (prefs.grossesGrundstueck)   { windCF += 0.05; waterCF += 0.05; }
    if (prefs.kenntFoerderprogramme){ solarCF += 0.05; windCF += 0.05; waterCF += 0.05; geoCF += 0.05; }

    // Clamp all to [0.05, 1.0]
    solarCF = Math.min(Math.max(solarCF, 0.05), 1.0);
    windCF  = Math.min(Math.max(windCF,  0.05), 1.0);
    waterCF = Math.min(Math.max(waterCF, 0.05), 1.0);
    geoCF   = Math.min(Math.max(geoCF,   0.05), 1.0);
  }

  // Cost-adjusted scores (raw × effective cost factor)
  const solarAdj = Math.round(solar * solarCF);
  const windAdj = Math.round(wind * windCF);
  const waterAdj = Math.round(water * waterCF);
  const geothermalAdj = Math.round(geothermal * geoCF);

  // Recommendation based on adjusted scores; solar wins ties
  let recommendation: EnergyType = "solar";
  let maxAdj = solarAdj;
  if (windAdj > maxAdj + 5)       { recommendation = "wind";       maxAdj = windAdj; }
  if (waterAdj > maxAdj + 5)      { recommendation = "water";      maxAdj = waterAdj; }
  if (geothermalAdj > maxAdj + 5) { recommendation = "geothermal"; }

  const jahresertrag = Math.round(data.solarRadiation * 365 * 0.18);
  const groundTemp = data.meanTemperature + 0.5;

  return {
    solar,
    wind,
    water,
    geothermal,
    solarAdjusted: solarAdj,
    windAdjusted: windAdj,
    waterAdjusted: waterAdj,
    geothermalAdjusted: geothermalAdj,
    recommendation,
    recommendationLabel: ENERGY_LABELS[recommendation],
    reasoning: buildReasoning(recommendation, solarAdj, windAdj, waterAdj, geothermalAdj, data),
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
      geothermal: {
        grundtemperatur: `${groundTemp.toFixed(1)}°C (geschätzt)`,
        tiefenklasse: getGeothermalDepthClass(data.elevation),
        bohrtiefenschaetzung: getBoreholeDepthEstimate(data.elevation),
        potenzialklasse: getGeothermalPotential(geothermal),
        systemtyp: "Erdwärmesonde (EWS)",
      },
    },
    costInfo: {
      solar:      { ...COST_INFO.solar,      costFactor: solarCF },
      wind:       { ...COST_INFO.wind,       costFactor: windCF  },
      water:      { ...COST_INFO.water,      costFactor: waterCF },
      geothermal: { ...COST_INFO.geothermal, costFactor: geoCF   },
    },
    rawData: data,
  };
}
