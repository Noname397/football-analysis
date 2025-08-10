import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeFormHeaderProps {
  recipeCount: number;
  selectedChemicalName: string;
  onAddNewClick: () => void;
  isAddingNew: boolean;
}

export function RecipeFormHeader({
  recipeCount,
  selectedChemicalName,
  onAddNewClick,
  isAddingNew,
}: RecipeFormHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-[#eaeaea] px-6">
      <span className="text-sm font-medium text-[#444]">
        {recipeCount} recipes found for{" "}
        <span className="font-semibold text-black">{selectedChemicalName}</span>
      </span>
      <Button
        type="button"
        className="h-9 rounded-md bg-primary px-4 text-sm text-white transition-colors hover:bg-gray-800"
        onClick={onAddNewClick}
        disabled={isAddingNew}
        aria-label="Add new recipe"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" /> New Recipe
      </Button>
    </div>
  );
}
