"use client";

import type { Route } from "next";
import { FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Input, Select, Sheet } from "@/components/ui";
import { useProductFilters } from "@/hooks/useProductFilters";
import { FILTER_KEYS, PROFILE_TYPE_LABELS, SORT_BY_LABELS, STATE_LABELS } from "./constants";
import styles from "./FilterMenu.module.css";

export const FilterMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [profileType, setProfileType] = useState(searchParams.get("profileType") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") ?? "");
  const [maxRating, setMaxRating] = useState(searchParams.get("maxRating") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "");
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const raw = searchParams.get("fieldValues");
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const pathParts = pathname.split("/").filter(Boolean);
  const categorySlug = pathParts[0] || undefined;
  const subCategorySlug = pathParts[1] || undefined;
  const typeSlug = pathParts[2] || undefined;

  const filters = useProductFilters({
    categorySlug,
    subCategorySlug,
    typeSlug,
  });

  const availableStates = filters.data?.states ?? [];
  const availableProfileTypes = filters.data?.profileTypes ?? [];
  const availableFields = filters.data?.fields ?? [];
  const priceRange = filters.data?.priceRange;
  const ratingRange = filters.data?.ratingRange;

  const syncFromParams = () => {
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setState(searchParams.get("state") ?? "");
    setProfileType(searchParams.get("profileType") ?? "");
    setMinRating(searchParams.get("minRating") ?? "");
    setMaxRating(searchParams.get("maxRating") ?? "");
    setSortBy(searchParams.get("sortBy") ?? "");
    const raw = searchParams.get("fieldValues");
    try {
      setFields(raw ? JSON.parse(raw) : {});
    } catch {
      setFields({});
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (value) syncFromParams();
    setOpen(value);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value: string) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    };

    setOrDelete("minPrice", minPrice);
    setOrDelete("maxPrice", maxPrice);
    setOrDelete("state", state);
    setOrDelete("profileType", profileType);
    setOrDelete("minRating", minRating);
    setOrDelete("maxRating", maxRating);
    setOrDelete("sortBy", sortBy);

    const nonEmptyFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v));
    if (Object.keys(nonEmptyFields).length > 0) {
      params.set("fieldValues", JSON.stringify(nonEmptyFields));
    } else {
      params.delete("fieldValues");
    }

    router.push(`${pathname}?${params.toString()}` as Route);
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));

    setMinPrice("");
    setMaxPrice("");
    setState("");
    setProfileType("");
    setMinRating("");
    setMaxRating("");
    setSortBy("");
    setFields({});

    router.push(`${pathname}?${params.toString()}` as Route);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Sheet.Trigger render={<Button size="icon" aria-label="Открыть фильтры" />}>
        <FilterIcon />
      </Sheet.Trigger>

      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Фильтры</Sheet.Title>
          <Sheet.Description>Настройте параметры поиска товаров</Sheet.Description>
        </Sheet.Header>

        <div className={styles.content}>
          <div className={styles.group}>
            <label>Цена</label>
            <div className={styles.inputWrapper}>
              <Input
                type="number"
                className={styles.priceInput}
                placeholder={priceRange ? String(priceRange.min) : "От"}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className={styles.separator}>—</span>
              <Input
                type="number"
                className={styles.priceInput}
                placeholder={priceRange ? String(priceRange.max) : "До"}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          {availableStates.length > 0 && (
            <div className={styles.group}>
              <label>Состояние</label>
              <Select value={state} onValueChange={(v) => setState(v ?? "")}>
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value placeholder="Все">
                    {(v: string | null) => (v ? STATE_LABELS[v] : null)}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content>
                  {availableStates.map((s) => (
                    <Select.Item key={s} value={s}>
                      {STATE_LABELS[s] ?? s}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          )}
          {availableProfileTypes.length > 0 && (
            <div className={styles.group}>
              <label>Тип продавца</label>
              <Select value={profileType} onValueChange={(v) => setProfileType(v ?? "")}>
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value placeholder="Все">
                    {(v: string | null) => (v ? PROFILE_TYPE_LABELS[v] : null)}
                  </Select.Value>
                </Select.Trigger>
                <Select.Content>
                  {availableProfileTypes.map((pt) => (
                    <Select.Item key={pt} value={pt}>
                      {PROFILE_TYPE_LABELS[pt] ?? pt}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          )}
          <div className={styles.group}>
            <label>Рейтинг продавца</label>
            <div className={styles.inputWrapper}>
              <Input
                type="number"
                placeholder={ratingRange ? String(ratingRange.min) : "1"}
                min={ratingRange?.min ?? 1}
                max={ratingRange?.max ?? 5}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
              <span className={styles.separator}>—</span>
              <Input
                type="number"
                placeholder={ratingRange ? String(ratingRange.max) : "5"}
                min={ratingRange?.min ?? 1}
                max={ratingRange?.max ?? 5}
                step={0.1}
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              />
            </div>
          </div>
          {availableFields.map((field) => (
            <div key={field.fieldId} className={styles.group}>
              <label>{field.fieldName}</label>
              <Select
                value={fields[field.fieldId.toString()] ?? ""}
                onValueChange={(v) =>
                  setFields((prev) => ({ ...prev, [field.fieldId.toString()]: v ?? "" }))
                }
              >
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value placeholder="Все" />
                </Select.Trigger>
                <Select.Content>
                  {field.values.map((val) => (
                    <Select.Item key={val} value={val}>
                      {val}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          ))}
          <div className={styles.group}>
            <label>Сортировать по</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "")}>
              <Select.Trigger className={styles.selectTrigger}>
                <Select.Value placeholder="Не выбрано">
                  {(v: string | null) => (v ? SORT_BY_LABELS[v] : null)}
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="date_desc">Сначала новые</Select.Item>
                <Select.Item value="date_asc">Сначала старые</Select.Item>
                <Select.Item value="price_asc">Сначала дешевле</Select.Item>
                <Select.Item value="price_desc">Сначала дороже</Select.Item>
                <Select.Item value="relevance">По релевантности</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <Sheet.Footer>
          <Button variant="destructive" onClick={handleReset}>
            Сбросить
          </Button>
          <Button onClick={handleApply}>Применить</Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};
