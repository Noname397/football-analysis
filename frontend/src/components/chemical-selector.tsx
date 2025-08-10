"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Search,
  ChevronDown,
  X,
  Filter,
  FlaskRoundIcon as Flask,
} from "lucide-react";
import { Chemical } from "@/lib/types/chemical";
import { useGetChemicals } from "@/lib/queries/useChemical";

interface ChemicalSelectorProps {
  processId: string;
  stepId: string;
  stepUnits: string;
  selection: Chemical;
  selectionIndex: number;
  chemicalDropdownOpen: Record<string, boolean>;
  chemicalSearchQuery: Record<string, string>;
  chemicalTypeFilters: Record<string, string[]>;
  chemicalUseCaseFilters: Record<string, string[]>;
  toggleChemicalDropdown: (
    processId: string,
    stepId: string,
    selectionIndex: number
  ) => void;
  setChemicalSearch: (
    processId: string,
    stepId: string,
    selectionIndex: number,
    query: string
  ) => void;
  toggleChemicalTypeFilter: (
    processId: string,
    stepId: string,
    selectionIndex: number,
    type: string
  ) => void;
  clearChemicalTypeFilters: (
    processId: string,
    stepId: string,
    selectionIndex: number
  ) => void;
  toggleChemicalUseCaseFilter: (
    processId: string,
    stepId: string,
    selectionIndex: number,
    useCaseId: string
  ) => void;
  clearChemicalUseCaseFilters: (
    processId: string,
    stepId: string,
    selectionIndex: number
  ) => void;
  handleChemicalChange: (index: number, chemicalId: string) => void;
  handleRequiredAmountChange: (index: number, amount: number) => void;
  handleActualAmountChange: (index: number, amount: number) => void;
  removeChemicalSelection: (index: number) => void;
  selectionIndex2: number;
}

export function ChemicalSelector({
  processId,
  stepId,
  stepUnits,
  selection,
  selectionIndex,
  chemicalDropdownOpen,
  chemicalSearchQuery,
  chemicalTypeFilters,
  chemicalUseCaseFilters,
  toggleChemicalDropdown,
  setChemicalSearch,
  toggleChemicalTypeFilter,
  clearChemicalTypeFilters,
  toggleChemicalUseCaseFilter,
  clearChemicalUseCaseFilters,
  handleChemicalChange,
  handleRequiredAmountChange,
  handleActualAmountChange,
  removeChemicalSelection,
  selectionIndex2,
}: ChemicalSelectorProps) {
  const allChemicals = useGetChemicals().data || [];
  const selectedChemical = allChemicals.find((c) => c.uuid === selection.uuid);
  const key = `${processId}-${stepId}-${selectionIndex}`;
  const chemicalDropdownRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="shadow-sm">
      <CardContent className="relative px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-primary-light"
          onClick={() => removeChemicalSelection(selectionIndex2)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="space-y-4">
          <div className="w-full space-y-2">
            <div className="relative" ref={chemicalDropdownRef}>
              <div
                className="flex cursor-pointer items-center justify-between rounded-md border p-2 transition-colors hover:border-primary hover:bg-primary-light"
                onClick={() =>
                  toggleChemicalDropdown(processId, stepId, selectionIndex)
                }
              >
                <div className="flex w-full items-start gap-2 pt-1">
                  <Flask className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  {selection.uuid ? (
                    (() => {
                      if (!selectedChemical)
                        return (
                          <span className="text-muted-foreground">
                            Select a material
                          </span>
                        );

                      return (
                        <div className="flex w-full flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {selectedChemical.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {selectedChemical.formula}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <Badge
                              variant="outline"
                              className={
                                selectedChemical.isProduct
                                  ? "bg-green-50 text-green-800"
                                  : "bg-blue-50 text-blue-800"
                              }
                            >
                              {!selectedChemical.isProduct
                                ? "Supplier Chemical"
                                : "Product Instance"}
                            </Badge>
                            <span className="ml-1 text-xs">Use Cases:</span>
                            {selectedChemical.chemicalUses.map((use) => (
                              <Badge
                                key={use}
                                variant="outline"
                                className="text-xs"
                              >
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground">
                      Select a material
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
              </div>

              {chemicalDropdownOpen[key] && (
                <div className="absolute z-50 mt-1 max-h-[300px] w-full overflow-auto rounded-md border bg-background shadow-lg">
                  {/* Search and Filters */}
                  <div className="sticky top-0 z-10 border-b bg-background p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search materials..."
                        className="pl-8"
                        value={chemicalSearchQuery[key] || ""}
                        onChange={(e) =>
                          setChemicalSearch(
                            processId,
                            stepId,
                            selectionIndex,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Filter className="mr-1 h-3 w-3" /> Filter by Type:
                      </span>
                      {["base", "product"].map((type) => (
                        <Badge
                          key={type}
                          variant={
                            (chemicalTypeFilters[key] || []).includes(type)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer transition-colors hover:bg-primary-light ${
                            (chemicalTypeFilters[key] || []).includes(type)
                              ? type === "base"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                              : ""
                          }`}
                          onClick={() =>
                            toggleChemicalTypeFilter(
                              processId,
                              stepId,
                              selectionIndex,
                              type
                            )
                          }
                        >
                          {type === "base" ? "Supplier" : "Product"}
                        </Badge>
                      ))}
                      {(chemicalTypeFilters[key] || []).length > 0 && (
                        <Badge
                          variant="outline"
                          className="cursor-pointer transition-colors hover:bg-primary-light"
                          onClick={() =>
                            clearChemicalTypeFilters(
                              processId,
                              stepId,
                              selectionIndex
                            )
                          }
                        >
                          <X className="mr-1 h-3 w-3" /> Clear
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Chemical List */}
                  <div className="p-1">
                    {(() => {
                      const searchQuery = chemicalSearchQuery[key] || "";
                      const typeFilters = chemicalTypeFilters[key] || [];
                      const useCaseFilters = chemicalUseCaseFilters[key] || [];

                      const filteredChemicals = allChemicals.filter(
                        (chemical: Chemical) => {
                          const matchesSearch =
                            chemical.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            (chemical.formula &&
                              chemical.formula
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()));
                          const matchesType =
                            typeFilters.length === 0 ||
                            (typeFilters.includes("base") &&
                              !chemical.isProduct) ||
                            (typeFilters.includes("product") &&
                              chemical.isProduct);
                          const matchesUseCase =
                            useCaseFilters.length === 0 ||
                            chemical.chemicalUses.some((use) =>
                              useCaseFilters.includes(use)
                            );

                          return matchesSearch && matchesType && matchesUseCase;
                        }
                      );

                      if (filteredChemicals.length === 0) {
                        return (
                          <div className="p-2 text-center text-muted-foreground">
                            No materials match your search
                          </div>
                        );
                      }

                      return filteredChemicals.map((chemical: Chemical) => (
                        <div
                          key={chemical.uuid}
                          className="cursor-pointer rounded-md p-2 transition-colors hover:bg-primary-light"
                          onClick={() => {
                            handleChemicalChange(
                              selectionIndex2,
                              chemical?.uuid || ""
                            );
                            toggleChemicalDropdown(
                              processId,
                              stepId,
                              selectionIndex
                            );
                          }}
                        >
                          <div className="flex items-start gap-2 pt-1">
                            <Flask className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <span className="font-medium">{chemical.name}</span>
                            {chemical.formula && (
                              <span className="text-sm text-muted-foreground">
                                {chemical.formula}
                              </span>
                            )}
                          </div>
                          <div className="ml-6 mt-1 flex flex-wrap items-center gap-1">
                            <Badge
                              variant="outline"
                              className={
                                !chemical.isProduct
                                  ? "bg-blue-50 text-blue-800"
                                  : "bg-green-50 text-green-800"
                              }
                            >
                              {!chemical.isProduct
                                ? "Supplier Chemical"
                                : "Product Instance"}
                            </Badge>
                            <span className="ml-1 text-xs">Use Cases:</span>
                            {chemical.chemicalUses.map((use) => (
                              <Badge
                                key={use}
                                variant="outline"
                                className="text-xs"
                              >
                                {use}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selection.uuid && (
            <div className="flex flex-col space-y-1">
              <Label className="mb-1 text-sm font-medium">
                Amount ({stepUnits})
              </Label>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="mr-2 w-16 text-xs text-muted-foreground">
                      Required:
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={""}
                      onChange={(e) =>
                        handleRequiredAmountChange(
                          selectionIndex2,
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className="h-8 w-32 text-right font-mono"
                    />
                  </div>
                  <div className="h-0.5 w-full bg-muted"></div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="mr-2 w-16 text-xs text-muted-foreground">
                      Actual:
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={""}
                      onChange={(e) =>
                        handleActualAmountChange(
                          selectionIndex2,
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="h-0.5 w-full bg-muted"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
