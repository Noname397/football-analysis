"use client";

import { useState, useMemo } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Input } from "./input";
import { Badge } from "./badge";
import { Search, Plus, ChevronUp, X, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Base filter configuration
export interface FilterFieldConfig<T> {
  key: keyof T;
  label: string;
  type:
    | "text"
    | "select"
    | "multiselect"
    | "daterange"
    | "number"
    | "reference";
  searchable?: boolean;
  sortable?: boolean;
  // For reference fields (foreign keys)
  referenceConfig?: {
    displayField: string; // Field to show in UI (e.g., 'name')
    valueField: string; // Field to use as value (e.g., 'uuid')
    searchEndpoint?: string; // Optional: API endpoint to search
    data?: unknown[]; // Static data if available
  };
  // For select fields
  options?: { value: string; label: string }[];
  // Custom render function for complex filtering
  renderFilter?: (
    value: unknown,
    onChange: (value: unknown) => void
  ) => React.ReactNode;
}

export interface FilterConfig<T> {
  searchFields: (keyof T)[]; // Fields to include in text search
  filterFields: FilterFieldConfig<T>[];
  sortOptions: {
    value: string;
    label: string;
    field: keyof T;
    direction: "asc" | "desc";
  }[];
}

export interface FilterPanelProps<T> {
  data?: T[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  config: FilterConfig<T>;
  onClearAll?: () => void;
  searchPlaceholder?: string;
}

export function FilterPanel<T>({
  data = [],
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  config,
  onClearAll,
  searchPlaceholder = "Search...",
}: FilterPanelProps<T>) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Calculate if there are active filters
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some((key) => {
      const value = filters[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      );
    });
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...filters };
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  // Remove a specific filter
  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange({});
    if (onClearAll) {
      onClearAll();
    }
  };

  // Render filter input based on type
  const renderFilterInput = (fieldConfig: FilterFieldConfig<T>) => {
    const key = String(fieldConfig.key);
    const value = filters[key];

    switch (fieldConfig.type) {
      case "text":
        return (
          <Input
            placeholder={`Filter by ${fieldConfig.label.toLowerCase()}...`}
            value={value || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(newValue) => handleFilterChange(key, newValue)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Select ${fieldConfig.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "reference":
        if (fieldConfig.referenceConfig && fieldConfig.renderFilter) {
          return fieldConfig.renderFilter(value, (newValue) =>
            handleFilterChange(key, newValue)
          );
        }
        return null;

      case "multiselect":
        if (fieldConfig.renderFilter) {
          return fieldConfig.renderFilter(value, (newValue) =>
            handleFilterChange(key, newValue)
          );
        }
        return null;

      case "daterange":
        if (fieldConfig.renderFilter) {
          return fieldConfig.renderFilter(value, (newValue) =>
            handleFilterChange(key, newValue)
          );
        }
        return null;

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Filter by ${fieldConfig.label.toLowerCase()}...`}
            value={value || ""}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        );

      default:
        if (fieldConfig.renderFilter) {
          return fieldConfig.renderFilter(value, (newValue) =>
            handleFilterChange(key, newValue)
          );
        }
        return null;
    }
  };

  // Get display value for filter badges
  const getFilterDisplayValue = (
    key: string,
    value: any,
    fieldConfig: FilterFieldConfig<T>
  ) => {
    if (Array.isArray(value)) {
      return value.length > 1 ? `${value.length} items` : value[0];
    }

    // For select fields, show the label instead of value
    if (fieldConfig.type === "select" && fieldConfig.options) {
      const option = fieldConfig.options.find((opt) => opt.value === value);
      return option ? option.label : value;
    }

    // For date ranges, format them nicely
    if (fieldConfig.type === "daterange" && value?.from && value?.to) {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `${formatter.format(new Date(value.from))} - ${formatter.format(
          new Date(value.to)
        )}`;
      } catch {
        return "Date range";
      }
    }

    return value;
  };

  // Render active filter badges
  const renderActiveFilterBadges = () => {
    return Object.entries(filters).map(([key, value]) => {
      const fieldConfig = config.filterFields.find(
        (f) => String(f.key) === key
      );
      if (!fieldConfig || !value) return null;

      const displayValue = getFilterDisplayValue(key, value, fieldConfig);

      return (
        <Badge
          key={key}
          className="flex items-center gap-1 bg-primary/10 text-xs text-foreground hover:bg-primary/20"
        >
          {fieldConfig.label}: {displayValue}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-4 w-4 p-0 hover:bg-muted"
            onClick={() => removeFilter(key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    });
  };

  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header section with search and controls */}
          <div className="flex items-center justify-between">
            <div className="relative mr-4 flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-8 w-[10em] text-xs [&>svg:last-child]:hidden">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {config.sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleClearAll}
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="h-8 gap-1"
              >
                {isFilterExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span className="text-xs">Close</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span className="text-xs">Add Filter</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Active filters display */}
          {(hasActiveFilters || isFilterExpanded) && (
            <div className="rounded-md border border-dashed p-3">
              {hasActiveFilters ? (
                <div className="flex flex-wrap gap-2">
                  {renderActiveFilterBadges()}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No filters applied. Click "Add Filter" to filter data.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expanded filter options */}
        {isFilterExpanded && (
          <div className="mt-2 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {config.filterFields.map((fieldConfig) => (
                <div key={String(fieldConfig.key)}>
                  <h3 className="mb-2 text-sm font-medium">
                    Filter by {fieldConfig.label}
                  </h3>
                  {renderFilterInput(fieldConfig)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FilterPanel;
