"use client";

import { useState, useEffect, useRef } from "react";
import { geocodeAddress, type NominatimResult } from "@/lib/geocoding/nominatim";

export function useGeocoding(query: string, delay = 400) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim() || query.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    timerRef.current = setTimeout(async () => {
      if (query === lastQueryRef.current) return;
      lastQueryRef.current = query;
      try {
        const data = await geocodeAddress(query);
        setResults(data);
        setError(null);
      } catch {
        setError("Adresse konnte nicht gefunden werden");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, delay]);

  return { results, isLoading, error };
}
