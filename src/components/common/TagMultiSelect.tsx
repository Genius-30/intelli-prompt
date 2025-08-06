"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Tag = {
  label: string;
  value: string;
  category?: string;
};

type TagMultiSelectProps = {
  tags: Tag[];
  selected: string[];
  setSelected: (tags: string[]) => void;
  maxSelected?: number;
};

export function TagMultiSelect({
  tags,
  selected,
  setSelected,
  maxSelected = 5,
}: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter((t) => t !== tag));
    } else if (selected.length < maxSelected) {
      setSelected([...selected, tag]);
    }
  };

  // Optional: group tags by category
  const groupedTags = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    const category = tag.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? `${selected.length} tag(s) selected` : "Select tags"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tags found.</CommandEmpty>

          <ScrollArea className="h-72">
            {Object.entries(groupedTags).map(([category, tags]) => (
              <CommandGroup key={category} heading={category}>
                {tags.map((tag) => (
                  <CommandItem key={tag.value} onSelect={() => toggleTag(tag.value)}>
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        selected.includes(tag.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {tag.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
