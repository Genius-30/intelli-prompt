"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSetActiveVersion } from "@/lib/queries/version";

interface SetActiveVersionButtonProps {
  versionId: string;
  promptId: string;
  isActive: boolean;
}

export const SetActiveVersionButton = ({
  versionId,
  promptId,
  isActive,
}: SetActiveVersionButtonProps) => {
  const { mutate: setActiveVersion } = useSetActiveVersion();

  const handleClick = () => {
    if (isActive) return toast.info("Already active");
    setActiveVersion({ versionId, promptId });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" type="button" onClick={handleClick}>
          <CheckCircle
            className={cn("h-5 w-5", isActive ? "text-blue-500" : "text-muted-foreground")}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-muted" arrowClassName="bg-muted fill-muted">
        <p>{isActive ? "Already active" : "Set as active version"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
