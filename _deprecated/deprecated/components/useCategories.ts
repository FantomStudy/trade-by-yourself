import { useEffect, useState } from "react";

import { api } from "@/lib/api/instance";

interface Category {
  id: number;
  name: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  error: string | null;
  isLoading: boolean;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<Category[]>("/category/all-categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
