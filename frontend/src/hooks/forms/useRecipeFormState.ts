import { useState, useCallback, useMemo } from "react";
import { Recipe } from "@/lib/types/recipe";
import { useConfetti } from "@/hooks/useConfetti";

interface UseRecipeFormStateProps {
  recipeItems: Recipe[];
  selectedChemicalName: string;
}

export function useRecipeFormState({
  recipeItems,
  selectedChemicalName,
}: UseRecipeFormStateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessSetModalOpen, setIsProcessSetModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [newlyCreatedRecipe, setNewlyCreatedRecipe] = useState<Recipe | null>(
    null
  );
  const [isAddingLoading, setIsAddingLoading] = useState(false);
  const { addConfetti } = useConfetti();

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipeItems;
    const query = searchQuery.toLowerCase();
    return recipeItems.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
    );
  }, [recipeItems, searchQuery]);

  const handleSearch = useCallback((filteredRecipes: Recipe[]) => {
    setSearchQuery("");
  }, []);

  const handleViewRecipe = useCallback((recipeId: string) => {
    setSuccessModalOpen(false);
    setTimeout(() => {
      const recipeCard = document.getElementById(`recipe-${recipeId}`);
      if (recipeCard) {
        recipeCard.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);

  const handleCloneRecipe = useCallback((recipe: Recipe) => {
    setSuccessModalOpen(false);
    return recipe;
  }, []);

  const handleCreateInstance = useCallback((recipe: Recipe) => {
    setSuccessModalOpen(false);
    return recipe;
  }, []);

  const handleSaveNew = useCallback(
    async (onSaveNew: () => Promise<Recipe>) => {
      try {
        setIsAddingLoading(true);
        setNewlyCreatedRecipe(null);
        const savedRecipe = await onSaveNew();
        const response = await fetch(`/recipes/${savedRecipe.uuid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const recipeFromDb = await response.json();
        setNewlyCreatedRecipe(recipeFromDb);
        setSuccessModalOpen(true);
        addConfetti();
      } catch (error) {
        console.error("Failed to create recipe:", error);
      } finally {
        setIsAddingLoading(false);
      }
    },
    [addConfetti]
  );

  return {
    filteredRecipes,
    isProcessSetModalOpen,
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
  };
}
