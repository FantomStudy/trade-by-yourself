"use client";

import type { Category } from "@/api/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { getCategories } from "@/api/categories";
import { createProduct } from "@/api/products";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { ProductImageEditor } from "../_components/ProductImageEditor";
import styles from "./page.module.css";

// Спорный динамический импорт
const AddressMap = dynamic(
  () =>
    import("@/app/profile/products/_components/AddressMap").then(
      (mod) => mod.AddressMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapLoading}>
        <div className={styles.mapLoadingContent}>
          <div className={styles.mapLoadingSpinner}></div>
          <p className={styles.mapLoadingText}>Загрузка карты...</p>
        </div>
      </div>
    ),
  },
);

interface FormValues {
  name: string;
  price: string;
  description: string;
  state: "NEW" | "USED";
  address: string;
  categoryId: string;
  subcategoryId: string;
  typeId: string;
  images: File[];
  mainImageIndex: number;
  videoUrl: string;
  coordinates: {
    lng: number;
    lat: number;
  };

  // Дополнительные поля конкретной категории
  fieldValues: Record<string, string>;
}

const schema = z.object({
  name: z.string().trim().min(1, "Введите название"),
  price: z
    .string()
    .min(1, "Введите цену")
    .refine((v) => Number(v) > 0, "Цена должна быть больше 0"),

  description: z
    .string()
    .trim()
    .min(10, "Описание должно содержать минимум 10 символов"),

  state: z.enum(["NEW", "USED"]),

  address: z.string().trim().min(1, "Укажите адрес"),

  categoryId: z.string().min(1, "Выберите категорию"),
  subcategoryId: z.string().min(1, "Выберите подкатегорию"),
  typeId: z.string().min(1, "Выберите тип"),

  videoUrl: z
    .string()
    .refine(
      (value) => !value || z.url().safeParse(value).success,
      "Введите корректную ссылку",
    ),
  images: z.array(z.instanceof(File)).min(1, "Добавьте хотя бы один файл"),
  mainImageIndex: z.number(),

  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  fieldValues: z.record(z.string(), z.string().min(1, "Заполните это поле")),
});

const CreateProductPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      categoryId: "",
      description: "",
      state: "NEW",
      fieldValues: {},
      name: "",
      price: "",
      subcategoryId: "",
      typeId: "",
      videoUrl: "",
      images: [],
      mainImageIndex: 0,
      coordinates: { lat: 0, lng: 0 },
    },
  });

  useEffect(() => {
    let mounted = true;

    getCategories()
      .then((data) => {
        if (mounted) setCategories(data);
      })
      .catch((e) => {
        if (!mounted) return;
        setError("root", {
          type: "load",
          message: "Ошибка загрузки категорий",
        });
        console.error("Ошибка загрузки категорий", e);
      });

    return () => {
      mounted = false;
    };
  }, [setError]);

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
      setError("root", {
        type: "server",
        message: Array.isArray(message) ? message.join(", ") : message,
      });
    },
  });

  const state = watch("state");
  const images = watch("images");
  const address = watch("address");
  const mainImageIndex = watch("mainImageIndex");
  const categoryId = watch("categoryId");
  const subCategoryId = watch("subcategoryId");
  const typeId = watch("typeId");

  const availableSubcategories =
    categories.find((el) => el.id === Number(categoryId))?.subCategories || [];

  const availableTypes =
    availableSubcategories.find((el) => el.id === Number(subCategoryId))
      ?.subcategoryTypes || [];

  const availableFields =
    availableTypes.find((el) => el.id === Number(typeId))?.fields || [];

  const onSubmit = handleSubmit(async (data: FormValues) => {
    clearErrors("root");

    let orderedImages = [...images];

    if (mainImageIndex > 0) {
      const [mainImage] = orderedImages.splice(mainImageIndex, 1);
      orderedImages = mainImage ? [mainImage, ...orderedImages] : orderedImages;
    }

    try {
      await createProductMutation.mutateAsync({
        name: data.name,
        price: Number(data.price),
        state: data.state,
        categoryId: Number(data.categoryId),
        subcategoryId: Number(data.subcategoryId),
        typeId: Number(data.typeId),
        description: data.description,
        address: data.address,
        videoUrl: data.videoUrl,
        images: orderedImages,
        fieldValues:
          data.fieldValues && Object.keys(data.fieldValues).length > 0
            ? Object.fromEntries(
                Object.entries(data.fieldValues).filter(
                  ([, v]) => v?.trim() !== "",
                ),
              )
            : undefined,
        ...{
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lng,
        },
      });
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка";

      setError("root", {
        type: "server",
        message: Array.isArray(message) ? message.join(", ") : message,
      });
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          <h1 className={styles.purple}>Создание объявления</h1>

          <Field>
            <Field.Label htmlFor="product-name">Название</Field.Label>
            <Input
              className={errors.name && styles.inputError}
              id="product-name"
              {...register("name")}
              placeholder="Например, iPhone 15 Pro 256 GB"
            />
            <Field.Error className={styles.errorText}>
              {errors.name?.message}
            </Field.Error>
          </Field>

          <div className={styles.row}>
            <Field>
              <Field.Label htmlFor="product-price">Цена</Field.Label>
              <Input
                className={errors.price && styles.inputError}
                id="product-price"
                inputMode="numeric"
                placeholder="0"
                pattern="[0-9]*"
                {...register("price")}
              />
              <Field.Error className={styles.errorText}>
                {errors.price?.message}
              </Field.Error>
            </Field>

            <Field>
              <Field.Label id="product-state">Состояние</Field.Label>
              <div className={styles.segmented} aria-labelledby="product-state">
                {(
                  [
                    {
                      label: "Новое",
                      value: "NEW",
                      className: styles.segmentNew,
                    },
                    {
                      label: "Б/у",
                      value: "USED",
                      className: styles.segmentUsed,
                    },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={clsx(
                      styles.segment,
                      option.className,
                      state === option.value && styles.segmentActive,
                    )}
                    onClick={() => setValue("state", option.value)}
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
              className={errors.description && styles.inputError}
              id="product-description"
              placeholder="Коротко и по делу: состояние, комплектация, особенности."
              rows={6}
              {...register("description")}
            />
            <Field.Error className={styles.errorText}>
              {errors.description?.message}
            </Field.Error>
          </Field>
        </section>

        <section className={styles.section}>
          <h1 className={styles.blue}>Категория</h1>

          <Field>
            <Field.Label htmlFor="product-category">Категория</Field.Label>
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setValue("categoryId", value as string, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                clearErrors("subcategoryId");
                clearErrors("typeId");
                setValue("subcategoryId", "", { shouldValidate: false });
                setValue("typeId", "", { shouldValidate: false });
              }}
            >
              <Select.Trigger
                className={errors.categoryId && styles.inputError}
                id="product-category"
              >
                <Select.Value placeholder="Выберите категорию">
                  {
                    categories.find((value) => String(value.id) === categoryId)
                      ?.name
                  }
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Выберите категорию</Select.Item>
                {categories.map((category) => (
                  <Select.Item key={category.id} value={String(category.id)}>
                    {category.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Field.Error className={styles.errorText}>
              {errors.categoryId?.message}
            </Field.Error>
          </Field>

          <Field>
            <Field.Label htmlFor="product-subcategory">
              Подкатегория
            </Field.Label>
            <Select
              value={subCategoryId}
              onValueChange={(value) => {
                setValue("subcategoryId", value as string, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setValue("typeId", "", { shouldValidate: false });
                clearErrors("typeId");
              }}
              disabled={!categoryId}
            >
              <Select.Trigger
                className={errors.subcategoryId && styles.inputError}
                id="product-subcategory"
              >
                <Select.Value placeholder="Выберите подкатегорию">
                  {
                    availableSubcategories.find(
                      (value) => String(value.id) === subCategoryId,
                    )?.name
                  }
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Выберите подкатегорию</Select.Item>
                {availableSubcategories.map((subcategory) => (
                  <Select.Item
                    key={subcategory.id}
                    value={String(subcategory.id)}
                  >
                    {subcategory.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Field.Error className={styles.errorText}>
              {errors.subcategoryId?.message}
            </Field.Error>
          </Field>

          <Field>
            <Field.Label htmlFor="product-type">Тип</Field.Label>
            <Select
              value={typeId}
              onValueChange={(value) => {
                setValue("typeId", value as string, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
                setValue("fieldValues", {});
                clearErrors("fieldValues");
              }}
              disabled={!subCategoryId}
            >
              <Select.Trigger
                className={errors.typeId && styles.inputError}
                id="product-type"
              >
                <Select.Value placeholder="Выберите тип">
                  {
                    availableTypes.find((value) => String(value.id) === typeId)
                      ?.name
                  }
                </Select.Value>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Выберите тип</Select.Item>
                {availableTypes.map((type) => (
                  <Select.Item key={type.id} value={String(type.id)}>
                    {type.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Field.Error className={styles.errorText}>
              {errors.typeId?.message}
            </Field.Error>
          </Field>

          <div className={styles.fieldGrid}>
            {availableFields.map((field) => (
              <Field key={field.id}>
                <Field.Label htmlFor={`field-${field.id}`}>
                  {field.name}
                </Field.Label>
                <Input
                  id={`field-${field.id}`}
                  {...register(`fieldValues.${field.id}`)}
                  placeholder={field.name}
                  className={
                    errors.fieldValues?.[field.id] && styles.inputError
                  }
                />
                <Field.Error>
                  {errors.fieldValues?.[field.id]?.message}
                </Field.Error>
              </Field>
            ))}
          </div>
        </section>

        <section className={styles.mediaBlock}>
          <h1 className={styles.orange}>Фотографии</h1>
          <ProductImageEditor
            newImages={images}
            mainImageIndex={mainImageIndex}
            maxImages={8}
            onAddImages={(files) =>
              files.every((file) => file.type.startsWith("image/"))
                ? setValue("images", [...images, ...files], {
                    shouldValidate: true,
                  })
                : setError("images", {
                    message: "Разрешены только изображения",
                  })
            }
            onRemoveImage={(index) => {
              const nextImages = images.filter((_, i) => i !== index);
              const nextTotal = nextImages.length;
              let nextIndex;

              if (index === mainImageIndex || nextTotal <= 0) {
                nextIndex = 0;
              } else if (index < mainImageIndex) {
                nextIndex = mainImageIndex - 1;
              } else {
                nextIndex = mainImageIndex;
              }

              setValue("mainImageIndex", nextIndex);
              setValue("images", nextImages, { shouldValidate: true });
            }}
            onSelectMainImage={(index) => setValue("mainImageIndex", index)}
          />
          <Field.Error className={styles.errorText}>
            {errors.images?.message}
          </Field.Error>
        </section>

        <section className={styles.section}>
          <h1 className={styles.green}>Подробности</h1>

          <Field>
            <Field.Label htmlFor="videoUrl">Видео</Field.Label>
            <Input
              className={errors.videoUrl && styles.inputError}
              id="videoUrl"
              {...register("videoUrl")}
              placeholder="https://youtube.com/..."
            />
            <Field.Error className={styles.errorText}>
              {errors.videoUrl?.message}
            </Field.Error>
          </Field>

          <Field>
            <Field.Label>Адрес</Field.Label>
            <input type="hidden" {...register("address")} />
            <div className={errors.address && styles.mapError}>
              <AddressMap
                value={address}
                onChange={(nextAddress) =>
                  setValue("address", nextAddress, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                onCoordinatesChange={(lat, lng) =>
                  setValue("coordinates", { lat, lng })
                }
              />
            </div>
            <p className={styles.caption}>
              Кликните на карту, чтобы выбрать местоположение
            </p>
            <Field.Error className={styles.errorText}>
              {errors.address?.message}
            </Field.Error>
          </Field>
        </section>
      </div>

      {errors.root && <div className={styles.error}>{errors.root.message}</div>}

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
