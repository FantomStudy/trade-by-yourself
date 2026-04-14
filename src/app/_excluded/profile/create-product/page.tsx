"use client";

import type { Category } from "@/api/categories";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/instance";
import { createProduct } from "@/api/products";
import { AddressMap, Button, Field, Input, ProductImageEditor, Textarea } from "@/components/ui";
import styles from "./page.module.css";

const CreateProductPage = () => {
  const router = useRouter();
  const stateFieldId = useId();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    state: "NEW" as "" | "NEW" | "USED",
    address: "",
    categoryId: "",
    subcategoryId: "",
    typeId: "",
    videoUrl: "",
  });
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    api<Category[]>("/category/find-all").then(setCategories);
  }, []);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success(
        "Товар отправлен на модерацию. После проверки он появится в вашем списке объявлений.",
      );
      router.replace("/profile/products");
      router.refresh();
    },
    onError: (
      mutationError: Error & {
        response?: { data?: { message?: string | string[]; error?: string } };
      },
    ) => {
      const message =
        mutationError.response?.data?.message ||
        mutationError.response?.data?.error ||
        mutationError.message;
      setError(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === formData.categoryId),
    [categories, formData.categoryId],
  );
  const availableSubcategories = selectedCategory?.subCategories ?? [];

  const selectedSubcategory = useMemo(
    () =>
      availableSubcategories.find(
        (subcategory) => String(subcategory.id) === formData.subcategoryId,
      ),
    [availableSubcategories, formData.subcategoryId],
  );
  const availableTypes = selectedSubcategory?.subcategoryTypes ?? [];

  const selectedType = useMemo(
    () => availableTypes.find((type) => String(type.id) === formData.typeId),
    [availableTypes, formData.typeId],
  );
  const availableFields = selectedType?.fields ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

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

    let orderedImages = [...images];
    if (mainImageIndex > 0) {
      const [mainImage] = orderedImages.splice(mainImageIndex, 1);
      orderedImages = mainImage ? [mainImage, ...orderedImages] : orderedImages;
    }

    await createProductMutation.mutateAsync({
      name: formData.name,
      price: Number(formData.price),
      state: formData.state,
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      typeId: Number(formData.typeId),
      description: formData.description,
      address: formData.address,
      images: orderedImages,
      fieldValues:
        Object.keys(fieldValues).length > 0
          ? Object.fromEntries(
              Object.entries(fieldValues).filter(([, value]) => value.trim() !== ""),
            )
          : undefined,
      videoUrl: formData.videoUrl,
      ...(coordinates && {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          <h1 className={styles.purple}>Создание объявления</h1>

          <Field>
            <Field.Label htmlFor="product-name">Название</Field.Label>
            <Input
              id="product-name"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Например, iPhone 15 Pro 256 GB"
            />
          </Field>

          <div className={styles.row}>
            <Field>
              <Field.Label htmlFor="product-price">Цена</Field.Label>
              <Input
                id="product-price"
                value={formData.price}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: event.target.value.replace(/\D/g, ""),
                  }))
                }
              />
            </Field>

            <Field>
              <Field.Label id={stateFieldId}>Состояние</Field.Label>
              <div className={styles.segmented} aria-labelledby={stateFieldId}>
                {[
                  { label: "Новое", value: "NEW", tone: styles.segmentNew },
                  { label: "Б/у", value: "USED", tone: styles.segmentUsed },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={clsx(
                      styles.segment,
                      option.tone,
                      formData.state === option.value && styles.segmentActive,
                    )}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, state: option.value as "NEW" | "USED" }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field>
            <Field.Label htmlFor="product-description">Описание</Field.Label>
            <Textarea
              id="product-description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Коротко и по делу: состояние, комплектация, особенности."
              rows={6}
            />
          </Field>

          <div className={styles.mediaBlock}>
            <h1 className={styles.orange}>Фотографии</h1>
            <ProductImageEditor
              newImages={images}
              mainImageIndex={mainImageIndex}
              maxImages={8}
              onAddImages={(files) => setImages((current) => [...current, ...files])}
              onRemoveImage={(index) => {
                setImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
                setMainImageIndex((current) => {
                  const nextTotal = images.length - 1;
                  if (nextTotal <= 0) return 0;
                  if (index === current) return 0;
                  if (index < current) return current - 1;
                  return current >= nextTotal ? nextTotal - 1 : current;
                });
              }}
              onSelectMainImage={setMainImageIndex}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h1 className={styles.blue}>Категория</h1>

          <Field>
            <Field.Label htmlFor="category">Категория</Field.Label>
            <select
              id="category"
              className={styles.select}
              value={formData.categoryId}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: event.target.value,
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
          </Field>

          <Field>
            <Field.Label htmlFor="subcategory">Подкатегория</Field.Label>
            <select
              id="subcategory"
              className={styles.select}
              disabled={!formData.categoryId}
              value={formData.subcategoryId}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  subcategoryId: event.target.value,
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
          </Field>

          <Field>
            <Field.Label htmlFor="type">Тип</Field.Label>
            <select
              id="type"
              className={styles.select}
              disabled={!formData.subcategoryId}
              value={formData.typeId}
              onChange={(event) => setFormData((prev) => ({ ...prev, typeId: event.target.value }))}
            >
              <option value="">Выберите тип</option>
              {availableTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field>

          {availableFields.length > 0 && (
            <div className={styles.fieldGrid}>
              {availableFields.map((field) => (
                <Field key={field.id}>
                  <Field.Label htmlFor={`field-${field.id}`}>{field.name}</Field.Label>
                  <Input
                    id={`field-${field.id}`}
                    value={fieldValues[String(field.id)] ?? ""}
                    onChange={(event) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [String(field.id)]: event.target.value,
                      }))
                    }
                    placeholder={field.name}
                  />
                </Field>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h1 className={styles.green}>Подробности</h1>

          <Field>
            <Field.Label htmlFor="videoUrl">Видео</Field.Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, videoUrl: event.target.value }))
              }
              placeholder="https://youtube.com/..."
            />
          </Field>

          <Field>
            <Field.Label>Адрес</Field.Label>
            <AddressMap
              value={formData.address}
              onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
              onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
            />
          </Field>
        </section>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button className={styles.button} disabled={createProductMutation.isPending} type="submit">
        {createProductMutation.isPending ? "Создание..." : "Создать объявление"}
      </Button>
    </form>
  );
};

export default CreateProductPage;
