"use client";

import { Sun, Wind, Droplets, Thermometer, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreLabel, ENERGY_INFO, ENERGY_LINKS } from "@/lib/energy/constants";
import type { CostInfo, EnergyType } from "@/lib/energy/types";
import { Abbr, ABBR } from "@/components/ui/abbr";
import { Tooltip } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BorderGlow from "@/components/ui/BorderGlow";

const ICONS = { solar: Sun, wind: Wind, water: Droplets, geothermal: Thermometer };
const LABELS = { solar: "Solaranlage", wind: "Windanlage", water: "Wasserkraft", geothermal: "Geothermie" };
const COLORS = { solar: "text-yellow-400", wind: "text-blue-400", water: "text-cyan-400", geothermal: "text-orange-400" };
const BG_COLORS = { solar: "bg-yellow-400/10", wind: "bg-blue-400/10", water: "bg-cyan-400/10", geothermal: "bg-orange-400/10" };
const BAR_COLORS = { solar: "bg-yellow-400", wind: "bg-blue-400", water: "bg-cyan-400", geothermal: "bg-orange-400" };
const BORDER_COLORS = { solar: "border-yellow-400/20", wind: "border-blue-400/20", water: "border-cyan-400/20", geothermal: "border-orange-400/20" };

const GLOW_COLORS: Record<EnergyType, string[]> = {
  solar:      ['#facc15', '#fb923c', '#fde68a'],
  wind:       ['#60a5fa', '#93c5fd', '#38bdf8'],
  water:      ['#22d3ee', '#67e8f9', '#a5f3fc'],
  geothermal: ['#fb923c', '#f97316', '#fed7aa'],
};

const SCORE_TOOLTIPS: Record<EnergyType, string> = {
  solar:      "Basiert auf Sonneneinstrahlung (kWh/m²/Tag)",
  wind:       "Basiert auf durchschn. Windgeschwindigkeit (m/s)",
  water:      "Basiert auf Anzahl Gewässer + Höhenlage",
  geothermal: "Basiert auf Grundtemperatur + Tiefenprofil",
};

const DIFFICULTY_COLORS = {
  "Einfach": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Anspruchsvoll": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Sehr komplex": "text-red-400 bg-red-400/10 border-red-400/20",
};

function formatEurNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)} ` : `${n} €`;
}
function isThousands(n: number): boolean { return n >= 1000; }

interface EnergyScoreCardProps {
  type: EnergyType;
  score: number;
  adjustedScore: number;
  isRecommended: boolean;
  costInfo: CostInfo;
}

export default function EnergyScoreCard({ type, score, adjustedScore, isRecommended, costInfo }: EnergyScoreCardProps) {
  const Icon = ICONS[type];
  const info = ENERGY_INFO[type];
  const links = ENERGY_LINKS[type];

  const cardContent = (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200 w-full",
        isRecommended
          ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(62,207,142,0.1)]"
          : "border-border bg-card"
      )}
    >
      {/* Header row */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Tooltip content={SCORE_TOOLTIPS[type]}>
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 cursor-help", BG_COLORS[type])}>
              <Icon className={cn("w-5 h-5", COLORS[type])} />
            </div>
          </Tooltip>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-foreground">{LABELS[type]}</p>
              {isRecommended && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                  EMPFOHLEN
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{getScoreLabel(adjustedScore)}</p>
          </div>
          {/* Scores */}
          <div className="text-right flex-shrink-0">
            <Tooltip content="Gewichteter Score = Potenzial × Kosten-Faktor">
              <div className={cn("text-lg font-bold tabular-nums cursor-help", isRecommended ? "text-primary" : "text-foreground")}>
                {adjustedScore}
                <span className="text-xs font-normal text-muted-foreground">/100</span>
              </div>
            </Tooltip>
            {score !== adjustedScore && (
              <Tooltip content="Rohwert vor Kosten-Gewichtung" side="bottom">
                <div className="text-[10px] text-muted-foreground/60 cursor-help">
                  Potenzial: {score}
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", BAR_COLORS[type])}
            style={{ width: `${adjustedScore}%` }}
          />
        </div>

        {/* Cost + difficulty badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", DIFFICULTY_COLORS[costInfo.difficulty])}>
            {costInfo.difficulty}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatEurNum(costInfo.minEur)}{isThousands(costInfo.minEur) && <Abbr {...ABBR.TEur} />}
            {" – "}
            {formatEurNum(costInfo.maxEur)}{isThousands(costInfo.maxEur) && <Abbr {...ABBR.TEur} />}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground"><Abbr {...ABBR.ROI} />: {costInfo.paybackYears}</span>
          {costInfo.permitRequired && (
            <span className="text-[10px] text-yellow-400/80 flex items-center gap-0.5">
              <AlertTriangle className="w-3 h-3" /> Genehmigung
            </span>
          )}
        </div>
      </div>

      {/* Accordion for Details & Anbieter */}
      <Accordion type="single" collapsible>
        <AccordionItem value="details" className={cn("border-t", BORDER_COLORS[type])}>
          <AccordionTrigger
            className={cn(
              "px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:no-underline [&>svg]:w-4 [&>svg]:h-4"
            )}
          >
            Details & Anbieter
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 pb-4 space-y-3 border-t border-border/50">
              {/* Pros */}
              <div className="pt-3">
                <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">Vorteile</p>
                <ul className="space-y-1">
                  {info.pros.map((p) => (
                    <li key={p} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1.5">Nachteile</p>
                <ul className="space-y-1">
                  {info.cons.map((c) => (
                    <li key={c} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suitable for */}
              <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-2">{info.suitable}</p>

              {/* Links */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Anbieter & Infos</p>
                <div className="space-y-1.5">
                  {links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group rounded-md border border-border bg-secondary/30 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <div>
                        <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{link.label}</p>
                        <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  if (isRecommended) {
    return (
      <BorderGlow
        colors={GLOW_COLORS[type]}
        borderRadius={8}
        backgroundColor="transparent"
        glowIntensity={0.9}
        glowRadius={30}
        className="w-full"
      >
        {cardContent}
      </BorderGlow>
    );
  }

  return cardContent;
}
