"use client";

import { useState, useEffect } from "react";
import { TrendCard, ExportButton } from "@/components/ui";
import styles from "./page.module.css";

interface AnalyticsData {
  totalProducts: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  categories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  salesTrend: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    views: number;
    sales: number;
    revenue: number;
  }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Симуляция API запроса - замените на реальный endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: AnalyticsData = {
        totalProducts: 342,
        totalViews: 15420,
        totalSales: 89,
        totalRevenue: 234500,
        categories: [
          { name: "Электроника", count: 125, percentage: 36.5 },
          { name: "Одежда", count: 98, percentage: 28.7 },
          { name: "Мебель", count: 67, percentage: 19.6 },
          { name: "Спорт", count: 52, percentage: 15.2 },
        ],
        salesTrend: [
          { date: "2025-10-17", sales: 12, revenue: 32000 },
          { date: "2025-10-18", sales: 18, revenue: 48000 },
          { date: "2025-10-19", sales: 15, revenue: 38000 },
          { date: "2025-10-20", sales: 22, revenue: 56000 },
          { date: "2025-10-21", sales: 19, revenue: 45000 },
          { date: "2025-10-22", sales: 25, revenue: 62000 },
          { date: "2025-10-23", sales: 28, revenue: 71000 },
        ],
        topProducts: [
          {
            id: 1,
            name: "iPhone 15 Pro",
            views: 245,
            sales: 8,
            revenue: 95000,
          },
          {
            id: 2,
            name: "MacBook Air M2",
            views: 189,
            sales: 5,
            revenue: 65000,
          },
          { id: 3, name: "AirPods Pro", views: 156, sales: 12, revenue: 48000 },
          {
            id: 4,
            name: 'Samsung TV 55"',
            views: 134,
            sales: 6,
            revenue: 42000,
          },
          { id: 5, name: "Nike Air Max", views: 98, sales: 15, revenue: 22500 },
        ],
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Ошибка загрузки данных аналитики");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num);
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
          <button onClick={fetchAnalyticsData} className={styles.retryButton}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
        <div className={styles.periodSelector}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={styles.select}
          >
            <option value="7d">За 7 дней</option>
            <option value="30d">За 30 дней</option>
            <option value="90d">За 3 месяца</option>
            <option value="1y">За год</option>
          </select>
          <ExportButton period={selectedPeriod} />
        </div>
      </div>

      {/* Основные метрики */}
      <div className={styles.metricsGrid}>
        <TrendCard
          title="Всего товаров"
          value={formatNumber(analyticsData.totalProducts)}
          trend={12.5}
          trendPeriod="за последние 7 дней"
          icon="📦"
          color="blue"
        />

        <TrendCard
          title="Просмотры"
          value={formatNumber(analyticsData.totalViews)}
          trend={8.3}
          trendPeriod="за последние 7 дней"
          icon="👁️"
          color="green"
        />

        <TrendCard
          title="Продажи"
          value={formatNumber(analyticsData.totalSales)}
          trend={-2.1}
          trendPeriod="за последние 7 дней"
          icon="🛒"
          color="purple"
        />

        <TrendCard
          title="Выручка"
          value={formatCurrency(analyticsData.totalRevenue)}
          trend={15.7}
          trendPeriod="за последние 7 дней"
          icon="💰"
          color="orange"
        />
      </div>

      <div className={styles.chartsGrid}>
        {/* График продаж */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Динамика продаж</h3>
          <div className={styles.salesChart}>
            {analyticsData.salesTrend.map((item, index) => (
              <div key={index} className={styles.chartBar}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${
                      (item.sales /
                        Math.max(
                          ...analyticsData.salesTrend.map((i) => i.sales)
                        )) *
                      100
                    }%`,
                  }}
                ></div>
                <span className={styles.barLabel}>
                  {new Date(item.date).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Категории */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Категории товаров</h3>
          <div className={styles.categoriesChart}>
            {analyticsData.categories.map((category, index) => (
              <div key={index} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCount}>{category.count}</span>
                </div>
                <div className={styles.categoryBar}>
                  <div
                    className={styles.categoryProgress}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.categoryPercentage}>
                  {category.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Топ товары */}
      <div className={styles.topProducts}>
        <h3 className={styles.sectionTitle}>Топ товары</h3>
        <div className={styles.productsTable}>
          <div className={styles.tableHeader}>
            <span>Товар</span>
            <span>Просмотры</span>
            <span>Продажи</span>
            <span>Выручка</span>
          </div>
          {analyticsData.topProducts.map((product, index) => (
            <div key={product.id} className={styles.tableRow}>
              <div className={styles.productInfo}>
                <span className={styles.productRank}>#{index + 1}</span>
                <span className={styles.productName}>{product.name}</span>
              </div>
              <span className={styles.productViews}>
                {formatNumber(product.views)}
              </span>
              <span className={styles.productSales}>
                {formatNumber(product.sales)}
              </span>
              <span className={styles.productRevenue}>
                {formatCurrency(product.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
