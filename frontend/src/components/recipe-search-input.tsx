"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Tag } from "lucide-react";
import type { Recipe } from "@/lib/types/recipe";
import { Badge } from "@/components/ui/badge";
import { useRecipes, useRecipesByChemicalId } from "@/lib/queries/useRecipe";

interface RecipeSearchInputProps {
  action: (recipe: Recipe) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  clearOnSelect?: boolean;
  selectedRecipe?: Recipe;
  onDropdownOpenChange?: (isOpen: boolean) => void;
  chemicalId?: string;
}

export function RecipeSearchInput({
  action,
  placeholder = "Type to search recipes...",
  initialValue = "",
  className = "",
  clearOnSelect = true,
  selectedRecipe,
  onDropdownOpenChange,
  chemicalId,
}: RecipeSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Fetch recipes based on whether a chemicalId is provided or not
  const { data: recipes = [], isLoading } = useRecipesByChemicalId(
    chemicalId || null
  );

  // Update search query when selectedRecipe changes
  useEffect(() => {
    if (selectedRecipe) {
      setSearchQuery(selectedRecipe.name);
    }
  }, [selectedRecipe]);

  // Notify parent component when dropdown state changes
  useEffect(() => {
    onDropdownOpenChange?.(showDropdown);
  }, [showDropdown, onDropdownOpenChange]);

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={searchInputRef}>
      <div className="relative z-20">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={
            chemicalId ? placeholder : "Select a chemical to show recipes"
          }
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="pl-8"
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-[200px] w-full overflow-auto rounded-md border bg-background shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading recipes...</span>
            </div>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.uuid}
                className="cursor-pointer p-2 transition-colors hover:bg-primary-light"
                onClick={() => {
                  action(recipe);
                  if (clearOnSelect) {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(recipe.name);
                  }
                  setShowDropdown(false);
                }}
              >
                <div className="font-medium">{recipe.name}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-muted-foreground">
              No recipes found. Use the "+ New" button to create a new recipe.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
