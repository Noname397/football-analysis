"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Recipe } from "@/lib/types/recipe";
import { useCallback, useState } from "react";

interface RecipeSearchProps {
  recipes: Recipe[];
  onSearchResults: (filteredRecipes: Recipe[]) => void;
}

export function RecipeSearch({ recipes, onSearchResults }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        onSearchResults(recipes);
        return;
      }
      const filtered = recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())
      );
      onSearchResults(filtered);
    },
    [recipes, onSearchResults]
  );

  return (
    <div className="relative flex w-full items-center">
      <div className="relative flex-1">
        <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-14 w-full rounded-none border-0 bg-white pl-12 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
