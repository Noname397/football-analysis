import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  generateInputComponentID,
  InputComponent,
} from "@/lib/types/recipe";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecipesByChemicalId } from "@/lib/queries/useRecipe";
import { Chemical } from "@/lib/types/chemical";
import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function InputComponentHeader() {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
      <div>
        <h3 className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Chemical
        </h3>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Recipe
        </h3>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Mass Fraction
        </h3>
      </div>
      <div className="h-8 w-8" />
    </div>
  );
}

function InputComponentRow({
  rowNumber,
  inputComponent,
  onRecipeChanged,
  onMassFractionChanged,
  onDeleteClicked,
  chemicalOptions,
  disableInputChanges = false, // New prop to disable input changes
}: {
  rowNumber: number;
  inputComponent: InputComponent;
  onRecipeChanged: (rowNumber: number, recipeId: string) => void;
  onMassFractionChanged: (rowNumber: number, massFraction: number) => void;
  onDeleteClicked: (rowNumber?: number) => void;
  chemicalOptions: Chemical[];
  disableInputChanges?: boolean; // New prop to disable input changes
}) {
  const handleMassFractionChange = (value: number) => {
    onMassFractionChanged(rowNumber, value);
  };
  const [chemical, setChemical] = useState(
    chemicalOptions?.find((c) => c.name === inputComponent.chemicalName)
  );
  const { data: recipeOptions } = useRecipesByChemicalId(chemical?.uuid || "");
  const [recipe, setRecipe] = useState(
    recipeOptions?.find((r) => r.uuid === inputComponent.recipeUUID)
  );

  // Once inputComponent finishes loading, set the recipe based on the recipeUUID
  useEffect(() => {
    if (inputComponent.recipeUUID) {
      const foundRecipe = recipeOptions?.find(
        (r) => r.uuid === inputComponent.recipeUUID
      );
      setRecipe(foundRecipe);
    } else {
      setRecipe(undefined);
    }
  }, [inputComponent.recipeUUID, recipeOptions]);

  function handleRecipeChange(recipeUUID: string | undefined) {
    if (recipeUUID) {
      const foundRecipe = recipeOptions?.find((r) => r.uuid === recipeUUID);
      setRecipe(foundRecipe);
      onRecipeChanged(rowNumber, recipeUUID);
    } else {
      setRecipe(undefined);
      onRecipeChanged(rowNumber, "");
    }
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
      <div className="w-full min-w-0">

        <Combobox
          options={chemicalOptions.map(c => ({ value: c.uuid ?? "", label: c.name }))}
          value={chemical?.uuid}
          onChange={(val) => {
            setChemical(chemicalOptions.find(c => c.uuid === val));
            handleRecipeChange(undefined);
          }}
          placeholder="Select a chemical"
          className="h-9 w-full"
          disabled={disableInputChanges}
        />

      </div>
      <div className="w-full min-w-0">
        <Select
          value={recipe?.uuid}
          onValueChange={(value) => handleRecipeChange(value)}
          disabled={disableInputChanges}
        >
          <SelectTrigger className={cn(
            "h-9 w-full",                      // existing styles
            !recipe && "text-muted-foreground" // grey out when value is empty
          )}>
            <SelectValue placeholder="Select a recipe" />
          </SelectTrigger>
          <SelectContent>
            {recipeOptions?.map((recipe) => (
              <SelectItem key={recipe.uuid} value={recipe.uuid}>
                {recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full min-w-0">
        <NumericInput
          value={inputComponent.mass_fraction}
          className="h-9 w-full text-sm"
          placeholder="kg/kg"
          type="float"
          min={0}
          max={1}
          onChange={handleMassFractionChange}
          disabled={disableInputChanges}
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 justify-self-end rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600"
        onClick={() => onDeleteClicked(rowNumber)}
        disabled={disableInputChanges}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface InputComponentsEntryProps {
  inputComponentsList: InputComponent[];
  setInputComponentsList: (inputComponentsList: InputComponent[]) => void;
  chemicalOptions?: Chemical[];
  hasInstances?: boolean; // Optional prop to indicate if there are instances
}

export function InputComponentsEntry({
  inputComponentsList,
  setInputComponentsList,
  chemicalOptions = [], // Provide a default empty array
  hasInstances = false, // Optional prop to indicate if there are instances
}: InputComponentsEntryProps) {
  const handleRecipeChanged = (rowNumber: number, recipeId: string) => {
    if (rowNumber >= inputComponentsList.length) {
      console.error(`Row number ${rowNumber} is out of bounds.`);
      throw new Error(`Row number ${rowNumber} is out of bounds.`);
    }

    const updatedList = [...inputComponentsList];
    updatedList[rowNumber].recipeUUID = recipeId;
    setInputComponentsList(updatedList);
  };

  const handleMassFractionChanged = (
    rowNumber: number,
    mass_fraction: number
  ) => {
    if (rowNumber >= inputComponentsList.length) {
      console.error(`Row number ${rowNumber} is out of bounds.`);
      throw new Error(`Row number ${rowNumber} is out of bounds.`);
    }

    const updatedList = [...inputComponentsList];
    updatedList[rowNumber].mass_fraction = mass_fraction;
    setInputComponentsList(updatedList);
  };

  const addRow = () => {
    setInputComponentsList([
      ...inputComponentsList,
      {
        id: generateInputComponentID(),
        recipeUUID: "",
        recipeName: "",
        mass_fraction: 0,
      } as InputComponent,
    ]);
  };

  const removeRow = (rowNumber?: number) => {
    setInputComponentsList(
      rowNumber !== undefined
        ? inputComponentsList.filter((_, index) => index !== rowNumber)
        : inputComponentsList.slice(0, -1)
    );
  };

  if (!inputComponentsList || inputComponentsList.length === 0) {
    inputComponentsList = [];
  }
  return (
    <div className="mt-6 flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Input Components
      </h3>
      <div className="ml-4">
        <div className="flex flex-col gap-2">
          <InputComponentHeader />
          {inputComponentsList.map((inputComponent, index) => (
            <InputComponentRow
              key={inputComponent.id}
              rowNumber={index}
              inputComponent={inputComponent}
              onRecipeChanged={handleRecipeChanged}
              onMassFractionChanged={handleMassFractionChanged}
              onDeleteClicked={removeRow}
              chemicalOptions={chemicalOptions}
              disableInputChanges={hasInstances} // Disable input changes if there are instances
            />
          ))}
        </div>
        {!hasInstances && (
          <div className="mt-4 flex flex-row justify-center gap-2">
            <button
              className="rounded bg-primary p-2 text-sm font-medium text-white"
              onClick={addRow}
            >
              Add Input Component
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
