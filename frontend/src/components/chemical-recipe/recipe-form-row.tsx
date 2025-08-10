import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface FormRowProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function FormRow({ label, required, children }: FormRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
