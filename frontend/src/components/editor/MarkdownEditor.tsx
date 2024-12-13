import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PenLine, Eye, Info, Sparkles, Clock } from 'lucide-react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ content, onChange, placeholder }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // Average reading speed
    setLastSavedAt(new Date());
  }, [content]);

  const markdownGuide = [
    { syntax: '# Heading', description: 'Creates a heading' },
    { syntax: '**bold**', description: 'Makes text bold' },
    { syntax: '*italic*', description: 'Makes text italic' },
    { syntax: '[link](url)', description: 'Creates a link' },
    { syntax: '- list item', description: 'Creates a bullet list' },
    { syntax: '1. numbered', description: 'Creates a numbered list' },
    { syntax: '> quote', description: 'Creates a blockquote' },
    { syntax: '`code`', description: 'Formats text as code' },
    { syntax: '---', description: 'Creates a horizontal line' },
  ];

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all">
      <div className="flex justify-between items-center border-b bg-gray-50 dark:bg-gray-900 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition-all
              ${!isPreview 
                ? 'bg-white dark:bg-gray-800 shadow-sm scale-105 text-primary' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <PenLine size={16} className="transition-transform group-hover:rotate-12" />
            <span>Write</span>
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-2 transition-all
              ${isPreview 
                ? 'bg-white dark:bg-gray-800 shadow-sm scale-105 text-primary' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Eye size={16} className="transition-transform group-hover:scale-110" />
            <span>Preview</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1" title="Word count">
            <Sparkles size={14} />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center space-x-1" title="Reading time">
            <Clock size={14} />
            <span>{readingTime} min read</span>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors hover:text-primary"
            title="Markdown Guide"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
      
      {showGuide && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b animate-fadeIn">
          <h3 className="font-medium mb-3 flex items-center space-x-2">
            <Sparkles size={16} className="text-primary" />
            <span>Markdown Magic</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {markdownGuide.map((item) => (
              <div 
                key={item.syntax} 
                className="flex items-center space-x-2 group cursor-pointer
                         hover:bg-white dark:hover:bg-gray-800 p-2 rounded-md transition-all"
              >
                <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded group-hover:text-primary">
                  {item.syntax}
                </code>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="relative group">
        {isPreview ? (
          <div className="prose dark:prose-invert max-w-none p-6 animate-fadeIn">
            <ReactMarkdown>{content || '*Start writing something amazing...*'}</ReactMarkdown>
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[400px] p-6 focus:outline-none resize-none bg-transparent
                       transition-all duration-200 placeholder-gray-300 dark:placeholder-gray-600"
              style={{ height: `${Math.max(400, content.split('\n').length * 24)}px` }}
            />
            {lastSavedAt && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-0 
                           group-hover:opacity-100 transition-opacity">
                Last saved: {lastSavedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 