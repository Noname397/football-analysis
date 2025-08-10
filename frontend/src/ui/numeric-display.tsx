import React from "react";
import { formatNumericValue } from "@/lib/utils";
import { DEFAULT_STEP_PRECISION, DEFAULT_UNITS } from "@/lib/constants/numeric";

export interface NumericDisplayProps {
  value: number;
  type?: "integer" | "float";
  step?: number;
  units?: string;
  className?: string;
}

export function NumericDisplay({
  value,
  type = "float",
  step = DEFAULT_STEP_PRECISION,
  units = DEFAULT_UNITS,
  className = "",
}: NumericDisplayProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-sm font-medium">
        {formatNumericValue(value, type, step)}
      </span>
      {units && (
        <span className="ml-2 text-sm text-muted-foreground">{units}</span>
      )}
    </div>
  );
}
