"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import type {
  ChemicalInstance,
} from "@/lib/types/chemical-instance";
import { convertToPrinterLabel } from "@/lib/types/chemical-instance";
import { useLabelPreview, usePrintLabel } from "@/lib/queries/instanceQueries";
import { toast } from "sonner";

interface PreviewLabelButtonProps {
  instance: ChemicalInstance;
  disabled?: boolean;
}

export function PreviewLabelButton({
  instance,
  disabled = false,
}: PreviewLabelButtonProps) {
  const [open, setOpen] = useState(false);
  const [primaryInstance, setPrimaryInstance] =
    useState<ChemicalInstance | null>(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  function findRootInstance(current: ChemicalInstance): ChemicalInstance {
    if (!current.parent) {
      return current;
    }
    return findRootInstance(current.parent as ChemicalInstance);
  }

  // Use the same logic as the page to find primary instance
  useEffect(() => {
    if (!instance) {
      setPrimaryInstance(null);
      return;
    }

    const rootInstance = findRootInstance(instance);

    if (rootInstance && rootInstance.uuid !== instance.uuid) {
      setPrimaryInstance(rootInstance);
    } else {
      setPrimaryInstance(null);
    }
  }, [instance]);

  // Only fetch when dialog is open
  const {
    data: labelImage,
    isLoading: isLoadingLabel,
    error,
  } = useLabelPreview(open ? instance : null, primaryInstance);

  const labelData = instance
    ? convertToPrinterLabel(instance, primaryInstance)
    : null;

  const {
    data: printStatus,
    isLoading: isPrinting,
    error: printError,
  } = usePrintLabel(shouldPrint ? labelData : null);

  useEffect(() => {
    if (shouldPrint && printStatus) {
      toast.success("Label sent to printer successfully");
      setShouldPrint(false);
    }
    if (shouldPrint && printError) {
      toast.error("Print failed", {
        description:
          printError instanceof Error ? printError.message : "Unknown error",
      });
      setShouldPrint(false);
    }
  }, [shouldPrint, printStatus, printError]);

  function handlePrint() {
    if (!labelImage) {
      toast.error("Label preview not ready");
      return;
    }
    
    setShouldPrint(true);
  }

  const { recipe } = instance;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          Print
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Print Label Preview</DialogTitle>
        </DialogHeader>

        {/* instance snapshot */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chemical Name:</span>
            <span className="font-medium">
              {`${recipe.chemical?.name} (${recipe.chemical?.formula})`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipe Title:</span>
            <span className="font-medium">{recipe.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Manufacturer Lot:</span>
            <span className="font-medium">
              {instance.lotNumber || "N/A"} (
              {instance.supplier?.name || "Unknown"})
            </span>
          </div>
          {primaryInstance && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary ID:</span>
              <span className="font-medium">{primaryInstance.id}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Label:</span>
            <span className="font-medium">{instance.label}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* label preview */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Label Preview</label>
            <div className="flex min-h-[300px] w-full items-center justify-center rounded-md border bg-gray-50 p-4">
              {isLoadingLabel ? (
                <div className="text-center text-gray-500">
                  <div className="mx-auto mb-2 flex h-32 w-48 items-center justify-center rounded-md bg-gray-200">
                    <span className="text-sm">Loading...</span>
                  </div>
                  <p className="text-sm">Generating label preview...</p>
                </div>
              ) : error ? (
                <div className="text-center text-gray-500">
                  <div className="mx-auto mb-2 flex h-32 w-48 items-center justify-center rounded-md bg-gray-200">
                    <span className="text-sm">Error</span>
                  </div>
                  <p className="text-sm">Failed to generate label preview</p>
                </div>
              ) : labelImage ? (
                <img
                  src={`data:image/png;base64,${labelImage}`}
                  alt="Label Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2"
            disabled={isLoadingLabel || !labelImage}
          >
            <Printer className="h-4 w-4" />
            Print Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
