"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import * as React from "react";

import { useAvailableFilters } from "@/api/hooks";
import { Sheet, Typography } from "@/components/ui";
import { Button } from "@/components/ui-lab/Button";
import { Input } from "@/components/ui-lab/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-lab/Select";
import styles from "./filters-sheet.module.css";

interface FiltersSheetProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
}

interface FiltersState {
  fieldValues: Record<string, string>;
  maxPrice: number | null;
  maxRating: number | null;
  minPrice: number | null;
  minRating: number | null;
  profileType: string | null;
  region: string | null;
  sortBy: string | null;
  state: string | null;
}

export const FiltersSheet = ({
  open,
  onOpenChange,
  children,
  categorySlug,
  subCategorySlug,
  typeSlug,
}: FiltersSheetProps) => {
  const [urlFilters, setUrlFilters] = useQueryStates(
    {
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      minRating: parseAsInteger,
      maxRating: parseAsInteger,
      state: parseAsString,
      sortBy: parseAsString,
      region: parseAsString,
      profileType: parseAsString,
      fieldValues: parseAsString,
    },
    {
      history: "push",
      shallow: false,
    },
  );

  // Получаем доступные фильтры для выбранной категории
  const { data: availableFilters, isLoading } = useAvailableFilters({
    categorySlug,
    subCategorySlug,
    typeSlug,
  });

  // Локальное состояние для фильтров
  const [localFilters, setLocalFilters] = React.useState<FiltersState>({
    minPrice: urlFilters.minPrice,
    maxPrice: urlFilters.maxPrice,
    minRating: urlFilters.minRating,
    maxRating: urlFilters.maxRating,
    state: urlFilters.state,
    sortBy: urlFilters.sortBy,
    region: urlFilters.region,
    profileType: urlFilters.profileType,
    fieldValues: urlFilters.fieldValues
      ? JSON.parse(urlFilters.fieldValues)
      : {},
  });

  // Синхронизация локального состояния с URL при открытии
  React.useEffect(() => {
    if (open) {
      setLocalFilters({
        minPrice: urlFilters.minPrice,
        maxPrice: urlFilters.maxPrice,
        minRating: urlFilters.minRating,
        maxRating: urlFilters.maxRating,
        state: urlFilters.state,
        sortBy: urlFilters.sortBy,
        region: urlFilters.region,
        profileType: urlFilters.profileType,
        fieldValues: urlFilters.fieldValues
          ? JSON.parse(urlFilters.fieldValues)
          : {},
      });
    }
  }, [open, urlFilters]);

  const handlePriceChange = (field: "maxPrice" | "minPrice", value: string) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setLocalFilters((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleRatingChange = (
    field: "maxRating" | "minRating",
    value: string,
  ) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setLocalFilters((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      fieldValues: { ...prev.fieldValues, [fieldId]: value },
    }));
  };

  const handleApply = () => {
    const filtersToApply = {
      ...localFilters,
      fieldValues:
        Object.keys(localFilters.fieldValues).length > 0
          ? JSON.stringify(localFilters.fieldValues)
          : null,
    };
    setUrlFilters(filtersToApply as any);
    onOpenChange?.(false);
  };

  const handleReset = () => {
    const resetState: FiltersState = {
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      state: null,
      sortBy: null,
      region: null,
      profileType: null,
      fieldValues: {},
    };
    setLocalFilters(resetState);
    setUrlFilters({
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
      state: null,
      sortBy: null,
      region: null,
      profileType: null,
      fieldValues: null,
    });
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
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Все" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters?.states.includes("NEW") && (
                    <SelectItem value="new">Новый</SelectItem>
                  )}
                  {availableFilters?.states.includes("USED") && (
                    <SelectItem value="used">Б/У</SelectItem>
                  )}
                  {!availableFilters && (
                    <>
                      <SelectItem value="new">Новый</SelectItem>
                      <SelectItem value="used">Б/У</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>
                Тип продавца
              </Typography>
              <Select
                value={localFilters.profileType ?? ""}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, profileType: value }))
                }
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Все" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters?.profileTypes.includes("INDIVIDUAL") && (
                    <SelectItem value="INDIVIDUAL">Физ. лицо</SelectItem>
                  )}
                  {availableFilters?.profileTypes.includes("OOO") && (
                    <SelectItem value="OOO">ООО</SelectItem>
                  )}
                  {availableFilters?.profileTypes.includes("IP") && (
                    <SelectItem value="IP">ИП</SelectItem>
                  )}
                  {!availableFilters && (
                    <>
                      <SelectItem value="INDIVIDUAL">Физ. лицо</SelectItem>
                      <SelectItem value="OOO">ООО</SelectItem>
                      <SelectItem value="IP">ИП</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>
                Рейтинг продавца
              </Typography>
              <div className={styles.priceInputs}>
                <div className={styles.priceField}>
                  <Input
                    className={styles.priceInput}
                    type="number"
                    min={availableFilters?.ratingRange?.min ?? 1}
                    max={availableFilters?.ratingRange?.max ?? 5}
                    step={0.1}
                    value={localFilters.minRating ?? ""}
                    onChange={(e) =>
                      handleRatingChange("minRating", e.target.value)
                    }
                    placeholder={`От ${availableFilters?.ratingRange?.min ?? 1}`}
                  />
                </div>

                <span className={styles.priceSeparator}>—</span>

                <div className={styles.priceField}>
                  <Input
                    className={styles.priceInput}
                    type="number"
                    min={availableFilters?.ratingRange?.min ?? 1}
                    max={availableFilters?.ratingRange?.max ?? 5}
                    step={0.1}
                    value={localFilters.maxRating ?? ""}
                    onChange={(e) =>
                      handleRatingChange("maxRating", e.target.value)
                    }
                    placeholder={`До ${availableFilters?.ratingRange?.max ?? 5}`}
                  />
                </div>
              </div>
            </div>

            {/* Динамические характеристики из available-filters */}
            {availableFilters?.fields && availableFilters.fields.length > 0 && (
              <>
                {availableFilters.fields.map((field) => (
                  <div key={field.fieldId} className={styles.filterGroup}>
                    <Typography className={styles.filterLabel}>
                      {field.fieldName}
                      {field.isRequired && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </Typography>
                    <Select
                      value={
                        localFilters.fieldValues[field.fieldId.toString()] ?? ""
                      }
                      onValueChange={(value) =>
                        handleFieldValueChange(field.fieldId.toString(), value)
                      }
                    >
                      <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.values.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </>
            )}

            <div className={styles.filterGroup}>
              <Typography className={styles.filterLabel}>Регион</Typography>
              <Input
                className={styles.priceInput}
                type="text"
                value={localFilters.region ?? ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    region: e.target.value,
                  }))
                }
                placeholder="Введите регион"
              />
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
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">По релевантности</SelectItem>
                  <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                  <SelectItem value="price-asc">Сначала дешёвые</SelectItem>
                  <SelectItem value="newest">По новизне</SelectItem>
                </SelectContent>
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
