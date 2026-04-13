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

export interface EnergyScore {
  solar: number;
  wind: number;
  water: number;
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
