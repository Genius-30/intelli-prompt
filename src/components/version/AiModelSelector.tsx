"use client";

import { Clock, Crown, XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ModelSelectorProps {
  readonly provider: string;
  readonly selectedModel: string | undefined;
  readonly isUserPremium: boolean;
  readonly onSelect: (provider: string, modelId: string) => void;
  readonly onDeselect: (provider: string) => void;
}

export function AIModelSelector({
  provider,
  selectedModel,
  isUserPremium,
  onSelect,
  onDeselect,
}: ModelSelectorProps) {
  const data = AI_MODELS[provider as keyof typeof AI_MODELS];
  const IconComponent = data.icon;
  const isComingSoon = data.comingSoon;
  const isPremium = data.premium;
  const isDisabled = isComingSoon || (isPremium && !isUserPremium);

  const handleSelect = (value: string) => {
    if (isComingSoon) {
      toast.info("This model is coming soon.");
      return;
    }

    if (isPremium && !isUserPremium) {
      toast.error("This model is only available for premium users. Please upgrade your plan.");
      return;
    }

    onSelect(provider, value);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
        isDisabled
          ? "border-muted bg-muted/30 opacity-60"
          : selectedModel
            ? "border-primary bg-primary/5 shadow-md hover:shadow-lg"
            : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      {/* Overlay for coming soon or premium */}
      {isDisabled && (
        <div className="bg-background/75 absolute inset-0 z-10 flex items-center justify-center">
          <div className="space-y-2 text-center">
            {isComingSoon ? (
              <>
                <Clock className="text-muted-foreground mx-auto h-6 w-6" />
                <p className="text-muted-foreground text-xs font-medium">Coming Soon</p>
              </>
            ) : (
              <>
                <Crown className="mx-auto h-6 w-6 text-amber-500" />
                <p className="text-muted-foreground text-xs font-medium">Premium Only</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="relative z-0 space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#09090b] p-2">
              <IconComponent className="h-4 w-4" color="white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold capitalize">{data.name}</h3>
                {isComingSoon && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className="h-3 w-3 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming soon - not available yet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!isComingSoon && isPremium && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Crown className="h-3 w-3 text-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Premium model - Upgrade to access</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{data.description}</p>
            </div>
          </div>

          {selectedModel && !isDisabled && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
              onClick={() => onDeselect(provider)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Select Model */}
        <Select value={selectedModel || ""} onValueChange={handleSelect} disabled={isDisabled}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isComingSoon
                  ? "Coming soon"
                  : isPremium && !isUserPremium
                    ? "Premium required"
                    : "Choose model"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {data.models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  {model.description && (
                    <span className="text-muted-foreground text-xs">{model.description}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
