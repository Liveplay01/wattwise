"use client";

import { useEffect, useState } from "react";
import { MessageSquare, X, ArrowRight, Sparkles } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";

const DISMISSED_KEY = "wattwise-feedback-dismissed";

export default function FeedbackBanner({ drawerOpen = false }: { drawerOpen?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss(e: React.MouseEvent) {
    e.stopPropagation();
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible || drawerOpen) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed right-6 z-[2500] pointer-events-auto"
        style={{
          bottom: "7.5rem", // above leaflet zoom controls (~90px)
          animation: "fb-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
          animationDelay: "1.2s",
          opacity: 0,
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            animation: "fb-glow 3s ease-in-out infinite",
            animationDelay: "2s",
          }}
          className="relative w-64 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden cursor-pointer select-none"
          onClick={() => setModalOpen(true)}
          role="button"
          aria-label="Feedback öffnen"
        >
          {/* Subtle green gradient top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 text-muted-foreground/50 hover:text-foreground transition-colors z-10 p-0.5 rounded-lg hover:bg-white/10"
            aria-label="Schließen"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Header row */}
            <div className="flex items-center gap-3">
              {/* Animated icon */}
              <div
                className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0"
                style={{ animation: "fb-icon-float 3s ease-in-out infinite" }}
              >
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">Dein Feedback</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-primary/70" />
                  <p className="text-[10px] text-muted-foreground">100 % anonym</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Was denkst du über Wattwise? Hilf uns, es besser zu machen!
            </p>

            {/* CTA Button */}
            <div
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                hovered
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/15 text-primary"
              }`}
            >
              <span>Feedback schreiben</span>
              <ArrowRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${hovered ? "translate-x-0.5" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
