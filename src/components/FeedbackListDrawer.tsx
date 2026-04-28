"use client";

import { useEffect, useState, useCallback } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X, ThumbsUp, ThumbsDown, MessageSquare, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase, type Feedback, type LocalVotes, getLocalVotes, setLocalVotes } from "@/lib/supabase";
import FeedbackModal from "@/components/FeedbackModal";

interface FeedbackListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" });

export default function FeedbackListDrawer({ open, onOpenChange }: FeedbackListDrawerProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [localVotes, setLocalVotesState] = useState<LocalVotes>({});
  const [votingId, setVotingId] = useState<string | null>(null);
  const [writeOpen, setWriteOpen] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setFeedbacks(data as Feedback[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      setLocalVotesState(getLocalVotes());
      fetchFeedbacks();
    }
  }, [open, fetchFeedbacks]);

  async function handleVote(id: string, direction: "up" | "down") {
    if (votingId) return;

    const currentVote = localVotes[id];
    const isSame = currentVote === direction;
    const isSwitch = currentVote && currentVote !== direction;

    // Optimistic update
    const prev = feedbacks;
    setFeedbacks(feedbacks.map((f) => {
      if (f.id !== id) return f;
      let up = f.upvotes;
      let down = f.downvotes;
      if (isSame) {
        // Retract
        if (direction === "up") up = Math.max(0, up - 1);
        else down = Math.max(0, down - 1);
      } else if (isSwitch) {
        // Swap
        if (direction === "up") { up += 1; down = Math.max(0, down - 1); }
        else { down += 1; up = Math.max(0, up - 1); }
      } else {
        // New vote
        if (direction === "up") up += 1;
        else down += 1;
      }
      return { ...f, upvotes: up, downvotes: down };
    }));

    // Update localStorage optimistically
    const newVotes = { ...localVotes };
    if (isSame) {
      delete newVotes[id];
    } else {
      newVotes[id] = direction;
    }
    setLocalVotesState(newVotes);
    setLocalVotes(newVotes);

    setVotingId(id);
    try {
      if (isSame) {
        await supabase.rpc("vote_feedback", {
          p_id: id,
          p_column: direction === "up" ? "upvotes" : "downvotes",
          p_delta: -1,
        });
      } else if (isSwitch) {
        await supabase.rpc("vote_feedback", {
          p_id: id,
          p_column: currentVote === "up" ? "upvotes" : "downvotes",
          p_delta: -1,
        });
        await supabase.rpc("vote_feedback", {
          p_id: id,
          p_column: direction === "up" ? "upvotes" : "downvotes",
          p_delta: 1,
        });
      } else {
        await supabase.rpc("vote_feedback", {
          p_id: id,
          p_column: direction === "up" ? "upvotes" : "downvotes",
          p_delta: 1,
        });
      }
    } catch {
      // Rollback on failure
      setFeedbacks(prev);
      const rolledBack = { ...localVotes };
      setLocalVotesState(rolledBack);
      setLocalVotes(rolledBack);
    } finally {
      setVotingId(null);
    }
  }

  return (
    <>
    <DrawerPrimitive.Root direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm" />
        <DrawerPrimitive.Content className="fixed right-0 top-0 h-full w-[92vw] max-w-sm z-[2001] bg-card border-l border-border flex flex-col shadow-2xl outline-none">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-foreground">Community-Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWriteOpen(true)}
                className="flex items-center gap-1.5 px-3 min-h-12 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                aria-label="Feedback schreiben"
              >
                <Plus className="w-3.5 h-3.5" />
                Schreiben
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground transition-colors min-h-12 min-w-12 flex items-center justify-center rounded-xl"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-3 pt-1">
                      <Skeleton className="h-6 w-14" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                  </div>
                ))}
              </>
            ) : feedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Noch kein Feedback vorhanden</p>
                <p className="text-xs text-muted-foreground/60">
                  Sei der Erste und hinterlasse einen Kommentar!
                </p>
              </div>
            ) : (
              feedbacks.map((fb) => {
                const userVote = localVotes[fb.id];
                const isVoting = votingId === fb.id;
                return (
                  <div key={fb.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {fb.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground/50">
                        {fmt.format(new Date(fb.created_at))}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(fb.id, "up")}
                          disabled={isVoting}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors disabled:opacity-50 ${
                            userVote === "up"
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                          }`}
                          aria-label="Daumen hoch"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{fb.upvotes}</span>
                        </button>
                        <button
                          onClick={() => handleVote(fb.id, "down")}
                          disabled={isVoting}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors disabled:opacity-50 ${
                            userVote === "down"
                              ? "text-destructive bg-destructive/10"
                              : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          }`}
                          aria-label="Daumen runter"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{fb.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>

    <FeedbackModal
      open={writeOpen}
      onClose={() => {
        setWriteOpen(false);
        if (open) fetchFeedbacks();
      }}
    />
    </>
  );
}
