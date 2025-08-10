"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Chemical } from "@/lib/types/chemical";
import { useGetChemicals } from "@/lib/queries/useChemical";

interface ChemicalSearchInputProps {
  action: (chemical: Chemical) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  clearOnSelect?: boolean;
  selectedChemical?: Chemical;
  onDropdownOpenChange?: (isOpen: boolean) => void;
}

export function ChemicalSearchInput({
  action,
  placeholder = "Type to search chemicals...",
  initialValue = "",
  className = "",
  clearOnSelect = true,
  selectedChemical,
  onDropdownOpenChange,
}: ChemicalSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Fetch chemicals when dropdown is opened
  const { data: chemicals = [], isLoading: isChemicalsLoading } =
    useGetChemicals();

  function formatChemicalTitle(chemical: Chemical): string {
    return `${chemical.id}: ${chemical.name}`;
  }

  // Update search query when selectedChemical changes
  useEffect(() => {
    if (selectedChemical) {
      setSearchQuery(formatChemicalTitle(selectedChemical));
    }
  }, [selectedChemical]);

  // Notify parent component when dropdown state changes
  useEffect(() => {
    onDropdownOpenChange?.(showDropdown);
  }, [showDropdown, onDropdownOpenChange]);

  // Filter chemicals based on search query
  const filteredChemicals =
    chemicals && chemicals.length > 0
      ? chemicals
          .sort((a, b) => {
            // Sort by ID in descending order (highest to lowest)
            return (b.id || 0) - (a.id || 0);
          })
          .filter((chemical) => {
            const chemicalTitle = formatChemicalTitle(chemical).toLowerCase();
            const chemicalFormula = chemical.formula.toLowerCase();
            const searchQueryLower = searchQuery.toLowerCase().trim();
            return (
              chemicalTitle.includes(searchQueryLower) ||
              chemicalFormula.includes(searchQueryLower)
            );
          })
      : [];

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
          placeholder={placeholder}
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
          {isChemicalsLoading ? (
            <div className="flex items-center justify-center gap-2 p-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading chemicals...</span>
            </div>
          ) : filteredChemicals.length > 0 ? (
            filteredChemicals.map((chemical) => (
              <div
                key={chemical.uuid}
                className="cursor-pointer p-2 transition-colors hover:bg-primary-light"
                onClick={() => {
                  action(chemical);
                  if (clearOnSelect) {
                    setSearchQuery("");
                  } else {
                    setSearchQuery(formatChemicalTitle(chemical));
                  }
                  setShowDropdown(false);
                }}
              >
                <div className="font-medium">
                  {formatChemicalTitle(chemical)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {chemical.formula}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-muted-foreground">
              No chemicals found. Use the "+ New" button to create a new
              chemical.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
