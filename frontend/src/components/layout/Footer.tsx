import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[--border] bg-[--background]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[--foreground]">About</h3>
            <p className="text-sm text-[--muted]">
              A platform for writers to share their stories and connect with readers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[--foreground]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[--muted] hover:text-[--foreground] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[--muted] hover:text-[--foreground] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/new-post" className="text-[--muted] hover:text-[--foreground] transition-colors">
                  Write
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[--foreground]">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-[--muted] hover:text-[--foreground] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[--muted] hover:text-[--foreground] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[--foreground]">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/echoink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--muted] hover:text-[--foreground] transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://github.com/echoink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--muted] hover:text-[--foreground] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[--border] flex flex-col md:flex-row justify-between items-center text-sm text-[--muted]">
          <div className="flex items-center space-x-1">
            <span>© {currentYear} echo.ink. Made with</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/terms" className="hover:text-[--foreground] transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-[--foreground] transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 