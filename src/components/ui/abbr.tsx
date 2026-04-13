"use client";

import { cn } from "@/lib/utils";

interface AbbrProps {
  short: string;
  long: string;
  className?: string;
}

/**
 * Inline abbreviation with hover tooltip.
 * Renders the short form with a dotted underline; hovering shows the full text.
 */
export function Abbr({ short, long, className }: AbbrProps) {
  return (
    <span className="relative group/abbr inline-block">
      <span
        className={cn(
          "underline decoration-dotted decoration-muted-foreground/50 cursor-help",
          className
        )}
      >
        {short}
      </span>
      {/* Tooltip */}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[9999]",
          "px-2.5 py-1.5 rounded-lg border border-border bg-popover shadow-xl",
          "text-xs text-foreground whitespace-nowrap",
          "opacity-0 scale-95 group-hover/abbr:opacity-100 group-hover/abbr:scale-100",
          "transition-all duration-150 ease-out"
        )}
      >
        {long}
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
      </span>
    </span>
  );
}

// All abbreviations used in Wattwise
export const ABBR = {
  TEur:    { short: "T€",           long: "Tausend Euro (× 1.000 €)" },
  ROI:     { short: "ROI",          long: "Return on Investment – Amortisationszeit" },
  kWp:     { short: "kWp",          long: "Kilowatt-Peak – Nennleistung einer Solaranlage" },
  kWh:     { short: "kWh",          long: "Kilowattstunde – Einheit für Energiemenge" },
  kWhM2:   { short: "kWh/m²/Tag",   long: "Kilowattstunden pro Quadratmeter pro Tag" },
  kWhKwp:  { short: "kWh/kWp/Jahr", long: "Kilowattstunden pro Kilowatt-Peak pro Jahr – Solarertrag" },
  ms:      { short: "m/s",          long: "Meter pro Sekunde – Windgeschwindigkeit" },
  mNN:     { short: "m ü. NN",      long: "Meter über Normalnull – Höhe über dem Meeresspiegel" },
  IEC:     { short: "IEC",          long: "International Electrotechnical Commission – Windklassen-Norm" },
} as const;
