import { useMemo } from 'react';

interface ProfileCoverProps {
  username: string;
}

export default function ProfileCover({ username }: ProfileCoverProps) {
  const generatePattern = useMemo(() => {
    // Create a deterministic seed from username
    const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate random colors based on username
    const hue = seed % 360;
    const color1 = `hsl(${hue}, 70%, 90%)`;
    const color2 = `hsl(${(hue + 60) % 360}, 70%, 85%)`;
    const color3 = `hsl(${(hue + 180) % 360}, 70%, 80%)`;

    // Generate random shapes
    const shapes = [];
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * (shapes.length + 1)) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    for (let i = 0; i < 15; i++) {
      const shape = {
        type: random(0, 3) > 1.5 ? 'circle' : 'rect',
        x: random(0, 100),
        y: random(0, 100),
        size: random(5, 20),
        opacity: random(0.1, 0.3),
        rotation: random(0, 360),
        color: [color1, color2, color3][Math.floor(random(0, 3))]
      };
      shapes.push(shape);
    }

    return shapes;
  }, [username]);

  return (
    <div className="w-full h-48 relative overflow-hidden rounded-lg bg-gradient-to-br from-[--card] to-[--border]">
      <svg
        className="w-full h-full opacity-50"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {generatePattern.map((shape, index) => (
          shape.type === 'circle' ? (
            <circle
              key={index}
              cx={shape.x}
              cy={shape.y}
              r={shape.size / 2}
              fill={shape.color}
              opacity={shape.opacity}
              transform={`rotate(${shape.rotation} ${shape.x} ${shape.y})`}
            />
          ) : (
            <rect
              key={index}
              x={shape.x - shape.size / 2}
              y={shape.y - shape.size / 2}
              width={shape.size}
              height={shape.size}
              fill={shape.color}
              opacity={shape.opacity}
              transform={`rotate(${shape.rotation} ${shape.x} ${shape.y})`}
            />
          )
        ))}
      </svg>
    </div>
  );
} 