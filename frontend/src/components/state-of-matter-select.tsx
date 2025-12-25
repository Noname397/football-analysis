"use client";

import React from "react";
import { Box, Droplet, Cloud } from "lucide-react";
import { cn } from "../../lib/utils";

type StateOfMatter = "solid" | "liquid" | "gas";

interface StateOfMatterSelectProps {
  value: StateOfMatter;
  onChange: (value: StateOfMatter) => void;
  size?: "small" | "default";
}

const options = [
  { value: "solid", label: "Solid", Icon: Box },
  { value: "liquid", label: "Liquid", Icon: Droplet },
  { value: "gas", label: "Gas", Icon: Cloud },
] as const;

export function StateOfMatterSelect({
  value,
  onChange,
  size = "default",
}: StateOfMatterSelectProps) {
  const isSmall = size === "small";

  return (
    <div
      role="radiogroup"
      aria-label="State of matter"
      className="flex gap-3 p-1"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg transition-all duration-200",
            "bg-white shadow-sm hover:shadow-md",
            isSmall ? "h-16 w-16" : "h-24 w-24",
            value === option.value
              ? "shadow-md ring-2 ring-[#21D894] ring-offset-2"
              : "border border-gray-100 hover:border-gray-200"
          )}
        >
          <input
            type="radio"
            name="state-of-matter"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value as StateOfMatter)}
            className="sr-only"
            aria-label={option.label}
          />

          {/* Selected indicator dot */}
          {value === option.value && (
            <div
              className={cn(
                "absolute right-2 top-2 rounded-full bg-[#21D894]",
                isSmall ? "h-2 w-2" : "h-3 w-3"
              )}
            />
          )}

          <div
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-200",
              isSmall ? "mb-1 p-2" : "mb-2 p-3",
              value === option.value ? "bg-[#21D894]/10" : "bg-gray-50"
            )}
          >
            <option.Icon
              className={cn(
                "transition-colors duration-200",
                isSmall ? "h-5 w-5" : "h-8 w-8",
                value === option.value ? "text-[#21D894]" : "text-gray-400"
              )}
            />
          </div>

          <span
            className={cn(
              "font-medium transition-colors duration-200",
              isSmall ? "text-xs" : "text-sm",
              value === option.value ? "text-gray-900" : "text-gray-500"
            )}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
