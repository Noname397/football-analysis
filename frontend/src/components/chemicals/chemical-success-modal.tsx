"use client";

import { SuccessModal } from "@/components/ui/success-modal";
import { Edit, Copy, FileIcon as FileSparkles } from "lucide-react";
import type { Chemical } from "@/lib/types/chemical";

interface ChemicalSuccessModalProps {
  chemical: Chemical | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (chemicalId: string) => void;
  onClone: (chemical: Chemical) => void;
  onCreateRecipe: (chemicalId: string) => void;
}

export function ChemicalSuccessModal({
  chemical,
  open,
  onOpenChange,
  onEdit,
  onClone,
  onCreateRecipe,
}: ChemicalSuccessModalProps) {
  if (!chemical) return null;

  const sections = [
    {
      title: "Chemical Information",
      icon: <FileSparkles className="h-4 w-4 text-primary" />,
      content: (
        <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Name</h4>
            <p className="text-lg font-medium">{chemical.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Formula</h4>
            <p className="text-lg font-medium">{chemical.formula}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">CAS Number</h4>
            <p className="text-lg font-medium">{chemical.casNumber}</p>
          </div>

          {chemical.density !== undefined && chemical.density > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Density</h4>
              <p className="text-lg font-medium">{chemical.density} g/cm³</p>
            </div>
          )}

          {chemical.molecularWeight !== undefined &&
            chemical.molecularWeight > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Molecular Weight
                </h4>
                <p className="text-lg font-medium">
                  {chemical.molecularWeight} g/mol
                </p>
              </div>
            )}

          <div>
            <h4 className="text-sm font-medium text-gray-500">
              State of Matter
            </h4>
            <p className="text-lg font-medium">
              {chemical.stateOfMatter || "Not specified"}
            </p>
          </div>

          {chemical.description && (
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p>{chemical.description}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Safety Information",
      icon: <FileSparkles className="h-4 w-4 text-primary" />,
      content: chemical.safetyInfo.safetyNotes ? (
        <div className="grid grid-cols-1 gap-6 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
          {chemical.safetyInfo?.safetyNotes && (
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">
                Safety Notes
              </h4>
              <p className="whitespace-pre-line">
                {chemical.safetyInfo.safetyNotes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-muted-foreground">No safety information found</p>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit Chemical",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => chemical.uuid && onEdit(chemical.uuid),
      variant: "outline" as const,
    },
    {
      label: "Clone Chemical",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => onClone(chemical),
      variant: "outline" as const,
    },
    {
      label: "Create Recipe",
      icon: <FileSparkles className="h-4 w-4" />,
      onClick: () => chemical.uuid && onCreateRecipe(chemical.uuid),
      variant: "default" as const,
    },
  ];

  return (
    <SuccessModal
      title="Chemical Created Successfully ✨"
      subtitle="Review the details of your newly created chemical below"
      data={chemical}
      open={open}
      onOpenChange={onOpenChange}
      sections={sections}
      actions={actions}
    />
  );
}
