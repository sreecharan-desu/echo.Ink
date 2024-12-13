import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'framer-motion';
import UserAvatar from '../common/UserAvatar';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const postDate = new Date(post.posted_on);
  const relativeTime = formatDistanceToNow(postDate, { addSuffix: true });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link 
        to={`/post/${post.id}`}
        className={`block p-6 rounded-xl bg-[--card] border border-[--border] 
                   hover:bg-[--card-hover] transition-all duration-200
                   ${featured ? 'shadow-lg hover:shadow-xl' : ''}`}
      >
        {/* Author Info & Date */}
        <div className="flex items-center space-x-3 mb-4">
          <Link 
            to={`/profile/${post.author?.username}`}
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <UserAvatar username={post.author?.username || ''} size="md" />
          </Link>
          <div className="flex flex-col">
            <Link 
              to={`/profile/${post.author?.username}`}
              className="font-medium text-[--foreground] hover:text-[--foreground]/80 transition-colors text-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {post.author?.username}
            </Link>
            <div className="flex items-center text-sm text-[--muted] space-x-2">
              <time dateTime={postDate.toISOString()} title={format(postDate, 'PPP p')}>
                {relativeTime}
              </time>
              <span>·</span>
              <time dateTime={postDate.toISOString()}>
                {format(postDate, 'MMM d, yyyy')}
              </time>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h2 className={`font-bold mb-2 text-[--foreground] group-hover:text-[--foreground]/90 
                     transition-colors duration-200 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {post.title}
        </h2>

        {/* Post Preview */}
        <p className="text-[--foreground]/70 line-clamp-3 text-base leading-relaxed mb-4">
          {post.data}
        </p>

        <p className='m-2'>
          {post.tags?.map((tag) => (
            <span key={tag} className="bg-gray-200 m-2 italic rounded-xl p-2 text-sm text-[--muted] group-hover:text-[--foreground] transition-colors duration-200">
              #{tag} 
            </span>
          ))}
        </p>
        {/* Read More Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[--muted] group-hover:text-[--foreground] transition-colors duration-200">
            Read more
          </span>
          <div className="text-sm text-[--muted]">
            Written by <span className="font-medium text-[--foreground]">{post.author?.username}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
} 