"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 backdrop-blur-md px-4 py-3 shadow-lg">
      <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-yellow-200/90 flex-1 leading-relaxed">
        <span className="font-semibold text-yellow-300">Demo-Anwendung</span>
        {" · "}
        Empfehlungen basieren auf öffentlichen Wetterdaten und dienen nur zu
        Informationszwecken. Kein Ersatz für professionelle Energieberatung.
        Nur für Deutschland verfügbar.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-yellow-400/70 hover:text-yellow-400 transition-colors flex-shrink-0"
        aria-label="Schließen"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
