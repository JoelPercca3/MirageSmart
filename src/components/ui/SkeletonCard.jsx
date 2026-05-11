import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <Skeleton height={220} />
      <div className="p-3">
        <Skeleton height={14} className="mb-2" />
        <Skeleton height={14} width="70%" className="mb-3" />
        <Skeleton height={18} width="50%" />
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
