"use client";

import { Filter } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { FiltersSheet } from "../filters";

export const FiltersButton = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const pathname = usePathname();

  // Парсим slug'и категорий из pathname
  // Формат: /categorySlug, /categorySlug/subcategorySlug, /categorySlug/subcategorySlug/typeSlug
  const pathParts = pathname.split("/").filter(Boolean);
  const categorySlug = pathParts[0] || undefined;
  const subCategorySlug = pathParts[1] || undefined;
  const typeSlug = pathParts[2] || undefined;

  return (
    <>
      <Button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label="Открыть фильтры"
      >
        <Filter size={20} />
      </Button>
      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        typeSlug={typeSlug}
      />
    </>
  );
};
