"use client";

import type { Category } from "@/types";
import type { ExtendedProduct } from "@/types/product";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/api/hooks";
import { getProductById } from "@/api/requests";
import {
  AddressMap,
  Button,
  ImageUpload,
  Input,
  Textarea,
} from "@/components/ui";
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
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
    setImages(newImages);
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
      await updateProductMutation.mutateAsync(
        {
          name: formData.name,
          price: Number(formData.price),
          state: formData.state as "NEW" | "USED",
          description: formData.description,
          address: formData.address,
          images: images.length > 0 ? images : undefined,
          fieldValues:
            Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
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
            setError(
              Array.isArray(errorMessage)
                ? errorMessage.join(", ")
                : errorMessage,
            );
          },
        },
      );
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async () => {
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

        <h1 className={styles.green}>Изображения</h1>
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600">Текущие изображения:</p>
          <div className="flex flex-wrap gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                alt={`Product ${idx + 1}`}
                className="h-20 w-20 rounded object-cover"
                src={img}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-600">
          Новые изображения будут добавлены к существующим
        </p>
        <ImageUpload maxImages={8} onImagesChange={handleImagesChange} />
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
          onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
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
            {updateProductMutation.isPending
              ? "Сохранение..."
              : "Сохранить изменения"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditProductPage;
