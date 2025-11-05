import { useCallback, useEffect, useState } from "react";

interface AnalyticsParams {
  categoryId?: number;
  period: string;
}

interface AnalyticsData {
  contacts: number;
  conversion: number;
  favorites: number;
  phone: number;
  rating: number;
  views: number;
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

export const useAnalytics = ({
  period,
  categoryId,
}: AnalyticsParams): UseAnalyticsReturn => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("period", period);

      if (categoryId) {
        params.append("categoryId", categoryId.toString());
      }

      const response = await fetch(
        `http://localhost:3000/statistics/analytic?${params.toString()}`,
        {
          method: "GET",
          credentials: "include", // Это обеспечит передачу куки
          headers: {
            "Content-Type": "application/json",
          },
        }
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
  }, [period, categoryId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = () => {
    fetchAnalytics();
  };

  return { data, isLoading, error, refetch };
};
