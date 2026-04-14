"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

// ─── Shared logo (mirrors TopBar) ────────────────────────────────────────────

function WattwiseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <line x1="37" y1="66" x2="51" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
      <line x1="53" y1="66" x2="67" y2="36" stroke="#4169e1" strokeWidth="12" strokeLinecap="round" />
      <path d="M 27 31 Q 28.5 40 35 42 Q 28.5 44 27 53 Q 25.5 44 19 42 Q 25.5 40 27 31 Z" fill="#4169e1" />
    </svg>
  );
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function WelcomeIllustration() {
  const sparkles = [
    { top: "10px",  left: "38%",  color: "#3ecf8e", size: 6, delay: "0s"   },
    { top: "22px",  right: "26%", color: "#facc15", size: 5, delay: "0.9s" },
    { bottom:"18px",right: "34%", color: "#60a5fa", size: 4, delay: "1.7s" },
    { top: "48%",   left: "10%",  color: "#3ecf8e", size: 4, delay: "0.4s" },
    { top: "36%",   right: "8%",  color: "#facc15", size: 5, delay: "1.3s" },
    { bottom:"26px",left: "22%",  color: "#f472b6", size: 4, delay: "2.1s" },
  ] as const;

  const floaters = [
    { icon: "☀️", size: 26, top: "6px",   left: "14px",  delay: "0s"   },
    { icon: "💨", size: 22, top: "14px",  right: "14px", delay: "0.8s" },
    { icon: "💧", size: 20, bottom:"8px", left: "22px",  delay: "1.5s" },
    { icon: "⚡", size: 18, bottom:"14px",right: "20px", delay: "2.2s" },
    { icon: "🌡️", size: 17, top:"36px",  left: "38px",  delay: "2.8s" },
  ] as const;

  return (
    <div className="relative flex items-center justify-center h-48 overflow-visible select-none">
      {/* Outer glow ring */}
      <div
        className="absolute w-44 h-44 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(62,207,142,0.10) 0%, transparent 70%)",
          animation: "tutorial-glow-ring 2.8s ease-in-out infinite",
        }}
      />
      {/* Inner glow ring */}
      <div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(62,207,142,0.17) 0%, transparent 70%)",
          animation: "tutorial-glow-ring 2s ease-in-out infinite 0.5s",
        }}
      />

      {/* Floating energy icons */}
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            fontSize: f.size,
            top:    "top"    in f ? f.top    : undefined,
            left:   "left"   in f ? f.left   : undefined,
            right:  "right"  in f ? f.right  : undefined,
            bottom: "bottom" in f ? f.bottom : undefined,
            animation: `tutorial-float 3s ease-in-out infinite ${f.delay}`,
          }}
        >
          {f.icon}
        </div>
      ))}

      {/* Sparkle dots */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  s.size,
            height: s.size,
            background: s.color,
            top:    "top"    in s ? s.top    : undefined,
            left:   "left"   in s ? s.left   : undefined,
            right:  "right"  in s ? s.right  : undefined,
            bottom: "bottom" in s ? s.bottom : undefined,
            animation: `tutorial-sparkle 2.5s ease-in-out infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Main logo card */}
      <div
        className="relative z-10 w-24 h-24 rounded-2xl bg-[#242424] border border-[#3ecf8e]/30 flex items-center justify-center"
        style={{
          animation: "tutorial-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both, tutorial-glow-box 2.5s ease-in-out infinite 0.7s",
        }}
      >
        <WattwiseLogo className="w-14 h-14" />
      </div>
    </div>
  );
}

function MapIllustration() {
  // SMIL-based SVG animations – coordinate-accurate, no CSS pixel math needed
  return (
    <div className="relative h-44 flex items-center justify-center px-2">
      <div
        className="w-full max-w-[256px] rounded-xl overflow-hidden border border-[#2a2a2a] shadow-lg"
        style={{ animation: "tutorial-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <svg viewBox="0 0 256 170" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          {/* Background */}
          <rect width="256" height="170" fill="#1c1c1c" />

          {/* Streets horizontal */}
          <rect x="0" y="76" width="256" height="17" fill="#232323" />
          <rect x="0" y="34" width="256" height="8"  fill="#202020" />
          <rect x="0" y="128" width="256" height="8" fill="#202020" />

          {/* Streets vertical */}
          <rect x="96"  y="0" width="17" height="170" fill="#232323" />
          <rect x="46"  y="0" width="8"  height="170" fill="#202020" />
          <rect x="155" y="0" width="8"  height="170" fill="#202020" />
          <rect x="202" y="0" width="8"  height="170" fill="#202020" />

          {/* Buildings – left block */}
          <rect x="8"  y="8"  width="30" height="22" rx="2" fill="#2d2d2d" />
          <rect x="54" y="8"  width="22" height="22" rx="2" fill="#2d2d2d" />
          <rect x="8"  y="48" width="34" height="24" rx="2" fill="#2d2d2d" />
          <rect x="54" y="48" width="22" height="24" rx="2" fill="#2d2d2d" />
          <rect x="8"  y="93" width="30" height="26" rx="2" fill="#2d2d2d" />
          <rect x="54" y="93" width="22" height="26" rx="2" fill="#2d2d2d" />
          <rect x="8"  y="136" width="80" height="26" rx="2" fill="#2d2d2d" />

          {/* Buildings – right block */}
          <rect x="121" y="8"  width="24" height="22" rx="2" fill="#2d2d2d" />
          <rect x="163" y="8"  width="26" height="22" rx="2" fill="#2d2d2d" />
          <rect x="211" y="8"  width="37" height="22" rx="2" fill="#2d2d2d" />
          <rect x="121" y="48" width="36" height="24" rx="2" fill="#2d2d2d" />
          <rect x="163" y="48" width="26" height="24" rx="2" fill="#2d2d2d" />
          <rect x="121" y="93" width="24" height="26" rx="2" fill="#2d2d2d" />
          <rect x="163" y="93" width="26" height="26" rx="2" fill="#2d2d2d" />
          <rect x="211" y="93" width="37" height="26" rx="2" fill="#2d2d2d" />
          <rect x="121" y="136" width="127" height="26" rx="2" fill="#2d2d2d" />

          {/* TARGET building – animated highlight */}
          <rect x="211" y="8" width="37" height="22" rx="2">
            <animate
              attributeName="fill"
              values="#2d2d2d;#2d2d2d;rgba(62,207,142,0.30);rgba(62,207,142,0.30);rgba(62,207,142,0.30);#2d2d2d"
              keyTimes="0;0.12;0.40;0.58;0.72;1"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="none;none;#3ecf8e;#3ecf8e;#3ecf8e;none"
              keyTimes="0;0.12;0.40;0.58;0.72;1"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-width"
              values="0;0;1.5;1.5;1.5;0"
              keyTimes="0;0.12;0.40;0.58;0.72;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Location pin – bounces in above target building */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="229,-10; 229,-10; 229,-10; 229,0; 229,0; 229,-10"
              keyTimes="0;0.12;0.38;0.50;0.72;1"
              dur="4s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 0 0; 0 0 0 0; 0.34 1.56 0.64 1; 0 0 0 0; 0 0 0 0"
            />
            <animate
              attributeName="opacity"
              values="0;0;0;1;1;0"
              keyTimes="0;0.12;0.38;0.50;0.72;1"
              dur="4s"
              repeatCount="indefinite"
            />
            <circle cy="2" r="6" fill="#3ecf8e" />
            <circle cy="2" r="3" fill="white" />
            <path d="M-4 2 Q0 10 4 2" fill="#3ecf8e" />
          </g>

          {/* Cursor */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="18,130; 18,130; 218,14; 218,14; 218,14; 18,130"
              keyTimes="0;0.05;0.34;0.55;0.72;1"
              dur="4s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 0 0; 0.5 0 0.5 1; 0 0 0 0; 0 0 0 0; 0.5 0 0.5 1"
            />
            <path
              d="M0,0 L0,18 L5,13 L9,20 L11.5,19 L7.5,12 L14,12 Z"
              fill="white"
              stroke="#1c1c1c"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SearchIllustration() {
  return (
    <div
      className="relative h-44 flex flex-col justify-center px-3 gap-2"
      style={{ animation: "tutorial-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#333] rounded-xl px-3 py-2.5 shadow">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <div className="flex-1 flex items-center overflow-hidden gap-0.5">
          <span
            className="text-sm text-[#ededed] whitespace-nowrap"
            style={{
              display: "inline-block",
              overflow: "hidden",
              animation: "tutorial-typing 4s ease-in-out infinite",
            }}
          >
            Musterstraße 12, Wuppertal
          </span>
          <span
            className="inline-block w-0.5 h-4 bg-[#3ecf8e] rounded-full shrink-0"
            style={{ animation: "tutorial-cursor-blink 0.8s step-start infinite" }}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className="bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-lg"
        style={{ animation: "tutorial-dropdown 4s ease-in-out infinite" }}
      >
        {[
          { text: "Musterstraße 12, 42103 Wuppertal",  active: true  },
          { text: "Musterstraße 12a, 42103 Wuppertal", active: false },
          { text: "Musterstraße 1–2, 42105 Wuppertal", active: false },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 text-xs border-b border-[#2a2a2a] last:border-0"
            style={{ background: item.active ? "rgba(62,207,142,0.09)" : "transparent" }}
          >
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke={item.active ? "#3ecf8e" : "#555"} strokeWidth="2" strokeLinecap="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ color: item.active ? "#3ecf8e" : "#6a6a6a" }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisIllustration() {
  const bars = [
    { icon: "☀️", label: "Solar",  color: "#facc15", anim: "tutorial-bar-1", score: "82" },
    { icon: "💨", label: "Wind",   color: "#60a5fa", anim: "tutorial-bar-2", score: "54" },
    { icon: "💧", label: "Wasser", color: "#22d3ee", anim: "tutorial-bar-3", score: "28" },
    { icon: "🌡️", label: "Geo",   color: "#fb923c", anim: "tutorial-bar-4", score: "47" },
  ];

  return (
    <div
      className="relative h-52 flex flex-col justify-center px-3 gap-2"
      style={{ animation: "tutorial-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-base w-6 text-center shrink-0 select-none">{bar.icon}</span>
          <span className="text-xs text-[#8a8a8a] w-11 shrink-0">{bar.label}</span>
          <div className="flex-1 h-2.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: bar.color,
                width: "0%",
                animation: `${bar.anim} 5s ease-out infinite`,
              }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#ededed] w-6 text-right shrink-0">{bar.score}</span>
        </div>
      ))}

      {/* Recommendation badge */}
      <div
        className="flex items-center gap-2 bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 rounded-xl px-3 py-2"
        style={{ animation: "tutorial-recommend 5s ease-out infinite", opacity: 0 }}
      >
        <span className="text-sm select-none">⭐</span>
        <span className="text-xs text-[#3ecf8e] font-semibold">Empfehlung: Solaranlage</span>
        <span className="ml-auto text-[10px] text-[#3ecf8e]/60 font-medium">+Links</span>
      </div>
    </div>
  );
}

function DoneIllustration() {
  const confetti = [
    { color: "#3ecf8e", top: "22%", left:  "32%", anim: "tutorial-confetti-a", delay: "0s"   },
    { color: "#facc15", top: "18%", right: "28%", anim: "tutorial-confetti-b", delay: "0.2s" },
    { color: "#60a5fa", top: "20%", left:  "52%", anim: "tutorial-confetti-c", delay: "0.1s" },
    { color: "#f472b6", top: "16%", right: "42%", anim: "tutorial-confetti-d", delay: "0.3s" },
    { color: "#3ecf8e", top: "24%", left:  "62%", anim: "tutorial-confetti-a", delay: "0.5s" },
    { color: "#facc15", top: "19%", left:  "42%", anim: "tutorial-confetti-b", delay: "0.4s" },
    { color: "#22d3ee", top: "21%", right: "34%", anim: "tutorial-confetti-c", delay: "0.6s" },
    { color: "#f472b6", top: "17%", left:  "28%", anim: "tutorial-confetti-d", delay: "0.7s" },
  ] as const;

  return (
    <div className="relative h-48 flex items-center justify-center overflow-hidden">
      {confetti.map((c, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm pointer-events-none"
          style={{
            background: c.color,
            top:   c.top,
            left:  "left"  in c ? c.left  : undefined,
            right: "right" in c ? c.right : undefined,
            animation: `${c.anim} 1.8s ease-out ${c.delay} infinite`,
          }}
        />
      ))}

      {/* Check circle */}
      <div
        className="w-28 h-28 rounded-full bg-[#3ecf8e]/12 border-2 border-[#3ecf8e]/60 flex items-center justify-center"
        style={{
          animation: "tutorial-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both, tutorial-glow-box 2.2s ease-in-out infinite 0.7s",
        }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M11 26 L22 37 L41 15"
            stroke="#3ecf8e"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            style={{ animation: "tutorial-checkmark 0.55s ease-out 0.4s both" }}
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: "",
    title: "Willkommen bei Wattwise ⚡",
    subtitle:
      "Finde in Sekunden heraus, welche Energiequelle am besten zu deinem Grundstück passt — Solar, Wind oder Wasser.",
    illustration: WelcomeIllustration,
  },
  {
    label: "Schritt 1 von 3",
    title: "Grundstück auf der Karte wählen",
    subtitle:
      "Klicke direkt auf ein Gebäude oder einen Garten. Straßen, Parks und öffentliche Flächen sind nicht auswählbar.",
    illustration: MapIllustration,
  },
  {
    label: "Schritt 2 von 3",
    title: "Oder Adresse eingeben",
    subtitle:
      "Tippe eine Adresse in die Suchleiste oben ein und wähle einen Vorschlag — Wattwise springt automatisch zum Standort.",
    illustration: SearchIllustration,
  },
  {
    label: "Schritt 3 von 3",
    title: "Analyse & Empfehlung lesen",
    subtitle:
      "Wattwise berechnet Solar-, Wind-, Wasser- und Geothermiepotenzial für deinen Standort und gibt eine Empfehlung inklusive Kosten und Aufwand.",
    illustration: AnalysisIllustration,
  },
  {
    label: "",
    title: "Alles klar — los geht's!",
    subtitle:
      "Du kannst das Tutorial jederzeit über das ? oben rechts erneut aufrufen.",
    illustration: DoneIllustration,
  },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

export default function TutorialOnboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"fwd" | "bwd">("fwd");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("wattwise-tutorial-done")) {
      const t = setTimeout(() => setVisible(true), 350);
      return () => clearTimeout(t);
    }
  }, []);

  const done = useCallback(() => {
    localStorage.setItem("wattwise-tutorial-done", "1");
    setVisible(false);
  }, []);

  const goTo = useCallback(
    (target: number, dir: "fwd" | "bwd") => {
      setDirection(dir);
      setStep(target);
      setAnimKey((k) => k + 1);
    },
    []
  );

  const next = useCallback(() => {
    if (step < STEPS.length - 1) goTo(step + 1, "fwd");
    else done();
  }, [step, goTo, done]);

  const back = useCallback(() => {
    if (step > 0) goTo(step - 1, "bwd");
  }, [step, goTo]);

  if (!visible) return null;

  const cur = STEPS[step];
  const Illus = cur.illustration;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center sm:p-4"
      style={{ animation: "tutorial-overlay-in 0.3s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/78 backdrop-blur-[3px]"
        onClick={isFirst ? undefined : done}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full sm:max-w-sm bg-[#242424] sm:rounded-2xl rounded-t-2xl border border-[#303030] shadow-2xl overflow-hidden"
        style={{
          animation: "tutorial-card-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Top emerald accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3ecf8e] to-transparent" />

        {/* Skip / close button */}
        {!isLast && (
          <button
            onClick={done}
            className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-lg text-[#666] hover:text-[#ededed] hover:bg-[#2a2a2a] transition-colors"
            aria-label="Tutorial überspringen"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Illustration */}
        <div className="bg-gradient-to-b from-[#3ecf8e]/5 to-transparent px-4 pt-5 pb-1">
          <Illus key={animKey} />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-3">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > step ? "fwd" : "bwd")}
              aria-label={`Schritt ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === step ? 20 : 6,
                height:     6,
                background: i === step ? "#3ecf8e" : i < step ? "rgba(62,207,142,0.35)" : "#333",
              }}
            />
          ))}
        </div>

        {/* Text content */}
        <div className="px-6 pb-6">
          <div
            key={`txt-${animKey}`}
            style={{
              animation: `${direction === "fwd" ? "tutorial-step-fwd" : "tutorial-step-bwd"} 0.28s ease-out both`,
            }}
          >
            {cur.label && (
              <p className="text-[11px] font-semibold text-[#3ecf8e] uppercase tracking-widest mb-1">
                {cur.label}
              </p>
            )}
            <h2 className="text-[1.1rem] font-bold text-[#ededed] leading-snug mb-2">{cur.title}</h2>
            <p className="text-sm text-[#8a8a8a] leading-relaxed">{cur.subtitle}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 mt-5">
            {!isFirst && (
              <button
                onClick={back}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-[#8a8a8a] hover:text-[#ededed] hover:bg-[#2a2a2a] transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                Zurück
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
              style={{
                background: "#3ecf8e",
                color: "#0a1a10",
                boxShadow: "0 4px 16px rgba(62,207,142,0.25)",
              }}
            >
              {isLast ? "Los geht's! 🚀" : (
                <>
                  Weiter
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {isFirst && (
            <button
              onClick={done}
              className="w-full text-center text-xs text-[#555] hover:text-[#8a8a8a] transition-colors mt-3 py-0.5"
            >
              Tutorial überspringen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
