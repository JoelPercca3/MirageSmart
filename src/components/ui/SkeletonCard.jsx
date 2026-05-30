export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="aspect-square shimmer" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 shimmer rounded-full w-1/2" />
        <div className="h-4 shimmer rounded-full" />
        <div className="h-4 shimmer rounded-full w-3/4" />
        <div className="h-5 shimmer rounded-full w-1/2 mt-1" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
