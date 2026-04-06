"use client";

import type { Category } from "@/types";
import type { ExtendedProduct } from "@/types/product";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { useDeleteProductMutation, useUpdateProductMutation } from "@/api/hooks";
import { getProductById } from "@/api/requests";
import { AddressMap, Button, Input, Textarea } from "@/components/ui";
import { api } from "@/lib/api/instance";

import styles from "../../create-product/page.module.css";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const { productId } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    state: "",
    address: "",
    videoUrl: "",
  });

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [_coordinates, _setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const updateProductMutation = useUpdateProductMutation(Number(productId));
  const deleteProductMutation = useDeleteProductMutation();

  // Загружаем данные товара
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProductById(Number(productId)),
          api<Category[]>("/category/find-all"),
        ]);

        setProduct(productData);
        setCategories(categoriesData);
        setExistingImages(productData.images || []);

        // Заполняем форму данными товара
        setFormData({
          name: productData.name,
          price: productData.price.toString(),
          description: productData.description || "",
          state: "NEW", // TODO: добавить state в ExtendedProduct
          address: productData.address,
          videoUrl: productData.videoUrl || "",
        });

        // Заполняем fieldValues если они есть
        if (productData.fieldValues && Array.isArray(productData.fieldValues)) {
          const values: Record<string, string> = {};
          productData.fieldValues.forEach((field) => {
            Object.entries(field).forEach(([key, value]) => {
              if (key !== "id") {
                values[key] = String(value);
              }
            });
          });
          setFieldValues(values);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Ошибка загрузки данных товара");
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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
    console.log("=== handleImagesChange CALLED ===");
    console.log("New images to add:", newImages.length);
    console.log(
      "New images details:",
      newImages.map((f) => ({ name: f.name, size: f.size })),
    );

    setImages((prev) => {
      console.log("Previous images count:", prev.length);
      console.log(
        "Previous images:",
        prev.map((f) => ({ name: f.name, size: f.size })),
      );
      const updated = [...prev, ...newImages];
      console.log("Updated images count:", updated.length);
      console.log(
        "Updated images:",
        updated.map((f) => ({ name: f.name, size: f.size })),
      );
      return updated;
    });

    console.log("Current existingImages count:", existingImages.length);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("=== handleImagesChange END ===\n");
  };

  const getTotalImages = () => {
    return existingImages.length + images.length;
  };

  const setAsMainImage = (index: number) => {
    console.log("=== setAsMainImage CALLED ===");
    console.log("Clicked index:", index);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("Existing images count:", existingImages.length);
    console.log("New images count:", images.length);
    console.log("Total images:", getTotalImages());

    setMainImageIndex(index);
    console.log("Set mainImageIndex to:", index);
    console.log("=== setAsMainImage END ===\n");
  };

  const removeImage = (index: number) => {
    console.log("=== removeImage CALLED ===");
    console.log("Index to remove:", index);
    console.log("Current mainImageIndex:", mainImageIndex);
    console.log("Existing images count BEFORE:", existingImages.length);
    console.log("Existing images:", existingImages);
    console.log("New images count BEFORE:", images.length);
    console.log(
      "New images:",
      images.map((f) => ({ name: f.name, size: f.size })),
    );

    const totalExisting = existingImages.length;
    console.log("totalExisting:", totalExisting);

    if (index < totalExisting) {
      console.log("Removing EXISTING image at index:", index);
      const newExisting = existingImages.filter((_, i) => i !== index);
      console.log("New existing count:", newExisting.length);
      setExistingImages(newExisting);
    } else {
      console.log("Removing NEW image");
      const newIndex = index - totalExisting;
      console.log("New image index in array:", newIndex);
      const newImages = images.filter((_, i) => i !== newIndex);
      console.log("New images count after filter:", newImages.length);
      console.log(
        "New images after filter:",
        newImages.map((f) => ({ name: f.name, size: f.size })),
      );
      setImages(newImages);
    }

    // Корректировка основного изображения
    const totalAfterRemove = getTotalImages() - 1;
    console.log("Total after remove:", totalAfterRemove);

    if (index === mainImageIndex && totalAfterRemove > 0) {
      console.log("Removed main image, setting to 0");
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      console.log("Removed image before main, decrementing mainImageIndex");
      setMainImageIndex(mainImageIndex - 1);
    } else if (mainImageIndex >= totalAfterRemove) {
      console.log("mainImageIndex out of bounds, adjusting");
      setMainImageIndex(Math.max(0, totalAfterRemove - 1));
    }
    console.log("=== removeImage END ===\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.price) {
      setError("Пожалуйста, заполните обязательные поля");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Цена должна быть больше нуля");
      return;
    }

    try {
      // Переупорядочиваем изображения так, чтобы основное было первым
      let orderedImages = images;
      if (images.length > 0 && mainImageIndex >= existingImages.length) {
        // Основное изображение - это новое фото
        const newImageIndex = mainImageIndex - existingImages.length;
        orderedImages = [...images];
        const [mainImage] = orderedImages.splice(newImageIndex, 1);
        orderedImages = [mainImage, ...orderedImages];
        console.log(
          "Reordered new images, main at index 0:",
          orderedImages.map((f) => f.name),
        );
      }

      await updateProductMutation.mutateAsync(
        {
          name: formData.name,
          price: Number(formData.price),
          state: formData.state as "NEW" | "USED",
          description: formData.description,
          address: formData.address,
          images: orderedImages.length > 0 ? orderedImages : undefined,
          fieldValues: Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
          videoUrl: formData.videoUrl,
        },
        {
          onSuccess: () => {
            router.push("/profile/my-products");
          },
          onError: (error: any) => {
            console.error("Ошибка обновления объявления:", error);
            const errorMessage =
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Ошибка при обновлении объявления";
            setError(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage);
          },
        },
      );
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const _handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить это объявление?")) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(Number(productId), {
        onSuccess: () => {
          router.push("/profile/my-products");
        },
        onError: (error: any) => {
          console.error("Ошибка удаления объявления:", error);
          setError("Ошибка при удалении объявления");
        },
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-500">Товар не найден</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.wrapper}>
        <h1 className={styles.purple}>Редактирование объявления</h1>
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

        <h1 className={styles.blue}>Дополнительная информация</h1>
        {product.fieldValues &&
          Array.isArray(product.fieldValues) &&
          product.fieldValues.map((field) =>
            Object.entries(field)
              .filter(([key]) => key !== "id")
              .map(([fieldName, value]) => (
                <Input
                  key={`${field.id}-${fieldName}`}
                  className="bg-white"
                  value={fieldValues[fieldName] || String(value)}
                  onChange={(e) =>
                    setFieldValues((prev) => ({
                      ...prev,
                      [fieldName]: e.target.value,
                    }))
                  }
                  placeholder={fieldName}
                />
              )),
          )}

        <h1 className={styles.green}>
          Изображения (максимум {8}, добавлено: {getTotalImages()})
        </h1>
        <div className="flex flex-wrap gap-3">
          {/* Существующие изображения */}
          {existingImages.map((img, idx) => {
            const globalIndex = idx;
            return (
              <div
                key={`existing-${img}-${idx}`}
                className={`relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-xl border-2 transition-colors md:h-[200px] md:w-[200px] ${
                  globalIndex === mainImageIndex
                    ? "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                    : "border-transparent hover:border-blue-500"
                }`}
                tabIndex={0}
                onClick={() => setAsMainImage(globalIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAsMainImage(globalIndex);
                  }
                }}
                role="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Фото ${idx + 1}`}
                  className="h-full w-full rounded-xl object-cover"
                  src={img}
                />
                <button
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs text-white hover:bg-red-600/90"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(globalIndex);
                  }}
                >
                  🗑️
                </button>
                {globalIndex === mainImageIndex && (
                  <div className="absolute bottom-2 left-2 z-10 rounded bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                    Основное
                  </div>
                )}
              </div>
            );
          })}
          {/* Новые изображения */}
          {images.map((img, idx) => {
            const globalIndex = existingImages.length + idx;
            const uniqueKey = `new-${globalIndex}-${img.name}-${img.size}-${img.lastModified}`;
            return (
              <div
                key={uniqueKey}
                className={`relative h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-xl border-2 transition-colors md:h-[200px] md:w-[200px] ${
                  globalIndex === mainImageIndex
                    ? "border-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                    : "border-blue-400 hover:border-blue-500"
                }`}
                tabIndex={0}
                onClick={() => setAsMainImage(globalIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAsMainImage(globalIndex);
                  }
                }}
                role="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Новое фото ${idx + 1}`}
                  className="h-full w-full rounded-xl object-cover"
                  src={URL.createObjectURL(img)}
                />
                <button
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-xs text-white hover:bg-red-600/90"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(globalIndex);
                  }}
                >
                  🗑️
                </button>
                {globalIndex === mainImageIndex && (
                  <div className="absolute bottom-2 left-2 z-10 rounded bg-emerald-500/90 px-2 py-1 text-xs font-medium text-white">
                    Основное
                  </div>
                )}
                <div className="absolute right-2 bottom-2 z-10 rounded bg-blue-500/90 px-2 py-1 text-xs font-medium text-white">
                  Новое
                </div>
              </div>
            );
          })}
          {/* Кнопка добавления фото */}
          {getTotalImages() < 8 && (
            <div
              className="flex h-[150px] w-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 md:h-[200px] md:w-[200px]"
              tabIndex={0}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.multiple = true;
                input.onchange = (e) => {
                  const files = Array.from((e.target as HTMLInputElement).files || []);
                  if (files.length > 0) {
                    handleImagesChange(files);
                  }
                };
                input.click();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.multiple = true;
                  input.onchange = (ev) => {
                    const files = Array.from((ev.target as HTMLInputElement).files || []);
                    if (files.length > 0) {
                      handleImagesChange(files);
                    }
                  };
                  input.click();
                }
              }}
              role="button"
            >
              <div className="text-4xl text-gray-400 md:text-5xl">📷</div>
              <span className="text-center text-xs font-medium text-gray-500 md:text-sm">
                Добавить фото
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Input
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
          onCoordinatesChange={(lat, lng) => _setCoordinates({ lat, lng })}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.wrapper}>
        <div className="flex gap-4">
          <Button
            className={styles.button}
            disabled={updateProductMutation.isPending}
            type="submit"
          >
            {updateProductMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditProductPage;
