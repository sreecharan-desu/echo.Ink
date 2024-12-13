import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../store/auth';
import { api } from '../services/api';
import { X, Tag, Clock, Sparkles } from 'lucide-react';
import MarkdownEditor from '../components/editor/MarkdownEditor';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishing, setPublishing] = useState(false);
  const token = useRecoilValue(tokenState);
  const navigate = useNavigate();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [milestone, setMilestone] = useState<string | null>(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    if (words >= 100 && words < 200) {
      setMilestone("You're on a roll! 🚀");
    } else if (words >= 200 && words < 500) {
      setMilestone("Great progress! Keep going! ✨");
    } else if (words >= 500) {
      setMilestone("You're writing something amazing! 🌟");
    } else {
      setMilestone(null);
    }
  }, [content]);

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
    if (!token) return;
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setPublishing(true);
    try {
      const response = await api.createPost(token, title.trim(), content.trim(), tags);
      console.log(response);
      if (response.success) {
        navigate(`/post/${response.message.split(' ')[4]}`);
        setSuccess('Post published successfully');
        console.log(success);
      } else {
        setError(response.error || 'Failed to publish post');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {milestone && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 
                       dark:to-blue-900/20 p-4 rounded-lg text-center text-primary"
            >
              {milestone}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        <motion.div
          whileTap={{ scale: 0.995 }}
          className="group"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your story a great title..."
            className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300 
                     dark:placeholder-gray-600 bg-transparent group-hover:placeholder-gray-400
                     transition-all duration-200"
            required
          />
        </motion.div>

        <div className="flex flex-wrap gap-2 items-center min-h-[2.5rem] p-2 rounded-lg
                     bg-gray-50 dark:bg-gray-900/50 group transition-all duration-200
                     hover:bg-gray-100 dark:hover:bg-gray-900">
          <Tag size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
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
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded text-primary"
              />
              <span>Auto-save draft</span>
            </label>
            <div className="text-sm text-gray-500">
              <Clock size={14} className="inline mr-1" />
              {Math.ceil(content.split(/\s+/).length / 200)} min read
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={publishing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>{publishing ? 'Publishing...' : 'Publish'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 