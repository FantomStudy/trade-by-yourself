"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Button } from "../../_lib/ui/button";
import { Input } from "../../_lib/ui/input";
import { Select } from "../../_lib/ui/select";
import { Typography } from "../../_lib/ui/typography";

import styles from "./filters.module.css";

export const Filters = ({ children }: React.PropsWithChildren) => {
  const [filters, setFilters] = useQueryStates(
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

  const handlePriceChange = (field: "maxPrice" | "minPrice", value: string) => {
    const numValue = value === "" ? null : Number.parseInt(value);
    setFilters({ [field]: numValue });
  };

  const handleReset = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      state: null,
      sortBy: null,
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
              <Select.Item value="new">Новый</Select.Item>
              <Select.Item value="used">Б/У</Select.Item>
            </Select.Content>
          </Select>
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

        <Button className={styles.resetButton} onClick={handleReset}>
          Сбросить
        </Button>
      </div>
      {children}
    </div>
  );
};
