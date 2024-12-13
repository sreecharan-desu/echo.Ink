import PostCardSkeleton from './PostCardSkeleton';

export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="h-48 bg-[--card] rounded-lg" />
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-[--card] border-4 border-[--background]" />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mt-20 mb-12">
        <div className="h-8 w-48 bg-[--card] rounded mx-auto mb-4" />
        <div className="h-4 w-32 bg-[--card] rounded mx-auto" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-lg bg-[--card] border border-[--border]">
            <div className="h-4 w-20 bg-[--border] rounded mb-2" />
            <div className="h-8 w-16 bg-[--border] rounded" />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-5 w-5 bg-[--card] rounded" />
          <div className="h-5 w-24 bg-[--card] rounded" />
        </div>
        <div className="h-4 w-64 bg-[--card] rounded" />
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
} 