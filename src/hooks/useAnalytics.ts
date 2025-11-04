import { useState, useEffect } from "react";

interface AnalyticsParams {
  period: string;
  categoryId?: number;
}

interface AnalyticsData {
  views: number;
  contacts: number;
  favorites: number;
  phone: number;
  rating: number;
  conversion: number;
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAnalytics = ({
  period,
  categoryId,
}: AnalyticsParams): UseAnalyticsReturn => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("period", period);

      if (categoryId) {
        params.append("categoryId", categoryId.toString());
      }

      const response = await fetch(
        `http://localhost:3000/statistics/analytic?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analyticsData: AnalyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки аналитики"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, categoryId]);

  const refetch = () => {
    fetchAnalytics();
  };

  return { data, isLoading, error, refetch };
};
