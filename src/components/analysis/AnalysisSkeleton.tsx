import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-4 px-4 pb-4">
      {/* Recommendation banner skeleton */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Score cards skeleton */}
      {["solar", "wind", "water"].map((type) => (
        <div
          key={type}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-12 h-7 rounded-md" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}

      {/* Metrics skeleton */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <Skeleton className="h-4 w-20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
