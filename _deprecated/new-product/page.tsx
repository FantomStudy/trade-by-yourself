"use client";

import { useEffect, useState } from "react";

import { Button, Input } from "@/components/ui";
import {
  ImageUpload,
  Select,
  TextArea,
} from "@/features/deprecated/components";
import { createProduct } from "@/features/deprecated/utils";
import { api } from "@/lib/api/instance";

import styles from "./page.module.css";

const AddCard = () => {
  const [categories, setCategories] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string; categoryId: number }>
  >([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    state: "",
    brand: "",
    model: "",
    address: "",
    categoryId: "",
    subcategoryId: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Array<{ id: number; name: string }>>("/category/all-categories")
      .then((response) => {
        setCategories(
          response.data.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
          })),
        );
      });
    api
      .get<
        Array<{ id: number; name: string; categoryId: number }>
      >("/category/all-subcategories")
      .then((response) => {
        setSubcategories(response.data);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Сбросить подкатегорию при изменении категории
    if (name === "categoryId") {
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
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
      !formData.subcategoryId
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createProduct({
        name: formData.name,
        price: Number(formData.price),
        state: formData.state,
        categoryId: Number(formData.categoryId),
        subcategoryId: Number(formData.subcategoryId),
        description: formData.description,
        brand: formData.brand,
        model: formData.model,
        address: formData.address,
        images,
      });

      console.log("Объявление создано:", result);

      // Успешно создано - можно перенаправить пользователя
      // Можно добавить уведомление через ваш UI, например, через toast
      // alert("Объявление успешно создано!");

      // Очистить форму
      setFormData({
        name: "",
        price: "",
        description: "",
        state: "",
        brand: "",
        model: "",
        address: "",
        categoryId: "",
        subcategoryId: "",
      });
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const availableSubcategories = formData.categoryId
    ? subcategories
        .filter((sub) => String(sub.categoryId) === formData.categoryId)
        .map((sub) => ({ value: String(sub.id), label: sub.name }))
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Создание объявления</h1>
        <Input
          required
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Название объявления"
        />
        <Input
          required
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Цена"
        />
        <TextArea
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
              type="radio"
              checked={formData.state === "NEW"}
              className={styles.checkbox}
              id="new"
              name="state"
              onChange={() => handleStateChange("NEW")}
            />
            <label htmlFor="new">Новое</label>
          </div>
          <div className={styles.box}>
            <input
              type="radio"
              checked={formData.state === "USED"}
              className={styles.checkbox}
              id="used"
              name="state"
              onChange={() => handleStateChange("USED")}
            />
            <label htmlFor="used">Б/У</label>
          </div>
        </div>

        <h1 className={styles.blue}>Категория</h1>
        <Select
          required
          name="categoryId"
          value={formData.categoryId}
          onChange={handleSelectChange}
          options={categories}
          placeholder="Выберите категорию"
        />
        <Select
          required
          disabled={!formData.categoryId}
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleSelectChange}
          options={availableSubcategories}
          placeholder="Выберите подкатегорию"
        />

        <h1 className={styles.blue}>Дополнительная информация</h1>
        <Input
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Бренд"
        />
        <Input
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          placeholder="Модель"
        />

        <h1 className={styles.green}>Подробности</h1>
      </div>
      <ImageUpload maxImages={8} onImagesChange={handleImagesChange} />

      <div className={styles.wrapper}>
        <h1 className={styles.orange}>Местоположение</h1>
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Введите адрес"
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Создание..." : "Создать объявление"}
      </Button>
    </form>
  );
};

export default AddCard;
