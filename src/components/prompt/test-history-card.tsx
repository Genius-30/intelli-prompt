import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TestRun = {
  model: string;
  modelLabel: string;
  modelLogo: string;
  output: string;
  values: Record<string, string>;
  timestamp: string;
};

export function TestHistoryCard({ run }: { run: TestRun }) {
  const getHighlightedOutput = () => {
    const pattern = /\{\{(.*?)\}\}/g;
    const segments = (run.output || "").split(pattern);

    return segments.map((segment, i) => {
      if (i % 2 === 1) {
        const val = run.values[segment] || "";
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded text-black dark:text-white cursor-help">
                {val}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              Variable: <strong>{segment}</strong>
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span key={i}>{segment}</span>;
    });
  };

  return (
    <div className="relative border rounded-lg p-4 bg-background shadow-sm">
      {/* Model Logo */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
        <Image
          src={run.modelLogo}
          alt={run.modelLabel}
          width={16}
          height={16}
        />
        <span>{run.modelLabel}</span>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground mb-2">{run.timestamp}</p>

      {/* Rendered Prompt */}
      <div className="text-sm whitespace-pre-wrap">
        {getHighlightedOutput()}
      </div>
    </div>
  );
}
