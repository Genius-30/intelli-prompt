"use client";

import { Clock, Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AI_MODELS } from "@/lib/constants";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ModelSelectorProps {
  provider: string;
  selectedModel: string | undefined;
  isUserPremium: boolean;
  onSelect: (provider: string, modelId: string) => void;
  onDeselect: (provider: string) => void;
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
      toast.error(
        "This model is only available for premium users. Please upgrade your plan."
      );
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
          ? "border-primary shadow-md bg-primary/5 hover:shadow-lg"
          : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at center, ${data.color}22 0%, transparent 70%)`,
      }}
    >
      {/* Overlay for coming soon or premium */}
      {isDisabled && (
        <div className="absolute inset-0 bg-background/75 z-10 flex items-center justify-center">
          <div className="text-center space-y-2">
            {isComingSoon ? (
              <>
                <Clock className="w-6 h-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-medium text-muted-foreground">
                  Coming Soon
                </p>
              </>
            ) : (
              <>
                <Crown className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="text-xs font-medium text-muted-foreground">
                  Premium Only
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 relative z-0">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${data.color}15` }}
            >
              <IconComponent
                className="w-4 h-4"
                style={{ color: data.color }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm capitalize">
                  {data.name}
                </h3>
                {isComingSoon && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className="w-3 h-3 text-blue-500" />
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
                        <Crown className="w-3 h-3 text-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Premium model - Upgrade to access</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.description}
              </p>
            </div>
          </div>

          {selectedModel && !isDisabled && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDeselect(provider)}
            >
              Remove
            </Button>
          )}
        </div>

        {/* Select Model */}
        <Select
          value={selectedModel || ""}
          onValueChange={handleSelect}
          disabled={isDisabled}
        >
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
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
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
