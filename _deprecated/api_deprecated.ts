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
  console.log("Creating product with data:", data);

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

  console.log("FormData prepared, making request...");
  console.log("Document.cookie:", document.cookie); // Проверим куки

  try {
    // Попробуем сначала с обычным fetch для отладки
    const response = await fetch("http://localhost:3000/product/create", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Product creation successful:", result);
    return result;
  } catch (error) {
    console.error("Product creation failed:", error);
    throw error;
  }
};
