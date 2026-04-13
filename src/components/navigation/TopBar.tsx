"use client";

import { useState } from "react";
import { Zap, HelpCircle, X } from "lucide-react";

export default function TopBar() {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="flex items-center justify-between px-4 pt-4">
          {/* Logo */}
          <div className="pointer-events-auto flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight">
              Wattwise
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/20">
              DEMO
            </span>
          </div>

          {/* Rechts: WDG Badge + Tutorial-Icon */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Tutorial-Button */}
            <button
              onClick={() => setTutorialOpen(true)}
              className="bg-card/90 backdrop-blur-md rounded-xl p-2 border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
              aria-label="Anleitung"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* WDG Badge */}
            <div className="bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg">
              <p className="text-[10px] text-muted-foreground leading-tight text-right">
                Schulprojekt
              </p>
              <p className="text-[10px] font-semibold text-foreground leading-tight whitespace-nowrap">
                WDG Wuppertal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tutorial-Modal */}
      {tutorialOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTutorialOpen(false)}
          />
          <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-foreground">Wie funktioniert Wattwise?</span>
              </div>
              <button
                onClick={() => setTutorialOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <span>
                  <strong className="text-foreground">Grundstück wählen</strong> – Klicke direkt auf ein Haus oder einen Garten auf der Karte.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <span>
                  <strong className="text-foreground">Oder Adresse suchen</strong> – Tippe eine Adresse in die Suchleiste und wähle einen Vorschlag.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <span>
                  <strong className="text-foreground">Analyse lesen</strong> – Wattwise zeigt dir Solar-, Wind- und Wasserpotenzial für den Standort.
                </span>
              </li>
            </ol>

            <p className="mt-4 text-[11px] text-muted-foreground/60 text-center">
              Nur Häuser & Gärten in Deutschland · Daten: Open-Meteo & OpenStreetMap
            </p>
          </div>
        </div>
      )}
    </>
  );
}
