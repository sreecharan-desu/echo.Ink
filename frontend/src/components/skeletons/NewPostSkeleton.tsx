export default function NewPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 animate-pulse">
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-[--card] rounded" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-[--card] rounded" />
          <div className="h-4 w-full bg-[--card] rounded" />
          <div className="h-4 w-2/3 bg-[--card] rounded" />
        </div>
        <div className="flex justify-end space-x-4">
          <div className="h-10 w-24 bg-[--card] rounded" />
          <div className="h-10 w-32 bg-[--card] rounded" />
        </div>
      </div>
    </div>
  );
} 