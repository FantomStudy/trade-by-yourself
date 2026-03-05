"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

import { useAvailableFilters } from "@/api/hooks";
import { Button } from "@/components/ui-lab/Button";
import { Input } from "@/components/ui-lab/Input";
import { Select } from "../../../../../components/ui-lab/Select";
import { Typography } from "../../_lib/ui/typography";
import styles from "./filters.module.css";

interface FiltersProps {
  children?: React.ReactNode;
  categorySlug?: string;
  subCategorySlug?: string;
  typeSlug?: string;
}

export const Filters = ({
  children,
  categorySlug,
  subCategorySlug,
  typeSlug,
}: FiltersProps) => {
  // Состояние для динамических характеристик
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const [filters, setFilters] = useQueryStates(
    {
      minPrice: parseAsInteger,
      maxPrice: parseAsInteger,
      minRating: parseAsInteger,
      maxRating: parseAsInteger,
      state: parseAsString,
      sortBy: parseAsString,
      region: parseAsString,
      profileType: parseAsString,
      fieldValues: parseAsString, // JSON строка для динамических характеристик
    },
    {
      history: "push",
      shallow: false,
    },
  );

  // Инициализация fieldValues из URL
  useEffect(() => {
    if (filters.fieldValues) {
      try {
        const parsedFieldValues = JSON.parse(filters.fieldValues);
        setFieldValues(parsedFieldValues);
      } catch (error) {
        console.error("Failed to parse fieldValues from URL:", error);
      }
    }
  }, [filters.fieldValues]);

  // Получаем доступные фильтры для выбранной категории
  const { data: availableFilters, isLoading } = useAvailableFilters({
    categorySlug,
    subCategorySlug,
    typeSlug,
  });

  const handlePriceChange = (field: "maxPrice" | "minPrice", value: string) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setFilters({ [field]: numValue });
  };

  const handleRatingChange = (
    field: "maxRating" | "minRating",
    value: string,
  ) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setFilters({ [field]: numValue });
  };

  const handleFieldValueChange = (fieldId: string, value: string) => {
    const newFieldValues = { ...fieldValues, [fieldId]: value };
    setFieldValues(newFieldValues);
    // Сохраняем в URL как JSON строку
    setFilters({ fieldValues: JSON.stringify(newFieldValues) });
  };

  const handleApply = () => {
    // Фильтры уже синхронизированы с URL, просто закрываем панель
    // (логика закрытия будет в Sheet/Dialog если нужно)
  };

  const handleReset = () => {
    setFieldValues({});
    setFilters({
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>Цена</Typography>
          <div className={styles.priceInputs}>
            <div className={styles.priceField}>
              <Input
                className={styles.priceInput}
                type="number"
                value={filters.minPrice ?? ""}
                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                placeholder="От"
              />
            </div>

            <span className={styles.priceSeparator}>—</span>

            <div className={styles.priceField}>
              <Input
                className={styles.priceInput}
                type="number"
                value={filters.maxPrice ?? ""}
                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                placeholder="До"
              />
            </div>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>Состояние</Typography>
          <Select
            value={filters.state ?? ""}
            onValueChange={(value) => setFilters({ state: value })}
          >
            <Select.Trigger className={styles.selectTrigger}>
              <Select.Value placeholder="Все" />
            </Select.Trigger>
            <Select.Content>
              {availableFilters?.states.includes("NEW") && (
                <Select.Item value="new">Новый</Select.Item>
              )}
              {availableFilters?.states.includes("USED") && (
                <Select.Item value="used">Б/У</Select.Item>
              )}
              {!availableFilters && (
                <>
                  <Select.Item value="new">Новый</Select.Item>
                  <Select.Item value="used">Б/У</Select.Item>
                </>
              )}
            </Select.Content>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>Тип продавца</Typography>
          <Select
            value={filters.profileType ?? ""}
            onValueChange={(value) => setFilters({ profileType: value })}
          >
            <Select.Trigger className={styles.selectTrigger}>
              <Select.Value placeholder="Все" />
            </Select.Trigger>
            <Select.Content>
              {availableFilters?.profileTypes.includes("INDIVIDUAL") && (
                <Select.Item value="INDIVIDUAL">Физ. лицо</Select.Item>
              )}
              {availableFilters?.profileTypes.includes("OOO") && (
                <Select.Item value="OOO">ООО</Select.Item>
              )}
              {availableFilters?.profileTypes.includes("IP") && (
                <Select.Item value="IP">ИП</Select.Item>
              )}
              {!availableFilters && (
                <>
                  <Select.Item value="INDIVIDUAL">Физ. лицо</Select.Item>
                  <Select.Item value="OOO">ООО</Select.Item>
                  <Select.Item value="IP">ИП</Select.Item>
                </>
              )}
            </Select.Content>
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
                value={filters.minRating ?? ""}
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
                value={filters.maxRating ?? ""}
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
                  {field.isRequired && <span style={{ color: "red" }}> *</span>}
                </Typography>
                <Select
                  value={fieldValues[field.fieldId.toString()] ?? ""}
                  onValueChange={(value) =>
                    handleFieldValueChange(field.fieldId.toString(), value)
                  }
                >
                  <Select.Trigger className={styles.selectTrigger}>
                    <Select.Value placeholder="Все" />
                  </Select.Trigger>
                  <Select.Content>
                    {field.values.map((value) => (
                      <Select.Item key={value} value={value}>
                        {value}
                      </Select.Item>
                    ))}
                  </Select.Content>
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
            value={filters.region ?? ""}
            onChange={(e) => setFilters({ region: e.target.value })}
            placeholder="Введите регион"
          />
        </div>

        <div className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>Сортировать по</Typography>
          <Select
            value={filters.sortBy ?? ""}
            onValueChange={(value) => setFilters({ sortBy: value })}
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

        <div className={styles.buttonGroup}>
          <Button
            className={styles.resetButton}
            onClick={handleReset}
            variant="success"
          >
            Сбросить
          </Button>
          <Button className={styles.applyButton} onClick={handleApply}>
            Применить
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};
