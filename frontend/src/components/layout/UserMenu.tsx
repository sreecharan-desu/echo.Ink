import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userState, tokenState } from '../../store/auth';
import { LogOutIcon, PenSquareIcon, BookOpenIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '../common/UserAvatar';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const setToken = useSetRecoilState(tokenState);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-[--background] transition-colors"
      >
        <UserAvatar 
          username={currentUser?.username || ''}
          size='sm'
        />
        <span className="text-[--foreground]">{currentUser?.username}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-[--card] border border-[--border] rounded-xl shadow-lg z-50"
            >
              <div className="p-2">
                <Link
                  to={`/profile/${currentUser?.username}`}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[--background] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {/* <UserIcon className="w-4 h-4 text-[--muted]"/> */}
                  <UserAvatar 
                    username={currentUser?.username || ''}
                    size='sm'
                  />    
                  <span className="text-[--foreground]">Profile</span>
                </Link>
                
                <Link
                  to="/new-post"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[--background] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <PenSquareIcon className="w-4 h-4 text-[--muted]" />
                  <span className="text-[--foreground]">Write</span>
                </Link>

                <Link
                  to={`/profile/${currentUser?.username}`}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[--background] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpenIcon className="w-4 h-4 text-[--muted]" />
                  <span className="text-[--foreground]">Your Stories</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-[--background] transition-colors text-red-500"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 