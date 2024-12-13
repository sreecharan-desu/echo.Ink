import { PenSquareIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spring } from '../../utils/animations';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 right-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring}
    >
      <Link
        to={isAuthenticated ? "/new-post" : "#"}
        onClick={handleClick}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl transition-shadow"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
        >
          <PenSquareIcon className="h-6 w-6" />
        </motion.div>
      </Link>
    </motion.div>
  );
} 