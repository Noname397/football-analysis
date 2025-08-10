import { useState } from "react";
import { ChemicalProperty } from "@/lib/types/chemical";

export function useChemicalForm() {
  // Basic chemical information
  const [chemicalName, setChemicalName] = useState("");
  const [chemicalFormula, setChemicalFormula] = useState("");
  const [description, setDescription] = useState("");
  const [stateOfMatter, setStateOfMatter] = useState<
    "solid" | "liquid" | "gas"
  >("solid");
  const [density, setDensity] = useState(0);
  const [molecularWeight, setMolecularWeight] = useState(0);

  // Safety information
  const [casNumber, setCasNumber] = useState("");
  const [primaryHazardClass, setPrimaryHazardClass] = useState("");
  const [secondaryHazardClass, setSecondaryHazardClass] = useState("");
  const [safetyNotes, setSafetyNotes] = useState("");

  const resetForm = () => {
    setChemicalName("");
    setChemicalFormula("");
    setDescription("");
    setStateOfMatter("solid");
    setCasNumber("");
    setPrimaryHazardClass("");
    setSecondaryHazardClass("");
    setSafetyNotes("");
  };

  return {
    // Basic information
    chemicalName,
    setChemicalName,
    chemicalFormula,
    setChemicalFormula,
    description,
    setDescription,
    stateOfMatter,
    setStateOfMatter,
    density,
    setDensity,
    molecularWeight,
    setMolecularWeight,

    // Safety information
    casNumber,
    setCasNumber,
    primaryHazardClass,
    setPrimaryHazardClass,
    secondaryHazardClass,
    setSecondaryHazardClass,
    safetyNotes,
    setSafetyNotes,

    // Form reset
    resetForm,
  };
}
