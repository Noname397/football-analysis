"use client";

import { InputComponent, Recipe } from "@/lib/types/recipe";
import { RecipeSuccessModal } from "./recipe-success-modal";
import { RecipeFormHeader } from "./recipe-form-title-header";
import { RecipeFormToolbar } from "./recipe-form-toolbar";
import { RecipeFormNew } from "./recipe-form-new";
import { RecipeFormList } from "./recipe-form-list";
import { useRecipeFormState } from "@/hooks/forms/useRecipeFormState";
import { generateInputComponentID } from "@/lib/types/recipe";
import React from "react";
interface RecipeFormProps {
  recipeItems: Recipe[];
  selectedChemicalName: string;
  isAddingNew: boolean;
  handleAddNewClick: () => void;
  newRecipe: Recipe;
  onChangeNew: (
    field: keyof Recipe,
    value:
      | string
      | boolean
      | string[]
      | Record<string, number>
      | InputComponent[]
  ) => void;
  onCancelNew: () => void;
  onSaveNew: () => Promise<Recipe>;
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
}

export function RecipeForm({
  recipeItems,
  selectedChemicalName,
  isAddingNew,
  handleAddNewClick,
  newRecipe,
  onChangeNew,
  onCancelNew,
  onSaveNew,
  editingId,
  editValues,
  onChangeEdit,
  onCancelEdit,
  onSaveEdit,
  onEditClick,
  onDuplicateClick,
  onCreateInstance,
}: RecipeFormProps) {
  const {
    filteredRecipes,
    successModalOpen,
    newlyCreatedRecipe,
    isAddingLoading,
    setIsProcessSetModalOpen,
    setSuccessModalOpen,
    handleSearch,
    handleViewRecipe,
    handleCloneRecipe,
    handleCreateInstance,
    handleSaveNew,
  } = useRecipeFormState({
    recipeItems,
    selectedChemicalName,
  });

  const handleSaveNewWithLoading = async () => {
    await handleSaveNew(onSaveNew);
  };

  const handleCloneFromModal = (recipe: Recipe) => {
    setSuccessModalOpen(false);
    handleAddNewClick();
    onChangeNew("name", `${recipe.name} (Clone)`);
    onChangeNew("description", recipe.description || "");
    onChangeNew("isSupplierChemical", recipe.isSupplierChemical);
  };

  // Update the input components for a recipe, ensuring each has a unique ID and return the updated recipe.
  const updateInputComponentsWithID = (recipe: Recipe) => ({
    ...recipe,
    inputComponents: (recipe.inputComponents || []).map((component) => ({
      ...component,
      id: component.id || generateInputComponentID(),
    })),
  });

  // Ensure all recipe components have IDs for list display.
  const memoizedNewRecipe = React.useMemo(() => updateInputComponentsWithID(newRecipe), [newRecipe]);
  const memoizedRecipeItems = React.useMemo(() => recipeItems.map(updateInputComponentsWithID), [recipeItems]);
  const memoizedFilteredRecipes = React.useMemo(() => filteredRecipes.map(updateInputComponentsWithID), [filteredRecipes]);
  const memoizedNewlyCreatedRecipe = React.useMemo(() => newlyCreatedRecipe ? updateInputComponentsWithID(newlyCreatedRecipe) : null, [newlyCreatedRecipe]);

  return (
    <div className="mx-auto w-full overflow-hidden rounded-xl border border-[#eaeaea] bg-white shadow-sm">
      <RecipeFormHeader
        recipeCount={memoizedFilteredRecipes.length}
        selectedChemicalName={selectedChemicalName}
        onAddNewClick={handleAddNewClick}
        isAddingNew={isAddingNew}
      />

      <RecipeFormToolbar
        onSearch={(memoizedFilteredRecipes) => handleSearch(memoizedFilteredRecipes)}
        recipes={memoizedRecipeItems}
      />

      {isAddingNew && (
        <RecipeFormNew
          recipe={memoizedNewRecipe}
          onChange={onChangeNew}
          onCancel={onCancelNew}
          onSave={handleSaveNewWithLoading}
          isLoading={isAddingLoading}
        />
      )}

      <RecipeFormList
        recipes={memoizedFilteredRecipes}
        editingId={editingId}
        editValues={editValues}
        onChangeEdit={onChangeEdit}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
        onEditClick={onEditClick}
        onDuplicateClick={onDuplicateClick}
        onCreateInstance={onCreateInstance}
        selectedChemicalName={selectedChemicalName}
      />

      <RecipeSuccessModal
        recipe={memoizedNewlyCreatedRecipe}
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        onView={handleViewRecipe}
        onClone={handleCloneFromModal}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
}
