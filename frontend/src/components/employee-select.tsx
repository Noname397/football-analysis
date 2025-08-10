"use client";

import { useEmployees } from "@/lib/queries/useEmployee";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"; // Optional for loading state

interface EmployeeSelectProps {
  selectedId?: string;
  onSelect: (id: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function EmployeeSelect({
  selectedId,
  onSelect,
  disabled = false,
  placeholder = "Choose an employee...",
}: EmployeeSelectProps) {
  const { data: employees = [], isLoading, error } = useEmployees();

  return (
    <div className="space-y-1">

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
            {employees.map((employee) => (
              <SelectItem key={employee.uuid} value={employee.uuid}>
                {employee.firstName} {employee.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
