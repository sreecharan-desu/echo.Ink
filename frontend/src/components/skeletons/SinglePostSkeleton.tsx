export default function SinglePostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-3/4 bg-[--card] rounded mb-4" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[--card] rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[--card] rounded" />
            <div className="h-3 w-16 bg-[--card] rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-[--card] rounded w-full" />
        ))}
        <div className="h-4 bg-[--card] rounded w-2/3" />
      </div>
    </div>
  );
} 