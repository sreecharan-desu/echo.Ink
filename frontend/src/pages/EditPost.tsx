import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState, userState } from '../store/auth';
import { api } from '../services/api';
import { X } from 'lucide-react';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import SinglePostSkeleton from '../components/skeletons/SinglePostSkeleton';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams<{ id: string }>();
  const token = useRecoilValue(tokenState);
  const currentUser = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || !token) return;

      try {
        const response = await api.getPost(id);
        if (response.success) {
          if (currentUser?.id !== response.post.authorId) {
            navigate('/');
            return;
          }
          setTitle(response.post.title);
          setContent(response.post.data);
          setTags(response.post.tags || []);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.log(err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token, currentUser, navigate]);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const response = await api.updatePost(id, token, title.trim(), content.trim());
      
      if (response.success) {
        navigate(`/post/${id}`);
      } else {
        setError(response.error || 'Failed to update post');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SinglePostSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300 
                     dark:placeholder-gray-600 bg-transparent"
            required
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center min-h-[2.5rem]">
          {tags.map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="Add up to 5 tags..."
              className="flex-grow border-none outline-none bg-transparent placeholder-gray-400"
            />
          )}
        </div>

        <MarkdownEditor
          content={content}
          onChange={setContent}
          placeholder="Tell your story..."
        />

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 