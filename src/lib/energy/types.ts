export type EnergyType = "solar" | "wind" | "water" | "geothermal";

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

export interface GeothermalMetrics {
  grundtemperatur: string;
  tiefenklasse: string;
  bohrtiefenschaetzung: string;
  potenzialklasse: string;
  systemtyp: string;
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
  geothermal: number;
  solarAdjusted: number;  // cost-weighted score
  windAdjusted: number;
  waterAdjusted: number;
  geothermalAdjusted: number;
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
    geothermal: GeothermalMetrics;
  };
  costInfo: {
    solar: CostInfo;
    wind: CostInfo;
    water: CostInfo;
    geothermal: CostInfo;
  };
  rawData: {
    solarRadiation: number;
    windSpeed: number;
    elevation: number;
    waterwayCount: number;
    meanTemperature: number;
  };
}

export interface AnalyseRequest {
  lat: number;
  lng: number;
  address?: string;
}

export interface UserPreferences {
  batterySpeicher: boolean;        // Besitze Batteriespeicher
  hatSolaranlage: boolean;         // Besitze bereits Solaranlage
  limitiertesBudget: boolean;      // Begrenztes Budget (<10k€)
  grosszuegigesBudget: boolean;    // Großzügiges Budget (>50k€)
  umweltbewusstsein: boolean;      // Umweltbewusstsein maximieren
  hoherHeizbedarf: boolean;        // Hoher Heizbedarf
  grossesGrundstueck: boolean;     // Großes Grundstück (>500m²)
  kenntFoerderprogramme: boolean;  // Kenne Förderprogramme
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  batterySpeicher: false,
  hatSolaranlage: false,
  limitiertesBudget: false,
  grosszuegigesBudget: false,
  umweltbewusstsein: false,
  hoherHeizbedarf: false,
  grossesGrundstueck: false,
  kenntFoerderprogramme: false,
};
