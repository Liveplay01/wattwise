import type { CostInfo, EnergyType } from "./types";

export const ENERGY_LABELS: Record<EnergyType, string> = {
  solar: "Solaranlage",
  wind: "Windanlage",
  water: "Wasserkraft",
};

export const ENERGY_EMOJIS: Record<EnergyType, string> = {
  solar: "☀️",
  wind: "🌬️",
  water: "💧",
};

export const SCORE_LABELS = {
  low: "Gering",
  medium: "Mittel",
  good: "Gut",
  excellent: "Sehr gut",
};

export function getScoreLabel(score: number): string {
  if (score < 30) return SCORE_LABELS.low;
  if (score < 55) return SCORE_LABELS.medium;
  if (score < 75) return SCORE_LABELS.good;
  return SCORE_LABELS.excellent;
}

export function getSolarClass(radiation: number): string {
  if (radiation < 3.0) return "gering";
  if (radiation < 3.6) return "mittel";
  if (radiation < 4.2) return "gut";
  return "sehr gut";
}

export function getWindClass(windSpeed: number): string {
  if (windSpeed < 4) return "IEC Klasse IV";
  if (windSpeed < 6) return "IEC Klasse III";
  if (windSpeed < 8) return "IEC Klasse II";
  return "IEC Klasse I";
}

export function getWaterProximity(count: number): string {
  if (count === 0) return "Keine Gewässer";
  if (count <= 2) return "Gering";
  if (count <= 5) return "Mittel";
  return "Nahe";
}

export function getWaterPotential(score: number): string {
  if (score < 20) return "Sehr gering";
  if (score < 40) return "Gering";
  if (score < 60) return "Mittel";
  if (score < 80) return "Gut";
  return "Sehr gut";
}

// Cost and effort info per energy type (typical German single-family home)
export const COST_INFO: Record<EnergyType, CostInfo> = {
  solar: {
    minEur: 8000,
    maxEur: 20000,
    paybackYears: "8–12 Jahre",
    difficulty: "Einfach",
    permitRequired: false,
    costFactor: 1.0,
  },
  wind: {
    minEur: 20000,
    maxEur: 80000,
    paybackYears: "12–20 Jahre",
    difficulty: "Anspruchsvoll",
    permitRequired: true,
    costFactor: 0.75,
  },
  water: {
    minEur: 30000,
    maxEur: 150000,
    paybackYears: "15–25 Jahre",
    difficulty: "Sehr komplex",
    permitRequired: true,
    costFactor: 0.65,
  },
};

// Curated links per energy type
export const ENERGY_LINKS: Record<EnergyType, { label: string; url: string; desc: string }[]> = {
  solar: [
    { label: "Solaranlage.de", url: "https://www.solaranlage.de", desc: "Vergleichsportal & Angebote" },
    { label: "Enpal", url: "https://www.enpal.de", desc: "Mieten oder kaufen" },
    { label: "Energie-Experten", url: "https://www.energie-experten.org/erneuerbare-energien/photovoltaik", desc: "Ratgeber Photovoltaik" },
    { label: "Verbraucherzentrale", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-sie-vor-dem-kauf-wissen-sollten-8098", desc: "Unabhängige Beratung" },
  ],
  wind: [
    { label: "BWE – Bundesverband WindEnergie", url: "https://www.wind-energie.de", desc: "Infos & Förderung Kleinwindanlagen" },
    { label: "Kleine Windkraft", url: "https://www.kleinwindkraft.de", desc: "Anbieter & Ratgeber" },
    { label: "Energie-Experten", url: "https://www.energie-experten.org/erneuerbare-energien/windkraft", desc: "Ratgeber Windenergie" },
  ],
  water: [
    { label: "Kleinwasserkraft Deutschland", url: "https://www.kleinwasserkraft.de", desc: "Verband & Technikinfos" },
    { label: "Energie-Experten", url: "https://www.energie-experten.org/erneuerbare-energien/wasserkraft", desc: "Ratgeber Wasserkraft" },
    { label: "BMWK – Wasserkraft", url: "https://www.erneuerbare-energien.de/EE/Redaktion/DE/Dossier/wasserkraft.html", desc: "Offizielle Infos Bundesministerium" },
  ],
};

// General info text per energy type
export const ENERGY_INFO: Record<EnergyType, { pros: string[]; cons: string[]; suitable: string }> = {
  solar: {
    pros: [
      "Günstigste und einfachste Lösung für Privatpersonen",
      "Keine Baugenehmigung in den meisten Bundesländern",
      "Kombinierbar mit Batteriespeicher und E-Auto",
      "Wartungsarm, lange Lebensdauer (25+ Jahre)",
    ],
    cons: [
      "Keine Stromerzeugung nachts",
      "Im Winter deutlich weniger Ertrag",
      "Abhängig von Dachausrichtung und Verschattung",
    ],
    suitable: "Für die meisten Wohnhäuser mit geeignetem Dach die erste Wahl.",
  },
  wind: {
    pros: [
      "Erzeugt auch nachts und im Winter Strom",
      "Gut für Standorte mit konstantem Wind",
      "Hoher Jahresertrag bei guten Windverhältnissen",
    ],
    cons: [
      "Baugenehmigung und oft Abstandsregelungen erforderlich",
      "Lärm- und Schattenwurf-Probleme möglich",
      "Hohe Investitionskosten für Privatpersonen",
      "In vielen Wohngebieten nicht zulässig",
    ],
    suitable: "Sinnvoll auf freiem Land oder in Küstenregionen mit viel Wind.",
  },
  water: {
    pros: [
      "Konstante Stromerzeugung, unabhängig von Wetter",
      "Sehr lange Lebensdauer der Anlagen",
      "Höchste Vollaststunden aller erneuerbaren Energien",
    ],
    cons: [
      "Wasserrechtliche Genehmigung zwingend erforderlich",
      "Nur an fließenden Gewässern möglich",
      "Sehr hohe Investitionskosten",
      "Ökologische Auflagen (Fischwanderhilfen etc.)",
    ],
    suitable: "Nur realistisch bei eigenem Bach/Fluss mit ausreichendem Gefälle.",
  },
};
