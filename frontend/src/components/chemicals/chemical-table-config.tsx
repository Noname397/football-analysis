import { TableConfig } from "@/components/ui/paginated-table";

// Example interface for a Chemical (you would replace this with your actual Chemical type)
interface Chemical {
  id: number;
  name: string;
  formula: string;
  category: string;
  hazardLevel: string;
  supplier: string;
  createdAt: string;
}

export function createChemicalTableConfig(): TableConfig<Chemical> {
  return {
    columns: [
      {
        key: 'chemical',
        header: 'Chemical',
        width: 'w-[40%]',
        render: (chemical) => (
          <div>
            <div className="font-medium">{chemical.name}</div>
            <div className="text-sm text-muted-foreground">
              {chemical.formula}
            </div>
          </div>
        )
      },
      {
        key: 'category',
        header: 'Category',
        sortable: true,
        render: (chemical) => chemical.category
      },
      {
        key: 'hazard',
        header: 'Hazard Level',
        sortable: true,
        render: (chemical) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            chemical.hazardLevel === 'High' ? 'bg-red-100 text-red-800' :
            chemical.hazardLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {chemical.hazardLevel}
          </span>
        )
      },
      {
        key: 'supplier',
        header: 'Supplier',
        sortable: true,
        render: (chemical) => chemical.supplier
      },
      {
        key: 'created',
        header: 'Added',
        sortable: true,
        render: (chemical) => new Date(chemical.createdAt).toLocaleDateString()
      }
    ],
    emptyMessage: 'No chemicals found',
    sortable: true
  };
}
