import InstanceSelector, {
  InstanceSelectorProps,
} from "@/components/chemical-instance/instance-selector";
import { Copy, Edit, FileIcon as FileSparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputComponent } from "@/lib/types/recipe";
import { useMemo } from "react";

interface InstanceModalProps extends InstanceSelectorProps {
  isOpen: boolean;
  startingChemicalFilters?: string[];
  startingCreatorFilters?: string[];
  startingRecipeFilters?: string[];
  startingDateFilters?: string[];
  onOpenChange: (open: boolean) => void;
}

export default function InstanceModal({
  setSelectedInstance,
  isOpen,
  onOpenChange,
  searchQuery = "",
  startingChemicalFilters = [],
  startingCreatorFilters = [],
  startingRecipeFilters = [],
  startingDateFilters = [],
  aliquotsEnabled = false,
}: InstanceModalProps) {
  const title = "Select a Chemical Instance";

  // Convert the specific filter arrays into the startingFilters format expected by InstanceSelector
  const startingFilters = useMemo(() => {
    const filters: Record<string, any> = {};

    if (startingChemicalFilters.length > 0) {
      // Assuming we want to use the first chemical filter
      filters.chemical = startingChemicalFilters[0];
    }

    if (startingRecipeFilters.length > 0) {
      // Assuming we want to use the first recipe filter
      filters.recipe = startingRecipeFilters[0];
    }

    if (startingCreatorFilters.length > 0) {
      filters.owner = startingCreatorFilters[0];
    }

    if (startingDateFilters.length > 0) {
      filters.manufactureDate = startingDateFilters[0];
    }

    return filters;
  }, [
    startingChemicalFilters,
    startingCreatorFilters,
    startingRecipeFilters,
    startingDateFilters,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <InstanceSelector
            setSelectedInstance={setSelectedInstance}
            searchQuery={searchQuery}
            startingFilters={startingFilters}
            aliquotsEnabled={aliquotsEnabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
