// components/StreakCircle.tsx
import React from 'react';

const TOTAL_DAYS = 20;
const RADIUS = 120;
const CENTER = 150;

interface StreakCircleProps {
  currentStreak: number; // 0 to TOTAL_DAYS
  longestStreak: number;
}

const StreakCircle: React.FC<StreakCircleProps> = ({ currentStreak, longestStreak }) => {
  const angleStep = 360 / TOTAL_DAYS;

  return (
    <div className="w-[300px] h-[300px] relative rounded-full bg-black mx-auto">
      {[...Array(TOTAL_DAYS)].map((_, i) => {
        const angle = angleStep * i + 90; // rotate clockwise starting from bottom
        const rad = (angle * Math.PI) / 180;
        const x = CENTER + RADIUS * Math.cos(rad) - 15;
        const y = CENTER + RADIUS * Math.sin(rad) - 15;

        const isFilled = i < currentStreak;
        const isGlowing = i === currentStreak - 1;

        const scale = isFilled ? 1 : Math.max(0.5, 1 - (i - currentStreak) * 0.05);
        const opacity = isFilled ? 1 : Math.max(0.3, 1 - (i - currentStreak) * 0.1);

        return (
          <div
            key={i}
            className={`w-7 h-7 rounded-full absolute flex items-center justify-center text-xs font-bold transition-all duration-300 ${isFilled ? 'bg-primary text-white' : 'bg-gray-700 text-transparent'} ${isGlowing ? 'shadow-[0_0_12px_8px_rgba(89,89,229,0.7)] ' : ''}`}
            style={{ top: y, left: x, transform: `scale(${scale})`, opacity: opacity }}
          >
            {isFilled ? '✔' : ''}
          </div>
        );
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <div className="text-2xl text-primary font-bold">{currentStreak}</div>
        <div className="text-sm text-gray-300">Current Streak</div>
        <div className="text-xs text-gray-400">Longest Streak: {longestStreak}</div>
      </div>
    </div>
  );
};

export default StreakCircle;
