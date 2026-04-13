"use client";

import { AlertTriangle } from "lucide-react";
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
import type { EnergyScore } from "@/lib/energy/types";

type Step = "start" | "analyse" | "ergebnis";

function getStep(isLoading: boolean, data: EnergyScore | undefined): Step {
  if (!data && !isLoading) return "start";
  if (isLoading) return "analyse";
  return "ergebnis";
}

interface AnalysisDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  data: EnergyScore | undefined;
  error: Error | null;
}

export default function AnalysisDrawer({
  open,
  onOpenChange,
  isLoading,
  data,
  error,
}: AnalysisDrawerProps) {
  const step = getStep(isLoading, data);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-base text-foreground">
              Standortanalyse
            </DrawerTitle>
            <AppBreadcrumb step={step} />
          </div>
          <DrawerDescription className="sr-only">
            Analyse der Energiepotenziale für deinen gewählten Standort
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 pb-safe">
          {/* Error state */}
          {error && !isLoading && (
            <div className="mx-4 mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Analysefehler</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error.message}</p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && <AnalysisSkeleton />}

          {/* Results */}
          {data && !isLoading && (
            <div className="space-y-4 px-4 pb-6">
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
                <div className="space-y-2">
                  <EnergyScoreCard
                    type="solar"
                    score={data.solar}
                    isRecommended={data.recommendation === "solar"}
                  />
                  <EnergyScoreCard
                    type="wind"
                    score={data.wind}
                    isRecommended={data.recommendation === "wind"}
                  />
                  <EnergyScoreCard
                    type="water"
                    score={data.water}
                    isRecommended={data.recommendation === "water"}
                  />
                </div>
              </div>

              {/* Solar metrics */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  ☀️ Solar-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label="Sonneneinstrahlung" value={data.metrics.solar.strahlungswert} />
                  <MetricRow label="Einstrahlungsklasse" value={data.metrics.solar.einstrahlungsklasse} />
                  <MetricRow label="Geschätzter Jahresertrag" value={data.metrics.solar.jahresertrag} highlight />
                </div>
              </div>

              {/* Wind metrics */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  🌬️ Wind-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label="Windgeschwindigkeit (Ø)" value={data.metrics.wind.mittlereWindgeschwindigkeit} />
                  <MetricRow label="Windklasse" value={data.metrics.wind.windklasse} />
                  <MetricRow label="Spitzengeschwindigkeit" value={data.metrics.wind.spitzengeschwindigkeit} />
                </div>
              </div>

              {/* Water metrics */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  💧 Wasser-Details
                </p>
                <div className="divide-y divide-border/50">
                  <MetricRow label="Gewässernähe" value={data.metrics.water.gewaessernähe} />
                  <MetricRow label="Gewässer im Umkreis 2 km" value={String(data.metrics.water.anzahlGewaesser)} />
                  <MetricRow label="Höhenlage" value={data.metrics.water.hoehenlage} />
                  <MetricRow label="Potenzialklasse" value={data.metrics.water.potenzialklasse} highlight />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground/60 text-center pb-2">
                Daten: Open-Meteo API · OpenStreetMap Overpass API
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
