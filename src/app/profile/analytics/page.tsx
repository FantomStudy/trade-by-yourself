"use client";

import { Eye, Heart, MessageSquare, Package, Phone } from "lucide-react";
import { useState } from "react";

import { useAnalytics } from "@/components/_deprecated/useAnalytics";
import { Typography } from "@/components/ui";
import { getFavorites } from "@/lib/api/requests";
import { useCategories, useChats } from "@/lib/api/hooks";
import { useQuery } from "@tanstack/react-query";

import styles from "./page.module.css";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  // Загружаем категории
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Загружаем чаты и избранное
  const { data: chats } = useChats();
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  // Загружаем аналитику
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics({
    period: selectedPeriod,
    categoryId: selectedCategoryId,
  });

  const isLoading = categoriesLoading || analyticsLoading;
  const error = categoriesError || analyticsError;

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedCategoryId(value === "" ? undefined : Number.parseInt(value));
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
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Заголовок с фильтрами */}
      <div className={styles.header}>
        <Typography className={styles.title} variant="h1">
          Аналитика
        </Typography>
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >
            <option value="day">День</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="half-year">Полгода</option>
            <option value="year">Год</option>
          </select>
          <select
            className={styles.filterSelect}
            value={selectedCategoryId || ""}
            onChange={handleCategoryChange}
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Карточки метрик */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "#dbeafe" }}
          >
            <Eye className="h-6 w-6" style={{ color: "#3b82f6" }} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Просмотры</Typography>
            <Typography className={styles.metricValue}>
              {analyticsData?.views?.toString() || "0"}
            </Typography>
            <Typography className={styles.metricPeriod}>
              за выбранный период
            </Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "#d1fae5" }}
          >
            <MessageSquare className="h-6 w-6" style={{ color: "#10b981" }} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Всего чатов</Typography>
            <Typography className={styles.metricValue}>
              {chats?.length || 0}
            </Typography>
            <Typography className={styles.metricPeriod}>
              активных диалогов
            </Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "#fce7f3" }}
          >
            <Heart className="h-6 w-6" style={{ color: "#ec4899" }} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>В избранном</Typography>
            <Typography className={styles.metricValue}>
              {favorites?.length || 0}
            </Typography>
            <Typography className={styles.metricPeriod}>
              сохраненных товаров
            </Typography>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIcon}
            style={{ backgroundColor: "#e0e7ff" }}
          >
            <Package className="h-6 w-6" style={{ color: "#6366f1" }} />
          </div>
          <div className={styles.metricContent}>
            <Typography className={styles.metricLabel}>Телефон</Typography>
            <Typography className={styles.metricValue}>
              {analyticsData?.phone?.toString() || "0"}
            </Typography>
            <Typography className={styles.metricPeriod}>
              за выбранный период
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
