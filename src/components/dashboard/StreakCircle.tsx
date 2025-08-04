const TOTAL_DAYS = 20;
const RADIUS = 100;
const CENTER = 150;

interface StreakCircleProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakCircle: React.FC<StreakCircleProps> = ({ currentStreak, longestStreak }) => {
  const angleStep = 360 / TOTAL_DAYS;

  return (
    <div className="relative mx-auto h-[250px] w-[250px] rounded-full bg-transparent">
      {[...Array(TOTAL_DAYS)].map((_, i) => {
        const angle = angleStep * i + 90; // rotate clockwise starting from bottom
        const rad = (angle * Math.PI) / 180;
        const x = CENTER + RADIUS * Math.cos(rad) - 35;
        const y = CENTER + RADIUS * Math.sin(rad) - 35;

        const isFilled = i < currentStreak;
        const isGlowing = i === currentStreak - 1;

        const scale = isFilled ? 1 : Math.max(0.5, 1 - (i - currentStreak) * 0.05);
        const opacity = isFilled ? 1 : Math.max(0.3, 1 - (i - currentStreak) * 0.1);

        return (
          <div
            key={i}
            className={`absolute flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${isFilled ? "bg-primary text-white" : "bg-muted text-transparent"} ${isGlowing ? "shadow-[0_0_12px_3px_rgba(89,89,229,0.7)]" : ""}`}
            style={{ top: y, left: x, transform: `scale(${scale})`, opacity: opacity }}
          >
            {isFilled ? "✔" : ""}
          </div>
        );
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-primary text-2xl font-bold">{currentStreak}</div>
        <div className="text-muted-foreground text-sm">Current Streak</div>
        <div className="text-muted-foreground text-xs">
          Longest Streak: <span className="text-amber-500">{longestStreak}</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCircle;
