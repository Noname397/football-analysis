"use client";

import type React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecipeAccordion = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("space-y-3", className)}>{children}</div>;
};

export const RecipeAccordionItem = ({
  children,
  isExpanded,
  onToggle,
  className,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 transition-all duration-200",
        isExpanded && "shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export const RecipeAccordionTrigger = ({
  children,
  isExpanded,
  onClick,
  className,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg flex cursor-pointer items-center justify-between bg-slate-50 px-4 py-3 transition-all hover:bg-slate-100",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200",
          isExpanded && "rotate-180"
        )}
      />
    </div>
  );
};

export const RecipeAccordionContent = ({
  children,
  isExpanded,
  className,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "transition-all duration-200",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="px-4 py-4">{children}</div>
    </div>
  );
};
