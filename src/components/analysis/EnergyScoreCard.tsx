"use client";

import { Sun, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreLabel } from "@/lib/energy/constants";
import type { EnergyType } from "@/lib/energy/types";

const ICONS = {
  solar: Sun,
  wind: Wind,
  water: Droplets,
};

const LABELS = {
  solar: "Solaranlage",
  wind: "Windanlage",
  water: "Wasserkraft",
};

const COLORS = {
  solar: "text-yellow-400",
  wind: "text-blue-400",
  water: "text-cyan-400",
};

const BG_COLORS = {
  solar: "bg-yellow-400/10",
  wind: "bg-blue-400/10",
  water: "bg-cyan-400/10",
};

const BAR_COLORS = {
  solar: "bg-yellow-400",
  wind: "bg-blue-400",
  water: "bg-cyan-400",
};

interface EnergyScoreCardProps {
  type: EnergyType;
  score: number;
  isRecommended: boolean;
}

export default function EnergyScoreCard({
  type,
  score,
  isRecommended,
}: EnergyScoreCardProps) {
  const Icon = ICONS[type];

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        isRecommended
          ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(62,207,142,0.1)]"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", BG_COLORS[type])}>
          <Icon className={cn("w-5 h-5", COLORS[type])} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{LABELS[type]}</p>
            {isRecommended && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                EMPFOHLEN
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{getScoreLabel(score)}</p>
        </div>
        <div className={cn(
          "text-lg font-bold tabular-nums",
          isRecommended ? "text-primary" : "text-foreground"
        )}>
          {score}
          <span className="text-xs font-normal text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", BAR_COLORS[type])}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
