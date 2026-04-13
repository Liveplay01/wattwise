"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NominatimResult } from "@/lib/geocoding/nominatim";
import { formatDisplayName } from "@/lib/geocoding/nominatim";

interface SearchSuggestionsProps {
  results: NominatimResult[];
  onSelect: (result: NominatimResult) => void;
  className?: string;
}

export default function SearchSuggestions({
  results,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  if (results.length === 0) return null;

  return (
    <ul
      className={cn(
        "absolute top-full left-0 right-0 mt-1 z-[1001] rounded-lg border border-border bg-card shadow-2xl overflow-hidden",
        className
      )}
    >
      {results.map((result) => (
        <li key={result.place_id}>
          <button
            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors text-sm"
            onClick={() => onSelect(result)}
          >
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-foreground leading-snug">
              {formatDisplayName(result)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
