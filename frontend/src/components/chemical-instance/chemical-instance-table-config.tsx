import { TableConfig } from "@/components/ui/paginated-table";
import { ChemicalInstance } from "@/lib/types/chemical-instance";
import { formatDate } from "@/lib/utils/index";
import { formatChemicalInstanceTitle } from "@/app/instances/helpers";
import { TakeAliquotButton } from "@/components/chemical-instance-take-aliquot-button";
import { PreviewLabelButton } from "@/components/chemical-instance-preview-label-button";


export function createChemicalInstanceTableConfig(
  aliquotsEnabled: boolean = false
): TableConfig<ChemicalInstance> {
  return {
    columns: [
      {
        key: "instance",
        header: "Instance",
        width: "w-[50%]",
        render: (instance) => (
          <div>
            <div className="font-medium">
              {formatChemicalInstanceTitle(instance)}
            </div>
            <div className="text-sm text-muted-foreground">
              {instance.recipe.chemical?.name} (
              {instance.recipe.chemical?.formula})
            </div>
          </div>
        ),
      },
      {
        key: "net-weight",
        header: "Net weight (kg)",
        sortable: true,
        render: (instance) => instance.netWeight.toFixed(3),
      },
      {
        key: "creator",
        header: "Creator",
        sortable: true,
        render: (instance) =>
          `${instance.owner.firstName} ${instance.owner.lastName}`,
      },
      {
        key: "created",
        header: "Created",
        sortable: true,
        render: (instance) => formatDate(instance.manufactureDate),
      },
      {
        key: "print",
        header: "Print",
        width: "w-[80px]",
        render: (instance) => (
          <div onClick={(e) => e.stopPropagation()} className="w-[80px]">
            <PreviewLabelButton instance={instance} />
          </div>
        ),
      },
      {
        key: "aliquot",
        header: "Aliquot",
        width: "w-[80px]",
        conditional: aliquotsEnabled,
        render: (instance) => (
          <div onClick={(e) => e.stopPropagation()} className="w-[80px]">
            <TakeAliquotButton instance={instance} />
          </div>
        ),
      },
    ],
    emptyMessage: "No instances found",
    sortable: true,
  };
}
