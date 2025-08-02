import { Skeleton } from "@/components/ui/skeleton";

const TOTAL_DAYS = 20;
const RADIUS = 100;
const CENTER = 150;

const StreakCircleSkeleton = () => {
  const angleStep = 360 / TOTAL_DAYS;

  return (
    <div className="relative mx-auto h-[250px] w-[250px] rounded-full bg-transparent">
      {[...Array(TOTAL_DAYS)].map((_, i) => {
        const angle = angleStep * i + 90;
        const rad = (angle * Math.PI) / 180;
        const x = CENTER + RADIUS * Math.cos(rad) - 35;
        const y = CENTER + RADIUS * Math.sin(rad) - 35;

        return (
          <Skeleton key={i} className="absolute h-5 w-5 rounded-full" style={{ top: y, left: x }} />
        );
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <Skeleton className="mx-auto mb-2 h-6 w-10 rounded-md" />
        <Skeleton className="mx-auto h-4 w-20 rounded-md" />
      </div>
    </div>
  );
};

export default StreakCircleSkeleton;
