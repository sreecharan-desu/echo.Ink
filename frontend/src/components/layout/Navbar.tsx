import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../store/auth';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import UserMenu from './UserMenu';
import { PenSquareIcon} from 'lucide-react';
// import Search from '../common/Search';

export default function Navbar() {
  const currentUser = useRecoilValue(userState);
  console.log(currentUser);
  return (
    <nav className="border-b border-[--border] bg-[--background]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        {/* <Search /> */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            to="/new-post"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[--background] transition-colors"
          >
            <PenSquareIcon className="w-4 h-4 text-[--muted]" />
            <span className="text-[--foreground]">Write</span>
          </Link>

          {currentUser ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/signin" 
                className="text-[--muted] hover:text-[--foreground] transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 