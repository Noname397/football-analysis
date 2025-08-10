import { Input } from "@/components/ui/input";
import { FormRow } from "@/components/chemical-recipe/recipe-form-row";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputComponent } from "@/lib/types/recipe";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  ChemicalInstance,
  InputComponentInstance,
} from "@/lib/types/chemical-instance";
import InstanceModal from "@/components/chemical-instance/instance-modal";
import { useInstanceModal } from "@/hooks/forms/useInstanceModal";
import { formatChemicalInstanceId } from "@/app/instances/helpers";
import { formatComponentId } from "@/app/recipe/helpers";
import { useChemicalInstance } from "@/lib/queries/instanceQueries";
import { useGetChemicalByName } from "@/lib/queries/useChemical";
import { noop } from "@/lib/utils";

function InputComponentInstanceRow({
  rowNumber,
  inputComponent,
  inputComponentInstance,
  targetProductMass,
  onInstanceChanged,
  onActualChanged,
  disabled = false,
}: {
  rowNumber: number;
  inputComponent: InputComponent;
  inputComponentInstance: InputComponentInstance;
  targetProductMass: number;
  onInstanceChanged(rowNumber: number, instanceUUID: string): void;
  onActualChanged: (rowNumber: number, actual: number) => void;
  disabled?: boolean;
}) {
  const handleActualChanged = (value: number) => {
    onActualChanged(rowNumber, value);
  };
  function calculateMass(massFraction: number, targetProductMass: number) {
    return massFraction * targetProductMass;
  }

  const {
    isOpen: isInstanceModalOpen,
    openModal: openInstanceModal,
    closeModal: closeInstanceModal,
  } = useInstanceModal();

  function handleSelectInstance(instance: ChemicalInstance) {
    const inputComponentInstanceUUID = instance.uuid || "";
    onInstanceChanged(rowNumber, inputComponentInstanceUUID);
    closeInstanceModal();
  }

  const chemicalInstance = useChemicalInstance(
    inputComponentInstance.chemicalInstanceUUID
  );

  const { data: chemicalData, isLoading } = useGetChemicalByName(
    inputComponent.chemicalName || ""
  );

  return (
    <div className="grid grid-cols-4 gap-2 text-left">
      <div className="flex flex-1 flex-col">
        <Input
          value={formatComponentId(inputComponent)}
          className="h-9"
          placeholder="Recipe"
          disabled={true}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <Button
          onClick={openInstanceModal}
          className={`border border-input bg-white ${
            inputComponentInstance &&
            inputComponentInstance.chemicalInstanceUUID
              ? "text-gray-900"
              : "text-gray-400"
          } hover:bg-gray-100`}
          disabled={disabled}
        >
          {inputComponentInstance && inputComponentInstance.chemicalInstanceUUID
            ? formatChemicalInstanceId(chemicalInstance.data?.id)
            : "Select Instance"}
        </Button>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center">
          <div className="flex-1">
            <NumericInput
              value={calculateMass(
                inputComponent.mass_fraction,
                targetProductMass
              )}
              className="h-9"
              placeholder="kg"
              type="float"
              min={0}
              onChange={noop}
              disabled={true}
            />
          </div>
          <p className="ml-2 text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            kg
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center">
          <div className="flex-1">
            <NumericInput
              value={inputComponentInstance.amount}
              className="h-9"
              placeholder="kg"
              type="float"
              min={0}
              onChange={(val) => {
                handleActualChanged(val);
              }}
              disabled={disabled}
            />
          </div>
          <p className="ml-2 text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            kg
          </p>
        </div>
      </div>
      <InstanceModal
        setSelectedInstance={handleSelectInstance}
        isOpen={isInstanceModalOpen}
        onOpenChange={closeInstanceModal}
        startingChemicalFilters={[chemicalData?.uuid?.toString() || ""]}
        startingRecipeFilters={[inputComponent.recipeUUID || ""]}
      />
    </div>
  );
}

interface InputComponentInstancesEntryProps {
  inputComponentsList: InputComponent[];
  inputComponentInstancesList: InputComponentInstance[];
  setInputComponentInstancesList: (
    inputComponentInstancesList: InputComponentInstance[]
  ) => void;
  targetProductMass?: number;
  setTargetProductMass?: (targetProductMass: number) => void;
  actualProductMass?: number;
  setActualProductMass?: (actualProductMass: number) => void;
  disabled?: boolean;
}

export function InputComponentInstancesEntryProps({
  inputComponentsList,
  inputComponentInstancesList,
  setInputComponentInstancesList,
  targetProductMass = 1,
  setTargetProductMass,
  actualProductMass = 0,
  setActualProductMass,
  disabled = false,
}: InputComponentInstancesEntryProps) {
  const [_targetProductMass, _setTargetProductMass] =
    useState(targetProductMass);
  const [_actualProductMass, _setActualProductMass] =
    useState(actualProductMass);

  useEffect(() => {
    if (targetProductMass !== undefined) {
      _setTargetProductMass(targetProductMass);
    }
  }, [targetProductMass]);

  useEffect(() => {
    setTargetProductMass?.(_targetProductMass);
  }, [_targetProductMass]);

  useEffect(() => {
    if (actualProductMass !== undefined) {
      _setActualProductMass(actualProductMass);
    }
  }, [actualProductMass]);

  useEffect(() => {
    setActualProductMass?.(_actualProductMass);
  }, [_actualProductMass]);

  if (!inputComponentsList || inputComponentsList.length === 0) {
    inputComponentsList = [];
  }

  if (inputComponentsList.length !== inputComponentInstancesList.length) {
    // console.log("Input components list: ", inputComponentsList);
    // console.log("Input component instances list: ", inputComponentInstancesList);
    return "Input components list and input component instances list must have the same length.";
  }
  console.log("Input component instances list: ", inputComponentInstancesList);

  // Create a list to pair input components with their instances
  const inputComponentInstances = inputComponentsList.map(
    (inputComponent, index) => {
      return {
        inputComponent: inputComponent,
        inputComponentInstance: inputComponentInstancesList[index],
      };
    }
  );

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Target Product Mass</label>
        <NumericInput
          value={_targetProductMass}
          className="h-9 min-w-[100px]"
          placeholder="kg"
          type="float"
          min={0}
          onChange={(val) => {
            _setTargetProductMass(val);
          }}
          disabled={disabled}
        />
        <span className="text-sm font-medium">kg</span>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2 text-left">
            <h3 className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Recipe
            </h3>
            <h3 className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instance
            </h3>
            <h3 className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Target Mass
            </h3>
            <h3 className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Actual Mass
            </h3>
          </div>
          {inputComponentInstances.map(
            ({ inputComponent, inputComponentInstance }, index) => (
              <InputComponentInstanceRow
                key={index}
                rowNumber={index}
                inputComponent={inputComponent}
                inputComponentInstance={inputComponentInstance}
                targetProductMass={_targetProductMass}
                onInstanceChanged={(
                  rowNumber: number,
                  instanceUUID: string
                ) => {
                  const newInputComponentInstancesList = [
                    ...inputComponentInstancesList,
                  ];
                  newInputComponentInstancesList[
                    rowNumber
                  ].chemicalInstanceUUID = instanceUUID;
                  setInputComponentInstancesList(
                    newInputComponentInstancesList
                  );
                }}
                onActualChanged={(
                  rowNumber: number,
                  actualInstanceMass: number
                ) => {
                  const newInputComponentInstancesList = [
                    ...inputComponentInstancesList,
                  ];
                  newInputComponentInstancesList[rowNumber].amount =
                    actualInstanceMass;
                  setInputComponentInstancesList(
                    newInputComponentInstancesList
                  );
                }}
                disabled={disabled}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
