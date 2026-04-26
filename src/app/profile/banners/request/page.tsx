"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button, Field, Input, Textarea, Typography } from "@/components/ui";
import styles from "./page.module.css";

const bannerPlaces = [
  {
    id: "PRODUCT_FEED",
    name: "Лента товаров",
    size: "320x400",
    price: 500,
  },
  {
    id: "profile",
    name: "Профиль",
    size: "660x400",
    price: 800,
  },
  {
    id: "chats",
    name: "Чаты",
    size: "1280x400",
    price: 1200,
  },
  {
    id: "favorites",
    name: "Избранное",
    size: "1280x200",
    price: 1000,
  },
];

interface FormValues {
  name: string;
  url: string;
  image: File | null;
  placeId: string;
  daysCount: number;
  comment: string;
}

const schema = z.object({
  name: z.string().trim().min(1, "Введите название"),
  placeId: z.string().min(1, "Выберите место размещения"),
  url: z.string().refine((value) => z.url().safeParse(value).success, "Введите корректную ссылку"),
  daysCount: z.number().min(1, "Некорректное количество дней"),
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file, "Выберите изображение")
    .refine((file) => file && file.size <= 1024 * 1024 * 5, `Максимальный размер файла 5MB`)
    .refine(
      (file) => file && ["image/png", "image/jpeg"].includes(file.type),
      "Неверный формат изображения, требуется .png или .jpeg",
    ),
  comment: z.string(),
});

const BannerRequestPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      placeId: "",
      url: "",
      image: null,
      comment: "",
      daysCount: 0,
    },
  });

  const image = watch("image");
  const placeId = watch("placeId");
  const daysCount = watch("daysCount");

  const onSubmit = handleSubmit(async (_: FormValues) => {
    setIsSubmitting(true);

    // Имитация отправки
    setTimeout(() => {
      toast.success("Заявка на размещение баннера успешно отправлена!");
      reset();
      setIsSubmitting(false);
    }, 1000);
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.wrapper}>
        <section className={styles.section}>
          <h1 className={styles.purple}>Размещение баннера</h1>
          <Field>
            <Field.Label htmlFor="banner-name">Название баннера</Field.Label>
            <Input
              className={errors.name && styles.inputError}
              id="banner-name"
              {...register("name")}
              placeholder="Например, Акция на товары"
            />
            <Field.Error className={styles.errorText}>{errors.name?.message}</Field.Error>
          </Field>
          <Field>
            <Field.Label htmlFor="banner-url">URL для перехода</Field.Label>
            <Input
              className={errors.url && styles.inputError}
              id="banner-url"
              {...register("url")}
              placeholder="https://example.com"
            />
            <Field.Error className={styles.errorText}>{errors.url?.message}</Field.Error>
          </Field>

          <Field>
            <Field.Label htmlFor="banner-image">Изображение баннера</Field.Label>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("image", file, { shouldValidate: true });
                  setImageUrl(URL.createObjectURL(file));
                } else setValue("image", null, { shouldValidate: true });
              }}
              ref={fileInputRef}
              accept="image/png,image/jpeg"
              id="banner-image"
              className={styles.hiddenInput}
              type="file"
            />
            {image ? (
              <div className={styles.previewWrap}>
                <div className={styles.previewImageFrame}>
                  <Image fill alt="Превью баннера" className={styles.previewImage} src={imageUrl} />
                </div>
                <button
                  className={styles.removeImageButton}
                  type="button"
                  onClick={() => setValue("image", null, { shouldValidate: true })}
                >
                  <X className={styles.removeImageIcon} />
                </button>
              </div>
            ) : (
              <button
                className={styles.uploadPlaceholder}
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={styles.uploadIcon} />
                <span className={styles.uploadTitle}>Нажмите для загрузки изображения</span>
                <span className={styles.uploadHint}>PNG, JPG до 5MB</span>
              </button>
            )}
            <Field.Error className={styles.errorText}>{errors.image?.message}</Field.Error>
          </Field>
        </section>

        <section className={styles.section}>
          <h1 className={styles.green}>Место и срок размещения</h1>

          <Field>
            <Field.Label htmlFor="banner-place">Место размещения</Field.Label>

            <div className={styles.placesGrid}>
              {bannerPlaces.map((place) => (
                <button
                  key={place.id}
                  className={clsx(
                    styles.placeOption,
                    placeId === place.id ? styles.placeOptionActive : styles.placeOptionIdle,
                  )}
                  type="button"
                  onClick={() => setValue("placeId", place.id)}
                >
                  <p className={styles.placeName}>{place.name}</p>
                  <p className={styles.placeSize}>{place.size} px</p>
                  <p className={styles.placePrice}>{place.price} ₽/день</p>
                </button>
              ))}
            </div>
            <Field.Error className={styles.errorText}>{errors.placeId?.message}</Field.Error>
          </Field>

          <Field>
            <Field.Label htmlFor="banner-days">Количество дней</Field.Label>
            <Input
              id="banner-days"
              placeholder="Например, 7"
              className={errors.daysCount && styles.inputError}
              onValueChange={(value) => setValue("daysCount", Number(value))}
              onBlur={() => setValue("daysCount", daysCount, { shouldValidate: true })}
            />
            <Field.Error className={styles.errorText}>{errors.daysCount?.message}</Field.Error>
          </Field>

          <Field>
            <Field.Label htmlFor="banner-comment">Коментраий к заявке</Field.Label>
            <Textarea
              id="banner-comment"
              placeholder="Дополнительная информация..."
              className={errors.comment && styles.inputError}
              rows={6}
              {...register("comment")}
            />
            <Field.Error className={styles.errorText}>{errors.comment?.message}</Field.Error>
          </Field>
        </section>
      </div>

      <div className={styles.infoCard}>
        <Typography className={styles.infoTitle}>Требования к баннерам</Typography>
        <ul className={styles.infoList}>
          <li>Изображение должно соответствовать выбранному размеру</li>
          <li>Формат: PNG или JPG, не более 5MB</li>
          <li>Контент должен соответствовать правилам платформы</li>
          <li>После модерации баннер будет размещен автоматически</li>
        </ul>
      </div>

      <Button className={styles.button} disabled={isSubmitting} type="submit">
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  );
};
export default BannerRequestPage;
