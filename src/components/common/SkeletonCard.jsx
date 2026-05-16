export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-neutral-200 aspect-[3/4] rounded-sm mb-3" />
      <div className="space-y-2 p-2">
        <div className="h-3 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-3 bg-neutral-200 rounded w-1/4" />
      </div>
    </div>
  );
}
