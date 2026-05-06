"use client";

import type { Category } from "@/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useCreateDraftMutation, useCreateProductMutation } from "@/api/hooks";
import { AddressMap, Button, ImageUpload, Input, Textarea } from "@/components/ui";
import { api } from "@/lib/api/instance";

import styles from "./page.module.css";

const CreateProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "1",
    description: "",
    state: "",
    address: "",
    categoryId: "",
    subcategoryId: "",
    typeId: "",
    videoUrl: "",
  });

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const createProductMutation = useCreateProductMutation();
  const createDraftMutation = useCreateDraftMutation();

  useEffect(() => {
    api<Category[]>("/category/find-all").then((response) => {
      setCategories(response);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Для числовых полей разрешаем только цифры
    if (name === "price" || name === "quantity") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStateChange = (state: string) => {
    setFormData((prev) => ({ ...prev, state }));
  };
  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitAttempted(true);

    // Валидация
    if (
      !formData.name ||
      !formData.price ||
      !formData.quantity ||
      !formData.state ||
      !formData.categoryId ||
      !formData.subcategoryId ||
      !formData.typeId
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Цена должна быть больше нуля");
      return;
    }

    const parsedQuantity = Number(formData.quantity || "1");
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Количество должно быть целым числом больше 0");
      return;
    }

    if (images.length === 0) {
      setError("Добавьте хотя бы одно изображение");
      return;
    }

    try {
      await createProductMutation.mutateAsync(
        {
          name: formData.name,
          price: Number(formData.price),
          quantity: parsedQuantity,
          state: formData.state as "NEW" | "USED",
          categoryId: Number(formData.categoryId),
          subcategoryId: Number(formData.subcategoryId),
          typeId: Number(formData.typeId),
          description: formData.description,
          address: formData.address,
          images,
          fieldValues,
          videoUrl: formData.videoUrl,
          ...(coordinates && {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }),
        },
        {
          onSuccess: (data) => {
            console.log("Объявление создано:", data);
            toast.success(
              "Товар отправлен на модерацию. После проверки он появится в вашем списке объявлений.",
            );
            setFormData({
              name: "",
              price: "",
              quantity: "1",
              description: "",
              state: "",
              address: "",
              categoryId: "",
              subcategoryId: "",
              typeId: "",
              videoUrl: "",
            });
            setFieldValues({});
            setImages([]);
            setCoordinates(null);
            setError(null);
          },
          onError: (error: any) => {
            console.error("Ошибка создания объявления:", error);

            if (error.response?.status === 400) {
              const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Ошибка валидации данных";
              const formattedMessage = Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage;
              setError(
                formattedMessage.includes("Количество должно быть целым числом больше 0")
                  ? "Количество должно быть целым числом больше 0"
                  : formattedMessage,
              );
            } else {
              setError(`Ошибка при создании объявления: ${error.message || "Неизвестная ошибка"}`);
            }
          },
        },
      );
      router.replace("/profile/my-products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  /** Черновик: те же поля, но без обязательных фото (multipart как у create). */
  const handleSaveDraft = async () => {
    setError(null);

    try {
      const parsedPrice = formData.price.trim() ? Number(formData.price) : undefined;
      const parsedQuantity = formData.quantity.trim() ? Number(formData.quantity) : undefined;
      const normalizedFieldValues = Object.entries(fieldValues).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          const trimmed = value.trim();
          if (trimmed) acc[key] = trimmed;
          return acc;
        },
        {},
      );

      await createDraftMutation.mutateAsync(
        {
          ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
          ...(typeof parsedPrice === "number" && Number.isFinite(parsedPrice)
            ? { price: parsedPrice }
            : {}),
          ...(typeof parsedQuantity === "number" &&
          Number.isFinite(parsedQuantity) &&
          parsedQuantity > 0
            ? { quantity: parsedQuantity }
            : {}),
          ...(formData.state ? { state: formData.state as "NEW" | "USED" } : {}),
          ...(formData.categoryId ? { categoryId: Number(formData.categoryId) } : {}),
          ...(formData.subcategoryId ? { subcategoryId: Number(formData.subcategoryId) } : {}),
          ...(formData.typeId ? { typeId: Number(formData.typeId) } : {}),
          ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
          ...(formData.address.trim() ? { address: formData.address.trim() } : {}),
          images: images.length > 0 ? images : undefined,
          ...(Object.keys(normalizedFieldValues).length > 0
            ? { fieldValues: normalizedFieldValues }
            : {}),
          ...(formData.videoUrl.trim() ? { videoUrl: formData.videoUrl.trim() } : {}),
          ...(coordinates && {
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }),
        },
        {
          onSuccess: () => {
            toast.success("Черновик сохранён");
          },
          onError: (error: any) => {
            console.error("Ошибка сохранения черновика:", error);
            if (error.response?.status === 400) {
              const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Ошибка валидации данных";
              const formattedMessage = Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage;
              setError(
                formattedMessage.includes("Количество должно быть целым числом больше 0")
                  ? "Количество должно быть целым числом больше 0"
                  : formattedMessage,
              );
            } else {
              setError(`Ошибка: ${error.message || "Неизвестная ошибка"}`);
            }
          },
        },
      );
      router.replace("/profile/my-products?tab=drafts");
    } catch (err) {
      console.error("Draft save error:", err);
    }
  };

  // Получаем доступные подкатегории
  const selectedCategory = categories.find((cat) => String(cat.id) === formData.categoryId);
  const availableSubcategories = selectedCategory?.subCategories || [];

  // Получаем доступные типы подкатегорий
  const selectedSubcategory = availableSubcategories.find(
    (sub) => String(sub.id) === formData.subcategoryId,
  );
  const availableTypes = selectedSubcategory?.subcategoryTypes || [];

  // Получаем поля для выбранного типа
  const selectedType = availableTypes.find((type) => String(type.id) === formData.typeId);
  const fields = selectedType?.fields || [];
  const requiredValidation = {
    name: !formData.name.trim(),
    price: !formData.price.trim() || Number(formData.price) <= 0,
    quantity:
      !formData.quantity.trim() ||
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 1,
    state: !formData.state,
    categoryId: !formData.categoryId,
    subcategoryId: !formData.subcategoryId,
    typeId: !formData.typeId,
    images: images.length === 0,
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Создание объявления</h1>
        <label className={styles.fieldLabel} htmlFor="name">
          Название объявления *
        </label>
        <Input
          required
          id="name"
          className={`bg-white ${submitAttempted && requiredValidation.name ? styles.invalidField : ""}`}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Введите название объявления"
        />
        <label className={styles.fieldLabel} htmlFor="price">
          Цена *
        </label>
        <Input
          required
          id="price"
          className={`bg-white ${submitAttempted && requiredValidation.price ? styles.invalidField : ""}`}
          name="price"
          pattern="[0-9]*"
          type="text"
          value={formData.price}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Введите цену"
        />
        <label className={styles.fieldLabel} htmlFor="quantity">
          Количество *
        </label>
        <Input
          required
          id="quantity"
          className={`bg-white ${submitAttempted && requiredValidation.quantity ? styles.invalidField : ""}`}
          min={1}
          name="quantity"
          pattern="[0-9]*"
          type="text"
          value={formData.quantity}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Введите количество (шт.)"
        />
        <label className={styles.fieldLabel} htmlFor="name">
          Описание товара
        </label>
        <Textarea
          className="bg-white"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Напишите описание для товара"
          rows={5}
        />

        <p>Состояние товара *</p>
        <div
          className={`${styles.checkboxes} ${submitAttempted && requiredValidation.state ? styles.invalidGroup : ""}`}
        >
          <div className={styles.box}>
            <input
              checked={formData.state === "NEW"}
              className={styles.checkbox}
              id="new"
              name="state"
              type="radio"
              onChange={() => handleStateChange("NEW")}
            />
            <label htmlFor="new">Новое</label>
          </div>
          <div className={styles.box}>
            <input
              checked={formData.state === "USED"}
              className={styles.checkbox}
              id="used"
              name="state"
              type="radio"
              onChange={() => handleStateChange("USED")}
            />
            <label htmlFor="used">Б/У</label>
          </div>
        </div>

        <h1 className={styles.blue}>Категория</h1>
        <label className={styles.fieldLabel} htmlFor="categoryId">
          Категория *
        </label>
        <select
          required
          id="categoryId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.categoryId ? styles.invalidField : ""}`}
          name="categoryId"
          value={formData.categoryId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categoryId: e.target.value,
              subcategoryId: "",
              typeId: "",
            }))
          }
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel} htmlFor="subcategoryId">
          Подкатегория *
        </label>
        <select
          required
          id="subcategoryId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.subcategoryId ? styles.invalidField : ""}`}
          disabled={!formData.categoryId}
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              subcategoryId: e.target.value,
              typeId: "",
            }))
          }
        >
          <option value="">Выберите подкатегорию</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel} htmlFor="typeId">
          Тип *
        </label>
        <select
          required
          id="typeId"
          className={`w-full rounded border border-gray-300 bg-white p-2 ${submitAttempted && requiredValidation.typeId ? styles.invalidField : ""}`}
          disabled={!formData.subcategoryId}
          name="typeId"
          value={formData.typeId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              typeId: e.target.value,
            }))
          }
        >
          <option value="">Выберите тип</option>
          {availableTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {fields.length > 0 && (
          <>
            <h1 className={styles.blue}>Дополнительная информация</h1>
            {fields.map((field) => (
              <Input
                key={field.id}
                className="bg-white"
                value={fieldValues[field.id] || ""}
                onChange={(e) =>
                  setFieldValues((prev) => ({
                    ...prev,
                    [field.id]: e.target.value,
                  }))
                }
                placeholder={field.name}
              />
            ))}
          </>
        )}

        <h1 className={styles.green}>Подробности</h1>
      </div>

      <ImageUpload maxImages={8} onImagesChange={handleImagesChange} />
      {submitAttempted && requiredValidation.images ? (
        <div className={styles.invalidHint}>Добавьте хотя бы одно изображение</div>
      ) : null}

      {/* Поле для ссылки на видео */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label className={styles.fieldLabel} htmlFor="videoUrl">
          Ссылка на видео
        </label>
        <Input
          id="videoUrl"
          className="bg-white"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleInputChange}
          placeholder="Ссылка на видео"
        />
      </div>

      <div className={styles.wrapper}>
        <h1 className={styles.orange}>Местоположение</h1>
        <AddressMap
          value={formData.address}
          onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
          onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          className={styles.button}
          disabled={createProductMutation.isPending || createDraftMutation.isPending}
          type="submit"
        >
          {createProductMutation.isPending ? "Создание..." : "Создать объявление"}
        </Button>
        <Button
          className={styles.button}
          disabled={createProductMutation.isPending || createDraftMutation.isPending}
          type="button"
          variant="secondary"
          onClick={handleSaveDraft}
        >
          {createDraftMutation.isPending ? "Сохранение..." : "Сохранить черновик"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductPage;
