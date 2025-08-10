"use client";

import { SuccessModal } from "@/components/ui/success-modal";
import { Eye, Copy, FileIcon as FileSparkles } from "lucide-react";
import type { Recipe } from "@/lib/types/recipe";

interface RecipeSuccessModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onView: (recipeId: string) => void;
  onClone: (recipe: Recipe) => void;
  onCreateInstance: (recipe: Recipe) => void;
}

export function RecipeSuccessModal({
  recipe,
  open,
  onOpenChange,
  onView,
  onClone,
  onCreateInstance,
}: RecipeSuccessModalProps) {
  if (!recipe) return null;

  const sections = [
    {
      title: "Recipe Information",
      icon: <FileSparkles className="h-4 w-4 text-primary" />,
      content: (
        <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Name</h4>
            <p className="text-lg font-medium">{recipe.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="text-lg font-medium">
              {recipe.description || "No description"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">
              Supplier Chemical
            </h4>
            <p className="text-lg font-medium">
              {recipe.isSupplierChemical ? "Yes" : "No"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "View Recipe",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => recipe.uuid && onView(recipe.uuid),
      variant: "outline" as const,
    },
    {
      label: "Clone Recipe",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => onClone(recipe),
      variant: "outline" as const,
    },
    {
      label: "Create Instance",
      icon: <FileSparkles className="h-4 w-4" />,
      onClick: () => onCreateInstance(recipe),
      variant: "default" as const,
    },
  ];

  return (
    <SuccessModal
      title="Recipe Created Successfully ✨"
      subtitle="Review the details of your newly created recipe below"
      data={recipe}
      open={open}
      onOpenChange={onOpenChange}
      sections={sections}
      actions={actions}
    />
  );
}
