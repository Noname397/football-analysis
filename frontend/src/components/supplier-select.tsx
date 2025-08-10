"use client";

import { useSuppliers } from "@/lib/queries/useSupplier";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Optional for loading state

interface SupplierSelectProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function SupplierSelect({
  selectedId,
  onSelect,
  label = "Select Supplier",
  disabled = false,
  placeholder = "Choose a supplier...",
}: SupplierSelectProps) {
  const { data: suppliers = [], isLoading, error } = useSuppliers();

  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      {isLoading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <Select
          value={selectedId}
          onValueChange={onSelect}
          disabled={disabled || isLoading || !!error}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.uuid} value={supplier.uuid}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
