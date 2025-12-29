"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import * as React from "react";

import { Button } from "@/app/(feed)/(search)/_lib/ui/button";
import { Input } from "@/app/(feed)/(search)/_lib/ui/input";
import { Select } from "@/app/(feed)/(search)/_lib/ui/select";
import { Typography } from "@/app/(feed)/(search)/_lib/ui/typography";
import { Sheet } from "@/components/ui";

import styles from "./filters-sheet.module.css";

interface FiltersSheetProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface FiltersState {
  maxPrice: number | null;
  minPrice: number | null;
  sortBy: string | null;
  state: string | null;
}

export const FiltersSheet = ({
  open,
  onOpenChange,
  children,
}: FiltersSheetProps) => {
  const [urlFilters, setUrlFilters] = useQueryStates(
    {
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      state: parseAsString,
      sortBy: parseAsString,
    },
    {
      history: "push",
      shallow: false,
    },
  );

  // Локальное состояние для фильтров
  const [localFilters, setLocalFilters] = React.useState<FiltersState>({
    minPrice: urlFilters.minPrice,
    maxPrice: urlFilters.maxPrice,
    state: urlFilters.state,
    sortBy: urlFilters.sortBy,
  });

  // Синхронизация локального состояния с URL при открытии
  React.useEffect(() => {
    if (open) {
      setLocalFilters({
        minPrice: urlFilters.minPrice,
        maxPrice: urlFilters.maxPrice,
        state: urlFilters.state,
        sortBy: urlFilters.sortBy,
      });
    }
  }, [open, urlFilters]);

  const handlePriceChange = (field: "maxPrice" | "minPrice", value: string) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setLocalFilters((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleApply = () => {
    setUrlFilters(localFilters);
    onOpenChange?.(false);
  };

  const handleReset = () => {
    const resetState = {
      minPrice: null,
      maxPrice: null,
      state: null,
      sortBy: null,
    };
    setLocalFilters(resetState);
    setUrlFilters(resetState);
    onOpenChange?.(false);
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Фильтры</Sheet.Title>
          <Sheet.Description>
            Настройте параметры поиска товаров
          </Sheet.Description>
        </Sheet.Header>

        <div className={styles.content}>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>Цена</Typography>
              <div className={styles.priceInputs}>
                <div className={styles.priceField}>
                  <Input
                    className={styles.priceInput}
                    type="number"
                    value={localFilters.minPrice ?? ""}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    placeholder="От"
                  />
                </div>

                <span className={styles.priceSeparator}>—</span>

                <div className={styles.priceField}>
                  <Input
                    className={styles.priceInput}
                    type="number"
                    value={localFilters.maxPrice ?? ""}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    placeholder="До"
                  />
                </div>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>Состояние</Typography>
              <Select
                value={localFilters.state ?? ""}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, state: value }))
                }
              >
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value placeholder="Все" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="new">Новый</Select.Item>
                  <Select.Item value="used">Б/У</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>
                Сортировать по
              </Typography>
              <Select
                value={localFilters.sortBy ?? ""}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value placeholder="Не выбрано" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="relevance">По релевантности</Select.Item>
                  <Select.Item value="price-desc">Сначала дорогие</Select.Item>
                  <Select.Item value="price-asc">Сначала дешёвые</Select.Item>
                  <Select.Item value="newest">По новизне</Select.Item>
                </Select.Content>
              </Select>
            </div>

            {children && (
              <div className={styles.additionalFilters}>{children}</div>
            )}
          </div>
        </div>

        <Sheet.Footer>
          <div className={styles.footerButtons}>
            <Button
              className={styles.resetButton}
              variant="destructive"
              onClick={handleReset}
            >
              Сбросить
            </Button>
            <Button className={styles.applyButton} onClick={handleApply}>
              Применить
            </Button>
          </div>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};
