export interface AnalyticsData {
  totalProducts: number;
  totalRevenue: number;
  totalSales: number;
  totalViews: number;
  categories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  salesTrend: Array<{
    date: string;
    revenue: number;
    sales: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    revenue: number;
    sales: number;
    views: number;
  }>;
}

export interface AnalyticsTrends {
  productsGrowth: number;
  revenueGrowth: number;
  salesGrowth: number;
  viewsGrowth: number;
}

/**
 * Получить данные аналитики за выбранный период
 *
 * @param period - Период для аналитики (7d, 30d, 90d, 1y)
 * @returns Promise с данными аналитики
 */
export const getAnalyticsData = async (
  period: string = "7d",
): Promise<AnalyticsData> => {
  const response = await fetch(`/api/analytics?period=${period}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при загрузке аналитики");
  }

  return response.json();
};

/**
 * Получить тренды роста для основных метрик
 *
 * @param period - Период для сравнения трендов
 * @returns Promise с данными трендов
 */
export const getAnalyticsTrends = async (
  period: string = "7d",
): Promise<AnalyticsTrends> => {
  const response = await fetch(`/api/analytics/trends?period=${period}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при загрузке трендов");
  }

  return response.json();
};

/**
 * Экспортировать данные аналитики в CSV
 *
 * @param period - Период для экспорта
 * @returns Promise с blob файлом CSV
 */
export const exportAnalyticsData = async (
  period: string = "7d",
): Promise<Blob> => {
  const response = await fetch(
    `/api/analytics/export?period=${period}&format=cs v`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error("Ошибка при экспорте данных");
  }

  return response.blob();
};

/**
 * Получить данные для дашборда в реальном времени
 *
 * @returns Promise с актуальными данными
 */
export const getRealtimeData = async () => {
  const response = await fetch("/api/analytics/realtime", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка при получении данных в реальном времени");
  }

  return response.json();
};
