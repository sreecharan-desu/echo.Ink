export default function PostCardSkeleton() {
  return (
    <div className="p-6 bg-[--card] rounded-lg border border-[--border] animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-[--border] rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-[--border] rounded" />
          <div className="h-3 w-16 bg-[--border] rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-[--border] rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-[--border] rounded" />
          <div className="h-4 w-2/3 bg-[--border] rounded" />
        </div>
      </div>
    </div>
  );
} 