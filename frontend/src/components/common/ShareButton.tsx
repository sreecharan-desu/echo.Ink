import { useState } from 'react';
import { ShareIcon, CheckIcon, LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.86807 5.16064H8.00833L12.0703 10.8031L12.6896 11.6888L17.8559 18.8431H15.7156L11.4257 12.9741V12.9738Z"/>
    </svg>
  );
}

interface ShareButtonProps {
  postId: string;
  title: string;
}

export default function ShareButton({ postId, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out "${title}" on EchoInk\n${postUrl}`
    )}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-[--background] transition-colors"
        title="Share post"
      >
        <ShareIcon className="w-5 h-5 text-[--muted] hover:text-[--foreground]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-72 bg-[--card] border border-[--border] rounded-xl shadow-lg z-50"
            >
              <div className="p-4">
                <h3 className="text-sm font-medium text-[--foreground] mb-3">
                  Share this post
                </h3>
                
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[--background] transition-colors mb-2"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-[--muted]" />
                  )}
                  <span className="text-[--foreground]">
                    {copied ? 'Copied!' : 'Copy link'}
                  </span>
                </button>

                {/* X (Twitter) Share Button */}
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[--background] transition-colors"
                >
                  <XIcon className="w-5 h-5 text-[--foreground]" />
                  <span className="text-[--foreground]">Share on X</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 