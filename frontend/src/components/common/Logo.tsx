import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'small';
}

export default function Logo({ variant = 'default' }: LogoProps) {
  const size = variant === 'small' ? 'h-8' : 'h-10';

  return (
    <Link to="/" className="flex items-center">
      <svg
        className={size}
        viewBox="0 0 500 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Echo Effect */}
        <path
          d="M30 60C30 40 45 25 65 25C85 25 100 40 100 60C100 80 85 95 65 95"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-[--muted] opacity-20"
        />
        <path
          d="M40 60C40 45 50 35 65 35C80 35 90 45 90 60C90 75 80 85 65 85"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-[--muted] opacity-40"
        />
        <path
          d="M50 60C50 50 55 45 65 45C75 45 80 50 80 60C80 70 75 75 65 75"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-[--foreground]"
        />

        {/* Text "echo" */}
        <text
          x="120"
          y="80"
          className="text-[--foreground]"
          style={{
            fontSize: '72px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold'
          }}
          fill="currentColor"
        >
          echo
        </text>

        {/* Dot */}
        <circle
          cx="320"
          cy="60"
          r="8"
          className="fill-blue-500"
        />

        {/* Text "ink" */}
        <text
          x="335"
          y="80"
          className="text-[--foreground]"
          style={{
            fontSize: '72px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold'
          }}
          fill="currentColor"
        >
          ink
        </text>
      </svg>
    </Link>
  );
} 