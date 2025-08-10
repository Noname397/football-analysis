import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RecipeSearch } from "./recipe-search";
import { Recipe } from "@/lib/types/recipe";

interface RecipeFormToolbarProps {
  onSearch: (filteredRecipes: Recipe[]) => void;
  recipes: Recipe[];
}

export function RecipeFormToolbar({
  onSearch,
  recipes,
}: RecipeFormToolbarProps) {
  return (
    <div className="flex w-full items-center border-b border-[#eaeaea]">
      <RecipeSearch recipes={recipes} onSearchResults={onSearch} />
    </div>
  );
}
