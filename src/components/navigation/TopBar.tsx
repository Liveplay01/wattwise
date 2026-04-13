import { Zap } from "lucide-react";

export default function TopBar() {
  return (
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

        {/* WDG Badge */}
        <div className="pointer-events-auto bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg">
          <p className="text-[10px] text-muted-foreground leading-tight text-right">
            Schulprojekt
          </p>
          <p className="text-[10px] font-semibold text-foreground leading-tight">
            WDG Schule Wuppertal
          </p>
        </div>
      </div>
    </header>
  );
}
