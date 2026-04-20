"use client";

import { useQuery } from "@tanstack/react-query";
import { Eye, Heart, MessageSquare, Package } from "lucide-react";
import { useState } from "react";
import { getAnalytics } from "@/api/analytics";
import { getChats } from "@/api/chats";
import { getFavorites } from "@/api/products";
import { Select, Typography } from "@/components/ui";
import { useCategories } from "@/hooks/useCategories";
import styles from "./page.module.css";

const PERIOD_VALUES = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
  quarter: "Квартал",
  "half-year": "Полгода",
  year: "Год",
} as const;

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { data: chats } = useQuery({
    queryKey: ["chats", "list"],
    queryFn: getChats,
  });
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["analytics", selectedPeriod, selectedCategoryId],
    queryFn: () =>
      getAnalytics({
        period: selectedPeriod,
        categoryId: selectedCategoryId,
      }),
  });

  const isLoading = categoriesLoading || analyticsLoading;
  const error = categoriesError || analyticsError;

  const formatError = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "message" in value) {
      const message = (value as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
    return "Не удалось загрузить аналитику";
  };

  const handlePeriodChange = (value: string | null) => {
    setSelectedPeriod(value!);
  };

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategoryId(value === "" ? undefined : Number.parseInt(value!));
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{formatError(error)}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!categories) return null;

  return (
    <div className={styles.page}>
      {/* Заголовок с фильтрами */}
      <div className={styles.header}>
        <Typography className={styles.title} variant="h1">
          Аналитика
        </Typography>
        <div className={styles.filters}>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <Select.Trigger className={styles.filterSelect}>
              <Select.Value>
                {PERIOD_VALUES[selectedPeriod as keyof typeof PERIOD_VALUES]}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="day">День</Select.Item>
              <Select.Item value="week">Неделя</Select.Item>
              <Select.Item value="month">Месяц</Select.Item>
              <Select.Item value="quarter">Квартал</Select.Item>
              <Select.Item value="half-year">Полгода</Select.Item>
              <Select.Item value="year">Год</Select.Item>
            </Select.Content>
          </Select>
          <Select
            value={selectedCategoryId ? String(selectedCategoryId) : ""}
            onValueChange={handleCategoryChange}
          >
            <Select.Trigger className={styles.filterSelect}>
              <Select.Value placeholder="Все категории">
                {categories.find((el) => el.id === selectedCategoryId)?.name}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">Все категории</Select.Item>
              {categories.map((category) => (
                <Select.Item key={category.id} value={category.id}>
                  {category.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Карточки метрик */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconViews}`}>
            <Eye className={styles.metricIconSvg} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Просмотры</Typography>
            <Typography className={styles.metricValue}>
              {analyticsData?.views?.toString() || "0"}
            </Typography>
            <Typography className={styles.metricPeriod}>за выбранный период</Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconChats}`}>
            <MessageSquare className={styles.metricIconSvg} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Всего чатов</Typography>
            <Typography className={styles.metricValue}>{chats?.length || 0}</Typography>
            <Typography className={styles.metricPeriod}>активных диалогов</Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconFavorites}`}>
            <Heart className={styles.metricIconSvg} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>В избранном</Typography>
            <Typography className={styles.metricValue}>{favorites?.length || 0}</Typography>
            <Typography className={styles.metricPeriod}>сохраненных товаров</Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconPhone}`}>
            <Package className={styles.metricIconSvg} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Телефон</Typography>
            <Typography className={styles.metricValue}>
              {analyticsData?.phone?.toString() || "0"}
            </Typography>
            <Typography className={styles.metricPeriod}>за выбранный период</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
