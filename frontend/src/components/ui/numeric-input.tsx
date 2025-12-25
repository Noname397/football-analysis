import { useEffect, useState } from "react";
import { Input } from "./input";
import { formatNumericValue } from "../../lib/utils";

export interface FloatingInput {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  type?: "integer" | "float";
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string | undefined;
  units?: string | undefined;
}

export function NumericInput({
  value,
  onChange,
  placeholder,
  className,
  type = "float",
  min,
  max,
  step = 0.01,
  disabled = false,
  id = undefined,
  units = "",
}: FloatingInput) {
  if (min !== undefined && max !== undefined && min > max) {
    throw new Error("min cannot be greater than max");
  }
  if (step !== undefined && step <= 0) {
    throw new Error("step must be greater than 0. Currently: " + step);
  }
  if (type !== "integer" && type !== "float") {
    throw new Error("type must be either 'integer' or 'float'");
  }
  if (type == "integer" && step !== undefined && step % 1 !== 0) {
    throw new Error("step must be an integer for integer type");
  }

  const [valueWhileTyping, setValueWhileTyping] = useState(
    formatNumericValue(value, type, step)
  );
  function setValue() {
    if (valueWhileTyping === "") {
      onChange(0);
      return;
    }
    let value = 0;

    // Remove any characters which are not digits, decimal points, or negative signs
    const sanitizedValue = valueWhileTyping.replace(/[^0-9.-e]/g, "");

    // Handle scientific notation
    if (sanitizedValue.includes("e")) {
      const parts = sanitizedValue.split("e");
      const base = parseFloat(parts[0]);
      const exponent = parseInt(parts[1]);
      value = base * Math.pow(10, exponent);
    } else {
      value = parseFloat(sanitizedValue);
    }

    if (type === "integer") {
      value = parseInt(valueWhileTyping);
    }
    if (type === "float") {
      value = parseFloat(valueWhileTyping);
    }

    // Check if the value is within the min and max range
    if (min !== undefined && value < min) {
      value = min;
    }
    if (max !== undefined && value > max) {
      value = max;
    }

    // Check if the value is a multiple of the step
    if (step !== undefined && (value - (min || 0)) % step !== 0) {
      value = Math.round((value - (min || 0)) / step) * step + (min || 0);
    }

    setValueWhileTyping(formatNumericValue(value, type, step));
    onChange(value);
  }

  useEffect(() => {
    setValueWhileTyping(formatNumericValue(value, type, step));
  }, [value, type, step]);

  return (
    <div className="flex items-center">
      <Input
        type={"number"}
        value={valueWhileTyping}
        disabled={disabled}
        className={`h-9 ${className} text-sm`}
        placeholder={placeholder}
        onChange={(e) => {
          setValueWhileTyping(e.target.value);
        }}
        onBlur={setValue}
        id={id}
      />
      {units && <p className="ml-2 text-sm text-muted-foreground">{units}</p>}
    </div>
  );
}
