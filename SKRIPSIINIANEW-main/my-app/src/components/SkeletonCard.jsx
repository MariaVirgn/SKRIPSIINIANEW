export default function SkeletonCard() {
    return (
      <div className="animate-pulse border p-4 rounded-xl shadow-sm">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }
  