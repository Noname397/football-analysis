"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Creator } from "@/lib/types";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

interface SelectedFiltersProps {
  selectedChemicals: { id: string; name: string; formula: string }[];
  selectedRecipes: { id: string; name: string }[];
  selectedTags: string[];
  selectedCreator: Creator | null;
  dateRange: DateRange | undefined;
  onRemoveChemical: (id: string) => void;
  onRemoveRecipe: (id: string) => void;
  onRemoveTag: (tag: string) => void;
  onRemoveCreator: () => void;
  onRemoveDateRange: () => void;
  onClearAll: () => void;
}

export function SelectedFilters({
  selectedChemicals,
  selectedRecipes,
  selectedTags,
  selectedCreator,
  dateRange,
  onRemoveChemical,
  onRemoveRecipe,
  onRemoveTag,
  onRemoveCreator,
  onRemoveDateRange,
  onClearAll,
}: SelectedFiltersProps) {
  const hasFilters =
    selectedChemicals.length > 0 ||
    selectedRecipes.length > 0 ||
    selectedTags.length > 0 ||
    selectedCreator !== null ||
    (dateRange?.from !== undefined && dateRange?.to !== undefined);

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedChemicals.map((chemical) => (
          <Badge
            key={chemical.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            Chemical: {chemical.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={() => onRemoveChemical(chemical.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {selectedRecipes.map((recipe) => (
          <Badge
            key={recipe.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            Recipe: {recipe.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={() => onRemoveRecipe(recipe.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            Tag: {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {selectedCreator && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Creator: {selectedCreator.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={onRemoveCreator}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {dateRange?.from && dateRange?.to && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Date: {format(dateRange.from, "MMM d, yyyy")} -{" "}
            {format(dateRange.to, "MMM d, yyyy")}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-muted"
              onClick={onRemoveDateRange}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}
