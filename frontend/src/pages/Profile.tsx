import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ProfileSkeleton } from '../components/skeletons';
import PostCard from '../components/posts/PostCard';
import UserAvatar from '../components/common/UserAvatar';
import ProfileCover from '../components/common/ProfileCover';

interface Author {
  id: string;
  username: string;
  created_on: string;
}

interface ProfilePost {
  id: string;
  title: string;
  data: string;
  posted_on: string;
  tags: string[];
  author: Author;
}

interface ProfileData {
  id: string;
  username: string;
  created_on: string;
  Posts: ProfilePost[];
}

const POSTS_PER_PAGE = 10;

const calculatePostingStats = (posts: ProfilePost[]) => {
  if (!posts.length) return null;

  // Sort posts by date
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(a.posted_on).getTime() - new Date(b.posted_on).getTime()
  );

  const firstPost = new Date(sortedPosts[0].posted_on);
  const lastPost = new Date(sortedPosts[sortedPosts.length - 1].posted_on);
  const totalDays = Math.ceil((lastPost.getTime() - firstPost.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  // Calculate posting frequency
  const postsPerDay = posts.length / totalDays;
  const postsPerWeek = postsPerDay * 7;
  const postsPerMonth = postsPerDay * 30;

  // Calculate average words per post
  const totalWords = posts.reduce((acc, post) => acc + post.data.split(/\s+/).length, 0);
  const avgWordsPerPost = Math.round(totalWords / posts.length);

  // Calculate posting time patterns
  const postingHours = posts.map(post => new Date(post.posted_on).getHours());
  const mostActiveHour = postingHours.reduce((acc, hour) => {
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHour = Object.entries(mostActiveHour)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    totalPosts: posts.length,
    totalWords,
    avgWordsPerPost,
    postsPerDay: postsPerDay.toFixed(1),
    postsPerWeek: postsPerWeek.toFixed(1),
    postsPerMonth: Math.round(postsPerMonth),
    firstPost,
    lastPost,
    peakHour: `${peakHour}:00`,
    daysActive: totalDays,
    consistency: postsPerWeek >= 1 ? 'Regular' : 'Occasional',
  };
};

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<ProfilePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      
      setLoading(true);
      try {
        const profileResponse = await api.getAuthorProfile(username);
        if (profileResponse.success && profileResponse.user) {
          setProfile(profileResponse.user);
          const userPosts = profileResponse.user.Posts || [];
          setPosts(userPosts);
          setDisplayedPosts(userPosts.slice(0, POSTS_PER_PAGE));
        } else {
          setError(profileResponse.error || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const loadMore = () => {
    const nextPosts = posts.slice(0, (page + 1) * POSTS_PER_PAGE);
    setDisplayedPosts(nextPosts);
    setPage(page + 1);
  };

  const stats = useMemo(() => calculatePostingStats(posts), [posts]);
  const hasMorePosts = posts.length > displayedPosts.length;

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="text-center py-12"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="mb-12">
        <ProfileCover username={profile?.username || ''} />
        <div className="relative -mt-12 text-center">
          <div className="inline-block">
            <UserAvatar username={profile?.username || ''} size="lg" />
          </div>
          <h1 className="text-3xl font-bold mt-4 mb-2">{profile?.username}</h1>
          <p className="text-[--muted]">
            Member since {profile?.created_on ? 
              new Date(profile.created_on).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-lg bg-[--card] border border-[--border]">
          <h3 className="text-lg font-semibold mb-2">Posts Overview</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-[--muted]">Total Posts:</span>
              <span className="font-bold">{stats?.totalPosts || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Total Words:</span>
              <span className="font-bold">{stats?.totalWords || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Avg. Words/Post:</span>
              <span className="font-bold">{stats?.avgWordsPerPost || 0}</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[--card] border border-[--border]">
          <h3 className="text-lg font-semibold mb-2">Posting Frequency</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-[--muted]">Posts/Day:</span>
              <span className="font-bold">{stats?.postsPerDay || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Posts/Week:</span>
              <span className="font-bold">{stats?.postsPerWeek || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Posts/Month:</span>
              <span className="font-bold">{stats?.postsPerMonth || 0}</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[--card] border border-[--border]">
          <h3 className="text-lg font-semibold mb-2">Activity Pattern</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-[--muted]">Most Active Hour:</span>
              <span className="font-bold">{stats?.peakHour || 'N/A'}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Days Active:</span>
              <span className="font-bold">{stats?.daysActive || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Posting Pattern:</span>
              <span className="font-bold">{stats?.consistency || 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[--card] border border-[--border]">
          <h3 className="text-lg font-semibold mb-2">First & Last Post</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-[--muted]">First Post:</span>
              <span className="font-bold">
                {stats?.firstPost ? new Date(stats.firstPost).toLocaleDateString() : 'N/A'}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-[--muted]">Latest Post:</span>
              <span className="font-bold">
                {stats?.lastPost ? new Date(stats.lastPost).toLocaleDateString() : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-8">Posts</h2>
        {displayedPosts.length > 0 ? (
          <>
            <div className="space-y-8">
              {displayedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {hasMorePosts && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  className="btn btn-secondary"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-[--muted]">No posts yet</p>
        )}
      </div>
    </div>
  );
}