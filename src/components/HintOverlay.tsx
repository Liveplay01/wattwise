"use client";

import { MapPin } from "lucide-react";

export default function HintOverlay() {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-md px-4 py-2.5 shadow-lg">
        <MapPin className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          Klicke auf die Karte oder suche eine Adresse
        </p>
      </div>
    </div>
  );
}
