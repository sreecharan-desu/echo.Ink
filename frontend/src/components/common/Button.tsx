/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { spring } from '../../utils/animations';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors';
  
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
    secondary: 'border border-gray-300 hover:border-gray-400 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    //@ts-expect-error
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
} 