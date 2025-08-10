import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormRow } from "./recipe-form-row";
import { InputComponent, Recipe } from "@/lib/types/recipe";
import { InputComponentsEntry } from "@/components/chemical-recipe/input-components-entry";
import { useState } from "react";
import { useGetChemicals } from "@/lib/queries/useChemical";
import { useRecipes, useRecipesByChemicalId } from "@/lib/queries/useRecipe";

interface RecipeFormNewProps {
  recipe: Recipe;
  onChange: (
    field: keyof Recipe,
    value:
      | string
      | boolean
      | string[]
      | Record<string, number>
      | InputComponent[]
  ) => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function RecipeFormNew({
  recipe,
  onChange,
  onCancel,
  onSave,
  isLoading,
}: RecipeFormNewProps) {
  function setInputComponentRows(inputComponentsList: InputComponent[]) {
    onChange("inputComponents", inputComponentsList);
  }

  const { data: chemicalOptions } = useGetChemicals();

  return (
    <div className="border-b border-[#eaeaea] bg-[#fafafa] p-6">
      <div className="rounded-lg border border-[#eaeaea] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-black">New Recipe</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onCancel}
            aria-label="Cancel new recipe"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <FormRow label="Title" required>
            <Input
              value={recipe.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="h-9"
              placeholder="Recipe Title"
            />
          </FormRow>

          <FormRow label="Supplier Chemical">
            <Switch
              checked={recipe.isSupplierChemical}
              onCheckedChange={(checked) =>
                onChange("isSupplierChemical", checked)
              }
            />
          </FormRow>

          <FormRow label="Description">
            <Input
              value={recipe.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="h-9"
              placeholder="Description"
            />
          </FormRow>
        </div>
        {!recipe.isSupplierChemical && recipe.inputComponents && (
          <InputComponentsEntry
            inputComponentsList={recipe.inputComponents}
            setInputComponentsList={setInputComponentRows}
            chemicalOptions={chemicalOptions || []}
          />
        )}
        <div className="mt-6">
          <LoadingButton
            type="button"
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={onSave}
            isLoading={isLoading}
            aria-label="Save new recipe"
          >
            Add Recipe
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
