"use client";

import {ChemicalSearchInput} from "@/components/chemical-search-input";
import type {SimplifiedChemical} from "@/lib/types/chemical";
import {Chemical} from "@/lib/types";

interface ChemicalSearchProps {
    onSelect: (chemical: SimplifiedChemical) => void,
    chemicals?: Chemical[]
}

export function ChemicalSearch({onSelect, chemicals}: ChemicalSearchProps) {
    return (
        <ChemicalSearchInput
            action={onSelect}
            placeholder="Search chemicals..."
        />
    );
}
