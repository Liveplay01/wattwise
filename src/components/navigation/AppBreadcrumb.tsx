"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type Step = "start" | "analyse" | "ergebnis";

const STEPS: { id: Step; label: string }[] = [
  { id: "start", label: "Standort" },
  { id: "analyse", label: "Analyse" },
  { id: "ergebnis", label: "Ergebnis" },
];

const STEP_ORDER: Record<Step, number> = {
  start: 0,
  analyse: 1,
  ergebnis: 2,
};

interface AppBreadcrumbProps {
  step: Step;
}

export default function AppBreadcrumb({ step }: AppBreadcrumbProps) {
  const currentIndex = STEP_ORDER[step];

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1.5 flex-nowrap">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 sm:gap-1.5">
            <BreadcrumbItem>
              {i === currentIndex ? (
                <BreadcrumbPage
                  className={cn(
                    "text-xs font-medium",
                    i === currentIndex && "text-primary"
                  )}
                >
                  {s.label}
                </BreadcrumbPage>
              ) : (
                <span
                  className={cn(
                    "text-xs",
                    i < currentIndex
                      ? "text-foreground/70"
                      : "text-muted-foreground/40"
                  )}
                >
                  {s.label}
                </span>
              )}
            </BreadcrumbItem>
            {i < STEPS.length - 1 && (
              <BreadcrumbSeparator className="[&>svg]:w-3 [&>svg]:h-3 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
