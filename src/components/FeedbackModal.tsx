"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Send, CheckCircle, Sparkles, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const MAX_CHARS = 1000;

const PLACEHOLDERS = [
  "Was gefällt dir? Was nervt? Alles ist willkommen…",
  "Hast du einen Fehler gefunden? Schreib ihn hier…",
  "Was würdest du als nächstes Feature einbauen?",
  "Wie war deine erste Erfahrung mit Wattwise?",
];

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setText("");
      setStatus("idle");
      setErrorMsg(null);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [open]);

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setStatus("loading");
    setErrorMsg(null);
    const { error } = await supabase.from("feedback").insert({ text: trimmed });
    if (error) {
      setStatus("error");
      setErrorMsg("Senden fehlgeschlagen. Bitte versuche es erneut.");
    } else {
      setStatus("success");
    }
  }

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const fillPct = Math.min(100, (charCount / MAX_CHARS) * 100);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2600] bg-black/75 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[2601] flex items-center justify-center p-4"
          aria-describedby="feedback-desc"
        >
          <div
            className="w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: "fb-modal-in 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {/* Decorative header */}
            <div className="relative bg-gradient-to-br from-primary/20 via-primary/8 to-transparent px-6 pt-5 pb-4 border-b border-border/60 overflow-hidden">
              {/* Background sparkle dots */}
              <div className="absolute top-3 right-12 w-1 h-1 rounded-full bg-primary/40" style={{ animation: "fb-sparkle 2.5s ease-in-out infinite" }} />
              <div className="absolute top-6 right-20 w-1.5 h-1.5 rounded-full bg-primary/25" style={{ animation: "fb-sparkle 3.2s ease-in-out infinite", animationDelay: "0.8s" }} />
              <div className="absolute bottom-3 right-8 w-1 h-1 rounded-full bg-primary/30" style={{ animation: "fb-sparkle 2.8s ease-in-out infinite", animationDelay: "1.4s" }} />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Dialog.Title className="font-bold text-foreground text-base leading-tight">
                      Dein Feedback
                    </Dialog.Title>
                    <Dialog.Description id="feedback-desc" className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <Sparkles className="w-3 h-3 text-primary/60" />
                      Anonym · ohne Registrierung · direkt für alle sichtbar
                    </Dialog.Description>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  {/* Success icon with ring */}
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full border-2 border-primary/40"
                      style={{ animation: "fb-success-ring 1.2s ease-out forwards" }}
                    />
                    <div style={{ animation: "fb-success-pop 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
                      <CheckCircle className="w-14 h-14 text-primary drop-shadow-[0_0_12px_rgba(62,207,142,0.5)]" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">Danke!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dein Feedback ist jetzt für alle Nutzer sichtbar.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-1 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(62,207,142,0.3)]"
                  >
                    Fertig
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Textarea with styled container */}
                  <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={placeholder}
                      rows={5}
                      disabled={status === "loading"}
                      className="w-full rounded-xl border border-border bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground/50 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60 transition-all duration-200 leading-relaxed"
                    />
                    {/* Typing indicator dots while loading */}
                    {status === "loading" && (
                      <div className="absolute bottom-3 right-4 flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            style={{ animation: `fb-dots 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress bar + char counter */}
                  <div className="space-y-1.5">
                    <div className="h-0.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOverLimit ? "bg-destructive" : fillPct > 80 ? "bg-yellow-400" : "bg-primary"
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      {status === "error" && errorMsg ? (
                        <p className="text-xs text-destructive">{errorMsg}</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground/50">
                          {text.length === 0 ? "Sei ehrlich — wir freuen uns über jedes Feedback 🙌" : ""}
                        </p>
                      )}
                      <span className={`text-[11px] tabular-nums ml-auto ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground/50"}`}>
                        {charCount}/{MAX_CHARS}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={onClose}
                      disabled={status === "loading"}
                      className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all disabled:opacity-50"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={status === "loading" || !text.trim() || isOverLimit}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-35 shadow-[0_4px_14px_rgba(62,207,142,0.25)] disabled:shadow-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {status === "loading" ? "Wird gesendet…" : "Absenden"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
