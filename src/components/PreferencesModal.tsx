"use client";

import { useState, useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserPreferences } from "@/lib/energy/types";
import { Switch } from "@/components/ui/switch";

interface PreferenceItem {
  key: keyof UserPreferences;
  label: string;
  desc: string;
  icon: string;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    key: "batterySpeicher",
    label: "Besitze Batteriespeicher",
    desc: "Solar-ROI verbessert sich durch höheren Eigenverbrauch",
    icon: "🔋",
  },
  {
    key: "hatSolaranlage",
    label: "Besitze bereits Solaranlage",
    desc: "Andere Energiequellen werden bevorzugt",
    icon: "☀️",
  },
  {
    key: "limitiertesBudget",
    label: "Begrenztes Budget (<10.000 €)",
    desc: "Günstigste Option wird stärker gewichtet",
    icon: "💶",
  },
  {
    key: "grosszuegigesBudget",
    label: "Großzügiges Budget (>50.000 €)",
    desc: "Kosten spielen eine geringere Rolle",
    icon: "💼",
  },
  {
    key: "umweltbewusstsein",
    label: "Umweltbewusstsein maximieren",
    desc: "Alle erneuerbaren Quellen werden leicht aufgewertet",
    icon: "🌿",
  },
  {
    key: "hoherHeizbedarf",
    label: "Hoher Heizbedarf (Heizung/Warmwasser)",
    desc: "Geothermie als ganzjährige Wärmequelle wird besser bewertet",
    icon: "🏠",
  },
  {
    key: "grossesGrundstueck",
    label: "Großes Grundstück (>500 m²)",
    desc: "Mehr Platz für Wind- und Wasseranlagen",
    icon: "🌳",
  },
  {
    key: "kenntFoerderprogramme",
    label: "Kenne Förderprogramme",
    desc: "Subventionen reduzieren die effektive Kostenbarriere",
    icon: "📋",
  },
];

interface PreferencesModalProps {
  open: boolean;
  initialPreferences: UserPreferences;
  onConfirm: (prefs: UserPreferences, skipForever: boolean) => void;
  onSkip: () => void;
}

export default function PreferencesModal({
  open,
  initialPreferences,
  onConfirm,
  onSkip,
}: PreferencesModalProps) {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(initialPreferences);
  const [nichtMehrAnzeigen, setNichtMehrAnzeigen] = useState(false);

  // Reset local state when modal opens with new initial prefs
  const handleOpen = useCallback(() => {
    setLocalPrefs(initialPreferences);
    setNichtMehrAnzeigen(false);
  }, [initialPreferences]);

  // Run on first render if open
  useState(() => { if (open) handleOpen(); });

  const handleToggle = useCallback((key: keyof UserPreferences, value: boolean) => {
    // Budget options are mutually exclusive
    if (key === "limitiertesBudget" && value) {
      setLocalPrefs(p => ({ ...p, limitiertesBudget: true, grosszuegigesBudget: false }));
    } else if (key === "grosszuegigesBudget" && value) {
      setLocalPrefs(p => ({ ...p, grosszuegigesBudget: true, limitiertesBudget: false }));
    } else {
      setLocalPrefs(p => ({ ...p, [key]: value }));
    }
  }, []);

  if (!open) return null;

  const hasAnyActive = Object.values(localPrefs).some(Boolean);

  return (
    <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onSkip} />

      {/* Card */}
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{ animation: "prefs-modal-in 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm leading-tight">Analyse anpassen</p>
              <p className="text-xs text-muted-foreground leading-tight">Für genauere Empfehlungen</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Aktiviere Punkte, die auf dich zutreffen. Die Analyse gewichtet die Energiequellen dann passend für deine Situation.
          </p>

          {PREFERENCE_ITEMS.map((item) => {
            const checked = localPrefs[item.key];
            const isMutedOut =
              (item.key === "limitiertesBudget" && localPrefs.grosszuegigesBudget) ||
              (item.key === "grosszuegigesBudget" && localPrefs.limitiertesBudget);

            return (
              <div
                key={item.key}
                onClick={() => !isMutedOut && handleToggle(item.key, !checked)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-150",
                  checked
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-secondary/30 hover:border-border/80 hover:bg-secondary/50",
                  isMutedOut && "opacity-40 pointer-events-none"
                )}
              >
                <Switch
                  checked={checked}
                  onCheckedChange={(v) => handleToggle(item.key, v)}
                  className="mt-0.5 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className={cn("text-sm font-medium leading-snug", checked ? "text-foreground" : "text-foreground/80")}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4 flex-shrink-0 space-y-3">
          {/* "Don't show again" toggle */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setNichtMehrAnzeigen(!nichtMehrAnzeigen)}>
            <Switch
              checked={nichtMehrAnzeigen}
              onCheckedChange={setNichtMehrAnzeigen}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-xs text-muted-foreground">Nicht mehr anzeigen</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              className="flex-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl py-2 transition-colors"
            >
              Überspringen
            </button>
            <button
              onClick={() => onConfirm(localPrefs, nichtMehrAnzeigen)}
              className={cn(
                "flex-[2] text-sm font-semibold rounded-xl py-2 transition-all duration-150",
                hasAnyActive
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-primary/80 text-primary-foreground hover:bg-primary"
              )}
            >
              {hasAnyActive ? "Analyse starten ✓" : "Analyse starten"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
