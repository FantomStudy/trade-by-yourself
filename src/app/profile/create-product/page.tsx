"use client";

import type { Category } from "@/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AddressMap,
  Button,
  ImageUpload,
  Input,
  Textarea,
} from "@/components/ui";
import { api } from "@/lib/api/instance";
import { useCreateProduct } from "@/lib/hooks";

import styles from "./page.module.css";

const CreateProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    state: "",
    address: "",
    categoryId: "",
    subcategoryId: "",
    typeId: "",
  });

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const createProductMutation = useCreateProduct({
    onSuccess: (data) => {
      console.log("Объявление создано:", data);
      setFormData({
        name: "",
        price: "",
        description: "",
        state: "",
        address: "",
        categoryId: "",
        subcategoryId: "",
        typeId: "",
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
        setError(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
        );
      } else {
        setError(
          `Ошибка при создании объявления: ${error.message || "Неизвестная ошибка"}`,
        );  
      }
    },
  });

  useEffect(() => {
    api<Category[]>("/category/find-all").then((response) => {
      setCategories(response);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Для поля цены разрешаем только цифры
    if (name === "price") {
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

    // Валидация
    if (
      !formData.name ||
      !formData.price ||
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

    if (images.length === 0) {
      setError("Добавьте хотя бы одно изображение");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: formData.name,
        price: Number(formData.price),
        state: formData.state as "NEW" | "USED",
        categoryId: Number(formData.categoryId),
        subcategoryId: Number(formData.subcategoryId),
        typeId: Number(formData.typeId),
        description: formData.description,
        address: formData.address,
        images,
        fieldValues,
        ...(coordinates && {
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });
      router.replace("/profile/my-products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Получаем доступные подкатегории
  const selectedCategory = categories.find(
    (cat) => String(cat.id) === formData.categoryId,
  );
  const availableSubcategories = selectedCategory?.subCategories || [];

  // Получаем доступные типы подкатегорий
  const selectedSubcategory = availableSubcategories.find(
    (sub) => String(sub.id) === formData.subcategoryId,
  );
  const availableTypes = selectedSubcategory?.subcategoryTypes || [];

  // Получаем поля для выбранного типа
  const selectedType = availableTypes.find(
    (type) => String(type.id) === formData.typeId,
  );
  const fields = selectedType?.fields || [];

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Создание объявления</h1>
        <Input
          required
          className="bg-white"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Название объявления"
        />
        <Input
          required
          className="bg-white"
          name="price"
          pattern="[0-9]*"
          type="text"
          value={formData.price}
          inputMode="numeric"
          onChange={handleInputChange}
          placeholder="Цена"
        />
        <Textarea
          className="bg-white"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Описание товара"
          rows={5}
        />

        <p>Выберите тип товара *</p>
        <div className={styles.checkboxes}>
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
        <select
          required
          className="w-full rounded border border-gray-300 bg-white p-2"
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

        <select
          required
          className="w-full rounded border border-gray-300 bg-white p-2"
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

        <select
          required
          className="w-full rounded border border-gray-300 bg-white p-2"
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

      <div className={styles.wrapper}>
        <h1 className={styles.orange}>Местоположение</h1>
        <AddressMap
          value={formData.address}
          onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
          onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button
        className={styles.button}
        disabled={createProductMutation.isPending}
        type="submit"
      >
        {createProductMutation.isPending ? "Создание..." : "Создать объявление"}
      </Button>
    </form>
  );
};

export default CreateProductPage;
