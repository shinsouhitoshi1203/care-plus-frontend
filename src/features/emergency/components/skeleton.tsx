"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ animationDuration: "1.5s" }}
    />
  );
}

function SkeletonSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-6 w-48 mx-auto mb-3" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </div>
      </div>
    </div>
  );
}
