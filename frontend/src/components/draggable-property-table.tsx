"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import { ChemicalProperty } from "@/lib/types/chemical";
import { v4 as uuidv4 } from "uuid";

interface DraggablePropertyTableProps {
  properties: ChemicalProperty[];
  setProperties: (properties: ChemicalProperty[]) => void;
  onRemove: (id: string) => void;
}

function SortablePropertyRow({
  property,
  onRemove,
  onEdit,
}: {
  property: ChemicalProperty;
  onRemove: (id: string) => void;
  onEdit: (id: string, name: string, unit: string, value: string) => void;
}) {
  const [name, setName] = useState(property.name);
  const [unit, setUnit] = useState(property.unit);
  const [value, setValue] = useState(property.value);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: property.id || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (
      name.trim() &&
      property.id &&
      (name !== property.name ||
        unit !== property.unit ||
        value !== property.value)
    ) {
      onEdit(property.id, name, unit, value);
    }
  }, [
    name,
    unit,
    value,
    property.id,
    property.name,
    property.unit,
    property.value,
    onEdit,
  ]);

  return (
    <tr ref={setNodeRef} style={style} className="bg-card">
      <td className="w-10 p-3">
        <div
          {...attributes}
          {...listeners}
          className="flex cursor-grab justify-center active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </div>
      </td>
      <td className="p-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8"
          placeholder="Property name"
        />
      </td>
      <td className="p-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-8"
          placeholder="Value"
          type="number"
        />
      </td>
      <td className="p-3">
        <Input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="h-8"
          placeholder="Unit (e.g., kg, °C)"
        />
      </td>
      <td className="p-3 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => property.id && onRemove(property.id)}
          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

function DraggablePropertyTableContent({
  properties,
  setProperties,
  onRemove,
}: DraggablePropertyTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = properties.findIndex((prop) => prop.id === active.id);
      const newIndex = properties.findIndex((prop) => prop.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setProperties(arrayMove(properties, oldIndex, newIndex));
      }
    }
  };

  const handleEdit = (
    id: string,
    name: string,
    unit: string,
    value: string
  ) => {
    setProperties(
      properties.map((prop) =>
        prop.id === id ? { ...prop, name, unit, value } : prop
      )
    );
  };

  const addNewRow = () => {
    const newId = uuidv4();
    setProperties([
      ...properties,
      {
        id: newId,
        name: "",
        value: "0",
        unit: "",
      },
    ]);
  };

  return (
    <div className="overflow-hidden rounded-md border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-10"></th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Property Name
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Value
              </th>
              <th className="p-3 text-left font-medium text-muted-foreground">
                Unit
              </th>
              <th className="p-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <SortableContext
              items={properties.map((p) => p.id || "")}
              strategy={verticalListSortingStrategy}
            >
              {properties.map((property) => (
                <SortablePropertyRow
                  key={property.id}
                  property={property}
                  onRemove={onRemove}
                  onEdit={handleEdit}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
      <Button
        onClick={addNewRow}
        className="w-full rounded-none bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Row
      </Button>
    </div>
  );
}

export function DraggablePropertyTable(props: DraggablePropertyTableProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <DraggablePropertyTableContent {...props} />;
}
