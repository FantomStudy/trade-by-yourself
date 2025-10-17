interface CreateProductData {
  name: string;
  price: number;
  state: string;
  categoryId: number;
  subcategoryId: number;
  brand?: string;
  model?: string;
  description?: string;
  address?: string;
  images?: File[];
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

  const response = await fetch("http://localhost:3000/product/create", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка при создании объявления");
  }

  return response.json();
};
