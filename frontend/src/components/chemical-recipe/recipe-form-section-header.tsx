import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface FormHeaderProps {
  onCancel: () => void;
  onSave: () => void;
}

export function FormHeader({ onCancel, onSave }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium text-black">Edit Recipe</h3>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-green-500 hover:bg-green-50 hover:text-green-600"
          onClick={onSave}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
