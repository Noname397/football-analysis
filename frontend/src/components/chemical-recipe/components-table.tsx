"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Component {
  chemicalId: string
  ratio: number
}

interface ComponentsTableProps {
  components: Component[]
  totalRatio: number
  getChemicalName: (id: string) => string
  onRemove: (chemicalId: string) => void
}

export function ComponentsTable({ components, totalRatio, getChemicalName, onRemove }: ComponentsTableProps) {
  if (components.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No components added yet.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium text-muted-foreground">Component</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Ratio (%)</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {components.map((component) => (
            <tr key={component.chemicalId} className="bg-card">
              <td className="p-3">{getChemicalName(component.chemicalId)}</td>
              <td className="p-3">{component.ratio}%</td>
              <td className="p-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(component.chemicalId)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
          <tr className="bg-muted/20 font-medium">
            <td className="p-3">Total</td>
            <td className="p-3" colSpan={2}>
              <span className={totalRatio === 100 ? "text-green-600" : "text-amber-600"}>{totalRatio}%</span>
              {totalRatio !== 100 && <span className="ml-2 text-sm text-amber-600">(Must equal 100%)</span>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
