"use client";

import { useState } from "react";

import { TrendCard } from "../../../features/deprecated/components/TrendCard/TrendCard";
import { useAnalytics, useCategories } from "../../../features/deprecated/hooks/index";

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
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategoryId(value === "" ? undefined : Number.parseInt(value));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
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
      </div>

      {/* Основные метрики */}
      <div className={styles.metricsGrid}>
        <TrendCard
          title="Просмотры"
          trend={0}
          value={analyticsData?.views?.toString() || "0"}
          color="blue"
          icon="👁️"
          trendPeriod="за выбранный период"
        />

        <TrendCard
          title="Контакты / Чаты"
          trend={0}
          value={analyticsData?.contacts?.toString() || "0"}
          color="green"
          icon="👁️"
          trendPeriod="за выбранный период"
        />

        <TrendCard
          title="Избранное"
          trend={0}
          value={analyticsData?.favorites?.toString() || "0"}
          color="pink"
          icon="👁️"
          trendPeriod="за выбранный период"
        />

        <TrendCard
          title="Телефон"
          trend={0}
          value={analyticsData?.phone?.toString() || "0"}
          color="light-blue"
          icon="👁️"
          trendPeriod="за выбранный период"
        />

        <TrendCard
          title="Рейтинг"
          trend={0}
          value={analyticsData?.rating?.toString() || "0"}
          color="yellow"
          icon="👁️"
          trendPeriod="за выбранный период"
        />

        <TrendCard
          title="Конверсия"
          trend={0}
          value={analyticsData?.conversion?.toString() || "0"}
          color="orange"
          icon="👁️"
          trendPeriod="за выбранный период"
        />
      </div>
    </div>
  );
};

export default Analytics;
