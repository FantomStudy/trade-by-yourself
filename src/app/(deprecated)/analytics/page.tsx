"use client";

import { useState } from "react";
import { TrendCard } from "@/components/ui";
import { useAnalytics, useCategories } from "@/hooks";
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
    setSelectedCategoryId(value === "" ? undefined : parseInt(value));
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
            onClick={() => window.location.reload()}
            className={styles.retryButton}
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
          value={analyticsData?.views?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="blue"
        />

        <TrendCard
          title="Контакты / Чаты"
          value={analyticsData?.contacts?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="green"
        />

        <TrendCard
          title="Избранное"
          value={analyticsData?.favorites?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="pink"
        />

        <TrendCard
          title="Телефон"
          value={analyticsData?.phone?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="light-blue"
        />

        <TrendCard
          title="Рейтинг"
          value={analyticsData?.rating?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="yellow"
        />

        <TrendCard
          title="Конверсия"
          value={analyticsData?.conversion?.toString() || "0"}
          trend={0}
          trendPeriod="за выбранный период"
          icon="👁️"
          color="orange"
        />
      </div>
    </div>
  );
};

export default Analytics;
