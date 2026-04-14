"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserPreferences } from "@/lib/energy/types";
import { DEFAULT_PREFERENCES } from "@/lib/energy/types";

const STORAGE_KEY_PREFS = "wattwise-prefs";
const STORAGE_KEY_SKIP  = "wattwise-prefs-skip";

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences) => void;
  skipForever: boolean;
  setSkipForever: (v: boolean) => void;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [skipForever, setSkipForeverState] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PREFS);
      if (raw) setPreferencesState({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
      setSkipForeverState(localStorage.getItem(STORAGE_KEY_SKIP) === "1");
    } catch { /* ignore parse errors */ }
  }, []);

  const setPreferences = useCallback((p: UserPreferences) => {
    setPreferencesState(p);
    try { localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(p)); } catch { /* ignore */ }
  }, []);

  const setSkipForever = useCallback((v: boolean) => {
    setSkipForeverState(v);
    try {
      if (v) localStorage.setItem(STORAGE_KEY_SKIP, "1");
      else   localStorage.removeItem(STORAGE_KEY_SKIP);
    } catch { /* ignore */ }
  }, []);

  return { preferences, setPreferences, skipForever, setSkipForever };
}
