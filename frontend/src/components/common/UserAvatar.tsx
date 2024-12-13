import { useMemo } from 'react';

interface UserAvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ username, size = 'md' }: UserAvatarProps) {
  const initials = useMemo(() => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [username]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-20 h-20 text-3xl'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-800 text-white flex items-center 
                  justify-center font-medium grayscale filter`}
    >
      {initials}
    </div>
  );
} 