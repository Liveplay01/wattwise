"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchSuggestions from "./SearchSuggestions";
import { useGeocoding } from "@/hooks/useGeocoding";
import type { NominatimResult } from "@/lib/geocoding/nominatim";

interface AddressSearchProps {
  onSelect: (lat: number, lng: number, address: string) => void;
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isLoading } = useGeocoding(query);

  useEffect(() => {
    setIsOpen(results.length > 0 && query.length >= 3);
  }, [results, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: NominatimResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name.split(",").slice(0, 3).join(", ");
    onSelect(lat, lng, address);
    setQuery(address);
    setIsOpen(false);
  }

  function handleClear() {
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Adresse oder Ort in Deutschland suchen…"
          className="pl-9 pr-9 bg-card/90 backdrop-blur-md border-border/60 focus-visible:border-primary placeholder:text-muted-foreground/60 h-11"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : query ? (
            <button onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
      {isOpen && (
        <SearchSuggestions results={results} onSelect={handleSelect} />
      )}
    </div>
  );
}
