import { useMutation } from "@tanstack/react-query";

import { createProduct } from "@/lib/api";

import type { CreateProductData } from "@/lib/api/types";

interface UseCreateProductOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook для создания нового товара
 *
 * @param options - Опции для обработки успеха/ошибки
 * @returns Mutation для создания товара
 *
 * @example
 * ```tsx
 * const createProductMutation = useCreateProduct({
 *   onSuccess: (data) => {
 *     console.log('Товар создан:', data);
 *     router.push('/profile/my-products');
 *   },
 *   onError: (error) => {
 *     console.error('Ошибка создания:', error);
 *   }
 * });
 *
 * const handleSubmit = (formData: CreateProductData) => {
 *   createProductMutation.mutate(formData);
 * };
 * ```
 */
export const useCreateProduct = (options?: UseCreateProductOptions) => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
