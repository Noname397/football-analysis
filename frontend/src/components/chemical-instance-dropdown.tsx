"use client";

import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { ChemicalSelection, ChemicalInstance } from "@/lib/types";
import {
  getFilteredChemicalInstances,
  getSelectedChemicalInstance,
  handleChemicalChange,
  toggleChemicalDropdown,
  handleChemicalSearch,
} from "@/app/instances/create/utils";

interface ChemicalInstanceDropdownProps {
  selection: ChemicalSelection;
  index: number;
  chemicalDropdownOpen: Record<string, boolean>;
  setChemicalDropdownOpen: (state: Record<string, boolean>) => void;
  chemicalSearchQuery: Record<string, string>;
  setChemicalSearchQuery: (query: Record<string, string>) => void;
  chemicalSelections: ChemicalSelection[];
  setChemicalSelections: (selections: ChemicalSelection[]) => void;
}

export function ChemicalInstanceDropdown({
  selection,
  index,
  chemicalDropdownOpen,
  setChemicalDropdownOpen,
  chemicalSearchQuery,
  setChemicalSearchQuery,
  chemicalSelections,
  setChemicalSelections,
}: ChemicalInstanceDropdownProps) {
  const key = `chemical-${selection.processId}-${selection.stepId}`;
  const searchQuery = chemicalSearchQuery[key] || "";
  const isOpen = chemicalDropdownOpen[key] || false;
  const selectedInstance = getSelectedChemicalInstance(selection.chemicalId);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between border rounded-md p-2 cursor-pointer hover:bg-primary-light hover:border-primary transition-colors"
        onClick={() =>
          toggleChemicalDropdown(
            chemicalDropdownOpen,
            setChemicalDropdownOpen,
            key
          )
        }
      >
        {selectedInstance ? (
          <div className="flex flex-col">
            <div className="font-medium">{selectedInstance.name}</div>
            <div className="text-xs text-muted-foreground">
              Recipe: {selectedInstance.recipe.name} • {selectedInstance.amount}{" "}
              kg • Created: {selectedInstance.createdAt}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Select {selection.chemicalType} instance
          </span>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full bg-background border rounded-md mt-1 shadow-lg max-h-[300px] overflow-auto">
          <div className="sticky top-0 bg-background z-10 p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${selection.chemicalType} instances...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) =>
                  handleChemicalSearch(
                    chemicalSearchQuery,
                    setChemicalSearchQuery,
                    key,
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="p-1">
            {getFilteredChemicalInstances(selection.chemicalType, searchQuery)
              .length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                No {selection.chemicalType} instances found
              </div>
            ) : (
              getFilteredChemicalInstances(
                selection.chemicalType,
                searchQuery
              ).map((instance: ChemicalInstance) => (
                <div
                  key={instance.id}
                  className="p-2 hover:bg-primary-light rounded-md cursor-pointer transition-colors"
                  onClick={() => {
                    handleChemicalChange(
                      chemicalSelections,
                      setChemicalSelections,
                      index,
                      instance.id
                    );
                    toggleChemicalDropdown(
                      chemicalDropdownOpen,
                      setChemicalDropdownOpen,
                      key
                    );
                  }}
                >
                  <div className="font-medium">{instance.name}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                    <span>Recipe: {instance.recipe.name}</span>
                    <span>•</span>
                    <span>{instance.amount} kg</span>
                    <span>•</span>
                    <span>Created: {instance.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
