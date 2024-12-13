import { motion } from 'framer-motion';
import { slideUp, spring } from '../../utils/animations';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideUp}
      transition={spring}
    >
      {children}
    </motion.div>
  );
} 