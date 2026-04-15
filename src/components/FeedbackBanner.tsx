"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";

export default function FeedbackBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[2500] pointer-events-auto">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-xl px-3 py-2 border border-border/60 shadow-lg text-muted-foreground hover:text-primary transition-colors"
          aria-label="Feedback geben"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs font-medium">Feedback</span>
        </button>
      </div>

      <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
