"use client";

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
        brand: "",
        model: "",
        address: "",
        categoryId: "",
        subcategoryId: "",
      });
      setImages([]);
      setCoordinates(null);
      setError(null);
      // Можно добавить уведомление или редирект
    },
    onError: (error) => {
      setError(`Ошибка при создании объявления: ${error.message}`);
    },
  });

  useEffect(() => {
    api<Array<{ id: number; name: string }>>("/category/all-categories").then(
      (response) => {
        setCategories(
          response.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
          })),
        );
      },
    );
    api<Array<{ id: number; name: string; categoryId: number }>>(
      "/category/all-subcategories",
    ).then((response) => {
      setSubcategories(response);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    createProductMutation.mutate({
      name: formData.name,
      price: Number(formData.price),
      state: formData.state as "new" | "used",
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      description: formData.description,
      brand: formData.brand,
      model: formData.model,
      address: formData.address,
      images,
      ...(coordinates && {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }),
    });
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
          value={formData.price}
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
              subcategoryId: "", // Сброс подкатегории при смене категории
            }))
          }
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
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
            setFormData((prev) => ({ ...prev, subcategoryId: e.target.value }))
          }
        >
          <option value="">Выберите подкатегорию</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.value} value={subcategory.value}>
              {subcategory.label}
            </option>
          ))}
        </select>

        <h1 className={styles.blue}>Дополнительная информация</h1>
        <Input
          className="bg-white"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Бренд"
        />
        <Input
          className="bg-white"
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
