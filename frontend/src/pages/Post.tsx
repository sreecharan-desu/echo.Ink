import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import { tokenState, userState } from '../store/auth';
import { Post as PostType } from '../types';
import { api } from '../services/api';
import UserAvatar from '../components/common/UserAvatar';
import { PencilIcon, TrashIcon } from 'lucide-react';
import SinglePostSkeleton from '../components/skeletons/SinglePostSkeleton';
import ShareButton from '../components/common/ShareButton';

export default function Post() {
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();
  const token = useRecoilValue(tokenState);
  const currentUser = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await api.getPost(id);
        if (response.success) {
          setPost(response.post);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!token || !id || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await api.deletePost(id, token);
      if (response.success) {
        navigate('/');
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  if (loading) {
    return <SinglePostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Post not found'}
      </div>
    );
  }

  const isOwner = currentUser?.id === post.author?.id;

  return (
    <article className="max-w-3xl mx-auto px-4 mt-10">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-4xl font-bold text-[--foreground]">
          {post.title}
        </h1>
        <div className="flex items-center space-x-2">
          <ShareButton postId={post.id} title={post.title} />
          {isOwner && (
            <>
              <button
                onClick={handleEdit}
                className="p-2 text-[--muted] hover:text-blue-500 transition-colors"
                title="Edit post"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-[--muted] hover:text-red-500 transition-colors"
                title="Delete post"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-8">
        <Link to={`/profile/${post.author?.username}`}>
          <UserAvatar username={post.author?.username || ''} size="md" />
        </Link>
        <div className="flex items-center space-x-2">
          <Link 
            to={`/profile/${post.author?.username}`}
            className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          >
            {post.author?.username}
          </Link>
          <span className="text-gray-400 dark:text-gray-500">·</span>
          <time 
            dateTime={post.posted_on}
            className="text-gray-500 dark:text-gray-400"
            title={format(new Date(post.posted_on), 'MMMM d, yyyy h:mm a')}
          >
            {format(new Date(post.posted_on), 'MMM d, yyyy')}
          </time>
        </div>
      </div>

      <div className="prose dark:prose-invert prose-lg max-w-none">
        {post.data.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-800 dark:text-gray-200">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}