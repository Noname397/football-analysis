import { formatChemicalInstanceTitle } from "@/app/instances/helpers";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ChemicalInstance } from "@/lib/types/chemical-instance";

interface AliquotDetailsProps {
  instance: ChemicalInstance;
  instanceIdentifier: string;
}

export function AliquotDetails({
  instance,
  instanceIdentifier,
}: AliquotDetailsProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {instanceIdentifier} Instance:
          </span>
          <a
            href={`/instances/${instance.id}`}
            className="font-medium text-primary hover:underline"
          >
            {formatChemicalInstanceTitle(instance)}
          </a>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {instanceIdentifier} Manufacture Date:
          </span>
          <span className="flex items-center font-medium">
            <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            {formatDate(instance.manufactureDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {instanceIdentifier} Owner:
          </span>
          <span className="font-medium">
            {instance.owner.firstName} {instance.owner.lastName}
          </span>
        </div>
      </div>
    </div>
  );
}
