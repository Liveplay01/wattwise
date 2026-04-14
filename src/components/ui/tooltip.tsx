"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
}

/**
 * Generic hover tooltip that wraps any children.
 * Uses CSS group-hover — no JS state required.
 */
export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
  return (
    <span className="relative group/tooltip inline-block">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 z-[9999]",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          "max-w-[200px] w-max px-2.5 py-1.5 rounded-lg border border-border bg-popover shadow-xl",
          "text-xs text-foreground text-center whitespace-normal leading-snug",
          "opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100",
          "transition-all duration-150 ease-out",
          className
        )}
      >
        {content}
        {side === "top"
          ? <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
          : <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-border" />
        }
      </span>
    </span>
  );
}
