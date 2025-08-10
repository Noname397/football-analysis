import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { InputComponent, Recipe } from "@/lib/types/recipe";
import { Pencil, Copy, Trash2, Plus, AlertTriangle } from "lucide-react";
import { FormRow } from "./recipe-form-row";
import { FormHeader } from "./recipe-form-section-header";
import { useMemo, useState } from "react";
import { InputComponentsEntry } from "@/components/chemical-recipe/input-components-entry";
import { useGetChemicals } from "@/lib/queries/useChemical";
import { useRecipes } from "@/lib/queries/useRecipe";
import { useChemicalInstancesCount } from "@/lib/queries/instanceQueries";
interface RecipeCardProps {
  item: Recipe;
  isEditing: boolean;
  recipe: Recipe;
  onChangeEdit: (
    field: keyof Recipe,
    value:
      | string
      | boolean
      | string[]
      | Record<string, number>
      | InputComponent[]
  ) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditClick: () => void;
  onDuplicateClick: () => void;
  onCreateInstance: () => void;
  chemicalName: string;
}

export function RecipeCard({
  item,
  isEditing,
  recipe,
  onChangeEdit,
  onCancelEdit,
  onSaveEdit,
  onEditClick,
  onDuplicateClick,
  onCreateInstance,
  chemicalName,
}: RecipeCardProps) {
  function setInputComponentRows(inputComponentsList: InputComponent[]) {
    onChangeEdit("inputComponents", inputComponentsList);
  }
  const { data: chemicalOptions } = useGetChemicals();

  // Get the count of chemical instances for this recipe to determine if changes should be disabled
  const recipeFilter = useMemo(() => ({ recipe_uuid: item.uuid }), [item.uuid]);
  const instancesQuery = useChemicalInstancesCount(recipeFilter);
  const instancesCount = instancesQuery.data?.count;
  const hasInstances = instancesCount != undefined && instancesCount > 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-[#eaeaea] bg-white shadow-sm transition-all duration-300 hover:shadow-md",
        isEditing ? "ring-1 ring-primary" : ""
      )}
      onClick={(e) => !isEditing && e.type !== "mousedown" && onEditClick()}
    >
      {isEditing ? (
        <div className="space-y-4 p-5">
          <FormHeader onCancel={onCancelEdit} onSave={onSaveEdit} />
          <FormRow label="Title" required>
            <Input
              value={recipe.name}
              onChange={(e) => onChangeEdit("name", e.target.value)}
              className="h-9"
            />
          </FormRow>
          <FormRow label="Supplier Chemical">
            <Switch
              checked={recipe.isSupplierChemical}
              onCheckedChange={(checked) =>
                onChangeEdit("isSupplierChemical", checked)
              }
              disabled={hasInstances}
            />
          </FormRow>
          <FormRow label="Description">
            <Input
              value={recipe.description}
              onChange={(e) => onChangeEdit("description", e.target.value)}
              className="h-9"
            />
          </FormRow>
          {!recipe.isSupplierChemical && (
            <InputComponentsEntry
              inputComponentsList={recipe.inputComponents || []}
              setInputComponentsList={setInputComponentRows}
              chemicalOptions={chemicalOptions || []}
              hasInstances={hasInstances}
            />
          )}
          {hasInstances && (
            <div role="alert" className="flex items-center justify-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-700">
              <AlertTriangle size={16} className="text-yellow-500" />
              <p className="text-center text-sm">
                This recipe has {instancesCount} instance(s) and inputs cannot
                be edited.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={cn("px-5 py-4")}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h3
                  className="text-base font-medium text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {chemicalName} — {item.name}
                </h3>
                {item.isSupplierChemical && (
                  <span className="rounded-full bg-primary/25 px-3 py-1 text-xs font-medium text-black/75">
                    Supplier Chemical
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateClick();
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 rounded-md bg-gray-100 px-3 text-xs text-gray-700 transition-colors hover:bg-gray-200"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateInstance();
                }}
              >
                Create Instance
              </Button>
            </div>
          </div>
          <p
            className="mt-[-0.3em] line-clamp-1 text-xs text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}
