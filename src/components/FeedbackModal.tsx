"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const MAX_CHARS = 1000;

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setText("");
      setStatus("idle");
      setErrorMsg(null);
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

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2600] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[2601] flex items-center justify-center p-4"
          aria-describedby="feedback-desc"
        >
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <Dialog.Title className="font-bold text-foreground">
                  Dein Feedback
                </Dialog.Title>
                <Dialog.Description id="feedback-desc" className="text-[11px] text-muted-foreground mt-0.5">
                  Anonym &amp; ohne Registrierung
                </Dialog.Description>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                  <p className="font-semibold text-foreground">Danke für dein Feedback!</p>
                  <p className="text-xs text-muted-foreground">
                    Es wird allen Nutzern angezeigt.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Schließen
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 50))}
                    placeholder="Was denkst du über Wattwise? Verbesserungsvorschläge, Fehler, Lob..."
                    rows={5}
                    disabled={status === "loading"}
                    className="w-full rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 transition"
                  />

                  {/* Char counter */}
                  <div className="flex justify-end">
                    <span className={`text-[11px] tabular-nums ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground/60"}`}>
                      {text.length}/{MAX_CHARS}
                    </span>
                  </div>

                  {/* Error */}
                  {status === "error" && errorMsg && (
                    <p className="text-xs text-destructive">{errorMsg}</p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={onClose}
                      disabled={status === "loading"}
                      className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={status === "loading" || !text.trim() || isOverLimit}
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      {status === "loading" ? "Senden…" : "Absenden"}
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
