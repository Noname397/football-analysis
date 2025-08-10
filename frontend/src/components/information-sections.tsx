"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clipboard, Gauge, Beaker, User, Plus, X, Wrench } from "lucide-react"
import { mockEquipment, mockCreators } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import type { Equipment } from "@/lib/types"

interface InformationSectionsProps {
  setEquipmentDialogOpen: (open: boolean) => void
  setCreatorDialogOpen: (open: boolean) => void
}

export function InformationSections({ setEquipmentDialogOpen, setCreatorDialogOpen }: InformationSectionsProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([])

  const handleEquipmentChange = (equipmentId: string) => {
    if (!equipmentId) return

    const equipment = mockEquipment.find((e) => e.id === equipmentId)
    if (equipment && !selectedEquipment.some((e) => e.id === equipment.id)) {
      setSelectedEquipment([...selectedEquipment, equipment])
    }
  }

  const handleRemoveEquipment = (id: string) => {
    setSelectedEquipment(selectedEquipment.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6 gap-y-8 flex flex-col">
      <h3 className="text-lg font-medium text-gray-700 flex items-center">
        <Clipboard className="h-4 w-4 mr-2 text-primary" />
        Process Information
      </h3>

      <div className="space-y-4 mb-12">
        <h4 className="text-base font-medium flex items-center">
          <Gauge className="h-4 w-4 mr-2 text-primary" />
          Process Metrics & Equipment
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="equipment-used" className="font-medium">
              Equipment Used
            </Label>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleEquipmentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {mockEquipment.map((equipment) => (
                    <SelectItem
                      key={equipment.id}
                      value={equipment.id}
                      disabled={selectedEquipment.some((e) => e.id === equipment.id)}
                      className="cursor-pointer hover:bg-primary-light"
                    >
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-primary" />
                        <span>{equipment.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEquipmentDialogOpen(true)}
                className="hover:bg-primary-light"
              >
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </div>

            {selectedEquipment.length > 0 && (
              <div className="mt-3">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-md">
                  <h6 className="text-sm font-medium mb-2 text-gray-700">Selected Equipment:</h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedEquipment.map((equipment) => (
                      <Badge
                        key={equipment.id}
                        variant="outline"
                        className="flex items-center gap-1 py-1 px-3 bg-white border-gray-200 shadow-sm"
                      >
                        <Wrench className="h-3 w-3 text-primary" />
                        <span>{equipment.name}</span>
                        <button
                          onClick={() => handleRemoveEquipment(equipment.id)}
                          className="ml-1 rounded-full hover:bg-primary-light p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-timestamp" className="font-medium">
              Process Timestamp
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="process-timestamp"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const input = document.getElementById("process-timestamp") as HTMLInputElement
                  if (input) {
                    input.value = now.toISOString().slice(0, 16)
                  }
                }}
                className="hover:bg-primary-light"
              >
                Now
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-temperature" className="font-medium">
              Process Temperature (°C)
            </Label>
            <Input id="process-temperature" type="number" placeholder="Enter process temperature" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="process-pressure" className="font-medium">
              Process Pressure (kPa)
            </Label>
            <Input id="process-pressure" type="number" placeholder="Enter process pressure" />
          </div>
        </div>
      </div>

      {/* Product Properties */}
      <div className="space-y-4 mb-12">
        <h4 className="text-base font-medium flex items-center">
          <Beaker className="h-4 w-4 mr-2 text-primary" />
          Product Properties
        </h4>

        {/* Extensive Properties */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h5 className="text-base font-medium">Extensive Properties</h5>
            <span className="text-xs text-muted-foreground">
              (properties that depend on quantity, e.g., mass, volume)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-mass" className="font-medium">
                Mass (g)
              </Label>
              <Input id="product-mass" type="number" placeholder="Enter product mass" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-volume" className="font-medium">
                Volume (mL)
              </Label>
              <Input id="product-volume" type="number" placeholder="Enter product volume" />
            </div>
          </div>
        </div>

        {/* Intensive Properties */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h5 className="text-base font-medium">Intensive Properties</h5>
            <span className="text-xs text-muted-foreground">
              (properties that don't depend on quantity, e.g., color, concentration)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-color" className="font-medium">
                Color
              </Label>
              <Input id="product-color" placeholder="Enter product color" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-concentration" className="font-medium">
                Concentration (%)
              </Label>
              <Input id="product-concentration" type="number" placeholder="Enter concentration" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-ph" className="font-medium">
                pH
              </Label>
              <Input id="product-ph" type="number" step="0.1" placeholder="Enter pH value" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-viscosity" className="font-medium">
                Viscosity (cP)
              </Label>
              <Input id="product-viscosity" type="number" placeholder="Enter viscosity" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h4 className="text-base font-medium flex items-center">
          <User className="h-4 w-4 mr-2 text-primary" />
          Creator Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="creator-name" className="font-medium">
              Creator
            </Label>
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select creator" />
                </SelectTrigger>
                <SelectContent>
                  {mockCreators.map((creator) => (
                    <SelectItem key={creator.id} value={creator.id} className="cursor-pointer hover:bg-primary-light">
                      {creator.name} - {creator.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreatorDialogOpen(true)}
                className="hover:bg-primary-light"
              >
                <Plus className="h-4 w-4 mr-1" /> New
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <h4 className="text-base font-medium flex items-center">
          <Clipboard className="h-4 w-4 mr-2 text-primary" />
          Notes
        </h4>
        <div className="space-y-2 w-full">
          <Textarea
            id="creator-notes"
            placeholder="Enter any additional notes about this process or product"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  )
}
