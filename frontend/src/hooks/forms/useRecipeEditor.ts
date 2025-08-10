import { useState } from "react";
import { useRecipeMutations } from "@/lib/queries/useRecipe";
import { InputComponent, Recipe, RecipePayload } from "@/lib/types/recipe";
import { Chemical } from "@/lib/types/chemical";

const initialRecipeState: Partial<Recipe> = {
  name: "",
  description: "",
  isSupplierChemical: false,
  inputComponents: [
    {
      recipeUUID: "",
      recipeName: "",
      mass_fraction: 0,
    },
  ],
};

export function useRecipeEditor() {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingChemicalUUID, setEditingChemicalUUID] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    ...initialRecipeState,
    uuid: "new",
  } as Recipe);
  const [editValues, setEditValues] = useState<Recipe>({
    ...initialRecipeState,
    uuid: "",
  } as Recipe);

  const {
    deleteRecipe,
    isDeleting,
    duplicateRecipe,
    isDuplicating,
    createRecipe,
    updateRecipe,
    isCreating,
    isUpdating,
  } = useRecipeMutations();

  const handleAddNewClick = (selectedChemical: Chemical) => {
    setIsAddingNew(true);
    setNewRecipe((<Recipe>{
      ...initialRecipeState,
      uuid: "new",
      name: `${selectedChemical.name} Recipe`,
      chemical: selectedChemical,
      description: `New recipe for ${selectedChemical.name}`,
    }) as Recipe);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewRecipe({
      ...initialRecipeState,
      uuid: "new",
    } as Recipe);
  };

  const handleSaveNew = async () => {
    try {
      const createdRecipe = await createRecipe({
        chemicalUUID: newRecipe.chemical?.uuid ?? "",
        uuid: "",
        name: newRecipe.name || "",
        description: newRecipe.description || "",
        inputComponents: newRecipe.inputComponents || [],
      } as RecipePayload);
      setIsAddingNew(false);
      setNewRecipe({
        ...initialRecipeState,
        uuid: "new",
      } as Recipe);
      return createdRecipe;
    } catch (error) {
      throw error;
    }
  };

  const handleEditClick = (item: Recipe) => {
    setEditingId(item.uuid);
    setEditingChemicalUUID(item.chemical?.uuid || null);

    setEditValues({
      uuid: item.uuid,
      name: item.name,
      description: item.description,
      isSupplierChemical: item.isSupplierChemical,
      inputComponents: item.inputComponents || [],
    } as Recipe);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({
      ...initialRecipeState,
      uuid: "",
    } as Recipe);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    console.log("Saving edited recipe with ID:", editingId);

    try {
      await updateRecipe({
        id: editingId,
        payload: {
          chemicalUUID: editingChemicalUUID || "",
          name: editValues.name,
          description: editValues.description || undefined,
          inputComponents: editValues.inputComponents || undefined,
          uuid: editValues.uuid || "",
          isSupplierChemical: editValues.isSupplierChemical,
        } as RecipePayload,
      });
      setEditingId(null);
      setEditValues({
        ...initialRecipeState,
        uuid: "",
      } as Recipe);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteRecipe(id);
    } catch (error) {
      throw error;
    }
  };

  const handleDuplicateClick = async (id: string) => {
    try {
      await duplicateRecipe(id);
    } catch (error) {
      throw error;
    }
  };

  const handleChangeNew = (
    field: keyof Recipe,
    value:
      | string
      | boolean
      | string[]
      | Record<string, number>
      | InputComponent[]
  ) => {
    if (field === "isSupplierChemical") {
      setNewRecipe((prev) => ({
        ...prev,
        isSupplierChemical: value as boolean,
        // Clear input components when switching to supplier chemical
        inputComponents: value
          ? []
          : [
              {
                recipeUUID: "",
                recipeName: "",
                mass_fraction: 0,
              },
            ],
      }));
    } else {
      setNewRecipe((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleChangeEdit = (
    field: keyof Recipe,
    value:
      | string
      | boolean
      | string[]
      | Record<string, number>
      | InputComponent[]
  ) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isAddingNew,
    editingId,
    newRecipe,
    editValues,
    isDeleting,
    isDuplicating,
    isCreating,
    isUpdating,
    handleAddNewClick,
    handleCancelNew,
    handleSaveNew,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleDeleteClick,
    handleDuplicateClick,
    handleChangeNew,
    handleChangeEdit,
  };
}
