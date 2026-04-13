import type { EnergyType } from "./types";

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
