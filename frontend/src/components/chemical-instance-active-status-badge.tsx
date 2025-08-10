import { Badge } from "@/components/ui/badge";

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      className={`px-3 py-1.5 text-sm font-medium ${
        active
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-gray-300 bg-gray-200 text-gray-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}
