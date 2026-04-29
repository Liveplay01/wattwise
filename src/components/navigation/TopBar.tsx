"use client";

import { useState } from "react";
import { HelpCircle, Info, X, Zap, Droplets, ExternalLink, Sun, Moon, SlidersHorizontal } from "lucide-react";
import { Drawer as DrawerPrimitive } from "vaul";
import GradientText from "@/components/ui/GradientText";

function WattwiseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <line x1="37" y1="66" x2="51" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
      <line x1="53" y1="66" x2="67" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
      <path d="M 27 31 Q 28.5 40 35 42 Q 28.5 44 27 53 Q 25.5 44 19 42 Q 25.5 40 27 31 Z" fill="#4169e1" />
    </svg>
  );
}

function SideDrawer({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DrawerPrimitive.Root direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm" />
        <DrawerPrimitive.Content className="fixed right-0 top-0 h-full w-[92vw] max-w-sm z-[2001] bg-card border-l border-border flex flex-col shadow-2xl outline-none">
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

interface TopBarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  onOpenPreferences: () => void;
  onSideDrawerChange?: (open: boolean) => void;
}

export default function TopBar({ theme, toggleTheme, onOpenPreferences, onSideDrawerChange }: TopBarProps) {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  function openSideDrawer(setter: (v: boolean) => void) {
    setter(true);
    onSideDrawerChange?.(true);
  }


  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-[1000]">
        {/* Mobile: einheitliche Leiste */}
        <div className="flex sm:hidden items-center justify-between px-4 h-14 bg-card/90 backdrop-blur-md border-b border-border/40 shadow-sm pointer-events-auto">
          <div className="flex items-center gap-2">
            <WattwiseLogo className="w-6 h-6" />
            <GradientText colors={['#22d3ee', '#4ade80', '#facc15']} animationSpeed={6} className="text-sm font-bold tracking-tight">Wattwise</GradientText>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/20">
              DEMO
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={onOpenPreferences}
              className="min-h-10 min-w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors"
              aria-label="Analyse-Präferenzen anpassen"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => openSideDrawer(setInfoOpen)}
              className="min-h-10 min-w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors"
              aria-label="API-Informationen"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => openSideDrawer(setTutorialOpen)}
              className="min-h-10 min-w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors"
              aria-label="Anleitung"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="min-h-10 min-w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-white/10 transition-colors"
              aria-label={theme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop: schwebende Pills */}
        <div className="hidden sm:flex items-center justify-between px-4 pt-4 pointer-events-none">
          {/* Logo */}
          <div className="pointer-events-auto flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg">
            <WattwiseLogo className="w-7 h-7" />
            <GradientText colors={['#22d3ee', '#4ade80', '#facc15']} animationSpeed={6} className="text-sm font-bold tracking-tight">Wattwise</GradientText>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/20">
              DEMO
            </span>
          </div>

          {/* Rechts: Buttons + WDG Badge */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={onOpenPreferences}
              className="bg-card/90 backdrop-blur-md rounded-xl min-h-12 min-w-12 flex items-center justify-center border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
              aria-label="Analyse-Präferenzen anpassen"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={() => openSideDrawer(setInfoOpen)}
              className="bg-card/90 backdrop-blur-md rounded-xl min-h-12 min-w-12 flex items-center justify-center border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
              aria-label="API-Informationen"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => openSideDrawer(setTutorialOpen)}
              className="bg-card/90 backdrop-blur-md rounded-xl min-h-12 min-w-12 flex items-center justify-center border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
              aria-label="Anleitung"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="bg-card/90 backdrop-blur-md rounded-xl min-h-12 min-w-12 flex items-center justify-center border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
              aria-label={theme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg flex-col items-end">
              <p className="text-[10px] text-muted-foreground leading-tight text-right">Schulprojekt</p>
              <p className="text-[10px] font-semibold text-foreground leading-tight whitespace-nowrap">WDG Wuppertal</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tutorial Drawer ─────────────────────────────────────── */}
      <SideDrawer open={tutorialOpen} onOpenChange={(v) => { setTutorialOpen(v); if (!v) onSideDrawerChange?.(false); }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-foreground">Wie funktioniert Wattwise?</span>
          </div>
          <button onClick={() => setTutorialOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors min-h-12 min-w-12 flex items-center justify-center rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Steps */}
          {[
            {
              n: 1,
              title: "Grundstück wählen",
              desc: "Klicke direkt auf ein Haus oder einen Garten auf der Karte. Straßen, Parks und öffentliche Flächen sind nicht auswählbar.",
              icon: "📍",
            },
            {
              n: 2,
              title: "Oder Adresse suchen",
              desc: "Tippe eine Adresse in die Suchleiste oben und wähle einen der Vorschläge — Wattwise springt dann automatisch zum Standort.",
              icon: "🔍",
            },
            {
              n: 3,
              title: "Analyse anpassen (optional)",
              desc: "Bevor die Analyse startet, kannst du Punkte aktivieren die auf dich zutreffen — z. B. ob du schon eine Solaranlage besitzt oder ein begrenztes Budget hast. Das beeinflusst die Gewichtung der Empfehlung.",
              icon: "⚙️",
            },
            {
              n: 4,
              title: "Analyse lesen",
              desc: "Wattwise berechnet Solar-, Wind-, Wasser- und Geothermiepotenzial für deinen Standort. Hovere über den Score oder das Energie-Icon für eine Erklärung, was der Wert bedeutet.",
              icon: "📊",
            },
            {
              n: 5,
              title: "Angebote vergleichen",
              desc: "In den Ergebnissen findest du Links zu Vergleichsportalen und Anbietern, die passende Anlagen für dein Grundstück anbieten.",
              icon: "🔗",
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {step.n}
                </div>
                {step.n < 5 && <div className="w-px flex-1 bg-border min-h-4" />}
              </div>
              <div className="pb-2">
                <p className="font-semibold text-foreground text-sm mb-1">
                  {step.icon} {step.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}

          {/* Analyse-Anpassung */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Analyse anpassen</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Beim ersten Standort-Klick öffnet sich ein Dialog, in dem du Punkte aktivieren kannst, die auf dich zutreffen:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Batteriespeicher vorhanden → besserer Solar-ROI</li>
              <li>Bereits Solaranlage → andere Quellen bevorzugt</li>
              <li>Begrenztes oder großzügiges Budget</li>
              <li>Hoher Heizbedarf → Geothermie aufgewertet</li>
              <li>Großes Grundstück, Förderprogramme, Umweltfokus u. v. m.</li>
            </ul>
            <p className="text-[11px] text-muted-foreground/70">
              Mit &bdquo;Nicht mehr anzeigen&ldquo; werden deine Einstellungen gespeichert und der Dialog erscheint nicht mehr.
            </p>
          </div>

          {/* Light/Dark Mode */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              <p className="text-xs font-semibold text-foreground">Helles / Dunkles Design</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mit dem Sonne/Mond-Button in der Kopfzeile kannst du jederzeit zwischen hellem und dunklem Design wechseln. Die Einstellung wird gespeichert.
            </p>
          </div>

          {/* Hinweise */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground">Wichtige Hinweise</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Nur Standorte in Deutschland werden analysiert</li>
              <li>Die Wetterdaten stammen aus einem 14-Tage-Fenster</li>
              <li>Empfehlungen ersetzen keine Fachberatung</li>
              <li>Wasserrechte und Baugenehmigungen sind separat zu klären</li>
            </ul>
          </div>

          <p className="text-[11px] text-muted-foreground/60 text-center pb-4">
            Ein Schulprojekt des Wilhelm-Dörpfeld-Gymnasiums Wuppertal
          </p>
        </div>
      </SideDrawer>

      {/* ── Info / API Drawer ────────────────────────────────────── */}
      <SideDrawer open={infoOpen} onOpenChange={(v) => { setInfoOpen(v); if (!v) onSideDrawerChange?.(false); }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-foreground">Datenquellen & APIs</span>
          </div>
          <button onClick={() => setInfoOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors min-h-12 min-w-12 flex items-center justify-center rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wattwise nutzt ausschließlich <strong className="text-foreground">kostenlose, öffentliche APIs</strong> ohne Login oder API-Key. Alle Berechnungen laufen direkt im Browser — kein Server, keine gespeicherten Daten.
          </p>

          {/* Open-Meteo */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <div>
                <p className="font-semibold text-sm text-foreground">Open-Meteo</p>
                <p className="text-[10px] text-muted-foreground">api.open-meteo.com</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Liefert historische und prognostizierte Wetterdaten für jeden Punkt in Deutschland. Wattwise ruft einen 14-Tage-Zeitraum ab (7 Tage zurück, 7 Tage voraus) und berechnet:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong className="text-foreground">Sonneneinstrahlung</strong>: tägliche Kurzwellenstrahlung in MJ/m² → umgerechnet in kWh/m²</li>
              <li><strong className="text-foreground">Windgeschwindigkeit</strong>: tägliches Maximum in m/s auf 10 m Höhe</li>
              <li><strong className="text-foreground">Höhenlage</strong>: Meter über NN via Elevation-Endpoint</li>
            </ul>
          </div>

          {/* Overpass API */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-semibold text-sm text-foreground">OpenStreetMap Overpass API</p>
                <p className="text-[10px] text-muted-foreground">overpass-api.de</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zählt alle Flüsse, Bäche und Kanäle im Umkreis von <strong className="text-foreground">2 km</strong> um den ausgewählten Standort. Mehr Gewässer + höhere Lage = besseres Wasserkraftpotenzial.
            </p>
          </div>

          {/* Geothermie Proxy */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌡️</span>
              <div>
                <p className="font-semibold text-sm text-foreground">Geothermie-Proxy (Open-Meteo)</p>
                <p className="text-[10px] text-muted-foreground">Temperaturbasiertes Schätzmodell</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Da keine browserkompatible Geothermie-API für Deutschland existiert, schätzt Wattwise die
              Grundtemperatur aus der mittleren Lufttemperatur (Open-Meteo, 2 m-Höhe) und korrigiert nach
              Höhenlage. Das Modell ist ein Proxy und kein Ersatz für eine geologische Untersuchung.
            </p>
          </div>

          {/* Nominatim */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-semibold text-sm text-foreground">Nominatim (OpenStreetMap)</p>
                <p className="text-[10px] text-muted-foreground">nominatim.openstreetmap.org</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Wird für zwei Zwecke genutzt: <strong className="text-foreground">Adresssuche</strong> (Vorschläge während der Texteingabe) und <strong className="text-foreground">Grundstückscheck</strong> (prüft ob der angeklickte Punkt ein Gebäude/Wohngrundstück ist, keine Straße oder Park).
            </p>
          </div>

          {/* Scoring */}
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="font-semibold text-sm text-foreground">Scoring-Algorithmus</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jede Energiequelle erhält einen <strong className="text-foreground">Potenzial-Score (0–100)</strong> basierend auf den Rohdaten. Dieser wird mit einem <strong className="text-foreground">Kosten-Faktor</strong> gewichtet:
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Solaranlage", weight: "100 %", color: "text-yellow-400", desc: "Günstigste Option" },
                { label: "Windanlage", weight: "75 %", color: "text-blue-400", desc: "Hohe Kosten & Genehmigung" },
                { label: "Wasserkraft", weight: "65 %", color: "text-cyan-400",   desc: "Sehr komplex & teuer" },
                { label: "Geothermie",  weight: "60 %", color: "text-orange-400", desc: "Bohrung, Genehmigung" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[10px]">{item.desc}</span>
                    <span className="font-mono font-bold text-foreground">{item.weight}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70">
              Wind, Wasser und Geothermie müssen Solar deutlich überbieten, um empfohlen zu werden — da Solar für Privatpersonen in den meisten Fällen die praktikabelste Wahl ist.
            </p>
          </div>

          {/* Nutzer-Gewichtung */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <p className="font-semibold text-sm text-foreground">Persönliche Gewichtung</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vor jeder Analyse kannst du Faktoren aktivieren, die deinen Kosten-Faktor verändern:
            </p>
            <div className="space-y-1">
              {[
                { icon: "🔋", label: "Batteriespeicher vorhanden", effect: "Solar +10 %" },
                { icon: "☀️", label: "Bereits Solaranlage", effect: "Solar −20 %, andere +5 %" },
                { icon: "💶", label: "Begrenztes Budget", effect: "Solar +10 %, andere −5 %" },
                { icon: "💼", label: "Großzügiges Budget", effect: "Alle +8 %" },
                { icon: "🌿", label: "Umweltbewusstsein", effect: "Alle +5 %" },
                { icon: "🏠", label: "Hoher Heizbedarf", effect: "Geothermie +15 %" },
                { icon: "🌳", label: "Großes Grundstück", effect: "Wind/Wasser +5 %" },
                { icon: "📋", label: "Förderprogramme bekannt", effect: "Alle +5 %" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-primary/80">{item.effect}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70">
              Die Faktoren verändern nur die Gewichtung, nicht die Rohdaten von den APIs.
            </p>
          </div>

          {/* Datenschutz */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-semibold text-foreground mb-1">🔒 Datenschutz</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Wattwise speichert keine Standortdaten. Alle API-Anfragen gehen direkt von deinem Browser an die jeweiligen Dienste. Es werden keine Cookies gesetzt und kein Tracking verwendet. Deine Analyse-Einstellungen werden lokal im Browser gespeichert (localStorage).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 pb-4">
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              open-meteo.com <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground/40">·</span>
            <a
              href="https://www.openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              openstreetmap.org <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </SideDrawer>
    </>
  );
}
