"use client";

import { useState } from "react";
import { Input, ImageUpload, TextArea, Select, Button } from "@/components/ui";
import { createProduct } from "@/utils/api";
import styles from "./page.module.css";

const categories = [
  { value: "1", label: "Электроника" },
  { value: "2", label: "Одежда" },
  { value: "3", label: "Мебель" },
  { value: "4", label: "Спорт и отдых" },
  { value: "5", label: "Детские товары" },
  { value: "6", label: "Для дома" },
];

const subcategories: Record<string, Array<{ value: string; label: string }>> = {
  "1": [
    { value: "1", label: "Телефоны" },
    { value: "2", label: "Компьютеры" },
    { value: "3", label: "Телевизоры" },
    { value: "4", label: "Аудиотехника" },
  ],
  "2": [
    { value: "5", label: "Мужская одежда" },
    { value: "6", label: "Женская одежда" },
    { value: "7", label: "Обувь" },
    { value: "8", label: "Аксессуары" },
  ],
  "3": [
    { value: "9", label: "Для спальни" },
    { value: "10", label: "Для кухни" },
    { value: "11", label: "Для гостиной" },
    { value: "12", label: "Для офиса" },
  ],
  "4": [
    { value: "13", label: "Фитнес" },
    { value: "14", label: "Активный отдых" },
    { value: "15", label: "Велосипеды" },
  ],
  "5": [
    { value: "16", label: "Игрушки" },
    { value: "17", label: "Детская одежда" },
    { value: "18", label: "Коляски" },
  ],
  "6": [
    { value: "19", label: "Кухонная утварь" },
    { value: "20", label: "Декор" },
    { value: "21", label: "Инструменты" },
  ],
};

const AddCard = () => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        images: images,
      });

      console.log("Объявление создано:", result);

      // Успешно создано - можно перенаправить пользователя
      alert("Объявление успешно создано!");

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
    ? subcategories[formData.categoryId] || []
    : [];

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Создание объявления</h1>
        <Input
          name="name"
          placeholder="Название объявления"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          name="price"
          placeholder="Цена"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <TextArea
          name="description"
          placeholder="Описание товара"
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
        />

        <p>Выберите тип товара *</p>
        <div className={styles.checkboxes}>
          <div className={styles.box}>
            <input
              type="radio"
              id="new"
              name="state"
              className={styles.checkbox}
              checked={formData.state === "new"}
              onChange={() => handleStateChange("new")}
            />
            <label htmlFor="new">Новое</label>
          </div>
          <div className={styles.box}>
            <input
              type="radio"
              id="used"
              name="state"
              className={styles.checkbox}
              checked={formData.state === "used"}
              onChange={() => handleStateChange("used")}
            />
            <label htmlFor="used">Б/У</label>
          </div>
        </div>

        <h1 className={styles.blue}>Категория</h1>
        <Select
          name="categoryId"
          placeholder="Выберите категорию"
          options={categories}
          value={formData.categoryId}
          onChange={handleSelectChange}
          required
        />
        <Select
          name="subcategoryId"
          placeholder="Выберите подкатегорию"
          options={availableSubcategories}
          value={formData.subcategoryId}
          onChange={handleSelectChange}
          disabled={!formData.categoryId}
          required
        />

        <h1 className={styles.blue}>Дополнительная информация</h1>
        <Input
          name="brand"
          placeholder="Бренд"
          value={formData.brand}
          onChange={handleInputChange}
        />
        <Input
          name="model"
          placeholder="Модель"
          value={formData.model}
          onChange={handleInputChange}
        />

        <h1 className={styles.green}>Подробности</h1>
      </div>
      <ImageUpload maxImages={8} onImagesChange={handleImagesChange} />

      <div className={styles.wrapper}>
        <h1 className={styles.orange}>Местоположение</h1>
        <Input
          name="address"
          placeholder="Введите адрес"
          value={formData.address}
          onChange={handleInputChange}
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
