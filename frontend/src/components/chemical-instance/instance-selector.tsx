import { useState, useEffect, useMemo, useCallback } from "react";
import { FilterPanel } from "@/components/ui/filter-panel";
import { createChemicalInstanceFilterConfig } from "@/components/chemical-instance/chemical-instance-filter-config";
import { ChemicalInstance } from "@/lib/types/chemical-instance";
import { Chemical } from "@/lib/types/chemical";
import { Recipe } from "@/lib/types/recipe";
import { Employee } from "@/lib/types/employee";
import { useChemicalInstances } from "@/lib/queries/instanceQueries";
import { useChemicalInstancesCount } from "@/lib/queries/instanceQueries";
import { useEmployees } from "@/lib/queries/useEmployee";
import PaginatedTable from "@/components/ui/paginated-table";
import { createChemicalInstanceTableConfig } from "@/components/chemical-instance/chemical-instance-table-config";
import { formatChemicalInstanceTitle } from "@/app/instances/helpers";

export const unstable_noStore = true;

export interface InstanceSelectorProps {
  setSelectedInstance: (instanceUUID: ChemicalInstance) => void;
  searchQuery?: string;
  startingFilters?: Record<string, any>;
  aliquotsEnabled?: boolean;
}

export default function InstanceSelector({
  setSelectedInstance,
  searchQuery = "",
  startingFilters = {},
  aliquotsEnabled = false,
}: InstanceSelectorProps) {
  // State for filtering and pagination
  const [_searchQuery, _setSearchQuery] = useState(searchQuery);
  const [filters, setFilters] = useState<Record<string, any>>(startingFilters);
  const [sortBy, setSortBy] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for tracking selected items for filter display
  const [selectedChemicals, setSelectedChemicals] = useState<Chemical[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  // Create filter configuration with handlers
  const filterConfig = useMemo(() => createChemicalInstanceFilterConfig(
    selectedChemicals,
    (chemical: Chemical) => {
      if (!selectedChemicals.some((c) => c.uuid === chemical.uuid)) {
        setSelectedChemicals([...selectedChemicals, chemical]);
      }
    },
    (recipe: Recipe) => {
      if (!selectedRecipes.some((r) => r.uuid === recipe.uuid)) {
        setSelectedRecipes([...selectedRecipes, recipe]);
      }
    },
    (employeeId: string) => {
      // Employee selection is handled directly in the filter
    }
  ), [selectedChemicals, selectedRecipes]);
  
  // Create table configuration
  const tableConfig = useMemo(() => createChemicalInstanceTableConfig(aliquotsEnabled), [aliquotsEnabled]);

  // Convert filters to API format
  const apiFilters = useMemo(() => {
    const converted: Record<string, any> = {};
    
    // Map UI filters to API expected format
    if (filters.recipe) {
      converted.recipe_uuid = filters.recipe;
    }
    if (filters.chemical) {
      converted.chemical_uuid = filters.chemical;
    }
    if (filters.owner) {
      converted.employee_uuid = filters.owner;
    }
    if (filters.isActive !== undefined) {
      converted.is_active = filters.isActive === 'true';
    }
    if (filters.manufactureDate) {
      converted.date_range = filters.manufactureDate;
    }
    if (_searchQuery) {
      converted.search = _searchQuery;
    }
    
    return converted;
  }, [filters, _searchQuery]);

  // Fetch data
  const {
    data: chemicalInstancesCount,
    isLoading: isLoadingChemicalInstancesCount,
    isError: isErrorChemicalInstancesCount,
  } = useChemicalInstancesCount(apiFilters);
  
  const {
    data: chemicalInstances = [],
    isLoading: isLoadingChemicalInstances,
    isError: isErrorChemicalInstances,
  } = useChemicalInstances({
    page: page,
    pageSize: pageSize,
    filters: apiFilters,
  });

  // Handle callbacks
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowClick = useCallback((instance: ChemicalInstance) => {
    setSelectedInstance(instance);
  }, [setSelectedInstance]);

  return (

    <div>

      <FilterPanel
        data={chemicalInstances}
        searchQuery={_searchQuery}
        onSearchChange={_setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        config={filterConfig}
        searchPlaceholder="Search instances..."
      />

      <PaginatedTable
        config={tableConfig}
        data={chemicalInstances}
        totalCount={chemicalInstancesCount?.count || 0}
        isLoading={isLoadingChemicalInstances}
        isLoadingCount={isLoadingChemicalInstancesCount}
        isError={isErrorChemicalInstances}
        isErrorCount={isErrorChemicalInstancesCount}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        getItemKey={(instance) => instance.id || instance.uuid || `instance-${Math.random()}`}
      />

    </div>
  );
}
