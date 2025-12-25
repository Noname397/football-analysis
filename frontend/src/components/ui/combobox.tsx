// components/ui/combobox.tsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, noop } from "../../lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  label: string;
  value: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  /** When true the trigger is non-interactive and the list cannot be opened */
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  placeholder = "Select …",
  onChange,
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === value);

  return (
    <Popover
      open={disabled ? false : open}
      onOpenChange={disabled ? noop : setOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <span className={cn(!current && "text-muted-foreground")}>
            {current?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      {/* Render the dropdown only when not disabled */}
      {!disabled && (
        <PopoverContent
          className="z-[2150] max-h-[300px] overflow-y-auto p-0"
          side="bottom"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search…" className="h-9" />
            <CommandEmpty>No result.</CommandEmpty>

            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      opt.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
