import PostCardSkeleton from './PostCardSkeleton';

export default function HomeSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
} 