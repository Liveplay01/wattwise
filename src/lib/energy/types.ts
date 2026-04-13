export type EnergyType = "solar" | "wind" | "water";

export interface SolarMetrics {
  jahresertrag: string;
  einstrahlungsklasse: string;
  strahlungswert: string;
}

export interface WindMetrics {
  mittlereWindgeschwindigkeit: string;
  windklasse: string;
  spitzengeschwindigkeit: string;
}

export interface WaterMetrics {
  gewaessernähe: string;
  anzahlGewaesser: number;
  hoehenlage: string;
  potenzialklasse: string;
}

export interface CostInfo {
  minEur: number;
  maxEur: number;
  paybackYears: string;
  difficulty: "Einfach" | "Anspruchsvoll" | "Sehr komplex";
  permitRequired: boolean;
  costFactor: number; // 0–1 weight applied to raw score
}

export interface EnergyScore {
  solar: number;        // raw potential score 0–100
  wind: number;
  water: number;
  solarAdjusted: number;  // cost-weighted score
  windAdjusted: number;
  waterAdjusted: number;
  recommendation: EnergyType;
  recommendationLabel: string;
  reasoning: string;
  lat: number;
  lng: number;
  address?: string;
  metrics: {
    solar: SolarMetrics;
    wind: WindMetrics;
    water: WaterMetrics;
  };
  costInfo: {
    solar: CostInfo;
    wind: CostInfo;
    water: CostInfo;
  };
  rawData: {
    solarRadiation: number;
    windSpeed: number;
    elevation: number;
    waterwayCount: number;
  };
}

export interface AnalyseRequest {
  lat: number;
  lng: number;
  address?: string;
}
