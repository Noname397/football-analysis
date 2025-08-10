import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChemicalSearchInput } from "@/components/chemical-search-input";
import { useRouter } from "next/navigation";
import { Chemical } from "@/lib/types/chemical";

interface RecipeHeaderProps {
  selectedChemical: Chemical | null;
  onSelectChemical: (chemical: Chemical) => void;
}

export function RecipeHeader({
  selectedChemical,
  onSelectChemical,
}: RecipeHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <h1 className="mb-2 text-3xl font-bold">Chemical Recipe 📖</h1>
      <p className="text-muted-foreground">
        Select a chemical to view and manage its recipes.
      </p>

      <div className="mb-6 mt-2 flex items-center gap-2">
        <div className="flex-1">
          <ChemicalSearchInput
            action={(chemical) => onSelectChemical(chemical)}
            placeholder="Search for a chemical to view its recipes..."
            clearOnSelect={false}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-10 whitespace-nowrap"
          onClick={() => router.push("/chemicals")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chemical
        </Button>
      </div>
    </div>
  );
}
