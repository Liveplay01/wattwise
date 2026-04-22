"use client";

import { useState, useCallback } from "react";
import { AlertTriangle, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import AbbreviationLegend from "./AbbreviationLegend";
import { Abbr, ABBR } from "@/components/ui/abbr";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import AppBreadcrumb from "@/components/navigation/AppBreadcrumb";
import AnalysisSkeleton from "./AnalysisSkeleton";
import RecommendationBanner from "./RecommendationBanner";
import EnergyScoreCard from "./EnergyScoreCard";
import MetricRow from "./MetricRow";
import type { EnergyScore, UserPreferences } from "@/lib/energy/types";

type Step = "preferences" | "start" | "analyse" | "ergebnis";

function getStep(showPreferences: boolean, isLoading: boolean, data: EnergyScore | undefined): Step {
  if (showPreferences && !data && !isLoading) return "preferences";
  if (!data && !isLoading) return "start";
  if (isLoading) return "analyse";
  return "ergebnis";
}

interface PreferenceItem {
  key: keyof UserPreferences;
  label: string;
  desc: string;
  icon: string;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  { key: "batterySpeicher",      label: "Besitze Batteriespeicher",          desc: "Solar-ROI verbessert sich durch höheren Eigenverbrauch", icon: "🔋" },
  { key: "hatSolaranlage",       label: "Besitze bereits Solaranlage",       desc: "Andere Energiequellen werden bevorzugt",                 icon: "☀️" },
  { key: "limitiertesBudget",    label: "Begrenztes Budget (<10.000 €)",     desc: "Günstigste Option wird stärker gewichtet",              icon: "💶" },
  { key: "grosszuegigesBudget",  label: "Großzügiges Budget (>50.000 €)",    desc: "Kosten spielen eine geringere Rolle",                   icon: "💼" },
  { key: "umweltbewusstsein",    label: "Umweltbewusstsein maximieren",      desc: "Alle erneuerbaren Quellen werden leicht aufgewertet",   icon: "🌿" },
  { key: "hoherHeizbedarf",      label: "Hoher Heizbedarf (Heizung/Warmwasser)", desc: "Geothermie als ganzjährige Wärmequelle wird besser bewertet", icon: "🏠" },
  { key: "grossesGrundstueck",   label: "Großes Grundstück (>500 m²)",      desc: "Mehr Platz für Wind- und Wasseranlagen",                icon: "🌳" },
  { key: "kenntFoerderprogramme",label: "Kenne Förderprogramme",            desc: "Subventionen reduzieren die effektive Kostenbarriere",  icon: "📋" },
];

interface DrawerPreferencesProps {
  initialPreferences: UserPreferences;
  onConfirm: (prefs: UserPreferences, forever: boolean) => void;
  onSkip: () => void;
}

function DrawerPreferences({ initialPreferences, onConfirm, onSkip }: DrawerPreferencesProps) {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(initialPreferences);
  const [nichtMehrAnzeigen, setNichtMehrAnzeigen] = useState(false);

  const handleToggle = useCallback((key: keyof UserPreferences, value: boolean) => {
    if (key === "limitiertesBudget" && value) {
      setLocalPrefs(p => ({ ...p, limitiertesBudget: true, grosszuegigesBudget: false }));
    } else if (key === "grosszuegigesBudget" && value) {
      setLocalPrefs(p => ({ ...p, grosszuegigesBudget: true, limitiertesBudget: false }));
    } else {
      setLocalPrefs(p => ({ ...p, [key]: value }));
    }
  }, []);

  const hasAnyActive = Object.values(localPrefs).some(Boolean);

  return (
    <div
      className="px-4 pb-6 space-y-4"
      style={{ animation: "step-fade-in 0.35s ease-out both" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-bold text-foreground text-sm leading-tight">Analyse anpassen</p>
          <p className="text-xs text-muted-foreground">Aktiviere, was auf dich zutrifft</p>
        </div>
      </div>

      {/* Preference items */}
      <div className="space-y-1">
        {PREFERENCE_ITEMS.map((item) => {
          const checked = localPrefs[item.key];
          const isMutedOut =
            (item.key === "limitiertesBudget" && localPrefs.grosszuegigesBudget) ||
            (item.key === "grosszuegigesBudget" && localPrefs.limitiertesBudget);

          return (
            <div
              key={item.key}
              onClick={() => !isMutedOut && handleToggle(item.key, !checked)}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-150",
                checked
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-secondary/30 hover:border-border/80 hover:bg-secondary/50",
                isMutedOut && "opacity-40 pointer-events-none"
              )}
            >
              <Switch
                checked={checked}
                onCheckedChange={(v) => handleToggle(item.key, v)}
                className="mt-0.5 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className={cn("text-sm font-medium leading-snug", checked ? "text-foreground" : "text-foreground/80")}>
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Don't show again" toggle */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none pt-1"
        onClick={() => setNichtMehrAnzeigen(!nichtMehrAnzeigen)}
      >
        <Switch
          checked={nichtMehrAnzeigen}
          onCheckedChange={setNichtMehrAnzeigen}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text-xs text-muted-foreground">Nicht mehr anzeigen</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSkip}
          className="flex-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl py-2.5 transition-colors"
        >
          Überspringen
        </button>
        <button
          onClick={() => onConfirm(localPrefs, nichtMehrAnzeigen)}
          className={cn(
            "flex-[2] text-sm font-semibold rounded-xl py-2.5 transition-all duration-150",
            hasAnyActive
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-primary/80 text-primary-foreground hover:bg-primary"
          )}
        >
          {hasAnyActive ? "Analyse starten ✓" : "Analyse starten"}
        </button>
      </div>
    </div>
  );
}

interface AnalysisDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  data: EnergyScore | undefined;
  error: Error | null;
  showPreferences: boolean;
  initialPreferences: UserPreferences;
  onPrefsConfirm: (prefs: UserPreferences, forever: boolean) => void;
  onPrefsSkip: () => void;
}

export default function AnalysisDrawer({
  open,
  onOpenChange,
  isLoading,
  data,
  error,
  showPreferences,
  initialPreferences,
  onPrefsConfirm,
  onPrefsSkip,
}: AnalysisDrawerProps) {
  const step = getStep(showPreferences, isLoading, data);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-base text-foreground">Standortanalyse</DrawerTitle>
            <AppBreadcrumb step={step} />
          </div>
          <DrawerDescription className="sr-only">
            Analyse der Energiepotenziale für deinen gewählten Standort
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 pb-safe">
          {/* Preferences step */}
          {step === "preferences" && (
            <DrawerPreferences
              key="preferences"
              initialPreferences={initialPreferences}
              onConfirm={onPrefsConfirm}
              onSkip={onPrefsSkip}
            />
          )}

          {/* Error */}
          {error && !isLoading && step !== "preferences" && (
            <div
              className="mx-4 mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3"
              style={{ animation: "step-fade-in 0.3s ease-out both" }}
            >
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Analysefehler</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && <AnalysisSkeleton />}

          {/* Results */}
          {data && !isLoading && (
            <div
              className="space-y-4 px-4 pb-6"
              style={{ animation: "step-fade-in 0.4s ease-out both" }}
            >
              <RecommendationBanner
                recommendation={data.recommendation}
                label={data.recommendationLabel}
                reasoning={data.reasoning}
                address={data.address}
              />

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-0.5">
                  Alle Energiequellen im Vergleich
                </p>
                <p className="text-[10px] text-muted-foreground/70 mb-3 px-0.5">
                  Score = Potenzial × Kosten-Faktor · Tippe eine Karte auf für Details & Anbieter
                </p>
                <div className="space-y-2">
                  {(["solar", "wind", "water", "geothermal"] as const).map((type, i) => (
                    <div
                      key={type}
                      style={{ animation: `card-enter 0.4s ease-out ${i * 80}ms both` }}
                    >
                      <EnergyScoreCard
                        type={type}
                        score={data[type]}
                        adjustedScore={data[`${type}Adjusted` as keyof EnergyScore] as number}
                        isRecommended={data.recommendation === type}
                        costInfo={data.costInfo[type]}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Solar metrics */}
              <div className="rounded-lg border border-border bg-card p-4" style={{ animation: "card-enter 0.4s ease-out 320ms both" }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  ☀️ Solar-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label={<>Sonneneinstrahlung (<Abbr {...ABBR.kWhM2} />)</>} value={data.metrics.solar.strahlungswert} />
                  <MetricRow label="Einstrahlungsklasse" value={data.metrics.solar.einstrahlungsklasse} />
                  <MetricRow label={<>Gesch. Jahresertrag (<Abbr {...ABBR.kWhKwp} />)</>} value={data.metrics.solar.jahresertrag} highlight />
                </div>
              </div>

              {/* Wind metrics */}
              <div className="rounded-lg border border-border bg-card p-4" style={{ animation: "card-enter 0.4s ease-out 400ms both" }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🌬️ Wind-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label={<>Ø Windgeschwindigkeit (<Abbr {...ABBR.ms} />)</>} value={data.metrics.wind.mittlereWindgeschwindigkeit} />
                  <MetricRow label={<><Abbr {...ABBR.IEC} />-Windklasse</>} value={data.metrics.wind.windklasse} />
                  <MetricRow label="Spitzengeschwindigkeit" value={data.metrics.wind.spitzengeschwindigkeit} />
                </div>
              </div>

              {/* Water metrics */}
              <div className="rounded-lg border border-border bg-card p-4" style={{ animation: "card-enter 0.4s ease-out 480ms both" }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  💧 Wasser-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label="Gewässernähe" value={data.metrics.water.gewaessernähe} />
                  <MetricRow label="Gewässer im Umkreis 2 km" value={String(data.metrics.water.anzahlGewaesser)} />
                  <MetricRow label={<>Höhenlage (<Abbr {...ABBR.mNN} />)</>} value={data.metrics.water.hoehenlage} />
                  <MetricRow label="Potenzialklasse" value={data.metrics.water.potenzialklasse} highlight />
                </div>
              </div>

              {/* Geothermal metrics */}
              <div className="rounded-lg border border-border bg-card p-4" style={{ animation: "card-enter 0.4s ease-out 560ms both" }}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🌡️ Geothermie-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label="Geschätzte Grundtemperatur" value={data.metrics.geothermal.grundtemperatur} />
                  <MetricRow label="Standortklasse" value={data.metrics.geothermal.tiefenklasse} />
                  <MetricRow label="Bohrtiefe (Schätzung)" value={data.metrics.geothermal.bohrtiefenschaetzung} />
                  <MetricRow label="Systemtyp" value={data.metrics.geothermal.systemtyp} />
                  <MetricRow label="Potenzialklasse" value={data.metrics.geothermal.potenzialklasse} highlight />
                </div>
              </div>

              {/* Abbreviation legend */}
              <AbbreviationLegend />

              <p className="text-[11px] text-muted-foreground/60 text-center pb-2">
                Daten: Open-Meteo API · OpenStreetMap Overpass API · Geothermie: Proxy-Modell · Keine Gewähr
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
