"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Chemical } from "@/lib/types/chemical";

export function useChemicalSuccessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [chemical, setChemical] = useState<Chemical | null>(null);

  const openModal = (newChemical: Chemical) => {
    setChemical(newChemical);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEdit = (chemicalId: string) => {
    toast.info("Edit chemical action triggered", {
      description: `Editing chemical with ID: ${chemicalId}`,
    });
    closeModal();
  };

  const handleClone = (chemical: Chemical) => {
    toast.info("Clone chemical action triggered", {
      description: `Cloning chemical: ${chemical.name}`,
    });
    closeModal();
  };

  const handleCreateRecipe = (chemicalId: string) => {
    toast.info("Create recipe action triggered", {
      description: `Creating recipe from chemical with ID: ${chemicalId}`,
    });
    closeModal();
  };

  return {
    isOpen,
    chemical,
    openModal,
    closeModal,
    handleEdit,
    handleClone,
    handleCreateRecipe,
  };
}
