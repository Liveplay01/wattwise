import { Sun, Wind, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnergyType } from "@/lib/energy/types";

const ICONS = {
  solar: Sun,
  wind: Wind,
  water: Droplets,
};

const GRADIENTS = {
  solar: "from-yellow-400/10 via-yellow-400/5 to-transparent",
  wind: "from-blue-400/10 via-blue-400/5 to-transparent",
  water: "from-cyan-400/10 via-cyan-400/5 to-transparent",
};

const ICON_COLORS = {
  solar: "text-yellow-400",
  wind: "text-blue-400",
  water: "text-cyan-400",
};

const ICON_BG = {
  solar: "bg-yellow-400/15",
  wind: "bg-blue-400/15",
  water: "bg-cyan-400/15",
};

interface RecommendationBannerProps {
  recommendation: EnergyType;
  label: string;
  reasoning: string;
  address?: string;
}

export default function RecommendationBanner({
  recommendation,
  label,
  reasoning,
  address,
}: RecommendationBannerProps) {
  const Icon = ICONS[recommendation];

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/30 overflow-hidden",
        "bg-gradient-to-br",
        GRADIENTS[recommendation]
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
              ICON_BG[recommendation]
            )}
          >
            <Icon className={cn("w-7 h-7", ICON_COLORS[recommendation])} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
              Empfehlung
            </p>
            <h3 className="text-xl font-bold text-foreground mb-1">{label}</h3>
            {address && (
              <p className="text-xs text-muted-foreground mb-2 truncate">
                📍 {address}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
