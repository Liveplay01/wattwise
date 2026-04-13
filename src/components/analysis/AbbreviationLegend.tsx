"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ABBR } from "@/components/ui/abbr";

const ENTRIES = Object.values(ABBR);

export default function AbbreviationLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="font-medium">Abkürzungen &amp; Legende</span>
        </span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border/50">
          {ENTRIES.map((entry) => (
            <div key={entry.short} className="flex items-center justify-between px-4 py-2.5 gap-4">
              <span className="font-mono text-xs font-semibold text-primary flex-shrink-0 min-w-[80px]">
                {entry.short}
              </span>
              <span className="text-xs text-muted-foreground text-right leading-snug">
                {entry.long}
              </span>
            </div>
          ))}
          <div className="px-4 py-2.5 flex items-center justify-between gap-4">
            <span className="font-mono text-xs font-semibold text-primary flex-shrink-0 min-w-[80px]">DEMO</span>
            <span className="text-xs text-muted-foreground text-right leading-snug">
              Keine Gewähr – kein Ersatz für professionelle Energieberatung
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
