import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nullDateValue = new Date("0001-01-01T00:00:00+00:00");

export const isNullDate = (date: Date | string): boolean => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.getTime() === nullDateValue.getTime();
};

export const isValidDate = (date: Date | string): boolean => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return !isNaN(date.getTime());
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    return "Invalid Date";
  }
  if (isNullDate(date)) {
    return "Unknown Date";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function formatNumericValue(
  value: number,
  type: "integer" | "float" = "float",
  step: number = 0.01
): string {
  if (type === "integer") {
    return Math.round(value).toString();
  } else if (type === "float") {
    // Calculate precision based on step value
    const precision = step ? Math.max(0, Math.round(Math.log10(1 / step))) : 2;

    // Format the number with proper precision
    const fixed = value.toFixed(precision);

    // Remove trailing zeros after decimal point, but keep at least one digit if there's a decimal point
    return fixed.includes(".") ? fixed.replace(/(\.?0)0*$/, "$1") : fixed;
  }
  return value.toString();
}

export function noop() {
  // No operation function, does nothing
  return;
}
