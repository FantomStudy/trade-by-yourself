"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { FiltersSheet } from "../filters";

export const FiltersButton = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label="Открыть фильтры"
      >
        <Filter size={20} />
      </Button>
      <FiltersSheet open={filtersOpen} onOpenChange={setFiltersOpen} />
    </>
  );
};
