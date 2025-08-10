import { cn } from "@/lib/utils";
import { InputComponent, Recipe } from "@/lib/types/recipe";
import { RecipeCard } from "./recipe-card";
import { EmptyState } from "./recipe-empty-state";

interface RecipeFormListProps {
  recipes: Recipe[];
  editingId: string | null;
  editValues: Recipe;
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
  onEditClick: (item: Recipe) => void;
  onDuplicateClick: (id: string) => void;
  onCreateInstance: (recipe: Recipe) => void;
  selectedChemicalName: string;
}

export function RecipeFormList({
  recipes,
  editingId,
  editValues,
  onChangeEdit,
  onCancelEdit,
  onSaveEdit,
  onEditClick,
  onDuplicateClick,
  onCreateInstance,
  selectedChemicalName,
}: RecipeFormListProps) {
  if (recipes.length === 0) {
    return (
      <EmptyState
        title="No recipes found"
        description={`Get started by creating a new recipe for ${selectedChemicalName}. Click the "New Recipe" button above to begin.`}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 transition-all duration-500 ease-in-out"
      )}
    >
      {recipes.map((item) => {
        const isEditing = editingId === item.uuid;
        const recipe = isEditing ? editValues : item;

        return (
          <div key={item.uuid} id={`recipe-${item.uuid}`}>
            <RecipeCard
              item={item}
              isEditing={isEditing}
              recipe={recipe}
              onChangeEdit={onChangeEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onEditClick={() => onEditClick(item)}
              onDuplicateClick={() => onDuplicateClick(item.uuid)}
              onCreateInstance={() => onCreateInstance(item)}
              chemicalName={selectedChemicalName}
            />
          </div>
        );
      })}
    </div>
  );
}
