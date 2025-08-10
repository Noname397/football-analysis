import { useState } from "react";
import PaginatedTable from "@/components/ui/paginated-table";
import { createChemicalTableConfig } from "@/components/chemicals/chemical-table-config";

// Example usage of PaginatedTable with different data type
export default function ChemicalSelector({
  onChemicalSelect,
}: {
  onChemicalSelect: (chemical: any) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Mock data - replace with real data fetching
  const mockChemicals = [
    {
      id: 1,
      name: "Sodium Chloride",
      formula: "NaCl",
      category: "Salt",
      hazardLevel: "Low",
      supplier: "ChemCorp",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Sulfuric Acid",
      formula: "H2SO4",
      category: "Acid",
      hazardLevel: "High",
      supplier: "AcidSupply Inc",
      createdAt: "2024-02-20"
    },
    // Add more mock data as needed
  ];

  const tableConfig = createChemicalTableConfig();

  return (
    <div>
      {/* You would add a ChemicalFilter component here, similar to ChemicalInstanceFilter */}
      
      <PaginatedTable
        config={tableConfig}
        data={mockChemicals}
        totalCount={mockChemicals.length}
        isLoading={false}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRowClick={onChemicalSelect}
        getItemKey={(chemical) => chemical.id}
        title="Chemicals"
        description="Browse and select chemicals"
      />
    </div>
  );
}
