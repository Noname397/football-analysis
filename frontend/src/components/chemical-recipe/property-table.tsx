"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"

interface Property {
  id: string
  name: string
  unit: string
  required: boolean
}

interface PropertyTableProps {
  properties: Property[]
  onToggleRequired: (id: string) => void
  onRemove: (id: string) => void
}

export function PropertyTable({ properties, onToggleRequired, onRemove }: PropertyTableProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No properties added yet.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium text-muted-foreground">Property Name</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Unit</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Required</th>
            <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((property) => (
            <tr key={property.id} className="bg-card">
              <td className="p-3">{property.name}</td>
              <td className="p-3">{property.unit}</td>
              <td className="p-3">
                <Switch checked={property.required} onCheckedChange={() => onToggleRequired(property.id)} />
              </td>
              <td className="p-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(property.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
