"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Creator } from "@/lib/types";

interface CreatorSelectorProps {
  creators: Creator[];
  selectedCreator: Creator | null;
  onCreatorChange: (creator: Creator | null) => void;
}

export function CreatorSelector({
  creators,
  selectedCreator,
  onCreatorChange,
}: CreatorSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCreator ? (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              {selectedCreator.name}
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              Select creator...
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search creators..." />
          <CommandList>
            <CommandEmpty>No creators found.</CommandEmpty>
            <CommandGroup>
              {creators.map((creator) => (
                <CommandItem
                  key={creator.id}
                  value={creator.name}
                  onSelect={() => {
                    onCreatorChange(
                      creator.id === selectedCreator?.id ? null : creator
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedCreator?.id === creator.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  <div>
                    <div>{creator.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {creator.role}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
