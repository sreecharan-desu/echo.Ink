import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { tokenState, userState } from '../store/auth';
import { api } from '../services/api';
import { Post } from '../types';
import PostCard from '../components/posts/PostCard';
import PageTransition from '../components/common/PageTransition';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PenSquareIcon, UsersIcon, SparklesIcon, BookOpenIcon } from 'lucide-react';
import HomeSkeleton from '../components/skeletons/HomeSkeleton';

const POSTS_PER_PAGE = 10;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const token = useRecoilValue(tokenState);
  const currentUser = useRecoilValue(userState);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.getPosts();
        if (response.success) {
          // Filter out current user's posts
          const filteredPosts = currentUser 
            ? response.posts.filter((post: Post) => post.author?.id !== currentUser.id)
            : response.posts;
          
          setPosts(filteredPosts);
          setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_PAGE));
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token, currentUser]);
  
  const loadMore = () => {
    setLoadingMore(true);
    const nextPosts = posts.slice(0, (page + 1) * POSTS_PER_PAGE);
    setDisplayedPosts(nextPosts);
    setPage(page + 1);
    setLoadingMore(false);
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {currentUser ? (
              <>
                <div className="mb-4">
                  <UsersIcon className="w-12 h-12 text-[--foreground]/40 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[--foreground]">
                  No new posts to catch up on
                </h2>
                <p className="text-[--muted] mb-6">
                  Looks like you're all caught up! Check back later for new posts from others.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/new-post"
                    className="btn btn-primary inline-flex items-center space-x-2"
                  >
                    <PenSquareIcon className="h-5 w-5" />
                    <span>Write Something</span>
                  </Link>
                  <Link
                    to={`/profile/${currentUser.username}`}
                    className="btn btn-secondary"
                  >
                    View Your Posts
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2 text-[--foreground]">
                  No posts yet
                </h2>
                <p className="text-[--muted] mb-6">
                  Be the first one to share your thoughts
                </p>
                <Link
                  to="/signin"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  const hasMorePosts = posts.length > displayedPosts.length;

  return (
    <PageTransition>
      {/* Hero Section */}
      {!currentUser && (
        <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Where Ideas Take Flight
              </h1>
              <p className="text-xl text-[--muted] mb-8">
                Join our vibrant community of writers and readers. Share your stories, ideas, and perspectives with the world.
              </p>
              <div className="flex justify-center gap-4">
                <Link 
                  to="/signin" 
                  className="btn btn-primary px-8 py-3 text-lg rounded-full hover:scale-105 transition-transform"
                >
                  Start Writing
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-secondary px-8 py-3 text-lg rounded-full hover:scale-105 transition-transform"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Section */}
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Posts Feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-8">
              <BookOpenIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-[--foreground]">Latest Posts</h2>
            </div>
            <div className="space-y-6">
              {displayedPosts.slice(2).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {post.author?.username != currentUser?.username ? 
                    <PostCard post={post} /> : null
                  }
{/* 
                  {posts.filter(p => p.author?.username == currentUser?.username).length == posts.length ? <>
                    <p className="text-3xl text-center">No new posts yet, pull back later</p>
                  </> : null}
                   */}
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMorePosts && (
              <motion.div 
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn btn-secondary px-8 py-3 rounded-full hover:scale-105 transition-transform"
                >
                  {loadingMore ? (
                    <div className="w-5 h-5 border-2 border-[--foreground] border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Load More Stories'
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Actions */}
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-[--border]"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/new-post"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 rounded-xl hover:scale-105 transition-transform"
                  >
                    <PenSquareIcon className="w-4 h-4" />
                    Write a Story
                  </Link>
                  <Link
                    to={`/profile/${currentUser.username}`}
                    className="btn btn-secondary w-full flex items-center justify-center gap-2 rounded-xl hover:scale-105 transition-transform"
                  >
                    <BookOpenIcon className="w-4 h-4" />
                    Your Stories
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[--card] p-6 rounded-2xl border border-[--border]"
            >
              {/* <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-blue-500" />
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Writing', 'Creativity', 'Programming', 'Design', 'AI'].map((topic) => (
                  <div
                    key={topic}
                    className="py-1.5 px-3 bg-[--background] rounded-full text-sm text-[--muted] hover:text-[--foreground] hover:scale-105 transition-all cursor-pointer"
                  >
                    #{topic}
                  </div>
                ))}
              </div> */}
            </motion.div>

            {/* Join Community */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-6 rounded-2xl border border-[--border]"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-pink-500" />
                Join Our Community
              </h3>
              <p className="text-[--muted] text-sm mb-4">
                Connect with writers and readers from around the world. Share your unique perspective.
              </p>
              {!currentUser && (
                <Link 
                  to="/signin" 
                  className="btn btn-primary w-full rounded-xl hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}