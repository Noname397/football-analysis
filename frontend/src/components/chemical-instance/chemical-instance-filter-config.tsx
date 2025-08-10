import { FilterConfig } from "@/components/ui/filter-panel";
import { ChemicalInstance } from "@/lib/types/chemical-instance";
import { EmployeeSelect } from "@/components/employee-select";
import { ChemicalSearchInput } from "@/components/chemical-search-input";
import { RecipeSearchInput } from "@/components/recipe-search-input";
import { DateRangePicker } from "@/components/date-range-picker";
import { Chemical } from "@/lib/types/chemical";
import { Recipe } from "@/lib/types/recipe";

export function createChemicalInstanceFilterConfig(
  selectedChemicals: Chemical[] = [],
  onAddChemical: (chemical: Chemical) => void,
  onAddRecipe: (recipe: Recipe) => void,
  onSelectEmployee: (employeeId: string) => void
): FilterConfig<ChemicalInstance> {
  return {
    searchFields: ['label', 'lotNumber', 'notes'],
    
    filterFields: [
      {
        // Use a custom key for chemical filtering since it's nested in recipe
        key: 'chemical' as any,
        label: 'Chemical',
        type: 'reference',
        referenceConfig: {
          displayField: 'name',
          valueField: 'uuid'
        },
        renderFilter: (value, onChange) => (
          <ChemicalSearchInput
            action={(chemical) => {
              onAddChemical(chemical);
              onChange(chemical.uuid);
            }}
            placeholder="Search chemicals..."
          />
        )
      },
      {
        key: 'recipe' as keyof ChemicalInstance,
        label: 'Recipe',
        type: 'reference',
        referenceConfig: {
          displayField: 'name',
          valueField: 'uuid',
        },
        renderFilter: (value, onChange) => (
          <RecipeSearchInput
            action={(recipe) => {
              onAddRecipe(recipe);
              onChange(recipe.uuid);
            }}
            placeholder="Search recipes..."
            chemicalId={selectedChemicals.length > 0 ? selectedChemicals[0]?.uuid : undefined}
          />
        )
      },
      {
        key: 'manufactureDate' as keyof ChemicalInstance,
        label: 'Date Range',
        type: 'daterange',
        renderFilter: (value, onChange) => (
          <DateRangePicker
            dateRange={value}
            onDateRangeChange={onChange}
          />
        )
      },
      {
        key: 'owner' as keyof ChemicalInstance,
        label: 'Employee',
        type: 'reference',
        referenceConfig: {
          displayField: 'firstName',
          valueField: 'uuid'
        },
        renderFilter: (value, onChange) => (
          <EmployeeSelect
            onSelect={(employeeId) => {
              onSelectEmployee(employeeId);
              onChange(employeeId);
            }}
            selectedId={value}
          />
        )
      },
      {
        key: 'isActive' as keyof ChemicalInstance,
        label: 'Status',
        type: 'select',
        options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]
      }
    ],
    
    sortOptions: [
      { value: 'name-asc', label: 'Name (A-Z)', field: 'label', direction: 'asc' },
      { value: 'name-desc', label: 'Name (Z-A)', field: 'label', direction: 'desc' },
      { value: 'date-asc', label: 'Date (Oldest)', field: 'manufactureDate', direction: 'asc' },
      { value: 'date-desc', label: 'Date (Newest)', field: 'manufactureDate', direction: 'desc' },
      { value: 'amount-asc', label: 'Amount (Low-High)', field: 'amount', direction: 'asc' },
      { value: 'amount-desc', label: 'Amount (High-Low)', field: 'amount', direction: 'desc' }
    ]
  };
}
