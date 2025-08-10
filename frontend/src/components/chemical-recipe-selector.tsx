"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, Tag, Plus, X } from "lucide-react";
import type { Recipe } from "@/lib/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChemicalRecipeSelectorProps {
  selectedChemical: string;
  selectedRecipe: Recipe | null;
  onSelect: (recipe: Recipe) => void;
  onCreateRecipe: (recipe: Omit<Recipe, "uuid">) => void;
  recipes: Recipe[];
  isLoading?: boolean;
}

export function ChemicalRecipeSelector({
  selectedChemical,
  selectedRecipe,
  onSelect,
  onCreateRecipe,
  recipes,
  isLoading = false,
}: ChemicalRecipeSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New recipe dialog state
  const [newRecipeOpen, setNewRecipeOpen] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeDescription, setNewRecipeDescription] = useState("");
  const [newRecipeTags, setNewRecipeTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Filter recipes based on search query and selected tags
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch;
  });

  const handleRecipeSelect = (recipe: Recipe) => {
    onSelect(recipe);
    setDropdownOpen(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || tagInput.trim();
    if (tagToAdd && !newRecipeTags.includes(tagToAdd)) {
      setNewRecipeTags([...newRecipeTags, tagToAdd]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewRecipeTags(newRecipeTags.filter((t) => t !== tag));
  };

  const handleCreateRecipe = () => {
    if (newRecipeName && onCreateRecipe) {
      const newRecipe: Omit<Recipe, "uuid"> = {
        name: newRecipeName,
        description: newRecipeDescription,
        isSupplierChemical: false,
      };
      onCreateRecipe(newRecipe);
      setNewRecipeOpen(false);
      setNewRecipeName("");
      setNewRecipeDescription("");
      setNewRecipeTags([]);
    }
    // Close the modal
    setNewRecipeOpen(false);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="recipe-selector" className="font-medium">
        Recipe <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1" ref={dropdownRef}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={dropdownOpen}
            className="w-full justify-between"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedRecipe ? (
              <span className="flex items-center gap-2">
                {selectedRecipe.name}
                {selectedRecipe.isSupplierChemical && (
                  <Badge variant="outline" className="ml-2">
                    Supplier
                  </Badge>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">Select a recipe...</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          {dropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-[400px] w-full overflow-auto rounded-md border bg-background shadow-lg">
              {/* Search */}
              <div className="sticky top-0 z-10 border-b bg-background p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chemical recipes..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Recipe List */}
              <div className="p-1">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Loading recipes...</span>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground">
                    No recipes match your search
                  </div>
                ) : (
                  filteredRecipes.map((recipe, index) => (
                    <div
                      key={recipe.uuid}
                      className="cursor-pointer rounded-md border-b border-gray-100 p-3 transition-colors last:border-b-0 hover:bg-primary-light"
                      onClick={() => handleRecipeSelect(recipe)}
                    >
                      <div className="font-medium">{recipe.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className="flex items-center text-xs">
                          <Tag className="mr-1 h-3 w-3 text-primary" /> Tags:
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 whitespace-nowrap"
          onClick={() => setNewRecipeOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Recipe
        </Button>
      </div>

      <Dialog open={newRecipeOpen} onOpenChange={setNewRecipeOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Recipe</DialogTitle>
            <DialogDescription>
              Create a new recipe for {selectedChemical}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-name">Recipe Name</Label>
                <Input
                  id="recipe-name"
                  value={newRecipeName}
                  onChange={(e) => setNewRecipeName(e.target.value)}
                  placeholder="Enter recipe name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipe-description">Description</Label>
                <Input
                  id="recipe-description"
                  value={newRecipeDescription}
                  onChange={(e) => setNewRecipeDescription(e.target.value)}
                  placeholder="Enter recipe description"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {newRecipeTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tags..."
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRecipeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRecipe}>Create Recipe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
