import { api } from "@/api/instance";

interface CreateProductData {
  name: string;
  address?: string;
  brand?: string;
  categoryId: number;
  description?: string;
  images?: File[];
  model?: string;
  price: number;
  state: string;
  subcategoryId: number;
}

/**
 * Создание нового объявления о продаже товара
 *
 * @param data - Данные для создания товара
 * @returns Promise с результатом создания
 *
 * Обязательные поля:
 * - name: Название продукта
 * - price: Цена в рублях
 * - state: Состояние товара (new/used)
 * - categoryId: ID категории
 * - subcategoryId: ID подкатегории
 *
 * Опциональные поля:
 * - brand: Бренд
 * - model: Модель
 * - description: Описание товара
 * - address: Адрес продавца
 * - images: Массив файлов изображений (до 8 файлов)
 */
export const createProduct = async (data: CreateProductData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("state", data.state);
  formData.append("categoryId", data.categoryId.toString());
  formData.append("subcategoryId", data.subcategoryId.toString());

  if (data.description) formData.append("description", data.description);
  if (data.brand) formData.append("brand", data.brand);
  if (data.model) formData.append("model", data.model);
  if (data.address) formData.append("address", data.address);

  // Добавляем изображения
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api("/product/create", {
    method: "POST",
    body: formData,
  });

  return response;
};
