import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed left-4 top-24 p-3 rounded-full bg-[--card] border border-[--border] 
                 shadow-lg hover:bg-[--card-hover] transition-colors duration-200
                 text-[--muted] hover:text-[--foreground] z-10"
      aria-label="Go back"
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}
