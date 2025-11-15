import { useMutation } from "@tanstack/react-query";

// import type { CreateProductData } from "@/lib/api/types";
import { createProduct } from "@/lib/api";

interface UseCreateProductOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
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
